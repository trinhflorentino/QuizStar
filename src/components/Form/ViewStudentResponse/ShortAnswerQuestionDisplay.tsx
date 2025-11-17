import React from 'react';
import type { Question, Answer, StudentAnswer } from './types';

interface ShortAnswerQuestionDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
}

const ShortAnswerQuestionDisplay: React.FC<ShortAnswerQuestionDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex
}) => {
  const correctAnswers = Array.isArray(answer?.answer) 
    ? answer.answer 
    : [answer?.answer].filter((a: any) => a);
  
  const studentAnswerValue = studentAnswer?.selectedAnswer?.toString().trim();
  const isCorrect = studentAnswerValue && correctAnswers.some((ans: any) => 
    String(ans).trim().toLowerCase() === studentAnswerValue.toLowerCase()
  );

  return (
    <div className="pl-8">
      <div className="mb-4">
        <p className="font-medium mb-1">Câu trả lời của học sinh:</p>
        <div className={`p-3 border rounded-lg ${
          studentAnswerValue 
            ? (isCorrect ? 'bg-green-50 border-green-300' : 'bg-gray-50')
            : 'bg-gray-50 text-gray-400 italic'
        }`}>
          {studentAnswerValue || "Chưa trả lời"}
          {isCorrect && <span className="text-green-600 ml-2">✓</span>}
        </div>
      </div>
      <div>
        <p className="font-medium mb-1">Đáp án hợp lệ:</p>
        <div className="p-3 border rounded-lg bg-green-50 border-green-200">
          {correctAnswers.length === 0 ? (
            "Không có đáp án"
          ) : (
            <div className="flex flex-wrap gap-2">
              {correctAnswers.map((ans: any, ansIndex: number) => (
                <span 
                  key={ansIndex}
                  className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-sm font-medium"
                >
                  {String(ans).trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerQuestionDisplay;

