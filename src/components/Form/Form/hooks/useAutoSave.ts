import { useEffect } from 'react';
import { StudentAnswer, OrderMapping, StudentInfo } from '../types';

interface UseAutoSaveParams {
  isStudentInfoSubmitted: boolean;
  studInfo: StudentInfo;
  currentAttemptId: string | null;
  selectedList: StudentAnswer[];
  originalOrder: OrderMapping;
  pin: string | undefined;
  saveProgressImmediate: () => void;
}

export const useAutoSave = ({
  isStudentInfoSubmitted,
  studInfo,
  currentAttemptId,
  selectedList,
  originalOrder,
  pin,
  saveProgressImmediate
}: UseAutoSaveParams) => {
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStudentInfoSubmitted && studInfo.email && currentAttemptId && pin) {
        const progressData = {
          selected_answers: selectedList,
          orderMapping: originalOrder,
          attemptId: currentAttemptId,
          pin: pin.toString(),
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(`quiz_progress_${pin}_${currentAttemptId}`, JSON.stringify(progressData));
        saveProgressImmediate();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    const handleVisibilityChange = () => {
      if (document.hidden && isStudentInfoSubmitted && studInfo.email && currentAttemptId) {
        saveProgressImmediate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isStudentInfoSubmitted, studInfo.email, currentAttemptId, selectedList, originalOrder, pin, saveProgressImmediate]);
};


