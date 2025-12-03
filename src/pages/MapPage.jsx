import {useEffect, useState, useCallback, useMemo} from "react";
import MapView from "../features/map/MapView.jsx";
import { useParams, Outlet } from "react-router";
import MapButton from "../features/map/ui/MapButton.jsx";
import LocationBlockedModal from "../features/map/ui/LocationBlockedModal.jsx";
import ThreeDots from "../assets/loaders/threeDots.svg?react";
import { useStationsAndIndicesBootstrap } from "../features/stations/hooks/useStationsAndIndicesBootstrap.js";
import { useIndicesForViewport } from "../features/stations/hooks/useIndicesForViewport.js";
import { useDebouncedValue } from "../app/hooks.js";

const MapPage = () => {
    const { stationId } = useParams();

    const { stations, status, error } = useStationsAndIndicesBootstrap();

    const [bbox, setBbox] = useState(null);

    const onViewPortChange = useCallback((newBbox) => {
      // Debugging 
      // console.log("[viewport] change received", newBbox);
      setBbox(newBbox);
    }, []);

    const debouncedBbox = useDebouncedValue(bbox, 500);


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
    const [geoConsent, setGeoConsent] = useState(null);
    const [isBrowserBlocked, setIsBrowserBlocked] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);

    // Load layer from local storage on mount
    useEffect(() => {
        const savedLayer = localStorage.getItem("selectedMapLayer");
        if (savedLayer) {
            setSelectedMapLayer(savedLayer);
        }
        setIsLayerReady(true);
    }, []);

    // Check browser geolocation permission on mount
    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'denied') {
                    setGeoConsent(false);
                } else if (result.state === 'granted') {
                    setGeoConsent(true);
                } else {
                    // 'prompt' state - permission not yet decided
                    setGeoConsent(null);
                }
            }).catch(() => {
                // Fallback if permissions API not available
                setGeoConsent(null);
            });
        } else {
            setGeoConsent(null);
        }
    }, []);

    const getUserLocation = (shouldZoom = false) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = [position.coords.latitude, position.coords.longitude];
                    setMapCenter(newCenter);
                    setGeoConsent(true);
                    
                    // If shouldZoom is true, we'll pass zoom info to MapView
                    if (shouldZoom) {
                        setMapCenter([...newCenter, 13]); // Include zoom level
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    if (error.code === error.PERMISSION_DENIED) {
                        setGeoConsent(false);
                        setIsBrowserBlocked(true);
                    }
                }
            );
        }
    };

    const handleBlockedModalClose = () => {
        setShowBlockedModal(false);
    };

    const handleGeoButtonClick = () => {
        if (geoConsent === false || isBrowserBlocked) {
            // Location is blocked, show instructions
            setShowBlockedModal(true);
        } else {
            // Location enabled or prompt state - try to get location and zoom
            getUserLocation(true);
        }
    };

    // Save to local storage whenever layer changes
    useEffect(() => {
        if (isLayerReady) {
            localStorage.setItem("selectedMapLayer", selectedMapLayer);
        }
    }, [selectedMapLayer, isLayerReady]);


    if (!isLayerReady) {
        return (
          <div className="flex min-h-dvh w-dvw items-center justify-center">
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

    return (
        <div className="h-screen w-screen relative">   
          {showBlockedModal && (
            <LocationBlockedModal 
              onClose={handleBlockedModalClose}
            />
          )}
          {/* <div className="absolute top-2.5 right-2.5 z-10 bg-white rounded-sm shadow-sm  w-8.5 h-8.5 flex items-center justify-center border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding">
            <MapButton
              type={selectedMapLayer === "osm" ? "satelliteLayer" : "mapLayer"}
              handleClick={() => {
                setSelectedMapLayer(selectedMapLayer === "osm" ? "sat" : "osm");
              }}
            />
          </div> */}
          <div className="absolute bottom-23 right-2.5 z-10 bg-white rounded-sm shadow-sm  w-8.5 h-8.5 flex items-center justify-center border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding">
            <MapButton
              type={geoConsent === false ? "geoLocationDisabled" : "geoLocation"}
              handleClick={handleGeoButtonClick}
            />
          </div>
          <div className="absolute bottom-32 right-2.5 z-10 bg-white rounded-sm shadow-sm  w-8.5 h-8.5 flex items-center justify-center border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding">
            <MapButton
              type={selectedMapLayer === "osm" ? "satelliteLayer" : "mapLayer"}
              handleClick={() => {
                setSelectedMapLayer(selectedMapLayer === "osm" ? "sat" : "osm");
              }}
            />
          </div>

          <MapView 
           selectedStationId={stationId} 
           selectedMapLayer={selectedMapLayer}
           center={mapCenter}
           stations={stations}
           indicesById={indicesById}
           onViewPortChange={onViewPortChange}
          />
          <Outlet />
        </div>
    );
};

export default MapPage;
