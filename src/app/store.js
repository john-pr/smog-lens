import { configureStore } from "@reduxjs/toolkit";

import stationsReducer from "../features/stations/model/stationsSlice.js";
import indicesReducer from "../features/stations/model/indicesSlice.js";
import stationDetailsReducer from "../features/stationDetails/model/stationDetailsSlice.js";

export const store = configureStore({
  reducer: {
    stations: stationsReducer,
    indices: indicesReducer,
    stationDetails: stationDetailsReducer,
  },
});
