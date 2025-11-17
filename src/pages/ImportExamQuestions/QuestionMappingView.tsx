    import React from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MathJaxContext } from "better-react-mathjax";
import QuestionCard from './QuestionCard';
import CoverageSummary from './CoverageSummary';
import type { QuestionMapping, QuestionBank, CoverageSummary as CoverageSummaryType, Exam } from './types';

interface QuestionMappingViewProps {
  selectedExam: Exam | null;
  questionsToImport: QuestionMapping[];
  questionBank: QuestionBank | null;
  coverage: CoverageSummaryType;
  suggestionsLoading: boolean;
  importing: boolean;
  expandedRequirements: { [key: string]: boolean };
  expandedSubContents: { [key: string]: boolean };
  expandedRequirementLevels: { [key: string]: boolean };
  onBack: () => void;
  onImport: () => void;
  onToggleSelection: (questionId: string) => void;
  onToggleRequirementSelection: (questionId: string) => void;
  onToggleSubContent: (chapterIndex: number, subContentIndex: number) => void;
  onToggleRequirementLevel: (chapterIndex: number, subContentIndex: number, requirement: string) => void;
  onSelectRequirement: (questionId: string, chapterIndex: number, subContentIndex: number, requirement: string, itemIndex?: number) => void;
  onApplySuggestion: (questionId: string) => void;
  isValidSuggestion: (suggestion: any) => boolean;
}

const QuestionMappingView: React.FC<QuestionMappingViewProps> = ({
  selectedExam,
  questionsToImport,
  questionBank,
  coverage,
  suggestionsLoading,
  importing,
  expandedRequirements,
  expandedSubContents,
  expandedRequirementLevels,
  onBack,
  onImport,
  onToggleSelection,
  onToggleRequirementSelection,
  onToggleSubContent,
  onToggleRequirementLevel,
  onSelectRequirement,
  onApplySuggestion,
  isValidSuggestion
}) => {
  const selectedCount = questionsToImport.filter(q => q.selected).length;
  const totalCount = questionsToImport.length;
  const selectedPercentage = totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;

  return (
    <MathJaxContext>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {selectedExam?.quiz_title}
          </h2>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">{selectedCount}</span> / {totalCount} câu hỏi
            <span className="ml-2 text-blue-600 font-medium">({selectedPercentage}%)</span>
          </div>
        </div>

        {suggestionsLoading && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 flex items-center">
            <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
            Đang phân loại bằng AI...
          </div>
        )}

        <div className="mb-3 flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
          >
            <FaArrowLeft className="mr-1.5 text-xs" />
            Chọn đề khác
          </button>

          <button
            onClick={onImport}
            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={importing || selectedCount === 0}
          >
            {importing ? (
              <>
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Đang import...
              </>
            ) : (
              <>
                <FaArrowRight className="mr-1.5 text-xs" />
                Import {selectedCount} câu
              </>
            )}
          </button>
        </div>

        {/* Two column layout: Questions on left, Matrix on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Questions list */}
          <div className="lg:col-span-2 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {questionsToImport.map((mapping, index) => (
              <QuestionCard
                key={mapping.question.id}
                mapping={mapping}
                index={index}
                questionBank={questionBank}
                expandedRequirements={expandedRequirements}
                expandedSubContents={expandedSubContents}
                expandedRequirementLevels={expandedRequirementLevels}
                onToggleSelection={onToggleSelection}
                onToggleRequirementSelection={onToggleRequirementSelection}
                onToggleSubContent={onToggleSubContent}
                onToggleRequirementLevel={onToggleRequirementLevel}
                onSelectRequirement={onSelectRequirement}
                onApplySuggestion={onApplySuggestion}
                isValidSuggestion={isValidSuggestion}
              />
            ))}
            
            {questionsToImport.length === 0 && (
              <div className="text-center p-8 text-gray-500 italic">
                Không tìm thấy câu hỏi nào trong đề thi này.
              </div>
            )}
          </div>

          {/* Right column: Matrix/Specification Summary */}
          <div className="lg:col-span-1">
            <CoverageSummary
              coverage={coverage}
              questionBank={questionBank}
              questionsToImport={questionsToImport}
              selectedCount={selectedCount}
              totalCount={totalCount}
              selectedPercentage={selectedPercentage}
            />
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default QuestionMappingView;




