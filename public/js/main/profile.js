auth.onAuthStateChanged(_0xd13e4d => {
    if (!_0xd13e4d) {
      return;
    }
    
    // Ưu tiên sử dụng photoURL từ Firebase Auth profile
    if (_0xd13e4d.photoURL) {
      console.log("Load ảnh đại diện từ Firebase photoURL:", _0xd13e4d.photoURL);
      const avatarUrl = _0xd13e4d.photoURL + '?t=' + Date.now(); // Cache busting
      document.getElementById("userAvatar").src = avatarUrl;
      document.getElementById("userProfileImage").src = avatarUrl;
    } else {
      // Fallback: thử tìm ảnh mặc định hoặc ảnh default
      console.log("Không có photoURL, sử dụng ảnh mặc định");
      window.cloudinaryService.ref("users/profile.jpg").getDownloadURL().then(_0x5c3c94 => {
        document.getElementById('userAvatar').src = _0x5c3c94;
        document.getElementById('userProfileImage').src = _0x5c3c94;
      }).catch(_0x191302 => {
        console.log("Không tìm thấy ảnh mặc định, giữ nguyên ảnh logo");
        // Giữ nguyên img/appLogo.png như trong HTML
      });
    }
    
    document.getElementById('userDisplayName').innerHTML = _0xd13e4d.displayName;
    document.getElementById('userNameInput').value = _0xd13e4d.displayName;
    if (_0xd13e4d.metadata.creationTime) {
      document.getElementById("joinDate").innerHTML = "Bạn đã tham gia QuizStar từ ngày " + convertToDDMMYYYY(_0xd13e4d.metadata.creationTime);
    }
  });
  function convertToDDMMYYYY(_0x3220a5) {
    const _0x25a7c5 = new Date(_0x3220a5);
    const _0x5cc653 = new Date(_0x25a7c5.getTime() + 25200000);
    const _0x4e1eed = String(_0x5cc653.getDate()).padStart(0x2, '0');
    const _0x49280c = String(_0x5cc653.getMonth() + 0x1).padStart(0x2, '0');
    const _0x2fe909 = _0x5cc653.getFullYear();
    return _0x4e1eed + '/' + _0x49280c + '/' + _0x2fe909;
  }
  const nameChangeForm = document.getElementById("nameChangeForm");
  nameChangeForm.addEventListener('submit', _0x1691a4 => {
    _0x1691a4.preventDefault();
    const _0x1cfe0d = document.getElementById('userNameInput').value;
    if (_0x1cfe0d === '') {
      failToast("Họ và tên không được để trống", 0xbb8, 'top', "right", true, false, '');
      return;
    }
    const _0x2ebe1c = auth.currentUser;
    _0x2ebe1c.updateProfile({
      'displayName': _0x1cfe0d
    }).then(() => {
      successToast("Đổi họ và tên thành công", 0xbb8, "top", 'right', true, false, '');
      document.getElementById("userDisplayName").innerHTML = _0x1cfe0d;
    })["catch"](_0x2b7b27 => {
      failToast("Đổi họ và tên thất bại", 0xbb8, "top", "right", true, false, '');
    });
  });
  const passwordChangeForm = document.getElementById("passwordChangeForm");
  passwordChangeForm.addEventListener('submit', _0x7e4d8d => {
    _0x7e4d8d.preventDefault();
    const _0x11c2f1 = document.getElementById('currentPassword').value;
    const _0x6866b9 = document.getElementById("newPassword").value;
    const _0xf400e1 = document.getElementById("confirmPassword").value;
    if (_0x6866b9 !== _0xf400e1) {
      failToast("Mật khẩu mới không khớp", 0xbb8, 'top', "right", true, false, '');
      return;
    }
    const _0x3f99e5 = auth.currentUser;
    const _0x5304ca = firebase.auth.EmailAuthProvider.credential(_0x3f99e5.email, _0x11c2f1);
    _0x3f99e5.reauthenticateWithCredential(_0x5304ca).then(() => {
      _0x3f99e5.updatePassword(_0x6866b9).then(() => {
        successToast("Đổi mật khẩu thành công", 0xbb8, "top", "right", true, false, '');
        document.getElementById("currentPassword").value = '';
        document.getElementById("newPassword").value = '';
        document.getElementById("confirmPassword").value = '';
      })["catch"](_0x46ca92 => {
        failToast("Đổi mật khẩu thất bại", 0xbb8, "top", "right", true, false, '');
      });
    })['catch'](_0xe2b8cd => {
      failToast("Mật khẩu hiện tại không đúng", 0xbb8, "top", 'right', true, false, '');
    });
  });
  function deleteAvatar() {
    const _0xe2a0a1 = auth.currentUser;
    loadingAnimation.show("Đang xóa ảnh đại diện...");
    window.cloudinaryService.ref("users/" + _0xe2a0a1.uid + "/profile.jpg")["delete"]().then(() => {
      loadingAnimation.hide();
      successToast("Xóa ảnh đại diện thành công", 0xbb8, "top", 'right', true, false, '');
    })["catch"](_0x313725 => {
      loadingAnimation.hide();
      console.error("Error deleting avatar:", _0x313725);
    });
  }
  function uploadAvatar() {
    const _0x4cb777 = auth.currentUser;
    
    // Kiểm tra xem cloudinaryService đã sẵn sàng chưa
    if (!window.cloudinaryService) {
      console.error("Cloudinary service chưa được khởi tạo!");
      failToast("Dịch vụ upload chưa sẵn sàng. Vui lòng thử lại sau.", 0xbb8, 'top', "right", true, false, '');
      return;
    }
    
    const _0x457216 = document.createElement("input");
    _0x457216.type = "file";
    _0x457216.accept = "image/*";
    _0x457216.click();
    _0x457216.addEventListener('change', _0x507871 => {
      const _0x2be7ae = _0x507871.target.files[0x0];
      
      // Kiểm tra xem có file được chọn không
      if (!_0x2be7ae) {
        console.log("Không có file nào được chọn");
        return;
      }
      
      // Kiểm tra kích thước file (giới hạn 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (_0x2be7ae.size > maxSize) {
        failToast("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB", 0xbb8, 'top', "right", true, false, '');
        return;
      }
      
      console.log("Đang upload file:", _0x2be7ae.name, "Size:", _0x2be7ae.size, "Type:", _0x2be7ae.type);
      console.log("Cloudinary config:", {
        cloudName: window.cloudinaryService.cloudName,
        uploadPreset: window.cloudinaryService.uploadPreset
      });
      loadingAnimation.show("Đang tải ảnh đại diện lên...");
      
      // Thêm timestamp vào tên file để tránh conflict
      const timestamp = Date.now();
      const _0x8515b0 = window.cloudinaryService.ref("users/" + _0x4cb777.uid + "/profile_" + timestamp + ".jpg");
      console.log("Upload path:", "users/" + _0x4cb777.uid + "/profile_" + timestamp + ".jpg");
      const _0x3eb946 = _0x8515b0.put(_0x2be7ae);
      _0x3eb946.on("state_changed", _0x59c179 => {
        loadingAnimation.updateMessage("Đang tải ảnh đại diện lên... (" + Math.round(_0x59c179.bytesTransferred / _0x59c179.totalBytes * 0x64) + '%)');
      }, _0x58c35d => {
        loadingAnimation.hide();
        console.error("Lỗi khi upload ảnh đại diện:", _0x58c35d);
        console.error("Chi tiết lỗi:", _0x58c35d.message || _0x58c35d);
        failToast("Tải ảnh đại diện lên thất bại: " + (_0x58c35d.message || "Lỗi không xác định"), 0xbb8, 'top', "right", true, false, '');
      }, () => {
        _0x3eb946.snapshot.ref.getDownloadURL().then(_0x34c0c6 => {
          console.log("Upload thành công! URL:", _0x34c0c6);
          
          // Thêm cache busting để force browser load ảnh mới
          const urlWithCacheBust = _0x34c0c6 + '?t=' + Date.now();
          
          console.log("Đang cập nhật Firebase profile với URL:", _0x34c0c6);
          console.log("Đang cập nhật UI với URL (cache busted):", urlWithCacheBust);
          
          _0x4cb777.updateProfile({
            'photoURL': _0x34c0c6
          }).then(() => {
            console.log("✅ Firebase profile đã được cập nhật!");
            console.log("Đang cập nhật avatar elements...");
            
            // Kiểm tra elements có tồn tại không
            const userAvatar = document.getElementById("userAvatar");
            const userProfileImage = document.getElementById("userProfileImage");
            
            console.log("userAvatar element:", userAvatar);
            console.log("userProfileImage element:", userProfileImage);
            
            if (userAvatar) {
              userAvatar.src = urlWithCacheBust;
              console.log("✅ Đã cập nhật userAvatar");
            } else {
              console.error("❌ Không tìm thấy element #userAvatar");
            }
            
            if (userProfileImage) {
              userProfileImage.src = urlWithCacheBust;
              console.log("✅ Đã cập nhật userProfileImage");
            } else {
              console.error("❌ Không tìm thấy element #userProfileImage");
            }
            
            // Sync photoURL to match if user is in a match
            if (typeof window.updatePhotoURLInMatch === 'function') {
              console.log("🔄 Syncing photoURL to match...");
              window.updatePhotoURLInMatch(_0x34c0c6);
            }
            
            loadingAnimation.hide();
            successToast("Tải ảnh đại diện lên thành công", 0xbb8, 'top', "right", true, false, '');
          })['catch'](_0x583ef8 => {
            loadingAnimation.hide();
            console.error("Error updating user profile:", _0x583ef8);
            failToast("Cập nhật profile thất bại: " + _0x583ef8.message, 0xbb8, 'top', "right", true, false, '');
          });
        })['catch'](_0x2d8f9a => {
          loadingAnimation.hide();
          console.error("Error getting download URL:", _0x2d8f9a);
          failToast("Không thể lấy URL ảnh: " + _0x2d8f9a.message, 0xbb8, 'top', "right", true, false, '');
        });
      });
    });
  }