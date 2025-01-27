import React from "react";

type Props = {
    children: React.ReactNode,
    nColumns?: number
}

export default function DynamicGrid({ children, nColumns }: Props) {
    const childrenArray = React.Children.toArray(children);
    const cols = nColumns || 3;
    const numOfCols = Math.min(Math.max(childrenArray.length, 2), cols); // Min 2, Max 4

    return (
        <div
            className={`grid m-2`}
            style={{
                gridTemplateColumns: `repeat(${numOfCols}, minmax(0, 1fr))`,
            }}
        >
            {childrenArray.map((child, index) => (
                <div key={index} className="m-2">
                    {child}
                </div>
            ))}
        </div>
    );
}

