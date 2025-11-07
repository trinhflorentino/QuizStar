import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../services/firebaseConfig";
import { MdCloudUpload, MdEdit, MdDelete } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { MathJax } from "better-react-mathjax";
import { useNavigate } from 'react-router-dom';
import { matrixQuestionsJSON } from '../components/AI/AIService';

function QuestionBank() {
  const [questionBanks, setQuestionBanks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBank, setDeletingBank] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        if (auth.currentUser) {
          const userQuestionBanksRef = collection(db, "users", auth.currentUser.uid, "questionBanks");
          const querySnapshot = await getDocs(userQuestionBanksRef);
          
          const banks = [];
          querySnapshot.forEach((doc) => {
            banks.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setQuestionBanks(banks);
        }
      } catch (error) {
        console.error("Error fetching question banks:", error);
      }
    };
    
    fetchQuestionBanks();
  }, [auth.currentUser]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };
  
  const openEditModal = (bank, e) => {
    e.stopPropagation(); // Prevent navigation when clicking edit button
    setEditingBank(bank);
    setEditTitle(bank.title);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBank(null);
    setEditTitle("");
  };
  
  const openDeleteModal = (bank, e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete button
    setDeletingBank(bank);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingBank(null);
  };
  
  const handleEditSubmit = async () => {
    if (!editingBank) return;
    
    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", editingBank.id);
      await updateDoc(bankDocRef, {
        title: editTitle
      });
      
      // Update local state
      setQuestionBanks(prevBanks => 
        prevBanks.map(bank => 
          bank.id === editingBank.id 
            ? { ...bank, title: editTitle }
            : bank
        )
      );
      
      closeEditModal();
    } catch (error) {
      console.error("Error updating question bank:", error);
      alert("Có lỗi xảy ra khi cập nhật ngân hàng câu hỏi");
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!deletingBank) return;
    
    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", deletingBank.id);
      await deleteDoc(bankDocRef);
      
      // Update local state
      setQuestionBanks(prevBanks => 
        prevBanks.filter(bank => bank.id !== deletingBank.id)
      );
      
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting question bank:", error);
      alert("Có lỗi xảy ra khi xóa ngân hàng câu hỏi");
    }
  };
  
  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Define prompt for AI analysis
      const prompt = `Phân tích tài liệu này và trích xuất cấu trúc theo chương/chủ đề, nội dung con và các mức độ yêu cầu.
      Hãy trả về kết quả JSON theo định dạng sau:
      {
        "title": "Tên của ngân hàng câu hỏi",
        "chapters": [
          {
            "name": "Tên chương/chủ đề",
            "subContents": [
              {
                "name": "Tên nội dung con",
                "requirements": {
                  "nhanBiet": [
                    {
                      "description": "Mô tả yêu cầu nhận biết"
                    }
                  ],
                  "thongHieu": [
                    {
                      "description": "Mô tả yêu cầu thông hiểu"
                    }
                  ],
                  "vanDung": [
                    {
                      "description": "Mô tả yêu cầu vận dụng"
                    }
                  ],
                  "vanDungCao": [
                    {
                      "description": "Mô tả yêu cầu vận dụng cao"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
      `;
      
      // Use AI service to analyze the document
      const analysisResult = await matrixQuestionsJSON(selectedFile, prompt);
      
      // Parse the result
      let parsedResult;
      try {
        parsedResult = JSON.parse(analysisResult);
      } catch (error) {
        console.error("Error parsing AI response:", error);
        throw new Error("Không thể phân tích kết quả từ AI");
      }
      
      // Process the parsed result to remove descriptions
      const cleanResult = {
        title: parsedResult.title || "Ngân hàng câu hỏi mới",
        chapters: []
      };
      
      // Clean chapters and subContents to remove any description fields
      if (parsedResult.chapters && Array.isArray(parsedResult.chapters)) {
        cleanResult.chapters = parsedResult.chapters.map(chapter => {
          // Create clean chapter object without description
          const cleanChapter = {
            name: chapter.name || "Chương không tên",
            subContents: []
          };
          
          // Process subContents
          if (chapter.subContents && Array.isArray(chapter.subContents)) {
            cleanChapter.subContents = chapter.subContents.map(subContent => {
              if (!subContent) return null;
              
              // Create clean subContent object without description
              const cleanSubContent = {
                name: subContent.name || "Nội dung không tên",
                requirements: {
                  nhanBiet: [],
                  thongHieu: [], 
                  vanDung: [],
                  vanDungCao: []
                }
              };
              
              // Keep requirements with descriptions
              if (subContent.requirements) {
                // Make sure all requirement levels exist with at least empty arrays
                ['nhanBiet', 'thongHieu', 'vanDung', 'vanDungCao'].forEach(level => {
                  // Initialize with empty array if not present
                  if (!cleanSubContent.requirements[level]) {
                    cleanSubContent.requirements[level] = [];
                  }
                  
                  // Only copy if source array exists
                  if (Array.isArray(subContent.requirements[level])) {
                    // Filter out any items without a description
                    cleanSubContent.requirements[level] = subContent.requirements[level]
                      .filter(item => item && typeof item === 'object')
                      .map(item => ({
                        description: item.description || "Yêu cầu không có mô tả"
                      }));
                  }
                });
              }
              
              return cleanSubContent;
            }).filter(Boolean); // Remove any null values
          }
          
          return cleanChapter;
        });
      }
      
      console.log("Cleaned data structure:", cleanResult);
      
      // Save to database
      if (auth.currentUser) {
        const userQuestionBanksRef = collection(db, "users", auth.currentUser.uid, "questionBanks");
        const docRef = await addDoc(userQuestionBanksRef, {
          title: cleanResult.title,
          chapters: cleanResult.chapters,
          createdAt: new Date(),
          filename: selectedFile.name
        });
        
        // Add to local state
        setQuestionBanks(prevBanks => [
          ...prevBanks,
          {
            id: docRef.id,
            title: cleanResult.title,
            chapters: cleanResult.chapters,
            createdAt: new Date(),
            filename: selectedFile.name
          }
        ]);
      }
      
      setIsUploading(false);
      closeModal();
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Có lỗi xảy ra khi xử lý file: " + error.message);
      setIsUploading(false);
    }
  };
  
  const viewQuestionBank = (bankId) => {
    navigate(`/QuestionBank/${bankId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ngân hàng câu hỏi</h1>
      
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tạo ngân hàng câu hỏi mới</h2>
        <p className="mb-4 text-gray-600">
          Tải lên file ma trận/đặc tả bài học để AI phân tích và tạo cấu trúc theo chương/chủ đề, nội dung con và các mức độ yêu cầu.
        </p>
        
        <div className="flex items-center">
          <label 
            htmlFor="fileUpload" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
          >
            <MdCloudUpload className="text-xl" />
            <span>Tải lên tệp ma trận/đặc tả</span>
          </label>
          <input 
            id="fileUpload" 
            type="file" 
            className="hidden" 
            accept=".docx, .pdf, .doc, image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
      
      {/* Question Banks List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách ngân hàng câu hỏi</h2>
        
        {questionBanks.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có ngân hàng câu hỏi nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionBanks.map((bank) => (
              <div 
                key={bank.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => viewQuestionBank(bank.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <IoDocumentText className="text-blue-500 text-2xl" />
                  <h3 className="font-medium text-lg">{bank.title}</h3>
                </div>
                <p className="text-gray-500 text-xs">
                  File: {bank.filename}
                </p>
                <p className="text-gray-500 text-xs">
                  Tạo lúc: {bank.createdAt instanceof Date 
                    ? bank.createdAt.toLocaleString() 
                    : new Date(bank.createdAt?.seconds * 1000).toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs">
                  Số chương/chủ đề: {bank.chapters?.length || 0}
                </p>
                
                {/* Move buttons to bottom right */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button 
                    className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full"
                    onClick={(e) => openEditModal(bank, e)}
                    title="Chỉnh sửa"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-full"
                    onClick={(e) => openDeleteModal(bank, e)}
                    title="Xóa"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal for confirming file upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Xác nhận tải lên</h2>
            <p className="mb-4">
              File: <span className="font-medium">{selectedFile?.name}</span>
            </p>
            <p className="mb-6 text-gray-600">
              AI sẽ phân tích file và tạo cấu trúc theo chương/chủ đề, nội dung con và các mức độ yêu cầu bài học. Quá trình này có thể mất một lúc.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                onClick={closeModal}
                disabled={isUploading}
              >
                Hủy
              </button>
              <button
                className={`px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 ${
                  isUploading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
                onClick={processFile}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Xác nhận
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for editing question bank */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa ngân hàng câu hỏi</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Tên ngân hàng câu hỏi
              </label>
              <input
                id="title"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nhập tên ngân hàng câu hỏi"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                onClick={closeEditModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleEditSubmit}
                disabled={!editTitle}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for confirming deletion */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-6 text-gray-700">
              Bạn có chắc chắn muốn xóa ngân hàng câu hỏi <span className="font-medium">{deletingBank?.title}</span>? Hành động này không thể hoàn tác.
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
                onClick={handleDeleteConfirm}
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

export default QuestionBank; 