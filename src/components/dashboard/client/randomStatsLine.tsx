import { useMemo } from 'react';

const RandomStatsline = () => {
    const sparklinePoints = useMemo(() => {
        const points: string[] = [];
        const height = 30;
        const width = 100;
        const steps = 10;

        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * width;
            const y = Math.random() * height;
            points.push(`${x},${y.toFixed(2)}`);
        }

        return points.join(' ');
    }, []); // Only generate once per render

    return (
        <svg
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none text-green-500/25"
        >
            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth=".5"
                points={sparklinePoints}
            />
        </svg>
    );
};

export default RandomStatsline;
