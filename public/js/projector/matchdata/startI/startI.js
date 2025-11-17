auth.onAuthStateChanged(_0x5a58d3 => {
    if (!_0x5a58d3) {
      return;
    }
    const _0x52322f = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x52322f.onSnapshot(_0xa8385a => {
      if (!_0xa8385a.exists) {
        return;
      }
      const _0x12a61a = _0xa8385a.data().match;
      let _0x115c52;
      const _0x1d3099 = realtimeDB.ref(_0x12a61a + '/gamestatus/khoidong');
      const _0x3fa64b = realtimeDB.ref(_0x12a61a + "/playerstatus/khoidong");
      const _0x25f404 = realtimeDB.ref(_0x12a61a + "/phanthistatus/khoidong");
      const _0x2fa89c = realtimeDB.ref(_0x12a61a + "/khoidongdungsai");
      const _0x575369 = realtimeDB.ref(_0x12a61a + '/Sounds');
      const _0x46314f = {
        'phase1': document.getElementById("audio_StartingTimes_Phase1"),
        'phase2': document.getElementById("audio_StartingTimes_Phase2"),
        'phase3': document.getElementById("audio_StartingTimes_Phase3"),
        'finish': document.getElementById('audio_StartingFinish')
      };
      _0x25f404.on("value", _0x88ba29 => {
        const _0x4b6a44 = _0x88ba29.val()?.['batdau'];
        if (_0x4b6a44 === 0x1) {
          const _0x4a95e4 = document.getElementById('audio_StartQuestionShow');
          const _0x40d418 = document.getElementById("audio_StartStartQuestionShow");
          _0x4a95e4.currentTime = 0x0;
          _0x4a95e4?.['play']();
          isEnd = false;
          setTimeout(() => {
            _0x40d418.currentTime = 0x0;
            _0x40d418?.["play"]();
            document.getElementById('Title').classList.add('hidden');
            document.getElementById("StartI").classList.remove('hidden');
          }, 0xe10);
          Object.values(_0x46314f).forEach(_0x1d1131 => {
            if (_0x1d1131) {
              _0x1d1131.currentTime = 0x0;
            }
          });
        } else {
          document.getElementById("StartI").classList.add('hidden');
          document.getElementById("Title").classList.remove("hidden");
          if (!window.finishAudioPlayedBefore) {
            window.finishAudioPlayedBefore = true;
          } else {
            setTimeout(() => {
              _0x46314f.finish?.["play"]();
            }, 0xc8);
          }
        }
      });
      _0x2fa89c.on('value', _0x1ea0a1 => {
        const _0x34ba78 = document.getElementById('audio_StartingRightAnswer');
        const _0x12ff82 = document.getElementById('audio_StartingWrongAnswer');
        if (_0x1ea0a1.val().dung === 0x1) {
          _0x34ba78.currentTime = 0x0;
          _0x34ba78.play();
        }
        if (_0x1ea0a1.val().sai === 0x1) {
          _0x12ff82.currentTime = 0x0;
          _0x12ff82.play();
        }
      });
      _0x3fa64b.on('value', _0x3cdc6d => {
        const _0x3773d1 = _0x3cdc6d.val();
        if (_0x3773d1?.["player"] !== undefined) {
          const _0x686955 = _0x3773d1.player;
          ['currentStartIQuestionNumberRef', "currentStartIQuestionRef", "currentStartIAnswerRef"].forEach(_0x897efb => {
            if (window[_0x897efb]) {
              window[_0x897efb].off();
            }
          });
          const _0x1eb237 = realtimeDB.ref(_0x12a61a + '/khoidong');
          window.currentStartIQuestionNumberRef = _0x1eb237;
          _0x1eb237.on("value", _0x22a50a => {
            const _0x132b44 = _0x22a50a.val()?.["causo"];
            const _0x134d83 = realtimeDB.ref(_0x12a61a + "/StartQuestion/Q" + _0x686955 + "DB/cau" + _0x132b44);
            const _0x490cc2 = realtimeDB.ref(_0x12a61a + "/StartQuestion/Q" + _0x686955 + "DB/dacau" + _0x132b44);
            window.currentStartIQuestionRef = _0x134d83;
            window.currentStartIAnswerRef = _0x490cc2;
            clearInterval(_0x115c52);
            document.getElementById('StartICountdown').textContent = '';
            window.stopCurrentQuestionAudio(_0x46314f);
            const _0xede38c = document.getElementById('StartIQuestionNumber');
            if (_0x132b44 === 0x0) {
              _0xede38c.textContent = "Đang chờ phần thi";
            } else if (_0x132b44 === 0x7) {
              _0xede38c.textContent = "Đã hoàn thành";
            } else {
              _0xede38c.textContent = "Câu " + _0x132b44 + '/6';
            }
            const _0x5a21ad = document.getElementById("startPlayerContainer");
            if (_0x5a21ad) {
              const _0x5ec676 = parseInt(_0x686955, 0xa) - 0x1;
              console.log(_0x5ec676);
              function _0x5141a1(_0x4f21e1) {
                _0x4f21e1.style.background = '';
                const _0x51007b = Array.from(_0x4f21e1.classList).filter(_0xbe54b5 => _0xbe54b5.startsWith("bg-") || _0xbe54b5.startsWith("text-") || _0xbe54b5.startsWith('from-') || _0xbe54b5.startsWith("via-") || _0xbe54b5.startsWith('to-') || _0xbe54b5.startsWith("accent-"));
                _0x51007b.forEach(_0x132383 => _0x4f21e1.classList.remove(_0x132383));
              }
              if (_0x5ec676 === -0x1) {
                Array.from(_0x5a21ad.children).forEach(_0x4af34a => {
                  _0x4af34a.classList.remove("startPlayerHighlightContainer");
                  _0x4af34a.classList.add("startPlayerContainer");
                  _0x5141a1(_0x4af34a);
                  if (projectorConfigData.startPlayerContainer === '' || projectorConfigData.startPlayerContainer === undefined) {
                    applyStyle(_0x4af34a, "background", defaultConfig.startPlayerContainer);
                  } else {
                    applyStyle(_0x4af34a, 'background', projectorConfigData.startPlayerContainer);
                  }
                });
              } else if (_0x5ec676 >= 0x0 && _0x5ec676 < _0x5a21ad.children.length) {
                Array.from(_0x5a21ad.children).forEach((_0x4ad97a, _0x41dca2) => {
                  _0x5141a1(_0x4ad97a);
                  if (_0x41dca2 === _0x5ec676) {
                    _0x4ad97a.classList.remove("startPlayerContainer");
                    _0x4ad97a.classList.add("startPlayerHighlightContainer");
                    if (projectorConfigData.startPlayerHighlightContainer === '' || projectorConfigData.startPlayerHighlightContainer === undefined) {
                      applyStyle(_0x4ad97a, "background", defaultConfig.startPlayerHighlightContainer);
                    } else {
                      applyStyle(_0x4ad97a, "background", projectorConfigData.startPlayerHighlightContainer);
                    }
                  } else {
                    _0x4ad97a.classList.remove("startPlayerHighlightContainer");
                    _0x4ad97a.classList.add("startPlayerContainer");
                    if (projectorConfigData.startPlayerContainer === '' || projectorConfigData.startPlayerContainer === undefined) {
                      applyStyle(_0x4ad97a, 'background', defaultConfig.startPlayerContainer);
                    } else {
                      applyStyle(_0x4ad97a, "background", projectorConfigData.startPlayerContainer);
                    }
                  }
                });
              }
            }
            _0x134d83.on("value", async _0x30c223 => {
              const _0x160e17 = _0x30c223.val();
              document.getElementById("StartIQuestion").textContent = _0x160e17;
              try {
                console.log("Loading media for StartI Q" + _0x686955 + "DB question " + _0x132b44);
                const _0x51c782 = await getQuestionMedia("StartQuestion", 'Q' + _0x686955 + 'DB', _0x132b44);
                await displayQuestionImage(_0x51c782.image, document.getElementById("StartIQuestionImage"), document.getElementById("StartIMediaContainer"));
              } catch (_0x4ffbe2) {
                console.error("Error loading StartI media:", _0x4ffbe2);
              }
              _0x575369.on("value", _0x12db1a => {
                const _0x1c4992 = _0x12db1a.val();
                if (_0x1c4992?.['EnglishVoice'] && _0x160e17) {
                  _0x1d3099.once("value", _0x591bb7 => {
                    if (_0x591bb7.val().khoidong === 0x1) {
                      speakText(_0x160e17);
                    }
                  });
                }
              });
            });
            Object.values(_0x46314f).forEach(_0x999b3e => _0x999b3e?.["pause"]() && (_0x999b3e.currentTime = 0x0));
            if (_0x132b44 > 0x0 && _0x132b44 < 0x4) {
              _0x46314f.phase1?.["play"]();
            }
            if (_0x132b44 > 0x3 && _0x132b44 < 0x6) {
              _0x46314f.phase2?.["play"]();
            }
            if (_0x132b44 === 0x6) {
              _0x46314f.phase3?.["play"]();
            }
          });
        }
      });
      const _0x13156b = realtimeDB.ref(_0x12a61a + "/StartCountdown");
      _0x13156b.on("value", _0x30e6f4 => {
        const _0x45a323 = _0x30e6f4.val()?.["countdown"];
        if (_0x45a323 === 0x1) {
          if (_0x115c52) {
            clearInterval(_0x115c52);
          }
          let _0x3baf66 = 0x5;
          document.getElementById("StartICountdown").textContent = '' + _0x3baf66;
          _0x115c52 = setInterval(() => {
            _0x3baf66--;
            document.getElementById("StartICountdown").textContent = '' + _0x3baf66;
            if (_0x3baf66 <= 0x0) {
              clearInterval(_0x115c52);
              document.getElementById('StartICountdown').textContent = '';
            }
          }, 0x3e8);
        }
      });
      const _0x1624d1 = realtimeDB.ref(_0x12a61a + '/AudioControl/startI');
      _0x1624d1.on("value", _0x12e899 => {
        if (_0x12e899.exists()) {
          const _0x1c3467 = _0x12e899.val();
          if (_0x1c3467.isPlaying && _0x1c3467.audioData) {
            window.stopCurrentQuestionAudio(_0x46314f);
            window.playQuestionAudio(_0x1c3467.audioData, _0x46314f);
          } else {
            window.stopCurrentQuestionAudio(_0x46314f);
          }
        }
      });
    });
  });