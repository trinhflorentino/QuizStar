auth.onAuthStateChanged(_0x54c08d => {
    if (!_0x54c08d) {
      return;
    }
    const _0x218b5f = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x218b5f.onSnapshot(_0x58d58d => {
      if (!_0x58d58d.exists) {
        return;
      }
      const _0x57829a = _0x58d58d.data().match;
      const _0x3c1ae7 = realtimeDB.ref(_0x57829a + "/chat");
      const _0x31bd4c = document.getElementById("msgs");
      _0x3c1ae7.on("child_added", _0x48860b => {
        const _0x400a9d = _0x48860b.val();
        const _0x1f3b68 = createChatElement(_0x400a9d);
        _0x31bd4c.insertBefore(_0x1f3b68, _0x31bd4c.firstChild);
      });
      _0x3c1ae7.on("child_removed", () => {
        _0x31bd4c.innerHTML = '';
      });
      const _0x99800a = document.getElementById("sendMessageForm");
      _0x99800a.addEventListener("submit", _0x1ebead => {
        _0x1ebead.preventDefault();
        const _0x51569d = document.getElementById('msg');
        const _0x4c5243 = _0x51569d.value.trim();
        if (!_0x4c5243) {
          return;
        }
        const _0x2b2647 = _0x54c08d.admin ? "host" : "player";
        const _0x366034 = auth.currentUser.displayName;
        _0x3c1ae7.push({
          'user': _0x366034,
          'txt': _0x4c5243,
          'role': _0x2b2647,
          'uid': _0x54c08d.uid
        });
        _0x51569d.value = '';
      });
    });
  });
  function createChatElement(_0x321bb9) {
    const _0x3eb683 = document.createElement('div');
    _0x3eb683.className = "\n        chat-msg-" + _0x321bb9.role + "\n        flex items-start space-x-4 p-3 rounded-lg mb-3 ml-2 mr-2 shadow-sm\n        " + (_0x321bb9.role === "host" ? "bg-blue-500 text-white dark:bg-blue-600" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200") + "\n    ";
    const _0x484929 = document.createElement("div");
    _0x484929.className = "\n        chat-avatar w-10 h-10 rounded-full flex-shrink-0\n        " + (_0x321bb9.role === "host" ? "bg-blue-700 dark:bg-blue-800" : "bg-gray-400 dark:bg-gray-500") + "\n    ";
    const _0x174900 = _0x321bb9.user.split(" ");
    const _0x3b8e58 = _0x174900.length > 0x1 ? _0x174900[_0x174900.length - 0x1][0x0].toUpperCase() : _0x321bb9.user[0x0].toUpperCase();
    _0x484929.textContent = _0x3b8e58;
    _0x484929.style.color = "white";
    _0x484929.style.display = "flex";
    _0x484929.style.justifyContent = "center";
    _0x484929.style.alignItems = "center";
    _0x484929.style.fontWeight = 'bold';
    const _0x3ff85e = document.createElement('div');
    _0x3ff85e.className = "flex-1";
    const _0x26cb45 = document.createElement('p');
    _0x26cb45.className = "text-sm font-semibold mb-1";
    _0x26cb45.textContent = _0x321bb9.user;
    const _0x54e240 = document.createElement('p');
    _0x54e240.className = "text-sm leading-relaxed";
    _0x54e240.textContent = _0x321bb9.txt;
    _0x3ff85e.appendChild(_0x26cb45);
    _0x3ff85e.appendChild(_0x54e240);
    _0x3eb683.appendChild(_0x484929);
    _0x3eb683.appendChild(_0x3ff85e);
    return _0x3eb683;
  }