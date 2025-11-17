import React from 'react';
import type { Chapter } from './types';

interface ReanalyzePreview {
  cleanResult: {
    title: string;
    chapters?: Chapter[];
  };
  rawResponse?: string;
  prompt?: string;
}

interface ReanalyzeModalProps {
  preview: ReanalyzePreview | null;
  onClose: () => void;
  onApply: () => void;
}

const ReanalyzeModal: React.FC<ReanalyzeModalProps> = ({
  preview,
  onClose,
  onApply
}) => {
  if (!preview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">Cập nhật cấu trúc từ phân tích mới</h2>
            <p className="text-sm text-gray-500 mt-1">
              Đề xuất tiêu đề: <span className="font-medium">{preview.cleanResult.title}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4 mb-6">
          {preview.cleanResult.chapters?.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border border-gray-200 rounded-lg">
              <div className="px-4 py-2 bg-gray-100 font-semibold">
                Chương {chapterIndex + 1}: {chapter.name}
              </div>
              <div className="p-4 space-y-3 text-sm">
                {chapter.subContents?.map((sub, subIndex) => (
                  <div key={subIndex} className="border border-gray-100 rounded-lg p-3">
                    <div className="font-medium text-gray-800 mb-2">
                      {chapterIndex + 1}.{subIndex + 1} {sub.name}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {Object.entries(sub.requirements || {}).map(([level, items]) => (
                        <div key={level} className="bg-gray-50 border border-gray-100 rounded p-2">
                          <div className="uppercase tracking-wide text-[11px] text-gray-500">{level}</div>
                          <div className="mt-1 text-gray-700">{(items as any[])?.length || 0} yêu cầu</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded p-3 mb-4">
          Việc áp dụng sẽ giữ nguyên các câu hỏi hiện có và thêm lại mô tả yêu cầu từ bản phân tích mới.
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Áp dụng cấu trúc mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReanalyzeModal;




