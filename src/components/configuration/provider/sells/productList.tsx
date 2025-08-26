import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PRE_ORDER_STATUS } from '@/lib/constants';
import { PreOrderProductSchemaType } from '@/lib/schemas';
import { SellProductSchemaType } from '@/lib/schemas/sell.schema';
import { cn, formatToArgentinianPesos } from '@/lib/utils';

type Props = {
    orderStatus: PRE_ORDER_STATUS | undefined,
    data: PreOrderProductSchemaType[] | undefined,
    providerId: string | undefined,
    dropZoneId: string | undefined,
    acceptedProducts: SellProductSchemaType[],
    isLoading: boolean,
    isProvider: boolean,
    toggleAllProducts: () => void
    onSelect: (product: SellProductSchemaType) => void
    disabled?: boolean
    totalPrice?: number
    totalAcceptedPrice?: number
}

export default function ProductList({ orderStatus, data, providerId, dropZoneId, acceptedProducts, isProvider = true, isLoading, onSelect, toggleAllProducts, disabled = false, totalPrice, totalAcceptedPrice  }: Props) {

    // Debug: Check dropZoneId
    console.log('ProductList totalPrice:', totalPrice);
    console.log('ProductList totalAcceptedPrice:', totalAcceptedPrice);

    return (
        <div className={cn('w-[calc(100%-32px)] h-full overflow-y-auto m-auto rounded shadow-sm', {
            'h-fit': data && data?.length < 8
        })}>
            <Table>
                <TableHeader className='sticky top-0 shadow-sm'>
                    <TableRow className="bg-white hover:bg-white [&>th]:text-secondary/90 [&>th]:font-thin">
                        <TableHead>PRODCUTO</TableHead>
                        <TableHead>UNIDAD DE MEDIDA</TableHead>
                        <TableHead>CANTIDAD</TableHead>
                        <TableHead>PRECIO</TableHead>
                        {orderStatus !== PRE_ORDER_STATUS.pending && <TableHead>ESTADO</TableHead>}
                        <TableHead className={cn('text-right' )}>PRECIO TOTAL</TableHead>

                        {isProvider && orderStatus === PRE_ORDER_STATUS.pending &&
                            <TableHead className='text-right w-72'>
                                <div
                                    className={cn('m-0 h-8 space-x-2 flex justify-end mr-20 items-center', {
                                        'cursor-pointer': !disabled,
                                        'cursor-not-allowed opacity-50': disabled
                                    })}
                                    onClick={disabled ? undefined : () => {
                                        toggleAllProducts();
                                    }}
                                >
                                    <Label className={cn('text-sm font-thin', {
                                        'cursor-pointer': !disabled,
                                        'cursor-not-allowed': disabled
                                    })}>{
                                            acceptedProducts.length !== data?.length ? 'Seleccionar todos' : 'Deseleccionar todos'}</Label>
                                    <Checkbox
                                        checked={acceptedProducts.length !== data?.length}
                                        disabled={
                                            orderStatus !== PRE_ORDER_STATUS.pending && acceptedProducts.length !== data?.length || disabled}
                                    />
                                </div >
                            </TableHead>
                        }
                    </TableRow>
                </TableHeader>
                {isLoading ?
                    <TableBody className="bg-white hover:bg-white">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <TableRow key={"tr-" + index} className="hover:bg-transparent border-none">
                                <TableCell colSpan={7} className="h-0 p-2 border-none hover:none ">
                                    <Skeleton key={index} className="h-14 w-full rounded-sm" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    :
                    <>
                        <TableBody className="bg-white">
                            <TableRow className="bg-border/30 hover:bg-border/30">
                                <TableCell colSpan={6} className="h-[1px] p-1"></TableCell>
                            </TableRow>
                            {
                                data && data.map((item) => {
                                    const product = item.product



                                    return (
                                        <TableRow key={product.id} className={cn("hover:bg-white first:border-t-none", {
                                            'bg-green-50 hover:bg-green-50': item.accepted && (orderStatus === PRE_ORDER_STATUS.accepted || orderStatus === PRE_ORDER_STATUS.partialyAccepted),
                                            'bg-red-50 hover:bg-red-50': !item.accepted && (orderStatus === PRE_ORDER_STATUS.rejected || orderStatus === PRE_ORDER_STATUS.partialyAccepted),
                                            'hover:bg-white': orderStatus === PRE_ORDER_STATUS.pending || orderStatus !== PRE_ORDER_STATUS.rejected
                                        })}>
                                            <TableCell>
                                                <div> {product?.name} {product?.variety}</div>
                                                <div className='text-muted font-thin'>{product?.brand}</div>
                                            </TableCell>
                                            <TableCell>{product?.netContent} {product?.measurementUnit}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{
                                            orderStatus == PRE_ORDER_STATUS.pending
                                                ? <p>{formatToArgentinianPesos(+item?.price)}</p>
                                                : item.accepted
                                                    ? <p className='text-primary'>{formatToArgentinianPesos(+item?.price)}</p>
                                                    : <p className='text-destructive'> - {formatToArgentinianPesos(+item?.price)}</p>
                                            }</TableCell>
                                            {orderStatus !== PRE_ORDER_STATUS.pending &&
                                                <TableCell>{item.accepted
                                                    ? <p className='text-primary'>Aceptado</p>
                                                    : <p className='text-destructive font-thin'>Rechazado</p>}
                                                </TableCell>
                                            }
                                            <TableCell className={cn( 'text-right' )}>
                                                {orderStatus == PRE_ORDER_STATUS.pending
                                                    ? <p>{formatToArgentinianPesos(item.quantity * +item?.price)}</p>
                                                    : item.accepted 
                                                        ? <p className='text-primary'>{formatToArgentinianPesos(item.quantity * +item?.price)}</p> 
                                                        : <p className='text-destructive'> - {formatToArgentinianPesos(item.quantity * +item?.price)}</p>
                                                }
                                                </TableCell>

                                            {isProvider && orderStatus === PRE_ORDER_STATUS.pending &&
                                                <TableCell className='text-right w-72'>
                                                    <div className='flex justify-end mr-20'>
                                                        <Checkbox
                                                            disabled={
                                                                orderStatus !== PRE_ORDER_STATUS.pending && !product.accepted || disabled}
                                                            checked={
                                                                orderStatus === PRE_ORDER_STATUS.pending
                                                                    ? !(acceptedProducts || []).find((p) => p.id === item.id)
                                                                    : product.accepted
                                                            }
                                                            onClick={disabled ? undefined : () => onSelect({
                                                                id: item.id,
                                                                quantity: item.quantity,
                                                                price: String(item.price),
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
                                <TableCell colSpan={2} className="h-[1px] p-1">
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableBody className="bg-white sticky bottom-[-1px] shadow w-full">
                            <TableRow className='bg-white hover:bg-white'>
                                <TableCell colSpan={orderStatus === PRE_ORDER_STATUS.pending ? 4 : 5} className="h-[1px] p-1 pl-10 py-4">TOTAL</TableCell>
                                <TableCell className={cn("h-[2px] font-bold text-right")}>
                                    {orderStatus === PRE_ORDER_STATUS.pending 
                                        ? <p>{formatToArgentinianPesos(totalPrice || 0)}</p>
                                        : <p>{formatToArgentinianPesos(totalAcceptedPrice || 0)}</p>
                                    }
                                </TableCell>
                                { orderStatus === PRE_ORDER_STATUS.pending &&
                                    <TableCell colSpan={2} className="h-[1px] p-1">
                                    </TableCell>
                                }
                            </TableRow>
                        </TableBody>
                    </>
                }
            </Table>
        </div >

    )
}