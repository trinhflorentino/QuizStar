import React from 'react';
import { v4 as uuid } from "uuid";
import { MemoizedMathJax } from './MemoizedMathJax';

interface MCQOptionProps {
  questionIndex: number;
  optionIndex: number;
  option: { option: string; optionNo?: number };
  isSelected: boolean;
  onSelect: (questionIndex: number, optionIndex: number) => void;
}

export const MCQOption = React.memo<MCQOptionProps>(({ 
  questionIndex, 
  optionIndex, 
  option, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div key={uuid()} className="mb-2">
      <div
        id={`${questionIndex}-${optionIndex}`}
        className={`flex items-start p-2 rounded cursor-pointer transition-colors ${
          isSelected
            ? 'bg-blue-100 border border-blue-300'
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}
        onClick={() => onSelect(questionIndex, optionIndex)}
      >
        <span className="font-medium mr-2 flex-shrink-0">{String.fromCharCode(65 + optionIndex)}.</span>
        <div className="prose-sm max-w-none flex-1 text-gray-700">
          {option.option && option.option.trim() ? (
            <MemoizedMathJax inline dynamic>{option.option}</MemoizedMathJax>
          ) : (
            <span className="text-gray-400 italic">Chưa có nội dung lựa chọn</span>
          )}
        </div>
        {isSelected && (
          <span className="ml-2 text-blue-600 font-semibold text-sm flex-shrink-0">✓</span>
        )}
      </div>
      <input
        type="radio"
        className="hidden"
        value={optionIndex + 1}
        name={`question_${questionIndex}`}
        checked={isSelected}
        onChange={() => onSelect(questionIndex, optionIndex)}
      />
    </div>
  );
});

MCQOption.displayName = 'MCQOption';


