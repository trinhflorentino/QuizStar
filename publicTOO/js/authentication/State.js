auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        successToast("Bạn đã đăng nhập", 3000, "bottom", "right", false, "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", "");
        setTimeout(function  () { location.replace("./Main.html"); }, 2000);
    } else {
    }
});



