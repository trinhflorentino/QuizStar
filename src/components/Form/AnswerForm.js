import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore/lite';
import { useBeforeunload } from 'react-beforeunload';
import db from '../../services/firebaseConfig';
import CountdownTimer from '../Timer/CountdownTimer';
import './AnswerForm.css';
import { Modal, Button } from 'react-bootstrap';

const AnswerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Used to track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useBeforeunload((event) => {
    if (hasUnsavedChanges && !submitted) {
      event.preventDefault();
      return "Bạn có bài làm chưa nộp. Bạn có chắc chắn muốn rời đi?";
    }
  });

  // Fetch exam details on component mount
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        // Check if exam session exists
        const examRef = doc(db, "Paper_Setters", id);
        const examDoc = await getDoc(examRef);
        
        if (!examDoc.exists()) {
          throw new Error("Không tìm thấy phiên thi với mã này.");
        }
        
        const examData = examDoc.data();
        
        // Get the creator's UID to access the exam details
        const creatorUid = examData.creator_uid;
        
        // Get exam data from the creator's Exams_Created collection
        const quizRef = doc(db, "Users", creatorUid, "Exams_Created", id);
        const quizDoc = await getDoc(quizRef);
        
        if (!quizDoc.exists()) {
          throw new Error("Không tìm thấy dữ liệu bài thi.");
        }
        
        const quizData = quizDoc.data();
        setQuiz(quizData);
        
        // Check if exam is active
        const currentTime = new Date().getTime();
        const startTime = quizData.start_time.toDate().getTime();
        const endTime = quizData.end_time.toDate().getTime();
        
        if (currentTime < startTime) {
          throw new Error(`Phiên thi chưa bắt đầu. Vui lòng quay lại sau ${new Date(startTime).toLocaleString()}.`);
        }
        
        if (currentTime > endTime) {
          throw new Error("Phiên thi đã kết thúc.");
        }
        
        setIsActive(true);
        
        // Get questions for this exam session
        const questionsRef = doc(db, "Paper_Setters", id, "Question_Papers_MCQ", quizData.quiz_title);
        const questionsDoc = await getDoc(questionsRef);
        
        if (!questionsDoc.exists()) {
          throw new Error("Không tìm thấy câu hỏi cho phiên thi này.");
        }
        
        const questionsData = questionsDoc.data().question_question || [];
        setQuestions(questionsData);
        
        // Initialize answers array with null/empty values based on question type
        const initialAnswers = questionsData.map(question => 
          question.type === 'multiple-choice' ? [] : ''
        );
        setAnswers(initialAnswers);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchExamDetails();
  }, [id]);

  // Handle answer changes
  const handleAnswerChange = (index, value, type) => {
    const newAnswers = [...answers];
    
    if (type === 'multiple-choice') {
      // For multiple choice questions
      const optionIndex = parseInt(value);
      const currentAnswers = [...newAnswers[index]];
      
      if (currentAnswers.includes(optionIndex)) {
        // Remove option if already selected
        newAnswers[index] = currentAnswers.filter(item => item !== optionIndex);
      } else {
        // Add option if not selected
        newAnswers[index] = [...currentAnswers, optionIndex].sort();
      }
    } else {
      // For short answer questions
      newAnswers[index] = value;
    }
    
    setAnswers(newAnswers);
    setHasUnsavedChanges(true);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate student name and ID
    const missingInputs = [];
    if (!studentName.trim()) missingInputs.push('Họ và tên');
    if (!studentId.trim()) missingInputs.push('Mã số sinh viên/học sinh');
    
    if (missingInputs.length > 0) {
      setMissingFields(missingInputs);
      return;
    }
    
    try {
      setLoading(true);
      
      // Create submission data
      const submission = {
        student_name: studentName.trim(),
        student_id: studentId.trim(),
        quiz_id: id,
        quiz_title: quiz.quiz_title,
        answers: answers,
        start_time: quiz.start_time.toDate().getTime(),
        end_time: new Date().getTime(),
        timestamp: serverTimestamp()
      };
      
      // Store in Firestore under the specific exam session
      const responseRef = collection(db, "Paper_Setters", id, "Responses");
      await addDoc(responseRef, submission);
      
      // Store student info in session storage for result page
      sessionStorage.setItem('studentInfo', JSON.stringify({
        name: studentName.trim(),
        id: studentId.trim()
      }));
      
      setSubmitted(true);
      setHasUnsavedChanges(false);
      
      // Navigate to result page
      navigate(`/result/${id}`);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setError("Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Handle time up event
  const handleTimeUp = useCallback(async () => {
    if (studentName.trim() && studentId.trim()) {
      try {
        // Create submission data
        const submission = {
          student_name: studentName.trim(),
          student_id: studentId.trim(),
          quiz_id: id,
          quiz_title: quiz?.quiz_title || 'Unknown',
          answers: answers,
          start_time: quiz?.start_time.toDate().getTime() || new Date().getTime(),
          end_time: new Date().getTime(),
          timestamp: serverTimestamp(),
          auto_submitted: true
        };
        
        // Store in Firestore
        const responseRef = collection(db, "Paper_Setters", id, "Responses");
        await addDoc(responseRef, submission);
        
        // Store student info in session storage for result page
        sessionStorage.setItem('studentInfo', JSON.stringify({
          name: studentName.trim(),
          id: studentId.trim()
        }));
        
        setSubmitted(true);
        setHasUnsavedChanges(false);
        
        // Navigate to result page
        navigate(`/result/${id}`);
      } catch (error) {
        console.error("Error auto-submitting answers:", error);
        setError("Đã xảy ra lỗi khi tự động nộp bài. Vui lòng nộp lại thủ công.");
      }
    } else {
      setError("Thời gian làm bài đã hết. Vui lòng điền họ tên và mã số để nộp bài.");
    }
  }, [studentName, studentId, id, answers, quiz, navigate]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3">Đang tải bài thi...</p>
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

  if (!isActive) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">Phiên thi không khả dụng!</h4>
          <p>Phiên thi này hiện không hoạt động.</p>
          <hr />
          <p className="mb-0">Vui lòng kiểm tra lại mã phiên thi hoặc liên hệ người tổ chức.</p>
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
    <div className="answer-form-container">
      <div className="answer-form-header">
        <h2>{quiz.quiz_title}</h2>
        <div className="timer-container">
          {quiz && (
            <CountdownTimer 
              startTime={quiz.start_time.toDate()} 
              endTime={quiz.end_time.toDate()} 
              onTimeUp={handleTimeUp}
            />
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="student-info-section">
          <h3>Thông tin thí sinh</h3>
          
          <div className="mb-3">
            <label htmlFor="studentName" className="form-label">Họ và tên</label>
            <input
              type="text"
              className={`form-control ${missingFields.includes('Họ và tên') ? 'is-invalid' : ''}`}
              id="studentName"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setHasUnsavedChanges(true);
              }}
              required
            />
            {missingFields.includes('Họ và tên') && (
              <div className="invalid-feedback">
                Vui lòng nhập họ và tên của bạn.
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="studentId" className="form-label">Mã số sinh viên/học sinh</label>
            <input
              type="text"
              className={`form-control ${missingFields.includes('Mã số sinh viên/học sinh') ? 'is-invalid' : ''}`}
              id="studentId"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setHasUnsavedChanges(true);
              }}
              required
            />
            {missingFields.includes('Mã số sinh viên/học sinh') && (
              <div className="invalid-feedback">
                Vui lòng nhập mã số sinh viên/học sinh của bạn.
              </div>
            )}
          </div>
        </div>
        
        <div className="questions-section">
          <h3>Câu hỏi</h3>
          
          {questions.map((question, index) => (
            <div key={index} className="question-card">
              <h4>Câu {index + 1}: {question.question}</h4>
              
              {question.type === 'multiple-choice' ? (
                <div className="options">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`q${index}-opt${optIndex}`}
                        value={optIndex}
                        checked={answers[index]?.includes(optIndex) || false}
                        onChange={(e) => handleAnswerChange(index, e.target.value, 'multiple-choice')}
                      />
                      <label className="form-check-label" htmlFor={`q${index}-opt${optIndex}`}>
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="short-answer">
                  <textarea
                    className="form-control"
                    id={`q${index}-answer`}
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value, 'short-answer')}
                    rows="3"
                    placeholder="Nhập câu trả lời của bạn..."
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="submit-section">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading || submitted}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Đang xử lý...</span>
              </>
            ) : (
              "Nộp bài"
            )}
          </button>
        </div>
      </form>
      
      {/* Warning Modal */}
      <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cảnh báo!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có bài làm chưa nộp. Bạn có chắc chắn muốn rời đi?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWarningModal(false)}>
            Ở lại
          </Button>
          <Button variant="danger" onClick={() => {
            setShowWarningModal(false);
            window.removeEventListener('beforeunload', beforeUnloadListener);
            navigate('/');
          }}>
            Rời đi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Helper function for beforeunload event
const beforeUnloadListener = (event) => {
  event.preventDefault();
  return event.returnValue = "Bạn có bài làm chưa nộp. Bạn có chắc chắn muốn rời đi?";
};

export default AnswerForm; 