import React, { ChangeEvent } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

interface QuestionOption {
  text: string;
  is_correct: boolean;
}

interface QuestionEditModalProps {
  isOpen: boolean;
  editQuestionText: string;
  editQuestionOptions: QuestionOption[];
  onClose: () => void;
  onSave: () => void;
  onTextChange: (value: string) => void;
  onOptionsChange: (options: QuestionOption[]) => void;
  onOptionChange: (index: number, option: QuestionOption) => void;
  onOptionDelete: (index: number) => void;
  onOptionAdd: () => void;
}

const QuestionEditModal: React.FC<QuestionEditModalProps> = ({
  isOpen,
  editQuestionText,
  editQuestionOptions,
  onClose,
  onSave,
  onTextChange,
  onOptionsChange,
  onOptionChange,
  onOptionDelete,
  onOptionAdd
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Sửa câu hỏi</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nội dung câu hỏi
            </label>
            <textarea
              value={editQuestionText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onTextChange(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
            />
          </div>

          {/* Options for MCQ */}
          {editQuestionOptions.length > 0 && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Các lựa chọn
              </label>
              <div className="space-y-2">
                {editQuestionOptions.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6">{String.fromCharCode(65 + optIndex)}.</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onOptionChange(optIndex, { ...option, text: e.target.value });
                      }}
                      className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Nhập lựa chọn"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={option.is_correct}
                        onChange={() => {
                          const newOptions = editQuestionOptions.map((opt, idx) => ({
                            ...opt,
                            is_correct: idx === optIndex
                          }));
                          onOptionsChange(newOptions);
                        }}
                      />
                      <span>Đúng</span>
                    </label>
                    {editQuestionOptions.length > 2 && (
                      <button
                        onClick={() => onOptionDelete(optIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Xóa lựa chọn"
                      >
                        <MdDelete size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {editQuestionOptions.length < 6 && (
                  <button
                    onClick={onOptionAdd}
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <IoAddCircleOutline size={16} />
                    Thêm lựa chọn
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={onSave}
              disabled={!editQuestionText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditModal;




