function setCookie(_0x3b20c6, _0xd07728, _0x230d53) {
    var _0x4d2d3a = new Date();
    _0x4d2d3a.setTime(_0x4d2d3a.getTime() + _0x230d53 * 0x18 * 0x3c * 0x3c * 0x3e8);
    var _0x172cc4 = 'expires=' + _0x4d2d3a.toUTCString();
    document.cookie = _0x3b20c6 + '=' + _0xd07728 + ';' + _0x172cc4 + ";path=/";
  }
  auth.onAuthStateChanged(_0x16731f => {
    if (!_0x16731f) {
      return;
    }
    successToast("Đang lấy thông tin trò chơi tham gia gần nhất", 0xbb8, "top", "right", true, false, '');
    var _0x3cd8f3 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x3cd8f3.onSnapshot(_0x3a33e7 => {
      if (!_0x3a33e7.exists) {
        document.getElementById('matchJoinCard').style.display = "none";
        return;
      }
      var _0x4b2468 = _0x3a33e7.data().match;
      var _0x307805 = realtimeDB.ref(_0x4b2468 + '/Match');
      _0x307805.on('value', _0x22d26c => {
        var _0xbfdd14 = _0x22d26c.val();
        console.log(_0xbfdd14);
        if (!_0xbfdd14) {
          failToast("Không tìm thấy trò chơi hoặc thông tin không hợp lệ", 0xbb8, "top", "right", true, false, '');
          document.getElementById("matchJoinCard").style.display = "none";
          return;
        }
        document.getElementById("matchJoinCard").style.display = 'flex';
        successToast("Thành công. Bạn đang tham gia " + _0xbfdd14.Name.match, 0xbb8, "top", "right", true, false, '');
        setCookie("matchid", _0x4b2468, 0x80);
        document.getElementById("matchJoiningName").innerHTML = _0xbfdd14.Name.match;
        document.getElementById("matchNameChoosePosition").innerHTML = _0xbfdd14.Name.match;
        document.getElementById('matchHostName').innerHTML = "Được tổ chức bởi: " + _0xbfdd14.Host.host;
        document.getElementById("hostNameChoosePosition").innerHTML = "Được tổ chức bởi: " + _0xbfdd14.Host.host;
        document.getElementById('joinAnotherMatchTitle').innerHTML = "Tham gia trò chơi khác";
      });
    }, _0x5ec506 => {
      console.error("Error getting document:", _0x5ec506);
    });
  });
  const matchJoinForm = document.getElementById("matchJoinForm");
  matchJoinForm.addEventListener("submit", _0x216dc9 => {
    _0x216dc9.preventDefault();
    const _0x2cdcda = document.getElementById("matchId").value.toUpperCase();
    const _0x597170 = document.getElementById("matchPassword").value;
    const _0x4c6f93 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    const _0x10778d = realtimeDB.ref(_0x2cdcda + '/password');
    _0x10778d.on("value", _0x1a7628 => {
      const _0x4e9508 = _0x1a7628.val();
      if (!_0x4e9508) {
        failToast("Mã trò chơi không tồn tại", 0xbb8, "top", 'right', true, false, '');
        clearInputs();
        return;
      }
      if (_0x597170 !== _0x4e9508) {
        failToast("Mã trò chơi không đúng", 0xbb8, "top", "right", true, false, '');
        clearInputs();
        return;
      }
      _0x4c6f93.set({
        'match': _0x2cdcda
      }).then(() => {
        clearInputs();
        setCookie("matchid", _0x2cdcda, 0x80);
      })["catch"](_0x40a321 => {
        console.error("Error adding document:", _0x40a321);
        failToast("Tham gia trò chơi thất bại", 0xbb8, "top", "right", true, false, '');
        clearInputs();
      });
    });
  });
  function clearInputs() {
    document.getElementById("matchId").value = '';
    document.getElementById("matchPassword").value = '';
  }