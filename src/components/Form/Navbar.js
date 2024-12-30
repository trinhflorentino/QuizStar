import React, { useEffect, useState, useRef } from "react";
import { Stater } from "../../services/firebaseConfig";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
const Logo = require("../../images/Logo.jpg");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const funct = new Stater();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectOptionClickHandler(index) {
    switch (index) {
      case 1:
        navigate('/ExamsAttempted');
        break;
      case 2:
        navigate('/ExamsCreated');
        break;
      case 3:
        funct.signOutWithGoogle();
        break;
    }
  }

  useEffect(() => {
    activeHighlighter();
  }, [location.pathname]);

  function activeHighlighter() {
    let links = document.querySelectorAll(".NavLink > a");
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === location.pathname) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  const handleNavigation = (path) => {
    setIsOpen(false); // Close sidebar
    navigate(path);
  };

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
                <NavLink 
                  to="/"
                  className={({ isActive }) => 
                    isActive 
                      ? "inline-block px-4 py-2 cursor-pointer text-blue-600 border-b-2 border-blue-600"
                      : "inline-block px-4 py-2 cursor-pointer hover:text-blue-600"
                  }
                >
                  Trang chủ
                </NavLink>
              </li>
              <li className="NavLink logged">
                <NavLink 
                  to="/FormMaker"
                  className={({ isActive }) => 
                    isActive 
                      ? "inline-block px-4 py-2 cursor-pointer text-blue-600 border-b-2 border-blue-600"
                      : "inline-block px-4 py-2 cursor-pointer hover:text-blue-600"
                  }
                >
                  Tạo bài thi mới
                </NavLink>
              </li>
              <li className="NavLink logged">
                <NavLink 
                  to="/pinverify"
                  className={({ isActive }) => 
                    isActive 
                      ? "inline-block px-4 py-2 cursor-pointer text-blue-600 border-b-2 border-blue-600"
                      : "inline-block px-4 py-2 cursor-pointer hover:text-blue-600"
                  }
                >
                  Tham gia bài thi
                </NavLink>
              </li>
              <li className="NavLink logged">
                <NavLink 
                  to="/Main"
                  className={({ isActive }) => 
                    isActive 
                      ? "inline-block px-4 py-2 cursor-pointer text-blue-600 border-b-2 border-blue-600"
                      : "inline-block px-4 py-2 cursor-pointer hover:text-blue-600"
                  }
                >
                  Tạo và tham gia trò chơi
                </NavLink>
              </li>
            </ul>
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div className="sign" style={{display: "none"}}>
                <button 
                  className="px-4 py-2 text-black hover:bg-blue-50"
                  onClick={() => navigate('/Login')}
                >
                  Đăng nhập
                </button>
              </div>
              <div className="logged">
                <button 
                  className="flex items-center space-x-3 focus:outline-none"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <img
                    id="profileAvatar"
                    className="h-8 w-8 rounded-full"
                    src={require("../../images/profile.jpg")}
                    alt="Profile"
                  />
                  <span id="displayName" className="text-black"></span>
                  <svg className={`w-5 h-5 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => { navigate('/Profile'); setIsProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CgProfile className="inline mr-1"/> Chỉnh sửa thông tin 
                    </button>
                    {/* <button
                      onClick={() => { navigate('/ExamsCreated'); setIsProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Bài thi đã tạo
                    </button> */}
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => { funct.signOutWithGoogle(); setIsProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <TbLogout className="inline mr-1"/> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>

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
                  <a onClick={() => handleNavigation('/')} className="block px-4 py-2 rounded-md hover:bg-gray-100">Trang chủ</a>
                </li>
                <li className="NavLink logged">
                  <a onClick={() => handleNavigation('/FormMaker')} className="block px-4 py-2 rounded-md hover:bg-gray-100">Tạo bài thi mới</a>
                </li>
                <li className="NavLink logged">
                  <a onClick={() => handleNavigation('/pinverify')} className="block px-4 py-2 rounded-md hover:bg-gray-100">Tham gia bài thi</a>
                </li>
                <li className="NavLink logged">
                  <a onClick={() => handleNavigation('/Main')} className="block px-4 py-2 rounded-md hover:bg-gray-100">Tạo và tham gia trò chơi</a>
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
