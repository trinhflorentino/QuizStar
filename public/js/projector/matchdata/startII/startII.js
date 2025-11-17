auth.onAuthStateChanged(_0x3d158a => {
    if (!_0x3d158a) {
      return;
    }
    const _0x814a77 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x814a77.onSnapshot(_0x348de9 => {
      if (!_0x348de9.exists) {
        return;
      }
      const _0x36708d = _0x348de9.data().match;
      var _0x34ed95 = realtimeDB.ref(_0x36708d + "/KDO22Turn");
      var _0x33af0d = realtimeDB.ref(_0x36708d + "/phanthistatus/khoidongo22");
      var _0x2393c9 = realtimeDB.ref(_0x36708d + "/StartIIBuzzer");
      var _0x2d6a7c = realtimeDB.ref(_0x36708d + '/StartIIBuzzer/startTime');
      var _0x24f477 = realtimeDB.ref(_0x36708d + "/KDO22Chuong/CorrectOrWrong");
      var _0x4c182a = realtimeDB.ref(_0x36708d + "/KDO22LuotThiStatus");
      var _0x5a75ad = realtimeDB.ref(_0x36708d + '/gamestatus/khoidongo22');
      var _0x4a6531 = realtimeDB.ref(_0x36708d + '/KDO223sCountdown');
      var _0x57a955 = realtimeDB.ref(_0x36708d + '/KDO225sCountdown');
      var _0x2ce403 = realtimeDB.ref(_0x36708d + "/Sounds");
      var _0x2d3bc9;
      var _0x408436;
      var _0x196d58;
      const _0xb2d691 = {
        'phase1': document.getElementById("audio_StartIIStartingTimes_Phase1"),
        'phase2': document.getElementById("audio_StartIIStartingTimes_Phase2"),
        'phase3': document.getElementById("audio_StartIIStartingTimes_Phase3"),
        'finish': document.getElementById("audio_StartingFinish")
      };
      let _0x543cd7 = false;
      let _0x303050 = null;
      let _0x5776b7 = null;
      let _0x1a02b9 = 0x0;
      let _0x2960aa = null;
      _0x33af0d.on('value', _0x500907 => {
        const _0x35c490 = _0x500907.val()?.["batdau"];
        if (_0x35c490 === 0x1) {
          const _0x5e3256 = document.getElementById("audio_StartQuestionShow");
          const _0x11359e = document.getElementById("audio_StartStartQuestionShow");
          _0x5e3256.currentTime = 0x0;
          _0x5e3256?.['play']();
          setTimeout(() => {
            _0x11359e.currentTime = 0x0;
            _0x11359e?.["play"]();
            document.getElementById("Title").classList.add("hidden");
            document.getElementById('StartII').classList.remove("hidden");
          }, 0xe10);
          Object.values(_0xb2d691).forEach(_0x4462c4 => {
            if (_0x4462c4) {
              _0x4462c4.currentTime = 0x0;
            }
          });
          const _0x3947f1 = document.getElementById('startIIPlayerContainer');
          if (_0x3947f1) {
            Array.from(_0x3947f1.children).forEach(_0x16158b => {
              _0x16158b.classList.remove("startPlayerContainer");
              _0x16158b.classList.add('startPlayerHighlightContainer');
              if (projectorConfigData.startPlayerContainer === '' || projectorConfigData.startPlayerContainer === undefined) {
                applyStyle(_0x16158b, "background", defaultConfig.startPlayerContainer);
              } else {
                applyStyle(_0x16158b, 'background', projectorConfigData.startPlayerContainer);
              }
            });
          }
        } else {
          document.getElementById('StartII').classList.add("hidden");
          document.getElementById("Title").classList.remove("hidden");
        }
      });
      _0x34ed95.on("value", _0x46b48e => {
        const _0x417b35 = _0x46b48e.val().turn;
        if (window.currentStartIIQuestionNumberRef) {
          window.currentStartIIQuestionNumberRef.off();
        }
        if (window.currentStartIIQuestionRef) {
          window.currentStartIIQuestionRef.off();
        }
        if (window.currentStartIIAnswerRef) {
          window.currentStartIIAnswerRef.off();
        }
        const _0x2b5f20 = realtimeDB.ref(_0x36708d + '/KDO22Causo');
        window.currentStartIIQuestionNumberRef = _0x2b5f20;
        _0x2b5f20.on("value", _0xa60b08 => {
          const _0x259621 = _0xa60b08.val().causo;
          _0x5776b7 = null;
          _0x1a02b9 = 0x0;
          if (_0x2960aa) {
            clearTimeout(_0x2960aa);
            _0x2960aa = null;
          }
          const _0x31d740 = realtimeDB.ref(_0x36708d + "/KDO22Question/L" + _0x417b35 + '/cau' + _0x259621);
          const _0x231951 = realtimeDB.ref(_0x36708d + "/KDO22Question/L" + _0x417b35 + "/dacau" + _0x259621);
          window.currentStartIIQuestionRef = _0x31d740;
          window.currentStartIIAnswerRef = _0x231951;
          clearInterval(_0x2d3bc9);
          clearInterval(_0x408436);
          clearInterval(_0x196d58);
          document.getElementById("StartIICountdown").textContent = '';
          window.stopCurrentQuestionAudio(_0xb2d691);
          const _0x3a33cf = document.getElementById('StartIIQuestionNumber');
          if (_0x259621 === 0x0) {
            _0x3a33cf.textContent = "Đang chờ phần thi";
          } else {
            const _0x1adc96 = {
              0x1: 0xc,
              0x2: 0x19,
              0x3: 0x23
            };
            if (_0x259621 === 0xd && _0x417b35 === 0x1 || _0x259621 === 0x1a && _0x417b35 === 0x2 || _0x259621 === 0x24 && _0x417b35 === 0x3) {
              _0x3a33cf.textContent = "Đã hoàn thành lượt thi";
            } else if (_0x1adc96[_0x417b35]) {
              _0x3a33cf.textContent = "Câu " + _0x259621 + '/' + _0x1adc96[_0x417b35];
            }
          }
          _0x31d740.on("value", async _0x5bc01c => {
            const _0x15ed8e = _0x5bc01c.val();
            document.getElementById("StartIIQuestion").textContent = _0x15ed8e;
            if (_0x259621 > 0x0 && _0x417b35 > 0x0) {
              try {
                console.log("Loading media for StartII L" + _0x417b35 + " question " + _0x259621);
                const _0x162a58 = await getQuestionMedia("KDO22Question", 'L' + _0x417b35, _0x259621);
                await window.displayQuestionImage(_0x162a58.image, document.getElementById('StartIIQuestionImage'), document.getElementById("StartIIMediaContainer"));
              } catch (_0xf7e212) {
                console.error("Error loading StartII media:", _0xf7e212);
              }
            } else {
              const _0x274b48 = document.getElementById("StartIIMediaContainer");
              if (_0x274b48) {
                _0x274b48.classList.add("hidden");
              }
            }
            _0x2ce403.on("value", _0xd47f9b => {
              const _0x46fa3a = _0xd47f9b.val();
              if (_0x46fa3a?.['EnglishVoice'] && _0x15ed8e) {
                _0x5a75ad.once("value", _0x405255 => {
                  if (_0x405255.val().khoidongo22 === 0x1) {
                    speakText(_0x15ed8e);
                  }
                });
              }
            });
          });
          if (_0x259621 > 0x0) {
            const _0x4d8b82 = {
              0x1: 0xc,
              0x2: 0x19,
              0x3: 0x23
            };
            const _0x4d193c = _0x4d8b82[_0x417b35];
            const _0x4f3fa4 = Math.round(0.7272727272727273 * (_0x4d193c - 0x1));
            let _0x4fed6c;
            if (_0x259621 === _0x4d193c) {
              _0x4fed6c = "phase3";
            } else if (_0x259621 <= _0x4f3fa4) {
              _0x4fed6c = "phase1";
            } else {
              _0x4fed6c = 'phase2';
            }
            if (_0x303050 !== _0x4fed6c) {
              Object.values(_0xb2d691).forEach(_0x43c38c => {
                if (_0x43c38c) {
                  _0x43c38c.pause();
                  _0x43c38c.currentTime = 0x0;
                }
              });
              _0xb2d691[_0x4fed6c]?.["play"]();
              _0x303050 = _0x4fed6c;
            }
          } else {
            Object.values(_0xb2d691).forEach(_0xe4714e => {
              if (_0xe4714e) {
                _0xe4714e.pause();
                _0xe4714e.currentTime = 0x0;
              }
            });
            _0x303050 = null;
          }
        });
      });
      _0x2393c9.on("value", _0x3786a3 => {
        function _0x187d0f(_0x221517) {
          _0x221517.style.background = '';
          const _0x20ee96 = Array.from(_0x221517.classList).filter(_0x449da1 => _0x449da1.startsWith("bg-") || _0x449da1.startsWith("text-") || _0x449da1.startsWith('from-') || _0x449da1.startsWith("via-") || _0x449da1.startsWith('to-') || _0x449da1.startsWith('accent-'));
          _0x20ee96.forEach(_0x2d3dc5 => _0x221517.classList.remove(_0x2d3dc5));
        }
        if (!_0x3786a3.exists()) {
          console.log("No buzzer entries yet");
          _0x5776b7 = null;
          _0x1a02b9 = 0x0;
          if (_0x2960aa) {
            clearTimeout(_0x2960aa);
            _0x2960aa = null;
          }
          const _0x549f91 = document.getElementById("startIIPlayerContainer");
          Array.from(_0x549f91.children).forEach(_0x500b0c => {
            _0x500b0c.classList.remove("startPlayerHighlightContainer");
            _0x500b0c.classList.add("startPlayerContainer");
            _0x187d0f(_0x500b0c);
            if (projectorConfigData.startPlayerContainer === '' || projectorConfigData.startPlayerContainer === undefined) {
              applyStyle(_0x500b0c, "background", defaultConfig.startPlayerContainer);
            } else {
              applyStyle(_0x500b0c, 'background', projectorConfigData.startPlayerContainer);
            }
          });
          return;
        }
        let _0x4e28f1 = 0x0;
        _0x3786a3.forEach(_0x70c1af => {
          if (_0x70c1af.key !== 'startTime') {
            _0x4e28f1++;
          }
        });
        if (_0x4e28f1 <= _0x1a02b9) {
          console.log("No new buzzer entries. Current: " + _0x4e28f1 + ", Last processed: " + _0x1a02b9);
          return;
        }
        console.log("Buzzer update detected. Entries: " + _0x4e28f1 + ", Last processed: " + _0x1a02b9);
        if (_0x2960aa) {
          clearTimeout(_0x2960aa);
        }
        _0x2960aa = setTimeout(() => {
          console.log("Processing batched buzzer update. Final entries: " + _0x4e28f1);
          _0x1a02b9 = _0x4e28f1;
          _0x2d6a7c.once("value", _0x8bbc37 => {
            const _0x120f43 = _0x8bbc37.val();
            let _0x5ca5be = {
              'timestamp': Infinity,
              'id': null
            };
            let _0xba6d28 = {};
            _0x3786a3.forEach(_0x3dee87 => {
              if (_0x3dee87.key === 'startTime') {
                return;
              }
              const _0x17454c = _0x3dee87.val();
              if (!_0x17454c || !_0x17454c.id || !_0x17454c.buzzerTimestamp) {
                return;
              }
              const _0x3bc804 = _0x17454c.buzzerTimestamp;
              if (_0x120f43 && _0x3bc804 < _0x120f43) {
                return;
              }
              console.log("Buzzer press:", {
                'id': _0x17454c.id,
                'timestamp': _0x3bc804
              });
              if (!_0xba6d28[_0x17454c.id] || _0x3bc804 < _0xba6d28[_0x17454c.id]) {
                _0xba6d28[_0x17454c.id] = _0x3bc804;
              }
            });
            Object.entries(_0xba6d28).forEach(([_0x27d54e, _0x336330]) => {
              if (_0x336330 < _0x5ca5be.timestamp) {
                _0x5ca5be = {
                  'timestamp': _0x336330,
                  'id': _0x27d54e
                };
              }
            });
            console.log("Final fastest player: " + _0x5ca5be.id + ", Last fastest: " + _0x5776b7);
            if (_0x5ca5be.id !== null && _0x5ca5be.id !== _0x5776b7) {
              _0x5776b7 = _0x5ca5be.id;
              console.log("Setting final fastest player: " + _0x5ca5be.id);
              const _0x36f2fa = document.getElementById("audio_StartIIAnswerGranted");
              if (_0x36f2fa) {
                _0x36f2fa.currentTime = 0x0;
                _0x36f2fa.play();
              }
              clearInterval(_0x2d3bc9);
              clearInterval(_0x408436);
              clearInterval(_0x196d58);
              document.getElementById("StartIICountdown").textContent = '';
              const _0x3c9d56 = document.getElementById('startIIPlayerContainer');
              if (_0x3c9d56) {
                const _0x4f0afc = parseInt(_0x5ca5be.id, 0xa) - 0x1;
                if (_0x4f0afc >= 0x0 && _0x4f0afc < _0x3c9d56.children.length) {
                  Array.from(_0x3c9d56.children).forEach((_0x45012b, _0x501192) => {
                    _0x187d0f(_0x45012b);
                    if (_0x501192 === _0x4f0afc) {
                      _0x45012b.classList.remove("startPlayerContainer");
                      _0x45012b.classList.add('startPlayerHighlightContainer');
                      if (projectorConfigData.startPlayerHighlightContainer === '' || projectorConfigData.startPlayerHighlightContainer === undefined) {
                        applyStyle(_0x45012b, "background", defaultConfig.startPlayerHighlightContainer);
                      } else {
                        applyStyle(_0x45012b, 'background', projectorConfigData.startPlayerHighlightContainer);
                      }
                    } else {
                      _0x45012b.classList.remove("startPlayerHighlightContainer");
                      _0x45012b.classList.add("startPlayerContainer");
                      if (projectorConfigData.startPlayerContainer === '' || projectorConfigData.startPlayerContainer === undefined) {
                        applyStyle(_0x45012b, 'background', defaultConfig.startPlayerContainer);
                      } else {
                        applyStyle(_0x45012b, 'background', projectorConfigData.startPlayerContainer);
                      }
                    }
                  });
                }
              }
            } else {
              if (_0x5ca5be.id === null) {
                const _0x2824e0 = getPlayerLimit();
                for (let _0x3705f0 = 0x1; _0x3705f0 <= _0x2824e0; _0x3705f0++) {
                  const _0x2991cc = document.getElementById("startIIPlayer" + _0x3705f0 + "BuzzerContainer");
                  if (_0x2991cc) {
                    _0x2991cc.style.backgroundColor = '';
                  }
                }
                _0x5776b7 = null;
              } else {
                console.log("Same fastest player (" + _0x5ca5be.id + "), no update needed");
              }
            }
          });
          _0x2960aa = null;
        }, 0x32);
      });
      _0x24f477.on('value', _0x57e2a5 => {
        const _0x21309e = _0x57e2a5.val()?.["correctorwrong"];
        if (_0x21309e === 0x1) {
          document.getElementById('audio_StartingRightAnswer').currentTime = 0x0;
          document.getElementById("audio_StartingRightAnswer").play();
        } else if (_0x21309e === 0x2) {
          document.getElementById("audio_StartingWrongAnswer").currentTime = 0x0;
          document.getElementById("audio_StartingWrongAnswer").play();
        }
      });
      _0x4c182a.on("value", _0xb2af07 => {
        const _0x54de02 = _0xb2af07.val()?.['status'];
        if (_0x54de02 === 0x0) {
          document.getElementById('audio_StartIIFinish').currentTime = 0x0;
          document.getElementById('audio_StartIIFinish').play();
        }
      });
      _0x4a6531.on("value", _0x5e1ef8 => {
        var _0x5cf614 = _0x5e1ef8.val();
        var _0x1c92ab = _0x5cf614?.['countdown'];
        var _0x212deb = _0x5cf614?.['startTime'];
        if (_0x1c92ab === 0x1 && _0x212deb) {
          clearInterval(_0x2d3bc9);
          clearInterval(_0x408436);
          clearInterval(_0x196d58);
          _0x543cd7 = false;
          firebase.database().ref('.info/serverTimeOffset').once("value").then(_0x44d823 => {
            const _0x16d7da = _0x44d823.val();
            _0x2d3bc9 = setInterval(() => {
              const _0x391968 = Date.now() + _0x16d7da;
              const _0x16fbb6 = (_0x391968 - _0x212deb) / 0x3e8;
              const _0x592211 = Math.max(0x0, 0x3 - Math.floor(_0x16fbb6));
              if (_0x592211 > 0x0) {} else {
                clearInterval(_0x2d3bc9);
                document.getElementById("StartIICountdown").textContent = '';
                _0x543cd7 = true;
              }
            }, 0x64);
          });
        }
      });
      _0x57a955.on('value', _0x33ce97 => {
        var _0x2c1466 = _0x33ce97.val();
        var _0x5554b3 = _0x2c1466?.["countdown"];
        var _0x141a8e = _0x2c1466?.["type"];
        var _0x3f1075 = _0x2c1466?.['startTime'];
        if (_0x5554b3 === 0x1 && _0x3f1075 && _0x141a8e) {
          clearInterval(_0x408436);
          clearInterval(_0x196d58);
          firebase.database().ref(".info/serverTimeOffset").once("value").then(_0x5f35d5 => {
            const _0x25a24a = _0x5f35d5.val();
            _0x408436 = setInterval(() => {
              const _0x2a13ee = Date.now() + _0x25a24a;
              const _0x2f55eb = (_0x2a13ee - _0x3f1075) / 0x3e8;
              const _0xafbf33 = Math.max(0x0, 0x5 - Math.floor(_0x2f55eb));
              if (_0xafbf33 <= 0x3 && _0xafbf33 > 0x0) {
                document.getElementById("StartIICountdown").textContent = '' + _0xafbf33;
              } else {
                if (_0xafbf33 <= 0x0) {
                  clearInterval(_0x408436);
                  document.getElementById("StartIICountdown").textContent = '';
                  if (_0x141a8e === 'disable_buzzer') {
                    _0x543cd7 = false;
                  }
                } else if (_0xafbf33 > 0x3) {
                  document.getElementById("StartIICountdown").textContent = '';
                }
              }
            }, 0x64);
          });
        }
      });
      const _0x3699d7 = realtimeDB.ref(_0x36708d + '/AudioControl/startII');
      _0x3699d7.on("value", _0x39f84e => {
        if (_0x39f84e.exists()) {
          const _0x1b5491 = _0x39f84e.val();
          if (_0x1b5491.isPlaying && _0x1b5491.audioData) {
            window.stopCurrentQuestionAudio(_0xb2d691);
            window.playQuestionAudio(_0x1b5491.audioData, _0xb2d691);
          } else {
            window.stopCurrentQuestionAudio(_0xb2d691);
          }
        }
      });
    });
  });