// import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { LandPlot } from "lucide-react";
import DrawingMap from "@/components/map/drawingMap";
import useZoneStore from "@/store/zone.store";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string,
    triggerButton?: React.ReactNode,
    addZone: (zone: google.maps.LatLngLiteral[]) => void
}

export function NewDropZone(
    {
        title = 'Agregar una sucursal',
        subTitle = 'Aquí puedes agregar una nueva zona de reparto',
        icon = <LandPlot />,
        triggerButton,
        addZone
    }: Props) {
    const [open, setOpen] = useState(false);
    const { zone } = useZoneStore();

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        }}>
            <DialogTrigger className="w-full flex mt-2" asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-full">
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {subTitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full h-[650px] overflow-hidden p-0 m-0">
                    <DrawingMap />
                </div>

                <DialogFooter className="w-full border top-1 px-6 py-3">
                    <DialogClose className="w-40">
                        <Button variant="secondary" className="w-full">Cancelar</Button>
                    </DialogClose>
                    <DialogClose className="w-40">
                        <Button onClick={() => addZone(zone)} type="submit" className="w-full">Guardar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}