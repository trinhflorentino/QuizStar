auth.onAuthStateChanged(_0x222c43 => {
    if (!_0x222c43) {
      return;
    }
    const _0x5060ae = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x5060ae.onSnapshot(_0xc701b9 => {
      if (!_0xc701b9.exists) {
        return;
      }
      const _0x4b2dee = _0xc701b9.data().match;
      document.getElementById("QuestionManagerSave").addEventListener("click", async () => {
        const _0x455e99 = document.getElementById("QuestionManagerSave");
        try {
          loadingAnimation.show("Đang lưu câu hỏi...");
          if (_0x455e99) {
            _0x455e99.disabled = true;
            _0x455e99.style.opacity = "0.7";
            _0x455e99.style.cursor = 'not-allowed';
          }
          const _0x39ece8 = {};
          const _0x1b059e = getPlayerLimit();
          for (let _0x406b87 = 0x0; _0x406b87 < _0x1b059e; _0x406b87++) {
            const _0x57d9ec = 'Q' + (_0x406b87 + 0x1) + 'DB';
            for (let _0x4322fb = 0x1; _0x4322fb <= 0x6; _0x4322fb++) {
              const _0x1586bd = document.getElementById("startI_" + _0x57d9ec + "_question" + _0x4322fb);
              const _0x2a0e1b = document.getElementById('startI_' + _0x57d9ec + "_answer" + _0x4322fb);
              const _0x26710b = _0x1586bd ? _0x1586bd.value.trim() : '';
              const _0x3d95ae = _0x2a0e1b ? _0x2a0e1b.value.trim() : '';
              _0x39ece8[_0x4b2dee + "/StartQuestion/" + _0x57d9ec + "/cau" + _0x4322fb] = _0x26710b;
              _0x39ece8[_0x4b2dee + "/StartQuestion/" + _0x57d9ec + "/dacau" + _0x4322fb] = _0x3d95ae;
            }
          }
          const _0x1bd433 = document.getElementById("questionsContainerII");
          Array.from(_0x1bd433.children).forEach((_0x598207, _0x1db6dd) => {
            const _0x4ca76f = 'L' + (_0x1db6dd + 0x1);
            const _0xb0d92 = _0x1db6dd === 0x0 ? 0xc : _0x1db6dd === 0x1 ? 0x19 : 0x23;
            for (let _0x106712 = 0x1; _0x106712 <= _0xb0d92; _0x106712++) {
              const _0x49cda8 = document.getElementById("startII_pack" + (_0x1db6dd + 0x1) + "_question" + _0x106712).value.trim();
              const _0x1fe0cb = document.getElementById("startII_pack" + (_0x1db6dd + 0x1) + "_answer" + _0x106712).value.trim();
              _0x39ece8[_0x4b2dee + '/KDO22Question/' + _0x4ca76f + "/cau" + _0x106712] = _0x49cda8;
              _0x39ece8[_0x4b2dee + "/KDO22Question/" + _0x4ca76f + "/dacau" + _0x106712] = _0x1fe0cb;
            }
          });
          const _0x399082 = ["HN1", 'HN2', "HN3", "HN4", "HNTT"];
          _0x399082.forEach((_0x43719e, _0x2f2585) => {
            const _0x4fc9e3 = document.getElementById("obstacle_pack" + (_0x2f2585 + 0x1) + "_question").value.trim();
            const _0x300520 = document.getElementById("obstacle_pack" + (_0x2f2585 + 0x1) + "_answer").value.trim().toUpperCase();
            _0x39ece8[_0x4b2dee + "/VCNVQuestion/" + _0x43719e + '/cauhoi'] = _0x4fc9e3;
            _0x39ece8[_0x4b2dee + '/VCNVQuestion/' + _0x43719e + "/dapan"] = _0x300520;
          });
          _0x39ece8[_0x4b2dee + '/VCNVQuestion/CNV/cnv'] = document.getElementById("ObstacleText").value.trim();
          _0x39ece8[_0x4b2dee + "/VCNVQuestion/Explaination/text"] = document.getElementById('ObstacleExplaination').value.trim();
          for (let _0x5ec280 = 0x1; _0x5ec280 <= 0x4; _0x5ec280++) {
            const _0x64358d = document.getElementById("acceleration_textarea_question" + _0x5ec280).value.trim();
            const _0x5cfeb6 = document.getElementById("acceleration_textarea_answer" + _0x5ec280).value.trim();
            _0x39ece8[_0x4b2dee + "/AccelerationQuestion/QS" + _0x5ec280 + "/cauhoi"] = _0x64358d;
            _0x39ece8[_0x4b2dee + "/AccelerationQuestion/QS" + _0x5ec280 + "/dapan"] = _0x5cfeb6;
          }
          ;
          for (let _0x6985ec = 0x1; _0x6985ec <= _0x1b059e; _0x6985ec++) {
            for (const _0xecabe1 of [0xa, 0x14, 0x1e]) {
              for (let _0x23f79f = 0x1; _0x23f79f <= 0x3; _0x23f79f++) {
                const _0x1834d7 = document.getElementById('finish_pack' + _0x6985ec + "_points" + _0xecabe1 + "_question" + _0x23f79f);
                const _0x454a52 = document.getElementById("finish_pack" + _0x6985ec + "_points" + _0xecabe1 + "_answer" + _0x23f79f);
                const _0x5cc2a6 = _0x1834d7 ? _0x1834d7.value.trim() : '';
                const _0x359b36 = _0x454a52 ? _0x454a52.value.trim() : '';
                _0x39ece8[_0x4b2dee + "/FinishQuestion/Q" + _0x6985ec + "DB/QP" + _0xecabe1 + '/' + _0x23f79f + "/cauhoi"] = _0x5cc2a6;
                _0x39ece8[_0x4b2dee + "/FinishQuestion/Q" + _0x6985ec + "DB/QP" + _0xecabe1 + '/' + _0x23f79f + "/dapan"] = _0x359b36;
              }
            }
          }
          ;
          for (let _0x455556 = 0x1; _0x455556 <= 0xa; _0x455556++) {
            const _0x2a4b25 = document.getElementById('additional_question' + _0x455556).value.trim();
            const _0x14beaf = document.getElementById("additional_answer" + _0x455556).value.trim();
            _0x39ece8[_0x4b2dee + "/CHPQuestion/cau" + _0x455556] = _0x2a4b25;
            _0x39ece8[_0x4b2dee + "/CHPQuestion/dacau" + _0x455556] = _0x14beaf;
          }
          const _0x360172 = document.getElementById("MatchName").value.trim();
          _0x39ece8[_0x4b2dee + '/match'] = _0x360172;
          _0x39ece8[_0x4b2dee + '/Match/Name/match'] = _0x360172;
          _0x39ece8["MatchList/" + _0x4b2dee + '/matchname'] = _0x360172;
          const _0x36090a = document.getElementById("playerLimit4");
          const _0x433f51 = document.getElementById("playerLimit5");
          let _0x5ef206 = 0x4;
          if (_0x433f51 && _0x433f51.checked) {
            _0x5ef206 = 0x5;
          } else if (_0x36090a && _0x36090a.checked) {
            _0x5ef206 = 0x4;
          }
          _0x39ece8[_0x4b2dee + "/PlayerLimit"] = _0x5ef206;
          setPlayerLimit(_0x5ef206);
          loadingAnimation.updateMessage("Đang hoàn tất lưu câu hỏi...");
          await realtimeDB.ref().update(_0x39ece8);
          loadingAnimation.hide();
          if (_0x455e99) {
            _0x455e99.disabled = false;
            _0x455e99.style.opacity = '1';
            _0x455e99.style.cursor = "pointer";
          }
          successToast("Tất cả thay đổi đã được lưu thành công!");
        } catch (_0x27e7a9) {
          console.error("Error saving questions:", _0x27e7a9);
          loadingAnimation.hide();
          if (_0x455e99) {
            _0x455e99.disabled = false;
            _0x455e99.style.opacity = '1';
            _0x455e99.style.cursor = "pointer";
          }
          failToast("Lỗi khi lưu câu hỏi: " + (_0x27e7a9.message || _0x27e7a9));
        }
      });
      document.getElementById("QuestionManagerLoadExcelFile").addEventListener('click', () => {
        document.getElementById("excelFileInput").click();
      });
      document.getElementById("excelFileInput").addEventListener("change", async _0x58d1cf => {
        const _0x2e4c17 = _0x58d1cf.target.files[0x0];
        if (_0x2e4c17) {
          console.log("File selected: " + _0x2e4c17.name);
          const _0x37f274 = new FileReader();
          _0x37f274.onload = function (_0x42f59d) {
            const _0x1d41c8 = new Uint8Array(_0x42f59d.target.result);
            const _0x532900 = XLSX.read(_0x1d41c8, {
              'type': "array"
            });
            const _0x3dcedf = _0x532900.SheetNames[0x0];
            const _0xd39858 = _0x532900.Sheets[_0x3dcedf];
            const _0x464396 = XLSX.utils.sheet_to_json(_0xd39858, {
              'header': 0x1
            });
            console.log(_0x464396);
            const _0x17634d = getPlayerLimit();
            for (let _0x1c33bd = 0x1; _0x1c33bd <= _0x17634d; _0x1c33bd++) {
              for (let _0x5f0a0d = 0x1; _0x5f0a0d <= 0x6; _0x5f0a0d++) {
                const _0x373158 = "startI_Q" + _0x1c33bd + "DB_question" + _0x5f0a0d;
                const _0x5965ad = 'startI_Q' + _0x1c33bd + "DB_answer" + _0x5f0a0d;
                const _0x14f2bb = _0x464396[0x6 + _0x5f0a0d]?.[_0x1c33bd * 0x2 - 0x1] || '';
                const _0x1284da = _0x464396[0x6 + _0x5f0a0d]?.[_0x1c33bd * 0x2] || '';
                const _0x4942c2 = document.getElementById(_0x373158);
                const _0x2b7084 = document.getElementById(_0x5965ad);
                if (_0x4942c2) {
                  _0x4942c2.value = _0x14f2bb;
                }
                if (_0x2b7084) {
                  _0x2b7084.value = _0x1284da;
                }
              }
            }
            const _0x64d72d = [{
              'pack': 0x1,
              'startRow': 0x48,
              'endRow': 0x53
            }, {
              'pack': 0x2,
              'startRow': 0x59,
              'endRow': 0x71
            }, {
              'pack': 0x3,
              'startRow': 0x77,
              'endRow': 0x99
            }];
            _0x64d72d.forEach(({
              pack: _0x1b888a,
              startRow: _0x41e4aa,
              endRow: _0x355165
            }) => {
              let _0x15f3cd = 0x1;
              for (let _0x2a6c45 = _0x41e4aa; _0x2a6c45 <= _0x355165; _0x2a6c45++) {
                const _0x4e6c4a = 'startII_pack' + _0x1b888a + '_question' + _0x15f3cd;
                const _0x3c045d = "startII_pack" + _0x1b888a + "_answer" + _0x15f3cd;
                const _0x5d0ca2 = _0x464396[_0x2a6c45]?.[0x1] || '';
                const _0x2607bd = _0x464396[_0x2a6c45]?.[0x2] || '';
                const _0x5b2621 = document.getElementById(_0x4e6c4a);
                const _0x28dfcf = document.getElementById(_0x3c045d);
                if (_0x5b2621) {
                  _0x5b2621.value = _0x5d0ca2;
                }
                if (_0x28dfcf) {
                  _0x28dfcf.value = _0x2607bd;
                }
                _0x15f3cd++;
              }
            });
            document.getElementById("ObstacleText").value = _0x464396[0x11]?.[0x1] || '';
            document.getElementById("ObstacleExplaination").value = _0x464396[0x11]?.[0x2] || '';
            document.getElementById('MatchName').value = _0x464396[0x2][0x1];
            for (let _0xcc203 = 0x1; _0xcc203 <= 0x5; _0xcc203++) {
              const _0x518c14 = "obstacle_pack" + _0xcc203 + '_question';
              const _0x9f36f5 = "obstacle_pack" + _0xcc203 + "_answer";
              const _0x2b8e77 = _0x464396[0x12 + _0xcc203]?.[0x1] || '';
              const _0x5260c2 = _0x464396[0x12 + _0xcc203]?.[0x2] || '';
              const _0x4b494d = document.getElementById(_0x518c14);
              const _0xeabbcd = document.getElementById(_0x9f36f5);
              if (_0x4b494d) {
                _0x4b494d.value = _0x2b8e77;
              }
              if (_0xeabbcd) {
                _0xeabbcd.value = _0x5260c2;
              }
            }
            for (let _0x5c2d41 = 0x1; _0x5c2d41 <= 0x4; _0x5c2d41++) {
              const _0x5e7ace = 'acceleration_textarea_question' + _0x5c2d41;
              const _0x576b06 = 'acceleration_textarea_answer' + _0x5c2d41;
              const _0x2dac2a = _0x464396[0x1c + _0x5c2d41]?.[0x1] || '';
              const _0x4313ee = _0x464396[0x1c + _0x5c2d41]?.[0x2] || '';
              const _0xc0e282 = document.getElementById(_0x5e7ace);
              const _0x4fad00 = document.getElementById(_0x576b06);
              if (_0xc0e282) {
                _0xc0e282.value = _0x2dac2a;
              }
              if (_0x4fad00) {
                _0x4fad00.value = _0x4313ee;
              }
            }
            const _0x398c00 = [{
              'points': 0xa,
              'row': 0x27
            }, {
              'points': 0x14,
              'row': 0x2a
            }, {
              'points': 0x1e,
              'row': 0x2d
            }];
            for (let _0x456ac5 = 0x1; _0x456ac5 <= _0x17634d; _0x456ac5++) {
              _0x398c00.forEach(({
                points: _0x2c9df0,
                row: _0x290eb4
              }) => {
                for (let _0x134396 = 0x1; _0x134396 <= 0x3; _0x134396++) {
                  const _0x1a19c5 = "finish_pack" + _0x456ac5 + "_points" + _0x2c9df0 + "_question" + _0x134396;
                  const _0x4292b0 = "finish_pack" + _0x456ac5 + "_points" + _0x2c9df0 + '_answer' + _0x134396;
                  const _0x3656ee = (_0x456ac5 - 0x1) * 0x2;
                  const _0x37052a = _0x464396[_0x290eb4 - 0x1 + (_0x134396 - 0x1)]?.[0x1 + _0x3656ee] || '';
                  const _0x1243e6 = _0x464396[_0x290eb4 - 0x1 + (_0x134396 - 0x1)]?.[0x2 + _0x3656ee] || '';
                  const _0x3c4ae8 = document.getElementById(_0x1a19c5);
                  const _0x567f5c = document.getElementById(_0x4292b0);
                  if (_0x3c4ae8) {
                    _0x3c4ae8.value = _0x37052a;
                  }
                  if (_0x567f5c) {
                    _0x567f5c.value = _0x1243e6;
                  }
                }
              });
            }
            for (let _0x23ea66 = 0x1; _0x23ea66 <= 0xa; _0x23ea66++) {
              const _0x120f25 = "additional_question" + _0x23ea66;
              const _0x3adf93 = 'additional_answer' + _0x23ea66;
              const _0xed4c83 = _0x464396[0x33 + _0x23ea66]?.[0x1] || '';
              const _0x19fa48 = _0x464396[0x33 + _0x23ea66]?.[0x2] || '';
              const _0x5103f2 = document.getElementById(_0x120f25);
              const _0xa393b2 = document.getElementById(_0x3adf93);
              if (_0x5103f2) {
                _0x5103f2.value = _0xed4c83;
              }
              if (_0xa393b2) {
                _0xa393b2.value = _0x19fa48;
              }
            }
            successToast("Đã đọc dữ liệu từ file Excel");
          };
          _0x37f274.readAsArrayBuffer(_0x2e4c17);
        } else {
          failToast("Không tìm thấy file Excel");
        }
      });
      document.getElementById("QuestionManagerExportExcelFile").addEventListener("click", async () => {
        try {
          const _0x41e9ef = document.createElement("input");
          _0x41e9ef.type = "file";
          _0x41e9ef.accept = '.xlsx';
          _0x41e9ef.style.display = "none";
          _0x41e9ef.addEventListener('change', async _0x49d8c5 => {
            const _0x4021a2 = _0x49d8c5.target.files[0x0];
            if (!_0x4021a2) {
              failToast("Không có file nào được chọn.");
              return;
            }
            const _0x5a68bd = new FileReader();
            _0x5a68bd.onload = function (_0x2e8c16) {
              const _0x51c98a = new Uint8Array(_0x2e8c16.target.result);
              const _0x5012c0 = XLSX.read(_0x51c98a, {
                'type': 'array'
              });
              const _0x3d8fb4 = _0x5012c0.Sheets[_0x5012c0.SheetNames[0x0]];
              const _0x319f80 = {};
              for (const _0x21f96c in _0x3d8fb4) {
                const _0x17a405 = _0x3d8fb4[_0x21f96c];
                if (_0x17a405.s) {
                  _0x319f80[_0x21f96c] = _0x17a405.s;
                }
              }
              _0x3d8fb4.B3 = {
                'v': document.getElementById('MatchName').value.trim() || '',
                's': _0x319f80.B3
              };
              const _0x1f767b = getPlayerLimit();
              for (let _0x11a2ed = 0x1; _0x11a2ed <= _0x1f767b; _0x11a2ed++) {
                for (let _0x4cef3a = 0x1; _0x4cef3a <= 0x6; _0x4cef3a++) {
                  const _0x250505 = "startI_Q" + _0x11a2ed + "DB_question" + _0x4cef3a;
                  const _0x1fc647 = 'startI_Q' + _0x11a2ed + "DB_answer" + _0x4cef3a;
                  const _0x33c25d = document.getElementById(_0x250505)?.["value"]["trim"]() || '';
                  const _0x5203df = document.getElementById(_0x1fc647)?.["value"]["trim"]() || '';
                  const _0x5a53eb = 0x6 + _0x4cef3a;
                  const _0x24329a = _0x11a2ed * 0x2 - 0x1;
                  const _0x44f687 = _0x11a2ed * 0x2;
                  const _0x32269c = XLSX.utils.encode_cell({
                    'c': _0x24329a,
                    'r': _0x5a53eb
                  });
                  const _0x210934 = XLSX.utils.encode_cell({
                    'c': _0x44f687,
                    'r': _0x5a53eb
                  });
                  _0x3d8fb4[_0x32269c] = {
                    'v': _0x33c25d,
                    's': _0x319f80[_0x32269c]
                  };
                  _0x3d8fb4[_0x210934] = {
                    'v': _0x5203df,
                    's': _0x319f80[_0x210934]
                  };
                }
              }
              const _0x11a767 = [{
                'pack': 0x1,
                'startRow': 0x48,
                'endRow': 0x53
              }, {
                'pack': 0x2,
                'startRow': 0x59,
                'endRow': 0x71
              }, {
                'pack': 0x3,
                'startRow': 0x77,
                'endRow': 0x99
              }];
              _0x11a767.forEach(({
                pack: _0x12a7a9,
                startRow: _0x336af8,
                endRow: _0x2f6b1b
              }) => {
                let _0x549f9a = 0x1;
                for (let _0x7f85a6 = _0x336af8; _0x7f85a6 <= _0x2f6b1b; _0x7f85a6++) {
                  const _0x1cc7b0 = "startII_pack" + _0x12a7a9 + "_question" + _0x549f9a;
                  const _0x4012a8 = "startII_pack" + _0x12a7a9 + "_answer" + _0x549f9a;
                  const _0xcdcf9e = document.getElementById(_0x1cc7b0)?.["value"]["trim"]() || '';
                  const _0x12e7fb = document.getElementById(_0x4012a8)?.["value"]["trim"]() || '';
                  const _0xe8a0ae = XLSX.utils.encode_cell({
                    'c': 0x1,
                    'r': _0x7f85a6
                  });
                  const _0x927d9c = XLSX.utils.encode_cell({
                    'c': 0x2,
                    'r': _0x7f85a6
                  });
                  _0x3d8fb4[_0xe8a0ae] = {
                    'v': _0xcdcf9e,
                    's': _0x319f80[_0xe8a0ae]
                  };
                  _0x3d8fb4[_0x927d9c] = {
                    'v': _0x12e7fb,
                    's': _0x319f80[_0x927d9c]
                  };
                  _0x549f9a++;
                }
              });
              _0x3d8fb4.B18 = {
                'v': document.getElementById("ObstacleText")?.["value"]["trim"]() || '',
                's': _0x319f80.B18
              };
              for (let _0x316cd5 = 0x1; _0x316cd5 <= 0x5; _0x316cd5++) {
                const _0x12c86e = "obstacle_pack" + _0x316cd5 + "_question";
                const _0x4373f8 = "obstacle_pack" + _0x316cd5 + "_answer";
                const _0x5e9080 = document.getElementById(_0x12c86e)?.['value']["trim"]() || '';
                const _0x10e476 = document.getElementById(_0x4373f8)?.['value']['trim']() || '';
                const _0x49dd56 = 0x12 + _0x316cd5;
                const _0x4910d8 = XLSX.utils.encode_cell({
                  'c': 0x1,
                  'r': _0x49dd56
                });
                const _0x25281f = XLSX.utils.encode_cell({
                  'c': 0x2,
                  'r': _0x49dd56
                });
                _0x3d8fb4[_0x4910d8] = {
                  'v': _0x5e9080,
                  's': _0x319f80[_0x4910d8]
                };
                _0x3d8fb4[_0x25281f] = {
                  'v': _0x10e476,
                  's': _0x319f80[_0x25281f]
                };
              }
              for (let _0x145545 = 0x1; _0x145545 <= 0x4; _0x145545++) {
                const _0x463135 = "acceleration_textarea_question" + _0x145545;
                const _0x45e9f7 = "acceleration_textarea_answer" + _0x145545;
                const _0x22748f = document.getElementById(_0x463135)?.["value"]["trim"]() || '';
                const _0x3af1cb = document.getElementById(_0x45e9f7)?.["value"]["trim"]() || '';
                const _0x7b58c6 = 0x1c + _0x145545;
                const _0xa36c67 = XLSX.utils.encode_cell({
                  'c': 0x1,
                  'r': _0x7b58c6
                });
                const _0x52bb09 = XLSX.utils.encode_cell({
                  'c': 0x2,
                  'r': _0x7b58c6
                });
                _0x3d8fb4[_0xa36c67] = {
                  'v': _0x22748f,
                  's': _0x319f80[_0xa36c67]
                };
                _0x3d8fb4[_0x52bb09] = {
                  'v': _0x3af1cb,
                  's': _0x319f80[_0x52bb09]
                };
              }
              const _0x1ef553 = [{
                'points': 0xa,
                'row': 0x27
              }, {
                'points': 0x14,
                'row': 0x2a
              }, {
                'points': 0x1e,
                'row': 0x2d
              }];
              for (let _0x52200e = 0x1; _0x52200e <= _0x1f767b; _0x52200e++) {
                _0x1ef553.forEach(({
                  points: _0x53f476,
                  row: _0xdc6359
                }) => {
                  for (let _0x2c1176 = 0x1; _0x2c1176 <= 0x3; _0x2c1176++) {
                    const _0x4b9fa9 = 'finish_pack' + _0x52200e + '_points' + _0x53f476 + "_question" + _0x2c1176;
                    const _0x25fff4 = "finish_pack" + _0x52200e + '_points' + _0x53f476 + '_answer' + _0x2c1176;
                    const _0xba4c12 = document.getElementById(_0x4b9fa9)?.["value"]["trim"]() || '';
                    const _0x45825d = document.getElementById(_0x25fff4)?.["value"]["trim"]() || '';
                    const _0x2bbf8c = (_0x52200e - 0x1) * 0x2;
                    const _0x35ee0e = XLSX.utils.encode_cell({
                      'c': 0x1 + _0x2bbf8c,
                      'r': _0xdc6359 - 0x1 + (_0x2c1176 - 0x1)
                    });
                    const _0x4933c4 = XLSX.utils.encode_cell({
                      'c': 0x2 + _0x2bbf8c,
                      'r': _0xdc6359 - 0x1 + (_0x2c1176 - 0x1)
                    });
                    _0x3d8fb4[_0x35ee0e] = {
                      'v': _0xba4c12,
                      's': _0x319f80[_0x35ee0e]
                    };
                    _0x3d8fb4[_0x4933c4] = {
                      'v': _0x45825d,
                      's': _0x319f80[_0x4933c4]
                    };
                  }
                });
              }
              for (let _0x38b65d = 0x1; _0x38b65d <= 0xa; _0x38b65d++) {
                const _0x236968 = "additional_question" + _0x38b65d;
                const _0x3f1322 = "additional_answer" + _0x38b65d;
                const _0x54bec6 = document.getElementById(_0x236968)?.["value"]["trim"]() || '';
                const _0x32c5bf = document.getElementById(_0x3f1322)?.['value']['trim']() || '';
                const _0x23b3d0 = 0x33 + _0x38b65d;
                const _0x211ba8 = XLSX.utils.encode_cell({
                  'c': 0x1,
                  'r': _0x23b3d0
                });
                const _0x21ad7f = XLSX.utils.encode_cell({
                  'c': 0x2,
                  'r': _0x23b3d0
                });
                _0x3d8fb4[_0x211ba8] = {
                  'v': _0x54bec6,
                  's': _0x319f80[_0x211ba8]
                };
                _0x3d8fb4[_0x21ad7f] = {
                  'v': _0x32c5bf,
                  's': _0x319f80[_0x21ad7f]
                };
              }
              XLSX.writeFile(_0x5012c0, 'FormTOO_Export_' + new Date().toISOString().slice(0x0, 0xa) + ".xlsx");
              successToast("Đã xuất dữ liệu thành công.");
            };
            _0x5a68bd.readAsArrayBuffer(_0x4021a2);
          });
          _0x41e9ef.click();
        } catch (_0x156095) {
          console.error(_0x156095);
          failToast("Lỗi khi xuất file Excel.");
        }
      });
      document.getElementById('obstacleFileUpload').addEventListener("change", async _0x239a03 => {
        const _0x5e046b = _0x239a03.target.files[0x0];
        if (_0x5e046b) {
          try {
            // Show loading toast
            const loadingToastId = Date.now();
            if (typeof showToast === "function") {
              showToast("⏳ Đang tải lên hình ảnh chướng ngại vật...", "info", 0, "top", "right", true, false, loadingToastId.toString());
            } else {
              successToast("Đang tải lên hình ảnh chướng ngại vật...");
            }
            
            const _0x5b8080 = realtimeDB.ref(_0x4b2dee + "/QuestionMedia");
            const _0x5db610 = await _0x5b8080.once("value");
            const _0x4152f4 = _0x5db610.val() || {};
            const _0x4451e6 = Object.entries(_0x4152f4).find(([_0xff931c, _0x3f1730]) => _0x3f1730.competition === "VCNVQuestion" && _0x3f1730.pack === "CNV" && _0x3f1730.questionNumber === "background" && _0x3f1730.isBackgroundImage === true);
            
            // Delete existing image if found
            if (_0x4451e6) {
              const [_0x4357d6, _0xf2fa36] = _0x4451e6;
              try {
                const publicId = window.cloudinaryService.extractPublicId(_0xf2fa36.downloadURL);
                await window.cloudinaryService.deleteFile(publicId);
                await _0x5b8080.child(_0x4357d6).remove();
              } catch (_0x570277) {
                console.log("Error deleting existing obstacle image:", _0x570277);
              }
            }
            
            // Upload new image using Cloudinary
            const _0x1f86c4 = Date.now();
            const _0x2be4a3 = "VCNVQuestion_CNV_background_image_" + _0x1f86c4;
            const folder = _0x4b2dee + "/question_media";
            
            const uploadResult = await window.cloudinaryService.uploadFile(_0x5e046b, {
              folder: folder,
              publicId: _0x2be4a3,
              onProgress: (progressData) => {
                // Update progress if needed
                console.log("Upload progress:", progressData.percent + "%");
              }
            });
            
            const _0x3bcd3c = uploadResult.url;
            
            const _0xccb7be = {
              'competition': "VCNVQuestion",
              'pack': "CNV",
              'questionNumber': 'background',
              'mediaType': "image",
              'fileName': _0x2be4a3,
              'downloadURL': _0x3bcd3c,
              'uploadDate': _0x1f86c4,
              'isBackgroundImage': true
            };
            
            const _0x16a941 = _0x5b8080.push();
            await _0x16a941.set(_0xccb7be);
            document.getElementById("ObstacleImage").src = _0x3bcd3c;
            
            // Close loading toast
            if (typeof closeToast === "function") {
              closeToast(loadingToastId.toString());
            }
            
            successToast("✅ Tải lên hình ảnh Vượt chướng ngại vật thành công");
            
            if (typeof loadMediaData === 'function') {
              loadMediaData();
            }
          } catch (_0xaaa532) {
            console.error("Error uploading obstacle image:", _0xaaa532);
            failToast("❌ Tải lên hình ảnh thất bại: " + _0xaaa532.message);
          }
        } else {
          failToast("Không có file nào được chọn");
        }
      });
      document.getElementById('deleteObstacleImage').addEventListener("click", async () => {
        try {
          const _0x1d9e00 = realtimeDB.ref(_0x4b2dee + "/QuestionMedia");
          _0x1d9e00.once("value", async _0x54c349 => {
            const _0x1c342e = _0x54c349.val() || {};
            const _0x4a4e07 = Object.entries(_0x1c342e).find(([_0x510192, _0x3bd41f]) => _0x3bd41f.competition === "VCNVQuestion" && _0x3bd41f.pack === 'CNV' && _0x3bd41f.questionNumber === "background" && _0x3bd41f.isBackgroundImage === true);
            if (_0x4a4e07) {
              const [_0x27b037, _0x3f2a38] = _0x4a4e07;
              const _0x2afe4c = window.cloudinaryService.ref(_0x4b2dee + '/question_media/' + _0x3f2a38.fileName);
              await _0x2afe4c["delete"]();
              await _0x1d9e00.child(_0x27b037).remove();
              document.getElementById("ObstacleImage").src = '';
              successToast("Xóa hình ảnh Vượt chướng ngại vật thành công");
              if (typeof loadMediaData === 'function') {
                loadMediaData();
              }
            } else {
              try {
                const _0x59c452 = window.cloudinaryService.ref(_0x4b2dee + "/img/cnv/cnv.jpg");
                await _0x59c452['delete']();
                document.getElementById("ObstacleImage").src = '';
                successToast("Xóa hình ảnh Vượt chướng ngại vật thành công");
              } catch (_0x518a2f) {
                failToast("Không tìm thấy hình ảnh để xóa");
              }
            }
          });
        } catch (_0x5ac468) {
          console.error("Error deleting obstacle image:", _0x5ac468);
          failToast("Xóa hình ảnh thất bại");
        }
      });
      const _0x5845d2 = realtimeDB.ref(_0x4b2dee + "/FinishCustomVideo");
      document.getElementById("addVideoBtn").addEventListener("click", async () => {
        const _0x5914b0 = document.getElementById("videoName").value.trim();
        let _0x1f5ab5 = document.getElementById('videoURL').value.trim();
        if (!_0x5914b0 || !_0x1f5ab5) {
          failToast("Vui lòng điền đầy đủ thông tin.", 0xbb8, "top", "right", true, false, '');
          return;
        }
        try {
          new URL(_0x1f5ab5);
        } catch (_0x147551) {
          failToast("Vui lòng nhập một đường dẫn URL hợp lệ.", 0xbb8, "top", "right", true, false, '');
          return;
        }
        if (_0x1f5ab5.includes('youtube.com') || _0x1f5ab5.includes('youtu.be')) {
          if (_0x1f5ab5.includes("watch?v=")) {
            const _0x3cb2f1 = _0x1f5ab5.split('watch?v=')[0x1].split('&')[0x0];
            _0x1f5ab5 = "https://www.youtube.com/embed/" + _0x3cb2f1;
          } else {
            if (_0x1f5ab5.includes("youtu.be/")) {
              const _0x4c57d5 = _0x1f5ab5.split('youtu.be/')[0x1].split('?')[0x0];
              _0x1f5ab5 = "https://www.youtube.com/embed/" + _0x4c57d5;
            }
          }
          if (_0x1f5ab5.includes("youtube.com/embed") && !_0x1f5ab5.includes("autoplay=1")) {
            const _0xc1d4aa = _0x1f5ab5.includes('?') ? '&' : '?';
            _0x1f5ab5 += _0xc1d4aa + "autoplay=1&controls=0&rel=0";
          }
        }
        const _0x1eedda = {
          'id': Date.now(),
          'name': _0x5914b0,
          'url': _0x1f5ab5
        };
        try {
          const _0x5826e3 = await _0x5845d2.once("value");
          const _0x5dd0ad = _0x5826e3.val() || [];
          _0x5dd0ad.push(_0x1eedda);
          await _0x5845d2.set(_0x5dd0ad);
          successToast("Thêm video thành công.", 0xbb8, "top", 'right', true, false, '');
        } catch (_0x1509af) {
          failToast("Thao tác thất bại.", 0xbb8, "top", "right", true, false, '');
          return;
        }
        document.getElementById("videoName").value = '';
        document.getElementById('videoURL').value = '';
      });
      _0x5845d2.on("value", _0x56f157 => {
        const _0x32058c = _0x56f157.val() || [];
        const _0x1169ca = document.getElementById("videoTableBody");
        const _0x4641d3 = document.getElementById('videoCardContainer');
        _0x1169ca.innerHTML = '';
        _0x4641d3.innerHTML = '';
        if (_0x32058c.length === 0x0) {
          _0x1169ca.innerHTML = "\n      <tr>\n        <td colspan=\"4\" class=\"p-4 text-center text-gray-700 dark:text-neutral-300\">Không có video nào được thêm</td>\n      </tr>";
          _0x4641d3.innerHTML = "\n      <div class=\"text-center text-gray-700 dark:text-neutral-300 py-8\">\n        Không có video nào được thêm\n      </div>";
          return;
        }
        _0x32058c.forEach((_0x28e696, _0x340847) => {
          const _0x46d9c3 = document.createElement('tr');
          _0x46d9c3.classList.add('even:bg-blue-gray-50/50');
          _0x46d9c3.innerHTML = "\n      <td class=\"p-4\">" + (_0x340847 + 0x1) + "</td>\n      <td class=\"p-4\">\n        <div class=\"flex items-center\">\n          " + _0x28e696.name + "\n          " + (_0x28e696.isUploaded ? "<span class=\"ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full\">Đã tải lên</span>" : "<span class=\"ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full\">URL</span>") + "\n        </div>\n      </td>\n      <td class=\"p-4\"><a href=\"" + _0x28e696.url + "\" target=\"_blank\" class=\"text-blue-600 dark:text-blue-400 hover:underline\">" + (_0x28e696.url.length > 0x32 ? _0x28e696.url.substring(0x0, 0x32) + "..." : _0x28e696.url) + "</a></td>\n      <td class=\"p-4\">\n        <button class=\"bg-blue-500 dark:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300 mr-2 font-semibold watch-btn\">Xem trước</button>\n        <button class=\"bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-600 dark:hover:bg-yellow-600 transition duration-300 mr-2 font-semibold edit-btn\">Sửa đường dẫn</button>\n        <button class=\"bg-red-500 dark:bg-red-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 dark:hover:bg-red-500 transition duration-300 font-semibold delete-btn\">Xoá</button>\n      </td>\n    ";
          _0x46d9c3.querySelector(".watch-btn").addEventListener("click", () => {
            window.open(_0x28e696.url, '_blank');
          });
          _0x46d9c3.querySelector(".edit-btn").addEventListener("click", async () => {
            let _0x35f9be = prompt("Sửa URL:", _0x28e696.url);
            if (_0x35f9be !== null) {
              if (_0x35f9be.includes('youtube.com') && !_0x35f9be.includes('&autoplay=1&controls=0&rel=0')) {
                _0x35f9be += '&autoplay=1&controls=0&rel=0';
              }
              _0x32058c[_0x340847].url = _0x35f9be;
              await _0x5845d2.set(_0x32058c);
            }
          });
          _0x46d9c3.querySelector(".delete-btn").addEventListener('click', async () => {
            const _0x36ae9b = _0x28e696.isUploaded ? "Bạn có muốn xóa video \"" + _0x28e696.name + "\" không?\n\nLưu ý: Video đã tải lên sẽ được xóa vĩnh viễn khỏi Firebase Storage." : "Bạn có muốn xóa video \"" + _0x28e696.name + "\" không?";
            if (confirm(_0x36ae9b)) {
              try {
                loadingAnimation.show("Đang xóa video...");
                await _0x15d3d8(_0x28e696);
                _0x32058c.splice(_0x340847, 0x1);
                await _0x5845d2.set(_0x32058c);
                successToast("Xóa video thành công!", 0xbb8, "top", "right", true, false, '');
              } catch (_0x4df508) {
                console.error("Error deleting video:", _0x4df508);
                failToast("Lỗi khi xóa video. Vui lòng thử lại.", 0xbb8, "top", "right", true, false, '');
              } finally {
                loadingAnimation.hide();
              }
            }
          });
          _0x1169ca.appendChild(_0x46d9c3);
          const _0x32cdae = document.createElement('div');
          _0x32cdae.className = "bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-600 p-4 shadow-sm";
          _0x32cdae.innerHTML = "\n                    <div class=\"flex justify-between items-start mb-3\">\n                        <div class=\"flex-1\">\n                            <h3 class=\"font-semibold text-gray-900 dark:text-white text-sm\">" + _0x28e696.name + "</h3>\n                            <p class=\"text-xs text-gray-500 dark:text-gray-400 mt-1\">Thứ tự: " + (_0x340847 + 0x1) + "</p>\n                        </div>\n                        <div class=\"flex items-center space-x-1\">\n                            " + (_0x28e696.isUploaded ? "<span class=\"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full\">Đã tải lên</span>" : "<span class=\"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full\">URL</span>") + "\n                        </div>\n                    </div>\n                    <div class=\"mb-3\">\n                        <p class=\"text-xs text-gray-600 dark:text-gray-400 break-all\">" + (_0x28e696.url.length > 0x3c ? _0x28e696.url.substring(0x0, 0x3c) + '...' : _0x28e696.url) + "</p>\n                    </div>\n                    <div class=\"flex flex-wrap gap-2\">\n                        <button class=\"bg-blue-500 dark:bg-blue-400 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300 watch-btn-mobile\">Xem trước</button>\n                        <button class=\"bg-yellow-500 dark:bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600 dark:hover:bg-yellow-500 transition duration-300 edit-btn-mobile\">Sửa đường dẫn</button>\n                        <button class=\"bg-red-500 dark:bg-red-400 text-white px-3 py-1 rounded text-xs hover:bg-red-600 dark:hover:bg-red-500 transition duration-300 delete-btn-mobile\">Xoá</button>\n                    </div>\n                ";
          _0x32cdae.querySelector(".watch-btn-mobile").addEventListener('click', () => {
            window.open(_0x28e696.url, "_blank");
          });
          _0x32cdae.querySelector(".edit-btn-mobile").addEventListener('click', async () => {
            let _0x313c74 = prompt("Sửa URL:", _0x28e696.url);
            if (_0x313c74 !== null) {
              if (_0x313c74.includes("youtube.com") && !_0x313c74.includes("&autoplay=1&controls=0&rel=0")) {
                _0x313c74 += '&autoplay=1&controls=0&rel=0';
              }
              _0x32058c[_0x340847].url = _0x313c74;
              await _0x5845d2.set(_0x32058c);
            }
          });
          _0x32cdae.querySelector(".delete-btn-mobile").addEventListener("click", async () => {
            const _0x1d49c9 = _0x28e696.isUploaded ? "Bạn có muốn xóa video \"" + _0x28e696.name + "\" không?\n\nLưu ý: Video đã tải lên sẽ được xóa vĩnh viễn khỏi Firebase Storage." : "Bạn có muốn xóa video \"" + _0x28e696.name + "\" không?";
            if (confirm(_0x1d49c9)) {
              try {
                loadingAnimation.show("Đang xóa video...");
                await _0x15d3d8(_0x28e696);
                _0x32058c.splice(_0x340847, 0x1);
                await _0x5845d2.set(_0x32058c);
                successToast("Xóa video thành công!", 0xbb8, "top", "right", true, false, '');
              } catch (_0x546daa) {
                console.error("Error deleting video:", _0x546daa);
                failToast("Lỗi khi xóa video. Vui lòng thử lại.", 0xbb8, 'top', "right", true, false, '');
              } finally {
                loadingAnimation.hide();
              }
            }
          });
          _0x4641d3.appendChild(_0x32cdae);
        });
      });
      async function _0x15d3d8(_0x5a542d) {
        if (!_0x5a542d.isUploaded || !_0x5a542d.url) {
          return;
        }
        try {
          // Extract public ID from Cloudinary URL
          const publicId = cloudinaryService.extractPublicIdFromUrl(_0x5a542d.url);
          if (!publicId) {
            console.warn("Could not extract public ID from URL:", _0x5a542d.url);
            return;
          }
          await cloudinaryService.ref(publicId).delete();
          console.log("Successfully deleted video file:", publicId);
        } catch (_0x148934) {
          console.error("Error deleting video from Cloudinary:", _0x148934);
        }
      }
      const _0x16e34f = document.getElementById("urlMethodBtn");
      const _0x1f1d3f = document.getElementById("uploadMethodBtn");
      const _0x189325 = document.getElementById('urlMethod');
      const _0x5a70b3 = document.getElementById("uploadMethod");
      _0x16e34f.addEventListener("click", () => {
        _0x16e34f.classList.add("bg-white", "dark:bg-neutral-800", "text-gray-900", 'dark:text-white', 'shadow-sm');
        _0x16e34f.classList.remove('text-gray-700', 'dark:text-gray-300');
        _0x1f1d3f.classList.remove("bg-white", "dark:bg-neutral-800", 'text-gray-900', "dark:text-white", "shadow-sm");
        _0x1f1d3f.classList.add("text-gray-700", "dark:text-gray-300");
        _0x189325.classList.remove("hidden");
        _0x5a70b3.classList.add("hidden");
      });
      _0x1f1d3f.addEventListener("click", () => {
        _0x1f1d3f.classList.add("bg-white", "dark:bg-neutral-800", "text-gray-900", "dark:text-white", "shadow-sm");
        _0x1f1d3f.classList.remove("text-gray-700", "dark:text-gray-300");
        _0x16e34f.classList.remove("bg-white", "dark:bg-neutral-800", "text-gray-900", "dark:text-white", "shadow-sm");
        _0x16e34f.classList.add('text-gray-700', "dark:text-gray-300");
        _0x5a70b3.classList.remove("hidden");
        _0x189325.classList.add("hidden");
      });
      const _0x7cb8a3 = document.getElementById("videoFileInput");
      const _0x525c46 = document.getElementById('selectedFileInfo');
      const _0x55d111 = document.getElementById("selectedFileName");
      const _0x694789 = document.getElementById("selectedFileSize");
      const _0x917dde = document.getElementById("removeSelectedFile");
      const _0x4690df = document.getElementById('uploadVideoBtn');
      const _0x5145f9 = document.getElementById('uploadProgress');
      const _0x45ae0a = document.getElementById("uploadProgressBar");
      const _0x2f9309 = document.getElementById('uploadPercent');
      let _0x543e83 = null;
      _0x7cb8a3.addEventListener("change", _0x138020 => {
        const _0x2e7a44 = _0x138020.target.files[0x0];
        if (!_0x2e7a44) {
          return;
        }
        if (!_0x2e7a44.type.startsWith("video/")) {
          failToast("Vui lòng chọn file video hợp lệ.", 0xbb8, 'top', 'right', true, false, '');
          return;
        }
        if (_0x2e7a44.size > 31457280) {
          failToast("File video quá lớn. Vui lòng chọn file nhỏ hơn 30MB.", 0xbb8, "top", 'right', true, false, '');
          return;
        }
        _0x543e83 = _0x2e7a44;
        _0x55d111.textContent = _0x2e7a44.name;
        _0x694789.textContent = _0x1aba55(_0x2e7a44.size);
        _0x525c46.classList.remove("hidden");
        _0x488746();
      });
      _0x917dde.addEventListener('click', () => {
        _0x543e83 = null;
        _0x7cb8a3.value = '';
        _0x525c46.classList.add("hidden");
        _0x488746();
      });
      const _0x3b0425 = document.getElementById("nameWarning");
      const _0xa167d1 = document.getElementById('uploadVideoName');
      function _0x488746() {
        const _0x3b4462 = _0xa167d1.value.trim().length > 0x0;
        const _0x2081a1 = _0x543e83 !== null;
        if (!_0x3b4462 && _0x2081a1) {
          _0x3b0425.classList.remove("hidden");
          _0xa167d1.classList.add('border-yellow-400', "dark:border-yellow-500");
          _0xa167d1.classList.remove("border-neutral-600", "dark:border-neutral-600");
        } else {
          _0x3b0425.classList.add("hidden");
          _0xa167d1.classList.remove("border-yellow-400", 'dark:border-yellow-500');
          _0xa167d1.classList.add('border-neutral-600', "dark:border-neutral-600");
        }
        _0x4690df.disabled = !_0x3b4462 || !_0x2081a1;
      }
      _0xa167d1.addEventListener("input", _0x488746);
      _0xa167d1.addEventListener("blur", _0x488746);
      _0xa167d1.addEventListener("focus", () => {
        _0xa167d1.classList.remove("border-red-400", 'dark:border-red-500');
        if (_0xa167d1.value.trim().length > 0x0) {
          _0x3b0425.classList.add('hidden');
        }
      });
      _0x4690df.addEventListener('click', async () => {
        const _0x253bf1 = document.getElementById('uploadVideoName');
        const _0x33f37e = _0x253bf1.value.trim();
        if (!_0x33f37e) {
          failToast("Vui lòng nhập tên video trước khi tải lên.", 0xbb8, "top", 'right', true, false, '');
          _0x3b0425.classList.remove('hidden');
          _0xa167d1.classList.add("border-red-400", "dark:border-red-500");
          _0xa167d1.classList.remove('border-neutral-600', "dark:border-neutral-600");
          _0xa167d1.focus();
          return;
        }
        if (!_0x543e83) {
          failToast("Vui lòng chọn file video để tải lên.", 0xbb8, "top", 'right', true, false, '');
          return;
        }
        try {
          _0x4690df.disabled = true;
          _0x5145f9.classList.remove('hidden');
          
          const _0x10eb78 = Date.now();
          const _0x29c956 = _0x4b2dee + '_' + _0x10eb78;
          const folder = "videos/" + _0x4b2dee;
          
          // Upload video using Cloudinary with progress tracking
          const uploadResult = await window.cloudinaryService.uploadFile(_0x543e83, {
            folder: folder,
            publicId: _0x29c956,
            onProgress: (progressData) => {
              const _0x5b3d0b = progressData.percent;
              _0x45ae0a.style.width = _0x5b3d0b + '%';
              _0x2f9309.textContent = Math.round(_0x5b3d0b) + '%';
            }
          });
          
          const _0x1d6ad0 = uploadResult.url;
          const _0x2b9722 = {
            'id': _0x10eb78,
            'name': _0x33f37e,
            'url': _0x1d6ad0,
            'isUploaded': true
          };
          
          const _0x62d491 = await _0x5845d2.once("value");
          const _0x49fefa = _0x62d491.val() || [];
          _0x49fefa.push(_0x2b9722);
          await _0x5845d2.set(_0x49fefa);
          
          successToast("✅ Tải lên video thành công!", 0xbb8, "top", "right", true, false, '');
          
          // Reset form
          _0x253bf1.value = '';
          _0x543e83 = null;
          _0x7cb8a3.value = '';
          _0x525c46.classList.add("hidden");
          _0x5145f9.classList.add('hidden');
          _0x45ae0a.style.width = '0%';
          _0x2f9309.textContent = '0%';
          _0x4690df.disabled = false;
        } catch (_0x3f3321) {
          console.error("Upload error:", _0x3f3321);
          failToast("❌ Lỗi khi tải lên video: " + _0x3f3321.message, 0xbb8, "top", 'right', true, false, '');
          _0x4690df.disabled = false;
          _0x5145f9.classList.add("hidden");
        }
      });
      function _0x1aba55(_0x1c2242) {
        if (_0x1c2242 === 0x0) {
          return "0 Bytes";
        }
        const _0xea6a43 = ["Bytes", 'KB', 'MB', 'GB'];
        const _0x552787 = Math.floor(Math.log(_0x1c2242) / Math.log(0x400));
        return parseFloat((_0x1c2242 / Math.pow(0x400, _0x552787)).toFixed(0x2)) + " " + _0xea6a43[_0x552787];
      }
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    const _0x4513f8 = document.getElementById("playerLimit4");
    const _0x34e94c = document.getElementById('playerLimit5');
    if (_0x4513f8) {
      _0x4513f8.addEventListener("change", function () {
        if (this.checked) {
          setPlayerLimit(0x4);
        }
      });
    }
    if (_0x34e94c) {
      _0x34e94c.addEventListener("change", function () {
        if (this.checked) {
          setPlayerLimit(0x5);
        }
      });
    }
  });
  document.getElementById("closeQuestionManagerBtn").addEventListener('click', function () {
    if (window.opener || window.history.length <= 0x1) {
      try {
        window.close();
      } catch (_0x3f13cc) {
        window.location.href = "/Main.html";
      }
    } else {
      window.location.href = '/Main.html';
    }
  });