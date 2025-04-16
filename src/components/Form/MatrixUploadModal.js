import React from 'react';
import Modal from './Modal';

function MatrixUploadModal({
  isOpen,
  onClose,
  isLoading,
  onUpload,
  mcqRef,
  trueFalseRef,
  shortAnswerRef
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isLoading={isLoading}>
      <form className="bg-white rounded">
        <h2 className="text-2xl font-bold mb-6">Tải tệp ma trận/đặc tả</h2>
        <div className="mb-6">
          <input
            type="file"
            id="matrixInput"
            disabled={isLoading}
            className="block w-full text-gray-700 bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept=".docx, .pdf, image/*"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mcq">
            Số lượng Trắc nghiệm:
          </label>
          <input
            type="number"
            id="mcq"
            name="mcq"
            min="0"
            defaultValue="3"
            ref={mcqRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trueFalse">
            Số lượng Đúng/Sai:
          </label>
          <input
            type="number"
            id="trueFalse"
            name="trueFalse"
            min="0"
            defaultValue="2"
            ref={trueFalseRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shortAnswer">
            Số lượng Trả Lời Ngắn:
          </label>
          <input
            type="number"
            id="shortAnswer"
            name="shortAnswer"
            min="0"
            defaultValue="1"
            ref={shortAnswerRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onUpload}
            className={`${
              isLoading ? 'bg-green-300' : 'bg-green-500 hover:bg-green-700'
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
              'Tạo câu hỏi'
            )}
          </button>
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className={`${
              isLoading ? 'bg-gray-300' : 'bg-gray-500 hover:bg-gray-700'
            } text-white font-bold py-2 px-4 rounded`}
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default MatrixUploadModal; 