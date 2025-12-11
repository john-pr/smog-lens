import React, { useEffect } from "react";
import { MapContainer, ZoomControl, useMap } from "react-leaflet";
import TileLayerSwitcher from "./layers/TileLayerSwitcher";
import MapEvents from "./MapEvents";
import StationsClusterLayer from "./layers/StationsClusterLayer";

const MapCenterUpdater = ({ center, flyToStation }) => {
    const map = useMap();

    useEffect(() => {
        if (!center) return;

        // If flyToStation is set, do a smooth flyTo animation (for URL station entry)
        if (flyToStation) {
            // Start at zoom 12, then fly to zoom 14
            map.setView(center, 12);
            setTimeout(() => {
                map.flyTo(center, 14, { duration: 1.5 });
            }, 100);
            return;
        }

        // Regular center update
        if (center.length === 3) {
            map.setView([center[0], center[1]], center[2]);
        } else {
            map.setView(center, map.getZoom());
        }
    }, [center, flyToStation, map]);

    return null;
};

const MapView = props => {
    const { selectedStationId, selectedMapLayer, center, stations, indicesById, onViewPortChange, zoom, flyToStation } = props;


    return (
        <MapContainer 
            className="h-full w-full z-0"
            id="map"
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            zoomControl={false}
        >
             <MapCenterUpdater center={center} flyToStation={flyToStation} />
             <TileLayerSwitcher selectedMapLayer={selectedMapLayer}/>
             <MapEvents onViewPortChange={onViewPortChange} />
             <StationsClusterLayer
                stations={stations}
                indicesById={indicesById}
                selectedStationId={selectedStationId}
                isInitialUrlEntry={flyToStation}
             />
             <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default MapView;
