let currentPage = 0x1;
let allMatches = [];
let userName;
let userUid;
auth.onAuthStateChanged(_0x1b056b => {
  if (!_0x1b056b) {
    return;
  }
  const _0x2e9c0d = _0x1b056b.uid;
  userUid = _0x2e9c0d;
  userName = _0x1b056b.displayName;
  fetchMatches(_0x2e9c0d);
});
function setCookie(_0x25af0f, _0x25eeb1, _0x33e92d) {
  var _0x143cd1 = new Date();
  _0x143cd1.setTime(_0x143cd1.getTime() + _0x33e92d * 0x18 * 0x3c * 0x3c * 0x3e8);
  var _0x27b00a = "expires=" + _0x143cd1.toUTCString();
  document.cookie = _0x25af0f + '=' + _0x25eeb1 + ';' + _0x27b00a + ";path=/";
}
function fetchMatches(_0x552016) {
  const _0x3eae45 = realtimeDB.ref("MatchList");
  _0x3eae45.orderByChild("matchhostid").equalTo(_0x552016).once("value", _0x48546b => {
    allMatches = [];
    const _0x2bd700 = [];
    _0x48546b.forEach(_0x285623 => {
      const _0xa64a38 = _0x285623.val();
      const _0x4c948b = {
        'matchId': _0x285623.key,
        'matchName': _0xa64a38.matchname,
        'hostId': _0xa64a38.matchhostid,
        'hostName': _0xa64a38.matchhostname
      };
      allMatches.push(_0x4c948b);
      const _0x5b2b5f = realtimeDB.ref(_0x285623.key + "/password").once("value").then(_0xb3fb3e => {
        _0x4c948b.password = _0xb3fb3e.val() || '';
      });
      _0x2bd700.push(_0x5b2b5f);
    });
    Promise.all(_0x2bd700).then(() => {
      renderTable(allMatches);
    });
  });
}
function renderTable(_0x49c8c2) {
  const _0x584799 = document.querySelector("tbody");
  _0x584799.innerHTML = '';
  const _0x15ae75 = (currentPage - 0x1) * 0xa;
  const _0x4bad0f = _0x49c8c2.slice(_0x15ae75, _0x15ae75 + 0xa);
  _0x4bad0f.forEach(_0x51b41f => {
    const _0xc736ce = document.createElement('tr');
    _0xc736ce.className = "hover:bg-slate-50 border-b border-slate-200 dark:hover:bg-slate-700 dark:bg-neutral-800";
    _0xc736ce.innerHTML = "\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <p class=\"block font-semibold text-sm text-slate-800 dark:text-gray-500\">" + _0x51b41f.matchId + "</p>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <p class=\"text-sm text-slate-500 dark:text-slate-300\">" + _0x51b41f.matchName + "</p>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <p class=\"text-sm text-slate-500 dark:text-slate-300\">" + _0x51b41f.hostName + "</p>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <div class=\"flex items-center\">\n                    <input type=\"password\" value=\"" + _0x51b41f.password + "\" class=\"text-sm text-slate-500 dark:text-slate-300 bg-transparent border-none\" readonly>\n                    <button class=\"ml-2 text-blue-500 hover:text-blue-700 focus:outline-none\" onclick=\"toggleMatchPassword(this)\">\n <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z\" />\n        </svg>\n                    </button>\n                </div>\n            </td>\n            <td class=\"p-4 py-5 border-b dark:border-slate-700\">\n                <button onclick=\"joinMatch('" + _0x51b41f.matchId + "')\" class=\"rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:text-white\">\n                    Điều khiển phòng trò chơi\n                </button>\n                <button onclick=\"changeMatchPassword('" + _0x51b41f.matchId + "')\" class=\"rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:text-white focus:bg-yellow-800 focus:border-yellow-800 active:border-yellow-800 active:text-white active:bg-yellow-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:text-white\">\n                    Đổi mật khẩu phòng trò chơi\n                </button>\n                <button onclick=\"deleteMatch('" + _0x51b41f.matchId + "')\" class=\"rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-red-800 hover:border-red-800 focus:text-white focus:bg-red-800 focus:border-red-800 active:border-red-800 active:text-white active:bg-red-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:text-white\">\n                    Xoá phòng trò chơi\n                </button>\n            </td>\n        ";
    _0x584799.appendChild(_0xc736ce);
  });
  updatePagination(_0x49c8c2.length);
}
function toggleMatchPassword(_0x13c18e) {
  const _0x2d6b63 = _0x13c18e.previousElementSibling;
  const _0x3af03a = _0x13c18e.querySelector("svg");
  if (_0x2d6b63.type === "password") {
    _0x2d6b63.type = "text";
    _0x3af03a.innerHTML = "\n            <path fill-rule=\"evenodd\" d=\"M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z\" clip-rule=\"evenodd\" />\n            <path d=\"M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z\" />\n        ";
  } else {
    _0x2d6b63.type = "password";
    _0x3af03a.innerHTML = "\n            <path d=\"M10 12a2 2 0 100-4 2 2 0 000 4z\" />\n            <path fill-rule=\"evenodd\" d=\"M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z\" clip-rule=\"evenodd\" />\n        ";
  }
}
function joinMatch(_0x3a430a) {
  realtimeDB.ref('MatchList/' + _0x3a430a).once("value").then(_0x40c7bd => {
    const _0x3e4ffb = _0x40c7bd.val();
    if (_0x3e4ffb.matchhostid === auth.currentUser.uid) {
      const _0x54b549 = firestoreDB.collection("match").doc(auth.currentUser.uid);
      _0x54b549.set({
        'match': _0x3a430a
      }).then(() => {
        successToast("Đang điều hướng bạn đến trang điều khiển phòng trò chơi", 0xbb8, "top", "right", true, false, '');
        setCookie("matchid", _0x3a430a, 0x78);
        setTimeout(() => {
          window.location.href = "Technician.html";
        }, 0xbb8);
      })['catch'](_0x24f55e => {
        console.error("Error adding document:", _0x24f55e);
        failToast("Tham gia phòng trò chơi thất bại", 0xbb8, "top", "right", true, false, '');
      });
    } else {
      failToast("Yêu cầu không hợp lệ", 0xbb8, "top", 'right', true, false, '');
    }
  })['catch'](_0xe1d7b9 => {
    console.error("Error retrieving match data:", _0xe1d7b9);
    failToast("Đã xảy ra lỗi khi lấy thông tin phòng trò chơi", 0xbb8, "top", "right", true, false, '');
  });
}
function changeMatchPassword(_0x1af71b) {
  const _0xe29326 = prompt("Nhập mật khẩu mới:");
  if (!_0xe29326) {
    failToast("Bạn chưa nhập mật khẩu mới", 0xbb8, "top", "right", true, false, '');
    return;
  }
  realtimeDB.ref("MatchList/" + _0x1af71b).once('value').then(_0x4b406d => {
    const _0x17ef90 = _0x4b406d.val();
    if (!_0x17ef90) {
      failToast("phòng trò chơi không tồn tại", 0xbb8, "top", "right", true, false, '');
      return;
    }
    if (_0x17ef90.matchhostid === auth.currentUser.uid) {
      realtimeDB.ref('' + _0x1af71b).update({
        'password': _0xe29326
      }).then(() => {
        successToast("Đã đổi mật khẩu thành công", 0xbb8, "top", "right", true, false, '');
        fetchMatches(auth.currentUser.uid);
      })["catch"](_0x328883 => {
        console.error("Error updating password:", _0x328883);
        failToast("Đã xảy ra lỗi khi đổi mật khẩu", 0xbb8, "top", "right", true, false, '');
      });
    } else {
      failToast("Yêu cầu không hợp lệ. Bạn không phải là chủ của phòng trò chơi này", 0xbb8, "top", "right", true, false, '');
    }
  })["catch"](_0x25bdd7 => {
    console.error("Error retrieving match data:", _0x25bdd7);
    failToast("Đã xảy ra lỗi khi lấy thông tin phòng trò chơi", 0xbb8, "top", "right", true, false, '');
  });
}
function deleteMatch(_0x5921ba) {
  if (!confirm("Bạn có chắc chắn muốn xoá phòng trò chơi này không?")) {
    return;
  }
  realtimeDB.ref("MatchList/" + _0x5921ba).once("value").then(_0x478b8a => {
    const _0x4a1769 = _0x478b8a.val();
    if (_0x4a1769.matchhostid !== auth.currentUser.uid) {
      failToast("Bạn không có quyền xoá phòng trò chơi này", 0xbb8, "top", "right", true, false, '');
      return;
    }
    const _0x550220 = firebase.database().ref(_0x5921ba);
    const _0x415201 = firebase.database().ref("MatchList/" + _0x5921ba);
    const _0x53aa3b = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x550220.remove().then(() => _0x415201.remove()).then(() => _0x53aa3b["delete"]()).then(() => {
      document.cookie = "matchid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      successToast("Xoá phòng trò chơi thành công", 0xbb8, "top", "right", true, false, '');
      fetchMatches(userUid);
    })['catch'](_0x2ca591 => {
      console.error("Error deleting match:", _0x2ca591);
      failToast("Xoá phòng trò chơi thất bại", 0xbb8, 'top', 'right', true, false, '');
    });
  })["catch"](_0x45b3db => {
    console.error("Error retrieving match data:", _0x45b3db);
    failToast("Đã xảy ra lỗi khi lấy thông tin phòng trò chơi", 0xbb8, "top", 'right', true, false, '');
  });
  const _0x372a34 = firebase.database().ref(_0x5921ba);
  const _0x3a7d2b = firebase.database().ref("MatchList/" + _0x5921ba);
  const _0x5eec99 = firestoreDB.collection('match').doc(auth.currentUser.uid);
  deleteAllFilesAndFolders(_0x5921ba);
  _0x372a34.remove().then(() => _0x3a7d2b.remove()).then(() => _0x5eec99["delete"]()).then(() => {
    document.cookie = "matchid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    successToast("Xoá phòng trò chơi thành công", 0xbb8, 'top', "right", true, false, '');
    fetchMatches(userUid);
  })["catch"](_0x196be8 => {
    console.error("Error deleting match:", _0x196be8);
    failToast("Xoá phòng trò chơi thất bại", 0xbb8, 'top', "right", true, false, '');
  });
}
function deleteAllFilesAndFolders(_0x102ff7) {
  const _0xdbfe25 = firebase.storage().ref();
  const _0x1ff7b2 = _0xdbfe25.child(_0x102ff7 + '/');
  function _0x14baea(_0x1b056d) {
    return _0x1b056d.listAll().then(_0xfeb59f => {
      const _0x2e2d26 = [];
      _0xfeb59f.items.forEach(_0x52295a => {
        _0x2e2d26.push(_0x52295a["delete"]());
      });
      const _0x3bbeac = _0xfeb59f.prefixes.map(_0x40f077 => {
        return _0x14baea(_0x40f077);
      });
      return Promise.all([..._0x2e2d26, ..._0x3bbeac]);
    });
  }
  _0x14baea(_0x1ff7b2).then(() => {
    console.log("All files and folders in " + _0x102ff7 + "/ have been deleted.");
    successToast("Đã xoá tất cả tệp và thư mục con", 0xbb8, "top", "right", true, false, '');
  })["catch"](_0x2342ea => {
    console.error("Error deleting files and folders:", _0x2342ea);
    failToast("Không thể xoá tệp và thư mục con", 0xbb8, "top", "right", true, false, '');
  });
}
function updatePagination(_0x111c49) {
  const _0x2037d8 = document.querySelector(".pagination-number");
  _0x2037d8.innerHTML = "Hiển thị <b>" + ((currentPage - 0x1) * 0xa + 0x1) + '-' + Math.min(currentPage * 0xa, _0x111c49) + "</b> trong số " + _0x111c49;
  const _0xa7d0d7 = Math.ceil(_0x111c49 / 0xa);
  const _0x588f53 = document.querySelector(".flex.space-x-1");
  _0x588f53.innerHTML = '';
  if (currentPage > 0x1) {
    const _0x35759b = createButton("Trước", () => {
      currentPage--;
      renderTable(allMatches);
    });
    _0x588f53.appendChild(_0x35759b);
  }
  for (let _0x5c3072 = 0x1; _0x5c3072 <= _0xa7d0d7; _0x5c3072++) {
    const _0x148392 = createButton(_0x5c3072.toString(), () => {
      currentPage = _0x5c3072;
      renderTable(allMatches);
    });
    _0x588f53.appendChild(_0x148392);
  }
  if (currentPage < _0xa7d0d7) {
    const _0x135db1 = createButton("Sau", () => {
      currentPage++;
      renderTable(allMatches);
    });
    _0x588f53.appendChild(_0x135db1);
  }
}
function createButton(_0x5e283b, _0x1b4a30) {
  const _0x28cc89 = document.createElement("button");
  _0x28cc89.className = "px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white dark:bg-neutral-800 dark:text-slate-300 border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease";
  _0x28cc89.innerText = _0x5e283b;
  _0x28cc89.onclick = _0x1b4a30;
  return _0x28cc89;
}
function searchMatches() {
  const _0x4cc37d = document.getElementById('searchMatches').value.toLowerCase();
  const _0x472f34 = allMatches.filter(_0x12b42a => _0x12b42a.matchId.toLowerCase().includes(_0x4cc37d) || _0x12b42a.matchName.toLowerCase().includes(_0x4cc37d));
  currentPage = 0x1;
  renderTable(_0x472f34);
}
document.getElementById("searchMatches").addEventListener("input", searchMatches);
function checkExistingMatch() {
  var _0x18d6d1 = document.getElementById("matchshortname").value.toUpperCase();
  var _0xef6843 = document.getElementById("matchfullname").value;
  var _0x4b61e0 = document.getElementById('matchpassword').value;
  var _0x1c056c = firebase.database().ref('/');
  var _0x34b253 = _0x1c056c.child(_0x18d6d1);
  if (_0xef6843 == '' || _0x4b61e0 == '') {
    failToast("Vui lòng điền đầy đủ thông tin", 0xbb8, 'top', "right", true, false, '');
    return false;
  }
  _0x34b253.once("value", function (_0x2e7bd3) {
    if (_0x2e7bd3.exists()) {
      failToast("Mã trận này đã tồn tại", 0xbb8, "top", "right", true, false, '');
    } else {
      createMatch();
      return false;
    }
  });
}
function createMatch() {
  const _0x166213 = document.getElementById('matchshortname').value.toUpperCase();
  const _0x4b75c0 = document.getElementById("matchfullname").value;
  const _0x156bce = document.getElementById("matchpassword").value;
  const _0x15b401 = {
    'password': _0x156bce,
    'host': userName,
    'match': _0x4b75c0,
    'hostid': userUid
  };
  const _0x2106a0 = {
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
      'match': _0x4b75c0
    },
    'kd': Array.from({
      'length': 0x6
    }, (_0x405563, _0x473f71) => ({
      ["cau" + (_0x473f71 + 0x1)]: '',
      ["dacau" + (_0x473f71 + 0x1)]: ''
    })).reduce((_0x3ac686, _0x3804b0) => ({
      ..._0x3ac686,
      ..._0x3804b0
    }), {}),
    'chp': Array.from({
      'length': 0xa
    }, (_0x32a61f, _0x457ae1) => ({
      ["cau" + (_0x457ae1 + 0x1)]: '',
      ["dacau" + (_0x457ae1 + 0x1)]: ''
    })).reduce((_0x32cb40, _0x3b3278) => ({
      ..._0x32cb40,
      ..._0x3b3278
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
    }, (_0x128893, _0x2b297d) => ({
      ["cau" + (_0x2b297d + 0x1)]: '',
      ['dacau' + (_0x2b297d + 0x1)]: ''
    })).reduce((_0x75828e, _0x35c3a3) => ({
      ..._0x75828e,
      ..._0x35c3a3
    }), {}),
    'L2': Array.from({
      'length': 0x19
    }, (_0x4153c3, _0x126411) => ({
      ["cau" + (_0x126411 + 0x1)]: '',
      ["dacau" + (_0x126411 + 0x1)]: ''
    })).reduce((_0x7b5c4d, _0x5b6925) => ({
      ..._0x7b5c4d,
      ..._0x5b6925
    }), {}),
    'L3': Array.from({
      'length': 0x23
    }, (_0x10335b, _0x3f37a1) => ({
      ["cau" + (_0x3f37a1 + 0x1)]: '',
      ['dacau' + (_0x3f37a1 + 0x1)]: ''
    })).reduce((_0x47d44d, _0x12e03b) => ({
      ..._0x47d44d,
      ..._0x12e03b
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
  const _0x227454 = {
    'matchhostid': userUid,
    'matchhostname': userName,
    'matchid': _0x166213,
    'matchname': _0x4b75c0
  };
  const _0xe3b8ef = firebase.database().ref(_0x166213);
  _0xe3b8ef.set(_0x15b401);
  _0xe3b8ef.child('Acceleration/QS').set(_0x2106a0.tangtoc);
  _0xe3b8ef.child("VCNVPlayed/").set(_0x2106a0.sohangngang);
  _0xe3b8ef.child("AccelerationDisplayAnswerImage").set(_0x2106a0.status2);
  for (let _0x5885c8 = 0x1; _0x5885c8 <= 0x4; _0x5885c8++) {
    _0xe3b8ef.child('AccelerationAnswer/TS' + _0x5885c8 + "/Answer").set(_0x2106a0.answer);
    _0xe3b8ef.child('AccelerationAnswer/TS' + _0x5885c8 + "/CorrectOrWrong").set(_0x2106a0.correctorwrong);
    _0xe3b8ef.child("AccelerationAnswer/TS" + _0x5885c8 + '/Timestamp').set(_0x2106a0.timestamp);
    _0xe3b8ef.child("AccelerationChecked/TT" + _0x5885c8).set(_0x2106a0.correctorwrong);
    _0xe3b8ef.child("AccelerationQuestion/QS" + _0x5885c8).set(_0x2106a0.cauhoidapan);
    _0xe3b8ef.child("StartQuestion/Q" + _0x5885c8 + 'DB').set(_0x2106a0.kd);
    _0xe3b8ef.child("VCNVAnswer/TS" + _0x5885c8).set(_0x2106a0.answer);
    _0xe3b8ef.child("VCNVAnswer/TS" + _0x5885c8 + "/dunghaysai").set(_0x2106a0.dunghaysai);
    _0xe3b8ef.child('VCNVChuong/TS' + _0x5885c8).set(_0x2106a0.chuong);
    _0xe3b8ef.child("VCNVChuongTimeStamp/TS" + _0x5885c8).set(_0x2106a0.timestamp);
    _0xe3b8ef.child("VCNVQuestion/HN" + _0x5885c8).set(_0x2106a0.cauhoidapan);
    _0xe3b8ef.child("VCNVImageStatus/HA" + _0x5885c8).set(_0x2106a0.status);
    _0xe3b8ef.child('VCNVRowStatus/HN' + _0x5885c8).set(_0x2106a0.status);
    _0xe3b8ef.child("VCNVDisable/TS" + _0x5885c8).set(_0x2106a0.disabled);
  }
  _0xe3b8ef.child("VCNVImageStatus/HATT").set(_0x2106a0.status);
  _0xe3b8ef.child("VCNVRowStatus/HATT").set(_0x2106a0.status);
  _0xe3b8ef.child("VCNVQuestion/HNTT").set(_0x2106a0.cauhoidapan);
  _0xe3b8ef.child("VCNVQuestion/CNVKeyType").set(_0x2106a0.keytype);
  _0xe3b8ef.child("VCNVAudio").set(_0x2106a0.audio);
  for (let _0x8d56ae = 0x1; _0x8d56ae <= 0x4; _0x8d56ae++) {
    for (let _0x58f8a2 = 0xa; _0x58f8a2 <= 0x1e; _0x58f8a2 += 0xa) {
      for (let _0x53b928 = 0x1; _0x53b928 <= 0x3; _0x53b928++) {
        _0xe3b8ef.child("FinishQuestion/Q" + _0x8d56ae + "DB/QP" + _0x58f8a2 + '/' + _0x53b928).set(_0x2106a0.cauhoidapan);
      }
    }
  }
  for (let _0x3b0037 = 0x1; _0x3b0037 <= 0x3; _0x3b0037++) {
    for (let _0x2df8a9 = 0x1; _0x2df8a9 <= 0x3; _0x2df8a9++) {
      _0xe3b8ef.child("FinishQuestionChoose/TS" + _0x3b0037 + '/' + _0x2df8a9).set({
        ['cau' + _0x2df8a9]: 0x0
      });
    }
  }
  _0xe3b8ef.child("VCNVAnswer/kiemtradapan").set(_0x2106a0.kiemtra);
  _0xe3b8ef.child("Banner/Elements").set(_0x2106a0.BannerElements);
  _0xe3b8ef.child("Banner/Music").set(_0x2106a0.BannerMusic);
  _0xe3b8ef.child("AccelerationOpenAnswer/").set(_0x2106a0.openanswer);
  _0xe3b8ef.child('VCNVChuong/OpenAll').set(_0x2106a0.correct);
  _0xe3b8ef.child('VCNVQuestion/CNV').set(_0x2106a0.cnv);
  _0xe3b8ef.child("FinishPoint/status").set(_0x2106a0.status);
  _0xe3b8ef.child("FinishVideoState/VD").set(_0x2106a0.video);
  _0xe3b8ef.child('Match/Host/').set(_0x2106a0.host);
  _0xe3b8ef.child("Match/Name/").set(_0x2106a0.match);
  _0xe3b8ef.child("Sounds/").set(_0x2106a0.Sounds);
  _0xe3b8ef.child("StartEmergencyStop").set(_0x2106a0.stop);
  _0xe3b8ef.child("VCNV/hangngang").set(_0x2106a0.hn);
  _0xe3b8ef.child('KDO22Chuong/WaitForAnswer').set(_0x2106a0.status);
  _0xe3b8ef.child("VDCauso").set(_0x2106a0.causo);
  _0xe3b8ef.child("VDPCauso").set(_0x2106a0.causo);
  _0xe3b8ef.child("VDChuong/ChuongStatus").set(_0x2106a0.status);
  _0xe3b8ef.child('VDChuong/CorrectOrWrong').set(_0x2106a0.correctorwrong);
  _0xe3b8ef.child("VDChuong/Player").set(_0x2106a0.chuongplayer);
  _0xe3b8ef.child("VDPChuong/ChuongStatus").set(_0x2106a0.status);
  _0xe3b8ef.child("VDPChuong/CorrectOrWrong").set(_0x2106a0.correctorwrong);
  _0xe3b8ef.child("VDPChuong/Player").set(_0x2106a0.chuongplayer);
  _0xe3b8ef.child('VCNVOpenAnswer').set(_0x2106a0.openanswer);
  _0xe3b8ef.child("VCNV15sCountdown").set(_0x2106a0.countdown);
  _0xe3b8ef.child("VDCorrectOrWrong").set(_0x2106a0.dungsai);
  _0xe3b8ef.child("VDNSHV/status").set(_0x2106a0.status);
  _0xe3b8ef.child("VDPlayerTurnEnd/End").set(_0x2106a0.end);
  _0xe3b8ef.child("chat").set(_0x2106a0.chat);
  _0xe3b8ef.child("ChatDisable").set(_0x2106a0.chatdisabled);
  _0xe3b8ef.child("games/mc").set(_0x2106a0.infoplayer);
  _0xe3b8ef.child("games/mc2").set(_0x2106a0.infoplayer);
  _0xe3b8ef.child('games/player1').set(_0x2106a0.infoplayer);
  _0xe3b8ef.child("games/player2").set(_0x2106a0.infoplayer);
  _0xe3b8ef.child("games/player3").set(_0x2106a0.infoplayer);
  _0xe3b8ef.child("games/player4").set(_0x2106a0.infoplayer);
  _0xe3b8ef.child("games/player5").set(_0x2106a0.infoplayer);
  _0xe3b8ef.child("gamestatus/banner").set(_0x2106a0.banner);
  _0xe3b8ef.child("gamestatus/khoidong").set(_0x2106a0.start);
  _0xe3b8ef.child("gamestatus/tangtoc").set(_0x2106a0.tangtoc);
  _0xe3b8ef.child("gamestatus/tongketdiem").set(_0x2106a0.tongketdiem);
  _0xe3b8ef.child("gamestatus/vcnv").set(_0x2106a0.vcnv);
  _0xe3b8ef.child('gamestatus/vedich').set(_0x2106a0.vedich);
  _0xe3b8ef.child('gamestatus/vedichphu').set(_0x2106a0.vedichphu);
  _0xe3b8ef.child("intro").set(_0x2106a0.intro);
  _0xe3b8ef.child("IntroNum").set(_0x2106a0.intro);
  _0xe3b8ef.child("khoidong").set(_0x2106a0.causo);
  _0xe3b8ef.child("khoidongdungsai").set(_0x2106a0.khoidongdungsai);
  _0xe3b8ef.child('phanthistatus/khoidong').set(_0x2106a0.batdau);
  _0xe3b8ef.child("phanthistatus/tangtoc").set(_0x2106a0.batdau);
  _0xe3b8ef.child("phanthistatus/vcnv").set(_0x2106a0.batdau);
  _0xe3b8ef.child('phanthistatus/vedich').set(_0x2106a0.batdau);
  _0xe3b8ef.child('playerstatus/khoidong').set(_0x2106a0.player);
  _0xe3b8ef.child("playerstatus/vedich").set(_0x2106a0.player);
  _0xe3b8ef.child("point/player").set(_0x2106a0.point);
  _0xe3b8ef.child("point/player1").set(_0x2106a0.point);
  _0xe3b8ef.child("point/player2").set(_0x2106a0.point);
  _0xe3b8ef.child("point/player3").set(_0x2106a0.point);
  _0xe3b8ef.child('point/player4').set(_0x2106a0.point);
  _0xe3b8ef.child("replayintro").set(_0x2106a0.intro);
  _0xe3b8ef.child("CHPQuestion").set(_0x2106a0.chp);
  _0xe3b8ef.child("VDPChuongDisable/TS1").set(_0x2106a0.chuongdisable);
  _0xe3b8ef.child("VDPChuongDisable/TS2").set(_0x2106a0.chuongdisable);
  _0xe3b8ef.child("VDPChuongDisable/TS3").set(_0x2106a0.chuongdisable);
  _0xe3b8ef.child("VDPChuongDisable/TS4").set(_0x2106a0.chuongdisable);
  _0xe3b8ef.child('KDO22AnswerRights').set(_0x2106a0.kdvalue);
  _0xe3b8ef.child('KDO223sCountdown').set(_0x2106a0.countdown);
  _0xe3b8ef.child("KDO22Causo").set(_0x2106a0.causo);
  _0xe3b8ef.child("KDO22Chuong/ChuongStatus").set(_0x2106a0.status);
  _0xe3b8ef.child("KDO22Chuong/CorrectOrWrong").set(_0x2106a0.correctorwrong);
  _0xe3b8ef.child("KDO22Chuong/Player").set(_0x2106a0.id);
  _0xe3b8ef.child("KDO22ChuongDisable/TS1").set(_0x2106a0.disable);
  _0xe3b8ef.child("KDO22ChuongDisable/TS2").set(_0x2106a0.disable);
  _0xe3b8ef.child("KDO22ChuongDisable/TS3").set(_0x2106a0.disable);
  _0xe3b8ef.child("KDO22ChuongDisable/TS4").set(_0x2106a0.disable);
  _0xe3b8ef.child("KDO22Question/L1").set(_0x2106a0.L1);
  _0xe3b8ef.child("KDO22Question/L2").set(_0x2106a0.L2);
  _0xe3b8ef.child('KDO22Question/L3').set(_0x2106a0.L3);
  _0xe3b8ef.child("KDO22Turn").set(_0x2106a0.turn);
  _0xe3b8ef.child('KDO22LuotThiStatus').set(_0x2106a0.statuslt);
  firebase.database().ref('/MatchList/' + _0x166213).set(_0x227454);
  setCookie("matchid", _0x166213, 0x78);
  firebase.firestore().collection("match").doc(auth.currentUser.uid).set({
    'match': _0x166213
  });
  localStorage.setItem('match', _0x166213);
  successToast("Tạo phòng trò chơi thành công", 0xbb8, "top", 'right', true, false, '');
  fetchMatches(userUid);
}
const matchCreateForm = document.getElementById("matchCreateForm");
matchCreateForm.addEventListener("submit", _0xed1d8a => {
  _0xed1d8a.preventDefault();
  checkExistingMatch();
});
function setCookie(_0xe3028f, _0x1ac149, _0x1e2a6d) {
  var _0x56bbd7 = new Date();
  _0x56bbd7.setTime(_0x56bbd7.getTime() + _0x1e2a6d * 0x18 * 0x3c * 0x3c * 0x3e8);
  var _0x1efaf5 = 'expires=' + _0x56bbd7.toUTCString();
  document.cookie = _0xe3028f + '=' + _0x1ac149 + ';' + _0x1efaf5 + ";path=/";
}