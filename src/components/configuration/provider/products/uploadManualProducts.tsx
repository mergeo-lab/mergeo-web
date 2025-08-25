import AddProductsList from "@/components/configuration/provider/products/addProductsList";
import SearchProducts from "@/components/configuration/provider/products/searchProducts";
import { SelectedProductsSheet } from "@/components/configuration/provider/products/selecedProductsSheet";
import CustomSearchField from "@/components/customSearchField";
import ErrorMessage from "@/components/errorMessage";
import LoadingIndicator from "@/components/loadingIndicator";
import { UseNewProductSearch } from "@/hooks/useNewProductSearch";
import { ProductSchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/addProductItem.store";
import UseCompanyStore from "@/store/company.store";
import { useProviderProductSearchStore } from "@/store/providerProductSearch.store";
import { useEffect, useState } from "react";
import { LuSearchX } from "react-icons/lu";
import { BiSolidRightArrowSquare } from "react-icons/bi";


export default function UploadManualProducts() {
    const { getAllProducts, products, addProduct, removeProduct, removeAllProducts } = useProductStore();
    const allProducts = getAllProducts();
    const { getCompanyId } = UseCompanyStore();
    const { data, isLoading, isError } = UseNewProductSearch();
    const [filteredProducts, setFilteredProducts] = useState<ProductSchemaType[]>([]);
    const { resetParams } = useProviderProductSearchStore();
    const companyId = getCompanyId();

    function savedProductsCallback() {
        resetParams()
        removeAllProducts();
    }

    useEffect(() => {
        if (data) {
            const filtered = data.products.filter(product => {
                return !allProducts.some(p => p.id === product.id);
            });
            setFilteredProducts(filtered);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
        return () => {
            removeAllProducts();
            resetParams();
        }
    }, [removeAllProducts, resetParams])

    return (
        <div className="grid grid-rows-[auto,1fr] h-[calc(100vh-160px)]">
            <div className="pl-10 shadow rounded mx-10 mt-4 h-fit py-2">
                <div className="w-full flex justify-between items-center">
                    <SelectedProductsSheet
                        companyId={companyId}
                        products={allProducts}
                        triggerButton={
                            <div className={cn("w-80 h-16 flex items-center justify-center absolute bottom-[-20px] rounded-lg -translate-y-1/2 bg-gradient-to-r from-info to-blue-500 border-white border-2 shadow-lg transition-all duration-700 gap-3 right-[30px]",
                                {
                                    "translate-y-6 opacity-100": products.length > 0,
                                    "translate-y-full opacity-0": products.length == 0
                                }
                            )}>
                                <div className={cn("w-full h-full flex items-center justify-center rounded-lg transition-all duration-700 gap-3",
                                    {
                                        "animate-pulse-5s": products.length > 0
                                    }
                                )}>
                                    <BiSolidRightArrowSquare size={30} className="text-white" />
                                    <p className="font-black text-white whitespace-nowrap">
                                        Ver productos seleccionados
                                    </p>
                                </div>
                            </div>
                        }
                        removeProduct={removeProduct}
                        onSaveCallback={savedProductsCallback}
                    />
                </div>
                <SearchProducts companyId={companyId} className="flex items-center gap-4 p-0 mt-0">
                    <CustomSearchField name="name" label="Nombre" companyId={companyId} className="w-52 2xl:w-72" />
                    <CustomSearchField name="brand" label="Marca" companyId={companyId} className="w-52 2xl:w-72" />
                    <span className="mr-5">o</span>
                    <CustomSearchField name="ean" label="Código Ean" companyId={companyId} className="w-52 2xl:w-72" />
                </SearchProducts>

            </div >
            <div className="mx-10 bg-border/50 mt-5 rounded overflow-y-auto">
                {isError && <ErrorMessage />}
                {isLoading &&
                    <div className="w-full h-full flex justify-center items-center">

                        <div className="bg-white rounded shadow py-5 px-8 flex flex-col justify-center items-center gap-y-4">
                            <LoadingIndicator />
                            <p>
                                Buscando...
                            </p>
                        </div>
                    </div>
                }

                {!data && (
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">
                            <div>Tienes que usar el buscador para ver resultados!</div>
                        </div>
                    </div>
                )}
                {data && data.products.length === 0 && (
                    <div className="w-full h-full flex justify-center items-center">

                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">

                            <div className="bg-destructive w-fit h-fit p-2 rounded">
                                <LuSearchX size={36} strokeWidth={1.5} className="text-white" />
                            </div>
                            <div>
                                <p>
                                    No se encontraron productos con esos parametros!
                                </p>
                                <p>
                                    Intentalo nuevamente.
                                </p>
                            </div>
                        </div>
                    </div>
                )
                }
                {data && data.products.length > 0 && (
                    <AddProductsList
                        data={filteredProducts}
                        addProduct={addProduct}
                    />
                )}
            </div>
        </div >
    )
}