function signOut() {
    successToast("Đăng xuất thành công", 0xbb8, "bottom", "right", false, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", '');
    setTimeout(function () {
      auth.signOut();
      window.location.href = '/index.html';
      localStorage.removeItem("iduser");
      localStorage.removeItem("name");
    }, 0xbb8);
  }
  firebase.auth().onAuthStateChanged(function (_0x30588f) {
    if (_0x30588f) {
      localStorage.setItem('iduser', _0x30588f.uid);
    }
    if (!_0x30588f) {
      window.location.href = "/index.html";
    }
  });