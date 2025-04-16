import "./App.css";
import Form from "./components/Form/Form";
import FormMaker from "./components/Form/FormMaker";
import PinVerify from "./components/Form/PinVerify";
import Navbar from "./components/Form/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResultFetch from "./components/Form/ResultFetch";
import DisplayPin from "./components/Form/DisplayPin";
import ExamsCreated from "./components/Form/ExamsCreated";
import ExamsAttempted from "./components/Form/ExamsAttempted";
import DisplayResponses from "./components/Form/DisplayResponses";
import Home from "./pages/Home";
import About from "./pages/About";
import React from 'react';
import LegacyRedirect from "./components/LegacyRedirect";
import Login from "./components/Login";
import MathConfig from "./components/MathJaxTest";
import Dashboard from "./pages/Dashboard";
import TestManagement from "./pages/TestManagement";
import Profile from "./pages/Profile";
import FormEdit from "./components/Form/FormEdit";
import AnalyzeKnowledge from "./components/Form/analyze-knowledge/AnalyzeKnowledge";
import QuestionDetails from "./components/Form/QuestionDetails";
import ExportExam from "./components/Form/ExportExam";
import { useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";
// const NavigationWrapper = () => {
//   const navigate = useNavigate();
//   React.useEffect(() => {
//     const handleNavigation = (e) => {
//       e.preventDefault();
//       const target = e.target.closest('a');
//       if (target && target.href) {
//         const path = target.getAttribute('href');
//         if (path && !path.startsWith('http')) {
//           navigate(path);
//         }
//       }
//     };

//     document.addEventListener('click', handleNavigation);
//     return () => document.removeEventListener('click', handleNavigation);
//   }, [navigate]);

//   return null;
// };

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
        {/* <NavigationWrapper /> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/About" element={<About />}></Route>
          <Route path="/pinverify" element={<PinVerify />}></Route>
          <Route path="/pinverify/Form/:pin" element={<Form />}></Route>
          <Route path="/FormMaker" element={<FormMaker />}></Route>
          <Route
            path="/FormMaker/DisplayPin/:pin"
            element={<DisplayPin />}
          ></Route>
          <Route
            path="/pinverify/Form/:pin/ResultFetch/:email"
            element={<ResultFetch />}
          ></Route>
          <Route path="/ExamsCreated" element={<ExamsCreated />}></Route>
          <Route path="/ExamsAttempted" element={<ExamsAttempted />}></Route>
          <Route
            path="/ExamsCreated/ExamResults/:pin"
            element={<DisplayResponses />}
          ></Route>
          <Route path="/ExamsCreated/ExamResults/:pin/AnalyzeKnowledge" element={<h1>Tính năng này đang được phát triển...</h1> } />
          <Route path="/ExamsCreated/ExamResults/:pin/QuestionsDetail" element={<QuestionDetails />} />
          <Route path="/ExamsCreated/ExamResults/:pin/ExportExam" element={<ExportExam />} />
          <Route path="/Main" element={<LegacyRedirect />} />
          <Route path="/Login" element={<Login />} />
          {/* <Route path="/Math" element={<MathConfig />} /> */}
          <Route path="/Dashboard" element={<Dashboard />} />
          {/* <Route path="MatchList" element={<gg/> } /> */}
          <Route path="TestManagement" element={<TestManagement />} />
          <Route path="Profile" element={<Profile/>} />
          <Route path="FormEdit/:pin" element={<FormEdit />} />
          <Route path="/QuestionBank" element={<h1>Tính năng này đang được phát triển...</h1>} />
          <Route path="*" element={<h1>Oops :( Không tìm thấy trang.</h1>} /> 
        </Routes>
      </BrowserRouter>
    </div>
    </MathJaxContext>
  );
  // function App() {
    // return (
    //   <h1 className="text-3xl font-bold underline">
    //     Hello world!
    //   </h1>
    // )
  // }
  
}

export default App;
