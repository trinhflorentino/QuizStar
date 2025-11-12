auth.onAuthStateChanged(_0x2e567a => {
    if (!_0x2e567a) {
      return;
    }
    const _0x37006d = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x37006d.onSnapshot(_0x323df6 => {
      if (!_0x323df6.exists) {
        return;
      }
      const _0x15677c = _0x323df6.data().match;
      const _0x3ddac = realtimeDB.ref(_0x15677c + "/games");
      _0x3ddac.on("value", async _0x3f54c8 => {
        const _0x145ded = _0x3f54c8.val() || {};
        const _0x2f0ee4 = document.getElementById('playerListContainer');
        _0x2f0ee4.innerHTML = '';
        const _0x4e4ecc = document.getElementById("startPlayerContainer");
        if (_0x4e4ecc) {
          _0x4e4ecc.innerHTML = '';
        }
        const _0x24f451 = document.getElementById("startIIPlayerContainer");
        if (_0x24f451) {
          _0x24f451.innerHTML = '';
        }
        const _0x1dc646 = document.getElementById("FinishPlayerLists");
        if (_0x1dc646) {
          _0x1dc646.innerHTML = '';
        }
        for (let _0x3b1504 = 0x1; _0x3b1504 <= 0x4; _0x3b1504++) {
          const _0x5e805f = _0x145ded["player" + _0x3b1504];
          if (_0x5e805f) {
            const _0x912d02 = _0x5e805f.uid;
            const _0x4147f6 = _0x5e805f.displayName || "Player " + _0x3b1504;
            const _0x471748 = _0x5e805f.points || 0x0;
            const _0x1c7be5 = document.createElement('div');
            _0x1c7be5.className = "flex flex-col items-center w-72 p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg";
            const _0x19cf46 = document.createElement("div");
            _0x19cf46.className = "relative";
            const _0x588bca = document.createElement("img");
            _0x588bca.alt = "Avatar " + _0x3b1504;
            _0x588bca.className = "w-36 h-36 sm:w-32 sm:h-32 rounded-full object-cover";
            _0x19cf46.appendChild(_0x588bca);
            _0x1c7be5.appendChild(_0x19cf46);
            const _0x3d34fe = document.createElement('span');
            _0x3d34fe.className = "mt-4 text-lg sm:text-xl font-bold text-white text-center";
            _0x3d34fe.textContent = _0x4147f6;
            _0x1c7be5.appendChild(_0x3d34fe);
            const _0x2bf405 = document.createElement("div");
            _0x2bf405.className = "mt-3 px-6 py-2 bg-neutral-700 rounded-full shadow-inner";
            const _0x5b15a4 = document.createElement("span");
            _0x5b15a4.className = "text-gray-300 font-semibold";
            _0x5b15a4.textContent = _0x471748;
            _0x2bf405.appendChild(_0x5b15a4);
            _0x1c7be5.appendChild(_0x2bf405);
            _0x2f0ee4.appendChild(_0x1c7be5);
            firebase.storage().ref().child("users/" + _0x912d02 + "/profile.jpg").getDownloadURL().then(_0x403af1 => {
              _0x588bca.src = _0x403af1;
            })['catch'](() => {
              firebase.storage().ref().child("users/profile.jpg").getDownloadURL().then(_0x16faae => {
                _0x588bca.src = _0x16faae;
              });
            });
            const _0x97d7a8 = realtimeDB.ref(_0x15677c + "/point/player" + _0x3b1504);
            _0x97d7a8.on("value", _0x46dfa9 => {
              const _0x1212c9 = _0x46dfa9.val()?.["point"] || 0x0;
              _0x5b15a4.textContent = _0x1212c9;
            });
            const _0x5ad38b = document.getElementById('ObstacleAnswerPlayer' + _0x3b1504 + "Name");
            if (_0x5ad38b) {
              _0x5ad38b.textContent = _0x4147f6;
            }
            if (_0x4e4ecc) {
              const _0x96df24 = document.createElement("div");
              _0x96df24.className = "flex flex-row items-center justify-between bg-white p-4 rounded-lg";
              const _0x14e1f0 = document.createElement('p');
              _0x14e1f0.className = "font-bold text-2xl";
              _0x14e1f0.textContent = _0x4147f6;
              const _0x25135c = document.createElement('p');
              _0x25135c.className = "font-bold text-2xl";
              _0x25135c.textContent = _0x471748;
              _0x96df24.appendChild(_0x14e1f0);
              _0x96df24.appendChild(_0x25135c);
              _0x4e4ecc.appendChild(_0x96df24);
              const _0x56c743 = realtimeDB.ref(_0x15677c + "/point/player" + _0x3b1504);
              _0x56c743.on("value", _0x1b1b36 => {
                const _0xe4a851 = _0x1b1b36.val()?.["point"] || 0x0;
                _0x25135c.textContent = _0xe4a851;
              });
            }
            if (_0x24f451) {
              const _0x45e3f9 = document.createElement("div");
              _0x45e3f9.className = "flex flex-row items-center justify-between bg-white p-4 rounded-lg";
              const _0x5bc0b5 = document.createElement('p');
              _0x5bc0b5.className = "font-bold text-2xl";
              _0x5bc0b5.textContent = _0x4147f6;
              const _0x328133 = document.createElement('p');
              _0x328133.className = "font-bold text-2xl";
              _0x328133.textContent = _0x471748;
              _0x45e3f9.appendChild(_0x5bc0b5);
              _0x45e3f9.appendChild(_0x328133);
              _0x24f451.appendChild(_0x45e3f9);
              const _0x2fe612 = realtimeDB.ref(_0x15677c + '/point/player' + _0x3b1504);
              _0x2fe612.on("value", _0x15eba8 => {
                const _0x3ccf8a = _0x15eba8.val()?.["point"] || 0x0;
                _0x328133.textContent = _0x3ccf8a;
              });
            }
            const _0x19ef46 = document.getElementById('ObstacleAnswerPlayerName' + _0x3b1504);
            if (_0x19ef46) {
              _0x19ef46.textContent = _0x4147f6;
            }
            if (_0x1dc646) {
              let _0x1bbfa3;
              const _0x404b2a = _0x23b645 => {
                const _0x32950f = document.createElement('div');
                _0x32950f.className = "flex-1 bg-white p-4";
                const _0x4d79d4 = document.createElement('p');
                _0x4d79d4.className = "text-defaultColor font-bold text-xl text-center";
                _0x4d79d4.textContent = _0x23b645;
                _0x32950f.appendChild(_0x4d79d4);
                return {
                  'card': _0x32950f,
                  'para': _0x4d79d4
                };
              };
              if ([0x2, 0x3, 0x4].includes(_0x3b1504)) {
                const _0x413883 = document.createElement("div");
                _0x413883.className = "w-px bg-defaultColor";
                // _0x1dc646.appendChild(_0x413883);
                const {
                  card: _0x4af521,
                  para: _0x3686e7
                } = _0x404b2a(_0x4147f6 + " (" + _0x471748 + ')');
                _0x1dc646.appendChild(_0x4af521);
                _0x1bbfa3 = _0x3686e7;
              } else {
                const {
                  card: _0x502b18,
                  para: _0x379d01
                } = _0x404b2a(_0x4147f6 + " (" + _0x471748 + ')');
                _0x1dc646.appendChild(_0x502b18);
                _0x1bbfa3 = _0x379d01;
              }
              const _0x4342a7 = realtimeDB.ref(_0x15677c + "/point/player" + _0x3b1504);
              _0x4342a7.on("value", _0x4b8935 => {
                const _0x1004c7 = _0x4b8935.val()?.["point"] || 0x0;
                _0x1bbfa3.textContent = _0x4147f6 + " (" + _0x1004c7 + ')';
              });
              if (_0x3b1504 === 0x4) {
                const _0x1ac5f5 = _0x1dc646.children;
                if (_0x1ac5f5.length) {
                  _0x1ac5f5[0x0].classList.add("rounded-tl-lg");
                  _0x1ac5f5[_0x1ac5f5.length - 0x1].classList.add("rounded-tr-lg");
                }
              }
            }
          }
        }
      });
    });
  });