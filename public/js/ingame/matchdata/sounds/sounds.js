auth.onAuthStateChanged(_0x26037d => {
    if (!_0x26037d) {
      return;
    }
    const _0x1f459b = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x1f459b.onSnapshot(_0x2bfefa => {
      if (!_0x2bfefa.exists) {
        return;
      }
      const _0x531b87 = _0x2bfefa.data().match;
      const _0x24e700 = realtimeDB.ref(_0x531b87 + '/Sounds');
      const _0x1013e7 = realtimeDB.ref(_0x531b87 + "/hostid");
      _0x24e700.on("value", _0x24e9c9 => {
        const _0x1ef9f0 = _0x24e9c9.val().SpacingMusic;
        const _0x426428 = _0x24e9c9.val().TenseMoments;
        if (_0x1ef9f0 === true) {
          document.getElementById("audio_Spacing").currentTime = 0x0;
          document.getElementById("audio_Spacing").play();
        }
        if (_0x426428 === true) {
          document.getElementById("audio_TenseMoments").currentTime = 0x0;
          document.getElementById("audio_TenseMoments").play();
        } else {
          document.getElementById('audio_TenseMoments').currentTime = 0x0;
          document.getElementById("audio_TenseMoments").pause();
        }
      });
      _0x1013e7.on("value", _0x583944 => {
        const _0x4ad1a5 = _0x583944.val();
        firestoreDB.collection('projectorConfig').doc(_0x4ad1a5).onSnapshot(_0x1b06c8 => {
          if (!_0x1b06c8.exists) {
            return;
          }
          const _0xfc4485 = _0x1b06c8.data().ingameVolume;
          document.querySelectorAll("audio, video, iframe").forEach(_0x31b6c8 => {
            _0x31b6c8.volume = _0xfc4485;
          });
        });
      });
    });
  });