auth.onAuthStateChanged(_0x3c1850 => {
    if (!_0x3c1850) {
      return;
    }
    const _0x281997 = firestoreDB.collection("match").doc(_0x3c1850.uid);
    const _0xb3b120 = new Map();
    _0x281997.onSnapshot(_0x55dc58 => {
      if (!_0x55dc58.exists) {
        return;
      }
      const _0x575014 = _0x55dc58.data().match;
      const _0x375cc7 = realtimeDB.ref(_0x575014 + "/games");
      _0x375cc7.on('value', async _0x18bb4e => {
        const _0x518b57 = _0x18bb4e.val() || {};
        const _0x3c6bd1 = {
          'chat': document.getElementById("chatPlayerContainer"),
          'intro': document.getElementById("introductionPlayerContainer"),
          'startI': document.getElementById("startiPlayerContainer"),
          'startII': document.getElementById("startiiPlayerContainer"),
          'obstacle': document.getElementById("obstaclePlayerContainer"),
          'acceleration': document.getElementById("accelerationPlayerContainer"),
          'finish': document.getElementById("finishPlayerContainer"),
          'additional': document.getElementById("additionalPlayerContainer"),
          'pointSummary': document.getElementById("pointSummaryPlayerContainer"),
          'video': document.getElementById("videosPlayerContainer")
        };
        Object.values(_0x3c6bd1).forEach(_0x2510a8 => {
          if (_0x2510a8) {
            _0x2510a8.innerHTML = '';
          }
        });
        const _0x5826c2 = {};
        const _0x45b68f = {};
        for (let _0x1d4ddb = 0x1; _0x1d4ddb <= 0x4; _0x1d4ddb++) {
          const _0x4364e9 = _0x518b57['player' + _0x1d4ddb];
          if (_0x4364e9) {
            const _0x2c662b = _0x4364e9.uid;
            const _0x487de6 = _0x4364e9.displayName;
            Object.entries(_0x3c6bd1).forEach(([_0x2939a2, _0x214e4d]) => {
              if (_0x214e4d) {
                const _0x8e2149 = createPlayerItem(_0x2c662b, _0x487de6, _0x1d4ddb, _0x5826c2, _0x45b68f, _0x2939a2);
                _0x214e4d.appendChild(_0x8e2149);
              }
            });
            const _0x220541 = realtimeDB.ref(_0x575014 + '/point/player' + _0x1d4ddb);
            _0x220541.on("value", _0x14b1e3 => {
              const _0x4e52ad = _0x14b1e3.val()?.["point"] || 0x0;
              const _0x5163e7 = _0x5826c2["player" + _0x1d4ddb] || [];
              _0x5163e7.forEach(_0x598ade => {
                _0x598ade.textContent = _0x4e52ad;
              });
            });
            const _0x4c7554 = realtimeDB.ref(_0x575014 + "/playerConnection/player" + _0x1d4ddb + "/connections");
            _0x4c7554.on("value", _0x54cad2 => {
              const _0x4d4aea = _0x54cad2.exists();
              const _0x194071 = _0xb3b120.get("player" + _0x1d4ddb);
              if (_0x194071 === true && !_0x4d4aea && _0x487de6 !== 'N/A') {
                document.getElementById("audio_Disconnected").play();
                failToast("Có thí sinh bị mất kết nối đến hệ thống.", 0x3a98, "top", "right", true, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", '');
              }
              _0xb3b120.set("player" + _0x1d4ddb, _0x4d4aea);
              const _0x1471a8 = _0x45b68f["player" + _0x1d4ddb] || [];
              _0x1471a8.forEach(_0x5a378a => {
                _0x5a378a.classList.remove("bg-red-500", "bg-green-500");
                _0x5a378a.classList.add(_0x4d4aea ? "bg-green-500" : "bg-red-500");
              });
            });
          }
        }
      });
    });
  });
  function createPlayerItem(_0x4535ee, _0x232cc6, _0x31e5e1, _0x288938, _0x38fd0d, _0x2301a2) {
    const _0x5c9b9e = document.createElement("div");
    _0x5c9b9e.className = "flex items-center justify-between";
    _0x5c9b9e.id = _0x2301a2 + "Player" + _0x31e5e1;
    const _0x13cd4f = document.createElement("div");
    _0x13cd4f.className = "flex items-center space-x-2";
    _0x5c9b9e.appendChild(_0x13cd4f);
    if (_0x2301a2 === "obstacle" || _0x2301a2 === "acceleration" || _0x2301a2 === "additional") {
      const _0x5280b7 = document.createElement("input");
      _0x5280b7.type = 'checkbox';
      _0x5280b7.className = "mr-2 w-4 h-4 rounded-md";
      _0x5280b7.id = _0x2301a2 + "Player" + _0x31e5e1 + 'Checkbox';
      _0x13cd4f.appendChild(_0x5280b7);
    }
    const _0x3a1013 = document.createElement("div");
    _0x3a1013.className = "\n        chat-avatar w-12 h-12 rounded-full flex-shrink-0\n        " + (_0x232cc6 === "host" ? "bg-blue-700 dark:bg-blue-800" : "bg-gray-400 dark:bg-gray-500") + "\n    ";
    const _0x5cf6e4 = _0x232cc6.split(" ").pop();
    _0x3a1013.textContent = _0x5cf6e4[0x0].toUpperCase();
    _0x3a1013.style.color = "white";
    _0x3a1013.style.display = "flex";
    _0x3a1013.style.justifyContent = "center";
    _0x3a1013.style.alignItems = "center";
    _0x3a1013.style.fontWeight = "bold";
    _0x13cd4f.appendChild(_0x3a1013);
    const _0x23f157 = document.createElement("div");
    _0x23f157.className = "flex flex-col";
    const _0x3b7446 = document.createElement('span');
    _0x3b7446.className = "dark:text-white";
    _0x3b7446.textContent = _0x232cc6;
    _0x3b7446.id = _0x2301a2 + 'Player' + _0x31e5e1 + 'Name';
    _0x23f157.appendChild(_0x3b7446);
    _0x13cd4f.appendChild(_0x23f157);
    const _0x450e6d = document.createElement("div");
    _0x450e6d.className = "flex items-center space-x-2";
    _0x5c9b9e.appendChild(_0x450e6d);
    const _0x4473e8 = document.createElement("span");
    _0x4473e8.className = "font-semibold dark:text-white";
    _0x4473e8.textContent = 0x0;
    _0x450e6d.appendChild(_0x4473e8);
    const _0x397a20 = document.createElement("div");
    _0x397a20.className = "h-3 w-3 rounded-full bg-red-500 ml-2";
    _0x450e6d.appendChild(_0x397a20);
    if (!_0x288938['player' + _0x31e5e1]) {
      _0x288938["player" + _0x31e5e1] = [];
    }
    _0x288938["player" + _0x31e5e1].push(_0x4473e8);
    if (!_0x38fd0d["player" + _0x31e5e1]) {
      _0x38fd0d["player" + _0x31e5e1] = [];
    }
    _0x38fd0d["player" + _0x31e5e1].push(_0x397a20);
    return _0x5c9b9e;
  }