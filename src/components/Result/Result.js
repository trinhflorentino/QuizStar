import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore/lite';
import db from '../../services/firebaseConfig';
import './Result.css';

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answerKeys, setAnswerKeys] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });

  useEffect(() => {
    // Get student info from sessionStorage (stored during exam submission)
    const storedStudentInfo = sessionStorage.getItem('studentInfo');
    
    if (storedStudentInfo) {
      try {
        setStudentInfo(JSON.parse(storedStudentInfo));
      } catch (error) {
        console.error("Error parsing student info from session storage:", error);
      }
    }
    
    const fetchResultData = async () => {
      try {
        setLoading(true);
        
        // Validate test session exists
        const sessionRef = doc(db, "Paper_Setters", id);
        const sessionDoc = await getDoc(sessionRef);
        
        if (!sessionDoc.exists()) {
          throw new Error("Không tìm thấy phiên thi với mã này.");
        }
        
        const sessionData = sessionDoc.data();
        const creatorUid = sessionData.creator_uid;
        
        // Get quiz data from creator's Exams_Created collection
        const quizRef = doc(db, "Users", creatorUid, "Exams_Created", id);
        const quizDoc = await getDoc(quizRef);
        
        if (!quizDoc.exists()) {
          throw new Error("Không tìm thấy dữ liệu bài thi.");
        }
        
        const quizData = quizDoc.data();
        setQuiz(quizData);
        
        // Get questions for this test session
        const questionsRef = doc(db, "Paper_Setters", id, "Question_Papers_MCQ", quizData.quiz_title);
        const questionsDoc = await getDoc(questionsRef);
        
        if (!questionsDoc.exists()) {
          throw new Error("Không tìm thấy câu hỏi cho phiên thi này.");
        }
        
        const questionsData = questionsDoc.data().question_question || [];
        setQuestions(questionsData);
        
        // Get answer keys for this test session
        const answerKeysRef = doc(db, "Paper_Setters", id, "Question_Papers_MCQ", `${quizData.quiz_title}_answerSheet`);
        const answerKeysDoc = await getDoc(answerKeysRef);
        
        if (!answerKeysDoc.exists()) {
          throw new Error("Không tìm thấy đáp án cho phiên thi này.");
        }
        
        const answerKeysData = answerKeysDoc.data().answer_answer || [];
        setAnswerKeys(answerKeysData);
        
        // Get student submission based on student info from session storage
        if (studentInfo && studentInfo.name && studentInfo.id) {
          const responsesRef = collection(db, "Paper_Setters", id, "Responses");
          const q = query(
            responsesRef,
            where("student_name", "==", studentInfo.name.trim()),
            where("student_id", "==", studentInfo.id.trim()),
            orderBy("timestamp", "desc"),
            limit(1)
          );
          
          const submissionsSnapshot = await getDocs(q);
          
          if (submissionsSnapshot.empty) {
            throw new Error("Không tìm thấy bài làm của bạn.");
          }
          
          const submissionData = submissionsSnapshot.docs[0].data();
          setSubmission(submissionData);
          
          // Calculate score
          let correctCount = 0;
          
          questionsData.forEach((question, index) => {
            const studentAnswer = submissionData.answers[index] || [];
            const correctAnswer = answerKeysData[index] || [];
            
            if (question.type === 'multiple-choice') {
              // For multiple choice, compare arrays
              if (Array.isArray(studentAnswer) && Array.isArray(correctAnswer)) {
                const isCorrect = 
                  studentAnswer.length === correctAnswer.length &&
                  studentAnswer.every(answer => correctAnswer.includes(answer));
                
                if (isCorrect) correctCount++;
              }
            } else {
              // For short answer questions, exact match (can be improved with fuzzy matching)
              if (String(studentAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
                correctCount++;
              }
            }
          });
          
          const totalQuestions = questionsData.length;
          const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
          
          setScore({
            correct: correctCount,
            total: totalQuestions,
            percentage: percentage
          });
        } else {
          throw new Error("Không có thông tin thí sinh.");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching result data:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchResultData();
  }, [id, studentInfo]);

  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A";
    
    const duration = Math.floor((endTime - startTime) / 1000); // in seconds
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    return `${hours > 0 ? hours + ' giờ ' : ''}${minutes} phút ${seconds} giây`;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3">Đang tải kết quả bài thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Vui lòng thử lại hoặc liên hệ người tổ chức thi.</p>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => navigate('/')}
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!studentInfo || !submission || !quiz || !questions.length || !answerKeys.length) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">Dữ liệu không đầy đủ!</h4>
          <p>Không thể hiển thị kết quả do thiếu dữ liệu cần thiết.</p>
          <hr />
          <p className="mb-0">Vui lòng liên hệ người tổ chức thi.</p>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => navigate('/')}
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-header">
        <h2>Kết quả bài thi</h2>
        <h3>{quiz.quiz_title}</h3>
      </div>
      
      <div className="student-info-section">
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Thông tin thí sinh</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Họ và tên:</strong> {studentInfo.name}</p>
                <p><strong>Mã số:</strong> {studentInfo.id}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Thời gian làm bài:</strong> {formatTime(submission.start_time, submission.end_time)}</p>
                <p><strong>Kết quả:</strong> <span className="score-highlight">{score.correct}/{score.total} ({score.percentage}%)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="questions-section">
        <h4>Chi tiết bài làm</h4>
        
        {questions.map((question, index) => {
          const studentAnswer = submission.answers[index] || [];
          const correctAnswer = answerKeys[index] || [];
          let isCorrect = false;
          
          if (question.type === 'multiple-choice') {
            isCorrect = 
              Array.isArray(studentAnswer) && 
              Array.isArray(correctAnswer) &&
              studentAnswer.length === correctAnswer.length &&
              studentAnswer.every(answer => correctAnswer.includes(answer));
          } else {
            isCorrect = String(studentAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
          }
          
          return (
            <div key={index} className={`question-result-card ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="question-header">
                <h5>Câu {index + 1}: {question.question}</h5>
                <span className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'}`}>
                  {isCorrect ? 'Đúng' : 'Sai'}
                </span>
              </div>
              
              {question.type === 'multiple-choice' ? (
                <div className="options">
                  {question.options.map((option, optIndex) => {
                    const isStudentSelected = Array.isArray(studentAnswer) && studentAnswer.includes(optIndex);
                    const isCorrectOption = Array.isArray(correctAnswer) && correctAnswer.includes(optIndex);
                    
                    return (
                      <div key={optIndex} className={`option-item ${isStudentSelected ? (isCorrectOption ? 'correct-selected' : 'wrong-selected') : (isCorrectOption ? 'correct-not-selected' : '')}`}>
                        <span className="option-label">{String.fromCharCode(65 + optIndex)}. {option}</span>
                        {isStudentSelected && (
                          <span className="option-tag">Bạn đã chọn</span>
                        )}
                        {isCorrectOption && (
                          <span className="option-tag correct">Đáp án đúng</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="short-answer-result">
                  <div className="student-answer">
                    <strong>Câu trả lời của bạn:</strong> {studentAnswer || '(Không có câu trả lời)'}
                  </div>
                  <div className="correct-answer">
                    <strong>Đáp án đúng:</strong> {correctAnswer || 'N/A'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="action-buttons">
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default Result; 