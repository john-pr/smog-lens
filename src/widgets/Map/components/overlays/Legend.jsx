import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getMarkerColorFromIndexValue } from "@shared/lib/utils/colors.js";

const expandedStyles = `
  @keyframes slideLeft {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .legend-expanded-content {
    animation: slideLeft 0.3s ease-out forwards;
  }

  .legend-closing {
    animation: slideRight 0.3s ease-out forwards;
  }
`;

const Legend = () => {
  const { t } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 300);
  };

  const legendItems = [
    { index: 0, label: "legend.very_good", range: "0-13 µg/m³" },
    { index: 1, label: "legend.good", range: "13-35 µg/m³" },
    { index: 2, label: "legend.moderate", range: "35-55 µg/m³" },
    { index: 3, label: "legend.sufficient", range: "55-150 µg/m³" },
    { index: 4, label: "legend.bad", range: "150-250 µg/m³" },
    { index: 5, label: "legend.very_bad", range: ">250 µg/m³" },
    { index: null, label: "legend.no_data", range: "-" },
  ];

  return (
    <>
      <style>{expandedStyles}</style>
      <div className="absolute bottom-40 right-2.5 z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white dark:bg-gray-700 rounded-sm border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding shadow-sm w-8.5 flex flex-col items-center justify-center gap-0 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
        >
          {legendItems.map((item) => {
            const color = getMarkerColorFromIndexValue(item.index);
            return (
              <div
                key={item.index ?? "no-data"}
                className="w-5 h-9 shrink-0"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </button>

        {(isExpanded || isClosing) && (
          <div className={`fixed bottom-40 bg-white dark:bg-gray-700 rounded-sm border-2 border-[rgba(0,0,0,0.2)] bg-clip-padding shadow-sm flex items-stretch py-1.5 pr-1.5 pl-0 ${isClosing ? 'legend-closing' : 'legend-expanded-content'}`} style={{ right: `10px` }}>
            <button
              onClick={handleClose}
              className="ml-1.5 mr-2 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
              aria-label="Close legend"
            >
              <ChevronDown className="w-4 h-4 text-gray-900 dark:text-gray-100 -rotate-90" strokeWidth={1.5} />
            </button>
            <div className="flex flex-col gap-0">
              {legendItems.map((item) => {
                const color = getMarkerColorFromIndexValue(item.index);
                return (
                  <div key={item.index ?? "no-data"} className="flex items-center gap-2 whitespace-nowrap flex-row-reverse">
                    <div
                      className="w-5 h-9 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-900 dark:text-gray-100 text-right">
                      {t(item.label)} ({item.range})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Legend;
