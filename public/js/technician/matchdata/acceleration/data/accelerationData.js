auth.onAuthStateChanged(_0x32013f => {
    if (!_0x32013f) {
      return;
    }
    const _0x2aeeab = firestoreDB.collection("match").doc(_0x32013f.uid);
    _0x2aeeab.onSnapshot(_0x4f0b2c => {
      if (!_0x4f0b2c.exists) {
        return;
      }
      const _0x582973 = _0x4f0b2c.data().match;
      var _0x14d1ac = realtimeDB.ref(_0x582973 + '/Acceleration/QS');
      var _0x4ef102 = realtimeDB.ref(_0x582973 + "/AccelerationDisplayAnswerImage");
      var _0xdb44d0 = realtimeDB.ref(_0x582973 + '/phanthistatus/tangtoc');
      var _0xc47020 = realtimeDB.ref(_0x582973 + "/AccelerationAnswers");
      _0x14d1ac.on("value", _0x59f789 => {
        const _0x3896b1 = _0x59f789.val().tangtoc;
        document.getElementById("AccelerationDisplayAnswer").textContent = "Hiển thị đáp án";
        const _0x29d7a7 = document.querySelectorAll("[id^='AccelerationQuestion']");
        _0x29d7a7.forEach(_0x1195a0 => {
          _0x1195a0.classList.remove("bg-blue-600", "text-white");
        });
        const _0x48df7f = document.getElementById("AccelerationQuestion" + _0x3896b1);
        if (_0x48df7f) {
          _0x48df7f.classList.add("bg-blue-600", "text-white");
        }
        if (_0x3896b1 === 0x0) {
          document.getElementById("AccelerationQuestion").textContent = '';
          document.getElementById("AccelerationAnswer").textContent = '';
          document.getElementById('AccelerationMedia').src = '';
          document.getElementById('AccelerationMedia').poster = '';
          return;
        }
        realtimeDB.ref(_0x582973 + "/AccelerationQuestion/QS" + _0x3896b1).on("value", _0x438a57 => {
          document.getElementById("AccelerationQuestion").textContent = _0x438a57.val().cauhoi;
          document.getElementById('AccelerationAnswer').textContent = _0x438a57.val().dapan;
        });
        document.getElementById("AccelerationMedia").pause();
        document.getElementById('AccelerationMedia').currentTime = 0x0;
      });
      let _0x4b2da1 = null;
      let _0x5470e6 = null;
      _0x14d1ac.on("value", _0x2c60ed => {
        const _0x452ba2 = _0x2c60ed.val();
        if (!_0x452ba2 || !_0x452ba2.tangtoc) {
          return;
        }
        const _0x4178f0 = _0x452ba2.tangtoc;
        _0x4b2da1 = _0x4178f0;
        _0x4ef102.off("value");
        _0x4ef102.on("value", _0x34711c => {
          const _0x473a6d = _0x34711c.val();
          if (!_0x473a6d || typeof _0x473a6d.status === "undefined") {
            return;
          }
          const _0x3f3241 = _0x473a6d.status;
          _0x5470e6 = _0x3f3241;
          const _0x70fa9 = document.getElementById("AccelerationMedia");
          if (!_0x70fa9) {
            return;
          }
          const _0x1f2e44 = _0x4b2da1;
          const _0x255363 = _0x5470e6;
          const _0x5145fc = ["QS1", 'QS2', 'QS3', 'QS4'];
          const _0x398cbf = _0x5145fc[_0x4178f0 - 0x1];
          if (!_0x398cbf) {
            _0x70fa9.poster = '';
            _0x70fa9.src = '';
            _0x70fa9.load();
            return;
          }
          if (_0x3f3241) {
            _0x5ad403(_0x582973, _0x398cbf, _0x1f2e44, _0x255363, _0x70fa9);
          } else {
            _0x2e3e63(_0x582973, _0x398cbf, _0x1f2e44, _0x255363, _0x70fa9);
          }
        });
      });
      async function _0x2e3e63(_0x232f23, _0x3478d0, _0xce694a, _0x1122c8, _0x1efc27) {
        try {
          const _0x3346fb = await window.getQuestionMedia("AccelerationQuestion", _0x3478d0, '1');
          if (_0x4b2da1 !== _0xce694a || _0x5470e6 !== _0x1122c8) {
            return;
          }
          if (_0x3346fb.image) {
            let _0x4a539b = null;
            if (window.getFileFromIndexedDB) {
              const _0xc557e9 = await window.getFileFromIndexedDB(_0x3346fb.image.fileName);
              if (_0xc557e9) {
                _0x4a539b = URL.createObjectURL(_0xc557e9);
              }
            }
            if (!_0x4a539b) {
              _0x4a539b = _0x3346fb.image.downloadURL;
            }
            if (_0x4b2da1 === _0xce694a && _0x5470e6 === _0x1122c8) {
              _0x1efc27.poster = _0x4a539b;
              _0x1efc27.src = '';
              _0x1efc27.load();
            }
            return;
          }
          if (_0x3346fb.video) {
            let _0x3d2cda = null;
            if (window.getFileFromIndexedDB) {
              const _0x5b7b7c = await window.getFileFromIndexedDB(_0x3346fb.video.fileName);
              if (_0x5b7b7c) {
                _0x3d2cda = URL.createObjectURL(_0x5b7b7c);
              }
            }
            if (!_0x3d2cda) {
              _0x3d2cda = _0x3346fb.video.downloadURL;
            }
            if (_0x4b2da1 === _0xce694a && _0x5470e6 === _0x1122c8) {
              _0x1efc27.src = _0x3d2cda;
              _0x1efc27.poster = '';
              _0x1efc27.load();
            }
            return;
          }
          const _0x3bcf7a = realtimeDB.ref(_0x232f23 + "/QuestionMedia");
          _0x3bcf7a.once("value", _0x5e68a5 => {
            const _0x541a0c = _0x5e68a5.val();
            let _0x3504a0 = null;
            if (_0x541a0c) {
              _0x3504a0 = Object.values(_0x541a0c).find(_0x234d05 => _0x234d05.competition === "AccelerationQuestion" && _0x234d05.pack === _0x3478d0 && _0x234d05.questionNumber === '1');
            }
            if (_0x4b2da1 === _0xce694a && _0x5470e6 === _0x1122c8) {
              if (_0x3504a0) {
                _0x4c1500(_0x3504a0, _0x1efc27);
              } else {
                _0x1efc27.poster = '';
                _0x1efc27.src = '';
                _0x1efc27.load();
              }
            }
          });
        } catch (_0x7cad0b) {
          console.error("Error loading acceleration question media:", _0x7cad0b);
          if (_0x4b2da1 === _0xce694a && _0x5470e6 === _0x1122c8) {
            _0x1efc27.poster = '';
            _0x1efc27.src = '';
            _0x1efc27.load();
          }
        }
      }
      async function _0x5ad403(_0x3c3d7b, _0x3c49d0, _0x53b426, _0x955eac, _0x2eca6d) {
        try {
          const _0x52287c = await window.getQuestionMedia("AccelerationQuestion", _0x3c49d0, "answer");
          if (_0x4b2da1 !== _0x53b426 || _0x5470e6 !== _0x955eac) {
            return;
          }
          if (_0x52287c.image) {
            let _0x3decb4 = null;
            if (window.getFileFromIndexedDB) {
              const _0x1abf73 = await window.getFileFromIndexedDB(_0x52287c.image.fileName);
              if (_0x1abf73) {
                _0x3decb4 = URL.createObjectURL(_0x1abf73);
              }
            }
            if (!_0x3decb4) {
              _0x3decb4 = _0x52287c.image.downloadURL;
            }
            if (_0x4b2da1 === _0x53b426 && _0x5470e6 === _0x955eac) {
              _0x2eca6d.poster = _0x3decb4;
              _0x2eca6d.src = '';
              _0x2eca6d.load();
            }
            return;
          }
          const _0x4c4b7b = realtimeDB.ref(_0x3c3d7b + "/QuestionMedia");
          _0x4c4b7b.once("value", _0x154bc4 => {
            const _0x4b00bb = _0x154bc4.val();
            let _0x3c1078 = null;
            if (_0x4b00bb) {
              _0x3c1078 = Object.values(_0x4b00bb).find(_0x25c462 => _0x25c462.competition === "AccelerationQuestion" && _0x25c462.pack === _0x3c49d0 && _0x25c462.questionNumber === "answer" && _0x25c462.mediaType === 'image');
            }
            if (_0x4b2da1 === _0x53b426 && _0x5470e6 === _0x955eac) {
              if (_0x3c1078) {
                _0x277c21(_0x3c1078, _0x2eca6d);
              } else {
                _0x2eca6d.src = '';
                _0x2eca6d.load();
              }
            }
          });
        } catch (_0xb7cb1c) {
          console.error("Error loading acceleration answer media:", _0xb7cb1c);
          if (_0x4b2da1 === _0x53b426 && _0x5470e6 === _0x955eac) {
            _0x2eca6d.src = '';
            _0x2eca6d.load();
          }
        }
      }
      function _0x4c1500(_0x32a707, _0x8ad945) {
        if (_0x32a707.mediaType === 'video') {
          _0x8ad945.src = _0x32a707.downloadURL;
          _0x8ad945.poster = '';
          _0x8ad945.load();
        } else if (_0x32a707.mediaType === "image") {
          _0x8ad945.poster = _0x32a707.downloadURL;
          _0x8ad945.src = '';
          _0x8ad945.load();
        }
      }
      function _0x277c21(_0x447883, _0x5d8fc7) {
        if (_0x447883.mediaType === "image") {
          _0x5d8fc7.poster = _0x447883.downloadURL;
          _0x5d8fc7.src = '';
          _0x5d8fc7.load();
        }
      }
      const _0x2d75f3 = [];
      _0xc47020.on("value", _0x1863fe => {
        const _0x2ac99c = {};
        _0x1863fe.forEach(_0x2bae29 => {
          const _0x4be8fd = _0x2bae29.val();
          const _0x2c9ebc = parseFloat(_0x4be8fd.answerTimestamp);
          const _0x3e7d00 = _0x4be8fd.id;
          if (!_0x2ac99c[_0x3e7d00] || _0x2c9ebc > parseFloat(_0x2ac99c[_0x3e7d00].answerTimestamp)) {
            _0x2ac99c[_0x3e7d00] = {
              'answer': _0x4be8fd.answer,
              'answerTimestamp': _0x4be8fd.answerTimestamp
            };
          }
        });
        const _0x415315 = getPlayerLimit();
        for (let _0x5aabc7 = 0x1; _0x5aabc7 <= _0x415315; _0x5aabc7++) {
          const _0x2896f6 = _0x2ac99c[_0x5aabc7]?.['answer'] || '';
          const _0x33f3c5 = _0x2ac99c[_0x5aabc7]?.["answerTimestamp"] || '';
          const _0x14c5ff = document.getElementById("accelerationPlayer" + _0x5aabc7 + 'Name');
          let _0x4e3f06 = _0x14c5ff.querySelector(".player-answer");
          if (_0x2896f6 === '' || _0x33f3c5 === '') {
            if (_0x4e3f06) {
              _0x4e3f06.remove();
            }
            const _0x27ed64 = _0x2d75f3.findIndex(_0xc80a7b => _0xc80a7b.id === _0x5aabc7);
            if (_0x27ed64 !== -0x1) {
              _0x2d75f3.splice(_0x27ed64, 0x1);
            }
          } else {
            const _0x3e9697 = _0x2d75f3.find(_0x4c968d => _0x4c968d.id === _0x5aabc7);
            if (_0x3e9697) {
              _0x3e9697.answer = _0x2896f6;
              _0x3e9697.timestamp = _0x33f3c5;
            } else {
              _0x2d75f3.push({
                'id': _0x5aabc7,
                'answer': _0x2896f6,
                'timestamp': _0x33f3c5
              });
            }
          }
        }
        _0x2d75f3.sort((_0x5bab85, _0x4e6faa) => parseFloat(_0x5bab85.timestamp) - parseFloat(_0x4e6faa.timestamp));
        _0x2d75f3.forEach((_0x34c832, _0x5c85cd) => {
          const _0x26f0c8 = _0x5c85cd + 0x1;
          const _0x55d69b = document.getElementById("accelerationPlayer" + _0x34c832.id + "Name");
          let _0x59a03d = _0x55d69b.querySelector(".player-answer");
          if (!_0x59a03d) {
            _0x59a03d = document.createElement('p');
            _0x59a03d.classList.add('dark:text-white', 'font-bold', "player-answer");
            _0x55d69b.appendChild(_0x59a03d);
          }
          _0x59a03d.textContent = _0x34c832.answer.toUpperCase() + '/' + _0x34c832.timestamp + " (" + _0x26f0c8 + ')';
        });
      });
      realtimeDB.ref(_0x582973 + "/Sounds").on("value", _0x325753 => {
        const _0x41c7a4 = _0x325753.val().TenseMoments;
        const _0xeb7ea2 = document.getElementById("AccelerationTenseAudio");
        if (_0x41c7a4 === true) {
          _0xeb7ea2.textContent = "Dừng âm thanh căng thẳng";
        } else {
          _0xeb7ea2.textContent = "Phát âm thanh căng thẳng";
        }
      });
      _0xdb44d0.on('value', _0x3e8b9c => {
        if (_0x3e8b9c.val().batdau == 0x1) {
          document.getElementById("AccelerationMedia").play();
          _0x14d1ac.once('value', _0x4c3daa => {
            const _0x59d293 = document.getElementById("AccelerationTimer");
            const _0x1bcf5f = _0x4c3daa.val().tangtoc;
            const _0x456e56 = getPlayerLimit();
            if (_0x1bcf5f >= 0x1 && _0x1bcf5f <= _0x456e56) {
              let _0x336300;
              if (_0x1bcf5f === 0x1 || _0x1bcf5f === 0x2) {
                _0x336300 = 0x14;
              } else if (_0x1bcf5f === 0x3 || _0x1bcf5f === 0x4) {
                _0x336300 = 0x1e;
              }
              _0x59d293.textContent = '' + _0x336300;
              const _0x4b8aae = setInterval(() => {
                _0x336300 -= 0x1;
                _0x59d293.textContent = '' + _0x336300;
                if (_0x336300 <= 0x0) {
                  clearInterval(_0x4b8aae);
                  _0x59d293.textContent = '';
                }
              }, 0x3e8);
            }
          });
        }
      });
    });
  });