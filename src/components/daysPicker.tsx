
import ChooseTime from "@/components/chooseTime";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { PickUpSchedulesSchemaType } from '../lib/schemas'
import useDaysPickerStore from "@/store/daysPicker.store";
import { cn, numberToTimeString } from "@/lib/utils";

type Props = {
    defaultData?: PickUpSchedulesSchemaType[] | undefined,
    isEditing: boolean,
    className?: string,
    callback: () => void,
}

export default function DaysPicker({ defaultData, isEditing, className, callback }: Props) {
    const { daysAndTime, removeById, addMultipleDaysAndTime, removeAll } = useDaysPickerStore();
    const prevDaysAndTime = useRef(daysAndTime);

    function handelRemoveDay(id: string) {
        removeById(id);
    }

    useEffect(() => {
        removeAll();
        if (defaultData) {
            addMultipleDaysAndTime(defaultData);
        }
    }, [addMultipleDaysAndTime, defaultData, removeAll]);

    useEffect(() => {
        if (prevDaysAndTime.current !== daysAndTime) {
            callback();
            prevDaysAndTime.current = daysAndTime;  // Update the reference to the current state
        }
    }, [daysAndTime, callback]);

    return (
        <div className="relative">
            {isEditing &&
                <ChooseTime triggerButton={
                    <Button className="absolute -top-[35px] right-0" variant="outline" size={"xs"}>Agregar Dia y Horario</Button>
                } />
            }
            <div className={cn("flex flex-col gap-2 border p-4 relative max-h-32 h-32 overflow-auto", className)}>
                {
                    daysAndTime.length ?
                        daysAndTime.map((dt: PickUpSchedulesSchemaType, index: number) => (
                            <div key={index} className="flex text-sm justify-between items-center border p-1 m-1">
                                <span className="ml-2">{dt.day}</span>
                                <span>{numberToTimeString(dt.startHour)} - {numberToTimeString(dt.endHour)}</span>
                                {isEditing &&
                                    <Button type="button" variant="ghost" size="xs" className="hover:text-destructive" onClick={() => handelRemoveDay(dt.id)}>
                                        <Trash2 className="cursor-pointer" size={15} />
                                    </Button>
                                }
                            </div>
                        ))
                        : <div className="flex justify-center items-center w-full h-full">
                            <div className="border p-1 m-1 w-full text-center">No has agregado ningun dia</div>
                        </div>
                }
            </div>

        </div>
    );
}