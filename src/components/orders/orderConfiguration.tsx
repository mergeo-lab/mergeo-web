import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { DeliveryTimeSelector } from "@/components/orders/deliveryTimeSelector";
import { DateRange } from "react-day-picker";
import { BranchSlector } from "@/components/orders/branchsSelector";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import { FileCog } from "lucide-react";
import { UUID } from "crypto";
import { Label } from "@/components/ui/label";
import mapIcon from '@/assets/map.svg';
import { Switch } from "@/components/ui/switch";
import { PickUpSelectMap } from "@/components/orders/pickUpSelectMap";
import { BranchesSchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReplacementCriteria, ReplacementCriteriaValues } from "@/lib/constants";
import ListSelector from "@/components/orders/ListSelector";
import { FieldValues } from 'react-hook-form';

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    triggerButton?: React.ReactNode
    callback: () => void
    onLoading: () => void
}

export function OrderConfig(
    {
        title = 'Seleccione los parametros de su busqueda!',
        subTitle = '',
        icon = <FileCog />,
        companyId,
        triggerButton,
        callback,
        onLoading,
    }: Props) {

    const [open, setOpen] = useState(true);
    const { deliveryTime, setDeliveryTime, setBranch, setPickUp, setPickUpLocation, pickUpLocation, branch, selectList, removeList, listId, setReplacementCriteria, replacementCriteria, isValid } = UseSearchConfigStore();

    async function onSubmit() {
        onLoading();
        callback();
        setOpen(false);
        // const response = await mutation.mutateAsync({ companyId: companyId, body: fields });

    }
    // we prevent the dialog from closing when clicking outside
    const handleOpenChange = (open: boolean) => {
        // Prevent closing the dialog when clicking outside
        if (open === false) return;
        setOpen(open);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full flex mt-2" asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-full" showClose={false}>
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {subTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 px-20'>
                    {/* first section - tiempo y lugar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label id='name'>Tiempo de entrega</Label>
                            <div className="border rounded border-border p-5">
                                <DeliveryTimeSelector
                                    className="w-full"
                                    defaultValue={deliveryTime}
                                    onDateChange={(newDate: DateRange) => {
                                        if (newDate.from && newDate.to) {
                                            setDeliveryTime({ from: newDate.from, to: newDate.to });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <Label id='address'>Lugar de entrega</Label>
                            <div className="border rounded border-border p-5">
                                <BranchSlector
                                    onChange={(branch: BranchesSchemaType) => setBranch(branch)} />
                            </div>
                        </div>
                    </div>

                    {/* second section - pickup */}
                    <div className="grid grid-cols-1">
                        <div>
                            <Label id='name'>Pick Up</Label>
                            <div className="border rounded border-border p-2 flex gap-4 relative overflow-hidden">
                                <div className={cn("absolute top-0 right-0 bg-black/10 w-full h-full transition-all pointer-events-none", {
                                    "opacity-0 pointer-events-all": branch !== null
                                })}></div>
                                <div className="bg-border rounded p-2 w-14 flex justify-center items-center">
                                    <img src={mapIcon} alt="map" />
                                </div>
                                <div className="flex flex-col justify-center ">
                                    <div className="flex items-center space-x-2">
                                        <Switch disabled={branch === null} id="airplane-mode" onClick={() => {
                                            if (branch === null) return
                                            setPickUpLocation({
                                                location: {
                                                    latitude: branch?.address?.location?.coordinates[1],
                                                    longitude: branch?.address?.location?.coordinates[0]
                                                },
                                                radius: pickUpLocation.radius || 1
                                            })
                                            setPickUp();
                                        }} />
                                        <Label htmlFor="airplane-mode">Estoy dispuesto a hacer pick up</Label>
                                    </div>
                                    <p className="text-sm ml-10 text-muted font-light">Hay proveedores que no tienen entrega en tu local, selecciona si estas dispuesto a ir a buscar el pedido</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* third section - criterio de reemplazo y listas de busqueda */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label id='name'>Criterio de reemplazo</Label>
                            <div className="border rounded border-border h-48">
                                <RadioGroup
                                    defaultValue={replacementCriteria}
                                    onChange={(event) => setReplacementCriteria((event.target as HTMLInputElement).value as ReplacementCriteria)}
                                    className="flex flex-col gap-3 p-5"
                                >
                                    {Object.entries(ReplacementCriteriaValues).map(([key, item]) => (
                                        <div key={item.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={item.value} id={key} />
                                            <Label htmlFor={key}>{item.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                <div className="border-t border-border p-5 text-sm text-muted font-thin">
                                    En el caso que el producto seleccionado no se encuentre en stock o el proveedor no acepte la orden de compra.
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label id='address'>Usar una Lista</Label>
                            <div className="border rounded border-border p-5 h-48 overflow-auto">
                                <ListSelector
                                    selectedListId={listId}
                                    onChange={(listId: string) => selectList(listId)}
                                    removeSelection={() => removeList()}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="w-full border top-1 px-6 py-3">
                    <DialogClose className="w-40" disabled={!isValid}>
                        <Button disabled={!isValid} onClick={onSubmit} type="submit" className="w-full">Guardar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}