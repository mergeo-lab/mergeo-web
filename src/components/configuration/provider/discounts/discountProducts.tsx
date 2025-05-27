import DiscountProductRow from "@/components/configuration/provider/discounts/discountProductRow";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { getDiscountListProducts, removeDiscountProducts } from "@/lib/discounts";
import { ProductSchemaType } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
    selectedDiscountId: string;
    discount: number;
}

export default function DiscountProducts({ selectedDiscountId, discount }: Props) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['discount-products', selectedDiscountId],
        queryFn: ({ queryKey }) => {
            const selectedDiscountId = queryKey[1];
            if (!selectedDiscountId) {
                return Promise.reject(new Error('The ID of the list is undefined'));
            }
            return getDiscountListProducts(selectedDiscountId);
        },
        enabled: !!selectedDiscountId,
    });

    const removeProductMutation = useMutation({
        mutationFn: removeDiscountProducts,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['discount-products', selectedDiscountId],
            });
        },
    });

    function handleRemoveProduct(id: string) {
        removeProductMutation.mutate({
            listId: selectedDiscountId,
            products: [id]
        })
    }

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
        <div className="relative">
            <div className="p-2 pl-5 border border-border rounded-md font-thin mb-4">
                Descuento aplicado: <span className="text-highlight font-black">{discount}%</span>
            </div>
            {removeProductMutation.isPending && <OverlayLoadingIndicator />}
            <div className="px-4 overflow-auto h-[690px]">
                {
                    data && data.products.map((p: ProductSchemaType) => (
                        <DiscountProductRow
                            discountPercent={discount}
                            key={p.id}
                            product={p}
                            onRemove={(id) => handleRemoveProduct(id)}
                        />
                    ))}
            </div>
        </div>
    )
}

