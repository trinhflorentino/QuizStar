import React from 'react';

interface DeleteSelectedModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteSelectedModal: React.FC<DeleteSelectedModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Xác nhận xóa câu hỏi</h2>
        <p className="mb-4 text-gray-700">
          Bạn có chắc chắn muốn xóa <span className="font-medium">{selectedCount}</span> câu hỏi đã chọn? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSelectedModal;




