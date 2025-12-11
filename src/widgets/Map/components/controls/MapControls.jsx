import MapButton from "./MapButton.jsx";
import Legend from "../overlays/Legend.jsx";

const FloatingBtn = ({ className, children, handleClick }) => (
  <button
    className={
      "absolute right-2.5 z-10 w-8.5 h-8.5 flex items-center justify-center rounded-sm bg-clip-padding shadow-sm border-2 cursor-pointer " +
      "bg-white border-[rgba(0,0,0,0.2)] " +
      "hover:bg-gray-100 " +
      "dark:bg-gray-700 dark:hover:bg-gray-600 " +
      className
    }
    type="button"
    onClick={handleClick}
  >
    {children}
  </button>
);

const MapControls = props => {
  const { isDark, toggleTheme, geoConsent, handleGeoButtonClick, selectedMapLayer, setSelectedMapLayer } = props

  return (
    <>
      <Legend />

      <FloatingBtn
       className="top-2.5"
       handleClick={toggleTheme}>
        <MapButton
          type={isDark ? "darkTheme" : "lightTheme"}

        />
      </FloatingBtn>

      <FloatingBtn
        className="bottom-23"
        handleClick={handleGeoButtonClick}>
        <MapButton
          type={geoConsent === false ? "geoLocationDisabled" : "geoLocation"}
        />
      </FloatingBtn>

      <FloatingBtn
        className="bottom-32"
        handleClick={() =>
            setSelectedMapLayer(selectedMapLayer === "osm" ? "sat" : "osm")
          }>
        <MapButton
          type={selectedMapLayer === "osm" ? "satelliteLayer" : "mapLayer"}
        />
      </FloatingBtn>
    </>
  );
}

export default MapControls;
