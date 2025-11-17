import React, { useMemo } from 'react';
import { MCQOption } from './MCQOption';
import { TrueFalseOption } from './TrueFalseOption';
import { MemoizedMathJax } from './MemoizedMathJax';
import { Question, StudentAnswer, OrderMapping } from '../types';

interface QuestionListProps {
  questions: Question[];
  selectedAnswers: any;
  canResume: boolean;
  selectedList: StudentAnswer[];
  questionIndexMapping: { [key: number]: number };
  onAnswerSelect: (questionIndex: number, optionIndex: number, isTrueFalse?: boolean, isTrue?: boolean) => void;
  onShortAnswerChange: (questionIndex: number, value: string) => void;
  onShortAnswerBlur: (questionIndex: number, value: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedAnswers,
  canResume,
  selectedList,
  questionIndexMapping,
  onAnswerSelect,
  onShortAnswerChange,
  onShortAnswerBlur
}) => {
  const QuestionComponents = useMemo(() => {
    if (!Array.isArray(questions) || questions.length === 0) {
      return null;
    }
    
    return questions.map((question, questionIndex) => (
      <div key={`question-${questionIndex}`} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-lg text-gray-800 mb-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
            Câu {questionIndex + 1}
          </span>
          <MemoizedMathJax inline dynamic className="text-lg">{question.question || ''}</MemoizedMathJax>
        </p>
        
        {question.type === "mcq" && question.options && question.options.map((option, optionIndex) => (
          <MCQOption
            key={`mcq-${questionIndex}-${optionIndex}`}
            questionIndex={questionIndex}
            optionIndex={optionIndex}
            option={option}
            isSelected={selectedAnswers[questionIndex] === optionIndex}
            onSelect={onAnswerSelect}
          />
        ))}
        
        {question.type === "truefalse" && question.options && question.options.map((option, optionIndex) => (
          <TrueFalseOption
            key={`tf-${questionIndex}-${optionIndex}`}
            questionIndex={questionIndex}
            optionIndex={optionIndex}
            option={option}
            selectedValue={selectedAnswers[`tf_${questionIndex}_${optionIndex}`]}
            onSelect={onAnswerSelect}
          />
        ))}
        
        {question.type === "shortanswer" && (
          <div className="mt-4">
            <textarea
              id={`shortAnswer${questionIndex}`}
              placeholder="Nhập câu trả lời của bạn"
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              defaultValue={canResume && selectedList[questionIndexMapping[questionIndex]]?.selectedAnswer ? String(selectedList[questionIndexMapping[questionIndex]]?.selectedAnswer) : ""}
              onChange={(e) => onShortAnswerChange(questionIndex, e.target.value)}
              onBlur={(e) => onShortAnswerBlur(questionIndex, e.target.value)}
            />
          </div>
        )}
      </div>
    ));
  }, [
    questions,
    selectedAnswers,
    canResume,
    selectedList,
    questionIndexMapping,
    onAnswerSelect,
    onShortAnswerChange,
    onShortAnswerBlur
  ]);

  return <>{QuestionComponents}</>;
};

