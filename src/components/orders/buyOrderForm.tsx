import BuyOrderFormField from '@/components/orders/formField';
import { PreOrderProductSchemaType, ProviderType, ClientType } from '../../lib/schemas/configuration.schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatToArgentinianPesos } from '@/lib/utils';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { useReactToPrint } from "react-to-print";

type Props = {
    client: ClientType | undefined;
    provider: ProviderType | undefined;
    orderNumber: number;
    date: string;
    products: PreOrderProductSchemaType[] | undefined;
    fileDownloadComplete: () => void
    filePrintComplete: () => void
};

const BuyOrderForm = forwardRef(function BuyOrderForm(
    { client, provider, orderNumber, date, products, fileDownloadComplete, filePrintComplete }: Props,
    ref
) {
    const componentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLElement>;
    const reactToPrintFn = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `orden-de-compra-${orderNumber}`,
        onAfterPrint: filePrintComplete,
        pageStyle: 'transform: scale(.2);'
    });

    const totalPrice = products?.reduce((acc, item) => acc + (+item.product.price * item.quantity), 0);

    const printClick = useCallback(() => {
        reactToPrintFn();
    }, [reactToPrintFn]);

    const exportClick = useCallback(() => {
        if (componentRef.current === null) {
            return
        }

        toJpeg(componentRef.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `orden-de-compra-${orderNumber}.jpg`
                link.href = dataUrl
                link.click()
            }).finally(() => {
                fileDownloadComplete();
            })
            .catch((err) => {
                console.log(err)
            })
    }, [fileDownloadComplete, orderNumber])

    useImperativeHandle(ref, () => ({
        exportClick,
        printClick
    }));

    return (
        <div className='min-w-[1600px]' ref={componentRef as React.RefObject<HTMLDivElement>}>
            <div className='px-20 py-10 relative bg-white'>
                <div className=" [&>div]:px-28 border-2">
                    <div className="text-center mb-8 bg-border/30 py-6">
                        <h1 className="text-lg my-5 font-bold">ORDEN DE COMPRA</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-20 [&>div]:space-y-3">
                        <div className='col-start-1 col-end-3'>
                            <BuyOrderFormField
                                label="Nombre de la Empresa"
                                value={client?.name ?? ''}
                            />
                            <BuyOrderFormField
                                label="Razon social"
                                value={client?.razonSocial ?? ''}
                            />
                            <BuyOrderFormField
                                label="Dirección"
                                value={client?.address?.name ?? ''}
                            />
                        </div>
                        <div className='w-full bg-red-200s'>
                            <BuyOrderFormField
                                label="Fecha"
                                value={date}
                            />
                            <BuyOrderFormField
                                label="No. de orden"
                                value={orderNumber}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2  gap-x-20 [&>div]:space-y-3 bg-border/30 border-y border-border p-5 mt-5">
                        <div>
                            Vendedor
                        </div>
                        <div>
                            Enviar a
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 [&>div]:space-y-3 mt-2">
                        <div>
                            <BuyOrderFormField
                                label="Compañia"
                                value={provider?.name ?? ''}
                            />
                            <BuyOrderFormField
                                label="Vendedor"
                                value={provider?.user.firstName + ' ' + provider?.user.lastName}
                            />
                            <BuyOrderFormField
                                label="Dirección"
                                value={provider?.address?.name ?? ''}
                            />
                            <BuyOrderFormField
                                label="Telefono"
                                value={provider?.address?.phoneNumber ?? ''}
                            />
                        </div>
                        <div>
                            <BuyOrderFormField
                                label="Compañia"
                                value={client?.name ?? ''}
                            />
                            <BuyOrderFormField
                                label="Contacto"
                                value={client?.user?.firstName + ' ' + client?.user?.lastName || ''}
                            />
                            <BuyOrderFormField
                                label="Dirección"
                                value={client?.address?.name ?? ''}
                            />
                            <BuyOrderFormField
                                label="Telefono"
                                value={provider?.address?.phoneNumber ?? ''}
                            />
                        </div>
                    </div>

                    <div className="w-full mt-10">
                        <div className='w-full'>
                            <Table>
                                <TableHeader>
                                    <TableRow className='[&>th]:border [&>th]:border-border [&>th]:bg-border/30 hover:bg-white'>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Unidad</TableHead>
                                        <TableHead>Unidad de Medida</TableHead>
                                        <TableHead>Precio Unitario</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead className='text-center'>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products && products.map((item, index) => (
                                        <TableRow key={index} className='[&>td]:border [&>td]:border-border hover:bg-white'>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell>{item.product.units}</TableCell>
                                            <TableCell>{item.product.measurementUnit}</TableCell>
                                            <TableCell>{formatToArgentinianPesos(+item.product.price)}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell className='text-center'>{formatToArgentinianPesos(+item.product.price * item.quantity)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className='[&>td]:border-y [&>td]:border-border hover:bg-white [&>td]:bg-border/30 [&>td]:font-bold'>
                                        <TableCell className='text-center border-l'>SUBTOTAL</TableCell>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell className='text-center border-r'>{totalPrice && formatToArgentinianPesos(totalPrice)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div className='w-full flex justify-end my-14'>
                            <div className='w-1/4 flex justify-center items-center gap-8'>
                                <p>Firma</p>
                                <div className='border-border border-b h-10 w-full'></div>
                            </div>
                        </div>
                    </div >
                </div >
            </div>
        </div>
    );
});

export default BuyOrderForm;
