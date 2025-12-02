const BASE = "/gios/pjp-api/v1/rest";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const giosApi = {
  base: BASE,
  fetchStationsOnce: (size = 500) => getJson(`${BASE}/station/findAll?page=0&size=${size}`),
  fetchStationsFirstPage: () => getJson(`${BASE}/station/findAll?page=0&size=20`),
  fetchByUrl: (url) => getJson(url),
  fetchStationsPage: (page = 0, size = 200) => getJson(`${BASE}/station/findAll?page=${page}&size=${size}`),
  fetchIndexByStationId: (id) => getJson(`${BASE}/aqindex/getIndex/${id}`),
  fetchSensorsByStationId: (id) => getJson(`${BASE}/station/sensors/${id}`),
  fetchLatestBySensorId: (id) => getJson(`${BASE}/data/getData/${id}`),
};
