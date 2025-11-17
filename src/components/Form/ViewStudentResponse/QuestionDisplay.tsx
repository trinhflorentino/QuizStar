import React from 'react';
import { MathJax } from 'better-react-mathjax';
import MCQQuestionDisplay from './MCQQuestionDisplay';
import TrueFalseQuestionDisplay from './TrueFalseQuestionDisplay';
import ShortAnswerQuestionDisplay from './ShortAnswerQuestionDisplay';
import type { Question, Answer, StudentAnswer } from './types';

interface QuestionDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionIndex: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionIndex
}) => {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <MCQQuestionDisplay
            question={question}
            answer={answer}
            studentAnswer={studentAnswer}
            questionIndex={questionIndex}
          />
        );
      case 'truefalse':
        return (
          <TrueFalseQuestionDisplay
            question={question}
            answer={answer}
            studentAnswer={studentAnswer}
            questionIndex={questionIndex}
          />
        );
      case 'shortanswer':
        return (
          <ShortAnswerQuestionDisplay
            question={question}
            answer={answer}
            studentAnswer={studentAnswer}
            questionIndex={questionIndex}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start mb-4">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-sm shrink-0">
          Câu {questionIndex + 1}
        </span>
        <div className="text-lg font-medium">
          <MathJax>{question.question}</MathJax>
        </div>
      </div>
      
      {renderQuestionContent()}
    </div>
  );
};

export default QuestionDisplay;

