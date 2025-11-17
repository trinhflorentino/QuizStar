import React from 'react';
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import RequirementView from './RequirementView';
import type { SubContent } from './types';

interface SubContentViewProps {
  subContent: SubContent;
  chapterIndex: number;
  subContentIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddRequirement: (level: string) => void;
  onEditRequirement: (level: string, itemIndex: number) => void;
  onDeleteRequirement: (level: string, itemIndex: number) => void;
  onViewQuestions: (level: string, itemIndex: number) => void;
}

const SubContentView: React.FC<SubContentViewProps> = ({
  subContent,
  chapterIndex,
  subContentIndex,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddRequirement,
  onEditRequirement,
  onDeleteRequirement,
  onViewQuestions
}) => {
  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Sub Content Header */}
      <div 
        className={`flex justify-between items-center p-3 cursor-pointer ${
          isExpanded ? "bg-gray-50" : ""
        }`}
      >
        <div className="flex-1" onClick={onToggle}>
          <h4 className="font-medium text-base">{subContent.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="text-blue-500 hover:text-blue-700 p-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Chỉnh sửa nội dung con"
          >
            <MdEdit size={18} />
          </button>
          <button 
            className="text-red-500 hover:text-red-700 p-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Xóa nội dung con"
          >
            <MdDelete size={18} />
          </button>
          <div className="text-gray-500" onClick={onToggle}>
            {isExpanded ? (
              <IoChevronDown size={18} />
            ) : (
              <IoChevronForward size={18} />
            )}
          </div>
        </div>
      </div>
      
      {/* Sub Content Requirements */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-3">
          <RequirementView
            items={subContent.requirements?.nhanBiet || []}
            levelName="Nhận biết"
            level="nhanBiet"
            subContent={subContent}
            chapterIndex={chapterIndex}
            subContentIndex={subContentIndex}
            onAdd={() => onAddRequirement('nhanBiet')}
            onEdit={(item, index) => onEditRequirement('nhanBiet', index)}
            onDelete={(item, index) => onDeleteRequirement('nhanBiet', index)}
            onViewQuestions={(item, index) => onViewQuestions('nhanBiet', index)}
          />
          <RequirementView
            items={subContent.requirements?.thongHieu || []}
            levelName="Thông hiểu"
            level="thongHieu"
            subContent={subContent}
            chapterIndex={chapterIndex}
            subContentIndex={subContentIndex}
            onAdd={() => onAddRequirement('thongHieu')}
            onEdit={(item, index) => onEditRequirement('thongHieu', index)}
            onDelete={(item, index) => onDeleteRequirement('thongHieu', index)}
            onViewQuestions={(item, index) => onViewQuestions('thongHieu', index)}
          />
          <RequirementView
            items={subContent.requirements?.vanDung || []}
            levelName="Vận dụng"
            level="vanDung"
            subContent={subContent}
            chapterIndex={chapterIndex}
            subContentIndex={subContentIndex}
            onAdd={() => onAddRequirement('vanDung')}
            onEdit={(item, index) => onEditRequirement('vanDung', index)}
            onDelete={(item, index) => onDeleteRequirement('vanDung', index)}
            onViewQuestions={(item, index) => onViewQuestions('vanDung', index)}
          />
          <RequirementView
            items={subContent.requirements?.vanDungCao || []}
            levelName="Vận dụng cao"
            level="vanDungCao"
            subContent={subContent}
            chapterIndex={chapterIndex}
            subContentIndex={subContentIndex}
            onAdd={() => onAddRequirement('vanDungCao')}
            onEdit={(item, index) => onEditRequirement('vanDungCao', index)}
            onDelete={(item, index) => onDeleteRequirement('vanDungCao', index)}
            onViewQuestions={(item, index) => onViewQuestions('vanDungCao', index)}
          />
          
          {!subContent.requirements?.nhanBiet?.length && 
          !subContent.requirements?.thongHieu?.length && 
          !subContent.requirements?.vanDung?.length && 
          !subContent.requirements?.vanDungCao?.length && (
            <p className="text-gray-500 italic">Không có yêu cầu nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SubContentView;




