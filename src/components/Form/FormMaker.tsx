import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import { useFormMaker } from './hooks/useFormMaker';
import { useQuizSubmission } from './hooks/useQuizSubmission';
import { useAIServices } from './hooks/useAIServices';
import { useNotification } from '../../contexts/NotificationContext';
import TextInputPanel from './components/TextInputPanel';
import EquationModal from './components/EquationModal';
import ConfigurationModal from './components/ConfigurationModal';
import BottomToolbar from './components/BottomToolbar';
import QuizPreview from './QuizPreview';
import FileUploadModal from './FileUploadModal';
import MatrixUploadModal from './MatrixUploadModal';
import QuestionGeneratorModal from './QuestionGeneratorModal';
import ConfirmDialog from './components/ConfirmDialog';
import MatrixAssemblyModal from './MatrixAssemblyModal';
import db from '../../services/firebaseConfig';

interface FormMakerProps {
  isEditing?: boolean;
  initialData?: any;
  onSubmit?: (data: any) => void;
}

const FormMaker: React.FC<FormMakerProps> = ({ isEditing = false, initialData = null, onSubmit: customSubmit }) => {
  // Use custom hooks
  const {
    quizTitle,
    setQuizTitle,
    duration,
    setDuration,
    list,
    setList,
    optionList,
    setOptionList,
    scoreDistribution,
    setScoreDistribution,
    rawText,
    setRawText,
    imagePreview,
    setImagePreview,
    fileInputKeys,
    textareaRef,
    mcqRef,
    trueFalseRef,
    shortAnswerRef,
    handlePreviewAnswerChange,
    handleTypeScoreChange,
    handleImageChange,
    handleRemoveImage,
  } = useFormMaker(isEditing, initialData);

  const { isSubmitting, submitQuiz } = useQuizSubmission();
  const { isLoading, extractQuestions, matrixQuestion, createQuestions: generateQuestions } = useAIServices();
  const { success, warning } = useNotification();
  const auth = getAuth();
  const location = useLocation();
  const bankPayloadAppliedRef = useRef(false);

  // Modal states
  const [showExerciseModal, setShowExerciseModal] = useState<boolean>(false);
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [showEquationModal, setShowEquationModal] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showAssemblyModal, setShowAssemblyModal] = useState<boolean>(false);

  // Handle file upload
  const handleExtractQuestions = async () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      warning('Vui lòng chọn file trước.', 4000);
      return;
    }
    await extractQuestions(file, setRawText, setQuizTitle, quizTitle);
    setShowExerciseModal(false);
  };

  // Handle matrix upload
  const handleMatrixQuestion = async () => {
    const fileInput = document.getElementById('matrixInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      warning('Vui lòng chọn file trước.', 4000);
      return;
    }
    await matrixQuestion(file, setRawText);
    setShowMatrixModal(false);
  };

  // Handle question generation
  const handleCreateQuestions = async () => {
    await generateQuestions(mcqRef, trueFalseRef, shortAnswerRef, list, optionList, setRawText);
    setShowModal(false);
  };

  const handleAssemblyComplete = async ({ bank, questions, coverage, text }: { bank: any; questions: any[]; coverage: any; text?: string }) => {
    if (text) {
      setRawText(text);
    }
    setShowAssemblyModal(false);
    success(`Đã sinh ${questions.length} câu hỏi từ ngân hàng "${bank.title}"`, 4000);

    try {
      if (auth.currentUser) {
        const logRef = collection(db, 'users', auth.currentUser.uid, 'examGenerationLogs');
        await addDoc(logRef, {
          bankId: bank.id,
          bankTitle: bank.title,
          questionCount: questions.length,
          coverage,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Không thể lưu log sinh đề:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    await submitQuiz({
      list,
      optionList,
      quizTitle,
      duration,
      imagePreview,
      isEditing,
      customSubmit: (customSubmit || null) as any
    } as any);
  };

  // Handle clear
  const handleClear = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClear = () => {
    setRawText('');
    setQuizTitle('');
    setList([]);
    setOptionList([]);
    success('Đã xóa toàn bộ dữ liệu.', 3000);
  };

  // Prefill when coming from Question Bank assembly
  useEffect(() => {
    if (isEditing || bankPayloadAppliedRef.current) return;
    const state = (location.state || {}) as any;
    if (state?.preloadedText) {
      setRawText(state.preloadedText);
      if (state.preloadedTitle) {
        setQuizTitle((prev) => prev || state.preloadedTitle);
      }
      bankPayloadAppliedRef.current = true;
      if (state?.fromQuestionBankTitle) {
        success(`Đã nạp đề từ ngân hàng "${state.fromQuestionBankTitle}"`);
      } else {
        success("Đã nạp đề từ ngân hàng câu hỏi");
      }
    }
  }, [isEditing, location.state, setQuizTitle, setRawText, success]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+M or Cmd+M to open equation modal
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        setShowEquationModal(true);
      }
      // Esc to close modals
      if (e.key === 'Escape') {
        setShowEquationModal(false);
        setShowScoreModal(false);
        setShowExerciseModal(false);
        setShowMatrixModal(false);
        setShowModal(false);
        setShowConfirmDialog(false);
        setShowAssemblyModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const questionCount = (list as any[]).filter((q: any) => q.type !== 'textblock').length;

  return (
    <div className="flex h-screen bg-gray-50 pb-20">
      {/* Left Panel: Text Input */}
      <TextInputPanel
        quizTitle={quizTitle}
        onTitleChange={setQuizTitle}
        rawText={rawText}
        onTextChange={setRawText}
        textareaRef={textareaRef}
        onEquationClick={() => setShowEquationModal(true)}
      />

      {/* Right Panel: Preview */}
      <div className="w-1/2 h-full overflow-hidden">
        <QuizPreview
          quizTitle={quizTitle}
          questions={list}
          options={optionList}
          onAnswerChange={handlePreviewAnswerChange}
        />
      </div>

      {/* Equation Modal */}
      <EquationModal
        isOpen={showEquationModal}
        onClose={() => setShowEquationModal(false)}
        onInsert={() => {}}
        textareaRef={textareaRef}
        rawText={rawText}
        setRawText={setRawText}
      />

      {/* Configuration Modal */}
      <ConfigurationModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        duration={duration}
        onDurationChange={setDuration}
        scoreDistribution={scoreDistribution}
        onScoreChange={handleTypeScoreChange}
      />

      {/* Bottom Toolbar */}
      <BottomToolbar
        questionCount={questionCount}
        onConfigClick={() => setShowScoreModal(true)}
        onFileUploadClick={() => setShowExerciseModal(true)}
        onMatrixClick={() => setShowMatrixModal(true)}
        onAssembleClick={() => setShowAssemblyModal(true)}
        onGenerateClick={() => setShowModal(true)}
        onClearClick={handleClear}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        canSubmit={questionCount > 0}
      />

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        isLoading={isLoading}
        onUpload={handleExtractQuestions}
        title="Tải tệp đề thi lên"
        accept=".docx, .pdf, image/*"
        buttonText="Thêm câu hỏi"
        buttonClass="bg-blue-500 hover:bg-blue-700"
      />

      {/* Matrix Upload Modal */}
      <MatrixUploadModal
        isOpen={showMatrixModal}
        onClose={() => setShowMatrixModal(false)}
        isLoading={isLoading}
        onUpload={handleMatrixQuestion}
        mcqRef={mcqRef}
        trueFalseRef={trueFalseRef}
        shortAnswerRef={shortAnswerRef}
      />

      {/* Question Generator Modal */}
      <QuestionGeneratorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isLoading={isLoading}
        onGenerate={handleCreateQuestions}
        mcqRef={mcqRef}
        trueFalseRef={trueFalseRef}
        shortAnswerRef={shortAnswerRef}
      />

      <MatrixAssemblyModal
        isOpen={showAssemblyModal}
        onClose={() => setShowAssemblyModal(false)}
        onApply={handleAssemblyComplete}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmClear}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa toàn bộ dữ liệu đã nhập? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default FormMaker;
