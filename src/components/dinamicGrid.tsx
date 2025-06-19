import React from "react";

type Props = {
    children: React.ReactNode;
    nColumns?: number;
};

export default function DynamicGrid({ children, nColumns }: Props) {
    const childrenArray = React.Children.toArray(children);
    const cols = nColumns || 3;
    const numItems = childrenArray.length;

    // Determine grid columns based on number of items
    let gridColsClass = '';

    if (numItems === 1) {
        // Single item: 1 column on all screens
        gridColsClass = 'grid-cols-1';
    } else if (numItems < cols) {
        // Few items: 2 columns on all screens
        gridColsClass = 'grid-cols-2';
    } else {
        // Many items: responsive grid
        // Mobile: 2 cols, Tablet: 3 cols, Desktop: nColumns
        if (cols <= 3) {
            gridColsClass = `grid-cols-2 md:grid-cols-[repeat(${cols},minmax(0,1fr))]`;
        } else {
            gridColsClass = `grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(${cols},minmax(0,1fr))]`;
        }
    }

    return (
        <div className={`grid m-2 gap-4 ${gridColsClass}`}>
            {childrenArray.map((child, index) => (
                <div key={index} className="m-2">
                    {child}
                </div>
            ))}
        </div>
    );
}