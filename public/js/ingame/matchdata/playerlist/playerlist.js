auth.onAuthStateChanged(_0x5bdedb => {
    if (!_0x5bdedb) {
      return;
    }
    const _0x3b52f9 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x3b52f9.onSnapshot(_0x487d6c => {
      if (!_0x487d6c.exists) {
        return;
      }
      const _0x3efb78 = _0x487d6c.data().match;
      const _0x46c83b = realtimeDB.ref(_0x3efb78 + "/games");
      _0x46c83b.on("value", async _0x3a6a56 => {
        const _0x16755c = _0x3a6a56.val() || {};
        const _0x26b981 = document.getElementById("playerListContainer");
        const _0x5478b2 = document.getElementById('dockPlayerListContainer');
        _0x26b981.innerHTML = '';
        _0x5478b2.innerHTML = '';
        const _0x28cd06 = getPlayerLimit();
        for (let _0x490804 = 0x1; _0x490804 <= _0x28cd06; _0x490804++) {
          const _0x50e2a4 = _0x16755c["player" + _0x490804];
          const _0x9df768 = document.getElementById("ObstacleAnswerPlayer" + _0x490804 + "Name");
          if (_0x9df768) {
            if (_0x50e2a4) {
              _0x9df768.textContent = _0x50e2a4.displayName || "Player " + _0x490804;
            } else {
              _0x9df768.textContent = "Player " + _0x490804;
            }
          }
          if (_0x50e2a4) {
            const _0x39b027 = _0x50e2a4.uid;
            const _0x271f7f = _0x50e2a4.displayName || "Player " + _0x490804;
            const _0x35b9e9 = _0x50e2a4.points || 0x0;
            const photoURL = _0x50e2a4.photoURL; // Get photoURL from player data if available
            console.log('Ingame Player ' + _0x490804 + ' UID:', _0x39b027, 'Name:', _0x271f7f, 'PhotoURL:', photoURL);
            const _0x4c6027 = document.createElement("div");
            _0x4c6027.className = "flex flex-row items-center w-full p-2 rounded-md bg-gray-200 dark:bg-neutral-700 mb-2";
            const _0x324276 = document.createElement("span");
            _0x324276.className = "text-sm font-bold text-gray-800 dark:text-white mr-2";
            _0x324276.textContent = _0x271f7f;
            _0x4c6027.appendChild(_0x324276);
            const _0x542dde = document.createElement("span");
            _0x542dde.className = "text-sm text-gray-600 dark:text-gray-300 ml-auto";
            _0x542dde.textContent = _0x35b9e9;
            _0x4c6027.appendChild(_0x542dde);
            _0x5478b2.appendChild(_0x4c6027);
            const _0x572646 = document.createElement('div');
            _0x572646.className = "flex flex-col items-center w-64 p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg";
            const _0xc69586 = document.createElement("div");
            _0xc69586.className = "relative";
            const _0x330c5a = document.createElement('img');
            _0x330c5a.alt = "Avatar " + _0x490804;
            _0x330c5a.className = "w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover";
            _0xc69586.appendChild(_0x330c5a);
            _0x572646.appendChild(_0xc69586);
            const _0x494757 = document.createElement("span");
            _0x494757.className = "mt-4 text-lg sm:text-xl font-bold text-gray-800 dark:text-white text-center";
            _0x494757.textContent = _0x271f7f;
            _0x572646.appendChild(_0x494757);
            const _0x59b01b = document.createElement('div');
            _0x59b01b.className = "mt-3 px-6 py-2 bg-gray-100 dark:bg-neutral-700 rounded-full shadow-inner";
            const _0x23ff7f = document.createElement("span");
            _0x23ff7f.className = "text-gray-600 dark:text-gray-300 font-semibold";
            _0x23ff7f.textContent = _0x35b9e9;
            _0x59b01b.appendChild(_0x23ff7f);
            _0x572646.appendChild(_0x59b01b);
            _0x26b981.appendChild(_0x572646);
            // Use photoURL from player data if available, otherwise construct path
            if (photoURL) {
              console.log('Ingame using photoURL from player data:', photoURL);
              _0x330c5a.src = photoURL;
            } else {
              const avatarPath = 'users/' + _0x39b027 + '/profile.jpg';
              console.log('Ingame avatar path:', avatarPath);
              cloudinaryService.ref(avatarPath).getDownloadURL()
                .then(_0x2bc318 => {
                  console.log('Ingame avatar loaded:', _0x2bc318);
                  _0x330c5a.src = _0x2bc318;
                })
                .catch((error) => {
                  console.log('Ingame avatar failed, trying default:', error);
                  cloudinaryService.ref('users/profile.jpg').getDownloadURL()
                    .then(_0x4e581c => {
                      console.log('Ingame default avatar loaded:', _0x4e581c);
                      _0x330c5a.src = _0x4e581c;
                    })
                    .catch(() => {
                      // Fallback to default avatar if both fail
                      console.log('Ingame using app logo fallback');
                      _0x330c5a.src = 'img/appLogo.png';
                    });
                });
            }
            const _0x385e4d = realtimeDB.ref(_0x3efb78 + "/point/player" + _0x490804);
            _0x385e4d.on('value', _0x32adb9 => {
              const _0x565045 = _0x32adb9.val()?.["point"] || 0x0;
              _0x23ff7f.textContent = _0x565045;
              _0x542dde.textContent = _0x565045;
            });
          }
        }
      });
    });
  });