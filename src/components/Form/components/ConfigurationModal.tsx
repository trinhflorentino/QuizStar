import React from 'react';
import ScoreDistribution from './ScoreDistribution';

interface ScoreDistributionData {
  mcq: {
    count: number;
    totalScore: number;
  };
  truefalse: {
    count: number;
    totalScore: number;
  };
  shortanswer: {
    count: number;
    totalScore: number;
  };
}

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  duration: number;
  onDurationChange: (duration: number) => void;
  scoreDistribution: ScoreDistributionData;
  onScoreChange: (type: 'mcq' | 'truefalse' | 'shortanswer', event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ 
  isOpen, 
  onClose, 
  duration, 
  onDurationChange, 
  scoreDistribution, 
  onScoreChange 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Cấu hình bài thi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Đóng (Esc)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Thời gian làm bài (phút):
          </label>
          <input 
            type="number"
            min="1"
            value={duration ?? 45}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 45)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="45"
          />
        </div>
        
        <ScoreDistribution 
          scoreDistribution={scoreDistribution} 
          onScoreChange={onScoreChange} 
        />
        
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationModal;




