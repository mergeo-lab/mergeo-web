import DiscountProductRow from "@/components/configuration/provider/discounts/discountProductRow";
import SearchProducts from "@/components/configuration/provider/products/searchProducts"
import CustomSearchField from "@/components/customSearchField"
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UseNewProductSearch } from "@/hooks/useNewProductSearch";
import UseDiscountProductsStore from "@/store/discountProducts";
import { useProviderProductSearchStore } from "@/store/providerProductSearch.store";
import { useEffect, useState } from "react";
import { Label } from '@/components/ui/label';
import { LuChevronUp } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { MdFactCheck } from "react-icons/md";
import { useMutation } from '@tanstack/react-query';
import { saveDiscountProducts } from "@/lib/discounts";

type Props = {
    companyId: string,
    discountListId: string,
    discount: number
}
export default function DiscountAddProducts({ companyId, discountListId, discount }: Props) {
    const { addProduct, removeProduct, toggleAllProducts, removeAllProducts, products: savedProducts } = UseDiscountProductsStore();
    const { resetParams, setParams } = useProviderProductSearchStore();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const { data, isLoading, isError, refetch } = UseNewProductSearch();
    const saveProductsMutation = useMutation({ mutationFn: saveDiscountProducts });

    useEffect(() => {
        // Set search parameters to load all products for the company
        setParams({ companyId });
    }, [companyId, setParams]);

    useEffect(() => {
        return () => {
            resetParams();
            removeAllProducts();
        } // Cleanup function to cancel the query when the component unmounts or when the queryKey changes
    }, [removeAllProducts, resetParams])

    function handleSaveProducts() {
        saveProductsMutation.mutateAsync({
            listId: discountListId,
            products: savedProducts
        })
    }

    useEffect(() => {
        if (!isLoading && data?.products && data?.products?.length > 0) {
            setTimeout(() => {
                setShowSearch(true);
            }, 300);
        }
    }, [data, isLoading])

    useEffect(() => {
        removeAllProducts();
    }, [discountListId, removeAllProducts])

    if (isError) {
        return (
            <div className="w-full h-full flex justify-center items-center ">
                <div className="w-1/2 h-fit flex flex-col justify-center border border-border p-6 gap-5">
                    <p className="text-destructive p-5 text-center">
                        Ocurrio un error al cargar los productos, intentalo otra vez!
                    </p>
                    <Button variant="outlineSecondary" onClick={() => refetch()}>
                        Volver a cargar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full relative px-5">
            {saveProductsMutation.isPending && <OverlayLoadingIndicator />}
            <div className="w-full h-20 overflow-hidden rounded-t">
                <SearchProducts companyId={companyId} className={cn("pt-0 pl-5 h-20 mt-0 border-b-[1px] border-border transition-all duration-700 bg-muted/10 ", {
                    "-mt-20": showSearch
                })}>
                    <CustomSearchField
                        name="name"
                        label="Nombre"
                        companyId={companyId}
                        className="flex-col items-start [&>div]:w-44"
                    />
                    <CustomSearchField
                        name="brand"
                        label="Marca"
                        companyId={companyId}
                        className="flex-col items-start [&>div]:w-44"
                    />
                    <CustomSearchField
                        name="ean"
                        label="Ean/Gtin"
                        companyId={companyId}
                        className="flex-col items-start [&>div]:w-44"
                    />
                </SearchProducts>
                <div className="w-full flex justify-between items-center h-20 gap-2 border-b-[1px] border-border text-sm bg-muted/20 px-3">

                    <Button
                        className="flex gap-2 bg-info hover:bg-info/70 hover:text-white text-white"
                        variant="outlineSecondary"
                        onClick={handleSaveProducts}
                        disabled={savedProducts.length === 0}
                    >
                        <MdFactCheck size={20} />
                        Agregar Seleccionados
                    </Button>


                    <Button
                        className="ml-2"
                        variant="ghost"
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        <LuChevronUp />
                        Ver Buscador
                    </Button>
                    <div className="w-full flex justify-end items-center mr-4 gap-2"
                        onClick={() => {
                            const allProducts = data?.products?.map(p => p.id);
                            if (allProducts) toggleAllProducts(allProducts)
                        }}
                    >
                        <Label>Seleccionar todos</Label>
                        <Checkbox
                            checked={savedProducts.length !== data?.products?.length}
                        />
                    </div>
                </div>
            </div>
            {
                isLoading && <OverlayLoadingIndicator className="w-full h-full" />
            }

            {
                !isLoading && !data && (
                    <div className="w-full h-[380px] 2xl:h-[630px] flex justify-center items-center">
                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">
                            <div>Aun no tienes productos en esta lista, usa el buscador para agregar</div>
                        </div>
                    </div>
                )
            }

            {
                !isLoading && data && data?.products.length <= 0 && (
                    <div className="w-full h-[380px] 2xl:h-[630px] flex justify-center items-center">
                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">
                            <div>No se encontraron productos para esa busqueda!</div>
                        </div>
                    </div>
                )
            }

            <div className="mt-2 overflow-y-auto pl-2 h-[380px] 2xl:h-[630px]">
                {
                    data && data.products.map(p => (
                        <DiscountProductRow
                            isSearch
                            discountPercent={discount}
                            key={p.id}
                            product={p}
                            onAdd={(id) => addProduct(id)}
                            onRemove={(id) => removeProduct(id)}
                            isAdded={savedProducts.some(prod => prod === p.id)}
                        />
                    ))
                }
            </div>
        </div>

    );
}