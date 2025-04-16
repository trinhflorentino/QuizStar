import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import db from "../../../services/firebaseConfig";
import {
  collection,
  getDocs,
} from "firebase/firestore/lite";
import { GoogleGenerativeAI } from "@google/generative-ai";
const grade10JSON = require('./grade10.json');
const grade11JSON = require('./grade11.json');
const grade12JSON = require('./grade12.json');

function AnalyzeKnowledge() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [title, setTitle] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("grade10"); // Default to grade 10
  const [schoolSubject, setSchoolSubject] = useState("math"); // Default to math
  const [gradeData, setGradeData] = useState(null);
  const navigate = useNavigate();
  let { pin } = useParams();
  // setSchoolLevel("grade10");
  // setSchoolLevel("math");
  useEffect(() => {
    const getQuestionsAndAnswers = async () => {
      try {
        const settersCollectionRef = collection(
          db,
          "Paper_Setters",
          pin.toString(),
          "Question_Papers_MCQ"
        );
        const docs = await getDocs(settersCollectionRef);
        
        if (docs.docs.length === 0) {
          setQuestions([]);
          return;
        }

        // Get questions and title
        const questionsDoc = docs.docs.find(doc => !doc.id.endsWith('_answerSheet'));
        if (questionsDoc) {
          setTitle(questionsDoc.id);
          setQuestions(questionsDoc.data().question_question || []);
        }

        // Get answers
        const answersDoc = docs.docs.find(doc => doc.id.endsWith('_answerSheet'));
        if (answersDoc) {
          setAnswers(answersDoc.data().answer_answer || []);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getQuestionsAndAnswers();
  }, [pin]);

  const renderAnswer = (question, index) => {
    const answer = answers[index];
    if (!answer) return null;

    switch (question.type) {
      case "mcq":
        return (
          <div className="text-green-600 font-medium mt-2">
            Đáp án đúng: {String.fromCharCode(64 + answer.answer)}: {question.options[answer.answer - 1]?.option}
          </div>
        );
      
      case "truefalse":
        return (
          <div className="text-green-600 font-medium mt-2">
            Đáp án: {answer.answer.map((isTrue, i) => (
              <div key={i}>
                {String.fromCharCode(97+i)}: {isTrue ? "Đúng" : "Sai"}
              </div>
            ))}
          </div>
        );
      
      case "shortanswer":
        return (
          <div className="text-green-600 font-medium mt-2">
            Đáp án: {answer.answer}
          </div>
        );
      
      default:
        return null;
    }
  };

  const serializeCurrentQuestions = () => {
    return questions.map((question, index) => {
      let serialized = `Câu hỏi ${index + 1}: ${question.question}`;
      
      if (question.type === "mcq") {
        const options = question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt.option}`).join(", ");
        serialized += `\nLựa chọn: ${options}`;
        const answer = answers[index];
        if (answer) {
          serialized += `\nĐáp án đúng: ${String.fromCharCode(64 + answer.answer)}: ${question.options[answer.answer - 1]?.option}`;
        }
      } else if (question.type === "truefalse") {
        const options = question.options.map((opt, i) => `${String.fromCharCode(97 + i)}. ${opt.option}`).join(", ");
        serialized += `\nLựa chọn: ${options}`;
        const answer = answers[index];
        if (answer) {
          serialized += `\nĐáp án: ${answer.answer.map((isTrue, i) => 
            `${String.fromCharCode(97 + i)}: ${isTrue ? "Đúng" : "Sai"}`
          ).join(", ")}`;
        }
      } else if (question.type === "shortanswer") {
        const answer = answers[index];
        if (answer) {
          serialized += `\nĐáp án: ${answer.answer}`;
        }
      }
      
      return serialized;
    }).join("\n\n");
  };
  const grade10 = JSON.parse(grade10JSON);
  const apiKey = "AIzaSyBha8XFvoYiAXXHYPjPIAwBwlkqNpq4m9w"; 
  const genAI = new GoogleGenerativeAI(apiKey);
  const model15flash8b = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b", 
    generationConfig: {
      "responseMimeType": "application/json",
      // responseSchema: schema,
      temperature: 0.6,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,    
    },
  });

  const analyzeQuestionsJSON = async () => {
    if(schoolLevel === "" || schoolSubject === "") {
      alert("Vui lòng chọn khối học và môn học.");
      return;
    }

    // Validate subject knowledge exists
    if(schoolLevel === "grade10") {
      // if(!validateSubjectKnowledge(schoolSubject)) {
      //   alert("Chưa có dữ liệu cho môn học này.");
      //   return;
      // }
      console.log("Grade 10 data:", grade10);
      // Get subject knowledge data
      // const subjectData = grade10[schoolSubject];
      // console.log("Subject knowledge data:", subjectData);
    }

    const prompt = `
Hãy phân tích các câu hỏi và đáp án được cung cấp để tạo ra các câu hỏi tương tự thuộc các dạng "mcq", "truefalse", và "shortanswer". Kết quả bắt buộc phải được định dạng JSON theo cấu trúc sau:

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
${serializeCurrentQuestions()}

Yêu cầu cụ thể:
- Tạo các câu hỏi tương tự nhưng không trùng lặp với câu hỏi đã có
- Giữ nguyên tỷ lệ các loại câu hỏi như input
- Số lượng câu hỏi tạo ra bằng với số câu hỏi đầu vào
- Đảm bảo câu hỏi mới có cùng mức độ và chủ đề với câu hỏi gốc
`;

    // try {
    //   const result = await model15flash8b.generateContent(prompt);
    //   let responseText = result.response.text();
    //   if (responseText.endsWith("]}]}]")) {
    //     responseText = responseText.slice(0, -2);
    //   }
    //   return responseText;
    // } catch (error) {
    //   console.error("Error generating questions:", error);
    //   throw error;
    // }
  };

  // const createQuestions = async () => {
  //   try {
  //     const ketQua = await createQuestionsJSON();
  //     if (ketQua) {
  //       const parsedData = JSON.parse(ketQua);
  //       const convertedData = parsedData.map(q => {
  //         if (q.type === "mcq") {
  //           // Convert letter answer (A, B, C, D) to index (0, 1, 2, 3)
  //           const answerIndex = q.answer.toUpperCase().charCodeAt(0) - 65;
  //           return { ...q, answer: answerIndex };
  //         }
  //         return q;
  //       });

  //       setQuestions(prevQuestions => [...prevQuestions, ...convertedData]);
        
  //       // Create corresponding answers
  //       const newAnswers = convertedData.map(q => ({
  //         answer: q.type === "mcq" ? q.answer + 1 // Convert to 1-based index
  //           : q.type === "truefalse" ? q.answer
  //           : q.answer
  //       }));
        
  //       setAnswers(prevAnswers => [...prevAnswers, ...newAnswers]);
  //     }
  //   } catch (error) {
  //     console.error("Error creating questions:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // };

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
    // function addQuestionsFromJSON(jsonData) {
    //   try {
    //     if (!Array.isArray(jsonData)) {
    //       throw new Error("Invalid JSON format: Expected an array of questions.");
    //     }
        
    //     // Arrays to hold new questions and options
    //     const newQuestions = [];
    //     const newOptions = [];
  
    //     jsonData.forEach((q, qIndex) => {
    //       // Validate and process each question
    //       if (typeof q.question !== 'string') {
    //         throw new Error(`Invalid question text at index ${qIndex}.`);
    //       }
    //       if (typeof q.type !== 'string') {
    //         throw new Error(`Invalid question type at index ${qIndex}.`);
    //       }
  
    //       let processedAnswer;
    //       if (q.type === "shortanswer") {
    //         if (typeof q.answer !== 'string') {
    //           throw new Error(`Invalid answer for short answer question at index ${qIndex}.`);
    //         }
    //         processedAnswer = q.answer.trim();
    //       } else if (q.type === "mcq") {
    //         if (typeof q.answer !== 'number') { // After conversion, answer should be a number
    //           throw new Error(`Invalid answer index for MCQ question at index ${qIndex}.`);
    //         }
    //         processedAnswer = q.answer;
    //       } else if (q.type === "truefalse") {
    //         processedAnswer = q.answer;
    //       } else {
    //         throw new Error(`Unsupported question type "${q.type}" at index ${qIndex}.`);
    //       }
  
    //       // Push new question to the array
    //       newQuestions.push({
    //         id: uuid(),
    //         question: q.question.trim(),
    //         answer: processedAnswer,
    //         type: q.type,
    //       });
  
    //       if (q.type === "mcq") {
    //         if (!Array.isArray(q.options) || q.options.length < 2) {
    //           throw new Error(`MCQ type must have at least two options. Issue with question at index ${qIndex}.`);
    //         }
    //         if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) {
    //           throw new Error(`MCQ question at index ${qIndex} has an invalid answer index.`);
    //         }
    //         const mcqOptions = q.options.map((option, index) => ({
    //           id: uuid(),
    //           option: typeof option === 'string' ? option.trim() : '',
    //           optionNo: index + 1,
    //         }));
    //         newOptions.push(mcqOptions);
    //       } else if (q.type === "truefalse") {
    //         if (!Array.isArray(q.options)) {
    //           throw new Error(`True/False type must have an options array at index ${qIndex}.`);
    //         }
    //         const tfOptions = q.options.map((option, index) => ({
    //           id: uuid(),
    //           option: typeof option === 'string' ? option.trim() : '',
    //           optionNo: index + 1,
    //           answer: q.answer[index],
    //         }));
    //         newOptions.push(tfOptions);
    //       } else if (q.type === "shortanswer") {
    //         newOptions.push([]);
    //       }
    //     });
        
    //     console.log("New Questions:", newQuestions);
    //     console.log("New Options:", newOptions);
        
    //     // Update the list and optionList states in one go
    //     setList([...list, ...newQuestions]);
    //     setOptionList((prevOptionList) => [...prevOptionList, ...newOptions]);
  
    //     console.log("Questions and options successfully added from JSON.");
    //     console.log("Updated List:", list);
    //     console.log("Updated Option List:", optionList);
    //   } catch (error) {
    //     console.error("Error adding questions from JSON:", error);
    //     alert(`Failed to add questions from JSON: ${error.message}`);
    //   }
    // }
  
  const Analyze = async (event) => {
    // setIsLoading(true);
    event.preventDefault();
    try {
      const ketQua = await analyzeQuestionsJSON();
      // console.log("Original Extracted Data:", ketQua);
      // if (ketQua) {
      //   const parsedData = JSON.parse(ketQua); // Ensure it's an array
      //   // validateQuestionsArray(parsedData);
      //   const convertedData = convertAnswers(parsedData); // Convert answers
      //   console.log("Converted Data:", convertedData);
      //   // addQuestionsFromJSON(convertedData); // Pass the array, not string
      // }
    } catch (error) {
      console.error("Error extracting questions:", error);
      alert(`Error: ${error.message}`);
    } finally {
      // setIsLoading(false);
    }
  }

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   await createQuestions();
  // };
  
  if (questions.length === 0) {
    return <p className="text-center p-4">Không tìm thấy bài thi.</p>;
  }

  return (
    <div className="m-4 md:m-10 lg:m-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={Analyze} className="mb-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6">
            <div className="font-medium">
              <label htmlFor="schoolLevel" className="form-label flex items-center"> Khối học </label>
            </div>
            <select
              id="schoolLevel"
              value={schoolLevel}
              onChange={(e) => setSchoolLevel(e.target.value)}
              className="form-select mt-1 block w-full"
              required
            >
              <option value="grade10">Khối 10</option>
              <option value="grade11">Khối 11</option>
              <option value="grade12">Khối 12</option>
            </select>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="font-medium">
              <label htmlFor="schoolSubject" className="form-label flex items-center"> Môn học </label>
            </div>
            <select
              id="schoolSubject"
              value={schoolSubject}
              onChange={(e) => setSchoolSubject(e.target.value)}
              className="form-select mt-1 block w-full"
              required
            >
              <option value="math">Toán</option>
              <option value="physic">Vật lý</option>
              <option value="chemistry">Hóa học</option>
              <option value="english">Anh văn</option>
              <option value="biology">Sinh học</option>
              <option value="history">Lịch sử</option>
              <option value="literature">Ngữ văn</option>
              <option value="it">Tin học</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Phân tích cấu trúc
        </button>
      </form>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={uuid()} className="bg-white p-6 rounded-lg shadow">
            <div className="font-medium mb-4">
              Câu {index + 1}. {question.question}
            </div>

            {question.type === "mcq" && (
              <div className="space-y-2 ml-4">
                {question.options.map((option, optIndex) => (
                  <div key={uuid()}>
                    {String.fromCharCode(65 + optIndex)}. {option.option}
                  </div>
                ))}
              </div>
            )}

            {question.type === "truefalse" && (
              <div className="space-y-2 ml-4">
                {question.options.map((option, optIndex) => (
                  <div key={uuid()}>
                    {String.fromCharCode(97+optIndex)}. {option.option}
                  </div>
                ))}
              </div>
            )}

            {renderAnswer(question, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyzeKnowledge;
