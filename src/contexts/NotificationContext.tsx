import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timeout: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType, timeout?: number) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  success: (message: string, timeout?: number) => string;
  error: (message: string, timeout?: number) => string;
  info: (message: string, timeout?: number) => string;
  warning: (message: string, timeout?: number) => string;
}

// Tạo context cho notification
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Default timeout cho notification là 5 giây
const DEFAULT_TIMEOUT = 5000;

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Hàm xóa notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Hàm thêm notification mới
  const addNotification = useCallback((message: string, type: NotificationType = 'info', timeout: number = DEFAULT_TIMEOUT): string => {
    const id = uuidv4();
    
    setNotifications(prev => [
      ...prev,
      { id, message, type, timeout }
    ]);

    // Tự động xóa notification sau thời gian timeout
    if (timeout !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  }, [removeNotification]);

  // Hàm xóa tất cả notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Các hàm helper cho các loại notification khác nhau
  const success = useCallback((message: string, timeout?: number): string => {
    return addNotification(message, 'success', timeout);
  }, [addNotification]);

  const error = useCallback((message: string, timeout?: number): string => {
    return addNotification(message, 'error', timeout);
  }, [addNotification]);

  const info = useCallback((message: string, timeout?: number): string => {
    return addNotification(message, 'info', timeout);
  }, [addNotification]);

  const warning = useCallback((message: string, timeout?: number): string => {
    return addNotification(message, 'warning', timeout);
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    info,
    warning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook để sử dụng notification context
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};




