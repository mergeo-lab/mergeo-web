import { Skeleton } from "@/components/ui/skeleton";
import { defaultPagination, useProductSearch } from "@/hooks/useProductsSearch";
import UseSearchStore from "@/store/search.store";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import cancelConfig from "@/assets/config-cancel.png";
import productNotFound from "@/assets/product-not-found.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseCompanyStore from "@/store/company.store";
import { addToBlackList, toggleFavorite } from "@/lib/products";
import { useEffect, useRef, useState } from "react";
import { ProductSchemaType } from "@/lib/schemas";
import { PaginationCustom } from "@/components/pagination";
import UseProviderInventoryPaginationState from "@/store/providerInventoryPagination.store";
import ProductRow from "@/components/configuration/client/orders/productRow";

type Params = {
    configCanceled: boolean,
}

export default function ProductsTable({ configCanceled }: Params) {
    const { setConfigDialogOpen, searchParams, setConfigDataSubmitted, branch, showOnlyFavorites } = UseSearchConfigStore();
    const { saveProduct, removeProduct, getAllSavedProducts } = UseSearchStore();
    const { setPage, page } = UseProviderInventoryPaginationState()
    const { company } = UseCompanyStore()
    const queryClient = useQueryClient();
    const [filteredProducts, setFilteredProducts] = useState<ProductSchemaType[]>([]);
    const tableRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error, setPagination } = useProductSearch({
        name: searchParams.name,
        brand: searchParams.brand,
        branchId: searchParams.branchId,
        onlyFavorites: showOnlyFavorites,
    });

    useEffect(() => {
        setPage(1);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [showOnlyFavorites, setPage, setPagination]);

    const { mutate: toggleFavoriteMutation } = useMutation({
        mutationFn: async ({ productId, newState }: { productId: string, newState: boolean }) => {
            if (!company?.id) {
                throw new Error('Company ID is required');
            }
            return toggleFavorite(company.id, productId, newState);
        },
        onMutate: async ({ productId, newState }) => {
            await queryClient.cancelQueries({
                queryKey: ['client-products'],
            });

            // Update the filtered products state immediately
            setFilteredProducts(prev =>
                prev.map(product =>
                    product.id === productId
                        ? { ...product, isFavorite: newState }
                        : product
                )
            );

            // Get the previous state
            const previousProducts = filteredProducts;

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

    useEffect(() => {
        setPagination(defaultPagination);
        setPage(defaultPagination.page)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch]);

    useEffect(() => {
        console.log("FETCHING DATA", data);
        if (!data) return;
        setFilteredProducts(data?.products || []);
        console.log("Updated filteredProducts:", data?.products);
    }, [data]);

    if (configCanceled) {
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
        // Save current scroll position
        const currentScroll = tableRef.current?.scrollTop;

        if (quantity === 0) {
            removeProduct(product.id);
        } else {
            saveProduct(product, quantity);
        }

        // Update filtered products without causing a full re-render
        setFilteredProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === product.id ? { ...p, quantity } : p
            )
        );

        // Restore scroll position after state update
        requestAnimationFrame(() => {
            if (tableRef.current && currentScroll !== undefined) {
                tableRef.current.scrollTop = currentScroll;
            }
        });
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
                            <TableHead className={`text-center`}>Precio por Unidad de Medida</TableHead>
                            <TableHead className={`text-center`}>Precio</TableHead>
                            <TableHead className={`text-center`}></TableHead>
                            <TableHead className={`text-right pr-12`}>Cantidad</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&>*]:hover:bg-white">
                        {
                            isLoading
                                ? loadingIndicator()
                                : (
                                    filteredProducts && filteredProducts.map((product: ProductSchemaType) => (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            onQuantityChange={(product, quantity) => handleProductChange(product, quantity)}
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
                    className="mt-10"
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
    )
}