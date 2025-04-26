auth.onAuthStateChanged(_0x21a7a9 => {
    if (!_0x21a7a9) {
      return;
    }
    const _0x4ff546 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x4ff546.onSnapshot(_0x2aad29 => {
      if (!_0x2aad29.exists) {
        return;
      }
      const _0x12bbd1 = _0x2aad29.data().match;
      const _0x2c8bfa = realtimeDB.ref(_0x12bbd1 + '/Sounds');
      var _0x1344f5 = document.getElementById("audio_extra_2");
      var _0x88aa4e = document.getElementById("audio_extra_3");
      var _0x2c834f = document.getElementById('audio_extra_4');
      var _0x1fc4fd = document.getElementById('audio_extra_5');
      var _0x4c99aa = document.getElementById("audio_extra_6");
      var _0x15b8fe = document.getElementById("audio_extra_7");
      var _0x3b1419 = document.getElementById('audio_extra_8');
      var _0x549f71 = document.getElementById("audio_extra_9");
      var _0x559874 = document.getElementById("audio_extra_10");
      var _0x2e15aa = document.getElementById("audio_extra_11");
      var _0x219a23 = document.getElementById("audio_extra_12");
      var _0xba2e67 = document.getElementById("audio_extra_13");
      var _0x1758c0 = document.getElementById('audio_extra_14');
      _0x2c8bfa.on("value", _0x1d3b68 => {
        const _0x591186 = _0x1d3b68.val().SpacingMusic;
        const _0x1be389 = _0x1d3b68.val().TenseMoments;
        if (_0x591186 === true) {
          document.getElementById("audio_Spacing").currentTime = 0x0;
          document.getElementById('audio_Spacing').play();
        }
        if (_0x1be389 === true) {
          document.getElementById('audio_TenseMoments').currentTime = 0x0;
          document.getElementById("audio_TenseMoments").play();
        } else {
          document.getElementById("audio_TenseMoments").currentTime = 0x0;
          document.getElementById("audio_TenseMoments").pause();
        }
      });
      var _0x439620 = firebase.database().ref(_0x12bbd1 + "/Banner/Music");
      _0x439620.on("value", _0x50093b);
      function _0x50093b(_0x3609bf) {
        if (_0x3609bf.val().MC == true) {
          _0x1344f5.play();
        } else {
          _0x1344f5.currentTime = 0x0;
          _0x1344f5.pause();
        }
        if (_0x3609bf.val().ContestantIntroduction == true) {
          _0x88aa4e.play();
        } else {
          _0x88aa4e.currentTime = 0x0;
          _0x88aa4e.pause();
        }
        if (_0x3609bf.val().Advisor1 == true) {
          _0x2c834f.play();
        } else {
          _0x2c834f.currentTime = 0x0;
          _0x2c834f.pause();
        }
        if (_0x3609bf.val().Advisor2 == true) {
          _0x1fc4fd.play();
        } else {
          _0x1fc4fd.currentTime = 0x0;
          _0x1fc4fd.pause();
        }
        if (_0x3609bf.val().Advisor3 == true) {
          _0x4c99aa.play();
        } else {
          _0x4c99aa.currentTime = 0x0;
          _0x4c99aa.pause();
        }
        if (_0x3609bf.val().Advisor4 == true) {
          _0x15b8fe.play();
        } else {
          _0x15b8fe.currentTime = 0x0;
          _0x15b8fe.pause();
        }
        if (_0x3609bf.val().Advisor5 == true) {
          _0x3b1419.play();
        } else {
          _0x3b1419.currentTime = 0x0;
          _0x3b1419.pause();
        }
        if (_0x3609bf.val().GivingPrize == true) {
          _0x549f71.play();
        } else {
          _0x549f71.currentTime = 0x0;
          _0x549f71.pause();
        }
        if (_0x3609bf.val().Place1st == true) {
          _0x2e15aa.play();
        } else {
          _0x2e15aa.currentTime = 0x0;
          _0x2e15aa.pause();
        }
        if (_0x3609bf.val().Place2nd == true) {
          _0x219a23.play();
        } else {
          _0x219a23.currentTime = 0x0;
          _0x219a23.pause();
        }
        if (_0x3609bf.val().Place3rd == true) {
          _0xba2e67.play();
        } else {
          _0xba2e67.currentTime = 0x0;
          _0xba2e67.pause();
        }
        if (_0x3609bf.val().Place4th == true) {
          _0x1758c0.play();
        } else {
          _0x1758c0.currentTime = 0x0;
          _0x1758c0.pause();
        }
        if (_0x3609bf.val().End == true) {
          _0x559874.play();
        } else {
          _0x559874.currentTime = 0x0;
          _0x559874.pause();
        }
      }
    });
  });