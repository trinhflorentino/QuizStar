import React from 'react';

interface ResumeExamBannerProps {
  remainingTime: number;
}

export const ResumeExamBanner = React.memo<ResumeExamBannerProps>(({ remainingTime }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div>
          <p className="text-yellow-700">
            Bạn đang tiếp tục làm bài thi. Thời gian còn lại: {remainingTime} phút.
          </p>
        </div>
      </div>
    </div>
  );
});

ResumeExamBanner.displayName = 'ResumeExamBanner';


