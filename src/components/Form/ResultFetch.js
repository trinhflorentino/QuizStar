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
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-sm">
                  Câu {index + 1}
                </span>
                <div className="text-lg font-medium">
                  <MemoizedMathJax>{question.question}</MemoizedMathJax>
                </div>
              </div>
              
              {question.type === "mcq" && (
                <div className="space-y-3 pl-8">
                  {question.options.map((option, optIndex) => {
                    const correctOptionIndex = answersTemp[index]?.answer;
                    const studentSelectedOptionIndex = studentAnswers[index]?.selectedAnswer;
                    
                    const isCorrect = parseInt(correctOptionIndex) === optIndex + 1;
                    const isSelected = parseInt(studentSelectedOptionIndex) === optIndex;
                    
                    return (
                      <div 
                        key={optIndex}
                        className={`p-3 rounded-lg border ${
                          isCorrect && isSelected 
                            ? 'bg-green-100 border-green-500' 
                            : isSelected && !isCorrect 
                              ? 'bg-red-100 border-red-500' 
                              : isCorrect 
                                ? 'border-green-500' 
                                : 'border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium text-lg mr-3">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <div className="flex-grow">
                            <MemoizedMathJax inline>{option.option}</MemoizedMathJax>
                          </div>
                          {isCorrect && (
                            <span className="text-green-600 ml-2">✓</span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-red-600 ml-2">✗</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {question.type === "truefalse" && (
                <div className="space-y-4 pl-8">
                  {question.options.map((option, optIndex) => {
                    const correctAnswer = answersTemp[index]?.answer[optIndex];
                    const studentAnswer = studentAnswers[index]?.selectedAnswer?.[optIndex];
                    
                    return (
                      <div key={optIndex} className="mb-3">
                        <div className="mb-2 font-medium">
                          <MemoizedMathJax inline>{`${String.fromCharCode(97 + optIndex)}. ${option.option}`}</MemoizedMathJax>
                        </div>
                        <div className="flex ml-8 space-x-4">
                          <div 
                            className={`px-4 py-2 rounded-lg border ${
                              studentAnswer === true 
                                ? correctAnswer === true 
                                  ? 'bg-green-100 border-green-500' 
                                  : 'bg-red-100 border-red-500' 
                                : correctAnswer === true 
                                  ? 'border-green-500' 
                                  : 'border-gray-300'
                            }`}
                          >
                            Đúng
                            {correctAnswer === true && (
                              <span className="text-green-600 ml-2">✓</span>
                            )}
                          </div>
                          <div 
                            className={`px-4 py-2 rounded-lg border ${
                              studentAnswer === false 
                                ? correctAnswer === false 
                                  ? 'bg-green-100 border-green-500' 
                                  : 'bg-red-100 border-red-500' 
                                : correctAnswer === false 
                                  ? 'border-green-500' 
                                  : 'border-gray-300'
                            }`}
                          >
                            Sai
                            {correctAnswer === false && (
                              <span className="text-green-600 ml-2">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {question.type === "shortanswer" && (
                <div className="pl-8">
                  <div className="mb-4">
                    <p className="font-medium mb-1">Câu trả lời của bạn:</p>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      {studentAnswers[index]?.selectedAnswer || "Chưa trả lời"}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Đáp án đúng:</p>
                    <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                      {answersTemp[index]?.answer || "Không có đáp án"}
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
