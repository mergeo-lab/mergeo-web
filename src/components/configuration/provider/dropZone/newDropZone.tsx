// import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { toast } from "@/components/ui/use-toast";
// import { GoogleLocationSchemaType } from "@/lib/common/schemas";
// import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
// import { LatLngLiteral } from "@/types";
import { LandPlot } from "lucide-react";
import DrawingMap from "@/components/map/drawingMap";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string,
    triggerButton?: React.ReactNode
    callback: () => void
    onLoading: () => void
}

export function NewDropZone(
    {
        title = 'Agregar una sucursal',
        subTitle = 'Aquí puedes agregar una nueva sucursal',
        icon = <LandPlot />,
        triggerButton,
    }: Props) {
    const [open, setOpen] = useState(false);
    // const mutation = useMutation({ mutationFn: newPickUpPoints })
    // const [markerPosition, setMarkerPosition] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
    // const { daysAndTime, reset: resetDays } = useDaysPickerStore();


    // function addAddress(address: GoogleLocationSchemaType) {
    //     console.log(" address", address)
    //     form.setValue('address', {
    //         id: address.id,
    //         polygon: {
    //             type: "Point",
    //             coordinates: [address.location.latitude, address.location.longitude]
    //         },
    //         name: address.displayName.text
    //     });

    //     setMarkerPosition({ lat: address.location.latitude, lng: address.location.longitude });
    //     form.trigger('address');
    // }

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
                        <Button type="submit" className="w-full">Guardar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}