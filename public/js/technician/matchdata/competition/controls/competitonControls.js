auth.onAuthStateChanged(_0x1342da => {
    if (!_0x1342da) {
      return;
    }
    const _0x1ce67f = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x1ce67f.onSnapshot(_0x53ca54 => {
      if (!_0x53ca54.exists) {
        return;
      }
      const _0x1a3de6 = _0x53ca54.data().match;
      document.getElementById("PointReset").addEventListener('click', () => {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ điểm số?")) {
          for (let _0x23a9f1 = 0x1; _0x23a9f1 <= 0x4; _0x23a9f1++) {
            realtimeDB.ref(_0x1a3de6 + '/point/player' + _0x23a9f1).set({
              'point': 0x0
            });
          }
        }
      });
    });
  });
  function playSound(_0x3780e3, _0x4fb0f2) {
    const _0xfc59d5 = realtimeDB.ref(_0x4fb0f2 + "/Sounds");
    let _0x422e9f = {};
    switch (_0x3780e3) {
      case "SpacingMusic":
        _0x422e9f = {
          'SpacingMusic': true
        };
        _0xfc59d5.update(_0x422e9f).then(() => {
          setTimeout(() => {
            _0xfc59d5.update({
              'SpacingMusic': false
            });
          }, 0x3e8);
          successToast("Đã phát âm thanh khoảng cách");
        })["catch"](_0x2b19fa => {
          failToast("Phát âm thanh thất bại");
        });
        break;
      case 'EnglishVoice':
        _0x422e9f = {
          'EnglishVoice': true
        };
        _0xfc59d5.update(_0x422e9f).then(() => {
          setTimeout(() => {
            _0xfc59d5.update({
              'EnglishVoice': false
            });
          }, 0x3e8);
          successToast("Đã phát âm thanh câu hỏi tiếng Anh");
        })["catch"](_0x484b0f => {
          console.error("Failed to update EnglishVoice:", _0x484b0f);
        });
        break;
      default:
        failToast("Phát âm thanh thất bại");
    }
  }