import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import React from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MathJaxContext, MathJax } from 'better-react-mathjax';

const MemoizedMathJax = ({ children, ...props }) => (
  <MathJax {...props}>{children}</MathJax>
);

function ResultFetch() {
  const [questionsTemp, setQuestionsTemp] = useState(() => []);
  const [originalQuestions, setOriginalQuestions] = useState(() => []);
  const [answersTemp, setAnswersTemp] = useState(() => []);
  const [studentAnswers, setStudentAnswers] = useState(() => []);
  const [score, setScore] = useState(() => "");
  const [responseDoc, setResponseDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionScores, setQuestionScores] = useState([]);
  const [orderMapping, setOrderMapping] = useState({});
  
  let { pin, studentEmail, attemptId } = useParams();
  const navigate = useNavigate();

  // Authentication check - allow guest users
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Allow guest users (email starts with 'guest_')
      if (user && user.email && !user.email.startsWith('guest_') && user.email !== studentEmail) {
        navigate("/Dashboard");
        return;
      }
      // Don't block if user is not logged in (guest user)
      // Auth check complete, allow data fetching
    });

    return () => unsubscribe();
  }, [studentEmail, navigate]);

  // Data fetching
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Get all documents from Question_Papers_MCQ collection (same as Form.js)
        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin,
          "Question_Papers_MCQ"
        );
        const docos = await getDocs(settersCollectionRef);
        
        if (docos.docs.length === 0) {
          setError("Không tìm thấy đề thi");
          setLoading(false);
          return;
        }
        
        const docosData = docos.docs.map((doc) => doc.data());
        
        // Find document with question_question (questions document)
        let questionsData = null;
        for (let i = 0; i < docosData.length; i++) {
          if (docosData[i].question_question) {
            questionsData = docosData[i].question_question;
            break;
          }
        }
        
        if (!questionsData) {
          setError("Không tìm thấy câu hỏi");
          setLoading(false);
          return;
        }
        
        // Store both shuffled and original questions
        setQuestionsTemp(questionsData);
        setOriginalQuestions(questionsData); // For now, assume no shuffle in ResultFetch
        
        // Find answer document (same logic as Form.js)
        let answersData = null;
        if (docos.docs.length > 1) {
          // Check second document
          if (docosData[1].answer_answer) {
            answersData = docosData[1].answer_answer;
          }
        }
        
        // If not found, search for document with _answerSheet in id or answer_answer field
        if (!answersData) {
          for (const doc of docos.docs) {
            if (doc.id.includes('_answerSheet') || doc.data().answer_answer) {
              answersData = doc.data().answer_answer || [];
              break;
            }
          }
        }
        
        if (answersData) {
          setAnswersTemp(answersData);
          console.log('✅ Answers found:', answersData.length, 'answers');
        } else {
          console.warn('⚠️ No answers found in collection');
        }
        
        console.log('✅ Questions found:', questionsData.length, 'questions');
        
        // Get student response - with attempt ID if available
        let responseDocRef;
        if (attemptId) {
          // New format with attempt ID
          responseDocRef = doc(
            db, 
            "Paper_Setters", 
            pin, 
            "Responses", 
            `${studentEmail}_${attemptId}`
          );
        } else {
          // Legacy format without attempt ID
          responseDocRef = doc(
            db, 
            "Paper_Setters", 
            pin, 
            "Responses", 
            studentEmail
          );
        }
        
        const response = await getDoc(responseDocRef);
        
        if (!response.exists()) {
          // Try alternative format if the first attempt fails
          if (!attemptId) {
            // If we don't have an attemptId, search for any responses with this email prefix
            const alternativeResponse = await getDoc(
              doc(db, "Paper_Setters", pin, "Responses", studentEmail)
            );
            
            if (alternativeResponse.exists()) {
              const data = alternativeResponse.data();
              setStudentAnswers(data.selected_answers || []);
              setScore(data.score || "0/0");
              setResponseDoc(data);
              setLoading(false);
              return;
            }
          }
          
          setError("Không tìm thấy bài làm của học sinh");
          setLoading(false);
          return;
        }
        
        const data = response.data();
        console.log('✅ Response data:', {
          hasSelectedAnswers: !!data.selected_answers,
          selectedAnswersLength: data.selected_answers?.length,
          score: data.score,
          hasOrderMapping: !!data.orderMapping
        });
        
        // Store orderMapping if exists (for shuffled questions)
        // Note: questionsData from database is already in original order
        // orderMapping maps: originalIndex -> {newIndex, optionMapping}
        // We need to display questions in original order, so no reconstruction needed
        if (data.orderMapping) {
          setOrderMapping(data.orderMapping);
          console.log('✅ Order mapping found:', Object.keys(data.orderMapping).length, 'mappings');
          console.log('📋 Order mapping details:', data.orderMapping);
        }
        
        setStudentAnswers(data.selected_answers || []);
        setScore(data.score || "0/0");
        setResponseDoc(data);
        
        // Calculate scores for each question (use answersData if available)
        // Use questionsData (already in original order) and answersData
        // studentAnswers are stored by originalIndex
        if (answersData) {
          const scores = calculateQuestionScores(
            questionsData, // Already in original order
            answersData,   // Already in original order
            data.selected_answers || [] // Stored by originalIndex
          );
          console.log('✅ Calculated scores:', scores.length, 'question scores');
          console.log('📊 Scores array:', scores.map((s, i) => ({ index: i, isCorrect: s.isCorrect, score: s.score })));
          setQuestionScores(scores);
        } else {
          console.warn('⚠️ Cannot calculate scores - no answers data');
          // If answers not found, set empty scores array
          setQuestionScores([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Đã xảy ra lỗi khi tải kết quả bài thi");
        setLoading(false);
      }
    }
    
    if (pin && studentEmail) {
      fetchData();
    }
  }, [pin, studentEmail, attemptId]);

  // Format the timestamp to a readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Convert Firebase timestamp to JavaScript Date
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const determineUserType = () => {
    if (!responseDoc) return 'Unknown';
    
    if (responseDoc.isGuest || (responseDoc.stud_info && responseDoc.stud_info.email && 
        responseDoc.stud_info.email.startsWith('guest_'))) {
      return 'Khách';
    }
    
    return 'Đã đăng ký';
  };

  // Calculate score for each question
  const calculateQuestionScores = (questions, correctAnswers, studentAnswers) => {
    if (!questions || !correctAnswers || !studentAnswers) return [];
    
    return questions.map((question, index) => {
      if (question.type === 'textblock') {
        return { score: 0, maxScore: 0, isCorrect: null };
      }
      
      const userAnswer = studentAnswers[index];
      const correctAnswer = correctAnswers[index];
      const questionScore = parseFloat(question.score || 1);
      
      if (!userAnswer || !correctAnswer) {
        return { score: 0, maxScore: questionScore, isCorrect: false };
      }
      
      let isCorrect = false;
      let earnedScore = 0;
      
      if (question.type === "mcq") {
        // MCQ answer is stored as index (0-based), but correctAnswer.answer might be 1-based
        const correctIndex = parseInt(correctAnswer.answer);
        const studentIndex = parseInt(userAnswer.selectedAnswer);
        // Handle both 0-based and 1-based indexing
        isCorrect = correctIndex === studentIndex || (correctIndex === studentIndex + 1) || (correctIndex + 1 === studentIndex);
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
          }
          
          earnedScore = questionScore * percentScore;
          isCorrect = percentScore === 1;
        }
      }
      
      return { 
        score: earnedScore, 
        maxScore: questionScore, 
        isCorrect: isCorrect 
      };
    });
  };

  // Conditional renders
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <MathJaxContext>
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Kết quả bài thi</h1>
          
          {responseDoc && responseDoc.stud_info && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Thông tin học sinh</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Họ và tên:</p>
                  <p className="font-medium text-sm sm:text-base">{responseDoc.stud_info.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Lớp:</p>
                  <p className="font-medium text-sm sm:text-base">{responseDoc.stud_info.class}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Trường:</p>
                  <p className="font-medium text-sm sm:text-base">{responseDoc.stud_info.school}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Loại tài khoản:</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded text-xs ${
                      determineUserType() === 'Khách' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {determineUserType()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Thời gian nộp bài:</p>
                  <p className="font-medium text-sm sm:text-base">{formatDate(responseDoc.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Lần thi số:</p>
                  <p className="font-medium text-sm sm:text-base">#{responseDoc.attemptNumber || 1}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4 sm:mb-6">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
              <p className="text-base sm:text-lg mb-2">Điểm số của bạn:</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                {score || (responseDoc?.scoreQ && responseDoc?.scoreAll 
                  ? `${parseFloat(responseDoc.scoreQ).toFixed(2)} / ${parseFloat(responseDoc.scoreAll).toFixed(2)}`
                  : '0 / 0')}
              </p>
            </div>
          </div>
          
          {/* Summary of results */}
          {questionScores.length > 0 ? (
            <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h2 className="text-base sm:text-lg font-semibold mb-3">Tổng hợp kết quả</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {questionScores.filter(q => q.isCorrect === true).length}
                  </p>
                  <p className="text-sm text-gray-600">Câu đúng</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {questionScores.filter(q => q.isCorrect === false).length}
                  </p>
                  <p className="text-sm text-gray-600">Câu sai</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    {questionScores.filter(q => q.isCorrect === null).length}
                  </p>
                  <p className="text-sm text-gray-600">Chưa làm</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {questionScores.reduce((sum, q) => sum + q.score, 0).toFixed(2)} / {questionScores.reduce((sum, q) => sum + q.maxScore, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Tổng điểm</p>
                </div>
              </div>
            </div>
          ) : questionsTemp.length > 0 && (
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                ⚠️ Không thể tính điểm chi tiết. Vui lòng kiểm tra lại đáp án.
              </p>
            </div>
          )}
          
          <Link
            to={`/pinverify/Form/${pin}`}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-8"
          >
            Về trang chính
          </Link>
          
          {responseDoc && responseDoc.attemptId && (
            <div className="mt-4">
              <Link
                to={`/pinverify/Form/${pin}/ResultFetch/${studentEmail}`}
                className="text-blue-600 hover:underline"
              >
                Xem tất cả các lần làm bài
              </Link>
            </div>
          )}
        </div>
        
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {questionsTemp.length > 0 ? questionsTemp.map((question, displayIndex) => {
            // Skip textblock questions
            if (question.type === 'textblock') return null;
            
            // Questions from database are already in original order
            // displayIndex = originalIndex (no mapping needed for display)
            // Answers and student answers are stored by originalIndex
            const originalIndex = displayIndex;
            
            // Get answer and student answer using original index
            const correctAnswer = answersTemp[originalIndex];
            const studentAnswer = studentAnswers[originalIndex];
            // For questionScores, try originalIndex first, then displayIndex
            const questionScore = questionScores[originalIndex] !== undefined 
              ? questionScores[originalIndex] 
              : questionScores[displayIndex];
            
            // Get option mapping if exists (for shuffled options)
            // optionMapping maps: displayOptionIndex -> originalOptionIndex
            const optionMapping = orderMapping[originalIndex]?.optionMapping;
            
            // Debug log
            if (originalIndex < 2) {
              console.log(`🔍 Question ${originalIndex}:`, {
                correctAnswer: correctAnswer?.answer,
                studentAnswer: studentAnswer?.selectedAnswer,
                hasOptionMapping: !!optionMapping,
                optionMapping: optionMapping,
                optionsCount: question.options?.length,
                options: question.options?.map((opt, idx) => ({ idx, text: opt?.option?.substring(0, 50) }))
              });
            }
            
            // Reconstruct options in shuffled order if optionMapping exists
            // If options were shuffled, we need to show them in shuffled order
            // But answers are stored in original index
            let displayOptions = question.options;
            if (optionMapping && Object.keys(optionMapping).length > 0) {
              // Reconstruct options in shuffled order
              const shuffledOptions = [];
              const originalOptions = [...question.options];
              
              // optionMapping: {displayIndex: originalIndex}
              // We need to create array where shuffledOptions[displayIndex] = originalOptions[originalIndex]
              const maxDisplayIndex = Math.max(...Object.keys(optionMapping).map(k => parseInt(k)));
              for (let i = 0; i <= maxDisplayIndex; i++) {
                const originalOptIdx = optionMapping[i];
                if (originalOptIdx !== undefined && originalOptions[originalOptIdx]) {
                  shuffledOptions[i] = originalOptions[originalOptIdx];
                }
              }
              
              // Fill any missing indices
              for (let i = 0; i < originalOptions.length; i++) {
                if (!shuffledOptions[i]) {
                  shuffledOptions[i] = originalOptions[i];
                }
              }
              
              displayOptions = shuffledOptions.filter(opt => opt !== undefined);
              console.log(`🔄 Reconstructed options for Q${originalIndex}:`, {
                originalCount: originalOptions.length,
                shuffledCount: displayOptions.length,
                optionMapping,
                displayOptions: displayOptions.map((opt, idx) => ({ idx, text: opt?.option?.substring(0, 30) }))
              });
            }
            
            return (
            <div 
              key={displayIndex} 
              className={`bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 border-l-4 transition-all ${
                questionScore?.isCorrect === true 
                  ? 'border-green-500 shadow-green-50' 
                  : questionScore?.isCorrect === false 
                    ? 'border-red-500 shadow-red-50' 
                    : 'border-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex items-start flex-1">
                  <span className={`px-2 sm:px-3 py-1 rounded mr-2 sm:mr-3 text-xs sm:text-sm font-medium flex-shrink-0 ${
                    questionScore?.isCorrect === true 
                      ? 'bg-green-100 text-green-800' 
                      : questionScore?.isCorrect === false 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    Câu {displayIndex + 1}
                  </span>
                  <div className="text-base sm:text-lg md:text-xl font-medium flex-1">
                    <MemoizedMathJax>{question.question}</MemoizedMathJax>
                  </div>
                </div>
                {questionScore && questionScore.maxScore > 0 && (
                  <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex-shrink-0 ${
                    questionScore.isCorrect === true
                      ? 'bg-green-100 text-green-800'
                      : questionScore.isCorrect === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {questionScore.score.toFixed(2)} / {questionScore.maxScore.toFixed(2)} điểm
                  </div>
                )}
              </div>
              
              {/* Result indicator */}
              {questionScore && (
                <div className={`mb-4 p-3 sm:p-4 rounded-lg ${
                  questionScore.isCorrect === true
                    ? 'bg-green-50 border border-green-200'
                    : questionScore.isCorrect === false
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center">
                    {questionScore.isCorrect === true ? (
                      <>
                        <span className="text-green-600 text-lg sm:text-xl mr-2">✓</span>
                        <span className="text-green-800 font-medium text-sm sm:text-base">Câu trả lời đúng</span>
                      </>
                    ) : questionScore.isCorrect === false ? (
                      <>
                        <span className="text-red-600 text-lg sm:text-xl mr-2">✗</span>
                        <span className="text-red-800 font-medium text-sm sm:text-base">Câu trả lời sai</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600 text-lg sm:text-xl mr-2">○</span>
                        <span className="text-gray-800 font-medium text-sm sm:text-base">Chưa trả lời</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {question.type === "mcq" && correctAnswer && (
                <div className="space-y-3 pl-4 sm:pl-6 md:pl-8">
                  {/* Show correct answer summary */}
                  <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800 mb-2 text-sm sm:text-base">
                      Đáp án đúng: <span className="font-bold text-base sm:text-lg">
                        {(() => {
                          const correctAns = parseInt(correctAnswer?.answer || 0);
                          // correctAns is in original index
                          // If options were shuffled, find display index for this original index
                          if (optionMapping) {
                            const displayOptIdx = Object.keys(optionMapping).find(
                              k => parseInt(optionMapping[k]) === correctAns
                            );
                            if (displayOptIdx !== undefined) {
                              return String.fromCharCode(65 + parseInt(displayOptIdx));
                            }
                          }
                          // No shuffle, direct mapping
                          if (correctAns >= 0 && correctAns < question.options.length) {
                            return String.fromCharCode(65 + correctAns);
                          }
                          return 'N/A';
                        })()}
                      </span>
                    </p>
                    {studentAnswer?.selectedAnswer !== undefined && studentAnswer?.selectedAnswer !== null && (
                      <p className={`text-xs sm:text-sm ${
                        (() => {
                          const correctAns = parseInt(correctAnswer?.answer || -1);
                          const studentAns = parseInt(studentAnswer?.selectedAnswer || -1);
                          // Both in original index
                          return correctAns === studentAns;
                        })()
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        Đáp án của bạn: <span className="font-bold">
                          {(() => {
                            const studentAns = parseInt(studentAnswer?.selectedAnswer || 0);
                            // studentAns is in original index
                            // If options were shuffled, find display index
                            if (optionMapping) {
                              const displayOptIdx = Object.keys(optionMapping).find(
                                k => parseInt(optionMapping[k]) === studentAns
                              );
                              if (displayOptIdx !== undefined) {
                                return String.fromCharCode(65 + parseInt(displayOptIdx));
                              }
                            }
                            // No shuffle, direct mapping
                            if (studentAns >= 0 && studentAns < question.options.length) {
                              return String.fromCharCode(65 + studentAns);
                            }
                            return 'N/A';
                          })()}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  {displayOptions.map((option, displayOptIndex) => {
                    // displayOptIndex is the index in shuffled/display order
                    // optionMapping[displayOptIndex] gives the original index for this display option
                    let originalOptIndex = displayOptIndex;
                    if (optionMapping && optionMapping[displayOptIndex] !== undefined) {
                      originalOptIndex = parseInt(optionMapping[displayOptIndex]);
                    }
                    
                    // Correct answer and student answer are stored in original index
                    let correctOptionIndex = -1;
                    if (correctAnswer?.answer !== undefined && correctAnswer?.answer !== null) {
                      correctOptionIndex = typeof correctAnswer.answer === 'number' 
                        ? correctAnswer.answer 
                        : parseInt(correctAnswer.answer);
                    }
                    
                    let studentSelectedOptionIndex = -1;
                    if (studentAnswer?.selectedAnswer !== undefined && studentAnswer?.selectedAnswer !== null) {
                      studentSelectedOptionIndex = typeof studentAnswer.selectedAnswer === 'number'
                        ? studentAnswer.selectedAnswer
                        : parseInt(studentAnswer.selectedAnswer);
                    }
                    
                    // To check if this display option is correct/selected:
                    // We need to find which displayOptIndex corresponds to the correct/selected original index
                    // Create reverse mapping: originalIndex -> displayOptIndex
                    let correctDisplayOptIndex = -1;
                    let selectedDisplayOptIndex = -1;
                    
                    if (optionMapping) {
                      // Find display index for correct answer (original index)
                      const correctEntry = Object.entries(optionMapping).find(
                        ([_, origIdx]) => parseInt(origIdx) === correctOptionIndex
                      );
                      if (correctEntry) {
                        correctDisplayOptIndex = parseInt(correctEntry[0]);
                      }
                      
                      // Find display index for student answer (original index)
                      const selectedEntry = Object.entries(optionMapping).find(
                        ([_, origIdx]) => parseInt(origIdx) === studentSelectedOptionIndex
                      );
                      if (selectedEntry) {
                        selectedDisplayOptIndex = parseInt(selectedEntry[0]);
                      }
                    } else {
                      // No shuffle, direct mapping
                      correctDisplayOptIndex = correctOptionIndex;
                      selectedDisplayOptIndex = studentSelectedOptionIndex;
                    }
                    
                    // Compare using display index
                    const isCorrect = correctDisplayOptIndex === displayOptIndex;
                    const isSelected = selectedDisplayOptIndex === displayOptIndex;
                    
                    // Debug log for first 2 questions
                    if (originalIndex < 2) {
                      console.log(`🔍 Q${originalIndex} Opt${displayOptIndex}:`, {
                        displayOptIndex,
                        originalOptIndex,
                        correctAnswerRaw: correctAnswer?.answer,
                        correctOptionIndex,
                        correctDisplayOptIndex,
                        studentAnswerRaw: studentAnswer?.selectedAnswer,
                        studentSelectedOptionIndex,
                        selectedDisplayOptIndex,
                        optionMapping: optionMapping?.[displayOptIndex],
                        isCorrect,
                        isSelected
                      });
                    }
                    
                    return (
                      <div 
                        key={displayOptIndex}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                          isCorrect && isSelected 
                            ? 'bg-green-100 border-green-500 shadow-sm' 
                            : isSelected && !isCorrect 
                              ? 'bg-red-100 border-red-500 shadow-sm' 
                              : isCorrect 
                                ? 'bg-green-50 border-green-300' 
                                : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                          <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 font-medium text-sm sm:text-base md:text-lg mr-2 sm:mr-3 flex-shrink-0 ${
                            isCorrect && isSelected
                              ? 'border-green-600 bg-green-100 text-green-800'
                              : isCorrect
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : isSelected
                                  ? 'border-red-600 bg-red-100 text-red-800'
                                  : 'border-gray-400 bg-white'
                          }`}>
                            {String.fromCharCode(65 + displayOptIndex)}
                          </span>
                          <div className="flex-grow text-sm sm:text-base">
                            <MemoizedMathJax inline>{option.option}</MemoizedMathJax>
                          </div>
                          <div className="flex-shrink-0">
                            {isCorrect && (
                              <span className="text-green-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✓ Đúng</span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Bạn chọn</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {question.type === "truefalse" && correctAnswer && (
                <div className="space-y-4 pl-4 sm:pl-6 md:pl-8">
                  {/* Show answer summary */}
                  <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800 mb-2 text-sm sm:text-base">Đáp án đúng:</p>
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((_, optIndex) => {
                        const correctAns = correctAnswer?.answer?.[optIndex];
                        return (
                          <span key={optIndex} className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded text-xs sm:text-sm">
                            {String.fromCharCode(97 + optIndex)}: {correctAns === true ? 'Đúng' : 'Sai'}
                          </span>
                        );
                      })}
                    </div>
                    {studentAnswer?.selectedAnswer && (
                      <p className="font-medium text-gray-800 mt-2 mb-1 text-sm sm:text-base">Đáp án của bạn:</p>
                    )}
                    {studentAnswer?.selectedAnswer && (
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((_, optIndex) => {
                          const studentAns = studentAnswer?.selectedAnswer?.[optIndex];
                          const correctAns = correctAnswer?.answer?.[optIndex];
                          const isCorrect = studentAns === correctAns;
                          
                          if (studentAns === undefined || studentAns === null) {
                            return (
                              <span key={optIndex} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs sm:text-sm">
                                {String.fromCharCode(97 + optIndex)}: Chưa trả lời
                              </span>
                            );
                          }
                          
                          return (
                            <span 
                              key={optIndex} 
                              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
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
                    )}
                  </div>
                  
                  {question.options.map((option, optIndex) => {
                    const correctAns = correctAnswer?.answer?.[optIndex];
                    const studentAns = studentAnswer?.selectedAnswer?.[optIndex];
                    const isCorrect = studentAns === correctAns;
                    
                    return (
                      <div key={optIndex} className="mb-3 sm:mb-4">
                        <div className="mb-2 font-medium text-sm sm:text-base">
                          <MemoizedMathJax inline>{`${String.fromCharCode(97 + optIndex)}. ${option.option}`}</MemoizedMathJax>
                        </div>
                        <div className="flex flex-col sm:flex-row ml-4 sm:ml-8 gap-2 sm:gap-4">
                          <div 
                            className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all ${
                              studentAns === true 
                                ? correctAns === true 
                                  ? 'bg-green-100 border-green-500 shadow-sm' 
                                  : 'bg-red-100 border-red-500 shadow-sm' 
                                : correctAns === true 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'border-gray-300 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between sm:justify-start">
                              <span className="text-sm sm:text-base">Đúng</span>
                              {correctAns === true && (
                                <span className="text-green-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✓</span>
                              )}
                              {studentAns === true && !isCorrect && (
                                <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Bạn chọn</span>
                              )}
                            </div>
                          </div>
                          <div 
                            className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all ${
                              studentAns === false 
                                ? correctAns === false 
                                  ? 'bg-green-100 border-green-500 shadow-sm' 
                                  : 'bg-red-100 border-red-500 shadow-sm' 
                                : correctAns === false 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'border-gray-300 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between sm:justify-start">
                              <span className="text-sm sm:text-base">Sai</span>
                              {correctAns === false && (
                                <span className="text-green-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✓</span>
                              )}
                              {studentAns === false && !isCorrect && (
                                <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Bạn chọn</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {question.type === "shortanswer" && correctAnswer && (
                <div className="pl-4 sm:pl-6 md:pl-8">
                  {/* Answer summary */}
                  <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800 mb-2 text-sm sm:text-base">Đáp án hợp lệ:</p>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const correctAnswers = Array.isArray(correctAnswer?.answer) 
                          ? correctAnswer.answer 
                          : [correctAnswer?.answer].filter(a => a);
                        if (correctAnswers.length === 0) return <span className="text-gray-600 text-xs sm:text-sm">Không có đáp án</span>;
                        return correctAnswers.map((ans, ansIndex) => (
                          <span 
                            key={ansIndex}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-xs sm:text-sm font-medium"
                          >
                            {String(ans).trim()}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium mb-2 text-sm sm:text-base">Câu trả lời của bạn:</p>
                    {(() => {
                      const correctAnswers = Array.isArray(correctAnswer?.answer) 
                        ? correctAnswer.answer 
                        : [correctAnswer?.answer].filter(a => a);
                      const studentAns = studentAnswer?.selectedAnswer?.trim();
                      const isCorrect = studentAns && correctAnswers.some(ans => 
                        String(ans).trim().toLowerCase() === studentAns.toLowerCase()
                      );
                      
                      return (
                        <div className={`p-3 sm:p-4 border-2 rounded-lg ${
                          isCorrect 
                            ? 'bg-green-50 border-green-300' 
                            : studentAns 
                              ? 'bg-red-50 border-red-300' 
                              : 'bg-gray-50 border-gray-300'
                        }`}>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className={`text-sm sm:text-base ${studentAns ? '' : 'text-gray-500 italic'}`}>
                              {studentAns || "Chưa trả lời"}
                            </span>
                            {isCorrect ? (
                              <span className="text-green-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✓ Đúng</span>
                            ) : studentAns ? (
                              <span className="text-red-600 ml-2 text-base sm:text-lg md:text-xl font-bold">✗ Sai</span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            );
          }) : (
            <div className="text-center p-8 text-gray-600">
              <p>Không có câu hỏi nào để hiển thị.</p>
            </div>
          )}
        </div>
      </div>
    </MathJaxContext>
  );
}

export default ResultFetch;
