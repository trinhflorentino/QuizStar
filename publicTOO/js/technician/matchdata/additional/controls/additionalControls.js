auth.onAuthStateChanged(_0x3c49ca => {
    if (!_0x3c49ca) {
      return;
    }
    const _0x23d51a = firestoreDB.collection("match").doc(_0x3c49ca.uid);
    _0x23d51a.onSnapshot(_0x3f0fc5 => {
      if (!_0x3f0fc5.exists) {
        return;
      }
      const _0x5b87af = _0x3f0fc5.data().match;
      var _0x1a322f = realtimeDB.ref(_0x5b87af + "/VDPCauso/causo");
      var _0x52dabd = realtimeDB.ref(_0x5b87af + "/phanthistatus/vedichphu");
      var _0x20d541 = realtimeDB.ref(_0x5b87af + "/Sounds");
      var _0x24c81f = realtimeDB.ref(_0x5b87af + "/AdditionalPlayerSelected");
      var _0x49aa2a = realtimeDB.ref(_0x5b87af + "/AdditionalBuzzer");
      var _0xec6875 = realtimeDB.ref(_0x5b87af + "/AdditionalBuzzer/State");
      var _0x25ec30 = realtimeDB.ref(_0x5b87af + "/AdditionalDisabledId");
      document.getElementById("AdditionalSpaceSound").addEventListener("click", () => {
        playSound('SpacingMusic', _0x5b87af);
      });
      document.getElementById("AdditionalPreviousQuestion").addEventListener("click", () => {
        _0x1a322f.once("value", _0x2be8db => {
          const _0x9ad972 = _0x2be8db.val();
          if (_0x9ad972 > 0x0) {
            _0x1a322f.set(_0x9ad972 - 0x1);
          }
          successToast("Đã chuyển đến câu hỏi số " + (_0x9ad972 - 0x1));
        });
        _0x30a908();
      });
      document.getElementById('AdditionalNextQuestion').addEventListener("click", () => {
        _0x1a322f.once("value", _0x15477e => {
          const _0x3b5a60 = _0x15477e.val();
          if (_0x3b5a60 < 0xa) {
            _0x1a322f.set(_0x3b5a60 + 0x1);
          }
          successToast("Đã chuyển đến câu hỏi số " + (_0x3b5a60 + 0x1));
        });
        _0x30a908();
      });
      document.getElementById("AdditionalStart").addEventListener("click", () => {
        _0x30a908();
        _0x52dabd.set({
          'batdau': 0x1
        }).then(() => {
          setTimeout(() => {
            _0x52dabd.set({
              'batdau': 0x0
            });
          }, 0x3e8);
        });
        successToast("Đã bắt đầu đếm ngược");
        realtimeDB.ref(_0x5b87af + "/VDPChuong/ChuongStatus").set({
          'status': 0x0
        });
      });
      document.getElementById("AdditionalCorrectAnswer").addEventListener('click', () => {
        successToast("Đã chọn thí sinh trả lời đúng");
        _0xec6875.update({
          'state': true
        });
        _0x20d541.update({
          'TenseMoments': false
        });
      });
      document.getElementById("AdditionalWrongAnswer").addEventListener("click", () => {
        _0x49aa2a.once("value", _0xe77704 => {
          let _0x35bee2 = {
            'timestamp': Infinity,
            'id': null
          };
          let _0x2fd2ba = {};
          _0xe77704.forEach(_0x468469 => {
            const _0x5d292e = _0x468469.val();
            if (!_0x5d292e || !_0x5d292e.id || !_0x5d292e.buzzerTimestamp) {
              return;
            }
            if (!_0x2fd2ba[_0x5d292e.id] || _0x5d292e.buzzerTimestamp < _0x2fd2ba[_0x5d292e.id]) {
              _0x2fd2ba[_0x5d292e.id] = _0x5d292e.buzzerTimestamp;
            }
            if (_0x2fd2ba[_0x5d292e.id] < _0x35bee2.timestamp) {
              _0x35bee2 = {
                'timestamp': _0x2fd2ba[_0x5d292e.id],
                'id': _0x5d292e.id
              };
            }
          });
          if (_0x35bee2.id !== null) {
            _0x25ec30.push(_0x35bee2.id).then(() => {
              console.log("Fastest player (" + _0x35bee2.id + ") has been disabled.");
            })["catch"](_0x486dd5 => {
              console.error("Error pushing fastest player id:", _0x486dd5);
            });
          } else {
            console.log("No buzzer entries found.");
          }
        });
        _0x49aa2a.remove();
        _0x20d541.update({
          'TenseMoments': false
        });
        successToast("Đã chọn thí sinh trả lời sai. Thời gian tiếp tục đếm ngược.");
      });
      function _0x30a908() {
        realtimeDB.ref(_0x5b87af + '/VDPChuong/ChuongStatus').set({
          'status': 0x3
        });
        realtimeDB.ref(_0x5b87af + '/VDPChuong/Player').set({});
        realtimeDB.ref(_0x5b87af + "/VDPChuong/CorrectOrWrong").set({
          'correctorwrong': 0x0
        });
        _0x49aa2a.remove();
        _0x25ec30.remove();
        for (let _0x38e8f7 = 0x1; _0x38e8f7 <= 0x4; _0x38e8f7++) {
          realtimeDB.ref(_0x5b87af + "/VDPChuongDisable/TS" + _0x38e8f7).set({
            'chuongdisable': 0x0
          });
        }
      }
      document.getElementById("AdditionalTenseAudio").addEventListener("click", () => {
        _0x20d541.once("value", _0xaf6d1c => {
          if (_0xaf6d1c.val().TenseMoments === true) {
            _0x20d541.update({
              'TenseMoments': false
            });
          } else {
            _0x20d541.update({
              'TenseMoments': true
            });
          }
        });
      });
      document.getElementById("AddtionalPlayerSubmit").addEventListener('click', () => {
        const _0x1ed121 = [];
        for (let _0x30a67b = 0x1; _0x30a67b <= 0x4; _0x30a67b++) {
          const _0xaa161b = document.getElementById("additionalPlayer" + _0x30a67b + "Checkbox");
          if (_0xaa161b.checked) {
            _0x1ed121.push(_0x30a67b);
          }
        }
        if (_0x1ed121.length === 0x0) {
          failToast("Vui lòng chọn ít nhất một thí sinh");
          return;
        } else {
          _0x24c81f.set(_0x1ed121);
          successToast("Đã chọn thí sinh");
        }
      });
    });
  });