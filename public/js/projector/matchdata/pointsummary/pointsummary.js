auth.onAuthStateChanged(_0x12a111 => {
    if (!_0x12a111) {
      return;
    }
    const _0xf7bcb4 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0xf7bcb4.onSnapshot(_0x6f5421 => {
      if (!_0x6f5421.exists) {
        return;
      }
      const _0x5bb7da = _0x6f5421.data().match;
      var _0x3ced8a = realtimeDB.ref(_0x5bb7da + "/gamestatus/tongketdiem");
      var _0x2962ce = realtimeDB.ref(_0x5bb7da + "/point");
      var _0xd5a77b = realtimeDB.ref(_0x5bb7da + "/games");
      _0x3ced8a.on("value", _0x11ef01 => {
        const _0x4d66e2 = _0x11ef01.val().tongketdiem;
        if (_0x4d66e2 === 0x1) {
          if (window.playerTimeouts) {
            window.playerTimeouts.forEach(_0x29b7c5 => clearTimeout(_0x29b7c5));
            window.playerTimeouts = [];
          }
          setTimeout(() => {
            document.getElementById("Title").classList.add("hidden");
          }, 0xc8);
          Promise.all([_0x2962ce.once("value"), _0xd5a77b.once("value")]).then(([_0x3a2ee3, _0x271bd3]) => {
            const _0x12e9b0 = _0x3a2ee3.val();
            const _0x40ff8a = _0x271bd3.val();
            let _0x18a957 = [];
            const _0x30bc36 = getPlayerLimit();
            for (let _0x3ac03f = 0x1; _0x3ac03f <= _0x30bc36; _0x3ac03f++) {
              if (_0x12e9b0['player' + _0x3ac03f] && _0x40ff8a['player' + _0x3ac03f]) {
                let _0x3c86ad = _0x12e9b0["player" + _0x3ac03f].point;
                let _0x1a1f8a = _0x40ff8a["player" + _0x3ac03f].displayName;
                _0x18a957.push({
                  'id': _0x3ac03f,
                  'point': _0x3c86ad,
                  'displayName': _0x1a1f8a
                });
              }
            }
            _0x18a957.sort((_0x10689e, _0x1d12e1) => _0x10689e.point - _0x1d12e1.point);
            console.log("Sorted Players:", _0x18a957);
            const _0x3d133e = (_0x7860ac, _0x2d50f9) => {
              const _0x51ea57 = document.getElementById('PointSummaryPlayerName');
              const _0xa4c5b6 = document.getElementById("PointSummaryPlayerPoint");
              const _0x34bc1b = document.getElementById("PointSummaryPlayerRank");
              if (_0x51ea57 && _0xa4c5b6) {
                _0x51ea57.textContent = _0x7860ac.displayName;
                _0xa4c5b6.textContent = _0x7860ac.point;
                _0x34bc1b.textContent = '#' + _0x2d50f9;
              }
            };
            if (!window.playerTimeouts) {
              window.playerTimeouts = [];
            }
            const _0x4fe294 = getPlayerLimit();
            const _0x112bb3 = _0x4fe294 === 0x4 ? [0x0, 0xbb8, 0x1b58, 0x2710] : [0x0, 0xbb8, 0x1770, 0x2328, 0x2ee0];
            if (window.playerTimeouts) {
              window.playerTimeouts.forEach(_0x1348a0 => clearTimeout(_0x1348a0));
              window.playerTimeouts = [];
            }
            _0x18a957.forEach((_0x517ea2, _0x3b3b82) => {
              const _0x542d98 = _0x112bb3[_0x3b3b82];
              if (_0x542d98 !== undefined) {
                const _0x488253 = setTimeout(() => {
                  _0x3d133e(_0x517ea2, _0x18a957.length - _0x3b3b82);
                }, _0x542d98);
                window.playerTimeouts.push(_0x488253);
              }
            });
          })["catch"](_0x45b65b => {
            console.error("Error retrieving player data:", _0x45b65b);
          });
        }
      });
    });
  });