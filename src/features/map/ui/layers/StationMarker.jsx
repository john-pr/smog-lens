import L from "leaflet";
import { Marker } from "react-leaflet";
import circleSvg from "../../../../assets/mapMarkers/circleMarker.svg?raw";
import { getMarkerColorFromIndexValue } from "../../utils/colors.js";
import { useNavigate } from "react-router";
import { useMemo, useRef, useEffect } from "react";
import StationPopup from "../StationPopup.jsx";

const cleanSvg = circleSvg
  .replace(/<\?xml.*?\?>/g, "")
  .replace(/<!DOCTYPE.*?>/g, "");

const buildIcon = (color) =>
  L.divIcon({
    className: "station-marker",
    html: `
      <div class="station-marker__wrap" style="--marker-color:${color}">
        ${cleanSvg}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  });

const StationMarker = ({
  station,
  indexValue,
  onMarkerClick,
}) => {

   const markerRef = useRef(null);
   const navigate = useNavigate();
   const color = getMarkerColorFromIndexValue(indexValue);
   const icon = useMemo(() => buildIcon(color), [color]);

    useEffect(() => {
      if (markerRef.current) {
        markerRef.current.options.indexValue = indexValue; 
      }
    }, [indexValue]);

  return (
    <Marker
      ref={markerRef}
      position={[station.lat, station.lon]}
      icon={icon}
      eventHandlers={{
        click: () => {
          navigate(`/station/${station.id}`);
          if (onMarkerClick) onMarkerClick(station.id);
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
