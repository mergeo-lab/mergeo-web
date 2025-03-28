// import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { LandPlot } from "lucide-react";
import DrawingMap from "@/components/map/drawingMap";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: React.ReactElement,
    showDialog: boolean
    zone: google.maps.LatLngLiteral[]
    onClose: () => void
}

export function ShowDropZoneMap(
    {
        title = 'Agregar una sucursal',
        subTitle = 'Aquí puedes agregar una nueva zona de reparto',
        icon = <LandPlot />,
        showDialog = false,
        zone,
        onClose
    }: Props) {
    const [open, setOpen] = useState(showDialog);

    useEffect(() => {
        if (!showDialog) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [showDialog])


    useEffect(() => {
        if (!open) onClose();
    }, [open])

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        }}>
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
                    <DrawingMap zone={zone} hideControls />
                </div>

                <DialogFooter className="w-full border top-1 px-6 py-3">
                    <DialogClose className="w-40">
                        <Button variant="secondary" className="w-full">cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}