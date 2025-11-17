import { useState, useEffect } from 'react';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore/lite';
import db from '../../../services/firebaseConfig';
import { Question, Answer, StudentAnswer, StudentInfo } from '../types';

export function useStudentResponse(pin: string | undefined, studentEmail: string | undefined, attemptId: string | undefined) {
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
          const quizDoc = await getDoc(
            doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", "questionsTest")
          );
          
          if (!quizDoc.exists()) {
            throw new Error('Không tìm thấy đề thi');
          }
          
          const quizData = quizDoc.data();
          setQuestions(quizData.question_question || []);
          setExamTitle(quizData.title || 'Chi tiết bài làm');
        } catch (error: any) {
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
        } catch (error: any) {
          console.error('Error fetching answers:', error);
          // Continue anyway - we can show student response without answers
        }
        
        // 3. Get Student Response
        let responseData: any = null;
        
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
          } catch (error: any) {
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
          } catch (error: any) {
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
          } catch (error: any) {
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
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        setLoading(false);
      }
    }
    
    if (pin && studentEmail) {
      fetchData();
    }
  }, [pin, studentEmail, attemptId]);

  return {
    loading,
    error,
    questions,
    answers,
    studentAnswers,
    studentInfo,
    score,
    examTitle
  };
}

