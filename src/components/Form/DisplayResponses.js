import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDocs, collection, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';
import { FaEdit, FaLock, FaFilePdf, FaSearch, FaSpinner } from "react-icons/fa";
import { MdDeleteForever, MdPieChart } from "react-icons/md";
import { IoDocumentTextSharp } from "react-icons/io5";

// import AnalyzeKnowledge from "./analyze-knowledge/AnalyzeKnowledge";

function DisplayResponses() {
  const navigate = useNavigate();
  let { pin } = useParams();
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Debug mode for troubleshooting
  const [debug, setDebug] = useState(false);
  const [processingLog, setProcessingLog] = useState([]);

  const logDebug = useCallback((message) => {
    setProcessingLog(prev => [...prev, message]);
  }, []);

  // Check if current user is the owner of the exam
  useEffect(() => {
    const auth = getAuth();
    const checkOwnership = async () => {
      setLoading(true);
      
      if (auth.currentUser) {
        try {
          // Check if the current user has this exam in their Exams_Created collection
          const examRef = doc(db, "Users", auth.currentUser.uid, "Exams_Created", pin);
          const examDoc = await getDoc(examRef);
          
          if (examDoc.exists()) {
            setIsOwner(true);
            // Keep loading true as we'll load the responses next
          } else {
            // Check if this exam exists but belongs to someone else
            const examMainRef = doc(db, "Paper_Setters", pin);
            const examMainDoc = await getDoc(examMainRef);
            
            if (examMainDoc.exists()) {
              setError("Bạn không có quyền xem kết quả bài thi này.");
            } else {
              setError("Bài thi không tồn tại.");
            }
            setLoading(false);
          }
        } catch (err) {
          console.error("Error checking exam ownership:", err);
          setError("Đã xảy ra lỗi khi kiểm tra quyền truy cập.");
          setLoading(false);
        }
      } else {
        setError("Vui lòng đăng nhập để xem kết quả.");
        setLoading(false);
      }
    };
    
    checkOwnership();
    
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsOwner(false);
        setError("Vui lòng đăng nhập để xem kết quả.");
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [pin]);

  useEffect(() => {
    async function fetchResponses() {
      try {
        // Only fetch responses if user is the owner
        if (!isOwner) return;
        
        // Loading is already set to true from the ownership check
        setProcessingLog([]);
        
        // Fetch exam status
        const examDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
        );
        
        if (!examDocs.empty) {
          setStatus(examDocs.docs[0].data().status || "active");
        }
        
        // Fetch all responses
        const responsesSnapshot = await getDocs(
          collection(db, "Paper_Setters", pin, "Responses")
        );
        
        if (responsesSnapshot.empty) {
          setResponses([]);
          setFilteredResponses([]);
          setLoading(false);
          return;
        }
        
        // Get quiz metadata for duration info
        const quizDoc = await getDoc(doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", "questionsTest"));
        const quizDuration = quizDoc.exists() ? quizDoc.data().duration : null;
        
        const processedResponses = [];
        const processedIds = new Set(); // Track processed student IDs to avoid duplicates
        
        logDebug(`Found ${responsesSnapshot.docs.length} total response documents`);
        
        // Process each response document
        for (const docSnapshot of responsesSnapshot.docs) {
          const responseData = docSnapshot.data();
          const docId = docSnapshot.id;
          
          // Skip if no student info
          if (!responseData.stud_info) {
            logDebug(`Skipping document ${docId} - No student info`);
            continue;
          }
          
          // Extract user identifier and attempt ID from document ID
          const parts = docId.split('_');
          let userIdentifier, attemptId;
          
          if (parts.length >= 2) {
            // New format: userEmail_attemptId
            attemptId = parts[parts.length - 1];
            userIdentifier = parts.slice(0, parts.length - 1).join('_');
          } else {
            // Old format: just userEmail
            userIdentifier = docId;
            attemptId = null;
          }
          
          // Determine if this is a guest user
          const isGuest = responseData.isGuest || userIdentifier.startsWith('guest_');
          
          // Check if this is a completed response (either explicitly completed or time expired)
          const isCompleted = responseData.status === 'completed' || responseData.timeExpired;
          
          // Get attempt number
          const attemptNumber = responseData.attemptNumber || 1;
          
          // Format creation date
          let createDate = 'N/A';
          if (responseData.submittedAt) {
            const date = responseData.submittedAt.toDate ? 
              responseData.submittedAt.toDate() : 
              new Date(responseData.submittedAt.seconds * 1000);
            createDate = date.toLocaleString();
          }
          
          logDebug(`Processing: ${docId} | ` + 
            `User: ${userIdentifier} | ` + 
            `Guest: ${isGuest} | ` + 
            `Status: ${responseData.status} | ` + 
            `Completed: ${isCompleted}`);
          
          // Include both completed and in-progress attempts - teachers need to see all attempts
          processedResponses.push({
            id: docId,
            userIdentifier: userIdentifier,
            attemptId: attemptId,
            name: responseData.stud_info.name,
            email: userIdentifier,
            class: responseData.stud_info.class,
            school: responseData.stud_info.school,
            score: responseData.score || "0/0",
            createDate: createDate,
            isGuest: isGuest,
            status: responseData.status || "unknown",
            attemptNumber: attemptNumber
          });
        }
        
        logDebug(`Processed ${processedResponses.length} valid responses`);
        
        // Sort by date (newest first)
        processedResponses.sort((a, b) => {
          return new Date(b.createDate) - new Date(a.createDate);
        });
        
        setResponses(processedResponses);
        setFilteredResponses(processedResponses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching responses:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu: " + error.message);
        setLoading(false);
      }
    }
    
    fetchResponses();
  }, [pin, logDebug, isOwner]);

  // Filter responses based on search input
  useEffect(() => {
    if (!search.trim()) {
      setFilteredResponses(responses);
      return;
    }
    
    const lowerCaseSearch = search.toLowerCase();
    const filtered = responses.filter(
      (response) =>
        response.name.toLowerCase().includes(lowerCaseSearch) ||
        response.email.toLowerCase().includes(lowerCaseSearch) ||
        response.class.toLowerCase().includes(lowerCaseSearch) ||
        (response.school && response.school.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredResponses(filtered);
  }, [search, responses]);

  async function handleResponseStatus(currentStatus) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || !isOwner) {
      setError("Bạn không có quyền thực hiện thao tác này.");
      return;
    }
    
    if (currentStatus === "active") {
      if (window.confirm("Bạn chắc chắn muốn khóa bài thi?") === true) {
        const examDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
        );
        
        if (!examDocs.empty) {
          const examDoc = examDocs.docs[0];
          await setDoc(
            doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", examDoc.id),
            { status: "inactive" },
            { merge: true }
          );

          await setDoc(
            doc(db, "Users", user.uid, "Exams_Created", pin),
            { status: "inactive" },
            { merge: true }
          );

          setStatus("inactive");
        }
      }
    } else {
      if (window.confirm("Are you sure you want to resume responses ?") === true) {
        const examDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
        );
        
        if (!examDocs.empty) {
          const examDoc = examDocs.docs[0];
          await setDoc(
            doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", examDoc.id),
            { status: "active" },
            { merge: true }
          );

          await setDoc(
            doc(db, "Users", user.uid, "Exams_Created", pin),
            { status: "active" },
            { merge: true }
          );

          setStatus("active");
        }
      }
    }
  }

  async function handleDelete() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || !isOwner) {
      setError("Bạn không có quyền thực hiện thao tác này.");
      return;
    }
    
    if (window.confirm("Bạn có chắc chắn muốn xóa bài thi này?")) {
      try {
        // Delete all responses
        const responsesDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Responses")
        );
        
        for (const doc of responsesDocs.docs) {
          await deleteDoc(doc.ref);
        }

        // Delete all questions
        const questionDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
        );
        
        for (const doc of questionDocs.docs) {
          await deleteDoc(doc.ref);
        }

        // Delete exam reference from user's created exams
        await deleteDoc(doc(db, "Users", user.uid, "Exams_Created", pin));

        // Delete main exam document
        await deleteDoc(doc(db, "Paper_Setters", pin));

        navigate('/TestManagement');
      } catch (error) {
        console.error("Error deleting exam:", error);
        alert("Có lỗi xảy ra khi xóa bài thi!");
      }
    }
  }

  // View student attempt detail
  const viewStudentResponse = (response) => {
    if (!isOwner) {
      setError("Bạn không có quyền xem chi tiết bài làm.");
      return;
    }
    
    if (!pin) {
      console.error("Missing pin parameter");
      return;
    }
    
    if (!response || !response.email) {
      console.error("Invalid response data", response);
      return;
    }
    
    // Sanitize parameters to prevent invalid characters
    const sanitizedPin = encodeURIComponent(pin);
    const sanitizedEmail = encodeURIComponent(response.email);
    
    // Use the attemptId if available in the updated format
    if (response.attemptId) {
      const sanitizedAttemptId = encodeURIComponent(response.attemptId);
      navigate(`/ExamsCreated/ExamResults/${sanitizedPin}/ViewStudentResponse/${sanitizedEmail}/${sanitizedAttemptId}`);
    } else {
      // Fall back to the old format
      navigate(`/ExamsCreated/ExamResults/${sanitizedPin}/ViewStudentResponse/${sanitizedEmail}`);
    }
  };

  // View all attempts for a student
  const viewAllAttempts = (userIdentifier) => {
    if (!isOwner) {
      setError("Bạn không có quyền xem chi tiết bài làm.");
      return;
    }
    
    navigate(`/ExamsCreated/ExamResults/${pin}/StudentAttempts/${userIdentifier}`);
  };

  // Truncate long IDs for display but show full on hover
  const formatEmail = (email) => {
    if (email && email.startsWith('guest_') && email.length > 15) {
      return (
        <span title={email}>{email.substring(0, 12)}...</span>
      );
    }
    return email;
  };

  // Handle toggling debug mode
  const toggleDebug = () => {
    setDebug(prev => !prev);
  };

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Truy cập bị từ chối
            </h1>
            <p className="mt-4 text-lg text-red-500">{error}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate('/TestManagement')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none"
              >
                Về trang quản lý
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row flex-wrap gap-2 mb-3 mx-4 md:mx-10 lg:mx-14">
        <button
          onClick={() => navigate('/TestManagement')}
          className="sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Quay lại
        </button>   
        <button
          onClick={() => navigate('QuestionsDetail')}
          className="sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <IoDocumentTextSharp  className="inline-block mr-2" />
          Xem nội dung đề thi
        </button>
        <button
          onClick={() => navigate('/FormEdit/' + pin)}
          className="sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <FaEdit className="inline-block mr-2" />
          Chỉnh sửa đề thi
        </button>   
        <button
          onClick={() => window.open(`${pin}/ExportExam`, '_blank')}
          className="sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <FaFilePdf className="inline-block mr-2" />
          Xuất PDF
        </button>
        <button
          onClick={() => navigate('AnalyzeKnowledge')}
          className="sm:w-auto px-4 py-2 rounded-md transition-colors duration-300 bg-green-600 hover:bg-green-700 text-white"
        >
          <MdPieChart className="inline mr-2" />
          Phân tích cấu trúc đề thi
        </button>
        <button
          onClick={() => handleResponseStatus(status)}
          className={`sm:w-auto px-4 py-2 rounded-md transition-colors duration-300 ${
            status === "active"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          <FaLock className='inline mr-2'/>
          {status === "active" ? "Khóa câu trả lời" : "Mở câu trả lời"}
        </button>
        <button
          onClick={handleDelete}
          className="sm:w-auto px-4 py-2 rounded-md transition-colors duration-300 bg-red-800 hover:bg-red-900 text-white"
        >
          <MdDeleteForever className="inline mr-2" />
          Xóa đề thi
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Danh sách bài làm
        </h1>
        <p className="text-gray-500">
          Mã bài thi: <span className="font-medium">{pin}</span>
        </p>
        
        {/* <div className="mt-6 flex justify-end">
          <button 
            onClick={toggleDebug}
            className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            {debug ? "Ẩn log" : "Hiện log"}
          </button>
        </div> */}
      </div>
      
      {debug && (
        <div className="mb-8 bg-gray-800 text-green-400 p-4 rounded-md font-mono text-xs overflow-x-auto">
          <div className="mb-2 flex justify-between">
            <h3 className="text-white">Processing Log</h3>
            <span className="text-gray-400">{processingLog.length} entries</span>
          </div>
          <pre className="whitespace-pre-wrap">
            {processingLog.map((log, i) => (
              <div key={i} className="mb-1">
                {log}
              </div>
            ))}
          </pre>
        </div>
      )}
      
      {filteredResponses.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">Không có bài làm nào.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách học sinh ({filteredResponses.length})
            </h2>
            
            <div className="relative mt-2 sm:mt-0 flex-grow sm:flex-grow-0 sm:ml-4 max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <FaSearch className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto" />
                  <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Họ và tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email/ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lớp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trường
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Điểm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lần thử
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResponses.map((response, index) => (
                    <tr key={response.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {response.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500" title={response.email}>
                          {formatEmail(response.email)}
                          {response.isGuest && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Khách
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{response.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {response.school}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          {response.score}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          #{response.attemptNumber || 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          response.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : response.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {response.status === 'completed' 
                            ? 'Hoàn thành' 
                            : response.status === 'in_progress' 
                              ? 'Đang làm'
                              : 'Chưa xác định'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{response.createDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewStudentResponse(response)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayResponses;
