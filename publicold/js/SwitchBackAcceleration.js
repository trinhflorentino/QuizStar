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

var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
var refvcnv = firebase.database().ref(matchid + "/gamestatus/vcnv");
var refintro = firebase.database().ref(matchid + "/intro");
var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
var refkhoidongo22 = firebase.database().ref(matchid + "/gamestatus/khoidongo22");
var refbanner = firebase.database().ref(matchid + "/gamestatus/banner");

var states = {
    intro: null,
    vcnv: null,
    start: null,
    tongketdiem: null,
    vedich: null,
    vedichphu: null,
    khoidongo22: null,
    banner: null,
    tangtoc: null
};

refintro.on('value', function (snapshot) {
    states.intro = snapshot.val().intro;
    switchintro(snapshot);
    checkAllStates();
});

refvcnv.on('value', function (snapshot) {
    states.vcnv = snapshot.val().vcnv;
    vcnv(snapshot);
    checkAllStates();
});

refkhoidong.on('value', function (snapshot) {
    states.start = snapshot.val().start;
    Data6(snapshot);
    checkAllStates();
});

reftongketdiem.on('value', function (snapshot) {
    states.tongketdiem = snapshot.val().tongketdiem;
    tongketdiem(snapshot);
    checkAllStates();
});

refvedich.on('value', function (snapshot) {
    states.vedich = snapshot.val().vedich;
    vedich(snapshot);
    checkAllStates();
});

refvedichphu.on('value', function (snapshot) {
    states.vedichphu = snapshot.val().vedichphu;
    vedichphu(snapshot);
    checkAllStates();
});

refkhoidongo22.on('value', function (snapshot) {
    states.khoidongo22 = snapshot.val().khoidongo22;
    khoidongo22(snapshot);
    checkAllStates();
});

refbanner.on('value', function (snapshot) {
    states.banner = snapshot.val().banner;
    banner(snapshot);
    checkAllStates();
});

reftangtoc.on('value', function (snapshot) {
    states.tangtoc = snapshot.val().tangtoc;
    // tangtoc(snapshot);
    checkAllStates();
});

function switchintro(value) {
    if (value.val().intro == 1) {
        location.replace("Intro.html");
    }
}

function vcnv(vcnv) {
    if (vcnv.val().vcnv == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("ObstacleGreenScreen.html");
        } else {
            location.replace("Obstacle.html");
        }
    }
}

function Data6(dt6) {
    if (dt6.val().start == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("StartGreenScreen.html");
        } else {
            location.replace("Start.html");
        }
    }
}
function tongketdiem(tkd) {
    if (tkd.val().tongketdiem == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("PointSummaryGreenScreen.html");
        } else {
            location.replace("PointSummary.html");
        }
    }
}

function vedich(vd) {
    if (vd.val().vedich == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("FinishGreenScreen.html");
        } else {
            location.replace("Finish.html");
        }
    }
}

function vedichphu(vdp) {
    if (vdp.val().vedichphu == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("AdditionalGreenScreen.html");
        } else {
            location.replace("Additional.html");
        }
    }
}

function khoidongo22(kdo22) {
    if (kdo22.val().khoidongo22 == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("StartO22GreenScreen.html");
        } else {
            location.replace("StartO22.html");
        }
    }
}

function banner(banner) {
    if (banner.val().banner == 1) {
        location.replace("Banner.html");
    }
}

// function tangtoc(tt) {
//     if (tt.val().tangtoc == 1) {
//         location.replace("Acceleration.html");
//     }
// }

function checkAllStates() {
    if (states.intro === 0 && states.vcnv === 0 && states.start === 0 && states.tongketdiem === 0 && states.vedich === 0 && states.vedichphu === 0 && states.khoidongo22 === 0 && states.banner === 0 && states.tangtoc === 0) {
        location.replace("Room.html");
    }
}