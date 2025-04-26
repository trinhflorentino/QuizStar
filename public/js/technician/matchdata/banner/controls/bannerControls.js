auth.onAuthStateChanged(_0x21b6c3 => {
    if (!_0x21b6c3) {
      return;
    }
    const _0x2015df = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x2015df.onSnapshot(_0x5b83cb => {
      if (!_0x5b83cb.exists) {
        return;
      }
      const _0x3e54fe = _0x5b83cb.data().match;
      const _0x2b90a9 = (_0x6fa8fd, _0x429301 = null) => {
        const _0x10f28e = {
          'ContestantList': false,
          'MatchName': false,
          'CustomText': false,
          'CustomTextContent': null
        };
        _0x10f28e[_0x6fa8fd] = true;
        if (_0x429301 !== null) {
          _0x10f28e.CustomTextContent = _0x429301;
        }
        Object.keys(_0x10f28e).forEach(_0x3cbc7f => {
          realtimeDB.ref(_0x3e54fe + "/Banner/Elements/" + _0x3cbc7f).set(_0x10f28e[_0x3cbc7f]);
        });
        successToast("Thao tác thành công", 0xbb8, "top", 'right', false, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", '');
      };
      const _0x254a9f = _0x57aeec => {
        const _0x26bda3 = {
          'Advisor1': false,
          'Advisor2': false,
          'Advisor3': false,
          'Advisor4': false,
          'Advisor5': false,
          'ContestantIntroduction': false,
          'End': false,
          'GivingPrize': false,
          'MC': false,
          'TenseMoments': false,
          'Place1st': false,
          'Place2nd': false,
          'Place3rd': false,
          'Place4th': false
        };
        Object.keys(_0x26bda3).forEach(_0x2a6444 => {
          realtimeDB.ref(_0x3e54fe + '/Banner/Music/' + _0x2a6444).set(_0x26bda3[_0x2a6444]);
        });
        setTimeout(() => {
          _0x26bda3[_0x57aeec] = true;
          realtimeDB.ref(_0x3e54fe + "/Banner/Music/" + _0x57aeec).set(_0x26bda3[_0x57aeec]);
        }, 0x64);
      };
      document.getElementById("BannerUI_CompetitorList").addEventListener("click", () => {
        _0x2b90a9("ContestantList");
      });
      document.getElementById("BannerUI_MatchName").addEventListener("click", () => {
        _0x2b90a9("MatchName");
      });
      document.getElementById("BannerUI_CustomText").addEventListener("click", () => {
        const _0x30fcee = prompt("Enter custom text:");
        _0x2b90a9('CustomText', _0x30fcee);
      });
      document.getElementById('BannerMusic_Advisor1').addEventListener("click", () => {
        _0x254a9f("Advisor1");
      });
      document.getElementById("BannerMusic_Advisor2").addEventListener("click", () => {
        _0x254a9f('Advisor2');
      });
      document.getElementById('BannerMusic_Advisor3').addEventListener("click", () => {
        _0x254a9f("Advisor3");
      });
      document.getElementById('BannerMusic_Advisor4').addEventListener("click", () => {
        _0x254a9f("Advisor4");
      });
      document.getElementById("BannerMusic_Advisor5").addEventListener("click", () => {
        _0x254a9f('Advisor5');
      });
      document.getElementById('BannerMusic_ContestantIntroduction').addEventListener("click", () => {
        _0x254a9f("ContestantIntroduction");
      });
      document.getElementById("BannerMusic_End").addEventListener('click', () => {
        _0x254a9f("End");
      });
      document.getElementById("BannerMusic_GivingPrize").addEventListener("click", () => {
        _0x254a9f("GivingPrize");
      });
      document.getElementById("BannerMusic_MC").addEventListener("click", () => {
        _0x254a9f('MC');
      });
      document.getElementById("BannerMusic_Place1st").addEventListener("click", () => {
        _0x254a9f('Place1st');
      });
      document.getElementById("BannerMusic_Place2nd").addEventListener("click", () => {
        _0x254a9f("Place2nd");
      });
      document.getElementById("BannerMusic_Place3rd").addEventListener("click", () => {
        _0x254a9f("Place3rd");
      });
      document.getElementById("BannerMusic_Place4th").addEventListener("click", () => {
        _0x254a9f('Place4th');
      });
      document.getElementById("BannerOthers_StopMusic").addEventListener("click", () => {
        const _0x5e0160 = {
          'Advisor1': false,
          'Advisor2': false,
          'Advisor3': false,
          'Advisor4': false,
          'Advisor5': false,
          'ContestantIntroduction': false,
          'End': false,
          'GivingPrize': false,
          'MC': false,
          'TenseMoments': false,
          'Place1st': false,
          'Place2nd': false,
          'Place3rd': false,
          'Place4th': false
        };
        Object.keys(_0x5e0160).forEach(_0x9fdae1 => {
          realtimeDB.ref(_0x3e54fe + '/Banner/Music/' + _0x9fdae1).set(_0x5e0160[_0x9fdae1]);
        });
      });
      document.getElementById('BannerOthers_ClearUI').addEventListener("click", () => {
        const _0x6acaaa = {
          'ContestantList': false,
          'MatchName': false,
          'CustomText': false,
          'CustomTextContent': null
        };
        Object.keys(_0x6acaaa).forEach(_0x589728 => {
          realtimeDB.ref(_0x3e54fe + "/Banner/Elements/" + _0x589728).set(_0x6acaaa[_0x589728]);
        });
      });
    });
  });