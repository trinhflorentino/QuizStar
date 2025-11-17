import React from 'react';
import { MathJax } from 'better-react-mathjax';
import type { Question, QuestionScore } from './types';

interface QuestionResultHeaderProps {
  question: Question;
  questionIndex: number;
  questionScore: QuestionScore | undefined;
}

const QuestionResultHeader: React.FC<QuestionResultHeaderProps> = ({
  question,
  questionIndex,
  questionScore
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="flex items-start flex-1">
          <span className={`px-2 py-1 rounded mr-2 text-xs sm:text-sm font-medium flex-shrink-0 ${
            questionScore?.isCorrect === true 
              ? 'bg-green-100 text-green-800' 
              : questionScore?.isCorrect === false 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'
          }`}>
            Câu {questionIndex + 1}
          </span>
          <div className="text-sm sm:text-base lg:text-lg font-medium flex-1">
            <MathJax>{question.question}</MathJax>
          </div>
        </div>
        {questionScore && questionScore.maxScore > 0 && (
          <div className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold flex-shrink-0 ${
            questionScore.isCorrect === true
              ? 'bg-green-100 text-green-800'
              : questionScore.isCorrect === false
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {questionScore.score.toFixed(2)} / {questionScore.maxScore.toFixed(2)} điểm
          </div>
        )}
      </div>
      
      {/* Result indicator */}
      {questionScore && (
        <div className={`mb-2 sm:mb-3 p-2 sm:p-3 rounded-lg ${
          questionScore.isCorrect === true
            ? 'bg-green-50 border border-green-200'
            : questionScore.isCorrect === false
              ? 'bg-red-50 border border-red-200'
              : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center">
            {questionScore.isCorrect === true ? (
              <>
                <span className="text-green-600 text-base sm:text-lg mr-2">✓</span>
                <span className="text-green-800 font-medium text-xs sm:text-sm">Câu trả lời đúng</span>
              </>
            ) : questionScore.isCorrect === false ? (
              <>
                <span className="text-red-600 text-base sm:text-lg mr-2">✗</span>
                <span className="text-red-800 font-medium text-xs sm:text-sm">Câu trả lời sai</span>
              </>
            ) : (
              <>
                <span className="text-gray-600 text-base sm:text-lg mr-2">○</span>
                <span className="text-gray-800 font-medium text-xs sm:text-sm">Chưa trả lời</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionResultHeader;




