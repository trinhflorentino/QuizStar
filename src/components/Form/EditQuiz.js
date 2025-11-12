import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import db from '../../services/firebaseConfig';
import FormMaker from './FormMaker';

function EditQuiz() {
  const { examId } = useParams();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizData();
  }, [examId]);

  async function loadQuizData() {
    setLoading(true);
    setError(null);
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      setError("Bạn cần đăng nhập để thực hiện chức năng này");
      setLoading(false);
      return;
    }
    
    try {
      const docRef = doc(db, "Users", user.uid, "Question_Bank", examId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Format the data for the FormMaker component
        const formattedData = {
          title: data.title,
          questions: data.questions || [],
          answers: data.answers || []
        };
        
        setQuizData(formattedData);
      } else {
        setError("Không tìm thấy đề thi này");
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu đề thi");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(updatedData) {
    setLoading(true);
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      setError("Bạn cần đăng nhập để thực hiện chức năng này");
      setLoading(false);
      return;
    }
    
    try {
      const docRef = doc(db, "Users", user.uid, "Question_Bank", examId);
      
      await updateDoc(docRef, {
        questions: updatedData.questions,
        answers: updatedData.answers,
        lastModified: new Date()
      });
      
      navigate('/QuestionBank');
    } catch (error) {
      console.error("Error updating quiz:", error);
      setError("Có lỗi xảy ra khi cập nhật đề thi");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/QuestionBank')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Quay lại Ngân hàng câu hỏi
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Chỉnh sửa đề thi</h1>
        <p className="text-gray-600">Mã đề: {examId}</p>
      </div>
      
      {quizData && (
        <FormMaker
          isEditing={true}
          initialData={quizData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default EditQuiz; 