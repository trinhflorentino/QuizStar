// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOc1EyCji-Hh1u7-4WUcUiCpdZWE5g7rk",
    authDomain: "the-olympus-online.firebaseapp.com",
    databaseURL: "https://the-olympus-online-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "the-olympus-online",
    storageBucket: "the-olympus-online.appspot.com",
    messagingSenderId: "482181856213",
    appId: "1:482181856213:web:5b0c699eb798df8aba9b5c",
    measurementId: "G-XF74M32DCJ"
  };// Initialize Firebase
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


const forget = document.querySelector('#forgetform');
forget.addEventListener('submit', (e) => {
        e.preventDefault();
        var email = document.getElementById("forget-email").value;
        auth.sendPasswordResetEmail(email).then(function() {
            Notification("Đã gửi Email khôi phục mật khẩu");
        }).catch(function(error) {
            Notification("Gửi Email khôi phục thất bại");
        });

    }


)
``

function signOut() {

    auth.signOut();
    location.replace("index.html");
    localStorage.removeItem("iduser");
}

auth.onAuthStateChanged(function(user) {

    if (user) {
        location.replace("Main.html");
    } else {

    }
});





(function($) {
    "use strict";

    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function() {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
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