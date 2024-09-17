import DropZoneItem from "@/components/configuration/provider/dropZone/dropZoneItem";
import { DropZoneSchemaType } from "@/lib/configuration/schemas/dropZone.schemas";
import { cn } from "@/lib/utils";
import UseDropZonesStore from "@/store/dropZones.store";

type Props = {
    list: DropZoneSchemaType[],
    className?: string
    isEditing: string,
    startEditing: (id: string) => void,
    handleShowMap: (id: string) => void
}

export default function DropZoneList({ list, className, isEditing, startEditing, handleShowMap }: Props) {
    const { removeDropZone } = UseDropZonesStore();

    function handleRemove(id: string) {
        removeDropZone(id);
    }


    function handleEdit(id: string) {
        startEditing(id);
    }

    return (
        <div className={cn("flex flex-wrap gap-2 mt-2", className)}>
            {
                list.map((item: DropZoneSchemaType, index: number) => (
                    <DropZoneItem isEditing={isEditing} key={index} item={item} remove={handleRemove} edit={handleEdit} showMap={handleShowMap} />
                ))
            }
        </div>
    )
}
