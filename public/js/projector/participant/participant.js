auth.onAuthStateChanged(_0x58b1d6 => {
    if (!_0x58b1d6) {
      return;
    }
    const _0x3e3948 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x3e3948.onSnapshot(_0x2b2bae => {
      if (!_0x2b2bae.exists) {
        return;
      }
      const _0x3c753c = _0x2b2bae.data().match;
      var _0x44872e = realtimeDB.ref(_0x3c753c + '/Participant/');
      _0x44872e.orderByChild('uid').equalTo(_0x58b1d6.uid).on("value", function (_0x1883b3) {
        console.log(_0x1883b3.val());
        if (_0x1883b3.exists()) {
          var _0x3f5154 = _0x1883b3.val();
          console.log(_0x3f5154);
          var _0x166cf6 = Object.values(_0x3f5154)[0x0].requestStatus;
          if (_0x166cf6 === 0x0) {
            failToast("Yêu cầu xem phòng trò chơi của bạn đang chờ duyêt. Không được tham gia bằng cách vào URL.");
            document.body.style.pointerEvents = "none";
            setTimeout(() => {
              location.replace("Main.html");
            }, 0xbb8);
          } else {
            if (_0x166cf6 === 0x2) {
              failToast("Bạn đã bị từ chối xem phòng trò chơi này.");
              document.body.style.pointerEvents = "none";
              setTimeout(() => {
                location.replace("Main.html");
              }, 0xbb8);
            } else if (_0x166cf6 === 0x3) {
              failToast("Bạn đã bị chặn bởi chủ phòng.");
              document.body.style.pointerEvents = "none";
              setTimeout(() => {
                location.replace("Main.html");
              }, 0xbb8);
            }
          }
        } else {
          failToast("Bạn không có quyền xem phòng trò chơi này.");
          document.body.style.pointerEvents = "none";
          setTimeout(() => {
            location.replace("Main.html");
          }, 0xbb8);
        }
      });
    });
  });