
import ChooseTime from "@/components/chooseTime";
import { Button } from "@/components/ui/button";
import useDaysPickerStore from "../store/daysPicker.store";
import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function DaysPicker({ callback }: { callback: () => void }) {
    const { daysAndTime, removeById } = useDaysPickerStore();
    const prevDaysAndTime = useRef(daysAndTime);

    function handelRemoveDay(id: string) {
        console.log(id);
        removeById(id);
    }

    useEffect(() => {
        if (prevDaysAndTime.current !== daysAndTime) {
            callback();
            prevDaysAndTime.current = daysAndTime;  // Update the reference to the current state
        }
    }, [daysAndTime, callback]);

    return (
        <div className="relative">
            <ChooseTime triggerButton={
                <Button className="absolute -top-[35px] right-0" variant="outline" size={"xs"}>Agregar Dia y Horario</Button>
            } />
            <div className="flex flex-col gap-2 border p-4 relative h-32 overflow-auto">
                <div>
                    {
                        daysAndTime.length ?
                            daysAndTime.map((dt, index) => (
                                <div key={index} className="text-md flex justify-between items-center space-x-4 border p-1 m-1">
                                    <span className="ml-2">{dt.day}</span>
                                    <span>{dt.startHour} - {dt.endHour}</span>
                                    <Button type="button" variant="ghost" onClick={() => handelRemoveDay(dt.id)}>
                                        <Trash2 className="cursor-pointer" size={15} />
                                    </Button>
                                </div>
                            ))
                            : <div className="text-md border p-1 m-1 text-center">No has agregado ningun dia ni horario</div>
                    }
                </div>
            </div>

        </div>
    );
}