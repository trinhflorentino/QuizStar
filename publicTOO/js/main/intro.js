let introRef = null;
const containers = document.querySelectorAll(".file-upload-container");
auth.onAuthStateChanged(_0x1e6af3 => {
  if (!_0x1e6af3) {
    return;
  }
  introRef = firestoreDB.collection("Intro").doc(auth.currentUser.uid);
  introRef.onSnapshot(_0x159bda => {
    const _0x47b547 = document.getElementById("introSelection");
    const _0x152ab8 = document.getElementById("introSettings");
    if (_0x159bda.exists) {
      const _0x2640ac = _0x159bda.data();
      _0x152ab8.style.display = "block";
      document.getElementById("DisplayIntroToContestantSwitch").checked = _0x2640ac.isDisplayIntroToContestant || false;
      document.getElementById("UseCustomIntroSwitch").checked = _0x2640ac.isUsingCustomIntro || false;
      if (_0x2640ac.isUsingCustomIntro == true) {
        document.querySelector(".custom-video").style.display = "block";
      } else {
        document.querySelector(".custom-video").style.display = "none";
      }
      _0x47b547.style.display = 'none';
    } else {
      _0x47b547.style.display = 'flex';
      _0x152ab8.style.display = "none";
    }
  });
  syncSwitchesWithFirestore();
  containers.forEach(_0x40e5bb => {
    _0x40e5bb.addEventListener('click', _0x673a70 => {
      const _0x4cfeed = _0x40e5bb.getAttribute("data-competition-stage");
      const _0x153589 = document.querySelector("video[data-competition-stage=\"" + _0x4cfeed + "\"]");
      if (_0x673a70.target.classList.contains('upload-button')) {
        const _0x4144c2 = _0x40e5bb.querySelector(".file-upload-input");
        const _0x462575 = _0x4144c2.files[0x0];
        if (!_0x462575) {
          failToast("Vui lòng chọn file trước khi tải lên.", 0xbb8, 'top', "right", true, false, '');
          return;
        }
        const _0x41bde9 = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0x4cfeed + ".mp4");
        const _0x2d95e3 = _0x41bde9.put(_0x462575);
        _0x2d95e3.on('state_changed', _0x46ef0e => {
          const _0x5d8fba = _0x46ef0e.bytesTransferred / _0x46ef0e.totalBytes * 0x64;
          console.log("Upload is " + _0x5d8fba + "% done");
        }, _0x530b3e => {
          failToast("Tải lên thất bại.", 0xbb8, 'top', "right", true, false, '');
        }, () => {
          _0x2d95e3.snapshot.ref.getDownloadURL().then(_0x2c4945 => {
            introRef.update({
              [_0x4cfeed + "VideoUrl"]: _0x2c4945
            }).then(() => successToast("Tải lên video cho " + _0x4cfeed + " thành công.", 0xbb8, "top", 'right', true, false, ''))['catch'](() => failToast("Tải lên thất bại.", 0xbb8, "top", "right", true, false, ''));
          });
        });
      }
      if (_0x673a70.target.classList.contains("preview-button")) {
        const _0x40d416 = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0x4cfeed + ".mp4");
        _0x40d416.getDownloadURL().then(_0x465eef => {
          _0x153589.src = _0x465eef;
          _0x153589.play();
        })["catch"](_0x2ddc13 => {
          console.log("Error fetching video URL:", _0x2ddc13);
          failToast("Video này không tồn tại trên hệ thống.", 0xbb8, 'top', 'right', true, false, '');
        });
      }
      if (_0x673a70.target.classList.contains('delete-button')) {
        const _0x1b9eef = storage.ref("Intro/" + auth.currentUser.uid + '/' + _0x4cfeed);
        const _0x420996 = _0x153589.src;
        if (!_0x420996) {
          failToast("Không có video để xóa. Bấm xem Video hiện tại trước khi thực hiện xoá.", 0xbb8, "top", "right", true, false, '');
          return;
        }
        if (confirm("Bạn có chắc chắn muốn xóa video này không?")) {
          _0x1b9eef["delete"]().then(() => {
            introRef.update({
              [_0x4cfeed + "VideoUrl"]: firebase.firestore.FieldValue["delete"]()
            }).then(() => successToast("Xóa video cho " + _0x4cfeed + " thành công.", 0xbb8, 'top', "right", true, false, ''))['catch'](() => failToast("Xóa video thất bại.", 0xbb8, "top", "right", true, false, ''));
          })["catch"](() => failToast("Xóa video thất bại.", 0xbb8, "top", "right", true, false, ''));
        }
      }
    });
    _0x40e5bb.addEventListener('change', _0xcefe6d => {
      if (_0xcefe6d.target.classList.contains('file-upload-input')) {
        const _0x2e33c1 = _0xcefe6d.target;
        const _0xe5f6ff = _0x40e5bb.querySelector(".file-name-display");
        const _0x473cce = _0x2e33c1.files.length ? _0x2e33c1.files[0x0].name : "No file selected";
        _0xe5f6ff.textContent = "Đã chọn file: " + _0x473cce;
        const _0x381e89 = document.querySelector("video[data-competition-stage=\"" + competitionStage + "\"]");
        const _0x3568e4 = _0x2e33c1.files[0x0];
        if (_0x3568e4) {
          const _0x3bf8a8 = URL.createObjectURL(_0x3568e4);
          _0x381e89.src = _0x3bf8a8;
          _0x381e89.play();
        }
      }
    });
  });
  document.getElementById("addVideoBtn").addEventListener("click", async () => {
    const _0x253f20 = document.getElementById("videoName").value.trim();
    let _0x42a3e5 = document.getElementById("videoURL").value.trim();
    if (!_0x253f20 || !_0x42a3e5) {
      failToast("Vui lòng điền đầy đủ thông tin.", 0xbb8, "top", "right", true, false, '');
      return;
    }
    if (_0x42a3e5.includes("youtube.com") && !_0x42a3e5.includes("&autoplay=1&controls=0&rel=0")) {
      _0x42a3e5 += "&autoplay=1&controls=0&rel=0";
    }
    const _0x4e4c12 = {
      'id': Date.now(),
      'name': _0x253f20,
      'url': _0x42a3e5
    };
    try {
      const _0x1645c2 = await introRef.get();
      const _0x113ad5 = _0x1645c2.exists ? _0x1645c2.data() : {};
      const _0x1af385 = _0x113ad5.CustomVideo || [];
      _0x1af385.push(_0x4e4c12);
      await introRef.set({
        'CustomVideo': _0x1af385
      }, {
        'merge': true
      });
      successToast("Thêm video thành công.", 0xbb8, 'top', "right", true, false, '');
    } catch (_0xe7be44) {
      failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, '');
    }
    document.getElementById('videoName').value = '';
    document.getElementById("videoURL").value = '';
  });
  introRef.onSnapshot(_0x3a2d04 => {
    const _0x1c184f = _0x3a2d04.exists ? _0x3a2d04.data() : {};
    const _0x1c06ed = _0x1c184f.CustomVideo || [];
    const _0x41fe6b = document.getElementById("videoTableBody");
    _0x41fe6b.innerHTML = '';
    if (_0x1c06ed.length === 0x0) {
      _0x41fe6b.innerHTML = "\n        <tr>\n          <td colspan=\"4\" class=\"p-4 text-center\">Không có video nào được thêm</td>\n        </tr>";
      return;
    }
    _0x1c06ed.forEach((_0x1f86ed, _0x4c5402) => {
      const _0x5d91d9 = document.createElement('tr');
      _0x5d91d9.classList.add("even:bg-blue-gray-50/50");
      _0x5d91d9.innerHTML = "\n        <td class=\"p-4\">" + (_0x4c5402 + 0x1) + "</td>\n        <td class=\"p-4\">" + _0x1f86ed.name + "</td>\n        <td class=\"p-4\"><a href=\"" + _0x1f86ed.url + "\" target=\"_blank\">" + (_0x1f86ed.url.length > 0x32 ? _0x1f86ed.url.substring(0x0, 0x32) + "..." : _0x1f86ed.url) + "</a></td>\n        <td class=\"p-4\">\n          <button class=\"bg-blue-500 dark:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300 mr-2 font-semibold watch-btn\">Xem trước</button>\n          <button class=\"bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-600 dark:hover:bg-yellow-600 transition duration-300 mr-2 font-semibold edit-btn\">Sửa đường dẫn</button>\n          <button class=\"bg-red-500 dark:bg-red-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 dark:hover:bg-red-500 transition duration-300 font-semibold delete-btn\">Xoá</button>\n        </td>\n      ";
      _0x5d91d9.querySelector(".watch-btn").addEventListener("click", () => {
        window.open(_0x1f86ed.url, "_blank");
      });
      _0x5d91d9.querySelector(".edit-btn").addEventListener("click", async () => {
        let _0x360760 = prompt("Sửa URL:", _0x1f86ed.url);
        if (_0x360760 !== null) {
          if (_0x360760.includes("youtube.com") && !_0x360760.includes("&autoplay=1&controls=0&rel=0")) {
            _0x360760 += "&autoplay=1&controls=0&rel=0";
          }
          _0x1f86ed.url = _0x360760;
          await introRef.update({
            'CustomVideo': _0x1c06ed
          });
        }
      });
      _0x5d91d9.querySelector('.delete-btn').addEventListener("click", async () => {
        if (confirm("Bạn có muốn xoá Video này không?")) {
          _0x1c06ed.splice(_0x4c5402, 0x1);
          await introRef.update({
            'CustomVideo': _0x1c06ed
          });
        }
      });
      _0x41fe6b.appendChild(_0x5d91d9);
    });
  });
});
function syncSwitchesWithFirestore() {
  const _0x5edc07 = document.getElementById('DisplayIntroToContestantSwitch');
  const _0xc2f0a1 = document.getElementById("UseCustomIntroSwitch");
  _0x5edc07.addEventListener("change", () => {
    const _0x5282c2 = _0x5edc07.checked;
    introRef.update({
      'isDisplayIntroToContestant': _0x5282c2
    }).then(() => successToast("Cập nhật trạng thái thành công.", 0xbb8, "top", 'right', true, false, ''))['catch'](() => failToast("Thao tác thất bại.", 0xbb8, 'top', "right", true, false, ''));
  });
  _0xc2f0a1.addEventListener("change", () => {
    const _0x105fe1 = _0xc2f0a1.checked;
    introRef.update({
      'isUsingCustomIntro': _0x105fe1
    }).then(() => successToast("Cập nhật trạng thái thành công.", 0xbb8, 'top', 'right', true, false, ''))["catch"](() => failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, ''));
  });
}
function changeIntroUsageType(_0x54eeaf) {
  introRef.set({
    'isUsingCustomIntro': _0x54eeaf,
    'isDisplayIntroToContestant': false
  }).then(() => {
    successToast("Bạn đã chọn loại sử dụng Intro thành công. Bạn có thể thay đổi tại cài đặt bên dưới.", 0x1388, 'top', 'right', true, false, '');
  })["catch"](_0x193048 => {
    failToast("Thao tác thất bại.", 0xbb8, 'top', "right", true, false, '');
  });
}