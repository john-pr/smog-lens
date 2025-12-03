import { useEffect } from "react";
import { useStationsBootstrap } from "./useStationsBootStrap.js";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.js";
import { fetchIndexByStationId } from "../model/indicesSlice.js";
import { selectIndicesById } from "../model/indicesSelectors.js";

export function useStationsAndIndicesBootstrap() {
  const dispatch = useAppDispatch();
  const { stations, status, error } = useStationsBootstrap();
  const indicesById = useAppSelector(selectIndicesById);

  useEffect(() => {
    if (status !== "succeeded") return;
    if (!stations.length) return;

    // const stationIds = stations.map((s) => String(s.id));
    const stationIds = stations
      .slice(0, 10)
      .map((s) => String(s.id));

    let i = 0;
    const intervalId = setInterval(() => {
      let count = 0;

      while (i < stationIds.length && count < 25) {
        const id = stationIds[i];
        if (!indicesById[id]) {
          dispatch(fetchIndexByStationId(id));
        }
        i += 1;
        count += 1;
      }

      if (i >= stationIds.length) clearInterval(intervalId);
    }, 300);

    return () => clearInterval(intervalId);
  }, [status, stations, dispatch]);

  return { stations, indicesById, status, error };
}
