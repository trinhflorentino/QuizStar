auth.onAuthStateChanged(_0x483dff => {
    if (!_0x483dff) {
      return;
    }
    const _0x415c99 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x415c99.onSnapshot(_0x455e6b => {
      if (!_0x455e6b.exists) {
        return;
      }
      const _0x2e76e0 = _0x455e6b.data().match;
      var _0xcf169e = realtimeDB.ref(_0x2e76e0 + '/playerstatus/vedich');
      var _0x494362 = realtimeDB.ref(_0x2e76e0 + "/FinishPoint/status");
      var _0x55f5d7 = realtimeDB.ref(_0x2e76e0 + "/VDPlayerTurnEnd/End");
      var _0x115625 = realtimeDB.ref(_0x2e76e0 + "/VDCauso");
      var _0x2d78a7 = realtimeDB.ref(_0x2e76e0 + "/phanthistatus/vedich");
      var _0x2cb3d8 = realtimeDB.ref(_0x2e76e0 + "/VDNSHV/status");
      var _0x838904 = realtimeDB.ref(_0x2e76e0 + "/VDCorrectOrWrong/");
      var _0x2a0ba0 = realtimeDB.ref(_0x2e76e0 + "/FinishBuzzer/");
      var _0xb10486 = realtimeDB.ref(_0x2e76e0 + '/VDChuong/CorrectOrWrong');
      var _0x156e29 = realtimeDB.ref(_0x2e76e0 + "/gamestatus/vedich");
      var _0x26aa7c = realtimeDB.ref(_0x2e76e0 + "/EnglishCustomInput");
      var _0x4b3aa2 = realtimeDB.ref(_0x2e76e0 + '/FinishPractice/');
      var _0x3dc3c0 = realtimeDB.ref(_0x2e76e0 + "/FinishVideoState/VD");
      let _0xf4ac66 = null;
      let _0x35d687 = null;
      let _0x5e3740 = false;
      let _0xd1708a;
      let _0x4b489f;
      let _0x2e8807;
      let _0x407d52;
      let _0x35d849;
      _0xcf169e.on("value", _0x140d81 => {
        const _0x1db5fb = _0x140d81.val().player;
        _0xf4ac66 = _0x1db5fb;
        if (_0x1db5fb === 0x0) {
          document.getElementById("FinishQuestionPackSelectionContainer").classList.remove("hidden");
          document.getElementById("FinishQuestionContainer").classList.add("hidden");
          document.getElementById('FinishQuestionPackPlayerSelected').textContent = "Đang đợi người điều khiển chọn thí sinh về đích";
          document.getElementById('FinishQuestionPackLoader').classList.remove("hidden");
          document.getElementById("FinishQuestionPack").classList.add('hidden');
          _0x42efa3();
        } else {
          document.getElementById("audio_FinishUserStart").currentTime = 0x0;
          document.getElementById("audio_FinishUserStart").play();
          var _0x1448bd = realtimeDB.ref(_0x2e76e0 + "/games/player" + _0x1db5fb);
          _0x1448bd.once("value").then(_0x251c56 => {
            const _0x3ad5da = _0x251c56.val().displayName;
            document.getElementById("FinishQuestionPackPlayerSelected").textContent = _0x3ad5da;
            document.getElementById("FinishPlayerName").textContent = _0x3ad5da;
          });
          setTimeout(() => {
            document.getElementById("audio_FinishQuestionPackShow").currentTime = 0x0;
            document.getElementById("audio_FinishQuestionPackShow").play();
            document.getElementById("FinishQuestionPackLoader").classList.add('hidden');
            document.getElementById("FinishQuestionPack").classList.remove("hidden");
          }, 0x1194);
          _0x18153a(0xa, _0x143212);
          function _0x143212(_0x2bbef0) {
            if (_0x2bbef0) {
              document.getElementById("FinishQuestionPack10").classList.remove('hidden');
            }
          }
        }
      });
      _0x494362.on("value", _0x39cc64 => {
        const _0x81dfc8 = _0x39cc64.val().status;
        if (_0x81dfc8 === 0x1) {
          var _0x3d5b44 = realtimeDB.ref(_0x2e76e0 + "/FinishQuestionChoose/TS" + _0xf4ac66);
          _0x3d5b44.once("value").then(_0x2402f0 => {
            const _0x1c257b = _0x2402f0.val();
            Object.values(_0x1c257b).forEach(_0x47f38c => {
              if (_0x47f38c.cau1) {
                _0x3aceaa(_0x47f38c.cau1, 0x0);
                _0x2e8807 = _0x47f38c.cau1;
              }
              if (_0x47f38c.cau2) {
                _0x3aceaa(_0x47f38c.cau2, 0x1);
                _0x407d52 = _0x47f38c.cau2;
              }
              if (_0x47f38c.cau3) {
                _0x3aceaa(_0x47f38c.cau3, 0x2);
                _0x35d849 = _0x47f38c.cau3;
              }
            });
            document.getElementById("FinishQuestionSelectedPackage").innerHTML = "<div class=\"FinishQuestionSelectedPackageText\"><span>" + _0x2e8807 + "</span> · <span>" + _0x407d52 + "</span> · <span>" + _0x35d849 + "</span></div>";
          });
          document.getElementById('audio_FinishQuestionPackChoose').currentTime = 0x0;
          document.getElementById('audio_FinishQuestionPackChoose').play();
          setTimeout(() => {
            document.getElementById("FinishQuestionPackSelectionContainer").classList.add("hidden");
            document.getElementById('FinishQuestionContainer').classList.remove("hidden");
          }, 0xbb8);
        }
      });
      function _0x3aceaa(_0x4bf53a, _0x450dcc) {
        const _0xe3fc48 = document.querySelector(".finish-question-pack-" + _0x4bf53a + " > div:nth-child(" + (_0x450dcc + 0x1) + ')');
        if (_0xe3fc48) {
          _0xe3fc48.classList.remove("bg-gray-300", 'dark:bg-gray-800');
          _0xe3fc48.classList.add('bg-gray-700', "dark:bg-gray-300");
        }
      }
      function _0x42efa3() {
        for (let _0x15ee9a = 0xa; _0x15ee9a <= 0x1e; _0x15ee9a++) {
          for (let _0x433074 = 0x1; _0x433074 <= 0x3; _0x433074++) {
            const _0x2bab4a = document.querySelector('.finish-question-pack-' + _0x15ee9a + " > div:nth-child(" + _0x433074 + ')');
            if (_0x2bab4a) {
              _0x2bab4a.classList.remove("bg-gray-700", 'dark:bg-gray-300');
              _0x2bab4a.classList.add('bg-gray-300', "dark:bg-gray-800");
            }
          }
        }
      }
      _0x55f5d7.on("value", _0x44bf04 => {
        var _0x4a61ac = _0x44bf04.val().end;
        if (_0x4a61ac === 0x1) {
          document.getElementById('audio_FinishFinish').currentTime = 0x0;
          document.getElementById("audio_FinishFinish").play();
        }
      });
      const _0xaa8243 = ['bg-gradient-to-r', "from-blue-400", "via-blue-500", "to-blue-600", "text-transparent", "bg-clip-text"];
      _0x115625.on("value", async _0x2f0285 => {
        const _0x20de70 = _0x2f0285.val();
        const _0x166752 = document.getElementById("FinishQuestion");
        const _0x4c86f3 = document.getElementById("FinishQuestionTime");
        const _0x544666 = document.querySelectorAll("#FinishQuestionSelectedPackage .FinishQuestionSelectedPackageText span");
        document.getElementById("FinishAnswerButton").disabled = false;
        _0x544666.forEach(_0x6ff1c1 => _0x6ff1c1.classList.remove(..._0xaa8243));
        if (!_0x20de70 || !_0x20de70.causo || _0xf4ac66 === 0x0) {
          _0x166752.textContent = '';
          _0x4c86f3.textContent = '';
          document.getElementById("FinishMediaContainer").classList.add("hidden");
          window.stopCurrentQuestionAudio();
          return;
        }
        const _0x11d795 = _0x20de70.causo;
        let _0x3d736b = null;
        let _0x590d23 = null;
        if (_0x11d795 === 0x1) {
          _0x3d736b = _0x2e8807;
          _0x35d687 = _0x2e8807;
          _0x590d23 = _0x544666[0x0];
        } else {
          if (_0x11d795 === 0x2) {
            _0x3d736b = _0x407d52;
            _0x35d687 = _0x407d52;
            _0x590d23 = _0x544666[0x1];
          } else if (_0x11d795 === 0x3) {
            _0x3d736b = _0x35d849;
            _0x35d687 = _0x35d849;
            _0x590d23 = _0x544666[0x2];
          }
        }
        if (_0x590d23) {
          _0x590d23.classList.add(..._0xaa8243);
        }
        if (_0x3d736b === 0xa) {
          _0x4c86f3.textContent = '00:10';
        } else {
          if (_0x3d736b === 0x14) {
            _0x4c86f3.textContent = "00:15";
          } else if (_0x3d736b === 0x1e) {
            _0x4c86f3.textContent = "00:20";
          } else {
            _0x4c86f3.textContent = '';
          }
        }
        if (!_0x3d736b) {
          return;
        }
        const _0x57ed48 = realtimeDB.ref(_0x2e76e0 + "/FinishQuestion/Q" + _0xf4ac66 + "DB/QP" + _0x3d736b + '/' + _0x11d795);
        _0x57ed48.once('value').then(_0x44c7d9 => {
          const _0x2af467 = _0x44c7d9.val();
          _0x166752.textContent = _0x2af467 && _0x2af467.cauhoi ? _0x2af467.cauhoi : '';
        });
        window.stopCurrentQuestionAudio();
        try {
          console.log("Loading question media for FinishQuestion", 'Q' + _0xf4ac66 + 'DB', 'QP' + _0x3d736b + '_' + _0x11d795);
          const _0x30d8e7 = await getQuestionMedia("FinishQuestion", 'Q' + _0xf4ac66 + 'DB', 'QP' + _0x3d736b + '_' + _0x11d795);
          await displayQuestionImage(_0x30d8e7.image, document.getElementById('FinishQuestionImage'), document.getElementById('FinishMediaContainer'));
        } catch (_0x18ac3b) {
          console.error("Error loading question media:", _0x18ac3b);
        }
      });
      function _0x3a4a53() {
        clearInterval(_0xd1708a);
        clearInterval(_0x4b489f);
        if (window.finishSecondTimerInterval) {
          clearInterval(window.finishSecondTimerInterval);
        }
        const _0x4d907c = document.getElementById('FinishQuestionTime');
        _0x4d907c.textContent = '';
        _0x4d907c.classList.add("hidden");
        document.getElementById("audio_Finish10Seconds").pause();
        document.getElementById("audio_Finish15Seconds").pause();
        document.getElementById("audio_Finish20Seconds").pause();
        document.getElementById("audio_FinishPracticeGuestWelcome").pause();
        document.getElementById("audio_FinishPractice20Seconds").pause();
        document.getElementById('audio_FinishPractice30Seconds').pause();
        document.getElementById("audio_FinishPractice40Seconds").pause();
        document.getElementById("audio_FinishPractice60Seconds").pause();
      }
      _0x2d78a7.on("value", _0x377915 => {
        const _0x49ea8c = _0x377915.val().batdau;
        if (_0x49ea8c === 0x1) {
          _0x3a4a53();
          if (_0xd1708a) {
            clearInterval(_0xd1708a);
          }
          let _0x273b90 = 0x0;
          if (_0x35d687 === 0xa) {
            _0x273b90 = 0xa;
            document.getElementById('audio_Finish10Seconds').currentTime = 0x0;
            document.getElementById("audio_Finish10Seconds").play();
          } else {
            if (_0x35d687 === 0x14) {
              _0x273b90 = 0xf;
              document.getElementById("audio_Finish15Seconds").currentTime = 0x0;
              document.getElementById("audio_Finish15Seconds").play();
            } else if (_0x35d687 === 0x1e) {
              _0x273b90 = 0x14;
              document.getElementById('audio_Finish20Seconds').currentTime = 0x0;
              document.getElementById("audio_Finish20Seconds").play();
            }
          }
          const _0x310c42 = document.getElementById('FinishQuestionTime');
          _0x310c42.classList.remove("hidden");
          _0x310c42.textContent = "00:" + _0x273b90.toString().padStart(0x2, '0');
          _0xd1708a = setInterval(() => {
            _0x273b90--;
            if (_0x273b90 < 0x0) {
              clearInterval(_0xd1708a);
            } else {
              _0x310c42.textContent = "00:" + _0x273b90.toString().padStart(0x2, '0');
            }
          }, 0x3e8);
        }
      });
      _0x2cb3d8.on("value", _0x39ccf5 => {
        if (_0x39ccf5.val().status === 0x1) {
          document.getElementById('audio_FinishStarChose').currentTime = 0x0;
          document.getElementById("audio_FinishStarChose").play();
          document.getElementById('FinishStarStatus').textContent = "Đã kích hoạt";
        } else {
          document.getElementById("FinishStarStatus").textContent = "Chưa kích hoạt";
        }
      });
      _0x838904.on("value", _0x58f3af => {
        const _0x406d5a = _0x58f3af.val().dungsai;
        if (_0x406d5a === 0x1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0x0;
          document.getElementById("audio_FinishRightAnswer").play();
        } else {
          if (_0x406d5a === 0x2) {
            _0x5e3740 = true;
            document.getElementById('FinishAnswerButton').disabled = false;
            document.getElementById("audio_Finish5Seconds").currentTime = 0x0;
            document.getElementById('audio_Finish5Seconds').play();
            document.getElementById("FinishAnswerIcon").classList.remove("text-red-600");
            document.getElementById("FinishAnswerIcon").classList.add("text-green-600");
            _0x3a4a53();
            let _0x3306df = 0x5;
            const _0x3c8891 = document.getElementById("FinishQuestionTime");
            _0x3c8891.classList.remove("hidden");
            _0x3c8891.textContent = "00:" + _0x3306df.toString().padStart(0x2, '0');
            _0x4b489f = setInterval(() => {
              _0x3306df--;
              _0x3c8891.textContent = "00:" + _0x3306df.toString().padStart(0x2, '0');
              if (_0x3306df === 0x0) {
                clearInterval(_0x4b489f);
                _0x5e3740 = false;
                document.getElementById("FinishAnswerIcon").classList.remove("text-green-600");
                document.getElementById("FinishAnswerIcon").classList.add("text-red-600");
                document.getElementById('FinishAnswerButton').disabled = true;
                _0x3c8891.textContent = '';
                _0x3c8891.classList.add('hidden');
              }
            }, 0x3e8);
          }
        }
      });
      document.getElementById('FinishAnswerButton').addEventListener("click", () => {
        if (!_0x5e3740) {
          return;
        }
        if (_0xf4ac66 === parseInt(localStorage.getItem('id'), 0xa)) {
          return;
        }
        _0x2a0ba0.push({
          'id': localStorage.getItem('id'),
          'uid': auth.currentUser.uid,
          'buzzerTimestamp': firebase.database.ServerValue.TIMESTAMP
        });
      });
      window.finish_lastChangeToken ??= '';
      window.finish_lastFastestId ??= null;
      window.finish_nameRevealDelayMs ??= 0x64;
      window.finish_nameRevealTimer ??= null;
      window.finish_nameRevealToken ??= '';
      function _0x2214fc(_0x304032, _0x714716, _0x457e8b = {}) {
        const {
          buzzerList: _0x1e58a9,
          audio: _0x33a745
        } = _0x714716;
        if (finish_nameRevealTimer) {
          clearTimeout(finish_nameRevealTimer);
          finish_nameRevealTimer = null;
        }
        const _0x511f7b = _0x304032.id + ':' + _0x304032.t;
        finish_nameRevealToken = _0x511f7b;
        if (_0x1e58a9) {
          _0x1e58a9.innerHTML = '';
        }
        finish_nameRevealTimer = setTimeout(() => {
          if (finish_nameRevealToken !== _0x511f7b || finish_lastFastestId !== _0x304032.id) {
            return;
          }
          const _0x43271c = typeof playerNames !== "undefined" && playerNames ? playerNames[_0x304032.id] : undefined;
          const _0x3ebd4d = _0x574a04 => {
            if (finish_nameRevealToken !== _0x511f7b || finish_lastFastestId !== _0x304032.id) {
              return;
            }
            const _0x382aa2 = new Date(_0x304032.t);
            const _0x2d06d8 = String(_0x382aa2.getHours()).padStart(0x2, '0');
            const _0xa23b9e = String(_0x382aa2.getMinutes()).padStart(0x2, '0');
            const _0x2d1e0e = String(_0x382aa2.getSeconds()).padStart(0x2, '0');
            const _0x892ca6 = String(_0x382aa2.getMilliseconds()).padStart(0x3, '0');
            const _0x2c6c45 = _0x2d06d8 + ':' + _0xa23b9e + ':' + _0x2d1e0e + ':' + _0x892ca6;
            if (_0x1e58a9) {
              const _0x1bdbcc = document.createElement("div");
              _0x1bdbcc.className = "w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center font-semibold py-4 rounded-xl dark:from-blue-700 dark:to-indigo-700";
              _0x1bdbcc.textContent = "Thí sinh " + (_0x574a04 || '#' + _0x304032.id) + " đã giành quyền trả lời lúc " + _0x2c6c45;
              _0x1e58a9.appendChild(_0x1bdbcc);
            }
            if (_0x33a745) {
              _0x33a745.currentTime = 0x0;
              _0x33a745.play()["catch"](() => {});
            }
          };
          if (_0x43271c) {
            _0x3ebd4d(_0x43271c);
          } else {
            if (typeof realtimeDB !== "undefined" && typeof _0x2e76e0 !== "undefined") {
              const _0x2086a9 = realtimeDB.ref(_0x2e76e0 + '/games/player' + _0x304032.id);
              _0x2086a9.once('value').then(_0x21c8e7 => _0x3ebd4d(_0x21c8e7?.["val"]()?.['displayName']))['catch'](() => _0x3ebd4d(undefined));
            } else {
              _0x3ebd4d(undefined);
            }
          }
        }, finish_nameRevealDelayMs);
      }
      _0x2a0ba0.on("value", _0x1dfb41 => {
        const _0x24a1f2 = document.getElementById('FinishBuzzerList');
        const _0x45aa61 = document.getElementById('FinishAnswerButton');
        const _0x2af187 = document.getElementById("audio_FinishAnswerGranted");
        const _0x18c3a4 = _0x1dfb41.child("startTime").val() || 0x0;
        const _0x2e511c = [];
        _0x1dfb41.forEach(_0x1cc112 => {
          if (_0x1cc112.key === "startTime") {
            return;
          }
          const _0x461b36 = _0x1cc112.val();
          if (_0x461b36?.['id'] && _0x461b36?.["buzzerTimestamp"] && _0x461b36.buzzerTimestamp >= _0x18c3a4) {
            _0x2e511c.push({
              'id': _0x461b36.id,
              't': _0x461b36.buzzerTimestamp
            });
          }
        });
        const _0x16d26b = _0x2e511c.length > 0x0;
        if (!_0x16d26b) {
          if (_0x24a1f2) {
            _0x24a1f2.innerHTML = '';
          }
          if (_0x45aa61) {
            _0x45aa61.disabled = false;
          }
          finish_lastFastestId = null;
          finish_lastChangeToken = '';
          if (finish_nameRevealTimer) {
            clearTimeout(finish_nameRevealTimer);
            finish_nameRevealTimer = null;
          }
          finish_nameRevealToken = '';
          return;
        }
        const _0x3bc5b8 = _0x2e511c.map(_0x54be32 => _0x54be32.id + ':' + _0x54be32.t).sort().join('|');
        if (_0x3bc5b8 === finish_lastChangeToken) {
          return;
        }
        finish_lastChangeToken = _0x3bc5b8;
        const _0x3f510d = _0x2e511c.reduce((_0x2e4fe2, _0x28790c) => _0x28790c.t < _0x2e4fe2.t || _0x28790c.t === _0x2e4fe2.t && String(_0x28790c.id) < String(_0x2e4fe2.id) ? _0x28790c : _0x2e4fe2, {
          'id': null,
          't': Infinity
        });
        if (_0x3f510d.id === finish_lastFastestId) {
          return;
        }
        finish_lastFastestId = _0x3f510d.id;
        if (_0x45aa61) {
          _0x45aa61.disabled = true;
        }
        _0x2214fc(_0x3f510d, {
          'buzzerList': _0x24a1f2,
          'audio': _0x2af187
        });
      });
      _0xb10486.on("value", _0x581bcb => {
        const _0x76ec9 = _0x581bcb.val().correctorwrong;
        if (_0x76ec9 === 0x1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0x0;
          document.getElementById("audio_FinishRightAnswer").play();
        } else if (_0x76ec9 === 0x2) {
          document.getElementById('audio_FinishWrongAnswer').currentTime = 0x0;
          document.getElementById('audio_FinishWrongAnswer').play();
        }
      });
      function _0x18153a(_0x398ebf, _0x42f8ca) {
        var _0xc780e2 = realtimeDB.ref(_0x2e76e0 + "/FinishQuestion/");
        var _0x19c40d = false;
        function _0x4ca62d(_0x3060fe) {
          const _0x858cdf = _0x3060fe.val();
          if (_0x858cdf !== null && typeof _0x858cdf === "object") {
            if (_0x858cdf.cauhoi.trim().length > 0x0 && _0x858cdf.dapan.trim().length > 0x0) {
              _0x19c40d = true;
              return true;
            }
          }
          return false;
        }
        const _0x556d5a = getPlayerLimit();
        for (var _0x59d721 = 0x1; _0x59d721 <= _0x556d5a; _0x59d721++) {
          for (var _0x11347c = 0x1; _0x11347c <= 0x3; _0x11347c++) {
            var _0x2e2541 = 'Q' + _0x59d721 + 'DB' + "/QP" + _0x398ebf + '/' + _0x11347c;
            var _0x5b6674 = _0xc780e2.child(_0x2e2541);
            _0x5b6674.once("value", _0x523d7d => {
              if (_0x4ca62d(_0x523d7d)) {
                _0x42f8ca(_0x19c40d);
                return;
              }
            })["catch"](_0x3d2fc8 => {
              console.error("Error fetching data:", _0x3d2fc8);
              _0x42f8ca(false);
            });
            if (_0x19c40d) {
              return;
            }
          }
        }
        _0x42f8ca(false);
      }
      _0x26aa7c.on("value", _0x43ebb0 => {
        const _0x493462 = _0x43ebb0.val().englishInput;
        if (_0x493462) {
          _0x156e29.once("value").then(_0x2452a5 => {
            if (_0x2452a5.val().vedich === 0x1) {
              speakText(_0x493462);
              console.log("Speaking custom input:", _0x493462);
            }
          });
        }
      });
      _0x4b3aa2.on('value', _0x1cd177 => {
        const _0x38ce95 = _0x1cd177.val().time;
        _0x3a4a53();
        document.getElementById("audio_FinishPracticeGuestWelcome").pause();
        document.getElementById("audio_FinishPracticeGuestWelcome").currentTime = 0x0;
        document.getElementById("audio_FinishPractice20Seconds").pause();
        document.getElementById("audio_FinishPractice20Seconds").currentTime = 0x0;
        document.getElementById("audio_FinishPractice30Seconds").pause();
        document.getElementById("audio_FinishPractice30Seconds").currentTime = 0x0;
        document.getElementById("audio_FinishPractice40Seconds").pause();
        document.getElementById("audio_FinishPractice40Seconds").currentTime = 0x0;
        document.getElementById("audio_FinishPractice60Seconds").pause();
        document.getElementById("audio_FinishPractice60Seconds").currentTime = 0x0;
        const _0x25c587 = document.getElementById("FinishQuestionTime");
        function _0x3cf29f(_0x50d0a6) {
          if (window.finishSecondTimerInterval) {
            clearInterval(window.finishSecondTimerInterval);
          }
          let _0x4c3f74 = _0x50d0a6;
          _0x237ea6(_0x4c3f74);
          _0x25c587.classList.remove('hidden');
          window.finishSecondTimerInterval = setInterval(() => {
            _0x4c3f74--;
            if (_0x4c3f74 < 0x0) {
              clearInterval(window.finishSecondTimerInterval);
              _0x25c587.textContent = '';
              _0x25c587.classList.add('hidden');
              return;
            }
            _0x237ea6(_0x4c3f74);
          }, 0x3e8);
          function _0x237ea6(_0x2dcd44) {
            if (_0x2dcd44 >= 0x3c) {
              const _0x54b203 = Math.floor(_0x2dcd44 / 0x3c);
              const _0x6cbf76 = _0x2dcd44 % 0x3c;
              _0x25c587.textContent = _0x54b203.toString().padStart(0x2, '0') + ':' + _0x6cbf76.toString().padStart(0x2, '0');
            } else {
              _0x25c587.textContent = "00:" + _0x2dcd44.toString().padStart(0x2, '0');
            }
          }
        }
        switch (_0x38ce95) {
          case "GuestWelcome":
            _0x25c587.classList.remove('hidden');
            document.getElementById("audio_FinishPracticeGuestWelcome").currentTime = 0x0;
            document.getElementById("audio_FinishPracticeGuestWelcome").play();
            break;
          case 0x14:
            _0x25c587.classList.remove("hidden");
            document.getElementById("audio_FinishPractice20Seconds").currentTime = 0x0;
            document.getElementById("audio_FinishPractice20Seconds").play();
            _0x3cf29f(0x14);
            break;
          case 0x1e:
            _0x25c587.classList.remove('hidden');
            document.getElementById("audio_FinishPractice30Seconds").currentTime = 0x0;
            document.getElementById("audio_FinishPractice30Seconds").play();
            _0x3cf29f(0x1e);
            break;
          case 0x28:
            _0x25c587.classList.remove("hidden");
            document.getElementById('audio_FinishPractice40Seconds').currentTime = 0x0;
            document.getElementById('audio_FinishPractice40Seconds').play();
            _0x3cf29f(0x28);
            break;
          case 0x3c:
            _0x25c587.classList.remove("hidden");
            document.getElementById("audio_FinishPractice60Seconds").currentTime = 0x0;
            document.getElementById("audio_FinishPractice60Seconds").play();
            _0x3cf29f(0x3c);
            break;
          case 0x0:
          case null:
          default:
            _0x25c587.textContent = '';
            _0x25c587.classList.add("hidden");
            break;
        }
      });
      const _0x4fd313 = document.getElementById('FinishVideoDialog');
      const _0x5e9db1 = document.getElementById("FinishVideoIframe");
      const _0x5000a7 = document.getElementById("FinishVideo");
      function _0x12067d(_0x2f478b) {
        try {
          new URL(_0x2f478b);
          return true;
        } catch {
          return false;
        }
      }
      function _0xb260b7(_0x5de2d5) {
        const _0x54cc33 = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".m4v", ".flv"];
        return _0x54cc33.some(_0x182e66 => _0x5de2d5.toLowerCase().includes(_0x182e66));
      }
      function _0x4d7d19(_0x39c8b6) {
        if (_0x5000a7 && _0x4fd313) {
          _0x5000a7.src = _0x39c8b6;
          _0x5000a7.style.display = 'block';
          _0x5000a7.classList.remove("hidden");
          _0x5000a7.autoplay = true;
          _0x5e9db1.style.display = "none";
          _0x5e9db1.classList.add("hidden");
          _0x5e9db1.src = '';
          _0x4fd313.classList.remove("opacity-0");
          _0x4fd313.classList.add('opacity-100');
          setTimeout(() => {
            _0x5000a7.play()["catch"](_0xec0e40 => {
              console.error("Error playing video:", _0xec0e40);
            });
          }, 0x64);
        }
      }
      function _0x37e19d(_0x1eb4e7) {
        if (_0x5e9db1 && _0x4fd313) {
          let _0xbb713 = _0x1eb4e7;
          if (_0x1eb4e7.includes("youtube.com") || _0x1eb4e7.includes('youtu.be')) {
            _0xbb713 = _0x1eb4e7 + (_0x1eb4e7.includes('?') ? '&' : '?');
          } else if (_0x1eb4e7.includes("vimeo.com")) {
            _0xbb713 = _0x1eb4e7 + (_0x1eb4e7.includes('?') ? '&' : '?');
          }
          _0x5e9db1.src = _0xbb713;
          _0x5e9db1.style.display = "block";
          _0x5e9db1.classList.remove("hidden");
          if (_0x5000a7) {
            _0x5000a7.style.display = "none";
            _0x5000a7.classList.add("hidden");
            _0x5000a7.pause();
            _0x5000a7.currentTime = 0x0;
            _0x5000a7.src = '';
          }
          _0x4fd313.classList.remove('opacity-0');
          _0x4fd313.classList.add("opacity-100");
        }
      }
      function _0x5af5f9() {
        if (_0x4fd313) {
          _0x4fd313.classList.add("opacity-0");
          _0x4fd313.classList.remove("opacity-100");
          if (_0x5e9db1) {
            _0x5e9db1.src = '';
            _0x5e9db1.style.display = 'none';
            _0x5e9db1.classList.add("hidden");
          }
          if (_0x5000a7) {
            _0x5000a7.style.display = "none";
            _0x5000a7.classList.add("hidden");
            _0x5000a7.pause();
            _0x5000a7.currentTime = 0x0;
            _0x5000a7.src = '';
          }
        }
      }
      if (_0x4fd313) {
        _0x4fd313.classList.add("opacity-0");
      }
      if (typeof _0x3dc3c0 !== "undefined") {
        _0x3dc3c0.on("value", _0x13915b => {
          const _0x5e778c = _0x13915b.val();
          console.log("Video state changed:", _0x5e778c);
          if (_0x5e778c && _0x5e778c.CustomVideo) {
            console.log("Custom video detected:", _0x5e778c.CustomVideo);
            if (_0x12067d(_0x5e778c.CustomVideo)) {
              if (_0x5e778c.CustomVideo.includes("youtube.com") || _0x5e778c.CustomVideo.includes("youtu.be") || _0x5e778c.CustomVideo.includes("vimeo.com") || _0x5e778c.CustomVideo.includes('embed') || _0x5e778c.CustomVideo.includes("iframe") || _0x5e778c.CustomVideo.includes("dailymotion.com") || _0x5e778c.CustomVideo.includes("twitch.tv")) {
                console.log("Using iframe for embedded content");
                _0x37e19d(_0x5e778c.CustomVideo);
              } else if (_0xb260b7(_0x5e778c.CustomVideo)) {
                console.log("Using video element for direct video link");
                _0x4d7d19(_0x5e778c.CustomVideo);
              } else {
                console.log("Using iframe for other URL type");
                _0x37e19d(_0x5e778c.CustomVideo);
              }
            } else {
              console.log("Using iframe for non-URL content");
              _0x37e19d(_0x5e778c.CustomVideo);
            }
          } else {
            console.log("No custom video, hiding dialog");
            _0x5af5f9();
          }
        });
      } else {
        console.log("refFinishVideoState is undefined");
      }
      const _0x3e6f79 = realtimeDB.ref(_0x2e76e0 + "/AudioControl/finish");
      _0x3e6f79.on("value", _0x2d1f0a => {
        const _0x48fbb0 = _0x2d1f0a.val();
        if (!_0x48fbb0 || !_0x48fbb0.audioData) {
          return;
        }
        if (_0x48fbb0.isPlaying) {
          window.stopCurrentQuestionAudio();
          setTimeout(() => {
            playQuestionAudio(_0x48fbb0.audioData);
          }, 0x64);
        } else {
          window.stopCurrentQuestionAudio();
        }
      });
    });
  });