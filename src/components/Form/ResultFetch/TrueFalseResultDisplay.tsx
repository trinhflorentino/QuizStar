import React from 'react';
import { MathJax } from 'better-react-mathjax';
import type { Question, Answer, StudentAnswer } from './types';

interface TrueFalseResultDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
}

const TrueFalseResultDisplay: React.FC<TrueFalseResultDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex
}) => {
  if (!answer) return null;

  return (
    <div className="space-y-4 pl-4 sm:pl-6 md:pl-8">
      {/* Show answer summary */}
      <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="font-medium text-green-800 mb-2 text-sm sm:text-base">Đáp án đúng:</p>
        <div className="flex flex-wrap gap-2">
          {(question.options || []).map((_, optIndex) => {
            const correctAns = Array.isArray(answer?.answer) ? answer.answer[optIndex] : undefined;
            return (
              <span key={optIndex} className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded text-xs sm:text-sm">
                {String.fromCharCode(97 + optIndex)}: {correctAns === true ? 'Đúng' : 'Sai'}
              </span>
            );
          })}
        </div>
        {studentAnswer?.selectedAnswer && (
          <p className="font-medium text-gray-800 mt-2 mb-1 text-sm sm:text-base">Đáp án của bạn:</p>
        )}
        {studentAnswer?.selectedAnswer && (
          <div className="flex flex-wrap gap-2">
            {(question.options || []).map((_, optIndex) => {
              const studentAns = Array.isArray(studentAnswer?.selectedAnswer) ? studentAnswer.selectedAnswer[optIndex] : undefined;
              const correctAns = Array.isArray(answer?.answer) ? answer.answer[optIndex] : undefined;
              const isCorrect = studentAns === correctAns;
              
              if (studentAns === undefined || studentAns === null) {
                return (
                  <span key={optIndex} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs sm:text-sm">
                    {String.fromCharCode(97 + optIndex)}: Chưa trả lời
                  </span>
                );
              }
              
              return (
                <span 
                  key={optIndex} 
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                    isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {String.fromCharCode(97 + optIndex)}: {studentAns === true ? 'Đúng' : 'Sai'} 
                  {isCorrect ? ' ✓' : ' ✗'}
                </span>
              );
            })}
          </div>
        )}
      </div>
      
      {(question.options || []).map((option, optIndex) => {
        const correctAns = Array.isArray(answer?.answer) ? answer.answer[optIndex] : undefined;
        const studentAns = Array.isArray(studentAnswer?.selectedAnswer) ? studentAnswer.selectedAnswer[optIndex] : undefined;
        const isCorrect = studentAns === correctAns;
        
        return (
          <div key={optIndex} className="mb-3 sm:mb-4">
            <div className="mb-2 font-medium text-sm sm:text-base">
              <MathJax inline>{`${String.fromCharCode(97 + optIndex)}. ${option.option}`}</MathJax>
            </div>
            <div className="flex flex-col sm:flex-row ml-4 sm:ml-8 gap-2 sm:gap-4">
              <div 
                className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all ${
                  studentAns === true 
                    ? correctAns === true 
                      ? 'bg-green-100 border-green-500 shadow-sm' 
                      : 'bg-red-100 border-red-500 shadow-sm' 
                    : correctAns === true 
                      ? 'bg-green-50 border-green-300' 
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between sm:justify-start">
                  <span className="text-sm sm:text-base">Đúng</span>
                  {correctAns === true && (
                    <span className="text-green-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✓</span>
                  )}
                  {studentAns === true && !isCorrect && (
                    <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Bạn chọn</span>
                  )}
                </div>
              </div>
              <div 
                className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all ${
                  studentAns === false 
                    ? correctAns === false 
                      ? 'bg-green-100 border-green-500 shadow-sm' 
                      : 'bg-red-100 border-red-500 shadow-sm' 
                    : correctAns === false 
                      ? 'bg-green-50 border-green-300' 
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between sm:justify-start">
                  <span className="text-sm sm:text-base">Sai</span>
                  {correctAns === false && (
                    <span className="text-green-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✓</span>
                  )}
                  {studentAns === false && !isCorrect && (
                    <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Bạn chọn</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrueFalseResultDisplay;




