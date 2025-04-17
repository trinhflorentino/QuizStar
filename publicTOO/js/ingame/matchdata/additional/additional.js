auth.onAuthStateChanged(_0x4655d7 => {
    if (!_0x4655d7) {
      return;
    }
    const _0x4b364f = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x4b364f.onSnapshot(_0xe9cfe1 => {
      if (!_0xe9cfe1.exists) {
        return;
      }
      const _0xdd6f88 = _0xe9cfe1.data().match;
      const _0x4e6889 = realtimeDB.ref(_0xdd6f88 + '/AdditionalPlayerSelected');
      const _0x1f90e8 = realtimeDB.ref(_0xdd6f88 + '/AdditionalBuzzer');
      const _0x3d219e = realtimeDB.ref(_0xdd6f88 + "/VDPCauso/causo");
      const _0x40f965 = realtimeDB.ref(_0xdd6f88 + "/phanthistatus/vedichphu");
      const _0x374800 = realtimeDB.ref(_0xdd6f88 + "/AdditionalDisabledId");
      const _0x7b84e9 = realtimeDB.ref(_0xdd6f88 + '/AdditionalBuzzer/State');
      let _0x28c6b3 = false;
      let _0x3ffb57 = null;
      let _0x576f75 = null;
      let _0x1cd3c0 = 0xf;
      _0x4e6889.on("value", _0xc7f2cd => {
        const _0x20a9c6 = _0xc7f2cd.val() || [];
        const _0x7bc456 = Array.isArray(_0x20a9c6) ? _0x20a9c6.map(_0x14429d => realtimeDB.ref(_0xdd6f88 + "/games/player" + _0x14429d).once('value')) : Object.values(_0x20a9c6).map(_0xab4358 => realtimeDB.ref(_0xdd6f88 + '/games/player' + _0xab4358).once('value'));
        Promise.all(_0x7bc456).then(_0x2dc1c2 => {
          const _0x4f9eca = _0x2dc1c2.map(_0x199855 => {
            const _0x35d7df = _0x199855.val();
            return _0x35d7df && _0x35d7df.displayName ? _0x35d7df.displayName : '';
          }).filter(_0x295bc4 => _0x295bc4);
          document.getElementById("AdditionalPlayerName").textContent = _0x4f9eca.join(", ");
        });
      });
      _0x40f965.on('value', _0x2ec13f => {
        const _0x1ad52e = _0x2ec13f.val().batdau;
        if (_0x1ad52e === 0x1) {
          _0x28c6b3 = true;
          _0x1cd3c0 = 0xf;
          _0x576f75 = document.getElementById("audio_AdditionalRound");
          const _0x213e6a = document.getElementById('AdditionalAnswerIcon');
          if (_0x213e6a) {
            _0x213e6a.classList.remove("text-red-600");
            _0x213e6a.classList.add('text-green-600');
          }
          const _0x5edd4f = () => {
            document.getElementById("AdditionalCountdown").textContent = "00:" + _0x1cd3c0.toString().padStart(0x2, '0');
          };
          const _0x1eae90 = () => {
            if (_0x3ffb57) {
              return;
            }
            if (_0x576f75) {
              _0x576f75.play();
            }
            _0x3ffb57 = setInterval(() => {
              if (_0x1cd3c0 > 0x0) {
                _0x1cd3c0--;
                _0x5edd4f();
                if (_0x213e6a) {
                  _0x213e6a.classList.remove('text-red-600');
                  _0x213e6a.classList.add("text-green-600");
                }
                if (_0x1cd3c0 === 0x0 && _0x213e6a) {
                  _0x213e6a.classList.remove("text-green-600");
                  _0x213e6a.classList.add("text-red-600");
                  _0x28c6b3 = false;
                }
              } else {
                clearInterval(_0x3ffb57);
                _0x3ffb57 = null;
              }
            }, 0x3e8);
          };
          _0x5edd4f();
          _0x1eae90();
          _0x1f90e8.on("value", _0x53142b => {
            if (_0x53142b.exists()) {
              if (_0x213e6a) {
                _0x213e6a.classList.remove("text-green-600");
                _0x213e6a.classList.add("text-red-600");
              }
              if (_0x3ffb57) {
                clearInterval(_0x3ffb57);
                _0x3ffb57 = null;
              }
              if (_0x576f75) {
                _0x576f75.pause();
              }
            } else if (_0x1cd3c0 > 0x0 && !_0x3ffb57) {
              _0x1eae90();
            }
          });
        }
      });
      _0x3d219e.on('value', _0x498ee9 => {
        const _0x9c39d7 = _0x498ee9.val();
        const _0x4c4794 = realtimeDB.ref(_0xdd6f88 + "/CHPQuestion/cau" + _0x9c39d7);
        if (_0x3ffb57) {
          clearInterval(_0x3ffb57);
          _0x3ffb57 = null;
        }
        if (_0x576f75) {
          _0x576f75.pause();
          _0x576f75.currentTime = 0x0;
        }
        document.getElementById('AdditionalAnswerButton').disabled = false;
        document.getElementById("AdditionalQuestionNumber").textContent = _0x9c39d7;
        document.getElementById('AdditionalCountdown').textContent = "00:15";
        _0x4c4794.on("value", _0x480f8c => {
          document.getElementById('AdditionalQuestion').textContent = _0x480f8c.val();
        });
      });
      let _0x4ef603 = [];
      _0x374800.on('value', _0x20dede => {
        _0x4ef603 = [];
        _0x20dede.forEach(_0x3228e9 => {
          _0x4ef603.push(parseInt(_0x3228e9.val(), 0xa));
        });
      });
      let _0x94e850 = [];
      _0x4e6889.on("value", _0x222ea3 => {
        _0x94e850 = [];
        _0x222ea3.forEach(_0x43280a => {
          _0x94e850.push(parseInt(_0x43280a.val(), 0xa));
        });
      });
      document.getElementById("AdditionalAnswerButton").addEventListener("click", () => {
        if (!_0x28c6b3) {
          return;
        }
        const _0x2acef8 = parseInt(localStorage.getItem('id'), 0xa);
        if (_0x4ef603.includes(_0x2acef8)) {
          console.log("Player " + _0x2acef8 + " is disabled from buzzing.");
          return;
        }
        if (!_0x94e850.includes(_0x2acef8)) {
          console.log("Player " + _0x2acef8 + " is not whitelisted for selection.");
          return;
        }
        _0x1f90e8.push({
          'id': _0x2acef8,
          'uid': auth.currentUser.uid,
          'buzzerTimestamp': firebase.database.ServerValue.TIMESTAMP
        });
      });
      _0x1f90e8.on("value", _0x31c998 => {
        const _0x18d9f3 = document.getElementById("AdditionalBuzzerList");
        _0x18d9f3.innerHTML = '';
        if (!_0x31c998.exists()) {
          console.log("No buzzer entries yet");
          document.getElementById("AdditionalAnswerButton").disabled = false;
          return;
        }
        let _0x2d7028 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x2e6ec9 = {};
        _0x31c998.forEach(_0x2035d3 => {
          const _0x39751c = _0x2035d3.val();
          if (!_0x2e6ec9[_0x39751c.id] || _0x39751c.buzzerTimestamp < _0x2e6ec9[_0x39751c.id]) {
            _0x2e6ec9[_0x39751c.id] = _0x39751c.buzzerTimestamp;
          }
          if (_0x2e6ec9[_0x39751c.id] < _0x2d7028.timestamp) {
            _0x2d7028 = {
              'timestamp': _0x2e6ec9[_0x39751c.id],
              'id': _0x39751c.id
            };
          }
        });
        if (_0x2d7028.id !== null) {
          const _0x5bd8c3 = realtimeDB.ref(_0xdd6f88 + "/games/player" + _0x2d7028.id);
          _0x5bd8c3.once('value').then(_0x369be2 => {
            const _0x3eed6f = _0x369be2.val().displayName;
            const _0x5273a1 = new Date(_0x2d7028.timestamp);
            const _0x3faaeb = _0x5273a1.getHours().toString().padStart(0x2, '0') + ':' + _0x5273a1.getMinutes().toString().padStart(0x2, '0') + ':' + _0x5273a1.getSeconds().toString().padStart(0x2, '0') + ':' + _0x5273a1.getMilliseconds().toString().padStart(0x3, '0');
            const _0x31ffb5 = document.createElement("div");
            _0x31ffb5.className = "w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center font-semibold py-4 rounded-xl dark:from-blue-700 dark:to-indigo-700";
            _0x31ffb5.textContent = "Thí sinh " + _0x3eed6f + " đã giành quyền trả lời lúc " + _0x3faaeb;
            _0x18d9f3.appendChild(_0x31ffb5);
          });
          document.getElementById('AdditionalAnswerButton').disabled = true;
          if (!_0x31c998.val().State) {
            const _0x3db8ed = document.getElementById('audio_FinishAnswerGranted');
            _0x3db8ed.currentTime = 0x0;
            _0x3db8ed.play();
          }
        }
      });
      _0x7b84e9.on('value', _0x2ee194 => {
        const _0x46401f = _0x2ee194.val()?.["state"];
        if (_0x46401f === true) {
          const _0x44891a = document.getElementById("audio_FinishRightAnswer");
          _0x44891a.currentTime = 0x0;
          _0x44891a.play();
        }
      });
    });
  });