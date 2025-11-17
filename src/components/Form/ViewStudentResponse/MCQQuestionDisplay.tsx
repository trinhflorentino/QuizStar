import React from 'react';
import { MathJax } from 'better-react-mathjax';
import type { Question, Answer, StudentAnswer } from './types';

interface MCQQuestionDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
}

const MCQQuestionDisplay: React.FC<MCQQuestionDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex
}) => {
  const correctAnswer = answer?.answer;
  const hasStudentAnswer = studentAnswer && 
                          studentAnswer.selectedAnswer !== undefined && 
                          studentAnswer.selectedAnswer !== null;
  const studentAnswerValue = hasStudentAnswer ? studentAnswer.selectedAnswer : null;

  return (
    <div className="space-y-3 pl-8">
      {(question.options || []).map((option, oIndex) => {
        // Form.js uses 0-based indexes for selected answers
        // but correct answers are 1-based in the database
        const isCorrect = correctAnswer !== undefined && parseInt(String(correctAnswer)) === oIndex + 1;
        const isSelected = hasStudentAnswer && parseInt(String(studentAnswerValue)) === oIndex;

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
                <MathJax>{option.option}</MathJax>
              </div>
              {isCorrect && isSelected && (
                <span className="text-green-600 ml-2">✓</span>
              )}
              {isSelected && !isCorrect && (
                <span className="text-red-600 ml-2">✗</span>
              )}
              {isCorrect && !isSelected && (
                <span className="text-green-600 ml-2 opacity-50">✓</span>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Hiển thị đáp án của học sinh */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="font-medium">
          Đáp án của học sinh: {
            (() => {
              if (!hasStudentAnswer) {
                return <span className="text-gray-500">Chưa trả lời</span>;
              }
              
              const studentAnswerIndex = parseInt(String(studentAnswerValue));
              const correctAnswerValue = answer?.answer;
              const isCorrect = correctAnswerValue !== undefined && 
                               studentAnswerIndex === parseInt(String(correctAnswerValue)) - 1;
              
              return (
                <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600"}>
                  {String.fromCharCode(65 + studentAnswerIndex)}
                </span>
              );
            })()
          }
        </p>
      </div>
    </div>
  );
};

export default MCQQuestionDisplay;

