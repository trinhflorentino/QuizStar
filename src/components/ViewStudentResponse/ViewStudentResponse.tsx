import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';
import { useStudentResponse } from './hooks/useStudentResponse';
import { StudentInfoCard } from './components/StudentInfoCard';
import { QuestionResponseItem } from './components/QuestionResponseItem';
import { Question, Answer, StudentAnswer } from './types';

const ViewStudentResponse: React.FC = () => {
  const { pin, studentEmail, attemptId } = useParams<{ pin: string; studentEmail: string; attemptId?: string }>();
  const navigate = useNavigate();
  
  const {
    loading,
    error,
    questions,
    answers,
    studentAnswers,
    studentInfo,
    score,
    examTitle
  } = useStudentResponse(pin, studentEmail, attemptId);

  const handleBackClick = () => {
    navigate(`/ExamsCreated/ExamResults/${pin}`);
  };

  if (loading) {
    return <div className="text-center p-10">Đang tải bài làm...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleBackClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <MathJaxContext>
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <button 
            onClick={handleBackClick}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-4"
          >
            ← Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold mb-2">{examTitle}</h1>
        </div>
        
        {studentInfo && (
          <StudentInfoCard studentInfo={studentInfo} score={score} />
        )}
        
        <div className="space-y-6">
          {questions.map((question: Question, qIndex: number) => {
            const answer = answers[qIndex] as Answer | undefined;
            const studentAnswer = studentAnswers[qIndex] as StudentAnswer | undefined;
            
            return (
              <QuestionResponseItem
                key={qIndex}
                question={question}
                answer={answer}
                studentAnswer={studentAnswer}
                questionIndex={qIndex}
              />
            );
          })}
        </div>
      </div>
    </MathJaxContext>
  );
};

export default ViewStudentResponse;

