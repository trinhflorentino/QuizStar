auth.onAuthStateChanged(_0x4b5570 => {
    if (!_0x4b5570) {
      return;
    }
    const _0x378e9a = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x378e9a.onSnapshot(_0x56c8ff => {
      if (!_0x56c8ff.exists) {
        return;
      }
      const _0x829296 = _0x56c8ff.data().match;
      var _0xdb8fda = realtimeDB.ref(_0x829296 + "/VCNVQuestion");
      var _0x2b366e = realtimeDB.ref(_0x829296 + "/VCNV/hangngang");
      var _0x236948 = realtimeDB.ref(_0x829296 + "/phanthistatus/vcnv");
      var _0x56d275 = realtimeDB.ref(_0x829296 + '/gamestatus/vcnv');
      var _0x3c0c1c = realtimeDB.ref(_0x829296 + "/VCNVOpenAnswer");
      var _0x354e66 = realtimeDB.ref(_0x829296 + "/ObstacleAnswers");
      var _0x58b2d4 = realtimeDB.ref(_0x829296 + "/VCNVRowStatus");
      var _0x1298b9 = realtimeDB.ref(_0x829296 + "/CompetitonAnswerCheckStatus/Obstacle");
      var _0x56b0c1 = realtimeDB.ref(_0x829296 + '/ObstacleBuzzer');
      var _0xe8303d = realtimeDB.ref(_0x829296 + '/VCNVImageStatus');
      var _0x11bdbf = realtimeDB.ref(_0x829296 + '/VCNVChuong/OpenAll');
      var _0x54cab5 = realtimeDB.ref(_0x829296 + "/ObstacleDisabledId");
      var _0x432d64 = realtimeDB.ref(_0x829296 + "/VCNVAudio");
      var _0x46c8b3 = realtimeDB.ref(_0x829296 + "/VCNV15sCountdown");
      var _0x52eaae = realtimeDB.ref(_0x829296 + "/AlreadyOpenAnswer");
      var _0x4be2c7 = realtimeDB.ref(_0x829296 + '/ObstacleCompetitionActive');
      var _0x2b260a = realtimeDB.ref(_0x829296 + "/Sounds");
      var _0x10e9b5 = realtimeDB.ref(_0x829296 + "/QuestionMedia");
      var _0x5d8a1f = realtimeDB.ref(_0x829296 + "/AudioControl/obstacle");
      let _0x4d01b1 = null;
      _0xdb8fda.on("value", _0x32a739 => {
        _0x4d01b1 = _0x32a739.val();
        const _0x2de046 = _0x32a739.val().CNV.cnv;
        let _0x541409 = _0x2de046.replace(/\s/g, '');
        let _0x4952ab;
        if (/^[\p{L}]+$/u.test(_0x541409)) {
          _0x4952ab = " CHỮ CÁI";
        } else {
          if (/^\d+$/.test(_0x541409)) {
            _0x4952ab = " CHỮ SỐ";
          } else if (/^[\p{L}\d]+$/u.test(_0x541409)) {
            _0x4952ab = " KÝ TỰ";
          } else {
            _0x4952ab = " KÝ TỰ";
          }
        }
        _0x11bdbf.on('value', _0x3909c3 => {
          if (_0x3909c3.val().correct === 0x1) {
            document.getElementById("ObstacleCharacterCount").textContent = "CHƯỚNG NGẠI VẬT:  " + _0x2de046.toUpperCase();
            document.getElementById("audio_ObstacleRight").currentTime = 0x0;
            document.getElementById('audio_ObstacleRight').play();
          } else if (_0x3909c3.val().correct === 0x2) {
            document.getElementById("audio_ObstacleRowWrongAnswer").currentTime = 0x0;
            document.getElementById("audio_ObstacleRowWrongAnswer").play();
          } else {
            document.getElementById("ObstacleCharacterCount").textContent = "CHƯỚNG NGẠI VẬT CÓ " + (_0x2de046.replace(/\s/g, '').length + _0x4952ab);
          }
        });
        const _0x10e50f = document.getElementById("obstacleContainer");
        const _0x4ecf6e = _0x5e08ab => {
          _0x10e50f.innerHTML = '';
          const _0x57a6d3 = document.createElement("div");
          _0x57a6d3.className = "flex flex-col space-y-4 mt-4";
          for (let _0x3d9bbc = 0x1; _0x3d9bbc <= 0x4; _0x3d9bbc++) {
            const _0x2eb18c = 'HN' + _0x3d9bbc;
            const _0xd84470 = _0x4d01b1[_0x2eb18c]?.['dapan']?.["replace"](/\s/g, '');
            const _0x2fcac6 = _0x5e08ab[_0x2eb18c]?.["status"];
            if (!_0xd84470) {
              console.warn("Answer for " + _0x2eb18c + " is missing or invalid");
              continue;
            }
            const _0x54ec24 = document.createElement("div");
            _0x54ec24.className = "flex justify-between items-start";
            const _0x1445ef = document.createElement("div");
            _0x1445ef.className = "flex flex-wrap space-x-0.5 gap-0.5 obstacle-row-" + _0x3d9bbc;
            _0x1445ef.style.maxWidth = "calc(13 * 3.5rem)";
            for (let _0x347323 of _0xd84470) {
              const _0xb5c9cb = document.createElement('div');
              if (_0x2fcac6 === 0x1) {
                _0xb5c9cb.className = "w-14 h-14 bg-green-700 border-4 border-white rounded-full flex items-center justify-center shadow-lg";
              } else if (_0x2fcac6 === 0x2) {
                _0xb5c9cb.className = "w-14 h-14 bg-red-700 border-4 border-white rounded-full flex items-center justify-center shadow-lg";
              } else {
                _0xb5c9cb.className = "w-14 h-14 bg-gray-300 border-4 border-white rounded-full flex items-center justify-center shadow-lg";
              }
              const _0x4e9374 = document.createElement("span");
              _0x4e9374.className = "text-2xl font-bold text-white";
              _0x4e9374.textContent = _0x2fcac6 === 0x1 ? _0x347323 : '';
              _0xb5c9cb.appendChild(_0x4e9374);
              _0x1445ef.appendChild(_0xb5c9cb);
            }
            const _0xe8b643 = document.createElement("div");
            _0xe8b643.className = "w-14 flex justify-center ml-2";
            const _0x32ea96 = document.createElement("div");
            _0x32ea96.className = "w-14 h-14 bg-white dark:bg-neutral-700 border-2 border-gray-200 dark:border-white rounded-full flex items-center justify-center shadow-lg";
            const _0x5f1467 = document.createElement("span");
            _0x5f1467.className = "text-2xl font-bold text-black dark:text-white";
            _0x5f1467.textContent = _0x3d9bbc;
            _0x32ea96.appendChild(_0x5f1467);
            _0xe8b643.appendChild(_0x32ea96);
            _0x54ec24.appendChild(_0x1445ef);
            _0x54ec24.appendChild(_0xe8b643);
            _0x57a6d3.appendChild(_0x54ec24);
          }
          _0x10e50f.appendChild(_0x57a6d3);
        };
        _0x58b2d4.on("value", _0x21cb8b => {
          const _0x12c1bd = _0x21cb8b.val();
          _0x4ecf6e(_0x12c1bd);
        });
      });
      _0x2b366e.on("value", async _0x54879d => {
        const _0x58a5cf = _0x54879d.val().hn;
        const _0x42d07c = document.getElementById("ObstacleQuestion");
        const _0x4337f1 = document.getElementById('ObstacleQuestionTitle');
        const _0x468f81 = document.querySelector('.obstacle-row-' + _0x58a5cf);
        window.stopCurrentQuestionAudio();
        if (_0x58a5cf === 0x0) {
          document.querySelectorAll(".obstacle-row-1, .obstacle-row-2, .obstacle-row-3, .obstacle-row-4").forEach(_0x3447d9 => {
            _0x3447d9.querySelectorAll("div").forEach(_0x108c9e => {
              _0x108c9e.classList.remove('bg-blue-300', 'dark:bg-blue-500');
              _0x108c9e.classList.add("bg-gray-300");
            });
          });
          window.stopCurrentQuestionAudio();
        }
        try {
          console.log("Loading question media for HN" + _0x58a5cf);
          const _0x31abf9 = await getQuestionMedia("VCNVQuestion", 'HN' + _0x58a5cf, 0x1);
          await displayQuestionImage(_0x31abf9.image, document.getElementById("ObstacleQuestionImage"), document.getElementById('ObstacleMediaContainer'));
        } catch (_0x5584f4) {
          console.error("Error loading question media:", _0x5584f4);
        }
        if (_0x468f81) {
          _0x468f81.querySelectorAll("div").forEach(_0x2a48b6 => {
            _0x2a48b6.classList.remove("bg-gray-300");
            _0x2a48b6.classList.add("bg-blue-300", "dark:bg-blue-500");
          });
        }
        document.getElementById("ObstacleAnswerTime").textContent = "00:15";
        if (!_0x42d07c) {
          console.warn("ObstacleQuestion container not found.");
          return;
        }
        let _0x381256 = '';
        let _0x57b720 = '';
        switch (_0x58a5cf) {
          case 0x1:
          case 0x2:
          case 0x3:
          case 0x4:
            _0x381256 = _0x4d01b1['HN' + _0x58a5cf]?.["cauhoi"] || "Câu hỏi HN" + _0x58a5cf + " không có dữ liệu";
            _0x57b720 = _0x1a8255(_0x4d01b1['HN' + _0x58a5cf]?.["dapan"], _0x58a5cf);
            break;
          case 0x5:
            _0x381256 = _0x4d01b1.HNTT?.["cauhoi"] || "Câu hỏi HNTT không có dữ liệu";
            _0x57b720 = _0x1a8255(_0x4d01b1.HNTT?.['dapan'], "trung tâm");
            break;
          default:
            _0x57b720 = "Câu hỏi";
            break;
        }
        _0x2b260a.on("value", _0x1b0821 => {
          const _0x1ce15f = _0x1b0821.val();
          if (_0x1ce15f?.["EnglishVoice"] && _0x381256) {
            _0x56d275.once('value', _0x454f86 => {
              if (_0x454f86.val().vcnv === 0x1) {
                speakText(_0x381256);
              }
            });
          }
        });
        function _0x1a8255(_0x31d13d, _0xde1710) {
          if (!_0x31d13d) {
            return "Câu hỏi hàng ngang " + _0xde1710 + " không có dữ liệu";
          }
          let _0xa2c3c7 = _0x31d13d.replace(/\s/g, '');
          let _0xf31736;
          if (/^[\p{L}]+$/u.test(_0xa2c3c7)) {
            _0xf31736 = " chữ cái";
          } else {
            if (/^\d+$/.test(_0xa2c3c7)) {
              _0xf31736 = " chữ số";
            } else if (/^[\p{L}\d]+$/u.test(_0xa2c3c7)) {
              _0xf31736 = " ký tự";
            } else {
              _0xf31736 = " ký tự";
            }
          }
          return "Câu hỏi hàng ngang " + _0xde1710 + " (" + _0xa2c3c7.length + _0xf31736 + ')';
        }
        if (_0x58a5cf !== 0x0) {
          const _0x56f31a = document.getElementById('audio_ObstacleRowChoose');
          if (_0x56f31a) {
            _0x56f31a.currentTime = 0x0;
            _0x56f31a.play();
          } else {
            console.warn("Audio element with id 'audio_ObstacleRowChoose' not found.");
          }
        }
        _0x42d07c.textContent = _0x381256;
        _0x4337f1.textContent = _0x57b720;
      });
      let _0x4c864f = [];
      _0x54cab5.on('value', _0x2e4c0e => {
        _0x4c864f = [];
        _0x2e4c0e.forEach(_0x635a92 => {
          _0x4c864f.push(parseInt(_0x635a92.val(), 0xa));
        });
      });
      document.getElementById("ObstacleAnswerInput").addEventListener("keypress", _0x40fd0b => {
        if (_0x40fd0b.key === 'Enter') {
          const _0x2d9534 = parseInt(localStorage.getItem('id'), 0xa);
          if (_0x4c864f.includes(_0x2d9534)) {
            console.log("Player is disabled");
            return;
          }
          _0x354e66.push({
            'id': localStorage.getItem('id'),
            'answer': _0x40fd0b.target.value,
            'timestamp': firebase.database.ServerValue.TIMESTAMP
          });
          _0x40fd0b.target.value = '';
        }
      });
      let _0x1dabe8 = null;
      _0x236948.on("value", _0x540b2c => {
        const _0x260844 = _0x540b2c.val().batdau;
        if (_0x260844 === 0x1) {
          if (_0x1dabe8) {
            clearInterval(_0x1dabe8);
            _0x1dabe8 = null;
          }
          document.getElementById('audio_ObstacleRowThinking').currentTime = 0x0;
          document.getElementById("audio_ObstacleRowThinking").play();
          document.getElementById("ObstacleAnswerInput").disabled = false;
          document.getElementById("ObstacleAnswerInput").focus();
          document.getElementById("ObstacleAnswerInput").scrollIntoView();
          let _0x3a5f48 = 0xf;
          document.getElementById("ObstacleAnswerTime").textContent = "00:" + (_0x3a5f48 < 0xa ? '0' : '') + _0x3a5f48;
          document.getElementById("ObstacleAnswerCircleStatus").classList.remove('text-red-500');
          document.getElementById('ObstacleAnswerCircleStatus').classList.add("text-green-500");
          _0x1dabe8 = setInterval(() => {
            _0x3a5f48 -= 0x1;
            if (_0x3a5f48 <= 0x0) {
              clearInterval(_0x1dabe8);
              _0x1dabe8 = null;
              document.getElementById("ObstacleAnswerInput").disabled = true;
              document.getElementById("ObstacleAnswerInput").value = '';
              document.getElementById("ObstacleAnswerCircleStatus").classList.remove("text-green-500");
              document.getElementById("ObstacleAnswerCircleStatus").classList.add("text-red-500");
              document.getElementById("ObstacleAnswerTime").textContent = "00:00";
            } else {
              document.getElementById("ObstacleAnswerTime").textContent = "00:" + (_0x3a5f48 < 0xa ? '0' : '') + _0x3a5f48;
            }
          }, 0x3e8);
        }
      });
      _0x3c0c1c.on('value', _0x3f5952 => {
        const _0xdd52fd = _0x3f5952.val().OpenAnswer;
        const _0x5f4624 = document.getElementById('ObstacleAnswerLockStatusIcon');
        const _0x3736e5 = document.querySelector("[aria-controls=\"obstacle-contestant-answer\"]").parentElement;
        const _0x4a2710 = _0x3736e5.querySelector('[data-tab-target]');
        const _0x115896 = document.querySelector("[aria-controls=\"obstacle-answer-question\"]");
        const _0x53fec5 = document.getElementById('obstacle-contestant-answer');
        const _0x2e9881 = document.getElementById("obstacle-answer-question");
        if (_0xdd52fd === 0x1) {
          _0x52eaae.once("value", _0x598b90 => {
            if (_0x598b90.val().status === true) {
              return;
            }
            document.getElementById("audio_ObstacleAnswers").currentTime = 0x0;
            document.getElementById("audio_ObstacleAnswers").play();
          });
          _0x5f4624.textContent = 'lock_open';
          _0x3736e5.classList.remove("pointer-events-none", "opacity-50");
          _0x4a2710.classList.remove('cursor-not-allowed');
          _0x4a2710.classList.add("cursor-pointer");
          _0x53fec5.classList.remove("hidden", "opacity-0");
          _0x53fec5.classList.add("block", "opacity-100");
          _0x2e9881.classList.remove("block", "opacity-100");
          _0x2e9881.classList.add('hidden', "opacity-0");
          setTimeout(() => {
            _0x4a2710.click();
            _0x163aab(_0x3736e5);
          }, 0x64);
        } else {
          _0x5f4624.textContent = "lock";
          _0x3736e5.classList.add('pointer-events-none', "opacity-50");
          _0x4a2710.classList.remove("cursor-pointer");
          _0x4a2710.classList.add("cursor-not-allowed");
          _0x2e9881.classList.remove("hidden", "opacity-0");
          _0x2e9881.classList.add("block", "opacity-100");
          _0x53fec5.classList.remove("block", "opacity-100");
          _0x53fec5.classList.add("hidden", "opacity-0");
          setTimeout(() => {
            _0x115896.click();
            _0x163aab(_0x115896.parentElement);
          }, 0x64);
        }
      });
      function _0x163aab(_0x453ebc) {
        const _0x11d6f4 = _0x453ebc.closest('ul');
        if (!_0x11d6f4) {
          return;
        }
        const _0x4109a8 = document.querySelectorAll("[moving-tab]");
        const _0x137d45 = Array.from(_0x11d6f4.children);
        const _0x282b2f = _0x137d45.indexOf(_0x453ebc) + 0x1;
        let _0x4e557d = 0x0;
        if (_0x11d6f4.classList.contains('flex-col')) {
          for (let _0x361d95 = 0x1; _0x361d95 <= _0x137d45.indexOf(_0x453ebc); _0x361d95++) {
            _0x4e557d += _0x11d6f4.querySelector('li:nth-child(' + _0x361d95 + ')').offsetHeight;
          }
          _0x4109a8.forEach(_0x475309 => {
            _0x475309.style.transform = "translate3d(0px, " + _0x4e557d + "px, 0px)";
            _0x475309.style.height = _0x11d6f4.querySelector("li:nth-child(" + _0x282b2f + ')').offsetHeight + 'px';
          });
        } else {
          for (let _0x1ef6d6 = 0x1; _0x1ef6d6 <= _0x137d45.indexOf(_0x453ebc); _0x1ef6d6++) {
            _0x4e557d += _0x11d6f4.querySelector("li:nth-child(" + _0x1ef6d6 + ')').offsetWidth;
          }
          _0x4109a8.forEach(_0xa6c206 => {
            _0xa6c206.style.transform = "translate3d(" + _0x4e557d + "px, 0px, 0px)";
            _0xa6c206.style.width = _0x11d6f4.querySelector("li:nth-child(" + _0x282b2f + ')').offsetWidth + 'px';
          });
        }
      }
      _0x354e66.orderByChild('timestamp').limitToLast(0x1).on("value", _0x461207 => {
        if (!_0x461207.exists()) {
          document.getElementById("ObstacleAnswerOutput").textContent = "Câu trả lời của bạn:  ";
          return;
        }
        _0x461207.forEach(_0x56e97b => {
          const _0x53f009 = _0x56e97b.val();
          if (_0x53f009.id === localStorage.getItem('id')) {
            document.getElementById("ObstacleAnswerOutput").textContent = "Câu trả lời của bạn: " + _0x53f009.answer.toUpperCase();
          }
          if (_0x53f009 === null) {
            console.log("True");
            document.getElementById("ObstacleAnswerOutput").textContent = "Câu trả lời của bạn:  ";
          }
        });
      });
      _0x354e66.orderByChild("timestamp").on("value", _0xe7a05b => {
        const _0x3b7d7d = {};
        _0xe7a05b.forEach(_0x13a537 => {
          const _0x19e33 = _0x13a537.val();
          const _0x52ddcd = _0x19e33.id;
          if (!_0x3b7d7d[_0x52ddcd] || _0x3b7d7d[_0x52ddcd].timestamp < _0x19e33.timestamp) {
            _0x3b7d7d[_0x52ddcd] = _0x19e33;
          }
        });
        const _0x598b10 = getPlayerLimit();
        for (let _0x420eb8 = 0x1; _0x420eb8 <= _0x598b10; _0x420eb8++) {
          const _0x280db9 = document.getElementById("ObstacleAnswerPlayer" + _0x420eb8);
          if (_0x280db9) {
            const _0x55910a = _0x3b7d7d[_0x420eb8] ? _0x3b7d7d[_0x420eb8].answer : '';
            _0x280db9.textContent = '' + _0x55910a.toUpperCase();
          }
        }
      });
      _0x1298b9.on("value", _0x224dde => {
        if (!_0x224dde.exists()) {
          return;
        }
        if (_0x224dde.val().status === true) {
          const _0x5bce10 = _0x224dde.val().correctAnswerIds;
          if (_0x5bce10 && _0x5bce10.length > 0x0) {
            document.getElementById('audio_ObstacleRightAnswer').currentTime = 0x0;
            document.getElementById("audio_ObstacleRightAnswer").play();
          } else {
            document.getElementById('audio_ObstacleRowWrongAnswer').currentTime = 0x0;
            document.getElementById('audio_ObstacleRowWrongAnswer').play();
          }
        }
      });
      document.getElementById('ObstacleBuzzerButton').addEventListener('click', () => {
        _0x11bdbf.once("value", _0x61d7ef => {
          if (_0x61d7ef.val().correct === 0x1) {
            return;
          }
          const _0x1cba8c = parseInt(localStorage.getItem('id'), 0xa);
          if (_0x4c864f.includes(_0x1cba8c)) {
            console.log("Player is disabled");
            return;
          }
          _0x56b0c1.push({
            'id': localStorage.getItem('id'),
            'timestamp': firebase.database.ServerValue.TIMESTAMP
          });
        });
      });
      _0x56b0c1.orderByChild('id').equalTo(localStorage.getItem('id')).on('value', _0x485df3 => {
        const _0x5b9077 = document.getElementById("ObstacleBuzzerButton");
        if (_0x485df3.exists()) {
          _0x5b9077.disabled = true;
        } else {
          _0x5b9077.disabled = false;
        }
      });
      _0x56b0c1.orderByChild("timestamp").on("value", _0x4d4332 => {
        const _0x4713e8 = document.getElementById('ObstacleBuzzerList');
        _0x4713e8.innerHTML = '';
        _0x4d4332.forEach(_0x4615e6 => {
          const _0x2a5898 = _0x4615e6.val();
          const _0x358323 = _0x2a5898.id;
          const _0x203e2c = new Date(_0x2a5898.timestamp);
          const _0x4d6abe = _0x203e2c.getHours().toString().padStart(0x2, '0');
          const _0xa999c8 = _0x203e2c.getMinutes().toString().padStart(0x2, '0');
          const _0x2b84e9 = _0x203e2c.getSeconds().toString().padStart(0x2, '0');
          const _0x1ce4ed = _0x203e2c.getMilliseconds().toString().padStart(0x3, '0');
          const _0x42c981 = realtimeDB.ref(_0x829296 + "/games/player" + _0x358323);
          _0x42c981.once("value", _0x2cfb88 => {
            const _0x6a385a = _0x2cfb88.val().displayName;
            const _0x9153fb = document.createElement("div");
            _0x9153fb.className = "w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center font-semibold py-4 rounded-xl dark:from-blue-700 dark:to-indigo-700";
            _0x9153fb.textContent = "Thí sinh " + _0x6a385a + " đã giành quyền trả lời chướng ngại vật lúc " + _0x4d6abe + ':' + _0xa999c8 + ':' + _0x2b84e9 + ':' + _0x1ce4ed;
            _0x4713e8.appendChild(_0x9153fb);
            const _0x27715c = document.getElementById("audio_ObstacleAnswerBuzzer");
            if (_0x27715c) {
              _0x27715c.currentTime = 0x0;
              _0x27715c.play();
            } else {
              console.warn("Audio element with id 'audio_ObstacleAnswerBuzzer' not found.");
            }
          });
        });
      });
      _0x10e9b5.on("value", async _0xc38995 => {
        try {
          const _0x5527a8 = await getQuestionMedia("VCNVQuestion", "CNV", "background");
          await displayQuestionImage(_0x5527a8.image, document.getElementById("ObstacleImage"), document.getElementById("ObstacleImageContainer"));
        } catch (_0xd3e0a3) {
          console.error("Error displaying question image:", _0xd3e0a3);
        }
      });
      _0xe8303d.on('value', _0x1e4021 => {
        const _0x7a2179 = document.querySelector(".ObstacleImageOverlay");
        for (let _0x5532ba = 0x1; _0x5532ba <= 0x5; _0x5532ba++) {
          const _0x26ff62 = _0x1e4021.val()['HA' + _0x5532ba].status;
          const _0x34472e = _0x7a2179.children[_0x5532ba - 0x1];
          if (_0x26ff62 === 0x0) {
            _0x34472e.classList.remove("hidden");
          } else if (_0x26ff62 === 0x1) {
            _0x34472e.classList.add("hidden");
            _0x11bdbf.once("value").then(_0x5aecf6 => {
              if (_0x5aecf6.val().correct != 0x1) {
                document.getElementById("audio_ObstacleImageShow").currentTime = 0x0;
                document.getElementById("audio_ObstacleImageShow").play();
              }
            });
          }
        }
      });
      _0x432d64.on('value', _0x6fa20f => {
        const _0x1f3ae7 = _0x6fa20f.val().audio;
        if (_0x1f3ae7 === 0x1) {
          document.getElementById("ObstacleAudio").currentTime = 0x0;
          document.getElementById('ObstacleAudio').play();
        } else {
          document.getElementById("ObstacleAudio").currentTime = 0x0;
          document.getElementById("ObstacleAudio").pause();
        }
      });
      _0x46c8b3.on("value", _0x3e006a => {
        const _0xea3e47 = _0x3e006a.val().countdown;
        if (_0xea3e47 === 0x1) {
          document.getElementById("audio_ObstacleRowThinking").currentTime = 0x0;
          document.getElementById('audio_ObstacleRowThinking').play();
        }
      });
      function _0x23f52e() {
        const _0x55e5c7 = document.getElementById("obstacleAnswersTableBody");
        if (!_0x55e5c7) {
          return;
        }
        _0x55e5c7.innerHTML = '';
        const _0x2f8acf = getPlayerLimit();
        for (let _0xeeb2d7 = 0x1; _0xeeb2d7 <= _0x2f8acf; _0xeeb2d7++) {
          const _0x5a52cd = document.createElement('tr');
          if (_0xeeb2d7 % 0x2 === 0x1) {
            _0x5a52cd.className = "bg-white dark:bg-neutral-700";
          } else {
            _0x5a52cd.className = "bg-gray-50 dark:bg-neutral-600";
          }
          const _0x24fff5 = document.createElement('td');
          _0x24fff5.className = "px-6 py-4 text-black dark:text-white font-medium";
          _0x24fff5.id = 'ObstacleAnswerPlayer' + _0xeeb2d7 + "Name";
          const _0x5ce23e = document.createElement('td');
          _0x5ce23e.className = "px-6 py-4 text-gray-700 dark:text-gray-300 font-medium";
          _0x5ce23e.id = 'ObstacleAnswerPlayer' + _0xeeb2d7;
          _0x5a52cd.appendChild(_0x24fff5);
          _0x5a52cd.appendChild(_0x5ce23e);
          _0x55e5c7.appendChild(_0x5a52cd);
        }
      }
      _0x23f52e();
      window.addEventListener("playerLimitChanged", function (_0x315a6e) {
        _0x23f52e();
      });
      _0x4be2c7.on("value", async _0x2e0476 => {
        if (!_0x2e0476.exists()) {
          return;
        }
        const _0x5dda7b = _0x2e0476.val().status;
        if (_0x5dda7b === true) {
          document.getElementById("Obstacle").classList.remove("hidden");
          document.getElementById("audio_ObstacleRowShow").currentTime = 0x0;
          document.getElementById('audio_ObstacleRowShow').play();
          try {
            const _0x3a6313 = await getQuestionMedia('VCNVQuestion', 'CNV', "background");
            await displayQuestionImage(_0x3a6313.image, document.getElementById('ObstacleImage'), document.getElementById('ObstacleImageContainer'));
          } catch (_0x275949) {
            console.error("Error displaying question image:", _0x275949);
          }
        } else {
          document.getElementById("Obstacle").classList.add("hidden");
        }
      });
      _0x5d8a1f.on("value", _0x3b9d2e => {
        const _0x2f8e1a = _0x3b9d2e.val();
        if (!_0x2f8e1a || !_0x2f8e1a.audioData) {
          return;
        }
        if (_0x2f8e1a.isPlaying) {
          window.stopCurrentQuestionAudio();
          setTimeout(() => {
            playQuestionAudio(_0x2f8e1a.audioData);
          }, 100);
        } else {
          window.stopCurrentQuestionAudio();
        }
      });
    });
  });