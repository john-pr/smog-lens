export function getMarkerColor(aqiClass) {
  switch (aqiClass) {
    case "VERY_GOOD": return "#2ecc71";
    case "GOOD": return "#27ae60";
    case "MODERATE": return "#f1c40f";
    case "SUFFICIENT": return "#e67e22";
    case "BAD": return "#e74c3c";
    case "VERY_BAD": return "#8e44ad";
    default: return "#1e88e5"; 
  }
}
