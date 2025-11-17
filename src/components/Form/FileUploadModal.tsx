import React from 'react';
import Modal from './Modal';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onUpload: () => void;
  title: string;
  accept?: string;
  buttonText?: string;
  buttonClass?: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  isLoading = false,
  onUpload,
  title,
  accept,
  buttonText = "Tải lên",
  buttonClass = "bg-blue-600 hover:bg-blue-700"
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isLoading={isLoading}>
      <form className="bg-white rounded">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>
        <div className="mb-6">
          <input
            type="file"
            id="fileInput"
            disabled={isLoading}
            className="block w-full text-gray-700 bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept={accept}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onUpload}
            className={`${
              isLoading ? 'bg-blue-300' : buttonClass
            } text-white font-bold py-2 px-4 rounded flex items-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              buttonText
            )}
          </button>
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FileUploadModal;




