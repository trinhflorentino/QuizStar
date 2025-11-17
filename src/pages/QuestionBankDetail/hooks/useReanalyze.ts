import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../../../services/firebaseConfig";
import { matrixQuestionsJSONFromSnapshot } from "../../../components/AI/AIService";
import { cleanMatrixResult, mergeTemplateWithExisting } from "../../../utils/questionBankUtils";
import { PROMPT_VERSION as QUESTION_BANK_PROMPT_VERSION, MATRIX_ANALYSIS_PROMPT } from "../../QuestionBank";
import { useNotification } from "../../../contexts/NotificationContext";
import type { QuestionBank } from '../types';

export interface ReanalyzePreview {
  cleanResult: {
    title: string;
    chapters?: any[];
  };
  rawResponse?: string;
  prompt?: string;
}

export const useReanalyze = (
  questionBank: QuestionBank | null,
  setQuestionBank: React.Dispatch<React.SetStateAction<QuestionBank | null>>,
  bankId: string | undefined
) => {
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [reanalyzeError, setReanalyzeError] = useState<string | null>(null);
  const [reanalyzePreview, setReanalyzePreview] = useState<ReanalyzePreview | null>(null);

  const auth = getAuth();
  const { success, error, warning } = useNotification();

  const handleReanalyze = async () => {
    if (!questionBank?.matrixSource?.snapshot) {
      warning("Ngân hàng này chưa lưu dữ liệu nguồn để phân tích lại.");
      return;
    }

    setIsReanalyzing(true);
    setReanalyzeError(null);

    try {
      const prompt = questionBank.matrixSource?.prompt || MATRIX_ANALYSIS_PROMPT;
      const result = await matrixQuestionsJSONFromSnapshot(questionBank.matrixSource.snapshot, prompt);
      const resultText = typeof result === 'string' ? result : result.text;
      let parsed;
      try {
        parsed = JSON.parse(resultText);
      } catch (err) {
        throw new Error("Không thể đọc kết quả phân tích mới");
      }
      const cleanResult = cleanMatrixResult(parsed, parsed?.title || questionBank.title);
      setReanalyzePreview({
        cleanResult,
        rawResponse: resultText,
        prompt
      });
    } catch (err: any) {
      console.error("Lỗi khi phân tích lại:", err);
      setReanalyzeError(err.message);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const applyReanalysis = async () => {
    if (!reanalyzePreview || !auth.currentUser || !bankId || !questionBank) return;

    try {
      const templateChapters = reanalyzePreview.cleanResult.chapters || [];
      const mergedChapters = mergeTemplateWithExisting(questionBank.chapters, templateChapters);

      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      const updatedMatrixSource = {
        ...(questionBank.matrixSource || {}),
        prompt: reanalyzePreview.prompt || questionBank.matrixSource?.prompt || MATRIX_ANALYSIS_PROMPT,
        promptVersion: QUESTION_BANK_PROMPT_VERSION,
        rawResponse: reanalyzePreview.rawResponse,
        snapshot: questionBank.matrixSource?.snapshot,
        filename: questionBank.matrixSource?.filename || questionBank.filename,
        processedAt: serverTimestamp(),
        reanalyzedAt: serverTimestamp()
      };

      await updateDoc(bankDocRef, {
        title: reanalyzePreview.cleanResult.title,
        chapters: mergedChapters,
        matrixTemplate: templateChapters,
        matrixSource: updatedMatrixSource
      });

      setQuestionBank((prev) => {
        if (!prev) return null;
        
        // Ensure all chapters have required name property
        const normalizedChapters = mergedChapters.map(ch => ({
          ...ch,
          name: ch.name || `Chương ${mergedChapters.indexOf(ch) + 1}`
        }));
        
        return {
          ...prev,
          title: reanalyzePreview.cleanResult.title,
          chapters: normalizedChapters as QuestionBank['chapters'],
          matrixTemplate: templateChapters,
          matrixSource: {
            ...updatedMatrixSource,
            processedAt: new Date(),
            reanalyzedAt: new Date()
          }
        };
      });

      setReanalyzePreview(null);
      success("Đã cập nhật ngân hàng thành công!");
    } catch (err: any) {
      console.error("Không thể áp dụng kết quả phân tích lại:", err);
      error("Có lỗi xảy ra khi cập nhật ngân hàng: " + err.message);
    }
  };

  return {
    isReanalyzing,
    reanalyzeError,
    reanalyzePreview,
    setReanalyzePreview,
    handleReanalyze,
    applyReanalysis
  };
};




