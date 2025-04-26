import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { FaArrowLeft } from "react-icons/fa";

function ViewStudentResponse() {
  const { pin, email } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [studInfo, setStudInfo] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [scoreQ, setScoreQ] = useState(0);
  const [scoreAll, setScoreAll] = useState(0);

  // Authentication check
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Data fetching
  useEffect(() => {
    if (loading) return;
    async function fetchData() {
      try {
        // Lấy câu hỏi và đáp án
        const getQuestionsAndAnswers = async () => {
          const settersCollectionRef = collection(
            db,
            "Paper_Setters",
            pin.toString(),
            "Question_Papers_MCQ"
          );
          const docos = await getDocs(settersCollectionRef);
          if (docos.empty) {
            throw new Error("Không có dữ liệu câu hỏi.");
          }
          
          const docosData = docos.docs.map((docs) => docs.data());
          setTitle(docos.docs[0].id);
          setQuestions(docosData[0]["question_question"] || []);
          setAnswers(docosData[1]["answer_answer"] || []);
        };

        // Lấy câu trả lời của học sinh
        const getStudentResponse = async () => {
          const docRef = doc(db, "Paper_Setters", pin.toString(), "Responses", email);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            throw new Error("Không tìm thấy dữ liệu bài làm của học sinh");
          }
          
          const data = docSnap.data();
          setSelectedAnswers(data["selected_answers"] || []);
          setStudInfo(data["stud_info"] || {});
          setScore(data["score"] || "0/0");
          setScoreQ(data["scoreQ"] || "0/0");
        };

        await Promise.all([getQuestionsAndAnswers(), getStudentResponse()]);
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    }
    fetchData();
  }, [pin, email, loading]);

  // Tính điểm
  useEffect(() => {
    if (!answers.length || !selectedAnswers.length || !questions.length) return;
    
    let totalScore = 0;
    let earnedScore = 0;
    let totalQuestions = 0;
    
    for (let i = 0; i < answers.length; i++) {
      const question = questions[i];
      const userAnswer = selectedAnswers[i];
      const correctAnswer = answers[i];
      
      if (!question || !userAnswer || !correctAnswer) continue;
      
      totalQuestions++;
      totalScore += parseFloat(question["score"] || 0);
      
      if (question.type === "mcq" || question.type === "shortanswer") {
        if (parseInt(correctAnswer["answer"]) === parseInt(userAnswer["selectedAnswer"])) {
          earnedScore += parseFloat(question["score"] || 0);
        }
      } 
      else if (question.type === "truefalse") {
        const correctOptions = correctAnswer["answer"];
        const selectedOptions = userAnswer["selectedAnswer"];
        
        if (!correctOptions || !selectedOptions) continue;
        
        let matchingCount = 0;
        for (let i = 0; i < correctOptions.length; i++) {
          if (correctOptions[i] === selectedOptions[i]) {
            matchingCount++;
          }
        }

        let percentScore = 0;
        switch(matchingCount) {
          case 0: percentScore = 0; break;
          case 1: percentScore = 0.1; break;
          case 2: percentScore = 0.25; break;
          case 3: percentScore = 0.5; break;
          case 4: percentScore = 1; break;
          default: percentScore = 1;
        }

        if (percentScore > 0) {
          earnedScore += (parseFloat(question["score"] || 0) * percentScore);
        }
      }
    }
    
    setScoreAll(totalScore);
    setScoreQ(earnedScore);
  }, [answers, selectedAnswers, questions]);

  // Hiển thị đáp án đúng cho câu hỏi MCQ
  const renderCorrectMCQAnswer = (questionIndex) => {
    const correctAnswer = answers[questionIndex]?.answer;
    if (correctAnswer === undefined) return null;
    
    const question = questions[questionIndex];
    if (!question || !question.options) return null;
    
    const optionIndex = parseInt(correctAnswer);
    if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) return null;
    
    return (
      <div className="mt-2 p-2 bg-green-100 rounded-md">
        <p className="text-green-800 font-medium">Đáp án đúng: {String.fromCharCode(65 + optionIndex)}</p>
      </div>
    );
  };

  // Hiển thị đáp án đúng cho câu hỏi True/False
  const renderCorrectTrueFalseAnswer = (questionIndex) => {
    const correctAnswers = answers[questionIndex]?.answer;
    if (!correctAnswers || !Array.isArray(correctAnswers)) return null;
    
    const question = questions[questionIndex];
    if (!question || !question.options) return null;
    
    return (
      <div className="mt-2 p-2 bg-green-100 rounded-md">
        <p className="text-green-800 font-medium">Đáp án đúng:</p>
        <ul className="list-disc pl-5">
          {question.options.map((option, idx) => (
            <li key={idx} className="text-green-800">
              {String.fromCharCode(97 + idx)}. {option.option}: {correctAnswers[idx] ? "Đúng" : "Sai"}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Hiển thị đáp án đúng cho câu hỏi Short Answer
  const renderCorrectShortAnswer = (questionIndex) => {
    const correctAnswer = answers[questionIndex]?.answer;
    if (correctAnswer === undefined) return null;
    
    return (
      <div className="mt-2 p-2 bg-green-100 rounded-md">
        <p className="text-green-800 font-medium">Đáp án đúng: {correctAnswer}</p>
      </div>
    );
  };

  // Kiểm tra câu trả lời đúng hay sai
  const isAnswerCorrect = (questionIndex) => {
    const question = questions[questionIndex];
    const userAnswer = selectedAnswers[questionIndex];
    const correctAnswer = answers[questionIndex];
    
    if (!question || !userAnswer || !correctAnswer) return null;
    
    if (question.type === "mcq" || question.type === "shortanswer") {
      return parseInt(correctAnswer["answer"]) === parseInt(userAnswer["selectedAnswer"]);
    } 
    else if (question.type === "truefalse") {
      const correctOptions = correctAnswer["answer"];
      const selectedOptions = userAnswer["selectedAnswer"];
      
      if (!correctOptions || !selectedOptions) return null;
      
      let matchingCount = 0;
      for (let i = 0; i < correctOptions.length; i++) {
        if (correctOptions[i] === selectedOptions[i]) {
          matchingCount++;
        }
      }
      
      return matchingCount === correctOptions.length;
    }
    
    return null;
  };

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

  if (!questions.length || !selectedAnswers.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Không tìm thấy dữ liệu bài làm</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </h1>
      </div>
      
      {/* Thông tin học sinh */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin học sinh</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="font-medium text-gray-900">{studInfo?.name || "Không có"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Lớp</p>
              <p className="font-medium text-gray-900">{studInfo?.class || "Không có"}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Trường</p>
              <p className="font-medium text-gray-900">{studInfo?.roll_no || "Không có"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{studInfo?.email || "Không có"}</p>
            </div>
          </div>
        </div>
        
        {/* Điểm số */}
        <div className="mt-6 text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-32 h-32 rounded-full border-8 border-gray-200">
              <div className="w-full h-full rounded-full border-8 border-blue-500 flex items-center justify-center"
                   style={{ transform: `rotate(${(scoreQ/scoreAll) * 360}deg)` }}>
                <span className="text-3xl font-bold text-blue-600">
                  {Math.round((scoreQ/scoreAll) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700">
            Điểm: {typeof scoreQ === 'number' ? scoreQ.toFixed(2) : scoreQ}/{typeof scoreAll === 'number' ? scoreAll.toFixed(2) : scoreAll}
          </p>
          <p className="text-lg text-gray-600">
            Thời gian làm bài: {studInfo?.timeSpent || 0} phút
          </p>
        </div>
      </div>
      
      {/* Danh sách câu hỏi và câu trả lời */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết bài làm</h2>
        
        {questions.map((question, index) => {
          const isCorrect = isAnswerCorrect(index);
          const userAnswer = selectedAnswers[index];
          
          return (
            <div key={index} className={`bg-white rounded-lg shadow-md p-6 ${isCorrect === true ? 'border-l-4 border-green-500' : isCorrect === false ? 'border-l-4 border-red-500' : ''}`}>
              <div className="flex items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${
                  isCorrect === true ? 'bg-green-100 text-green-800' : 
                  isCorrect === false ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  Câu {index + 1}
                </span>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">Loại câu hỏi: </span>
                    <span className="text-sm font-medium text-blue-600">
                      {question.type === "mcq" ? "Trắc nghiệm" : 
                       question.type === "truefalse" ? "Đúng/Sai" : 
                       question.type === "shortanswer" ? "Tự luận" : "Không xác định"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">Điểm: </span>
                    <span className="text-sm font-medium text-blue-600">{question.score || 0}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">Câu hỏi:</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md mb-2">
                    <MathJax inline dynamic className="text-lg">{question.question}</MathJax>
                  </div>
                  
                  {question.type === "mcq" && question.options && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-500">Các lựa chọn:</span>
                      <div className="p-3 bg-gray-50 rounded-md mt-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="mb-1">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                            <MathJax inline dynamic>{option.option}</MathJax>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hiển thị câu trả lời của học sinh và đáp án đúng dựa trên loại câu hỏi */}
              {question.type === "mcq" && (
                <>
                  <div className="ml-8 mb-4">
                    <p className="font-medium text-gray-700 mb-2">Câu trả lời của học sinh:</p>
                    {userAnswer && userAnswer.selectedAnswer !== undefined && userAnswer.selectedAnswer !== null ? (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-blue-800">
                          {String.fromCharCode(65 + userAnswer.selectedAnswer)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Không chọn</p>
                    )}
                  </div>
                  {renderCorrectMCQAnswer(index)}
                </>
              )}
              
              {question.type === "truefalse" && (
                <>
                  <div className="ml-8 mb-4">
                    <p className="font-medium text-gray-700 mb-2">Câu trả lời của học sinh:</p>
                    {userAnswer && Array.isArray(userAnswer.selectedAnswer) && userAnswer.selectedAnswer.length > 0 ? (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <ul className="list-disc pl-5">
                          {question.options.map((option, idx) => (
                            <li key={idx} className="text-blue-800">
                              {String.fromCharCode(97 + idx)}. {option.option}: {userAnswer.selectedAnswer[idx] ? "Đúng" : "Sai"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Không chọn</p>
                    )}
                  </div>
                  {renderCorrectTrueFalseAnswer(index)}
                </>
              )}
              
              {question.type === "shortanswer" && (
                <>
                  <div className="ml-8 mb-4">
                    <p className="font-medium text-gray-700 mb-2">Câu trả lời của học sinh:</p>
                    {userAnswer && userAnswer.selectedAnswer ? (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-blue-800">{userAnswer.selectedAnswer}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Không trả lời</p>
                    )}
                  </div>
                  {renderCorrectShortAnswer(index)}
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Nút in kết quả */}
      <div className="flex justify-center mt-8 mb-8">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
          onClick={() => window.print()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          In kết quả
        </button>
      </div>
    </div>
  );
}

export default ViewStudentResponse; 