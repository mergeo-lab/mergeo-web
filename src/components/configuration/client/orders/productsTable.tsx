import { Skeleton } from "@/components/ui/skeleton";
import { defaultPagination, useProductSearch } from "@/hooks/useProductsSearch";
import UseSearchStore from "@/store/search.store";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import cancelConfig from "@/assets/config-cancel.png";
import productNotFound from "@/assets/product-not-found.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToBlackList, toggleFavorite } from "@/lib/products";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductSchemaType } from "@/lib/schemas";
import { PaginationCustom } from "@/components/pagination";
import UseProviderInventoryPaginationState from "@/store/providerInventoryPagination.store";
import ProductRow from "@/components/configuration/client/orders/productRow";
import { HiOutlineCog } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { ErrorBoundary } from "react-error-boundary";

type Params = {
    configCanceled: boolean,
}

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-1/2 h-fit flex flex-col justify-center border border-border p-6 gap-5">
                <p className="text-destructive p-5 text-center">
                    {error.message || "Ocurrió un error al cargar los productos"}
                </p>
                <Button variant="outlineSecondary" onClick={resetErrorBoundary}>
                    Volver a cargar
                </Button>
            </div>
        </div>
    );
}

export default function ProductsTable({ configCanceled }: Params) {
    const { setConfigDialogOpen, searchParams, setConfigDataSubmitted, branch, showOnlyFavorites } = UseSearchConfigStore();
    const { saveProduct, removeProduct, getAllSavedProducts, setActiveSearchItem, activeSearchItem } = UseSearchStore();
    const { setPage, page } = UseProviderInventoryPaginationState()
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const queryClient = useQueryClient();
    const [filteredProducts, setFilteredProducts] = useState<ProductSchemaType[]>([]);
    const tableRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error, setPagination, isFetching } = useProductSearch({
        name: searchParams.name,
        brand: searchParams.brand,
        branchId: searchParams.branchId,
        onlyFavorites: showOnlyFavorites,
    });

    // Memoized scroll to top function
    const scrollToTop = useCallback(() => {
        tableRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    // Memoized handleProductChange function
    const handleProductChange = useCallback((product: ProductSchemaType, quantity: number) => {
        // Save current scroll position
        const currentScroll = tableRef.current?.scrollTop;

        if (quantity === 0) {
            removeProduct(product.id);
            // Update filtered products without causing a full re-render
            setFilteredProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === product.id ? { ...p, quantity: 0 } : p
                )
            );
        } else {
            if (!product.providerId) return;

            // Create a basic search item if none exists
            const searchItem = {
                id: product.id,
                name: product.name,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            };

            // Set active search item if not already set
            if (!activeSearchItem) {
                setActiveSearchItem(searchItem);
            }

            saveProduct({ ...product, providerId: product.providerId, dropZoneId: product.dropZoneId || '' }, quantity);

            // Update filtered products without causing a full re-render
            setFilteredProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === product.id ? { ...p, quantity } : p
                )
            );
        }

        // Restore scroll position after state update
        requestAnimationFrame(() => {
            if (tableRef.current && currentScroll !== undefined) {
                tableRef.current.scrollTop = currentScroll;
            }
        });
    }, [activeSearchItem, removeProduct, saveProduct, setActiveSearchItem]);

    // Memoized loading indicator
    const loadingIndicator = useCallback(() => {
        return (
            <TableRow className="mt-12 opacity-25">
                <TableCell colSpan={100} className="p-0">
                    <div className="w-full flex flex-col space-y-2 mt-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-20 rounded-sm" />
                        ))}
                    </div>
                </TableCell>
            </TableRow>
        );
    }, []);

    useEffect(() => {
        setPage(1);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [showOnlyFavorites, setPage, setPagination]);

    useEffect(() => {
        setPagination(defaultPagination);
        setPage(defaultPagination.page)
    }, [branch, setPage, setPagination]);

    const { mutate: toggleFavoriteMutation } = useMutation({
        mutationFn: async ({ productId, newState }: { productId: string, newState: boolean }) => {
            if (!companyId) {
                throw new Error('Company ID is required');
            }
            return toggleFavorite(companyId, productId, newState);
        },
        onMutate: async ({ productId, newState }) => {
            await queryClient.cancelQueries({
                queryKey: ['client-products'],
            });

            const previousProducts = [...filteredProducts];

            // Optimistically update the UI
            setFilteredProducts((prev) =>
                prev.map((product) =>
                    product.id === productId
                        ? { ...product, isFavorite: newState }
                        : product
                )
            );

            // Handle pagination if the only item is being removed
            if (!newState && showOnlyFavorites && filteredProducts.length === 1) {
                const newPage = page > 1 ? page - 1 : 1;
                const newTotalPages = Math.max(1, data?.totalPages ? data.totalPages - 1 : 1);

                setPagination((prev) => ({ ...prev, page: newPage, totalPages: newTotalPages }));
                setPage(newPage);
            }

            return { previousProducts };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousProducts) {
                setFilteredProducts(context.previousProducts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['client-products'],
            });
        },
    });

    const handleToggleFavorite = async (productId: string, newState: boolean): Promise<void> => {
        toggleFavoriteMutation({ productId, newState });
    };

    const handleAddProductToBlackList = async (productId: string): Promise<void> => {
        setFilteredProducts((prev) => prev.filter(product => product.id !== productId));
        addProductToBlackList({ productId });
    };

    const { mutate: addProductToBlackList } = useMutation({
        mutationFn: ({ productId }: { productId: string }) => {
            if (!companyId) {
                throw new Error('Company ID is required');
            }
            return addToBlackList(companyId, productId);
        },
        onMutate: async ({ productId }) => {
            // Cancel any ongoing refetches to prevent overwriting the optistic update
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

    if (configCanceled) {
        return (
            <div className="w-full h-full flex flex-col gap-10 pt-10 items-center">
                <h1 className="text-md font-thin text-secondary text-wrap text-center">Para poder ver productos tienes que completar la configuración inicial</h1>
                <div className="w-fit h-[350px]">
                    <img className="h-[350px]" src={cancelConfig} alt="config incomplete" />
                </div>
                <Button className="w-1/3 flex gap-2" variant="outline" onClick={() => {
                    setConfigDataSubmitted(false);
                    setConfigDialogOpen(true);
                }}>
                    Configuración
                    <HiOutlineCog size={20} />
                </Button>
            </div>
        )
    }

    if (!isLoading && !data?.products.length && filteredProducts.length === 0) {
        return (
            <div className={
                "w-full h-full flex flex-col gap-4 justify-center pb-10 items-center [&>p]:multi-[font-thin;text-secondary/80;text-center;leading-3;p-0;m-0]"}>
                <img className="h-[350px]" src={productNotFound} alt="config incomplete" />
                <h1 className="text-3xl font-thin text-secondary text-wrap text-center">No encontramos productos para tu busqueda!</h1>
                <p>Para encontrar el producto que estas buscando utiliza el buscador de la derecha.</p>
                <p>También puedes usar una de tus listas ya cargadas y hacer tus búsquedas <span className="text-info font-normal">super rápidas</span> </p>
            </div>
        )
    }

    if (error) return <p>{error.message}</p>;

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="relative w-full p-10">
                <div className="h-[calc(100vh-220px)] overflow-y-auto px-2" ref={tableRef}>
                    <Table>
                        <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                            <tr className="hover:bg-white">
                                <TableHead className="w-20"></TableHead>
                                <TableHead className="w-96">Producto</TableHead>
                                <TableHead className="text-center">Unidad</TableHead>
                                <TableHead className="text-center">Unidad de Medida</TableHead>
                                <TableHead className="text-center">Precio</TableHead>
                                <TableHead className="text-center">Precio por Unidad de Medida</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </tr>
                        </TableHeader>
                        <TableBody className="[&>*]:hover:bg-white">
                            {isLoading || isFetching
                                ? loadingIndicator()
                                : (
                                    filteredProducts && filteredProducts.map((product: ProductSchemaType) => (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            onQuantityChange={handleProductChange}
                                            savedProducts={getAllSavedProducts()}
                                            handleToggleFavorite={handleToggleFavorite}
                                            addProductToBlackList={handleAddProductToBlackList}
                                        />
                                    ))
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
                {data && data.totalPages > 1 &&
                    <PaginationCustom
                        className="mt-5"
                        currentPage={page}
                        prev={page > 1}
                        next={page < data.totalPages}
                        pages={data.totalPages}
                        onPageBack={() => {
                            setPagination(prev => ({ ...prev, page: page - 1 }));
                            setPage(page - 1);
                            scrollToTop();
                        }}
                        onPageForward={() => {
                            setPagination(prev => ({ ...prev, page: page + 1 }));
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
        </ErrorBoundary>
    )
}

