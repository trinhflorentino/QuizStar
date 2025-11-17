import React from 'react';
import { FaFolder, FaFileAlt, FaArrowLeft, FaHome, FaChevronRight } from "react-icons/fa";
import type { DisplayItem, Folder } from './types';

interface FolderStructureViewProps {
  displayItems: DisplayItem[];
  currentPath: Folder[];
  onNavigateToRoot: () => void;
  onNavigateBack: () => void;
  onNavigateToPath: (path: Folder[]) => void;
  onOpenFolder: (folder: Folder) => void;
  onSelectExam: (exam: any) => void;
}

const FolderStructureView: React.FC<FolderStructureViewProps> = ({
  displayItems,
  currentPath,
  onNavigateToRoot,
  onNavigateBack,
  onNavigateToPath,
  onOpenFolder,
  onSelectExam
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chọn đề thi để import câu hỏi</h2>
      
      {/* Breadcrumb navigation */}
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mb-4 overflow-x-auto">
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={onNavigateToRoot}
        >
          <FaHome className="mr-1" />
          <span>Thư mục gốc</span>
        </button>
        
        {currentPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center">
            <FaChevronRight className="mx-2 text-gray-400" />
            <button
              className="text-blue-600 hover:text-blue-800 truncate max-w-[200px]"
              onClick={() => onNavigateToPath(currentPath.slice(0, index + 1))}
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>
      
      {/* Back button if inside a folder */}
      {currentPath.length > 0 && (
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          onClick={onNavigateBack}
        >
          <FaArrowLeft className="mr-2" />
          <span>Quay lại thư mục trước</span>
        </button>
      )}
      
      {/* Display folders and exams in table/list style */}
      <div className="grid grid-cols-12 py-2 px-3 border-b border-gray-200 bg-gray-50 font-medium text-gray-700 rounded-t-md">
        <div className="col-span-8">Tên</div>
        <div className="col-span-4 text-right">Thao tác</div>
      </div>
      
      <div className="divide-y divide-gray-200 rounded-b-md border-l border-r border-b border-gray-200">
        {displayItems.map(item => (
          <div 
            key={item.id}
            className="grid grid-cols-12 p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => item.type === 'folder' ? onOpenFolder(item as Folder) : onSelectExam(item)}
          >
            <div className="col-span-8 flex items-center">
              {item.type === 'folder' ? (
                <FaFolder className="text-yellow-500 mr-3 flex-shrink-0" />
              ) : (
                <FaFileAlt className="text-gray-500 mr-3 flex-shrink-0" />
              )}
              <span className="truncate font-medium">
                {item.type === 'folder' ? (item as Folder).name : (item as any).quiz_title}
              </span>
            </div>
            <div className="col-span-4 flex items-center justify-end">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.type === 'folder') {
                    onOpenFolder(item as Folder);
                  } else {
                    onSelectExam(item);
                  }
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md"
              >
                {item.type === 'folder' ? 'Mở' : 'Chọn'}
              </button>
            </div>
          </div>
        ))}
        
        {displayItems.length === 0 && (
          <div className="p-8 text-center text-gray-500 italic">
            Không có đề thi hoặc thư mục nào trong thư mục này.
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderStructureView;




