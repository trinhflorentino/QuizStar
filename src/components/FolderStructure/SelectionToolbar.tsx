import React from 'react';
import { FaCopy, FaCut, FaTrash } from "react-icons/fa";
import type { DisplayItem } from './types';

interface SelectionToolbarProps {
  selectedItems: DisplayItem[];
  loading: boolean;
  onClearSelection: () => void;
  onCopy: () => void;
  onCut: () => void;
  onDelete: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedItems,
  loading,
  onClearSelection,
  onCopy,
  onCut,
  onDelete
}) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-blue-800 font-medium">Đã chọn {selectedItems.length} mục</span>
          <button
            onClick={onClearSelection}
            className="ml-4 text-gray-600 hover:text-gray-800 text-sm"
            disabled={loading}
          >
            Bỏ chọn tất cả
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onCopy}
            className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
            title="Sao chép"
            disabled={loading}
          >
            <FaCopy className="mr-1" />
            <span>Sao chép</span>
          </button>
          
          <button
            onClick={onCut}
            className="flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded hover:bg-amber-200 transition-colors disabled:opacity-50"
            title="Cắt"
            disabled={loading}
          >
            <FaCut className="mr-1" />
            <span>Cắt</span>
          </button>
          
          <button
            onClick={onDelete}
            className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
            title="Xóa"
            disabled={loading}
          >
            <FaTrash className="mr-1" />
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionToolbar;




