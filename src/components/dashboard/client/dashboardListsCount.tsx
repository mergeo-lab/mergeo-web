import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardListCounts } from '@/lib/dashboard';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

export default function DashboardListsCount({ companyId }: { companyId: string }) {

    const { data, isLoading } = useQuery({
        queryKey: ["lists-details", companyId],
        queryFn: () => getDashboardListCounts(companyId),
    });

    const LIST_TYPES = {
        "LIST": "list",
        "FAVORITES": "favorites",
        "BLACKLIST": "blacklist",
    }

    if (isLoading) {
        const amount = 3;
        return (
            <div className='flex flex-col gap-4 justify-between items-center '>
                {
                    Array.from({ length: amount }).map((_, index) => (
                        <Skeleton key={index} className={cn('h-[5.77rem] w-full')} />
                    ))
                }
            </div>
        )
    }

    return (
        data?.map((list, index) => (
            <Card className="w-full" key={index}>
                <CardContent className='flex flex-col relative pt-5 pb-0 h-[5.77rem]'>
                    <div className='flex justify-between items-center '>
                        <p className='text-nowrap'>{list.title}</p>
                        <div className={cn('h-2 w-full mx-4 border-b border-b-muted/40')}></div>
                        {list.count !== 0
                            ? <p>{list.count}</p>
                            : <p className='text-sm text-nowrap'>Aun no tiens</p>
                        }
                    </div>
                    <div className='flex justify-end -mr-5'>
                        <Button variant="link">
                            {
                                list.type === LIST_TYPES.LIST &&
                                <Link to='/client/lists'>Ver listas</Link>
                            }
                            {
                                list.type === LIST_TYPES.FAVORITES &&
                                <Link to='/client/lists/favorites'>Ver Favoritos</Link>
                            }
                            {
                                list.type === LIST_TYPES.BLACKLIST &&
                                <Link to='/client/lists/blackList'>Ver Lista Negra</Link>
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))
    )
}

