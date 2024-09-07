import { SelectScrollable } from "@/components/selectScrollable";
import ToggleAmPM from "@/components/toggleAmPM";
import { generateHourSlots } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function TimeSelector({ onChange, disabledHours = [] }: { onChange: (value: string) => void, disabledHours?: string[] }) {
    const listOfHours = generateHourSlots(12);
    const [selectedTime, setSelectedTime] = useState(listOfHours[0].value);
    const [selectedDayTime, setSelectedDayTime] = useState('am');

    useEffect(() => {
        onChange(`${selectedTime} ${selectedDayTime}`)
    }, [selectedTime, selectedDayTime, onChange]);

    function handleChange(hour: string) {
        setSelectedTime(hour);
    }

    function toggleDayTime(dayTime: string) {
        setSelectedDayTime(dayTime);
    }

    return (
        <div className="flex items-center relative">
            <SelectScrollable
                className="w-28 pr-12"
                data={listOfHours.map(hour => ({
                    ...hour,
                    disabled: disabledHours.includes(hour.value)  // Disable unavailable hours
                }))}
                defautlt={selectedTime}
                onChange={(val: string) => handleChange(val)}
            />
            <ToggleAmPM
                className="rounded-tl-none rounded-bl-none absolute right-0"
                defaultTime="am"
                onChange={(dayTime: string) => toggleDayTime(dayTime)}
            />
        </div>
    );
}
