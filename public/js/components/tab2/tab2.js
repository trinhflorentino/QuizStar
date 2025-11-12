(function () {
    var _0x4610b1 = document.querySelectorAll("[data-tabs]");
    var _0x46d702 = function _0x50e084(_0x1544bc) {
      _0x1544bc = _0x1544bc || window.event;
      return _0x1544bc.target || _0x1544bc.srcElement;
    };
    _0x4610b1.forEach(function (_0x7147fb, _0x35ce98) {
      var _0x323cf7 = document.createElement("div");
      var _0x5d903b = _0x7147fb.querySelector("li:first-child [data-tab-target]");
      var _0x5014ba = _0x5d903b.cloneNode();
      _0x5014ba.innerHTML = '-';
      _0x5014ba.classList.remove('bg-inherit', "text-slate-700");
      _0x5014ba.classList.add("bg-white", 'text-white');
      _0x5014ba.style.animation = ".2s ease";
      _0x323cf7.classList.add("z-10", "absolute", "text-slate-700", 'rounded-lg', 'bg-inherit', "flex-auto", "text-center", "bg-none", "border-0", "block", 'shadow');
      _0x323cf7.setAttribute("moving-tab", '');
      _0x323cf7.setAttribute("data-tab-target", '');
      _0x323cf7.appendChild(_0x5014ba);
      _0x7147fb.appendChild(_0x323cf7);
      _0x323cf7.style.padding = "0px";
      _0x323cf7.style.width = _0x7147fb.querySelector("li:nth-child(1)").offsetWidth + 'px';
      _0x323cf7.style.transform = "translate3d(0px, 0px, 0px)";
      _0x323cf7.style.transition = ".5s ease";
      _0x7147fb.onmouseover = function (_0x34af9f) {
        var _0x5f424b = _0x46d702(_0x34af9f);
        var _0x41dacb = _0x5f424b.closest('li');
        if (_0x41dacb) {
          var _0x21d8ce = Array.from(_0x41dacb.closest('ul').children);
          var _0x3fb500 = _0x21d8ce.indexOf(_0x41dacb) + 0x1;
          _0x7147fb.querySelector("li:nth-child(" + _0x3fb500 + ") [data-tab-target]").onclick = function () {
            _0x7147fb.querySelectorAll('li').forEach(function (_0x7464f) {
              _0x7464f.firstElementChild.removeAttribute("active");
              _0x7464f.firstElementChild.setAttribute("aria-selected", "false");
            });
            _0x41dacb.firstElementChild.setAttribute("active", '');
            _0x41dacb.firstElementChild.setAttribute("aria-selected", 'true');
            _0x323cf7 = _0x7147fb.querySelector('[moving-tab]');
            var _0x1ab54a = 0x0;
            if (_0x7147fb.classList.contains("flex-col")) {
              for (var _0x5c1b08 = 0x1; _0x5c1b08 <= _0x21d8ce.indexOf(_0x41dacb); _0x5c1b08++) {
                _0x1ab54a += _0x7147fb.querySelector("li:nth-child(" + _0x5c1b08 + ')').offsetHeight;
              }
              _0x323cf7.style.transform = "translate3d(0px," + _0x1ab54a + "px, 0px)";
              _0x323cf7.style.height = _0x7147fb.querySelector("li:nth-child(" + _0x5c1b08 + ')').offsetHeight;
            } else {
              for (var _0x5c1b08 = 0x1; _0x5c1b08 <= _0x21d8ce.indexOf(_0x41dacb); _0x5c1b08++) {
                _0x1ab54a += _0x7147fb.querySelector("li:nth-child(" + _0x5c1b08 + ')').offsetWidth;
              }
              _0x323cf7.style.transform = "translate3d(" + _0x1ab54a + "px, 0px, 0px)";
              _0x323cf7.style.width = _0x7147fb.querySelector('li:nth-child(' + _0x3fb500 + ')').offsetWidth + 'px';
            }
          };
        }
      };
    });
    window.addEventListener("resize", function (_0xa9d082) {
      _0x4610b1.forEach(function (_0x1f60f1, _0x342f5b) {
        _0x1f60f1 = _0x1f60f1.parentElement.firstElementChild;
        _0x1f60f1.querySelector("[moving-tab]").remove();
        var _0x1c17c9 = document.createElement("div");
        var _0x210a21 = _0x1f60f1.querySelector("[data-tab-target][aria-selected='true']").cloneNode();
        _0x210a21.innerHTML = '-';
        _0x210a21.classList.remove("bg-inherit");
        _0x210a21.classList.add("bg-white", "text-white");
        _0x210a21.style.animation = ".2s ease";
        _0x1c17c9.classList.add("z-10", "absolute", 'text-slate-700', 'rounded-lg', 'bg-inherit', "flex-auto", "text-center", "bg-none", "border-0", "block", 'shadow');
        _0x1c17c9.setAttribute("moving-tab", '');
        _0x1c17c9.setAttribute("data-tab-target", '');
        _0x1c17c9.appendChild(_0x210a21);
        _0x1f60f1.appendChild(_0x1c17c9);
        _0x1c17c9.style.padding = "0px";
        _0x1c17c9.style.transition = ".5s ease";
        var _0x1b1982 = _0x1f60f1.querySelector("[data-tab-target][aria-selected='true']").parentElement;
        if (_0x1b1982) {
          var _0x47d5c8 = Array.from(_0x1b1982.closest('ul').children);
          var _0x70bbd3 = _0x47d5c8.indexOf(_0x1b1982) + 0x1;
          var _0x88b342 = 0x0;
          if (_0x1f60f1.classList.contains('flex-col')) {
            for (var _0xa7205d = 0x1; _0xa7205d <= _0x47d5c8.indexOf(_0x1b1982); _0xa7205d++) {
              _0x88b342 += _0x1f60f1.querySelector("li:nth-child(" + _0xa7205d + ')').offsetHeight;
            }
            _0x1c17c9.style.transform = "translate3d(0px," + _0x88b342 + "px, 0px)";
            _0x1c17c9.style.width = _0x1f60f1.querySelector("li:nth-child(" + _0x70bbd3 + ')').offsetWidth + 'px';
            _0x1c17c9.style.height = _0x1f60f1.querySelector("li:nth-child(" + _0xa7205d + ')').offsetHeight;
          } else {
            for (var _0xa7205d = 0x1; _0xa7205d <= _0x47d5c8.indexOf(_0x1b1982); _0xa7205d++) {
              _0x88b342 += _0x1f60f1.querySelector('li:nth-child(' + _0xa7205d + ')').offsetWidth;
            }
            _0x1c17c9.style.transform = "translate3d(" + _0x88b342 + "px, 0px, 0px)";
            _0x1c17c9.style.width = _0x1f60f1.querySelector("li:nth-child(" + _0x70bbd3 + ')').offsetWidth + 'px';
          }
        }
      });
      if (window.innerWidth < 0x3df) {
        _0x4610b1.forEach(function (_0x25ff6f, _0x5d61bd) {
          if (!_0x25ff6f.classList.contains('flex-col')) {
            _0x25ff6f.classList.add("flex-col", "on-resize");
          }
        });
      } else {
        _0x4610b1.forEach(function (_0x53f900, _0x5a27da) {
          if (_0x53f900.classList.contains("on-resize")) {
            _0x53f900.classList.remove("flex-col", "on-resize");
          }
        });
      }
    });
    var _0x4610b1 = document.querySelectorAll('[data-tab-content]');
    if (_0x4610b1[0x0]) {
      _0x4610b1.forEach(function (_0x14393e) {
        var _0x5186a7 = _0x14393e.parentElement.querySelectorAll("li a[data-tab-target]");
        _0x5186a7.forEach(function (_0x3ec487) {
          _0x3ec487.addEventListener("click", function () {
            var _0x456874 = document.querySelector('#' + _0x3ec487.getAttribute("aria-controls"));
            if (!_0x456874.classList.contains("block", "opacity-100")) {
              var _0x567b44 = _0x456874.closest("[data-tab-content]").parentElement.querySelector("li a[data-tab-target][aria-selected='true']");
              var _0x278bfd = document.querySelector('#' + _0x567b44.getAttribute('aria-controls'));
              _0x278bfd.classList.remove("block", "opacity-100");
              _0x278bfd.classList.add('hidden', "opacity-0");
              _0x456874.classList.add("block", "opacity-100");
              _0x456874.classList.remove("hidden", "opacity-0");
            }
          });
        });
      });
    }
  })();