function _array_like_to_array(_0x425dd0, _0x1a99ad) {
  if (_0x1a99ad == null || _0x1a99ad > _0x425dd0.length) {
    _0x1a99ad = _0x425dd0.length;
  }
  var _0x15baa8 = 0x0;
  for (var _0x50add1 = new Array(_0x1a99ad); _0x15baa8 < _0x1a99ad; _0x15baa8++) {
    _0x50add1[_0x15baa8] = _0x425dd0[_0x15baa8];
  }
  return _0x50add1;
}
function _array_without_holes(_0x30a089) {
  if (Array.isArray(_0x30a089)) {
    return _array_like_to_array(_0x30a089);
  }
}
function _iterable_to_array(_0x4c91f9) {
  if (typeof Symbol !== "undefined" && _0x4c91f9[Symbol.iterator] != null || _0x4c91f9["@@iterator"] != null) {
    return Array.from(_0x4c91f9);
  }
}
function _non_iterable_spread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(_0x55d5b3) {
  return _array_without_holes(_0x55d5b3) || _iterable_to_array(_0x55d5b3) || _unsupported_iterable_to_array(_0x55d5b3) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(_0x54039a, _0x598bf8) {
  if (!_0x54039a) {
    return;
  }
  if (typeof _0x54039a === "string") {
    return _array_like_to_array(_0x54039a, _0x598bf8);
  }
  var _0x309a33 = Object.prototype.toString.call(_0x54039a).slice(0x8, -0x1);
  if (_0x309a33 === "Object" && _0x54039a.constructor) {
    _0x309a33 = _0x54039a.constructor.name;
  }
  if (_0x309a33 === 'Map' || _0x309a33 === "Set") {
    return Array.from(_0x309a33);
  }
  if (_0x309a33 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(_0x309a33)) {
    return _array_like_to_array(_0x54039a, _0x598bf8);
  }
}
(function () {
  var _0x229070 = document.querySelectorAll('[data-dialog-target]');
  var _0x37245b = document.querySelectorAll('[data-dialog]');
  var _0x14df49 = document.querySelectorAll('[data-dialog-backdrop]');
  var _0x25067e = document.querySelectorAll('[data-dialog-close]');
  if (_0x229070 && _0x37245b && _0x14df49) {
    Array.from(_0x229070).forEach(function (_0x2fd6f8) {
      return Array.from(_0x37245b).forEach(function (_0x30f0a9) {
        return Array.from(_0x14df49).forEach(function (_0x17e5e4) {
          if (_0x2fd6f8.dataset.dialogTarget === _0x30f0a9.dataset.dialog && _0x17e5e4.dataset.dialogBackdrop === _0x30f0a9.dataset.dialog) {
            var _0x352837;
            var _0x427e53;
            var _0x3a56b7 = function _0x103b24() {
              var _0x24f466;
              var _0x52c809;
              _0x4e0c14 = true;
              _0x17e5e4.classList.toggle("pointer-events-none");
              _0x17e5e4.classList.toggle("opacity-0");
              (_0x24f466 = _0x30f0a9.classList).remove.apply(_0x24f466, _array_without_holes(_0x560f54) || _iterable_to_array(_0x560f54) || _unsupported_iterable_to_array(_0x560f54) || _non_iterable_spread());
              (_0x52c809 = _0x30f0a9.classList).add.apply(_0x52c809, _array_without_holes(_0x7d1101) || _iterable_to_array(_0x7d1101) || _unsupported_iterable_to_array(_0x7d1101) || _non_iterable_spread());
            };
            var _0x2fca6b = function _0x4c7611() {
              var _0x30cd54;
              var _0x1413d6;
              _0x4e0c14 = false;
              _0x17e5e4.classList.toggle("pointer-events-none");
              _0x17e5e4.classList.toggle("opacity-0");
              (_0x30cd54 = _0x30f0a9.classList).remove.apply(_0x30cd54, _array_without_holes(_0x7d1101) || _iterable_to_array(_0x7d1101) || _unsupported_iterable_to_array(_0x7d1101) || _non_iterable_spread());
              (_0x1413d6 = _0x30f0a9.classList).add.apply(_0x1413d6, _array_without_holes(_0x560f54) || _iterable_to_array(_0x560f54) || _unsupported_iterable_to_array(_0x560f54) || _non_iterable_spread());
            };
            var _0x37b9c4 = _0x30f0a9.dataset.dialogMount || "opacity-1 translate-y-0";
            var _0x10b133 = _0x30f0a9.dataset.dialogUnmount || "opacity-0 -translate-y-14";
            var _0x193075 = _0x30f0a9.dataset.dialogTransition || "transition-all duration-300";
            var _0x7d1101 = _0x37b9c4.split(" ");
            var _0x560f54 = _0x10b133.split(" ");
            var _0x410bc1 = _0x193075.split(" ");
            var _0x4e0c14 = false;
            (_0x352837 = _0x30f0a9.classList).add.apply(_0x352837, _array_without_holes(_0x560f54) || _iterable_to_array(_0x560f54) || _unsupported_iterable_to_array(_0x560f54) || _non_iterable_spread());
            if (!_0x17e5e4.hasAttribute("tabindex")) {
              _0x17e5e4.setAttribute('tabindex', 0x0);
            }
            if (_0x193075 !== 'false') {
              (_0x427e53 = _0x30f0a9.classList).add.apply(_0x427e53, _array_without_holes(_0x410bc1) || _iterable_to_array(_0x410bc1) || _unsupported_iterable_to_array(_0x410bc1) || _non_iterable_spread());
            }
            if (_0x30f0a9.className.includes(_0x10b133) && !_0x17e5e4.className.includes("pointer-events-none opacity-0")) {
              _0x17e5e4.classList.add("pointer-events-none");
              _0x17e5e4.classList.add("opacity-0");
            }
            _0x2fd6f8.addEventListener("click", function () {
              return _0x30f0a9.className.includes(_0x10b133) ? _0x3a56b7() : _0x2fca6b();
            });
            _0x17e5e4.addEventListener("click", function (_0x5cf24b) {
              var _0x15c5f3 = _0x5cf24b.target;
              var _0x148ea5;
              var _0x2c6dc2;
              if ((_0x15c5f3 === null || _0x15c5f3 === undefined ? undefined : (_0x148ea5 = _0x15c5f3.dataset) === null || _0x148ea5 === undefined ? undefined : _0x148ea5.dialogBackdrop) && (_0x15c5f3 === null || _0x15c5f3 === undefined ? undefined : (_0x2c6dc2 = _0x15c5f3.dataset) === null || _0x2c6dc2 === undefined ? undefined : _0x2c6dc2.dialogBackdropClose)) {
                _0x2fca6b();
              }
            });
            document.addEventListener("keyup", function (_0x2b1645) {
              var _0x1dc795 = _0x2b1645.key;
              return _0x1dc795 === 'Escape' && _0x4e0c14 ? _0x2fca6b() : null;
            });
            Array.from(_0x25067e).forEach(function (_0x4de4d4) {
              return _0x4de4d4.addEventListener("click", function () {
                return _0x4e0c14 ? _0x2fca6b() : null;
              });
            });
          }
        });
      });
    });
  }
})();