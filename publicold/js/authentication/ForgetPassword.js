const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


const forgetpasswordForm = document.querySelector('#form');


forgetpasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    auth.sendPasswordResetEmail(email).then(function () {
        successToast("Đã gửi Email khôi phục mật khẩu", 3000, "bottom", "right", false, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", "");
    }).catch(function (error) {
        failToast("Gửi Email khôi phục thất bại", 3000, "bottom", "right", false, "linear-gradient(to right, #ff5f6d, #ffc371)", "");
    });
});