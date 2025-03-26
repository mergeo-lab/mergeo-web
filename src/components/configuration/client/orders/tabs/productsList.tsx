import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getSearchListById } from "@/lib/searchLists/searchLists";
import UseSearcConfigStore from "@/store/searchConfiguration.store.";
import { ListX, SquareCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import UseSearchStore from "@/store/search.store";
import { useEffect } from "react";
import { SearchListProductType } from "@/lib/schemas";

type Props = {
    configCanceled: boolean,
    isVisible: boolean,
    selectList: () => void,
}

export default function ProductsList({ configCanceled, isVisible = false }: Props) {
    const { listId, setSearchParams } = UseSearcConfigStore();
    const { setActiveSearchItem, activeSearchItem, savedProducts } = UseSearchStore();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['searchLists', listId],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getSearchListById(listId);
        },
        enabled: !!listId, // Ensure the query runs only if company ID exists
    });

    function handleSearchItem(name: string) {
        setSearchParams({ name });
    }

    function handleSelectItem(product: SearchListProductType) {
        setActiveSearchItem(product);
        setSearchParams({ name: product.name });
    }

    useEffect(() => {
        if (data) {
            setActiveSearchItem(data?.products[0]);
            handleSearchItem(data?.products[0].name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, setActiveSearchItem])

    if (!isVisible && configCanceled || !listId) {
        return (
            <div className="flex flex-col justify-center items-center px-10">
                <div className="w-full h-fit text-nowrap m-5 flex gap-2 p-2 border border-border justify-center items-center">
                    <ListX className="text-destructive" size={25} />
                    <p className="text-secondary/60">No seleccionaste una lista</p>
                </div>
                <p className="text-secondary/60 font-light text-base leading-5 pb-5 text-center">
                    Puedes seleccionar una liste en la pantalla de configuración
                </p>
            </div>
        )
    }

    if (isLoading || !isVisible) {
        return (
            <div>
                <div className="space-y-4 mt-5 mx-6 opacity-25">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-4 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError) return <div>Error</div>;

    return (
        <div className={cn("flex flex-col h-full justify-between transition-opacity", {
            'opacity-0': !isVisible,
            'opacity-100': isVisible
        }
        )}>
            <div className="w-full h-full text-nowrap mt-5">
                <ul className=" mt-2 ml-5 overflow-y-auto h-[495px]">
                    {data && data?.products?.map((product, index) => (
                        <li className={cn("border-b border-border py-3 pl-4 flex items-center justify-between relative overflow-hidden cursor-pointer text-secondary/60",
                            {
                                'hover:bg-border/20': activeSearchItem?.id !== product.id,
                                ' cursor-default bg-primary/10 text-secondary': activeSearchItem?.id === product.id,
                                'border-t': index === 0
                            }
                        )}
                            key={product.id}
                            onClick={() => handleSelectItem(product)}
                        >
                            <div className="flex gap-2">
                                {product?.id && savedProducts[product?.id]?.length
                                    ? <SquareCheck className="text-primary/60" />
                                    : <SquareCheck className={cn("text-border", {
                                        'text-secondary/70': activeSearchItem?.id == product.id
                                    })} />
                                }
                                <span className={cn({
                                    'text-primary/60': product?.id && savedProducts[product?.id]?.length,
                                })}>
                                    {product.name}
                                </span>
                            </div>
                        </li>

                    ))}
                </ul>
            </div>
            <div className="text-sm w-full text-foreground/70 text-center text-nowrap bg-border/50 p-2">
                Estas usando la lista: <span className="text-highlight font-black tracking-wide">{data && data?.name}</span>
            </div>
        </div >
    )
}