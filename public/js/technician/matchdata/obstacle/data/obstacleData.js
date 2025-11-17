auth.onAuthStateChanged(_0x84d50f => {
    if (!_0x84d50f) {
      return;
    }
    const _0x38934c = firestoreDB.collection('match').doc(_0x84d50f.uid);
    _0x38934c.onSnapshot(_0x1eb546 => {
      if (!_0x1eb546.exists) {
        return;
      }
      const _0x185e10 = _0x1eb546.data().match;
      var _0x295c41 = realtimeDB.ref(_0x185e10 + "/VCNVPlayed");
      var _0x5560d5 = realtimeDB.ref(_0x185e10 + "/VCNVChuong/OpenAll");
      var _0xce5b25 = realtimeDB.ref(_0x185e10 + "/Sounds");
      var _0x222f87 = realtimeDB.ref(_0x185e10 + "/ObstacleAnswers");
      var _0x246a07 = realtimeDB.ref(_0x185e10 + '/ObstacleBuzzer');
      var _0xbc73e1 = realtimeDB.ref(_0x185e10 + "/ObstacleDisabledId");
      var _0x427cb3 = realtimeDB.ref(_0x185e10 + "/hostid");
      var _0x3a0ba6 = realtimeDB.ref(_0x185e10 + '/ObstacleCompetitionActive');
      var _0x4abfc8 = realtimeDB.ref(_0x185e10 + "/QuestionMedia");
      document.getElementById("audio_ObstacleAnswer").volume = 0.3;
      _0x4abfc8.on("value", async _0xb4d777 => {
        const _0x584f37 = _0xb4d777.val() || {};
        const _0x26c676 = Object.values(_0x584f37).filter(_0x350484 => _0x350484.competition === "VCNVQuestion" && _0x350484.pack === 'CNV' && _0x350484.questionNumber === "background" && _0x350484.mediaType === "image");
        if (_0x26c676.length > 0x0) {
          const _0xffec57 = _0x26c676.sort((_0x5dbaad, _0x55bd92) => _0x55bd92.uploadDate - _0x5dbaad.uploadDate)[0x0];
          document.getElementById("ObstacleImage").src = _0xffec57.downloadURL;
        } else {
          document.getElementById("ObstacleImage").src = '';
        }
      });
      for (let _0x53ede0 = 0x1; _0x53ede0 <= 0x5; _0x53ede0++) {
        let _0x15a21d;
        if (_0x53ede0 === 0x5) {
          _0x15a21d = realtimeDB.ref(_0x185e10 + "/VCNVQuestion/HNTT");
        } else {
          _0x15a21d = realtimeDB.ref(_0x185e10 + "/VCNVQuestion/HN" + _0x53ede0);
        }
        _0x15a21d.on('value', _0x10864f => {
          const _0x56bba1 = _0x10864f.val().dapan;
          const _0x1005af = _0x56bba1.replace(/\s/g, '').length;
          const _0x3bf5bd = _0x53ede0 === 0x5 ? 'TT' : _0x53ede0;
          document.getElementById("ObstacleQuestion" + _0x53ede0).textContent = "Câu hỏi " + _0x3bf5bd + " (" + _0x1005af + " ký tự) | " + _0x56bba1;
        });
      }
      realtimeDB.ref(_0x185e10 + "/VCNVQuestion").on("value", _0x403858 => {
        const _0x5d9359 = _0x403858.val().CNV.cnv.toUpperCase();
        const _0x4637d4 = _0x5d9359.replace(/\s/g, '').length;
        let _0x35284e = _0x5d9359.replace(/\s/g, '');
        let _0x11003e;
        if (/^[\p{L}]+$/u.test(_0x35284e)) {
          _0x11003e = " CHỮ CÁI";
        } else {
          if (/^\d+$/.test(_0x35284e)) {
            _0x11003e = " CHỮ SỐ";
          } else if (/^[\p{L}\d]+$/u.test(_0x35284e)) {
            _0x11003e = " KÝ TỰ";
          } else {
            _0x11003e = " KÝ TỰ";
          }
        }
        document.getElementById("ObstacleText").textContent = "Hình ảnh | " + _0x5d9359 + " (" + _0x4637d4 + " " + _0x11003e + ')';
      });
      for (let _0x2531f9 = 0x1; _0x2531f9 <= 0x5; _0x2531f9++) {
        let _0x5270c7;
        _0x5270c7 = realtimeDB.ref(_0x185e10 + "/VCNVImageStatus/HA" + _0x2531f9);
        _0x5270c7.on("value", _0x252c57 => {
          const _0x3cb363 = _0x252c57.val().status;
          const _0x50b9a1 = document.getElementById("ObstacleImage" + _0x2531f9);
          const _0x46e7c6 = document.getElementById("ObstacleQuestion" + _0x2531f9);
          if (_0x3cb363 === 0x1) {
            _0x50b9a1.classList.add('bg-blue-600', "text-white");
            _0x50b9a1.disabled = true;
            _0x46e7c6.disabled = true;
          } else {
            _0x50b9a1.classList.remove('bg-blue-600', "text-white");
            _0x46e7c6.disabled = false;
            _0x50b9a1.disabled = false;
          }
        });
      }
      for (let _0x940603 = 0x1; _0x940603 <= 0x5; _0x940603++) {
        let _0x526991;
        _0x526991 = realtimeDB.ref(_0x185e10 + "/VCNVRowStatus/HN" + _0x940603);
        _0x526991.on("value", _0x563e37 => {
          const _0x4a7a1b = _0x563e37.val().status;
          const _0x44ff70 = document.getElementById("ObstacleUnlock" + _0x940603);
          const _0x5a8df8 = document.getElementById("ObstacleIncorrect" + _0x940603);
          if (_0x4a7a1b === 0x1) {
            _0x44ff70.classList.add("bg-green-600", "text-white");
            _0x44ff70.disabled = true;
          } else {
            _0x44ff70.classList.remove("bg-green-600", "text-white");
            _0x44ff70.disabled = false;
          }
          if (_0x5a8df8) {
            if (_0x4a7a1b === 0x2) {
              _0x5a8df8.classList.add('bg-red-600', 'text-white');
            } else {
              _0x5a8df8.classList.remove('bg-red-600', "text-white");
            }
          }
        });
      }
      realtimeDB.ref(_0x185e10 + '/VCNV/hangngang').on("value", async _0x12ce42 => {
        const _0x3f79ec = _0x12ce42.val().hn;
        document.getElementById("ObstacleDisplayAnswer").textContent = "Hiển thị đáp án";
        if (_0x3f79ec === 0x0) {
          for (let _0xc12d44 = 0x1; _0xc12d44 <= 0x5; _0xc12d44++) {
            const _0xc32040 = document.getElementById("ObstacleQuestion" + _0xc12d44);
            _0xc32040.classList.remove("bg-blue-600", "text-white");
            document.getElementById("ObstacleRowQuestion").textContent = '';
            document.getElementById("ObstacleRowAnswer").textContent = '';
          }
          const _0x18b884 = document.getElementById("ObstacleQuestionAudioContainer");
          if (_0x18b884) {
            _0x18b884.classList.add("hidden");
          }
        } else {
          const _0x19582f = document.getElementById("ObstacleQuestion" + _0x3f79ec);
          _0x19582f.classList.add("bg-blue-600", 'text-white');
        }
        if (_0x3f79ec == 0x5) {
          var _0x37e088 = realtimeDB.ref(_0x185e10 + "/VCNVQuestion/HNTT");
        } else {
          var _0x37e088 = realtimeDB.ref(_0x185e10 + "/VCNVQuestion/HN" + _0x3f79ec);
        }
        try {
          const _0x50cb1a = await getQuestionMedia("VCNVQuestion", 'HN' + _0x3f79ec, 0x1);
          await displayQuestionImage(_0x50cb1a.image, document.getElementById('ObstacleRowQuestionImage'), document.getElementById("ObstacleRowMediaContainer"));
          if (_0x50cb1a.audio) {
            setupAudioControls("obstacle", _0x50cb1a.audio, _0x185e10, _0x3f79ec);
          } else {
            const _0x813503 = document.getElementById("ObstacleQuestionAudioContainer");
            if (_0x813503) {
              _0x813503.classList.add('hidden');
            }
          }
        } catch (_0x25e360) {
          console.error("Error loading question media:", _0x25e360);
          const _0x478348 = document.getElementById('ObstacleQuestionAudioContainer');
          if (_0x478348) {
            _0x478348.classList.add("hidden");
          }
        }
        _0x37e088.on("value", _0x21873a => {
          var _0xb85a97 = _0x21873a.val().cauhoi;
          var _0x5984e9 = _0x21873a.val().dapan;
          document.getElementById('ObstacleRowQuestion').textContent = _0xb85a97;
          document.getElementById("ObstacleRowAnswer").textContent = _0x5984e9;
        });
      });
      _0x222f87.orderByChild('timestamp').on("value", _0x2f916f => {
        const _0x398d41 = {};
        _0x2f916f.forEach(_0x58c514 => {
          const _0x442f4d = _0x58c514.val();
          const _0x32fa7a = _0x442f4d.id;
          if (!_0x398d41[_0x32fa7a] || _0x398d41[_0x32fa7a].timestamp < _0x442f4d.timestamp) {
            _0x398d41[_0x32fa7a] = _0x442f4d;
          }
        });
        const _0x5c1655 = getPlayerLimit();
        for (let _0x418df0 = 0x1; _0x418df0 <= _0x5c1655; _0x418df0++) {
          const _0x1c27c1 = document.getElementById('obstaclePlayer' + _0x418df0 + 'Name');
          if (!_0x1c27c1) {
            continue;
          }
          let _0x49fb7f = _0x1c27c1.querySelector('.player-answer');
          const _0x1bbd70 = _0x398d41[_0x418df0] ? _0x398d41[_0x418df0].answer.toUpperCase() : '';
          if (_0x1bbd70 === '') {
            if (_0x49fb7f) {
              _0x49fb7f.remove();
            }
          } else {
            if (!_0x49fb7f) {
              _0x49fb7f = document.createElement('p');
              _0x49fb7f.classList.add('dark:text-white', "font-bold", "player-answer");
              _0x1c27c1.appendChild(_0x49fb7f);
            }
            _0x49fb7f.textContent = _0x1bbd70;
          }
        }
      });
      realtimeDB.ref(_0x185e10 + "/Sounds").on('value', _0x1c73bb => {
        const _0x6fc917 = _0x1c73bb.val().TenseMoments;
        const _0x2935da = document.getElementById('ObstacleTenseAudio');
        if (_0x6fc917 === true) {
          _0x2935da.textContent = "Dừng âm thanh căng thẳng";
        } else {
          _0x2935da.textContent = "Phát âm thanh căng thẳng";
        }
      });
      realtimeDB.ref(_0x185e10 + "/phanthistatus/vcnv").on('value', _0x3c4588 => {
        console.log(_0x3c4588.val().batdau);
        if (_0x3c4588.val().batdau === 0x1) {
          let _0x2cd703 = 0xe;
          const _0x2622eb = setInterval(() => {
            if (_0x2cd703 <= 0x0) {
              clearInterval(_0x2622eb);
              document.getElementById("ObstacleTimer").textContent = '';
            } else {
              document.getElementById("ObstacleTimer").textContent = '' + _0x2cd703;
              _0x2cd703--;
            }
          }, 0x3e8);
        }
      });
      _0x246a07.on("value", _0x510c13 => {
        const _0xb8e43d = [];
        const _0x48a5a9 = {};
        const _0x4aeed9 = {};
        _0x510c13.forEach(_0x4ac8f8 => {
          const _0x12fbbd = _0x4ac8f8.val();
          console.log(_0x12fbbd);
          const _0x2f1816 = _0x12fbbd.timestamp;
          if (_0x2f1816) {
            _0xb8e43d.push(_0x2f1816);
            _0x48a5a9[_0x12fbbd.id] = _0x2f1816;
            _0x4aeed9[_0x2f1816] = _0x12fbbd.id;
          }
        });
        _0xb8e43d.sort((_0x3a38a5, _0x5a21ae) => _0x3a38a5 - _0x5a21ae);
        const _0x24ae4c = getPlayerLimit();
        for (let _0x180f9b = 0x1; _0x180f9b <= _0x24ae4c; _0x180f9b++) {
          const _0x31fd75 = '' + _0x180f9b;
          const _0xb55863 = document.getElementById('obstaclePlayer' + _0x180f9b);
          const _0x1bfbf7 = document.getElementById("obstaclePlayer" + _0x180f9b + "Name");
          const _0x3b247d = _0x48a5a9[_0x31fd75] || null;
          if (_0x3b247d) {
            _0xb55863.classList.add("bg-red-600", 'rounded-md', "text-white");
            document.getElementById("audio_ObstacleAnswer").pause();
            document.getElementById("audio_ObstacleAnswer").currentTime = 0x0;
            document.getElementById("audio_ObstacleAnswer").play();
          } else {
            _0xb55863.classList.remove('bg-red-600', "rounded-md", 'text-white');
          }
          let _0x4fa2a5 = _0x1bfbf7.querySelector(".buzzer-badge");
          let _0x265910 = _0x1bfbf7.querySelector(".grading-buttons");
          if (!_0x3b247d) {
            if (_0x4fa2a5) {
              _0x4fa2a5.remove();
            }
            if (_0x265910) {
              _0x265910.remove();
            }
            continue;
          }
          const _0x871908 = _0xb8e43d.indexOf(_0x3b247d) + 0x1;
          if (!_0x4fa2a5) {
            _0x4fa2a5 = document.createElement("span");
            _0x4fa2a5.classList.add("buzzer-badge", "badge", "badge-primary", "rounded-full", "flex", "items-center", "justify-center", "font-bold");
            _0x1bfbf7.appendChild(_0x4fa2a5);
          }
          const _0x4575fb = new Date(_0x3b247d);
          const _0x2d9529 = _0x4575fb.getHours().toString().padStart(0x2, '0');
          const _0x59bb4b = _0x4575fb.getMinutes().toString().padStart(0x2, '0');
          const _0x20f28f = _0x4575fb.getSeconds().toString().padStart(0x2, '0');
          const _0x23c7b9 = _0x4575fb.getMilliseconds().toString().padStart(0x3, '0');
          const _0x194167 = _0x2d9529 + ':' + _0x59bb4b + ':' + _0x20f28f + ':' + _0x23c7b9;
          _0x4fa2a5.textContent = "Bấm thứ " + _0x871908 + ". Dấu thời gian " + _0x194167;
          if (!_0x265910) {
            _0x265910 = document.createElement("div");
            _0x265910.classList.add("grading-buttons", "flex", "gap-2");
            const _0x53f02b = document.createElement('button');
            _0x53f02b.classList.add("btn", 'btn-success', "rounded", "bg-green-500", "hover:bg-green-600", 'text-white', "flex", 'items-center', "justify-center", "p-2");
            _0x53f02b.innerHTML = "<span class=\"material-symbols-outlined\">check</span>";
            _0x53f02b.onclick = () => _0x229324(_0x180f9b);
            const _0x1d47e5 = document.createElement("button");
            _0x1d47e5.classList.add('btn', "btn-danger", "rounded", 'bg-red-500', "hover:bg-red-600", "text-white", 'flex', "items-center", 'justify-center', "p-2");
            _0x1d47e5.innerHTML = "<span class=\"material-symbols-outlined\">close</span>";
            _0x1d47e5.onclick = () => _0x4b7780(_0x180f9b);
            _0x265910.appendChild(_0x53f02b);
            _0x265910.appendChild(_0x1d47e5);
            _0x1bfbf7.appendChild(_0x265910);
          }
        }
      });
      async function _0x229324(_0x1fdf35) {
        const _0x5bf3a3 = await _0x427cb3.once("value");
        if (auth.currentUser.uid !== _0x5bf3a3.val()) {
          failToast("Thao tác này chỉ dành cho người điều khiển.");
          return;
        }
        _0x295c41.once("value", _0x161ce2 => {
          const _0x290b3f = _0x161ce2.val().hangngang;
          let _0x3a85a5 = 0x0;
          switch (_0x290b3f) {
            case 0x0:
              _0x3a85a5 = 0x3c;
              break;
            case 0x1:
              _0x3a85a5 = 0x3c;
              break;
            case 0x2:
              _0x3a85a5 = 0x32;
              break;
            case 0x3:
              _0x3a85a5 = 0x28;
              break;
            case 0x4:
              _0x3a85a5 = 0x1e;
              break;
            case 0x5:
              _0x3a85a5 = 0x14;
              break;
            default:
              _0x3a85a5 = 0x14;
              break;
          }
          if (confirm("Bạn có chắc chắn muốn chấm điểm trả lời đúng chướng ngại vật không? Người chơi sẽ được " + _0x3a85a5 + " điểm. Hình ảnh và tất cả hàng ngang sẽ được mở.")) {
            const _0x515f47 = realtimeDB.ref(_0x185e10 + '/point/player' + _0x1fdf35);
            _0x515f47.once('value', _0x53684f => {
              const _0x151271 = _0x53684f.val().point || 0x0;
              _0x515f47.update({
                'point': _0x151271 + _0x3a85a5
              });
            });
            _0x5560d5.set({
              'correct': 0x1
            });
            realtimeDB.ref(_0x185e10 + '/VCNVRowStatus').set({
              'HN1': {
                'status': 0x1
              },
              'HN2': {
                'status': 0x1
              },
              'HN3': {
                'status': 0x1
              },
              'HN4': {
                'status': 0x1
              },
              'HN5': {
                'status': 0x1
              }
            });
            realtimeDB.ref(_0x185e10 + '/VCNVImageStatus').set({
              'HA1': {
                'status': 0x1
              },
              'HA2': {
                'status': 0x1
              },
              'HA3': {
                'status': 0x1
              },
              'HA4': {
                'status': 0x1
              },
              'HA5': {
                'status': 0x1
              }
            });
            _0xce5b25.update({
              'TenseMoments': false
            });
            successToast("Đã chấm điểm trả lời đúng chướng ngại vật");
          }
        });
      }
      async function _0x4b7780(_0x4b9c1e) {
        const _0x3d2451 = await _0x427cb3.once("value");
        if (auth.currentUser.uid !== _0x3d2451.val()) {
          failToast("Thao tác này chỉ dành cho người điều khiển.");
          return;
        }
        if (confirm("Bạn có chắc chắn muốn chấm điểm trả lời sai chướng ngại vật không? Thí sinh sẽ không còn quyền trả lời hàng ngang")) {
          _0xbc73e1.push(_0x4b9c1e);
          _0xce5b25.update({
            'TenseMoments': false
          });
          _0x5560d5.set({
            'correct': 0x2
          }).then(() => _0x5560d5.set({
            'correct': 0x0
          }));
          successToast("Đã chấm trả lời sai chướng ngại vật");
        }
      }
      _0xbc73e1.on("value", _0x5b9c2c => {
        const _0x51325f = getPlayerLimit();
        for (let _0x34015c = 0x1; _0x34015c <= _0x51325f; _0x34015c++) {
          const _0x75378a = document.getElementById("obstaclePlayer" + _0x34015c);
          const _0x463f1e = document.getElementById("obstaclePlayer" + _0x34015c + 'Name');
          if (_0x75378a) {
            _0x75378a.classList.remove("bg-gray-500", "rounded-md");
          }
          if (_0x463f1e) {
            const _0x2a65ff = _0x463f1e.querySelector('.remove-disabled-icon');
            if (_0x2a65ff) {
              _0x2a65ff.remove();
            }
          }
        }
        if (_0x5b9c2c.exists()) {
          _0x5b9c2c.forEach(_0x2a8005 => {
            const _0x48ecf1 = _0x2a8005.val();
            const _0x2f480a = document.getElementById("obstaclePlayer" + _0x48ecf1);
            const _0x45013e = document.getElementById("obstaclePlayer" + _0x48ecf1 + "Name");
            if (_0x2f480a) {
              _0x2f480a.classList.add("bg-gray-500", 'rounded-md');
            }
            if (_0x45013e) {
              if (!_0x45013e.querySelector(".remove-disabled-icon")) {
                const _0x4aa99e = document.createElement('button');
                _0x4aa99e.classList.add("remove-disabled-icon", "bg-blue-400", 'rounded-md');
                _0x4aa99e.innerHTML = "<span>Cho phép người chơi tiếp tục phần thi</span>";
                _0x4aa99e.onclick = () => {
                  _0x427cb3.once("value", _0x1ab7b7 => {
                    if (auth.currentUser.uid !== _0x1ab7b7.val()) {
                      failToast("Thao tác này chỉ dành cho người điều khiển.");
                      return;
                    }
                    _0xbc73e1.child(_0x2a8005.key).remove();
                  });
                };
                _0x45013e.appendChild(_0x4aa99e);
              }
            }
          });
        }
      });
      _0x3a0ba6.on("value", _0x4f82e6 => {
        if (!_0x4f82e6.exists()) {
          return;
        }
        const _0x93520 = _0x4f82e6.val().status;
        const _0x1525ec = document.getElementById("ObstacleCompetitionActive");
        if (_0x93520 === true) {
          _0x1525ec.textContent = "Mở hàng ngang và hình ảnh Chướng ngại vật (Đã mở)";
          _0x1525ec.disabled = true;
        } else {
          _0x1525ec.textContent = "Mở hàng ngang và hình ảnh Chướng ngại vật (Chưa mở)";
          _0x1525ec.disabled = false;
        }
      });
      _0x5560d5.on("value", _0x95aef0 => {
        if (_0x95aef0.val().correct === 0x1) {
          document.getElementById("ObstacleRowQuestionTitle").textContent = "Giải thích";
          realtimeDB.ref(_0x185e10 + "/VCNVQuestion/Explaination").on('value', _0x551876 => {
            document.getElementById("ObstacleRowQuestion").textContent = _0x551876.val().text || "Không có giải thích";
          });
        } else {
          document.getElementById("ObstacleRowQuestionTitle").textContent = "Câu hỏi";
          document.getElementById('ObstacleRowQuestion').textContent = '';
        }
      });
    });
  });