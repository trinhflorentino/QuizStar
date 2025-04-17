auth.onAuthStateChanged(_0x3b60b6 => {
    if (!_0x3b60b6) {
      return;
    }
    const _0x56c635 = firestoreDB.collection("match").doc(_0x3b60b6.uid);
    _0x56c635.onSnapshot(_0x142340 => {
      if (!_0x142340.exists) {
        return;
      }
      const _0x35643e = _0x142340.data().match;
      const _0x5840ea = realtimeDB.ref(_0x35643e + "/hostid");
      _0x5840ea.on('value', _0x241ffa => {
        if (auth.currentUser.uid !== _0x241ffa.val()) {
          alert("Bạn không phải chủ phòng, không thể truy cập trang này.");
          window.location.href = "/Main.html";
        }
      });
      firebase.firestore().collection("hostUids").doc(auth.currentUser.uid).get().then(_0x5cb626 => {
        if (_0x5cb626.exists) {
          const {
            expiredDate: _0x3e5ac6,
            disabledDate: _0x396272
          } = _0x5cb626.data();
          const _0x1b37a6 = firebase.firestore.Timestamp.now();
          if (_0x3e5ac6 && _0x1b37a6.seconds > _0x3e5ac6.seconds || _0x396272 !== null) {
            failToast("Bạn không có quyền điều khiển trận đấu, bị vô hiệu hoá hoặc đã hết hạn sử dụng dịch vụ. Đang điều hướng bạn về trang chủ.", 0x1388, "top", 'right', true, false, '');
            document.body.style.pointerEvents = "none";
            setTimeout(() => {
              window.location.href = "/Main.html";
            }, 0x1388);
          } else {
            (async () => {
              try {
                const _0x136279 = await fetch("https://api.ipify.org?format=json");
                const {
                  ip: _0x4225d1
                } = await _0x136279.json();
                const _0x9f6707 = navigator.userAgent;
                console.log("User IP:", _0x4225d1, 'Device:', _0x9f6707);
                const _0x41651b = auth.currentUser?.["uid"];
                if (_0x41651b) {
                  const _0xffc55 = firestoreDB.collection('ipLogs').doc(_0x41651b);
                  const _0x53ba3f = await _0xffc55.get();
                  const _0x5830f8 = new Date().toISOString();
                  if (_0x53ba3f.exists) {
                    const _0x30aab5 = _0x53ba3f.data();
                    let _0x45e145 = _0x30aab5.ips || [];
                    let _0x25ce6d = false;
                    _0x45e145 = _0x45e145.map(_0x5c79d6 => {
                      if (_0x5c79d6.ip === _0x4225d1) {
                        _0x25ce6d = true;
                        return {
                          'ip': _0x4225d1,
                          'timestamp': _0x5830f8,
                          'deviceName': _0x9f6707
                        };
                      }
                      return _0x5c79d6;
                    });
                    if (_0x25ce6d) {
                      await _0xffc55.update({
                        'ips': _0x45e145
                      });
                    } else {
                      await _0xffc55.update({
                        'ips': firebase.firestore.FieldValue.arrayUnion({
                          'ip': _0x4225d1,
                          'timestamp': _0x5830f8,
                          'deviceName': _0x9f6707
                        })
                      });
                    }
                  } else {
                    await _0xffc55.set({
                      'ips': [{
                        'ip': _0x4225d1,
                        'timestamp': _0x5830f8,
                        'deviceName': _0x9f6707
                      }]
                    });
                  }
                }
              } catch (_0x4522bb) {
                console.error("Error fetching/updating IP:", _0x4522bb);
              }
            })();
          }
        } else {
          failToast("Bạn không có quyền điều khiển trận đấu, bị vô hiệu hoá hoặc đã hết hạn sử dụng dịch vụ. Đang điều hướng bạn về trang chủ.", 0x1388, "top", "right", true, false, '');
          document.body.style.pointerEvents = "none";
          setTimeout(() => {
            window.location.href = "/Main.html";
          }, 0x1388);
        }
      });
    });
  });