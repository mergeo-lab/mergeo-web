import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

export function useDrawingManager(
    initialValue: google.maps.drawing.DrawingManager | null = null
) {
    const map = useMap();
    const drawing = useMapsLibrary('drawing');

    const [drawingManager, setDrawingManager] =
        useState<google.maps.drawing.DrawingManager | null>(initialValue);

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

        return () => {
            newDrawingManager.setMap(null);
        };
    }, [drawing, map]);

    const startDrawing = (mode: google.maps.drawing.OverlayType | null) => {
        drawingManager?.setDrawingMode(mode);
    };

    return { drawingManager, startDrawing };
}
