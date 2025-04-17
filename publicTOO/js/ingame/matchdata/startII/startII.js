auth.onAuthStateChanged(_0x5a186b => {
    if (!_0x5a186b) {
      return;
    }
    const _0x4cf701 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x4cf701.onSnapshot(_0x347cc5 => {
      if (!_0x347cc5.exists) {
        return;
      }
      const _0x3aa17b = _0x347cc5.data().match;
      var _0x5b9d50 = realtimeDB.ref(_0x3aa17b + "/KDO22Turn");
      var _0x56566d = realtimeDB.ref(_0x3aa17b + "/phanthistatus/khoidongo22");
      var _0xb90671 = realtimeDB.ref(_0x3aa17b + "/StartIIBuzzer");
      var _0x52dcc2 = realtimeDB.ref(_0x3aa17b + '/KDO22Chuong/CorrectOrWrong');
      var _0x1c979e = realtimeDB.ref(_0x3aa17b + '/KDO22LuotThiStatus');
      var _0x1ec253 = realtimeDB.ref(_0x3aa17b + '/KDO223sCountdown');
      var _0x3fc422;
      const _0xd61121 = {
        'phase1': document.getElementById("audio_StartIIStartingTimes_Phase1"),
        'phase2': document.getElementById("audio_StartIIStartingTimes_Phase2"),
        'phase3': document.getElementById("audio_StartIIStartingTimes_Phase3"),
        'finish': document.getElementById('audio_StartingFinish')
      };
      let _0x4a56b2 = false;
      let _0x16e1cb = null;
      _0x56566d.on('value', _0x13a77c => {
        const _0x2de0ee = _0x13a77c.val()?.["batdau"];
        if (_0x2de0ee === 0x1) {
          const _0x1e08a0 = document.getElementById('audio_StartQuestionShow');
          const _0x203bc8 = document.getElementById("audio_StartStartQuestionShow");
          _0x1e08a0.currentTime = 0x0;
          _0x1e08a0?.["play"]();
          setTimeout(() => {
            _0x203bc8.currentTime = 0x0;
            _0x203bc8?.["play"]();
          }, 0xe10);
          Object.values(_0xd61121).forEach(_0x326160 => {
            if (_0x326160) {
              _0x326160.currentTime = 0x0;
            }
          });
        }
      });
      _0x5b9d50.on("value", _0x3872f1 => {
        const _0x45151f = _0x3872f1.val().turn;
        if (window.currentStartIIQuestionNumberRef) {
          window.currentStartIIQuestionNumberRef.off();
        }
        if (window.currentStartIIQuestionRef) {
          window.currentStartIIQuestionRef.off();
        }
        if (window.currentStartIIAnswerRef) {
          window.currentStartIIAnswerRef.off();
        }
        const _0x59e938 = realtimeDB.ref(_0x3aa17b + "/KDO22Causo");
        window.currentStartIIQuestionNumberRef = _0x59e938;
        _0x59e938.on('value', _0x140997 => {
          const _0x180c62 = _0x140997.val().causo;
          const _0x196efa = realtimeDB.ref(_0x3aa17b + '/KDO22Question/L' + _0x45151f + "/cau" + _0x180c62);
          const _0x12e656 = realtimeDB.ref(_0x3aa17b + "/KDO22Question/L" + _0x45151f + "/dacau" + _0x180c62);
          window.currentStartIIQuestionRef = _0x196efa;
          window.currentStartIIAnswerRef = _0x12e656;
          clearInterval(_0x3fc422);
          document.getElementById("StartIICountdown").textContent = '';
          _0x4a56b2 = false;
          document.getElementById("StartIIAnswerButton").disabled = false;
          document.getElementById("StartIIAnswerIcon").classList.remove("text-green-600");
          document.getElementById("StartIIAnswerIcon").classList.add("text-red-600");
          const _0xfb0190 = document.getElementById('StartIIWaiting');
          const _0x52a7de = document.getElementById("StartIIQuestionNumber");
          if (_0x180c62 === 0x0) {
            _0xfb0190.style.display = "flex";
            _0x52a7de.textContent = '';
            _0x4a56b2 = false;
            document.getElementById('StartIIAnswerIcon').classList.remove('text-green-600');
            document.getElementById("StartIIAnswerIcon").classList.add("text-red-600");
          } else {
            const _0x5b3b79 = {
              0x1: 0xc,
              0x2: 0x19,
              0x3: 0x23
            };
            if (_0x180c62 === 0xd && _0x45151f === 0x1 || _0x180c62 === 0x1a && _0x45151f === 0x2 || _0x180c62 === 0x24 && _0x45151f === 0x3) {
              _0x52a7de.textContent = "Đã hoàn thành lượt thi";
            } else if (_0x5b3b79[_0x45151f]) {
              _0x52a7de.textContent = _0x180c62 + '/' + _0x5b3b79[_0x45151f];
            }
            _0xfb0190.style.display = "none";
          }
          _0x196efa.on("value", _0x379682 => {
            const _0xeb5856 = _0x379682.val();
            document.getElementById('StartIIQuestion').textContent = _0xeb5856;
          });
          if (_0x180c62 > 0x0) {
            const _0x7ef4c2 = {
              0x1: 0xc,
              0x2: 0x19,
              0x3: 0x23
            };
            const _0x19922c = _0x7ef4c2[_0x45151f];
            const _0x452693 = Math.round(0.7272727272727273 * (_0x19922c - 0x1));
            let _0x2241af;
            if (_0x180c62 === _0x19922c) {
              _0x2241af = "phase3";
            } else if (_0x180c62 <= _0x452693) {
              _0x2241af = "phase1";
            } else {
              _0x2241af = "phase2";
            }
            if (_0x16e1cb !== _0x2241af) {
              Object.values(_0xd61121).forEach(_0x442c6c => {
                if (_0x442c6c) {
                  _0x442c6c.pause();
                  _0x442c6c.currentTime = 0x0;
                }
              });
              _0xd61121[_0x2241af]?.["play"]();
              _0x16e1cb = _0x2241af;
            }
          } else {
            Object.values(_0xd61121).forEach(_0x58e1a9 => {
              if (_0x58e1a9) {
                _0x58e1a9.pause();
                _0x58e1a9.currentTime = 0x0;
              }
            });
          }
        });
      });
      document.getElementById('StartIIAnswerButton').addEventListener('click', () => {
        if (!_0x4a56b2) {
          return;
        }
        _0xb90671.push({
          'id': localStorage.getItem('id'),
          'uid': auth.currentUser.uid,
          'buzzerTimestamp': firebase.database.ServerValue.TIMESTAMP
        });
      });
      const _0x1791de = document.getElementById("StartIIBackgroundAnimation");
      _0xb90671.on("value", _0x42698a => {
        if (!_0x42698a.exists()) {
          console.log("No buzzer entries yet");
          document.getElementById('StartIIPlayerName').textContent = '';
          _0x1791de.innerHTML = '';
          return;
        }
        let _0x5c12c2 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x3d88f8 = {};
        _0x42698a.forEach(_0x4024ff => {
          const _0x412e00 = _0x4024ff.val();
          console.log("Buzzer press:", {
            'id': _0x412e00.id,
            'timestamp': _0x412e00.buzzerTimestamp
          });
          if (!_0x3d88f8[_0x412e00.id] || _0x412e00.buzzerTimestamp < _0x3d88f8[_0x412e00.id]) {
            _0x3d88f8[_0x412e00.id] = _0x412e00.buzzerTimestamp;
          }
          if (_0x3d88f8[_0x412e00.id] < _0x5c12c2.timestamp) {
            _0x5c12c2 = {
              'timestamp': _0x3d88f8[_0x412e00.id],
              'id': _0x412e00.id
            };
          }
        });
        console.log("Fastest buzzer:", _0x5c12c2.id);
        console.log("Timestamp:", new Date(_0x5c12c2.timestamp));
        if (_0x5c12c2.id !== null) {
          const _0x153fd8 = realtimeDB.ref(_0x3aa17b + '/games/player' + _0x5c12c2.id);
          _0x153fd8.once("value", _0x687b75 => {
            const _0x503771 = _0x687b75.val().displayName;
            document.getElementById("StartIIPlayerName").textContent = _0x503771;
            _0x53a2c2();
          });
          document.getElementById("StartIIAnswerButton").disabled = true;
          document.getElementById("audio_StartIIAnswerGranted").play();
        }
      });
      function _0x53a2c2() {
        const _0x2d23c2 = document.documentElement.classList.contains("dark");
        const _0x233f21 = _0x2d23c2 ? "bg-blue-700" : "bg-blue-700";
        _0x1791de.innerHTML = '';
        const _0x1d5547 = document.createElement("div");
        _0x1d5547.className = "absolute w-4 h-4 rounded-full " + _0x233f21 + " opacity-50 animate-background-ripple";
        _0x1d5547.style.left = "50%";
        _0x1d5547.style.top = '50%';
        _0x1d5547.style.transform = "translate(-50%, -50%)";
        _0x1791de.appendChild(_0x1d5547);
        setTimeout(() => {
          _0x1d5547.remove();
        }, 0x258);
      }
      _0x52dcc2.on("value", _0x4efe26 => {
        const _0x1b721c = _0x4efe26.val()?.["correctorwrong"];
        if (_0x1b721c === 0x1) {
          document.getElementById("audio_StartingRightAnswer").currentTime = 0x0;
          document.getElementById("audio_StartingRightAnswer").play();
        } else if (_0x1b721c === 0x2) {
          document.getElementById('audio_StartingWrongAnswer').currentTime = 0x0;
          document.getElementById("audio_StartingWrongAnswer").play();
        }
      });
      _0x1c979e.on("value", _0x4fa3c9 => {
        const _0x41207f = _0x4fa3c9.val()?.["status"];
        if (_0x41207f === 0x0) {
          document.getElementById('audio_StartIIFinish').currentTime = 0x0;
          document.getElementById("audio_StartIIFinish").play();
        }
      });
      _0x1ec253.on('value', _0x5398f4 => {
        var _0x500b0a = _0x5398f4.val()?.["countdown"];
        if (_0x500b0a === 0x1) {
          _0x4a56b2 = false;
          document.getElementById("StartIIAnswerButton").disabled = false;
          let _0xab78d8 = 0x3;
          const _0x445e4e = setInterval(() => {
            document.getElementById("StartIICountdown").textContent = "00:0" + _0xab78d8;
            _0xab78d8--;
            if (_0xab78d8 < 0x0) {
              clearInterval(_0x445e4e);
              document.getElementById("StartIICountdown").textContent = '';
              _0x4a56b2 = true;
              document.getElementById("StartIIAnswerIcon").classList.remove("text-red-600");
              document.getElementById('StartIIAnswerIcon').classList.add('text-green-600');
              let _0x4ce104 = 0x5;
              _0x3fc422 = setInterval(() => {
                document.getElementById('StartIICountdown').textContent = "00:0" + _0x4ce104;
                _0x4ce104--;
                if (_0x4ce104 < 0x0) {
                  clearInterval(_0x3fc422);
                  document.getElementById("StartIICountdown").textContent = '';
                  _0x4a56b2 = false;
                  document.getElementById("StartIIAnswerButton").disabled = true;
                  document.getElementById("StartIIAnswerIcon").classList.remove("text-green-600");
                  document.getElementById("StartIIAnswerIcon").classList.add("text-red-600");
                }
              }, 0x3e8);
            }
          }, 0x3e8);
          document.getElementById("StartIIAnswerIcon").classList.remove("text-green-600");
          document.getElementById("StartIIAnswerIcon").classList.add("text-red-600");
        }
      });
    });
  });