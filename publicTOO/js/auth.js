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

    auth.signInWithEmailAndPassword(email.value, password.value).then(function (user) {
        Notification("Đăng nhập thành công");
    });

    auth.signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
        if (error.code == "auth/user-not-found") {
            Notification("Email không tồn tại");
        }
        if (error.code == "auth/wrong-password") {
            Notification("Sai mật khẩu");
        }
        if (error.code == "auth/too-many-requests") {
            Notification("Quá nhiều lần đăng nhập sai, xin thử lại sau");
        }
    })
}

)


const signup = document.querySelector('#signupform');
signup.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem("matchcurrentchoose", "");
    localStorage.setItem("match", "");
    var name = document.getElementById("signup-name").value;
    var email = document.getElementById("signup-email").value;
    var password = document.getElementById("signup-password").value;
    if (name) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
            localStorage.setItem("matchcurrentchoose", "");
            localStorage.setItem("match", "");
        });
        auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
            document.getElementById("signup-fail").style.display = "block";
            document.getElementById("error-code").style.display = "block";
            if (error.code == "auth/email-already-in-use") {
                document.getElementById("error-code").innerHTML = "Lỗi: Email đã được sử dụng bởi một người khác. Vui lòng đăng ký bằng địa chỉ Email khác!";
            }
            if (error.code == "auth/invalid-email") {
                document.getElementById("error-code").innerHTML = "Lỗi: Hãy nhập địa chỉ email!";
            }
            if (error.code == "auth/user-not-found") {
                document.getElementById("error-code").innerHTML = "Lỗi: Người dùng không tồn tại. Vui lòng đăng kí hoặc thử lại!";
            }
            if (error.code == "auth/weak-password") {
                document.getElementById("error-code").innerHTML = "Lỗi: Mật khẩu phải chứa ít nhất 6 kí tự!";
            }
            if (error.code == "auth/network-request-failed") {
                document.getElementById("error-code").innerHTML = "Lỗi: Mất kết nối đến Internet! Vui lòng kiểm tra kết nối";
            }
        });
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                document.getElementById("signup-fail").style.display = "none";
                document.getElementById("error-code").style.display = "none";
                document.getElementById("signup-success").style.display = "block";
                user.updateProfile({
                    displayName: name
                }).then(function () {

                }, function (error) {

                });


            }
        });
    }
}


)


const forget = document.querySelector('#forgetform');
forget.addEventListener('submit', (e) => {
    e.preventDefault();
    var email = document.getElementById("forget-email").value;
    auth.sendPasswordResetEmail(email).then(function () {
        document.getElementById("forget-fail").style.display = "none";
        document.getElementById("forget-success").style.display = "block";
        document.getElementById("forget-email").value = "";
    }).catch(function (error) {
        document.getElementById("forget-fail").style.display = "block";
        document.getElementById("forget-success").style.display = "none";
        document.getElementById("forget-email").value = "";
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
        location.replace("Main.html");
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

