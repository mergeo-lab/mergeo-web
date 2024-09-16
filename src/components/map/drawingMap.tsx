import { ControlPosition, Map, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import { CustomMapControl } from '@/components/map/map-control';
import MapHandler from '@/components/map/map-handler';
import useZoneStore from '@/store/zone.store';

const centerArgentina = { lat: -35.196593198428815, lng: -64.71031145842831 };

const DrawingMap = ({ zone }: { zone?: google.maps.LatLngLiteral[] }) => {
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const { setZone } = useZoneStore();
    const map = useMap();

    useEffect(() => {
        if (map && zone) {
            try {
                // Clear existing polygons if necessary
                map.data.forEach((feature) => {
                    if (feature && feature.getGeometry()?.getType() === 'Polygon') {
                        map.data.remove(feature);
                    }
                });

                const polygon = new google.maps.Polygon({
                    paths: zone,
                    editable: true,
                });
                polygon.setMap(map);

                const updatePolygonCoordinates = () => {
                    const path = polygon.getPath();
                    const coordinates: google.maps.LatLngLiteral[] = [];
                    for (let i = 0; i < path.getLength(); i++) {
                        const latLng = path.getAt(i);
                        coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
                    }
                    setZone(coordinates); // Update the state with new coordinates
                };

                // Add event listeners to update coordinates on changes
                google.maps.event.addListener(polygon.getPath(), 'set_at', updatePolygonCoordinates);
                google.maps.event.addListener(polygon.getPath(), 'insert_at', updatePolygonCoordinates);
                google.maps.event.addListener(polygon.getPath(), 'remove_at', updatePolygonCoordinates);

                // Cleanup function to remove listeners and polygon
                return () => {
                    google.maps.event.clearInstanceListeners(polygon.getPath());
                    polygon.setMap(null);
                };
            } catch (error) {
                console.error('Error setting up polygon:', error);
            }
        }
    }, [map, setZone, zone]);

    return (
        <>
            <Map
                className='w-full h-full m-0 p-0'
                defaultZoom={3}
                defaultCenter={centerArgentina}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
            <CustomMapControl controlPosition={ControlPosition.TOP} onPlaceSelect={setSelectedPlace} />
            <MapHandler place={selectedPlace} />
        </>
    );
};

export default DrawingMap;
