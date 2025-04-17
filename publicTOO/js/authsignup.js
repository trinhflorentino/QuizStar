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

const signup = document.querySelector('#signupform');
signup.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem("matchcurrentchoose", "");
        localStorage.setItem("match", "");
        var name = document.getElementById("signup-name").value;
        var email = document.getElementById("signup-email").value;
        var password = document.getElementById("signup-password").value;
        if (name) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                localStorage.setItem("matchcurrentchoose", "");
                localStorage.setItem("match", "");

                firebase.storage().ref('users/' + localStorage.getItem("iduser") + '/profile.jpg').put(file).then(function() {}).catch(error => {})
            
            });
            auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        Notification("Email này đã được sử dụng");
                        break;
                    case "auth/invalid-email" :
                        Notification("Email không hợp lệ");
                        break;   
                    case "auth/user-not-found" :
                        Notification("Người dùng không tồn tại");
                        break;
                    case "auth/weak-password":
                        Notification("Mật khâu phải chứa ít nhất 8 kí tự");
                        break;
                    case "auth/network-request-failed":
                        Notification("Mất kết nối đến Internet");
                        break;        
                }
                
            });
            firebase.auth().onAuthStateChanged(function(user) {

                if (user) {
                    Notification("Đăng kí thành công! Kiểm tra Email để xác thực tài khoản");
                    user.updateProfile({
                        displayName: name
                    }).then(function() {

                    }, function(error) {

                    });
                    user.sendEmailVerification();


                }
            });
        }




    }


)



function signOut() {

    auth.signOut();
    location.replace("index.html");
    localStorage.removeItem("iduser");
}

auth.onAuthStateChanged(function(user) {

    if (user) {

        setTimeout(function() { location.replace("Main.html"); }, 4000);
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