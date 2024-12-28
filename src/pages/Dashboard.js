import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Stater } from "../services/firebaseConfig";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { RiBookOpenLine, RiFileTextLine, RiGameLine } from "react-icons/ri";
// import { BiSolidGame } from "react-icons/bi";

function Dashboard() {
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

  const menuItems = [
    { title: "Đề thi", icon: RiFileTextLine, path: "/FormMaker" },
    { title: "Tham gia bài thi", icon: RiBookOpenLine, path: "/pinverify" },
    { title: "Tạo và tham gia trò chơi", icon: RiGameLine, path: "/Main" }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QuizStar</h1>
          <p className="text-gray-600">Nền tảng tạo và quản lý bài kiểm tra trực tuyến.</p>
        </div>
        {/* Main Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Các tính năng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 space-y-4"
              >
                <item.icon className="w-16 h-16 text-blue-600" />
                <span className="text-xl font-medium text-gray-800 text-center">
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
