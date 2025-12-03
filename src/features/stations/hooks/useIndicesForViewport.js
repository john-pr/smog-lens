import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.js";
import { fetchIndexByStationId } from "../model/indicesSlice.js";
import { selectIndicesById, selectIndexStatusById } from "../model/indicesSelectors.js";

export function useIndicesForViewport(stationsInView) {
  const dispatch = useAppDispatch();
  const indicesById = useAppSelector(selectIndicesById);
  const statusById = useAppSelector(selectIndexStatusById);

  const idsInView = useMemo(
    () => stationsInView.map((stationObject) => String(stationObject.id)),
    [stationsInView]
  );

  const missingIds = useMemo(() => {
    return idsInView.filter((stationId) => {
      const hasData = indicesById[stationId] != null;
      const isLoading = statusById[stationId] === "loading";
      return !hasData && !isLoading;
    });
  }, [idsInView, indicesById, statusById]);

  const cancelRef = useRef(false);

  useEffect(() => {
    if (missingIds.length === 0) return;

    cancelRef.current = true;
    const kickOffTimeout = setTimeout(() => {
      cancelRef.current = false;

      let pointer = 0;

      const runBatch = () => {
        if (cancelRef.current) return;

        const batch = missingIds.slice(pointer, pointer + 20);

        batch.forEach((stationId) => {
          if (
            indicesById[stationId] == null &&
            statusById[stationId] !== "loading"
          ) {
            dispatch(fetchIndexByStationId(stationId));
          }
        });

        pointer += 20;

        if (pointer < missingIds.length) {
          setTimeout(runBatch, 250);
        }
      };

      runBatch();
    }, 0);

    return () => {
      clearTimeout(kickOffTimeout);
      cancelRef.current = true;
    };
  }, [missingIds, dispatch]);

  return indicesById;
}
