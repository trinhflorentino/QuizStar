import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../services/firebaseConfig";
import { IoChevronBack } from "react-icons/io5";
import { FaFolder, FaFileAlt, FaArrowLeft, FaArrowRight, FaHome, FaChevronRight } from "react-icons/fa";
import { MathJax, MathJaxContext } from "better-react-mathjax";

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
  
  const navigate = useNavigate();
  const auth = getAuth();
  const ROOT_ID = '__root__';
  
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
          selected: true,
          chapterIndex: 0,
          subContentIndex: defaultSubContent ? 0 : null,
          requirement: "nhanBiet" // Default requirement level
        }));
        
        setQuestionsToImport(initialMappings);
      }
      
      // Move to step 2
      setStep(2);
    } catch (error) {
      console.error("Error fetching exam questions:", error);
      alert("Không thể tải câu hỏi từ đề thi này");
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle question selection checkbox
  const toggleQuestionSelection = (questionId) => {
    setQuestionsToImport(prev => 
      prev.map(q => 
        q.question.id === questionId 
          ? { ...q, selected: !q.selected } 
          : q
      )
    );
  };
  
  const updateQuestionMapping = (questionId, field, value) => {
    setQuestionsToImport(prev => 
      prev.map(q => 
        q.question.id === questionId 
          ? { ...q, [field]: value } 
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
      
      // Create a deep copy of the question bank chapters
      const updatedChapters = JSON.parse(JSON.stringify(questionBank.chapters));
      
      // Group questions by chapter and subcontent for batch processing
      const questionsByChapterAndSubcontent = {};
      
      selectedQuestions.forEach(mapping => {
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
        
        // Add questions to the requirement
        mappings.forEach(mapping => {
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
          
          // Add question to requirements
          updatedChapters[chapterIndex].subContents[subContentIndex].requirements[requirement].push(questionData);
        });
      });
      
      // Update the question bank in Firestore
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Success message and navigation
      alert("Đã import thành công " + selectedQuestions.length + " câu hỏi vào ngân hàng câu hỏi!");
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
  
  // Select a specific requirement for a question
  const selectRequirement = (questionId, chapterIndex, subContentIndex, requirement) => {
    setQuestionsToImport(prev => 
      prev.map(q => 
        q.question.id === questionId 
          ? { 
              ...q, 
              chapterIndex, 
              subContentIndex, 
              requirement 
            } 
          : q
      )
    );
    // Close the dropdown after selection
    toggleRequirementSelection(questionId);
  };
  
  // Render the requirements selection UI for a question
  const renderRequirementSelector = (questionId, mapping) => {
    const isExpanded = expandedRequirements[questionId];
    
    if (!isExpanded) {
      return (
        <button
          onClick={() => toggleRequirementSelection(questionId)}
          className="mt-3 text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <span>Chọn yêu cầu</span>
          <FaChevronRight className="ml-1" />
        </button>
      );
    }
    
    return (
      <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Chọn yêu cầu</h4>
          <button
            onClick={() => toggleRequirementSelection(questionId)}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoChevronBack className="ml-1" />
          </button>
        </div>
        
        <div className="space-y-3">
          {questionBank.chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border border-gray-200 rounded-lg">
              <div className="p-2 bg-gray-100 font-medium text-sm">
                {chapter.name}
              </div>
              
              {chapter.subContents && chapter.subContents.length > 0 ? (
                <div className="p-2">
                  {chapter.subContents.map((subContent, subContentIndex) => (
                    <div key={subContentIndex} className="mb-2 border-b pb-2 last:border-b-0 last:pb-0">
                      <div className="font-medium text-sm mb-1">{subContent.name}</div>
                      
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          className={`text-xs p-1 rounded ${
                            mapping.chapterIndex === chapterIndex && 
                            mapping.subContentIndex === subContentIndex && 
                            mapping.requirement === 'nhanBiet' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => selectRequirement(questionId, chapterIndex, subContentIndex, 'nhanBiet')}
                        >
                          Nhận biết
                        </button>
                        
                        <button
                          className={`text-xs p-1 rounded ${
                            mapping.chapterIndex === chapterIndex && 
                            mapping.subContentIndex === subContentIndex && 
                            mapping.requirement === 'thongHieu' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => selectRequirement(questionId, chapterIndex, subContentIndex, 'thongHieu')}
                        >
                          Thông hiểu
                        </button>
                        
                        <button
                          className={`text-xs p-1 rounded ${
                            mapping.chapterIndex === chapterIndex && 
                            mapping.subContentIndex === subContentIndex && 
                            mapping.requirement === 'vanDung' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => selectRequirement(questionId, chapterIndex, subContentIndex, 'vanDung')}
                        >
                          Vận dụng
                        </button>
                        
                        <button
                          className={`text-xs p-1 rounded ${
                            mapping.chapterIndex === chapterIndex && 
                            mapping.subContentIndex === subContentIndex && 
                            mapping.requirement === 'vanDungCao' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => selectRequirement(questionId, chapterIndex, subContentIndex, 'vanDungCao')}
                        >
                          Vận dụng cao
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-gray-500 italic text-sm">
                  Không có nội dung con
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
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Chọn câu hỏi từ đề thi: {selectedExam?.quiz_title}
        </h2>
        
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-blue-800">
            Đã tìm thấy {examQuestions.length} câu hỏi từ đề thi này. Vui lòng chọn câu hỏi và yêu cầu tương ứng.
          </p>
        </div>
        
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại chọn đề thi
          </button>
          
          <button
            onClick={() => handleImport()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={importing || questionsToImport.filter(q => q.selected).length === 0}
          >
            {importing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Đang import...
              </>
            ) : (
              <>
                <FaArrowRight className="mr-2" />
                Import {questionsToImport.filter(q => q.selected).length} câu hỏi
              </>
            )}
          </button>
        </div>
        
        {/* Question cards with requirements selection */}
        <div className="space-y-6">
          {questionsToImport.map((mapping, index) => (
            <div 
              key={mapping.question.id} 
              className={`border rounded-lg ${mapping.selected ? "border-blue-200" : "border-gray-200"}`}
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={mapping.selected}
                    onChange={() => toggleQuestionSelection(mapping.question.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                  />
                  <h3 className="font-medium">Câu hỏi {index + 1}</h3>
                </div>
                
                <div className="text-sm text-gray-500">
                  {mapping.selected ? (
                    <>
                      <span className="font-medium text-blue-600">
                        {questionBank.chapters[mapping.chapterIndex]?.name || "Không xác định"} / 
                        {questionBank.chapters[mapping.chapterIndex]?.subContents?.[mapping.subContentIndex]?.name || "Không xác định"}
                      </span>
                      <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                        {mapping.requirement === 'nhanBiet' && 'Nhận biết'}
                        {mapping.requirement === 'thongHieu' && 'Thông hiểu'}
                        {mapping.requirement === 'vanDung' && 'Vận dụng'}
                        {mapping.requirement === 'vanDungCao' && 'Vận dụng cao'}
                      </span>
                    </>
                  ) : (
                    <span className="italic">Không được chọn</span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {/* Question content */}
                <div className={`${mapping.selected ? "text-gray-900" : "text-gray-500"}`}>
                  {mapping.question.originalFormat ? (
                    <MathJax>
                      <div dangerouslySetInnerHTML={{ __html: mapping.question.question_text }} />
                    </MathJax>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: mapping.question.question_text || "Không có nội dung" }} />
                  )}
                  
                  {/* Display answer options for MCQ */}
                  {mapping.question.type === "mcq" && mapping.question.options && (
                    <div className="mt-2 pl-4 text-sm">
                      {mapping.question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={`${option.is_correct ? "font-semibold text-green-600" : ""}`}>
                          {String.fromCharCode(65 + optionIndex)}. {mapping.question.originalFormat ? (
                            <MathJax>
                              <span dangerouslySetInnerHTML={{ __html: option.text || option.option }} />
                            </MathJax>
                          ) : (
                            <span>{option.text}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Display true/false options */}
                  {mapping.question.type === "truefalse" && mapping.question.options && (
                    <div className="mt-2 pl-4 text-sm">
                      {mapping.question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          {String.fromCharCode(97 + optionIndex)}. {option.text || option.option}: 
                          <span className={option.is_correct ? "ml-2 font-semibold text-green-600" : "ml-2"}>
                            {option.is_correct ? "Đúng" : "Sai"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Display short answer */}
                  {mapping.question.type === "shortanswer" && (
                    <div className="mt-2 pl-4 text-sm italic">
                      Câu hỏi tự luận
                    </div>
                  )}
                </div>
                
                {/* Requirements selection UI */}
                {mapping.selected && renderRequirementSelector(mapping.question.id, mapping)}
              </div>
            </div>
          ))}
          
          {questionsToImport.length === 0 && (
            <div className="text-center p-8 text-gray-500 italic">
              Không tìm thấy câu hỏi nào trong đề thi này.
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render folder structure similar to FolderStructure.js
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
        
        {/* Display folders and exams in grid style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {displayItems.map(item => (
            <div 
              key={item.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => item.type === 'folder' ? openFolder(item) : selectExam(item)}
            >
              <div className="flex items-center">
                {item.type === 'folder' ? (
                  <FaFolder className="text-yellow-500 mr-3 text-xl" />
                ) : (
                  <FaFileAlt className="text-blue-500 mr-3 text-xl" />
                )}
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-medium truncate">
                    {item.type === 'folder' ? item.name : item.quiz_title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.type === 'folder' ? 'Thư mục' : 'Đề thi'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {displayItems.length === 0 && (
            <div className="col-span-full text-center p-8 text-gray-500 italic">
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