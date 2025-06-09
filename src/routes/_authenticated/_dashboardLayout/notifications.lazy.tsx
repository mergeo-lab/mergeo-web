import { createLazyFileRoute } from '@tanstack/react-router'
import { useNotifications } from '@/context/NotificationsContext'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/notifications')({
    component: NotificationsPage
})

function NotificationsPage() {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Notificaciones</h1>
                {notifications.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        className="text-sm"
                    >
                        Marcar todas como leídas
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No hay notificaciones
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mensaje
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {notifications.map((notification) => (
                                <tr
                                    key={notification.id}
                                    className={notification.read ? 'bg-white' : 'bg-blue-50'}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {notification.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(notification.createdAt), 'PPp', { locale: es })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {notification.read ? 'Leída' : 'No leída'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {!notification.read && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-primary hover:text-primary/80"
                                            >
                                                Marcar como leída
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}