import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getSearchListById } from "@/lib/searchLists/searchLists";
import UseSearcConfigStore from "@/store/searchConfiguration.store.";
import { SquareCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import UseSearchStore from "@/store/search.store";

export default function ProductsList({ isVisible = false }: { isVisible: boolean }) {
    const { listId } = UseSearcConfigStore();
    const { setActiveSearchItem, activeSearchItem } = UseSearchStore();

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

    if (!listId) return <div className="w-full h-full text-nowrap m-5">No seleccionaste una lista</div>

    if (isError) return <div>Error</div>;

    return (
        <div className={cn("flex flex-col h-full justify-between transition-opacity", {
            'opacity-0': !isVisible,
            'opacity-100': isVisible
        }
        )}>
            <div className="w-full h-full text-nowrap mt-5">
                <ul className=" mt-2 ml-5 overflow-y-auto h-[490px]">
                    {data && data?.products?.map((product, index) => (
                        <li className={cn("border-b border-border py-3 flex items-center justify-between relative overflow-hidden cursor-pointer",
                            {
                                ' cursor-default': activeSearchItem?.id === product.id,
                                'border-t': index === 0
                            }
                        )}
                            key={product.id}
                            onClick={() => setActiveSearchItem(product)}
                        >
                            <div className="flex gap-2">

                                {1 + 1 == 3
                                    ? <SquareCheck className="text-primary" />
                                    : <SquareCheck className="text-border" />
                                }
                                <span className={cn({
                                    'text-primary': activeSearchItem?.id === product.id
                                })}>
                                    {product.name}
                                </span>
                            </div>
                        </li>

                    ))}
                </ul>
            </div>
            <div className="text-sm w-full text-foreground/70 text-center text-nowrap bg-border/50 p-2">
                Estas usando la lista: <span className="text-highlight font-black">{data && data?.name}</span>
            </div>
        </div>
    )
}