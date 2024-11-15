import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import MapRadiusSelection from "@/components/configuration/client/orders/searchConfig/mapRadiusSelection";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    showDialog: boolean,
    onClose: () => void
}

export function PickUpSelectMap(
    {
        title = 'Selecciona la zona de Pick Up',
        subTitle = 'Esta es la zona de Pick Up donde estas dispuesto a buscar tu pedido',
        icon = <Compass />,
        showDialog = false,
        onClose
    }: Props) {
    const [open, setOpen] = useState(showDialog);
    const { pickUpLocation, branch } = UseSearchConfigStore();

    useEffect(() => {
        if (!showDialog) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [showDialog])


    useEffect(() => {
        if (!open) onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Dialog
            modal={false}
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setOpen(false);
                } else {
                    setOpen(true);
                }
            }}>
            <DialogContent className="w-full m-0 p-0">
                <DialogHeader className="px-6 py-3 absolute top-0 left-0 shadow-md z-10 w-full bg-white">
                    <DialogTitle className="flex items-center gap-2 ">
                        {icon}
                        {title}
                    </DialogTitle>
                    <DialogDescription className="ml-8">
                        {subTitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full h-[650px] overflow-hidden">
                    <MapRadiusSelection
                        initialCenter={{ lat: pickUpLocation.location.latitude, lng: pickUpLocation.location.longitude }}
                        branchName={branch?.name || 'Sin nombre'}
                    />
                </div>

                <DialogFooter className="w-full absolute border bottom-0 bg-white px-6 py-3">
                    <DialogClose className="w-40">
                        <Button className="w-full">Guardar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}