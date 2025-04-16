import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import Navbar from "./components/Form/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import { useState } from "react";

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
const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TestManagement = lazy(() => import("./pages/TestManagement"));
const Profile = lazy(() => import("./pages/Profile"));
const FormEdit = lazy(() => import("./components/Form/FormEdit"));
const QuestionDetails = lazy(() => import("./components/Form/QuestionDetails"));
const ExportExam = lazy(() => import("./components/Form/ExportExam"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        document.querySelector(".Nav").classList.add("whiteBg", "faintShadow");
      } else {
        document.querySelector(".Nav").classList.remove("whiteBg", "faintShadow");
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
          <Navbar />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About />} />
              <Route path="/pinverify" element={<PinVerify />} />
              <Route path="/pinverify/Form/:pin" element={<Form />} />
              <Route path="/FormMaker" element={<FormMaker />} />
              <Route path="/FormMaker/DisplayPin/:pin" element={<DisplayPin />} />
              <Route path="/pinverify/Form/:pin/ResultFetch/:email" element={<ResultFetch />} />
              <Route path="/ExamsCreated" element={<ExamsCreated />} />
              <Route path="/ExamsAttempted" element={<ExamsAttempted />} />
              <Route path="/ExamsCreated/ExamResults/:pin" element={<DisplayResponses />} />
              <Route path="/ExamsCreated/ExamResults/:pin/ViewStudentResponse/:email" element={<ViewStudentResponse />} />
              <Route path="/ExamsCreated/ExamResults/:pin/AnalyzeKnowledge" element={<h1>Tính năng này đang được phát triển...</h1>} />
              <Route path="/ExamsCreated/ExamResults/:pin/QuestionsDetail" element={<QuestionDetails />} />
              <Route path="/ExamsCreated/ExamResults/:pin/ExportExam" element={<ExportExam />} />
              <Route path="/Main" element={<LegacyRedirect />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="TestManagement" element={<TestManagement />} />
              <Route path="Profile" element={<Profile/>} />
              <Route path="FormEdit/:pin" element={<FormEdit />} />
              <Route path="/QuestionBank" element={<h1>Tính năng này đang được phát triển...</h1>} />
              <Route path="*" element={<h1>Oops :( Không tìm thấy trang.</h1>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </MathJaxContext>
  );
}

export default App;
