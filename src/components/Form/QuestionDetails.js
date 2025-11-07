import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import db from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
} from "firebase/firestore/lite";
import { MathJax } from "better-react-mathjax";

function QuestionDetails() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  let { pin } = useParams();

  useEffect(() => {
    const getQuestionsAndAnswers = async () => {
      try {
        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin.toString(),
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
          setQuestions(questionsDoc.data().question_question || []);
        }

        // Get answers
        const answersDoc = docs.docs.find(doc => doc.id.endsWith('_answerSheet'));
        if (answersDoc) {
          setAnswers(answersDoc.data().answer_answer || []);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getQuestionsAndAnswers();
  }, [pin]);

  const renderAnswer = (question, index) => {
    const answer = answers[index];
    if (!answer) return null;

    switch (question.type) {
      case "mcq":
        return (
          <div className="text-green-600 font-medium mt-2">
            Đáp án đúng: {String.fromCharCode(65 + answer.answer)}: {question.options[answer.answer]?.option}
          </div>
        );
      
      case "truefalse":
        return (
          <div className="text-green-600 font-medium mt-2">
            Đáp án: {answer.answer.map((isTrue, i) => (
              <div key={i}>
                {String.fromCharCode(97 + i)}: {isTrue ? "Đúng" : "Sai"}
              </div>
            ))}
          </div>
        );
      
      case "shortanswer":
        const validAnswers = Array.isArray(answer.answer) 
          ? answer.answer 
          : [answer.answer].filter(a => a);
        return (
          <div className="text-green-600 font-medium mt-2">
            <div>Đáp án hợp lệ:</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {validAnswers.map((ans, ansIndex) => (
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
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Quay lại
        </button>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={uuid()} className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col gap-4">
              {/* Question text */}
              <div className="font-medium">
                Câu {index + 1}. <MathJax dynamic inline>{question.question}</MathJax>
              </div>

              {/* Image display */}
              {question.imageUrl && (
                <div className="my-4">
                  <img
                    src={question.imageUrl}
                    alt={`Hình minh họa cho câu ${index + 1}`}
                    className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
              )}

              {/* Options */}
              {question.type === "mcq" && (
                <div className="space-y-2 ml-4">
                  {question.options.map((option, optIndex) => (
                    <div key={uuid()}>
                      {String.fromCharCode(65 + optIndex)}. <MathJax dynamic inline>{option.option}</MathJax>
                    </div>
                  ))}
                </div>
              )}

              {question.type === "truefalse" && (
                <div className="space-y-2 ml-4">
                  {question.options.map((option, optIndex) => (
                    <div key={uuid()}>
                      {String.fromCharCode(97 + optIndex)}. {option.option}
                    </div>
                  ))}
                </div>
              )}

              {/* Answer */}
              {renderAnswer(question, index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionDetails;
