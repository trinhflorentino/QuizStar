auth.onAuthStateChanged(_0x377c78 => {
    if (!_0x377c78) {
      return;
    }
    const _0x1006ab = firestoreDB.collection("match").doc(_0x377c78.uid);
    _0x1006ab.onSnapshot(_0x1b9069 => {
      if (!_0x1b9069.exists) {
        return;
      }
      const _0x33145d = _0x1b9069.data().match;
      var _0x585fe3 = realtimeDB.ref(_0x33145d + "/VCNV/hangngang");
      var _0x243e79 = realtimeDB.ref(_0x33145d + "/VCNVPlayed");
      var _0x168b2c = realtimeDB.ref(_0x33145d + "/VCNVOpenAnswer");
      var _0x1c6e8c = realtimeDB.ref(_0x33145d + "/AlreadyOpenAnswer");
      var _0x310d54 = realtimeDB.ref(_0x33145d + "/CompetitonAnswerCheckStatus/Obstacle");
      var _0x13e240 = realtimeDB.ref(_0x33145d + '/VCNVChuong/OpenAll');
      var _0x48918c = realtimeDB.ref(_0x33145d + '/ObstacleAnswers');
      var _0x5070c9 = realtimeDB.ref(_0x33145d + "/Sounds");
      var _0x5e5664 = realtimeDB.ref(_0x33145d + '/ObstacleBuzzer');
      for (let _0x2a07c9 = 0x1; _0x2a07c9 <= 0x5; _0x2a07c9++) {
        const _0x334fe1 = document.getElementById("ObstacleQuestion" + _0x2a07c9);
        _0x334fe1.addEventListener("click", () => {
          _0x585fe3.set({
            'hn': _0x2a07c9
          });
          _0x243e79.once("value", _0x51f681 => {
            const _0x58a2c8 = _0x51f681.val().hangngang;
            if (_0x58a2c8 < 0x5) {
              _0x243e79.set({
                'hangngang': _0x58a2c8 + 0x1
              });
            }
          });
          _0x168b2c.set({
            'OpenAnswer': 0x0
          });
          _0x1c6e8c.set({
            'status': false
          });
          _0x48918c.remove();
          _0x310d54.remove();
          document.getElementById("ObstacleStart").disabled = false;
        });
      }
      for (let _0x230901 = 0x1; _0x230901 <= 0x5; _0x230901++) {
        const _0x5b06b5 = document.getElementById("ObstacleUnlock" + _0x230901);
        _0x5b06b5.addEventListener("click", () => {
          if (confirm("Bạn có muốn mở đáp án hàng ngang số " + _0x230901 + " không?")) {
            let _0x21b03b;
            _0x21b03b = realtimeDB.ref(_0x33145d + '/VCNVRowStatus/HN' + _0x230901);
            _0x21b03b.set({
              'status': 0x1
            });
            _0x243e79.once('value', _0x157455 => {
              const _0x561c8c = _0x157455.val().hangngang;
              if (_0x561c8c < 0x5) {
                _0x243e79.set({
                  'hangngang': _0x561c8c + 0x1
                });
              }
            });
          }
        });
      }
      for (let _0x57aa16 = 0x1; _0x57aa16 <= 0x5; _0x57aa16++) {
        const _0x2517c7 = document.getElementById("ObstacleImage" + _0x57aa16);
        _0x2517c7.addEventListener("click", () => {
          if (confirm("Bạn có muốn mở góc hình ảnh số " + _0x57aa16 + " không?")) {
            let _0x1dcb66;
            _0x1dcb66 = realtimeDB.ref(_0x33145d + "/VCNVImageStatus/HA" + _0x57aa16);
            _0x1dcb66.set({
              'status': 0x1
            });
          }
        });
      }
      document.getElementById("ObstacleSpaceSound").addEventListener("click", () => {
        playSound("SpacingMusic", _0x33145d);
      });
      document.getElementById("ObstacleEnglishVoiceSound").addEventListener('click', () => {
        playSound("EnglishVoice", _0x33145d);
      });
      document.getElementById("ObstacleStart").addEventListener("click", () => {
        var _0x1a5acd = realtimeDB.ref(_0x33145d + "/phanthistatus/vcnv");
        _0x1a5acd.set({
          'batdau': 0x1
        }).then(() => {
          successToast("Đang đếm thời gian trả lời từ khoá hàng ngang");
          setTimeout(() => {
            _0x1a5acd.set({
              'batdau': 0x0
            });
          }, 0x7d0);
        });
        ;
        document.getElementById("ObstacleStart").disabled = true;
      });
      document.getElementById("ObstacleDisplayAnswer").addEventListener("click", () => {
        _0x168b2c.once('value', _0x55eabf => {
          const _0xb9e89d = _0x55eabf.val().OpenAnswer;
          const _0x152d6f = _0xb9e89d === 0x0 ? 0x1 : 0x0;
          _0x168b2c.set({
            'OpenAnswer': _0x152d6f
          }).then(() => {
            const _0xfa936f = document.getElementById("ObstacleDisplayAnswer");
            if (_0x152d6f === 0x1) {
              successToast("Đã mở đáp án thí sinh", 0xbb8, "top", "right", false, "linear-gradient(to right, #00b09b, #96c93d)", '');
              _0xfa936f.textContent = "Đóng đáp án thí sinh";
            } else {
              successToast("Đã đóng đáp án thí sinh", 0xbb8, "top", "right", false, "linear-gradient(to right, #00b09b, #96c93d)", '');
              _0xfa936f.textContent = "Hiện đáp án thí sinh";
            }
            setTimeout(() => {
              _0x1c6e8c.set({
                'status': true
              });
            }, 0x3e8);
          });
        });
      });
      document.getElementById('ObstacleRowGrading').addEventListener("click", () => {
        _0x168b2c.once("value", _0x2ed4ff => {
          if (_0x2ed4ff.val().OpenAnswer === 0x0) {
            failToast("Đáp án thí sinh chưa được hiển thị");
          } else {
            for (let _0x4420f1 = 0x1; _0x4420f1 <= 0x4; _0x4420f1++) {
              const _0x131eb7 = document.getElementById("obstaclePlayer" + _0x4420f1 + "Checkbox");
              const _0x39c5d1 = _0x131eb7.checked;
              var _0x4cdeaf = realtimeDB.ref(_0x33145d + "/point/player" + _0x4420f1);
              if (_0x39c5d1) {
                _0x4cdeaf.once('value', _0x31f360 => {
                  var _0x410819 = _0x31f360.val().point || 0x0;
                  _0x4cdeaf.update({
                    'point': _0x410819 + 0xa
                  });
                });
              }
            }
            const _0x2d6a99 = [];
            for (let _0x55bb7b = 0x1; _0x55bb7b <= 0x4; _0x55bb7b++) {
              const _0xbbf009 = document.getElementById("obstaclePlayer" + _0x55bb7b + "Checkbox");
              if (_0xbbf009.checked) {
                _0x2d6a99.push(_0x55bb7b);
              }
            }
            _0x310d54.update({
              'correctAnswerIds': _0x2d6a99
            }).then(() => {
              _0x310d54.update({
                'status': true
              }).then(() => {
                _0x310d54.update({
                  'status': false
                });
              });
            });
            _0x585fe3.once('value', _0x541eb7 => {
              const _0x3ee20d = _0x541eb7.val().hn;
              const _0x29a400 = realtimeDB.ref(_0x33145d + "/VCNVRowStatus/HN" + _0x3ee20d);
              if (_0x2d6a99.length > 0x0) {
                _0x29a400.set({
                  'status': 0x1
                });
              } else {
                _0x29a400.set({
                  'status': 0x2
                });
              }
            });
            for (let _0x584a7f = 0x1; _0x584a7f <= 0x4; _0x584a7f++) {
              const _0x5d103c = document.getElementById("obstaclePlayer" + _0x584a7f + 'Checkbox');
              _0x5d103c.checked = false;
            }
            successToast("Đã chấm điểm cho câu hỏi hàng ngang");
          }
        });
      });
      document.getElementById("ObstacleTenseAudio").addEventListener("click", () => {
        _0x5070c9.once("value", _0x56aaa4 => {
          if (_0x56aaa4.val().TenseMoments === true) {
            _0x5070c9.update({
              'TenseMoments': false
            });
          } else {
            _0x5070c9.update({
              'TenseMoments': true
            });
          }
        });
      });
      document.getElementById("ObstacleWaitForAnswerAudio").addEventListener("click", () => {
        realtimeDB.ref(_0x33145d + "/VCNV15sCountdown").set({
          'countdown': 0x1
        }).then(() => {
          realtimeDB.ref(_0x33145d + "/VCNV15sCountdown").set({
            'countdown': 0x0
          });
          setTimeout(() => {
            realtimeDB.ref(_0x33145d + "/VCNV15sCountdown").set({
              'countdown': 0x0
            });
          }, 0x3e8);
        });
        successToast("Đã phát âm thanh đợi trả lời chướng ngại vật");
      });
      document.getElementById('ObstacleQuestionAudio').addEventListener('click', () => {
        realtimeDB.ref(_0x33145d + "/VCNVAudio").once("value", _0xb68b75 => {
          if (_0xb68b75.val().audio === 0x1) {
            realtimeDB.ref(_0x33145d + "/VCNVAudio").update({
              'audio': 0x0
            });
            successToast("Đã dừng âm thanh câu hỏi hàng ngang");
          } else {
            realtimeDB.ref(_0x33145d + "/VCNVAudio").update({
              'audio': 0x1
            });
            successToast("Đã phát âm thanh câu hỏi hàng ngang");
          }
        });
      });
      document.getElementById("ObstacleBuzzerReset").addEventListener("click", () => {
        _0x5e5664.remove();
        successToast("Đã đặt lại chuông");
      });
      document.getElementById('ObstacleOpenAll').addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn mở tất cả đáp án chướng ngại vật không?")) {
          _0x13e240.once("value", _0x5b83ac => {
            if (_0x5b83ac.val().correct === 0x0) {
              realtimeDB.ref(_0x33145d + "/VCNVRowStatus").set({
                'HN1': {
                  'status': 0x1
                },
                'HN2': {
                  'status': 0x1
                },
                'HN3': {
                  'status': 0x1
                },
                'HN4': {
                  'status': 0x1
                },
                'HN5': {
                  'status': 0x1
                }
              });
              realtimeDB.ref(_0x33145d + "/VCNVImageStatus").set({
                'HA1': {
                  'status': 0x1
                },
                'HA2': {
                  'status': 0x1
                },
                'HA3': {
                  'status': 0x1
                },
                'HA4': {
                  'status': 0x1
                },
                'HA5': {
                  'status': 0x1
                }
              });
              _0x13e240.set({
                'correct': 0x1
              });
              successToast("Đã mở tất cả đáp án");
            } else {
              _0x13e240.set({
                'correct': 0x0
              });
              successToast("Đã đóng tất cả đáp án");
            }
          });
        }
      });
    });
  });