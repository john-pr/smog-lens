import React, { useEffect } from "react";
import { MapContainer, ZoomControl, useMap } from "react-leaflet";
import TileLayerSwitcher from "./ui/layers/TileLayerSwitcher";
import MapEvents from "./MapEvents.jsx";
import StationsClusterLayer from "./ui/layers/StationsClusterLayer";

const MapCenterUpdater = ({ center }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            // Check if zoom level is included (array length 3)
            if (center.length === 3) {
                map.setView([center[0], center[1]], center[2]);
            } else {
                map.setView(center, map.getZoom());
            }
        }
    }, [center, map]);
    
    return null;
};

const MapView = props => {
    const { selectedStationId, selectedMapLayer, center, stations, indicesById, onViewPortChange } = props;


    return (
        <MapContainer 
            className="h-full w-full z-0"
            id="map"
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            zoomControl={false}
        >   
             <MapCenterUpdater center={center} />
             <TileLayerSwitcher provider={selectedMapLayer}/>
             <MapEvents onViewPortChange={onViewPortChange} />
             <StationsClusterLayer
                stations={stations}
                indicesById={indicesById}
                // onMarkerClick={onMarkerClick}
             />
             <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default MapView;
