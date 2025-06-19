import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JSX, useEffect, useState } from "react";
import UseSearchConfigStore from "@/store/searchConfiguration.store";
import MapRadiusSelection from "@/components/configuration/client/orders/searchConfig/mapRadiusSelection";
import { ImCompass2 } from "react-icons/im";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    showDialog: boolean,
    onClose: () => void
}

export default function PickUpSelectMap(
    {
        title = 'Selecciona la zona de Pick Up',
        subTitle = 'Esta es la zona de Pick Up donde estas dispuesto a buscar tu pedido',
        icon = <ImCompass2 />,
        showDialog = false,
        onClose
    }: Props) {
    console.log('Rendering PickUpSelectMap');
    const [open, setOpen] = useState(showDialog);
    const { tempBranch: branch } = UseSearchConfigStore();

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
            modal={true}
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setOpen(false);
                } else {
                    setOpen(true);
                }
            }}>
            <DialogContent className="w-full m-0 p-0" showClose={false}>
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
                        initialCenter={{ lat: branch?.address?.location?.coordinates[1] ?? 0, lng: branch?.address?.location?.coordinates[0] ?? 0 }}
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