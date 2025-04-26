auth.onAuthStateChanged(_0x5efc79 => {
    if (!_0x5efc79) {
      return;
    }
    const _0x15f7c3 = firestoreDB.collection("match").doc(_0x5efc79.uid);
    _0x15f7c3.onSnapshot(_0x176e5f => {
      if (!_0x176e5f.exists) {
        return;
      }
      const _0x229fc0 = _0x176e5f.data().match;
      var _0x2c8939 = realtimeDB.ref(_0x229fc0 + "/Acceleration/QS");
      var _0x5d6b56 = realtimeDB.ref(_0x229fc0 + "/AccelerationOpenAnswer");
      var _0x4c509b = realtimeDB.ref(_0x229fc0 + "/AlreadyOpenAnswer");
      var _0xa5e23c = realtimeDB.ref(_0x229fc0 + "/phanthistatus/tangtoc");
      var _0x5d6b56 = realtimeDB.ref(_0x229fc0 + "/AccelerationOpenAnswer");
      var _0x386226 = realtimeDB.ref(_0x229fc0 + "/AccelerationDisplayAnswerImage");
      var _0xa025c5 = realtimeDB.ref(_0x229fc0 + "/Sounds");
      var _0x451b65 = realtimeDB.ref(_0x229fc0 + "/AccelerationAnswers");
      for (let _0x5869cb = 0x1; _0x5869cb <= 0x4; _0x5869cb++) {
        const _0x1d44f6 = document.getElementById("AccelerationQuestion" + _0x5869cb);
        _0x1d44f6.addEventListener("click", () => {
          _0x386226.set({
            'status': false
          });
          _0x2c8939.update({
            'tangtoc': _0x5869cb
          });
          _0x5d6b56.set({
            'OpenAnswer': 0x0
          });
          _0x4c509b.set({
            'status': false
          });
          _0x451b65.remove();
          successToast("Đã chọn câu hỏi số " + _0x5869cb);
          document.getElementById("AccelerationStart").disabled = false;
        });
      }
      document.getElementById("AccelerationSpaceSound").addEventListener('click', () => {
        playSound('SpacingMusic', _0x229fc0);
      });
      document.getElementById("AccelerationStart").addEventListener("click", () => {
        _0xa5e23c.set({
          'batdau': 0x1
        }).then(() => {
          successToast("Đã bắt đầu đếm ngược");
          setTimeout(() => {
            _0xa5e23c.set({
              'batdau': 0x0
            });
          }, 0x7d0);
        });
        document.getElementById("AccelerationStart").disabled = true;
      });
      document.getElementById("AccelerationDisplayAnswer").addEventListener("click", () => {
        _0x5d6b56.once('value', _0x2567cb => {
          const _0xb7efac = _0x2567cb.val().OpenAnswer;
          const _0x468e63 = _0xb7efac === 0x0 ? 0x1 : 0x0;
          _0x5d6b56.set({
            'OpenAnswer': _0x468e63
          }).then(() => {
            const _0x286cf8 = document.getElementById('AccelerationDisplayAnswer');
            if (_0x468e63 === 0x1) {
              successToast("Đã hiển thị đáp án");
              _0x286cf8.textContent = "Đóng đáp án thí sinh";
            } else {
              successToast("Đã đóng đáp án");
              _0x286cf8.textContent = "Hiển thị đáp án thí sinh";
            }
            _0xa025c5.update({
              'TenseMoments': false
            });
            setTimeout(() => {
              _0x4c509b.set({
                'status': true
              });
            }, 0x3e8);
          });
        });
      });
      document.getElementById("AccelerationGrading").addEventListener("click", async () => {
        const _0x266de1 = realtimeDB.ref(_0x229fc0 + "/AccelerationAnswer");
        const _0x320dbe = await _0x266de1.once("value");
        if (_0x320dbe.val()?.["OpenAnswer"] === 0x0) {
          failToast("Bạn chưa hiển thị đáp án");
          return;
        }
        const _0x577128 = realtimeDB.ref(_0x229fc0 + "/AccelerationAnswers");
        const _0x2a7e3a = await _0x577128.once('value');
        const _0x1a82f1 = {};
        _0x2a7e3a.forEach(_0x589fda => {
          const _0x5052b9 = _0x589fda.val();
          const _0x259eb7 = parseFloat(_0x5052b9.answerTimestamp);
          const _0x54462f = _0x5052b9.id;
          if (!_0x1a82f1[_0x54462f] || _0x259eb7 > parseFloat(_0x1a82f1[_0x54462f].answerTimestamp)) {
            _0x1a82f1[_0x54462f] = {
              'answer': _0x5052b9.answer,
              'answerTimestamp': _0x5052b9.answerTimestamp
            };
          }
        });
        const _0xdccb43 = [];
        for (let _0x2a0468 = 0x1; _0x2a0468 <= 0x4; _0x2a0468++) {
          const _0x42b92c = document.getElementById('accelerationPlayer' + _0x2a0468 + "Checkbox");
          const _0x3bb504 = _0x1a82f1[_0x2a0468] || {};
          const _0x1f843f = _0x3bb504.answer || '';
          const _0x420d2c = _0x3bb504.answerTimestamp || '';
          const _0x3974f9 = _0x420d2c === '0' || _0x420d2c === '' ? 0x0 : parseFloat(_0x420d2c);
          if (_0x3974f9 !== undefined && !isNaN(_0x3974f9)) {
            _0xdccb43.push({
              'player': _0x2a0468,
              'timestamp': _0x3974f9,
              'answer': _0x1f843f,
              'checked': _0x42b92c?.['checked']
            });
          }
        }
        _0xdccb43.sort((_0x3f77ff, _0x59db9f) => _0x3f77ff.timestamp - _0x59db9f.timestamp);
        const _0x369aaa = [];
        _0xdccb43.forEach((_0x409a97, _0x4955fe) => {
          const _0x4323fd = 'TT' + (_0x4955fe + 0x1);
          const _0x2dcea4 = realtimeDB.ref(_0x229fc0 + "/AccelerationChecked/" + _0x4323fd);
          if (_0x409a97.checked && _0x409a97.answer !== '') {
            _0x369aaa.push(_0x2dcea4.set({
              'correctorwrong': 0x1
            }));
          } else {
            _0x369aaa.push(_0x2dcea4.set({
              'correctorwrong': 0x2
            }));
          }
        });
        await Promise.all(_0x369aaa);
        const _0x7ee319 = [0x28, 0x1e, 0x14, 0xa];
        const _0x550e59 = _0xdccb43.filter(_0x8e48cd => _0x8e48cd.checked && _0x8e48cd.answer !== '').map((_0x616015, _0x52bf51) => {
          const _0x5dc465 = realtimeDB.ref(_0x229fc0 + '/point/player' + _0x616015.player);
          return _0x5dc465.once('value').then(_0x3a701c => {
            const _0x4dab52 = _0x3a701c.val()?.['point'] || 0x0;
            return _0x5dc465.set({
              'point': _0x4dab52 + _0x7ee319[_0x52bf51]
            });
          });
        });
        await Promise.all(_0x550e59);
        successToast("Đã chấm điểm tăng tốc");
        for (let _0x5e7467 = 0x1; _0x5e7467 <= 0x4; _0x5e7467++) {
          const _0x2baa58 = document.getElementById("accelerationPlayer" + _0x5e7467 + "Checkbox");
          if (_0x2baa58) {
            _0x2baa58.checked = false;
          }
        }
        const _0x2be524 = realtimeDB.ref(_0x229fc0 + "/AccelerationChecked");
        await _0x2be524.update({
          'checkAnswer': true
        });
        _0xa025c5.update({
          'TenseMoments': false
        });
        setTimeout(() => _0x2be524.update({
          'checkAnswer': false
        }), 0x3e8);
      });
      document.getElementById("AccelerationTenseAudio").addEventListener("click", () => {
        _0xa025c5.once("value", _0x19009e => {
          if (_0x19009e.val().TenseMoments === true) {
            _0xa025c5.update({
              'TenseMoments': false
            });
          } else {
            _0xa025c5.update({
              'TenseMoments': true
            });
          }
        });
      });
      document.getElementById("AccelerationDisplayAnswerImage").addEventListener("click", () => {
        if (confirm("Bạn có muốn hiển thị hình ảnh đáp án không?")) {
          _0x386226.set({
            'status': true
          }).then(() => {
            successToast("Đã hiển thị hình ảnh đáp án");
          });
        }
      });
    });
  });