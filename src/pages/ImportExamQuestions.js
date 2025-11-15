import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../services/firebaseConfig";
import { IoChevronBack } from "react-icons/io5";
import { FaFolder, FaFileAlt, FaArrowLeft, FaArrowRight, FaHome, FaChevronRight } from "react-icons/fa";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { suggestQuestionPlacementBatch } from "../components/AI/AIService";
import { calculateRequirementCoverage } from "../utils/questionBankUtils";

function ImportExamQuestions() {
  const { bankId } = useParams();
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [exams, setExams] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [questionsToImport, setQuestionsToImport] = useState([]);
  const [step, setStep] = useState(1); // 1: Select exam, 2: Map questions, 3: Confirmation
  const [importing, setImporting] = useState(false);
  
  // For the current folder view
  const [displayItems, setDisplayItems] = useState([]);

  // For requirement selection UI
  const [expandedRequirements, setExpandedRequirements] = useState({});
  const [expandedSubContents, setExpandedSubContents] = useState({}); // Track expanded subContents
  const [expandedRequirementLevels, setExpandedRequirementLevels] = useState({}); // Track expanded requirement levels
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const ROOT_ID = '__root__';
  const REQUIREMENT_KEYS = ['nhanBiet', 'thongHieu', 'vanDung', 'vanDungCao'];
  const requirementLabels = {
    nhanBiet: 'Nhận biết',
    thongHieu: 'Thông hiểu',
    vanDung: 'Vận dụng',
    vanDungCao: 'Vận dụng cao'
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
      } catch (error) {
        console.error("Error fetching question bank:", error);
      }
    };
    
    const fetchFolderStructure = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          
          // Fetch folders
          const foldersQuery = collection(db, "Users", userId, "Folders");
          const foldersSnapshot = await getDocs(foldersQuery);
          const foldersData = foldersSnapshot.docs.map(doc => ({
            id: doc.id,
            type: 'folder',
            ...doc.data(),
            parent: doc.data().parent || ROOT_ID,
          }));
          setFolders(foldersData);
          
          // Fetch exams
          const examsQuery = collection(db, "Users", userId, "Exams_Created");
          const examsSnapshot = await getDocs(examsQuery);
          const examsData = examsSnapshot.docs.map(doc => ({
            id: doc.id,
            type: 'exam',
            ...doc.data(),
            quiz_title: doc.data().quiz_title || `Exam ${doc.id.substring(0, 5)}`,
            folderId: doc.data().folderId || ROOT_ID,
          }));
          setExams(examsData);
        }
      } catch (err) {
        console.error("Error loading folder structure:", err);
      }
    };
    
    Promise.all([fetchQuestionBank(), fetchFolderStructure()]).then(() => {
      setLoading(false);
    });
  }, [auth.currentUser, bankId, navigate]);
  
  // Update display items whenever currentPath or folders/exams change
  useEffect(() => {
    const calculateDisplayItems = () => {
      let items = [];
      const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;

      // Add subfolders
      const subfolders = folders.filter(f => f.parent === currentFolderId);
      items.push(...subfolders);
      
      // Add exams in this folder
      const examsInFolder = exams.filter(e => e.folderId === currentFolderId);
      items.push(...examsInFolder);
      
      return items;
    };
    
    setDisplayItems(calculateDisplayItems());
  }, [currentPath, folders, exams]);

  const coverage = useMemo(() => calculateRequirementCoverage(questionBank, questionsToImport), [questionBank, questionsToImport]);

  const isValidSuggestion = (suggestion) => {
    if (!suggestion) return false;
    const { chapterIndex, subContentIndex, requirement } = suggestion;
    if (typeof chapterIndex !== 'number' || typeof subContentIndex !== 'number') return false;
    if (!REQUIREMENT_KEYS.includes(requirement)) return false;
    if (!questionBank?.chapters?.[chapterIndex]) return false;
    if (!questionBank.chapters[chapterIndex].subContents?.[subContentIndex]) return false;
    return true;
  };
  
  const navigateToPath = (newPath) => {
    setCurrentPath(newPath);
  };
  
  const navigateToRoot = () => {
    setCurrentPath([]);
  };
  
  const openFolder = (folder) => {
    setCurrentPath([...currentPath, folder]);
  };
  
  const navigateBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const generateSuggestionsForMappings = async (mappings) => {
    if (!questionBank || !questionBank.chapters || questionBank.chapters.length === 0) {
      return;
    }

    const structureForAI = questionBank.matrixTemplate ? { chapters: questionBank.matrixTemplate } : questionBank;
    setSuggestionsLoading(true);

    try {
      // Extract all questions from mappings
      const questions = mappings.map(m => m.question);

      // Make a single batch request for all questions
      const suggestions = await suggestQuestionPlacementBatch(questions, structureForAI);

      // Map suggestions back to mappings
      const updated = mappings.map((mapping, index) => {
        const suggestion = suggestions[index];
        let nextMapping = { ...mapping, aiSuggestion: suggestion };

        if (isValidSuggestion(suggestion)) {
          // Question is related - apply the suggestion
          nextMapping = {
            ...nextMapping,
            chapterIndex: suggestion.chapterIndex,
            subContentIndex: suggestion.subContentIndex,
            requirement: suggestion.requirement,
            selected: true, // Automatically select when AI classifies
            manualOverride: false
          };
        } else {
          // Question is not related - clear the mapping so user must manually select
          // Don't keep the default first requirement assignment
          nextMapping = {
            ...nextMapping,
            chapterIndex: null,
            subContentIndex: null,
            requirement: null,
            selected: false, // Don't select if not classified
            manualOverride: false
          };
        }

        return nextMapping;
      });

      setQuestionsToImport(updated);
    } catch (error) {
      console.error("Error generating suggestions for questions:", error);
      // On error, keep the mappings but without AI suggestions
      const updated = mappings.map(mapping => ({ ...mapping, aiSuggestion: null }));
      setQuestionsToImport(updated);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const applySuggestionToQuestion = (questionId) => {
    setQuestionsToImport(prev => prev.map(mapping => {
      if (mapping.question.id !== questionId || !isValidSuggestion(mapping.aiSuggestion)) {
        return mapping;
      }
      const suggestion = mapping.aiSuggestion;
      return {
        ...mapping,
        chapterIndex: suggestion.chapterIndex,
        subContentIndex: suggestion.subContentIndex,
        requirement: suggestion.requirement,
        manualOverride: false
      };
    }));
  };

  const selectExam = async (exam) => {
    setSelectedExam(exam);
    setLoading(true);

    try {
      // Fetch exam questions from collection
      const settersCollectionRef = collection(db, "Paper_Setters", exam.id, "Question_Papers_MCQ");
      const docos = await getDocs(settersCollectionRef);

      if (docos.docs.length === 0) {
        setExamQuestions([]);
        setQuestionsToImport([]);
        setStep(2);
        setLoading(false);
        return;
      }

      // Get question data
      const docosData = docos.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      let questionsData = [];
      let answersData = [];

      // Check if the exam follows the question_question format (Form.js format)
      if (docosData.length > 0 && docosData[0].question_question) {
        questionsData = docosData[0].question_question.map((q, index) => ({
          id: `question_${index}`,
          question_text: q.question,
          options: q.options ? q.options.map(opt => ({
            text: opt.option,
            is_correct: false // Will set this from answers later
          })) : [],
          type: q.type || 'mcq',
          originalFormat: true,
          originalIndex: index
        }));

        // Get answers if available in the original format
        if (docos.docs.length > 1 && docosData[1].answer_answer) {
          answersData = docosData[1].answer_answer;
        } else {
          // Search for answer sheet
          for (const doc of docosData) {
            if (doc.id.includes('_answerSheet') || doc.answer_answer) {
              answersData = doc.answer_answer || [];
              break;
            }
          }
        }

        // Mark correct answers if we have answer data
        if (answersData && answersData.length > 0) {
          questionsData.forEach((question, qIndex) => {
            if (question.type === 'mcq' && answersData[qIndex] && question.options) {
              const correctAnswer = parseInt(answersData[qIndex].answer);
              if (!isNaN(correctAnswer) && correctAnswer >= 0 && correctAnswer < question.options.length) {
                question.options[correctAnswer].is_correct = true;
              }
            }
          });
        }
      } else {
        // Use the existing format from the current implementation
        questionsData = docosData.filter(doc => !doc.id.includes('_answerSheet') && !doc.answer_answer);
      }

      // Sort questions by their order if available
      questionsData.sort((a, b) => (a.order || 0) - (b.order || 0));

      setExamQuestions(questionsData);

      // Initialize questionsToImport with default mappings
      if (questionBank && questionBank.chapters && questionBank.chapters.length > 0) {
        const defaultChapter = questionBank.chapters[0];
        const defaultSubContent = defaultChapter.subContents && defaultChapter.subContents.length > 0
          ? defaultChapter.subContents[0]
          : null;

        const initialMappings = questionsData.map(q => ({
          question: q,
          selected: false, // Start with false, only select when classified
          chapterIndex: null,
          subContentIndex: null,
          requirement: null,
          aiSuggestion: null,
          manualOverride: false
        }));

        setQuestionsToImport(initialMappings);

        // Move to step 2 immediately (don't wait for AI)
        setStep(2);
        setLoading(false);

        // Generate AI suggestions in the background
        generateSuggestionsForMappings(initialMappings);
      } else {
        setStep(2);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching exam questions:", error);
      alert("Không thể tải câu hỏi từ đề thi này");
      setLoading(false);
    }
  };
  
  // Toggle question selection checkbox (only allow if classified)
  const toggleQuestionSelection = (questionId) => {
    setQuestionsToImport(prev => 
      prev.map(q => {
        if (q.question.id !== questionId) return q;
        
        // Only allow toggling if question is classified
        if (!q.requirement || q.chapterIndex === null || q.subContentIndex === null) {
          return q; // Don't allow selection if not classified
        }
        
        return { ...q, selected: !q.selected };
      })
    );
  };
  
  const updateQuestionMapping = (questionId, field, value) => {
    setQuestionsToImport(prev =>
      prev.map(q =>
        q.question.id === questionId
          ? { ...q, [field]: value, manualOverride: true }
          : q
      )
    );
  };
  
  const handleImport = async () => {
    setImporting(true);
    
    try {
      const selectedQuestions = questionsToImport.filter(q => q.selected);
      
      if (selectedQuestions.length === 0) {
        alert("Vui lòng chọn ít nhất một câu hỏi để import");
        setImporting(false);
        return;
      }
      
      // Filter out questions that don't have a valid requirement mapping
      const validQuestions = selectedQuestions.filter(mapping => {
        return mapping.chapterIndex !== null && 
               mapping.subContentIndex !== null && 
               mapping.requirement !== null &&
               typeof mapping.chapterIndex === 'number' &&
               typeof mapping.subContentIndex === 'number' &&
               REQUIREMENT_KEYS.includes(mapping.requirement);
      });
      
      if (validQuestions.length === 0) {
        alert("Vui lòng phân loại ít nhất một câu hỏi trước khi import. Các câu hỏi chưa được phân loại sẽ không được import.");
        setImporting(false);
        return;
      }
      
      if (validQuestions.length < selectedQuestions.length) {
        const unclassifiedCount = selectedQuestions.length - validQuestions.length;
        if (!window.confirm(`${unclassifiedCount} câu hỏi chưa được phân loại sẽ không được import. Bạn có muốn tiếp tục import ${validQuestions.length} câu hỏi đã được phân loại không?`)) {
          setImporting(false);
          return;
        }
      }
      
      // Create a deep copy of the question bank chapters
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      // Group questions by chapter and subcontent for batch processing
      const questionsByChapterAndSubcontent = {};
      
      validQuestions.forEach(mapping => {
        const key = `${mapping.chapterIndex}-${mapping.subContentIndex}-${mapping.requirement}`;
        if (!questionsByChapterAndSubcontent[key]) {
          questionsByChapterAndSubcontent[key] = [];
        }
        questionsByChapterAndSubcontent[key].push(mapping);
      });
      
      // Process each group and add questions to the requirements
      Object.keys(questionsByChapterAndSubcontent).forEach(key => {
        const [chapterIndex, subContentIndex, requirement] = key.split('-');
        const mappings = questionsByChapterAndSubcontent[key];

        // Skip if chapter or subcontent is invalid
        if (!updatedChapters[chapterIndex] ||
            !updatedChapters[chapterIndex].subContents || 
            !updatedChapters[chapterIndex].subContents[subContentIndex]) {
          return;
        }
        
        // Initialize requirements object if it doesn't exist
        if (!updatedChapters[chapterIndex].subContents[subContentIndex].requirements) {
          updatedChapters[chapterIndex].subContents[subContentIndex].requirements = {
            nhanBiet: [],
            thongHieu: [],
            vanDung: [],
            vanDungCao: []
          };
        }
        
        // Initialize the specific requirement array if it doesn't exist
        if (!updatedChapters[chapterIndex].subContents[subContentIndex].requirements[requirement]) {
          updatedChapters[chapterIndex].subContents[subContentIndex].requirements[requirement] = [];
        }
        
        // Get the requirements array for this level
        const requirementsArray = updatedChapters[chapterIndex].subContents[subContentIndex].requirements[requirement];
        
        // Group questions by itemIndex to insert them in the correct position
        const questionsByItemIndex = {};
        
        mappings.forEach(mapping => {
          const itemIndex = mapping.itemIndex;
          if (itemIndex !== null && itemIndex !== undefined) {
            if (!questionsByItemIndex[itemIndex]) {
              questionsByItemIndex[itemIndex] = [];
            }
            questionsByItemIndex[itemIndex].push(mapping);
          } else {
            // If no itemIndex, add to a special group for questions without specific requirement
            if (!questionsByItemIndex['_no_index']) {
              questionsByItemIndex['_no_index'] = [];
            }
            questionsByItemIndex['_no_index'].push(mapping);
          }
        });
        
        // Process questions by itemIndex (in reverse order to maintain correct insertion positions)
        const sortedItemIndices = Object.keys(questionsByItemIndex)
          .filter(key => key !== '_no_index')
          .map(key => parseInt(key))
          .sort((a, b) => b - a); // Sort in reverse order
        
        // Insert questions after their respective template items
        sortedItemIndices.forEach(itemIndex => {
          const mappingsForItem = questionsByItemIndex[itemIndex];
          
          // Verify that itemIndex points to a template item
          if (!requirementsArray[itemIndex] || !requirementsArray[itemIndex]._template) {
            console.warn(`Invalid itemIndex ${itemIndex}: not a template item. Adding questions to _no_index group.`);
            // Fallback: move to _no_index group
            if (!questionsByItemIndex['_no_index']) {
              questionsByItemIndex['_no_index'] = [];
            }
            questionsByItemIndex['_no_index'].push(...mappingsForItem);
            return;
          }
          
          // Find the insertion position (after the template item at itemIndex)
          // Find where existing questions for this template end (before next template)
          let insertPosition = itemIndex + 1;
          
          // Find the next template item to determine the boundary
          for (let i = itemIndex + 1; i < requirementsArray.length; i++) {
            if (requirementsArray[i] && requirementsArray[i]._template) {
              // Found next template, insert before it
              insertPosition = i;
              break;
            }
          }
          // If no next template found, insertPosition stays at the end
          
          // Prepare and insert questions (in reverse order to maintain positions)
          const questionsToInsert = [];
          mappingsForItem.forEach(mapping => {
            const question = mapping.question;

            // Prepare question data for storage
            let questionData = {
              description: question.question_text || "Không có mô tả",
              questionId: question.id,
              importedFrom: {
                examId: selectedExam.id,
                examTitle: selectedExam.quiz_title,
                importDate: new Date().toISOString()
              }
            };

            questionData.classificationMeta = {
              requirement: mapping.requirement,
              chapterIndex: Number(chapterIndex),
              subContentIndex: Number(subContentIndex),
              itemIndex: itemIndex,
              suggestionConfidence: mapping.aiSuggestion?.confidence ?? null,
              suggestionReason: mapping.aiSuggestion?.reason || null,
              suggestedByAI: Boolean(mapping.aiSuggestion),
              manualOverride: Boolean(mapping.manualOverride),
              assignedAt: new Date().toISOString()
            };

            // Store original format if available
            if (question.originalFormat) {
              // For Form.js format questions
              questionData.questionType = question.type;
              
              // Store formatted question for MCQ
              if (question.type === 'mcq') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  options: question.options.map(opt => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                
                // Find correct answer index
                const correctOptionIndex = question.options.findIndex(opt => opt.is_correct);
                if (correctOptionIndex !== -1) {
                  questionData.correctAnswer = correctOptionIndex;
                }
              } 
              // Store true/false question data
              else if (question.type === 'truefalse') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  options: question.options.map(opt => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                
                // Store correct answers as array of true/false values
                questionData.correctAnswers = question.options.map(opt => opt.is_correct);
              }
              // Store short answer question
              else if (question.type === 'shortanswer') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  type: question.type
                };
              }
            } else {
              // For the standard format, just store the question data
              questionData.questionData = question;
            }
            
            questionsToInsert.push(questionData);
          });
          
          // Insert all questions at once at the correct position
          requirementsArray.splice(insertPosition, 0, ...questionsToInsert);
        });
        
        // Handle questions without itemIndex (from old AI suggestions) - add them at the end
        if (questionsByItemIndex['_no_index']) {
          questionsByItemIndex['_no_index'].forEach(mapping => {
            const question = mapping.question;

            // Prepare question data for storage
            let questionData = {
              description: question.question_text || "Không có mô tả",
              questionId: question.id,
              importedFrom: {
                examId: selectedExam.id,
                examTitle: selectedExam.quiz_title,
                importDate: new Date().toISOString()
              }
            };

            questionData.classificationMeta = {
              requirement: mapping.requirement,
              chapterIndex: Number(chapterIndex),
              subContentIndex: Number(subContentIndex),
              suggestionConfidence: mapping.aiSuggestion?.confidence ?? null,
              suggestionReason: mapping.aiSuggestion?.reason || null,
              suggestedByAI: Boolean(mapping.aiSuggestion),
              manualOverride: Boolean(mapping.manualOverride),
              assignedAt: new Date().toISOString()
            };

            // Store original format if available
            if (question.originalFormat) {
              questionData.questionType = question.type;
              
              if (question.type === 'mcq') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  options: question.options.map(opt => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                
                const correctOptionIndex = question.options.findIndex(opt => opt.is_correct);
                if (correctOptionIndex !== -1) {
                  questionData.correctAnswer = correctOptionIndex;
                }
              } else if (question.type === 'truefalse') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  options: question.options.map(opt => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                questionData.correctAnswers = question.options.map(opt => opt.is_correct);
              } else if (question.type === 'shortanswer') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  type: question.type
                };
              }
            } else {
              questionData.questionData = question;
            }
            
            // Add to end of array
            requirementsArray.push(questionData);
          });
        }
      });
      
      // Update the question bank in Firestore
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Success message and navigation
      alert("Đã import thành công " + validQuestions.length + " câu hỏi vào ngân hàng câu hỏi!");
      navigate(`/QuestionBank/${bankId}`);
      
    } catch (error) {
      console.error("Error importing questions:", error);
      alert("Có lỗi xảy ra khi import câu hỏi: " + error.message);
      setImporting(false);
    }
  };
  
  // Toggle requirement selection UI for a question
  const toggleRequirementSelection = (questionId) => {
    setExpandedRequirements(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Toggle subContent expansion
  const toggleSubContent = (chapterIndex, subContentIndex) => {
    const key = `${chapterIndex}-${subContentIndex}`;
    setExpandedSubContents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle requirement level expansion
  const toggleRequirementLevel = (chapterIndex, subContentIndex, requirement) => {
    const key = `${chapterIndex}-${subContentIndex}-${requirement}`;
    setExpandedRequirementLevels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Select a specific requirement item for a question
  const selectRequirement = (questionId, chapterIndex, subContentIndex, requirement, itemIndex) => {
    setQuestionsToImport(prev =>
      prev.map(q =>
        q.question.id === questionId
          ? {
              ...q,
              chapterIndex,
              subContentIndex,
              requirement,
              itemIndex: itemIndex !== undefined ? itemIndex : null, // Store the template item index
              selected: true, // Automatically select when classified
              manualOverride: true
            }
          : q
      )
    );
    // Close the dropdown after selection
    toggleRequirementSelection(questionId);
  };
  
  // Render the requirements selection UI for a question
  const renderRequirementSelector = (questionId, mapping) => {
    return (
      <div className="mt-3 border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Chọn vị trí phân loại</h4>
          <button
            onClick={() => toggleRequirementSelection(questionId)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Đóng
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {questionBank.chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border border-gray-200 rounded-lg">
              <div className="px-4 py-2 bg-gray-100 font-semibold text-sm">
                Chương {chapterIndex + 1}: {chapter.name}
              </div>

              {chapter.subContents && chapter.subContents.length > 0 ? (
                <div className="p-4 space-y-2 text-sm">
                  {chapter.subContents.map((subContent, subContentIndex) => {
                    const subContentKey = `${chapterIndex}-${subContentIndex}`;
                    const isSubContentExpanded = expandedSubContents[subContentKey];
                    const isSubContentSelected = mapping.chapterIndex === chapterIndex &&
                      mapping.subContentIndex === subContentIndex;

                    return (
                      <div key={subContentIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* SubContent header - clickable to expand */}
                        <button
                          className={`w-full text-left p-3 transition-colors flex items-center justify-between ${
                            isSubContentSelected
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => toggleSubContent(chapterIndex, subContentIndex)}
                        >
                          <div className="font-medium text-gray-800 text-sm">
                            {chapterIndex + 1}.{subContentIndex + 1} {subContent.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {isSubContentExpanded ? '▼' : '▶'}
                          </div>
                        </button>

                        {/* Expanded requirement levels */}
                        {isSubContentExpanded && (
                          <div className="border-t border-gray-200 bg-white">
                            <div className="p-2 space-y-1">
                              {REQUIREMENT_KEYS.map(reqKey => {
                                const levelKey = `${chapterIndex}-${subContentIndex}-${reqKey}`;
                                const isLevelExpanded = expandedRequirementLevels[levelKey];
                                const requirements = subContent.requirements?.[reqKey] || [];
                                const requirementCount = requirements.length;
                                const isLevelSelected = mapping.chapterIndex === chapterIndex &&
                                  mapping.subContentIndex === subContentIndex &&
                                  mapping.requirement === reqKey;

                                if (requirementCount === 0) {
                                  return null; // Skip empty requirement levels
                                }

                                return (
                                  <div key={reqKey} className="border border-gray-200 rounded overflow-hidden">
                                    {/* Requirement level header - clickable to expand */}
                                    <button
                                      className={`w-full text-left p-2 transition-colors flex items-center justify-between ${
                                        isLevelSelected
                                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                                          : 'bg-gray-50 hover:bg-gray-100'
                                      }`}
                                      onClick={() => toggleRequirementLevel(chapterIndex, subContentIndex, reqKey)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="uppercase tracking-wide text-[11px] text-gray-500">
                                          {requirementLabels[reqKey]}
                                        </span>
                                        <span className="text-gray-600 text-xs">
                                          ({requirementCount} yêu cầu)
                                        </span>
                                      </div>
                                      <div className="text-gray-500 text-xs">
                                        {isLevelExpanded ? '▼' : '▶'}
                                      </div>
                                    </button>

                                    {/* Expanded requirement items */}
                                    {isLevelExpanded && requirements.length > 0 && (
                                      <div className="border-t border-gray-200 bg-white">
                                        <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                          {requirements.map((req, reqIndex) => {
                                            // Only show template items (requirements with _template flag)
                                            if (!req._template) return null;
                                            
                                            const reqDescription = req.description || req.question || req.question_text || `Yêu cầu ${reqIndex + 1}`;
                                            // Check if this specific item is selected
                                            const isItemSelected = mapping.chapterIndex === chapterIndex &&
                                              mapping.subContentIndex === subContentIndex &&
                                              mapping.requirement === reqKey &&
                                              mapping.itemIndex === reqIndex;

                                            return (
                                              <button
                                                key={reqIndex}
                                                className={`w-full text-left p-2 rounded text-xs transition-colors ${
                                                  isItemSelected
                                                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                                                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                                }`}
                                                onClick={() => selectRequirement(questionId, chapterIndex, subContentIndex, reqKey, reqIndex)}
                                              >
                                                <div className="text-gray-700">
                                                  • {reqDescription}
                                                </div>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-gray-500 italic text-sm text-center">
                  Không có nội dung
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render question cards for step 2
  const renderQuestionCards = () => {
    const selectedCount = questionsToImport.filter(q => q.selected).length;
    const totalCount = examQuestions.length;
    const selectedPercentage = totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {selectedExam?.quiz_title}
          </h2>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">{selectedCount}</span> / {totalCount} câu hỏi
            <span className="ml-2 text-blue-600 font-medium">({selectedPercentage}%)</span>
          </div>
        </div>

        {suggestionsLoading && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 flex items-center">
            <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
            Đang phân loại bằng AI...
          </div>
        )}

        <div className="mb-3 flex justify-between items-center">
          <button
            onClick={() => setStep(1)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
          >
            <FaArrowLeft className="mr-1.5 text-xs" />
            Chọn đề khác
          </button>

          <button
            onClick={() => handleImport()}
            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={importing || selectedCount === 0}
          >
            {importing ? (
              <>
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Đang import...
              </>
            ) : (
              <>
                <FaArrowRight className="mr-1.5 text-xs" />
                Import {selectedCount} câu
              </>
            )}
          </button>
        </div>

        {/* Two column layout: Questions on left, Matrix on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Questions list */}
          <div className="lg:col-span-2 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {questionsToImport.map((mapping, index) => (
            <div 
              key={mapping.question.id} 
              className={`border rounded-lg ${mapping.selected ? "border-blue-200" : "border-gray-200"}`}
            >
              <div className="p-2.5 flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={mapping.selected}
                  onChange={() => toggleQuestionSelection(mapping.question.id)}
                  disabled={!mapping.requirement || mapping.chapterIndex === null || mapping.subContentIndex === null}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!mapping.requirement ? "Vui lòng phân loại câu hỏi trước khi chọn" : ""}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm font-medium text-gray-700">Câu {index + 1}</span>
                    <button
                      onClick={() => toggleRequirementSelection(mapping.question.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
                    >
                      {mapping.requirement ? "Đổi vị trí" : "Chọn vị trí"}
                    </button>
                  </div>

                  {/* Question text - compact */}
                  <div className={`text-sm ${mapping.selected ? "text-gray-900" : "text-gray-500"} line-clamp-2`}>
                    {mapping.question.originalFormat ? (
                      <MathJax>
                        <div dangerouslySetInnerHTML={{ __html: mapping.question.question_text }} />
                      </MathJax>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: mapping.question.question_text || "Không có nội dung" }} />
                    )}
                  </div>

                  {/* Classification info - compact */}
                  <div className="mt-1.5 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {mapping.requirement && mapping.chapterIndex !== null && mapping.subContentIndex !== null ? (
                        <>
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                            {requirementLabels[mapping.requirement]}
                          </span>
                          {questionBank.chapters[mapping.chapterIndex]?.subContents?.[mapping.subContentIndex]?.name && (
                            <span className="text-gray-600 truncate max-w-[200px]">
                              {questionBank.chapters[mapping.chapterIndex].subContents[mapping.subContentIndex].name}
                            </span>
                          )}
                          {(() => {
                            // Try to get requirement item description
                            if (mapping.itemIndex !== null && mapping.itemIndex !== undefined) {
                              const requirements = questionBank.chapters[mapping.chapterIndex]?.subContents?.[mapping.subContentIndex]?.requirements?.[mapping.requirement] || [];
                              const selectedRequirement = requirements[mapping.itemIndex];
                              if (selectedRequirement && selectedRequirement._template) {
                                const reqDescription = selectedRequirement.description || selectedRequirement.question || selectedRequirement.question_text;
                                if (reqDescription) {
                                  return (
                                    <span className="text-gray-700 font-medium truncate max-w-[300px]" title={reqDescription}>
                                      • {reqDescription}
                                    </span>
                                  );
                                }
                              }
                            }
                            return null;
                          })()}
                          {mapping.aiSuggestion && isValidSuggestion(mapping.aiSuggestion) && mapping.manualOverride && (
                            <button
                              className="text-blue-600 hover:text-blue-800 underline text-xs"
                              onClick={() => applySuggestionToQuestion(mapping.question.id)}
                            >
                              Dùng gợi ý AI
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">
                          ⚠️ Chưa phân loại - Vui lòng chọn vị trí
                        </span>
                      )}
                    </div>
                    {/* AI reason display */}
                    {mapping.aiSuggestion?.reason && (
                      <div className="text-[11px] text-gray-500 italic bg-gray-50 px-2 py-1 rounded border-l-2 border-gray-300">
                        <span className="font-medium text-gray-600">Lý do: </span>
                        {mapping.aiSuggestion.reason}
                      </div>
                    )}
                  </div>

                  {/* Requirements selection modal - expanded when clicked */}
                  {expandedRequirements[mapping.question.id] && renderRequirementSelector(mapping.question.id, mapping)}
                </div>
              </div>
            </div>
          ))}
          
            {questionsToImport.length === 0 && (
              <div className="text-center p-8 text-gray-500 italic">
                Không tìm thấy câu hỏi nào trong đề thi này.
              </div>
            )}
          </div>

          {/* Right column: Matrix/Specification Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Độ phủ ma trận</h3>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {coverage.summary && coverage.summary.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {coverage.summary
                      .filter(item => item.incoming > 0)
                      .map((item, index) => {
                        // Get requirement items for this level
                        const chapter = questionBank?.chapters?.[item.chapterIndex];
                        const subContent = chapter?.subContents?.[item.subContentIndex];
                        const requirements = subContent?.requirements?.[item.requirement] || [];
                        
                        // Get selected questions for this requirement level
                        const selectedQuestionsForThisLevel = questionsToImport.filter(q => 
                          q.selected && 
                          q.chapterIndex === item.chapterIndex &&
                          q.subContentIndex === item.subContentIndex &&
                          q.requirement === item.requirement
                        );

                        // Get all items in order (templates and questions mixed)
                        // Template items have _template: true
                        // Question items have questionId and !_template
                        
                        // Build a map of template index to question count
                        const templateIndices = [];
                        requirements.forEach((req, index) => {
                          if (req && req._template && req.description) {
                            templateIndices.push({ index, description: req.description });
                          }
                        });
                        
                        // Count questions between templates
                        const requirementsWithCounts = templateIndices.map((template, templateIdx) => {
                          const startIdx = template.index + 1;
                          const endIdx = templateIdx < templateIndices.length - 1 
                            ? templateIndices[templateIdx + 1].index 
                            : requirements.length;
                          
                          // Count questions in this range
                          let questionCount = 0;
                          for (let i = startIdx; i < endIdx; i++) {
                            const item = requirements[i];
                            if (item && !item._template && item.questionId) {
                              questionCount++;
                            }
                          }
                          
                          return {
                            name: template.description,
                            existingCount: questionCount
                          };
                        }).filter(req => req.existingCount > 0); // Only show requirements with questions

                        return (
                          <div key={`${item.chapterIndex}-${item.subContentIndex}-${item.requirement}-${index}`} className="p-2.5 hover:bg-gray-50">
                            <div className="text-xs font-medium text-gray-700 mb-1 truncate" title={item.subContentName}>
                              {item.subContentName}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-medium">
                                  {requirementLabels[item.requirement]}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-gray-600">{item.existing}</span>
                                  <span className="text-green-600 font-medium">+{item.incoming}</span>
                                </div>
                              </div>
                              {requirementsWithCounts.length > 0 && (
                                <div className="text-[10px] text-gray-400 space-y-0.5 pl-2">
                                  {requirementsWithCounts.length <= 5 ? (
                                    // Show all if 5 or fewer
                                    requirementsWithCounts.map((req, idx) => (
                                      <div key={idx} className="flex items-center justify-between truncate">
                                        <span className="truncate flex-1">• {req.name}</span>
                                        <span className="text-gray-500 ml-2 flex-shrink-0">
                                          ({req.existingCount} câu)
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    // Show first 3 if more than 5
                                    <>
                                      {requirementsWithCounts.slice(0, 3).map((req, idx) => (
                                        <div key={idx} className="flex items-center justify-between truncate">
                                          <span className="truncate flex-1">• {req.name}</span>
                                          <span className="text-gray-500 ml-2 flex-shrink-0">
                                            ({req.existingCount} câu)
                                          </span>
                                        </div>
                                      ))}
                                      <div className="text-gray-500 italic px-1">
                                        ... và {requirementsWithCounts.length - 3} yêu cầu khác
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500">
                    Chưa có câu hỏi được chọn
                  </div>
                )}
              </div>

              {/* Summary stats */}
              {selectedCount > 0 && (
                <div className="p-3 bg-blue-50 border-t border-blue-100">
                  <div className="text-xs text-blue-800">
                    <div className="flex justify-between mb-1">
                      <span>Tổng câu hỏi:</span>
                      <span className="font-semibold">{selectedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>% đề thi:</span>
                      <span className="font-semibold">{selectedPercentage}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render folder structure similar to FolderStructure.js (table/list style)
  const renderFolderStructure = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Chọn đề thi để import câu hỏi</h2>
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mb-4 overflow-x-auto">
          <button
            className="text-blue-600 hover:text-blue-800 flex items-center"
            onClick={navigateToRoot}
          >
            <FaHome className="mr-1" />
            <span>Thư mục gốc</span>
          </button>
          
          {currentPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" />
              <button
                className="text-blue-600 hover:text-blue-800 truncate max-w-[200px]"
                onClick={() => navigateToPath(currentPath.slice(0, index + 1))}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>
        
        {/* Back button if inside a folder */}
        {currentPath.length > 0 && (
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            onClick={navigateBack}
          >
            <FaArrowLeft className="mr-2" />
            <span>Quay lại thư mục trước</span>
          </button>
        )}
        
        {/* Display folders and exams in table/list style like FolderStructure */}
        <div className="grid grid-cols-12 py-2 px-3 border-b border-gray-200 bg-gray-50 font-medium text-gray-700 rounded-t-md">
          <div className="col-span-8">Tên</div>
          <div className="col-span-4 text-right">Thao tác</div>
        </div>
        
        <div className="divide-y divide-gray-200 rounded-b-md border-l border-r border-b border-gray-200">
          {displayItems.map(item => (
            <div 
              key={item.id}
              className="grid grid-cols-12 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => item.type === 'folder' ? openFolder(item) : selectExam(item)}
            >
              <div className="col-span-8 flex items-center">
                {item.type === 'folder' ? (
                  <FaFolder className="text-yellow-500 mr-3 flex-shrink-0" />
                ) : (
                  <FaFileAlt className="text-gray-500 mr-3 flex-shrink-0" />
                )}
                <span className="truncate font-medium">
                  {item.type === 'folder' ? item.name : item.quiz_title}
                </span>
              </div>
              <div className="col-span-4 flex items-center justify-end">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.type === 'folder') {
                      openFolder(item);
                    } else {
                      selectExam(item);
                    }
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md"
                >
                  {item.type === 'folder' ? 'Mở' : 'Chọn'}
                </button>
              </div>
            </div>
          ))}
          
          {displayItems.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic">
              Không có đề thi hoặc thư mục nào trong thư mục này.
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <MathJaxContext>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(`/QuestionBank/${bankId}`)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <IoChevronBack />
            <span>Quay lại</span>
          </button>
          <h1 className="text-3xl font-bold">Import câu hỏi từ đề thi</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step navigation */}
          <div className="flex mb-8 border-b pb-4">
            <div className={`flex-1 text-center ${step === 1 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mb-2`}>1</div>
                <span>Chọn đề thi</span>
              </div>
            </div>
            <div className="w-10 flex items-center justify-center">
              <div className="h-1 w-full bg-gray-300"></div>
            </div>
            <div className={`flex-1 text-center ${step === 2 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mb-2`}>2</div>
                <span>Chọn câu hỏi và yêu cầu</span>
              </div>
            </div>
          </div>
          
          {step === 1 && renderFolderStructure()}
          {step === 2 && renderQuestionCards()}
        </div>
      </div>
    </MathJaxContext>
  );
}

export default ImportExamQuestions; 