let isVideo = null;
auth.onAuthStateChanged(_0x57da42 => {
  if (!_0x57da42) {
    return;
  }
  const _0x24ca6e = firestoreDB.collection('match').doc(auth.currentUser.uid);
  _0x24ca6e.onSnapshot(_0x18e830 => {
    if (!_0x18e830.exists) {
      return;
    }
    const _0x32accf = _0x18e830.data().match;
    var _0x509de3 = realtimeDB.ref(_0x32accf + "/Acceleration/QS");
    var _0xd8a329 = realtimeDB.ref(_0x32accf + "/AccelerationDisplayAnswerImage");
    var _0x3bcbad = realtimeDB.ref(_0x32accf + '/phanthistatus/tangtoc');
    var _0x3eccd3 = realtimeDB.ref(_0x32accf + "/AccelerationAnswers");
    var _0x1a52ad = realtimeDB.ref(_0x32accf + '/AccelerationOpenAnswer');
    var _0x14c242 = realtimeDB.ref(_0x32accf + '/AccelerationChecked');
    var _0x4aaa82 = realtimeDB.ref(_0x32accf + "/AlreadyOpenAnswer");
    _0x509de3.on("value", _0x49c8b4 => {
      const _0x5577d4 = _0x49c8b4.val().tangtoc;
      realtimeDB.ref(_0x32accf + "/AccelerationQuestion/QS" + _0x5577d4).on("value", _0x1c179a => {
        if (!_0x1c179a.exists()) {
          return;
        }
        document.getElementById("AccelerationQuestion").textContent = _0x1c179a.val().cauhoi;
      });
      if (_0x5577d4 === 0x0) {
        document.getElementById('AccelerationQuestion').textContent = '';
        document.getElementById("AccelerationMedia").src = '';
        document.getElementById('AccelerationMedia').poster = '';
        questionText = '';
      }
      let _0x5ae3e5;
      if (_0x5577d4 === 0x1) {
        _0x5ae3e5 = '00:20';
      } else {
        if (_0x5577d4 === 0x2) {
          _0x5ae3e5 = '00:20';
        } else {
          if (_0x5577d4 === 0x3) {
            _0x5ae3e5 = "00:30";
          } else if (_0x5577d4 === 0x4) {
            _0x5ae3e5 = "00:30";
          } else {
            _0x5ae3e5 = '';
          }
        }
      }
      document.getElementById("AccelerationAnswerTime").textContent = _0x5ae3e5;
      document.getElementById("AccelerationMedia").pause();
      document.getElementById("AccelerationMedia").currentTime = 0x0;
      if (_0x5577d4 !== 0x0) {
        document.getElementById('audio_AccelerationQuestionShow').currentTime = 0x0;
        document.getElementById('audio_AccelerationQuestionShow').play();
      }
    });
    let _0x466bb0 = null;
    let _0x48f659 = null;
    _0x509de3.on('value', _0x36e8fe => {
      const _0x53527e = _0x36e8fe.val();
      if (!_0x53527e || !_0x53527e.tangtoc) {
        return;
      }
      const _0x5d46a0 = _0x53527e.tangtoc;
      _0x466bb0 = _0x5d46a0;
      _0xd8a329.off('value');
      _0xd8a329.on('value', async _0x3f24ca => {
        const _0x715ff3 = _0x3f24ca.val();
        if (!_0x715ff3 || typeof _0x715ff3.status === "undefined") {
          return;
        }
        const _0xb0a336 = _0x715ff3.status;
        _0x48f659 = _0xb0a336;
        const _0x1c29e8 = document.getElementById('AccelerationMedia');
        if (!_0x1c29e8) {
          return;
        }
        const _0x271113 = _0x466bb0;
        const _0x5a9d6d = _0x48f659;
        try {
          if (!_0xb0a336) {
            const _0x415353 = await window.getQuestionMedia("AccelerationQuestion", 'QS' + _0x5d46a0, '1');
            if (_0x466bb0 !== _0x271113 || _0x48f659 !== _0x5a9d6d) {
              return;
            }
            if (_0x415353.image) {
              let _0x5236f3 = null;
              if (window.getFileFromIndexedDB) {
                const _0x32b186 = await window.getFileFromIndexedDB(_0x415353.image.fileName);
                if (_0x32b186) {
                  _0x5236f3 = URL.createObjectURL(_0x32b186);
                }
              }
              if (!_0x5236f3) {
                _0x5236f3 = _0x415353.image.downloadURL;
              }
              if (_0x466bb0 === _0x271113 && _0x48f659 === _0x5a9d6d) {
                _0x1c29e8.poster = _0x5236f3;
                _0x1c29e8.src = '';
                isVideo = false;
                _0x1c29e8.classList.remove("hidden");
              }
            }
            if (_0x415353.video) {
              let _0x44be06 = null;
              if (window.getFileFromIndexedDB) {
                const _0x3a8676 = await window.getFileFromIndexedDB(_0x415353.video.fileName);
                if (_0x3a8676) {
                  _0x44be06 = URL.createObjectURL(_0x3a8676);
                }
              }
              if (!_0x44be06) {
                _0x44be06 = _0x415353.video.downloadURL;
              }
              if (_0x466bb0 === _0x271113 && _0x48f659 === _0x5a9d6d) {
                _0x1c29e8.src = _0x44be06;
                _0x1c29e8.poster = '';
                _0x1c29e8.load();
                isVideo = true;
                _0x1c29e8.classList.add("hidden");
              }
            }
            if (!_0x415353.image && !_0x415353.video) {
              if (_0x466bb0 === _0x271113 && _0x48f659 === _0x5a9d6d) {
                _0x1c29e8.src = '';
                _0x1c29e8.poster = '';
                isVideo = false;
                _0x1c29e8.classList.remove("hidden");
              }
            }
          } else {
            const _0x1505e2 = await window.getQuestionMedia("AccelerationQuestion", 'QS' + _0x5d46a0, "answer");
            if (_0x466bb0 !== _0x271113 || _0x48f659 !== _0x5a9d6d) {
              return;
            }
            if (_0x1505e2.image) {
              let _0x380cce = null;
              if (window.getFileFromIndexedDB) {
                const _0x2f818d = await window.getFileFromIndexedDB(_0x1505e2.image.fileName);
                if (_0x2f818d) {
                  _0x380cce = URL.createObjectURL(_0x2f818d);
                }
              }
              if (!_0x380cce) {
                _0x380cce = _0x1505e2.image.downloadURL;
              }
              _0x1c29e8.poster = _0x380cce;
              _0x1c29e8.src = '';
            } else {
              _0x1c29e8.src = '';
              _0x1c29e8.poster = '';
            }
            isVideo = false;
            _0x1c29e8.classList.remove("hidden");
            _0x1c29e8.load();
          }
        } catch (_0x34c114) {
          console.error("Error loading acceleration media:", _0x34c114);
          if (_0x466bb0 === _0x271113 && _0x48f659 === _0x5a9d6d) {
            _0x1c29e8.src = '';
            _0x1c29e8.poster = '';
            isVideo = false;
            _0x1c29e8.classList.remove('hidden');
          }
        }
      });
    });
    let _0x2804d7;
    let _0x247b84;
    _0x3bcbad.on("value", _0x943983 => {
      const _0x327a19 = _0x943983.val().batdau;
      if (_0x327a19 === 0x1) {
        if (_0x247b84) {
          clearInterval(_0x247b84);
        }
        _0x509de3.once("value").then(_0x358168 => {
          const _0x2fc1a1 = _0x358168.val().tangtoc;
          let _0x475cd2;
          if (_0x2fc1a1 === 0x1) {
            _0x475cd2 = 0x14;
          } else {
            if (_0x2fc1a1 === 0x2) {
              _0x475cd2 = 0x14;
            } else {
              if (_0x2fc1a1 === 0x3) {
                _0x475cd2 = 0x1e;
              } else if (_0x2fc1a1 === 0x4) {
                _0x475cd2 = 0x1e;
              }
            }
          }
          const _0x5d48b7 = "audio_Acceleration" + _0x475cd2 + "Seconds";
          document.getElementById(_0x5d48b7).currentTime = 0x0;
          document.getElementById(_0x5d48b7).play();
          if (isVideo === true) {
            document.getElementById("AccelerationMedia").classList.remove("hidden");
          }
          document.getElementById('AccelerationMedia').play();
          document.getElementById("AccelerationAnswerInput").disabled = false;
          document.getElementById('AccelerationAnswerInput').focus();
          document.getElementById("AccelerationAnswerInput").scrollIntoView();
          document.getElementById("AccelerationAnswerTime").textContent = '00:' + (_0x475cd2 < 0xa ? '0' : '') + _0x475cd2;
          document.getElementById("AccelerationAnswerCircleStatus").classList.remove('text-red-500');
          document.getElementById("AccelerationAnswerCircleStatus").classList.add('text-green-500');
          _0x2804d7 = Date.now();
          _0x247b84 = setInterval(() => {
            _0x475cd2 -= 0x1;
            if (_0x475cd2 <= 0x0) {
              clearInterval(_0x247b84);
              _0x247b84 = null;
              document.getElementById("AccelerationAnswerInput").disabled = true;
              document.getElementById('AccelerationAnswerInput').value = '';
              document.getElementById("AccelerationAnswerCircleStatus").classList.remove("text-green-500");
              document.getElementById('AccelerationAnswerCircleStatus').classList.add("text-red-500");
              document.getElementById("AccelerationAnswerTime").textContent = "00:00";
            } else {
              document.getElementById("AccelerationAnswerTime").textContent = "00:" + (_0x475cd2 < 0xa ? '0' : '') + _0x475cd2;
            }
          }, 0x3e8);
        });
      }
    });
    document.getElementById('AccelerationAnswerInput').addEventListener('keypress', _0x1d9b05 => {
      if (_0x1d9b05.key === "Enter" && _0x1d9b05.target.value.trim() !== '') {
        const _0x1d2258 = ((Date.now() - _0x2804d7) / 0x3e8).toFixed(0x3);
        _0x3eccd3.push({
          'id': localStorage.getItem('id'),
          'answer': _0x1d9b05.target.value,
          'answerTimestamp': _0x1d2258,
          'timestamp': firebase.database.ServerValue.TIMESTAMP
        });
        _0x1d9b05.target.value = '';
      }
    });
    _0x3eccd3.orderByChild("timestamp").limitToLast(0x1).on("value", _0x1e6e01 => {
      if (!_0x1e6e01.exists()) {
        document.getElementById("AccelerationAnswerOutput").textContent = '';
        document.getElementById("AccelerationAnswerTimestamp").textContent = '0.000s';
        return;
      }
      _0x1e6e01.forEach(_0x35d7bc => {
        const _0x1a5927 = _0x35d7bc.val();
        if (_0x1a5927 && _0x1a5927.id === localStorage.getItem('id')) {
          document.getElementById("AccelerationAnswerOutput").textContent = _0x1a5927.answer.toUpperCase();
          document.getElementById('AccelerationAnswerTimestamp').textContent = _0x1a5927.answerTimestamp + 's';
        }
      });
    });
    _0x3eccd3.on("value", _0x240105 => {
      (async function () {
        const _0x367d73 = {};
        _0x240105.forEach(_0x166680 => {
          let _0x31cc75 = _0x166680.val();
          const _0xaf924b = parseFloat(_0x31cc75.answerTimestamp);
          const _0x4a8907 = _0x31cc75.id;
          if (!_0x367d73[_0x4a8907] || _0xaf924b > parseFloat(_0x367d73[_0x4a8907].answerTimestamp)) {
            _0x367d73[_0x4a8907] = {
              'answer': _0x31cc75.answer,
              'answerTimestamp': _0x31cc75.answerTimestamp
            };
          }
        });
        const _0x59dfc9 = [];
        const _0x2ed251 = [];
        const _0x420f90 = getPlayerLimit();
        for (let _0x193bb1 = 0x1; _0x193bb1 <= _0x420f90; _0x193bb1++) {
          _0x2ed251.push(realtimeDB.ref(_0x32accf + "/games/player" + _0x193bb1 + "/displayName").once("value").then(_0xd686fb => {
            const _0x43f747 = _0xd686fb.val() || "Player " + _0x193bb1;
            const _0x509845 = _0x367d73[_0x193bb1] || null;
            _0x59dfc9.push({
              'id': _0x193bb1,
              'displayName': _0x43f747,
              'answer': _0x509845 ? _0x509845.answer : '',
              'answerTimestamp': _0x509845 ? _0x509845.answerTimestamp : null
            });
          }));
        }
        await Promise.all(_0x2ed251);
        const _0x1bdfe0 = _0x59dfc9.filter(_0x864e44 => !_0x864e44.answerTimestamp).sort((_0x57416d, _0x5c9e06) => _0x57416d.id - _0x5c9e06.id);
        const _0x1d3d3a = _0x59dfc9.filter(_0x375da9 => _0x375da9.answerTimestamp).sort((_0x8833bf, _0x31a6dc) => parseFloat(_0x8833bf.answerTimestamp) - parseFloat(_0x31a6dc.answerTimestamp));
        const _0x25d69d = _0x1bdfe0.concat(_0x1d3d3a);
        let _0x346319 = '';
        _0x25d69d.forEach((_0x1af0de, _0x1f1334) => {
          const _0x580deb = _0x1f1334 % 0x2 === 0x0 ? "bg-white dark:bg-neutral-700" : "bg-gray-50 dark:bg-neutral-600";
          const _0x4546b2 = _0x1af0de.answerTimestamp ? '' + _0x1af0de.answerTimestamp : '';
          _0x346319 += "<tr class=\"" + _0x580deb + "\">\n                                                    <td class=\"px-6 py-4 font-medium text-black dark:text-white\">" + _0x1af0de.displayName + "</td>\n                                                    <td class=\"px-6 py-4 text-gray-700 dark:text-gray-300 font-medium\">" + _0x1af0de.answer.toUpperCase() + "</td>\n                                                    <td class=\"px-6 py-4 text-gray-700 dark:text-gray-300 font-medium\">" + _0x4546b2 + "</td>\n                                            </tr>";
        });
        document.getElementById("AccelerationAnswerTable").innerHTML = _0x346319;
      })();
    });
    _0x1a52ad.on('value', _0x58653a => {
      const _0xfe6a9a = _0x58653a.val().OpenAnswer;
      const _0x10690e = document.getElementById("AccelerationAnswerLockStatusIcon");
      const _0x129144 = document.querySelector("[aria-controls=\"acceleration-contestant-answer\"]").parentElement;
      const _0x53f163 = _0x129144.querySelector('[data-tab-target]');
      const _0x1e2c7f = document.querySelector("[aria-controls=\"acceleration-answer-question\"]");
      const _0x3c4ac = document.getElementById("acceleration-contestant-answer");
      const _0x58bea2 = document.getElementById("acceleration-answer-question");
      if (_0xfe6a9a === 0x1) {
        _0x4aaa82.once('value', _0x50504d => {
          if (_0x50504d.val().status === true) {
            return;
          }
          document.getElementById('audio_AccelerationAnswerShow').currentTime = 0x0;
          document.getElementById('audio_AccelerationAnswerShow').play();
        });
        _0x10690e.textContent = "lock_open";
        _0x129144.classList.remove('pointer-events-none', "opacity-50");
        _0x53f163.classList.remove('cursor-not-allowed');
        _0x53f163.classList.add("cursor-pointer");
        _0x3c4ac.classList.remove("hidden", 'opacity-0');
        _0x3c4ac.classList.add('block', "opacity-100");
        _0x58bea2.classList.remove("block", "opacity-100");
        _0x58bea2.classList.add("hidden", 'opacity-0');
        setTimeout(() => {
          _0x53f163.click();
          _0x3d23da(_0x129144);
        }, 0x64);
      } else {
        _0x10690e.textContent = "lock";
        _0x129144.classList.add("pointer-events-none", "opacity-50");
        _0x53f163.classList.remove("cursor-pointer");
        _0x53f163.classList.add("cursor-not-allowed");
        _0x58bea2.classList.remove('hidden', "opacity-0");
        _0x58bea2.classList.add('block', "opacity-100");
        _0x3c4ac.classList.remove('block', "opacity-100");
        _0x3c4ac.classList.add("hidden", "opacity-0");
        setTimeout(() => {
          _0x1e2c7f.click();
          _0x3d23da(_0x1e2c7f.parentElement);
        }, 0x64);
      }
    });
    function _0x3d23da(_0x555b4c) {
      const _0x1c6d9a = _0x555b4c.closest('ul');
      if (!_0x1c6d9a) {
        return;
      }
      const _0x1dca7d = document.querySelectorAll("[moving-tab]");
      const _0x41aa6d = Array.from(_0x1c6d9a.children);
      const _0x1e2cb1 = _0x41aa6d.indexOf(_0x555b4c) + 0x1;
      let _0x1c7898 = 0x0;
      if (_0x1c6d9a.classList.contains('flex-col')) {
        for (let _0x546911 = 0x1; _0x546911 <= _0x41aa6d.indexOf(_0x555b4c); _0x546911++) {
          _0x1c7898 += _0x1c6d9a.querySelector('li:nth-child(' + _0x546911 + ')').offsetHeight;
        }
        _0x1dca7d.forEach(_0x290002 => {
          _0x290002.style.transform = "translate3d(0px, " + _0x1c7898 + "px, 0px)";
          _0x290002.style.height = _0x1c6d9a.querySelector("li:nth-child(" + _0x1e2cb1 + ')').offsetHeight + 'px';
        });
      } else {
        for (let _0x4be2ca = 0x1; _0x4be2ca <= _0x41aa6d.indexOf(_0x555b4c); _0x4be2ca++) {
          _0x1c7898 += _0x1c6d9a.querySelector("li:nth-child(" + _0x4be2ca + ')').offsetWidth;
        }
        _0x1dca7d.forEach(_0x50b19e => {
          _0x50b19e.style.transform = "translate3d(" + _0x1c7898 + "px, 0px, 0px)";
          _0x50b19e.style.width = _0x1c6d9a.querySelector("li:nth-child(" + _0x1e2cb1 + ')').offsetWidth + 'px';
        });
      }
    }
    _0x14c242.on("value", _0x59d3da => {
      var _0x4f0b37 = _0x59d3da.val().checkAnswer;
      if (_0x4f0b37 === true) {
        let _0x53ea71 = _0x59d3da.val();
        let _0x20bf8b = false;
        let _0x3532af = 0x0;
        const _0x6d1b89 = getPlayerLimit();
        for (let _0x10c658 = 0x1; _0x10c658 <= _0x6d1b89; _0x10c658++) {
          const _0x49d551 = _0x53ea71['TT' + _0x10c658].correctorwrong;
          if (_0x49d551 === 0x1) {
            _0x20bf8b = true;
          } else {
            _0x3532af++;
          }
        }
        if (_0x20bf8b) {
          document.getElementById('audio_AccelerationRightAnswer').currentTime = 0x0;
          document.getElementById('audio_AccelerationRightAnswer').play();
        } else if (_0x3532af === 0x4) {
          document.getElementById("audio_AccelerationWrongAnswer").currentTime = 0x0;
          document.getElementById("audio_AccelerationWrongAnswer").play();
        }
      }
    });
  });
});