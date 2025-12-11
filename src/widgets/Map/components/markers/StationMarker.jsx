import L from "leaflet";
import { Marker, useMap } from "react-leaflet";
import circleSvg from "@assets/mapMarkers/circleMarker.svg?raw";
import { getMarkerColorFromIndexValue } from "@shared/lib/utils/colors.js";
import { useNavigate } from "react-router";
import { useMemo, useRef, useEffect } from "react";
import StationPopup from "../popups/StationPopup.jsx";


const buildIcon = (color) =>
  L.divIcon({
    className: "station-marker",
    html: `
      <div class="station-marker__wrap" style="--marker-color:${color}">
        ${circleSvg}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  });

const StationMarker = ({
      station,
      indexValue,
      isSelected,
      isInitialUrlEntry,
}) => {
   const map = useMap();
   const markerRef = useRef(null);
   const hasOpenedForUrlEntry = useRef(false);
   const navigate = useNavigate();
   const color = getMarkerColorFromIndexValue(indexValue);
   const icon = useMemo(() => buildIcon(color), [color]);

    useEffect(() => {
      if (markerRef.current) {
        markerRef.current.options.indexValue = indexValue;
      }
    }, [indexValue]);

    // Open popup on initial URL entry only (after flyTo animation)
    useEffect(() => {
      if (!isInitialUrlEntry) return;
      if (hasOpenedForUrlEntry.current) return;

      hasOpenedForUrlEntry.current = true;
      const timer = setTimeout(() => {
        markerRef.current?.openPopup();
      }, 1800);
      return () => clearTimeout(timer);
    }, [isInitialUrlEntry]);

  return (
    <Marker
        ref={markerRef}
        position={[station.lat, station.lon]}
        icon={icon}
        eventHandlers={{
          click: (e) => {
            // Skip if this station is already selected
            if (isSelected) {
              L.DomEvent.stopPropagation(e);
              return;
            }

            navigate(`/station/${station.id}`);
            // Longer duration when zoomed out, shorter when already zoomed in
            const currentZoom = map.getZoom();
            const targetZoom = Math.max(currentZoom, 14); // Don't zoom out if already zoomed in
            const duration = currentZoom >= 12 ? 0.5 : currentZoom >= 9 ? 0.9 : 1.2;
            map.flyTo([station.lat, station.lon], targetZoom, { duration });

            // Open popup after flyTo completes using moveend event
            const onMoveEnd = () => {
              map.off('moveend', onMoveEnd);
              // Small delay to let marker settle after cluster rebuild
              setTimeout(() => {
                markerRef.current?.openPopup();
              }, 50);
            };
            map.on('moveend', onMoveEnd);
          },
          dblclick: (e) => {
            // Prevent double-click zoom on markers
            L.DomEvent.stopPropagation(e);
          },
        }}
        options={{ indexValue }}
      >
        <StationPopup
          stationId={station.id}
          stationName={station.name}
          city={station.city}
          address={station.address}
          indexValue={indexValue}
        />
      </Marker>
  );
};

export default StationMarker;
