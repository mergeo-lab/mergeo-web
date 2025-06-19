// import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DrawingMap from "@/components/map/drawingMap";
import { LuLandPlot } from "react-icons/lu";

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
        icon = <LuLandPlot />,
        showDialog = false,
        zone,
        onClose
    }: Props) {

    return (
        <Dialog open={showDialog} onOpenChange={(isOpen) => {
            if (!isOpen) {
                onClose();
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
                <div className="w-full h-[calc(100vh-230px)] overflow-hidden p-0 m-0">
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