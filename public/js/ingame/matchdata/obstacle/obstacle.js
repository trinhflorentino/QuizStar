auth.onAuthStateChanged(_0x4c3960 => {
    if (!_0x4c3960) {
      return;
    }
    const _0x5954f3 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x5954f3.onSnapshot(_0x340592 => {
      if (!_0x340592.exists) {
        return;
      }
      const _0x15a7fa = _0x340592.data().match;
      var _0x51c846 = realtimeDB.ref(_0x15a7fa + "/VCNVQuestion");
      var _0x27db31 = realtimeDB.ref(_0x15a7fa + '/VCNV/hangngang');
      var _0x6e72c4 = realtimeDB.ref(_0x15a7fa + "/phanthistatus/vcnv");
      var _0x54dd29 = realtimeDB.ref(_0x15a7fa + '/VCNVOpenAnswer');
      var _0x47000b = realtimeDB.ref(_0x15a7fa + "/ObstacleAnswers");
      var _0x53de52 = realtimeDB.ref(_0x15a7fa + '/VCNVRowStatus');
      var _0x51cb6d = realtimeDB.ref(_0x15a7fa + "/CompetitonAnswerCheckStatus/Obstacle");
      var _0x18a7b1 = realtimeDB.ref(_0x15a7fa + '/ObstacleBuzzer');
      var _0x2a02ff = realtimeDB.ref(_0x15a7fa + "/VCNVImageStatus");
      var _0xe336ae = realtimeDB.ref(_0x15a7fa + "/VCNVChuong/OpenAll");
      var _0x2fed44 = realtimeDB.ref(_0x15a7fa + "/ObstacleDisabledId");
      var _0x45dbd2 = realtimeDB.ref(_0x15a7fa + "/VCNVAudio");
      var _0x14aeb5 = realtimeDB.ref(_0x15a7fa + "/VCNV15sCountdown");
      var _0x51d1dc = realtimeDB.ref(_0x15a7fa + "/AlreadyOpenAnswer");
      var _0x2dc569 = storage.ref(_0x15a7fa + "/img/cnv/cnv.jpg");
      let _0xd2be89 = null;
      _0x51c846.on('value', _0x9f771c => {
        _0xd2be89 = _0x9f771c.val();
        const _0x983aa5 = _0x9f771c.val().CNV.cnv;
        let _0x154274 = _0x983aa5.replace(/\s/g, '');
        let _0x5df019;
        if (/^[\p{L}]+$/u.test(_0x154274)) {
          _0x5df019 = " CHỮ CÁI";
        } else {
          if (/^\d+$/.test(_0x154274)) {
            _0x5df019 = " CHỮ SỐ";
          } else if (/^[\p{L}\d]+$/u.test(_0x154274)) {
            _0x5df019 = " KÝ TỰ";
          } else {
            _0x5df019 = " KÝ TỰ";
          }
        }
        _0xe336ae.on('value', _0x1a2313 => {
          if (_0x1a2313.val().correct === 0x1) {
            document.getElementById("ObstacleCharacterCount").textContent = "CHƯỚNG NGẠI VẬT:  " + _0x983aa5;
            document.getElementById("audio_ObstacleRight").currentTime = 0x0;
            document.getElementById("audio_ObstacleRight").play();
          } else if (_0x1a2313.val().correct === 0x2) {
            document.getElementById('audio_ObstacleRowWrongAnswer').currentTime = 0x0;
            document.getElementById("audio_ObstacleRowWrongAnswer").play();
          } else {
            document.getElementById('ObstacleCharacterCount').textContent = "CHƯỚNG NGẠI VẬT CÓ " + (_0x983aa5.replace(/\s/g, '').length + _0x5df019);
          }
        });
        const _0x5f4f21 = document.getElementById("obstacleContainer");
        const _0x146037 = _0x4e4bc6 => {
          _0x5f4f21.innerHTML = '';
          for (let _0x440b06 = 0x1; _0x440b06 <= 0x4; _0x440b06++) {
            const _0x4986f1 = 'HN' + _0x440b06;
            const _0x2ab4ab = _0xd2be89[_0x4986f1]?.["dapan"]?.["replace"](/\s/g, '');
            const _0xce5665 = _0x4e4bc6[_0x4986f1]?.["status"];
            if (!_0x2ab4ab) {
              console.warn("Answer for " + _0x4986f1 + " is missing or invalid");
              continue;
            }
            const _0xb2c323 = document.createElement("div");
            _0xb2c323.className = "flex space-x-4 mt-4 obstacle-row-" + _0x440b06;
            for (let _0x4128ca of _0x2ab4ab) {
              const _0x1633c4 = document.createElement("div");
              _0x1633c4.className = _0xce5665 === 0x2 ? "w-12 h-12 bg-red-300 dark:bg-red-700 rounded-full flex items-center justify-center" : "w-12 h-12 bg-gray-300 dark:bg-neutral-700 rounded-full flex items-center justify-center";
              const _0x4edd8d = document.createElement("span");
              _0x4edd8d.className = "text-xl font-bold text-black dark:text-white";
              _0x4edd8d.textContent = _0xce5665 === 0x1 ? _0x4128ca : '';
              _0x1633c4.appendChild(_0x4edd8d);
              _0xb2c323.appendChild(_0x1633c4);
            }
            _0x5f4f21.appendChild(_0xb2c323);
          }
        };
        _0x53de52.on("value", _0x1b5cc0 => {
          const _0x4bab10 = _0x1b5cc0.val();
          _0x146037(_0x4bab10);
        });
      });
      _0x27db31.on("value", _0x3f25a6 => {
        const _0x3bd1e6 = _0x3f25a6.val().hn;
        const _0x29cd31 = document.getElementById("ObstacleQuestion");
        const _0x3653c3 = document.getElementById("ObstacleQuestionTitle");
        const _0x548bef = document.querySelector(".obstacle-row-" + _0x3bd1e6);
        if (_0x548bef) {
          _0x548bef.querySelectorAll("div").forEach(_0x54350c => {
            _0x54350c.classList.remove("bg-gray-300", "dark:bg-neutral-700");
            _0x54350c.classList.add('bg-blue-300', "dark:bg-blue-700");
          });
        }
        document.getElementById('ObstacleAnswerTime').textContent = "00:15";
        if (!_0x29cd31) {
          console.warn("ObstacleQuestion container not found.");
          return;
        }
        let _0x403fde = '';
        let _0x5c392d = '';
        switch (_0x3bd1e6) {
          case 0x1:
          case 0x2:
          case 0x3:
          case 0x4:
            _0x403fde = _0xd2be89['HN' + _0x3bd1e6]?.["cauhoi"] || "Câu hỏi HN" + _0x3bd1e6 + " không có dữ liệu";
            _0x5c392d = _0x1ae2a6(_0xd2be89['HN' + _0x3bd1e6]?.["dapan"], _0x3bd1e6);
            break;
          case 0x5:
            _0x403fde = _0xd2be89.HNTT?.["cauhoi"] || "Câu hỏi HNTT không có dữ liệu";
            _0x5c392d = _0x1ae2a6(_0xd2be89.HNTT?.["dapan"], "trung tâm");
            break;
          default:
            _0x5c392d = "Câu hỏi";
            break;
        }
        function _0x1ae2a6(_0x5b3815, _0x167f6d) {
          if (!_0x5b3815) {
            return "Câu hỏi hàng ngang " + _0x167f6d + " không có dữ liệu";
          }
          _0x5b3815 = _0x5b3815.replace(/\s/g, '');
          if (/^[0-9]+$/.test(_0x5b3815)) {
            return "Câu hỏi hàng ngang " + _0x167f6d + " (" + _0x5b3815.length + " chữ số)";
          } else {
            return /^[a-zA-Z]+$/.test(_0x5b3815) ? "Câu hỏi hàng ngang " + _0x167f6d + " (" + _0x5b3815.length + " chữ cái)" : "Câu hỏi hàng ngang " + _0x167f6d + " (" + _0x5b3815.length + " ký tự)";
          }
        }
        if (_0x3bd1e6 !== 0x0) {
          const _0xb9a7cc = document.getElementById("audio_ObstacleRowChoose");
          if (_0xb9a7cc) {
            _0xb9a7cc.currentTime = 0x0;
            _0xb9a7cc.play();
          } else {
            console.warn("Audio element with id 'audio_ObstacleRowChoose' not found.");
          }
        }
        _0x29cd31.textContent = _0x403fde;
        _0x3653c3.textContent = _0x5c392d;
      });
      let _0x88e42f = [];
      _0x2fed44.on("value", _0x4394c9 => {
        _0x88e42f = [];
        _0x4394c9.forEach(_0x4ece7c => {
          _0x88e42f.push(parseInt(_0x4ece7c.val(), 0xa));
        });
      });
      document.getElementById("ObstacleAnswerInput").addEventListener("keypress", _0x559f5e => {
        if (_0x559f5e.key === "Enter") {
          const _0x53d6e7 = parseInt(localStorage.getItem('id'), 0xa);
          if (_0x88e42f.includes(_0x53d6e7)) {
            console.log("Player is disabled");
            return;
          }
          _0x47000b.push({
            'id': localStorage.getItem('id'),
            'answer': _0x559f5e.target.value,
            'timestamp': firebase.database.ServerValue.TIMESTAMP
          });
          _0x559f5e.target.value = '';
        }
      });
      _0x6e72c4.on("value", _0x389bdb => {
        const _0x506c12 = _0x389bdb.val().batdau;
        if (_0x506c12 === 0x1) {
          document.getElementById("audio_ObstacleRowThinking").currentTime = 0x0;
          document.getElementById('audio_ObstacleRowThinking').play();
          document.getElementById('ObstacleAnswerInput').disabled = false;
          document.getElementById("ObstacleAnswerInput").focus();
          document.getElementById('ObstacleAnswerInput').scrollIntoView();
          let _0x28d62f = 0xf;
          document.getElementById('ObstacleAnswerTime').textContent = "00:" + (_0x28d62f < 0xa ? '0' : '') + _0x28d62f;
          document.getElementById('ObstacleAnswerCircleStatus').classList.remove('text-red-500');
          document.getElementById("ObstacleAnswerCircleStatus").classList.add("text-green-500");
          const _0x2af704 = setInterval(() => {
            _0x28d62f -= 0x1;
            if (_0x28d62f <= 0x0) {
              clearInterval(_0x2af704);
              document.getElementById('ObstacleAnswerInput').disabled = true;
              document.getElementById("ObstacleAnswerInput").value = '';
              document.getElementById("ObstacleAnswerCircleStatus").classList.remove("text-green-500");
              document.getElementById("ObstacleAnswerCircleStatus").classList.add("text-red-500");
              document.getElementById("ObstacleAnswerTime").textContent = "00:00";
            } else {
              document.getElementById('ObstacleAnswerTime').textContent = "00:" + (_0x28d62f < 0xa ? '0' : '') + _0x28d62f;
            }
          }, 0x3e8);
        }
      });
      _0x54dd29.on("value", _0xf65fa3 => {
        const _0x321b84 = _0xf65fa3.val().OpenAnswer;
        const _0x22f69a = document.getElementById("ObstacleAnswerLockStatusIcon");
        const _0x526b9f = document.querySelector("[aria-controls=\"obstacle-contestant-answer\"]").parentElement;
        const _0x5df79a = _0x526b9f.querySelector('[data-tab-target]');
        const _0x4e5b8e = document.querySelector("[aria-controls=\"obstacle-answer-question\"]");
        const _0x21c322 = document.getElementById('obstacle-contestant-answer');
        const _0x5ea6a6 = document.getElementById("obstacle-answer-question");
        if (_0x321b84 === 0x1) {
          _0x51d1dc.once("value", _0x2cd6b6 => {
            if (_0x2cd6b6.val().status === true) {
              return;
            }
            document.getElementById("audio_ObstacleAnswers").currentTime = 0x0;
            document.getElementById("audio_ObstacleAnswers").play();
          });
          _0x22f69a.textContent = "lock_open";
          _0x526b9f.classList.remove("pointer-events-none", "opacity-50");
          _0x5df79a.classList.remove('cursor-not-allowed');
          _0x5df79a.classList.add("cursor-pointer");
          _0x21c322.classList.remove("hidden", "opacity-0");
          _0x21c322.classList.add("block", "opacity-100");
          _0x5ea6a6.classList.remove('block', "opacity-100");
          _0x5ea6a6.classList.add("hidden", 'opacity-0');
          setTimeout(() => {
            _0x5df79a.click();
            _0x1f029a(_0x526b9f);
          }, 0x64);
        } else {
          _0x22f69a.textContent = 'lock';
          _0x526b9f.classList.add('pointer-events-none', "opacity-50");
          _0x5df79a.classList.remove("cursor-pointer");
          _0x5df79a.classList.add("cursor-not-allowed");
          _0x5ea6a6.classList.remove("hidden", "opacity-0");
          _0x5ea6a6.classList.add('block', "opacity-100");
          _0x21c322.classList.remove("block", "opacity-100");
          _0x21c322.classList.add("hidden", "opacity-0");
          setTimeout(() => {
            _0x4e5b8e.click();
            _0x1f029a(_0x4e5b8e.parentElement);
          }, 0x64);
        }
      });
      function _0x1f029a(_0x1778ec) {
        const _0xbff521 = _0x1778ec.closest('ul');
        if (!_0xbff521) {
          return;
        }
        const _0x1c197c = document.querySelectorAll("[moving-tab]");
        const _0x4a27ce = Array.from(_0xbff521.children);
        const _0x1b4c2d = _0x4a27ce.indexOf(_0x1778ec) + 0x1;
        let _0x29fffe = 0x0;
        if (_0xbff521.classList.contains("flex-col")) {
          for (let _0xf2b95 = 0x1; _0xf2b95 <= _0x4a27ce.indexOf(_0x1778ec); _0xf2b95++) {
            _0x29fffe += _0xbff521.querySelector("li:nth-child(" + _0xf2b95 + ')').offsetHeight;
          }
          _0x1c197c.forEach(_0x5ee650 => {
            _0x5ee650.style.transform = "translate3d(0px, " + _0x29fffe + "px, 0px)";
            _0x5ee650.style.height = _0xbff521.querySelector("li:nth-child(" + _0x1b4c2d + ')').offsetHeight + 'px';
          });
        } else {
          for (let _0x4eb303 = 0x1; _0x4eb303 <= _0x4a27ce.indexOf(_0x1778ec); _0x4eb303++) {
            _0x29fffe += _0xbff521.querySelector('li:nth-child(' + _0x4eb303 + ')').offsetWidth;
          }
          _0x1c197c.forEach(_0x29d57f => {
            _0x29d57f.style.transform = "translate3d(" + _0x29fffe + "px, 0px, 0px)";
            _0x29d57f.style.width = _0xbff521.querySelector("li:nth-child(" + _0x1b4c2d + ')').offsetWidth + 'px';
          });
        }
      }
      _0x47000b.orderByChild("timestamp").limitToLast(0x1).on('value', _0x20f45b => {
        if (!_0x20f45b.exists()) {
          document.getElementById("ObstacleAnswerOutput").textContent = "Đáp án của bạn:  ";
          return;
        }
        _0x20f45b.forEach(_0x1e054c => {
          const _0x1639eb = _0x1e054c.val();
          if (_0x1639eb.id === localStorage.getItem('id')) {
            document.getElementById("ObstacleAnswerOutput").textContent = "Đáp án của bạn: " + _0x1639eb.answer.toUpperCase();
          }
          if (_0x1639eb === null) {
            console.log('True');
            document.getElementById('ObstacleAnswerOutput').textContent = "Đáp án của bạn:  ";
          }
        });
      });
      _0x47000b.orderByChild('timestamp').on("value", _0x41549d => {
        const _0x1c55d2 = {};
        _0x41549d.forEach(_0x3df2f4 => {
          const _0x2be881 = _0x3df2f4.val();
          const _0x501730 = _0x2be881.id;
          if (!_0x1c55d2[_0x501730] || _0x1c55d2[_0x501730].timestamp < _0x2be881.timestamp) {
            _0x1c55d2[_0x501730] = _0x2be881;
          }
        });
        for (let _0x2c10d3 = 0x1; _0x2c10d3 <= 0x4; _0x2c10d3++) {
          const _0x3690eb = document.getElementById("ObstacleAnswerPlayer" + _0x2c10d3);
          if (_0x3690eb) {
            const _0x12407d = _0x1c55d2[_0x2c10d3] ? _0x1c55d2[_0x2c10d3].answer : '';
            _0x3690eb.textContent = '' + _0x12407d.toUpperCase();
          }
        }
      });
      _0x51cb6d.on("value", _0x24538e => {
        if (_0x24538e.val().status === true) {
          const _0x281acd = _0x24538e.val().correctAnswerIds;
          if (_0x281acd && _0x281acd.length > 0x0) {
            document.getElementById("audio_ObstacleRightAnswer").currentTime = 0x0;
            document.getElementById("audio_ObstacleRightAnswer").play();
          } else {
            document.getElementById('audio_ObstacleRowWrongAnswer').currentTime = 0x0;
            document.getElementById("audio_ObstacleRowWrongAnswer").play();
          }
        }
      });
      document.getElementById('ObstacleBuzzerButton').addEventListener('click', () => {
        _0xe336ae.once('value', _0x2d5643 => {
          if (_0x2d5643.val().correct === 0x1) {
            return;
          }
          const _0x4c300a = parseInt(localStorage.getItem('id'), 0xa);
          if (_0x88e42f.includes(_0x4c300a)) {
            console.log("Player is disabled");
            return;
          }
          _0x18a7b1.push({
            'id': localStorage.getItem('id'),
            'timestamp': firebase.database.ServerValue.TIMESTAMP
          });
        });
      });
      _0x18a7b1.orderByChild('id').equalTo(localStorage.getItem('id')).on("value", _0x14fdd8 => {
        const _0x55556c = document.getElementById('ObstacleBuzzerButton');
        if (_0x14fdd8.exists()) {
          _0x55556c.disabled = true;
        } else {
          _0x55556c.disabled = false;
        }
      });
      _0x18a7b1.orderByChild("timestamp").on("value", _0x30e0e4 => {
        const _0x1fbdd9 = document.getElementById("ObstacleBuzzerList");
        _0x1fbdd9.innerHTML = '';
        _0x30e0e4.forEach(_0x33a08d => {
          const _0x198e69 = _0x33a08d.val();
          const _0x280257 = _0x198e69.id;
          const _0x189440 = new Date(_0x198e69.timestamp);
          const _0x331fe0 = _0x189440.getHours().toString().padStart(0x2, '0');
          const _0x173746 = _0x189440.getMinutes().toString().padStart(0x2, '0');
          const _0x324288 = _0x189440.getSeconds().toString().padStart(0x2, '0');
          const _0xe4164 = _0x189440.getMilliseconds().toString().padStart(0x3, '0');
          const _0x120337 = realtimeDB.ref(_0x15a7fa + "/games/player" + _0x280257);
          _0x120337.once("value", _0x5825a9 => {
            const _0x940037 = _0x5825a9.val().displayName;
            const _0x260db9 = document.createElement("div");
            _0x260db9.className = "w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center font-semibold py-4 rounded-xl dark:from-blue-700 dark:to-indigo-700";
            _0x260db9.textContent = "Thí sinh " + _0x940037 + " đã giành quyền trả lời chướng ngại vật lúc " + _0x331fe0 + ':' + _0x173746 + ':' + _0x324288 + ':' + _0xe4164;
            _0x1fbdd9.appendChild(_0x260db9);
            const _0x5854d4 = document.getElementById("audio_ObstacleAnswerBuzzer");
            if (_0x5854d4) {
              _0x5854d4.currentTime = 0x0;
              _0x5854d4.play();
            } else {
              console.warn("Audio element with id 'audio_ObstacleAnswerBuzzer' not found.");
            }
          });
        });
      });
      _0x2dc569.getDownloadURL().then(_0xeca09c => {
        document.getElementById("ObstacleImage").src = _0xeca09c;
      });
      _0x2a02ff.on('value', _0x34f217 => {
        const _0x3e6fe7 = document.querySelector(".ObstacleImageOverlay");
        for (let _0x4e7d17 = 0x1; _0x4e7d17 <= 0x5; _0x4e7d17++) {
          const _0x2ab8d9 = _0x34f217.val()['HA' + _0x4e7d17].status;
          const _0x23f15d = _0x3e6fe7.children[_0x4e7d17 - 0x1];
          if (_0x2ab8d9 === 0x0) {
            _0x23f15d.classList.remove("hidden");
          } else if (_0x2ab8d9 === 0x1) {
            _0x23f15d.classList.add("hidden");
            document.getElementById("audio_ObstacleImageShow").play();
          }
        }
      });
      _0x45dbd2.on("value", _0xe885dd => {
        const _0x300dc5 = _0xe885dd.val().audio;
        if (_0x300dc5 === 0x1) {
          document.getElementById("ObstacleAudio").currentTime = 0x0;
          document.getElementById("ObstacleAudio").play();
        } else {
          document.getElementById("ObstacleAudio").currentTime = 0x0;
          document.getElementById("ObstacleAudio").pause();
        }
      });
      firebase.storage().ref(_0x15a7fa + '/audio/cnv/hn.mp3').getDownloadURL().then(_0x2c042f => {
        document.getElementById('ObstacleAudio').src = _0x2c042f;
      });
      _0x14aeb5.on('value', _0x290e21 => {
        const _0x37cf32 = _0x290e21.val().countdown;
        if (_0x37cf32 === 0x1) {
          document.getElementById("audio_ObstacleRowThinking").currentTime = 0x0;
          document.getElementById('audio_ObstacleRowThinking').play();
        }
      });
    });
  });