auth.onAuthStateChanged(_0x513176 => {
    if (!_0x513176) {
      return;
    }
    const _0x2e48bf = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x2e48bf.onSnapshot(_0x202177 => {
      if (!_0x202177.exists) {
        return;
      }
      const _0x11c40a = _0x202177.data().match;
      for (let _0x20f9f3 = 0x1; _0x20f9f3 <= 0x4; _0x20f9f3++) {
        document.getElementById("StartIPackage" + _0x20f9f3).addEventListener("click", () => {
          var _0x586b12 = realtimeDB.ref(_0x11c40a + '/playerstatus/khoidong');
          var _0x52eb13 = {
            'player': _0x20f9f3
          };
          _0x586b12.set(_0x52eb13);
        });
      }
      document.getElementById("StartIStart").addEventListener("click", () => {
        var _0x4478c8 = realtimeDB.ref(_0x11c40a + "/playerstatus/khoidong");
        _0x4478c8.once('value', _0x4231af => {
          if (_0x4231af.val().player === 0x0) {
            failToast("Chọn thí sinh khởi động");
            return;
          } else {
            successToast("Phần thi đang diễn ra");
            var _0x5c52a0 = realtimeDB.ref(_0x11c40a + '/phanthistatus/khoidong');
            var _0x5057aa = realtimeDB.ref(_0x11c40a + "/khoidong");
            var _0x1d18dc = {
              'batdau': 0x1
            };
            document.getElementById("StartIStart").disabled = true;
            _0x5c52a0.set(_0x1d18dc).then(() => {
              setTimeout(function () {
                var _0x57adb1 = {
                  'causo': 0x1
                };
                _0x5057aa.set(_0x57adb1);
                _0x374862(false);
              }, 0x1b58);
              _0x5057aa.on("value", _0x1c4e0e => {
                if (_0x1c4e0e.val().causo === 0x7) {
                  var _0x8c5d5d = {
                    'batdau': 0x0
                  };
                  successToast("Đã hoàn thành phần thi", 0xbb8, "top", "right", false, "linear-gradient(to right, #00b09b, #96c93d)", '');
                  _0x374862(true);
                  _0x5c52a0.set(_0x8c5d5d);
                  setTimeout(function () {
                    var _0x3c03c6 = {
                      'causo': 0x0
                    };
                    _0x5057aa.set(_0x3c03c6);
                    setTimeout(function () {
                      document.getElementById("StartIStart").disabled = false;
                    }, 0xbb8);
                  }, 0x3e8);
                }
              });
            })["catch"](_0x188ad5 => {
              console.error("Error updating khoidong status: ", _0x188ad5);
            });
          }
        });
      });
      document.getElementById("StartISpaceSound").addEventListener('click', () => {
        playSound("SpacingMusic", _0x11c40a);
      });
      document.getElementById("StartIEnglishVoiceSound").addEventListener('click', () => {
        playSound("EnglishVoice", _0x11c40a);
      });
      document.getElementById("StartIFiveSecondsCountdown").addEventListener("click", () => {
        var _0x13f651 = firebase.database().ref(_0x11c40a + "/StartCountdown");
        _0x13f651.set({
          'countdown': 0x1
        }).then(() => {
          setTimeout(() => {
            _0x13f651.set({
              'countdown': 0x0
            });
          }, 0x3e8);
        });
      });
      document.getElementById("StartICorrectAnswer").addEventListener("click", () => {
        var _0x18d912 = realtimeDB.ref(_0x11c40a + "/khoidongdungsai");
        _0x18d912.set({
          'dung': 0x1,
          'sai': 0x0
        });
        var _0x5ae70e = realtimeDB.ref(_0x11c40a + "/khoidong");
        _0x5ae70e.once('value', _0x26462e => {
          var _0x55fd04 = _0x26462e.val().causo;
          setTimeout(() => {
            _0x5ae70e.set({
              'causo': _0x55fd04 + 0x1
            });
          }, 0x1f4);
        });
        var _0x3b0fe4 = realtimeDB.ref(_0x11c40a + "/playerstatus/khoidong");
        _0x3b0fe4.once("value", _0x42ee80 => {
          var _0x259fb1 = _0x42ee80.val().player;
          var _0x5e7324 = realtimeDB.ref(_0x11c40a + "/point/player" + _0x259fb1);
          _0x5e7324.once('value', _0x14cafc => {
            var _0x262d9d = _0x14cafc.val().point;
            _0x5e7324.set({
              'point': _0x262d9d + 0xa
            });
          });
        });
        _0x18d912.set({
          'dung': 0x0,
          'sai': 0x0
        });
      });
      document.getElementById('StartIWrongAnswer').addEventListener("click", () => {
        var _0x2763dd = realtimeDB.ref(_0x11c40a + "/khoidongdungsai");
        _0x2763dd.set({
          'dung': 0x0,
          'sai': 0x1
        });
        var _0x50702d = realtimeDB.ref(_0x11c40a + "/khoidong");
        _0x50702d.once("value", _0x4ee5dc => {
          var _0x1219ed = _0x4ee5dc.val().causo;
          setTimeout(() => {
            _0x50702d.set({
              'causo': _0x1219ed + 0x1
            });
          }, 0x1f4);
        });
        _0x2763dd.set({
          'dung': 0x0,
          'sai': 0x0
        });
      });
    });
    function _0x374862(_0x3903a8) {
      document.getElementById('StartICorrectAnswer').disabled = _0x3903a8;
      document.getElementById("StartIWrongAnswer").disabled = _0x3903a8;
    }
  });