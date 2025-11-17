import React, { useState } from 'react';
import { FaFileAlt, FaCopy, FaCheck } from "react-icons/fa";
import type { Exam } from './types';

interface ExamItemProps {
  exam: Exam;
  isSelected: boolean;
  loading: boolean;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>, item: Exam) => void;
  onView: (examId: string) => void;
}

const ExamItem: React.FC<ExamItemProps> = ({
  exam,
  isSelected,
  loading,
  onSelect,
  onView
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(exam.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className={`grid grid-cols-12 p-3 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
      onClick={() => onView(exam.id)}
    >
      <div className="col-span-1 pr-2">
        <input 
          type="checkbox" 
          className="w-4 h-4"
          checked={isSelected}
          onChange={(e) => onSelect(e, exam)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="col-span-5 flex items-center">
        <FaFileAlt className="text-gray-500 mr-3 flex-shrink-0" />
        <span className="truncate">{exam.quiz_title}</span>
      </div>
      <div className="col-span-3 flex items-center">
        <span 
          onClick={handleCopyPin}
          className="font-mono text-sm font-bold text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-lg border border-blue-300 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer flex items-center gap-2"
          title="Click để sao chép mã bài thi"
        >
          {copied ? (
            <>
              <FaCheck className="text-green-600 flex-shrink-0" />
              <span className="text-green-700">Đã copy!</span>
            </>
          ) : (
            <>
              <FaCopy className="text-blue-600 flex-shrink-0" />
              <span>{exam.id}</span>
            </>
          )}
        </span>
      </div>
      <div className="col-span-3 flex items-center justify-end space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            !loading && onView(exam.id);
          }}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md disabled:opacity-50"
          disabled={loading}
        >
          Xem
        </button>
      </div>
    </div>
  );
};

export default ExamItem;

