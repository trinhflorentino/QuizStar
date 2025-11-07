import React from 'react';
import { MathJax } from 'better-react-mathjax';

function QuizPreview({ quizTitle, questions, options }) {
  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-2">Chưa có câu hỏi nào</p>
            <p className="text-sm text-gray-500">Nhập nội dung đề thi vào ô bên trái để xem trước</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-4">
        {quizTitle || 'Xem trước đề thi'}
      </h2>
      <div className="space-y-6">
        {questions.map((question, index) => {
          // Handle text blocks (non-question content)
          if (question.type === 'textblock') {
            return (
              <div key={question.id || index} className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
                  <MathJax dynamic inline>{question.text}</MathJax>
                </div>
              </div>
            );
          }
          
          // Handle questions
          let questionNumber = 1;
          for (let i = 0; i < index; i++) {
            if (questions[i].type !== 'textblock') {
              questionNumber++;
            }
          }
          
          return (
          <div key={question.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-md text-gray-700">
                Câu {questionNumber}:
              </h3>
              <span className="text-sm text-gray-500 capitalize bg-gray-200 px-2 py-1 rounded">
                {question.type === 'mcq' ? 'Trắc nghiệm' : 
                 question.type === 'truefalse' ? 'Đúng/Sai' : 
                 'Trả lời ngắn'}
              </span>
            </div>

            <div className="prose max-w-none text-gray-800 mb-3">
              {question.question && question.question.trim() ? (
                <MathJax dynamic inline>{question.question}</MathJax>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  <span className="font-medium">⚠️</span> Chưa có nội dung câu hỏi
                </div>
              )}
            </div>

            {question.type === 'mcq' && (
              <div className="mt-4 space-y-2 pl-4">
                {options[index] && options[index].length > 0 ? (
                  options[index].map((opt, optIndex) => (
                    <div
                      key={opt.id || optIndex}
                      className={`flex items-start p-2 rounded ${
                        question.answer === optIndex ? 'bg-green-100 border border-green-300' : 'bg-white'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                      <div className="prose-sm max-w-none flex-1">
                        {opt.option && opt.option.trim() ? (
                          <MathJax dynamic inline>{opt.option}</MathJax>
                        ) : (
                          <span className="text-gray-400 italic">Chưa có nội dung lựa chọn</span>
                        )}
                      </div>
                      {question.answer === optIndex && (
                        <span className="ml-2 text-green-600 font-semibold text-sm">✓ Đúng</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <span className="font-medium">⚠️</span> Chưa có lựa chọn nào
                  </div>
                )}
              </div>
            )}

            {question.type === 'truefalse' && (
              <div className="mt-4 space-y-2 pl-4">
                {options[index] && options[index].length > 0 ? (
                  options[index].map((opt, optIndex) => (
                    <div 
                      key={opt.id || optIndex} 
                      className={`p-2 rounded flex items-start ${
                        opt.answer ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(97 + optIndex)}.</span>
                      <div className="flex-1 prose-sm max-w-none">
                        {opt.option && opt.option.trim() ? (
                          <MathJax dynamic inline>{opt.option}</MathJax>
                        ) : (
                          <span className="text-gray-400 italic">Chưa có nội dung mệnh đề</span>
                        )}
                      </div>
                      <span className={`font-semibold ml-4 text-sm ${
                        opt.answer ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {opt.answer ? 'Đúng' : 'Sai'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <span className="font-medium">⚠️</span> Chưa có mệnh đề nào
                  </div>
                )}
              </div>
            )}

            {question.type === 'shortanswer' && (
              <div className="mt-4 pl-4">
                {question.answer && (Array.isArray(question.answer) ? question.answer.length > 0 : (typeof question.answer === 'string' && question.answer.trim())) ? (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Đáp án hợp lệ:</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(question.answer) ? question.answer : [question.answer]).map((ans, ansIndex) => (
                        <span 
                          key={ansIndex}
                          className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-sm font-medium"
                        >
                          {typeof ans === 'string' ? ans.trim() : ans}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <span className="font-medium">⚠️</span> Chưa có đáp án
                  </div>
                )}
              </div>
            )}
          </div>
        );
        })}
      </div>
    </div>
  );
}

export default QuizPreview;

