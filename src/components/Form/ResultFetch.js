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
  const [answersTemp, setAnswersTemp] = useState(() => []);
  const [studentAnswers, setStudentAnswers] = useState(() => []);
  const [score, setScore] = useState(() => "");
  const [responseDoc, setResponseDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionScores, setQuestionScores] = useState([]);
  
  let { pin, studentEmail, attemptId } = useParams();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      if (user.email !== studentEmail) {
        navigate("/Dashboard");
        return;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentEmail, navigate]);

  // Data fetching
  useEffect(() => {
    if (loading) return;
    async function fetchData() {
      try {
        setLoading(true);
        // Get question data
        const questionsDoc = await getDoc(
          doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", "questionsTest")
        );
        
        if (!questionsDoc.exists()) {
          setError("Không tìm thấy đề thi");
          setLoading(false);
          return;
        }
        
        setQuestionsTemp(questionsDoc.data().question_question);
        
        // Get answer key
        const answerDocs = await getDoc(
          doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", "answersTest_answerSheet")
        );
        
        if (answerDocs.exists()) {
          setAnswersTemp(answerDocs.data().answer_answer);
        }
        
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
        setStudentAnswers(data.selected_answers || []);
        setScore(data.score || "0/0");
        setResponseDoc(data);
        
        // Calculate scores for each question
        const scores = calculateQuestionScores(
          questionsDoc.data().question_question,
          answersTemp,
          data.selected_answers || []
        );
        setQuestionScores(scores);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Đã xảy ra lỗi khi tải kết quả bài thi");
        setLoading(false);
      }
    }
    
    fetchData();
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
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">Thông tin học sinh</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Họ và tên:</p>
                  <p className="font-medium">{responseDoc.stud_info.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Lớp:</p>
                  <p className="font-medium">{responseDoc.stud_info.class}</p>
                </div>
                <div>
                  <p className="text-gray-600">Trường:</p>
                  <p className="font-medium">{responseDoc.stud_info.school}</p>
                </div>
                <div>
                  <p className="text-gray-600">Loại tài khoản:</p>
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
                  <p className="text-gray-600">Thời gian nộp bài:</p>
                  <p className="font-medium">{formatDate(responseDoc.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Lần thi số:</p>
                  <p className="font-medium">#{responseDoc.attemptNumber || 1}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-lg">Điểm số của bạn:</p>
              <p className="text-3xl font-bold text-blue-600">{score}</p>
            </div>
          </div>
          
          {/* Summary of results */}
          {questionScores.length > 0 && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Tổng hợp kết quả</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        
        <div className="space-y-8">
          {questionsTemp.map((question, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                questionScores[index]?.isCorrect === true 
                  ? 'border-green-500' 
                  : questionScores[index]?.isCorrect === false 
                    ? 'border-red-500' 
                    : 'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <span className={`px-2 py-1 rounded mr-2 text-sm font-medium ${
                    questionScores[index]?.isCorrect === true 
                      ? 'bg-green-100 text-green-800' 
                      : questionScores[index]?.isCorrect === false 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    Câu {index + 1}
                  </span>
                  <div className="text-lg font-medium">
                    <MemoizedMathJax>{question.question}</MemoizedMathJax>
                  </div>
                </div>
                {questionScores[index] && questionScores[index].maxScore > 0 && (
                  <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    questionScores[index].isCorrect === true
                      ? 'bg-green-100 text-green-800'
                      : questionScores[index].isCorrect === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {questionScores[index].score.toFixed(2)} / {questionScores[index].maxScore.toFixed(2)} điểm
                  </div>
                )}
              </div>
              
              {/* Result indicator */}
              {questionScores[index] && (
                <div className={`mb-4 p-3 rounded-lg ${
                  questionScores[index].isCorrect === true
                    ? 'bg-green-50 border border-green-200'
                    : questionScores[index].isCorrect === false
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center">
                    {questionScores[index].isCorrect === true ? (
                      <>
                        <span className="text-green-600 text-xl mr-2">✓</span>
                        <span className="text-green-800 font-medium">Câu trả lời đúng</span>
                      </>
                    ) : questionScores[index].isCorrect === false ? (
                      <>
                        <span className="text-red-600 text-xl mr-2">✗</span>
                        <span className="text-red-800 font-medium">Câu trả lời sai</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600 text-xl mr-2">○</span>
                        <span className="text-gray-800 font-medium">Chưa trả lời</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {question.type === "mcq" && (
                <div className="space-y-3 pl-8">
                  {/* Show correct answer summary */}
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800 mb-1">
                      Đáp án đúng: <span className="font-bold">
                        {(() => {
                          const correctAns = parseInt(answersTemp[index]?.answer || 0);
                          // Handle both 0-based and 1-based indexing
                          const letterIndex = correctAns >= 0 && correctAns < question.options.length 
                            ? correctAns 
                            : Math.max(0, correctAns - 1);
                          return String.fromCharCode(65 + letterIndex);
                        })()}
                      </span>
                    </p>
                    {studentAnswers[index]?.selectedAnswer !== undefined && studentAnswers[index]?.selectedAnswer !== null && (
                      <p className={`text-sm ${
                        (() => {
                          const correctAns = parseInt(answersTemp[index]?.answer || -1);
                          const studentAns = parseInt(studentAnswers[index]?.selectedAnswer || -1);
                          return correctAns === studentAns || (correctAns === studentAns + 1) || (correctAns + 1 === studentAns);
                        })()
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        Đáp án của bạn: <span className="font-bold">
                          {String.fromCharCode(65 + Math.max(0, parseInt(studentAnswers[index]?.selectedAnswer || 0)))}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  {question.options.map((option, optIndex) => {
                    const correctOptionIndex = parseInt(answersTemp[index]?.answer || -1);
                    const studentSelectedOptionIndex = parseInt(studentAnswers[index]?.selectedAnswer || -1);
                    
                    // Handle both 0-based and 1-based indexing
                    const isCorrect = correctOptionIndex === optIndex || correctOptionIndex === optIndex + 1;
                    const isSelected = studentSelectedOptionIndex === optIndex || studentSelectedOptionIndex === optIndex - 1;
                    
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
                            <MemoizedMathJax inline>{option.option}</MemoizedMathJax>
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
              
              {question.type === "truefalse" && (
                <div className="space-y-4 pl-8">
                  {/* Show answer summary */}
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800 mb-2">Đáp án đúng:</p>
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((_, optIndex) => {
                        const correctAnswer = answersTemp[index]?.answer?.[optIndex];
                        return (
                          <span key={optIndex} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            {String.fromCharCode(97 + optIndex)}: {correctAnswer === true ? 'Đúng' : 'Sai'}
                          </span>
                        );
                      })}
                    </div>
                    {studentAnswers[index]?.selectedAnswer && (
                      <p className="font-medium text-gray-800 mt-2 mb-1">Đáp án của bạn:</p>
                    )}
                    {studentAnswers[index]?.selectedAnswer && (
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((_, optIndex) => {
                          const studentAnswer = studentAnswers[index]?.selectedAnswer?.[optIndex];
                          const correctAnswer = answersTemp[index]?.answer?.[optIndex];
                          const isCorrect = studentAnswer === correctAnswer;
                          
                          if (studentAnswer === undefined || studentAnswer === null) {
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
                              {String.fromCharCode(97 + optIndex)}: {studentAnswer === true ? 'Đúng' : 'Sai'} 
                              {isCorrect ? ' ✓' : ' ✗'}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {question.options.map((option, optIndex) => {
                    const correctAnswer = answersTemp[index]?.answer?.[optIndex];
                    const studentAnswer = studentAnswers[index]?.selectedAnswer?.[optIndex];
                    const isCorrect = studentAnswer === correctAnswer;
                    
                    return (
                      <div key={optIndex} className="mb-3">
                        <div className="mb-2 font-medium">
                          <MemoizedMathJax inline>{`${String.fromCharCode(97 + optIndex)}. ${option.option}`}</MemoizedMathJax>
                        </div>
                        <div className="flex ml-8 space-x-4">
                          <div 
                            className={`px-4 py-2 rounded-lg border-2 ${
                              studentAnswer === true 
                                ? correctAnswer === true 
                                  ? 'bg-green-100 border-green-500' 
                                  : 'bg-red-100 border-red-500' 
                                : correctAnswer === true 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center">
                              <span>Đúng</span>
                              {correctAnswer === true && (
                                <span className="text-green-600 ml-2 text-xl font-bold">✓</span>
                              )}
                              {studentAnswer === true && !isCorrect && (
                                <span className="text-red-600 ml-2 text-xl font-bold">✗ Bạn chọn</span>
                              )}
                            </div>
                          </div>
                          <div 
                            className={`px-4 py-2 rounded-lg border-2 ${
                              studentAnswer === false 
                                ? correctAnswer === false 
                                  ? 'bg-green-100 border-green-500' 
                                  : 'bg-red-100 border-red-500' 
                                : correctAnswer === false 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center">
                              <span>Sai</span>
                              {correctAnswer === false && (
                                <span className="text-green-600 ml-2 text-xl font-bold">✓</span>
                              )}
                              {studentAnswer === false && !isCorrect && (
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
              
              {question.type === "shortanswer" && (
                <div className="pl-8">
                  {/* Answer summary */}
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800 mb-2">Đáp án hợp lệ:</p>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const correctAnswers = Array.isArray(answersTemp[index]?.answer) 
                          ? answersTemp[index].answer 
                          : [answersTemp[index]?.answer].filter(a => a);
                        if (correctAnswers.length === 0) return <span className="text-gray-600">Không có đáp án</span>;
                        return correctAnswers.map((ans, ansIndex) => (
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
                  
                  <div className="mb-4">
                    <p className="font-medium mb-1">Câu trả lời của bạn:</p>
                    <div className={`p-3 border-2 rounded-lg ${
                      (() => {
                        const correctAnswers = Array.isArray(answersTemp[index]?.answer) 
                          ? answersTemp[index].answer 
                          : [answersTemp[index]?.answer].filter(a => a);
                        const studentAnswer = studentAnswers[index]?.selectedAnswer?.trim();
                        const isCorrect = studentAnswer && correctAnswers.some(ans => 
                          String(ans).trim().toLowerCase() === studentAnswer.toLowerCase()
                        );
                        return isCorrect 
                          ? 'bg-green-50 border-green-300' 
                          : studentAnswer 
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-gray-50 border-gray-300';
                      })()
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={studentAnswers[index]?.selectedAnswer ? '' : 'text-gray-500 italic'}>
                          {studentAnswers[index]?.selectedAnswer || "Chưa trả lời"}
                        </span>
                        {(() => {
                          const correctAnswers = Array.isArray(answersTemp[index]?.answer) 
                            ? answersTemp[index].answer 
                            : [answersTemp[index]?.answer].filter(a => a);
                          const studentAnswer = studentAnswers[index]?.selectedAnswer?.trim();
                          const isCorrect = studentAnswer && correctAnswers.some(ans => 
                            String(ans).trim().toLowerCase() === studentAnswer.toLowerCase()
                          );
                          return isCorrect ? (
                            <span className="text-green-600 ml-2 text-xl font-bold">✓ Đúng</span>
                          ) : studentAnswer ? (
                            <span className="text-red-600 ml-2 text-xl font-bold">✗ Sai</span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MathJaxContext>
  );
}

export default ResultFetch;
