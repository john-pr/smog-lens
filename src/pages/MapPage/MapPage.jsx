import {useEffect, useState, useCallback, useMemo} from "react";
import MapView from "@widgets/Map/MapView";
import { useParams, Outlet } from "react-router";
import LocationBlockedModal from "@widgets/Map/components/modals/LocationBlockedModal.jsx";
import ThreeDots from "@assets/loaders/threeDots.svg?react";
import { useStationsAndIndicesBootstrap } from "@features/stations/hooks/useStationsAndIndicesBootstrap";
import { useIndicesForViewport } from "@features/stations/hooks/useIndicesForViewport";
import { useDebouncedValue } from "@app/hooks";
import { useThrottledCallback } from "@shared/lib/hooks/useThrottledCallback";
import MapControls from "@widgets/Map/components/controls/MapControls.jsx";
import { LeftPanel } from "@widgets/Map/components/panels";

const EPS = 1e-5;

const MapPage = () => {
    const { stationId } = useParams();
    const { stations = [], status, error } = useStationsAndIndicesBootstrap();

    //bbox - bounding box of current viewport
    const [bbox, setBbox] = useState(null);
    const debouncedBbox = useDebouncedValue(bbox, 500);

    //compares two bounding boxes with tolerance
    const sameBbox = useCallback((a, b) => {
      if (!a || !b) return false;
      return (
        Math.abs(a.minLat - b.minLat) < EPS &&
        Math.abs(a.maxLat - b.maxLat) < EPS &&
        Math.abs(a.minLon - b.minLon) < EPS &&
        Math.abs(a.maxLon - b.maxLon) < EPS
      );
    }, []);

    const handleViewportChange = useCallback((newBbox) => {
      setBbox(prev => (sameBbox(prev, newBbox) ? prev : newBbox));
    }, [sameBbox]);

    const onViewPortChange = useThrottledCallback(handleViewportChange, 200);
    


    const stationsInView = useMemo(() => {
      if (!debouncedBbox) return [];

      return stations.filter((s) =>
        s.lat >= debouncedBbox.minLat &&
        s.lat <= debouncedBbox.maxLat &&
        s.lon >= debouncedBbox.minLon &&
        s.lon <= debouncedBbox.maxLon
      );
    }, [stations, debouncedBbox]);

    //Debugging
    //   useEffect(() => {
    //   if (!bbox) return;
    //   const ids = stationsInView.map(s => s.id);
    //   console.log("[viewport] stationsInView count:", ids.length);
    //   console.log("[viewport] stationsInView ids:", ids.slice(0, 50)); // nie spamuj całymi 500
    // }, [bbox, stationsInView]);

    const indicesById = useIndicesForViewport(stationsInView);

    const [selectedMapLayer, setSelectedMapLayer] = useState(() => {
        // Initialize from local storage or default to "osm"
        const savedLayer = localStorage.getItem("selectedMapLayer");
        return savedLayer || "osm";
    });
    
    const [isLayerReady, setIsLayerReady] = useState(false);
    const [mapCenter, setMapCenter] = useState([52.23, 21]); // Default: Warsaw
    const [mapZoom, setMapZoom] = useState(13);
    const [geoConsent, setGeoConsent] = useState(null);
    const [isBrowserBlocked, setIsBrowserBlocked] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);

    // Capture initial stationId from URL (only on first render)
    const [initialStationId] = useState(() => stationId);

    // Compute initial center/zoom for station from URL
    const initialStationTarget = useMemo(() => {
        if (!initialStationId) return null;
        if (status !== "succeeded" || !stations.length) return null;

        const station = stations.find(s => String(s.id) === initialStationId);
        if (station) {
            return { center: [station.lat, station.lon], zoom: 15 };
        }
        return null;
    }, [initialStationId, stations, status]);

    // Effective center/zoom: use URL station target if available, otherwise user state
    const effectiveCenter = initialStationTarget?.center ?? mapCenter;
    const effectiveZoom = initialStationTarget?.zoom ?? mapZoom;

    // Compute circle data for selected station (not currently used - circle is disabled)
    const selectedStationCircleData = null;

    // Load layer from local storage on mount
    useEffect(() => {
        const savedLayer = localStorage.getItem("selectedMapLayer");
        if (savedLayer) {
            setSelectedMapLayer(savedLayer);
        }
        setIsLayerReady(true);

        // Initialize geoConsent as null (prompt state) - don't query permissions on mount
        // iOS Safari requires user gesture before showing permission prompt
        setGeoConsent(null);
        setIsBrowserBlocked(false);
    }, []);

    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };

    const redirectToIOSSettings = () => {
        // On iOS, we can't directly open Settings from Safari
        // Show a modal with instructions instead
        setShowBlockedModal(true);
    };

    const getUserLocation = (shouldZoom = false) => {
        console.log("getUserLocation called. IsIOS:", isIOS(), "HTTPS:", window.location.protocol === 'https:');

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Location success:", position.coords);
                    const newCenter = [position.coords.latitude, position.coords.longitude];
                    setMapCenter(newCenter);
                    setGeoConsent(true);

                    // If shouldZoom is true, we'll pass zoom info to MapView
                    if (shouldZoom) setMapZoom(13);
                },
                (error) => {
                    console.error("Geolocation error code:", error.code);
                    console.error("Error getting location:", error);

                    if (error.code === error.PERMISSION_DENIED) {
                        console.error("Location permission was DENIED by user");
                        setGeoConsent(false);
                        setIsBrowserBlocked(true);

                        // On iOS, show modal with instructions
                        if (isIOS()) {
                            redirectToIOSSettings();
                        }
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        console.error("Position unavailable - device may not have GPS or signal");
                    } else if (error.code === error.TIMEOUT) {
                        console.error("Geolocation request timed out");
                    }
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.warn("Geolocation is not supported in this browser");
        }
    };

    const handleBlockedModalClose = () => {
        setShowBlockedModal(false);
    };

    const handleGeoButtonClick = () => {
        console.log("handleGeoButtonClick - geoConsent:", geoConsent, "isBrowserBlocked:", isBrowserBlocked);

        if (geoConsent === false || isBrowserBlocked) {
            // Location is blocked, show instructions modal
            console.log("Location is blocked, showing modal");
            setShowBlockedModal(true);
        } else {
            // Location enabled or prompt state - try to get location and zoom
            console.log("Calling getUserLocation");
            getUserLocation(true);
        }
    };

    // Save to local storage whenever layer changes
    useEffect(() => {
        if (isLayerReady) {
            localStorage.setItem("selectedMapLayer", selectedMapLayer);
        }
    }, [selectedMapLayer, isLayerReady]);


    if (!isLayerReady || status === "loading") {
        return (
          <div className="flex min-h-dvh w-dvw items-center justify-center bg-gray-800">
            <ThreeDots
              className="
                w-[12vw] max-w-14 min-w-6
                aspect-60/16 h-auto
                text-blue-500
              "
            />
          </div>
        )
    }

    if (status === "failed") return <></>;

    return (
        <div className="h-dvh w-dvw relative" style={{ height: '100dvh', width: '100dvw' }}>
          {showBlockedModal && (
            <LocationBlockedModal
              onClose={handleBlockedModalClose}
            />
          )}
          {/* Debug overlay */}
          <div className="fixed bottom-2.5 left-2.5 bg-black/80 text-white text-xs p-2 rounded max-w-xs z-50 font-mono">
            <div>geoConsent: {JSON.stringify(geoConsent)}</div>
            <div>isBrowserBlocked: {isBrowserBlocked}</div>
            <div>isIOS: {isIOS()}</div>
            <div>protocol: {window.location.protocol}</div>
          </div>
          <LeftPanel stationId={stationId} indicesById={indicesById} />
          <MapControls
            geoConsent={geoConsent}
            handleGeoButtonClick={handleGeoButtonClick}
            selectedMapLayer={selectedMapLayer}
            setSelectedMapLayer={setSelectedMapLayer}
          />
          <MapView
           selectedStationId={stationId}
           selectedMapLayer={selectedMapLayer}
           center={effectiveCenter}
           stations={stations}
           indicesById={indicesById}
           onViewPortChange={onViewPortChange}
           zoom={effectiveZoom}
           flyToStation={!!initialStationTarget}
           isPanelOpen={!!stationId}
           selectedStationCircleData={selectedStationCircleData}
          />
          <Outlet />
        </div>
    );
};

export default MapPage;
