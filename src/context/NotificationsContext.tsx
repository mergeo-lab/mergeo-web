import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
    type: string;
    metadata: any;
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    removeAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { account } = useAuth();

    useEffect(() => {
        if (!account?.user) return;

        // Initial fetch of notifications
        fetchNotifications();

        // Set up Supabase real-time subscription
        const channel = supabase
            .channel('notifications-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${account.user.id}`,
                },
                (payload) => {
                    console.log('Received real-time notification:', payload);

                    if (payload.eventType === 'INSERT') {
                        const notification = payload.new as any;
                        const formattedNotification = {
                            ...notification,
                            createdAt: new Date(notification.created_at).toISOString()
                        };
                        setNotifications(prev => [formattedNotification, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        const notification = payload.new as any;
                        const formattedNotification = {
                            ...notification,
                            createdAt: new Date(notification.created_at).toISOString()
                        };
                        setNotifications(prev =>
                            prev.map(n =>
                                n.id === formattedNotification.id
                                    ? formattedNotification
                                    : n
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setNotifications(prev =>
                            prev.filter(n => n.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        return () => {
            channel.unsubscribe();
        };
    }, [account?.user]);

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', account?.user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Ensure all dates are properly formatted
            const formattedNotifications = (data || []).map(notification => ({
                ...notification,
                createdAt: new Date(notification.created_at).toISOString()
            }));

            setNotifications(formattedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id)
                .eq('user_id', account?.user?.id);

            if (error) throw error;

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
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', account?.user?.id)
                .eq('read', false);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const removeNotification = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id)
                .eq('user_id', account?.user?.id);

            if (error) throw error;

            setNotifications(prev =>
                prev.filter(notification => notification.id !== id)
            );
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    };

    const removeAllNotifications = async () => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', account?.user?.id);

            if (error) throw error;

            setNotifications([]);
        } catch (error) {
            console.error('Error removing all notifications:', error);
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
                removeNotification,
                removeAllNotifications,
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