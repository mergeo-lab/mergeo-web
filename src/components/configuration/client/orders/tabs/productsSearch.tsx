import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import UseSearchStore from "@/store/search.store";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Suspense, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoMdCar } from "react-icons/io";
import { z } from "zod";
import { FaRegHeart } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const SearchSchema = z.object({
    search: z.string()
});
type SearchSchemaType = z.infer<typeof SearchSchema>

export default function ProductsSearch() {

    const { setSearchParams, searchParams, setShowOnlyFavorites, showOnlyFavorites, configDataSubmitted, pickUp, setShowPickUp, showPickUp } = UseSearchConfigStore();
    const { setActiveSearchItem } = UseSearchStore();

    const form = useForm<SearchSchemaType>({
        resolver: zodResolver(SearchSchema),
        defaultValues: {
            search: "",
        },
    });

    useEffect(() => {
        console.log("pickUp", pickUp);
        setShowPickUp(pickUp);
    }, [pickUp, setShowPickUp, configDataSubmitted]);

    function handleSearch(fields: SearchSchemaType) {
        setSearchParams({ name: fields.search });
    }

    function cancelSearch() {
        setSearchParams({ name: "" });
        form.reset();
    }

    function handleFavorites() {
        setShowOnlyFavorites(!showOnlyFavorites);
    }

    function handleShowPickUp() {
        setShowPickUp(!showPickUp);
    }

    useEffect(() => {
        setActiveSearchItem(null);
        setSearchParams({ name: "" });
    }, [setActiveSearchItem, setSearchParams]);

    useEffect(() => {
        console.log("searchParams", searchParams);
    }, [searchParams])

    return (
        <Suspense fallback={<LoadingIndicator />}>
            <FormProvider {...form}>
                <form className='w-full' onSubmit={form.handleSubmit(handleSearch)}>
                    <div className="w-full flex items-end gap-2">
                        <div className="w-full flex flex-col gap-2">
                            <FormLabel>Buscar</FormLabel>
                            <FormField
                                control={form.control}
                                name="search"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="text-sm m-2" id='search'>Buscar Producto</FormLabel> */}
                                        <FormControl>
                                            <Input className="w-full" placeholder="Nombre del producto" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* <Input value={productName} placeholder="Buscar" className="w-full" onChange={(e) => setProductName(e.target.value)} /> */}
                        {searchParams.name === ""
                            ? <Button type="submit" className="w-20">
                                <FiSearch className="w-5 h-5" />
                            </Button>
                            : <Button onClick={cancelSearch} className="w-20 bg-destructive hover:bg-destructive/80">
                                <RxCross2 className="w-6 h-6" />
                            </Button>
                        }
                    </div>
                </form>
            </FormProvider>
            <div className="flex gap-2 items-center justify-center mt-4 border border-border p-2 rounded-md">
                <Label className="text-sm m-2 flex gap-2">
                    <FaRegHeart className="w-5 h-5" />
                    <span>Solo mostrar Favoritos</span>
                </Label>
                <Switch id="favorites-switch" onClick={handleFavorites} defaultChecked={showOnlyFavorites} />
            </div>
            <div className={cn("flex gap-2 items-center justify-center mt-4 border border-border p-2 rounded-md", {
                'opacity-80': !pickUp,
            })}>
                <Label className="text-sm m-2 flex gap-2">
                    <IoMdCar size={20} className={cn("text-highlight", {
                        'text-muted': !pickUp,
                    })} />
                    <span>Ver prodcutos con pickUp</span>
                </Label>
                <Switch onClick={handleShowPickUp} defaultChecked={pickUp} checked={showPickUp} disabled={!pickUp} />
            </div>
        </Suspense>
    )
}