import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Tạo context cho notification
const NotificationContext = createContext();

// Default timeout cho notification là 5 giây
const DEFAULT_TIMEOUT = 5000;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Hàm thêm notification mới
  const addNotification = useCallback((message, type = 'info', timeout = DEFAULT_TIMEOUT) => {
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
  }, []);

  // Hàm xóa notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Hàm xóa tất cả notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Các hàm helper cho các loại notification khác nhau
  const success = useCallback((message, timeout) => {
    return addNotification(message, 'success', timeout);
  }, [addNotification]);

  const error = useCallback((message, timeout) => {
    return addNotification(message, 'error', timeout);
  }, [addNotification]);

  const info = useCallback((message, timeout) => {
    return addNotification(message, 'info', timeout);
  }, [addNotification]);

  const warning = useCallback((message, timeout) => {
    return addNotification(message, 'warning', timeout);
  }, [addNotification]);

  const value = {
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
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 