import { useState } from "react";
import React from 'react';

function PinVerify() {
  const [pin, setPin] = useState(() => 0);

  function numHandler(event) {
    let pattern = /[^0-9]/;
    if (event.key.match(pattern) || event.target.value.length >= 6) {
      event.preventDefault();
    }
  }

  function routeChange() {
    pin.length === 6
      ? (window.location.href += `/Form/${pin}`)
      : alert("Vui lòng nhập mã bài thi gồm 6 ký tự");
  }

  function pinChangeHandler(event) {
    setPin(event.target.value);
  }

  return (
    <div id="mainForm">
      <div className="quizBox">
        <input
          type="number"
          className="faintShadow"
          name="pinCheck"
          id="pinCheck"
          placeholder="Nhập mã bài thi"
          onKeyPress={(event) => numHandler(event)}
          onChange={(event) => pinChangeHandler(event)}
        />
      </div>
      <div className="sub_btn">
        <input
          className="sub_btn_actual faintShadow hov"
          type="button"
          value="Tham gia"
          onClick={() => routeChange()}
        />
      </div>
    </div>
  );
}

export default PinVerify;
