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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [previewOptions, setPreviewOptions] = useState([]);
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const questionsPerPage = 10;

  // Create refs for the number inputs
  const mcqRef = React.useRef(null);
  const trueFalseRef = React.useRef(null);
  const shortAnswerRef = React.useRef(null);

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

  async function extractQuestions() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file === undefined) {
      alert("Vui lòng chọn file trước.");
      return;
    }
    setIsLoading(true);
    try {
      const prompt = `Phân tích nội dung file được cung cấp. Trích xuất tất cả các câu hỏi thuộc loại 'mcq', 'truefalse', và 'shortanswer' cùng với các đáp án được chỉ định cho chúng trong file.
LƯU Ý QUAN TRỌNG:
Mục tiêu chính là trích xuất thông tin: Nhiệm vụ của bạn là xác định và trích xuất câu hỏi và các dấu hiệu đáp án như chúng xuất hiện trong file.
KHÔNG đánh giá nội dung: AI KHÔNG được đánh giá, kiểm tra tính đúng đắn về mặt học thuật, ngữ pháp, hay logic của nội dung câu hỏi hoặc đáp án. Chỉ trích xuất những gì được cung cấp.
KHÔNG sửa đổi nội dung: KHÔNG được tự ý sửa đổi, thêm bớt, hay diễn giải lại nội dung của câu hỏi hoặc đáp án đã trích xuất, trừ khi cần thiết cho việc định dạng (ví dụ: LaTeX, loại bỏ HTML).
YÊU CẦU OUTPUT JSON NGHIÊM NGẶT:
Định dạng & Cú pháp: Output phải là một chuỗi JSON hợp lệ duy nhất. Tất cả tên thuộc tính (keys) và giá trị chuỗi (strings) BẮT BUỘC phải được đặt trong dấu ngoặc kép (\"). Tuân thủ responseSchema.
Bỏ qua trường Null: Nếu một trường (ví dụ: \"answer\" hoặc \"options\") không có giá trị hợp lệ hoặc giá trị của nó sẽ là null, thì trường đó (cả key và value) phải được bỏ qua hoàn toàn, KHÔNG được xuất hiện trong đối tượng JSON của câu hỏi đó.
Loại câu hỏi: Chỉ trích xuất 'mcq', 'truefalse', 'shortanswer'.
Ngôn ngữ & Công thức: Giữ nguyên ngôn ngữ gốc của văn bản. Chuyển đổi công thức toán học sang định dạng LaTeX. Loại bỏ các thẻ HTML khỏi nội dung.
QUY TẮC TRÍCH XUẤT ĐÁP ÁN (answer):
Ưu tiên tìm kiếm và trích xuất các dấu hiệu chỉ định đáp án theo thứ tự sau đây. Nếu dấu hiệu đáp án được tìm thấy bằng một phương thức, các phương thức có độ ưu tiên thấp hơn sẽ không cần xét cho câu hỏi đó.
Phương thức 1: BẢNG ĐÁP ÁN (Ưu tiên cao nhất)
Tìm kiếm mục có tiêu đề "BẢNG ĐÁP ÁN" (tiếng Việt) hoặc "ANSWER KEY" (tiếng Anh) trong tài liệu. Mục này thường xuất hiện sau khi kết thúc phần đề bài.
Câu trắc nghiệm (MCQ):
Nhận dạng các dòng có định dạng như [số câu]-A, [số câu]A, hoặc [số câu].A (ví dụ: 1-A, 2B, 3.C).
Trích xuất ký tự được chỉ định làm đáp án (ví dụ: \"A\", \"B\").
Câu điền từ (Short Answer):
Nhận dạng các dòng có định dạng như [số câu]-[nội dung đáp án] hoặc [số câu].[nội dung đáp án] (ví dụ: 1-hello world, 2.apple).
Nếu có nhiều nội dung đáp án được cung cấp cho cùng một câu và được phân tách bởi dấu | (ví dụ: 1.hello|hi|hey), giá trị \"answer\" phải là một mảng chuỗi JSON (ví dụ: [\"hello\", \"hi\", \"hey\"]).
Nếu chỉ có một nội dung đáp án được cung cấp, giá trị \"answer\" là một chuỗi đơn (ví dụ: \"hello world\").
Câu True/False (nếu có trong bảng đáp án):
Nếu bảng đáp án chỉ định trực tiếp các giá trị true hoặc false cho các mệnh đề của câu hỏi True/False (ví dụ: 1. True | False | True), thì giá trị \"answer\" sẽ là một mảng boolean JSON (ví dụ: [true, false, true]).
Phương thức 2: BÔI MÀU ĐÁP ÁN
Kiểm tra xem có phương án trả lời (A, B, C, D,...) hoặc toàn bộ nội dung của một phương án trả lời nào được bôi màu khác biệt so với màu văn bản chung hay không.
Nếu có, ký tự của phương án được bôi màu đó (ví dụ: "A", "B") được coi là đáp án chỉ định cho câu hỏi trắc nghiệm.
Phương thức 3: GẠCH CHÂN ĐÁP ÁN
Kiểm tra xem có phương án trả lời (A, B, C, D,...) hoặc toàn bộ nội dung của một phương án trả lời nào được gạch chân hay không.
Nếu có, ký tự của phương án được gạch chân đó (ví dụ: "A", "B") được coi là đáp án chỉ định cho câu hỏi trắc nghiệm.
Phương thức 4: ĐÁP ÁN TRONG PHẦN LỜI GIẢI
Nếu các phương thức trên không cung cấp dấu hiệu đáp án, tìm kiếm trong phần lời giải chi tiết (nếu có) các chỉ dấu rõ ràng về đáp án được cung cấp cho câu hỏi đó (ví dụ: "Đáp án: A", "Câu trả lời là True", "Phần điền từ: photosynthesis").
Đối với câu True/False, nếu lời giải cung cấp các giá trị True/False cho từng mệnh đề, hãy trích xuất chúng để xây dựng mảng boolean.
Xử lý giá trị answer:
Nếu Dấu Hiệu Đáp Án Được Tìm Thấy (bằng một trong các phương thức trên):
Bao gồm trường \"answer\" trong output JSON.
Định dạng giá trị \"answer\" như sau:
MCQ: Ký tự được chỉ định làm đáp án (ví dụ: \"A\").
True/False: Một mảng boolean JSON trực tiếp (ví dụ: [true, false, true]). Đây là một mảng các giá trị boolean, không phải là một chuỗi.
Short Answer:
Một chuỗi được chỉ định làm đáp án (ví dụ: \"photosynthesis\").
Hoặc, một mảng chuỗi JSON nếu nhiều đáp án điền từ được cung cấp và phân tách bởi | trong bảng đáp án (ví dụ: [\"hello\", \"hi\"]).
Nếu KHÔNG Tìm Thấy Dấu Hiệu Đáp Án (sau khi đã thử tất cả các phương thức): KHÔNG được bao gồm trường \"answer\" trong output JSON cho câu hỏi đó.
QUY TẮC XỬ LÝ LỰA CHỌN (options):
Áp dụng cho MCQ/TrueFalse: Trường \"options\" chỉ áp dụng cho loại \"mcq\" và \"truefalse\".
Nếu có Lựa chọn/Mệnh đề được trình bày:
Bao gồm trường \"options\" trong output JSON.
Giá trị phải là một mảng các chuỗi (ví dụ: [\"Lựa chọn 1\", \"Mệnh đề A\"]), trích xuất nguyên văn các lựa chọn/mệnh đề đó.
Nếu là ShortAnswer hoặc không có Lựa chọn/Mệnh đề được trình bày: KHÔNG được bao gồm trường \"options\" trong output JSON cho câu hỏi đó.
CHI TIẾT CÁC LOẠI CÂU HỎI (Tóm tắt):
MCQ: Bao gồm \"question\", \"type\": \"mcq\". Bao gồm \"options\" (mảng chuỗi) và \"answer\" (chuỗi ký tự) chỉ khi chúng có giá trị/dấu hiệu được tìm thấy theo các quy tắc trên.
True/False: Bao gồm \"question\", \"type\": \"truefalse\". Bao gồm \"options\" (mảng chuỗi mệnh đề) và \"answer\" (một mảng boolean JSON trực tiếp, ví dụ: [true, false, true]) chỉ khi chúng có giá trị/dấu hiệu được tìm thấy.
Short Answer: Bao gồm \"question\", \"type\": \"shortanswer\". Bao gồm \"answer\" (chuỗi hoặc mảng chuỗi JSON) chỉ khi dấu hiệu của nó được tìm thấy theo các quy tắc trên. Không bao giờ bao gồm \"options\".
Tính rõ ràng: Chỉ trích xuất các câu hỏi có cấu trúc rõ ràng.
`;

      const ketQua = await extractQuestionsJSON(file, prompt);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        console.log("ketQua", ketQua);
        const parsedData = JSON.parse(ketQua);
        validateQuestionsArray(parsedData);
        const convertedData = convertAnswers(parsedData);
        console.log("Converted Data:", convertedData);
        addQuestionsFromJSON(convertedData);
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
      const prompt = "Nhiệm vụ: Phân tích kỹ lưỡng nội dung file ma trận/đặc tả/đề cương được cung cấp và **TẠO RA** các câu hỏi thuộc dạng 'mcq', 'truefalse', và 'shortanswer' cùng với đáp án chính xác dựa trên nội dung đó.\n\n**YÊU CẦU OUTPUT JSON NGHIÊM NGẶT:**\n\n1.  **Định dạng & Cú pháp:** Output *phải* là một chuỗi JSON hợp lệ duy nhất, không có văn bản nào khác. Tất cả tên thuộc tính (keys) và giá trị chuỗi (strings) **BẮT BUỘC** phải được đặt trong dấu ngoặc kép (`\"`). Tuân thủ `responseSchema` được cung cấp.\n2.  **Loại câu hỏi:** Chỉ tạo câu hỏi thuộc 3 dạng: 'mcq', 'truefalse', 'shortanswer'.\n3.  **Nội dung & Số lượng:** Nội dung, số lượng, và độ khó (nếu có trong ma trận) của các câu hỏi được tạo ra **phải bám sát chặt chẽ** các chủ đề, mục tiêu học tập, và phân bố được nêu trong file ma trận/đặc tả/đề cương. Ưu tiên tạo các câu hỏi dạng bài toán tình huống hoặc ứng dụng thực tế khi phù hợp với nội dung.\n4.  **ĐỊNH DẠNG CÔNG THỨC (MATHJAX):**\n    *   Chuyển đổi TẤT CẢ công thức toán học sang định dạng LaTeX.\n    *   **BẮT BUỘC** sử dụng dấu phân cách MathJax: `\\( ... \\)` (inline) và `\\[ ... \\]` (display).\n    *   Ví dụ: `\"Công thức \\\\(ax^2+bx+c=0\\\\)\"`, `\"Tìm \\\\[\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin x}{x}\\\\]\"`.\n    *   **TUYỆT ĐỐI KHÔNG** dùng định dạng khác (MathML, ảnh, text, `$`, `$$`). Loại bỏ mọi thẻ HTML.\n\n**QUY TẮC TẠO CÂU HỎI VÀ ĐÁP ÁN CHI TIẾT:**\n\n5.  **MCQ (Multiple Choice Question):**\n    *   `\"type\"`: `\"mcq\"`.\n    *   `\"question\"`: Nội dung câu hỏi rõ ràng, dễ hiểu.\n    *   `\"options\"`: **BẮT BUỘC** phải tạo ra **đúng 4 lựa chọn** dưới dạng mảng chuỗi. Các lựa chọn phải liên quan đến câu hỏi.\n    *   `\"answer\"`: **BẮT BUỘC** phải là một chuỗi ký tự (ví dụ: `\"A\"`, `\"B\"`, `\"C\"`, `\"D\"`) chỉ ra đáp án đúng duy nhất trong 4 lựa chọn.\n    *   Các lựa chọn sai (phương án nhiễu) phải hợp lý nhưng chắc chắn sai dựa trên nội dung file.\n6.  **True/False:**\n    *   `\"type\"`: `\"truefalse\"`.\n    *   `\"question\"`: Có thể là câu dẫn chung (nếu cần) hoặc để trống (`\"\"`) nếu các mệnh đề tự đứng vững.\n    *   `\"options\"`: **BẮT BUỘC** phải tạo ra **đúng 4 mệnh đề** cần đánh giá Đúng/Sai, dưới dạng mảng chuỗi. Các mệnh đề phải rõ ràng, có thể xác định tính đúng sai dựa trên nội dung file.\n    *   `\"answer\"`: **BẮT BUỘC** phải là một **chuỗi JSON biểu diễn một mảng boolean gồm đúng 4 phần tử** (ví dụ: `\"[true, false, true, false]\"`), tương ứng với tính đúng/sai của từng mệnh đề trong `options`.\n7.  **Short Answer:**\n    *   `\"type\"`: `\"shortanswer\"`.\n    *   `\"question\"`: Nội dung câu hỏi yêu cầu một đáp án ngắn gọn, thường là một giá trị số hoặc thuật ngữ cụ thể dựa trên file.\n    *   `\"options\"`: **KHÔNG được bao gồm trường `\"options\"`** cho loại này.\n    *   `\"answer\"`: **BẮT BUỘC** phải là một **chuỗi (string)** chứa đáp án ngắn gọn. **Đáp án này phải tuân thủ định dạng:** tối đa 4 ký tự, chỉ chứa chữ số (0-9), có thể có dấu âm (`-`) ở đầu, và có thể có một dấu phẩy (`,`) làm dấu thập phân. Ví dụ: `\"100\"`, `\"-25\"`, `\"9,81\"`, `\"-0,5\"`.\n8.  **Định dạng Mảng Boolean (Nhắc lại):** Khi `answer` cần là mảng boolean (cho True/False), nó **phải** được biểu diễn dưới dạng **CHUỖI JSON** (ví dụ: `\"[true, false, false, true]\"`).\n9.  **Tính chính xác & Rõ ràng:** Mỗi câu hỏi tạo ra phải rõ ràng, dễ hiểu. Đáp án được cung cấp trong trường `answer` phải là đáp án chính xác duy nhất dựa trên nội dung trong file ma trận/đặc tả.\n\n10. **Tuân thủ nghiêm ngặt:** Đảm bảo output cuối cùng khớp hoàn toàn với cấu trúc JSON, các quy tắc định dạng và yêu cầu về số lượng đã nêu.";

      const ketQua = await matrixQuestionsJSON(file, prompt);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        const parsedData = JSON.parse(ketQua);
        validateQuestionsArray(parsedData);
        const convertedData = convertAnswers(parsedData);
        console.log("Converted Data:", convertedData);
        addQuestionsFromJSON(convertedData);
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

      const prompt = "Nhiệm vụ: Phân tích kỹ lưỡng bộ câu hỏi JSON hiện tại được cung cấp trong `${currentQuestions}`. Dựa trên chủ đề, phong cách, độ khó và cấu trúc của các câu hỏi đó, **TẠO RA các câu hỏi MỚI và TƯƠNG TỰ** thuộc các dạng 'mcq', 'truefalse', và 'shortanswer' cùng với đáp án chính xác.\n\n**Đầu vào:**\n*   Các câu hỏi hiện tại (dùng làm nguồn tham khảo và ngữ cảnh): `${currentQuestions}`\n\n**Yêu cầu Số lượng Đầu ra:**\n*   Số câu MCQ mới cần tạo: `${mcqCount}`\n*   Số câu True/False mới cần tạo: `${trueFalseCount}`\n*   Số câu Short Answer mới cần tạo: `${shortAnswerCount}`\n\n**YÊU CẦU OUTPUT JSON NGHIÊM NGẶT:**\n\n1.  **Định dạng & Cú pháp:** Output *phải* là một chuỗi JSON hợp lệ duy nhất, không có văn bản nào khác. Tất cả tên thuộc tính (keys) và giá trị chuỗi (strings) **BẮT BUỘC** phải được đặt trong dấu ngoặc kép (`\"`). Tuân thủ `responseSchema` được cung cấp.\n2.  **Nội dung Mới & Tương tự:** Các câu hỏi tạo ra **KHÔNG ĐƯỢC TRÙNG LẶP** với bất kỳ câu hỏi nào trong `${currentQuestions}`. Tuy nhiên, chúng phải tương tự về chủ đề, lĩnh vực kiến thức, kiểu câu hỏi, và mức độ phức tạp so với các câu hỏi đầu vào.\n3.  **Loại câu hỏi:** Chỉ tạo câu hỏi thuộc 3 dạng: 'mcq', 'truefalse', 'shortanswer' với số lượng chính xác đã yêu cầu.\n4.  **Ngôn ngữ:** Tạo các câu hỏi bằng Tiếng Việt, rõ ràng, dễ hiểu và chính xác về mặt ngữ nghĩa/chuyên môn dựa trên ngữ cảnh từ câu hỏi đầu vào.\n5.  **ĐỊNH DẠNG CÔNG THỨC (MATHJAX/LATEX):**\n    *   Nếu câu hỏi hoặc đáp án/lựa chọn chứa công thức toán học, **BẮT BUỘC** phải viết dưới dạng LaTeX.\n    *   Sử dụng dấu phân cách MathJax: `\\( ... \\)` (inline) và `\\[ ... \\]` (display).\n    *   Ví dụ: `\"Công thức \\\\(E=mc^2\\\\)\"`, `\"Giải phương trình \\\\[x^2 - 5x + 6 = 0\\\\]\"`.\n    *   **TUYỆT ĐỐI KHÔNG** dùng định dạng khác (HTML, ảnh, text, `$`, `$$`). Loại bỏ mọi thẻ HTML.\n\n**QUY TẮC TẠO CÂU HỎI VÀ ĐÁP ÁN CHI TIẾT:**\n\n6.  **MCQ (Multiple Choice Question):**\n    *   `\"type\"`: `\"mcq\"`.\n    *   `\"question\"`: Nội dung câu hỏi mới, tương tự câu hỏi MCQ đầu vào.\n    *   `\"options\"`: **BẮT BUỘC** tạo **đúng 4 lựa chọn** (mảng chuỗi). Một đúng, ba sai (nhiễu).\n    *   `\"answer\"`: Chuỗi ký tự (`\"A\"`, `\"B\"`, `\"C\"`, `\"D\"`) chỉ ra đáp án đúng.\n    *   Các lựa chọn nhiễu phải hợp lý nhưng sai, dựa trên chủ đề chung.\n7.  **True/False:**\n    *   `\"type\"`: `\"truefalse\"`.\n    *   `\"question\"`: Câu dẫn chung (nếu cần) hoặc để trống (`\"\"`).\n    *   `\"options\"`: **BẮT BUỘC** tạo **đúng 4 mệnh đề** mới (mảng chuỗi) cần đánh giá Đúng/Sai, tương tự các mệnh đề trong câu hỏi T/F đầu vào.\n    *   `\"answer\"`: **BẮT BUỘC** phải là một **chuỗi JSON biểu diễn một mảng boolean gồm đúng 4 phần tử** (ví dụ: `\"[true, false, true, false]\"`), tương ứng với tính đúng/sai của từng mệnh đề trong `options`.\n8.  **Short Answer:**\n    *   `\"type\"`: `\"shortanswer\"`.\n    *   `\"question\"`: Nội dung câu hỏi mới yêu cầu đáp án ngắn, tương tự câu hỏi Short Answer đầu vào.\n    *   `\"options\"`: **KHÔNG bao gồm trường `\"options\"`**.\n    *   `\"answer\"`: Chuỗi chứa đáp án ngắn gọn, súc tích và chính xác. Nếu câu hỏi yêu cầu đánh giá nhiều mệnh đề đúng/sai (ít phổ biến cho short answer, nhưng nếu có), `answer` phải là chuỗi JSON biểu diễn mảng boolean (ví dụ: `\"[true, false]\"`).\n9.  **Định dạng Mảng Boolean (Nhắc lại):** Khi `answer` cần là mảng boolean (cho True/False), nó **phải** được biểu diễn dưới dạng **CHUỖI JSON** (ví dụ: `\"[true, true, false, false]\"`).\n10. **Tính chính xác & Rõ ràng:** Mỗi câu hỏi tạo ra phải rõ ràng, dễ hiểu. Đáp án phải chính xác dựa trên kiến thức phổ thông hoặc logic nội tại của chủ đề được gợi ý từ câu hỏi đầu vào.\n\n11. **Tuân thủ nghiêm ngặt:** Đảm bảo output cuối cùng khớp hoàn toàn với cấu trúc JSON, các quy tắc định dạng và số lượng yêu cầu.";

      const ketQua = await createQuestionsJSON(prompt);
      console.log("Original Extracted Data:", ketQua);
      if (ketQua) {
        const parsedData = JSON.parse(ketQua);
        validateQuestionsArray(parsedData);
        const convertedData = convertAnswers(parsedData);
        console.log("Converted Data:", convertedData);
        addQuestionsFromJSON(convertedData);
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

  // Serialize current questions and options
  function serializeCurrentQuestions() {
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

  function addQuestionsFromJSON(jsonData) {
    try {
      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid JSON format: Expected an array of questions.");
      }
      
      // Pre-allocate arrays with known size to avoid resizing
      const newQuestions = new Array(jsonData.length);
      const newOptions = new Array(jsonData.length);

      // Process questions in a single pass without repeated operations
      for (let qIndex = 0; qIndex < jsonData.length; qIndex++) {
        const q = jsonData[qIndex];
        
        // Basic validation with defaults
        const question = typeof q.question === 'string' ? q.question.trim() : "";
        const type = typeof q.type === 'string' && ["mcq", "truefalse", "shortanswer"].includes(q.type) ? q.type : "mcq";
        
        // Set appropriate default score based on question type
        const defaultScore = type === 'truefalse' ? 1.0 : type === 'shortanswer' ? 0.5 : 0.25;
        
        // Initialize answer based on question type (no defaults, just validation)
        let processedAnswer = "";
        if (type === "shortanswer" && typeof q.answer === 'string') {
          processedAnswer = q.answer.trim();
        } else if (type === "mcq" && q.answer !== undefined && q.answer !== null) {
          processedAnswer = q.answer;
        } else if (type === "truefalse" && Array.isArray(q.answer)) {
          processedAnswer = q.answer;
        }

        // Create new question object
        newQuestions[qIndex] = {
          id: uuid(),
          question: question,
          answer: processedAnswer,
          type: type,
          score: defaultScore
        };

        // Create options based on question type
        if (type === "mcq") {
          let options = q.options;
          if (!Array.isArray(options) || options.length < 2) {
            options = ["Option A", "Option B", "Option C", "Option D"];
          }
          
          const mcqOptions = new Array(options.length);
          for (let i = 0; i < options.length; i++) {
            mcqOptions[i] = {
              id: uuid(),
              option: typeof options[i] === 'string' ? options[i].trim() : '',
              optionNo: i + 1
            };
          }
          newOptions[qIndex] = mcqOptions;
          
        } else if (type === "truefalse") {
          let options = q.options;
          if (!Array.isArray(options) || options.length < 1) {
            options = ["Statement 1", "Statement 2"];
          }
          
          const tfOptions = new Array(options.length);
          for (let i = 0; i < options.length; i++) {
            tfOptions[i] = {
              id: uuid(),
              option: typeof options[i] === 'string' ? options[i].trim() : '',
              optionNo: i + 1,
              answer: Array.isArray(q.answer) && i < q.answer.length ? q.answer[i] : null
            };
          }
          newOptions[qIndex] = tfOptions;
          
        } else if (type === "shortanswer") {
          newOptions[qIndex] = [];
        }
      }
      
      // Set preview data and show modal - now with optimized data
      setPreviewQuestions(newQuestions);
      setPreviewOptions(newOptions);
      setShowPreviewModal(true);
      
    } catch (error) {
      console.error("Error adding questions from JSON:", error);
      alert(`Failed to add questions from JSON: ${error.message}`);
    }
  }

  const handleConfirmAddQuestions = () => {
    // Use React batch updates to handle both state changes in one render cycle
    // This improves performance significantly when adding many questions
    const batchedUpdate = () => {
      setList(prevList => [...prevList, ...previewQuestions]);
      setOptionList(prevOptions => [...prevOptions, ...previewOptions]);
      setShowPreviewModal(false);
    };
    
    batchedUpdate();
  };

  const handleCancelAddQuestions = () => {
    setShowPreviewModal(false);
    setCurrentPreviewPage(0); // Reset pagination when closing
  };

  const paginatedPreviewQuestions = React.useMemo(() => {
    if (!previewQuestions.length) return [];
    const startIndex = currentPreviewPage * questionsPerPage;
    return previewQuestions.slice(startIndex, startIndex + questionsPerPage);
  }, [previewQuestions, currentPreviewPage, questionsPerPage]);
  
  const paginatedPreviewOptions = React.useMemo(() => {
    if (!previewOptions.length) return [];
    const startIndex = currentPreviewPage * questionsPerPage;
    return previewOptions.slice(startIndex, startIndex + questionsPerPage);
  }, [previewOptions, currentPreviewPage, questionsPerPage]);
  
  const totalPreviewPages = Math.ceil((previewQuestions?.length || 0) / questionsPerPage);

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
      distribution[question.type].count++;
      distribution[question.type].totalScore += question.score || 0;
    });

    return distribution;
  };

  // Thêm hàm cập nhật điểm số
  const updateQuestionScores = (questions, distribution) => {
    return questions.map(question => {
      const type = question.type;
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
    <div id="mainForm" className="m-4 md:m-10 lg:m-12 pb-24">
      <div className="quizBox">
        <input
          type="text"
          className="quiz_title shadow shadow-slate-300 mx-4 sm:mx-8 lg:mx-40 rounded-xl text-lg text-center p-3 sm:p-4 w-full"
          name="quiz_title"
          id="quiz_title"
          placeholder="Hãy nhập tiêu đề bài thi..."
          value={quizTitle || ''}
          onChange={(event) => setQuizTitle(event.target.value)}
        />      
      </div>

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
      </div>

      {list.map((soloList, index) => (
        <QuestionItem
          key={soloList.id}
          index={index}
          question={soloList}
          options={optionList[index]}
          onQuestionChange={questChangeHandler}
          onOptionChange={optionChangeHandler}
          onCorrectOptionChange={handleCorrectOptionChange}
          onRemoveQuestion={handleRemoveQuest}
          onAddOption={handleAddOpt}
          onRemoveOption={handleRemoveOpt}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          imagePreview={imagePreview[index]}
          fileInputKey={fileInputKeys[index]}
          onScoreChange={handleScoreChange}
          onTypeChange={handleQuestionTypeChange}
        />
      ))}

      <button
        className="mx-5 mb-2 px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        onClick={() => handleAddQuest()}
      >
        <AiOutlineQuestionCircle className="inline mr-2"/>
        Thêm câu hỏi
      </button>

      <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center z-10">
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => setShowScoreModal(true)}
          >
            Cấu hình bài thi
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={resetForm}
          >
            Xóa dữ liệu
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={onSubmit}
          >
            Tạo đề thi
          </button>
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

      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${showPreviewModal ? 'block' : 'hidden'}`}>
        <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Xem trước câu hỏi</h2>
          <div className="space-y-4">
            {paginatedPreviewQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">Câu {index + 1}</span>
                  <span className="text-sm text-gray-500">
                    {question.type === 'mcq' ? 'Trắc nghiệm' : 
                     question.type === 'truefalse' ? 'Đúng/Sai' : 'Trả lời ngắn'}
                  </span>
                </div>
                <div className="mb-2">
                  <MathJax inline dynamic>{question.question ?? ""}</MathJax>
                </div>
                {question.type !== 'shortanswer' && (
                  <div className="ml-4 space-y-1">
                    {paginatedPreviewOptions[index].map((option, optIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <span className="font-medium">
                          {question.type === 'truefalse' 
                            ? String.fromCharCode(97 + optIndex)
                            : String.fromCharCode(65 + optIndex) 
                          }.
                        </span>
                        <MathJax inline dynamic>{option.option ?? ""}</MathJax>
                        {question.type === 'mcq' && question.answer === optIndex && (
                          <span className="text-green-500">(Đáp án đúng)</span>
                        )}
                        {question.type === 'truefalse' && (
                          <span className={option.answer === null ? "text-gray-500" : option.answer ? "text-green-500" : "text-red-500"}>
                            ({option.answer === null ? "Không có đáp án" : option.answer ? "Đúng" : "Sai"})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'shortanswer' && (
                  <div className="ml-4">
                    <span className="text-gray-600">Đáp án: </span>
                    <MathJax inline dynamic>{question.answer ?? ""}</MathJax>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPreviewPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPreviewPage(prev => Math.max(0, prev - 1))}
                disabled={currentPreviewPage === 0}
                className={`px-3 py-1 border rounded ${
                  currentPreviewPage === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-blue-500 hover:bg-blue-50'
                }`}
              >
                &laquo; Trước
              </button>
              
              <div className="px-3 py-1 text-sm">
                Trang {currentPreviewPage + 1} / {totalPreviewPages}
                {previewQuestions.length > 0 && 
                  ` (${currentPreviewPage * questionsPerPage + 1}-${Math.min((currentPreviewPage + 1) * questionsPerPage, previewQuestions.length)} của ${previewQuestions.length} câu hỏi)`
                }
              </div>
              
              <button
                onClick={() => setCurrentPreviewPage(prev => Math.min(totalPreviewPages - 1, prev + 1))}
                disabled={currentPreviewPage >= totalPreviewPages - 1}
                className={`px-3 py-1 border rounded ${
                  currentPreviewPage >= totalPreviewPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-blue-500 hover:bg-blue-50'
                }`}
              >
                Tiếp &raquo;
              </button>
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              onClick={handleCancelAddQuestions}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={handleConfirmAddQuestions}
            >
              Thêm câu hỏi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormMaker;
