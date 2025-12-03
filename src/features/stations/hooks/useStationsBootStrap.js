import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.js";
import { fetchStations } from "../model/stationsSlice.js";
import {
  selectStationsStatus,
  selectStationsError,
  selectStationsList,
} from "../model/selectors.js";

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
