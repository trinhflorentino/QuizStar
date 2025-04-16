import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { default as db } from "../../services/firebaseConfig";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore/lite";
import FormMaker from "./FormMaker";

function FormEdit() {
  const { pin } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // First get all exams from Paper_Setters collection
        const examRef = doc(db, "Paper_Setters", pin.toString());
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

        const quizData = quizDoc.data();
        const answerData = answerDoc.data();

        setQuizData({
          title: quizDoc.id,
          questions: quizData.question_question,
          answers: answerData.answer_answer
        });

      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [pin]);

  const handleUpdate = async (updatedData) => {
    try {
      // Update questions
      await updateDoc(
        doc(db, "Paper_Setters", pin.toString(), "Question_Papers_MCQ", quizData.title),
        {
          question_question: updatedData.questions
        }
      );

      // Update answers
      await updateDoc(
        doc(db, "Paper_Setters", pin.toString(), "Question_Papers_MCQ", `${quizData.title}_answerSheet`),
        {
          answer_answer: updatedData.answers
        }
      );

      navigate("/ExamsCreated/ExamResults/" + pin);
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz: " + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <FormMaker 
      isEditing={true}
      initialData={quizData}
      onSubmit={handleUpdate}
    />
  );
}

export default FormEdit;
