import React from 'react';
import type { QuestionBank } from './types';

interface MatrixSourceInfoProps {
  questionBank: QuestionBank;
  isReanalyzing: boolean;
  reanalyzeError: string | null;
  onReanalyze: () => void;
  formatTimestamp: (value: any) => string;
}

const MatrixSourceInfo: React.FC<MatrixSourceInfoProps> = ({
  questionBank,
  isReanalyzing,
  reanalyzeError,
  onReanalyze,
  formatTimestamp
}) => {
  if (!questionBank.matrixSource) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">Thông tin phân tích</h2>
          <p className="text-sm text-gray-500 mt-1">
            Nguồn: {questionBank.filename || questionBank.matrixSource.filename || "Không xác định"}
          </p>
        </div>
        <button
          onClick={onReanalyze}
          disabled={isReanalyzing}
          className={`px-3 py-1.5 rounded text-sm border ${
            isReanalyzing ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
          }`}
        >
          {isReanalyzing ? "Đang phân tích lại..." : "Phân tích lại bằng AI"}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-medium">Phiên bản prompt:</span> {questionBank.matrixSource.promptVersion || "Không rõ"}
        </div>
        <div>
          <span className="font-medium">Phân tích gần nhất:</span> {formatTimestamp(questionBank.matrixSource.processedAt || questionBank.createdAt)}
        </div>
        {questionBank.matrixSource.reanalyzedAt && (
          <div>
            <span className="font-medium">Phân tích lại:</span> {formatTimestamp(questionBank.matrixSource.reanalyzedAt)}
          </div>
        )}
        {questionBank.matrixTemplate && (
          <div>
            <span className="font-medium">Số chương trong mẫu:</span> {questionBank.matrixTemplate.length}
          </div>
        )}
      </div>
      {reanalyzeError && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded p-3">
          {reanalyzeError}
        </div>
      )}
    </div>
  );
};

export default MatrixSourceInfo;




