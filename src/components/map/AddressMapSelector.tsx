import { useState, useRef } from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';
import { AutocompleteCustom } from './autoComplete';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogTitle } from '@radix-ui/react-dialog';
import { LocationSchemaType } from '@/lib/schemas';

interface AddressMapSelectorProps {
    value?: LocationSchemaType;
    onChange: (address: LocationSchemaType) => void;
    label?: string;
    disabled?: boolean;
}

const centerArgentina = { lat: -35.196593198428815, lng: -64.71031145842831 };

export const AddressMapSelector = ({ value, onChange, label = "Dirección", disabled = false }:
    AddressMapSelectorProps) => {
    console.log("MAP VAL :: ", value)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [mapCenter, setMapCenter] = useState(centerArgentina);
    const [zoom, setZoom] = useState(4); // Initial zoom to show all Argentina
    const [shouldPreventFocus, setShouldPreventFocus] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
        if (place && place.geometry?.location) {
            setSelectedPlace(place);

            // Transform Google Places result to LocationSchemaType
            const locationData: LocationSchemaType = {
                location: {
                    type: "Point",
                    coordinates: [
                        place.geometry.location.lng(),
                        place.geometry.location.lat()
                    ]
                },
                name: place.formatted_address || ''
            };

            onChange(locationData);

            // Update map center and zoom
            setMapCenter({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
            setZoom(16);
        }
    };

    const handleConfirm = () => {
        if (selectedPlace) {
            handleOpenChange(false);
        }
    };

    const handleCancel = () => {
        handleOpenChange(false);
    };

    const handleFocus = () => {
        if (!shouldPreventFocus) {
            setIsOpen(true);
        }
        setShouldPreventFocus(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Set flag to prevent reopening and blur the input
            setShouldPreventFocus(true);
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.blur();
                }
            }, 0);
        }
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTitle className='hidden'></DialogTitle>
                <DialogTrigger asChild>
                    <Input
                        ref={inputRef}
                        onFocusCapture={handleFocus}
                        value={value?.name || ""}
                        readOnly
                        disabled={disabled}
                        placeholder="Seleccionar dirección"
                        className="w-full cursor-pointer text-left"
                    />
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[600px]">
                    <DialogHeader className='hidden'></DialogHeader>
                    <div className="flex flex-col h-full gap-4 relative">
                        <div className='absolute top-2 left-4 right-4 z-10'>
                            <AutocompleteCustom onPlaceSelect={handlePlaceSelect} />
                        </div>
                        <div className="flex-1 relative">
                            <Map
                                className="w-full h-full"
                                zoom={zoom}
                                center={mapCenter}
                                gestureHandling="greedy"
                                disableDefaultUI={true}
                            >
                                <Marker position={mapCenter} />
                            </Map>
                        </div>
                        <div className="flex justify-end gap-2 p-5 pt-0">
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirm} disabled={!selectedPlace}>
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <FormMessage />
        </FormItem>
    );
};