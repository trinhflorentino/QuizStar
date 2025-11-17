auth.onAuthStateChanged(_0x519f39 => {
    if (!_0x519f39) {
      return;
    }
    const _0x1fefe7 = firestoreDB.collection('match').doc(auth.currentUser.uid);
    _0x1fefe7.onSnapshot(_0x212c5e => {
      if (!_0x212c5e.exists) {
        return;
      }
      const _0x22c392 = _0x212c5e.data().match;
      console.log("Match ID: " + _0x22c392);
      const _0xc4fdfb = "projector_" + Date.now();
      localStorage.setItem('clientId', _0xc4fdfb);
      const _0x19fbe1 = realtimeDB.ref(_0x22c392 + "/ClientFiles/" + _0xc4fdfb);
      const _0x53684f = realtimeDB.ref(_0x22c392 + '/MediaUpdate');
      const _0x221134 = realtimeDB.ref(_0x22c392 + '/FileCheck');
      const _0x3d922e = realtimeDB.ref(_0x22c392 + "/ForceMediaUpdate");
      _0x19fbe1.update({
        'status': "connected",
        'type': "projector",
        'clientId': _0xc4fdfb,
        'lastHeartbeat': Date.now(),
        'lastConnected': Date.now(),
        'syncedFiles': {},
        'fileStatus': {}
      });
      setInterval(() => {
        _0x19fbe1.update({
          'lastHeartbeat': Date.now()
        });
      }, 0x7530);
      _0x53684f.on('value', _0x12eb69 => {
        if (_0x12eb69.exists()) {
          const _0x329bbd = _0x12eb69.val();
          console.log("Media update received:", _0x329bbd);
          syncMediaFiles(_0x22c392, _0xc4fdfb, _0x329bbd.mediaList || []);
        }
      });
      _0x221134.on("value", _0x361d89 => {
        if (_0x361d89.exists()) {
          const _0x532514 = _0x361d89.val();
          if (!_0x532514.targetPlayer) {
            console.log("File check requested");
            checkLocalFiles(_0x22c392, _0xc4fdfb);
          }
        }
      });
      _0x3d922e.on("value", _0x14cf11 => {
        if (_0x14cf11.exists()) {
          const _0x5f0620 = _0x14cf11.val();
          if (!_0x5f0620.targetPlayer) {
            console.log("Force media update requested");
            forceUpdateMediaFiles(_0x22c392, _0xc4fdfb, _0x5f0620.mediaList || []);
          }
        }
      });
      syncAllFiles(_0x22c392, _0xc4fdfb);
      let _0x499016 = realtimeDB.ref(_0x22c392 + '/QuestionMedia');
      let _0x5a6a63 = null;
      const _0x426559 = {};
      window.getQuestionMedia = async function (_0x3ea149, _0x5414c1, _0x3dea8b) {
        if (!_0x499016) {
          return {
            'image': null,
            'audio': null,
            'video': null
          };
        }
        return new Promise(_0x186c19 => {
          _0x499016.once('value', _0x505cee => {
            const _0x255ce6 = _0x505cee.val() || {};
            const _0xd2f129 = {
              'image': null,
              'audio': null,
              'video': null
            };
            Object.values(_0x255ce6).forEach(_0x3e5ee1 => {
              if (_0x3e5ee1.competition === _0x3ea149 && _0x3e5ee1.pack === _0x5414c1 && _0x3e5ee1.questionNumber.toString() === _0x3dea8b.toString()) {
                if (_0x3e5ee1.mediaType === "image") {
                  _0xd2f129.image = _0x3e5ee1;
                } else {
                  if (_0x3e5ee1.mediaType === "audio") {
                    _0xd2f129.audio = _0x3e5ee1;
                  } else if (_0x3e5ee1.mediaType === "video") {
                    _0xd2f129.video = _0x3e5ee1;
                  }
                }
              }
            });
            _0x186c19(_0xd2f129);
          });
        });
      };
      window.displayQuestionImage = async function (_0x577be2, _0x420c6c, _0x56b1d0) {
        if (!_0x577be2 || !_0x420c6c) {
          if (_0x56b1d0) {
            _0x56b1d0.classList.add("hidden");
          }
          return;
        }
        try {
          if (window.getFileFromIndexedDB) {
            const _0x4bfe99 = await window.getFileFromIndexedDB(_0x577be2.fileName, _0x22c392);
            if (_0x4bfe99) {
              const _0x2e6b0b = URL.createObjectURL(_0x4bfe99);
              _0x420c6c.src = _0x2e6b0b;
              _0x56b1d0.classList.remove('hidden');
              return;
            }
          }
          _0x420c6c.src = _0x577be2.downloadURL;
          _0x56b1d0.classList.remove("hidden");
        } catch (_0x1a04ab) {
          if (_0x56b1d0) {
            _0x56b1d0.classList.add("hidden");
          }
        }
      };
      window.displayQuestionMedia = async function (_0x3f0998, _0x4e9872) {
        if (!_0x3f0998 || !_0x4e9872) {
          return;
        }
        try {
          if (_0x3f0998.mediaType === "video") {
            let _0xac250b = null;
            if (window.getFileFromIndexedDB) {
              const _0x3ff491 = await window.getFileFromIndexedDB(_0x3f0998.fileName, _0x22c392);
              if (_0x3ff491) {
                _0xac250b = URL.createObjectURL(_0x3ff491);
              }
            }
            if (!_0xac250b) {
              _0xac250b = _0x3f0998.downloadURL;
            }
            _0x4e9872.src = _0xac250b;
            _0x4e9872.poster = '';
            _0x4e9872.load();
          } else {
            if (_0x3f0998.mediaType === "image") {
              let _0x13ca8f = null;
              if (window.getFileFromIndexedDB) {
                const _0x13f86f = await window.getFileFromIndexedDB(_0x3f0998.fileName, _0x22c392);
                if (_0x13f86f) {
                  _0x13ca8f = URL.createObjectURL(_0x13f86f);
                }
              }
              if (!_0x13ca8f) {
                _0x13ca8f = _0x3f0998.downloadURL;
              }
              _0x4e9872.poster = _0x13ca8f;
              _0x4e9872.src = '';
              _0x4e9872.load();
            }
          }
        } catch (_0x2a633c) {
          _0x4e9872.poster = '';
          _0x4e9872.src = '';
          _0x4e9872.load();
        }
      };
      window.playQuestionAudio = async function (_0x261d31, _0x44d5d9) {
        if (!_0x261d31) {
          return;
        }
        window.stopCurrentQuestionAudio(_0x44d5d9);
        try {
          let _0x20ea47 = null;
          let _0x16ac90 = false;
          if (window.getFileFromIndexedDB) {
            const _0x39791e = await window.getFileFromIndexedDB(_0x261d31.fileName, _0x22c392);
            if (_0x39791e) {
              _0x20ea47 = URL.createObjectURL(_0x39791e);
              _0x16ac90 = true;
            }
          }
          if (!_0x20ea47 && _0x261d31.downloadURL) {
            _0x20ea47 = _0x261d31.downloadURL;
            _0x16ac90 = false;
          }
          if (_0x20ea47) {
            if (_0x44d5d9) {
              _0x29a8db(_0x44d5d9);
            }
            _0x5a6a63 = new Audio(_0x20ea47);
            _0x5a6a63.addEventListener("ended", () => {
              _0x14cc9d(_0x44d5d9);
              if (_0x16ac90 && _0x20ea47.startsWith('blob:')) {
                URL.revokeObjectURL(_0x20ea47);
              }
              _0x5a6a63 = null;
            });
            _0x5a6a63.addEventListener("error", _0x2b3c4b => {
              _0x14cc9d(_0x44d5d9);
              if (_0x16ac90 && _0x20ea47.startsWith("blob:")) {
                URL.revokeObjectURL(_0x20ea47);
              }
              _0x5a6a63 = null;
            });
            await _0x5a6a63.play();
          }
        } catch (_0x206a81) {
          if (_0x44d5d9) {
            _0x14cc9d(_0x44d5d9);
          }
        }
      };
      window.stopCurrentQuestionAudio = function (_0x38f94d) {
        if (_0x5a6a63) {
          _0x5a6a63.pause();
          _0x5a6a63.currentTime = 0x0;
          if (_0x5a6a63.src && _0x5a6a63.src.startsWith("blob:")) {
            URL.revokeObjectURL(_0x5a6a63.src);
          }
          _0x5a6a63 = null;
          _0x14cc9d(_0x38f94d);
        }
      };
      function _0x29a8db(_0x1c4204) {
        if (!_0x1c4204) {
          return;
        }
        Object.entries(_0x1c4204).forEach(([_0x464a33, _0x4c3573]) => {
          if (_0x4c3573 && _0x4c3573.volume !== undefined) {
            if (!_0x426559[_0x464a33]) {
              _0x426559[_0x464a33] = _0x4c3573.volume;
            }
            _0x4c3573.volume = 0.3;
          }
        });
      }
      function _0x14cc9d(_0x5704ea) {
        if (!_0x5704ea) {
          return;
        }
        Object.entries(_0x5704ea).forEach(([_0xa977ee, _0x452c93]) => {
          if (_0x452c93 && _0x426559[_0xa977ee] !== undefined) {
            _0x452c93.volume = _0x426559[_0xa977ee];
          }
        });
      }
    });
  });
  function encodeFilenameForFirebase(_0x3ed5ed) {
    return _0x3ed5ed.replace(/[.#$\/\[\]]/g, '_');
  }
  function decodeFilenameFromFirebase(_0x569b93) {
    return _0x569b93;
  }
  async function syncAllFiles(_0x43a848, _0x125127) {
    try {
      // Lấy danh sách file từ Realtime Database thay vì từ storage
      const _0x4da2eb = await new Promise(_0x1ed22c => {
        realtimeDB.ref(_0x43a848 + "/QuestionMedia").once('value', _0x5e3a12 => {
          const _0x3b4c21 = _0x5e3a12.val() || {};
          const _0x4349f4 = Object.values(_0x3b4c21).map(_0x264906 => ({
            'fileName': _0x264906.fileName,
            'downloadURL': _0x264906.downloadURL
          }));
          _0x1ed22c(_0x4349f4);
        });
      });
      console.log("Total files found in match " + _0x43a848 + " (including subfolders):", _0x4da2eb.length);
      const _0xc7dc79 = realtimeDB.ref(_0x43a848 + "/ClientFiles/" + _0x125127);
      await _0xc7dc79.update({
        'lastSync': Date.now(),
        'totalFiles': _0x4da2eb.length,
        'status': "syncing"
      });
      const _0x3d404a = _0x4da2eb.map(async _0x91510f => {
        console.log("Downloading file: " + _0x91510f.fileName);
        const _0x2ef9e9 = await fetch(_0x91510f.downloadURL);
        const _0x4afab7 = await _0x2ef9e9.blob();
        console.log("Downloaded " + _0x91510f.fileName + ", size: " + _0x4afab7.size + " bytes");
        return {
          'name': _0x91510f.fileName,
          'fullPath': _0x43a848 + "/question_media/" + _0x91510f.fileName,
          'data': _0x4afab7
        };
      });
      const _0x4f9ef8 = await Promise.all(_0x3d404a);
      console.log("Starting to store " + _0x4f9ef8.length + " files in IndexedDB");
      await storeFilesInIndexedDB(_0x4f9ef8, _0x43a848, _0x125127);
      await _0xc7dc79.update({
        'status': "synced",
        'syncedFileCount': _0x4f9ef8.length,
        'lastSyncCompleted': Date.now()
      });
      console.log("All files synced successfully");
    } catch (_0x1929b5) {
      console.error("Error syncing files:", _0x1929b5);
      const _0x8f8ea2 = realtimeDB.ref(_0x43a848 + '/ClientFiles/' + _0x125127);
      await _0x8f8ea2.update({
        'status': "error",
        'lastError': _0x1929b5.message || _0x1929b5.toString() || 'Unknown error',
        'lastErrorTime': Date.now()
      });
    }
  }
  async function syncMediaFiles(_0x3808a7, _0x53b29c, _0xfbb162) {
    try {
      const _0x550bab = realtimeDB.ref(_0x3808a7 + "/ClientFiles/" + _0x53b29c);
      for (const _0x34a835 of _0xfbb162) {
        const _0x133b9e = _0x34a835.fileName.replace(/[.#$\/\[\]]/g, '_');
        await _0x550bab.update({
          ["syncedFiles/" + _0x133b9e + "/syncing"]: true,
          ["syncedFiles/" + _0x133b9e + "/lastAttempt"]: Date.now(),
          ["syncedFiles/" + _0x133b9e + "/originalFileName"]: _0x34a835.fileName
        });
        try {
          const _0x32b57b = await fetch(_0x34a835.downloadURL);
          const _0x1c8921 = await _0x32b57b.blob();
          const _0x8672c6 = {
            'name': _0x34a835.fileName,
            'fullPath': _0x3808a7 + "/question_media/" + _0x34a835.fileName,
            'data': _0x1c8921
          };
          await storeFileInIndexedDB(_0x8672c6);
          await _0x550bab.update({
            ["syncedFiles/" + _0x133b9e + "/synced"]: true,
            ["syncedFiles/" + _0x133b9e + "/syncing"]: false,
            ["syncedFiles/" + _0x133b9e + '/lastModified']: _0x34a835.lastModified,
            ["syncedFiles/" + _0x133b9e + "/syncTime"]: Date.now(),
            ["syncedFiles/" + _0x133b9e + "/originalFileName"]: _0x34a835.fileName
          });
          console.log("Media file " + _0x34a835.fileName + " synced successfully");
        } catch (_0x460aa0) {
          console.error("Error syncing media file " + _0x34a835.fileName + ':', _0x460aa0);
          await _0x550bab.update({
            ["syncedFiles/" + _0x133b9e + "/syncing"]: false,
            ['syncedFiles/' + _0x133b9e + "/error"]: _0x460aa0.message || _0x460aa0.toString() || 'Unknown error',
            ["syncedFiles/" + _0x133b9e + "/errorTime"]: Date.now(),
            ["syncedFiles/" + _0x133b9e + "/originalFileName"]: _0x34a835.fileName
          });
        }
      }
    } catch (_0x364a6d) {
      console.error("Error in syncMediaFiles:", _0x364a6d);
    }
  }
  async function checkLocalFiles(_0x2d5211, _0x8572cd) {
    try {
      const _0x2fff70 = await openIndexedDB(_0x2d5211);
      const _0x9e7c1b = _0x2fff70.transaction(["files"], 'readonly');
      const _0x12ba24 = _0x9e7c1b.objectStore("files");
      const _0x32e13e = await getAllFromStore(_0x12ba24);
      const _0x29b0fc = {};
      _0x32e13e.forEach(_0x1a82a4 => {
        const _0x4b3397 = _0x1a82a4.name.replace(/[.#$\/\[\]]/g, '_');
        _0x29b0fc[_0x4b3397] = {
          'exists': true,
          'size': _0x1a82a4.data.size,
          'lastChecked': Date.now(),
          'originalFileName': _0x1a82a4.name
        };
      });
      const _0x5e48e1 = realtimeDB.ref(_0x2d5211 + "/ClientFiles/" + _0x8572cd);
      await _0x5e48e1.update({
        'fileStatus': _0x29b0fc,
        'lastFileCheck': Date.now(),
        'totalLocalFiles': _0x32e13e.length
      });
      console.log("File check completed and reported");
    } catch (_0x31dad6) {
      console.error("Error checking local files:", _0x31dad6);
    }
  }
  async function forceUpdateMediaFiles(_0x114dd2, _0x4301f4, _0x3b0c14) {
    console.log("Force updating media files...");
    await syncMediaFiles(_0x114dd2, _0x4301f4, _0x3b0c14);
  }
  // KHÔNG CÒN SỬ DỤNG: Cloudinary không hỗ trợ listAll() từ client-side
  // Thay vào đó, sử dụng danh sách file từ Realtime Database (QuestionMedia)
  /*
  async function getAllFilesRecursively(_0x507b2a) {
    const _0x1a2220 = [];
    try {
      console.log("Listing files in folder: " + _0x507b2a.fullPath);
      const _0x2fb516 = await _0x507b2a.listAll();
      console.log("Found " + _0x2fb516.items.length + " files in current folder");
      _0x1a2220.push(..._0x2fb516.items);
      console.log("Found " + _0x2fb516.prefixes.length + " subfolders");
      for (const _0x13137f of _0x2fb516.prefixes) {
        const _0x53ef91 = await getAllFilesRecursively(_0x13137f);
        _0x1a2220.push(..._0x53ef91);
      }
    } catch (_0x5d8a7b) {
      console.error("Error listing files:", _0x5d8a7b);
    }
    return _0x1a2220;
  }
  */
  async function storeFilesInIndexedDB(_0xe06fb4, _0x4c713c, _0x1c7d71) {
    return new Promise((_0x387ba0, _0x1f8b93) => {
      const _0x4791af = _0x4c713c + "_MatchFilesDB";
      const _0x267a59 = indexedDB.open(_0x4791af, 0x2);
      _0x267a59.onupgradeneeded = _0x469694 => {
        console.log("Creating IndexedDB object store");
        const _0x1dc3bd = _0x469694.target.result;
        if (!_0x1dc3bd.objectStoreNames.contains('files')) {
          _0x1dc3bd.createObjectStore("files", {
            'keyPath': "name"
          });
        }
      };
      _0x267a59.onsuccess = _0x17baa0 => {
        console.log("IndexedDB opened successfully");
        const _0x11c87b = _0x17baa0.target.result;
        let _0x4e9174;
        try {
          _0x4e9174 = _0x11c87b.transaction(["files"], 'readwrite');
        } catch (_0x8fc05) {
          console.warn("IndexedDB transaction failed, database may be corrupted");
          _0x11c87b.close();
          _0x387ba0();
          return;
        }
        const _0x533361 = _0x4e9174.objectStore('files');
        _0xe06fb4.forEach((_0x43ebe5, _0x1259c9) => {
          console.log("Storing file " + (_0x1259c9 + 0x1) + '/' + _0xe06fb4.length + ": " + _0x43ebe5.fullPath);
          const _0x486e45 = _0x533361.put(_0x43ebe5);
          _0x486e45.onsuccess = () => {
            console.log("Successfully stored: " + _0x43ebe5.fullPath);
          };
          _0x486e45.onerror = _0x39bc3a => {
            console.error("Error storing file " + _0x43ebe5.fullPath + ':', _0x39bc3a);
          };
        });
        _0x4e9174.oncomplete = () => {
          console.log("All files stored in IndexedDB successfully");
          _0x11c87b.close();
          _0x387ba0();
        };
        _0x4e9174.onerror = _0x56af0c => {
          console.error("Transaction error:", _0x56af0c);
          _0x11c87b.close();
          _0x387ba0();
        };
      };
      _0x267a59.onerror = _0x267dcc => {
        console.error("Error opening IndexedDB:", _0x267dcc);
        _0x387ba0();
      };
      _0x267a59.onblocked = () => {
        console.warn("IndexedDB blocked, continuing without local storage");
        _0x387ba0();
      };
    });
  }
  async function storeFileInIndexedDB(_0x384c77) {
    return new Promise((_0x2e9b4d, _0x42785f) => {
      const _0x28bc00 = _0x384c77.fullPath.split('/')[0x0];
      const _0x23e277 = _0x28bc00 + "_MatchFilesDB";
      const _0x316ad6 = indexedDB.open(_0x23e277, 0x2);
      _0x316ad6.onupgradeneeded = _0x250d37 => {
        const _0x1109ca = _0x250d37.target.result;
        if (!_0x1109ca.objectStoreNames.contains("files")) {
          _0x1109ca.createObjectStore("files", {
            'keyPath': "name"
          });
        }
      };
      _0x316ad6.onsuccess = _0x141b69 => {
        const _0x2c21de = _0x141b69.target.result;
        let _0x1b7645;
        try {
          _0x1b7645 = _0x2c21de.transaction(["files"], "readwrite");
        } catch (_0x54af26) {
          console.warn("IndexedDB transaction failed for single file store");
          _0x2c21de.close();
          _0x2e9b4d();
          return;
        }
        const _0x430f39 = _0x1b7645.objectStore("files");
        const _0x43ed27 = _0x430f39.put(_0x384c77);
        _0x43ed27.onsuccess = () => {
          console.log("Successfully stored: " + _0x384c77.fullPath);
          _0x2c21de.close();
          _0x2e9b4d();
        };
        _0x43ed27.onerror = _0xecff98 => {
          console.error("Error storing file " + _0x384c77.fullPath + ':', _0xecff98);
          _0x2c21de.close();
          _0x2e9b4d();
        };
      };
      _0x316ad6.onerror = _0x1d07b4 => {
        console.error("Error opening IndexedDB:", _0x1d07b4);
        _0x2e9b4d();
      };
      _0x316ad6.onblocked = () => {
        console.warn("IndexedDB blocked for single file store");
        _0x2e9b4d();
      };
    });
  }
  function openIndexedDB(_0x303752) {
    return new Promise((_0x24ec5f, _0x1f619e) => {
      const _0x13af4a = _0x303752 + '_MatchFilesDB';
      const _0x5aa3e4 = indexedDB.open(_0x13af4a, 0x2);
      _0x5aa3e4.onupgradeneeded = _0x5840a5 => {
        const _0xd8df7c = _0x5840a5.target.result;
        if (!_0xd8df7c.objectStoreNames.contains("files")) {
          _0xd8df7c.createObjectStore('files', {
            'keyPath': "name"
          });
        }
      };
      _0x5aa3e4.onsuccess = _0x56cb63 => {
        const _0x392a50 = _0x56cb63.target.result;
        if (!_0x392a50.objectStoreNames.contains("files")) {
          console.warn("IndexedDB for match " + _0x303752 + " missing 'files' store");
          _0x392a50.close();
          _0x1f619e(new Error("Database structure invalid"));
          return;
        }
        _0x24ec5f(_0x392a50);
      };
      _0x5aa3e4.onerror = _0xe1215 => {
        console.error("Error opening IndexedDB:", _0xe1215);
        _0x1f619e(_0xe1215);
      };
      _0x5aa3e4.onblocked = () => {
        console.warn("IndexedDB blocked");
        _0x1f619e(new Error("Database blocked"));
      };
    });
  }
  function getAllFromStore(_0x594a62) {
    return new Promise((_0x46f7b9, _0x2cdc76) => {
      const _0x850c43 = _0x594a62.getAll();
      _0x850c43.onsuccess = () => {
        _0x46f7b9(_0x850c43.result);
      };
      _0x850c43.onerror = () => {
        _0x2cdc76(_0x850c43.error);
      };
    });
  }
  window.getFileFromIndexedDB = async function (_0x346726, _0x2b3af3) {
    if (!_0x2b3af3) {
      const _0x7665ce = auth.currentUser;
      if (_0x7665ce) {
        try {
          const _0x5159f7 = await firestoreDB.collection("match").doc(_0x7665ce.uid).get();
          if (_0x5159f7.exists) {
            _0x2b3af3 = _0x5159f7.data().match;
          }
        } catch (_0x184149) {
          console.error("Error getting matchId from Firestore:", _0x184149);
          return null;
        }
      }
      if (!_0x2b3af3) {
        console.error("No matchId available for IndexedDB lookup");
        return null;
      }
    }
    return new Promise(_0x32c04f => {
      const _0x18c865 = _0x2b3af3 + "_MatchFilesDB";
      const _0x21b217 = indexedDB.open(_0x18c865, 0x2);
      _0x21b217.onerror = _0x26d046 => {
        console.warn("Failed to open IndexedDB for match " + _0x2b3af3 + ':', _0x26d046);
        _0x32c04f(null);
      };
      _0x21b217.onblocked = () => {
        console.warn("IndexedDB blocked for match " + _0x2b3af3 + ", falling back to Firebase");
        _0x32c04f(null);
      };
      _0x21b217.onupgradeneeded = _0x264661 => {
        try {
          const _0x4c0bb9 = _0x264661.target.result;
          if (!_0x4c0bb9.objectStoreNames.contains("files")) {
            _0x4c0bb9.createObjectStore("files", {
              'keyPath': "name"
            });
          }
        } catch (_0x40513c) {
          console.warn("Error creating IndexedDB schema for match " + _0x2b3af3 + ':', _0x40513c);
          _0x32c04f(null);
        }
      };
      _0x21b217.onsuccess = _0x2bc972 => {
        const _0x52f2d8 = _0x2bc972.target.result;
        try {
          if (!_0x52f2d8.objectStoreNames.contains("files")) {
            console.warn("IndexedDB for match " + _0x2b3af3 + " missing 'files' store, falling back to Firebase");
            _0x52f2d8.close();
            _0x32c04f(null);
            return;
          }
          const _0x41857b = _0x52f2d8.transaction(['files'], 'readonly');
          const _0x57f4c9 = _0x41857b.objectStore("files");
          const _0x47b58e = _0x57f4c9.get(_0x346726);
          _0x47b58e.onsuccess = () => {
            _0x52f2d8.close();
            if (_0x47b58e.result && _0x47b58e.result.data) {
              console.log("✓ Found file in IndexedDB: " + _0x346726);
              _0x32c04f(_0x47b58e.result.data);
            } else {
              console.log("File not found in IndexedDB: " + _0x346726 + ", will fallback to Firebase");
              _0x32c04f(null);
            }
          };
          _0x47b58e.onerror = _0xd34f41 => {
            console.warn("Error reading file " + _0x346726 + " from IndexedDB:", _0xd34f41);
            _0x52f2d8.close();
            _0x32c04f(null);
          };
          _0x41857b.onerror = _0x483add => {
            console.warn("Transaction error for file " + _0x346726 + ':', _0x483add);
            _0x52f2d8.close();
            _0x32c04f(null);
          };
        } catch (_0x2f0e06) {
          console.warn("Error accessing IndexedDB for match " + _0x2b3af3 + ':', _0x2f0e06);
          _0x52f2d8.close();
          _0x32c04f(null);
        }
      };
    });
  };