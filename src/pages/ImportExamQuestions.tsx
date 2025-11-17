import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../services/firebaseConfig";
import { IoChevronBack } from "react-icons/io5";
import { MathJaxContext } from "better-react-mathjax";
import { suggestQuestionPlacementBatch } from "../components/AI/AIService";
import { calculateRequirementCoverage } from "../utils/questionBankUtils";
import StepNavigation from './ImportExamQuestions/StepNavigation';
import FolderStructureView from './ImportExamQuestions/FolderStructureView';
import QuestionMappingView from './ImportExamQuestions/QuestionMappingView';
import type { 
  QuestionBank, 
  Folder, 
  Exam, 
  DisplayItem, 
  Question, 
  QuestionMapping,
  CoverageSummary
} from './ImportExamQuestions/types';

const ROOT_ID = '__root__';
const REQUIREMENT_KEYS = ['nhanBiet', 'thongHieu', 'vanDung', 'vanDungCao'] as const;

const ImportExamQuestions: React.FC = () => {
  const { bankId } = useParams<{ bankId: string }>();
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentPath, setCurrentPath] = useState<Folder[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [questionsToImport, setQuestionsToImport] = useState<QuestionMapping[]>([]);
  const [step, setStep] = useState<number>(1); // 1: Select exam, 2: Map questions
  const [importing, setImporting] = useState<boolean>(false);
  
  // For the current folder view
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);

  // For requirement selection UI
  const [expandedRequirements, setExpandedRequirements] = useState<{ [key: string]: boolean }>({});
  const [expandedSubContents, setExpandedSubContents] = useState<{ [key: string]: boolean }>({});
  const [expandedRequirementLevels, setExpandedRequirementLevels] = useState<{ [key: string]: boolean }>({});
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);

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
            type: 'folder' as const,
            ...doc.data(),
            parent: doc.data().parent || ROOT_ID,
          })) as Folder[];
          setFolders(foldersData);
          
          // Fetch exams
          const examsQuery = collection(db, "Users", userId, "Exams_Created");
          const examsSnapshot = await getDocs(examsQuery);
          const examsData = examsSnapshot.docs.map(doc => ({
            id: doc.id,
            type: 'exam' as const,
            ...doc.data(),
            quiz_title: doc.data().quiz_title || `Exam ${doc.id.substring(0, 5)}`,
            folderId: doc.data().folderId || ROOT_ID,
          })) as Exam[];
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
    const calculateDisplayItems = (): DisplayItem[] => {
      const items: DisplayItem[] = [];
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

  const coverage: CoverageSummary = useMemo(() => 
    calculateRequirementCoverage(questionBank, questionsToImport), 
    [questionBank, questionsToImport]
  );

  const isValidSuggestion = (suggestion: any): boolean => {
    if (!suggestion) return false;
    const { chapterIndex, subContentIndex, requirement } = suggestion;
    if (typeof chapterIndex !== 'number' || typeof subContentIndex !== 'number') return false;
    if (!REQUIREMENT_KEYS.includes(requirement)) return false;
    if (!questionBank?.chapters?.[chapterIndex]) return false;
    if (!questionBank.chapters[chapterIndex].subContents?.[subContentIndex]) return false;
    return true;
  };
  
  const navigateToPath = (newPath: Folder[]) => {
    setCurrentPath(newPath);
  };
  
  const navigateToRoot = () => {
    setCurrentPath([]);
  };
  
  const openFolder = (folder: Folder) => {
    setCurrentPath([...currentPath, folder]);
  };
  
  const navigateBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const generateSuggestionsForMappings = async (mappings: QuestionMapping[]) => {
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
        let nextMapping: QuestionMapping = { ...mapping, aiSuggestion: suggestion };

        if (isValidSuggestion(suggestion)) {
          // Question is related - apply the suggestion
          nextMapping = {
            ...nextMapping,
            chapterIndex: suggestion.chapterIndex!,
            subContentIndex: suggestion.subContentIndex!,
            requirement: suggestion.requirement!,
            selected: true, // Automatically select when AI classifies
            manualOverride: false
          };
        } else {
          // Question is not related - clear the mapping so user must manually select
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

  const applySuggestionToQuestion = (questionId: string) => {
    setQuestionsToImport(prev => prev.map(mapping => {
      if (mapping.question.id !== questionId || !isValidSuggestion(mapping.aiSuggestion)) {
        return mapping;
      }
      const suggestion = mapping.aiSuggestion!;
      return {
        ...mapping,
        chapterIndex: suggestion.chapterIndex!,
        subContentIndex: suggestion.subContentIndex!,
        requirement: suggestion.requirement!,
        manualOverride: false
      };
    }));
  };

  const selectExam = async (exam: Exam) => {
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
      })) as Array<{ id: string; question_question?: any[]; answer_answer?: any[]; [key: string]: any }>;

      let questionsData: Question[] = [];
      let answersData: any[] = [];

      // Check if the exam follows the question_question format (Form.js format)
      if (docosData.length > 0 && docosData[0].question_question) {
        questionsData = docosData[0].question_question.map((q: any, index: number) => ({
          id: `question_${index}`,
          question_text: q.question,
          options: q.options ? q.options.map((opt: any) => ({
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
              answersData = (doc.answer_answer || []) as any[];
              break;
            }
          }
        }

        // Mark correct answers if we have answer data
        if (answersData && answersData.length > 0) {
          questionsData.forEach((question, qIndex) => {
            if (question.type === 'mcq' && answersData[qIndex] && question.options) {
              const correctAnswer = parseInt(String(answersData[qIndex].answer));
              if (!isNaN(correctAnswer) && correctAnswer >= 0 && correctAnswer < question.options.length) {
                question.options[correctAnswer].is_correct = true;
              }
            }
          });
        }
      } else {
        // Use the existing format from the current implementation
        questionsData = docosData.filter((doc: any) => !doc.id.includes('_answerSheet') && !doc.answer_answer) as Question[];
      }

      // Sort questions by their order if available
      questionsData.sort((a, b) => (a.order || 0) - (b.order || 0));

      setExamQuestions(questionsData);

      // Initialize questionsToImport with default mappings
      if (questionBank && questionBank.chapters && questionBank.chapters.length > 0) {
        const initialMappings: QuestionMapping[] = questionsData.map(q => ({
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
    } catch (error: any) {
      console.error("Error fetching exam questions:", error);
      alert("Không thể tải câu hỏi từ đề thi này");
      setLoading(false);
    }
  };
  
  // Toggle question selection checkbox (only allow if classified)
  const toggleQuestionSelection = (questionId: string) => {
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
  
  const handleImport = async () => {
    if (!auth.currentUser || !bankId || !selectedExam) return;

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
               REQUIREMENT_KEYS.includes(mapping.requirement as any);
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
      const updatedChapters = JSON.parse(JSON.stringify(questionBank!.chapters));
      
      // Group questions by chapter and subcontent for batch processing
      const questionsByChapterAndSubcontent: { [key: string]: QuestionMapping[] } = {};
      
      validQuestions.forEach(mapping => {
        const key = `${mapping.chapterIndex}-${mapping.subContentIndex}-${mapping.requirement}`;
        if (!questionsByChapterAndSubcontent[key]) {
          questionsByChapterAndSubcontent[key] = [];
        }
        questionsByChapterAndSubcontent[key].push(mapping);
      });
      
      // Process each group and add questions to the requirements
      Object.keys(questionsByChapterAndSubcontent).forEach(key => {
        const [chapterIndexStr, subContentIndexStr, requirement] = key.split('-');
        const chapterIndex = parseInt(chapterIndexStr);
        const subContentIndex = parseInt(subContentIndexStr);
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
        if (!updatedChapters[chapterIndex].subContents[subContentIndex].requirements![requirement]) {
          updatedChapters[chapterIndex].subContents[subContentIndex].requirements![requirement] = [];
        }
        
        // Get the requirements array for this level
        const requirementsArray = updatedChapters[chapterIndex].subContents[subContentIndex].requirements![requirement];
        
        // Group questions by itemIndex to insert them in the correct position
        const questionsByItemIndex: { [key: string]: QuestionMapping[] } = {};
        
        mappings.forEach(mapping => {
          const itemIndex = mapping.itemIndex;
          if (itemIndex !== null && itemIndex !== undefined) {
            const key = String(itemIndex);
            if (!questionsByItemIndex[key]) {
              questionsByItemIndex[key] = [];
            }
            questionsByItemIndex[key].push(mapping);
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
          const mappingsForItem = questionsByItemIndex[String(itemIndex)];
          
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
          const questionsToInsert: any[] = [];
          mappingsForItem.forEach(mapping => {
            const question = mapping.question;

            // Prepare question data for storage
            let questionData: any = {
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
              chapterIndex: chapterIndex,
              subContentIndex: subContentIndex,
              itemIndex: itemIndex,
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
                  options: (question.options || []).map((opt: any) => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                
                const correctOptionIndex = (question.options || []).findIndex((opt: any) => opt.is_correct);
                if (correctOptionIndex !== -1) {
                  questionData.correctAnswer = correctOptionIndex;
                }
              } else if (question.type === 'truefalse') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  options: (question.options || []).map((opt: any) => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                questionData.correctAnswers = (question.options || []).map((opt: any) => opt.is_correct);
              } else if (question.type === 'shortanswer') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  type: question.type
                };
              }
            } else {
              questionData.questionData = question;
            }
            
            questionsToInsert.push(questionData);
          });
          
          // Insert all questions at once at the correct position
          requirementsArray.splice(insertPosition, 0, ...questionsToInsert);
        });
        
        // Handle questions without itemIndex - add them at the end
        if (questionsByItemIndex['_no_index']) {
          questionsByItemIndex['_no_index'].forEach(mapping => {
            const question = mapping.question;

            let questionData: any = {
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
              chapterIndex: chapterIndex,
              subContentIndex: subContentIndex,
              suggestionConfidence: mapping.aiSuggestion?.confidence ?? null,
              suggestionReason: mapping.aiSuggestion?.reason || null,
              suggestedByAI: Boolean(mapping.aiSuggestion),
              manualOverride: Boolean(mapping.manualOverride),
              assignedAt: new Date().toISOString()
            };

            if (question.originalFormat) {
              questionData.questionType = question.type;
              
              if (question.type === 'mcq') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  options: (question.options || []).map((opt: any) => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                
                const correctOptionIndex = (question.options || []).findIndex((opt: any) => opt.is_correct);
                if (correctOptionIndex !== -1) {
                  questionData.correctAnswer = correctOptionIndex;
                }
              } else if (question.type === 'truefalse') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  options: (question.options || []).map((opt: any) => ({
                    option: opt.text || opt.option,
                    is_correct: opt.is_correct
                  })),
                  type: question.type
                };
                questionData.correctAnswers = (question.options || []).map((opt: any) => opt.is_correct);
              } else if (question.type === 'shortanswer') {
                questionData.formattedQuestion = {
                  question: question.question_text,
                  type: question.type
                };
              }
            } else {
              questionData.questionData = question;
            }
            
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
      
    } catch (error: any) {
      console.error("Error importing questions:", error);
      alert("Có lỗi xảy ra khi import câu hỏi: " + (error.message || String(error)));
      setImporting(false);
    }
  };
  
  // Toggle requirement selection UI for a question
  const toggleRequirementSelection = (questionId: string) => {
    setExpandedRequirements(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Toggle subContent expansion
  const toggleSubContent = (chapterIndex: number, subContentIndex: number) => {
    const key = `${chapterIndex}-${subContentIndex}`;
    setExpandedSubContents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle requirement level expansion
  const toggleRequirementLevel = (chapterIndex: number, subContentIndex: number, requirement: string) => {
    const key = `${chapterIndex}-${subContentIndex}-${requirement}`;
    setExpandedRequirementLevels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Select a specific requirement item for a question
  const selectRequirement = (questionId: string, chapterIndex: number, subContentIndex: number, requirement: string, itemIndex?: number) => {
    setQuestionsToImport(prev =>
      prev.map(q =>
        q.question.id === questionId
          ? {
              ...q,
              chapterIndex,
              subContentIndex,
              requirement,
              itemIndex: itemIndex !== undefined ? itemIndex : null,
              selected: true, // Automatically select when classified
              manualOverride: true
            }
          : q
      )
    );
    // Close the dropdown after selection
    toggleRequirementSelection(questionId);
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
          <StepNavigation currentStep={step} />
          
          {step === 1 && (
            <FolderStructureView
              displayItems={displayItems}
              currentPath={currentPath}
              onNavigateToRoot={navigateToRoot}
              onNavigateBack={navigateBack}
              onNavigateToPath={navigateToPath}
              onOpenFolder={openFolder}
              onSelectExam={selectExam}
            />
          )}
          
          {step === 2 && (
            <QuestionMappingView
              selectedExam={selectedExam}
              questionsToImport={questionsToImport}
              questionBank={questionBank}
              coverage={coverage}
              suggestionsLoading={suggestionsLoading}
              importing={importing}
              expandedRequirements={expandedRequirements}
              expandedSubContents={expandedSubContents}
              expandedRequirementLevels={expandedRequirementLevels}
              onBack={() => setStep(1)}
              onImport={handleImport}
              onToggleSelection={toggleQuestionSelection}
              onToggleRequirementSelection={toggleRequirementSelection}
              onToggleSubContent={toggleSubContent}
              onToggleRequirementLevel={toggleRequirementLevel}
              onSelectRequirement={selectRequirement}
              onApplySuggestion={applySuggestionToQuestion}
              isValidSuggestion={isValidSuggestion}
            />
          )}
        </div>
      </div>
    </MathJaxContext>
  );
};

export default ImportExamQuestions;

