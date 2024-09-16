import { SelectScrollable } from "@/components/selectScrollable";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { PickUpSchedulesSchemaType } from "@/lib/configuration/schemas/pickUp.schema";
import { generateHourSlots } from "@/lib/utils";
import useDaysPickerStore from "@/store/daysPicker.store";
import { HourSlot } from "@/types";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

type Props = {
    triggerButton?: React.ReactNode
}

export default function ChooseTime({ triggerButton }: Props) {
    const [open, setOpen] = useState(false);
    const { day, startHour, endHour, allDays, setDay, setStartHour, setEndHour, addDayAndTime, reset } = useDaysPickerStore();
    const listOfHours: HourSlot[] = generateHourSlots(24);

    function getDisabledHours() {
        const startIndex = listOfHours.findIndex(hour => hour.value === startHour.split(" ")[0]);
        return listOfHours.slice(0, startIndex + 1).map(hour => hour.value);  // Disable times before the selected start time
    }

    function addSelectedTime(e: React.FormEvent) {
        e.preventDefault();
        const dayName = allDays.find(d => d.value === day)?.name;
        const newEntry: PickUpSchedulesSchemaType = {
            id: crypto.randomUUID(),
            day: dayName || '',
            startHour,
            endHour,
        };
        addDayAndTime(newEntry);
        setOpen(false);
        reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-10">
                <DialogHeader>
                    <DialogTitle>Seleccione un dia y un rango horario</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">

                    <SelectScrollable
                        className="w-1/3"
                        data={allDays}
                        defautlt={day}
                        onChange={(selectedDay) => setDay(selectedDay)}
                    />
                    <SelectScrollable
                        placeholder="Desde"
                        className="w-1/3"
                        data={listOfHours}
                        defautlt={startHour}
                        onChange={(startHour) => setStartHour(startHour)}
                    />
                    <SelectScrollable
                        placeholder="Hasta"
                        className="w-1/3"
                        data={listOfHours.map(hour => ({
                            ...hour,
                            disabled: getDisabledHours().includes(hour.value)
                        }))}
                        defautlt={endHour}
                        onChange={(endHour) => setEndHour(endHour)}
                    />
                    <Button onClick={addSelectedTime} disabled={!startHour || !endHour}>
                        Agregar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}