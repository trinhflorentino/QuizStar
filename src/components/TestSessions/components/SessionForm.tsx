import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { NewSessionForm } from '../types';

interface SessionFormProps {
  onSubmit: (session: NewSessionForm) => Promise<boolean>;
  isCreating: boolean;
}

export const SessionForm: React.FC<SessionFormProps> = ({ onSubmit, isCreating }) => {
  const [newSession, setNewSession] = useState<NewSessionForm>({
    name: '',
    duration: 45,
    status: 'inactive'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(newSession);
    if (success) {
      setNewSession({
        name: '',
        duration: 45,
        status: 'inactive'
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 mb-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Tạo phiên thi mới</h3>
      
      <form onSubmit={handleSubmit}>
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
              required
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
            onChange={(e) => setNewSession({...newSession, status: e.target.value as 'active' | 'inactive'})}
          >
            <option value="inactive">Không hoạt động</option>
            <option value="active">Hoạt động</option>
          </select>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className={`flex items-center px-4 py-2 rounded-md text-white shadow-sm focus:outline-none ${
              isCreating || !newSession.name.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isCreating || !newSession.name.trim()}
          >
            {isCreating ? (
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
      </form>
    </div>
  );
};

