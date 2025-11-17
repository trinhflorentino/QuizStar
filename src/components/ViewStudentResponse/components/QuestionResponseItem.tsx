import React from 'react';
import { Question, Answer, StudentAnswer } from '../types';
import { MemoizedMathJax } from './MemoizedMathJax';
import { MCQResponse } from './MCQResponse';
import { TrueFalseResponse } from './TrueFalseResponse';
import { ShortAnswerResponse } from './ShortAnswerResponse';

interface QuestionResponseItemProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
}

export const QuestionResponseItem: React.FC<QuestionResponseItemProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start mb-4">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-sm shrink-0">
          Câu {questionIndex + 1}
        </span>
        <div className="text-lg font-medium">
          <MemoizedMathJax>{question.question}</MemoizedMathJax>
        </div>
      </div>
      
      {question.type === 'mcq' && (
        <MCQResponse
          question={question}
          correctAnswer={answer?.answer as number | undefined}
          studentAnswer={studentAnswer?.selectedAnswer as number | undefined}
          questionIndex={questionIndex}
        />
      )}
      
      {question.type === 'truefalse' && (
        <TrueFalseResponse
          question={question}
          correctAnswer={answer?.answer as boolean[] | undefined}
          studentAnswer={studentAnswer?.selectedAnswer as boolean[] | undefined}
          questionIndex={questionIndex}
        />
      )}
      
      {question.type === 'shortanswer' && (
        <ShortAnswerResponse
          studentAnswer={studentAnswer?.selectedAnswer as string | undefined}
          correctAnswer={answer?.answer as string | undefined}
        />
      )}
    </div>
  );
};

