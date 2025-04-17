auth.onAuthStateChanged(_0x10c77b => {
    if (!_0x10c77b) {
      return;
    }
    const _0x329d54 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x329d54.onSnapshot(_0x1535bb => {
      if (!_0x1535bb.exists) {
        return;
      }
      const _0x44ded4 = _0x1535bb.data().match;
      const _0x4ac7cc = document.querySelectorAll("[role=\"tab\"]");
      const _0x5e1a04 = document.createElement("div");
      document.body.appendChild(_0x5e1a04);
      _0x5e1a04.style.position = 'absolute';
      _0x5e1a04.style.height = '4px';
      _0x5e1a04.style.backgroundColor = "white";
      _0x5e1a04.style.transition = "transform 0.3s ease";
      function _0x3b3e4b(_0x3d0779) {
        const _0x500a48 = _0x3d0779.currentTarget;
        _0x1b273f(_0x500a48);
      }
      function _0x422f25(_0x41cc12) {
        if (_0x41cc12 >= 0x0 && _0x41cc12 < _0x4ac7cc.length) {
          const _0x81028d = _0x4ac7cc[_0x41cc12];
          _0x4ac7cc.forEach(_0x1b1b5a => {
            if (_0x1b1b5a.hasAttribute("active")) {
              _0x1b1b5a.removeAttribute("active");
              _0x1b1b5a.setAttribute("aria-selected", "false");
              _0x1b1b5a.classList.remove("bg-white", "text-white");
              _0x1b1b5a.classList.add("bg-inherit", "text-slate-700");
            }
          });
          _0x1b273f(_0x81028d);
          console.log("Programmatically selected item:", _0x81028d.innerText.trim());
        } else {
          console.error("Tab index out of range.");
        }
      }
      function _0x196236(_0x508d39) {
        const _0x4c2d58 = _0x508d39.getBoundingClientRect();
        _0x5e1a04.style.width = _0x4c2d58.width + 'px';
        _0x5e1a04.style.transform = "translate(" + _0x4c2d58.left + "px, " + _0x4c2d58.bottom + "px)";
      }
      _0x4ac7cc.forEach(_0x324949 => {
        _0x324949.addEventListener('click', _0x3b3e4b);
      });
      _0x196236(_0x4ac7cc[0x0]);
      const _0xa71378 = {
        'khoidong': firebase.database().ref(_0x44ded4 + "/gamestatus/khoidong"),
        'vcnv': firebase.database().ref(_0x44ded4 + "/gamestatus/vcnv"),
        'intro': firebase.database().ref(_0x44ded4 + "/intro"),
        'tangtoc': firebase.database().ref(_0x44ded4 + '/gamestatus/tangtoc'),
        'tongketdiem': firebase.database().ref(_0x44ded4 + "/gamestatus/tongketdiem"),
        'vedich': firebase.database().ref(_0x44ded4 + "/gamestatus/vedich"),
        'vedichphu': firebase.database().ref(_0x44ded4 + '/gamestatus/vedichphu'),
        'khoidongo22': firebase.database().ref(_0x44ded4 + '/gamestatus/khoidongo22'),
        'banner': firebase.database().ref(_0x44ded4 + "/gamestatus/banner")
      };
      _0xa71378.vedich.on("value", _0x5223e4('vedich', 0x7));
      _0xa71378.intro.on("value", _0x5223e4('intro', 0x2));
      _0xa71378.khoidong.on('value', _0x5223e4("khoidong", 0x3));
      _0xa71378.vcnv.on('value', _0x5223e4('vcnv', 0x5));
      _0xa71378.tangtoc.on("value", _0x5223e4('tangtoc', 0x6));
      _0xa71378.tongketdiem.on("value", _0x5223e4("tongketdiem", 0x9));
      _0xa71378.vedichphu.on("value", _0x5223e4('vedichphu', 0x8));
      _0xa71378.khoidongo22.on('value', _0x5223e4("khoidongo22", 0x4));
      _0xa71378.banner.on("value", _0x5223e4("banner", 0x1));
      let _0xd31aa9 = {
        'khoidong': 0x0,
        'vcnv': 0x0,
        'intro': 0x0,
        'tangtoc': 0x0,
        'tongketdiem': 0x0,
        'vedich': 0x0,
        'vedichphu': 0x0,
        'khoidongo22': 0x0,
        'banner': 0x0
      };
      const _0x35ec19 = {
        0x0: null,
        0x1: "banner",
        0x2: "intro",
        0x3: "khoidong",
        0x4: 'khoidongo22',
        0x5: "vcnv",
        0x6: 'tangtoc',
        0x7: 'vedich',
        0x8: 'vedichphu',
        0x9: "tongketdiem"
      };
      function _0x5d510c(_0x117aca) {
        const _0x5b8dc1 = _0x35ec19[_0x117aca];
        if (_0x117aca === 0x0) {
          Object.keys(_0xd31aa9).forEach(_0x3e2b13 => {
            const _0x145c5f = _0xa71378[_0x3e2b13];
            console.log("Setting " + _0x3e2b13 + " to 0");
            _0x145c5f.set({
              [_0x3e2b13]: 0x0
            });
          });
        } else if (_0x5b8dc1) {
          Object.keys(_0xd31aa9).forEach(_0x2b6a48 => {
            const _0x53027e = _0xa71378[_0x2b6a48];
            console.log("Setting " + _0x2b6a48 + " to " + (_0x2b6a48 === _0x5b8dc1 ? 0x1 : 0x0));
            _0x53027e.set({
              [_0x2b6a48]: _0x2b6a48 === _0x5b8dc1 ? 0x1 : 0x0
            });
          });
        }
      }
      const _0x3994a0 = {
        'banner': () => {
          _0x5cd896('banner');
        },
        'khoidong': () => {
          _0x5cd896("khoidong");
        },
        'khoidongo22': () => {
          _0x5cd896("khoidongo22");
        },
        'vcnv': () => {
          _0x5cd896("vcnv");
        },
        'tangtoc': () => {
          _0x5cd896("tangtoc");
        },
        'vedich': () => {
          _0x5cd896("vedich");
        },
        'vedichphu': () => {
          _0x5cd896("vedichphu");
        },
        'intro': () => {
          _0x5cd896('intro');
        },
        'tongketdiem': () => {
          _0x5cd896("tongketdiem");
        }
      };
      function _0x5cd896(_0x36ba39) {
        const _0x1d68d5 = ["khoidong", "vcnv", "intro", "tangtoc", "vedich", 'vedichphu', "khoidongo22", "banner", 'tongketdiem'];
        _0x1d68d5.forEach(_0x4d2759 => {
          if (_0x4d2759 !== _0x36ba39) {
            const _0x16d6ae = firebase.database().ref(_0x44ded4 + "/gamestatus/" + _0x4d2759);
            _0x16d6ae.set({
              [_0x4d2759]: 0x0
            });
          }
        });
        const _0x127fb5 = ["khoidong", "khoidongo22", "tangtoc", 'vcnv', "vedich", 'vedichphu'];
        _0x127fb5.forEach(_0x11c783 => {
          const _0xb21c15 = firebase.database().ref(_0x44ded4 + "/phanthistatus/" + _0x11c783);
          _0xb21c15.set({
            'batdau': 0x0
          });
        });
        realtimeDB.ref(_0x44ded4 + "/AlreadyOpenAnswer").set({
          'status': false
        });
        realtimeDB.ref(_0x44ded4 + "/IntroNum").set({
          'intronum': ''
        });
        const _0x3ae780 = {
          'Advisor1': false,
          'Advisor2': false,
          'Advisor3': false,
          'Advisor4': false,
          'Advisor5': false,
          'ContestantIntroduction': false,
          'End': false,
          'GivingPrize': false,
          'MC': false,
          'TenseMoments': false
        };
        const _0x3f57b2 = {
          'ContestantList': true,
          'MatchName': false,
          'CustomText': false,
          'CustomTextContent': null
        };
        realtimeDB.ref(_0x44ded4 + "/Banner/Music").set(_0x3ae780);
        realtimeDB.ref(_0x44ded4 + '/Banner/Elements').set(_0x3f57b2);
        document.getElementById("StartIStart").disabled = false;
        document.getElementById("StartICorrectAnswer").disabled = true;
        document.getElementById("StartIWrongAnswer").disabled = true;
        realtimeDB.ref(_0x44ded4 + '/playerstatus/khoidong').set({
          'player': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/khoidong").set({
          'causo': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/KDO22Turn").set({
          'turn': 0x0
        });
        realtimeDB.ref(_0x44ded4 + '/KDO22Causo').set({
          'causo': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/KDO223sCountdown").set({
          'countdown': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/KDO22LuotThiStatus").set({
          'status': 0x3
        });
        realtimeDB.ref(_0x44ded4 + "/KDO22Chuong/ChuongStatus").set({
          'status': 0x3
        });
        realtimeDB.ref(_0x44ded4 + "/KDO22Chuong/CorrectOrWrong").set({
          'correctorwrong': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/KDO22Chuong/Player").set({
          'id': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/StartIIBuzzer").remove();
        for (let _0x5acad0 = 0x1; _0x5acad0 <= 0x4; _0x5acad0++) {
          realtimeDB.ref(_0x44ded4 + "/VCNVAnswer/TS" + _0x5acad0 + '/').set({
            'answer': ''
          });
          realtimeDB.ref(_0x44ded4 + "/VCNVAnswer/TS" + _0x5acad0 + "/dunghaysai").set({
            'dunghaysai': 0x0
          });
          realtimeDB.ref(_0x44ded4 + '/VCNVDisable/TS' + _0x5acad0).set({
            'ansbardisabled': 0x0
          });
        }
        realtimeDB.ref(_0x44ded4 + "/VCNVRowStatus").set({
          'HN1': {
            'status': 0x0
          },
          'HN2': {
            'status': 0x0
          },
          'HN3': {
            'status': 0x0
          },
          'HN4': {
            'status': 0x0
          },
          'HN5': {
            'status': 0x0
          }
        });
        realtimeDB.ref(_0x44ded4 + "/VCNVImageStatus").set({
          'HA1': {
            'status': 0x0
          },
          'HA2': {
            'status': 0x0
          },
          'HA3': {
            'status': 0x0
          },
          'HA4': {
            'status': 0x0
          },
          'HA5': {
            'status': 0x0
          }
        });
        realtimeDB.ref(_0x44ded4 + "/VCNVAudio").set({
          'audio': 0x0
        });
        realtimeDB.ref(_0x44ded4 + '/VCNVPlayed').set({
          'hangngang': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/VCNV/hangngang").set({
          'hn': 0x0
        });
        realtimeDB.ref(_0x44ded4 + '/VCNVOpenAnswer').set({
          'OpenAnswer': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/ObstacleBuzzer").remove();
        realtimeDB.ref(_0x44ded4 + '/ObstacleAnswers').remove();
        realtimeDB.ref(_0x44ded4 + "/ObstacleDisabledId").remove();
        realtimeDB.ref(_0x44ded4 + "/VCNVChuong/OpenAll").set({
          'correct': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/Sounds").set({
          'EnglishVoice': false,
          'SpacingMusic': false,
          'TenseMoments': false
        });
        for (let _0x4be11b = 0x1; _0x4be11b <= 0x4; _0x4be11b++) {
          realtimeDB.ref(_0x44ded4 + "/AccelerationAnswer/TS" + _0x4be11b + '/Answer').set({
            'answer': ''
          });
          realtimeDB.ref(_0x44ded4 + "/AccelerationAnswer/TS" + _0x4be11b + "/CorrectOrWrong").set({
            'correctorwrong': 0x0
          });
          realtimeDB.ref(_0x44ded4 + "/AccelerationAnswer/TS" + _0x4be11b + "/Timestamp").set({
            'timestamp': 0x0
          });
        }
        realtimeDB.ref(_0x44ded4 + "/Acceleration/QS").set({
          'tangtoc': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/AccelerationOpenAnswer").set({
          'OpenAnswer': 0x0
        });
        realtimeDB.ref(_0x44ded4 + '/playerstatus/vedich').set({
          'player': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/phanthistatus/vedich").set({
          'batdau': 0x0
        });
        realtimeDB.ref(_0x44ded4 + '/FinishPoint/status').set({
          'status': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/VDChuong/ChuongStatus").set({
          'status': 0x2
        });
        realtimeDB.ref(_0x44ded4 + "/VDChuong/Player").set({
          'id': '',
          'timestamp': ''
        });
        realtimeDB.ref(_0x44ded4 + "/VDChuong/CorrectOrWrong").set({
          'correctorwrong': 0x0
        });
        realtimeDB.ref(_0x44ded4 + '/FinishBuzzer').remove();
        realtimeDB.ref(_0x44ded4 + "/VDNSHV/status").set({
          'status': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/FinishVideoState/VD").set({
          'video1': 0x0,
          'video2': 0x0,
          'video3': 0x0,
          'video4': 0x0
        });
        realtimeDB.ref(_0x44ded4 + '/VDCauso').set({
          'causo': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/VDPCauso").set({
          'causo': 0x0
        });
        realtimeDB.ref(_0x44ded4 + "/AdditionalBuzzer").remove();
        realtimeDB.ref(_0x44ded4 + "/AdditionalPlayerSelected").remove();
        realtimeDB.ref(_0x44ded4 + "/AdditionalDisabledId").remove();
        realtimeDB.ref(_0x44ded4 + "/AdditionalBuzzer/State").remove();
        for (let _0x51f321 = 0x1; _0x51f321 <= 0x4; _0x51f321++) {
          realtimeDB.ref(_0x44ded4 + '/VCNVChuong/TS' + _0x51f321).set({
            'chuong': 0x0
          });
          realtimeDB.ref(_0x44ded4 + "/VCNVChuongTimeStamp/TS" + _0x51f321).set({
            'timestamp': ''
          });
          realtimeDB.ref(_0x44ded4 + "/VDPChuongDisable/TS" + _0x51f321).set({
            'chuongdisable': 0x0
          });
        }
      }
      function _0x3b3e4b(_0x2bf63a) {
        const _0x273455 = _0x2bf63a.currentTarget;
        const _0x52bf69 = Array.from(_0x4ac7cc).indexOf(_0x273455);
        _0x1b273f(_0x273455);
        _0x5d510c(_0x52bf69);
        const _0x3191d8 = _0x35ec19[_0x52bf69];
        if (_0x3994a0[_0x3191d8]) {
          _0x3994a0[_0x3191d8]();
        }
      }
      function _0x5223e4(_0x4086d0, _0x5d7b47) {
        return _0x14c5e6 => {
          const _0x53669c = _0x14c5e6.val() ? _0x14c5e6.val()[_0x4086d0] : 0x0;
          _0xd31aa9[_0x4086d0] = _0x53669c;
          if (_0x53669c === 0x1) {
            console.log(_0x4086d0 + " activated.");
            _0x422f25(_0x5d7b47);
          } else {
            console.log(_0x4086d0 + " deactivated.");
          }
          _0x542d4d();
        };
      }
      function _0x542d4d() {
        const _0x3c74b6 = Object.values(_0xd31aa9).every(_0x55a98c => _0x55a98c === 0x0);
        if (_0x3c74b6) {
          console.log("All game statuses are 0. Selecting chatroom tab (index 0).");
          _0x422f25(0x0);
        }
      }
      function _0x422f25(_0x65c778) {
        if (_0x65c778 >= 0x0 && _0x65c778 < _0x4ac7cc.length) {
          const _0x15a6ff = _0x4ac7cc[_0x65c778];
          _0x4ac7cc.forEach(_0x18b10f => {
            if (_0x18b10f.hasAttribute("active")) {
              _0x18b10f.removeAttribute("active");
              _0x18b10f.setAttribute("aria-selected", 'false');
              _0x18b10f.classList.remove("bg-white", "text-white");
              _0x18b10f.classList.add("bg-inherit", "text-slate-700");
            }
          });
          _0x1b273f(_0x15a6ff);
          console.log("Programmatically selected item:", _0x15a6ff.innerText.trim());
        } else {
          console.error("Tab index out of range.");
        }
      }
      function _0x1b273f(_0x21a6c3) {
        const _0x2a1e2e = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        _0x4ac7cc.forEach(_0x49a8a8 => {
          _0x49a8a8.removeAttribute("active");
          _0x49a8a8.setAttribute("aria-selected", "false");
          _0x49a8a8.classList.remove("bg-white", "text-white", "text-black");
          _0x49a8a8.classList.add("bg-inherit", "text-slate-700");
        });
        _0x21a6c3.setAttribute('active', '');
        _0x21a6c3.setAttribute('aria-selected', 'true');
        _0x21a6c3.classList.remove("bg-inherit", "text-slate-700");
        _0x21a6c3.classList.add("bg-white");
        if (_0x2a1e2e) {
          _0x21a6c3.classList.add("text-white");
        } else {
          _0x21a6c3.classList.add('text-black');
        }
        _0x196236(_0x21a6c3);
        const _0x5226c1 = _0x21a6c3.getAttribute("aria-controls");
        const _0xa5a863 = document.getElementById(_0x5226c1);
        if (_0xa5a863) {
          document.querySelectorAll("[role=\"tabpanel\"]").forEach(_0x1606e6 => {
            _0x1606e6.classList.add('hidden');
            _0x1606e6.classList.remove("block");
          });
          _0xa5a863.classList.remove('hidden');
          _0xa5a863.classList.add("block");
        }
      }
      function _0x196236(_0x359405) {
        const _0x25d825 = _0x359405.getBoundingClientRect();
        _0x5e1a04.style.width = _0x25d825.width + 'px';
        _0x5e1a04.style.transform = "translate(" + _0x25d825.left + "px, " + _0x25d825.bottom + "px)";
      }
      _0x4ac7cc.forEach(_0x3a3992 => {
        _0x3a3992.addEventListener('click', _0x3b3e4b);
      });
      _0x196236(_0x4ac7cc[0x0]);
    });
  });