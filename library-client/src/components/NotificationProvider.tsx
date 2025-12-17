import React, { createContext, useState, useContext, useCallback, useEffect, type ReactNode } from 'react';
import '../css/Notification.css';

interface Notification {
    id: number;
    message: string;
    duration?: number | 'persistent';
}

interface NotificationOptions {
    duration?: number | 'persistent';
}

const NotificationContext = createContext<(message: string, options?: NotificationOptions) => void>(() => {});

let notificationId = 0;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: number) => {
        setNotifications(currentNotifications => 
            currentNotifications.filter(notification => notification.id !== id)
        );
    }, []);

    const addNotification = useCallback((message: string, options?: NotificationOptions) => {
        const id = Date.now() + notificationId++;
        setNotifications(currentNotifications => [
            ...currentNotifications,
            { id, message, duration: options?.duration },
        ]);
    }, []);

    return (
        <NotificationContext.Provider value={addNotification}>
            {children}
            <div className="notification-container">
                {notifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        message={notification.message}
                        duration={notification.duration}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

interface NotificationItemProps {
    message: string;
    onClose: () => void;
    duration?: number | 'persistent';
}

const NotificationItem: React.FC<NotificationItemProps> = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration === 'persistent') {
            return; // Не закривати автоматично
        }
        
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose, duration]);

    return (
        <div className="notification-item">
            <span>{message}</span>
            <button onClick={onClose} className="notification-close-btn">&times;</button>
        </div>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};