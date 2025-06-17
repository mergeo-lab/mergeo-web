import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useDrawingManager } from '@/components/map/use-drawing-manager';
import { FaRegHandRock } from "react-icons/fa";
import { LuPentagon } from "react-icons/lu";
import { cn } from '@/lib/utils';

type CustomDrawingControlsProps = {
    onPolygonComplete: (coordinates: google.maps.LatLngLiteral[]) => void;
    className?: string;
};

const CustomDrawingControls = ({ onPolygonComplete, className }: CustomDrawingControlsProps) => {
    const [polygonDrawn, setPolygonDrawn] = useState(false);
    const polygonRef = useRef<google.maps.Polygon | null>(null);
    const previousCoordinatesRef = useRef<google.maps.LatLngLiteral[] | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleOverlayComplete = useCallback(
        (event: google.maps.drawing.OverlayCompleteEvent) => {
            if (event.type === 'polygon') {
                const polygon = event.overlay as google.maps.Polygon;

                if (polygonRef.current !== polygon) {
                    polygonRef.current = polygon;
                    const path = polygon.getPath();

                    const updatePolygonCoordinates = () => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);

                        timeoutRef.current = setTimeout(() => {
                            const coordinates: google.maps.LatLngLiteral[] = [];
                            for (let i = 0; i < path.getLength(); i++) {
                                const latLng = path.getAt(i);
                                coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
                            }

                            const prev = previousCoordinatesRef.current;
                            const equal =
                                prev &&
                                prev.length === coordinates.length &&
                                prev.every((c, i) => c.lat === coordinates[i].lat && c.lng === coordinates[i].lng);

                            if (!equal) {
                                previousCoordinatesRef.current = coordinates;
                                onPolygonComplete(coordinates);
                            }
                        }, 200); // debounce 200ms
                    };

                    updatePolygonCoordinates();

                    polygon.setEditable(true);

                    google.maps.event.addListener(path, 'set_at', updatePolygonCoordinates);
                    google.maps.event.addListener(path, 'insert_at', updatePolygonCoordinates);
                }

                setPolygonDrawn(true);
            }
        },
        [onPolygonComplete, polygonRef, previousCoordinatesRef, setPolygonDrawn, timeoutRef]
    );

    const { startDrawing } = useDrawingManager(null, handleOverlayComplete);

    return (
        <div className={cn("absolute top-24 flex flex-col gap-2", className)}>
            <div className="flex flex-reverse items-center rounded shadow bg-white">
                <Button
                    variant="ghost"
                    onClick={() => startDrawing(google.maps.drawing.OverlayType.POLYGON)}
                    disabled={polygonDrawn}
                >
                    <LuPentagon size={20} />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => startDrawing(null)}
                    disabled={!polygonDrawn}
                >
                    <FaRegHandRock size={20} />
                </Button>
            </div>
        </div>
    );
};

export default CustomDrawingControls;