function toggleDrawer() {
    const _0x4950da = document.getElementById('drawer');
    if (_0x4950da.classList.contains("translate-y-full")) {
      _0x4950da.classList.remove("translate-y-full");
    } else {
      _0x4950da.classList.add("translate-y-full");
    }
  }
  auth.onAuthStateChanged(_0x379846 => {
    if (!_0x379846) {
      return;
    }
    const _0x3f01cf = firestoreDB.collection("match").doc(_0x379846.uid);
    _0x3f01cf.onSnapshot(_0x3cfc78 => {
      if (!_0x3cfc78.exists) {
        return;
      }
      const _0x2f77a7 = _0x3cfc78.data().match;
      var _0x1f536c = realtimeDB.ref(_0x2f77a7 + "/gamestatus");
      _0x1f536c.on("value", _0x56750a => {
        const _0xe14585 = _0x56750a.val();
        if (!_0xe14585) {
          return;
        }
        const {
          banner: _0x53f475,
          khoidong: _0x460ae0,
          khoidongo22: _0x5e0aae,
          vcnv: _0x4adae1,
          tangtoc: _0x790948,
          vedich: _0x423600,
          vedichphu: _0x5056c1,
          tongketdiem: _0x2bef82
        } = _0xe14585;
        const _0xe4c2c0 = _0x53f475.banner;
        const _0x63c1f3 = _0x460ae0.khoidong;
        const _0x37bc07 = _0x5e0aae.khoidongo22;
        const _0x18f14b = _0x4adae1.vcnv;
        const _0x41c5b8 = _0x790948.tangtoc;
        const _0x50b02e = _0x423600.vedich;
        const _0x5c00d6 = _0x5056c1.vedichphu;
        const _0xa36d4f = _0x2bef82.tongketdiem;
        console.log(_0x63c1f3);
        if (_0xe4c2c0 === 0x0 && _0x63c1f3 === 0x0 && _0x37bc07 === 0x0 && _0x18f14b === 0x0 && _0x41c5b8 === 0x0 && _0x50b02e === 0x0 && _0x5c00d6 === 0x0 && _0xa36d4f === 0x0) {
          document.getElementById("CompetitionTitle").textContent = '';
          document.getElementById('Waiting').classList.remove("hidden");
        } else {
          document.getElementById('Waiting').classList.add("hidden");
        }
        if (_0xe4c2c0 === 0x1 || _0xa36d4f === 0x1) {
          document.getElementById('Banner').classList.remove('hidden');
          document.getElementById("CompetitionTitle").textContent = "Danh sách thí sinh";
        } else {
          document.getElementById("Banner").classList.add('hidden');
        }
        function _0x5f2f3b(_0x1ef308) {
          const _0x3a7ded = ["audio_StartingStart", "audio_ObstacleStart", "audio_AccelerationStart", "audio_FinishStart"];
          _0x3a7ded.forEach(_0x179dba => {
            if (_0x179dba !== _0x1ef308) {
              const _0x13bfc9 = document.getElementById(_0x179dba);
              if (_0x13bfc9) {
                _0x13bfc9.pause();
                _0x13bfc9.currentTime = 0x0;
              }
            }
          });
        }
        if (_0x63c1f3 === 0x1) {
          document.getElementById("StartI").classList.remove("hidden");
          document.getElementById("CompetitionTitle").textContent = "Khởi động";
          _0x5f2f3b("audio_StartingStart");
          document.getElementById("audio_StartingStart").play();
        } else {
          document.getElementById('StartI').classList.add("hidden");
        }
        if (_0x37bc07 === 0x1) {
          document.getElementById("StartII").classList.remove('hidden');
          document.getElementById('CompetitionTitle').textContent = "Khởi động";
        } else {
          document.getElementById("StartII").classList.add("hidden");
        }
        if (_0x18f14b === 0x1) {
          document.getElementById("Obstacle").classList.remove('hidden');
          document.getElementById("CompetitionTitle").textContent = "Vượt chướng ngại vật";
          _0x5f2f3b('audio_ObstacleStart');
          document.getElementById('audio_ObstacleStart').play();
        } else {
          document.getElementById("Obstacle").classList.add("hidden");
        }
        if (_0x41c5b8 === 0x1) {
          document.getElementById("Acceleration").classList.remove('hidden');
          document.getElementById("CompetitionTitle").textContent = "Tăng tốc";
          _0x5f2f3b('audio_AccelerationStart');
          document.getElementById("audio_AccelerationStart").play();
        } else {
          document.getElementById('Acceleration').classList.add("hidden");
        }
        if (_0x50b02e === 0x1) {
          document.getElementById("Finish").classList.remove("hidden");
          document.getElementById("CompetitionTitle").textContent = "Về đích";
          _0x5f2f3b("audio_FinishStart");
          document.getElementById("audio_FinishStart").play();
        } else {
          document.getElementById('Finish').classList.add('hidden');
        }
        if (_0x5c00d6 === 0x1) {
          document.getElementById('Additional').classList.remove('hidden');
          document.getElementById("CompetitionTitle").textContent = "Câu hỏi phụ";
        } else {
          document.getElementById("Additional").classList.add('hidden');
        }
        if (_0xa36d4f === 0x1) {
          document.getElementById("PointSummary").classList.remove("hidden");
          _0x5f2f3b();
          document.getElementById('CompetitionTitle').textContent = "Tổng kết điểm";
        } else {
          document.getElementById("PointSummary").classList.add('hidden');
        }
      });
    });
  });