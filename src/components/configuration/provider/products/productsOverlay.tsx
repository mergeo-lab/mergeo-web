import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { FileCog } from "lucide-react";
import { Label } from "@/components/ui/label";
import LoadingIndicator from "@/components/loadingIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProductsList, getProductsLists } from "@/lib/products";
import { ProductsListSchemaType } from "@/lib/schemas";
import UseProductListStore from "@/store/productsList.store";
import { cn } from "@/lib/utils";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    triggerButton?: React.ReactNode
    openDialog?: boolean
    callback: (data: ProductsListSchemaType) => void
    onCancel: (goBack: boolean) => void
}

export function ProductsOverlay(
    {
        title = 'Crear o seleccionar una lista de productos',
        subTitle = '',
        icon = <FileCog />,
        companyId,
        triggerButton,
        openDialog = true,
        callback,
        onCancel,
    }: Props) {

    const [open, setOpen] = useState(true);
    const [listName, setListName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState<ProductsListSchemaType | null>(null);
    const { selectedList, setSelectedList, removeSelectedList } = UseProductListStore();
    const submitDisabled = list === null && listName.length <= 0;

    const { data, isLoading: queryLoading, isError } = useQuery({
        queryKey: ['products-lists', companyId, selectedList?.id],
        queryFn: ({ queryKey }) => {
            console.log('queryKey:', queryKey);

            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getProductsLists({ companyId });
        },
        enabled: !!companyId, // Ensure the query runs only if company ID exists
    });

    const mutation = useMutation({ mutationFn: createProductsList });

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            setTimeout(() => {
                setList(selectedList);
                setIsLoading(false);
            }, 300)
        } else {

            setIsLoading(false);
        }
        if (queryLoading) setIsLoading(queryLoading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, queryLoading])

    async function onSubmit() {
        if (!companyId) return;
        setIsLoading(true);

        if (list) {
            setIsLoading(false);
            setSelectedList(list);
            setOpen(false);
            callback(list);

        } else {
            mutation.mutateAsync({ name: listName, companyId: companyId }).then(data => {
                setIsLoading(false);
                setOpen(false);
                setSelectedList(data);
                setList(data);
                setListName('');
                callback(data);
            })
        }

    }
    // we prevent the dialog from closing when clicking outside
    function handleOpenChange(open: boolean) {
        // Prevent closing the dialog when clicking outside
        if (open === false) return;
        setOpen(open);
    }

    const onItemSelected = useCallback((value: string) => {
        if (!value || !data) return;
        const selected = data.find((list: ProductsListSchemaType) => list.id === value);
        if (selected) {
            setListName('');
            setList(selected);
        }
    }, [data]);

    useEffect(() => {
        if (openDialog) {
            setOpen(true);
        } else setOpen(false);
    }, [openDialog, onCancel]);

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full flex mt-2" asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-full" showClose={false}>
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {subTitle}
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="w-full h-full min-h-[445px] px-20 flex items-center justify-center">
                        <LoadingIndicator />
                    </div>
                ) :
                    <div className='p-10 w-full h-full'>
                        <div className='flex justify-center items-center h-full'>
                            <div className='grid grid-rows-[auto_1fr] gap-8 [&>div]:multi-[border-border;border;rounded;]'>
                                <h2>
                                    Todos los productos se cargan en <span className='text-primary font-light'>listas</span>, puedes crear una nueva o elegir una preexistente.
                                </h2>
                                <div className={cn('transition-all', {
                                    'shadow-lg border !border-secondary/20': listName.length > 0
                                })}>
                                    <p className='mb-5 py-2 px-5 border-b bg-border/40'>Crear una nueva Lista</p>

                                    <div className='flex gap-4 items-center p-5'>
                                        <Label className='text-nowrap'>
                                            Nombre de la lista
                                        </Label>
                                        <Input
                                            value={listName}
                                            onInput={(e) => {
                                                removeSelectedList();
                                                setList(null);
                                                setListName(e.currentTarget.value as string)
                                            }}></Input>
                                    </div>

                                </div>

                                <div className={cn('transition-all', {
                                    'shadow-lg border !border-secondary/20': !!list
                                })}>
                                    <p className='mb-5 py-2 px-5 border-b bg-border/40'>
                                        Agregar productos en una lista existente
                                    </p>
                                    <div className='flex gap-4 items-center p-5'>
                                        <Label className='text-nowrap'>
                                            Seleccione una lista
                                        </Label>
                                        <Select onValueChange={onItemSelected} value={list && list.id || ''}>
                                            <SelectTrigger disabled={isLoading || data?.length === 0}>
                                                {isLoading
                                                    ? <SelectValue placeholder="Buscando listas..." />
                                                    : data?.length === 0
                                                        ? <SelectValue placeholder="No se encontraron listas de productos" />
                                                        : <SelectValue placeholder="Seleccione una lista" />
                                                }
                                            </SelectTrigger>
                                            <SelectContent>
                                                {isError
                                                    && <div className="text-center">Error al buscar las listas de productos</div>}
                                                {isLoading
                                                    && <div className="text-center">Buscando listas de productos...</div>}
                                                {data && data.map((item: { id: string, name: string }) => (
                                                    <SelectItem key={item.id} value={item.id || ''}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <DialogFooter className="w-full border top-1 px-6 py-3">
                    <DialogClose className="w-40">
                        <Button onClick={() => {
                            onCancel(!selectedList)
                        }} variant="secondary" type="button" className="w-full">Cancelar</Button>
                    </DialogClose>
                    <DialogClose className="w-40" disabled={submitDisabled}>
                        <Button disabled={submitDisabled} onClick={onSubmit} type="button" className="w-full">
                            {
                                !list ? "Crear Lista " : "Usar Lista"
                            }
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}