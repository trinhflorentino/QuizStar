import React from 'react';
import type { Response } from './types';

interface ResponseRowProps {
  response: Response;
  onViewDetail: (response: Response) => void;
}

const ResponseRow: React.FC<ResponseRowProps> = ({ response, onViewDetail }) => {
  const formatEmail = (email: string): React.ReactNode => {
    if (email && email.startsWith('guest_') && email.length > 15) {
      return (
        <span title={email}>{email.substring(0, 12)}...</span>
      );
    }
    return email;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          className: 'bg-green-100 text-green-800',
          text: 'Hoàn thành'
        };
      case 'in_progress':
        return {
          className: 'bg-yellow-100 text-yellow-800',
          text: 'Đang làm'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800',
          text: 'Chưa xác định'
        };
    }
  };

  const statusBadge = getStatusBadge(response.status);

  return (
    <tr className="hover:bg-gray-50">
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
          {response.school || "—"}
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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
          {statusBadge.text}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{response.createDate}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onViewDetail(response)}
          className="text-blue-600 hover:text-blue-900"
        >
          Xem chi tiết
        </button>
      </td>
    </tr>
  );
};

export default ResponseRow;




