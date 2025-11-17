import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import React from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MathJaxContext } from 'better-react-mathjax';
import StudentInfoCard from './ResultFetch/StudentInfoCard';
import ScoreSummary from './ResultFetch/ScoreSummary';
import QuestionResultDisplay from './ResultFetch/QuestionResultDisplay';
import type { Question, Answer, StudentAnswer, QuestionScore, OrderMapping, ResponseDoc } from './ResultFetch/types';

function ResultFetch() {
  const [questionsTemp, setQuestionsTemp] = useState<Question[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [answersTemp, setAnswersTemp] = useState<Answer[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [score, setScore] = useState<string>("");
  const [responseDoc, setResponseDoc] = useState<ResponseDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [questionScores, setQuestionScores] = useState<QuestionScore[]>([]);
  const [orderMapping, setOrderMapping] = useState<OrderMapping>({});
  
  const { pin, studentEmail, attemptId } = useParams<{ pin: string; studentEmail: string; attemptId?: string }>();
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


  // Calculate score for each question
  const calculateQuestionScores = (questions: Question[], correctAnswers: Answer[], studentAnswers: StudentAnswer[]): QuestionScore[] => {
    if (!questions || !correctAnswers || !studentAnswers) return [];
    
    return questions.map((question, index) => {
      if (question.type === 'textblock') {
        return { score: 0, maxScore: 0, isCorrect: null };
      }
      
      const userAnswer = studentAnswers[index];
      const correctAnswer = correctAnswers[index];
      const questionScore = parseFloat(String(question.score || 1));
      
      if (!userAnswer || !correctAnswer) {
        return { score: 0, maxScore: questionScore, isCorrect: false };
      }
      
      let isCorrect = false;
      let earnedScore = 0;
      
      if (question.type === "mcq") {
        // MCQ answer is stored as index (0-based), but correctAnswer.answer might be 1-based
        const correctIndex = parseInt(String(correctAnswer.answer));
        const studentIndex = parseInt(String(userAnswer.selectedAnswer));
        // Handle both 0-based and 1-based indexing
        isCorrect = correctIndex === studentIndex || (correctIndex === studentIndex + 1) || (correctIndex + 1 === studentIndex);
        earnedScore = isCorrect ? questionScore : 0;
      } else if (question.type === "shortanswer") {
        const validAnswers = Array.isArray(correctAnswer.answer) 
          ? correctAnswer.answer 
          : [correctAnswer.answer].filter((a: any) => a);
        const userAnswerTrimmed = String(userAnswer.selectedAnswer || '').trim().toLowerCase();
        isCorrect = validAnswers.some((ans: any) => 
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

  // Data fetching
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        if (!pin || !studentEmail) {
          setError("Thiếu thông tin cần thiết");
          setLoading(false);
          return;
        }
        
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
        let questionsData: Question[] | null = null;
        for (let i = 0; i < docosData.length; i++) {
          if (docosData[i].question_question) {
            questionsData = docosData[i].question_question as Question[];
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
        let answersData: Answer[] | null = null;
        if (docos.docs.length > 1) {
          // Check second document
          if (docosData[1].answer_answer) {
            answersData = docosData[1].answer_answer as Answer[];
          }
        }
        
        // If not found, search for document with _answerSheet in id or answer_answer field
        if (!answersData) {
          for (const doc of docos.docs) {
            if (doc.id.includes('_answerSheet') || doc.data().answer_answer) {
              answersData = (doc.data().answer_answer || []) as Answer[];
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
              const data = alternativeResponse.data() as ResponseDoc;
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
        
        const data = response.data() as ResponseDoc;
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
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Kết quả bài thi</h1>
          
          {responseDoc && responseDoc.stud_info && (
            <StudentInfoCard
              studentInfo={responseDoc.stud_info}
              score={score}
              submittedAt={responseDoc.submittedAt}
              attemptNumber={responseDoc.attemptNumber}
            />
          )}
          
          <ScoreSummary
            score={score}
            scoreQ={responseDoc?.scoreQ}
            scoreAll={responseDoc?.scoreAll}
            questionScores={questionScores}
          />
          
          {questionScores.length === 0 && questionsTemp.length > 0 && (
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                ⚠️ Không thể tính điểm chi tiết. Vui lòng kiểm tra lại đáp án.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <Link
              to={`/pinverify/Form/${pin}`}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-center sm:text-left"
            >
              Về trang chính
            </Link>
            
            {responseDoc && responseDoc.attemptId && (
              <Link
                to={`/pinverify/Form/${pin}/ResultFetch/${studentEmail}`}
                className="inline-block bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-center sm:text-left"
              >
                Xem tất cả các lần làm bài
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {questionsTemp.length > 0 ? questionsTemp.map((question, displayIndex) => {
            // Skip textblock questions
            if (question.type === 'textblock') return null;
            
            // Questions from database are already in original order
            // displayIndex = originalIndex (no mapping needed for display)
            const originalIndex = displayIndex;
            
            // Get answer and student answer using original index
            const correctAnswer = answersTemp[originalIndex];
            const studentAnswer = studentAnswers[originalIndex];
            const questionScore = questionScores[originalIndex] !== undefined 
              ? questionScores[originalIndex] 
              : questionScores[displayIndex];
            
            return (
              <QuestionResultDisplay
                key={displayIndex}
                question={question}
                answer={correctAnswer}
                studentAnswer={studentAnswer}
                questionScore={questionScore}
                questionIndex={displayIndex}
                orderMapping={orderMapping}
              />
            );
          }) : (
            <div className="text-center p-8 text-gray-600 col-span-1 lg:col-span-2">
              <p>Không có câu hỏi nào để hiển thị.</p>
            </div>
          )}
        </div>
      </div>
    </MathJaxContext>
  );
}

export default ResultFetch;

