import React from 'react';
import QuestionResultHeader from './QuestionResultHeader';
import MCQResultDisplay from './MCQResultDisplay';
import TrueFalseResultDisplay from './TrueFalseResultDisplay';
import ShortAnswerResultDisplay from './ShortAnswerResultDisplay';
import type { Question, Answer, StudentAnswer, QuestionScore, OrderMapping } from './types';

interface QuestionResultDisplayProps {
  question: Question;
  answer: Answer | undefined;
  studentAnswer: StudentAnswer | undefined;
  questionScore: QuestionScore | undefined;
  questionIndex: number;
  orderMapping?: OrderMapping;
}

const QuestionResultDisplay: React.FC<QuestionResultDisplayProps> = ({
  question,
  answer,
  studentAnswer,
  questionScore,
  questionIndex,
  orderMapping
}) => {
  const getBorderColor = () => {
    if (questionScore?.isCorrect === true) return 'border-green-500 shadow-green-50';
    if (questionScore?.isCorrect === false) return 'border-red-500 shadow-red-50';
    return 'border-gray-300';
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <MCQResultDisplay
            question={question}
            answer={answer}
            studentAnswer={studentAnswer}
            questionIndex={questionIndex}
            optionMapping={orderMapping?.[questionIndex]?.optionMapping}
          />
        );
      case 'truefalse':
        return (
          <TrueFalseResultDisplay
            question={question}
            answer={answer}
            studentAnswer={studentAnswer}
            questionIndex={questionIndex}
          />
        );
      case 'shortanswer':
        return (
          <ShortAnswerResultDisplay
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
    <div 
      className={`bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-5 border-l-4 transition-all h-full flex flex-col ${getBorderColor()}`}
    >
      <QuestionResultHeader
        question={question}
        questionIndex={questionIndex}
        questionScore={questionScore}
      />
      
      <div className="flex-1">
        {renderQuestionContent()}
      </div>
    </div>
  );
};

export default QuestionResultDisplay;




