async function readFileFromIndexedDB(_0x5e2952) {
    return new Promise((_0x4fabc8, _0x33608d) => {
      const _0x689212 = indexedDB.open("MatchFilesDB", 0x1);
      _0x689212.onerror = () => {
        _0x33608d(new Error("Failed to open IndexedDB"));
      };
      _0x689212.onsuccess = _0x19b4a7 => {
        const _0x5cb395 = _0x19b4a7.target.result;
        const _0xf8465e = _0x5cb395.transaction(['files'], "readonly");
        const _0x1c66a6 = _0xf8465e.objectStore('files');
        const _0x1c3802 = _0x1c66a6.get(_0x5e2952);
        _0x1c3802.onsuccess = () => {
          if (_0x1c3802.result) {
            console.log("Found file: " + _0x5e2952);
            console.log("File size: " + _0x1c3802.result.data.size + " bytes");
            _0x4fabc8(_0x1c3802.result);
          } else {
            console.log("File not found: " + _0x5e2952);
            _0x4fabc8(null);
          }
        };
        _0x1c3802.onerror = () => {
          _0x33608d(new Error("Error reading file: " + _0x5e2952));
        };
      };
    });
  }
  async function listAllFilesInIndexedDB() {
    return new Promise((_0x149119, _0x10f22c) => {
      const _0x1267ab = indexedDB.open('MatchFilesDB', 0x1);
      _0x1267ab.onerror = () => {
        _0x10f22c(new Error("Failed to open IndexedDB"));
      };
      _0x1267ab.onsuccess = _0xa08f46 => {
        const _0x38b286 = _0xa08f46.target.result;
        const _0x8e873e = _0x38b286.transaction(["files"], "readonly");
        const _0x4c05e5 = _0x8e873e.objectStore("files");
        const _0x2bad3c = _0x4c05e5.getAll();
        _0x2bad3c.onsuccess = () => {
          const _0x3b4130 = _0x2bad3c.result;
          console.log("Found " + _0x3b4130.length + " files in IndexedDB:");
          _0x3b4130.forEach((_0x5283c5, _0x30cfbe) => {
            console.log(_0x30cfbe + 0x1 + ". " + _0x5283c5.fullPath + " (" + _0x5283c5.data.size + " bytes)");
          });
          _0x149119(_0x3b4130);
        };
        _0x2bad3c.onerror = () => {
          _0x10f22c(new Error("Error listing files"));
        };
      };
    });
  }
  async function blobToText(_0x2f092e) {
    return new Promise((_0x357ebd, _0x477b3e) => {
      const _0x436a82 = new FileReader();
      _0x436a82.onload = () => _0x357ebd(_0x436a82.result);
      _0x436a82.onerror = _0x477b3e;
      _0x436a82.readAsText(_0x2f092e);
    });
  }
  async function blobToDataURL(_0x6091fe) {
    return new Promise((_0x6430c4, _0x12a5fc) => {
      const _0x38847e = new FileReader();
      _0x38847e.onload = () => _0x6430c4(_0x38847e.result);
      _0x38847e.onerror = _0x12a5fc;
      _0x38847e.readAsDataURL(_0x6091fe);
    });
  }
  console.log("IndexedDB helper functions loaded:");
  console.log("- readFileFromIndexedDB(filePath)");
  console.log("- listAllFilesInIndexedDB()");
  console.log("- blobToText(blob)");
  console.log("- blobToDataURL(blob)");