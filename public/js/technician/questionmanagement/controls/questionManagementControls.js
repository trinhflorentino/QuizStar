auth.onAuthStateChanged(_0x1f0b2e => {
    if (!_0x1f0b2e) {
      return;
    }
    const _0x2e8694 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x2e8694.onSnapshot(_0x1b369a => {
      if (!_0x1b369a.exists) {
        return;
      }
      const _0x45e06a = _0x1b369a.data().match;
      document.getElementById("QuestionManagerSave").addEventListener("click", async () => {
        try {
          const _0x29d075 = {};
          const _0x291ae9 = document.getElementById("questionsContainer");
          Array.from(_0x291ae9.children).forEach((_0x43128c, _0x4176bc) => {
            const _0x37f2b9 = 'Q' + (_0x4176bc + 0x1) + 'DB';
            for (let _0x15bdd1 = 0x1; _0x15bdd1 <= 0x6; _0x15bdd1++) {
              const _0x2afaa4 = document.getElementById("startI_" + _0x37f2b9 + "_question" + _0x15bdd1).value.trim();
              const _0x3560d9 = document.getElementById("startI_" + _0x37f2b9 + '_answer' + _0x15bdd1).value.trim();
              _0x29d075[_0x45e06a + "/StartQuestion/" + _0x37f2b9 + "/cau" + _0x15bdd1] = _0x2afaa4;
              _0x29d075[_0x45e06a + "/StartQuestion/" + _0x37f2b9 + "/dacau" + _0x15bdd1] = _0x3560d9;
            }
          });
          const _0x70b106 = document.getElementById("questionsContainerII");
          Array.from(_0x70b106.children).forEach((_0xae912, _0x44ee88) => {
            const _0x4f3579 = 'L' + (_0x44ee88 + 0x1);
            const _0x249fd0 = _0x44ee88 === 0x0 ? 0xc : _0x44ee88 === 0x1 ? 0x19 : 0x23;
            for (let _0x4705a4 = 0x1; _0x4705a4 <= _0x249fd0; _0x4705a4++) {
              const _0x41d9cd = document.getElementById('startII_pack' + (_0x44ee88 + 0x1) + "_question" + _0x4705a4).value.trim();
              const _0x29e401 = document.getElementById('startII_pack' + (_0x44ee88 + 0x1) + "_answer" + _0x4705a4).value.trim();
              _0x29d075[_0x45e06a + "/KDO22Question/" + _0x4f3579 + "/cau" + _0x4705a4] = _0x41d9cd;
              _0x29d075[_0x45e06a + "/KDO22Question/" + _0x4f3579 + "/dacau" + _0x4705a4] = _0x29e401;
            }
          });
          const _0x2c4a4b = ['HN1', 'HN2', "HN3", "HN4", "HNTT"];
          _0x2c4a4b.forEach((_0x3eff72, _0x583dbc) => {
            const _0x32b367 = document.getElementById("obstacle_pack" + (_0x583dbc + 0x1) + "_question").value.trim();
            const _0x81262c = document.getElementById("obstacle_pack" + (_0x583dbc + 0x1) + "_answer").value.trim().toUpperCase();
            _0x29d075[_0x45e06a + "/VCNVQuestion/" + _0x3eff72 + '/cauhoi'] = _0x32b367;
            _0x29d075[_0x45e06a + "/VCNVQuestion/" + _0x3eff72 + '/dapan'] = _0x81262c;
          });
          _0x29d075[_0x45e06a + "/VCNVQuestion/CNV/cnv"] = document.getElementById("ObstacleText").value.trim();
          for (let _0x33d999 = 0x1; _0x33d999 <= 0x4; _0x33d999++) {
            const _0x255433 = document.getElementById('acceleration_textarea_question' + _0x33d999).value.trim();
            const _0x4bcb1b = document.getElementById("acceleration_textarea_answer" + _0x33d999).value.trim();
            _0x29d075[_0x45e06a + '/AccelerationQuestion/QS' + _0x33d999 + "/cauhoi"] = _0x255433;
            _0x29d075[_0x45e06a + '/AccelerationQuestion/QS' + _0x33d999 + "/dapan"] = _0x4bcb1b;
          }
          ;
          for (let _0x222775 = 0x1; _0x222775 <= 0x4; _0x222775++) {
            for (const _0x411bb9 of [0xa, 0x14, 0x1e]) {
              for (let _0x56d42e = 0x1; _0x56d42e <= 0x3; _0x56d42e++) {
                const _0x544158 = document.getElementById("finish_pack" + _0x222775 + "_points" + _0x411bb9 + "_question" + _0x56d42e).value.trim();
                const _0x1ca6db = document.getElementById("finish_pack" + _0x222775 + '_points' + _0x411bb9 + "_answer" + _0x56d42e).value.trim();
                _0x29d075[_0x45e06a + '/FinishQuestion/Q' + _0x222775 + 'DB/QP' + _0x411bb9 + '/' + _0x56d42e + "/cauhoi"] = _0x544158;
                _0x29d075[_0x45e06a + "/FinishQuestion/Q" + _0x222775 + "DB/QP" + _0x411bb9 + '/' + _0x56d42e + "/dapan"] = _0x1ca6db;
              }
            }
          }
          ;
          for (let _0x2f79d0 = 0x1; _0x2f79d0 <= 0xa; _0x2f79d0++) {
            const _0x1c22cc = document.getElementById('additional_question' + _0x2f79d0).value.trim();
            const _0x84fb81 = document.getElementById("additional_answer" + _0x2f79d0).value.trim();
            _0x29d075[_0x45e06a + "/CHPQuestion/cau" + _0x2f79d0] = _0x1c22cc;
            _0x29d075[_0x45e06a + '/CHPQuestion/dacau' + _0x2f79d0] = _0x84fb81;
          }
          const _0xde1f5c = document.getElementById('MatchName').value.trim();
          _0x29d075[_0x45e06a + "/match"] = _0xde1f5c;
          _0x29d075[_0x45e06a + '/Match/Name/match'] = _0xde1f5c;
          _0x29d075["MatchList/" + _0x45e06a + '/matchname'] = _0xde1f5c;
          await realtimeDB.ref().update(_0x29d075);
          successToast("Tất cả thay đổi đã được lưu");
        } catch (_0x5af60b) {
          console.error("Error saving questions:", _0x5af60b);
          failToast("Lỗi khi lưu câu hỏi: Lỗi:", _0x5af60b);
        }
      });
      document.getElementById("QuestionManagerLoadExcelFile").addEventListener('click', () => {
        document.getElementById("excelFileInput").click();
      });
      document.getElementById("excelFileInput").addEventListener("change", async _0x3d8da6 => {
        const _0x19da08 = _0x3d8da6.target.files[0x0];
        if (_0x19da08) {
          console.log("File selected: " + _0x19da08.name);
          const _0x3888dc = new FileReader();
          _0x3888dc.onload = function (_0x3f08fb) {
            const _0x3cb95d = new Uint8Array(_0x3f08fb.target.result);
            const _0x187553 = XLSX.read(_0x3cb95d, {
              'type': 'array'
            });
            const _0x59543c = _0x187553.SheetNames[0x0];
            const _0x22b811 = _0x187553.Sheets[_0x59543c];
            const _0x570682 = XLSX.utils.sheet_to_json(_0x22b811, {
              'header': 0x1
            });
            console.log(_0x570682);
            for (let _0xcf8d6 = 0x1; _0xcf8d6 <= 0x4; _0xcf8d6++) {
              for (let _0x475734 = 0x1; _0x475734 <= 0x6; _0x475734++) {
                const _0x2c3688 = "startI_Q" + _0xcf8d6 + "DB_question" + _0x475734;
                const _0x147fa2 = "startI_Q" + _0xcf8d6 + 'DB_answer' + _0x475734;
                const _0x1e1a57 = _0x570682[0x6 + _0x475734]?.[_0xcf8d6 * 0x2 - 0x1] || '';
                const _0x17d67f = _0x570682[0x6 + _0x475734]?.[_0xcf8d6 * 0x2] || '';
                const _0x4abe31 = document.getElementById(_0x2c3688);
                const _0xb70689 = document.getElementById(_0x147fa2);
                if (_0x4abe31) {
                  _0x4abe31.value = _0x1e1a57;
                }
                if (_0xb70689) {
                  _0xb70689.value = _0x17d67f;
                }
              }
            }
            const _0x55bce5 = [{
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
            _0x55bce5.forEach(({
              pack: _0x35368f,
              startRow: _0x119d6e,
              endRow: _0x105d19
            }) => {
              let _0x4ce41f = 0x1;
              for (let _0x539309 = _0x119d6e; _0x539309 <= _0x105d19; _0x539309++) {
                const _0x10feab = "startII_pack" + _0x35368f + "_question" + _0x4ce41f;
                const _0x52f492 = "startII_pack" + _0x35368f + "_answer" + _0x4ce41f;
                const _0x2cbba0 = _0x570682[_0x539309]?.[0x1] || '';
                const _0x520b19 = _0x570682[_0x539309]?.[0x2] || '';
                const _0x204e55 = document.getElementById(_0x10feab);
                const _0x4ab80f = document.getElementById(_0x52f492);
                if (_0x204e55) {
                  _0x204e55.value = _0x2cbba0;
                }
                if (_0x4ab80f) {
                  _0x4ab80f.value = _0x520b19;
                }
                _0x4ce41f++;
              }
            });
            document.getElementById("ObstacleText").value = _0x570682[0x11]?.[0x1] || '';
            document.getElementById('MatchName').value = _0x570682[0x2][0x1];
            for (let _0x2213c4 = 0x1; _0x2213c4 <= 0x5; _0x2213c4++) {
              const _0x76c14d = 'obstacle_pack' + _0x2213c4 + '_question';
              const _0x26cb6c = "obstacle_pack" + _0x2213c4 + "_answer";
              const _0x44e2d5 = _0x570682[0x12 + _0x2213c4]?.[0x1] || '';
              const _0x128a20 = _0x570682[0x12 + _0x2213c4]?.[0x2] || '';
              const _0x32d165 = document.getElementById(_0x76c14d);
              const _0x1358a7 = document.getElementById(_0x26cb6c);
              if (_0x32d165) {
                _0x32d165.value = _0x44e2d5;
              }
              if (_0x1358a7) {
                _0x1358a7.value = _0x128a20;
              }
            }
            for (let _0xab8482 = 0x1; _0xab8482 <= 0x4; _0xab8482++) {
              const _0x1dab5e = "acceleration_textarea_question" + _0xab8482;
              const _0x59d463 = 'acceleration_textarea_answer' + _0xab8482;
              const _0x17a07a = _0x570682[0x1c + _0xab8482]?.[0x1] || '';
              const _0x5cdaa6 = _0x570682[0x1c + _0xab8482]?.[0x2] || '';
              const _0x483483 = document.getElementById(_0x1dab5e);
              const _0x6a3d4a = document.getElementById(_0x59d463);
              if (_0x483483) {
                _0x483483.value = _0x17a07a;
              }
              if (_0x6a3d4a) {
                _0x6a3d4a.value = _0x5cdaa6;
              }
            }
            const _0x84ef4e = [{
              'points': 0xa,
              'row': 0x27
            }, {
              'points': 0x14,
              'row': 0x2a
            }, {
              'points': 0x1e,
              'row': 0x2d
            }];
            for (let _0x101a7f = 0x1; _0x101a7f <= 0x4; _0x101a7f++) {
              _0x84ef4e.forEach(({
                points: _0x18fbd8,
                row: _0x26775c
              }) => {
                for (let _0x1e3735 = 0x1; _0x1e3735 <= 0x3; _0x1e3735++) {
                  const _0x17eefd = "finish_pack" + _0x101a7f + "_points" + _0x18fbd8 + "_question" + _0x1e3735;
                  const _0x9fbec8 = 'finish_pack' + _0x101a7f + '_points' + _0x18fbd8 + "_answer" + _0x1e3735;
                  const _0x2aa21f = (_0x101a7f - 0x1) * 0x2;
                  const _0x16291c = _0x570682[_0x26775c - 0x1 + (_0x1e3735 - 0x1)]?.[0x1 + _0x2aa21f] || '';
                  const _0x48b9e2 = _0x570682[_0x26775c - 0x1 + (_0x1e3735 - 0x1)]?.[0x2 + _0x2aa21f] || '';
                  const _0x5de86f = document.getElementById(_0x17eefd);
                  const _0x202ebc = document.getElementById(_0x9fbec8);
                  if (_0x5de86f) {
                    _0x5de86f.value = _0x16291c;
                  }
                  if (_0x202ebc) {
                    _0x202ebc.value = _0x48b9e2;
                  }
                }
              });
            }
            for (let _0x1e655c = 0x1; _0x1e655c <= 0xa; _0x1e655c++) {
              const _0x4828de = "additional_question" + _0x1e655c;
              const _0x38b6fc = "additional_answer" + _0x1e655c;
              const _0x2dc2dc = _0x570682[0x33 + _0x1e655c]?.[0x1] || '';
              const _0x2bfbcc = _0x570682[0x33 + _0x1e655c]?.[0x2] || '';
              const _0x488010 = document.getElementById(_0x4828de);
              const _0x1a5466 = document.getElementById(_0x38b6fc);
              if (_0x488010) {
                _0x488010.value = _0x2dc2dc;
              }
              if (_0x1a5466) {
                _0x1a5466.value = _0x2bfbcc;
              }
            }
            successToast("Đã đọc dữ liệu từ file Excel");
          };
          _0x3888dc.readAsArrayBuffer(_0x19da08);
        } else {
          failToast("Không tìm thấy file Excel");
        }
      });
      document.getElementById("QuestionManagerExportExcelFile").addEventListener("click", () => {
        const _0x5a3a64 = XLSX.utils.book_new();
        const _0x24f4ae = [["Match Name", document.getElementById('MatchName').value]];
        for (let _0x1b72d6 = 0x1; _0x1b72d6 <= 0x4; _0x1b72d6++) {
          for (let _0x25bc70 = 0x1; _0x25bc70 <= 0x6; _0x25bc70++) {
            const _0x4a14b9 = document.getElementById("startI_Q" + _0x1b72d6 + "DB_question" + _0x25bc70).value;
            const _0x33a5b5 = document.getElementById("startI_Q" + _0x1b72d6 + 'DB_answer' + _0x25bc70).value;
            _0x24f4ae.push(['Q' + _0x1b72d6 + " Question " + _0x25bc70, _0x4a14b9, '', _0x33a5b5]);
          }
        }
        _0x24f4ae.push(["Obstacle Text", document.getElementById("ObstacleText").value]);
        for (let _0x54841a = 0x1; _0x54841a <= 0x5; _0x54841a++) {
          const _0x5d8529 = document.getElementById("obstacle_pack" + _0x54841a + "_question").value;
          const _0x25762a = document.getElementById('obstacle_pack' + _0x54841a + "_answer").value();
          _0x24f4ae.push(["Obstacle Pack " + _0x54841a, _0x5d8529, '', _0x25762a]);
        }
        for (let _0x1ded45 = 0x1; _0x1ded45 <= 0x4; _0x1ded45++) {
          const _0x977a29 = document.getElementById("acceleration_textarea_question" + _0x1ded45).value;
          const _0xcb946c = document.getElementById("acceleration_textarea_answer" + _0x1ded45).value;
          _0x24f4ae.push(["Acceleration " + _0x1ded45, _0x977a29, '', _0xcb946c]);
        }
        const _0x66a730 = [{
          'pack': 0x1,
          'questionCount': 0xc
        }, {
          'pack': 0x2,
          'questionCount': 0x19
        }, {
          'pack': 0x3,
          'questionCount': 0x23
        }];
        _0x66a730.forEach(({
          pack: _0x58874c,
          questionCount: _0x2e3efe
        }) => {
          for (let _0x3fa545 = 0x1; _0x3fa545 <= _0x2e3efe; _0x3fa545++) {
            const _0x47a83f = document.getElementById("startII_pack" + _0x58874c + '_question' + _0x3fa545).value;
            const _0x9b31fa = document.getElementById('startII_pack' + _0x58874c + "_answer" + _0x3fa545).value;
            _0x24f4ae.push(["Pack " + _0x58874c + " Question " + _0x3fa545, _0x47a83f, '', _0x9b31fa]);
          }
        });
        const _0x4c0d1a = [{
          'points': 0xa,
          'questionCount': 0x3
        }, {
          'points': 0x14,
          'questionCount': 0x3
        }, {
          'points': 0x1e,
          'questionCount': 0x3
        }];
        for (let _0x804149 = 0x1; _0x804149 <= 0x4; _0x804149++) {
          _0x4c0d1a.forEach(({
            points: _0x453df6,
            questionCount: _0x5628d9
          }) => {
            for (let _0x50eabd = 0x1; _0x50eabd <= _0x5628d9; _0x50eabd++) {
              const _0x29074c = document.getElementById("finish_pack" + _0x804149 + "_points" + _0x453df6 + "_question" + _0x50eabd).value;
              const _0x119173 = document.getElementById("finish_pack" + _0x804149 + "_points" + _0x453df6 + "_answer" + _0x50eabd).value;
              _0x24f4ae.push(["Finish Pack " + _0x804149 + " " + _0x453df6 + " Points Q" + _0x50eabd, _0x29074c, '', _0x119173]);
            }
          });
        }
        for (let _0x2fb1c7 = 0x1; _0x2fb1c7 <= 0xa; _0x2fb1c7++) {
          const _0x10bb0e = document.getElementById("additional_question" + _0x2fb1c7).value;
          const _0x159da3 = document.getElementById('additional_answer' + _0x2fb1c7).value;
          _0x24f4ae.push(["Additional Question " + _0x2fb1c7, _0x10bb0e, '', _0x159da3]);
        }
        const _0x36db8f = XLSX.utils.aoa_to_sheet(_0x24f4ae);
        XLSX.utils.book_append_sheet(_0x5a3a64, _0x36db8f, "Question Data");
        XLSX.writeFile(_0x5a3a64, "QuestionData_" + new Date().toISOString().slice(0x0, 0xa) + ".xlsx");
      });
      document.getElementById("obstacleFileUpload").addEventListener("change", async _0x3cb275 => {
        const _0x122520 = _0x3cb275.target.files[0x0];
        if (_0x122520) {
          const _0x5c6a21 = firebase.storage().ref(_0x45e06a + '/img/cnv/cnv.jpg');
          try {
            await _0x5c6a21.put(_0x122520);
            const _0x3eff86 = await _0x5c6a21.getDownloadURL();
            document.getElementById('ObstacleImage').src = _0x3eff86;
            successToast("Tải lên hình ảnh Vượt chướng ngại vật thành công");
          } catch (_0xe8e729) {
            console.error("Error uploading image:", _0xe8e729);
            failToast("Tải lên hình ảnh thất bại");
          }
        } else {
          failToast("Không có file nào được chọn");
        }
      });
      document.getElementById('obstacleAudioUpload').addEventListener("change", async _0x262d74 => {
        const _0x331f4a = _0x262d74.target.files[0x0];
        if (_0x331f4a) {
          const _0xe889f5 = firebase.storage().ref(_0x45e06a + '/audio/cnv/hn.mp3');
          try {
            await _0xe889f5.put(_0x331f4a);
            const _0x3097cd = await _0xe889f5.getDownloadURL();
            document.getElementById("ObstacleAudio").src = _0x3097cd;
            successToast("Tải lên âm thanh hàng ngang thành công");
          } catch (_0x2cff02) {
            console.error("Error uploading audio:", _0x2cff02);
            failToast("Tải lên âm thanh thất bại");
          }
        } else {
          failToast("Không có file nào được chọn");
        }
      });
      document.getElementById("deleteObstacleImage").addEventListener('click', async () => {
        try {
          const _0x535071 = firebase.storage().ref(_0x45e06a + "/img/cnv/cnv.jpg");
          await _0x535071["delete"]();
          document.getElementById("ObstacleImage").src = '';
          successToast("Xóa hình ảnh Vượt chướng ngại vật thành công");
        } catch (_0x38cc04) {
          console.error("Error deleting image:", _0x38cc04);
          failToast("Xóa hình ảnh thất bại");
        }
      });
      document.getElementById("deleteObstacleAudio").addEventListener("click", async () => {
        try {
          const _0xc04e3a = firebase.storage().ref(_0x45e06a + '/audio/cnv/hn.mp3');
          await _0xc04e3a['delete']();
          document.getElementById("ObstacleAudio").src = '';
          successToast("Xóa âm thanh hàng ngang thành công");
        } catch (_0x332771) {
          console.error("Error deleting audio:", _0x332771);
          failToast("Xóa âm thanh thất bại");
        }
      });
      const _0x5ac7a9 = realtimeDB.ref(_0x45e06a + '/FinishCustomVideo');
      document.getElementById("addVideoBtn").addEventListener("click", async () => {
        const _0x2b3a63 = document.getElementById("videoName").value.trim();
        let _0x1837ea = document.getElementById("videoURL").value.trim();
        if (!_0x2b3a63 || !_0x1837ea) {
          failToast("Vui lòng điền đầy đủ thông tin.", 0xbb8, "top", 'right', true, false, '');
          return;
        }
        if (_0x1837ea.includes("youtube.com") && !_0x1837ea.includes("&autoplay=1&controls=0&rel=0")) {
          _0x1837ea += "&autoplay=1&controls=0&rel=0";
        }
        const _0x3da91d = {
          'id': Date.now(),
          'name': _0x2b3a63,
          'url': _0x1837ea
        };
        try {
          const _0x18ba42 = await _0x5ac7a9.once('value');
          const _0x43026f = _0x18ba42.val() || [];
          _0x43026f.push(_0x3da91d);
          await _0x5ac7a9.set(_0x43026f);
          successToast("Thêm video thành công.", 0xbb8, "top", 'right', true, false, '');
        } catch (_0x1573ac) {
          failToast("Thao tác thất bại.", 0xbb8, 'top', "right", true, false, '');
        }
        document.getElementById('videoName').value = '';
        document.getElementById("videoURL").value = '';
      });
      _0x5ac7a9.on("value", _0x104b68 => {
        const _0x2be99b = _0x104b68.val() || [];
        const _0x43c3af = document.getElementById("videoTableBody");
        _0x43c3af.innerHTML = '';
        if (_0x2be99b.length === 0x0) {
          _0x43c3af.innerHTML = "\n      <tr>\n        <td colspan=\"4\" class=\"p-4 text-center\">Không có video nào được thêm</td>\n      </tr>";
          return;
        }
        _0x2be99b.forEach((_0x3ece3a, _0x295aef) => {
          const _0x57ae4c = document.createElement('tr');
          _0x57ae4c.classList.add("even:bg-blue-gray-50/50");
          _0x57ae4c.innerHTML = "\n      <td class=\"p-4\">" + (_0x295aef + 0x1) + "</td>\n      <td class=\"p-4\">" + _0x3ece3a.name + "</td>\n      <td class=\"p-4\"><a href=\"" + _0x3ece3a.url + "\" target=\"_blank\">" + (_0x3ece3a.url.length > 0x32 ? _0x3ece3a.url.substring(0x0, 0x32) + '...' : _0x3ece3a.url) + "</a></td>\n      <td class=\"p-4\">\n        <button class=\"bg-blue-500 dark:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300 mr-2 font-semibold watch-btn\">Xem trước</button>\n        <button class=\"bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-600 dark:hover:bg-yellow-600 transition duration-300 mr-2 font-semibold edit-btn\">Sửa đường dẫn</button>\n        <button class=\"bg-red-500 dark:bg-red-400 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 dark:hover:bg-red-500 transition duration-300 font-semibold delete-btn\">Xoá</button>\n      </td>\n    ";
          _0x57ae4c.querySelector('.watch-btn').addEventListener("click", () => {
            window.open(_0x3ece3a.url, "_blank");
          });
          _0x57ae4c.querySelector('.edit-btn').addEventListener('click', async () => {
            let _0x189f12 = prompt("Sửa URL:", _0x3ece3a.url);
            if (_0x189f12 !== null) {
              if (_0x189f12.includes("youtube.com") && !_0x189f12.includes("&autoplay=1&controls=0&rel=0")) {
                _0x189f12 += "&autoplay=1&controls=0&rel=0";
              }
              _0x2be99b[_0x295aef].url = _0x189f12;
              await _0x5ac7a9.set(_0x2be99b);
            }
          });
          _0x57ae4c.querySelector(".delete-btn").addEventListener("click", async () => {
            if (confirm("Bạn có muốn xoá Video này không?")) {
              _0x2be99b.splice(_0x295aef, 0x1);
              await _0x5ac7a9.set(_0x2be99b);
            }
          });
          _0x43c3af.appendChild(_0x57ae4c);
        });
      });
    });
  });