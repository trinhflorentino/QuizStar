import React from 'react';

function TextInputPanel({ 
  quizTitle, 
  onTitleChange, 
  rawText, 
  onTextChange, 
  textareaRef,
  onEquationClick 
}) {
  return (
    <div className="w-1/2 flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-white">
        <input
          type="text"
          className="quiz_title shadow shadow-slate-300 rounded-xl text-lg text-center p-3 sm:p-4 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="quiz_title"
          id="quiz_title"
          placeholder="Hãy nhập tiêu đề bài thi..."
          value={quizTitle || ''}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          <button
            className="px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2 text-sm shadow-sm"
            onClick={onEquationClick}
            title="Chèn phương trình toán học (Ctrl+M)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="hidden sm:inline">Chèn phương trình</span>
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className="w-full flex-1 p-4 border-2 border-gray-300 rounded-lg shadow-sm font-mono text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          value={rawText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Dán nội dung đề thi vào đây theo định dạng:

Phần 1. TRẮC NGHIỆM
Câu 1. Câu hỏi...
*A. Đáp án đúng      B. Đáp án sai
C. Đáp án sai        D. Đáp án sai

PHẦN II. Câu trắc nghiệm đúng sai
Câu 4. Câu hỏi...
*a) Mệnh đề đúng
b) Mệnh đề sai

---------------------------HẾT------------------------
Bảng đáp án
1A 2B 3C
Câu 4: a)Đ b)S c)S d)Đ
Câu 6: on | On | ON"
        />
      </div>
    </div>
  );
}

export default TextInputPanel;

