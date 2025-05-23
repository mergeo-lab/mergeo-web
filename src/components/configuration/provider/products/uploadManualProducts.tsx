import AddProductsList from "@/components/configuration/provider/products/addProductsList";
import SearchProducts from "@/components/configuration/provider/products/searchProducts";
import { SelectedProductsSheet } from "@/components/configuration/provider/products/selecedProductsSheet";
import CustomSearchField from "@/components/customSearchField";
import ErrorMessage from "@/components/errorMessage";
import LoadingIndicator from "@/components/loadingIndicator";
import { UseNewProductSearch } from "@/hooks/useNewProductSearch";
import { ProductSchemaType } from "@/lib/schemas";
import { useProductStore } from "@/store/addProductItem.store";
import UseCompanyStore from "@/store/company.store";
import { useProviderProductSearchStore } from "@/store/providerProductSearch.store";
import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";


export default function UploadManualProducts() {
    const { getAllProducts, addProduct, removeProduct, removeAllProducts } = useProductStore();
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
        console.log('data in upload manual', data);
        if (data) {
            const filtered = data.products.filter(product => {
                return !allProducts.some(p => p.id === product.id);
            });
            setFilteredProducts(filtered);
        }
    }, [data])

    useEffect(() => {
        return () => {
            removeAllProducts();
        }
    }, [removeAllProducts])

    return (
        <div className="grid grid-rows-[auto,1fr] h-[calc(100vh-250px)]">
            <div className="pl-10 shadow rounded mx-10 mt-5 p-5">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-base font-bold text-nowrap">Busca el producto por nombre, marca o codigo EAN</h1>
                    <SelectedProductsSheet
                        companyId={companyId}
                        products={allProducts}
                        triggerButton={
                            <div className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 space-x-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                                {allProducts.length > 0 &&
                                    <div className="w-3 h-3 rounded bg-info animate-pulse duration-700"></div>
                                }
                                <p>Ver productos seleccionados</p>
                            </div>
                        }
                        removeProduct={removeProduct}
                        onSaveCallback={savedProductsCallback}
                    />
                </div>
                <SearchProducts companyId={companyId} className="flex items-center gap-4">
                    <CustomSearchField name="name" label="Nombre" companyId={companyId} className="w-72" />
                    <CustomSearchField name="brand" label="Marca" companyId={companyId} className="w-72" />
                    <span className="mr-5">o</span>
                    <CustomSearchField name="ean" label="Código Ean" companyId={companyId} className="w-72" />
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
                                <SearchX size={36} strokeWidth={1.5} className="text-white" />
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