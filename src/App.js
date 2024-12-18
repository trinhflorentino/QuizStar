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

  return (
    <div className="App">
      <BrowserRouter>
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
            path="/ExamsCreated/DisplayResponses/:pin"
            element={<DisplayResponses />}
          ></Route>
          <Route path="/Main" element={<LegacyRedirect />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Math" element={<MathConfig />} />
        </Routes>
      </BrowserRouter>
    </div>
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
