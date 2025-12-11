import L from "leaflet";
import { getMarkerColorFromIndexValue } from "./colors.js";


function getDominantIndexValue(childMarkers) {
  const validIndices = [];

  childMarkers.forEach((marker) => {
    const v = marker.options.indexValue;

    if (v === null || v === undefined) return;
    if (typeof v === 'number' && v < 0) return;

    validIndices.push(v);
  });

  if (validIndices.length === 0) return null;

  // Return the worst (highest) index value to represent the worst air quality in cluster
  return Math.max(...validIndices);
}

export function createClusterIcon(cluster) {
  const children = cluster.getAllChildMarkers();

  const dominantIndexValue = getDominantIndexValue(children);

  // If no dominant index value (indices loading), use a neutral color
  // getDominantIndexValue returns null when:
  // 1) no markers with valid indices exist yet (indices still loading)
  // 2) all markers have null/undefined indexValue
  const color = getMarkerColorFromIndexValue(dominantIndexValue);
  const count = cluster.getChildCount();

  return L.divIcon({
    html: `
      <div class="cluster-bubble" style="--cluster-color:${color}">
        ${count}
      </div>
    `,
    className: "cluster-icon",
    iconSize: [36, 36],
  });
}
