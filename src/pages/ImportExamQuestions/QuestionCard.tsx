import React from 'react';
import { MathJax } from "better-react-mathjax";
import type { QuestionMapping, QuestionBank } from './types';
import RequirementSelector from './RequirementSelector';

interface QuestionCardProps {
  mapping: QuestionMapping;
  index: number;
  questionBank: QuestionBank | null;
  expandedRequirements: { [key: string]: boolean };
  expandedSubContents: { [key: string]: boolean };
  expandedRequirementLevels: { [key: string]: boolean };
  onToggleSelection: (questionId: string) => void;
  onToggleRequirementSelection: (questionId: string) => void;
  onToggleSubContent: (chapterIndex: number, subContentIndex: number) => void;
  onToggleRequirementLevel: (chapterIndex: number, subContentIndex: number, requirement: string) => void;
  onSelectRequirement: (questionId: string, chapterIndex: number, subContentIndex: number, requirement: string, itemIndex?: number) => void;
  onApplySuggestion: (questionId: string) => void;
  isValidSuggestion: (suggestion: any) => boolean;
}

const REQUIREMENT_LABELS: { [key: string]: string } = {
  nhanBiet: 'Nhận biết',
  thongHieu: 'Thông hiểu',
  vanDung: 'Vận dụng',
  vanDungCao: 'Vận dụng cao'
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  mapping,
  index,
  questionBank,
  expandedRequirements,
  expandedSubContents,
  expandedRequirementLevels,
  onToggleSelection,
  onToggleRequirementSelection,
  onToggleSubContent,
  onToggleRequirementLevel,
  onSelectRequirement,
  onApplySuggestion,
  isValidSuggestion
}) => {
  const isExpanded = expandedRequirements[mapping.question.id];

  return (
    <div 
      className={`border rounded-lg ${mapping.selected ? "border-blue-200" : "border-gray-200"}`}
    >
      <div className="p-2.5 flex items-start gap-2">
        <input
          type="checkbox"
          checked={mapping.selected}
          onChange={() => onToggleSelection(mapping.question.id)}
          disabled={!mapping.requirement || mapping.chapterIndex === null || mapping.subContentIndex === null}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          title={!mapping.requirement ? "Vui lòng phân loại câu hỏi trước khi chọn" : ""}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-sm font-medium text-gray-700">Câu {index + 1}</span>
            <button
              onClick={() => onToggleRequirementSelection(mapping.question.id)}
              className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
            >
              {mapping.requirement ? "Đổi vị trí" : "Chọn vị trí"}
            </button>
          </div>

          {/* Question text - compact */}
          <div className={`text-sm ${mapping.selected ? "text-gray-900" : "text-gray-500"} line-clamp-2`}>
            {mapping.question.originalFormat ? (
              <MathJax>
                <div dangerouslySetInnerHTML={{ __html: mapping.question.question_text }} />
              </MathJax>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: mapping.question.question_text || "Không có nội dung" }} />
            )}
          </div>

          {/* Classification info - compact */}
          <div className="mt-1.5 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {mapping.requirement && mapping.chapterIndex !== null && mapping.subContentIndex !== null ? (
                <>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                    {REQUIREMENT_LABELS[mapping.requirement]}
                  </span>
                  {mapping.chapterIndex !== null && mapping.subContentIndex !== null && questionBank?.chapters?.[mapping.chapterIndex]?.subContents?.[mapping.subContentIndex]?.name && (
                    <span className="text-gray-600 truncate max-w-[200px]">
                      {questionBank.chapters[mapping.chapterIndex]?.subContents?.[mapping.subContentIndex]?.name}
                    </span>
                  )}
                  {(() => {
                    // Try to get requirement item description
                    if (mapping.itemIndex !== null && mapping.itemIndex !== undefined && mapping.chapterIndex !== null && mapping.subContentIndex !== null && mapping.requirement) {
                      const chapter = questionBank?.chapters?.[mapping.chapterIndex];
                      const subContent = chapter?.subContents?.[mapping.subContentIndex];
                      const requirementsObj = subContent?.requirements;
                      if (requirementsObj) {
                        const requirements = (requirementsObj[mapping.requirement as keyof typeof requirementsObj] || []) as any[];
                        const selectedRequirement = requirements[mapping.itemIndex];
                        if (selectedRequirement && selectedRequirement._template) {
                          const reqDescription = selectedRequirement.description || selectedRequirement.question || selectedRequirement.question_text;
                          if (reqDescription) {
                            return (
                              <span className="text-gray-700 font-medium truncate max-w-[300px]" title={reqDescription}>
                                • {reqDescription}
                              </span>
                            );
                          }
                        }
                      }
                    }
                    return null;
                  })()}
                  {mapping.aiSuggestion && isValidSuggestion(mapping.aiSuggestion) && mapping.manualOverride && (
                    <button
                      className="text-blue-600 hover:text-blue-800 underline text-xs"
                      onClick={() => onApplySuggestion(mapping.question.id)}
                    >
                      Dùng gợi ý AI
                    </button>
                  )}
                </>
              ) : (
                <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">
                  ⚠️ Chưa phân loại - Vui lòng chọn vị trí
                </span>
              )}
            </div>
            {/* AI reason display */}
            {mapping.aiSuggestion?.reason && (
              <div className="text-[11px] text-gray-500 italic bg-gray-50 px-2 py-1 rounded border-l-2 border-gray-300">
                <span className="font-medium text-gray-600">Lý do: </span>
                {mapping.aiSuggestion.reason}
              </div>
            )}
          </div>

          {/* Requirements selection modal - expanded when clicked */}
          {isExpanded && (
            <RequirementSelector
              questionId={mapping.question.id}
              mapping={mapping}
              questionBank={questionBank}
              expandedSubContents={expandedSubContents}
              expandedRequirementLevels={expandedRequirementLevels}
              onToggleSubContent={onToggleSubContent}
              onToggleRequirementLevel={onToggleRequirementLevel}
              onSelectRequirement={onSelectRequirement}
              onClose={() => onToggleRequirementSelection(mapping.question.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

