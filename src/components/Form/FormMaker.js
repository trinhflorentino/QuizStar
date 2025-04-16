import { useEffect, useState } from "react";
import { default as db, storage } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdCloudUpload } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { TbMatrix } from "react-icons/tb";
import { BiImages } from "react-icons/bi";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiX } from "react-icons/fi";
// import ConvertApi from 'convertapi-js'

// import CloudConvert from 'cloudconvert';

// import fs from "fs";
var mammoth = require("mammoth");
// const storage = getStorage();

function FormMaker({ isEditing = false, initialData = null, onSubmit: customSubmit }) {
  // if(isEditing) {
  //   // console.log(getAuth().currentUser.email);
  //   if(getAuth().currentUser.email !== 
  // }
  const [quizTitle, setQuizTitle] = useState("");
  const [duration, setDuration] = useState(50); // Default 45 minutes
  const [list, setList] = useState([
    { id: uuid(), question: "", answer: undefined, type: "mcq", score: 0.25 },
  ]);
  const [optionList, setOptionList] = useState([
    [
      { id: uuid(), option: "", optionNo: 1, answer: true },
      { id: uuid(), option: "", optionNo: 2, answer: true },
      { id: uuid(), option: "", optionNo: 3, answer: true },
      { id: uuid(), option: "", optionNo: 4, answer: true },
    ],
  ]);
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [optionList]);

  useEffect(() => {
    if (isEditing && initialData) {
      // Set initial quiz title
      
      setQuizTitle(initialData.title);

      // Convert questions and answers to the format expected by the form
      const convertedQuestions = initialData.questions.map((q, index) => {
        let answer = null;
        
        // Handle different question types
        if (q.type === "mcq") {
          // Subtract 1 since we store MCQ answers as 1-based but use 0-based internally
          answer = initialData.answers[index]?.answer ? initialData.answers[index].answer : 0;
        } else if (q.type === "truefalse") {
          answer = initialData.answers[index]?.answer || [];
        } else if (q.type === "shortanswer") {
          answer = initialData.answers[index]?.answer || "";
        }

        return {
          id: uuid(),
          question: q.question || "",
          answer: answer,
          type: q.type || "mcq",
          score: q.score || 0.25
        };
      });

      // Convert options with proper defaults
      const convertedOptions = initialData.questions.map((q, index) => {
        if (q.type === "mcq") {
          return (q.options || []).map((opt, i) => ({
            id: uuid(),
            option: opt.option || "",
            optionNo: i + 1,
            answer: false
          }));
        } else if (q.type === "truefalse") {
          return (q.options || []).map((opt, i) => ({
            id: uuid(),
            option: opt.option || "",
            optionNo: i + 1,
            answer: initialData.answers[index]?.answer?.[i] || false
          }));
        }
        return []; // For shortanswer questions
      });

      // Set initial image previews if they exist
      if (initialData.questions) {
        const initialPreviews = initialData.questions.map(q => q.imageUrl || null);
        setImagePreview(initialPreviews);
      }
      
      setList(convertedQuestions);
      setOptionList(convertedOptions);
    }
  }, [isEditing, initialData]);

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
      { id: uuid(), option: "", optionNo: 3, answer: true },
      { id: uuid(), option: "", optionNo: 4, answer: true },
    ]);
    setOptionList(values);
    // Set default score based on type when adding new question
    setList([...list, { id: uuid(), question: "", answer: '', type: "mcq", score: 0.25 }]);
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
    const newType = event.target.value;
    let values = [...list];
    let options = [...optionList];
    
    // Set default score based on question type
    let defaultScore;
    switch(newType) {
      case 'truefalse':
        defaultScore = 1.0;
        break;
      case 'shortanswer':
        defaultScore = 0.5;
        break;
      default:
        defaultScore = 0.25; // mcq
    }

    // Preserve existing question and update type and score
    const currentQuestion = { ...values[index] };
    currentQuestion.type = newType;
    currentQuestion.score = defaultScore;
    values[index] = currentQuestion;

    // Create default options if none exist
    if (!options[index]) {
        options[index] = newType === "truefalse" 
            ? [
                { id: uuid(), option: "True", optionNo: 1, answer: false },
                { id: uuid(), option: "False", optionNo: 2, answer: false }
              ]
            : [
                { id: uuid(), option: "", optionNo: 1, answer: false },
                { id: uuid(), option: "", optionNo: 2, answer: false }
              ];
    }

    setList(values);
    setOptionList(options);
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
      alert("Tiêu đề bài thi không được để trống.");
      return false;
    }
    if(list.length === 0) { 
      alert("Vui lòng thêm ít nhất một câu hỏi vào bài thi.");
      return false;
    }
    // Validate each question and its options
    for (let i = 0; i < list.length; i++) {
      const question = list[i];
      const options = optionList[i];

      // Check if the question text is not empty
      if (question.question.trim() === "") {
        alert(`Câu hỏi ${i + 1} không được để trống.`);
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
          alert(`Câu hỏi ${i + 1} phải có ít nhất hai lựa chọn.`);
          return false;
        }

        // Check that each option text is not empty
        for (let j = 0; j < options.length; j++) {
          if (options[j].option.trim() === "") {
            alert(`Lựa chọn ${j + 1} của câu hỏi ${i + 1} không được để trống.`);
            return false;
          }
        }

        // Ensure exactly one correct answer is selected
        const correctAnswers = question.answer;
        if (correctAnswers === null) {
          alert(`Vui lòng chọn đáp án đúng cho câu hỏi ${i + 1}.`);
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
            alert(`Ý kiến ${j + 1} của câu hỏi ${i + 1} không được để trống.`);
            return false;
          }

          // Ensure answer is either true or false
          if (typeof options[j].answer !== "boolean") {
            alert(`Vui lòng chọn đáp án cho ý kiến ${j + 1} của câu hỏi ${i + 1}.`);
            return false;
          }
        }
      } else if (question.type === "shortanswer") {
        if (question.answer.trim() === "" || question.answer === null) {
          alert(`Đáp án của câu hỏi ${i + 1} không được để trống.`);
          return false;
        }
      } else {
        alert(` ${i + 1}.`);
        return false;
      }

      // Check if score is set and is a positive number
      // if (!question.score || question.score <= 0) {
      //   alert(`Câu hỏi ${i + 1} cần có điểm số lớn hơn 0.`);
      //   return false;
      // }
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
        question_question: question_question.map(q => ({
          ...q,
          score: q.score || 0.25 // Ensure score is included
        })),
        creator: getAuth().currentUser.email,
        status: "active",
        duration: duration // Add duration to the document
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
      // alert("Please fill all the textfields to proceed");
      return;
    }

    if (isEditing && customSubmit) {
      // Handle edit mode submission
      const questionQuestions = list.map((question, index) => ({
        question: question.question.trim(),
        options: optionList[index].map(option => ({
          option: option.option.trim(),
          optionNo: option.optionNo
        })),
        type: question.type,
        score: question.score || 0.25
      }));

      const answerAnswers = list.map((question, index) => ({
        answer: question.type === "mcq" ? question.answer 
          : question.type === "truefalse" ? optionList[index].map(opt => opt.answer)
          : question.answer.trim()
      }));

      await customSubmit({
        questions: questionQuestions,
        answers: answerAnswers
      });
      return;
    }
  
    try {
      const examPin = Math.floor(100000 + Math.random() * 900000);
      
      // Upload images and get URLs
      const imageUploads = await Promise.all(
        list.map(async (question, index) => {
          // If editing and image hasn't changed, use existing URL
          if (isEditing && imagePreview[index] && imagePreview[index].startsWith('http')) {
            return imagePreview[index];
          }
          
          // Otherwise handle new image upload
          if (imagePreview[index]) {
            const response = await fetch(imagePreview[index]);
            const blob = await response.blob();
            const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' });
            return await uploadImage(file, examPin, question.id);
          }
          return null;
        })
      );
  
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
          imageUrl: imageUploads[index], // Add image URL to question data
          score: question.score || 0.25
        };
      });
  
      const answerAnswers = list.map((question, index) => {
        if (question.type === "mcq") {
          return { answer: question.answer };
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
  
      navigate(`/FormMaker/DisplayPin/${examPin}`);
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  }
    //alert("Test Created Successfully");


  function resetForm() {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu đã nhập?") == true) {
      document.getElementById("quiz_title").value = "";
      setList([]);
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
  const model15pro = genAI.getGenerativeModel({
    model: "gemini-1.5-pro", 
    generationConfig: {
      "responseMimeType": "application/json",
      // responseSchema: schema,
      temperature: 0.6,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,    
    },
  });
  // const cloudconvertkey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODgyYjQ3MTc0NDU0ODE3NzMxM2EwZDk4N2E4N2FlODM2OWI3NWQ3ZjI5ZDhkZmU4MTExMjdkNmY4MWY2ZWU0YjVhMzA3YjlhZjdhZGM2ODMiLCJpYXQiOjE3MzU3NTE1NDEuOTczNTUyLCJuYmYiOjE3MzU3NTE1NDEuOTczNTUzLCJleHAiOjQ4OTE0MjUxNDEuOTY3OTU1LCJzdWIiOiI3MDYzNDI4MyIsInNjb3BlcyI6WyJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwid2ViaG9vay53cml0ZSIsIndlYmhvb2sucmVhZCIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIl19.mx2PCiBI8WR9sd8z5QEo4P7D8CUuajOy37Bx68lM9h1xCQwpO326cCQqZO5nzJx4R_c5hnr4bBLOPejdzL8LcJkpYjEFYdSzurxumSOQW_HaFsxgHizhc8TyRwwW7hvusCkeJ8BlV6zOAfakB4do4EzNT6NImlpKiHpCVdr3oinTquBHOu2RnKe_ZbwlFkqygFjFFMesp7Pdt2MC7sPNAtpowKtlvUPjBCuzNP1H_vRveqBY4WNfox4jaszbkXDWH4-BqV9iVDvkNnh9LOrpOgIEIGY7_lFhsswvGU2tG8TXYFvZRR3RaRs5Jc_N09jn9GWFO9mdPVfVV-G_HcSl4T39Mfttp_geCShsRbeTiO__kC_XFqQtI1-8sM10emkbYF2DbXpqKt2Jz6_oDSf77x86t8Sp3FSPBzUNgMvFb1yWPJbyNu5_VbdZtwa63fVcthElRL4bgEjsZb6fIuMJQTb4hB7qj5ZuAnYiYvE6TpFVGUmyxi7HyxCCJNTiTDzFmhYBevTFsQKyyQc2cMeTrI4gvBHZt9D_PeI1TVpejRacRDyFMpjQNgSb1Jk2x-vNvFmMHnKAPm_CBsApuz6PRR--1wxRgvQdG1_cGP1tcXEPzpo3cjk6iQ3cX2ookdRu5PUAxR6Vc-Y-lB0VamJlaK41H-L2tXUT95dU0iLIg-Q";
  // // const cloudConvert = new CloudConvert(cloudconvertkey);
  // // import axios from 'axios';

  // const CLOUDCONVERT_API_KEY = cloudconvertkey;
  
  //   if (file.name.endsWith('.doc')) {
  //     file = await convertDocToDocx(file);
  //   }
  //   // Continue with existing mammoth processing
  //   ...existing code...
  // }; 
/**
 * Converts DOC to DOCX and downloads the result
//  */
/**
 * Converts DOC to DOCX and downloads the result
 * @param {File|string} file - Input file or URL
 * @returns {Promise<{url: string, file: File}>}
 */

// const convertDocToDocx = async (file) => {
//   if (!file) {
//     throw new Error('File parameter is required');
//   }

//   try {
//     // Initialize API
//     const convertApi = ConvertApi.auth('secret_zN5nFvlkAgV3OAq9');
//     const params = convertApi.createParams();

//     // Handle file input
//     if (typeof file === 'string') {
//       params.add('File', new URL(file));
//     } else {
//       params.add('File', file);
//     }

//     // Convert file
//     const result = await convertApi.convert('doc', 'docx', params);
    
//     if (!result?.files?.[0]) {
//       throw new Error('Conversion failed');
//     }

//     // Download converted file
//     const response = await fetch(result.files[0].Url);
//     const blob = await response.blob();
//     const convertedFile = new File(
//       [blob], 
//       result.files[0].FileName,
//       { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
//     );

//     return {
//       url: result.files[0].Url,
//       file: convertedFile
//     };

//   } catch (error) {
//     console.error('Conversion failed:', error);
//     throw error;
//   }
// };

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
Phải tạo các câu hỏi tiếng Việt rõ ràng, dễ hiểu.
Nếu file có định dạng HTML không được thêm các thẻ có định dạng HTML vào câu hỏi.
Với câu hỏi có công thức hãy viết dưới dạng Latex.
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
      
      // if (file.name.endsWith('.doc')) {
      //   file = await convertDocToDocx(file);
      // }
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
Dựa vào nội dung được cung cấp trong file để tạo ra các câu hỏi phù hợp, ưu tiên tạo các bài toán thực tế.

mcq: "answer" chứa ký tự đại diện cho đáp án đúng (A, B, C, D). "options" chứa mảng các lựa chọn. Yêu cầu bắt buộc phải có 4 options.

truefalse: "question" chứa nội dung câu hỏi. "options" chứa mảng các mệnh đề cần đánh giá. "answer" là mảng các giá trị boolean (true/false) tương ứng với từng mệnh đề trong "options". Ưu tiên sử dụng mảng boolean [true, false, ...] thay vì dạng chuỗi "Đáp án a [true, false]".

shortanswer: "answer" chứa đáp án ngắn gọn dưới dạng chuỗi. Nếu câu hỏi yêu cầu đánh giá đúng/sai nhiều mệnh đề, "answer" sẽ là mảng các giá trị boolean (true/false). Ưu tiên sử dụng mảng boolean [true, false, ...] nếu có thể.

Lưu ý:
Nếu file có định dạng HTML không được thêm các thẻ có định dạng HTML vào câu hỏi.
Với câu hỏi có công thức hãy viết dưới dạng Latex.

Nếu file có định dạng HTML không được thêm các thẻ có định dạng HTML vào câu hỏi.
Với câu hỏi có công thức hãy viết dưới dạng Latex.
Chỉ tạo câu hỏi thuộc ba dạng trên.

Mỗi câu hỏi phải rõ ràng, dễ hiểu và có đáp án duy nhất.

Đối với câu hỏi truefalse, mỗi mệnh đề phải có giá trị đúng hoặc sai rõ ràng, các mệnh đề phải nằm trong mảng options, không để trên question. Mỗi câu hỏi truefalse phải có 4 options.

Đối với câu hỏi shortanswer, đáp án cần phải súc tích và chính xác, chỉ chứa 4 kí tự là một số có nghĩa, có thể chứa 2 kí tự số âm("-") và dấu phẩy(",").

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
Phải tạo các câu hỏi tiếng Việt dễ hiểu, rõ ràng và chính xác.
Nếu file có định dạng HTML không được thêm các thẻ có định dạng HTML vào câu hỏi.
Với câu hỏi có công thức hãy viết dưới dạng Latex.
- Không trả về các câu hỏi giống với câu hỏi đã có.
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
      const result = await model15pro.generateContent(prompt);
    
      console.timeEnd("Thời gian thực hiện");
      // console.log(result.response.text()); 
      return result.response.text();
    } catch (error) {
      console.error("Error uploading or summarizing:", error); 
    }
  }

  async function createQuestions() {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
      setShowModal(false);
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
    setIsLoading(true);
    try {
      const ketQua = await extractQuestionsJSON(file);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        const parsedData = JSON.parse(ketQua); // Ensure it's an array
        validateQuestionsArray(parsedData);
        const convertedData = convertAnswers(parsedData); // Convert answers
        console.log("Converted Data:", convertedData);
        addQuestionsFromJSON(convertedData); // Pass the array, not string
        // console.log(quizTitle);
        // setQuizTitle(file.name);
        // console.log(file.name);  
        // console.log(quizTitle);
        document.getElementById("quiz_title").value = file.name;
      }
    } catch (error) {
      console.error("Error extracting questions:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowExerciseModal(false);
    }
  }

  async function matrixQuestion() {
    const fileInput = document.getElementById('matrixInput');
    const file = fileInput.files[0];
    if (file === undefined) {
      alert("Vui lòng chọn file trước.");
      return;
    }
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
      setShowMatrixModal(false);
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

        // Set default score based on type
        let defaultScore;
        switch(q.type) {
          case 'truefalse':
            defaultScore = 1.0;
            break;
          case 'shortanswer':
            defaultScore = 0.5;
            break;
          default:
            defaultScore = 0.25; // mcq
        }

        // Push new question to the array with default score
        newQuestions.push({
          id: uuid(),
          question: q.question.trim(),
          answer: processedAnswer,
          type: q.type,
          score: defaultScore
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
  
  const [imagePreview, setImagePreview] = useState(Array(list.length).fill(null));
  const [fileInputKeys, setFileInputKeys] = useState(Array(list.length).fill(0));
  const handleRemoveImage = (index) => {
    setImagePreview(prev => {
      const newImagePreview = [...prev];
      newImagePreview[index] = null;
      return newImagePreview;
    });
    // Update key to force input reset
    setFileInputKeys(prev => {
      const newKeys = [...prev];
      newKeys[index] = prev[index] + 1;
      return newKeys;
    });
  };
      

// Add handler function
// const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB in bytes

const handleImageChange = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(prev => {
        const newImagePreview = [...prev];
        newImagePreview[index] = reader.result;
        return newImagePreview;
      });
    };
    reader.readAsDataURL(file);
  }
  // Reset file input
  event.target.value = '';
};

async function uploadImage(file, examPin, questionId) {
  // If file is a URL string (existing image), return it as is
  if (typeof file === 'string' && file.startsWith('http')) {
    return file;
  }
  
  // Otherwise upload the new file
  if (!file) return null;
  
  const storageRef = ref(storage, `question_images/${examPin}/${questionId}`);
  await uploadBytes(storageRef, file);
  console.log('Image uploaded successfully:', storageRef);
  return await getDownloadURL(storageRef);
}

  const [showModal, setShowModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  // useEffect(() => {
  //   console.log('QuizTitle changed:', quizTitle);
  // }, [quizTitle]);
  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    // console.log('Setting new title:', newTitle);
    setQuizTitle(newTitle);
  };

  // Add new handler for score changes
  function handleScoreChange(event, index) {
    let values = [...list];
    const score = parseFloat(event.target.value) || 0;
    values[index].score = score;
    setList(values);
  };
  
  return (
  // <MathJaxContext
  //   version={3}
  //   config={config}
  //   onLoad={() => {
  //     console.log("MathJax is loaded and ready!");
  //     setMathJaxReady(true);
  //   }}
  //   onError={(error) => {
  //     console.error("MathJax Load Error:", error);
  //   }}
  // >
    <div id="mainForm" className="m-4 md:m-10 lg:m-12">
      <div className="quizBox">
        <input
        type="text"
        className="quiz_title shadow shadow-slate-300 mx-4 sm:mx-8 lg:mx-40 rounded-xl text-lg text-center p-3 sm:p-4 w-full"
        name="quiz_title"
        id="quiz_title"
        placeholder="Hãy nhập tiêu đề bài thi..."
        value={quizTitle || ''} // Ensure value is never undefined
        onChange={handleTitleChange}
      />      
      </div>
      {/* <MathJax inline dynamic className="text-lg">
      </MathJax> */}
      {/* <MathJax dynamic inline>
        {"\\[\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}\\]"} hi {"\\[\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}\\]"}
      </MathJax> */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
      <button
          onClick={() => setShowExerciseModal(true)}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded shadow-lg transform transition hover:scale-105 flex items-center justify-center"
        >
          <MdCloudUpload className="inline mr-1 sm:mr-2"/>
          <span className="whitespace-nowrap">Tải đề thi lên</span>
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
            <div className="relative animate-slideDown bg-white rounded-lg shadow-xl p-4 sm:p-8 max-w-md w-full m-4">
              <button
                onClick={() => !isLoading && setShowExerciseModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {/* <span className="text-2xl">&times;</span> */}
              </button>
              
              <form className="bg-white rounded">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Tải tệp đề thi lên</h2>
                <div className="mb-6">
                  <input
                    type="file"
                    id="fileInput"
                    disabled={isLoading}
                    className="block w-full text-gray-700 bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".docx, .pdf, image/*"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      extractQuestions();
                      // !isLoading && setShowExerciseModal(false);
                    }}
                    className={`${
                      isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-700'
                    } text-white font-bold py-2 px-4 rounded flex items-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      'Thêm câu hỏi'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => !isLoading && setShowExerciseModal(false)}
                    disabled={isLoading}
                    className={`${
                      isLoading ? 'bg-gray-300' : 'bg-gray-500 hover:bg-gray-700'
                    } text-white font-bold py-2 px-4 rounded`}
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
            <div className="relative animate-slideDown bg-white rounded-lg shadow-xl p-4 sm:p-8 max-w-md w-full m-4">
              <button
                onClick={() => !isLoading && setShowMatrixModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {/* <span className="text-2xl">&times;</span> */}
              </button>
              
              <form className="bg-white rounded">
                <h2 className="text-2xl font-bold mb-6">Tải tệp ma trận/đặc tả</h2>
                <div className="mb-6">
                  <input
                    type="file"
                    id="matrixInput"
                    disabled={isLoading}
                    className="block w-full text-gray-700 bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".docx, .pdf, image/*"
                  />
                </div>
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
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      matrixQuestion();
                    }}
                    className={`${
                      isLoading ? 'bg-green-300' : 'bg-green-500 hover:bg-green-700'
                    } text-white font-bold py-2 px-4 rounded flex items-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      'Tạo câu hỏi'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => !isLoading && setShowMatrixModal(false)}
                    disabled={isLoading}
                    className={`${
                      isLoading ? 'bg-gray-300' : 'bg-gray-500 hover:bg-gray-700'
                    } text-white font-bold py-2 px-4 rounded`}
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
            <div className="relative animate-slideDown bg-white rounded-lg shadow-xl p-4 sm:p-8 max-w-md w-full m-4">
              <button
                onClick={() => !isLoading && setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {/* <span className="text-2xl">&times;</span> */}
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
                    className={`${
                      isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-700'
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center`}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      createQuestions();
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      'Tạo câu hỏi'
                    )}
                  </button>
                  <button
                    className={`${
                      isLoading ? 'bg-gray-300' : 'bg-gray-500 hover:bg-gray-700'
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                    type="button"
                    onClick={() => !isLoading && setShowModal(false)}
                    disabled={isLoading}
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
        <div key={soloList.id} id="questionnaire" className="w-full max-w-4xl mx-auto p-3 md:p-6 bg-white rounded-lg shadow-sm mb-4">
          <ul className="space-y-4">
            <li className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 pb-3 border-b">
              <div className="flex flex-1 items-center gap-3">
                <div className="text-sm md:text-base font-medium">
                  Câu {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Điểm:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={soloList.score || 0}
                    onChange={(event) => handleScoreChange(event, index)}
                  />
                </div>
                <select
                  value={soloList.type}
                  className="px-3 py-1.5 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => handleQuestionTypeChange(event, index)}
                >
                  <option value="mcq">Trắc nghiệm</option>
                  <option value="truefalse">Đúng/Sai</option>
                  <option value="shortanswer">Trả lời ngắn</option>
                </select>
                <button 
                  className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                  onClick={() => handleRemoveQuest(index)}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </li>            

            <li className="flex flex-row md:flex-row gap-3">
              <input
                type="text"
                placeholder={`Câu hỏi ${index + 1}`}
                className="flex-1 px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={soloList.question}
                onChange={(event) => questChangeHandler(event, index, "question")}
              />
            </li>

            {soloList.type === "mcq" && (
              <li className="space-y-3">
                {optionList[index].map((soloOption, ind) => (
                  <div key={soloOption.id} className="flex flex-row md:flex-row items-start md:items-center gap-2">
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Phương án ${String.fromCharCode(65 + ind)}`}
                        value={soloOption.option}
                        onChange={(event) => optionChangeHandler(event, index, ind)}
                      />
                      <input
                        type="radio"
                        name={`correctOption-${index}`}
                        checked={list[index].answer === ind}
                        onChange={(event) => handleCorrectOptionChange(event, index, ind)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      {optionList[index].length > 2 && (
                        <button 
                        className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors  "
                        onClick={() => handleRemoveOpt(index, ind)}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    )}
                    </div>
                  </div>
                ))}
              </li>
        )}

          {soloList.type === "truefalse" &&
            optionList[index].map((soloOption, ind) => (
              <li key={soloOption.id} className="flex flex-row md:flex-row items-start md:items-center gap-3 md:gap-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Ý kiến ${String.fromCharCode(97 + ind)}`}
                  value={soloOption.option}
                  onChange={(event) => optionChangeHandler(event, index, ind)}
                />
                <div className="flex items-center gap-3">
                  <select
                    className="px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={soloOption.answer === null ? "" : soloOption.answer ? "true" : "false"}
                    onChange={(event) => handleCorrectOptionChange(event, index, ind)}
                  >
                    <option value="true">Đúng</option>
                    <option value="false">Sai</option>
                  </select>
                  {optionList[index].length > 2 && (
                        <button 
                        className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors  "
                        onClick={() => handleRemoveOpt(index, ind)}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    )}
                </div>
              </li>
            ))}
            {soloList.type === "shortanswer" && (
              <li className="flex flex-col gap-2">
                <input
                  type="text"
                  className="w-full px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập đáp án..."
                  value={list[index].answer}
                  onChange={(event) => questChangeHandler(event, index, "answer")}
                />
              </li>
            )}
            <li className="pt-3">
              <div className="flex flex-wrap gap-3">
                {(optionList[index].length < 6 && soloList.type !== "shortanswer") && (
                  <button
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={() => handleAddOpt(index, optionList[index].length + 1)}
                  >
                    <CiCirclePlus className="mr-2 text-lg"/>
                    Thêm tùy chọn
                  </button>
                )}
                  <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition-colors">
                    <BiImages className="mr-2 text-lg"/>
                    <span className="whitespace-nowrap">Chọn ảnh</span>
                    <input 
                      type="file" 
                      className="hidden"
                      key={fileInputKeys[index]}
                      data-index={index}
                      onChange={(event) => handleImageChange(event, index)}
                      accept="image/*"
                    />
                  </label>
              </div>
              {imagePreview[index] && (
                <div className="mt-4 md:mt-6">
                  <div className="relative group">
                    <img 
                      src={imagePreview[index]} 
                      alt="Preview" 
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105" 
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full transition-opacity duration-200 hover:bg-red-600 z-10"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg" />
                  </div>
                </div>
              )}              
              </li>
          </ul>
        </div>
      ))}
      <button
        className="mx-5 mb-2 px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        onClick={() => handleAddQuest()}
      >
        <AiOutlineQuestionCircle className="inline mr-2"/>
        Thêm câu hỏi
      </button>
      <div className="mt-4 flex items-center justify-center">
        <label className="mr-2">Thời gian làm bài (phút):</label>
        <input 
          type="number"
          min="1"
          // max="180"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-20 px-2 py-1 border rounded"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 justify-center">
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
  // </MathJaxContext>
  );
}

export default FormMaker;
