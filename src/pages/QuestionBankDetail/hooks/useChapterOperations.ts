import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../../../services/firebaseConfig";
import { useNotification } from "../../../contexts/NotificationContext";
import type { QuestionBank } from '../types';

export const useChapterOperations = (
  questionBank: QuestionBank | null,
  setQuestionBank: React.Dispatch<React.SetStateAction<QuestionBank | null>>,
  bankId: string | undefined,
  expandedChapters: { [key: number]: boolean },
  setExpandedChapters: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
  expandedSubContents: { [key: string]: boolean },
  setExpandedSubContents: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  const auth = getAuth();
  const { success, error } = useNotification();

  const handleDelete = async (
    deleteType: 'chapter' | 'subContent' | 'requirement' | null,
    deleteTarget: any,
    deleteParentId: any,
    deleteIndex: number | null,
    deleteLevel: string | null
  ) => {
    if (!deleteTarget || !auth.currentUser || !bankId || !questionBank) return;

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      let updatedChapters = [...questionBank.chapters!];

      // Handle different delete types
      if (deleteType === 'chapter' && deleteIndex !== null) {
        updatedChapters.splice(deleteIndex, 1);
      } else if (deleteType === 'subContent' && deleteParentId !== null && deleteIndex !== null) {
        updatedChapters[deleteParentId].subContents!.splice(deleteIndex, 1);
      } else if (deleteType === 'requirement' && deleteParentId && deleteLevel && deleteIndex !== null) {
        const reqObj = updatedChapters[deleteParentId.chapterIndex].subContents![deleteParentId.subContentIndex].requirements!;
        const reqArray = reqObj[deleteLevel as keyof typeof reqObj] as any[];
        reqArray.splice(deleteIndex, 1);
      }

      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });

      // Update local state
      setQuestionBank(prev => ({
        ...prev!,
        chapters: updatedChapters
      }));

      success("Đã xóa mục thành công!");
    } catch (err) {
      console.error("Error deleting item:", err);
      error("Có lỗi xảy ra khi xóa mục");
    }
  };

  const handleEdit = async (
    editType: 'chapter' | 'subContent' | 'requirement' | null,
    editTarget: any,
    editParentId: any,
    editIndex: number | null,
    editLevel: string | null,
    editName: string,
    editDescription: string
  ) => {
    if (!editTarget || !auth.currentUser || !bankId || !questionBank) return;
    
    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      let updatedChapters = [...questionBank.chapters!];
      
      // Handle different edit types
      if (editType === 'chapter' && editIndex !== null) {
        updatedChapters[editIndex] = {
          ...updatedChapters[editIndex],
          name: editName
        };
      } else if (editType === 'subContent' && editParentId !== null && editIndex !== null) {
        updatedChapters[editParentId].subContents![editIndex] = {
          ...updatedChapters[editParentId].subContents![editIndex],
          name: editName
        };
      } else if (editType === 'requirement' && editParentId && editLevel && editIndex !== null) {
        const reqObj = updatedChapters[editParentId.chapterIndex].subContents![editParentId.subContentIndex].requirements!;
        const reqArray = reqObj[editLevel as keyof typeof reqObj] as any[];
        reqArray[editIndex] = {
          ...reqArray[editIndex],
          description: editDescription
        };
      }
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev!,
        chapters: updatedChapters
      }));
      
      success("Đã cập nhật mục thành công!");
    } catch (err) {
      console.error("Error editing item:", err);
      error("Có lỗi xảy ra khi chỉnh sửa mục");
    }
  };

  const handleAdd = async (
    addType: 'chapter' | 'subContent' | 'requirement' | null,
    addParentIndex: any,
    addLevel: string | null,
    addName: string,
    addDescription: string
  ) => {
    if (!auth.currentUser || !bankId || !questionBank) return;

    try {
      const bankDocRef = doc(db, "users", auth.currentUser.uid, "questionBanks", bankId);
      let updatedChapters = [...questionBank.chapters!];
      
      // Handle different add types
      if (addType === 'chapter') {
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
      } else if (addType === 'subContent' && addParentIndex !== null) {
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
        
        updatedChapters[addParentIndex].subContents!.push(newSubContent);
        
        // Auto-expand new subContent
        const key = `${addParentIndex}-${updatedChapters[addParentIndex].subContents!.length - 1}`;
        setExpandedSubContents(prev => ({
          ...prev,
          [key]: true
        }));
      } else if (addType === 'requirement' && addParentIndex && addLevel) {
        const newRequirement = {
          _template: true,
          description: addDescription
        };
        
        const reqObj = updatedChapters[addParentIndex.chapterIndex].subContents![addParentIndex.subContentIndex].requirements!;
        if (!reqObj[addLevel as keyof typeof reqObj]) {
          (reqObj as any)[addLevel] = [];
        }
        
        const reqArray = reqObj[addLevel as keyof typeof reqObj] as any[];
        reqArray.push(newRequirement);
      }
      
      // Update Firestore
      await updateDoc(bankDocRef, { chapters: updatedChapters });
      
      // Update local state
      setQuestionBank(prev => ({
        ...prev!,
        chapters: updatedChapters
      }));
      
      success("Đã thêm mục thành công!");
    } catch (err) {
      console.error("Error adding item:", err);
      error("Có lỗi xảy ra khi thêm mục");
    }
  };

  return {
    handleDelete,
    handleEdit,
    handleAdd
  };
};




