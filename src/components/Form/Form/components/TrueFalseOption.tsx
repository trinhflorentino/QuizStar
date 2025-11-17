import React from 'react';
import { MemoizedMathJax } from './MemoizedMathJax';

interface TrueFalseOptionProps {
  questionIndex: number;
  optionIndex: number;
  option: { option: string; optionNo?: number };
  selectedValue: boolean | null | undefined;
  onSelect: (questionIndex: number, optionIndex: number, isTrue: boolean, value: boolean) => void;
}

export const TrueFalseOption = React.memo<TrueFalseOptionProps>(({ 
  questionIndex, 
  optionIndex, 
  option, 
  selectedValue, 
  onSelect 
}) => {
  return (
    <div key={`tf-${questionIndex}-${optionIndex}`} className="mb-4">
      <MemoizedMathJax inline dynamic className="font-medium text-gray-700 mb-2">
        {String.fromCharCode(97 + optionIndex)}. {option.option}
      </MemoizedMathJax>
      <div className="flex space-x-4 ml-4 mt-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selectedValue === true
              ? 'bg-green-100 border-green-500 text-green-700'
              : 'hover:bg-gray-50 border-gray-300 text-gray-700'
          }`}
          onClick={() => onSelect(questionIndex, optionIndex, true, true)}
        >
          Đúng
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selectedValue === false
              ? 'bg-red-100 border-red-500 text-red-700'
              : 'hover:bg-gray-50 border-gray-300 text-gray-700'
          }`}
          onClick={() => onSelect(questionIndex, optionIndex, true, false)}
        >
          Sai
        </button>
      </div>
    </div>
  );
});

TrueFalseOption.displayName = 'TrueFalseOption';


