import React from 'react';
import type { QuestionScore } from './types';

interface ScoreSummaryProps {
  score: string;
  scoreQ?: string;
  scoreAll?: string;
  questionScores: QuestionScore[];
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ 
  score, 
  scoreQ, 
  scoreAll, 
  questionScores 
}) => {
  const displayScore = score || (scoreQ && scoreAll 
    ? `${parseFloat(scoreQ).toFixed(2)} / ${parseFloat(scoreAll).toFixed(2)}`
    : '0 / 0');

  return (
    <>
      <div className="mb-4 sm:mb-6">
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
          <p className="text-base sm:text-lg mb-2">Điểm số của bạn:</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
            {displayScore}
          </p>
        </div>
      </div>
      
      {questionScores.length > 0 ? (
        <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Tổng hợp kết quả</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {questionScores.filter(q => q.isCorrect === true).length}
              </p>
              <p className="text-sm text-gray-600">Câu đúng</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {questionScores.filter(q => q.isCorrect === false).length}
              </p>
              <p className="text-sm text-gray-600">Câu sai</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {questionScores.filter(q => q.isCorrect === null).length}
              </p>
              <p className="text-sm text-gray-600">Chưa làm</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {questionScores.reduce((sum, q) => sum + q.score, 0).toFixed(2)} / {questionScores.reduce((sum, q) => sum + q.maxScore, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Tổng điểm</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ScoreSummary;




