auth.onAuthStateChanged(_0x565f50 => {
    if (!_0x565f50) {
      return;
    }
    const _0x4e0571 = firestoreDB.collection("Promotions");
    _0x4e0571.onSnapshot(_0x427422 => {
      const _0x420d5f = document.getElementById('promotion-container');
      _0x420d5f.innerHTML = '';
      _0x427422.forEach(_0x3f8292 => {
        const _0x5b82ac = _0x3f8292.data();
        const _0x115413 = _0x3f8292.id;
        if (_0x5b82ac.isDisplay) {
          fetchPromotionImage(_0x115413, _0x5b82ac.customMediaUrl).then(_0x1eb5d7 => {
            const _0x75f7f2 = createPromotionCard(_0x5b82ac, _0x1eb5d7);
            _0x420d5f.appendChild(_0x75f7f2);
          });
        }
      });
    }, _0x465619 => {
      console.error("Error fetching promotion data in real-time: ", _0x465619);
    });
  });
  function fetchPromotionImage(_0x2d6801, _0x1d2d8d) {
    return new Promise((_0x46b06d, _0x5dc43e) => {
      firebase.storage().ref("promotions/" + _0x2d6801 + ".jpg").getDownloadURL().then(_0x271d1b => {
        _0x46b06d(_0x271d1b);
      })['catch'](_0x4b3411 => {
        if (_0x1d2d8d) {
          _0x46b06d(_0x1d2d8d);
        } else {
          _0x46b06d("bg-blue-800");
        }
      });
    });
  }
  function createPromotionCard(_0x23bb81, _0x48216d) {
    const _0x3cb969 = document.createElement('div');
    _0x3cb969.className = "relative flex flex-col mt-6 text-white shadow-md bg-clip-border rounded-xl mx-6 cursor-pointer bg-cover bg-center";
    if (_0x48216d === "bg-blue-800") {
      _0x3cb969.classList.add("bg-blue-800");
    } else {
      _0x3cb969.style.backgroundImage = 'url(' + _0x48216d + ')';
    }
    const _0x5cac13 = document.createElement('div');
    _0x5cac13.className = "absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50 rounded-xl";
    _0x3cb969.appendChild(_0x5cac13);
    const _0x1ceb33 = document.createElement("div");
    _0x1ceb33.className = "relative flex items-center p-8 space-x-2";
    if (_0x23bb81.isLive) {
      const _0x167cd0 = document.createElement("span");
      _0x167cd0.className = "material-icons text-red-500";
      _0x167cd0.textContent = "circle";
      _0x1ceb33.appendChild(_0x167cd0);
      const _0x152117 = document.createElement("span");
      _0x152117.className = "text-red-500 font-bold";
      _0x152117.textContent = "TRỰC TIẾP";
      _0x1ceb33.appendChild(_0x152117);
    }
    _0x3cb969.appendChild(_0x1ceb33);
    const _0x35f131 = document.createElement("div");
    _0x35f131.className = "relative p-8";
    const _0x19cba0 = document.createElement('h5');
    _0x19cba0.className = "mb-2 text-2xl font-bold leading-snug tracking-normal";
    _0x19cba0.textContent = _0x23bb81.title;
    _0x35f131.appendChild(_0x19cba0);
    const _0x305f37 = document.createElement('p');
    _0x305f37.className = "text-base font-light leading-relaxed";
    _0x305f37.textContent = _0x23bb81.subTitle;
    _0x35f131.appendChild(_0x305f37);
    const _0x10ed5d = document.createElement("div");
    _0x10ed5d.className = "w-full h-px bg-white my-4";
    _0x35f131.appendChild(_0x10ed5d);
    const _0x46a5f0 = document.createElement('p');
    _0x46a5f0.className = "text-base font-semibold leading-relaxed";
    _0x46a5f0.textContent = _0x23bb81.description;
    _0x35f131.appendChild(_0x46a5f0);
    _0x3cb969.appendChild(_0x35f131);
    if (_0x23bb81.redirectUrl) {
      _0x3cb969.addEventListener("click", () => {
        window.open(_0x23bb81.redirectUrl, "_blank");
      });
    }
    return _0x3cb969;
  }