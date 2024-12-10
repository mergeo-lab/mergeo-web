import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

type Props = {
    label: string;
    value: string | number;
    className?: string;
};

export default function BuyOrderFormField({ label, value, className }: Props) {
    const [lines, setLines] = useState<string[]>([]); // Store each calculated line
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const calculateLines = () => {
            const container = containerRef.current!;
            const context = document.createElement("canvas").getContext("2d");
            if (!context) return;

            // Set font styles to match the container
            const computedStyles = window.getComputedStyle(container);
            context.font = `${computedStyles.fontSize} ${computedStyles.fontFamily}`;

            const words = String(value).split(" ");
            const maxWidth = container.offsetWidth - 50;
            const calculatedLines: string[] = [];
            let currentLine = "";

            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const testWidth = context.measureText(testLine).width;

                if (testWidth > maxWidth) {
                    calculatedLines.push(currentLine);
                    currentLine = word; // Start new line
                } else {
                    currentLine = testLine; // Keep adding to current line
                }
            }

            if (currentLine) calculatedLines.push(currentLine); // Add last line
            setLines(calculatedLines);
        };

        calculateLines();

        const resizeObserver = new ResizeObserver(() => calculateLines());
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [value]);


    return (
        <div className="flex items-start w-full">
            <label className="block text-sm font-medium text-secondary text-left w-fit min-w-[160px] mt-3">
                {label}
            </label>
            <div
                ref={containerRef}
                className={cn("w-full flex flex-col", className)}
            >
                {lines.map((line, index) => (
                    <div
                        key={index}
                        className="border-b border-gray-secondary px-3 py-2"
                    >
                        {line}
                    </div>
                ))}
            </div>
        </div>
    );
}
