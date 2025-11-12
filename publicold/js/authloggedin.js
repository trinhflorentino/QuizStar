// Your web app's Firebase configuration
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
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const functions = firebase.functions();


function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}

function signUp() {

    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Signed Up");
}



function signIn() {

    var email = document.getElementById("login-email");
    var password = document.getElementById("login-password");

    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
    promise.then(function () {
        location.replace("Main.html")
    })



}



function signOut() {
    document.getElementById("notification-text").innerHTML = "Đăng xuất thành công";
    var notification = document.getElementsByClassName('notification');
    notification[0].style.display = "block";
    setTimeout(function () {
        auth.signOut();
        location.replace("index.html");
        localStorage.removeItem("iduser");
        localStorage.removeItem("name");
    }, 3000);
}




const adminButton = document.querySelectorAll('.admin');
adminButton.forEach(item => item.style.display = 'none');

auth.onAuthStateChanged(function (user) {

    if (user) {
        localStorage.setItem("iduser", auth.currentUser.uid);
        localStorage.setItem("name", auth.currentUser.displayName);

        if (window.location.pathname == "/Main.html") {
            const adminButton = document.querySelectorAll('.admin');
            adminButton.forEach(item => item.style.display = 'block');
        }

    } else {
        location.replace("index.html")
    }



});
