import BackLink from '@/components/backLink';
import BuyOrderForm from '@/components/orders/buyOrderForm';
import { getOrderById } from '@/lib/orders';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';
import LoadingIndicator from '@/components/loadingIndicator';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/buyOrder/$orderId')({
  component: () => <OdcDetail />
})

export default function OdcDetail() {
  const { orderId } = useParams({ from: '/_authenticated/_dashboardLayout/buyOrder/$orderId' });
  const [fileDowloadLoading, setFileDowloadLoading] = useState(false);
  const [filePrintLoading, setFilePrintLoading] = useState(false);

  const { data: order, isLoading } = useQuery({
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

  const buyOrderFormRef = useRef<{ exportClick: () => void, printClick: () => void } | null>(null);

  const handlePrint = () => {
    if (buyOrderFormRef.current) {
      setFilePrintLoading(true);
      buyOrderFormRef.current.printClick();
    }
  }

  const handleExport = () => {
    if (buyOrderFormRef.current) {
      setFileDowloadLoading(true);
      buyOrderFormRef.current.exportClick();
    }
  };

  const smallLoading = <LoadingIndicator className='size-4 border-[2px]' />;

  return (
    <div className='relative h-full w-full pt-[80px]'>
      <div className='p-4 shadow absolute top-0 left-0 right-0 h-[80px] z-50'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2 pb-1'>
            <BackLink />
            <div className='h-5 w-1 border-l-2 border-secondary/50 mr-2'></div>
            <div className='flex justify-between items-center text-sm font-thin border-border border rounded pl-2'>
              <p>Numero de Orden</p>
              <span className='font-semibold bg-muted/20 px-2 py-1 rounded-r ml-2'>
                {isLoading ? smallLoading : order?.orderNumber}
              </span>
            </div>
          </div>
          <div className='font-thin text-secondary/80 mr-4 mt-2'>{isLoading ? <Skeleton className='w-48 h-8 bg-muted/50' /> : order?.created && formatDate(order?.created)}</div>
        </div>
      </div>
      <div className='h-[calc(100vh-310px)] w-full overflow-auto'>
        {isLoading
          ? <div className='w-full h-full flex justify-center items-center'><LoadingIndicator /></div>
          : <BuyOrderForm
            ref={buyOrderFormRef}
            provider={order?.provider}
            client={order?.client}
            orderNumber={order?.orderNumber || 0}
            date={order?.created && formatDate(order?.created, true) || ""}
            products={order?.products}
            fileDownloadComplete={() => setFileDowloadLoading(false)}
            filePrintComplete={() => setFilePrintLoading(false)}
          />
        }
      </div>
      <div className='absolute bottom-0 h-20 w-full bg-white border-t flex justify-end items-center pr-20 shadow shadow-[0_-10px_3px_0x_rgba(0,0,0,1)]"'>
        <div className='fit space-x-3'>
          <Button
            variant='outline'
            className='w-26 px-5'
            onClick={handleExport}>
            <p className='mr-2 font-bold '>Descargar Orden</p>
            {fileDowloadLoading
              ? <LoadingIndicator />
              : <FileDown />
            }
          </Button>
          <Button
            variant='outline'
            className='w-26 px-5'
            onClick={handlePrint}>
            <p className='mr-2 font-bold '>Imprimir Orden</p>
            {filePrintLoading
              ? <LoadingIndicator />
              : <Printer />
            }
          </Button>
        </div>


      </div>
    </div>
  )
}
