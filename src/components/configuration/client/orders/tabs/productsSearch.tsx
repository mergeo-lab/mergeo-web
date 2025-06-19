import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import UseSearchStore from "@/store/search.store";
import UseSearchConfigStore from "@/store/searchConfiguration.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label as DropdownLabel } from "@radix-ui/react-dropdown-menu";
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
    console.log('Rendering ProductsSearch');

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
                                            <div className="relative">
                                                <Input className="w-full" placeholder="Nombre del producto" {...field} />
                                                {
                                                    field.value && (
                                                        <RxCross2 onClick={cancelSearch}
                                                            className="w-6 h-6 absolute right-2 top-1/2 -translate-y-1/2" />
                                                    )
                                                }
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* <Input value={productName} placeholder="Buscar" className="w-full" onChange={(e) => setProductName(e.target.value)} /> */}
                        <Button type="submit" className="w-20">
                            <FiSearch className="w-5 h-5" />
                        </Button>
                    </div>
                </form>
            </FormProvider>
            <div className="flex gap-2 items-center justify-center mt-4 border border-border p-2 rounded-md">
                <DropdownLabel className="text-sm m-2 flex gap-2">
                    <FaRegHeart className="w-5 h-5" />
                    <span>Solo mostrar Favoritos</span>
                </DropdownLabel>
                <Switch id="favorites-switch" onClick={handleFavorites} checked={showOnlyFavorites} />
            </div>
            <div className={cn("flex gap-2 items-center justify-center mt-4 border border-border p-2 rounded-md", {
                'opacity-80': !pickUp,
            })}>
                <DropdownLabel className="text-sm m-2 flex gap-2">
                    <IoMdCar size={20} className={cn("text-highlight", {
                        'text-muted': !pickUp,
                    })} />
                    <span>Ver prodcutos con pickUp</span>
                </DropdownLabel>
                <Switch onClick={handleShowPickUp} defaultChecked={pickUp} checked={showPickUp} disabled={!pickUp} />
            </div>
        </Suspense>
    )
}