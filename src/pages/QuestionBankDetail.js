import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../services/firebaseConfig";
import { MathJax } from "better-react-mathjax";
import { IoChevronBack, IoChevronDown, IoChevronForward, IoAddCircleOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { matrixQuestionsJSONFromSnapshot } from "../components/AI/AIService";
import { cleanMatrixResult, mergeTemplateWithExisting } from "../utils/questionBankUtils";
import { PROMPT_VERSION as QUESTION_BANK_PROMPT_VERSION, MATRIX_ANALYSIS_PROMPT } from "./QuestionBank";
import { useNotification } from "../contexts/NotificationContext";

function QuestionBankDetail() {
  const { bankId } = useParams();
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedSubContents, setExpandedSubContents] = useState({});
  
  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteParentId, setDeleteParentId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteLevel, setDeleteLevel] = useState(null);

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editType, setEditType] = useState(null);
  const [editParentId, setEditParentId] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editLevel, setEditLevel] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  // Add states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState(null);
  const [addParentIndex, setAddParentIndex] = useState(null);
  const [addLevel, setAddLevel] = useState(null);
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");

  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalyzeError, setReanalyzeError] = useState(null);
  const [reanalyzePreview, setReanalyzePreview] = useState(null);
  
  // Question view states
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [requirementQuestions, setRequirementQuestions] = useState([]);
  
  // Question edit/delete states
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionOptions, setEditQuestionOptions] = useState([]);
  const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const { success, error, warning, info } = useNotification();

  const getTimestampValue = (value) => {
    if (!value) return 0;
    if (typeof value.toMillis === "function") return value.toMillis();
    if (value.seconds) return value.seconds * 1000;
    if (value instanceof Date) return value.getTime();
    if (typeof value === "number") return value;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatTimestamp = (value) => {
    const time = getTimestampValue(value);
    if (!time) return "—";
    return new Date(time).toLocaleString();
  };
  
  useEffect(() => {
    const fetchQuestionBank = async () => {
      try {
        if (auth.currentUser) {
          const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
          const bankDoc = await getDoc(bankDocRef);
          
          if (bankDoc.exists()) {
            setQuestionBank({
              id: bankDoc.id,
              ...bankDoc.data()
            });
          } else {
            console.error("Question bank not found");
            navigate("/QuestionBank");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching question bank:", error);
        setLoading(false);
      }
    };
    
    fetchQuestionBank();
  }, [auth.currentUser, bankId, navigate]);
  
  const toggleChapter = (chapterIndex) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };
  
  const toggleSubContent = (key) => {
    setExpandedSubContents((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Delete functionality
  const openDeleteModal = (type, target, parentId = null, index = null, level = null) => {
    setDeleteType(type);
    setDeleteTarget(target);
    setDeleteParentId(parentId);
    setDeleteIndex(index);
    setDeleteLevel(level);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteType(null);
    setDeleteTarget(null);
    setDeleteParentId(null);
    setDeleteIndex(null);
    setDeleteLevel(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      let updatedChapters = [...questionBank.chapters];

      // Handle different delete types
      if (deleteType === 'chapter') {
        // Delete chapter
        updatedChapters.splice(deleteIndex, 1);
      } else if (deleteType === 'subContent') {
        // Delete subContent
        updatedChapters[deleteParentId].subContents.splice(deleteIndex, 1);
      } else if (deleteType === 'requirement') {
        // Delete requirement
        updatedChapters[deleteParentId.chapterIndex].subContents[deleteParentId.subContentIndex].requirements[deleteLevel].splice(deleteIndex, 1);
      }

      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });

      // Update local state
      setQuestionBank(prev => ({
        ...prev,
        chapters: updatedChapters
      }));

      closeDeleteModal();
      success("Đã xóa mục thành công!");
    } catch (err) {
      console.error("Error deleting item:", err);
      error("Có lỗi xảy ra khi xóa mục");
    }
  };
  
  // Edit functionality
  const openEditModal = (type, target, parentId = null, index = null, level = null) => {
    setEditType(type);
    setEditTarget(target);
    setEditParentId(parentId);
    setEditIndex(index);
    setEditLevel(level);
    
    if (type === 'chapter' || type === 'subContent') {
      setEditName(target.name || "");
    } else if (type === 'requirement') {
      setEditDescription(target.description || "");
    }
    
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditType(null);
    setEditTarget(null);
    setEditParentId(null);
    setEditIndex(null);
    setEditLevel(null);
    setEditName("");
    setEditDescription("");
  };
  
  const handleEdit = async () => {
    if (!editTarget) return;
    
    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      let updatedChapters = [...questionBank.chapters];
      
      // Handle different edit types
      if (editType === 'chapter') {
        // Edit chapter - remove description
        updatedChapters[editIndex] = {
          ...updatedChapters[editIndex],
          name: editName
        };
      } else if (editType === 'subContent') {
        // Edit subContent - remove description
        updatedChapters[editParentId].subContents[editIndex] = {
          ...updatedChapters[editParentId].subContents[editIndex],
          name: editName
        };
      } else if (editType === 'requirement') {
        // Edit requirement - keep description
        updatedChapters[editParentId.chapterIndex].subContents[editParentId.subContentIndex]
          .requirements[editLevel][editIndex] = {
            ...updatedChapters[editParentId.chapterIndex].subContents[editParentId.subContentIndex]
              .requirements[editLevel][editIndex],
            description: editDescription
          };
      }
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev,
        chapters: updatedChapters
      }));
      
      closeEditModal();
      success("Đã cập nhật mục thành công!");
    } catch (err) {
      console.error("Error editing item:", err);
      error("Có lỗi xảy ra khi chỉnh sửa mục");
    }
  };
  
  // Add functionality
  const openAddModal = (type, parentIndex = null, level = null) => {
    setAddType(type);
    setAddParentIndex(parentIndex);
    setAddLevel(level);
    
    // Reset form fields
    setAddName("");
    setAddDescription("");
    
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddType(null);
    setAddParentIndex(null);
    setAddLevel(null);
    setAddName("");
    setAddDescription("");
  };

  const handleReanalyze = async () => {
    if (!questionBank?.matrixSource?.snapshot) {
      warning("Ngân hàng này chưa lưu dữ liệu nguồn để phân tích lại.");
      return;
    }

    setIsReanalyzing(true);
    setReanalyzeError(null);

    try {
      const prompt = questionBank.matrixSource?.prompt || MATRIX_ANALYSIS_PROMPT;
      const resultText = await matrixQuestionsJSONFromSnapshot(questionBank.matrixSource.snapshot, prompt);
      let parsed;
      try {
        parsed = JSON.parse(resultText);
      } catch (error) {
        throw new Error("Không thể đọc kết quả phân tích mới");
      }
      const cleanResult = cleanMatrixResult(parsed, parsed?.title || questionBank.title);
      setReanalyzePreview({
        cleanResult,
        rawResponse: resultText,
        prompt
      });
    } catch (error) {
      console.error("Lỗi khi phân tích lại:", error);
      setReanalyzeError(error.message);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const applyReanalysis = async () => {
    if (!reanalyzePreview || !auth.currentUser) return;

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

      setQuestionBank((prev) => ({
        ...prev,
        title: reanalyzePreview.cleanResult.title,
        chapters: mergedChapters,
        matrixTemplate: templateChapters,
        matrixSource: {
          ...updatedMatrixSource,
          processedAt: new Date(),
          reanalyzedAt: new Date()
        }
      }));

      setReanalyzePreview(null);
      success("Đã cập nhật ngân hàng thành công!");
    } catch (err) {
      console.error("Không thể áp dụng kết quả phân tích lại:", err);
      error("Có lỗi xảy ra khi cập nhật ngân hàng: " + err.message);
    }
  };

  const handleAdd = async () => {
    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      let updatedChapters = [...questionBank.chapters];
      
      // Handle different add types
      if (addType === 'chapter') {
        // Add new chapter - remove description
        const newChapter = {
          name: addName,
          subContents: []
        };
        updatedChapters.push(newChapter);
        
        // Auto-expand new chapter
        setExpandedChapters(prev => ({
          ...prev,
          [updatedChapters.length - 1]: true
        }));
      } else if (addType === 'subContent') {
        // Add subContent to chapter - remove description
        const newSubContent = {
          name: addName,
          requirements: {
            nhanBiet: [],
            thongHieu: [],
            vanDung: [],
            vanDungCao: []
          }
        };
        
        if (!updatedChapters[addParentIndex].subContents) {
          updatedChapters[addParentIndex].subContents = [];
        }
        
        updatedChapters[addParentIndex].subContents.push(newSubContent);
        
        // Auto-expand new subContent
        const key = `${addParentIndex}-${updatedChapters[addParentIndex].subContents.length - 1}`;
        setExpandedSubContents(prev => ({
          ...prev,
          [key]: true
        }));
      } else if (addType === 'requirement') {
        // Add requirement to subContent - keep description
        const newRequirement = {
          description: addDescription
        };
        
        if (!updatedChapters[addParentIndex.chapterIndex].subContents[addParentIndex.subContentIndex].requirements[addLevel]) {
          updatedChapters[addParentIndex.chapterIndex].subContents[addParentIndex.subContentIndex].requirements[addLevel] = [];
        }
        
        updatedChapters[addParentIndex.chapterIndex].subContents[addParentIndex.subContentIndex]
          .requirements[addLevel].push(newRequirement);
      }
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev,
        chapters: updatedChapters
      }));
      
      closeAddModal();
      success("Đã thêm mục thành công!");
    } catch (err) {
      console.error("Error adding item:", err);
      error("Có lỗi xảy ra khi thêm mục");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!questionBank) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Không tìm thấy ngân hàng câu hỏi</h1>
        <button 
          onClick={() => navigate("/QuestionBank")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <IoChevronBack />
          <span>Quay lại danh sách</span>
        </button>
      </div>
    );
  }
  
  // Helper function to render requirement items by difficulty level
  const openRequirementQuestions = (item, levelName, level, chapterIndex, subContentIndex, itemIndex) => {
    // Get all questions for this requirement item
    // Questions are stored after the template item in the requirements array
    const requirements = questionBank.chapters[chapterIndex]?.subContents[subContentIndex]?.requirements[level] || [];
    
    // Find questions that belong to this requirement item
    // Questions are typically stored after the template item
    let questions = [];
    let startIdx = itemIndex + 1;
    
    // Find the next template item or end of array
    let endIdx = requirements.length;
    for (let i = startIdx; i < requirements.length; i++) {
      if (requirements[i] && requirements[i]._template) {
        endIdx = i;
        break;
      }
    }
    
    // Collect questions in this range
    for (let i = startIdx; i < endIdx; i++) {
      const req = requirements[i];
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
      chapterName: questionBank.chapters[chapterIndex]?.name,
      subContentName: questionBank.chapters[chapterIndex]?.subContents[subContentIndex]?.name
    });
    setRequirementQuestions(questions);
  };

  const closeRequirementQuestions = () => {
    setSelectedRequirement(null);
    setRequirementQuestions([]);
    setSelectedQuestions(new Set());
  };

  const toggleQuestionSelection = (questionId) => {
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

  const openEditQuestion = (question, questionIndex) => {
    setEditingQuestion({ question, questionIndex });
    setEditQuestionText(question.description || question.question || question.question_text || "");
    
    // Extract options if MCQ
    if (question.formattedQuestion?.options) {
      setEditQuestionOptions(question.formattedQuestion.options.map(opt => ({
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

  const handleEditQuestionSubmit = async () => {
    if (!editingQuestion || !selectedRequirement || !auth.currentUser) return;

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      const { chapterIndex, subContentIndex, level, itemIndex } = selectedRequirement;
      const requirements = updatedChapters[chapterIndex].subContents[subContentIndex].requirements[level];
      
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
        ...prev,
        chapters: updatedChapters
      }));
      
      // Refresh questions list using updated data
      const updatedRequirements = updatedChapters[chapterIndex].subContents[subContentIndex].requirements[level];
      let questions = [];
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
      
      // Update the questions list
      setRequirementQuestions(questions);
      
      closeEditQuestion();
      success("Đã cập nhật câu hỏi thành công!");
    } catch (err) {
      console.error("Error updating question:", err);
      error("Có lỗi xảy ra khi cập nhật câu hỏi: " + err.message);
    }
  };

  const openDeleteQuestionModal = (question) => {
    setDeletingQuestion(question);
    setIsDeleteQuestionModalOpen(true);
  };

  const closeDeleteQuestionModal = () => {
    setDeletingQuestion(null);
    setIsDeleteQuestionModalOpen(false);
  };

  const handleDeleteQuestion = async () => {
    if (!deletingQuestion || !selectedRequirement || !auth.currentUser) return;

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      const { chapterIndex, subContentIndex, level, itemIndex } = selectedRequirement;
      const requirements = updatedChapters[chapterIndex].subContents[subContentIndex].requirements[level];
      
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
        ...prev,
        chapters: updatedChapters
      }));
      
      // Refresh questions list using updated data
      const updatedRequirements = updatedChapters[chapterIndex].subContents[subContentIndex].requirements[level];
      let questions = [];
      let newStartIdx = itemIndex + 1;
      let newEndIdx = updatedRequirements.length;
      
      // Find the next template item
      for (let i = newStartIdx; i < updatedRequirements.length; i++) {
        if (updatedRequirements[i] && updatedRequirements[i]._template) {
          newEndIdx = i;
          break;
        }
      }
      
      // Collect remaining questions in this range
      for (let i = newStartIdx; i < newEndIdx; i++) {
        const req = updatedRequirements[i];
        if (req && !req._template && req.questionId) {
          questions.push(req);
        }
      }
      
      // Update the questions list
      setRequirementQuestions(questions);
      
      closeDeleteQuestionModal();
      success("Đã xóa câu hỏi thành công!");
    } catch (err) {
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
    if (selectedQuestions.size === 0 || !selectedRequirement || !auth.currentUser) {
      error("Không có câu hỏi nào được chọn để xóa");
      return;
    }

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      const { chapterIndex, subContentIndex, level, itemIndex } = selectedRequirement;
      const requirements = updatedChapters[chapterIndex].subContents[subContentIndex].requirements[level];
      
      // Find the range of questions for this requirement item
      // Questions are stored after the template item (at itemIndex) until the next template
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
      const indicesToRemove = [];
      
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
      
      // Only remove questions that are actually in the selectedQuestions set
      // Remove questions in reverse order to avoid index shifting issues
      validIndicesToRemove.sort((a, b) => b - a).forEach(index => {
        requirements.splice(index, 1);
      });
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev,
        chapters: updatedChapters
      }));
      
      // Clear selection
      setSelectedQuestions(new Set());
      
      // Refresh questions list using updated data
      // Recalculate questions from updated chapters
      const updatedRequirements = updatedChapters[chapterIndex].subContents[subContentIndex].requirements[level];
      let questions = [];
      let newStartIdx = itemIndex + 1;
      let newEndIdx = updatedRequirements.length;
      
      // Find the next template item
      for (let i = newStartIdx; i < updatedRequirements.length; i++) {
        if (updatedRequirements[i] && updatedRequirements[i]._template) {
          newEndIdx = i;
          break;
        }
      }
      
      // Collect remaining questions in this range
      for (let i = newStartIdx; i < newEndIdx; i++) {
        const req = updatedRequirements[i];
        if (req && !req._template && req.questionId) {
          questions.push(req);
        }
      }
      
      // Update the questions list
      setRequirementQuestions(questions);
      
      closeDeleteSelectedModal();
      success(`Đã xóa ${validIndicesToRemove.length} câu hỏi thành công!`);
    } catch (err) {
      console.error("Error deleting questions:", err);
      error("Có lỗi xảy ra khi xóa câu hỏi: " + err.message);
      closeDeleteSelectedModal();
    }
  };

  const renderRequirements = (items, levelName, level, subContent, chapterIndex, subContentIndex) => {
    if (!items) items = [];
    
    // Count questions for each requirement item
    const requirements = subContent.requirements?.[level] || [];
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-medium text-sm text-gray-700">{levelName}</h5>
          <button 
            className="text-blue-500 hover:text-blue-700 p-1 flex items-center text-sm"
            onClick={() => openAddModal('requirement', { chapterIndex, subContentIndex }, level)}
            title={`Thêm yêu cầu ${levelName}`}
          >
            <IoAddCircleOutline className="mr-1" size={16} />
            <span>Thêm</span>
          </button>
        </div>
        
        <div className="space-y-2 ml-4">
          {items.length > 0 ? (
            items.map((item, index) => {
              // Count questions for this requirement item
              let questionCount = 0;
              let startIdx = index + 1;
              let endIdx = requirements.length;
              
              // Find the next template item
              for (let i = startIdx; i < requirements.length; i++) {
                if (requirements[i] && requirements[i]._template) {
                  endIdx = i;
                  break;
                }
              }
              
              // Count questions in this range
              for (let i = startIdx; i < endIdx; i++) {
                if (requirements[i] && !requirements[i]._template && requirements[i].questionId) {
                  questionCount++;
                }
              }
              
              return (
                <div 
                  key={index} 
                  className={`p-2 rounded-md flex justify-between items-center ${
                    questionCount > 0 ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'bg-gray-50'
                  }`}
                  onClick={questionCount > 0 ? () => openRequirementQuestions(item, levelName, level, chapterIndex, subContentIndex, index) : undefined}
                  title={questionCount > 0 ? `Click để xem ${questionCount} câu hỏi` : 'Chưa có câu hỏi'}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <p className="text-sm">
                      {item.description}
                    </p>
                    {questionCount > 0 && (
                      <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                        {questionCount} câu
                      </span>
                    )}
                  </div>
                  <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="text-blue-500 hover:text-blue-700 p-1 mr-1"
                      onClick={() => openEditModal('requirement', item, { chapterIndex, subContentIndex }, index, level)}
                      title="Chỉnh sửa"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 p-1"
                      onClick={() => openDeleteModal('requirement', item, { chapterIndex, subContentIndex }, index, level)}
                      title="Xóa"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 italic text-sm">Chưa có yêu cầu nào.</p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/QuestionBank")}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <IoChevronBack />
          <span>Quay lại</span>
        </button>
        <h1 className="text-3xl font-bold">{questionBank.title}</h1>
        <button
          onClick={() => navigate(`/QuestionBank/${bankId}/ImportExamQuestions`)}
          className="ml-auto flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <FiUpload className="mr-1" />
          <span>Import câu hỏi từ đề thi</span>
        </button>
      </div>

      {questionBank.matrixSource && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold">Thông tin phân tích</h2>
              <p className="text-sm text-gray-500 mt-1">Nguồn: {questionBank.filename || questionBank.matrixSource.filename || "Không xác định"}</p>
            </div>
            <button
              onClick={handleReanalyze}
              disabled={isReanalyzing}
              className={`px-3 py-1.5 rounded text-sm border ${
                isReanalyzing ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
              }`}
            >
              {isReanalyzing ? "Đang phân tích lại..." : "Phân tích lại bằng AI"}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Phiên bản prompt:</span> {questionBank.matrixSource.promptVersion || "Không rõ"}
            </div>
            <div>
              <span className="font-medium">Phân tích gần nhất:</span> {formatTimestamp(questionBank.matrixSource.processedAt || questionBank.createdAt)}
            </div>
            {questionBank.matrixSource.reanalyzedAt && (
              <div>
                <span className="font-medium">Phân tích lại:</span> {formatTimestamp(questionBank.matrixSource.reanalyzedAt)}
              </div>
            )}
            {questionBank.matrixTemplate && (
              <div>
                <span className="font-medium">Số chương trong mẫu:</span> {questionBank.matrixTemplate.length}
              </div>
            )}
          </div>
          {reanalyzeError && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded p-3">
              {reanalyzeError}
            </div>
          )}
        </div>
      )}

      {reanalyzePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">Cập nhật cấu trúc từ phân tích mới</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Đề xuất tiêu đề: <span className="font-medium">{reanalyzePreview.cleanResult.title}</span>
                </p>
              </div>
              <button onClick={() => setReanalyzePreview(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-4 mb-6">
              {reanalyzePreview.cleanResult.chapters?.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="border border-gray-200 rounded-lg">
                  <div className="px-4 py-2 bg-gray-100 font-semibold">
                    Chương {chapterIndex + 1}: {chapter.name}
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    {chapter.subContents?.map((sub, subIndex) => (
                      <div key={subIndex} className="border border-gray-100 rounded-lg p-3">
                        <div className="font-medium text-gray-800 mb-2">
                          {chapterIndex + 1}.{subIndex + 1} {sub.name}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {Object.entries(sub.requirements || {}).map(([level, items]) => (
                            <div key={level} className="bg-gray-50 border border-gray-100 rounded p-2">
                              <div className="uppercase tracking-wide text-[11px] text-gray-500">{level}</div>
                              <div className="mt-1 text-gray-700">{items?.length || 0} yêu cầu</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded p-3 mb-4">
              Việc áp dụng sẽ giữ nguyên các câu hỏi hiện có và thêm lại mô tả yêu cầu từ bản phân tích mới.
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReanalyzePreview(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={applyReanalysis}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Áp dụng cấu trúc mới
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nội dung theo chương/chủ đề</h2>
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded"
            onClick={() => openAddModal('chapter')}
          >
            <IoAddCircleOutline className="mr-1" size={18} />
            <span>Thêm chương mới</span>
          </button>
        </div>
        
        {questionBank.chapters?.length > 0 ? (
          <div className="space-y-4">
            {questionBank.chapters.map((chapter, chapterIndex) => (
              <div 
                key={chapterIndex} 
                className="border border-gray-200 rounded-lg"
              >
                {/* Chapter Header */}
                <div 
                  className={`flex justify-between items-center p-3 cursor-pointer ${
                    expandedChapters[chapterIndex] ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex-1" onClick={() => toggleChapter(chapterIndex)}>
                    <h3 className="font-medium text-base">{chapter.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-blue-500 hover:text-blue-700 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddModal('subContent', chapterIndex);
                      }}
                      title="Thêm nội dung con"
                    >
                      <IoAddCircleOutline size={18} />
                    </button>
                    <button 
                      className="text-blue-500 hover:text-blue-700 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal('chapter', chapter, null, chapterIndex);
                      }}
                      title="Chỉnh sửa chương"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal('chapter', chapter, null, chapterIndex);
                      }}
                      title="Xóa chương"
                    >
                      <MdDelete size={18} />
                    </button>
                    <div className="text-gray-500" onClick={() => toggleChapter(chapterIndex)}>
                      {expandedChapters[chapterIndex] ? (
                        <IoChevronDown size={18} />
                      ) : (
                        <IoChevronForward size={18} />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Chapter Content - Sub Contents */}
                {expandedChapters[chapterIndex] && (
                  <div className="border-t border-gray-200 px-4 py-2">
                    <div className="flex justify-between items-center my-2">
                      <span className="text-sm text-gray-600 font-medium">Nội dung con</span>
                    </div>
                    
                    {chapter.subContents && chapter.subContents.length > 0 ? (
                      <div className="ml-4 space-y-3 my-4">
                        {chapter.subContents.map((subContent, subContentIndex) => (
                          <div 
                            key={`${chapterIndex}-${subContentIndex}`}
                            className="border border-gray-200 rounded-lg"
                          >
                            {/* Sub Content Header */}
                            <div 
                              className={`flex justify-between items-center p-3 cursor-pointer ${
                                expandedSubContents[`${chapterIndex}-${subContentIndex}`] ? "bg-gray-50" : ""
                              }`}
                            >
                              <div className="flex-1" onClick={() => toggleSubContent(`${chapterIndex}-${subContentIndex}`)}>
                                <h4 className="font-medium text-base">{subContent.name}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="text-blue-500 hover:text-blue-700 p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal('subContent', subContent, chapterIndex, subContentIndex);
                                  }}
                                  title="Chỉnh sửa nội dung con"
                                >
                                  <MdEdit size={18} />
                                </button>
                                <button 
                                  className="text-red-500 hover:text-red-700 p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal('subContent', subContent, chapterIndex, subContentIndex);
                                  }}
                                  title="Xóa nội dung con"
                                >
                                  <MdDelete size={18} />
                                </button>
                                <div className="text-gray-500" onClick={() => toggleSubContent(`${chapterIndex}-${subContentIndex}`)}>
                                  {expandedSubContents[`${chapterIndex}-${subContentIndex}`] ? (
                                    <IoChevronDown size={18} />
                                  ) : (
                                    <IoChevronForward size={18} />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Sub Content Requirements */}
                            {expandedSubContents[`${chapterIndex}-${subContentIndex}`] && (
                              <div className="border-t border-gray-200 p-3">
                                {renderRequirements(subContent.requirements?.nhanBiet, "Nhận biết", "nhanBiet", subContent, chapterIndex, subContentIndex)}
                                {renderRequirements(subContent.requirements?.thongHieu, "Thông hiểu", "thongHieu", subContent, chapterIndex, subContentIndex)}
                                {renderRequirements(subContent.requirements?.vanDung, "Vận dụng", "vanDung", subContent, chapterIndex, subContentIndex)}
                                {renderRequirements(subContent.requirements?.vanDungCao, "Vận dụng cao", "vanDungCao", subContent, chapterIndex, subContentIndex)}
                                
                                {!subContent.requirements?.nhanBiet?.length && 
                                !subContent.requirements?.thongHieu?.length && 
                                !subContent.requirements?.vanDung?.length && 
                                !subContent.requirements?.vanDungCao?.length && (
                                  <p className="text-gray-500 italic">Không có yêu cầu nào.</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic ml-4 my-3">Không có nội dung con nào.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Không tìm thấy nội dung nào.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-6 text-gray-700">
              {deleteType === 'chapter' && `Bạn có chắc chắn muốn xóa chương "${deleteTarget.name}" và tất cả nội dung con của nó?`}
              {deleteType === 'subContent' && `Bạn có chắc chắn muốn xóa nội dung "${deleteTarget.name}" và tất cả yêu cầu của nó?`}
              {deleteType === 'requirement' && `Bạn có chắc chắn muốn xóa yêu cầu này?`}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editType === 'chapter' && 'Chỉnh sửa chương'}
              {editType === 'subContent' && 'Chỉnh sửa nội dung con'}
              {editType === 'requirement' && 'Chỉnh sửa yêu cầu'}
            </h2>
            
            {/* Edit Form */}
            <div className="mb-4">
              {(editType === 'chapter' || editType === 'subContent') && (
                <>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                    Tên {editType === 'chapter' ? 'chương' : 'nội dung con'}
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </>
              )}
            </div>
            
            {editType === 'requirement' && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                  Nội dung yêu cầu
                </label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                />
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                onClick={closeEditModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleEdit}
                disabled={
                  ((editType === 'chapter' || editType === 'subContent') && !editName) ||
                  (editType === 'requirement' && !editDescription)
                }
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {addType === 'chapter' && 'Thêm chương mới'}
              {addType === 'subContent' && 'Thêm nội dung con'}
              {addType === 'requirement' && 'Thêm yêu cầu'}
            </h2>
            
            {/* Add Form */}
            {(addType === 'chapter' || addType === 'subContent') && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-name">
                  Tên {addType === 'chapter' ? 'chương' : 'nội dung con'}
                </label>
                <input
                  id="add-name"
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Nhập tên ${addType === 'chapter' ? 'chương' : 'nội dung con'}`}
                />
              </div>
            )}
            
            {addType === 'requirement' && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-description">
                  Nội dung yêu cầu
                </label>
                <textarea
                  id="add-description"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                  placeholder="Nhập nội dung yêu cầu"
                />
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                onClick={closeAddModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAdd}
                disabled={
                  ((addType === 'chapter' || addType === 'subContent') && !addName) ||
                  (addType === 'requirement' && !addDescription)
                }
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing requirement questions */}
      {selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Câu hỏi đã import</h2>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">{selectedRequirement.chapterName}</span> - 
                  <span className="font-medium"> {selectedRequirement.subContentName}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{selectedRequirement.levelName}:</span> {selectedRequirement.item.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedQuestions.size > 0 && (
                  <button
                    onClick={openDeleteSelectedModal}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-2"
                  >
                    <MdDelete size={16} />
                    Xóa đã chọn ({selectedQuestions.size})
                  </button>
                )}
                <button 
                  onClick={closeRequirementQuestions} 
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Select all checkbox */}
            {requirementQuestions.length > 0 && (
              <div className="mb-4 flex items-center gap-2 pb-3 border-b">
                <input
                  type="checkbox"
                  checked={selectedQuestions.size === requirementQuestions.length && requirementQuestions.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 cursor-pointer">
                  Chọn tất cả ({requirementQuestions.length} câu)
                </label>
              </div>
            )}

            {requirementQuestions.length > 0 ? (
              <div className="space-y-4">
                {requirementQuestions.map((question, index) => (
                  <div 
                    key={question.questionId || index} 
                    className={`border rounded-lg p-4 ${
                      selectedQuestions.has(question.questionId) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.has(question.questionId)}
                        onChange={() => toggleQuestionSelection(question.questionId)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Câu {index + 1}</span>
                          <div className="flex items-center gap-2">
                            {question.importedFrom && (
                              <span className="text-xs text-gray-500">
                                Import từ: {question.importedFrom.examTitle}
                              </span>
                            )}
                            <button
                              onClick={() => openEditQuestion(question, index)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Sửa câu hỏi"
                            >
                              <MdEdit size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteQuestionModal(question)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Xóa câu hỏi"
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Question text */}
                    <div className="mb-3">
                      <MathJax>
                        <div 
                          className="text-sm text-gray-900"
                          dangerouslySetInnerHTML={{ __html: question.description || question.question || question.question_text || "Không có nội dung" }}
                        />
                      </MathJax>
                    </div>

                    {/* Question options if MCQ */}
                    {question.formattedQuestion?.options && (
                      <div className="ml-4 space-y-1 mb-2">
                        {question.formattedQuestion.options.map((option, optIndex) => (
                          <div key={optIndex} className="text-sm text-gray-700">
                            {String.fromCharCode(65 + optIndex)}. {option.option || option.text}
                            {option.is_correct && (
                              <span className="ml-2 text-green-600 font-medium">✓ Đúng</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Classification metadata */}
                    {question.classificationMeta && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500 space-y-1">
                          {question.classificationMeta.suggestedByAI && (
                            <div>Được gợi ý bởi AI</div>
                          )}
                          {question.classificationMeta.manualOverride && (
                            <div>Được phân loại thủ công</div>
                          )}
                          {question.classificationMeta.suggestionReason && (
                            <div>Lý do: {question.classificationMeta.suggestionReason}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500 italic">
                Chưa có câu hỏi nào được import cho yêu cầu này.
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeRequirementQuestions}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing question */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Sửa câu hỏi</h2>
              <button 
                onClick={closeEditQuestion} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nội dung câu hỏi
                </label>
                <textarea
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                />
              </div>

              {/* Options for MCQ */}
              {editQuestionOptions.length > 0 && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Các lựa chọn
                  </label>
                  <div className="space-y-2">
                    {editQuestionOptions.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-6">{String.fromCharCode(65 + optIndex)}.</span>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...editQuestionOptions];
                            newOptions[optIndex].text = e.target.value;
                            setEditQuestionOptions(newOptions);
                          }}
                          className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Nhập lựa chọn"
                        />
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={option.is_correct}
                            onChange={() => {
                              const newOptions = editQuestionOptions.map((opt, idx) => ({
                                ...opt,
                                is_correct: idx === optIndex
                              }));
                              setEditQuestionOptions(newOptions);
                            }}
                          />
                          <span>Đúng</span>
                        </label>
                        {editQuestionOptions.length > 2 && (
                          <button
                            onClick={() => {
                              const newOptions = editQuestionOptions.filter((_, idx) => idx !== optIndex);
                              setEditQuestionOptions(newOptions);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Xóa lựa chọn"
                          >
                            <MdDelete size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {editQuestionOptions.length < 6 && (
                      <button
                        onClick={() => setEditQuestionOptions([...editQuestionOptions, { text: "", is_correct: false }])}
                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <IoAddCircleOutline size={16} />
                        Thêm lựa chọn
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeEditQuestion}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditQuestionSubmit}
                  disabled={!editQuestionText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for confirming question deletion */}
      {isDeleteQuestionModalOpen && deletingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa câu hỏi</h2>
            <p className="mb-4 text-gray-700">
              Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
            </p>
            <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
              <MathJax>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: deletingQuestion.description || deletingQuestion.question || deletingQuestion.question_text || "Không có nội dung" 
                  }} 
                />
              </MathJax>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteQuestionModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for confirming multiple questions deletion */}
      {isDeleteSelectedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa câu hỏi</h2>
            <p className="mb-4 text-gray-700">
              Bạn có chắc chắn muốn xóa <span className="font-medium">{selectedQuestions.size}</span> câu hỏi đã chọn? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteSelectedModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSelectedQuestions}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionBankDetail; 