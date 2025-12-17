import { useState, useEffect } from "react";
import { useAppSelector } from "@app/hooks.js";
import { selectStationById } from "@features/stations/model/selectors.js";
import { extractUsableIndexValue } from "@shared/lib/utils/extractIndexValue.js";
import { useNavigate } from "react-router";
import StationDetailsPanel from "./StationDetailsPanel";

const panelAnimationStyles = `
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutLeft {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  .panel-entering {
    animation: slideInLeft 0.3s ease-out forwards;
  }

  .panel-exiting {
    animation: slideOutLeft 0.3s ease-out forwards;
  }

  .panel-scrollable::-webkit-scrollbar {
    width: 8px;
  }

  .panel-scrollable::-webkit-scrollbar-track {
    background: transparent;
  }

  .panel-scrollable::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.6);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  .panel-scrollable::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.8);
    background-clip: content-box;
  }

  .dark .panel-scrollable::-webkit-scrollbar-thumb {
    background-color: rgba(75, 85, 99, 0.6);
    background-clip: content-box;
  }

  .dark .panel-scrollable::-webkit-scrollbar-thumb:hover {
    background-color: rgba(55, 65, 81, 0.8);
    background-clip: content-box;
  }
`;

const LeftPanel = ({ stationId, indicesById }) => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const station = useAppSelector((state) =>
    selectStationById(state, stationId)
  );

  // Reset exiting state when station changes
  useEffect(() => {
    setIsExiting(false);
  }, [stationId]);

  // Don't show panel if no station is selected
  if (!stationId || !station) {
    return null;
  }

  const indexData = indicesById?.[stationId];
  const indexValue = extractUsableIndexValue(indexData);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return (
    <>
      <style>{panelAnimationStyles}</style>
      <div className={`absolute top-0 left-0 z-40 h-screen overflow-y-auto bg-white bg-clip-padding w-80 dark:bg-gray-700 border-r-2 border-[rgba(0,0,0,0.2)] shadow-sm panel-scrollable ${isExiting ? 'panel-exiting' : 'panel-entering'}`}>
      <div className="sticky top-0 z-50 p-6 bg-white border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-gray-900 truncate dark:text-white">
              {station.name}
            </div>
            {/* {(station.city || station.address) && (
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {[station.city, station.address].filter(Boolean).join(" · ")}
              </div>
            )} */}
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-900 transition-colors rounded hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0 dark:text-gray-300 cursor-pointer"
            aria-label="Close panel"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-6">
        <StationDetailsPanel
          stationId={stationId}
          indexValue={indexValue}
        />
      </div>
      </div>
    </>
  );
};

export default LeftPanel;
