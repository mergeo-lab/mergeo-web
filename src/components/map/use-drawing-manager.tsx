import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

export function useDrawingManager(
    initialValue: google.maps.drawing.DrawingManager | null = null,
    onOverlayComplete: (overlay: google.maps.drawing.OverlayCompleteEvent) => void
) {
    const map = useMap();
    const drawing = useMapsLibrary('drawing');
    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(initialValue);

    useEffect(() => {
        if (!map || !drawing) return;

        const newDrawingManager = new drawing.DrawingManager({
            map,
            drawingMode: null, // Disable default drawing mode
            drawingControl: false, // Disable default drawing control UI
            circleOptions: {
                editable: true,
            },
            polygonOptions: {
                editable: true,
            },
        });

        setDrawingManager(newDrawingManager);

        // Add an event listener for `overlaycomplete` to handle drawing completion
        const listener = google.maps.event.addListener(newDrawingManager, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
            onOverlayComplete(event);
            // Stop drawing once the path is closed
            newDrawingManager.setDrawingMode(null);
        });

        return () => {
            google.maps.event.removeListener(listener);
            newDrawingManager.setMap(null);
        };
    }, [drawing, map]);

    const startDrawing = (mode: google.maps.drawing.OverlayType | null) => {
        drawingManager?.setDrawingMode(mode);
    };

    return { drawingManager, startDrawing };
}
