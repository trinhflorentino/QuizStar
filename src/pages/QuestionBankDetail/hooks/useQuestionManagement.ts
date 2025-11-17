import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../../../services/firebaseConfig";
import { useNotification } from "../../../contexts/NotificationContext";
import type { QuestionBank, SelectedRequirement, Question } from '../types';

export interface QuestionOption {
  text: string;
  is_correct: boolean;
}

export const useQuestionManagement = (
  questionBank: QuestionBank | null,
  setQuestionBank: React.Dispatch<React.SetStateAction<QuestionBank | null>>,
  bankId: string | undefined
) => {
  const [selectedRequirement, setSelectedRequirement] = useState<SelectedRequirement | null>(null);
  const [requirementQuestions, setRequirementQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<{ question: Question; questionIndex: number } | null>(null);
  const [editQuestionText, setEditQuestionText] = useState<string>("");
  const [editQuestionOptions, setEditQuestionOptions] = useState<QuestionOption[]>([]);
  const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState<boolean>(false);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState<boolean>(false);

  const auth = getAuth();
  const { success, error, warning } = useNotification();

  const openRequirementQuestions = (item: any, levelName: string, level: string, chapterIndex: number, subContentIndex: number, itemIndex: number) => {
    if (!questionBank) return;
    
    const chapter = questionBank.chapters![chapterIndex];
    const subContent = chapter?.subContents?.[subContentIndex];
    const requirementsObj = subContent?.requirements;
    const requirements = requirementsObj ? (requirementsObj[level as keyof typeof requirementsObj] || []) as any[] : [];
    
    let questions: Question[] = [];
    let startIdx = itemIndex + 1;
    let endIdx = (requirements as any[]).length;
    
    // Find the next template item or end of array
    for (let i = startIdx; i < (requirements as any[]).length; i++) {
      if ((requirements as any[])[i] && (requirements as any[])[i]._template) {
        endIdx = i;
        break;
      }
    }
    
    // Collect questions in this range
    for (let i = startIdx; i < endIdx; i++) {
      const req = (requirements as any[])[i];
      if (req && !req._template && req.questionId) {
        questions.push(req);
      }
    }
    
    setSelectedRequirement({
      item,
      levelName,
      level,
      chapterIndex,
      subContentIndex,
      itemIndex,
      chapterName: questionBank.chapters![chapterIndex]?.name || '',
      subContentName: questionBank.chapters![chapterIndex]?.subContents?.[subContentIndex]?.name || ''
    });
    setRequirementQuestions(questions);
  };

  const closeRequirementQuestions = () => {
    setSelectedRequirement(null);
    setRequirementQuestions([]);
    setSelectedQuestions(new Set());
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.size === requirementQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(requirementQuestions.map(q => q.questionId).filter(id => id)));
    }
  };

  const openEditQuestion = (question: Question, questionIndex: number) => {
    setEditingQuestion({ question, questionIndex });
    setEditQuestionText(question.description || question.question || question.question_text || "");
    
    // Extract options if MCQ
    if (question.formattedQuestion?.options) {
      setEditQuestionOptions(question.formattedQuestion.options.map((opt: any) => ({
        text: opt.option || opt.text || "",
        is_correct: opt.is_correct || false
      })));
    } else {
      setEditQuestionOptions([]);
    }
  };

  const closeEditQuestion = () => {
    setEditingQuestion(null);
    setEditQuestionText("");
    setEditQuestionOptions([]);
  };

  const refreshQuestionsList = (updatedChapters: any[], selectedRequirement: SelectedRequirement) => {
    const { chapterIndex, subContentIndex, level, itemIndex } = selectedRequirement;
    const reqObj = updatedChapters[chapterIndex].subContents[subContentIndex].requirements!;
    const updatedRequirements = reqObj[level as keyof typeof reqObj] as any[];
    let questions: Question[] = [];
    let newStartIdx = itemIndex + 1;
    let newEndIdx = updatedRequirements.length;
    
    // Find the next template item
    for (let i = newStartIdx; i < updatedRequirements.length; i++) {
      if (updatedRequirements[i] && updatedRequirements[i]._template) {
        newEndIdx = i;
        break;
      }
    }
    
    // Collect questions in this range
    for (let i = newStartIdx; i < newEndIdx; i++) {
      const req = updatedRequirements[i];
      if (req && !req._template && req.questionId) {
        questions.push(req);
      }
    }
    
    setRequirementQuestions(questions);
  };

  const handleEditQuestionSubmit = async () => {
    if (!editingQuestion || !selectedRequirement || !auth.currentUser || !bankId || !questionBank) return;

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      const { chapterIndex, subContentIndex, level, itemIndex } = selectedRequirement;
      const reqObj = updatedChapters[chapterIndex].subContents[subContentIndex].requirements!;
      const requirements = reqObj[level as keyof typeof reqObj] as any[];
      
      // Find the range of questions for this requirement item
      let startIdx = itemIndex + 1;
      let endIdx = requirements.length;
      
      // Find the next template item to determine the end boundary
      for (let i = startIdx; i < requirements.length; i++) {
        if (requirements[i] && requirements[i]._template) {
          endIdx = i;
          break;
        }
      }
      
      // Find the question by matching questionId within the valid range
      let foundIndex = -1;
      
      for (let i = startIdx; i < endIdx; i++) {
        if (requirements[i] && !requirements[i]._template && 
            requirements[i].questionId === editingQuestion.question.questionId) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex === -1) {
        error("Không tìm thấy câu hỏi để sửa");
        return;
      }
      
      // Update question
      const updatedQuestion = {
        ...requirements[foundIndex],
        description: editQuestionText
      };
      
      // Update options if MCQ
      if (editQuestionOptions.length > 0) {
        updatedQuestion.formattedQuestion = {
          ...updatedQuestion.formattedQuestion,
          options: editQuestionOptions.map(opt => ({
            option: opt.text,
            is_correct: opt.is_correct
          }))
        };
        
        // Update correctAnswer
        const correctIndex = editQuestionOptions.findIndex(opt => opt.is_correct);
        if (correctIndex !== -1) {
          updatedQuestion.correctAnswer = correctIndex;
        }
      }
      
      requirements[foundIndex] = updatedQuestion;
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev!,
        chapters: updatedChapters
      }));
      
      // Refresh questions list
      refreshQuestionsList(updatedChapters, selectedRequirement);
      
      closeEditQuestion();
      success("Đã cập nhật câu hỏi thành công!");
    } catch (err: any) {
      console.error("Error updating question:", err);
      error("Có lỗi xảy ra khi cập nhật câu hỏi: " + err.message);
    }
  };

  const openDeleteQuestionModal = (question: Question) => {
    setDeletingQuestion(question);
    setIsDeleteQuestionModalOpen(true);
  };

  const closeDeleteQuestionModal = () => {
    setDeletingQuestion(null);
    setIsDeleteQuestionModalOpen(false);
  };

  const handleDeleteQuestion = async () => {
    if (!deletingQuestion || !selectedRequirement || !auth.currentUser || !bankId || !questionBank) return;

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      const { chapterIndex, subContentIndex, level, itemIndex } = selectedRequirement;
      const reqObj = updatedChapters[chapterIndex].subContents[subContentIndex].requirements!;
      const requirements = reqObj[level as keyof typeof reqObj] as any[];
      
      // Find the range of questions for this requirement item
      let startIdx = itemIndex + 1;
      let endIdx = requirements.length;
      
      // Find the next template item to determine the end boundary
      for (let i = startIdx; i < requirements.length; i++) {
        if (requirements[i] && requirements[i]._template) {
          endIdx = i;
          break;
        }
      }
      
      // Find and remove the question within the valid range
      let foundIndex = -1;
      
      for (let i = startIdx; i < endIdx; i++) {
        if (requirements[i] && !requirements[i]._template && 
            requirements[i].questionId === deletingQuestion.questionId) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex === -1) {
        error("Không tìm thấy câu hỏi để xóa");
        return;
      }
      
      // Remove the question
      requirements.splice(foundIndex, 1);
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev!,
        chapters: updatedChapters
      }));
      
      // Refresh questions list
      refreshQuestionsList(updatedChapters, selectedRequirement);
      
      closeDeleteQuestionModal();
      success("Đã xóa câu hỏi thành công!");
    } catch (err: any) {
      console.error("Error deleting question:", err);
      error("Có lỗi xảy ra khi xóa câu hỏi: " + err.message);
    }
  };

  const openDeleteSelectedModal = () => {
    if (selectedQuestions.size === 0) {
      warning("Vui lòng chọn ít nhất một câu hỏi để xóa");
      return;
    }
    setIsDeleteSelectedModalOpen(true);
  };

  const closeDeleteSelectedModal = () => {
    setIsDeleteSelectedModalOpen(false);
  };

  const handleDeleteSelectedQuestions = async () => {
    if (selectedQuestions.size === 0 || !selectedRequirement || !auth.currentUser || !bankId || !questionBank) {
      error("Không có câu hỏi nào được chọn để xóa");
      return;
    }

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      const { chapterIndex, subContentIndex, level, itemIndex } = selectedRequirement;
      const reqObj = updatedChapters[chapterIndex].subContents[subContentIndex].requirements!;
      const requirements = reqObj[level as keyof typeof reqObj] as any[];
      
      // Find the range of questions for this requirement item
      let startIdx = itemIndex + 1;
      let endIdx = requirements.length;
      
      // Find the next template item to determine the end boundary
      for (let i = startIdx; i < requirements.length; i++) {
        if (requirements[i] && requirements[i]._template) {
          endIdx = i;
          break;
        }
      }
      
      // Find all selected questions and collect their indices (in reverse order to avoid index shifting)
      const indicesToRemove: number[] = [];
      
      // Only look within the valid range for this requirement
      for (let i = startIdx; i < endIdx; i++) {
        if (requirements[i] && !requirements[i]._template && 
            requirements[i].questionId && selectedQuestions.has(requirements[i].questionId)) {
          indicesToRemove.push(i);
        }
      }
      
      // Validate: Only delete questions that are actually selected (double-check)
      const validIndicesToRemove = indicesToRemove.filter(index => {
        const question = requirements[index];
        return question && 
               !question._template && 
               question.questionId && 
               selectedQuestions.has(question.questionId);
      });
      
      if (validIndicesToRemove.length === 0) {
        error("Không tìm thấy câu hỏi đã chọn để xóa");
        return;
      }
      
      // Remove questions in reverse order to avoid index shifting issues
      validIndicesToRemove.sort((a, b) => b - a).forEach(index => {
        requirements.splice(index, 1);
      });
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev!,
        chapters: updatedChapters
      }));
      
      // Clear selection
      setSelectedQuestions(new Set());
      
      // Refresh questions list
      refreshQuestionsList(updatedChapters, selectedRequirement);
      
      closeDeleteSelectedModal();
      success(`Đã xóa ${validIndicesToRemove.length} câu hỏi thành công!`);
    } catch (err: any) {
      console.error("Error deleting questions:", err);
      error("Có lỗi xảy ra khi xóa câu hỏi: " + err.message);
      closeDeleteSelectedModal();
    }
  };

  return {
    selectedRequirement,
    requirementQuestions,
    editingQuestion,
    editQuestionText,
    editQuestionOptions,
    isDeleteQuestionModalOpen,
    deletingQuestion,
    selectedQuestions,
    isDeleteSelectedModalOpen,
    openRequirementQuestions,
    closeRequirementQuestions,
    toggleQuestionSelection,
    toggleSelectAll,
    openEditQuestion,
    closeEditQuestion,
    handleEditQuestionSubmit,
    openDeleteQuestionModal,
    closeDeleteQuestionModal,
    handleDeleteQuestion,
    openDeleteSelectedModal,
    closeDeleteSelectedModal,
    handleDeleteSelectedQuestions,
    setEditQuestionText,
    setEditQuestionOptions
  };
};




