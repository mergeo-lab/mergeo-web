import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useEffect, useState } from "react";

type Props = {
  values: string[] | null;
  triggerLabel: string;
  disabled?: boolean | null;
  callback: (selectedValues: string[]) => void;
};

function CheckboxItem({
  value,
  checked = true,
  onChange,
}: {
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox"
      />
      <span>{value}</span>
    </label>
  );
}

export function DropdownMenuCheckboxes({ values, triggerLabel, disabled, callback }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (values) {
      // Set all values as selected by default
      setSelectedValues(values);
      callback(values); // Call callback with all values
    }
  }, [values]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled || false}>
        <Button variant="outlineSecondary" onClick={() => setOpen(!open)}>
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        {values && values.map((value) => (
          <CheckboxItem
            key={value}
            value={value} // This will be used as a label for the checkbox
            checked={selectedValues.includes(value)}
            onChange={(checked) => {
              // Ensure that at least one checkbox remains checked
              if (!checked && selectedValues.length === 1) {
                return; // Do nothing if attempting to uncheck the last item
              }

              const newSelectedValues = checked
                ? [...selectedValues, value]
                : selectedValues.filter((v) => v !== value);

              setSelectedValues(newSelectedValues);
              callback(newSelectedValues);
              // Do not close the popover
            }}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
