auth.onAuthStateChanged(_0x4d4ad6 => {
    if (!_0x4d4ad6) {
      return;
    }
    const _0x2fc62f = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x2fc62f.onSnapshot(_0xe38bb7 => {
      if (!_0xe38bb7.exists) {
        return;
      }
      const _0x20fbe3 = _0xe38bb7.data().match;
      var _0x305e32 = realtimeDB.ref(_0x20fbe3 + "/KDO22Turn");
      var _0x1dbfc5 = realtimeDB.ref(_0x20fbe3 + "/phanthistatus/khoidongo22");
      var _0x87a406 = realtimeDB.ref(_0x20fbe3 + "/StartIIBuzzer");
      var _0x51a33b = realtimeDB.ref(_0x20fbe3 + "/KDO22Chuong/CorrectOrWrong");
      var _0x31359b = realtimeDB.ref(_0x20fbe3 + "/KDO22LuotThiStatus");
      var _0xdbfffa = realtimeDB.ref(_0x20fbe3 + "/KDO223sCountdown");
      var _0x4bdac7;
      var _0x51c93c;
      const _0x2fa4c8 = {
        'phase1': document.getElementById("audio_StartIIStartingTimes_Phase1"),
        'phase2': document.getElementById("audio_StartIIStartingTimes_Phase2"),
        'phase3': document.getElementById("audio_StartIIStartingTimes_Phase3"),
        'finish': document.getElementById("audio_StartingFinish")
      };
      let _0x2a4c75 = null;
      _0x1dbfc5.on('value', _0x52a799 => {
        const _0x459f05 = _0x52a799.val()?.["batdau"];
        if (_0x459f05 === 0x1) {
          const _0x1dcc13 = document.getElementById("audio_StartQuestionShow");
          const _0x1db45c = document.getElementById('audio_StartStartQuestionShow');
          _0x1dcc13.currentTime = 0x0;
          _0x1dcc13?.['play']();
          setTimeout(() => {
            _0x1db45c.currentTime = 0x0;
            _0x1db45c?.["play"]();
            document.getElementById("StartII").classList.remove("hidden");
          }, 0xe10);
          Object.values(_0x2fa4c8).forEach(_0xcc970f => {
            if (_0xcc970f) {
              _0xcc970f.currentTime = 0x0;
            }
          });
        }
      });
      _0x305e32.on("value", _0x153763 => {
        const _0x3952ad = _0x153763.val().turn;
        if (window.currentStartIIQuestionNumberRef) {
          window.currentStartIIQuestionNumberRef.off();
        }
        if (window.currentStartIIQuestionRef) {
          window.currentStartIIQuestionRef.off();
        }
        if (window.currentStartIIAnswerRef) {
          window.currentStartIIAnswerRef.off();
        }
        const _0x3b634b = realtimeDB.ref(_0x20fbe3 + '/KDO22Causo');
        window.currentStartIIQuestionNumberRef = _0x3b634b;
        _0x3b634b.on("value", _0x2ab01a => {
          const _0x21cb40 = _0x2ab01a.val().causo;
          const _0x40a2a5 = realtimeDB.ref(_0x20fbe3 + "/KDO22Question/L" + _0x3952ad + "/cau" + _0x21cb40);
          const _0x488b25 = realtimeDB.ref(_0x20fbe3 + '/KDO22Question/L' + _0x3952ad + "/dacau" + _0x21cb40);
          window.currentStartIIQuestionRef = _0x40a2a5;
          window.currentStartIIAnswerRef = _0x488b25;
          clearInterval(_0x4bdac7);
          clearInterval(_0x51c93c);
          document.getElementById("StartIICountdown").textContent = '';
          const _0x422dca = document.getElementById("StartIIQuestionNumber");
          if (_0x21cb40 === 0x0) {
            _0x422dca.textContent = "Đang chờ phần thi";
          } else {
            const _0x17af34 = {
              0x1: 0xc,
              0x2: 0x19,
              0x3: 0x23
            };
            if (_0x21cb40 === 0xd && _0x3952ad === 0x1 || _0x21cb40 === 0x1a && _0x3952ad === 0x2 || _0x21cb40 === 0x24 && _0x3952ad === 0x3) {
              _0x422dca.textContent = "Đã hoàn thành lượt thi";
            } else if (_0x17af34[_0x3952ad]) {
              _0x422dca.textContent = "Câu " + _0x21cb40 + '/' + _0x17af34[_0x3952ad];
            }
          }
          _0x40a2a5.on("value", _0x24001b => {
            const _0x262cdc = _0x24001b.val();
            document.getElementById("StartIIQuestion").textContent = _0x262cdc;
          });
          if (_0x21cb40 > 0x0) {
            const _0x1987b5 = {
              0x1: 0xc,
              0x2: 0x19,
              0x3: 0x23
            };
            const _0x2e8491 = _0x1987b5[_0x3952ad];
            const _0xffe4dd = Math.round(0.7272727272727273 * (_0x2e8491 - 0x1));
            let _0x42f7b0;
            if (_0x21cb40 === _0x2e8491) {
              _0x42f7b0 = "phase3";
            } else if (_0x21cb40 <= _0xffe4dd) {
              _0x42f7b0 = 'phase1';
            } else {
              _0x42f7b0 = "phase2";
            }
            if (_0x2a4c75 !== _0x42f7b0) {
              Object.values(_0x2fa4c8).forEach(_0x4f600f => {
                if (_0x4f600f) {
                  _0x4f600f.pause();
                  _0x4f600f.currentTime = 0x0;
                }
              });
              _0x2fa4c8[_0x42f7b0]?.["play"]();
              _0x2a4c75 = _0x42f7b0;
            }
          } else {
            Object.values(_0x2fa4c8).forEach(_0x1f143d => {
              if (_0x1f143d) {
                _0x1f143d.pause();
                _0x1f143d.currentTime = 0x0;
              }
            });
          }
        });
      });
      _0x87a406.on("value", _0x47674e => {
        if (!_0x47674e.exists()) {
          console.log("No buzzer entries yet");
          const _0x5d24d8 = document.getElementById("startIIPlayerContainer");
          Array.from(_0x5d24d8.children).forEach(_0x549c33 => {
            // _0x549c33.classList.remove("bg-defaultColor", "text-white");
            // _0x549c33.classList.add("bg-white", "text-defaultColor");
            _0x549c33.classList.remove("bg-white");
            _0x549c33.classList.add("bg-no-repeat", "bg-cover", "text-white");
            _0x549c33.style.backgroundImage = "url('/img/Olympia_22_KĐ_contestantbar.svg')";
          });
          return;
        }
        let _0x5270a4 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x27e731 = {};
        _0x47674e.forEach(_0x373075 => {
          const _0x3b8215 = _0x373075.val();
          console.log("Buzzer press:", {
            'id': _0x3b8215.id,
            'timestamp': _0x3b8215.buzzerTimestamp
          });
          if (!_0x27e731[_0x3b8215.id] || _0x3b8215.buzzerTimestamp < _0x27e731[_0x3b8215.id]) {
            _0x27e731[_0x3b8215.id] = _0x3b8215.buzzerTimestamp;
          }
          if (_0x27e731[_0x3b8215.id] < _0x5270a4.timestamp) {
            _0x5270a4 = {
              'timestamp': _0x27e731[_0x3b8215.id],
              'id': _0x3b8215.id
            };
          }
        });
        console.log("Fastest buzzer:", _0x5270a4.id);
        console.log("Timestamp:", new Date(_0x5270a4.timestamp));
        if (_0x5270a4.id !== null) {
          const _0x1e71bb = document.getElementById('startIIPlayerContainer');
          if (_0x1e71bb) {
            const _0x275c69 = parseInt(_0x5270a4.id, 0xa) - 0x1;
            if (_0x275c69 >= 0x0 && _0x275c69 < _0x1e71bb.children.length) {
              Array.from(_0x1e71bb.children).forEach((_0x3de13e, _0x3422f1) => {
                if (_0x3422f1 === _0x275c69) {
                  _0x3de13e.classList.remove("bg-white");
                  _0x3de13e.classList.add('text-white');
                  _0x3de13e.classList.add("bg-no-repeat", "bg-cover");
                  _0x3de13e.style.backgroundImage = "url('/img/Olympia_22_KĐ_contestantbar_buzzer.svg')";
                } else {
                  _0x3de13e.classList.add("bg-no-repeat", "bg-cover", "text-white");
                  _0x3de13e.style.backgroundImage = "url('/img/Olympia_22_KĐ_contestantbar.svg')";
                  _0x3de13e.classList.remove("bg-white");
                  // _0x3de13e.classList.add("bg-white", "text-defaultColor");
                }
              });
            }
          }
          document.getElementById("audio_StartIIAnswerGranted").play();
        }
      });
      _0x51a33b.on('value', _0x58e8ee => {
        const _0x16e946 = _0x58e8ee.val()?.["correctorwrong"];
        if (_0x16e946 === 0x1) {
          document.getElementById('audio_StartingRightAnswer').currentTime = 0x0;
          document.getElementById("audio_StartingRightAnswer").play();
        } else if (_0x16e946 === 0x2) {
          document.getElementById('audio_StartingWrongAnswer').currentTime = 0x0;
          document.getElementById('audio_StartingWrongAnswer').play();
        }
      });
      _0x31359b.on("value", _0x3c7def => {
        const _0x5ab209 = _0x3c7def.val()?.["status"];
        if (_0x5ab209 === 0x0) {
          document.getElementById("audio_StartIIFinish").currentTime = 0x0;
          document.getElementById("audio_StartIIFinish").play();
        }
      });
      _0xdbfffa.on('value', _0x254b51 => {
        var _0x1858d0 = _0x254b51.val()?.['countdown'];
        if (_0x1858d0 === 0x1) {
          let _0x108755 = 0x3;
          const _0x34681a = setInterval(() => {
            document.getElementById("StartIICountdown").textContent = '' + _0x108755;
            _0x108755--;
            if (_0x108755 < 0x0) {
              clearInterval(_0x34681a);
              document.getElementById('StartIICountdown').textContent = '';
              let _0x4d1e66 = 0x5;
              _0x4bdac7 = setInterval(() => {
                document.getElementById('StartIICountdown').textContent = '' + _0x4d1e66;
                _0x4d1e66--;
                if (_0x4d1e66 < 0x0) {
                  clearInterval(_0x4bdac7);
                  document.getElementById("StartIICountdown").textContent = '';
                }
              }, 0x3e8);
            }
          }, 0x3e8);
        }
      });
    });
  });