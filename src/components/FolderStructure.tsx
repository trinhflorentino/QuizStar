import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useFolderOperations } from './FolderStructure/hooks/useFolderOperations';
import Breadcrumb from './FolderStructure/Breadcrumb';
import SelectionToolbar from './FolderStructure/SelectionToolbar';
import ClipboardToolbar from './FolderStructure/ClipboardToolbar';
import FolderItem from './FolderStructure/FolderItem';
import ExamItem from './FolderStructure/ExamItem';
import AddExamModal from './FolderStructure/AddExamModal';
import type { Folder, Exam, DisplayItem, PathItem } from './FolderStructure/types';
import { ROOT_ID } from './FolderStructure/types';

interface FolderStructureProps {
  searchTerm?: string;
}

const FolderStructure: React.FC<FolderStructureProps> = ({ searchTerm = "" }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<PathItem[]>([]);
  const [showFolderMenu, setShowFolderMenu] = useState<string | null>(null);
  const [showAddExamModal, setShowAddExamModal] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<DisplayItem[]>([]);
  const [filteredDisplayItems, setFilteredDisplayItems] = useState<DisplayItem[]>([]);
  const [clipboard, setClipboard] = useState<DisplayItem[]>([]);
  const [clipboardOperation, setClipboardOperation] = useState<'copy' | 'cut' | null>(null);

  const navigate = useNavigate();
  const { currentUser, loading: authLoading, authInitialized } = useAuth();
  const { success, error, info } = useNotification();
  const folderOperations = useFolderOperations(currentUser, setFolders, setExams, setLoading);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFolderMenu && !(event.target as Element).closest('.folder-menu')) {
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
        folderOperations.loadUserData();
      } else {
        setLoading(false);
        setFolders([]);
        setExams([]);
        setCurrentPath([]);
        setSelectedItems([]);
      }
    }
  }, [authInitialized, authLoading, currentUser]);

  const calculateDisplayItems = (currentFolders: Folder[] = folders, currentExams: Exam[] = exams): DisplayItem[] => {
    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;
    const subfolders = currentFolders.filter(f => f.parent === currentFolderId);
    const examsInFolder = currentExams.filter(e => e.folderId === currentFolderId);
    return [...subfolders, ...examsInFolder];
  };

  const filterItems = (items: DisplayItem[], term: string): DisplayItem[] => {
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

  const handleCreateNewFolder = async () => {
    const folderName = prompt("Nhập tên thư mục:");
    if (!folderName) return;
    const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;
    await folderOperations.createNewFolder(folderName, parentId);
    setShowFolderMenu(null);
  };

  const handleDeleteSelectedItems = async () => {
    const selectedExams = selectedItems.filter(item => item.type === 'exam') as Exam[];
    const selectedFolders = selectedItems.filter(item => item.type === 'folder') as Folder[];

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
      deletePromises.push(folderOperations.deleteFolderRecursive(folder.id));
    }

    for (const exam of selectedExams) {
      deletePromises.push(folderOperations.deleteExamData(exam.id));
    }

    try {
      await Promise.all(deletePromises);
      success(`Đã xóa ${itemsText} thành công!`);
      clearSelection();
    } catch (err) {
      console.error("Error deleting items:", err);
      error("Lỗi khi xóa các mục. Vui lòng thử lại.");
    } finally {
      await folderOperations.loadUserData();
    }
  };

  const handleRenameFolder = async (folder: Folder) => {
    const newName = prompt("Nhập tên thư mục mới:", folder.name);
    if (!newName || newName === folder.name) return;
    await folderOperations.renameFolder(folder, newName);
  };

  const handleCopySelectedItems = () => {
    if (selectedItems.length === 0) {
      error("Vui lòng chọn ít nhất một mục để sao chép");
      return;
    }
    setClipboard([...selectedItems]);
    setClipboardOperation('copy');
    success(`Đã sao chép ${selectedItems.length} mục vào bộ nhớ tạm`);
  };

  const handleCutSelectedItems = () => {
    if (selectedItems.length === 0) {
      error("Vui lòng chọn ít nhất một mục để cắt");
      return;
    }
    setClipboard([...selectedItems]);
    setClipboardOperation('cut');
    success(`Đã cắt ${selectedItems.length} mục vào bộ nhớ tạm`);
  };

  const handlePasteItems = async () => {
    if (clipboard.length === 0) {
      error("Không có mục nào trong bộ nhớ tạm");
      return;
    }

    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;
    const shouldClearClipboard = await folderOperations.pasteItems(clipboard, currentFolderId, clipboardOperation);
    
    if (shouldClearClipboard) {
      setClipboard([]);
      setClipboardOperation(null);
    }
  };

  const handleClearClipboard = () => {
    setClipboard([]);
    setClipboardOperation(null);
    success("Đã xóa bộ nhớ tạm");
  };

  const handleAddExamToFolder = async (examId: string) => {
    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : ROOT_ID;
    const exam = exams.find(e => e.id === examId);
    if (exam?.folderId === currentFolderId) {
      info("Đề thi đã ở trong thư mục này.");
      setShowAddExamModal(false);
      return;
    }
    await folderOperations.addExamToFolder(examId, currentFolderId);
    setShowAddExamModal(false);
  };

  const navigateTo = (newPath: PathItem[]) => {
    setCurrentPath(newPath);
    setSelectedItems([]);
  };

  const openFolder = (folder: Folder) => {
    navigateTo([...currentPath, { id: folder.id, name: folder.name }]);
  };

  const navigateToRoot = () => {
    navigateTo([]);
  };

  const navigateToIndex = (index: number) => {
    navigateTo(currentPath.slice(0, index + 1));
  };

  const toggleFolderMenu = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    setShowFolderMenu(showFolderMenu === folderId ? null : folderId);
  };

  const viewExamDetails = (examId: string) => {
    navigate(`/ExamsCreated/ExamResults/${examId}`);
  };

  const toggleSelectItem = (e: React.ChangeEvent<HTMLInputElement>, item: DisplayItem) => {
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

  const isItemSelected = (item: DisplayItem): boolean => {
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

  const handleDeleteFolder = () => {
    handleDeleteSelectedItems();
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
          <button
            onClick={handleCreateNewFolder}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            <FaPlus size={14} />
            <span>Thư mục mới</span>
          </button>
        </div>
      </div>
      
      <Breadcrumb
        currentPath={currentPath}
        loading={loading}
        onNavigateToRoot={navigateToRoot}
        onNavigateToIndex={navigateToIndex}
      />
      
      <SelectionToolbar
        selectedItems={selectedItems}
        loading={loading}
        onClearSelection={clearSelection}
        onCopy={handleCopySelectedItems}
        onCut={handleCutSelectedItems}
        onDelete={handleDeleteSelectedItems}
      />
      
      <ClipboardToolbar
        clipboard={clipboard}
        clipboardOperation={clipboardOperation}
        currentPathLength={currentPath.length}
        loading={loading}
        onPaste={handlePasteItems}
        onClear={handleClearClipboard}
      />
      
      <div className="grid grid-cols-12 py-2 px-3 border-b border-gray-200 bg-gray-50 font-medium text-gray-700 rounded-t-md">
        <div className="col-span-1 pr-2">
          <input 
            type="checkbox" 
            className="w-4 h-4"
            onChange={toggleSelectAll}
            checked={filteredDisplayItems.length > 0 && selectedItems.length === filteredDisplayItems.length}
          />
        </div>
        <div className="col-span-5">Tên</div>
        <div className="col-span-3">Mã bài thi</div>
        <div className="col-span-3 text-right">Thao tác</div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {filteredDisplayItems.map(item => {
          if (item.type === 'folder') {
            return (
              <FolderItem
                key={item.id}
                folder={item}
                isSelected={isItemSelected(item)}
                loading={loading}
                showMenu={showFolderMenu}
                onSelect={toggleSelectItem}
                onOpen={openFolder}
                onToggleMenu={toggleFolderMenu}
                onRename={handleRenameFolder}
                onDelete={handleDeleteFolder}
              />
            );
          } else {
            return (
              <ExamItem
                key={item.id}
                exam={item}
                isSelected={isItemSelected(item)}
                loading={loading}
                onSelect={toggleSelectItem}
                onView={viewExamDetails}
              />
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

      <AddExamModal
        isOpen={showAddExamModal}
        exams={exams}
        currentPath={currentPath}
        loading={loading}
        onClose={() => setShowAddExamModal(false)}
        onAddExam={handleAddExamToFolder}
      />
    </div>
  );
};

export default FolderStructure;

