auth.onAuthStateChanged(_0x566145 => {
    if (!_0x566145) {
      return;
    }
    const _0x198a2e = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x198a2e.onSnapshot(_0x20b73b => {
      if (!_0x20b73b.exists) {
        return;
      }
      const _0x13733b = _0x20b73b.data().match;
      var _0x4c5ef6 = realtimeDB.ref(_0x13733b + "/hostid");
      var _0x5ba605 = realtimeDB.ref(_0x13733b + "/IntroNum");
      const _0x2ba2f5 = document.getElementById("IntroVideo");
      const _0x1f62f7 = document.getElementById("IntroIframe");
      _0x4c5ef6.on("value", _0x2a5e60 => {
        const _0x454597 = _0x2a5e60.val();
        if (!_0x454597) {
          return;
        }
        const _0x47cad5 = firebase.firestore().collection("Intro").doc(_0x454597);
        _0x47cad5.onSnapshot(_0x233ef5 => {
          if (!_0x233ef5.exists) {
            console.log("No intro data found");
            return;
          }
          _0x5ba605.on("value", _0x478ed7 => {
            const _0x2833c3 = _0x478ed7.val();
            if (!_0x2833c3 || !_0x2833c3.intronum) {
              _0x9a107d();
              return;
            }
            const _0x42162c = _0x2833c3.intronum;
            if (_0xda1d9e(_0x42162c)) {
              _0x578882(_0x42162c);
            } else {
              _0xeb3ad7(_0x42162c);
            }
          });
        });
      });
      function _0xda1d9e(_0x14ff8c) {
        try {
          new URL(_0x14ff8c);
          return true;
        } catch {
          return false;
        }
      }
      function _0x9a107d() {
        _0x2ba2f5.style.display = "none";
        _0x2ba2f5.pause();
        _0x2ba2f5.src = '';
        _0x1f62f7.style.display = "none";
        _0x1f62f7.src = '';
      }
      function _0x578882(_0x35c5ec) {
        _0x9a107d();
        _0x1f62f7.style.display = "block";
        _0x1f62f7.src = _0x35c5ec;
      }
      function _0xeb3ad7(_0x432830) {
        _0x9a107d();
        const _0x1a790c = firebase.storage().ref(_0x432830);
        _0x1a790c.getDownloadURL().then(_0x3bb534 => {
          _0x2ba2f5.style.display = "block";
          _0x2ba2f5.src = _0x3bb534;
          _0x2ba2f5.play().then(() => {})['catch'](_0x2bc481 => console.error("Error playing video:", _0x2bc481));
        })['catch'](_0xe34ab9 => {
          console.error("Error fetching video from storage:", _0xe34ab9);
        });
      }
    });
  });