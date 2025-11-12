auth.onAuthStateChanged(_0x356119 => {
    if (!_0x356119) {
      return;
    }
    const _0x10e022 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x10e022.onSnapshot(_0x69da4e => {
      if (!_0x69da4e.exists) {
        return;
      }
      const _0x4a6866 = _0x69da4e.data().match;
      const _0x7b6bd7 = realtimeDB.ref(_0x4a6866 + "/games/player" + localStorage.getItem('id'));
      _0x7b6bd7.on("value", _0x219f4e => {
        const _0x21907f = _0x219f4e.val();
        if (!_0x21907f || _0x21907f.uid !== _0x356119.uid) {
          setTimeout(() => {
            location.replace("Main.html");
          }, 0xbb8);
          document.body.style.pointerEvents = 'none';
          failToast("Bạn đã bị mời ra khỏi phòng trò chơi.");
          return;
        }
      });
    });
  });