import React from 'react';
import type { Question, Answer, StudentAnswer } from './types';

interface ShortAnswerResultDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
}

const ShortAnswerResultDisplay: React.FC<ShortAnswerResultDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex
}) => {
  if (!answer) return null;

  const correctAnswers = Array.isArray(answer?.answer) 
    ? answer.answer 
    : [answer?.answer].filter((a: any) => a);
  
  const studentAnswerValue = studentAnswer?.selectedAnswer?.toString().trim();
  const isCorrect = studentAnswerValue && correctAnswers.some((ans: any) => 
    String(ans).trim().toLowerCase() === studentAnswerValue.toLowerCase()
  );

  return (
    <div className="pl-4 sm:pl-6 md:pl-8">
      {/* Answer summary */}
      <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="font-medium text-green-800 mb-2 text-sm sm:text-base">Đáp án hợp lệ:</p>
        <div className="flex flex-wrap gap-2">
          {correctAnswers.length === 0 ? (
            <span className="text-gray-600 text-xs sm:text-sm">Không có đáp án</span>
          ) : (
            correctAnswers.map((ans: any, ansIndex: number) => (
              <span 
                key={ansIndex}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-xs sm:text-sm font-medium"
              >
                {String(ans).trim()}
              </span>
            ))
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="font-medium mb-2 text-sm sm:text-base">Câu trả lời của bạn:</p>
        <div className={`p-3 sm:p-4 border-2 rounded-lg ${
          isCorrect 
            ? 'bg-green-50 border-green-300' 
            : studentAnswerValue 
              ? 'bg-red-50 border-red-300' 
              : 'bg-gray-50 border-gray-300'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className={`text-sm sm:text-base ${studentAnswerValue ? '' : 'text-gray-500 italic'}`}>
              {studentAnswerValue || "Chưa trả lời"}
            </span>
            {isCorrect ? (
              <span className="text-green-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✓ Đúng</span>
            ) : studentAnswerValue ? (
              <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Sai</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerResultDisplay;




