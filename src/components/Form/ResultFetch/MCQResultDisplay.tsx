import React, { useMemo } from 'react';
import { MathJax } from 'better-react-mathjax';
import type { Question, Answer, StudentAnswer } from './types';

interface MCQResultDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
  optionMapping?: { [key: number]: number };
}

const MCQResultDisplay: React.FC<MCQResultDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex,
  optionMapping
}) => {
  // Reconstruct options in shuffled order if optionMapping exists
  const displayOptions = useMemo(() => {
    let options = question.options || [];
    
    if (optionMapping && Object.keys(optionMapping).length > 0) {
      const shuffledOptions: Array<{ option: string; [key: string]: any }> = [];
      const originalOptions = [...options];
      
      const maxDisplayIndex = Math.max(...Object.keys(optionMapping).map(k => parseInt(k)));
      for (let i = 0; i <= maxDisplayIndex; i++) {
        const originalOptIdx = optionMapping[i];
        if (originalOptIdx !== undefined && originalOptions[originalOptIdx]) {
          shuffledOptions[i] = originalOptions[originalOptIdx];
        }
      }
      
      for (let i = 0; i < originalOptions.length; i++) {
        if (!shuffledOptions[i]) {
          shuffledOptions[i] = originalOptions[i];
        }
      }
      
      return shuffledOptions.filter(opt => opt !== undefined);
    }
    
    return options;
  }, [question.options, optionMapping]);

  const getCorrectAnswerDisplay = (): string => {
    if (!answer?.answer && answer?.answer !== 0) return 'N/A';
    
    const correctAns = parseInt(String(answer.answer));
    if (isNaN(correctAns)) return 'N/A';
    
    // If optionMapping exists, find the shuffled display index for this original index
    if (optionMapping && Object.keys(optionMapping).length > 0) {
      // optionMapping maps: shuffledIndex -> originalIndex
      // We need to find: which shuffledIndex has originalIndex === correctAns
      const displayOptIdx = Object.entries(optionMapping).find(
        ([_, origIdx]) => parseInt(String(origIdx)) === correctAns
      );
      if (displayOptIdx) {
        const shuffledIdx = parseInt(displayOptIdx[0]);
        if (!isNaN(shuffledIdx) && shuffledIdx >= 0 && shuffledIdx < displayOptions.length) {
          return String.fromCharCode(65 + shuffledIdx);
        }
      }
    }
    
    // Fallback: use original index directly if no mapping or mapping not found
    if (correctAns >= 0 && correctAns < displayOptions.length) {
      return String.fromCharCode(65 + correctAns);
    }
    
    return 'N/A';
  };

  const getStudentAnswerDisplay = (): string => {
    if (!studentAnswer?.selectedAnswer && studentAnswer?.selectedAnswer !== 0) return 'N/A';
    
    const studentAns = parseInt(String(studentAnswer.selectedAnswer));
    if (isNaN(studentAns)) return 'N/A';
    
    // If optionMapping exists, find the shuffled display index for this original index
    if (optionMapping && Object.keys(optionMapping).length > 0) {
      // optionMapping maps: shuffledIndex -> originalIndex
      // We need to find: which shuffledIndex has originalIndex === studentAns
      const displayOptIdx = Object.entries(optionMapping).find(
        ([_, origIdx]) => parseInt(String(origIdx)) === studentAns
      );
      if (displayOptIdx) {
        const shuffledIdx = parseInt(displayOptIdx[0]);
        if (!isNaN(shuffledIdx) && shuffledIdx >= 0 && shuffledIdx < displayOptions.length) {
          return String.fromCharCode(65 + shuffledIdx);
        }
      }
    }
    
    // Fallback: use original index directly if no mapping or mapping not found
    if (studentAns >= 0 && studentAns < displayOptions.length) {
      return String.fromCharCode(65 + studentAns);
    }
    
    return 'N/A';
  };

  const isAnswerCorrect = (): boolean => {
    if (!answer?.answer || !studentAnswer?.selectedAnswer) return false;
    
    const correctAns = parseInt(String(answer.answer));
    const studentAns = parseInt(String(studentAnswer.selectedAnswer));
    
    return correctAns === studentAns;
  };

  const getOptionStatus = (displayOptIndex: number) => {
    if (!answer || !studentAnswer) {
      return { isCorrect: false, isSelected: false };
    }

    const correctOptionIndex = parseInt(String(answer.answer || -1));
    const studentSelectedOptionIndex = parseInt(String(studentAnswer.selectedAnswer || -1));
    
    let correctDisplayOptIndex = -1;
    let selectedDisplayOptIndex = -1;
    
    if (optionMapping) {
      const correctEntry = Object.entries(optionMapping).find(
        ([_, origIdx]) => parseInt(String(origIdx)) === correctOptionIndex
      );
      if (correctEntry) {
        correctDisplayOptIndex = parseInt(correctEntry[0]);
      }
      
      const selectedEntry = Object.entries(optionMapping).find(
        ([_, origIdx]) => parseInt(String(origIdx)) === studentSelectedOptionIndex
      );
      if (selectedEntry) {
        selectedDisplayOptIndex = parseInt(selectedEntry[0]);
      }
    } else {
      correctDisplayOptIndex = correctOptionIndex;
      selectedDisplayOptIndex = studentSelectedOptionIndex;
    }
    
    return {
      isCorrect: correctDisplayOptIndex === displayOptIndex,
      isSelected: selectedDisplayOptIndex === displayOptIndex
    };
  };

  if (!answer) return null;

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Show correct answer summary */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-100 border-2 border-green-500 rounded-lg">
        <p className="font-medium text-green-900 mb-1 sm:mb-2 text-xs sm:text-sm">
          Đáp án đúng: <span className="font-bold text-sm sm:text-base">
            {getCorrectAnswerDisplay()}
          </span>
        </p>
        {studentAnswer?.selectedAnswer !== undefined && studentAnswer?.selectedAnswer !== null && (
          <p className={`text-xs sm:text-sm ${isAnswerCorrect() ? 'text-green-800' : 'text-red-700'}`}>
            Đáp án của bạn: <span className="font-bold">
              {getStudentAnswerDisplay()}
            </span>
          </p>
        )}
      </div>
      
      {displayOptions.map((option, displayOptIndex) => {
        const { isCorrect, isSelected } = getOptionStatus(displayOptIndex);
        
        return (
          <div 
            key={displayOptIndex}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
              isCorrect && isSelected 
                ? 'bg-green-200 border-green-600 shadow-md' 
                : isSelected && !isCorrect 
                  ? 'bg-red-100 border-red-500 shadow-sm' 
                  : isCorrect 
                    ? 'bg-green-100 border-green-500 shadow-sm' 
                    : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 font-medium text-sm sm:text-base md:text-lg mr-2 sm:mr-3 flex-shrink-0 ${
                isCorrect && isSelected
                  ? 'border-green-700 bg-green-200 text-green-900'
                  : isCorrect
                    ? 'border-green-600 bg-green-100 text-green-800'
                    : isSelected
                      ? 'border-red-600 bg-red-100 text-red-800'
                      : 'border-gray-400 bg-white'
              }`}>
                {String.fromCharCode(65 + displayOptIndex)}
              </span>
              <div className="flex-grow text-sm sm:text-base">
                <MathJax inline>{option.option}</MathJax>
              </div>
              <div className="flex-shrink-0">
                {isCorrect && (
                  <span className="text-green-700 ml-2 text-base sm:text-lg md:text-xl font-bold">✓ Đúng</span>
                )}
                {isSelected && !isCorrect && (
                  <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Bạn chọn</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MCQResultDisplay;




