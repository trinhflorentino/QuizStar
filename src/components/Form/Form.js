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
  const [title, setTitle] = useState();
  const [selectedList, setSelectedList] = useState(() => [{}]);
  const [studInfo, setStudInfo] = useState(() => {});
  const [status, setStatus] = useState(() => "");
  const [duration, setDuration] = useState();
  const [isStudentInfoSubmitted, setIsStudentInfoSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);  // Add this line

  let { pin } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function f() {
      if (selectedList.length > 0 && Object.keys(selectedList[0]).length !== 0) {
        await setDoc(
          doc(
            db,
            "Paper_Setters",
            pin.toString(),
            "Responses",
            studInfo["email"]
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
                name: studInfo["name"],
                class: studInfo["class"],
                roll_no: studInfo["roll_no"],
                email_id: studInfo["email"],
              },
              { merge: true }
            );
          } else {
            console.log("Something Went Wrong!");
          }
        });
        // console.log(startTime);
        navigate(`ResultFetch/${studInfo["email"]}`);
      } else {
        //console.log("Jhol");
      }

      const attemptPromise = new Promise((res, rej) => {
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            const check = await getDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin)
            );
            // console.log(check.data());
            if (check.data() === undefined) {
              res(false);
            } else {
              //console.log("Already Attempted");
              res(true);
            }
          }
        });
      });

      async function attemptChecker() {
        let some = await Promise.resolve(attemptPromise);
        //console.log(some);
        return some;
      }

      const getQuestions = async () => {
        //function to get Question Paper
        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin.toString(),
          "Question_Papers_MCQ"
        );
        const docos = await getDocs(settersCollectionRef);
        if (Object.keys(docos.docs).length !== 0) {
          //checks whether the Question Papers collection is empty
          // console.log(await attemptChecker());
          if ((await attemptChecker()) === true) {
            setQuestions("Already Attempted");
            navigate('ResultFetch/'+getAuth().currentUser.email);
          } else {
            const docosData = docos.docs.map((docs, index) => {
              if (index === 0) {
                setTitle(docs.id);
              }
              return docs.data(); //returns question paper
            });
            setQuestions(docosData[0]["question_question"].map((doc) => doc));
            setStatus(docosData[0]["status"]);
            setDuration(docosData[0]["duration"]);
          }
        } else {
          setQuestions("Sai mã pin");
        }
      };

      getQuestions();
    }
    f();
  }, [selectedList, pin, studInfo]);

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
      setStartTime(new Date());  // Add this line
    } else {
      alert("Vui lòng điền đầy đủ thông tin học sinh.");
    }
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
    let infoBool = false;

    // if (
    //   // document.getElementById("studName").value !== "" &&
    //   // document.getElementById("studRollNo").value !== "" &&
    //   // document.getElementById("studClass").value !== ""
    // ) {
    //   infoBool = true;
    // }
    infoBool = true;
    let tempSelectedList = [];
    for (let i = 0; i < questions.length; i++) {
      let selectedAnswer = null;
      if (questions[i].type === "mcq") {
        const selectedRadio = document.querySelector(
          `input[name="question_${i}"]:checked`
        );
        if (selectedRadio) {
          selectedAnswer = parseInt(selectedRadio.value, 10) - 1;
          count++;
        }
      } else if (questions[i].type === "truefalse") {
        selectedAnswer = questions[i].options.map((_, index) => {
          const selected = document.querySelector(
            `input[name="question_${i}_option${index}"]:checked`
          );
          if (selected) {
            return selected.value === "true";
          }
          return null;
        });

        if (selectedAnswer.every((answer) => answer !== null)) {
          count++;
        }
      } else if (questions[i].type === "shortanswer") {
        selectedAnswer = document.getElementById(`shortAnswer${i}`).value;
        if (selectedAnswer.trim() !== "") {
          count++;
        }
      }

      tempSelectedList.push({ selectedAnswer });
    }
    console.log(tempSelectedList);
    // if (count === questions.length && infoBool) {
      const endTime = new Date();
      const timeSpentMs = startTime ? endTime - startTime : 0;
      const timeSpentMinutes = Math.floor(timeSpentMs / 60000);
      console.log(timeSpentMinutes);
      setSelectedList(tempSelectedList);
      setStudInfo({
        name: document.getElementById("studName").value,
        email: getAuth().currentUser.email,
        roll_no: document.getElementById("studRollNo").value,
        class: document.getElementById("studClass").value,
        timeSpent: timeSpentMinutes 
      });
      if (!infoBool) {
        alert("Vui lòng điền thông tin học sinh.");
      }
    navigate(`ResultFetch/${studInfo["email"]}`);
    // }
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
                    <h1 id="quiz_title" className="text-2xl font-bold text-gray-800 mb-4">
                      {title}
                    </h1>
                    {/* <MathJax inline className="text-2xl">{"\\(5x * 10 \\approx 42\\)"}</MathJax> */}
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
                                <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    id={`${questionIndex}-${optionIndex}`}
                                    type="radio"
                                    className="form-radio h-5 w-5 text-blue-600"
                                    value={optionIndex + 1}
                                    name={`question_${questionIndex}`}
                                  />
                                  <MathJax inline dynamic className="text-gray-700">{option.option}</MathJax>
                                </label>
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
