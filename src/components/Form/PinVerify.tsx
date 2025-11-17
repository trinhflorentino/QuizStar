import { useState, KeyboardEvent, ChangeEvent, FormEvent } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";

interface ExamInfo {
  title: string;
  status: string;
  duration: number | null;
}

const PinVerify: React.FC = () => {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [examInfo, setExamInfo] = useState<ExamInfo | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const navigate = useNavigate();

  function numHandler(event: KeyboardEvent<HTMLInputElement>) {
    const pattern = /[^0-9]/;
    const target = event.target as HTMLInputElement;
    if (event.key.match(pattern) || target.value.length >= 6) {
      event.preventDefault();
    }
  }

  async function verifyExamExists(pinCode: string): Promise<{ exists: boolean; examInfo?: ExamInfo; error?: string }> {
    try {
      const settersCollectionRef = collection(
        db,
        "Paper_Setters",
        pinCode,
        "Question_Papers_MCQ"
      );
      const docos = await getDocs(settersCollectionRef);
      
      if (docos.docs.length === 0) {
        return { exists: false, error: "Không tìm thấy bài thi với mã này" };
      }
      
      const docosData = docos.docs.map((doc) => doc.data());
      const mainDoc = docos.docs.find(doc => !doc.id.includes('_answerSheet'));
      
      if (!mainDoc || !docosData[0].question_question) {
        return { exists: false, error: "Dữ liệu bài thi không hợp lệ" };
      }
      
      const examData = mainDoc.data();
      const examInfo: ExamInfo = {
        title: mainDoc.id,
        status: examData.status || "",
        duration: examData.duration || null
      };
      
      return { exists: true, examInfo };
    } catch (error: any) {
      console.error("Error verifying exam:", error);
      return { exists: false, error: "Đã xảy ra lỗi khi kiểm tra bài thi" };
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setExamInfo(null);
    
    if (pin.length === 0) {
      setError("Vui lòng nhập mã bài thi");
      return;
    }
    
    if (pin.length !== 6) {
      setError("Mã bài thi phải gồm 6 ký tự");
      return;
    }

    setIsVerifying(true);
    setIsSubmitting(true);
    
    const verification = await verifyExamExists(pin);
    
    setIsVerifying(false);
    
    if (!verification.exists) {
      setError(verification.error || "Bài thi không tồn tại");
      setExamInfo(null);
      setIsSubmitting(false);
      return;
    }
    
    // Exam exists, check status
    if (verification.examInfo) {
      // Check if exam is inactive
      if (verification.examInfo.status === "inactive") {
        setError("Bài thi này đã bị khóa bởi người tạo");
        setExamInfo(null);
        setIsSubmitting(false);
        return;
      }
      
      // Exam is valid and active, navigate to the exam form
      // Small delay to show success state
      setExamInfo(verification.examInfo);
      setTimeout(() => {
        navigate(`/exam/${pin}`);
      }, 500);
    }
  }

  function pinChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setPin(value);
    if (error && value.length === 6) {
      setError("");
    }
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSubmit(event as any);
    } else {
      numHandler(event);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Tham gia bài thi
            </h1>
            <p className="text-gray-500 text-sm">Nhập mã bài thi để bắt đầu làm bài</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pinCheck">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Mã bài thi
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-4 py-4 text-center text-2xl font-bold tracking-widest border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-300 ${
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                  }`}
                  name="pinCheck"
                  id="pinCheck"
                  placeholder="000000"
                  maxLength={6}
                  value={pin}
                  onKeyPress={handleKeyPress}
                  onChange={pinChangeHandler}
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
              
              {/* PIN Length Indicator */}
              <div className="flex justify-center gap-2 mt-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-all duration-200 ${
                      index < pin.length
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Exam Info (if verified) */}
              {examInfo && !error && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-green-800 font-semibold text-sm mb-1">Bài thi hợp lệ</p>
                      <p className="text-green-700 text-sm">{examInfo.title}</p>
                      {examInfo.duration && (
                        <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Thời gian: {examInfo.duration} phút
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isSubmitting || pin.length !== 6 || isVerifying}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang kiểm tra...</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>Tham gia</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mã bài thi gồm 6 chữ số
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinVerify;




