auth.onAuthStateChanged(_0x477a2f => {
    if (!_0x477a2f) {
      return;
    }
    const _0x2c27e8 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x2c27e8.onSnapshot(_0x7b970b => {
      if (!_0x7b970b.exists) {
        return;
      }
      const _0x39a13d = _0x7b970b.data().match;
      const _0x2d3224 = localStorage.getItem('id');
      const _0x44a10e = firebase.database().ref(_0x39a13d + "/playerConnection/player" + _0x2d3224 + '/connections');
      const _0x275639 = firebase.database().ref(".info/connected");
      let _0x4c368d = true;
      _0x275639.on("value", _0x28d5c3 => {
        const _0x2b014b = document.getElementById("connectionStatusIcon");
        const _0x36aab1 = document.getElementById('connectionStatusText');
        if (_0x28d5c3.val() === true) {
          _0x2b014b.textContent = "check_circle";
          _0x2b014b.classList.remove('text-yellow-400', "text-red-400");
          _0x2b014b.classList.add('text-green-400');
          _0x36aab1.textContent = "Đã kết nối đến máy chủ";
          _0x44a10e.remove().then(() => {
            const _0x22b23b = _0x44a10e.push();
            _0x22b23b.onDisconnect().remove();
            _0x22b23b.set(true);
          })["catch"](_0x45dc3c => {
            console.error("Failed to remove old connections:", _0x45dc3c);
          });
        } else if (!_0x4c368d) {
          _0x2b014b.textContent = "highlight_off";
          _0x2b014b.classList.remove('text-green-400', 'text-yellow-400');
          _0x2b014b.classList.add('text-red-400');
          _0x36aab1.textContent = "Mất kết nối đến máy chủ";
          failToast("Bạn đã bị mất kết nối đến hệ thống. Liên hệ người điều khiển ngay lập tức.", 0x3a98, "bottom", "right", true, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", '');
        }
        _0x4c368d = false;
      });
    });
  });