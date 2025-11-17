let PLAYER_LIMIT = 0x4;
function changeMode(_0x3da1d8) {
  localStorage.setItem("mode", _0x3da1d8);
  document.documentElement.className = _0x3da1d8 === "dark" ? 'dark' : '';
  updateIcon(_0x3da1d8);
}
function toggleTheme() {
  var _0x12ea44 = localStorage.getItem("mode");
  if (_0x12ea44 === "dark") {
    changeMode("light");
  } else {
    changeMode("dark");
  }
}
function updateIcon(_0x5b08b7) {
  var _0xfbbc63 = document.getElementById("themeIcon");
  if (_0xfbbc63) {
    _0xfbbc63.textContent = _0x5b08b7 === "dark" ? "light_mode" : 'dark_mode';
  }
}
document.addEventListener("DOMContentLoaded", function () {
  var _0x1340af = localStorage.getItem("mode") || "light";
  changeMode(_0x1340af);
});
window.addEventListener("storage", function (_0x53ca87) {
  if (_0x53ca87.key === "mode") {
    changeMode(_0x53ca87.newValue);
  }
});
let isUpdatingMode = false;
const originalSetItem = localStorage.setItem;
localStorage.setItem = function (_0x4a2ce5, _0x12a43f) {
  if (!isUpdatingMode && _0x4a2ce5 === 'mode' && localStorage.getItem(_0x4a2ce5) !== _0x12a43f) {
    const _0x30a012 = new Event("localStorageChange");
    _0x30a012.key = _0x4a2ce5;
    _0x30a012.newValue = _0x12a43f;
    window.dispatchEvent(_0x30a012);
  }
  originalSetItem.apply(this, arguments);
};
window.addEventListener("localStorageChange", function (_0x15a9cf) {
  if (_0x15a9cf.key === "mode") {
    isUpdatingMode = true;
    changeMode(_0x15a9cf.newValue);
    isUpdatingMode = false;
  }
});
document.querySelectorAll(".tab-button").forEach(_0x2a525f => {
  _0x2a525f.addEventListener('click', () => {
    const _0x2fc834 = _0x2a525f.getAttribute('data-tab-target').slice(0x1);
    const _0x2bf138 = document.querySelectorAll('.tab-content');
    const _0x49bc8a = document.getElementById('appLogoImage');
    const _0x587f02 = document.getElementById("userAvatar");
    const _0x4a336d = document.getElementById("themeCustomizationButton");
    const _0x5625fa = document.getElementById('matchListButton');
    const _0x4822bc = document.getElementById("videoButton");
    const _0x239364 = document.documentElement.classList.contains("dark");
    _0x2bf138.forEach(_0x4e7e5d => {
      if (_0x4e7e5d.id === _0x2fc834) {
        _0x4e7e5d.classList.remove("hidden");
        _0x4e7e5d.classList.add('block');
        switch (_0x2fc834) {
          case "home":
            // _0x49bc8a.src = "img/appLogo.png";
            _0x587f02.classList.remove('border-4', "border-blue-500");
            _0x4a336d.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            _0x5625fa.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            _0x4822bc.classList.remove("bg-gradient-to-r", 'from-cyan-500', 'to-blue-500');
            break;
          case "theme":
            // _0x49bc8a.src = _0x239364 ? 'img/appLogo-white.png' : "img/appLogo-black.png";
            _0x587f02.classList.remove("border-4", "border-blue-500");
            _0x4a336d.classList.add("bg-gradient-to-r", 'from-cyan-500', "to-blue-500");
            _0x5625fa.classList.remove('bg-gradient-to-r', "from-cyan-500", "to-blue-500");
            _0x4822bc.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            break;
          case "matches":
            // _0x49bc8a.src = _0x239364 ? "img/appLogo-white.png" : 'img/appLogo-black.png';
            _0x587f02.classList.remove('border-4', "border-blue-500");
            _0x4a336d.classList.remove('bg-gradient-to-r', "from-cyan-500", "to-blue-500");
            _0x5625fa.classList.add("bg-gradient-to-r", "from-cyan-500", 'to-blue-500');
            _0x4822bc.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            break;
          case "profile":
            // _0x49bc8a.src = _0x239364 ? "img/appLogo-white.png" : 'img/appLogo-black.png';
            _0x587f02.classList.add("border-4", 'border-blue-500');
            _0x4a336d.classList.remove("bg-gradient-to-r", "from-cyan-500", 'to-blue-500');
            _0x5625fa.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            _0x4822bc.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            break;
          case 'video':
            // _0x49bc8a.src = _0x239364 ? "img/appLogo-white.png" : "img/appLogo-black.png";
            _0x587f02.classList.remove("border-4", "border-blue-500");
            _0x4a336d.classList.remove('bg-gradient-to-r', "from-cyan-500", "to-blue-500");
            _0x5625fa.classList.remove('bg-gradient-to-r', "from-cyan-500", "to-blue-500");
            _0x4822bc.classList.add('bg-gradient-to-r', "from-cyan-500", 'to-blue-500');
            break;
        }
      } else {
        _0x4e7e5d.classList.add("hidden");
        _0x4e7e5d.classList.remove("block");
      }
    });
  });
});
function togglePassword(_0x14d623, _0x58dce7) {
  const _0x21d9a9 = document.getElementById(_0x14d623);
  const _0xa65d0b = _0x21d9a9.getAttribute("type") === "password" ? "text" : 'password';
  _0x21d9a9.setAttribute("type", _0xa65d0b);
  _0x58dce7.innerHTML = _0xa65d0b === "password" ? "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z\" />\n        </svg>" : "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13.875 18.825A8.968 8.968 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.083-3.448 4.01-6.195 7.293-6.779M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6.07 6.07l11.32 11.32\" />\n        </svg>";
}
function setupAudioControls(_0x23fc9e, _0x35a6d8, _0x1eb04b, _0x26ff46) {
  const _0x2085cf = {
    'additional': "AdditionalQuestionAudioContainer",
    'obstacle': "ObstacleQuestionAudioContainer",
    'finish': 'FinishQuestionAudioContainer',
    'startI': "StartIQuestionAudioContainer",
    'startII': "StartIIQuestionAudioContainer"
  };
  const _0x27cef0 = document.getElementById(_0x2085cf[_0x23fc9e]);
  if (!_0x27cef0) {
    return;
  }
  _0x27cef0.classList.remove("hidden");
  _0x27cef0.classList.add('flex');
  _0x27cef0.innerHTML = "\n        <span class=\"material-icons text-black dark:text-white mr-2\" id=\"" + _0x23fc9e + "AudioIcon\">\n            play_arrow\n        </span>\n        <span class=\"text-sm font-medium text-black dark:text-white\" id=\"" + _0x23fc9e + "AudioText\">\n            Phát âm thanh câu hỏi\n        </span>\n    ";
  _0x27cef0.classList.add("cursor-pointer", "hover:bg-gray-400", "dark:hover:bg-neutral-600");
  _0x27cef0.style.transition = "background-color 0.2s";
  _0x27cef0.onclick = () => {
    const _0x419264 = realtimeDB.ref(_0x1eb04b + "/AudioControl/" + _0x23fc9e);
    _0x419264.once('value', _0x5cbc51 => {
      const _0x4fae85 = _0x5cbc51.val();
      const _0x2f439f = _0x4fae85?.["isPlaying"] || false;
      _0x419264.set({
        'isPlaying': !_0x2f439f,
        'audioData': _0x35a6d8,
        'questionNumber': _0x26ff46,
        'timestamp': firebase.database.ServerValue.TIMESTAMP
      });
    });
  };
  const _0x21af7a = realtimeDB.ref(_0x1eb04b + '/AudioControl/' + _0x23fc9e);
  _0x21af7a.on("value", _0x50c859 => {
    const _0x4e37b3 = _0x50c859.val();
    const _0xa30dae = document.getElementById(_0x23fc9e + "AudioIcon");
    const _0x7d3faf = document.getElementById(_0x23fc9e + "AudioText");
    if (_0x4e37b3?.["isPlaying"]) {
      if (_0xa30dae) {
        _0xa30dae.textContent = 'pause';
      }
      if (_0x7d3faf) {
        _0x7d3faf.textContent = "Tạm dừng âm thanh";
      }
      _0x27cef0.classList.add('bg-green-200', "dark:bg-green-800");
    } else {
      if (_0xa30dae) {
        _0xa30dae.textContent = "play_arrow";
      }
      if (_0x7d3faf) {
        _0x7d3faf.textContent = "Phát âm thanh câu hỏi";
      }
      _0x27cef0.classList.remove("bg-green-200", "dark:bg-green-800");
    }
  });
}
function setPlayerLimit(_0x24f0a9) {
  PLAYER_LIMIT = parseInt(_0x24f0a9);
  localStorage.setItem("player_limit", PLAYER_LIMIT.toString());
  const _0x1db1fa = new CustomEvent('playerLimitChanged', {
    'detail': {
      'playerLimit': PLAYER_LIMIT
    }
  });
  window.dispatchEvent(_0x1db1fa);
}
function getPlayerLimit() {
  const _0x38d852 = localStorage.getItem("player_limit");
  if (_0x38d852) {
    PLAYER_LIMIT = parseInt(_0x38d852);
  }
  return PLAYER_LIMIT;
}
function initializePlayerLimit() {
  const _0x3c62ce = localStorage.getItem("player_limit");
  if (_0x3c62ce) {
    PLAYER_LIMIT = parseInt(_0x3c62ce);
  }
  const _0x275b31 = document.getElementById('playerLimit4');
  const _0x9c0dc7 = document.getElementById("playerLimit5");
  if (_0x275b31 && _0x9c0dc7) {
    if (PLAYER_LIMIT === 0x5) {
      _0x9c0dc7.checked = true;
      _0x275b31.checked = false;
    } else {
      _0x275b31.checked = true;
      _0x9c0dc7.checked = false;
    }
  }
}
document.addEventListener('DOMContentLoaded', function () {
  initializePlayerLimit();
});