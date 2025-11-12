auth.onAuthStateChanged(_0x2a0cdd => {
    if (!_0x2a0cdd) {
      return;
    }
    const _0x3480a2 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x3480a2.onSnapshot(_0x514734 => {
      if (!_0x514734.exists) {
        return;
      }
      const _0x2baaa0 = _0x514734.data().match;
      var _0x44ce11 = realtimeDB.ref(_0x2baaa0 + "/playerstatus/vedich");
      var _0x39db6b = realtimeDB.ref(_0x2baaa0 + "/FinishPoint/status");
      var _0x31cbc7 = realtimeDB.ref(_0x2baaa0 + "/VDPlayerTurnEnd/End");
      var _0x155ce1 = realtimeDB.ref(_0x2baaa0 + "/VDCauso");
      var _0x1d1789 = realtimeDB.ref(_0x2baaa0 + "/phanthistatus/vedich");
      var _0x3ce4f5 = realtimeDB.ref(_0x2baaa0 + "/VDNSHV/status");
      var _0x1fba41 = realtimeDB.ref(_0x2baaa0 + "/VDCorrectOrWrong/");
      var _0x16429f = realtimeDB.ref(_0x2baaa0 + "/FinishBuzzer/");
      var _0x131d49 = realtimeDB.ref(_0x2baaa0 + '/VDChuong/CorrectOrWrong');
      let _0x47dc2e = null;
      let _0x300228 = null;
      let _0x2e13d0 = false;
      let _0x3d6c3b;
      let _0x376d86;
      let _0x52c232;
      let _0x14b4a8;
      _0x44ce11.on("value", _0x3b4bea => {
        const _0x54f0bc = _0x3b4bea.val().player;
        _0x47dc2e = _0x54f0bc;
        if (_0x54f0bc === 0x0) {
          document.getElementById("FinishQuestionPackSelectionContainer").classList.remove('hidden');
          document.getElementById("FinishQuestionContainer").classList.add("hidden");
          document.getElementById('FinishQuestionPackPlayerSelected').textContent = "Đang đợi người điều khiển chọn thí sinh về đích";
          document.getElementById("FinishQuestionPackLoader").classList.remove("hidden");
          document.getElementById('FinishQuestionPack').classList.add("hidden");
          _0x36028c();
        } else {
          document.getElementById('audio_FinishUserStart').currentTime = 0x0;
          document.getElementById('audio_FinishUserStart').play();
          var _0x172a41 = realtimeDB.ref(_0x2baaa0 + "/games/player" + _0x54f0bc);
          _0x172a41.once("value").then(_0x310253 => {
            const _0x3ea399 = _0x310253.val().displayName;
            document.getElementById("FinishQuestionPackPlayerSelected").textContent = _0x3ea399;
            document.getElementById("FinishPlayerName").textContent = _0x3ea399;
          });
          setTimeout(() => {
            document.getElementById('audio_FinishQuestionPackShow').currentTime = 0x0;
            document.getElementById("audio_FinishQuestionPackShow").play();
            document.getElementById('FinishQuestionPackLoader').classList.add("hidden");
            document.getElementById('FinishQuestionPack').classList.remove("hidden");
          }, 0x1194);
          _0x2c6d07(0xa, _0x49a556);
          function _0x49a556(_0x3e830f) {
            if (_0x3e830f) {
              document.getElementById('FinishQuestionPack10').classList.remove("hidden");
            }
          }
        }
      });
      _0x39db6b.on("value", _0x2aa165 => {
        const _0x47be75 = _0x2aa165.val().status;
        if (_0x47be75 === 0x1) {
          var _0x51196d = realtimeDB.ref(_0x2baaa0 + "/FinishQuestionChoose/TS" + _0x47dc2e);
          _0x51196d.once('value').then(_0x4fd15b => {
            const _0x397a49 = _0x4fd15b.val();
            Object.values(_0x397a49).forEach(_0xf7b0b2 => {
              if (_0xf7b0b2.cau1) {
                _0x1d97b4(_0xf7b0b2.cau1, 0x0);
                _0x376d86 = _0xf7b0b2.cau1;
              }
              if (_0xf7b0b2.cau2) {
                _0x1d97b4(_0xf7b0b2.cau2, 0x1);
                _0x52c232 = _0xf7b0b2.cau2;
              }
              if (_0xf7b0b2.cau3) {
                _0x1d97b4(_0xf7b0b2.cau3, 0x2);
                _0x14b4a8 = _0xf7b0b2.cau3;
              }
            });
            document.getElementById("FinishQuestionSelectedPackage").innerHTML = "<div class=\"FinishQuestionSelectedPackageText\"><span>" + _0x376d86 + "</span> · <span>" + _0x52c232 + "</span> · <span>" + _0x14b4a8 + "</span></div>";
          });
          document.getElementById("audio_FinishQuestionPackChoose").currentTime = 0x0;
          document.getElementById("audio_FinishQuestionPackChoose").play();
          setTimeout(() => {
            document.getElementById("FinishQuestionPackSelectionContainer").classList.add("hidden");
            document.getElementById("FinishQuestionContainer").classList.remove("hidden");
          }, 0xbb8);
        }
      });
      function _0x1d97b4(_0x2ddb59, _0x3bd488) {
        const _0x1ed460 = document.querySelector(".finish-question-pack-" + _0x2ddb59 + " > div:nth-child(" + (_0x3bd488 + 0x1) + ')');
        if (_0x1ed460) {
          _0x1ed460.classList.remove("bg-gray-300", "dark:bg-gray-800");
          _0x1ed460.classList.add("bg-gray-700", "dark:bg-gray-300");
        }
      }
      function _0x36028c() {
        for (let _0x2d51cb = 0xa; _0x2d51cb <= 0x1e; _0x2d51cb++) {
          for (let _0x17def3 = 0x1; _0x17def3 <= 0x3; _0x17def3++) {
            const _0x500ff2 = document.querySelector(".finish-question-pack-" + _0x2d51cb + " > div:nth-child(" + _0x17def3 + ')');
            if (_0x500ff2) {
              _0x500ff2.classList.remove("bg-gray-700", 'dark:bg-gray-300');
              _0x500ff2.classList.add("bg-gray-300", 'dark:bg-gray-800');
            }
          }
        }
      }
      _0x31cbc7.on('value', _0x532288 => {
        var _0x5bea7c = _0x532288.val().end;
        if (_0x5bea7c === 0x1) {
          document.getElementById("audio_FinishFinish").currentTime = 0x0;
          document.getElementById("audio_FinishFinish").play();
        }
      });
      const _0x55b858 = ["bg-gradient-to-r", "from-blue-400", "via-blue-500", "to-blue-600", "text-transparent", 'bg-clip-text'];
      _0x155ce1.on('value', _0x5e9af2 => {
        const _0x21254f = _0x5e9af2.val();
        const _0x375ac2 = document.getElementById("FinishQuestion");
        const _0x58f089 = document.getElementById('FinishQuestionTime');
        const _0x570150 = document.querySelectorAll("#FinishQuestionSelectedPackage .FinishQuestionSelectedPackageText span");
        document.getElementById("FinishAnswerButton").disabled = false;
        _0x570150.forEach(_0x4be378 => _0x4be378.classList.remove(..._0x55b858));
        if (!_0x21254f || !_0x21254f.causo || _0x47dc2e === 0x0) {
          _0x375ac2.textContent = '';
          _0x58f089.textContent = '';
          return;
        }
        const _0x425686 = _0x21254f.causo;
        let _0x2a9ec4 = null;
        let _0x2dc59b = null;
        if (_0x425686 === 0x1) {
          _0x2a9ec4 = _0x376d86;
          _0x300228 = _0x376d86;
          _0x2dc59b = _0x570150[0x0];
        } else {
          if (_0x425686 === 0x2) {
            _0x2a9ec4 = _0x52c232;
            _0x300228 = _0x52c232;
            _0x2dc59b = _0x570150[0x1];
          } else if (_0x425686 === 0x3) {
            _0x2a9ec4 = _0x14b4a8;
            _0x300228 = _0x14b4a8;
            _0x2dc59b = _0x570150[0x2];
          }
        }
        if (_0x2dc59b) {
          _0x2dc59b.classList.add(..._0x55b858);
        }
        if (_0x2a9ec4 === 0xa) {
          _0x58f089.textContent = "00:10";
        } else {
          if (_0x2a9ec4 === 0x14) {
            _0x58f089.textContent = "00:15";
          } else if (_0x2a9ec4 === 0x1e) {
            _0x58f089.textContent = "00:20";
          } else {
            _0x58f089.textContent = '';
          }
        }
        if (!_0x2a9ec4) {
          return;
        }
        const _0x121cb6 = realtimeDB.ref(_0x2baaa0 + "/FinishQuestion/Q" + _0x47dc2e + "DB/QP" + _0x2a9ec4 + '/' + _0x425686);
        _0x121cb6.once("value").then(_0x40c0da => {
          const _0x48b8de = _0x40c0da.val();
          _0x375ac2.textContent = _0x48b8de && _0x48b8de.cauhoi ? _0x48b8de.cauhoi : '';
        });
      });
      _0x1d1789.on("value", _0x1c1ab6 => {
        const _0x36a5dd = _0x1c1ab6.val().batdau;
        if (_0x36a5dd === 0x1) {
          let _0x55d3e7 = 0x0;
          if (_0x300228 === 0xa) {
            _0x55d3e7 = 0xa;
            document.getElementById("audio_Finish10Seconds").currentTime = 0x0;
            document.getElementById("audio_Finish10Seconds").play();
          } else {
            if (_0x300228 === 0x14) {
              _0x55d3e7 = 0xf;
              document.getElementById("audio_Finish15Seconds").currentTime = 0x0;
              document.getElementById("audio_Finish15Seconds").play();
            } else if (_0x300228 === 0x1e) {
              _0x55d3e7 = 0x14;
              document.getElementById('audio_Finish20Seconds').currentTime = 0x0;
              document.getElementById("audio_Finish20Seconds").play();
            }
          }
          const _0x5ba877 = document.getElementById('FinishQuestionTime');
          _0x5ba877.textContent = '00:' + _0x55d3e7.toString().padStart(0x2, '0');
          _0x3d6c3b = setInterval(() => {
            _0x55d3e7--;
            if (_0x55d3e7 < 0x0) {
              clearInterval(_0x3d6c3b);
            } else {
              _0x5ba877.textContent = '00:' + _0x55d3e7.toString().padStart(0x2, '0');
            }
          }, 0x3e8);
        }
      });
      _0x3ce4f5.on("value", _0x2a8082 => {
        if (_0x2a8082.val().status === 0x1) {
          document.getElementById("audio_FinishStarChose").currentTime = 0x0;
          document.getElementById('audio_FinishStarChose').play();
          document.getElementById("FinishStarStatus").textContent = "Đã kích hoạt";
        } else {
          document.getElementById("FinishStarStatus").textContent = "Chưa kích hoạt";
        }
      });
      _0x1fba41.on("value", _0x562676 => {
        const _0x30d14c = _0x562676.val().dungsai;
        if (_0x30d14c === 0x1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0x0;
          document.getElementById("audio_FinishRightAnswer").play();
        } else {
          if (_0x30d14c === 0x2) {
            _0x2e13d0 = true;
            document.getElementById("FinishAnswerButton").disabled = false;
            document.getElementById("audio_Finish5Seconds").currentTime = 0x0;
            document.getElementById("audio_Finish5Seconds").play();
            document.getElementById("FinishAnswerIcon").classList.remove('text-red-600');
            document.getElementById("FinishAnswerIcon").classList.add("text-green-600");
            _0x14fa44();
            let _0x1801f3 = 0x5;
            document.getElementById("FinishQuestionTime").textContent = "00:" + _0x1801f3.toString().padStart(0x2, '0');
            const _0x5d6cd7 = setInterval(() => {
              _0x1801f3--;
              document.getElementById("FinishQuestionTime").textContent = "00:" + _0x1801f3.toString().padStart(0x2, '0');
              if (_0x1801f3 === 0x0) {
                clearInterval(_0x5d6cd7);
              }
            }, 0x3e8);
            setTimeout(() => {
              _0x2e13d0 = false;
              document.getElementById("FinishAnswerIcon").classList.remove("text-green-600");
              document.getElementById("FinishAnswerIcon").classList.add('text-red-600');
              document.getElementById("FinishAnswerButton").disabled = true;
            }, 0x1388);
          }
        }
      });
      document.getElementById('FinishAnswerButton').addEventListener("click", () => {
        if (!_0x2e13d0) {
          return;
        }
        if (_0x47dc2e === parseInt(localStorage.getItem('id'), 0xa)) {
          return;
        }
        _0x16429f.push({
          'id': localStorage.getItem('id'),
          'uid': auth.currentUser.uid,
          'buzzerTimestamp': firebase.database.ServerValue.TIMESTAMP
        });
      });
      _0x16429f.on("value", _0x5878f1 => {
        const _0x1d378d = document.getElementById("FinishBuzzerList");
        _0x1d378d.innerHTML = '';
        if (!_0x5878f1.exists()) {
          console.log("No buzzer entries yet");
          return;
        }
        let _0x2a5131 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x5e39cf = {};
        _0x5878f1.forEach(_0x509a0c => {
          const _0x11dc76 = _0x509a0c.val();
          console.log("Buzzer press:", {
            'id': _0x11dc76.id,
            'timestamp': _0x11dc76.buzzerTimestamp
          });
          if (!_0x5e39cf[_0x11dc76.id] || _0x11dc76.buzzerTimestamp < _0x5e39cf[_0x11dc76.id]) {
            _0x5e39cf[_0x11dc76.id] = _0x11dc76.buzzerTimestamp;
          }
          if (_0x5e39cf[_0x11dc76.id] < _0x2a5131.timestamp) {
            _0x2a5131 = {
              'timestamp': _0x5e39cf[_0x11dc76.id],
              'id': _0x11dc76.id
            };
          }
        });
        console.log("Fastest buzzer:", _0x2a5131.id);
        console.log("Timestamp:", new Date(_0x2a5131.timestamp));
        if (_0x2a5131.id !== null) {
          const _0x3c3890 = realtimeDB.ref(_0x2baaa0 + "/games/player" + _0x2a5131.id);
          _0x3c3890.once("value").then(_0x307198 => {
            const _0x15c545 = _0x307198.val().displayName;
            const _0x42891b = new Date(_0x2a5131.timestamp);
            const _0x2ef321 = _0x42891b.getHours().toString().padStart(0x2, '0');
            const _0x2438ab = _0x42891b.getMinutes().toString().padStart(0x2, '0');
            const _0x148f94 = _0x42891b.getSeconds().toString().padStart(0x2, '0');
            const _0x17765d = _0x42891b.getMilliseconds().toString().padStart(0x3, '0');
            const _0x12f30e = _0x2ef321 + ':' + _0x2438ab + ':' + _0x148f94 + ':' + _0x17765d;
            const _0x36b72b = document.createElement('div');
            _0x36b72b.className = "w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center font-semibold py-4 rounded-xl dark:from-blue-700 dark:to-indigo-700";
            _0x36b72b.textContent = "Thí sinh " + _0x15c545 + " đã giành quyền trả lời lúc " + _0x12f30e;
            _0x1d378d.appendChild(_0x36b72b);
          });
          document.getElementById("FinishAnswerButton").disabled = true;
          document.getElementById("audio_FinishAnswerGranted").currentTime = 0x0;
          document.getElementById("audio_FinishAnswerGranted").play();
        }
      });
      function _0x14fa44() {
        clearInterval(_0x3d6c3b);
        document.getElementById("audio_Finish10Seconds").pause();
        document.getElementById('audio_Finish15Seconds').pause();
        document.getElementById('audio_Finish20Seconds').pause();
      }
      _0x131d49.on("value", _0x471adc => {
        const _0x38ffa0 = _0x471adc.val().correctorwrong;
        if (_0x38ffa0 === 0x1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0x0;
          document.getElementById("audio_FinishRightAnswer").play();
        } else if (_0x38ffa0 === 0x2) {
          document.getElementById("audio_FinishWrongAnswer").currentTime = 0x0;
          document.getElementById('audio_FinishWrongAnswer').play();
        }
      });
      function _0x2c6d07(_0xfe28ff, _0x3073c7) {
        var _0x115f8f = realtimeDB.ref(_0x2baaa0 + "/FinishQuestion/");
        var _0x14e901 = false;
        function _0x4c0b3e(_0xbb8cc4) {
          const _0x45b44f = _0xbb8cc4.val();
          if (_0x45b44f !== null && typeof _0x45b44f === 'object') {
            if (_0x45b44f.cauhoi.trim().length > 0x0 && _0x45b44f.dapan.trim().length > 0x0) {
              _0x14e901 = true;
              return true;
            }
          }
          return false;
        }
        for (var _0x3f617b = 0x1; _0x3f617b <= 0x4; _0x3f617b++) {
          for (var _0x596b1d = 0x1; _0x596b1d <= 0x3; _0x596b1d++) {
            var _0x177064 = 'Q' + _0x3f617b + 'DB' + "/QP" + _0xfe28ff + '/' + _0x596b1d;
            var _0x3cc27f = _0x115f8f.child(_0x177064);
            _0x3cc27f.once("value", _0x53f889 => {
              if (_0x4c0b3e(_0x53f889)) {
                _0x3073c7(_0x14e901);
                return;
              }
            })["catch"](_0x4cd7f1 => {
              console.error("Error fetching data:", _0x4cd7f1);
              _0x3073c7(false);
            });
            if (_0x14e901) {
              return;
            }
          }
        }
        _0x3073c7(false);
      }
    });
  });