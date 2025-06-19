import { cn, formatDate } from "@/lib/utils";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";
import UseSearchConfigStore from "@/store/searchConfiguration.store";
import { ReplacementCriteriaValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
    tooltipFormat?: boolean;
}

export default function OrderInfo({ tooltipFormat = false }: Props) {
    const { getAllConfig } = UseSearchConfigStore();
    const {
        deliveryTime, branch, pickUp, replacementCriteria, listName,
    } = getAllConfig();
    const [isOpen, setIsOpen] = useState(false);


    if (tooltipFormat) {
        return (
            <Popover>
                <PopoverTrigger disabled={!branch || !deliveryTime}>
                    <Button
                        variant='secondary'
                        disabled={!branch || !deliveryTime}
                        className={cn("p-0 px-3 overflow-hidden bg-secondary/50", {
                            'hidden': !branch || !deliveryTime
                        })}>
                        <LuInfo size={22} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div>Sucursal: <span className="font-bold text-info">{branch?.name}</span></div>
                    <div>Rango de fechas: <br />
                        <span className="font-bold">
                            {formatDate(deliveryTime?.from?.toString() || '', true)} - {formatDate(deliveryTime?.to?.toString() || '', true)}
                        </span>
                    </div>
                    <div>Pick up: <span className="font-bold">{pickUp ? 'si' : 'no'}</span></div>
                    <div>Lista: <span className="font-bold">{listName ? listName : 'No seleccionada'}</span></div>
                    <div>Criterio de reemplazo: <br /> <span className="font-bold">
                        {Object.values(ReplacementCriteriaValues).find(v => v.value === replacementCriteria)?.label}
                    </span></div>
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <div className={cn('w-full flex flex-col items-center overflow-hidden h-8 transition-height duration-300 ', {
            'h-[202px]': isOpen
        })}>
            <div
                className={cn("rounded-md rounded-b-none p-2 w-fit text-sm bg-muted-foreground/10 flex items-center gap-2 cursor-pointer hover:text-info transition-all duration-500", {
                    'mt-10 cursor-not-allowed': !branch || !deliveryTime,
                    'mt-0 cursor-pointer': branch && deliveryTime
                })}
                onClick={() => setIsOpen(!isOpen)}>
                <LuInfo size={18} />
                Ver info del pedido
            </div>
            <div className="rounded-md rounded-b-none w-11/12 flex flex-col gap-2 bg-muted-foreground/10 text-[14px] p-4">
                <div>Sucursal:<span className="font-bold text-info ml-2">{branch?.name}</span></div>
                <div>Rango de fechas:
                    <span className="font-bold text-info ml-2">
                        {formatDate(deliveryTime?.from?.toString() || '', true)} - {formatDate(deliveryTime?.to?.toString() || '', true)}
                    </span>
                </div>
                <div>Pick up:<span className="font-bold text-info ml-2">{pickUp ? 'si' : 'no'}</span></div>
                <div>Lista:<span className="font-bold text-info ml-2">{listName ? listName : 'No seleccionada'}</span></div>
                <div>CDR:<span className="font-bold text-info ml-2">
                    {Object.values(ReplacementCriteriaValues).find(v => v.value === replacementCriteria)?.label}
                </span></div>
            </div>
        </div>
    );
}