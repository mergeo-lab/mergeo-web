import { CardBodyType, CardBody, CardHeaderType, CardFooterType, CardFooter, CardHeader } from "@/components/card";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
    children: React.ReactNode,
    className?: string
}

type ValidCardComponent = CardHeaderType | CardBodyType | CardFooterType;

function isValidCardComponent(component: unknown): component is ValidCardComponent {
    return component === CardHeader || component === CardBody || component === CardFooter;
}

export function Card({ children, className }: Props) {
    const validChildren = React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || !isValidCardComponent(child.type)) {
            console.warn('Invalid child component provided to CardWrapper, must be CardHeader, CardBody or CardFooter');
        }
        return child;
    });

    const hasCardBody = React.Children.toArray(children).some(
        (child) => React.isValidElement(child) && child.type === CardBody
    );

    if (!hasCardBody) {
        console.warn('CardBody component is required in CardWrapper');
    }

    return (
        <div className={cn('w-full h-full flex flex-col justify-between border rounded shadow', className)}>
            {validChildren}
        </div>
    )
}