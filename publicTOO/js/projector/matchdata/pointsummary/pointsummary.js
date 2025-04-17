auth.onAuthStateChanged(_0x22c025 => {
    if (!_0x22c025) {
      return;
    }
    const _0x274626 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x274626.onSnapshot(_0x4cfaad => {
      if (!_0x4cfaad.exists) {
        return;
      }
      const _0x58df5c = _0x4cfaad.data().match;
      var _0x2bfb51 = realtimeDB.ref(_0x58df5c + "/gamestatus/tongketdiem");
      var _0x74bc7f = realtimeDB.ref(_0x58df5c + "/point");
      var _0x46f7d3 = realtimeDB.ref(_0x58df5c + '/games');
      _0x2bfb51.on('value', _0x14abdd => {
        const _0x53fee1 = _0x14abdd.val().tongketdiem;
        if (_0x53fee1 === 0x1) {
          Promise.all([_0x74bc7f.once("value"), _0x46f7d3.once("value")]).then(([_0x579ad2, _0x578f16]) => {
            const _0xeef24d = _0x579ad2.val();
            const _0x5107fa = _0x578f16.val();
            let _0x12512e = [];
            for (let _0x9a669b = 0x1; _0x9a669b <= 0x4; _0x9a669b++) {
              if (_0xeef24d['player' + _0x9a669b] && _0x5107fa["player" + _0x9a669b]) {
                let _0x27e042 = _0xeef24d['player' + _0x9a669b].point;
                let _0x441896 = _0x5107fa["player" + _0x9a669b].displayName;
                _0x12512e.push({
                  'id': _0x9a669b,
                  'point': _0x27e042,
                  'displayName': _0x441896
                });
              }
            }
            _0x12512e.sort((_0x5777be, _0x394e95) => _0x5777be.point - _0x394e95.point);
            console.log("Sorted Players:", _0x12512e);
            const _0x2e66b1 = (_0x22a359, _0x189b13) => {
              const _0x336cd8 = document.getElementById('PointSummaryPlayerName');
              const _0x22fa1b = document.getElementById('PointSummaryPlayerPoint');
              const _0x1825b0 = document.getElementById('PointSummaryPlayerRank');
              if (_0x336cd8 && _0x22fa1b && _0x1825b0) {
                _0x336cd8.textContent = _0x22a359.displayName;
                _0x22fa1b.textContent = _0x22a359.point;
                _0x1825b0.textContent = '#' + _0x189b13;
              }
            };
            const _0x178a07 = [0x0, 0xbb8, 0x1b58, 0x2710];
            _0x12512e.forEach((_0x123515, _0x28d962) => {
              const _0x567aaf = _0x178a07[_0x28d962];
              if (_0x567aaf !== undefined) {
                setTimeout(() => {
                  _0x2e66b1(_0x123515, _0x12512e.length - _0x28d962);
                }, _0x567aaf);
              }
            });
          })['catch'](_0x1789cc => {
            console.error("Error retrieving player data:", _0x1789cc);
          });
        }
      });
    });
  });