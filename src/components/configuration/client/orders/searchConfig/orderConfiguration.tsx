import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JSX, useEffect, useState, useCallback } from "react";
import { DeliveryTimeSelector } from "@/components/configuration/client/orders/searchConfig/deliveryTimeSelector";
import { DateRange } from "react-day-picker";
import { BranchSlector } from "@/components/configuration/client/orders/searchConfig/branchsSelector";
import { Label } from "@/components/ui/label";
import mapIcon from '@/assets/map.svg';
import { Switch } from "@/components/ui/switch";
import { BranchesSchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReplacementCriteria, ReplacementCriteriaValues } from "@/lib/constants";
import ListSelector from "@/components/configuration/client/orders/searchConfig/listSelector";
import LoadingIndicator from "@/components/loadingIndicator";
import { HiOutlineCog } from "react-icons/hi";
import UseSearchConfigStore from "@/store/searchConfiguration.store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LuInfo } from "react-icons/lu";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    triggerButton?: React.ReactNode
    openDialog?: boolean
    callback: (listId: string) => void
    onCancel: () => void
    onLoading?: () => void
}

export default function OrderConfig(props: Props) {
    const {
        title = 'Seleccione los parametros de su busqueda!',
        subTitle = '',
        icon = <HiOutlineCog />,
        triggerButton,
        openDialog = true,
        callback,
        onLoading,
        onCancel,
    } = props;

    const [open, setOpen] = useState(openDialog);
    const [isLoading, setIsLoading] = useState(false);
    const [showSavedConfigDialog, setShowSavedConfigDialog] = useState(false);
    const {
        deliveryTime, setDeliveryTime, setBranch, branch, setTempBranch, setPickUp, pickUp, setPickUpDialog, setPickUpLocation, pickUpLocation, selectList, listId, setReplacementCriteria, replacementCriteria, resetConfig, shouldResetConfig, setShouldResetConfig, setConfigDataSubmitted, setListName, hasSavedConfig, getSavedConfig, setConfig, listName, clearConfig, setShowOnlyFavorites,
    } = UseSearchConfigStore();

    const [internalList, setInternalList] = useState("");
    const [time, setTime] = useState<DateRange | null>();
    const [selcetedBranch, setSelectedBranch] = useState<BranchesSchemaType | null>(null);
    const [internalRc, setInternalRc] = useState<ReplacementCriteria | null>(null);
    const [internalPickUp, setInternalPickUp] = useState(false);

    // Check for saved configuration when dialog opens
    useEffect(() => {
        if (open && !shouldResetConfig && hasSavedConfig()) {
            setShowSavedConfigDialog(true);
        }
    }, [open, shouldResetConfig, hasSavedConfig]);

    // Reset config when dialog opens and shouldResetConfig is true
    useEffect(() => {
        if (open && shouldResetConfig) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setShouldResetConfig(false);
                resetConfig();
                setIsLoading(false);
                setInternalList("");
                setInternalRc(null);
                setPickUp(false);
                setInternalPickUp(false);
                setTime(null);
                setSelectedBranch(null);
                setDeliveryTime(undefined);
            }, 300);
            return () => clearTimeout(timer);
        }
        if (!shouldResetConfig) {
            setIsLoading(false);
        }
    }, [open, shouldResetConfig, resetConfig, setShouldResetConfig, setPickUp, setDeliveryTime]);

    // Handle dialog open state
    useEffect(() => {
        if (openDialog !== open) {
            setOpen(openDialog);
            if (openDialog) {
                setConfigDataSubmitted(false);
            }
        }
    }, [openDialog, open, setConfigDataSubmitted]);

    const handleUseSavedConfig = useCallback(() => {
        const savedConfig = getSavedConfig();
        setShowSavedConfigDialog(false);

        // Apply saved configuration
        if (savedConfig.deliveryTime) setDeliveryTime(savedConfig.deliveryTime);
        if (savedConfig.branch) setBranch(savedConfig.branch);
        if (savedConfig.listId) selectList(savedConfig.listId);
        if (savedConfig.replacementCriteria) setReplacementCriteria(savedConfig.replacementCriteria);
        if (savedConfig.pickUp) setPickUp(savedConfig.pickUp);
        if (savedConfig.pickUpLocation) setPickUpLocation(savedConfig.pickUpLocation);
        if (savedConfig.listName) setListName(savedConfig.listName);

        // Set internal states
        setTime(savedConfig.deliveryTime || null);
        setSelectedBranch(savedConfig.branch || null);
        setInternalList(savedConfig.listId || "");
        setInternalRc(savedConfig.replacementCriteria || null);
        setInternalPickUp(savedConfig.pickUp || false);

        // Turn off favorites filter for the first search after using saved config
        setShowOnlyFavorites(false);

        // Close dialog and apply configuration immediately
        setConfigDataSubmitted(true);
        callback(savedConfig.listId || "");
        setOpen(false);
    }, [getSavedConfig, setDeliveryTime, setBranch, selectList, setReplacementCriteria, setPickUp, setPickUpLocation, setListName, setShowOnlyFavorites, setConfigDataSubmitted, callback]);

    const handleCreateNewConfig = useCallback(() => {
        setShowSavedConfigDialog(false);
        resetConfig();
        clearConfig();
        setInternalList("");
        setInternalRc(null);
        setPickUp(false);
        setInternalPickUp(false);
        setTime(null);
        setSelectedBranch(null);
        setDeliveryTime(undefined);
    }, [resetConfig, clearConfig, setDeliveryTime]);

    const handleUseModifySavedConfig = useCallback(() => {
        const savedConfig = getSavedConfig();
        setShowSavedConfigDialog(false);

        // Load saved configuration into the form for editing
        if (savedConfig.deliveryTime) setDeliveryTime(savedConfig.deliveryTime);
        if (savedConfig.branch) setBranch(savedConfig.branch);
        if (savedConfig.listId) selectList(savedConfig.listId);
        if (savedConfig.replacementCriteria) setReplacementCriteria(savedConfig.replacementCriteria);
        if (savedConfig.pickUp) setPickUp(savedConfig.pickUp);
        if (savedConfig.pickUpLocation) setPickUpLocation(savedConfig.pickUpLocation);
        if (savedConfig.listName) setListName(savedConfig.listName);

        // Set internal states for editing
        setTime(savedConfig.deliveryTime || null);
        setSelectedBranch(savedConfig.branch || null);
        setInternalList(savedConfig.listId || "");
        setInternalRc(savedConfig.replacementCriteria || null);
        setInternalPickUp(savedConfig.pickUp || false);

        // Keep dialog open for editing
        setOpen(true);
    }, [getSavedConfig, setDeliveryTime, setBranch, selectList, setReplacementCriteria, setPickUp, setPickUpLocation, setListName]);

    const onConfigSave = useCallback(() => {
        if (time) setDeliveryTime(time);
        if (selcetedBranch) setBranch(selcetedBranch);
        if (internalList) selectList(internalList);
        if (internalRc) setReplacementCriteria(internalRc);
        if (internalPickUp !== undefined) setPickUp(internalPickUp);

        // Save configuration to localStorage (this will update the existing saved config)
        const configToSave = {
            deliveryTime: time || deliveryTime,
            branch: selcetedBranch || branch,
            listId: internalList || listId,
            replacementCriteria: internalRc || replacementCriteria,
            pickUp: internalPickUp || pickUp,
            pickUpLocation: pickUpLocation,
            listName: listName,
        };
        setConfig(configToSave);

        // Turn off favorites filter for the first search after config dialog
        setShowOnlyFavorites(false);

        onLoading?.();
        setConfigDataSubmitted(true);
        callback(internalList || "");
        setOpen(false);
    }, [time, selcetedBranch, internalList, internalRc, internalPickUp, setDeliveryTime, setBranch, selectList, setReplacementCriteria, setPickUp, deliveryTime, branch, listId, replacementCriteria, pickUp, pickUpLocation, listName, setConfig, setShowOnlyFavorites, onLoading, setConfigDataSubmitted, callback]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        if (!newOpen) {
            onCancel();
            return;
        }
        setOpen(newOpen);
    }, [onCancel]);

    // Saved configuration dialog
    if (showSavedConfigDialog) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger className="w-full flex mt-2" asChild>
                    <div className="w-full">
                        {triggerButton}
                    </div>
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
                    <div className='space-y-4 px-20 min-h-[435px] relative'>
                        {/* Blur overlay for saved config dialog */}
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-10 flex items-center justify-center">
                            <div className="bg-white border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <LuInfo className="text-blue-500" />
                                    <h3 className="font-semibold text-lg">Configuración Guardada</h3>
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    Se encontró una configuración guardada anteriormente. ¿Qué deseas hacer?
                                </p>
                                <Alert className="mb-6">
                                    <LuInfo className="h-4 w-4" />
                                    <AlertDescription>
                                        Puedes continuar con la configuración anterior o crear una nueva configuración desde cero.
                                    </AlertDescription>
                                </Alert>
                                <div className="flex flex-col gap-3">
                                    <Button onClick={handleCreateNewConfig} variant="secondary" className="w-full">
                                        Crear Nueva Configuración
                                    </Button>
                                    <Button onClick={handleUseModifySavedConfig} className="w-full bg-info hover:bg-info/80">
                                        Modificar Configuración Guardada
                                    </Button>
                                    <Button onClick={handleUseSavedConfig} className="w-full">
                                        Continuar con Configuración Guardada
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Original config content (blurred behind overlay) */}
                        <div className="pointer-events-none opacity-50">
                            {/* first section - tiempo y lugar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label id='name'>Tiempo de entrega</Label>
                                    <div className="border rounded border-border p-5">
                                        <DeliveryTimeSelector
                                            placeholder="Seleccione un rango de fechas"
                                            className="w-full"
                                            defaultValue={time || deliveryTime}
                                            onDateChange={(newDate: DateRange) => {
                                                if (newDate.from && newDate.to) {
                                                    setTime({ from: newDate.from, to: newDate.to });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label id='address'>Lugar de entrega</Label>
                                    <div className="border rounded border-border p-5">
                                        <BranchSlector
                                            defaultValue={selcetedBranch?.id || branch?.id || ""}
                                            onChange={(branch: BranchesSchemaType) => {
                                                setPickUp(false);
                                                setInternalPickUp(false);
                                                setPickUpLocation({
                                                    location: {
                                                        // GeoJSON format: [longitude, latitude]
                                                        latitude: branch?.address?.location?.coordinates[1] ?? 0,
                                                        longitude: branch?.address?.location?.coordinates[0] ?? 0
                                                    },
                                                    radius: 1
                                                })
                                                setSelectedBranch(branch)
                                                setTempBranch(branch)
                                            }}
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
                                            "opacity-0 pointer-events-all": selcetedBranch !== null
                                        })}></div>
                                        <div onClick={() => {
                                            // Only open dialog if pickup is enabled
                                            if (internalPickUp || pickUp) {
                                                setPickUpDialog(true);
                                            }
                                        }}
                                            className={cn("bg-border rounded p-2 w-14 flex justify-center items-center",
                                                {
                                                    "shadow-sm shadow-primary bg-primary/10 cursor-pointer": internalPickUp || pickUp
                                                }
                                            )}>
                                            <img src={mapIcon} alt="map" />
                                        </div>
                                        <div className="flex flex-col justify-center ">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={internalPickUp || pickUp}
                                                    defaultChecked={internalPickUp == true || pickUp == true}
                                                    disabled={selcetedBranch === null}
                                                    onClick={() => {
                                                        if (selcetedBranch === null) return
                                                        // we set the location of the selected branch on the map to select the pikup radius
                                                        setPickUpLocation({
                                                            location: {
                                                                // GeoJSON format: [longitude, latitude]
                                                                latitude: selcetedBranch?.address?.location?.coordinates[1] ?? 0,
                                                                longitude: selcetedBranch?.address?.location?.coordinates[0] ?? 0
                                                            },
                                                            radius: pickUpLocation.radius || 1
                                                        })
                                                        setPickUp(true);
                                                        setInternalPickUp(true)
                                                        // Open pickup map dialog when switch is turned on
                                                        setPickUpDialog(true);
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
                                            value={internalRc || replacementCriteria}
                                            className="flex flex-col gap-3 p-5"
                                        >
                                            {Object.entries(ReplacementCriteriaValues).map(([key, item]) => (
                                                <div key={item.value} className="flex items-center space-x-2" onClick={() => setInternalRc(item.value)}>
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
                                            selectedListId={internalList || listId}
                                            onChange={(item: { id: string, name: string }) => {
                                                setInternalList(item.id);
                                                setListName(item.name)
                                            }
                                            }
                                            removeSelection={() => setInternalList("")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="w-full border top-1 px-6 py-3">
                        <DialogClose className="w-40">
                            <Button onClick={onCancel} variant="secondary" type="button" className="w-full">Cancelar</Button>
                        </DialogClose>
                        <DialogClose className="w-40" disabled={!time && !selcetedBranch}>
                            <Button disabled={!time || !selcetedBranch} onClick={onConfigSave} type="button" className="w-full">Guardar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full flex mt-2" asChild>
                <div className="w-full">
                    {triggerButton}
                </div>
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
                                        placeholder="Seleccione un rango de fechas"
                                        className="w-full"
                                        defaultValue={time || deliveryTime}
                                        onDateChange={(newDate: DateRange) => {
                                            if (newDate.from && newDate.to) {
                                                setTime({ from: newDate.from, to: newDate.to });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label id='address'>Lugar de entrega</Label>
                                <div className="border rounded border-border p-5">
                                    <BranchSlector
                                        defaultValue={selcetedBranch?.id || branch?.id || ""}
                                        onChange={(branch: BranchesSchemaType) => {
                                            setPickUp(false);
                                            setInternalPickUp(false);
                                            setPickUpLocation({
                                                location: {
                                                    // GeoJSON format: [longitude, latitude]
                                                    latitude: branch?.address?.location?.coordinates[1] ?? 0,
                                                    longitude: branch?.address?.location?.coordinates[0] ?? 0
                                                },
                                                radius: 1
                                            })
                                            setSelectedBranch(branch)
                                            setTempBranch(branch)
                                        }}
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
                                        "opacity-0 pointer-events-all": selcetedBranch !== null
                                    })}></div>
                                    <div onClick={() => {
                                        // Only open dialog if pickup is enabled
                                        if (internalPickUp || pickUp) {
                                            setPickUpDialog(true);
                                        }
                                    }}
                                        className={cn("bg-border rounded p-2 w-14 flex justify-center items-center",
                                            {
                                                "shadow-sm shadow-primary bg-primary/10 cursor-pointer": internalPickUp || pickUp
                                            }
                                        )}>
                                        <img src={mapIcon} alt="map" />
                                    </div>
                                    <div className="flex flex-col justify-center ">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={internalPickUp || pickUp}
                                                defaultChecked={internalPickUp == true || pickUp == true}
                                                disabled={selcetedBranch === null}
                                                onClick={() => {
                                                    if (selcetedBranch === null) return
                                                    // we set the location of the selected branch on the map to select the pikup radius
                                                    setPickUpLocation({
                                                        location: {
                                                            // GeoJSON format: [longitude, latitude]
                                                            latitude: selcetedBranch?.address?.location?.coordinates[1] ?? 0,
                                                            longitude: selcetedBranch?.address?.location?.coordinates[0] ?? 0
                                                        },
                                                        radius: pickUpLocation.radius || 1
                                                    })
                                                    setPickUp(true);
                                                    setInternalPickUp(true)
                                                    // Open pickup map dialog when switch is turned on
                                                    setPickUpDialog(true);
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
                                        value={internalRc || replacementCriteria}
                                        className="flex flex-col gap-3 p-5"
                                    >
                                        {Object.entries(ReplacementCriteriaValues).map(([key, item]) => (
                                            <div key={item.value} className="flex items-center space-x-2" onClick={() => setInternalRc(item.value)}>
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
                                        selectedListId={internalList || listId}
                                        onChange={(item: { id: string, name: string }) => {
                                            setInternalList(item.id);
                                            setListName(item.name)
                                        }
                                        }
                                        removeSelection={() => setInternalList("")}
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
                    <DialogClose className="w-40" disabled={!time && !selcetedBranch}>
                        <Button disabled={!time || !selcetedBranch} onClick={onConfigSave} type="button" className="w-full">Guardar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}