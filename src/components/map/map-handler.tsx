
import { useMap } from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';

interface Props {
    place: google.maps.places.PlaceResult | null;
}

// eslint-disable-next-line react-refresh/only-export-components
const MapHandler = ({ place }: Props) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !place) return;

        if (place.geometry?.viewport) {
            map.fitBounds(place.geometry?.viewport);
        }
    }, [map, place]);

    return null;
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(MapHandler);
