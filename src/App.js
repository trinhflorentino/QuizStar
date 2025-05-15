import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import Navbar from "./components/Form/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/Notification/NotificationContainer';

// Lazy load components
const Form = lazy(() => import("./components/Form/Form"));
const FormMaker = lazy(() => import("./components/Form/FormMaker"));
const PinVerify = lazy(() => import("./components/Form/PinVerify"));
const ResultFetch = lazy(() => import("./components/Form/ResultFetch"));
const DisplayPin = lazy(() => import("./components/Form/DisplayPin"));
const ExamsCreated = lazy(() => import("./components/Form/ExamsCreated"));
const ExamsAttempted = lazy(() => import("./components/Form/ExamsAttempted"));
const DisplayResponses = lazy(() => import("./components/Form/DisplayResponses"));
const ViewStudentResponse = lazy(() => import("./components/Form/ViewStudentResponse"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const LegacyRedirect = lazy(() => import("./components/LegacyRedirect"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TestManagement = lazy(() => import("./pages/TestManagement"));
const Profile = lazy(() => import("./pages/Profile"));
const FormEdit = lazy(() => import("./components/Form/FormEdit"));
const QuestionDetails = lazy(() => import("./components/Form/QuestionDetails"));
const ExportExam = lazy(() => import("./components/Form/ExportExam"));
const ExamLibrary = lazy(() => import("./pages/ExamLibrary"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Navigation wrapper component
const NavigationWrapper = ({ children }) => {
  const location = useLocation();
  const hideNavbar = ['/Login', '/Register', '/ForgotPassword'].includes(location.pathname);
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  React.useEffect(() => {
    const handleScroll = () => {
      const navElement = document.querySelector(".Nav");
      if (navElement) {
        if (window.scrollY > 20) {
          navElement.classList.add("whiteBg", "faintShadow");
        } else {
          navElement.classList.remove("whiteBg", "faintShadow");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const config = {
    loader: { 
      load: ["[tex]/html", "[tex]/mhchem"] 
    },
    tex: {
      packages: { "[+]": ["html", "mhchem"] },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ]
    }
  };  
  
  const [mathJaxReady, setMathJaxReady] = useState(false);

  return (
    <AuthProvider>
      <NotificationProvider>
        <MathJaxContext
          version={3}
          config={config}
          onLoad={() => {
            console.log("MathJax is loaded and ready!");
            setMathJaxReady(true);
          }}
          onError={(error) => {
            console.error("MathJax Load Error:", error);
          }}
        >
          <div className="App">
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/Login" element={<Login />} />
                  <Route path="/Register" element={<Register />} />
                  <Route path="/ForgotPassword" element={<ForgotPassword />} />
                  
                  <Route
                    path="*"
                    element={
                      <NavigationWrapper>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/About" element={<About />} />
                          <Route path="/pinverify" element={<PinVerify />} />
                          {/* <Route path="/ExamAccess" element={<PinVerify />} /> */}
                          <Route path="/pinverify/Form/:pin" element={<Form />} />
                          
                          {/* Protected Routes */}
                          <Route path="/FormMaker" element={<ProtectedRoute><FormMaker /></ProtectedRoute>} />
                          <Route path="/FormMaker/DisplayPin/:pin" element={<ProtectedRoute><DisplayPin /></ProtectedRoute>} />
                          <Route path="/pinverify/Form/:pin/ResultFetch/:studentEmail" element={<ResultFetch />} />
                          <Route path="/pinverify/Form/:pin/ResultFetch/:studentEmail/:attemptId" element={<ResultFetch />} />
                          <Route path="/ExamsCreated" element={<ProtectedRoute><ExamsCreated /></ProtectedRoute>} />
                          <Route path="/ExamsAttempted" element={<ProtectedRoute><ExamsAttempted /></ProtectedRoute>} />
                          <Route path="/ExamsCreated/ExamResults/:pin" element={<ProtectedRoute><DisplayResponses /></ProtectedRoute>} />
                          <Route path="/ExamsCreated/ExamResults/:pin/ViewStudentResponse/:studentEmail" element={<ProtectedRoute><ViewStudentResponse /></ProtectedRoute>} />
                          <Route path="/ExamsCreated/ExamResults/:pin/ViewStudentResponse/:studentEmail/:attemptId" element={<ProtectedRoute><ViewStudentResponse /></ProtectedRoute>} />
                          <Route path="/ExamsCreated/ExamResults/:pin/AnalyzeKnowledge" element={<ProtectedRoute><h1>Tính năng này đang được phát triển...</h1></ProtectedRoute>} />
                          <Route path="/ExamsCreated/ExamResults/:pin/QuestionsDetail" element={<ProtectedRoute><QuestionDetails /></ProtectedRoute>} />
                          <Route path="/ExamsCreated/ExamResults/:pin/ExportExam" element={<ProtectedRoute><ExportExam /></ProtectedRoute>} />
                          <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/TestManagement" element={<ProtectedRoute><TestManagement /></ProtectedRoute>} />
                          <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                          <Route path="/FormEdit/:pin" element={<ProtectedRoute><FormEdit /></ProtectedRoute>} />
                          <Route path="/QuestionBank" element={<ProtectedRoute><h1>Tính năng này đang được phát triển...</h1></ProtectedRoute>} />
                          <Route path="/ExamLibrary" element={<ProtectedRoute><ExamLibrary /></ProtectedRoute>} />
                          
                          <Route path="/Main" element={<LegacyRedirect />} />
                          <Route path="*" element={<h1>Oops :( Không tìm thấy trang.</h1>} />
                        </Routes>
                      </NavigationWrapper>
                    }
                  />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <NotificationContainer />
          </div>
        </MathJaxContext>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
