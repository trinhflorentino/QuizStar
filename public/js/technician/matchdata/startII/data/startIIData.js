auth.onAuthStateChanged(_0x9a8d81 => {
    if (!_0x9a8d81) {
      return;
    }
    const _0x49ac02 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x49ac02.onSnapshot(_0x1dd10f => {
      if (!_0x1dd10f.exists) {
        return;
      }
      const _0x2514dd = _0x1dd10f.data().match;
      var _0x303a60 = realtimeDB.ref(_0x2514dd + "/KDO22Turn");
      var _0x1a0128 = realtimeDB.ref(_0x2514dd + "/StartIIBuzzer");
      var _0x311224 = realtimeDB.ref(_0x2514dd + "/KDO223sCountdown");
      var _0x23bccd;
      _0x303a60.on("value", _0x2aa279 => {
        const _0x165f4b = _0x2aa279.val().turn;
        for (let _0x1fdcf8 = 0x1; _0x1fdcf8 <= 0x3; _0x1fdcf8++) {
          const _0x444ce5 = document.getElementById("StartIIPackage" + _0x1fdcf8);
          if (_0x165f4b === 0x0) {
            _0x444ce5.classList.remove('bg-green-600', "text-white");
          } else if (_0x1fdcf8 === _0x165f4b) {
            _0x444ce5.classList.add("bg-green-600", "text-white");
          } else {
            _0x444ce5.classList.remove("bg-green-600", 'text-white');
          }
        }
        if (window.currentStartIIQuestionNumberRef) {
          window.currentStartIIQuestionNumberRef.off();
        }
        if (window.currentStartIIQuestionRef) {
          window.currentStartIIQuestionRef.off();
        }
        if (window.currentStartIIAnswerRef) {
          window.currentStartIIAnswerRef.off();
        }
        const _0x1db9ae = realtimeDB.ref(_0x2514dd + "/KDO22Causo");
        window.currentStartIIQuestionNumberRef = _0x1db9ae;
        _0x1db9ae.on('value', _0x561a01 => {
          const _0x55b32e = _0x561a01.val().causo;
          const _0x4fc5e1 = realtimeDB.ref(_0x2514dd + "/KDO22Question/L" + _0x165f4b + "/cau" + _0x55b32e);
          const _0x4ee533 = realtimeDB.ref(_0x2514dd + "/KDO22Question/L" + _0x165f4b + "/dacau" + _0x55b32e);
          window.currentStartIIQuestionRef = _0x4fc5e1;
          window.currentStartIIAnswerRef = _0x4ee533;
          clearInterval(_0x23bccd);
          document.getElementById("StartIICountdown").textContent = '';
          if (_0x55b32e === 0x0) {
            document.getElementById("StartIIPreviousQuestion").disabled = true;
            document.getElementById('StartIINextQuestion').disabled = true;
          } else {
            document.getElementById('StartIIPreviousQuestion').disabled = false;
            document.getElementById("StartIINextQuestion").disabled = false;
          }
          _0x4fc5e1.on("value", _0x2419f1 => {
            const _0x1cae88 = _0x2419f1.val();
            document.getElementById("StartIIQuestion").textContent = _0x1cae88;
          });
          _0x4ee533.on('value', _0x235294 => {
            const _0x378665 = _0x235294.val();
            document.getElementById('StartIIAnswer').textContent = _0x378665;
          });
        });
      });
      _0x311224.on('value', _0x3031a7 => {
        var _0x3ace3 = _0x3031a7.val()?.["countdown"];
        if (_0x3ace3 === 0x1) {
          allowBuzzer = false;
          let _0x58a05c = 0x3;
          const _0x26bea7 = setInterval(() => {
            document.getElementById("StartIICountdown").textContent = '' + _0x58a05c;
            _0x58a05c--;
            if (_0x58a05c < 0x0) {
              clearInterval(_0x26bea7);
              document.getElementById("StartIICountdown").textContent = '';
              let _0x20d75c = 0x5;
              _0x23bccd = setInterval(() => {
                document.getElementById("StartIICountdown").textContent = '' + _0x20d75c;
                _0x20d75c--;
                if (_0x20d75c < 0x0) {
                  clearInterval(_0x23bccd);
                  document.getElementById("StartIICountdown").textContent = '';
                  allowBuzzer = false;
                }
              }, 0x3e8);
            }
          }, 0x3e8);
        }
      });
      const _0x3df6f5 = realtimeDB.ref(_0x2514dd + "/KDO22Chuong/Player");
      _0x3df6f5.on("value", _0x183b12 => {
        for (let _0x12557c = 0x1; _0x12557c <= 0x4; _0x12557c++) {
          const _0x497397 = document.getElementById("startIIPlayer" + _0x12557c);
          if (_0x497397) {
            _0x497397.classList.remove('bg-red-600', "rounded-full", "text-white");
          }
        }
        _0x183b12.forEach(_0x4a2061 => {
          var _0x3afba7 = _0x4a2061.val().id;
          const _0x26ccac = document.getElementById("startIIPlayer" + _0x3afba7);
          if (_0x26ccac) {
            _0x26ccac.classList.add("bg-red-600", 'rounded-full', "text-white");
            clearInterval(_0x23bccd);
            document.getElementById("StartIICountdown").textContent = '';
          }
        });
      });
      _0x1a0128.on('value', _0x4a49c7 => {
        if (!_0x4a49c7.exists()) {
          console.log("No buzzer entries yet");
          _0x239f7c();
          return;
        }
        let _0xe4945d = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x512eb2 = {};
        _0x4a49c7.forEach(_0x85280f => {
          const _0x4fa466 = _0x85280f.val();
          console.log("Buzzer press:", {
            'id': _0x4fa466.id,
            'timestamp': _0x4fa466.buzzerTimestamp
          });
          if (!_0x512eb2[_0x4fa466.id] || _0x4fa466.buzzerTimestamp < _0x512eb2[_0x4fa466.id]) {
            _0x512eb2[_0x4fa466.id] = _0x4fa466.buzzerTimestamp;
          }
          _0x56e905(_0x4fa466.id, _0x512eb2[_0x4fa466.id]);
          if (_0x512eb2[_0x4fa466.id] < _0xe4945d.timestamp) {
            _0xe4945d = {
              'timestamp': _0x512eb2[_0x4fa466.id],
              'id': _0x4fa466.id
            };
          }
        });
        console.log("Fastest buzzer:", _0xe4945d.id);
        console.log("Timestamp:", new Date(_0xe4945d.timestamp));
        if (_0xe4945d.id !== null) {
          _0x4ca6cb(_0xe4945d.id, _0xe4945d.timestamp);
        }
      });
      function _0x239f7c() {
        for (let _0x3837ce = 0x1; _0x3837ce <= 0x4; _0x3837ce++) {
          const _0x4ab806 = document.getElementById('startIIPlayer' + _0x3837ce);
          const _0xccf16f = document.getElementById("startIIPlayer" + _0x3837ce + "Timestamp");
          if (_0x4ab806) {
            _0x4ab806.classList.remove("bg-red-600", "rounded-full", "text-white");
          }
          if (_0xccf16f) {
            _0xccf16f.textContent = '';
          }
        }
      }
      function _0x4ca6cb(_0x42d804, _0x104d69) {
        const _0x5ca1d9 = document.getElementById("startIIPlayer" + _0x42d804);
        const _0x38c539 = document.getElementById("startIIPlayer" + _0x42d804 + "Timestamp");
        if (_0x5ca1d9) {
          _0x5ca1d9.classList.add("bg-red-600", "rounded-full", "text-white");
        }
        if (_0x38c539) {
          _0x38c539.textContent = "Dấu thời gian: " + new Date(_0x104d69).toLocaleTimeString() + '.' + new Date(_0x104d69).getMilliseconds();
        }
      }
      function _0x56e905(_0x7bc837, _0x2abe55) {
        const _0x138ec6 = document.getElementById("startIIPlayer" + _0x7bc837 + "Name");
        if (_0x138ec6) {
          let _0x47629f = document.getElementById('startIIPlayer' + _0x7bc837 + "Timestamp");
          if (!_0x47629f) {
            _0x47629f = document.createElement("div");
            _0x47629f.id = "startIIPlayer" + _0x7bc837 + 'Timestamp';
            _0x47629f.style.fontSize = "12px";
            _0x47629f.style.color = "white";
            _0x138ec6.insertAdjacentElement("afterend", _0x47629f);
          }
          _0x47629f.textContent = "Dấu thời gian: " + new Date(_0x2abe55).toLocaleTimeString() + '.' + new Date(_0x2abe55).getMilliseconds();
        }
      }
    });
  });