import React, { useEffect } from "react";
import { Stater } from "../../services/firebaseConfig";

const Navbar = () => {
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
      <div className="Nav faintShadow">
        <ul className="navUl hidden md:flex">
          <li className="NavLink">
            <a href="/">Trang chủ</a>
          </li>
          <li className="NavLink logged">
            <a href="/FormMaker">Tạo bài thi mới</a>
          </li>
          <li className="NavLink logged">
            <a href="/pinverify">Tham gia bài thi</a>
          </li>
          <li className="NavLink logged">
            <a href="/Main">Tạo và tham gia trò chơi</a>
          </li>
          <li className="sign" onClick={() => window.location.href = "/Login"}></li>
        </ul>
        <ul className="md:hidden">
          <li className="NavLink">
            <a href="/">Trang chủ</a>
          </li>
        </ul>
        
        <select
          className="profile logged"
          value="DEFAULT"
          readOnly
          onChange={(change) =>
            selectOptionClickHandler(change.currentTarget.selectedIndex)
          }
        >
          <option
            className="logOptions"
            id="displayName"
            value="DEFAULT"
          ></option>
          <option
            className="logOptions"
            id="previousExams"
            value="previousExams"
            onClick={() => (window.location = `/ExamsAttempted`)}
          >
            Bài thi đã tham gia
          </option>
          <option
            className="logOptions"
            id="conductedExams"
            value="conductedExams"
            onClick={() => (window.location = `/ExamsCreated`)}
          >
            Bài thi đã tạo
          </option>
          <option
            className="logOptions"
            id="select"
            value="Logout"
            onClick={() => funct.signOutWithGoogle()}
          >
            Đăng xuất
          </option>
        </select>
      </div>
    </>
  );
};

export default Navbar;
