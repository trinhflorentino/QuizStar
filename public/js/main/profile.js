auth.onAuthStateChanged(_0x2e822b => {
  if (!_0x2e822b) {
    return;
  }
  firebase.storage().ref('users/' + _0x2e822b.uid + "/profile.jpg").getDownloadURL().then(_0x2d0b94 => {
    document.getElementById("userAvatar").src = _0x2d0b94;
    document.getElementById("userProfileImage").src = _0x2d0b94;
  })["catch"](_0x39bca8 => {
    firebase.storage().ref("users/profile.jpg").getDownloadURL().then(_0x25fc47 => {
      document.getElementById('userAvatar').src = _0x25fc47;
      document.getElementById("userProfileImage").src = _0x25fc47;
    });
  });
  document.getElementById("userDisplayName").innerHTML = _0x2e822b.displayName;
  document.getElementById("userNameInput").value = _0x2e822b.displayName;
  if (_0x2e822b.metadata.creationTime) {
    document.getElementById("joinDate").innerHTML = "Bạn đã tham gia QuizStar từ ngày " + convertToDDMMYYYY(_0x2e822b.metadata.creationTime);
  }
});
function convertToDDMMYYYY(_0x389ff3) {
  const _0x2ab7bd = new Date(_0x389ff3);
  const _0x1fbe47 = new Date(_0x2ab7bd.getTime() + 25200000);
  const _0x5a91fe = String(_0x1fbe47.getDate()).padStart(0x2, '0');
  const _0x269ff7 = String(_0x1fbe47.getMonth() + 0x1).padStart(0x2, '0');
  const _0x31b9eb = _0x1fbe47.getFullYear();
  return _0x5a91fe + '/' + _0x269ff7 + '/' + _0x31b9eb;
}
const nameChangeForm = document.getElementById('nameChangeForm');
nameChangeForm.addEventListener("submit", _0x524e79 => {
  _0x524e79.preventDefault();
  const _0x48b501 = document.getElementById('userNameInput').value;
  if (_0x48b501 === '') {
    failToast("Họ và tên không được để trống", 0xbb8, "top", "right", true, false, '');
    return;
  }
  const _0x4f46b1 = auth.currentUser;
  _0x4f46b1.updateProfile({
    'displayName': _0x48b501
  }).then(() => {
    successToast("Đổi họ và tên thành công", 0xbb8, "top", 'right', true, false, '');
    document.getElementById("userDisplayName").innerHTML = _0x48b501;
  })["catch"](_0x557d20 => {
    failToast("Đổi họ và tên thất bại", 0xbb8, "top", "right", true, false, '');
  });
});
const passwordChangeForm = document.getElementById("passwordChangeForm");
passwordChangeForm.addEventListener("submit", _0xb2bbdf => {
  _0xb2bbdf.preventDefault();
  const _0x869b84 = document.getElementById("currentPassword").value;
  const _0x64287c = document.getElementById('newPassword').value;
  const _0x301499 = document.getElementById("confirmPassword").value;
  if (_0x64287c !== _0x301499) {
    failToast("Mật khẩu mới không khớp", 0xbb8, "top", 'right', true, false, '');
    return;
  }
  const _0xb443a3 = auth.currentUser;
  const _0x2eb265 = firebase.auth.EmailAuthProvider.credential(_0xb443a3.email, _0x869b84);
  _0xb443a3.reauthenticateWithCredential(_0x2eb265).then(() => {
    _0xb443a3.updatePassword(_0x64287c).then(() => {
      successToast("Đổi mật khẩu thành công", 0xbb8, 'top', "right", true, false, '');
      document.getElementById("currentPassword").value = '';
      document.getElementById("newPassword").value = '';
      document.getElementById("confirmPassword").value = '';
    })["catch"](_0x59de9e => {
      failToast("Đổi mật khẩu thất bại", 0xbb8, "top", 'right', true, false, '');
    });
  })["catch"](_0x1266d6 => {
    failToast("Mật khẩu hiện tại không đúng", 0xbb8, "top", "right", true, false, '');
  });
});
function deleteAvatar() {
  const _0x237d7f = auth.currentUser;
  firebase.storage().ref('users/' + _0x237d7f.uid + '/profile.jpg')['delete']().then(() => {
    successToast("Xóa ảnh đại diện thành công", 0xbb8, "top", "right", true, false, '');
  })['catch'](_0x249f14 => {
    console.error("Error deleting avatar:", _0x249f14);
  });
}
function uploadAvatar() {
  const _0xd77b40 = auth.currentUser;
  const _0x5a7dee = document.createElement("input");
  _0x5a7dee.type = "file";
  _0x5a7dee.accept = "image/*";
  _0x5a7dee.click();
  _0x5a7dee.addEventListener("change", _0x1872e3 => {
    const _0x5d6865 = _0x1872e3.target.files[0x0];
    const _0x295530 = firebase.storage().ref("users/" + _0xd77b40.uid + "/profile.jpg");
    const _0x1f8323 = _0x295530.put(_0x5d6865);
    _0x1f8323.on('state_changed', _0x543b44 => {
      successToast("Đang tải ảnh đại diện lên...", 0xbb8, 'top', 'right', true, false, '');
    }, _0x32b7dc => {
      failToast("Tải ảnh đại diện lên thất bại", 0xbb8, 'top', "right", true, false, '');
    }, () => {
      _0x1f8323.snapshot.ref.getDownloadURL().then(_0x3b467c => {
        _0xd77b40.updateProfile({
          'photoURL': _0x3b467c
        }).then(() => {
          successToast("Tải ảnh đại diện lên thành công", 0xbb8, "top", "right", true, false, '');
          document.getElementById("userAvatar").src = _0x3b467c;
          document.getElementById("userProfileImage").src = _0x3b467c;
        })["catch"](_0x55d0a5 => {
          console.error("Error updating user profile:", _0x55d0a5);
        });
      });
    });
  });
}