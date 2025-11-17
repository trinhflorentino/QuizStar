import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Truy cập bị từ chối
          </h1>
          <p className="mt-4 text-lg text-red-500">{error}</p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate('/TestManagement')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none"
            >
              Về trang quản lý
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;




