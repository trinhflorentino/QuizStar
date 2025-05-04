import React from 'react';
import FolderStructure from '../components/FolderStructure';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ExamLibrary = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/TestManagement')}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Thư viện đề thi</h1>
        <p className="text-gray-600 mb-6">
          Tại đây bạn có thể quản lý các đề thi theo cấu trúc thư mục. Kéo và thả đề thi vào thư mục để di chuyển.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Hướng dẫn sử dụng:</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Nhấp vào thư mục để mở/đóng nội dung bên trong</li>
            <li>Kéo đề thi và thả vào thư mục để di chuyển đề thi</li>
            <li>Nhấp vào biểu tượng "Xem" để xem chi tiết đề thi</li>
            <li>Nhấp vào biểu tượng "Xóa" để xóa đề thi khỏi thư mục</li>
          </ul>
        </div>
        
        <FolderStructure />
      </div>
    </div>
  );
};

export default ExamLibrary; 