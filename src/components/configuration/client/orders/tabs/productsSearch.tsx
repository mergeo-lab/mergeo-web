import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import UseSearchStore from "@/store/search.store";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Heart, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductsSearch() {

    const [productName, setProductName] = useState("");
    const { setSearchParams, searchParams, setShowOnlyFavorites, showOnlyFavorites } = UseSearchConfigStore();
    const { setActiveSearchItem } = UseSearchStore();

    function handleSearch() {
        setSearchParams({ name: productName });
    }

    function cancelSearch() {
        setProductName("");
        setSearchParams({ name: "" });
    }

    function handleFavorites() {
        console.log("handleFavorites");
        setShowOnlyFavorites(!showOnlyFavorites);
    }

    useEffect(() => {
        setActiveSearchItem(null);
        setSearchParams({ name: "" });
    }, [setActiveSearchItem, setSearchParams]);

    return (
        <>
            <Label className="text-sm m-2">Buscar Producto</Label>
            <div className="w-full flex gap-2">
                <Input value={productName} placeholder="Buscar" className="w-full" onChange={(e) => setProductName(e.target.value)} />
                {searchParams.name !== productName || searchParams.name === ""
                    ? <Button onClick={handleSearch} className="w-20">
                        <Search className="w-5 h-5" />
                    </Button>
                    : <Button onClick={cancelSearch} className="w-20">
                        <X className="w-6 h-6" />
                    </Button>
                }
            </div>
            <div className="flex gap-2 items-center justify-center mt-4 border border-border p-2 rounded-md">
                <Label className="text-sm m-2 flex gap-2">
                    <Heart className="w-5 h-5" />
                    <span>Solo mostrar Favoritos</span>
                </Label>
                <Switch id="favorites-switch" onClick={handleFavorites} defaultChecked={showOnlyFavorites} />
            </div>
        </>
    )
}