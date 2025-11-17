import React from 'react';
import { FaHome, FaChevronRight } from "react-icons/fa";
import type { PathItem } from './types';

interface BreadcrumbProps {
  currentPath: PathItem[];
  loading: boolean;
  onNavigateToRoot: () => void;
  onNavigateToIndex: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPath,
  loading,
  onNavigateToRoot,
  onNavigateToIndex
}) => {
  return (
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mb-4 overflow-x-auto">
      <button
        className="text-blue-600 hover:text-blue-800 flex items-center"
        onClick={onNavigateToRoot}
        disabled={loading}
      >
        <FaHome className="mr-1" />
        <span>Trang chủ</span>
      </button>
      
      {currentPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <FaChevronRight className="mx-2 text-gray-400" />
          <button
            className="text-blue-600 hover:text-blue-800 truncate max-w-[200px]"
            onClick={() => onNavigateToIndex(index)}
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;




