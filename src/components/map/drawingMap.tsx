import { ControlPosition, Map } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { CustomMapControl } from '@/components/map/map-control';
import MapHandler from '@/components/map/map-handler';

const centerArgenitna = { lat: -35.196593198428815, lng: -64.71031145842831 };

const DrawingMap = () => {
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);

    return (
        <>
            <Map
                className='w-full h-full m-0 p-0'
                defaultZoom={3}
                defaultCenter={centerArgenitna}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />

            <CustomMapControl
                controlPosition={ControlPosition.TOP}
                onPlaceSelect={setSelectedPlace}
            />

            <MapHandler place={selectedPlace} />
        </>
    );
};

export default DrawingMap;