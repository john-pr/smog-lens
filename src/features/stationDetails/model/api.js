import { showErrorToast } from "@app/ToastContext";

const BASE = "/gios/pjp-api/v1/rest";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    showErrorToast({
      statusCode: res.status,
      description: res.statusText,
    });
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const stationDetailsApi = {
  fetchSensors: (stationId) =>
    getJson(`${BASE}/station/sensors/${stationId}`),

  fetchSensorData: (sensorId) =>
    getJson(`${BASE}/data/getData/${sensorId}`),
};
