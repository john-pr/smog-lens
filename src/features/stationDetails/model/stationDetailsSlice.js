import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stationDetailsApi } from "./api.js";

function extractMeasurements(sensorDataResponse) {
  const valuesArray =
    sensorDataResponse?.["Lista danych pomiarowych"] ??
    sensorDataResponse?.values ??
    [];

  // Filter to last 8 hours, sorted oldest to newest
  const now = new Date();
  const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);

  return valuesArray
    .map((item) => {
      const dateStr = item?.["Data"] ?? item?.date ?? null;
      const value = item?.["Wartość"] ?? item?.value ?? null;
      const stationCode = item?.["Kod stanowiska"] ?? item?.["Station Code"] ?? null;

      if (!dateStr || value == null) return null;

      const dateObj = new Date(dateStr);
      return {
        dateString: dateObj.toISOString(),
        value: value,
        stationCode: stationCode,
      };
    })
    .filter((item) => {
      if (!item) return false;
      const itemDate = new Date(item.dateString);
      return itemDate >= eightHoursAgo;
    })
    .sort((a, b) => new Date(a.dateString) - new Date(b.dateString)); // Oldest to newest
}


export const fetchStationDetails = createAsyncThunk(
  "stationDetails/fetchStationDetails",
  async (stationId, { rejectWithValue }) => {
    try {
      const sensorsResponse = await stationDetailsApi.fetchSensors(stationId);

      const sensorsArray = sensorsResponse?.["Lista stanowisk pomiarowych dla podanej stacji"] ?? [];
    
    function getParamCode(sensor) {
    return (
        sensor?.["Wskaźnik - kod"] ??
        sensor?.["Wskaźnik - wzór"] ??
        ""
    ).toUpperCase();
    }

    const pm10Sensor = sensorsArray.find(s => getParamCode(s) === "PM10");
    const pm25Sensor = sensorsArray.find(s =>
    getParamCode(s) === "PM2.5" ||
    getParamCode(s) === "PM25"
    );

    const o3Sensor  = sensorsArray.find(s => getParamCode(s) === "O3");
    const no2Sensor = sensorsArray.find(s => getParamCode(s) === "NO2");
    const so2Sensor = sensorsArray.find(s => getParamCode(s) === "SO2");

    function getSensorId(sensor) {
        return sensor?.["Identyfikator stanowiska"] ?? null;
    }

    const [pm10Data, pm25Data, o3Data, no2Data, so2Data] = await Promise.all([
        pm10Sensor ? stationDetailsApi.fetchSensorData(getSensorId(pm10Sensor)) : null,
        pm25Sensor ? stationDetailsApi.fetchSensorData(getSensorId(pm25Sensor)) : null,
        o3Sensor  ? stationDetailsApi.fetchSensorData(getSensorId(o3Sensor))  : null,
        no2Sensor ? stationDetailsApi.fetchSensorData(getSensorId(no2Sensor)) : null,
        so2Sensor ? stationDetailsApi.fetchSensorData(getSensorId(so2Sensor)) : null,
    ]);

    return {
    stationId: String(stationId),
    details: {
        pm10: pm10Data ? extractMeasurements(pm10Data) : [],
        pm25: pm25Data ? extractMeasurements(pm25Data) : [],
        o3:   o3Data  ? extractMeasurements(o3Data)  : [],
        no2:  no2Data ? extractMeasurements(no2Data) : [],
        so2:  so2Data ? extractMeasurements(so2Data) : [],
    },
    };
    } catch (errorObject) {
      return rejectWithValue({
        stationId: String(stationId),
        message: errorObject.message,
      });
    }
  }
);

const stationDetailsSlice = createSlice({
  name: "stationDetails",
  initialState: {
    byStationId: {},
    statusByStationId: {},
    errorByStationId: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStationDetails.pending, (state, action) => {
      const id = String(action.meta.arg);
      state.statusByStationId[id] = "loading";
      state.errorByStationId[id] = null;
    });
    builder.addCase(fetchStationDetails.fulfilled, (state, action) => {
      const { stationId, details } = action.payload;
      state.byStationId[stationId] = details;
      state.statusByStationId[stationId] = "succeeded";
    });
    builder.addCase(fetchStationDetails.rejected, (state, action) => {
      const payload = action.payload;
      if (!payload?.stationId) return;
      state.statusByStationId[payload.stationId] = "failed";
      state.errorByStationId[payload.stationId] = payload.message;
    });
  },
});

export default stationDetailsSlice.reducer;
