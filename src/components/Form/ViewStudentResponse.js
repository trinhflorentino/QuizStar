import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore/lite';
import db from '../../services/firebaseConfig';
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
          // Get all documents from the Question_Papers_MCQ collection
          const questionsSnapshot = await getDocs(
            collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
          );
          
          if (questionsSnapshot.empty) {
            throw new Error('Không tìm thấy đề thi');
          }
          
          // Find the document that contains the questions
          let quizData = null;
          let title = 'Chi tiết bài làm';
          let answersData = null;
          
          for (const doc of questionsSnapshot.docs) {
            const data = doc.data();
            
            // If this document has questions, use it
            if (data.question_question && Array.isArray(data.question_question)) {
              quizData = data;
              title = doc.id;
            }
            
            // If this document has answers, store them
            if (data.answer_answer && Array.isArray(data.answer_answer)) {
              answersData = data;
            }
          }
          
          if (!quizData) {
            throw new Error('Không tìm thấy câu hỏi trong đề thi');
          }
          
          setQuestions(quizData.question_question || []);
          setExamTitle(quizData.title || title);
          
          // If we found answers in the same loop, use them
          if (answersData) {
            setAnswers(answersData.answer_answer || []);
          }
          
        } catch (error) {
          console.error('Error fetching questions:', error);
          throw new Error('Không thể tải thông tin đề thi');
        }
        
        // Only try to get answers separately if we haven't already found them
        if (answers.length === 0) {
          try {
            // Try to find answer sheet with various possible naming patterns
            const answerPatterns = ['_answerSheet', 'answerSheet', 'Answers', 'answers'];
            let answersFound = false;
            
            for (const pattern of answerPatterns) {
              // Look for documents matching possible answer sheet naming patterns
              const answersSnapshot = await getDocs(
                collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
              );
              
              for (const doc of answersSnapshot.docs) {
                if (doc.id.includes(pattern) || doc.data().answer_answer) {
                  setAnswers(doc.data().answer_answer || []);
                  answersFound = true;
                  break;
                }
              }
              
              if (answersFound) break;
            }
          } catch (error) {
            console.error('Error fetching answers:', error);
            // Continue anyway - we can show student response without answers
          }
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
                    // Ensure we have a valid student answer
                    const hasStudentAnswer = studentAnswers[qIndex] && 
                                            studentAnswers[qIndex].selectedAnswer !== undefined && 
                                            studentAnswers[qIndex].selectedAnswer !== null;
                    const studentAnswer = hasStudentAnswer ? studentAnswers[qIndex].selectedAnswer : null;
                    
                    // Form.js uses 0-based indexes for selected answers
                    // but correct answers are 1-based in the database
                    // We need to adjust the comparison accordingly
                    const isCorrect = correctAnswer !== undefined && parseInt(correctAnswer) === oIndex + 1;
                    
                    // Only consider it selected if student explicitly chose this option
                    const isSelected = hasStudentAnswer && parseInt(studentAnswer) === oIndex;
                    
                    // This is for logging only 
                    if (qIndex < 3) {
                      console.log(`Question ${qIndex}, Option ${oIndex}:`, { 
                        correctAnswer, 
                        studentAnswer,
                        hasStudentAnswer, 
                        isCorrect, 
                        isSelected 
                      });
                    }
                    
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
                          {isCorrect && isSelected && (
                            <span className="text-green-600 ml-2">✓</span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-red-600 ml-2">✗</span>
                          )}
                          {isCorrect && !isSelected && (
                            <span className="text-green-600 ml-2 opacity-50">✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Hiển thị đáp án của học sinh */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="font-medium">
                      Đáp án của học sinh: {
                        (() => {
                          const hasStudentAnswer = studentAnswers[qIndex] && 
                                                 studentAnswers[qIndex].selectedAnswer !== undefined && 
                                                 studentAnswers[qIndex].selectedAnswer !== null;
                          
                          if (!hasStudentAnswer) {
                            return <span className="text-gray-500">Chưa trả lời</span>;
                          }
                          
                          const studentAnswer = parseInt(studentAnswers[qIndex].selectedAnswer);
                          const correctAnswer = answers[qIndex]?.answer;
                          const isCorrect = correctAnswer !== undefined && 
                                           studentAnswer === parseInt(correctAnswer) - 1;
                          
                          return (
                            <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600"}>
                              {String.fromCharCode(65 + studentAnswer)}
                            </span>
                          );
                        })()
                      }
                    </p>
                  </div>
                </div>
              )}
              
              {question.type === 'truefalse' && (
                <div className="space-y-4 pl-8">
                  {question.options.map((option, oIndex) => {
                    return (
                      <div key={oIndex} className="mb-3">
                        <div className="mb-2 font-medium">
                          <MemoizedMathJax>{`${String.fromCharCode(97 + oIndex)}. ${option.option}`}</MemoizedMathJax>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Hiển thị tổng hợp đáp án */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="font-medium mb-2">
                      Đáp án của học sinh: {
                        (() => {
                          if (!studentAnswers[qIndex] || !Array.isArray(studentAnswers[qIndex].selectedAnswer)) {
                            return <span className="text-gray-500">Chưa trả lời</span>;
                          }
                          
                          return question.options.map((option, oIndex) => {
                            const hasAnswer = studentAnswers[qIndex].selectedAnswer[oIndex] !== undefined && 
                                             studentAnswers[qIndex].selectedAnswer[oIndex] !== null;
                            
                            if (!hasAnswer) {
                              return (
                                <span key={oIndex} className="text-gray-500">
                                  {oIndex > 0 && "; "}
                                  {String.fromCharCode(97 + oIndex)}) Chưa trả lời
                                </span>
                              );
                            }
                            
                            const studentAnswer = studentAnswers[qIndex].selectedAnswer[oIndex];
                            const correctAnswer = answers[qIndex]?.answer[oIndex];
                            const isCorrect = studentAnswer === correctAnswer;
                            
                            return (
                              <span 
                                key={oIndex} 
                                className={isCorrect ? "text-green-600" : "text-red-600"}
                              >
                                {oIndex > 0 && "; "}
                                {String.fromCharCode(97 + oIndex)}) {studentAnswer ? "Đúng" : "Sai"}
                              </span>
                            );
                          });
                        })()
                      }
                    </p>
                    
                    <p className="font-medium">
                      Đáp án đúng: {
                        question.options.map((option, oIndex) => {
                          const correctAnswer = answers[qIndex]?.answer[oIndex];
                          
                          return (
                            <span key={oIndex} className="text-green-600">
                              {oIndex > 0 && "; "}
                              {String.fromCharCode(97 + oIndex)}) {correctAnswer ? "Đúng" : "Sai"}
                            </span>
                          );
                        })
                      }
                    </p>
                  </div>
                </div>
              )}
              
              {question.type === 'shortanswer' && (
                <div className="pl-8">
                  <div className="mb-4">
                    <p className="font-medium mb-1">Câu trả lời của học sinh:</p>
                    <div className={`p-3 border rounded-lg ${
                      studentAnswers[qIndex]?.selectedAnswer 
                        ? (() => {
                            const correctAnswers = Array.isArray(answers[qIndex]?.answer) 
                              ? answers[qIndex].answer 
                              : [answers[qIndex]?.answer].filter(a => a);
                            const studentAnswer = studentAnswers[qIndex].selectedAnswer.trim();
                            const isCorrect = correctAnswers.some(ans => 
                              String(ans).trim().toLowerCase() === studentAnswer.toLowerCase()
                            );
                            return isCorrect ? 'bg-green-50 border-green-300' : 'bg-gray-50';
                          })()
                        : 'bg-gray-50 text-gray-400 italic'
                    }`}>
                      {studentAnswers[qIndex]?.selectedAnswer 
                        ? studentAnswers[qIndex].selectedAnswer 
                        : "Chưa trả lời"}
                      
                      {(() => {
                        const correctAnswers = Array.isArray(answers[qIndex]?.answer) 
                          ? answers[qIndex].answer 
                          : [answers[qIndex]?.answer].filter(a => a);
                        const studentAnswer = studentAnswers[qIndex]?.selectedAnswer?.trim();
                        const isCorrect = studentAnswer && correctAnswers.some(ans => 
                          String(ans).trim().toLowerCase() === studentAnswer.toLowerCase()
                        );
                        return isCorrect ? <span className="text-green-600 ml-2">✓</span> : null;
                      })()}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Đáp án hợp lệ:</p>
                    <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                      {(() => {
                        const correctAnswers = Array.isArray(answers[qIndex]?.answer) 
                          ? answers[qIndex].answer 
                          : [answers[qIndex]?.answer].filter(a => a);
                        if (correctAnswers.length === 0) return "Không có đáp án";
                        return (
                          <div className="flex flex-wrap gap-2">
                            {correctAnswers.map((ans, ansIndex) => (
                              <span 
                                key={ansIndex}
                                className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-sm font-medium"
                              >
                                {String(ans).trim()}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Hiển thị tổng hợp đáp án */}
                  {/* <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="font-medium">
                      Đáp án của học sinh: {
                        (() => {
                          if (!studentAnswers[qIndex] || studentAnswers[qIndex].selectedAnswer === undefined || 
                              studentAnswers[qIndex].selectedAnswer === null || studentAnswers[qIndex].selectedAnswer === '') {
                            return <span className="text-gray-500">Không trả lời</span>;
                          }
                          
                          const studentAnswer = studentAnswers[qIndex].selectedAnswer;
                          const correctAnswer = answers[qIndex]?.answer;
                          const isCorrect = studentAnswer === correctAnswer;
                          
                          return (
                            <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600"}>
                              {studentAnswer} {isCorrect && "✓"}
                            </span>
                          );
                        })()
                      }
                    </p>
                  </div> */}
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