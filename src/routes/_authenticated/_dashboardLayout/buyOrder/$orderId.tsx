import BackLink from '@/components/backLink';
import BuyOrderForm from '@/components/orders/buyOrderForm';
import { getOrderById } from '@/lib/orders';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/buyOrder/$orderId')({
  component: () => <OdcDetail />
})

export default function OdcDetail() {
  const { orderId } = useParams({ from: '/_authenticated/_dashboardLayout/buyOrder/$orderId' });

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: ({ queryKey }) => {
      const orderId = queryKey[1];
      if (!orderId) {
        // Return a rejected promise if companyId is undefined
        return Promise.reject(new Error('Order ID is undefined'));
      }
      return getOrderById(orderId);
    },
    enabled: !!orderId, // Ensure the query runs only if company ID exists
  });

  const buyOrderFormRef = useRef<{ convertToJpeg: () => void } | null>(null);

  const handleExport = () => {
    if (buyOrderFormRef.current) {
      buyOrderFormRef.current.convertToJpeg();
    }
  };

  return (
    <div className='relative pt-[80px]'>
      <div className='p-4 shadow absolute top-0 left-0 right-0 h-[80px]'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2 pb-1'>
            <BackLink />
            <div className='h-5 w-1 border-l-2 border-secondary/50 mr-2'></div>
            <div className='flex justify-between items-center text-sm font-thin border-border border rounded pl-2'>
              <p>Numero de Orden</p>
              <span className='font-semibold bg-muted/20 px-2 py-1 rounded-r ml-2'>{order?.orderNumber}</span>
            </div>
            <div>
              <Button onClick={handleExport}>Exportar</Button>
            </div>
          </div>
          <div className='font-thin text-secondary/80 mr-4 mt-2'>{order?.created && formatDate(order?.created)}</div>
        </div>
      </div>
      <div className='h-[calc(100vh-250px)] overflow-y-auto'>
        <BuyOrderForm
          ref={buyOrderFormRef}
          provider={order?.provider}
          client={order?.client}
          orderNumber={order?.orderNumber || 0}
          date={order?.created && formatDate(order?.created, true) || ""}
          products={order?.products}
        />
      </div>
    </div>
  )
}