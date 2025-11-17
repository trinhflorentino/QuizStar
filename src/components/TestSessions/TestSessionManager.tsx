import React, { useState } from 'react';
import { FaTimes, FaExclamationCircle } from 'react-icons/fa';
// @ts-ignore - react-toastify may not have type definitions
import { toast } from 'react-toastify';
import { useTestSessions } from './hooks/useTestSessions';
import { SessionForm } from './components/SessionForm';
import { SessionList } from './components/SessionList';
import { TestSessionManagerProps, NewSessionForm } from './types';

const TestSessionManager: React.FC<TestSessionManagerProps> = ({ examId, isOpen, handleClose }) => {
  const {
    sessions,
    loading,
    examLoading,
    examDetails,
    error,
    createSession,
    deleteSession,
    toggleSessionStatus
  } = useTestSessions(examId, isOpen);

  const [creating, setCreating] = useState<boolean>(false);

  const handleCreateSession = async (newSession: NewSessionForm) => {
    setCreating(true);
    try {
      const success = await createSession(newSession);
      return success;
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = (sessionId: string) => {
    const testLink = `${window.location.origin}/pinverify/Form/${sessionId}`;
    navigator.clipboard.writeText(testLink)
      .then(() => {
        toast.success('Đã sao chép liên kết phiên thi vào clipboard');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        toast.error('Không thể sao chép liên kết');
      });
  };

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
              <SessionForm onSubmit={handleCreateSession} isCreating={creating} />
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách phiên thi</h3>
                <SessionList
                  sessions={sessions}
                  onToggleStatus={toggleSessionStatus}
                  onCopyLink={handleCopyLink}
                  onDelete={deleteSession}
                />
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
};

export default TestSessionManager;

