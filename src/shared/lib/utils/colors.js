
export function getMarkerColorFromIndexValue(indexValue) {
  switch (indexValue) {
    case 0: return "#1e8449"; // BARDZO DOBRY - 0-13 µg/m³ (dark green)
    case 1: return "#52be80"; // DOBRY - 13-35 µg/m³ (light green)
    case 2: return "#f4d03f"; // UMIARKOWANY - 35-55 µg/m³ (yellow)
    case 3: return "#f39c12"; // DOSTATECZNY - 55-150 µg/m³ (orange)
    case 4: return "#e74c3c"; // ZŁY - 150-250 µg/m³ (red)
    case 5: return "#a93226"; // BARDZO ZŁY - >250 µg/m³ (dark red)
    default: return "#95a5a6"; // brak indeksu (szary)
  }
}
