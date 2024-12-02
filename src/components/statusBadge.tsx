import { Badge } from "@/components/ui/badge"
import { PRE_ORDER_STATUS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function StatusBadge({ status, className }: { status: string, className?: string }) {
    switch (status) {
        case PRE_ORDER_STATUS.pending:
            return <Badge className={cn('bg-highlight hover:bg-highlight', className)}>Pendiente</Badge>
        case PRE_ORDER_STATUS.accepted:
            return <Badge className={cn('', className)}>Aceptada</Badge>
        case PRE_ORDER_STATUS.rejected:
            return <Badge variant='destructive' className={cn('', className)}>Rechazada</Badge>
        case PRE_ORDER_STATUS.partialyAccepted:
            return <Badge variant='outline' className={cn('border-dashed border-primary text-primary', className)}>Parcialmente Aceptada</Badge>
        case PRE_ORDER_STATUS.timeout:
            return <Badge className={cn('bg-secondary-background hover:bg-secondary-background', className)}>Expirada</Badge>
        case PRE_ORDER_STATUS.fail:
            return <Badge variant='outline' className={cn('border-destructive text-destructive', className)}>Fallida</Badge>
        default:
            return "bg-gray-500"
    }
}
