auth.onAuthStateChanged(_0x240af7 => {
    if (!_0x240af7) {
      return;
    }
    const _0x2a1f78 = firestoreDB.collection("match").doc(_0x240af7.uid);
    _0x2a1f78.onSnapshot(_0x52caf4 => {
      if (!_0x52caf4.exists) {
        return;
      }
      const _0x1cd3b8 = _0x52caf4.data().match;
      const _0x23f2e7 = document.getElementById("FinishVideos");
      const _0x418862 = {
        'video1': 0x0,
        'video2': 0x0,
        'video3': 0x0,
        'video4': 0x0
      };
      var _0x67683f = realtimeDB.ref(_0x1cd3b8 + "/playerstatus/vedich");
      var _0x436ca4 = realtimeDB.ref(_0x1cd3b8 + "/VDCauso");
      var _0x34af8f = realtimeDB.ref(_0x1cd3b8 + "/FinishPoint/status");
      var _0x43aa3c = realtimeDB.ref(_0x1cd3b8 + '/phanthistatus/vedich');
      var _0x5ec0c6 = realtimeDB.ref(_0x1cd3b8 + "/VDChuong/ChuongStatus");
      var _0x5d46fa = realtimeDB.ref(_0x1cd3b8 + "/VDCorrectOrWrong/");
      var _0x3098b6 = realtimeDB.ref(_0x1cd3b8 + "/VDNSHV/status");
      var _0xeb16e2 = realtimeDB.ref(_0x1cd3b8 + "/FinishVideoState/VD");
      var _0x1ae0eb = realtimeDB.ref(_0x1cd3b8 + "/FinishCustomVideo");
      var _0x7809e5 = realtimeDB.ref(_0x1cd3b8 + '/Sounds');
      var _0x5c3479 = realtimeDB.ref(_0x1cd3b8 + "/FinishBuzzer/");
      for (let _0x5f2543 = 0x1; _0x5f2543 <= 0x4; _0x5f2543++) {
        document.getElementById('FinishQuestionPack' + _0x5f2543).addEventListener('click', () => {
          _0x67683f.once('value', _0x3eb26f => {
            if (_0x3eb26f.val().player != 0x0) {
              failToast("Kết thúc lượt hiện tại trước khi chọn lượt thí sinh mới");
              return;
            } else {
              _0x436ca4.set({
                'causo': 0x0
              });
              _0x67683f.set({
                'player': _0x5f2543
              });
              _0x34af8f.set({
                'status': 0x0
              });
              successToast("Đã chọn thí sinh " + _0x5f2543);
            }
          });
        });
      }
      document.getElementById('FinishQuestionPackSelectionConfirm').addEventListener("click", () => {
        _0x67683f.once("value", _0xc35a1e => {
          const _0x184320 = _0xc35a1e.val().player;
          if (_0x184320 === 0x0) {
            failToast("Chọn thí sinh trước khi xác nhận gói câu hỏi");
            return;
          }
          const _0x49c00a = {};
          let _0x572545 = true;
          for (let _0x59c8d7 = 0x1; _0x59c8d7 <= 0x3; _0x59c8d7++) {
            let _0x563614 = false;
            for (let _0x11180e of [0xa, 0x14, 0x1e]) {
              const _0x4f08ce = document.getElementById('q' + _0x59c8d7 + '-' + _0x11180e);
              if (_0x4f08ce && _0x4f08ce.checked) {
                _0x49c00a["FinishQuestionChoose/TS" + _0x184320 + '/' + _0x59c8d7] = {
                  ['cau' + _0x59c8d7]: _0x11180e
                };
                _0x563614 = true;
                break;
              }
            }
            if (!_0x563614) {
              _0x572545 = false;
              break;
            }
          }
          if (!_0x572545) {
            failToast("Vui lòng chọn đủ các câu hỏi trước khi xác nhận");
            return;
          } else {
            _0x34af8f.set({
              'status': 0x1
            });
            for (let _0x12e9c1 = 0x1; _0x12e9c1 <= 0x3; _0x12e9c1++) {
              for (let _0x5731b9 of [0xa, 0x14, 0x1e]) {
                const _0x464d2f = document.getElementById('q' + _0x12e9c1 + '-' + _0x5731b9);
                if (_0x464d2f) {
                  _0x464d2f.checked = false;
                }
              }
            }
          }
          realtimeDB.ref('' + _0x1cd3b8).update(_0x49c00a, _0x4219bd => {
            if (_0x4219bd) {
              failToast("Có lỗi xảy ra khi lưu gói câu hỏi");
            } else {
              successToast("Đã lưu gói câu hỏi thành công");
            }
          });
        });
      });
      document.getElementById('FinishEndTurn').addEventListener("click", () => {
        realtimeDB.ref(_0x1cd3b8 + '/VDPlayerTurnEnd/End').set({
          'end': 0x1
        }).then(() => {
          successToast("Đã kết thúc lượt");
          _0x34af8f.set({
            'status': 0x0
          });
          _0x436ca4.set({
            'causo': 0x0
          });
          setTimeout(() => {
            realtimeDB.ref(_0x1cd3b8 + "/VDPlayerTurnEnd/End").set({
              'end': 0x0
            });
          }, 0x3e8);
        });
        _0x67683f.set({
          'player': 0x0
        });
        _0x3098b6.set({
          'status': 0x0
        });
        _0x39a2bc();
      });
      document.getElementById("FinishSpaceSound").addEventListener('click', () => {
        playSound('SpacingMusic', _0x1cd3b8);
      });
      document.getElementById('FinishNextQuestion').addEventListener('click', () => {
        _0x295612(0x1);
      });
      document.getElementById('FinishPreviousQuestion').addEventListener('click', () => {
        _0x295612(-0x1);
      });
      function _0x295612(_0x48967e) {
        _0x67683f.once("value", _0x2bf9c3 => {
          const _0x5ab411 = _0x2bf9c3.val().player;
          if (_0x5ab411 === 0x0) {
            failToast("Chọn thí sinh trước khi thay đổi câu hỏi");
            return;
          }
          _0x436ca4.once('value', _0x1c1823 => {
            let _0x5ce25c = _0x1c1823.val().causo;
            let _0x1a8f24 = _0x5ce25c + _0x48967e;
            if (_0x1a8f24 < 0x0) {
              _0x1a8f24 = 0x0;
            }
            if (_0x1a8f24 > 0x3) {
              _0x1a8f24 = 0x3;
            }
            _0x436ca4.set({
              'causo': _0x1a8f24
            });
            successToast("Đã " + (_0x48967e > 0x0 ? 'mở' : "quay lại") + " câu hỏi số " + _0x1a8f24);
          });
        });
        _0xeb16e2.set({
          'video1': 0x0,
          'video2': 0x0,
          'video3': 0x0,
          'video4': 0x0
        });
        document.getElementById("FinishTimer").textContent = '';
        _0x39a2bc();
      }
      document.getElementById('FinishStart').addEventListener("click", () => {
        _0x43aa3c.set({
          'batdau': 0x1
        }).then(() => {
          successToast("Đã bắt đầu đếm ngược");
          setTimeout(() => {
            _0x43aa3c.set({
              'batdau': 0x0
            });
          }, 0x3e8);
        });
        _0xeb16e2.set({
          'video1': 0x0,
          'video2': 0x0,
          'video3': 0x0,
          'video4': 0x0
        });
      });
      document.getElementById("FinishCorrectAnswer").addEventListener("click", () => {
        _0x67683f.once("value").then(_0x151bb4 => {
          const _0x31bb91 = _0x151bb4.val().player;
          _0x436ca4.once("value").then(_0x2a3f3e => {
            const _0x5129d6 = _0x2a3f3e.val().causo;
            if (_0x31bb91 !== 0x0 && _0x5129d6 !== null) {
              const _0x3c0210 = realtimeDB.ref(_0x1cd3b8 + '/FinishQuestionChoose/TS' + _0x31bb91 + '/' + _0x5129d6 + "/cau" + _0x5129d6);
              _0x3c0210.once("value").then(_0x52eeda => {
                let _0x151021 = _0x52eeda.val();
                const _0x406506 = realtimeDB.ref(_0x1cd3b8 + "/point/player" + _0x31bb91);
                _0x3098b6.once("value").then(_0x14ec36 => {
                  const _0x134ee1 = _0x14ec36.val().status;
                  if (_0x134ee1 === 0x1) {
                    _0x151021 *= 0x2;
                  }
                  _0x406506.once('value').then(_0x37e622 => {
                    const _0x2f861c = _0x37e622.val().point || 0x0;
                    const _0x4a6a68 = _0x2f861c + _0x151021;
                    _0x406506.set({
                      'point': _0x4a6a68
                    }).then(() => {
                      successToast("Đã cập nhật điểm mới: " + _0x4a6a68);
                    })["catch"](_0x40a780 => {
                      console.error("Lỗi khi cập nhật điểm:", _0x40a780);
                    });
                  })['catch'](_0x43be6a => {
                    console.error("Lỗi khi lấy điểm của người chơi:", _0x43be6a);
                  });
                })["catch"](_0x187f08 => {
                  console.error("Lỗi khi lấy trạng thái nhân đôi:", _0x187f08);
                });
              })["catch"](_0x29ed79 => {
                console.error("Lỗi khi lấy điểm của câu hỏi:", _0x29ed79);
              });
            }
          })['catch'](_0x186405 => {
            console.error("Lỗi khi lấy câu hỏi hiện tại:", _0x186405);
          });
        })['catch'](_0xd1755c => {
          console.error("Lỗi khi lấy thông tin thí sinh hiện tại:", _0xd1755c);
        });
        realtimeDB.ref(_0x1cd3b8 + "/VDCorrectOrWrong/").set({
          'dungsai': 0x1
        }).then(() => {
          setTimeout(() => {
            realtimeDB.ref(_0x1cd3b8 + '/VDCorrectOrWrong/').set({
              'dungsai': 0x0
            });
          }, 0xbb8);
        });
        _0x7809e5.update({
          'TenseMoments': false
        });
        _0xeb16e2.set({
          'video1': 0x0,
          'video2': 0x0,
          'video3': 0x0,
          'video4': 0x0
        });
      });
      document.getElementById("FinishWrongAnswer").addEventListener("click", () => {
        _0x3098b6.once('value').then(_0x2e6c88 => {
          const _0xeb2429 = _0x2e6c88.val().status;
          if (_0xeb2429 === 0x1) {
            _0x67683f.once("value").then(_0x455655 => {
              const _0x32e3b2 = _0x455655.val().player;
              _0x436ca4.once("value").then(_0x51416f => {
                const _0x46405e = _0x51416f.val().causo;
                if (_0x32e3b2 !== 0x0 && _0x46405e !== null) {
                  const _0x39631c = realtimeDB.ref(_0x1cd3b8 + "/FinishQuestionChoose/TS" + _0x32e3b2 + '/' + _0x46405e + "/cau" + _0x46405e);
                  _0x39631c.once("value").then(_0x139187 => {
                    let _0x2af93d = _0x139187.val();
                    const _0x2f5da2 = realtimeDB.ref(_0x1cd3b8 + '/point/player' + _0x32e3b2);
                    _0x2f5da2.once("value").then(_0x2ead85 => {
                      const _0x347286 = _0x2ead85.val().point || 0x0;
                      const _0x322eba = Math.max(0x0, _0x347286 - _0x2af93d);
                      _0x2f5da2.set({
                        'point': _0x322eba
                      }).then(() => {
                        successToast("Điểm mới sau khi trừ: " + _0x322eba);
                      })["catch"](_0xe04efc => {
                        console.error("Lỗi khi cập nhật điểm:", _0xe04efc);
                      });
                    })["catch"](_0x10e845 => {
                      console.error("Lỗi khi lấy điểm của người chơi:", _0x10e845);
                    });
                  })["catch"](_0x33a2be => {
                    console.error("Lỗi khi lấy điểm của câu hỏi:", _0x33a2be);
                  });
                }
              })["catch"](_0x386d7c => {
                console.error("Lỗi khi lấy câu hỏi hiện tại:", _0x386d7c);
              });
            })['catch'](_0x43e4f7 => {
              console.error("Lỗi khi lấy thông tin thí sinh hiện tại:", _0x43e4f7);
            });
          } else {
            console.log("NSHV status is 0; no action taken.");
          }
        })["catch"](_0x241ba7 => {
          console.error("Lỗi khi lấy trạng thái NSHV:", _0x241ba7);
        });
        realtimeDB.ref(_0x1cd3b8 + "/VDCorrectOrWrong/").set({
          'dungsai': 0x2
        }).then(() => {
          setTimeout(() => {
            realtimeDB.ref(_0x1cd3b8 + '/VDCorrectOrWrong/').set({
              'dungsai': 0x0
            });
          }, 0xbb8);
        });
        _0x39a2bc();
        _0x5d46fa.set({
          'dungsai': 0x3
        }).then(() => {
          _0x5d46fa.set({
            'dungsai': 0x0
          });
        });
        _0x5ec0c6.set({
          'status': 0x0
        }).then(() => {
          setTimeout(() => {
            _0x5ec0c6.set({
              'status': 0x4
            });
          }, 0x1388);
        });
        _0xeb16e2.set({
          'video1': 0x0,
          'video2': 0x0,
          'video3': 0x0,
          'video4': 0x0
        });
        _0x7809e5.update({
          'TenseMoments': false
        });
        successToast("Đã ghi nhận trả lời sai. Đang đợi các thì sinh khác giành quyền trả lời");
      });
      function _0x39a2bc() {
        _0x5c3479.remove();
      }
      document.getElementById("FinishStar").addEventListener("click", () => {
        _0x3098b6.once("value").then(_0xa748f1 => {
          if (_0xa748f1.val().status === 0x0) {
            _0x3098b6.set({
              'status': 0x1
            });
            successToast("Đã bật ngôi sao hy vọng");
          } else {
            _0x3098b6.set({
              'status': 0x0
            });
            successToast("Đã tắt ngôi sao hy vọng");
          }
        });
      });
      document.getElementById("FinishTenseAudio").addEventListener("click", () => {
        _0x7809e5.once("value", _0x86d80d => {
          if (_0x86d80d.val().TenseMoments === true) {
            _0x7809e5.update({
              'TenseMoments': false
            });
          } else {
            _0x7809e5.update({
              'TenseMoments': true
            });
          }
        });
      });
      for (let _0x4f75b4 = 0x1; _0x4f75b4 <= 0x4; _0x4f75b4++) {
        const _0x2bfdab = document.getElementById('FinishVideo' + _0x4f75b4);
        console.log(_0x2bfdab);
        _0x2bfdab.addEventListener("click", () => {
          for (let _0x510b6f = 0x1; _0x510b6f <= 0x4; _0x510b6f++) {
            _0x418862["video" + _0x510b6f] = 0x0;
          }
          _0x418862["video" + _0x4f75b4] = 0x1;
          if (_0xeb16e2) {
            _0xeb16e2.update(_0x418862);
            _0xeb16e2.child("CustomVideo").remove();
            successToast("Đã bật Video " + _0x4f75b4);
          }
        });
      }
      _0x1ae0eb.on('child_added', _0x44f776 => {
        const _0xf348c2 = _0x44f776.key;
        const _0x5d5d24 = _0x44f776.val();
        const _0x814702 = document.createElement('li');
        _0x814702.setAttribute("role", "menuitem");
        _0x814702.setAttribute('id', 'FinishCustomVideo' + _0xf348c2);
        _0x814702.textContent = _0x5d5d24.name;
        _0x814702.className = "cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 dark:text-white hover:text-slate-800";
        _0x814702.addEventListener("click", () => {
          _0xeb16e2.child("CustomVideo").once('value').then(_0x7a7534 => {
            if (_0x7a7534.exists() && _0x7a7534.val() === _0x5d5d24.id) {
              _0xeb16e2.child("CustomVideo").remove();
            } else {
              _0xeb16e2.child("CustomVideo").set(_0x5d5d24.url);
              successToast("Đã bật video: " + _0x5d5d24.name);
            }
          });
        });
        _0x23f2e7.appendChild(_0x814702);
      });
      _0x1ae0eb.on("child_removed", _0x2dbda5 => {
        const _0x5ed9a2 = _0x2dbda5.key;
        const _0x4087f6 = document.getElementById("FinishCustomVideo" + _0x5ed9a2);
        if (_0x4087f6) {
          _0x4087f6.remove();
        }
      });
      _0x1ae0eb.on("child_changed", _0x293f33 => {
        const _0x485d85 = _0x293f33.key;
        const _0x4662d1 = _0x293f33.val();
        const _0x204149 = document.getElementById("FinishCustomVideo" + _0x485d85);
        if (_0x204149) {
          _0x204149.textContent = _0x4662d1.name;
        }
      });
      _0xeb16e2.child("CustomVideo").on("value", _0xff5eca => {
        const _0x1d5657 = _0x23f2e7.querySelectorAll("li[id^=\"FinishCustomVideo\"]");
        _0x1d5657.forEach(_0x6b38c3 => {
          _0x6b38c3.classList.remove("bg-slate-100");
        });
        if (_0xff5eca.exists()) {
          const _0x33b14b = _0xff5eca.val();
          _0x1ae0eb.once("value", _0x4a40d4 => {
            _0x4a40d4.forEach(_0x4a6113 => {
              if (_0x4a6113.val().id === _0x33b14b) {
                const _0x2287d = document.getElementById("FinishCustomVideo" + _0x4a6113.key);
                if (_0x2287d) {
                  _0x2287d.classList.add("bg-slate-100");
                }
              }
            });
          });
        }
      });
      document.getElementById("FinishTurnOffAllVideo").addEventListener("click", () => {
        _0xeb16e2.set({
          'video1': 0x0,
          'video2': 0x0,
          'video3': 0x0,
          'video4': 0x0
        });
        successToast("Đã tắt tất cả Video");
      });
    });
  });