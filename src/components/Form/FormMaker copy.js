import { useEffect, useState } from "react";
import db from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';

function FormMaker() {
  const [quizTitle, setQuizTitle] = useState("");
  const [list, setList] = useState([
    { id: uuid(), question: "", answer: null, type: "mcq" },
  ]);
  const [optionList, setOptionList] = useState([
    [
      { id: uuid(), option: "", optionNo: 1, answer: null },
      { id: uuid(), option: "", optionNo: 2, answer: null },
    ],
  ]);

  useEffect(() => {}, [optionList]);

  function numHandler(event, index) {
    let pattern = new RegExp("[^0-" + optionList[index].length + "]");
    if (event.key.match(pattern) || event.target.value.length >= 1) {
      event.preventDefault();
    }
  }

  function handleAddQuest() {
    // console.log(list);
    // console.log(Math.floor(100000 + Math.random() * 999999));
    let values = [...optionList];
    values.push([
      { id: uuid(), option: "", optionNo: 1, answer: null },
      { id: uuid(), option: "", optionNo: 2, answer: null },
    ]);
    setOptionList(values);
    setList([...list, { id: uuid(), question: "", answer: null, type: "mcq" }]);
  }

  function handleRemoveQuest(index) {
    let values = [...list];
    let valuess = values.filter((item, itemIndex) => itemIndex !== index);
    let optValues = [...optionList];
    //console.log(optValues);
    optValues.splice(index, 1);
    //console.log(optValues);
    setOptionList(optValues);
    setList(valuess);
  }

  function handleAddOpt(index, ind) {
    let values = [...optionList];
    values[index].push({
      id: uuid(),
      option: "",
      optionNo: ind,
      answer: null,
    });
    setOptionList(values);
  }

  function handleRemoveOpt(i, ii) {
    let values = [...optionList];
    //console.log(values);
    values[i].splice(ii, 1);
    //console.log(values);
    setOptionList(values);
  }

  function questChangeHandler(event, i, where) {
    let values = [...list];
    values[i][where] = event.target.value;
    setList(values);
    // console.log(list);
  }

  function optionChangeHandler(event, i, ii) {
    let values = [...optionList];
    values[i][ii]["option"] = event.target.value;
    setOptionList(values);
    // console.log(optionList);
  }

  function handleQuestionTypeChange(event, index) {
    let values = [...list];
    values[index].type = event.target.value;
    setList(values);
  }

  function handleCorrectOptionChange(event, questionIndex, optionIndex) {
    let values = [...list];
    // console.log(values);
    // console.log(optionList);
    if (list[questionIndex].type === "truefalse") {
      let options = [...optionList];
      // console.log(event.target.value);  
      // console.log(options);
      options[questionIndex][optionIndex].answer = event.target.value === "true";
      // console.log(options);
      setOptionList(options);
    } else {
      values[questionIndex].answer = optionIndex;
    }
    setList(values);
  }

  function validator() {
    // Validate quiz title
    if (quizTitle.trim() === "") {
      alert("Quiz title cannot be empty.");
      return false;
    }

    // Validate each question and its options
    for (let i = 0; i < list.length; i++) {
      const question = list[i];
      const options = optionList[i];

      // Check if the question text is not empty
      if (question.question.trim() === "") {
        alert(`Question ${i + 1} cannot be empty.`);
        return false;
      }

      // Check if an answer is selected
      if (
        (question.type === "mcq" && (question.answer === "" || question.answer === null)) ||
        (question.type === "truefalse" && !options.some(opt => opt.answer === true || opt.answer === false))
      ) {
        alert(`Please select a valid answer for question ${i + 1}.`);
        return false;
      }

      // Validate options based on question type
      if (question.type === "mcq") {
        // Ensure there are at least two options for MCQ
        if (options.length < 2) {
          alert(`Question ${i + 1} must have at least two options.`);
          return false;
        }

        // Check that each option text is not empty
        for (let j = 0; j < options.length; j++) {
          if (options[j].option.trim() === "") {
            alert(`Option ${j + 1} for question ${i + 1} cannot be empty.`);
            return false;
          }
        }

        // Ensure exactly one correct answer is selected
        const correctAnswers = question.answer;
        if (correctAnswers === null) {
          alert(`Please select a correct answer for question ${i + 1}.`);
          return false;
        }
      } else if (question.type === "truefalse") {
        // Ensure there are exactly two options for True/False
        if (options.length !== 2) {
          alert(`True/False question ${i + 1} must have exactly two options.`);
          return false;
        }

        // Check that each option text is not empty
        for (let j = 0; j < options.length; j++) {
          if (options[j].option.trim() === "") {
            alert(`Option ${j + 1} for question ${i + 1} cannot be empty.`);
            return false;
          }

          // Ensure answer is either true or false
          if (typeof options[j].answer !== "boolean") {
            alert(`Please select True or False for option ${j + 1} of question ${i + 1}.`);
            return false;
          }
        }
      } else if (question.type === "shortanswer") {
        if (question.answer.trim() === "" || question.answer === null) {
          alert(`Answer for question ${i + 1} cannot be empty.`);
          return false;
        }
      } else {
        alert(`Invalid question type for question ${i + 1}.`);
        return false;
      }
    }
    
    // All validations passed
    return true;
  }

  async function setQuestionPaper(examPin, quizTitle, question_question) {
    //examPin: Randomly generated exam pin
    //quizTitle: User input title of quiz
    //question_question: Array of user input questions
    console.log(question_question);
    await setDoc(
      //Firestore document path for setting question paper
      doc(
        db,
        "Paper_Setters",
        examPin.toString(),
        "Question_Papers_MCQ",
        quizTitle
      ),
      //Data format for setting question paper
      {
        question_question: question_question,
        creator: getAuth().currentUser.email,
        status: "active",
      }

    );
  }

  async function setAnswerSheet(examPin, quizTitle, answer_answer) {
    //examPin: Randomly generated exam pin
    //quizTitle: User input title of quiz
    //answer_answer: Array of user input answer keys
    await setDoc(
      //Firestore document path for setting answer key
      doc(
        db,
        "Paper_Setters",
        examPin.toString(),
        "Question_Papers_MCQ",
        quizTitle + "_answerSheet"
      ),
      //Data format for setting answer key
      { answer_answer: answer_answer }
    );
  }

  async function setResponseStatus(examPin, quizTitle) {
    //examPin: Randomly generated exam pin
    //quizTitle: User input title of quiz
    await setDoc(
      //Firestore document path for setting Response Status
      doc(
        db,
        "Users",
        getAuth().currentUser.uid,
        "Exams_Created",
        examPin.toString()
      ),
      //Data format for setting Status
      {
        quiz_title: quizTitle,
        status: "active",
      },
      { merge: true }
    );
  }

  async function onSubmit() {
    if (!validator()) {
      alert("Please fill all the textfields to proceed");
      return;
    }
    // console.log(optionList);
    try {
      const examPin = Math.floor(100000 + Math.random() * 900000);
      const questionQuestions = list.map((question, index) => {
        // if (question.type === "shortanswer") {
        //   return {
        //     question: question.question.trim(),
        //     answer: question.answer.trim(),
        //     type: question.type,
        //   };
        // }
        let options = [];
        if(question.type!=="shortanswer") {
          options = optionList[index].filter(option => option.option && option.optionNo);
        }
        return {
          question: question.question.trim(),
          options: options.map(option => ({ option: option.option.trim(), optionNo: option.optionNo })),
          type: question.type,
        };
      });

      const answerAnswers = list.map((question, index) => {
        if (question.type === "mcq") {
          return { answer: question.answer + 1 }; // Assuming answers are 1-based indexes
        } else if (question.type === "truefalse") {
          return { answer: optionList[index].map(option => option.answer) };
        } else if (question.type === "shortanswer") {
          return { answer: question.answer.trim() };
        }
        return {};
      });
      // console.log(questionQuestions);
      // console.log(answerAnswers);
      // Save data to Firestore
      await Promise.all([
        setQuestionPaper(examPin, quizTitle, questionQuestions),
        setAnswerSheet(examPin, quizTitle, answerAnswers),
        setResponseStatus(examPin, quizTitle),
      ]);

      // Redirect to DisplayPin page
      window.location.href += `/DisplayPin/${examPin}`;
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  }
  //alert("Test Created Successfully");


  function resetForm() {
    if (window.confirm("Are you sure you want to clear the form ?") == true) {
      document.getElementById("quiz_title").value = "";
      setList([{ id: uuid(), question: "", answer: null, type: "mcq" }]);
      setOptionList([
        [
          { id: uuid(), option: "", optionNo: 1, answer: null },
          { id: uuid(), option: "", optionNo: 2, answer: null },
        ],
      ]);
    }
  }

  return (
    <div id="mainForm">
      <div className="quizBox">
        <input
          type="text"
          className="faintShadow"
          name="quiz_title"
          id="quiz_title"
          placeholder="Quiz Title"
          onChange={(event) => setQuizTitle(event.target.value)}
        />
      </div>
      {list.map((soloList, index) => (
        <div key={soloList.id} id="questionnaire">
          <ul>
            <li className="dlt_li">
              <select
                value={soloList.type}
                onChange={(event) => handleQuestionTypeChange(event, index)}
              >
                <option value="mcq">Multiple Choice</option>
                <option value="truefalse">True/False</option>
                <option value="shortanswer">Short Answer</option>
              </select>
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                className="questionBox faintShadow"
                onChange={(event) =>
                  questChangeHandler(event, index, "question")
                }
              />
              {list.length > 1 && index !== 0 && (
                <button className="dlt_btn">
                  <img
                    className="dlt_img faintShadow"
                    src={require("../../images/trash_bin-100_copy.jpg")}
                    alt="Delete"
                    onClick={() => handleRemoveQuest(index)}
                  />
                </button>
              )}
            </li>

            {soloList.type === "mcq" &&
              optionList[index].map((soloOption, ind) => (
                <li key={soloOption.id} className="dlt_li">
                  <input
                    type="text"
                    className="optionBox faintShadow"
                    placeholder={`Option ${ind + 1}`}
                    onChange={(event) =>
                      optionChangeHandler(event, index, ind)
                    }
                  />
                  <input
                    type="radio"
                    name={`correctOption-${index}`}
                    checked={list[index].answer === ind}
                    onChange={(event) =>
                      handleCorrectOptionChange(event, index, ind)
                    }
                  />
                  {optionList[index].length > 2 && ind !== 0 && ind !== 1 && (
                    <button className="dlt_btn opt">
                      <img
                        className="dlt_img opt faintShadow"
                        src={require("../../images/trash_bin-100_copy.jpg")}
                        alt="Delete"
                        onClick={() => handleRemoveOpt(index, ind)}
                      />
                    </button>
                  )}
                </li>
              ))}

            {soloList.type === "truefalse" &&
              optionList[index].map((soloOption, ind) => (
                <li key={soloOption.id} className="dlt_li">
                  <input
                    type="text"
                    className="optionBox faintShadow"
                    placeholder={`Option ${ind + 1}`}
                    onChange={(event) =>
                      optionChangeHandler(event, index, ind)
                    }
                  />
                  <select
                    value={soloOption.answer === null ? "" : soloOption.answer ? "true" : "false"}
                    onChange={(event) =>
                      handleCorrectOptionChange(event, index, ind)
                    }
                  >
                    <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  {optionList[index].length > 2 && (
                    <button className="dlt_btn opt">
                      <img
                        className="dlt_img opt faintShadow"
                        src={require("../../images/trash_bin-100_copy.jpg")}
                        alt="Delete"
                        onClick={() => handleRemoveOpt(index, ind)}
                      />
                    </button>
                  )}
                </li>
              ))}

            {soloList.type === "shortanswer" && (
              <li className="dlt_li">
                <input
                  type="text"
                  className="shortAnswerBox faintShadow"
                  placeholder="Answer"
                  value={list[index].answer}
                  onChange={(event) => questChangeHandler(event, index, "answer")}
                />
              </li>
            )}

            <li>
              {optionList[index].length < 6 && (
                <input
                  className="sub_btn_actual hov"
                  type="button"
                  value="Add Option"
                  onClick={() =>
                    handleAddOpt(index, optionList[index].length + 1)
                  }
                />
              )}
            </li>
            {list.length - 1 === index && (
              <input
                className="sub_btn_actual hov"
                type="button"
                value="Add Question"
                onClick={() => handleAddQuest()}
              />
            )}
          </ul>
        </div>
      ))}
      <div className="sub_btn">
        <input
          className="sub_btn_actual hov"
          type="button"
          value="Submit"
          onClick={() => onSubmit()}
        />
        <input
          className="sub_btn_actual hov"
          type="reset"
          value="Clear"
          onClick={() => resetForm()}
        />
      </div>
    </div>
  );
}

export default FormMaker;
