
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type SelectItem = {
    name: string
    value: string
    disabled?: boolean
}

type Props = {
    data: SelectItem[],
    defautlt: string
    placeholder?: string
    className?: string
    onChange?: (value: string) => void
}

export function SelectScrollable({ data, defautlt, placeholder, className, onChange }: Props) {
    return (
        <Select onValueChange={onChange} defaultValue={defautlt} value={defautlt}>
            <SelectTrigger className={cn("w-[280px]", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="overflow-y-auto">
                <SelectGroup>
                    {
                        data.map((item: SelectItem) => (
                            <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                                {item.name}
                            </SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
