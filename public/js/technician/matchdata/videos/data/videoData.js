auth.onAuthStateChanged(_0x4ed948 => {
    if (!_0x4ed948) {
      return;
    }
    const _0x32daa1 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x32daa1.onSnapshot(_0x1acfa8 => {
      if (!_0x1acfa8.exists) {
        return;
      }
      const _0x30b80a = _0x1acfa8.data().match;
      const _0x2b41c7 = realtimeDB.ref(_0x30b80a + "/hostid");
      _0x2b41c7.on("value", _0x26fb1b => {
        const _0xa833d8 = _0x26fb1b.val();
        if (!_0xa833d8) {
          return;
        }
        const _0xc4702c = firestoreDB.collection("Intro").doc(_0xa833d8);
        _0xc4702c.onSnapshot(_0x5200b2 => {
          if (!_0x5200b2.exists) {
            console.log("No intro data found");
            return;
          }
          const _0x10ceab = _0x5200b2.data();
          console.log(_0x10ceab);
          const _0x391780 = _0x10ceab.isUsingCustomIntro || false;
          const _0x5d6fa6 = _0x10ceab.CustomVideo || [];
          const _0x2c409f = [{
            'text': "Video Giới thiệu",
            'file': "Opening.mp4",
            'customFile': "Opening.mp4"
          }, {
            'text': "Video Khởi động",
            'file': "Start.mp4",
            'customFile': "Start.mp4"
          }, {
            'text': "Video VCNV",
            'file': 'Obstacle.mp4',
            'customFile': "Obstacle.mp4"
          }, {
            'text': "Video Tăng tốc",
            'file': "Acceleration.mp4",
            'customFile': "Acceleration.mp4"
          }, {
            'text': "Video Về đích",
            'file': 'Finish.mp4',
            'customFile': "Finish.mp4"
          }];
          const _0x4bb2f5 = document.getElementById("VideoIntros");
          _0x4bb2f5.innerHTML = '';
          _0x2c409f.forEach(_0x4717c8 => {
            const _0x73d25 = document.createElement('li');
            _0x73d25.className = "cursor-pointer text-neutral-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-neutral-100 focus:bg-neutral-100 active:bg-neutral-100 dark:text-white";
            _0x73d25.textContent = _0x4717c8.text;
            _0x73d25.onclick = () => {
              const _0x46c827 = _0x391780 ? _0x4717c8.customFile : _0x4717c8.file;
              const _0x360e7e = _0x391780 ? 'Intro/' + _0xa833d8 + '/' + _0x46c827 : 'DefaultIntro/' + _0x46c827;
              realtimeDB.ref(_0x30b80a + "/IntroNum").set({
                'intronum': _0x360e7e
              });
              successToast("Đang phát " + _0x4717c8.text);
            };
            _0x4bb2f5.appendChild(_0x73d25);
          });
          const _0x22a6d9 = document.getElementById("VideoCustoms");
          _0x22a6d9.innerHTML = '';
          _0x5d6fa6.forEach(_0x134d33 => {
            const _0x107b1c = document.createElement('li');
            _0x107b1c.className = "cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 dark:text-white hover:text-slate-800";
            _0x107b1c.textContent = _0x134d33.name;
            _0x107b1c.onclick = () => {
              realtimeDB.ref(_0x30b80a + '/IntroNum').set({
                'intronum': _0x134d33.url
              });
              successToast("Đang phát " + _0x134d33.name);
            };
            _0x22a6d9.appendChild(_0x107b1c);
          });
        });
      });
    });
  });