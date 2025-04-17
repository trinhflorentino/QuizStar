auth.onAuthStateChanged(_0x51dc23 => {
    if (!_0x51dc23) {
      return;
    }
    const _0x4a2fac = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x4a2fac.onSnapshot(_0x4e4d1c => {
      if (!_0x4e4d1c.exists) {
        return;
      }
      const _0x53bee9 = _0x4e4d1c.data().match;
      const _0x1b802e = realtimeDB.ref(_0x53bee9 + "/Banner");
      const _0x30d406 = realtimeDB.ref(_0x53bee9 + '/match');
      _0x1b802e.on('value', _0x5b42e4 => {
        const _0x25e39c = _0x5b42e4.val();
        const _0x23bbbe = _0x25e39c.Elements.MatchName;
        const _0x2f4c2c = _0x25e39c.Elements.ContestantList;
        const _0x165f44 = _0x25e39c.Elements.CustomText;
        const _0x1e122d = _0x25e39c.Elements.CustomTextContent;
        const _0xde3add = ["Advisor1", "Advisor2", "Advisor3", "Advisor4", "Advisor5"];
        let _0xe442e8 = false;
        _0xde3add.forEach((_0x58d1f8, _0x2675cd) => {
          if (_0x25e39c.Music[_0x58d1f8] == true) {
            _0x164c88("Đang phát âm thanh: Cố vấn " + (_0x2675cd + 0x1));
            _0xe442e8 = true;
          }
        });
        const _0x84e7a1 = ["ContestantIntroduction", 'End', "GivingPrize", 'MC', 'TenseMoments', "Place1st", "Place2nd", "Place3rd", "Place4th"];
        const _0x4db8c0 = {
          'ContestantIntroduction': "Giới thiệu thí sinh",
          'End': "Kết thúc",
          'GivingPrize': "Trao giải",
          'MC': "Giới thiệu MC",
          'TenseMoments': "Khoảnh khắc căng thẳng",
          'Place1st': "Vị trí 1",
          'Place2nd': "Vị trí 2",
          'Place3rd': "Vị trí 3",
          'Place4th': "Vị trí 4"
        };
        _0x84e7a1.forEach(_0x531bae => {
          if (_0x25e39c.Music[_0x531bae] == true) {
            _0x164c88("Đang phát âm thanh: " + _0x4db8c0[_0x531bae]);
            _0xe442e8 = true;
          }
        });
        if (!_0xe442e8) {
          _0x164c88("Đang không phát âm thanh");
        }
        function _0x164c88(_0xee1722) {
          document.getElementById("bannerMusicText").innerHTML = _0xee1722;
        }
        console.log(_0x25e39c);
        if (_0x23bbbe == true) {
          _0x30d406.on('value', _0x5a67c3 => {
            const _0x2d1e12 = _0x5a67c3.val();
            document.getElementById("bannerText").innerText = _0x2d1e12;
          });
        }
        if (_0x2f4c2c == true) {
          document.getElementById("bannerText").innerText = "Đang hiển thị danh sách thí sinh";
        }
        if (_0x165f44 == true) {
          document.getElementById("bannerText").innerText = _0x1e122d;
        }
        if (_0x23bbbe == false && _0x2f4c2c == false && _0x165f44 == false) {
          document.getElementById("bannerText").innerText = '';
        }
      });
    });
  });