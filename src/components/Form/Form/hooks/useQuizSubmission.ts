import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, updateDoc, writeBatch } from 'firebase/firestore/lite';
import { ref, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import db, { realtimeDatabase } from '../../../../services/firebaseConfig';
import { serverTimestamp as rtdbServerTimestamp } from 'firebase/database';
import { v4 as uuid } from 'uuid';
import { getUserIdentifier, getUserIdForPath, isUserAuthenticated } from '../utils';
import { Question, Answer, StudentAnswer, StudentInfo, OrderMapping, ScoreResult } from '../types';

interface UseQuizSubmissionParams {
  selectedList: StudentAnswer[];
  selectedAnswers: any;
  originalQuestions: Question[];
  originalOrder: OrderMapping;
  answers: Answer[];
  studInfo: StudentInfo;
  startTime: Date | null;
  questionIndexMapping: { [key: number]: number };
  calculateScore: (studentAnswers: StudentAnswer[], correctAnswers: Answer[], quizQuestions: Question[]) => ScoreResult;
  calculateQuestionResults: (studentAnswers: StudentAnswer[], correctAnswers: Answer[], quizQuestions: Question[]) => any[];
  pin: string | undefined;
  currentAttemptId: string | null;
  previousAttempts: any[];
  title: string;
}

export const useQuizSubmission = ({
  selectedList,
  selectedAnswers,
  originalQuestions,
  originalOrder,
  answers,
  studInfo,
  startTime,
  questionIndexMapping,
  calculateScore,
  calculateQuestionResults,
  pin,
  currentAttemptId,
  previousAttempts,
  title
}: UseQuizSubmissionParams) => {
  const navigate = useNavigate();

  const onSubmit = useCallback(async () => {
    if (!pin) return;

    // Gather all answers
    let tempSelectedList: StudentAnswer[] = [];
    
    for (let i = 0; i < originalQuestions.length; i++) {
      let selectedAnswer: any = null;
      const shuffledIndex = originalOrder[i]?.newIndex;
      
      if (!originalOrder[i] || shuffledIndex === undefined) continue;
      
      if (originalQuestions[i].type === "mcq") {
        const shuffledAnswer = selectedAnswers[shuffledIndex];
        selectedAnswer = shuffledAnswer !== undefined
          ? originalOrder[i].optionMapping?.[shuffledAnswer]
          : null;
      } else if (originalQuestions[i].type === "truefalse") {
        const shuffledQ = originalQuestions.find((q, idx) => originalOrder[idx]?.newIndex === shuffledIndex);
        selectedAnswer = shuffledQ?.options?.map((_, index) => {
          return selectedAnswers[`tf_${shuffledIndex}_${index}`] ?? null;
        }) || [];
      } else if (originalQuestions[i].type === "shortanswer") {
        const shortAnswerElement = document.getElementById(`shortAnswer${shuffledIndex}`) as HTMLTextAreaElement;
        selectedAnswer = shortAnswerElement?.value || "";
      }

      tempSelectedList.push({ selectedAnswer });
    }
    
    const endTime = new Date();
    const timeSpentMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
    const timeSpentMinutes = Math.floor(timeSpentMs / 60000);
    
    const scoreData = calculateScore(tempSelectedList, answers, originalQuestions);
    
    // Enhanced student info
    const enhancedStudInfo = {
      ...studInfo,
      timeSpent: timeSpentMinutes
    };
    
    try {
      // Batch operations for better reliability
      const batch = writeBatch(db);
      
      // Update response data with attempt ID
      const responseRef = doc(
        db,
        "Paper_Setters",
        pin.toString(),
        "Responses",
        `${studInfo.email}_${currentAttemptId}`
      );
      
      batch.update(responseRef, {
        stud_info: enhancedStudInfo,
        selected_answers: tempSelectedList,
        timeSpentMinutes: timeSpentMs,
        submittedAt: new Date(),
        status: "completed",
        score: `${scoreData.score.toFixed(2)}/${scoreData.totalScore.toFixed(2)}`,
        scoreQ: scoreData.score.toFixed(2),
        scoreAll: scoreData.totalScore.toFixed(2)
      });
      
      await batch.commit();
      
      // Only update user's attempt record if authenticated
      if (isUserAuthenticated()) {
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            try {
              await setDoc(
                doc(db, "Users", user.uid, "Exams_Attempted", pin, "Attempts", currentAttemptId || ''),
                {
                  status: "completed",
                  submittedAt: new Date(),
                  score: `${scoreData.score.toFixed(2)}/${scoreData.totalScore.toFixed(2)}`,
                  scoreQ: scoreData.score.toFixed(2),
                  scoreAll: scoreData.totalScore.toFixed(2)
                },
                { merge: true }
              );
              
              await setDoc(
                doc(db, "Users", user.uid, "Exams_Attempted", pin),
                {
                  last_attempt_at: new Date(),
                  last_score: `${scoreData.score.toFixed(2)}/${scoreData.totalScore.toFixed(2)}`
                },
                { merge: true }
              );
            } catch (error) {
              console.error("Error updating user records:", error);
            }
          }
        });
      }
      
      // Navigate to result summary page
      navigate(`/pinverify/Form/${pin}/ResultSummary/${studInfo.email}/${currentAttemptId}`, {
        state: {
          score: scoreData.score,
          totalScore: scoreData.totalScore,
          questionResults: calculateQuestionResults(tempSelectedList, answers, originalQuestions)
        }
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Đã xảy ra lỗi khi nộp bài thi. Vui lòng thử lại.");
    }
  }, [
    selectedList,
    selectedAnswers,
    originalQuestions,
    originalOrder,
    answers,
    studInfo,
    startTime,
    questionIndexMapping,
    calculateScore,
    calculateQuestionResults,
    pin,
    currentAttemptId,
    navigate
  ]);

  return { onSubmit };
};


