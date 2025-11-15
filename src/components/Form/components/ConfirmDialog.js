import React from 'react';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title || 'Xác nhận'}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;








