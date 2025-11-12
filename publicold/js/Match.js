var id = 0;

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


function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}

var matchid = getCookie("matchid");

function setItemRendering() {
    localStorage.setItem("isProjector", 'false');
    localStorage.setItem("isGreenBackground", 'false');
    localStorage.setItem("isDisplayAvatar", 'true');
    // localStorage.setItem("isCustomBackground", false);
    // localStorage.setItem("BackgroundImagePath", "");
}

function join1() {

    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid exists and get requestStatus
    participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;

            if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
                return;
            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            }
            else {
                Notification("Bạn đang tham gia một vai trò khác. Liên hệ Host để Kick bạn khỏi vai trò hiện tại");
            }

        } else {
            var p1 = firebase.database().ref(matchid + "/games/player1");

            p1.once("value", p1uid);

            function p1uid(uid1) {
                if (uid1.val().uid == "") {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins1 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 1
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player1").set(joins1);
                    localStorage.setItem("id", 1);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid1.val().uid == null) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins1 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 1
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player1").set(joins1);
                    localStorage.setItem("id", 1);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid1.val().uid != "" && uid1.val().uid != localStorage.getItem("iduser")) {
                    Notification("Vị trí 1 đã có thí sinh tham gia");
                }
                if (uid1.val().uid == localStorage.getItem("iduser")) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins1 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 1
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player1").set(joins1);
                    localStorage.setItem("id", 1);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }

            }
        }
    });

}




function join2() {
    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid exists and get requestStatus
    participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;
            if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
                return;
            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            }
            else {
                Notification("Bạn đang tham gia một vai trò khác. Liên hệ Host để Kick bạn khỏi vai trò hiện tại");
            }

        } else {
            var p2 = firebase.database().ref(matchid + "/games/player2");
            p2.once("value", p2uid);

            function p2uid(uid2) {
                if (uid2.val().uid == "") {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins2 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 2
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player2").set(joins2);
                    localStorage.setItem("id", 2);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid2.val().uid == null) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins2 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 2
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player2").set(joins2);
                    localStorage.setItem("id", 2);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid2.val().uid != "" && uid2.val().uid != localStorage.getItem("iduser")) {
                    Notification("Vị trí 2 đã có thí sinh tham gia");
                }
                if (uid2.val().uid == localStorage.getItem("iduser")) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins2 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 2
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player2").set(joins2);
                    localStorage.setItem("id", 2);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
            }
        }
    });


}

function join3() {
    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid exists and get requestStatus
    participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;

            if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
                return;
            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            }
            else {
                Notification("Bạn đang tham gia một vai trò khác. Liên hệ Host để Kick bạn khỏi vai trò hiện tại");
            }

        } else {

            Notification("Tham gia phòng trò chơi thành công");

            var p3 = firebase.database().ref(matchid + "/games/player3");

            p3.once("value", p3uid);

            function p3uid(uid3) {
                if (uid3.val().uid == "") {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins3 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 3
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player3").set(joins3);
                    localStorage.setItem("id", 3);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid3.val().uid == null) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins3 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 3
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player3").set(joins3);
                    localStorage.setItem("id", 3);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid3.val().uid != "" && uid3.val().uid != localStorage.getItem("iduser")) {
                    Notification("Vị trí 3 đã có thí sinh tham gia");
                }
                if (uid3.val().uid == localStorage.getItem("iduser")) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins3 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 3
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player3").set(joins3);
                    localStorage.setItem("id", 3);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
            }
        }
    });

}



function join4() {
    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid exists and get requestStatus
    participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;

            if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
                return;
            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            }
            else {
                Notification("Bạn đang tham gia một vai trò khác. Liên hệ Host để Kick bạn khỏi vai trò hiện tại");
            }

        } else {
            var p4 = firebase.database().ref(matchid + "/games/player4");
            p4.once("value", p4uid);

            function p4uid(uid4) {
                if (uid4.val().uid == "") {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins4 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 4
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player4").set(joins4);
                    localStorage.setItem("id", 4);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid4.val().uid == null) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins4 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 4
                    };
                    firebase.database().ref(matchid + "/games/player4").set(joins4);
                    setItemRendering();
                    localStorage.setItem("id", 4);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
                if (uid4.val().uid != "" && uid4.val().uid != localStorage.getItem("iduser")) {
                    Notification("Vị trí 4 đã có thí sinh tham gia");
                }
                if (uid4.val().uid == localStorage.getItem("iduser")) {
                    Notification("Tham gia phòng trò chơi thành công");
                    var joins4 = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 4
                    };
                    setItemRendering();
                    firebase.database().ref(matchid + "/games/player4").set(joins4);
                    localStorage.setItem("id", 4);
                    setTimeout(function () {
                        location.replace('Room.html');
                    }, 3000);
                }
            }
        }
    });



}

// Notification("Tham gia phòng trò chơi thành công.")
// setTimeout(function () {
//     location.replace('Room.html');
//     localStorage.setItem("id", 5);
// }, 3000);

function joinMAYCHIEU() {
    var uid = localStorage.getItem("iduser");
    var displayName = localStorage.getItem("name");

    var joinMayChieu = {
        uid: uid,
        displayName: displayName,
        role: "Viewer",
        requestStatus: 0,
    };

    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid already exists
    participantRef.orderByChild("uid").equalTo(uid).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;

            if (requestStatus === 1) {
                // Prompt the user for isProjector
                var isProjector = confirm("Đây có phải là máy chiếu không?");
                localStorage.setItem("isProjector", isProjector);

                if (isProjector) {
                    // Prompt the user for isGreenBackground if isProjector is true
                    var isGreenBackground = confirm("Bạn có muốn sử dụng nền xanh không?");
                    localStorage.setItem("isGreenBackground", isGreenBackground);

                    if (isGreenBackground) {
                        // Prompt the user for isDisplayAvatar if isGreenBackground is true
                        var isDisplayAvatar = confirm("Bạn có muốn hiển thị Avatar thí sinh không?");
                        localStorage.setItem("isDisplayAvatar", isDisplayAvatar);
                    } else {

                        // Prompt the user for isDisplayAvatar
                        var isDisplayAvatar = confirm("Bạn có muốn hiển thị Avatar thí sinh không?");
                        localStorage.setItem("isDisplayAvatar", isDisplayAvatar);
                    }
                } else {
                    // Set isGreenBackground to false and isDisplayAvatar to true if isProjector is false
                    localStorage.setItem("isGreenBackground", false);
                    localStorage.setItem("isDisplayAvatar", true);
                }
                Notification("Tham gia phòng trò chơi thành công.");
                localStorage.setItem("id", 5);
                setTimeout(function () {
                    location.replace('Room.html');
                }, 3000);

            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            } else if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
            } else {
                Notification("Bạn đã yêu cầu tham gia. Vui lòng chờ xác nhận.");
            }
        } else {
            participantRef.push(joinMayChieu).then(function () {
                Notification("Yêu cầu tham gia đã được gửi. Vui lòng chờ xác nhận.");
            }).catch(function (error) {
                console.error("Error writing new message to Firebase Database", error);
            });
        }
    });
}


function joinMC() {

    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid exists and get requestStatus
    participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;

            if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
                return;
            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            }
            else {
                Notification("Bạn đang tham gia một vai trò khác. Liên hệ Host để Kick bạn khỏi vai trò hiện tại");
            }

        } else {
            var mc = firebase.database().ref(matchid + "/games/mc");

            mc.once("value", mcuid);

            function mcuid(uid5) {
                Notification("Tham gia phòng trò chơi thành công.");
                if (uid5.val().uid == "") {
                    var joinmc = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 5
                    };
                    firebase.database().ref(matchid + "/games/mc").set(joinmc);
                    localStorage.setItem("id", 6);
                    setTimeout(function () {
                        location.replace('MC.html');
                    }, 3000);
                }
                if (uid5.val().uid == null) {
                    Notification("Tham gia phòng trò chơi thành công.");
                    var joinmc = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 5
                    };
                    firebase.database().ref(matchid + "/games/mc").set(joinmc);
                    localStorage.setItem("id", 6);
                    setTimeout(function () {
                        location.replace('MC.html');
                    }, 3000);
                }
                if (uid5.val().uid != "" && uid5.val().uid != localStorage.getItem("iduser")) {
                    Notification("Vị trí MC đã có người tham gia.")
                }
                if (uid5.val().uid == localStorage.getItem("iduser")) {
                    Notification("Tham gia phòng trò chơi thành công.");
                    var joinmc = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 5
                    };
                    firebase.database().ref(matchid + "/games/mc").set(joinmc);
                    localStorage.setItem("id", 6);
                    setTimeout(function () {
                        location.replace('MC.html');
                    }, 3000);
                }
            }
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            firebase.firestore().collection(matchid).doc(localStorage.getItem("iduser")).set({
                time: dateTime,
                uid: localStorage.getItem("iduser"),
                name: localStorage.getItem("name"),
                matchid: matchid,
            }).then(() => {
                {

                }
            });
        }
    });


}


function joinMC2() {

    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid exists and get requestStatus
    participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;
            if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
                return;
            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            }
            else {
                Notification("Bạn đang tham gia một vai trò khác. Liên hệ Host để Kick bạn khỏi vai trò hiện tại");
            }
        } else {
            var mc = firebase.database().ref(matchid + "/games/mc2");

            mc.once("value", mcuid);

            function mcuid(uid6) {
                Notification("Tham gia phòng trò chơi thành công.");
                if (uid6.val().uid == "") {
                    var joinmc = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 6
                    };
                    firebase.database().ref(matchid + "/games/mc2").set(joinmc);
                    setTimeout(function () {
                        location.replace('MC.html');
                        localStorage.setItem("id", 7);
                    }, 3000);
                }
                if (uid6.val().uid == null) {
                    Notification("Tham gia phòng trò chơi thành công.");
                    var joinmc = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 6
                    };
                    firebase.database().ref(matchid + "/games/mc2").set(joinmc);
                    setTimeout(function () {
                        location.replace('MC.html');
                        localStorage.setItem("id", 7);
                    }, 3000);
                }
                if (uid6.val().uid != "" && uid6.val().uid != localStorage.getItem("iduser")) {
                    Notification("Vị trí MC đã có người tham gia.")
                }
                if (uid6.val().uid == localStorage.getItem("iduser")) {
                    Notification("Tham gia phòng trò chơi thành công.");
                    var joinmc = {
                        uid: localStorage.getItem("iduser"),
                        displayName: localStorage.getItem("name"),
                        id: 6
                    };
                    firebase.database().ref(matchid + "/games/mc2").set(joinmc);
                    setTimeout(function () {
                        location.replace('MC.html');
                        localStorage.setItem("id", 7);
                    }, 3000);
                }
            }
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            firebase.firestore().collection(matchid).doc(localStorage.getItem("iduser")).set({
                time: dateTime,
                uid: localStorage.getItem("iduser"),
                name: localStorage.getItem("name"),
                matchid: matchid,
            }).then(() => {
                {

                }
            });
        }
    });


}


function joinBANGDIEM() {
    var uid = localStorage.getItem("iduser");
    var displayName = localStorage.getItem("name");

    var joinBangDiem = {
        uid: uid,
        displayName: displayName,
        role: "Scoreboard",
        requestStatus: 0,
    };

    // Reference to the Participant node
    var participantRef = firebase.database().ref(matchid + "/Participant/");

    // Check if uid already exists
    participantRef.orderByChild("uid").equalTo(uid).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var childData = snapshot.val();
            var requestStatus = Object.values(childData)[0].requestStatus;

            if (requestStatus === 1) {
                Notification("Tham gia phòng trò chơi thành công.");
                localStorage.setItem("id", 7);
                setTimeout(function () {
                    location.replace('Scoreboard.html');
                }, 3000);
            } else if (requestStatus === 2) {
                Notification("Bạn đã bị từ chối");
                participantRef.child(Object.keys(childData)[0]).remove();
            } else if (requestStatus === 3) {
                Notification("Bạn đã bị chặn bởi chủ phòng");
            } else {
                Notification("Bạn đã yêu cầu tham gia. Vui lòng chờ xác nhận.");
            }
        } else {
            participantRef.push(joinBangDiem).then(function () {
                Notification("Yêu cầu tham gia đã được gửi. Vui lòng chờ xác nhận.");
            }).catch(function (error) {
                console.error("Error writing new message to Firebase Database", error);
            });
        }
    });
}





function quit() {
    var exit = {
        uid: "",
        displayName: "N/A",
        id: 0,
    };
    firebase.database().ref(matchid + "/games/player" + localStorage.getItem("id")).set(exit);
    localStorage.setItem("id", -1);
    setTimeout(function () { location.replace("Main.html") }, 1000)
}



if (localStorage.getItem("id") == -1 && window.location.pathname != "/Main.html" && window.location.pathname != "/Information.html" && window.location.pathname != "/Result.html") {
    alert("Vui lòng chọn vị trí trước khi vào phòng đấu!");
    location.replace("/Main.html");
}


function Technician() {
    if (localStorage.getItem("iduser") != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1") {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        firebase.firestore().collection("Technician").doc(matchid).set({
            time: dateTime,
            uid: localStorage.getItem("iduser"),
            name: localStorage.getItem("name"),
            matchid: matchid,
        }).then(() => {
            {
                location.replace("Technician.html");
            }
        });
    } else {
        location.replace("Technician.html");
    }
}



var player = firebase.database().ref(matchid + "/games/player" + localStorage.getItem("id"));

player.once("value", playeruid);

function playeruid(uid5) {
    if (uid5.val().uid != "" && uid5.val().uid != localStorage.getItem("iduser") && window.location.pathname != "/Main.html" && window.location.pathname != "/Information.html") {
        alert("Bạn không phải là thí sinh của phòng trò chơi này!");
        location.replace("/Main.html");
    }
}





var p = firebase.database().ref(matchid + "/games/player" + localStorage.getItem("id"));

p.on("value", pkick);

function pkick(uid1) {
    if (uid1.val().uid == "" && localStorage.getItem("id") != 5 && window.location.pathname != "/Main.html" && window.location.pathname != "/Information.html" && uid1.val().id == 0) {
        Notification("Bạn đã rời phòng trò chơi");
        setTimeout(function () {
            location.replace("/Main.html");
        }, 3000);
    }

}


// var joins4 = {
//     uid: localStorage.getItem("iduser"),
//     displayName: localStorage.getItem("name"),
//     role: "Player1",
//     requestStatus: 0,
// };
// firebase.database().ref(matchid + "/Participant/").push(joins4);

