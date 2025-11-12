import React, { useState, useEffect } from 'react';
import { doc, collection, getDocs, setDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { v4 as uuid } from 'uuid';
import db from '../../services/firebaseConfig';
import { FaPlus, FaTrash, FaLink, FaTimes, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

function TestSessionManager({ examId, isOpen, handleClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examLoading, setExamLoading] = useState(true);
  const [newSession, setNewSession] = useState({
    name: '',
    duration: 45,
    status: 'inactive'
  });
  const [examDetails, setExamDetails] = useState(null);
  const [copyLinkText, setCopyLinkText] = useState('');
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && examId) {
      const auth = getAuth();
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          loadExamAndSessions(user);
        } else {
          // User not logged in
          setError("Vui lòng đăng nhập để quản lý phiên thi");
          setLoading(false);
          setExamLoading(false);
        }
      });

      return () => unsubscribe();
    } else {
      // Reset states when closing
      setSessions([]);
      setExamDetails(null);
      setError(null);
    }
  }, [isOpen, examId]);

  async function loadExamAndSessions(user) {
    try {
      setLoading(true);
      setExamLoading(true);
      setError(null);
      
      if (!user) {
        setError("Không tìm thấy thông tin đăng nhập");
        setLoading(false);
        setExamLoading(false);
        return;
      }
      
      if (!examId) {
        setError("Không tìm thấy đề thi");
        setLoading(false);
        setExamLoading(false);
        return;
      }

      try {
        // Get the original exam details
        const examRef = doc(db, "Users", user.uid, "Question_Bank", examId);
        const examDoc = await getDoc(examRef);
        
        if (examDoc.exists()) {
          setExamDetails(examDoc.data());
        } else {
          setError("Không tìm thấy thông tin đề thi");
          setExamLoading(false);
          setLoading(false);
          return;
        }
        
        // Get sessions for this exam
        const sessionsQuery = query(
          collection(db, "Users", user.uid, "Exams_Created"),
          where("original_exam_id", "==", examId)
        );
        
        const sessionsSnapshot = await getDocs(sessionsQuery);
        
        if (!sessionsSnapshot.empty) {
          const sessionsData = [];
          
          sessionsSnapshot.forEach(doc => {
            sessionsData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setSessions(sessionsData);
        } else {
          setSessions([]);
        }
        
      } catch (error) {
        console.error("Error loading sessions:", error);
        setError(error.message || "Lỗi khi tải phiên thi");
      }
    } catch (error) {
      console.error("Error in loadExamAndSessions:", error);
      setError(error.message || "Đã xảy ra lỗi");
    } finally {
      setExamLoading(false);
      setLoading(false);
    }
  }

  async function handleCreateSession() {
    if (!newSession.name.trim()) {
      toast.error('Vui lòng nhập tên phiên thi');
      return;
    }

    if (!examDetails) {
      toast.error('Không tìm thấy thông tin đề thi');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      toast.error("Vui lòng đăng nhập để tạo phiên thi");
      return;
    }
    
    try {
      setCreating(true);
      
      // Generate a 6-digit session pin
      const sessionPin = Math.floor(100000 + Math.random() * 900000);
      const sessionPinStr = sessionPin.toString();
      
      // Prepare session data
      const sessionData = {
        quiz_title: newSession.name.trim(),
        original_exam_id: examId,
        status: newSession.status,
        duration: newSession.duration,
        created_at: new Date(),
        creator: user.email,
        creator_uid: user.uid
      };
      
      // Save session details to user's Exams_Created collection
      await setDoc(
        doc(db, "Users", user.uid, "Exams_Created", sessionPinStr),
        sessionData
      );
      
      // Create necessary exam data in Paper_Setters collection
      // Store a copy of the questions for this session
      await setDoc(
        doc(db, "Paper_Setters", sessionPinStr, "Question_Papers_MCQ", newSession.name),
        {
          question_question: examDetails.questions || [],
          creator: user.email,
          status: newSession.status,
          duration: newSession.duration,
          original_exam_id: examId,
          created_at: new Date()
        }
      );
      
      // Store a copy of the answers for this session
      await setDoc(
        doc(db, "Paper_Setters", sessionPinStr, "Question_Papers_MCQ", newSession.name + "_answerSheet"),
        {
          answer_answer: examDetails.answers || [],
          created_at: new Date()
        }
      );
      
      // Update local state to avoid having to reload from server
      const newSessionWithId = {
        id: sessionPinStr,
        ...sessionData
      };
      
      setSessions(prevSessions => [newSessionWithId, ...prevSessions]);
      
      // Reset form state
      setNewSession({
        name: '',
        duration: 45,
        status: 'inactive'
      });
      
      toast.success('Phiên thi mới đã được tạo thành công!');
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteSession(sessionId) {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiên thi này?")) {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        toast.error("Vui lòng đăng nhập để xóa phiên thi");
        return;
      }
      
      try {
        setLoading(true);
        // Get session data first to get its title
        const sessionDoc = await getDoc(doc(db, "Users", user.uid, "Exams_Created", sessionId));
        
        if (sessionDoc.exists()) {
          const sessionData = sessionDoc.data();
          const sessionTitle = sessionData.quiz_title;
          
          // Delete all responses for this session
          const responsesRef = collection(db, "Paper_Setters", sessionId, "Responses");
          const responsesDocs = await getDocs(responsesRef);
          
          const deletePromises = [];
          responsesDocs.forEach(doc => {
            deletePromises.push(deleteDoc(doc.ref));
          });
          
          // Delete question papers for this session
          deletePromises.push(deleteDoc(doc(db, "Paper_Setters", sessionId, "Question_Papers_MCQ", sessionTitle)));
          deletePromises.push(deleteDoc(doc(db, "Paper_Setters", sessionId, "Question_Papers_MCQ", sessionTitle + "_answerSheet")));
          
          // Delete session from user's Exams_Created
          deletePromises.push(deleteDoc(doc(db, "Users", user.uid, "Exams_Created", sessionId)));
          
          await Promise.all(deletePromises);
          
          // Update local state
          setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
        }
        
        toast.success('Phiên thi đã được xóa thành công');
      } catch (error) {
        console.error("Error deleting session:", error);
        toast.error(`Lỗi: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleToggleSessionStatus(session) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      toast.error("Vui lòng đăng nhập để thay đổi trạng thái phiên thi");
      return;
    }
    
    try {
      setLoading(true);
      const newStatus = session.status === 'active' ? 'inactive' : 'active';
      
      // Update status in user's Exams_Created
      await setDoc(
        doc(db, "Users", user.uid, "Exams_Created", session.id),
        { status: newStatus },
        { merge: true }
      );
      
      // Update status in Paper_Setters Question_Papers_MCQ
      await setDoc(
        doc(db, "Paper_Setters", session.id, "Question_Papers_MCQ", session.quiz_title),
        { status: newStatus },
        { merge: true }
      );
      
      // Update local state
      setSessions(prevSessions => 
        prevSessions.map(s => 
          s.id === session.id 
            ? { ...s, status: newStatus } 
            : s
        )
      );
      
      toast.success(`Phiên thi đã được ${newStatus === 'active' ? 'kích hoạt' : 'tạm dừng'}`);
    } catch (error) {
      console.error("Error updating session status:", error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyLink(sessionId) {
    const testLink = `${window.location.origin}/pinverify/Form/${sessionId}`;
    navigator.clipboard.writeText(testLink)
      .then(() => {
        setCopyLinkText(testLink);
        setShowCopyAlert(true);
        setTimeout(() => setShowCopyAlert(false), 3000);
        toast.success('Đã sao chép liên kết phiên thi vào clipboard');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý phiên thi {examDetails?.title && `- ${examDetails.title}`}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <div className="flex items-center">
                <FaExclamationCircle className="mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {loading && examLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Create new session form */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 mb-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Tạo phiên thi mới</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên phiên thi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border ${!newSession.name.trim() ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Nhập tên phiên thi"
                      value={newSession.name}
                      onChange={(e) => setNewSession({...newSession, name: e.target.value})}
                    />
                    {!newSession.name.trim() && (
                      <p className="mt-1 text-sm text-red-600">Tên phiên thi không được để trống</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian làm bài (phút)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      value={newSession.duration}
                      onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 45})}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newSession.status}
                    onChange={(e) => setNewSession({...newSession, status: e.target.value})}
                  >
                    <option value="inactive">Không hoạt động</option>
                    <option value="active">Hoạt động</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className={`flex items-center px-4 py-2 rounded-md text-white shadow-sm focus:outline-none ${
                      creating || !newSession.name.trim()
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={handleCreateSession}
                    disabled={creating || !newSession.name.trim()}
                  >
                    {creating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <FaPlus className="mr-2" />
                        Tạo phiên thi mới
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Sessions list */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách phiên thi</h3>
                
                {sessions.length === 0 ? (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-center border border-blue-100">
                    <p>Chưa có phiên thi nào cho đề thi này.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã phiên</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên phiên thi</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian (phút)</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sessions.map((session) => (
                          <tr key={session.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {session.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {session.quiz_title}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {session.duration}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                session.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {session.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {session.created_at && typeof session.created_at.toDate === 'function'
                                ? new Date(session.created_at.toDate()).toLocaleString()
                                : session.created_at instanceof Date
                                  ? new Date(session.created_at).toLocaleString()
                                  : "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleToggleSessionStatus(session)}
                                  className={`p-1.5 rounded ${
                                    session.status === 'active' 
                                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                                  }`}
                                  title={session.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                                >
                                  {session.status === 'active' ? <FaTimes /> : <FaCheck />}
                                </button>
                                <button
                                  onClick={() => handleCopyLink(session.id)}
                                  className="p-1.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                                  title="Sao chép liên kết"
                                >
                                  <FaLink />
                                </button>
                                <button
                                  onClick={() => handleDeleteSession(session.id)}
                                  className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200"
                                  title="Xóa phiên thi"
                                >
                                  <FaTrash />
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
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={handleClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestSessionManager; 