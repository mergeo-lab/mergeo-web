import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hand, Pentagon } from 'lucide-react';
import { useDrawingManager } from '@/components/map/use-drawing-manager';

type CustomDrawingControlsProps = {
    onPolygonComplete: (coordinates: google.maps.LatLngLiteral[]) => void;
};

const CustomDrawingControls = ({ onPolygonComplete }: CustomDrawingControlsProps) => {
    const [polygonDrawn, setPolygonDrawn] = useState(false);

    const { startDrawing } = useDrawingManager(null, (event) => {
        if (event.type === 'polygon') {
            const polygon = event.overlay as google.maps.Polygon;
            const path = polygon.getPath();

            const updatePolygonCoordinates = () => {
                const coordinates: google.maps.LatLngLiteral[] = [];
                for (let i = 0; i < path.getLength(); i++) {
                    const latLng = path.getAt(i);
                    coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
                }
                onPolygonComplete(coordinates);
            };

            // Extract initial coordinates
            updatePolygonCoordinates();
            setPolygonDrawn(true);
            polygon.setEditable(true);

            // Listen for changes to the polygon
            google.maps.event.addListener(path, 'set_at', updatePolygonCoordinates);
            google.maps.event.addListener(path, 'insert_at', updatePolygonCoordinates);
        }
    });

    return (
        <div className="absolute top-24 left-2 flex flex-col gap-2">
            <div className="flex flex-col-reverse items-center rounded shadow bg-white">
                <Button
                    variant="ghost"
                    onClick={() => startDrawing(google.maps.drawing.OverlayType.POLYGON)}
                    disabled={polygonDrawn}
                >
                    <Pentagon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => startDrawing(null)}
                    disabled={!polygonDrawn}
                >
                    <Hand />
                </Button>
            </div>
        </div>
    );
};

export default CustomDrawingControls;
