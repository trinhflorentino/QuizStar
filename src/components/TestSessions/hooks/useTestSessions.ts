import { useState, useEffect } from 'react';
import { doc, collection, getDocs, setDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import db from '../../../services/firebaseConfig';
// @ts-ignore - react-toastify may not have type definitions
import { toast } from 'react-toastify';
import { TestSession, ExamDetails, NewSessionForm } from '../types';

export function useTestSessions(examId: string | null, isOpen: boolean) {
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [examLoading, setExamLoading] = useState<boolean>(true);
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && examId) {
      const auth = getAuth();
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          loadExamAndSessions(user);
        } else {
          setError("Vui lòng đăng nhập để quản lý phiên thi");
          setLoading(false);
          setExamLoading(false);
        }
      });

      return () => unsubscribe();
    } else {
      setSessions([]);
      setExamDetails(null);
      setError(null);
    }
  }, [isOpen, examId]);

  async function loadExamAndSessions(user: any) {
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
          setExamDetails(examDoc.data() as ExamDetails);
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
          const sessionsData: TestSession[] = [];
          
          sessionsSnapshot.forEach(doc => {
            sessionsData.push({
              id: doc.id,
              ...doc.data()
            } as TestSession);
          });
          
          setSessions(sessionsData);
        } else {
          setSessions([]);
        }
        
      } catch (error: any) {
        console.error("Error loading sessions:", error);
        setError(error.message || "Lỗi khi tải phiên thi");
      }
    } catch (error: any) {
      console.error("Error in loadExamAndSessions:", error);
      setError(error.message || "Đã xảy ra lỗi");
    } finally {
      setExamLoading(false);
      setLoading(false);
    }
  }

  async function createSession(newSession: NewSessionForm): Promise<boolean> {
    if (!newSession.name.trim()) {
      toast.error('Vui lòng nhập tên phiên thi');
      return false;
    }

    if (!examDetails) {
      toast.error('Không tìm thấy thông tin đề thi');
      return false;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      toast.error("Vui lòng đăng nhập để tạo phiên thi");
      return false;
    }
    
    try {
      // Generate a 6-digit session pin
      const sessionPin = Math.floor(100000 + Math.random() * 900000);
      const sessionPinStr = sessionPin.toString();
      
      // Prepare session data
      const sessionData = {
        quiz_title: newSession.name.trim(),
        original_exam_id: examId!,
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
      
      // Update local state
      const newSessionWithId: TestSession = {
        id: sessionPinStr,
        ...sessionData
      };
      
      setSessions(prevSessions => [newSessionWithId, ...prevSessions]);
      
      toast.success('Phiên thi mới đã được tạo thành công!');
      return true;
    } catch (error: any) {
      console.error("Error creating session:", error);
      toast.error(`Lỗi: ${error.message}`);
      return false;
    }
  }

  async function deleteSession(sessionId: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phiên thi này?")) {
      return;
    }

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
        
        const deletePromises: Promise<void>[] = [];
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
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSessionStatus(session: TestSession): Promise<void> {
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
    } catch (error: any) {
      console.error("Error updating session status:", error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return {
    sessions,
    loading,
    examLoading,
    examDetails,
    error,
    createSession,
    deleteSession,
    toggleSessionStatus
  };
}

