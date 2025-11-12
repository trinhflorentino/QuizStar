import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ResultSummary() {
  const { pin, studentEmail, attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { score = 0, totalScore = 0, questionResults = [] } = location.state || {};
  
  const correctCount = questionResults.filter(q => q.isCorrect === true).length;
  const incorrectCount = questionResults.filter(q => q.isCorrect === false).length;
  const unansweredCount = questionResults.filter(q => q.isCorrect === null).length;
  const percentage = totalScore > 0 ? ((score / totalScore) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">Kết quả bài thi</h1>
        
        {/* Score display */}
        <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-lg text-center mb-6 sm:mb-8">
          <p className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-gray-700">Điểm số của bạn:</p>
          <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 mb-2 break-words">
            {score.toFixed(2)} / {totalScore.toFixed(2)}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-600">
            {percentage}%
          </p>
        </div>
        
        {/* Summary statistics */}
        {questionResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{correctCount}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Câu đúng</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{incorrectCount}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Câu sai</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-gray-600">{unansweredCount}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Chưa làm</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{questionResults.length}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Tổng câu</p>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <button
            onClick={() => navigate(`/pinverify/Form/${pin}`)}
            className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 active:bg-gray-800 transition-colors text-base sm:text-lg"
          >
            Về trang chính
          </button>
          <button
            onClick={() => navigate(`/pinverify/Form/${pin}/ResultFetch/${studentEmail}/${attemptId}`)}
            className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 active:bg-green-800 transition-colors text-base sm:text-lg"
          >
            Xem bài làm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultSummary;



