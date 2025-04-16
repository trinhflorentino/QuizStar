import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
// import { info } from "autoprefixer";
// import { MathJaxContext, MathJax } from 'better-react-mathjax';

function Form() {
  const [questions, setQuestions] = useState(() => []);
  const [originalQuestions, setOriginalQuestions] = useState(() => []);
  const [originalOrder, setOriginalOrder] = useState({});
  const [title, setTitle] = useState();
  const [selectedList, setSelectedList] = useState(() => [{}]);
  const [studInfo, setStudInfo] = useState(() => ({
    name: "",
    email: "",
    roll_no: "",
    class: ""
  }));
  const [status, setStatus] = useState(() => "");
  const [duration, setDuration] = useState();
  const [isStudentInfoSubmitted, setIsStudentInfoSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let { pin } = useParams();
  const navigate = useNavigate();

  function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function shuffleQuestionsAndAnswers(questions) {
    const newOrder = {};
    
    const shuffledQuestions = questions.map((question, originalQuestionIndex) => {
      const newQuestion = { ...question };
      
      if (question.type === "mcq") {
        const optionPairs = question.options.map((opt, idx) => ({ option: opt, originalIndex: idx }));
        const shuffledPairs = shuffleArray([...optionPairs]);
        
        newOrder[originalQuestionIndex] = {
          newIndex: originalQuestionIndex,
          optionMapping: shuffledPairs.reduce((map, pair, newIndex) => {
            map[newIndex] = pair.originalIndex;
            return map;
          }, {})
        };

        newQuestion.options = shuffledPairs.map(pair => pair.option);
      }
      
      return newQuestion;
    });

    const shuffledWithIndices = shuffledQuestions.map((q, i) => ({ q, originalIndex: i }));
    const finalShuffled = shuffleArray([...shuffledWithIndices]);
    
    finalShuffled.forEach((item, newIndex) => {
      const originalIndex = item.originalIndex;
      if (newOrder[originalIndex]) {
        newOrder[originalIndex].newIndex = newIndex;
      } else {
        newOrder[originalIndex] = { newIndex: newIndex };
      }
    });

    return {
      shuffledQuestions: finalShuffled.map(item => item.q),
      orderMapping: newOrder
    };
  }

  useEffect(() => {
    async function getQuestions() {
      const settersCollectionRef = collection(
        db,
        "Paper_Setters",
        pin.toString(),
        "Question_Papers_MCQ"
      );
      const docos = await getDocs(settersCollectionRef);
      if (docos.docs.length > 0) {
        const attemptPromise = new Promise((res, rej) => {
          getAuth().onAuthStateChanged(async function (user) {
            if (user) {
              const check = await getDoc(
                doc(db, "Users", user.uid, "Exams_Attempted", pin)
              );
              if (check.data() === undefined) {
                res(false);
              } else {
                res(true);
              }
            }
          });
        });

        if (await attemptPromise) {
          setQuestions("Already Attempted");
          navigate('ResultFetch/'+getAuth().currentUser.email);
        } else {
          const docosData = docos.docs.map((doc) => doc.data());
          if (docosData.length > 0 && docosData[0].question_question) {
            setTitle(docos.docs[0].id);
            const originalQuestions = docosData[0].question_question;
            setOriginalQuestions(originalQuestions);
            
            const { shuffledQuestions, orderMapping } = shuffleQuestionsAndAnswers(originalQuestions);
            setQuestions(shuffledQuestions);
            setOriginalOrder(orderMapping);
            
            setStatus(docosData[0].status);
            const examDuration = docosData[0].duration;
            console.log("Setting duration:", examDuration);
            setDuration(examDuration);
          } else {
            setQuestions("Sai mã pin");
          }
        }
      } else {
        setQuestions("Sai mã pin");
      }
    }

    if (!isStudentInfoSubmitted) {
      getQuestions();
    }
  }, []);

  useEffect(() => {
    async function submitExam() {
      if (isSubmitting) {
        await setDoc(
          doc(
            db,
            "Paper_Setters",
            pin.toString(),
            "Responses",
            studInfo.email
          ),
          {
            stud_info: studInfo,
            selected_answers: selectedList,
            timeSpentMinutes: new Date() - startTime,
          }
        );
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            await setDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin),
              {
                quiz_title: title,
                name: studInfo.name,
                class: studInfo.class,
                roll_no: studInfo.roll_no,
                email_id: studInfo.email,
              },
              { merge: true }
            );
          } else {
            console.log("Something Went Wrong!");
          }
        });
        navigate(`ResultFetch/${studInfo.email}`);
      }
    }

    submitExam();
  }, [isSubmitting]);

  useEffect(() => {
    console.log("Timer effect triggered:", { startTime, duration, remainingTime });
    
    if (startTime && duration) {
      console.log("Setting up timer");
      const interval = setInterval(() => {
        const now = new Date();
        const elapsedMs = now - startTime;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const remainingMinutes = duration - elapsedMinutes;
        
        console.log("Timer tick:", { elapsedMinutes, remainingMinutes });
        
        if (remainingMinutes <= 0) {
          clearInterval(interval);
          onSubmit();
        } else {
          setRemainingTime(remainingMinutes);
        }
      }, 1000);

      return () => {
        console.log("Cleaning up timer");
        clearInterval(interval);
      };
    }
  }, [startTime, duration]);

  useEffect(() => {
    //console.log(questions.length);
  }, [questions]);

  function handleStudentInfoSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("studName").value;
    const rollNo = document.getElementById("studRollNo").value;
    const className = document.getElementById("studClass").value;

    if (name && rollNo && className) {
      setStudInfo({
        name: name,
        email: getAuth().currentUser.email,
        roll_no: rollNo,
        class: className,
      });
      setIsStudentInfoSubmitted(true);
      const now = new Date();
      console.log("Setting start time:", now);
      setStartTime(now);
    } else {
      alert("Vui lòng điền đầy đủ thông tin học sinh.");
    }
  }

  function handleAnswerSelect(questionIndex, optionIndex) {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
    
    const originalQuestionIndex = Object.keys(originalOrder).find(
      key => originalOrder[key].newIndex === questionIndex
    );
    const originalOptionIndex = originalOrder[originalQuestionIndex]?.optionMapping?.[optionIndex] ?? optionIndex;
    
    const newSelectedList = [...selectedList];
    newSelectedList[originalQuestionIndex] = { selectedAnswer: originalOptionIndex };
    setSelectedList(newSelectedList);
  }

  function StudentInfoForm() {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thông tin học sinh</h2>
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studName">
              Họ và tên
            </label>
            <input
              type="text"
              id="studName"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studRollNo">
              Lớp
            </label>
            <input
              type="text"
              id="studRollNo"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nhập lớp"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studClass">
              Trường
            </label>
            <input
              type="text"
              id="studClass"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nhập trường"
            />
          </div>
          <button
            onClick={handleStudentInfoSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  function onSubmit() {
    let count = 0;
    let tempSelectedList = [];
    
    for (let i = 0; i < originalQuestions.length; i++) {
      let selectedAnswer = null;
      const shuffledIndex = originalOrder[i].newIndex;
      
      if (originalQuestions[i].type === "mcq") {
        const shuffledAnswer = selectedAnswers[shuffledIndex];
        if (shuffledAnswer !== undefined) {
          selectedAnswer = originalOrder[i].optionMapping[shuffledAnswer];
          count++;
        }
      } else if (originalQuestions[i].type === "truefalse") {
        selectedAnswer = questions[shuffledIndex].options.map((_, index) => {
          const selected = document.querySelector(
            `input[name="question_${shuffledIndex}_option${index}"]:checked`
          );
          if (selected) {
            return selected.value === "true";
          }
          return null;
        });

        if (selectedAnswer.every((answer) => answer !== null)) {
          count++;
        }
      } else if (originalQuestions[i].type === "shortanswer") {
        selectedAnswer = document.getElementById(`shortAnswer${shuffledIndex}`).value;
        if (selectedAnswer.trim() !== "") {
          count++;
        }
      }

      tempSelectedList.push({ selectedAnswer });
    }
    
    console.log(tempSelectedList);
    const endTime = new Date();
    const timeSpentMs = startTime ? endTime - startTime : 0;
    const timeSpentMinutes = Math.floor(timeSpentMs / 60000);
    console.log(timeSpentMinutes);
    setSelectedList(tempSelectedList);
    setStudInfo(prev => ({
      ...prev,
      timeSpent: timeSpentMinutes 
    }));
    setIsSubmitting(true);
  }

  return (
    <form id="mainForm" className="m-4 md:m-10 lg:m-14">
      {questions.length !== 0 ? (
        questions !== "Sai mã pin" ? (
          questions !== "Already Attempted" ? (
            status !== "inactive" ? (
              !isStudentInfoSubmitted ? (
                <StudentInfoForm />
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center">
                      <h1 id="quiz_title" className="text-2xl font-bold text-gray-800">
                        {title}
                      </h1>
                      {remainingTime !== null && (
                        <div className="text-xl font-bold text-blue-600">
                          Thời gian còn lại: {remainingTime} phút
                        </div>
                      )}
                    </div>
                  </div>
                  {questions.map((question, questionIndex) => {
                    return (
                      <div key={uuid()} className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                            Câu {questionIndex + 1}
                          </span>
                          <MathJax inline dynamic className="text-lg">{question.question}</MathJax>
                        </p>
                        {question.type === "mcq" &&
                          question.options.map((option, optionIndex) => {
                            return (
                              <div key={uuid()} className="mb-3">
                                <button
                                  id={`${questionIndex}-${optionIndex}`}
                                  type="button"
                                  className={`w-full p-3 rounded-lg border transition-colors flex items-center space-x-3 ${
                                    selectedAnswers[questionIndex] === optionIndex
                                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                                      : 'hover:bg-gray-50 border-gray-300 text-gray-700'
                                  }`}
                                  onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                                >
                                  <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium text-lg">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </span>
                                  <MathJax inline dynamic className="text-gray-700">{option.option}</MathJax>
                                </button>
                                <input
                                  type="radio"
                                  className="hidden"
                                  value={optionIndex + 1}
                                  name={`question_${questionIndex}`}
                                  checked={selectedAnswers[questionIndex] === optionIndex}
                                  onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                                />
                              </div>
                            );
                          })}
                        {question.type === "truefalse" &&
                          question.options.map((option, optionIndex) => {
                            return (
                              <div key={uuid()} className="mb-4">
                                <MathJax inline dynamic className="font-medium text-gray-700 mb-2">{String.fromCharCode(97 + optionIndex)}. {option.option}</MathJax>
                                <div className="flex space-x-4 ml-4">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      className="form-radio h-4 w-4 text-green-600"
                                      id={`${questionIndex}-${optionIndex}-true`}
                                      name={`question_${questionIndex}_option${optionIndex}`}
                                      value="true"
                                    />
                                    <span className="text-gray-700">Đúng</span>
                                  </label>
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      className="form-radio h-4 w-4 text-red-600"
                                      id={`${questionIndex}-${optionIndex}-false`}
                                      name={`question_${questionIndex}_option${optionIndex}`}
                                      value="false"
                                    />
                                    <span className="text-gray-700">Sai</span>
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        {question.type === "shortanswer" && (
                          <div className="mt-4">
                            <textarea
                              type="text"
                              id={`shortAnswer${questionIndex}`}
                              placeholder="Nhập câu trả lời của bạn"
                              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex justify-center mt-8 mb-8">
                    <button
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
                      type="button"
                      onClick={() => onSubmit()}
                    >
                      Nộp bài
                    </button>
                  </div>
                </div>
              )
            ) : (
              <p className="centeredP">Người tạo đã khóa bài thi.</p>
            )
          ) : (
            <p className="centeredP">Bạn đã làm bài kiểm tra này rồi.</p>
          )
        ) : (
          <p className="centeredP">Bài thi không tồn tại hoặc người tạo đã xóa bài thi.</p>
        )
      ) : (
        <p className="centeredP">Đang tải...</p>
      )}
    </form>
  );
}

export default Form;
