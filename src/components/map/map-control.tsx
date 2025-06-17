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
        <div className='w-full h-fit'>
            <MapControl position={controlPosition}>
                <div className='w-full mt-2 rounded h-20 bg-black/20 z-30 flex gap-3 items-center p-5'>
                    <div className="w-96">
                        <AutocompleteCustom onPlaceSelect={onPlaceSelect} />
                    </div>
                    <CustomDrawingControls onPolygonComplete={handlePolygonComplete} className='right-0 top-0 relative' />
                </div>
            </MapControl>
        </div>
    );
};
