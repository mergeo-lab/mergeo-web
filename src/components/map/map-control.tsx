import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import { AutocompleteCustom } from './autoComplete';
import useZoneStore from '@/store/zone.store';
import CustomDrawingControls from '@/components/map/custom-drowaing-controls';
import { useRef } from 'react';

type CustomAutocompleteControlProps = {
    controlPosition: ControlPosition;
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({ controlPosition, onPlaceSelect }: CustomAutocompleteControlProps) => {
    const { setZone } = useZoneStore();
    const previousCoordinatesRef = useRef<google.maps.LatLngLiteral[] | null>(null);

    const handlePolygonComplete = (coordinates: google.maps.LatLngLiteral[]) => {
        const prev = previousCoordinatesRef.current;
        const equal =
            prev &&
            prev.length === coordinates.length &&
            prev.every((c, i) => c.lat === coordinates[i].lat && c.lng === coordinates[i].lng);

        if (!equal) {
            previousCoordinatesRef.current = coordinates;
            console.log('Polygon coordinates:', coordinates);
            setZone(coordinates);
        }
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
