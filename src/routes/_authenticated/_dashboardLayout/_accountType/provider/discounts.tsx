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
import { BiSolidUpArrow } from "react-icons/bi";
import { cn } from '@/lib/utils';

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
    const [showClients, setShowClients] = useState(false);

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
                <div className='flex h-full w-full overflow-hidden'>
                    <div className='relative bg-white shadow pb-2 flex flex-col items-center z-30'>
                        <div className='w-full shadow flex justify-center items-center py-4 mb-2'>
                            <h3 className='text-bold text-nowrap px-4 text-[1.2rem]'>Listas de descuentos</h3>
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
                                        className="h-6 w-6! px-2 mr-2 flex justify-center items-center hover:bg-white"
                                        onClick={() => setShowNewDiscountModal({ open: true, isEdit: true })}
                                    >
                                        <GoPencil size={16} />
                                    </Button>

                                </DiscountListItem>
                            ))}
                        </div>
                        <div className='w-full px-3 flex justify-center items-center bg-white'>
                            <Button className='mt-5 flex items-center gap-2 w-full'
                                onClick={handleCreateDiscountList}
                            >
                                <CgPlayListAdd size={22} className='-ml-2' />
                                Crear lista
                            </Button>
                        </div>
                    </div>
                    <div className='w-full m-auto flex h-full bg-white flex-col items-start justify-start overflow-y-hidden'>
                        {/* CLIENTES */}
                        <div className={cn('h-fit w-full z-10 transition-all duration-300')}>
                            <div className='w-full border-b-[1px] border-border flex justify-between items-center py-3 pl-6 mb-1'>
                                <h3 className='text-bold'>Clientes</h3>
                                <Button
                                    variant="link"
                                    disabled={!selectedDiscount}
                                    onClick={() => setShowNewDiscountModal({ open: true, isEdit: true })}
                                    className='space-x-2 h-5 text-primary'
                                >
                                    <MdAddBusiness size={24} />
                                    <span>Agregar o sacar cliente</span>
                                </Button>
                            </div>
                            <div className={cn('px-5 h-[40px] transition-all duration-300', {
                                'h-[400px] overflow-y-auto': showClients,
                            })}>
                                {selectedDiscount &&
                                    <ClientCuitList companies={lists.find((item: DiscountSchemaType) => item.id === selectedDiscount)?.companies} />
                                }
                            </div>
                        </div>
                        <div className='w-full h-[40px min-h-[40px] z-20 max-h-28 bg-gradient-to-t from-stone-900/30 from-0% flex justify-center items-end'>
                            <div className=''>
                                <Button
                                    variant='ghost'
                                    className='h-6 mt-2 bg-white hover:bg-white hover:text-primary w-16 rounded-b-none flex justify-center items-center'
                                    onClick={() => setShowClients(!showClients)}
                                >
                                    <BiSolidUpArrow size={15} className={cn('rotate-180 transition-all duration-300', {
                                        'rotate-0': showClients,
                                    })} />
                                </Button>
                            </div>
                        </div>
                        {/* PRODUCTOS */}
                        <div className={cn(' w-full py-3 z-20 relative')}>
                            {showClients &&
                                <div className='absolute inset-0 bg-white/30 backdrop-blur-[2px] h-full z-30 '></div>
                            }
                            <DiscountTabs
                                selectedDiscountId={selectedDiscount}
                                companyId={companyId}
                                discount={selectedDiscount ? lists.find((item: DiscountSchemaType) => item.id === selectedDiscount)?.discount : 0}
                            />
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
