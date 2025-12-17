import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks.js";
import { fetchStationDetails } from "@features/stationDetails/model/stationDetailsSlice.js";
import {
  selectDetailsForStation,
  selectDetailsStatusForStation,
} from "@features/stationDetails/model/selectors.js";
import { getMarkerColorFromIndexValue } from "@shared/lib/utils/colors.js";
import { useTranslation } from "react-i18next";
import MeasurementChart from "@widgets/MeasurementChart/MeasurementChart.jsx";

const StationDetailsPanel = ({ stationId, indexValue }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const [expandedSections, setExpandedSections] = useState({
    pm10: true,
    pm25: true,
    o3: false,
    no2: false,
    so2: false,
  });

  const details = useAppSelector((state) =>
    selectDetailsForStation(state, stationId)
  );
  const status = useAppSelector((state) =>
    selectDetailsStatusForStation(state, stationId)
  );

  const fetchedOnceRef = useRef(false);

  useEffect(() => {
    fetchedOnceRef.current = false;
  }, [stationId]);

  useEffect(() => {
    if (!stationId) return;
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    if (status === "idle" || status === "failed") {
      dispatch(fetchStationDetails(stationId));
    }
  }, [stationId, status, dispatch]);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getAqiLabel = (value) => {
    switch (value) {
      case 0: return "legend.very_good";
      case 1: return "legend.good";
      case 2: return "legend.moderate";
      case 3: return "legend.sufficient";
      case 4: return "legend.bad";
      case 5: return "legend.very_bad";
      default: return "legend.no_data";
    }
  };

  const getPollutantColor = (key) => {
    // Distinct, pleasing colors for each pollutant type
    const colors = {
      pm10: "#dc2626",   // vibrant red
      pm25: "#ea580c",   // vibrant orange
      o3: "#ca8a04",     // golden yellow
      no2: "#0891b2",    // vibrant cyan
      so2: "#7c3aed",    // vibrant purple
    };
    return colors[key] || "#9ca3af";
  };

  const aqiColor = getMarkerColorFromIndexValue(indexValue);
  const aqiBgColor = { backgroundColor: aqiColor + "20", borderColor: aqiColor };
  const aqiTextColor = { color: aqiColor };
  const aqiLabel = getAqiLabel(indexValue);

  return (
    <div className="space-y-4 text-sm text-gray-900 dark:text-gray-100">
      <div className="p-4 rounded border" style={aqiBgColor}>
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: aqiColor }}>
          {t("station_popup.aqi")}
        </div>
        <div className="text-3xl font-bold mb-2" style={aqiTextColor}>
          {indexValue ?? t("station_popup.no_index")}
        </div>
        <div className="text-sm font-semibold" style={aqiTextColor}>
          {t(aqiLabel)}
        </div>
      </div>

      {status === "loading" && (
        <div className="text-gray-600 dark:text-gray-400 text-center py-4">
          {t("station_popup.loading_measurements")}
        </div>
      )}

      {status === "succeeded" && details && (
        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              max-height: 0;
              overflow: hidden;
            }
            to {
              opacity: 1;
              max-height: 500px;
              overflow: visible;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 1;
              max-height: 500px;
              overflow: visible;
            }
            to {
              opacity: 0;
              max-height: 0;
              overflow: hidden;
            }
          }

          .chart-content-enter {
            animation: slideDown 0.3s ease-out forwards;
          }

          .chart-content-exit {
            animation: slideUp 0.2s ease-in forwards;
          }
        `}</style>
      )}
      {status === "succeeded" && details && (
        <div className="space-y-4">
          {/* Current Values Summary */}
          <div className="rounded border-l-4 p-4" style={{ borderColor: aqiColor, backgroundColor: aqiColor + "08" }}>
            <div className="text-xs font-semibold uppercase mb-3" style={{ color: aqiColor }}>
              {t("station_popup.current_values")}
            </div>
            <div className="space-y-2">
              {[
                { key: "pm10", label: t("station_popup.pm10"), data: details.pm10 },
                { key: "pm25", label: t("station_popup.pm25"), data: details.pm25 },
                { key: "o3", label: t("station_popup.o3"), data: details.o3 },
                { key: "no2", label: t("station_popup.no2"), data: details.no2 },
                { key: "so2", label: t("station_popup.so2"), data: details.so2 },
              ]
                .filter(({ data }) => data && data.length > 0)
                .map(({ key, label, data }) => {
                  const pollutantColor = getPollutantColor(key);
                  return (
                    <div key={key} className="flex justify-between items-center text-xs">
                      <span style={{ color: pollutantColor }}>{label}</span>
                      <span className="font-semibold" style={{ color: pollutantColor }}>
                        {data[data.length - 1]?.value?.toFixed(1)} µg/m³
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-2">
            {[
              { key: "pm10", label: t("station_popup.pm10"), data: details.pm10 },
              { key: "pm25", label: t("station_popup.pm25"), data: details.pm25 },
              { key: "o3", label: t("station_popup.o3"), data: details.o3 },
              { key: "no2", label: t("station_popup.no2"), data: details.no2 },
              { key: "so2", label: t("station_popup.so2"), data: details.so2 },
            ]
              .filter(({ data }) => data && data.length > 0)
              .map(({ key, label, data }) => {
              const isExpanded = expandedSections[key];
              const pollutantColor = getPollutantColor(key);
              return (
                <div
                  key={key}
                  className="rounded border-l-4 overflow-hidden transition-all duration-200"
                  style={{ borderColor: pollutantColor, backgroundColor: pollutantColor + "08" }}
                >
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <div className="text-xs font-semibold uppercase" style={{ color: pollutantColor }}>
                      {label}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "-rotate-180" : ""}`}
                      style={{ color: pollutantColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3 chart-content-enter">
                      <MeasurementChart
                        measurements={data}
                        pollutantLabel={label}
                        pollutantColor={aqiColor}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="text-gray-600 dark:text-gray-400 text-center py-4">
          {t("station_popup.no_measurements")}
        </div>
      )}
    </div>
  );
};

export default StationDetailsPanel;
