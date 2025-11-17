const firebaseConfig = {
  apiKey: "AIzaSyAQNwOE6jmM8g3A46JbVY1L_GxvhWPqBk8",
  authDomain: "trinhdeptrai-84120.firebaseapp.com",
  databaseURL: "https://trinhdeptrai-84120-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trinhdeptrai-84120",
  storageBucket: "trinhdeptrai-84120.appspot.com",
  messagingSenderId: "175262163725",
  appId: "1:175262163725:web:462ac9a003be3103c74644",
  measurementId: "G-WSZLD85T8D"
};
  
  // Khởi tạo Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Hàm để lấy IP của bộ giả lập
  function getEmulatorIP() {
    return localStorage.getItem('emulatorIP');
  }
  
  // Hàm để lưu IP server và reload trang
  function saveServerIP() {
    const serverIP = document.getElementById('serverIPInput').value.trim();
    if (serverIP) {
      localStorage.setItem('emulatorIP', serverIP);
      console.log('Đã lưu IP server:', serverIP);
      // Reload trang ngay lập tức
      location.reload();
    } else {
      alert('Vui lòng nhập IP server');
    }
  }
  
  // Hàm để kết nối với bộ giả lập hoặc Firebase trực tuyến
  function connectToFirebase() {
  const emulatorIP = getEmulatorIP();
  
  if (emulatorIP) {
    firebase.auth().useEmulator(`http://${emulatorIP}:9099`, { disableWarnings: true });
    firebase.firestore().useEmulator(emulatorIP, 8080);
    firebase.database().useEmulator(emulatorIP, 9000);
    // Firebase Storage removed - now using Cloudinary
    // firebase.storage().useEmulator(emulatorIP, 9199);
    // firebase.functions().useEmulator(emulatorIP, 5001);
    
    console.log(`Đang sử dụng bộ giả lập Firebase tại ${emulatorIP}`);
  } else {
    console.log("Đang sử dụng Firebase trực tuyến");
  }
  }
  
  // Gắn sự kiện cho các nút
  if(document.getElementById('saveServerIPBtn')) {
    document.getElementById('saveServerIPBtn').addEventListener('click', saveServerIP);
  }
  
  if(document.getElementById('clearServerIPBtn')) {
    document.getElementById('clearServerIPBtn').addEventListener('click', clearServerIP);
  }
  
  // Load IP hiện tại vào input khi trang load
  document.addEventListener('DOMContentLoaded', function() {
    const currentIP = getEmulatorIP();
    if (currentIP && document.getElementById('serverIPInput')) {
      document.getElementById('serverIPInput').value = currentIP;
    }
  });
  
  // Hàm để xóa IP server (chuyển về online)
  function clearServerIP() {
    localStorage.removeItem('emulatorIP');
    console.log("Đã xóa IP server, chuyển về Firebase Online");
    location.reload();
  }
  
  // Kết nối ban đầu
  connectToFirebase();
  
  // Set Firebase ready flag
  window.firebaseReady = true;
  
  // Dispatch Firebase ready event
  window.dispatchEvent(new CustomEvent('firebaseReady'));
  
  var auth = firebase.auth();