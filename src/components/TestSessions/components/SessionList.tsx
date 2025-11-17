import React from 'react';
import { TestSession } from '../types';
import { SessionItem } from './SessionItem';

interface SessionListProps {
  sessions: TestSession[];
  onToggleStatus: (session: TestSession) => void;
  onCopyLink: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onToggleStatus,
  onCopyLink,
  onDelete
}) => {
  if (sessions.length === 0) {
    return (
      <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-center border border-blue-100">
        <p>Chưa có phiên thi nào cho đề thi này.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã phiên
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên phiên thi
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian (phút)
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              onToggleStatus={onToggleStatus}
              onCopyLink={onCopyLink}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

