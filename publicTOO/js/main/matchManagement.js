let currentPage = 0x1;
let allMatches = [];
let userName;
let userUid;
let isHost = true;
auth.onAuthStateChanged(_0x3471e2 => {
  if (!_0x3471e2) {
    return;
  }
  const _0x21c4e2 = _0x3471e2.uid;
  userUid = _0x21c4e2;
  userName = _0x3471e2.displayName;
  fetchMatches(_0x21c4e2);
  // firebase.firestore().collection("hostUids").doc(userUid).get().then(_0xfcdea6 => {
  //   if (_0xfcdea6.exists) {
  //     const {
  //       expiredDate: _0x3cb1c5,
  //       disabledDate: _0x3bff6a
  //     } = _0xfcdea6.data();
  //     const _0x5ca7bb = firebase.firestore.Timestamp.now();
  //     if (_0x3cb1c5 && _0x5ca7bb.seconds > _0x3cb1c5.seconds || _0x3bff6a !== null) {
  //       isHost = false;
  //     }
  //   } else {
  //     isHost = false;
  //   }
  // });
});
function setCookie(_0x5ecf34, _0x64d72a, _0x34c7e0) {
  var _0x3ae3f1 = new Date();
  _0x3ae3f1.setTime(_0x3ae3f1.getTime() + _0x34c7e0 * 0x18 * 0x3c * 0x3c * 0x3e8);
  var _0x2ba73e = 'expires=' + _0x3ae3f1.toUTCString();
  document.cookie = _0x5ecf34 + '=' + _0x64d72a + ';' + _0x2ba73e + ";path=/";
}
function fetchMatches(_0x1dccbd) {
  const _0x5cf9ce = realtimeDB.ref('MatchList');
  _0x5cf9ce.orderByChild('matchhostid').equalTo(_0x1dccbd).once("value", _0x66396c => {
    allMatches = [];
    const _0x902c3d = [];
    _0x66396c.forEach(_0x436353 => {
      const _0x13a67b = _0x436353.val();
      const _0x3eef8b = {
        'matchId': _0x436353.key,
        'matchName': _0x13a67b.matchname,
        'hostId': _0x13a67b.matchhostid,
        'hostName': _0x13a67b.matchhostname
      };
      allMatches.push(_0x3eef8b);
      const _0x450626 = realtimeDB.ref(_0x436353.key + "/password").once("value").then(_0x1d73c0 => {
        _0x3eef8b.password = _0x1d73c0.val() || '';
      });
      _0x902c3d.push(_0x450626);
    });
    Promise.all(_0x902c3d).then(() => {
      renderTable(allMatches);
    });
  });
}
function renderTable(_0x1608c8) {
  const _0x549b98 = document.querySelector("tbody");
  _0x549b98.innerHTML = '';
  const _0x1ac375 = (currentPage - 0x1) * 0xa;
  const _0x3e621c = _0x1608c8.slice(_0x1ac375, _0x1ac375 + 0xa);
  _0x3e621c.forEach(_0x4ba0b9 => {
    const _0x47e98f = document.createElement('tr');
    _0x47e98f.className = "hover:bg-slate-50 border-b border-slate-200 dark:hover:bg-slate-700 dark:bg-neutral-800";
    _0x47e98f.innerHTML = "\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <p class=\"block font-semibold text-sm text-slate-800 dark:text-gray-500\">" + _0x4ba0b9.matchId + "</p>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <p class=\"text-sm text-slate-500 dark:text-slate-300\">" + _0x4ba0b9.matchName + "</p>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <p class=\"text-sm text-slate-500 dark:text-slate-300\">" + _0x4ba0b9.hostName + "</p>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <div class=\"flex items-center\">\n                    <input type=\"password\" value=\"" + _0x4ba0b9.password + "\" class=\"text-sm text-slate-500 dark:text-slate-300 bg-transparent border-none\" readonly>\n                    <button class=\"ml-2 text-blue-500 hover:text-blue-700 focus:outline-none\" onclick=\"toggleMatchPassword(this)\">\n <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z\" />\n        </svg>\n                    </button>\n                </div>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <button onclick=\"joinMatch('" + _0x4ba0b9.matchId + "')\" class=\"rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:text-white\">\n                    Điều khiển trận đấu\n                </button>\n                <button onclick=\"changeMatchPassword('" + _0x4ba0b9.matchId + "')\" class=\"rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:text-white focus:bg-yellow-800 focus:border-yellow-800 active:border-yellow-800 active:text-white active:bg-yellow-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:text-white\">\n                    Đổi mật khẩu trận đấu\n                </button>\n                <button onclick=\"deleteMatch('" + _0x4ba0b9.matchId + "')\" class=\"rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-red-800 hover:border-red-800 focus:text-white focus:bg-red-800 focus:border-red-800 active:border-red-800 active:text-white active:bg-red-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:text-white\">\n                    Xoá trận đấu\n                </button>\n            </td>\n        ";
    _0x549b98.appendChild(_0x47e98f);
  });
  updatePagination(_0x1608c8.length);
}
function toggleMatchPassword(_0x1287cc) {
  const _0x185c9e = _0x1287cc.previousElementSibling;
  const _0x3724fa = _0x1287cc.querySelector("svg");
  if (_0x185c9e.type === 'password') {
    _0x185c9e.type = 'text';
    _0x3724fa.innerHTML = "\n            <path fill-rule=\"evenodd\" d=\"M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z\" clip-rule=\"evenodd\" />\n            <path d=\"M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z\" />\n        ";
  } else {
    _0x185c9e.type = "password";
    _0x3724fa.innerHTML = "\n            <path d=\"M10 12a2 2 0 100-4 2 2 0 000 4z\" />\n            <path fill-rule=\"evenodd\" d=\"M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z\" clip-rule=\"evenodd\" />\n        ";
  }
}
function joinMatch(_0x26e661) {
  realtimeDB.ref("MatchList/" + _0x26e661).once("value").then(_0x3b894f => {
    const _0x131228 = _0x3b894f.val();
    if (_0x131228.matchhostid === auth.currentUser.uid) {
      const _0x1c6c8c = firestoreDB.collection("match").doc(auth.currentUser.uid);
      _0x1c6c8c.set({
        'match': _0x26e661
      }).then(() => {
        successToast("Đang điều hướng bạn đến trang điều khiển trận đấu", 0xbb8, "top", 'right', true, false, '');
        setCookie("matchid", _0x26e661, 0x78);
        setTimeout(() => {
          window.location.href = "Technician.html";
        }, 0xbb8);
      })['catch'](_0x30b917 => {
        console.error("Error adding document:", _0x30b917);
        failToast("Tham gia trận đấu thất bại", 0xbb8, 'top', "right", true, false, '');
      });
    } else {
      failToast("Yêu cầu không hợp lệ", 0xbb8, 'top', "right", true, false, '');
    }
  })["catch"](_0x1af0af => {
    console.error("Error retrieving match data:", _0x1af0af);
    failToast("Đã xảy ra lỗi khi lấy thông tin trận đấu", 0xbb8, 'top', "right", true, false, '');
  });
}
function changeMatchPassword(_0xb901f5) {
  const _0x32a6ac = prompt("Nhập mật khẩu mới:");
  if (!_0x32a6ac) {
    failToast("Bạn chưa nhập mật khẩu mới", 0xbb8, "top", "right", true, false, '');
    return;
  }
  realtimeDB.ref('MatchList/' + _0xb901f5).once("value").then(_0x47831d => {
    const _0x5b1535 = _0x47831d.val();
    if (!_0x5b1535) {
      failToast("Trận đấu không tồn tại", 0xbb8, "top", "right", true, false, '');
      return;
    }
    if (_0x5b1535.matchhostid === auth.currentUser.uid) {
      realtimeDB.ref('' + _0xb901f5).update({
        'password': _0x32a6ac
      }).then(() => {
        successToast("Đã đổi mật khẩu thành công", 0xbb8, "top", "right", true, false, '');
        fetchMatches(auth.currentUser.uid);
      })["catch"](_0x3c89c2 => {
        console.error("Error updating password:", _0x3c89c2);
        failToast("Đã xảy ra lỗi khi đổi mật khẩu", 0xbb8, "top", "right", true, false, '');
      });
    } else {
      failToast("Yêu cầu không hợp lệ. Bạn không phải là chủ của trận đấu này", 0xbb8, "top", "right", true, false, '');
    }
  })["catch"](_0x4f1e5f => {
    console.error("Error retrieving match data:", _0x4f1e5f);
    failToast("Đã xảy ra lỗi khi lấy thông tin trận đấu", 0xbb8, 'top', "right", true, false, '');
  });
}
function deleteMatch(_0x5b9e3a) {
  if (!confirm("Bạn có chắc chắn muốn xoá trận đấu này không?")) {
    return;
  }
  realtimeDB.ref("MatchList/" + _0x5b9e3a).once("value").then(_0x322564 => {
    const _0x474ebd = _0x322564.val();
    if (_0x474ebd.matchhostid !== auth.currentUser.uid) {
      failToast("Bạn không có quyền xoá trận đấu này", 0xbb8, "top", "right", true, false, '');
      return;
    }
    const _0x46b27f = firebase.database().ref(_0x5b9e3a);
    const _0x5ec45e = firebase.database().ref("MatchList/" + _0x5b9e3a);
    const _0x3335ff = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x46b27f.remove().then(() => _0x5ec45e.remove()).then(() => _0x3335ff['delete']()).then(() => {
      document.cookie = "matchid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      successToast("Xoá trận đấu thành công", 0xbb8, "top", "right", true, false, '');
      fetchMatches(userUid);
    })["catch"](_0x5c1245 => {
      console.error("Error deleting match:", _0x5c1245);
      failToast("Xoá trận đấu thất bại", 0xbb8, "top", "right", true, false, '');
    });
  })['catch'](_0x21f048 => {
    console.error("Error retrieving match data:", _0x21f048);
    failToast("Đã xảy ra lỗi khi lấy thông tin trận đấu", 0xbb8, "top", "right", true, false, '');
  });
  const _0x26ca14 = firebase.database().ref(_0x5b9e3a);
  const _0x1ef404 = firebase.database().ref("MatchList/" + _0x5b9e3a);
  const _0x41bd16 = firestoreDB.collection("match").doc(auth.currentUser.uid);
  deleteAllFilesAndFolders(_0x5b9e3a);
  _0x26ca14.remove().then(() => _0x1ef404.remove()).then(() => _0x41bd16["delete"]()).then(() => {
    document.cookie = "matchid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    successToast("Xoá trận đấu thành công", 0xbb8, "top", "right", true, false, '');
    fetchMatches(userUid);
  })["catch"](_0x1c1ff5 => {
    console.error("Error deleting match:", _0x1c1ff5);
    failToast("Xoá trận đấu thất bại", 0xbb8, 'top', "right", true, false, '');
  });
}
function deleteAllFilesAndFolders(_0x3d68a5) {
  const _0x1335a6 = firebase.storage().ref();
  const _0x3c00ad = _0x1335a6.child(_0x3d68a5 + '/');
  function _0xd3a41c(_0x28b603) {
    return _0x28b603.listAll().then(_0x4ab3fa => {
      const _0x16bf4c = [];
      _0x4ab3fa.items.forEach(_0x204f06 => {
        _0x16bf4c.push(_0x204f06["delete"]());
      });
      const _0x4d6306 = _0x4ab3fa.prefixes.map(_0x3ac362 => {
        return _0xd3a41c(_0x3ac362);
      });
      return Promise.all([..._0x16bf4c, ..._0x4d6306]);
    });
  }
  _0xd3a41c(_0x3c00ad).then(() => {
    console.log("All files and folders in " + _0x3d68a5 + "/ have been deleted.");
    successToast("Đã xoá tất cả tệp và thư mục con", 0xbb8, "top", "right", true, false, '');
  })["catch"](_0x137cc9 => {
    console.error("Error deleting files and folders:", _0x137cc9);
    failToast("Không thể xoá tệp và thư mục con", 0xbb8, "top", "right", true, false, '');
  });
}
function updatePagination(_0x275c93) {
  const _0x47cf9d = document.querySelector('.pagination-number');
  _0x47cf9d.innerHTML = "Hiển thị <b>" + ((currentPage - 0x1) * 0xa + 0x1) + '-' + Math.min(currentPage * 0xa, _0x275c93) + "</b> trong số " + _0x275c93;
  const _0x497763 = Math.ceil(_0x275c93 / 0xa);
  const _0x545839 = document.querySelector(".flex.space-x-1");
  _0x545839.innerHTML = '';
  if (currentPage > 0x1) {
    const _0xbf8580 = createButton("Trước", () => {
      currentPage--;
      renderTable(allMatches);
    });
    _0x545839.appendChild(_0xbf8580);
  }
  for (let _0x5927cc = 0x1; _0x5927cc <= _0x497763; _0x5927cc++) {
    const _0x580030 = createButton(_0x5927cc.toString(), () => {
      currentPage = _0x5927cc;
      renderTable(allMatches);
    });
    _0x545839.appendChild(_0x580030);
  }
  if (currentPage < _0x497763) {
    const _0x3fe038 = createButton("Sau", () => {
      currentPage++;
      renderTable(allMatches);
    });
    _0x545839.appendChild(_0x3fe038);
  }
}
function createButton(_0x3179ce, _0x20590a) {
  const _0x1da2b2 = document.createElement("button");
  _0x1da2b2.className = "px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white dark:bg-neutral-800 dark:text-slate-300 border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease";
  _0x1da2b2.innerText = _0x3179ce;
  _0x1da2b2.onclick = _0x20590a;
  return _0x1da2b2;
}
function searchMatches() {
  const _0x4b1029 = document.getElementById("searchMatches").value.toLowerCase();
  const _0xec119f = allMatches.filter(_0x585a92 => _0x585a92.matchId.toLowerCase().includes(_0x4b1029) || _0x585a92.matchName.toLowerCase().includes(_0x4b1029));
  currentPage = 0x1;
  renderTable(_0xec119f);
}
document.getElementById('searchMatches').addEventListener("input", searchMatches);
function checkExistingMatch() {
  if (isHost === false) {
    failToast("Bạn không có quyền tạo trận đấu, bị vô hiệu hoá hoặc đã hết hạn sử dụng dịch vụ.", 0x3a98, "top", "right", true, false, '');
    return;
  }
  var _0x39ce14 = document.getElementById("matchshortname").value.toUpperCase();
  var _0x55ab3b = document.getElementById("matchfullname").value;
  var _0x38f5cc = document.getElementById("matchpassword").value;
  var _0x412b5c = firebase.database().ref('/');
  var _0x18378a = _0x412b5c.child(_0x39ce14);
  if (_0x55ab3b == '' || _0x38f5cc == '') {
    failToast("Vui lòng điền đầy đủ thông tin", 0xbb8, "top", "right", true, false, '');
    return false;
  }
  _0x18378a.once("value", function (_0x54dab8) {
    if (_0x54dab8.exists()) {
      failToast("Mã trận này đã tồn tại", 0xbb8, "top", "right", true, false, '');
    } else {
      createMatch();
      return false;
    }
  });
}
function createMatch() {
  const _0x534b5e = document.getElementById("matchshortname").value.toUpperCase();
  const _0x3be8b9 = document.getElementById("matchfullname").value;
  const _0x268aa3 = document.getElementById("matchpassword").value;
  const _0x121c0b = {
    'password': _0x268aa3,
    'host': userName,
    'match': _0x3be8b9,
    'hostid': userUid
  };
  const _0x2dbae6 = {
    'tangtoc': {
      'tangtoc': 0x0
    },
    'answer': {
      'answer': ''
    },
    'correctorwrong': {
      'correctorwrong': 0x0
    },
    'timestamp': {
      'timestamp': 0x0
    },
    'cauhoidapan': {
      'cauhoi': '',
      'dapan': ''
    },
    'status': {
      'status': 0x0
    },
    'status2': {
      'status': false
    },
    'cau': {
      'cau1': 0x0,
      'cau2': 0x0,
      'cau3': 0x0
    },
    'video': {
      'video1': 0x0,
      'video2': 0x0,
      'video3': 0x0,
      'video4': 0x0
    },
    'host': {
      'host': userName
    },
    'match': {
      'match': _0x3be8b9
    },
    'kd': Array.from({
      'length': 0x6
    }, (_0x336172, _0x738702) => ({
      ["cau" + (_0x738702 + 0x1)]: '',
      ["dacau" + (_0x738702 + 0x1)]: ''
    })).reduce((_0x2836d1, _0x25caf5) => ({
      ..._0x2836d1,
      ..._0x25caf5
    }), {}),
    'chp': Array.from({
      'length': 0xa
    }, (_0x586a65, _0x3c577c) => ({
      ["cau" + (_0x3c577c + 0x1)]: '',
      ["dacau" + (_0x3c577c + 0x1)]: ''
    })).reduce((_0x5baed1, _0x33cbf5) => ({
      ..._0x5baed1,
      ..._0x33cbf5
    }), {}),
    'hn': {
      'hn': 0x0
    },
    'chat': {},
    'dunghaysai': {
      'dunghaysai': 0x0
    },
    'dapan': {
      'dapan': ''
    },
    'kiemtra': {
      'kiemtra': 0x0
    },
    'correct': {
      'correct': 0x0
    },
    'chuong': {
      'chuong': 0x0
    },
    'cnv': {
      'cnv': ''
    },
    'id': {
      'id': ''
    },
    'end': {
      'end': 0x0
    },
    'infoplayer': {
      'displayName': 'N/A',
      'id': 0x0,
      'uid': ''
    },
    'start': {
      'start': 0x0
    },
    'vcnv': {
      'vcnv': 0x0
    },
    'vedich': {
      'vedich': 0x0
    },
    'vedichphu': {
      'vedichphu': 0x0
    },
    'tongketdiem': {
      'tongketdiem': 0x0
    },
    'intro': {
      'intro': 0x0
    },
    'causo': {
      'causo': 0x0
    },
    'khoidongdungsai': {
      'dung': 0x0,
      'sai': 0x0
    },
    'batdau': {
      'batdau': 0x0
    },
    'player': {
      'player': 0x0
    },
    'point': {
      'point': 0x0
    },
    'default': {
      'default': 0x0
    },
    'chuongplayer': {
      'id': '',
      'timestamp': ''
    },
    'dungsai': {
      'dungsai': 0x0
    },
    'sohangngang': {
      'hangngang': 0x0
    },
    'disabled': {
      'ansbardisabled': 0x0
    },
    'chuongdisable': {
      'chuongdisable': 0x0
    },
    'audio': {
      'audio': 0x0
    },
    'chatdisabled': {
      'disable': 0x0
    },
    'openanswer': {
      'OpenAnswer': 0x0
    },
    'countdown': {
      'countdown': 0x0
    },
    'keytype': {
      'type': 0x1
    },
    'disable': {
      'disable': 0x0
    },
    'L1': Array.from({
      'length': 0xf
    }, (_0x8703e6, _0xd2e05e) => ({
      ["cau" + (_0xd2e05e + 0x1)]: '',
      ["dacau" + (_0xd2e05e + 0x1)]: ''
    })).reduce((_0x143e24, _0x509a36) => ({
      ..._0x143e24,
      ..._0x509a36
    }), {}),
    'L2': Array.from({
      'length': 0x19
    }, (_0x4f800e, _0x12cd22) => ({
      ['cau' + (_0x12cd22 + 0x1)]: '',
      ['dacau' + (_0x12cd22 + 0x1)]: ''
    })).reduce((_0xffef64, _0x2f957d) => ({
      ..._0xffef64,
      ..._0x2f957d
    }), {}),
    'L3': Array.from({
      'length': 0x23
    }, (_0x4c6561, _0x44c457) => ({
      ["cau" + (_0x44c457 + 0x1)]: '',
      ["dacau" + (_0x44c457 + 0x1)]: ''
    })).reduce((_0x42122f, _0x178374) => ({
      ..._0x42122f,
      ..._0x178374
    }), {}),
    'turn': {
      'turn': 0x1
    },
    'stop': {
      'stop': 0x0
    },
    'statuslt': {
      'status': 0x3
    },
    'kdvalue': {
      'value': false
    },
    'banner': {
      'banner': 0x0
    },
    'BannerMusic': {
      'MC': false,
      'ContesttantIntroduction': false,
      'Advisor1': false,
      'Advisor2': false,
      'Advisor3': false,
      'Advisor4': false,
      'Advisor5': false,
      'GivingPrize': false,
      'End': false,
      'TenseMoments': false,
      'Place1st': false,
      'Place2nd': false,
      'Place3rd': false,
      'Place4th': false
    },
    'BannerElements': {
      'MatchName': false,
      'ContesttantList': false,
      'CustomText': false,
      'CustomTextContent': ''
    },
    'Sounds': {
      'EnglishVoice': false,
      'SpacingMusic': false
    }
  };
  const _0x4af3ad = {
    'matchhostid': userUid,
    'matchhostname': userName,
    'matchid': _0x534b5e,
    'matchname': _0x3be8b9
  };
  const _0x210b16 = firebase.database().ref(_0x534b5e);
  _0x210b16.set(_0x121c0b);
  _0x210b16.child('Acceleration/QS').set(_0x2dbae6.tangtoc);
  _0x210b16.child("VCNVPlayed/").set(_0x2dbae6.sohangngang);
  _0x210b16.child('AccelerationDisplayAnswerImage').set(_0x2dbae6.status2);
  for (let _0x20a6e6 = 0x1; _0x20a6e6 <= 0x4; _0x20a6e6++) {
    _0x210b16.child("AccelerationAnswer/TS" + _0x20a6e6 + '/Answer').set(_0x2dbae6.answer);
    _0x210b16.child('AccelerationAnswer/TS' + _0x20a6e6 + "/CorrectOrWrong").set(_0x2dbae6.correctorwrong);
    _0x210b16.child("AccelerationAnswer/TS" + _0x20a6e6 + '/Timestamp').set(_0x2dbae6.timestamp);
    _0x210b16.child("AccelerationChecked/TT" + _0x20a6e6).set(_0x2dbae6.correctorwrong);
    _0x210b16.child('AccelerationQuestion/QS' + _0x20a6e6).set(_0x2dbae6.cauhoidapan);
    _0x210b16.child("StartQuestion/Q" + _0x20a6e6 + 'DB').set(_0x2dbae6.kd);
    _0x210b16.child("VCNVAnswer/TS" + _0x20a6e6).set(_0x2dbae6.answer);
    _0x210b16.child("VCNVAnswer/TS" + _0x20a6e6 + '/dunghaysai').set(_0x2dbae6.dunghaysai);
    _0x210b16.child('VCNVChuong/TS' + _0x20a6e6).set(_0x2dbae6.chuong);
    _0x210b16.child("VCNVChuongTimeStamp/TS" + _0x20a6e6).set(_0x2dbae6.timestamp);
    _0x210b16.child('VCNVQuestion/HN' + _0x20a6e6).set(_0x2dbae6.cauhoidapan);
    _0x210b16.child("VCNVImageStatus/HA" + _0x20a6e6).set(_0x2dbae6.status);
    _0x210b16.child("VCNVRowStatus/HN" + _0x20a6e6).set(_0x2dbae6.status);
    _0x210b16.child("VCNVDisable/TS" + _0x20a6e6).set(_0x2dbae6.disabled);
  }
  _0x210b16.child("VCNVImageStatus/HATT").set(_0x2dbae6.status);
  _0x210b16.child("VCNVRowStatus/HATT").set(_0x2dbae6.status);
  _0x210b16.child("VCNVQuestion/HNTT").set(_0x2dbae6.cauhoidapan);
  _0x210b16.child('VCNVQuestion/CNVKeyType').set(_0x2dbae6.keytype);
  _0x210b16.child("VCNVAudio").set(_0x2dbae6.audio);
  for (let _0x1cdf9d = 0x1; _0x1cdf9d <= 0x4; _0x1cdf9d++) {
    for (let _0xe62905 = 0xa; _0xe62905 <= 0x1e; _0xe62905 += 0xa) {
      for (let _0x8c453c = 0x1; _0x8c453c <= 0x3; _0x8c453c++) {
        _0x210b16.child('FinishQuestion/Q' + _0x1cdf9d + "DB/QP" + _0xe62905 + '/' + _0x8c453c).set(_0x2dbae6.cauhoidapan);
      }
    }
  }
  for (let _0x2005f6 = 0x1; _0x2005f6 <= 0x3; _0x2005f6++) {
    for (let _0x556f0a = 0x1; _0x556f0a <= 0x3; _0x556f0a++) {
      _0x210b16.child("FinishQuestionChoose/TS" + _0x2005f6 + '/' + _0x556f0a).set({
        ['cau' + _0x556f0a]: 0x0
      });
    }
  }
  _0x210b16.child("VCNVAnswer/kiemtradapan").set(_0x2dbae6.kiemtra);
  _0x210b16.child("Banner/Elements").set(_0x2dbae6.BannerElements);
  _0x210b16.child("Banner/Music").set(_0x2dbae6.BannerMusic);
  _0x210b16.child('AccelerationOpenAnswer/').set(_0x2dbae6.openanswer);
  _0x210b16.child("VCNVChuong/OpenAll").set(_0x2dbae6.correct);
  _0x210b16.child('VCNVQuestion/CNV').set(_0x2dbae6.cnv);
  _0x210b16.child('FinishPoint/status').set(_0x2dbae6.status);
  _0x210b16.child("FinishVideoState/VD").set(_0x2dbae6.video);
  _0x210b16.child("Match/Host/").set(_0x2dbae6.host);
  _0x210b16.child("Match/Name/").set(_0x2dbae6.match);
  _0x210b16.child("Sounds/").set(_0x2dbae6.Sounds);
  _0x210b16.child("StartEmergencyStop").set(_0x2dbae6.stop);
  _0x210b16.child('VCNV/hangngang').set(_0x2dbae6.hn);
  _0x210b16.child("KDO22Chuong/WaitForAnswer").set(_0x2dbae6.status);
  _0x210b16.child("VDCauso").set(_0x2dbae6.causo);
  _0x210b16.child("VDPCauso").set(_0x2dbae6.causo);
  _0x210b16.child("VDChuong/ChuongStatus").set(_0x2dbae6.status);
  _0x210b16.child("VDChuong/CorrectOrWrong").set(_0x2dbae6.correctorwrong);
  _0x210b16.child("VDChuong/Player").set(_0x2dbae6.chuongplayer);
  _0x210b16.child("VDPChuong/ChuongStatus").set(_0x2dbae6.status);
  _0x210b16.child("VDPChuong/CorrectOrWrong").set(_0x2dbae6.correctorwrong);
  _0x210b16.child("VDPChuong/Player").set(_0x2dbae6.chuongplayer);
  _0x210b16.child("VCNVOpenAnswer").set(_0x2dbae6.openanswer);
  _0x210b16.child("VCNV15sCountdown").set(_0x2dbae6.countdown);
  _0x210b16.child("VDCorrectOrWrong").set(_0x2dbae6.dungsai);
  _0x210b16.child("VDNSHV/status").set(_0x2dbae6.status);
  _0x210b16.child("VDPlayerTurnEnd/End").set(_0x2dbae6.end);
  _0x210b16.child('chat').set(_0x2dbae6.chat);
  _0x210b16.child("ChatDisable").set(_0x2dbae6.chatdisabled);
  _0x210b16.child("games/mc").set(_0x2dbae6.infoplayer);
  _0x210b16.child('games/mc2').set(_0x2dbae6.infoplayer);
  _0x210b16.child("games/player1").set(_0x2dbae6.infoplayer);
  _0x210b16.child('games/player2').set(_0x2dbae6.infoplayer);
  _0x210b16.child("games/player3").set(_0x2dbae6.infoplayer);
  _0x210b16.child("games/player4").set(_0x2dbae6.infoplayer);
  _0x210b16.child("games/player5").set(_0x2dbae6.infoplayer);
  _0x210b16.child('gamestatus/banner').set(_0x2dbae6.banner);
  _0x210b16.child("gamestatus/khoidong").set(_0x2dbae6.start);
  _0x210b16.child("gamestatus/tangtoc").set(_0x2dbae6.tangtoc);
  _0x210b16.child("gamestatus/tongketdiem").set(_0x2dbae6.tongketdiem);
  _0x210b16.child("gamestatus/vcnv").set(_0x2dbae6.vcnv);
  _0x210b16.child("gamestatus/vedich").set(_0x2dbae6.vedich);
  _0x210b16.child("gamestatus/vedichphu").set(_0x2dbae6.vedichphu);
  _0x210b16.child("intro").set(_0x2dbae6.intro);
  _0x210b16.child("IntroNum").set(_0x2dbae6.intro);
  _0x210b16.child("khoidong").set(_0x2dbae6.causo);
  _0x210b16.child("khoidongdungsai").set(_0x2dbae6.khoidongdungsai);
  _0x210b16.child("phanthistatus/khoidong").set(_0x2dbae6.batdau);
  _0x210b16.child("phanthistatus/tangtoc").set(_0x2dbae6.batdau);
  _0x210b16.child("phanthistatus/vcnv").set(_0x2dbae6.batdau);
  _0x210b16.child("phanthistatus/vedich").set(_0x2dbae6.batdau);
  _0x210b16.child("playerstatus/khoidong").set(_0x2dbae6.player);
  _0x210b16.child("playerstatus/vedich").set(_0x2dbae6.player);
  _0x210b16.child("point/player").set(_0x2dbae6.point);
  _0x210b16.child("point/player1").set(_0x2dbae6.point);
  _0x210b16.child("point/player2").set(_0x2dbae6.point);
  _0x210b16.child("point/player3").set(_0x2dbae6.point);
  _0x210b16.child("point/player4").set(_0x2dbae6.point);
  _0x210b16.child("replayintro").set(_0x2dbae6.intro);
  _0x210b16.child("CHPQuestion").set(_0x2dbae6.chp);
  _0x210b16.child("VDPChuongDisable/TS1").set(_0x2dbae6.chuongdisable);
  _0x210b16.child("VDPChuongDisable/TS2").set(_0x2dbae6.chuongdisable);
  _0x210b16.child("VDPChuongDisable/TS3").set(_0x2dbae6.chuongdisable);
  _0x210b16.child('VDPChuongDisable/TS4').set(_0x2dbae6.chuongdisable);
  _0x210b16.child('KDO22AnswerRights').set(_0x2dbae6.kdvalue);
  _0x210b16.child("KDO223sCountdown").set(_0x2dbae6.countdown);
  _0x210b16.child('KDO22Causo').set(_0x2dbae6.causo);
  _0x210b16.child("KDO22Chuong/ChuongStatus").set(_0x2dbae6.status);
  _0x210b16.child('KDO22Chuong/CorrectOrWrong').set(_0x2dbae6.correctorwrong);
  _0x210b16.child("KDO22Chuong/Player").set(_0x2dbae6.id);
  _0x210b16.child("KDO22ChuongDisable/TS1").set(_0x2dbae6.disable);
  _0x210b16.child("KDO22ChuongDisable/TS2").set(_0x2dbae6.disable);
  _0x210b16.child("KDO22ChuongDisable/TS3").set(_0x2dbae6.disable);
  _0x210b16.child('KDO22ChuongDisable/TS4').set(_0x2dbae6.disable);
  _0x210b16.child('KDO22Question/L1').set(_0x2dbae6.L1);
  _0x210b16.child("KDO22Question/L2").set(_0x2dbae6.L2);
  _0x210b16.child("KDO22Question/L3").set(_0x2dbae6.L3);
  _0x210b16.child("KDO22Turn").set(_0x2dbae6.turn);
  _0x210b16.child('KDO22LuotThiStatus').set(_0x2dbae6.statuslt);
  firebase.database().ref("/MatchList/" + _0x534b5e).set(_0x4af3ad);
  setCookie("matchid", _0x534b5e, 0x78);
  firebase.firestore().collection("match").doc(auth.currentUser.uid).set({
    'match': _0x534b5e
  });
  localStorage.setItem("match", _0x534b5e);
  successToast("Tạo trận đấu thành công", 0xbb8, "top", 'right', true, false, '');
  fetchMatches(userUid);
}
const matchCreateForm = document.getElementById("matchCreateForm");
matchCreateForm.addEventListener("submit", _0x3b19bb => {
  _0x3b19bb.preventDefault();
  checkExistingMatch();
});
function setCookie(_0x39167d, _0x505084, _0x429ab0) {
  var _0xabb252 = new Date();
  _0xabb252.setTime(_0xabb252.getTime() + _0x429ab0 * 0x18 * 0x3c * 0x3c * 0x3e8);
  var _0x19055c = "expires=" + _0xabb252.toUTCString();
  document.cookie = _0x39167d + '=' + _0x505084 + ';' + _0x19055c + ";path=/";
}