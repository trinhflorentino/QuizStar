import { useEffect, useState, useMemo, useCallback } from "react";
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
} from "firebase/firestore/lite";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
// import { info } from "autoprefixer";
// import { MathJaxContext, MathJax } from 'better-react-mathjax';

// Memoized MathJax component to prevent re-renders
const MemoizedMathJax = React.memo(({ children, ...props }) => (
  <MathJax {...props}>{children}</MathJax>
));

function Form() {
  const [questions, setQuestions] = useState(() => []);
  const [originalQuestions, setOriginalQuestions] = useState(() => []);
  const [originalOrder, setOriginalOrder] = useState({});
  const [answers, setAnswers] = useState([]);
  const [title, setTitle] = useState();
  const [selectedList, setSelectedList] = useState(() => []);
  const [studInfo, setStudInfo] = useState(() => ({
    name: "",
    email: "",
    roll_no: "",
    class: ""
  }));
  const [status, setStatus] = useState(() => "");
  const [duration, setDuration] = useState();
  const [isStudentInfoSubmitted, setIsStudentInfoSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [canResume, setCanResume] = useState(false);
  const [previousAttemptData, setPreviousAttemptData] = useState(null);

  let { pin } = useParams();
  const navigate = useNavigate();

  const questionIndexMapping = useMemo(() => {
    const mapping = {};
    Object.keys(originalOrder).forEach(origIdx => {
      const newIdx = originalOrder[origIdx].newIndex;
      mapping[newIdx] = parseInt(origIdx);
    });
    return mapping;
  }, [originalOrder]);

  function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function shuffleQuestionsAndAnswers(questions) {
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
  }

  // Convert Firestore timestamp to JS Date
  const firestoreTimestampToDate = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
    return new Date(timestamp);
  };

  // Calculate remaining time based on start time and duration
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

  // Restore previous answers to UI state
  const restorePreviousAnswers = (previousAnswers, orderMapping) => {
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
      // Short answer would be handled separately as it uses DOM elements directly
    });
    
    setSelectedAnswers(restoredAnswers);
    setSelectedList(previousAnswers);
  };

  // Calculate score based on student answers
  const calculateScore = (studentAnswers, correctAnswers, quizQuestions) => {
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
      
      totalScore += parseFloat(question.score || 1); // Default to 1 if no score specified
      
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
  };

  useEffect(() => {
    async function getQuestions() {
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
              const checkAttempt = await getDoc(
                doc(db, "Users", user.uid, "Exams_Attempted", pin)
              );
              
              if (checkAttempt.exists()) {
                const attemptData = checkAttempt.data();
                
                // If exam was completed, redirect to results
                if (attemptData.status === "completed") {
                  res({ attempted: true, canResume: false });
                  return;
                }
                
                // Get the response document to check progress
                const responseDoc = await getDoc(
                  doc(db, "Paper_Setters", pin.toString(), "Responses", user.email || getAuth().currentUser.email)
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
                      orderMapping: responseData.orderMapping // Get saved question order
                    });
                  } else {
                    // Time expired, should finalize this attempt
                    await updateDoc(responseDoc.ref, {
                      status: "completed",
                      timeExpired: true
                    });
                    res({ attempted: true, canResume: false });
                  }
                } else {
                  res({ attempted: true, canResume: false });
                }
              } else {
                res({ attempted: false });
              }
            } else {
              res({ attempted: false });
            }
          });
        });

        const attemptStatus = await attemptPromise;
        
        if (attemptStatus.attempted && !attemptStatus.canResume) {
          setQuestions("Already Attempted");
          navigate('ResultFetch/'+getAuth().currentUser.email);
        } else {
          const docosData = docos.docs.map((doc) => doc.data());
          if (docosData.length > 0 && docosData[0].question_question) {
            setTitle(docos.docs[0].id);
            const originalQuestions = docosData[0].question_question;
            setOriginalQuestions(originalQuestions);
            
            // Get answers if available
            if (docos.docs.length > 1) {
              setAnswers(docosData[1].answer_answer || []);
            } else {
              // Check if there's a separate answer document
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
            
            let shuffledData;
            // If resuming and we have the original order mapping, use it
            if (attemptStatus.canResume && attemptStatus.orderMapping) {
              shuffledData = {
                shuffledQuestions: [], // Will be populated below
                orderMapping: attemptStatus.orderMapping
              };
              
              // Reconstruct shuffled questions from original questions and order mapping
              const orderMapping = attemptStatus.orderMapping;
              const reconstructedQuestions = [];
              
              // For each original index, place the question at its new index
              Object.keys(orderMapping).forEach(origIdx => {
                const originalIndex = parseInt(origIdx);
                const newIndex = orderMapping[origIdx].newIndex;
                const optionMapping = orderMapping[origIdx].optionMapping || {};
                
                // Get the original question
                const originalQuestion = {...originalQuestions[originalIndex]};
                
                // If it's an MCQ question, shuffle options according to saved mapping
                if (originalQuestion.type === "mcq" && originalQuestion.options) {
                  const newOptions = new Array(originalQuestion.options.length);
                  
                  // Reconstruct options order
                  for (const [newIdx, origOptIdx] of Object.entries(optionMapping)) {
                    newOptions[parseInt(newIdx)] = originalQuestion.options[origOptIdx];
                  }
                  
                  originalQuestion.options = newOptions;
                }
                
                // Ensure the reconstructed array is large enough
                while (reconstructedQuestions.length <= newIndex) {
                  reconstructedQuestions.push(null);
                }
                
                // Place the question at its position
                reconstructedQuestions[newIndex] = originalQuestion;
              });
              
              // Remove any null entries (shouldn't happen if order mapping is correct)
              shuffledData.shuffledQuestions = reconstructedQuestions.filter(q => q !== null);
            } else {
              // Otherwise generate a new shuffled order
              shuffledData = shuffleQuestionsAndAnswers(originalQuestions);
              
              // If this is a new attempt, save the order mapping for future resume
              if (!attemptStatus.canResume) {
                // Save question order to database for resuming later
                const userEmail = getAuth().currentUser?.email;
                if (userEmail) {
                  try {
                    await updateDoc(
                      doc(db, "Paper_Setters", pin.toString(), "Responses", userEmail),
                      {
                        orderMapping: shuffledData.orderMapping
                      }
                    );
                  } catch (error) {
                    console.error("Failed to save question order:", error);
                  }
                }
              }
            }
            
            setQuestions(shuffledData.shuffledQuestions);
            setOriginalOrder(shuffledData.orderMapping);
            
            setStatus(docosData[0].status);
            const examDuration = docosData[0].duration;
            console.log("Setting duration:", examDuration);
            setDuration(examDuration);
            
            // If this is a resumable attempt
            if (attemptStatus.canResume) {
              setCanResume(true);
              setPreviousAttemptData(attemptStatus);
              setStartTime(firestoreTimestampToDate(attemptStatus.startTime));
              setRemainingTime(attemptStatus.remainingTime);
              setStudInfo(attemptStatus.studInfo);
              setIsStudentInfoSubmitted(true);
              
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
    }

    if (!isStudentInfoSubmitted || canResume) {
      getQuestions();
    }
  }, []);

  useEffect(() => {
    async function submitExam() {
      if (isSubmitting) {
        const scoreData = calculateScore(selectedList, answers, originalQuestions);
        
        try {
          // First, ensure we have all necessary data for scoring
          if (!answers || answers.length === 0) {
            console.error("Missing answer data for scoring");
            // Try to fetch answers again
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
          
          // Make sure student info has the school field expected by ViewStudentResponse
          const enhancedStudInfo = {
            ...studInfo,
            school: studInfo.roll_no, // ViewStudentResponse expects this field
            roll_no: studInfo.roll_no
          };
          
          // Update response data in database
          await updateDoc(
            doc(
              db,
              "Paper_Setters",
              pin.toString(),
              "Responses",
              studInfo.email
            ),
            {
              stud_info: enhancedStudInfo,
              selected_answers: selectedList,
              timeSpentMinutes: new Date() - startTime,
              submittedAt: new Date(),
              status: "completed",
              score: `${scoreData.score.toFixed(2)}/${scoreData.totalScore.toFixed(2)}`,
              scoreQ: scoreData.score.toFixed(2),
              scoreAll: scoreData.totalScore.toFixed(2)
            }
          );
          
          // Update the user's attempt record
          getAuth().onAuthStateChanged(async function (user) {
            if (user) {
              await updateDoc(
                doc(db, "Users", user.uid, "Exams_Attempted", pin),
                {
                  status: "completed",
                  submittedAt: new Date(),
                  score: `${scoreData.score.toFixed(2)}/${scoreData.totalScore.toFixed(2)}`,
                  scoreQ: scoreData.score.toFixed(2),
                  scoreAll: scoreData.totalScore.toFixed(2)
                }
              );
            }
          });
          
          navigate(`/pinverify/Form/${pin}/ResultFetch/${studInfo.email}`);
        } catch (error) {
          console.error("Error submitting quiz:", error);
          alert("Đã xảy ra lỗi khi nộp bài thi. Vui lòng thử lại.");
          setIsSubmitting(false);
        }
      }
    }

    submitExam();
  }, [isSubmitting]);

  useEffect(() => {
    console.log("Timer effect triggered:", { startTime, duration, remainingTime });
    
    if (startTime && duration) {
      console.log("Setting up timer");
      const interval = setInterval(() => {
        const now = new Date();
        const elapsedMs = now - startTime;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const remainingMinutes = duration - elapsedMinutes;
        
        console.log("Timer tick:", { elapsedMinutes, remainingMinutes });
        
        if (remainingMinutes <= 0) {
          clearInterval(interval);
          onSubmit();
        } else {
          setRemainingTime(remainingMinutes);
        }
      }, 1000);

      return () => {
        console.log("Cleaning up timer");
        clearInterval(interval);
      };
    }
  }, [startTime, duration]);

  useEffect(() => {
    //console.log(questions.length);
  }, [questions]);

  async function handleStudentInfoSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("studName").value;
    const rollNo = document.getElementById("studRollNo").value;
    const className = document.getElementById("studClass").value;

    if (name && rollNo && className) {
      const studentData = {
        name: name,
        email: getAuth().currentUser.email,
        roll_no: rollNo,
        class: className,
      };
      setStudInfo(studentData);
      
      // Save attempt to database immediately
      const now = new Date();
      try {
        // Create a record in Responses collection
        const responseRef = doc(
          db,
          "Paper_Setters",
          pin.toString(),
          "Responses",
          getAuth().currentUser.email
        );
        
        await setDoc(responseRef, {
          stud_info: studentData,
          startedAt: now,
          status: "in_progress",
          selected_answers: [],
          orderMapping: originalOrder // Save question order for resuming
        });
        
        // Create record in user's attempted exams
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            await setDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin),
              {
                quiz_title: title,
                name: studentData.name,
                class: studentData.class,
                roll_no: studentData.roll_no,
                email_id: studentData.email,
                status: "in_progress",
                startedAt: now
              },
              { merge: true }
            );
          }
        });
        
        setIsStudentInfoSubmitted(true);
        console.log("Setting start time:", now);
        setStartTime(now);
      } catch (error) {
        console.error("Error saving attempt:", error);
        alert("Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại.");
      }
    } else {
      alert("Vui lòng điền đầy đủ thông tin học sinh.");
    }
  }

  // Update handleAnswerSelect to handle true/false selections
  const handleAnswerSelect = useCallback((questionIndex, optionIndex, isTrueFalse = false, isTrue = null) => {
    // Update UI state immediately for responsive feel
    if (isTrueFalse) {
      setSelectedAnswers(prev => ({
        ...prev,
        [`tf_${questionIndex}_${optionIndex}`]: isTrue
      }));
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: optionIndex
      }));
    }
    
    // Use the memoized mapping to find original indices
    const originalQuestionIndex = questionIndexMapping[questionIndex];
    
    // Only update selected list if we have valid mapping
    if (originalQuestionIndex !== undefined) {
      if (isTrueFalse) {
        // For true/false questions, we need a different approach
        setSelectedList(prev => {
          const newList = [...prev];
          if (!newList[originalQuestionIndex]) {
            newList[originalQuestionIndex] = { selectedAnswer: [] };
          }
          
          // Create a copy of the current answers array or initialize if not exists
          let answers = Array.isArray(newList[originalQuestionIndex].selectedAnswer) 
            ? [...newList[originalQuestionIndex].selectedAnswer] 
            : [];
            
          // Make sure the array is large enough
          while (answers.length <= optionIndex) {
            answers.push(null);
          }
          
          // Set the answer for this option
          answers[optionIndex] = isTrue;
          
          newList[originalQuestionIndex].selectedAnswer = answers;
          return newList;
        });
      } else {
        // For MCQ questions, use the existing logic
        const originalOptionIndex = originalOrder[originalQuestionIndex]?.optionMapping?.[optionIndex] ?? optionIndex;
        
        setSelectedList(prev => {
          const newList = [...prev];
          newList[originalQuestionIndex] = { selectedAnswer: originalOptionIndex };
          return newList;
        });
      }
      
      // Save current answers to database periodically to allow resuming
      saveCurrentProgress();
    }
  }, [questionIndexMapping, originalOrder]);

  // Debounced function to save current progress
  const saveCurrentProgress = useCallback(
    debounce(async () => {
      if (isStudentInfoSubmitted && studInfo.email) {
        try {
          await updateDoc(
            doc(db, "Paper_Setters", pin.toString(), "Responses", studInfo.email),
            {
              selected_answers: selectedList,
              lastUpdated: new Date()
            }
          );
          console.log("Progress saved");
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      }
    }, 3000),
    [selectedList, isStudentInfoSubmitted, studInfo.email]
  );

  // Simple debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function onSubmit() {
    let tempSelectedList = [];
    
    for (let i = 0; i < originalQuestions.length; i++) {
      let selectedAnswer = null;
      const shuffledIndex = originalOrder[i].newIndex;
      
      if (originalQuestions[i].type === "mcq") {
        const shuffledAnswer = selectedAnswers[shuffledIndex];
        if (shuffledAnswer !== undefined) {
          selectedAnswer = originalOrder[i].optionMapping[shuffledAnswer];
        } else {
          selectedAnswer = null; // Explicitly set to null if no answer was selected
        }
      } else if (originalQuestions[i].type === "truefalse") {
        // Get answers from the selectedAnswers state
        selectedAnswer = questions[shuffledIndex].options.map((_, index) => {
          return selectedAnswers[`tf_${shuffledIndex}_${index}`] ?? null;
        });
      } else if (originalQuestions[i].type === "shortanswer") {
        selectedAnswer = document.getElementById(`shortAnswer${shuffledIndex}`).value;
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

  // Memoized MCQ option rendering to reduce re-renders
  const renderMCQOption = useCallback((question, questionIndex, optionIndex, option) => {
    const isSelected = selectedAnswers[questionIndex] === optionIndex;
    
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
          onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
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
          onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
        />
      </div>
    );
  }, [selectedAnswers, handleAnswerSelect]);

  // Render true/false button option
  const renderTrueFalseOption = useCallback((questionIndex, optionIndex, option) => {
    const selectedValue = selectedAnswers[`tf_${questionIndex}_${optionIndex}`];
    
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
            onClick={() => handleAnswerSelect(questionIndex, optionIndex, true, true)}
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
            onClick={() => handleAnswerSelect(questionIndex, optionIndex, true, false)}
          >
            Sai
          </button>
        </div>
      </div>
    );
  }, [selectedAnswers, handleAnswerSelect]);

  // Memoize the question components to prevent unnecessary re-renders
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
        {question.type === "mcq" &&
          question.options.map((option, optionIndex) => 
            renderMCQOption(question, questionIndex, optionIndex, option)
          )
        }
        {question.type === "truefalse" &&
          question.options.map((option, optionIndex) => 
            renderTrueFalseOption(questionIndex, optionIndex, option)
          )
        }
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
  }, [questions, selectedAnswers, renderMCQOption, renderTrueFalseOption, canResume, selectedList, questionIndexMapping]);

  function StudentInfoForm() {
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
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studRollNo">
              Lớp
            </label>
            <input
              type="text"
              id="studRollNo"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nhập lớp"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studClass">
              Trường
            </label>
            <input
              type="text"
              id="studClass"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nhập trường"
            />
          </div>
          <button
            onClick={handleStudentInfoSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  function ResumeExamBanner() {
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
  }

  return (
    <form id="mainForm" className="m-4 md:m-10 lg:m-14">
      {questions.length !== 0 ? (
        questions !== "Sai mã pin" ? (
          questions !== "Already Attempted" ? (
            status !== "inactive" ? (
              !isStudentInfoSubmitted ? (
                <StudentInfoForm />
              ) : (
                <div className="max-w-4xl mx-auto">
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
                  
                  {canResume && <ResumeExamBanner />}
                  
                  {QuestionComponents}
                  <div className="flex justify-center mt-8 mb-8">
                    <button
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
                      type="button"
                      onClick={() => onSubmit()}
                    >
                      Nộp bài
                    </button>
                  </div>
                </div>
              )
            ) : (
              <p className="centeredP">Người tạo đã khóa bài thi.</p>
            )
          ) : (
            <p className="centeredP">Bạn đã làm bài kiểm tra này rồi.</p>
          )
        ) : (
          <p className="centeredP">Bài thi không tồn tại hoặc người tạo đã xóa bài thi.</p>
        )
      ) : (
        <p className="centeredP">Đang tải...</p>
      )}
    </form>
  );
}

export default Form;
