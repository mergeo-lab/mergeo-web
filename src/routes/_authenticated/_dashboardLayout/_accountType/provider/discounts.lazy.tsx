import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import UseCompanyStore from '@/store/company.store';


import { CgPlayListAdd } from "react-icons/cg";
import { MdOutlineDiscount } from "react-icons/md";
import NewDiscount from '@/components/configuration/provider/discounts/newDiscount';
import { getAllDiscountList } from '@/lib/discounts';
import { useQuery } from '@tanstack/react-query';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';
import { CreateDiscountSchemaType } from '@/lib/schemas/discounts.schema';
import DiscountListItem from '@/components/configuration/provider/discounts/discountListItem';
import { useState } from 'react';
import DiscountTabs from '@/components/configuration/provider/discounts/discountTabs';

export const Route = createLazyFileRoute(
    '/_authenticated/_dashboardLayout/_accountType/provider/discounts',
)({
    component: Discounts,
})

const createListButton = (
    <Button className='mt-5 w-60 flex items-center gap-2'>
        <CgPlayListAdd size={22} className='-ml-2' />
        Crear lista
    </Button>
)

export function Discounts() {
    const { getCompanyId } = UseCompanyStore();
    const companyId = getCompanyId();
    const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null)


    const { data: lists, isLoading: searchListsLoading, isError, refetch } = useQuery({
        queryKey: ['discountLists', companyId],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getAllDiscountList(companyId);
        },
        enabled: !!companyId, // Ensure the query runs only if company ID exists
    });

    if (isError) return <div>Error</div>
    if (searchListsLoading) return (
        <div className='h-full w-full relative '>
            <OverlayLoadingIndicator label='Buscando Listas' />
        </div>
    )
    if (lists.length === 0) {
        return (
            <div className='h-full w-full relative'>
                <div className='absolute w-full h-full flex justify-center items-center'>
                    <MdOutlineDiscount className='absolute text-muted/10' size={500} />
                </div>

                <div className='absolute w-full h-full flex flex-col justify-center items-center z-10'>
                    <p className='text-center text-md'>
                        No tienes nunguna lista de descuentos!<br />
                    </p>
                    <p className='text-center font-light'>
                        Crea tus listas para hacer descuentos a clientes especificos.
                    </p>
                    <NewDiscount
                        callback={refetch}
                        triggerButton={<div className='mt-10'>{createListButton}</div>}
                    />
                </div>
            </div>

        )
    } else {
        return (
            <div className='flex h-full'>
                <div className='w-[30rem] relative bg-white shadow pb-2 flex flex-col items-center z-30'>
                    <div className='w-full shadow flex justify-center items-center py-4 mb-2'>
                        <h3 className='text-bold text-[1.2rem]'>Listas de descuentos</h3>
                    </div>
                    <div className='w-full h-[80%] overflow-y-auto'>
                        {lists && lists.map((list: CreateDiscountSchemaType) => (
                            <DiscountListItem
                                onClick={(id: string) => setSelectedDiscount(id)}
                                selectedItem={selectedDiscount === list.id}
                                key={list.id}
                                data={list}>
                            </DiscountListItem>
                        ))}
                    </div>
                    <NewDiscount
                        callback={refetch}
                        triggerButton={
                            <div className='w-full flex justify-center items-center gap-4 bg-white'>
                                {createListButton}
                            </div>
                        }
                    />
                </div>
                <div className='w-full flex h-full bg-white'>
                    <div className='h-full w-3/4 py-5 px-10 z-20 shadow'>
                        <DiscountTabs selectedDiscountId={selectedDiscount} companyId={companyId} />
                    </div>
                    <div className='h-full w-1/4 py-5 px-10 z-10'>
                        Aca van los clientes
                    </div>
                </div>
            </div>
        )
    }
}
