import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JSX, useEffect, useState } from "react";
import { DeliveryTimeSelector } from "@/components/configuration/client/orders/searchConfig/deliveryTimeSelector";
import { DateRange } from "react-day-picker";
import { BranchSlector } from "@/components/configuration/client/orders/searchConfig/branchsSelector";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import { FileCog } from "lucide-react";
import { Label } from "@/components/ui/label";
import mapIcon from '@/assets/map.svg';
import { Switch } from "@/components/ui/switch";
import { BranchesSchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReplacementCriteriaValues } from "@/lib/constants";
import ListSelector from "@/components/configuration/client/orders/searchConfig/listSelector";
import LoadingIndicator from "@/components/loadingIndicator";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    triggerButton?: React.ReactNode
    openDialog?: boolean
    callback: () => void
    onLoading: () => void
    onCancel: () => void
}

export function OrderConfig(
    {
        title = 'Seleccione los parametros de su busqueda!',
        subTitle = '',
        icon = <FileCog />,
        triggerButton,
        openDialog = true,
        callback,
        onLoading,
        onCancel,
    }: Props) {

    const [open, setOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { deliveryTime, setDeliveryTime, setBranch, setPickUp, setPickUpDialog, pickUp, setPickUpLocation, pickUpLocation, branch, selectList, removeList, listId, setReplacementCriteria, replacementCriteria, isValid, resetConfig, shouldResetConfig, setShouldResetConfig } = UseSearchConfigStore();

    // when we open we load and reset the data
    // this is to avoid a flicker in the main screen
    useEffect(() => {
        setIsLoading(true);
        if (open && shouldResetConfig) {
            setTimeout(() => {
                setShouldResetConfig(false);
                resetConfig();
                setIsLoading(false);
            }, 300)
        } else {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    async function onSubmit() {
        onLoading();
        callback();
        setOpen(false);
    }
    // we prevent the dialog from closing when clicking outside
    const handleOpenChange = (open: boolean) => {
        // Prevent closing the dialog when clicking outside
        if (open === false) return;
        setOpen(open);
    };

    useEffect(() => {
        if (openDialog) {
            setOpen(true);
        } else setOpen(false);
    }, [openDialog, onCancel]);

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
                {isLoading ? (
                    <div className="w-full h-full min-h-[445px] px-20 flex items-center justify-center">
                        <LoadingIndicator />
                    </div>
                ) :
                    <div className='space-y-4 px-20 min-h-[435px]'>
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
                                        defaultValue={branch?.id ?? ""}
                                        onChange={(branch: BranchesSchemaType) => setBranch(branch)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* second section - pickup */}
                        <div className="grid grid-cols-1">
                            <div>
                                <Label id='name'>
                                    Pick Up
                                    <span className={cn("text-sm font-thin text-muted-foreground ml-2",
                                        {
                                            "hidden": !pickUp
                                        }
                                    )}>( Haz click en el mapa para cambiar el area seleccionada! )</span>
                                </Label>
                                <div className="border rounded border-border p-2 flex gap-4 relative overflow-hidden">
                                    <div className={cn("absolute top-0 right-0 bg-black/10 w-full h-full transition-all pointer-events-none", {
                                        "opacity-0 pointer-events-all": branch !== null
                                    })}></div>
                                    <div onClick={() => pickUp == true ? setPickUpDialog(true) : ""}
                                        className={cn("bg-border rounded p-2 w-14 flex justify-center items-center",
                                            {
                                                "shadow-sm shadow-primary bg-primary/10 cursor-pointer": pickUp
                                            }
                                        )}>
                                        <img src={mapIcon} alt="map" />
                                    </div>
                                    <div className="flex flex-col justify-center ">
                                        <div className="flex items-center space-x-2">
                                            <Switch defaultChecked={pickUp} disabled={branch === null} onClick={() => {
                                                if (branch === null) return
                                                // we set the location of the selected branch on the map to select the pikup radius
                                                if (pickUp) {
                                                    setPickUpLocation({ ...pickUpLocation, radius: 1 })
                                                } else {
                                                    setPickUpLocation({
                                                        location: {
                                                            latitude: branch?.address?.location?.coordinates[1],
                                                            longitude: branch?.address?.location?.coordinates[0]
                                                        },
                                                        radius: pickUpLocation.radius || 1
                                                    })
                                                    setPickUpDialog()
                                                }
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
                                        value={replacementCriteria}
                                        className="flex flex-col gap-3 p-5"
                                    >
                                        {Object.entries(ReplacementCriteriaValues).map(([key, item]) => (
                                            <div key={item.value} className="flex items-center space-x-2" onClick={() => setReplacementCriteria(item.value)}>
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
                }

                <DialogFooter className="w-full border top-1 px-6 py-3">
                    <DialogClose className="w-40">
                        <Button onClick={onCancel} variant="secondary" type="button" className="w-full">Cancelar</Button>
                    </DialogClose>
                    <DialogClose className="w-40" disabled={!isValid}>
                        <Button disabled={!isValid} onClick={onSubmit} type="button" className="w-full">Guardar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}