import StationMarker from "./StationMarker.jsx";

const StationsLayer = ({
  stations,
  indicesById,
}) => {
  return (
    <>
      {stations.map((station) => {
        const indexData = indicesById?.[station.id];
        const aqiClass = indexData?.["Klasa indeksu"] 
          ?? indexData?.stIndexLevel?.indexLevelName
          ?? null;

        return (
          <StationMarker
            key={station.id}
            station={station}
            aqiClass={aqiClass}
          />
        );
      })}
    </>
  );
};

export default StationsLayer;
