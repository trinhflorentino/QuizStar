import { useState } from "react";
import { collection, getDocs, getDoc, doc, updateDoc, addDoc, deleteDoc, query, where } from "firebase/firestore/lite";
import db from "../../../services/firebaseConfig";
import { useNotification } from "../../../contexts/NotificationContext";
import type { Folder, Exam, DisplayItem, PathItem } from '../types';
import { ROOT_ID } from '../types';

export const useFolderOperations = (
  currentUser: any,
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>,
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { success, error } = useNotification();

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
        type: 'folder' as const,
        ...doc.data(),
        parent: doc.data().parent || ROOT_ID,
      })) as Folder[];
      setFolders(foldersData);

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

    } catch (err) {
      console.error("Error loading data:", err);
      error("Không thể tải dữ liệu thư viện.");
    } finally {
      setLoading(false);
    }
  };

  const createNewFolder = async (folderName: string, parentId: string) => {
    if (!currentUser) {
      error("Vui lòng đăng nhập để tạo thư mục");
      return;
    }

    try {
      setLoading(true);
      const folderRef = collection(db, "Users", currentUser.uid, "Folders");
      await addDoc(folderRef, {
        name: folderName,
        createdAt: new Date(),
        parent: parentId,
      });

      success("Tạo thư mục thành công!");
      await loadUserData();
    } catch (err) {
      console.error("Error creating folder:", err);
      error("Không thể tạo thư mục!");
      setLoading(false);
    }
  };

  const deleteFolderRecursive = async (folderId: string) => {
    if (!currentUser) throw new Error("User not authenticated");
    const userId = currentUser.uid;
    const folderRef = doc(db, "Users", userId, "Folders", folderId);

    const orphanPromises: Promise<void>[] = [];

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

  const deleteExamData = async (examId: string) => {
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
      getDoc(paperSetterRef).then((docSnap: any) => {
        if (docSnap.exists()) {
          return deleteDoc(paperSetterRef);
        }
      }).catch((err: any) => console.warn(`Could not delete paper setter ref ${examId}:`, err))
    );

    examPromises.push(finalDeletePromise);
    return Promise.all(examPromises);
  };

  const renameFolder = async (folder: Folder, newName: string) => {
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

  const pasteItems = async (clipboard: DisplayItem[], currentFolderId: string, clipboardOperation: 'copy' | 'cut' | null) => {
    if (!currentUser) {
      error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

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
      await loadUserData();
      return clipboardOperation === 'cut';
    } catch (err) {
      console.error("Error pasting items:", err);
      error("Lỗi khi dán các mục. Vui lòng thử lại.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addExamToFolder = async (examId: string, currentFolderId: string) => {
    if (!currentUser) {
      error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    setLoading(true);
    try {
      const examRef = doc(db, "Users", currentUser.uid, "Exams_Created", examId);
      await updateDoc(examRef, { folderId: currentFolderId });
      success("Đã thêm đề thi vào thư mục!");
      await loadUserData();
    } catch (err) {
      console.error("Error adding exam to folder:", err);
      error("Không thể thêm đề thi vào thư mục!");
      setLoading(false);
      await loadUserData();
    }
  };

  return {
    loadUserData,
    createNewFolder,
    deleteFolderRecursive,
    deleteExamData,
    renameFolder,
    pasteItems,
    addExamToFolder
  };
};

