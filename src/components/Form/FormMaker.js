import { useEffect, useState } from "react";
import { default as db, storage } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore/lite";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdCloudUpload } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { TbMatrix } from "react-icons/tb";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import mammoth from 'mammoth';
import QuestionItem from './QuestionItem';
import FileUploadModal from './FileUploadModal';
import MatrixUploadModal from './MatrixUploadModal';
import QuestionGeneratorModal from './QuestionGeneratorModal';
import { extractQuestionsJSON, matrixQuestionsJSON, createQuestionsJSON } from '../AI/AIService';
import { MathJax } from 'better-react-mathjax';
import QuizPreview from './QuizPreview';
import { parseQuizText } from '../../utils/quizParser';

function FormMaker({ isEditing = false, initialData = null, onSubmit: customSubmit }) {
  const [quizTitle, setQuizTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [list, setList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState({
    mcq: { count: 0, totalScore: 1.0 },
    truefalse: { count: 0, totalScore: 1.0 },
    shortanswer: { count: 0, totalScore: 1.0 }
  });
  const [quickScore, setQuickScore] = useState({
    mcq: 0.25,
    truefalse: 0.5,
    shortanswer: 1.0
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(Array(list.length).fill(null));
  const [fileInputKeys, setFileInputKeys] = useState(Array(list.length).fill(0));
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [rawText, setRawText] = useState('');
  const [showEquationModal, setShowEquationModal] = useState(false);
  const [equationText, setEquationText] = useState('');
  const [equationType, setEquationType] = useState('inline'); // 'inline' or 'block'
  const textareaRef = React.useRef(null);

  // Create refs for the number inputs
  const mcqRef = React.useRef(null);
  const trueFalseRef = React.useRef(null);
  const shortAnswerRef = React.useRef(null);

  useEffect(() => {}, [optionList]);

  // Debounce effect for parsing raw text
  useEffect(() => {
    if (rawText.trim()) {
      const timeoutId = setTimeout(() => {
        try {
          const { list: parsedList, optionList: parsedOptionList } = parseQuizText(rawText);
          setList(parsedList);
          setOptionList(parsedOptionList);
        } catch (error) {
          console.error('Error parsing quiz text:', error);
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // Clear questions if text is empty
      setList([]);
      setOptionList([]);
    }
  }, [rawText]);

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
    setList([...list, { id: uuid(), question: "", answer: "", type: "mcq", score: 0.25 }]);
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
    // Count actual questions (excluding text blocks)
    const questionCount = list.filter(q => q.type !== 'textblock').length;
    if(questionCount === 0) { 
      alert("Vui lòng thêm ít nhất một câu hỏi vào bài thi.");
      return false;
    }
    // Validate each question and its options
    for (let i = 0; i < list.length; i++) {
      const question = list[i];
      const options = optionList[i];

      // Skip text blocks - they don't need validation
      if (question.type === "textblock") {
        continue;
      }

      // Check if the question text is not empty
      if (!question.question || question.question.trim() === "") {
        alert(`Câu hỏi ${i + 1} không được để trống.`);
        return false;
      }

      // Check if an answer is selected
      if (
        (question.type === "mcq" && (question.answer === "" || question.answer === null)) ||
        (question.type === "truefalse" && 
           options.some(opt => typeof opt.answer !== "boolean") 
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
        // Check if answer is an array with at least one valid answer
        const answers = Array.isArray(question.answer) ? question.answer : [question.answer].filter(a => a);
        if (!answers || answers.length === 0 || (answers.length === 1 && typeof answers[0] === 'string' && answers[0].trim() === "")) {
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
      // Filter out text blocks
      const questionQuestions = list
        .filter(question => question.type !== "textblock")
        .map((question, index) => {
          const originalIndex = list.indexOf(question);
          return {
            question: question.question.trim(),
            options: optionList[originalIndex].map(option => ({
              option: option.option.trim(),
              optionNo: option.optionNo
            })),
            type: question.type,
            score: question.score || 0.25
          };
        });

      const answerAnswers = list
        .filter(question => question.type !== "textblock")
        .map((question, index) => {
          const originalIndex = list.indexOf(question);
          return {
            answer: question.type === "mcq" ? question.answer 
              : question.type === "truefalse" ? optionList[originalIndex].map(opt => opt.answer)
              : (Array.isArray(question.answer) 
                  ? question.answer.map(a => typeof a === 'string' ? a.trim() : a).filter(a => a)
                  : (typeof question.answer === 'string' ? [question.answer.trim()].filter(a => a) : []))
          };
        });

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
          // Skip text blocks - they don't have images
          if (question.type === "textblock") {
            return null;
          }
          
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
      // Filter out text blocks and map to questions only
      const questionQuestions = list
        .filter(question => question.type !== "textblock")
        .map((question, mappedIndex) => {
          const originalIndex = list.indexOf(question);
          let options = [];
          if(question.type !== "shortanswer") {
            options = optionList[originalIndex].filter(option => option.option && option.optionNo);
          }
          
          return {
            question: question.question.trim(),
            options: options.map(option => ({ option: option.option.trim(), optionNo: option.optionNo })),
            type: question.type,
            imageUrl: imageUploads[originalIndex], // Add image URL to question data
            score: question.score || 0.25
          };
        });

      const answerAnswers = list
        .filter(question => question.type !== "textblock")
        .map((question, mappedIndex) => {
          const originalIndex = list.indexOf(question);
          if (question.type === "mcq") {
            return { answer: question.answer };
          } else if (question.type === "truefalse") {
            return { answer: optionList[originalIndex].map(option => option.answer) };
          } else if (question.type === "shortanswer") {
            // Ensure answer is always an array for short answer
            const answers = Array.isArray(question.answer) 
              ? question.answer.map(a => typeof a === 'string' ? a.trim() : a).filter(a => a)
              : (typeof question.answer === 'string' ? [question.answer.trim()].filter(a => a) : []);
            return { answer: answers };
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
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBha8XFvoYiAXXHYPjPIAwBwlkqNpq4m9w"; 
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

  async function extractQuestions() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file === undefined) {
      alert("Vui lòng chọn file trước.");
      return;
    }
    setIsLoading(true);
    try {
      const prompt = `Phân tích nội dung file được cung cấp. Trích xuất tất cả các câu hỏi thuộc loại trắc nghiệm (MCQ), đúng/sai (True/False), và trả lời ngắn (Short Answer) cùng với các đáp án được chỉ định cho chúng trong file.

**YÊU CẦU OUTPUT TEXT FORMAT:**

Bạn phải trả về kết quả theo định dạng text sau đây (KHÔNG phải JSON):

**QUAN TRỌNG: Thứ tự trích xuất câu hỏi:**
1. Trích xuất TẤT CẢ các câu MCQ trước (Câu 1, Câu 2, ...)
2. Sau đó trích xuất TẤT CẢ các câu True/False (tiếp tục số thứ tự)
3. Cuối cùng trích xuất TẤT CẢ các câu Short Answer (tiếp tục số thứ tự)

**QUAN TRỌNG: Quy tắc trích xuất đáp án:**
CHỈ trích xuất đáp án khi có DẤU HIỆU RÕ RÀNG trong file:
1. **Bảng đáp án**: Có phần "Bảng đáp án", "BẢNG ĐÁP ÁN", "ANSWER KEY" với đáp án được liệt kê
2. **Ghi đáp án**: Có văn bản rõ ràng chỉ định đáp án (ví dụ: "Đáp án: A", "Câu trả lời: B", "Answer: C")
3. **Gạch chân**: Có phương án được gạch chân (underline)
4. **Tô màu**: Có phương án được tô màu khác biệt so với văn bản thường
5. **Đánh dấu * trong nội dung**: Có dấu * trước phương án đúng trong nội dung câu hỏi (ví dụ: *A. hoặc *a))

**TUYỆT ĐỐI KHÔNG:**
- Tự động tạo đáp án nếu không có dấu hiệu rõ ràng
- Đoán đáp án dựa trên nội dung câu hỏi
- Tạo đáp án dựa trên logic hoặc kiến thức

**Định dạng cho câu hỏi trắc nghiệm (MCQ):**
Câu [số]. [Nội dung câu hỏi]
[Đánh dấu * chỉ nếu có dấu hiệu rõ ràng trong file][Đáp án đúng]. [Nội dung lựa chọn đúng] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn]

Ví dụ (có đáp án):
Câu 1. Trường hợp nào dưới đây không dẫn điện được?
*A. Dung dịch NaOH B. CaCl2 nóng chảy C. Dung dịch HBr D. KCl rắn, khan

Ví dụ (không có đáp án):
Câu 1. Trường hợp nào dưới đây không dẫn điện được?
A. Dung dịch NaOH B. CaCl2 nóng chảy C. Dung dịch HBr D. KCl rắn, khan

**Định dạng cho câu hỏi đúng/sai (True/False):**
Câu [số]. [Câu dẫn chung (nếu có)]
[Đánh dấu * chỉ nếu có dấu hiệu rõ ràng trong file][Đáp án đúng]) [Mệnh đề 1] [Đáp án sai]) [Mệnh đề 2] [Đáp án sai]) [Mệnh đề 3] [Đáp án sai]) [Mệnh đề 4]

**Định dạng cho câu hỏi trả lời ngắn (Short Answer):**
Câu [số]. [Nội dung câu hỏi]

**Bảng đáp án:**
Sau tất cả các câu hỏi, thêm dòng:
---------------------------HẾT------------------------

Bảng đáp án
[CHỈ thêm đáp án cho các câu hỏi có dấu hiệu rõ ràng trong file - theo thứ tự: MCQ trước, True/False sau, Short Answer cuối]
**QUAN TRỌNG:** 
- Chỉ thêm đáp án vào bảng đáp án nếu có dấu hiệu rõ ràng trong file (bảng đáp án, ghi đáp án, gạch chân, tô màu, hoặc dấu *)
- Nếu một câu hỏi KHÔNG có dấu hiệu đáp án trong file, KHÔNG thêm đáp án cho câu đó vào bảng đáp án
- KHÔNG tự động tạo đáp án

Ví dụ (có đáp án):
Bảng đáp án
1A 2B 3C
Câu 4: a)Đ b)S c)S d)Đ
Câu 5: a)Đ b)S c)S d)S
Câu 6: on | On | ON

Ví dụ (một số câu không có đáp án):
Bảng đáp án
1A 2B
Câu 4: a)Đ b)S c)S d)Đ
(Câu 3 và Câu 5, 6 không có đáp án trong file nên không có trong bảng đáp án)

**QUY TẮC:**
- Chỉ trích xuất các câu hỏi có cấu trúc rõ ràng
- Giữ nguyên ngôn ngữ gốc của văn bản
- Chuyển đổi công thức toán học sang định dạng LaTeX với MathJax: \\( ... \\) (inline) và \\[ ... \\] (display)
- Loại bỏ các thẻ HTML
- Đối với MCQ: Đánh dấu đáp án đúng bằng dấu * trước chữ cái (ví dụ: *A.) - CHỈ nếu có dấu hiệu rõ ràng trong file
- Đối với True/False: Đánh dấu mệnh đề đúng bằng dấu * trước chữ cái (ví dụ: *a)) - CHỈ nếu có dấu hiệu rõ ràng trong file
- Đối với Short Answer: Nếu có nhiều đáp án hợp lệ, phân cách bằng dấu | trong bảng đáp án (ví dụ: on | On | ON) - CHỈ nếu có dấu hiệu rõ ràng trong file
- Trong bảng đáp án, True/False: dùng Đ cho đúng, S cho sai (ví dụ: a)Đ b)S) - CHỈ nếu có dấu hiệu rõ ràng
- Trong bảng đáp án, MCQ: dùng số câu + chữ cái (ví dụ: 1A 2B) - CHỈ nếu có dấu hiệu rõ ràng
- Trong bảng đáp án, Short Answer: dùng "Câu [số]: [đáp án]" (ví dụ: Câu 6: on | On | ON) - CHỈ nếu có dấu hiệu rõ ràng
- **THỨ TỰ BẮT BUỘC:** MCQ → True/False → Short Answer (theo số thứ tự liên tục)
- **KHÔNG TỰ ĐỘNG TẠO ĐÁP ÁN:** Nếu không có dấu hiệu rõ ràng về đáp án trong file, KHÔNG thêm đáp án cho câu đó vào bảng đáp án và KHÔNG đánh dấu * trong nội dung câu hỏi

Chỉ trả về text theo định dạng trên, không có giải thích hay văn bản thừa nào khác.`;

      const ketQua = await extractQuestionsJSON(file, prompt);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        console.log("ketQua", ketQua);
        // AI now returns text format directly, append to rawText
        setRawText(prev => {
          if (prev.trim()) {
            return prev + '\n\n' + ketQua.trim();
          }
          return ketQua.trim();
        });
        // Thêm tên file vào tiêu đề nếu tiêu đề đang trống
        if (!quizTitle.trim()) {
          setQuizTitle(file.name.replace(/\.[^/.]+$/, "")); // Xóa phần mở rộng file
        }
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
      const prompt = `Nhiệm vụ: Phân tích kỹ lưỡng nội dung file ma trận/đặc tả/đề cương được cung cấp và TẠO RA các câu hỏi thuộc dạng trắc nghiệm (MCQ), đúng/sai (True/False), và trả lời ngắn (Short Answer) cùng với đáp án chính xác dựa trên nội dung đó.

**YÊU CẦU OUTPUT TEXT FORMAT:**

Bạn phải trả về kết quả theo định dạng text sau đây (KHÔNG phải JSON):

**QUAN TRỌNG: Thứ tự tạo câu hỏi:**
1. Tạo TẤT CẢ các câu MCQ trước (Câu 1, Câu 2, ...)
2. Sau đó tạo TẤT CẢ các câu True/False (tiếp tục số thứ tự)
3. Cuối cùng tạo TẤT CẢ các câu Short Answer (tiếp tục số thứ tự)

**Định dạng cho câu hỏi trắc nghiệm (MCQ):**
Câu [số]. [Nội dung câu hỏi]
*[Đáp án đúng]. [Nội dung lựa chọn đúng] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn]

**Định dạng cho câu hỏi đúng/sai (True/False):**
Câu [số]. [Câu dẫn chung (nếu có)]
*[Đáp án đúng]) [Mệnh đề 1] [Đáp án sai]) [Mệnh đề 2] [Đáp án sai]) [Mệnh đề 3] [Đáp án sai]) [Mệnh đề 4]

**Định dạng cho câu hỏi trả lời ngắn (Short Answer):**
Câu [số]. [Nội dung câu hỏi]

**Bảng đáp án:**
Sau tất cả các câu hỏi, thêm:
---------------------------HẾT------------------------

Bảng đáp án
[Định dạng đáp án - theo thứ tự: MCQ trước, True/False sau, Short Answer cuối]
**QUAN TRỌNG:** Tất cả các câu hỏi được tạo ra PHẢI có đáp án. Mỗi câu hỏi phải có đáp án tương ứng trong bảng đáp án.

**QUY TẮC:**
- Nội dung, số lượng, và độ khó của các câu hỏi phải bám sát chặt chẽ các chủ đề, mục tiêu học tập, và phân bố được nêu trong file
- MCQ: Tạo đúng 4 lựa chọn, một đúng ba sai (nhiễu)
- True/False: Tạo đúng 4 mệnh đề cần đánh giá Đúng/Sai
- Short Answer: Đáp án ngắn gọn, có thể là giá trị số hoặc thuật ngữ
- Chuyển đổi công thức toán học sang LaTeX với MathJax: \\( ... \\) (inline) và \\[ ... \\] (display)
- Loại bỏ mọi thẻ HTML
- Đánh dấu đáp án đúng bằng dấu * trước chữ cái (ví dụ: *A. hoặc *a))
- Trong bảng đáp án: MCQ dùng "số câu + chữ cái" (ví dụ: 1A 2B), True/False dùng "Câu [số]: a)Đ b)S c)S d)Đ", Short Answer dùng "Câu [số]: [đáp án]" hoặc "Câu [số]: [đáp án1] | [đáp án2]" nếu có nhiều đáp án hợp lệ
- **THỨ TỰ BẮT BUỘC:** MCQ → True/False → Short Answer (theo số thứ tự liên tục)
- **TẤT CẢ CÂU HỎI PHẢI CÓ ĐÁP ÁN:** Mỗi câu hỏi được tạo ra phải có đáp án tương ứng trong bảng đáp án

Chỉ trả về text theo định dạng trên, không có giải thích hay văn bản thừa nào khác.`;

      const ketQua = await matrixQuestionsJSON(file, prompt);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        // AI now returns text format directly, append to rawText
        setRawText(prev => {
          if (prev.trim()) {
            return prev + '\n\n' + ketQua.trim();
          }
          return ketQua.trim();
        });
      }
    } catch (error) {
      console.error("Error extracting questions:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowMatrixModal(false);
    }
  }

  async function createQuestions() {
    setIsLoading(true);
    try {
      const mcqCount = mcqRef.current.value || 0;
      const trueFalseCount = trueFalseRef.current.value || 0;
      const shortAnswerCount = shortAnswerRef.current.value || 0;

      const currentQuestions = serializeCurrentQuestions();

      const prompt = `Nhiệm vụ: Phân tích kỹ lưỡng bộ câu hỏi hiện tại được cung cấp. Dựa trên chủ đề, phong cách, độ khó và cấu trúc của các câu hỏi đó, TẠO RA các câu hỏi MỚI và TƯƠNG TỰ thuộc các dạng trắc nghiệm (MCQ), đúng/sai (True/False), và trả lời ngắn (Short Answer) cùng với đáp án chính xác.

**Đầu vào (các câu hỏi hiện tại để tham khảo):**
${currentQuestions}

**Yêu cầu Số lượng Đầu ra:**
- Số câu MCQ mới cần tạo: ${mcqCount}
- Số câu True/False mới cần tạo: ${trueFalseCount}
- Số câu Short Answer mới cần tạo: ${shortAnswerCount}

**YÊU CẦU OUTPUT TEXT FORMAT:**

Bạn phải trả về kết quả theo định dạng text sau đây (KHÔNG phải JSON):

**QUAN TRỌNG: Thứ tự tạo câu hỏi:**
1. Tạo TẤT CẢ các câu MCQ trước (Câu 1, Câu 2, ...)
2. Sau đó tạo TẤT CẢ các câu True/False (tiếp tục số thứ tự)
3. Cuối cùng tạo TẤT CẢ các câu Short Answer (tiếp tục số thứ tự)

**Định dạng cho câu hỏi trắc nghiệm (MCQ):**
Câu [số]. [Nội dung câu hỏi]
*[Đáp án đúng]. [Nội dung lựa chọn đúng] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn]

**Định dạng cho câu hỏi đúng/sai (True/False):**
Câu [số]. [Câu dẫn chung (nếu có)]
*[Đáp án đúng]) [Mệnh đề 1] [Đáp án sai]) [Mệnh đề 2] [Đáp án sai]) [Mệnh đề 3] [Đáp án sai]) [Mệnh đề 4]

**Định dạng cho câu hỏi trả lời ngắn (Short Answer):**
Câu [số]. [Nội dung câu hỏi]

**Bảng đáp án:**
Sau tất cả các câu hỏi, thêm:
---------------------------HẾT------------------------

Bảng đáp án
[Định dạng đáp án - theo thứ tự: MCQ trước, True/False sau, Short Answer cuối]
**QUAN TRỌNG:** Tất cả các câu hỏi được tạo ra PHẢI có đáp án. Mỗi câu hỏi phải có đáp án tương ứng trong bảng đáp án.

**QUY TẮC:**
- Các câu hỏi tạo ra KHÔNG ĐƯỢC TRÙNG LẶP với bất kỳ câu hỏi nào trong đầu vào
- Phải tương tự về chủ đề, lĩnh vực kiến thức, kiểu câu hỏi, và mức độ phức tạp so với các câu hỏi đầu vào
- MCQ: Tạo đúng 4 lựa chọn, một đúng ba sai (nhiễu)
- True/False: Tạo đúng 4 mệnh đề cần đánh giá Đúng/Sai
- Tạo các câu hỏi bằng Tiếng Việt, rõ ràng, dễ hiểu
- Chuyển đổi công thức toán học sang LaTeX với MathJax: \\( ... \\) (inline) và \\[ ... \\] (display)
- Loại bỏ mọi thẻ HTML
- Đánh dấu đáp án đúng bằng dấu * trước chữ cái (ví dụ: *A. hoặc *a))
- Trong bảng đáp án: MCQ dùng "số câu + chữ cái" (ví dụ: 1A 2B), True/False dùng "Câu [số]: a)Đ b)S c)S d)Đ", Short Answer dùng "Câu [số]: [đáp án]"
- **THỨ TỰ BẮT BUỘC:** MCQ → True/False → Short Answer (theo số thứ tự liên tục)
- **TẤT CẢ CÂU HỎI PHẢI CÓ ĐÁP ÁN:** Mỗi câu hỏi được tạo ra phải có đáp án tương ứng trong bảng đáp án

Chỉ trả về text theo định dạng trên, không có giải thích hay văn bản thừa nào khác.`;

      const ketQua = await createQuestionsJSON(prompt);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        // AI now returns text format directly, append to rawText
        setRawText(prev => {
          if (prev.trim()) {
            return prev + '\n\n' + ketQua.trim();
          }
          return ketQua.trim();
        });
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

  function convertAnswers(dataArray) {
    // Helper to convert letter to index
    const letterToIndex = (letter) => {
      if (typeof letter !== 'string') {
        console.warn(`Answer must be a string. Received type: ${typeof letter}.`);
        return null; // Return null instead of default
      }
      const upperLetter = letter.toUpperCase();
      const index = upperLetter.charCodeAt(0) - 65; // 'A' is 65 in ASCII
      if (index < 0 || index >= 26) {
        console.warn(`Invalid answer letter: "${letter}".`);
        return null; // Return null instead of default
      }
      return index;
    };

    // Process each question
    const convertedData = dataArray.map((question, qIndex) => {
      // Create a new question object with defaults for missing fields
      const processedQuestion = {
        question: question.question || "",
        type: question.type || "mcq",
        score: question.score || (
          question.type === "shortanswer" ? 0.5 : 
          question.type === "truefalse" ? 1.0 : 0.25
        )
      };

      // Handle options if missing
      if (Array.isArray(question.options)) {
        processedQuestion.options = question.options;
      } else if (question.type !== "shortanswer") {
        // Default options for non-shortanswer questions
        processedQuestion.options = question.type === "truefalse" ? 
          ["True", "False"] : 
          ["Option A", "Option B", "Option C", "Option D"];
      }

      // Handle answers based on question type
      if (question.type === "mcq") {
        // Only set answer if it exists in the original data
        if (question.answer) {
          processedQuestion.answer = letterToIndex(question.answer);
        }
      } else if (question.type === "truefalse") {
        // Only set answer if it exists in the original data
        if (Array.isArray(question.answer)) {
          processedQuestion.answer = question.answer;
        }
      } else if (question.type === "shortanswer") {
        // Only set answer if it exists in the original data
        if (question.answer) {
          processedQuestion.answer = question.answer;
        }
      }

      // Copy any other fields from the original question
      return { ...question, ...processedQuestion };
    });

    return convertedData;
  }

  // Serialize current questions and options to JSON format for AI
  function serializeCurrentQuestions() {
    const questions = list.filter(q => q.type !== 'textblock');
    
    return JSON.stringify(questions.map((question, index) => {
      const qIndex = list.findIndex(q => q.id === question.id);
      const options = optionList[qIndex] || [];
      
      const serialized = {
        question: question.question || "",
        type: question.type || "mcq"
      };
      
      if (question.type === "mcq" && options.length > 0) {
        serialized.options = options.map(opt => opt.option || "");
        serialized.answer = String.fromCharCode(65 + (question.answer || 0));
      } else if (question.type === "truefalse" && options.length > 0) {
        serialized.options = options.map(opt => opt.option || "");
        serialized.answer = options.map(opt => opt.answer === true);
      } else if (question.type === "shortanswer") {
        const answer = question.answer;
        if (Array.isArray(answer) && answer.length > 0) {
          serialized.answer = answer[0]; // Use first answer for serialization
        } else if (typeof answer === 'string') {
          serialized.answer = answer;
        }
      }
      
      return serialized;
    }), null, 2);
  }

  function validateQuestionsArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      throw new Error("Data is not an array.");
    }

    return dataArray.map((q, index) => {
      // Create a new question object with necessary properties
      const validatedQuestion = { ...q };

      // Check and set question text
      if (typeof q.question !== 'string' || q.question.trim() === "") {
        console.warn(`Question text missing or invalid at index ${index}, setting to empty string.`);
        validatedQuestion.question = "";
      }

      // Check and set question type
      if (typeof q.type !== 'string' || !["mcq", "truefalse", "shortanswer"].includes(q.type)) {
        console.warn(`Invalid or unsupported question type at index ${index}, defaulting to mcq.`);
        validatedQuestion.type = "mcq";
      }

      // Handle based on question type
      if (validatedQuestion.type === "mcq") {
        // Check answer format for MCQ
        if (typeof q.answer !== 'string' || !/^[A-Z]$/.test(q.answer?.toUpperCase())) {
          console.warn(`Invalid answer format for MCQ at index ${index}, setting to null.`);
          validatedQuestion.answer = null;
        }
        
        // Check options for MCQ
        if (!Array.isArray(q.options) || q.options.length < 2) {
          console.warn(`Insufficient options for MCQ at index ${index}, creating default options.`);
          validatedQuestion.options = ["Option A", "Option B", "Option C", "Option D"];
        }
      } else if (validatedQuestion.type === "truefalse") {
        // Check answer format for true/false
        if (!Array.isArray(q.answer)) {
          console.warn(`Invalid answer format for true/false at index ${index}, setting to null.`);
          validatedQuestion.answer = null;
        }
        
        // Check options for true/false
        if (!Array.isArray(q.options)) {
          console.warn(`Missing options for true/false at index ${index}, creating default options.`);
          validatedQuestion.options = ["Statement 1", "Statement 2"];
        }
      } else if (validatedQuestion.type === "shortanswer") {
        // Check answer for shortanswer
        if (typeof q.answer !== 'string') {
          console.warn(`Invalid answer for shortanswer at index ${index}, setting to null.`);
          validatedQuestion.answer = null;
        }
      }

      return validatedQuestion;
    });
  }

  // Convert JSON questions to text format for textarea
  function convertJSONToTextFormat(jsonData) {
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return '';
    }

    let contentText = '';
    let answerKeyText = '\n\n---------------------------HẾT------------------------\n\nBảng đáp án\n';
    
    // Get current question count from parsed list
    const currentQuestionCount = list.filter(q => q.type !== 'textblock').length;
    let questionNumber = currentQuestionCount + 1;

    jsonData.forEach((q, index) => {
      const question = typeof q.question === 'string' ? q.question.trim() : "";
      const type = typeof q.type === 'string' && ["mcq", "truefalse", "shortanswer"].includes(q.type) ? q.type : "mcq";
      
      if (!question) return; // Skip empty questions

      // Add question header
      contentText += `Câu ${questionNumber}. ${question}\n`;

      // Add options based on type
      if (type === "mcq" && Array.isArray(q.options) && q.options.length > 0) {
        // MCQ format: A. option1 B. option2 C. option3 D. option4
        const options = q.options;
        const answerLetter = typeof q.answer === 'string' ? q.answer.toUpperCase() : '';
        
        let optionsText = '';
        options.forEach((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D...
          const optionText = typeof opt === 'string' ? opt.trim() : '';
          if (optionText) {
            const isCorrect = letter === answerLetter;
            optionsText += `${isCorrect ? '*' : ''}${letter}. ${optionText}`;
            if (idx < options.length - 1) {
              optionsText += ' ';
            }
          }
        });
        
        contentText += optionsText + '\n\n';
        
        // Add to answer key
        if (answerLetter) {
          answerKeyText += `${questionNumber}${answerLetter} `;
        }
        
      } else if (type === "truefalse" && Array.isArray(q.options) && q.options.length > 0) {
        // True/False format: a) statement1 b) statement2 c) statement3 d) statement4
        const options = q.options;
        const answers = Array.isArray(q.answer) ? q.answer : [];
        
        let optionsText = '';
        const answerKeyAnswers = [];
        
        options.forEach((opt, idx) => {
          const letter = String.fromCharCode(97 + idx); // a, b, c, d...
          const optionText = typeof opt === 'string' ? opt.trim() : '';
          if (optionText) {
            const isCorrect = idx < answers.length && answers[idx] === true;
            optionsText += `${isCorrect ? '*' : ''}${letter}) ${optionText}`;
            if (idx < options.length - 1) {
              optionsText += ' ';
            }
            
            // Add to answer key
            answerKeyAnswers.push(`${letter})${isCorrect ? 'Đ' : 'S'}`);
          }
        });
        
        contentText += optionsText + '\n\n';
        
        // Add to answer key
        if (answerKeyAnswers.length > 0) {
          answerKeyText += `Câu ${questionNumber}: ${answerKeyAnswers.join(' ')}\n`;
        }
        
      } else if (type === "shortanswer") {
        // Short Answer format: just question text
        contentText += '\n';
        
        // Add to answer key
        if (typeof q.answer === 'string' && q.answer.trim()) {
          answerKeyText += `Câu ${questionNumber}: ${q.answer.trim()}\n`;
        } else if (Array.isArray(q.answer) && q.answer.length > 0) {
          // Multiple valid answers separated by |
          const validAnswers = q.answer.map(a => typeof a === 'string' ? a.trim() : String(a)).filter(a => a);
          if (validAnswers.length > 0) {
            answerKeyText += `Câu ${questionNumber}: ${validAnswers.join(' | ')}\n`;
          }
        }
      }

      questionNumber++;
    });

    return contentText + answerKeyText;
  }

  function addQuestionsFromJSON(jsonData) {
    try {
      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid JSON format: Expected an array of questions.");
      }
      
      // Convert JSON to text format and append to rawText
      const textFormat = convertJSONToTextFormat(jsonData);
      if (textFormat) {
        // Append to existing rawText (add newline if rawText is not empty)
        setRawText(prev => {
          if (prev.trim()) {
            return prev + '\n\n' + textFormat;
          }
          return textFormat;
        });
      }
      
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

  // Add new handler for score changes
  function handleScoreChange(event, index) {
    let values = [...list];
    const score = parseFloat(event.target.value) || 0;
    values[index].score = score;
    setList(values);
  };
  
  // Thêm hàm tính toán phân bố điểm
  const calculateScoreDistribution = (questions) => {
    const distribution = {
      mcq: { count: 0, totalScore: 0 },
      truefalse: { count: 0, totalScore: 0 },
      shortanswer: { count: 0, totalScore: 0 }
    };

    questions.forEach(question => {
      // Skip text blocks when calculating distribution
      if (question.type === 'textblock') {
        return;
      }
      if (distribution[question.type]) {
        distribution[question.type].count++;
        distribution[question.type].totalScore += question.score || 0;
      }
    });

    return distribution;
  };

  // Thêm hàm cập nhật điểm số
  const updateQuestionScores = (questions, distribution) => {
    return questions.map(question => {
      // Skip text blocks - they don't have scores
      if (question.type === 'textblock') {
        return question;
      }
      
      const type = question.type;
      if (!distribution[type]) {
        return question;
      }
      
      const count = distribution[type].count;
      const totalTypeScore = distribution[type].totalScore;
      
      // Tính điểm mới cho mỗi câu hỏi
      const newScore = count > 0 ? (totalTypeScore / count) : 0;
      
      return {
        ...question,
        score: parseFloat(newScore.toFixed(2))
      };
    });
  };

  // Cập nhật useEffect để tính toán điểm số
  useEffect(() => {
    if (list.length > 0) {
      const newDistribution = calculateScoreDistribution(list);
      setScoreDistribution(newDistribution);
      
      // Cập nhật điểm số cho từng câu hỏi
      const updatedQuestions = updateQuestionScores(list, newDistribution);
      setList(updatedQuestions);
    }
  }, [list.length]);

  // Thêm hàm xử lý thay đổi điểm cho từng loại câu hỏi
  const handleTypeScoreChange = (type, event) => {
    const newTotalScore = parseFloat(event.target.value) || 0;
    const count = scoreDistribution[type].count;
    
    // Cập nhật tổng điểm cho loại câu hỏi
    setScoreDistribution(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        totalScore: newTotalScore
      }
    }));
    
    // Tính điểm cho mỗi câu hỏi
    const scorePerQuestion = count > 0 ? (newTotalScore / count) : 0;
    
    // Cập nhật điểm cho tất cả câu hỏi cùng loại
    const updatedQuestions = list.map(question => {
      if (question.type === type) {
        return {
          ...question,
          score: parseFloat(scorePerQuestion.toFixed(2))
        };
      }
      return question;
    });
    
    setList(updatedQuestions);
  };

  // Thêm hàm xử lý chia điểm nhanh
  const handleQuickScoreChange = (type, event) => {
    const newScore = parseFloat(event.target.value) || 0;
    setQuickScore(prev => ({
      ...prev,
      [type]: newScore
    }));
    
    // Cập nhật điểm số cho tất cả câu hỏi cùng loại
    const updatedQuestions = list.map(question => {
      if (question.type === type) {
        return {
          ...question,
          score: newScore
        };
      }
      return question;
    });
    
    setList(updatedQuestions);
    
    // Cập nhật tổng điểm cho loại câu hỏi
    const count = scoreDistribution[type].count;
    setScoreDistribution(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        totalScore: newScore * count
      }
    }));
  };

  // Cập nhật lại UI hiển thị phân bố điểm
  const renderScoreDistribution = () => (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Phân bố điểm</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Trắc nghiệm ({scoreDistribution.mcq.count} câu):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.25"
              value={scoreDistribution.mcq.totalScore ?? 0}
              onChange={(e) => handleTypeScoreChange('mcq', e)}
              className="w-24 px-2 py-1 border rounded"
              placeholder="Tổng điểm"
            />
            <span className="text-sm text-gray-600">
              {scoreDistribution.mcq.count > 0 ? 
                `Điểm/câu: ${(scoreDistribution.mcq.totalScore / scoreDistribution.mcq.count).toFixed(2)}` 
                : 'Chưa có câu hỏi'}
            </span>
          </div>
        </div>
        <div>
          <label className="block mb-2">Đúng/Sai ({scoreDistribution.truefalse.count} câu):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.25"
              value={scoreDistribution.truefalse.totalScore ?? 0}
              onChange={(e) => handleTypeScoreChange('truefalse', e)}
              className="w-24 px-2 py-1 border rounded"
              placeholder="Tổng điểm"
            />
            <span className="text-sm text-gray-600">
              {scoreDistribution.truefalse.count > 0 ? 
                `Điểm/câu: ${(scoreDistribution.truefalse.totalScore / scoreDistribution.truefalse.count).toFixed(2)}` 
                : 'Chưa có câu hỏi'}
            </span>
          </div>
        </div>
        <div>
          <label className="block mb-2">Trả lời ngắn ({scoreDistribution.shortanswer.count} câu):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.25"
              value={scoreDistribution.shortanswer.totalScore ?? 0}
              onChange={(e) => handleTypeScoreChange('shortanswer', e)}
              className="w-24 px-2 py-1 border rounded"
              placeholder="Tổng điểm"
            />
            <span className="text-sm text-gray-600">
              {scoreDistribution.shortanswer.count > 0 ? 
                `Điểm/câu: ${(scoreDistribution.shortanswer.totalScore / scoreDistribution.shortanswer.count).toFixed(2)}` 
                : 'Chưa có câu hỏi'}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-right">
        <span className="text-sm font-medium">
          Tổng điểm: {
            (scoreDistribution.mcq.totalScore +
            scoreDistribution.truefalse.totalScore +
            scoreDistribution.shortanswer.totalScore).toFixed(2)
          }
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 pb-20">
      {/* Left Panel: Text Input */}
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-white">
          <input
            type="text"
            className="quiz_title shadow shadow-slate-300 rounded-xl text-lg text-center p-3 sm:p-4 w-full bg-white"
            name="quiz_title"
            id="quiz_title"
            placeholder="Hãy nhập tiêu đề bài thi..."
            value={quizTitle || ''}
            onChange={(event) => setQuizTitle(event.target.value)}
          />
        </div>

        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <button
              className="px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2 text-sm"
              onClick={() => setShowEquationModal(true)}
              title="Chèn phương trình toán học"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="hidden sm:inline">Chèn phương trình</span>
            </button>
          </div>
          <textarea
            ref={textareaRef}
            className="w-full flex-1 p-4 border-2 border-gray-300 rounded-lg shadow-sm font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Dán nội dung đề thi vào đây theo định dạng:

Phần 1. TRẮC NGHIỆM
Câu 1. Câu hỏi...
*A. Đáp án đúng      B. Đáp án sai
C. Đáp án sai        D. Đáp án sai

PHẦN II. Câu trắc nghiệm đúng sai
Câu 4. Câu hỏi...
*a) Mệnh đề đúng
b) Mệnh đề sai

---------------------------HẾT------------------------
Bảng đáp án
1A 2B 3C
Câu 4: a)Đ b)S c)S d)Đ
Câu 6: on | On | ON"
          />
        </div>

      </div>

      {/* Right Panel: Preview */}
      <div className="w-1/2 h-full overflow-hidden">
        <QuizPreview
          quizTitle={quizTitle}
          questions={list}
          options={optionList}
        />
      </div>

      {/* Equation Modal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showEquationModal ? 'block' : 'hidden'}`}>
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-4">Chèn phương trình toán học</h2>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Loại phương trình:</label>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  equationType === 'inline' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setEquationType('inline')}
              >
                Nội dòng (inline)
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  equationType === 'block' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setEquationType('block')}
              >
                Khối (block)
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Nhập công thức LaTeX:</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
              rows={4}
              value={equationText}
              onChange={(e) => setEquationText(e.target.value)}
              placeholder={equationType === 'inline' 
                ? 'Ví dụ: x^2 + y^2 = r^2 hoặc \\frac{a}{b}' 
                : 'Ví dụ: \\int_{0}^{\\infty} e^{-x} dx = 1'}
            />
          </div>

          {equationText && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <label className="block mb-2 text-sm font-medium">Xem trước:</label>
              <div className="p-2 bg-white rounded border">
                <MathJax dynamic>
                  {equationType === 'inline' 
                    ? `\\(${equationText}\\)` 
                    : `\\[${equationText}\\]`}
                </MathJax>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Ví dụ công thức:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setEquationText('x^2 + y^2 = r^2')}
              >
                x² + y² = r²
              </button>
              <button
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setEquationText('\\frac{a}{b}')}
              >
                Phân số
              </button>
              <button
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setEquationText('\\sqrt{x}')}
              >
                Căn bậc hai
              </button>
              <button
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setEquationText('\\sum_{i=1}^{n} x_i')}
              >
                Tổng
              </button>
              <button
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setEquationText('\\int_{0}^{\\infty} f(x) dx')}
              >
                Tích phân
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              onClick={() => {
                setShowEquationModal(false);
                setEquationText('');
              }}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => {
                if (!equationText.trim()) {
                  alert('Vui lòng nhập công thức');
                  return;
                }

                // Get cursor position in textarea
                const textarea = textareaRef.current;
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const textBefore = rawText.substring(0, start);
                  const textAfter = rawText.substring(end);
                  
                  // Format equation based on type
                  const equation = equationType === 'inline' 
                    ? `\\(${equationText}\\)` 
                    : `\\[${equationText}\\]`;
                  
                  // Insert equation at cursor position
                  const newText = textBefore + equation + textAfter;
                  setRawText(newText);
                  
                  // Set cursor position after inserted equation
                  setTimeout(() => {
                    textarea.focus();
                    const newCursorPos = start + equation.length;
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                  }, 0);
                } else {
                  // Fallback: append to end
                  const equation = equationType === 'inline' 
                    ? `\\(${equationText}\\)` 
                    : `\\[${equationText}\\]`;
                  setRawText(prev => prev + equation);
                }

                setShowEquationModal(false);
                setEquationText('');
              }}
            >
              Chèn
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            {/* Left Side: Configuration, Question Count, Divider, AI Tools */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="px-2 sm:px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                onClick={() => setShowScoreModal(true)}
                title="Cấu hình bài thi"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Cấu hình</span>
              </button>
              
              {/* Question Count */}
              <div className="text-xs sm:text-sm text-gray-600 px-2 sm:px-3 py-2 bg-gray-100 rounded-md">
                <span className="font-medium">{list.filter(q => q.type !== 'textblock').length}</span> <span className="hidden sm:inline">câu hỏi</span>
              </div>
              
              {/* Divider */}
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              {/* AI Tools */}
              <button
                className="px-2 sm:px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                onClick={() => setShowExerciseModal(true)}
                title="Tải đề thi lên và trích xuất câu hỏi bằng AI"
              >
                <MdCloudUpload className="w-4 h-4"/>
                <span className="hidden md:inline">Tải đề thi</span>
              </button>
              <button
                className="px-2 sm:px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                onClick={() => setShowMatrixModal(true)}
                title="Tải ma trận/đặc tả và tạo câu hỏi bằng AI"
              >
                <TbMatrix className="w-4 h-4"/>
                <span className="hidden md:inline">Ma trận</span>
              </button>
              <button
                className="px-2 sm:px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                onClick={() => setShowModal(true)}
                title="Tạo câu hỏi mới bằng AI dựa trên câu hỏi hiện có"
              >
                <RiAiGenerate2 className="w-4 h-4"/>
                <span className="hidden md:inline">Tạo câu hỏi</span>
              </button>
            </div>
            
            {/* Right Side: Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="px-2 sm:px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                onClick={() => {
                  if (window.confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu đã nhập?")) {
                    setRawText('');
                    setQuizTitle('');
                    setList([]);
                    setOptionList([]);
                  }
                }}
                title="Xóa toàn bộ dữ liệu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Xóa</span>
              </button>
              <button
                className="px-3 sm:px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onSubmit}
                disabled={list.filter(q => q.type !== 'textblock').length === 0}
                title="Tạo đề thi"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Tạo đề thi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <FileUploadModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        isLoading={isLoading}
        onUpload={extractQuestions}
        title="Tải tệp đề thi lên"
        accept=".docx, .pdf, image/*"
        buttonText="Thêm câu hỏi"
        buttonClass="bg-blue-500 hover:bg-blue-700"
      />

      <MatrixUploadModal
        isOpen={showMatrixModal}
        onClose={() => setShowMatrixModal(false)}
        isLoading={isLoading}
        onUpload={matrixQuestion}
        mcqRef={mcqRef}
        trueFalseRef={trueFalseRef}
        shortAnswerRef={shortAnswerRef}
      />

      <QuestionGeneratorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isLoading={isLoading}
        onGenerate={createQuestions}
        mcqRef={mcqRef}
        trueFalseRef={trueFalseRef}
        shortAnswerRef={shortAnswerRef}
      />

      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${showScoreModal ? 'block' : 'hidden'}`}>
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Cấu hình bài thi</h2>
          <div className="mb-4">
            <label className="block mb-2">Thời gian làm bài (phút):</label>
            <input 
              type="number"
              min="1"
              value={duration ?? 45}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-24 px-2 py-1 border rounded"
            />
          </div>
          {renderScoreDistribution()}
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors mr-2"
              onClick={() => setShowScoreModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default FormMaker;
