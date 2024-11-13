import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchListsResultsType } from "@/lib/schemas";
import { getSearchLists } from "@/lib/searchLists/searchLists";
import { cn } from "@/lib/utils";
import UseCompanyStore from "@/store/company.store";
import { useQuery } from "@tanstack/react-query";


type Props = {
    selectedListId?: string;
    onChange: (listId: string) => void;
    removeSelection: () => void
}

export default function ListSelector({ selectedListId, onChange, removeSelection }: Props) {

    const { company } = UseCompanyStore();

    const { data, isLoading, isError, refetch } = useQuery({
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

    if (isLoading) {
        return (<div>
            <div className="space-y-4 mt-1">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="p-4 w-full opacity-30" />
                ))}
            </div>
        </div>
        )
    }

    if (isError) {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                <p className="text-destructive text-sm">Error al cargar las listas!</p>
                <Button variant="outline" onClick={() => refetch()}>
                    Intentelo de nuevo
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {data?.map((item: SearchListsResultsType) => (
                <div className={cn("border border-border p-3 cursor-pointer hover:bg-accent rounded text-sm",
                    {
                        "bg-accent text-primary": item.id == selectedListId
                    }
                )}
                    key={item.id}
                    onClick={() => {
                        if (item.id == selectedListId) removeSelection();
                        else onChange(item.id)
                    }
                    }>
                    {item.name}
                </div>
            ))}
        </div>
    )
}