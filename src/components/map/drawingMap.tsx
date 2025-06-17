import { ControlPosition, Map, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect, useRef } from 'react';
import { CustomMapControl } from '@/components/map/map-control';
import MapHandler from '@/components/map/map-handler';
import useZoneStore from '@/store/zone.store';

const centerArgentina = { lat: -35.196593198428815, lng: -64.71031145842831 };

type Props = {
    zone?: google.maps.LatLngLiteral[];
    hideControls?: boolean;
};

const DrawingMap = ({ zone = [], hideControls = false }: Props) => {
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const { setZone } = useZoneStore();
    const map = useMap();

    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const lastCoordinatesRef = useRef<google.maps.LatLngLiteral[] | null>(null);

    useEffect(() => {
        if (!map) return;

        // If polygon exists, update its path only if coordinates differ
        if (polygonRef.current) {
            const path = polygonRef.current.getPath();
            const coordsChanged =
                zone.length !== path.getLength() ||
                zone.some((coord, i) => {
                    const point = path.getAt(i);
                    return !point || point.lat() !== coord.lat || point.lng() !== coord.lng;
                });

            if (coordsChanged) {
                polygonRef.current.setPaths(zone);
            }
            return; // no need to recreate polygon
        }

        if (zone.length === 0) return;

        // Create new polygon
        const polygon = new google.maps.Polygon({
            paths: zone,
            editable: !hideControls,
        });
        polygon.setMap(map);
        polygonRef.current = polygon;

        const updatePolygonCoordinates = () => {
            const path = polygon.getPath();
            const coordinates: google.maps.LatLngLiteral[] = [];
            for (let i = 0; i < path.getLength(); i++) {
                const latLng = path.getAt(i);
                coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
            }

            // Check if coordinates actually changed
            const prev = lastCoordinatesRef.current;
            const equal =
                prev &&
                prev.length === coordinates.length &&
                prev.every((c, i) => c.lat === coordinates[i].lat && c.lng === coordinates[i].lng);

            if (!equal) {
                lastCoordinatesRef.current = coordinates;
                setZone(coordinates);
            }
        };

        google.maps.event.addListener(polygon.getPath(), 'set_at', updatePolygonCoordinates);
        google.maps.event.addListener(polygon.getPath(), 'insert_at', updatePolygonCoordinates);
        google.maps.event.addListener(polygon.getPath(), 'remove_at', updatePolygonCoordinates);

        // Fit map bounds to polygon
        const bounds = new google.maps.LatLngBounds();
        polygon.getPath().forEach((latLng) => {
            bounds.extend(latLng);
        });
        map.fitBounds(bounds);

        // Cleanup
        return () => {
            google.maps.event.clearInstanceListeners(polygon.getPath());
            polygon.setMap(null);
            polygonRef.current = null;
            lastCoordinatesRef.current = null;
        };
    }, [map, zone, hideControls, setZone]);

    return (
        <>
            <Map
                className="w-full h-full m-0 p-0"
                defaultZoom={5}
                defaultCenter={centerArgentina}
                gestureHandling="greedy"
                disableDefaultUI={true}
            />
            {!hideControls && (
                <CustomMapControl controlPosition={ControlPosition.TOP} onPlaceSelect={setSelectedPlace} />
            )}
            <MapHandler place={selectedPlace} />
        </>
    );
};

export default DrawingMap;
