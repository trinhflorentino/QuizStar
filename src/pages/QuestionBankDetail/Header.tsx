import React from 'react';
import { IoChevronBack } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { FaMagic } from "react-icons/fa";

interface HeaderProps {
  title: string;
  bankId: string;
  onBack: () => void;
  onImport: () => void;
  onAssemble?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  bankId,
  onBack,
  onImport,
  onAssemble
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
      >
        <IoChevronBack />
        <span>Quay lại</span>
      </button>
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {onAssemble && (
          <button
            onClick={onAssemble}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaMagic className="mr-1" />
            <span>Tạo đề thi</span>
          </button>
        )}
        <button
          onClick={onImport}
          className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <FiUpload className="mr-1" />
          <span>Import câu hỏi từ đề thi</span>
        </button>
      </div>
    </div>
  );
};

export default Header;




