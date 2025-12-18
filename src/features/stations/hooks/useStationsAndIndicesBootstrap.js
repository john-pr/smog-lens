import { useEffect } from "react";
import { useStationsBootstrap } from "./useStationsBootStrap.js";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { fetchIndexByStationId } from "../model/indicesSlice.js";
import { selectIndicesById } from "../model/indicesSelectors.js";

export function useStationsAndIndicesBootstrap() {
  const dispatch = useAppDispatch();
  const { stations, status, error } = useStationsBootstrap();
  const indicesById = useAppSelector(selectIndicesById);

  useEffect(() => {
    if (status !== "succeeded") return;
    if (!stations.length) return;

    // Intentionally limited to 10 stations for performance during initial load
    // const stationIds = stations.map((s) => String(s.id)); // ALL stations
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
    // indicesById intentionally omitted - only used for conditional check, prevents cascading re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, stations, dispatch]);

  return { stations, indicesById, status, error };
}
