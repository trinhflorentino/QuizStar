document.addEventListener('contextmenu', event => event.preventDefault());

shortcut.add("F12", function () {
    alert("!!!!!");
});
shortcut.add("Ctrl+Shift+I", function () {
    alert("!!!");
});
var vcnvanswerrow = document.getElementById("audio_15");

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


var matchname = document.getElementById("matchname");
var hostname = document.getElementById("hostname");
var getmatchname = firebase.database().ref(matchid + "/Match/Name");
var gethostname = firebase.database().ref(matchid + "/Match/Host");
getmatchname.on("value", getmn);

function getmn(match) {
    gethostname.on("value", gethname);

    function gethname(host) {
        if (match.val().match == "") { }
        if (match.val().match) {
            matchname.innerHTML = match.val().match;
            // hostname.innerHTML = "HOST: " + host.val().host;
        }
    }
}

//Khoidong


var playerstatus = firebase.database().ref(matchid + '/playerstatus/khoidong');
playerstatus.on('value', Data)

function Data(dt0) {
    if (dt0.val().player == 0) {

        document.getElementById("answer1").style.display = "none";
        document.getElementById("answer2").style.display = "none";
        document.getElementById("answer3").style.display = "none";
        document.getElementById("answer4").style.display = "none";

        document.getElementById("answer11").style.display = "none";
        document.getElementById("answer22").style.display = "none";
        document.getElementById("answer33").style.display = "none";
        document.getElementById("answer44").style.display = "none";

        document.getElementById("tenthisinh").innerHTML = "";
        document.getElementById("tskhoidong").src = "";
    }
    if (dt0.val().player == 1) {
        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");

        qsbar1.style.display = "block";
        qsbar2.style.display = "none";
        qsbar3.style.display = "none";
        qsbar4.style.display = "none";


        document.getElementById("answer1").style.display = "block";
        document.getElementById("answer11").style.display = "block";



        document.getElementById("answer2").style.display = "none";
        document.getElementById("answer3").style.display = "none";
        document.getElementById("answer4").style.display = "none";


        document.getElementById("answer22").style.display = "none";
        document.getElementById("answer33").style.display = "none";
        document.getElementById("answer44").style.display = "none";

        var tsuidRef1 = firebase.database().ref(matchid + '/games/player1');
        tsuidRef1.on('value', uid);

        function uid(getuid) {
            firebase.storage().ref('users/' + getuid.val().uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tskhoidong.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tskhoidong.src = imgUrl;
                })
            });
        };
        var ts1name = firebase.database().ref(matchid + '/games/player1');
        ts1name.on('value', Data2)

        function Data2(dt2) {
            var ts1ten = dt2.val().displayName;
            var khoidongname = document.getElementById("tenthisinh");
            khoidongname.innerHTML = ts1ten;
            var qsreplace = firebase.database().ref(matchid + '/khoidong');
            qsreplace.on('value', causo);

            function causo(causo) {
                kdcauso = causo.val().causo;
                if (kdcauso == null) {
                    var qsbar1 = document.getElementById("question1");
                    qsbar1.innerHTML = cauhoi;
                }

                var qsdb1 = firebase.database().ref(matchid + '/StartQuestion/Q1DB/cau' + kdcauso);
                qsdb1.once('value', question1)

                function question1(qsdk) {
                    cauhoi = qsdk.val();
                    var qsbar1 = document.getElementById("question1");
                    qsbar1.innerHTML = cauhoi;
                }

                var qsdb1 = firebase.database().ref(matchid + '/StartQuestion/Q1DB/dacau' + kdcauso);
                qsdb1.once('value', question)

                function question(qsdk) {
                    cauhoi = qsdk.val();
                    var ans1 = document.getElementById("answer1");
                    var ans2 = document.getElementById("answer11");
                    if (cauhoi == null) {
                        document.getElementById("qsnum").innerText = "";
                        ans1.innerHTML = "";
                        ans2.innerHTML = "ĐÁP ÁN:  ";
                    } else {
                        document.getElementById("qsnum").innerText = "Câu " + kdcauso + ":";
                        ans1.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                        ans2.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                    }
                }
            }
        }
    }
    if (dt0.val().player == 2) {
        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");

        qsbar1.style.display = "none";
        qsbar2.style.display = "block";
        qsbar3.style.display = "none";
        qsbar4.style.display = "none";

        document.getElementById("answer2").style.display = "block";
        document.getElementById("answer22").style.display = "block";

        document.getElementById("answer1").style.display = "none";
        document.getElementById("answer3").style.display = "none";
        document.getElementById("answer4").style.display = "none";


        document.getElementById("answer11").style.display = "none";
        document.getElementById("answer33").style.display = "none";
        document.getElementById("answer44").style.display = "none";

        var tsuidRef2 = firebase.database().ref(matchid + '/games/player2');
        tsuidRef2.on('value', uid);

        function uid(getuid) {
            firebase.storage().ref('users/' + getuid.val().uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tskhoidong.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tskhoidong.src = imgUrl;
                })
            });
        };
        var ts2name = firebase.database().ref(matchid + '/games/player2');
        ts2name.on('value', Data3)

        function Data3(dt2) {
            var ts2ten = dt2.val().displayName;
            var khoidongname = document.getElementById("tenthisinh");
            khoidongname.innerHTML = ts2ten;
            var qsreplace = firebase.database().ref(matchid + '/khoidong');
            qsreplace.on('value', causo);

            function causo(causo) {
                kdcauso = causo.val().causo;
                if (kdcauso == 0) {
                    var qsbar2 = document.getElementById("question2");
                    qsbar2.innerHTML = '';
                }
                var qsdb2 = firebase.database().ref(matchid + '/StartQuestion/Q2DB/cau' + kdcauso);
                qsdb2.once('value', question2)

                function question2(qsdk) {
                    cauhoi = qsdk.val();
                    var qsbar2 = document.getElementById("question2");
                    qsbar2.innerHTML = cauhoi;
                }

                var qsdb2 = firebase.database().ref(matchid + '/StartQuestion/Q2DB/dacau' + kdcauso);
                qsdb2.once('value', question)

                function question(qsdk) {
                    cauhoi = qsdk.val();
                    var ans1 = document.getElementById("answer2");
                    var ans2 = document.getElementById("answer22");
                    if (cauhoi == null) {
                        document.getElementById("qsnum").innerText = "";
                        ans1.innerHTML = "";
                        ans2.innerHTML = "ĐÁP ÁN:  ";
                    } else {
                        document.getElementById("qsnum").innerText = "Câu " + kdcauso + ":";
                        ans1.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                        ans2.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                    }
                }
            }
        };
    }
    if (dt0.val().player == 3) {
        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");

        qsbar1.style.display = "none";
        qsbar2.style.display = "none";
        qsbar3.style.display = "block";
        qsbar4.style.display = "none";

        document.getElementById("answer3").style.display = "block";
        document.getElementById("answer33").style.display = "block";

        document.getElementById("answer1").style.display = "none";
        document.getElementById("answer2").style.display = "none";
        document.getElementById("answer4").style.display = "none";

        document.getElementById("answer11").style.display = "none";
        document.getElementById("answer22").style.display = "none";
        document.getElementById("answer44").style.display = "none";
        var tsuidRef3 = firebase.database().ref(matchid + '/games/player3');
        tsuidRef3.on('value', uid);

        function uid(getuid) {
            firebase.storage().ref('users/' + getuid.val().uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tskhoidong.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tskhoidong.src = imgUrl;
                })
            });
        };
        var ts3name = firebase.database().ref(matchid + '/games/player3');
        ts3name.on('value', Data5)

        function Data5(dt2) {
            var ts3ten = dt2.val().displayName;
            var khoidongname = document.getElementById("tenthisinh");
            khoidongname.innerHTML = ts3ten;
            var qsreplace = firebase.database().ref(matchid + '/khoidong');
            qsreplace.on('value', causo);

            function causo(causo) {
                kdcauso = causo.val().causo;
                if (kdcauso == 0) {
                    var qsbar3 = document.getElementById("question3");
                    qsbar3.innerHTML = '';
                }
                var qsdb3 = firebase.database().ref(matchid + '/StartQuestion/Q3DB/cau' + kdcauso);
                qsdb3.once('value', question3)

                function question3(qsdk) {
                    cauhoi = qsdk.val();
                    var qsbar3 = document.getElementById("question3");
                    qsbar3.innerHTML = cauhoi;
                }
                var qsdb3 = firebase.database().ref(matchid + '/StartQuestion/Q3DB/dacau' + kdcauso);
                qsdb3.once('value', question)

                function question(qsdk) {
                    cauhoi = qsdk.val();
                    var ans1 = document.getElementById("answer3");
                    var ans2 = document.getElementById("answer33");
                    if (cauhoi == null) {
                        document.getElementById("qsnum").innerText = "";
                        ans1.innerHTML = "";
                        ans2.innerHTML = "ĐÁP ÁN:  ";
                    } else {
                        document.getElementById("qsnum").innerText = "Câu " + kdcauso + ":";
                        ans1.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                        ans2.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                    }
                }
            }
        }
    }
    if (dt0.val().player == 4) {
        var qsbar1 = document.getElementById("question1");
        var qsbar2 = document.getElementById("question2");
        var qsbar3 = document.getElementById("question3");
        var qsbar4 = document.getElementById("question4");

        qsbar1.style.display = "none";
        qsbar2.style.display = "none";
        qsbar3.style.display = "none";
        qsbar4.style.display = "block";


        document.getElementById("answer4").style.display = "block";
        document.getElementById("answer44").style.display = "block";

        document.getElementById("answer1").style.display = "none";
        document.getElementById("answer2").style.display = "none";
        document.getElementById("answer3").style.display = "none";

        document.getElementById("answer11").style.display = "none";
        document.getElementById("answer22").style.display = "none";
        document.getElementById("answer33").style.display = "none";

        var tsuidRef4 = firebase.database().ref(matchid + '/games/player4');
        tsuidRef4.on('value', uid);

        function uid(getuid) {
            firebase.storage().ref('users/' + getuid.val().uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
                tskhoidong.src = imgUrl;
            }).catch((error) => {
                firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                    tskhoidong.src = imgUrl;
                })
            });
        };
        var ts4name = firebase.database().ref(matchid + '/games/player4');
        ts4name.on('value', Data5)

        function Data5(dt2) {
            var ts4ten = dt2.val().displayName;
            var khoidongname = document.getElementById("tenthisinh");
            khoidongname.innerHTML = ts4ten;
            var qsreplace = firebase.database().ref(matchid + '/khoidong');
            qsreplace.on('value', causo);

            function causo(causo) {
                kdcauso = causo.val().causo;
                if (kdcauso == 0) {
                    var qsbar4 = document.getElementById("question4");
                    qsbar4.innerHTML = '';
                }
                var qsdb4 = firebase.database().ref(matchid + '/StartQuestion/Q4DB/cau' + kdcauso);
                qsdb4.once('value', question4)

                function question4(qsdk) {
                    cauhoi = qsdk.val();
                    var qsbar4 = document.getElementById("question4");
                    qsbar4.innerHTML = cauhoi;
                }
                var qsdb4 = firebase.database().ref(matchid + '/StartQuestion/Q4DB/dacau' + kdcauso);
                qsdb4.once('value', question)

                function question(qsdk) {
                    cauhoi = qsdk.val();
                    var ans1 = document.getElementById("answer4");
                    var ans2 = document.getElementById("answer44");
                    if (cauhoi == null) {
                        document.getElementById("qsnum").innerText = "";
                        ans1.innerHTML = "";
                        ans2.innerHTML = "ĐÁP ÁN:  ";
                    } else {
                        document.getElementById("qsnum").innerText = "Câu " + kdcauso + ":";
                        ans1.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                        ans2.innerHTML = "ĐÁP ÁN:  " + cauhoi;
                    }
                }
            }
        }
    }

}



// var StartEmergencyStop = firebase.database().ref(matchid + '/StartEmergencyStop');
// StartEmergencyStop.on('value', startestop);

// function startestop(st) {
//     if (st.val().stop == 0) {
//         localStorage.setItem("timeremergencystop", 0);
//         document.getElementById("StartEStopStart").style.backgroundColor = "#24a0ed";
//         document.getElementById("StartEStopStop").style.backgroundColor = "#24a0ed";

//     }
//     if (st.val().stop == 1) {
//         localStorage.setItem("timeremergencystop", 1);
//         document.getElementById("StartEStopStart").style.backgroundColor = "green";
//         document.getElementById("StartEStopStop").style.backgroundColor = "red";
//     }
// }



var khoidongstatus = firebase.database().ref(matchid + '/phanthistatus/khoidong');
khoidongstatus.on('value', hienthicauhoi);

function hienthicauhoi(dt4) {
    if (dt4.val().batdau == 1) {
        setTimeout(function () {
            // Time();
            document.getElementById("StartCorrectAns").disabled = false;
            document.getElementById("StartWrongAns").disabled = false;
            // document.getElementById("StartEStopStart").disabled = false;
            // document.getElementById("StartEStopStop").disabled = false;
        }, 3600);
        setTimeout(function () {
            var qsreplace = firebase.database().ref(matchid + '/khoidong');
            qsreplace.on('value', causo);
            function causo(causo) {
                kdcauso = causo.val().causo;
                if (kdcauso == 7) {
                    var question1 = document.getElementById("question1");
                    var question2 = document.getElementById("question2");
                    var question3 = document.getElementById("question3");
                    var question4 = document.getElementById("question4");
                    question1.innerHTML = '';
                    question2.innerHTML = '';
                    question3.innerHTML = '';
                    question4.innerHTML = '';
                }
            }
        }, 7000)
        // setTimeout(function () {
        //     var qsreplace = firebase.database().ref(matchid + '/khoidong');
        //     var set = {
        //         causo: 1
        //     }
        //     qsreplace.set(set);
        //     var timer = document.getElementById("timekd");
        //     var seconds = 60;
        //     var startint = setInterval(function () {
        //         if (localStorage.getItem("timeremergencystop") == 0) {
        //             if (seconds > 0) {
        //                 seconds = seconds - 1;
        //                 timer.innerHTML = seconds;
        //             }
        //             if (seconds == 0) {
        // document.getElementById("StartCorrectAns").disabled = true;
        // document.getElementById("StartWrongAns").disabled = true;
        // document.getElementById("StartEStopStart").disabled = true;
        // document.getElementById("StartEStopStop").disabled = true;
        //                 setTimeout(function () {
        //                     var finish60sec = document.getElementById("audio_6");
        //                     var question1 = document.getElementById("question1");
        //                     var question2 = document.getElementById("question2");
        //                     var question3 = document.getElementById("question3");
        //                     var question4 = document.getElementById("question4");
        //                     question1.innerHTML = '';
        //                     question2.innerHTML = '';
        //                     question3.innerHTML = '';
        //                     question4.innerHTML = '';

        //                     var qsreplace = firebase.database().ref(matchid + '/khoidong');
        //                     var set = {
        //                         causo: 0
        //                     }
        //                     qsreplace.set(set);
        //                 }, 3000);
        //                 clearInterval(startint);
        //             }
        //         } else if (localStorage.getItem("timeremergencystop") == 1) {
        //         }
        //     }, 1000)
        // }, 7000);

    }
}

// function Time() {
//     var timer = document.getElementById("timekd");
//     var seconds = 60;
//     timer.innerHTML = seconds;
// }


//Phan Thi Status
refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
refintro = firebase.database().ref(matchid + "/intro");
reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
refkhoidongo22 = firebase.database().ref(matchid + "/gamestatus/khoidongo22")
refbanner = firebase.database().ref(matchid + "/gamestatus/banner");


refvedich.on('value', vedichs);
refintro.on('value', switchintro);
refkhoidong.on('value', Data6);
refvcnv.on('value', vcnvs);
reftangtoc.on('value', tangtocs);
reftongketdiem.on('value', tongketdiems);
refvedichphu.on('value', vedichphus);
refkhoidongo22.on('value', khoidongo22s);
refbanner.on('value', banner);
var ptstatus = document.getElementById("ptstatus");


function StartingStart() {
    var livekhoidong = document.getElementById("livekhoidong");
    var ts1khoidongbar = document.getElementById("ts1khoidong");
    var ts2khoidongbar = document.getElementById("ts2khoidong");
    var ts3khoidongbar = document.getElementById("ts3khoidong");
    var ts4khoidongbar = document.getElementById("ts4khoidong");
    var questionkhoidong = document.getElementById("questionkhoidong");
    var timer5skd = document.getElementById("timerkd5s");
    // var timer = document.getElementById("timerkd");
    // timer.style.display = "block";
    thaotac.style.display = "block";
    livekhoidong.style.display = "block";
    ts1khoidongbar.style.display = "block";
    ts2khoidongbar.style.display = "block";
    ts3khoidongbar.style.display = "block";
    ts4khoidongbar.style.display = "block";
    questionkhoidong.style.display = "block";
    timer5skd.style.display = "block";
}

function EndStart() {
    var livekhoidong = document.getElementById("livekhoidong");
    var ts1khoidongbar = document.getElementById("ts1khoidong");
    var ts2khoidongbar = document.getElementById("ts2khoidong");
    var ts3khoidongbar = document.getElementById("ts3khoidong");
    var ts4khoidongbar = document.getElementById("ts4khoidong");
    var questionkhoidong = document.getElementById("questionkhoidong");
    var timer5skd = document.getElementById("timerkd5s");
    // var timer = document.getElementById("timerkd");
    // timer.style.display = "none";
    thaotac.style.display = "none";
    livekhoidong.style.display = "none";
    ts1khoidongbar.style.display = "none";
    ts2khoidongbar.style.display = "none";
    ts3khoidongbar.style.display = "none";
    ts4khoidongbar.style.display = "none";
    questionkhoidong.style.display = "none";
    timer5skd.style.display = "none";

}



function VCNVStart() {
    var overlaycontainer = document.getElementById("overlaycontainer");
    var vcnvrow = document.getElementById("vcnvrow");
    var ts1vcnvbar = document.getElementById("ts1vcnv");
    var ts2vcnvbar = document.getElementById("ts2vcnv");
    var ts3vcnvbar = document.getElementById("ts3vcnv");
    var ts4vcnvbar = document.getElementById("ts4vcnv");
    var thaotacvcnv = document.getElementById("thaotacvcnv");
    var tmvcnv = document.getElementById("tmvcnv");
    var questionvcnv = document.getElementById("questionvcnv");

    overlaycontainer.style.display = "block";
    vcnvrow.style.display = "block";
    ts1vcnvbar.style.display = "block";
    ts2vcnvbar.style.display = "block";
    ts3vcnvbar.style.display = "block";
    ts4vcnvbar.style.display = "block";
    thaotacvcnv.style.display = "block";
    tmvcnv.style.display = "block";
    questionvcnv.style.display = "block";
}

function EndVCNV() {
    var overlaycontainer = document.getElementById("overlaycontainer");
    var vcnvrow = document.getElementById("vcnvrow");
    var ts1vcnvbar = document.getElementById("ts1vcnv");
    var ts2vcnvbar = document.getElementById("ts2vcnv");
    var ts3vcnvbar = document.getElementById("ts3vcnv");
    var ts4vcnvbar = document.getElementById("ts4vcnv");
    var thaotacvcnv = document.getElementById("thaotacvcnv");
    var tmvcnv = document.getElementById("tmvcnv");
    var questionvcnv = document.getElementById("questionvcnv");

    overlaycontainer.style.display = "none";
    vcnvrow.style.display = "none";
    ts1vcnvbar.style.display = "none";
    ts2vcnvbar.style.display = "none";
    ts3vcnvbar.style.display = "none";
    ts4vcnvbar.style.display = "none";
    thaotacvcnv.style.display = "none";
    tmvcnv.style.display = "none";
    questionvcnv.style.display = "none";
}

function AccelerationStart() {
    var tangtoclive = document.getElementById("tangtoclive");
    var ts1tangtocbar = document.getElementById("ts1tangtoc");
    var ts2tangtocbar = document.getElementById("ts2tangtoc");
    var ts3tangtocbar = document.getElementById("ts3tangtoc");
    var ts4tangtocbar = document.getElementById("ts4tangtoc");
    var thaotactangtoc = document.getElementById("thaotactangtoc");
    var questiontangtoc = document.getElementById("questiontangtoc");
    var tmtt = document.getElementById("tmtt");
    tangtoclive.style.display = "block";
    ts1tangtocbar.style.display = "block";
    ts2tangtocbar.style.display = "block";
    ts3tangtocbar.style.display = "block";
    ts4tangtocbar.style.display = "block";
    thaotactangtoc.style.display = "block";
    questiontangtoc.style.display = "block";
    tmtt.style.display = "block";
}

function AccelerationEnd() {
    var tangtoclive = document.getElementById("tangtoclive");
    var ts1tangtocbar = document.getElementById("ts1tangtoc");
    var ts2tangtocbar = document.getElementById("ts2tangtoc");
    var ts3tangtocbar = document.getElementById("ts3tangtoc");
    var ts4tangtocbar = document.getElementById("ts4tangtoc");
    var thaotactangtoc = document.getElementById("thaotactangtoc");
    var questiontangtoc = document.getElementById("questiontangtoc");
    var tmtt = document.getElementById("tmtt");
    tangtoclive.style.display = "none";
    ts1tangtocbar.style.display = "none";
    ts2tangtocbar.style.display = "none";
    ts3tangtocbar.style.display = "none";
    ts4tangtocbar.style.display = "none";
    thaotactangtoc.style.display = "none";
    questiontangtoc.style.display = "none";
    tmtt.style.display = "none";
}

function FinishStart() {
    var thaotacvedich = document.getElementById("thaotacvedich");
    var vedichlive = document.getElementById("vedichlive");
    var questionvedich = document.getElementById("questionvedich");
    var timervd = document.getElementById("tmvd");
    timervd.style.display = "block";
    thaotacvedich.style.display = "block";
    vedichlive.style.display = "block";
    questionvedich.style.display = "block";

}

function FinishEnd() {
    var thaotacvedich = document.getElementById("thaotacvedich");
    var vedichlive = document.getElementById("vedichlive");
    var questionvedich = document.getElementById("questionvedich");
    var timervd = document.getElementById("tmvd");
    var star = document.getElementById("ngoisao");
    timervd.style.display = "none";
    thaotacvedich.style.display = "none";
    vedichlive.style.display = "none";
    questionvedich.style.display = "none";
    star.style.display = "none";
}

function ChatRoom() {
    var msgs = document.getElementById("msgs");
    var msg = document.getElementById("msg");
    msgs.style.display = "block";
    msg.style.display = "block";
}

function ChatRoomEnd() {
    var msgs = document.getElementById("msgs");
    var msg = document.getElementById("msg");
    msgs.style.display = "none";
    msg.style.display = "none";
}

function VDPStart() {
    document.getElementById("thaotacvdp").style.display = "block";
    document.getElementById("tmvdp").style.display = "block";
    document.getElementById("questionvedichphu").style.display = "block";
    document.getElementById("playertt1").style.display = "block";
    document.getElementById("playertt2").style.display = "block";
    document.getElementById("playertt3").style.display = "block";
    document.getElementById("playertt4").style.display = "block";
}

function VDPEnd() {
    document.getElementById("thaotacvdp").style.display = "none";
    document.getElementById("tmvdp").style.display = "none";
    document.getElementById("questionvedichphu").style.display = "none";
    document.getElementById("playertt1").style.display = "none";
    document.getElementById("playertt2").style.display = "none";
    document.getElementById("playertt3").style.display = "none";
    document.getElementById("playertt4").style.display = "none";
}

function TKDStart() {
    document.getElementById("ts1tkd").style.display = "block";
    document.getElementById("tents1").style.display = "block";
    document.getElementById("points1").style.display = "block";

    document.getElementById("ts2tkd").style.display = "block";
    document.getElementById("tents2").style.display = "block";
    document.getElementById("points2").style.display = "block";

    document.getElementById("ts3tkd").style.display = "block";
    document.getElementById("tents3").style.display = "block";
    document.getElementById("points3").style.display = "block";

    document.getElementById("ts4tkd").style.display = "block";
    document.getElementById("tents4").style.display = "block";
    document.getElementById("points4").style.display = "block";
}

function TKDEnd() {
    document.getElementById("ts1tkd").style.display = "none";
    document.getElementById("tents1").style.display = "none";
    document.getElementById("points1").style.display = "none";

    document.getElementById("ts2tkd").style.display = "none";
    document.getElementById("tents2").style.display = "none";
    document.getElementById("points2").style.display = "none";

    document.getElementById("ts3tkd").style.display = "none";
    document.getElementById("tents3").style.display = "none";
    document.getElementById("points3").style.display = "none";

    document.getElementById("ts4tkd").style.display = "none";
    document.getElementById("tents4").style.display = "none";
    document.getElementById("points4").style.display = "none";
}

function KDO22Start() {
    document.getElementById("kdo22playerlist").style.display = "flex";
    document.getElementById("kdo22bar").style.display = "flex";
    document.getElementById("qskdo22").style.display = "block";
}

function KDO22End() {
    document.getElementById("kdo22playerlist").style.display = "none";
    document.getElementById("kdo22bar").style.display = "none";
    document.getElementById("qskdo22").style.display = "none";
}

function BannerStart() {
    document.getElementById("openingMarket").style.display = "block";
}


function BannerEnd() {
    document.getElementById("openingMarket").style.display = "none";
}

function setButtonStyle() {
    document.getElementById("ButtonKDTech").style.backgroundImage = 'none';
    document.getElementById("ButtonKDO23Tech").style.backgroundImage = 'none';
    document.getElementById("ButtonVCNVTech").style.backgroundImage = 'none';
    document.getElementById("ButtonTTTech").style.backgroundImage = 'none';
    document.getElementById("ButtonVDTech").style.backgroundImage = 'none';
    document.getElementById("ButtonCHPTech").style.backgroundImage = 'none';
    document.getElementById("ButtonTKDTech").style.backgroundImage = 'none';
    document.getElementById("ButtonPCTech").style.backgroundImage = 'none';
    document.getElementById("ButtonIntroTech").style.backgroundImage = 'none';
    document.getElementById("ButtonBannerTech").style.backgroundImage = 'none';
}


function Data6(dt6) {
    var gokhoidong = dt6.val().start;
    if (gokhoidong == 1) {
        setButtonStyle();
        localStorage.setItem("khoidongst", 1);
        document.getElementById("ButtonKDTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        StartingStart();
        EndVCNV();
        AccelerationEnd();
        FinishEnd();
        ChatRoomEnd();
        VDPEnd();
        TKDEnd();
        KDO22End();
        BannerEnd();
    } else {
        localStorage.setItem("khoidongst", 0);
    }
}

function switchintro(value) {
    if (value.val().intro == 1) {
        setButtonStyle();
        Notification("Bắt đấu chiếu Intro");
        document.getElementById("ButtonIntroTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("introst", 1);
        EndStart();
        EndVCNV();
        AccelerationEnd();
        FinishEnd();
        ChatRoomEnd();
        VDPEnd();
        TKDEnd();
        KDO22End();
        BannerEnd();
    } else {
        localStorage.setItem("introst", 0);
    }
}

function vcnvs(vcnv) {
    if (vcnv.val().vcnv == 1) {
        setButtonStyle();
        Notification("Phần thi Vượt chướng ngại vật bắt đầu");
        document.getElementById("ButtonVCNVTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("vcnvst", 1);
        EndStart();
        AccelerationEnd();
        VCNVStart();
        FinishEnd();
        ChatRoomEnd();
        VDPEnd();
        TKDEnd();
        KDO22End();
        BannerEnd();
    } else {
        localStorage.setItem("vcnvst", 0);
    }
}

function tangtocs(tt) {
    if (tt.val().tangtoc == 1) {
        setButtonStyle();
        Notification("Phần thi Tăng tốc bắt đầu");
        document.getElementById("ButtonTTTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("tangtocst", 1);
        AccelerationStart();
        EndStart();
        EndVCNV();
        FinishEnd();
        ChatRoomEnd();
        VDPEnd();
        TKDEnd();
        KDO22End();
        BannerEnd();
    } else {
        localStorage.setItem("tangtocst", 0);
    }
}

function tongketdiems(tkd) {
    if (tkd.val().tongketdiem == 1) {
        setButtonStyle();
        Notification("Đã thực hiện Tổng kết điểm");
        document.getElementById("ButtonTKDTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("tongketdiemst", 1);
        EndStart();
        EndVCNV();
        AccelerationEnd();
        FinishEnd();
        ChatRoomEnd();
        VDPEnd();
        KDO22End();
        TKDStart();
        BannerEnd();
    } else {
        localStorage.setItem("tongketdiemst", 0);

    }
}

function vedichs(vd) {
    if (vd.val().vedich == 1) {
        setButtonStyle();
        Notification("Phần thi Về đích bắt đầu");
        document.getElementById("ButtonVDTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("vedichst", 1);
        EndStart();
        EndVCNV();
        ChatRoomEnd();
        AccelerationEnd();
        FinishStart();
        VDPEnd();
        TKDEnd();
        KDO22End();
        BannerEnd();
        var ts1khoidongbar = document.getElementById("ts1khoidong");
        var ts2khoidongbar = document.getElementById("ts2khoidong");
        var ts3khoidongbar = document.getElementById("ts3khoidong");
        var ts4khoidongbar = document.getElementById("ts4khoidong");
        ts1khoidongbar.style.display = "block";
        ts2khoidongbar.style.display = "block";
        ts3khoidongbar.style.display = "block";
        ts4khoidongbar.style.display = "block";

    } else {
        localStorage.setItem("vedichst", 0);
    }
}

function vedichphus(vdp) {
    if (vdp.val().vedichphu == 1) {
        setButtonStyle();
        Notification("Phần thi Câu hỏi phụ bắt đầu");
        document.getElementById("ButtonCHPTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("vedichphust", 1);
        EndStart();
        EndVCNV();
        AccelerationEnd();
        FinishEnd();
        ChatRoomEnd();
        VDPStart();
        TKDEnd();
        KDO22End();
        BannerEnd();
    } else {
        localStorage.setItem("vedichphust", 0);
    }
}

function khoidongo22s(kdo22) {
    if (kdo22.val().khoidongo22 == 1) {
        setButtonStyle();
        Notification("Phần thi Khởi động bắt đầu");
        document.getElementById("ButtonKDO23Tech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("khoidongo22st", 1);
        EndStart();
        EndVCNV();
        AccelerationEnd();
        FinishEnd();
        ChatRoomEnd();
        VDPEnd();
        TKDEnd();
        KDO22Start();
        BannerEnd();
    } else {
        localStorage.setItem("khoidongo22st", 0);
    }
}

function banner(banners) {
    if (banners.val().banner == 1) {
        setButtonStyle();
        Notification("Thực hiện màn hình Opening Maket");
        document.getElementById("ButtonBannerTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        localStorage.setItem("bannerst", 1);
        EndStart();
        EndVCNV();
        AccelerationEnd();
        FinishEnd();
        ChatRoomEnd();
        VDPEnd();
        TKDEnd();
        KDO22End();
        BannerStart();
    } else {
        localStorage.setItem("bannerst", 0);

    }
}



if (localStorage.getItem("introst") == 0 && localStorage.getItem("vcnvst") == 0 && localStorage.getItem("tangtocst") == 0 && localStorage.getItem("tongketdiemst") == 0 && localStorage.getItem("vedichst") == 0 && localStorage.getItem("khoidongst") == 0 && localStorage.getItem("vedichphust") == 0 && localStorage.getItem("khoidongo22st") == 0 && localStorage.getItem("bannerst") == 0) {
    Notification("Quay về Phòng chat");
    document.getElementById("ButtonPCTech").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
}
setInterval(function () {
    if (localStorage.getItem("introst") == 0 && localStorage.getItem("vcnvst") == 0 && localStorage.getItem("tangtocst") == 0 && localStorage.getItem("tongketdiemst") == 0 && localStorage.getItem("vedichst") == 0 && localStorage.getItem("khoidongst") == 0 && localStorage.getItem("vedichphust") == 0 && localStorage.getItem("khoidongo22st") == 0 && localStorage.getItem("bannerst") == 0) {
        EndStart();
        EndVCNV()
        AccelerationEnd();
        FinishEnd();
        ChatRoom();
        VDPEnd();
        TKDEnd();
        KDO22End();
        BannerEnd();
        var ts1khoidongbar = document.getElementById("ts1khoidong");
        var ts2khoidongbar = document.getElementById("ts2khoidong");
        var ts3khoidongbar = document.getElementById("ts3khoidong");
        var ts4khoidongbar = document.getElementById("ts4khoidong");
        ts1khoidongbar.style.display = "block";
        ts2khoidongbar.style.display = "block";
        ts3khoidongbar.style.display = "block";
        ts4khoidongbar.style.display = "block";
    }
})



var mcname = firebase.database().ref(matchid + "/games/mc");
var mcname2 = firebase.database().ref(matchid + "/games/mc2");
var ts1name = firebase.database().ref(matchid + "/games/player1");
var ts2name = firebase.database().ref(matchid + "/games/player2");
var ts3name = firebase.database().ref(matchid + "/games/player3");
var ts4name = firebase.database().ref(matchid + "/games/player4");
var ts1point = firebase.database().ref(matchid + '/point/player1');
var ts2point = firebase.database().ref(matchid + '/point/player2');
var ts3point = firebase.database().ref(matchid + '/point/player3');
var ts4point = firebase.database().ref(matchid + '/point/player4');
mcname.on("value", namemc);
function namemc(nmc) {
    var mckickname = document.getElementById("tenmckick");
    mckickname.innerHTML = " " + "MC 1: " + nmc.val().displayName;
    if (nmc.val().displayName != "N/A") Notification("MC " + nmc.val().displayName + " đã tham gia trận đấu");
}


mcname2.on("value", namemc2);
function namemc2(nmc) {
    var mckickname2 = document.getElementById("tenmc2kick");
    mckickname2.innerHTML = " " + "MC 2: " + nmc.val().displayName;
    if (nmc.val().displayName != "N/A") Notification("MC " + nmc.val().displayName + " đã tham gia trận đấu");
}



ts1name.on("value", name12);

function name12(n1) {
    var ts1kdname = document.getElementById("tents1kd");
    var ts1vcnvname = document.getElementById("tents1vcnv");
    var ts1kickname = document.getElementById("tents1kick");
    var ts1kdo22name = document.getElementById("kdo22namets1");
    ts1kickname.innerText = "Thí sinh 1: " + n1.val().displayName;
    ts1kdname.innerHTML = n1.val().displayName;
    ts1vcnvname.innerHTML = n1.val().displayName;
    ts1kdo22name.innerHTML = n1.val().displayName;
    var uidts1 = n1.val().uid;
    firebase.storage().ref('users/' + uidts1 + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts1kd.src = imgUrl;
        ts1ob.src = imgUrl;
        ts1tkd.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts1kd.src = imgUrl;
            ts1ob.src = imgUrl;
            ts1tkd.src = imgUrl;
        })
    });
}
ts2name.on("value", name22);

function name22(n2) {
    var ts2kdname = document.getElementById("tents2kd");
    var ts2vcnvname = document.getElementById("tents2vcnv");
    var ts2kickname = document.getElementById("tents2kick");
    var ts2kdo22name = document.getElementById("kdo22namets2");
    ts2kickname.innerText = "Thí sinh 2: " + n2.val().displayName;
    ts2kdname.innerHTML = n2.val().displayName;
    ts2vcnvname.innerHTML = n2.val().displayName;
    ts2kdo22name.innerHTML = n2.val().displayName;
    var uidts2 = n2.val().uid;
    firebase.storage().ref('users/' + uidts2 + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts2kd.src = imgUrl;
        ts2ob.src = imgUrl;
        ts2tkd.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts2kd.src = imgUrl;
            ts2ob.src = imgUrl;
            ts2tkd.src = imgUrl;
        })
    });
}
ts3name.on("value", name32);

function name32(n3) {
    var ts3kdname = document.getElementById("tents3kd");
    var ts3vcnvname = document.getElementById("tents3vcnv");
    var ts3kickname = document.getElementById("tents3kick");
    var ts3kdo22name = document.getElementById("kdo22namets3");
    ts3kickname.innerText = "Thí sinh 3: " + n3.val().displayName;
    ts3kdname.innerHTML = n3.val().displayName;
    ts3vcnvname.innerHTML = n3.val().displayName;
    ts3kdo22name.innerHTML = n3.val().displayName;
    firebase.storage().ref('users/' + n3.val().uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts3kd.src = imgUrl;
        ts3ob.src = imgUrl;
        ts3tkd.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts3kd.src = imgUrl;
            ts3ob.src = imgUrl;
            ts3tkd.src = imgUrl;
        })
    });
}
ts4name.on("value", name42);

function name42(n4) {
    var ts4kdname = document.getElementById("tents4kd");
    var ts4vcnvname = document.getElementById("tents4vcnv");
    var ts4kickname = document.getElementById("tents4kick");
    var ts4kdo22name = document.getElementById("kdo22namets4");
    ts4kickname.innerText = "Thí sinh 4: " + n4.val().displayName;
    ts4vcnvname.innerHTML = n4.val().displayName;
    ts4kdname.innerHTML = n4.val().displayName;
    ts4kdo22name.innerHTML = n4.val().displayName;
    firebase.storage().ref('users/' + n4.val().uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts4kd.src = imgUrl;
        ts4ob.src = imgUrl;
        ts4tkd.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts4kd.src = imgUrl;
            ts4ob.src = imgUrl;
            ts4tkd.src = imgUrl;
        })
    });
}
ts1point.on("value", point12);

function point12(p1) {
    var pointts1kd = document.getElementById("pointts1kd");
    var pointts1vcnv = document.getElementById("pointts1vcnv");
    pointts1kd.innerHTML = p1.val().point;
    pointts1vcnv.innerHTML = p1.val().point;
}
ts2point.on("value", point22);

function point22(p2) {
    var pointts2kd = document.getElementById("pointts2kd");
    var pointts2vcnv = document.getElementById("pointts2vcnv");
    pointts2kd.innerHTML = p2.val().point;
    pointts2vcnv.innerHTML = p2.val().point;
}
ts3point.on("value", point32);

function point32(p3) {
    var pointts3kd = document.getElementById("pointts3kd");
    var pointts3vcnv = document.getElementById("pointts3vcnv");
    pointts3kd.innerHTML = p3.val().point;
    pointts3vcnv.innerHTML = p3.val().point;
}
ts4point.on("value", point42);

function point42(p4) {
    var pointts4kd = document.getElementById("pointts4kd");
    var pointts4vcnv = document.getElementById("pointts4vcnv");
    pointts4kd.innerHTML = p4.val().point;
    pointts4vcnv.innerHTML = p4.val().point;
}


//VCNV 

var vcnvrow = document.getElementById("vcnvrow");
var rowappear = document.getElementById("audio_9");
var rowchoose = document.getElementById("audio_10");
var rowthinking = document.getElementById("audio_11");
var answerappear = document.getElementById("audio_12");
var correctanswer = document.getElementById("audio_13");
var wronganswer = document.getElementById("audio_14");
var vcnvanswerrow = document.getElementById("audio_15");
var vcnvright = document.getElementById("audio_16");


var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV');
var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');


var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');

var CNVANSKT = firebase.database().ref(matchid + '/VCNVAnswer/kiemtradapan');
var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');

var hn1overlay = document.getElementById("overlay-hn1");
var hn2overlay = document.getElementById("overlay-hn2");
var hn3overlay = document.getElementById("overlay-hn3");
var hn4overlay = document.getElementById("overlay-hn4");

var gha1overlay = document.getElementById("vcnvoverlay1");
var gha2overlay = document.getElementById("vcnvoverlay2");
var gha3overlay = document.getElementById("vcnvoverlay3");
var gha4overlay = document.getElementById("vcnvoverlay4");
var ghacenteroverlay = document.getElementById("vcnvoverlaycenter");

var CNVROW1 = firebase.database().ref(matchid + '/VCNVRowStatus/HN1');
var CNVROW2 = firebase.database().ref(matchid + '/VCNVRowStatus/HN2');
var CNVROW3 = firebase.database().ref(matchid + '/VCNVRowStatus/HN3');
var CNVROW4 = firebase.database().ref(matchid + '/VCNVRowStatus/HN4');
var CNVROWTT = firebase.database().ref(matchid + '/VCNVRowStatus/HNTT');

var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');




var image = document.getElementById("vcnvimage");
var overlay = document.getElementById("vcnvoverlay");

var vcnv = firebase.database().ref(matchid + '/VCNV/hangngang');



vcnv.on('value', hnso);
CNVHN1.on('value', cnvhns1);


var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV');
CNVDB.on("value", cnvappear);

function cnvappear(cnva) {
    let remText = cnva.val().cnv.replace(/\s/g, "");
    length = remText.length;
    var cnvdapan = document.getElementById("cnvdapan");
    cnvdapan.innerHTML = cnva.val().cnv.toUpperCase() + " ( " + length + " kí tự" + " )";
}

function cnvhns1(hn1) {
    var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
    CNVHN2.on('value', cnvhns2);

    function cnvhns2(hn2) {
        var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
        CNVHN3.on('value', cnvhns3);

        function cnvhns3(hn3) {
            var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
            CNVHN4.on('value', cnvhns4);

            function cnvhns4(hn4) {
                var anshn1 = hn1.val().dapan;
                var anshn2 = hn2.val().dapan;
                var anshn3 = hn3.val().dapan;
                var anshn4 = hn4.val().dapan;
                var sokitu1 = anshn1.replace(/\s/g, "");
                var sokitu2 = anshn2.replace(/\s/g, "");
                var sokitu3 = anshn3.replace(/\s/g, "");
                var sokitu4 = anshn4.replace(/\s/g, "");
                var lengthanshn1 = sokitu1.length;
                var lengthanshn2 = sokitu2.length;
                var lengthanshn3 = sokitu3.length;
                var lengthanshn4 = sokitu4.length;
                var sokituhn1 = document.getElementById("kituhn1");
                var sokituhn2 = document.getElementById("kituhn2");
                var sokituhn3 = document.getElementById("kituhn3");
                var sokituhn4 = document.getElementById("kituhn4");
                sokituhn1.innerHTML = lengthanshn1;
                sokituhn2.innerHTML = lengthanshn2;
                sokituhn3.innerHTML = lengthanshn3;
                sokituhn4.innerHTML = lengthanshn4;
            }
        }
    }
}


function hnso(ohn) {
    if (ohn.val().hn == 1) {
        hn1overlay.style.backgroundImage = "linear-gradient(-225deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)";
        CNVHN1.on('value', chhn1);

        function chhn1(chs1) {
            var cauhoihn1 = chs1.val().cauhoi;
            var questionb = document.getElementById("question");
            questionb.innerHTML = cauhoihn1;
            var dapanhn1 = chs1.val().dapan;
            var answerb = document.getElementById("answervcnv");
            answerb.innerHTML = "ĐÁP ÁN:  " + dapanhn1;


            TimeVCNV();
            var showdapan = document.getElementById("showdapan1");
            var dapan1 = document.getElementById("odapan1");
            var dapan2 = document.getElementById("odapan2");
            var dapan3 = document.getElementById("odapan3");
            var dapan4 = document.getElementById("odapan4");
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", 1);
    }
    if (ohn.val().hn == 2) {
        hn2overlay.style.backgroundImage = "linear-gradient(-225deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)";
        CNVHN2.on('value', chhn2);

        function chhn2(chs2) {
            var cauhoihn2 = chs2.val().cauhoi;
            var questionb = document.getElementById("question");
            questionb.innerHTML = cauhoihn2;
            var dapanhn2 = chs2.val().dapan;
            var answerb = document.getElementById("answervcnv");
            answerb.innerHTML = "ĐÁP ÁN:  " + dapanhn2;
            TimeVCNV();
            var showdapan = document.getElementById("showdapan1");
            var dapan1 = document.getElementById("odapan1");
            var dapan2 = document.getElementById("odapan2");
            var dapan3 = document.getElementById("odapan3");
            var dapan4 = document.getElementById("odapan4");
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", 2);
    }
    if (ohn.val().hn == 3) {
        hn3overlay.style.backgroundImage = "linear-gradient(-225deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)";
        CNVHN3.on('value', chhn3);

        function chhn3(chs3) {
            var cauhoihn3 = chs3.val().cauhoi;
            var questionb = document.getElementById("question");
            questionb.innerHTML = cauhoihn3;
            var dapanhn3 = chs3.val().dapan;
            var answerb = document.getElementById("answervcnv");
            answerb.innerHTML = "ĐÁP ÁN:  " + dapanhn3;
            TimeVCNV();
            var showdapan = document.getElementById("showdapan1");
            var dapan1 = document.getElementById("odapan1");
            var dapan2 = document.getElementById("odapan2");
            var dapan3 = document.getElementById("odapan3");
            var dapan4 = document.getElementById("odapan4");
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", 3);
        var tstamp1 = document.getElementById("timestamp");
        var dapan = document.getElementById("dapan");
    }
    if (ohn.val().hn == 4) {
        hn4overlay.style.backgroundImage = "linear-gradient(-225deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)";
        CNVHN4.on('value', chhn4);

        function chhn4(chs4) {
            var cauhoihn4 = chs4.val().cauhoi;
            var questionb = document.getElementById("question");
            questionb.innerHTML = cauhoihn4;
            var dapanhn4 = chs4.val().dapan;
            var answerb = document.getElementById("answervcnv");
            answerb.innerHTML = "ĐÁP ÁN:  " + dapanhn4;
            TimeVCNV();
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", 4);
    }
    if (ohn.val().hn == 5) {
        CNVHNTT.on('value', chhntt);

        function chhntt(chstt) {
            var cauhoihntt = chstt.val().cauhoi;
            var questionb = document.getElementById("question");
            questionb.innerHTML = cauhoihntt;
            var dapanhntt = chstt.val().dapan;
            var answerb = document.getElementById("answervcnv");
            answerb.innerHTML = "ĐÁP ÁN:  " + dapanhntt;
            TimeVCNV();
            var showdapan = document.getElementById("showdapan1");
            var dapan1 = document.getElementById("odapan1");
            var dapan2 = document.getElementById("odapan2");
            var dapan3 = document.getElementById("odapan3");
            var dapan4 = document.getElementById("odapan4");
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", "TT");
    }
}





var vcnvstatus = firebase.database().ref(matchid + '/phanthistatus/vcnv');
vcnvstatus.on('value', demtg);


function demtg(vcnv) {
    if (vcnv.val().batdau == 1) {
        MinusTimeVCNV();
        MinusTimeMilisecondsVCNV();
        MinusTimeSecondsVCNV();
    }
}

function TimeVCNV() {
    var timervcnv = document.getElementById("timervcnv");
    var seconds = 15;
    timervcnv.innerHTML = seconds;
}

function MinusTimeVCNV() {
    var timervcnv = document.getElementById("timervcnv");
    var seconds = 15;
    setInterval(function () {
        if (seconds > 0) {
            seconds = seconds - 1;
            timervcnv.innerHTML = seconds;
        }
    }, 1000)
}



function MinusTimeMilisecondsVCNV() {
    var milliseconds = 0;
    setInterval(function () {
        if (milliseconds < 1000) {
            milliseconds = milliseconds + 1;
        }
        if (milliseconds == 1000) {
            milliseconds = 0;
        }
        localStorage.setItem("mms", milliseconds);
    }, 1)
}

function MinusTimeSecondsVCNV() {
    var s = 0;
    var interval = setInterval(function () {
        if (s < 15) {
            s = s + 1;
        }
        if (s == 15) {
            clearInterval(interval);
        }
        localStorage.setItem("s", s);
    }, 1000)
}



var CNVANSKT = firebase.database().ref(matchid + '/VCNVAnswer/kiemtradapan');
CNVANSKT.on("value", kt);

function kt(dt) {
    if (dt.val().kiemtra = 1) {
        var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
        COFCNVTS1.once("value", ds1);

        function ds1(ds1) {
            var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
            COFCNVTS2.once("value", ds2);

            function ds2(ds2) {
                var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
                COFCNVTS3.once("value", ds3);

                function ds3(ds3) {
                    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
                    COFCNVTS4.once("value", ds4);

                    function ds4(ds4) {
                        if (ds1.val().dunghaysai == 2 && ds2.val().dunghaysai == 2 && ds3.val().dunghaysai == 2 && ds4.val().dunghaysai == 2) {
                            var hnoverlay = document.getElementById("overlay-hn" + localStorage.getItem("HN"));
                            hnoverlay.style.backgroundImage = "linear-gradient(to right, #d7d2cc 0%, #304352 100%)";
                        }
                    }
                }
            }
        }
    }
};


var vcnvrow = document.getElementById("vcnvrow");
var rowappear = document.getElementById("audio_9");
var rowchoose = document.getElementById("audio_10");
var rowthinking = document.getElementById("audio_11");
var answerappear = document.getElementById("audio_12");
var correctanswer = document.getElementById("audio_13");
var wronganswer = document.getElementById("audio_14");
var vcnvanswerrow = document.getElementById("audio_15");
var vcnvright = document.getElementById("audio_16");


var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV');
var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');


var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');

var CNVANSKT = firebase.database().ref(matchid + '/VCNVAnswer/kiemtradapan');
var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');

var hn1overlay = document.getElementById("overlay-hn1");
var hn2overlay = document.getElementById("overlay-hn2");
var hn3overlay = document.getElementById("overlay-hn3");
var hn4overlay = document.getElementById("overlay-hn4");

var gha1overlay = document.getElementById("vcnvoverlay1");
var gha2overlay = document.getElementById("vcnvoverlay2");
var gha3overlay = document.getElementById("vcnvoverlay3");
var gha4overlay = document.getElementById("vcnvoverlay4");
var ghacenteroverlay = document.getElementById("vcnvoverlaycenter");

var CNVROW1 = firebase.database().ref(matchid + '/VCNVRowStatus/HN1');
var CNVROW2 = firebase.database().ref(matchid + '/VCNVRowStatus/HN2');
var CNVROW3 = firebase.database().ref(matchid + '/VCNVRowStatus/HN3');
var CNVROW4 = firebase.database().ref(matchid + '/VCNVRowStatus/HN4');
var CNVROWTT = firebase.database().ref(matchid + '/VCNVRowStatus/HNTT');

var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');


CNVANS1.on("value", da1);

function da1(dapanu1) {
    CNVANS2.on("value", da2);

    function da2(dapanu2) {
        CNVANS3.on("value", da3);

        function da3(dapanu3) {
            CNVANS4.on("value", da4);

            function da4(dapanu4) {
                var dapans1 = dapanu1.val().answer;
                var dapans2 = dapanu2.val().answer;
                var dapans3 = dapanu3.val().answer;
                var dapans4 = dapanu4.val().answer;
                var dapan1 = document.getElementById("dapan1");
                var dapan2 = document.getElementById("dapan2");
                var dapan3 = document.getElementById("dapan3");
                var dapan4 = document.getElementById("dapan4");
                dapan1.innerHTML = dapans1.toUpperCase();
                dapan2.innerHTML = dapans2.toUpperCase();
                dapan3.innerHTML = dapans3.toUpperCase();
                dapan4.innerHTML = dapans4.toUpperCase();
            }
        }
    }
}




var vcnvrow = document.getElementById("vcnvrow");
var rowappear = document.getElementById("audio_9");
var rowchoose = document.getElementById("audio_10");
var rowthinking = document.getElementById("audio_11");
var answerappear = document.getElementById("audio_12");
var correctanswer = document.getElementById("audio_13");
var wronganswer = document.getElementById("audio_14");
var vcnvanswerrow = document.getElementById("audio_15");
var vcnvright = document.getElementById("audio_16");


var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV');
var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');


var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');

var CNVANSKT = firebase.database().ref(matchid + '/VCNVAnswer/kiemtradapan');
var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');

var hn1overlay = document.getElementById("overlay-hn1");
var hn2overlay = document.getElementById("overlay-hn2");
var hn3overlay = document.getElementById("overlay-hn3");
var hn4overlay = document.getElementById("overlay-hn4");

var gha1overlay = document.getElementById("vcnvoverlay1");
var gha2overlay = document.getElementById("vcnvoverlay2");
var gha3overlay = document.getElementById("vcnvoverlay3");
var gha4overlay = document.getElementById("vcnvoverlay4");
var ghacenteroverlay = document.getElementById("vcnvoverlaycenter");

var CNVROW1 = firebase.database().ref(matchid + '/VCNVRowStatus/HN1');
var CNVROW2 = firebase.database().ref(matchid + '/VCNVRowStatus/HN2');
var CNVROW3 = firebase.database().ref(matchid + '/VCNVRowStatus/HN3');
var CNVROW4 = firebase.database().ref(matchid + '/VCNVRowStatus/HN4');
var CNVROWTT = firebase.database().ref(matchid + '/VCNVRowStatus/HNTT');

var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');

CNVROW1.on("value", CNVROWTF1);

function CNVROWTF1(status1) {
    CNVROW2.on("value", CNVROWTF2);

    function CNVROWTF2(status2) {
        CNVROW3.on("value", CNVROWTF3);

        function CNVROWTF3(status3) {
            CNVROW4.on("value", CNVROWTF4);

            function CNVROWTF4(status4) {
                CNVROWTT.on("value", CNVROWTT5);

                function CNVROWTT5(status5) {
                    if (status1.val().status == 1) {
                        hn1overlay.style.display = "none";
                        // gha1overlay.style.display = "none";
                        CNVHN1.on("value", dapanhn1);

                        function dapanhn1(dapanhnso1) {
                            var hns1 = document.getElementById("dahn1");
                            hns1.innerHTML = dapanhnso1.val().dapan;
                        }
                    }
                    if (status2.val().status == 1) {
                        hn2overlay.style.display = "none";
                        // gha2overlay.style.display = "none";
                        CNVHN2.on("value", dapanhn2);

                        function dapanhn2(dapanhnso2) {
                            var hns2 = document.getElementById("dahn2");
                            hns2.innerHTML = dapanhnso2.val().dapan;
                        }
                    }
                    if (status3.val().status == 1) {
                        hn3overlay.style.display = "none";
                        // gha3overlay.style.display = "none";
                        CNVHN3.on("value", dapanhn3);

                        function dapanhn3(dapanhnso3) {
                            var hns3 = document.getElementById("dahn3");
                            hns3.innerHTML = dapanhnso3.val().dapan;
                        }
                    }
                    if (status4.val().status == 1) {
                        hn4overlay.style.display = "none";
                        // gha4overlay.style.display = "none";
                        CNVHN4.on("value", dapanhn4);

                        function dapanhn4(dapanhnso4) {
                            var hns4 = document.getElementById("dahn4");
                            hns4.innerHTML = dapanhnso4.val().dapan;
                        }
                    }
                    if (status5.val().status == 1) {
                        // ghacenteroverlay.style.display = "none";
                    }
                }
            }
        }
    }
}


var CNVHA1 = firebase.database().ref(matchid + '/VCNVImageStatus/HA1/');
CNVHA1.on('value', cnvha1);
function cnvha1(hn1) {
    var CNVHA2 = firebase.database().ref(matchid + '/VCNVImageStatus/HA2/');
    CNVHA2.on('value', cnvha2);
    function cnvha2(hn2) {
        var CNVHA3 = firebase.database().ref(matchid + '/VCNVImageStatus/HA3/');
        CNVHA3.on('value', cnvha3);

        function cnvha3(hn3) {
            var CNVHA4 = firebase.database().ref(matchid + '/VCNVImageStatus/HA4/');
            CNVHA4.on('value', cnvha4);
            function cnvha4(hn4) {
                var CNVHATT = firebase.database().ref(matchid + '/VCNVImageStatus/HATT/');
                CNVHATT.on('value', cnvhatt);
                function cnvhatt(hntt) {
                    if (hn1.val().status == 1) {
                        gha1overlay.style.display = "none";
                    }
                    if (hn2.val().status == 1) {
                        gha2overlay.style.display = "none";
                    }
                    if (hn3.val().status == 1) {
                        gha4overlay.style.display = "none";
                    }
                    if (hn4.val().status == 1) {
                        gha3overlay.style.display = "none";
                    }
                    if (hntt.val().status == 1) {
                        ghacenteroverlay.style.display = "none";
                    }
                }
            }
        }
    }
}





firebase.storage().ref(matchid + '/img/cnv/cnv.jpg').getDownloadURL().then(imgUrl => {
    vcnvimage.src = imgUrl;
});

//Tangtoc





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


var TT1Image = document.getElementById("tt11");
var TT2Video = document.getElementById("tt22");
var TT3Image = document.getElementById("tt33");
var TT4Video = document.getElementById("tt44");
TT1Image.style.display = "none";
TT2Video.style.display = "none";
TT3Image.style.display = "none";
TT4Video.style.display = "none";


var questionappear = document.getElementById("audio_18");
var AccelerationThinking = document.getElementById("audio_19");
var AccelerationAnswerShow = document.getElementById("audio_20");
var AccelerationAnswerCorrect = document.getElementById("audio_21");
var AccelerationWrongAnswer = document.getElementById("audio_22");


tangtoc.on("value", cautt);

function cautt(tt) {
    if (tt.val().tangtoc == 0) {
        TT1Image.style.display = "none";
        TT2Video.style.display = "none";
        TT3Image.style.display = "none";
        TT4Video.style.display = "none";
        var timer = document.getElementById("time");
        var seconds = "";
        localStorage.setItem("TT", 0);
        var TTQ = firebase.database().ref(matchid + "/AccelerationQuestion/QS" + localStorage.getItem("TT"));
        TTQ.on("value", dapanqs);

        function dapanqs(dapan) {
            var qsanswer = document.getElementById("dapantangtoc");
            qsanswer.innerHTML = "";
            var qsbar = document.getElementById("accelerationquestion");
            qsbar.innerHTML = "";
        }
    }
    if (tt.val().tangtoc == 1) {
        NextQ()
        firebase.storage().ref(matchid + "/tt/tt1/tt1.jpg").getDownloadURL().then(imgUrl => {
            tt11.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt1/tt1.mp4").getDownloadURL().then(imgUrl => {
                tt11.src = imgUrl;
            })
        });
        TT1Image.style.display = "block";
        TTQ1.on("value", qs1);

        function qs1(qs) {
            var q1 = qs.val().cauhoi;
            var qsbar = document.getElementById("accelerationquestion");
            qsbar.innerHTML = "Câu hỏi 1/  " + q1;
        }
        TT2Video.style.display = "none";
        TT3Image.style.display = "none";
        TT4Video.style.display = "none";
        var timer = document.getElementById("timertt");
        var seconds = 10;
        timer.innerHTML = seconds;
        localStorage.setItem("TT", 1);
        var defaultdungsai = {
            correctorwrong: 0
        }
        COFTTTT1.set(defaultdungsai);
        COFTTTT2.set(defaultdungsai);
        COFTTTT3.set(defaultdungsai);
        COFTTTT4.set(defaultdungsai);
        localStorage.setItem("TTQ", 1);
        var TTQ = firebase.database().ref(matchid + "/AccelerationQuestion/QS" + localStorage.getItem("TT"));
        TTQ.on("value", dapanqs);

        function dapanqs(dapan) {
            var answer = dapan.val().dapan;
            var qsanswer = document.getElementById("dapantangtoc");
            qsanswer.innerHTML = "ĐÁP ÁN :  " + answer;
        }

    }
    if (tt.val().tangtoc == 2) {
        NextQ()
        firebase.storage().ref(matchid + "/tt/tt2/tt2.jpg").getDownloadURL().then(imgUrl => {
            tt22.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt2/tt2.mp4").getDownloadURL().then(imgUrl => {
                tt22.src = imgUrl;
            })
        });

        TT1Image.style.display = "none";
        TTQ2.on("value", qs2);
        document.getElementById("tt22").pause();
        function qs2(qs) {
            var q2 = qs.val().cauhoi;
            var qsbar = document.getElementById("accelerationquestion");
            qsbar.innerHTML = "Câu hỏi 2/  " + q2;
        }
        TT2Video.style.display = "block";
        TT3Image.style.display = "none";
        TT4Video.style.display = "none";
        var timer = document.getElementById("timertt");
        var seconds = 20;
        timer.innerHTML = seconds;
        localStorage.setItem("TT", 2);
        var defaultdungsai = {
            correctorwrong: 0
        }
        COFTTTT1.set(defaultdungsai);
        COFTTTT2.set(defaultdungsai);
        COFTTTT3.set(defaultdungsai);
        COFTTTT4.set(defaultdungsai);
        localStorage.setItem("TTQ", 2);
        var TTQ = firebase.database().ref(matchid + "/AccelerationQuestion/QS" + localStorage.getItem("TT"));
        TTQ.on("value", dapanqs);

        function dapanqs(dapan) {
            var answer = dapan.val().dapan;
            var qsanswer = document.getElementById("dapantangtoc");
            qsanswer.innerHTML = "ĐÁP ÁN :  " + answer;
        }
    }
    if (tt.val().tangtoc == 3) {
        NextQ()

        firebase.storage().ref(matchid + "/tt/tt3/tt3.jpg").getDownloadURL().then(imgUrl => {
            tt33.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt3/tt3.mp4").getDownloadURL().then(imgUrl => {
                tt33.src = imgUrl;
            })
        });
        TT1Image.style.display = "none";
        TTQ3.on("value", qs3);

        function qs3(qs) {
            var q3 = qs.val().cauhoi;
            var qsbar = document.getElementById("accelerationquestion");
            qsbar.innerHTML = "Câu hỏi 3/  " + q3;
        }
        TT2Video.style.display = "none";
        TT3Image.style.display = "block";
        TT4Video.style.display = "none";
        var timer = document.getElementById("timertt");
        var seconds = 30;
        timer.innerHTML = seconds;
        localStorage.setItem("TT", 3);
        var defaultdungsai = {
            correctorwrong: 0
        }
        COFTTTT1.set(defaultdungsai);
        COFTTTT2.set(defaultdungsai);
        COFTTTT3.set(defaultdungsai);
        COFTTTT4.set(defaultdungsai);
        localStorage.setItem("TTQ", 3);
        var TTQ = firebase.database().ref(matchid + "/AccelerationQuestion/QS" + localStorage.getItem("TT"));
        TTQ.on("value", dapanqs);

        function dapanqs(dapan) {
            var answer = dapan.val().dapan;
            var qsanswer = document.getElementById("dapantangtoc");
            qsanswer.innerHTML = "ĐÁP ÁN :  " + answer;
        }
    }
    if (tt.val().tangtoc == 4) {
        NextQ()
        firebase.storage().ref(matchid + "/tt/tt4/tt4.jpg").getDownloadURL().then(imgUrl => {
            tt44.poster = imgUrl;
        }).catch((error) => {
            firebase.storage().ref(matchid + "/tt/tt4/tt4.mp4").getDownloadURL().then(imgUrl => {
                tt44.src = imgUrl;
            })
        });
        TT1Image.style.display = "none";
        TTQ4.on("value", qs4);
        document.getElementById("tt44").pause();
        function qs4(qs) {
            var q4 = qs.val().cauhoi;
            var qsbar = document.getElementById("accelerationquestion");
            qsbar.innerHTML = "Câu hỏi 4/  " + q4;
        }
        TT2Video.style.display = "none";
        TT3Image.style.display = "none";
        TT4Video.style.display = "block";
        var timer = document.getElementById("timertt");
        var seconds = 40;
        timer.innerHTML = seconds;
        localStorage.setItem("TT", 4);
        var defaultdungsai = {
            correctorwrong: 0
        }
        COFTTTT1.set(defaultdungsai);
        COFTTTT2.set(defaultdungsai);
        COFTTTT3.set(defaultdungsai);
        COFTTTT4.set(defaultdungsai);
        localStorage.setItem("TTQ", 4);
        var TTQ = firebase.database().ref(matchid + "/AccelerationQuestion/QS" + localStorage.getItem("TT"));
        TTQ.on("value", dapanqs);

        function dapanqs(dapan) {
            var answer = dapan.val().dapan;
            var qsanswer = document.getElementById("dapantangtoc");
            qsanswer.innerHTML = "ĐÁP ÁN :  " + answer;
        }
    }
}

var AccelerationDisplayAnswerImageStatus = firebase.database().ref(matchid + '/AccelerationDisplayAnswerImage/');
AccelerationDisplayAnswerImageStatus.on('value', displayAnswerImage);
function displayAnswerImage(displayImageStatus) {
    if (displayImageStatus.val().status === true) {
        var ttNumber = localStorage.getItem("TT");
        var imageItem = document.getElementById("tt" + ttNumber + ttNumber);

        firebase.storage().ref(matchid + "/tt/datt" + localStorage.getItem("TT") + "/tt" + localStorage.getItem("TT") + ".jpg").getDownloadURL().then(imgUrl => {
            imageItem.poster = imgUrl;
        }).catch((error) => {
        });
    }
}


var tangtocstatus = firebase.database().ref(matchid + "/phanthistatus/tangtoc");
tangtocstatus.on("value", demtgtt);

function demtgtt(tt) {
    if (tt.val().batdau == 1) {
        var tangtoc1 = firebase.database().ref(matchid + "/Acceleration/QS");
        tangtoc1.once('value', cautt);
        function cautt(ct) {
            if (ct.val().tangtoc == 1) {
                TimeTT(10);
                MinusTimeTT(10);
                document.getElementById("tt11").play();
            }
            if (ct.val().tangtoc == 2) {
                TimeTT(20);
                MinusTimeTT(20);
                document.getElementById("tt22").play();
            }
            if (ct.val().tangtoc == 3) {
                TimeTT(30);
                MinusTimeTT(30);
                document.getElementById("tt33").play();
            }
            if (ct.val().tangtoc == 4) {
                TimeTT(40);
                MinusTimeTT(40);
                document.getElementById("tt44").play();
            }
        }
    }
}




function TimeTT(seconds) {
    var timer = document.getElementById("timertt");
    timer.innerHTML = seconds;
}

function MinusTimeTT(seconds) {
    var timer = document.getElementById("timertt");
    var Timeouttime = seconds * 1000;
    setInterval(function () {
        if (seconds > 0) {
            seconds = seconds - 1;
            timer.innerHTML = seconds;
        }
    }, 1000)

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

                                                                        var idts1 = names1.val().id;
                                                                        var idts2 = names2.val().id;
                                                                        var idts3 = names3.val().id;
                                                                        var idts4 = names4.val().id;


                                                                        var answer = [{
                                                                            answer: anstts1,
                                                                            timestamp: tstamptt1,
                                                                            name: namett1,
                                                                            uid: uidtt1,
                                                                            point: diem1,
                                                                            id: idts1,
                                                                        },
                                                                        {
                                                                            answer: anstts2,
                                                                            timestamp: tstamptt2,
                                                                            name: namett2,
                                                                            uid: uidtt2,
                                                                            point: diem2,
                                                                            id: idts2,
                                                                        },
                                                                        {
                                                                            answer: anstts3,
                                                                            timestamp: tstamptt3,
                                                                            name: namett3,
                                                                            uid: uidtt3,
                                                                            point: diem3,
                                                                            id: idts3,
                                                                        },
                                                                        {
                                                                            answer: anstts4,
                                                                            timestamp: tstamptt4,
                                                                            name: namett4,
                                                                            uid: uidtt4,
                                                                            point: diem4,
                                                                            id: idts4,
                                                                        },
                                                                        ];
                                                                        answer.sort(function (a, b) { return a.timestamp - b.timestamp });



                                                                        document.getElementById("dapantt1").innerHTML = answer[0].answer;
                                                                        document.getElementById("dapantt2").innerHTML = answer[1].answer;
                                                                        document.getElementById("dapantt3").innerHTML = answer[2].answer;
                                                                        document.getElementById("dapantt4").innerHTML = answer[3].answer;

                                                                        document.getElementById("tttstamp1").innerHTML = answer[0].timestamp;
                                                                        document.getElementById("tttstamp2").innerHTML = answer[1].timestamp;
                                                                        document.getElementById("tttstamp3").innerHTML = answer[2].timestamp;
                                                                        document.getElementById("tttstamp4").innerHTML = answer[3].timestamp;

                                                                        document.getElementById("tentstt1").innerHTML = answer[0].name;
                                                                        document.getElementById("tentstt2").innerHTML = answer[1].name;
                                                                        document.getElementById("tentstt3").innerHTML = answer[2].name;
                                                                        document.getElementById("tentstt4").innerHTML = answer[3].name;

                                                                        document.getElementById("accelerationpoint1").innerHTML = answer[0].point;
                                                                        document.getElementById("accelerationpoint2").innerHTML = answer[1].point;
                                                                        document.getElementById("accelerationpoint3").innerHTML = answer[2].point;
                                                                        document.getElementById("accelerationpoint4").innerHTML = answer[3].point;


                                                                        localStorage.setItem("PTT1", answer[0].id);
                                                                        localStorage.setItem("PTT2", answer[1].id);
                                                                        localStorage.setItem("PTT3", answer[2].id);
                                                                        localStorage.setItem("PTT4", answer[3].id);














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



    }, Timeouttime + 2000)
}




function NextQ() {


    var TTANS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Answer');
    TTANS1.on("value", tl1);

    function tl1(traloi1) {

        var anstts1 = traloi1.val().answer;
        document.getElementById("dapantt1").innerHTML = anstts1;

    }



    var TTANS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Answer');
    TTANS2.on("value", tl2);

    function tl2(traloi2) {
        var anstts2 = traloi2.val().answer;
        document.getElementById("dapantt2").innerHTML = anstts2;
    }


    var TTANS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Answer');
    TTANS3.on("value", tl3);

    function tl3(traloi3) {
        var anstts3 = traloi3.val().answer;
        document.getElementById("dapantt3").innerHTML = anstts3;
    }



    var TTANS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Answer');
    TTANS4.on("value", tl4);

    function tl4(traloi4) {

        var anstts4 = traloi4.val().answer;
        document.getElementById("dapantt4").innerHTML = anstts4;
    }



    var TTANSTIMESTAMPS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Timestamp');
    TTANSTIMESTAMPS1.on("value", ts1);

    function ts1(timestamp1) {

        var tstamptt1 = parseFloat(timestamp1.val().timestamp);
        document.getElementById("tttstamp1").innerHTML = tstamptt1;


    }




    var TTANSTIMESTAMPS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Timestamp');
    TTANSTIMESTAMPS2.on("value", ts2);

    function ts2(timestamp2) {

        var tstamptt2 = parseFloat(timestamp2.val().timestamp);
        document.getElementById("tttstamp2").innerHTML = tstamptt2;

    }



    var TTANSTIMESTAMPS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Timestamp');
    TTANSTIMESTAMPS3.on("value", ts3);

    function ts3(timestamp3) {

        var tstamptt3 = parseFloat(timestamp3.val().timestamp);
        document.getElementById("tttstamp3").innerHTML = tstamptt3;

    }


    var TTANSTIMESTAMPS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Timestamp');
    TTANSTIMESTAMPS4.on("value", ts4);

    function ts4(timestamp4) {


        var tstamptt4 = parseFloat(timestamp4.val().timestamp);
        document.getElementById("tttstamp4").innerHTML = tstamptt4;

    }



    var nameref1 = firebase.database().ref(matchid + "/games/player1");
    nameref1.on("value", n1);

    function n1(names1) {

        var namett1 = names1.val().displayName;
        document.getElementById("tentstt1").innerHTML = namett1;
    }


    var nameref2 = firebase.database().ref(matchid + "/games/player2");
    nameref2.on("value", n2);

    function n2(names2) {

        var namett2 = names2.val().displayName;
        document.getElementById("tentstt2").innerHTML = namett2;
    }


    var nameref3 = firebase.database().ref(matchid + "/games/player3");
    nameref3.on("value", n3);

    function n3(names3) {
        var namett3 = names3.val().displayName;
        document.getElementById("tentstt3").innerHTML = namett3;
    }



    var nameref4 = firebase.database().ref(matchid + "/games/player4");
    nameref4.on("value", n4);

    function n4(names4) {


        var namett4 = names4.val().displayName;
        document.getElementById("tentstt4").innerHTML = namett4;
    }











    document.getElementById("accelerationpoint1").innerHTML = "";
    document.getElementById("accelerationpoint2").innerHTML = "";
    document.getElementById("accelerationpoint3").innerHTML = "";
    document.getElementById("accelerationpoint4").innerHTML = "";



}

//Ve dich


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


var ts1point = firebase.database().ref(matchid + '/point/player1');
var ts2point = firebase.database().ref(matchid + '/point/player2');
var ts3point = firebase.database().ref(matchid + '/point/player3');
var ts4point = firebase.database().ref(matchid + '/point/player4');

var ts1name = firebase.database().ref(matchid + "/games/player1");
var ts2name = firebase.database().ref(matchid + "/games/player2");
var ts3name = firebase.database().ref(matchid + "/games/player3");
var ts4name = firebase.database().ref(matchid + "/games/player4");



var timer1 = document.getElementById("timervd");
var refvedichdungsai = firebase.database().ref(matchid + '/VDCorrectOrWrong/');
var thisinhvedichname = document.getElementById("tsvdname");

var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
var VDChuongPlayer = firebase.database().ref(matchid + "/VDChuong/Player");
var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");




VDQN.on('value', questionumber);


function questionumber(qs) {
    var causo = qs.val().causo;
    var QSP = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/" + causo + "/cau" + causo);
    if (causo == 0) {
        document.getElementById("questionnumber").innerHTML = "";
        document.getElementById("question12").innerHTML = "";
        document.getElementById("vedichanswer").innerHTML = "";
    }
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
                        var questionbar = document.getElementById("question12");
                        var vedichanswer = document.getElementById("vedichanswer");
                        if (causo == 0) {
                            questionnumber.innerHTML = "";
                            questionbar.innerHTML = "";
                            vedichanswer.innerHTML = "";
                        } else {
                            questionnumber.innerHTML = "Câu hỏi số " + causo + "/ Câu hỏi mức " + qpack + " điểm" + " | " + "Gói câu hỏi: " + qpl1.val().cau1 + "-" + qpl2.val().cau2 + "-" + qpl3.val().cau3;
                            questionbar.innerHTML = quest.val().cauhoi;
                            vedichanswer.innerHTML = "ĐÁP ÁN:  " + quest.val().dapan;
                            if (qpack == 10) {
                                var timer = document.getElementById("timervd");
                                var seconds = 10;
                                timer.innerHTML = seconds;
                            }
                            if (qpack == 20) {
                                var timer = document.getElementById("timervd");
                                var seconds = 15;
                                timer.innerHTML = seconds;
                            }
                            if (qpack == 30) {
                                var timer = document.getElementById("timervd");
                                var seconds = 20;
                                timer.innerHTML = seconds;
                            }
                        }

                        refvedichbatdau.on('value', vdstatus);

                        function vdstatus(status) {
                            if (status.val().batdau == 1) {
                                if (qpack == 10) {
                                    function Minus10Seconds() {
                                        var timer = document.getElementById("timervd");
                                        var seconds = 10;
                                        setInterval(function () {
                                            if (seconds > 0) {
                                                seconds = seconds - 1;
                                                timer.innerHTML = seconds;
                                            }
                                        }, 1000)
                                    };
                                    Minus10Seconds();
                                }
                                if (qpack == 20) {
                                    function Minus15Seconds() {
                                        var timer = document.getElementById("timervd");
                                        var seconds = 15;
                                        setInterval(function () {
                                            if (seconds > 0) {
                                                seconds = seconds - 1;
                                                timer.innerHTML = seconds;
                                            }
                                        }, 1000)
                                    };
                                    Minus15Seconds();
                                }
                                if (qpack == 30) {
                                    function Minus20Seconds() {
                                        var timer = document.getElementById("timervd");
                                        var seconds = 20;
                                        setInterval(function () {
                                            if (seconds > 0) {
                                                seconds = seconds - 1;
                                                timer.innerHTML = seconds;
                                            }
                                        }, 1000)
                                    };
                                    Minus20Seconds();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}




refvedichdungsai.on('value', vdcor);

function vdcor(vddungsai) {
    if (vddungsai.val().dungsai == 1) {

    }
    if (vddungsai.val().dungsai == 2) {

    }
    if (vddungsai.val().dungsai == 3) {
        var timer = document.getElementById("timervd");
        var seconds = 5;
        timer.innerHTML = seconds;

        function Minus5Seconds() {
            var timer = document.getElementById("timervd");
            var seconds = 5;
            setInterval(function () {
                if (seconds > 0) {
                    seconds = seconds - 1;
                    timer.innerHTML = seconds;
                }
            }, 1000)
        };
        Minus5Seconds();
        setTimeout(function () {
            var chuong = {
                status: 4
            }
            VDChuong.set(chuong);
        }, 5000)
    }
}



VDNSHV.on("value", NSHV);

function NSHV(hope) {
    if (hope.val().status == 0) {
        ngoisao.style.display = "none";
        Notification("Đã tắt ngôi sao hy vọng");
    }
    if (hope.val().status == 1) {
        ngoisao.style.display = "block";
        document.getElementById("audio_36").play();
        Notification("Đã bật ngôi sao hy vọng");
    }
}

VDPlayerEnd.on('value', endturn);

function endturn(e) {
    if (e.val().end == 1) {
        var timer = document.getElementById("timervd");
        var seconds = "";
        timer.innerHTML = seconds;
        var questionbar = document.getElementById("question12");
        questionbar.innerHTML = "";
        var questionumber = document.getElementById("questionnumber");
        questionumber.innerHTML = "";
        var vedichanswer = document.getElementById("vedichanswer");
        vedichanswer.innerHTML = "";
        var defaultplayer = {
            player: 0
        }
        playerstatus.set(defaultplayer);
    }
}



//Về đích phụ
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
        tt1vdp.src = imgUrl;
        kdo22ts1img.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt1vdp.src = imgUrl;
            kdo22ts1img.src = imgUrl;
        })
    });
}


ts2ref.on('value', ts2);

function ts2(tsinfo) {
    document.getElementById("tt2name").innerHTML = tsinfo.val().displayName;
    var ts2uid = tsinfo.val().uid;
    firebase.storage().ref('users/' + ts2uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        tt2vdp.src = imgUrl;
        kdo22ts2img.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt2vdp.src = imgUrl;
            kdo22ts2img.src = imgUrl;
        })
    });
}


ts3ref.on('value', ts3);

function ts3(tsinfo) {
    document.getElementById("tt3name").innerHTML = tsinfo.val().displayName;
    var ts3uid = tsinfo.val().uid;
    firebase.storage().ref('users/' + ts3uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        tt3vdp.src = imgUrl;
        kdo22ts3img.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt3vdp.src = imgUrl;
            kdo22ts3img.src = imgUrl;
        })
    });
}


ts4ref.on('value', ts4);

function ts4(tsinfo) {
    document.getElementById("tt4name").innerHTML = tsinfo.val().displayName;
    var ts4uid = tsinfo.val().uid;
    firebase.storage().ref('users/' + ts4uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        tt4vdp.src = imgUrl;
        kdo22ts4img.src = imgUrl;
    }).catch((error) => {
        firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
            tt4vdp.src = imgUrl;
            kdo22ts4img.src = imgUrl;
        })
    });
}



ts1point.on("value", point1);

function point1(p1) {
    document.getElementById("tt1point").innerHTML = p1.val().point;
    document.getElementById("kdo22points1").innerHTML = p1.val().point;
}
ts2point.on("value", point2);

function point2(p2) {
    document.getElementById("tt2point").innerHTML = p2.val().point;
    document.getElementById("kdo22points2").innerHTML = p2.val().point;
}
ts3point.on("value", point3);

function point3(p3) {
    document.getElementById("tt3point").innerHTML = p3.val().point;
    document.getElementById("kdo22points3").innerHTML = p3.val().point;
}
ts4point.on("value", point4);

function point4(p4) {
    document.getElementById("tt4point").innerHTML = p4.val().point;
    document.getElementById("kdo22points4").innerHTML = p4.val().point;
}



//Hiển thị câu hỏi

var VDPCauso = firebase.database().ref(matchid + '/VDPCauso');
VDPCauso.on('value', causofunction);

function causofunction(causovdp) {
    var causo = causovdp.val().causo;
    var VDPQuestion = firebase.database().ref(matchid + '/CHPQuestion/cau' + causo);
    VDPQuestion.on('value', question);

    function question(vdpquestion) {
        document.getElementById("questionnumbervdp").innerHTML = "Câu hỏi số " + causo + ":";
        document.getElementById('question1vdp').innerHTML = vdpquestion.val();
        if (causo == 0) {
            document.getElementById("questionnumbervdp").innerHTML = "";
        }
        //Hiển thị thời gian
        var timervdp = document.getElementById("timervdp");
        var seconds = 15;
        timervdp.innerHTML = seconds;
    }
    var VDPAnswer = firebase.database().ref(matchid + '/CHPQuestion/dacau' + causo);
    VDPAnswer.on('value', answer);

    function answer(vdpanswer) {
        if (vdpanswer.val() == null) {
            document.getElementById("vedichphuanswer").innerHTML = "";
        } else {
            document.getElementById("vedichphuanswer").innerHTML = "ĐÁP ÁN: " + vdpanswer.val();
        }
    }
}




//Bắt đầu

var VDPDemgio = firebase.database().ref(matchid + '/phanthistatus/vedichphu/');
VDPDemgio.on('value', demtime);

function demtime(time) {
    if (time.val().batdau == 1) {
        function Minus15Seconds() {
            var timervdp = document.getElementById("timervdp");
            var seconds = 15;
            setInterval(function () {
                if (localStorage.getItem("timerpause") == 0) {
                    if (seconds > 0) {
                        seconds = seconds - 1;
                        timervdp.innerHTML = seconds;
                    }
                }
            }, 1000)
        };
        Minus15Seconds();
    }

}





//Chuông


var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
VDPChuong.on('value', status);

function status(sts) {
    if (sts.val().status == 1) {
        localStorage.setItem("timerpause", 1);
        setTimeout(function () {
            firebase.database().ref(matchid + '/VDPChuong/Player').limitToFirst(1).once('value', function (snapshot) {
                snapshot.forEach(function (e) {
                    var x = e.val().id;
                    if (x == 1) {
                        document.getElementById("playertt1").style.backgroundColor = "#E3242B";
                        return false;
                    }
                    if (x == 2) {
                        document.getElementById("playertt2").style.backgroundColor = "#E3242B";
                        return false;
                    }
                    if (x == 3) {
                        document.getElementById("playertt3").style.backgroundColor = "#E3242B";
                        return false;
                    }
                    if (x == 4) {
                        document.getElementById("playertt4").style.backgroundColor = "#E3242B";
                        return false;
                    }
                })
            })
        }, 500);
    }
    if (sts.val().status == 0) {
        localStorage.setItem("timerpause", 0);
        document.getElementById("playertt1").style.backgroundColor = "#171E28";
        document.getElementById("playertt2").style.backgroundColor = "#171E28";
        document.getElementById("playertt3").style.backgroundColor = "#171E28";
        document.getElementById("playertt4").style.backgroundColor = "#171E28";
    }
    if (sts.val().status == 3) {
        localStorage.setItem("timerpause", 0);
        document.getElementById("playertt1").style.backgroundColor = "#171E28";
        document.getElementById("playertt2").style.backgroundColor = "#171E28";
        document.getElementById("playertt3").style.backgroundColor = "#171E28";
        document.getElementById("playertt4").style.backgroundColor = "#171E28";
    }
}








var VDPChuongCoW = firebase.database().ref(matchid + "/VDPChuong/CorrectOrWrong");
VDPChuongCoW.on('value', correctorwrong);

function correctorwrong(cor) {
    if (cor.val().correctorwrong == 0) {
        document.getElementById("playertt1").style.backgroundColor = "#171E28";
        document.getElementById("playertt2").style.backgroundColor = "#171E28";
        document.getElementById("playertt3").style.backgroundColor = "#171E28";
        document.getElementById("playertt4").style.backgroundColor = "#171E28";
    }
    if (cor.val().correctorwrong == 1) {
        firebase.database().ref(matchid + '/VDPChuong/Player').limitToFirst(1).once('value', function (snapshot) {
            snapshot.forEach(function (e) {
                var x = e.val().id;
                if (x == 1) {
                    document.getElementById("playertt1").style.backgroundColor = "#50C878";
                }
                if (x == 2) {
                    document.getElementById("playertt2").style.backgroundColor = "#50C878";
                }
                if (x == 3) {
                    document.getElementById("playertt3").style.backgroundColor = "#50C878";
                }
                if (x == 4) {
                    document.getElementById("playertt4").style.backgroundColor = "#50C878";
                }
            })
        })
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
                    document.getElementById("ts1khoidong").style.backgroundImage = "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)";
                    document.getElementById("tents1kd").style.color = "white";
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 2) {
                    document.getElementById("ts2khoidong").style.backgroundImage = "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)";
                    document.getElementById("tents2kd").style.color = "white";
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 3) {
                    document.getElementById("ts3khoidong").style.backgroundImage = "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)";
                    document.getElementById("tents3kd").style.color = "white";
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 4) {
                    document.getElementById("ts4khoidong").style.backgroundImage = "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)";
                    document.getElementById("tents4kd").style.color = "white";
                    document.getElementById("audio_34").play();
                    return false;
                }
            })
        })
    }

}


var namerefvd1 = firebase.database().ref(matchid + "/games/player1");
namerefvd1.on("value", nvd1);

function nvd1(names1) {
    var namerefvd2 = firebase.database().ref(matchid + "/games/player2");
    namerefvd2.on("value", nvd2);

    function nvd2(names2) {
        var namerefvd3 = firebase.database().ref(matchid + "/games/player3");
        namerefvd3.on("value", nvd3);

        function nvd3(names3) {
            var namerefvd4 = firebase.database().ref(matchid + "/games/player4");
            namerefvd4.on("value", nvd4);

            function nvd4(names4) {
                // document.getElementById("tsvd1").innerHTML = names1.val().displayName;
                // document.getElementById("tsvd2").innerHTML = names2.val().displayName;
                // document.getElementById("tsvd3").innerHTML = names3.val().displayName;
                // document.getElementById("tsvd4").innerHTML = names4.val().displayName;

            }
        }
    }
};

var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
VDChuong.on("value", chuongstatus1);

function chuongstatus1(cs1) {
    if (cs1.val().status == 0) {
        // var tsvd1 = document.getElementById("tsvd1");
        // var tsvd2 = document.getElementById("tsvd2");
        // var tsvd3 = document.getElementById("tsvd3");
        // var tsvd4 = document.getElementById("tsvd4");
        // tsvd1.style.backgroundColor = "lightblue";
        // tsvd2.style.backgroundColor = "lightblue";
        // tsvd3.style.backgroundColor = "lightblue";
        // tsvd4.style.backgroundColor = "lightblue";

        document.getElementById("ts1khoidong").style.backgroundImage = "none";
        document.getElementById("tents1kd").style.color = "#6ce3e5";

        document.getElementById("ts2khoidong").style.backgroundImage = "none";
        document.getElementById("tents2kd").style.color = "#6ce3e5";

        document.getElementById("ts3khoidong").style.backgroundImage = "none";
        document.getElementById("tents3kd").style.color = "#6ce3e5";

        document.getElementById("ts4khoidong").style.backgroundImage = "none";
        document.getElementById("tents4kd").style.color = "#6ce3e5";
    }
    if (cs1.val().status == 3) {
        // var tsvd1 = document.getElementById("tsvd1");
        // var tsvd2 = document.getElementById("tsvd2");
        // var tsvd3 = document.getElementById("tsvd3");
        // var tsvd4 = document.getElementById("tsvd4");
        // tsvd1.style.backgroundColor = "lightblue";
        // tsvd2.style.backgroundColor = "lightblue";
        // tsvd3.style.backgroundColor = "lightblue";
        // tsvd4.style.backgroundColor = "lightblue";



        document.getElementById("ts1khoidong").style.backgroundImage = "none";
        document.getElementById("tents1kd").style.color = "#6ce3e5";

        document.getElementById("ts2khoidong").style.backgroundImage = "none";
        document.getElementById("tents2kd").style.color = "#6ce3e5";

        document.getElementById("ts3khoidong").style.backgroundImage = "none";
        document.getElementById("tents3kd").style.color = "#6ce3e5";

        document.getElementById("ts4khoidong").style.backgroundImage = "none";
        document.getElementById("tents4kd").style.color = "#6ce3e5";
    }
}

var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");
VDVideoState.on('value', vidvd);
function vidvd(vd) {
    if (vd.val().video1 == 1) {
        document.getElementById("vid1").style.backgroundColor = "rgb(0, 86, 63)";
        document.getElementById("stopvid").style.backgroundColor = "rgb(191, 10, 48)";
    }
    if (vd.val().video2 == 1) {
        document.getElementById("vid2").style.backgroundColor = "rgb(0, 86, 63)";
        document.getElementById("stopvid").style.backgroundColor = "rgb(191, 10, 48)";
    }
    if (vd.val().video3 == 1) {
        document.getElementById("vid3").style.backgroundColor = "rgb(0, 86, 63)";
        document.getElementById("stopvid").style.backgroundColor = "rgb(191, 10, 48)";
    }
    if (vd.val().video4 == 1) {
        document.getElementById("vid4").style.backgroundColor = "rgb(0, 86, 63)";
        document.getElementById("stopvid").style.backgroundColor = "rgb(191, 10, 48)";
    }
    if (vd.val().video1 == 0 && vd.val().video2 == 0 && vd.val().video3 == 0 && vd.val().video4 == 0) {
        document.getElementById("vid1").style.backgroundColor = "#036768";
        document.getElementById("vid2").style.backgroundColor = "#036768";
        document.getElementById("vid3").style.backgroundColor = "#036768";
        document.getElementById("vid4").style.backgroundColor = "#036768";
        document.getElementById("stopvid").style.backgroundColor = "#036768";
    }
}


firebase.database().ref(matchid + '/VCNVAudio').on('value', audio);
function audio(au) {
    if (au.val().audio == 0) {
        document.getElementById("audiohnbtn").style.backgroundColor = "#036768";
        document.getElementById("stopaudiohnbtn").style.backgroundColor = "#036768";
    }
    if (au.val().audio == 1) {
        document.getElementById("audiohnbtn").style.backgroundColor = "#00563F";
        document.getElementById("stopaudiohnbtn").style.backgroundColor = "#BF0A30";
    }

}


var khoidongturn = firebase.database().ref(matchid + '/KDO22Turn');
khoidongturn.on('value', kdo22turnqs);
function kdo22turnqs(turnkd) {
    KDO22Turn = turnkd.val().turn;
    if (KDO22Turn == 1) {
        document.getElementById("KSO22Start").disabled = false;
        document.getElementById("KDO22L1Btn").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        document.getElementById("KDO22L2Btn").style.backgroundColor = "#036768";
        document.getElementById("KDO22L3Btn").style.backgroundColor = "#036768";

        document.getElementById("KDO22L2Btn").style.backgroundImage = 'none';
        document.getElementById("KDO22L3Btn").style.backgroundImage = 'none';

        document.getElementById("kdo22question1").style.display = "block";
        document.getElementById("kdo22question2").style.display = "none";
        document.getElementById("kdo22question3").style.display = "none";


        document.getElementById("kdo22answerts1").style.display = "block";
        document.getElementById("kdo22answerts2").style.display = "none";
        document.getElementById("kdo22answerts3").style.display = "none";


        document.getElementById("tmkdo22").innerHTML = "Lượt 1";
    }
    if (KDO22Turn == 2) {
        document.getElementById("KSO22Start").disabled = false;

        document.getElementById("KDO22L1Btn").style.backgroundColor = "#036768";
        document.getElementById("KDO22L2Btn").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
        document.getElementById("KDO22L3Btn").style.backgroundColor = "#036768";


        document.getElementById("KDO22L1Btn").style.backgroundImage = 'none';
        document.getElementById("KDO22L3Btn").style.backgroundImage = 'none';

        document.getElementById("kdo22question1").style.display = "none";
        document.getElementById("kdo22question2").style.display = "block";
        document.getElementById("kdo22question3").style.display = "none";

        document.getElementById("kdo22answerts1").style.display = "none";
        document.getElementById("kdo22answerts2").style.display = "block";
        document.getElementById("kdo22answerts3").style.display = "none";

        document.getElementById("tmkdo22").innerHTML = "Lượt 2";
    }
    if (KDO22Turn == 3) {
        document.getElementById("KSO22Start").disabled = false;


        document.getElementById("KDO22L1Btn").style.backgroundColor = "#036768";
        document.getElementById("KDO22L2Btn").style.backgroundColor = "#036768";
        document.getElementById("KDO22L3Btn").style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';

        document.getElementById("KDO22L1Btn").style.backgroundImage = 'none';
        document.getElementById("KDO22L2Btn").style.backgroundImage = 'none';

        document.getElementById("kdo22question1").style.display = "none";
        document.getElementById("kdo22question2").style.display = "none";
        document.getElementById("kdo22question3").style.display = "block";

        document.getElementById("kdo22answerts1").style.display = "none";
        document.getElementById("kdo22answerts2").style.display = "none";
        document.getElementById("kdo22answerts3").style.display = "block";

        document.getElementById("tmkdo22").innerHTML = "Lượt 3";
    }

    var khoidongcauso = firebase.database().ref(matchid + "/KDO22Causo");
    khoidongcauso.on('value', kdo22causo);
    function kdo22causo(cs) {
        var KDO22QS = firebase.database().ref(matchid + "/KDO22Question/L" + turnkd.val().turn + "/cau" + cs.val().causo);
        KDO22QS.on('value', kdo22qs);
        function kdo22qs(qs) {
            da = cs.val().causo;
            var DAKDO22QS = firebase.database().ref(matchid + "/KDO22Question/L" + turnkd.val().turn + "/dacau" + da);
            DAKDO22QS.on('value', dakdo22qs);
            function dakdo22qs(da) {
                if (cs.val().causo == 0) {
                    document.getElementById("kdo22qsnum").innerHTML = "";
                    document.getElementById("kdo22question" + turnkd.val().turn).innerHTML = "";
                    document.getElementById("kdo22answerts" + turnkd.val().turn).innerHTML = "";
                } else {
                    document.getElementById("KDO22AnswerRights").disabled = false;
                    document.getElementById("kdo22qsnum").innerHTML = "Câu " + cs.val().causo + ":";
                    document.getElementById("kdo22question" + turnkd.val().turn).innerHTML = qs.val();
                    document.getElementById("kdo22answerts" + turnkd.val().turn).innerHTML = "ĐÁP ÁN: " + da.val();
                }
            }
        }
    }
}





// var refkhoidongo22batdau = firebase.database().ref(matchid + "/phanthistatus/khoidongo22");
// refkhoidongo22batdau.on('value', kdo22status);
// function kdo22status(status) {
//     if (status.val().batdau == 1) {
//         if (KDO22Turn == 1) {
//             setTimeout(function () {
//                 document.getElementById("KDO22CorrectBtn").disabled = false;
//                 document.getElementById("KDO22WrongBtn").disabled = false;
//                 document.getElementById("KDO223sBtn").disabled = false;
//                 document.getElementById("tmkdo22").innerHTML = 30;
//             }, 3600);
//             setTimeout(function () {
//                 function Minus30Seconds() {
//                     var timer = document.getElementById("tmkdo22");
//                     var seconds = 30;
//                     setInterval(function () {
//                         if (seconds > 0) {
//                             seconds = seconds - 1;
//                             timer.innerHTML = seconds;
//                         }
//                     }, 1000)
//                 }
//                 Minus30Seconds();
//             }, 7000);
//             setTimeout(function () {
//                 document.getElementById("KDO22CorrectBtn").disabled = true;
//                 document.getElementById("KDO22WrongBtn").disabled = true;
//                 document.getElementById("KDO223sBtn").disabled = true;
//             }, 39000);
//         };
//         if (KDO22Turn == 2) {
//             setTimeout(function () {
//                 document.getElementById("KDO22CorrectBtn").disabled = false;
//                 document.getElementById("KDO22WrongBtn").disabled = false;
//                 document.getElementById("KDO223sBtn").disabled = false;
//                 document.getElementById("tmkdo22").innerHTML = 60;
//             }, 3600);
//             setTimeout(function () {
//                 function Minus60Seconds() {
//                     var timer = document.getElementById("tmkdo22");
//                     var seconds = 60;
//                     setInterval(function () {
//                         if (seconds > 0) {
//                             seconds = seconds - 1;
//                             timer.innerHTML = seconds;
//                         }
//                     }, 1000)
//                 }
//                 Minus60Seconds();
//             }, 7000);
//             setTimeout(function () {
//                 document.getElementById("KDO22CorrectBtn").disabled = true;
//                 document.getElementById("KDO22WrongBtn").disabled = true;
//                 document.getElementById("KDO223sBtn").disabled = true;
//             }, 69000);
//         }
//         if (KDO22Turn == 3) {
//             setTimeout(function () {
//                 document.getElementById("KDO22CorrectBtn").disabled = false;
//                 document.getElementById("KDO22WrongBtn").disabled = false;
//                 document.getElementById("KDO223sBtn").disabled = false;
//                 document.getElementById("tmkdo22").innerHTML = 90;
//             }, 3600);
//             setTimeout(function () {
//                 function Minus90Seconds() {
//                     var timer = document.getElementById("tmkdo22");
//                     var seconds = 90;
//                     setInterval(function () {
//                         if (seconds > 0) {
//                             seconds = seconds - 1;
//                             timer.innerHTML = seconds;
//                         }
//                     }, 1000)
//                 }
//                 Minus90Seconds();
//             }, 7000);
//             setTimeout(function () {
//                 document.getElementById("KDO22CorrectBtn").disabled = true;
//                 document.getElementById("KDO22WrongBtn").disabled = true;
//                 document.getElementById("KDO223sBtn").disabled = true;
//             }, 99000);
//         }
//     }
// }


var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');

KDO223sCountdown.on('value', kdo22countdown);
function kdo22countdown(cd) {
    var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    KDO22ChuongStatus.once('value', kdo22chuongst);
    function kdo22chuongst(cs) {
        if (cs.val().status == 0) {
            localStorage.setItem("timer3spause", 0);
            document.getElementById("KDO223sBtn").disabled = false;
        }
        if (cs.val().status == 3) {
            localStorage.setItem("timer3spause", 1);
            document.getElementById("KDO223sBtn").disabled = true;
        }
        if (cs.val().status == 1) {
            localStorage.setItem("timer3spause", 1);
            document.getElementById("KDO223sBtn").disabled = true;
        }
        if (cd.val().countdown == 1) {
            var timer = document.getElementById("tmkdo223s");
            var timerkd = document.getElementById("tmkd5s");

            timer.innerHTML = 3;
            timerkd.innerHTML = 5;
            var seconds = 3;
            var secondskd = 5;
            var countdownjs = setInterval(function () {
                if (localStorage.getItem("timer3spause") == 0) {
                    if (seconds > 0) {
                        seconds = seconds - 1;
                        timer.innerHTML = seconds;
                    }
                }
            }, 1000)
            var countdownjskd = setInterval(function () {
                if (secondskd > 0) {
                    secondskd = secondskd - 1;
                    timerkd.innerHTML = secondskd;
                }
            }, 1000)
            setTimeout(function () {
                var timer = document.getElementById("tmkdo223s");
                timer.innerHTML = 0;
                clearInterval(countdownjs);
            }, 2800)
            setTimeout(function () {
                var timerkd = document.getElementById("tmkd5s");
                timerkd.innerHTML = 0;
                clearInterval(countdownjskd);
            }, 4800)

        }
    }
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
                            document.getElementById("kdo22boxts1").style.backgroundColor = '#171E28';
                            document.getElementById("kdo22boxts1").style.backgroundImage = 'none';
                        }
                        if (x == undefined && TS2.val().disable == 0) {
                            document.getElementById("kdo22boxts2").style.backgroundColor = '#171E28';
                            document.getElementById("kdo22boxts2").style.backgroundImage = 'none';
                        }
                        if (x == undefined && TS3.val().disable == 0) {
                            document.getElementById("kdo22boxts3").style.backgroundColor = '#171E28';
                            document.getElementById("kdo22boxts3").style.backgroundImage = 'none';
                        }
                        if (x == undefined && TS4.val().disable == 0) {
                            document.getElementById("kdo22boxts4").style.backgroundColor = '#171E28';
                            document.getElementById("kdo22boxts4").style.backgroundImage = 'none';
                        }
                        if (TS1.val().disable == 1) {
                            document.getElementById("kdo22boxts1").style.backgroundColor = 'gray';
                        }
                        if (TS2.val().disable == 1) {
                            document.getElementById("kdo22boxts2").style.backgroundColor = 'gray';
                        }
                        if (TS3.val().disable == 1) {
                            document.getElementById("kdo22boxts3").style.backgroundColor = 'gray';
                        }
                        if (TS4.val().disable == 1) {
                            document.getElementById("kdo22boxts4").style.backgroundColor = 'gray';
                        }
                    })

                }
            }
        }
    }
}

var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
KDO22ChuongCorrectOrWrong.on('value', KDCorrectOrWrong);
function KDCorrectOrWrong(cor) {
    if (cor.val().correctorwrong == 1) {
    }
    if (cor.val().correctorwrong == 2) {
    }
}


var KDO22ChuongStatus1 = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
KDO22ChuongStatus1.on('value', kdo22chuongst11);
function kdo22chuongst11(cs) {
    if (cs.val().status == 1) {
        var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player').limitToFirst(1);
        KDO22ChuongPlayer.on('value', chuongplayer11);
        function chuongplayer11(cp1) {
            cp1.forEach(function (e) {
                var x = e.val().id;
                if (x == 1) {
                    document.getElementById("kdo22boxts1").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
                    document.getElementById("audio_34").currentTime = 0;
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 2) {
                    document.getElementById("kdo22boxts2").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
                    document.getElementById("audio_34").currentTime = 0;
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 3) {
                    document.getElementById("kdo22boxts3").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
                    document.getElementById("audio_34").currentTime = 0;
                    document.getElementById("audio_34").play();
                    return false;
                }
                if (x == 4) {
                    document.getElementById("kdo22boxts4").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
                    document.getElementById("audio_34").currentTime = 0;
                    document.getElementById("audio_34").play();
                    return false;
                }
            })
        }
    }
};






// var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player').limitToFirst(1);
// KDO22ChuongPlayer.on('value', chuongplayer1);
// function chuongplayer1(cp1) {
//     cp1.forEach(function (e) {
//         if (e.val().id == 1) {
//             // document.getElementById("kdo22boxts1").style.backgroundImage = 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)';
//             document.getElementById("kdo22boxts1").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
//             document.getElementById("audio_34").play();
//         }
//         if (e.val().id == 2) {
//             document.getElementById("kdo22boxts2").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
//             document.getElementById("audio_34").play();
//         }
//         if (e.val().id == 3) {
//             document.getElementById("kdo22boxts3").style.backgroundImage = 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)';
//             document.getElementById("audio_34").play();
//         }
//         if (e.val().id == 4) {
//             document.getElementById("kdo22boxts4").style.backgroundImage = 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)';
//             document.getElementById("audio_34").play();
//         }
//     })
// }
var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
KDO22ChuongStatus.on('value', kdo22chuongst1);
function kdo22chuongst1(cs) {
    if (cs.val().status == 0) {
        localStorage.setItem("timer3spause", 0);
        document.getElementById("KDO223sBtn").disabled = false;
        document.getElementById("KDO22resetChuong").disabled = true;
        document.getElementById("KDO22resetCau").disabled = true;
        document.getElementById("KDO22tieptucChuong").disabled = true;
        document.getElementById("KDO22ngungChuong").disabled = false;
    }
    if (cs.val().status == 3) {
        localStorage.setItem("timer3spause", 1);
        document.getElementById("KDO223sBtn").disabled = true;
        document.getElementById("KDO22resetChuong").disabled = false;
        document.getElementById("KDO22resetCau").disabled = false;
        document.getElementById("KDO22tieptucChuong").disabled = false;
        document.getElementById("KDO22ngungChuong").disabled = true;
    }
    if (cs.val().status == 1) {
        localStorage.setItem("timer3spause", 1);
        document.getElementById("KDO223sBtn").disabled = true;
        document.getElementById("KDO22resetChuong").disabled = true;
        document.getElementById("KDO22resetCau").disabled = true;
        document.getElementById("KDO22tieptucChuong").disabled = false;
        document.getElementById("KDO22ngungChuong").disabled = false;
    }
}

var IntroNum = firebase.database().ref(matchid + "/IntroNum");
IntroNum.on("value", INum);
function INum(num) {
    if (num.val().intronum == 0) {
        document.getElementById("IntroBtn").style.pointerEvents = "auto";
        document.getElementById("IntroKDBtn").style.pointerEvents = "auto";
        document.getElementById("IntroVCNVBtn").style.pointerEvents = "auto";
        document.getElementById("IntroTTBtn").style.pointerEvents = "auto";
        document.getElementById("IntroVDBtn").style.pointerEvents = "auto";


        document.getElementById("IntroBtn").style.color = "black";
        document.getElementById("IntroKDBtn").style.color = "black";
        document.getElementById("IntroVCNVBtn").style.color = "black";
        document.getElementById("IntroTTBtn").style.color = "black";
        document.getElementById("IntroVDBtn").style.color = "black";
    }
    if (num.val().intronum == 1) {
        document.getElementById("IntroBtn").style.pointerEvents = "auto";
        document.getElementById("IntroKDBtn").style.pointerEvents = "none";
        document.getElementById("IntroVCNVBtn").style.pointerEvents = "none";
        document.getElementById("IntroTTBtn").style.pointerEvents = "none";
        document.getElementById("IntroVDBtn").style.pointerEvents = "none";


        document.getElementById("IntroBtn").style.color = "black";
        document.getElementById("IntroKDBtn").style.color = "gray";
        document.getElementById("IntroVCNVBtn").style.color = "gray";
        document.getElementById("IntroTTBtn").style.color = "gray";
        document.getElementById("IntroVDBtn").style.color = "gray";
    }
    if (num.val().intronum == 2) {
        document.getElementById("IntroBtn").style.pointerEvents = "none";
        document.getElementById("IntroKDBtn").style.pointerEvents = "auto";
        document.getElementById("IntroVCNVBtn").style.pointerEvents = "none";
        document.getElementById("IntroTTBtn").style.pointerEvents = "none";
        document.getElementById("IntroVDBtn").style.pointerEvents = "none";


        document.getElementById("IntroBtn").style.color = "gray";
        document.getElementById("IntroKDBtn").style.color = "black";
        document.getElementById("IntroVCNVBtn").style.color = "gray";
        document.getElementById("IntroTTBtn").style.color = "gray";
        document.getElementById("IntroVDBtn").style.color = "gray";
    }
    if (num.val().intronum == 3) {
        document.getElementById("IntroBtn").style.pointerEvents = "none";
        document.getElementById("IntroKDBtn").style.pointerEvents = "none";
        document.getElementById("IntroVCNVBtn").style.pointerEvents = "auto";
        document.getElementById("IntroTTBtn").style.pointerEvents = "none";
        document.getElementById("IntroVDBtn").style.pointerEvents = "none";

        document.getElementById("IntroBtn").style.color = "gray";
        document.getElementById("IntroKDBtn").style.color = "gray";
        document.getElementById("IntroVCNVBtn").style.color = "black";
        document.getElementById("IntroTTBtn").style.color = "gray";
        document.getElementById("IntroVDBtn").style.color = "gray";
    }
    if (num.val().intronum == 4) {
        document.getElementById("IntroBtn").style.pointerEvents = "none";
        document.getElementById("IntroKDBtn").style.pointerEvents = "none";
        document.getElementById("IntroVCNVBtn").style.pointerEvents = "none";
        document.getElementById("IntroTTBtn").style.pointerEvents = "auto";
        document.getElementById("IntroVDBtn").style.pointerEvents = "none";

        document.getElementById("IntroBtn").style.color = "gray";
        document.getElementById("IntroKDBtn").style.color = "gray";
        document.getElementById("IntroVCNVBtn").style.color = "gray";
        document.getElementById("IntroTTBtn").style.color = "black";
        document.getElementById("IntroVDBtn").style.color = "gray";
    }
    if (num.val().intronum == 5) {
        document.getElementById("IntroBtn").style.pointerEvents = "none";
        document.getElementById("IntroKDBtn").style.pointerEvents = "none";
        document.getElementById("IntroVCNVBtn").style.pointerEvents = "none";
        document.getElementById("IntroTTBtn").style.pointerEvents = "none";
        document.getElementById("IntroVDBtn").style.pointerEvents = "auto";

        document.getElementById("IntroBtn").style.color = "gray";
        document.getElementById("IntroKDBtn").style.color = "gray";
        document.getElementById("IntroVCNVBtn").style.color = "gray";
        document.getElementById("IntroTTBtn").style.color = "gray";
        document.getElementById("IntroVDBtn").style.color = "black";
    }
}


var audioStatusTense = firebase.database().ref(matchid + "/Sounds");
var TenseMoments = document.getElementById("audio_extra_12");
audioStatusTense.on('value', audioTense);

function audioTense(status) {
    if (status.val().TenseMoments == true) {
        document.getElementById("TenseAudioObstacle").style.backgroundColor = "#00563F";
        document.getElementById("StopTenseAudioObstacle").style.backgroundColor = "#BF0A30";
        document.getElementById("TenseAudioAcceleration").style.backgroundColor = "#00563F";
        document.getElementById("StopTenseAudioAcceleration").style.backgroundColor = "#BF0A30";
        document.getElementById("TenseAudioFinish").style.backgroundColor = "#00563F";
        document.getElementById("StopTenseAudioFinish").style.backgroundColor = "#BF0A30";
        document.getElementById("TenseAudioAdditional").style.backgroundColor = "#00563F";
        document.getElementById("StopTenseAudioAdditional").style.backgroundColor = "#BF0A30";
    } else {
        document.getElementById("TenseAudioObstacle").style.backgroundColor = "#036768";
        document.getElementById("StopTenseAudioObstacle").style.backgroundColor = "#036768";
        document.getElementById("TenseAudioAcceleration").style.backgroundColor = "#036768";
        document.getElementById("StopTenseAudioAcceleration").style.backgroundColor = "#036768";
        document.getElementById("TenseAudioFinish").style.backgroundColor = "#036768";
        document.getElementById("StopTenseAudioFinish").style.backgroundColor = "#036768";
        document.getElementById("TenseAudioAdditional").style.backgroundColor = "#036768";
        document.getElementById("StopTenseAudioAdditional").style.backgroundColor = "#036768";
    }
}
