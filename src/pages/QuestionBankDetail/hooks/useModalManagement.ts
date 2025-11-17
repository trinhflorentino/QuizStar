import { useState } from "react";
import type { DeleteTarget, EditTarget } from '../types';

export const useModalManagement = () => {
  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleteType, setDeleteType] = useState<'chapter' | 'subContent' | 'requirement' | null>(null);
  const [deleteParentId, setDeleteParentId] = useState<any>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [deleteLevel, setDeleteLevel] = useState<string | null>(null);

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editType, setEditType] = useState<'chapter' | 'subContent' | 'requirement' | null>(null);
  const [editParentId, setEditParentId] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editLevel, setEditLevel] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  
  // Add states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addType, setAddType] = useState<'chapter' | 'subContent' | 'requirement' | null>(null);
  const [addParentIndex, setAddParentIndex] = useState<any>(null);
  const [addLevel, setAddLevel] = useState<string | null>(null);
  const [addName, setAddName] = useState<string>("");
  const [addDescription, setAddDescription] = useState<string>("");

  const openDeleteModal = (type: 'chapter' | 'subContent' | 'requirement', target: DeleteTarget, parentId: any = null, index: number | null = null, level: string | null = null) => {
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

  const openEditModal = (type: 'chapter' | 'subContent' | 'requirement', target: EditTarget, parentId: any = null, index: number | null = null, level: string | null = null) => {
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

  const openAddModal = (type: 'chapter' | 'subContent' | 'requirement', parentIndex: any = null, level: string | null = null) => {
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

  return {
    // Delete
    isDeleteModalOpen,
    deleteTarget,
    deleteType,
    deleteParentId,
    deleteIndex,
    deleteLevel,
    openDeleteModal,
    closeDeleteModal,
    // Edit
    isEditModalOpen,
    editTarget,
    editType,
    editParentId,
    editIndex,
    editLevel,
    editName,
    editDescription,
    openEditModal,
    closeEditModal,
    setEditName,
    setEditDescription,
    // Add
    isAddModalOpen,
    addType,
    addParentIndex,
    addLevel,
    addName,
    addDescription,
    openAddModal,
    closeAddModal,
    setAddName,
    setAddDescription
  };
};




