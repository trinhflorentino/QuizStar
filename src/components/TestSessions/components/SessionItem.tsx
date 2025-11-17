import React from 'react';
import { FaTrash, FaLink, FaTimes, FaCheck } from 'react-icons/fa';
import { TestSession } from '../types';

interface SessionItemProps {
  session: TestSession;
  onToggleStatus: (session: TestSession) => void;
  onCopyLink: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  onToggleStatus,
  onCopyLink,
  onDelete
}) => {
  const formatDate = (date: any): string => {
    if (!date) return "N/A";
    
    if (date && typeof date.toDate === 'function') {
      return new Date(date.toDate()).toLocaleString('vi-VN');
    }
    
    if (date instanceof Date) {
      return new Date(date).toLocaleString('vi-VN');
    }
    
    return "N/A";
  };

  return (
    <tr className="hover:bg-gray-50">
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
        {formatDate(session.created_at)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleStatus(session)}
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
            onClick={() => onCopyLink(session.id)}
            className="p-1.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="Sao chép liên kết"
          >
            <FaLink />
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200"
            title="Xóa phiên thi"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

