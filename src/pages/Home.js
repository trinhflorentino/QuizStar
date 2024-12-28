import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Stater } from "../services/firebaseConfig";
import React from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(false);
  const funct = new Stater();
  const navigate = useNavigate();

  useEffect(() => {
    getAuth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, []);

  useEffect(() => {}, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4 bg-gradient-to-br from-[#F6F8FC] to-[#E9F0F9] rounded-2xl">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-8 p-3">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-[#1A2B3B] font-['Catamaran'] tracking-tight">
              QuizStar
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-xl leading-relaxed">
              Nền tảng hỗ trợ kiểm tra và tổ chức trò chơi học tập cho giáo viên và học sinh.
            </p>
          </div>
          
          <p className="text-lg text-gray-500 max-w-xl">
            {user === true
              ? "Tạo đề thi của bạn bằng cách bấm nút tạo bài thi mới ngay bên dưới"
              : "Bắt đầu đăng nhập để khám phá"}
          </p>

          <button
            onClick={
              user === true
                ? () => navigate("/FormMaker")
                : () => funct.signInWithGoogle()
            }
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#1A2B3B] rounded-xl overflow-hidden transition-all duration-300 ease-out hover:bg-[#2C4159] hover:scale-105 transform"
          >
            <span className="relative">
              {user === true ? "Tạo bài thi mới" : "Đăng nhập"}
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
}

export default Home;
