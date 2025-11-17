import React from 'react';
import type { StudentInfo } from './types';

interface StudentInfoCardProps {
  studentInfo: StudentInfo | null;
  score: string;
  submittedAt?: any;
  attemptNumber?: number;
}

const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ 
  studentInfo, 
  score, 
  submittedAt,
  attemptNumber 
}) => {
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const determineUserType = (): string => {
    if (!studentInfo) return 'Unknown';
    
    if (studentInfo.email && studentInfo.email.startsWith('guest_')) {
      return 'Khách';
    }
    
    return 'Đã đăng ký';
  };

  if (!studentInfo) return null;

  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Thông tin học sinh</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Họ và tên:</p>
          <p className="font-medium text-sm sm:text-base">{studentInfo.name || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Lớp:</p>
          <p className="font-medium text-sm sm:text-base">{studentInfo.class || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Trường:</p>
          <p className="font-medium text-sm sm:text-base">{studentInfo.school || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Loại tài khoản:</p>
          <p className="font-medium">
            <span className={`px-2 py-1 rounded text-xs ${
              determineUserType() === 'Khách' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {determineUserType()}
            </span>
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Thời gian nộp bài:</p>
          <p className="font-medium text-sm sm:text-base">{formatDate(submittedAt)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Lần thi số:</p>
          <p className="font-medium text-sm sm:text-base">#{attemptNumber || 1}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;




