import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import db, { realtimeDatabase } from '../../../../services/firebaseConfig';
import { calculateRemainingTime, firestoreTimestampToDate, getUserIdentifier } from '../utils';
import { shuffleQuestionsAndAnswers } from '../utils/questionShuffling';
import { Question, OrderMapping, StudentInfo, PreviousAttemptData, Attempt } from '../types';

interface UseQuizLoadingParams {
  pin: string | undefined;
  isStudentInfoSubmitted: boolean;
  canResume: boolean;
  setQuestions: React.Dispatch<React.SetStateAction<Question[] | string>>;
  setOriginalOrder: React.Dispatch<React.SetStateAction<OrderMapping>>;
  setCanResume: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviousAttemptData: React.Dispatch<React.SetStateAction<PreviousAttemptData | null>>;
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
  setRemainingTime: React.Dispatch<React.SetStateAction<number | null>>;
  setStudInfo: React.Dispatch<React.SetStateAction<StudentInfo>>;
  setIsStudentInfoSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentAttemptId: React.Dispatch<React.SetStateAction<string | null>>;
  setPreviousAttempts: React.Dispatch<React.SetStateAction<Attempt[]>>;
  setShowRetakeOption: React.Dispatch<React.SetStateAction<boolean>>;
  restorePreviousAnswers: (previousAnswers: any[], orderMapping: OrderMapping) => void;
  onCompletedAttemptFound?: (attemptId: string, userEmail: string) => void;
}

export const useQuizLoading = ({
  pin,
  isStudentInfoSubmitted,
  canResume,
  setQuestions,
  setOriginalOrder,
  setCanResume,
  setPreviousAttemptData,
  setStartTime,
  setRemainingTime,
  setStudInfo,
  setIsStudentInfoSubmitted,
  setCurrentAttemptId,
  setPreviousAttempts,
  setShowRetakeOption,
  restorePreviousAnswers,
  onCompletedAttemptFound
}: UseQuizLoadingParams) => {
  
  useEffect(() => {
    if (!pin) return;
    
    async function getQuestions() {
      try {
        if (!pin) return;
        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin.toString(),
          "Question_Papers_MCQ"
        );
        const docos = await getDocs(settersCollectionRef);
        
        if (docos.docs.length > 0) {
          const attemptPromise = new Promise<PreviousAttemptData>((res) => {
            getAuth().onAuthStateChanged(async function (user) {
              if (user) {
                try {
                  const userAttemptsRef = collection(
                    db, 
                    "Users", 
                    user.uid, 
                    "Exams_Attempted",
                    pin,
                    "Attempts"
                  );
                  
                  const attemptsSnapshot = await getDocs(userAttemptsRef);
                  const attempts = attemptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Attempt[];
                  
                  const inProgressAttempt = attempts.find(a => a.status === "in_progress");
                  
                  if (inProgressAttempt) {
                    const responseDoc = await getDoc(
                      doc(db, "Paper_Setters", pin!.toString(), "Responses", `${user.email}_${inProgressAttempt.id}`)
                    );
                    
                    const userId = user.uid;
                    const progressPath = `quiz_progress/${pin}/${userId}/${inProgressAttempt.id}`;
                    const progressRef = ref(realtimeDatabase, progressPath);
                    let realtimeProgress: any = null;
                    
                    try {
                      const progressSnapshot = await get(progressRef);
                      if (progressSnapshot.exists()) {
                        realtimeProgress = progressSnapshot.val();
                        console.log('📦 Found progress in Realtime Database:', realtimeProgress);
                      }
                    } catch (rtdbError) {
                      console.log('⚠️ Could not read from Realtime Database, using Firestore only');
                    }
                    
                    if (responseDoc.exists()) {
                      const responseData = responseDoc.data();
                      const examDuration = docos.docs[0].data().duration;
                      const remainingTime = calculateRemainingTime(responseData.startedAt, examDuration);
                      
                      if (remainingTime && remainingTime > 0) {
                        const selectedAnswers = realtimeProgress?.selected_answers || responseData.selected_answers || [];
                        const orderMapping = realtimeProgress?.orderMapping || responseData.orderMapping;
                        
                        res({ 
                          attempted: true, 
                          canResume: true, 
                          startTime: responseData.startedAt,
                          remainingTime: remainingTime,
                          studInfo: responseData.stud_info as StudentInfo,
                          selected_answers: selectedAnswers,
                          orderMapping: orderMapping,
                          attemptId: inProgressAttempt.id
                        });
                      } else {
                        await updateDoc(responseDoc.ref, {
                          status: "completed",
                          timeExpired: true
                        });
                        
                        await updateDoc(
                          doc(db, "Users", user.uid, "Exams_Attempted", pin, "Attempts", inProgressAttempt.id),
                          {
                            status: "completed",
                            timeExpired: true
                          }
                        );
                        
                        res({ 
                          attempted: true, 
                          canResume: false,
                          previousAttempts: attempts.filter(a => a.status === "completed")
                        });
                      }
                    } else {
                      res({ 
                        attempted: true, 
                        canResume: false,
                        previousAttempts: attempts.filter(a => a.status === "completed")
                      });
                    }
                  } else {
                    res({ 
                      attempted: false,
                      canResume: false,
                      previousAttempts: attempts.filter(a => a.status === "completed")
                    });
                  }
                } catch (error) {
                  console.error("Error checking attempts:", error);
                  res({ attempted: false, canResume: false });
                }
              } else {
                res({ attempted: false, canResume: false });
              }
            });
          });

          const attemptStatus = await attemptPromise;
          
          // Check if there's a completed attempt and redirect to result
          if (attemptStatus.attempted && !attemptStatus.canResume) {
            const completedAttempts = attemptStatus.previousAttempts || [];
            if (completedAttempts.length > 0 && !isStudentInfoSubmitted) {
              // Get the most recent completed attempt
              const latestAttempt = completedAttempts.sort((a, b) => 
                (b.attemptNumber || 0) - (a.attemptNumber || 0)
              )[0];
              
              // Check if user is trying to access the exam page after submission
              const userIdentifier = getUserIdentifier();
              if (latestAttempt && userIdentifier && onCompletedAttemptFound) {
                // Call callback to handle navigation in parent component
                onCompletedAttemptFound(latestAttempt.id, userIdentifier);
                return;
              }
            }
            
            setPreviousAttempts(completedAttempts);
            setShowRetakeOption(true);
          } else {
            const docosData = docos.docs.map((doc) => doc.data());
            if (docosData.length > 0 && docosData[0].question_question) {
              const originalQuestions = docosData[0].question_question as Question[];
              
              let shuffledData: { shuffledQuestions: Question[]; orderMapping: OrderMapping };
              
              if (attemptStatus.canResume && attemptStatus.orderMapping) {
                shuffledData = {
                  shuffledQuestions: [],
                  orderMapping: attemptStatus.orderMapping
                };
                
                const orderMapping = attemptStatus.orderMapping;
                const reconstructedQuestions: (Question | null)[] = [];
                
                Object.keys(orderMapping).forEach(origIdx => {
                  const originalIndex = parseInt(origIdx);
                  const newIndex = orderMapping[origIdx].newIndex;
                  const optionMapping = orderMapping[origIdx].optionMapping || {};
                  
                  const originalQuestion = {...originalQuestions[originalIndex]};
                  
                  if (originalQuestion.type === "mcq" && originalQuestion.options) {
                    const newOptions = new Array(originalQuestion.options.length);
                    
                    for (const [newIdx, origOptIdx] of Object.entries(optionMapping)) {
                      newOptions[parseInt(newIdx)] = originalQuestion.options[origOptIdx as number];
                    }
                    
                    originalQuestion.options = newOptions;
                  }
                  
                  while (reconstructedQuestions.length <= newIndex) {
                    reconstructedQuestions.push(null);
                  }
                  
                  reconstructedQuestions[newIndex] = originalQuestion;
                });
                
                shuffledData.shuffledQuestions = reconstructedQuestions.filter(q => q !== null) as Question[];
              } else {
                shuffledData = shuffleQuestionsAndAnswers(originalQuestions);
              }
              
              setQuestions(shuffledData.shuffledQuestions);
              setOriginalOrder(shuffledData.orderMapping);
              
              if (attemptStatus.canResume) {
                setCanResume(true);
                setPreviousAttemptData(attemptStatus);
                setStartTime(firestoreTimestampToDate(attemptStatus.startTime));
                setRemainingTime(attemptStatus.remainingTime || null);
                if (attemptStatus.studInfo) {
                  setStudInfo(attemptStatus.studInfo);
                }
                setIsStudentInfoSubmitted(true);
                setCurrentAttemptId(attemptStatus.attemptId || null);
                
                if (Array.isArray(attemptStatus.selected_answers) && attemptStatus.selected_answers.length > 0) {
                  console.log('✅ Restoring from Firestore:', attemptStatus.selected_answers);
                  restorePreviousAnswers(attemptStatus.selected_answers, shuffledData.orderMapping);
                } else {
                  try {
                    const backupKey = `quiz_progress_${pin}_${attemptStatus.attemptId}`;
                    const backupData = localStorage.getItem(backupKey);
                    if (backupData) {
                      const parsed = JSON.parse(backupData);
                      if (parsed.selected_answers && Array.isArray(parsed.selected_answers) && parsed.selected_answers.length > 0) {
                        console.log('✅ Restoring from localStorage:', parsed.selected_answers);
                        restorePreviousAnswers(parsed.selected_answers, shuffledData.orderMapping);
                      }
                    }
                  } catch (error) {
                    console.error("Error restoring from localStorage:", error);
                  }
                }
              }
            } else {
              setQuestions("Sai mã pin");
            }
          }
        } else {
          setQuestions("Sai mã pin");
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        setQuestions("Đã xảy ra lỗi");
      }
    }

    if (!isStudentInfoSubmitted || canResume) {
      getQuestions();
    }
  }, [
    pin,
    isStudentInfoSubmitted,
    canResume,
    setQuestions,
    setOriginalOrder,
    setCanResume,
    setPreviousAttemptData,
    setStartTime,
    setRemainingTime,
    setStudInfo,
    setIsStudentInfoSubmitted,
    setCurrentAttemptId,
    setPreviousAttempts,
    setShowRetakeOption,
    restorePreviousAnswers
  ]);
};

