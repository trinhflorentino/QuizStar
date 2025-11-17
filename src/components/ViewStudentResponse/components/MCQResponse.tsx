import React from 'react';
import { MemoizedMathJax } from './MemoizedMathJax';

interface MCQResponseProps {
  question: {
    options?: Array<{ option: string }>;
  };
  correctAnswer: number | undefined;
  studentAnswer: number | undefined;
  questionIndex: number;
}

export const MCQResponse: React.FC<MCQResponseProps> = ({
  question,
  correctAnswer,
  studentAnswer,
  questionIndex
}) => {
  if (!question.options) return null;

  return (
    <div className="space-y-3 pl-8">
      {question.options.map((option, oIndex) => {
        const isCorrect = correctAnswer !== undefined && parseInt(String(correctAnswer)) === oIndex + 1;
        const isSelected = studentAnswer !== undefined && parseInt(String(studentAnswer)) === oIndex;
        
        return (
          <div 
            key={oIndex}
            className={`p-3 rounded-lg border ${
              isCorrect && isSelected 
                ? 'bg-green-100 border-green-500' 
                : isSelected && !isCorrect 
                  ? 'bg-red-100 border-red-500' 
                  : isCorrect 
                    ? 'border-green-500' 
                    : 'border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium text-lg mr-3">
                {String.fromCharCode(65 + oIndex)}
              </span>
              <div className="flex-grow">
                <MemoizedMathJax>{option.option}</MemoizedMathJax>
              </div>
              {isCorrect && (
                <span className="text-green-600 ml-2">✓</span>
              )}
              {isSelected && !isCorrect && (
                <span className="text-red-600 ml-2">✗</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

