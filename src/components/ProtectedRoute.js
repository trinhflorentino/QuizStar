import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, authInitialized } = useAuth();

  // Hiển thị loading spinner khi đang đợi khởi tạo xác thực
  if (loading || !authInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  // Chuyển hướng nếu chưa đăng nhập
  if (!currentUser) {
    return <Navigate to="/Login" />;
  }

  // Nếu đã đăng nhập, hiển thị route bình thường
  return children;
};

export default ProtectedRoute; 