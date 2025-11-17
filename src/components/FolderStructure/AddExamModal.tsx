import React from 'react';
import { FaFileAlt } from "react-icons/fa";
import type { Exam, PathItem } from './types';
import { ROOT_ID } from './types';

interface AddExamModalProps {
  isOpen: boolean;
  exams: Exam[];
  currentPath: PathItem[];
  loading: boolean;
  onClose: () => void;
  onAddExam: (examId: string) => void;
}

const AddExamModal: React.FC<AddExamModalProps> = ({
  isOpen,
  exams,
  currentPath,
  loading,
  onClose,
  onAddExam
}) => {
  if (!isOpen) return null;

  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;
  const availableExams = exams
    .filter(exam => exam.folderId !== currentFolderId)
    .sort((a, b) => a.quiz_title.localeCompare(b.quiz_title));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Chọn đề thi để thêm vào thư mục '{currentPath[currentPath.length-1]?.name}'
        </h3>

        <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto border rounded-md">
          {availableExams.map(exam => (
            <div
              key={exam.id}
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => !loading && onAddExam(exam.id)}
              title={`Thêm: ${exam.quiz_title}`}
            >
              <FaFileAlt className="text-gray-500 mr-3 flex-shrink-0" />
              <span className="truncate">{exam.quiz_title}</span>
            </div>
          ))}
        </div>

        {availableExams.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            Không có đề thi nào khả dụng để thêm.
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
            onClick={onClose}
            disabled={loading}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExamModal;




