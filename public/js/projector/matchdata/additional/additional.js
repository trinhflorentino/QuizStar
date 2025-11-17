auth.onAuthStateChanged(_0x20c191 => {
    if (!_0x20c191) {
      return;
    }
    const _0x25d81b = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x25d81b.onSnapshot(_0x775ce1 => {
      if (!_0x775ce1.exists) {
        return;
      }
      const _0x12df2d = _0x775ce1.data().match;
      const _0x464e12 = realtimeDB.ref(_0x12df2d + "/AdditionalPlayerSelected");
      const _0x149a75 = realtimeDB.ref(_0x12df2d + "/AdditionalBuzzer");
      const _0x2ce434 = realtimeDB.ref(_0x12df2d + "/VDPCauso/causo");
      const _0x24426b = realtimeDB.ref(_0x12df2d + "/phanthistatus/vedichphu");
      const _0x592e09 = realtimeDB.ref(_0x12df2d + "/AdditionalDisabledId");
      const _0x2fc930 = realtimeDB.ref(_0x12df2d + "/AdditionalBuzzer/State");
      const _0x405be6 = realtimeDB.ref(_0x12df2d + '/gamestatus/vedichphu');
      const _0x572223 = realtimeDB.ref(_0x12df2d + "/Sounds");
      let _0x38dbb1 = null;
      let _0xda3ec8 = null;
      let _0x3d02ef = 0xf;
      let _0x659127 = false;
      let _0x40a202 = false;
      let _0xe78ddb = false;
      const _0x53ea2e = localStorage.getItem("isCompactUI") === 'true';
      _0xda3ec8 = document.getElementById("audio_AdditionalRound");
      _0x405be6.on("value", _0x397dce => {
        if (_0x397dce.exists() && _0x397dce.val().vedichphu === 0x0) {
          _0x659127 = true;
        } else {
          _0x659127 = false;
        }
      });
      const _0x5dfd71 = () => {
        const _0x5e9018 = document.getElementById("AdditionalSlider");
        if (!_0x5e9018) {
          return;
        }
        const _0x5f65bf = (0xf - _0x3d02ef) / 0xf * 0x64;
        _0x5e9018.value = _0x5f65bf;
      };
      const _0x5e1921 = () => {
        _0x3d02ef = 0xf;
        _0x5dfd71();
      };
      const _0x46d91d = () => {
        if (_0x38dbb1 || _0x659127) {
          return;
        }
        if (!_0xe78ddb) {
          _0x5e1921();
        }
        _0xe78ddb = false;
        if (_0xda3ec8 && _0xda3ec8.paused) {
          _0xda3ec8.play();
        }
        let _0x501f2a = performance.now();
        const _0xe55118 = (0xf - _0x3d02ef) * 0x3e8;
        _0x501f2a = _0x501f2a - _0xe55118;
        const _0x9f92e8 = _0x23dbce => {
          if (!_0x38dbb1) {
            return;
          }
          let _0x2c782a = _0x23dbce - _0x501f2a;
          _0x3d02ef = Math.max(0x0, 0xf - _0x2c782a / 0x3e8);
          _0x5dfd71();
          if (_0x2c782a < 0x3a98) {
            _0x38dbb1 = requestAnimationFrame(_0x9f92e8);
          } else {
            _0x38dbb1 = null;
          }
        };
        _0x38dbb1 = requestAnimationFrame(_0x9f92e8);
      };
      const _0x7ba525 = () => {
        if (_0x38dbb1) {
          cancelAnimationFrame(_0x38dbb1);
          _0x38dbb1 = null;
          _0xe78ddb = true;
        }
        if (_0xda3ec8 && !_0xda3ec8.paused) {
          _0xda3ec8.pause();
        }
      };
      _0x24426b.on("value", _0x197a75 => {
        const _0xc22bb6 = _0x197a75.val()?.['batdau'];
        if (_0xc22bb6 === 0x1) {
          _0x40a202 = true;
          _0xe78ddb = false;
          _0x3d02ef = 0xf;
          if (!_0xda3ec8) {
            _0xda3ec8 = document.getElementById("audio_AdditionalRound");
          }
          _0x46d91d();
        }
      });
      _0x149a75.on("value", _0x4fd71d => {
        if (_0x4fd71d.exists()) {
          _0x7ba525();
        } else if (_0x3d02ef > 0x0 && !_0x38dbb1 && !_0x659127) {
          _0x46d91d();
        }
      });
      const _0x572977 = document.getElementById('AdditionalQuestionNumber');
      const _0x30f13f = document.getElementById("AdditionalQuestion");
      const _0xee2a2e = document.getElementById("AdditionalQuestionImage");
      const _0x4636c4 = document.getElementById("AdditionalMediaContainer");
      const _0x353747 = document.getElementById("audio_AccelerationQuestionShow");
      let _0x170726 = null;
      let _0x26cf8e = null;
      let _0x1dbb48 = false;
      let _0x1f1b82 = null;
      let _0xdfa8ec = 0x0;
      function _0x37203e() {
        if (_0x1dbb48) {
          return;
        }
        _0x1f1b82 = _0x2865cc => {
          const _0x4d5db4 = _0x2865cc.val();
          const _0x4dc085 = _0x30f13f?.['textContent']?.["trim"]();
          if (_0x4d5db4?.['EnglishVoice'] && _0x4dc085) {
            _0x405be6.once("value", _0x296589 => {
              const _0x54cf54 = _0x296589.val() || {};
              if (_0x54cf54?.['vedichphu'] === 0x1) {
                try {
                  speakText(_0x4dc085);
                } catch (_0x5af496) {
                  console.error("speakText error:", _0x5af496);
                }
              }
            });
          }
        };
        _0x572223.on('value', _0x1f1b82);
        _0x1dbb48 = true;
      }
      function _0x3e0507() {
        if (_0x170726 && _0x26cf8e) {
          _0x26cf8e();
          _0x26cf8e = null;
        }
        _0x170726 = null;
      }
      function _0x43025a() {
        if (_0x38dbb1) {
          cancelAnimationFrame(_0x38dbb1);
          _0x38dbb1 = null;
        }
        if (_0xda3ec8) {
          try {
            _0xda3ec8.pause();
            _0xda3ec8.currentTime = 0x0;
          } catch (_0x4d2eca) {
            console.warn("Failed to reset currentAudioRound:", _0x4d2eca);
          }
        }
      }
      _0x2ce434.on('value', async _0x11ea67 => {
        const _0xe7fc92 = _0x11ea67.val();
        const _0x1696ce = ++_0xdfa8ec;
        _0x43025a();
        if (_0x572977) {
          _0x572977.textContent = _0xe7fc92 ?? '';
        }
        if (!_0xe7fc92 || _0xe7fc92 <= 0x0) {
          if (typeof window.stopCurrentQuestionAudio === "function") {
            try {
              window.stopCurrentQuestionAudio();
            } catch (_0x220904) {}
          }
          if (_0x30f13f) {
            _0x30f13f.textContent = '';
          }
          if (_0xee2a2e) {
            _0xee2a2e.src = '';
          }
          if (_0x4636c4) {
            _0x4636c4.classList.add('hidden');
          }
          _0x3e0507();
          return;
        }
        if (_0x353747) {
          try {
            _0x353747.currentTime = 0x0;
            const _0x4bed0d = _0x353747.play();
            if (_0x4bed0d && typeof _0x4bed0d["catch"] === "function") {
              _0x4bed0d["catch"](() => {});
            }
          } catch {}
        }
        try {
          const _0x34261c = await getQuestionMedia("CHPQuestion", 'additional', _0xe7fc92);
          if (_0x1696ce !== _0xdfa8ec) {
            return;
          }
          await displayQuestionImage(_0x34261c?.["image"], _0xee2a2e, _0x4636c4);
        } catch (_0x47ca4e) {
          console.error("Error loading question media:", _0x47ca4e);
        }
        if (typeof _0x5e1921 === "function") {
          _0x5e1921();
        }
        _0xe78ddb = false;
        _0x3e0507();
        const _0x3f25cc = _0x12df2d + "/CHPQuestion/cau" + _0xe7fc92;
        _0x170726 = realtimeDB.ref(_0x3f25cc);
        const _0x100f00 = _0x2d4d93 => {
          const _0x5006b5 = _0x2d4d93.val();
          if (_0x30f13f) {
            _0x30f13f.textContent = typeof _0x5006b5 === "string" ? _0x5006b5 : _0x5006b5 ?? '';
          }
        };
        _0x170726.on("value", _0x100f00);
        _0x26cf8e = () => _0x170726.off('value', _0x100f00);
        _0x37203e();
      });
      let _0x4312d0 = [];
      _0x592e09.on("value", _0x30f79f => {
        _0x4312d0 = [];
        _0x30f79f.forEach(_0x535c68 => {
          _0x4312d0.push(parseInt(_0x535c68.val(), 0xa));
        });
      });
      let _0x3e1f04 = [];
      _0x464e12.on("value", _0x26fe03 => {
        _0x3e1f04 = [];
        if (!_0x26fe03.exists()) {
          document.getElementById('Additional').classList.add("hidden");
        } else {
          setTimeout(() => {
            document.getElementById("Title").classList.add("hidden");
            document.getElementById('Additional').classList.remove('hidden');
          }, 0xc8);
        }
        _0x26fe03.forEach(_0x5717ce => {
          _0x3e1f04.push(parseInt(_0x5717ce.val(), 0xa));
        });
        const _0x1152fa = document.getElementById("AdditionalPlayerList");
        if (_0x1152fa) {
          _0x1152fa.innerHTML = '';
          _0x3e1f04.forEach((_0x582926, _0x545235, _0x30658b) => {
            realtimeDB.ref(_0x12df2d + '/games/player' + _0x582926).once('value').then(_0x2f6bee => {
              const _0x48025f = _0x2f6bee.val();
              const _0x4b1616 = _0x48025f && _0x48025f.displayName ? _0x48025f.displayName : "Unknown";
              const _0x3eb0d9 = document.createElement("div");
              _0x3eb0d9.className = _0x53ea2e ? "flex-1 bg-white p-2 text-center border-r border-gray-300 last:border-r-0" : "flex-1 bg-white p-4 text-center border-r border-gray-300 last:border-r-0";
              _0x3eb0d9.dataset.playerId = _0x582926;
              if (_0x545235 === 0x0) {
                _0x3eb0d9.classList.add("rounded-tl-md");
              }
              if (_0x545235 === _0x30658b.length - 0x1) {
                _0x3eb0d9.classList.add("rounded-tr-md");
              }
              const _0x1ce30b = document.createElement('p');
              _0x1ce30b.className = _0x53ea2e ? "text-gray-800 font-bold text-md drop-shadow-lg" : "text-gray-800 font-bold text-xl drop-shadow-lg";
              _0x1ce30b.textContent = _0x4b1616;
              _0x3eb0d9.appendChild(_0x1ce30b);
              _0x1152fa.appendChild(_0x3eb0d9);
            })["catch"](_0x63b61a => {
              console.error("Error fetching player data:", _0x63b61a);
            });
          });
        }
      });
      _0x149a75.on('value', _0x39bc4a => {
        if (!_0x39bc4a.exists()) {
          console.log("No buzzer entries yet");
          const _0x4a03f2 = document.getElementById("AdditionalPlayerList");
          if (_0x4a03f2) {
            Array.from(_0x4a03f2.children).forEach(_0x567b31 => {
              _0x567b31.classList.remove("additionalPlayerBuzzerContainer");
              _0x567b31.style.background = '';
              const _0x53cb6a = Array.from(_0x567b31.classList).filter(_0x4a7088 => (_0x4a7088.startsWith("bg-") || _0x4a7088.startsWith("text-") || _0x4a7088.startsWith('from-') || _0x4a7088.startsWith("via-") || _0x4a7088.startsWith("to-") || _0x4a7088.startsWith("accent-")) && _0x4a7088 !== "text-center");
              _0x53cb6a.forEach(_0x4c7b83 => _0x567b31.classList.remove(_0x4c7b83));
              _0x567b31.classList.add('bg-white');
              const _0x1a59a = _0x567b31.querySelector('p');
              if (_0x1a59a) {
                _0x1a59a.classList.remove('text-white');
                _0x1a59a.classList.add("text-gray-800");
              }
            });
          }
          return;
        }
        let _0xfd5db3 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x5c0e93 = {};
        let _0x406a0a = null;
        if (_0x39bc4a.child('startTime').exists()) {
          _0x406a0a = _0x39bc4a.child("startTime").val();
        }
        _0x39bc4a.forEach(_0x333e30 => {
          if (_0x333e30.key === "startTime") {
            return;
          }
          const _0x353038 = _0x333e30.val();
          console.log("Buzzer press:", {
            'id': _0x353038.id,
            'timestamp': _0x353038.buzzerTimestamp
          });
          const _0x240309 = _0x353038.buzzerTimestamp;
          if (_0x406a0a && _0x240309 < _0x406a0a) {
            console.log("Buzzer press before start time, ignoring");
            return;
          }
          if (!_0x5c0e93[_0x353038.id] || _0x240309 < _0x5c0e93[_0x353038.id]) {
            _0x5c0e93[_0x353038.id] = _0x240309;
          }
          if (_0x5c0e93[_0x353038.id] < _0xfd5db3.timestamp) {
            _0xfd5db3 = {
              'timestamp': _0x5c0e93[_0x353038.id],
              'id': _0x353038.id
            };
          }
        });
        console.log("Fastest buzzer:", _0xfd5db3.id);
        console.log("Timestamp:", new Date(_0xfd5db3.timestamp));
        const _0x450e70 = document.getElementById("AdditionalPlayerList");
        if (_0x450e70) {
          function _0x3d1ce2(_0x58601a) {
            _0x58601a.style.background = '';
            const _0x41d565 = Array.from(_0x58601a.classList).filter(_0x74c99d => (_0x74c99d.startsWith("bg-") || _0x74c99d.startsWith("text-") || _0x74c99d.startsWith("from-") || _0x74c99d.startsWith('via-') || _0x74c99d.startsWith("to-") || _0x74c99d.startsWith("accent-")) && _0x74c99d !== "text-center");
            _0x41d565.forEach(_0x1f08da => _0x58601a.classList.remove(_0x1f08da));
          }
          if (_0xfd5db3.id === null) {
            Array.from(_0x450e70.children).forEach(_0x287c56 => {
              _0x287c56.classList.remove("additionalPlayerBuzzerContainer");
              _0x3d1ce2(_0x287c56);
              _0x287c56.classList.add('bg-white');
              const _0x156d37 = _0x287c56.querySelector('p');
              if (_0x156d37) {
                _0x156d37.classList.remove("text-white");
                _0x156d37.classList.add("text-gray-800");
              }
            });
          } else {
            const _0x13e6de = _0x450e70.querySelector("[data-player-id=\"" + _0xfd5db3.id + "\"]");
            Array.from(_0x450e70.children).forEach(_0x2a6da4 => {
              _0x3d1ce2(_0x2a6da4);
              if (_0x2a6da4 === _0x13e6de) {
                _0x2a6da4.classList.add('additionalPlayerBuzzerContainer');
                if (projectorConfigData?.["additionalPlayerBuzzerContainer"] === '' || projectorConfigData?.["additionalPlayerBuzzerContainer"] === undefined) {
                  applyStyle(_0x2a6da4, "background", defaultConfig.additionalPlayerBuzzerContainer);
                } else {
                  applyStyle(_0x2a6da4, "background", projectorConfigData.additionalPlayerBuzzerContainer);
                }
                const _0xcbb4af = _0x2a6da4.querySelector('p');
                if (_0xcbb4af) {
                  _0xcbb4af.classList.add('text-white');
                  _0xcbb4af.classList.remove('text-gray-800');
                }
              } else {
                _0x2a6da4.classList.remove('additionalPlayerBuzzerContainer');
                _0x2a6da4.classList.add("bg-white");
                const _0x3c0455 = _0x2a6da4.querySelector('p');
                if (_0x3c0455) {
                  _0x3c0455.classList.remove("text-white");
                  _0x3c0455.classList.add("text-gray-800");
                }
              }
            });
            if (!_0x39bc4a.val().State) {
              document.getElementById("audio_FinishAnswerGranted").currentTime = 0x0;
              document.getElementById("audio_FinishAnswerGranted").play();
            }
          }
        }
      });
      _0x2fc930.on("value", _0x25a032 => {
        const _0x50338a = _0x25a032.val()?.["state"];
        if (_0x50338a === true) {
          const _0x2a8bb6 = document.getElementById("audio_FinishRightAnswer");
          _0x2a8bb6.currentTime = 0x0;
          _0x2a8bb6.play();
        }
      });
      const _0x46fbc = realtimeDB.ref(_0x12df2d + "/AudioControl/additional");
      _0x46fbc.on("value", _0x57e68d => {
        const _0x345ded = _0x57e68d.val();
        if (!_0x345ded || !_0x345ded.audioData) {
          return;
        }
        if (_0x345ded.isPlaying) {
          window.stopCurrentQuestionAudio();
          setTimeout(() => {
            playQuestionAudio(_0x345ded.audioData);
          }, 0x64);
        } else {
          window.stopCurrentQuestionAudio();
        }
      });
    });
  });