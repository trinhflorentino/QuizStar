function toggleDrawer() {
    const _0x174e53 = document.getElementById("drawer");
    if (_0x174e53.classList.contains("translate-y-full")) {
      _0x174e53.classList.remove("translate-y-full");
    } else {
      _0x174e53.classList.add("translate-y-full");
    }
  }
  auth.onAuthStateChanged(_0xbce0a0 => {
    if (!_0xbce0a0) {
      return;
    }
    const _0x50404f = firestoreDB.collection('match').doc(_0xbce0a0.uid);
    _0x50404f.onSnapshot(_0x3e48c5 => {
      if (!_0x3e48c5.exists) {
        return;
      }
      const _0x37a4bf = _0x3e48c5.data().match;
      var _0x48db6a = realtimeDB.ref(_0x37a4bf + "/gamestatus");
      _0x48db6a.on("value", _0x1d9885 => {
        const _0x41a8ee = _0x1d9885.val();
        if (!_0x41a8ee) {
          return;
        }
        const {
          banner: _0x33d367,
          khoidong: _0x1c7735,
          khoidongo22: _0x4cbb0a,
          vcnv: _0x5ba9d2,
          tangtoc: _0x657265,
          vedich: _0x56d1e8,
          vedichphu: _0x5c372b,
          tongketdiem: _0x89ce68
        } = _0x41a8ee;
        const _0x1359c6 = _0x33d367.banner;
        const _0x393d61 = _0x1c7735.khoidong;
        const _0x5538e3 = _0x4cbb0a.khoidongo22;
        const _0x508716 = _0x5ba9d2.vcnv;
        const _0x3c3c9c = _0x657265.tangtoc;
        const _0x1950c6 = _0x56d1e8.vedich;
        const _0x4d07b8 = _0x5c372b.vedichphu;
        const _0x57c7e6 = _0x89ce68.tongketdiem;
        console.log(_0x57c7e6);
        console.log(_0x1950c6);
        if (_0x1359c6 === 0x0 && _0x393d61 === 0x0 && _0x5538e3 === 0x0 && _0x508716 === 0x0 && _0x3c3c9c === 0x0 && _0x1950c6 === 0x0 && _0x4d07b8 === 0x0 && _0x57c7e6 === 0x0) {
          document.getElementById("CompetitionTitle").textContent = "";
          document.getElementById("Waiting").classList.remove("hidden");
        } else {
          document.getElementById("Waiting").classList.add("hidden");
        }
        if (_0x1359c6 === 0x1) {
          document.getElementById("Banner").classList.remove("hidden");
          document.getElementById("CompetitionTitle").textContent = "GIỚI THIỆU";
        } else {
          document.getElementById("Banner").classList.add("hidden");
        }
        function _0x32f27e(_0x22f86f) {
          const _0x2b1551 = ["audio_StartingStart", "audio_ObstacleStart", "audio_AccelerationStart", "audio_FinishStart", 'audio_PointSummary'];
          _0x2b1551.forEach(_0x4d402b => {
            if (_0x4d402b !== _0x22f86f) {
              const _0x489ad0 = document.getElementById(_0x4d402b);
              if (_0x489ad0) {
                _0x489ad0.pause();
                _0x489ad0.currentTime = 0x0;
              }
            }
          });
        }
        if (_0x393d61 === 0x1) {
          // document.getElementById("StartI").classList.remove("hidden");
          document.getElementById("CompetitionTitle").textContent = "KHỞI ĐỘNG";
          _0x32f27e("audio_StartingStart");
          document.getElementById("audio_StartingStart").play();
        } else {
          document.getElementById("StartI").classList.add("hidden");
        }
        if (_0x5538e3 === 0x1) {
          // document.getElementById("StartII").classList.remove("hidden");
          document.getElementById("CompetitionTitle").textContent = "KHỞI ĐỘNG";
        } else {
          document.getElementById("StartII").classList.add('hidden');
        }
        if (_0x508716 === 0x1) {
          // document.getElementsByTagName("body")[0].style.backgroundImage = "url('/img/NewBackground.png')";
          document.getElementById("Obstacle").classList.remove("hidden");
          document.getElementById("CompetitionTitle").textContent = "VƯỢT CHƯỚNG NGẠI VẬT";
          _0x32f27e('audio_ObstacleStart');
          document.getElementById("audio_ObstacleStart").play();
        } else {
          document.getElementById("Obstacle").classList.add("hidden");
          // if (_0x3c3c9c !== 0x1) { // Only remove background if acceleration is not active
            // document.getElementsByTagName("body")[0].style.backgroundImage = "none";
          // }
        }
        if (_0x3c3c9c === 0x1) {
          document.getElementsByTagName("body")[0].style.backgroundImage = "url('/img/NewBackground.png')";
          document.getElementById("Acceleration").classList.remove('hidden');
          document.getElementById("CompetitionTitle").textContent = "TĂNG TỐC";
          _0x32f27e('audio_AccelerationStart');
          document.getElementById('audio_AccelerationStart').play();
        } else {
          document.getElementById("Acceleration").classList.add("hidden");
          // if (_0x508716 !== 0x1) { // Only remove background if VCNV is not active
            document.getElementsByTagName("body")[0].style.backgroundImage = "none";
          // }
        }
        if (_0x1950c6 === 0x1) {
          document.getElementById("Finish").classList.remove("hidden");
          document.getElementById('CompetitionTitle').textContent = "VỀ ĐÍCH";
          _0x32f27e("audio_FinishStart");
          document.getElementById("audio_FinishStart").play();
        } else {
          document.getElementById("Finish").classList.add('hidden');
        }
        if (_0x4d07b8 === 0x1) {
          document.getElementById("Additional").classList.remove("hidden");
          document.getElementById("CompetitionTitle").textContent = "CÂU HỎI PHỤ";
        } else {
          document.getElementById("Additional").classList.add('hidden');
        }
        if (_0x57c7e6 === 0x1) {
          document.getElementById("PointSummary").classList.remove("hidden");
          _0x32f27e("audio_PointSummary");
          document.getElementById("audio_PointSummary").play();
          document.getElementById("CompetitionTitle").textContent = "TỔNG KẾT ĐIỂM";
        } else {
          document.getElementById("PointSummary").classList.add('hidden');
        }
      });
    });
  });