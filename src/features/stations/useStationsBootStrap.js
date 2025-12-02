import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import { fetchStations } from "./stationsSlice.js";
import {
  selectStationsStatus,
  selectStationsError,
  selectStationsList,
} from "./selectors.js";

export function useStationsBootstrap() {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectStationsStatus);
  const error = useAppSelector(selectStationsError);
  const stations = useAppSelector(selectStationsList);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStations());
    }
  }, [status, dispatch]);

  return { stations, status, error };
}
