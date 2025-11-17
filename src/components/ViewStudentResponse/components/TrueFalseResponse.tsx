import React from 'react';
import { MemoizedMathJax } from './MemoizedMathJax';

interface TrueFalseResponseProps {
  question: {
    options?: Array<{ option: string }>;
  };
  correctAnswer: boolean[] | undefined;
  studentAnswer: boolean[] | undefined;
  questionIndex: number;
}

export const TrueFalseResponse: React.FC<TrueFalseResponseProps> = ({
  question,
  correctAnswer,
  studentAnswer,
  questionIndex
}) => {
  if (!question.options) return null;

  return (
    <div className="space-y-4 pl-8">
      {question.options.map((option, oIndex) => {
        const correct = correctAnswer?.[oIndex];
        const student = studentAnswer?.[oIndex];
        
        return (
          <div key={oIndex} className="mb-3">
            <div className="mb-2 font-medium">
              <MemoizedMathJax>{`${String.fromCharCode(97 + oIndex)}. ${option.option}`}</MemoizedMathJax>
            </div>
            <div className="flex ml-8 space-x-4">
              <div 
                className={`px-4 py-2 rounded-lg border ${
                  student === true 
                    ? correct === true 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-red-100 border-red-500' 
                    : correct === true 
                      ? 'border-green-500' 
                      : 'border-gray-300'
                }`}
              >
                Đúng
                {correct === true && (
                  <span className="text-green-600 ml-2">✓</span>
                )}
              </div>
              <div 
                className={`px-4 py-2 rounded-lg border ${
                  student === false 
                    ? correct === false 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-red-100 border-red-500' 
                    : correct === false 
                      ? 'border-green-500' 
                      : 'border-gray-300'
                }`}
              >
                Sai
                {correct === false && (
                  <span className="text-green-600 ml-2">✓</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

