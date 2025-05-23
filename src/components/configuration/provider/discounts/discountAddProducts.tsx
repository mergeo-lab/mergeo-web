import SearchProducts from "@/components/configuration/provider/products/searchProducts"
import CustomSearchField from "@/components/customSearchField"
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { Button } from "@/components/ui/button";
import { UseNewProductSearch } from "@/hooks/useNewProductSearch";
import { useProviderProductSearchStore } from "@/store/providerProductSearch.store";
import { useEffect } from "react";

type Props = {
    companyId: string
}
export default function DiscountAddProducts({ companyId }: Props) {
    const { resetParams } = useProviderProductSearchStore();
    const { data, isLoading, isError, refetch } = UseNewProductSearch();

    useEffect(() => {
        return () => {
            resetParams();
        } // Cleanup function to cancel the query when the component unmounts or when the queryKey changes
    }, [])

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
        <div className="w-full h-full relative">
            <SearchProducts companyId={companyId}>
                <CustomSearchField
                    name="name"
                    label="Nombre"
                    companyId={companyId}
                    className="w-56"
                />
                <CustomSearchField
                    name="brand"
                    label="Marca"
                    companyId={companyId}
                    className="w-56"
                />
            </SearchProducts>
            {
                isLoading && <OverlayLoadingIndicator className="w-full h-full" />
            }

            {
                !isLoading && !data && (
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">
                            <div>Aun no tienes productos en esta lista, usa el buscador para agregar</div>
                        </div>
                    </div>
                )
            }

            {
                !isLoading && data && data?.products.length <= 0 && (
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">
                            <div>No se encontraron productos para esa busqueda!</div>
                        </div>
                    </div>
                )
            }
            <div>
                {
                    data && data.products.map(p => (
                        <div>
                            {p.name}
                            {p.brand}
                            {p.variety}
                            {p.price}
                        </div>)
                    )
                }
            </div>
        </div>

    );
}