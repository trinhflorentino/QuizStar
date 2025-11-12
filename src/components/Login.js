import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, signIn } = useAuth();
  const { error: showError, success: showSuccess } = useNotification();

  useEffect(() => {
    // Check if user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate('/Dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset validation state
    setError('');
    setErrors({});
    
    // Validate form
    const newErrors = {};
    if (!email) newErrors.email = 'Vui lòng nhập email';
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
      showSuccess('Đăng nhập thành công');
      navigate('/Dashboard');
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      if (error.code === 'auth/invalid-credential') {
        showError('Email hoặc mật khẩu không chính xác');
      } else if (error.code === 'auth/user-not-found') {
        showError('Không tìm thấy tài khoản với email này');
      } else if (error.code === 'auth/wrong-password') {
        showError('Mật khẩu không chính xác');
      } else if (error.code === 'auth/too-many-requests') {
        showError('Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau');
      } else {
        showError('Đăng nhập thất bại. Vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setDefaultLanguage('vi');

    try {
      await signInWithPopup(auth, provider);
      navigate('/Dashboard');
    } catch (error) {
      setError(`Đăng nhập bằng Google thất bại: ${error.message}`);
      console.error('Error signing in with Google:', error);
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
          <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">Đăng nhập một cách nhanh chóng với</h1>
          
          <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full lg:w-full mb-2 lg:mb-0">
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4" id="google">
                  <path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path>
                  <path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path>
                  <path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path>
                  <path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path>
                </svg> 
                Google
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>hoặc bằng Email</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 mt-1 p-2 w-full rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
          
          <button
            onClick={() => navigate('/Register')}
            className="w-full bg-blue-700 text-white p-2 rounded-md hover:bg-blue-900 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 mt-2"
          >
            Đăng ký tài khoản mới
          </button>
          
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Quên mật khẩu? 
              <button 
                onClick={() => navigate('/ForgotPassword')} 
                className="text-black hover:underline ml-1"
              >
                Tìm mật khẩu tại đây
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;