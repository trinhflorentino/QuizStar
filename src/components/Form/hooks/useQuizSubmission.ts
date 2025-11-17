import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { default as db, storage } from '../../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore/lite';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { useNotification } from '../../../contexts/NotificationContext';

interface Question {
  id: string;
  type: string;
  question?: string;
  answer?: number | string | string[] | boolean;
  score?: number;
}

interface Option {
  id: string;
  option: string;
  optionNo: number;
  answer?: boolean | null;
}

interface SubmitQuizParams {
  list: Question[];
  optionList: Option[][];
  quizTitle: string;
  duration: number;
  imagePreview: (string | null)[];
  isEditing?: boolean;
  customSubmit?: ((data: any) => void) | null;
}

export function useQuizSubmission() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { success, error, warning, info } = useNotification();

  async function uploadImage(file: File | string, examPin: number | string, questionId: string): Promise<string | null> {
    if (typeof file === 'string' && file.startsWith('http')) {
      return file;
    }
    
    if (!file || typeof file === 'string') return null;
    
    const storageRef = ref(storage, `question_images/${examPin}/${questionId}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async function setQuestionPaper(examPin: number | string, quizTitle: string, question_question: any[], duration: number) {
    const auth = getAuth();
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    await setDoc(
      doc(
        db,
        "Paper_Setters",
        examPin.toString(),
        "Question_Papers_MCQ",
        quizTitle
      ),
      {
        question_question: question_question.map(q => ({
          ...q,
          score: q.score || 0.25
        })),
        creator: auth.currentUser.email,
        status: "active",
        duration: duration
      }
    );
  }

  async function setAnswerSheet(examPin: number | string, quizTitle: string, answer_answer: any[]) {
    await setDoc(
      doc(
        db,
        "Paper_Setters",
        examPin.toString(),
        "Question_Papers_MCQ",
        quizTitle + "_answerSheet"
      ),
      { answer_answer: answer_answer }
    );
  }

  async function setResponseStatus(examPin: number | string, quizTitle: string) {
    const auth = getAuth();
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    await setDoc(
      doc(
        db,
        "Users",
        auth.currentUser.uid,
        "Exams_Created",
        examPin.toString()
      ),
      {
        quiz_title: quizTitle,
        status: "active",
      },
      { merge: true }
    );
  }

  function validator(list: Question[], optionList: Option[][], quizTitle: string): boolean {
    if (quizTitle.trim() === "") {
      warning("Tiêu đề bài thi không được để trống.", 4000);
      return false;
    }
    
    const questionCount = list.filter(q => q.type !== 'textblock').length;
    if(questionCount === 0) { 
      warning("Vui lòng thêm ít nhất một câu hỏi vào bài thi.", 4000);
      return false;
    }
    
    for (let i = 0; i < list.length; i++) {
      const question = list[i];
      const options = optionList[i] || [];

      if (question.type === "textblock") {
        continue;
      }

      if (!question.question || question.question.trim() === "") {
        warning(`Câu hỏi ${i + 1} không được để trống.`, 4000);
        return false;
      }

      if (
        (question.type === "mcq" && (question.answer === "" || question.answer === null)) ||
        (question.type === "truefalse" && 
           options.some(opt => typeof opt.answer !== "boolean") 
        )
      ) {
        warning(`Vui lòng chọn đáp án cho câu hỏi ${i + 1}.`, 4000);
        return false;
      }

      if (question.type === "mcq") {
        if (options.length < 2) {
          warning(`Câu hỏi ${i + 1} phải có ít nhất hai lựa chọn.`, 4000);
          return false;
        }

        for (let j = 0; j < options.length; j++) {
          if (options[j].option.trim() === "") {
            warning(`Lựa chọn ${j + 1} của câu hỏi ${i + 1} không được để trống.`, 4000);
            return false;
          }
        }

        if (question.answer === null || question.answer === undefined) {
          warning(`Vui lòng chọn đáp án đúng cho câu hỏi ${i + 1}.`, 4000);
          return false;
        }
      } else if (question.type === "truefalse") {
        for (let j = 0; j < options.length; j++) {
          if (options[j].option.trim() === "") {
            warning(`Ý kiến ${j + 1} của câu hỏi ${i + 1} không được để trống.`, 4000);
            return false;
          }

          if (typeof options[j].answer !== "boolean") {
            warning(`Vui lòng chọn đáp án cho ý kiến ${j + 1} của câu hỏi ${i + 1}.`, 4000);
            return false;
          }
        }
      } else if (question.type === "shortanswer") {
        const answers = Array.isArray(question.answer) ? question.answer : [question.answer].filter(a => a);
        if (!answers || answers.length === 0 || (answers.length === 1 && typeof answers[0] === 'string' && answers[0].trim() === "")) {
          warning(`Đáp án của câu hỏi ${i + 1} không được để trống.`, 4000);
          return false;
        }
      }
    }
    
    return true;
  }

  async function submitQuiz({
    list,
    optionList,
    quizTitle,
    duration,
    imagePreview,
    isEditing = false,
    customSubmit = null
  }: SubmitQuizParams) {
    if (!validator(list, optionList, quizTitle)) {
      return;
    }

    if (isEditing && customSubmit) {
      const questionQuestions = list
        .filter(question => question.type !== "textblock")
        .map((question, index) => {
          const originalIndex = list.indexOf(question);
          return {
            question: question.question?.trim() || "",
            options: (optionList[originalIndex] || []).map(option => ({
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
              : question.type === "truefalse" ? (optionList[originalIndex] || []).map(opt => opt.answer)
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

    setIsSubmitting(true);
    info("Đang tạo đề thi...", 0); // 0 = không tự đóng
    
    try {
      const examPin = Math.floor(100000 + Math.random() * 900000);
      
      const imageUploads = await Promise.all(
        list.map(async (question, index) => {
          if (question.type === "textblock") {
            return null;
          }
          
          if (isEditing && imagePreview[index] && typeof imagePreview[index] === 'string' && imagePreview[index].startsWith('http')) {
            return imagePreview[index];
          }
          
          if (imagePreview[index]) {
            const response = await fetch(imagePreview[index] as string);
            const blob = await response.blob();
            const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' });
            return await uploadImage(file, examPin, question.id);
          }
          return null;
        })
      );
  
      const questionQuestions = list
        .filter(question => question.type !== "textblock")
        .map((question, mappedIndex) => {
          const originalIndex = list.indexOf(question);
          let options: Option[] = [];
          if(question.type !== "shortanswer") {
            options = (optionList[originalIndex] || []).filter(option => option.option && option.optionNo);
          }
          
          return {
            question: question.question?.trim() || "",
            options: options.map(option => ({ option: option.option.trim(), optionNo: option.optionNo })),
            type: question.type,
            imageUrl: imageUploads[originalIndex],
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
            return { answer: (optionList[originalIndex] || []).map(option => option.answer) };
          } else if (question.type === "shortanswer") {
            const answers = Array.isArray(question.answer) 
              ? question.answer.map(a => typeof a === 'string' ? a.trim() : a).filter(a => a)
              : (typeof question.answer === 'string' ? [question.answer.trim()].filter(a => a) : []);
            return { answer: answers };
          }
          return {};
        });
  
      await Promise.all([
        setQuestionPaper(examPin, quizTitle, questionQuestions, duration),
        setAnswerSheet(examPin, quizTitle, answerAnswers),
        setResponseStatus(examPin, quizTitle),
      ]);
  
      success(`Đề thi "${quizTitle}" đã được tạo thành công!`, 5000);
      setTimeout(() => {
        navigate(`/FormMaker/DisplayPin/${examPin}`);
      }, 1000);
    } catch (err: any) {
      console.error("Error submitting the form:", err);
      error("Có lỗi xảy ra khi tạo đề thi. Vui lòng thử lại.", 6000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    submitQuiz
  };
}




