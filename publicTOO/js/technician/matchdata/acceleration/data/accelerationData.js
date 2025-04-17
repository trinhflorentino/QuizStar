auth.onAuthStateChanged(_0x3b64af => {
    if (!_0x3b64af) {
      return;
    }
    const _0x3d4f40 = firestoreDB.collection('match').doc(_0x3b64af.uid);
    _0x3d4f40.onSnapshot(_0x572ae0 => {
      if (!_0x572ae0.exists) {
        return;
      }
      const _0x4bef91 = _0x572ae0.data().match;
      var _0x20b516 = realtimeDB.ref(_0x4bef91 + "/Acceleration/QS");
      var _0x348dd4 = realtimeDB.ref(_0x4bef91 + '/AccelerationDisplayAnswerImage');
      var _0x2fde29 = realtimeDB.ref(_0x4bef91 + '/phanthistatus/tangtoc');
      var _0x4652aa = realtimeDB.ref(_0x4bef91 + "/AccelerationAnswers");
      _0x20b516.on("value", _0x4fb5c5 => {
        const _0x5dd403 = _0x4fb5c5.val().tangtoc;
        document.getElementById('AccelerationDisplayAnswer').textContent = "Hiển thị đáp án";
        const _0x472fc5 = document.querySelectorAll("[id^='AccelerationQuestion']");
        _0x472fc5.forEach(_0x43e5a4 => {
          _0x43e5a4.classList.remove('bg-blue-600', "text-white");
        });
        const _0x2c277c = document.getElementById("AccelerationQuestion" + _0x5dd403);
        if (_0x2c277c) {
          _0x2c277c.classList.add("bg-blue-600", 'text-white');
        }
        if (_0x5dd403 === 0x0) {
          document.getElementById("AccelerationQuestion").textContent = '';
          document.getElementById("AccelerationAnswer").textContent = '';
          return;
        }
        realtimeDB.ref(_0x4bef91 + "/AccelerationQuestion/QS" + _0x5dd403).on("value", _0x350f41 => {
          document.getElementById("AccelerationQuestion").textContent = _0x350f41.val().cauhoi;
          document.getElementById("AccelerationAnswer").textContent = _0x350f41.val().dapan;
        });
        document.getElementById('AccelerationMedia').pause();
        document.getElementById("AccelerationMedia").currentTime = 0x0;
      });
      _0x20b516.on('value', _0xae4c81 => {
        const _0x535e5f = _0xae4c81.val().tangtoc;
        _0x348dd4.off("value");
        _0x348dd4.on('value', _0x478f76 => {
          const _0x4fac76 = _0x478f76.val().status;
          const _0x2084de = _0x4bef91 + "/tt/" + (_0x4fac76 ? "datt" : 'tt') + _0x535e5f + "/tt" + _0x535e5f;
          firebase.storage().ref(_0x2084de + '.jpg').getDownloadURL().then(_0x49e641 => {
            document.getElementById('AccelerationMedia').poster = _0x49e641;
          })["catch"](() => {
            document.getElementById("AccelerationMedia").poster = '';
          });
          if (!_0x4fac76) {
            firebase.storage().ref(_0x2084de + ".mp4").getDownloadURL().then(_0x1c88b8 => {
              document.getElementById("AccelerationMedia").src = _0x1c88b8;
            })["catch"](() => {
              document.getElementById('AccelerationMedia').src = '';
            });
          } else {
            document.getElementById("AccelerationMedia").src = '';
          }
        });
      });
      const _0x27b6c0 = [];
      _0x4652aa.on("value", _0x1ee28b => {
        const _0x10b9eb = {};
        _0x1ee28b.forEach(_0x266927 => {
          const _0x4e3fa9 = _0x266927.val();
          const _0x4c7233 = parseFloat(_0x4e3fa9.answerTimestamp);
          const _0x139b0f = _0x4e3fa9.id;
          if (!_0x10b9eb[_0x139b0f] || _0x4c7233 > parseFloat(_0x10b9eb[_0x139b0f].answerTimestamp)) {
            _0x10b9eb[_0x139b0f] = {
              'answer': _0x4e3fa9.answer,
              'answerTimestamp': _0x4e3fa9.answerTimestamp
            };
          }
        });
        for (let _0x132c8b = 0x1; _0x132c8b <= 0x4; _0x132c8b++) {
          const _0x255920 = _0x10b9eb[_0x132c8b]?.["answer"] || '';
          const _0x2b62f4 = _0x10b9eb[_0x132c8b]?.['answerTimestamp'] || '';
          const _0x389f6e = document.getElementById("accelerationPlayer" + _0x132c8b + 'Name');
          let _0x20b86a = _0x389f6e.querySelector(".player-answer");
          if (_0x255920 === '' || _0x2b62f4 === '') {
            if (_0x20b86a) {
              _0x20b86a.remove();
            }
            const _0x4953a9 = _0x27b6c0.findIndex(_0x35991d => _0x35991d.id === _0x132c8b);
            if (_0x4953a9 !== -0x1) {
              _0x27b6c0.splice(_0x4953a9, 0x1);
            }
          } else {
            const _0x1497db = _0x27b6c0.find(_0x56b183 => _0x56b183.id === _0x132c8b);
            if (_0x1497db) {
              _0x1497db.answer = _0x255920;
              _0x1497db.timestamp = _0x2b62f4;
            } else {
              _0x27b6c0.push({
                'id': _0x132c8b,
                'answer': _0x255920,
                'timestamp': _0x2b62f4
              });
            }
          }
        }
        _0x27b6c0.sort((_0x5e6a6e, _0x5d7720) => parseFloat(_0x5e6a6e.timestamp) - parseFloat(_0x5d7720.timestamp));
        _0x27b6c0.forEach((_0x90ba11, _0x2be8e3) => {
          const _0x19c3fe = _0x2be8e3 + 0x1;
          const _0x2c1b86 = document.getElementById('accelerationPlayer' + _0x90ba11.id + "Name");
          let _0x400290 = _0x2c1b86.querySelector(".player-answer");
          if (!_0x400290) {
            _0x400290 = document.createElement('p');
            _0x400290.classList.add("dark:text-white", "font-bold", 'player-answer');
            _0x2c1b86.appendChild(_0x400290);
          }
          _0x400290.textContent = _0x90ba11.answer.toUpperCase() + '/' + _0x90ba11.timestamp + " (" + _0x19c3fe + ')';
        });
      });
      realtimeDB.ref(_0x4bef91 + "/Sounds").on('value', _0xb7a7a9 => {
        const _0x2c439b = _0xb7a7a9.val().TenseMoments;
        const _0x2a1d77 = document.getElementById("AccelerationTenseAudio");
        if (_0x2c439b === true) {
          _0x2a1d77.textContent = "Dừng âm thanh căng thẳng";
        } else {
          _0x2a1d77.textContent = "Phát âm thanh căng thẳng";
        }
      });
      _0x2fde29.on("value", _0x38bf2d => {
        if (_0x38bf2d.val().batdau == 0x1) {
          document.getElementById("AccelerationMedia").play();
          _0x20b516.once("value", _0x2ef6a6 => {
            const _0x564a5c = document.getElementById("AccelerationTimer");
            const _0x51ebe4 = _0x2ef6a6.val().tangtoc;
            if (_0x51ebe4 >= 0x1 && _0x51ebe4 <= 0x4) {
              let _0x5197d7 = _0x51ebe4 * 0xa;
              _0x564a5c.textContent = '' + _0x5197d7;
              const _0x3fcab6 = setInterval(() => {
                _0x5197d7 -= 0x1;
                _0x564a5c.textContent = '' + _0x5197d7;
                if (_0x5197d7 <= 0x0) {
                  clearInterval(_0x3fcab6);
                  _0x564a5c.textContent = '';
                }
              }, 0x3e8);
            }
          });
        }
      });
    });
  });