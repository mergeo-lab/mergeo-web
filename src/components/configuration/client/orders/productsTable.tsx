import { Skeleton } from "@/components/ui/skeleton";
import { useProductSearch } from "@/hooks/useProductsSearch";
import UseSearchStore from "@/store/search.store";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Heart, Image as ImageIcon, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import cancelConfig from "@/assets/config-cancel.png";
import productNotFound from "@/assets/product-not-found.png";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { OptimisticToggleButton } from "@/components/optimisticToggleButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UseCompanyStore from "@/store/company.store";
import { addToBlackList, getFavorites, toggleFavorite } from "@/lib/products";
import { memo, startTransition, useEffect, useRef, useState } from "react";
import { ProductSchemaType } from "@/lib/schemas";
import { PaginationCustom } from "@/components/pagination";
import UseProviderInventoryPaginationState from "@/store/providerInventoryPagination.store";

type Params = {
    configCompleted: boolean,
    configCanceled: boolean,
    configSubmitted: boolean,
}

export default function ProductsTable({ configCompleted = false, configCanceled, configSubmitted }: Params) {
    const { setConfigDialogOpen, searchParams, setConfigDataSubmitted } = UseSearchConfigStore();
    const { saveProduct, removeProduct, getAllSavedProducts } = UseSearchStore();
    const { setPage, page } = UseProviderInventoryPaginationState()

    const { company } = UseCompanyStore()
    const queryClient = useQueryClient();
    const [filteredProducts, setFilteredProducts] = useState<ProductSchemaType[]>([]);
    const tableRef = useRef<HTMLDivElement>(null);

    const { mutate: toggleFavoriteMutation } = useMutation({
        mutationFn: ({ productId, newState }: { productId: string, newState: boolean }) => {
            if (!company?.id) {
                throw new Error('Company ID is required');
            }
            return toggleFavorite(company.id, productId, newState);
        },
        onMutate: async ({ productId, newState }) => {
            // Cancel any ongoing refetches to prevent overwriting the optimistic update
            await queryClient.cancelQueries({ queryKey: ["favorites", company?.id] });

            // Snapshot the previous state
            const previousFavorites = queryClient.getQueryData(["favorites", company?.id]);

            // Optimistically update the UI inside startTransition
            startTransition(() => {
                queryClient.setQueryData(["favorites", company?.id], (oldFavorites: unknown) => {
                    if (!oldFavorites) return [];
                    return newState
                        ? [...(oldFavorites as Array<{ id: string }>), { id: productId }] // Add to favorites
                        : (oldFavorites as Array<{ id: string }>).filter((fav) => fav.id !== productId); // Remove from favorites
                });
            });

            // Return the previous state to rollback if mutation fails
            return { previousFavorites };
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onError: (_err, _variables, context) => {
            // Rollback to the previous state if mutation fails
            if (context?.previousFavorites) {
                queryClient.setQueryData(["favorites", company?.id], context.previousFavorites);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites", company?.id] });
        }
    });

    const { mutate: addProductToBlackList } = useMutation({
        mutationFn: ({ productId }: { productId: string }) => {
            if (!company?.id) {
                throw new Error('Company ID is required');
            }
            return addToBlackList(company.id, productId);
        },
        onMutate: async ({ productId }) => {
            // Cancel any ongoing refetches to prevent overwriting the optimistic update
            await queryClient.cancelQueries({ queryKey: ["blacklist"] });

            // Snapshot the previous state
            const previousProducts = filteredProducts;

            // Optimistically update the UI by filtering out the blacklisted product
            setFilteredProducts((prev) => prev.filter(product => product.id !== productId));

            // Return the previous state to rollback if mutation fails
            return { previousProducts };
        },
        onError: (_err, _variables, context) => {
            // Rollback to the previous state if mutation fails
            if (context?.previousProducts) {
                setFilteredProducts(context.previousProducts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["blacklist"] });
        }
    });

    const scrollToTop = () => {
        tableRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const { data, isLoading, error, setPagination, refetch } = useProductSearch({
        name: searchParams.name,
        brand: searchParams.brand,
        branchId: searchParams.branchId,
    }, configCompleted);

    useEffect(() => {
        if (configCompleted && configSubmitted) {
            refetch();
        }
    }, [configSubmitted, configCompleted, refetch]);

    useEffect(() => {
        if (!data) return;
        setFilteredProducts(data?.products || []);
    }, [data]);


    const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
        queryKey: ['favorites', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getFavorites(companyId);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });


    const FavoriteButton = memo(({ productId }: { productId: string }) => {
        const isFavorite = favorites.some(favorite => favorite.id === productId);
        return (
            <OptimisticToggleButton
                itemId={productId}
                defaultState={isFavorite}
                onToggle={async (id, newState) => {
                    await toggleFavoriteMutation({ productId: id, newState });
                }}
                activeIcon={<Heart className="text-red-500" strokeWidth={3} size={16} />}
                inactiveIcon={<Heart size={16} />}
                tooltip="Agregar a favoritos"
            />
        );
    });

    const BlackListButton = memo(({ productId }: { productId: string }) => {
        const isFavorite = favorites.some(favorite => favorite.id === productId);
        return (
            <OptimisticToggleButton
                disabled={isFavorite}
                itemId={productId}
                defaultState={isFavorite}
                onToggle={async (id) => {
                    try {
                        await addProductToBlackList({ productId: id });
                        setFilteredProducts((prev) => prev.filter(product => product.id !== id));
                    } catch (error) {
                        console.error("Error adding to blacklist", error);
                    }
                }}
                activeIcon={<ThumbsDown strokeWidth={3} size={16} />}
                inactiveIcon={<ThumbsDown size={16} />}
                tooltip="Agregar a Lista Negra"
            />
        );
    });

    const ProductRow = memo(({ product, onQuantityChange, savedProducts }: {
        product: ProductSchemaType,
        onQuantityChange: (product: ProductSchemaType, quantity: number) => void,
        savedProducts: ProductSchemaType[]
    }) => {
        return (
            <TableRow>
                <TableCell className="p-0 m-0 ">
                    <div className="flex justify-center flex-col gap-1">
                        <FavoriteButton productId={product.id} />
                        <BlackListButton productId={product.id} />
                    </div>
                </TableCell>
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

                <TableCell className={`text-center`}>{product.net_content}</TableCell>
                <TableCell className={`text-center`}>{product.measurementUnit}</TableCell>
                <TableCell className={`text-center`}>{product.price}</TableCell>
                <TableCell className={`text-center`}>{
                    product.net_content ? (+product.price * product.net_content) : 1}
                </TableCell>
                <TableCell className={`text-right`}>
                    <div className="flex justify-end">
                        <QuantitySelector
                            defaultValue={savedProducts.find((item) => item.id === product.id)?.quantity}
                            onChange={(quantity: number) => onQuantityChange(product, quantity)}
                        />
                    </div>
                </TableCell>
            </TableRow>
        );
    });

    if (!configCompleted && configCanceled) {
        return (
            <div className="w-full h-full flex flex-col gap-10 pt-10 items-center">
                <h1 className="text-2xl font-thin text-secondary text-wrap text-center">Para poder ver productos tienes que completar la configuración inicial</h1>
                <div className="w-fit h-[350px]">
                    <img className="h-[350px]" src={cancelConfig} alt="config incomplete" />
                </div>
                <Button className="w-1/3" variant="outline" onClick={() => {
                    setConfigDataSubmitted(false);
                    setConfigDialogOpen(true);
                }}>Configuración</Button>
            </div>
        )
    }

    if (!isLoading && filteredProducts.length === 0) {
        return (
            <div className={
                "w-full h-full flex flex-col gap-10 pt-10 items-center [&>p]:multi-[font-thin;text-secondary/80;text-center;leading-3;p-0;m-0]"}>
                <img className="h-[350px]" src={productNotFound} alt="config incomplete" />
                <h1 className="text-3xl font-thin text-secondary text-wrap text-center">No encontramos el producto!</h1>
                <p>Para encontrar el producto que estas buscando utiliza el buscador de la derecha.</p>
                <p>También puedes usar una de tus listas ya cargadas y hacer tus búsquedas super rápidas </p>
            </div>
        )
    }

    function loadingIndicator() {
        return (
            <TableRow className="mt-12 opacity-25">
                <TableCell colSpan={100} className="p-0">
                    <div className="w-full flex flex-col space-y-2 mt-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-20 rounded-sm bg-muted/50" />
                        ))}
                    </div>
                </TableCell>
            </TableRow>
        )
    }

    function handleProductChange(product: ProductSchemaType, quantity: number) {
        if (quantity === 0) {
            // Ensure providerId is defined before passing it
            removeProduct(product.id, product.providerId || '');
        } else {
            saveProduct(product, quantity);
        }
    }

    if (error) return <p>{error.message}</p>;

    return (
        <div className="relative">
            {/* <div className="h-1 w-full bg-transparent shadow-sm"></div> */}
            <div ref={tableRef} className="h-[calc(100vh-320px)] overflow-y-auto px-2">
                <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                        <TableRow className="hover:bg-white">
                            <TableHead className=""></TableHead>
                            <TableHead className="w-96">Producto</TableHead>
                            <TableHead className={`text-center`}>Unidad</TableHead>
                            <TableHead className={`text-center`}>Unidad de Medida</TableHead>
                            <TableHead className={`text-center`}>Precio por Unidad de Medida</TableHead>
                            <TableHead className={`text-center`}>Precio</TableHead>
                            <TableHead className={`text-right pr-12`}>Cantidad</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&>*]:hover:bg-white">
                        {
                            isLoading || favoritesLoading || !configCompleted
                                ? loadingIndicator()
                                : (
                                    filteredProducts && filteredProducts.map((product: ProductSchemaType) => (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            onQuantityChange={(product, quantity) => handleProductChange(product, quantity)}
                                            savedProducts={getAllSavedProducts()} />
                                    ))
                                )

                        }
                    </TableBody>
                </Table>
            </div>
            {data && data.totalPages > 1 &&
                <PaginationCustom
                    className="mt-10"
                    currentPage={page}
                    prev={page > 1}
                    next={page < data.totalPages}
                    pages={data.totalPages}
                    onPageBack={() => {
                        setPagination(prev => ({ ...prev, page: +data.currentPage - 1 }));
                        setPage(page - 1);
                        scrollToTop();
                    }}
                    onPageForward={() => {
                        setPagination(prev => ({ ...prev, page: +data.currentPage + 1 }));
                        setPage(page + 1);
                        scrollToTop();

                    }}
                    onPageChange={(page: number) => {
                        setPagination(prev => ({ ...prev, page }));
                        setPage(page);
                        scrollToTop();
                    }}
                />
            }
        </div>
    )
}