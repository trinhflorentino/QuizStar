(function () {
    var _0x17ab36 = document.querySelectorAll('[data-tabs]');
    var _0x725db4 = function _0x292713(_0x289794) {
      _0x289794 = _0x289794 || window.event;
      return _0x289794.target || _0x289794.srcElement;
    };
    _0x17ab36.forEach(function (_0x12a88d, _0x41d54f) {
      var _0x46a283 = document.createElement('div');
      var _0x44f1cd = _0x12a88d.querySelector("li:first-child [data-tab-target]");
      var _0x21f81e = _0x44f1cd.cloneNode();
      _0x21f81e.innerHTML = '-';
      _0x21f81e.classList.remove("bg-inherit", "text-slate-700");
      _0x21f81e.classList.add("bg-white", "text-white");
      _0x21f81e.style.animation = ".2s ease";
      _0x46a283.classList.add("z-10", "absolute", 'text-slate-700', "rounded-lg", 'bg-inherit', "flex-auto", "text-center", 'bg-none', 'border-0', 'block', 'shadow');
      _0x46a283.setAttribute("moving-tab", '');
      _0x46a283.setAttribute("data-tab-target", '');
      _0x46a283.appendChild(_0x21f81e);
      _0x12a88d.appendChild(_0x46a283);
      _0x46a283.style.padding = "0px";
      _0x46a283.style.width = _0x12a88d.querySelector('li:nth-child(1)').offsetWidth + 'px';
      _0x46a283.style.transform = "translate3d(0px, 0px, 0px)";
      _0x46a283.style.transition = ".5s ease";
      _0x12a88d.onmouseover = function (_0x5c2cca) {
        var _0x538913 = _0x725db4(_0x5c2cca);
        var _0x34b0b5 = _0x538913.closest('li');
        if (_0x34b0b5) {
          var _0x51e68c = Array.from(_0x34b0b5.closest('ul').children);
          var _0x21bf93 = _0x51e68c.indexOf(_0x34b0b5) + 0x1;
          _0x12a88d.querySelector('li:nth-child(' + _0x21bf93 + ") [data-tab-target]").onclick = function () {
            _0x12a88d.querySelectorAll('li').forEach(function (_0xb3f3b9) {
              _0xb3f3b9.firstElementChild.removeAttribute("active");
              _0xb3f3b9.firstElementChild.setAttribute("aria-selected", "false");
            });
            _0x34b0b5.firstElementChild.setAttribute("active", '');
            _0x34b0b5.firstElementChild.setAttribute("aria-selected", "true");
            _0x46a283 = _0x12a88d.querySelector("[moving-tab]");
            var _0x4bcb82 = 0x0;
            if (_0x12a88d.classList.contains("flex-col")) {
              for (var _0x1d6461 = 0x1; _0x1d6461 <= _0x51e68c.indexOf(_0x34b0b5); _0x1d6461++) {
                _0x4bcb82 += _0x12a88d.querySelector("li:nth-child(" + _0x1d6461 + ')').offsetHeight;
              }
              _0x46a283.style.transform = "translate3d(0px," + _0x4bcb82 + "px, 0px)";
              _0x46a283.style.height = _0x12a88d.querySelector("li:nth-child(" + _0x1d6461 + ')').offsetHeight;
            } else {
              for (var _0x1d6461 = 0x1; _0x1d6461 <= _0x51e68c.indexOf(_0x34b0b5); _0x1d6461++) {
                _0x4bcb82 += _0x12a88d.querySelector("li:nth-child(" + _0x1d6461 + ')').offsetWidth;
              }
              _0x46a283.style.transform = "translate3d(" + _0x4bcb82 + "px, 0px, 0px)";
              _0x46a283.style.width = _0x12a88d.querySelector("li:nth-child(" + _0x21bf93 + ')').offsetWidth + 'px';
            }
          };
        }
      };
    });
    window.addEventListener('resize', function (_0x5d964c) {
      _0x17ab36.forEach(function (_0x455625, _0x1d4ce6) {
        _0x455625 = _0x455625.parentElement.firstElementChild;
        _0x455625.querySelector("[moving-tab]").remove();
        var _0x3a3bd = document.createElement("div");
        var _0x16fed2 = _0x455625.querySelector("[data-tab-target][aria-selected='true']").cloneNode();
        _0x16fed2.innerHTML = '-';
        _0x16fed2.classList.remove("bg-inherit");
        _0x16fed2.classList.add('bg-white', "text-white");
        _0x16fed2.style.animation = ".2s ease";
        _0x3a3bd.classList.add("z-10", "absolute", "text-slate-700", "rounded-lg", "bg-inherit", "flex-auto", "text-center", "bg-none", 'border-0', "block", "shadow");
        _0x3a3bd.setAttribute("moving-tab", '');
        _0x3a3bd.setAttribute('data-tab-target', '');
        _0x3a3bd.appendChild(_0x16fed2);
        _0x455625.appendChild(_0x3a3bd);
        _0x3a3bd.style.padding = '0px';
        _0x3a3bd.style.transition = ".5s ease";
        var _0x531933 = _0x455625.querySelector("[data-tab-target][aria-selected='true']").parentElement;
        if (_0x531933) {
          var _0x47fad7 = Array.from(_0x531933.closest('ul').children);
          var _0x2e7f5c = _0x47fad7.indexOf(_0x531933) + 0x1;
          var _0x4edf04 = 0x0;
          if (_0x455625.classList.contains("flex-col")) {
            for (var _0x2b8cdc = 0x1; _0x2b8cdc <= _0x47fad7.indexOf(_0x531933); _0x2b8cdc++) {
              _0x4edf04 += _0x455625.querySelector('li:nth-child(' + _0x2b8cdc + ')').offsetHeight;
            }
            _0x3a3bd.style.transform = 'translate3d(0px,' + _0x4edf04 + "px, 0px)";
            _0x3a3bd.style.width = _0x455625.querySelector("li:nth-child(" + _0x2e7f5c + ')').offsetWidth + 'px';
            _0x3a3bd.style.height = _0x455625.querySelector("li:nth-child(" + _0x2b8cdc + ')').offsetHeight;
          } else {
            for (var _0x2b8cdc = 0x1; _0x2b8cdc <= _0x47fad7.indexOf(_0x531933); _0x2b8cdc++) {
              _0x4edf04 += _0x455625.querySelector("li:nth-child(" + _0x2b8cdc + ')').offsetWidth;
            }
            _0x3a3bd.style.transform = "translate3d(" + _0x4edf04 + "px, 0px, 0px)";
            _0x3a3bd.style.width = _0x455625.querySelector("li:nth-child(" + _0x2e7f5c + ')').offsetWidth + 'px';
          }
        }
      });
      if (window.innerWidth < 0x3df) {
        _0x17ab36.forEach(function (_0x212662, _0x1efb24) {
          if (!_0x212662.classList.contains("flex-col")) {
            _0x212662.classList.add("flex-col", 'on-resize');
          }
        });
      } else {
        _0x17ab36.forEach(function (_0x3b37fc, _0x50d8a0) {
          if (_0x3b37fc.classList.contains("on-resize")) {
            _0x3b37fc.classList.remove("flex-col", "on-resize");
          }
        });
      }
    });
    var _0x17ab36 = document.querySelectorAll('[data-tab-content]');
    if (_0x17ab36[0x0]) {
      _0x17ab36.forEach(function (_0x535282) {
        var _0x1796e2 = _0x535282.parentElement.querySelectorAll("li a[data-tab-target]");
        _0x1796e2.forEach(function (_0x21ec94) {
          _0x21ec94.addEventListener("click", function () {
            var _0x41b652 = document.querySelector('#' + _0x21ec94.getAttribute("aria-controls"));
            if (!_0x41b652.classList.contains("block", "opacity-100")) {
              var _0x3e095d = _0x41b652.closest("[data-tab-content]").parentElement.querySelector("li a[data-tab-target][aria-selected='true']");
              var _0x1ba76b = document.querySelector('#' + _0x3e095d.getAttribute("aria-controls"));
              _0x1ba76b.classList.remove('block', 'opacity-100');
              _0x1ba76b.classList.add("hidden", "opacity-0");
              _0x41b652.classList.add("block", "opacity-100");
              _0x41b652.classList.remove("hidden", "opacity-0");
            }
          });
        });
      });
    }
  })();