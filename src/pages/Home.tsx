import { getAuth, type User } from "firebase/auth";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Home: FC = () => {
  const [user, setUser] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((currentUser: User | null) => {
      setUser(Boolean(currentUser));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center lg:gap-12 p-4 bg-gradient-to-br from-white/60 to-white/20 rounded-2xl">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-8 p-3">
          <div className="space-y-4">
            <div className="text-5xl md:text-7xl font-black text-[#1A2B3B] font-['Catamaran'] tracking-tight">
              QuizStar 
            </div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-xl leading-relaxed">
              Nền tảng hỗ trợ kiểm tra và tổ chức trò chơi học tập cho giáo viên và học sinh.
            </p>
          </div>
          
          <p className="text-lg text-gray-500 max-w-xl">
            {user === true
              ? "Tạo đề thi của bạn và trò chơi bằng cách bấm nút ngay bên dưới!"
              : "Bắt đầu đăng nhập để khám phá"}
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={
                user === true
                  ? () => navigate("/Dashboard")
                  : () => navigate("/Login")
              }
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#1A2B3B] rounded-xl overflow-hidden transition-all duration-300 ease-out hover:bg-[#2C4159] hover:scale-105 transform"
            >
              <span className="relative">
                {user === true ? "Khám phá ngay" : "Đăng nhập"}
              </span>
              <svg
                className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            <button
              onClick={() => navigate("/pinverify")}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-[#1A2B3B] bg-white border-2 border-[#1A2B3B] rounded-xl overflow-hidden transition-all duration-300 ease-out hover:bg-gray-100 hover:scale-105 transform"
            >
              <span className="relative">
                Tham gia bài thi
              </span>
              <svg
                className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-[2rem] blur-3xl transform rotate-6" />
          {/* <div className="relative bg-white p-4 rounded-[2rem] shadow-xl"> */}
            <img
              className="w-full h-auto rounded-[1.5rem] transform transition-transform hover:scale-[1.02] p-10"
              src={require("../images/Logo.jpg")}
              alt="Hero Image"
            />
            {/* <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg">
              Bắt đầu ngay!
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
