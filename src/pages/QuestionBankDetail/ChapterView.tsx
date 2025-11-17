import React from 'react';
import { IoChevronDown, IoChevronForward, IoAddCircleOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import SubContentView from './SubContentView';
import type { Chapter } from './types';

interface ChapterViewProps {
  chapter: Chapter;
  chapterIndex: number;
  isExpanded: boolean;
  expandedSubContents: { [key: string]: boolean };
  onToggle: () => void;
  onAddSubContent: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSubContent: (key: string) => void;
  onEditSubContent: (subContentIndex: number) => void;
  onDeleteSubContent: (subContentIndex: number) => void;
  onAddRequirement: (subContentIndex: number, level: string) => void;
  onEditRequirement: (subContentIndex: number, level: string, itemIndex: number) => void;
  onDeleteRequirement: (subContentIndex: number, level: string, itemIndex: number) => void;
  onViewQuestions: (subContentIndex: number, level: string, itemIndex: number) => void;
}

const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  chapterIndex,
  isExpanded,
  expandedSubContents,
  onToggle,
  onAddSubContent,
  onEdit,
  onDelete,
  onToggleSubContent,
  onEditSubContent,
  onDeleteSubContent,
  onAddRequirement,
  onEditRequirement,
  onDeleteRequirement,
  onViewQuestions
}) => {
  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Chapter Header */}
      <div 
        className={`flex justify-between items-center p-3 cursor-pointer ${
          isExpanded ? "bg-gray-50" : ""
        }`}
      >
        <div className="flex-1" onClick={onToggle}>
          <h3 className="font-medium text-base">{chapter.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="text-blue-500 hover:text-blue-700 p-1"
            onClick={(e) => {
              e.stopPropagation();
              onAddSubContent();
            }}
            title="Thêm nội dung con"
          >
            <IoAddCircleOutline size={18} />
          </button>
          <button 
            className="text-blue-500 hover:text-blue-700 p-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Chỉnh sửa chương"
          >
            <MdEdit size={18} />
          </button>
          <button 
            className="text-red-500 hover:text-red-700 p-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Xóa chương"
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
      
      {/* Chapter Content - Sub Contents */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-2">
          <div className="flex justify-between items-center my-2">
            <span className="text-sm text-gray-600 font-medium">Nội dung con</span>
          </div>
          
          {chapter.subContents && chapter.subContents.length > 0 ? (
            <div className="ml-4 space-y-3 my-4">
              {chapter.subContents.map((subContent, subContentIndex) => (
                <SubContentView
                  key={`${chapterIndex}-${subContentIndex}`}
                  subContent={subContent}
                  chapterIndex={chapterIndex}
                  subContentIndex={subContentIndex}
                  isExpanded={expandedSubContents[`${chapterIndex}-${subContentIndex}`] || false}
                  onToggle={() => onToggleSubContent(`${chapterIndex}-${subContentIndex}`)}
                  onEdit={() => onEditSubContent(subContentIndex)}
                  onDelete={() => onDeleteSubContent(subContentIndex)}
                  onAddRequirement={(level) => onAddRequirement(subContentIndex, level)}
                  onEditRequirement={(level, itemIndex) => onEditRequirement(subContentIndex, level, itemIndex)}
                  onDeleteRequirement={(level, itemIndex) => onDeleteRequirement(subContentIndex, level, itemIndex)}
                  onViewQuestions={(level, itemIndex) => onViewQuestions(subContentIndex, level, itemIndex)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic ml-4 my-3">Không có nội dung con nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterView;




