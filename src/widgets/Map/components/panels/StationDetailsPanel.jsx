import { useEffect, useRef, useState, useContext } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks.js";
import { fetchStationDetails } from "@features/stationDetails/model/stationDetailsSlice.js";
import {
  selectDetailsForStation,
  selectDetailsStatusForStation,
} from "@features/stationDetails/model/selectors.js";
import { getMarkerColorFromIndexValue } from "@shared/lib/utils/colors.js";
import { useTranslation } from "react-i18next";
import MeasurementChart from "@widgets/MeasurementChart/MeasurementChart.jsx";
import { getThresholdPercentage } from "@shared/lib/utils/pollutantUtils.js";
import { ThemeContext } from "@app/ThemeContext.jsx";
import { Heart, Activity, ChevronDown } from "lucide-react";

const StationDetailsPanel = ({ stationId, indexValue }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const { isDark } = useContext(ThemeContext);
  const [expandedSections, setExpandedSections] = useState({
    pm10: true,
    pm25: true,
    o3: false,
    no2: false,
    so2: false,
  });
  const [showAqiInfo, setShowAqiInfo] = useState(false);
  const [showNormPercentage, setShowNormPercentage] = useState({});

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

  const getAqiRecommendations = (value) => {
    const recommendations = {
      0: { health: "legend.health_very_good", activity: "legend.activity_very_good" },
      1: { health: "legend.health_good", activity: "legend.activity_good" },
      2: { health: "legend.health_moderate", activity: "legend.activity_moderate" },
      3: { health: "legend.health_sufficient", activity: "legend.activity_sufficient" },
      4: { health: "legend.health_bad", activity: "legend.activity_bad" },
      5: { health: "legend.health_very_bad", activity: "legend.activity_very_bad" },
    };
    return recommendations[value] || null;
  };

  const getPollutantColor = (key) => {
    const colors = {
      light: {
        pm10: "#991b1b",   // dark red for light mode
        pm25: "#92400e",   // dark orange for light mode
        o3: "#713f12",     // dark yellow for light mode
        no2: "#164e63",    // dark cyan for light mode
        so2: "#4c1d95",    // dark purple for light mode
      },
      dark: {
        pm10: "#fca5a5",   // light red for dark mode
        pm25: "#fed7aa",   // light orange for dark mode
        o3: "#fef3c7",     // light yellow for dark mode
        no2: "#67e8f9",    // light cyan for dark mode
        so2: "#d8b4fe",    // light purple for dark mode
      },
    };
    return colors[isDark ? "dark" : "light"][key] || "#9ca3af";
  };

  const aqiColor = getMarkerColorFromIndexValue(indexValue);
  const aqiBgColor = { backgroundColor: aqiColor + "20", borderColor: aqiColor };
  const aqiTextColor = { color: aqiColor };
  const aqiLabel = getAqiLabel(indexValue);
  const aqiRecs = getAqiRecommendations(indexValue);

  return (
    <div className="space-y-4 text-sm text-gray-900 dark:text-gray-100">
      <div className="p-4 border rounded" style={aqiBgColor}>
        <div className="flex items-start justify-between mb-2">
          <div className="text-xs font-semibold uppercase" style={{ color: aqiColor }}>
            {t("station_popup.aqi")}
          </div>
          {aqiRecs && (
            <button
              onClick={() => setShowAqiInfo(!showAqiInfo)}
              className="flex items-center justify-center w-5 h-5 rounded-full border transition-colors cursor-pointer"
              style={{
                borderColor: aqiColor,
                color: aqiColor,
                backgroundColor: showAqiInfo ? aqiColor + "20" : "transparent"
              }}
              title={t("station_popup.aqi_info")}
            >
              <span className="text-xs font-bold">i</span>
            </button>
          )}
        </div>
        <div className="mb-2 text-3xl font-bold" style={aqiTextColor}>
          {indexValue ?? t("station_popup.no_index")}
        </div>
        <div className="text-sm font-semibold" style={aqiTextColor}>
          {t(aqiLabel)}
        </div>
        {aqiRecs && showAqiInfo && (
          <div className="space-y-2 text-xs mt-3 pt-3 border-t" style={{ borderColor: aqiColor + "40" }}>
            <div className="flex gap-2 opacity-85">
              <Heart size={14} strokeWidth={2.5} className="shrink-0 mt-0.5" style={{ color: aqiColor }} />
              <span>{t(aqiRecs.health)}</span>
            </div>
            <div className="flex gap-2 opacity-85">
              <Activity size={14} strokeWidth={2.5} className="shrink-0 mt-0.5" style={{ color: aqiColor }} />
              <span>{t(aqiRecs.activity)}</span>
            </div>
          </div>
        )}
      </div>

      {status === "loading" && (
        <div className="py-4 text-center text-gray-600 dark:text-gray-400">
          {t("station_popup.loading_measurements")}
        </div>
      )}

      {status === "succeeded" && details && (
        <style>{`
          .pollutant-content {
            overflow: hidden;
            transition: max-height 0.3s ease-out;
          }

          .pollutant-content.collapsed {
            max-height: 0;
          }

          .pollutant-content.expanded {
            max-height: 600px;
          }
        `}</style>
      )}
      {status === "succeeded" && details && (
        <div className="space-y-4">
          {/* Current Values Summary */}
          <div className="p-4 border-l-4 rounded" style={{ borderColor: aqiColor, backgroundColor: aqiColor + "08" }}>
            <div className="flex justify-between mb-3 text-xs font-semibold uppercase" style={{ color: aqiColor }}>
              {t("station_popup.latest_measurements")}
              {details.pm10 && details.pm10.length > 0 && (
                <span className="ml-2 text-xs">
                  {(() => {
                    const latestData = details.pm10[details.pm10.length - 1];
                    const date = new Date(latestData.dateString);
                    const hours = date.getHours().toString().padStart(2, "0");
                    const minutes = date.getMinutes().toString().padStart(2, "0");
                    return `${hours}:${minutes}`;
                  })()}
                </span>
              )}
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
                  const currentValue = data[data.length - 1]?.value;
                  const thresholdPercentage = getThresholdPercentage(currentValue, key);
                  const showPercent = showNormPercentage[key];
                  return (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span style={{ color: pollutantColor }}>{label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-semibold" style={{ color: pollutantColor }}>
                            {currentValue?.toFixed(1)} µg/m³
                          </span>
                          {thresholdPercentage !== null && showPercent && (
                            <span className="text-xs opacity-75" style={{ color: pollutantColor }}>
                              {thresholdPercentage}% {t("station_popup.of_norm")}
                            </span>
                          )}
                        </div>
                        {thresholdPercentage !== null && (
                          <button
                            onClick={() => setShowNormPercentage(prev => ({
                              ...prev,
                              [key]: !prev[key]
                            }))}
                            className="shrink-0 flex items-center justify-center transition-transform cursor-pointer hover:opacity-70"
                            style={{
                              color: pollutantColor,
                              transform: showPercent ? "rotate(180deg)" : "rotate(0deg)"
                            }}
                            title={t("station_popup.show_norm")}
                          >
                            <ChevronDown size={14} strokeWidth={2} />
                          </button>
                        )}
                      </div>
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
                  className="overflow-hidden border-l-4 rounded"
                  style={{ borderColor: pollutantColor, backgroundColor: pollutantColor + "08" }}
                >
                  <button
                    onClick={() => toggleSection(key)}
                    className="flex items-center justify-between w-full px-4 py-3 transition-opacity cursor-pointer hover:opacity-80"
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
                  <div
                    className={`pollutant-content ${
                      isExpanded ? "expanded" : "collapsed"
                    }`}
                  >
                    <div className="px-4 pb-3">
                      <MeasurementChart
                        measurements={data}
                        pollutantLabel={label}
                        pollutantColor={pollutantColor}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="py-4 text-center text-gray-600 dark:text-gray-400">
          {t("station_popup.no_measurements")}
        </div>
      )}
    </div>
  );
};

export default StationDetailsPanel;
