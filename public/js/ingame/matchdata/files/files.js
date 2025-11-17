auth.onAuthStateChanged(_0x264625 => {
    if (!_0x264625) {
      return;
    }
    const _0x175816 = firestoreDB.collection("match").doc(auth.currentUser.uid);
    _0x175816.onSnapshot(_0x25c903 => {
      if (!_0x25c903.exists) {
        return;
      }
      const _0x5a6822 = _0x25c903.data().match;
      console.log("Match ID: " + _0x5a6822);
      const _0x174570 = new URLSearchParams(window.location.search);
      let _0x3fa70f = _0x174570.get("player");
      if (!_0x3fa70f) {
        const _0x54cf28 = localStorage.getItem('id');
        _0x3fa70f = _0x54cf28 ? "player" + _0x54cf28 : "player1";
      }
      const _0x42d044 = realtimeDB.ref(_0x5a6822 + "/ClientFiles/" + _0x3fa70f);
      const _0x40e6af = realtimeDB.ref(_0x5a6822 + "/MediaUpdate");
      const _0x30889b = realtimeDB.ref(_0x5a6822 + "/FileCheck");
      const _0x41f17e = realtimeDB.ref(_0x5a6822 + "/ForceMediaUpdate");
      _0x42d044.update({
        'status': "connected",
        'lastHeartbeat': Date.now(),
        'clientType': "player",
        'playerId': _0x3fa70f,
        'lastConnected': Date.now(),
        'syncedFiles': {},
        'fileStatus': {}
      });
      setInterval(() => {
        _0x42d044.update({
          'lastHeartbeat': Date.now()
        });
      }, 0x7530);
      _0x40e6af.on('value', _0x1dd070 => {
        if (_0x1dd070.exists()) {
          const _0x840f52 = _0x1dd070.val();
          console.log("Media update received:", _0x840f52);
          syncMediaFiles(_0x5a6822, _0x3fa70f, _0x840f52.mediaList || []);
        }
      });
      _0x30889b.on("value", _0x55fce8 => {
        if (_0x55fce8.exists()) {
          const _0x1e2bfa = _0x55fce8.val();
          if (!_0x1e2bfa.targetPlayer || _0x1e2bfa.targetPlayer === _0x3fa70f) {
            console.log("File check requested");
            checkLocalFiles(_0x5a6822, _0x3fa70f);
          }
        }
      });
      _0x41f17e.on("value", _0x594913 => {
        if (_0x594913.exists()) {
          const _0x1e84b4 = _0x594913.val();
          if (!_0x1e84b4.targetPlayer || _0x1e84b4.targetPlayer === _0x3fa70f) {
            console.log("Force media update requested");
            forceUpdateMediaFiles(_0x5a6822, _0x3fa70f, _0x1e84b4.mediaList || []);
          }
        }
      });
      syncAllFiles(_0x5a6822, _0x3fa70f);
      let _0x2ddaed = realtimeDB.ref(_0x5a6822 + '/QuestionMedia');
      let _0x58c363 = null;
      const _0x223f42 = {};
      window.getQuestionMedia = async function (_0x475d3e, _0x540afc, _0x120e46) {
        if (!_0x2ddaed) {
          return {
            'image': null,
            'audio': null
          };
        }
        return new Promise(_0x82a3f0 => {
          _0x2ddaed.once('value', _0x5c148a => {
            const _0x4b1ed5 = _0x5c148a.val() || {};
            const _0x4e3d9e = {
              'image': null,
              'audio': null
            };
            console.log("Searching for media: " + _0x475d3e + ", " + _0x540afc + ", " + _0x120e46);
            console.log("Available media data:", Object.keys(_0x4b1ed5));
            Object.values(_0x4b1ed5).forEach(_0xb80d3f => {
              if (_0xb80d3f.competition === _0x475d3e && _0xb80d3f.pack === _0x540afc && _0xb80d3f.questionNumber.toString() === _0x120e46.toString()) {
                console.log("Found matching media:", _0xb80d3f);
                if (_0xb80d3f.mediaType === 'image') {
                  _0x4e3d9e.image = _0xb80d3f;
                } else {
                  if (_0xb80d3f.mediaType === "audio") {
                    _0x4e3d9e.audio = _0xb80d3f;
                  } else if (_0xb80d3f.mediaType === "video") {
                    _0x4e3d9e.video = _0xb80d3f;
                  }
                }
              }
            });
            console.log("Media search result:", _0x4e3d9e);
            _0x82a3f0(_0x4e3d9e);
          });
        });
      };
      window.displayQuestionImage = async function (_0x100b19, _0x2dece4, _0x1084db) {
        if (!_0x100b19 || !_0x2dece4) {
          if (_0x1084db) {
            _0x1084db.classList.add("hidden");
          }
          return;
        }
        try {
          console.log("Loading image for question: " + _0x100b19.fileName);
          if (window.getFileFromIndexedDB) {
            try {
              const _0x30482a = await window.getFileFromIndexedDB(_0x100b19.fileName, _0x5a6822);
              if (_0x30482a) {
                const _0x413231 = URL.createObjectURL(_0x30482a);
                _0x2dece4.src = _0x413231;
                if (_0x1084db) {
                  _0x1084db.classList.remove("hidden");
                }
                console.log("✓ Image loaded from IndexedDB: " + _0x100b19.fileName);
                return;
              }
            } catch (_0x4804b7) {
              console.warn("IndexedDB failed for " + _0x100b19.fileName + ", falling back to Firebase:", _0x4804b7);
            }
          }
          if (_0x100b19.downloadURL) {
            console.log("Loading image from Firebase: " + _0x100b19.fileName);
            _0x2dece4.src = _0x100b19.downloadURL;
            if (_0x1084db) {
              _0x1084db.classList.remove("hidden");
            }
            console.log("✓ Image loaded from Firebase: " + _0x100b19.fileName);
          } else {
            console.warn("No download URL available for image: " + _0x100b19.fileName);
            if (_0x1084db) {
              _0x1084db.classList.add("hidden");
            }
          }
        } catch (_0x21ba6d) {
          console.error("Error loading image " + _0x100b19.fileName + ':', _0x21ba6d);
          if (_0x1084db) {
            _0x1084db.classList.add('hidden');
          }
        }
      };
      function _0x27af49(_0x56bf21) {
        if (!_0x56bf21) {
          return;
        }
        Object.entries(_0x56bf21).forEach(([_0x38d463, _0x46a2a1]) => {
          if (_0x46a2a1 && _0x46a2a1.volume !== undefined) {
            if (!_0x223f42[_0x38d463]) {
              _0x223f42[_0x38d463] = _0x46a2a1.volume;
            }
            _0x46a2a1.volume = 0.3;
          }
        });
        console.log("AudioMap volume lowered to 30%");
      }
      function _0x314cb2(_0x41196e) {
        if (!_0x41196e) {
          return;
        }
        Object.entries(_0x41196e).forEach(([_0xcd6598, _0x56b32f]) => {
          if (_0x56b32f && _0x223f42[_0xcd6598] !== undefined) {
            _0x56b32f.volume = _0x223f42[_0xcd6598];
          }
        });
        console.log("AudioMap volume restored");
      }
      window.stopCurrentQuestionAudio = function (_0x243027) {
        if (_0x58c363) {
          console.log("Stopping current question audio");
          _0x58c363.pause();
          _0x58c363.currentTime = 0x0;
          if (_0x58c363.src && _0x58c363.src.startsWith("blob:")) {
            URL.revokeObjectURL(_0x58c363.src);
          }
          _0x58c363 = null;
          _0x314cb2(_0x243027);
        }
      };
      window.playQuestionAudio = async function (_0x4dfa59, _0x2f81f7) {
        if (!_0x4dfa59) {
          return;
        }
        window.stopCurrentQuestionAudio(_0x2f81f7);
        try {
          console.log("Loading audio: " + _0x4dfa59.fileName);
          let _0x519668 = null;
          let _0x1f61bc = false;
          if (window.getFileFromIndexedDB) {
            try {
              const _0x5843fa = await window.getFileFromIndexedDB(_0x4dfa59.fileName, _0x5a6822);
              if (_0x5843fa) {
                _0x519668 = URL.createObjectURL(_0x5843fa);
                _0x1f61bc = true;
                console.log("✓ Audio loaded from IndexedDB: " + _0x4dfa59.fileName);
              }
            } catch (_0x3ddd32) {
              console.warn("IndexedDB failed for audio " + _0x4dfa59.fileName + ", falling back to Firebase:", _0x3ddd32);
            }
          }
          if (!_0x519668 && _0x4dfa59.downloadURL) {
            _0x519668 = _0x4dfa59.downloadURL;
            _0x1f61bc = false;
            console.log("Loading audio from Firebase: " + _0x4dfa59.fileName);
          }
          if (_0x519668) {
            if (_0x2f81f7) {
              _0x27af49(_0x2f81f7);
            }
            _0x58c363 = new Audio(_0x519668);
            _0x58c363.addEventListener('ended', () => {
              console.log("Question audio ended, restoring volume");
              _0x314cb2(_0x2f81f7);
              if (_0x1f61bc && _0x519668.startsWith('blob:')) {
                URL.revokeObjectURL(_0x519668);
              }
              _0x58c363 = null;
            });
            _0x58c363.addEventListener("error", _0x11f2e2 => {
              console.error("Question audio error:", _0x11f2e2);
              _0x314cb2(_0x2f81f7);
              if (_0x1f61bc && _0x519668.startsWith('blob:')) {
                URL.revokeObjectURL(_0x519668);
              }
              _0x58c363 = null;
            });
            await _0x58c363.play();
            console.log("✓ Question audio playing: " + _0x4dfa59.fileName);
          } else {
            console.warn("No audio URL available for: " + _0x4dfa59.fileName);
          }
        } catch (_0x35a974) {
          console.error("Error playing audio " + _0x4dfa59.fileName + ':', _0x35a974);
          if (_0x2f81f7) {
            _0x314cb2(_0x2f81f7);
          }
        }
      };
    });
  });
  function encodeFilenameForFirebase(_0x477b30) {
    return _0x477b30.replace(/[.#$\/\[\]]/g, '_');
  }
  function decodeFilenameFromFirebase(_0x1feb0e) {
    return _0x1feb0e;
  }
  async function syncAllFiles(_0x276f68, _0x39a59d) {
    try {
      // Lấy danh sách file từ Realtime Database thay vì từ storage
      const _0x4da2eb = await new Promise(_0x1ed22c => {
        realtimeDB.ref(_0x276f68 + "/QuestionMedia").once('value', _0x5e3a12 => {
          const _0x3b4c21 = _0x5e3a12.val() || {};
          const _0x4cc537 = Object.values(_0x3b4c21).map(_0x264906 => ({
            'fileName': _0x264906.fileName,
            'downloadURL': _0x264906.downloadURL
          }));
          _0x1ed22c(_0x4cc537);
        });
      });
      console.log("Total files found in match " + _0x276f68 + " (including subfolders):", _0x4da2eb.length);
      const _0x5ba0a4 = realtimeDB.ref(_0x276f68 + '/ClientFiles/' + _0x39a59d);
      await _0x5ba0a4.update({
        'lastSync': Date.now(),
        'totalFiles': _0x4da2eb.length,
        'status': "syncing"
      });
      const _0x437b17 = _0x4da2eb.map(async _0x2b5ed0 => {
        console.log("Downloading file: " + _0x2b5ed0.fileName);
        const _0xc6d5 = await fetch(_0x2b5ed0.downloadURL);
        const _0x47ca3c = await _0xc6d5.blob();
        console.log("Downloaded " + _0x2b5ed0.fileName + ", size: " + _0x47ca3c.size + " bytes");
        return {
          'name': _0x2b5ed0.fileName,
          'fullPath': _0x276f68 + "/question_media/" + _0x2b5ed0.fileName,
          'data': _0x47ca3c
        };
      });
      const _0x372f49 = await Promise.all(_0x437b17);
      console.log("Starting to store " + _0x372f49.length + " files in IndexedDB");
      await storeFilesInIndexedDB(_0x372f49, _0x276f68, _0x39a59d);
      await _0x5ba0a4.update({
        'status': "synced",
        'syncedFileCount': _0x372f49.length,
        'lastSyncCompleted': Date.now()
      });
      console.log("All files synced successfully");
    } catch (_0x33d3f7) {
      console.error("Error syncing files:", _0x33d3f7);
      const _0x2a42cf = realtimeDB.ref(_0x276f68 + "/ClientFiles/" + _0x39a59d);
      await _0x2a42cf.update({
        'status': "error",
        'lastError': _0x33d3f7.message || _0x33d3f7.toString() || 'Unknown error',
        'lastErrorTime': Date.now()
      });
    }
  }
  async function syncMediaFiles(_0x31bb7d, _0x9e6f35, _0x5dcaef) {
    try {
      const _0x32735a = realtimeDB.ref(_0x31bb7d + "/ClientFiles/" + _0x9e6f35);
      for (const _0x2ef046 of _0x5dcaef) {
        const _0x3bf1e9 = _0x2ef046.fileName.replace(/[.#$\/\[\]]/g, '_');
        await _0x32735a.update({
          ['syncedFiles/' + _0x3bf1e9 + "/syncing"]: true,
          ["syncedFiles/" + _0x3bf1e9 + "/lastAttempt"]: Date.now(),
          ["syncedFiles/" + _0x3bf1e9 + '/originalFileName']: _0x2ef046.fileName
        });
        try {
          const _0x403b35 = await fetch(_0x2ef046.downloadURL);
          const _0x4c0777 = await _0x403b35.blob();
          const _0x3239c8 = {
            'name': _0x2ef046.fileName,
            'fullPath': _0x31bb7d + "/question_media/" + _0x2ef046.fileName,
            'data': _0x4c0777
          };
          await storeFileInIndexedDB(_0x3239c8);
          await _0x32735a.update({
            ["syncedFiles/" + _0x3bf1e9 + "/synced"]: true,
            ["syncedFiles/" + _0x3bf1e9 + "/syncing"]: false,
            ['syncedFiles/' + _0x3bf1e9 + '/lastModified']: _0x2ef046.lastModified,
            ["syncedFiles/" + _0x3bf1e9 + "/syncTime"]: Date.now(),
            ["syncedFiles/" + _0x3bf1e9 + "/originalFileName"]: _0x2ef046.fileName
          });
          console.log("Media file " + _0x2ef046.fileName + " synced successfully");
        } catch (_0x55b785) {
          console.error("Error syncing media file " + _0x2ef046.fileName + ':', _0x55b785);
          await _0x32735a.update({
            ["syncedFiles/" + _0x3bf1e9 + "/syncing"]: false,
            ["syncedFiles/" + _0x3bf1e9 + "/error"]: _0x55b785.message || _0x55b785.toString() || 'Unknown error',
            ["syncedFiles/" + _0x3bf1e9 + "/errorTime"]: Date.now(),
            ["syncedFiles/" + _0x3bf1e9 + "/originalFileName"]: _0x2ef046.fileName
          });
        }
      }
    } catch (_0x136007) {
      console.error("Error in syncMediaFiles:", _0x136007);
    }
  }
  async function checkLocalFiles(_0x3448ff, _0x177ed5) {
    try {
      const _0x2bd6d2 = await openIndexedDB(_0x3448ff);
      const _0x289625 = _0x2bd6d2.transaction(["files"], "readonly");
      const _0x8f434b = _0x289625.objectStore("files");
      const _0x319192 = await getAllFromStore(_0x8f434b);
      const _0x4cb913 = {};
      _0x319192.forEach(_0x5ddcb9 => {
        const _0xae60a7 = _0x5ddcb9.name.replace(/[.#$\/\[\]]/g, '_');
        _0x4cb913[_0xae60a7] = {
          'exists': true,
          'size': _0x5ddcb9.data.size,
          'lastChecked': Date.now(),
          'originalFileName': _0x5ddcb9.name
        };
      });
      const _0x337154 = realtimeDB.ref(_0x3448ff + '/ClientFiles/' + _0x177ed5);
      await _0x337154.update({
        'fileStatus': _0x4cb913,
        'lastFileCheck': Date.now(),
        'totalLocalFiles': _0x319192.length
      });
      console.log("File check completed and reported");
    } catch (_0x548623) {
      console.error("Error checking local files:", _0x548623);
    }
  }
  function getAllFromStore(_0x184f52) {
    return new Promise((_0x3c8a4c, _0x359561) => {
      const _0x40e5fc = _0x184f52.getAll();
      _0x40e5fc.onsuccess = () => {
        _0x3c8a4c(_0x40e5fc.result);
      };
      _0x40e5fc.onerror = () => {
        _0x359561(_0x40e5fc.error);
      };
    });
  }
  async function forceUpdateMediaFiles(_0x7d1200, _0x3cb960, _0x47172b) {
    console.log("Force updating media files...");
    await syncMediaFiles(_0x7d1200, _0x3cb960, _0x47172b);
  }
  // KHÔNG CÒN SỬ DỤNG: Cloudinary không hỗ trợ listAll() từ client-side
  // Thay vào đó, sử dụng danh sách file từ Realtime Database (QuestionMedia)
  /*
  async function getAllFilesRecursively(_0x4d8a42) {
    const _0x155e4e = [];
    try {
      console.log("Listing files in folder: " + _0x4d8a42.fullPath);
      const _0x355f87 = await _0x4d8a42.listAll();
      console.log("Found " + _0x355f87.items.length + " files in current folder");
      _0x155e4e.push(..._0x355f87.items);
      console.log("Found " + _0x355f87.prefixes.length + " subfolders");
      for (const _0x57de87 of _0x355f87.prefixes) {
        const _0x5741db = await getAllFilesRecursively(_0x57de87);
        _0x155e4e.push(..._0x5741db);
      }
    } catch (_0x302a5c) {
      console.error("Error listing files:", _0x302a5c);
    }
    return _0x155e4e;
  }
  */
  async function storeFilesInIndexedDB(_0xd6bd1c, _0x38bfaa, _0x20454f) {
    return new Promise((_0xe421b0, _0x5c6940) => {
      const _0x1e9bc8 = _0x38bfaa + "_MatchFilesDB";
      const _0x48f8cc = indexedDB.open(_0x1e9bc8, 0x2);
      _0x48f8cc.onupgradeneeded = _0x4f65c7 => {
        console.log("Creating IndexedDB object store");
        const _0x23a84c = _0x4f65c7.target.result;
        if (!_0x23a84c.objectStoreNames.contains("files")) {
          _0x23a84c.createObjectStore("files", {
            'keyPath': "name"
          });
        }
      };
      _0x48f8cc.onsuccess = _0x4af525 => {
        console.log("IndexedDB opened successfully");
        const _0xced92a = _0x4af525.target.result;
        let _0x5af1d7;
        try {
          _0x5af1d7 = _0xced92a.transaction(["files"], "readwrite");
        } catch (_0x14cd19) {
          console.warn("IndexedDB transaction failed, database may be corrupted");
          _0xced92a.close();
          _0xe421b0();
          return;
        }
        const _0x53fcc7 = _0x5af1d7.objectStore("files");
        _0xd6bd1c.forEach((_0x4fe999, _0x283019) => {
          console.log("Storing file " + (_0x283019 + 0x1) + '/' + _0xd6bd1c.length + ": " + _0x4fe999.fullPath);
          const _0x1028d4 = _0x53fcc7.put(_0x4fe999);
          _0x1028d4.onsuccess = () => {
            console.log("Successfully stored: " + _0x4fe999.fullPath);
          };
          _0x1028d4.onerror = _0x68ca04 => {
            console.error("Error storing file " + _0x4fe999.fullPath + ':', _0x68ca04);
          };
        });
        _0x5af1d7.oncomplete = () => {
          console.log("All files stored in IndexedDB successfully");
          successToast("Hoàn thành lưu trữ dữ liệu hình ảnh, âm thanh cho trận đấu " + _0x38bfaa + " của thí sinh " + _0x20454f.replace("player", ''));
          _0xced92a.close();
          _0xe421b0();
        };
        _0x5af1d7.onerror = _0x3dd8c2 => {
          console.error("Transaction error:", _0x3dd8c2);
          _0xced92a.close();
          _0xe421b0();
        };
      };
      _0x48f8cc.onerror = _0x4372a8 => {
        console.error("Error opening IndexedDB:", _0x4372a8);
        _0xe421b0();
      };
      _0x48f8cc.onblocked = () => {
        console.warn("IndexedDB blocked, continuing without local storage");
        _0xe421b0();
      };
    });
  }
  async function storeFileInIndexedDB(_0x1d2071) {
    return new Promise((_0x490e34, _0x2c2bdf) => {
      const _0x10bfea = _0x1d2071.fullPath.split('/')[0x0];
      const _0x38bd86 = _0x10bfea + "_MatchFilesDB";
      const _0x3865e4 = indexedDB.open(_0x38bd86, 0x2);
      _0x3865e4.onupgradeneeded = _0x5c7729 => {
        const _0x36dc1c = _0x5c7729.target.result;
        if (!_0x36dc1c.objectStoreNames.contains('files')) {
          _0x36dc1c.createObjectStore("files", {
            'keyPath': "name"
          });
        }
      };
      _0x3865e4.onsuccess = _0x1b5613 => {
        const _0x333758 = _0x1b5613.target.result;
        let _0x246f3d;
        try {
          _0x246f3d = _0x333758.transaction(["files"], "readwrite");
        } catch (_0x22be56) {
          console.warn("IndexedDB transaction failed for single file store");
          _0x333758.close();
          _0x490e34();
          return;
        }
        const _0x553838 = _0x246f3d.objectStore("files");
        const _0xbc84e0 = _0x553838.put(_0x1d2071);
        _0xbc84e0.onsuccess = () => {
          console.log("Successfully stored: " + _0x1d2071.fullPath);
          _0x333758.close();
          _0x490e34();
        };
        _0xbc84e0.onerror = _0x115c11 => {
          console.error("Error storing file " + _0x1d2071.fullPath + ':', _0x115c11);
          _0x333758.close();
          _0x490e34();
        };
      };
      _0x3865e4.onerror = _0x2b8173 => {
        console.error("Error opening IndexedDB:", _0x2b8173);
        _0x490e34();
      };
      _0x3865e4.onblocked = () => {
        console.warn("IndexedDB blocked for single file store");
        _0x490e34();
      };
    });
  }
  function openIndexedDB(_0x4e70ab) {
    return new Promise((_0x5d57f8, _0x44d63c) => {
      const _0x16d85d = _0x4e70ab + "_MatchFilesDB";
      const _0x21a301 = indexedDB.open(_0x16d85d, 0x2);
      _0x21a301.onupgradeneeded = _0x4f01ec => {
        const _0x2bc090 = _0x4f01ec.target.result;
        if (!_0x2bc090.objectStoreNames.contains("files")) {
          _0x2bc090.createObjectStore("files", {
            'keyPath': "name"
          });
        }
      };
      _0x21a301.onsuccess = _0x218d3c => {
        const _0x4ea0dd = _0x218d3c.target.result;
        if (!_0x4ea0dd.objectStoreNames.contains("files")) {
          console.warn("IndexedDB for match " + _0x4e70ab + " missing 'files' store");
          _0x4ea0dd.close();
          _0x44d63c(new Error("Database structure invalid"));
          return;
        }
        _0x5d57f8(_0x4ea0dd);
      };
      _0x21a301.onerror = _0x19fa30 => {
        console.error("Error opening IndexedDB:", _0x19fa30);
        _0x44d63c(_0x19fa30);
      };
      _0x21a301.onblocked = () => {
        console.warn("IndexedDB blocked");
        _0x44d63c(new Error("Database blocked"));
      };
    });
  }
  window.getFileFromIndexedDB = async function (_0x509474, _0x4d1fa9) {
    if (!_0x4d1fa9) {
      const _0x8d05f = auth.currentUser;
      if (_0x8d05f) {
        try {
          const _0x4a5500 = await firestoreDB.collection('match').doc(_0x8d05f.uid).get();
          if (_0x4a5500.exists) {
            _0x4d1fa9 = _0x4a5500.data().match;
          }
        } catch (_0x296d36) {
          console.error("Error getting matchId from Firestore:", _0x296d36);
          return null;
        }
      }
      if (!_0x4d1fa9) {
        console.error("No matchId available for IndexedDB lookup");
        return null;
      }
    }
    return new Promise(_0x5c1658 => {
      const _0x1338bf = _0x4d1fa9 + '_MatchFilesDB';
      const _0x5275de = indexedDB.open(_0x1338bf, 0x2);
      _0x5275de.onerror = _0x3b79af => {
        console.warn("Failed to open IndexedDB for match " + _0x4d1fa9 + ':', _0x3b79af);
        _0x5c1658(null);
      };
      _0x5275de.onblocked = () => {
        console.warn("IndexedDB blocked for match " + _0x4d1fa9 + ", falling back to Firebase");
        _0x5c1658(null);
      };
      _0x5275de.onupgradeneeded = _0x3bdb0a => {
        try {
          const _0x67de7b = _0x3bdb0a.target.result;
          if (!_0x67de7b.objectStoreNames.contains('files')) {
            _0x67de7b.createObjectStore("files", {
              'keyPath': "name"
            });
          }
        } catch (_0x113e84) {
          console.warn("Error creating IndexedDB schema for match " + _0x4d1fa9 + ':', _0x113e84);
          _0x5c1658(null);
        }
      };
      _0x5275de.onsuccess = _0x286a4f => {
        const _0x450836 = _0x286a4f.target.result;
        try {
          if (!_0x450836.objectStoreNames.contains("files")) {
            console.warn("IndexedDB for match " + _0x4d1fa9 + " missing 'files' store, falling back to Firebase");
            _0x450836.close();
            _0x5c1658(null);
            return;
          }
          const _0x5ead30 = _0x450836.transaction(["files"], "readonly");
          const _0x5d9001 = _0x5ead30.objectStore("files");
          const _0x209529 = _0x5d9001.get(_0x509474);
          _0x209529.onsuccess = () => {
            _0x450836.close();
            if (_0x209529.result && _0x209529.result.data) {
              console.log("✓ Found file in IndexedDB: " + _0x509474);
              _0x5c1658(_0x209529.result.data);
            } else {
              console.log("File not found in IndexedDB: " + _0x509474 + ", will fallback to Firebase");
              _0x5c1658(null);
            }
          };
          _0x209529.onerror = _0x4115f6 => {
            console.warn("Error reading file " + _0x509474 + " from IndexedDB:", _0x4115f6);
            _0x450836.close();
            _0x5c1658(null);
          };
          _0x5ead30.onerror = _0x1c1f90 => {
            console.warn("Transaction error for file " + _0x509474 + ':', _0x1c1f90);
            _0x450836.close();
            _0x5c1658(null);
          };
        } catch (_0xcb7b2c) {
          console.warn("Error accessing IndexedDB for match " + _0x4d1fa9 + ':', _0xcb7b2c);
          _0x450836.close();
          _0x5c1658(null);
        }
      };
    });
  };