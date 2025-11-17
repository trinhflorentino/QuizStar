import { useCallback } from 'react';
import { StudentAnswer, OrderMapping, Question } from '../types';
import { selectedAnswersReducer } from './selectedAnswersReducer';

interface UseAnswerHandlingParams {
  questionIndexMapping: { [key: number]: number };
  originalOrder: OrderMapping;
  originalQuestions: Question[];
  dispatchSelectedAnswers: React.Dispatch<any>;
  setSelectedList: React.Dispatch<React.SetStateAction<StudentAnswer[]>>;
  saveCurrentProgress: () => void;
}

export const useAnswerHandling = ({
  questionIndexMapping,
  originalOrder,
  originalQuestions,
  dispatchSelectedAnswers,
  setSelectedList,
  saveCurrentProgress
}: UseAnswerHandlingParams) => {
  
  const handleAnswerSelect = useCallback((
    questionIndex: number,
    optionIndex: number,
    isTrueFalse: boolean = false,
    isTrue: boolean | null = null
  ) => {
    // Update UI state
    if (isTrueFalse) {
      dispatchSelectedAnswers({ 
        type: 'SET_TF_ANSWER', 
        questionIndex, 
        optionIndex, 
        isTrue 
      });
    } else {
      dispatchSelectedAnswers({
        type: 'SET_MCQ_ANSWER',
        questionIndex,
        optionIndex
      });
    }
    
    // Map to original indices for storage
    const originalQuestionIndex = questionIndexMapping[questionIndex];
    
    if (originalQuestionIndex !== undefined) {
      if (isTrueFalse) {
        setSelectedList(prev => {
          const newList = prev ? [...prev] : [];
          while (newList.length <= originalQuestionIndex) {
            newList.push(null as any);
          }
          
          if (!newList[originalQuestionIndex]) {
            newList[originalQuestionIndex] = { selectedAnswer: [] };
          }
          
          let answers = Array.isArray(newList[originalQuestionIndex].selectedAnswer) 
            ? [...(newList[originalQuestionIndex].selectedAnswer as boolean[])] 
            : [];
            
          while (answers.length <= optionIndex) {
            answers.push(null as any);
          }
          
          answers[optionIndex] = isTrue ?? false;
          
          newList[originalQuestionIndex] = { ...newList[originalQuestionIndex], selectedAnswer: answers };
          return newList;
        });
      } else {
        const originalOptionIndex = originalOrder[originalQuestionIndex]?.optionMapping?.[optionIndex] ?? optionIndex;
        
        setSelectedList(prev => {
          const newList = prev ? [...prev] : [];
          while (newList.length <= originalQuestionIndex) {
            newList.push(null as any);
          }
          newList[originalQuestionIndex] = { selectedAnswer: originalOptionIndex };
          return newList;
        });
      }
      
      // Save progress (realtime)
      saveCurrentProgress();
    }
  }, [questionIndexMapping, originalOrder, dispatchSelectedAnswers, setSelectedList, saveCurrentProgress]);

  const handleShortAnswerChange = useCallback((questionIndex: number, value: string) => {
    const originalQuestionIndex = questionIndexMapping[questionIndex];
    
    if (originalQuestionIndex !== undefined) {
      setSelectedList(prev => {
        const newList = prev ? [...prev] : [];
        while (newList.length <= originalQuestionIndex) {
          newList.push(null as any);
        }
        newList[originalQuestionIndex] = { selectedAnswer: value || "" };
        return newList;
      });
      
      // Save progress immediately for short answers
      setTimeout(() => {
        saveCurrentProgress();
      }, 500);
    }
  }, [questionIndexMapping, setSelectedList, saveCurrentProgress]);

  return { handleAnswerSelect, handleShortAnswerChange };
};

