import React from 'react';
import type { DeleteTarget } from './types';

interface DeleteModalProps {
  isOpen: boolean;
  deleteType: 'chapter' | 'subContent' | 'requirement' | null;
  deleteTarget: DeleteTarget | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  deleteType,
  deleteTarget,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const getMessage = (): string => {
    if (!deleteType || !deleteTarget) return '';
    
    switch (deleteType) {
      case 'chapter':
        return `Bạn có chắc chắn muốn xóa chương "${deleteTarget.name}" và tất cả nội dung con của nó?`;
      case 'subContent':
        return `Bạn có chắc chắn muốn xóa nội dung "${deleteTarget.name}" và tất cả yêu cầu của nó?`;
      case 'requirement':
        return 'Bạn có chắc chắn muốn xóa yêu cầu này?';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
        <p className="mb-6 text-gray-700">
          {getMessage()}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;




