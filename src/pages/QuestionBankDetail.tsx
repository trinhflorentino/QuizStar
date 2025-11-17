import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionBankData } from './QuestionBankDetail/hooks/useQuestionBankData';
import { useModalManagement } from './QuestionBankDetail/hooks/useModalManagement';
import { useChapterOperations } from './QuestionBankDetail/hooks/useChapterOperations';
import { useQuestionManagement } from './QuestionBankDetail/hooks/useQuestionManagement';
import { useReanalyze } from './QuestionBankDetail/hooks/useReanalyze';
import { formatTimestamp } from './QuestionBankDetail/hooks/useTimestamp';
import Header from './QuestionBankDetail/Header';
import MatrixSourceInfo from './QuestionBankDetail/MatrixSourceInfo';
import ChaptersList from './QuestionBankDetail/components/ChaptersList';
import LoadingState from './QuestionBankDetail/components/LoadingState';
import NotFoundState from './QuestionBankDetail/components/NotFoundState';
import DeleteModal from './QuestionBankDetail/DeleteModal';
import EditModal from './QuestionBankDetail/EditModal';
import AddModal from './QuestionBankDetail/AddModal';
import ReanalyzeModal from './QuestionBankDetail/ReanalyzeModal';
import QuestionViewModal from './QuestionBankDetail/QuestionViewModal';
import QuestionEditModal from './QuestionBankDetail/QuestionEditModal';
import DeleteQuestionModal from './QuestionBankDetail/DeleteQuestionModal';
import DeleteSelectedModal from './QuestionBankDetail/DeleteSelectedModal';
import MatrixAssemblyModal from '../components/Form/MatrixAssemblyModal';

const QuestionBankDetail: React.FC = () => {
  const navigate = useNavigate();
  const { questionBank, setQuestionBank, loading, bankId } = useQuestionBankData();
  const [expandedChapters, setExpandedChapters] = useState<{ [key: number]: boolean }>({});
  const [expandedSubContents, setExpandedSubContents] = useState<{ [key: string]: boolean }>({});
  const [isAssembleModalOpen, setIsAssembleModalOpen] = useState<boolean>(false);

  const modalManagement = useModalManagement();
  const chapterOperations = useChapterOperations(
    questionBank,
    setQuestionBank,
    bankId,
    expandedChapters,
    setExpandedChapters,
    expandedSubContents,
    setExpandedSubContents
  );
  const questionManagement = useQuestionManagement(questionBank, setQuestionBank, bankId);
  const reanalyze = useReanalyze(questionBank, setQuestionBank, bankId);

  const toggleChapter = (chapterIndex: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };
  
  const toggleSubContent = (key: string) => {
    setExpandedSubContents((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDelete = async () => {
    await chapterOperations.handleDelete(
      modalManagement.deleteType,
      modalManagement.deleteTarget,
      modalManagement.deleteParentId,
      modalManagement.deleteIndex,
      modalManagement.deleteLevel
    );
    modalManagement.closeDeleteModal();
  };

  const handleEdit = async () => {
    await chapterOperations.handleEdit(
      modalManagement.editType,
      modalManagement.editTarget,
      modalManagement.editParentId,
      modalManagement.editIndex,
      modalManagement.editLevel,
      modalManagement.editName,
      modalManagement.editDescription
    );
    modalManagement.closeEditModal();
  };

  const handleAdd = async () => {
    await chapterOperations.handleAdd(
      modalManagement.addType,
      modalManagement.addParentIndex,
      modalManagement.addLevel,
      modalManagement.addName,
      modalManagement.addDescription
    );
    modalManagement.closeAddModal();
  };

  const handleAssembleApply = (result: { text?: string; coverage?: any }) => {
    setIsAssembleModalOpen(false);
    if (!result?.text) return;

    navigate("/FormMaker", {
      state: {
        preloadedText: result.text,
        preloadedTitle: questionBank?.title ? `${questionBank.title} - đề ghép` : undefined,
        fromQuestionBankId: bankId,
        fromQuestionBankTitle: questionBank?.title,
        coverage: result.coverage
      }
    });
  };

  if (loading) {
    return <LoadingState />;
  }
  
  if (!questionBank) {
    return <NotFoundState onBack={() => navigate("/QuestionBank")} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Header
        title={questionBank.title || ''}
        bankId={bankId || ''}
        onBack={() => navigate("/QuestionBank")}
        onImport={() => navigate(`/QuestionBank/${bankId}/ImportExamQuestions`)}
        onAssemble={() => setIsAssembleModalOpen(true)}
      />

      <MatrixSourceInfo
        questionBank={questionBank}
        isReanalyzing={reanalyze.isReanalyzing}
        reanalyzeError={reanalyze.reanalyzeError}
        onReanalyze={reanalyze.handleReanalyze}
        formatTimestamp={formatTimestamp}
      />

      <ReanalyzeModal
        preview={reanalyze.reanalyzePreview}
        onClose={() => reanalyze.setReanalyzePreview(null)}
        onApply={reanalyze.applyReanalysis}
      />

      <ChaptersList
        questionBank={questionBank}
        expandedChapters={expandedChapters}
        expandedSubContents={expandedSubContents}
        onToggleChapter={toggleChapter}
        onToggleSubContent={toggleSubContent}
        onAddChapter={() => modalManagement.openAddModal('chapter')}
        onAddSubContent={(chapterIndex) => modalManagement.openAddModal('subContent', chapterIndex)}
        onEditChapter={(chapter, chapterIndex) => modalManagement.openEditModal('chapter', chapter, null, chapterIndex)}
        onDeleteChapter={(chapter, chapterIndex) => modalManagement.openDeleteModal('chapter', chapter, null, chapterIndex)}
        onEditSubContent={(subContent, chapterIndex, subContentIndex) => modalManagement.openEditModal('subContent', subContent, chapterIndex, subContentIndex)}
        onDeleteSubContent={(subContent, chapterIndex, subContentIndex) => modalManagement.openDeleteModal('subContent', subContent, chapterIndex, subContentIndex)}
        onAddRequirement={(chapterIndex, subContentIndex, level) => modalManagement.openAddModal('requirement', { chapterIndex, subContentIndex }, level)}
        onEditRequirement={(item, chapterIndex, subContentIndex, level, itemIndex) => modalManagement.openEditModal('requirement', item, { chapterIndex, subContentIndex }, itemIndex, level)}
        onDeleteRequirement={(item, chapterIndex, subContentIndex, level, itemIndex) => modalManagement.openDeleteModal('requirement', item, { chapterIndex, subContentIndex }, itemIndex, level)}
        onViewQuestions={questionManagement.openRequirementQuestions}
      />

      <DeleteModal
        isOpen={modalManagement.isDeleteModalOpen}
        deleteType={modalManagement.deleteType}
        deleteTarget={modalManagement.deleteTarget}
        onClose={modalManagement.closeDeleteModal}
        onConfirm={handleDelete}
      />
      
      <EditModal
        isOpen={modalManagement.isEditModalOpen}
        editType={modalManagement.editType}
        editTarget={modalManagement.editTarget}
        editName={modalManagement.editName}
        editDescription={modalManagement.editDescription}
        onClose={modalManagement.closeEditModal}
        onSave={handleEdit}
        onNameChange={modalManagement.setEditName}
        onDescriptionChange={modalManagement.setEditDescription}
      />
      
      <AddModal
        isOpen={modalManagement.isAddModalOpen}
        addType={modalManagement.addType}
        addName={modalManagement.addName}
        addDescription={modalManagement.addDescription}
        onClose={modalManagement.closeAddModal}
        onAdd={handleAdd}
        onNameChange={modalManagement.setAddName}
        onDescriptionChange={modalManagement.setAddDescription}
      />

      <QuestionViewModal
        selectedRequirement={questionManagement.selectedRequirement}
        requirementQuestions={questionManagement.requirementQuestions}
        selectedQuestions={questionManagement.selectedQuestions}
        onClose={questionManagement.closeRequirementQuestions}
        onToggleSelection={questionManagement.toggleQuestionSelection}
        onToggleSelectAll={questionManagement.toggleSelectAll}
        onEditQuestion={questionManagement.openEditQuestion}
        onDeleteQuestion={questionManagement.openDeleteQuestionModal}
        onDeleteSelected={questionManagement.openDeleteSelectedModal}
      />

      <QuestionEditModal
        isOpen={!!questionManagement.editingQuestion}
        editQuestionText={questionManagement.editQuestionText}
        editQuestionOptions={questionManagement.editQuestionOptions}
        onClose={questionManagement.closeEditQuestion}
        onSave={questionManagement.handleEditQuestionSubmit}
        onTextChange={questionManagement.setEditQuestionText}
        onOptionsChange={questionManagement.setEditQuestionOptions}
        onOptionChange={(index, option) => {
          const newOptions = [...questionManagement.editQuestionOptions];
          newOptions[index] = option;
          questionManagement.setEditQuestionOptions(newOptions);
        }}
        onOptionDelete={(index) => {
          const newOptions = questionManagement.editQuestionOptions.filter((_, idx) => idx !== index);
          questionManagement.setEditQuestionOptions(newOptions);
        }}
        onOptionAdd={() => {
          questionManagement.setEditQuestionOptions([...questionManagement.editQuestionOptions, { text: "", is_correct: false }]);
        }}
      />

      <DeleteQuestionModal
        isOpen={questionManagement.isDeleteQuestionModalOpen}
        deletingQuestion={questionManagement.deletingQuestion}
        onClose={questionManagement.closeDeleteQuestionModal}
        onConfirm={questionManagement.handleDeleteQuestion}
      />

      <DeleteSelectedModal
        isOpen={questionManagement.isDeleteSelectedModalOpen}
        selectedCount={questionManagement.selectedQuestions.size}
        onClose={questionManagement.closeDeleteSelectedModal}
        onConfirm={questionManagement.handleDeleteSelectedQuestions}
      />

      <MatrixAssemblyModal
        isOpen={isAssembleModalOpen}
        onClose={() => setIsAssembleModalOpen(false)}
        onApply={handleAssembleApply}
        preselectedBankId={bankId}
        preloadedBank={questionBank}
        lockBankSelection
      />
    </div>
  );
};

export default QuestionBankDetail;
