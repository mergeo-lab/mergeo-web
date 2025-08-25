import DiscountProductRow from "@/components/configuration/provider/discounts/discountProductRow";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { PaginationCustom } from "@/components/pagination";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { getDiscountListProducts, removeDiscountProducts } from "@/lib/discounts";
import { PaginationType, ProductSchemaType } from "@/lib/schemas";
import { DiscountProductSearchSchemaType } from "@/lib/schemas/discounts.schema";
import UseProviderInventoryPaginationState from "@/store/providerInventoryPagination.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
    selectedDiscountId: string;
    discount: number;
}

export default function DiscountProducts({ selectedDiscountId, discount }: Props) {
    const queryClient = useQueryClient();
    const { setPage, page } = UseProviderInventoryPaginationState()
    const [removingIds, setRemovingIds] = useState<string[]>([]);

    const {
        data,
        isLoading,
        setPagination,
        handleSearch,
        refetch,
    } = usePaginatedSearch<DiscountProductSearchSchemaType & PaginationType, {
        products: ProductSchemaType[];
        currentPage: number;
        total: number;
        totalPages: number;
    }>({
        queryKeyPrefix: ['discount-products', selectedDiscountId, page],
        queryFn: getDiscountListProducts,
        getEnabled: () => !!selectedDiscountId,
    });


    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 0 }));
        handleSearch({
            listId: selectedDiscountId, page: page,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDiscountId]);

    const removeProductMutation = useMutation({
        mutationFn: removeDiscountProducts,
        onSuccess: (_data) => {
            queryClient.invalidateQueries({
                queryKey: ['discount-products', selectedDiscountId, page],
            });
            refetch();
        },
    });

    function handleRemoveProduct(id: string) {
        // Wait for animation before removing
        setRemovingIds((prev) => [...prev, id]);

        setTimeout(() => {
            removeProductMutation.mutate({
                listId: selectedDiscountId,
                products: [id],
            });
        }, 300);
    }

    if (isLoading) {
        return (<div className='h-[380px] 2xl:h-[630px] w-full relative '>
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
        <div className="relative h-full">
            <div className="w-full h-full px-2">
                <div className="w-full flex justify-center items-center px-3">
                    <div className="w-full py-1 pl-5 border border-border rounded-md font-thin mb-4 bg-muted/10">
                        Descuento aplicado: <span className="text-highlight font-black">{discount}%</span>
                    </div>
                </div>
                {removeProductMutation.isPending && <OverlayLoadingIndicator />}
                <div className="px-4 overflow-y-auto h-[calc(100vh-14%)] pb-10">
                    {data && data.products.map((p: ProductSchemaType) => (
                        <div key={p.id} className={cn("transition-all overflow-hidden duration-300", {
                            "opacity-0 max-h-0": removingIds.includes(p.id),
                            "max-h-[200px]": !removingIds.includes(p.id), // adjust as needed
                        })}>
                            <DiscountProductRow
                                discountPercent={discount}
                                product={p}
                                onRemove={() => handleRemoveProduct(p.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {data && data.totalPages > 1 && (
                <div className='sticky bottom-0 bg-white py-3 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/0.1)]'>
                    <PaginationCustom
                        currentPage={page}
                        prev={page > 1}
                        next={page < data.totalPages}
                        pages={data.totalPages}
                        onPageBack={() => {
                            setPagination(prev => ({ ...prev, page: page - 1 }));
                            setPage(page - 1);
                        }}
                        onPageForward={() => {
                            setPagination(prev => ({ ...prev, page: page + 1 }));
                            setPage(page + 1);
                        }}
                        onPageChange={(page: number) => {
                            setPagination(prev => ({ ...prev, page }));
                            setPage(page);
                        }}
                    />
                </div>
            )}
        </div>
    )
}

