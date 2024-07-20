import List from "@/components/list";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useDebounceCallback, useOnClickOutside } from 'usehooks-ts'
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import LoadingIndicator from '@/components/loadingIndicator';
import { MapPin, Search, X } from "lucide-react";
import { getLocationInfo } from "@/lib/auth";
import { GoogleLocationSchemaType } from "@/lib/auth/schema";
import { toast } from "@/components/ui/use-toast";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

type Props = {
    debounce?: number,
    selectedAddress: (address: GoogleLocationSchemaType) => void
}

export function GoogleAutoComplete({ debounce = 500, selectedAddress }: Props) {
    const ref = useRef(null);
    const [selected, setSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = useGoogle({
        apiKey: googleMapsApiKey,
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
        console.log("response:", response)

        if (response.error) {
            setIsLoading(false);
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            console.log(response)
            const data = response.data;
            console.log("Get address component:", data)
            selectedAddress(data);
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        getPlacePredictions({ input: "" });
        setValue("");
        setSelected(false);
    };

    return (
        <div ref={ref}>
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
            <List
                dataSource={placePredictions}
                renderItem={(item) => (
                    <List.Item className="flex gap-2" onClick={() => {
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
        </div>
    )
}