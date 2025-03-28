import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UseSse } from '@/hooks/useSse';
import { SERVER_SENT_EVENTS } from '@/lib/constants';
import { getSellPreOrders } from '@/lib/orders';
import { ORDERS_EVENTS_PROVIDER } from '@/lib/orders/endpoints';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import UseCompanyStore from '@/store/company.store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import noOrders from '@/assets/sin-pedidos.png'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/sells')({
  component: () => <Sells />
})

export default function Sells() {
  const { company } = UseCompanyStore();
  const companyId = company?.id;
  const { data: buyOrderStream } = UseSse(`${ORDERS_EVENTS_PROVIDER}${companyId}`);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['providerPreOrders', company?.id],
    queryFn: ({ queryKey }) => {
      const companyId = queryKey[1];
      if (!companyId) {
        // Return a rejected promise if companyId is undefined
        return Promise.reject(new Error('Company ID is undefined'));
      }
      return getSellPreOrders(companyId);
    },
    enabled: !!company?.id, // Ensure the query runs only if company ID exists
  });

  useEffect(() => {
    if (buyOrderStream?.message === SERVER_SENT_EVENTS.preOrderCreated) {
      refetch();
    }
  }, [buyOrderStream, refetch]);

  if (isError) {
    return (
      <>
        <p>Algo salio mal vuelve a intentarlo</p>
        <Button onClick={() => refetch()}>Volver a intentat</Button>
      </>
    )
  }

  return (
    <div className='w-full h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-2 relative'>
      <>
        <div className='w-full p-10 h-full flex flex-col'>

          <div className='w-full h-full overflow-y-auto'>
            <Table>
              <TableHeader className="bg-white sticky top-0 shadow-sm">
                <TableRow className="hover:bg-white">
                  <TableHead className='w-[115px]'>Nº de Orden</TableHead>
                  <TableHead className={`w-[230px] text-center `}>Fecha</TableHead>
                  <TableHead className={`w-[95px] text-center `}>Intento</TableHead>
                  <TableHead className={`w-[300px] text-center `}>Estado</TableHead>
                  <TableHead className={`w-[150px] text-center`}></TableHead>
                  <TableHead className={`w-[15%] text-right pr-12`}>Orden de Compra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {isLoading
                  ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index} className="hover:bg-transparent border-none">
                        <TableCell colSpan={6} className="h-0 p-2 border-none hover:none ">
                          <Skeleton key={index} className="h-14 w-full opacity-10 bg-muted/30 rounded-sm" />
                        </TableCell>
                      </TableRow>
                    ))
                  )
                  :
                  (data || []).map((order: PreOrderSchemaType) => (
                    <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                      <TableCell className='w-[120px] pl-10'>{order.preOrderNumber}</TableCell>
                      <TableCell className={`w-[250px] text-center `}>{formatDate(order.created)}</TableCell>
                      <TableCell className={`w-[100px] text-center `}>{order.instance}</TableCell>
                      <TableCell className={`w-[300px] text-center bg-border/20 px-0`}>
                        <div className='w-full flex justify-center'>
                          <StatusBadge status={order.status} />
                        </div>
                      </TableCell>
                      <TableCell className={`w-[150px]`}>
                        <Link to='/provider/sellDetail' search={{ orderId: order.id }}>
                          <Button variant='ghost'>
                            <Eye className='cursor-pointer' size={20} />
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className={`w-[200px] text-center`}>-</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {
            data?.length === 0 && (
              <div className='w-full h-full flex justify-center items-center absolute top-0 left-0 right-0 bottom-0'>
                <div className='py-10 px-20 shadow rounded flex flex-col justify-center items-center gap-2'>
                  <img src={noOrders} alt="no tienes ordenes" />
                  <div>
                    <p className='text-center text-2xl font-thin text-secondary/60'>No tienes Pedios!</p>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </>
    </div>
  )
}