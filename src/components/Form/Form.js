import { useEffect, useState, useMemo, useCallback, useReducer } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import db from "../../services/firebaseConfig";
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
  return (
    <div key={uuid()} className="mb-3">
      <button
        id={`${questionIndex}-${optionIndex}`}
        type="button"
        className={`w-full p-3 rounded-lg border transition-colors flex items-center space-x-3 ${
          isSelected
            ? 'bg-blue-100 border-blue-500 text-blue-700'
            : 'hover:bg-gray-50 border-gray-300 text-gray-700'
        }`}
        onClick={() => onSelect(questionIndex, optionIndex)}
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium text-lg">
          {String.fromCharCode(65 + optionIndex)}
        </span>
        <MemoizedMathJax inline dynamic className="text-gray-700">{option.option}</MemoizedMathJax>
      </button>
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
      
      if (question.type === "mcq" || question.type === "shortanswer") {
        if (parseInt(correctAnswer.answer) === parseInt(userAnswer.selectedAnswer)) {
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
    if (!previousAnswers || !Array.isArray(previousAnswers)) return;
    
    const restoredAnswers = {};
    
    previousAnswers.forEach((answer, originalIndex) => {
      if (!answer || answer.selectedAnswer === undefined || answer.selectedAnswer === null) return;
      
      const newQuestionIndex = orderMapping[originalIndex]?.newIndex;
      if (newQuestionIndex === undefined) return;
      
      const question = originalQuestions[originalIndex];
      if (!question) return;
      
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
        }
      } else if (question.type === "truefalse" && Array.isArray(answer.selectedAnswer)) {
        answer.selectedAnswer.forEach((tfAnswer, optionIndex) => {
          if (tfAnswer !== null) {
            restoredAnswers[`tf_${newQuestionIndex}_${optionIndex}`] = tfAnswer;
          }
        });
      }
    });
    
    dispatchSelectedAnswers({ type: 'RESTORE_ANSWERS', answers: restoredAnswers });
    setSelectedList(previousAnswers);
  }, [originalQuestions]);

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
                // Get the response document to check progress
                const responseDoc = await getDoc(
                    doc(db, "Paper_Setters", pin.toString(), "Responses", `${user.email}_${inProgressAttempt.id}`)
                );
                
                if (responseDoc.exists()) {
                  const responseData = responseDoc.data();
                  const examDuration = docos.docs[0].data().duration;
                  const remainingTime = calculateRemainingTime(responseData.startedAt, examDuration);
                  
                  // If there's time left, allow resuming
                  if (remainingTime > 0) {
                    res({ 
                      attempted: true, 
                      canResume: true, 
                      startTime: responseData.startedAt,
                      remainingTime: remainingTime,
                      studInfo: responseData.stud_info,
                      selected_answers: responseData.selected_answers || [],
                        orderMapping: responseData.orderMapping,
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
              if (Array.isArray(attemptStatus.selected_answers)) {
                restorePreviousAnswers(attemptStatus.selected_answers, shuffledData.orderMapping);
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
          onSubmit();
        } else {
          setRemainingTime(remainingMinutes);
          }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [startTime, duration]);

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
          const newList = [...prev];
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
          const newList = [...prev];
          newList[originalQuestionIndex] = { selectedAnswer: originalOptionIndex };
          return newList;
        });
      }
      
      // Save progress
      saveCurrentProgress();
    }
  }, [questionIndexMapping, originalOrder]);

  // Save current progress with debounce
  const saveCurrentProgress = useCallback(
    debounce(async () => {
      if (isStudentInfoSubmitted && studInfo.email && currentAttemptId) {
        try {
          await updateDoc(
            doc(db, "Paper_Setters", pin.toString(), "Responses", `${studInfo.email}_${currentAttemptId}`),
            {
              selected_answers: selectedList,
              lastUpdated: new Date()
            }
          );
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      }
    }, 2000),
    [selectedList, isStudentInfoSubmitted, studInfo.email, pin, currentAttemptId]
  );

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
        
        // Navigate to results with attempt ID
        navigate(`/pinverify/Form/${pin}/ResultFetch/${studInfo.email}/${currentAttemptId}`);
      } catch (error) {
        console.error("Error submitting quiz:", error);
        alert("Đã xảy ra lỗi khi nộp bài thi. Vui lòng thử lại.");
        setIsSubmitting(false);
      }
    }

    submitExam();
  }, [isSubmitting, answers, originalQuestions, pin, navigate, studInfo, selectedList, startTime, calculateScore, currentAttemptId]);

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
        
        {question.type === "mcq" && question.options.map((option, optionIndex) => (
          <MCQOption
            key={`mcq-${questionIndex}-${optionIndex}`}
            questionIndex={questionIndex}
            optionIndex={optionIndex}
            option={option}
            isSelected={selectedAnswers[questionIndex] === optionIndex}
            onSelect={handleAnswerSelect}
          />
        ))}
        
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
            />
          </div>
        )}
      </div>
    ));
  }, [questions, selectedAnswers, canResume, selectedList, questionIndexMapping, handleAnswerSelect]);

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