
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


const signupForm = document.querySelector('#form');


signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
    });

    auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                failToast("Email này đã được sử dụng", 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
                break;
            case "auth/invalid-email":
                failToast("Email không hợp lệ", 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
                break;
            case "auth/user-not-found":
                failToast("Người dùng không tồn tại", 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
                break;
            case "auth/weak-password":
                failToast("Mật khâu phải chứa ít nhất 8 kí tự", 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
                break;
            case "auth/network-request-failed":
                failToast("Mất kết nối đến Internet", 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
                break;
        }
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            successToast("Đăng kí thành công! Kiểm tra Email để xác thực tài khoản", 3000, "bottom", "right", false, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", "");
            user.updateProfile({
                displayName: username
            }).then(function () {

            }, function (error) {

            });
            user.sendEmailVerification();
        }
    });
});