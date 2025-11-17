auth.onAuthStateChanged(_0x3636cd => {
    if (!_0x3636cd) {
      return;
    }
    const _0x5b41c4 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x5b41c4.onSnapshot(_0x22ea5a => {
      if (!_0x22ea5a.exists) {
        return;
      }
      const _0x548bc5 = _0x22ea5a.data().match;
      const _0x3ffb0a = realtimeDB.ref(_0x548bc5 + "/StartQuestion");
      const _0xd4993a = realtimeDB.ref(_0x548bc5 + "/KDO22Question");
      const _0x58c780 = realtimeDB.ref(_0x548bc5 + '/VCNVQuestion');
      const _0x3bf8fa = realtimeDB.ref(_0x548bc5 + '/AccelerationQuestion');
      const _0x3c3256 = realtimeDB.ref(_0x548bc5 + '/FinishQuestion');
      const _0x1e179d = realtimeDB.ref(_0x548bc5 + "/CHPQuestion");
      const _0x30bf7e = realtimeDB.ref(_0x548bc5 + '/match');
      const _0x1c3238 = realtimeDB.ref(_0x548bc5 + "/hostid");
      const _0x20d1f8 = realtimeDB.ref(_0x548bc5 + "/PlayerLimit");
      _0x1c3238.on("value", _0x34b36a => {
        if (auth.currentUser.uid !== _0x34b36a.val()) {
          window.location.href = "/Main.html";
        }
      });
      _0x30bf7e.on("value", _0x53ba4b => {
        const _0x528d0a = _0x53ba4b.val();
        document.getElementById("MatchName").value = _0x528d0a;
        document.getElementById("QuestionManagerTitle").textContent = "Quản lý câu hỏi: " + _0x528d0a;
      });
      _0x20d1f8.on("value", _0x56ce17 => {
        const _0x358cd1 = _0x56ce17.val() || 0x4;
        setPlayerLimit(_0x358cd1);
        const _0xef3252 = document.getElementById("playerLimit4");
        const _0x1631a2 = document.getElementById("playerLimit5");
        if (_0xef3252 && _0x1631a2) {
          if (_0x358cd1 === 0x5) {
            _0x1631a2.checked = true;
            _0xef3252.checked = false;
          } else {
            _0xef3252.checked = true;
            _0x1631a2.checked = false;
          }
        }
      });
      _0x3ffb0a.on('value', _0x8212ac => {
        const _0x18075d = _0x8212ac.val();
        if (!_0x18075d) {
          return;
        }
        const _0x11f643 = document.getElementById('questionsContainer');
        _0x11f643.innerHTML = '';
        const _0x22f54a = getPlayerLimit();
        const _0x34a72d = [];
        for (let _0x2132e7 = 0x1; _0x2132e7 <= _0x22f54a; _0x2132e7++) {
          _0x34a72d.push('Q' + _0x2132e7 + 'DB');
        }
        _0x34a72d.forEach((_0x592ed0, _0x47d8bc) => {
          const _0x4ca014 = _0x18075d[_0x592ed0] || {};
          const _0x37920b = document.createElement("div");
          _0x37920b.id = "start" + (_0x47d8bc + 0x1);
          _0x37920b.innerHTML = "\n                    <div class=\"mx-auto bg-white dark:bg-neutral-800 mt-2 border border-slate-200 rounded-md\">\n                        <p class=\"text-2xl text-slate-800 font-semibold dark:text-white p-4\">Gói câu hỏi " + (_0x47d8bc + 0x1) + "</p>\n                        <div class=\"rounded-md shadow p-4 space-y-2\" id=\"pack" + (_0x47d8bc + 0x1) + "\"></div>\n                    </div>\n                ";
          const _0xbd8852 = _0x37920b.querySelector("#pack" + (_0x47d8bc + 0x1));
          for (let _0x389453 = 0x1; _0x389453 <= 0x6; _0x389453++) {
            const _0x3ac828 = _0x4ca014["cau" + _0x389453] || '';
            const _0x386965 = _0x4ca014['dacau' + _0x389453] || '';
            const _0x40c2d1 = "\n                        <div class=\"flex items-center space-x-4\">\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + _0x389453 + ":</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"startI_Q" + (_0x47d8bc + 0x1) + "DB_question" + _0x389453 + "\">" + _0x3ac828 + "</textarea>\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"startI_Q" + (_0x47d8bc + 0x1) + "DB_answer" + _0x389453 + "\">" + _0x386965 + "</textarea>\n                            <div class=\"flex space-x-2\">\n                                <button onclick=\"addMediaToQuestion('StartQuestion', 'Q" + (_0x47d8bc + 0x1) + "DB', " + _0x389453 + ", 'image')\" \n                                        class=\"media-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                        title=\"Thêm hình ảnh\">\n                                    <span class=\"material-icons text-sm\">image</span>\n                                </button>\n                                <button onclick=\"addMediaToQuestion('StartQuestion', 'Q" + (_0x47d8bc + 0x1) + "DB', " + _0x389453 + ", 'audio')\" \n                                        class=\"media-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                        title=\"Thêm âm thanh\">\n                                    <span class=\"material-icons text-sm\">audiotrack</span>\n                                </button>\n                            </div>\n                        </div>\n                    ";
            _0xbd8852.innerHTML += _0x40c2d1;
          }
          _0x11f643.appendChild(_0x37920b);
        });
      });
      _0xd4993a.on("value", _0x1797ff => {
        const _0x318efb = _0x1797ff.val();
        if (!_0x318efb) {
          return;
        }
        const _0x25e4c6 = document.getElementById('questionsContainerII');
        _0x25e4c6.innerHTML = '';
        const _0x28ea4b = {
          'L1': 0xc,
          'L2': 0x19,
          'L3': 0x23
        };
        Object.keys(_0x28ea4b).forEach((_0x59a82e, _0xd844aa) => {
          const _0x27d705 = _0x318efb[_0x59a82e];
          const _0x3c72df = _0x28ea4b[_0x59a82e];
          const _0x23524e = document.createElement('div');
          _0x23524e.id = "startII_pack" + (_0xd844aa + 0x1);
          _0x23524e.innerHTML = "\n                    <div class=\"mx-auto bg-white dark:bg-neutral-800 mt-2 border border-slate-200 rounded-md\">\n                        <p class=\"text-2xl text-slate-800 font-semibold dark:text-white p-4\">Gói câu hỏi " + (_0xd844aa + 0x1) + "</p>\n                        <div class=\"rounded-md shadow p-4 space-y-2\" id=\"packII" + (_0xd844aa + 0x1) + "\"></div>\n                    </div>\n                ";
          const _0x22e979 = _0x23524e.querySelector('#packII' + (_0xd844aa + 0x1));
          for (let _0x4f29be = 0x1; _0x4f29be <= _0x3c72df; _0x4f29be++) {
            const _0x12a157 = _0x27d705["cau" + _0x4f29be] || '';
            const _0x47efcb = _0x27d705["dacau" + _0x4f29be] || '';
            const _0x21a954 = "\n                        <div class=\"flex items-center space-x-4\">\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + _0x4f29be + ":</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"startII_pack" + (_0xd844aa + 0x1) + "_question" + _0x4f29be + "\">" + _0x12a157 + "</textarea>\n                            <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</span>\n                            <textarea\n                                class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"startII_pack" + (_0xd844aa + 0x1) + "_answer" + _0x4f29be + "\">" + _0x47efcb + "</textarea>\n                            <div class=\"flex space-x-2\">\n                                <button onclick=\"addMediaToQuestion('KDO22Question', '" + _0x59a82e + "', " + _0x4f29be + ", 'image')\" \n                                        class=\"media-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                        title=\"Thêm hình ảnh\">\n                                    <span class=\"material-icons text-sm\">image</span>\n                                </button>\n                                <button onclick=\"addMediaToQuestion('KDO22Question', '" + _0x59a82e + "', " + _0x4f29be + ", 'audio')\" \n                                        class=\"media-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                        title=\"Thêm âm thanh\">\n                                    <span class=\"material-icons text-sm\">audiotrack</span>\n                                </button>\n                            </div>\n                        </div>\n                    ";
            _0x22e979.innerHTML += _0x21a954;
          }
          _0x25e4c6.appendChild(_0x23524e);
        });
      });
      _0x58c780.on("value", _0x517e95 => {
        const _0x3e6dbb = _0x517e95.val();
        document.getElementById("ObstacleText").value = _0x3e6dbb?.["CNV"]["cnv"] || '';
        document.getElementById('ObstacleExplaination').value = _0x3e6dbb?.["Explaination"]?.["text"] || '';
        if (!_0x3e6dbb) {
          return;
        }
        const _0x531a00 = document.getElementById("questionsContainerObstacle");
        _0x531a00.innerHTML = '';
        const _0x1372d0 = ['HN1', "HN2", "HN3", "HN4", 'HNTT'];
        const _0x25a87c = document.createElement("div");
        _0x25a87c.classList.add('mx-auto', "bg-white", "dark:bg-neutral-800", "mt-2", 'border', "border-slate-200", "rounded-md", "p-4");
        _0x25a87c.innerHTML = "\n                <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-4\">Câu hỏi vượt chướng ngại vật</p>\n            ";
        _0x1372d0.forEach((_0x2034e5, _0x2067b2) => {
          const _0xd4e4e8 = _0x3e6dbb[_0x2034e5];
          const _0x1f8950 = _0xd4e4e8.cauhoi || '';
          const _0x3a4499 = _0xd4e4e8.dapan || '';
          const _0x3ae387 = "\n                    <div class=\"flex items-center space-x-4 mb-4\">\n                        <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + (_0x2067b2 + 0x1) + ":</span>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"obstacle_pack" + (_0x2067b2 + 0x1) + "_question\">" + _0x1f8950 + "</textarea>\n                        <span class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</span>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"obstacle_pack" + (_0x2067b2 + 0x1) + "_answer\">" + _0x3a4499 + "</textarea>\n                        <div class=\"flex space-x-2\">\n                            <button onclick=\"addMediaToQuestion('VCNVQuestion', '" + _0x2034e5 + "', 1, 'image')\" \n                                    class=\"media-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                    title=\"Thêm hình ảnh\">\n                                <span class=\"material-icons text-sm\">image</span>\n                            </button>\n                            <button onclick=\"addMediaToQuestion('VCNVQuestion', '" + _0x2034e5 + "', 1, 'audio')\" \n                                    class=\"media-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                    title=\"Thêm âm thanh\">\n                                <span class=\"material-icons text-sm\">audiotrack</span>\n                            </button>\n                        </div>\n                    </div>\n                ";
          _0x25a87c.innerHTML += _0x3ae387;
        });
        _0x531a00.appendChild(_0x25a87c);
      });
      _0x3bf8fa.on("value", _0x124ff1 => {
        const _0xc428c = _0x124ff1.val();
        if (!_0xc428c) {
          return;
        }
        const _0x4ed7ee = document.getElementById("questionsContainerAcceleration");
        _0x4ed7ee.innerHTML = '';
        const _0xfe0cd = ["QS1", "QS2", 'QS3', 'QS4'];
        const _0x15253b = document.createElement("div");
        _0x15253b.classList.add("mx-auto", "bg-white", "dark:bg-neutral-800", "mt-2", 'border', "border-slate-200", "rounded-md", "p-4");
        _0x15253b.innerHTML = "\n        <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-4\">Câu hỏi Tăng tốc</p>\n    ";
        _0xfe0cd.forEach((_0x43ebfc, _0x5e37d1) => {
          const _0x26a11b = _0xc428c[_0x43ebfc];
          const _0x351e92 = _0x26a11b?.["cauhoi"] || '';
          const _0x28072b = _0x26a11b?.["dapan"] || '';
          const _0x2430fb = "\n            <div class=\"space-y-4 mb-6\">\n                <!-- Question and Answer Textareas -->\n                <div class=\"flex items-center space-x-4\">\n                    <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Câu hỏi " + (_0x5e37d1 + 0x1) + ":</label>\n                    <textarea\n                        class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                        placeholder=\"Nhập câu hỏi...\"\n                        rows=\"1\"\n                        id=\"acceleration_textarea_question" + (_0x5e37d1 + 0x1) + "\"\n                    >" + _0x351e92 + "</textarea>\n                    <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Đáp án:</label>\n                    <textarea\n                        class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                        placeholder=\"Nhập đáp án...\"\n                        rows=\"1\"\n                        id=\"acceleration_textarea_answer" + (_0x5e37d1 + 0x1) + "\"\n                    >" + _0x28072b + "</textarea>\n                </div>\n                <!-- Question Video and Answer Image -->\n                <div class=\"flex items-center space-x-4\">\n                    <!-- Question Video -->\n                    <div class=\"flex-1\">\n                        <div class=\"relative\">\n                            <video\n                                id=\"acceleration_question_video" + (_0x5e37d1 + 0x1) + "\"\n                                class=\"w-full h-[40vh] border border-slate-200 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-gray-700\"\n                                controls\n                                poster=\"\"\n                            >\n                                <source id=\"acceleration_question_source" + (_0x5e37d1 + 0x1) + "\" type=\"video/mp4\">\n                                Your browser does not support the video tag.\n                            </video>\n                            <div class=\"absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg\" id=\"acceleration_question_placeholder" + (_0x5e37d1 + 0x1) + "\">\n                                <div class=\"text-center\">\n                                    <span class=\"material-icons text-4xl text-gray-400 mb-2\">video_library</span>\n                                    <p class=\"text-gray-500 dark:text-gray-400\">Chưa có video/hình ảnh</p>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"flex space-x-2 mt-2\">\n                            <input type=\"file\" id=\"upload_question_media" + (_0x5e37d1 + 0x1) + "\" class=\"hidden\" accept=\"video/*,image/*\">\n                            <label for=\"upload_question_media" + (_0x5e37d1 + 0x1) + "\" class=\"cursor-pointer bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 font-semibold\">Tải lên</label>\n                            <button id=\"delete_question_media" + (_0x5e37d1 + 0x1) + "\" class=\"bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 font-semibold\">Xoá phương tiện</button>\n                        </div>\n                    </div>\n                    <!-- Answer Image -->\n                    <div class=\"flex-1\">\n                        <div class=\"relative\">\n                            <div\n                                id=\"acceleration_answer_container" + (_0x5e37d1 + 0x1) + "\"\n                                class=\"w-full h-[40vh] border border-slate-200 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center\"\n                            >\n                                <div class=\"text-center\" id=\"acceleration_answer_placeholder" + (_0x5e37d1 + 0x1) + "\">\n                                    <span class=\"material-icons text-4xl text-gray-400 mb-2\">image</span>\n                                    <p class=\"text-gray-500 dark:text-gray-400\">Chưa có hình ảnh đáp án</p>\n                                </div>\n                                <img id=\"acceleration_answer_image" + (_0x5e37d1 + 0x1) + "\" class=\"w-full h-full object-contain rounded-lg hidden\" alt=\"Answer Image\">\n                            </div>\n                        </div>\n                        <div class=\"flex space-x-2 mt-2\">\n                            <input type=\"file\" id=\"upload_answer_image" + (_0x5e37d1 + 0x1) + "\" class=\"hidden\" accept=\"image/*\">\n                            <label for=\"upload_answer_image" + (_0x5e37d1 + 0x1) + "\" class=\"cursor-pointer bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 font-semibold\">Tải lên</label>\n                            <button id=\"delete_answer_image" + (_0x5e37d1 + 0x1) + "\" class=\"bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 font-semibold\">Xoá hình ảnh</button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ";
          _0x15253b.innerHTML += _0x2430fb;
        });
        _0x4ed7ee.appendChild(_0x15253b);
        _0xfe0cd.forEach((_0xa0adf1, _0x34d9ba) => {
          _0x49e6ea(_0xa0adf1, _0x34d9ba + 0x1);
          const _0x17d9e5 = document.getElementById("upload_question_media" + (_0x34d9ba + 0x1));
          if (_0x17d9e5) {
            _0x17d9e5.addEventListener("change", async _0x5298fb => {
              const _0x97b10 = _0x5298fb.target.files[0x0];
              if (_0x97b10) {
                await _0x3b0807(_0x97b10, _0xa0adf1, _0x34d9ba + 0x1);
              }
            });
          }
          const _0x2edbe0 = document.getElementById('delete_question_media' + (_0x34d9ba + 0x1));
          if (_0x2edbe0) {
            _0x2edbe0.addEventListener("click", async () => {
              await _0x5560fd(_0xa0adf1, _0x34d9ba + 0x1);
            });
          }
          const _0x466519 = document.getElementById('upload_answer_image' + (_0x34d9ba + 0x1));
          if (_0x466519) {
            _0x466519.addEventListener("change", async _0x31048f => {
              const _0x4afde7 = _0x31048f.target.files[0x0];
              if (_0x4afde7) {
                await _0x33949e(_0x4afde7, _0x34d9ba + 0x1);
              }
            });
          }
          const _0x15c2f3 = document.getElementById("delete_answer_image" + (_0x34d9ba + 0x1));
          if (_0x15c2f3) {
            _0x15c2f3.addEventListener("click", async () => {
              await _0x4c9952(_0x34d9ba + 0x1);
            });
          }
        });
      });
      async function _0x49e6ea(_0x3a15d5, _0x56fe8d) {
        if (!mediaDatabase) {
          return;
        }
        try {
          const _0xc973e3 = ["image", 'video', "audio"];
          for (const _0xde8c31 of _0xc973e3) {
            const _0x3258fb = await _0x39eaaa('AccelerationQuestion', _0x3a15d5, '1', _0xde8c31);
            if (_0x3258fb) {
              _0x33ad93(_0x3258fb, _0x56fe8d, _0xde8c31);
            }
          }
          const _0x1c165a = await _0x39eaaa('AccelerationQuestion', _0x3a15d5, "answer", "image");
          if (_0x1c165a) {
            _0x345f14(_0x1c165a, _0x56fe8d);
          }
          if (!(await _0xaa3467(_0x3a15d5))) {
            _0x504d49(_0x56fe8d);
          }
        } catch (_0x120205) {
          console.error("Error loading acceleration media:", _0x120205);
          _0x504d49(_0x56fe8d);
        }
      }
      async function _0xaa3467(_0x141f41) {
        if (!mediaDatabase) {
          return false;
        }
        return new Promise(_0x46152f => {
          mediaDatabase.once("value", _0x4435a5 => {
            const _0x54616d = _0x4435a5.val() || {};
            const _0x5555ee = Object.values(_0x54616d).some(_0x155aa8 => _0x155aa8.competition === 'AccelerationQuestion' && _0x155aa8.pack === _0x141f41 && _0x155aa8.questionNumber === '1');
            _0x46152f(_0x5555ee);
          });
        });
      }
      async function _0x39eaaa(_0x36ea5a, _0x4ce3f8, _0x346f55, _0x51bed6 = null) {
        if (!mediaDatabase) {
          return null;
        }
        return new Promise(_0x10646b => {
          mediaDatabase.once("value", _0x19ca82 => {
            const _0x92631 = _0x19ca82.val() || {};
            const _0x79ccea = Object.values(_0x92631).find(_0x596702 => _0x596702.competition === _0x36ea5a && _0x596702.pack === _0x4ce3f8 && _0x596702.questionNumber.toString() === _0x346f55.toString() && (!_0x51bed6 || _0x596702.mediaType === _0x51bed6));
            _0x10646b(_0x79ccea || null);
          });
        });
      }
      function _0x33ad93(_0x5050ab, _0x24b643, _0x3afd0b) {
        const _0x48451f = document.getElementById("acceleration_question_video" + _0x24b643);
        const _0x1a0922 = document.getElementById('acceleration_question_source' + _0x24b643);
        const _0x40571c = document.getElementById("acceleration_question_placeholder" + _0x24b643);
        if (!_0x48451f) {
          return;
        }
        if (_0x3afd0b === "video") {
          if (_0x1a0922) {
            _0x1a0922.src = _0x5050ab.downloadURL;
          }
          _0x48451f.src = _0x5050ab.downloadURL;
          _0x48451f.poster = '';
          _0x48451f.setAttribute("controls", '');
          _0x48451f.style.display = 'block';
          if (_0x40571c) {
            _0x40571c.style.display = "none";
          }
          _0x48451f.load();
        } else {
          if (_0x3afd0b === "image") {
            _0x48451f.poster = _0x5050ab.downloadURL;
            _0x48451f.src = '';
            if (_0x1a0922) {
              _0x1a0922.src = '';
            }
            _0x48451f.removeAttribute("controls");
            _0x48451f.style.display = 'block';
            if (_0x40571c) {
              _0x40571c.style.display = "none";
            }
          }
        }
      }
      function _0x345f14(_0x14764f, _0x1d089b) {
        const _0x4dbfa9 = document.getElementById('acceleration_answer_image' + _0x1d089b);
        const _0x3a1cb6 = document.getElementById("acceleration_answer_placeholder" + _0x1d089b);
        if (_0x4dbfa9 && _0x14764f.mediaType === 'image') {
          _0x4dbfa9.src = _0x14764f.downloadURL;
          _0x4dbfa9.classList.remove('hidden');
          if (_0x3a1cb6) {
            _0x3a1cb6.style.display = "none";
          }
        }
      }
      async function _0x3b0807(_0x10da92, _0x14a4d3, _0x390324) {
        try {
          const _0x424eee = _0x10da92.name.split('.').pop().toLowerCase();
          let _0x5c0c5a;
          if (['mp4', "webm", "mov"].includes(_0x424eee)) {
            _0x5c0c5a = "video";
          } else {
            if (["jpg", "jpeg", "png", 'gif', "webp"].includes(_0x424eee)) {
              _0x5c0c5a = 'image';
            } else {
              if (['mp3', "wav", 'ogg'].includes(_0x424eee)) {
                _0x5c0c5a = "audio";
              } else {
                failToast("Định dạng file không được hỗ trợ");
                return;
              }
            }
          }
          const _0x552e48 = _0x10da92.size / 1048576;
          if (_0x5c0c5a === "video" && _0x552e48 > 100) {
            failToast("Kích thước video không được vượt quá 100MB.");
            return;
          }
          if (_0x5c0c5a === "image" && _0x552e48 > 10) {
            failToast("Kích thước hình ảnh không được vượt quá 10MB.");
            return;
          }
          if (_0x5c0c5a === "audio" && _0x552e48 > 20) {
            failToast("Kích thước âm thanh không được vượt quá 20MB.");
            return;
          }
          successToast("Đang tải lên " + (_0x5c0c5a === "video" ? 'video' : _0x5c0c5a === "image" ? "hình ảnh" : "âm thanh") + "...");
          const _0x5046af = Date.now();
          const _0x4155b6 = "AccelerationQuestion_" + _0x14a4d3 + "_1_" + _0x5c0c5a + '_' + _0x5046af;
          const folder = currentMatchId + "/question_media";
          const uploadResult = await window.cloudinaryService.uploadFile(_0x10da92, {
            folder: folder,
            publicId: _0x4155b6
          });
          const _0x140897 = uploadResult.url;
          await _0xd338cc(_0x14a4d3);
          const _0x303480 = {
            'competition': "AccelerationQuestion",
            'pack': _0x14a4d3,
            'questionNumber': '1',
            'mediaType': _0x5c0c5a,
            'fileName': _0x4155b6,
            'downloadURL': _0x140897,
            'uploadDate': _0x5046af
          };
          const _0x2ef1f3 = realtimeDB.ref(currentMatchId + '/QuestionMedia');
          const _0x23c22e = _0x2ef1f3.push();
          await _0x23c22e.set(_0x303480);
          _0x33ad93(_0x303480, _0x390324, _0x5c0c5a);
          await _0x374fd6(_0x390324);
          successToast("Tải lên " + (_0x5c0c5a === "video" ? "video" : _0x5c0c5a === "image" ? "hình ảnh" : "âm thanh") + " thành công");
          if (typeof loadMediaData === "function") {
            loadMediaData();
          }
        } catch (_0x30a39f) {
          console.error("Error uploading acceleration question media:", _0x30a39f);
          failToast("Tải lên thất bại");
        }
      }
      async function _0xd338cc(_0x58f5b7) {
        if (!mediaDatabase) {
          return;
        }
        return new Promise(_0x128fbb => {
          mediaDatabase.once("value", async _0x8d78e0 => {
            const _0x1622b4 = _0x8d78e0.val() || {};
            const _0x3aa658 = Object.entries(_0x1622b4).filter(([_0x56c44a, _0x2f7c52]) => _0x2f7c52.competition === "AccelerationQuestion" && _0x2f7c52.pack === _0x58f5b7 && _0x2f7c52.questionNumber === '1').map(async ([_0x567e9a, _0x38c0e1]) => {
              try {
                const _0x203bd3 = window.cloudinaryService.ref(currentMatchId + "/question_media/" + _0x38c0e1.fileName);
                await _0x203bd3['delete']();
                await mediaDatabase.child(_0x567e9a).remove();
              } catch (_0x38940d) {
                console.error("Error deleting media " + _0x38c0e1.fileName + ':', _0x38940d);
              }
            });
            await Promise.all(_0x3aa658);
            _0x128fbb();
          });
        });
      }
      async function _0x5560fd(_0x44a603, _0x55cfa7) {
        try {
          await _0xd338cc(_0x44a603);
          const _0x2d2ee3 = document.getElementById('acceleration_question_video' + _0x55cfa7);
          const _0x953655 = document.getElementById('acceleration_question_source' + _0x55cfa7);
          const _0xd5ad40 = document.getElementById("acceleration_question_placeholder" + _0x55cfa7);
          if (_0x2d2ee3) {
            _0x2d2ee3.poster = '';
            _0x2d2ee3.src = '';
            if (_0x953655) {
              _0x953655.src = '';
            }
            _0x2d2ee3.removeAttribute("controls");
            _0x2d2ee3.style.display = "none";
          }
          if (_0xd5ad40) {
            _0xd5ad40.style.display = "flex";
          }
          await _0x374fd6(_0x55cfa7);
          successToast("Xoá phương tiện thành công");
          if (typeof loadMediaData === "function") {
            loadMediaData();
          }
        } catch (_0x549de1) {
          console.error("Error deleting acceleration question media:", _0x549de1);
          failToast("Lỗi khi xoá phương tiện");
        }
      }
      async function _0x33949e(_0xe165d0, _0x1ae416) {
        try {
          const _0x3dd7a7 = _0xe165d0.size / 1048576;
          if (_0x3dd7a7 > 10) {
            failToast("Kích thước tệp không được vượt quá 10MB.");
            return;
          }
          const _0x5bcd5d = _0xe165d0.name.split('.').pop().toLowerCase();
          if (!["jpg", "jpeg", "png", "gif", 'webp'].includes(_0x5bcd5d)) {
            failToast("Định dạng file không được hỗ trợ. Chỉ hỗ trợ: jpg, jpeg, png, gif, webp");
            return;
          }
          successToast("Đang tải lên hình ảnh đáp án...");
          const _0x4c4cd5 = ["QS1", "QS2", "QS3", "QS4"];
          const _0x227792 = _0x4c4cd5[_0x1ae416 - 0x1];
          if (!_0x227792) {
            failToast("Chỉ số câu hỏi không hợp lệ");
            return;
          }
          const _0x12896a = Date.now();
          const _0x216d50 = 'AccelerationQuestion_' + _0x227792 + '_answer_image_' + _0x12896a;
          const folder = currentMatchId + "/question_media";
          const uploadResult = await window.cloudinaryService.uploadFile(_0xe165d0, {
            folder: folder,
            publicId: _0x216d50
          });
          const _0x4bfc91 = uploadResult.url;
          await _0x273516(_0x227792);
          const _0xa41b5c = {
            'competition': 'AccelerationQuestion',
            'pack': _0x227792,
            'questionNumber': "answer",
            'mediaType': "image",
            'fileName': _0x216d50,
            'downloadURL': _0x4bfc91,
            'uploadDate': _0x12896a
          };
          const _0x457c7b = realtimeDB.ref(currentMatchId + "/QuestionMedia");
          const _0x34fbd9 = _0x457c7b.push();
          await _0x34fbd9.set(_0xa41b5c);
          const _0x313a95 = document.getElementById("acceleration_answer_image" + _0x1ae416);
          const _0x2a3d8a = document.getElementById("acceleration_answer_placeholder" + _0x1ae416);
          if (_0x313a95) {
            _0x313a95.src = _0x4bfc91;
            _0x313a95.classList.remove("hidden");
          }
          if (_0x2a3d8a) {
            _0x2a3d8a.style.display = "none";
          }
          await _0x38895b(_0x1ae416);
          successToast("Tải lên hình ảnh đáp án thành công.");
          if (typeof loadMediaData === "function") {
            loadMediaData();
          }
        } catch (_0x3ae0fd) {
          console.error("Error uploading answer image:", _0x3ae0fd);
          failToast("Lỗi khi tải lên hình ảnh đáp án.");
        }
      }
      async function _0x4c9952(_0x1ad75b) {
        try {
          const _0x53792c = ["QS1", "QS2", "QS3", "QS4"];
          const _0x9c9111 = _0x53792c[_0x1ad75b - 0x1];
          if (!_0x9c9111) {
            failToast("Chỉ số câu hỏi không hợp lệ");
            return;
          }
          await _0x273516(_0x9c9111);
          const _0x302092 = document.getElementById("acceleration_answer_image" + _0x1ad75b);
          const _0xf7ec08 = document.getElementById("acceleration_answer_placeholder" + _0x1ad75b);
          if (_0x302092) {
            _0x302092.src = '';
            _0x302092.classList.add("hidden");
          }
          if (_0xf7ec08) {
            _0xf7ec08.style.display = "flex";
          }
          await _0x38895b(_0x1ad75b);
          successToast("Đã xoá hình ảnh đáp án thành công.");
          if (typeof loadMediaData === "function") {
            loadMediaData();
          }
        } catch (_0x31062a) {
          console.error("Error deleting answer image:", _0x31062a);
          failToast("Lỗi khi xoá hình ảnh đáp án");
        }
      }
      async function _0x273516(_0x53c114) {
        try {
          const _0x264a4f = realtimeDB.ref(currentMatchId + "/QuestionMedia");
          const _0x175475 = await _0x264a4f.once("value");
          const _0x4825aa = _0x175475.val();
          if (_0x4825aa) {
            for (const [_0x560bb3, _0x383d3b] of Object.entries(_0x4825aa)) {
              if (_0x383d3b.competition === "AccelerationQuestion" && _0x383d3b.pack === _0x53c114 && _0x383d3b.questionNumber === "answer") {
                try {
                  const _0x1827a1 = window.cloudinaryService.ref(currentMatchId + "/question_media/" + _0x383d3b.fileName);
                  await _0x1827a1["delete"]();
                } catch (_0x54bf1e) {
                  console.warn("Failed to delete storage file: " + _0x383d3b.fileName, _0x54bf1e);
                }
                await _0x264a4f.child(_0x560bb3).remove();
              }
            }
          }
        } catch (_0x228bcf) {
          console.error("Error removing existing acceleration answer media:", _0x228bcf);
        }
      }
      async function _0x38895b(_0x26539c) {
        try {
          const _0x68e003 = window.cloudinaryService.ref(currentMatchId + "/tt/datt" + _0x26539c + "/tt" + _0x26539c + ".jpg");
          await _0x68e003["delete"]();
        } catch (_0x41902b) {
          console.log("Legacy answer image cleanup: " + _0x41902b.message);
        }
      }
      function _0x504d49(_0x130a3a) {
        // Legacy file check disabled - Cloudinary doesn't support direct getDownloadURL
        // Users should re-upload files using the new system
        console.log("Legacy file check skipped for acceleration " + _0x130a3a);
      }
      async function _0x374fd6(_0xd5c761) {
        try {
          const _0x37572a = window.cloudinaryService.ref(currentMatchId + "/tt/tt" + _0xd5c761 + "/tt" + _0xd5c761 + ".mp4");
          const _0xc13934 = window.cloudinaryService.ref(currentMatchId + '/tt/tt' + _0xd5c761 + '/tt' + _0xd5c761 + '.jpg');
          await Promise.allSettled([_0x37572a["delete"]()["catch"](() => {}), _0xc13934["delete"]()["catch"](() => {})]);
        } catch (_0x5a978a) {
          console.log("Legacy cleanup completed with some errors:", _0x5a978a);
        }
      }
      _0x3c3256.on("value", _0x102b57 => {
        const _0x5c25d1 = _0x102b57.val();
        if (!_0x5c25d1) {
          return;
        }
        const _0x2e55db = document.getElementById("questionsContainerFinish");
        _0x2e55db.innerHTML = '';
        const _0x3f99e1 = getPlayerLimit();
        const _0x6c76a = [];
        for (let _0x207658 = 0x1; _0x207658 <= _0x3f99e1; _0x207658++) {
          _0x6c76a.push('Q' + _0x207658 + 'DB');
        }
        _0x6c76a.forEach((_0x269b1b, _0xd4039) => {
          const _0x170f1f = _0x5c25d1[_0x269b1b] || {};
          const _0x4532eb = document.createElement("div");
          _0x4532eb.classList.add("mx-auto", "bg-white", 'dark:bg-neutral-800', "mt-2", "border", 'border-slate-200', "rounded-md", "p-4");
          _0x4532eb.innerHTML = "\n                <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-2\">Gói câu hỏi " + (_0xd4039 + 0x1) + "</p>\n                ";
          const _0x1369c6 = ['10', '20', '30'];
          _0x1369c6.forEach(_0x1f0fe3 => {
            const _0x582d47 = 'QP' + _0x1f0fe3;
            const _0x2a1c79 = _0x170f1f[_0x582d47] || {};
            const _0x1a12ef = document.createElement("div");
            _0x1a12ef.classList.add("mt-4", "space-y-4");
            _0x1a12ef.innerHTML = "\n                        <p class=\"text-lg text-slate-700 font-medium dark:text-slate-300\">Câu hỏi " + _0x1f0fe3 + " điểm</p>\n                    ";
            for (let _0x995b9 = 0x1; _0x995b9 <= 0x3; _0x995b9++) {
              const _0x45ef5d = _0x995b9.toString();
              const _0x22d81f = _0x2a1c79[_0x45ef5d] || {};
              const _0x28592c = _0x22d81f?.["cauhoi"] || '';
              const _0x4fd0a1 = _0x22d81f?.["dapan"] || '';
              const _0x226f8a = "\n                            <div class=\"flex items-center space-x-4\">\n                                <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Câu hỏi " + _0x995b9 + ":</label>\n                                <textarea\n                                    class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                    placeholder=\"Nhập câu hỏi...\"\n                                    rows=\"1\"\n                                    id=\"finish_pack" + (_0xd4039 + 0x1) + '_points' + _0x1f0fe3 + "_question" + _0x995b9 + "\"\n                                >" + _0x28592c + "</textarea>\n                                <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200\">Đáp án:</label>\n                                <textarea\n                                    class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                                    placeholder=\"Nhập đáp án...\"\n                                    rows=\"1\"\n                                    id=\"finish_pack" + (_0xd4039 + 0x1) + "_points" + _0x1f0fe3 + "_answer" + _0x995b9 + "\"\n                                >" + _0x4fd0a1 + "</textarea>\n                                <div class=\"flex space-x-2\">\n                                    <button onclick=\"addMediaToQuestion('FinishQuestion', '" + _0x269b1b + "', '" + _0x582d47 + '_' + _0x45ef5d + "', 'image')\" \n                                            class=\"media-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                            title=\"Thêm hình ảnh\">\n                                        <span class=\"material-icons text-sm\">image</span>\n                                    </button>\n                                    <button onclick=\"addMediaToQuestion('FinishQuestion', '" + _0x269b1b + "', '" + _0x582d47 + '_' + _0x45ef5d + "', 'audio')\" \n                                            class=\"media-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                            title=\"Thêm âm thanh\">\n                                        <span class=\"material-icons text-sm\">audiotrack</span>\n                                    </button>\n                                </div>\n                            </div>\n                        ";
              _0x1a12ef.innerHTML += _0x226f8a;
            }
            _0x4532eb.appendChild(_0x1a12ef);
          });
          _0x2e55db.appendChild(_0x4532eb);
          // Legacy file check disabled - Cloudinary doesn't support direct getDownloadURL
          // Users should re-upload files using the new system  
          console.log("Legacy video check skipped for finish pack " + (_0xd4039 + 0x1));
          const _0xa86b7f = document.getElementById("upload_finish_video" + (_0xd4039 + 0x1));
          if (_0xa86b7f) {
            _0xa86b7f.addEventListener("change", async _0x22dd55 => {
              const _0x2cd8a6 = _0x22dd55.target.files[0x0];
              if (_0x2cd8a6) {
                if (_0x2cd8a6.type !== "video/mp4") {
                  failToast("Chỉ hỗ trợ định dạng .mp4");
                  return;
                }
                const _0x548641 = _0x2cd8a6.size / 1048576;
                if (_0x548641 > 100) {
                  failToast("Kích thước video không được vượt quá 100MB.");
                  return;
                }
                try {
                  const folder = _0x548bc5 + "/vd/vd" + (_0xd4039 + 0x1);
                  const publicId = "vd";
                  const uploadResult = await window.cloudinaryService.uploadFile(_0x2cd8a6, {
                    folder: folder,
                    publicId: publicId
                  });
                  const _0x4774f3 = uploadResult.url;
                  const _0x37b0a7 = document.getElementById("finish_video" + (_0xd4039 + 0x1));
                  const _0x380b66 = document.getElementById("finish_video_source" + (_0xd4039 + 0x1));
                  if (_0x380b66) {
                    _0x380b66.src = _0x4774f3;
                    if (_0x37b0a7) {
                      _0x37b0a7.load();
                    }
                  }
                  successToast("Tải lên video thành công.");
                } catch (_0x1b0745) {
                  console.error("Error uploading video:", _0x1b0745);
                  failToast("Tải lên video thất bại.");
                }
              }
            });
          }
          const _0x3c36a8 = document.getElementById("delete_finish_video" + (_0xd4039 + 0x1));
          if (_0x3c36a8) {
            _0x3c36a8.addEventListener("click", async () => {
              try {
                const _0x7e0912 = window.cloudinaryService.ref(_0x548bc5 + "/vd/vd" + (_0xd4039 + 0x1) + "/vd.mp4");
                await _0x7e0912['delete']();
                const _0x37a414 = document.getElementById("finish_video" + (_0xd4039 + 0x1));
                const _0x190500 = document.getElementById("finish_video_source" + (_0xd4039 + 0x1));
                if (_0x190500) {
                  _0x190500.src = '';
                  if (_0x37a414) {
                    _0x37a414.load();
                  }
                }
                successToast("Xoá video thành công");
              } catch (_0x57b859) {
                console.error("Error deleting video:", _0x57b859);
                failToast("Lỗi khi xoá video");
              }
            });
          }
        });
      });
      _0x1e179d.on('value', _0x1ca802 => {
        const _0x4c5fed = _0x1ca802.val();
        console.log(_0x4c5fed);
        if (!_0x4c5fed) {
          return;
        }
        const _0x4d363e = document.getElementById('questionsContainerAdditional');
        _0x4d363e.innerHTML = '';
        const _0x366291 = document.createElement("div");
        _0x366291.classList.add("mx-auto", 'bg-white', 'dark:bg-neutral-800', "mt-2", "border", "border-slate-200", "rounded-md", "p-4");
        _0x366291.innerHTML = "\n                <p class=\"text-2xl text-slate-800 font-semibold dark:text-white my-4\">Câu hỏi phụ</p>\n            ";
        for (let _0x5e86d0 = 0x1; _0x5e86d0 <= 0xa; _0x5e86d0++) {
          const _0x5b5a3a = _0x4c5fed['cau' + _0x5e86d0] || '';
          const _0x106bcf = _0x4c5fed["dacau" + _0x5e86d0] || '';
          const _0x5c2a6c = "\n                    <div class=\"flex items-center space-x-4 mb-4\">\n                        <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Câu hỏi " + _0x5e86d0 + ":</label>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập câu hỏi...\" rows=\"1\" id=\"additional_question" + _0x5e86d0 + "\">" + _0x5b5a3a + "</textarea>\n                        <label class=\"text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap\">Đáp án:</label>\n                        <textarea\n                            class=\"flex-1 bg-white dark:bg-neutral-700 placeholder:text-slate-400 dark:placeholder:text-gray-400 text-slate-700 dark:text-white text-sm border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:border-slate-300 dark:hover:border-neutral-500 shadow-sm h-10\"\n                            placeholder=\"Nhập đáp án...\" rows=\"1\" id=\"additional_answer" + _0x5e86d0 + "\">" + _0x106bcf + "</textarea>\n                        <div class=\"flex space-x-2\">\n                            <button onclick=\"addMediaToQuestion('CHPQuestion', 'additional', " + _0x5e86d0 + ", 'image')\" \n                                    class=\"media-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                    title=\"Thêm hình ảnh\">\n                                <span class=\"material-icons text-sm\">image</span>\n                            </button>\n                            <button onclick=\"addMediaToQuestion('CHPQuestion', 'additional', " + _0x5e86d0 + ", 'audio')\" \n                                    class=\"media-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors\" \n                                    title=\"Thêm âm thanh\">\n                                <span class=\"material-icons text-sm\">audiotrack</span>\n                            </button>\n                        </div>\n                    </div>\n                ";
          _0x366291.innerHTML += _0x5c2a6c;
        }
        _0x4d363e.appendChild(_0x366291);
      });
    });
  });
  let currentMatchId = null;
  let mediaDatabase = null;
  auth.onAuthStateChanged(_0xb52460 => {
    if (_0xb52460) {
      const _0x3eea8f = firestoreDB.collection('match').doc(auth.currentUser.uid);
      _0x3eea8f.onSnapshot(_0x324a14 => {
        if (_0x324a14.exists) {
          currentMatchId = _0x324a14.data().match;
          mediaDatabase = realtimeDB.ref(currentMatchId + "/QuestionMedia");
          initializeMediaContainer();
          loadMediaData();
        }
      });
    }
  });
  function addMediaToQuestion(_0x560e7d, _0x28c65a, _0x25dbc6, _0x4db062) {
    const _0x48d75c = document.createElement("input");
    _0x48d75c.type = "file";
    switch (_0x4db062) {
      case "image":
        _0x48d75c.accept = "image/*";
        break;
      case "audio":
        _0x48d75c.accept = "audio/*";
        break;
      case "video":
        _0x48d75c.accept = "video/*";
        break;
      default:
        _0x48d75c.accept = "image/*,audio/*,video/*";
    }
    _0x48d75c.onchange = async _0x19d217 => {
      const _0x37a8db = _0x19d217.target.files[0x0];
      if (!_0x37a8db) {
        return;
      }
      try {
        const _0x5e834b = _0x37a8db.size / 1048576;
        if (_0x4db062 === "video" && _0x5e834b > 100) {
          failToast("Kích thước video không được vượt quá 100MB.");
          return;
        }
        if (_0x4db062 === "image" && _0x5e834b > 10) {
          failToast("Kích thước hình ảnh không được vượt quá 10MB.");
          return;
        }
        if (_0x4db062 === "audio" && _0x5e834b > 20) {
          failToast("Kích thước âm thanh không được vượt quá 20MB.");
          return;
        }
        successToast("Đang tải lên " + getMediaTypeDisplayName(_0x4db062) + "...");
        const _0x3dd391 = Date.now();
        const _0x588dd2 = _0x560e7d + '_' + _0x28c65a + '_' + _0x25dbc6 + '_' + _0x4db062 + '_' + _0x3dd391;
        const folder = currentMatchId + "/question_media";
        const uploadResult = await window.cloudinaryService.uploadFile(_0x37a8db, {
          folder: folder,
          publicId: _0x588dd2
        });
        const _0x2821b2 = uploadResult.url;
        if (_0x560e7d === 'AccelerationQuestion' && _0x25dbc6 === '1') {
          await removeExistingAccelerationMedia(_0x28c65a, _0x4db062);
        }
        const _0x4766f9 = {
          'competition': _0x560e7d,
          'pack': _0x28c65a,
          'questionNumber': _0x25dbc6,
          'mediaType': _0x4db062,
          'fileName': _0x588dd2,
          'downloadURL': _0x2821b2,
          'uploadDate': _0x3dd391
        };
        const _0x954cea = mediaDatabase.push();
        await _0x954cea.set(_0x4766f9);
        successToast("Đã thêm " + getMediaTypeDisplayName(_0x4db062) + " cho câu hỏi thành công");
        loadMediaData();
        if (_0x560e7d === "AccelerationQuestion") {
          const _0x34666a = parseInt(_0x28c65a.replace('QS', ''));
          loadAccelerationMedia(_0x28c65a, _0x34666a);
        }
      } catch (_0x11b9d8) {
        console.error("Error uploading media:", _0x11b9d8);
        failToast("Lỗi khi tải lên phương tiện");
      }
    };
    _0x48d75c.click();
  }
  function getMediaTypeDisplayName(_0xac98f) {
    const _0x5686e5 = {
      'image': "hình ảnh",
      'audio': "âm thanh",
      'video': "video"
    };
    return _0x5686e5[_0xac98f] || "phương tiện";
  }
  async function removeExistingAccelerationMedia(_0x145de8, _0x5d6129) {
    if (!mediaDatabase) {
      return;
    }
    return new Promise(_0x9e7254 => {
      mediaDatabase.once("value", async _0x4d8fdb => {
        const _0x42f546 = _0x4d8fdb.val() || {};
        const _0xe9c471 = Object.entries(_0x42f546).filter(([_0x374e93, _0x1b929c]) => _0x1b929c.competition === "AccelerationQuestion" && _0x1b929c.pack === _0x145de8 && _0x1b929c.questionNumber === '1' && _0x1b929c.mediaType === _0x5d6129).map(async ([_0x12b724, _0x116bc3]) => {
          try {
            const _0x3eea90 = window.cloudinaryService.ref(currentMatchId + '/question_media/' + _0x116bc3.fileName);
            await _0x3eea90["delete"]();
            await mediaDatabase.child(_0x12b724).remove();
          } catch (_0x523cd7) {
            console.error("Error deleting media " + _0x116bc3.fileName + ':', _0x523cd7);
          }
        });
        await Promise.all(_0xe9c471);
        _0x9e7254();
      });
    });
  }
  function initializeMediaContainer() {
    const _0x49eced = document.getElementById("mediaContainer");
    if (!_0x49eced) {
      return;
    }
    _0x49eced.innerHTML = "\n        <div class=\"relative flex flex-col mt-2 bg-white shadow-sm border border-slate-200 rounded-lg p-6 space-y-4 dark:bg-neutral-800\">\n            <div class=\"flex justify-between items-center\">\n                <h2 class=\"text-2xl text-slate-800 font-semibold dark:text-white\">Quản lý phương tiện</h2>\n            </div>\n            \n            <!-- Filter Section -->\n            <div class=\"flex flex-wrap gap-4 items-center\">\n                <div class=\"flex-1 min-w-[200px]\">\n                    <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2\">Lọc theo phần thi:</label>\n                    <select id=\"mediaFilterCompetition\" onchange=\"loadMediaData()\" \n                            class=\"w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-slate-700 dark:text-white\">\n                        <option value=\"\">Tất cả</option>\n                        <option value=\"StartQuestion\">Khởi động I</option>\n                        <option value=\"KDO22Question\">Khởi động II</option>\n                        <option value=\"VCNVQuestion\">Vượt chướng ngại vật</option>\n                           <option value=\"AccelerationQuestion\">Tăng tốc</option>\n                        <option value=\"FinishQuestion\">Về đích</option>\n                        <option value=\"CHPQuestion\">Câu hỏi phụ</option>\n                    </select>\n                </div>\n                \n                <div class=\"flex-1 min-w-[200px]\">\n                    <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2\">Lọc theo loại:</label>\n                    <select id=\"mediaFilterType\" onchange=\"loadMediaData()\" \n                            class=\"w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-slate-700 dark:text-white\">\n                        <option value=\"\">Tất cả</option>\n                        <option value=\"image\">Hình ảnh</option>\n                        <option value=\"audio\">Âm thanh</option>\n                        <option value=\"video\">Video</option>\n                    </select>\n                </div>\n            </div>\n            \n            <!-- Media List -->\n            <div id=\"mediaList\" class=\"space-y-4\">\n                <!-- Media items will be loaded here -->\n            </div>\n        </div>\n        \n        <!-- Add Media Modal -->\n        <div id=\"addMediaModal\" class=\"fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50\">\n            <div class=\"bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4\">\n                <h3 class=\"text-xl font-semibold text-slate-800 dark:text-white mb-4\">Thêm phương tiện mới</h3>\n                \n                <div class=\"space-y-4\">\n                    <div>\n                        <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2\">Phần thi:</label>\n                        <select id=\"modalCompetition\" \n                                class=\"w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-slate-700 dark:text-white\">\n                            <option value=\"StartQuestion\">Khởi động I</option>\n                            <option value=\"KDO22Question\">Khởi động II</option>\n                            <option value=\"VCNVQuestion\">Vượt chướng ngại vật</option>\n                            <option value=\"AccelerationQuestion\">Tăng tốc</option>\n                            <option value=\"FinishQuestion\">Về đích</option>\n                            <option value=\"CHPQuestion\">Câu hỏi phụ</option>\n                        </select>\n                    </div>\n                    \n                    <div>\n                        <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2\">Gói câu hỏi:</label>\n                        <input type=\"text\" id=\"modalPack\" placeholder=\"Ví dụ: Q1DB, L1, HN1, additional...\" \n                               class=\"w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-slate-700 dark:text-white\">\n                    </div>\n                    \n                    <div>\n                        <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2\">Số câu hỏi:</label>\n                        <input type=\"number\" id=\"modalQuestionNumber\" min=\"1\" value=\"1\" \n                               class=\"w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-slate-700 dark:text-white\">\n                    </div>\n                    \n                    <div>\n                        <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2\">Loại phương tiện:</label>\n                        <select id=\"modalMediaType\" \n                                class=\"w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-slate-700 dark:text-white\">\n                            <option value=\"image\">Hình ảnh</option>\n                            <option value=\"audio\">Âm thanh</option>\n                        </select>\n                    </div>\n                    \n                    <div>\n                        <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2\">Chọn file:</label>\n                        <input type=\"file\" id=\"modalFile\" \n                               class=\"w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg px-3 py-2 text-slate-700 dark:text-white\">\n                    </div>\n                </div>\n                \n                <div class=\"flex justify-end space-x-4 mt-6\">\n                    <button onclick=\"hideAddMediaModal()\" \n                            class=\"bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors\">\n                        Hủy\n                    </button>\n                    <button onclick=\"submitMediaModal()\" \n                            class=\"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors\">\n                        Thêm\n                    </button>\n                </div>\n            </div>\n        </div>\n    ";
  }
  function showAddMediaModal() {
    const _0x481aa8 = document.getElementById("addMediaModal");
    _0x481aa8.classList.remove('hidden');
    _0x481aa8.classList.add('flex');
    const _0x13b0f7 = document.getElementById("modalMediaType");
    const _0x4d2dcc = document.getElementById("modalFile");
    _0x13b0f7.onchange = () => {
      _0x4d2dcc.accept = _0x13b0f7.value === 'image' ? "image/*" : 'audio/*';
    };
    _0x4d2dcc.accept = "image/*";
  }
  function hideAddMediaModal() {
    const _0x1386da = document.getElementById("addMediaModal");
    _0x1386da.classList.add('hidden');
    _0x1386da.classList.remove("flex");
    document.getElementById("modalPack").value = '';
    document.getElementById("modalQuestionNumber").value = '1';
    document.getElementById('modalFile').value = '';
  }
  async function submitMediaModal() {
    const _0xc92b64 = document.getElementById("modalCompetition").value;
    const _0x3f8103 = document.getElementById('modalPack').value.trim();
    const _0x2a58b9 = document.getElementById("modalQuestionNumber").value;
    const _0x33a7e8 = document.getElementById("modalMediaType").value;
    const _0x29eb65 = document.getElementById('modalFile');
    const _0xc25029 = _0x29eb65.files[0x0];
    if (!_0x3f8103 || !_0xc25029) {
      failToast("Vui lòng điền đầy đủ thông tin và chọn file");
      return;
    }
    try {
      const _0x2a1b18 = Date.now();
      const _0x256f46 = _0xc92b64 + '_' + _0x3f8103 + '_' + _0x2a58b9 + '_' + _0x33a7e8 + '_' + _0x2a1b18;
      const folder = currentMatchId + '/question_media';
      const uploadResult = await window.cloudinaryService.uploadFile(_0xc25029, {
        folder: folder,
        publicId: _0x256f46
      });
      const _0x3d3a36 = uploadResult.url;
      const _0x392b1d = {
        'competition': _0xc92b64,
        'pack': _0x3f8103,
        'questionNumber': _0x2a58b9,
        'mediaType': _0x33a7e8,
        'fileName': _0x256f46,
        'downloadURL': _0x3d3a36,
        'uploadDate': _0x2a1b18
      };
      const _0x3f95e2 = mediaDatabase.push();
      await _0x3f95e2.set(_0x392b1d);
      successToast("Đã thêm " + (_0x33a7e8 === "image" ? "hình ảnh" : "âm thanh") + " thành công");
      hideAddMediaModal();
      loadMediaData();
    } catch (_0x2b364b) {
      console.error("Error uploading media:", _0x2b364b);
      failToast("Lỗi khi tải lên phương tiện");
    }
  }
  function loadMediaData() {
    if (!mediaDatabase) {
      return;
    }
    const _0x276641 = document.getElementById("mediaFilterCompetition")?.['value'] || '';
    const _0x5e17d3 = document.getElementById("mediaFilterType")?.["value"] || '';
    mediaDatabase.on("value", _0x41a621 => {
      const _0x137e33 = _0x41a621.val() || {};
      const _0x4abeb9 = document.getElementById("mediaList");
      if (!_0x4abeb9) {
        return;
      }
      const _0x545f9b = Object.entries(_0x137e33).filter(([_0x8c09d7, _0x4c363d]) => {
        const _0x230c80 = !_0x276641 || _0x4c363d.competition === _0x276641;
        const _0x13514e = !_0x5e17d3 || _0x4c363d.mediaType === _0x5e17d3;
        return _0x230c80 && _0x13514e;
      });
      if (_0x545f9b.length === 0x0) {
        _0x4abeb9.innerHTML = "\n                <div class=\"text-center py-8 text-slate-500 dark:text-slate-400\">\n                    Không có phương tiện nào\n                </div>\n            ";
        return;
      }
      _0x4abeb9.innerHTML = _0x545f9b.map(([_0x3135f5, _0x56a8d7]) => "\n            <div class=\"border border-slate-200 dark:border-neutral-600 rounded-lg p-4 bg-white dark:bg-neutral-700\">\n            <div class=\"flex items-center justify-between\">\n                <div class=\"flex-1\">\n                <div class=\"flex items-center space-x-4\">\n                    <div class=\"flex-shrink-0\">\n                    " + (_0x56a8d7.mediaType === "image" ? "<img src=\"" + _0x56a8d7.downloadURL + "\" alt=\"Media\" class=\"w-16 h-16 object-cover rounded-lg\">" : _0x56a8d7.mediaType === 'video' ? "<video src=\"" + _0x56a8d7.downloadURL + "\" class=\"w-16 h-16 object-cover rounded-lg\" controls></video>" : "<div class=\"w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center\">\n                         <span class=\"material-icons text-green-600 dark:text-green-400\">audiotrack</span>\n                           </div>") + "\n                    </div>\n                    <div class=\"flex-1\">\n                    <h4 class=\"font-medium text-slate-800 dark:text-white\">\n                        " + getCompetitionName(_0x56a8d7.competition) + " - " + _0x56a8d7.pack + " - Câu " + _0x56a8d7.questionNumber + "\n                    </h4>\n                    <p class=\"text-sm text-slate-500 dark:text-slate-400\">\n                        " + (_0x56a8d7.mediaType === "image" ? "Hình ảnh" : _0x56a8d7.mediaType === "video" ? "Video" : "Âm thanh") + " • \n                        " + new Date(_0x56a8d7.uploadDate).toLocaleDateString("vi-VN") + "\n                    </p>\n                    <p class=\"text-xs text-slate-400 dark:text-slate-500\">" + _0x56a8d7.fileName + "</p>\n                    </div>\n                </div>\n                </div>\n                <div class=\"flex space-x-2\">\n                <button onclick=\"previewMedia('" + _0x56a8d7.downloadURL + "', '" + _0x56a8d7.mediaType + "')\" \n                    class=\"bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors\">\n                    Xem\n                </button>\n                <button onclick=\"deleteMedia('" + _0x3135f5 + "', '" + _0x56a8d7.fileName + "')\" \n                    class=\"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors\">\n                    Xóa\n                </button>\n                </div>\n            </div>\n            </div>\n        ").join('');
      const _0x25d54e = Object.values(_0x137e33).filter(_0xccb464 => _0xccb464.competition === "VCNVQuestion" && _0xccb464.pack === "CNV" && _0xccb464.questionNumber === "background" && _0xccb464.mediaType === "image");
      if (_0x25d54e.length > 0x0) {
        const _0x51657a = _0x25d54e.sort((_0x1eb8a5, _0x5794b4) => _0x5794b4.uploadDate - _0x1eb8a5.uploadDate)[0x0];
        document.getElementById("ObstacleImage").src = _0x51657a.downloadURL;
      } else {
        document.getElementById('ObstacleImage').src = '';
      }
    });
  }
  function getCompetitionName(_0x3ee845) {
    const _0x468f6c = {
      'StartQuestion': "Khởi động I",
      'KDO22Question': "Khởi động II",
      'VCNVQuestion': "Vượt chướng ngại vật",
      'AccelerationQuestion': "Tăng tốc",
      'FinishQuestion': "Về đích",
      'CHPQuestion': "Câu hỏi phụ"
    };
    return _0x468f6c[_0x3ee845] || _0x3ee845;
  }
  function previewMedia(_0x16db6b, _0x3ce382) {
    if (_0x3ce382 === 'image') {
      window.open(_0x16db6b, '_blank');
    } else {
      const _0x1e4c15 = new Audio(_0x16db6b);
      _0x1e4c15.play();
    }
  }
  async function deleteMedia(_0x5db697, _0x518084) {
    if (!confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) {
      return;
    }
    try {
      const _0x24c593 = window.cloudinaryService.ref(currentMatchId + "/question_media/" + _0x518084);
      await _0x24c593['delete']();
      await mediaDatabase.child(_0x5db697).remove();
      successToast("Đã xóa phương tiện thành công");
      loadMediaData();
    } catch (_0x562831) {
      console.error("Error deleting media:", _0x562831);
      failToast("Lỗi khi xóa phương tiện");
    }
  }