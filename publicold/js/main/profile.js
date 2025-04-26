auth.onAuthStateChanged(_0x113d65 => {
    if (!_0x113d65) {
      return;
    }
    firebase.storage().ref("users/" + _0x113d65.uid + "/profile.jpg").getDownloadURL().then(_0x52907a => {
      document.getElementById('userAvatar').src = _0x52907a;
      document.getElementById("userProfileImage").src = _0x52907a;
    })["catch"](_0x6612a7 => {
      firebase.storage().ref("users/profile.jpg").getDownloadURL().then(_0x325cb6 => {
        document.getElementById("userAvatar").src = _0x325cb6;
        document.getElementById("userProfileImage").src = _0x325cb6;
      });
    });
    document.getElementById("userDisplayName").innerHTML = _0x113d65.displayName;
    document.getElementById("userNameInput").value = _0x113d65.displayName;
    if (_0x113d65.metadata.creationTime) {
      document.getElementById("joinDate").innerHTML = "Bạn đã tham gia QuizStar từ ngày " + convertToDDMMYYYY(_0x113d65.metadata.creationTime);
    }
  });
  function convertToDDMMYYYY(_0x4c1e78) {
    const _0x63bd21 = new Date(_0x4c1e78);
    const _0x55c3ab = new Date(_0x63bd21.getTime() + 25200000);
    const _0x3ff62b = String(_0x55c3ab.getDate()).padStart(0x2, '0');
    const _0x5a4641 = String(_0x55c3ab.getMonth() + 0x1).padStart(0x2, '0');
    const _0x5e29c7 = _0x55c3ab.getFullYear();
    return _0x3ff62b + '/' + _0x5a4641 + '/' + _0x5e29c7;
  }
  const nameChangeForm = document.getElementById("nameChangeForm");
  nameChangeForm.addEventListener("submit", _0x4a78d3 => {
    _0x4a78d3.preventDefault();
    const _0x49581a = document.getElementById('userNameInput').value;
    if (_0x49581a === '') {
      failToast("Họ và tên không được để trống", 0xbb8, "top", 'right', true, false, '');
      return;
    }
    const _0x320aad = auth.currentUser;
    _0x320aad.updateProfile({
      'displayName': _0x49581a
    }).then(() => {
      successToast("Đổi họ và tên thành công", 0xbb8, "top", 'right', true, false, '');
      document.getElementById('userDisplayName').innerHTML = _0x49581a;
    })["catch"](_0x4fda61 => {
      failToast("Đổi họ và tên thất bại", 0xbb8, "top", "right", true, false, '');
    });
  });
  const passwordChangeForm = document.getElementById("passwordChangeForm");
  passwordChangeForm.addEventListener("submit", _0x3a4ba4 => {
    _0x3a4ba4.preventDefault();
    const _0x33a6d8 = document.getElementById("currentPassword").value;
    const _0x53ed92 = document.getElementById("newPassword").value;
    const _0x4e2907 = document.getElementById('confirmPassword').value;
    if (_0x53ed92 !== _0x4e2907) {
      failToast("Mật khẩu mới không khớp", 0xbb8, "top", "right", true, false, '');
      return;
    }
    const _0x1a20bf = auth.currentUser;
    const _0x505c0c = firebase.auth.EmailAuthProvider.credential(_0x1a20bf.email, _0x33a6d8);
    _0x1a20bf.reauthenticateWithCredential(_0x505c0c).then(() => {
      _0x1a20bf.updatePassword(_0x53ed92).then(() => {
        successToast("Đổi mật khẩu thành công", 0xbb8, "top", "right", true, false, '');
        document.getElementById("currentPassword").value = '';
        document.getElementById("newPassword").value = '';
        document.getElementById("confirmPassword").value = '';
      })['catch'](_0x5af91f => {
        failToast("Đổi mật khẩu thất bại", 0xbb8, "top", 'right', true, false, '');
      });
    })["catch"](_0x586dc4 => {
      failToast("Mật khẩu hiện tại không đúng", 0xbb8, "top", "right", true, false, '');
    });
  });
  function deleteAvatar() {
    const _0x49c6b8 = auth.currentUser;
    firebase.storage().ref("users/" + _0x49c6b8.uid + "/profile.jpg")['delete']().then(() => {
      successToast("Xóa ảnh đại diện thành công", 0xbb8, 'top', 'right', true, false, '');
    })["catch"](_0x58acf8 => {
      console.error("Error deleting avatar:", _0x58acf8);
    });
  }
  function uploadAvatar() {
    const _0x1097e8 = auth.currentUser;
    const _0x47ff4d = document.createElement("input");
    _0x47ff4d.type = 'file';
    _0x47ff4d.accept = "image/*";
    _0x47ff4d.click();
    _0x47ff4d.addEventListener("change", _0x3b5c15 => {
      const _0xc4d99b = _0x3b5c15.target.files[0x0];
      const _0xd3b312 = firebase.storage().ref("users/" + _0x1097e8.uid + "/profile.jpg");
      const _0x26ba40 = _0xd3b312.put(_0xc4d99b);
      _0x26ba40.on("state_changed", _0x4f7d5e => {
        successToast("Đang tải ảnh đại diện lên...", 0xbb8, "top", "right", true, false, '');
      }, _0x44d558 => {
        failToast("Tải ảnh đại diện lên thất bại", 0xbb8, "top", "right", true, false, '');
      }, () => {
        _0x26ba40.snapshot.ref.getDownloadURL().then(_0x3e1b67 => {
          _0x1097e8.updateProfile({
            'photoURL': _0x3e1b67
          }).then(() => {
            successToast("Tải ảnh đại diện lên thành công", 0xbb8, "top", "right", true, false, '');
            document.getElementById('userAvatar').src = _0x3e1b67;
            document.getElementById("userProfileImage").src = _0x3e1b67;
          })["catch"](_0x23c2e1 => {
            console.error("Error updating user profile:", _0x23c2e1);
          });
        });
      });
    });
  }