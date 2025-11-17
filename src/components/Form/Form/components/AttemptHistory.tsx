import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AttemptHistoryItem } from './AttemptHistoryItem';
import { Attempt } from '../types';

interface AttemptHistoryProps {
  attempts: Attempt[];
  pin: string | undefined;
  userEmail: string;
  onRetakeClick: () => void;
}

export const AttemptHistory = React.memo<AttemptHistoryProps>(({ attempts, pin, userEmail, onRetakeClick }) => {
  const navigate = useNavigate();
  const sortedAttempts = [...attempts].sort((a, b) => 
    (b.attemptNumber || 0) - (a.attemptNumber || 0)
  );
  
  const handleViewClick = (attemptId: string) => {
    if (pin && attemptId && userEmail) {
      navigate(`/pinverify/Form/${pin}/ResultFetch/${userEmail}/${attemptId}`);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Lịch sử làm bài</h2>
          <button
            onClick={onRetakeClick}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2"
            title="Quay lại"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {sortedAttempts.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg">Chưa có lần thi nào được hoàn thành.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAttempts.map(attempt => (
              <AttemptHistoryItem 
                key={attempt.id} 
                attempt={attempt} 
                onViewClick={handleViewClick}
              />
            ))}
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={onRetakeClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Làm lại bài thi
          </button>
        </div>
      </div>
    </div>
  );
});

AttemptHistory.displayName = 'AttemptHistory';


