import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc, query, where } from "firebase/firestore/lite";
import db from "../services/firebaseConfig";
import { FaFolder, FaFileAlt, FaPlus, FaEdit, FaTrash, FaHome, FaChevronRight, FaEllipsisV, FaCopy, FaCut, FaPaste, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const ROOT_ID = '__root__';

const FolderStructure = ({ searchTerm }) => {
  const [folders, setFolders] = useState([]);
  const [exams, setExams] = useState([]);
  const [examPins, setExamPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [showFolderMenu, setShowFolderMenu] = useState(null);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [filteredDisplayItems, setFilteredDisplayItems] = useState([]);
  const [clipboard, setClipboard] = useState([]);
  const [clipboardOperation, setClipboardOperation] = useState(null);
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, authInitialized } = useAuth();
  const { success, error, info } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFolderMenu && !event.target.closest('.folder-menu')) {
        setShowFolderMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFolderMenu]);

  useEffect(() => {
    if (authInitialized && !authLoading) {
      if (currentUser) {
        loadUserData();
      } else {
        setLoading(false);
        setFolders([]);
        setExams([]);
        setExamPins([]);
        setCurrentPath([]);
        setSelectedItems([]);
      }
    }
  }, [authInitialized, authLoading, currentUser]);

  const loadUserData = async () => {
    setLoading(true);
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const userId = currentUser.uid;

      const foldersQuery = collection(db, "Users", userId, "Folders");
      const foldersSnapshot = await getDocs(foldersQuery);
      const foldersData = foldersSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'folder',
        ...doc.data(),
        parent: doc.data().parent || ROOT_ID,
      }));
      setFolders(foldersData);

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
      setExamPins(examsData.map(e => e.id));

    } catch (err) {
      console.error("Error loading data:", err);
      error("Không thể tải dữ liệu thư viện.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDisplayItems = (currentFolders = folders, currentExams = exams) => {
    let displayItems = [];
    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;

    const subfolders = currentFolders.filter(f => f.parent === currentFolderId);
    displayItems.push(...subfolders);

    const examsInFolder = currentExams.filter(e => e.folderId === currentFolderId);
    displayItems.push(...examsInFolder);

    return displayItems;
  };

  const filterItems = (items, term) => {
    if (!term) return items;
    const lowerSearchTerm = term.toLowerCase();
    return items.filter(item => {
      if (item.type === 'folder') return item.name.toLowerCase().includes(lowerSearchTerm);
      if (item.type === 'exam') return item.quiz_title?.toLowerCase().includes(lowerSearchTerm);
      return false;
    });
  };

  useEffect(() => {
    const items = calculateDisplayItems();
    setFilteredDisplayItems(filterItems(items, searchTerm));
  }, [searchTerm, currentPath, folders, exams]);

  const createNewFolder = async () => {
    const folderName = prompt("Nhập tên thư mục:");
    if (!folderName) return;

    if (!currentUser) {
      error("Vui lòng đăng nhập để tạo thư mục");
      return;
    }

    const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;

    try {
      setLoading(true);
      const folderRef = collection(db, "Users", currentUser.uid, "Folders");
      await addDoc(folderRef, {
        name: folderName,
        createdAt: new Date(),
        parent: parentId,
      });

      setShowFolderMenu(null);
      success("Tạo thư mục thành công!");
      await loadUserData();
    } catch (err) {
      console.error("Error creating folder:", err);
      error("Không thể tạo thư mục!");
      setLoading(false);
    }
  };

  const deleteFolderRecursive = async (folderId) => {
    if (!currentUser) throw new Error("User not authenticated");
    const userId = currentUser.uid;
    const folderRef = doc(db, "Users", userId, "Folders", folderId);

    const orphanPromises = [];

    const subfolderQuery = query(collection(db, "Users", userId, "Folders"), where("parent", "==", folderId));
    const subfolderSnap = await getDocs(subfolderQuery);
    subfolderSnap.docs.forEach(subDoc => {
      orphanPromises.push(updateDoc(subDoc.ref, { parent: ROOT_ID }));
    });

    const examQuery = query(collection(db, "Users", userId, "Exams_Created"), where("folderId", "==", folderId));
    const examSnap = await getDocs(examQuery);
    examSnap.docs.forEach(examDoc => {
      orphanPromises.push(updateDoc(examDoc.ref, { folderId: ROOT_ID }));
    });

    await Promise.all(orphanPromises);

    await deleteDoc(folderRef);
  };

  const deleteExamData = async (examId) => {
    if (!currentUser) throw new Error("User not authenticated");
    const userId = currentUser.uid;
    const examPromises = [];

    const userExamRef = doc(db, "Users", userId, "Exams_Created", examId);
    examPromises.push(deleteDoc(userExamRef).catch(err => console.warn(`Could not delete user exam ref ${examId}:`, err)));

    const paperSetterRef = doc(db, "Paper_Setters", examId);
    const responsesRef = collection(paperSetterRef, "Responses");
    const questionsRef = collection(paperSetterRef, "Question_Papers_MCQ");

    const subCollectionPromises = [
      getDocs(responsesRef).then(snapshot => Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)))).catch(err => console.warn(`Could not delete responses for ${examId}:`, err)),
      getDocs(questionsRef).then(snapshot => Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)))).catch(err => console.warn(`Could not delete questions for ${examId}:`, err))
    ];

    const finalDeletePromise = Promise.all(subCollectionPromises).then(() =>
      getDoc(paperSetterRef).then(docSnap => {
        if (docSnap.exists()) {
          return deleteDoc(paperSetterRef);
        }
      }).catch(err => console.warn(`Could not delete paper setter ref ${examId}:`, err))
    );

    examPromises.push(finalDeletePromise);

    return Promise.all(examPromises);
  };

  const deleteSelectedItems = async () => {
    const selectedExams = selectedItems.filter(item => item.type === 'exam');
    const selectedFolders = selectedItems.filter(item => item.type === 'folder');

    if (selectedItems.length === 0) {
      error("Vui lòng chọn ít nhất một mục để xóa");
      return;
    }

    const itemsText = `${selectedExams.length} đề thi và ${selectedFolders.length} thư mục`;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${itemsText}? Thao tác này không thể hoàn tác và sẽ xóa vĩnh viễn các mục đã chọn.`)) {
      return;
    }

    setLoading(true);
    const deletePromises = [];

    for (const folder of selectedFolders) {
      deletePromises.push(deleteFolderRecursive(folder.id));
    }

    for (const exam of selectedExams) {
      deletePromises.push(deleteExamData(exam.id));
    }

    try {
      await Promise.all(deletePromises);
      success(`Đã xóa ${itemsText} thành công!`);
      clearSelection();
    } catch (err) {
      console.error("Error deleting items:", err);
      error("Lỗi khi xóa các mục. Vui lòng thử lại.");
    } finally {
      await loadUserData();
    }
  };

  const renameFolder = async (folder) => {
    const newName = prompt("Nhập tên thư mục mới:", folder.name);
    if (!newName || newName === folder.name) return;

    if (!currentUser) {
      error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    setLoading(true);
    try {
      const folderRef = doc(db, "Users", currentUser.uid, "Folders", folder.id);
      await updateDoc(folderRef, { name: newName });
      success("Đổi tên thư mục thành công!");
      await loadUserData();
    } catch (err) {
      console.error("Error renaming folder:", err);
      error("Không thể đổi tên thư mục!");
      setLoading(false);
      await loadUserData();
    }
  };

  const copySelectedItems = () => {
    if (selectedItems.length === 0) {
      error("Vui lòng chọn ít nhất một mục để sao chép");
      return;
    }
    setClipboard([...selectedItems]);
    setClipboardOperation('copy');
    success(`Đã sao chép ${selectedItems.length} mục vào bộ nhớ tạm`);
  };

  const cutSelectedItems = () => {
    if (selectedItems.length === 0) {
      error("Vui lòng chọn ít nhất một mục để cắt");
      return;
    }
    setClipboard([...selectedItems]);
    setClipboardOperation('cut');
    success(`Đã cắt ${selectedItems.length} mục vào bộ nhớ tạm`);
  };

  const pasteItems = async () => {
    if (clipboard.length === 0) {
      error("Không có mục nào trong bộ nhớ tạm");
      return;
    }

    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;

    setLoading(true);
    const pastePromises = [];

    for (const item of clipboard) {
      if (item.type === 'exam') {
        const examRef = doc(db, "Users", currentUser.uid, "Exams_Created", item.id);
        pastePromises.push(updateDoc(examRef, { folderId: currentFolderId }));
      } else if (item.type === 'folder') {
        if (item.id === currentFolderId) {
          console.warn("Attempted to paste a folder into itself.");
          continue;
        }
        const folderRef = doc(db, "Users", currentUser.uid, "Folders", item.id);
        pastePromises.push(updateDoc(folderRef, { parent: currentFolderId }));
      }
    }

    try {
      await Promise.all(pastePromises);
      success(`Đã dán ${clipboard.length} mục thành công!`);

      if (clipboardOperation === 'cut') {
        setClipboard([]);
        setClipboardOperation(null);
      }

    } catch (err) {
      console.error("Error pasting items:", err);
      error("Lỗi khi dán các mục. Vui lòng thử lại.");
    } finally {
      await loadUserData();
    }
  };

  const clearClipboard = () => {
    setClipboard([]);
    setClipboardOperation(null);
    success("Đã xóa bộ nhớ tạm");
  };

  const addSelectedExamToFolder = async (examId) => {
    if (!currentUser) {
      error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;
    const exam = exams.find(e => e.id === examId);
    if (exam?.folderId === currentFolderId) {
      info("Đề thi đã ở trong thư mục này.");
      setShowAddExamModal(false);
      return;
    }

    setLoading(true);
    try {
      const examRef = doc(db, "Users", currentUser.uid, "Exams_Created", examId);
      await updateDoc(examRef, { folderId: currentFolderId });

      setShowAddExamModal(false);
      success("Đã thêm đề thi vào thư mục!");
      await loadUserData();

    } catch (err) {
      console.error("Error adding exam to folder:", err);
      error("Không thể thêm đề thi vào thư mục!");
      setLoading(false);
      await loadUserData();
    }
  };

  const navigateTo = (newPath) => {
    setCurrentPath(newPath);
    setSelectedItems([]);
    setShowActionMenu(false);
  };

  const openFolder = (folder) => {
    navigateTo([...currentPath, folder]);
  };

  const navigateToRoot = () => {
    navigateTo([]);
  };

  const navigateToIndex = (index) => {
    navigateTo(currentPath.slice(0, index + 1));
  };

  const toggleFolderMenu = (e, folderId) => {
    e.stopPropagation();
    setShowFolderMenu(showFolderMenu === folderId ? null : folderId);
  };

  const addExamToCurrentFolderModal = () => {
    if (currentPath.length === 0) {
      error("Vui lòng chọn một thư mục trước khi thêm đề thi");
      return;
    }
    setShowAddExamModal(true);
  };

  const viewExamDetails = (examId) => {
    navigate(`/ExamsCreated/ExamResults/${examId}`);
  };

  const toggleSelectItem = (e, item) => {
    e.stopPropagation();

    setSelectedItems(prevSelected => {
      const isSelected = prevSelected.some(selected =>
        selected.id === item.id && selected.type === item.type
      );

      if (isSelected) {
        return prevSelected.filter(selected =>
          !(selected.id === item.id && selected.type === item.type)
        );
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const isItemSelected = (item) => {
    return selectedItems.some(selected =>
      selected.id === item.id && selected.type === item.type
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredDisplayItems.length) {
      setSelectedItems([]);
    } else {
      const uniqueItems = Array.from(new Map(filteredDisplayItems.map(item => [`${item.type}-${item.id}`, item])).values());
      setSelectedItems(uniqueItems);
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thư viện đề thi</h2>
        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem thư viện đề thi của bạn.</p>
        <button
          onClick={() => navigate("/Login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Thư viện đề thi</h2>
        <div className="flex items-center space-x-2">
          {currentPath.length > 0 && (
            <button
              onClick={addExamToCurrentFolderModal}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
            >
              <FaPlus size={14} />
              <span>Thêm đề thi</span>
            </button>
          )}
          <button
            onClick={createNewFolder}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            <FaPlus size={14} />
            <span>Thư mục mới</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md mb-4 overflow-x-auto">
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={navigateToRoot}
          disabled={loading}
        >
          <FaHome className="mr-1" />
          <span>Trang chủ</span>
        </button>
        
        {currentPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center">
            <FaChevronRight className="mx-2 text-gray-400" />
            <button
              className="text-blue-600 hover:text-blue-800 truncate max-w-[200px]"
              onClick={() => navigateToIndex(index)}
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>
      
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-blue-800 font-medium">Đã chọn {selectedItems.length} mục</span>
              <button
                onClick={clearSelection}
                className="ml-4 text-gray-600 hover:text-gray-800 text-sm"
                disabled={loading}
              >
                Bỏ chọn tất cả
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={copySelectedItems}
                className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                title="Sao chép"
                disabled={loading}
              >
                <FaCopy className="mr-1" />
                <span>Sao chép</span>
              </button>
              
              <button
                onClick={cutSelectedItems}
                className="flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded hover:bg-amber-200 transition-colors disabled:opacity-50"
                title="Cắt"
                disabled={loading}
              >
                <FaCut className="mr-1" />
                <span>Cắt</span>
              </button>
              
              <button
                onClick={deleteSelectedItems}
                className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                title="Xóa"
                disabled={loading}
              >
                <FaTrash className="mr-1" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {clipboard.length > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-md p-3 mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-green-800 font-medium">
              Đã {clipboardOperation === 'cut' ? 'cắt' : 'sao chép'} {clipboard.length} mục
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentPath.length > 0 && (
              <button
                onClick={pasteItems}
                className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                title="Dán vào thư mục hiện tại"
                disabled={loading}
              >
                <FaPaste className="mr-1" />
                <span>Dán</span>
              </button>
            )}
            
            <button
              onClick={clearClipboard}
              className="flex items-center text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Xóa bộ nhớ tạm"
              disabled={loading}
            >
              <FaTimes className="mr-1" />
              <span>Xóa</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-12 py-2 px-3 border-b border-gray-200 bg-gray-50 font-medium text-gray-700 rounded-t-md">
        <div className="col-span-1">
          <input 
            type="checkbox" 
            className="w-4 h-4"
            onChange={toggleSelectAll}
            checked={filteredDisplayItems.length > 0 && selectedItems.length === filteredDisplayItems.length}
          />
        </div>
        <div className="col-span-8">Tên</div>
        <div className="col-span-3 text-right">Thao tác</div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {filteredDisplayItems.map(item => {
          if (item.type === 'folder') {
            return (
              <div 
                key={item.id}
                className={`grid grid-cols-12 p-3 ${isItemSelected(item) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => {
                  setSelectedItem({ id: item.id, type: 'folder' });
                  openFolder(item);
                }}
              >
                <div className="col-span-1">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4"
                    checked={isItemSelected(item)}
                    onChange={(e) => toggleSelectItem(e, item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-8 flex items-center">
                  <FaFolder className="text-yellow-500 mr-3 flex-shrink-0" />
                  <span className="truncate font-medium">{item.name}</span>
                </div>
                <div className="col-span-3 flex items-center justify-end space-x-2">
                  <div className="relative folder-menu">
                    <button 
                      onClick={(e) => !loading && toggleFolderMenu(e, item.id)}
                      className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      <FaEllipsisV size={14} />
                    </button>
                    
                    {showFolderMenu === item.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-44">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            createNewFolder();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        >
                          <FaPlus size={12} className="mr-2" />
                          <span>Tạo thư mục con</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            renameFolder(item);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        >
                          <FaEdit size={12} className="mr-2" />
                          <span>Đổi tên thư mục</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSelectedItems();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
                        >
                          <FaTrash size={12} className="mr-2" />
                          <span>Xóa thư mục</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div 
                key={item.id}
                className={`grid grid-cols-12 p-3 ${isItemSelected(item) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedItem({ id: item.id, type: 'exam' })}
              >
                <div className="col-span-1">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4"
                    checked={isItemSelected(item)}
                    onChange={(e) => toggleSelectItem(e, item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-8 flex items-center">
                  <FaFileAlt className="text-gray-500 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.quiz_title}</span>
                </div>
                <div className="col-span-3 flex items-center justify-end space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      !loading && viewExamDetails(item.id);
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md disabled:opacity-50"
                    disabled={loading}
                  >
                    Xem
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>
      
      {filteredDisplayItems.length === 0 && !loading && (
        <div className="text-center p-6 text-gray-500">
          {searchTerm 
            ? "Không tìm thấy kết quả nào phù hợp."
            : currentPath.length === 0 
              ? "Không có đề thi hoặc thư mục nào." 
              : "Thư mục này trống."}
        </div>
      )}

      {showAddExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chọn đề thi để thêm vào thư mục '{currentPath[currentPath.length-1]?.name}'</h3>

            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto border rounded-md">
              {exams
                .filter(exam => exam.folderId !== (currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID))
                .sort((a, b) => a.quiz_title.localeCompare(b.quiz_title))
                .map(exam => (
                  <div
                    key={exam.id}
                    className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => !loading && addSelectedExamToFolder(exam.id)}
                    title={`Thêm: ${exam.quiz_title}`}
                  >
                    <FaFileAlt className="text-gray-500 mr-3 flex-shrink-0" />
                    <span className="truncate">{exam.quiz_title}</span>
                  </div>
                ))}
            </div>

            {exams.filter(exam => exam.folderId !== (currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID)).length === 0 && (
              <div className="py-4 text-center text-gray-500">
                Không có đề thi nào khả dụng để thêm.
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
                onClick={() => setShowAddExamModal(false)}
                disabled={loading}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderStructure; 