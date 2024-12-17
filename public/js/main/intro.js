let introRef = null;
const containers = document.querySelectorAll(".file-upload-container");
auth.onAuthStateChanged(_0x4488c0 => {
  if (!_0x4488c0) {
    return;
  }
  introRef = firestoreDB.collection('Intro').doc(auth.currentUser.uid);
  introRef.onSnapshot(_0x3254be => {
    const _0x5e929d = document.getElementById("introSelection");
    const _0x363c69 = document.getElementById('introSettings');
    if (_0x3254be.exists) {
      const _0x173eb9 = _0x3254be.data();
      _0x363c69.style.display = "block";
      document.getElementById('DisplayIntroToContestantSwitch').checked = _0x173eb9.isDisplayIntroToContestant || false;
      document.getElementById("UseCustomIntroSwitch").checked = _0x173eb9.isUsingCustomIntro || false;
      if (_0x173eb9.isUsingCustomIntro == true) {
        document.querySelector(".custom-video").style.display = "block";
      } else {
        document.querySelector(".custom-video").style.display = "none";
      }
      _0x5e929d.style.display = "none";
    } else {
      _0x5e929d.style.display = "flex";
      _0x363c69.style.display = "none";
    }
  });
  syncSwitchesWithFirestore();
  containers.forEach(_0x5441a1 => {
    _0x5441a1.addEventListener("click", _0x5da642 => {
      const _0xb00896 = _0x5441a1.getAttribute("data-competition-stage");
      const _0x303460 = document.querySelector("video[data-competition-stage=\"" + _0xb00896 + "\"]");
      if (_0x5da642.target.classList.contains("upload-button")) {
        const _0x1b45fc = _0x5441a1.querySelector(".file-upload-input");
        const _0x499d6a = _0x1b45fc.files[0x0];
        if (!_0x499d6a) {
          failToast("Vui lòng chọn file trước khi tải lên.", 0xbb8, "top", "right", true, false, '');
          return;
        }
        const _0x49b32c = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0xb00896 + '.mp4');
        const _0x20580e = _0x49b32c.put(_0x499d6a);
        _0x20580e.on('state_changed', _0x5b7977 => {
          const _0x471da1 = _0x5b7977.bytesTransferred / _0x5b7977.totalBytes * 0x64;
          console.log("Upload is " + _0x471da1 + "% done");
        }, _0x42445b => {
          failToast("Tải lên thất bại.", 0xbb8, "top", "right", true, false, '');
        }, () => {
          _0x20580e.snapshot.ref.getDownloadURL().then(_0x2af7d4 => {
            introRef.update({
              [_0xb00896 + "VideoUrl"]: _0x2af7d4
            }).then(() => successToast("Tải lên video cho " + _0xb00896 + " thành công.", 0xbb8, 'top', "right", true, false, ''))["catch"](() => failToast("Tải lên thất bại.", 0xbb8, "top", "right", true, false, ''));
          });
        });
      }
      if (_0x5da642.target.classList.contains("preview-button")) {
        const _0x1233f2 = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0xb00896 + '.mp4');
        _0x1233f2.getDownloadURL().then(_0x2850b0 => {
          _0x303460.src = _0x2850b0;
          _0x303460.play();
        })["catch"](_0xf277ed => {
          console.log("Error fetching video URL:", _0xf277ed);
          failToast("Video này không tồn tại trên hệ thống.", 0xbb8, "top", "right", true, false, '');
        });
      }
      if (_0x5da642.target.classList.contains("delete-button")) {
        const _0x17453a = storage.ref('Intro/' + auth.currentUser.uid + '/' + _0xb00896);
        const _0x228af7 = _0x303460.src;
        if (!_0x228af7) {
          failToast("Không có video để xóa. Bấm xem Video hiện tại trước khi thực hiện xoá.", 0xbb8, "top", 'right', true, false, '');
          return;
        }
        if (confirm("Bạn có chắc chắn muốn xóa video này không?")) {
          _0x17453a['delete']().then(() => {
            introRef.update({
              [_0xb00896 + 'VideoUrl']: firebase.firestore.FieldValue['delete']()
            }).then(() => successToast("Xóa video cho " + _0xb00896 + " thành công.", 0xbb8, "top", "right", true, false, ''))["catch"](() => failToast("Xóa video thất bại.", 0xbb8, "top", "right", true, false, ''));
          })['catch'](() => failToast("Xóa video thất bại.", 0xbb8, "top", "right", true, false, ''));
        }
      }
    });
    _0x5441a1.addEventListener('change', _0x2794f7 => {
      if (_0x2794f7.target.classList.contains('file-upload-input')) {
        const _0x4d3701 = _0x2794f7.target;
        const _0x11b48e = _0x5441a1.querySelector(".file-name-display");
        const _0x2dcd2e = _0x4d3701.files.length ? _0x4d3701.files[0x0].name : "No file selected";
        _0x11b48e.textContent = "Đã chọn file: " + _0x2dcd2e;
        const _0x40f9cd = document.querySelector("video[data-competition-stage=\"" + competitionStage + "\"]");
        const _0x250233 = _0x4d3701.files[0x0];
        if (_0x250233) {
          const _0x1eaadc = URL.createObjectURL(_0x250233);
          _0x40f9cd.src = _0x1eaadc;
          _0x40f9cd.play();
        }
      }
    });
  });
  document.getElementById('addVideoBtn').addEventListener("click", async () => {
    const _0x393d46 = document.getElementById('videoName').value.trim();
    let _0x255a04 = document.getElementById('videoURL').value.trim();
    if (!_0x393d46 || !_0x255a04) {
      failToast("Vui lòng điền đầy đủ thông tin.", 0xbb8, 'top', "right", true, false, '');
      return;
    }
    if (_0x255a04.includes("youtube.com") && !_0x255a04.includes("&autoplay=1&controls=0&rel=0")) {
      _0x255a04 += "&autoplay=1&controls=0&rel=0";
    }
    const _0x2f7c54 = {
      'id': Date.now(),
      'name': _0x393d46,
      'url': _0x255a04
    };
    try {
      const _0x2839a2 = await introRef.get();
      const _0x3613f6 = _0x2839a2.exists ? _0x2839a2.data() : {};
      const _0x4596ff = _0x3613f6.CustomVideo || [];
      _0x4596ff.push(_0x2f7c54);
      await introRef.set({
        'CustomVideo': _0x4596ff
      }, {
        'merge': true
      });
      successToast("Thêm video thành công.", 0xbb8, "top", "right", true, false, '');
    } catch (_0x313406) {
      failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, '');
    }
    document.getElementById("videoName").value = '';
    document.getElementById("videoURL").value = '';
  });
  introRef.onSnapshot(_0x2a132c => {
    const _0x5ee5ad = _0x2a132c.exists ? _0x2a132c.data() : {};
    const _0x4072fe = _0x5ee5ad.CustomVideo || [];
    const _0x7f05b8 = document.getElementById('videoTableBody');
    _0x7f05b8.innerHTML = '';
    if (_0x4072fe.length === 0x0) {
      _0x7f05b8.innerHTML = "\n        <tr>\n          <td colspan=\"4\" class=\"p-4 text-center\">Không có video nào được thêm</td>\n        </tr>";
      return;
    }
    _0x4072fe.forEach((_0x574b47, _0x48e849) => {
      const _0x165a09 = document.createElement('tr');
      _0x165a09.classList.add('even:bg-blue-gray-50/50');
      _0x165a09.innerHTML = "\n        <td class=\"p-4\">" + (_0x48e849 + 0x1) + "</td>\n        <td class=\"p-4\">" + _0x574b47.name + "</td>\n        <td class=\"p-4\"><a href=\"" + _0x574b47.url + "\" target=\"_blank\">" + (_0x574b47.url.length > 0x32 ? _0x574b47.url.substring(0x0, 0x32) + '...' : _0x574b47.url) + "</a></td>\n        <td class=\"p-4\">\n          <button class=\"bg-blue-500 dark:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300 mr-2 font-semibold watch-btn\">Xem trước</button>\n          <button class=\"bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-600 dark:hover:bg-yellow-600 transition duration-300 mr-2 font-semibold edit-btn\">Sửa đường dẫn</button>\n          <button class=\"bg-red-500 dark:bg-red-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 dark:hover:bg-red-500 transition duration-300 font-semibold delete-btn\">Xoá</button>\n        </td>\n      ";
      _0x165a09.querySelector(".watch-btn").addEventListener('click', () => {
        window.open(_0x574b47.url, "_blank");
      });
      _0x165a09.querySelector('.edit-btn').addEventListener("click", async () => {
        let _0x2179fb = prompt("Sửa URL:", _0x574b47.url);
        if (_0x2179fb !== null) {
          if (_0x2179fb.includes("youtube.com") && !_0x2179fb.includes("&autoplay=1&controls=0&rel=0")) {
            _0x2179fb += "&autoplay=1&controls=0&rel=0";
          }
          _0x574b47.url = _0x2179fb;
          await introRef.update({
            'CustomVideo': _0x4072fe
          });
        }
      });
      _0x165a09.querySelector('.delete-btn').addEventListener("click", async () => {
        if (confirm("Bạn có muốn xoá Video này không?")) {
          _0x4072fe.splice(_0x48e849, 0x1);
          await introRef.update({
            'CustomVideo': _0x4072fe
          });
        }
      });
      _0x7f05b8.appendChild(_0x165a09);
    });
  });
});
function syncSwitchesWithFirestore() {
  const _0x20faea = document.getElementById("DisplayIntroToContestantSwitch");
  const _0x27e268 = document.getElementById('UseCustomIntroSwitch');
  _0x20faea.addEventListener("change", () => {
    const _0x275170 = _0x20faea.checked;
    introRef.update({
      'isDisplayIntroToContestant': _0x275170
    }).then(() => successToast("Cập nhật trạng thái thành công.", 0xbb8, "top", "right", true, false, ''))["catch"](() => failToast("Thao tác thất bại.", 0xbb8, 'top', "right", true, false, ''));
  });
  _0x27e268.addEventListener("change", () => {
    const _0x409b4d = _0x27e268.checked;
    introRef.update({
      'isUsingCustomIntro': _0x409b4d
    }).then(() => successToast("Cập nhật trạng thái thành công.", 0xbb8, "top", 'right', true, false, ''))["catch"](() => failToast("Thao tác thất bại.", 0xbb8, 'top', "right", true, false, ''));
  });
}
function changeIntroUsageType(_0x4001ed) {
  introRef.set({
    'isUsingCustomIntro': _0x4001ed,
    'isDisplayIntroToContestant': false
  }).then(() => {
    successToast("Bạn đã chọn loại sử dụng Intro thành công. Bạn có thể thay đổi tại cài đặt bên dưới.", 0x1388, 'top', 'right', true, false, '');
  })["catch"](_0x5f34d3 => {
    failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, '');
  });
}