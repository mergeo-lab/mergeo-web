import List from "@/components/list";
import { Input } from "@/components/ui/input";
import { useRef, useState, useCallback, useEffect, SetStateAction } from "react";
import { useDebounceCallback, useOnClickOutside } from 'usehooks-ts'
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import LoadingIndicator from '@/components/loadingIndicator';
import { MapPin, Search, X } from "lucide-react";
import { getLocationInfo } from "@/lib/auth";
import { GoogleLocationSchemaType } from "@/lib/schemas";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Props = {
    debounce?: number,
    selectedAddress: (address: GoogleLocationSchemaType) => void,
    defaultAddressName?: string,
    disabled: boolean,
    addressRemoved?: () => void,
    isEditing?: boolean
}

export function GoogleAutoComplete({ debounce = 500, selectedAddress, addressRemoved, defaultAddressName, disabled, isEditing }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [selected, setSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        defaultAddressName && setValue(defaultAddressName);
    }, [defaultAddressName, isEditing]);

    const {
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = useGoogle({
        options: {
            types: ['route'],
            language: "es",
            input: "",
            componentRestrictions: {
                country: "ar"
            }
        }
    });
    const [value, setValue] = useState("");

    const debounced = useDebounceCallback(
        useCallback((value) => getPlacePredictions({ input: value }), [getPlacePredictions]),
        debounce
    );

    useOnClickOutside(ref as React.RefObject<HTMLElement>, () => {
        if (disabled) return;
        if (defaultAddressName) {
            setSelected(true);
            return;
        }
        getPlacePredictions({ input: "" })
        if (!selected && !disabled) {
            setValue("");
            setSelected(false);
        }
    });

    const getAddressComponent = async (placeId: string, serachPlaceText: string) => {
        try {
            const response = await getLocationInfo(placeId);
            console.log("RESPONSE ===>", response);

            if (response) {
                setIsLoading(false);
                let data: GoogleLocationSchemaType = {
                    id: response.id,
                    location: response.location,
                    displayName: {
                        text: ''
                    }
                };
                data = {
                    ...data,
                    displayName: {
                        text: serachPlaceText,
                    }
                };
                selectedAddress(data);
            }
        } catch (err) {
            setIsLoading(false);
            if (err instanceof Error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: err.message,
                })
            }
        };
    }
    const clearSearch = () => {
        if (disabled) return;
        getPlacePredictions({ input: "" });
        setValue("");
        setSelected(false);
        setIsLoading(false);
        addressRemoved && addressRemoved();
        inputRef.current?.focus();
    };

    const handleChange = useCallback((evt: { target: { value: SetStateAction<string>; }; }) => {
        debounced(evt.target.value);
        setValue(evt.target.value);
        if (evt.target.value === "") setSelected(false);
        setIsLoading(false);
    }, [debounced]);

    return (
        <div ref={ref} className="relative">
            <div className="w-full h-10 relative overflow-hidden">
                <Input
                    ref={inputRef}
                    title={value}
                    disabled={disabled}
                    value={value}
                    className={cn("w-full text-ellipsis pr-12 select-none overflow-hidden", {
                        'disabledStyle': disabled
                    })}
                    onChange={handleChange}
                />

                {isPlacePredictionsLoading || isLoading
                    ? (
                        <LoadingIndicator className="absolute right-4 top-2" />
                    )
                    : !disabled && <div className="absolute right-4 top-2">
                        {
                            selected || value
                                ? <X className="cursor-pointer" onClick={clearSearch} />
                                : <Search />}
                    </div>}
            </div>
            {
                placePredictions && placePredictions.length > 0 &&
                <List className="absolute top-10 w-full z-10 h-[200px] overflow-auto"
                    dataSource={placePredictions}
                    renderItem={(item) => (
                        <List.Item className="flex gap-2 bg-white" onClick={() => {
                            setValue(item.description);
                            getPlacePredictions({ input: "" });
                            setSelected(true);
                            setIsLoading(false);
                            getAddressComponent(item.place_id, item.description);
                        }}>
                            <MapPin size={20} />
                            <List.Item.Meta title={item.description} />
                        </List.Item>
                    )}
                />
            }
        </div>
    )
}
