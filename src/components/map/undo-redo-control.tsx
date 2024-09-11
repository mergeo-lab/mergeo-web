import { useReducer, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

import { DrawingActionKind } from './types';
import reducer, { useDrawingManagerEvents, useOverlaySnapshots } from '@/components/map/undo-redo';
import { Redo2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    drawingManager: google.maps.drawing.DrawingManager | null;
}

export const UndoRedoControl = ({ drawingManager }: Props) => {
    const map = useMap();

    const [state, dispatch] = useReducer(reducer, {
        past: [],
        now: [],
        future: []
    });

    // We need this ref to prevent infinite loops in certain cases.
    // For example when the radius of circle is set via code (and not by user interaction)
    // the radius_changed event gets triggered again. This would cause an infinite loop.
    // This solution can be improved by comparing old vs. new values. For now we turn
    // off the "updating" when snapshot changes are applied back to the overlays.
    const overlaysShouldUpdateRef = useRef<boolean>(false);

    useDrawingManagerEvents(drawingManager, overlaysShouldUpdateRef, dispatch);
    useOverlaySnapshots(map, state, overlaysShouldUpdateRef);

    return (
        <div className="flex flex-col bg-white rounded shadow">
            <Button variant="ghost"
                className=' w-[55px]'
                onClick={() => dispatch({ type: DrawingActionKind.UNDO })}
                disabled={!state.past.length}>
                <Undo2 size={18} />
            </Button>
            <Button variant="ghost"
                className='px-2 w-[55px]'
                onClick={() => dispatch({ type: DrawingActionKind.REDO })}
                disabled={!state.future.length}>
                <Redo2 size={18} />
            </Button>
        </div>
    );
};