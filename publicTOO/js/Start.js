//Handle UI
if (localStorage.getItem("isProjector") === 'true') {
    if (localStorage.getItem("isDisplayAvatar") === 'false') {
        var elements = document.getElementsByClassName("tsimg");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
    }
    if (localStorage.getItem("isGreenBackground") === 'true') {
        // var body = document.getElementsByTagName('body')[0];
        // body.style.backgroundImage = 'none';
        // body.style.backgroundColor = '#00b140';
        document.getElementById("competition-name").innerHTML = "";
    }
}



document.getElementById("audio").volume = 0.5;
document.getElementById("audio_1").volume = 0.5;
document.getElementById("audio_2").volume = 0.5;
document.getElementById("audio_3.1").volume = 0.5;
document.getElementById("audio_3.2").volume = 0.5;
document.getElementById("audio_3.3").volume = 0.5;
document.getElementById("audio_4").volume = 0.5;
document.getElementById("audio_5").volume = 0.5;
document.getElementById("audio_6").volume = 0.5;
document.getElementById("audio_7").volume = 0.5;
document.getElementById("audio_extra_11").volume = 0.5;

shortcut.add("F12", function () {
    Notification("Không được bật F12 trong phần thi này");
});
shortcut.add("Ctrl+Shift+I", function () {
    Notification("Không được bật kiểm tra phần tử trong phần thi này");
});



document.addEventListener('contextmenu', event => event.preventDefault());
setTimeout(function () {
    var
        el = document.documentElement,
        rfs =
            el.requestFullScreen ||
            el.webkitRequestFullScreen ||
            el.mozRequestFullScreen;
    rfs.call(el);
}, 3000);

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


var currentQuestion = "";


var tsuidRef1 = firebase.database().ref(matchid + '/games/player1');
tsuidRef1.on('value', Data1)

function Data1(dt) {
    var tspointRef1 = firebase.database().ref(matchid + '/point/player1');
    tspointRef1.on('value', point1)

    function point1(pointsv1) {
        ps1 = pointsv1.val().point;
        var points1 = document.getElementById("ts1point");
        points1.innerHTML = ps1;
    };
    var ts1uid = dt.val().uid;
    var ts1name = dt.val().displayName;
    localStorage.setItem("ts1name", dt.val().displayName);
    localStorage.setItem("ts1uid", ts1uid);
    firebase.storage().ref('users/' + localStorage.getItem("ts1uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts1img.src = imgUrl;

    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts1img.src = imgUrl;
        })
    });
    var ts1ten = document.getElementById("ts1name");
    ts1ten.innerHTML = ts1name;
}


var tsuidRef2 = firebase.database().ref(matchid + '/games/player2');
tsuidRef2.on('value', Data2)

function Data2(dt) {
    var tspointRef2 = firebase.database().ref(matchid + '/point/player2');
    tspointRef2.on('value', point2)

    function point2(pointsv2) {
        ps2 = pointsv2.val().point;
        var points2 = document.getElementById("ts2point");
        points2.innerHTML = ps2;
    };
    var ts2uid = dt.val().uid;
    var ts2name = dt.val().displayName;
    localStorage.setItem("ts2name", dt.val().displayName);
    localStorage.setItem("ts2uid", ts2uid);
    firebase.storage().ref('users/' + localStorage.getItem("ts2uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts2img.src = imgUrl;

    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts2img.src = imgUrl;

        })
    });
    var ts2ten = document.getElementById("ts2name");
    ts2ten.innerHTML = ts2name;
}



var tsuidRef3 = firebase.database().ref(matchid + '/games/player3');
tsuidRef3.on('value', Data3)

function Data3(dt) {
    var tspointRef3 = firebase.database().ref(matchid + '/point/player3');
    tspointRef3.on('value', point3)

    function point3(pointsv3) {
        ps3 = pointsv3.val().point;
        var points3 = document.getElementById("ts3point");
        points3.innerHTML = ps3;
    };
    var ts3uid = dt.val().uid;
    var ts3name = dt.val().displayName;
    localStorage.setItem("ts3uid", ts3uid);
    localStorage.setItem("ts3name", dt.val().displayName);
    firebase.storage().ref('users/' + localStorage.getItem("ts3uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts3img.src = imgUrl;

    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts3img.src = imgUrl;

        })
    });
    var ts3ten = document.getElementById("ts3name");
    ts3ten.innerHTML = ts3name;
}


var tsuidRef4 = firebase.database().ref(matchid + '/games/player4');
tsuidRef4.on('value', Data4)

function Data4(dt) {
    var tspointRef4 = firebase.database().ref(matchid + '/point/player4');
    tspointRef4.on('value', point4)

    function point4(pointsv4) {
        ps4 = pointsv4.val().point;
        var points4 = document.getElementById("ts4point");
        points4.innerHTML = ps4;
    };
    var ts4uid = dt.val().uid;
    var ts4name = dt.val().displayName;
    localStorage.setItem("ts4name", dt.val().displayName);
    localStorage.setItem("ts4uid", ts4uid);
    firebase.storage().ref('users/' + localStorage.getItem("ts4uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts4img.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts4img.src = imgUrl;
        })
    });
    var ts4ten = document.getElementById("ts4name");
    ts4ten.innerHTML = ts4name;
}


var playerstatus = firebase.database().ref(matchid + '/playerstatus/khoidong');
playerstatus.on('value', Data)



function Data(dt0) {
    if (dt0.val().player == 0) {

        setSelectingPlayer(0);
    }
    if (dt0.val().player == 1) {
        setSelectingPlayer(1);



        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");


        // var ansbar1 = document.getElementById("answerts1");
        // var ansbar2 = document.getElementById("answerts2");
        // var ansbar3 = document.getElementById("answerts3");
        // var ansbar4 = document.getElementById("answerts4");


        qsbar1.style.display = "block";
        qsbar2.style.display = "none";
        qsbar3.style.display = "none";
        qsbar4.style.display = "none";

        // ansbar1.style.display = "block";
        // ansbar2.style.display = "none";
        // ansbar3.style.display = "none";
        // ansbar4.style.display = "none";

        var qsreplace = firebase.database().ref(matchid + '/khoidong');
        qsreplace.on('value', causo);

        function causo(causo) {
            kdcauso = causo.val().causo;
            dapancauso = causo.val().causo - 1;
            if (kdcauso == 0) {
                var qsbar1 = document.getElementById("question1");
                qsbar1.innerHTML = '';
                document.getElementById("qsnum").innerHTML = "";
            }
            var qsdb1 = firebase.database().ref(matchid + '/StartQuestion/Q1DB/cau' + kdcauso);
            var asdb1 = firebase.database().ref(matchid + '/StartQuestion/Q1DB/dacau' + dapancauso);
            qsdb1.once('value', question);
            asdb1.once('value', answer);
            function question(qsdk) {
                if (kdcauso == 0 || kdcauso == 7) {
                    document.getElementById("qsnum").innerText = "";
                } else {
                    cauhoi = qsdk.val();
                    var refStatus = firebase.database().ref(matchid + "/Sounds");
                    refStatus.on('value', EnglishAudio);
                    function EnglishAudio(status) {
                        if (status.val().EnglishVoice == true) {
                            EnglishVoice(cauhoi);
                            if (currentQuestion != cauhoi) {
                                currentQuestion = cauhoi;
                            }
                            return false;
                        }
                    }
                    var qsbar1 = document.getElementById("question1");
                    qsbar1.innerHTML = cauhoi;
                    document.getElementById("qsnum").innerText = "Câu " + kdcauso + "/6:";
                }
            }
            function answer(ans) {
                // answerkd = ans.val();
                // var asbar1 = document.getElementById("answerts1");
                // asbar1.innerHTML = answerkd;
            }
        }
    }





    if (dt0.val().player == 2) {

        setSelectingPlayer(2);


        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");

        // var ansbar1 = document.getElementById("answerts1");
        // var ansbar2 = document.getElementById("answerts2");
        // var ansbar3 = document.getElementById("answerts3");
        // var ansbar4 = document.getElementById("answerts4");


        qsbar1.style.display = "none";
        qsbar2.style.display = "block";
        qsbar3.style.display = "none";
        qsbar4.style.display = "none";

        // ansbar1.style.display = "none";
        // ansbar2.style.display = "block";
        // ansbar3.style.display = "none";
        // ansbar4.style.display = "none";

        var qsreplace = firebase.database().ref(matchid + '/khoidong');
        qsreplace.on('value', causo);

        function causo(causo) {
            kdcauso = causo.val().causo;
            dapancauso = causo.val().causo - 1;
            if (kdcauso == 0) {
                var qsbar2 = document.getElementById("question2");
                qsbar2.innerHTML = '';
                document.getElementById("qsnum").innerHTML = "";
            }
            var qsdb2 = firebase.database().ref(matchid + '/StartQuestion/Q2DB/cau' + kdcauso);
            var asdb2 = firebase.database().ref(matchid + '/StartQuestion/Q2DB/dacau' + dapancauso);
            qsdb2.once('value', question)
            asdb2.once('value', answer)

            function question(qsdk) {
                if (kdcauso == 0 || kdcauso == 7) {
                    document.getElementById("qsnum").innerText = "";
                } else {
                    cauhoi = qsdk.val();
                    var refStatus = firebase.database().ref(matchid + "/Sounds");
                    refStatus.on('value', EnglishAudio);
                    function EnglishAudio(status) {
                        if (status.val().EnglishVoice == true) {
                            EnglishVoice(cauhoi);
                            if (currentQuestion != cauhoi) {
                                currentQuestion = cauhoi;
                            }
                            return false;
                        }
                    }
                    var qsbar2 = document.getElementById("question2");
                    qsbar2.innerHTML = cauhoi;
                    document.getElementById("qsnum").innerText = "Câu " + kdcauso + "/6:";
                }
            }
            function answer(ans) {

                // answerkd = ans.val();
                // var asbar2 = document.getElementById("answerts2");
                // asbar2.innerHTML = answerkd;
            }
        }

    }
    if (dt0.val().player == 3) {
        setSelectingPlayer(3);


        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");


        // var ansbar1 = document.getElementById("answerts1");
        // var ansbar2 = document.getElementById("answerts2");
        // var ansbar3 = document.getElementById("answerts3");
        // var ansbar4 = document.getElementById("answerts4");


        qsbar2.style.display = "none";
        qsbar3.style.display = "block";
        qsbar4.style.display = "none";

        // ansbar1.style.display = "none";
        // ansbar2.style.display = "none";
        // ansbar3.style.display = "block";
        // ansbar4.style.display = "none";

        var qsreplace = firebase.database().ref(matchid + '/khoidong');
        qsreplace.on('value', causo);

        function causo(causo) {
            kdcauso = causo.val().causo;
            dapancauso = causo.val().causo - 1;
            if (kdcauso == 0 || kdcauso == 7) {
                var qsbar3 = document.getElementById("question3");
                qsbar3.innerHTML = '';
                document.getElementById("qsnum").innerHTML = "";
            }
            var qsdb3 = firebase.database().ref(matchid + '/StartQuestion/Q3DB/cau' + kdcauso);
            var asdb3 = firebase.database().ref(matchid + '/StartQuestion/Q3DB/dacau' + dapancauso);
            qsdb3.once('value', question)
            asdb3.once('value', answer)
            function question(qsdk) {
                if (kdcauso == 0 || kdcauso == 7) {
                    document.getElementById("qsnum").innerText = "";
                } else {
                    cauhoi = qsdk.val();
                    var refStatus = firebase.database().ref(matchid + "/Sounds");
                    refStatus.on('value', EnglishAudio);
                    function EnglishAudio(status) {
                        if (status.val().EnglishVoice == true) {
                            EnglishVoice(cauhoi);
                            if (currentQuestion != cauhoi) {
                                currentQuestion = cauhoi;
                            }
                            return false;
                        }
                    }
                    var qsbar3 = document.getElementById("question3");
                    qsbar3.innerHTML = cauhoi;
                    document.getElementById("qsnum").innerText = "Câu " + kdcauso + "/6:";
                }
            }
            function answer(ans) {
                // answerkd = ans.val();
                // var asbar3 = document.getElementById("answerts3");
                // asbar3.innerHTML = answerkd;
            }
        }
    }
    if (dt0.val().player == 4) {
        setSelectingPlayer(4);

        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");

        // var ansbar1 = document.getElementById("answerts1");
        // var ansbar2 = document.getElementById("answerts2");
        // var ansbar3 = document.getElementById("answerts3");
        // var ansbar4 = document.getElementById("answerts4");


        qsbar1.style.display = "none";
        qsbar2.style.display = "none";
        qsbar3.style.display = "none";
        qsbar4.style.display = "block";

        // ansbar1.style.display = "none";
        // ansbar2.style.display = "none";
        // ansbar3.style.display = "none";
        // ansbar4.style.display = "block";

        var qsreplace = firebase.database().ref(matchid + '/khoidong');
        qsreplace.on('value', causo);

        function causo(causo) {
            kdcauso = causo.val().causo;
            dapancauso = causo.val().causo - 1;
            if (kdcauso == 0) {
                var qsbar4 = document.getElementById("question4");
                qsbar4.innerHTML = '';
                document.getElementById("qsnum").innerHTML = "";
            }
            var qsdb4 = firebase.database().ref(matchid + '/StartQuestion/Q4DB/cau' + kdcauso);
            var asdb4 = firebase.database().ref(matchid + '/StartQuestion/Q4DB/dacau' + dapancauso);
            qsdb4.once('value', question)
            asdb4.once('value', answer)
            function question(qsdk) {
                if (kdcauso == 0 || kdcauso == 7) {
                    document.getElementById("qsnum").innerText = "";
                } else {
                    cauhoi = qsdk.val();
                    var refStatus = firebase.database().ref(matchid + "/Sounds");
                    refStatus.on('value', EnglishAudio);
                    function EnglishAudio(status) {
                        if (status.val().EnglishVoice == true) {
                            EnglishVoice(cauhoi);
                            if (currentQuestion != cauhoi) {
                                currentQuestion = cauhoi;
                            }
                            return false;
                        }
                    }
                    var qsbar4 = document.getElementById("question4");
                    qsbar4.innerHTML = cauhoi;
                    document.getElementById("qsnum").innerText = "Câu " + kdcauso + "/6:";
                }
            }
            function answer(ans) {
                // answerkd = ans.val();
                // var asbar4 = document.getElementById("answerts4");
                // asbar4.innerHTML = answerkd;
            }
        }
    }
}

function setSelectingPlayer(player) {
    const data = JSON.parse(localStorage.getItem("themeData"));
    var ele = document.getElementsByClassName('ts-box');
    for (var i = 0; i < ele.length; i++) {
        ele[i].style.background = CheckBackgroundValue(data.StartCompetitor);
        ele[i].style.backgroundSize = "cover";
    }
    var selectingPlayer = document.getElementById("ts" + player);
    if (data.StartCompetitorSelecting !== "") {
        selectingPlayer.style.background = CheckBackgroundValue(data.StartCompetitorSelecting);
        selectingPlayer.style.backgroundSize = "cover";
    } else {
        selectingPlayer.style.background = 'linear-gradient(90deg, rgba(88,30,45,1) 0%, rgba(138,60,73,1) 80%)';
    }
}

var StartEmergencyStop = firebase.database().ref(matchid + '/StartEmergencyStop');
StartEmergencyStop.on('value', startestop);

function startestop(st) {
    if (st.val().stop == 0) {
        localStorage.setItem("timeremergencystop", 0);
    }
    if (st.val().stop == 1) {
        localStorage.setItem("timeremergencystop", 1);
    }
}

function EnglishVoice(question) {
    // Check browser support
    if ('speechSynthesis' in window && currentQuestion != question) {
        // Create a new instance of SpeechSynthesisUtterance
        var msg = new SpeechSynthesisUtterance();

        // Set the text to be spoken
        msg.text = question;

        // Set the voice (optional)
        // You can specify different voices and languages
        // e.g., msg.voice = speechSynthesis.getVoices()[0];
        msg.rate = 0.75;

        document.getElementById("audio_3.1").volume = 0.25;
        document.getElementById("audio_3.2").volume = 0.25;
        document.getElementById("audio_3.3").volume = 0.25;
        // Speak the text
        window.speechSynthesis.speak(msg);
        msg.onend = function (event) {
            document.getElementById("audio_3.1").volume = 0.5;
            document.getElementById("audio_3.2").volume = 0.5;
            document.getElementById("audio_3.3").volume = 0.5;
        }
    } else {
        // Browser doesn't support SpeechSynthesis API
        console.error('Speech synthesis not supported.');
    }
}


var khoidongstatus = firebase.database().ref(matchid + '/phanthistatus/khoidong');
khoidongstatus.on('value', hienthicauhoi);

function hienthicauhoi(dt4) {
    if (dt4.val().batdau == 1) {
        var startstart = document.getElementById("audio_1");
        startstart.play();
        document.getElementById("competition-name").style.display = "none";
        document.getElementById("competiton-ui").style.display = "flex";
        setTimeout(function () {
            var startprequestion = document.getElementById("audio_2");
            startprequestion.play();
            // Time();
        }, 3600);
        setTimeout(function () {
            var startTime_Phase1 = document.getElementById("audio_3.1");
            var startTime_Phase2 = document.getElementById("audio_3.2");
            var startTime_Phase3 = document.getElementById("audio_3.3");
            var finish60sec = document.getElementById("audio_6");
            var qsreplace = firebase.database().ref(matchid + '/khoidong');
            qsreplace.on('value', causo);
            function causo(causo) {
                kdcauso = causo.val().causo;
                console.log(kdcauso);
                currentQuestion = "";
                if (kdcauso > 0 && kdcauso < 4) {
                    startTime_Phase1.play();
                    startTime_Phase1.loop = true;
                } else if (kdcauso > 3 && kdcauso < 6) {
                    startTime_Phase1.pause();
                    startTime_Phase1.loop = false;
                    startTime_Phase1.currentTime = 0;
                    startTime_Phase2.play();
                    startTime_Phase2.loop = true;
                } else if (kdcauso == 6) {
                    startTime_Phase1.pause();
                    startTime_Phase2.pause();
                    startTime_Phase1.loop = false;
                    startTime_Phase2.loop = false;
                    startTime_Phase1.currentTime = 0;
                    startTime_Phase2.currentTime = 0;
                    startTime_Phase3.currentTime = 0;
                    startTime_Phase3.play();
                }
                if (kdcauso == 7) {
                    startTime_Phase1.pause();
                    startTime_Phase2.pause();
                    var question1 = document.getElementById("question1");
                    var question2 = document.getElementById("question2");
                    var question3 = document.getElementById("question3");
                    var question4 = document.getElementById("question4");
                    startTime_Phase3.currentTime = 10;
                    startTime_Phase3.play();
                    setTimeout(function () {
                        startTime_Phase1.currentTime = 0;
                        startTime_Phase3.pause();
                        finish60sec.play();
                        document.getElementById("competition-name").style.display = "block";
                        document.getElementById("competiton-ui").style.display = "none";
                    }, 3000)
                    question1.innerHTML = '';
                    question2.innerHTML = '';
                    question3.innerHTML = '';
                    question4.innerHTML = '';

                }
            }
        }, 7000)
    }
}

var khoidongdungsai = firebase.database().ref(matchid + '/khoidongdungsai');
khoidongdungsai.on('value', dungsai)

function dungsai(dt5) {
    if (dt5.val().dung == 1) {
        var startcorrect = document.getElementById("audio_4");
        startcorrect.currentTime = 0;
        startcorrect.play();
    }
    if (dt5.val().sai == 1) {
        var startwrong = document.getElementById("audio_5");
        startwrong.currentTime = 0;
        startwrong.play();
    }
}

var audioStatus = firebase.database().ref(matchid + "/Sounds");
var Spacing = document.getElementById("audio_extra_11");
audioStatus.on('value', audio);

function audio(status) {
    if (status.val().SpacingMusic == true) {
        document.getElementById("audio_3.1").volume = 0.25;
        document.getElementById("audio_3.2").volume = 0.25;
        document.getElementById("audio_3.3").volume = 0.25;
        Spacing.play();
    } else {
        document.getElementById("audio_3.1").volume = 0.5;
        document.getElementById("audio_3.2").volume = 0.5;
        document.getElementById("audio_3.3").volume = 0.5;
        Spacing.currentTime = 0;
        Spacing.pause();
    }
}




// function Time() {
//     var timer = document.getElementById("time");
//     var seconds = 60;
//     timer.innerHTML = seconds;
// }


var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');

KDO223sCountdown.on('value', kdo22countdown);
function kdo22countdown(cd) {
    var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    KDO22ChuongStatus.once('value', kdo22chuongst);
    function kdo22chuongst(cs) {
        if (cd.val().countdown == 1) {
            var timer = document.getElementById("time3s");
            timer.style.display = "block";
            var timer = document.getElementById("time3s");
            timer.innerHTML = 5;
            var seconds = 5;
            var countdownjs = setInterval(function () {
                if (seconds > 0) {
                    seconds = seconds - 1;
                    timer.innerHTML = seconds;
                }
            }, 1000)
            // document.getElementById("audio_46").currentTime = 0;
            // document.getElementById("audio_46").play();
            setTimeout(function () {
                var timer = document.getElementById("time3s");
                timer.innerHTML = 0;
                timer.style.display = "none";
                clearInterval(countdownjs);
            }, 4800)

        }
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

document.getElementsByClassName("questions")[0].style.background = CheckBackgroundValue(data.StartQuestion);
document.getElementsByClassName("questions")[0].style.backgroundSize = "cover";
document.getElementsByClassName("questions")[0].style.border = data.StartObjectBorder;

if (data.StartTextColor === "") {
    document.getElementsByClassName("questions")[0].style.color = "white";
} else {
    document.getElementsByClassName("questions")[0].style.color = data.StartTextColor;
}

var ele = document.getElementsByClassName('ts-box');
for (var i = 0; i < ele.length; i++) {
    ele[i].style.background = CheckBackgroundValue(data.StartCompetitor);
    ele[i].style.backgroundSize = "cover";
    ele[i].style.border = data.StartObjectBorder;
    ele[i].style.color = data.StartTextColor;
}

function CheckBackgroundValue(BackgroundVal) {
    if (BackgroundVal.startsWith("url")) {
        return BackgroundVal + "no-repeat";
    } else {
        return BackgroundVal;
    }
}