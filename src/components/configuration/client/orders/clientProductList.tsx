import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PRE_ORDER_STATUS, ProductStatus } from '@/lib/constants';
import { NewPreOrderProductSchemaType } from '@/lib/schemas';
import { SellProductSchemaType } from '@/lib/schemas/sell.schema';
import { cn, formatToArgentinianPesos } from '@/lib/utils';
import { FiAlertCircle } from 'react-icons/fi';
import { LuShoppingCart } from 'react-icons/lu';
import { Link } from '@tanstack/react-router';

type Props = {
    orderStatus: PRE_ORDER_STATUS | undefined,
    data: NewPreOrderProductSchemaType[] | undefined,
    providerId?: string,
    dropZoneId?: string,
    acceptedProducts?: SellProductSchemaType[],
    isLoading: boolean,
    isProvider: boolean,
    toggleAllProducts?: () => void
    onSelect?: (product: SellProductSchemaType) => void
    disabled?: boolean
    totalPrice?: number
}

export default function ClientProductList({ orderStatus, data, providerId, dropZoneId, acceptedProducts, isProvider = false, isLoading, onSelect, toggleAllProducts, disabled = false, totalPrice }: Props) {

    const total = data && data.reduce((acc, item) => {
        // Check if the item is in the acceptedProducts array
        let isAccepted = false;
        if (orderStatus === PRE_ORDER_STATUS.pending) {
            isAccepted = acceptedProducts && acceptedProducts.some(
                (accepted) => accepted.id === item.id
            ) || false;
        } else if (orderStatus === PRE_ORDER_STATUS.accepted || orderStatus === PRE_ORDER_STATUS.partialyAccepted) {
            isAccepted = item.productStatus === ProductStatus.accepted;
        }

        if (isAccepted) {
            const itemTotal = item.quantity * +item.price || 0;
            return acc + itemTotal;
        }

        return acc;
    }, 0);

    const formattedTotal = total && formatToArgentinianPesos(total);

    return (
        <div className={cn('w-[calc(100%-32px)] h-full overflow-y-auto m-auto rounded shadow-sm', {
            'h-fit': data && data?.length < 8
        })}>
            <Table>
                <TableHeader className='sticky top-0 shadow-sm'>
                    <TableRow className="bg-white hover:bg-white [&>th]:text-secondary/90 [&>th]:font-thin">
                        <TableHead>PRODUCTO</TableHead>
                        <TableHead>CANTIDAD</TableHead>
                        <TableHead>PRECIO</TableHead>
                        {orderStatus !== PRE_ORDER_STATUS.pending && <TableHead>ESTADO</TableHead>}
                        {orderStatus !== PRE_ORDER_STATUS.pending && <TableHead>ORDEN</TableHead>}
                        <TableHead className={cn({ 'text-right pr-14': !isProvider })}>PRECIO TOTAL</TableHead>

                        {isProvider && orderStatus === PRE_ORDER_STATUS.pending &&
                            <TableHead className='text-right w-72'>
                                <div
                                    className={cn('m-0 h-8 space-x-2 flex justify-end mr-20 items-center', {
                                        'cursor-pointer': !disabled,
                                        'cursor-not-allowed opacity-50': disabled
                                    })}
                                    onClick={disabled ? undefined : () => {
                                        toggleAllProducts && toggleAllProducts();
                                    }}
                                >
                                    <Label className={cn('text-sm font-thin', {
                                        'cursor-pointer': !disabled,
                                        'cursor-not-allowed': disabled
                                    })}>{
                                            acceptedProducts && acceptedProducts.length !== data?.length ? 'Seleccionar todos' : 'Deseleccionar todos'}</Label>
                                    <Checkbox
                                        checked={acceptedProducts && acceptedProducts.length !== data?.length}
                                        disabled={
                                            orderStatus !== PRE_ORDER_STATUS.pending && acceptedProducts && acceptedProducts.length !== data?.length || disabled}
                                    />
                                </div >
                            </TableHead>
                        }
                    </TableRow>
                </TableHeader>
                {isLoading ? (
                    <>

                        <TableBody className="bg-white hover:bg-white">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <TableRow key={"tr-" + index} className="hover:bg-transparent border-none">
                                    <TableCell colSpan={6} className="h-0 p-2 border-none hover:none ">
                                        <Skeleton key={index} className="h-14 w-full rounded-sm" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                ) : (
                    <>

                        <TableBody className="bg-white">
                            <TableRow className="bg-border/30 hover:bg-border/30">
                                <TableCell colSpan={6} className="h-[1px] p-1"></TableCell>
                            </TableRow>
                            {
                                data && data.map((item) => {
                                    console.log('Rendering client product:', item);
                                    return (
                                        <TableRow key={item.id} className={cn("hover:bg-white first:border-t-none", {
                                            'bg-green-50 hover:bg-green-50': item.productStatus === ProductStatus.accepted && (orderStatus === PRE_ORDER_STATUS.accepted || orderStatus === PRE_ORDER_STATUS.partialyAccepted),
                                            'bg-red-50 hover:bg-red-50': item.productStatus === ProductStatus.notFound && (orderStatus === PRE_ORDER_STATUS.rejected || orderStatus === PRE_ORDER_STATUS.partialyAccepted),
                                            'hover:bg-white': orderStatus === PRE_ORDER_STATUS.pending || orderStatus !== PRE_ORDER_STATUS.rejected
                                        })}>
                                            <TableCell>
                                                <div>{item.productName} {item.variety}</div>
                                                <div className='text-muted font-thin'>{item.brand}</div>
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{formatToArgentinianPesos(+item.price)}</TableCell>
                                            {orderStatus !== PRE_ORDER_STATUS.pending &&
                                                <TableCell>
                                                    {item.productStatus === ProductStatus.accepted && <p className='text-green-600 font-medium'>Aceptada</p>}
                                                    {item.productStatus === ProductStatus.notFound && (
                                                        <div className='flex items-center gap-2'>
                                                            <FiAlertCircle className='text-red-600' size={16} />
                                                            <p className='text-red-600 font-medium'>El producto no está disponible</p>
                                                        </div>
                                                    )}
                                                    {item.productStatus === ProductStatus.processed && <p className='text-violet-600 font-medium'>Procesando</p>}
                                                    {item.productStatus === ProductStatus.pending && <p className='text-orange-600 font-medium'>Pendiente</p>}
                                                </TableCell>
                                            }
                                            {orderStatus !== PRE_ORDER_STATUS.pending &&
                                                <TableCell>
                                                    {item.buyOrderId ? (
                                                        <Link to="/buyOrder/$orderId" params={{ orderId: item.buyOrderId }}>
                                                            <div className='flex items-center gap-2 text-blue-600 hover:text-blue-800'>
                                                                <LuShoppingCart size={16} />
                                                                <span className='text-sm'>Ver orden</span>
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <span className='text-muted text-sm'>-</span>
                                                    )}
                                                </TableCell>
                                            }
                                            <TableCell className={cn({ 'text-right pr-14': !isProvider })}>{formatToArgentinianPesos(item.quantity * +item.price)}</TableCell>

                                            {isProvider && orderStatus === PRE_ORDER_STATUS.pending &&
                                                <TableCell className='text-right w-72'>
                                                    <div className='flex justify-end mr-20'>
                                                        <Checkbox
                                                            disabled={
                                                                orderStatus !== PRE_ORDER_STATUS.pending && item.productStatus !== ProductStatus.accepted || disabled}
                                                            checked={
                                                                orderStatus === PRE_ORDER_STATUS.pending
                                                                    ? !(acceptedProducts || []).find((p) => p.id === item.id)
                                                                    : item.productStatus === ProductStatus.accepted
                                                            }
                                                            onClick={disabled ? undefined : () => onSelect && onSelect({
                                                                id: item.id,
                                                                quantity: item.quantity,
                                                                price: item.price,
                                                                providerId: providerId || '',
                                                                dropZoneId: dropZoneId || '',
                                                            })} />

                                                    </div>
                                                </TableCell>}
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow className="bg-border/30 hover:bg-border/30">
                                <TableCell colSpan={6} className="h-[1px] p-1"></TableCell>
                            </TableRow>
                        </TableBody>
                        <TableBody className="bg-white sticky bottom-[-1px] shadow">
                            <TableRow className='bg-white hover:bg-white'>
                                <TableCell colSpan={5} className="h-[1px] p-1 pl-10 py-4">TOTAL</TableCell>
                                <TableCell className={cn("h-[2px] p-2 font-bold text-right", {
                                    'pr-14': !isProvider
                                })}>
                                    {!isProvider
                                        ? <p>{formatToArgentinianPesos(totalPrice || 0)}</p>
                                        : formattedTotal}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                )}
            </Table>
        </div >

    )
}
