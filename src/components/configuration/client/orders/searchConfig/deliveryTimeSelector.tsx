import * as React from "react";
import { addDays, format, isBefore, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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
  const today = startOfToday();

  const [lastDate, setLastDate] = React.useState<DateRange | undefined>(() => {
    return defaultValue ?? { from: today, to: addDays(today, 1) };
  });

  const [date, setDate] = React.useState<DateRange | undefined>(lastDate);
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate && newDate.to && isBefore(newDate.to, today)) {
      newDate.to = today;
    }
    setDate(newDate);
  };

  const handleApply = () => {
    if (date) {
      setLastDate(date);
      onDateChange(date);
      setOpen(false); // ⬅️ Cierra el Popover
    }
  };

  const resetDateOnOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setDate(lastDate); // Restaurar fecha anterior si el usuario cancela
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={resetDateOnOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outlineSecondary"
            className={cn(
              "justify-start text-left font-normal",
              !lastDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2" />
            {lastDate?.from ? (
              lastDate.to ? (
                <>
                  {format(lastDate.from, "LLL dd, y")} -{" "}
                  {format(lastDate.to, "LLL dd, y")}
                </>
              ) : (
                format(lastDate.from, "LLL dd, y")
              )
            ) : (
              <span>Seleccione un día</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1" align="start">
          <Calendar
            initialFocus
            defaultMonth={today}
            fromMonth={today}
            disabled={(date) => date < today}
            mode="range"
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
          <Button className="mt-2 w-full" onClick={handleApply}>
            Aplicar
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
