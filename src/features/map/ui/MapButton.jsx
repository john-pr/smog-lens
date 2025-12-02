import { Map, SatelliteDish, Locate, LocateOff } from "lucide-react";

const MapButton = props => {

    const { handleClick, type } = props;

    const renderIcon = () => {
        switch(type) {
            case 'mapLayer':
                return (
                    <div className="flex items-center justify-center">
                        <Map className="w-5.5 h-5.5" />
                    </div>
                )
            case 'satelliteLayer':
                return (
                     <div className="flex items-center justify-center">
                        <SatelliteDish className="w-5.5 h-5.5"/>
                    </div>
                );
            case 'geoLocation':
                return (    
                    <div className="flex items-center justify-center">  
                       <Locate className="w-5 h-5"/>    
                    </div>
                );
            case 'geoLocationDisabled':
                return (    
                    <div className="flex items-center justify-center">  
                       <LocateOff className="w-5 h-5"/>    
                    </div>
                );
            default: return null;       
        }
    }

    return (
        <button className="cursor-pointer" onClick={handleClick}>
            {renderIcon()}
        </button>
    );
};       
export default MapButton;