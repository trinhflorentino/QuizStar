import { useEffect, useState } from "react";
import db from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
// const docx2html=require("docx2html")
var mammoth = require("mammoth");


function FormMaker() {
  const [quizTitle, setQuizTitle] = useState("");
  const [list, setList] = useState([
    { id: uuid(), question: "", answer: null, type: "mcq" },
  ]);
  const [optionList, setOptionList] = useState([
    [
      { id: uuid(), option: "", optionNo: 1, answer: null },
      { id: uuid(), option: "", optionNo: 2, answer: null },
      { id: uuid(), option: "", optionNo: 3, answer: null },
      { id: uuid(), option: "", optionNo: 4, answer: null },
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
      { id: uuid(), option: "", optionNo: 1 },
      { id: uuid(), option: "", optionNo: 2 },
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
      optionNo: String.fromCharCode(65 + ind),
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
    if (where === "answer") {
      values[i][where] = event.target.checked ? event.target.value : null;
    } else {
      values[i][where] = event.target.value;
    }
    setList(values);
    // console.log(list);
  }

  function optionChangeHandler(event, i, ii, field) { // Thêm tham số field
    let values = [...optionList];
    values[i][ii][field] = event.target.value; // Cập nhật field tương ứng
    setOptionList(values);
  }

  function handleTypeChange(event, index) {
    let values = [...list];
    values[index].type = event.target.value;
    setList(values);
  }

  function validator() {
    if(!quizTitle) return false;
    for (let i = 0; i < list.length; i++) {
      const question = list[i];
      // console.log(question);
      if (!question.question) {
        return false; // Kiểm tra câu hỏi
      }
  
      if (question.type === "mcq") {
        const options = optionList[i];
        for (let j = 0; j < options.length; j++) {
          if (!options[j].option) {
            return false; // Kiểm tra phương án cho câu hỏi trắc nghiệm
          }
        }
        if (!question.answer) {
          return false; // Kiểm tra đáp án cho câu hỏi trắc nghiệm
        }
      } else if (question.type === "truefalse") {
        console.log(question);
        const options = optionList[i];
        for (let j = 0; j < options.length; j++) {
          if (!options[j].option) {
            return false; // Kiểm tra ý kiến cho câu hỏi đúng/sai
          }
          if (options[j].answer === undefined || options[j].answer === "") {
            return false; // Kiểm tra đáp án đúng/sai cho từng ý kiến
          }
        }
      } else if (question.type === "short") {
        if (!question.answer) {
          return false; // Kiểm tra đáp án cho câu hỏi ngắn
        }
      }
    }
  
    return true; // Tất cả các trường đều hợp lệ
  }

  async function setQuestionPaper(examPin, quizTitle, question_question) {
    //examPin: Mã pin bài kiểm tra được tạo ngẫu nhiên
    //quizTitle: Tiêu đề bài kiểm tra do người dùng nhập
    //question_question: Mảng câu hỏi do người dùng nhập
    try {
      const docRef = doc(db, "Paper_Setters", examPin.toString(), "Question_Papers", quizTitle);
      await setDoc(docRef, {
        questions: question_question, // Lưu trữ mảng câu hỏi
        creator: getAuth().currentUser.email,
        status: "active",
        // createdAt: serverTimestamp() // Thêm dấu thời gian tạo
      });
      console.log("Đã lưu câu hỏi thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi: ", error);
    }
  }

  async function setAnswerSheet(examPin, quizTitle, answer_answer) {
    //examPin: Mã pin bài kiểm tra được tạo ngẫu nhiên
    //quizTitle: Tiêu đề bài kiểm tra do người dùng nhập
    //answer_answer: Mảng đáp án do người dùng nhập
    try {
      const docRef = doc(db, "Paper_Setters", examPin.toString(), "Answer_Sheets", quizTitle); // Đường dẫn đến Answer_Sheets
      await setDoc(docRef, {
        answers: answer_answer, // Lưu trữ mảng câu trả lời
        // createdAt: serverTimestamp() // Thêm dấu thời gian tạo
      });
      console.log("Đã lưu câu trả lời thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu câu trả lời: ", error);
    }
  }

  async function setResponseStatus(examPin, quizTitle) {
    //examPin: Mã pin bài kiểm tra được tạo ngẫu nhiên
    //quizTitle: Tiêu đề bài kiểm tra do người dùng nhập
    try {
      const user = getAuth().currentUser;
      if (!user) {
        console.error("Người dùng chưa đăng nhập!");
        return;
      }
      const docRef = doc(db, "Users", user.uid, "Exams_Created", examPin.toString());
      await setDoc(docRef, {
        quiz_title: quizTitle,
        status: "active",
        // createdAt: serverTimestamp() // Thêm dấu thời gian tạo
      }, { merge: true });
      console.log("Đã cập nhật trạng thái bài kiểm tra thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái bài kiểm tra: ", error);
    }
  }
  async function onSubmit() {
    let val = validator();
    console.log(list);
    if (val) {
      let question_question = [];
      let answer_answer = [];
      for (let i = 0; i < list.length; i++) {
        let question = {
          question: list[i]["question"],
        };
  
        if (list[i].type === "mcq") {
          question.options = [];
          for (let j = 0; j < optionList[i].length; j++) {
            question.options.push({
              optionNo: optionList[i][j]["optionNo"],
              option: optionList[i][j]["option"],
            });
          }
          question.answer = list[i].answer; // Đáp án cho câu hỏi trắc nghiệm
        } else     if (list[i].type === "truefalse") {
          question.options = [];
          question.answers = []; // Lưu trữ mảng các đáp án đúng/sai
          for (let j = 0; j < optionList[i].length; j++) {
            question.options.push({
              optionNo: optionList[i][j]["optionNo"],
              option: optionList[i][j]["option"],
            });
            question.answers.push(optionList[i][j].answer); // Lưu trữ đáp án đúng/sai cho từng option
          }
        }
        else if (list[i].type === "short") {
          question.answer = list[i].answer; // Đáp án cho câu hỏi ngắn
        }
        question.type = list[i].type; // Lưu loại câu hỏi
  
        question_question.push(question);
        answer_answer.push({ answer: list[i].answer });
      }
  
      let examPin = Math.floor(100000 + Math.random() * 900000);
      try {
        await setQuestionPaper(examPin, quizTitle, question_question);
        await setAnswerSheet(examPin, quizTitle, answer_answer);
        await setResponseStatus(examPin, quizTitle);
        // window.location.href += `/DisplayPin/${examPin}`; // Redirect sau khi tất cả các cập nhật thành công
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Đã xảy ra lỗi khi tạo bài kiểm tra. Vui lòng thử lại.");
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi hoặc khôi phục trạng thái trước đó
      }
      } else {
      alert("Vui lòng điền tất cả các trường văn bản để tiếp tục");
    }
  }  //alert("Test Created Successfully");


  function resetForm() {
    if (window.confirm("Are you sure you want to clear the form ?") == true) {
      document.getElementById("quiz_title").value = "";
      setList([{ id: uuid(), question: "", answer: null, type: "mcq" }]);
      setOptionList([
        [
          { id: uuid(), option: "", optionNo: 1 },
          { id: uuid(), option: "", optionNo: 2 },
        ],
      ]);
    }
  }

  // async function handleFileUpload(event) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await fetch(API_KEY, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to upload file");
  //     }

  //     const data = await response.json();
  //     // Assuming the API returns an array of questions
  //     const newQuestions = data.questions.map((q) => ({
  //       id: uuid(),
  //       question: q.question,
  //       answer: q.answer,
  //       type: q.type,
  //     }));

  //     setList((prevList) => [...prevList, ...newQuestions]);
  //     // Optionally, update optionList if needed
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     alert("There was an error uploading the file.");
  //   }
  // }

  async function extractQuestionsJSON(file) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBha8XFvoYiAXXHYPjPIAwBwlkqNpq4m9w"; 
    const genAI = new GoogleGenerativeAI(apiKey);
    // const schema = {
    //   description: "List of questions",
    //   type: SchemaType.ARRAY,
    //   items: {
    //     type: SchemaType.OBJECT,
    //     properties: {
    //       question: {
    //         type: SchemaType.STRING,
    //         description: "The question text",
    //         nullable: false,
    //       },
    //       options: {
    //         type: SchemaType.ARRAY,
    //         description: "List of options for the question",
    //         items: {
    //           type: SchemaType.STRING,
    //         },
    //         nullable: true, // Nullable if the question type is not 'mcq'
    //       },
    //       answer: {
    //         type: SchemaType.STRING, // or SchemaType.ARRAY if answer can be an array
    //         description: "The correct answer(s) for the question",
    //         nullable: false,
    //       },
    //       type: {
    //         type: SchemaType.STRING,
    //         description: "The type of the question (e.g., mcq, truefalse, short)",
    //         nullable: false,
    //       },
    //     },
    //     required: ["question", "answer", "type"],
    //   },
    // };
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b", 
      generationConfig: {
        "responseMimeType": "application/json",
        // responseSchema: schema,
      },
    });

    const prompt = `
                  Tôi muốn bạn đọc file được upload và lấy ra toàn bộ các câu hỏi và các câu hỏi có các dạng trong nội dung của file đó. Các dạng câu hỏi bao gồm: trắc nghiệm, đúng sai, trả lời ngắn.

                  Đầu ra:

                  Xuất ra kết quả với định dạng sau:

                  [
                    {
                    "answer": "A",
                    "question": "Trường hợp nào dưới đây không dẫn điện được?",
                    "type": "mcq",
                    "options": [
                      "A.Dung dịch NaOH",
                      "B.CaCl2 nóng chảy",
                      "C.Dung dịch HBr",
                      "D.KCl rắn, khan"
                      ]
                    },
                    {
                    "type": "truefalse",
                    "question": "Câu hỏi lớn đúng sai ví dụ 1?",
                    "options": [
                    "a) Cân bằng (1) có điều chỉnh nhiệt; ",
                    "b) Hằng số độ tính theo công thức Kc = [NH3]²[N2][H2]³; ",
                    "c) Tăng áp suất chung của hệ, cân bằng (1) sẽ chuyển dịch theo chiều thuận; ",
                    "d) Khi tăng nhiệt độ, cân bằng (1) sẽ chuyển dịch theo chiều thuận.  Đánh giá tính đúng/sai của các ý kiến trên."
                    ],
                    "answer": ["Đáp án a [true, false]", "Đáp án b [true, false]", "Đáp án c [true, false]", "Đáp án d [true, false]"]
                  },
                    {
                    "type": "shortanswer",
                    "question": "Câu hỏi trả lời ngắn 1?",
                    "answer": [string]"
                    },
                  ...
                  ]

                  Lưu ý:
                  Lấy ra toàn bộ các câu hỏi trong file theo 3 dạng câu hỏi trên. nếu có câu hỏi dạng khác thì không in ra.
                  dựa trên các câu hỏi đã có sẳn tạo các câu hỏi mới với nội dung với kiến thức y chang và xuất ra theo form.
                  Chỉ trả về kết quả duy nhất là đầu ra và không giải thích gì thêm.
                  Đảm bảo câu hỏi rõ ràng, dễ hiểu và có một đáp án đúng duy nhất (đối với câu hỏi trắc nghiệm và đúng sai).
                  Đối với câu hỏi trả lời ngắn, hãy đưa ra đáp án ngắn gọn và chính xác và answer thuộc dạng string.
    `;

    console.time("Thời gian thực hiện"); 

    if (!file) {
      console.error("Please select a file first.");
      return;
    }

    try {
      let fileContent = await readFile(file);
      let fileType = file.type;
      // If it's a .docx file, convert it to HTML
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        fileContent = result.value; 
        fileType = "text/html"; // Update the file type

        // Auto download the converted HTML file
        const blob = new Blob([fileContent], { type: "text/html" });
        // const link = document.createElement("a");
        // link.href = URL.createObjectURL(blob);
        // link.download = "converted.html";
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      }
      
      // Make a request to the media.upload endpoint 
      const response = await fetch(
        "https://generativelanguage.googleapis.com/upload/v1beta/files",
        {
          method: "POST",
          headers: {
            "Content-Type": fileType, 
            "x-goog-api-key": apiKey,
          },
          body: fileContent, 
        }
      );

      const uploadResponse = await response.json();
      const fileUri = uploadResponse.file.uri;
      // console.log(file.ty)
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: fileType,
            fileUri: fileUri,
          },
        },
        { text: prompt },
      ]);

      console.timeEnd("Thời gian thực hiện");
      // console.log(result.response.text()); 
      return result.response.text();
    } catch (error) {
      console.error("Error uploading or summarizing:", error); 
    }
  }

  // Helper function to read file content as ArrayBuffer (for Mammoth.js)
  function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Helper function to read file content
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file); 
    });
  }

  // function addQuestionsFromJSON(jsonData) {
  //   const newQuestions = JSON.parse(jsonData);
  //   console.log(newQuestions);
  //   const newList = newQuestions.map((q) => ({
  //     id: uuid(),
  //     question: q.question,
  //     answer: q.answer,
  //     type: q.type,
  //   }));

  //   const newOptionList = newQuestions.map((q) => {
  //     if (q.type === "mcq") {
  //       return q.options.map((option, index) => ({
  //         id: uuid(),
  //         option: option,
  //         optionNo: index + 1,
  //       }));
  //     } else if (q.type === "truefalse") {
  //       return q.options.map((option, index) => ({
  //         id: uuid(),
  //         option: option,
  //         optionNo: index + 1,
  //         answer: q.answer[index] // Gán đáp án đúng/sai cho từng option
  //       }));
  //     } else {
  //       return [];
  //     }
  //   });

  //   setList((prevList) => [...prevList, ...newList]);
  //   setOptionList((prevOptionList) => [...prevOptionList, ...newOptionList]);
  // }

  // Gọi hàm này sau khi nhận được dữ liệu từ API
  async function extractQuestions() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const ketQua = await extractQuestionsJSON(file);
    console.log(ketQua);
    if(ketQua) addQuestionsFromJSON(ketQua); // Thêm dòng này để cập nhật form
  }

  // Gọi hàm với dữ liệu JSON
  // setTimeout(addQuestionsFromJSON(JSONData), 3000);
  var questionJSON = [
    {
      "type": "mcq",
      "answer": "1",
      "question": "Câu hỏi trắc nghiệm 1",
      "options": [
        "A.Câu hỏi 1",
        "B.Câu hỏi 2",
        "C.Câu hỏi 3",
        "D.Câu hỏi 4"
      ]
    },
    {
        "type": "truefalse",
        "question": "Câu hỏi đúng sai ví dụ 1?",
        "options": [
            {
                "answer": "true",
                "option": "Đáp án 1 đúng."
            },
            {
                "answer": "false",
                "option": "Đáp án 2 sai."
            }
        ]
    },
    {
      "type": "short",
      "question": "Câu hỏi trả lời ngắn 1?",
      "answer": [
          "đúng 1", 
          "đúng 2",
          "đúng 3"
      ]
    }
  ]
  return (
    <div id="mainForm">
      <div className="quizBox">
        <input
          type="text"
          className="faintShadow"
          name="quiz_title"
          id="quiz_title"
          placeholder="Nhập tên..."
          onChange={(event) => setQuizTitle(event.target.value)}
        />
      </div>
      <form>
        <h1>Tải tệp lên</h1>
        <input
          type="file"
          id="fileInput"
          title="Upload a file containing questions"
          aria-label="Upload a file containing questions"
          accept=".docx, .pdf, image/*"
        />
        <button type="button" onClick={extractQuestions}>Submit File</button>
      </form>
      {/* console.log(questionJSON); */}
      {/* <button type="button" onClick={addQuestionsFromJSON(questionJSON)}>Add Question</button> */}
      {list.map((soloList, index) => (
        <div key={soloList.id} id="questionnaire">
          <ul>
            <li className="dlt_li">
              <select
                value={soloList.type}
                onChange={(event) => handleTypeChange(event, index)}
              >
                <option value="mcq">Trắc nghiệm</option>
                <option value="truefalse">Đúng/Sai</option>
                <option value="short">Trả lời ngắn</option>
              </select>
              <input
                type="text"
                placeholder={`Câu hỏi ${index + 1}`}
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

            {soloList.type === "mcq" && optionList[index].map((soloOption, ind) => (
              <li key={soloOption.id} className="dlt_li">
                <input
                  type="text"
                  className="optionBox faintShadow"
                  placeholder={`Phương án ${String.fromCharCode(65 + ind)}`}
                  onChange={(event) => optionChangeHandler(event, index, ind)}
                />
                <input
                  type="radio"
                  name={`correctOption-${index}`}
                  value={String.fromCharCode(65 + ind)}  
                  checked={list[index].answer === String.fromCharCode(65 + ind)}
                  onChange={(event) => questChangeHandler(event, index, "answer")}
                />
                {optionList[index].length > 4 && ind !== 0 && ind !== 1 && (
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
            {/* {soloList.type === "mcq" && (
              <li>
                <input
                  type="number"
                  onKeyPress={(event) => numHandler(event, index)}
                  min="1"
                  className="optionBox faintShadow"
                  max={optionList[index].length}
                  maxLength="1"
                  placeholder={`Correct Option`}
                  onChange={(event) => questChangeHandler(event, index, "answer")}
                />
              </li>
            )} */}

            {soloList.type === "short" && (
              <li>
                <input
                  type="text"
                  className="optionBox faintShadow"
                  placeholder={`Short Answer`}
                  onChange={(event) => questChangeHandler(event, index, "answer")}
                />
              </li>
            )}

            {soloList.type === "truefalse" && optionList[index].map((soloOption, ind) => (
              <li key={soloOption.id} className="dlt_li">
                <input
                  type="text"
                  className="optionBox faintShadow"
                  placeholder={`Ý kiến ${ind + 1}`}
                  value={soloOption.option}
                  onChange={(event) => optionChangeHandler(event, index, ind, "option")}
                />
                <select
                  className="optionBox faintShadow"
                  value={soloOption.answer || ""}
                  onChange={(event) => optionChangeHandler(event, index, ind, "answer")}
                >
                  <option value="">Lựa chọn Đúng/Sai</option>
                  <option value="true">Đúng</option>
                  <option value="false">Sai</option>
                </select>
                {optionList[index].length > 2 && ( // Chỉ hiển thị nút xóa nếu có nhiều hơn 2 lựa chọn
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
            {soloList.type === "truefalse" && (
              <li>
                <input
                  className="sub_btn_actual hov"
                  type="button"
                  value="Add Option"
                  onClick={() =>
                    handleAddOpt(index, optionList[index].length + 1)
                  }
                />
              </li>
            )}
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
