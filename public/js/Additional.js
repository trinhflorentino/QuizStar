//Handle UI
if (localStorage.getItem("isProjector") === 'true') {
    document.getElementById("chuong").style.display = "none";
    if (localStorage.getItem("isDisplayAvatar") === 'false') {
        var elements = document.getElementsByClassName("playervdimage");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
    }
    if (localStorage.getItem("isGreenBackground") === 'true') {

    }
}

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

document.getElementById("audio_23").volume = 0.5;
document.getElementById("audio_23").play();
document.getElementById("audio_28").volume = 0.5;
document.getElementById("audio_29").volume = 0.5;
document.getElementById("audio_30").volume = 0.5;
document.getElementById("audio_31").volume = 0.5;
document.getElementById("audio_32").volume = 0.5;
document.getElementById("audio_33").volume = 0.5;
document.getElementById("audio_34").volume = 0.5;
document.getElementById("audio_35").volume = 0.5;
document.getElementById("audio_36").volume = 0.5;
document.getElementById("audio_37").volume = 0.5;

var matchid = getCookie("matchid");


localStorage.setItem("timerpause", 0);



var ts1ref = firebase.database().ref(matchid + "/games/player1");
var ts2ref = firebase.database().ref(matchid + "/games/player2");
var ts3ref = firebase.database().ref(matchid + "/games/player3");
var ts4ref = firebase.database().ref(matchid + "/games/player4");

var ts1point = firebase.database().ref(matchid + '/point/player1');
var ts2point = firebase.database().ref(matchid + '/point/player2');
var ts3point = firebase.database().ref(matchid + '/point/player3');
var ts4point = firebase.database().ref(matchid + '/point/player4');


ts1ref.on('value', ts1);

function ts1(tsinfo) {
    document.getElementById("tt1name").innerHTML = tsinfo.val().displayName;
    var ts1uid = tsinfo.val().uid;
    firebase.storage().ref('users/' + ts1uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        tt1.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt1.src = imgUrl;
        })
    });
}


ts2ref.on('value', ts2);

function ts2(tsinfo) {
    document.getElementById("tt2name").innerHTML = tsinfo.val().displayName;
    var ts2uid = tsinfo.val().uid;
    firebase.storage().ref('users/' + ts2uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        tt2.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt2.src = imgUrl;
        })
    });
}


ts3ref.on('value', ts3);

function ts3(tsinfo) {
    document.getElementById("tt3name").innerHTML = tsinfo.val().displayName;
    var ts3uid = tsinfo.val().uid;
    firebase.storage().ref('users/' + ts3uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        tt3.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt3.src = imgUrl;
        })
    });
}


ts4ref.on('value', ts4);

function ts4(tsinfo) {
    document.getElementById("tt4name").innerHTML = tsinfo.val().displayName;
    var ts4uid = tsinfo.val().uid;
    firebase.storage().ref('users/' + ts4uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        tt4.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt4.src = imgUrl;
        })
    });
}



var VDPCauso = firebase.database().ref(matchid + '/VDPCauso');
VDPCauso.on('value', causofunction);

function causofunction(causovdp) {
    var causo = causovdp.val().causo;
    var VDPQuestion = firebase.database().ref(matchid + '/CHPQuestion/cau' + causo);
    VDPQuestion.on('value', question);

    function question(vdpquestion) {
        document.getElementById("questionnumber").innerHTML = "Câu hỏi số " + causo + ":";
        document.getElementById('question1').innerHTML = vdpquestion.val();
        if (causo == 0) {
            document.getElementById("questionnumber").innerHTML = "";
        }
        let questionElement = document.querySelector('.question');
        questionElement.style.setProperty('--timer-width', '0%');
    }
}






var VDPDemgio = firebase.database().ref(matchid + "/phanthistatus/vedichphu");
VDPDemgio.on('value', demgiovdp);

function demgiovdp(bd) {

    if (bd.val().batdau == 1) {
        playSlider(15);
        document.getElementById("audio_37").currentTime = 0;
        document.getElementById("audio_37").play();
    }
}







var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
VDPChuong.on('value', status);

function status(sts) {
    if (sts.val().status == 1) {
        localStorage.setItem("timerpause", 1);
        document.getElementById("audio_37").pause();
        firebase.database().ref(matchid + '/VDPChuong/Player').limitToFirst(1).once('value', function (snapshot) {

            snapshot.forEach(function (e) {
                var x = e.val().id;
                if (x == 1) {
                    // document.getElementById("playertt1").style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(1);
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 2) {
                    // document.getElementById("playertt2").style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(2);
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 3) {
                    // document.getElementById("playertt3").style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(3);
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 4) {
                    // document.getElementById("playertt4").style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(4);
                    document.getElementById("audio_34").play();
                    return false;
                }
            })
        })
    }
    if (sts.val().status == 0) {
        localStorage.setItem("timerpause", 0);
        document.getElementById("audio_37").play();
        // document.getElementById("playertt1").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt2").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt3").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt4").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        resetPlayer();
    }
    if (sts.val().status == 3) {
        localStorage.setItem("timerpause", 0);
        // document.getElementById("playertt1").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt2").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt3").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt4").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        resetPlayer();
    }
}

function resetPlayer() {
    var PlayersElements = document.getElementsByClassName("playertt");
    for (let i = 0; i < PlayersElements.length; i++) {
        if (data.FinishCompetitor != "") {
            PlayersElements[i].style.background = CheckBackgroundValue(data.FinishCompetitor);
            PlayersElements[i].style.backgroundSize = "cover";
        } else {
            PlayersElements[i].style.background = 'linear-gradient(120deg, rgba(0, 56, 127, 1) 0%, rgba(0, 56, 127, 1) 100%)';
        }
    }
}

function setAnsweringPlayer(player) {
    const data = JSON.parse(localStorage.getItem("themeData"));
    var Player = document.getElementById("playertt" + player);
    if (data.FinishCompetitorAnswering != "") {
        Player.style.background = CheckBackgroundValue(data.FinishCompetitorAnswering);
        Player.style.backgroundSize = "cover";
    } else {
        Player.style.background = 'linear-gradient(90deg, rgba(88,30,45,1) 0%, rgba(138,60,73,1) 80%)';
    }
}







function chuong() {
    tsvd = localStorage.getItem("TSVD");
    idts = localStorage.getItem("id");
    var VDPChuongDisable = firebase.database().ref(matchid + "/VDPChuongDisable/TS" + localStorage.getItem("id"));
    VDPChuongDisable.on('value', chuongdisable);

    function chuongdisable(cd) {
        var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
        VDPChuong.once("value", chuongstatus);

        function chuongstatus(cs) {
            if (cd.val().chuongdisable == 0) {
                if (cs.val().status == 0) {
                    var chuong = {
                        status: 1
                    }
                    VDPChuong.set(chuong);
                    var date = new Date();
                    var h = date.getHours();
                    var m = date.getMinutes();
                    var s = date.getSeconds();
                    var ms = date.getMilliseconds();
                    var checktimestamp = h + ":" + m + ":" + s + ":" + ms;
                    var chuonginfo = {
                        id: localStorage.getItem("id"),
                        timestamp: checktimestamp,
                    }
                    var VDPChuongPlayer = firebase.database().ref(matchid + "/VDPChuong/Player");
                    VDPChuongPlayer.push(chuonginfo);
                }
            } else { }
        }
    }
}




var VDPChuongCoW = firebase.database().ref(matchid + "/VDPChuong/CorrectOrWrong");
VDPChuongCoW.on('value', correctorwrong);

function correctorwrong(cor) {
    if (cor.val().correctorwrong == 0) {
        // document.getElementById("playertt1").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt2").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt3").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // document.getElementById("playertt4").style.backgroundImage = 'url("/img/backgroundobject.jpg")';
    }
    if (cor.val().correctorwrong == 1) {
        firebase.database().ref(matchid + '/VDPChuong/Player').limitToFirst(1).once('value', function (snapshot) {
            snapshot.forEach(function (e) {
                var x = e.val().id;
                if (x == 1) {
                    // document.getElementById("playertt1").style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                    document.getElementById("audio_31").play();
                }
                if (x == 2) {
                    // document.getElementById("playertt2").style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                    document.getElementById("audio_31").play();
                }
                if (x == 3) {
                    // document.getElementById("playertt3").style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                    document.getElementById("audio_31").play();
                }
                if (x == 4) {
                    // document.getElementById("playertt4").style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                    document.getElementById("audio_31").play();
                }
            })
        })
    }

}








shortcut.add("F7", function () {
    chuong();
});
var p = firebase.database().ref(matchid + "/games/player" + localStorage.getItem("id"));

p.on("value", pkick);

function pkick(uid1) {
    if (uid1.val().uid == "" && localStorage.getItem("id") != 5 && window.location.pathname != "/Main.html" && window.location.pathname != "/Information.html" && uid1.val().id == 0) {
        alert("Bạn đã bị Host kick khỏi trận đấu");
        location.replace("/Main.html");
    }

}


function playSlider(maxTime) {
    let time = 0;
    let pausedTime = null;
    let questionElement = document.querySelector('.question');
    let steps = maxTime * 100; // 100 steps per second

    function updateSlider() {
        if (localStorage.getItem("timerpause") == 0) {
            if (pausedTime !== null) {
                time = pausedTime;
                pausedTime = null;
            }
            if (time <= steps) {
                let percentage = (time / steps) * 100;
                questionElement.style.setProperty('--timer-width', percentage + '%');
                time++;
            } else {
                clearInterval(timerInterval);
            }
        } else {
            if (pausedTime === null) {
                pausedTime = time;
            }
        }
    }

    let timerInterval = setInterval(updateSlider, 10); // Update every 10 milliseconds for smoothness
}



var audioStatus = firebase.database().ref(matchid + "/Sounds");
var Spacing = document.getElementById("audio_extra_11");
audioStatus.on('value', audio);

function audio(status) {
    if (status.val().SpacingMusic == true) {
        Spacing.play();
    } else {
        Spacing.currentTime = 0;
        Spacing.pause();
    }
}


var audioStatusTense = firebase.database().ref(matchid + "/Sounds");
var TenseMoments = document.getElementById("audio_extra_12");
audioStatusTense.on('value', audioTense);

function audioTense(status) {
    if (status.val().TenseMoments == true) {
        TenseMoments.play();
    } else {
        TenseMoments.currentTime = 0;
        TenseMoments.pause();
    }
}

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



document.getElementsByClassName("question")[0].style.background = CheckBackgroundValue(data.FinishQuestion);
document.getElementsByClassName("question")[0].style.backgroundSize = "cover";
document.getElementsByClassName("question")[0].style.border = data.FinishObjectBorder;
document.getElementsByClassName("question")[0].style.color = data.FinishTextColor;

document.getElementsByClassName("currentplayer")[0].style.background = CheckBackgroundValue(data.FinishFinishingCompetitor);
document.getElementsByClassName("currentplayer")[0].style.backgroundSize = "cover";
document.getElementsByClassName("currentplayer")[0].style.border = data.FinishObjectBorder;
document.getElementsByClassName("currentplayer")[0].style.color = data.FinishTextColor;

var PlayersElements = document.getElementsByClassName("playertt");
for (let i = 0; i < PlayersElements.length; i++) {
    if (data.FinishCompetitor != "") {
        PlayersElements[i].style.background = CheckBackgroundValue(data.FinishCompetitor);
        PlayersElements[i].style.backgroundSize = "cover";
    } else {
        PlayersElements[i].style.background = 'linear-gradient(120deg, rgba(0, 56, 127, 1) 0%, rgba(0, 56, 127, 1) 100%)';
    }
    PlayersElements[i].style.border = data.FinishObjectBorder;
    PlayersElements[i].style.color = data.FinishTextColor;
}


const element = document.querySelector('.question');
if (element) {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        .question::after {
            background: ${data.FinishSlide};
        }
    `, styleSheet.cssRules.length);
}


document.getElementById("chuong").style.background = CheckBackgroundValue(data.AnswerButton);
document.getElementById("chuong").style.backgroundSize = "cover";
document.getElementById("chuong").style.border = data.FinishObjectBorder;
document.getElementById("chuong").style.color = data.FinishTextColor;


function CheckBackgroundValue(BackgroundVal) {
    if (BackgroundVal.startsWith("url")) {
        return BackgroundVal + "no-repeat";
    } else {
        return BackgroundVal;
    }
}