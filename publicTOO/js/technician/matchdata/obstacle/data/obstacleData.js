auth.onAuthStateChanged(_0x17df38 => {
    if (!_0x17df38) {
      return;
    }
    const _0x720264 = firestoreDB.collection("match").doc(_0x17df38.uid);
    _0x720264.onSnapshot(_0x13c1c5 => {
      if (!_0x13c1c5.exists) {
        return;
      }
      const _0x28547a = _0x13c1c5.data().match;
      var _0xfbe258 = realtimeDB.ref(_0x28547a + '/VCNVPlayed');
      var _0x5c33c7 = realtimeDB.ref(_0x28547a + "/VCNVChuong/OpenAll");
      var _0x5be208 = realtimeDB.ref(_0x28547a + '/Sounds');
      var _0x23f6cb = realtimeDB.ref(_0x28547a + "/ObstacleAnswers");
      var _0x11a0d2 = realtimeDB.ref(_0x28547a + "/ObstacleBuzzer");
      var _0x268f4e = realtimeDB.ref(_0x28547a + "/ObstacleDisabledId");
      var _0x4c170d = realtimeDB.ref(_0x28547a + "/hostid");
      firebase.storage().ref().child(_0x28547a + "/img/cnv/cnv.jpg").getDownloadURL().then(_0x57174a => {
        document.getElementById('ObstacleImage').src = _0x57174a;
      })["catch"](_0x564143 => {
        failToast("Lỗi hiển thị hình ảnh chướng ngại vật, hoặc bạn chưa upload hình chướng ngại vật");
      });
      for (let _0x4bb90b = 0x1; _0x4bb90b <= 0x5; _0x4bb90b++) {
        let _0x4d1b72;
        if (_0x4bb90b === 0x5) {
          _0x4d1b72 = realtimeDB.ref(_0x28547a + "/VCNVQuestion/HNTT");
        } else {
          _0x4d1b72 = realtimeDB.ref(_0x28547a + '/VCNVQuestion/HN' + _0x4bb90b);
        }
        _0x4d1b72.on("value", _0x6fc5a0 => {
          const _0x292bd2 = _0x6fc5a0.val().dapan;
          const _0x43cc8d = _0x292bd2.replace(/\s/g, '').length;
          const _0x501fc1 = _0x4bb90b === 0x5 ? 'TT' : _0x4bb90b;
          document.getElementById('ObstacleQuestion' + _0x4bb90b).textContent = "Câu hỏi " + _0x501fc1 + " (" + _0x43cc8d + " ký tự) | " + _0x292bd2;
        });
      }
      realtimeDB.ref(_0x28547a + "/VCNVQuestion").on("value", _0x1e5262 => {
        const _0x2646ac = _0x1e5262.val().CNV.cnv.toUpperCase();
        const _0x4559ae = _0x2646ac.replace(/\s/g, '').length;
        let _0x364ba0 = _0x2646ac.replace(/\s/g, '');
        let _0x280091;
        if (/^[\p{L}]+$/u.test(_0x364ba0)) {
          _0x280091 = " CHỮ CÁI";
        } else {
          if (/^\d+$/.test(_0x364ba0)) {
            _0x280091 = " CHỮ SỐ";
          } else if (/^[\p{L}\d]+$/u.test(_0x364ba0)) {
            _0x280091 = " KÝ TỰ";
          } else {
            _0x280091 = " KÝ TỰ";
          }
        }
        document.getElementById("ObstacleText").textContent = "Hình ảnh | " + _0x2646ac + " (" + _0x4559ae + " " + _0x280091 + ')';
      });
      for (let _0x5d16ba = 0x1; _0x5d16ba <= 0x5; _0x5d16ba++) {
        let _0x5806b9;
        _0x5806b9 = realtimeDB.ref(_0x28547a + "/VCNVImageStatus/HA" + _0x5d16ba);
        _0x5806b9.on("value", _0x3e7065 => {
          const _0x256317 = _0x3e7065.val().status;
          const _0x48dae1 = document.getElementById("ObstacleImage" + _0x5d16ba);
          const _0x220bad = document.getElementById("ObstacleQuestion" + _0x5d16ba);
          if (_0x256317 === 0x1) {
            _0x48dae1.classList.add('bg-blue-600', "text-white");
            _0x48dae1.disabled = true;
            _0x220bad.disabled = true;
          } else {
            _0x48dae1.classList.remove("bg-blue-600", 'text-white');
            _0x220bad.disabled = false;
            _0x48dae1.disabled = false;
          }
        });
      }
      for (let _0x1a316e = 0x1; _0x1a316e <= 0x5; _0x1a316e++) {
        let _0x182043;
        _0x182043 = realtimeDB.ref(_0x28547a + "/VCNVRowStatus/HN" + _0x1a316e);
        _0x182043.on("value", _0x21052f => {
          const _0x2b1f66 = _0x21052f.val().status;
          const _0x30f462 = document.getElementById('ObstacleUnlock' + _0x1a316e);
          if (_0x2b1f66 === 0x1) {
            _0x30f462.classList.add("bg-green-600", "text-white");
            _0x30f462.disabled = true;
          } else {
            _0x30f462.classList.remove("bg-green-600", "text-white");
            _0x30f462.disabled = false;
          }
        });
      }
      realtimeDB.ref(_0x28547a + "/VCNV/hangngang").on("value", _0x34fef9 => {
        const _0x288191 = _0x34fef9.val().hn;
        document.getElementById("ObstacleDisplayAnswer").textContent = "Hiển thị đáp án";
        if (_0x288191 === 0x0) {
          for (let _0x150931 = 0x1; _0x150931 <= 0x5; _0x150931++) {
            const _0x3c2370 = document.getElementById("ObstacleQuestion" + _0x150931);
            _0x3c2370.classList.remove("bg-blue-600", "text-white");
            document.getElementById("ObstacleRowQuestion").textContent = '';
            document.getElementById("ObstacleRowAnswer").textContent = '';
          }
        } else {
          const _0x14934f = document.getElementById('ObstacleQuestion' + _0x288191);
          _0x14934f.classList.add('bg-blue-600', "text-white");
        }
        if (_0x288191 == 0x5) {
          var _0x5473e4 = realtimeDB.ref(_0x28547a + "/VCNVQuestion/HNTT");
        } else {
          var _0x5473e4 = realtimeDB.ref(_0x28547a + '/VCNVQuestion/HN' + _0x288191);
        }
        _0x5473e4.on("value", _0x4fcef6 => {
          var _0x227095 = _0x4fcef6.val().cauhoi;
          var _0x199633 = _0x4fcef6.val().dapan;
          document.getElementById("ObstacleRowQuestion").textContent = _0x227095;
          document.getElementById("ObstacleRowAnswer").textContent = _0x199633;
        });
      });
      _0x23f6cb.orderByChild("timestamp").on("value", _0x1a0777 => {
        const _0x2582fd = {};
        _0x1a0777.forEach(_0x373030 => {
          const _0x3a01fb = _0x373030.val();
          const _0x4a248c = _0x3a01fb.id;
          if (!_0x2582fd[_0x4a248c] || _0x2582fd[_0x4a248c].timestamp < _0x3a01fb.timestamp) {
            _0x2582fd[_0x4a248c] = _0x3a01fb;
          }
        });
        for (let _0x1c20f1 = 0x1; _0x1c20f1 <= 0x4; _0x1c20f1++) {
          const _0x3264d5 = document.getElementById('obstaclePlayer' + _0x1c20f1 + "Name");
          if (!_0x3264d5) {
            continue;
          }
          let _0x458f2b = _0x3264d5.querySelector(".player-answer");
          const _0xad234 = _0x2582fd[_0x1c20f1] ? _0x2582fd[_0x1c20f1].answer.toUpperCase() : '';
          if (_0xad234 === '') {
            if (_0x458f2b) {
              _0x458f2b.remove();
            }
          } else {
            if (!_0x458f2b) {
              _0x458f2b = document.createElement('p');
              _0x458f2b.classList.add('dark:text-white', "font-bold", "player-answer");
              _0x3264d5.appendChild(_0x458f2b);
            }
            _0x458f2b.textContent = _0xad234;
          }
        }
      });
      realtimeDB.ref(_0x28547a + "/Sounds").on('value', _0x460a64 => {
        const _0x46abf4 = _0x460a64.val().TenseMoments;
        const _0x4e1c23 = document.getElementById("ObstacleTenseAudio");
        if (_0x46abf4 === true) {
          _0x4e1c23.textContent = "Dừng âm thanh căng thẳng";
        } else {
          _0x4e1c23.textContent = "Phát âm thanh căng thẳng";
        }
      });
      realtimeDB.ref(_0x28547a + "/VCNVAudio").on("value", _0x447759 => {
        const _0x588edd = _0x447759.val().audio;
        const _0x3798df = document.getElementById("ObstacleQuestionAudio");
        if (_0x588edd == 0x1) {
          _0x3798df.textContent = "Dừng âm thanh câu hỏi hàng ngang";
        } else {
          _0x3798df.textContent = "Phát âm thanh câu hỏi hàng ngang";
        }
      });
      realtimeDB.ref(_0x28547a + "/phanthistatus/vcnv").on("value", _0x3f31be => {
        console.log(_0x3f31be.val().batdau);
        if (_0x3f31be.val().batdau === 0x1) {
          let _0x3f7c2c = 0xe;
          const _0x31a42a = setInterval(() => {
            if (_0x3f7c2c <= 0x0) {
              clearInterval(_0x31a42a);
              document.getElementById("ObstacleTimer").textContent = '';
            } else {
              document.getElementById("ObstacleTimer").textContent = '' + _0x3f7c2c;
              _0x3f7c2c--;
            }
          }, 0x3e8);
        }
      });
      _0x11a0d2.on("value", _0x353526 => {
        const _0x1e4eee = [];
        const _0x47d1ea = {};
        const _0xde3bf = {};
        _0x353526.forEach(_0x16242c => {
          const _0xf38e32 = _0x16242c.val();
          console.log(_0xf38e32);
          if (_0xf38e32.timestamp) {
            _0x1e4eee.push(_0xf38e32.timestamp);
            _0x47d1ea[_0xf38e32.id] = _0xf38e32.timestamp;
            _0xde3bf[_0xf38e32.timestamp] = _0xf38e32.id;
          }
        });
        _0x1e4eee.sort((_0x428db7, _0x5ceea6) => _0x428db7 - _0x5ceea6);
        for (let _0x2e16f2 = 0x1; _0x2e16f2 <= 0x4; _0x2e16f2++) {
          const _0x51fed9 = document.getElementById("obstaclePlayer" + _0x2e16f2);
          const _0x353fed = document.getElementById('obstaclePlayer' + _0x2e16f2 + 'Name');
          _0x11a0d2.orderByChild('id').equalTo('' + _0x2e16f2).on('value', _0x1447ad => {
            const _0x19e687 = _0x1447ad.val();
            console.log(_0x19e687);
            let _0x519b55 = null;
            if (_0x19e687) {
              _0x519b55 = Object.values(_0x19e687)[0x0].timestamp;
            }
            if (_0x519b55) {
              _0x51fed9.classList.add("bg-red-600", "rounded-md", "text-white");
              document.getElementById("audio_ObstacleAnswer").pause();
              document.getElementById("audio_ObstacleAnswer").currentTime = 0x0;
              document.getElementById("audio_ObstacleAnswer").play();
            } else {
              _0x51fed9.classList.remove("bg-red-600", 'rounded-md', 'text-white');
            }
            let _0x2dc6fc = _0x353fed.querySelector('.buzzer-badge');
            let _0x590173 = _0x353fed.querySelector(".grading-buttons");
            if (!_0x519b55) {
              if (_0x2dc6fc) {
                _0x2dc6fc.remove();
              }
              if (_0x590173) {
                _0x590173.remove();
              }
              return;
            }
            const _0x147c23 = _0x1e4eee.indexOf(_0x519b55) + 0x1;
            if (!_0x2dc6fc) {
              _0x2dc6fc = document.createElement('span');
              _0x2dc6fc.classList.add('buzzer-badge', "badge", "badge-primary", 'rounded-full', "flex", "items-center", "justify-center", 'font-bold');
              _0x353fed.appendChild(_0x2dc6fc);
            }
            const _0x56cbb5 = new Date(_0x519b55);
            const _0x47de24 = _0x56cbb5.getHours().toString().padStart(0x2, '0');
            const _0xfecba0 = _0x56cbb5.getMinutes().toString().padStart(0x2, '0');
            const _0xb88b8d = _0x56cbb5.getSeconds().toString().padStart(0x2, '0');
            const _0xf0c8ab = _0x56cbb5.getMilliseconds().toString().padStart(0x3, '0');
            const _0x4d59ff = _0x47de24 + ':' + _0xfecba0 + ':' + _0xb88b8d + ':' + _0xf0c8ab;
            _0x2dc6fc.textContent = "Bấm thứ " + _0x147c23 + ". Dấu thời gian " + _0x4d59ff;
            if (!_0x590173) {
              _0x590173 = document.createElement('div');
              _0x590173.classList.add("grading-buttons", "flex", 'gap-2');
              const _0x3fbc67 = document.createElement("button");
              _0x3fbc67.classList.add("btn", 'btn-success', "rounded", 'bg-green-500', 'hover:bg-green-600', "text-white", 'flex', "items-center", "justify-center", "p-2");
              _0x3fbc67.innerHTML = "<span class=\"material-symbols-outlined\">check</span>";
              _0x3fbc67.onclick = () => _0x57e32c(_0x2e16f2);
              const _0x26173c = document.createElement("button");
              _0x26173c.classList.add("btn", 'btn-danger', "rounded", 'bg-red-500', 'hover:bg-red-600', 'text-white', 'flex', "items-center", 'justify-center', 'p-2');
              _0x26173c.innerHTML = "<span class=\"material-symbols-outlined\">close</span>";
              _0x26173c.onclick = () => _0x7fec6(_0x2e16f2);
              _0x590173.appendChild(_0x3fbc67);
              _0x590173.appendChild(_0x26173c);
              _0x353fed.appendChild(_0x590173);
            }
          });
        }
      });
      async function _0x57e32c(_0xb03301) {
        if (confirm("Bạn có chắc chắn muốn chấm điểm trả lời đúng chướng ngại vật không? Hình ảnh và tất cả hàng ngang sẽ được mở.")) {
          const _0x5d1d2c = await _0x4c170d.once("value");
          if (auth.currentUser.uid !== _0x5d1d2c.val()) {
            failToast("Thao tác này chỉ dành cho người điều khiển.");
            return;
          }
          _0xfbe258.once('value', _0x53d974 => {
            const _0x914aaa = _0x53d974.val().hangngang;
            let _0xbef49 = 0x0;
            switch (_0x914aaa) {
              case 0x0:
                _0xbef49 = 0x3c;
                break;
              case 0x1:
                _0xbef49 = 0x3c;
                break;
              case 0x2:
                _0xbef49 = 0x32;
                break;
              case 0x3:
                _0xbef49 = 0x28;
                break;
              case 0x4:
                _0xbef49 = 0x1e;
                break;
              case 0x5:
                _0xbef49 = 0x14;
                break;
            }
            const _0x56d13b = realtimeDB.ref(_0x28547a + "/point/player" + _0xb03301);
            _0x56d13b.once('value', _0x3b09ea => {
              const _0x52dcc9 = _0x3b09ea.val().point || 0x0;
              _0x56d13b.update({
                'point': _0x52dcc9 + _0xbef49
              });
            });
          });
          realtimeDB.ref(_0x28547a + "/VCNVRowStatus").set({
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
          realtimeDB.ref(_0x28547a + '/VCNVImageStatus').set({
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
          _0x5c33c7.set({
            'correct': 0x1
          });
          _0x5be208.update({
            'TenseMoments': false
          });
          successToast("Đã chấm điểm trả lời đúng chướng ngại vật");
        }
      }
      async function _0x7fec6(_0x5ef743) {
        const _0x3cba15 = await _0x4c170d.once("value");
        if (auth.currentUser.uid !== _0x3cba15.val()) {
          failToast("Thao tác này chỉ dành cho người điều khiển.");
          return;
        }
        if (confirm("Bạn có chắc chắn muốn chấm điểm trả lời sai chướng ngại vật không? Thí sinh sẽ không còn quyền trả lời hàng ngang")) {
          _0x268f4e.push(_0x5ef743);
          _0x5be208.update({
            'TenseMoments': false
          });
          _0x5c33c7.set({
            'correct': 0x2
          }).then(() => _0x5c33c7.set({
            'correct': 0x0
          }));
          successToast("Đã chấm trả lời sai chướng ngại vật");
        }
      }
      _0x268f4e.on("value", _0x3ddf8b => {
        for (let _0x42404a = 0x1; _0x42404a <= 0x4; _0x42404a++) {
          const _0x2724ad = document.getElementById("obstaclePlayer" + _0x42404a);
          const _0x25da89 = document.getElementById('obstaclePlayer' + _0x42404a + "Name");
          if (_0x2724ad) {
            _0x2724ad.classList.remove("bg-gray-500", "rounded-md");
          }
          if (_0x25da89) {
            const _0x469088 = _0x25da89.querySelector('.remove-disabled-icon');
            if (_0x469088) {
              _0x469088.remove();
            }
          }
        }
        if (_0x3ddf8b.exists()) {
          _0x3ddf8b.forEach(_0x509a38 => {
            const _0x3610a3 = _0x509a38.val();
            const _0x40dc0b = document.getElementById("obstaclePlayer" + _0x3610a3);
            const _0x25c269 = document.getElementById("obstaclePlayer" + _0x3610a3 + "Name");
            if (_0x40dc0b) {
              _0x40dc0b.classList.add("bg-gray-500", "rounded-md");
            }
            if (_0x25c269) {
              if (!_0x25c269.querySelector(".remove-disabled-icon")) {
                const _0x387121 = document.createElement("button");
                _0x387121.classList.add("remove-disabled-icon", "bg-blue-400", "rounded-md");
                _0x387121.innerHTML = "<span>Cho phép người chơi tiếp tục phần thi</span>";
                _0x387121.onclick = () => {
                  _0x4c170d.once('value', _0x52aa03 => {
                    if (auth.currentUser.uid !== _0x52aa03.val()) {
                      failToast("Thao tác này chỉ dành cho người điều khiển.");
                      return;
                    }
                    _0x268f4e.child(_0x509a38.key).remove();
                  });
                };
                _0x25c269.appendChild(_0x387121);
              }
            }
          });
        }
      });
    });
  });