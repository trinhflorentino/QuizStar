import React, { useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { error: showError, success: showSuccess } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setErrors({});
    
    // Validate form
    const newErrors = {};
    if (!email) newErrors.email = 'Vui lòng nhập email';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      await resetPassword(email);
      showSuccess('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn');
    } catch (error) {
      console.error('Gửi email khôi phục thất bại:', error);
      if (error.code === 'auth/user-not-found') {
        showError('Không tìm thấy tài khoản với email này');
      } else if (error.code === 'auth/invalid-email') {
        showError('Email không hợp lệ');
      } else {
        showError('Gửi email khôi phục thất bại. Vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Pane */}
      <div className="hidden lg:flex items-center justify-center flex-1 relative">
        <div className="w-full h-full">
          <img 
            src="/img/OlympusWallpaper.jpg" 
            alt="Mount Olympus" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 w-full p-12 bg-gradient-to-t from-black/75 to-transparent text-white">
            <p className="text-4xl lg:text-6xl font-bold">Núi Olympus</p>
            <p className="text-sm lg:text-lg mt-2">
              Núi Ólympos (/oʊˈlɪmpəs, əˈlɪm-/;[6] tiếng Hy Lạp: Όλυμπος, chuyển tự Ólympos, Ólimbos, 
              IPA: [ˈoli(m)bos]) hay núi Olympus hoặc Óros Ólimbos, còn gọi là Núi Ô Lim, là ngọn núi 
              cao nhất ở Hy Lạp. Trong thần thoại Hy Lạp, ngọn núi Ólympos là ngôi nhà của các vị thần 
              Hy Lạp, trên đỉnh Mytikas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Pane */}
      <div className="w-full bg-white lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-bold mb-6 text-black text-center">QuizStar</h1>
          <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">Quên mật khẩu</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 mt-1 p-2 w-full rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                {loading ? 'Đang gửi...' : 'Gửi Email khôi phục'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Bạn muốn đăng nhập? 
              <button 
                onClick={() => navigate('/Login')} 
                className="text-black hover:underline ml-1"
              >
                Đăng nhập tại đây
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 