import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PRE_ORDER_STATUS, ProductStatus } from '@/lib/constants';
import { NewPreOrderProductSchemaType } from '@/lib/schemas';
import { cn, formatToArgentinianPesos } from '@/lib/utils';
import { FiAlertCircle } from 'react-icons/fi';
import { LuShoppingCart } from 'react-icons/lu';
import { Link } from '@tanstack/react-router';

type Props = {
    orderStatus: PRE_ORDER_STATUS | undefined,
    data: NewPreOrderProductSchemaType[] | undefined,
    isLoading: boolean,
    isProvider: boolean,
    totalPrice?: number,
    totalAcceptedPrice?: number
}

export default function ClientProductList({ orderStatus, data, isProvider = false, isLoading, totalPrice, totalAcceptedPrice }: Props) {

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
                                            {/* Estado de la orden */}
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
                                            {/* Orden de compra */}
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
                                            {/* Precio total */}
                                            { orderStatus === PRE_ORDER_STATUS.pending 
                                            ? <TableCell className={cn({ 'text-right pr-14': !isProvider })}>{formatToArgentinianPesos(item.quantity * +item.price)}</TableCell>
                                            : <TableCell className={cn({ 'text-right pr-14': !isProvider}, {'text-destructive': item.productStatus !== ProductStatus.accepted})}>
                                                {item.productStatus !== ProductStatus.accepted && ' - '}
                                                {formatToArgentinianPesos(item.quantity * +item.price)}
                                            </TableCell>
                                            }
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow className="bg-border/30 hover:bg-border/30">
                                <TableCell colSpan={ orderStatus === PRE_ORDER_STATUS.pending ? 6 : 5} className="h-[1px] p-1"></TableCell>
                            </TableRow>
                        </TableBody>
                        <TableBody className="bg-white sticky bottom-[-1px] shadow">
                            <TableRow className='bg-white hover:bg-white'>
                                <TableCell colSpan={ orderStatus === PRE_ORDER_STATUS.pending ? 3 : 5} className="h-[1px] p-1 pl-10 py-4">TOTAL</TableCell>
                                <TableCell className={cn("h-[2px] p-2 font-bold text-right", {
                                    'pr-14': !isProvider
                                })}>
                                    {
                                        orderStatus !== PRE_ORDER_STATUS.pending ? <p>{formatToArgentinianPesos(totalAcceptedPrice || 0)}</p>
                                        : <p>{formatToArgentinianPesos(totalPrice || 0)}</p>
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                )}
            </Table>
        </div >

    )
}
