//Handle UI
if (localStorage.getItem("isProjector") === 'true') {
    if (localStorage.getItem("isDisplayAvatar") === 'false') {
        var elements = document.getElementsByClassName("playervdimage");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
        document.getElementById("tt0").style.display = "none";
    }
    if (localStorage.getItem("isGreenBackground") === 'true') {
        document.getElementById("competition-name").innerHTML = "";
    }
}

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
document.getElementById("audio_24").volume = 0.5;
document.getElementById("audio_25").volume = 0.5;
document.getElementById("audio_26").volume = 0.5;
document.getElementById("audio_27").volume = 0.5;
document.getElementById("audio_28").volume = 0.5;
document.getElementById("audio_29").volume = 0.5;
document.getElementById("audio_30").volume = 0.5;
document.getElementById("audio_31").volume = 0.5;
document.getElementById("audio_32").volume = 0.5;
document.getElementById("audio_33").volume = 0.5;
document.getElementById("audio_34").volume = 0.5;
document.getElementById("audio_35").volume = 0.5;
document.getElementById("audio_36").volume = 0.5;
document.getElementById("audio_extra_11").volume = 0.5;
document.getElementById("audio_extra_12").volume = 0.5;




var matchid = getCookie("matchid");



var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");


var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
var refvedichbatdau = firebase.database().ref(matchid + "/phanthistatus/vedich");
var playerstatus = firebase.database().ref(matchid + '/playerstatus/vedich');

refthisinhvedich.on("value", tsvd);

function tsvd(vd) {
    var tsid = vd.val().player;
    localStorage.setItem("TSVD", tsid);
}

var QPChoose = firebase.database().ref(matchid + "/FinishPoint/status");
var QPChooseC1 = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/1");
var QPChooseC2 = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/2");
var QPChooseC3 = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/3");


var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");



var VDQN = firebase.database().ref(matchid + "/VDCauso");
var VDPlayerEnd = firebase.database().ref(matchid + "/VDPlayerTurnEnd/End");

var bar = document.getElementById("bar");

var qp10 = document.getElementById("qp10");
var qp20 = document.getElementById("qp20");
var qp30 = document.getElementById("qp30");

var checkbox1qp10 = document.getElementById("checkbox1qp10");
var checkbox2qp10 = document.getElementById("checkbox2qp10");
var checkbox3qp10 = document.getElementById("checkbox3qp10");

var tick1qp10 = document.getElementById("tick1qp10");
var tick2qp10 = document.getElementById("tick2qp10");
var tick3qp10 = document.getElementById("tick3qp10");

var video1 = document.getElementById("video1");
var video2 = document.getElementById("video2");
var video3 = document.getElementById("video3");
var video4 = document.getElementById("video4");


firebase.storage().ref(matchid + '/vd/vd1/vd.mp4').getDownloadURL().then(imgUrl => {
    video1.src = imgUrl
});
firebase.storage().ref(matchid + '/vd/vd2/vd.mp4').getDownloadURL().then(imgUrl => {
    video2.src = imgUrl
});
firebase.storage().ref(matchid + '/vd/vd3/vd.mp4').getDownloadURL().then(imgUrl => {
    video3.src = imgUrl
});
firebase.storage().ref(matchid + '/vd/vd4/vd.mp4').getDownloadURL().then(imgUrl => {
    video4.src = imgUrl
});



var checkbox1qp20 = document.getElementById("checkbox1qp20");
var checkbox2qp20 = document.getElementById("checkbox2qp20");
var checkbox3qp20 = document.getElementById("checkbox3qp20");

var tick1qp20 = document.getElementById("tick1qp20");
var tick2qp20 = document.getElementById("tick2qp20");
var tick3qp20 = document.getElementById("tick3qp20");

var checkbox1qp30 = document.getElementById("checkbox1qp30");
var checkbox2qp30 = document.getElementById("checkbox2qp30");
var checkbox3qp30 = document.getElementById("checkbox3qp30");

var tick1qp30 = document.getElementById("tick1qp30");
var tick2qp30 = document.getElementById("tick2qp30");
var tick3qp30 = document.getElementById("tick3qp30");

var playertt1 = document.getElementById("playertt1");
var playertt2 = document.getElementById("playertt2");
var playertt3 = document.getElementById("playertt3");
var playertt4 = document.getElementById("playertt4");
var ts1point = firebase.database().ref(matchid + '/point/player1');
var ts2point = firebase.database().ref(matchid + '/point/player2');
var ts3point = firebase.database().ref(matchid + '/point/player3');
var ts4point = firebase.database().ref(matchid + '/point/player4');

var ts1name = firebase.database().ref(matchid + "/games/player1");
var ts2name = firebase.database().ref(matchid + "/games/player2");
var ts3name = firebase.database().ref(matchid + "/games/player3");
var ts4name = firebase.database().ref(matchid + "/games/player4");

var tt1point1 = document.getElementById("tt1point1");
var tt2point1 = document.getElementById("tt2point1");
var tt3point1 = document.getElementById("tt3point1");

var tt1point2 = document.getElementById("tt1point2");
var tt2point2 = document.getElementById("tt2point2");
var tt3point2 = document.getElementById("tt3point2");

var tt1point3 = document.getElementById("tt1point3");
var tt2point3 = document.getElementById("tt2point3");
var tt3point3 = document.getElementById("tt3point3");

var tt1point4 = document.getElementById("tt1point4");
var tt2point4 = document.getElementById("tt2point4");
var tt3point4 = document.getElementById("tt3point4");

var tsvdpoint1 = document.getElementById("tsvdpoint1");
var tsvdpoint2 = document.getElementById("tsvdpoint2");
var tsvdpoint3 = document.getElementById("tsvdpoint3");
var tsvdpoint4 = document.getElementById("tsvdpoint4");

var tt1name = document.getElementById("tt1name");
var tt2name = document.getElementById("tt2name");
var tt3name = document.getElementById("tt3name");

var ngoisao = document.getElementById("ngoisao");

var question = document.getElementById("question");


var currentplayer = document.getElementById("currentplayer");

var info = document.getElementById("info");

var refvedichdungsai = firebase.database().ref(matchid + '/VDCorrectOrWrong/');
var thisinhvedichname = document.getElementById("tsvdname");
var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
var VDChuongPlayer = firebase.database().ref(matchid + "/VDChuong/Player");
var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");

var chuongui = document.getElementById("chuong");

function checkifQP10HasQuestion() {
    var check = firebase.database().ref(matchid + "/question/10");
    check.on("value", checkifQP10HasQuestion1);

}


var UserStart = document.getElementById("audio_24");
var QuestionPackShow = document.getElementById("audio_25");
var ChoiceChosen = document.getElementById("audio_26");
var QuestionPackChoose = document.getElementById("audio_27");
var Finish10Sec = document.getElementById("audio_28");
var Finish15Sec = document.getElementById("audio_29");
var Finish20Sec = document.getElementById("audio_30");
var CorrectAns = document.getElementById("audio_31");
var WrongAns = document.getElementById("audio_32");
var Finish5Sec = document.getElementById("audio_33");
var AnsGranted = document.getElementById("audio_34");
var FinishFinish = document.getElementById("audio_35");
var StarChoose = document.getElementById("audio_36");

playerstatus.on('value', player);

function player(pl) {
    if (pl.val().player == 0) {
        var tsvdpoint1 = document.getElementById("tsvdpoint1");
        var tsvdpoint2 = document.getElementById("tsvdpoint2");
        var tsvdpoint3 = document.getElementById("tsvdpoint3");
        var tsvdpoint4 = document.getElementById("tsvdpoint4");
        tsvdpoint1.style.display = "none";
        tsvdpoint2.style.display = "none";
        tsvdpoint3.style.display = "none";
        tsvdpoint4.style.display = "none";

    }
    if (pl.val().player == 1) {

        document.getElementById("competition-name").style.display = "none";

        UserStart.play();
        var ts1ref = firebase.database().ref(matchid + "/games/player1");
        var tsvdpoint1 = document.getElementById("tsvdpoint1");
        var tsvdpoint2 = document.getElementById("tsvdpoint2");
        var tsvdpoint3 = document.getElementById("tsvdpoint3");
        var tsvdpoint4 = document.getElementById("tsvdpoint4");

        tsvdpoint1.style.display = "block";
        tsvdpoint2.style.display = "none";
        tsvdpoint3.style.display = "none";
        tsvdpoint4.style.display = "none";


        ts1ref.on('value', ts1);

        function ts1(tsinfo) {
            thisinhvedichname.innerHTML = tsinfo.val().displayName;
            var ts1uid = tsinfo.val().uid;
            firebase.storage().ref('users/' + ts1uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tt0.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tt0.src = imgUrl;
                })
            });
        }
        var ts1point = firebase.database().ref(matchid + '/point/player1');
        ts1point.on('value', p1);

        function p1(point1) {
            tsvdpoint1.innerHTML = point1.val().point;
        }

        setTimeout(function () {
            QuestionPackShow.play();
            //Question Bar


            qp20.style.display = "block";
            qp30.style.display = "block";

            // Define the callback function
            function handleResult(result) {
                if (result) {
                    qp10.style.display = "block";
                    checkbox1qp10.style.display = "block";
                    checkbox2qp10.style.display = "block";
                    checkbox3qp10.style.display = "block";
                } else {
                }
            }

            // Call the function with the callback
            checkValuesExistInFirebase(10, handleResult);

            checkbox1qp20.style.display = "block";
            checkbox2qp20.style.display = "block";
            checkbox3qp20.style.display = "block";

            checkbox1qp30.style.display = "block";
            checkbox2qp30.style.display = "block";
            checkbox3qp30.style.display = "block";

        }, 5000)


    }
    if (pl.val().player == 2) {

        document.getElementById("competition-name").style.display = "none";
        UserStart.play();
        var ts2ref = firebase.database().ref(matchid + "/games/player2");


        ts2ref.on('value', ts2);

        function ts2(tsinfo) {
            thisinhvedichname.innerHTML = tsinfo.val().displayName;
            var ts2uid = tsinfo.val().uid;
            firebase.storage().ref('users/' + ts2uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tt0.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tt0.src = imgUrl;
                })
            });
        }


        var ts2point = firebase.database().ref(matchid + '/point/player2');
        var tsvdpoint1 = document.getElementById("tsvdpoint1");
        var tsvdpoint2 = document.getElementById("tsvdpoint2");
        var tsvdpoint3 = document.getElementById("tsvdpoint3");
        var tsvdpoint4 = document.getElementById("tsvdpoint4");

        tsvdpoint1.style.display = "none";
        tsvdpoint2.style.display = "block";
        tsvdpoint3.style.display = "none";
        tsvdpoint4.style.display = "none";
        ts2point.on('value', p2);

        function p2(point2) {
            tsvdpoint2.innerHTML = point2.val().point;
        }

        setTimeout(function () {
            QuestionPackShow.play();
            //Question Bar


            qp20.style.display = "block";
            qp30.style.display = "block";

            // Define the callback function
            function handleResult(result) {
                if (result) {
                    qp10.style.display = "block";
                    checkbox1qp10.style.display = "block";
                    checkbox2qp10.style.display = "block";
                    checkbox3qp10.style.display = "block";
                } else {
                }
            }

            // Call the function with the callback
            checkValuesExistInFirebase(10, handleResult);

            checkbox1qp20.style.display = "block";
            checkbox2qp20.style.display = "block";
            checkbox3qp20.style.display = "block";

            checkbox1qp30.style.display = "block";
            checkbox2qp30.style.display = "block";
            checkbox3qp30.style.display = "block";

        }, 5000)
    }
    if (pl.val().player == 3) {

        document.getElementById("competition-name").style.display = "none";
        UserStart.play();
        var ts3ref = firebase.database().ref(matchid + "/games/player3");
        ts3ref.on('value', ts3);

        function ts3(tsinfo) {
            thisinhvedichname.innerHTML = tsinfo.val().displayName;
            var ts3uid = tsinfo.val().uid;
            firebase.storage().ref('users/' + ts3uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tt0.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tt0.src = imgUrl;
                })
            });
        }


        var ts3point = firebase.database().ref(matchid + '/point/player3');
        var tsvdpoint1 = document.getElementById("tsvdpoint1");
        var tsvdpoint2 = document.getElementById("tsvdpoint2");
        var tsvdpoint3 = document.getElementById("tsvdpoint3");
        var tsvdpoint4 = document.getElementById("tsvdpoint4");

        tsvdpoint1.style.display = "none";
        tsvdpoint2.style.display = "none";
        tsvdpoint3.style.display = "block";
        tsvdpoint4.style.display = "none";
        ts3point.on('value', p3);

        function p3(point3) {
            tsvdpoint3.innerHTML = point3.val().point;
        }
        setTimeout(function () {
            QuestionPackShow.play();
            //Question Bar


            qp20.style.display = "block";
            qp30.style.display = "block";


            // Define the callback function
            function handleResult(result) {
                if (result) {
                    qp10.style.display = "block";
                    checkbox1qp10.style.display = "block";
                    checkbox2qp10.style.display = "block";
                    checkbox3qp10.style.display = "block";
                } else {
                }
            }

            // Call the function with the callback
            checkValuesExistInFirebase(10, handleResult);



            checkbox1qp20.style.display = "block";
            checkbox2qp20.style.display = "block";
            checkbox3qp20.style.display = "block";

            checkbox1qp30.style.display = "block";
            checkbox2qp30.style.display = "block";
            checkbox3qp30.style.display = "block";


        }, 5000)
    }
    if (pl.val().player == 4) {

        document.getElementById("competition-name").style.display = "none";

        UserStart.play();
        var ts4ref = firebase.database().ref(matchid + "/games/player4");
        ts4ref.on('value', ts4);

        function ts4(tsinfo) {
            thisinhvedichname.innerHTML = tsinfo.val().displayName;
            var ts4uid = tsinfo.val().uid;
            firebase.storage().ref('users/' + ts4uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tt0.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tt0.src = imgUrl;
                })
            });
        }


        var ts4point = firebase.database().ref(matchid + '/point/player4');
        var tsvdpoint1 = document.getElementById("tsvdpoint1");
        var tsvdpoint2 = document.getElementById("tsvdpoint2");
        var tsvdpoint3 = document.getElementById("tsvdpoint3");
        var tsvdpoint4 = document.getElementById("tsvdpoint4");

        tsvdpoint1.style.display = "none";
        tsvdpoint2.style.display = "none";
        tsvdpoint3.style.display = "none";
        tsvdpoint4.style.display = "block";
        ts4point.on('value', p4);

        function p4(point4) {
            tsvdpoint4.innerHTML = point4.val().point;
        }

        setTimeout(function () {
            QuestionPackShow.play();
            //Question Bar


            qp20.style.display = "block";
            qp30.style.display = "block";

            // Define the callback function
            function handleResult(result) {
                if (result) {
                    qp10.style.display = "block";
                    checkbox1qp10.style.display = "block";
                    checkbox2qp10.style.display = "block";
                    checkbox3qp10.style.display = "block";
                } else {
                }
            }

            // Call the function with the callback
            checkValuesExistInFirebase(10, handleResult);



            checkbox1qp20.style.display = "block";
            checkbox2qp20.style.display = "block";
            checkbox3qp20.style.display = "block";

            checkbox1qp30.style.display = "block";
            checkbox2qp30.style.display = "block";
            checkbox3qp30.style.display = "block";

        }, 5000)
    }

}


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



ts1point.on("value", point1);

function point1(p1) {
    document.getElementById("tt1point").innerHTML = p1.val().point;
}
ts2point.on("value", point2);

function point2(p2) {
    document.getElementById("tt2point").innerHTML = p2.val().point;
}
ts3point.on("value", point3);

function point3(p3) {
    document.getElementById("tt3point").innerHTML = p3.val().point;
}
ts4point.on("value", point4);

function point4(p4) {
    document.getElementById("tt4point").innerHTML = p4.val().point;
}



QPChoose.on("value", qc)

function qc(questionchose) {
    if (questionchose.val().status == 1) {
        var QPChooseC1 = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/1");
        var QPChooseC2 = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/2");
        var QPChooseC3 = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/3");
        QPChooseC1.once("value", c1);

        function c1(question1) {
            QPChooseC2.once("value", c2);

            function c2(question2) {
                QPChooseC3.once("value", c3);

                function c3(question3) {
                    if (question1.val().cau1 && question2.val().cau2 && question3.val().cau3) {
                        setTimeout(function () {
                            var questionnumber = document.getElementById("questionnumber");
                            var questionbar = document.getElementById("question1");
                            questionnumber.innerHTML = "";
                            questionbar.innerHTML = "";
                        }, 1000);
                        setTimeout(function () {
                            if (question1.val().cau1 == 10) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick1qp10.style.display = "block";
                                return false;
                            }
                            if (question1.val().cau1 == 20) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick1qp20.style.display = "block";
                                return false;
                            }
                            if (question1.val().cau1 == 30) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick1qp30.style.display = "block";
                                return false;
                            }
                        }, 2000)

                        setTimeout(function () {
                            if (question2.val().cau2 == 10) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick2qp10.style.display = "block";
                                return false;
                            }
                            if (question2.val().cau2 == 20) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick2qp20.style.display = "block";
                                return false;
                            }
                            if (question2.val().cau2 == 30) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick2qp30.style.display = "block";
                                return false;
                            }
                        }, 3000)



                        setTimeout(function () {
                            if (question3.val().cau3 == 10) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick3qp10.style.display = "block";
                                return false;
                            }
                            if (question3.val().cau3 == 20) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick3qp20.style.display = "block";
                                return false;
                            }
                            if (question3.val().cau3 == 30) {
                                ChoiceChosen.currentTime = 0;
                                ChoiceChosen.play();
                                tick3qp30.style.display = "block";
                                return false;
                            }
                        }, 4000)

                        setTimeout(function () {
                            QuestionPackChoose.play();
                            // bar.style.display = "none";

                            qp10.style.display = "none";
                            qp20.style.display = "none";
                            qp30.style.display = "none";

                            checkbox1qp10.style.display = "none";
                            checkbox2qp10.style.display = "none";
                            checkbox3qp10.style.display = "none";

                            tick1qp10.style.display = "none";
                            tick2qp10.style.display = "none";
                            tick3qp10.style.display = "none";

                            checkbox1qp20.style.display = "none";
                            checkbox2qp20.style.display = "none";
                            checkbox3qp20.style.display = "none";

                            tick1qp20.style.display = "none";
                            tick2qp20.style.display = "none";
                            tick3qp20.style.display = "none";

                            checkbox1qp30.style.display = "none";
                            checkbox2qp30.style.display = "none";
                            checkbox3qp30.style.display = "none";

                            tick1qp30.style.display = "none";
                            tick2qp30.style.display = "none";
                            tick3qp30.style.display = "none";
                        }, 5000)


                        setTimeout(function () {

                            if (localStorage.getItem("TSVD") == 1) {
                                playertt2.style.display = "flex";
                                playertt3.style.display = "flex";
                                playertt4.style.display = "flex";
                            } else if (localStorage.getItem("TSVD") == 2) {
                                playertt1.style.display = "flex";
                                playertt3.style.display = "flex";
                                playertt4.style.display = "flex";
                            } else if (localStorage.getItem("TSVD") == 3) {
                                playertt1.style.display = "flex";
                                playertt2.style.display = "flex";
                                playertt4.style.display = "flex";
                            } else if (localStorage.getItem("TSVD") == 4) {
                                playertt1.style.display = "flex";
                                playertt2.style.display = "flex";
                                playertt3.style.display = "flex";
                            }

                            let questionElement = document.querySelector('.question');
                            questionElement.style.setProperty('--timer-width', '0%');

                            question.style.display = "block";
                            currentplayer.style.display = "flex";

                            if (localStorage.getItem("isProjector") === 'false') {
                                chuongui.style.display = "block";
                            } else {
                                chuongui.style.display = "none";
                            }
                        }, 7000)


                    }
                    return false;
                }
            }
        }
    } else { }
}



VDQN.on('value', questionumber);

function questionumber(qs) {
    var causo = qs.val().causo;
    var QSP = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/" + causo + "/cau" + causo);

    QSP.on('value', qp);


    function qp(questionpack) {
        var QSP1 = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/1");
        QSP1.on('value', qp1);
        function qp1(qpl1) {
            var QSP2 = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/2");
            QSP2.on('value', qp2);
            function qp2(qpl2) {
                var QSP3 = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/3");
                QSP3.on('value', qp3);
                function qp3(qpl3) {
                    qpack = questionpack.val();
                    var questionref = firebase.database().ref(matchid + '/FinishQuestion/' + 'Q' + localStorage.getItem("TSVD") + 'DB' + '/QP' + qpack + "/" + causo);
                    questionref.on('value', question);

                    function question(quest) {
                        var questionnumber = document.getElementById("questionnumber");
                        var questionbar = document.getElementById("question1");
                        if (causo == 0) {
                            questionnumber.innerHTML = "";
                            questionbar.innerHTML = "";
                        } else {
                            questionnumber.innerHTML = "Câu hỏi số " + causo + "/ Câu hỏi mức " + qpack + " điểm" + " | " + "Gói câu hỏi: " + qpl1.val().cau1 + "-" + qpl2.val().cau2 + "-" + qpl3.val().cau3;
                            questionbar.innerHTML = quest.val().cauhoi;
                            if (qpack == 10) {
                                let questionElement = document.querySelector('.question');
                                questionElement.style.setProperty('--timer-width', '0%');
                            }
                            if (qpack == 20) {
                                let questionElement = document.querySelector('.question');
                                questionElement.style.setProperty('--timer-width', '0%');
                            }
                            if (qpack == 30) {
                                let questionElement = document.querySelector('.question');
                                questionElement.style.setProperty('--timer-width', '0%');
                            }
                        }

                        refvedichbatdau.on('value', vdstatus);

                        function vdstatus(status) {
                            if (status.val().batdau == 1) {
                                if (qpack == 10) {
                                    playSlider(10);
                                    Finish10Sec.currentTime = 0;
                                    Finish10Sec.play();
                                }
                                if (qpack == 20) {
                                    playSlider(15);
                                    Finish15Sec.currentTime = 0;
                                    Finish15Sec.play();
                                }
                                if (qpack == 30) {
                                    playSlider(20);
                                    Finish20Sec.currentTime = 0;
                                    Finish20Sec.play();
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}


function playSlider(maxTime) {
    let time = 0;
    let questionElement = document.querySelector('.question');
    let steps = maxTime * 100; // 100 steps per second

    function updateSlider() {
        if (time <= steps) {
            let percentage = (time / steps) * 100;
            questionElement.style.setProperty('--timer-width', percentage + '%');
            time++;
        } else {
            clearInterval(timerInterval);
        }
    }

    let timerInterval = setInterval(updateSlider, 10); // Update every 10 milliseconds for smoothness
}



refvedichdungsai.on('value', vdcor);

function vdcor(vddungsai) {
    if (vddungsai.val().dungsai == 1) {
        CorrectAns.play();
    }
    if (vddungsai.val().dungsai == 3) {
        var timer = document.getElementById("timer");
        var seconds = 5;
        playSlider(5);
        function Minus5Seconds() {
            var timer = document.getElementById("timer");
            var seconds = 5;
            setInterval(function () {
                if (seconds > 0) {
                    seconds = seconds - 1;
                }
            }, 1000)
        };
        Finish5Sec.play();
        Minus5Seconds();
        setTimeout(function () {
            var chuong = {
                status: 4
            }
            VDChuong.set(chuong);
        }, 5000)
    }
}


var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
VDChuong.on("value", chuongstatus);

function chuongstatus(cs) {
    if (cs.val().status == 1) {
        firebase.database().ref(matchid + '/VDChuong/Player').limitToFirst(1).on('value', function (snapshot) {
            snapshot.forEach(function (e) {
                var x = e.val().id;
                if (x == 1) {
                    // playertt1.style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(1);
                    AnsGranted.play();
                    return false;
                }
                if (x == 2) {
                    // playertt2.style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(2);
                    AnsGranted.play();
                    return false;
                }
                if (x == 3) {
                    // playertt3.style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(3);
                    AnsGranted.play();
                    return false;
                }
                if (x == 4) {
                    // playertt4.style.backgroundImage = 'url("/img/backgroundobject-chuong.jpg")';
                    setAnsweringPlayer(4);
                    AnsGranted.play();
                    return false;
                }
            })
        })
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






VDChuong.on("value", chuongstatus1);

function chuongstatus1(cs1) {
    if (cs1.val().status == 0) {
        // playertt1.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // playertt2.style.backgroundImage = 'url("/img/backgroundobject.jpg")';    
        // playertt3.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // playertt4.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        resetPlayer();
    }
    if (cs1.val().status == 3) {
        // playertt1.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // playertt2.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // playertt3.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
        // playertt4.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
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


VDNSHV.on("value", NSHV);

function NSHV(hope) {
    if (hope.val().status == 0) {
        ngoisao.style.display = "none";
    }
    if (hope.val().status == 1) {
        ngoisao.style.display = "block";
        StarChoose.play();
    }
}
VDChuongCoW.on('value', vdchuongcow);

function vdchuongcow(cow) {
    if (cow.val().correctorwrong == 1) {
        firebase.database().ref(matchid + '/VDChuong/Player').limitToFirst(1).once('child_added', function (snapshot) {
            const getID = snapshot.val();
            var x = getID.id;
            if (x == 1) {
                // playertt1.style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                CorrectAns.play();
            }
            if (x == 2) {
                // playertt2.style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                CorrectAns.play();
            }
            if (x == 3) {
                // playertt3.style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                CorrectAns.play();
            }
            if (x == 4) {
                // playertt4.style.backgroundImage = 'url("/img/backgroundobject-dung.jpg")';
                CorrectAns.play();
            }
        })
    }

    if (cow.val().correctorwrong == 2) {
        firebase.database().ref(matchid + '/VDChuong/Player').limitToFirst(1).once('value', function (snapshot) {
            snapshot.forEach(function (e) {
                var x = e.val().id;
                if (x == 1) {
                    playertt1.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                    WrongAns.play();
                }
                if (x == 2) {
                    playertt2.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                    WrongAns.play();
                }
                if (x == 3) {
                    playertt3.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                    WrongAns.play();
                }
                if (x == 4) {
                    playertt4.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                    WrongAns.play();
                }
            })
        })
    }
}


VDPlayerEnd.on('value', endturn);

function endturn(e) {
    if (e.val().end == 1) {

        document.getElementById("competition-name").style.display = "block";


        qp10.style.display = "none";
        qp20.style.display = "none";
        qp30.style.display = "none";

        checkbox1qp10.style.display = "none";
        checkbox2qp10.style.display = "none";
        checkbox3qp10.style.display = "none";

        tick1qp10.style.display = "none";
        tick2qp10.style.display = "none";
        tick3qp10.style.display = "none";

        checkbox1qp20.style.display = "none";
        checkbox2qp20.style.display = "none";
        checkbox3qp20.style.display = "none";

        tick1qp20.style.display = "none";
        tick2qp20.style.display = "none";
        tick3qp20.style.display = "none";

        checkbox1qp30.style.display = "none";
        checkbox2qp30.style.display = "none";
        checkbox3qp30.style.display = "none";

        tick1qp30.style.display = "none";
        tick2qp30.style.display = "none";
        tick3qp30.style.display = "none";


        playertt1.style.display = "none";
        playertt2.style.display = "none";
        playertt3.style.display = "none";
        playertt4.style.display = "none";

        ngoisao.style.display = "none";


        question.style.display = "none";
        currentplayer.style.display = "none";
        chuongui.style.display = "none";

        FinishFinish.play();
        var defaultplayer = {
            player: 0
        }
        playerstatus.set(defaultplayer);
    }
}




VDVideoState.on("value", vdstate);

function vdstate(vd) {
    if (vd.val().video1 == 1) {
        video1.style.display = "block";
        setTimeout(function () {
            video1.play();
        }, 3000)
    }
    if (vd.val().video2 == 1) {
        video2.style.display = "block";
        setTimeout(function () {
            video2.play();
        }, 3000)
    }
    if (vd.val().video3 == 1) {
        video3.style.display = "block";
        setTimeout(function () {
            video3.play();
        }, 3000)
    }
    if (vd.val().video4 == 1) {
        video4.style.display = "block";
        setTimeout(function () {
            video4.play();
        }, 3000)
    }
    if (vd.val().video1 == 0 && vd.val().video2 == 0 && vd.val().video3 == 0 && vd.val().video4 == 0) {
        video1.style.display = "none";
        video2.style.display = "none";
        video3.style.display = "none";
        video4.style.display = "none";
        video1.pause();
        video2.pause();
        video3.pause();
        video4.pause();
        video1.currentTime = 0;
        video2.currentTime = 0;
        video3.currentTime = 0;
        video4.currentTime = 0;
    }
}


function chuong() {
    var tsvd = localStorage.getItem("TSVD");
    var idts = localStorage.getItem("id");

    var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
    VDChuong.once("value", chuongstatus);

    function chuongstatus(cs) {
        if (cs.val().status === 0) {
            if (tsvd !== idts) {
                // Check if the player is already in the list
                var VDChuongPlayer = firebase.database().ref(matchid + "/VDChuong/Player");
                VDChuongPlayer.orderByChild("id").equalTo(idts).once("value", function (snapshot) {
                    if (!snapshot.exists()) {
                        // Player not in the list, proceed to add
                        var chuong = { status: 1 };
                        var chuonginfo = { id: idts };

                        // Use transaction to ensure atomic update
                        VDChuong.transaction(function (currentData) {
                            if (currentData === null || currentData.status === 0) {
                                return { status: 1 };
                            } else {
                                // Abort the transaction, as status is already 1
                                return;
                            }
                        }, function (error, committed, snapshot) {
                            if (error) {
                                console.log('Transaction failed abnormally!', error);
                            } else if (!committed) {
                                console.log('Transaction aborted because status is already 1.');
                            } else {
                                // Transaction successful, add player info
                                VDChuongPlayer.push(chuonginfo);
                                console.log('Player added successfully.');
                            }
                        });
                    } else {
                        console.log('Player is already in the list.');
                    }
                });
            }
        } else {
            console.log('Chuong status is not 0.');
        }
    }
}

var p = firebase.database().ref(matchid + "/games/player" + localStorage.getItem("id"));

p.on("value", pkick);

function pkick(uid1) {
    if (uid1.val().uid == "" && localStorage.getItem("id") != 5 && window.location.pathname != "/Main.html" && window.location.pathname != "/Information.html" && uid1.val().id == 0) {
        alert("Bạn đã bị Host kick khỏi trận đấu");
        location.replace("/Main.html");
    }
}

function checkValuesExistInFirebase(questionpack, callback) {
    var ref = firebase.database().ref(matchid + '/FinishQuestion/');
    var qpack = questionpack;
    var foundValues = false;

    // Helper function to iterate through Firebase data
    function iterateSnapshot(snapshot) {
        const data = snapshot.val();
        if (data !== null && typeof data === 'object') {
            if (data.cauhoi.trim().length > 0 && data.dapan.trim().length > 0) {
                foundValues = true;
                return true; // Signal found values
            }
        }
        return false; // No values found
    }

    // Check if TSVD and qpack have values from 1 to 4
    for (var i = 1; i <= 4; i++) {
        for (var j = 1; j <= 3; j++) {
            var path = 'Q' + i + 'DB' + '/QP' + qpack + "/" + j;
            var questionRef = ref.child(path);

            questionRef.once('value', snapshot => {
                if (iterateSnapshot(snapshot)) {
                    callback(foundValues);
                    return; // Exit function if values found
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
                callback(false); // Signal error
            });

            if (foundValues) return; // Exit the function if values found
        }
    }
    callback(false); // Values not found in any row
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

var QuestionPackElements = document.getElementsByClassName("qp");
for (let i = 0; i < QuestionPackElements.length; i++) {
    QuestionPackElements[i].style.background = CheckBackgroundValue(data.FinishQuestionPack);
    QuestionPackElements[i].style.backgroundSize = "cover";
}

var CheckBoxElements = document.getElementsByClassName("checkbox");
for (let i = 0; i < CheckBoxElements.length; i++) {
    CheckBoxElements[i].style.background = CheckBackgroundValue(data.FinishQuestionPackChooseSquare);
    CheckBoxElements[i].style.backgroundSize = "cover";
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