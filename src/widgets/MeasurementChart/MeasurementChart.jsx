import { useContext, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ThemeContext } from "@app/ThemeContext.jsx";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MeasurementChart = ({ measurements, pollutantLabel, pollutantColor = "#3b82f6" }) => {
  const { isDark } = useContext(ThemeContext);
  const { t } = useTranslation("common");

  const chartData = useMemo(() => {
    // Format labels to show just time (HH:MM)
    const labels = measurements.map((m) => {
      const date = new Date(m.dateString);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    // Values for the bar chart
    const data = measurements.map((m) => m.value);

    // Create border colors array - highlight the last (most recent) data point with white
    const borderColors = measurements.map((_, index) =>
      index === measurements.length - 1 ? "#ffffff" : pollutantColor
    );
    const borderWidths = measurements.map((_, index) =>
      index === measurements.length - 1 ? 2 : 1
    );

    return {
      labels,
      datasets: [
        {
          label: `${pollutantLabel} (µg/m³)`,
          data,
          backgroundColor: pollutantColor,
          borderColor: borderColors,
          borderWidth: borderWidths,
          borderRadius: 4,
          hoverBackgroundColor: isDark
            ? `${pollutantColor}dd`
            : `${pollutantColor}cc`,
        },
      ],
    };
  }, [measurements, pollutantLabel, pollutantColor, isDark]);

  const options = useMemo(() => {
    const textColor = isDark ? "#e5e7eb" : "#111827";
    const gridColor = isDark ? "#374151" : "#f3f4f6";
    const backgroundColor = isDark ? "#1f2937" : "#ffffff";

    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "x",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: `${backgroundColor}e6`,
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: gridColor,
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: (context) => {
              if (!context || context.length === 0) return "";
              const index = context[0].dataIndex;
              const measurement = measurements[index];
              const date = new Date(measurement.dateString);
              return date.toLocaleString();
            },
            label: (context) => {
              return `${context.parsed.y.toFixed(1)} µg/m³`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 11,
              weight: 500,
            },
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 11,
            },
          },
          title: {
            display: false,
          },
        },
      },
    };
  }, [isDark, measurements]);

  return (
    <div className="relative w-full" style={{ height: "196px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MeasurementChart;
