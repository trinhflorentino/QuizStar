import React from 'react';
import { FaPaste, FaTimes } from "react-icons/fa";
import type { DisplayItem } from './types';

interface ClipboardToolbarProps {
  clipboard: DisplayItem[];
  clipboardOperation: 'copy' | 'cut' | null;
  currentPathLength: number;
  loading: boolean;
  onPaste: () => void;
  onClear: () => void;
}

const ClipboardToolbar: React.FC<ClipboardToolbarProps> = ({
  clipboard,
  clipboardOperation,
  currentPathLength,
  loading,
  onPaste,
  onClear
}) => {
  if (clipboard.length === 0) return null;

  return (
    <div className="bg-green-50 border border-green-100 rounded-md p-3 mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-green-800 font-medium">
          Đã {clipboardOperation === 'cut' ? 'cắt' : 'sao chép'} {clipboard.length} mục
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        {currentPathLength > 0 && (
          <button
            onClick={onPaste}
            className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
            title="Dán vào thư mục hiện tại"
            disabled={loading}
          >
            <FaPaste className="mr-1" />
            <span>Dán</span>
          </button>
        )}
        
        <button
          onClick={onClear}
          className="flex items-center text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          title="Xóa bộ nhớ tạm"
          disabled={loading}
        >
          <FaTimes className="mr-1" />
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
};

export default ClipboardToolbar;




