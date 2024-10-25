import DropZoneItem from "@/components/configuration/provider/dropZone/dropZoneItem";
import { DropZoneSchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { MapPinned } from "lucide-react";

type Props = {
    list: DropZoneSchemaType[],
    className?: string
    isEditing: string,
    startEditing: (id: string) => void,
    deleteZone: (id: string) => void,
    handleShowMap: (id: string) => void
}

export default function DropZoneList({ list, className, isEditing, startEditing, deleteZone, handleShowMap }: Props) {

    function handleRemove(id: string) {
        deleteZone(id);
    }

    function handleEdit(id: string) {
        startEditing(id);
    }

    return (
        <div>
            <p className="font-bold mx-3 my-5 flex items-center gap-2">
                <MapPinned />
                Zonas de reparto Agregadas:
            </p>
            <div className={cn("flex ml-3 flex-wrap w-full mt-2 gap-2 max-h-60 overflow-y-auto", className)}>
                {list.length ?
                    list.map((item: DropZoneSchemaType, index: number) => (
                        <DropZoneItem isEditing={isEditing} key={index} item={item} remove={handleRemove} edit={handleEdit} showMap={handleShowMap} />
                    ))
                    : <div className="w-full mr-5 bg-muted/30 p-5 flex justify-center items-center">
                        <p>No hay zonas de reparto agregadas</p>
                    </div>
                }
            </div>
        </div>
    )
}
