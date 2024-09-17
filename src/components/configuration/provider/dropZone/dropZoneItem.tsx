import { Button } from "@/components/ui/button";
import { DropZoneSchemaType } from "@/lib/configuration/schemas/dropZone.schemas"
import { Map, PenIcon, Trash2 } from "lucide-react";
import ScheduleHoverCard from "@/components/scheduleHoverCard";
import { cn } from "@/lib/utils";

type Props = {
    item: DropZoneSchemaType,
    isEditing: string,
    remove: (id: string) => void
    edit: (id: string) => void
    showMap: (id: string) => void
}

export default function DropZoneItem({ item, isEditing, remove, edit, showMap }: Props) {
    return (
        <div className={cn("flex flex-col justify-between gap-2 w-48 bg-accent rounded overflow-hidden")}>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-4 pt-4">
                    <Map size={20} className="text-primary" />
                    <p className="text-ellipsis text-nowrap w-32 overflow-hidden">
                        {item.name}
                    </p>
                </div>
                <div className="px-4">
                    <ScheduleHoverCard schedules={item.schedules} />
                </div>

            </div>
            <div className="w-48 flex justify-end items-center bg-muted/40 relative">
                {isEditing == item.id && <span className="bg-highlight text-white text-sm absolute left-2 px-2 rounded">EDITING</span>}
                <Button variant="ghost" className="hover:bg-muted hover:text-white h-8 w-8 p-0" onClick={() => showMap(item.id!)}>
                    <Map size={15} />
                </Button>
                <Button variant="ghost" className="hover:bg-muted hover:text-white h-8 w-8 p-0" onClick={() => remove(item.id!)}>
                    <Trash2 size={15} />
                </Button>
                <Button variant="ghost" className="hover:bg-muted hover:text-white h-8 w-8 p-0" onClick={() => edit(item.id!)}>
                    <PenIcon size={15} />
                </Button>
            </div>
        </div>
    )
}