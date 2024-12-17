document.addEventListener('contextmenu', event => event.preventDefault());

shortcut.add("F12", function () {
    alert("!!!!!");
});
shortcut.add("Ctrl+Shift+I", function () {
    alert("!!!");
});


var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;
let file = {};

function chooseFile(e) {
    file = e.target.files[0];
}

function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}

function uploadImage() {
    if (file.size < 2000000) {
        // document.getElementById("avatar-update-fail").innerHTML = "";
        firebase.storage().ref('users/' + localStorage.getItem("iduser") + '/profile.jpg').put(file).then(function () {
            // document.getElementById("avatar-update-success").innerHTML = "Cập nhật ảnh đại diện thành công";
            Notification("Cập nhật ảnh đại diện thành công");
            setTimeout(function () {
                location.reload();
            }, 3000)
        }).catch(error => {
            Notification("Cập nhật ảnh đại diện thất bại");
        })
    } else if (file == undefined) {
        Notification("Vui lòng chọn ảnh");
    } else {
        Notification("Dung lượng ảnh vượt quá 2MB");
    }
}
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        firebase.storage().ref('users/' + localStorage.getItem("iduser") + '/profile.jpg').getDownloadURL().then(imgUrl => {
            img.src = imgUrl;
        })
    }
})




function changeName() {
    const updateinfo = document.querySelector('#updateinfo');
    var user = firebase.auth().currentUser;
    const name = updateinfo['name'].value;
    localStorage.setItem("name", name);
    user.updateProfile({
        displayName: name,
    }).then(function () {
        Notification("Thay đổi tên người dùng thành công");
    }).catch(function (error) {
        Notification("Thay đổi tên người dùng thất bại");
    });
};

function changePassword() {
    const updatepassword = document.querySelector('#updatepassword');
    var user = firebase.auth().currentUser;
    const password = updatepassword['password'].value;
    user.updatePassword(password).then(() => {
        Notification("Thay đổi mật khẩu thành công");
    }).catch((error) => {
        Notification("Thay đổi mật khẩu thất bại. Lỗi: " + error);
        Console.log(error);
    });
};


document.getElementById("name").value = localStorage.getItem("name");


const updateinfo = document.querySelector('#updateinfo');
updateinfo.addEventListener('submit', (e) => {
    e.preventDefault();
    changeName();
})

const updatepassword = document.querySelector('#updatepassword');
updatepassword.addEventListener('submit', (e) => {
    e.preventDefault();
    changePassword();
})



$(document).ready(function () {
    $("#file-input").on('change', function () {
        uploadImage();
    });
});