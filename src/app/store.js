import { configureStore } from "@reduxjs/toolkit";

import stationsReducer from "../features/stations/stationsSlice.js";
import indicesReducer from "../features/stations/indicesSlice.js";
// import stationDetailsReducer from "../features/stationDetails/stationDetailsSlice.js";

export const store = configureStore({
  reducer: {
    stations: stationsReducer,
    indices: indicesReducer,
    // stationDetails: stationDetailsReducer,
  },
  // middleware domyślnie ma thunk + serializableCheck.
  // Zostaw, dopóki nie zaczniesz wkładać do stanu obiektów Leafleta.
});
