let selectedItem = null;
auth.onAuthStateChanged(_0x3a2b99 => {
  if (!_0x3a2b99) {
    return;
  }
  const _0x4725c1 = firestoreDB.collection('match').doc(auth.currentUser.uid);
  _0x4725c1.onSnapshot(_0x313886 => {
    if (!_0x313886.exists) {
      return;
    }
    const _0x1a743e = _0x313886.data().match;
    const _0x2804a1 = realtimeDB.ref(_0x1a743e + "/games");
    const _0x1d579c = realtimeDB.ref(_0x1a743e + '/Participant');
    _0x2804a1.on('value', _0x34fb17 => {
      const _0x4eda1 = _0x34fb17.val();
      const _0x5b3044 = document.getElementById("competition-container");
      _0x5b3044.innerHTML = '';
      for (let _0x555abf = 0x1; _0x555abf <= 0x4; _0x555abf++) {
        const _0x8445fd = _0x4eda1["player" + _0x555abf];
        if (_0x8445fd) {
          const _0x18a5e7 = "Thí sinh " + _0x555abf;
          const _0x42ab91 = createCompetitionItem(_0x8445fd.uid, _0x8445fd.displayName, _0x18a5e7, _0x555abf);
          _0x5b3044.appendChild(_0x42ab91);
        }
      }
      addExtraItems(_0x5b3044);
      addSelectItemListeners();
    });
    document.getElementById("joinMatchButton").addEventListener('click', function () {
      if (!selectedItem) {
        failToast("Chọn một vị trí trước khi vào trận đấu");
        return;
      }
      const _0x53e336 = parseInt(selectedItem.getAttribute("data-value"), 0xa);
      if (_0x53e336 === 0x7) {
        location.replace('Scoreboard.html');
        return;
      }
      _0x1d579c.orderByChild('uid').equalTo(auth.currentUser.uid).once("value", function (_0x2b2e94) {
        if (_0x2b2e94.exists()) {
          const _0x112d0d = _0x2b2e94.val();
          const _0x5e854a = Object.values(_0x112d0d)[0x0]?.["requestStatus"];
          if (_0x5e854a === 0x1) {
            _0xcddbba(_0x53e336);
          } else {
            if (_0x5e854a === 0x3) {
              failToast("Bạn đã bị chặn bởi chủ phòng");
            } else {
              if (_0x5e854a === 0x2) {
                failToast("Bạn đã bị từ chối");
                const _0x222eec = Object.keys(_0x112d0d)[0x0];
                _0x1d579c.child(_0x222eec).remove();
              } else {
                failToast("Yêu cầu của bạn đang chờ xử lý");
              }
            }
          }
        } else {
          _0x4c800b(_0x53e336);
        }
      });
    });
    function _0xcddbba(_0x21d1eb) {
      if (_0x21d1eb === 0x6) {
        location.replace("MC.html");
        localStorage.setItem('id', 0x7);
      } else if (_0x21d1eb === 0x5) {
        successToast("Tham gia trận đấu thành công.");
        localStorage.setItem('id', 0x5);
        setTimeout(() => {
          location.replace('Projector.html');
        }, 0xbb8);
      } else {
        failToast("Bạn đã tham gia ở một vai trò khác.");
      }
    }
    function _0x4c800b(_0x3b9d04) {
      console.log(_0x3b9d04);
      if (_0x3b9d04 < 0x5) {
        const _0x4c10b1 = realtimeDB.ref(_0x1a743e + "/games/player" + _0x3b9d04);
        _0x4c10b1.once("value", function (_0x5b693b) {
          const _0x512287 = _0x5b693b.val();
          if (!_0x512287 || _0x512287.uid === '') {
            successToast("Đã tham gia trận đấu");
            _0x4c10b1.set({
              'uid': auth.currentUser.uid,
              'displayName': auth.currentUser.displayName,
              'id': _0x3b9d04
            });
            setItemRendering();
            localStorage.setItem('id', _0x3b9d04);
            setTimeout(() => {
              location.replace("Ingame.html");
            }, 0xbb8);
          } else if (_0x512287.uid === auth.currentUser.uid) {
            successToast("Đã tham gia trận đấu");
            _0x4c10b1.update({
              'id': _0x3b9d04
            });
            setItemRendering();
            localStorage.setItem('id', _0x3b9d04);
            setTimeout(() => {
              location.replace("Ingame.html");
            }, 0xbb8);
          } else {
            failToast("Vị trí đã được chọn");
          }
        });
      } else {
        _0x1d579c.push({
          'uid': auth.currentUser.uid,
          'displayName': auth.currentUser.displayName,
          'role': '',
          'requestStatus': 0x0
        }).then(() => {
          successToast("Đã gửi yêu cầu tham gia trận đấu");
        });
      }
    }
  });
});
function addSelectItemListeners() {
  const _0x5c6c05 = document.querySelectorAll(".competition-item");
  _0x5c6c05.forEach(_0x12c511 => {
    _0x12c511.addEventListener("click", function () {
      const _0x48b535 = localStorage.getItem("mode");
      if (selectedItem) {
        selectedItem.classList.remove("bg-blue-100", "text-blue-800", "dark:bg-gray-700", "dark:text-gray-200");
      }
      selectedItem = _0x12c511;
      if (_0x48b535 === "dark") {
        selectedItem.classList.add("dark:bg-gray-700", "dark:text-gray-200");
      } else {
        selectedItem.classList.add('bg-blue-100', 'text-blue-800');
      }
    });
  });
}
function createCompetitionItem(_0x143afd, _0x5c1ad9, _0x1b6166, _0x55f049) {
  const _0x50fbcd = document.createElement("div");
  _0x50fbcd.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all";
  _0x50fbcd.setAttribute("data-value", _0x55f049);
  const _0xc6c118 = document.createElement("div");
  _0xc6c118.className = "flex items-center space-x-2";
  const _0x17b493 = document.createElement("img");
  _0x17b493.className = "relative inline-block h-10 w-10 !rounded-full object-cover object-center";
  fetchUserAvatar(_0x143afd).then(_0x361f4a => {
    _0x17b493.src = _0x361f4a;
  })["catch"](() => {});
  const _0x468a93 = document.createElement('p');
  _0x468a93.className = "dark:text-white font-semibold";
  _0x468a93.textContent = _0x5c1ad9;
  _0xc6c118.appendChild(_0x17b493);
  _0xc6c118.appendChild(_0x468a93);
  _0x50fbcd.appendChild(_0xc6c118);
  const _0x48f59b = document.createElement('p');
  _0x48f59b.className = "font-semibold dark:text-white";
  _0x48f59b.textContent = _0x1b6166;
  _0x50fbcd.appendChild(_0x48f59b);
  return _0x50fbcd;
}
function fetchUserAvatar(_0x38cd11) {
  return new Promise((_0x44c7ca, _0x45435c) => {
    firebase.storage().ref('users/' + _0x38cd11 + "/profile.jpg").getDownloadURL().then(_0x75ace1 => {
      _0x44c7ca(_0x75ace1);
    })["catch"](_0x52abfe => {
      firebase.storage().ref("users/profile.jpg").getDownloadURL().then(_0x16a3b6 => {
        _0x44c7ca(_0x16a3b6);
      })["catch"](_0x45435c);
    });
  });
}
function addExtraItems(_0x57c160) {
  const _0x1df479 = document.createElement("div");
  _0x1df479.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all font-semibold dark:text-white";
  _0x1df479.textContent = 'MC';
  _0x1df479.setAttribute("data-value", 0x6);
  _0x57c160.appendChild(_0x1df479);
  const _0x41a9ca = document.createElement('div');
  _0x41a9ca.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all font-semibold dark:text-white";
  _0x41a9ca.textContent = "Người xem";
  _0x41a9ca.setAttribute("data-value", 0x5);
  _0x57c160.appendChild(_0x41a9ca);
  const _0x55d4b0 = document.createElement("div");
  _0x55d4b0.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all font-semibold dark:text-white";
  _0x55d4b0.textContent = "Bảng điểm";
  _0x55d4b0.setAttribute("data-value", 0x7);
  _0x57c160.appendChild(_0x55d4b0);
}
function setItemRendering() {
  localStorage.setItem("isProjector", "false");
  localStorage.setItem('isGreenBackground', "false");
  localStorage.setItem('isDisplayAvatar', 'true');
}