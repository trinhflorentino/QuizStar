import { useEffect, useState } from "react";
import { default as db, storage } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';
import TrashBin from "../../images/trash_bin-100_copy.jpg";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdCloudUpload } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { TbMatrix } from "react-icons/tb";
import { BiImages } from "react-icons/bi";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineQuestionCircle } from "react-icons/ai";

// import fs from "fs";
var mammoth = require("mammoth");
// const storage = getStorage();

function FormMaker() {
  const [quizTitle, setQuizTitle] = useState("");
  const [list, setList] = useState([
    { id: uuid(), question: "", answer: null, type: "mcq" },
  ]);
  const [optionList, setOptionList] = useState([
    [
      { id: uuid(), option: "", optionNo: 1, answer: true },
      { id: uuid(), option: "", optionNo: 2, answer: true },
    ],
  ]);
  
  const [mathJaxInputActive, setMathJaxInputActive] = useState(false);
  const [mathJaxQuestionIndex, setMathJaxQuestionIndex] = useState(null);
  const [mathJaxInputValue, setMathJaxInputValue] = useState("");
  const handleMathJaxInput = (index) => {
    setMathJaxInputActive(true);
    setMathJaxQuestionIndex(index);
    setMathJaxInputValue(list[index].question);
  };
  const handleMathJaxInputChange = (value) => {
    setMathJaxInputValue(value);
  };
  const saveMathJaxInput = () => {
    if (mathJaxQuestionIndex !== null) {
      const updatedList = [...list];
      updatedList[mathJaxQuestionIndex].question = mathJaxInputValue;
      setList(updatedList);
      // ...reset state variables
    }
  };
  const cancelMathJaxInput = () => {
    setMathJaxInputActive(false);
    setMathJaxQuestionIndex(null);
    setMathJaxInputValue("");
  };

  // Create refs for the number inputs
  const mcqRef = React.useRef(null);
  const trueFalseRef = React.useRef(null);
  const shortAnswerRef = React.useRef(null);

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
      { id: uuid(), option: "", optionNo: 1, answer: true },
      { id: uuid(), option: "", optionNo: 2, answer: true },
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
        (question.type === "truefalse" && 
           !options.some(opt => opt.answer === true || opt.answer === false) 
        )
      ) {
        console.log(question);
        console.log(options);
        alert(`Vui lòng chọn đáp án cho câu hỏi ${i + 1}.`);
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
        // if (options.length !== 2) {
        //   alert(`True/False question ${i + 1} must have exactly two options.`);
        //   return false;
        // }

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
  
    try {
      const examPin = Math.floor(100000 + Math.random() * 900000);
      
      // Upload images first and get URLs
      const uploadPromises = list.map(async (question, index) => {
        const imageFile = document.querySelector(`input[type="file"][data-index="${index}"]`)?.files[0];
        if (imageFile) {
          return await uploadImage(imageFile, examPin, question.id);
        }
        return null;
      });
  
      const imageUrls = await Promise.all(uploadPromises);
  
      // Add image URLs to questions
      const questionQuestions = list.map((question, index) => {
        let options = [];
        if(question.type !== "shortanswer") {
          options = optionList[index].filter(option => option.option && option.optionNo);
        }
        
        return {
          question: question.question.trim(),
          options: options.map(option => ({ option: option.option.trim(), optionNo: option.optionNo })),
          type: question.type,
          imageUrl: imageUrls[index] // Add image URL to question data
        };
      });
  
      const answerAnswers = list.map((question, index) => {
        if (question.type === "mcq") {
          return { answer: question.answer + 1 };
        } else if (question.type === "truefalse") {
          return { answer: optionList[index].map(option => option.answer) };
        } else if (question.type === "shortanswer") {
          return { answer: question.answer.trim() };
        }
        return {};
      });
  
      // Save data to Firestore
      await Promise.all([
        setQuestionPaper(examPin, quizTitle, questionQuestions),
        setAnswerSheet(examPin, quizTitle, answerAnswers),
        setResponseStatus(examPin, quizTitle),
      ]);
  
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
  const apiKey = "AIzaSyBha8XFvoYiAXXHYPjPIAwBwlkqNpq4m9w"; 
  // const apiKey = "AIzaSyD0CdU3giLumipay1SVMpPDO4uFD6iF-HM"; 
  const genAI = new GoogleGenerativeAI(apiKey);
  const model20flash = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp", 
    generationConfig: {
      "responseMimeType": "application/json",
      // responseSchema: schema,
      temperature: 0.6,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,    
    },
  });
  const model1206 = genAI.getGenerativeModel({
    model: "gemini-exp-1206", 
    generationConfig: {
      "responseMimeType": "application/json",
      // responseSchema: schema,
      temperature: 0.6,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,    
    },
  });


  async function extractQuestionsJSON(file) {

    const prompt = `
Hãy phân tích file được upload và trích xuất tất cả các câu hỏi thuộc các dạng "mcq", "truefalse", và "shortanswer" cùng với đáp án của chúng. Kết quả bắt buộc phải được định dạng JSON theo cấu trúc sau:

[
  {
    "answer": "<đáp án>",
    "question": "<nội dung câu hỏi>",
    "type": "<loại câu hỏi>",
    "options": ["<lựa chọn 1>", "<lựa chọn 2>", ...] // Chỉ dành cho mcq và truefalse
  },
  ...
]

Yêu cầu cụ thể:

mcq: "answer" chứa ký tự đại diện cho đáp án đúng (A, B, C, hoặc D). "options" chứa mảng các lựa chọn.

truefalse: "question" chứa nội dung câu hỏi. "options" chứa mảng các mệnh đề cần đánh giá. "answer" là mảng các giá trị boolean (true/false) tương ứng với từng mệnh đề trong "options". Ưu tiên sử dụng mảng boolean [true, false, ...] thay vì dạng chuỗi "Đáp án a [true, false]".

shortanswer: "answer" chứa đáp án ngắn gọn dưới dạng chuỗi. Nếu câu hỏi yêu cầu đánh giá đúng/sai nhiều mệnh đề, "answer" sẽ là mảng các giá trị boolean (true/false). Ưu tiên sử dụng mảng boolean [true, false, ...] nếu có thể.

Lưu ý:

Chỉ trích xuất câu hỏi thuộc ba dạng trên. Bỏ qua các câu hỏi khác.

Mỗi câu hỏi phải rõ ràng, dễ hiểu và có đáp án duy nhất.

Đối với câu hỏi truefalse, mỗi mệnh đề phải có giá trị đúng hoặc sai rõ ràng, các mệnh đề phải nằm trong mảng options, không để trên question.

Đối với câu hỏi shortanswer, đáp án cần ngắn gọn, súc tích và chính xác.

Tuân thủ nghiêm ngặt định dạng JSON.

Ưu tiên sử dụng mảng boolean [true, false] cho câu hỏi truefalse và shortanswer thay vì dạng chuỗi "Đáp án a [true, false]", trừ khi format của file input không cho phép.
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
      console.log(fileContent);
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
      // console.log(response);
      const uploadResponse = await response.json();
      const fileUri = uploadResponse.file.uri;
      // console.log(uploadResponse);
      console.log(fileUri);
      const result = await model20flash.generateContent([
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
      
      let responseText = result.response.text();
      if (responseText.endsWith("]}]}]")) {
        responseText = responseText.slice(0, -2);
      }
      return responseText;
    } catch (error) {
      console.error("Error uploading or summarizing:", error); 
    }
  }

  async function matrixQuestionsJSON(file) {

    const prompt = `
Hãy phân tích file được upload (ma trận/đặc tả/đề cương) và tạo ra các câu hỏi thuộc các dạng "mcq", "truefalse", và "shortanswer" cùng với đáp án của chúng dựa trên nội dung file. Kết quả bắt buộc phải được định dạng JSON theo cấu trúc sau:

[
{
"answer": "<đáp án>",
"question": "<nội dung câu hỏi>",
"type": "<loại câu hỏi>",
"options": ["<lựa chọn 1>", "<lựa chọn 2>", ...] // Chỉ dành cho mcq và truefalse
},
...
]

Yêu cầu cụ thể:

Dựa vào nội dung được cung cấp trong file để tạo ra các câu hỏi phù hợp.

mcq: "answer" chứa ký tự đại diện cho đáp án đúng (A, B, C, hoặc D). "options" chứa mảng các lựa chọn.

truefalse: "question" chứa nội dung câu hỏi. "options" chứa mảng các mệnh đề cần đánh giá. "answer" là mảng các giá trị boolean (true/false) tương ứng với từng mệnh đề trong "options". Ưu tiên sử dụng mảng boolean [true, false, ...] thay vì dạng chuỗi "Đáp án a [true, false]".

shortanswer: "answer" chứa đáp án ngắn gọn dưới dạng chuỗi. Nếu câu hỏi yêu cầu đánh giá đúng/sai nhiều mệnh đề, "answer" sẽ là mảng các giá trị boolean (true/false). Ưu tiên sử dụng mảng boolean [true, false, ...] nếu có thể.

Lưu ý:

Chỉ tạo câu hỏi thuộc ba dạng trên.

Mỗi câu hỏi phải rõ ràng, dễ hiểu và có đáp án duy nhất.

Đối với câu hỏi truefalse, mỗi mệnh đề phải có giá trị đúng hoặc sai rõ ràng, các mệnh đề phải nằm trong mảng options, không để trên question.

Đối với câu hỏi shortanswer, đáp án cần ngắn gọn, súc tích và chính xác.

Tuân thủ nghiêm ngặt định dạng JSON.

Ưu tiên sử dụng mảng boolean [true, false] cho câu hỏi truefalse và shortanswer thay vì dạng chuỗi "Đáp án a [true, false]", trừ khi format của file input không cho phép.

Số lượng và nội dung câu hỏi phải bám sát ma trận/đặc tả/đề cương trong file upload.
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
      console.log(fileContent);
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
      // console.log(response);
      const uploadResponse = await response.json();
      const fileUri = uploadResponse.file.uri;
      // console.log(uploadResponse);
      console.log(fileUri);
      const result = await model1206.generateContent([
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
      
      let responseText = result.response.text();
      if (responseText.endsWith("]}]}]")) {
        responseText = responseText.slice(0, -2);
      }
      return responseText;
    } catch (error) {
      console.error("Error uploading or summarizing:", error); 
    }
  }

  // Serialize current questions and options
  const serializeCurrentQuestions = () => {
    return list.map((question, index) => {
      let serialized = `Câu hỏi ${index + 1}: ${question.question}`;
      
      if (question.type === "mcq" || question.type === "truefalse") {
        const options = optionList[index].map(opt => `${opt.optionNo}. ${opt.option}`).join(", ");
        serialized += `\nLựa chọn: ${options}`;
      }
      
      if (question.type === "mcq") {
        serialized += `\nĐáp án đúng: ${String.fromCharCode(65 + question.answer)}`; // Converts index to letter
      } else if (question.type === "truefalse") {
        const answers = optionList[index].map(opt => (opt.answer ? "True" : "False")).join(", ");
        serialized += `\nĐáp án: ${answers}`;
      } else if (question.type === "shortanswer") {
        serialized += `\nĐáp án: ${question.answer}`;
      }
      
      return serialized;
    }).join("\n\n");
  };

  async function createQuestionsJSON() {
    const mcqCount = mcqRef.current.value || 0;
    const trueFalseCount = trueFalseRef.current.value || 0;
    const shortAnswerCount = shortAnswerRef.current.value || 0;

    // Serialize current questions and options
    const currentQuestions = serializeCurrentQuestions();

    const prompt = `
Hãy phân tích đoạn JSON được upload và tạo ra các câu hỏi tương tự thuộc các dạng "mcq", "truefalse", và "shortanswer" cùng với đáp án của chúng. Kết quả bắt buộc phải được định dạng JSON theo cấu trúc sau:

[
  {
    "answer": "<đáp án>",
    "question": "<nội dung câu hỏi>",
    "type": "<loại câu hỏi>",
    "options": ["<lựa chọn 1>", "<lựa chọn 2>", ...] // Chỉ dành cho mcq và truefalse
  },
  ...
]

Đầu vào:
Các câu hỏi hiện tại:
${currentQuestions}

Đầu ra: số câu hỏi= {"mcq": ${mcqCount}, "truefalse": ${trueFalseCount}, "shortanswer": ${shortAnswerCount}}

Yêu cầu cụ thể:

- **mcq**: "answer" chứa ký tự đại diện cho đáp án đúng (A, B, C, hoặc D). "options" chứa mảng các lựa chọn.
- **truefalse**: "question" chứa nội dung câu hỏi. "options" chứa mảng các mệnh đề cần đánh giá. "answer" là mảng các giá trị boolean (true/false) tương ứng với từng mệnh đề trong "options". Ưu tiên sử dụng mảng boolean [true, false, ...] thay vì dạng chuỗi "Đáp án a [true, false]".
- **shortanswer**: "answer" chứa đáp án ngắn gọn dưới dạng chuỗi. Nếu câu hỏi yêu cầu đánh giá đúng/sai nhiều mệnh đề, "answer" sẽ là mảng các giá trị boolean (true/false). Ưu tiên sử dụng mảng boolean [true, false, ...] nếu có thể.

Lưu ý:

- Chỉ trích xuất câu hỏi thuộc ba dạng trên. Bỏ qua các câu hỏi khác.
- Mỗi câu hỏi phải rõ ràng, dễ hiểu và có đáp án duy nhất.
- Đối với câu hỏi truefalse, mỗi mệnh đề phải có giá trị đúng hoặc sai rõ ràng, các mệnh đề phải nằm trong mảng options, không để trên question.
- Đối với câu hỏi shortanswer, đáp án cần ngắn gọn, súc tích và chính xác.
- Tuân thủ nghiêm ngặt định dạng JSON.
- Ưu tiên sử dụng mảng boolean [true, false] cho câu hỏi truefalse và shortanswer thay vì dạng chuỗi "Đáp án a [true, false]", trừ khi format của file input không cho phép.
`;
    console.log(prompt);
    console.time("Thời gian thực hiện"); 
    try {
      const result = await model1206.generateContent(prompt);
    
      console.timeEnd("Thời gian thực hiện");
      // console.log(result.response.text()); 
      return result.response.text();
    } catch (error) {
      console.error("Error uploading or summarizing:", error); 
    }
  }

  async function createQuestions() {
    // const fileInput = document.getElementById('fileInput');
    // const file = fileInput.files[0];
    // if (file === undefined) {
    //   alert("Vui lòng chọn file trước.");
    //   return;
    // }
    // console.log(file);
    try {
      const ketQua = await createQuestionsJSON();
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        const parsedData = JSON.parse(ketQua); // Ensure it's an array
        validateQuestionsArray(parsedData);
        const convertedData = convertAnswers(parsedData); // Convert answers
        console.log("Converted Data:", convertedData);
        addQuestionsFromJSON(convertedData); // Pass the array, not string
      }
    } catch (error) {
      console.error("Error extracting questions:", error);
      alert(`Error: ${error.message}`);
    }
  }

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

  async function extractQuestions() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file === undefined) {
      alert("Vui lòng chọn file trước.");
      return;
    }
    // console.log(file);
    try {
      const ketQua = await extractQuestionsJSON(file);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        const parsedData = JSON.parse(ketQua); // Ensure it's an array
        validateQuestionsArray(parsedData);
        const convertedData = convertAnswers(parsedData); // Convert answers
        console.log("Converted Data:", convertedData);
        addQuestionsFromJSON(convertedData); // Pass the array, not string
      }
    } catch (error) {
      console.error("Error extracting questions:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function matrixQuestion() {
    const fileInput = document.getElementById('matrixInput');
    const file = fileInput.files[0];
    if (file === undefined) {
      alert("Vui lòng chọn file trước.");
      return;
    }
    // console.log(file);
    try {
      const ketQua = await matrixQuestionsJSON(file);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        const parsedData = JSON.parse(ketQua); // Ensure it's an array
        validateQuestionsArray(parsedData);
        const convertedData = convertAnswers(parsedData); // Convert answers
        console.log("Converted Data:", convertedData);
        addQuestionsFromJSON(convertedData); // Pass the array, not string
      }
    } catch (error) {
      console.error("Error extracting questions:", error);
      alert(`Error: ${error.message}`);
    }
  }

  function convertAnswers(dataArray) {
    // Helper to convert letter to index
    // console.log(dataArray);
    const letterToIndex = (letter) => {
      if (typeof letter !== 'string') {
        throw new Error(`Answer must be a string. Received type: ${typeof letter}`);
      }
      const upperLetter = letter.toUpperCase();
      const index = upperLetter.charCodeAt(0) - 65; // 'A' is 65 in ASCII
      if (index < 0 || index >= 26) {
        throw new Error(`Invalid answer letter: "${letter}". Must be A-Z.`);
      }
      return index;
    };

    // Process each question
    const convertedData = dataArray.map((question, qIndex) => {
      if (question.type === "mcq") {
        if (!question.answer) {
          throw new Error(`Missing answer for question at index ${qIndex}.`);
        }
        return {
          ...question,
          answer: letterToIndex(question.answer)
        };
      }
      // Add processing for other types if necessary
      return question;
    });

    return convertedData;
  }

  function validateQuestionsArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      throw new Error("Data is not an array.");
    }

    dataArray.forEach((q, index) => {
      if (typeof q.question !== 'string' || q.question.trim() === "") {
        throw new Error(`Question text missing or invalid at index ${index}.`);
      }
      if (typeof q.type !== 'string' || !["mcq", "truefalse", "shortanswer"].includes(q.type)) {
        throw new Error(`Invalid or unsupported question type at index ${index}.`);
      }
      if (q.type === "mcq") {
        if (typeof q.answer !== 'string' || !/^[A-Z]$/.test(q.answer.toUpperCase())) {
          throw new Error(`Invalid answer format for MCQ at index ${index}.`);
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Insufficient options for MCQ at index ${index}.`);
        }
      }
      // Add more validations for other types if necessary
    });
  }

  function addQuestionsFromJSON(jsonData) {
    try {
      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid JSON format: Expected an array of questions.");
      }
      
      // Arrays to hold new questions and options
      const newQuestions = [];
      const newOptions = [];

      jsonData.forEach((q, qIndex) => {
        // Validate and process each question
        if (typeof q.question !== 'string') {
          throw new Error(`Invalid question text at index ${qIndex}.`);
        }
        if (typeof q.type !== 'string') {
          throw new Error(`Invalid question type at index ${qIndex}.`);
        }

        let processedAnswer;
        if (q.type === "shortanswer") {
          if (typeof q.answer !== 'string') {
            throw new Error(`Invalid answer for short answer question at index ${qIndex}.`);
          }
          processedAnswer = q.answer.trim();
        } else if (q.type === "mcq") {
          if (typeof q.answer !== 'number') { // After conversion, answer should be a number
            throw new Error(`Invalid answer index for MCQ question at index ${qIndex}.`);
          }
          processedAnswer = q.answer;
        } else if (q.type === "truefalse") {
          processedAnswer = q.answer;
        } else {
          throw new Error(`Unsupported question type "${q.type}" at index ${qIndex}.`);
        }

        // Push new question to the array
        newQuestions.push({
          id: uuid(),
          question: q.question.trim(),
          answer: processedAnswer,
          type: q.type,
        });

        if (q.type === "mcq") {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            throw new Error(`MCQ type must have at least two options. Issue with question at index ${qIndex}.`);
          }
          if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) {
            throw new Error(`MCQ question at index ${qIndex} has an invalid answer index.`);
          }
          const mcqOptions = q.options.map((option, index) => ({
            id: uuid(),
            option: typeof option === 'string' ? option.trim() : '',
            optionNo: index + 1,
          }));
          newOptions.push(mcqOptions);
        } else if (q.type === "truefalse") {
          if (!Array.isArray(q.options)) {
            throw new Error(`True/False type must have an options array at index ${qIndex}.`);
          }
          const tfOptions = q.options.map((option, index) => ({
            id: uuid(),
            option: typeof option === 'string' ? option.trim() : '',
            optionNo: index + 1,
            answer: q.answer[index],
          }));
          newOptions.push(tfOptions);
        } else if (q.type === "shortanswer") {
          newOptions.push([]);
        }
      });
      
      console.log("New Questions:", newQuestions);
      console.log("New Options:", newOptions);
      
      // Update the list and optionList states in one go
      setList([...list, ...newQuestions]);
      setOptionList((prevOptionList) => [...prevOptionList, ...newOptions]);

      console.log("Questions and options successfully added from JSON.");
      console.log("Updated List:", list);
      console.log("Updated Option List:", optionList);
    } catch (error) {
      console.error("Error adding questions from JSON:", error);
      alert(`Failed to add questions from JSON: ${error.message}`);
    }
  }

  const [mathJaxReady, setMathJaxReady] = useState(false);

  const config = {
    loader: { load: ['[tex]/html'] },
    tex: {
      packages: { '[+]': ['html'] },
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)'],
      ],
      displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]'],
      ],
    },
  };
  
  const [imagePreview, setImagePreview] = useState({});

// Add handler function
const handleImageChange = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(prev => ({
        ...prev,
        [index]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  }
};

async function uploadImage(file, examPin, questionId) {
  if (!file) return null;
  
  const storageRef = ref(storage, `question_images/${examPin}/${questionId}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

  const [showModal, setShowModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  return (
  <MathJaxContext
    version={3}
    config={config}
    onLoad={() => {
      console.log("MathJax is loaded and ready!");
      setMathJaxReady(true);
    }}
    onError={(error) => {
      console.error("MathJax Load Error:", error);
    }}
  >
    <div id="mainForm" className="m-7">
      <div className="quizBox">
        <input
          type="text"
          className="shadow shadow-slate-300 mx-8 my-4 lg:mx-40 rounded-xl text-lg text-center p-4 w-full"
          name="quiz_title"
          id="quiz_title"
          placeholder="Nhập tiêu đề bài thi..."
          onChange={(event) => setQuizTitle(event.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => setShowExerciseModal(true)}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded shadow-lg transform transition hover:scale-105 flex items-center justify-center"
        >
          <MdCloudUpload className="inline mr-1 sm:mr-2"/>
          <span className="whitespace-nowrap">Tải bài tập lên</span>
        </button>

        <button
          onClick={() => setShowMatrixModal(true)}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded shadow-lg transform transition hover:scale-105 flex items-center justify-center"
        >
          <TbMatrix className="inline mr-1 sm:mr-2"/>
          <span className="whitespace-nowrap">Tải ma trận/đặc tả</span>
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-purple-500 hover:bg-purple-700 text-white text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded shadow-lg transform transition hover:scale-105 flex items-center justify-center"
        >
          <RiAiGenerate2 className="inline mr-1 sm:mr-2"/>
          <span className="whitespace-nowrap">Tạo câu hỏi mới</span>
        </button>
        {showExerciseModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative animate-slideDown bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
              <button
                onClick={() => setShowExerciseModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
              
              <form className="bg-white rounded">
                <h2 className="text-2xl font-bold mb-6">Tải tệp bài tập lên</h2>
                <div className="mb-6">
                  <input
                    type="file"
                    id="fileInput"
                    className="block w-full text-gray-700 bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".docx, .pdf, image/*"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      extractQuestions();
                      setShowExerciseModal(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Thêm câu hỏi
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExerciseModal(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Matrix Upload Modal */}
        {showMatrixModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative animate-slideDown bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
              
              <form className="bg-white rounded">
                <h2 className="text-2xl font-bold mb-6">Tải tệp ma trận/đặc tả</h2>
                <div className="mb-6">
                  <input
                    type="file"
                    id="matrixInput"
                    className="block w-full text-gray-700 bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".docx, .pdf, image/*"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      matrixQuestion();
                      setShowMatrixModal(false);
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Tạo câu hỏi
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMatrixModal(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative animate-slideDown bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
              
              <form className="bg-white rounded">
                <h2 className="text-2xl font-bold mb-6 text-center">Tạo các câu hỏi mới</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mcq">
                    Số lượng Trắc nghiệm:
                  </label>
                  <input
                    type="number"
                    id="mcq"
                    name="mcq"
                    min="0"
                    defaultValue="3"
                    ref={mcqRef}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trueFalse">
                    Số lượng Đúng/Sai:
                  </label>
                  <input
                    type="number"
                    id="trueFalse"
                    name="trueFalse"
                    min="0"
                    defaultValue="2"
                    ref={trueFalseRef}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shortAnswer">
                    Số lượng Trả Lời Ngắn:
                  </label>
                  <input
                    type="number"
                    id="shortAnswer"
                    name="shortAnswer"
                    min="0"
                    defaultValue="1"
                    ref={shortAnswerRef}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => {
                      createQuestions();
                      setShowModal(false);
                    }}
                  >
                    Tạo câu hỏi
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div>
      </div>
        
      {list.map((soloList, index) => (
        <div key={soloList.id} id="questionnaire" className="p-2 sm:p-5">
          <ul className="w-full">
            <li className="m-[5px] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center w-full sm:w-auto">
                <div className="mr-2 sm:mr-3 border-r pr-2 sm:pr-3 border-black text-sm sm:text-base">
                  Câu {index + 1}
                </div>
                <div className="mr-2 sm:mr-3 border-r pr-2 sm:pr-3 border-black text-sm sm:text-base">
                  Nhập điểm
                </div>
                <select
                  value={soloList.type}
                  className="mr-2 sm:mr-3 border-r pr-2 sm:pr-3 border-black text-sm sm:text-base"
                  onChange={(event) => handleQuestionTypeChange(event, index)}
                >
                  <option value="mcq">Trắc nghiệm</option>
                  <option value="truefalse">Đúng/Sai</option>
                  <option value="shortanswer">Trả lời ngắn</option>
                </select>
              </div>
            </li>            

            <li className="dlt_li flex flex-col sm:flex-row gap-2 sm:gap-0 mt-2">
              <input
                type="text"
                placeholder={`Câu hỏi ${index + 1}`}
                className="questionBox faintShadow w-full sm:w-[85%] p-2 sm:p-3 text-sm sm:text-base"
                value={soloList.question}
                onChange={(event) => questChangeHandler(event, index, "question")}
              />
              {list.length > 1 && (
                <button className="dlt_btn ml-0 sm:ml-2">
                  <img
                    className="dlt_img faintShadow w-8 h-8 sm:w-10 sm:h-10"
                    src={TrashBin}
                    alt="Delete"
                    onClick={() => handleRemoveQuest(index)}
                  />
                </button>
              )}
            </li>

            {soloList.type === "mcq" &&
              optionList[index].map((soloOption, ind) => (
                <li key={soloOption.id} className="dlt_li flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2">
                  <input
                    type="text"
                    className="optionBox faintShadow w-full sm:w-[70%] p-2 text-sm sm:text-base"
                    placeholder={`Tùy chọn ${ind + 1}`}
                    value={soloOption.option}
                    onChange={(event) => optionChangeHandler(event, index, ind)}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correctOption-${index}`}
                      checked={list[index].answer === ind}
                      onChange={(event) => handleCorrectOptionChange(event, index, ind)}
                      className="w-4 h-4"
                    />
                    {optionList[index].length > 2 && (
                      <button className="dlt_btn">
                        <img
                          className="dlt_img faintShadow w-6 h-6 sm:w-8 sm:h-8"
                          src={TrashBin}
                          alt="Delete"
                          onClick={() => handleRemoveOpt(index, ind)}
                        />
                      </button>
                    )}
                  </div>
                </li>
              ))}

            {soloList.type === "truefalse" &&
              optionList[index].map((soloOption, ind) => (
                <li key={soloOption.id} className="dlt_li flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2">
                  <input
                    type="text"
                    className="optionBox faintShadow w-full sm:w-[70%] p-2 text-sm sm:text-base"
                    placeholder={`Tùy chọn ${ind + 1}`}
                    value={soloOption.option}
                    onChange={(event) => optionChangeHandler(event, index, ind)}
                  />
                  <div className="flex items-center gap-2">
                    <select
                      className="p-2 rounded border text-sm sm:text-base"
                      value={soloOption.answer === null ? "" : soloOption.answer ? "true" : "false"}
                      onChange={(event) => handleCorrectOptionChange(event, index, ind)}
                    >
                      <option value="true">Đúng</option>
                      <option value="false">Sai</option>
                    </select>
                    {optionList[index].length > 2 && (
                      <button className="dlt_btn">
                        <img
                          className="dlt_img faintShadow w-6 h-6 sm:w-8 sm:h-8"
                          src={TrashBin}
                          alt="Delete"
                          onClick={() => handleRemoveOpt(index, ind)}
                        />
                      </button>
                    )}
                  </div>
                </li>
              ))}

            {soloList.type === "shortanswer" && (
              <li className="dlt_li flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                <input
                  type="text"
                  className="shortAnswerBox faintShadow w-full sm:w-[70%] p-2 text-sm sm:text-base"
                  placeholder="Đáp án"
                  value={list[index].answer}
                  onChange={(event) => questChangeHandler(event, index, "answer")}
                />
              </li>
            )}

            <li className="mt-4">
              <div className="flex flex-wrap gap-2">
                {optionList[index].length < 6 && (
                  <button
                    className="px-4 py-2 text-sm sm:text-base bg-[#000137] text-white rounded hover:bg-[#000160] transition-colors"
                    onClick={() => handleAddOpt(index, optionList[index].length + 1)}
                  >
                    <CiCirclePlus className="inline mr-2"/>
                    Thêm tùy chọn
                  </button>
                )}
                {list.length - 1 === index && (
                  <button
                    className="px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={() => handleAddQuest()}
                  >
                    <AiOutlineQuestionCircle className="inline mr-2"/>
                    Thêm câu hỏi
                  </button>
                )}
                {/* <div className="flex items-center gap-2 w-full sm:w-auto"> */}
                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded text-sm sm:text-base flex items-center py-2 px-3 sm:px-4">
                    <BiImages className="mr-1"/>
                    <span className="whitespace-nowrap">Thêm ảnh/audio</span>
                    <input 
                      type="file" 
                      className="hidden"
                      data-index={index}
                      onChange={(event) => handleImageChange(event, index)}
                      accept="image/*, audio/*"
                    />            
                  </label>
                  {imagePreview[index] && (
                    <div className="ml-2">
                      <img src={imagePreview[index]} alt="Preview" className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded" />
                    </div>
                  )}
                {/* </div> */}
              </div>
            </li>
          </ul>
        </div>
      ))}
      <div className="sub_btn">
        <input
          className="sub_btn_actual hov"
          type="button"
          value="Tạo đề thi"
          onClick={() => onSubmit()}
        />
        <input
          className="sub_btn_actual hov"
          type="reset"
          value="Xóa dữ liệu đã nhập"
          onClick={() => resetForm()}
        />
      </div>
    </div>
  </MathJaxContext>
  );
}

export default FormMaker;
