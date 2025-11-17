import React from 'react';
import { MathJax } from 'better-react-mathjax';
import type { Question, Answer, StudentAnswer } from './types';

interface TrueFalseQuestionDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
}

const TrueFalseQuestionDisplay: React.FC<TrueFalseQuestionDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex
}) => {
  return (
    <div className="space-y-4 pl-8">
      {(question.options || []).map((option, oIndex) => {
        return (
          <div key={oIndex} className="mb-3">
            <div className="mb-2 font-medium">
              <MathJax>{`${String.fromCharCode(97 + oIndex)}. ${option.option}`}</MathJax>
            </div>
          </div>
        );
      })}
      
      {/* Hiển thị tổng hợp đáp án */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="font-medium mb-2">
          Đáp án của học sinh: {
            (() => {
              if (!studentAnswer || !Array.isArray(studentAnswer.selectedAnswer)) {
                return <span className="text-gray-500">Chưa trả lời</span>;
              }
              
              return (question.options || []).map((option, oIndex) => {
                const hasAnswer = studentAnswer.selectedAnswer[oIndex] !== undefined && 
                                 studentAnswer.selectedAnswer[oIndex] !== null;
                
                if (!hasAnswer) {
                  return (
                    <span key={oIndex} className="text-gray-500">
                      {oIndex > 0 && "; "}
                      {String.fromCharCode(97 + oIndex)}) Chưa trả lời
                    </span>
                  );
                }
                
                const studentAnswerValue = studentAnswer.selectedAnswer[oIndex];
                const correctAnswerValue = Array.isArray(answer?.answer) ? answer.answer[oIndex] : undefined;
                const isCorrect = studentAnswerValue === correctAnswerValue;
                
                return (
                  <span 
                    key={oIndex} 
                    className={isCorrect ? "text-green-600" : "text-red-600"}
                  >
                    {oIndex > 0 && "; "}
                    {String.fromCharCode(97 + oIndex)}) {studentAnswerValue ? "Đúng" : "Sai"}
                  </span>
                );
              });
            })()
          }
        </p>
        
        <p className="font-medium">
          Đáp án đúng: {
            (question.options || []).map((option, oIndex) => {
              const correctAnswerValue = Array.isArray(answer?.answer) ? answer.answer[oIndex] : undefined;
              
              return (
                <span key={oIndex} className="text-green-600">
                  {oIndex > 0 && "; "}
                  {String.fromCharCode(97 + oIndex)}) {correctAnswerValue ? "Đúng" : "Sai"}
                </span>
              );
            })
          }
        </p>
      </div>
    </div>
  );
};

export default TrueFalseQuestionDisplay;

