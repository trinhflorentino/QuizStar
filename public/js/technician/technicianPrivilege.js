auth.onAuthStateChanged(_0x465475 => {
    if (!_0x465475) {
      return;
    }
    const _0x34eea8 = firestoreDB.collection('match').doc(_0x465475.uid);
    _0x34eea8.onSnapshot(_0x5df6cf => {
      if (!_0x5df6cf.exists) {
        return;
      }
      const _0x42e519 = _0x5df6cf.data().match;
      const _0xa328f9 = realtimeDB.ref(_0x42e519 + '/hostid');
      _0xa328f9.on("value", _0x426197 => {
        if (auth.currentUser.uid !== _0x426197.val()) {
          alert("Bạn không phải chủ phòng, không thể truy cập trang này.");
          window.location.href = '/Main.html';
        }
      });
      // firebase.firestore().collection("hostUids").doc(auth.currentUser.uid).get().then(_0x5ea216 => {
      //   if (_0x5ea216.exists) {
      //     const {
      //       expiredDate: _0x284d8b,
      //       disabledDate: _0x59a493
      //     } = _0x5ea216.data();
      //     const _0x1c530b = firebase.firestore.Timestamp.now();
      //     if (_0x284d8b && _0x1c530b.seconds > _0x284d8b.seconds || _0x59a493 !== null) {
      //       failToast("Bạn không có quyền điều khiển trận đấu, bị vô hiệu hoá hoặc đã hết hạn sử dụng dịch vụ. Đang điều hướng bạn về trang chủ.", 0x1388, "top", "right", true, false, '');
      //       document.body.style.pointerEvents = "none";
      //       setTimeout(() => {
      //         window.location.href = "/Main.html";
      //       }, 0x1388);
      //     } else {
      //       (async () => {
      //         try {
      //           const _0x19efbc = await fetch("https://api.ipify.org?format=json");
      //           const {
      //             ip: _0x4df880
      //           } = await _0x19efbc.json();
      //           const _0x17c808 = navigator.userAgent;
      //           console.log("User IP:", _0x4df880, "Device:", _0x17c808);
      //           const _0x11eee7 = auth.currentUser?.['uid'];
      //           if (_0x11eee7) {
      //             const _0x167dda = firestoreDB.collection("ipLogs").doc(_0x11eee7);
      //             const _0x53c9e1 = await _0x167dda.get();
      //             const _0x40cbc4 = new Date().toISOString();
      //             if (_0x53c9e1.exists) {
      //               const _0x16bac4 = _0x53c9e1.data();
      //               let _0x26c990 = _0x16bac4.ips || [];
      //               let _0x2b4167 = false;
      //               _0x26c990 = _0x26c990.map(_0x5cf9fe => {
      //                 if (_0x5cf9fe.ip === _0x4df880) {
      //                   _0x2b4167 = true;
      //                   return {
      //                     'ip': _0x4df880,
      //                     'timestamp': _0x40cbc4,
      //                     'deviceName': _0x17c808
      //                   };
      //                 }
      //                 return _0x5cf9fe;
      //               });
      //               if (_0x2b4167) {
      //                 await _0x167dda.update({
      //                   'ips': _0x26c990
      //                 });
      //               } else {
      //                 await _0x167dda.update({
      //                   'ips': firebase.firestore.FieldValue.arrayUnion({
      //                     'ip': _0x4df880,
      //                     'timestamp': _0x40cbc4,
      //                     'deviceName': _0x17c808
      //                   })
      //                 });
      //               }
      //             } else {
      //               await _0x167dda.set({
      //                 'ips': [{
      //                   'ip': _0x4df880,
      //                   'timestamp': _0x40cbc4,
      //                   'deviceName': _0x17c808
      //                 }]
      //               });
      //             }
      //           }
      //         } catch (_0x5297c6) {
      //           console.error("Error fetching/updating IP:", _0x5297c6);
      //         }
      //       })();
      //     }
      //   } else {
      //     failToast("Bạn không có quyền điều khiển trận đấu, bị vô hiệu hoá hoặc đã hết hạn sử dụng dịch vụ. Đang điều hướng bạn về trang chủ.", 0x1388, "top", 'right', true, false, '');
      //     document.body.style.pointerEvents = "none";
      //     setTimeout(() => {
      //       window.location.href = "/Main.html";
      //     }, 0x1388);
      //   }
      // });
    });
  });