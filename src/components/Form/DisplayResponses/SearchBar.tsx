import React, { ChangeEvent } from 'react';
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  onSearchChange,
  resultCount
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Danh sách học sinh ({resultCount})
      </h2>
      
      <div className="relative mt-2 sm:mt-0 flex-grow sm:flex-grow-0 sm:ml-4 max-w-xs">
        <input
          type="text"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <FaSearch className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;




