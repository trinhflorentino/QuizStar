import React from 'react';
import { MathJax } from "better-react-mathjax";
import { MdDelete, MdEdit } from "react-icons/md";
import type { Question, SelectedRequirement } from './types';

interface QuestionViewModalProps {
  selectedRequirement: SelectedRequirement | null;
  requirementQuestions: Question[];
  selectedQuestions: Set<string>;
  onClose: () => void;
  onToggleSelection: (questionId: string) => void;
  onToggleSelectAll: () => void;
  onEditQuestion: (question: Question, index: number) => void;
  onDeleteQuestion: (question: Question) => void;
  onDeleteSelected: () => void;
}

const QuestionViewModal: React.FC<QuestionViewModalProps> = ({
  selectedRequirement,
  requirementQuestions,
  selectedQuestions,
  onClose,
  onToggleSelection,
  onToggleSelectAll,
  onEditQuestion,
  onDeleteQuestion,
  onDeleteSelected
}) => {
  if (!selectedRequirement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Câu hỏi đã import</h2>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">{selectedRequirement.chapterName}</span> - 
              <span className="font-medium"> {selectedRequirement.subContentName}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{selectedRequirement.levelName}:</span> {selectedRequirement.item.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedQuestions.size > 0 && (
              <button
                onClick={onDeleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-2"
              >
                <MdDelete size={16} />
                Xóa đã chọn ({selectedQuestions.size})
              </button>
            )}
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Select all checkbox */}
        {requirementQuestions.length > 0 && (
          <div className="mb-4 flex items-center gap-2 pb-3 border-b">
            <input
              type="checkbox"
              checked={selectedQuestions.size === requirementQuestions.length && requirementQuestions.length > 0}
              onChange={onToggleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700 cursor-pointer">
              Chọn tất cả ({requirementQuestions.length} câu)
            </label>
          </div>
        )}

        {requirementQuestions.length > 0 ? (
          <div className="space-y-4">
            {requirementQuestions.map((question, index) => (
              <div 
                key={question.questionId || index} 
                className={`border rounded-lg p-4 ${
                  selectedQuestions.has(question.questionId) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.has(question.questionId)}
                    onChange={() => onToggleSelection(question.questionId)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Câu {index + 1}</span>
                      <div className="flex items-center gap-2">
                        {question.importedFrom && (
                          <span className="text-xs text-gray-500">
                            Import từ: {question.importedFrom.examTitle}
                          </span>
                        )}
                        <button
                          onClick={() => onEditQuestion(question, index)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Sửa câu hỏi"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteQuestion(question)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Xóa câu hỏi"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Question text */}
                <div className="mb-3">
                  <MathJax>
                    <div 
                      className="text-sm text-gray-900"
                      dangerouslySetInnerHTML={{ __html: question.description || question.question || question.question_text || "Không có nội dung" }}
                    />
                  </MathJax>
                </div>

                {/* Question options if MCQ */}
                {question.formattedQuestion?.options && (
                  <div className="ml-4 space-y-1 mb-2">
                    {question.formattedQuestion.options.map((option, optIndex) => (
                      <div key={optIndex} className="text-sm text-gray-700">
                        {String.fromCharCode(65 + optIndex)}. {option.option || option.text}
                        {option.is_correct && (
                          <span className="ml-2 text-green-600 font-medium">✓ Đúng</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Classification metadata */}
                {question.classificationMeta && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 space-y-1">
                      {question.classificationMeta.suggestedByAI && (
                        <div>Được gợi ý bởi AI</div>
                      )}
                      {question.classificationMeta.manualOverride && (
                        <div>Được phân loại thủ công</div>
                      )}
                      {question.classificationMeta.suggestionReason && (
                        <div>Lý do: {question.classificationMeta.suggestionReason}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500 italic">
            Chưa có câu hỏi nào được import cho yêu cầu này.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionViewModal;




