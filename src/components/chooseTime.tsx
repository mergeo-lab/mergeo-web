import { SelectScrollable } from "@/components/selectScrollable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { PickUpSchedulesSchemaType } from "@/lib/schemas/pickUp.schema";
import { generateHourSlots, timeStringToNumber } from "@/lib/utils";
import useDaysPickerStore from "@/store/daysPicker.store";
import { HourSlot } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

type Props = {
    triggerButton?: React.ReactNode
}

export default function ChooseTime({ triggerButton }: Props) {
    const [open, setOpen] = useState(false);
    const { day, startHour, endHour, allDays, setDay, setStartHour, setEndHour, addDayAndTime, reset } = useDaysPickerStore();
    const listOfHours: HourSlot[] = generateHourSlots(24);
    const [isAllDaysChecked, setIsAllDaysChecked] = useState(false);

    function getDisabledHours() {
        const startIndex = listOfHours.findIndex(hour => hour.value === startHour.split(" ")[0]);
        return listOfHours.slice(0, startIndex + 1).map(hour => hour.value);  // Disable times before the selected start time
    }

    function handleChange(checked: CheckedState) {
        // Convert the `checked` value to a boolean (`true` or `false`)
        if (checked === "indeterminate") {
            setIsAllDaysChecked(false); // Handle "indeterminate" as false, or customize this behavior
        } else {
            setIsAllDaysChecked(checked);
        }
    }

    function addSelectedTime(e: React.FormEvent) {
        e.preventDefault();

        if (isAllDaysChecked) {
            // If "Apply to all days" is checked, add an entry for each day
            allDays.forEach((day) => {
                const newEntry: PickUpSchedulesSchemaType = {
                    id: crypto.randomUUID(),
                    day: day.name, // Add the day for each entry
                    startHour: timeStringToNumber(startHour),
                    endHour: timeStringToNumber(endHour),
                };
                addDayAndTime(newEntry); // Add the entry for each day
            });
        } else {
            // Add the entry for the selected day
            const dayName = allDays.find(d => d.value === day)?.name;
            const newEntry: PickUpSchedulesSchemaType = {
                id: crypto.randomUUID(),
                day: dayName || '',
                startHour: timeStringToNumber(startHour),
                endHour: timeStringToNumber(endHour),
            };
            addDayAndTime(newEntry);
        }

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
                <div className="flex items-center space-x-2 bg-border p-4 rounded">
                    <Checkbox
                        id="allDays"
                        className="border-secondary"
                        checked={isAllDaysChecked}
                        onCheckedChange={handleChange}
                        disabled={!startHour || !endHour} />
                    <label
                        htmlFor="allDays"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Aplicar a todos los dias
                    </label>
                </div>
            </DialogContent>
        </Dialog>
    )
}