import React from 'react';

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

interface ScoreDistributionProps {
  scoreDistribution: ScoreDistributionData;
  onScoreChange: (type: 'mcq' | 'truefalse' | 'shortanswer', event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ScoreDistribution: React.FC<ScoreDistributionProps> = ({ scoreDistribution, onScoreChange }) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Phân bố điểm</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded-md border border-gray-200">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Trắc nghiệm ({scoreDistribution.mcq.count} câu):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.25"
              value={scoreDistribution.mcq.totalScore ?? 0}
              onChange={(e) => onScoreChange('mcq', e)}
              className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tổng điểm"
            />
            <span className="text-sm text-gray-600">
              {scoreDistribution.mcq.count > 0 ? 
                `Điểm/câu: ${(scoreDistribution.mcq.totalScore / scoreDistribution.mcq.count).toFixed(2)}` 
                : 'Chưa có câu hỏi'}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-md border border-gray-200">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Đúng/Sai ({scoreDistribution.truefalse.count} câu):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.25"
              value={scoreDistribution.truefalse.totalScore ?? 0}
              onChange={(e) => onScoreChange('truefalse', e)}
              className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tổng điểm"
            />
            <span className="text-sm text-gray-600">
              {scoreDistribution.truefalse.count > 0 ? 
                `Điểm/câu: ${(scoreDistribution.truefalse.totalScore / scoreDistribution.truefalse.count).toFixed(2)}` 
                : 'Chưa có câu hỏi'}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-md border border-gray-200">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Trả lời ngắn ({scoreDistribution.shortanswer.count} câu):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.25"
              value={scoreDistribution.shortanswer.totalScore ?? 0}
              onChange={(e) => onScoreChange('shortanswer', e)}
              className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tổng điểm"
            />
            <span className="text-sm text-gray-600">
              {scoreDistribution.shortanswer.count > 0 ? 
                `Điểm/câu: ${(scoreDistribution.shortanswer.totalScore / scoreDistribution.shortanswer.count).toFixed(2)}` 
                : 'Chưa có câu hỏi'}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-300 text-right">
        <span className="text-sm font-semibold text-gray-800">
          Tổng điểm: {
            (scoreDistribution.mcq.totalScore +
            scoreDistribution.truefalse.totalScore +
            scoreDistribution.shortanswer.totalScore).toFixed(2)
          }
        </span>
      </div>
    </div>
  );
};

export default ScoreDistribution;




