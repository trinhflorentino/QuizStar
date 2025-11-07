import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../services/firebaseConfig";
import { MathJax } from "better-react-mathjax";
import { IoChevronBack, IoChevronDown, IoChevronForward, IoAddCircleOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { FiUpload } from "react-icons/fi";

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
  
  const navigate = useNavigate();
  const auth = getAuth();
  
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
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Có lỗi xảy ra khi xóa mục");
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
    } catch (error) {
      console.error("Error editing item:", error);
      alert("Có lỗi xảy ra khi chỉnh sửa mục");
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
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Có lỗi xảy ra khi thêm mục");
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
  const renderRequirements = (items, levelName, level, subContent, chapterIndex, subContentIndex) => {
    if (!items) items = [];
    
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
            items.map((item, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                <p className="text-sm">
                  {item.description}
                </p>
                <div className="flex items-center">
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
            ))
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
    </div>
  );
}

export default QuestionBankDetail; 