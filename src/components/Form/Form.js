import { useEffect, useState, useMemo, useCallback, useReducer } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import db, { realtimeDatabase } from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore/lite";
import {
  ref,
  set,
  update,
  get,
  onValue,
  off,
  serverTimestamp as rtdbServerTimestamp
} from "firebase/database";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
// import { info } from "autoprefixer";
// import { MathJaxContext, MathJax } from 'better-react-mathjax';

// Utility for guest users
const getGuestId = () => {
  let guestId = localStorage.getItem('quizstar_guest_id');
  if (!guestId) {
    guestId = `guest_${uuid()}`;
    localStorage.setItem('quizstar_guest_id', guestId);
  }
  return guestId;
};

// Get user email or guest ID
const getUserIdentifier = () => {
  const auth = getAuth();
  if (auth.currentUser && auth.currentUser.email) {
    return auth.currentUser.email;
  }
  return getGuestId();
};

// Get user ID (UID) or guest ID for path identification in Realtime Database
const getUserIdForPath = () => {
  const auth = getAuth();
  if (auth.currentUser && auth.currentUser.uid) {
    return auth.currentUser.uid;
  }
  return getGuestId();
};

// Check if user is authenticated
const isUserAuthenticated = () => {
  const auth = getAuth();
  return !!auth.currentUser;
};

// Memoized MathJax component to prevent re-renders
const MemoizedMathJax = React.memo(({ children, ...props }) => (
  <MathJax {...props}>{children}</MathJax>
));

// Utility functions
const firestoreTimestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  return new Date(timestamp);
};

const calculateRemainingTime = (startTimestamp, durationMinutes) => {
  if (!startTimestamp || !durationMinutes) return null;
  const startTime = firestoreTimestampToDate(startTimestamp);
  if (!startTime) return null;
  const now = new Date();
  const elapsedMs = now - startTime;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const remainingMinutes = durationMinutes - elapsedMinutes;
  return remainingMinutes > 0 ? remainingMinutes : 0;
};

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Custom hooks
const useQuizData = (pin, canResume) => {
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [originalOrder, setOriginalOrder] = useState({});
  const [answers, setAnswers] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState(null);
  
  useEffect(() => {
    if (!pin || canResume === undefined) return;
    
    async function fetchQuizData() {
      try {
        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin.toString(),
          "Question_Papers_MCQ"
        );
        const docos = await getDocs(settersCollectionRef);
        
        if (docos.docs.length > 0) {
          const docosData = docos.docs.map((doc) => doc.data());
          if (docosData.length > 0 && docosData[0].question_question) {
            setTitle(docos.docs[0].id);
            const origQuestions = docosData[0].question_question;
            setOriginalQuestions(origQuestions);
            
            // Fetch answers
            if (docos.docs.length > 1) {
              setAnswers(docosData[1].answer_answer || []);
            } else {
              const answerDocs = await getDocs(
                collection(db, "Paper_Setters", pin.toString(), "Question_Papers_MCQ")
              );
              
              for (const doc of answerDocs.docs) {
                if (doc.id.includes('_answerSheet') || doc.data().answer_answer) {
                  setAnswers(doc.data().answer_answer || []);
                  break;
                }
              }
            }
            
            setStatus(docosData[0].status);
            setDuration(docosData[0].duration);
            
            return origQuestions;
          }
        }
        return null;
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        return null;
      }
    }
    
    fetchQuizData();
  }, [pin, canResume]);
  
  return {
    questions,
    setQuestions,
    originalQuestions,
    originalOrder,
    setOriginalOrder,
    answers,
    title,
    status,
    duration
  };
};

// Reducer for student answers
const selectedAnswersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MCQ_ANSWER':
      return {
        ...state,
        [action.questionIndex]: action.optionIndex
      };
    case 'SET_TF_ANSWER':
      return {
        ...state,
        [`tf_${action.questionIndex}_${action.optionIndex}`]: action.isTrue
      };
    case 'RESTORE_ANSWERS':
      return action.answers;
    case 'RESET':
      return {};
    default:
      return state;
  }
};

// Component for MCQ option
const MCQOption = React.memo(({ 
  questionIndex, 
  optionIndex, 
  option, 
  isSelected, 
  onSelect 
}) => {
  const optionStr = JSON.stringify(option);
  console.log(`🔍 [DEBUG MCQOption] Rendering option ${optionIndex} for question ${questionIndex}:`, {
    option: option,
    optionOption: option?.option,
    optionOptionFull: option?.option,
    optionType: typeof option?.option,
    optionKeys: Object.keys(option || {}),
    optionStringified: optionStr,
    isSelected: isSelected
  });
  console.log(`📦 [DEBUG MCQOption] Full option JSON for Q${questionIndex} Opt${optionIndex}:`, optionStr);
  
  return (
    <div key={uuid()} className="mb-2">
      <div
        id={`${questionIndex}-${optionIndex}`}
        className={`flex items-start p-2 rounded cursor-pointer transition-colors ${
          isSelected
            ? 'bg-blue-100 border border-blue-300'
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}
        onClick={() => onSelect(questionIndex, optionIndex)}
      >
        <span className="font-medium mr-2 flex-shrink-0">{String.fromCharCode(65 + optionIndex)}.</span>
        <div className="prose-sm max-w-none flex-1 text-gray-700">
          {option.option && option.option.trim() ? (
            <MemoizedMathJax inline dynamic>{option.option}</MemoizedMathJax>
          ) : (
            <span className="text-gray-400 italic">Chưa có nội dung lựa chọn</span>
          )}
        </div>
        {isSelected && (
          <span className="ml-2 text-blue-600 font-semibold text-sm flex-shrink-0">✓</span>
        )}
      </div>
      <input
        type="radio"
        className="hidden"
        value={optionIndex + 1}
        name={`question_${questionIndex}`}
        checked={isSelected}
        onChange={() => onSelect(questionIndex, optionIndex)}
      />
    </div>
  );
});

// Component for True/False option
const TrueFalseOption = React.memo(({ 
  questionIndex, 
  optionIndex, 
  option, 
  selectedValue, 
  onSelect 
}) => {
  return (
    <div key={`tf-${questionIndex}-${optionIndex}`} className="mb-4">
      <MemoizedMathJax inline dynamic className="font-medium text-gray-700 mb-2">
        {String.fromCharCode(97 + optionIndex)}. {option.option}
      </MemoizedMathJax>
      <div className="flex space-x-4 ml-4 mt-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selectedValue === true
              ? 'bg-green-100 border-green-500 text-green-700'
              : 'hover:bg-gray-50 border-gray-300 text-gray-700'
          }`}
          onClick={() => onSelect(questionIndex, optionIndex, true, true)}
        >
          Đúng
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selectedValue === false
              ? 'bg-red-100 border-red-500 text-red-700'
              : 'hover:bg-gray-50 border-gray-300 text-gray-700'
          }`}
          onClick={() => onSelect(questionIndex, optionIndex, true, false)}
        >
          Sai
        </button>
      </div>
    </div>
  );
});

// StudentInfoForm component
const StudentInfoForm = React.memo(({ onSubmit }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thông tin học sinh</h2>
      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studName">
            Họ và tên
          </label>
          <input
            type="text"
            id="studName"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Nhập họ và tên"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studClass">
            Lớp
          </label>
          <input
            type="text"
            id="studClass"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Nhập lớp"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studSchool">
            Trường
          </label>
          <input
            type="text"
            id="studSchool"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Nhập trường"
          />
        </div>
        <button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Bắt đầu làm bài
        </button>
      </div>
    </div>
  );
});

// ResumeExamBanner component
const ResumeExamBanner = React.memo(({ remainingTime }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div>
          <p className="text-yellow-700">
            Bạn đang tiếp tục làm bài thi. Thời gian còn lại: {remainingTime} phút.
          </p>
        </div>
      </div>
    </div>
  );
});

// QuizHeader component
const QuizHeader = React.memo(({ title, remainingTime }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center">
        <h1 id="quiz_title" className="text-2xl font-bold text-gray-800">
          {title}
        </h1>
        {remainingTime !== null && (
          <div className="text-xl font-bold text-blue-600">
            Thời gian còn lại: {remainingTime} phút
          </div>
        )}
      </div>
    </div>
  );
});

// AttemptHistoryItem component
const AttemptHistoryItem = React.memo(({ attempt, onViewClick }) => {
  const date = firestoreTimestampToDate(attempt.submittedAt);
  const formattedDate = date ? 
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : 'N/A';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 flex justify-between items-center">
      <div>
        <p className="font-medium">Lần thử #{attempt.attemptNumber}</p>
        <p className="text-gray-600 text-sm">Nộp lúc: {formattedDate}</p>
        <p className="text-blue-600">Điểm: {attempt.score}</p>
      </div>
      <button
        onClick={() => onViewClick(attempt.id)}
        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        Xem chi tiết
      </button>
    </div>
  );
});

// AttemptHistory component
const AttemptHistory = React.memo(({ attempts, pin, userEmail, onRetakeClick }) => {
  const sortedAttempts = [...attempts].sort((a, b) => 
    (b.attemptNumber || 0) - (a.attemptNumber || 0)
  );
  
  const handleViewClick = (attemptId) => {
    window.open(`/pinverify/Form/${pin}/ResultFetch/${userEmail}/${attemptId}`, '_blank');
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch sử làm bài</h2>
      
      {sortedAttempts.length === 0 ? (
        <p className="text-gray-600">Chưa có lần thi nào được hoàn thành.</p>
      ) : (
        <div className="space-y-3">
          {sortedAttempts.map(attempt => (
            <AttemptHistoryItem 
              key={attempt.id} 
              attempt={attempt} 
              onViewClick={handleViewClick}
            />
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={onRetakeClick}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Làm lại bài thi
        </button>
      </div>
    </div>
  );
});

// Main Form component
function Form() {
  const { pin } = useParams();
  const navigate = useNavigate();
  
  // Quiz state
  const [selectedList, setSelectedList] = useState([]);
  const [selectedAnswers, dispatchSelectedAnswers] = useReducer(selectedAnswersReducer, {});
  const [studInfo, setStudInfo] = useState({
    name: "",
    email: "",
    roll_no: "",
    class: ""
  });
  
  // Quiz control state
  const [isStudentInfoSubmitted, setIsStudentInfoSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canResume, setCanResume] = useState(false);
  const [previousAttemptData, setPreviousAttemptData] = useState(null);
  
  // Result state
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [viewMode, setViewMode] = useState('answers'); // 'answers' or 'mywork'

  // New state for retakes and history
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [showRetakeOption, setShowRetakeOption] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentAttemptId, setCurrentAttemptId] = useState(null);
  
  // Fetch quiz data using custom hook
  const quizData = useQuizData(pin, canResume);
  const {
    questions,
    setQuestions,
    originalQuestions,
    originalOrder,
    setOriginalOrder,
    answers,
    title,
    status,
    duration
  } = quizData;

  // Calculate question index mapping for answer tracking
  const questionIndexMapping = useMemo(() => {
    const mapping = {};
    Object.keys(originalOrder).forEach(origIdx => {
      const newIdx = originalOrder[origIdx].newIndex;
      mapping[newIdx] = parseInt(origIdx);
    });
    return mapping;
  }, [originalOrder]);

  // Shuffle questions and answers - optimize to avoid unnecessary calculations
  const shuffleQuestionsAndAnswers = useCallback((questions) => {
    const newOrder = {};
    
    const shuffledQuestions = questions.map((question, originalQuestionIndex) => {
      const newQuestion = { ...question };
      
      if (question.type === "mcq") {
        const optionPairs = question.options.map((opt, idx) => ({ option: opt, originalIndex: idx }));
        const shuffledPairs = shuffleArray([...optionPairs]);
        
        newOrder[originalQuestionIndex] = {
          newIndex: originalQuestionIndex,
          optionMapping: shuffledPairs.reduce((map, pair, newIndex) => {
            map[newIndex] = pair.originalIndex;
            return map;
          }, {})
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
  }, []);

  // Calculate results for each question
  const calculateQuestionResults = useCallback((studentAnswers, correctAnswers, quizQuestions) => {
    if (!studentAnswers || !correctAnswers || !quizQuestions) return [];
    
    return quizQuestions.map((question, index) => {
      if (question.type === 'textblock') {
        return { isCorrect: null, score: 0, maxScore: 0 };
      }
      
      const userAnswer = studentAnswers[index];
      const correctAnswer = correctAnswers[index];
      const questionScore = parseFloat(question.score || 1);
      
      if (!userAnswer || !correctAnswer) {
        return { isCorrect: false, score: 0, maxScore: questionScore };
      }
      
      let isCorrect = false;
      let earnedScore = 0;
      
      if (question.type === "mcq") {
        isCorrect = parseInt(correctAnswer.answer) === parseInt(userAnswer.selectedAnswer);
        earnedScore = isCorrect ? questionScore : 0;
      } else if (question.type === "shortanswer") {
        const validAnswers = Array.isArray(correctAnswer.answer) 
          ? correctAnswer.answer 
          : [correctAnswer.answer].filter(a => a);
        const userAnswerTrimmed = String(userAnswer.selectedAnswer || '').trim().toLowerCase();
        isCorrect = validAnswers.some(ans => 
          String(ans).trim().toLowerCase() === userAnswerTrimmed
        );
        earnedScore = isCorrect ? questionScore : 0;
      } else if (question.type === "truefalse") {
        const correctOptions = correctAnswer.answer;
        const selectedOptions = userAnswer.selectedAnswer;
        
        if (Array.isArray(correctOptions) && Array.isArray(selectedOptions)) {
          let matchingCount = 0;
          for (let j = 0; j < correctOptions.length; j++) {
            if (correctOptions[j] === selectedOptions[j]) {
              matchingCount++;
            }
          }
          
          let percentScore = 0;
          if (correctOptions.length > 0) {
            switch(matchingCount) {
              case 0: percentScore = 0; break;
              case 1: percentScore = correctOptions.length <= 2 ? 0.5 : 0.1; break;
              case 2: percentScore = correctOptions.length <= 3 ? 0.75 : 0.25; break;
              case 3: percentScore = 0.5; break;
              case 4: percentScore = 1; break;
              default: percentScore = matchingCount / correctOptions.length;
            }
          }
          
          earnedScore = questionScore * percentScore;
          isCorrect = percentScore === 1;
        }
      }
      
      return { 
        isCorrect: isCorrect, 
        score: earnedScore, 
        maxScore: questionScore 
      };
    });
  }, []);

  // Calculate score based on student answers
  const calculateScore = useCallback((studentAnswers, correctAnswers, quizQuestions) => {
    if (!studentAnswers || !correctAnswers || !quizQuestions) {
      return { score: 0, totalScore: 0 };
    }
    
    let totalScore = 0;
    let earnedScore = 0;
    
    for (let i = 0; i < quizQuestions.length; i++) {
      const question = quizQuestions[i];
      const userAnswer = studentAnswers[i];
      const correctAnswer = correctAnswers[i];
      
      if (!question || !userAnswer || !correctAnswer) continue;
      
      totalScore += parseFloat(question.score || 1);
      
      if (question.type === "mcq") {
        if (parseInt(correctAnswer.answer) === parseInt(userAnswer.selectedAnswer)) {
          earnedScore += parseFloat(question.score || 1);
        }
      } else if (question.type === "shortanswer") {
        // Check if user answer matches any of the valid answers (case-insensitive)
        const validAnswers = Array.isArray(correctAnswer.answer) 
          ? correctAnswer.answer 
          : [correctAnswer.answer].filter(a => a);
        const userAnswerTrimmed = String(userAnswer.selectedAnswer || '').trim().toLowerCase();
        const isCorrect = validAnswers.some(ans => 
          String(ans).trim().toLowerCase() === userAnswerTrimmed
        );
        if (isCorrect) {
          earnedScore += parseFloat(question.score || 1);
        }
      } 
      else if (question.type === "truefalse") {
        const correctOptions = correctAnswer.answer;
        const selectedOptions = userAnswer.selectedAnswer;
        
        if (!Array.isArray(correctOptions) || !Array.isArray(selectedOptions)) continue;
        
        let matchingCount = 0;
        for (let j = 0; j < correctOptions.length; j++) {
          if (correctOptions[j] === selectedOptions[j]) {
            matchingCount++;
          }
        }

        // Partial scoring for true/false questions
        let percentScore = 0;
        if (correctOptions.length > 0) {
          switch(matchingCount) {
            case 0: percentScore = 0; break;
            case 1: percentScore = correctOptions.length <= 2 ? 0.5 : 0.1; break;
            case 2: percentScore = correctOptions.length <= 3 ? 0.75 : 0.25; break;
            case 3: percentScore = 0.5; break;
            case 4: percentScore = 1; break;
            default: percentScore = matchingCount / correctOptions.length;
          }

          earnedScore += (parseFloat(question.score || 1) * percentScore);
        }
      }
    }
    
    return { 
      score: earnedScore, 
      totalScore: totalScore,
      scoreQ: earnedScore,
      scoreAll: totalScore
    };
  }, []);

  // Restore previous answers to UI state
  const restorePreviousAnswers = useCallback((previousAnswers, orderMapping) => {
    if (!previousAnswers || !Array.isArray(previousAnswers)) {
      console.log('⚠️ restorePreviousAnswers: Invalid previousAnswers', previousAnswers);
      return;
    }
    
    console.log('🔄 Restoring answers:', {
      answersCount: previousAnswers.length,
      orderMappingKeys: Object.keys(orderMapping || {}).length
    });
    
    const restoredAnswers = {};
    let restoredCount = 0;
    
    previousAnswers.forEach((answer, originalIndex) => {
      // Skip if answer is null/undefined
      if (!answer) return;
      
      // Skip if selectedAnswer is undefined (but allow null and empty string for short answers)
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
        const originalOptionIndex = answer.selectedAnswer;
        
        // Find new option index from original option index
        let newOptionIndex = null;
        for (const [newIdx, origIdx] of Object.entries(optionMapping)) {
          if (parseInt(origIdx) === originalOptionIndex) {
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
        // Short answer is already in selectedList, just need to ensure it's set
        restoredCount++;
        console.log(`✅ Restored Short Answer Q${originalIndex} -> Q${newQuestionIndex}: "${answer.selectedAnswer}"`);
      }
    });
    
    console.log(`✅ Restored ${restoredCount} answers total`);
    dispatchSelectedAnswers({ type: 'RESTORE_ANSWERS', answers: restoredAnswers });
    
    // Ensure selectedList is set with all answers (including short answers)
    setSelectedList(previousAnswers);
  }, [originalQuestions]);

  // Helper function to clean data before saving (remove undefined values)
  const cleanDataForFirestore = useCallback((data) => {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (item === null || item === undefined) {
          return null; // Keep null but remove undefined
        }
        if (typeof item === 'object') {
          const cleaned = {};
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
      const cleaned = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
    return data;
  }, []);

  // Save current progress with debounce (realtime) - Using Realtime Database
  const saveCurrentProgress = useCallback(
    debounce(async () => {
      if (isStudentInfoSubmitted && studInfo.email && currentAttemptId) {
        try {
          // Clean data to remove undefined values
          const cleanedSelectedList = cleanDataForFirestore(selectedList);
          const cleanedOrderMapping = cleanDataForFirestore(originalOrder);
          
          // Save to Realtime Database (realtime sync)
          // Use user ID (UID) instead of email for path to avoid special characters
          const userId = getUserIdForPath();
          const progressPath = `quiz_progress/${pin}/${userId}/${currentAttemptId}`;
          const progressRef = ref(realtimeDatabase, progressPath);
          
          await set(progressRef, {
            selected_answers: cleanedSelectedList,
            orderMapping: cleanedOrderMapping,
            email: studInfo.email, // Store email in data, not in path
            lastUpdated: Date.now(),
            timestamp: rtdbServerTimestamp()
          });
          
          // Also save to localStorage as backup
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
          // Try to save to localStorage even if Realtime DB fails
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
      }
    }, 500), // Reduced debounce to 500ms for more realtime feel with Realtime DB
    [selectedList, isStudentInfoSubmitted, studInfo.email, pin, currentAttemptId, originalOrder, cleanDataForFirestore]
  );

  // Immediate save (no debounce) for critical operations - Using Realtime Database
  const saveProgressImmediate = useCallback(async () => {
    if (isStudentInfoSubmitted && studInfo.email && currentAttemptId) {
      try {
        // Clean data to remove undefined values
        const cleanedSelectedList = cleanDataForFirestore(selectedList);
        const cleanedOrderMapping = cleanDataForFirestore(originalOrder);
        
        // Save to Realtime Database immediately
        // Use user ID (UID) instead of email for path to avoid special characters
        const userId = getUserIdForPath();
        const progressPath = `quiz_progress/${pin}/${userId}/${currentAttemptId}`;
        const progressRef = ref(realtimeDatabase, progressPath);
        
        await set(progressRef, {
          selected_answers: cleanedSelectedList,
          orderMapping: cleanedOrderMapping,
          email: studInfo.email, // Store email in data, not in path
          lastUpdated: Date.now(),
          timestamp: rtdbServerTimestamp()
        });
        
        // Also save to localStorage
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
        // Try to save to localStorage even if Realtime DB fails
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
    }
  }, [selectedList, isStudentInfoSubmitted, studInfo.email, pin, currentAttemptId, originalOrder, cleanDataForFirestore]);

  // Load quiz data and check for previous attempts
  useEffect(() => {
    async function getQuestions() {
      try {
      const settersCollectionRef = collection(
        db,
        "Paper_Setters",
        pin.toString(),
        "Question_Papers_MCQ"
      );
      const docos = await getDocs(settersCollectionRef);
        
      if (docos.docs.length > 0) {
        const attemptPromise = new Promise((res, rej) => {
          getAuth().onAuthStateChanged(async function (user) {
            if (user) {
              // Check if user has attempted this exam
                const userAttemptsRef = collection(
                  db, 
                  "Users", 
                  user.uid, 
                  "Exams_Attempted",
                  pin,
                  "Attempts"
                );
                
                // Get all attempts for this exam
                const attemptsSnapshot = await getDocs(userAttemptsRef);
                const attempts = attemptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Check if there's an in-progress attempt
                const inProgressAttempt = attempts.find(a => a.status === "in_progress");
                
                if (inProgressAttempt) {
                // Get the response document to check progress (from Firestore for initial data)
                const responseDoc = await getDoc(
                    doc(db, "Paper_Setters", pin.toString(), "Responses", `${user.email}_${inProgressAttempt.id}`)
                );
                
                // Also try to get progress from Realtime Database
                // Use user ID (UID) instead of email for path
                const userId = user.uid;
                const progressPath = `quiz_progress/${pin}/${userId}/${inProgressAttempt.id}`;
                const progressRef = ref(realtimeDatabase, progressPath);
                let realtimeProgress = null;
                
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
                  
                  // If there's time left, allow resuming
                  if (remainingTime > 0) {
                    // Prefer Realtime Database progress if available (more up-to-date)
                    const selectedAnswers = realtimeProgress?.selected_answers || responseData.selected_answers || [];
                    const orderMapping = realtimeProgress?.orderMapping || responseData.orderMapping;
                    
                    res({ 
                      attempted: true, 
                      canResume: true, 
                      startTime: responseData.startedAt,
                      remainingTime: remainingTime,
                      studInfo: responseData.stud_info,
                      selected_answers: selectedAnswers,
                      orderMapping: orderMapping,
                      attemptId: inProgressAttempt.id
                    });
                  } else {
                      // Time expired, finalize this attempt
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
                  // No in-progress attempt found
                  res({ 
                    attempted: false,
                    previousAttempts: attempts.filter(a => a.status === "completed")
                  });
              }
            } else {
              res({ attempted: false });
            }
          });
        });

        const attemptStatus = await attemptPromise;
        
        if (attemptStatus.attempted && !attemptStatus.canResume) {
            // Instead of redirecting, show previous results and option to retake
            setPreviousAttempts(attemptStatus.previousAttempts || []);
            setShowRetakeOption(true);
        } else {
          const docosData = docos.docs.map((doc) => doc.data());
          if (docosData.length > 0 && docosData[0].question_question) {
            const originalQuestions = docosData[0].question_question;
            
            let shuffledData;
              // If resuming with original order mapping, use it
            if (attemptStatus.canResume && attemptStatus.orderMapping) {
              shuffledData = {
                  shuffledQuestions: [], 
                orderMapping: attemptStatus.orderMapping
              };
              
                // Reconstruct shuffled questions
              const orderMapping = attemptStatus.orderMapping;
              const reconstructedQuestions = [];
              
              Object.keys(orderMapping).forEach(origIdx => {
                const originalIndex = parseInt(origIdx);
                const newIndex = orderMapping[origIdx].newIndex;
                const optionMapping = orderMapping[origIdx].optionMapping || {};
                
                const originalQuestion = {...originalQuestions[originalIndex]};
                
                if (originalQuestion.type === "mcq" && originalQuestion.options) {
                  const newOptions = new Array(originalQuestion.options.length);
                  
                  for (const [newIdx, origOptIdx] of Object.entries(optionMapping)) {
                    newOptions[parseInt(newIdx)] = originalQuestion.options[origOptIdx];
                  }
                  
                  originalQuestion.options = newOptions;
                }
                
                while (reconstructedQuestions.length <= newIndex) {
                  reconstructedQuestions.push(null);
                }
                
                reconstructedQuestions[newIndex] = originalQuestion;
              });
              
              shuffledData.shuffledQuestions = reconstructedQuestions.filter(q => q !== null);
            } else {
                // Generate new shuffled order
              shuffledData = shuffleQuestionsAndAnswers(originalQuestions);
            }
            
            setQuestions(shuffledData.shuffledQuestions);
            setOriginalOrder(shuffledData.orderMapping);
            
              // If resumable attempt
            if (attemptStatus.canResume) {
              setCanResume(true);
              setPreviousAttemptData(attemptStatus);
              setStartTime(firestoreTimestampToDate(attemptStatus.startTime));
              setRemainingTime(attemptStatus.remainingTime);
              setStudInfo(attemptStatus.studInfo);
              setIsStudentInfoSubmitted(true);
                setCurrentAttemptId(attemptStatus.attemptId);
              
              // Restore previous answers
              console.log('🔄 Attempting to restore answers...', {
                hasSelectedAnswers: !!attemptStatus.selected_answers,
                selectedAnswersLength: attemptStatus.selected_answers?.length,
                hasOrderMapping: !!attemptStatus.orderMapping
              });
              
              if (Array.isArray(attemptStatus.selected_answers) && attemptStatus.selected_answers.length > 0) {
                console.log('✅ Restoring from Firestore:', attemptStatus.selected_answers);
                restorePreviousAnswers(attemptStatus.selected_answers, shuffledData.orderMapping);
              } else {
                // Try to restore from localStorage as backup
                console.log('⚠️ No Firestore data, trying localStorage...');
                try {
                  const backupKey = `quiz_progress_${pin}_${attemptStatus.attemptId}`;
                  const backupData = localStorage.getItem(backupKey);
                  if (backupData) {
                    const parsed = JSON.parse(backupData);
                    console.log('📦 Found localStorage backup:', parsed);
                    if (parsed.selected_answers && Array.isArray(parsed.selected_answers) && parsed.selected_answers.length > 0) {
                      console.log('✅ Restoring from localStorage:', parsed.selected_answers);
                      restorePreviousAnswers(parsed.selected_answers, shuffledData.orderMapping);
                    } else {
                      console.log('⚠️ localStorage backup is empty or invalid');
                    }
                  } else {
                    console.log('⚠️ No localStorage backup found');
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
  }, [pin, isStudentInfoSubmitted, canResume, navigate, shuffleQuestionsAndAnswers, restorePreviousAnswers]);

  // Handle student info submission
  async function handleStudentInfoSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("studName").value;
    const className = document.getElementById("studClass").value;
    const school = document.getElementById("studSchool").value;
    
    if (!name || !className || !school) {
      alert("Vui lòng điền đầy đủ thông tin học sinh.");
      return;
    }
    
    // Use the helper function to get user identifier (email or guest ID)
    const userIdentifier = getUserIdentifier();
    
    const studentData = {
      name: name,
      email: userIdentifier,
      class: className,
      school: school
    };
    setStudInfo(studentData);
    
    // Create a unique attempt ID
    const attemptId = uuid();
    setCurrentAttemptId(attemptId);
    
    // Save attempt to database
    const now = new Date();
    try {
      // Batch operations for better reliability
      const batch = writeBatch(db);
      
      // Create a record in Responses collection with attempt ID in the document name
      const responseRef = doc(
        db,
        "Paper_Setters",
        pin.toString(),
        "Responses",
        `${userIdentifier}_${attemptId}`
      );
      
      batch.set(responseRef, {
        stud_info: studentData,
        startedAt: now,
        status: "in_progress",
        selected_answers: [],
        orderMapping: originalOrder,
        attemptId: attemptId,
        attemptNumber: previousAttempts.length + 1,
        isGuest: !isUserAuthenticated()
      }, { merge: true });
      
      await batch.commit();
      
      // Only create user-specific records if the user is authenticated
      if (isUserAuthenticated()) {
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            // Create main exam entry if not exists
            await setDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin),
              {
                quiz_title: title,
                last_attempt_at: now
              },
              { merge: true }
            );
            
            // Create specific attempt record
            await setDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin, "Attempts", attemptId),
              {
                name: studentData.name,
                class: studentData.class,
                school: studentData.school,
                email_id: userIdentifier,
                status: "in_progress",
                startedAt: now,
                attemptNumber: previousAttempts.length + 1
              }
            );
          }
        });
      }
      
      setIsStudentInfoSubmitted(true);
      setStartTime(now);
    } catch (error) {
      console.error("Error saving attempt:", error);
      alert("Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại.");
    }
  }

  // Timer effect
  useEffect(() => {
    if (startTime && duration) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsedMs = now - startTime;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const remainingMinutes = duration - elapsedMinutes;
        
        if (remainingMinutes <= 0) {
            clearInterval(interval);
          // Save progress before auto-submit
          saveProgressImmediate();
          onSubmit();
        } else {
          setRemainingTime(remainingMinutes);
          }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [startTime, duration, saveProgressImmediate]);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Save progress immediately when user is about to leave
      if (isStudentInfoSubmitted && studInfo.email && currentAttemptId) {
        // Use synchronous localStorage save as backup
        const progressData = {
          selected_answers: selectedList,
          orderMapping: originalOrder,
          attemptId: currentAttemptId,
          pin: pin.toString(),
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(`quiz_progress_${pin}_${currentAttemptId}`, JSON.stringify(progressData));
        
        // Try to save to Firestore (may not complete if page closes)
        saveProgressImmediate();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also save on visibility change (tab switch)
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

  // Handle answer selection
  const handleAnswerSelect = useCallback((questionIndex, optionIndex, isTrueFalse = false, isTrue = null) => {
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
          // Ensure array is long enough
          while (newList.length <= originalQuestionIndex) {
            newList.push(null);
          }
          
          if (!newList[originalQuestionIndex]) {
            newList[originalQuestionIndex] = { selectedAnswer: [] };
          }
          
          let answers = Array.isArray(newList[originalQuestionIndex].selectedAnswer) 
            ? [...newList[originalQuestionIndex].selectedAnswer] 
            : [];
            
          while (answers.length <= optionIndex) {
            answers.push(null);
          }
          
          answers[optionIndex] = isTrue;
          
          newList[originalQuestionIndex].selectedAnswer = answers;
          return newList;
        });
      } else {
        const originalOptionIndex = originalOrder[originalQuestionIndex]?.optionMapping?.[optionIndex] ?? optionIndex;
        
        setSelectedList(prev => {
          const newList = prev ? [...prev] : [];
          // Ensure array is long enough
          while (newList.length <= originalQuestionIndex) {
            newList.push(null);
          }
          newList[originalQuestionIndex] = { selectedAnswer: originalOptionIndex };
          return newList;
        });
      }
      
      // Save progress (realtime)
      saveCurrentProgress();
    }
  }, [questionIndexMapping, originalOrder, saveCurrentProgress]);

  // Handle short answer input change (realtime save)
  const handleShortAnswerChange = useCallback((questionIndex, value) => {
    const originalQuestionIndex = questionIndexMapping[questionIndex];
    
    if (originalQuestionIndex !== undefined) {
      setSelectedList(prev => {
        const newList = prev ? [...prev] : [];
        // Ensure array is long enough
        while (newList.length <= originalQuestionIndex) {
          newList.push(null);
        }
        newList[originalQuestionIndex] = { selectedAnswer: value || "" };
        return newList;
      });
      
      // Save progress immediately for short answers
      setTimeout(() => {
        saveCurrentProgress();
      }, 500); // Small delay to avoid too frequent saves while typing
    }
  }, [questionIndexMapping, saveCurrentProgress]);

  // Handle quiz submission
  async function onSubmit() {
    // Gather all answers
    let tempSelectedList = [];
    
    for (let i = 0; i < originalQuestions.length; i++) {
      let selectedAnswer = null;
      const shuffledIndex = originalOrder[i].newIndex;
      
      if (originalQuestions[i].type === "mcq") {
        const shuffledAnswer = selectedAnswers[shuffledIndex];
        selectedAnswer = shuffledAnswer !== undefined
          ? originalOrder[i].optionMapping[shuffledAnswer]
          : null;
      } else if (originalQuestions[i].type === "truefalse") {
        selectedAnswer = questions[shuffledIndex].options.map((_, index) => {
          return selectedAnswers[`tf_${shuffledIndex}_${index}`] ?? null;
        });
      } else if (originalQuestions[i].type === "shortanswer") {
        selectedAnswer = document.getElementById(`shortAnswer${shuffledIndex}`)?.value || "";
      }

      tempSelectedList.push({ selectedAnswer });
    }
    
    const endTime = new Date();
    const timeSpentMs = startTime ? endTime - startTime : 0;
    const timeSpentMinutes = Math.floor(timeSpentMs / 60000);
    
    setSelectedList(tempSelectedList);
    setStudInfo(prev => ({
      ...prev,
      timeSpent: timeSpentMinutes 
    }));
    setIsSubmitting(true);
  }

  // Handle final submission of the exam
  useEffect(() => {
    async function submitExam() {
      if (!isSubmitting) return;
      
      try {
        const scoreData = calculateScore(selectedList, answers, originalQuestions);
        
        // Enhanced student info - no need to manipulate fields
        const enhancedStudInfo = {
          ...studInfo
        };
        
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
          selected_answers: selectedList,
          timeSpentMinutes: new Date() - startTime,
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
                // Update the attempt record - use setDoc instead of updateDoc
                await setDoc(
                  doc(db, "Users", user.uid, "Exams_Attempted", pin, "Attempts", currentAttemptId),
                  {
                    status: "completed",
                    submittedAt: new Date(),
                    score: `${scoreData.score.toFixed(2)}/${scoreData.totalScore.toFixed(2)}`,
                    scoreQ: scoreData.score.toFixed(2),
                    scoreAll: scoreData.totalScore.toFixed(2)
                  },
                  { merge: true } // Add merge option to create if doesn't exist
                );
                
                // Update the main exam record
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
                // Continue with navigation even if user record update fails
              }
            }
          });
        }
        
        // Navigate to result summary page
        setIsSubmitting(false);
        navigate(`/pinverify/Form/${pin}/ResultSummary/${studInfo.email}/${currentAttemptId}`, {
          state: {
            score: scoreData.score,
            totalScore: scoreData.totalScore,
            questionResults: calculateQuestionResults(selectedList, answers, originalQuestions)
          }
        });
      } catch (error) {
        console.error("Error submitting quiz:", error);
        alert("Đã xảy ra lỗi khi nộp bài thi. Vui lòng thử lại.");
        setIsSubmitting(false);
      }
    }

    submitExam();
  }, [isSubmitting, answers, originalQuestions, pin, navigate, studInfo, selectedList, startTime, calculateScore, currentAttemptId, calculateQuestionResults]);

  // Render questions - memoized to prevent re-renders
  const QuestionComponents = useMemo(() => {
    if (!Array.isArray(questions) || questions.length === 0) {
      return null;
    }
    
    return questions.map((question, questionIndex) => (
      <div key={`question-${questionIndex}`} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-lg font-semibold text-gray-800 mb-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
            Câu {questionIndex + 1}
          </span>
          <MemoizedMathJax inline dynamic className="text-lg">{question.question}</MemoizedMathJax>
        </p>
        
        {question.type === "mcq" && (() => {
          const questionStr = JSON.stringify(question);
          console.log(`🔍 [DEBUG MCQ] Question ${questionIndex}:`, {
            question: question.question?.substring(0, 50),
            optionsCount: question.options?.length,
            options: question.options?.map((opt, idx) => ({
              index: idx,
              option: opt?.option,
              optionFull: opt?.option,
              optionType: typeof opt?.option,
              optionKeys: Object.keys(opt || {}),
              optionStringified: JSON.stringify(opt)
            })),
            selectedAnswer: selectedAnswers[questionIndex],
            questionKeys: Object.keys(question),
            questionStringified: questionStr
          });
          console.log(`📦 [DEBUG MCQ] Full question JSON for Q${questionIndex}:`, questionStr);
          return question.options.map((option, optionIndex) => (
            <MCQOption
              key={`mcq-${questionIndex}-${optionIndex}`}
              questionIndex={questionIndex}
              optionIndex={optionIndex}
              option={option}
              isSelected={selectedAnswers[questionIndex] === optionIndex}
              onSelect={handleAnswerSelect}
            />
          ));
        })()}
        
        {question.type === "truefalse" && question.options.map((option, optionIndex) => (
          <TrueFalseOption
            key={`tf-${questionIndex}-${optionIndex}`}
            questionIndex={questionIndex}
            optionIndex={optionIndex}
            option={option}
            selectedValue={selectedAnswers[`tf_${questionIndex}_${optionIndex}`]}
            onSelect={handleAnswerSelect}
          />
        ))}
        
        {question.type === "shortanswer" && (
          <div className="mt-4">
            <textarea
              type="text"
              id={`shortAnswer${questionIndex}`}
              placeholder="Nhập câu trả lời của bạn"
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              defaultValue={canResume && selectedList[questionIndexMapping[questionIndex]]?.selectedAnswer || ""}
              onChange={(e) => handleShortAnswerChange(questionIndex, e.target.value)}
              onBlur={(e) => {
                handleShortAnswerChange(questionIndex, e.target.value);
                saveProgressImmediate();
              }}
            />
          </div>
        )}
      </div>
    ));
  }, [questions, selectedAnswers, canResume, selectedList, questionIndexMapping, handleAnswerSelect, handleShortAnswerChange, saveProgressImmediate]);
  
  // Debug: Log whenever questions change
  useEffect(() => {
    console.log('🔍 [DEBUG Form] Questions changed:', {
      questionsCount: questions?.length,
      questions: questions?.map((q, idx) => ({
        index: idx,
        type: q?.type,
        question: q?.question?.substring(0, 100),
        hasOptions: !!q?.options,
        optionsCount: q?.options?.length,
        options: q?.options?.map((opt, optIdx) => ({
          index: optIdx,
          option: opt?.option?.substring(0, 50),
          optionType: typeof opt?.option,
          optionKeys: Object.keys(opt || {})
        })),
        questionKeys: Object.keys(q || {})
      }))
    });
  }, [questions]);

  // Main render
    return (
    <MathJaxContext>
    <form id="mainForm" className="m-4 md:m-10 lg:m-14">
      {questions.length !== 0 ? (
        questions !== "Sai mã pin" ? (
            showRetakeOption ? (
              <AttemptHistory 
                attempts={previousAttempts} 
                pin={pin}
                userEmail={getUserIdentifier()}
                onRetakeClick={() => {
                  setShowRetakeOption(false);
                  setIsStudentInfoSubmitted(false);
                }}
              />
            ) : showResult ? (
              // Result screen after submission
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h1 className="text-3xl font-bold text-center mb-6">Kết quả bài thi</h1>
                  
                  {/* Score display */}
                  <div className="bg-blue-50 p-6 rounded-lg text-center mb-6">
                    <p className="text-xl mb-2">Điểm số của bạn:</p>
                    <p className="text-5xl font-bold text-blue-600">
                      {resultData?.score.toFixed(2) || '0'} / {resultData?.totalScore.toFixed(2) || '0'}
                    </p>
                    <p className="text-lg text-gray-600 mt-2">
                      Tỷ lệ: {resultData ? ((resultData.score / resultData.totalScore) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  
                  {/* Summary */}
                  {questionResults.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">
                          {questionResults.filter(q => q.isCorrect === true).length}
                        </p>
                        <p className="text-sm text-gray-600">Câu đúng</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-3xl font-bold text-red-600">
                          {questionResults.filter(q => q.isCorrect === false).length}
                        </p>
                        <p className="text-sm text-gray-600">Câu sai</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-gray-600">
                          {questionResults.filter(q => q.isCorrect === null).length}
                        </p>
                        <p className="text-sm text-gray-600">Chưa làm</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{originalQuestions.length}</p>
                        <p className="text-sm text-gray-600">Tổng câu</p>
                      </div>
                    </div>
                  )}
                  
                  {/* View mode toggle */}
                  <div className="flex justify-center gap-4 mb-6">
                    <button
                      onClick={() => setViewMode('mywork')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        viewMode === 'mywork'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Xem bài làm của tôi
                    </button>
                    <button
                      onClick={() => setViewMode('answers')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        viewMode === 'answers'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Xem đáp án chi tiết
                    </button>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => navigate(`/pinverify/Form/${pin}/ResultFetch/${studInfo.email}/${currentAttemptId}`)}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
                    >
                      Xem kết quả đầy đủ
                    </button>
                    <button
                      onClick={() => navigate(`/pinverify/Form/${pin}`)}
                      className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-colors"
                    >
                      Về trang chính
                    </button>
                  </div>
                </div>
                
                {/* Questions display based on view mode */}
                {viewMode === 'mywork' ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Bài làm của bạn</h2>
                    {QuestionComponents}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Đáp án chi tiết</h2>
                    {originalQuestions.map((originalQ, origIdx) => {
                      // Skip text blocks
                      if (!originalQ || originalQ.type === 'textblock') return null;
                      
                      // Find the shuffled index for this original question
                      const shuffledIndex = originalOrder[origIdx]?.newIndex;
                      const result = shuffledIndex !== undefined ? questionResults[shuffledIndex] : null;
                      const correctAnswer = answers[origIdx];
                      const studentAnswer = selectedList[origIdx];
                      
                      // Get the shuffled question for display (to show options in shuffled order if needed)
                      const shuffledQuestion = shuffledIndex !== undefined ? questions[shuffledIndex] : null;
                      const displayQuestion = shuffledQuestion || originalQ;
                      
                      return (
                        <div 
                          key={origIdx}
                          className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                            result?.isCorrect === true 
                              ? 'border-green-500' 
                              : result?.isCorrect === false 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start flex-1">
                              <span className={`px-2 py-1 rounded mr-2 text-sm font-medium ${
                                result?.isCorrect === true 
                                  ? 'bg-green-100 text-green-800' 
                                  : result?.isCorrect === false 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                Câu {origIdx + 1}
                              </span>
                              <div className="text-lg font-medium flex-1">
                                <MemoizedMathJax inline dynamic>{originalQ.question}</MemoizedMathJax>
                              </div>
                            </div>
                            {result && result.maxScore > 0 && (
                              <div className={`px-3 py-1 rounded-lg text-sm font-semibold ml-2 ${
                                result.isCorrect === true
                                  ? 'bg-green-100 text-green-800'
                                  : result.isCorrect === false
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {result.score.toFixed(2)} / {result.maxScore.toFixed(2)} điểm
                              </div>
                            )}
                          </div>
                          
                          {/* Answer comparison section */}
                          {originalQ.type === "mcq" && (
                            <div className="space-y-4 pl-8">
                              {/* Answer summary box */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="font-medium text-green-800 mb-1">Đáp án đúng:</p>
                                  <p className="text-xl font-bold text-green-700">
                                    {(() => {
                                      // correctAnswer.answer is already in original index (from answer key)
                                      const correctAnsIdx = parseInt(correctAnswer?.answer || 0);
                                      return String.fromCharCode(65 + correctAnsIdx);
                                    })()}
                                  </p>
                                </div>
                                <div className={`p-3 border rounded-lg ${
                                  result?.isCorrect === true
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                  <p className={`font-medium mb-1 ${
                                    result?.isCorrect === true ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    Đáp án của bạn:
                                  </p>
                                  <p className={`text-xl font-bold ${
                                    result?.isCorrect === true ? 'text-green-700' : 'text-red-700'
                                  }`}>
                                    {(() => {
                                      if (studentAnswer?.selectedAnswer === undefined || studentAnswer?.selectedAnswer === null) {
                                        return 'Chưa trả lời';
                                      }
                                      const selectedAnsIdx = parseInt(studentAnswer.selectedAnswer || 0);
                                      // Map back to original option index if options were shuffled
                                      const originalOptIdx = originalOrder[origIdx]?.optionMapping 
                                        ? originalOrder[origIdx].optionMapping[selectedAnsIdx] 
                                        : selectedAnsIdx;
                                      return String.fromCharCode(65 + originalOptIdx);
                                    })()}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Options display - show in original order */}
                              {originalQ.options.map((option, optIndex) => {
                                // Check if this option is correct (in original order)
                                const isCorrect = parseInt(correctAnswer?.answer || -1) === optIndex;
                                // Check if student selected this option (need to map from shuffled to original)
                                let isSelected = false;
                                if (studentAnswer?.selectedAnswer !== undefined && studentAnswer?.selectedAnswer !== null) {
                                  const selectedShuffledIdx = parseInt(studentAnswer.selectedAnswer || -1);
                                  // If options were shuffled, map back to original index
                                  if (originalOrder[origIdx]?.optionMapping) {
                                    const originalSelectedIdx = originalOrder[origIdx].optionMapping[selectedShuffledIdx];
                                    isSelected = originalSelectedIdx === optIndex;
                                  } else {
                                    isSelected = selectedShuffledIdx === optIndex;
                                  }
                                }
                                
                                return (
                                  <div 
                                    key={optIndex}
                                    className={`p-3 rounded-lg border-2 ${
                                      isCorrect && isSelected 
                                        ? 'bg-green-100 border-green-500' 
                                        : isSelected && !isCorrect 
                                          ? 'bg-red-100 border-red-500' 
                                          : isCorrect 
                                            ? 'bg-green-50 border-green-300' 
                                            : 'border-gray-300 bg-white'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium text-lg mr-3 ${
                                        isCorrect 
                                          ? 'border-green-600 bg-green-100 text-green-800'
                                          : isSelected
                                            ? 'border-red-600 bg-red-100 text-red-800'
                                            : 'border-gray-400'
                                      }`}>
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <div className="flex-grow">
                                        <MemoizedMathJax inline dynamic>{option.option}</MemoizedMathJax>
                                      </div>
                                      {isCorrect && (
                                        <span className="text-green-600 ml-2 text-xl font-bold">✓ Đúng</span>
                                      )}
                                      {isSelected && !isCorrect && (
                                        <span className="text-red-600 ml-2 text-xl font-bold">✗ Bạn chọn</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {originalQ.type === "truefalse" && (
                            <div className="space-y-4 pl-8">
                              {/* Answer summary */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="font-medium text-green-800 mb-2">Đáp án đúng:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {originalQ.options.map((_, optIndex) => {
                                      const correctAns = correctAnswer?.answer?.[optIndex];
                                      return (
                                        <span key={optIndex} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                          {String.fromCharCode(97 + optIndex)}: {correctAns === true ? 'Đúng' : 'Sai'}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className={`p-3 border rounded-lg ${
                                  result?.isCorrect === true
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                  <p className={`font-medium mb-2 ${
                                    result?.isCorrect === true ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    Đáp án của bạn:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {originalQ.options.map((_, optIndex) => {
                                      const studentAns = studentAnswer?.selectedAnswer?.[optIndex];
                                      const correctAns = correctAnswer?.answer?.[optIndex];
                                      const isCorrect = studentAns === correctAns;
                                      
                                      if (studentAns === undefined || studentAns === null) {
                                        return (
                                          <span key={optIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                                            {String.fromCharCode(97 + optIndex)}: Chưa trả lời
                                          </span>
                                        );
                                      }
                                      
                                      return (
                                        <span 
                                          key={optIndex} 
                                          className={`px-2 py-1 rounded text-sm ${
                                            isCorrect 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {String.fromCharCode(97 + optIndex)}: {studentAns === true ? 'Đúng' : 'Sai'} 
                                          {isCorrect ? ' ✓' : ' ✗'}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Detailed options */}
                              {originalQ.options.map((option, optIndex) => {
                                const correctAns = correctAnswer?.answer?.[optIndex];
                                const studentAns = studentAnswer?.selectedAnswer?.[optIndex];
                                const isCorrect = studentAns === correctAns;
                                
                                return (
                                  <div key={optIndex} className="mb-3">
                                    <div className="mb-2 font-medium">
                                      <MemoizedMathJax inline dynamic>{`${String.fromCharCode(97 + optIndex)}. ${option.option}`}</MemoizedMathJax>
                                    </div>
                                    <div className="flex ml-8 space-x-4">
                                      <div 
                                        className={`px-4 py-2 rounded-lg border-2 ${
                                          studentAns === true 
                                            ? correctAns === true 
                                              ? 'bg-green-100 border-green-500' 
                                              : 'bg-red-100 border-red-500' 
                                            : correctAns === true 
                                              ? 'bg-green-50 border-green-300' 
                                              : 'border-gray-300 bg-white'
                                        }`}
                                      >
                                        <div className="flex items-center">
                                          <span>Đúng</span>
                                          {correctAns === true && (
                                            <span className="text-green-600 ml-2 text-xl font-bold">✓</span>
                                          )}
                                          {studentAns === true && !isCorrect && (
                                            <span className="text-red-600 ml-2 text-xl font-bold">✗ Bạn chọn</span>
                                          )}
                                        </div>
                                      </div>
                                      <div 
                                        className={`px-4 py-2 rounded-lg border-2 ${
                                          studentAns === false 
                                            ? correctAns === false 
                                              ? 'bg-green-100 border-green-500' 
                                              : 'bg-red-100 border-red-500' 
                                            : correctAns === false 
                                              ? 'bg-green-50 border-green-300' 
                                              : 'border-gray-300 bg-white'
                                        }`}
                                      >
                                        <div className="flex items-center">
                                          <span>Sai</span>
                                          {correctAns === false && (
                                            <span className="text-green-600 ml-2 text-xl font-bold">✓</span>
                                          )}
                                          {studentAns === false && !isCorrect && (
                                            <span className="text-red-600 ml-2 text-xl font-bold">✗ Bạn chọn</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {originalQ.type === "shortanswer" && (
                            <div className="pl-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="font-medium text-green-800 mb-2">Đáp án đúng:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {(() => {
                                      const validAnswers = Array.isArray(correctAnswer?.answer) 
                                        ? correctAnswer.answer 
                                        : [correctAnswer?.answer].filter(a => a);
                                      return validAnswers.map((ans, ansIndex) => (
                                        <span 
                                          key={ansIndex}
                                          className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-sm font-medium"
                                        >
                                          {String(ans).trim()}
                                        </span>
                                      ));
                                    })()}
                                  </div>
                                </div>
                                <div className={`p-3 border-2 rounded-lg ${
                                  result?.isCorrect === true
                                    ? 'bg-green-50 border-green-300' 
                                    : studentAnswer?.selectedAnswer
                                      ? 'bg-red-50 border-red-300' 
                                      : 'bg-gray-50 border-gray-300'
                                }`}>
                                  <p className={`font-medium mb-2 ${
                                    result?.isCorrect === true ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    Đáp án của bạn:
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className={studentAnswer?.selectedAnswer ? '' : 'text-gray-500 italic'}>
                                      {studentAnswer?.selectedAnswer || "Chưa trả lời"}
                                    </span>
                                    {result?.isCorrect === true ? (
                                      <span className="text-green-600 ml-2 text-xl font-bold">✓ Đúng</span>
                                    ) : studentAnswer?.selectedAnswer ? (
                                      <span className="text-red-600 ml-2 text-xl font-bold">✗ Sai</span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
            status !== "inactive" ? (
              !isStudentInfoSubmitted ? (
                  <StudentInfoForm onSubmit={handleStudentInfoSubmit} />
              ) : (
                <div className="max-w-4xl mx-auto">
                    <QuizHeader title={title} remainingTime={remainingTime} />
                    
                    {canResume && <ResumeExamBanner remainingTime={remainingTime} />}
                  
                  {QuestionComponents}
                    
                  <div className="flex justify-center mt-8 mb-8">
                    <button
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
                      type="button"
                        onClick={onSubmit}
                    >
                      Nộp bài
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
}

export default Form;