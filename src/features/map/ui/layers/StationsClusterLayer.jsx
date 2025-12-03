import MarkerClusterGroup from "react-leaflet-cluster";
import StationMarker from "./StationMarker.jsx";
import { createClusterIcon } from "../../utils/clusterIcon.js";
import { extractUsableIndexValue } from "../../utils/extractIndexValue.js";

const StationsClusterLayer = ({
  stations,
  indicesById,
  onMarkerClick,
}) => {

  return (
    <MarkerClusterGroup
      chunkedLoading
      chunkInterval={200}
      chunkDelay={50}
      removeOutsideVisibleBounds
      animate={false}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
      maxClusterRadius={40}
      disableClusteringAtZoom={14}
      iconCreateFunction={createClusterIcon}
    >
     {stations.map((station) => {
        const indexData = indicesById?.[station.id];
        const usableIndexValue = extractUsableIndexValue(indexData);

        return (
          <StationMarker
            key={station.id}
            station={station}
            indexValue={usableIndexValue}  
            onMarkerClick={onMarkerClick}
          />
        );
      })}
    </MarkerClusterGroup>
  );
};

export default StationsClusterLayer;
