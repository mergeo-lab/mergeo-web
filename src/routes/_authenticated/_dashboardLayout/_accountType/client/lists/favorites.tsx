import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { getFavorites, removeFavorite } from "@/lib/products";
import { ProductSchemaType } from "@/lib/schemas";
import UseCompanyStore from "@/store/company.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";

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
                            <AnimatePresence mode="sync">
                                {data &&
                                    data.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            layout="position" // Use position-based layout animations
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                height: "100px",
                                                transition: {
                                                    y: { type: "spring", stiffness: 300, damping: 10 },
                                                    opacity: { duration: 0.2 }
                                                }
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                                scale: 0.8,
                                                transition: {
                                                    height: { duration: 0.3, ease: "easeInOut" },
                                                    scale: { duration: 0.2 },
                                                    opacity: { duration: 0.2 }
                                                }
                                            }}
                                            className="transition-all"
                                        >
                                            <TableCell className="p-0 m-0 py-2">
                                                <div className="flex justify-start items-center w-full">
                                                    <div className="bg-border rounded p-4">
                                                        <ImageIcon size={50} className="text-white" />
                                                    </div>
                                                    <div className="flex flex-col ml-2">
                                                        <div className="font-semibold">{product.name}</div>
                                                        <div className="text-muted font-thin text-sm">{product.brand}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{product.netContent}</TableCell>
                                            <TableCell className="text-center">{product.measurementUnit}</TableCell>
                                            <TableCell className="text-center">{product.price}</TableCell>
                                            <TableCell className="text-center">
                                                {product.netContent ? +product.price * product.netContent : 1}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    className="hover:text-destructive"
                                                    onClick={() => handleRemoveFromFavorite(product.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                            </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
