import React from 'react';
import { FaSpinner } from "react-icons/fa";
import ResponseRow from './ResponseRow';
import type { Response } from './types';

interface ResponseTableProps {
  responses: Response[];
  loading: boolean;
  onViewDetail: (response: Response) => void;
}

const ResponseTable: React.FC<ResponseTableProps> = ({
  responses,
  loading,
  onViewDetail
}) => {
  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto" />
          <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Họ và tên
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email/ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lớp
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trường
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Điểm
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lần thử
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thời gian
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {responses.map((response, index) => (
          <ResponseRow
            key={response.id || index}
            response={response}
            onViewDetail={onViewDetail}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ResponseTable;




