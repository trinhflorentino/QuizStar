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


let ScoreboardIdValue;
let ScoreboardId;

do {
    ScoreboardIdValue = prompt("Nhập vị trí của bảng điểm (1-4): ");
    ScoreboardId = parseInt(ScoreboardIdValue);

    if (ScoreboardId < 1 || ScoreboardId > 4 || isNaN(ScoreboardId)) {
        alert("Vui lòng nhập một số từ 1 đến 4.");
    }
} while (ScoreboardId < 1 || ScoreboardId > 4 || isNaN(ScoreboardId));



var tsuidRef = firebase.database().ref(matchid + '/games/player' + ScoreboardId);
tsuidRef.on('value', Data)

function Data(dt) {
    var tspointRef = firebase.database().ref(matchid + '/point/player' + ScoreboardId);
    tspointRef.on('value', point)

    function point(pointsv) {
        ps = pointsv.val().point;
        var point = document.getElementById("competitor-point");
        point.innerHTML = ps;
    };
    var name = document.getElementById("competitor-name");
    name.innerHTML = dt.val().displayName;
}

