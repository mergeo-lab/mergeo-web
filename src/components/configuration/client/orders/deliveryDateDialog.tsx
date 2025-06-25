import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, isBefore, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { TbCalendarTime } from "react-icons/tb";
import { useState } from "react";
import { ProductSchemaType } from "@/lib/schemas";

interface DeliveryDateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductSchemaType;
    onDateChange: (productId: string, deliveryDate: Date) => void;
    currentDeliveryDate?: Date;
}

export function DeliveryDateDialog({
    isOpen,
    onClose,
    product,
    onDateChange,
    currentDeliveryDate
}: DeliveryDateDialogProps) {
    const today = startOfToday();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        currentDeliveryDate || undefined
    );

    const handleApply = () => {
        if (selectedDate) {
            onDateChange(product.id, selectedDate);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedDate(currentDeliveryDate || undefined);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-4">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TbCalendarTime size={20} />
                        Cambiar fecha de entrega
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona una nueva fecha de entrega para: <strong>{product.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Fecha de entrega</label>
                        <Calendar
                            locale={es}
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => isBefore(date, today)}
                            className="rounded-md border mt-2 flex justify-center"
                        />
                    </div>

                    {selectedDate && (
                        <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm">
                                <strong>Fecha seleccionada:</strong> {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={!selectedDate}
                    >
                        Aplicar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}