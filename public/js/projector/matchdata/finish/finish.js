auth.onAuthStateChanged(_0x4d5653 => {
    if (!_0x4d5653) {
      return;
    }
    const _0x171f8c = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x171f8c.onSnapshot(_0x1e6d1e => {
      if (!_0x1e6d1e.exists) {
        return;
      }
      const _0x34d7c6 = _0x1e6d1e.data().match;
      var _0x409bb1 = realtimeDB.ref(_0x34d7c6 + '/playerstatus/vedich');
      var _0x1d97c0 = realtimeDB.ref(_0x34d7c6 + "/FinishPoint/status");
      var _0x2d7841 = realtimeDB.ref(_0x34d7c6 + "/VDPlayerTurnEnd/End");
      var _0x3dead2 = realtimeDB.ref(_0x34d7c6 + '/VDCauso');
      var _0x3b708a = realtimeDB.ref(_0x34d7c6 + '/phanthistatus/vedich');
      var _0x1a46c7 = realtimeDB.ref(_0x34d7c6 + "/VDNSHV/status");
      var _0x3b5691 = realtimeDB.ref(_0x34d7c6 + "/VDCorrectOrWrong/");
      var _0x427f19 = realtimeDB.ref(_0x34d7c6 + "/FinishBuzzer/");
      var _0x4ad1d2 = realtimeDB.ref(_0x34d7c6 + "/VDChuong/CorrectOrWrong");
      var _0x28aed3 = realtimeDB.ref(_0x34d7c6 + '/FinishVideoState/VD');
      var _0x163ca3 = realtimeDB.ref(_0x34d7c6 + "/gamestatus/vedich");
      var _0x56aae2 = realtimeDB.ref(_0x34d7c6 + "/EnglishCustomInput");
      var _0x4f1dd9 = realtimeDB.ref(_0x34d7c6 + "/FinishPractice/");
      let _0xf44d00 = null;
      let _0x1aa7e0 = null;
      let _0x115f4f = false;
      let _0x1dbccc;
      let _0xfc8995;
      let _0x582869;
      let _0x47000e;
      _0x409bb1.on("value", _0x2afb89 => {
        const _0x47860e = _0x2afb89.val().player;
        _0xf44d00 = _0x47860e;
        _0x55fc65(_0x47860e);
        _0x3b2277();
        if (_0x47860e === 0x0) {
          document.getElementById("FinishMainUI").classList.add("hidden");
          document.getElementById("Finish").classList.add("hidden");
          _0x53b683();
        } else {
          setTimeout(() => {
            document.getElementById("Title").classList.add("hidden");
            document.getElementById("Finish").classList.remove("hidden");
          }, 0xc8);
          document.getElementById("audio_FinishUserStart").currentTime = 0x0;
          document.getElementById("audio_FinishUserStart").play();
          if (window.currentRefPlayerPoint) {
            window.currentRefPlayerPoint.off();
          }
          window.currentRefPlayerPoint = realtimeDB.ref(_0x34d7c6 + "/point/player" + _0xf44d00);
          window.currentRefPlayerPoint.on("value", _0x395f55 => {
            const _0xdd2b80 = _0x395f55.val().point;
            document.getElementById("FinishPlayerSelectingPoint").textContent = _0xdd2b80;
          });
          _0x5f50e8(0xa, _0x52964c);
          function _0x52964c(_0x2455c4) {
            if (_0x2455c4) {
              document.getElementById("FinishQuestionPack10").classList.remove('hidden');
            }
          }
          setTimeout(() => {
            document.getElementById("audio_FinishQuestionPackShow").currentTime = 0x0;
            document.getElementById("audio_FinishQuestionPackShow").play();
            document.getElementById("FinishQuestionPackSelectionContainer").classList.remove("hidden");
          }, 0x1194);
        }
      });
      function _0x55fc65(_0x455252) {
        const _0xa273eb = document.querySelectorAll("#FinishPlayerLists > .flex-1");
        _0xa273eb.forEach((_0x2b777e, _0x48e1a7) => {
          _0x2b777e.classList.remove("bg-white", "finishPlayerHighlightContainer", "animate-gradient", "rounded-tl-md", "rounded-tr-md", "bg-gradient-to-r", "from-pink-800", "to-pink-900");
          _0x2b777e.style.background = '';
          const _0x468aed = _0x2b777e.querySelector('p');
          if (_0x468aed) {
            _0x468aed.classList.remove("text-white", "text-black");
          }
          if (_0x48e1a7 === 0x0) {
            _0x2b777e.classList.add("rounded-tl-md");
          }
          if (_0x48e1a7 === _0xa273eb.length - 0x1) {
            _0x2b777e.classList.add("rounded-tr-md");
          }
          if (_0x48e1a7 === _0x455252 - 0x1) {
            _0x2b777e.classList.add("finishPlayerHighlightContainer");
            if (projectorConfigData.finishPlayerHighlightContainer === '' || projectorConfigData.finishPlayerHighlightContainer === undefined) {
              _0x2b777e.classList.add("animate-gradient");
            } else {
              applyStyle(getElement(".finishPlayerHighlightContainer"), 'background', projectorConfigData.finishPlayerHighlightContainer);
            }
            if (_0x468aed) {
              _0x468aed.classList.add("text-white");
            }
          } else {
            _0x2b777e.classList.add("bg-white");
            if (_0x468aed) {
              _0x468aed.classList.add("text-black");
            }
          }
        });
      }
      _0x1d97c0.on('value', _0x28964e => {
        const _0x1798be = _0x28964e.val().status;
        if (_0x1798be === 0x1) {
          setTimeout(() => {
            document.getElementById("FinishQuestionPackSelectionContainer").classList.add('hidden');
          }, 0x1388);
          var _0x5980fc = realtimeDB.ref(_0x34d7c6 + '/FinishQuestionChoose/TS' + _0xf44d00);
          _0x5980fc.once('value').then(_0x284b0c => {
            const _0x122600 = _0x284b0c.val();
            _0x53b683();
            Object.values(_0x122600).forEach(_0x53fabd => {
              if (_0x53fabd.cau1) {
                _0x3e019e(_0x53fabd.cau1, 0x0);
                _0xfc8995 = _0x53fabd.cau1;
              }
              if (_0x53fabd.cau2) {
                _0x3e019e(_0x53fabd.cau2, 0x1);
                _0x582869 = _0x53fabd.cau2;
              }
              if (_0x53fabd.cau3) {
                _0x3e019e(_0x53fabd.cau3, 0x2);
                _0x47000e = _0x53fabd.cau3;
              }
            });
          });
          document.getElementById("audio_FinishQuestionPackChoose").currentTime = 0x0;
          document.getElementById('audio_FinishQuestionPackChoose').play();
          setTimeout(() => {
            document.getElementById("FinishQuestionPackSelectionContainer").classList.remove("fly-in");
            document.getElementById("FinishQuestionPackSelectionContainer").classList.add("fly-out");
            setTimeout(() => {
              document.getElementById("FinishQuestionPackSelectionContainer").classList.add("hidden");
              document.getElementById('FinishQuestionPackSelectionContainer').classList.add("fly-in");
              document.getElementById("FinishQuestionPackSelectionContainer").classList.remove('fly-out');
              document.getElementById("FinishMainUI").classList.remove("hidden");
            }, 0x1f4);
          }, 0xbb8);
        }
      });
      function _0x3e019e(_0x1161f1, _0x28fd60) {
        const _0x5ecc6d = document.querySelector(".finish-question-pack-" + _0x1161f1 + " > input:nth-child(" + (_0x28fd60 + 0x1) + ')');
        if (_0x5ecc6d) {
          _0x5ecc6d.checked = true;
        }
      }
      function _0x53b683() {
        [0xa, 0x14, 0x1e].forEach(_0x35c123 => {
          const _0x522526 = document.querySelector(".finish-question-pack-" + _0x35c123);
          if (_0x522526) {
            const _0x349b97 = _0x522526.querySelectorAll("input[type='checkbox']");
            _0x349b97.forEach(_0x50a5cf => {
              _0x50a5cf.checked = false;
            });
          }
        });
      }
      _0x2d7841.on("value", _0xd4b020 => {
        var _0x11522d = _0xd4b020.val().end;
        if (_0x11522d === 0x1) {
          document.getElementById("audio_FinishFinish").currentTime = 0x0;
          document.getElementById("audio_FinishFinish").play();
          document.getElementById('FinishQuestionPackSelectionContainer').classList.add("hidden");
        }
      });
      _0x3dead2.on("value", async _0x272e88 => {
        const _0x3ca319 = _0x272e88.val();
        const _0x20f371 = document.getElementById('FinishQuestion');
        const _0x102d66 = document.getElementById('FinishQuestionPackSelecting');
        if (!_0x3ca319 || !_0x3ca319.causo || _0xf44d00 === 0x0) {
          _0x20f371.textContent = '';
          _0x102d66.textContent = '';
          document.getElementById('FinishMediaContainer').classList.add("hidden");
          window.stopCurrentQuestionAudio();
          return;
        }
        const _0x5e36a3 = _0x3ca319.causo;
        let _0x13f3f2 = null;
        if (_0x5e36a3 === 0x1 && _0xfc8995 !== undefined) {
          _0x13f3f2 = _0xfc8995;
          _0x1aa7e0 = _0xfc8995;
          _0x102d66.textContent = "CÂU " + _0xfc8995 + " ĐIỂM";
        } else {
          if (_0x5e36a3 === 0x2 && _0x582869 !== undefined) {
            _0x13f3f2 = _0x582869;
            _0x1aa7e0 = _0x582869;
            _0x102d66.textContent = "CÂU " + _0x582869 + " ĐIỂM";
          } else if (_0x5e36a3 === 0x3 && _0x47000e !== undefined) {
            _0x13f3f2 = _0x47000e;
            _0x1aa7e0 = _0x47000e;
            _0x102d66.textContent = "CÂU " + _0x47000e + " ĐIỂM";
          }
        }
        _0x3b2277();
        const _0x15ec87 = realtimeDB.ref(_0x34d7c6 + "/FinishQuestion/Q" + _0xf44d00 + "DB/QP" + _0x13f3f2 + '/' + _0x5e36a3);
        _0x15ec87.once("value").then(_0xb7ed25 => {
          console.log("Question data:", _0xb7ed25.val());
          const _0x3affd7 = _0xb7ed25.val();
          _0x20f371.textContent = _0x3affd7 && _0x3affd7.cauhoi ? _0x3affd7.cauhoi : '';
        });
        window.stopCurrentQuestionAudio();
        try {
          console.log("Loading question media for FinishQuestion", 'Q' + _0xf44d00 + 'DB', 'QP' + _0x13f3f2 + '_' + _0x5e36a3);
          const _0x1d7678 = await getQuestionMedia("FinishQuestion", 'Q' + _0xf44d00 + 'DB', 'QP' + _0x13f3f2 + '_' + _0x5e36a3);
          await displayQuestionImage(_0x1d7678.image, document.getElementById('FinishQuestionImage'), document.getElementById("FinishMediaContainer"));
        } catch (_0x46aefe) {
          console.error("Error loading question media:", _0x46aefe);
        }
      });
      _0x3b708a.on("value", _0x28dffe => {
        const _0x1ca050 = _0x28dffe.val().batdau;
        if (_0x1ca050 === 0x1) {
          let _0x1bbb98 = 0x0;
          if (_0x1aa7e0 === 0xa) {
            _0x1bbb98 = 0xa;
            _0x1adf18(0x2710);
            document.getElementById("audio_Finish10Seconds").currentTime = 0x0;
            document.getElementById("audio_Finish10Seconds").play();
          } else {
            if (_0x1aa7e0 === 0x14) {
              _0x1bbb98 = 0xf;
              _0x1adf18(0x3a98);
              document.getElementById("audio_Finish15Seconds").currentTime = 0x0;
              document.getElementById("audio_Finish15Seconds").play();
            } else if (_0x1aa7e0 === 0x1e) {
              _0x1bbb98 = 0x14;
              _0x1adf18(0x4e20);
              document.getElementById("audio_Finish20Seconds").currentTime = 0x0;
              document.getElementById('audio_Finish20Seconds').play();
            }
          }
        }
      });
      function _0x1adf18(_0xb40531) {
        _0x3b2277();
        if (_0x1dbccc) {
          clearInterval(_0x1dbccc);
        }
        const _0x3c8254 = document.getElementById("FinishSlider");
        const _0x2f27ee = Date.now();
        _0x1dbccc = setInterval(() => {
          const _0x47fa40 = Date.now() - _0x2f27ee;
          const _0x2a78f0 = Math.min(_0x47fa40 / _0xb40531, 0x1);
          _0x3c8254.value = _0x2a78f0 * 0x64;
          if (_0x2a78f0 >= 0x1) {
            clearInterval(_0x1dbccc);
          }
        }, 0x10);
      }
      function _0x3b2277() {
        const _0x108f72 = document.getElementById('FinishSlider');
        _0x108f72.value = 0x0;
      }
      _0x1a46c7.on("value", _0x58099a => {
        if (_0x58099a.val().status === 0x1) {
          document.getElementById('audio_FinishStarChose').currentTime = 0x0;
          document.getElementById("audio_FinishStarChose").play();
          document.getElementById('FinishStar').classList.remove("hidden");
        } else {
          document.getElementById("FinishStar").classList.add("hidden");
        }
      });
      _0x3b5691.on("value", _0x143de2 => {
        const _0x3cdaf8 = _0x143de2.val().dungsai;
        if (_0x3cdaf8 === 0x1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0x0;
          document.getElementById('audio_FinishRightAnswer').play();
        } else if (_0x3cdaf8 === 0x2) {
          _0x115f4f = true;
          document.getElementById("audio_Finish5Seconds").currentTime = 0x0;
          document.getElementById("audio_Finish5Seconds").play();
          _0x437bbb();
          setTimeout(() => {
            _0x115f4f = false;
          }, 0x1388);
        }
      });
      _0x427f19.on('value', _0x43df7b => {
        if (!_0x43df7b.exists()) {
          console.log("No buzzer entries yet");
          const _0x4c2aa2 = document.getElementById("FinishPlayerLists");
          if (_0x4c2aa2) {
            Array.from(_0x4c2aa2.children).forEach((_0x506071, _0x35b644) => {
              if (_0x35b644 !== _0xf44d00 - 0x1) {
                _0x506071.classList.remove("finishPlayerBuzzerContainer");
                _0x506071.style.background = '';
                const _0x139efc = Array.from(_0x506071.classList).filter(_0x11051f => (_0x11051f.startsWith("bg-") || _0x11051f.startsWith("text-") || _0x11051f.startsWith("from-") || _0x11051f.startsWith("via-") || _0x11051f.startsWith('to-') || _0x11051f.startsWith('accent-')) && _0x11051f !== "text-center");
                _0x139efc.forEach(_0x24b612 => _0x506071.classList.remove(_0x24b612));
                _0x506071.classList.add('bg-white');
                const _0x460f6e = _0x506071.querySelector('p');
                if (_0x460f6e) {
                  _0x460f6e.classList.remove("text-white");
                  _0x460f6e.classList.add("text-black");
                }
              }
            });
          }
          return;
        }
        let _0x324cb1 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x1b281d = {};
        let _0x14478b = null;
        if (_0x43df7b.child("startTime").exists()) {
          _0x14478b = _0x43df7b.child("startTime").val();
        }
        _0x43df7b.forEach(_0x15c503 => {
          if (_0x15c503.key === "startTime") {
            return;
          }
          const _0x1ea8d6 = _0x15c503.val();
          console.log("Buzzer press:", {
            'id': _0x1ea8d6.id,
            'timestamp': _0x1ea8d6.buzzerTimestamp
          });
          const _0xa20bf0 = _0x1ea8d6.buzzerTimestamp;
          if (_0x14478b && _0xa20bf0 < _0x14478b) {
            console.log("Buzzer press before start time, ignoring");
            return;
          }
          if (!_0x1b281d[_0x1ea8d6.id] || _0xa20bf0 < _0x1b281d[_0x1ea8d6.id]) {
            _0x1b281d[_0x1ea8d6.id] = _0xa20bf0;
          }
          if (_0x1b281d[_0x1ea8d6.id] < _0x324cb1.timestamp) {
            _0x324cb1 = {
              'timestamp': _0x1b281d[_0x1ea8d6.id],
              'id': _0x1ea8d6.id
            };
          }
        });
        console.log("Fastest buzzer:", _0x324cb1.id);
        console.log("Timestamp:", new Date(_0x324cb1.timestamp));
        const _0x35c8ac = document.getElementById("FinishPlayerLists");
        if (_0x35c8ac) {
          const _0x1bca5e = _0x324cb1.id !== null ? parseInt(_0x324cb1.id, 0xa) - 0x1 : -0x1;
          console.log(_0x1bca5e);
          function _0x4351b5(_0x1913da) {
            _0x1913da.style.background = '';
            const _0x1cf2e3 = Array.from(_0x1913da.classList).filter(_0x2ef037 => (_0x2ef037.startsWith('bg-') || _0x2ef037.startsWith("text-") || _0x2ef037.startsWith("from-") || _0x2ef037.startsWith("via-") || _0x2ef037.startsWith("to-") || _0x2ef037.startsWith('accent-')) && _0x2ef037 !== 'text-center');
            _0x1cf2e3.forEach(_0x532bc3 => _0x1913da.classList.remove(_0x532bc3));
          }
          if (_0x1bca5e === -0x1) {
            Array.from(_0x35c8ac.children).forEach((_0x5c592d, _0x3d398f) => {
              if (_0x3d398f !== _0xf44d00 - 0x1) {
                _0x5c592d.classList.remove("finishPlayerBuzzerContainer");
                _0x4351b5(_0x5c592d);
                _0x5c592d.classList.add("bg-white");
                const _0x30021b = _0x5c592d.querySelector('p');
                if (_0x30021b) {
                  _0x30021b.classList.remove("text-white");
                  _0x30021b.classList.add('text-black');
                }
              }
            });
          } else if (_0x1bca5e >= 0x0 && _0x1bca5e < _0x35c8ac.children.length && _0x1bca5e !== _0xf44d00 - 0x1) {
            Array.from(_0x35c8ac.children).forEach((_0xe5ecb9, _0x56b698) => {
              if (_0x56b698 !== _0xf44d00 - 0x1) {
                _0x4351b5(_0xe5ecb9);
                if (_0x56b698 === _0x1bca5e) {
                  _0xe5ecb9.classList.add("finishPlayerBuzzerContainer");
                  if (projectorConfigData.finishPlayerBuzzerContainer === '' || projectorConfigData.finishPlayerBuzzerContainer === undefined) {
                    applyStyle(_0xe5ecb9, "background", defaultConfig.finishPlayerBuzzerContainer);
                  } else {
                    applyStyle(_0xe5ecb9, "background", projectorConfigData.finishPlayerBuzzerContainer);
                  }
                  const _0x444943 = _0xe5ecb9.querySelector('p');
                  if (_0x444943) {
                    _0x444943.classList.add("text-white");
                    _0x444943.classList.remove("text-black");
                  }
                } else {
                  _0xe5ecb9.classList.remove("finishPlayerBuzzerContainer");
                  _0xe5ecb9.classList.add("bg-white");
                  const _0x430ce4 = _0xe5ecb9.querySelector('p');
                  if (_0x430ce4) {
                    _0x430ce4.classList.remove("text-white");
                    _0x430ce4.classList.add("text-black");
                  }
                }
              }
            });
            document.getElementById("audio_FinishAnswerGranted").currentTime = 0x0;
            document.getElementById("audio_FinishAnswerGranted").play();
          }
        }
      });
      function _0x437bbb() {
        clearInterval(_0x1dbccc);
        document.getElementById('audio_Finish10Seconds').pause();
        document.getElementById("audio_Finish15Seconds").pause();
        document.getElementById('audio_Finish20Seconds').pause();
      }
      _0x4ad1d2.on('value', _0x46a747 => {
        const _0x35b570 = _0x46a747.val().correctorwrong;
        if (_0x35b570 === 0x1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0x0;
          document.getElementById("audio_FinishRightAnswer").play();
        } else if (_0x35b570 === 0x2) {
          document.getElementById("audio_FinishWrongAnswer").currentTime = 0x0;
          document.getElementById("audio_FinishWrongAnswer").play();
        }
      });
      function _0x5f50e8(_0x22b4a5, _0x2cc4c4) {
        var _0x20b761 = realtimeDB.ref(_0x34d7c6 + '/FinishQuestion/');
        var _0x4215b4 = false;
        function _0x2eb3c0(_0x398872) {
          const _0x3933eb = _0x398872.val();
          if (_0x3933eb !== null && typeof _0x3933eb === 'object') {
            if (_0x3933eb.cauhoi.trim().length > 0x0 && _0x3933eb.dapan.trim().length > 0x0) {
              _0x4215b4 = true;
              return true;
            }
          }
          return false;
        }
        const _0x3020b7 = getPlayerLimit();
        for (var _0x37a4c3 = 0x1; _0x37a4c3 <= _0x3020b7; _0x37a4c3++) {
          for (var _0x435d7d = 0x1; _0x435d7d <= 0x3; _0x435d7d++) {
            var _0x34c7d4 = 'Q' + _0x37a4c3 + 'DB' + '/QP' + _0x22b4a5 + '/' + _0x435d7d;
            var _0x212d3d = _0x20b761.child(_0x34c7d4);
            _0x212d3d.once("value", _0x256160 => {
              if (_0x2eb3c0(_0x256160)) {
                _0x2cc4c4(_0x4215b4);
                return;
              }
            })["catch"](_0x66fd25 => {
              console.error("Error fetching data:", _0x66fd25);
              _0x2cc4c4(false);
            });
            if (_0x4215b4) {
              return;
            }
          }
        }
        _0x2cc4c4(false);
      }
      _0x28aed3.on("value", _0x1c7323 => {
        const _0x4ef2df = _0x1c7323.val();
        const _0x3494b0 = document.getElementById('FinishVideo');
        const _0x50c933 = document.getElementById("FinishIframe");
        function _0x26f81d(_0x3a2f95) {
          try {
            new URL(_0x3a2f95);
            return true;
          } catch {
            return false;
          }
        }
        function _0x32fd1c(_0x2440da) {
          const _0x35f681 = [".mp4", '.webm', '.ogg', ".avi", ".mov", ".wmv", '.m4v', '.flv'];
          return _0x35f681.some(_0x3eb7e3 => _0x2440da.toLowerCase().includes(_0x3eb7e3));
        }
        function _0x4a35b7(_0x3bf647) {
          const _0x7955f7 = _0x34d7c6 + "/vd/vd" + _0x3bf647 + "/vd.mp4";
          window.cloudinaryService.ref(_0x7955f7).getDownloadURL().then(_0x38777d => {
            _0x3494b0.src = _0x38777d;
            _0x3494b0.classList.remove("hidden");
            _0x50c933.classList.add('hidden');
            setTimeout(() => {
              _0x3494b0.play();
            }, 0xbb8);
          })["catch"](_0x4d2e26 => {
            console.error("Error loading video:", _0x4d2e26);
          });
        }
        function _0x756198(_0x4f48c9) {
          _0x3494b0.src = _0x4f48c9;
          _0x3494b0.classList.remove('hidden');
          _0x50c933.classList.add('hidden');
          setTimeout(() => {
            _0x3494b0.play();
          }, 0xbb8);
        }
        function _0x1f5f49(_0x24e084) {
          _0x50c933.src = _0x24e084;
          _0x50c933.classList.remove('hidden');
          _0x3494b0.classList.add("hidden");
          _0x3494b0.pause();
          _0x3494b0.currentTime = 0x0;
        }
        if (_0x4ef2df.video1 === 0x1) {
          _0x4a35b7(0x1);
        } else {
          if (_0x4ef2df.video2 === 0x1) {
            _0x4a35b7(0x2);
          } else {
            if (_0x4ef2df.video3 === 0x1) {
              _0x4a35b7(0x3);
            } else {
              if (_0x4ef2df.video4 === 0x1) {
                _0x4a35b7(0x4);
              } else if (_0x4ef2df.video1 === 0x0 && _0x4ef2df.video2 === 0x0 && _0x4ef2df.video3 === 0x0 && _0x4ef2df.video4 === 0x0) {
                _0x3494b0.classList.add("hidden");
                _0x3494b0.pause();
                _0x3494b0.currentTime = 0x0;
                _0x50c933.classList.add("hidden");
                _0x50c933.src = '';
              }
            }
          }
        }
        if (_0x4ef2df.CustomVideo) {
          if (_0x26f81d(_0x4ef2df.CustomVideo)) {
            if (_0x4ef2df.CustomVideo.includes("youtube.com") || _0x4ef2df.CustomVideo.includes("youtu.be") || _0x4ef2df.CustomVideo.includes("vimeo.com") || _0x4ef2df.CustomVideo.includes("embed") || _0x4ef2df.CustomVideo.includes("iframe") || _0x4ef2df.CustomVideo.includes("dailymotion.com") || _0x4ef2df.CustomVideo.includes("twitch.tv")) {
              _0x1f5f49(_0x4ef2df.CustomVideo);
            } else if (_0x32fd1c(_0x4ef2df.CustomVideo)) {
              _0x756198(_0x4ef2df.CustomVideo);
            } else {
              _0x1f5f49(_0x4ef2df.CustomVideo);
            }
          } else {
            _0x1f5f49(_0x4ef2df.CustomVideo);
          }
        } else if (_0x4ef2df.video1 === 0x0 && _0x4ef2df.video2 === 0x0 && _0x4ef2df.video3 === 0x0 && _0x4ef2df.video4 === 0x0) {
          _0x50c933.src = '';
          _0x50c933.classList.add("hidden");
        }
      });
      _0x56aae2.on("value", _0x2932df => {
        const _0x59f7ed = _0x2932df.val().englishInput;
        if (_0x59f7ed) {
          _0x163ca3.once("value").then(_0xe85dd5 => {
            if (_0xe85dd5.val().vedich === 0x1) {
              speakText(_0x59f7ed);
              console.log("Speaking custom input:", _0x59f7ed);
            }
          });
        }
      });
      function _0x32001e(_0x29c7e6) {
        const _0x434c26 = document.getElementById("FinishCountdown");
        let _0x1eda1d = _0x29c7e6;
        _0x434c26.textContent = _0x1eda1d;
        _0x434c26.classList.remove("hidden");
        if (window.finishSecondTimerInterval) {
          clearInterval(window.finishSecondTimerInterval);
        }
        window.finishSecondTimerInterval = setInterval(() => {
          _0x1eda1d--;
          _0x434c26.textContent = _0x1eda1d;
          if (_0x1eda1d <= 0x0) {
            clearInterval(window.finishSecondTimerInterval);
            _0x434c26.textContent = '';
          }
        }, 0x3e8);
      }
      _0x4f1dd9.on("value", _0x3afd12 => {
        const _0x408165 = _0x3afd12.val().time;
        document.getElementById('audio_FinishPracticeGuestWelcome').pause();
        document.getElementById("audio_FinishPracticeGuestWelcome").currentTime = 0x0;
        document.getElementById("audio_FinishPractice20Seconds").pause();
        document.getElementById("audio_FinishPractice20Seconds").currentTime = 0x0;
        document.getElementById('audio_FinishPractice30Seconds').pause();
        document.getElementById("audio_FinishPractice30Seconds").currentTime = 0x0;
        document.getElementById("audio_FinishPractice40Seconds").pause();
        document.getElementById("audio_FinishPractice40Seconds").currentTime = 0x0;
        document.getElementById("audio_FinishPractice60Seconds").pause();
        document.getElementById("audio_FinishPractice60Seconds").currentTime = 0x0;
        switch (_0x408165) {
          case "GuestWelcome":
            if (window.finishSecondTimerInterval) {
              clearInterval(window.finishSecondTimerInterval);
            }
            const _0x43d671 = document.getElementById("FinishCountdown");
            _0x43d671.textContent = '';
            _0x43d671.classList.add("hidden");
            document.getElementById("audio_FinishPracticeGuestWelcome").currentTime = 0x0;
            document.getElementById("audio_FinishPracticeGuestWelcome").play();
            break;
          case 0x14:
            document.getElementById("audio_FinishPractice20Seconds").currentTime = 0x0;
            document.getElementById("audio_FinishPractice20Seconds").play();
            _0x32001e(0x14);
            break;
          case 0x1e:
            document.getElementById("audio_FinishPractice30Seconds").currentTime = 0x0;
            document.getElementById('audio_FinishPractice30Seconds').play();
            _0x32001e(0x1e);
            break;
          case 0x28:
            document.getElementById("audio_FinishPractice40Seconds").currentTime = 0x0;
            document.getElementById("audio_FinishPractice40Seconds").play();
            _0x32001e(0x28);
            break;
          case 0x3c:
            document.getElementById("audio_FinishPractice60Seconds").currentTime = 0x0;
            document.getElementById('audio_FinishPractice60Seconds').play();
            _0x32001e(0x3c);
            break;
          case 0x0:
          case null:
          default:
            if (window.finishSecondTimerInterval) {
              clearInterval(window.finishSecondTimerInterval);
            }
            const _0x190350 = document.getElementById("FinishCountdown");
            _0x190350.textContent = '';
            _0x190350.classList.add("hidden");
            break;
        }
      });
      const _0x2c5f75 = realtimeDB.ref(_0x34d7c6 + "/AudioControl/finish");
      _0x2c5f75.on("value", _0x4bbd2d => {
        const _0x3a37ec = _0x4bbd2d.val();
        if (!_0x3a37ec || !_0x3a37ec.audioData) {
          return;
        }
        if (_0x3a37ec.isPlaying) {
          window.stopCurrentQuestionAudio();
          setTimeout(() => {
            playQuestionAudio(_0x3a37ec.audioData);
          }, 0x64);
        } else {
          window.stopCurrentQuestionAudio();
        }
      });
    });
  });