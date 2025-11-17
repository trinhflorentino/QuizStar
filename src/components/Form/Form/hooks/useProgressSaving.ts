import { useCallback } from 'react';
import { ref, set } from 'firebase/database';
import { realtimeDatabase } from '../../../../services/firebaseConfig';
import { serverTimestamp as rtdbServerTimestamp } from 'firebase/database';
import { debounce } from '../utils';
import { getUserIdForPath } from '../utils';
import { StudentAnswer, StudentInfo, OrderMapping } from '../types';

interface UseProgressSavingParams {
  selectedList: StudentAnswer[];
  originalOrder: OrderMapping;
  isStudentInfoSubmitted: boolean;
  studInfo: StudentInfo;
  pin: string | undefined;
  currentAttemptId: string | null;
}

export const useProgressSaving = ({
  selectedList,
  originalOrder,
  isStudentInfoSubmitted,
  studInfo,
  pin,
  currentAttemptId
}: UseProgressSavingParams) => {
  
  const cleanDataForFirestore = useCallback((data: any): any => {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (item === null || item === undefined) {
          return null;
        }
        if (typeof item === 'object') {
          const cleaned: any = {};
          for (const [key, value] of Object.entries(item)) {
            if (value !== undefined) {
              cleaned[key] = value;
            }
          }
          return cleaned;
        }
        return item;
      });
    }
    if (typeof data === 'object' && data !== null) {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
    return data;
  }, []);

  const saveProgressImmediate = useCallback(async () => {
    if (!isStudentInfoSubmitted || !studInfo.email || !currentAttemptId || !pin) return;
    
    try {
      const cleanedSelectedList = cleanDataForFirestore(selectedList);
      const cleanedOrderMapping = cleanDataForFirestore(originalOrder);
      
      const userId = getUserIdForPath();
      const progressPath = `quiz_progress/${pin}/${userId}/${currentAttemptId}`;
      const progressRef = ref(realtimeDatabase, progressPath);
      
      await set(progressRef, {
        selected_answers: cleanedSelectedList,
        orderMapping: cleanedOrderMapping,
        email: studInfo.email,
        lastUpdated: Date.now(),
        timestamp: rtdbServerTimestamp()
      });
      
      const progressData = {
        selected_answers: cleanedSelectedList,
        orderMapping: cleanedOrderMapping,
        attemptId: currentAttemptId,
        pin: pin.toString(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`quiz_progress_${pin}_${currentAttemptId}`, JSON.stringify(progressData));
      
      console.log('✅ Progress saved to Realtime Database immediately');
    } catch (error) {
      console.error("Error saving progress immediately to Realtime Database:", error);
      try {
        const cleanedSelectedList = cleanDataForFirestore(selectedList);
        const cleanedOrderMapping = cleanDataForFirestore(originalOrder);
        const progressData = {
          selected_answers: cleanedSelectedList,
          orderMapping: cleanedOrderMapping,
          attemptId: currentAttemptId,
          pin: pin.toString(),
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(`quiz_progress_${pin}_${currentAttemptId}`, JSON.stringify(progressData));
        console.log('✅ Progress saved to localStorage as backup');
      } catch (localError) {
        console.error("Error saving to localStorage:", localError);
      }
    }
  }, [selectedList, isStudentInfoSubmitted, studInfo.email, pin, currentAttemptId, originalOrder, cleanDataForFirestore]);

  const saveCurrentProgress = useCallback(
    debounce(async () => {
      if (!isStudentInfoSubmitted || !studInfo.email || !currentAttemptId || !pin) return;
      
      try {
        const cleanedSelectedList = cleanDataForFirestore(selectedList);
        const cleanedOrderMapping = cleanDataForFirestore(originalOrder);
        
        const userId = getUserIdForPath();
        const progressPath = `quiz_progress/${pin}/${userId}/${currentAttemptId}`;
        const progressRef = ref(realtimeDatabase, progressPath);
        
        await set(progressRef, {
          selected_answers: cleanedSelectedList,
          orderMapping: cleanedOrderMapping,
          email: studInfo.email,
          lastUpdated: Date.now(),
          timestamp: rtdbServerTimestamp()
        });
        
        const progressData = {
          selected_answers: cleanedSelectedList,
          orderMapping: cleanedOrderMapping,
          attemptId: currentAttemptId,
          pin: pin.toString(),
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(`quiz_progress_${pin}_${currentAttemptId}`, JSON.stringify(progressData));
        
        console.log('✅ Progress saved to Realtime Database successfully');
      } catch (error) {
        console.error("Error saving progress to Realtime Database:", error);
        try {
          const cleanedSelectedList = cleanDataForFirestore(selectedList);
          const cleanedOrderMapping = cleanDataForFirestore(originalOrder);
          const progressData = {
            selected_answers: cleanedSelectedList,
            orderMapping: cleanedOrderMapping,
            attemptId: currentAttemptId,
            pin: pin.toString(),
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(`quiz_progress_${pin}_${currentAttemptId}`, JSON.stringify(progressData));
          console.log('✅ Progress saved to localStorage as backup');
        } catch (localError) {
          console.error("Error saving to localStorage:", localError);
        }
      }
    }, 500),
    [selectedList, isStudentInfoSubmitted, studInfo.email, pin, currentAttemptId, originalOrder, cleanDataForFirestore]
  );

  return { saveCurrentProgress, saveProgressImmediate };
};


