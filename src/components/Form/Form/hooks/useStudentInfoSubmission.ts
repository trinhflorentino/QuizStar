import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { doc, setDoc, writeBatch } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import db from '../../../../services/firebaseConfig';
import { getUserIdentifier, isUserAuthenticated } from '../utils';
import { StudentInfo, OrderMapping } from '../types';

interface UseStudentInfoSubmissionParams {
  pin: string | undefined;
  originalOrder: OrderMapping;
  previousAttempts: any[];
  title: string;
  setStudInfo: React.Dispatch<React.SetStateAction<StudentInfo>>;
  setCurrentAttemptId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsStudentInfoSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const useStudentInfoSubmission = ({
  pin,
  originalOrder,
  previousAttempts,
  title,
  setStudInfo,
  setCurrentAttemptId,
  setIsStudentInfoSubmitted,
  setStartTime
}: UseStudentInfoSubmissionParams) => {
  
  const handleStudentInfoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!pin) {
      alert("Không tìm thấy mã bài thi. Vui lòng thử lại.");
      return;
    }
    
    const nameInput = document.getElementById("studName") as HTMLInputElement;
    const classInput = document.getElementById("studClass") as HTMLInputElement;
    const schoolInput = document.getElementById("studSchool") as HTMLInputElement;
    
    if (!nameInput || !classInput || !schoolInput) {
      alert("Không tìm thấy các trường nhập liệu. Vui lòng tải lại trang.");
      return;
    }
    
    const name = nameInput.value.trim();
    const className = classInput.value.trim();
    const school = schoolInput.value.trim();
    
    if (!name || !className || !school) {
      alert("Vui lòng điền đầy đủ thông tin học sinh.");
      return;
    }
    
    const userIdentifier = getUserIdentifier();
    
    const studentData: StudentInfo = {
      name: name,
      email: userIdentifier,
      roll_no: "",
      class: className
    };
    setStudInfo(studentData);
    
    const attemptId = uuid();
    setCurrentAttemptId(attemptId);
    
    const now = new Date();
    try {
      const batch = writeBatch(db);
      
      const responseRef = doc(
        db,
        "Paper_Setters",
        pin.toString(),
        "Responses",
        `${userIdentifier}_${attemptId}`
      );
      
      // Use originalOrder if available, otherwise use empty object (will be set later when questions are shuffled)
      const orderMapping = originalOrder && Object.keys(originalOrder).length > 0 ? originalOrder : {};
      
      batch.set(responseRef, {
        stud_info: studentData,
        startedAt: now,
        status: "in_progress",
        selected_answers: [],
        orderMapping: orderMapping,
        attemptId: attemptId,
        attemptNumber: previousAttempts.length + 1,
        isGuest: !isUserAuthenticated()
      }, { merge: true });
      
      await batch.commit();
      
      if (isUserAuthenticated()) {
        getAuth().onAuthStateChanged(async function (user) {
          if (user) {
            await setDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin),
              {
                quiz_title: title,
                last_attempt_at: now
              },
              { merge: true }
            );
            
            await setDoc(
              doc(db, "Users", user.uid, "Exams_Attempted", pin, "Attempts", attemptId),
              {
                name: studentData.name,
                class: studentData.class,
                school: school,
                email_id: userIdentifier,
                status: "in_progress",
                startedAt: now,
                attemptNumber: previousAttempts.length + 1
              }
            );
          }
        });
      }
      
      setIsStudentInfoSubmitted(true);
      setStartTime(now);
      
      console.log("Student info submitted successfully:", {
        pin,
        attemptId,
        studentData,
        orderMapping
      });
    } catch (error) {
      console.error("Error saving attempt:", error);
      alert(`Đã xảy ra lỗi khi lưu thông tin: ${error instanceof Error ? error.message : 'Unknown error'}. Vui lòng thử lại.`);
    }
  }, [pin, originalOrder, previousAttempts, title, setStudInfo, setCurrentAttemptId, setIsStudentInfoSubmitted, setStartTime]);

  return { handleStudentInfoSubmit };
};


