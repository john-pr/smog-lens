import { useEffect, useRef, useState, useCallback } from "react";
import { Popup } from "react-leaflet";
import { useAppDispatch, useAppSelector } from "@app/hooks.js";
import { fetchStationDetails } from "@features/stationDetails/model/stationDetailsSlice.js";
import {
  selectDetailsForStation,
  selectDetailsStatusForStation,
} from "@features/stationDetails/model/selectors.js";
import { useTranslation } from "react-i18next";

const StationPopup = ({ stationId, stationName, indexValue }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  const details = useAppSelector((state) =>
    selectDetailsForStation(state, stationId)
  );
  const status = useAppSelector((state) =>
    selectDetailsStatusForStation(state, stationId)
  );

  const [isOpen, setIsOpen] = useState(false);
  const openedOnceRef = useRef(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;                 
    if (openedOnceRef.current) return;  
    openedOnceRef.current = true;

    if (status === "idle" || status === "failed") {
      dispatch(fetchStationDetails(stationId));
    }
  }, [isOpen, status, dispatch, stationId]);

  return (
    <Popup
      autoClose
      eventHandlers={{
        add: handleOpen,
        remove: handleClose,
      }}
    >
      <div className="space-y-1 text-sm">
        <div className="font-semibold">{stationName}</div>
        {/* <div>{city ?? "—"} · {address ?? "—"}</div> */}

        <div className="">
          {t("station_popup.aqi")}: {indexValue ?? t("station_popup.no_index")}
        </div>

        {status === "loading" && (
          <div>{t("station_popup.loading_measurements")}</div>
        )}

        {status === "succeeded" && details && (
          <>
            <div>
              {t("station_popup.pm10")}: {details.pm10 ?? t("station_popup.no_data")} µg/m³
            </div>
            <div>
              {t("station_popup.pm25")}: {details.pm25 ?? t("station_popup.no_data")} µg/m³
            </div>
            <div>
              {t("station_popup.o3")}: {details.o3 ?? t("station_popup.no_data")} µg/m³
            </div>
            <div>
              {t("station_popup.no2")}: {details.no2 ?? t("station_popup.no_data")} µg/m³
            </div>
            <div>
              {t("station_popup.so2")}: {details.so2 ?? t("station_popup.no_data")} µg/m³
            </div>
          </>
        )}

        {status === "failed" && (
          <div>{t("station_popup.no_measurements")}</div>
        )}
      </div>
    </Popup>
  );
};

export default StationPopup;
