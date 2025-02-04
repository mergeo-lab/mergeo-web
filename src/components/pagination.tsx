import BackLink from "@/components/backLink"
import { Button } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import { BackLinkArrowPosition, BackLinkType } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Props = {
    className: string,
    prev: boolean,
    next: boolean,
    pages: number,
    currentPage: number,
    onPageBack: () => void,
    onPageForward: () => void,
    onPageChange: (page: number) => void,
}

export function PaginationCustom({ className, currentPage, prev, next, pages, onPageBack, onPageForward, onPageChange }: Props) {
    return (
        <Pagination className={cn(className)}>
            <PaginationContent>
                <PaginationItem className={cn({
                    'cursor-default': !prev,
                })}>
                    <BackLink
                        disabled={!prev}
                        arrowPosition={BackLinkArrowPosition.LEFT}
                        label="Anterior"
                        callback={onPageBack}
                        type={BackLinkType.BUTTON}
                    />
                </PaginationItem>
                {pages && [...Array(pages)].map((_, i) => (
                    <PaginationItem key={i}>
                        <Button
                            onClick={() => {
                                onPageChange(i + 1)
                            }}
                            variant='ghost'
                            className={cn({
                                'border border-primary text-primary font-bold hover:multi-[bg-transparent;text-primary]': +currentPage === i + 1,
                            })}>
                            {i + 1}
                        </Button>
                    </PaginationItem>
                ))}
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
    )
}
