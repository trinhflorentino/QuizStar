import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { default as db } from "../services/firebaseConfig";
import { MdCloudUpload, MdEdit, MdDelete } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { MathJax } from "better-react-mathjax";
import { useNavigate } from 'react-router-dom';
import { matrixQuestionsJSON } from '../components/AI/AIService';
import { cleanMatrixResult, mergeTemplateWithExisting } from "../utils/questionBankUtils";

export const PROMPT_VERSION = "client-v1";
export const MATRIX_ANALYSIS_PROMPT = `Phân tích tài liệu này và trích xuất cấu trúc theo chương/chủ đề, nội dung con và các mức độ yêu cầu.
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
  const [analysisJobs, setAnalysisJobs] = useState([]);
  const [analysisPreview, setAnalysisPreview] = useState(null);
  const [jobError, setJobError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  
  const getTimestampValue = (value) => {
    if (!value) return 0;
    if (typeof value.toMillis === "function") return value.toMillis();
    if (value.seconds) return value.seconds * 1000;
    if (value instanceof Date) return value.getTime();
    if (typeof value === "number") return value;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatTimestamp = (value) => {
    const time = getTimestampValue(value);
    if (!time) return "—";
    return new Date(time).toLocaleString();
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Đang xử lý</span>;
      case "succeeded":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Đã phân tích</span>;
      case "committed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Đã tạo ngân hàng</span>;
      case "failed":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Lỗi</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{status || "Không rõ"}</span>;
    }
  };

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

  const refreshAnalysisJobs = async () => {
    try {
      if (auth.currentUser) {
        const jobsRef = collection(db, "users", auth.currentUser.uid, "questionBankJobs");
        const snapshot = await getDocs(jobsRef);
        const jobs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })).sort((a, b) => getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt));
        setAnalysisJobs(jobs);
      }
    } catch (error) {
      console.error("Error fetching analysis jobs:", error);
    }
  };

  useEffect(() => {
    refreshAnalysisJobs();
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

  const openJobPreview = (job) => {
    if (!job?.rawResponse) {
      alert("Job này chưa lưu lại kết quả để xem trước.");
      return;
    }

    try {
      const parsed = JSON.parse(job.rawResponse);
      const cleanResult = cleanMatrixResult(parsed, parsed?.title || job.filename || "Ngân hàng câu hỏi");
      setAnalysisPreview({
        jobId: job.id,
        prompt: job.prompt,
        fileName: job.filename || job.fileName || "matrix.json",
        rawResponse: job.rawResponse,
        cleanResult,
        snapshot: job.snapshot
      });
    } catch (error) {
      console.error("Không thể đọc lại kết quả job:", error);
      alert("Không thể mở bản xem trước cho job này.");
    }
  };

  const handleConfirmAnalysis = async () => {
    if (!analysisPreview || !auth.currentUser) return;

    try {
      const userQuestionBanksRef = collection(db, "users", auth.currentUser.uid, "questionBanks");
      const templateChapters = analysisPreview.cleanResult.chapters || [];
      const templateClone = JSON.parse(JSON.stringify(templateChapters));
      const bankData = {
        title: analysisPreview.cleanResult.title,
        chapters: mergeTemplateWithExisting([], templateClone),
        matrixTemplate: templateClone,
        createdAt: serverTimestamp(),
        filename: analysisPreview.fileName,
        matrixSource: {
          jobId: analysisPreview.jobId,
          prompt: analysisPreview.prompt,
          promptVersion: PROMPT_VERSION,
          rawResponse: analysisPreview.rawResponse,
          filename: analysisPreview.fileName,
          snapshot: analysisPreview.snapshot,
          processedAt: serverTimestamp()
        }
      };

      const docRef = await addDoc(userQuestionBanksRef, bankData);

      setQuestionBanks((prevBanks) => [
        ...prevBanks,
        {
          id: docRef.id,
          ...bankData,
          createdAt: new Date()
        }
      ]);

      try {
        const jobDocRef = doc(db, "users", auth.currentUser.uid, "questionBankJobs", analysisPreview.jobId);
        await updateDoc(jobDocRef, {
          status: "committed",
          committedAt: serverTimestamp(),
          committedBankId: docRef.id
        });
      } catch (error) {
        console.error("Không thể cập nhật trạng thái job khi lưu ngân hàng:", error);
      }

      setAnalysisJobs((prev) => prev.map((job) =>
        job.id === analysisPreview.jobId
          ? { ...job, status: "committed", committedBankId: docRef.id }
          : job
      ));
      await refreshAnalysisJobs();
      setAnalysisPreview(null);
    } catch (error) {
      console.error("Không thể lưu ngân hàng câu hỏi:", error);
      alert("Có lỗi xảy ra khi lưu ngân hàng câu hỏi: " + error.message);
    }
  };

  const closePreview = () => {
    setAnalysisPreview(null);
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
    setJobError(null);

    const prompt = MATRIX_ANALYSIS_PROMPT;

    const jobId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `job-${Date.now()}`;

    const jobDraft = {
      id: jobId,
      filename: selectedFile.name,
      status: "processing",
      promptVersion: PROMPT_VERSION,
      createdAt: new Date()
    };

    setAnalysisJobs((prev) => [jobDraft, ...prev.filter((job) => job.id !== jobId)]);

    let jobDocRef = null;
    if (auth.currentUser) {
      jobDocRef = doc(db, "users", auth.currentUser.uid, "questionBankJobs", jobId);
      try {
        await setDoc(jobDocRef, {
          filename: selectedFile.name,
          status: "processing",
          promptVersion: PROMPT_VERSION,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Không thể tạo job phân tích:", error);
      }
    }

    try {
      const analysisResult = await matrixQuestionsJSON(selectedFile, prompt, { returnMeta: true });

      let parsedResult;
      try {
        parsedResult = JSON.parse(analysisResult.text);
      } catch (error) {
        console.error("Error parsing AI response:", error);
        throw new Error("Không thể phân tích kết quả từ AI");
      }

      const cleanResult = cleanMatrixResult(parsedResult, parsedResult?.title || selectedFile.name.replace(/\.[^/.]+$/, ""));

      setAnalysisPreview({
        jobId,
        prompt,
        fileName: selectedFile.name,
        rawResponse: analysisResult.text,
        cleanResult,
        snapshot: analysisResult.snapshot
      });

      setIsModalOpen(false);
      setSelectedFile(null);

      if (jobDocRef) {
        await updateDoc(jobDocRef, {
          status: "succeeded",
          updatedAt: serverTimestamp(),
          promptVersion: PROMPT_VERSION,
          prompt,
          rawResponse: analysisResult.text,
          snapshot: analysisResult.snapshot
        });
      }

      setAnalysisJobs((prev) => prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "succeeded",
              promptVersion: PROMPT_VERSION,
              prompt,
              rawResponse: analysisResult.text,
              snapshot: analysisResult.snapshot,
              updatedAt: new Date()
            }
          : job
      ));

      await refreshAnalysisJobs();
    } catch (error) {
      console.error("Error processing file:", error);
      setJobError(error.message);
      if (jobDocRef) {
        try {
          await updateDoc(jobDocRef, {
            status: "failed",
            updatedAt: serverTimestamp(),
            error: error.message
          });
        } catch (updateError) {
          console.error("Không thể cập nhật trạng thái job:", updateError);
        }
      }
      setAnalysisJobs((prev) => prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "failed",
              error: error.message,
              updatedAt: new Date()
            }
          : job
      ));
    } finally {
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

        {jobError && (
          <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded p-3">
            {jobError}
          </div>
        )}
      </div>

      {analysisJobs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Trạng thái phân tích gần đây</h2>
            <button
              onClick={refreshAnalysisJobs}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Làm mới
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Tệp</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  <th className="py-2 pr-4">Cập nhật</th>
                  <th className="py-2 pr-4">Ghi chú</th>
                  <th className="py-2 pr-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {analysisJobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">
                      <div className="font-medium text-gray-800">{job.filename || job.fileName || "Không xác định"}</div>
                      <div className="text-xs text-gray-500">Job ID: {job.id}</div>
                    </td>
                    <td className="py-2 pr-4">{renderStatusBadge(job.status)}</td>
                    <td className="py-2 pr-4 text-gray-600">{formatTimestamp(job.updatedAt || job.createdAt)}</td>
                    <td className="py-2 pr-4 text-gray-500">
                      {job.error ? <span className="text-red-600">{job.error}</span> : job.promptVersion}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      {job.status === "succeeded" || job.status === "committed" ? (
                        <button
                          onClick={() => openJobPreview(job)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Xem trước
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                  Tạo lúc: {formatTimestamp(bank.createdAt)}
                </p>
                <p className="text-gray-500 text-xs">
                  Số chương/chủ đề: {bank.chapters?.length || 0}
                </p>
                {bank.matrixSource?.promptVersion && (
                  <p className="text-gray-500 text-xs">Phiên bản prompt: {bank.matrixSource.promptVersion}</p>
                )}

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

      {/* Preview Modal for Analysis */}
      {analysisPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">Xem trước cấu trúc ngân hàng</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tệp: <span className="font-medium">{analysisPreview.fileName}</span>
                </p>
              </div>
              <button onClick={closePreview} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">
                <span className="font-semibold">Tiêu đề đề xuất:</span> {analysisPreview.cleanResult.title}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Số chương: {analysisPreview.cleanResult.chapters?.length || 0}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {analysisPreview.cleanResult.chapters?.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="border border-gray-200 rounded-lg">
                  <div className="px-4 py-2 bg-gray-100 font-semibold">
                    Chương {chapterIndex + 1}: {chapter.name}
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    {chapter.subContents?.map((sub, subIndex) => (
                      <div key={subIndex} className="border border-gray-100 rounded-lg p-3">
                        <div className="font-medium text-gray-800 mb-2">
                          {chapterIndex + 1}.{subIndex + 1} {sub.name}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {Object.entries(sub.requirements || {}).map(([level, items]) => (
                            <div key={level} className="bg-gray-50 border border-gray-100 rounded p-2">
                              <div className="uppercase tracking-wide text-[11px] text-gray-500">{level}</div>
                              <div className="mt-1 text-gray-700">{items?.length || 0} yêu cầu</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closePreview}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmAnalysis}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Lưu vào ngân hàng
              </button>
            </div>
          </div>
        </div>
      )}

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