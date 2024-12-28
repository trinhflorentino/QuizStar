import React, { useEffect, useState } from "react";
import { Stater } from "../../services/firebaseConfig";
const Logo = require("../../images/Logo.jpg");
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const funct = new Stater();

  function selectOptionClickHandler(index) {
    switch (index) {
      case 1:
        window.location = `/ExamsAttempted`;
        break;
      case 2:
        window.location = `/ExamsCreated`;
        break;
      case 3:
        funct.signOutWithGoogle();
        break;
    }
  }

  useEffect(() => {
    activeHighlighter();
  }, [document.URL]);

  function activeHighlighter() {
    let some = document.querySelectorAll(".NavLink > a");
    for (let i = 0; i < some.length; i++) {
      if (window.location.href === some[i].href) {
        some[i].classList.add("active");
      } else {
        some[i].classList.remove("active");
      }
    }
  }

  return (
    <>
      <div className="Nav sticky top-0 w-full shadow-md z-50">
        {/* Backdrop overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className="mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left section with menu button and logo */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 z-50"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {/* Logo and Product Name - Visible on mobile */}
              <div className="flex items-center lg:hidden">
                <img 
                  src={Logo}
                  alt="Logo" 
                  className="h-10 w-10"
                />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  QuizStar
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <ul className="navUl hidden lg:flex flex-1 items-center space-x-4">
              <li className="NavLink">
                <a href="/" className="inline-block px-4 py-2">Trang chủ</a>
              </li>
              <li className="NavLink logged">
                <a href="/FormMaker" className="inline-block px-4 py-2">Tạo bài thi mới</a>
              </li>
              <li className="NavLink logged">
                <a href="/pinverify" className="inline-block px-4 py-2">Tham gia bài thi</a>
              </li>
              <li className="NavLink logged">
                <a href="/Main" className="inline-block px-4 py-2">Tạo và tham gia trò chơi</a>
              </li>
              <li className="sign ml-auto"></li>
            </ul>

            {/* Profile Dropdown */}
            <select
              className="profile logged hidden lg:block bg-transparent border-none cursor-pointer"
              value="DEFAULT"
              readOnly
              onChange={(change) => selectOptionClickHandler(change.currentTarget.selectedIndex)}
            >
              <option className="logOptions" id="displayName" value="DEFAULT"></option>
              <option className="logOptions" id="previousExams" value="previousExams">
                Bài thi đã tham gia
              </option>
              <option className="logOptions" id="conductedExams" value="conductedExams">
                Bài thi đã tạo
              </option>
              <option className="logOptions" id="select" value="Logout">
                Đăng xuất
              </option>
            </select>
          </div>

          {/* Mobile Navigation - Left Sidebar */}
          <div 
            className={`fixed top-0 left-0 h-full w-65 bg-white transform transition-transform duration-300 ease-in-out lg:hidden z-50 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <img src={Logo} alt="Logo" className="h-8 w-8" />
                <span className="text-lg font-semibold">QuizStar</span>
              </div>
              <button 
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="px-2 py-4">
              <ul className="space-y-2">
                <li className="NavLink">
                  <a href="/" className="block px-4 py-2 rounded-md hover:bg-gray-100">Trang chủ</a>
                </li>
                <li className="NavLink logged">
                  <a href="/FormMaker" className="block px-4 py-2 rounded-md hover:bg-gray-100">Tạo bài thi mới</a>
                </li>
                <li className="NavLink logged">
                  <a href="/pinverify" className="block px-4 py-2 rounded-md hover:bg-gray-100">Tham gia bài thi</a>
                </li>
                <li className="NavLink logged">
                  <a href="/Main" className="block px-4 py-2 rounded-md hover:bg-gray-100">Tạo và tham gia trò chơi</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
