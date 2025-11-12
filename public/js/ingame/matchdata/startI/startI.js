auth.onAuthStateChanged(_0x4c4966 => {
    if (!_0x4c4966) {
      return;
    }
    const _0x15d505 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x15d505.onSnapshot(_0x12d953 => {
      if (!_0x12d953.exists) {
        return;
      }
      const _0xfeb42d = _0x12d953.data().match;
      let _0x369c50;
      const _0x1d0811 = realtimeDB.ref(_0xfeb42d + "/playerstatus/khoidong");
      const _0x38544a = realtimeDB.ref(_0xfeb42d + '/phanthistatus/khoidong');
      const _0x472c6b = realtimeDB.ref(_0xfeb42d + "/khoidongdungsai");
      const _0x3ebe94 = realtimeDB.ref(_0xfeb42d + "/Sounds");
      const _0x1d931f = {
        'phase1': document.getElementById("audio_StartingTimes_Phase1"),
        'phase2': document.getElementById("audio_StartingTimes_Phase2"),
        'phase3': document.getElementById('audio_StartingTimes_Phase3'),
        'finish': document.getElementById("audio_StartingFinish")
      };
      let _0x5bf230 = null;
      function _0x3ef5dc() {
        const _0x1d9b3a = speechSynthesis.getVoices();
        _0x5bf230 = _0x1d9b3a.find(_0x40a94b => _0x40a94b.lang === "en-US" && (_0x40a94b.name.includes('Female') || _0x40a94b.name.includes("feminine") || _0x40a94b.name.includes("girl"))) || _0x1d9b3a.find(_0x2dc49c => _0x2dc49c.lang === "en-US") || _0x1d9b3a[0x0];
      }
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = _0x3ef5dc;
      }
      _0x3ef5dc();
      function _0x23b195(_0x151a84) {
        if (!_0x151a84) {
          return;
        }
        speechSynthesis.cancel();
        const _0x511d02 = new SpeechSynthesisUtterance(_0x151a84);
        if (_0x5bf230) {
          _0x511d02.voice = _0x5bf230;
        }
        _0x511d02.rate = 0x1;
        _0x511d02.pitch = 0x1;
        _0x511d02.volume = 0x1;
        speechSynthesis.speak(_0x511d02);
      }
      _0x38544a.on("value", _0x4922b2 => {
        const _0x51590f = _0x4922b2.val()?.["batdau"];
        if (_0x51590f === 0x1) {
          const _0x343e87 = document.getElementById("audio_StartQuestionShow");
          const _0x29229a = document.getElementById("audio_StartStartQuestionShow");
          _0x343e87.currentTime = 0x0;
          _0x343e87?.["play"]();
          setTimeout(() => {
            _0x29229a.currentTime = 0x0;
            _0x29229a?.["play"]();
          }, 0xe10);
          Object.values(_0x1d931f).forEach(_0x399e85 => {
            if (_0x399e85) {
              _0x399e85.currentTime = 0x0;
            }
          });
        }
      });
      _0x472c6b.on("value", _0x1f8ecd => {
        const _0x1b1947 = document.getElementById('audio_StartingRightAnswer');
        const _0x131ec6 = document.getElementById('audio_StartingWrongAnswer');
        if (_0x1f8ecd.val().dung === 0x1) {
          _0x1b1947.currentTime = 0x0;
          _0x1b1947.play();
        }
        if (_0x1f8ecd.val().sai === 0x1) {
          _0x131ec6.currentTime = 0x0;
          _0x131ec6.play();
        }
      });
      _0x1d0811.on("value", _0x5e5d80 => {
        const _0x2f7ff6 = _0x5e5d80.val();
        if (_0x2f7ff6?.['player'] !== undefined) {
          const _0xd23c3 = _0x2f7ff6.player;
          ["currentStartIQuestionNumberRef", "currentStartIQuestionRef", "currentStartIAnswerRef"].forEach(_0x5d0372 => {
            if (window[_0x5d0372]) {
              window[_0x5d0372].off();
            }
          });
          const _0x26bf24 = realtimeDB.ref(_0xfeb42d + "/khoidong");
          window.currentStartIQuestionNumberRef = _0x26bf24;
          _0x26bf24.on("value", _0x99d5e => {
            const _0x4ce757 = _0x99d5e.val()?.["causo"];
            const _0x233018 = realtimeDB.ref(_0xfeb42d + "/StartQuestion/Q" + _0xd23c3 + "DB/cau" + _0x4ce757);
            const _0x2c2ecd = realtimeDB.ref(_0xfeb42d + '/StartQuestion/Q' + _0xd23c3 + "DB/dacau" + _0x4ce757);
            window.currentStartIQuestionRef = _0x233018;
            window.currentStartIAnswerRef = _0x2c2ecd;
            clearInterval(_0x369c50);
            document.getElementById("StartICountdown").textContent = '';
            const _0x31dd29 = document.getElementById("StartIWaiting");
            const _0x66b4e8 = document.getElementById('StartIQuestionNumber');
            const _0x44b002 = document.getElementById("StartITurn");
            const _0x38f15b = document.getElementById('StartIPlayerName');
            if (_0x4ce757 === 0x0) {
              _0x31dd29.style.display = 'flex';
              _0x66b4e8.textContent = '';
            } else if (_0x4ce757 === 0x7) {
              _0x31dd29.style.display = 'none';
              _0x66b4e8.textContent = "Đã hoàn thành";
            } else {
              _0x31dd29.style.display = "none";
              _0x66b4e8.textContent = _0x4ce757 + '/6';
            }
            if (_0xd23c3 === 0x0) {
              _0x44b002.textContent = '';
            } else {
              _0x44b002.textContent = _0xd23c3 + '/4';
            }
            var _0xcfbefa = realtimeDB.ref(_0xfeb42d + "/games/player" + _0xd23c3 + '/');
            _0xcfbefa.on("value", _0x1125c2 => {
              if (_0xd23c3 === 0x0) {
                return;
              }
              const _0x307a93 = _0x1125c2.val()?.["displayName"] || "Player " + _0xd23c3;
              _0x38f15b.textContent = _0x307a93;
            });
            _0x233018.on("value", _0x363f6b => {
              const _0x39aac8 = _0x363f6b.val();
              document.getElementById("StartIQuestion").textContent = _0x39aac8;
              _0x3ebe94.on("value", _0x4e3f21 => {
                const _0x22221d = _0x4e3f21.val();
                if (_0x22221d?.['EnglishVoice'] && _0x39aac8) {
                  _0x23b195(_0x39aac8);
                }
              });
            });
            Object.values(_0x1d931f).forEach(_0x10eea2 => _0x10eea2?.['pause']() && (_0x10eea2.currentTime = 0x0));
            if (_0x4ce757 > 0x0 && _0x4ce757 < 0x4) {
              _0x1d931f.phase1?.['play']();
            }
            if (_0x4ce757 > 0x3 && _0x4ce757 < 0x6) {
              _0x1d931f.phase2?.['play']();
            }
            if (_0x4ce757 === 0x6) {
              _0x1d931f.phase3?.["play"]();
            }
            if (_0x4ce757 === 0x7) {
              setTimeout(() => {
                _0x1d931f.finish?.["play"]();
              }, 0x7d0);
            }
          });
        }
      });
      const _0x2eca14 = realtimeDB.ref(_0xfeb42d + '/StartCountdown');
      _0x2eca14.on("value", _0x191ae7 => {
        const _0x2f55f0 = _0x191ae7.val()?.['countdown'];
        if (_0x2f55f0 === 0x1) {
          let _0x17f514 = 0x5;
          document.getElementById("StartICountdown").textContent = '00:0' + _0x17f514;
          _0x369c50 = setInterval(() => {
            _0x17f514--;
            document.getElementById("StartICountdown").textContent = "00:0" + _0x17f514;
            if (_0x17f514 <= 0x0) {
              clearInterval(_0x369c50);
              document.getElementById("StartICountdown").textContent = '00:00';
            }
          }, 0x3e8);
        }
      });
      _0x3ebe94.on("value", _0x32694d => {
        const _0x5e5dbe = _0x32694d.val().SpacingMusic;
        if (_0x5e5dbe === true) {
          document.getElementById("audio_Spacing").currentTime = 0x0;
          document.getElementById('audio_Spacing').play();
        }
      });
    });
  });