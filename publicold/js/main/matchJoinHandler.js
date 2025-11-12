let selectedItem = null;
auth.onAuthStateChanged(_0xc4d60b => {
  if (!_0xc4d60b) {
    return;
  }
  const _0x4f537f = firestoreDB.collection("match").doc(auth.currentUser.uid);
  _0x4f537f.onSnapshot(_0x5479a1 => {
    if (!_0x5479a1.exists) {
      return;
    }
    const _0x35ff39 = _0x5479a1.data().match;
    const _0x5ec9f8 = realtimeDB.ref(_0x35ff39 + "/games");
    const _0x5eef25 = realtimeDB.ref(_0x35ff39 + '/Participant');
    _0x5ec9f8.on('value', _0x27a3d5 => {
      const _0x367514 = _0x27a3d5.val();
      const _0x1533c7 = document.getElementById("competition-container");
      _0x1533c7.innerHTML = '';
      for (let _0x1fd2f7 = 0x1; _0x1fd2f7 <= 0x4; _0x1fd2f7++) {
        const _0xbbfdb4 = _0x367514['player' + _0x1fd2f7];
        if (_0xbbfdb4) {
          const _0x3f4a65 = "Thí sinh " + _0x1fd2f7;
          const _0x58f220 = createCompetitionItem(_0xbbfdb4.uid, _0xbbfdb4.displayName, _0x3f4a65, _0x1fd2f7);
          _0x1533c7.appendChild(_0x58f220);
        }
      }
      addExtraItems(_0x1533c7);
      addSelectItemListeners();
    });
    document.getElementById("joinMatchButton").addEventListener("click", function () {
      if (!selectedItem) {
        failToast("Chọn một vị trí trước khi vào phòng trò chơi");
        return;
      }
      const _0x2a0fd4 = parseInt(selectedItem.getAttribute("data-value"), 0xa);
      _0x5eef25.orderByChild("uid").equalTo(auth.currentUser.uid).once('value', function (_0x160670) {
        if (_0x160670.exists()) {
          const _0x44eb49 = _0x160670.val();
          const _0x3999e5 = Object.values(_0x44eb49)[0x0]?.["requestStatus"];
          if (_0x3999e5 === 0x1) {
            _0x5c34d0(_0x2a0fd4);
          } else {
            if (_0x3999e5 === 0x3) {
              failToast("Bạn đã bị chặn bởi chủ phòng");
            } else {
              if (_0x3999e5 === 0x2) {
                failToast("Bạn đã bị từ chối");
                const _0x211c4a = Object.keys(_0x44eb49)[0x0];
                _0x5eef25.child(_0x211c4a).remove();
              } else {
                failToast("Yêu cầu của bạn đang chờ xử lý");
              }
            }
          }
        } else {
          _0x3419a0(_0x2a0fd4);
        }
      });
    });
    function _0x5c34d0(_0x22058e) {
      if (_0x22058e === 0x6) {
        location.replace('MC.html');
        localStorage.setItem('id', 0x7);
      } else {
        if (_0x22058e === 0x5) {
          _0x305f1e();
        } else if (_0x22058e === 0x7) {
          location.replace("Scoreboard.html");
        } else {
          failToast("Bạn đã tham gia ở một vai trò khác.");
        }
      }
    }
    function _0x305f1e() {
      const _0x3a86d9 = confirm("Đây có phải là máy chiếu không?");
      localStorage.setItem("isProjector", _0x3a86d9);
      if (_0x3a86d9) {
        const _0x53a8a9 = confirm("Bạn có muốn sử dụng nền xanh không?");
        localStorage.setItem('isGreenBackground', _0x53a8a9);
        const _0x21db34 = confirm("Bạn có muốn hiển thị Avatar thí sinh không?");
        localStorage.setItem("isDisplayAvatar", _0x21db34);
      } else {
        localStorage.setItem("isGreenBackground", false);
        localStorage.setItem("isDisplayAvatar", true);
      }
      successToast("Tham gia phòng trò chơi thành công.");
      localStorage.setItem('id', 0x5);
      setTimeout(() => {
        location.replace("Room.html");
      }, 0xbb8);
    }
    function _0x3419a0(_0x2df6ad) {
      console.log(_0x2df6ad);
      if (_0x2df6ad < 0x5) {
        const _0x217b0e = realtimeDB.ref(_0x35ff39 + '/games/player' + _0x2df6ad);
        _0x217b0e.once("value", function (_0x905321) {
          const _0x490c66 = _0x905321.val();
          if (!_0x490c66 || _0x490c66.uid === '' || _0x490c66.uid === auth.currentUser.uid) {
            successToast("Đã tham gia phòng trò chơi");
            _0x217b0e.set({
              'uid': auth.currentUser.uid,
              'displayName': auth.currentUser.displayName,
              'id': _0x2df6ad
            });
            setItemRendering();
            localStorage.setItem('id', _0x2df6ad);
            setTimeout(() => {
              location.replace("Room.html");
            }, 0xbb8);
          } else {
            failToast("Vị trí đã được chọn");
          }
        });
      } else {
        _0x5eef25.push({
          'uid': auth.currentUser.uid,
          'displayName': auth.currentUser.displayName,
          'role': '',
          'requestStatus': 0x0
        }).then(() => {
          successToast("Đã gửi yêu cầu tham gia phòng trò chơi");
        });
      }
    }
  });
});
function addSelectItemListeners() {
  const _0x320503 = document.querySelectorAll(".competition-item");
  _0x320503.forEach(_0x5c08ae => {
    _0x5c08ae.addEventListener("click", function () {
      const _0x471e58 = localStorage.getItem("mode");
      if (selectedItem) {
        selectedItem.classList.remove("bg-blue-100", "text-blue-800", "dark:bg-gray-700", 'dark:text-gray-200');
      }
      selectedItem = _0x5c08ae;
      if (_0x471e58 === "dark") {
        selectedItem.classList.add("dark:bg-gray-700", "dark:text-gray-200");
      } else {
        selectedItem.classList.add('bg-blue-100', "text-blue-800");
      }
    });
  });
}
function createCompetitionItem(_0xef9f20, _0x239e48, _0x33ae5e, _0x1f8994) {
  const _0x12c2ca = document.createElement("div");
  _0x12c2ca.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all";
  _0x12c2ca.setAttribute("data-value", _0x1f8994);
  const _0x1f28d9 = document.createElement("div");
  _0x1f28d9.className = "flex items-center space-x-2";
  const _0x1c438c = document.createElement('img');
  _0x1c438c.className = "relative inline-block h-10 w-10 !rounded-full object-cover object-center";
  fetchUserAvatar(_0xef9f20).then(_0x1ebd83 => {
    _0x1c438c.src = _0x1ebd83;
  })["catch"](() => {});
  const _0x294ae9 = document.createElement('p');
  _0x294ae9.className = "dark:text-white font-semibold";
  _0x294ae9.textContent = _0x239e48;
  _0x1f28d9.appendChild(_0x1c438c);
  _0x1f28d9.appendChild(_0x294ae9);
  _0x12c2ca.appendChild(_0x1f28d9);
  const _0x5309c7 = document.createElement('p');
  _0x5309c7.className = "font-semibold dark:text-white";
  _0x5309c7.textContent = _0x33ae5e;
  _0x12c2ca.appendChild(_0x5309c7);
  return _0x12c2ca;
}
function fetchUserAvatar(_0x5adcda) {
  return new Promise((_0x163b31, _0x759323) => {
    firebase.storage().ref("users/" + _0x5adcda + '/profile.jpg').getDownloadURL().then(_0x5c4d28 => {
      _0x163b31(_0x5c4d28);
    })["catch"](_0x30320b => {
      firebase.storage().ref("users/profile.jpg").getDownloadURL().then(_0x19086d => {
        _0x163b31(_0x19086d);
      })["catch"](_0x759323);
    });
  });
}
function addExtraItems(_0x13a443) {
  const _0x4c5190 = document.createElement("div");
  _0x4c5190.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all font-semibold dark:text-white";
  _0x4c5190.textContent = 'MC';
  _0x4c5190.setAttribute("data-value", 0x6);
  _0x13a443.appendChild(_0x4c5190);
  const _0x4c5daf = document.createElement('div');
  _0x4c5daf.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all font-semibold dark:text-white";
  _0x4c5daf.textContent = "Người xem";
  _0x4c5daf.setAttribute('data-value', 0x5);
  _0x13a443.appendChild(_0x4c5daf);
  const _0x322b7c = document.createElement("div");
  _0x322b7c.className = "competition-item flex justify-between items-center cursor-pointer text-slate-800 p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all font-semibold dark:text-white";
  _0x322b7c.textContent = "Bảng điểm";
  _0x322b7c.setAttribute("data-value", 0x7);
  _0x13a443.appendChild(_0x322b7c);
}
function setItemRendering() {
  localStorage.setItem("isProjector", "false");
  localStorage.setItem("isGreenBackground", "false");
  localStorage.setItem("isDisplayAvatar", "true");
}