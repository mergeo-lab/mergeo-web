import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { getDiscountListProducts } from "@/lib/discounts";
import { ProductSchemaType } from "@/lib/schemas";
import { useQuery } from "@tanstack/react-query";

type Props = {
    selectedDiscountId: string;
}

export default function DiscountProducts({ selectedDiscountId }: Props) {
    const { data, isLoading } = useQuery({
        queryKey: ['discount-products', selectedDiscountId],
        queryFn: ({ queryKey }) => {
            const selectedDiscountId = queryKey[1];
            if (!selectedDiscountId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('The ID of the list is undefined'));
            }
            return getDiscountListProducts(selectedDiscountId);
        },
        enabled: !!selectedDiscountId, // Ensure the query runs only if company ID exists
    });

    if (isLoading) {
        return (<div className='h-full w-full relative '>
            <OverlayLoadingIndicator label='Buscando Productos' />
        </div>)
    }
    if (!isLoading && data && data.products.length === 0) return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">
                <div>Aun no tienes productos en esta lista, usa el buscador para agregar</div>
            </div>
        </div>
    );

    return (
        data && data.products.map((p: ProductSchemaType) => (
            <div>
                {p.name}
                {p.brand}
                {p.variety}
                {p.price}
            </div>)
        )
    )
}

