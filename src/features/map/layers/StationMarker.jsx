import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import circleSvg from "../../../assets/mapMarkers/circleMarker.svg?raw";
import { getMarkerColor } from "../utils/colors.js";
import { useNavigate } from "react-router";

const buildIcon = (color) =>
  L.divIcon({
    className: "station-marker",
    html: `
      <div class="station-marker__wrap" style="--marker-color:${color}">
        ${circleSvg}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  });

const StationMarker = ({
  station,
  aqiClass,
  onMarkerClick,
}) => {
  const navigate = useNavigate();
  const color = getMarkerColor(aqiClass);
  const icon = buildIcon(color);

  return (
    <Marker
      position={[station.lat, station.lon]}
      icon={icon}
      eventHandlers={{
        click: () => {
          navigate(`/station/${station.id}`);
          if (onMarkerClick) onMarkerClick(station.id);
        },
      }}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-semibold">{station.name}</div>
          <div>{station.city ?? "—"}</div>
          <div>{station.address ?? "—"}</div>
          {/* Additional station details can be added here */}
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
