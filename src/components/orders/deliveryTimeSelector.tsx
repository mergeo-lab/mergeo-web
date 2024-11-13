"use client"

import * as React from "react"
import { addDays, format, isBefore, startOfToday } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string;
  onDateChange: (date: DateRange) => void;
  defaultValue?: DateRange;
}

export function DeliveryTimeSelector({
  className,
  onDateChange,
  defaultValue,
}: DatePickerWithRangeProps) {
  const today = new Date();

  const [date, setDate] = React.useState<DateRange>(
    defaultValue ?? { from: today, to: addDays(today, 7) }
  );

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate && newDate.to && isBefore(newDate.to, today)) {
      newDate.to = today;
    }
    if (newDate) {
      setDate(newDate);
      onDateChange(newDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outlineSecondary"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Seleccione un día</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            defaultMonth={startOfToday()}
            mode="range"
            fromMonth={startOfToday()}
            selected={date}
            onSelect={(newDate) => handleDateSelect(newDate)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}