import React, { useState, useEffect, useRef } from 'react';
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdClose } from 'react-icons/md';

const NotificationItem = ({ notification, onClose }) => {
  const { id, message, type, timeout } = notification;
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState(null);
  const progressRef = useRef(100);

  // Hiệu ứng fade-in khi hiển thị notification
  useEffect(() => {
    // Đặt visible thành true để kích hoạt hiệu ứng fade-in
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Xử lý progress bar
  useEffect(() => {
    // Chỉ hiển thị thanh tiến trình nếu có timeout > 0
    if (timeout > 0) {
      progressRef.current = 100;
      setProgress(100);
      
      // Tạo interval để cập nhật thanh tiến trình
      const decrementStep = 100 / (timeout / 10);
      const interval = setInterval(() => {
        progressRef.current = Math.max(0, progressRef.current - decrementStep);
        setProgress(progressRef.current);
      }, 10);

      setIntervalId(interval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout]);

  // Xử lý khi đóng notification
  const handleClose = () => {
    setVisible(false);
    
    // Dọn dẹp interval
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // Đợi hiệu ứng fade-out hoàn thành trước khi xóa notification
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  // Xác định icon dựa trên loại notification
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircle className="text-white text-xl" />;
      case 'error':
        return <MdError className="text-white text-xl" />;
      case 'warning':
        return <MdWarning className="text-white text-xl" />;
      case 'info':
      default:
        return <MdInfo className="text-white text-xl" />;
    }
  };

  // Xác định màu nền dựa trên loại notification
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div 
      className={`my-2 max-w-md w-full overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      }`}
    >
      <div className="relative flex items-center">
        <div className={`${getBackgroundColor()} p-3`}>
          {getIcon()}
        </div>
        <div className="p-3 flex-grow bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-800 dark:text-gray-200">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <MdClose className="text-xl" />
        </button>
      </div>
      
      {/* Progress bar */}
      {timeout > 0 && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full">
          <div 
            className={`h-full ${getBackgroundColor()}`} 
            style={{ width: `${progress}%`, transition: 'width 10ms linear' }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default NotificationItem; 