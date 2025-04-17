function setCookie(_0xb1496a, _0x5efe31, _0x501f28) {
  var _0xcaac7a = new Date();
  _0xcaac7a.setTime(_0xcaac7a.getTime() + _0x501f28 * 0x18 * 0x3c * 0x3c * 0x3e8);
  var _0x5fc4a1 = 'expires=' + _0xcaac7a.toUTCString();
  document.cookie = _0xb1496a + '=' + _0x5efe31 + ';' + _0x5fc4a1 + ';path=/';
}
auth.onAuthStateChanged(_0x4e5d07 => {
  if (!_0x4e5d07) {
    return;
  }
  successToast("Đang lấy thông tin trận đấu tham gia gần nhất", 0xbb8, "top", 'right', true, false, '');
  var _0x2d1a5b = firestoreDB.collection('match').doc(auth.currentUser.uid);
  _0x2d1a5b.onSnapshot(_0x385e43 => {
    if (!_0x385e43.exists) {
      document.getElementById("matchJoinCard").style.display = "none";
      return;
    }
    var _0x2aa998 = _0x385e43.data().match;
    var _0x50adb4 = realtimeDB.ref(_0x2aa998 + "/Match");
    _0x50adb4.on('value', _0x1e9208 => {
      var _0xa50be1 = _0x1e9208.val();
      console.log(_0xa50be1);
      if (!_0xa50be1) {
        failToast("Không tìm thấy trận đấu hoặc thông tin không hợp lệ", 0xbb8, 'top', "right", true, false, '');
        document.getElementById('matchJoinCard').style.display = 'none';
        return;
      }
      document.getElementById("matchJoinCard").style.display = "flex";
      successToast("Thành công. Bạn đang tham gia " + _0xa50be1.Name.match, 0xbb8, "top", "right", true, false, '');
      setCookie("matchid", _0x2aa998, 0x80);
      document.getElementById("matchJoiningName").innerHTML = _0xa50be1.Name.match;
      document.getElementById("matchNameChoosePosition").innerHTML = _0xa50be1.Name.match;
      document.getElementById("matchHostName").innerHTML = "Được tổ chức bởi: " + _0xa50be1.Host.host;
      document.getElementById("hostNameChoosePosition").innerHTML = "Được tổ chức bởi: " + _0xa50be1.Host.host;
      document.getElementById("joinAnotherMatchTitle").innerHTML = "Tham gia trận đấu khác";
    });
  }, _0x66db11 => {
    console.error("Error getting document:", _0x66db11);
  });
});
const matchJoinForm = document.getElementById("matchJoinForm");
matchJoinForm.addEventListener("submit", _0x272c56 => {
  _0x272c56.preventDefault();
  const _0x183726 = document.getElementById("matchId").value.toUpperCase();
  const _0x2e4b2e = document.getElementById("matchPassword").value;
  const _0x2de1e0 = firestoreDB.collection('match').doc(auth.currentUser.uid);
  const _0x158ad1 = realtimeDB.ref(_0x183726 + '/password');
  _0x158ad1.on('value', _0x3138ba => {
    const _0x79d31 = _0x3138ba.val();
    if (!_0x79d31) {
      failToast("Mã trận đấu không tồn tại", 0xbb8, "top", "right", true, false, '');
      clearInputs();
      return;
    }
    if (_0x2e4b2e !== _0x79d31) {
      failToast("Mã trận đấu không đúng", 0xbb8, 'top', 'right', true, false, '');
      clearInputs();
      return;
    }
    _0x2de1e0.set({
      'match': _0x183726
    }).then(() => {
      clearInputs();
      setCookie("matchid", _0x183726, 0x80);
    })['catch'](_0x4052dd => {
      console.error("Error adding document:", _0x4052dd);
      failToast("Tham gia trận đấu thất bại", 0xbb8, "top", 'right', true, false, '');
      clearInputs();
    });
  });
});
function clearInputs() {
  document.getElementById("matchId").value = '';
  document.getElementById("matchPassword").value = '';
}