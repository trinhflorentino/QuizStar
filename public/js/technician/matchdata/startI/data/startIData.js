auth.onAuthStateChanged(_0x1b0326 => {
    if (!_0x1b0326) {
      return;
    }
    const _0x387bf3 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x387bf3.onSnapshot(_0x17024f => {
      if (!_0x17024f.exists) {
        return;
      }
      const _0x53687b = _0x17024f.data().match;
      var _0x3f8b61;
      const _0x452c3f = realtimeDB.ref(_0x53687b + '/playerstatus/khoidong');
      _0x452c3f.on("value", _0x659c55 => {
        const _0x47a1b5 = _0x659c55.val();
        if (_0x47a1b5 && _0x47a1b5.player !== undefined) {
          const _0x4d56fa = _0x47a1b5.player;
          for (let _0x291421 = 0x1; _0x291421 <= 0x4; _0x291421++) {
            const _0x2b15fc = document.getElementById('StartIPackage' + _0x291421);
            if (_0x4d56fa === 0x0) {
              _0x2b15fc.classList.remove("bg-green-600", "text-white");
            } else if (_0x291421 === _0x4d56fa) {
              _0x2b15fc.classList.add("bg-green-600", "text-white");
            } else {
              _0x2b15fc.classList.remove("bg-green-600", 'text-white');
            }
          }
          if (window.currentStartIQuestionNumberRef) {
            window.currentStartIQuestionNumberRef.off();
          }
          if (window.currentStartIQuestionRef) {
            window.currentStartIQuestionRef.off();
          }
          if (window.currentStartIAnswerRef) {
            window.currentStartIAnswerRef.off();
          }
          const _0x5ba604 = realtimeDB.ref(_0x53687b + "/khoidong");
          window.currentStartIQuestionNumberRef = _0x5ba604;
          _0x5ba604.on("value", _0x1a4303 => {
            const _0x2c6a76 = _0x1a4303.val().causo;
            const _0x3d3e28 = realtimeDB.ref(_0x53687b + "/StartQuestion/Q" + _0x4d56fa + "DB/cau" + _0x2c6a76);
            const _0xa55069 = realtimeDB.ref(_0x53687b + "/StartQuestion/Q" + _0x4d56fa + "DB/dacau" + _0x2c6a76);
            window.currentStartIQuestionRef = _0x3d3e28;
            window.currentStartIAnswerRef = _0xa55069;
            if (_0x3f8b61) {
              clearInterval(_0x3f8b61);
            }
            document.getElementById("StartICountdown").textContent = '';
            _0x3d3e28.on('value', _0x1af395 => {
              const _0x487741 = _0x1af395.val();
              document.getElementById("StartIQuestion").textContent = _0x487741;
            });
            _0xa55069.on('value', _0x51d3bc => {
              const _0x1f0196 = _0x51d3bc.val();
              document.getElementById("StartIAnswer").textContent = _0x1f0196;
            });
          });
        }
      });
      const _0x4662b6 = realtimeDB.ref(_0x53687b + "/StartCountdown");
      _0x4662b6.on("value", _0x352410 => {
        const _0x31baf4 = _0x352410.val().countdown;
        if (_0x31baf4 == 0x1) {
          var _0x466acc = 0x5;
          document.getElementById("StartICountdown").textContent = _0x466acc;
          _0x3f8b61 = setInterval(function () {
            _0x466acc--;
            document.getElementById('StartICountdown').textContent = _0x466acc;
            if (_0x466acc <= 0x0) {
              clearInterval(_0x3f8b61);
              document.getElementById("StartICountdown").textContent = '';
            }
          }, 0x3e8);
        }
      });
    });
  });