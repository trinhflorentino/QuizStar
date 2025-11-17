import React from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import ChapterView from '../ChapterView';
import type { QuestionBank } from '../types';

interface ChaptersListProps {
  questionBank: QuestionBank;
  expandedChapters: { [key: number]: boolean };
  expandedSubContents: { [key: string]: boolean };
  onToggleChapter: (chapterIndex: number) => void;
  onToggleSubContent: (key: string) => void;
  onAddChapter: () => void;
  onAddSubContent: (chapterIndex: number) => void;
  onEditChapter: (chapter: any, chapterIndex: number) => void;
  onDeleteChapter: (chapter: any, chapterIndex: number) => void;
  onEditSubContent: (subContent: any, chapterIndex: number, subContentIndex: number) => void;
  onDeleteSubContent: (subContent: any, chapterIndex: number, subContentIndex: number) => void;
  onAddRequirement: (chapterIndex: number, subContentIndex: number, level: string) => void;
  onEditRequirement: (item: any, chapterIndex: number, subContentIndex: number, level: string, itemIndex: number) => void;
  onDeleteRequirement: (item: any, chapterIndex: number, subContentIndex: number, level: string, itemIndex: number) => void;
  onViewQuestions: (item: any, levelName: string, level: string, chapterIndex: number, subContentIndex: number, itemIndex: number) => void;
}

const ChaptersList: React.FC<ChaptersListProps> = ({
  questionBank,
  expandedChapters,
  expandedSubContents,
  onToggleChapter,
  onToggleSubContent,
  onAddChapter,
  onAddSubContent,
  onEditChapter,
  onDeleteChapter,
  onEditSubContent,
  onDeleteSubContent,
  onAddRequirement,
  onEditRequirement,
  onDeleteRequirement,
  onViewQuestions
}) => {
  const levelNames: { [key: string]: string } = {
    nhanBiet: "Nhận biết",
    thongHieu: "Thông hiểu",
    vanDung: "Vận dụng",
    vanDungCao: "Vận dụng cao"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Nội dung theo chương/chủ đề</h2>
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded"
          onClick={onAddChapter}
        >
          <IoAddCircleOutline className="mr-1" size={18} />
          <span>Thêm chương mới</span>
        </button>
      </div>
      
      {questionBank.chapters && questionBank.chapters.length > 0 ? (
        <div className="space-y-4">
          {questionBank.chapters.map((chapter, chapterIndex) => (
            <ChapterView
              key={chapterIndex}
              chapter={chapter}
              chapterIndex={chapterIndex}
              isExpanded={expandedChapters[chapterIndex] || false}
              expandedSubContents={expandedSubContents}
              onToggle={() => onToggleChapter(chapterIndex)}
              onAddSubContent={() => onAddSubContent(chapterIndex)}
              onEdit={() => onEditChapter(chapter, chapterIndex)}
              onDelete={() => onDeleteChapter(chapter, chapterIndex)}
              onToggleSubContent={(key) => onToggleSubContent(key)}
              onEditSubContent={(subContentIndex) => {
                const subContent = chapter.subContents![subContentIndex];
                onEditSubContent(subContent, chapterIndex, subContentIndex);
              }}
              onDeleteSubContent={(subContentIndex) => {
                const subContent = chapter.subContents![subContentIndex];
                onDeleteSubContent(subContent, chapterIndex, subContentIndex);
              }}
              onAddRequirement={(subContentIndex, level) => {
                onAddRequirement(chapterIndex, subContentIndex, level);
              }}
              onEditRequirement={(subContentIndex, level, itemIndex) => {
                const subContent = chapter.subContents![subContentIndex];
                const reqObj = subContent.requirements!;
                const reqArray = reqObj[level as keyof typeof reqObj] as any[];
                const item = reqArray[itemIndex];
                onEditRequirement(item, chapterIndex, subContentIndex, level, itemIndex);
              }}
              onDeleteRequirement={(subContentIndex, level, itemIndex) => {
                const subContent = chapter.subContents![subContentIndex];
                const reqObj = subContent.requirements!;
                const reqArray = reqObj[level as keyof typeof reqObj] as any[];
                const item = reqArray[itemIndex];
                onDeleteRequirement(item, chapterIndex, subContentIndex, level, itemIndex);
              }}
              onViewQuestions={(subContentIndex, level, itemIndex) => {
                const subContent = chapter.subContents![subContentIndex];
                const reqObj = subContent.requirements!;
                const reqArray = reqObj[level as keyof typeof reqObj] as any[];
                const item = reqArray[itemIndex];
                onViewQuestions(item, levelNames[level] || level, level, chapterIndex, subContentIndex, itemIndex);
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Không tìm thấy nội dung nào.</p>
      )}
    </div>
  );
};

export default ChaptersList;

