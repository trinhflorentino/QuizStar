import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { default as db } from "../../services/firebaseConfig";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore/lite";
import FormMaker from "./FormMaker";

interface QuizData {
  title: string;
  questions: any[];
  answers: any[];
}

const FormEdit: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!pin) {
          setError("Missing pin parameter");
          setLoading(false);
          return;
        }

        // First get all exams from Paper_Setters collection
        const examRef = doc(db, "Paper_Setters", pin);
        const mcqCollection = collection(examRef, "Question_Papers_MCQ");
        const mcqSnapshot = await getDocs(mcqCollection);
        
        if (mcqSnapshot.empty) {
          throw new Error("Quiz not found");
        }

        // Find the main quiz document (the one without _answerSheet suffix)
        const quizDoc = mcqSnapshot.docs.find(doc => !doc.id.endsWith('_answerSheet'));
        const answerDoc = mcqSnapshot.docs.find(doc => doc.id.endsWith('_answerSheet'));

        if (!quizDoc || !answerDoc) {
          throw new Error("Quiz data incomplete");
        }

        const quizDataValue = quizDoc.data();
        const answerData = answerDoc.data();

        setQuizData({
          title: quizDoc.id,
          questions: quizDataValue.question_question || [],
          answers: answerData.answer_answer || []
        });

      } catch (error: any) {
        console.error("Error fetching quiz:", error);
        setError(error.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [pin]);

  const handleUpdate = async (updatedData: any) => {
    try {
      if (!pin || !quizData) {
        alert("Missing data for update");
        return;
      }

      // Update questions
      await updateDoc(
        doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", quizData.title),
        {
          question_question: updatedData.questions
        }
      );

      // Update answers
      await updateDoc(
        doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", `${quizData.title}_answerSheet`),
        {
          answer_answer: updatedData.answers
        }
      );

      navigate("/ExamsCreated/ExamResults/" + pin);
    } catch (error: any) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz: " + (error.message || String(error)));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!quizData) {
    return <div className="flex justify-center items-center h-screen text-red-500">No quiz data available</div>;
  }

  return (
    <FormMaker 
      isEditing={true}
      initialData={quizData}
      onSubmit={handleUpdate}
    />
  );
};

export default FormEdit;




