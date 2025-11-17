import React from 'react';
import { firestoreTimestampToDate } from '../utils';
import { Attempt } from '../types';

interface AttemptHistoryItemProps {
  attempt: Attempt;
  onViewClick: (attemptId: string) => void;
}

export const AttemptHistoryItem = React.memo<AttemptHistoryItemProps>(({ attempt, onViewClick }) => {
  const date = firestoreTimestampToDate(attempt.submittedAt);
  const formattedDate = date ? 
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : 'N/A';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 flex justify-between items-center">
      <div>
        <p className="font-medium">Lần thử #{attempt.attemptNumber || 'N/A'}</p>
        <p className="text-gray-600 text-sm">Nộp lúc: {formattedDate}</p>
        <p className="text-blue-600">Điểm: {attempt.score || 'N/A'}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (attempt.id) {
            onViewClick(attempt.id);
          }
        }}
        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        Xem chi tiết
      </button>
    </div>
  );
});

AttemptHistoryItem.displayName = 'AttemptHistoryItem';


