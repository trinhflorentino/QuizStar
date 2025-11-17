class MediaUtils {
    constructor() {
      this.audioCache = new Map();
      this.imageCache = new Map();
    }
    async ["getAudioUrl"](_0x38320e, _0x1821ab = "mp3") {
      const _0xd44b77 = _0x38320e + '.' + _0x1821ab;
      console.log("Attempting to load audio from IndexedDB: " + _0xd44b77);
      if (this.audioCache.has(_0xd44b77)) {
        console.log("Audio found in cache: " + _0xd44b77);
        return this.audioCache.get(_0xd44b77);
      }
      if (!window.getFileFromIndexedDB) {
        console.warn("getFileFromIndexedDB function not available for " + _0xd44b77);
        return null;
      }
      try {
        const _0x1856d3 = await window.getFileFromIndexedDB(_0xd44b77);
        if (_0x1856d3) {
          console.log("Audio successfully loaded from IndexedDB: " + _0xd44b77);
          const _0x3cf239 = URL.createObjectURL(_0x1856d3);
          this.audioCache.set(_0xd44b77, _0x3cf239);
          return _0x3cf239;
        }
      } catch (_0xfdba07) {
        console.warn("Audio file " + _0xd44b77 + " not found in IndexedDB:", _0xfdba07);
      }
      console.log("Audio file " + _0xd44b77 + " not available in IndexedDB");
      return null;
    }
    async ['getImageUrl'](_0x2f8927, _0x4ab094 = "jpg") {
      const _0x4c4c60 = _0x2f8927 + '.' + _0x4ab094;
      if (this.imageCache.has(_0x4c4c60)) {
        return this.imageCache.get(_0x4c4c60);
      }
      try {
        const _0xe794f8 = await window.getFileFromIndexedDB(_0x4c4c60);
        if (_0xe794f8) {
          const _0x22e9b5 = URL.createObjectURL(_0xe794f8);
          this.imageCache.set(_0x4c4c60, _0x22e9b5);
          return _0x22e9b5;
        }
      } catch (_0x469653) {
        console.warn("Image file " + _0x4c4c60 + " not found in IndexedDB:", _0x469653);
      }
      return null;
    }
    async ["setAudioSource"](_0x153981, _0x26ff19, _0x2dd15c = "mp3", _0xff3623 = null) {
      if (!_0x153981) {
        console.warn("Audio element not found for " + _0x26ff19);
        return;
      }
      console.log("Setting audio source for " + _0x26ff19 + '.' + _0x2dd15c);
      const _0x5aeb57 = await this.getAudioUrl(_0x26ff19, _0x2dd15c);
      if (_0x5aeb57) {
        console.log("Setting IndexedDB audio source for " + _0x26ff19 + ": " + _0x5aeb57.substring(0x0, 0x32) + "...");
        _0x153981.src = _0x5aeb57;
      } else if (_0xff3623) {
        console.log("Using Firebase fallback for " + _0x26ff19 + ": " + _0xff3623);
        _0x153981.src = _0xff3623;
      } else {
        console.warn("No source available for " + _0x26ff19);
      }
    }
    async ["setImageSource"](_0x530184, _0x5e5a6e, _0x1eee81 = "jpg", _0x65f064 = null, _0x2c1395 = "src") {
      if (!_0x530184) {
        return;
      }
      const _0x1b3d23 = await this.getImageUrl(_0x5e5a6e, _0x1eee81);
      if (_0x1b3d23) {
        _0x530184[_0x2c1395] = _0x1b3d23;
      } else if (_0x65f064) {
        _0x530184[_0x2c1395] = _0x65f064;
      }
    }
    async ["setVideoSource"](_0x5a68f9, _0x59454f, _0x4a606d = "mp4", _0x52691c = null) {
      await this.setImageSource(_0x5a68f9, _0x59454f, _0x4a606d, _0x52691c, "src");
    }
    async ["setVideoPoster"](_0x13e125, _0x556715, _0x2d6bf4 = "jpg", _0x5c424c = null) {
      await this.setImageSource(_0x13e125, _0x556715, _0x2d6bf4, _0x5c424c, "poster");
    }
    async ["loadCompetitionMedia"](_0xa1f40d, _0x69141e, _0x25da6e = "src") {
      if (!_0x69141e || !_0xa1f40d) {
        return;
      }
      const _0x56be8a = _0xa1f40d.split('/');
      const _0x17bcfe = _0x56be8a[_0x56be8a.length - 0x1];
      try {
        const _0x252fee = await window.getFileFromIndexedDB(_0x17bcfe);
        if (_0x252fee) {
          const _0x1406c8 = URL.createObjectURL(_0x252fee);
          _0x69141e[_0x25da6e] = _0x1406c8;
          return;
        }
      } catch (_0x1ea6ed) {
        console.warn("Media file " + _0x17bcfe + " not found in IndexedDB, using Cloudinary:", _0x1ea6ed);
      }
      try {
        const _0x8b92e = await window.cloudinaryService.ref(_0xa1f40d).getDownloadURL();
        _0x69141e[_0x25da6e] = _0x8b92e;
      } catch (_0x2f134f) {
        console.error("Failed to load media from both IndexedDB and Cloudinary:", _0x2f134f);
        _0x69141e[_0x25da6e] = '';
      }
    }
    ['cleanup']() {
      for (const _0x49064b of this.audioCache.values()) {
        URL.revokeObjectURL(_0x49064b);
      }
      for (const _0x194e0e of this.imageCache.values()) {
        URL.revokeObjectURL(_0x194e0e);
      }
      this.audioCache.clear();
      this.imageCache.clear();
    }
    async ['preloadAudio'](_0x10c4ee) {
      const _0x5ec30a = _0x10c4ee.map(_0x275dc0 => this.getAudioUrl(_0x275dc0));
      await Promise.allSettled(_0x5ec30a);
    }
    async ["preloadImages"](_0x17d9db) {
      const _0x59ea95 = _0x17d9db.map(_0x1de6bc => this.getImageUrl(_0x1de6bc));
      await Promise.allSettled(_0x59ea95);
    }
  }
  window.mediaUtils = new MediaUtils();
  window.addEventListener('beforeunload', () => {
    if (window.mediaUtils) {
      window.mediaUtils.cleanup();
    }
  });
  window.checkIndexedDBStatus = async function () {
    console.log("=== IndexedDB Status Check ===");
    if (!window.getFileFromIndexedDB) {
      console.error("getFileFromIndexedDB function not available");
      return;
    }
    try {
      const _0x55d5a8 = indexedDB.open("MatchFilesDB", 0x1);
      _0x55d5a8.onsuccess = _0x297d63 => {
        const _0xb24544 = _0x297d63.target.result;
        const _0x4ad205 = _0xb24544.transaction(['files'], "readonly");
        const _0x418de0 = _0x4ad205.objectStore("files");
        const _0x5efefd = _0x418de0.getAll();
        _0x5efefd.onsuccess = () => {
          const _0x1f7f12 = _0x5efefd.result;
          console.log("Found " + _0x1f7f12.length + " files in IndexedDB:");
          _0x1f7f12.forEach(_0x58be73 => {
            console.log("- " + _0x58be73.fullPath + " (" + _0x58be73.data.size + " bytes)");
          });
          if (_0x1f7f12.length > 0x0) {
            const _0x889147 = _0x1f7f12[0x0];
            console.log("Testing file load: " + _0x889147.fullPath);
            window.getFileFromIndexedDB(_0x889147.fullPath).then(_0x35e408 => {
              if (_0x35e408) {
                console.log("✓ Successfully loaded test file: " + _0x889147.fullPath);
              } else {
                console.log("✗ Failed to load test file: " + _0x889147.fullPath);
              }
            });
          }
        };
      };
      _0x55d5a8.onerror = () => {
        console.error("Failed to open IndexedDB");
      };
    } catch (_0x386fdc) {
      console.error("Error checking IndexedDB:", _0x386fdc);
    }
  };
  window.reinitializeMediaSources = function () {
    console.log("Reinitializing media sources...");
    if (window.location.pathname.includes("Ingame.html")) {
      console.log("Media reinitialization would go here for Ingame");
    }
  };