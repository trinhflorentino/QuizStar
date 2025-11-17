import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore/lite";
import db from "../../../../services/firebaseConfig";
import { Question, Answer, OrderMapping, QuizData } from "../types";

export const useQuizData = (pin: string | undefined, canResume: boolean | undefined): QuizData => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [originalOrder, setOriginalOrder] = useState<OrderMapping>({});
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [duration, setDuration] = useState<number | null>(null);
  
  useEffect(() => {
    if (!pin || canResume === undefined) return;
    
    async function fetchQuizData() {
      try {
        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin?.toString() || '',
          "Question_Papers_MCQ"
        );
        const docos = await getDocs(settersCollectionRef);
        
        if (docos.docs.length > 0) {
          const docosData = docos.docs.map((doc) => doc.data());
          if (docosData.length > 0 && docosData[0].question_question) {
            setTitle(docos.docs[0].id);
            const origQuestions = docosData[0].question_question as Question[];
            setOriginalQuestions(origQuestions);
            
            // Fetch answers
            if (docos.docs.length > 1) {
              setAnswers((docosData[1].answer_answer || []) as Answer[]);
            } else {
              const answerDocs = await getDocs(
                collection(db, "Paper_Setters", pin?.toString() || '', "Question_Papers_MCQ")
              );
              
              for (const doc of answerDocs.docs) {
                if (doc.id.includes('_answerSheet') || doc.data().answer_answer) {
                  setAnswers((doc.data().answer_answer || []) as Answer[]);
                  break;
                }
              }
            }
            
            setStatus(docosData[0].status || "");
            setDuration(docosData[0].duration || null);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    }
    
    fetchQuizData();
  }, [pin, canResume]);
  
  return {
    questions,
    setQuestions,
    originalQuestions,
    originalOrder,
    setOriginalOrder,
    answers,
    title,
    status,
    duration
  };
};

