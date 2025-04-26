auth.onAuthStateChanged(_0x334714 => {
    if (!_0x334714) {
      return;
    }
    const _0x3f7ec7 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x3f7ec7.onSnapshot(_0x3c9755 => {
      if (!_0x3c9755.exists) {
        return;
      }
      const _0xa8c241 = _0x3c9755.data().match;
      var _0x5769c8 = realtimeDB.ref(_0xa8c241 + '/Acceleration/QS');
      var _0x1ca909 = realtimeDB.ref(_0xa8c241 + "/AccelerationDisplayAnswerImage");
      var _0x7741b = realtimeDB.ref(_0xa8c241 + '/phanthistatus/tangtoc');
      var _0x5afd88 = realtimeDB.ref(_0xa8c241 + "/AccelerationAnswers");
      var _0x162d39 = realtimeDB.ref(_0xa8c241 + '/AccelerationOpenAnswer');
      var _0x294194 = realtimeDB.ref(_0xa8c241 + "/AccelerationChecked");
      var _0x3f4e9f = realtimeDB.ref(_0xa8c241 + "/AlreadyOpenAnswer");
      _0x5769c8.on("value", _0x596e45 => {
        const _0x4160af = _0x596e45.val().tangtoc;
        realtimeDB.ref(_0xa8c241 + "/AccelerationQuestion/QS" + _0x4160af).on("value", _0x17688c => {
          document.getElementById("AccelerationQuestion").textContent = _0x17688c.val().cauhoi;
        });
        if (_0x4160af === 0x0) {
          document.getElementById("AccelerationQuestion").textContent = '';
        }
        let _0x25d36a;
        if (_0x4160af === 0x1) {
          _0x25d36a = '00:10';
        } else {
          if (_0x4160af === 0x2) {
            _0x25d36a = "00:20";
          } else {
            if (_0x4160af === 0x3) {
              _0x25d36a = "00:30";
            } else if (_0x4160af === 0x4) {
              _0x25d36a = "00:40";
            } else {
              _0x25d36a = '';
            }
          }
        }
        document.getElementById("AccelerationAnswerTime").textContent = _0x25d36a;
        document.getElementById("AccelerationMedia").pause();
        document.getElementById("AccelerationMedia").currentTime = 0x0;
        if (_0x4160af !== 0x0) {
          document.getElementById("audio_AccelerationQuestionShow").currentTime = 0x0;
          document.getElementById("audio_AccelerationQuestionShow").play();
        }
      });
      _0x5769c8.on("value", _0x372c4a => {
        const _0x3428ef = _0x372c4a.val().tangtoc;
        _0x1ca909.off("value");
        _0x1ca909.on("value", _0x5ae079 => {
          const _0x71c0d2 = _0x5ae079.val().status;
          const _0x1e4ca7 = _0xa8c241 + "/tt/" + (_0x71c0d2 ? "datt" : 'tt') + _0x3428ef + "/tt" + _0x3428ef;
          firebase.storage().ref(_0x1e4ca7 + ".jpg").getDownloadURL().then(_0x2f195b => {
            document.getElementById("AccelerationMedia").poster = _0x2f195b;
          })["catch"](() => {
            document.getElementById("AccelerationMedia").poster = '';
          });
          if (!_0x71c0d2) {
            firebase.storage().ref(_0x1e4ca7 + ".mp4").getDownloadURL().then(_0x4dcef4 => {
              document.getElementById('AccelerationMedia').src = _0x4dcef4;
            })['catch'](() => {
              document.getElementById("AccelerationMedia").src = '';
            });
          } else {
            document.getElementById("AccelerationMedia").src = '';
          }
        });
      });
      let _0x1d0bb2;
      _0x7741b.on("value", _0x229dda => {
        const _0x1cd8dd = _0x229dda.val().batdau;
        if (_0x1cd8dd === 0x1) {
          _0x5769c8.once("value").then(_0x2dcf24 => {
            const _0x3e306c = _0x2dcf24.val().tangtoc;
            let _0x1fee5b;
            if (_0x3e306c === 0x1) {
              _0x1fee5b = 0xa;
            } else {
              if (_0x3e306c === 0x2) {
                _0x1fee5b = 0x14;
              } else {
                if (_0x3e306c === 0x3) {
                  _0x1fee5b = 0x1e;
                } else if (_0x3e306c === 0x4) {
                  _0x1fee5b = 0x28;
                }
              }
            }
            const _0x5b654a = "audio_Acceleration" + _0x1fee5b + "Seconds";
            document.getElementById(_0x5b654a).currentTime = 0x0;
            document.getElementById(_0x5b654a).play();
            document.getElementById("AccelerationMedia").play();
            document.getElementById('AccelerationAnswerInput').disabled = false;
            document.getElementById("AccelerationAnswerInput").focus();
            document.getElementById("AccelerationAnswerInput").scrollIntoView();
            document.getElementById("AccelerationAnswerTime").textContent = "00:" + (_0x1fee5b < 0xa ? '0' : '') + _0x1fee5b;
            document.getElementById("AccelerationAnswerCircleStatus").classList.remove("text-red-500");
            document.getElementById('AccelerationAnswerCircleStatus').classList.add("text-green-500");
            _0x1d0bb2 = Date.now();
            const _0x1f4135 = setInterval(() => {
              _0x1fee5b -= 0x1;
              if (_0x1fee5b <= 0x0) {
                clearInterval(_0x1f4135);
                document.getElementById("AccelerationAnswerInput").disabled = true;
                document.getElementById("AccelerationAnswerInput").value = '';
                document.getElementById('AccelerationAnswerCircleStatus').classList.remove("text-green-500");
                document.getElementById("AccelerationAnswerCircleStatus").classList.add("text-red-500");
                document.getElementById("AccelerationAnswerTime").textContent = '00:00';
              } else {
                document.getElementById("AccelerationAnswerTime").textContent = "00:" + (_0x1fee5b < 0xa ? '0' : '') + _0x1fee5b;
              }
            }, 0x3e8);
          });
        }
      });
      document.getElementById("AccelerationAnswerInput").addEventListener('keypress', _0x9e3282 => {
        if (_0x9e3282.key === "Enter" && _0x9e3282.target.value.trim() !== '') {
          const _0x449314 = ((Date.now() - _0x1d0bb2) / 0x3e8).toFixed(0x3);
          _0x5afd88.push({
            'id': localStorage.getItem('id'),
            'answer': _0x9e3282.target.value,
            'answerTimestamp': _0x449314,
            'timestamp': firebase.database.ServerValue.TIMESTAMP
          });
          _0x9e3282.target.value = '';
        }
      });
      _0x5afd88.orderByChild("timestamp").limitToLast(0x1).on("value", _0x3fa576 => {
        if (!_0x3fa576.exists()) {
          document.getElementById('AccelerationAnswerOutput').textContent = '';
          document.getElementById("AccelerationAnswerTimestamp").textContent = "0.000s";
          return;
        }
        _0x3fa576.forEach(_0x48ff02 => {
          const _0x15ac7d = _0x48ff02.val();
          if (_0x15ac7d && _0x15ac7d.id === localStorage.getItem('id')) {
            document.getElementById('AccelerationAnswerOutput').textContent = _0x15ac7d.answer.toUpperCase();
            document.getElementById("AccelerationAnswerTimestamp").textContent = _0x15ac7d.answerTimestamp + 's';
          }
        });
      });
      _0x5afd88.on("value", _0x383365 => {
        (async function () {
          const _0x280e8d = {};
          _0x383365.forEach(_0x530853 => {
            let _0x2f06a9 = _0x530853.val();
            const _0x47ebb2 = parseFloat(_0x2f06a9.answerTimestamp);
            const _0x212a54 = _0x2f06a9.id;
            if (!_0x280e8d[_0x212a54] || _0x47ebb2 > parseFloat(_0x280e8d[_0x212a54].answerTimestamp)) {
              _0x280e8d[_0x212a54] = {
                'answer': _0x2f06a9.answer,
                'answerTimestamp': _0x2f06a9.answerTimestamp
              };
            }
          });
          const _0x509315 = [];
          const _0x514919 = [];
          for (let _0xfc1be7 = 0x1; _0xfc1be7 <= 0x4; _0xfc1be7++) {
            _0x514919.push(realtimeDB.ref(_0xa8c241 + "/games/player" + _0xfc1be7 + "/displayName").once('value').then(_0x1de701 => {
              const _0x12fe18 = _0x1de701.val() || "Player " + _0xfc1be7;
              const _0x194abb = _0x280e8d[_0xfc1be7] || null;
              _0x509315.push({
                'id': _0xfc1be7,
                'displayName': _0x12fe18,
                'answer': _0x194abb ? _0x194abb.answer : '',
                'answerTimestamp': _0x194abb ? _0x194abb.answerTimestamp : null
              });
            }));
          }
          await Promise.all(_0x514919);
          const _0x12298f = _0x509315.filter(_0x4b1164 => !_0x4b1164.answerTimestamp).sort((_0x1fa496, _0x12d487) => _0x1fa496.id - _0x12d487.id);
          const _0x536f2c = _0x509315.filter(_0x2730cd => _0x2730cd.answerTimestamp).sort((_0x564f01, _0x3dc99f) => parseFloat(_0x564f01.answerTimestamp) - parseFloat(_0x3dc99f.answerTimestamp));
          const _0x5f4735 = _0x12298f.concat(_0x536f2c);
          let _0x2f2afa = '';
          _0x5f4735.forEach((_0x31724b, _0x1cd478) => {
            const _0x391bec = _0x1cd478 % 0x2 === 0x0 ? "bg-white dark:bg-neutral-700" : "bg-gray-50 dark:bg-neutral-600";
            const _0x844272 = _0x31724b.answerTimestamp ? _0x31724b.answerTimestamp + 's' : '';
            _0x2f2afa += "<tr class=\"" + _0x391bec + "\">\n                                                    <td class=\"px-6 py-4 font-medium text-black dark:text-white\">" + _0x31724b.displayName + "</td>\n                                                    <td class=\"px-6 py-4 text-gray-700 dark:text-gray-300 font-medium\">" + _0x31724b.answer.toUpperCase() + "</td>\n                                                    <td class=\"px-6 py-4 text-gray-700 dark:text-gray-300 font-medium\">" + _0x844272 + "</td>\n                                            </tr>";
          });
          document.getElementById("AccelerationAnswerTable").innerHTML = _0x2f2afa;
        })();
      });
      _0x162d39.on('value', _0x1ad840 => {
        const _0x4e3e12 = _0x1ad840.val().OpenAnswer;
        const _0x4d49b1 = document.getElementById("AccelerationAnswerLockStatusIcon");
        const _0x1da0f3 = document.querySelector("[aria-controls=\"acceleration-contestant-answer\"]").parentElement;
        const _0x3dd4e6 = _0x1da0f3.querySelector("[data-tab-target]");
        const _0x502a0a = document.querySelector("[aria-controls=\"acceleration-answer-question\"]");
        const _0x4440cd = document.getElementById('acceleration-contestant-answer');
        const _0x14eba2 = document.getElementById("acceleration-answer-question");
        if (_0x4e3e12 === 0x1) {
          _0x3f4e9f.once("value", _0x1fba5c => {
            if (_0x1fba5c.val().status === true) {
              return;
            }
            document.getElementById('audio_AccelerationAnswerShow').currentTime = 0x0;
            document.getElementById("audio_AccelerationAnswerShow").play();
          });
          _0x4d49b1.textContent = "lock_open";
          _0x1da0f3.classList.remove('pointer-events-none', "opacity-50");
          _0x3dd4e6.classList.remove("cursor-not-allowed");
          _0x3dd4e6.classList.add("cursor-pointer");
          _0x4440cd.classList.remove('hidden', "opacity-0");
          _0x4440cd.classList.add("block", "opacity-100");
          _0x14eba2.classList.remove('block', "opacity-100");
          _0x14eba2.classList.add("hidden", "opacity-0");
          setTimeout(() => {
            _0x3dd4e6.click();
            _0x94a853(_0x1da0f3);
          }, 0x64);
        } else {
          _0x4d49b1.textContent = "lock";
          _0x1da0f3.classList.add('pointer-events-none', "opacity-50");
          _0x3dd4e6.classList.remove("cursor-pointer");
          _0x3dd4e6.classList.add('cursor-not-allowed');
          _0x14eba2.classList.remove("hidden", "opacity-0");
          _0x14eba2.classList.add("block", 'opacity-100');
          _0x4440cd.classList.remove("block", "opacity-100");
          _0x4440cd.classList.add("hidden", 'opacity-0');
          setTimeout(() => {
            _0x502a0a.click();
            _0x94a853(_0x502a0a.parentElement);
          }, 0x64);
        }
      });
      function _0x94a853(_0x26a7bd) {
        const _0xc5a9d0 = _0x26a7bd.closest('ul');
        if (!_0xc5a9d0) {
          return;
        }
        const _0x10636b = document.querySelectorAll("[moving-tab]");
        const _0x13e2e8 = Array.from(_0xc5a9d0.children);
        const _0x4079ee = _0x13e2e8.indexOf(_0x26a7bd) + 0x1;
        let _0x3e61bb = 0x0;
        if (_0xc5a9d0.classList.contains("flex-col")) {
          for (let _0x515bcb = 0x1; _0x515bcb <= _0x13e2e8.indexOf(_0x26a7bd); _0x515bcb++) {
            _0x3e61bb += _0xc5a9d0.querySelector("li:nth-child(" + _0x515bcb + ')').offsetHeight;
          }
          _0x10636b.forEach(_0x2bffee => {
            _0x2bffee.style.transform = "translate3d(0px, " + _0x3e61bb + "px, 0px)";
            _0x2bffee.style.height = _0xc5a9d0.querySelector("li:nth-child(" + _0x4079ee + ')').offsetHeight + 'px';
          });
        } else {
          for (let _0x14a583 = 0x1; _0x14a583 <= _0x13e2e8.indexOf(_0x26a7bd); _0x14a583++) {
            _0x3e61bb += _0xc5a9d0.querySelector("li:nth-child(" + _0x14a583 + ')').offsetWidth;
          }
          _0x10636b.forEach(_0x36d8e7 => {
            _0x36d8e7.style.transform = "translate3d(" + _0x3e61bb + "px, 0px, 0px)";
            _0x36d8e7.style.width = _0xc5a9d0.querySelector("li:nth-child(" + _0x4079ee + ')').offsetWidth + 'px';
          });
        }
      }
      _0x294194.on("value", _0x5b72f8 => {
        var _0x587cb8 = _0x5b72f8.val().checkAnswer;
        if (_0x587cb8 === true) {
          let _0x43248a = _0x5b72f8.val();
          let _0x1a475b = false;
          let _0x1837c2 = 0x0;
          for (let _0x15ab38 = 0x1; _0x15ab38 <= 0x4; _0x15ab38++) {
            const _0x32a5ae = _0x43248a['TT' + _0x15ab38].correctorwrong;
            if (_0x32a5ae === 0x1) {
              _0x1a475b = true;
            } else {
              _0x1837c2++;
            }
          }
          if (_0x1a475b) {
            document.getElementById('audio_AccelerationRightAnswer').currentTime = 0x0;
            document.getElementById("audio_AccelerationRightAnswer").play();
          } else if (_0x1837c2 === 0x4) {
            document.getElementById("audio_AccelerationWrongAnswer").currentTime = 0x0;
            document.getElementById('audio_AccelerationWrongAnswer').play();
          }
        }
      });
    });
  });