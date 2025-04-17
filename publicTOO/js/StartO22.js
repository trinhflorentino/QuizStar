//Handle UI
if (localStorage.getItem("isProjector") === 'true') {
    document.getElementById("chuong").style.display = "none";
    if (localStorage.getItem("isDisplayAvatar") === 'false') {
        var elements = document.getElementsByClassName("tsimg");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
    }
    if (localStorage.getItem("isGreenBackground") === 'true') {
        document.getElementById("competition-name").innerHTML = "";
    }
}

localStorage.setItem('ChuongStatus', false);


function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}

document.getElementById("audio").volume = 0.5;
document.getElementById("audio_38").volume = 0.5;
document.getElementById("audio_39").volume = 0.5;
document.getElementById("audio_40").volume = 0.5;
document.getElementById("audio_41").volume = 0.5;
document.getElementById("audio_42").volume = 0.5;
document.getElementById("audio_43").volume = 0.5;
document.getElementById("audio_44").volume = 0.5;
document.getElementById("audio_45").volume = 0.5;
document.getElementById("audio_46").volume = 0.5;
document.getElementById("audio_47").volume = 0.5;
document.getElementById("audio_extra_11").volume = 0.5;
document.getElementById("audio_extra_StartO22_1").volume = 1;
document.getElementById("audio_extra_StartO22_2").volume = 1;


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

// document.getElementById("audio").volume = "0.5";
// document.getElementById("audio").play();
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

var StartO2230Sec = document.getElementById("audio")


var tsuidRef1 = firebase.database().ref(matchid + '/games/player1');
tsuidRef1.on('value', Data)

function Data(dt) {
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

var khoidongturn = firebase.database().ref(matchid + '/KDO22Turn');
khoidongturn.on('value', kdo22turn);

function kdo22turn(turnkd) {
    KDO22Turn = turnkd.val().turn;
    if (KDO22Turn == 1) {
        document.getElementById("question1").style.display = "block";
        document.getElementById("question2").style.display = "none";
        document.getElementById("question3").style.display = "none";


        // document.getElementById("answerts1").style.display = "block";
        // document.getElementById("answerts2").style.display = "none";
        // document.getElementById("answerts3").style.display = "none";
    }
    if (KDO22Turn == 2) {
        document.getElementById("question1").style.display = "none";
        document.getElementById("question2").style.display = "block";
        document.getElementById("question3").style.display = "none";

        // document.getElementById("answerts1").style.display = "none";
        // document.getElementById("answerts2").style.display = "block";
        // document.getElementById("answerts3").style.display = "none";
    }
    if (KDO22Turn == 3) {
        document.getElementById("question1").style.display = "none";
        document.getElementById("question2").style.display = "none";
        document.getElementById("question3").style.display = "block";

        // document.getElementById("answerts1").style.display = "none";
        // document.getElementById("answerts2").style.display = "none";
        // document.getElementById("answerts3").style.display = "block";
    }

    var refkhoidongo22batdau = firebase.database().ref(matchid + "/phanthistatus/khoidongo22");
    refkhoidongo22batdau.on('value', kdo22status);
    function kdo22status(status) {
        if (status.val().batdau == 1) {
            if (KDO22Turn == 1) {
                var StartStart = document.getElementById("audio_38");
                StartStart.play();
                document.getElementById("competition-name").style.display = "none";
                document.getElementById("competiton-ui").style.display = "flex";
                setTimeout(function () {
                    var StartPreQuestion = document.getElementById("audio_39");
                    StartPreQuestion.play();
                    // document.getElementById("time").innerHTML = "Lượt 1";
                }, 3600);
                // setTimeout(function () {
                //     var Start30Sec = document.getElementById("audio_40");
                //     Start30Sec.play();
                // }, 7000);
            };
            if (KDO22Turn == 2) {
                var StartStart = document.getElementById("audio_38");
                StartStart.play();
                document.getElementById("competition-name").style.display = "none";
                document.getElementById("competiton-ui").style.display = "flex";
                setTimeout(function () {
                    var StartPreQuestion = document.getElementById("audio_39");
                    StartPreQuestion.play();
                    // document.getElementById("time").innerHTML = "Lượt 2";
                }, 3600);
                setTimeout(function () {
                    var Start60Sec = document.getElementById("audio_extra_StartO22_1");
                    Start60Sec.play();
                }, 7000);
            }
            if (KDO22Turn == 3) {
                var StartStart = document.getElementById("audio_38");
                StartStart.play();
                document.getElementById("competition-name").style.display = "none";
                document.getElementById("competiton-ui").style.display = "flex";
                setTimeout(function () {
                    var StartPreQuestion = document.getElementById("audio_39");
                    StartPreQuestion.play();
                    // document.getElementById("time").innerHTML = "Lượt 3";
                }, 3600);
                setTimeout(function () {
                    var Start90Sec = document.getElementById("audio_extra_StartO22_1");
                    Start90Sec.play();
                }, 7000);
            }
        }
    }
}

var KDO22LuotThiStatus = firebase.database().ref(matchid + '/KDO22LuotThiStatus');

KDO22LuotThiStatus.on('value', ltsts);

function ltsts(lt) {
    if (lt.val().status == 0) {
        var startTime_Phase1 = document.getElementById("audio_40");
        var startTime_Phase2 = document.getElementById("audio_41");
        var startTime_Phase3 = document.getElementById("audio_42");
        var Start60Sec = document.getElementById("audio_extra_StartO22_1");
        var Start90Sec = document.getElementById("audio_extra_StartO22_1");


        startTime_Phase1.currentTime = 0;
        startTime_Phase2.currentTime = 0;
        startTime_Phase3.currentTime = 0;
        Start60Sec.currentTime = 0;
        Start90Sec.currentTime = 0;

        Start60Sec.pause();
        Start90Sec.pause();

        startTime_Phase1.pause();
        startTime_Phase2.pause();
        startTime_Phase3.pause();

        setTimeout(function () {
            var FinishStartTurn = document.getElementById("audio_47");
            FinishStartTurn.play();
            document.getElementById("competition-name").style.display = "block";
            document.getElementById("competiton-ui").style.display = "none";
        }, 3000);
    }
}



var khoidongturn = firebase.database().ref(matchid + '/KDO22Turn');
khoidongturn.on('value', kdo22turnqs);
function kdo22turnqs(turnkd) {
    localStorage.setItem("turn", turnkd.val().turn)
}
var khoidongcauso = firebase.database().ref(matchid + "/KDO22Causo");
khoidongcauso.on('value', kdo22causo);
function kdo22causo(cs) {
    var KDO22QS = firebase.database().ref(matchid + "/KDO22Question/L" + localStorage.getItem("turn") + "/cau" + cs.val().causo);
    KDO22QS.once('value', kdo22qs);
    function kdo22qs(qs) {
        da = cs.val().causo - 1;
        var DAKDO22QS = firebase.database().ref(matchid + "/KDO22Question/L" + localStorage.getItem("turn") + "/dacau" + da);
        DAKDO22QS.once('value', dakdo22qs);
        function dakdo22qs(da) {
            if (cs.val().causo == 0) {
                document.getElementById("qsnum").innerHTML = "";
            }
            else if (cs.val().causo == 13 && localStorage.getItem("turn") == 1) {
                document.getElementById("qsnum").innerHTML = "";
            }
            else if (cs.val().causo == 26 && localStorage.getItem("turn") == 2) {
                document.getElementById("qsnum").innerHTML = "";
            }
            else if (cs.val().causo == 36 && localStorage.getItem("turn") == 3) {
                document.getElementById("qsnum").innerHTML = "";
            }
            else if (localStorage.getItem("turn") == 1) {
                document.getElementById("qsnum").innerHTML = "Câu " + cs.val().causo + "/12" + ":";
            }
            else if (localStorage.getItem("turn") == 2) {
                document.getElementById("qsnum").innerHTML = "Câu " + cs.val().causo + "/25" + ":";
            } else if (localStorage.getItem("turn") == 3) {
                document.getElementById("qsnum").innerHTML = "Câu " + cs.val().causo + "/35" + ":";
            }

            causo = cs.val().causo;
            cauhoi = qs.val();

            if (localStorage.getItem('turn') == 1) {

                var startTime_Phase1 = document.getElementById("audio_40");
                var startTime_Phase2 = document.getElementById("audio_41");
                var startTime_Phase3 = document.getElementById("audio_42");

                if (causo > 0 && causo < 9) {
                    startTime_Phase1.play();
                    startTime_Phase1.loop = true;
                } else if (causo > 8 && causo < 11) {
                    startTime_Phase1.pause();
                    startTime_Phase1.loop = false;
                    startTime_Phase1.currentTime = 0;
                    startTime_Phase2.play();
                    startTime_Phase2.loop = true;
                } else if (causo > 11 && causo < 13) {
                    startTime_Phase1.pause();
                    startTime_Phase2.pause();
                    startTime_Phase1.loop = false;
                    startTime_Phase2.loop = false;
                    startTime_Phase1.currentTime = 0;
                    startTime_Phase2.currentTime = 0;
                    startTime_Phase3.currentTime = 0;
                    startTime_Phase3.play();
                }
            }



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
            document.getElementById("question" + localStorage.getItem("turn")).innerHTML = qs.val();
            // document.getElementById("answerts" + localStorage.getItem("turn")).innerHTML = da.val();
            localStorage.setItem('ChuongStatus', false);
            setTimeout(function () {
                localStorage.setItem('ChuongStatus', true);
            }, 5000)
        }
    }
}




function chuong() {
    const KDO22ChuongRef = firebase.database().ref(matchid + "/KDO22Chuong/ChuongStatus");
    const KDO22AnswerRightsRef = firebase.database().ref(matchid + "/KDO22AnswerRights");
    // Fetch ChuongStatus and Player data in parallel
    Promise.all([
        KDO22ChuongRef.once('value'),
        KDO22AnswerRightsRef.once('value')
    ]).then(([chuongStatusSnapshot, answerRighttSnapshot]) => {
        const currentStatusObj = chuongStatusSnapshot.val();
        const answerRight = answerRighttSnapshot.val().value;
        const currentStatus = currentStatusObj && currentStatusObj.status; // Extract status property

        // Perform chuongstatus check
        if (currentStatus === 0 && answerRight === true) {
            const idts = localStorage.getItem('id');
            // Check if the player is already in the list
            const VDPChuongPlayerRef = firebase.database().ref(matchid + "/KDO22Chuong/Player");
            return VDPChuongPlayerRef.orderByChild("id").equalTo(idts).once("value").then(snapshot => {
                if (!snapshot.exists()) {
                    // Player not in the list, proceed to add
                    const chuong = { status: 1 };
                    const chuonginfo = { id: idts };

                    // Use transaction to ensure atomic update
                    return KDO22ChuongRef.transaction(currentData => {
                        if (currentData === null || currentData.status === 0) {
                            return { status: 1 };
                        } else {
                            // Abort the transaction, as status is already 1
                            return;
                        }
                    }).then(transactionResult => {
                        if (transactionResult.committed) {
                            // Transaction successful, add player info
                            return VDPChuongPlayerRef.push(chuonginfo);
                        } else {
                            // Transaction aborted, status is already 1
                            console.log('Transaction aborted because status is already 1.');
                            return;
                        }
                    });
                } else {
                    console.log('Player is already in the list.');
                    return;
                }
            });
        } else {
            console.log('Chuong status is not 0.');
            return;
        }
    }).then(() => {
        console.log("Transactions completed successfully.");
    }).catch(error => {
        console.error("Error occurred:", error);
    });
}



var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player').limitToFirst(1);
KDO22ChuongPlayer.on('value', chuongplayer);
function chuongplayer(cp) {
    var KDO22ChuongDisableTS1 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS1');
    KDO22ChuongDisableTS1.on('value', KDO22CD1);
    function KDO22CD1(TS1) {
        var KDO22ChuongDisableTS2 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS2');
        KDO22ChuongDisableTS2.on('value', KDO22CD2);
        function KDO22CD2(TS2) {
            var KDO22ChuongDisableTS3 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS3');
            KDO22ChuongDisableTS3.on('value', KDO22CD3);
            function KDO22CD3(TS3) {
                var KDO22ChuongDisableTS4 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS4')
                KDO22ChuongDisableTS4.on('value', KDO22CD4);
                function KDO22CD4(TS4) {
                    cp.forEach(function (e) {
                        x = e.val().id;
                        if (x == undefined && TS1.val().disable == 0) {
                            setAnsweringPlayer(0);
                        }
                        if (x == undefined && TS2.val().disable == 0) {
                            setAnsweringPlayer(0);
                        }
                        if (x == undefined && TS3.val().disable == 0) {
                            setAnsweringPlayer(0);
                        }
                        if (x == undefined && TS4.val().disable == 0) {
                            setAnsweringPlayer(0);
                        }
                        if (TS1.val().disable == 1) {
                        }
                        if (TS2.val().disable == 1) {
                        }
                        if (TS3.val().disable == 1) {
                        }
                        if (TS4.val().disable == 1) {
                        }
                    })
                }

            }
        }
    }
}

function setAnsweringPlayer(player) {
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


var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
KDO22ChuongCorrectOrWrong.on('value', KDCorrectOrWrong);
function KDCorrectOrWrong(cor) {
    if (cor.val().correctorwrong == 1) {
        document.getElementById("audio_44").currentTime = 0;
        document.getElementById("audio_44").play();
    }
    if (cor.val().correctorwrong == 2) {
        document.getElementById("audio_45").currentTime = 0;
        document.getElementById("audio_45").play();
    }
}
var KDO22ChuongStatus1 = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
KDO22ChuongStatus1.on('value', kdo22chuongst1);
function kdo22chuongst1(cs) {
    console.log(cs.val().status);
    if (cs.val().status == 1) {
        var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player').limitToFirst(1);
        KDO22ChuongPlayer.on('value', function (snapshot) {
            snapshot.forEach(function (child) {
                var x = child.val().id;
                if (x == 1) {
                    setAnsweringPlayer(1);
                    document.getElementById("audio_43").currentTime = 0;
                    document.getElementById("audio_43").play();
                    var cd = {
                        countdown: 2
                    }
                    var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');
                    KDO223sCountdown.set(cd);
                    return false;
                }
                if (x == 2) {
                    setAnsweringPlayer(2);
                    document.getElementById("audio_43").currentTime = 0;
                    document.getElementById("audio_43").play();
                    var cd = {
                        countdown: 2
                    }
                    var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');
                    KDO223sCountdown.set(cd);
                    return false;
                }
                if (x == 3) {
                    setAnsweringPlayer(3);
                    document.getElementById("audio_43").currentTime = 0;
                    document.getElementById("audio_43").play();
                    var cd = {
                        countdown: 2
                    }
                    var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');
                    KDO223sCountdown.set(cd);
                    return false;
                }
                if (x == 4) {
                    setAnsweringPlayer(4);
                    document.getElementById("audio_43").currentTime = 0;
                    document.getElementById("audio_43").play();
                    var cd = {
                        countdown: 2
                    }
                    var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');
                    KDO223sCountdown.set(cd);
                    return false;
                }
            });
        })

    }
};


var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');

KDO223sCountdown.on('value', kdo22countdown);
function kdo22countdown(cd) {
    var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    KDO22ChuongStatus.once('value', kdo22chuongst);
    function kdo22chuongst(cs) {
        if (cs.val().status == 0) {
            localStorage.setItem("timer3spause", 0);
        }
        if (cs.val().status == 3) {
            localStorage.setItem("timer3spause", 1);
            document.getElementById("audio_46").pause();
        }
        if (cs.val().status == 1) {
            localStorage.setItem("timer3spause", 1);
            document.getElementById("audio_46").pause();
        }
        if (cd.val().countdown == 1) {
            var timer = document.getElementById("time3s");
            timer.style.display = "block";
            var timer = document.getElementById("time3s");
            timer.innerHTML = 3;
            var seconds = 3;
            var countdownjs = setInterval(function () {
                if (localStorage.getItem("timer3spause") == 0) {
                    if (seconds > 0) {
                        seconds = seconds - 1;
                        timer.innerHTML = seconds;
                    }
                }
            }, 1000)
            // document.getElementById("audio_46").currentTime = 0;
            // document.getElementById("audio_46").play();
            setTimeout(function () {
                var timer = document.getElementById("time3s");
                timer.innerHTML = 0;
                timer.style.display = "none";
                clearInterval(countdownjs);
            }, 2800)

        }
    }
}



shortcut.add("Enter", function () {
    chuong();
});

var audioStatus = firebase.database().ref(matchid + "/Sounds");
var Spacing = document.getElementById("audio_extra_11");
audioStatus.on('value', audio);

function audio(status) {
    if (status.val().SpacingMusic == true) {
        document.getElementById("audio_40").volume = 0.25;
        document.getElementById("audio_41").volume = 0.25;
        document.getElementById("audio_42").volume = 0.25;
        Spacing.play();
    } else {
        document.getElementById("audio_40").volume = 0.5;
        document.getElementById("audio_41").volume = 0.5;
        document.getElementById("audio_42").volume = 0.5;
        Spacing.currentTime = 0;
        Spacing.pause();
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

        // Speak the text
        window.speechSynthesis.speak(msg);
        msg.onend = function (event) {
        }
    } else {
        // Browser doesn't support SpeechSynthesis API
        console.error('Speech synthesis not supported.');
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
document.getElementsByClassName("questions")[0].style.color = data.StartTextColor;

var ele = document.getElementsByClassName('ts-box');
for (var i = 0; i < ele.length; i++) {
    ele[i].style.background = CheckBackgroundValue(data.StartCompetitor);
    ele[i].style.backgroundSize = "cover";
    ele[i].style.border = data.StartObjectBorder;
    ele[i].style.color = data.StartTextColor;
}

document.getElementById("chuong").style.background = CheckBackgroundValue(data.AnswerButton);
document.getElementById("chuong").style.backgroundSize = "cover";
document.getElementById("chuong").style.border = data.StartObjectBorder;
document.getElementById("chuong").style.color = data.StartTextColor;

function CheckBackgroundValue(BackgroundVal) {
    if (BackgroundVal.startsWith("url")) {
        return BackgroundVal + "no-repeat";
    } else {
        return BackgroundVal;
    }
}