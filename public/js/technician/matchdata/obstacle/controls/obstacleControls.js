auth.onAuthStateChanged(_0x72d3d => {
    if (!_0x72d3d) {
      return;
    }
    const _0x48441d = firestoreDB.collection("match").doc(_0x72d3d.uid);
    _0x48441d.onSnapshot(_0x17b397 => {
      if (!_0x17b397.exists) {
        return;
      }
      const _0x372261 = _0x17b397.data().match;
      var _0x2cba94 = realtimeDB.ref(_0x372261 + '/VCNV/hangngang');
      var _0xdd33e = realtimeDB.ref(_0x372261 + "/VCNVPlayed");
      var _0x1e5b26 = realtimeDB.ref(_0x372261 + "/VCNVOpenAnswer");
      var _0x5b78ff = realtimeDB.ref(_0x372261 + "/AlreadyOpenAnswer");
      var _0x3053f5 = realtimeDB.ref(_0x372261 + "/CompetitonAnswerCheckStatus/Obstacle");
      var _0x57d576 = realtimeDB.ref(_0x372261 + "/VCNVChuong/OpenAll");
      var _0x3e8429 = realtimeDB.ref(_0x372261 + "/ObstacleAnswers");
      var _0x4bbfe3 = realtimeDB.ref(_0x372261 + "/Sounds");
      var _0x40e904 = realtimeDB.ref(_0x372261 + "/ObstacleBuzzer");
      var _0x459f58 = realtimeDB.ref(_0x372261 + '/ObstacleCompetitionActive');
      for (let _0x1a9e9b = 0x1; _0x1a9e9b <= 0x5; _0x1a9e9b++) {
        const _0x19832b = document.getElementById("ObstacleQuestion" + _0x1a9e9b);
        _0x19832b.addEventListener("click", () => {
          _0x459f58.once('value', _0xabe61c => {
            if (!_0xabe61c.exists()) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            }
            ;
            if (_0xabe61c.val().status === false) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            } else {
              realtimeDB.ref(_0x372261 + '/AudioControl/obstacle').set({
                'isPlaying': false,
                'audioData': null,
                'questionNumber': 0x0,
                'timestamp': firebase.database.ServerValue.TIMESTAMP
              });
              _0x2cba94.set({
                'hn': _0x1a9e9b
              });
              _0xdd33e.once("value", _0xbcb638 => {
                const _0x14a1ca = _0xbcb638.val().hangngang;
                if (_0x14a1ca < 0x5) {
                  _0xdd33e.set({
                    'hangngang': _0x14a1ca + 0x1
                  });
                }
              });
              _0x1e5b26.set({
                'OpenAnswer': 0x0
              });
              _0x5b78ff.set({
                'status': false
              });
              _0x3e8429.remove();
              _0x3053f5.remove();
              document.getElementById("ObstacleStart").disabled = false;
            }
          });
        });
      }
      for (let _0x4d652c = 0x1; _0x4d652c <= 0x5; _0x4d652c++) {
        const _0x181af1 = document.getElementById("ObstacleUnlock" + _0x4d652c);
        _0x181af1.addEventListener("click", () => {
          _0x459f58.once('value', _0x5155b9 => {
            if (!_0x5155b9.exists()) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            }
            ;
            if (_0x5155b9.val().status === false) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            } else {
              if (confirm("Bạn có muốn mở đáp án hàng ngang số " + _0x4d652c + " không?")) {
                let _0x581e90;
                _0x581e90 = realtimeDB.ref(_0x372261 + "/VCNVRowStatus/HN" + _0x4d652c);
                _0x581e90.set({
                  'status': 0x1
                });
                _0xdd33e.once("value", _0x2412d5 => {
                  const _0x2eef6a = _0x2412d5.val().hangngang;
                  if (_0x2eef6a < 0x5) {
                    _0xdd33e.set({
                      'hangngang': _0x2eef6a + 0x1
                    });
                  }
                });
              }
            }
          });
        });
      }
      for (let _0x154866 = 0x1; _0x154866 <= 0x5; _0x154866++) {
        const _0x594120 = document.getElementById('ObstacleIncorrect' + _0x154866);
        _0x594120.addEventListener("click", () => {
          _0x459f58.once('value', _0x3fe986 => {
            if (!_0x3fe986.exists()) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            }
            ;
            if (_0x3fe986.val().status === false) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            } else {
              if (confirm("Bạn có muốn xác nhận trả lời sai hàng ngang số " + _0x154866 + " không?")) {
                let _0x220efb;
                _0x220efb = realtimeDB.ref(_0x372261 + "/VCNVRowStatus/HN" + _0x154866);
                _0x220efb.set({
                  'status': 0x2
                });
                _0xdd33e.once("value", _0x518cba => {
                  const _0x21ff01 = _0x518cba.val().hangngang;
                  if (_0x21ff01 < 0x5) {
                    _0xdd33e.set({
                      'hangngang': _0x21ff01 + 0x1
                    });
                  }
                });
              }
            }
          });
        });
      }
      for (let _0x2cd7d1 = 0x1; _0x2cd7d1 <= 0x5; _0x2cd7d1++) {
        const _0x7d4762 = document.getElementById("ObstacleImage" + _0x2cd7d1);
        _0x7d4762.addEventListener("click", () => {
          _0x459f58.once("value", _0x13e4b8 => {
            if (!_0x13e4b8.exists()) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            }
            ;
            if (_0x13e4b8.val().status === false) {
              failToast("Hàng ngang và hình ảnh Chướng ngại vật chưa được mở");
              return;
            } else {
              if (confirm("Bạn có muốn mở góc hình ảnh số " + _0x2cd7d1 + " không?")) {
                let _0x3d8e3a;
                _0x3d8e3a = realtimeDB.ref(_0x372261 + "/VCNVImageStatus/HA" + _0x2cd7d1);
                _0x3d8e3a.set({
                  'status': 0x1
                });
              }
            }
          });
        });
      }
      document.getElementById('ObstacleStart').addEventListener("click", () => {
        var _0x2db3c7 = realtimeDB.ref(_0x372261 + "/phanthistatus/vcnv");
        _0x2db3c7.set({
          'batdau': 0x1
        }).then(() => {
          successToast("Đang đếm thời gian trả lời từ khoá hàng ngang");
          setTimeout(() => {
            _0x2db3c7.set({
              'batdau': 0x0
            });
          }, 0x7d0);
        });
        document.getElementById('ObstacleStart').disabled = true;
      });
      document.getElementById("ObstacleDisplayAnswer").addEventListener("click", () => {
        _0x1e5b26.once('value', _0x457f85 => {
          const _0x3af2e1 = _0x457f85.val().OpenAnswer;
          const _0x997c55 = _0x3af2e1 === 0x0 ? 0x1 : 0x0;
          _0x1e5b26.set({
            'OpenAnswer': _0x997c55
          }).then(() => {
            const _0x3fd45d = document.getElementById("ObstacleDisplayAnswer");
            if (_0x997c55 === 0x1) {
              successToast("Đã mở đáp án thí sinh", 0xbb8, "top", "right", false, "linear-gradient(to right, #00b09b, #96c93d)", '');
              _0x3fd45d.textContent = "Đóng đáp án thí sinh";
            } else {
              successToast("Đã đóng đáp án thí sinh", 0xbb8, 'top', "right", false, "linear-gradient(to right, #00b09b, #96c93d)", '');
              _0x3fd45d.textContent = "Hiện đáp án thí sinh";
            }
            setTimeout(() => {
              _0x5b78ff.set({
                'status': true
              });
            }, 0x3e8);
          });
        });
      });
      document.getElementById("ObstacleRowGrading").addEventListener("click", () => {
        _0x1e5b26.once("value", _0x54d793 => {
          if (_0x54d793.val().OpenAnswer === 0x0) {
            failToast("Đáp án thí sinh chưa được hiển thị");
          } else {
            const _0x52cbae = getPlayerLimit();
            for (let _0x101184 = 0x1; _0x101184 <= _0x52cbae; _0x101184++) {
              const _0x522c1d = document.getElementById("obstaclePlayer" + _0x101184 + 'Checkbox');
              const _0x366b0a = _0x522c1d.checked;
              var _0x263cc3 = realtimeDB.ref(_0x372261 + '/point/player' + _0x101184);
              if (_0x366b0a) {
                _0x263cc3.once("value", _0x32cccf => {
                  var _0x5f552e = _0x32cccf.val().point || 0x0;
                  _0x263cc3.update({
                    'point': _0x5f552e + 0xa
                  });
                });
              }
            }
            const _0x25d14d = [];
            const _0x43896d = getPlayerLimit();
            for (let _0x33d205 = 0x1; _0x33d205 <= _0x43896d; _0x33d205++) {
              const _0x471129 = document.getElementById("obstaclePlayer" + _0x33d205 + 'Checkbox');
              if (_0x471129.checked) {
                _0x25d14d.push(_0x33d205);
              }
            }
            _0x3053f5.update({
              'correctAnswerIds': _0x25d14d
            }).then(() => {
              _0x3053f5.update({
                'status': true
              }).then(() => {
                _0x3053f5.update({
                  'status': false
                });
              });
            });
            _0x2cba94.once("value", _0x236267 => {
              const _0x40f4f1 = _0x236267.val().hn;
              const _0x7ae812 = realtimeDB.ref(_0x372261 + "/VCNVRowStatus/HN" + _0x40f4f1);
              if (_0x25d14d.length > 0x0) {
                _0x7ae812.set({
                  'status': 0x1
                });
              } else {
                _0x7ae812.set({
                  'status': 0x2
                });
              }
            });
            const _0x3ea1dd = getPlayerLimit();
            for (let _0x7bf951 = 0x1; _0x7bf951 <= _0x3ea1dd; _0x7bf951++) {
              const _0x2e6c7c = document.getElementById("obstaclePlayer" + _0x7bf951 + 'Checkbox');
              _0x2e6c7c.checked = false;
            }
            successToast("Đã chấm điểm cho câu hỏi hàng ngang");
          }
        });
      });
      document.getElementById("ObstacleTenseAudio").addEventListener("click", () => {
        _0x4bbfe3.once("value", _0x5bd67c => {
          if (_0x5bd67c.val().TenseMoments === true) {
            _0x4bbfe3.update({
              'TenseMoments': false
            });
          } else {
            _0x4bbfe3.update({
              'TenseMoments': true
            });
          }
        });
      });
      document.getElementById("ObstacleWaitForAnswerAudio").addEventListener("click", () => {
        realtimeDB.ref(_0x372261 + "/VCNV15sCountdown").set({
          'countdown': 0x1
        }).then(() => {
          realtimeDB.ref(_0x372261 + '/VCNV15sCountdown').set({
            'countdown': 0x0
          });
          setTimeout(() => {
            realtimeDB.ref(_0x372261 + '/VCNV15sCountdown').set({
              'countdown': 0x0
            });
          }, 0x3e8);
        });
        successToast("Đã phát âm thanh đợi trả lời chướng ngại vật");
      });
      document.getElementById("ObstacleBuzzerReset").addEventListener("click", () => {
        _0x40e904.remove();
        realtimeDB.ref(_0x372261 + '/AudioControl/obstacle').set({
          'isPlaying': false,
          'audioData': null,
          'questionNumber': 0x0,
          'timestamp': firebase.database.ServerValue.TIMESTAMP
        });
        successToast("Đã đặt lại chuông");
      });
      document.getElementById('ObstacleOpenAll').addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn mở tất cả đáp án chướng ngại vật không?")) {
          _0x57d576.once("value", _0x143d89 => {
            if (_0x143d89.val().correct === 0x0) {
              _0x57d576.set({
                'correct': 0x1
              });
              realtimeDB.ref(_0x372261 + '/VCNVRowStatus').set({
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
              realtimeDB.ref(_0x372261 + '/VCNVImageStatus').set({
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
              successToast("Đã mở tất cả đáp án");
            } else {
              _0x57d576.set({
                'correct': 0x0
              });
              successToast("Đã đóng tất cả đáp án");
            }
          });
        }
      });
      document.getElementById("ObstacleCompetitionActive").addEventListener("click", () => {
        _0x459f58.update({
          'status': true
        }).then(() => {
          successToast("Đã mở hàng ngang và hình ảnh Chướng ngại vật");
        });
      });
    });
  });