import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../../../services/firebaseConfig";
import type { QuestionBank } from '../types';

export const useQuestionBankData = () => {
  const { bankId } = useParams<{ bankId: string }>();
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchQuestionBank = async () => {
      try {
        if (auth.currentUser && bankId) {
          const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
          const bankDoc = await getDoc(bankDocRef);
          
          if (bankDoc.exists()) {
            setQuestionBank({
              id: bankDoc.id,
              ...bankDoc.data()
            } as QuestionBank);
          } else {
            console.error("Question bank not found");
            navigate("/QuestionBank");
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching question bank:", err);
        setLoading(false);
      }
    };
    
    fetchQuestionBank();
  }, [auth.currentUser, bankId, navigate]);

  return { questionBank, setQuestionBank, loading, bankId };
};




