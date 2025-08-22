import { Badge } from "@/components/ui/badge"
import { PRE_ORDER_STATUS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { JSX } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export function StatusBadge({ status, className, hasWarning = false }: { status: string, className?: string, hasWarning?: boolean }) {
    console.log(status)
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
            selected = <Badge variant='outline' className={cn('border-dashed border-primary text-primary text-nowrap px-4', className)}>Parcialmente Aceptada</Badge>
            break;
        case PRE_ORDER_STATUS.timeout:
            selected = <Badge className={cn('bg-secondary-background hover:bg-secondary-background', className)}>Expirada</Badge>
            break;
        case PRE_ORDER_STATUS.fail:
            selected = <Badge variant='outline' className={cn('border-destructive text-destructive', className)}>Fallida</Badge>
            break;
        case PRE_ORDER_STATUS.processed:
            selected = <Badge className={cn('bg-info hover:bg-info text-white', className)}>Procesada</Badge>
            break;
        case PRE_ORDER_STATUS.end:
            selected = <Badge className={cn('bg-white hover:bg-white border border-info text-info flex items-center gap-2', className, {
                'text-red-500 border-red-500': hasWarning
            })}>{hasWarning && <FiAlertTriangle className='text-red-500' size={16} />}
                <span>Finalizado</span>
            </Badge>
            break;
        default:
            selected = <div className="bg-gray-500"></div>
            break;
    }

    return <div className="w-fit min-w-32 [&>div]:multi-[w-full;flex;justify-center;]">{selected}</div>
}
