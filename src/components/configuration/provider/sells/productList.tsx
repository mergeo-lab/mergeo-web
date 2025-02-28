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
    acceptedProducts: SellProductSchemaType[],
    isLoading: boolean,
    isProvider: boolean,
    toggleAllProducts: () => void
    onSelect: (product: SellProductSchemaType) => void
}

export default function ProductList({ orderStatus, data, providerId, acceptedProducts, isProvider = true, isLoading, onSelect, toggleAllProducts }: Props) {

    const total = data && data.reduce((acc, item) => {
        // Check if the item is in the acceptedProducts array
        let isAccepted = false;
        if (orderStatus === PRE_ORDER_STATUS.pending) {
            isAccepted = acceptedProducts.some(
                (accepted) => accepted.id === item.id
            );
        } else if (orderStatus === PRE_ORDER_STATUS.accepted || orderStatus === PRE_ORDER_STATUS.partialyAccepted) {
            isAccepted = item.accepted;
        }

        if (isAccepted) {
            const product = item.product;
            const itemTotal = item.quantity * +product?.price || 0; // Ensure price is treated as a number
            return acc + itemTotal;
        }

        return acc; // Skip non-accepted products
    }, 0); // Initial accumulator value is 0

    // Format the total to Argentinian Pesos
    const formattedTotal = total && formatToArgentinianPesos(total);

    return (
        <div className={cn('w-[calc(100%-32px)] h-full overflow-y-auto m-auto rounded shadow-sm', {
            'h-fit': data && data?.length < 8
        })}>
            <Table>
                <TableHeader className='sticky top-0 shadow-sm'>
                    <TableRow className="bg-white hover:bg-white [&>th]:text-secondary/90 [&>th]:font-thin">
                        <TableHead>Producto</TableHead>
                        <TableHead >Unidad de Medida</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unitario</TableHead>
                        <TableHead className={cn({ 'text-right pr-14': !isProvider })}>Precio Total</TableHead>

                        {isProvider &&
                            <TableHead className='text-right w-72'>
                                {orderStatus === PRE_ORDER_STATUS.pending &&
                                    <div
                                        className='m-0 h-8 space-x-2 flex justify-end mr-20 items-center cursor-pointer'
                                        onClick={toggleAllProducts}
                                    >
                                        <Label className='text-sm font-thin cursor-pointer'>{
                                            acceptedProducts.length !== data?.length ? 'Seleccionar todos' : 'Deseleccionar todos'}</Label>
                                        <Checkbox
                                            checked={false || acceptedProducts.length === data?.length}
                                            disabled={
                                                orderStatus !== PRE_ORDER_STATUS.pending && acceptedProducts.length === data?.length}
                                        />
                                    </div >
                                }
                            </TableHead>}
                    </TableRow>
                </TableHeader>
                {isLoading ?
                    <TableBody className="bg-white hover:bg-white">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={7} className="h-0 p-2 border-none hover:none ">
                                    <Skeleton key={index} className="h-14 w-full opacity-10 bg-muted/30 rounded-sm" />
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
                                        <TableRow key={item.product.id} className="hover:bg-white first:border-t-none">
                                            <TableCell>
                                                <div> {product?.name}</div>
                                                <div className='text-muted font-thin'>{product?.brand}</div>
                                            </TableCell>
                                            <TableCell>{product?.net_content}{product?.measurementUnit}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{formatToArgentinianPesos(+product?.price)}</TableCell>
                                            <TableCell className={cn({ 'text-right pr-14': !isProvider })}>{formatToArgentinianPesos(item.quantity * +product?.price)}</TableCell>

                                            {isProvider &&
                                                <TableCell className='text-right w-72'>
                                                    <div className='flex justify-end mr-20'>
                                                        {orderStatus === PRE_ORDER_STATUS.pending
                                                            ? <Checkbox
                                                                disabled={
                                                                    orderStatus !== PRE_ORDER_STATUS.pending && !product.accepted}
                                                                checked={
                                                                    orderStatus === PRE_ORDER_STATUS.pending
                                                                        ? !!(acceptedProducts || []).find((p) => p.id === item.id)
                                                                        : product.accepted
                                                                }
                                                                onClick={() => {
                                                                    onSelect({
                                                                        id: item.id,
                                                                        quantity: item.quantity,
                                                                        providerId: providerId || '',
                                                                    })
                                                                }} />
                                                            : (
                                                                item.accepted
                                                                    ? <Label className='text-sm font-thin text-primary'>Aceptado</Label>
                                                                    : <Label className='text-sm font-thin text-destructive'>Rechazado</Label>
                                                            )
                                                        }
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
                                <TableCell colSpan={4} className="h-[1px] p-1 pl-10 py-4">TOTAL</TableCell>
                                <TableCell colSpan={2} className={cn("h-[2px] p-2 pl-4 font-bold", {
                                    'text-right pr-14': !isProvider
                                })}>
                                    {orderStatus === PRE_ORDER_STATUS.pending ||
                                        orderStatus === PRE_ORDER_STATUS.partialyAccepted ||
                                        orderStatus === PRE_ORDER_STATUS.accepted
                                        ?
                                        formattedTotal
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                }
            </Table>
        </div >

    )
}