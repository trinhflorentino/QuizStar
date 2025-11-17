import { useCallback } from 'react';
import { StudentAnswer, OrderMapping, Question } from '../types';

interface UseAnswerRestorationParams {
  originalQuestions: Question[];
  dispatchSelectedAnswers: React.Dispatch<any>;
  setSelectedList: React.Dispatch<React.SetStateAction<StudentAnswer[]>>;
}

export const useAnswerRestoration = ({
  originalQuestions,
  dispatchSelectedAnswers,
  setSelectedList
}: UseAnswerRestorationParams) => {
  
  const restorePreviousAnswers = useCallback((
    previousAnswers: StudentAnswer[],
    orderMapping: OrderMapping
  ) => {
    if (!previousAnswers || !Array.isArray(previousAnswers)) {
      console.log('⚠️ restorePreviousAnswers: Invalid previousAnswers', previousAnswers);
      return;
    }
    
    console.log('🔄 Restoring answers:', {
      answersCount: previousAnswers.length,
      orderMappingKeys: Object.keys(orderMapping || {}).length
    });
    
    const restoredAnswers: any = {};
    let restoredCount = 0;
    
    previousAnswers.forEach((answer, originalIndex) => {
      if (!answer) return;
      if (answer.selectedAnswer === undefined) return;
      
      const newQuestionIndex = orderMapping[originalIndex]?.newIndex;
      if (newQuestionIndex === undefined) {
        console.log(`⚠️ No mapping found for originalIndex ${originalIndex}`);
        return;
      }
      
      const question = originalQuestions[originalIndex];
      if (!question) {
        console.log(`⚠️ No question found for originalIndex ${originalIndex}`);
        return;
      }
      
      if (question.type === "mcq") {
        const optionMapping = orderMapping[originalIndex]?.optionMapping || {};
        const originalOptionIndex = answer.selectedAnswer as number;
        
        let newOptionIndex: number | null = null;
        for (const [newIdx, origIdx] of Object.entries(optionMapping)) {
          if (parseInt(String(origIdx)) === originalOptionIndex) {
            newOptionIndex = parseInt(newIdx);
            break;
          }
        }
        
        if (newOptionIndex !== null) {
          restoredAnswers[newQuestionIndex] = newOptionIndex;
          restoredCount++;
          console.log(`✅ Restored MCQ Q${originalIndex} -> Q${newQuestionIndex}, Option ${newOptionIndex}`);
        }
      } else if (question.type === "truefalse" && Array.isArray(answer.selectedAnswer)) {
        answer.selectedAnswer.forEach((tfAnswer, optionIndex) => {
          if (tfAnswer !== null && tfAnswer !== undefined) {
            restoredAnswers[`tf_${newQuestionIndex}_${optionIndex}`] = tfAnswer;
            restoredCount++;
          }
        });
        if (answer.selectedAnswer.length > 0) {
          console.log(`✅ Restored True/False Q${originalIndex} -> Q${newQuestionIndex}`);
        }
      } else if (question.type === "shortanswer") {
        restoredCount++;
        console.log(`✅ Restored Short Answer Q${originalIndex} -> Q${newQuestionIndex}: "${answer.selectedAnswer}"`);
      }
    });
    
    console.log(`✅ Restored ${restoredCount} answers total`);
    dispatchSelectedAnswers({ type: 'RESTORE_ANSWERS', answers: restoredAnswers });
    
    setSelectedList(previousAnswers);
  }, [originalQuestions, dispatchSelectedAnswers, setSelectedList]);

  return { restorePreviousAnswers };
};


