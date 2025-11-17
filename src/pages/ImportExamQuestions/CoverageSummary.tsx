import React from 'react';
import type { CoverageSummary, QuestionBank, QuestionMapping } from './types';

interface CoverageSummaryProps {
  coverage: CoverageSummary;
  questionBank: QuestionBank | null;
  questionsToImport: QuestionMapping[];
  selectedCount: number;
  totalCount: number;
  selectedPercentage: number;
}

const REQUIREMENT_LABELS: { [key: string]: string } = {
  nhanBiet: 'Nhận biết',
  thongHieu: 'Thông hiểu',
  vanDung: 'Vận dụng',
  vanDungCao: 'Vận dụng cao'
};

const CoverageSummaryComponent: React.FC<CoverageSummaryProps> = ({
  coverage,
  questionBank,
  questionsToImport,
  selectedCount,
  totalCount,
  selectedPercentage
}) => {
  return (
    <div className="sticky top-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Độ phủ ma trận</h3>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {coverage.summary && coverage.summary.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {coverage.summary
              .filter(item => item.incoming > 0)
              .map((item, index) => {
                // Get requirement items for this level
                const chapter = questionBank?.chapters?.[item.chapterIndex];
                const subContent = chapter?.subContents?.[item.subContentIndex];
                const requirements = (subContent?.requirements?.[item.requirement as keyof typeof subContent.requirements] || []) as any[];
                
                // Get selected questions for this requirement level
                const selectedQuestionsForThisLevel = questionsToImport.filter(q => 
                  q.selected && 
                  q.chapterIndex === item.chapterIndex &&
                  q.subContentIndex === item.subContentIndex &&
                  q.requirement === item.requirement
                );

                // Build a map of template index to question count
                const templateIndices: Array<{ index: number; description: string }> = [];
                requirements.forEach((req: any, reqIndex: number) => {
                  if (req && req._template && req.description) {
                    templateIndices.push({ index: reqIndex, description: req.description });
                  }
                });
                
                // Count questions between templates
                const requirementsWithCounts = templateIndices.map((template, templateIdx) => {
                  const startIdx = template.index + 1;
                  const endIdx = templateIdx < templateIndices.length - 1 
                    ? templateIndices[templateIdx + 1].index 
                    : requirements.length;
                  
                  // Count questions in this range
                  let questionCount = 0;
                  for (let i = startIdx; i < endIdx; i++) {
                    const reqItem = requirements[i];
                    if (reqItem && !reqItem._template && reqItem.questionId) {
                      questionCount++;
                    }
                  }
                  
                  return {
                    name: template.description,
                    existingCount: questionCount
                  };
                }).filter(req => req.existingCount > 0); // Only show requirements with questions

                return (
                  <div key={`${item.chapterIndex}-${item.subContentIndex}-${item.requirement}-${index}`} className="p-2.5 hover:bg-gray-50">
                    <div className="text-xs font-medium text-gray-700 mb-1 truncate" title={item.subContentName}>
                      {item.subContentName}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">
                          {REQUIREMENT_LABELS[item.requirement]}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-600">{item.existing}</span>
                          <span className="text-green-600 font-medium">+{item.incoming}</span>
                        </div>
                      </div>
                      {requirementsWithCounts.length > 0 && (
                        <div className="text-[10px] text-gray-400 space-y-0.5 pl-2">
                          {requirementsWithCounts.length <= 5 ? (
                            // Show all if 5 or fewer
                            requirementsWithCounts.map((req, idx) => (
                              <div key={idx} className="flex items-center justify-between truncate">
                                <span className="truncate flex-1">• {req.name}</span>
                                <span className="text-gray-500 ml-2 flex-shrink-0">
                                  ({req.existingCount} câu)
                                </span>
                              </div>
                            ))
                          ) : (
                            // Show first 3 if more than 5
                            <>
                              {requirementsWithCounts.slice(0, 3).map((req, idx) => (
                                <div key={idx} className="flex items-center justify-between truncate">
                                  <span className="truncate flex-1">• {req.name}</span>
                                  <span className="text-gray-500 ml-2 flex-shrink-0">
                                    ({req.existingCount} câu)
                                  </span>
                                </div>
                              ))}
                              <div className="text-gray-500 italic px-1">
                                ... và {requirementsWithCounts.length - 3} yêu cầu khác
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-gray-500">
            Chưa có câu hỏi được chọn
          </div>
        )}
      </div>

      {/* Summary stats */}
      {selectedCount > 0 && (
        <div className="p-3 bg-blue-50 border-t border-blue-100">
          <div className="text-xs text-blue-800">
            <div className="flex justify-between mb-1">
              <span>Tổng câu hỏi:</span>
              <span className="font-semibold">{selectedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>% đề thi:</span>
              <span className="font-semibold">{selectedPercentage}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageSummaryComponent;

