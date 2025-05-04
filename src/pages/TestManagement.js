import React, { useState } from 'react';
import { FaSearch, FaPlus, FaRegFolderOpen } from "react-icons/fa";
import { PiBankBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import FolderStructure from '../components/FolderStructure';
import { useAuth } from "../contexts/AuthContext";

function TestManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/Dashboard")}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            Quay lại
          </button>
          <button
            onClick={() => navigate("/FormMaker")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            <FaPlus className='inline mr-2'/>Tạo đề thi
          </button>
          <button
            onClick={() => navigate("/QuestionBank")}
            className="bg-amber-400 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors duration-300"
          >
            <PiBankBold className='inline mr-2'/> Tạo ngân hàng câu hỏi
          </button>
          {/* <button
            onClick={() => navigate("/ExamLibrary")}
            className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-950 transition-colors duration-300"
          >
            <FaRegFolderOpen className='inline mr-2'/>Thư viện đề thi
          </button> */}
        </div>
        <div className="relative w-full md:w-64 group">
          <input
            type="search"
            placeholder="Tìm kiếm đề thi..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
            bg-gray-50 text-gray-700
            transition-all duration-300 ease-in-out
            placeholder:text-gray-400 placeholder:transition-all
            hover:border-blue-400 hover:bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            focus:border-transparent focus:bg-white
            peer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 
            text-gray-400 transition-colors duration-300
            group-hover:text-blue-500 peer-focus:text-blue-500">
            <FaSearch className="w-4 h-4" />
          </span>
        </div>      
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đề thi</h1>
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
        
        <FolderStructure searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default TestManagement;
