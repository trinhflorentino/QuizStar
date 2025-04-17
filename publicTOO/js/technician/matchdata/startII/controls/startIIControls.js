auth.onAuthStateChanged(_0x2664ec => {
    if (!_0x2664ec) {
      return;
    }
    const _0x1dca18 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x1dca18.onSnapshot(_0x3c1a5d => {
      if (!_0x3c1a5d.exists) {
        return;
      }
      const _0x5289d7 = _0x3c1a5d.data().match;
      var _0x48cdec = realtimeDB.ref(_0x5289d7 + "/phanthistatus/khoidongo22");
      var _0x1eb8f3 = realtimeDB.ref(_0x5289d7 + "/KDO22Causo");
      var _0x11aa39 = realtimeDB.ref(_0x5289d7 + "/KDO22Chuong/CorrectOrWrong");
      var _0xcef7b = realtimeDB.ref(_0x5289d7 + "/KDO22Chuong/Player");
      var _0x5d0920 = realtimeDB.ref(_0x5289d7 + '/KDO22Chuong/ChuongStatus');
      var _0x5e03cf = realtimeDB.ref(_0x5289d7 + "/KDO22LuotThiStatus");
      var _0x4e710b = realtimeDB.ref(_0x5289d7 + "/KDO22AnswerRights");
      var _0x1b9cb9 = realtimeDB.ref(_0x5289d7 + '/KDO223sCountdown');
      var _0x4cd956 = realtimeDB.ref(_0x5289d7 + "/KDO22Turn");
      var _0x5a1cc3 = realtimeDB.ref(_0x5289d7 + "/StartIIBuzzer");
      for (let _0x5836b4 = 0x1; _0x5836b4 <= 0x3; _0x5836b4++) {
        document.getElementById('StartIIPackage' + _0x5836b4).addEventListener("click", () => {
          _0x48cdec.once("value", _0x29e030 => {
            if (_0x29e030.val().batdau === 0x1) {
              failToast("Phần thi đã bắt đầu. Dừng lượt hiện tại trước khi chọn lượt mới.");
            } else {
              var _0x1c8072 = {
                'turn': _0x5836b4
              };
              _0x4cd956.set(_0x1c8072);
              document.getElementById("StartIIStart").disabled = false;
            }
          });
        });
      }
      document.getElementById("StartIIStart").addEventListener("click", () => {
        var _0x45a42f = realtimeDB.ref(_0x5289d7 + "/KDO22Turn");
        _0x45a42f.once("value", _0x33d6e8 => {
          if (_0x33d6e8.exists() && _0x33d6e8.val().turn === 0x0) {
            failToast("Lựa chọn gói câu hỏi.");
          } else {
            successToast("Phần thi đang diễn ra");
            var _0x2c5a4f = {
              'batdau': 0x1
            };
            document.getElementById('StartIIStart').disabled = true;
            _0x48cdec.set(_0x2c5a4f).then(() => {
              setTimeout(function () {
                var _0x18abc9 = {
                  'status': 0x0
                };
                _0x5d0920.set(_0x18abc9);
                var _0x16695f = {
                  'causo': 0x1
                };
                _0x1eb8f3.set(_0x16695f);
              }, 0x1b58);
            });
            _0x5e03cf.set({
              'status': 0x1
            });
          }
        });
      });
      document.getElementById('StartIISpaceSound').addEventListener("click", () => {
        playSound("SpacingMusic", _0x5289d7);
      });
      document.getElementById("StartIIEnglishVoiceSound").addEventListener("click", () => {
        playSound("EnglishVoice", _0x5289d7);
      });
      document.getElementById('StartIIStopTurn').addEventListener('click', () => {
        _0x5d0920.set({
          'status': 0x3
        });
        _0xcef7b.set({
          'id': 0x0
        });
        _0x11aa39.set({
          'correctorwrong': 0x0
        });
        _0x5e03cf.set({
          'status': 0x0
        });
        _0x1eb8f3.set({
          'causo': 0x0
        });
        _0x4e710b.set({
          'value': false
        });
        _0x48cdec.set({
          'batdau': 0x0
        });
        _0x530a30();
        successToast("Lượt chơi hiện tại đã dừng");
        document.getElementById("StartIIStart").disabled = false;
      });
      document.getElementById("StartIIFiveSecondsCountdown").addEventListener("click", () => {
        _0x1eb8f3.once('value', _0x291d01 => {
          if (_0x291d01.val().causo > 0x0) {
            _0x1b9cb9.set({
              'countdown': 0x1
            }).then(() => {
              setTimeout(() => {
                _0x1b9cb9.set({
                  'countdown': 0x0
                });
              }, 0x7d0);
            });
          }
        });
        successToast("Đã đếm thời gian trả lời");
      });
      document.getElementById('StartIICorrectAnswer').addEventListener('click', () => {
        _0x11aa39.set({
          'correctorwrong': 0x1
        });
        _0x310795(0xa);
      });
      document.getElementById("StartIIWrongAnswer").addEventListener('click', () => {
        _0x11aa39.set({
          'correctorwrong': 0x2
        });
        _0x310795(-0x5);
      });
      function _0x530a30() {
        _0x5a1cc3.remove();
      }
      function _0x310795(_0x2aeff1) {
        _0x5a1cc3.once('value', _0x29b86d => {
          if (!_0x29b86d.exists()) {
            console.log("No buzzer entries yet");
            return;
          }
          let _0x1eccc2 = {
            'timestamp': Infinity,
            'id': null
          };
          let _0x1360e0 = {};
          _0x29b86d.forEach(_0x2a9362 => {
            const _0x38bf95 = _0x2a9362.val();
            if (!_0x1360e0[_0x38bf95.id] || _0x38bf95.buzzerTimestamp < _0x1360e0[_0x38bf95.id]) {
              _0x1360e0[_0x38bf95.id] = _0x38bf95.buzzerTimestamp;
            }
            if (_0x1360e0[_0x38bf95.id] < _0x1eccc2.timestamp) {
              _0x1eccc2 = {
                'timestamp': _0x1360e0[_0x38bf95.id],
                'id': _0x38bf95.id
              };
            }
          });
          if (_0x1eccc2.id !== null) {
            let _0x143e9b = realtimeDB.ref(_0x5289d7 + "/point/player" + _0x1eccc2.id);
            _0x143e9b.once("value", _0x18b11e => {
              const _0x392f4d = Math.max(0x0, _0x18b11e.val().point + _0x2aeff1);
              _0x143e9b.set({
                'point': _0x392f4d
              });
            });
          }
        });
      }
      document.getElementById('StartIIPreviousQuestion').addEventListener("click", () => {
        _0x1eb8f3.once("value", _0x46bb8f => {
          if (_0x46bb8f.val().causo > 0x0) {
            _0x1eb8f3.set({
              'causo': _0x46bb8f.val().causo - 0x1
            });
          }
        });
        _0x530a30();
        _0x11aa39.set({
          'correctorwrong': 0x0
        });
      });
      document.getElementById('StartIINextQuestion').addEventListener("click", () => {
        _0x4cd956.once("value", _0x1d1589 => {
          const _0x16c84e = _0x1d1589.val().turn;
          let _0x470b35 = 0xc;
          if (_0x16c84e === 0x1) {
            _0x470b35 = 0xc;
          } else {
            if (_0x16c84e === 0x2) {
              _0x470b35 = 0x19;
            } else if (_0x16c84e === 0x3) {
              _0x470b35 = 0x23;
            }
          }
          _0x1eb8f3.once("value", _0x34e2c4 => {
            if (_0x34e2c4.val().causo < _0x470b35) {
              _0x1eb8f3.set({
                'causo': _0x34e2c4.val().causo + 0x1
              });
            }
          });
          _0x530a30();
          _0x11aa39.set({
            'correctorwrong': 0x0
          });
        });
      });
    });
  });