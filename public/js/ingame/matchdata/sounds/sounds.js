auth.onAuthStateChanged(_0xea61ad => {
    if (!_0xea61ad) {
      return;
    }
    const _0x90f5fa = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x90f5fa.onSnapshot(_0x27dfda => {
      if (!_0x27dfda.exists) {
        return;
      }
      const _0x511310 = _0x27dfda.data().match;
      const _0x11fc9a = realtimeDB.ref(_0x511310 + '/Sounds');
      _0x11fc9a.on('value', _0x53c1d0 => {
        const _0x398476 = _0x53c1d0.val().SpacingMusic;
        const _0x14b412 = _0x53c1d0.val().TenseMoments;
        if (_0x398476 === true) {
          document.getElementById("audio_Spacing").currentTime = 0x0;
          document.getElementById('audio_Spacing').play();
        }
        if (_0x14b412 === true) {
          document.getElementById("audio_TenseMoments").currentTime = 0x0;
          document.getElementById('audio_TenseMoments').play();
        } else {
          document.getElementById("audio_TenseMoments").currentTime = 0x0;
          document.getElementById("audio_TenseMoments").pause();
        }
      });
    });
  });