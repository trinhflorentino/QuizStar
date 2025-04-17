//Handle UI
if (localStorage.getItem("isProjector") === 'true') {
    document.getElementsByClassName("ans-group")[0].style.display = "none";
    document.getElementsByClassName("image")[0].style.height = "82vh";
    document.getElementById("tt1").style.height = "82vh";
    document.getElementById("tt2").style.height = "82vh";
    document.getElementById("tt3").style.height = "82vh";
    document.getElementById("tt4").style.height = "82vh";
    if (localStorage.getItem("isDisplayAvatar") === 'false') {
        var elements = document.getElementsByClassName("tsimg");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
    }
}



setTimeout(function () {
    var
        el = document.documentElement,
        rfs =
            el.requestFullScreen ||
            el.webkitRequestFullScreen ||
            el.mozRequestFullScreen;
    rfs.call(el);
}, 3000);

shortcut.add("Ctrl+Tab", function () {
    var ansbar = document.getElementById("ttans");
    ansbar.value = "Bạn đã mất quyền trả lời";
    ansbar.disabled = true;
});
function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}


shortcut.add("F12", function () {
    Notification("Không được bật F12 trong phần thi này");
});
shortcut.add("Ctrl+Shift+I", function () {
    Notification("Không được bật kiểm tra phần tử trong phần thi này");
});


document.addEventListener('contextmenu', event => event.preventDefault());

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


var tangtoc = firebase.database().ref(matchid + "/Acceleration/QS")
var TTQ1 = firebase.database().ref(matchid + '/AccelerationQuestion/QS1/');
var TTQ2 = firebase.database().ref(matchid + '/AccelerationQuestion/QS2/');
var TTQ3 = firebase.database().ref(matchid + '/AccelerationQuestion/QS3/');
var TTQ4 = firebase.database().ref(matchid + '/AccelerationQuestion/QS4/');


var TTANSKT = firebase.database().ref(matchid + "/AccelerationAnswer/kiemtradapan");
var TTANS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Answer');
var TTANS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Answer');
var TTANS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Answer');
var TTANS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Answer');


var TTANSTIMESTAMPS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Timestamp');
var TTANSTIMESTAMPS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Timestamp');
var TTANSTIMESTAMPS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Timestamp');
var TTANSTIMESTAMPS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Timestamp');

var COFTTTT1 = firebase.database().ref(matchid + "/AccelerationChecked/TT1");
var COFTTTT2 = firebase.database().ref(matchid + "/AccelerationChecked/TT2");
var COFTTTT3 = firebase.database().ref(matchid + "/AccelerationChecked/TT3");
var COFTTTT4 = firebase.database().ref(matchid + "/AccelerationChecked/TT4");


var TT1Image = document.getElementById("tt1");
var TT2Video = document.getElementById("tt2");
var TT3Image = document.getElementById("tt3");
var TT4Video = document.getElementById("tt4");

var AccelerationOpenAnswer = firebase.database().ref(matchid + '/AccelerationOpenAnswer');
document.getElementById("audio_17").volume = 0.5;
document.getElementById("audio_17").play();
document.getElementById("audio_19_10s").volume = 0.5;
document.getElementById("audio_19_20s").volume = 0.5;
document.getElementById("audio_19_30s").volume = 0.5;
document.getElementById("audio_19_40s").volume = 0.5;
document.getElementById("audio_20").volume = 0.5;
document.getElementById("audio_21").volume = 0.5;
document.getElementById("audio_22").volume = 0.5;
document.getElementById("audio_extra_11").volume = 0.5;
document.getElementById("audio_extra_12").volume = 0.5;



var ansbar = document.getElementById("ttans");
var anspreview = document.getElementById("dapan");
ansbar.disabled = true;
anspreview.disabled = true;
localStorage.setItem("TT", 0);

var questionappear = document.getElementById("audio_18");
var AccelerationThinking = document.getElementById("audio_19");
var AccelerationAnswerShow = document.getElementById("audio_20");
var AccelerationAnswerCorrect = document.getElementById("audio_21");
var AccelerationWrongAnswer = document.getElementById("audio_22");

tangtoc.on("value", cautt);

function cautt(tt) {
    if (tt.val().tangtoc == 0) {
        var qsbar = document.getElementById("question");
        qsbar.innerHTML = "";
        TT1Image.style.display = "none";
        TT2Video.style.display = "none";
        TT3Image.style.display = "none";
        TT4Video.style.display = "none";
        localStorage.setItem("TT", 0);
        var showdapan = document.getElementById("showdapan1");
        var dapan1 = document.getElementById("odapan1");
        var dapan2 = document.getElementById("odapan2");
        var dapan3 = document.getElementById("odapan3");
        var dapan4 = document.getElementById("odapan4");
        showdapan.style.display = 'none';
        dapan1.style.display = 'none';
        dapan2.style.display = 'none';
        dapan3.style.display = 'none';
        dapan4.style.display = 'none';
        // dapan1.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // dapan2.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // dapan3.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // dapan4.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        var answerclient = document.getElementById("dapan");
        answerclient.value = "";
        var defaultdungsai = {
            correctorwrong: 0
        }
        COFTTTT1.set(defaultdungsai);
        COFTTTT2.set(defaultdungsai);
        COFTTTT3.set(defaultdungsai);
        COFTTTT4.set(defaultdungsai);
    }
    if (tt.val().tangtoc == 1) {
        document.getElementById("competition-name").style.display = "none";
        HideAll();
        setTimeout(function () {
            ShowAll();
            let imageElement = document.querySelector('.image');
            imageElement.style.setProperty('--timer-width', '0%');
        }, 500);
        firebase.storage().ref(matchid + "/tt/tt1/tt1.jpg").getDownloadURL().then(imgUrl => {
            tt1.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt1/tt1.mp4").getDownloadURL().then(imgUrl => {
                tt1.src = imgUrl;
                document.getElementById("tt1").style.filter = "brightness(0%)";
            })
        });

        document.getElementById("tt1").pause();
        TT1Image.style.display = "block";
        questionappear.currentTime = 0;
        questionappear.play();
        TTQ1.on("value", qs1);

        function qs1(qs) {
            var q1 = qs.val().cauhoi;
            var qsbar = document.getElementById("question");
            qsbar.innerHTML = q1;
        }
        TT2Video.style.display = "none";
        TT3Image.style.display = "none";
        TT4Video.style.display = "none";
        localStorage.setItem("TT", 1);
        resetItem();
    }
    if (tt.val().tangtoc == 2) {
        document.getElementById("competition-name").style.display = "none";
        HideAll();
        setTimeout(function () {
            ShowAll();
            let imageElement = document.querySelector('.image');
            imageElement.style.setProperty('--timer-width', '0%');
        }, 500);
        firebase.storage().ref(matchid + "/tt/tt2/tt2.jpg").getDownloadURL().then(imgUrl => {
            tt2.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt2/tt2.mp4").getDownloadURL().then(imgUrl => {
                tt2.src = imgUrl;
                document.getElementById("tt2").style.filter = "brightness(0%)";
            })
        });

        document.getElementById("tt2").pause();
        TT2Video.style.display = "block";
        questionappear.currentTime = 0;
        questionappear.play();
        TTQ2.on("value", qs2);

        function qs2(qs) {
            var q2 = qs.val().cauhoi;
            var qsbar = document.getElementById("question");
            qsbar.innerHTML = q2;
        }
        TT1Image.style.display = "none";
        TT3Image.style.display = "none";
        TT4Video.style.display = "none";
        localStorage.setItem("TT", 2);
        resetItem();
    }
    if (tt.val().tangtoc == 3) {
        document.getElementById("competition-name").style.display = "none";
        HideAll();
        setTimeout(function () {
            ShowAll();
            let imageElement = document.querySelector('.image');
            imageElement.style.setProperty('--timer-width', '0%');
        }, 500);
        firebase.storage().ref(matchid + "/tt/tt3/tt3.jpg").getDownloadURL().then(imgUrl => {
            tt3.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt3/tt3.mp4").getDownloadURL().then(imgUrl => {
                tt3.src = imgUrl;
                document.getElementById("tt3").style.filter = "brightness(0%)";
            })
        });

        document.getElementById("tt3").pause();
        TT3Image.style.display = "block";
        questionappear.currentTime = 0;
        questionappear.play();
        TTQ3.on("value", qs3);

        function qs3(qs) {
            var q3 = qs.val().cauhoi;
            var qsbar = document.getElementById("question");
            qsbar.innerHTML = q3;
        }
        TT1Image.style.display = "none";
        TT2Video.style.display = "none";
        TT4Video.style.display = "none";
        localStorage.setItem("TT", 3);
        resetItem();
    }
    if (tt.val().tangtoc == 4) {
        document.getElementById("competition-name").style.display = "none";
        HideAll();
        setTimeout(function () {
            ShowAll();
            let imageElement = document.querySelector('.image');
            imageElement.style.setProperty('--timer-width', '0%');
        }, 500);
        firebase.storage().ref(matchid + "/tt/tt4/tt4.jpg").getDownloadURL().then(imgUrl => {
            tt4.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt4/tt4.mp4").getDownloadURL().then(imgUrl => {
                tt4.src = imgUrl;
                document.getElementById("tt4").style.filter = "brightness(0%)";
            })
        });

        document.getElementById("tt4").pause();
        TT4Video.style.display = "block";
        questionappear.currentTime = 0;
        questionappear.play();
        TTQ4.on("value", qs4);

        function qs4(qs) {
            var q4 = qs.val().cauhoi;
            var qsbar = document.getElementById("question");
            qsbar.innerHTML = q4;
        }
        TT1Image.style.display = "none";
        TT2Video.style.display = "none";
        TT3Image.style.display = "none";
        localStorage.setItem("TT", 4);
        resetItem()
    }
}


function resetItem() {
    var showdapan = document.getElementById("showdapan1");
    var dapan1 = document.getElementById("odapan1");
    var dapan2 = document.getElementById("odapan2");
    var dapan3 = document.getElementById("odapan3");
    var dapan4 = document.getElementById("odapan4");
    showdapan.style.display = 'none';
    dapan1.style.display = 'none';
    dapan2.style.display = 'none';
    dapan3.style.display = 'none';
    dapan4.style.display = 'none';
    resetPlayerAnswer();
    // dapan1.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
    // dapan2.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
    // dapan3.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
    // dapan4.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
    var answerclient = document.getElementById("dapan");
    answerclient.value = "";
    document.getElementById("ttans").value = "";
    var defaultdungsai = {
        correctorwrong: 0
    }
    COFTTTT1.set(defaultdungsai);
    COFTTTT2.set(defaultdungsai);
    COFTTTT3.set(defaultdungsai);
    COFTTTT4.set(defaultdungsai);
}


var tangtocstatus = firebase.database().ref(matchid + "/phanthistatus/tangtoc");
tangtocstatus.on("value", demtgtt);

function demtgtt(tt) {
    if (tt.val().batdau == 0) { }
    else if (tt.val().batdau == 1) {
        var tangtoc1 = firebase.database().ref(matchid + "/Acceleration/QS");
        tangtoc1.once('value', cautt);
        function cautt(ct) {
            if (ct.val().tangtoc == 1) {
                document.getElementById("ttans").value = "";
                document.getElementById("audio_19_10s").play();
                Time(10);
                MinusTime(10);
                MinusTimeInput(10);
            }
            if (ct.val().tangtoc == 2) {
                document.getElementById("ttans").value = "";
                document.getElementById("audio_19_20s").play();
                Time(20);
                MinusTime(20);
                MinusTimeInput(20);
            }
            if (ct.val().tangtoc == 3) {
                document.getElementById("ttans").value = "";
                document.getElementById("audio_19_30s").play();
                Time(30);
                MinusTime(30);
                MinusTimeInput(30);
            } if (ct.val().tangtoc == 4) {
                document.getElementById("ttans").value = "";
                document.getElementById("audio_19_40s").play();
                Time(40);
                MinusTime(40);
                MinusTimeInput(40);
            }
        }
    }
}




function Time(seconds) {
    anspreview.disabled = false;
    ansbar.disabled = false;
    ansbar.focus();
    document.getElementById("tt1").style.filter = "none";
    document.getElementById("tt1").play();
    document.getElementById("tt2").style.filter = "none";
    document.getElementById("tt2").play();
    document.getElementById("tt3").style.filter = "none";
    document.getElementById("tt3").play();
    document.getElementById("tt4").style.filter = "none";
    document.getElementById("tt4").play();

}

function MinusTime(seconds) {

    let time = 0;
    let maxTime = seconds; // Timer duration in seconds
    let imageElement = document.querySelector('.image');
    let steps = maxTime * 100; // 100 steps per second

    function updateSlider() {
        if (time <= steps) {
            let percentage = (time / steps) * 100;
            imageElement.style.setProperty('--timer-width', percentage + '%');
            time++;
        } else {
            clearInterval(timerInterval);
        }
    }

    let timerInterval = setInterval(updateSlider, 10); // Update every 10 milliseconds for smoothness

    var Timeouttime = seconds * 1000;
    console.log(Timeouttime);
    setInterval(function () {
        if (seconds > 0) {
            seconds = seconds - 1;
        }
    }, 1000)
    setTimeout(function () {
        anspreview.disabled = true;
        ansbar.disabled = true;
        ansbar.value = "";
        ansbar.value = anspreview.value;
        anspreview.value = "";
    }, Timeouttime)
    setTimeout(function () {
        var TTANS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Answer');

        TTANS1.once("value", tl1);

        function tl1(traloi1) {
            var TTANS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Answer');
            TTANS2.once("value", tl2);

            function tl2(traloi2) {
                var TTANS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Answer');
                TTANS3.once("value", tl3);

                function tl3(traloi3) {
                    var TTANS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Answer');
                    TTANS4.once("value", tl4);

                    function tl4(traloi4) {
                        var nameref1 = firebase.database().ref(matchid + "/games/player1");
                        nameref1.once("value", n1);

                        function n1(names1) {
                            var nameref2 = firebase.database().ref(matchid + "/games/player2");
                            nameref2.once("value", n2);

                            function n2(names2) {
                                var nameref3 = firebase.database().ref(matchid + "/games/player3");
                                nameref3.once("value", n3);

                                function n3(names3) {
                                    var nameref4 = firebase.database().ref(matchid + "/games/player4");
                                    nameref4.once("value", n4);

                                    function n4(names4) {
                                        var TTANSTIMESTAMPS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Timestamp');
                                        TTANSTIMESTAMPS1.once("value", ts1);

                                        function ts1(timestamp1) {
                                            var TTANSTIMESTAMPS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Timestamp');
                                            TTANSTIMESTAMPS2.once("value", ts2);

                                            function ts2(timestamp2) {
                                                var TTANSTIMESTAMPS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Timestamp');
                                                TTANSTIMESTAMPS3.once("value", ts3);

                                                function ts3(timestamp3) {
                                                    var TTANSTIMESTAMPS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Timestamp');
                                                    TTANSTIMESTAMPS4.once("value", ts4);

                                                    function ts4(timestamp4) {
                                                        var pointref1 = firebase.database().ref(matchid + "/point/player1");
                                                        pointref1.once("value", p1);

                                                        function p1(point1) {
                                                            var pointref2 = firebase.database().ref(matchid + "/point/player2");
                                                            pointref2.once("value", p2);

                                                            function p2(point2) {
                                                                var pointref3 = firebase.database().ref(matchid + "/point/player3");
                                                                pointref3.once("value", p3);

                                                                function p3(point3) {
                                                                    var pointref4 = firebase.database().ref(matchid + "/point/player4");
                                                                    pointref4.once("value", p4);

                                                                    function p4(point4) {


                                                                        var anstts1 = traloi1.val().answer;
                                                                        var anstts2 = traloi2.val().answer;
                                                                        var anstts3 = traloi3.val().answer;
                                                                        var anstts4 = traloi4.val().answer;

                                                                        var tstamptt1 = parseFloat(timestamp1.val().timestamp);
                                                                        var tstamptt2 = parseFloat(timestamp2.val().timestamp);
                                                                        var tstamptt3 = parseFloat(timestamp3.val().timestamp);
                                                                        var tstamptt4 = parseFloat(timestamp4.val().timestamp);


                                                                        var namett1 = names1.val().displayName;
                                                                        var namett2 = names2.val().displayName;
                                                                        var namett3 = names3.val().displayName;
                                                                        var namett4 = names4.val().displayName;

                                                                        var uidtt1 = names1.val().uid;
                                                                        var uidtt2 = names2.val().uid;
                                                                        var uidtt3 = names3.val().uid;
                                                                        var uidtt4 = names4.val().uid;

                                                                        var diem1 = point1.val().point;
                                                                        var diem2 = point2.val().point;
                                                                        var diem3 = point3.val().point;
                                                                        var diem4 = point4.val().point;


                                                                        var dapan1 = document.getElementById("dapan1");
                                                                        var dapan2 = document.getElementById("dapan2");
                                                                        var dapan3 = document.getElementById("dapan3");
                                                                        var dapan4 = document.getElementById("dapan4");

                                                                        var tstamp1 = document.getElementById("tstamp1");
                                                                        var tstamp2 = document.getElementById("tstamp2");
                                                                        var tstamp3 = document.getElementById("tstamp3");
                                                                        var tstamp4 = document.getElementById("tstamp4");

                                                                        var tentt1 = document.getElementById("tentt1");
                                                                        var tentt2 = document.getElementById("tentt2");
                                                                        var tentt3 = document.getElementById("tentt3");
                                                                        var tentt4 = document.getElementById("tentt4");

                                                                        var pointt1 = document.getElementById("pointt1");
                                                                        var pointt2 = document.getElementById("pointt2");
                                                                        var pointt3 = document.getElementById("pointt3");
                                                                        var pointt4 = document.getElementById("pointt4");

                                                                        var answer = [{
                                                                            timestamp: tstamptt1,
                                                                            answer: anstts1,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt2,
                                                                            answer: anstts2,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt3,
                                                                            answer: anstts3,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt4,
                                                                            answer: anstts4,
                                                                        },
                                                                        ];


                                                                        var name = [{
                                                                            timestamp: tstamptt1,
                                                                            name: namett1,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt2,
                                                                            name: namett2,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt3,
                                                                            name: namett3,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt4,
                                                                            name: namett4,
                                                                        },
                                                                        ];

                                                                        var uid = [{
                                                                            timestamp: tstamptt1,
                                                                            uid: uidtt1,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt2,
                                                                            uid: uidtt2,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt3,
                                                                            uid: uidtt3,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt4,
                                                                            uid: uidtt4,
                                                                        },
                                                                        ];

                                                                        var point = [{
                                                                            timestamp: tstamptt1,
                                                                            point: diem1,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt2,
                                                                            point: diem2,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt3,
                                                                            point: diem3,
                                                                        },
                                                                        {
                                                                            timestamp: tstamptt4,
                                                                            point: diem4,
                                                                        },
                                                                        ];
                                                                        answer.sort(function (a, b) { return a.timestamp - b.timestamp });
                                                                        name.sort(function (a, b) { return a.timestamp - b.timestamp });
                                                                        uid.sort(function (a, b) { return a.timestamp - b.timestamp });
                                                                        point.sort(function (a, b) { return a.timestamp - b.timestamp });


                                                                        dapan1.innerHTML = answer[0].answer;
                                                                        dapan2.innerHTML = answer[1].answer;
                                                                        dapan3.innerHTML = answer[2].answer;
                                                                        dapan4.innerHTML = answer[3].answer;




                                                                        if (answer[0].timestamp != 0) {
                                                                            tstamp1.innerHTML = answer[0].timestamp;
                                                                        } else {
                                                                            tstamp1.innerHTML = "";
                                                                        }

                                                                        if (answer[1].timestamp != 0) {
                                                                            tstamp2.innerHTML = answer[1].timestamp;
                                                                        } else {
                                                                            tstamp2.innerHTML = "";
                                                                        }

                                                                        if (answer[2].timestamp != 0) {
                                                                            tstamp3.innerHTML = answer[2].timestamp;
                                                                        } else {
                                                                            tstamp3.innerHTML = "";
                                                                        }

                                                                        if (answer[3].timestamp != 0) {
                                                                            tstamp4.innerHTML = answer[3].timestamp;
                                                                        } else {
                                                                            tstamp4.innerHTML = "";
                                                                        }

                                                                        tentt1.innerHTML = name[0].name;
                                                                        tentt2.innerHTML = name[1].name;
                                                                        tentt3.innerHTML = name[2].name;
                                                                        tentt4.innerHTML = name[3].name;

                                                                        pointt1.innerHTML = point[0].point;
                                                                        pointt2.innerHTML = point[1].point;
                                                                        pointt3.innerHTML = point[2].point;
                                                                        pointt4.innerHTML = point[3].point;




                                                                        firebase.storage().ref('users/' + uid[0].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                            tsans1.src = imgUrl;
                                                                        }).catch((error) => {
                                                                            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                                tsans1.src = imgUrl;
                                                                            })
                                                                        });
                                                                        firebase.storage().ref('users/' + uid[1].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                            tsans2.src = imgUrl;
                                                                        }).catch((error) => {
                                                                            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                                tsans2.src = imgUrl;
                                                                            })
                                                                        });;
                                                                        firebase.storage().ref('users/' + uid[2].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                            tsans3.src = imgUrl;
                                                                        }).catch((error) => {
                                                                            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                                tsans3.src = imgUrl;
                                                                            })
                                                                        });
                                                                        firebase.storage().ref('users/' + uid[3].uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                            tsans4.src = imgUrl;
                                                                        }).catch((error) => {
                                                                            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                                                                                tsans4.src = imgUrl;
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, Timeouttime)
}

AccelerationOpenAnswer.on('value', openans);

var firstInit = true;

function openans(oa) {
    var AlreadyOpenAnswerRef = firebase.database().ref(matchid + '/AlreadyOpenAnswer');
    AlreadyOpenAnswerRef.once('value', AlreadyOpenAnswerFunc);
    function AlreadyOpenAnswerFunc(status) {
        if (oa.val().OpenAnswer == 0 && firstInit == false) {
            var showdapan = document.getElementById("showdapan1");
            var dapan1 = document.getElementById("odapan1");
            var dapan2 = document.getElementById("odapan2");
            var dapan3 = document.getElementById("odapan3");
            var dapan4 = document.getElementById("odapan4");
            document.getElementById("ttquestion").style.display = "flex";
            document.getElementById("tangtocimage").style.display = "block";
            if (localStorage.getItem("isProjector") === 'false') {
                var elements = document.getElementsByClassName("ans-group");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = "flex";
                }
            } else {
                if (localStorage.getItem("isGreenBackground") === 'true') {
                    document.getElementsByClassName("greenscreen-object")[0].style.display = "flex";
                    setTimeout(function () {
                        document.getElementsByClassName("greenscreen")[0].style.display = "block";
                    }, 1500);
                }
            }
            showdapan.style.display = 'none';
            dapan1.style.display = 'none';
            dapan2.style.display = 'none';
            dapan3.style.display = 'none';
            dapan4.style.display = 'none';


            dapan1.style.visibility = 'hidden';
            dapan2.style.visibility = 'hidden';
            dapan3.style.visibility = 'hidden';
            dapan4.style.visibility = 'hidden';
        }
        if (oa.val().OpenAnswer == 1 && firstInit == false) {
            document.getElementById("ttquestion").style.display = "none";
            document.getElementById("tangtocimage").style.display = "none";
            if (localStorage.getItem("isProjector") === 'false') {
                var elements = document.getElementsByClassName("ans-group");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = "none";
                }
            } else {
                if (localStorage.getItem("isGreenBackground") === 'true') {
                    document.getElementsByClassName("greenscreen-object")[0].style.display = "none";
                }
            }
            if (status.val().status == true && oa.val().OpenAnswer == 1) {
                var showdapan = document.getElementById("showdapan1");
                var dapan1 = document.getElementById("odapan1");
                var dapan2 = document.getElementById("odapan2");
                var dapan3 = document.getElementById("odapan3");
                var dapan4 = document.getElementById("odapan4");
                dapan1.classList.add('notransition');
                dapan2.classList.add('notransition');
                dapan3.classList.add('notransition');
                dapan4.classList.add('notransition');


                showdapan.style.display = 'block';
                dapan1.style.display = 'block';
                dapan2.style.display = 'block';
                dapan3.style.display = 'block';
                dapan4.style.display = 'block';

                dapan1.style.visibility = 'visible';
                dapan2.style.visibility = 'visible';
                dapan3.style.visibility = 'visible';
                dapan4.style.visibility = 'visible';


                if (localStorage.getItem("isDisplayAvatar") === 'true') {
                    document.getElementById("tsans1").style.display = "block";
                    document.getElementById("tsans2").style.display = "block";
                    document.getElementById("tsans3").style.display = "block";
                    document.getElementById("tsans4").style.display = "block";
                }


                document.getElementById("tentt1").style.display = "block";
                document.getElementById("pointt1").style.display = "block";
                document.getElementById("dapan1").style.display = "block";
                document.getElementById("tstamp1").style.display = "block";

                document.getElementById("tentt2").style.display = "block";
                document.getElementById("pointt2").style.display = "block";
                document.getElementById("dapan2").style.display = "block";
                document.getElementById("tstamp2").style.display = "block";


                document.getElementById("tentt3").style.display = "block";
                document.getElementById("pointt3").style.display = "block";
                document.getElementById("dapan3").style.display = "block";
                document.getElementById("tstamp3").style.display = "block";

                document.getElementById("tentt4").style.display = "block";
                document.getElementById("pointt4").style.display = "block";
                document.getElementById("dapan4").style.display = "block";
                document.getElementById("tstamp4").style.display = "block";
            } else if (status.val().status == false && oa.val().OpenAnswer == 1) {
                AccelerationAnswerShow.play();

                setTimeout(function () {
                    var showdapan = document.getElementById("showdapan1");
                    var dapan1 = document.getElementById("odapan1");
                    var dapan2 = document.getElementById("odapan2");
                    var dapan3 = document.getElementById("odapan3");
                    var dapan4 = document.getElementById("odapan4");
                    dapan1.classList.remove('notransition');
                    dapan2.classList.remove('notransition');
                    dapan3.classList.remove('notransition');
                    dapan4.classList.remove('notransition');
                    showdapan.style.display = 'block';
                    dapan1.style.display = 'block';
                    dapan2.style.display = 'block';
                    dapan3.style.display = 'block';
                    dapan4.style.display = 'block';

                    if (localStorage.getItem("isDisplayAvatar") === 'true') {
                        document.getElementById("tsans1").style.display = "none";
                        document.getElementById("tsans2").style.display = "none";
                        document.getElementById("tsans3").style.display = "none";
                        document.getElementById("tsans4").style.display = "none";
                    }


                    document.getElementById("tentt1").style.display = "none";
                    document.getElementById("pointt1").style.display = "none";
                    document.getElementById("dapan1").style.display = "none";
                    document.getElementById("tstamp1").style.display = "none";

                    document.getElementById("tentt2").style.display = "none";
                    document.getElementById("pointt2").style.display = "none";
                    document.getElementById("dapan2").style.display = "none";
                    document.getElementById("tstamp2").style.display = "none";


                    document.getElementById("tentt3").style.display = "none";
                    document.getElementById("pointt3").style.display = "none";
                    document.getElementById("dapan3").style.display = "none";
                    document.getElementById("tstamp3").style.display = "none";

                    document.getElementById("tentt4").style.display = "none";
                    document.getElementById("pointt4").style.display = "none";
                    document.getElementById("dapan4").style.display = "none";
                    document.getElementById("tstamp4").style.display = "none";

                }, 100)
                setTimeout(function () {

                    if (localStorage.getItem("isDisplayAvatar") === 'true') {
                        document.getElementById("tsans1").style.display = "block";
                        document.getElementById("tsans2").style.display = "block";
                        document.getElementById("tsans3").style.display = "block";
                        document.getElementById("tsans4").style.display = "block";
                    }

                    document.getElementById("tentt1").style.display = "block";
                    document.getElementById("pointt1").style.display = "block";
                    document.getElementById("dapan1").style.display = "block";
                    document.getElementById("tstamp1").style.display = "block";

                    document.getElementById("tentt2").style.display = "block";
                    document.getElementById("pointt2").style.display = "block";
                    document.getElementById("dapan2").style.display = "block";
                    document.getElementById("tstamp2").style.display = "block";


                    document.getElementById("tentt3").style.display = "block";
                    document.getElementById("pointt3").style.display = "block";
                    document.getElementById("dapan3").style.display = "block";
                    document.getElementById("tstamp3").style.display = "block";

                    document.getElementById("tentt4").style.display = "block";
                    document.getElementById("pointt4").style.display = "block";
                    document.getElementById("dapan4").style.display = "block";
                    document.getElementById("tstamp4").style.display = "block";
                }, 2000);
            }

        }
        firstInit = false;
    }
}


function MinusTimeMiliseconds() {
    var milliseconds = 0;
    setInterval(function () {
        if (milliseconds <= 1000) {
            milliseconds = milliseconds + 1;
        }
        if (milliseconds == 1000) {
            milliseconds = 0;
        }
        localStorage.setItem("mms", milliseconds);
    }, 1)
}

function MinusTimeSeconds(second) {
    var s = 0;
    var interval = setInterval(function () {
        if (s < second) {
            s = s + 1;
        }
        if (s == second) {
            s = 0;
            clearInterval(interval);
        }
        localStorage.setItem("s", s);
    }, 1000)
}


function HideAll() {
    document.getElementById("ttquestion").style.display = "none";
    document.getElementById("tangtocimage").style.display = "none";
    if (localStorage.getItem("isProjector") === 'false') {
        var elements = document.getElementsByClassName("ans-group");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
    } else {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            document.getElementsByClassName("greenscreen-object")[0].style.display = "none";
            document.getElementsByClassName("greenscreen")[0].style.display = "none";
        }
    }
}

function ShowAll() {
    document.getElementById("ttquestion").style.display = "flex";
    document.getElementById("tangtocimage").style.display = "block";
    if (localStorage.getItem("isProjector") === 'false') {
        var elements = document.getElementsByClassName("ans-group");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "flex";
        }
    } else {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            document.getElementsByClassName("greenscreen-object")[0].style.display = "flex";
            setTimeout(function () {
                document.getElementsByClassName("greenscreen")[0].style.display = "block";
            }, 1500);
        }
    }
}





TTANSKT.on("value", kiemtradapan);

function kiemtradapan(kt) {
    if (kt.val().kiemtra == 1) {

        var TTANSTIMESTAMPS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Timestamp');
        TTANSTIMESTAMPS1.once("value", ts1);

        function ts1(timestamp1) {
            var TTANSTIMESTAMPS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Timestamp');
            TTANSTIMESTAMPS2.once("value", ts2);

            function ts2(timestamp2) {
                var TTANSTIMESTAMPS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Timestamp');
                TTANSTIMESTAMPS3.once("value", ts3);

                function ts3(timestamp3) {
                    var TTANSTIMESTAMPS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Timestamp');
                    TTANSTIMESTAMPS4.once("value", ts4);

                    function ts4(timestamp4) {
                        var pointref1 = firebase.database().ref(matchid + "/point/player1");
                        pointref1.on("value", p1);
                        function p1(point1) {
                            var pointref2 = firebase.database().ref(matchid + "/point/player2");
                            pointref2.on("value", p2);

                            function p2(point2) {
                                var pointref3 = firebase.database().ref(matchid + "/point/player3");
                                pointref3.on("value", p3);

                                function p3(point3) {
                                    var pointref4 = firebase.database().ref(matchid + "/point/player4");
                                    pointref4.on("value", p4);

                                    function p4(point4) {
                                        var tstamptt1 = parseFloat(timestamp1.val().timestamp);
                                        var tstamptt2 = parseFloat(timestamp2.val().timestamp);
                                        var tstamptt3 = parseFloat(timestamp3.val().timestamp);
                                        var tstamptt4 = parseFloat(timestamp4.val().timestamp);

                                        var diem1 = point1.val().point;
                                        var diem2 = point2.val().point;
                                        var diem3 = point3.val().point;
                                        var diem4 = point4.val().point;




                                        var point = [{
                                            timestamp: tstamptt1,
                                            point: diem1,
                                        },
                                        {
                                            timestamp: tstamptt2,
                                            point: diem2,
                                        },
                                        {
                                            timestamp: tstamptt3,
                                            point: diem3,
                                        },
                                        {
                                            timestamp: tstamptt4,
                                            point: diem4,
                                        },
                                        ];

                                        point.sort(function (a, b) { return a.timestamp - b.timestamp });

                                        pointt1.innerHTML = point[0].point;
                                        pointt2.innerHTML = point[1].point;
                                        pointt3.innerHTML = point[2].point;
                                        pointt4.innerHTML = point[3].point;

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        var TTQ = firebase.database().ref(matchid + "/AccelerationQuestion/QS" + localStorage.getItem("TT"));
        TTQ.on("value", dapanqs);

        function dapanqs(dapan) {
            var answer = dapan.val().dapan;
            var qsbar = document.getElementById("question");
            qsbar.innerHTML = "ĐÁP ÁN: " + answer;
        }
        COFTTTT1.once("value", ds1);

        function ds1(ds1) {
            COFTTTT2.once("value", ds2);

            function ds2(ds2) {
                COFTTTT3.once("value", ds3);

                function ds3(ds3) {
                    COFTTTT4.once("value", ds4);

                    function ds4(ds4) {
                        if (ds1.val().correctorwrong == 0) {
                            resetPlayerAnswer();
                        }
                        if (ds2.val().correctorwrong == 0) {
                            resetPlayerAnswer();
                        }
                        if (ds3.val().correctorwrong == 0) {
                            resetPlayerAnswer();
                        }
                        if (ds4.val().correctorwrong == 0) {
                            resetPlayerAnswer();
                        }
                        if (ds1.val().correctorwrong == 2) {
                            var dapantt1 = document.getElementById("odapan1");
                            dapantt1.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) )";
                        }
                        if (ds2.val().correctorwrong == 2) {
                            var dapantt2 = document.getElementById("odapan2");
                            dapantt2.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) )";
                        }
                        if (ds3.val().correctorwrong == 2) {
                            var dapantt3 = document.getElementById("odapan3");
                            dapantt3.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) )";
                        }
                        if (ds4.val().correctorwrong == 2) {
                            var dapantt4 = document.getElementById("odapan4");
                            dapantt4.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) )";
                        }
                        if (ds1.val().correctorwrong == 1) {
                            AccelerationAnswerCorrect.play();
                            var dapantt1 = document.getElementById("odapan1");
                            setBackgroundColorAnswer(1);
                        }
                        if (ds2.val().correctorwrong == 1) {
                            AccelerationAnswerCorrect.play();
                            var dapantt2 = document.getElementById("odapan2");
                            setBackgroundColorAnswer(2);
                        }
                        if (ds3.val().correctorwrong == 1) {
                            AccelerationAnswerCorrect.play();
                            var dapantt3 = document.getElementById("odapan3");
                            setBackgroundColorAnswer(3);
                        }
                        if (ds4.val().correctorwrong == 1) {
                            AccelerationAnswerCorrect.play();
                            var dapantt4 = document.getElementById("odapan4");
                            setBackgroundColorAnswer(4);
                        }
                        if (ds1.val().correctorwrong == 2 && ds2.val().correctorwrong == 2 && ds3.val().correctorwrong == 2 && ds4.val().correctorwrong == 2) {
                            AccelerationWrongAnswer.play();
                        }
                    }
                }
            }
        }
    }
}

function resetPlayerAnswer() {
    const data = JSON.parse(localStorage.getItem("themeData"));
    var PlayerAnswerElements = document.getElementsByClassName("PlayerAnswer");
    for (let i = 0; i < PlayerAnswerElements.length; i++) {
        if (data.AccelerationCompetitorAnswer != "") {
            PlayerAnswerElements[i].style.background = CheckBackgroundValue(data.AccelerationCompetitorAnswer);
            PlayerAnswerElements[i].style.backgroundSize = "cover";
        } else {
            PlayerAnswerElements[i].style.background = "linear-gradient(120deg, rgba(0, 56, 127, 1) 0%, rgba(0, 56, 127, 1) 100%)";
        }
    }
}

function setBackgroundColorAnswer(player) {
    const data = JSON.parse(localStorage.getItem("themeData"));
    var PlayerAnswer = document.getElementById("odapan" + player);
    if (data.AccelerationCompetitorAnswer != "") {
        PlayerAnswer.style.background = CheckBackgroundValue(data.AccelerationCompetitorAnswer);
        PlayerAnswer.style.backgroundSize = "cover";
    } else {
        PlayerAnswer.style.background = "linear-gradient(120deg, rgba(0, 56, 127, 1) 0%, rgba(0, 56, 127, 1) 100%)";
    }
}

var timestamp;

function MinusTimeInput(time) {
    startTime = Date.now();

    var interval = setInterval(function () {
        var elapsedTime = Date.now() - startTime;

        // Check if elapsed time is greater than or equal to target time
        if (elapsedTime >= time * 1000) {
            clearInterval(interval);
            timestamp = (elapsedTime / 1000).toFixed(3);
            return; // Exit the interval function immediately
        }

        timestamp = (elapsedTime / 1000).toFixed(3);
    }, 10);
}


document.getElementById('ttans').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        var ans = document.getElementById("ttans");
        var id = localStorage.getItem("id");
        var answerclient = document.getElementById("dapan");
        var prenewans = ans.value.replaceAll('<', '');
        var newans = prenewans.replaceAll('>', '');

        document.getElementById("dapan").value = newans.toUpperCase() + "/" + timestamp;

        var TTANS = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + id + '/Answer');
        var TTANSTIMESTAMPS = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + id + '/Timestamp');


        var ans = document.getElementById("ttans");
        var prenewans = ans.value.replace('<', '');
        var newans = prenewans.replace('>', '');
        if (newans != "") {
            var sendans = {
                answer: newans.toUpperCase(),
            }
            var ts = {
                timestamp: timestamp,
            }
            TTANS.set(sendans);
            TTANSTIMESTAMPS.set(ts);
        } else {
            var sendans = {
                answer: newans.toUpperCase(),
            }
            var ts = {
                timestamp: 0,
            }
            TTANS.set(sendans);
            TTANSTIMESTAMPS.set(ts);
        }
        ans.value = '';
    }
});

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

var AccelerationDisplayAnswerImageStatus = firebase.database().ref(matchid + '/AccelerationDisplayAnswerImage/');
AccelerationDisplayAnswerImageStatus.on('value', displayAnswerImage);
function displayAnswerImage(displayImageStatus) {
    if (displayImageStatus.val().status === true) {
        var ttNumber = localStorage.getItem("TT");
        var imageItem = document.getElementById("tt" + ttNumber);

        firebase.storage().ref(matchid + "/tt/datt" + localStorage.getItem("TT") + "/tt" + localStorage.getItem("TT") + ".jpg").getDownloadURL().then(imgUrl => {
            imageItem.poster = imgUrl;
        }).catch((error) => {
        });
    }
}


const data = JSON.parse(localStorage.getItem("themeData"));

if (data.Background.startsWith("url")) {
    document.body.style.backgroundImage = data.Background;
} else if (data.Background !== "") {
    document.body.style.background = data.Background;
} else {
    document.body.style.backgroundImage = 'url("/img/NewBackground.png")';
}

document.getElementsByClassName("image-question")[0].style.background = CheckBackgroundValue(data.AccelerationQuestion);
document.getElementsByClassName("image-question")[0].style.backgroundSize = "cover";
document.getElementsByClassName("image-question")[0].style.border = data.AccelerationObjectBorder;
document.getElementsByClassName("image-question")[0].style.color = data.AccelerationTextColor;

document.getElementsByClassName("image")[0].style.background = CheckBackgroundValue(data.AccelerationMedia);
document.getElementsByClassName("image")[0].style.backgroundSize = "cover";
document.getElementsByClassName("image")[0].style.border = data.AccelerationObjectBorder;


var PlayerAnswerElements = document.getElementsByClassName("PlayerAnswer");
for (let i = 0; i < PlayerAnswerElements.length; i++) {
    PlayerAnswerElements[i].style.background = CheckBackgroundValue(data.AccelerationCompetitorAnswer);
    PlayerAnswerElements[i].style.backgroundSize = "cover";
    PlayerAnswerElements[i].style.border = data.AccelerationObjectBorder;
    PlayerAnswerElements[i].style.color = data.AccelerationTextColor;
}

const element = document.querySelector('.image');
if (element) {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        .image::after {
            background: ${data.AccelerationSlide};
        }
    `, styleSheet.cssRules.length);
}

var GreenScreenElementBackground = document.getElementsByClassName("greenscreen-object");

if (GreenScreenElementBackground) {
    GreenScreenElementBackground[0].style.background = CheckBackgroundValue(data.AccelerationMedia);
    GreenScreenElementBackground[0].style.backgroundSize = "cover";
    GreenScreenElementBackground[0].style.border = data.AccelerationObjectBorder;
}

function CheckBackgroundValue(BackgroundVal) {
    if (BackgroundVal.startsWith("url")) {
        return BackgroundVal + "no-repeat";
    } else {
        return BackgroundVal;
    }
}