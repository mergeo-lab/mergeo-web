import BackLink from '@/components/backLink';
import FileNameBadge from '@/components/fileNameBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ActivityType } from '@/lib/constants';
import { getProductById, getProductMetadata, modifyProduct } from '@/lib/products';
import { ProductMetadataType, ProductSchemaType } from '@/lib/schemas';
import { cn, formatDate, formatToArgentinianPesos } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams, useSearch } from '@tanstack/react-router'
import { Edit, MoveRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const { productId } = useParams({ from: '/_authenticated/_dashboardLayout/_accountType/provider/products/$productId' });
    const { edit, currentPage } = useSearch({
        from: '/_authenticated/_dashboardLayout/_accountType/provider/products/$productId'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [changes, setChanges] = useState<{ price: number, description?: string | undefined } | null>(null);

    const { data, isLoading, isError, refetch } = useQuery<{
        product: ProductSchemaType | null;
        productMetadata: ProductMetadataType | null;
    }>({
        queryKey: ['combinedData', { productId, isEditing }],
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
    });

    async function saveChanges() {
        if (changes?.price || changes?.description) {
            const formattedPrice = changes.price.toFixed(2); // Ensure consistent decimal places
            const update = await mutation.mutateAsync({
                productId,
                price: formattedPrice,
                description: changes?.description
            });

            if (update) {
                setChanges({
                    price: Number(update.price), // Convert price to number
                    description: update.description
                }); // Reset changes after successful update
                await refetch(); // Add await to ensure the refetch completes
            }
            setIsEditing(false);
        }
    }

    const mutation = useMutation({
        mutationFn: ({ productId, price, description }: {
            productId: string,
            price: string,
            description: string | undefined
        }) => modifyProduct({ productId, price, description }),
        onSuccess: () => {
            refetch();
        },
    })

    useEffect(() => {

        console.log("edit ::: ", edit);

        setIsEditing(edit);
    }, [edit]);

    if (isError) {
        return <div>Error</div>
    }

    return (
        <div className='relative h-full overflow-y-hidden'>
            {/* {isLoading ?
                <div className='w-full h-full flex flex-col px-10 pt-5 gap-2'>
                    <Skeleton className="h-12 w-1/3 opacity-10 bg-muted/30 rounded-sm" />
                    <Skeleton className="h-[22rem] w-full opacity-10 bg-muted/30 rounded-sm" />
                    <Skeleton className="h-[22rem] w-full opacity-10 bg-muted/30 rounded-sm" />
                </div>
                : */}
            <div className='flex flex-col px-10'>
                <div className='flex items-center px-6 pt-6 pb-3 gap-2'>
                    {isLoading
                        ? <Skeleton className="h-10 w-1/3 opacity-10 bg-muted/30 rounded-sm -ml-6" />
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
                                <Edit size={18} />
                            </Button>
                        </>
                    }
                </div>

                {isLoading
                    ? <Skeleton className="h-[22rem] w-full opacity-10 bg-muted/30 rounded" />
                    : <div className="bg-gray-100 p-8 flex flex-col md:flex-row gap-8 rounded">
                        <div className="bg-gray-200 border-2 rounded-xl h-72 aspect-square" />
                        <div className="w-full bg-white p-6 shadow-sm rounded-lg relative">
                            <div className='flex'>
                                <div className="w-2/5 mb-4 [&>p]:text-black/50 [&>p>strong]:text-black space-y-2">
                                    <p><strong>Marca:</strong> {data?.product?.brand}</p>
                                    <p><strong>GTIN/EAN:</strong> {data?.product?.gtin}</p>
                                    <p><strong>Contenido Neto:</strong> {data?.product?.net_content} {data?.product?.measurementUnit}</p>
                                    <p><strong>Variedad:</strong> {data?.product?.variety}</p>
                                    <p><strong>Segmento:</strong> {data?.product?.segment}</p>
                                    <p><strong>Familia:</strong> {data?.product?.family}</p>
                                    <p><strong>Editado:</strong> {data?.product && formatDate(data?.product?.updated)}</p>
                                </div>
                                <div className='w-2/5'>
                                    <p><strong>Descripción:</strong></p>
                                    {!isEditing
                                        ? <p className='font-light text-base text-black/50'>{data?.product?.description}</p>
                                        : <Textarea
                                            className='h-48'
                                            defaultValue={data?.product?.description}
                                            onChange={(e) => setChanges((prev) => ({
                                                ...prev ?? { price: data?.product && +data?.product?.price || 0, description: data?.product && data?.product?.description },
                                                description: e.target.value,
                                            }))}
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
                                        ? <h2 className="text-md font-bold mb-2 leading-none">{
                                            data?.product && formatToArgentinianPesos(+data?.product?.price)}
                                        </h2>
                                        :
                                        <Input
                                            defaultValue={changes?.price || data?.product?.price}
                                            onChange={(e) => {
                                                const newPrice = parseFloat(e.target.value.replace(",", ".")); // Ensure it's a valid number
                                                setChanges((prev) => ({
                                                    ...prev,
                                                    price: !isNaN(newPrice) ? newPrice : prev?.price ?? 0,
                                                }));
                                            }}
                                        ></Input>

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
                                                                <MoveRight className="text-info" />
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
                                                                <MoveRight className="text-info" />
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
                    <Button onClick={saveChanges}>Guardar cambios</Button>
                    <Button
                        variant='destructive'
                        onClick={() => {
                            const price = Number(data?.product?.price);
                            setChanges({ description: data?.product?.description, price: price })
                            setIsEditing(false)
                        }}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>


        </div >
    )
}