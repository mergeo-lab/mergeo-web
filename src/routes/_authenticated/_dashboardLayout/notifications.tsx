import { createFileRoute, Link } from '@tanstack/react-router'
import { useNotifications } from '@/context/NotificationsContext'
import { Button } from '@/components/ui/button'
import { format, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { NotificationType } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LuTrash2 } from 'react-icons/lu'
import { DeleteConfirmationDialog } from '@/components/deleteConfirmationDialog'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/notifications')({
    component: NotificationsPage
})

function NotificationsPage() {
    const { notifications, markAsRead, markAllAsRead, removeNotification, removeAllNotifications } = useNotifications()

    const getNotificationTitle = (type: string) => {
        switch (type) {
            case NotificationType.PRE_ORDER_CREATED:
                return 'Nuevo Pedido'
            case NotificationType.PRE_ORDER_UPDATED:
                return 'Pedido Actualizado'
            case NotificationType.BUY_ORDER_CREATED:
                return 'Nueva Orden de Compra'
            default:
                return 'Notificación'
        }
    }

    const getNotificationLink = (notification: any) => {
        if (notification.type === 'pre_order_created' || notification.type === 'pre_order_updated') {
            return `/provider/proOrders/${notification.pre_order_id}`
        }
        if (notification.type === 'buy_order_created') {
            return `/buyOrder/${notification.buy_order_id}`
        }
        return null
    }

    return (
        <div className="p-10 mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notificaciones</h1>
                <Button onClick={markAllAsRead} variant="outline" disabled={notifications.length === 0 || notifications.every(notification => notification.read)}>
                    Marcar todas como leídas
                </Button>
            </div>

            <div className="bg-white rounded-lg">
                <div className="relative">
                    <div className="overflow-auto max-h-[calc(100vh-250px)]">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10 hover:bg-white shadow-sm">
                                <TableRow className='hover:bg-white h-14'>
                                    <TableHead>Notificación</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                    <TableHead>
                                        <div className='flex items-center justify-center gap-2'>
                                            {notifications.length > 0 && (
                                                <DeleteConfirmationDialog
                                                    id="all"
                                                    title="Eliminar todas las notificaciones"
                                                    question="¿Estás seguro que deseas eliminar todas las notificaciones?"
                                                    triggerButton={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-fit h-fit px-3 py-1 !m-0"
                                                        >
                                                            <div className='flex items-center gap-2'>
                                                                Borrar todas
                                                                <LuTrash2 className="h-4 w-4 text-destructive" />
                                                            </div>
                                                        </Button>
                                                    }
                                                    mutationFn={async () => {
                                                        removeAllNotifications();
                                                        return Promise.resolve();
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No hay notificaciones
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    notifications.map((notification) => {
                                        const date = new Date(notification.createdAt)
                                        const formattedDate = isValid(date)
                                            ? format(date, 'PPp', { locale: es })
                                            : 'Fecha no disponible'
                                        const link = getNotificationLink(notification)

                                        return (
                                            <TableRow key={notification.id} className='hover:bg-white'>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {getNotificationTitle(notification.type)}
                                                        </span>

                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formattedDate}
                                                </TableCell>
                                                <TableCell>
                                                    {notification.read ? (
                                                        <p>Leída</p>
                                                    ) : (
                                                        <p className='text-highlight font-semibold'>Nueva</p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {link && (
                                                        <Link
                                                            to={link}
                                                            className="text-primary hover:text-primary/80 mt-1"
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            Ver detalles
                                                        </Link>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-center gap-2'>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => removeNotification(notification.id)}
                                                        >
                                                            <LuTrash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}