import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { account } = useAuth();

    useEffect(() => {
        if (!account?.user) return;

        // Initial fetch of notifications
        fetchNotifications();

        // Set up SSE connection
        const eventSource = new EventSource('/api/notifications/stream');

        eventSource.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            setNotifications(prev => [newNotification, ...prev]);
        };

        eventSource.onerror = () => {
            eventSource.close();
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                if (account?.user) {
                    new EventSource('/api/notifications/stream');
                    eventSource.onmessage = (event) => {
                        const newNotification = JSON.parse(event.data);
                        setNotifications(prev => [newNotification, ...prev]);
                    };
                }
            }, 5000);
        };

        return () => {
            eventSource.close();
        };
    }, [account?.user]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications');
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/read-all', { method: 'POST' });
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}