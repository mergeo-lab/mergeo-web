import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table";
import { getFavorites, removeFavorite } from "@/lib/products";
import { ProductSchemaType } from "@/lib/schemas";
import UseCompanyStore from "@/store/company.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AnimatedRow from "@/components/animatedRow";
import { FaHeartCircleExclamation } from "react-icons/fa6";

export const Route = createFileRoute(
    "/_authenticated/_dashboardLayout/_accountType/client/lists/favorites"
)({
    component: () => <Favorites />,
});

export default function Favorites() {
    const { company } = UseCompanyStore();
    const companyId = company?.id;
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["favorites", companyId],
        queryFn: () => (companyId ? getFavorites(companyId) : Promise.reject(new Error("Company ID is undefined"))),
    });

    const [, setRemovingItems] = useState<Set<string>>(new Set());

    const { mutate: removeFromFavorite } = useMutation({
        mutationFn: async ({ companyId, productId }: { companyId: string; productId: string }) => {
            if (!company?.id) throw new Error("Company ID is required");
            return removeFavorite(companyId, productId);
        },
        onMutate: async ({ companyId, productId }) => {
            await queryClient.cancelQueries({ queryKey: ["favorites", companyId] });

            const previousFavorites = queryClient.getQueryData(["favorites", companyId]);

            setRemovingItems((prev) => new Set(prev).add(productId));

            queryClient.setQueryData(["favorites", companyId], (old: ProductSchemaType[]) =>
                old?.filter((product) => product.id !== productId)
            );

            return { previousFavorites };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousFavorites) {
                queryClient.setQueryData(["favorites", company?.id], context.previousFavorites);
            }
            setRemovingItems(new Set());
        },
        onSettled: (_, __, { productId }) => {
            setRemovingItems((prev) => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
            // setTimeout(() => {
            // }, 0);
        },
    });

    function handleRemoveFromFavorite(productId: string) {
        if (!company?.id) return;
        removeFromFavorite({ companyId: company.id, productId: productId });
    }

    function loadingIndicator() {
        return (
            <tr className="mt-12 opacity-25">
                <td colSpan={100} className="p-0">
                    <div className="w-full flex flex-col space-y-2 mt-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-20 rounded-sm bg-muted/50" />
                        ))}
                    </div>
                </td>
            </tr>
        );
    }

    if (data?.length === 0) return (
        <div className="flex flex-col gap-4 items-center justify-center h-full">
            <FaHeartCircleExclamation size={100} className="text-destructive" />
            <p className="text-base font-bold">No hay productos en la lista de favoritos</p>
        </div>)

    return (
        <div className="relative w-full p-10">
            <div className="h-[calc(100vh-220px)] overflow-y-auto px-2">
                <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                        <tr className="hover:bg-white">
                            <TableHead className="w-96">Producto</TableHead>
                            <TableHead className="text-center">Unidad</TableHead>
                            <TableHead className="text-center">Unidad de Medida</TableHead>
                            <TableHead className="text-center">Precio</TableHead>
                            <TableHead className="text-center">Precio por Unidad de Medida</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </tr>
                    </TableHeader>
                    <TableBody className="transition-all duration-300 ease-in-out">
                        {isLoading ? (
                            loadingIndicator()
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {data?.map((product) => (
                                    <AnimatedRow
                                        key={product.id}
                                        product={product}
                                        handleRemove={() => handleRemoveFromFavorite(product.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
