auth.onAuthStateChanged(_0x4d8d95 => {
    if (!_0x4d8d95) {
      return;
    }
    const _0x16f91c = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x16f91c.onSnapshot(_0x5aa9ae => {
      if (!_0x5aa9ae.exists) {
        return;
      }
      const _0x683b4d = _0x5aa9ae.data().match;
      const _0x5d0518 = realtimeDB.ref(_0x683b4d + '/games');
      _0x5d0518.on('value', async _0x40bece => {
        const _0x5e1826 = _0x40bece.val() || {};
        const _0x2fdc02 = document.getElementById("playerListContainer");
        _0x2fdc02.innerHTML = '';
        for (let _0xf7989d = 0x1; _0xf7989d <= 0x4; _0xf7989d++) {
          const _0x45979a = _0x5e1826["player" + _0xf7989d];
          const _0x336b0b = document.getElementById("dockPlayerListContainer");
          _0x336b0b.innerHTML = '';
          for (let _0x65d5af = 0x1; _0x65d5af <= 0x4; _0x65d5af++) {
            const _0x291e2b = _0x5e1826['player' + _0x65d5af];
            if (_0x291e2b) {
              const _0x4b3ada = _0x291e2b.displayName || "Player " + _0x65d5af;
              const _0x534a41 = _0x291e2b.points || 0x0;
              const _0x4a64bf = document.createElement('div');
              _0x4a64bf.className = "flex flex-row items-center w-full p-2 rounded-md bg-gray-200 dark:bg-neutral-700 mb-2";
              const _0x380e5e = document.createElement("span");
              _0x380e5e.className = "text-sm font-bold text-gray-800 dark:text-white mr-2";
              _0x380e5e.textContent = _0x4b3ada;
              _0x4a64bf.appendChild(_0x380e5e);
              const _0x2e3175 = document.createElement("span");
              _0x2e3175.className = "text-sm text-gray-600 dark:text-gray-300 ml-auto";
              _0x2e3175.textContent = _0x534a41;
              _0x4a64bf.appendChild(_0x2e3175);
              _0x336b0b.appendChild(_0x4a64bf);
              const _0x3a71d9 = realtimeDB.ref(_0x683b4d + '/point/player' + _0x65d5af);
              _0x3a71d9.on('value', _0x47ddb4 => {
                const _0xa7757b = _0x47ddb4.val()?.["point"] || 0x0;
                _0x2e3175.textContent = _0xa7757b;
              });
            }
          }
          if (_0x45979a) {
            const _0x47cc28 = _0x45979a.uid;
            const _0x1ee97a = _0x45979a.displayName || "Player " + _0xf7989d;
            const _0x40a782 = _0x45979a.points || 0x0;
            const _0x33cff8 = document.createElement("div");
            _0x33cff8.className = "flex flex-col items-center w-64 p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg";
            const _0x3d74e1 = document.createElement('div');
            _0x3d74e1.className = 'relative';
            const _0x16ede5 = document.createElement("img");
            _0x16ede5.alt = "Avatar " + _0xf7989d;
            _0x16ede5.className = "w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover";
            _0x3d74e1.appendChild(_0x16ede5);
            _0x33cff8.appendChild(_0x3d74e1);
            const _0x449d6e = document.createElement('span');
            _0x449d6e.className = "mt-4 text-lg sm:text-xl font-bold text-gray-800 dark:text-white text-center";
            _0x449d6e.textContent = _0x1ee97a;
            _0x33cff8.appendChild(_0x449d6e);
            const _0xdb968 = document.createElement('div');
            _0xdb968.className = "mt-3 px-6 py-2 bg-gray-100 dark:bg-neutral-700 rounded-full shadow-inner";
            const _0x2489e6 = document.createElement("span");
            _0x2489e6.className = "text-gray-600 dark:text-gray-300 font-semibold";
            _0x2489e6.textContent = _0x40a782;
            _0xdb968.appendChild(_0x2489e6);
            _0x33cff8.appendChild(_0xdb968);
            _0x2fdc02.appendChild(_0x33cff8);
            firebase.storage().ref().child("users/" + _0x47cc28 + '/profile.jpg').getDownloadURL().then(_0x1a3128 => {
              _0x16ede5.src = _0x1a3128;
            })["catch"](() => {
              firebase.storage().ref().child("users/profile.jpg").getDownloadURL().then(_0x4b4a67 => {
                _0x16ede5.src = _0x4b4a67;
              });
            });
            const _0x37fcfc = realtimeDB.ref(_0x683b4d + "/point/player" + _0xf7989d);
            _0x37fcfc.on("value", _0xe9c101 => {
              const _0x10ed2b = _0xe9c101.val()?.['point'] || 0x0;
              _0x2489e6.textContent = _0x10ed2b;
            });
            const _0x99fd05 = document.getElementById('ObstacleAnswerPlayer' + _0xf7989d + 'Name');
            if (_0x99fd05) {
              _0x99fd05.textContent = _0x1ee97a;
            }
          }
        }
      });
    });
  });