import { AddSearchList } from '@/components/configuration/client/searchLists/addSearchList';
import SearchListButton from '@/components/configuration/client/searchLists/searchListButton';
import SearchProductsTable from '@/components/configuration/client/searchLists/searchProductsTable';
import { DeleteConfirmationDialog } from '@/components/deleteConfirmationDialog';
import { Button } from '@/components/ui/button'
import { deleteProduct, getSearchLists } from '@/lib/searchLists/searchLists';
import UseCompanyStore from '@/store/company.store';
import UseSearchListsStore from '@/store/searchLists.store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { CircleAlert, ListPlus, PackagePlus, Pencil, Search, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import { SearchListProductType } from '@/lib/searchLists/searchLists.schemas';
import OverlayLoadingIndicator from '@/components/ui/overlayLoadingIndicator';
import { Input } from '@/components/ui/input';
import { DropdownMenuCheckboxes } from '@/components/dropdownMenuCheckboxes';
import emptyBox from '../../../../../assets/emptyBox.svg';
import { useDebounceCallback } from 'usehooks-ts';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/searchLists')({
    component: () => <SearchLists />
})

export function SearchLists() {
    const { company } = UseCompanyStore();
    const { addMultipleLists, removeAllLists, getAllListsNames, getListById, searchProductById, selectedList, setSelectedList, getCategoriesFromSelectedList, categoriesFromList } = UseSearchListsStore();
    const [isLoading, setIsLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<SearchListProductType[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [deleteListProduct, setDeleteListProduct] = useState<{ data: SearchListProductType | null, isOpen: boolean }>({ data: null, isOpen: false });
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading: searchListsLoading, isError, refetch } = useQuery({
        queryKey: ['searchLists', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getSearchLists(companyId);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });
    const { lists } = UseSearchListsStore();

    useEffect(() => {
        if (data) {
            removeAllLists();
            addMultipleLists(data);
            const alreadySelected = data.find((list) => list.id === selectedList?.id);
            setSelectedList(alreadySelected || data[0]);
            getCategoriesFromSelectedList();
        }

        return () => {
            setSelectedList(null);
            setFilteredProducts([]);
            setSelectedCategories([]);
        }
    }, [data]);

    const debouncedFilter = useDebounceCallback((query) => {
        if (!selectedCategories) {
            setFilteredProducts(selectedList?.products || []);
            return; // Exit early if no categories are selected
        }

        if (selectedList) {
            const filtered = selectedList.products.filter(product => {
                const matchesCategory = product.category && selectedCategories.includes(product.category);
                const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
                return matchesCategory && matchesSearch;
            });
            setFilteredProducts(filtered);
        }
    }, 300); // Adjust debounce duration as needed

    useEffect(() => {
        debouncedFilter(searchQuery);
    }, [searchQuery, selectedList, selectedCategories, debouncedFilter]);

    function handleSelectedList(id: string) {
        if (!id) return;
        const selectedList = getListById(id);
        selectedList && setSelectedList(selectedList);
        getCategoriesFromSelectedList();
    }

    function handleRemoveProduct(id: string) {
        if (!id) return;
        const selectedProduct = searchProductById(id);
        if (selectedProduct) setDeleteListProduct({ data: selectedProduct, isOpen: true });
        getCategoriesFromSelectedList();
    }

    function deleteComplete() {
        setDeleteListProduct({ data: null, isOpen: false });
        setIsLoading(false);
        refetch();
    }

    function filterByCategory(category: string[]) {
        setSelectedCategories(category);
    }

    if (isError) return <div>Error</div>

    const noElements = (
        <div className='w-full h-2/3 flex flex-col justify-center items-center'>
            <p className='text-center'>
                No esperes mas!<br />
                Crea tus listas para hacer tus procesos mas ágiles
            </p>
            <AddSearchList
                callback={() => {
                    setIsLoading(false);
                    refetch()
                }}
                onLoading={() => setIsLoading(true)}
                triggerButton={
                    <Button className='mt-5 w-60 flex items-center gap-4'>
                        Crear lista
                        <ListPlus />
                    </Button>
                }
            />

            <div className='flex items-center w-2/5 gap-6 p-4 shadow rounded absolute bottom-44'>
                <CircleAlert className='text-info' size={70} />
                <div className='space-y-2'>
                    <p>Las <strong className='text-info'>listas</strong> sirven para hacer que tu experiencia de compra sea mas rápida y ágil.
                        Evitaras buscar producto por producto cada vez que quieras hacer una compra.</p>

                    <p>Cuando estes haciendo un pedido, puedes usar una de tus listas y el sistema se encargara del resto.</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className='w-full flex h-full'>
            {searchListsLoading ?
                <OverlayLoadingIndicator />
                : lists.length === 0
                    ? noElements
                    : (
                        <>
                            <div className='w-96 relative bg-white shadow py-5 px-10 overflow-auto flex flex-col gap-2'>
                                {getAllListsNames().map((list: { name: string; id: string }) =>
                                    <SearchListButton active={selectedList?.id === list.id} key={list.id} id={list.id} name={list.name} onClick={handleSelectedList} />
                                )}
                                <AddSearchList
                                    callback={() => {
                                        setIsLoading(false);
                                        refetch()
                                    }} onLoading={() => setIsLoading(true)}
                                    triggerButton={
                                        <Button className='mt-5 w-60 flex items-center gap-4 absolute bottom-10'>
                                            Crear lista
                                            <ListPlus />
                                        </Button>
                                    }
                                />
                            </div>
                            <div className='w-full flex flex-col'>
                                <div className='h-24 flex justify-between items-center px-8 bg-border'>
                                    <div>
                                        <h2 className='text-2xl font-bold'>{selectedList?.name}</h2>
                                        <p className='text-sm'>Lista creada por: {selectedList?.createdBy}</p>
                                    </div>
                                    <div className='flex ga-2'>
                                        <Button variant="ghost">
                                            <Pencil size={18} />
                                        </Button>
                                        <Button variant="ghost">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                                <div className='h-20 flex items-center justify-between px-8 border-b'>
                                    <div className='flex gap-4 items-center'>
                                        <div className='relative'>
                                            <Search className='absolute top-2 left-3' />
                                            <Input
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                disabled={!!selectedList && selectedList.products.length <= 1}
                                                placeholder="Buscar en la lista..."
                                                className='w-30 pl-14'
                                                value={searchQuery}
                                            />
                                            {searchQuery.length > 0 && <X size={16} className='absolute top-3 right-3 cursor-pointer' onClick={() => setSearchQuery('')} />}
                                        </div>
                                        <DropdownMenuCheckboxes
                                            disabled={categoriesFromList && categoriesFromList?.length <= 1}
                                            triggerLabel='Seleccionar cartegorias'
                                            values={categoriesFromList && categoriesFromList}
                                            callback={(selectedValues) => filterByCategory(selectedValues)}
                                        />
                                    </div>
                                    <div>
                                        <AddSearchList
                                            title='Agrega productos'
                                            subTitle='Vas a agregar productos a la lista:'
                                            icon={<PackagePlus size={16} />}
                                            list={{ name: selectedList && selectedList?.name, id: selectedList && selectedList?.id }}
                                            callback={() => {
                                                setIsLoading(false);
                                                refetch()
                                            }} onLoading={() => setIsLoading(true)}
                                            triggerButton={
                                                <Button
                                                    variant="outline"
                                                    className='w-60 flex items-center gap-4'>
                                                    Agregar Productos a la Lista
                                                    <PackagePlus size={16} />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className='px-6 h-full'>
                                    {isLoading && <OverlayLoadingIndicator />}
                                    {selectedList?.products && selectedList?.products.length > 0 ?
                                        <SearchProductsTable
                                            maxHeight="450px"
                                            products={filteredProducts && filteredProducts}
                                            removeProduct={(id) => handleRemoveProduct(id)}
                                        />
                                        : (
                                            <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
                                                <img className='w-32' src={emptyBox} alt='empty-list' />
                                                <p className='text-lg font-bold'>No hay productos en esta lista</p>
                                                <p className='text-muted'>Puedes agregarlos haciendo click en el boton arriba a la derecha</p>
                                            </div>
                                        )
                                    }
                                </div>
                                <DeleteConfirmationDialog
                                    id={deleteListProduct.data && deleteListProduct.data.id}
                                    otherMutationProp={selectedList?.id}
                                    name={deleteListProduct.data && deleteListProduct.data.name}
                                    openDialog={deleteListProduct && deleteListProduct.isOpen}
                                    title="Eliminar producto!"
                                    question="¿Seguro que quieres borrar producto"
                                    onLoading={() => setIsLoading(true)}
                                    mutationFn={deleteProduct}
                                    callback={deleteComplete}
                                />
                            </div>
                        </>
                    )
            }
        </div>
    )
}
