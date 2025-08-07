import BackLink from '@/components/backLink';
import FileNameBadge from '@/components/fileNameBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';
import { useAuth } from '@/context/AuthContext';
import { ActivityType } from '@/lib/constants';
import { getProductById, getProductMetadata, modifyProduct } from '@/lib/products';
import { ProductMetadataType, ProductSchemaType } from '@/lib/schemas';
import { cn, formatDate, formatToArgentinianPesos } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { LuImage, LuMoveRight, LuSquarePen, LuX } from 'react-icons/lu';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/products/$productId')({
    component: () => <ProductDetail />,
    validateSearch: (search: Record<string, unknown>) => {
        return ({
            edit: search.edit as boolean,
            currentPage: search.currentPage as string
        })
    }
})

export default function ProductDetail() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const { productId } = useParams({ from: '/_authenticated/_dashboardLayout/_accountType/provider/products/$productId' });
    const { edit, currentPage } = useSearch({
        from: '/_authenticated/_dashboardLayout/_accountType/provider/products/$productId'
    });
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [changes, setChanges] = useState<{ price: number | undefined, description?: string | undefined } | null>(null);
    const [isPriceCleared, setIsPriceCleared] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const { data, isLoading, isError, refetch } = useQuery<{
        product: ProductSchemaType | null;
        productMetadata: ProductMetadataType | null;
    }>({
        queryKey: ['combinedData', { productId }],
        queryFn: async () => {
            if (!productId) {
                return { product: null, productMetadata: null }; // Return null when no productId is provided
            }
            const [product, productMetadata] = await Promise.all([
                getProductById(productId), // Call the first API
                getProductMetadata(productId) // Call the second API
            ]);
            return { product, productMetadata };
        },
        enabled: !!productId, // Only run the query if params exist
        staleTime: 0, // Always consider data stale to force fresh fetches
        gcTime: 0, // Don't cache anything
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    async function saveChanges() {
        // Validate that we have a valid price when saving
        if (isPriceCleared) {
            alert('El precio no puede estar vacío');
            return;
        }

        const currentPrice = changes?.price ?? Number(data?.product?.price);
        if (currentPrice === undefined || currentPrice === null || isNaN(currentPrice) || currentPrice <= 0) {
            alert('El precio debe ser un número válido mayor a 0');
            return;
        }

        if (changes?.price !== undefined || changes?.description) {
            setIsUpdating(true);

            try {
                const formattedPrice = changes.price?.toFixed(2) || Number(data?.product?.price)?.toFixed(2) || '0.00';
                const update = await mutation.mutateAsync({
                    productId,
                    price: formattedPrice,
                    description: changes?.description
                });

                if (update) {
                    console.log('Product updated successfully:', update);

                    // Reset changes after successful update
                    setChanges(null);
                    setIsPriceCleared(false);

                    // Force a complete cache invalidation for all product-related queries
                    await queryClient.invalidateQueries({
                        predicate: (query) => {
                            const queryKey = query.queryKey;
                            return (
                                Array.isArray(queryKey) &&
                                (queryKey[0] === 'combinedData' ||
                                    queryKey[0] === 'products' ||
                                    queryKey[0] === 'client-products' ||
                                    queryKey[0] === 'products-search')
                            );
                        }
                    });

                    // Force a refetch of the current data and wait for it to complete
                    await refetch();
                }
                setIsEditing(false);
            } finally {
                setIsUpdating(false);
            }
        }
    }

    const hasValidPrice = () => {
        // If the price field is cleared, it's not valid
        if (isPriceCleared) return false;

        const currentPrice = changes?.price ?? Number(data?.product?.price);
        return currentPrice !== undefined && currentPrice !== null && !isNaN(currentPrice) && currentPrice > 0;
    };

    const getPriceError = () => {
        // If the price field is cleared, show error
        if (isPriceCleared) return 'El precio no puede estar vacío';

        const currentPrice = changes?.price ?? Number(data?.product?.price);
        if (currentPrice === 0) return 'El precio no puede ser 0';
        if (currentPrice !== undefined && currentPrice !== null && !isNaN(currentPrice) && currentPrice < 0) return 'El precio no puede ser negativo';
        return null;
    };

    const mutation = useMutation({
        mutationFn: ({ productId, price, description }: {
            productId: string,
            price: string,
            description: string | undefined
        }) => modifyProduct({ productId, companyId, price, description }),
        onSuccess: async () => {

            // Force a complete cache invalidation for all product-related queries
            await queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    return (
                        Array.isArray(queryKey) &&
                        (queryKey[0] === 'combinedData' ||
                            queryKey[0] === 'products' ||
                            queryKey[0] === 'client-products' ||
                            queryKey[0] === 'products-search')
                    );
                }
            });

            // Force a refetch of the current data and wait for it to complete
            await refetch();
        },
        onError: (error) => {
            console.error('Error updating product:', error);
        },
    })

    useEffect(() => {
        setIsEditing(edit);
    }, [edit]);

    if (isError) {
        return <div>Error</div>
    }

    return (
        <div className='relative h-full overflow-y-hidden'>
            {(mutation.isPending || isUpdating) && (
                <OverlayLoadingIndicator label="Guardando cambios..." />
            )}
            <div className='flex flex-col px-10'>
                <div className='flex items-center px-6 pt-6 pb-3 gap-2'>
                    {isLoading
                        ? <Skeleton className="h-10 w-1/3 rounded-sm -ml-6" />
                        :
                        <>
                            <BackLink className='-ml-6' location={{ path: '/provider/products', search: { currentPage } }} />
                            <h1 className="text-md font-bold leading-none">{data?.product?.name}</h1>
                            <Button
                                className={cn('fill-mode-forwards', {
                                    'animate-in fade-in': !isEditing,
                                    'cursor-default': isEditing,
                                    'animate-out fade-out': isEditing,
                                })}
                                size="sm"
                                variant='outlineSecondary'
                                title='Editar producto'
                                onClick={() => setIsEditing(true)}
                            >
                                <LuSquarePen size={18} />
                            </Button>
                        </>
                    }
                </div>

                {isLoading
                    ? <Skeleton className="h-[22rem] w-full rounded" />
                    : <div className="bg-gray-100 p-8 flex flex-col md:flex-row gap-8 rounded">
                        {!data?.product?.image
                            ? (<div className="bg-gray-200 border-2 rounded-xl h-72 aspect-square p-4 flex justify-center items-center">
                                <LuImage size={100} className='text-muted' />
                            </div>)
                            : (<div className="bg-white flex justify-center items-center border-2 rounded-xl h-72 aspect-square p-6">
                                <img src={data?.product?.image} alt="" className='bg-contain h-72 p-2' />
                            </div>
                            )
                        }
                        <div className="w-full bg-white p-6 shadow-sm rounded-lg relative">
                            <div className='flex'>
                                <div className="w-2/5 mb-4 [&>p]:text-black/50 [&>p>strong]:text-black space-y-2">
                                    <p><strong>Marca:</strong> {data?.product?.brand}</p>
                                    <p><strong>GTIN/EAN:</strong> {data?.product?.gtin}</p>
                                    <p><strong>Contenido Neto:</strong> {data?.product?.netContent} {data?.product?.measurementUnit}</p>
                                    <p><strong>Variedad:</strong> {data?.product?.variety}</p>
                                    <p><strong>Segmento:</strong> {data?.product?.segment}</p>
                                    <p><strong>Familia:</strong> {data?.product?.family}</p>
                                    <p><strong>Editado:</strong> {data?.product && formatDate(data?.product?.updated)}</p>
                                </div>
                                <div className='w-2/6'>
                                    <p><strong>Descripción:</strong></p>
                                    {!isEditing
                                        ? <p className='font-light text-base text-black/50'>{data?.product?.description}</p>
                                        : <Textarea
                                            className='h-48'
                                            value={changes?.description ?? data?.product?.description ?? ''}
                                            onChange={(e) => setChanges((prev) => ({
                                                ...prev ?? { price: data?.product && +data?.product?.price || 0, description: data?.product && data?.product?.description },
                                                description: e.target.value,
                                            }))}
                                            disabled={mutation.isPending || isUpdating}
                                        />
                                    }
                                </div>
                                <div className={cn('absolute top-6 right-10 flex gap-2',
                                    {
                                        'flex-col': isEditing
                                    }
                                )}
                                >
                                    <p>Precio:</p>
                                    {!isEditing
                                        ? <div className="flex flex-col gap-1">
                                            <h2 className="text-md font-bold leading-none">{
                                                data?.product && formatToArgentinianPesos(+data?.product?.price)}
                                            </h2>
                                            <p className="text-[14px] text-right text-muted-foreground/80">
                                                PUM: {data?.product && formatToArgentinianPesos(+data?.product?.pricePerBaseUnit)}
                                            </p>
                                        </div>
                                        :
                                        <div className="relative">
                                            <Input
                                                value={isPriceCleared ? '' : (changes?.price?.toString() ?? data?.product?.price?.toString() ?? '')}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setIsPriceCleared(false);
                                                    setChanges((prev) => ({
                                                        ...prev ?? { price: data?.product && +data?.product?.price || 0, description: data?.product?.description },
                                                        price: value === '' ? undefined : parseFloat(value.replace(",", ".")) || undefined,
                                                    }));
                                                }}
                                                disabled={mutation.isPending || isUpdating}
                                                placeholder="0.00"
                                                className={`w-48 ${getPriceError() ? 'border-red-500' : ''}`}
                                            />
                                            {isEditing && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                                                    onClick={() => {
                                                        setIsPriceCleared(true);
                                                        setChanges((prev) => ({
                                                            ...prev ?? { price: data?.product && +data?.product?.price || 0, description: data?.product?.description },
                                                            price: undefined,
                                                        }));
                                                    }}
                                                    disabled={mutation.isPending || isUpdating}
                                                >
                                                    <LuX size={14} />
                                                </Button>
                                            )}
                                            {getPriceError() && (
                                                <p className="text-red-500 text-sm mt-1 absolute -bottom-6 left-0">{getPriceError()}</p>
                                            )}
                                        </div>

                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <h2 className='text-md mt-4 mb-2 pl-8'>Actividad del producto</h2>
                <div className='w-full h-[16rem] p-8 overflow-auto shadow rounded'>
                    <div className='flex flex-col gap-5'>
                        {data?.productMetadata?.userActivity.map((activity) => {
                            const getActivity = ActivityType[activity.action.toUpperCase()];

                            return <div key={activity.timestamp + activity.user}>
                                <div className='flex gap-2'>
                                    <div className={`capitalize
                                                ${getActivity.classname}
                                                rounded-sm px-2`
                                    }>
                                        {getActivity.type.toLowerCase()}
                                    </div> por <span className='text-highlight/50 font-semibold'>{activity.user}</span>
                                    <div className='font-light text-black/50'>{formatDate(activity.timestamp)}</div>
                                </div>
                                <div className='border border-border rounded p-2'>
                                    {
                                        activity?.details?.message ? (
                                            <div className='flex gap-2'>
                                                <div>{activity?.details?.message}</div>
                                                <FileNameBadge fileName={activity?.fileName} />
                                            </div>
                                        )
                                            : (
                                                <>
                                                    {activity?.details?.price && (
                                                        <div>
                                                            <span>Precio:</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-muted">
                                                                    {formatToArgentinianPesos(+(activity.details?.price?.old ?? 0))}
                                                                </span>
                                                                <LuMoveRight className="text-info" />
                                                                {formatToArgentinianPesos(+(activity.details?.price?.new ?? 0))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {activity?.details?.description && (
                                                        <div>
                                                            <span>Descripción:</span>
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-muted">
                                                                    {activity.details?.description?.old ?? ""}
                                                                </span>
                                                                <LuMoveRight className="text-info" />
                                                                {activity.details?.description?.new ?? ""}
                                                            </div>
                                                            {activity?.fileName &&
                                                                <div className='flex gap-2'>
                                                                    <div>Modificado desde archivo</div>
                                                                    <FileNameBadge fileName={activity?.fileName} />
                                                                </div>
                                                            }
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                </div>
                            </div>
                        })}
                    </div>
                </div>

                <div className={cn('flex items-center justify-end gap-2 absolute -bottom-32 left-0 px-10 h-28 bg-white shadow w-full transition-all duration-300 ease-out', {
                    "bottom-0": isEditing
                })}>
                    <Button
                        onClick={saveChanges}
                        disabled={mutation.isPending || isUpdating || !hasValidPrice()}
                    >
                        {(mutation.isPending || isUpdating) ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={() => {
                            // Reset changes to original values
                            setChanges(null);
                            setIsPriceCleared(false);
                            setIsEditing(false);
                        }}
                        disabled={mutation.isPending || isUpdating}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>


        </div >
    )
}