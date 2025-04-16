import React from 'react';

function Modal({
  isOpen,
  onClose,
  isLoading,
  children,
  className = ""
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className={`relative animate-slideDown bg-white rounded-lg shadow-xl p-4 sm:p-8 max-w-md w-full m-4 ${className}`}>
        <button
          onClick={() => !isLoading && onClose()}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <span className="text-2xl">&times;</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal; 