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

var IntroNum = firebase.database().ref(matchid + "/IntroNum");
IntroNum.on("value", INum);
function INum(num) {
    switch (num.val().intronum) {
        case '1':
            var introvid = document.getElementById("audio_0");
            var intro = firebase.storage().ref(matchid + '/video/intro.mp4');
            intro.getDownloadURL().then(vidUrl => {
                audio_0.src = vidUrl;
            })
            introvid.play();
            break;
        case '2':
            var introvid = document.getElementById("audio_0");
            var intro = firebase.storage().ref(matchid + '/video/kd/intro.mp4');
            intro.getDownloadURL().then(vidUrl => {
                audio_0.src = vidUrl;
            })
            introvid.play();
            break;
        case '3':
            var introvid = document.getElementById("audio_0");
            var intro = firebase.storage().ref(matchid + '/video/vcnv/intro.mp4');
            intro.getDownloadURL().then(vidUrl => {
                audio_0.src = vidUrl;
            })
            introvid.play();
            break;
        case '4':
            var introvid = document.getElementById("audio_0");
            var intro = firebase.storage().ref(matchid + '/video/tt/intro.mp4');
            intro.getDownloadURL().then(vidUrl => {
                audio_0.src = vidUrl;
            })
            introvid.play();
            break;
        case '5':
            var introvid = document.getElementById("audio_0");
            var intro = firebase.storage().ref(matchid + '/video/vd/intro.mp4');
            intro.getDownloadURL().then(vidUrl => {
                audio_0.src = vidUrl;
            })
            introvid.play();
            break;
        default:
            var videoLink = firebase.database().ref(matchid + "/CustomVideo/" + num.val().intronum);
            videoLink.on('value', function (snapshot) {
                // var introvid = document.getElementById("audio_0");
                // var intro = firebase.storage().ref(matchid + '/video/' + snapshot.val().link);
                // intro.getDownloadURL().then(vidUrl => {
                //     audio_0.src = vidUrl;
                // })
                // introvid.play();
                var iframe = document.getElementById("iframe_0");
                iframe.src = snapshot.val().embededLink;
            });
    }
}






refintroreplay = firebase.database().ref(matchid + "/replayintro");
refintroreplay.on('value', replay);

function replay(Data) {
    if (Data.val().intro == 1) {
        var introvid = document.getElementById("audio_0");
        introvid.play();
    }
}


setInterval(function () {
    var intro = {
        intro: 0
    };
    refintroreplay.set(intro);
}, 7000)



var p = firebase.database().ref(matchid + "/games/player" + localStorage.getItem("id"));

p.on("value", pkick);

function pkick(uid1) {
    if (uid1.val().uid == "" && localStorage.getItem("id") != 5 && window.location.pathname != "/Main.html" && window.location.pathname != "/Information.html" && uid1.val().id == 0) {
        alert("Bạn đã bị Host kick khỏi trận đấu");
        location.replace("/Main.html");
    }
}

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