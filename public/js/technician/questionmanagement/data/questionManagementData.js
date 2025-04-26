auth.onAuthStateChanged(_0x2c99a7 => {
    if (!_0x2c99a7) {
      return;
    }
    const _0xbbd128 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0xbbd128.onSnapshot(_0x4ed4b0 => {
      if (!_0x4ed4b0.exists) {
        return;
      }
      const _0x314dd5 = _0x4ed4b0.data().match;
      const _0xc74429 = realtimeDB.ref(_0x314dd5 + '/StartQuestion');
      const _0x412bfa = realtimeDB.ref(_0x314dd5 + '/KDO22Question');
      const _0x5bcf3d = realtimeDB.ref(_0x314dd5 + "/VCNVQuestion");
      const _0x4ea651 = realtimeDB.ref(_0x314dd5 + "/AccelerationQuestion");
      const _0x55abde = realtimeDB.ref(_0x314dd5 + "/FinishQuestion");
      const _0x4c24b7 = realtimeDB.ref(_0x314dd5 + "/CHPQuestion");
      const _0x5d7d5b = realtimeDB.ref(_0x314dd5 + "/match");
      const _0x434ce7 = realtimeDB.ref(_0x314dd5 + "/hostid");
      _0x434ce7.on("value", _0xe807e8 => {
        if (auth.currentUser.uid !== _0xe807e8.val()) {
          window.location.href = '/Main.html';
        }
      });
      _0x5d7d5b.on("value", _0x4c6bf4 => {
        const _0x246493 = _0x4c6bf4.val();
        document.getElementById("MatchName").value = _0x246493;
        document.getElementById('QuestionManagerTitle').textContent = "Quản lý câu hỏi: " + _0x246493;
      });
      _0xc74429.on("value", _0x329478 => {
        const _0x17d524 = _0x329478.val();
        if (!_0x17d524) {
          return;
        }
        const _0x3123ce = document.getElementById("questionsContainer");
        _0x3123ce.innerHTML = '';
        Object.keys(_0x17d524).forEach((_0x3b05d2, _0x5bd09c) => {
          const _0x3e9c43 = _0x17d524[_0x3b05d2];
          const _0x57e0a4 = document.createElement('div');
          _0x57e0a4.id = "start" + (_0x5bd09c + 0x1);
          _0x57e0a4.innerHTML = "\n                    <div class=\"mx-auto bg-white dark:bg-neutral-800 mt-2 border border-slate-200 rounded-md\">\n                        <p class=\"text-2xl text-slate-800 font-semibold dark:text-white p-4\">Gói câu hỏi " + (_0x5bd09c + 0x1) + "</p>\n                        <div class=\"rounded-md shadow p-4 space-y-2\" id=\"pack" + (_0x5bd09c + 0x1) + "\"></div>\n                    </div>\n                ";
          const _0x4b87be = _0x57e0a4.querySelector("#pack" + (_0x5bd09c + 0x1));
          for (let _0x2c812b = 0x1; _0x2c812b <= 0x6; _0x2c812b++) {
            const _0x2a698 = _0x3e9c43['cau' + _0x2c812b] || '';
            const _0x8bb3fc = _0x3e9c43["dacau" + _0x2c812b] || '';
            const _0x4dced6 = "\n                        <div class=\"flex items-center space-x-4\">\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + _0x2c812b + ":</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"startI_Q" + (_0x5bd09c + 0x1) + "DB_question" + _0x2c812b + "\">" + _0x2a698 + "</textarea>\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"startI_Q" + (_0x5bd09c + 0x1) + "DB_answer" + _0x2c812b + "\">" + _0x8bb3fc + "</textarea>\n                        </div>\n                    ";
            _0x4b87be.innerHTML += _0x4dced6;
          }
          _0x3123ce.appendChild(_0x57e0a4);
        });
      });
      _0x412bfa.on("value", _0x8a1074 => {
        const _0x2147ff = _0x8a1074.val();
        if (!_0x2147ff) {
          return;
        }
        const _0x1ef193 = document.getElementById("questionsContainerII");
        _0x1ef193.innerHTML = '';
        const _0x1d169e = {
          'L1': 0xc,
          'L2': 0x19,
          'L3': 0x23
        };
        Object.keys(_0x1d169e).forEach((_0x35324a, _0x34903a) => {
          const _0x118033 = _0x2147ff[_0x35324a];
          const _0x407bab = _0x1d169e[_0x35324a];
          const _0x371c29 = document.createElement("div");
          _0x371c29.id = "startII_pack" + (_0x34903a + 0x1);
          _0x371c29.innerHTML = "\n                    <div class=\"mx-auto bg-white dark:bg-neutral-800 mt-2 border border-slate-200 rounded-md\">\n                        <p class=\"text-2xl text-slate-800 font-semibold dark:text-white p-4\">Gói câu hỏi " + (_0x34903a + 0x1) + "</p>\n                        <div class=\"rounded-md shadow p-4 space-y-2\" id=\"packII" + (_0x34903a + 0x1) + "\"></div>\n                    </div>\n                ";
          const _0x246cdb = _0x371c29.querySelector("#packII" + (_0x34903a + 0x1));
          for (let _0x3fe617 = 0x1; _0x3fe617 <= _0x407bab; _0x3fe617++) {
            const _0x3a9157 = _0x118033['cau' + _0x3fe617] || '';
            const _0x50740f = _0x118033["dacau" + _0x3fe617] || '';
            const _0x51a590 = "\n                        <div class=\"flex items-center space-x-4\">\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + _0x3fe617 + ":</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"startII_pack" + (_0x34903a + 0x1) + "_question" + _0x3fe617 + "\">" + _0x3a9157 + "</textarea>\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"startII_pack" + (_0x34903a + 0x1) + "_answer" + _0x3fe617 + "\">" + _0x50740f + "</textarea>\n                        </div>\n                    ";
            _0x246cdb.innerHTML += _0x51a590;
          }
          _0x1ef193.appendChild(_0x371c29);
        });
      });
      _0x5bcf3d.on("value", _0x24bd0f => {
        const _0x41a6d8 = _0x24bd0f.val();
        document.getElementById("ObstacleText").value = _0x41a6d8?.["CNV"]['cnv'] || '';
        if (!_0x41a6d8) {
          return;
        }
        const _0x201c68 = document.getElementById("questionsContainerObstacle");
        _0x201c68.innerHTML = '';
        const _0x20f523 = ["HN1", 'HN2', "HN3", "HN4", "HNTT"];
        const _0x51d346 = document.createElement("div");
        _0x51d346.classList.add("mx-auto", "bg-white", "dark:bg-neutral-800", "mt-2", "border", "border-slate-200", "rounded-md", 'p-4');
        _0x51d346.innerHTML = "\n                <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-4\">Câu hỏi vượt chướng ngại vật</p>\n            ";
        _0x20f523.forEach((_0x30d5cf, _0x167730) => {
          const _0x3f747d = _0x41a6d8[_0x30d5cf];
          const _0x68d706 = _0x3f747d.cauhoi || '';
          const _0x8c6d59 = _0x3f747d.dapan || '';
          const _0x29d55e = "\n                    <div class=\"flex items-center space-x-4 mb-4\">\n                        <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + (_0x167730 + 0x1) + ":</span>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"obstacle_pack" + (_0x167730 + 0x1) + "_question\">" + _0x68d706 + "</textarea>\n                        <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</span>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"obstacle_pack" + (_0x167730 + 0x1) + "_answer\">" + _0x8c6d59 + "</textarea>\n                    </div>\n                ";
          _0x51d346.innerHTML += _0x29d55e;
        });
        _0x201c68.appendChild(_0x51d346);
      });
      firebase.storage().ref(_0x314dd5 + "/img/cnv/cnv.jpg").getDownloadURL().then(_0x5a92b3 => {
        document.getElementById("ObstacleImage").src = _0x5a92b3;
      })['catch'](_0x338c0b => {});
      firebase.storage().ref(_0x314dd5 + '/audio/cnv/hn.mp3').getDownloadURL().then(_0x478d6d => {
        document.getElementById('ObstacleAudio').src = _0x478d6d;
      })["catch"](_0x163d8e => {});
      _0x4ea651.on("value", _0x22d8cb => {
        const _0x19482e = _0x22d8cb.val();
        if (!_0x19482e) {
          return;
        }
        const _0x4d7b54 = document.getElementById('questionsContainerAcceleration');
        _0x4d7b54.innerHTML = '';
        const _0x20201d = ["QS1", "QS2", "QS3", "QS4"];
        const _0x35166d = document.createElement("div");
        _0x35166d.classList.add("mx-auto", "bg-white", "dark:bg-neutral-800", "mt-2", "border", "border-slate-200", 'rounded-md', "p-4");
        _0x35166d.innerHTML = "\n                <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-4\">Câu hỏi Tăng tốc</p>\n            ";
        _0x20201d.forEach((_0xedaf9c, _0x256d59) => {
          const _0x3cf877 = _0x19482e[_0xedaf9c];
          const _0x33809e = _0x3cf877?.['cauhoi'] || '';
          const _0x35523a = _0x3cf877?.["dapan"] || '';
          const _0x311192 = "\n                    <div class=\"space-y-4 mb-6\">\n                        <!-- Question and Answer Textareas -->\n                        <div class=\"flex items-center space-x-4\">\n                            <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Câu hỏi " + (_0x256d59 + 0x1) + ":</label>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập câu hỏi...\"\n                                rows=\"1\"\n                                id=\"acceleration_textarea_question" + (_0x256d59 + 0x1) + "\"\n                            >" + _0x33809e + "</textarea>\n                            <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Đáp án:</label>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập đáp án...\"\n                                rows=\"1\"\n                                id=\"acceleration_textarea_answer" + (_0x256d59 + 0x1) + "\"\n                            >" + _0x35523a + "</textarea>\n                        </div>\n                        <!-- Question Video and Answer Image -->\n                        <div class=\"flex items-center space-x-4\">\n                            <!-- Question Video -->\n                            <div class=\"flex-1\">\n                                <video\n                                    id=\"acceleration_question_video" + (_0x256d59 + 0x1) + "\"\n                                    class=\"w-full h-[40vh] border border-slate-200 dark:border-neutral-600 rounded-lg\"\n                                    controls\n                                    poster=\"\"\n                                >\n                                    <source id=\"acceleration_question_source" + (_0x256d59 + 0x1) + "\" type=\"video/mp4\">\n                                    Your browser does not support the video tag.\n                                </video>\n                                <div class=\"flex space-x-2 mt-2\">\n                                    <input type=\"file\" id=\"upload_question_video" + (_0x256d59 + 0x1) + "\" class=\"hidden\" accept=\"video/*, image/*\">\n                                    <label for=\"upload_question_video" + (_0x256d59 + 0x1) + "\" class=\"cursor-pointer bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 font-semibold\">Tải lên</label>\n                                    <button id=\"delete_question_video" + (_0x256d59 + 0x1) + "\" class=\"bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 font-semibold\">Xoá phương tiện</button>\n                                </div>\n                            </div>\n                            <!-- Answer Image -->\n                            <div class=\"flex-1\">\n                                <video\n                                    id=\"acceleration_answer_video" + (_0x256d59 + 0x1) + "\"\n                                    class=\"w-full h-[40vh] border border-slate-200 dark:border-neutral-600 rounded-lg\"\n                                    poster=\"\"\n                                >\n                                    <source id=\"acceleration_answer_source" + (_0x256d59 + 0x1) + "\" type=\"video/mp4\">\n                                    Your browser does not support the video tag.\n                                </video>\n                                <div class=\"flex space-x-2 mt-2\">\n                                    <input type=\"file\" id=\"upload_answer_image" + (_0x256d59 + 0x1) + "\" class=\"hidden\" accept=\"image/*\">\n                                    <label for=\"upload_answer_image" + (_0x256d59 + 0x1) + "\" class=\"cursor-pointer bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 font-semibold\">Tải lên</label>\n                                    <button id=\"delete_answer_image" + (_0x256d59 + 0x1) + "\" class=\"bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 font-semibold\">Xoá phương tiện</button>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                ";
          _0x35166d.innerHTML += _0x311192;
        });
        _0x4d7b54.appendChild(_0x35166d);
        _0x20201d.forEach((_0x3a57cb, _0x2b4b38) => {
          firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + '/tt' + (_0x2b4b38 + 0x1) + '.jpg').getDownloadURL().then(_0x30484b => {
            const _0x3bfbbf = document.getElementById("acceleration_question_video" + (_0x2b4b38 + 0x1));
            if (_0x3bfbbf) {
              _0x3bfbbf.poster = _0x30484b;
              _0x3bfbbf.removeAttribute("controls");
            }
          })["catch"](_0x92ae55 => console.log("Error fetching poster: " + _0x92ae55));
          firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + "/tt" + (_0x2b4b38 + 0x1) + ".mp4").getDownloadURL().then(_0x3556ef => {
            const _0x2bb84f = document.getElementById('acceleration_question_source' + (_0x2b4b38 + 0x1));
            if (_0x2bb84f) {
              _0x2bb84f.src = _0x3556ef;
              const _0x31fceb = document.getElementById("acceleration_question_video" + (_0x2b4b38 + 0x1));
              if (_0x31fceb) {
                _0x31fceb.load();
              }
            }
          })['catch'](_0x5edf8e => console.log("Error fetching video: " + _0x5edf8e));
          firebase.storage().ref(_0x314dd5 + "/tt/datt" + (_0x2b4b38 + 0x1) + "/tt" + (_0x2b4b38 + 0x1) + ".jpg").getDownloadURL().then(_0x46dbab => {
            const _0xde473b = document.getElementById("acceleration_answer_video" + (_0x2b4b38 + 0x1));
            if (_0xde473b) {
              _0xde473b.poster = _0x46dbab;
            }
          })["catch"](_0x178360 => console.log("Error fetching answer image: " + _0x178360));
          const _0x5787a5 = document.getElementById('upload_question_video' + (_0x2b4b38 + 0x1));
          if (_0x5787a5) {
            _0x5787a5.addEventListener("change", async _0x191849 => {
              const _0x12a220 = _0x191849.target.files[0x0];
              if (_0x12a220) {
                const _0x1f647b = _0x12a220.size / 1048576;
                // if (_0x1f647b > 0x8) {
                //   failToast("Kích thước tệp không được vượt quá 8MB.");
                //   return;
                // }
                const _0x6c7ee2 = _0x12a220.name.split('.').pop().toLowerCase();
                let _0x1cc42c;
                let _0xf78085;
                let _0x207d98;
                let _0x1d2573;
                let _0x2f19b0;
                if (_0x6c7ee2 === 'mp4') {
                  _0x1cc42c = firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + '/tt' + (_0x2b4b38 + 0x1) + ".mp4");
                  _0x2f19b0 = firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + "/tt" + (_0x2b4b38 + 0x1) + ".jpg");
                  _0x1d2573 = "video";
                  _0xf78085 = "Tải lên video thành công.";
                  _0x207d98 = "Tải lên video thất bại.";
                } else {
                  if (_0x6c7ee2 === "jpg" || _0x6c7ee2 === "png") {
                    _0x1cc42c = firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + "/tt" + (_0x2b4b38 + 0x1) + ".jpg");
                    _0x2f19b0 = firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + '/tt' + (_0x2b4b38 + 0x1) + '.mp4');
                    _0x1d2573 = "image";
                    _0xf78085 = "Tải lên hình ảnh thành công.";
                    _0x207d98 = "Tải lên hình ảnh thất bại.";
                  } else {
                    failToast("Chỉ hỗ trợ định dạng .mp4 và .jpg");
                    return;
                  }
                }
                try {
                  await _0x1cc42c.put(_0x12a220);
                  const _0x4f9a78 = await _0x1cc42c.getDownloadURL();
                  if (_0x1d2573 === "video") {
                    const _0x2ef26a = document.getElementById("acceleration_question_video" + (_0x2b4b38 + 0x1));
                    if (_0x2ef26a) {
                      _0x2ef26a.src = _0x4f9a78;
                      _0x2ef26a.poster = '';
                      _0x2ef26a.setAttribute("controls", '');
                      _0x2ef26a.load();
                    }
                  } else {
                    if (_0x1d2573 === "image") {
                      const _0x519785 = document.getElementById("acceleration_question_video" + (_0x2b4b38 + 0x1));
                      if (_0x519785) {
                        _0x519785.poster = _0x4f9a78;
                        _0x519785.src = '';
                        _0x519785.removeAttribute("controls");
                      }
                    }
                  }
                  await _0x2f19b0["delete"]()["catch"](_0xe82e42 => console.log("Error deleting " + (_0x1d2573 === 'video' ? "image" : "video") + ": " + _0xe82e42));
                  successToast(_0xf78085);
                } catch (_0x5a5004) {
                  console.error("Error uploading " + _0x1d2573 + ':', _0x5a5004);
                  failToast(_0x207d98);
                }
              }
            });
          }
          const _0xd704bb = document.getElementById("delete_question_video" + (_0x2b4b38 + 0x1));
          if (_0xd704bb) {
            _0xd704bb.addEventListener("click", async () => {
              try {
                const _0x26b07a = firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + "/tt" + (_0x2b4b38 + 0x1) + ".mp4");
                const _0x5a37fd = firebase.storage().ref(_0x314dd5 + "/tt/tt" + (_0x2b4b38 + 0x1) + '/tt' + (_0x2b4b38 + 0x1) + ".jpg");
                await Promise.allSettled([_0x26b07a["delete"](), _0x5a37fd["delete"]()]);
                const _0x54874c = document.getElementById("acceleration_question_video" + (_0x2b4b38 + 0x1));
                if (_0x54874c) {
                  _0x54874c.poster = '';
                  _0x54874c.src = '';
                  _0x54874c.load();
                }
                successToast("Xoá phương tiện thành công");
              } catch (_0x4d4f0f) {
                console.error("Error deleting media:", _0x4d4f0f);
                failToast("Lỗi khi xoá phương tiện");
              }
            });
          }
          const _0x4cb424 = document.getElementById("upload_answer_image" + (_0x2b4b38 + 0x1));
          if (_0x4cb424) {
            _0x4cb424.addEventListener("change", async _0x5e4115 => {
              const _0xfea15f = _0x5e4115.target.files[0x0];
              if (_0xfea15f) {
                const _0x25350a = _0xfea15f.size / 1048576;
                // if (_0x25350a > 0x8) {
                //   failToast("Kích thước tệp không được vượt quá 8MB.");
                //   return;
                // }
                const _0x4fd5fc = firebase.storage().ref(_0x314dd5 + "/tt/datt" + (_0x2b4b38 + 0x1) + '/tt' + (_0x2b4b38 + 0x1) + ".jpg");
                try {
                  await _0x4fd5fc.put(_0xfea15f);
                  const _0x2a0268 = await _0x4fd5fc.getDownloadURL();
                  const _0x46140b = document.getElementById("acceleration_answer_video" + (_0x2b4b38 + 0x1));
                  if (_0x46140b) {
                    _0x46140b.poster = _0x2a0268;
                  }
                  successToast("Tải lên hình ảnh đáp án thành công.");
                } catch (_0x4ca7c9) {
                  console.error("Error uploading answer image:", _0x4ca7c9);
                  failToast("Lỗi khi xoá hình ảnh đáp án.");
                }
              } else {
                failToast("No file selected.");
              }
            });
          }
          const _0x485a98 = document.getElementById("delete_answer_image" + (_0x2b4b38 + 0x1));
          if (_0x485a98) {
            _0x485a98.addEventListener('click', async () => {
              try {
                const _0x3bb33 = firebase.storage().ref(_0x314dd5 + "/tt/datt" + (_0x2b4b38 + 0x1) + "/tt" + (_0x2b4b38 + 0x1) + '.jpg');
                await _0x3bb33["delete"]();
                const _0x193c00 = document.getElementById("acceleration_answer_video" + (_0x2b4b38 + 0x1));
                if (_0x193c00) {
                  _0x193c00.poster = '';
                }
                successToast("Đã xoá hình ảnh đáp án thành công.");
              } catch (_0x24cb0f) {
                console.error("Error deleting answer image:", _0x24cb0f);
                failToast("Lỗi khi xoá hình ảnh đáp án");
              }
            });
          }
        });
      });
      _0x55abde.on("value", _0x124712 => {
        const _0x3ceb17 = _0x124712.val();
        if (!_0x3ceb17) {
          return;
        }
        const _0x407328 = document.getElementById("questionsContainerFinish");
        _0x407328.innerHTML = '';
        Object.keys(_0x3ceb17).forEach((_0x4deea0, _0x4f0c57) => {
          const _0x552831 = _0x3ceb17[_0x4deea0];
          const _0x36001c = document.createElement("div");
          _0x36001c.classList.add("mx-auto", 'bg-white', "dark:bg-neutral-800", 'mt-2', "border", "border-slate-200", "rounded-md", "p-4");
          _0x36001c.innerHTML = "\n                    <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-2\">Gói câu hỏi " + (_0x4f0c57 + 0x1) + "</p>\n                    <div class=\"mb-4\">\n                        <video\n                            id=\"finish_video" + (_0x4f0c57 + 0x1) + "\"\n                            class=\"w-full h-[40vh] border border-slate-200 dark:border-neutral-600 rounded-lg mb-2\"\n                            controls\n                        >\n                            <source id=\"finish_video_source" + (_0x4f0c57 + 0x1) + "\" type=\"video/mp4\">\n                            Your browser does not support the video tag.\n                        </video>\n                        <div class=\"flex space-x-2\">\n                            <input type=\"file\" id=\"upload_finish_video" + (_0x4f0c57 + 0x1) + "\" class=\"hidden\" accept=\"video/mp4\">\n                            <label for=\"upload_finish_video" + (_0x4f0c57 + 0x1) + "\" class=\"cursor-pointer bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 font-semibold\">Tải lên</label>\n                            <button id=\"delete_finish_video" + (_0x4f0c57 + 0x1) + "\" class=\"bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 font-semibold\">Xoá video</button>\n                        </div>\n                    </div>\n                ";
          Object.keys(_0x552831).forEach(_0x154008 => {
            const _0x2ec98c = _0x552831[_0x154008];
            const _0x35606d = _0x154008.replace('QP', '');
            const _0x117b97 = document.createElement("div");
            _0x117b97.classList.add("mt-4", "space-y-4");
            _0x117b97.innerHTML = "\n                        <p class=\"text-lg text-slate-700 font-medium dark:text-slate-300\">Câu hỏi " + _0x35606d + " điểm</p>\n                    ";
            Object.keys(_0x2ec98c).forEach((_0x52654a, _0x421516) => {
              const _0x4ac90c = _0x2ec98c[_0x52654a];
              const _0x1b3d78 = _0x4ac90c?.['cauhoi'] || '';
              const _0x5d245d = _0x4ac90c?.['dapan'] || '';
              const _0x545298 = "\n                            <div class=\"flex items-center space-x-4\">\n                                <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Câu hỏi " + (_0x421516 + 0x1) + ":</label>\n                                <textarea\n                                    class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                    placeholder=\"Nhập câu hỏi...\"\n                                    rows=\"1\"\n                                    id=\"finish_pack" + (_0x4f0c57 + 0x1) + "_points" + _0x35606d + "_question" + (_0x421516 + 0x1) + "\"\n                                >" + _0x1b3d78 + "</textarea>\n                                <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Đáp án:</label>\n                                <textarea\n                                    class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                    placeholder=\"Nhập đáp án...\"\n                                    rows=\"1\"\n                                    id=\"finish_pack" + (_0x4f0c57 + 0x1) + "_points" + _0x35606d + "_answer" + (_0x421516 + 0x1) + "\"\n                                >" + _0x5d245d + "</textarea>\n                            </div>\n                        ";
              _0x117b97.innerHTML += _0x545298;
            });
            _0x36001c.appendChild(_0x117b97);
          });
          _0x407328.appendChild(_0x36001c);
          firebase.storage().ref(_0x314dd5 + "/vd/vd" + (_0x4f0c57 + 0x1) + "/vd.mp4").getDownloadURL().then(_0x4ae293 => {
            const _0x1ed19f = document.getElementById("finish_video_source" + (_0x4f0c57 + 0x1));
            if (_0x1ed19f) {
              _0x1ed19f.src = _0x4ae293;
              const _0x4d7080 = document.getElementById("finish_video" + (_0x4f0c57 + 0x1));
              if (_0x4d7080) {
                _0x4d7080.load();
              }
            }
          })["catch"](_0x5189f2 => console.log("Error fetching video: " + _0x5189f2));
          const _0x3e65fb = document.getElementById("upload_finish_video" + (_0x4f0c57 + 0x1));
          if (_0x3e65fb) {
            _0x3e65fb.addEventListener('change', async _0x447c17 => {
              const _0x3c4c8f = _0x447c17.target.files[0x0];
              if (_0x3c4c8f) {
                const _0x2de1c4 = _0x3c4c8f.size / 1048576;
                // if (_0x2de1c4 > 0x8) {
                //   failToast("Kích thước tệp không được vượt quá 8MB.");
                //   return;
                // }
                if (_0x3c4c8f.type !== "video/mp4") {
                  failToast("Chỉ hỗ trợ định dạng .mp4");
                  return;
                }
                const _0x346d12 = firebase.storage().ref(_0x314dd5 + "/vd/vd" + (_0x4f0c57 + 0x1) + "/vd.mp4");
                try {
                  await _0x346d12.put(_0x3c4c8f);
                  const _0x2ef136 = await _0x346d12.getDownloadURL();
                  const _0x21b1cb = document.getElementById('finish_video' + (_0x4f0c57 + 0x1));
                  const _0x589869 = document.getElementById('finish_video_source' + (_0x4f0c57 + 0x1));
                  if (_0x589869) {
                    _0x589869.src = _0x2ef136;
                    if (_0x21b1cb) {
                      _0x21b1cb.load();
                    }
                  }
                  successToast("Tải lên video thành công.");
                } catch (_0x5d22ff) {
                  console.error("Error uploading video:", _0x5d22ff);
                  failToast("Tải lên video thất bại.");
                }
              }
            });
          }
          const _0x170a51 = document.getElementById("delete_finish_video" + (_0x4f0c57 + 0x1));
          if (_0x170a51) {
            _0x170a51.addEventListener("click", async () => {
              try {
                const _0x25c241 = firebase.storage().ref(_0x314dd5 + "/vd/vd" + (_0x4f0c57 + 0x1) + "/vd.mp4");
                await _0x25c241["delete"]();
                const _0xe6aea = document.getElementById("finish_video" + (_0x4f0c57 + 0x1));
                const _0x3feb00 = document.getElementById("finish_video_source" + (_0x4f0c57 + 0x1));
                if (_0x3feb00) {
                  _0x3feb00.src = '';
                  if (_0xe6aea) {
                    _0xe6aea.load();
                  }
                }
                successToast("Xoá video thành công");
              } catch (_0x4eb658) {
                console.error("Error deleting video:", _0x4eb658);
                failToast("Lỗi khi xoá video");
              }
            });
          }
        });
      });
      _0x4c24b7.on("value", _0x4c54f8 => {
        const _0x5119c4 = _0x4c54f8.val();
        console.log(_0x5119c4);
        if (!_0x5119c4) {
          return;
        }
        const _0x2bed44 = document.getElementById("questionsContainerAdditional");
        _0x2bed44.innerHTML = '';
        const _0x12eaed = document.createElement("div");
        _0x12eaed.classList.add("mx-auto", "bg-white", "dark:bg-neutral-800", "mt-2", "border", "border-slate-200", "rounded-md", "p-4");
        _0x12eaed.innerHTML = "\n                <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-4\">Câu hỏi phụ</p>\n            ";
        for (let _0x97a36c = 0x1; _0x97a36c <= 0xa; _0x97a36c++) {
          const _0x28d7af = _0x5119c4['cau' + _0x97a36c] || '';
          const _0x488071 = _0x5119c4["dacau" + _0x97a36c] || '';
          const _0x29140f = "\n                    <div class=\"flex items-center space-x-4 mb-4\">\n                        <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + _0x97a36c + ":</label>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"additional_question" + _0x97a36c + "\">" + _0x28d7af + "</textarea>\n                        <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</label>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"additional_answer" + _0x97a36c + "\">" + _0x488071 + "</textarea>\n                    </div>\n                ";
          _0x12eaed.innerHTML += _0x29140f;
        }
        _0x2bed44.appendChild(_0x12eaed);
      });
    });
  });