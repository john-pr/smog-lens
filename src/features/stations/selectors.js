export const selectStationsState = (state) => state.stations;

export const selectStationsList = (state) => state.stations.list;

export const selectStationsById = (state) => state.stations.byId;

export const selectStationsStatus = (state) => state.stations.status;

export const selectStationsError = (state) => state.stations.error;

export const selectStationById = (state, stationId) => state.stations.byId[stationId];
