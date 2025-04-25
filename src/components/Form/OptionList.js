import React from 'react';
import { FiTrash2 } from "react-icons/fi";

function OptionList({
  question,
  options,
  index,
  onOptionChange,
  onCorrectOptionChange,
  onRemoveOption
}) {
  if (question.type === "mcq") {
    return (
      <li className="space-y-3">
        {options.map((option, ind) => (
          <div key={option.id} className="flex flex-row md:flex-row items-start md:items-center gap-2">
            <div className="flex-1 flex items-center gap-3">
              <button
                type="button"
                onClick={(event) => onCorrectOptionChange(event, index, ind)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-colors ${
                  question.answer === ind 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-lg">
                  {String.fromCharCode(65 + ind)}
                </span>
              </button>
              <input
                type="text"
                className="flex-1 px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Phương án ${String.fromCharCode(65 + ind)}`}
                value={option.option}
                onChange={(event) => onOptionChange(event, index, ind)}
              />
              {options.length > 2 && (
                <button 
                  className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  onClick={() => onRemoveOption(index, ind)}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </li>
    );
  }

  if (question.type === "truefalse") {
    return (
      <>
        {options.map((option, ind) => (
          <li key={option.id} className="flex flex-row md:flex-row items-start md:items-center gap-3 md:gap-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Ý kiến ${String.fromCharCode(97 + ind)}`}
              value={option.option ?? ""}
              onChange={(event) => onOptionChange(event, index, ind)}
            />
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={option.answer === null ? "" : option.answer ? "true" : "false"}
                onChange={(event) => onCorrectOptionChange(event, index, ind)}
              >
                <option value="true">Đúng</option>
                <option value="false">Sai</option>
              </select>
              {options.length > 2 && (
                <button 
                  className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  onClick={() => onRemoveOption(index, ind)}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </li>
        ))}
      </>
    );
  }

  return null;
}

export default OptionList; 