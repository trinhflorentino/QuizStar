auth.onAuthStateChanged(_0x923b1e => {
    if (!_0x923b1e) {
      return;
    }
    const _0x4a4a18 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x4a4a18.onSnapshot(_0x89b05 => {
      if (!_0x89b05.exists) {
        return;
      }
      const _0x4b21ed = _0x89b05.data().match;
      const _0xcf514f = realtimeDB.ref(_0x4b21ed + '/QuestionMedia');
      const _0xcbd1e6 = realtimeDB.ref(_0x4b21ed + '/ClientFiles');
      window.mediaFilesList = [];
      window.currentMatchId = _0x4b21ed;
      _0xcf514f.on("value", _0x181394 => {
        const _0x23ee63 = _0x181394.val() || {};
        const _0x493b64 = Object.values(_0x23ee63);
        window.mediaFilesList = _0x493b64.map(_0x264906 => ({
          'id': _0x264906.fileName,
          'fileName': _0x264906.fileName,
          'downloadURL': _0x264906.downloadURL,
          'competition': _0x264906.competition,
          'pack': _0x264906.pack,
          'questionNumber': _0x264906.questionNumber,
          'mediaType': _0x264906.mediaType,
          'lastModified': _0x264906.uploadDate
        }));
        updateMediaStatusTable();
        const _0x80326f = realtimeDB.ref(_0x4b21ed + "/MediaUpdate");
        _0x80326f.set({
          'timestamp': Date.now(),
          'mediaCount': _0x493b64.length,
          'mediaList': window.mediaFilesList
        });
      });
      _0xcbd1e6.on("value", _0x51929f => {
        const _0x36f4c4 = _0x51929f.val() || {};
        window.clientFileStatus = _0x36f4c4;
        updateMediaStatusTable();
      });
      const _0x29a446 = () => {
        const _0x1ed51a = {};
        const _0x2627f9 = getPlayerLimit();
        for (let _0x2d2a44 = 0x1; _0x2d2a44 <= _0x2627f9; _0x2d2a44++) {
          _0x1ed51a["player" + _0x2d2a44] = {
            'lastSync': 0x0,
            'syncedFiles': {},
            'status': "disconnected"
          };
        }
        _0x1ed51a.technician_main = {
          'lastSync': 0x0,
          'syncedFiles': {},
          'status': "disconnected",
          'clientType': 'technician'
        };
        _0x1ed51a.projector_main = {
          'lastSync': 0x0,
          'syncedFiles': {},
          'status': "disconnected",
          'clientType': "projector"
        };
        _0xcbd1e6.set(_0x1ed51a);
      };
      _0xcbd1e6.once("value", _0x188a1f => {
        if (!_0x188a1f.exists()) {
          _0x29a446();
        }
      });
      initializeTechnicianSync(_0x4b21ed);
      let _0x184838 = realtimeDB.ref(_0x4b21ed + "/QuestionMedia");
      let _0x1e28a8 = null;
      window.getQuestionMedia = async function (_0x2894b7, _0x1e283c, _0xba7e8b) {
        if (!_0x184838) {
          return {
            'image': null,
            'audio': null
          };
        }
        return new Promise(_0x592dff => {
          _0x184838.once("value", _0x259c13 => {
            const _0x419859 = _0x259c13.val() || {};
            const _0x59e641 = {
              'image': null,
              'audio': null
            };
            console.log("Searching for media: " + _0x2894b7 + ", " + _0x1e283c + ", " + _0xba7e8b);
            console.log("Available media data:", Object.keys(_0x419859));
            Object.values(_0x419859).forEach(_0x180fbe => {
              if (_0x180fbe.competition === _0x2894b7 && _0x180fbe.pack === _0x1e283c && _0x180fbe.questionNumber.toString() === _0xba7e8b.toString()) {
                console.log("Found matching media:", _0x180fbe);
                if (_0x180fbe.mediaType === "image") {
                  _0x59e641.image = _0x180fbe;
                } else {
                  if (_0x180fbe.mediaType === "audio") {
                    _0x59e641.audio = _0x180fbe;
                  } else if (_0x180fbe.mediaType === "video") {
                    _0x59e641.video = _0x180fbe;
                  }
                }
              }
            });
            console.log("Media search result:", _0x59e641);
            _0x592dff(_0x59e641);
          });
        });
      };
      window.displayQuestionImage = async function (_0x3700a9, _0x5a5225, _0x4f9389) {
        if (!_0x3700a9 || !_0x5a5225) {
          if (_0x4f9389) {
            _0x4f9389.classList.add('hidden');
          }
          return;
        }
        try {
          console.log("Loading image: " + _0x3700a9.fileName);
          if (window.getFileFromIndexedDB) {
            const _0x49db42 = await window.getFileFromIndexedDB(_0x3700a9.fileName);
            if (_0x49db42) {
              const _0x3a5a16 = URL.createObjectURL(_0x49db42);
              _0x5a5225.src = _0x3a5a16;
              if (_0x4f9389) {
                _0x4f9389.classList.remove('hidden');
              }
              console.log("✓ Image loaded from IndexedDB: " + _0x3700a9.fileName);
              return;
            }
          }
          console.log("Falling back to Firebase for image: " + _0x3700a9.fileName);
          _0x5a5225.src = _0x3700a9.downloadURL;
          if (_0x4f9389) {
            _0x4f9389.classList.remove("hidden");
          }
        } catch (_0x34bf00) {
          console.error("Error loading image " + _0x3700a9.fileName + ':', _0x34bf00);
          if (_0x4f9389) {
            _0x4f9389.classList.add("hidden");
          }
        }
      };
      window.stopCurrentQuestionAudio = function (_0x33f536) {
        if (_0x1e28a8) {
          console.log("Stopping current question audio");
          _0x1e28a8.pause();
          _0x1e28a8.currentTime = 0x0;
          if (_0x1e28a8.src && _0x1e28a8.src.startsWith("blob:")) {
            URL.revokeObjectURL(_0x1e28a8.src);
          }
          _0x1e28a8 = null;
        }
      };
      window.playQuestionAudio = async function (_0x2d48e9, _0x629b8c) {
        if (!_0x2d48e9) {
          return;
        }
        window.stopCurrentQuestionAudio(_0x629b8c);
        try {
          console.log("Loading audio: " + _0x2d48e9.fileName);
          let _0x305355 = null;
          let _0x94d96b = false;
          if (window.getFileFromIndexedDB) {
            const _0x1c5d46 = await window.getFileFromIndexedDB(_0x2d48e9.fileName);
            if (_0x1c5d46) {
              _0x305355 = URL.createObjectURL(_0x1c5d46);
              _0x94d96b = true;
              console.log("✓ Audio loaded from IndexedDB: " + _0x2d48e9.fileName);
            }
          }
          if (!_0x305355 && _0x2d48e9.downloadURL) {
            _0x305355 = _0x2d48e9.downloadURL;
            _0x94d96b = false;
            console.log("Falling back to Firebase for audio: " + _0x2d48e9.fileName);
          }
          if (_0x305355) {
            _0x1e28a8 = new Audio(_0x305355);
            _0x1e28a8.addEventListener("ended", () => {
              console.log("Question audio ended");
              if (_0x94d96b && _0x305355.startsWith("blob:")) {
                URL.revokeObjectURL(_0x305355);
              }
              _0x1e28a8 = null;
            });
            _0x1e28a8.addEventListener("error", _0x548b7a => {
              console.error("Question audio error:", _0x548b7a);
              if (_0x94d96b && _0x305355.startsWith("blob:")) {
                URL.revokeObjectURL(_0x305355);
              }
              _0x1e28a8 = null;
            });
            await _0x1e28a8.play();
            console.log("✓ Question audio playing: " + _0x2d48e9.fileName);
          } else {
            console.warn("No audio URL available");
          }
        } catch (_0x5c9607) {
          console.error("Error playing audio " + _0x2d48e9.fileName + ':', _0x5c9607);
        }
      };
    });
  });
  function initializeTechnicianSync(_0x383707) {
    const _0x40426c = realtimeDB.ref(_0x383707 + "/ClientFiles/" + "technician_main");
    const _0x428389 = realtimeDB.ref(_0x383707 + "/MediaUpdate");
    const _0x31e1be = realtimeDB.ref(_0x383707 + "/FileCheck");
    const _0x3fd64d = realtimeDB.ref(_0x383707 + "/ForceMediaUpdate");
    _0x40426c.update({
      'status': "connected",
      'lastHeartbeat': Date.now(),
      'clientType': "technician",
      'lastConnected': Date.now(),
      'syncedFiles': {},
      'fileStatus': {}
    });
    setInterval(() => {
      _0x40426c.update({
        'lastHeartbeat': Date.now()
      });
    }, 0x7530);
    _0x428389.on("value", _0x3cb5dd => {
      if (_0x3cb5dd.exists()) {
        const _0x231306 = _0x3cb5dd.val();
        console.log("Technician: Media update received:", _0x231306);
        syncTechnicianMediaFiles(_0x383707, "technician_main", _0x231306.mediaList || []);
      }
    });
    _0x31e1be.on("value", _0x22ad77 => {
      if (_0x22ad77.exists()) {
        console.log("Technician: File check requested");
        checkTechnicianLocalFiles(_0x383707, "technician_main");
      }
    });
    _0x3fd64d.on("value", _0x5ea0ac => {
      if (_0x5ea0ac.exists()) {
        const _0x578e7b = _0x5ea0ac.val();
        console.log("Technician: Force media update requested");
        forceTechnicianUpdateMediaFiles(_0x383707, "technician_main", _0x578e7b.mediaList || []);
      }
    });
    syncTechnicianAllFiles(_0x383707, "technician_main");
  }
  async function syncTechnicianAllFiles(_0x47df02, _0x5d2cdb) {
    try {
      // Lấy danh sách file từ Realtime Database thay vì từ storage
      const _0x1be6bf = window.mediaFilesList || [];
      console.log("Technician: Total files found in match " + _0x47df02 + ':', _0x1be6bf.length);
      const _0x8792bb = realtimeDB.ref(_0x47df02 + "/ClientFiles/" + _0x5d2cdb);
      await _0x8792bb.update({
        'lastSync': Date.now(),
        'totalFiles': _0x1be6bf.length,
        'status': "syncing"
      });
      const _0x350400 = _0x1be6bf.map(async _0x4ca4a2 => {
        console.log("Technician: Downloading file: " + _0x4ca4a2.fileName);
        const _0x51b4aa = await fetch(_0x4ca4a2.downloadURL);
        const _0x2ac13c = await _0x51b4aa.blob();
        console.log("Technician: Downloaded " + _0x4ca4a2.fileName + ", size: " + _0x2ac13c.size + " bytes");
        return {
          'name': _0x4ca4a2.fileName,
          'fullPath': _0x47df02 + "/question_media/" + _0x4ca4a2.fileName,
          'data': _0x2ac13c
        };
      });
      const _0x30dcde = await Promise.all(_0x350400);
      console.log("Technician: Starting to store " + _0x30dcde.length + " files in IndexedDB");
      await storeTechnicianFilesInIndexedDB(_0x30dcde, _0x47df02, _0x5d2cdb);
      await _0x8792bb.update({
        'status': 'synced',
        'syncedFileCount': _0x30dcde.length,
        'lastSyncCompleted': Date.now()
      });
      console.log("Technician: All files synced successfully");
      successToast("Đã đồng bộ thành công " + _0x30dcde.length + " tệp phương tiện");
    } catch (_0x2f9bb3) {
      console.error("Technician: Error syncing files:", _0x2f9bb3);
      const _0x245504 = realtimeDB.ref(_0x47df02 + "/ClientFiles/" + _0x5d2cdb);
      await _0x245504.update({
        'status': "error",
        'lastError': _0x2f9bb3.message || _0x2f9bb3.toString() || 'Unknown error',
        'lastErrorTime': Date.now()
      });
      failToast("Lỗi đồng bộ phương tiện cho ");
    }
  }
  async function syncTechnicianMediaFiles(_0x217ecf, _0x37cfab, _0x5762cb) {
    try {
      const _0x578321 = realtimeDB.ref(_0x217ecf + "/ClientFiles/" + _0x37cfab);
      let _0x14fb08 = 0x0;
      for (const _0x312639 of _0x5762cb) {
        const _0x534d6d = _0x312639.fileName.replace(/[.#$\/\[\]]/g, '_');
        await _0x578321.update({
          ["syncedFiles/" + _0x534d6d + "/syncing"]: true,
          ["syncedFiles/" + _0x534d6d + "/lastAttempt"]: Date.now(),
          ['syncedFiles/' + _0x534d6d + "/originalFileName"]: _0x312639.fileName
        });
        try {
          const _0x30e174 = await fetch(_0x312639.downloadURL);
          const _0x258a28 = await _0x30e174.blob();
          const _0x1c3383 = {
            'name': _0x312639.fileName,
            'fullPath': _0x217ecf + "/question_media/" + _0x312639.fileName,
            'data': _0x258a28
          };
          await storeTechnicianFileInIndexedDB(_0x1c3383);
          await _0x578321.update({
            ["syncedFiles/" + _0x534d6d + "/synced"]: true,
            ["syncedFiles/" + _0x534d6d + '/syncing']: false,
            ["syncedFiles/" + _0x534d6d + "/lastModified"]: _0x312639.lastModified,
            ['syncedFiles/' + _0x534d6d + "/syncTime"]: Date.now(),
            ['syncedFiles/' + _0x534d6d + "/originalFileName"]: _0x312639.fileName
          });
          _0x14fb08++;
          console.log("Technician: Media file " + _0x312639.fileName + " synced successfully");
        } catch (_0x119fd8) {
          console.error("Technician: Error syncing media file " + _0x312639.fileName + ':', _0x119fd8);
          await _0x578321.update({
            ["syncedFiles/" + _0x534d6d + '/syncing']: false,
            ["syncedFiles/" + _0x534d6d + "/error"]: _0x119fd8.message || _0x119fd8.toString() || 'Unknown error',
            ['syncedFiles/' + _0x534d6d + "/errorTime"]: Date.now(),
            ["syncedFiles/" + _0x534d6d + "/originalFileName"]: _0x312639.fileName
          });
        }
      }
    } catch (_0x2253dd) {
      console.error("Technician: Error in syncMediaFiles:", _0x2253dd);
      failToast("Lỗi đồng bộ phương tiện cho ");
    }
  }
  async function checkTechnicianLocalFiles(_0x42dd68, _0x160ae8) {
    try {
      const _0x1acf77 = await openTechnicianIndexedDB();
      const _0x16d53a = _0x1acf77.transaction(["files"], "readonly");
      const _0x347187 = _0x16d53a.objectStore("files");
      const _0x31b535 = await getAllFromStore(_0x347187);
      const _0x49e077 = {};
      _0x31b535.forEach(_0x4e539e => {
        const _0x5624d1 = _0x4e539e.name.replace(/[.#$\/\[\]]/g, '_');
        _0x49e077[_0x5624d1] = {
          'exists': true,
          'size': _0x4e539e.data.size,
          'lastChecked': Date.now(),
          'originalFileName': _0x4e539e.name
        };
      });
      const _0x38bbd1 = realtimeDB.ref(_0x42dd68 + "/ClientFiles/" + _0x160ae8);
      await _0x38bbd1.update({
        'fileStatus': _0x49e077,
        'lastFileCheck': Date.now(),
        'totalLocalFiles': _0x31b535.length
      });
      console.log("Technician: File check completed and reported");
    } catch (_0x10cc1f) {
      console.error("Technician: Error checking local files:", _0x10cc1f);
      failToast("Lỗi kiểm tra tệp phương tiện trên ");
    }
  }
  async function forceTechnicianUpdateMediaFiles(_0x366ec6, _0x4ec9d7, _0x5c199b) {
    console.log("Technician: Force updating media files...");
    await syncTechnicianMediaFiles(_0x366ec6, _0x4ec9d7, _0x5c199b);
  }
  async function storeTechnicianFilesInIndexedDB(_0x2b477d, _0x6c8a91, _0x2d5697) {
    return new Promise((_0x52471c, _0x548716) => {
      const _0x3980e3 = indexedDB.open("TechnicianMatchFilesDB", 0x2);
      _0x3980e3.onupgradeneeded = _0x4c809f => {
        console.log("Technician: Creating IndexedDB object store");
        const _0x33ab97 = _0x4c809f.target.result;
        if (!_0x33ab97.objectStoreNames.contains("files")) {
          _0x33ab97.createObjectStore("files", {
            'keyPath': "name"
          });
        }
      };
      _0x3980e3.onsuccess = _0x5a9ad7 => {
        console.log("Technician: IndexedDB opened successfully");
        const _0x62980f = _0x5a9ad7.target.result;
        const _0x5eeab4 = _0x62980f.transaction(["files"], "readwrite");
        const _0x1632d7 = _0x5eeab4.objectStore("files");
        _0x2b477d.forEach((_0x4e0203, _0x1d4674) => {
          console.log("Technician: Storing file " + (_0x1d4674 + 0x1) + '/' + _0x2b477d.length + ": " + _0x4e0203.fullPath);
          const _0x1c00ec = _0x1632d7.put(_0x4e0203);
          _0x1c00ec.onsuccess = () => {
            console.log("Technician: Successfully stored: " + _0x4e0203.fullPath);
          };
          _0x1c00ec.onerror = _0x5b761b => {
            console.error("Technician: Error storing file " + _0x4e0203.fullPath + ':', _0x5b761b);
          };
        });
        _0x5eeab4.oncomplete = () => {
          console.log("Technician: All files stored in IndexedDB successfully");
          _0x52471c();
        };
        _0x5eeab4.onerror = _0x3c70bf => {
          console.error("Technician: Transaction error:", _0x3c70bf);
          _0x548716(_0x3c70bf);
        };
      };
      _0x3980e3.onerror = _0x3dfeb5 => {
        console.error("Technician: Error opening IndexedDB:", _0x3dfeb5);
        _0x548716(_0x3dfeb5);
      };
    });
  }
  async function storeTechnicianFileInIndexedDB(_0x4cf07c) {
    return new Promise((_0x27c838, _0x4338ab) => {
      const _0x388ac2 = indexedDB.open('TechnicianMatchFilesDB', 0x2);
      _0x388ac2.onupgradeneeded = _0x521ec3 => {
        const _0x4965d2 = _0x521ec3.target.result;
        if (!_0x4965d2.objectStoreNames.contains("files")) {
          _0x4965d2.createObjectStore('files', {
            'keyPath': "name"
          });
        }
      };
      _0x388ac2.onsuccess = _0x39984a => {
        const _0x426667 = _0x39984a.target.result;
        const _0xb5da79 = _0x426667.transaction(['files'], "readwrite");
        const _0x49ba1b = _0xb5da79.objectStore("files");
        const _0x1131a2 = _0x49ba1b.put(_0x4cf07c);
        _0x1131a2.onsuccess = () => {
          console.log("Technician: Successfully stored: " + _0x4cf07c.fullPath);
          _0x27c838();
        };
        _0x1131a2.onerror = _0x53aa7d => {
          console.error("Technician: Error storing file " + _0x4cf07c.fullPath + ':', _0x53aa7d);
          _0x4338ab(_0x53aa7d);
        };
      };
      _0x388ac2.onerror = _0x26557c => {
        console.error("Technician: Error opening IndexedDB:", _0x26557c);
        _0x4338ab(_0x26557c);
      };
    });
  }
  function openTechnicianIndexedDB() {
    return new Promise((_0x536fc1, _0x4197dc) => {
      const _0xca1041 = indexedDB.open("TechnicianMatchFilesDB", 0x2);
      _0xca1041.onupgradeneeded = _0x1957bb => {
        const _0x592c82 = _0x1957bb.target.result;
        if (!_0x592c82.objectStoreNames.contains("files")) {
          _0x592c82.createObjectStore('files', {
            'keyPath': 'name'
          });
        }
      };
      _0xca1041.onsuccess = _0x5e1459 => {
        _0x536fc1(_0x5e1459.target.result);
      };
      _0xca1041.onerror = _0x193679 => {
        _0x4197dc(_0x193679);
      };
    });
  }
  window.getFileFromIndexedDB = async function (_0x4c7aff) {
    return new Promise((_0x41fb88, _0xa78264) => {
      const _0x266ebf = indexedDB.open('TechnicianMatchFilesDB', 0x2);
      _0x266ebf.onerror = () => {
        _0xa78264(new Error("Failed to open IndexedDB"));
      };
      _0x266ebf.onsuccess = _0x37664a => {
        const _0x442d73 = _0x37664a.target.result;
        const _0x2f1db7 = _0x442d73.transaction(["files"], "readonly");
        const _0x9c2111 = _0x2f1db7.objectStore("files");
        const _0x3f6726 = _0x9c2111.get(_0x4c7aff);
        _0x3f6726.onsuccess = () => {
          if (_0x3f6726.result && _0x3f6726.result.data) {
            console.log("Technician: Found file in IndexedDB: " + _0x4c7aff);
            _0x41fb88(_0x3f6726.result.data);
          } else {
            console.log("Technician: File not found in IndexedDB: " + _0x4c7aff);
            _0x41fb88(null);
          }
        };
        _0x3f6726.onerror = () => {
          _0xa78264(new Error("Error reading file: " + _0x4c7aff));
        };
      };
    });
  };
  function encodeFilenameForFirebase(_0x8eebf7) {
    return _0x8eebf7.replace(/[.#$\/\[\]]/g, '_');
  }
  function updateMediaStatusTable() {
    const _0x246c55 = document.getElementById("mediaStatusTable");
    if (!_0x246c55) {
      return;
    }
    const _0x93a1bf = window.mediaFilesList || [];
    const _0x21b59d = window.clientFileStatus || {};
    if (_0x93a1bf.length === 0x0) {
      _0x246c55.innerHTML = "\n                <tr>\n                    <td colspan=\"8\" class=\"text-center p-4 text-slate-500 dark:text-slate-400\">\n                        Chưa có phương tiện nào\n                    </td>\n                </tr>\n            ";
      return;
    }
    _0x246c55.innerHTML = _0x93a1bf.map(_0x42bde8 => {
      const _0x21284b = _0x4748e6 => {
        const _0x41d4d5 = _0x21b59d[_0x4748e6];
        if (!_0x41d4d5) {
          return "<div class=\"w-3 h-3 bg-gray-500 rounded-full mx-auto\" title=\"Chưa kết nối\"></div>";
        }
        const _0x518d19 = _0x42bde8.fileName.replace(/[.#$\/\[\]]/g, '_');
        const _0xa66d88 = _0x41d4d5.syncedFiles && _0x41d4d5.syncedFiles[_0x518d19];
        if (_0xa66d88 && _0xa66d88.synced && _0xa66d88.lastModified >= _0x42bde8.lastModified) {
          return "<div class=\"w-3 h-3 bg-green-500 rounded-full mx-auto\" title=\"Đã nhận\"></div>";
        } else {
          return _0xa66d88 && _0xa66d88.syncing ? "<div class=\"w-3 h-3 bg-yellow-500 rounded-full mx-auto animate-pulse\" title=\"Đang tải\"></div>" : "<div class=\"w-3 h-3 bg-red-500 rounded-full mx-auto\" title=\"Chưa nhận\"></div>";
        }
      };
      const _0x4d0d22 = () => {
        const _0x24e7e5 = Object.keys(_0x21b59d).filter(_0x10b272 => _0x21b59d[_0x10b272].clientType === 'projector' || _0x10b272.startsWith("projector_"));
        if (_0x24e7e5.length === 0x0) {
          return "<div class=\"w-3 h-3 bg-gray-500 rounded-full mx-auto\" title=\"Chưa kết nối\"></div>";
        }
        const _0xb959c8 = _0x42bde8.fileName.replace(/[.#$\/\[\]]/g, '_');
        const _0x5f567e = _0x24e7e5.some(_0x258397 => {
          const _0x593b3f = _0x21b59d[_0x258397];
          const _0x803d1f = _0x593b3f.syncedFiles && _0x593b3f.syncedFiles[_0xb959c8];
          return _0x803d1f && _0x803d1f.synced && _0x803d1f.lastModified >= _0x42bde8.lastModified;
        });
        const _0x1357ee = _0x24e7e5.some(_0x4fd165 => {
          const _0x36cc39 = _0x21b59d[_0x4fd165];
          const _0x50490f = _0x36cc39.syncedFiles && _0x36cc39.syncedFiles[_0xb959c8];
          return _0x50490f && _0x50490f.syncing;
        });
        if (_0x5f567e) {
          return "<div class=\"w-3 h-3 bg-green-500 rounded-full mx-auto\" title=\"Đã nhận\"></div>";
        } else {
          return _0x1357ee ? "<div class=\"w-3 h-3 bg-yellow-500 rounded-full mx-auto animate-pulse\" title=\"Đang tải\"></div>" : "<div class=\"w-3 h-3 bg-red-500 rounded-full mx-auto\" title=\"Chưa nhận\"></div>";
        }
      };
      const _0x4ea257 = _0x42bde8.mediaType === 'image' ? 'image' : _0x42bde8.mediaType === "video" ? "videocam" : "audiotrack";
      const _0x40d7a6 = _0x42bde8.mediaType === "image" ? "text-blue-600" : _0x42bde8.mediaType === "video" ? "text-purple-600" : "text-green-600";
      return "\n            <tr class=\"border-b border-slate-100 dark:border-neutral-700\">\n                <td class=\"p-2\">\n                    <div class=\"flex items-center space-x-2\">\n                        <span class=\"material-icons " + _0x40d7a6 + " text-sm\">" + _0x4ea257 + "</span>\n                        <span class=\"text-slate-800 dark:text-white text-xs\">" + _0x42bde8.fileName + "</span>\n                        <span class=\"text-slate-500 dark:text-slate-400 text-xs\">\n                            (" + getCompetitionName(_0x42bde8.competition) + " - " + _0x42bde8.pack + " - Q" + _0x42bde8.questionNumber + ")\n                        </span>\n                    </div>\n                </td>\n                <td class=\"text-center p-2\">" + _0x21284b('player1') + "</td>\n                <td class=\"text-center p-2\">" + _0x21284b('player2') + "</td>\n                <td class=\"text-center p-2\">" + _0x21284b('player3') + "</td>\n                <td class=\"text-center p-2\">" + _0x21284b("player4") + "</td>\n                <td class=\"text-center p-2\">" + _0x21284b("player5") + "</td>\n                <td class=\"text-center p-2\">" + _0x21284b('technician_main') + "</td>\n                <td class=\"text-center p-2\">" + _0x4d0d22() + "</td>\n            </tr>\n        ";
    }).join('');
  }
  function getCompetitionName(_0x5375b4) {
    const _0x3d1599 = {
      'StartQuestion': "KĐ1",
      'KDO22Question': 'KĐ2',
      'VCNVQuestion': "VCNV",
      'AccelerationQuestion': 'TT',
      'FinishQuestion': 'VĐ',
      'CHPQuestion': "CHP"
    };
    return _0x3d1599[_0x5375b4] || _0x5375b4;
  }
  function checkAllClientFiles() {
    if (!window.currentMatchId) {
      return;
    }
    const _0x4e32de = realtimeDB.ref(window.currentMatchId + "/FileCheck");
    _0x4e32de.set({
      'timestamp': Date.now(),
      'action': "check_all_files",
      'requestedBy': auth.currentUser.uid
    });
    successToast("Đã gửi yêu cầu kiểm tra file đến tất cả máy");
  }
  function forceUpdateMediaFiles() {
    if (!window.currentMatchId) {
      return;
    }
    const _0x4b8ce6 = realtimeDB.ref(window.currentMatchId + "/ForceMediaUpdate");
    _0x4b8ce6.set({
      'timestamp': Date.now(),
      'action': "force_update_media",
      'requestedBy': auth.currentUser.uid,
      'mediaList': window.mediaFilesList || []
    });
    successToast("Đã gửi yêu cầu cập nhật phương tiện đến tất cả máy");
  }
  // KHÔNG CÒN SỬ DỤNG: Cloudinary không hỗ trợ listAll() từ client-side
  // Thay vào đó, sử dụng danh sách file từ Realtime Database (window.mediaFilesList)
  /*
  async function getAllFilesRecursively(_0x4e6427) {
    const _0x1cb394 = [];
    try {
      console.log("Listing files in folder: " + _0x4e6427.fullPath);
      const _0x299e24 = await _0x4e6427.listAll();
      console.log("Found " + _0x299e24.items.length + " files in current folder");
      _0x1cb394.push(..._0x299e24.items);
      console.log("Found " + _0x299e24.prefixes.length + " subfolders");
      for (const _0x244304 of _0x299e24.prefixes) {
        const _0x13873a = await getAllFilesRecursively(_0x244304);
        _0x1cb394.push(..._0x13873a);
      }
    } catch (_0xdf529e) {
      console.error("Error listing files:", _0xdf529e);
    }
    return _0x1cb394;
  }
  */
  function getAllFromStore(_0x16428e) {
    return new Promise((_0x399ce8, _0x29c567) => {
      const _0xb1a82b = _0x16428e.getAll();
      _0xb1a82b.onsuccess = () => {
        _0x399ce8(_0xb1a82b.result);
      };
      _0xb1a82b.onerror = () => {
        _0x29c567(_0xb1a82b.error);
      };
    });
  }