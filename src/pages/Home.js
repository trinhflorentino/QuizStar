import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Stater } from "../services/firebaseConfig";
import React from 'react'

function Home() {
  const [user, setUser] = useState(false);
  const funct = new Stater();

  useEffect(() => {
    getAuth().onAuthStateChanged(function (user) {
      if (user) {
        // console.log(user);
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, []);

  useEffect(() => {}, [user]);

  return (
    <div className="mainForm heroBack faintShadow">
      <img
        className="hero"
        src={require("../images/Logo.jpg")}
        alt="Hero Image" 
      ></img>
      <div className="heroTextBox midShadow centeredP">
        <ul>
          <li>
            <h1 className="heroText">QuizStar</h1>
          </li>
          <li>
            <p className="sideKickText">
              Nền tảng hỗ trợ kiểm tra và tổ chức trò chơi học tập cho giáo viên và học sinh.
            </p>
          </li>
          <li>
            <p className="sideKickText">
              {user === true
                ? "Tạo đề thi của bạn bằng cách bấm nút tạo bài thi mới ngay bên dưới"
                : "Bắt đầu đăng nhập để khám phá"}
            </p>
          </li>
          <li>
            <input
              type="button"
              value={user === true ? "Tạo bài thi mới" : "Đăng nhập"}
              className="sub_btn_actual hov heroBtn"
              onClick={
                user === true
                  ? () => (window.location = "/FormMaker")
                  : () => funct.signInWithGoogle()
              }
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
