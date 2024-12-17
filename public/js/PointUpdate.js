// auth.onAuthStateChanged(function(user) {

//     if (user) {
//         user.getIdTokenResult().then(idTokenResult => {
//             user.admin = idTokenResult.claims.admin;
//             if (user.admin == true) {} else {
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


var idhost = firebase.database().ref('/' + matchid);
idhost.on('value', hostid);
function hostid(id) {
    auth.onAuthStateChanged(function(user) {
    if (auth.currentUser.uid != id.val().hostid && auth.currentUser.uid != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1") {
    alert("Bạn không phải là Host của trận/giải đấu này. Hãy tạo trận đấu mới!");
    location.replace("Main.html");
    }
})
}

var ts1point = firebase.database().ref(matchid + '/point/player1');
var ts2point = firebase.database().ref(matchid + '/point/player2');
var ts3point = firebase.database().ref(matchid + '/point/player3');
var ts4point = firebase.database().ref(matchid + '/point/player4');


ts1point.on("value", point1);

function point1(p1) {
    document.getElementById("points1").value = p1.val().point;
}
ts2point.on("value", point2);

function point2(p2) {
    document.getElementById("points2").value = p2.val().point;
}
ts3point.on("value", point3);

function point3(p3) {
    document.getElementById("points3").value = p3.val().point;
}
ts4point.on("value", point4);

function point4(p4) {
    document.getElementById("points4").value = p4.val().point;
}





function uploadPoint() {

    var points1 = firebase.database().ref(matchid + "/point/player1");
    var points2 = firebase.database().ref(matchid + "/point/player2");
    var points3 = firebase.database().ref(matchid + "/point/player3");
    var points4 = firebase.database().ref(matchid + "/point/player4");
    const PTFORM = document.querySelector('#pointupdate');
    var pointts1 = parseInt(PTFORM['points1'].value);
    var pointts2 = parseInt(PTFORM['points2'].value);
    var pointts3 = parseInt(PTFORM['points3'].value);
    var pointts4 = parseInt(PTFORM['points4'].value);

    if (pointts1 == '') {
        var p = {
            point: 0,
        }
        points1.set(p);
    }
    if (pointts2 == '') {
        var p = {
            point: 0,
        }
        points2.set(p);
    }
    if (pointts3 == '') {
        var p = {
            point: 0,
        }
        points3.set(p);
    }
    if (pointts4 == '') {
        var p = {
            point: 0,
        }
        points4.set(p);
    }


    if (pointts1) {
        var p = {
            point: pointts1,
        }
        points1.set(p);
    }
    if (pointts2) {
        var p2 = {
            point: pointts2,
        }
        points2.set(p2);
    }

    if (pointts3) {
        var p3 = {
            point: pointts3,
        }
        points3.set(p3);
    }
    if (pointts4) {
        var p4 = {
            point: pointts4,
        }
        points4.set(p4);
    }
    setTimeout(function(){
    window.close();
    },3000);
    Notification("Cập nhật điểm số thành công");
};