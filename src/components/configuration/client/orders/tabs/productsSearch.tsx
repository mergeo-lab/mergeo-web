import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UseSearchStore from "@/store/search.store";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductsSearch() {

    const [productName, setProductName] = useState("");
    const { setSearchParams, searchParams } = UseSearchConfigStore();
    const { setActiveSearchItem } = UseSearchStore();

    function handleSearch() {
        setSearchParams({ name: productName });
    }

    function cancelSearch() {
        setProductName("");
        setSearchParams({ name: "" });
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
        </>
    )
}