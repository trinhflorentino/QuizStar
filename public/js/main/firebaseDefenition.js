document.addEventListener("contextmenu", _0x2b152d => _0x2b152d.preventDefault());
firebase.initializeApp(firebaseConfig);
var appCheck = firebase.appCheck();
appCheck.activate("6LeXLSYrAAAAACwOFsBpXuYLoqx2MqnevmlkXYny", true);
var firestoreDB = firebase.firestore();
var realtimeDB = firebase.database();
var storage = window.cloudinaryService;
// Create a mock firebase.storage() for backward compatibility with obfuscated code
if (!firebase.storage) {
  firebase.storage = function() {
    return window.cloudinaryService;
  };
}
if (!window.console) {
  window.console = {};
}
var methods = ["log", "debug", "warn", "info", "dir", "dirxml", "trace", "profile"];
for (var i = 0x0; i < methods.length; i++) {
  console[methods[i]] = function () {};
}
var listener = new window.keypress.Listener();
var forbiddenCombos = ["f12", "ctrl shift i", "ctrl shift j", "ctrl shift c", "ctrl u"];
for (var i = 0x0; i < forbiddenCombos.length; i++) {
  listener.simple_combo(forbiddenCombos[i], function () {
    failToast("Không được truy cập chức năng Developer Tools");
    return;
  });
}