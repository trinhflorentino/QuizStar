import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams } from "react-router-dom";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";
// import { MathJaxContext, MathJax } from 'better-react-mathjax';

function Form() {
  const [questions, setQuestions] = useState(() => []);
  const [originalQuestionOrder, setOriginalQuestionOrder] = useState([]); // Add this state
  const [title, setTitle] = useState();
  const [selectedList, setSelectedList] = useState(() => [{}]);
  const [studInfo, setStudInfo] = useState(() => {});
  const [status, setStatus] = useState(() => "");

  let { pin } = useParams();

  // Add shuffle function
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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

        window.location.href += `/ResultFetch/${studInfo["email"]}`;
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
          } else {
            const docosData = docos.docs.map((docs, index) => {
              if (index === 0) {
                setTitle(docs.id);
              }
              return docs.data(); //returns question paper
            });
            const questionArray = docosData[0]["question_question"].map((doc) => doc);
            setOriginalQuestionOrder(questionArray); // Store original order
            setQuestions(shuffleArray(questionArray)); // Set shuffled questions
            setStatus(docosData[0]["status"]);
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

  function onSubmit() {
    let count = 0;
    let infoBool = false;

    if (
      document.getElementById("studName").value !== "" &&
      document.getElementById("studRollNo").value !== "" &&
      document.getElementById("studClass").value !== ""
    ) {
      infoBool = true;
    }

    let tempSelectedList = new Array(questions.length);
    
    for (let i = 0; i < questions.length; i++) {
      const originalIndex = originalQuestionOrder.findIndex(q => 
        q.question === questions[i].question
      );
      
      let selectedAnswer = null;
      if (questions[i].type === "mcq") {
        const selectedRadio = document.querySelector(
          `input[name="${i + 1}. ${questions[i].question}"]:checked`
        );
        if (selectedRadio) {
          selectedAnswer = parseInt(selectedRadio.value, 10) -1 ;
          count++;
        }
      } else if (questions[i].type === "truefalse") {
        selectedAnswer = questions[i].options.map((_, index) => {
          const selected = document.querySelector(
            `input[name="${i + 1}. ${questions[i].question}.option${index}"]:checked`
          );
          if (selected) {
            return selected.value === "true";
          }
          return null; // Handle unselected options
        });

        // Check if all options have a selection
        if (selectedAnswer.every((answer) => answer !== null)) {
          count++;
        }
      } else if (questions[i].type === "shortanswer") {
        selectedAnswer = document.getElementById(`shortAnswer${i}`).value;
        if (selectedAnswer.trim() !== "") {
          count++;
        }
      }

      tempSelectedList[originalIndex] = { selectedAnswer };
    }

    if (count === questions.length && infoBool) {
      setSelectedList(tempSelectedList);
      setStudInfo({
        name: document.getElementById("studName").value,
        email: getAuth().currentUser.email,
        roll_no: document.getElementById("studRollNo").value,
        class: document.getElementById("studClass").value,
      });
    } else {
      if (!infoBool && count < questions.length) {
        alert("Please Enter Student Details and Attempt All Questions");
      } else if (count < questions.length) {
        alert("Please Attempt All Questions");
      } else if (!infoBool) {
        alert("Please Enter Student Details");
      }
    }
  }

  return (
    <form id="mainForm" className="m-4 md:m-10 lg:m-14">
      {questions.length !== 0 ? (
        questions !== "Sai mã pin" ? (
          questions !== "Already Attempted" ? (
            status !== "inactive" ? (
              <div>
                <div className="quizBox">
                  <p id="quiz_title" className="faintShadow">
                    {title}
                  </p>
                </div>
                <ul className="stu_info">
                  <li>
                    Họ và tên:{" "}
                    <input
                      type="text"
                      id="studName"
                      className="studInfo faintShadow"
                      placeholder="Nhập họ và tên"
                    ></input>
                  </li>
                  <li>
                    Lớp:{" "}
                    <input
                      type="text"
                      id="studRollNo"
                      className="studInfo faintShadow"
                      placeholder="Nhập lớp"
                    ></input>
                  </li>
                  <li>
                    Trường:{" "}
                    <input
                      type="text"
                      id="studClass"
                      className="studInfo faintShadow"
                      placeholder="Nhập trường"
                    ></input>
                  </li> 
                </ul>
                {questions.map((question, questionIndex) => {
                  return (
                    <div key={uuid()}>
                      <p className="questionP">
                        {"Câu "}
                        {questionIndex + 1}. {question.question}
                      </p>
                      {question.type === "mcq" &&
                        question.options.map((option, optionIndex) => {
                          return (
                            <div key={uuid()} className="mb-7">
                              <li key={uuid()} className="radioButtonsLi">
                                <input
                                  key={uuid()}
                                  id={`${questionIndex}-${optionIndex}`}
                                  type="radio"
                                  className="radioInput"
                                  value={optionIndex + 1}
                                  name={`${questionIndex + 1}. ${question.question}`}
                                />
                                <label
                                  className="radioLabel faintShadow hov"
                                  htmlFor={`${questionIndex}-${optionIndex}`}
                                >
                                  {option.option}
                                </label>
                              </li>
                            </div>
                          );
                        })}
                      {question.type === "truefalse" &&
                        question.options.map((option, optionIndex) => {
                          return (
                            <div key={uuid()}>
                              <li key={uuid()} className="radioButtonsLi">
                                <label
                                  className="radioLabel faintShadow hov"
                                >
                                  {option.option}
                                </label>
                                <input
                                  type="radio"
                                  id={`${questionIndex}-${optionIndex}-true`}
                                  name={`${questionIndex + 1}. ${question.question}.option${optionIndex}`}
                                  value="true"
                                />
                                <label htmlFor={`${questionIndex}-${optionIndex}-true`}>
                                  Đúng
                                </label>
                                <input
                                  type="radio"
                                  id={`${questionIndex}-${optionIndex}-false`}
                                  name={`${questionIndex + 1}. ${question.question}.option${optionIndex}`}
                                  value="false"
                                />
                                <label htmlFor={`${questionIndex}-${optionIndex}-false`}>
                                  Sai
                                </label>
                              </li>
                            </div>
                          );
                        })}
                      {question.type === "shortanswer" && (
                        <div className="m-[20px]">
                          <textarea autoresize
                            type="text"
                            id={`shortAnswer${questionIndex}`}
                            placeholder="Nhập câu trả lời của bạn"
                            className="faintShadow w-[50%] overflow-hidden p-[12px] rounded-lg" 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="sub_btn">
                  <input
                    className="sub_btn_actual hov"
                    type="button"
                    value="Submit"
                    onClick={() => onSubmit()}
                  />
                </div>
              </div>
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
