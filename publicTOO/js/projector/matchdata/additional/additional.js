auth.onAuthStateChanged(_0x1d8bf9 => {
    if (!_0x1d8bf9) {
      return;
    }
    const _0x502e2d = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x502e2d.onSnapshot(_0x188660 => {
      if (!_0x188660.exists) {
        return;
      }
      const _0x3346ba = _0x188660.data().match;
      const _0x50e961 = realtimeDB.ref(_0x3346ba + "/AdditionalPlayerSelected");
      const _0x588234 = realtimeDB.ref(_0x3346ba + "/AdditionalBuzzer");
      const _0x1183c8 = realtimeDB.ref(_0x3346ba + "/VDPCauso/causo");
      const _0x3989c3 = realtimeDB.ref(_0x3346ba + "/phanthistatus/vedichphu");
      const _0x47a5c1 = realtimeDB.ref(_0x3346ba + "/AdditionalDisabledId");
      const _0x5e4499 = realtimeDB.ref(_0x3346ba + "/AdditionalBuzzer/State");
      let _0x583f11 = false;
      let _0x5adff8 = null;
      let _0x39fb86 = null;
      let _0x15e888 = 0xf;
      _0x3989c3.on("value", _0x329b17 => {
        const _0x2d1417 = _0x329b17.val().batdau;
        if (_0x2d1417 === 0x1) {
          _0x583f11 = true;
          _0x15e888 = 0xf;
          _0x39fb86 = document.getElementById("audio_AdditionalRound");
          const _0x44594b = () => {};
          const _0x42b987 = () => {
            if (_0x5adff8) {
              return;
            }
            if (_0x39fb86) {
              _0x39fb86.play();
            }
            _0x5adff8 = setInterval(() => {
              if (_0x15e888 > 0x0) {
                _0x15e888--;
                _0x44594b();
              } else {
                clearInterval(_0x5adff8);
                _0x5adff8 = null;
              }
            }, 0x3e8);
          };
          _0x44594b();
          _0x42b987();
          _0x588234.on('value', _0x59284b => {
            if (_0x59284b.exists()) {
              if (_0x5adff8) {
                clearInterval(_0x5adff8);
                _0x5adff8 = null;
              }
              if (_0x39fb86) {
                _0x39fb86.pause();
              }
            } else if (_0x15e888 > 0x0 && !_0x5adff8) {
              _0x42b987();
            }
          });
        }
      });
      _0x1183c8.on("value", _0x535f00 => {
        const _0x2864a3 = _0x535f00.val();
        const _0x1860c1 = realtimeDB.ref(_0x3346ba + "/CHPQuestion/cau" + _0x2864a3);
        if (_0x5adff8) {
          clearInterval(_0x5adff8);
          _0x5adff8 = null;
        }
        if (_0x39fb86) {
          _0x39fb86.pause();
          _0x39fb86.currentTime = 0x0;
        }
        document.getElementById('AdditionalQuestionNumber').textContent = _0x2864a3;
        _0x1860c1.on("value", _0x3e12d1 => {
          document.getElementById('AdditionalQuestion').textContent = _0x3e12d1.val();
        });
      });
      let _0x2623ef = [];
      _0x47a5c1.on("value", _0x22f877 => {
        _0x2623ef = [];
        _0x22f877.forEach(_0x5ec5c0 => {
          _0x2623ef.push(parseInt(_0x5ec5c0.val(), 0xa));
        });
      });
      let _0x3981e1 = [];
      _0x50e961.on('value', _0x73d961 => {
        _0x3981e1 = [];
        _0x73d961.forEach(_0x42c66b => {
          _0x3981e1.push(parseInt(_0x42c66b.val(), 0xa));
        });
        const _0x19766b = document.getElementById("AdditionalPlayerList");
        if (_0x19766b) {
          _0x19766b.innerHTML = '';
          _0x3981e1.forEach((_0x1c2644, _0x34ab79, _0x5b038) => {
            realtimeDB.ref(_0x3346ba + "/games/player" + _0x1c2644).once("value").then(_0x54b90a => {
              const _0x5e1631 = _0x54b90a.val();
              const _0x5d09da = _0x5e1631 && _0x5e1631.displayName ? _0x5e1631.displayName : 'Unknown';
              const _0x1c59f0 = document.createElement("div");
              _0x1c59f0.className = "flex-1 bg-white p-4";
              if (_0x34ab79 === 0x0) {
                _0x1c59f0.classList.add("rounded-tl-lg");
              }
              if (_0x34ab79 === _0x5b038.length - 0x1) {
                _0x1c59f0.classList.add("rounded-tr-lg");
              }
              const _0x17784c = document.createElement('p');
              _0x17784c.className = "text-defaultColor font-bold text-xl text-center";
              _0x17784c.textContent = _0x5d09da;
              _0x1c59f0.appendChild(_0x17784c);
              _0x19766b.appendChild(_0x1c59f0);
              if (_0x34ab79 !== _0x5b038.length - 0x1) {
                const _0x38b14b = document.createElement("div");
                _0x38b14b.className = "w-px bg-defaultColor";
                _0x19766b.appendChild(_0x38b14b);
              }
            })['catch'](_0x2f2ea2 => {
              console.error("Error fetching player data:", _0x2f2ea2);
            });
          });
        }
      });
      _0x588234.on("value", _0x38c2ad => {
        if (!_0x38c2ad.exists()) {
          console.log("No buzzer entries yet");
          const _0x351316 = document.querySelectorAll("#AdditionalPlayerList > .flex-1");
          _0x351316.forEach(_0x20b7cf => {
            _0x20b7cf.classList.remove("bg-red-500");
            _0x20b7cf.classList.add("bg-white");
            const _0x30d487 = _0x20b7cf.querySelector('p');
            if (_0x30d487) {
              _0x30d487.classList.remove("text-white");
              _0x30d487.classList.add("text-defaultColor");
            }
          });
          return;
        }
        let _0x2ce369 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x36d980 = {};
        _0x38c2ad.forEach(_0x5ba5e8 => {
          const _0x413728 = _0x5ba5e8.val();
          if (!_0x36d980[_0x413728.id] || _0x413728.buzzerTimestamp < _0x36d980[_0x413728.id]) {
            _0x36d980[_0x413728.id] = _0x413728.buzzerTimestamp;
          }
          if (_0x36d980[_0x413728.id] < _0x2ce369.timestamp) {
            _0x2ce369 = {
              'timestamp': _0x36d980[_0x413728.id],
              'id': _0x413728.id
            };
          }
        });
        const _0x50ce05 = document.querySelectorAll("#AdditionalPlayerList > .flex-1");
        _0x50ce05.forEach(_0x1acc93 => {
          _0x1acc93.classList.remove('bg-red-500');
          _0x1acc93.classList.add('bg-white');
          const _0x47c618 = _0x1acc93.querySelector('p');
          if (_0x47c618) {
            _0x47c618.classList.remove("text-white");
            _0x47c618.classList.add("text-defaultColor");
          }
        });
        if (_0x2ce369.id !== null) {
          _0x50ce05.forEach((_0x48ca57, _0x60f86f) => {
            if (_0x60f86f === _0x2ce369.id - 0x1) {
              _0x48ca57.classList.remove("bg-white");
              _0x48ca57.classList.add("bg-red-500");
              const _0x5e2972 = _0x48ca57.querySelector('p');
              if (_0x5e2972) {
                _0x5e2972.classList.add("text-white");
                _0x5e2972.classList.remove('text-defaultColor');
              }
            }
          });
          if (!_0x38c2ad.val().State) {
            const _0x3ca9d8 = document.getElementById("audio_FinishAnswerGranted");
            _0x3ca9d8.currentTime = 0x0;
            _0x3ca9d8.play();
          }
        }
      });
      _0x5e4499.on('value', _0x196fca => {
        const _0x4eb26f = _0x196fca.val()?.['state'];
        if (_0x4eb26f === true) {
          const _0x204cc2 = document.getElementById("audio_FinishRightAnswer");
          _0x204cc2.currentTime = 0x0;
          _0x204cc2.play();
        }
      });
    });
  });