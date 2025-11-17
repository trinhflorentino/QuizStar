import React from 'react';
import { IoChevronBack } from "react-icons/io5";

interface NotFoundStateProps {
  onBack: () => void;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Không tìm thấy ngân hàng câu hỏi</h1>
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <IoChevronBack />
        <span>Quay lại danh sách</span>
      </button>
    </div>
  );
};

export default NotFoundState;




