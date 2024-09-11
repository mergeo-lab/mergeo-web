import { UndoRedoControl } from '@/components/map/undo-redo-control';
import { useDrawingManager } from '@/components/map/use-drawing-manager';
import { Button } from '@/components/ui/button';
import { CircleDotDashed, Hand, Pentagon } from 'lucide-react';

const CustomDrawingControls = () => {
    const { drawingManager, startDrawing } = useDrawingManager();

    return (
        <div className='absolute top-24 left-2 flex flex-col gap-2'>
            <div className='flex flex-col-reverse items-center rounded shadow bg-white'>
                <Button variant="ghost" onClick={() => startDrawing(google.maps.drawing.OverlayType.POLYGON)}>
                    <Pentagon />
                </Button>
                <Button variant="ghost" onClick={() => startDrawing(google.maps.drawing.OverlayType.CIRCLE)}>
                    <CircleDotDashed />
                </Button>
                <Button variant="ghost" onClick={() => startDrawing(null)}>
                    <Hand />
                </Button>
            </div>
            <UndoRedoControl drawingManager={drawingManager} />
        </div>
    );
};

export default CustomDrawingControls;
