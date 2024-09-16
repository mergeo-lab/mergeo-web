import { useState } from 'react';
import { UndoRedoControl } from '@/components/map/undo-redo-control';
import { useDrawingManager } from '@/components/map/use-drawing-manager';
import { Button } from '@/components/ui/button';
import { Hand, Pentagon } from 'lucide-react';

type CustomDrawingControlsProps = {
    onPolygonComplete: (coordinates: google.maps.LatLngLiteral[]) => void; // Prop to handle the drawn zone
};

const CustomDrawingControls = ({ onPolygonComplete }: CustomDrawingControlsProps) => {
    const [polygonDrawn, setPolygonDrawn] = useState(false); // State to track if polygon is drawn

    const { drawingManager, startDrawing } = useDrawingManager(null, (event) => {
        if (event.type === 'polygon') {
            const polygon = event.overlay as google.maps.Polygon;
            const path = polygon.getPath();
            const coordinates: google.maps.LatLngLiteral[] = [];

            // Extract the coordinates from the polygon's path
            for (let i = 0; i < path.getLength(); i++) {
                const latLng = path.getAt(i);
                coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
            }

            // Pass the coordinates to the parent component
            onPolygonComplete(coordinates);

            // Set polygon drawn state to true
            setPolygonDrawn(true);

            // Enable editing on the drawn polygon
            polygon.setEditable(true);
        }
    });

    return (
        <div className="absolute top-24 left-2 flex flex-col gap-2">
            <div className="flex flex-col-reverse items-center rounded shadow bg-white">
                <Button
                    variant="ghost"
                    onClick={() => startDrawing(google.maps.drawing.OverlayType.POLYGON)}
                    disabled={polygonDrawn} // Disable if polygon is drawn
                >
                    <Pentagon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => startDrawing(null)}
                    disabled={polygonDrawn} // Disable if polygon is drawn
                >
                    <Hand />
                </Button>

            </div>
            <UndoRedoControl drawingManager={drawingManager} />
        </div>
    );
};

export default CustomDrawingControls;
