import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams } from "react-router-dom";
import db from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
} from "firebase/firestore/lite";
import { MathJax } from "better-react-mathjax";

interface Question {
  type: string;
  question: string;
  options?: Array<{ option: string; [key: string]: any }>;
  [key: string]: any;
}

interface Answer {
  answer: any;
  [key: string]: any;
}

const ExportExam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [title, setTitle] = useState<string>("");
  const { pin } = useParams<{ pin: string }>();

  useEffect(() => {
    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
      window.print();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getQuestionsAndAnswers = async () => {
      try {
        if (!pin) return;

        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin,
          "Question_Papers_MCQ"
        );
        const docs = await getDocs(settersCollectionRef);
        
        if (docs.docs.length === 0) {
          setQuestions([]);
          return;
        }

        // Get questions and title
        const questionsDoc = docs.docs.find(doc => !doc.id.endsWith('_answerSheet'));
        if (questionsDoc) {
          setTitle(questionsDoc.id);
          setQuestions((questionsDoc.data().question_question || []) as Question[]);
        }

        // Get answers
        const answersDoc = docs.docs.find(doc => doc.id.endsWith('_answerSheet'));
        if (answersDoc) {
          setAnswers((answersDoc.data().answer_answer || []) as Answer[]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getQuestionsAndAnswers();
  }, [pin]);

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const renderAnswer = (question: Question, index: number): React.ReactNode => {
    const answer = answers[index];
    if (!answer) return null;

    switch (question.type) {
      case "mcq":
        return (
          <div className="text-green-600 font-medium mt-2">
            Đáp án đúng: {String.fromCharCode(65 + parseInt(String(answer.answer)))}: {(question.options || [])[parseInt(String(answer.answer))]?.option}
          </div>
        );
      
      case "truefalse":
        return (
          <div className="text-green-600 font-medium mt-2">
            Đáp án: {Array.isArray(answer.answer) ? answer.answer.map((isTrue: boolean, i: number) => (
              <div key={i}>
                {String.fromCharCode(97 + i)}: {isTrue ? "Đúng" : "Sai"}
              </div>
            )) : null}
          </div>
        );
      
      case "shortanswer":
        const validAnswers = Array.isArray(answer.answer) 
          ? answer.answer 
          : [answer.answer].filter((a: any) => a);
        return (
          <div className="text-green-600 font-medium mt-2">
            <div>Đáp án hợp lệ:</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {validAnswers.map((ans: any, ansIndex: number) => (
                <span 
                  key={ansIndex}
                  className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-sm font-medium"
                >
                  {String(ans).trim()}
                </span>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (questions.length === 0) {
    return <p className="text-center p-4">Không tìm thấy bài thi.</p>;
  }

  return (
    <div className="m-4 md:m-10 lg:m-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={uuid()} className="bg-white p-6 rounded-lg shadow">
            <MathJax inline dynamic className="font-medium mb-4">
              Câu {index + 1}. {question.question}
            </MathJax>

            {question.type === "mcq" && (
              <div className="space-y-2 ml-4">
                {(question.options || []).map((option, optIndex) => (
                  <MathJax key={uuid()}>
                    {String.fromCharCode(65 + optIndex)}. {option.option}
                  </MathJax>
                ))}
              </div>
            )}

            {question.type === "truefalse" && (
              <div className="space-y-2 ml-4">
                {(question.options || []).map((option, optIndex) => (
                  <MathJax inline dynamic key={uuid()}>
                    {String.fromCharCode(97 + optIndex)}. {option.option}
                  </MathJax>
                ))}
              </div>
            )}

            {renderAnswer(question, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportExam;




