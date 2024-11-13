import { SelectScrollable } from "@/components/selectScrollable";
import ToggleSelect from "@/components/toggleSelct";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { PickUpSchedulesSchemaType } from "@/lib/schemas/pickUp.schema";
import { generateHourSlots, timeStringToNumber } from "@/lib/utils";
import useDaysPickerStore from "@/store/daysPicker.store";
import { HourSlot } from "@/types";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

type Props = {
    triggerButton?: React.ReactNode
}
export default function ChooseTime({ triggerButton }: Props) {
    const [open, setOpen] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const {
        selectedDays,
        startHour,
        endHour,
        allDays,
        toggleDay,
        setStartHour,
        setEndHour,
        addDayAndTime,
        reset,
        selectAllDays,
        unselectAllDays
    } = useDaysPickerStore();
    const listOfHours: HourSlot[] = generateHourSlots(24);

    useEffect(() => {
        setAllSelected(selectedDays.length === allDays.length);
    }, [selectedDays, allDays]);

    function getDisabledHours() {
        const startIndex = listOfHours.findIndex(hour => hour.value === startHour.split(" ")[0]);
        return listOfHours.slice(0, startIndex + 1).map(hour => hour.value);
    }

    function addSelectedTime(e: React.FormEvent) {
        e.preventDefault();

        selectedDays.forEach(dayValue => {
            const dayName = allDays.find(d => d.value === dayValue)?.name;
            const newEntry: PickUpSchedulesSchemaType = {
                id: crypto.randomUUID(),
                day: dayName || '',
                startHour: timeStringToNumber(startHour),
                endHour: timeStringToNumber(endHour),
            };
            addDayAndTime(newEntry);
        });

        setOpen(false);
        reset();
    }

    function handleOpen() {
        setOpen(!open);
        unselectAllDays();
    }

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-fit p-10">
                <DialogHeader>
                    <DialogTitle>Seleccione un dia y un rango horario</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="w-full flex gap-2">
                        {allDays.map(day => (
                            // <Toggle
                            //     variant="outline"
                            //     size="lg"
                            //     aria-label="Toggle"
                            //     onClick={() => toggleDay(day.value)}
                            //     className={selectedDays.includes(day.value) ? 'border-primary bg-white' : ''}
                            //     key={day.value}>
                            //     {day.name}
                            // </Toggle>
                            <ToggleSelect
                                key={day.value}
                                value={day.name}
                                onClick={() => toggleDay(day.value)}
                                variant={selectedDays.includes(day.value) ? 'selected' : 'normal'}
                            >
                                {day.name}
                            </ToggleSelect>


                        ))}
                        <ToggleSelect
                            onClick={selectAllDays}
                            variant={allSelected ? 'selected' : 'normal'}
                        >
                            Todos
                        </ToggleSelect>
                    </div>

                    <Label>Rango Horario</Label>
                    <div className="flex gap-2">
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
                    </div>

                    <Button onClick={addSelectedTime} disabled={!startHour || !endHour}>
                        Agregar
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
