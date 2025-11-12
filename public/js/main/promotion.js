auth.onAuthStateChanged(_0xdac403 => {
  if (!_0xdac403) {
    return;
  }
  const _0x4dca8f = firestoreDB.collection("Promotions");
  _0x4dca8f.onSnapshot(_0x398ce4 => {
    const _0x70a344 = document.getElementById('promotion-container');
    _0x70a344.innerHTML = '';
    _0x398ce4.forEach(_0x2283ea => {
      const _0x440756 = _0x2283ea.data();
      const _0x22e595 = _0x2283ea.id;
      if (_0x440756.isDisplay) {
        fetchPromotionImage(_0x22e595, _0x440756.customMediaUrl).then(_0xd94fd4 => {
          const _0x448eb6 = createPromotionCard(_0x440756, _0xd94fd4);
          _0x70a344.appendChild(_0x448eb6);
        });
      }
    });
  }, _0x627de3 => {
    console.error("Error fetching promotion data in real-time: ", _0x627de3);
  });
});
function fetchPromotionImage(_0x4ffa03, _0x1c05b1) {
  return new Promise((_0x3125be, _0x11b996) => {
    firebase.storage().ref('promotions/' + _0x4ffa03 + ".jpg").getDownloadURL().then(_0x26d1b3 => {
      _0x3125be(_0x26d1b3);
    })["catch"](_0x2918c7 => {
      if (_0x1c05b1) {
        _0x3125be(_0x1c05b1);
      } else {
        _0x3125be("bg-blue-800");
      }
    });
  });
}
function createPromotionCard(_0x259e86, _0x53fbd5) {
  const _0x5e3859 = document.createElement("div");
  _0x5e3859.className = "relative flex flex-col mt-6 text-white shadow-md bg-clip-border rounded-xl mx-6 cursor-pointer bg-cover bg-center";
  if (_0x53fbd5 === "bg-blue-800") {
    _0x5e3859.classList.add("bg-blue-800");
  } else {
    _0x5e3859.style.backgroundImage = 'url(' + _0x53fbd5 + ')';
  }
  const _0x15e78d = document.createElement("div");
  _0x15e78d.className = "absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50 rounded-xl";
  _0x5e3859.appendChild(_0x15e78d);
  const _0x2c9cd7 = document.createElement('div');
  _0x2c9cd7.className = "relative flex items-center p-8 space-x-2";
  if (_0x259e86.isLive) {
    const _0x2b2cb6 = document.createElement("span");
    _0x2b2cb6.className = "material-icons text-red-500";
    _0x2b2cb6.textContent = "circle";
    _0x2c9cd7.appendChild(_0x2b2cb6);
    const _0x244e0d = document.createElement("span");
    _0x244e0d.className = "text-red-500 font-bold";
    _0x244e0d.textContent = "TRỰC TIẾP";
    _0x2c9cd7.appendChild(_0x244e0d);
  }
  _0x5e3859.appendChild(_0x2c9cd7);
  const _0x72426f = document.createElement("div");
  _0x72426f.className = "relative p-8";
  const _0x4fffe0 = document.createElement('h5');
  _0x4fffe0.className = "mb-2 text-2xl font-bold leading-snug tracking-normal";
  _0x4fffe0.textContent = _0x259e86.title;
  _0x72426f.appendChild(_0x4fffe0);
  const _0x89ff30 = document.createElement('p');
  _0x89ff30.className = "text-base font-light leading-relaxed";
  _0x89ff30.textContent = _0x259e86.subTitle;
  _0x72426f.appendChild(_0x89ff30);
  const _0x2d7a1a = document.createElement("div");
  _0x2d7a1a.className = "w-full h-px bg-white my-4";
  _0x72426f.appendChild(_0x2d7a1a);
  const _0x785227 = document.createElement('p');
  _0x785227.className = "text-base font-semibold leading-relaxed";
  _0x785227.textContent = _0x259e86.description;
  _0x72426f.appendChild(_0x785227);
  _0x5e3859.appendChild(_0x72426f);
  if (_0x259e86.redirectUrl) {
    _0x5e3859.addEventListener("click", () => {
      window.open(_0x259e86.redirectUrl, "_blank");
    });
  }
  return _0x5e3859;
}