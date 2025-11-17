import React from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import type { RequirementItem, SubContent } from './types';

interface RequirementViewProps {
  items: RequirementItem[];
  levelName: string;
  level: string;
  subContent: SubContent;
  chapterIndex: number;
  subContentIndex: number;
  onAdd: () => void;
  onEdit: (item: RequirementItem, index: number) => void;
  onDelete: (item: RequirementItem, index: number) => void;
  onViewQuestions: (item: RequirementItem, index: number) => void;
}

const RequirementView: React.FC<RequirementViewProps> = ({
  items,
  levelName,
  level,
  subContent,
  chapterIndex,
  subContentIndex,
  onAdd,
  onEdit,
  onDelete,
  onViewQuestions
}) => {
  if (!items) items = [];
  
  // Count questions for each requirement item
  const requirements = subContent.requirements?.[level as keyof typeof subContent.requirements] || [];
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-medium text-sm text-gray-700">{levelName}</h5>
        <button 
          className="text-blue-500 hover:text-blue-700 p-1 flex items-center text-sm"
          onClick={onAdd}
          title={`Thêm yêu cầu ${levelName}`}
        >
          <IoAddCircleOutline className="mr-1" size={16} />
          <span>Thêm</span>
        </button>
      </div>
      
      <div className="space-y-2 ml-4">
        {items.length > 0 ? (
          items.map((item, index) => {
            // Count questions for this requirement item
            let questionCount = 0;
            let startIdx = index + 1;
            let endIdx = requirements.length;
            
            // Find the next template item
            for (let i = startIdx; i < requirements.length; i++) {
              const req = requirements[i];
              if (req && req._template) {
                endIdx = i;
                break;
              }
            }
            
            // Count questions in this range
            for (let i = startIdx; i < endIdx; i++) {
              const req = requirements[i];
              if (req && !req._template && req.questionId) {
                questionCount++;
              }
            }
            
            return (
              <div 
                key={index} 
                className={`p-2 rounded-md flex justify-between items-center ${
                  questionCount > 0 ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'bg-gray-50'
                }`}
                onClick={questionCount > 0 ? () => onViewQuestions(item, index) : undefined}
                title={questionCount > 0 ? `Click để xem ${questionCount} câu hỏi` : 'Chưa có câu hỏi'}
              >
                <div className="flex items-center gap-2 flex-1">
                  <p className="text-sm">
                    {item.description}
                  </p>
                  {questionCount > 0 && (
                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                      {questionCount} câu
                    </span>
                  )}
                </div>
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="text-blue-500 hover:text-blue-700 p-1 mr-1"
                    onClick={() => onEdit(item, index)}
                    title="Chỉnh sửa"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => onDelete(item, index)}
                    title="Xóa"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic text-sm">Chưa có yêu cầu nào.</p>
        )}
      </div>
    </div>
  );
};

export default RequirementView;




