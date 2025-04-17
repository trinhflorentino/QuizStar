(function () {
    var _0x1b101f = document.querySelectorAll("[data-collapse-target]");
    var _0x522c2d = document.querySelectorAll("[data-collapse]");
    if (_0x1b101f && _0x522c2d) {
      Array.from(_0x1b101f).forEach(function (_0x10961c) {
        return Array.from(_0x522c2d).forEach(function (_0xf6910b) {
          if (_0x10961c.dataset.collapseTarget === _0xf6910b.dataset.collapse) {
            _0x10961c.addEventListener("click", function () {
              if (_0xf6910b.style.height && _0xf6910b.style.height !== '0px') {
                _0xf6910b.style.height = 0x0;
                _0xf6910b.style.overflow = 'hidden';
                _0x10961c.removeAttribute("open");
              } else {
                _0xf6910b.style.height = ''.concat(_0xf6910b.children[0x0].clientHeight, 'px');
                _0xf6910b.style.overflow = 'visible';
                _0x10961c.setAttribute('open', '');
              }
            });
          }
        });
      });
    }
  })();