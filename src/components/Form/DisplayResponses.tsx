import { useEffect, useState, useCallback, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocs, collection, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import React from 'react';
import ActionToolbar from './DisplayResponses/ActionToolbar';
import SearchBar from './DisplayResponses/SearchBar';
import ResponseTable from './DisplayResponses/ResponseTable';
import ErrorDisplay from './DisplayResponses/ErrorDisplay';
import type { Response, ResponseData } from './DisplayResponses/types';

const DisplayResponses: React.FC = () => {
  const navigate = useNavigate();
  const { pin } = useParams<{ pin: string }>();
  const [responses, setResponses] = useState<Response[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [status, setStatus] = useState<string>("active");
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  // Debug mode for troubleshooting
  const [debug, setDebug] = useState<boolean>(false);
  const [processingLog, setProcessingLog] = useState<string[]>([]);

  const logDebug = useCallback((message: string) => {
    setProcessingLog(prev => [...prev, message]);
  }, []);

  // Check if current user is the owner of the exam
  useEffect(() => {
    if (!pin) return;

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
        if (!isOwner || !pin) return;
        
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
        
        const processedResponses: Response[] = [];
        
        logDebug(`Found ${responsesSnapshot.docs.length} total response documents`);
        
        // Process each response document
        for (const docSnapshot of responsesSnapshot.docs) {
          const responseData = docSnapshot.data() as ResponseData;
          const docId = docSnapshot.id;
          
          // Skip if no student info
          if (!responseData.stud_info) {
            logDebug(`Skipping document ${docId} - No student info`);
            continue;
          }
          
          // Extract user identifier and attempt ID from document ID
          const parts = docId.split('_');
          let userIdentifier: string;
          let attemptId: string | null;
          
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
          
          // Get attempt number
          const attemptNumber = responseData.attemptNumber || 1;
          
          // Format creation date
          let createDate = 'N/A';
          if (responseData.submittedAt) {
            const date = responseData.submittedAt.toDate ? 
              responseData.submittedAt.toDate() : 
              new Date((responseData.submittedAt as any).seconds * 1000);
            createDate = date.toLocaleString();
          }
          
          logDebug(`Processing: ${docId} | ` + 
            `User: ${userIdentifier} | ` + 
            `Guest: ${isGuest} | ` + 
            `Status: ${responseData.status} | ` + 
            `Completed: ${responseData.status === 'completed' || responseData.timeExpired}`);
          
          // Include both completed and in-progress attempts - teachers need to see all attempts
          processedResponses.push({
            id: docId,
            userIdentifier: userIdentifier,
            attemptId: attemptId,
            name: responseData.stud_info.name || "",
            email: userIdentifier,
            class: responseData.stud_info.class || "",
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
          return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        });
        
        setResponses(processedResponses);
        setFilteredResponses(processedResponses);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching responses:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu: " + (error.message || String(error)));
        setLoading(false);
      }
    }
    
    if (isOwner && pin) {
      fetchResponses();
    }
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

  const handleResponseStatus = async (currentStatus: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || !isOwner || !pin) {
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
  };

  const handleDelete = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || !isOwner || !pin) {
      setError("Bạn không có quyền thực hiện thao tác này.");
      return;
    }
    
    if (window.confirm("Bạn có chắc chắn muốn xóa bài thi này?")) {
      try {
        // Delete all responses
        const responsesDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Responses")
        );
        
        for (const docSnap of responsesDocs.docs) {
          await deleteDoc(docSnap.ref);
        }

        // Delete all questions
        const questionDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
        );
        
        for (const docSnap of questionDocs.docs) {
          await deleteDoc(docSnap.ref);
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
  };

  // View student attempt detail
  const viewStudentResponse = (response: Response) => {
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

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ActionToolbar
        pin={pin || ""}
        status={status}
        onStatusChange={handleResponseStatus}
        onDelete={handleDelete}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Danh sách bài làm
        </h1>
        <p className="text-gray-500">
          Mã bài thi: <span className="font-medium">{pin}</span>
        </p>
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
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            resultCount={filteredResponses.length}
          />
          <div className="overflow-x-auto">
            <ResponseTable
              responses={filteredResponses}
              loading={loading}
              onViewDetail={viewStudentResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayResponses;




