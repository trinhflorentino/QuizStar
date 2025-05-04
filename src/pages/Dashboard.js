import React from 'react';
import { useNavigate } from "react-router-dom";
import { RiBookOpenLine, RiFileTextLine, RiGameLine } from "react-icons/ri";
import { useAuth } from "../contexts/AuthContext";
// import { BiSolidGame } from "react-icons/bi";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const menuItems = [
    { title: "Quản lý đề thi", icon: RiFileTextLine, path: "/TestManagement" },
    { title: "Tham gia bài thi", icon: RiBookOpenLine, path: "/pinverify" },
    { title: "Tạo và tham gia trò chơi", icon: RiGameLine, path: "/Main" }
  ];

  const handleNavigate = (path) => {
    if (path === "/Main") {
      window.location.href = "/Main.html";
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-screen-xl mx-auto bg-gradient-to-br from-white/60 to-white/20 rounded-xl p-12 shadow-lg">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QuizStar</h1>
          <p className="text-gray-600">Nền tảng tạo và quản lý bài kiểm tra trực tuyến.</p>
          {currentUser && (
            <p className="mt-2 text-blue-600">Xin chào, {currentUser.displayName}!</p>
          )}
        </div>
        {/* Main Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Các tính năng chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 space-y-4"
              >
                <item.icon className="w-16 h-16 text-blue-600" />
                <span className="text-xl font-medium text-gray-800 text-center line-clamp-1">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
