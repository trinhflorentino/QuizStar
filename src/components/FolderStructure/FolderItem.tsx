import React from 'react';
import { FaFolder, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import type { Folder } from './types';

interface FolderItemProps {
  folder: Folder;
  isSelected: boolean;
  loading: boolean;
  showMenu: string | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>, item: Folder) => void;
  onOpen: (folder: Folder) => void;
  onToggleMenu: (e: React.MouseEvent, folderId: string) => void;
  onRename: (folder: Folder) => void;
  onDelete: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  isSelected,
  loading,
  showMenu,
  onSelect,
  onOpen,
  onToggleMenu,
  onRename,
  onDelete
}) => {
  return (
    <div 
      className={`grid grid-cols-12 p-3 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
      onClick={() => onOpen(folder)}
    >
      <div className="col-span-1 pr-2">
        <input 
          type="checkbox" 
          className="w-4 h-4"
          checked={isSelected}
          onChange={(e) => onSelect(e, folder)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="col-span-5 flex items-center">
        <FaFolder className="text-yellow-500 mr-3 flex-shrink-0" />
        <span className="truncate font-medium">{folder.name}</span>
      </div>
      <div className="col-span-3 flex items-center">
        <span className="text-gray-400 text-sm">—</span>
      </div>
      <div className="col-span-3 flex items-center justify-end space-x-2">
        <div className="relative folder-menu">
          <button 
            onClick={(e) => !loading && onToggleMenu(e, folder.id)}
            className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-200 disabled:opacity-50"
            disabled={loading}
          >
            <FaEllipsisV size={14} />
          </button>
          
          {showMenu === folder.id && (
            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-44">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(folder);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <FaEdit size={12} className="mr-2" />
                <span>Đổi tên thư mục</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
              >
                <FaTrash size={12} className="mr-2" />
                <span>Xóa thư mục</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderItem;

