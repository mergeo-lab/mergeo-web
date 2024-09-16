import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import { AutocompleteCustom } from './autoComplete';
import useZoneStore from '@/store/zone.store';
import CustomDrawingControls from '@/components/map/custom-drowaing-controls';

type CustomAutocompleteControlProps = {
    controlPosition: ControlPosition;
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({ controlPosition, onPlaceSelect }: CustomAutocompleteControlProps) => {
    const { setZone } = useZoneStore();

    const handlePolygonComplete = (coordinates: google.maps.LatLngLiteral[]) => {
        console.log('Polygon coordinates:', coordinates);
        setZone(coordinates);
    };

    return (
        <>
            <MapControl position={controlPosition}>
                <div className="w-96 mt-1">
                    <AutocompleteCustom onPlaceSelect={onPlaceSelect} />
                </div>
            </MapControl>
            <CustomDrawingControls onPolygonComplete={handlePolygonComplete} />
        </>
    );
};
