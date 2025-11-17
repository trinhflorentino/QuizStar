let introRef = null;
const containers = document.querySelectorAll(".file-upload-container");
auth.onAuthStateChanged(_0x1903fa => {
  if (!_0x1903fa) {
    return;
  }
  introRef = firestoreDB.collection("Intro").doc(auth.currentUser.uid);
  introRef.onSnapshot(_0xf5a272 => {
    const _0xb787ed = document.getElementById("introSelection");
    const _0x229246 = document.getElementById('introSettings');
    if (_0xf5a272.exists) {
      const _0x2293db = _0xf5a272.data();
      _0x229246.style.display = "block";
      document.getElementById("DisplayIntroToContestantSwitch").checked = _0x2293db.isDisplayIntroToContestant || false;
      document.getElementById("UseCustomIntroSwitch").checked = _0x2293db.isUsingCustomIntro || false;
      if (_0x2293db.isUsingCustomIntro == true) {
        document.querySelector(".custom-video").style.display = "block";
      } else {
        document.querySelector('.custom-video').style.display = "none";
      }
      _0xb787ed.style.display = "none";
    } else {
      _0xb787ed.style.display = 'flex';
      _0x229246.style.display = "none";
    }
  });
  syncSwitchesWithFirestore();
  containers.forEach(_0x2d9616 => {
    _0x2d9616.addEventListener('click', _0x449393 => {
      const _0xb24c3 = _0x2d9616.getAttribute("data-competition-stage");
      const _0x1341d2 = document.querySelector("video[data-competition-stage=\"" + _0xb24c3 + "\"]");
      if (_0x449393.target.classList.contains('upload-button')) {
        const _0x19fba7 = _0x2d9616.querySelector(".file-upload-input");
        const _0x185972 = _0x19fba7.files[0x0];
        if (!_0x185972) {
          failToast("Vui lòng chọn file trước khi tải lên.", 0xbb8, 'top', "right", true, false, '');
          return;
        }
        const _0x2288d0 = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0xb24c3 + ".mp4");
        const _0x349761 = _0x2288d0.put(_0x185972);
        loadingAnimation.show("Đang tải video cho " + _0xb24c3 + " lên...");
        _0x349761.on("state_changed", _0x331c66 => {
          const _0xd5a766 = _0x331c66.bytesTransferred / _0x331c66.totalBytes * 0x64;
          loadingAnimation.updateMessage("Đang tải video cho " + _0xb24c3 + " lên... (" + Math.round(_0xd5a766) + '%)');
        }, _0x99aae6 => {
          loadingAnimation.hide();
          failToast("Tải lên thất bại.", 0xbb8, 'top', "right", true, false, '');
        }, () => {
          loadingAnimation.hide();
          _0x349761.snapshot.ref.getDownloadURL().then(_0x59c553 => {
            introRef.update({
              [_0xb24c3 + "VideoUrl"]: _0x59c553
            }).then(() => successToast("Tải lên video cho " + _0xb24c3 + " thành công.", 0xbb8, "top", "right", true, false, ''))['catch'](() => failToast("Tải lên thất bại.", 0xbb8, "top", "right", true, false, ''));
          });
        });
      }
      if (_0x449393.target.classList.contains('preview-button')) {
        const _0x1f2ca7 = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0xb24c3 + ".mp4");
        _0x1f2ca7.getDownloadURL().then(_0x3e043b => {
          _0x1341d2.src = _0x3e043b;
          _0x1341d2.play();
        })['catch'](_0x4ef5b8 => {
          console.log("Error fetching video URL:", _0x4ef5b8);
          failToast("Video này không tồn tại trên hệ thống.", 0xbb8, "top", 'right', true, false, '');
        });
      }
      if (_0x449393.target.classList.contains("delete-button")) {
        const _0x93dff1 = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0xb24c3 + '.mp4');
        const _0x26a532 = _0x1341d2.src;
        if (!_0x26a532) {
          failToast("Không có video để xóa. Bấm xem Video hiện tại trước khi thực hiện xoá.", 0xbb8, 'top', 'right', true, false, '');
          return;
        }
        if (confirm("Bạn có chắc chắn muốn xóa video này không?")) {
          _0x93dff1['delete']().then(() => {
            introRef.update({
              [_0xb24c3 + "VideoUrl"]: firebase.firestore.FieldValue["delete"]()
            }).then(() => successToast("Xóa video cho " + _0xb24c3 + " thành công.", 0xbb8, 'top', "right", true, false, ''))["catch"](() => failToast("Xóa video thất bại.", 0xbb8, 'top', "right", true, false, ''));
          })["catch"](() => failToast("Xóa video thất bại.", 0xbb8, "top", "right", true, false, ''));
        }
      }
    });
    _0x2d9616.addEventListener("change", _0x317648 => {
      if (_0x317648.target.classList.contains("file-upload-input")) {
        const _0x2582c3 = _0x317648.target;
        const _0x5a109d = _0x2d9616.querySelector('.file-name-display');
        const _0x1b1b4c = _0x2582c3.files.length ? _0x2582c3.files[0x0].name : "No file selected";
        _0x5a109d.textContent = "Đã chọn file: " + _0x1b1b4c;
        const _0x7c66ac = _0x2d9616.getAttribute("data-competition-stage");
        const _0x47c388 = document.querySelector("video[data-competition-stage=\"" + _0x7c66ac + "\"]");
        const _0xa7e49e = _0x2582c3.files[0x0];
        if (_0xa7e49e) {
          const _0x33162c = URL.createObjectURL(_0xa7e49e);
          _0x47c388.src = _0x33162c;
          _0x47c388.play();
        }
      }
    });
  });
  document.getElementById("addVideoBtn").addEventListener("click", async () => {
    const _0x3b972b = document.getElementById("videoName").value.trim();
    let _0x5e6414 = document.getElementById("videoURL").value.trim();
    if (!_0x3b972b || !_0x5e6414) {
      failToast("Vui lòng điền đầy đủ thông tin.", 0xbb8, "top", 'right', true, false, '');
      return;
    }
    const _0x4369a8 = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+(\?.*)?$/;
    const _0x3dcd84 = /^https?:\/\/.+\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i;
    if (!_0x4369a8.test(_0x5e6414) && !_0x3dcd84.test(_0x5e6414)) {
      failToast("Vui lòng nhập đường dẫn YouTube embed hợp lệ (https://www.youtube.com/embed/VIDEO_ID) hoặc đường dẫn video trực tiếp (.mp4, .webm, .ogg, .mov, .avi, .mkv).", 0x1770, "top", "right", true, false, '');
      return;
    }
    if (_0x5e6414.includes("youtube.com/embed") && !_0x5e6414.includes('autoplay=1')) {
      _0x5e6414 += _0x5e6414.includes('?') ? "&autoplay=1&controls=0&rel=0" : '?' + "&autoplay=1&controls=0&rel=0".substring(0x1);
    }
    const _0x21b77d = {
      'id': Date.now(),
      'name': _0x3b972b,
      'url': _0x5e6414
    };
    try {
      const _0x2a025d = await introRef.get();
      const _0x181952 = _0x2a025d.exists ? _0x2a025d.data() : {};
      const _0x41bdad = _0x181952.CustomVideo || [];
      _0x41bdad.push(_0x21b77d);
      await introRef.set({
        'CustomVideo': _0x41bdad
      }, {
        'merge': true
      });
      successToast("Thêm video thành công.", 0xbb8, "top", "right", true, false, '');
    } catch (_0x51dabe) {
      failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, '');
    }
    document.getElementById("videoName").value = '';
    document.getElementById('videoURL').value = '';
  });
  introRef.onSnapshot(_0x5d7f21 => {
    const _0x4073a7 = _0x5d7f21.exists ? _0x5d7f21.data() : {};
    const _0x4c679e = _0x4073a7.CustomVideo || [];
    const _0x1117ef = document.getElementById('videoTableBody');
    _0x1117ef.innerHTML = '';
    if (_0x4c679e.length === 0x0) {
      _0x1117ef.innerHTML = "\n        <tr>\n          <td colspan=\"4\" class=\"p-4 text-center\">Không có video nào được thêm</td>\n        </tr>";
      return;
    }
    _0x4c679e.forEach((_0xa7be18, _0x4fb523) => {
      const _0x357b64 = document.createElement('tr');
      _0x357b64.classList.add('even:bg-blue-gray-50/50');
      _0x357b64.innerHTML = "\n        <td class=\"p-4\">" + (_0x4fb523 + 0x1) + "</td>\n        <td class=\"p-4\">" + _0xa7be18.name + "</td>\n        <td class=\"p-4\"><a href=\"" + _0xa7be18.url + "\" target=\"_blank\">" + (_0xa7be18.url.length > 0x32 ? _0xa7be18.url.substring(0x0, 0x32) + "..." : _0xa7be18.url) + "</a></td>\n        <td class=\"p-4\">\n          <button class=\"bg-blue-500 dark:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300 mr-2 font-semibold watch-btn\">Xem trước</button>\n          <button class=\"bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-600 dark:hover:bg-yellow-600 transition duration-300 mr-2 font-semibold edit-btn\">Sửa đường dẫn</button>\n          <button class=\"bg-red-500 dark:bg-red-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 dark:hover:bg-red-500 transition duration-300 font-semibold delete-btn\">Xoá</button>\n        </td>\n      ";
      _0x357b64.querySelector(".watch-btn").addEventListener("click", () => {
        window.open(_0xa7be18.url, "_blank");
      });
      _0x357b64.querySelector('.edit-btn').addEventListener('click', async () => {
        let _0x27bcac = prompt("Sửa URL:", _0xa7be18.url);
        if (_0x27bcac !== null) {
          if (_0x27bcac.includes('youtube.com') && !_0x27bcac.includes("&autoplay=1&controls=0&rel=0")) {
            _0x27bcac += '&autoplay=1&controls=0&rel=0';
          }
          _0xa7be18.url = _0x27bcac;
          await introRef.update({
            'CustomVideo': _0x4c679e
          });
        }
      });
      _0x357b64.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Bạn có muốn xoá Video này không?")) {
          _0x4c679e.splice(_0x4fb523, 0x1);
          await introRef.update({
            'CustomVideo': _0x4c679e
          });
        }
      });
      _0x1117ef.appendChild(_0x357b64);
    });
  });
});
function syncSwitchesWithFirestore() {
  const _0x508f22 = document.getElementById("DisplayIntroToContestantSwitch");
  const _0x534ae3 = document.getElementById("UseCustomIntroSwitch");
  _0x508f22.addEventListener("change", () => {
    const _0x5e6e33 = _0x508f22.checked;
    introRef.update({
      'isDisplayIntroToContestant': _0x5e6e33
    }).then(() => successToast("Cập nhật trạng thái thành công.", 0xbb8, "top", "right", true, false, ''))["catch"](() => failToast("Thao tác thất bại.", 0xbb8, "top", 'right', true, false, ''));
  });
  _0x534ae3.addEventListener("change", () => {
    const _0x4e8fdb = _0x534ae3.checked;
    introRef.update({
      'isUsingCustomIntro': _0x4e8fdb
    }).then(() => successToast("Cập nhật trạng thái thành công.", 0xbb8, "top", "right", true, false, ''))["catch"](() => failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, ''));
  });
}
function changeIntroUsageType(_0x102c38) {
  introRef.set({
    'isUsingCustomIntro': _0x102c38,
    'isDisplayIntroToContestant': false
  }).then(() => {
    successToast("Bạn đã chọn loại sử dụng Intro thành công. Bạn có thể thay đổi tại cài đặt bên dưới.", 0x1388, "top", "right", true, false, '');
  })['catch'](_0x269be8 => {
    failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, '');
  });
}