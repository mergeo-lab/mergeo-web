import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IoMdCar } from "react-icons/io";

export default function PickUpIndicator() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost">
                        <IoMdCar size={20} className="text-highlight" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground rounded-md px-3 py-1.5 text-sm shadow-md">
                    Este producto solo tiene PickUp
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}