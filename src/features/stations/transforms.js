export function transformStation(rawStation) {
  const id = rawStation["Identyfikator stacji"];
  const name = rawStation["Nazwa stacji"];
  const lat = rawStation["WGS84 φ N"];
  const lon = rawStation["WGS84 λ E"];
  const city = rawStation["Nazwa miasta"];
  const street = rawStation["Ulica"];
  const voivodeship = rawStation["Województwo"];
  const code = rawStation["Kod stacji"];

  return {
    id: String(id),
    name: name ?? "—",
    lat: Number(lat),
    lon: Number(lon),
    city: city ?? null,
    address: street ?? null,
    voivodeship: voivodeship ?? null,
    code: code ?? null,
  };
}

export function transformStationsList(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(transformStation);
}
