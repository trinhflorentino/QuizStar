import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore/lite';
import db from '../../services/firebaseConfig';
import { MathJaxContext } from 'better-react-mathjax';
import StudentInfoCard from './ViewStudentResponse/StudentInfoCard';
import QuestionDisplay from './ViewStudentResponse/QuestionDisplay';
import type { Question, Answer, StudentAnswer, StudentInfo, ResponseData } from './ViewStudentResponse/types';

function ViewStudentResponse() {
  const { pin, studentEmail, attemptId } = useParams<{ pin: string; studentEmail: string; attemptId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [score, setScore] = useState<string>('');
  const [examTitle, setExamTitle] = useState<string>('');

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
          let quizData: any = null;
          let title = 'Chi tiết bài làm';
          let answersData: any = null;
          
          for (const docSnap of questionsSnapshot.docs) {
            const data = docSnap.data();
            
            // If this document has questions, use it
            if (data.question_question && Array.isArray(data.question_question)) {
              quizData = data;
              title = docSnap.id;
            }
            
            // If this document has answers, store them
            if (data.answer_answer && Array.isArray(data.answer_answer)) {
              answersData = data;
            }
          }
          
          if (!quizData) {
            throw new Error('Không tìm thấy câu hỏi trong đề thi');
          }
          
          setQuestions((quizData.question_question || []) as Question[]);
          setExamTitle(quizData.title || title);
          
          // If we found answers in the same loop, use them
          if (answersData) {
            setAnswers((answersData.answer_answer || []) as Answer[]);
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
              
              for (const docSnap of answersSnapshot.docs) {
                if (docSnap.id.includes(pattern) || docSnap.data().answer_answer) {
                  setAnswers((docSnap.data().answer_answer || []) as Answer[]);
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
        let responseData: ResponseData | null = null;
        
        // First try: Use attempt ID if available
        if (attemptId) {
          try {
            const docPath = `${studentEmail}_${attemptId}`;
            console.log(`Trying to fetch response with ID: ${docPath}`);
            
            const responseDoc = await getDoc(
              doc(db, "Paper_Setters", pin, "Responses", docPath)
            );
            
            if (responseDoc.exists()) {
              responseData = responseDoc.data() as ResponseData;
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
              responseData = responseDoc.data() as ResponseData;
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
            const matchingDoc = querySnapshot.docs.find(docSnap => 
              docSnap.id.startsWith(studentEmail + '_')
            );
            
            if (matchingDoc) {
              responseData = matchingDoc.data() as ResponseData;
              console.log('Found response by prefix matching');
            }
          } catch (error) {
            console.error('Error searching for responses:', error);
          }
        }
        
        // Process the response data if found
        if (responseData) {
          setStudentAnswers(responseData.selected_answers || []);
          setStudentInfo(responseData.stud_info || null);
          setScore(responseData.score || '0/0');
          setLoading(false);
        } else {
          throw new Error('Không tìm thấy dữ liệu bài làm');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [pin, studentEmail, attemptId, navigate]);

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
          <StudentInfoCard studentInfo={studentInfo} score={score} />
        )}
        
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <QuestionDisplay
              key={qIndex}
              question={question}
              answer={answers[qIndex]}
              studentAnswer={studentAnswers[qIndex]}
              questionIndex={qIndex}
            />
          ))}
        </div>
      </div>
    </MathJaxContext>
  );
}

export default ViewStudentResponse;

