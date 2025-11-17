auth.onAuthStateChanged(_0x134f7d => {
    if (!_0x134f7d) {
      return;
    }
    const _0x1f0b43 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x1f0b43.onSnapshot(_0x38a9ac => {
      if (!_0x38a9ac.exists) {
        return;
      }
      const _0x1d32c9 = _0x38a9ac.data().match;
      var _0x2460e3 = realtimeDB.ref(_0x1d32c9 + "/hostid");
      var _0x55da7e = realtimeDB.ref(_0x1d32c9 + "/IntroNum");
      const _0x5c935a = document.getElementById("IntroVideo");
      const _0x760480 = document.getElementById("IntroIframe");
      _0x2460e3.on("value", _0x318a30 => {
        const _0x34cc27 = _0x318a30.val();
        if (!_0x34cc27) {
          return;
        }
        const _0x38b33c = firebase.firestore().collection("Intro").doc(_0x34cc27);
        _0x38b33c.onSnapshot(_0x4b2064 => {
          let _0x34b768 = {};
          let _0x12cda3 = false;
          if (_0x4b2064.exists) {
            _0x34b768 = _0x4b2064.data();
            _0x12cda3 = _0x34b768.isDisplayIntroToContestant || false;
          } else {
            console.log("No intro data found, using default");
          }
          _0x55da7e.on("value", _0x25da90 => {
            const _0x2c782c = _0x25da90.val();
            if (!_0x2c782c || !_0x2c782c.intronum) {
              _0xb885e8("default-intro.mp4");
              return;
            }
            const _0x4f2113 = _0x2c782c.intronum;
            if (_0x350a84(_0x4f2113)) {
              if (_0x4f2113.includes("youtube.com") || _0x4f2113.includes("youtu.be") || _0x4f2113.includes("vimeo.com") || _0x4f2113.includes("embed") || _0x4f2113.includes("iframe") || _0x4f2113.includes("dailymotion.com") || _0x4f2113.includes("twitch.tv")) {
                _0x1fe3bf(_0x4f2113);
              } else if (_0x452d26(_0x4f2113)) {
                _0x1678c8(_0x4f2113);
              } else {
                _0x1fe3bf(_0x4f2113);
              }
            } else {
              _0xb885e8(_0x4f2113);
            }
          });
        });
      });
      function _0x350a84(_0x4fcc22) {
        try {
          new URL(_0x4fcc22);
          return true;
        } catch {
          return false;
        }
      }
      function _0x452d26(_0x20a0ed) {
        const _0x313b96 = [".mp4", '.webm', '.ogg', ".avi", ".mov", ".wmv", ".m4v", ".flv"];
        return _0x313b96.some(_0x942a4e => _0x20a0ed.toLowerCase().includes(_0x942a4e));
      }
      function _0x3e6bce() {
        _0x5c935a.style.display = "none";
        _0x5c935a.pause();
        _0x5c935a.src = '';
        _0x760480.style.display = "none";
        _0x760480.src = '';
      }
      function _0x1fe3bf(_0x39800d) {
        _0x3e6bce();
        _0x760480.style.display = "block";
        _0x760480.src = _0x39800d;
      }
      function _0x1678c8(_0x163ebe) {
        _0x3e6bce();
        _0x5c935a.style.display = "block";
        _0x5c935a.src = _0x163ebe;
        _0x5c935a.play().then(() => {})["catch"](_0xe81e39 => console.error("Error playing video from URL:", _0xe81e39));
      }
      function _0xb885e8(_0x511a44) {
        _0x3e6bce();
        const _0x5b2530 = window.cloudinaryService.ref(_0x511a44);
        _0x5b2530.getDownloadURL().then(_0x1c7589 => {
          _0x5c935a.style.display = "block";
          _0x5c935a.src = _0x1c7589;
          _0x5c935a.play().then(() => {})["catch"](_0x59a65c => console.error("Error playing video:", _0x59a65c));
        })["catch"](_0x24c3b8 => {
          console.error("Error fetching video from storage:", _0x24c3b8);
        });
      }
    });
  });