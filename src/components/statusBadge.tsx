import { Badge } from "@/components/ui/badge"
import { PRE_ORDER_STATUS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { JSX } from "react";

export function StatusBadge({ status, className }: { status: string, className?: string }) {
    let selected: JSX.Element;
    switch (status) {
        case PRE_ORDER_STATUS.pending:
            selected = <Badge className={cn('bg-highlight hover:bg-highlight', className)}>Pendiente</Badge>
            break;
        case PRE_ORDER_STATUS.accepted:
            selected = <Badge className={cn('hover:bg-primary', className)}>Aceptada</Badge>
            break;
        case PRE_ORDER_STATUS.rejected:
            selected = <Badge variant='destructive' className={cn('hover:bg-destructive', className)}>Rechazada</Badge>
            break;
        case PRE_ORDER_STATUS.partialyAccepted:
            selected = <Badge variant='outline' className={cn('border-dashed border-primary text-primary', className)}>Parcialmente Aceptada</Badge>
            break;
        case PRE_ORDER_STATUS.timeout:
            selected = <Badge className={cn('bg-secondary-background hover:bg-secondary-background', className)}>Expirada</Badge>
            break;
        case PRE_ORDER_STATUS.fail:
            selected = <Badge variant='outline' className={cn('border-destructive text-destructive', className)}>Fallida</Badge>
            break;
        default:
            selected = <div className="bg-gray-500"></div>
            break;
    }

    return <div className="w-32 [&>div]:multi-[w-full;flex;justify-center;]">{selected}</div>
}
