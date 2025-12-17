import MarkerClusterGroup from "react-leaflet-cluster";
import { useMap, Circle } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import StationMarker from "../components/markers/StationMarker.jsx";
import { createClusterIcon } from "@shared/lib/utils/clusterIcon.js";
import { extractUsableIndexValue } from "@shared/lib/utils/extractIndexValue.js";
import { getMarkerColorFromIndexValue } from "@shared/lib/utils/colors.js";

const StationsClusterLayer = ({
  stations,
  indicesById,
  selectedStationId,
  isInitialUrlEntry,
  selectedStationCircleData,
}) => {
  const map = useMap();
  const clusterGroupRef = useRef(null);


  const handleClusterClick = (cluster) => {
    const bounds = cluster.layer.getBounds();
    const currentZoom = map.getZoom();
    const duration = currentZoom >= 12 ? 0.5 : currentZoom >= 9 ? 0.75 : 1;
    map.flyToBounds(bounds, { duration, padding: [50, 50] });
  };

  // When indices load, rebuild cluster icons since they depend on indexValue
  useEffect(() => {
    if (clusterGroupRef.current && Object.keys(indicesById).length > 0) {
      clusterGroupRef.current.refreshClusters();
    }
  }, [indicesById]);

  // Find selected station and its color
  const selectedStation = selectedStationId ? stations.find(s => String(s.id) === selectedStationId) : null;
  const selectedIndexData = selectedStation ? indicesById?.[selectedStation.id] : null;
  const selectedColor = selectedStation ? getMarkerColorFromIndexValue(extractUsableIndexValue(selectedIndexData)) : null;

  // State for showing circle after animation completes
  const [showCircle, setShowCircle] = useState(false);

  useEffect(() => {
    if (selectedStation) {
      setShowCircle(false);

      // Show circle when map finishes moving, but only if zoom is past clustering threshold
      const onMoveEnd = () => {
        if (map.getZoom() >= 11) {
          setShowCircle(true);
        } else {
          setShowCircle(false);
        }
      };

      map.on('moveend', onMoveEnd);
      return () => {
        map.off('moveend', onMoveEnd);
      };
    } else {
      setShowCircle(false);
    }
  }, [selectedStationId, map]);

  return (
    <>
      <MarkerClusterGroup
        ref={clusterGroupRef}
        chunkedLoading
        chunkInterval={200}
        chunkDelay={50}
        removeOutsideVisibleBounds
        animate={false}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        maxClusterRadius={40}
        disableClusteringAtZoom={14}
        zoomToBoundsOnClick={false}
        iconCreateFunction={createClusterIcon}
        eventHandlers={{
          clusterclick: handleClusterClick,
        }}
      >
       {stations.map((station) => {
          const indexData = indicesById?.[station.id];
          const usableIndexValue = extractUsableIndexValue(indexData);

          return (
            <StationMarker
              key={station.id}
              station={station}
              indexValue={usableIndexValue}
              isSelected={String(station.id) === selectedStationId}
              isInitialUrlEntry={isInitialUrlEntry && String(station.id) === selectedStationId}
            />
          );
        })}
      </MarkerClusterGroup>

      {selectedStation && selectedColor && showCircle && (
        <Circle
          key={`circle-${selectedStationId}`}
          center={[selectedStation.lat, selectedStation.lon]}
          radius={2000}
          pathOptions={{
            color: selectedColor,
            weight: 2,
            opacity: 0.7,
            fill: true,
            fillColor: selectedColor,
            fillOpacity: 0.2,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}
    </>
  );
};

export default StationsClusterLayer;
