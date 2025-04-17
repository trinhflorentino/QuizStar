// auth.onAuthStateChanged(function (user) {

//     if (user) {
//         user.getIdTokenResult().then(idTokenResult => {
//             user.admin = idTokenResult.claims.admin;
//             if (user.admin == true) { } else {
//                 alert("Bạn không có quyền truy cập trang này!")
//                 location.replace("Main.html")
//             }
//         })
//     }
// });


function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}


var idhost = firebase.database().ref('/' + matchid);
idhost.on('value', hostid);
function hostid(id) {
    auth.onAuthStateChanged(function (user) {
        if (auth.currentUser.uid != id.val().hostid && auth.currentUser.uid != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1") {
            alert("Bạn không phải là Host của trận/giải đấu này. Hãy tạo trận đấu mới!");
            location.replace("Main.html");
        }
    })
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


var matchid = getCookie("matchid");


function updatePassword() {

    var newpassword = document.getElementById("newpass").value;

    var npass = {
        password: newpassword
    }

    firebase.database().ref(matchid + '/').update(npass);
    Notification("Đổi mật khẩu trận đấu thành công")
    setTimeout(function () {
        window.close();
    }, 3000);

}