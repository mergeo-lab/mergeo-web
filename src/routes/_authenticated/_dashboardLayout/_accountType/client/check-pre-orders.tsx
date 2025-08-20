import { getAllClientPreOrders, checkPreOrders } from '@/lib/orders'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export const Route = createFileRoute(
    '/_authenticated/_dashboardLayout/_accountType/client/check-pre-orders',
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { account } = useAuth();
    const buyerId = account?.user?.id || '';
    const [selectedPreOrderId, setSelectedPreOrderId] = useState<string | null>(null);

    const { data: _preOrders } = useQuery({
        queryKey: ['check-pre-orders', buyerId],
        queryFn: () => getAllClientPreOrders(buyerId),
        enabled: !!buyerId,
    })

    const checkPreOrdersMutation = useMutation({
        mutationFn: (preOrderId: string) => checkPreOrders(preOrderId),
        onSuccess: (data) => {
            console.log('Check pre-orders result:', data);
            console.log('Provider pre-orders:', data.providerPreOrders);
            if (data.providerPreOrders) {
                data.providerPreOrders.forEach((providerOrder: any, index: number) => {
                    console.log(`Provider ${index}:`, providerOrder);
                    console.log(`Provider ${index} preOrderProducts:`, providerOrder.preOrderProducts);
                });
            }
        },
        onError: (error) => {
            console.error('Error checking pre-orders:', error);
        }
    });

    const handlePreOrderClick = (preOrderId: string) => {
        setSelectedPreOrderId(preOrderId);
        checkPreOrdersMutation.mutate(preOrderId);
    };

    return (
        <div>
            <h1>Check Pre Orders</h1>

            <div className='flex flex-col gap-4'>
                {_preOrders?.entities.map((preOrder: any) => (
                    <div
                        className='flex flex-col gap-2 bg-gray-200 p-4 transition-colors'
                        key={preOrder.id}>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <p className='text-sm text-gray-600'>ID de Pre-Orden:</p>
                                <p className='font-medium'>{preOrder.id}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600'>Numero de Pre-Orden:</p>
                                <p className='font-medium'>{preOrder.clientPreOrderNumber}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600'>Estado:</p>
                                <p className='font-medium'>{preOrder.status}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600'>Sucursal:</p>
                                <p className='font-medium'>{preOrder.branchName}</p>
                            </div>
                        </div>

                        {/* Botón Ver más / Ocultar */}
                        <div className='flex justify-end mt-2'>
                            {selectedPreOrderId === preOrder.id ? (
                                <button
                                    onClick={() => setSelectedPreOrderId(null)}
                                    className='px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
                                >
                                    Ocultar detalles
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePreOrderClick(preOrder.id)}
                                    className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                                >
                                    Ver más
                                </button>
                            )}
                        </div>

                        {selectedPreOrderId === preOrder.id && checkPreOrdersMutation.isPending && (
                            <p className='text-blue-600'>Verificando...</p>
                        )}
                        {selectedPreOrderId === preOrder.id && checkPreOrdersMutation.data && (
                            <div className='mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm'>
                                <h3 className='font-bold text-lg text-gray-800 mb-3'>Resultados de verificación</h3>

                                {/* Información general de la orden */}
                                <div className='mb-4 p-3 bg-blue-50 rounded-md'>
                                    <h4 className='font-semibold text-blue-800 mb-2'>Información General</h4>
                                    <div className='grid grid-cols-2 gap-2 text-sm'>
                                        <div><span className='font-medium'>ID de Orden:</span> {checkPreOrdersMutation.data.id || 'N/A'}</div>
                                        <div><span className='font-medium'>Estado:</span> {checkPreOrdersMutation.data.status || 'N/A'}</div>
                                        <div><span className='font-medium'>Número de Orden:</span> {checkPreOrdersMutation.data.clientPreOrderNumber || 'N/A'}</div>
                                        <div><span className='font-medium'>Fecha de Creación:</span> {checkPreOrdersMutation.data.createdAt ? new Date(checkPreOrdersMutation.data.createdAt).toLocaleDateString() : 'N/A'}</div>
                                        <div><span className='font-medium'>Fecha de Actualización:</span> {checkPreOrdersMutation.data.updatedAt ? new Date(checkPreOrdersMutation.data.updatedAt).toLocaleDateString() : 'N/A'}</div>
                                        <div><span className='font-medium'>Total de Productos:</span> {checkPreOrdersMutation.data.totalProducts || 'N/A'}</div>
                                    </div>
                                </div>

                                {/* Detalles de búsqueda */}
                                {checkPreOrdersMutation.data.searchParams && (
                                    <div className='mb-4 p-3 bg-green-50 rounded-md'>
                                        <h4 className='font-semibold text-green-800 mb-2'>Parámetros de Búsqueda</h4>
                                        <div className='grid grid-cols-2 gap-2 text-sm'>
                                            <div><span className='font-medium'>Sucursal ID:</span> {checkPreOrdersMutation.data.searchParams.branchId || 'N/A'}</div>
                                            <div><span className='font-medium'>Tipo de Entrega:</span> {checkPreOrdersMutation.data.searchParams.isPickUp ? 'Pickup' : 'Delivery'}</div>
                                            <div><span className='font-medium'>Fecha Inicio:</span> {checkPreOrdersMutation.data.searchParams.expectedDeliveryStartDay || 'N/A'}</div>
                                            <div><span className='font-medium'>Fecha Fin:</span> {checkPreOrdersMutation.data.searchParams.expectedDeliveryEndDay || 'N/A'}</div>
                                            <div><span className='font-medium'>Hora Inicio:</span> {checkPreOrdersMutation.data.searchParams.startHour || 'N/A'}</div>
                                            <div><span className='font-medium'>Hora Fin:</span> {checkPreOrdersMutation.data.searchParams.endHour || 'N/A'}</div>
                                            {checkPreOrdersMutation.data.searchParams.pickUpLat && (
                                                <div><span className='font-medium'>Latitud:</span> {checkPreOrdersMutation.data.searchParams.pickUpLat}</div>
                                            )}
                                            {checkPreOrdersMutation.data.searchParams.pickUpLng && (
                                                <div><span className='font-medium'>Longitud:</span> {checkPreOrdersMutation.data.searchParams.pickUpLng}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Productos del carrito */}
                                {checkPreOrdersMutation.data.cartProducts && checkPreOrdersMutation.data.cartProducts.length > 0 && (
                                    <div className='mb-4 p-3 bg-yellow-50 rounded-md'>
                                        <h4 className='font-semibold text-yellow-800 mb-2'>Productos del Carrito</h4>
                                        <div className='space-y-2'>
                                            {checkPreOrdersMutation.data.cartProducts.map((product: any, index: number) => (
                                                <div key={index} className='flex justify-between items-center bg-white p-2 rounded border'>
                                                    <div className='flex-1'>
                                                        <div className='font-medium text-gray-800'>{product.name || product.productName || 'Producto sin nombre'}</div>
                                                        <div className='text-xs text-gray-500'>ID: {product.id} | Proveedor: {product.providerId}</div>
                                                    </div>
                                                    <div className='text-right'>
                                                        <div className='font-medium'>Cantidad: {product.quantity || 0}</div>
                                                        <div className='text-sm text-gray-600'>${product.price || 0}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Productos y Estados */}
                                {checkPreOrdersMutation.data.providerPreOrders && checkPreOrdersMutation.data.providerPreOrders.length > 0 && (
                                    <div className='mb-4'>
                                        <h4 className='font-semibold text-gray-700 mb-3'>Productos y Estados por Proveedor</h4>
                                        <div className='space-y-4'>
                                            {checkPreOrdersMutation.data.providerPreOrders
                                                .sort((a: any, b: any) => {
                                                    // Ordenar por instancia (la más grande arriba)
                                                    const instanceA = a.instance || 0;
                                                    const instanceB = b.instance || 0;
                                                    return instanceB - instanceA;
                                                })
                                                .map((providerOrder: any, index: number) => (
                                                    <div key={index} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
                                                        {/* Header del proveedor */}
                                                        <div className='mb-3 pb-2 border-b border-gray-100'>
                                                            <div className='flex justify-between items-start mb-2'>
                                                                <div className='flex-1'>
                                                                    <div className='text-lg font-semibold text-gray-800'>{providerOrder.provider?.name || 'Sin nombre'}</div>
                                                                    <div className='text-sm text-gray-600 mt-1'>ID: {providerOrder.provider?.id || providerOrder.providerId}</div>
                                                                    <div className='text-sm text-gray-500 mt-1'>Orden: {providerOrder.id}</div>
                                                                    <div className='text-sm text-gray-500 mt-1'> {providerOrder.timeRemaining}</div>
                                                                </div>
                                                                <div className='text-right'>
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${providerOrder.status === 'ACCEPTED' ? 'bg-green-500 text-white' :
                                                                        providerOrder.status === 'REJECTED' ? 'bg-red-500 text-white' :
                                                                            providerOrder.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                                                                                providerOrder.status === 'TIMEOUT' ? 'bg-orange-500 text-white' :
                                                                                    'bg-gray-500 text-white'
                                                                        }`}>
                                                                        {providerOrder.status === 'ACCEPTED' ? '✓ ACEPTADO' :
                                                                            providerOrder.status === 'REJECTED' ? '✗ RECHAZADO' :
                                                                                providerOrder.status === 'PENDING' ? '⏳ PENDIENTE' :
                                                                                    providerOrder.status === 'TIMEOUT' ? '⏰ TIMEOUT' :
                                                                                        providerOrder.status}
                                                                    </span>
                                                                    <div className='text-sm text-blue-600 font-medium mt-2'>Instancia: {providerOrder.instance}</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Lista de productos */}
                                                        <div className='mt-3'>
                                                            <h6 className='text-sm font-medium text-gray-600 mb-2'>Productos:</h6>
                                                            {providerOrder.preOrderProducts && providerOrder.preOrderProducts.length > 0 ? (
                                                                <div className='space-y-2'>
                                                                    {providerOrder.preOrderProducts.map((product: any, productIndex: number) => (
                                                                        <div key={productIndex} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border'>
                                                                            <div className='flex-1'>
                                                                                <div className='font-medium text-gray-800'>
                                                                                    {product.name || product.productName || 'Producto sin nombre'}
                                                                                </div>
                                                                                <div className='text-sm text-gray-500'>
                                                                                    ID: {product.id} | Cantidad: {product.quantity} | ${product.price}
                                                                                </div>
                                                                            </div>
                                                                            <div className='ml-4'>
                                                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.accepted === true ? 'bg-green-500 text-white' :
                                                                                    (providerOrder.instance <= 3 && product.accepted === false) ? 'bg-yellow-500 text-white' :
                                                                                        product.accepted === false ? 'bg-red-500 text-white' :
                                                                                            'bg-gray-500 text-white'
                                                                                    }`}>
                                                                                    {product.accepted === true ? '✓ ACEPTADO' :
                                                                                        (providerOrder.instance <= 3 && product.accepted === false) ? '⏳ PENDIENTE' :
                                                                                            product.accepted === false ? '✗ RECHAZADO' :
                                                                                                'SIN ESTADO'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className='p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
                                                                    <p className='text-sm text-yellow-700'>No hay productos disponibles para este proveedor</p>
                                                                    <p className='text-xs text-yellow-600 mt-1'>Debug: {JSON.stringify(providerOrder.preOrderProducts)}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Criterios de reemplazo */}
                                {checkPreOrdersMutation.data.replacementCriteria && (
                                    <div className='mb-4 p-3 bg-purple-50 rounded-md'>
                                        <h4 className='font-semibold text-purple-800 mb-2'>Criterios de Reemplazo</h4>
                                        <pre className='text-sm text-purple-700 bg-white p-2 rounded border overflow-x-auto'>
                                            {JSON.stringify(checkPreOrdersMutation.data.replacementCriteria, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                {/* Mensaje */}
                                {checkPreOrdersMutation.data.message && (
                                    <div className='mt-3 p-2 bg-blue-50 rounded'>
                                        <p className='text-sm text-blue-700'>{checkPreOrdersMutation.data.message}</p>
                                    </div>
                                )}


                            </div>
                        )}
                        {selectedPreOrderId === preOrder.id && checkPreOrdersMutation.error && (
                            <div className='mt-2 p-2 bg-red-100 rounded'>
                                <p className='text-red-600'>Error: {checkPreOrdersMutation.error.message}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
