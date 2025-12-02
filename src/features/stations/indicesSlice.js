import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { giosApi } from "./api.js";

export const fetchIndexByStationId = createAsyncThunk(
  "indices/fetchIndexByStationId",
  async (stationId, { rejectWithValue }) => {
    try {
      const data = await giosApi.fetchIndexByStationId(stationId);
      return { stationId, data };
    } catch (e) {
      return rejectWithValue({ stationId, message: e.message });
    }
  }
);

const indicesSlice = createSlice({
  name: "indices",
  initialState: {
    byStationId: {},
    statusByStationId: {},
    errorByStationId: {},
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIndexByStationId.pending, (state, action) => {
      const id = action.meta.arg;
      state.statusByStationId[id] = "loading";
      state.errorByStationId[id] = null;
    });
    b.addCase(fetchIndexByStationId.fulfilled, (state, action) => {
      const { stationId, data } = action.payload;
      state.byStationId[stationId] = data ?? null;
      state.statusByStationId[stationId] = "succeeded";
    });
    b.addCase(fetchIndexByStationId.rejected, (state, action) => {
      const { stationId, message } = action.payload || {};
      if (stationId) {
        state.statusByStationId[stationId] = "failed";
        state.errorByStationId[stationId] = message || action.error.message;
      }
    });
  },
});

export default indicesSlice.reducer;
