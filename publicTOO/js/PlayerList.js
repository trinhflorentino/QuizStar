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






var tsuidRef1 = firebase.database().ref(matchid + '/games/player1');
tsuidRef1.on('value', Data)

function Data(dt) {
    var tspointRef1 = firebase.database().ref(matchid + '/point/player1');
    tspointRef1.on('value', point1)

    function point1(pointsv1) {
        ps1 = pointsv1.val().point;
        var points1 = document.getElementById("points1");
        points1.innerHTML = ps1;
    };
    var ts1uid = dt.val().uid;
    var ts1name = dt.val().displayName;
    if (ts1name != "N/A" && window.location.pathname != "/PointUpdate.html" && window.location.pathname != "/PasswordUpdate.html" && window.location.pathname != "/Result.html" && window.location.pathname != "/Obstacle.html"  && window.location.pathname != "/Result.html"  && window.location.pathname != "/PointSummary.html" && window.location.pathname != "/ObstacleGreenScreen.html" && window.location.pathname != "/PointSummaryGreenScreen.html") Notification("Thí sinh " + ts1name +" đã tham gia trận đấu");
    localStorage.setItem("ts1name", dt.val().displayName);
    localStorage.setItem("ts1uid", ts1uid);
    firebase.storage().ref('users/' + localStorage.getItem("ts1uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts1.src = imgUrl;
        document.getElementById("ts1").src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts1.src = imgUrl;

        })
    });

    var ts1ten = document.getElementById("tents1");
    ts1ten.innerHTML = ts1name;
}

var tsuidRef2 = firebase.database().ref(matchid + '/games/player2');
tsuidRef2.on('value', Data2)

function Data2(dt) {
    var tspointRef2 = firebase.database().ref(matchid + '/point/player2');
    tspointRef2.on('value', point2)

    function point2(pointsv2) {
        ps2 = pointsv2.val().point;
        var points2 = document.getElementById("points2");
        points2.innerHTML = ps2;
    };
    var ts2uid = dt.val().uid;
    var ts2name = dt.val().displayName;
    localStorage.setItem("ts2name", dt.val().displayName);
    localStorage.setItem("ts2uid", ts2uid);
    if (ts2name != "N/A" && window.location.pathname != "/PointUpdate.html" && window.location.pathname != "/PasswordUpdate.html" && window.location.pathname != "/Result.html" && window.location.pathname != "/Obstacle.html"  && window.location.pathname != "/Result.html"  && window.location.pathname != "/PointSummary.html" && window.location.pathname != "/ObstacleGreenScreen.html" && window.location.pathname != "/PointSummaryGreenScreen.html") Notification("Thí sinh " + ts2name +" đã tham gia trận đấu");
    firebase.storage().ref('users/' + localStorage.getItem("ts2uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts2.src = imgUrl;

    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts2.src = imgUrl;

        })
    });
    var ts2ten = document.getElementById("tents2");
    ts2ten.innerHTML = ts2name;
}



var tsuidRef3 = firebase.database().ref(matchid + '/games/player3');
tsuidRef3.on('value', Data3)

function Data3(dt) {
    var tspointRef3 = firebase.database().ref(matchid + '/point/player3');
    tspointRef3.on('value', point3)

    function point3(pointsv3) {
        ps3 = pointsv3.val().point;
        var points3 = document.getElementById("points3");
        points3.innerHTML = ps3;
    };
    var ts3uid = dt.val().uid;
    var ts3name = dt.val().displayName;
    localStorage.setItem("ts3uid", ts3uid);
    localStorage.setItem("ts3name", dt.val().displayName);
    if (ts3name != "N/A" && window.location.pathname != "/PointUpdate.html" && window.location.pathname != "/PasswordUpdate.html" && window.location.pathname != "/Obstacle.html"  && window.location.pathname != "/Result.html"  && window.location.pathname != "/PointSummary.html" && window.location.pathname != "/ObstacleGreenScreen.html" && window.location.pathname != "/PointSummaryGreenScreen.html") Notification("Thí sinh " + ts3name +" đã tham gia trận đấu");
    firebase.storage().ref('users/' + localStorage.getItem("ts3uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts3.src = imgUrl;

    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts3.src = imgUrl;

        })
    });
    var ts3ten = document.getElementById("tents3");
    ts3ten.innerHTML = ts3name;
}


var tsuidRef4 = firebase.database().ref(matchid + '/games/player4');
tsuidRef4.on('value', Data4)

function Data4(dt) {
    var tspointRef4 = firebase.database().ref(matchid + '/point/player4');
    tspointRef4.on('value', point4)

    function point4(pointsv4) {
        ps4 = pointsv4.val().point;
        var points4 = document.getElementById("points4");
        points4.innerHTML = ps4;
    };
    var ts4uid = dt.val().uid;
    var ts4name = dt.val().displayName;
    localStorage.setItem("ts4name", dt.val().displayName);
    localStorage.setItem("ts4uid", ts4uid);
    if (ts4name != "N/A" && window.location.pathname != "/PointUpdate.html" && window.location.pathname != "/PasswordUpdate.html" && window.location.pathname != "/Obstacle.html"  && window.location.pathname != "/Result.html"  && window.location.pathname != "/PointSummary.html" && window.location.pathname != "/ObstacleGreenScreen.html" && window.location.pathname != "/PointSummaryGreenScreen.html") Notification("Thí sinh " + ts4name +" đã tham gia trận đấu");
    firebase.storage().ref('users/' + localStorage.getItem("ts4uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts4.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts4.src = imgUrl;
        })
    });
    var ts4ten = document.getElementById("tents4");
    ts4ten.innerHTML = ts4name;
}