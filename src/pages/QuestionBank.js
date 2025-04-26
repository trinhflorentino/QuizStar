import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import db from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { FaEdit, FaTrash, FaSearch, FaEye, FaPlus } from 'react-icons/fa';

function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestionBank();
  }, []);

  async function loadQuestionBank() {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      try {
        const questionBankRef = collection(db, "Users", user.uid, "Question_Bank");
        const snapshot = await getDocs(questionBankRef);
        
        if (!snapshot.empty) {
          const exams = [];
          
          snapshot.forEach(doc => {
            exams.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setQuestions(exams);
        }
      } catch (error) {
        console.error("Error loading question bank:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleDelete(examId) {
    if (window.confirm("Bạn có chắc chắn muốn xóa đề thi này khỏi ngân hàng?")) {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        try {
          await deleteDoc(doc(db, "Users", user.uid, "Question_Bank", examId));
          
          // Update local state
          setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== examId));
          
          alert("Đã xóa đề thi thành công!");
        } catch (error) {
          console.error("Error deleting exam:", error);
          alert("Có lỗi xảy ra khi xóa đề thi!");
        }
      }
    }
  }

  function handleEdit(examId) {
    navigate(`/EditQuiz/${examId}`);
  }

  function handleViewDetails(exam) {
    setSelectedExam(exam);
    setShowDetails(true);
  }

  function handleCreateNewExam() {
    navigate('/FormMaker');
  }

  const filteredQuestions = questions.filter(q => 
    q.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Ngân hàng câu hỏi</h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/TestManagement')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Quay lại
          </button>
          
          <button
            onClick={handleCreateNewExam}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <FaPlus className="inline mr-2" />
            Tạo đề thi mới
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Danh sách đề thi</h2>
          
          <div className="relative w-full md:w-64">
            <input
              type="search"
              placeholder="Tìm kiếm đề thi..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có đề thi nào trong ngân hàng</p>
            <p className="mt-2 text-sm">Tạo đề thi mới với tùy chọn lưu vào ngân hàng để quản lý dễ dàng hơn</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đề
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số câu hỏi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exam.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exam.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exam.questions?.length || 0}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exam.createdAt?.toDate().toLocaleDateString() || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(exam)}
                          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                          title="Xem chi tiết"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(exam.id)}
                          className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                          title="Xóa"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Detail Modal */}
      {showDetails && selectedExam && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedExam.title}</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Mã đề: {selectedExam.id} | 
                  Số câu hỏi: {selectedExam.questions?.length || 0} | 
                  Ngày tạo: {selectedExam.createdAt?.toDate().toLocaleDateString() || "N/A"}
                </p>
              </div>
              
              <div className="space-y-6">
                {selectedExam.questions?.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full mr-2">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{question.question}</p>
                        
                        {question.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={question.imageUrl} 
                              alt="Question" 
                              className="max-h-40 rounded-md"
                            />
                          </div>
                        )}
                        
                        {question.type === 'mcq' && (
                          <div className="mt-2 ml-4 space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={`flex items-center ${
                                  selectedExam.answers[index]?.answer === optIndex 
                                    ? "text-green-600 font-medium" 
                                    : ""
                                }`}
                              >
                                <span className="w-5">{option.optionNo}.</span>
                                <span>{option.option}</span>
                                {selectedExam.answers[index]?.answer === optIndex && (
                                  <span className="ml-2 text-green-600">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'truefalse' && (
                          <div className="mt-2 ml-4 space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={`flex items-center ${
                                  selectedExam.answers[index]?.answer?.[optIndex] 
                                    ? "text-green-600 font-medium" 
                                    : ""
                                }`}
                              >
                                <span>{option.option}</span>
                                {selectedExam.answers[index]?.answer?.[optIndex] && (
                                  <span className="ml-2 text-green-600">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'shortanswer' && (
                          <div className="mt-2 ml-4">
                            <p className="text-green-600 font-medium">
                              Đáp án: {selectedExam.answers[index]?.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {question.score && (
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-500">
                          Điểm: {question.score}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionBank; 