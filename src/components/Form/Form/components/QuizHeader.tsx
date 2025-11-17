import React from 'react';

interface QuizHeaderProps {
  title: string;
  remainingTime: number | null;
}

export const QuizHeader = React.memo<QuizHeaderProps>(({ title, remainingTime }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center">
        <h1 id="quiz_title" className="text-2xl font-bold text-gray-800">
          {title}
        </h1>
        {remainingTime !== null && (
          <div className="text-xl font-bold text-blue-600">
            Thời gian còn lại: {remainingTime} phút
          </div>
        )}
      </div>
    </div>
  );
});

QuizHeader.displayName = 'QuizHeader';


