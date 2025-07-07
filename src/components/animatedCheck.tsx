import { useRive } from '@rive-app/react-canvas-lite';
import { useEffect } from 'react';
import check from '../assets/check.riv';

export default function AnimatedCheck() {
    const { rive, RiveComponent } = useRive({
        src: check,
        stateMachines: "check",
        autoplay: false,
    });

    useEffect(() => {
        if (rive) {
            // Play the animation once when component mounts
            rive.play();
        }
    }, [rive]);

    return (
        <RiveComponent className="w-5 h-5" />
    );
}