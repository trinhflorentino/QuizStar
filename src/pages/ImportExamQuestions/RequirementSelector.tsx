import React from 'react';
import type { QuestionBank, QuestionMapping } from './types';

interface RequirementSelectorProps {
  questionId: string;
  mapping: QuestionMapping;
  questionBank: QuestionBank | null;
  expandedSubContents: { [key: string]: boolean };
  expandedRequirementLevels: { [key: string]: boolean };
  onToggleSubContent: (chapterIndex: number, subContentIndex: number) => void;
  onToggleRequirementLevel: (chapterIndex: number, subContentIndex: number, requirement: string) => void;
  onSelectRequirement: (questionId: string, chapterIndex: number, subContentIndex: number, requirement: string, itemIndex?: number) => void;
  onClose: () => void;
}

const REQUIREMENT_KEYS = ['nhanBiet', 'thongHieu', 'vanDung', 'vanDungCao'];
const REQUIREMENT_LABELS: { [key: string]: string } = {
  nhanBiet: 'Nhận biết',
  thongHieu: 'Thông hiểu',
  vanDung: 'Vận dụng',
  vanDungCao: 'Vận dụng cao'
};

const RequirementSelector: React.FC<RequirementSelectorProps> = ({
  questionId,
  mapping,
  questionBank,
  expandedSubContents,
  expandedRequirementLevels,
  onToggleSubContent,
  onToggleRequirementLevel,
  onSelectRequirement,
  onClose
}) => {
  if (!questionBank || !questionBank.chapters) return null;

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Chọn vị trí phân loại</h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Đóng
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {questionBank.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="border border-gray-200 rounded-lg">
            <div className="px-4 py-2 bg-gray-100 font-semibold text-sm">
              Chương {chapterIndex + 1}: {chapter.name}
            </div>

            {chapter.subContents && chapter.subContents.length > 0 ? (
              <div className="p-4 space-y-2 text-sm">
                {chapter.subContents.map((subContent, subContentIndex) => {
                  const subContentKey = `${chapterIndex}-${subContentIndex}`;
                  const isSubContentExpanded = expandedSubContents[subContentKey];
                  const isSubContentSelected = mapping.chapterIndex === chapterIndex &&
                    mapping.subContentIndex === subContentIndex;

                  return (
                    <div key={subContentIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* SubContent header - clickable to expand */}
                      <button
                        className={`w-full text-left p-3 transition-colors flex items-center justify-between ${
                          isSubContentSelected
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => onToggleSubContent(chapterIndex, subContentIndex)}
                      >
                        <div className="font-medium text-gray-800 text-sm">
                          {chapterIndex + 1}.{subContentIndex + 1} {subContent.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {isSubContentExpanded ? '▼' : '▶'}
                        </div>
                      </button>

                      {/* Expanded requirement levels */}
                      {isSubContentExpanded && (
                        <div className="border-t border-gray-200 bg-white">
                          <div className="p-2 space-y-1">
                            {REQUIREMENT_KEYS.map(reqKey => {
                              const levelKey = `${chapterIndex}-${subContentIndex}-${reqKey}`;
                              const isLevelExpanded = expandedRequirementLevels[levelKey];
                              const requirements = (subContent.requirements?.[reqKey as keyof typeof subContent.requirements] || []) as any[];
                              const requirementCount = requirements.length;
                              const isLevelSelected = mapping.chapterIndex === chapterIndex &&
                                mapping.subContentIndex === subContentIndex &&
                                mapping.requirement === reqKey;

                              if (requirementCount === 0) {
                                return null; // Skip empty requirement levels
                              }

                              return (
                                <div key={reqKey} className="border border-gray-200 rounded overflow-hidden">
                                  {/* Requirement level header - clickable to expand */}
                                  <button
                                    className={`w-full text-left p-2 transition-colors flex items-center justify-between ${
                                      isLevelSelected
                                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                    onClick={() => onToggleRequirementLevel(chapterIndex, subContentIndex, reqKey)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="uppercase tracking-wide text-[11px] text-gray-500">
                                        {REQUIREMENT_LABELS[reqKey]}
                                      </span>
                                      <span className="text-gray-600 text-xs">
                                        ({requirementCount} yêu cầu)
                                      </span>
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {isLevelExpanded ? '▼' : '▶'}
                                    </div>
                                  </button>

                                  {/* Expanded requirement items */}
                                  {isLevelExpanded && requirements.length > 0 && (
                                    <div className="border-t border-gray-200 bg-white">
                                      <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                        {requirements.map((req: any, reqIndex: number) => {
                                          // Only show template items (requirements with _template flag)
                                          if (!req._template) return null;
                                          
                                          const reqDescription = req.description || req.question || req.question_text || `Yêu cầu ${reqIndex + 1}`;
                                          // Check if this specific item is selected
                                          const isItemSelected = mapping.chapterIndex === chapterIndex &&
                                            mapping.subContentIndex === subContentIndex &&
                                            mapping.requirement === reqKey &&
                                            mapping.itemIndex === reqIndex;

                                          return (
                                            <button
                                              key={reqIndex}
                                              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                                                isItemSelected
                                                  ? 'bg-blue-50 border border-blue-200 text-blue-700'
                                                  : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                              }`}
                                              onClick={() => onSelectRequirement(questionId, chapterIndex, subContentIndex, reqKey, reqIndex)}
                                            >
                                              <div className="text-gray-700">
                                                • {reqDescription}
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-gray-500 italic text-sm text-center">
                Không có nội dung
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequirementSelector;

