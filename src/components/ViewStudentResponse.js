import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore/lite';
import db from '../services/firebaseConfig';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

const MemoizedMathJax = React.memo(({ children, ...props }) => (
  <MathJax {...props}>{children}</MathJax>
));

function ViewStudentResponse() {
  const { pin, studentEmail, attemptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [score, setScore] = useState('');
  const [examTitle, setExamTitle] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Validate required parameters
        if (!pin) {
          throw new Error('Thiếu mã bài thi');
        }
        
        if (!studentEmail) {
          throw new Error('Thiếu thông tin học sinh');
        }
        
        // 1. Get Quiz Questions
        try {
          const quizDoc = await getDoc(
            doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", "questionsTest")
          );
          
          if (!quizDoc.exists()) {
            throw new Error('Không tìm thấy đề thi');
          }
          
          const quizData = quizDoc.data();
          setQuestions(quizData.question_question || []);
          setExamTitle(quizData.title || 'Chi tiết bài làm');
        } catch (error) {
          console.error('Error fetching questions:', error);
          throw new Error('Không thể tải thông tin đề thi');
        }
        
        // 2. Get Answer Key
        try {
          const answerDoc = await getDoc(
            doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", "answersTest_answerSheet")
          );
          
          if (answerDoc.exists()) {
            setAnswers(answerDoc.data().answer_answer || []);
          }
        } catch (error) {
          console.error('Error fetching answers:', error);
          // Continue anyway - we can show student response without answers
        }
        
        // 3. Get Student Response
        let responseData = null;
        
        // First try: Use attempt ID if available
        if (attemptId) {
          try {
            const docPath = `${studentEmail}_${attemptId}`;
            console.log(`Trying to fetch response with ID: ${docPath}`);
            
            const responseDoc = await getDoc(
              doc(db, "Paper_Setters", pin, "Responses", docPath)
            );
            
            if (responseDoc.exists()) {
              responseData = responseDoc.data();
              console.log('Found response with attempt ID');
            }
          } catch (error) {
            console.error('Error fetching response with attempt ID:', error);
            // Continue to fallback method
          }
        }
        
        // Second try: Legacy format without attempt ID
        if (!responseData) {
          try {
            console.log(`Trying to fetch response with email only: ${studentEmail}`);
            const responseDoc = await getDoc(
              doc(db, "Paper_Setters", pin, "Responses", studentEmail)
            );
            
            if (responseDoc.exists()) {
              responseData = responseDoc.data();
              console.log('Found response with email only');
            }
          } catch (error) {
            console.error('Error fetching response with email only:', error);
            // Continue to fallback method
          }
        }
        
        // Third try: Find any response that starts with the student email
        if (!responseData) {
          try {
            console.log('Trying to find any matching response');
            const responsesCollection = collection(db, "Paper_Setters", pin, "Responses");
            const querySnapshot = await getDocs(responsesCollection);
            
            // Find any response that starts with the student email
            const matchingDoc = querySnapshot.docs.find(doc => 
              doc.id.startsWith(studentEmail + '_')
            );
            
            if (matchingDoc) {
              responseData = matchingDoc.data();
              console.log('Found response by prefix matching');
            }
          } catch (error) {
            console.error('Error searching for responses:', error);
          }
        }
        
        // Process the response data if found
        if (responseData) {
          setStudentAnswers(responseData.selected_answers || []);
          setStudentInfo(responseData.stud_info || {});
          setScore(responseData.score || '0/0');
          setLoading(false);
        } else {
          throw new Error('Không tìm thấy dữ liệu bài làm');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [pin, studentEmail, attemptId, navigate]);

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
    if (!studentInfo) return 'Unknown';
    
    if (studentInfo.email && studentInfo.email.startsWith('guest_')) {
      return 'Khách';
    }
    
    return 'Đã đăng ký';
  };
  
  const handleBackClick = () => {
    navigate(`/ExamsCreated/ExamResults/${pin}`);
  };

  if (loading) {
    return <div className="text-center p-10">Đang tải bài làm...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleBackClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <MathJaxContext>
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <button 
            onClick={handleBackClick}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-4"
          >
            ← Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold mb-2">{examTitle}</h1>
        </div>
        
        {studentInfo && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Thông tin học sinh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Họ và tên:</p>
                <p className="font-medium">{studentInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Lớp:</p>
                <p className="font-medium">{studentInfo.class}</p>
              </div>
              <div>
                <p className="text-gray-600">Trường:</p>
                <p className="font-medium">{studentInfo.school}</p>
              </div>
              <div>
                <p className="text-gray-600">Email/ID:</p>
                <p className="font-medium text-gray-800" title={studentInfo.email}>
                  {studentInfo.email && studentInfo.email.startsWith('guest_')
                    ? studentInfo.email.substring(0, 12) + '...'
                    : studentInfo.email}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Loại tài khoản:</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  determineUserType() === 'Khách' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {determineUserType()}
                </span>
              </div>
              <div>
                <p className="text-gray-600">Điểm số:</p>
                <p className="font-bold text-blue-600">{score}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 text-sm shrink-0">
                  Câu {qIndex + 1}
                </span>
                <div className="text-lg font-medium">
                  <MemoizedMathJax>{question.question}</MemoizedMathJax>
                </div>
              </div>
              
              {question.type === 'mcq' && (
                <div className="space-y-3 pl-8">
                  {question.options.map((option, oIndex) => {
                    const correctAnswer = answers[qIndex]?.answer;
                    const studentAnswer = studentAnswers[qIndex]?.selectedAnswer;
                    
                    const isCorrect = parseInt(correctAnswer) === oIndex + 1;
                    const isSelected = parseInt(studentAnswer) === oIndex;
                    
                    return (
                      <div 
                        key={oIndex}
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
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <div className="flex-grow">
                            <MemoizedMathJax>{option.option}</MemoizedMathJax>
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
              
              {question.type === 'truefalse' && (
                <div className="space-y-4 pl-8">
                  {question.options.map((option, oIndex) => {
                    const correctAnswer = answers[qIndex]?.answer[oIndex];
                    const studentAnswer = studentAnswers[qIndex]?.selectedAnswer?.[oIndex];
                    
                    return (
                      <div key={oIndex} className="mb-3">
                        <div className="mb-2 font-medium">
                          <MemoizedMathJax>{`${String.fromCharCode(97 + oIndex)}. ${option.option}`}</MemoizedMathJax>
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
              
              {question.type === 'shortanswer' && (
                <div className="pl-8">
                  <div className="mb-4">
                    <p className="font-medium mb-1">Câu trả lời của học sinh:</p>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      {studentAnswers[qIndex]?.selectedAnswer || "Chưa trả lời"}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Đáp án đúng:</p>
                    <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                      {answers[qIndex]?.answer || "Không có đáp án"}
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

export default ViewStudentResponse; 