import React from "react";

const DynamicGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const childrenArray = React.Children.toArray(children);
    const numOfCols = Math.min(Math.max(childrenArray.length, 2), 4); // Min 2, Max 4

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
};

export default DynamicGrid;