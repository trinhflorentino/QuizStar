function changeMode(_0x317e7a) {
  localStorage.setItem("mode", _0x317e7a);
  document.documentElement.className = _0x317e7a === "dark" ? 'dark' : '';
  updateIcon(_0x317e7a);
}
function toggleTheme() {
  var _0x30750d = localStorage.getItem("mode");
  if (_0x30750d === 'dark') {
    changeMode("light");
  } else {
    changeMode('dark');
  }
}
function updateIcon(_0x284bc0) {
  var _0x56521d = document.getElementById("themeIcon");
  if (_0x56521d) {
    _0x56521d.textContent = _0x284bc0 === "dark" ? "light_mode" : "dark_mode";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  var _0x16abea = localStorage.getItem("mode") || 'light';
  changeMode(_0x16abea);
});
window.addEventListener("storage", function (_0x1b8b62) {
  if (_0x1b8b62.key === "mode") {
    changeMode(_0x1b8b62.newValue);
  }
});
let isUpdatingMode = false;
const originalSetItem = localStorage.setItem;
localStorage.setItem = function (_0x89dd62, _0x542f38) {
  if (!isUpdatingMode && _0x89dd62 === "mode" && localStorage.getItem(_0x89dd62) !== _0x542f38) {
    const _0xda3355 = new Event("localStorageChange");
    _0xda3355.key = _0x89dd62;
    _0xda3355.newValue = _0x542f38;
    window.dispatchEvent(_0xda3355);
  }
  originalSetItem.apply(this, arguments);
};
window.addEventListener("localStorageChange", function (_0x544c54) {
  if (_0x544c54.key === 'mode') {
    isUpdatingMode = true;
    changeMode(_0x544c54.newValue);
    isUpdatingMode = false;
  }
});
document.querySelectorAll(".tab-button").forEach(_0x2411c2 => {
  _0x2411c2.addEventListener("click", () => {
    const _0x4ebf5d = _0x2411c2.getAttribute("data-tab-target").slice(0x1);
    const _0xb1d7f1 = document.querySelectorAll(".tab-content");
    const _0x36fc10 = document.getElementById("appLogoImage");
    const _0x16e469 = document.getElementById('userAvatar');
    const _0x1e6e1d = document.getElementById("themeCustomizationButton");
    const _0xf3a11a = document.getElementById('matchListButton');
    const _0x59973a = document.getElementById("videoButton");
    const _0x421532 = document.documentElement.classList.contains("dark");
    _0xb1d7f1.forEach(_0x4086b8 => {
      if (_0x4086b8.id === _0x4ebf5d) {
        _0x4086b8.classList.remove("hidden");
        _0x4086b8.classList.add('block');
        switch (_0x4ebf5d) {
          case 'home':
            _0x36fc10.src = "img/appLogo.png";
            _0x16e469.classList.remove("border-4", "border-blue-500");
            _0x1e6e1d.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            _0xf3a11a.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-blue-500');
            _0x59973a.classList.remove("bg-gradient-to-r", 'from-cyan-500', "to-blue-500");
            break;
          case 'theme':
            _0x36fc10.src = _0x421532 ? 'img/appLogo-white.png' : "img/appLogo-black.png";
            _0x16e469.classList.remove("border-4", 'border-blue-500');
            _0x1e6e1d.classList.add('bg-gradient-to-r', "from-cyan-500", "to-blue-500");
            _0xf3a11a.classList.remove("bg-gradient-to-r", 'from-cyan-500', "to-blue-500");
            _0x59973a.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            break;
          case "matches":
            _0x36fc10.src = _0x421532 ? 'img/appLogo-white.png' : "img/appLogo-black.png";
            _0x16e469.classList.remove("border-4", "border-blue-500");
            _0x1e6e1d.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            _0xf3a11a.classList.add("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            _0x59973a.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            break;
          case "profile":
            _0x36fc10.src = _0x421532 ? "img/appLogo-white.png" : "img/appLogo-black.png";
            _0x16e469.classList.add('border-4', "border-blue-500");
            _0x1e6e1d.classList.remove('bg-gradient-to-r', 'from-cyan-500', "to-blue-500");
            _0xf3a11a.classList.remove("bg-gradient-to-r", 'from-cyan-500', "to-blue-500");
            _0x59973a.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
            break;
          case "video":
            _0x36fc10.src = _0x421532 ? 'img/appLogo-white.png' : "img/appLogo-black.png";
            _0x16e469.classList.remove("border-4", "border-blue-500");
            _0x1e6e1d.classList.remove("bg-gradient-to-r", "from-cyan-500", 'to-blue-500');
            _0xf3a11a.classList.remove('bg-gradient-to-r', "from-cyan-500", "to-blue-500");
            _0x59973a.classList.add('bg-gradient-to-r', "from-cyan-500", 'to-blue-500');
            break;
        }
      } else {
        _0x4086b8.classList.add("hidden");
        _0x4086b8.classList.remove("block");
      }
    });
  });
});
function togglePassword(_0x355f26, _0x2c52e9) {
  const _0x31ba98 = document.getElementById(_0x355f26);
  const _0x2c27aa = _0x31ba98.getAttribute("type") === "password" ? "text" : "password";
  _0x31ba98.setAttribute('type', _0x2c27aa);
  _0x2c52e9.innerHTML = _0x2c27aa === "password" ? "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z\" />\n        </svg>" : "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13.875 18.825A8.968 8.968 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.083-3.448 4.01-6.195 7.293-6.779M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6.07 6.07l11.32 11.32\" />\n        </svg>";
}