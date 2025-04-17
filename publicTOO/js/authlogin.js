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


const loginform = document.querySelector('#loginform');
loginform.addEventListener('submit', (e) => {
    e.preventDefault();
    var email = document.getElementById("login-email");
    var password = document.getElementById("login-password");

    auth.signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            Notification("Đăng nhập thành công");
        })
        .catch((error) => {
            var errorJSON = JSON.parse(error.message);
            console.log(errorJSON);
            switch (errorJSON.error.message) {
                case "INVALID_LOGIN_CREDENTIALS":
                    Notification("Mật khẩu không đúng hoặc email không tồn tại.");
                    break;
                case "INVALID_PASSWORD":
                    Notification("Mật khẩu không đúng.");
                    break;
                case "TOO_MANY_ATTEMPTS_TRY_LATER":
                    Notification("Quá nhiều lần đăng nhập sai, xin thử lại sau.");
                    break;
                case "USER_DISABLED":
                    Notification("Tài khoản của bạn đã bị khóa.");
                    break;
                case "TIMEOUT":
                    Notification("Hết thời gian đăng nhập, xin thử lại sau.");
                    break;
                default:
                    Notification("Đã xảy ra lỗi, vui lòng thử lại sau.");
                    break;
            }
            console.log(error);
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
}

)


function signOut() {

    auth.signOut();
    location.replace("index.html");
    localStorage.removeItem("iduser");
}

auth.onAuthStateChanged(function (user) {

    if (user) {
        Notification("Đăng nhập thành công");
        setTimeout(function () {
            location.replace("Home.html");
        }, 2000);
    } else {

    }
});





(function ($) {
    "use strict";

    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);

