import React from 'react';
import { createPortal } from 'react-dom';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  // Nếu không có thông báo, không cần hiển thị container
  if (notifications.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-h-screen overflow-hidden pointer-events-none">
      <div className="pointer-events-auto">
        {notifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onClose={removeNotification} 
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default NotificationContainer; 