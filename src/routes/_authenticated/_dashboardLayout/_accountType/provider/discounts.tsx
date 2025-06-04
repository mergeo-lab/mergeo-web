import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import UseCompanyStore from '@/store/company.store';


import { CgPlayListAdd } from "react-icons/cg";
import { MdOutlineDiscount } from "react-icons/md";
import NewDiscount from '@/components/configuration/provider/discounts/newDiscount';
import { getAllDiscountList } from '@/lib/discounts';
import { useQuery } from '@tanstack/react-query';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';
import { DiscountSchemaType } from '@/lib/schemas/discounts.schema';
import DiscountListItem from '@/components/configuration/provider/discounts/discountListItem';
import { useEffect, useState } from 'react';
import DiscountTabs from '@/components/configuration/provider/discounts/discountTabs';
import { GoPencil } from 'react-icons/go';
import ClientCuitList from '@/components/configuration/provider/discounts/clientsCuitList';
import { MdAddBusiness } from "react-icons/md";

export const Route = createFileRoute(
    '/_authenticated/_dashboardLayout/_accountType/provider/discounts',
)({
    component: Discounts,
})

export function Discounts() {
    const { getCompanyId } = UseCompanyStore();
    const companyId = getCompanyId();
    const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null)
    const [showNewDiscountModal, setShowNewDiscountModal] = useState({ open: false, isEdit: false });
    const [prevListLength, setPrevListLength] = useState(0);

    const { data: lists, isLoading: searchListsLoading, isError, refetch } = useQuery({
        queryKey: ['discount-lists', companyId],
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

    function handleCreateDiscountList() {
        console.log('handleCreateDiscountList');
        setSelectedDiscount(null);
        setShowNewDiscountModal({ open: true, isEdit: false })
    }

    useEffect(() => {
        if (!selectedDiscount && lists && lists.length > 0) {
            setSelectedDiscount(lists[0].id);
        }
        if (lists && lists.length > prevListLength) {
            setSelectedDiscount(lists[0].id);
        }
        setPrevListLength(lists ? lists.length : 0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lists, selectedDiscount]);

    if (isError) return <div>Error</div>
    if (searchListsLoading) return (
        <div className='h-full w-full relative '>
            <OverlayLoadingIndicator label='Buscando Listas' />
        </div>
    )
    if (lists.length === 0) {
        return (
            <>
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
                        <Button className='mt-5 w-60 flex items-center gap-2 '
                            onClick={handleCreateDiscountList}
                        >
                            <CgPlayListAdd size={22} className='-ml-2' />
                            Crear lista
                        </Button>
                    </div>
                </div>
                <NewDiscount
                    itemId={selectedDiscount ? selectedDiscount : null}
                    isEdit={showNewDiscountModal.isEdit}
                    openit={showNewDiscountModal.open}
                    callback={refetch}
                    onClose={() => setShowNewDiscountModal({ open: false, isEdit: false })}
                    data={selectedDiscount ? lists.find((item: DiscountSchemaType) => item.id === selectedDiscount) : null}
                />
            </>
        )
    } else {
        return (
            <>
                <div className='flex h-full'>
                    <div className='w-[25rem] max-w-[25rem] relative bg-white shadow pb-2 flex flex-col items-center z-30'>
                        <div className='w-full shadow flex justify-center items-center py-4 mb-2'>
                            <h3 className='text-bold text-[1.2rem]'>Listas de descuentos</h3>
                        </div>
                        <div className='w-full h-[80%] overflow-y-auto'>
                            {lists && lists.map((list: DiscountSchemaType) => (
                                <DiscountListItem
                                    onClick={(id: string) => setSelectedDiscount(id)}
                                    selectedItem={selectedDiscount === list.id}
                                    key={list.id}
                                    data={list}
                                >
                                    <Button
                                        type='button'
                                        variant="ghost"
                                        className="h-8 w-8! flex justify-center items-center hover:bg-white"
                                        onClick={() => setShowNewDiscountModal({ open: true, isEdit: true })}
                                    >
                                        <GoPencil size={16} />
                                    </Button>

                                </DiscountListItem>
                            ))}
                        </div>
                        <div className='w-full flex justify-center items-center gap-4 bg-white'>
                            <Button className='mt-5 w-60 flex items-center gap-2'
                                onClick={handleCreateDiscountList}
                            >
                                <CgPlayListAdd size={22} className='-ml-2' />
                                Crear lista
                            </Button>
                        </div>
                    </div>
                    <div className='w-full flex h-full bg-white'>
                        <div className='h-full w-3/4 py-5 z-20 shadow'>
                            <DiscountTabs
                                selectedDiscountId={selectedDiscount}
                                companyId={companyId}
                                discount={selectedDiscount ? lists.find((item: DiscountSchemaType) => item.id === selectedDiscount)?.discount : 0}
                            />
                        </div>
                        <div className='h-full w-2/6 z-10 relative'>
                            <div className='w-full border-b-[1px] border-border flex justify-center items-center py-4 mb-2'>
                                <h3 className='text-bold text-[1.2rem]'>Clientes</h3>
                            </div>
                            <div className='px-5'>
                                {selectedDiscount &&
                                    <ClientCuitList companies={lists.find((item: DiscountSchemaType) => item.id === selectedDiscount)?.companies} />
                                }
                            </div>
                            <div className='absolute bottom-10 w-full flex justify-center'>
                                <Button
                                    variant="outline"
                                    disabled={!selectedDiscount}
                                    onClick={() => setShowNewDiscountModal({ open: true, isEdit: true })}
                                    className='space-x-2'
                                >
                                    <MdAddBusiness size={24} />
                                    <span>Agregar o sacar cliente</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <NewDiscount
                    itemId={selectedDiscount ? selectedDiscount : null}
                    isEdit={showNewDiscountModal.isEdit}
                    openit={showNewDiscountModal.open}
                    callback={refetch}
                    onClose={() => setShowNewDiscountModal({ open: false, isEdit: false })}
                    data={selectedDiscount ? lists.find((item: DiscountSchemaType) => item.id === selectedDiscount) : null}
                />
            </>
        )
    }
}
