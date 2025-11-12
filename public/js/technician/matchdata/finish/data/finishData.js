auth.onAuthStateChanged(_0x1ba9bc => {
    if (!_0x1ba9bc) {
      return;
    }
    const _0x8b1ba2 = firestoreDB.collection("match").doc(_0x1ba9bc.uid);
    _0x8b1ba2.onSnapshot(_0x27f1cc => {
      if (!_0x27f1cc.exists) {
        return;
      }
      const _0xa18cb = _0x27f1cc.data().match;
      var _0x196728 = realtimeDB.ref(_0xa18cb + "/FinishPoint/status");
      var _0x28a530 = realtimeDB.ref(_0xa18cb + '/playerstatus/vedich');
      var _0x588fe4 = realtimeDB.ref(_0xa18cb + "/VDCauso");
      var _0x1ed3bf = realtimeDB.ref(_0xa18cb + '/VDNSHV/status');
      var _0x30269c = realtimeDB.ref(_0xa18cb + '/VDChuong/CorrectOrWrong');
      var _0xa476e2 = realtimeDB.ref(_0xa18cb + "/Sounds");
      var _0x505107 = realtimeDB.ref(_0xa18cb + "/FinishBuzzer");
      var _0x5717dd = realtimeDB.ref(_0xa18cb + "/VDCorrectOrWrong/");
      var _0x10918c = realtimeDB.ref(_0xa18cb + '/hostid');
      let _0x346615 = null;
      let _0xc70b15 = {};
      let _0x11459a = null;
      let _0x2d57ff = null;
      var _0x8dbce0 = realtimeDB.ref(_0xa18cb + "/games");
      _0x8dbce0.on("value", _0x371955 => {
        const _0x1a720b = _0x371955.val() || {};
        for (let _0x4f0751 = 0x1; _0x4f0751 <= 0x4; _0x4f0751++) {
          const _0x27b28d = _0x1a720b["player" + _0x4f0751];
          if (_0x27b28d) {
            const _0x3c9a0b = _0x27b28d.displayName;
            document.getElementById('FinishQuestionPack' + _0x4f0751).textContent = "Thí sinh " + _0x4f0751 + " | " + _0x3c9a0b;
          }
        }
      });
      _0x28a530.on("value", _0x49da62 => {
        const _0x19de54 = _0x49da62.val().player;
        if (_0x19de54 === 0x0) {
          document.getElementById("FinishTaskText").classList.remove("hidden");
          document.getElementById("FinishQuestionPackSelection").classList.add("hidden");
          for (let _0x5a7db3 = 0x1; _0x5a7db3 <= 0x4; _0x5a7db3++) {
            document.getElementById("FinishQuestionPack" + _0x5a7db3).classList.remove("bg-green-800", "text-white");
          }
          document.getElementById("FinishEndTurn").classList.add("hidden");
          document.getElementById('FinishQuestionPackSelectedAndStar').classList.add("hidden");
        } else {
          document.getElementById("FinishTaskText").classList.add("hidden");
          document.getElementById("FinishQuestionPackSelection").classList.remove("hidden");
          document.getElementById('FinishQuestionPack' + _0x19de54).classList.add("bg-green-800", "text-white");
          document.getElementById('FinishEndTurn').classList.remove("hidden");
        }
      });
      _0x196728.on("value", _0x161c6d => {
        const _0x16214a = _0x161c6d.val().status;
        if (_0x16214a === 0x1) {
          document.getElementById('FinishTaskText').classList.add('hidden');
          document.getElementById("FinishQuestionPackSelection").classList.add("hidden");
          document.getElementById("FinishEndTurn").classList.remove("hidden");
          document.getElementById("FinishQuestionPackSelectedAndStar").classList.remove("hidden");
        }
      });
      function _0x4ceed7() {
        if (_0x346615) {
          _0x588fe4.off("value", _0x346615);
        }
        Object.values(_0xc70b15).forEach(_0x3bd780 => {
          if (_0x3bd780.ref && _0x3bd780.handler) {
            _0x3bd780.ref.off("value", _0x3bd780.handler);
          }
        });
        if (_0x2d57ff) {
          _0x2d57ff.ref.off("value", _0x2d57ff.handler);
        }
        _0xc70b15 = {};
        if (_0x11459a) {
          clearInterval(_0x11459a);
          _0x11459a = null;
        }
      }
      function _0x461184(_0x56b7ed) {
        if (_0x11459a) {
          clearInterval(_0x11459a);
        }
        const _0x3f30ec = document.getElementById("FinishTimer");
        let _0x523bf4 = _0x56b7ed;
        _0x3f30ec.textContent = _0x523bf4;
        _0x11459a = setInterval(() => {
          _0x523bf4--;
          _0x3f30ec.textContent = _0x523bf4;
          if (_0x523bf4 <= 0x0) {
            clearInterval(_0x11459a);
            _0x3f30ec.textContent = '';
            _0x11459a = null;
          }
        }, 0x3e8);
      }
      function _0x470142(_0x57663f) {
        switch (_0x57663f) {
          case 0xa:
            return 0xa;
          case 0x14:
            return 0xf;
          case 0x1e:
            return 0x14;
          default:
            return 0x0;
        }
      }
      function _0xff66db(_0x279240, _0x396d5a) {
        const _0xe54b2f = realtimeDB.ref(_0xa18cb + "/FinishQuestionChoose/TS" + _0x279240 + '/' + _0x396d5a + '/cau' + _0x396d5a);
        if (_0xc70b15[_0x396d5a]) {
          _0xc70b15[_0x396d5a].ref.off("value", _0xc70b15[_0x396d5a].handler);
        }
        const _0x46a08c = _0x2b3e4e => {
          const _0x38144c = _0x2b3e4e.val();
          const _0x353818 = document.getElementById("FinishPack" + _0x396d5a);
          if (_0x353818) {
            _0x353818.textContent = _0x38144c || 0x0;
            _0x353818.classList.remove("bg-green-500", "text-white");
            _0x353818.classList.add("bg-slate-600", 'text-white', "dark:bg-white", "dark:text-neutral-700");
          }
        };
        _0xe54b2f.on("value", _0x46a08c);
        _0xc70b15[_0x396d5a] = {
          'ref': _0xe54b2f,
          'handler': _0x46a08c
        };
      }
      function _0x2839d0() {
        const _0x180016 = realtimeDB.ref(_0xa18cb + "/phanthistatus/vedich");
        if (_0x2d57ff) {
          _0x2d57ff.ref.off("value", _0x2d57ff.handler);
        }
        const _0x18a3ab = _0x3fed53 => {
          const _0x23cc7f = _0x3fed53.val();
          window.veDichBatDau = _0x23cc7f && _0x23cc7f.batdau === 0x1;
          if (window.veDichBatDau) {
            let _0x4eabac = null;
            for (let _0x35891a = 0x1; _0x35891a <= 0x3; _0x35891a++) {
              const _0x4d7af1 = document.getElementById('FinishPack' + _0x35891a);
              if (_0x4d7af1 && _0x4d7af1.classList.contains("bg-green-500")) {
                _0x4eabac = parseInt(_0x4d7af1.textContent, 0xa) || 0x0;
                break;
              }
            }
            if (_0x4eabac) {
              const _0x1d51a8 = _0x470142(_0x4eabac);
              if (_0x1d51a8 > 0x0) {
                _0x461184(_0x1d51a8);
              }
            }
          }
        };
        _0x180016.on("value", _0x18a3ab);
        _0x2d57ff = {
          'ref': _0x180016,
          'handler': _0x18a3ab
        };
      }
      _0x28a530.on("value", _0x422c14 => {
        const _0x51990d = _0x422c14.val().player;
        _0x4ceed7();
        if (_0x51990d !== 0x0) {
          _0x2839d0();
          for (let _0x11e1e4 = 0x1; _0x11e1e4 <= 0x3; _0x11e1e4++) {
            _0xff66db(_0x51990d, _0x11e1e4);
          }
          _0x346615 = _0x453ad2 => {
            const _0x3779d4 = _0x453ad2.val().causo;
            for (let _0x346861 = 0x1; _0x346861 <= 0x3; _0x346861++) {
              const _0x518d68 = document.getElementById("FinishPack" + _0x346861);
              if (_0x518d68) {
                _0x518d68.classList.remove("bg-green-500", "text-white");
                _0x518d68.classList.add("bg-slate-600", 'text-white', "dark:bg-white", "dark:text-neutral-700");
              }
            }
            if (_0x51990d !== 0x0 && _0x3779d4 !== null) {
              const _0x1dd1dd = document.getElementById("FinishPack" + _0x3779d4);
              if (_0x1dd1dd) {
                _0x1dd1dd.classList.remove("bg-slate-600", "dark:bg-white", "text-white", 'dark:text-neutral-700');
                _0x1dd1dd.classList.add("bg-green-500", "text-white");
                const _0x5e7da8 = _0x1dd1dd.textContent;
                questionPoint = parseInt(_0x5e7da8) || 0x0;
                const _0x125c6a = realtimeDB.ref(_0xa18cb + "/FinishQuestion/Q" + _0x51990d + "DB/QP" + _0x5e7da8 + '/' + _0x3779d4);
                _0x125c6a.once("value", _0x12188c => {
                  const _0x2a7fa0 = _0x12188c.val();
                  if (_0x2a7fa0) {
                    document.getElementById("FinishQuestion").textContent = _0x2a7fa0.cauhoi || "Gói câu hỏi này trống. Kiểm tra lại ở Quản lý câu hỏi. Nội dung này chỉ hiển thị ở trang điều khiển.";
                    document.getElementById("FinishAnswer").textContent = _0x2a7fa0.dapan || '';
                    if (window.veDichBatDau) {
                      const _0x23157e = parseInt(_0x5e7da8) || 0x0;
                      const _0x127555 = _0x470142(_0x23157e);
                      if (_0x127555 > 0x0) {
                        _0x461184(_0x127555);
                      }
                    }
                  } else {
                    document.getElementById("FinishQuestion").textContent = '';
                    document.getElementById("FinishAnswer").textContent = '';
                  }
                });
              }
            }
            if (_0x3779d4 === 0x0) {
              document.getElementById("FinishQuestion").textContent = '';
              document.getElementById("FinishAnswer").textContent = '';
              if (_0x11459a) {
                clearInterval(_0x11459a);
                _0x11459a = null;
                document.getElementById("FinishTimer").textContent = '';
              }
            }
          };
          _0x588fe4.on("value", _0x346615);
        }
      });
      _0x1ed3bf.on("value", _0xca0901 => {
        const _0x106012 = document.getElementById("FinishStar");
        if (_0xca0901.val().status === 0x1) {
          _0x106012.classList.remove("text-gray-300", "dark:text-gray-500");
          _0x106012.classList.add("text-yellow-300", "dark:text-yellow-500");
          _0x106012.classList.add("transition-transform", "duration-500", "transform", "scale-125", "rotate-45");
          setTimeout(() => {
            _0x106012.classList.remove("transform", "scale-125", 'rotate-45');
            _0x106012.classList.add("rotate-0");
          }, 0x1f4);
          document.getElementById("audio_FinishStarChoose").pause();
          document.getElementById('audio_FinishStarChoose').currentTime = 0x0;
          document.getElementById('audio_FinishStarChoose').play();
        } else {
          _0x106012.classList.remove("text-yellow-300", "dark:text-yellow-500");
          _0x106012.classList.add("text-gray-300", "dark:text-gray-500");
          _0x106012.classList.add('transition-transform', "duration-500", "transform", "scale-125", "rotate-45");
          setTimeout(() => {
            _0x106012.classList.remove("transform", "scale-125", "rotate-45");
            _0x106012.classList.add("rotate-0");
          }, 0x1f4);
        }
      });
      _0x505107.on("value", _0x2787ea => {
        for (let _0x53bf90 = 0x1; _0x53bf90 <= 0x4; _0x53bf90++) {
          const _0x2508f5 = document.getElementById("finishPlayer" + _0x53bf90);
          const _0x250135 = document.getElementById("finishPlayer" + _0x53bf90 + "Name");
          if (_0x2508f5) {
            _0x2508f5.classList.remove('bg-red-600', "rounded-md", "text-white");
          }
          if (_0x250135) {
            const _0x3f92b3 = _0x250135.querySelector(".grading-buttons");
            if (_0x3f92b3) {
              _0x250135.removeChild(_0x3f92b3);
            }
            const _0x4e76a5 = _0x250135.querySelector(".buzz-timestamp");
            if (_0x4e76a5) {
              _0x250135.removeChild(_0x4e76a5);
            }
          }
        }
        if (!_0x2787ea.exists()) {
          console.log("No buzzer entries yet");
          return;
        }
        let _0x3a75d1 = {
          'timestamp': Infinity,
          'id': null
        };
        const _0x5561bb = {};
        _0x2787ea.forEach(_0x4e9cac => {
          const _0x62c675 = _0x4e9cac.val();
          if (!_0x62c675 || !_0x62c675.id || _0x62c675.buzzerTimestamp === undefined) {
            return;
          }
          const _0x351526 = _0x62c675.id;
          const _0x4db857 = _0x62c675.buzzerTimestamp;
          if (!_0x5561bb[_0x351526] || _0x4db857 < _0x5561bb[_0x351526]) {
            _0x5561bb[_0x351526] = _0x4db857;
          }
          if (_0x5561bb[_0x351526] < _0x3a75d1.timestamp) {
            _0x3a75d1 = {
              'timestamp': _0x5561bb[_0x351526],
              'id': _0x351526
            };
          }
        });
        if (_0x3a75d1.id !== null) {
          const _0x6570ba = document.getElementById('audio_FinishAnswerGranted');
          if (_0x6570ba) {
            _0x6570ba.pause();
            _0x6570ba.currentTime = 0x0;
            _0x6570ba.play();
          }
          const _0x56bcb5 = document.getElementById("finishPlayer" + _0x3a75d1.id);
          const _0x33c199 = document.getElementById('finishPlayer' + _0x3a75d1.id + "Name");
          if (_0x56bcb5) {
            _0x56bcb5.classList.add("bg-red-600", "rounded-md", 'text-white');
          }
          if (_0x33c199) {
            const _0x58b8bf = document.createElement("div");
            _0x58b8bf.classList.add("grading-buttons", "flex", "gap-2");
            const _0x44aa7b = document.createElement('button');
            _0x44aa7b.classList.add("btn", 'btn-success', "rounded", "bg-green-500", "hover:bg-green-600", "text-white", "flex", 'items-center', 'justify-center', "p-2");
            _0x44aa7b.innerHTML = "\n                        <span class=\"material-symbols-outlined\">\n                            check\n                        </span>\n                    ";
            _0x44aa7b.onclick = () => _0x67dc65(_0x3a75d1.id);
            const _0x10fc39 = document.createElement("button");
            _0x10fc39.classList.add("btn", 'btn-danger', 'rounded', "bg-red-500", "hover:bg-red-600", "text-white", "flex", 'items-center', "justify-center", "p-2");
            _0x10fc39.innerHTML = "\n                        <span class=\"material-symbols-outlined\">\n                            close\n                        </span>\n                    ";
            _0x10fc39.onclick = () => _0x28faf3(_0x3a75d1.id);
            _0x58b8bf.appendChild(_0x44aa7b);
            _0x58b8bf.appendChild(_0x10fc39);
            _0x33c199.appendChild(_0x58b8bf);
            const _0x14ccdf = document.createElement('div');
            _0x14ccdf.classList.add("buzz-timestamp", 'text-white', "text-sm", 'mt-1');
            const _0x5519f5 = new Date(_0x3a75d1.timestamp);
            const _0x581cdb = _0x5519f5.getHours().toString().padStart(0x2, '0');
            const _0x1ac2b5 = _0x5519f5.getMinutes().toString().padStart(0x2, '0');
            const _0x77908c = _0x5519f5.getSeconds().toString().padStart(0x2, '0');
            const _0xb8bbff = _0x5519f5.getMilliseconds().toString().padStart(0x3, '0');
            _0x14ccdf.textContent = "Dấu thời gian: " + _0x581cdb + ':' + _0x1ac2b5 + ':' + _0x77908c + ':' + _0xb8bbff;
            _0x33c199.appendChild(_0x14ccdf);
          }
          const _0x15ffe3 = document.getElementById('FinishAnswerButton');
          if (_0x15ffe3) {
            _0x15ffe3.disabled = true;
          }
        }
      });
      function _0x2ccd78(_0x57655b, _0xccdb08) {
        const _0xb83e8e = realtimeDB.ref(_0xa18cb + "/point/player" + _0x57655b);
        console.log(_0x57655b, _0xccdb08);
        _0xb83e8e.once('value', _0x5aa65f => {
          const _0x15790c = _0x5aa65f.val()?.["point"] || 0x0;
          const _0x3ede3f = Math.max(_0x15790c + _0xccdb08, 0x0);
          _0xb83e8e.set({
            'point': _0x3ede3f
          });
        });
      }
      async function _0x67dc65(_0x449373) {
        const _0x3248e0 = await _0x10918c.once("value");
        if (auth.currentUser.uid !== _0x3248e0.val()) {
          failToast("Thao tác này chỉ dành cho người điều khiển.");
          return;
        }
        _0x28a530.once("value", _0x180e00 => {
          const _0x88437c = _0x180e00.val()?.["player"];
          if (!_0x88437c) {
            return;
          }
          _0x588fe4.once("value", _0x4b2501 => {
            const _0x26f97d = _0x4b2501.val()?.["causo"];
            if (!_0x26f97d) {
              return;
            }
            const _0x1e37b1 = realtimeDB.ref(_0xa18cb + '/FinishQuestionChoose/TS' + _0x88437c + '/' + _0x26f97d + "/cau" + _0x26f97d);
            _0x1e37b1.once("value", _0x287bfc => {
              const _0x151b89 = parseInt(_0x287bfc.val() || 0x0, 0xa);
              if (isNaN(_0x151b89)) {
                return;
              }
              _0x1ed3bf.once("value", _0x1fbc9b => {
                const _0x343e57 = _0x1fbc9b.val()?.["status"];
                if (_0x343e57 === 0x0) {
                  _0x2ccd78(_0x88437c, -_0x151b89);
                }
              });
              _0x2ccd78(_0x449373, _0x151b89);
            });
          });
        });
        _0x30269c.set({
          'correctorwrong': 0x1
        }).then(() => {
          _0x30269c.set({
            'correctorwrong': 0x0
          });
        });
        _0xa476e2.update({
          'TenseMoments': false
        });
        successToast("Đã cộng điểm thí sinh");
      }
      async function _0x28faf3(_0x4c4816) {
        const _0x261709 = await _0x10918c.once('value');
        if (auth.currentUser.uid !== _0x261709.val()) {
          failToast("Thao tác này chỉ dành cho người điều khiển.");
          return;
        }
        _0x28a530.once("value", _0x3f4e8c => {
          const _0x41a99a = _0x3f4e8c.val()?.['player'];
          if (!_0x41a99a) {
            return;
          }
          _0x588fe4.once("value", _0x279274 => {
            const _0x50a7cb = _0x279274.val()?.["causo"];
            if (!_0x50a7cb) {
              return;
            }
            const _0x15eb60 = realtimeDB.ref(_0xa18cb + "/FinishQuestionChoose/TS" + _0x41a99a + '/' + _0x50a7cb + "/cau" + _0x50a7cb);
            _0x15eb60.once("value", _0x44bb6b => {
              const _0x2a1034 = parseInt(_0x44bb6b.val() || 0x0, 0xa);
              if (isNaN(_0x2a1034)) {
                return;
              }
              _0x2ccd78(_0x4c4816, -_0x2a1034 / 0x2);
            });
          });
        });
        _0x30269c.set({
          'correctorwrong': 0x2
        }).then(() => {
          _0x30269c.set({
            'correctorwrong': 0x0
          });
        });
        _0xa476e2.update({
          'TenseMoments': false
        });
        successToast("Đã trừ điểm thí sinh");
      }
      _0x5717dd.on('value', _0x130435 => {
        const _0xd3ac3d = _0x130435.val().dungsai;
        if (_0xd3ac3d === 0x2) {
          _0x461184(0x5);
        }
      });
      realtimeDB.ref(_0xa18cb + "/Sounds").on('value', _0x4a623b => {
        const _0x97d0b6 = _0x4a623b.val().TenseMoments;
        const _0x32036c = document.getElementById("FinishTenseAudio");
        if (_0x97d0b6 === true) {
          _0x32036c.textContent = "Dừng âm thanh căng thẳng";
        } else {
          _0x32036c.textContent = "Phát âm thanh căng thẳng";
        }
      });
    });
  });