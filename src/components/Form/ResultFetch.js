import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
function ResultFetch() {
  let { pin } = useParams();
  let { email } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => []);
  const [selectedAnswers, setSelectedAnswers] = useState(() => []);
  const [score, setScore] = useState(0);
  const [scoreQ, setScoreQ] = useState(0);
  const [scoreAll, setScoreAll] = useState(0);
  const [scoreQuestions, setScoreQuestions] = useState(() => []);
  const [studInfo, setStudInfo] = useState(() => []);
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  // Authentication check
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      if (user.email !== email) {
        navigate("/Dashboard");
        return;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [email, navigate]);

  // Data fetching
  useEffect(() => {
    if (loading) return;
    async function fetchData() {
      try {
        const getAnswers = async () => {
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
          setTitle(docos.id);
          const docosData = docos.docs.map((docs) => docs.data());
          console.log(docosData);
          setAnswers(docosData[1]["answer_answer"].map((doc) => doc));
          setScoreQuestions(docosData[0]["question_question"].map((doc) => doc));
        };

        const getSelectedAnswers = async () => {
          const docRef = doc(db, "Paper_Setters", pin.toString(), "Responses", email);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            throw new Error("No response data found");
          }
          setSelectedAnswers(docSnap.data()["selected_answers"]);
          setStudInfo(docSnap.data()["stud_info"]);
        };

        await Promise.all([getAnswers(), getSelectedAnswers()]);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, [pin, email, loading]);

  // Score calculation
  useEffect(() => {
    if (!answers.length || !selectedAnswers.length) return;
    setScore(0);
    setScoreQ(0);
    setScoreAll(0);
    for (let i = 0; i < answers.length; i++) {
      const question = scoreQuestions[i];
      const userAnswer = selectedAnswers[i];
      const correctAnswer = answers[i];
      setScoreAll((prevScore) => prevScore + parseFloat(question["score"]));
      console.log(question, userAnswer, correctAnswer);
      if (question.type === "mcq" || question.type === "shortanswer") {
        if (parseInt(correctAnswer["answer"]) === parseInt(userAnswer["selectedAnswer"])) {
          setScore((prevScore) => prevScore + 1);
          setScoreQ((prevScore) => prevScore + parseFloat(question["score"]));
        }
      } 
      else if (question.type === "truefalse") {
        const correctOptions = correctAnswer["answer"];
        const selectedOptions = userAnswer["selectedAnswer"];
        
        let matchingCount = 0;
        for (let i = 0; i < correctOptions.length; i++) {
          if (correctOptions[i] === selectedOptions[i]) {
            matchingCount++;
          }
        }

        let percentScore = 0;
        switch(matchingCount) {
          case 0:
            percentScore = 0; // 0%
            break;
          case 1:
            percentScore = 0.1; // 10%
            break;
          case 2:
            percentScore = 0.25; // 25%
            break;
          case 3:
            percentScore = 0.5; // 50%
            break;
          case 4:
            percentScore = 1; // 100%
            break;
          default:
            percentScore = 1;
        }

        if (percentScore > 0) {
          // setScore((prevScore) => prevScore + percentScore);
          setScoreQ((prevScore) => prevScore + (parseFloat(question["score"]) * percentScore));
        }
      }
    }
    console.log(scoreAll, scoreQ);
  }, [answers, selectedAnswers, scoreQuestions]);

  // Score update
  useEffect(() => {
    if (!answers.length) return;
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      if (user) {
        Promise.all([
          setDoc(
            doc(db, "Users", user.uid, "Exams_Attempted", pin),
            { score: `${score}/${answers.length}` },
            { merge: true }
          ),
          setDoc(
            doc(db, "Paper_Setters", pin, "Responses", user.email),
            { score: `${score}/${answers.length}` },
            { merge: true }
          ),
          setDoc(
            doc(db, "Paper_Setters", pin, "Responses", user.email),
            { scoreQ: `${scoreQ}/${scoreAll}` },
            { merge: true }
          ),
          setDoc(
            doc(db, "Users", user.uid, "Exams_Attempted", pin),
            { scoreQ: `${scoreQ}/${scoreAll}` },
            { merge: true }
          )
        ]).catch(err => console.error("Error updating score:", err));
      }
    });
    return () => unsubscribe();
  }, [score, answers, pin]);

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

  if (!answers.length || !selectedAnswers.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Không tìm thấy dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        {title}
      </h1>
      
      <div className="flex justify-center mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setClick(true)}
        >
          Xem kết quả
        </button>
      </div>

      {click && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Thông tin điểm số */}
          <div className="mb-8 text-center">
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
              Số điểm: {scoreQ}/{scoreAll}
            </p>
            {/* <p className="text-xl font-semibold text-gray-700">
              Thời gian làm bài: {studInfo["timeSpent"]} phút
            </p> */}
          </div>

          {/* Thông tin thí sinh */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium text-gray-900">{studInfo["name"]}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Lớp</p>
                <p className="font-medium text-gray-900">{studInfo["class"]}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Trường</p>
                <p className="font-medium text-gray-900">{studInfo["roll_no"]}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{studInfo["email"]}</p>
              </div>
            </div>
          </div>

          {/* Nút tải kết quả */}
          <div className="flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
              onClick={() => window.print()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Tải về kết quả
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultFetch;
