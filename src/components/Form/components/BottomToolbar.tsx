import React from 'react';
import { MdCloudUpload } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { TbMatrix } from "react-icons/tb";
import { FaMagic } from "react-icons/fa";

interface BottomToolbarProps {
  questionCount: number;
  onConfigClick: () => void;
  onFileUploadClick: () => void;
  onMatrixClick: () => void;
  onAssembleClick: () => void;
  onGenerateClick: () => void;
  onClearClick: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({
  questionCount,
  onConfigClick,
  onFileUploadClick,
  onMatrixClick,
  onAssembleClick,
  onGenerateClick,
  onClearClick,
  onSubmit,
  isSubmitting = false,
  canSubmit = true
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Left Side: Configuration, Question Count, Divider, AI Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="px-2 sm:px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onConfigClick}
              title="Cấu hình bài thi"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Cấu hình</span>
            </button>
            
            {/* Question Count */}
            <div className="text-xs sm:text-sm text-gray-700 px-2 sm:px-3 py-2 bg-gray-100 rounded-md border border-gray-200">
              <span className="font-semibold">{questionCount}</span> <span className="hidden sm:inline">câu hỏi</span>
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            
            {/* AI Tools */}
            <button
              className="px-2 sm:px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onFileUploadClick}
              title="Tải đề thi lên và trích xuất câu hỏi bằng AI"
            >
              <MdCloudUpload className="w-4 h-4"/>
              <span className="hidden md:inline">Tải đề thi</span>
            </button>
            <button
              className="px-2 sm:px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onMatrixClick}
              title="Tải ma trận/đặc tả và tạo câu hỏi bằng AI"
            >
              <TbMatrix className="w-4 h-4"/>
              <span className="hidden md:inline">Ma trận</span>
            </button>
            <button
              className="px-2 sm:px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onAssembleClick}
              title="Sinh đề từ ngân hàng câu hỏi"
            >
              <FaMagic className="w-4 h-4" />
              <span className="hidden md:inline">Ghép đề</span>
            </button>
            <button
              className="px-2 sm:px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onGenerateClick}
              title="Tạo câu hỏi mới bằng AI dựa trên câu hỏi hiện có"
            >
              <RiAiGenerate2 className="w-4 h-4"/>
              <span className="hidden md:inline">Tạo câu hỏi</span>
            </button>
          </div>
          
          {/* Right Side: Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="px-2 sm:px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-sm"
              onClick={onClearClick}
              title="Xóa toàn bộ dữ liệu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Xóa</span>
            </button>
            <button
              className="px-3 sm:px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onSubmit}
              disabled={!canSubmit || isSubmitting}
              title="Tạo đề thi"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Đang tạo...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">Tạo đề thi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomToolbar;




