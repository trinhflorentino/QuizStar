//Handle UI
if (localStorage.getItem("isProjector") === 'true') {
    if (localStorage.getItem("isDisplayAvatar") === 'false') {
        var elements = document.getElementsByClassName("player-image");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
    }
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

var nameref1 = firebase.database().ref(matchid + "/games/player1");
var nameref2 = firebase.database().ref(matchid + "/games/player2");
var nameref3 = firebase.database().ref(matchid + "/games/player3");
var nameref4 = firebase.database().ref(matchid + "/games/player4");


var point1 = firebase.database().ref(matchid + '/point/player1');
var point2 = firebase.database().ref(matchid + '/point/player2');
var point3 = firebase.database().ref(matchid + '/point/player3');
var point4 = firebase.database().ref(matchid + '/point/player4');

var pointsummary = document.getElementById("audio_8");


point1.on('value', p1);

function p1(points1) {
    var point2 = firebase.database().ref(matchid + '/point/player2');
    point2.on('value', p2);

    function p2(points2) {
        var point3 = firebase.database().ref(matchid + '/point/player3');
        point3.on('value', p3);

        function p3(points3) {
            var point4 = firebase.database().ref(matchid + '/point/player4');
            point4.on('value', p4);

            function p4(points4) {
                var nameref1 = firebase.database().ref(matchid + "/games/player1");
                nameref1.on("value", n1);

                function n1(names1) {
                    nameref2.on("value", n2);

                    function n2(names2) {
                        nameref3.on("value", n3);

                        function n3(names3) {
                            nameref4.on("value", n4);

                            function n4(names4) {
                                var pointts1 = points1.val().point;
                                var pointts2 = points2.val().point;
                                var pointts3 = points3.val().point;
                                var pointts4 = points4.val().point;
                                var nametts1 = names1.val().displayName;
                                var nametts2 = names2.val().displayName;
                                var nametts3 = names3.val().displayName;
                                var nametts4 = names4.val().displayName;
                                var uidts1 = names1.val().uid;
                                var uidts2 = names2.val().uid;
                                var uidts3 = names3.val().uid;
                                var uidts4 = names4.val().uid;


                                var point = [{
                                    name: nametts1,
                                    point: pointts1,
                                    uid: uidts1
                                },
                                {
                                    name: nametts2,
                                    point: pointts2,
                                    uid: uidts2
                                },
                                {
                                    name: nametts3,
                                    point: pointts3,
                                    uid: uidts3
                                },
                                {
                                    name: nametts4,
                                    point: pointts4,
                                    uid: uidts4
                                },
                                ]

                                point.sort(function (a, b) { return a.point - b.point });
                                var pointtt1 = document.getElementById("pointtt1");
                                var pointtt2 = document.getElementById("pointtt2");
                                var pointtt3 = document.getElementById("pointtt3");
                                var pointtt4 = document.getElementById("pointtt4");
                                var namett1 = document.getElementById("namett1");
                                var namett2 = document.getElementById("namett2");
                                var namett3 = document.getElementById("namett3");
                                var namett4 = document.getElementById("namett4");
                                pointtt1.innerHTML = point[0].point;
                                pointtt2.innerHTML = point[1].point;
                                pointtt3.innerHTML = point[2].point;
                                pointtt4.innerHTML = point[3].point;
                                namett1.innerHTML = point[0].name;
                                namett2.innerHTML = point[1].name;
                                namett3.innerHTML = point[2].name;
                                namett4.innerHTML = point[3].name;



                                firebase.storage().ref('users/' + point[0].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                    imgtt1.src = imgUrl;
                                }).catch((error) => {
                                    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                        imgtt1.src = imgUrl;
                                    })
                                });
                                firebase.storage().ref('users/' + point[1].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                    imgtt2.src = imgUrl;
                                }).catch((error) => {
                                    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                        imgtt2.src = imgUrl;
                                    })
                                });
                                firebase.storage().ref('users/' + point[2].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                    imgtt3.src = imgUrl;
                                }).catch((error) => {
                                    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                        imgtt3.src = imgUrl;
                                    })
                                });
                                firebase.storage().ref('users/' + point[3].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                    imgtt4.src = imgUrl;
                                }).catch((error) => {
                                    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                        imgtt4.src = imgUrl;
                                    })
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}


var point_object = document.getElementsByClassName('object-container');


setTimeout(function () {
    point_object[0].style.display = "block";
}, 0);


setTimeout(function () {
    point_object[0].style.display = "none";
    point_object[1].style.display = "block";
}, 3000);


setTimeout(function () {
    point_object[1].style.display = "none";
    point_object[2].style.display = "block";
}, 7000);

setTimeout(function () {
    point_object[2].style.display = "";
    point_object[3].style.display = "block";
}, 10000);

// // Reference to the Participant node
// var participantRef = firebase.database().ref(matchid + "/Participant/");

// // Check if uid exists and get requestStatus
// participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).on("value", function (snapshot) {
//     if (snapshot.exists()) {
//         var childData = snapshot.val();
//         var requestStatus = Object.values(childData)[0].requestStatus;
//         if (requestStatus === 2) {
//             alert("Bạn đã bị từ chối");
//             location.replace('Main.html');  // Replace with the appropriate URL
//         } else if (requestStatus === 3) {
//             alert("Bạn đã bị chặn bởi chủ phòng");
//             location.replace('Main.html');  // Replace with the appropriate URL
//         }
//     } else {
//         if (localStorage.getItem("id") == 5) {
//             alert("Bạn đã bị kick khỏi trận đấu");
//             location.replace('Main.html');  // Replace with the appropriate URL
//         }
//     }
// });


const data = JSON.parse(localStorage.getItem("themeData"));
if (localStorage.getItem("isGreenBackground") === 'false') {
    if (data.Background.startsWith("url")) {
        document.body.style.backgroundImage = data.Background;
    } else if (data.Background !== "") {
        document.body.style.background = data.Background;
    } else {
        document.body.style.backgroundImage = 'url("/img/NewBackground.png")';
    }
}
var PointObjectElement = document.getElementsByClassName("point");

for (var i = 0; i < PointObjectElement.length; i++) {
    PointObjectElement[i].style.background = CheckBackgroundValue(data.PointSummaryPointObject);
    PointObjectElement[i].style.backgroundSize = "cover";
    PointObjectElement[i].style.border = data.PointSummaryObjectBorder;
    PointObjectElement[i].style.color = data.PointSummaryTextColor;

}

var CompetitorObjectElement = document.getElementsByClassName("player-info");

for (var i = 0; i < CompetitorObjectElement.length; i++) {
    CompetitorObjectElement[i].style.background = CheckBackgroundValue(data.PointSummaryCompetitorObject);
    CompetitorObjectElement[i].style.backgroundSize = "cover";
    CompetitorObjectElement[i].style.border = data.PointSummaryObjectBorder;
    CompetitorObjectElement[i].style.color = data.PointSummaryTextColor;
}



function CheckBackgroundValue(BackgroundVal) {
    if (BackgroundVal.startsWith("url")) {
        return BackgroundVal + "no-repeat";
    } else {
        return BackgroundVal;
    }
}