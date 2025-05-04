import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const { success } = useNotification();

  // Hiển thị thông báo chào mừng khi người dùng đăng nhập thành công
  useEffect(() => {
    if (user) {
      success(`Chào mừng ${user.displayName || 'bạn'} đến với QuizStar!`);
    }
  }, [user, success]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý đề thi</h2>
          <p className="mb-4">Tạo và quản lý đề thi của bạn</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Xem đề thi
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tham gia thi</h2>
          <p className="mb-4">Tham gia các kỳ thi đang diễn ra</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Thi ngay
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tạo game</h2>
          <p className="mb-4">Tạo game trắc nghiệm tương tác</p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Tạo game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 