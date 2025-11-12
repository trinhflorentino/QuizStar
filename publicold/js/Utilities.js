function changeMode(_0x1ed99e) {
    localStorage.setItem('mode', _0x1ed99e);
    document.documentElement.className = _0x1ed99e === "dark" ? "dark" : '';
    updateIcon(_0x1ed99e);
  }
  function toggleTheme() {
    var _0x45f8c9 = localStorage.getItem("mode");
    if (_0x45f8c9 === 'dark') {
      changeMode('light');
    } else {
      changeMode("dark");
    }
  }
  function updateIcon(_0x3d74b3) {
    var _0x2f5941 = document.getElementById("themeIcon");
    if (_0x2f5941) {
      _0x2f5941.textContent = _0x3d74b3 === 'dark' ? "light_mode" : "dark_mode";
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    var _0x25cab3 = localStorage.getItem("mode") || "light";
    changeMode(_0x25cab3);
  });
  window.addEventListener("storage", function (_0x178677) {
    if (_0x178677.key === "mode") {
      changeMode(_0x178677.newValue);
    }
  });
  let isUpdatingMode = false;
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (_0x173c02, _0x54d637) {
    if (!isUpdatingMode && _0x173c02 === "mode" && localStorage.getItem(_0x173c02) !== _0x54d637) {
      const _0x30ca4f = new Event("localStorageChange");
      _0x30ca4f.key = _0x173c02;
      _0x30ca4f.newValue = _0x54d637;
      window.dispatchEvent(_0x30ca4f);
    }
    originalSetItem.apply(this, arguments);
  };
  window.addEventListener("localStorageChange", function (_0x1de15a) {
    if (_0x1de15a.key === "mode") {
      isUpdatingMode = true;
      changeMode(_0x1de15a.newValue);
      isUpdatingMode = false;
    }
  });
  document.querySelectorAll('.tab-button').forEach(_0x41e8e1 => {
    _0x41e8e1.addEventListener('click', () => {
      const _0x5d2a31 = _0x41e8e1.getAttribute("data-tab-target").slice(0x1);
      const _0x552820 = document.querySelectorAll(".tab-content");
      const _0x2576ed = document.getElementById('appLogoImage');
      const _0x1b9606 = document.getElementById("userAvatar");
      const _0x3a9e7c = document.getElementById('themeCustomizationButton');
      const _0x320ecd = document.getElementById('matchListButton');
      const _0x29c512 = document.getElementById("videoButton");
      const _0x1902ae = document.documentElement.classList.contains('dark');
      _0x552820.forEach(_0x51c906 => {
        if (_0x51c906.id === _0x5d2a31) {
          _0x51c906.classList.remove("hidden");
          _0x51c906.classList.add("block");
          switch (_0x5d2a31) {
            case "home":
              _0x2576ed.src = "img/appLogo.png";
              _0x1b9606.classList.remove("border-4", "border-blue-500");
              _0x3a9e7c.classList.remove("bg-gradient-to-r", "from-cyan-500", 'to-blue-500');
              _0x320ecd.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              _0x29c512.classList.remove("bg-gradient-to-r", 'from-cyan-500', 'to-blue-500');
              break;
            case 'theme':
              _0x2576ed.src = _0x1902ae ? "img/appLogo-white.png" : "img/appLogo-black.png";
              _0x1b9606.classList.remove("border-4", "border-blue-500");
              _0x3a9e7c.classList.add("bg-gradient-to-r", "from-cyan-500", 'to-blue-500');
              _0x320ecd.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              _0x29c512.classList.remove("bg-gradient-to-r", 'from-cyan-500', "to-blue-500");
              break;
            case 'matches':
              _0x2576ed.src = _0x1902ae ? "img/appLogo-white.png" : "img/appLogo-black.png";
              _0x1b9606.classList.remove("border-4", "border-blue-500");
              _0x3a9e7c.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              _0x320ecd.classList.add("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              _0x29c512.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              break;
            case "profile":
              _0x2576ed.src = _0x1902ae ? "img/appLogo-white.png" : "img/appLogo-black.png";
              _0x1b9606.classList.add("border-4", "border-blue-500");
              _0x3a9e7c.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              _0x320ecd.classList.remove("bg-gradient-to-r", "from-cyan-500", 'to-blue-500');
              _0x29c512.classList.remove("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              break;
            case "video":
              _0x2576ed.src = _0x1902ae ? "img/appLogo-white.png" : 'img/appLogo-black.png';
              _0x1b9606.classList.remove("border-4", "border-blue-500");
              _0x3a9e7c.classList.remove("bg-gradient-to-r", 'from-cyan-500', "to-blue-500");
              _0x320ecd.classList.remove('bg-gradient-to-r', "from-cyan-500", "to-blue-500");
              _0x29c512.classList.add("bg-gradient-to-r", "from-cyan-500", "to-blue-500");
              break;
          }
        } else {
          _0x51c906.classList.add("hidden");
          _0x51c906.classList.remove("block");
        }
      });
    });
  });
  function togglePassword(_0x41f915, _0x5bcd79) {
    const _0x541c38 = document.getElementById(_0x41f915);
    const _0x414a9a = _0x541c38.getAttribute("type") === "password" ? "text" : "password";
    _0x541c38.setAttribute('type', _0x414a9a);
    _0x5bcd79.innerHTML = _0x414a9a === 'password' ? "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z\" />\n        </svg>" : "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 text-gray-500\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13.875 18.825A8.968 8.968 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.083-3.448 4.01-6.195 7.293-6.779M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6.07 6.07l11.32 11.32\" />\n        </svg>";
  }