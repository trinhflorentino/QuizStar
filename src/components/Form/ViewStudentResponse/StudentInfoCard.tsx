import React from 'react';

interface StudentInfo {
  name?: string;
  class?: string;
  school?: string;
  email?: string;
  [key: string]: any;
}

interface StudentInfoCardProps {
  studentInfo: StudentInfo;
  score: string;
}

const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ studentInfo, score }) => {
  const determineUserType = (): string => {
    if (!studentInfo) return 'Unknown';
    
    if (studentInfo.email && studentInfo.email.startsWith('guest_')) {
      return 'Khách';
    }
    
    return 'Đã đăng ký';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Thông tin học sinh</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600">Họ và tên:</p>
          <p className="font-medium">{studentInfo.name || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600">Lớp:</p>
          <p className="font-medium">{studentInfo.class || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600">Trường:</p>
          <p className="font-medium">{studentInfo.school || "—"}</p>
        </div>
        <div>
          <p className="text-gray-600">Email/ID:</p>
          <p className="font-medium text-gray-800" title={studentInfo.email}>
            {studentInfo.email && studentInfo.email.startsWith('guest_')
              ? studentInfo.email.substring(0, 12) + '...'
              : studentInfo.email || "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Loại tài khoản:</p>
          <span className={`inline-block px-2 py-1 rounded text-xs ${
            determineUserType() === 'Khách' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {determineUserType()}
          </span>
        </div>
        <div>
          <p className="text-gray-600">Điểm số:</p>
          <p className="font-bold text-blue-600">{score}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;




