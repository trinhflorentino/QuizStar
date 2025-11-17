import React from 'react';

interface StepNavigationProps {
  currentStep: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep }) => {
  return (
    <div className="flex mb-8 border-b pb-4">
      <div className={`flex-1 text-center ${currentStep === 1 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mb-2`}>
            1
          </div>
          <span>Chọn đề thi</span>
        </div>
      </div>
      <div className="w-10 flex items-center justify-center">
        <div className="h-1 w-full bg-gray-300"></div>
      </div>
      <div className={`flex-1 text-center ${currentStep === 2 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mb-2`}>
            2
          </div>
          <span>Chọn câu hỏi và yêu cầu</span>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;




