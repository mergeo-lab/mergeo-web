import { AddSearchList } from '@/components/configuration/client/searchLists/addSearchList';
import SearchListButton from '@/components/configuration/client/searchLists/searchListButton';
import SearchProductsTable from '@/components/configuration/client/searchLists/searchProductsTable';
import { DeleteConfirmationDialog } from '@/components/deleteConfirmationDialog';
import { Button } from '@/components/ui/button'
import { deleteProduct, deleteSearchList, getSearchLists, updateListName } from '@/lib/searchLists/searchLists';
import UseCompanyStore from '@/store/company.store';
import UseSearchListsStore from '@/store/searchLists.store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { CircleAlert, PackagePlus, Pencil, Search, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react';
import { SearchListProductType, SearchListType } from '@/lib/searchLists/searchLists.schemas';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';
import { Input } from '@/components/ui/input';
import { DropdownMenuCheckboxes } from '@/components/dropdownMenuCheckboxes';
import emptyBox from '@/assets/emptyBox.svg';
import { useDebounceCallback } from 'usehooks-ts';
import { formatDate } from '@/lib/utils';
import EditNameDialog from '@/components/editNameDialog';
import { CgPlayListAdd } from "react-icons/cg";

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/lists/')({
    component: () => <SearchLists />
})

export function SearchLists() {
    const { company } = UseCompanyStore();
    const {
        addMultipleLists,
        removeAllLists,
        getAllListsNames,
        getListById,
        searchProductById,
        selectedList,
        setSelectedList,
        getCategoriesFromSelectedList,
        categoriesFromList,
        lists
    } = UseSearchListsStore();
    const [isLoading, setIsLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<SearchListProductType[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [deleteListProduct, setDeleteListProduct] = useState<{ data: SearchListProductType | null, isOpen: boolean }>({ data: null, isOpen: false });
    const [deleteList, setDeleteList] = useState<{ data: SearchListType | null, isOpen: boolean }>({ data: null, isOpen: false });
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
    }, [data, selectedList, addMultipleLists, removeAllLists, setSelectedList, getCategoriesFromSelectedList]);

    const debouncedFilter = useDebounceCallback(
        useCallback((query) => {
            if (!selectedCategories.length && selectedList) {
                // Return the full list if no categories are selected
                setFilteredProducts(selectedList.products || []);
                return;
            }
            if (selectedList) {
                const filtered = selectedList.products.filter((product) => {
                    const matchesCategory = product.category && selectedCategories.includes(product.category);
                    const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
                    return matchesCategory && matchesSearch;
                });
                setFilteredProducts(filtered);
            }
        }, [selectedCategories, selectedList]), // Only recompute when categories or list change
        300 // Debounce duration
    );

    useEffect(() => {
        if (selectedList) {
            debouncedFilter(searchQuery);
        }
    }, [searchQuery, selectedList, selectedCategories, debouncedFilter]);

    const handleSelectedList = useCallback((id: string) => {
        if (!id) return;
        const selectedList = getListById(id);
        selectedList && setSelectedList(selectedList);
        getCategoriesFromSelectedList();
    }, [getListById, setSelectedList, getCategoriesFromSelectedList]);

    const handleRemoveProduct = useCallback((id: string) => {
        if (!id) return;
        const selectedProduct = searchProductById(id);
        if (selectedProduct) setDeleteListProduct({ data: selectedProduct, isOpen: true });
        getCategoriesFromSelectedList();
    }, [searchProductById, getCategoriesFromSelectedList]);

    const handleRemoveListClick = useCallback((id: string | undefined) => {
        if (!id) return;
        const list = getListById(id);
        if (list) {
            setDeleteList({ data: list, isOpen: true });
        }
    }, [getListById]);

    const handleAddSearchListCallback = useCallback(() => {
        setIsLoading(false);
        refetch();
    }, [refetch]);

    function handleDeleteProductCallback() {
        setDeleteListProduct({ data: null, isOpen: false });
        setIsLoading(false);
        refetch();
    }

    function handleDeleteListCallback() {
        setDeleteList({ data: null, isOpen: false });
        setIsLoading(false);
        refetch();
    }

    const handleFilterByCategory = useCallback((category: string[]) => {
        setSelectedCategories(category);
    }, [setSelectedCategories]);

    function handleIsLoading() {
        setIsLoading(true);
    }

    if (isError) return <div>Error</div>

    const createListButton = (
        <Button className='mt-5 w-60 flex items-center gap-2'>
            <CgPlayListAdd size={22} className='-ml-2' />
            Crear lista
        </Button>
    )

    if (searchListsLoading) return <OverlayLoadingIndicator />

    if (lists.length === 0) {
        return (
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
                    triggerButton={createListButton}
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
    } else {
        return (
            <>
                <div className='w-96 relative bg-white shadow py-5 px-10 overflow-auto flex flex-col gap-1'>
                    {getAllListsNames().map((list: { name: string; id: string }) =>
                        <SearchListButton active={selectedList?.id === list.id} key={list.id} id={list.id} name={list.name} onClick={handleSelectedList} />
                    )}
                    <AddSearchList
                        callback={() => {
                            setIsLoading(false);
                            refetch()
                        }} onLoading={() => setIsLoading(true)}
                        triggerButton={
                            <div className='mt-5 w-60 flex items-center gap-4 absolute bottom-10'>
                                {createListButton}
                            </div>
                        }
                    />
                </div>
                <div className='w-full flex flex-col'>
                    <div className='w-full flex justify-between items-center bg-border px-8'>
                        <div className='h-24 flex items-center gap-5'>
                            <div>
                                <h2 className='text-2xl font-bold text-ellipsis text-nowrap max-w-96 overflow-hidden'>
                                    {selectedList?.name}
                                </h2>
                                <p className='text-sm text-secondary/60'>Lista creada por: {selectedList?.createdBy}</p>
                            </div>
                            <div className='border border-l h-10 w-1 bg-secondary/20'></div>
                            <div className='flex ga-2'>
                                <EditNameDialog
                                    dialogTitle="Editar nombre de la lista"
                                    triggerButton={
                                        <Button variant="ghost">
                                            <Pencil size={18} />
                                        </Button>
                                    }
                                    name={selectedList?.name}
                                    id={selectedList?.id}
                                    callback={handleAddSearchListCallback}
                                    onLoading={handleIsLoading}
                                    mutationFn={updateListName}
                                />

                                <Button
                                    disabled={!selectedList} onClick={() => handleRemoveListClick(selectedList?.id)}
                                    variant="ghost"
                                    className="w-fit flex gap-2 rounded-r-none border border-border border-r-0 hover:text-destructive">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                        <div className='text-sm text-secondary/60 items-end flex flex-col'>
                            <span>Actualizado el</span>
                            {selectedList && formatDate(selectedList?.updated)}
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
                                disabled={categoriesFromList && categoriesFromList.length <= 1}
                                triggerLabel='Seleccionar categorías'
                                values={categoriesFromList}
                                callback={handleFilterByCategory}
                            />
                        </div>
                        <div>
                            <AddSearchList
                                title='Agrega productos'
                                subTitle='Vas a agregar productos a la lista:'
                                buttonText='Agregar'
                                icon={<PackagePlus size={16} />}
                                list={{ name: selectedList && selectedList?.name, id: selectedList && selectedList?.id }} callback={handleAddSearchListCallback}
                                onLoading={handleIsLoading}
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
                                products={filteredProducts} // Use memoized filtered products
                                removeProduct={handleRemoveProduct}
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
                    {/* DELETE PRODUCT CONFITMATION */}
                    <DeleteConfirmationDialog
                        id={deleteListProduct.data && deleteListProduct.data.id}
                        otherMutationProp={selectedList?.id}
                        openDialog={deleteListProduct && deleteListProduct.isOpen}
                        title="Borrar producto!"
                        question={<p>Estas seguro de borrar el producto <span className="font-bold">{deleteListProduct.data && deleteListProduct.data.name}</span>?</p>}
                        onLoading={handleIsLoading}
                        mutationFn={(args: unknown) => deleteProduct(args as { id: string; otherMutationProp: string })}
                        callback={handleDeleteProductCallback}
                        onClose={() => setDeleteListProduct({ data: null, isOpen: false })}
                    />
                    {/* DELETE LIST CONFITMATION */}
                    <DeleteConfirmationDialog
                        id={deleteList.data && deleteList.data.id}
                        openDialog={deleteList && deleteList.isOpen}
                        title="Borrar Lista!"
                        question={<p>Estas seguro de borrar la lista <span className="font-bold">{deleteList.data && deleteList.data.name}</span>?</p>}

                        onLoading={handleIsLoading}
                        mutationFn={(args: unknown) => deleteSearchList(args as { id: string })}
                        callback={handleDeleteListCallback}
                        onClose={() => setDeleteList({ data: null, isOpen: false })}
                    />
                </div>
            </>
        )
    }
}
