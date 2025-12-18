import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { giosApi } from "./api.js";

import { transformStationsList } from "./transforms.js";

const CACHE_KEY = "gios_stations_page0_v1";
//time to live
const TTL_MS = 60 * 60 * 1000; // 1h

function loadCache(options = {}) {
  const allowExpired = options.allowExpired === true;

  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!raw) return null;

    const age = Date.now() - raw.timestamp;

    if (!allowExpired && age > TTL_MS) {
      return null;
    }

    return raw.data;
  } catch {
    return null;
  }
}

function saveCache(data) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), data })
  );
}

export const fetchStations = createAsyncThunk(
  "stations/fetchStations",
  async (_, { rejectWithValue }) => {
    try {
      const cachedFresh = loadCache();
      if (cachedFresh) return cachedFresh;

      const response = await giosApi.fetchStationsOnce(500);

      const rawStations =
        response["Lista stacji pomiarowych"] ??
        (Object.values(response).find(v => Array.isArray(v)) ?? []);

      const mapped = transformStationsList(rawStations);

      saveCache(mapped);
      return mapped;
    } catch (e) {
      const cachedEvenIfExpired = loadCache({ allowExpired: true });
      if (cachedEvenIfExpired) return cachedEvenIfExpired;

      return rejectWithValue(e.message);
    }
  }
);

const stationsSlice = createSlice({
  name: "stations",
  initialState: {
    list: [],
    byId: {},
    status: "idle",
    error: null,
    fetchedAt: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStations.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(fetchStations.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.list = action.payload;
      state.byId = Object.fromEntries(action.payload.map(x => [x.id, x]));
      state.fetchedAt = Date.now();
    });

    builder.addCase(fetchStations.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    });
  },
});

export default stationsSlice.reducer;
