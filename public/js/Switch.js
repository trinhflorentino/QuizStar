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


refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
refintro = firebase.database().ref(matchid + "/intro");
reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
refkhoidongo22 = firebase.database().ref(matchid + "/gamestatus/khoidongo22");
refbanner = firebase.database().ref(matchid + "/gamestatus/banner");



refvedich.on('value', vedich);
refintro.on('value', switchintro);
refkhoidong.on('value', Data6);
refvcnv.on('value', vcnv);
reftangtoc.on('value', tangtoc);
reftongketdiem.on('value', tongketdiem);
refvedichphu.on('value', vedichphu);
refkhoidongo22.on('value', khoidongo22);
refbanner.on('value', banner);

function Data6(dt6) {
    var gokhoidong = dt6.val().start;
    if (gokhoidong == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("StartGreenScreen.html");
        } else {
            location.replace("Start.html");
        }
    } else {

    }
}

function switchintro(value) {
    if (value.val().intro == 1) {
        location.replace("Intro.html");
    } else { }
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

function tangtoc(tt) {
    if (tt.val().tangtoc == 1) {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            location.replace("AccelerationGreenScreen.html");
        } else {
            location.replace("Acceleration.html");
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