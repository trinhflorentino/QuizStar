import { shuffleArray } from '../utils';
import { Question, OrderMapping } from '../types';

interface ShuffleResult {
  shuffledQuestions: Question[];
  orderMapping: OrderMapping;
}

export const shuffleQuestionsAndAnswers = (questions: Question[]): ShuffleResult => {
  const newOrder: OrderMapping = {};
  
  const shuffledQuestions = questions.map((question, originalQuestionIndex) => {
    const newQuestion = { ...question };
    
    if (question.type === "mcq" && question.options) {
      const optionPairs = question.options.map((opt, idx) => ({ option: opt, originalIndex: idx }));
      const shuffledPairs = shuffleArray([...optionPairs]);
      
      newOrder[originalQuestionIndex] = {
        newIndex: originalQuestionIndex,
        optionMapping: shuffledPairs.reduce((map, pair, newIndex) => {
          map[newIndex] = pair.originalIndex;
          return map;
        }, {} as { [key: number]: number })
      };

      newQuestion.options = shuffledPairs.map(pair => pair.option);
    }
    
    return newQuestion;
  });

  const shuffledWithIndices = shuffledQuestions.map((q, i) => ({ q, originalIndex: i }));
  const finalShuffled = shuffleArray([...shuffledWithIndices]);
  
  finalShuffled.forEach((item, newIndex) => {
    const originalIndex = item.originalIndex;
    if (newOrder[originalIndex]) {
      newOrder[originalIndex].newIndex = newIndex;
    } else {
      newOrder[originalIndex] = { newIndex: newIndex };
    }
  });

  return {
    shuffledQuestions: finalShuffled.map(item => item.q),
    orderMapping: newOrder
  };
};


