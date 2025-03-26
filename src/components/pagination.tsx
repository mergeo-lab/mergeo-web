import BackLink from "@/components/backLink"
import { Button } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { BackLinkArrowPosition, BackLinkType } from "@/lib/constants"
import { cn, pagination } from "@/lib/utils"
import { useEffect, useState } from "react"

type Props = {
    className?: string,
    prev: boolean,
    next: boolean,
    pages: number,
    currentPage: number,
    onPageBack: () => void,
    onPageForward: () => void,
    onPageChange: (page: number) => void,
}

export function PaginationCustom({ className, currentPage, prev, next, pages, onPageBack, onPageForward, onPageChange }: Props) {
    const pageNumbers = pagination(currentPage, pages);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 300)
    }, [currentPage])

    if (isLoading) {
        return (
            <div className={cn("flex justify-center items-center gap-2", className)}>
                <Skeleton className="h-10 w-[5.88rem] bg-muted/50"></Skeleton>
                {
                    Array.from({ length: pages <= 6 ? pages : 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-10 w-[2.57rem] bg-muted/50"></Skeleton>
                    ))
                }
                <Skeleton className="h-10 w-[5.88rem] bg-muted/50"></Skeleton>
            </div>
        )
    }

    return (
        <Pagination className={cn(className)}>
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem className={cn({ 'cursor-default': !prev })}>
                    <BackLink
                        disabled={!prev}
                        arrowPosition={BackLinkArrowPosition.LEFT}
                        label="Anterior"
                        callback={onPageBack}
                        type={BackLinkType.BUTTON}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((page: number, index: number) => (
                    <PaginationItem key={index}>
                        {page === -1 ? (
                            <PaginationEllipsis />
                        ) : (
                            <Button
                                onClick={() => onPageChange(page as number)}
                                variant="ghost"
                                className={cn({
                                    'border border-primary text-primary font-bold hover:multi-[bg-transparent;text-primary]': +currentPage === page,
                                })}
                            >
                                {page}
                            </Button>
                        )}
                    </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                    <BackLink
                        disabled={!next}
                        arrowPosition={BackLinkArrowPosition.RIGHT}
                        label="Siguiente"
                        callback={onPageForward}
                        type={BackLinkType.BUTTON}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
