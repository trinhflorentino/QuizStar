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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Kết quả bài thi</h1>
        
        {/* Score display */}
        <div className="bg-blue-50 p-8 rounded-lg text-center mb-8">
          <p className="text-xl mb-4 text-gray-700">Điểm số của bạn:</p>
          <p className="text-6xl font-bold text-blue-600 mb-2">
            {score.toFixed(2)} / {totalScore.toFixed(2)}
          </p>
          <p className="text-2xl text-gray-600">
            {percentage}%
          </p>
        </div>
        
        {/* Summary */}
        {questionResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              <p className="text-sm text-gray-600 mt-1">Câu đúng</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
              <p className="text-sm text-gray-600 mt-1">Câu sai</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-600">{unansweredCount}</p>
              <p className="text-sm text-gray-600 mt-1">Chưa làm</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{questionResults.length}</p>
              <p className="text-sm text-gray-600 mt-1">Tổng câu</p>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(`/pinverify/Form/${pin}/AnswerReview/${studentEmail}/${attemptId}`)}
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors text-lg"
          >
            Xem đáp án
          </button>
          <button
            onClick={() => navigate(`/pinverify/Form/${pin}`)}
            className="px-8 py-4 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-colors text-lg"
          >
            Trở về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultSummary;

