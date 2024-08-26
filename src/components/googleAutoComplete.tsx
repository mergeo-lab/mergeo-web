import List from "@/components/list";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useDebounceCallback, useOnClickOutside } from 'usehooks-ts'
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import LoadingIndicator from '@/components/loadingIndicator';
import { MapPin, Search, X } from "lucide-react";
import { getLocationInfo } from "@/lib/auth";
import { GoogleLocationSchemaType } from "@/lib/common/schemas";
import { toast } from "@/components/ui/use-toast";


type Props = {
    debounce?: number,
    selectedAddress: (address: GoogleLocationSchemaType) => void
    addressRemoved?: () => void
}

export function GoogleAutoComplete({ debounce = 500, selectedAddress, addressRemoved }: Props) {
    const ref = useRef(null);
    const [selected, setSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        (value) => getPlacePredictions({ input: value }),
        debounce
    );

    useOnClickOutside(ref, () => {
        getPlacePredictions({ input: "" })
        if (!selected) {
            setValue("");
            setSelected(false);
        }
    });

    const getAddressComponent = async (placeId: string) => {
        setIsLoading(true);
        const response = await getLocationInfo(placeId);

        if (response.error) {
            setIsLoading(false);
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            const data = response.data;
            selectedAddress(data);
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        getPlacePredictions({ input: "" });
        setValue("");
        setSelected(false);
        addressRemoved && addressRemoved();
    };

    return (
        <div ref={ref} className="relative">
            <div className="w-full h-10 relative">
                <Input
                    value={value}
                    onChange={(evt) => {
                        debounced(evt.target.value)
                        setValue(evt.target.value);
                        if (evt.target.value == "") setSelected(false);
                    }}
                />

                {isPlacePredictionsLoading || isLoading ? (
                    <LoadingIndicator className="absolute right-4 top-2" />
                )
                    : <div className="absolute right-4 top-2">
                        {
                            selected
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
                            getAddressComponent(item.place_id)
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