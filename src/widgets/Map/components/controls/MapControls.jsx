import MapButton from "./MapButton.jsx";
import Legend from "../overlays/Legend.jsx";
import LanguageSwitcher from "../overlays/LanguageSwitcher.jsx";
import { useTheme } from "@app/hooks";

const FloatingBtn = ({ className, children, handleClick }) => (
  <button
    className={
      "z-10 w-8.5 h-8.5 flex items-center justify-center rounded-sm bg-clip-padding shadow-sm border-2 cursor-pointer " +
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

const MapControls = ({ geoConsent, handleGeoButtonClick, selectedMapLayer, setSelectedMapLayer }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* Top controls */}
      <div className="absolute top-2.5 right-2.5 flex flex-row gap-1.25">
        <LanguageSwitcher />
        <FloatingBtn
         handleClick={toggleTheme}>
          <MapButton
            type={isDark ? "darkTheme" : "lightTheme"}
          />
        </FloatingBtn>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-24 right-2.5 flex flex-col gap-1.25">
        <Legend />
        <FloatingBtn
          handleClick={handleGeoButtonClick}>
          <MapButton
            type={geoConsent === false ? "geoLocationDisabled" : "geoLocation"}
          />
        </FloatingBtn>

        <FloatingBtn
          handleClick={() =>
              setSelectedMapLayer(selectedMapLayer === "osm" ? "sat" : "osm")
            }>
          <MapButton
            type={selectedMapLayer === "osm" ? "satelliteLayer" : "mapLayer"}
          />
        </FloatingBtn>
      </div>
    </>
  );
}

export default MapControls;
