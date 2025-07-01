import { Button } from "@/components/ui/button";
import { TooltipContent } from "@/components/ui/tooltip";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProductSchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { TbCalendarTime, TbReplace } from "react-icons/tb";

type Params = {
    hasCustomDeliveryDate: boolean;
    hasCustomDeliveryReplacement: boolean;
    savedProducts: ProductSchemaType[];
    product: ProductSchemaType;
    setDeliveryDateDialogOpen: (open: boolean) => void;
    setDeliveryReplacementDialogOpen: (open: boolean) => void;
}

export default function ProductOptions({ hasCustomDeliveryDate, savedProducts, product, setDeliveryDateDialogOpen, setDeliveryReplacementDialogOpen, hasCustomDeliveryReplacement }: Params) {
    return (
        <div className="flex items-center gap-1">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeliveryDateDialogOpen(true)}
                            className={cn("w-6 h-6 p-0 opacity-0 pointer-events-none transition-opacity duration-200", {
                                "text-info": hasCustomDeliveryDate,
                                "text-muted-foreground": !hasCustomDeliveryDate,
                                "opacity-100 pointer-events-auto": savedProducts.some(item => item.id === product.id && item.quantity && item.quantity >= 1)
                            })}
                            title={hasCustomDeliveryDate ? "Cambiar fecha de entrega" : "Establecer fecha de entrega"}
                        >
                            <TbCalendarTime size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Seleccionaste otra fecha de entrega
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeliveryReplacementDialogOpen(true)}
                            className={cn("w-6 h-6 p-0 opacity-0 pointer-events-none transition-opacity duration-200", {
                                "text-info": hasCustomDeliveryReplacement,
                                "text-muted-foreground": !hasCustomDeliveryReplacement,
                                "opacity-100 pointer-events-auto": savedProducts.some(item => item.id === product.id && item.quantity && item.quantity >= 1)
                            })}
                            title={hasCustomDeliveryReplacement ? "Cambiar criterio de reemplazo " : "Establecer criterio de reemplazo"}
                        >
                            <TbReplace size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Cambiar criterio de reemplazo
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </div>
    )
}