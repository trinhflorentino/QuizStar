auth.onAuthStateChanged(_0x42e22e => {
    if (!_0x42e22e) {
      return;
    }
    const _0x1ab6d1 = firestoreDB.collection("match").doc(_0x42e22e.uid);
    _0x1ab6d1.onSnapshot(_0x55642c => {
      if (!_0x55642c.exists) {
        return;
      }
      const _0x41327d = _0x55642c.data().match;
      var _0x27e31b = realtimeDB.ref(_0x41327d + "/VDPCauso/causo");
      var _0x2f4776 = realtimeDB.ref(_0x41327d + "/phanthistatus/vedichphu");
      var _0x5a91df = realtimeDB.ref(_0x41327d + "/AdditionalPlayerSelected");
      var _0x2c9f68 = realtimeDB.ref(_0x41327d + "/AdditionalBuzzer");
      var _0x3e9d91 = realtimeDB.ref(_0x41327d + "/AdditionalDisabledId");
      let _0x18ffef;
      let _0x20be93 = false;
      let _0x2c1b5f = 0xf;
      _0x27e31b.on('value', _0x17390a => {
        const _0x2c9bc1 = _0x17390a.val();
        const _0x541110 = realtimeDB.ref(_0x41327d + '/CHPQuestion/cau' + _0x2c9bc1);
        const _0x553f8f = realtimeDB.ref(_0x41327d + "/CHPQuestion/dacau" + _0x2c9bc1);
        _0x541110.on("value", _0x363376 => {
          document.getElementById('AdditionalQuestion').textContent = _0x363376.val();
        });
        _0x553f8f.on("value", _0x862e6d => {
          document.getElementById("AdditionalAnswer").textContent = _0x862e6d.val();
        });
        clearInterval(_0x18ffef);
        document.getElementById("AdditionalTimer").textContent = '15';
      });
      _0x2c9f68.on("value", _0x1622e8 => {
        for (let _0x808bfe = 0x1; _0x808bfe <= 0x4; _0x808bfe++) {
          const _0x41b24c = document.getElementById("additionalPlayer" + _0x808bfe);
          if (_0x41b24c) {
            _0x41b24c.classList.remove("bg-red-600", "text-white", 'rounded-full');
          }
        }
        if (!_0x1622e8.exists()) {
          if (_0x20be93) {
            _0x20be93 = false;
            _0x15d8d1();
          }
          return;
        }
        let _0x48eda3 = {
          'timestamp': Infinity,
          'id': null
        };
        let _0x4eb3ca = {};
        _0x1622e8.forEach(_0x217bb9 => {
          const _0x4672f1 = _0x217bb9.val();
          if (!_0x4672f1 || !_0x4672f1.id || !_0x4672f1.buzzerTimestamp) {
            return;
          }
          if (!_0x4eb3ca[_0x4672f1.id] || _0x4672f1.buzzerTimestamp < _0x4eb3ca[_0x4672f1.id]) {
            _0x4eb3ca[_0x4672f1.id] = _0x4672f1.buzzerTimestamp;
          }
          if (_0x4eb3ca[_0x4672f1.id] < _0x48eda3.timestamp) {
            _0x48eda3 = {
              'timestamp': _0x4eb3ca[_0x4672f1.id],
              'id': _0x4672f1.id
            };
          }
        });
        if (_0x48eda3.id !== null) {
          const _0x604c3f = document.getElementById("additionalPlayer" + _0x48eda3.id);
          if (_0x604c3f) {
            _0x604c3f.classList.add('bg-red-600', "rounded-full", "text-white");
          }
          clearInterval(_0x18ffef);
          _0x20be93 = true;
        } else if (_0x20be93) {
          _0x20be93 = false;
          _0x15d8d1();
        }
      });
      for (let _0x361ba5 = 0x1; _0x361ba5 <= 0x4; _0x361ba5++) {
        realtimeDB.ref(_0x41327d + "/VDPChuongDisable/TS" + _0x361ba5).on("value", _0x398434 => {
          const _0x48d0af = _0x398434.val()?.["chuongdisable"];
          const _0x2281ea = document.getElementById("additionalPlayer" + _0x361ba5);
          if (_0x2281ea) {
            if (_0x48d0af == 0x1) {
              _0x2281ea.classList.add("bg-slate-600", 'rounded-full', 'text-white');
              _0x2281ea.classList.remove("bg-red-600");
            } else {
              _0x2281ea.classList.remove("bg-slate-600", "text-white");
            }
          }
        });
      }
      const _0x15d8d1 = () => {
        const _0x2c4af5 = document.getElementById('AdditionalTimer');
        _0x18ffef = setInterval(() => {
          if (_0x2c1b5f <= 0x0) {
            clearInterval(_0x18ffef);
            _0x2c4af5.textContent = '';
            _0x4e9560();
          } else {
            _0x2c4af5.textContent = '' + _0x2c1b5f;
            _0x2c1b5f--;
          }
        }, 0x3e8);
      };
      _0x2f4776.on("value", _0x391ae0 => {
        if (_0x391ae0.val()?.["batdau"] === 0x1) {
          clearInterval(_0x18ffef);
          _0x2c1b5f = 0xe;
          _0x15d8d1();
        } else {}
      });
      function _0x4e9560() {
        realtimeDB.ref(_0x41327d + "/VDPChuong/ChuongStatus").set({
          'status': 0x3
        });
        realtimeDB.ref(_0x41327d + '/VDPChuong/Player').set({});
        realtimeDB.ref(_0x41327d + '/VDPChuong/CorrectOrWrong').set({
          'correctorwrong': 0x0
        });
        for (let _0x5716b5 = 0x1; _0x5716b5 <= 0x4; _0x5716b5++) {
          realtimeDB.ref(_0x41327d + '/VDPChuongDisable/TS' + _0x5716b5).set({
            'chuongdisable': 0x0
          });
        }
      }
      realtimeDB.ref(_0x41327d + "/Sounds").on("value", _0xaa458d => {
        const _0x5d3161 = _0xaa458d.val().TenseMoments;
        const _0x2008b7 = document.getElementById("AdditionalTenseAudio");
        if (_0x5d3161 === true) {
          _0x2008b7.textContent = "Dừng âm thanh căng thẳng";
        } else {
          _0x2008b7.textContent = "Phát âm thanh căng thẳng";
        }
      });
      _0x5a91df.on('value', _0x3deab4 => {
        const _0x34a085 = _0x3deab4.val() || [];
        for (let _0x2c93c6 = 0x1; _0x2c93c6 <= 0x4; _0x2c93c6++) {
          const _0x4a725e = document.getElementById("additionalPlayer" + _0x2c93c6 + 'Checkbox');
          if (_0x4a725e) {
            _0x4a725e.checked = _0x34a085.includes(_0x2c93c6);
          }
        }
      });
      _0x3e9d91.on("value", _0x4df155 => {});
    });
  });