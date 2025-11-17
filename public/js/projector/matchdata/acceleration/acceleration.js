let isVideo = null;
auth.onAuthStateChanged(_0x54eeac => {
  if (!_0x54eeac) {
    return;
  }
  const _0x3ebd7d = firestoreDB.collection("match").doc(auth.currentUser.uid);
  _0x3ebd7d.onSnapshot(_0x34fcd2 => {
    if (!_0x34fcd2.exists) {
      return;
    }
    const _0x1235d6 = _0x34fcd2.data().match;
    var _0x475a16 = realtimeDB.ref(_0x1235d6 + "/Acceleration/QS");
    var _0x5e8f97 = realtimeDB.ref(_0x1235d6 + "/AccelerationDisplayAnswerImage");
    var _0x25b4a8 = realtimeDB.ref(_0x1235d6 + '/phanthistatus/tangtoc');
    var _0x787260 = realtimeDB.ref(_0x1235d6 + '/AccelerationAnswers');
    var _0x207ce8 = realtimeDB.ref(_0x1235d6 + "/AccelerationOpenAnswer");
    var _0x223a64 = realtimeDB.ref(_0x1235d6 + '/AccelerationChecked');
    var _0x362161 = realtimeDB.ref(_0x1235d6 + "/AlreadyOpenAnswer");
    
    // Track để biết đã vào section Acceleration chưa
    let _isAccelerationSectionActive = false;
    
    // Helper function để switch sang Camera khi vào section lần đầu
    function switchToCameraIfFirstTime() {
      if (!_isAccelerationSectionActive) {
        _isAccelerationSectionActive = true;
        
        if (window.obsIntegrationController && 
            window.obsIntegrationController.obsManager && 
            window.obsIntegrationController.obsManager.isConnectedToOBS()) {
          console.log('Acceleration section shown (first time): Switching to Camera scene');
          window.obsIntegrationController.obsManager.switchScene('Camera');
        }
      }
    }
    
    _0x475a16.on("value", _0x263040 => {
      const _0x28de1c = _0x263040.val().tangtoc;
      realtimeDB.ref(_0x1235d6 + '/AccelerationQuestion/QS' + _0x28de1c).on("value", _0xd959b4 => {
        if (!_0xd959b4.exists()) {
          return;
        }
        document.getElementById('AccelerationQuestion').textContent = _0xd959b4.val().cauhoi;
        
        // OBS: Khi câu hỏi được load và hiển thị → scene Acceleration
        if (_0x28de1c !== 0x0) {
          // Nếu đã active (câu thứ 2, 3, 4...) thì switch ngay
          // Nếu chưa active (câu đầu tiên) thì delay để Camera hiển thị trước
          // Delay 800ms = 200ms (show section) + 600ms (để Camera scene hiển thị rõ)
          const switchDelay = _isAccelerationSectionActive ? 0 : 800;
          
          setTimeout(() => {
            if (window.obsIntegrationController && 
                window.obsIntegrationController.obsManager && 
                window.obsIntegrationController.obsManager.isConnectedToOBS()) {
              console.log('Acceleration question loaded: Switching to Acceleration scene');
              window.obsIntegrationController.obsManager.switchScene('Acceleration');
            }
          }, switchDelay);
        }
      });
      if (_0x28de1c === 0x0) {
        document.getElementById("AccelerationQuestion").textContent = '';
        document.getElementById('Acceleration').classList.add("hidden");
        // Reset flag khi thoát section
        _isAccelerationSectionActive = false;
      } else {
        // OBS: Switch sang Camera khi vào section lần đầu (TRƯỚC KHI show section)
        switchToCameraIfFirstTime();
        
        setTimeout(() => {
          document.getElementById("Title").classList.add("hidden");
          document.getElementById('Acceleration').classList.remove('hidden');
        }, 0xc8);
      }
      const _0x2da664 = document.getElementById("AccelerationAnswers");
      const _0x1c8f55 = getPlayerLimit();
      for (let _0x12508d = 0x1; _0x12508d <= _0x1c8f55; _0x12508d++) {
        if (_0x2da664.children[_0x12508d - 0x1]) {
          _0x2da664.children[_0x12508d - 0x1].classList.remove("brightness-50");
        }
      }
      document.getElementById("AccelerationMedia").pause();
      document.getElementById('AccelerationMedia').currentTime = 0x0;
      if (_0x28de1c !== 0x0) {
        _0x4d9a33(true);
        document.getElementById('audio_AccelerationQuestionShow').currentTime = 0x0;
        document.getElementById("audio_AccelerationQuestionShow").play();
      } else {
        _0x4d9a33(false);
      }
      _0x1f89c1();
    });
    let _0x5a9b9a = null;
    let _0x415d60 = null;
    _0x475a16.on('value', _0x1c4492 => {
      const _0x1d69d6 = _0x1c4492.val();
      if (!_0x1d69d6 || !_0x1d69d6.tangtoc) {
        return;
      }
      const _0x2df149 = _0x1d69d6.tangtoc;
      _0x5a9b9a = _0x2df149;
      if (_0x2cbaf2) {
        _0x2cbaf2();
      }
      _0x5e8f97.off("value");
      _0x5e8f97.on("value", async _0x3495a0 => {
        const _0xa79925 = _0x3495a0.val();
        if (!_0xa79925 || typeof _0xa79925.status === "undefined") {
          return;
        }
        const _0x394ce1 = _0xa79925.status;
        _0x415d60 = _0x394ce1;
        const _0x2c584d = document.getElementById("AccelerationMedia");
        if (!_0x2c584d) {
          return;
        }
        const _0x621700 = _0x5a9b9a;
        const _0x34a1df = _0x415d60;
        try {
          if (!_0x394ce1) {
            const _0x20c7d9 = await window.getQuestionMedia('AccelerationQuestion', 'QS' + _0x2df149, '1');
            if (_0x5a9b9a !== _0x621700 || _0x415d60 !== _0x34a1df) {
              return;
            }
            if (_0x20c7d9.image) {
              let _0x53faab = null;
              if (window.getFileFromIndexedDB) {
                const _0x3e9b3f = await window.getFileFromIndexedDB(_0x20c7d9.image.fileName, _0x1235d6);
                if (_0x3e9b3f) {
                  _0x53faab = URL.createObjectURL(_0x3e9b3f);
                }
              }
              if (!_0x53faab) {
                _0x53faab = _0x20c7d9.image.downloadURL;
              }
              if (_0x5a9b9a === _0x621700 && _0x415d60 === _0x34a1df) {
                _0x2c584d.poster = _0x53faab;
                _0x2c584d.src = '';
                isVideo = false;
                _0x2c584d.classList.remove("hidden");
                _0x2c584d.classList.add("opacityAnimation");
              }
            }
            if (_0x20c7d9.video) {
              let _0x32e8c1 = null;
              if (window.getFileFromIndexedDB) {
                const _0x1dc83d = await window.getFileFromIndexedDB(_0x20c7d9.video.fileName);
                if (_0x1dc83d) {
                  _0x32e8c1 = URL.createObjectURL(_0x1dc83d);
                }
              }
              if (!_0x32e8c1) {
                _0x32e8c1 = _0x20c7d9.video.downloadURL;
              }
              if (_0x5a9b9a === _0x621700 && _0x415d60 === _0x34a1df) {
                _0x2c584d.src = _0x32e8c1;
                _0x2c584d.poster = '';
                _0x2c584d.load();
                isVideo = true;
                _0x2c584d.classList.add("hidden");
                _0x2c584d.classList.remove("opacityAnimation");
              }
            }
            if (!_0x20c7d9.image && !_0x20c7d9.video) {
              if (_0x5a9b9a === _0x621700 && _0x415d60 === _0x34a1df) {
                _0x2c584d.src = '';
                _0x2c584d.poster = '';
                isVideo = false;
                _0x2c584d.classList.remove("hidden");
                _0x2c584d.classList.add("opacityAnimation");
              }
            }
          } else {
            const _0xfd6f49 = await window.getQuestionMedia("AccelerationQuestion", 'QS' + _0x2df149, "answer");
            if (_0x5a9b9a !== _0x621700 || _0x415d60 !== _0x34a1df) {
              return;
            }
            if (_0xfd6f49.image) {
              let _0x4f393d = null;
              if (window.getFileFromIndexedDB) {
                const _0x247419 = await window.getFileFromIndexedDB(_0xfd6f49.image.fileName, _0x1235d6);
                if (_0x247419) {
                  _0x4f393d = URL.createObjectURL(_0x247419);
                }
              }
              if (!_0x4f393d) {
                _0x4f393d = _0xfd6f49.image.downloadURL;
              }
              _0x2c584d.poster = _0x4f393d;
              _0x2c584d.src = '';
            } else {
              _0x2c584d.src = '';
              _0x2c584d.poster = '';
            }
            isVideo = false;
            _0x2c584d.classList.remove("hidden");
            _0x2c584d.classList.add("opacityAnimation");
            _0x2c584d.load();
          }
        } catch (_0x25ef04) {
          console.error("Error loading acceleration media:", _0x25ef04);
          if (_0x5a9b9a === _0x621700 && _0x415d60 === _0x34a1df) {
            _0x2c584d.src = '';
            _0x2c584d.poster = '';
            isVideo = false;
            _0x2c584d.classList.remove("hidden");
            _0x2c584d.classList.add('opacityAnimation');
          }
        }
      });
    });
    function _0x4d9a33(_0x110bd4) {
      if (_0x110bd4 === true) {
        document.getElementById('AccelerationMainUI').classList.add('hidden');
        setTimeout(() => {
          document.getElementById('AccelerationMainUI').classList.remove('hidden');
        }, 0xc8);
      } else {
        document.getElementById('AccelerationMainUI').classList.add("hidden");
      }
    }
    let _0x3b0991;
    _0x25b4a8.on("value", _0x551ef5 => {
      const _0x5e7506 = _0x551ef5.val().batdau;
      if (_0x5e7506 === 0x1) {
        _0x475a16.once('value').then(_0x2338aa => {
          const _0x2ab94a = _0x2338aa.val().tangtoc;
          let _0x5d797c;
          if (_0x2ab94a === 0x1) {
            _0x5d797c = 0x14;
            _0x47d32f(0x4e20);
          } else {
            if (_0x2ab94a === 0x2) {
              _0x5d797c = 0x14;
              _0x47d32f(0x4e20);
            } else {
              if (_0x2ab94a === 0x3) {
                _0x5d797c = 0x1e;
                _0x47d32f(0x7530);
              } else if (_0x2ab94a === 0x4) {
                _0x5d797c = 0x1e;
                _0x47d32f(0x7530);
              }
            }
          }
          if (isVideo === true) {
            document.getElementById("AccelerationMedia").classList.remove("hidden");
          }
          const _0x51d805 = "audio_Acceleration" + _0x5d797c + "Seconds";
          document.getElementById(_0x51d805).currentTime = 0x0;
          document.getElementById(_0x51d805).play();
          document.getElementById("AccelerationMedia").play();
          _0x3b0991 = Date.now();
          const _0x4c1bd6 = setInterval(() => {
            _0x5d797c -= 0x1;
            if (_0x5d797c <= 0x0) {
              clearInterval(_0x4c1bd6);
            } else {}
          }, 0x3e8);
        });
      }
    });
    let _0x22fb45 = null;
    function _0x47d32f(_0x39773f) {
      if (_0x22fb45) {
        clearInterval(_0x22fb45);
        _0x22fb45 = null;
      }
      _0x1f89c1();
      const _0x1d195d = document.getElementById("AccelerationSlider");
      const _0x23d438 = Date.now();
      _0x22fb45 = setInterval(() => {
        const _0x568eed = Date.now() - _0x23d438;
        const _0x2b1cb0 = Math.min(_0x568eed / _0x39773f, 0x1);
        _0x1d195d.value = _0x2b1cb0 * 0x64;
        if (_0x2b1cb0 >= 0x1) {
          clearInterval(_0x22fb45);
          _0x22fb45 = null;
        }
      }, 0x10);
    }
    function _0x1f89c1() {
      const _0x103824 = document.getElementById('AccelerationSlider');
      _0x103824.value = 0x0;
    }
    _0x787260.on("value", _0x10b2d4 => {
      (async function () {
        const _0x15c1ca = {};
        _0x10b2d4.forEach(_0x22fc13 => {
          let _0x27dc8e = _0x22fc13.val();
          const _0x3b3fa4 = parseFloat(_0x27dc8e.answerTimestamp);
          const _0x530b29 = _0x27dc8e.id;
          if (!_0x15c1ca[_0x530b29] || _0x3b3fa4 > parseFloat(_0x15c1ca[_0x530b29].answerTimestamp)) {
            _0x15c1ca[_0x530b29] = {
              'answer': _0x27dc8e.answer,
              'answerTimestamp': _0x27dc8e.answerTimestamp
            };
          }
        });
        const _0x4b3c19 = [];
        const _0x14c85f = [];
        const _0x2fcc4e = getPlayerLimit();
        for (let _0x3f8ef0 = 0x1; _0x3f8ef0 <= _0x2fcc4e; _0x3f8ef0++) {
          _0x14c85f.push(realtimeDB.ref(_0x1235d6 + "/games/player" + _0x3f8ef0 + '/displayName').once("value").then(_0x25772a => {
            const _0x50ae09 = _0x25772a.val() || "Player " + _0x3f8ef0;
            const _0xc1f9bc = _0x15c1ca[_0x3f8ef0] || null;
            _0x4b3c19.push({
              'id': _0x3f8ef0,
              'displayName': _0x50ae09,
              'answer': _0xc1f9bc ? _0xc1f9bc.answer : '',
              'answerTimestamp': _0xc1f9bc ? _0xc1f9bc.answerTimestamp : null
            });
          }));
        }
        await Promise.all(_0x14c85f);
        const _0x3fdd6a = _0x4b3c19.filter(_0xbc68c9 => !_0xbc68c9.answerTimestamp).sort((_0x521b49, _0x2e1ef1) => _0x521b49.id - _0x2e1ef1.id);
        const _0xa1d42d = _0x4b3c19.filter(_0x5761f4 => _0x5761f4.answerTimestamp).sort((_0x53b507, _0x1dabcd) => parseFloat(_0x53b507.answerTimestamp) - parseFloat(_0x1dabcd.answerTimestamp));
        const _0x1dd14a = _0x3fdd6a.concat(_0xa1d42d);
        _0x1dd14a.forEach((_0x2e4aa4, _0x48a7c0) => {
          const _0x20ea0c = document.getElementById("AccelerationAnswerPlayerName" + (_0x48a7c0 + 0x1));
          const _0x3e4f85 = document.getElementById("AccelerationAnswerPlayer" + (_0x48a7c0 + 0x1));
          const _0x5918b4 = document.getElementById("AccelerationAnswerTimestampPlayer" + (_0x48a7c0 + 0x1));
          if (_0x20ea0c) {
            _0x20ea0c.textContent = _0x2e4aa4.displayName;
          }
          if (_0x3e4f85) {
            _0x3e4f85.textContent = _0x2e4aa4.answer.toUpperCase();
          }
          if (_0x5918b4) {
            _0x5918b4.textContent = _0x2e4aa4.answerTimestamp ? '' + _0x2e4aa4.answerTimestamp : '';
          }
        });
      })();
    });
    let _0x271e7a = new WeakMap();
    function _0x45a5ae() {
      const _0x18b376 = document.getElementById("AccelerationAnswerUI");
      if (!_0x18b376) {
        return;
      }
      _0x18b376.querySelectorAll('*').forEach(_0x43c006 => {
        _0x271e7a.set(_0x43c006, [..._0x43c006.classList]);
        _0x43c006.classList.remove('leftName', "leftAnswer", "verticalLineAppear");
      });
    }
    function _0x2cbaf2() {
      const _0x1eff13 = document.getElementById("AccelerationAnswerUI");
      if (!_0x1eff13) {
        return;
      }
      _0x1eff13.querySelectorAll('*').forEach(_0x5f3f0f => {
        if (_0x271e7a.has(_0x5f3f0f)) {
          _0x5f3f0f.classList.add(..._0x271e7a.get(_0x5f3f0f));
        }
      });
      _0x271e7a = new WeakMap();
    }
    let _0x283bef = true;
    _0x207ce8.on("value", _0x58f1d4 => {
      const _0x5c72a1 = _0x58f1d4.val().OpenAnswer;
      if (_0x5c72a1 === 0x1) {
        _0x283bef = false;
        _0x362161.once("value").then(_0x201cc8 => {
          if (_0x201cc8.val().status === true) {
            _0x45a5ae();
            return;
          }
          ;
          document.getElementById("audio_AccelerationAnswerShow").currentTime = 0x0;
          document.getElementById("audio_AccelerationAnswerShow").play();
        });
        document.getElementById("AccelerationMainUI").classList.add("hidden");
        document.getElementById("AccelerationAnswerUI").classList.remove("hidden");
      } else if (_0x5c72a1 === 0x0 && _0x283bef == false) {
        document.getElementById("AccelerationMainUI").classList.remove('hidden');
        document.getElementById('AccelerationAnswerUI').classList.add("hidden");
      }
    });
    _0x223a64.on("value", _0x2cc79b => {
      const _0x33fde0 = _0x2cc79b.val();
      if (!_0x33fde0 || typeof _0x33fde0.checkAnswer === "undefined") {
        return;
      }
      const _0x35f54d = _0x33fde0.checkAnswer;
      if (_0x35f54d === true) {
        let _0x37952e = false;
        let _0x1f33a8 = 0x0;
        const _0x2702a0 = document.getElementById("AccelerationAnswers");
        if (!_0x2702a0) {
          console.warn("AccelerationAnswers container not found");
          return;
        }
        const _0x5237eb = getPlayerLimit();
        if (_0x2702a0.children.length < _0x5237eb) {
          console.warn("⚠️ [DEBUG] MISMATCH: Player limit is " + _0x5237eb + " but only " + _0x2702a0.children.length + " answer elements available!");
        }
        for (let _0x55c90f = 0x1; _0x55c90f <= _0x5237eb; _0x55c90f++) {
          const _0x212bfc = _0x33fde0['TT' + _0x55c90f]?.["correctorwrong"];
          const _0x280fbc = _0x2702a0.children[_0x55c90f - 0x1];
          if (_0x280fbc) {
            _0x280fbc.classList.remove("brightness-50");
            if (_0x212bfc === 0x1) {
              _0x37952e = true;
            } else if (_0x212bfc === 0x2) {
              _0x280fbc.classList.add("brightness-50");
              _0x1f33a8++;
            }
          } else {
            if (_0x212bfc === 0x1) {
              _0x37952e = true;
            } else if (_0x212bfc === 0x2) {
              _0x1f33a8++;
            }
          }
        }
        if (_0x37952e) {
          const _0x19a52b = document.getElementById('audio_AccelerationRightAnswer');
          if (_0x19a52b) {
            _0x19a52b.currentTime = 0x0;
            _0x19a52b.play()["catch"](console.error);
          }
        } else {
          if (_0x1f33a8 === _0x5237eb) {
            const _0x1aeeb7 = document.getElementById('audio_AccelerationWrongAnswer');
            if (_0x1aeeb7) {
              _0x1aeeb7.currentTime = 0x0;
              _0x1aeeb7.play()["catch"](console.error);
            }
          }
        }
      }
    });
  });
});