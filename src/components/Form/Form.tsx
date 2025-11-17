import React, { useState, useReducer, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';
import { collection, getDocs } from 'firebase/firestore/lite';
import db from '../../services/firebaseConfig';
import { useQuizData } from './Form/hooks/useQuizData';
import { selectedAnswersReducer } from './Form/hooks/selectedAnswersReducer';
import { useAnswerHandling } from './Form/hooks/useAnswerHandling';
import { useAnswerRestoration } from './Form/hooks/useAnswerRestoration';
import { useProgressSaving } from './Form/hooks/useProgressSaving';
import { useQuizSubmission } from './Form/hooks/useQuizSubmission';
import { useStudentInfoSubmission } from './Form/hooks/useStudentInfoSubmission';
import { useQuizLoading } from './Form/hooks/useQuizLoading';
import { useTimer } from './Form/hooks/useTimer';
import { useAutoSave } from './Form/hooks/useAutoSave';
import { calculateScore, calculateQuestionResults } from './Form/utils/scoreCalculation';
import { shuffleQuestionsAndAnswers } from './Form/utils/questionShuffling';
import { getUserIdentifier } from './Form/utils';
import { StudentInfoForm } from './Form/components/StudentInfoForm';
import { ResumeExamBanner } from './Form/components/ResumeExamBanner';
import { QuizHeader } from './Form/components/QuizHeader';
import { AttemptHistory } from './Form/components/AttemptHistory';
import { QuestionList } from './Form/components/QuestionList';
import { Question, StudentAnswer, Attempt, QuestionResult, StudentInfo, OrderMapping } from './Form/types';

const Form: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  
  // Quiz state
  const [selectedList, setSelectedList] = useState<StudentAnswer[]>([]);
  const [selectedAnswers, dispatchSelectedAnswers] = useReducer(selectedAnswersReducer, {});
  const [studInfo, setStudInfo] = useState<StudentInfo>({
    name: "",
    email: "",
    roll_no: "",
    class: ""
  });
  
  // Quiz control state
  const [isStudentInfoSubmitted, setIsStudentInfoSubmitted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [canResume, setCanResume] = useState<boolean>(false);
  const [previousAttemptData, setPreviousAttemptData] = useState<any>(null);
  
  // Result state - removed as we navigate to separate ResultSummary page
  
  // New state for retakes and history
  const [previousAttempts, setPreviousAttempts] = useState<Attempt[]>([]);
  const [showRetakeOption, setShowRetakeOption] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  
  // Fetch quiz data using custom hook
  const quizData = useQuizData(pin, canResume);
  const {
    questions: quizQuestions,
    setQuestions: setQuestionsFromHook,
    originalQuestions,
    originalOrder,
    setOriginalOrder: setOriginalOrderFromHook,
    answers,
    title,
    status,
    duration
  } = quizData;

  const [questions, setQuestions] = useState<Question[] | string>([]);
  const [originalOrderState, setOriginalOrderState] = useState<OrderMapping>(originalOrder);
  
  const questionsArray = Array.isArray(questions) ? questions : [];

  // Calculate question index mapping for answer tracking
  const questionIndexMapping = useMemo(() => {
    const mapping: { [key: number]: number } = {};
    Object.keys(originalOrder).forEach(origIdx => {
      const newIdx = originalOrder[origIdx]?.newIndex;
      if (newIdx !== undefined) {
        mapping[newIdx] = parseInt(origIdx);
      }
    });
    return mapping;
  }, [originalOrder]);

  // Shuffle questions and answers
  const shuffleQuestionsAndAnswersMemo = useCallback((questions: Question[]) => {
    return shuffleQuestionsAndAnswers(questions);
  }, []);

  // Calculate results
  const calculateQuestionResultsMemo = useCallback((studentAnswers: StudentAnswer[], correctAnswers: any[], quizQuestions: Question[]) => {
    return calculateQuestionResults(studentAnswers, correctAnswers, quizQuestions);
  }, []);

  const calculateScoreMemo = useCallback((studentAnswers: StudentAnswer[], correctAnswers: any[], quizQuestions: Question[]) => {
    return calculateScore(studentAnswers, correctAnswers, quizQuestions);
  }, []);

  // Progress saving
  const { saveCurrentProgress, saveProgressImmediate } = useProgressSaving({
    selectedList,
    originalOrder,
    isStudentInfoSubmitted,
    studInfo,
    pin,
    currentAttemptId
  });

  // Answer restoration
  const { restorePreviousAnswers } = useAnswerRestoration({
    originalQuestions,
    dispatchSelectedAnswers,
    setSelectedList
  });

  // Answer handling
  const { handleAnswerSelect, handleShortAnswerChange } = useAnswerHandling({
    questionIndexMapping,
    originalOrder,
    originalQuestions,
    dispatchSelectedAnswers,
    setSelectedList,
    saveCurrentProgress
  });

  // Quiz loading
  useQuizLoading({
    pin,
    isStudentInfoSubmitted,
    canResume,
    setQuestions: ((qs: Question[] | string) => {
      setQuestions(qs);
      if (typeof qs !== 'string') {
        setQuestionsFromHook(qs);
      }
    }) as React.Dispatch<React.SetStateAction<Question[] | string>>,
    setOriginalOrder: ((order: OrderMapping) => {
      setOriginalOrderState(order);
      setOriginalOrderFromHook(order);
    }) as React.Dispatch<React.SetStateAction<OrderMapping>>,
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
    onCompletedAttemptFound: (attemptId: string, userEmail: string) => {
      // Redirect to result summary if user tries to access exam after submission
      if (pin) {
        navigate(`/pinverify/Form/${pin}/ResultSummary/${userEmail}/${attemptId}`);
      }
    }
  });

  // Load previous attempts from Responses collection
  useEffect(() => {
    async function loadPreviousAttempts() {
      if (!pin) return;
      
      try {
        const userIdentifier = getUserIdentifier();
        const responsesRef = collection(db, "Paper_Setters", pin, "Responses");
        const responsesSnapshot = await getDocs(responsesRef);
        
        const attempts: Attempt[] = [];
        responsesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          // Check if this response belongs to current user (by email prefix)
          if (data.stud_info?.email === userIdentifier || doc.id.startsWith(`${userIdentifier}_`)) {
            if (data.status === "completed" && data.attemptId) {
              attempts.push({
                id: data.attemptId,
                attemptNumber: data.attemptNumber || 0,
                submittedAt: data.submittedAt,
                score: data.score || `${data.scoreQ || 0}/${data.scoreAll || 0}`,
                status: data.status
              });
            }
          }
        });
        
        // Sort by attemptNumber descending
        attempts.sort((a, b) => (b.attemptNumber || 0) - (a.attemptNumber || 0));
        setPreviousAttempts(attempts);
      } catch (error) {
        console.error("Error loading previous attempts:", error);
      }
    }
    
    loadPreviousAttempts();
  }, [pin]);

  // Student info submission
  const { handleStudentInfoSubmit } = useStudentInfoSubmission({
    pin,
    originalOrder,
    previousAttempts,
    title,
    setStudInfo,
    setCurrentAttemptId,
    setIsStudentInfoSubmitted,
    setStartTime
  });

  // Quiz submission - use useQuizSubmission hook
  const { onSubmit: handleQuizSubmit } = useQuizSubmission({
    selectedList,
    selectedAnswers,
    originalQuestions,
    originalOrder,
    answers,
    studInfo,
    startTime,
    questionIndexMapping,
    calculateScore: calculateScoreMemo,
    calculateQuestionResults: calculateQuestionResultsMemo,
    pin,
    currentAttemptId,
    previousAttempts,
    title
  });

  // Handle submit button click
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    handleQuizSubmit();
  }, [handleQuizSubmit]);

  // Timer
  useTimer({
    startTime,
    duration: duration || null,
    setRemainingTime,
    onTimeUp: () => {
      saveProgressImmediate();
      handleSubmit();
    }
  });

  // Auto-save
  useAutoSave({
    isStudentInfoSubmitted,
    studInfo,
    currentAttemptId,
    selectedList,
    originalOrder,
    pin,
    saveProgressImmediate
  });

  // Question components
  const QuestionComponents = useMemo(() => {
    if (!Array.isArray(questions)) return null;
    return (
      <QuestionList
        questions={questions}
        selectedAnswers={selectedAnswers}
        canResume={canResume}
        selectedList={selectedList}
        questionIndexMapping={questionIndexMapping}
        onAnswerSelect={handleAnswerSelect}
        onShortAnswerChange={handleShortAnswerChange}
        onShortAnswerBlur={(questionIndex, value) => {
          handleShortAnswerChange(questionIndex, value);
          saveProgressImmediate();
        }}
      />
    );
  }, [
    questionsArray,
    selectedAnswers,
    canResume,
    selectedList,
    questionIndexMapping,
    handleAnswerSelect,
    handleShortAnswerChange,
    saveProgressImmediate
  ]);

  // Main render
  const mathJaxConfig = {
    loader: { 
      load: ["[tex]/html", "[tex]/mhchem"] 
    },
    tex: {
      packages: { "[+]": ["html", "mhchem"] },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ]
    }
  };

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <form 
        id="mainForm" 
        className={!isStudentInfoSubmitted ? "" : "m-4 md:m-10 lg:m-14"}
        onSubmit={(e) => e.preventDefault()}
      >
        {questionsArray.length !== 0 ? (
          Array.isArray(questions) ? (
            showRetakeOption || showHistory ? (
              <AttemptHistory 
                attempts={previousAttempts} 
                pin={pin}
                userEmail={getUserIdentifier()}
                onRetakeClick={() => {
                  setShowRetakeOption(false);
                  setShowHistory(false);
                  setIsStudentInfoSubmitted(false);
                }}
              />
            ) : (
              status !== "inactive" ? (
                !isStudentInfoSubmitted ? (
                  <StudentInfoForm 
                    onSubmit={(e) => handleStudentInfoSubmit(e)} 
                    examTitle={title}
                    duration={duration}
                    onViewHistory={() => setShowHistory(true)}
                    hasHistory={previousAttempts.length > 0}
                  />
                ) : (
                  <div className="max-w-4xl mx-auto">
                    <QuizHeader title={title} remainingTime={remainingTime} />
                    
                    {canResume && remainingTime !== null && (
                      <ResumeExamBanner remainingTime={remainingTime} />
                    )}
                    
                    {QuestionComponents}
                    
                    <div className="flex justify-center mt-8 mb-8">
                      <button
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <p className="centeredP">Người tạo đã khóa bài thi.</p>
              )
            )
          ) : (
            <p className="centeredP">Bài thi không tồn tại hoặc người tạo đã xóa bài thi.</p>
          )
        ) : (
          <p className="centeredP">Đang tải...</p>
        )}
      </form>
    </MathJaxContext>
  );
};

export default Form;

