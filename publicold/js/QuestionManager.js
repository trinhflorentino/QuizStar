// auth.onAuthStateChanged(function (user) {

//     if (user) {
//         user.getIdTokenResult().then(idTokenResult => {
//             user.admin = idTokenResult.claims.admin;
//             if (user.admin == true) { } else {
//                 alert("Bạn không có quyền truy cập trang này!")
//                 location.replace("Main.html")
//             }
//         })
//     }
// });



function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
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

var idhost = firebase.database().ref('/' + matchid);
idhost.on('value', hostid);
function hostid(id) {
    auth.onAuthStateChanged(function (user) {
        if (auth.currentUser.uid != id.val().hostid && auth.currentUser.uid != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1") {
            function createOverlay(color, opacity) {
                const overlay = document.createElement('div');
                overlay.classList.add('overlay');
                overlay.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                document.body.appendChild(overlay);
                return overlay;
            }

            // Example usage
            const color = { r: 18, g: 25, b: 33 }; // Blue color
            const opacity = 1; // 50% opacity
            createOverlay(color, opacity);
            alert("Bạn không phải là Host của trận/giải đấu này. Hãy tạo phòng trò chơi mới!");
            location.replace("Main.html");
        }
    })
}


var MTNM = firebase.database().ref(matchid + '/Match/Name');
var MTHS = firebase.database().ref(matchid + '/Match/Host');

//Start

var Q1DB = firebase.database().ref(matchid + '/StartQuestion/Q1DB/')
var Q2DB = firebase.database().ref(matchid + '/StartQuestion/Q2DB/')
var Q3DB = firebase.database().ref(matchid + '/StartQuestion/Q3DB/')
var Q4DB = firebase.database().ref(matchid + '/StartQuestion/Q4DB/')


// Obstacle

var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV/');
var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');


// Acceleration

var TTQ1 = firebase.database().ref(matchid + '/AccelerationQuestion/QS1/');
var TTQ2 = firebase.database().ref(matchid + '/AccelerationQuestion/QS2/');
var TTQ3 = firebase.database().ref(matchid + '/AccelerationQuestion/QS3/');
var TTQ4 = firebase.database().ref(matchid + '/AccelerationQuestion/QS4/');


// Finish

var VDG1QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/1');
var VDG1QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/2');
var VDG1QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/3');


var VDG1QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/1');
var VDG1QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/2');
var VDG1QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/3');

var VDG1QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/1');
var VDG1QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/2');
var VDG1QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/3');


var VDG2QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/1');
var VDG2QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/2');
var VDG2QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/3');

var VDG2QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/1');
var VDG2QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/2');
var VDG2QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/3');

var VDG2QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/1');
var VDG2QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/2');
var VDG2QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/3');


var VDG3QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/1');
var VDG3QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/2');
var VDG3QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/3');

var VDG3QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/1');
var VDG3QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/2');
var VDG3QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/3');

var VDG3QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/1');
var VDG3QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/2');
var VDG3QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/3');


var VDG4QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/1');
var VDG4QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/2');
var VDG4QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/3');

var VDG4QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/1');
var VDG4QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/2');
var VDG4QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/3');

var VDG4QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/1');
var VDG4QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/2');
var VDG4QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/3');

var CHP = firebase.database().ref(matchid + '/CHPQuestion/');

//StartO22

var L1KDO22 = firebase.database().ref(matchid + '/KDO22Question/L1');
var L2KDO22 = firebase.database().ref(matchid + '/KDO22Question/L2');
var L3KDO22 = firebase.database().ref(matchid + '/KDO22Question/L3');

MTNM.on('value', MatchName);

function MatchName(MN) {
    document.getElementById("matchname").value = MN.val().match;
}

Q1DB.on('value', KDTSQ);

function KDTSQ(TS) {
    document.getElementById("toan1").value = TS.val().cau1;
    document.getElementById("datoan1").value = TS.val().dacau1;
    document.getElementById("ly1").value = TS.val().cau2;
    document.getElementById("daly1").value = TS.val().dacau2;
    document.getElementById("hoa1").value = TS.val().cau3;
    document.getElementById("dahoa1").value = TS.val().dacau3;
    document.getElementById("sinh1").value = TS.val().cau4;
    document.getElementById("dasinh1").value = TS.val().dacau4;
    document.getElementById("su1").value = TS.val().cau5;
    document.getElementById("dasu1").value = TS.val().dacau5;
    document.getElementById("dia1").value = TS.val().cau6;
    document.getElementById("dadia1").value = TS.val().dacau6;
    document.getElementById("van1").value = TS.val().cau7;
    document.getElementById("davan1").value = TS.val().dacau7;
    document.getElementById("anh1").value = TS.val().cau8;
    document.getElementById("daanh1").value = TS.val().dacau8;
    document.getElementById("thethao1").value = TS.val().cau9;
    document.getElementById("dathethao1").value = TS.val().dacau9;
    document.getElementById("nghethuat1").value = TS.val().cau10;
    document.getElementById("danghethuat1").value = TS.val().dacau10;
    document.getElementById("hbc1").value = TS.val().cau11;
    document.getElementById("dahbc1").value = TS.val().dacau11;
    document.getElementById("lvk1").value = TS.val().cau12;
    document.getElementById("dalvk1").value = TS.val().dacau12;
    document.getElementById("cht11").value = TS.val().cau13;
    document.getElementById("dacht11").value = TS.val().dacau13;
    document.getElementById("cht21").value = TS.val().cau14;
    document.getElementById("dacht21").value = TS.val().dacau14;
    document.getElementById("cht31").value = TS.val().cau15;
    document.getElementById("dacht31").value = TS.val().dacau15;
    document.getElementById("cht41").value = TS.val().cau16;
    document.getElementById("dacht41").value = TS.val().dacau16;
    document.getElementById("cht51").value = TS.val().cau17;
    document.getElementById("dacht51").value = TS.val().dacau17;
    document.getElementById("cht61").value = TS.val().cau18;
    document.getElementById("dacht61").value = TS.val().dacau18;
    document.getElementById("cht71").value = TS.val().cau19;
    document.getElementById("dacht71").value = TS.val().dacau19;
    document.getElementById("cht81").value = TS.val().cau20;
    document.getElementById("dacht81").value = TS.val().dacau20;
}

Q2DB.on('value', KDTS2Q);

function KDTS2Q(TS) {
    document.getElementById("toan2").value = TS.val().cau1;
    document.getElementById("datoan2").value = TS.val().dacau1;
    document.getElementById("ly2").value = TS.val().cau2;
    document.getElementById("daly2").value = TS.val().dacau2;
    document.getElementById("hoa2").value = TS.val().cau3;
    document.getElementById("dahoa2").value = TS.val().dacau3;
    document.getElementById("sinh2").value = TS.val().cau4;
    document.getElementById("dasinh2").value = TS.val().dacau4;
    document.getElementById("su2").value = TS.val().cau5;
    document.getElementById("dasu2").value = TS.val().dacau5;
    document.getElementById("dia2").value = TS.val().cau6;
    document.getElementById("dadia2").value = TS.val().dacau6;
    document.getElementById("van2").value = TS.val().cau7;
    document.getElementById("davan2").value = TS.val().dacau7;
    document.getElementById("anh2").value = TS.val().cau8;
    document.getElementById("daanh2").value = TS.val().dacau8;
    document.getElementById("thethao2").value = TS.val().cau9;
    document.getElementById("dathethao2").value = TS.val().dacau9;
    document.getElementById("nghethuat2").value = TS.val().cau10;
    document.getElementById("danghethuat2").value = TS.val().dacau10;
    document.getElementById("hbc2").value = TS.val().cau11;
    document.getElementById("dahbc2").value = TS.val().dacau11;
    document.getElementById("lvk2").value = TS.val().cau12;
    document.getElementById("dalvk2").value = TS.val().dacau12;
    document.getElementById("cht12").value = TS.val().cau13;
    document.getElementById("dacht12").value = TS.val().dacau13;
    document.getElementById("cht22").value = TS.val().cau14;
    document.getElementById("dacht22").value = TS.val().dacau14;
    document.getElementById("cht32").value = TS.val().cau15;
    document.getElementById("dacht32").value = TS.val().dacau15;
    document.getElementById("cht42").value = TS.val().cau16;
    document.getElementById("dacht42").value = TS.val().dacau16;
    document.getElementById("cht52").value = TS.val().cau17;
    document.getElementById("dacht52").value = TS.val().dacau17;
    document.getElementById("cht62").value = TS.val().cau18;
    document.getElementById("dacht62").value = TS.val().dacau18;
    document.getElementById("cht72").value = TS.val().cau19;
    document.getElementById("dacht72").value = TS.val().dacau19;
    document.getElementById("cht82").value = TS.val().cau20;
    document.getElementById("dacht82").value = TS.val().dacau20;
}


Q3DB.on('value', KDTS3Q);

function KDTS3Q(TS) {
    document.getElementById("toan3").value = TS.val().cau1;
    document.getElementById("datoan3").value = TS.val().dacau1;
    document.getElementById("ly3").value = TS.val().cau2;
    document.getElementById("daly3").value = TS.val().dacau2;
    document.getElementById("hoa3").value = TS.val().cau3;
    document.getElementById("dahoa3").value = TS.val().dacau3;
    document.getElementById("sinh3").value = TS.val().cau4;
    document.getElementById("dasinh3").value = TS.val().dacau4;
    document.getElementById("su3").value = TS.val().cau5;
    document.getElementById("dasu3").value = TS.val().dacau5;
    document.getElementById("dia3").value = TS.val().cau6;
    document.getElementById("dadia3").value = TS.val().dacau6;
    document.getElementById("van3").value = TS.val().cau7;
    document.getElementById("davan3").value = TS.val().dacau7;
    document.getElementById("anh3").value = TS.val().cau8;
    document.getElementById("daanh3").value = TS.val().dacau8;
    document.getElementById("thethao3").value = TS.val().cau9;
    document.getElementById("dathethao3").value = TS.val().dacau9;
    document.getElementById("nghethuat3").value = TS.val().cau10;
    document.getElementById("danghethuat3").value = TS.val().dacau10;
    document.getElementById("hbc3").value = TS.val().cau11;
    document.getElementById("dahbc3").value = TS.val().dacau11;
    document.getElementById("lvk3").value = TS.val().cau12;
    document.getElementById("dalvk3").value = TS.val().dacau12;
    document.getElementById("cht13").value = TS.val().cau13;
    document.getElementById("dacht13").value = TS.val().dacau13;
    document.getElementById("cht23").value = TS.val().cau14;
    document.getElementById("dacht23").value = TS.val().dacau14;
    document.getElementById("cht33").value = TS.val().cau15;
    document.getElementById("dacht33").value = TS.val().dacau15;
    document.getElementById("cht43").value = TS.val().cau16;
    document.getElementById("dacht43").value = TS.val().dacau16;
    document.getElementById("cht53").value = TS.val().cau17;
    document.getElementById("dacht53").value = TS.val().dacau17;
    document.getElementById("cht63").value = TS.val().cau18;
    document.getElementById("dacht63").value = TS.val().dacau18;
    document.getElementById("cht73").value = TS.val().cau19;
    document.getElementById("dacht73").value = TS.val().dacau19;
    document.getElementById("cht83").value = TS.val().cau20;
    document.getElementById("dacht83").value = TS.val().dacau20;
}

Q4DB.on('value', KDTS4Q);

function KDTS4Q(TS) {
    document.getElementById("toan4").value = TS.val().cau1;
    document.getElementById("datoan4").value = TS.val().dacau1;
    document.getElementById("ly4").value = TS.val().cau2;
    document.getElementById("daly4").value = TS.val().dacau2;
    document.getElementById("hoa4").value = TS.val().cau3;
    document.getElementById("dahoa4").value = TS.val().dacau3;
    document.getElementById("sinh4").value = TS.val().cau4;
    document.getElementById("dasinh4").value = TS.val().dacau4;
    document.getElementById("su4").value = TS.val().cau5;
    document.getElementById("dasu4").value = TS.val().dacau5;
    document.getElementById("dia4").value = TS.val().cau6;
    document.getElementById("dadia4").value = TS.val().dacau6;
    document.getElementById("van4").value = TS.val().cau7;
    document.getElementById("davan4").value = TS.val().dacau7;
    document.getElementById("anh4").value = TS.val().cau8;
    document.getElementById("daanh4").value = TS.val().dacau8;
    document.getElementById("thethao4").value = TS.val().cau9;
    document.getElementById("dathethao4").value = TS.val().dacau9;
    document.getElementById("nghethuat4").value = TS.val().cau10;
    document.getElementById("danghethuat4").value = TS.val().dacau10;
    document.getElementById("hbc4").value = TS.val().cau11;
    document.getElementById("dahbc4").value = TS.val().dacau11;
    document.getElementById("lvk4").value = TS.val().cau12;
    document.getElementById("dalvk4").value = TS.val().dacau12;
    document.getElementById("cht14").value = TS.val().cau13;
    document.getElementById("dacht14").value = TS.val().dacau13;
    document.getElementById("cht24").value = TS.val().cau14;
    document.getElementById("dacht24").value = TS.val().dacau14;
    document.getElementById("cht34").value = TS.val().cau15;
    document.getElementById("dacht34").value = TS.val().dacau15;
    document.getElementById("cht44").value = TS.val().cau16;
    document.getElementById("dacht44").value = TS.val().dacau16;
    document.getElementById("cht54").value = TS.val().cau17;
    document.getElementById("dacht54").value = TS.val().dacau17;
    document.getElementById("cht64").value = TS.val().cau18;
    document.getElementById("dacht64").value = TS.val().dacau18;
    document.getElementById("cht74").value = TS.val().cau19;
    document.getElementById("dacht74").value = TS.val().dacau19;
    document.getElementById("cht84").value = TS.val().cau20;
    document.getElementById("dacht84").value = TS.val().dacau20;
}

CNVDB.on('value', CNV);

function CNV(CNVA) {
    document.getElementById("cnv").value = CNVA.val().cnv;
}

CNVHN1.on('value', CNVHN1Q);

function CNVHN1Q(CNVA) {
    document.getElementById("chhn1").value = CNVA.val().cauhoi;
    document.getElementById("ctlhn1").value = CNVA.val().dapan;
}

CNVHN2.on('value', CNVHN2Q);

function CNVHN2Q(CNVA) {
    document.getElementById("chhn2").value = CNVA.val().cauhoi;
    document.getElementById("ctlhn2").value = CNVA.val().dapan;
}


CNVHN3.on('value', CNVHN3Q);

function CNVHN3Q(CNVA) {
    document.getElementById("chhn3").value = CNVA.val().cauhoi;
    document.getElementById("ctlhn3").value = CNVA.val().dapan;
}


CNVHN4.on('value', CNVHN4Q);

function CNVHN4Q(CNVA) {
    document.getElementById("chhn4").value = CNVA.val().cauhoi;
    document.getElementById("ctlhn4").value = CNVA.val().dapan;
}

CNVHNTT.on('value', CNVHNTTQ);

function CNVHNTTQ(CNVA) {
    document.getElementById("chhntt").value = CNVA.val().cauhoi;
    document.getElementById("ctlhntt").value = CNVA.val().dapan;
}



TTQ1.on('value', TTCH1);

function TTCH1(CHTT) {
    document.getElementById("chtt1").value = CHTT.val().cauhoi;
    document.getElementById("ctltt1").value = CHTT.val().dapan;
}

TTQ2.on('value', TTCH2);

function TTCH2(CHTT) {
    document.getElementById("chtt2").value = CHTT.val().cauhoi;
    document.getElementById("ctltt2").value = CHTT.val().dapan;
}


TTQ3.on('value', TTCH3);

function TTCH3(CHTT) {
    document.getElementById("chtt3").value = CHTT.val().cauhoi;
    document.getElementById("ctltt3").value = CHTT.val().dapan;
}

TTQ4.on('value', TTCH4);

function TTCH4(CHTT) {
    document.getElementById("chtt4").value = CHTT.val().cauhoi;
    document.getElementById("ctltt4").value = CHTT.val().dapan;
}



VDG1QP10C1.on('value', FG1QP10C1);

function FG1QP10C1(CHVD) {
    document.getElementById("g1chvd11").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd11").value = CHVD.val().dapan;
}

VDG1QP10C2.on('value', FG1QP10C2);

function FG1QP10C2(CHVD) {
    document.getElementById("g1chvd12").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd12").value = CHVD.val().dapan;
}

VDG1QP10C3.on('value', FG1QP10C3);

function FG1QP10C3(CHVD) {
    document.getElementById("g1chvd13").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd13").value = CHVD.val().dapan;
}

VDG1QP20C1.on('value', FG1QP20C1);

function FG1QP20C1(CHVD) {
    document.getElementById("g1chvd21").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd21").value = CHVD.val().dapan;
}

VDG1QP20C2.on('value', FG1QP20C2);

function FG1QP20C2(CHVD) {
    document.getElementById("g1chvd22").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd22").value = CHVD.val().dapan;
}

VDG1QP20C3.on('value', FG1QP20C3);

function FG1QP20C3(CHVD) {
    document.getElementById("g1chvd23").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd23").value = CHVD.val().dapan;
}

VDG1QP30C1.on('value', FG1QP30C1);

function FG1QP30C1(CHVD) {
    document.getElementById("g1chvd31").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd31").value = CHVD.val().dapan;
}

VDG1QP30C2.on('value', FG1QP30C2);

function FG1QP30C2(CHVD) {
    document.getElementById("g1chvd32").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd32").value = CHVD.val().dapan;
}

VDG1QP30C3.on('value', FG1QP30C3);

function FG1QP30C3(CHVD) {
    document.getElementById("g1chvd33").value = CHVD.val().cauhoi;
    document.getElementById("g1ctlvd33").value = CHVD.val().dapan;
}



VDG2QP10C1.on('value', FG2QP10C1);

function FG2QP10C1(CHVD) {
    document.getElementById("g2chvd11").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd11").value = CHVD.val().dapan;
}

VDG2QP10C2.on('value', FG2QP10C2);

function FG2QP10C2(CHVD) {
    document.getElementById("g2chvd12").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd12").value = CHVD.val().dapan;
}

VDG2QP10C3.on('value', FG2QP10C3);

function FG2QP10C3(CHVD) {
    document.getElementById("g2chvd13").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd13").value = CHVD.val().dapan;
}

VDG2QP20C1.on('value', FG2QP20C1);

function FG2QP20C1(CHVD) {
    document.getElementById("g2chvd21").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd21").value = CHVD.val().dapan;
}

VDG2QP20C2.on('value', FG2QP20C2);

function FG2QP20C2(CHVD) {
    document.getElementById("g2chvd22").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd22").value = CHVD.val().dapan;
}

VDG2QP20C3.on('value', FG2QP20C3);

function FG2QP20C3(CHVD) {
    document.getElementById("g2chvd23").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd23").value = CHVD.val().dapan;
}

VDG2QP30C1.on('value', FG2QP30C1);

function FG2QP30C1(CHVD) {
    document.getElementById("g2chvd31").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd31").value = CHVD.val().dapan;
}

VDG2QP30C2.on('value', FG2QP30C2);

function FG2QP30C2(CHVD) {
    document.getElementById("g2chvd32").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd32").value = CHVD.val().dapan;
}

VDG2QP30C3.on('value', FG2QP30C3);

function FG2QP30C3(CHVD) {
    document.getElementById("g2chvd33").value = CHVD.val().cauhoi;
    document.getElementById("g2ctlvd33").value = CHVD.val().dapan;
}







VDG3QP10C1.on('value', FG3QP10C1);

function FG3QP10C1(CHVD) {
    document.getElementById("g3chvd11").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd11").value = CHVD.val().dapan;
}

VDG3QP10C2.on('value', FG3QP10C2);

function FG3QP10C2(CHVD) {
    document.getElementById("g3chvd12").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd12").value = CHVD.val().dapan;
}

VDG3QP10C3.on('value', FG3QP10C3);

function FG3QP10C3(CHVD) {
    document.getElementById("g3chvd13").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd13").value = CHVD.val().dapan;
}

VDG3QP20C1.on('value', FG3QP20C1);

function FG3QP20C1(CHVD) {
    document.getElementById("g3chvd21").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd21").value = CHVD.val().dapan;
}

VDG3QP20C2.on('value', FG3QP20C2);

function FG3QP20C2(CHVD) {
    document.getElementById("g3chvd22").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd22").value = CHVD.val().dapan;
}

VDG3QP20C3.on('value', FG3QP20C3);

function FG3QP20C3(CHVD) {
    document.getElementById("g3chvd23").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd23").value = CHVD.val().dapan;
}

VDG3QP30C1.on('value', FG3QP30C1);

function FG3QP30C1(CHVD) {
    document.getElementById("g3chvd31").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd31").value = CHVD.val().dapan;
}

VDG3QP30C2.on('value', FG3QP30C2);

function FG3QP30C2(CHVD) {
    document.getElementById("g3chvd32").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd32").value = CHVD.val().dapan;
}

VDG3QP30C3.on('value', FG3QP30C3);

function FG3QP30C3(CHVD) {
    document.getElementById("g3chvd33").value = CHVD.val().cauhoi;
    document.getElementById("g3ctlvd33").value = CHVD.val().dapan;
}






VDG4QP10C1.on('value', FG4QP10C1);

function FG4QP10C1(CHVD) {
    document.getElementById("g4chvd11").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd11").value = CHVD.val().dapan;
}

VDG4QP10C2.on('value', FG4QP10C2);

function FG4QP10C2(CHVD) {
    document.getElementById("g4chvd12").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd12").value = CHVD.val().dapan;
}

VDG4QP10C3.on('value', FG4QP10C3);

function FG4QP10C3(CHVD) {
    document.getElementById("g4chvd13").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd13").value = CHVD.val().dapan;
}

VDG4QP20C1.on('value', FG4QP20C1);

function FG4QP20C1(CHVD) {
    document.getElementById("g4chvd21").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd21").value = CHVD.val().dapan;
}

VDG4QP20C2.on('value', FG4QP20C2);

function FG4QP20C2(CHVD) {
    document.getElementById("g4chvd22").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd22").value = CHVD.val().dapan;
}

VDG4QP20C3.on('value', FG4QP20C3);

function FG4QP20C3(CHVD) {
    document.getElementById("g4chvd23").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd23").value = CHVD.val().dapan;
}

VDG4QP30C1.on('value', FG4QP30C1);

function FG4QP30C1(CHVD) {
    document.getElementById("g4chvd31").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd31").value = CHVD.val().dapan;
}

VDG4QP30C2.on('value', FG4QP30C2);

function FG4QP30C2(CHVD) {
    document.getElementById("g4chvd32").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd32").value = CHVD.val().dapan;
}

VDG4QP30C3.on('value', FG4QP30C3);

function FG4QP30C3(CHVD) {
    document.getElementById("g4chvd33").value = CHVD.val().cauhoi;
    document.getElementById("g4ctlvd33").value = CHVD.val().dapan;
}

CHP.on('value', CHPQuestion);

function CHPQuestion(CHP) {
    document.getElementById("chvdp1").value = CHP.val().cau1;
    document.getElementById("chvdp2").value = CHP.val().cau2;
    document.getElementById("chvdp3").value = CHP.val().cau3;
    document.getElementById("chvdp4").value = CHP.val().cau4;
    document.getElementById("chvdp5").value = CHP.val().cau5;
    document.getElementById("chvdp6").value = CHP.val().cau6;
    document.getElementById("chvdp7").value = CHP.val().cau7;
    document.getElementById("chvdp8").value = CHP.val().cau8;
    document.getElementById("chvdp9").value = CHP.val().cau9;
    document.getElementById("chvdp10").value = CHP.val().cau10;


    document.getElementById("ctlvdp1").value = CHP.val().dacau1;
    document.getElementById("ctlvdp2").value = CHP.val().dacau2;
    document.getElementById("ctlvdp3").value = CHP.val().dacau3;
    document.getElementById("ctlvdp4").value = CHP.val().dacau4;
    document.getElementById("ctlvdp5").value = CHP.val().dacau5;
    document.getElementById("ctlvdp6").value = CHP.val().dacau6;
    document.getElementById("ctlvdp7").value = CHP.val().dacau7;
    document.getElementById("ctlvdp8").value = CHP.val().dacau8;
    document.getElementById("ctlvdp9").value = CHP.val().dacau9;
    document.getElementById("ctlvdp10").value = CHP.val().dacau10;
}

L1KDO22.on('value', KDO22L1Question);

function KDO22L1Question(KDO22) {
    document.getElementById("kdo22l1c1").value = KDO22.val().cau1;
    document.getElementById("kdo22l1c2").value = KDO22.val().cau2;
    document.getElementById("kdo22l1c3").value = KDO22.val().cau3;
    document.getElementById("kdo22l1c4").value = KDO22.val().cau4;
    document.getElementById("kdo22l1c5").value = KDO22.val().cau5;
    document.getElementById("kdo22l1c6").value = KDO22.val().cau6;
    document.getElementById("kdo22l1c7").value = KDO22.val().cau7;
    document.getElementById("kdo22l1c8").value = KDO22.val().cau8;
    document.getElementById("kdo22l1c9").value = KDO22.val().cau9;
    document.getElementById("kdo22l1c10").value = KDO22.val().cau10;
    document.getElementById("kdo22l1c11").value = KDO22.val().cau11;
    document.getElementById("kdo22l1c12").value = KDO22.val().cau12;
    document.getElementById("kdo22l1c13").value = KDO22.val().cau13;
    document.getElementById("kdo22l1c14").value = KDO22.val().cau14;
    document.getElementById("kdo22l1c15").value = KDO22.val().cau15;


    document.getElementById("dakdo22l1c1").value = KDO22.val().dacau1;
    document.getElementById("dakdo22l1c2").value = KDO22.val().dacau2;
    document.getElementById("dakdo22l1c3").value = KDO22.val().dacau3;
    document.getElementById("dakdo22l1c4").value = KDO22.val().dacau4;
    document.getElementById("dakdo22l1c5").value = KDO22.val().dacau5;
    document.getElementById("dakdo22l1c6").value = KDO22.val().dacau6;
    document.getElementById("dakdo22l1c7").value = KDO22.val().dacau7;
    document.getElementById("dakdo22l1c8").value = KDO22.val().dacau8;
    document.getElementById("dakdo22l1c9").value = KDO22.val().dacau9;
    document.getElementById("dakdo22l1c10").value = KDO22.val().dacau10;
    document.getElementById("dakdo22l1c11").value = KDO22.val().dacau11;
    document.getElementById("dakdo22l1c12").value = KDO22.val().dacau12;
    document.getElementById("dakdo22l1c13").value = KDO22.val().dacau13;
    document.getElementById("dakdo22l1c14").value = KDO22.val().dacau14;
    document.getElementById("dakdo22l1c15").value = KDO22.val().dacau15;

}

L2KDO22.on('value', KDO22L2Question);


function KDO22L2Question(KDO22) {
    document.getElementById("kdo22l2c1").value = KDO22.val().cau1;
    document.getElementById("kdo22l2c2").value = KDO22.val().cau2;
    document.getElementById("kdo22l2c3").value = KDO22.val().cau3;
    document.getElementById("kdo22l2c4").value = KDO22.val().cau4;
    document.getElementById("kdo22l2c5").value = KDO22.val().cau5;
    document.getElementById("kdo22l2c6").value = KDO22.val().cau6;
    document.getElementById("kdo22l2c7").value = KDO22.val().cau7;
    document.getElementById("kdo22l2c8").value = KDO22.val().cau8;
    document.getElementById("kdo22l2c9").value = KDO22.val().cau9;
    document.getElementById("kdo22l2c10").value = KDO22.val().cau10;
    document.getElementById("kdo22l2c11").value = KDO22.val().cau11;
    document.getElementById("kdo22l2c12").value = KDO22.val().cau12;
    document.getElementById("kdo22l2c13").value = KDO22.val().cau13;
    document.getElementById("kdo22l2c14").value = KDO22.val().cau14;
    document.getElementById("kdo22l2c15").value = KDO22.val().cau15;
    document.getElementById("kdo22l2c16").value = KDO22.val().cau16;
    document.getElementById("kdo22l2c17").value = KDO22.val().cau17;
    document.getElementById("kdo22l2c18").value = KDO22.val().cau18;
    document.getElementById("kdo22l2c19").value = KDO22.val().cau19;
    document.getElementById("kdo22l2c20").value = KDO22.val().cau20;
    document.getElementById("kdo22l2c21").value = KDO22.val().cau21;
    document.getElementById("kdo22l2c22").value = KDO22.val().cau22;
    document.getElementById("kdo22l2c23").value = KDO22.val().cau23;
    document.getElementById("kdo22l2c24").value = KDO22.val().cau24;
    document.getElementById("kdo22l2c25").value = KDO22.val().cau25;


    document.getElementById("dakdo22l2c1").value = KDO22.val().dacau1;
    document.getElementById("dakdo22l2c2").value = KDO22.val().dacau2;
    document.getElementById("dakdo22l2c3").value = KDO22.val().dacau3;
    document.getElementById("dakdo22l2c4").value = KDO22.val().dacau4;
    document.getElementById("dakdo22l2c5").value = KDO22.val().dacau5;
    document.getElementById("dakdo22l2c6").value = KDO22.val().dacau6;
    document.getElementById("dakdo22l2c7").value = KDO22.val().dacau7;
    document.getElementById("dakdo22l2c8").value = KDO22.val().dacau8;
    document.getElementById("dakdo22l2c9").value = KDO22.val().dacau9;
    document.getElementById("dakdo22l2c10").value = KDO22.val().dacau10;
    document.getElementById("dakdo22l2c11").value = KDO22.val().dacau11;
    document.getElementById("dakdo22l2c12").value = KDO22.val().dacau12;
    document.getElementById("dakdo22l2c13").value = KDO22.val().dacau13;
    document.getElementById("dakdo22l2c14").value = KDO22.val().dacau14;
    document.getElementById("dakdo22l2c15").value = KDO22.val().dacau15;
    document.getElementById("dakdo22l2c16").value = KDO22.val().dacau16;
    document.getElementById("dakdo22l2c17").value = KDO22.val().dacau17;
    document.getElementById("dakdo22l2c18").value = KDO22.val().dacau18;
    document.getElementById("dakdo22l2c19").value = KDO22.val().dacau19;
    document.getElementById("dakdo22l2c20").value = KDO22.val().dacau20;
    document.getElementById("dakdo22l2c21").value = KDO22.val().dacau21;
    document.getElementById("dakdo22l2c22").value = KDO22.val().dacau22;
    document.getElementById("dakdo22l2c23").value = KDO22.val().dacau23;
    document.getElementById("dakdo22l2c24").value = KDO22.val().dacau24;
    document.getElementById("dakdo22l2c25").value = KDO22.val().dacau25;

}


L3KDO22.on('value', KDO22L3Question);


function KDO22L3Question(KDO22) {
    document.getElementById("kdo22l3c1").value = KDO22.val().cau1;
    document.getElementById("kdo22l3c2").value = KDO22.val().cau2;
    document.getElementById("kdo22l3c3").value = KDO22.val().cau3;
    document.getElementById("kdo22l3c4").value = KDO22.val().cau4;
    document.getElementById("kdo22l3c5").value = KDO22.val().cau5;
    document.getElementById("kdo22l3c6").value = KDO22.val().cau6;
    document.getElementById("kdo22l3c7").value = KDO22.val().cau7;
    document.getElementById("kdo22l3c8").value = KDO22.val().cau8;
    document.getElementById("kdo22l3c9").value = KDO22.val().cau9;
    document.getElementById("kdo22l3c10").value = KDO22.val().cau10;
    document.getElementById("kdo22l3c11").value = KDO22.val().cau11;
    document.getElementById("kdo22l3c12").value = KDO22.val().cau12;
    document.getElementById("kdo22l3c13").value = KDO22.val().cau13;
    document.getElementById("kdo22l3c14").value = KDO22.val().cau14;
    document.getElementById("kdo22l3c15").value = KDO22.val().cau15;
    document.getElementById("kdo22l3c16").value = KDO22.val().cau16;
    document.getElementById("kdo22l3c17").value = KDO22.val().cau17;
    document.getElementById("kdo22l3c18").value = KDO22.val().cau18;
    document.getElementById("kdo22l3c19").value = KDO22.val().cau19;
    document.getElementById("kdo22l3c20").value = KDO22.val().cau20;
    document.getElementById("kdo22l3c21").value = KDO22.val().cau21;
    document.getElementById("kdo22l3c22").value = KDO22.val().cau22;
    document.getElementById("kdo22l3c23").value = KDO22.val().cau23;
    document.getElementById("kdo22l3c24").value = KDO22.val().cau24;
    document.getElementById("kdo22l3c25").value = KDO22.val().cau25;
    document.getElementById("kdo22l3c26").value = KDO22.val().cau26;
    document.getElementById("kdo22l3c27").value = KDO22.val().cau27;
    document.getElementById("kdo22l3c28").value = KDO22.val().cau28;
    document.getElementById("kdo22l3c29").value = KDO22.val().cau29;
    document.getElementById("kdo22l3c30").value = KDO22.val().cau30;
    document.getElementById("kdo22l3c31").value = KDO22.val().cau31;
    document.getElementById("kdo22l3c32").value = KDO22.val().cau32;
    document.getElementById("kdo22l3c33").value = KDO22.val().cau33;
    document.getElementById("kdo22l3c34").value = KDO22.val().cau34;
    document.getElementById("kdo22l3c35").value = KDO22.val().cau35;


    document.getElementById("dakdo22l3c1").value = KDO22.val().dacau1;
    document.getElementById("dakdo22l3c2").value = KDO22.val().dacau2;
    document.getElementById("dakdo22l3c3").value = KDO22.val().dacau3;
    document.getElementById("dakdo22l3c4").value = KDO22.val().dacau4;
    document.getElementById("dakdo22l3c5").value = KDO22.val().dacau5;
    document.getElementById("dakdo22l3c6").value = KDO22.val().dacau6;
    document.getElementById("dakdo22l3c7").value = KDO22.val().dacau7;
    document.getElementById("dakdo22l3c8").value = KDO22.val().dacau8;
    document.getElementById("dakdo22l3c9").value = KDO22.val().dacau9;
    document.getElementById("dakdo22l3c10").value = KDO22.val().dacau10;
    document.getElementById("dakdo22l3c11").value = KDO22.val().dacau11;
    document.getElementById("dakdo22l3c12").value = KDO22.val().dacau12;
    document.getElementById("dakdo22l3c13").value = KDO22.val().dacau13;
    document.getElementById("dakdo22l3c14").value = KDO22.val().dacau14;
    document.getElementById("dakdo22l3c15").value = KDO22.val().dacau15;
    document.getElementById("dakdo22l3c16").value = KDO22.val().dacau16;
    document.getElementById("dakdo22l3c17").value = KDO22.val().dacau17;
    document.getElementById("dakdo22l3c18").value = KDO22.val().dacau18;
    document.getElementById("dakdo22l3c19").value = KDO22.val().dacau19;
    document.getElementById("dakdo22l3c20").value = KDO22.val().dacau20;
    document.getElementById("dakdo22l3c21").value = KDO22.val().dacau21;
    document.getElementById("dakdo22l3c22").value = KDO22.val().dacau22;
    document.getElementById("dakdo22l3c23").value = KDO22.val().dacau23;
    document.getElementById("dakdo22l3c24").value = KDO22.val().dacau24;
    document.getElementById("dakdo22l3c25").value = KDO22.val().dacau25;
    document.getElementById("dakdo22l3c26").value = KDO22.val().dacau26;
    document.getElementById("dakdo22l3c27").value = KDO22.val().dacau27;
    document.getElementById("dakdo22l3c28").value = KDO22.val().dacau28;
    document.getElementById("dakdo22l3c29").value = KDO22.val().dacau29;
    document.getElementById("dakdo22l3c30").value = KDO22.val().dacau30;
    document.getElementById("dakdo22l3c31").value = KDO22.val().dacau31;
    document.getElementById("dakdo22l3c32").value = KDO22.val().dacau32;
    document.getElementById("dakdo22l3c33").value = KDO22.val().dacau33;
    document.getElementById("dakdo22l3c34").value = KDO22.val().dacau34;
    document.getElementById("dakdo22l3c35").value = KDO22.val().dacau35;

}







function uploadGeneralInfo() {



    var MTNM = firebase.database().ref(matchid + '/Match/Name');
    var MTHS = firebase.database().ref(matchid + '/Match/Host');
    var MTNM1 = firebase.database().ref(matchid + '/');
    var MTHS1 = firebase.database().ref(matchid + '/');


    var matchname = document.getElementById("matchname").value;
    var hostname = localStorage.getItem("name");
    var idhost = localStorage.getItem("iduser");
    var p = document.getElementById("notify-uploadinfo");

    var updatematchname = {
        match: matchname,
    }

    var newmatchname = {
        matchname: matchname,
    }
    // var updatehostname = {
    //     host: hostname,
    // }
    // var updatehostid = {
    //     hostid : idhost,
    // }

    MTNM.set(updatematchname);
    // MTHS.set(updatehostname);
    MTNM1.update(updatematchname);
    firebase.database().ref('/MatchList/' + matchid).update(newmatchname);
    // MTHS1.update(updatehostname);
    // MTHS1.update(updatehostid);
    Notification("Cập nhật tên phòng trò chơi thành công")
}


function uploadQuestion() {




    var Q1DB = firebase.database().ref(matchid + '/StartQuestion/Q1DB/')

    const QDB1 = document.querySelector('#goi1form');
    const toan = QDB1['toan1'].value;
    const ly = QDB1['ly1'].value;
    const hoa = QDB1['hoa1'].value;
    const sinh = QDB1['sinh1'].value;
    const su = QDB1['su1'].value;
    const dia = QDB1['dia1'].value;
    const van = QDB1['van1'].value;
    const anh = QDB1['anh1'].value;
    const thethao = QDB1['thethao1'].value;
    const nghethuat = QDB1['nghethuat1'].value;
    const hbc = QDB1['hbc1'].value;
    const lvk = QDB1['lvk1'].value;
    const cht1 = QDB1['cht11'].value;
    const cht2 = QDB1['cht21'].value;
    const cht3 = QDB1['cht31'].value;
    const cht4 = QDB1['cht41'].value;
    const cht5 = QDB1['cht51'].value;
    const cht6 = QDB1['cht61'].value;
    const cht7 = QDB1['cht71'].value;
    const cht8 = QDB1['cht81'].value;

    const datoan = QDB1['datoan1'].value;
    const daly = QDB1['daly1'].value;
    const dahoa = QDB1['dahoa1'].value;
    const dasinh = QDB1['dasinh1'].value;
    const dasu = QDB1['dasu1'].value;
    const dadia = QDB1['dadia1'].value;
    const davan = QDB1['davan1'].value;
    const daanh = QDB1['daanh1'].value;
    const dathethao = QDB1['dathethao1'].value;
    const danghethuat = QDB1['danghethuat1'].value;
    const dahbc = QDB1['dahbc1'].value;
    const dalvk = QDB1['dalvk1'].value;
    const dacht1 = QDB1['dacht11'].value;
    const dacht2 = QDB1['dacht21'].value;
    const dacht3 = QDB1['dacht31'].value;
    const dacht4 = QDB1['dacht41'].value;
    const dacht5 = QDB1['dacht51'].value;
    const dacht6 = QDB1['dacht61'].value;
    const dacht7 = QDB1['dacht71'].value;
    const dacht8 = QDB1['dacht81'].value;

    var QuestionData1 = {
        cau1: toan,
        cau2: ly,
        cau3: hoa,
        cau4: sinh,
        cau5: su,
        cau6: dia,
        cau7: van,
        cau8: anh,
        cau9: thethao,
        cau10: nghethuat,
        cau11: hbc,
        cau12: lvk,
        cau13: cht1,
        cau14: cht2,
        cau15: cht3,
        cau16: cht4,
        cau17: cht5,
        cau18: cht6,
        cau19: cht7,
        cau20: cht8,


        dacau1: datoan,
        dacau2: daly,
        dacau3: dahoa,
        dacau4: dasinh,
        dacau5: dasu,
        dacau6: dadia,
        dacau7: davan,
        dacau8: daanh,
        dacau9: dathethao,
        dacau10: danghethuat,
        dacau11: dahbc,
        dacau12: dalvk,
        dacau13: dacht1,
        dacau14: dacht2,
        dacau15: dacht3,
        dacau16: dacht4,
        dacau17: dacht5,
        dacau18: dacht6,
        dacau19: dacht7,
        dacau20: dacht8,

    }
    Q1DB.set(QuestionData1);
    document.getElementById("notify-uploadkdgch1").innerHTML = "TẢI LÊN CÂU HỎI THÀNH CÔNG";
    return false;
};

function uploadQuestion2() {


    var Q2DB = firebase.database().ref(matchid + '/StartQuestion/Q2DB/');
    const QDB1 = document.querySelector('#goi2form');
    const toan = QDB1['toan2'].value;
    const ly = QDB1['ly2'].value;
    const hoa = QDB1['hoa2'].value;
    const sinh = QDB1['sinh2'].value;
    const su = QDB1['su2'].value;
    const dia = QDB1['dia2'].value;
    const van = QDB1['van2'].value;
    const anh = QDB1['anh2'].value;
    const thethao = QDB1['thethao2'].value;
    const nghethuat = QDB1['nghethuat2'].value;
    const hbc = QDB1['hbc2'].value;
    const lvk = QDB1['lvk2'].value;
    const cht1 = QDB1['cht12'].value;
    const cht2 = QDB1['cht22'].value;
    const cht3 = QDB1['cht32'].value;
    const cht4 = QDB1['cht42'].value;
    const cht5 = QDB1['cht52'].value;
    const cht6 = QDB1['cht62'].value;
    const cht7 = QDB1['cht72'].value;
    const cht8 = QDB1['cht82'].value;

    const datoan = QDB1['datoan2'].value;
    const daly = QDB1['daly2'].value;
    const dahoa = QDB1['dahoa2'].value;
    const dasinh = QDB1['dasinh2'].value;
    const dasu = QDB1['dasu2'].value;
    const dadia = QDB1['dadia2'].value;
    const davan = QDB1['davan2'].value;
    const daanh = QDB1['daanh2'].value;
    const dathethao = QDB1['dathethao2'].value;
    const danghethuat = QDB1['danghethuat2'].value;
    const dahbc = QDB1['dahbc2'].value;
    const dalvk = QDB1['dalvk2'].value;
    const dacht1 = QDB1['dacht12'].value;
    const dacht2 = QDB1['dacht22'].value;
    const dacht3 = QDB1['dacht32'].value;
    const dacht4 = QDB1['dacht42'].value;
    const dacht5 = QDB1['dacht52'].value;
    const dacht6 = QDB1['dacht62'].value;
    const dacht7 = QDB1['dacht72'].value;
    const dacht8 = QDB1['dacht82'].value;

    var QuestionData2 = {
        cau1: toan,
        cau2: ly,
        cau3: hoa,
        cau4: sinh,
        cau5: su,
        cau6: dia,
        cau7: van,
        cau8: anh,
        cau9: thethao,
        cau10: nghethuat,
        cau11: hbc,
        cau12: lvk,
        cau13: cht1,
        cau14: cht2,
        cau15: cht3,
        cau16: cht4,
        cau17: cht5,
        cau18: cht6,
        cau19: cht7,
        cau20: cht8,

        dacau1: datoan,
        dacau2: daly,
        dacau3: dahoa,
        dacau4: dasinh,
        dacau5: dasu,
        dacau6: dadia,
        dacau7: davan,
        dacau8: daanh,
        dacau9: dathethao,
        dacau10: danghethuat,
        dacau11: dahbc,
        dacau12: dalvk,
        dacau13: dacht1,
        dacau14: dacht2,
        dacau15: dacht3,
        dacau16: dacht4,
        dacau17: dacht5,
        dacau18: dacht6,
        dacau19: dacht7,
        dacau20: dacht8,

    }
    Q2DB.set(QuestionData2);
    document.getElementById("notify-uploadkdgch2").innerHTML = "TẢI LÊN CÂU HỎI THÀNH CÔNG";
    return false;

};

function uploadQuestion3() {



    var Q3DB = firebase.database().ref(matchid + '/StartQuestion/Q3DB/');
    const QDB1 = document.querySelector('#goi3form');
    const toan = QDB1['toan3'].value;
    const ly = QDB1['ly3'].value;
    const hoa = QDB1['hoa3'].value;
    const sinh = QDB1['sinh3'].value;
    const su = QDB1['su3'].value;
    const dia = QDB1['dia3'].value;
    const van = QDB1['van3'].value;
    const anh = QDB1['anh3'].value;
    const thethao = QDB1['thethao3'].value;
    const nghethuat = QDB1['nghethuat3'].value;
    const hbc = QDB1['hbc3'].value;
    const lvk = QDB1['lvk3'].value;
    const cht1 = QDB1['cht13'].value;
    const cht2 = QDB1['cht23'].value;
    const cht3 = QDB1['cht33'].value;
    const cht4 = QDB1['cht43'].value;
    const cht5 = QDB1['cht53'].value;
    const cht6 = QDB1['cht63'].value;
    const cht7 = QDB1['cht73'].value;
    const cht8 = QDB1['cht83'].value;

    const datoan = QDB1['datoan3'].value;
    const daly = QDB1['daly3'].value;
    const dahoa = QDB1['dahoa3'].value;
    const dasinh = QDB1['dasinh3'].value;
    const dasu = QDB1['dasu3'].value;
    const dadia = QDB1['dadia3'].value;
    const davan = QDB1['davan3'].value;
    const daanh = QDB1['daanh3'].value;
    const dathethao = QDB1['dathethao3'].value;
    const danghethuat = QDB1['danghethuat3'].value;
    const dahbc = QDB1['dahbc3'].value;
    const dalvk = QDB1['dalvk3'].value;
    const dacht1 = QDB1['dacht13'].value;
    const dacht2 = QDB1['dacht23'].value;
    const dacht3 = QDB1['dacht33'].value;
    const dacht4 = QDB1['dacht43'].value;
    const dacht5 = QDB1['dacht53'].value;
    const dacht6 = QDB1['dacht63'].value;
    const dacht7 = QDB1['dacht73'].value;
    const dacht8 = QDB1['dacht83'].value;

    var QuestionData3 = {
        cau1: toan,
        cau2: ly,
        cau3: hoa,
        cau4: sinh,
        cau5: su,
        cau6: dia,
        cau7: van,
        cau8: anh,
        cau9: thethao,
        cau10: nghethuat,
        cau11: hbc,
        cau12: lvk,
        cau13: cht1,
        cau14: cht2,
        cau15: cht3,
        cau16: cht4,
        cau17: cht5,
        cau18: cht6,
        cau19: cht7,
        cau20: cht8,

        dacau1: datoan,
        dacau2: daly,
        dacau3: dahoa,
        dacau4: dasinh,
        dacau5: dasu,
        dacau6: dadia,
        dacau7: davan,
        dacau8: daanh,
        dacau9: dathethao,
        dacau10: danghethuat,
        dacau11: dahbc,
        dacau12: dalvk,
        dacau13: dacht1,
        dacau14: dacht2,
        dacau15: dacht3,
        dacau16: dacht4,
        dacau17: dacht5,
        dacau18: dacht6,
        dacau19: dacht7,
        dacau20: dacht8,


    }
    Q3DB.set(QuestionData3);
    document.getElementById("notify-uploadkdgch3").innerHTML = "TẢI LÊN CÂU HỎI THÀNH CÔNG";
    return false;


};

function uploadQuestion4() {


    var Q4DB = firebase.database().ref(matchid + '/StartQuestion/Q4DB/');

    const QDB1 = document.querySelector('#goi4form');
    const toan = QDB1['toan4'].value;
    const ly = QDB1['ly4'].value;
    const hoa = QDB1['hoa4'].value;
    const sinh = QDB1['sinh4'].value;
    const su = QDB1['su4'].value;
    const dia = QDB1['dia4'].value;
    const van = QDB1['van4'].value;
    const anh = QDB1['anh4'].value;
    const thethao = QDB1['thethao4'].value;
    const nghethuat = QDB1['nghethuat4'].value;
    const hbc = QDB1['hbc4'].value;
    const lvk = QDB1['lvk4'].value;
    const cht1 = QDB1['cht14'].value;
    const cht2 = QDB1['cht24'].value;
    const cht3 = QDB1['cht34'].value;
    const cht4 = QDB1['cht44'].value;
    const cht5 = QDB1['cht54'].value;
    const cht6 = QDB1['cht64'].value;
    const cht7 = QDB1['cht74'].value;
    const cht8 = QDB1['cht84'].value;

    const datoan = QDB1['datoan4'].value;
    const daly = QDB1['daly4'].value;
    const dahoa = QDB1['dahoa4'].value;
    const dasinh = QDB1['dasinh4'].value;
    const dasu = QDB1['dasu4'].value;
    const dadia = QDB1['dadia4'].value;
    const davan = QDB1['davan4'].value;
    const daanh = QDB1['daanh4'].value;
    const dathethao = QDB1['dathethao4'].value;
    const danghethuat = QDB1['danghethuat4'].value;
    const dahbc = QDB1['dahbc4'].value;
    const dalvk = QDB1['dalvk4'].value;
    const dacht1 = QDB1['dacht14'].value;
    const dacht2 = QDB1['dacht24'].value;
    const dacht3 = QDB1['dacht34'].value;
    const dacht4 = QDB1['dacht44'].value;
    const dacht5 = QDB1['dacht54'].value;
    const dacht6 = QDB1['dacht64'].value;
    const dacht7 = QDB1['dacht74'].value;
    const dacht8 = QDB1['dacht84'].value;

    var QuestionData4 = {
        cau1: toan,
        cau2: ly,
        cau3: hoa,
        cau4: sinh,
        cau5: su,
        cau6: dia,
        cau7: van,
        cau8: anh,
        cau9: thethao,
        cau10: nghethuat,
        cau11: hbc,
        cau12: lvk,
        cau13: cht1,
        cau14: cht2,
        cau15: cht3,
        cau16: cht4,
        cau17: cht5,
        cau18: cht6,
        cau19: cht7,
        cau20: cht8,


        dacau1: datoan,
        dacau2: daly,
        dacau3: dahoa,
        dacau4: dasinh,
        dacau5: dasu,
        dacau6: dadia,
        dacau7: davan,
        dacau8: daanh,
        dacau9: dathethao,
        dacau10: danghethuat,
        dacau11: dahbc,
        dacau12: dalvk,
        dacau13: dacht1,
        dacau14: dacht2,
        dacau15: dacht3,
        dacau16: dacht4,
        dacau17: dacht5,
        dacau18: dacht6,
        dacau19: dacht7,
        dacau20: dacht8,
    }
    Q4DB.set(QuestionData4);
    document.getElementById("notify-uploadkdgch4").innerHTML = "TẢI LÊN CÂU HỎI THÀNH CÔNG";
    return false;
};

function uploadCNV() {

    var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV/');

    const getcnv = document.querySelector('#cnvform');
    const cnvs = getcnv['cnv'].value.toUpperCase();
    var cnvud = {
        cnv: cnvs,
    }
    CNVDB.set(cnvud);
    Notification("Cập nhật Chướng ngại vật thành công")
};

function uploadCNVKeyType() {
    var CNVKT = firebase.database().ref(matchid + '/VCNVQuestion/CNVKeyType/');

    const keytypeform = document.querySelector('#cnvkeytype');

    var keytypeup = {
        type: keytypeform['keytype'].value,
    }
    CNVKT.set(keytypeup);
    Notification("Cập nhật kiểu hiển thị Chướng ngại vật thành công")
}

function uploadHN() {
    var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
    var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
    var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
    var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
    var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');


    const getHN = document.querySelector('#hangngang');
    const chhangngang1 = getHN['chhn1'].value;
    const ctlhangngang1 = getHN['ctlhn1'].value.toUpperCase();
    const chhangngang2 = getHN['chhn2'].value;
    const ctlhangngang2 = getHN['ctlhn2'].value.toUpperCase();
    const chhangngang3 = getHN['chhn3'].value;
    const ctlhangngang3 = getHN['ctlhn3'].value.toUpperCase();
    const chhangngang4 = getHN['chhn4'].value;
    const ctlhangngang4 = getHN['ctlhn4'].value.toUpperCase();
    const chhangngangtt = getHN['chhntt'].value;
    const ctlhangngangtt = getHN['ctlhntt'].value.toUpperCase();
    var hn1 = {
        cauhoi: chhangngang1,
        dapan: ctlhangngang1,
    }
    var hn2 = {
        cauhoi: chhangngang2,
        dapan: ctlhangngang2,
    }
    var hn3 = {
        cauhoi: chhangngang3,
        dapan: ctlhangngang3,
    }
    var hn4 = {
        cauhoi: chhangngang4,
        dapan: ctlhangngang4,
    }
    var hntt = {
        cauhoi: chhangngangtt,
        dapan: ctlhangngangtt,
    }
    CNVHN1.set(hn1);
    CNVHN2.set(hn2);
    CNVHN3.set(hn3);
    CNVHN4.set(hn4);
    CNVHNTT.set(hntt);
    Notification("Cập nhật câu hỏi phần thi Vượt chướng ngại vật thành công")
}

function uploadTT() {
    var TTQ1 = firebase.database().ref(matchid + '/AccelerationQuestion/QS1/');
    var TTQ2 = firebase.database().ref(matchid + '/AccelerationQuestion/QS2/');
    var TTQ3 = firebase.database().ref(matchid + '/AccelerationQuestion/QS3/');
    var TTQ4 = firebase.database().ref(matchid + '/AccelerationQuestion/QS4/');


    const getTT = document.querySelector('#tangtoc');
    const chtangtoc1 = getTT['chtt1'].value;
    const ctltangtoc1 = getTT['ctltt1'].value;
    const chtangtoc2 = getTT['chtt2'].value;
    const ctltangtoc2 = getTT['ctltt2'].value;
    const chtangtoc3 = getTT['chtt3'].value;
    const ctltangtoc3 = getTT['ctltt3'].value;
    const chtangtoc4 = getTT['chtt4'].value;
    const ctltangtoc4 = getTT['ctltt4'].value;
    var tt1 = {
        cauhoi: chtangtoc1,
        dapan: ctltangtoc1
    }
    var tt2 = {
        cauhoi: chtangtoc2,
        dapan: ctltangtoc2,
    }
    var tt3 = {
        cauhoi: chtangtoc3,
        dapan: ctltangtoc3,
    }
    var tt4 = {
        cauhoi: chtangtoc4,
        dapan: ctltangtoc4,
    }
    TTQ1.set(tt1);
    TTQ2.set(tt2);
    TTQ3.set(tt3);
    TTQ4.set(tt4);
    Notification("Cập nhật câu hỏi phần thi Tăng tốc thành công");
};


function uploadVD() {


    var VDG1QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/1');
    var VDG1QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/2');
    var VDG1QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/3');


    var VDG1QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/1');
    var VDG1QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/2');
    var VDG1QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/3');

    var VDG1QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/1');
    var VDG1QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/2');
    var VDG1QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/3');


    var VDG2QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/1');
    var VDG2QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/2');
    var VDG2QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/3');

    var VDG2QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/1');
    var VDG2QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/2');
    var VDG2QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/3');

    var VDG2QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/1');
    var VDG2QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/2');
    var VDG2QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/3');


    var VDG3QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/1');
    var VDG3QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/2');
    var VDG3QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/3');

    var VDG3QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/1');
    var VDG3QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/2');
    var VDG3QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/3');

    var VDG3QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/1');
    var VDG3QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/2');
    var VDG3QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/3');


    var VDG4QP10C1 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/1');
    var VDG4QP10C2 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/2');
    var VDG4QP10C3 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/3');

    var VDG4QP20C1 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/1');
    var VDG4QP20C2 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/2');
    var VDG4QP20C3 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/3');

    var VDG4QP30C1 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/1');
    var VDG4QP30C2 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/2');
    var VDG4QP30C3 = firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/3');



    const getVD = document.querySelector('#vedich');

    //Gói câu hỏi 1

    const g1chvd11 = getVD['g1chvd11'].value;
    const g1ctlvd11 = getVD['g1ctlvd11'].value;
    const g1chvd12 = getVD['g1chvd12'].value;
    const g1ctlvd12 = getVD['g1ctlvd12'].value;
    const g1chvd13 = getVD['g1chvd13'].value;
    const g1ctlvd13 = getVD['g1ctlvd13'].value;
    var G1QP10C1 = {
        cauhoi: g1chvd11,
        dapan: g1ctlvd11,
    }
    var G1QP10C2 = {
        cauhoi: g1chvd12,
        dapan: g1ctlvd12,
    }
    var G1QP10C3 = {
        cauhoi: g1chvd13,
        dapan: g1ctlvd13,
    }


    const g1chvd21 = getVD['g1chvd21'].value;
    const g1ctlvd21 = getVD['g1ctlvd21'].value;
    const g1chvd22 = getVD['g1chvd22'].value;
    const g1ctlvd22 = getVD['g1ctlvd22'].value;
    const g1chvd23 = getVD['g1chvd23'].value;
    const g1ctlvd23 = getVD['g1ctlvd23'].value;
    var G1QP20C1 = {
        cauhoi: g1chvd21,
        dapan: g1ctlvd21,
    }
    var G1QP20C2 = {
        cauhoi: g1chvd22,
        dapan: g1ctlvd22,
    }
    var G1QP20C3 = {
        cauhoi: g1chvd23,
        dapan: g1ctlvd23,
    }


    const g1chvd31 = getVD['g1chvd31'].value;
    const g1ctlvd31 = getVD['g1ctlvd31'].value;
    const g1chvd32 = getVD['g1chvd32'].value;
    const g1ctlvd32 = getVD['g1ctlvd32'].value;
    const g1chvd33 = getVD['g1chvd33'].value;
    const g1ctlvd33 = getVD['g1ctlvd33'].value;
    var G1QP30C1 = {
        cauhoi: g1chvd31,
        dapan: g1ctlvd31,
    }
    var G1QP30C2 = {
        cauhoi: g1chvd32,
        dapan: g1ctlvd32,
    }
    var G1QP30C3 = {
        cauhoi: g1chvd33,
        dapan: g1ctlvd33,
    }
    VDG1QP10C1.set(G1QP10C1);
    VDG1QP10C2.set(G1QP10C2);
    VDG1QP10C3.set(G1QP10C3);

    VDG1QP20C1.set(G1QP20C1);
    VDG1QP20C2.set(G1QP20C2);
    VDG1QP20C3.set(G1QP20C3);

    VDG1QP30C1.set(G1QP30C1);
    VDG1QP30C2.set(G1QP30C2);
    VDG1QP30C3.set(G1QP30C3);



    //Gói câu hỏi 2

    const g2chvd11 = getVD['g2chvd11'].value;
    const g2ctlvd11 = getVD['g2ctlvd11'].value;
    const g2chvd12 = getVD['g2chvd12'].value;
    const g2ctlvd12 = getVD['g2ctlvd12'].value;
    const g2chvd13 = getVD['g2chvd13'].value;
    const g2ctlvd13 = getVD['g2ctlvd13'].value;
    var G2QP10C1 = {
        cauhoi: g2chvd11,
        dapan: g2ctlvd11,
    }
    var G2QP10C2 = {
        cauhoi: g2chvd12,
        dapan: g2ctlvd12,
    }
    var G2QP10C3 = {
        cauhoi: g2chvd13,
        dapan: g2ctlvd13,
    }


    const g2chvd21 = getVD['g2chvd21'].value;
    const g2ctlvd21 = getVD['g2ctlvd21'].value;
    const g2chvd22 = getVD['g2chvd22'].value;
    const g2ctlvd22 = getVD['g2ctlvd22'].value;
    const g2chvd23 = getVD['g2chvd23'].value;
    const g2ctlvd23 = getVD['g2ctlvd23'].value;
    var G2QP20C1 = {
        cauhoi: g2chvd21,
        dapan: g2ctlvd21,
    }
    var G2QP20C2 = {
        cauhoi: g2chvd22,
        dapan: g2ctlvd22,
    }
    var G2QP20C3 = {
        cauhoi: g2chvd23,
        dapan: g2ctlvd23,
    }


    const g2chvd31 = getVD['g2chvd31'].value;
    const g2ctlvd31 = getVD['g2ctlvd31'].value;
    const g2chvd32 = getVD['g2chvd32'].value;
    const g2ctlvd32 = getVD['g2ctlvd32'].value;
    const g2chvd33 = getVD['g2chvd33'].value;
    const g2ctlvd33 = getVD['g2ctlvd33'].value;
    var G2QP30C1 = {
        cauhoi: g2chvd31,
        dapan: g2ctlvd31,
    }
    var G2QP30C2 = {
        cauhoi: g2chvd32,
        dapan: g2ctlvd32,
    }
    var G2QP30C3 = {
        cauhoi: g2chvd33,
        dapan: g2ctlvd33,
    }
    VDG2QP10C1.set(G2QP10C1);
    VDG2QP10C2.set(G2QP10C2);
    VDG2QP10C3.set(G2QP10C3);

    VDG2QP20C1.set(G2QP20C1);
    VDG2QP20C2.set(G2QP20C2);
    VDG2QP20C3.set(G2QP20C3);

    VDG2QP30C1.set(G2QP30C1);
    VDG2QP30C2.set(G2QP30C2);
    VDG2QP30C3.set(G2QP30C3);


    //Gói câu hỏi 3

    const g3chvd11 = getVD['g3chvd11'].value;
    const g3ctlvd11 = getVD['g3ctlvd11'].value;
    const g3chvd12 = getVD['g3chvd12'].value;
    const g3ctlvd12 = getVD['g3ctlvd12'].value;
    const g3chvd13 = getVD['g3chvd13'].value;
    const g3ctlvd13 = getVD['g3ctlvd13'].value;
    var G3QP10C1 = {
        cauhoi: g3chvd11,
        dapan: g3ctlvd11,
    }
    var G3QP10C2 = {
        cauhoi: g3chvd12,
        dapan: g3ctlvd12,
    }
    var G3QP10C3 = {
        cauhoi: g3chvd13,
        dapan: g3ctlvd13,
    }


    const g3chvd21 = getVD['g3chvd21'].value;
    const g3ctlvd21 = getVD['g3ctlvd21'].value;
    const g3chvd22 = getVD['g3chvd22'].value;
    const g3ctlvd22 = getVD['g3ctlvd22'].value;
    const g3chvd23 = getVD['g3chvd23'].value;
    const g3ctlvd23 = getVD['g3ctlvd23'].value;
    var G3QP20C1 = {
        cauhoi: g3chvd21,
        dapan: g3ctlvd21,
    }
    var G3QP20C2 = {
        cauhoi: g3chvd22,
        dapan: g3ctlvd22,
    }
    var G3QP20C3 = {
        cauhoi: g3chvd23,
        dapan: g3ctlvd23,
    }


    const g3chvd31 = getVD['g3chvd31'].value;
    const g3ctlvd31 = getVD['g3ctlvd31'].value;
    const g3chvd32 = getVD['g3chvd32'].value;
    const g3ctlvd32 = getVD['g3ctlvd32'].value;
    const g3chvd33 = getVD['g3chvd33'].value;
    const g3ctlvd33 = getVD['g3ctlvd33'].value;
    var G3QP30C1 = {
        cauhoi: g3chvd31,
        dapan: g3ctlvd31,
    }
    var G3QP30C2 = {
        cauhoi: g3chvd32,
        dapan: g3ctlvd32,
    }
    var G3QP30C3 = {
        cauhoi: g3chvd33,
        dapan: g3ctlvd33,
    }
    VDG3QP10C1.set(G3QP10C1);
    VDG3QP10C2.set(G3QP10C2);
    VDG3QP10C3.set(G3QP10C3);

    VDG3QP20C1.set(G3QP20C1);
    VDG3QP20C2.set(G3QP20C2);
    VDG3QP20C3.set(G3QP20C3);

    VDG3QP30C1.set(G3QP30C1);
    VDG3QP30C2.set(G3QP30C2);
    VDG3QP30C3.set(G3QP30C3);



    //Gói câu hỏi 4

    const g4chvd11 = getVD['g4chvd11'].value;
    const g4ctlvd11 = getVD['g4ctlvd11'].value;
    const g4chvd12 = getVD['g4chvd12'].value;
    const g4ctlvd12 = getVD['g4ctlvd12'].value;
    const g4chvd13 = getVD['g4chvd13'].value;
    const g4ctlvd13 = getVD['g4ctlvd13'].value;
    var G4QP10C1 = {
        cauhoi: g4chvd11,
        dapan: g4ctlvd11,
    }
    var G4QP10C2 = {
        cauhoi: g4chvd12,
        dapan: g4ctlvd12,
    }
    var G4QP10C3 = {
        cauhoi: g4chvd13,
        dapan: g4ctlvd13,
    }
    const g4chvd21 = getVD['g4chvd21'].value;
    const g4ctlvd21 = getVD['g4ctlvd21'].value;
    const g4chvd22 = getVD['g4chvd22'].value;
    const g4ctlvd22 = getVD['g4ctlvd22'].value;
    const g4chvd23 = getVD['g4chvd23'].value;
    const g4ctlvd23 = getVD['g4ctlvd23'].value;
    var G4QP20C1 = {
        cauhoi: g4chvd21,
        dapan: g4ctlvd21,
    }
    var G4QP20C2 = {
        cauhoi: g4chvd22,
        dapan: g4ctlvd22,
    }
    var G4QP20C3 = {
        cauhoi: g4chvd23,
        dapan: g4ctlvd23,
    }


    const g4chvd31 = getVD['g4chvd31'].value;
    const g4ctlvd31 = getVD['g4ctlvd31'].value;
    const g4chvd32 = getVD['g4chvd32'].value;
    const g4ctlvd32 = getVD['g4ctlvd32'].value;
    const g4chvd33 = getVD['g4chvd33'].value;
    const g4ctlvd33 = getVD['g4ctlvd33'].value;
    var G4QP30C1 = {
        cauhoi: g4chvd31,
        dapan: g4ctlvd31,
    }
    var G4QP30C2 = {
        cauhoi: g4chvd32,
        dapan: g4ctlvd32,
    }
    var G4QP30C3 = {
        cauhoi: g4chvd33,
        dapan: g4ctlvd33,
    }
    VDG4QP10C1.set(G4QP10C1);
    VDG4QP10C2.set(G4QP10C2);
    VDG4QP10C3.set(G4QP10C3);

    VDG4QP20C1.set(G4QP20C1);
    VDG4QP20C2.set(G4QP20C2);
    VDG4QP20C3.set(G4QP20C3);

    VDG4QP30C1.set(G4QP30C1);
    VDG4QP30C2.set(G4QP30C2);
    VDG4QP30C3.set(G4QP30C3);

    Notification("Cập nhật câu hỏi phần thi Về đích thành công");
};

function uploadCHP() {


    const CHP = document.querySelector('#chpqs');
    const cau01 = CHP['chvdp1'].value;
    const cau02 = CHP['chvdp2'].value;
    const cau03 = CHP['chvdp3'].value;
    const cau04 = CHP['chvdp4'].value;
    const cau05 = CHP['chvdp5'].value;
    const cau06 = CHP['chvdp6'].value;
    const cau07 = CHP['chvdp7'].value;
    const cau08 = CHP['chvdp8'].value;
    const cau09 = CHP['chvdp9'].value;
    const cau10 = CHP['chvdp10'].value;

    const dacau01 = CHP['ctlvdp1'].value;
    const dacau02 = CHP['ctlvdp2'].value;
    const dacau03 = CHP['ctlvdp3'].value;
    const dacau04 = CHP['ctlvdp4'].value;
    const dacau05 = CHP['ctlvdp5'].value;
    const dacau06 = CHP['ctlvdp6'].value;
    const dacau07 = CHP['ctlvdp7'].value;
    const dacau08 = CHP['ctlvdp8'].value;
    const dacau09 = CHP['ctlvdp9'].value;
    const dacau10 = CHP['ctlvdp10'].value;

    var QS = {
        cau1: cau01,
        cau2: cau02,
        cau3: cau03,
        cau4: cau04,
        cau5: cau05,
        cau6: cau06,
        cau7: cau07,
        cau8: cau08,
        cau9: cau09,
        cau10: cau10,

        dacau1: dacau01,
        dacau2: dacau02,
        dacau3: dacau03,
        dacau4: dacau04,
        dacau5: dacau05,
        dacau6: dacau06,
        dacau7: dacau07,
        dacau8: dacau08,
        dacau9: dacau09,
        dacau10: dacau10,
    }

    var CHPQuestion = firebase.database().ref(matchid + '/CHPQuestion/');
    CHPQuestion.set(QS);
    Notification("Cập nhật câu hỏi phần thi Câu hỏi phụ thành công");
}

function uploadL1KDO22Question() {
    const KDO22L1 = document.querySelector('#kdo22qsl1');
    const cau01 = KDO22L1['kdo22l1c1'].value;
    const cau02 = KDO22L1['kdo22l1c2'].value;
    const cau03 = KDO22L1['kdo22l1c3'].value;
    const cau04 = KDO22L1['kdo22l1c4'].value;
    const cau05 = KDO22L1['kdo22l1c5'].value;
    const cau06 = KDO22L1['kdo22l1c6'].value;
    const cau07 = KDO22L1['kdo22l1c7'].value;
    const cau08 = KDO22L1['kdo22l1c8'].value;
    const cau09 = KDO22L1['kdo22l1c9'].value;
    const cau10 = KDO22L1['kdo22l1c10'].value;
    const cau11 = KDO22L1['kdo22l1c11'].value;
    const cau12 = KDO22L1['kdo22l1c12'].value;
    const cau13 = KDO22L1['kdo22l1c13'].value;
    const cau14 = KDO22L1['kdo22l1c14'].value;
    const cau15 = KDO22L1['kdo22l1c15'].value;

    const dacau01 = KDO22L1['dakdo22l1c1'].value;
    const dacau02 = KDO22L1['dakdo22l1c2'].value;
    const dacau03 = KDO22L1['dakdo22l1c3'].value;
    const dacau04 = KDO22L1['dakdo22l1c4'].value;
    const dacau05 = KDO22L1['dakdo22l1c5'].value;
    const dacau06 = KDO22L1['dakdo22l1c6'].value;
    const dacau07 = KDO22L1['dakdo22l1c7'].value;
    const dacau08 = KDO22L1['dakdo22l1c8'].value;
    const dacau09 = KDO22L1['dakdo22l1c9'].value;
    const dacau10 = KDO22L1['dakdo22l1c10'].value;
    const dacau11 = KDO22L1['dakdo22l1c11'].value;
    const dacau12 = KDO22L1['dakdo22l1c12'].value;
    const dacau13 = KDO22L1['dakdo22l1c13'].value;
    const dacau14 = KDO22L1['dakdo22l1c14'].value;
    const dacau15 = KDO22L1['dakdo22l1c15'].value;

    var QS = {
        cau1: cau01,
        cau2: cau02,
        cau3: cau03,
        cau4: cau04,
        cau5: cau05,
        cau6: cau06,
        cau7: cau07,
        cau8: cau08,
        cau9: cau09,
        cau10: cau10,
        cau11: cau11,
        cau12: cau12,
        cau13: cau13,
        cau14: cau14,
        cau15: cau15,

        dacau1: dacau01,
        dacau2: dacau02,
        dacau3: dacau03,
        dacau4: dacau04,
        dacau5: dacau05,
        dacau6: dacau06,
        dacau7: dacau07,
        dacau8: dacau08,
        dacau9: dacau09,
        dacau10: dacau10,
        dacau11: dacau11,
        dacau12: dacau12,
        dacau13: dacau13,
        dacau14: dacau14,
        dacau15: dacau15,
    }
    var KDO22QuestionL1 = firebase.database().ref(matchid + '/KDO22Question/L1');
    KDO22QuestionL1.set(QS);
    Notification("Đã tải lên câu hỏi Khởi động (Lượt 1) thành công");
}

function uploadL2KDO22Question() {
    const KDO22L2 = document.querySelector('#kdo22qsl2');
    const cau01 = KDO22L2['kdo22l2c1'].value;
    const cau02 = KDO22L2['kdo22l2c2'].value;
    const cau03 = KDO22L2['kdo22l2c3'].value;
    const cau04 = KDO22L2['kdo22l2c4'].value;
    const cau05 = KDO22L2['kdo22l2c5'].value;
    const cau06 = KDO22L2['kdo22l2c6'].value;
    const cau07 = KDO22L2['kdo22l2c7'].value;
    const cau08 = KDO22L2['kdo22l2c8'].value;
    const cau09 = KDO22L2['kdo22l2c9'].value;
    const cau10 = KDO22L2['kdo22l2c10'].value;
    const cau11 = KDO22L2['kdo22l2c11'].value;
    const cau12 = KDO22L2['kdo22l2c12'].value;
    const cau13 = KDO22L2['kdo22l2c13'].value;
    const cau14 = KDO22L2['kdo22l2c14'].value;
    const cau15 = KDO22L2['kdo22l2c15'].value;
    const cau16 = KDO22L2['kdo22l2c16'].value;
    const cau17 = KDO22L2['kdo22l2c17'].value;
    const cau18 = KDO22L2['kdo22l2c18'].value;
    const cau19 = KDO22L2['kdo22l2c19'].value;
    const cau20 = KDO22L2['kdo22l2c20'].value;
    const cau21 = KDO22L2['kdo22l2c21'].value;
    const cau22 = KDO22L2['kdo22l2c22'].value;
    const cau23 = KDO22L2['kdo22l2c23'].value;
    const cau24 = KDO22L2['kdo22l2c24'].value;
    const cau25 = KDO22L2['kdo22l2c25'].value;


    const dacau01 = KDO22L2['dakdo22l2c1'].value;
    const dacau02 = KDO22L2['dakdo22l2c2'].value;
    const dacau03 = KDO22L2['dakdo22l2c3'].value;
    const dacau04 = KDO22L2['dakdo22l2c4'].value;
    const dacau05 = KDO22L2['dakdo22l2c5'].value;
    const dacau06 = KDO22L2['dakdo22l2c6'].value;
    const dacau07 = KDO22L2['dakdo22l2c7'].value;
    const dacau08 = KDO22L2['dakdo22l2c8'].value;
    const dacau09 = KDO22L2['dakdo22l2c9'].value;
    const dacau10 = KDO22L2['dakdo22l2c10'].value;
    const dacau11 = KDO22L2['dakdo22l2c11'].value;
    const dacau12 = KDO22L2['dakdo22l2c12'].value;
    const dacau13 = KDO22L2['dakdo22l2c13'].value;
    const dacau14 = KDO22L2['dakdo22l2c14'].value;
    const dacau15 = KDO22L2['dakdo22l2c15'].value;
    const dacau16 = KDO22L2['dakdo22l2c16'].value;
    const dacau17 = KDO22L2['dakdo22l2c17'].value;
    const dacau18 = KDO22L2['dakdo22l2c18'].value;
    const dacau19 = KDO22L2['dakdo22l2c19'].value;
    const dacau20 = KDO22L2['dakdo22l2c20'].value;
    const dacau21 = KDO22L2['dakdo22l2c21'].value;
    const dacau22 = KDO22L2['dakdo22l2c22'].value;
    const dacau23 = KDO22L2['dakdo22l2c23'].value;
    const dacau24 = KDO22L2['dakdo22l2c24'].value;
    const dacau25 = KDO22L2['dakdo22l2c25'].value;

    var QS = {
        cau1: cau01,
        cau2: cau02,
        cau3: cau03,
        cau4: cau04,
        cau5: cau05,
        cau6: cau06,
        cau7: cau07,
        cau8: cau08,
        cau9: cau09,
        cau10: cau10,
        cau11: cau11,
        cau12: cau12,
        cau13: cau13,
        cau14: cau14,
        cau15: cau15,
        cau16: cau16,
        cau17: cau17,
        cau18: cau18,
        cau19: cau19,
        cau20: cau20,
        cau21: cau21,
        cau22: cau22,
        cau23: cau23,
        cau24: cau24,
        cau25: cau25,

        dacau1: dacau01,
        dacau2: dacau02,
        dacau3: dacau03,
        dacau4: dacau04,
        dacau5: dacau05,
        dacau6: dacau06,
        dacau7: dacau07,
        dacau8: dacau08,
        dacau9: dacau09,
        dacau10: dacau10,
        dacau11: dacau11,
        dacau12: dacau12,
        dacau13: dacau13,
        dacau14: dacau14,
        dacau15: dacau15,
        dacau16: dacau16,
        dacau17: dacau17,
        dacau18: dacau18,
        dacau19: dacau19,
        dacau20: dacau20,
        dacau21: dacau21,
        dacau22: dacau22,
        dacau23: dacau23,
        dacau24: dacau24,
        dacau25: dacau25,
    }
    var KDO22QuestionL2 = firebase.database().ref(matchid + '/KDO22Question/L2');
    KDO22QuestionL2.set(QS);
    Notification("Đã tải lên câu hỏi Khởi động (Lượt 2) thành công");
}

function uploadL3KDO22Question() {
    const KDO22L3 = document.querySelector('#kdo22qsl3');
    const cau01 = KDO22L3['kdo22l3c1'].value;
    const cau02 = KDO22L3['kdo22l3c2'].value;
    const cau03 = KDO22L3['kdo22l3c3'].value;
    const cau04 = KDO22L3['kdo22l3c4'].value;
    const cau05 = KDO22L3['kdo22l3c5'].value;
    const cau06 = KDO22L3['kdo22l3c6'].value;
    const cau07 = KDO22L3['kdo22l3c7'].value;
    const cau08 = KDO22L3['kdo22l3c8'].value;
    const cau09 = KDO22L3['kdo22l3c9'].value;
    const cau10 = KDO22L3['kdo22l3c10'].value;
    const cau11 = KDO22L3['kdo22l3c11'].value;
    const cau12 = KDO22L3['kdo22l3c12'].value;
    const cau13 = KDO22L3['kdo22l3c13'].value;
    const cau14 = KDO22L3['kdo22l3c14'].value;
    const cau15 = KDO22L3['kdo22l3c15'].value;
    const cau16 = KDO22L3['kdo22l3c16'].value;
    const cau17 = KDO22L3['kdo22l3c17'].value;
    const cau18 = KDO22L3['kdo22l3c18'].value;
    const cau19 = KDO22L3['kdo22l3c19'].value;
    const cau20 = KDO22L3['kdo22l3c20'].value;
    const cau21 = KDO22L3['kdo22l3c21'].value;
    const cau22 = KDO22L3['kdo22l3c22'].value;
    const cau23 = KDO22L3['kdo22l3c23'].value;
    const cau24 = KDO22L3['kdo22l3c24'].value;
    const cau25 = KDO22L3['kdo22l3c25'].value;
    const cau26 = KDO22L3['kdo22l3c26'].value;
    const cau27 = KDO22L3['kdo22l3c27'].value;
    const cau28 = KDO22L3['kdo22l3c28'].value;
    const cau29 = KDO22L3['kdo22l3c29'].value;
    const cau30 = KDO22L3['kdo22l3c30'].value;
    const cau31 = KDO22L3['kdo22l3c31'].value;
    const cau32 = KDO22L3['kdo22l3c32'].value;
    const cau33 = KDO22L3['kdo22l3c33'].value;
    const cau34 = KDO22L3['kdo22l3c34'].value;
    const cau35 = KDO22L3['kdo22l3c35'].value;


    const dacau01 = KDO22L3['dakdo22l3c1'].value;
    const dacau02 = KDO22L3['dakdo22l3c2'].value;
    const dacau03 = KDO22L3['dakdo22l3c3'].value;
    const dacau04 = KDO22L3['dakdo22l3c4'].value;
    const dacau05 = KDO22L3['dakdo22l3c5'].value;
    const dacau06 = KDO22L3['dakdo22l3c6'].value;
    const dacau07 = KDO22L3['dakdo22l3c7'].value;
    const dacau08 = KDO22L3['dakdo22l3c8'].value;
    const dacau09 = KDO22L3['dakdo22l3c9'].value;
    const dacau10 = KDO22L3['dakdo22l3c10'].value;
    const dacau11 = KDO22L3['dakdo22l3c11'].value;
    const dacau12 = KDO22L3['dakdo22l3c12'].value;
    const dacau13 = KDO22L3['dakdo22l3c13'].value;
    const dacau14 = KDO22L3['dakdo22l3c14'].value;
    const dacau15 = KDO22L3['dakdo22l3c15'].value;
    const dacau16 = KDO22L3['dakdo22l3c16'].value;
    const dacau17 = KDO22L3['dakdo22l3c17'].value;
    const dacau18 = KDO22L3['dakdo22l3c18'].value;
    const dacau19 = KDO22L3['dakdo22l3c19'].value;
    const dacau20 = KDO22L3['dakdo22l3c20'].value;
    const dacau21 = KDO22L3['dakdo22l3c21'].value;
    const dacau22 = KDO22L3['dakdo22l3c22'].value;
    const dacau23 = KDO22L3['dakdo22l3c23'].value;
    const dacau24 = KDO22L3['dakdo22l3c24'].value;
    const dacau25 = KDO22L3['dakdo22l3c25'].value;
    const dacau26 = KDO22L3['dakdo22l3c26'].value;
    const dacau27 = KDO22L3['dakdo22l3c27'].value;
    const dacau28 = KDO22L3['dakdo22l3c28'].value;
    const dacau29 = KDO22L3['dakdo22l3c29'].value;
    const dacau30 = KDO22L3['dakdo22l3c30'].value;
    const dacau31 = KDO22L3['dakdo22l3c31'].value;
    const dacau32 = KDO22L3['dakdo22l3c32'].value;
    const dacau33 = KDO22L3['dakdo22l3c33'].value;
    const dacau34 = KDO22L3['dakdo22l3c34'].value;
    const dacau35 = KDO22L3['dakdo22l3c35'].value;


    var QS = {
        cau1: cau01,
        cau2: cau02,
        cau3: cau03,
        cau4: cau04,
        cau5: cau05,
        cau6: cau06,
        cau7: cau07,
        cau8: cau08,
        cau9: cau09,
        cau10: cau10,
        cau11: cau11,
        cau12: cau12,
        cau13: cau13,
        cau14: cau14,
        cau15: cau15,
        cau16: cau16,
        cau17: cau17,
        cau18: cau18,
        cau19: cau19,
        cau20: cau20,
        cau21: cau21,
        cau22: cau22,
        cau23: cau23,
        cau24: cau24,
        cau25: cau25,
        cau26: cau26,
        cau27: cau27,
        cau28: cau28,
        cau29: cau29,
        cau30: cau30,
        cau31: cau31,
        cau32: cau32,
        cau33: cau33,
        cau34: cau34,
        cau35: cau35,


        dacau1: dacau01,
        dacau2: dacau02,
        dacau3: dacau03,
        dacau4: dacau04,
        dacau5: dacau05,
        dacau6: dacau06,
        dacau7: dacau07,
        dacau8: dacau08,
        dacau9: dacau09,
        dacau10: dacau10,
        dacau11: dacau11,
        dacau12: dacau12,
        dacau13: dacau13,
        dacau14: dacau14,
        dacau15: dacau15,
        dacau16: dacau16,
        dacau17: dacau17,
        dacau18: dacau18,
        dacau19: dacau19,
        dacau20: dacau20,
        dacau21: dacau21,
        dacau22: dacau22,
        dacau23: dacau23,
        dacau24: dacau24,
        dacau25: dacau25,
        dacau26: dacau26,
        dacau27: dacau27,
        dacau28: dacau28,
        dacau29: dacau29,
        dacau30: dacau30,
        dacau31: dacau31,
        dacau32: dacau32,
        dacau33: dacau33,
        dacau34: dacau34,
        dacau35: dacau35,
    }
    var KDO22QuestionL3 = firebase.database().ref(matchid + '/KDO22Question/L3');
    KDO22QuestionL3.set(QS);
    Notification("Đã tải lên câu hỏi Khởi động (Lượt 3) thành công");
}


function chooseFile(e) {
    file = e.target.files[0];
}



function uploadCNVImage() {
    if (file.size < 2000000) {
        document.getElementById("notify-uploadhacnvfilesize").innerHTML = "";
        document.getElementById("notify-uploadhacnv").innerHTML = "ĐANG TẢI LÊN HÌNH ẢNH CHƯỚNG NGẠI VẬT..."
        firebase.storage().ref(matchid + '/img/cnv/cnv.jpg').put(file).then(function () {
            document.getElementById("notify-uploadhacnv").innerHTML = "TẢI LÊN HÌNH ẢNH CHƯỚNG NGẠI VẬT THÀNH CÔNG";
        }).catch(error => {
            console.log(error.message);
        })
    } else {

    }
}

function uploadCNVAudio() {
    if (file.size < 2000000) {
        document.getElementById("notify-uploadatcnvfilesize").innerHTML = "";
        document.getElementById("notify-uploadatcnv").innerHTML = "ĐANG TẢI LÊN ÂM THANH HÀNG NGANG...";
        firebase.storage().ref(matchid + '/audio/cnv/hn.mp3').put(file).then(function () {
            document.getElementById("notify-uploadatcnv").innerHTML = "TẢI LÊN ÂM THANH HÀNG NGANG THÀNH CÔNG";
        }).catch(error => {
            console.log(error.message);
        })
    } else {

    }
}

function uploadTT1Image() {
    if (file.size < 4000000) {
        Notification("Đang tải lên file Tăng tốc 1");
        if (file.type == "image/jpeg" || file.type == "image/png") {
            firebase.storage().ref(matchid + '/tt/tt1/tt1.jpg').put(file).then(function () {
                setTimeout(function () {
                    Notification("Tải lên hình ảnh Tăng tốc 1 thành công. F5 trang để xem trước.")
                }, 3000);
            }).catch(error => {
                setTimeout(function () {
                    console.log(error.message);
                }, 3000);
            })
            firebase.storage().ref(matchid + '/tt/tt1/tt1.mp4').delete();
        }
        if (file.type == "video/mp4" || file.type == "video/x-msvideo" || file.type == "video/mpeg") {
            firebase.storage().ref(matchid + '/tt/tt1/tt1.mp4').put(file).then(function () {
                Notification("Tải lên Video Tăng tốc 1 thành công. F5 trang để xem trước.")
            }).catch(error => {
                console.log(error.message);
            })
            firebase.storage().ref(matchid + '/tt/tt1/tt1.jpg').delete();
        }

    } else {
        Notification("Dung lượng upload quá 4MB");
    }
}

function uploadTT2Video() {
    if (file.size < 4000000) {
        Notification("Đang tải lên file Tăng tốc 2");
        if (file.type == "image/jpeg" || file.type == "image/png") {
            firebase.storage().ref(matchid + '/tt/tt2/tt2.jpg').put(file).then(function () {
                setTimeout(function () {
                    Notification("Tải lên hình ảnh Tăng tốc 2 thành công. F5 trang để xem trước.")
                }, 3000);
            }).catch(error => {
                console.log(error.message);
            })
            firebase.storage().ref(matchid + '/tt/tt2/tt2.mp4').delete();
        }
        if (file.type == "video/mp4" || file.type == "video/x-msvideo" || file.type == "video/mpeg") {
            firebase.storage().ref(matchid + '/tt/tt2/tt2.mp4').put(file).then(function () {
                Notification("Tải lên Video Tăng tốc 2 thành công. F5 trang để xem trước.")
            }).catch(error => {
                console.log(error.message);
            })
            firebase.storage().ref(matchid + '/tt/tt2/tt2.jpg').delete();
        }
    } else {
        Notification("Dung lượng upload quá 4MB");
    }
}

function uploadTT3Image() {
    if (file.size < 4000000) {
        Notification("Đang tải lên file Tăng tốc 3");
        if (file.type == "image/jpeg" || file.type == "image/png") {
            firebase.storage().ref(matchid + '/tt/tt3/tt3.jpg').put(file).then(function () {
                setTimeout(function () {
                    Notification("Tải lên hình ảnh Tăng tốc 3 thành công. F5 trang để xem trước.")
                }, 3000);
            }).catch(error => {
                console.log(error.message);
            })
            firebase.storage().ref(matchid + '/tt/tt3/tt3.mp4').delete();
        }
        if (file.type == "video/mp4" || file.type == "video/x-msvideo" || file.type == "video/mpeg") {
            firebase.storage().ref(matchid + '/tt/tt3/tt3.mp4').put(file).then(function () {
                Notification("Tải lên Video Tăng tốc 3 thành công. F5 trang để xem trước.")
            }).catch(error => {
                console.log(error.message);
            })
            firebase.storage().ref(matchid + '/tt/tt3/tt3.jpg').delete();
        }
    } else {
        Notification("Dung lượng upload quá 4MB");

    }
}

function uploadTT4Video() {
    if (file.size < 4000000) {
        Notification("Đang tải lên file Tăng tốc 4");
        if (file.type == "image/jpeg" || file.type == "image/png") {
            firebase.storage().ref(matchid + '/tt/tt4/tt4.jpg').put(file).then(function () {
                setTimeout(function () {
                    Notification("Tải lên hình ảnh Tăng tốc 4 thành công. F5 trang để xem trước.");
                }, 3000);
            }).catch(error => {
                console.log(error.message);
            })
            firebase.storage().ref(matchid + '/tt/tt4/tt4.mp4').delete();
        }
        if (file.type == "video/mp4" || file.type == "video/x-msvideo" || file.type == "video/mpeg") {
            firebase.storage().ref(matchid + '/tt/tt4/tt4.mp4').put(file).then(function () {
                Notification("Tải lên Video Tăng tốc 4 thành công. F5 trang để xem trước.");
            }).catch(error => {
                console.log(error.message);
            })
            firebase.storage().ref(matchid + '/tt/tt4/tt4.jpg').delete();
        }
    } else {
        Notification("Dung lượng upload quá 4MB");
    }
}

function uploadDATTImage(number) {
    if (file.size < 4000000) {
        Notification("Đang tải lên file đáp án Tăng tốc " + number);
        if (file.type == "image/jpeg" || file.type == "image/png") {
            firebase.storage().ref(matchid + '/tt/datt' + number + '/tt' + number + '.jpg').put(file).then(function () {
                setTimeout(function () {
                    Notification("Tải lên hình ảnh đáp án Tăng tốc " + number + " thành công. F5 trang để xem trước.")
                }, 3000);
            }).catch(error => {
                setTimeout(function () {
                    console.log(error.message);
                }, 3000);
            })
        }
    } else {
        Notification("Dung lượng upload quá 4MB");
    }
}


function uploadVD1Video() {
    if (file.size < 4000000) {
        Notification("Đang tải lên Video về đích Thí sinh 1");
        firebase.storage().ref(matchid + '/vd/vd1/vd.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Tải lên Video về đích Thí sinh 1 thành công. F5 trang để xem trước.");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng upload quá 4MB");

    }
}

function uploadVD2Video() {
    if (file.size < 4000000) {
        Notification("Đang tải lên Video về đích Thí sinh 2");
        firebase.storage().ref(matchid + '/vd/vd2/vd.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Tải lên Video về đích Thí sinh 2 thành công. F5 trang để xem trước.");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng upload quá 4MB");

    }
}

function uploadVD3Video() {
    if (file.size < 4000000) {
        Notification("Đang tải lên Video về đích Thí sinh 3");

        firebase.storage().ref(matchid + '/vd/vd3/vd.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Tải lên Video về đích Thí sinh 3 thành công. F5 trang để xem trước.");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    }
    else {
        Notification("Dung lượng upload quá 4MB");

    }
}

function uploadVD4Video() {
    if (file.size < 4000000) {
        Notification("Đang tải lên Video về đích Thí sinh 4");


        firebase.storage().ref(matchid + '/vd/vd4/vd.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Tải lên Video về đích Thí sinh 4 thành công. F5 trang để xem trước.");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng upload quá 4MB");

    }
}






firebase.storage().ref(matchid + '/video/intro.mp4').getDownloadURL().then(vidUrl => {
    intro.src = vidUrl;
})

firebase.storage().ref(matchid + '/video/kd/intro.mp4').getDownloadURL().then(vidUrl => {
    introkd.src = vidUrl;
})
firebase.storage().ref(matchid + '/video/vcnv/intro.mp4').getDownloadURL().then(vidUrl => {
    introvcnv.src = vidUrl;
})

firebase.storage().ref(matchid + '/video/tt/intro.mp4').getDownloadURL().then(vidUrl => {
    intrott.src = vidUrl;
})

firebase.storage().ref(matchid + '/video/vd/intro.mp4').getDownloadURL().then(vidUrl => {
    introvd.src = vidUrl;
})






firebase.storage().ref(matchid + '/img/cnv/cnv.jpg').getDownloadURL().then(imgUrl => {
    cnvimage.src = imgUrl;
});

firebase.storage().ref(matchid + '/audio/cnv/hn.mp3').getDownloadURL().then(imgUrl => {
    hnaudio.src = imgUrl
});


firebase.storage().ref(matchid + "/tt/tt1/tt1.jpg").getDownloadURL().then(imgUrl => {
    tt1.poster = imgUrl;
    tt1.removeAttribute("controls");
    // document.getElementById("ImagesTT1Btn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
}).catch((error) => {
    firebase.storage().ref(matchid + "/tt/tt1/tt1.mp4").getDownloadURL().then(imgUrl => {
        tt1.src = imgUrl;
        displayTT1(true);
    })
});

firebase.storage().ref(matchid + "/tt/tt2/tt2.jpg").getDownloadURL().then(imgUrl => {
    tt2.poster = imgUrl;
    tt2.removeAttribute("controls");
}).catch((error) => {
    firebase.storage().ref(matchid + "/tt/tt2/tt2.mp4").getDownloadURL().then(imgUrl => {
        tt2.src = imgUrl;
    })
});

firebase.storage().ref(matchid + "/tt/tt3/tt3.jpg").getDownloadURL().then(imgUrl => {
    tt3.poster = imgUrl;
    tt3.removeAttribute("controls");
}).catch((error) => {
    firebase.storage().ref(matchid + "/tt/tt3/tt3.mp4").getDownloadURL().then(imgUrl => {
        tt3.src = imgUrl;
    })
});

firebase.storage().ref(matchid + "/tt/tt4/tt4.jpg").getDownloadURL().then(imgUrl => {
    tt4.poster = imgUrl;
    tt4.removeAttribute("controls");
}).catch((error) => {
    firebase.storage().ref(matchid + "/tt/tt4/tt4.mp4").getDownloadURL().then(imgUrl => {
        tt4.src = imgUrl;
    })
});


firebase.storage().ref(matchid + "/tt/datt1/tt1.jpg").getDownloadURL().then(imgUrl => {
    answertt1.poster = imgUrl;
    answertt1.removeAttribute("controls");
}).catch((error) => {

});

firebase.storage().ref(matchid + "/tt/datt2/tt2.jpg").getDownloadURL().then(imgUrl => {
    answertt2.poster = imgUrl;
    answertt2.removeAttribute("controls");
}).catch((error) => {

});



firebase.storage().ref(matchid + "/tt/datt3/tt3.jpg").getDownloadURL().then(imgUrl => {
    answertt3.poster = imgUrl;
    answertt3.removeAttribute("controls");
}).catch((error) => {

});



firebase.storage().ref(matchid + "/tt/datt4/tt4.jpg").getDownloadURL().then(imgUrl => {
    answertt4.poster = imgUrl;
    answertt4.removeAttribute("controls");
}).catch((error) => {

});







// Function to add a new image item
function addImageItem() {
    const imageList = document.getElementById("imageList");
    const newImageItem = document.createElement("div");
    newImageItem.classList.add("imageItem");
    newImageItem.innerHTML = `
        <input type="file" accept="image/*" onchange="chooseImage(event)" />
        <input type="text" placeholder="Thời gian hiển thị (giây)" />
        <button class="removeBtn" onclick="removeImageItem(this)">-</button>`;
    imageList.appendChild(newImageItem);
}

// Function to remove an image item
function removeImageItem(button) {
    const imageItem = button.parentNode;
    imageItem.parentNode.removeChild(imageItem);
}

// Function to handle image file selection
function chooseImage(event) {
    const file = event.target.files[0];
    // Handle file selection
}

// // Function to upload the image sequence to Firebase
// function uploadImageSequence() {
//     const imageItems = document.querySelectorAll("#imageList .imageItem");
//     const imageSequenceData = [];
//     imageItems.forEach(item => {
//         const fileInput = item.querySelector("input[type=file]");
//         const timeInput = item.querySelector("input[type=text]");
//         const file = fileInput.files[0];
//         const time = timeInput.value;
//         // Process file and time data
//         imageSequenceData.push({ file, time });
//     });
//     // Upload image sequence data to Firebase
//     console.log(imageSequenceData);
// }

// Function to switch between image sequence and video
function displayTT1(val) {
    if (val == false) {
        document.getElementById("VideoUploadTT1").style.display = "none";
        document.getElementById("ImageUploadTT1").style.display = "block";
        document.getElementById("ImagesTT1Btn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
        document.getElementById("VideoTT1Btn").style.backgroundImage = 'none';
    }
    if (val == true) {
        document.getElementById("ImageUploadTT1").style.display = "none";
        document.getElementById("VideoUploadTT1").style.display = "block";
        document.getElementById("ImagesTT1Btn").style.backgroundImage = 'none';
        document.getElementById("VideoTT1Btn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
    }
}

function previewTT1Images() {
    // Reference to the Realtime Database
    const databaseRef = firebase.database().ref(`${matchid}/TTImage`);

    // Retrieve image data from the database
    databaseRef.once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const imageData = childSnapshot.val();
            const imageName = imageData.imageName;
            const time = imageData.time;

            // Retrieve image URL from Storage
            firebase.storage().ref(`${matchid}/tt/tt1/${imageName}.jpg`).getDownloadURL().then(imgUrl => {
                // Create HTML elements to display image and time
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = `TT1 Image ${imageName}`;
                img.style.width = '400px';
                img.style.height = '250px';

                const timeDisplay = document.createElement('p');
                timeDisplay.textContent = `Thời gian hiển thị: ${time} giây`;

                // Append image and time to the document
                const previewDiv = document.getElementById('tt1Preview');
                previewDiv.appendChild(img);
                previewDiv.appendChild(timeDisplay);
            }).catch(error => {
                console.log(error.message);
            });
        });
    }).catch(error => {
        console.log(error.message);
    });
}

previewTT1Images();
function uploadTT1ImageList() {
    const imageItems = document.querySelectorAll("#imageList .imageItem");
    let order = 1; // Starting order number for images

    imageItems.forEach(item => {
        const fileInput = item.querySelector("input[type=file]");
        const file = fileInput.files[0];
        const timeInput = item.querySelector("input[type=text]");
        const time = timeInput.value;

        if (file.size < 4000000) {
            if ((file.type == "image/jpeg" || file.type == "image/png") && time) {
                Notification("Đang tải lên file Tăng tốc 1");

                const imageName = `TT1-${order}`;
                const imagePath = `${matchid}/tt/tt1/${imageName}.jpg`;

                firebase.storage().ref(imagePath).put(file).then(() => {
                    setTimeout(() => {
                        Notification(`Tải lên hình ảnh ${imageName} thành công. F5 trang để xem trước.`);
                    }, 3000);
                }).catch(error => {
                    setTimeout(() => {
                        console.log(error.message);
                    }, 3000);
                });

                // Save time to Realtime Database
                firebase.database().ref(`${matchid}/TTImage`).push({
                    imageName,
                    time
                });

                order++;
            } else {
                Notification("Định dạng hoặc thời gian không hợp lệ.");
            }
        } else {
            Notification("Dung lượng upload quá 4MB");
        }
    });
}
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

var CNVKT = firebase.database().ref(matchid + '/VCNVQuestion/CNVKeyType/');
CNVKT.on('value', cnvktype);
function cnvktype(ktype) {
    if (ktype.val().type == 1) {
        document.getElementById("kytu").selected = "true";
    }
    if (ktype.val().type == 2) {
        document.getElementById("chucai").selected = "true";
    }
    if (ktype.val().type == 3) {
        document.getElementById("chuso").selected = "true";
    }
}


// Nhập đề Excel

var excelfile = document.getElementById("excel_file");
var confirmexcel = document.getElementById("confirm_excel");


function ReadData() {
    var excelfile = document.getElementById("excel_file");
    readXlsxFile(excelfile.files[0]).then(function (data) {

        //Tên phòng trò chơi

        var matchanme = document.getElementById("matchname");
        matchanme.value = data[1][1];

        //Khởi động


        //Thí sinh 1
        //Câu hỏi
        try {
            var kdts1c1 = document.getElementById("toan1");
            var kdts1c2 = document.getElementById("ly1");
            var kdts1c3 = document.getElementById("hoa1");
            var kdts1c4 = document.getElementById("sinh1");
            var kdts1c5 = document.getElementById("su1");
            var kdts1c6 = document.getElementById("dia1");
            var kdts1c7 = document.getElementById("van1");
            var kdts1c8 = document.getElementById("anh1");
            var kdts1c9 = document.getElementById("thethao1");
            var kdts1c10 = document.getElementById("nghethuat1");
            var kdts1c11 = document.getElementById("hbc1");
            var kdts1c12 = document.getElementById("lvk1");
            var kdts1c13 = document.getElementById("cht11");
            var kdts1c14 = document.getElementById("cht21");
            var kdts1c15 = document.getElementById("cht31");
            var kdts1c16 = document.getElementById("cht41");
            var kdts1c17 = document.getElementById("cht51");
            var kdts1c18 = document.getElementById("cht61");
            var kdts1c19 = document.getElementById("cht71");
            var kdts1c20 = document.getElementById("cht81");

            kdts1c1.value = data[4][1];
            kdts1c2.value = data[5][1];
            kdts1c3.value = data[6][1];
            kdts1c4.value = data[7][1];
            kdts1c5.value = data[8][1];
            kdts1c6.value = data[9][1];
            kdts1c7.value = data[10][1];
            kdts1c8.value = data[11][1];
            kdts1c9.value = data[12][1];
            kdts1c10.value = data[13][1];
            kdts1c11.value = data[14][1];
            kdts1c12.value = data[15][1];
            kdts1c13.value = data[16][1];
            kdts1c14.value = data[17][1];
            kdts1c15.value = data[18][1];
            kdts1c16.value = data[19][1];
            kdts1c17.value = data[20][1];
            kdts1c18.value = data[21][1];
            kdts1c19.value = data[22][1];
            kdts1c20.value = data[23][1];

            //Đáp án

            var kdts1dac1 = document.getElementById("datoan1");
            var kdts1dac2 = document.getElementById("daly1");
            var kdts1dac3 = document.getElementById("dahoa1");
            var kdts1dac4 = document.getElementById("dasinh1");
            var kdts1dac5 = document.getElementById("dasu1");
            var kdts1dac6 = document.getElementById("dadia1");
            var kdts1dac7 = document.getElementById("davan1");
            var kdts1dac8 = document.getElementById("daanh1");
            var kdts1dac9 = document.getElementById("dathethao1");
            var kdts1dac10 = document.getElementById("danghethuat1");
            var kdts1dac11 = document.getElementById("dahbc1");
            var kdts1dac12 = document.getElementById("dalvk1");
            var kdts1dac13 = document.getElementById("dacht11");
            var kdts1dac14 = document.getElementById("dacht21");
            var kdts1dac15 = document.getElementById("dacht31");
            var kdts1dac16 = document.getElementById("dacht41");
            var kdts1dac17 = document.getElementById("dacht51");
            var kdts1dac18 = document.getElementById("dacht61");
            var kdts1dac19 = document.getElementById("dacht71");
            var kdts1dac20 = document.getElementById("dacht81");

            kdts1dac1.value = data[4][2];
            kdts1dac2.value = data[5][2];
            kdts1dac3.value = data[6][2];
            kdts1dac4.value = data[7][2];
            kdts1dac5.value = data[8][2];
            kdts1dac6.value = data[9][2];
            kdts1dac7.value = data[10][2];
            kdts1dac8.value = data[11][2];
            kdts1dac9.value = data[12][2];
            kdts1dac10.value = data[13][2];
            kdts1dac11.value = data[14][2];
            kdts1dac12.value = data[15][2];
            kdts1dac13.value = data[16][2];
            kdts1dac14.value = data[17][2];
            kdts1dac15.value = data[18][2];
            kdts1dac16.value = data[19][2];
            kdts1dac17.value = data[20][2];
            kdts1dac18.value = data[21][2];
            kdts1dac19.value = data[22][2];
            kdts1dac20.value = data[23][2];




            //Thí sinh 2
            //Câu hỏi
            var kdts2c1 = document.getElementById("toan2");
            var kdts2c2 = document.getElementById("ly2");
            var kdts2c3 = document.getElementById("hoa2");
            var kdts2c4 = document.getElementById("sinh2");
            var kdts2c5 = document.getElementById("su2");
            var kdts2c6 = document.getElementById("dia2");
            var kdts2c7 = document.getElementById("van2");
            var kdts2c8 = document.getElementById("anh2");
            var kdts2c9 = document.getElementById("thethao2");
            var kdts2c10 = document.getElementById("nghethuat2");
            var kdts2c11 = document.getElementById("hbc2");
            var kdts2c12 = document.getElementById("lvk2");
            var kdts2c13 = document.getElementById("cht12");
            var kdts2c14 = document.getElementById("cht22");
            var kdts2c15 = document.getElementById("cht32");
            var kdts2c16 = document.getElementById("cht42");
            var kdts2c17 = document.getElementById("cht52");
            var kdts2c18 = document.getElementById("cht62");
            var kdts2c19 = document.getElementById("cht72");
            var kdts2c20 = document.getElementById("cht82");

            kdts2c1.value = data[4][3];
            kdts2c2.value = data[5][3];
            kdts2c3.value = data[6][3];
            kdts2c4.value = data[7][3];
            kdts2c5.value = data[8][3];
            kdts2c6.value = data[9][3];
            kdts2c7.value = data[10][3];
            kdts2c8.value = data[11][3];
            kdts2c9.value = data[12][3];
            kdts2c10.value = data[13][3];
            kdts2c11.value = data[14][3];
            kdts2c12.value = data[15][3];
            kdts2c13.value = data[16][3];
            kdts2c14.value = data[17][3];
            kdts2c15.value = data[18][3];
            kdts2c16.value = data[19][3];
            kdts2c17.value = data[20][3];
            kdts2c18.value = data[21][3];
            kdts2c19.value = data[22][3];
            kdts2c20.value = data[23][3];

            //Đáp án

            var kdts2dac1 = document.getElementById("datoan2");
            var kdts2dac2 = document.getElementById("daly2");
            var kdts2dac3 = document.getElementById("dahoa2");
            var kdts2dac4 = document.getElementById("dasinh2");
            var kdts2dac5 = document.getElementById("dasu2");
            var kdts2dac6 = document.getElementById("dadia2");
            var kdts2dac7 = document.getElementById("davan2");
            var kdts2dac8 = document.getElementById("daanh2");
            var kdts2dac9 = document.getElementById("dathethao2");
            var kdts2dac10 = document.getElementById("danghethuat2");
            var kdts2dac11 = document.getElementById("dahbc2");
            var kdts2dac12 = document.getElementById("dalvk2");
            var kdts2dac13 = document.getElementById("dacht12");
            var kdts2dac14 = document.getElementById("dacht22");
            var kdts2dac15 = document.getElementById("dacht32");
            var kdts2dac16 = document.getElementById("dacht42");
            var kdts2dac17 = document.getElementById("dacht52");
            var kdts2dac18 = document.getElementById("dacht62");
            var kdts2dac19 = document.getElementById("dacht72");
            var kdts2dac20 = document.getElementById("dacht82");

            kdts2dac1.value = data[4][4];
            kdts2dac2.value = data[5][4];
            kdts2dac3.value = data[6][4];
            kdts2dac4.value = data[7][4];
            kdts2dac5.value = data[8][4];
            kdts2dac6.value = data[9][4];
            kdts2dac7.value = data[10][4];
            kdts2dac8.value = data[11][4];
            kdts2dac9.value = data[12][4];
            kdts2dac10.value = data[13][4];
            kdts2dac11.value = data[14][4];
            kdts2dac12.value = data[15][4];
            kdts2dac13.value = data[16][4];
            kdts2dac14.value = data[17][4];
            kdts2dac15.value = data[18][4];
            kdts2dac16.value = data[19][4];
            kdts2dac17.value = data[20][4];
            kdts2dac18.value = data[21][4];
            kdts2dac19.value = data[22][4];
            kdts2dac20.value = data[23][4];



            //Thí sinh 3
            //Câu hỏi
            var kdts3c1 = document.getElementById("toan3");
            var kdts3c2 = document.getElementById("ly3");
            var kdts3c3 = document.getElementById("hoa3");
            var kdts3c4 = document.getElementById("sinh3");
            var kdts3c5 = document.getElementById("su3");
            var kdts3c6 = document.getElementById("dia3");
            var kdts3c7 = document.getElementById("van3");
            var kdts3c8 = document.getElementById("anh3");
            var kdts3c9 = document.getElementById("thethao3");
            var kdts3c10 = document.getElementById("nghethuat3");
            var kdts3c11 = document.getElementById("hbc3");
            var kdts3c12 = document.getElementById("lvk3");
            var kdts3c13 = document.getElementById("cht13");
            var kdts3c14 = document.getElementById("cht23");
            var kdts3c15 = document.getElementById("cht33");
            var kdts3c16 = document.getElementById("cht43");
            var kdts3c17 = document.getElementById("cht53");
            var kdts3c18 = document.getElementById("cht63");
            var kdts3c19 = document.getElementById("cht73");
            var kdts3c20 = document.getElementById("cht83");

            kdts3c1.value = data[4][5];
            kdts3c2.value = data[5][5];
            kdts3c3.value = data[6][5];
            kdts3c4.value = data[7][5];
            kdts3c5.value = data[8][5];
            kdts3c6.value = data[9][5];
            kdts3c7.value = data[10][5];
            kdts3c8.value = data[11][5];
            kdts3c9.value = data[12][5];
            kdts3c10.value = data[13][5];
            kdts3c11.value = data[14][5];
            kdts3c12.value = data[15][5];
            kdts3c13.value = data[16][5];
            kdts3c14.value = data[17][5];
            kdts3c15.value = data[18][5];
            kdts3c16.value = data[19][5];
            kdts3c17.value = data[20][5];
            kdts3c18.value = data[21][5];
            kdts3c19.value = data[22][5];
            kdts3c20.value = data[23][5];

            //Đáp án

            var kdts3dac1 = document.getElementById("datoan3");
            var kdts3dac2 = document.getElementById("daly3");
            var kdts3dac3 = document.getElementById("dahoa3");
            var kdts3dac4 = document.getElementById("dasinh3");
            var kdts3dac5 = document.getElementById("dasu3");
            var kdts3dac6 = document.getElementById("dadia3");
            var kdts3dac7 = document.getElementById("davan3");
            var kdts3dac8 = document.getElementById("daanh3");
            var kdts3dac9 = document.getElementById("dathethao3");
            var kdts3dac10 = document.getElementById("danghethuat3");
            var kdts3dac11 = document.getElementById("dahbc3");
            var kdts3dac12 = document.getElementById("dalvk3");
            var kdts3dac13 = document.getElementById("dacht13");
            var kdts3dac14 = document.getElementById("dacht23");
            var kdts3dac15 = document.getElementById("dacht33");
            var kdts3dac16 = document.getElementById("dacht43");
            var kdts3dac17 = document.getElementById("dacht53");
            var kdts3dac18 = document.getElementById("dacht63");
            var kdts3dac19 = document.getElementById("dacht73");
            var kdts3dac20 = document.getElementById("dacht83");

            kdts3dac1.value = data[4][6];
            kdts3dac2.value = data[5][6];
            kdts3dac3.value = data[6][6];
            kdts3dac4.value = data[7][6];
            kdts3dac5.value = data[8][6];
            kdts3dac6.value = data[9][6];
            kdts3dac7.value = data[10][6];
            kdts3dac8.value = data[11][6];
            kdts3dac9.value = data[12][6];
            kdts3dac10.value = data[13][6];
            kdts3dac11.value = data[14][6];
            kdts3dac12.value = data[15][6];
            kdts3dac13.value = data[16][6];
            kdts3dac14.value = data[17][6];
            kdts3dac15.value = data[18][6];
            kdts3dac16.value = data[19][6];
            kdts3dac17.value = data[20][6];
            kdts3dac18.value = data[21][6];
            kdts3dac19.value = data[22][6];
            kdts3dac20.value = data[23][6];


            //Thí sinh 4
            //Câu hỏi
            var kdts4c1 = document.getElementById("toan4");
            var kdts4c2 = document.getElementById("ly4");
            var kdts4c3 = document.getElementById("hoa4");
            var kdts4c4 = document.getElementById("sinh4");
            var kdts4c5 = document.getElementById("su4");
            var kdts4c6 = document.getElementById("dia4");
            var kdts4c7 = document.getElementById("van4");
            var kdts4c8 = document.getElementById("anh4");
            var kdts4c9 = document.getElementById("thethao4");
            var kdts4c10 = document.getElementById("nghethuat4");
            var kdts4c11 = document.getElementById("hbc4");
            var kdts4c12 = document.getElementById("lvk4");
            var kdts4c13 = document.getElementById("cht14");
            var kdts4c14 = document.getElementById("cht24");
            var kdts4c15 = document.getElementById("cht34");
            var kdts4c16 = document.getElementById("cht44");
            var kdts4c17 = document.getElementById("cht54");
            var kdts4c18 = document.getElementById("cht64");
            var kdts4c19 = document.getElementById("cht74");
            var kdts4c20 = document.getElementById("cht84");

            kdts4c1.value = data[4][7];
            kdts4c2.value = data[5][7];
            kdts4c3.value = data[6][7];
            kdts4c4.value = data[7][7];
            kdts4c5.value = data[8][7];
            kdts4c6.value = data[9][7];
            kdts4c7.value = data[10][7];
            kdts4c8.value = data[11][7];
            kdts4c9.value = data[12][7];
            kdts4c10.value = data[13][7];
            kdts4c11.value = data[14][7];
            kdts4c12.value = data[15][7];
            kdts4c13.value = data[16][7];
            kdts4c14.value = data[17][7];
            kdts4c15.value = data[18][7];
            kdts4c16.value = data[19][7];
            kdts4c17.value = data[20][7];
            kdts4c18.value = data[21][7];
            kdts4c19.value = data[22][7];
            kdts4c20.value = data[23][7];

            //Đáp án

            var kdts4dac1 = document.getElementById("datoan4");
            var kdts4dac2 = document.getElementById("daly4");
            var kdts4dac3 = document.getElementById("dahoa4");
            var kdts4dac4 = document.getElementById("dasinh4");
            var kdts4dac5 = document.getElementById("dasu4");
            var kdts4dac6 = document.getElementById("dadia4");
            var kdts4dac7 = document.getElementById("davan4");
            var kdts4dac8 = document.getElementById("daanh4");
            var kdts4dac9 = document.getElementById("dathethao4");
            var kdts4dac10 = document.getElementById("danghethuat4");
            var kdts4dac11 = document.getElementById("dahbc4");
            var kdts4dac12 = document.getElementById("dalvk4");
            var kdts4dac13 = document.getElementById("dacht14");
            var kdts4dac14 = document.getElementById("dacht24");
            var kdts4dac15 = document.getElementById("dacht34");
            var kdts4dac16 = document.getElementById("dacht44");
            var kdts4dac17 = document.getElementById("dacht54");
            var kdts4dac18 = document.getElementById("dacht64");
            var kdts4dac19 = document.getElementById("dacht74");
            var kdts4dac20 = document.getElementById("dacht84");

            kdts4dac1.value = data[4][8];
            kdts4dac2.value = data[5][8];
            kdts4dac3.value = data[6][8];
            kdts4dac4.value = data[7][8];
            kdts4dac5.value = data[8][8];
            kdts4dac6.value = data[9][8];
            kdts4dac7.value = data[10][8];
            kdts4dac8.value = data[11][8];
            kdts4dac9.value = data[12][8];
            kdts4dac10.value = data[13][8];
            kdts4dac11.value = data[14][8];
            kdts4dac12.value = data[15][8];
            kdts4dac13.value = data[16][8];
            kdts4dac14.value = data[17][8];
            kdts4dac15.value = data[18][8];
            kdts4dac16.value = data[19][8];
            kdts4dac17.value = data[20][8];
            kdts4dac18.value = data[21][8];
            kdts4dac19.value = data[22][8];
            kdts4dac20.value = data[23][8];


            //Vượt chướng ngại vật


            var cnv = document.getElementById("cnv");

            var vcnvhn1 = document.getElementById("chhn1");
            var vcnvhn2 = document.getElementById("chhn2");
            var vcnvhn3 = document.getElementById("chhn3");
            var vcnvhn4 = document.getElementById("chhn4");
            var vcnvhntt = document.getElementById("chhntt");


            var davcnvhn1 = document.getElementById("ctlhn1");
            var davcnvhn2 = document.getElementById("ctlhn2");
            var davcnvhn3 = document.getElementById("ctlhn3");
            var davcnvhn4 = document.getElementById("ctlhn4");
            var davcnvhntt = document.getElementById("ctlhntt");


            cnv.value = data[25][1];

            vcnvhn1.value = data[27][1];
            vcnvhn2.value = data[28][1];
            vcnvhn3.value = data[29][1];
            vcnvhn4.value = data[30][1];
            vcnvhntt.value = data[31][1];


            davcnvhn1.value = data[27][2];
            davcnvhn2.value = data[28][2];
            davcnvhn3.value = data[29][2];
            davcnvhn4.value = data[30][2];
            davcnvhntt.value = data[31][2];

            //Tăng tốc


            var ttch1 = document.getElementById("chtt1");
            var ttch2 = document.getElementById("chtt2");
            var ttch3 = document.getElementById("chtt3");
            var ttch4 = document.getElementById("chtt4");


            var dattch1 = document.getElementById("ctltt1");
            var dattch2 = document.getElementById("ctltt2");
            var dattch3 = document.getElementById("ctltt3");
            var dattch4 = document.getElementById("ctltt4");

            ttch1.value = data[34][1];
            ttch2.value = data[35][1];
            ttch3.value = data[36][1];
            ttch4.value = data[37][1];

            dattch1.value = data[34][2];
            dattch2.value = data[35][2];
            dattch3.value = data[36][2];
            dattch4.value = data[37][2];

            //Về đích

            //Thí sinh 1
            //Câu hỏi

            var vdts1vd11 = document.getElementById("g1chvd11");
            var vdts1vd12 = document.getElementById("g1chvd12");
            var vdts1vd13 = document.getElementById("g1chvd13");

            var vdts1vd21 = document.getElementById("g1chvd21");
            var vdts1vd22 = document.getElementById("g1chvd22");
            var vdts1vd23 = document.getElementById("g1chvd23");

            var vdts1vd31 = document.getElementById("g1chvd31");
            var vdts1vd32 = document.getElementById("g1chvd32");
            var vdts1vd33 = document.getElementById("g1chvd33");


            vdts1vd11.value = data[40][1];
            vdts1vd12.value = data[41][1];
            vdts1vd13.value = data[42][1];

            vdts1vd21.value = data[43][1];
            vdts1vd22.value = data[44][1];
            vdts1vd23.value = data[45][1];


            vdts1vd31.value = data[46][1];
            vdts1vd32.value = data[47][1];
            vdts1vd33.value = data[48][1];

            //Đáp án

            var davdts1vd11 = document.getElementById("g1ctlvd11");
            var davdts1vd12 = document.getElementById("g1ctlvd12");
            var davdts1vd13 = document.getElementById("g1ctlvd13");

            var davdts1vd21 = document.getElementById("g1ctlvd21");
            var davdts1vd22 = document.getElementById("g1ctlvd22");
            var davdts1vd23 = document.getElementById("g1ctlvd23");

            var davdts1vd31 = document.getElementById("g1ctlvd31");
            var davdts1vd32 = document.getElementById("g1ctlvd32");
            var davdts1vd33 = document.getElementById("g1ctlvd33");

            davdts1vd11.value = data[40][2];
            davdts1vd12.value = data[41][2];
            davdts1vd13.value = data[42][2];

            davdts1vd21.value = data[43][2];
            davdts1vd22.value = data[44][2];
            davdts1vd23.value = data[45][2];


            davdts1vd31.value = data[46][2];
            davdts1vd32.value = data[47][2];
            davdts1vd33.value = data[48][2];


            //Thí sinh 2
            //Câu hỏi

            var vdts2vd11 = document.getElementById("g2chvd11");
            var vdts2vd12 = document.getElementById("g2chvd12");
            var vdts2vd13 = document.getElementById("g2chvd13");

            var vdts2vd21 = document.getElementById("g2chvd21");
            var vdts2vd22 = document.getElementById("g2chvd22");
            var vdts2vd23 = document.getElementById("g2chvd23");

            var vdts2vd31 = document.getElementById("g2chvd31");
            var vdts2vd32 = document.getElementById("g2chvd32");
            var vdts2vd33 = document.getElementById("g2chvd33");


            vdts2vd11.value = data[40][3];
            vdts2vd12.value = data[41][3];
            vdts2vd13.value = data[42][3];

            vdts2vd21.value = data[43][3];
            vdts2vd22.value = data[44][3];
            vdts2vd23.value = data[45][3];


            vdts2vd31.value = data[46][3];
            vdts2vd32.value = data[47][3];
            vdts2vd33.value = data[48][3];

            //Đáp án

            var davdts2vd11 = document.getElementById("g2ctlvd11");
            var davdts2vd12 = document.getElementById("g2ctlvd12");
            var davdts2vd13 = document.getElementById("g2ctlvd13");

            var davdts2vd21 = document.getElementById("g2ctlvd21");
            var davdts2vd22 = document.getElementById("g2ctlvd22");
            var davdts2vd23 = document.getElementById("g2ctlvd23");

            var davdts2vd31 = document.getElementById("g2ctlvd31");
            var davdts2vd32 = document.getElementById("g2ctlvd32");
            var davdts2vd33 = document.getElementById("g2ctlvd33");

            davdts2vd11.value = data[40][4];
            davdts2vd12.value = data[41][4];
            davdts2vd13.value = data[42][4];

            davdts2vd21.value = data[43][4];
            davdts2vd22.value = data[44][4];
            davdts2vd23.value = data[45][4];


            davdts2vd31.value = data[46][4];
            davdts2vd32.value = data[47][4];
            davdts2vd33.value = data[48][4];



            //Thí sinh 3
            //Câu hỏi

            var vdts3vd11 = document.getElementById("g3chvd11");
            var vdts3vd12 = document.getElementById("g3chvd12");
            var vdts3vd13 = document.getElementById("g3chvd13");

            var vdts3vd21 = document.getElementById("g3chvd21");
            var vdts3vd22 = document.getElementById("g3chvd22");
            var vdts3vd23 = document.getElementById("g3chvd23");

            var vdts3vd31 = document.getElementById("g3chvd31");
            var vdts3vd32 = document.getElementById("g3chvd32");
            var vdts3vd33 = document.getElementById("g3chvd33");


            vdts3vd11.value = data[40][5];
            vdts3vd12.value = data[41][5];
            vdts3vd13.value = data[42][5];

            vdts3vd21.value = data[43][5];
            vdts3vd22.value = data[44][5];
            vdts3vd23.value = data[45][5];


            vdts3vd31.value = data[46][5];
            vdts3vd32.value = data[47][5];
            vdts3vd33.value = data[48][5];

            //Đáp án

            var davdts3vd11 = document.getElementById("g3ctlvd11");
            var davdts3vd12 = document.getElementById("g3ctlvd12");
            var davdts3vd13 = document.getElementById("g3ctlvd13");

            var davdts3vd21 = document.getElementById("g3ctlvd21");
            var davdts3vd22 = document.getElementById("g3ctlvd22");
            var davdts3vd23 = document.getElementById("g3ctlvd23");

            var davdts3vd31 = document.getElementById("g3ctlvd31");
            var davdts3vd32 = document.getElementById("g3ctlvd32");
            var davdts3vd33 = document.getElementById("g3ctlvd33");

            davdts3vd11.value = data[40][6];
            davdts3vd12.value = data[41][6];
            davdts3vd13.value = data[42][6];

            davdts3vd21.value = data[43][6];
            davdts3vd22.value = data[44][6];
            davdts3vd23.value = data[45][6];


            davdts3vd31.value = data[46][6];
            davdts3vd32.value = data[47][6];
            davdts3vd33.value = data[48][6];


            //Thí sinh 4
            //Câu hỏi

            var vdts4vd11 = document.getElementById("g4chvd11");
            var vdts4vd12 = document.getElementById("g4chvd12");
            var vdts4vd13 = document.getElementById("g4chvd13");

            var vdts4vd21 = document.getElementById("g4chvd21");
            var vdts4vd22 = document.getElementById("g4chvd22");
            var vdts4vd23 = document.getElementById("g4chvd23");

            var vdts4vd31 = document.getElementById("g4chvd31");
            var vdts4vd32 = document.getElementById("g4chvd32");
            var vdts4vd33 = document.getElementById("g4chvd33");


            vdts4vd11.value = data[40][7];
            vdts4vd12.value = data[41][7];
            vdts4vd13.value = data[42][7];

            vdts4vd21.value = data[43][7];
            vdts4vd22.value = data[44][7];
            vdts4vd23.value = data[45][7];


            vdts4vd31.value = data[46][7];
            vdts4vd32.value = data[47][7];
            vdts4vd33.value = data[48][7];

            //Đáp án

            var davdts4vd11 = document.getElementById("g4ctlvd11");
            var davdts4vd12 = document.getElementById("g4ctlvd12");
            var davdts4vd13 = document.getElementById("g4ctlvd13");

            var davdts4vd21 = document.getElementById("g4ctlvd21");
            var davdts4vd22 = document.getElementById("g4ctlvd22");
            var davdts4vd23 = document.getElementById("g4ctlvd23");

            var davdts4vd31 = document.getElementById("g4ctlvd31");
            var davdts4vd32 = document.getElementById("g4ctlvd32");
            var davdts4vd33 = document.getElementById("g4ctlvd33");

            davdts4vd11.value = data[40][8];
            davdts4vd12.value = data[41][8];
            davdts4vd13.value = data[42][8];

            davdts4vd21.value = data[43][8];
            davdts4vd22.value = data[44][8];
            davdts4vd23.value = data[45][8];


            davdts4vd31.value = data[46][8];
            davdts4vd32.value = data[47][8];
            davdts4vd33.value = data[48][8];


            //Về đích phụ

            var vdpch1 = document.getElementById("chvdp1");
            var vdpch2 = document.getElementById("chvdp2");
            var vdpch3 = document.getElementById("chvdp3");
            var vdpch4 = document.getElementById("chvdp4");
            var vdpch5 = document.getElementById("chvdp5");
            var vdpch6 = document.getElementById("chvdp6");
            var vdpch7 = document.getElementById("chvdp7");
            var vdpch8 = document.getElementById("chvdp8");
            var vdpch9 = document.getElementById("chvdp9");
            var vdpch10 = document.getElementById("chvdp10");


            var davdpch1 = document.getElementById("ctlvdp1");
            var davdpch2 = document.getElementById("ctlvdp2");
            var davdpch3 = document.getElementById("ctlvdp3");
            var davdpch4 = document.getElementById("ctlvdp4");
            var davdpch5 = document.getElementById("ctlvdp5");
            var davdpch6 = document.getElementById("ctlvdp6");
            var davdpch7 = document.getElementById("ctlvdp7");
            var davdpch8 = document.getElementById("ctlvdp8");
            var davdpch9 = document.getElementById("ctlvdp9");
            var davdpch10 = document.getElementById("ctlvdp10");

            vdpch1.value = data[51][1];
            vdpch2.value = data[52][1];
            vdpch3.value = data[53][1];
            vdpch4.value = data[54][1];
            vdpch5.value = data[55][1];
            vdpch6.value = data[56][1];
            vdpch7.value = data[57][1];
            vdpch8.value = data[58][1];
            vdpch9.value = data[59][1];
            vdpch10.value = data[60][1];

            davdpch1.value = data[51][2];
            davdpch2.value = data[52][2];
            davdpch3.value = data[53][2];
            davdpch4.value = data[54][2];
            davdpch5.value = data[55][2];
            davdpch6.value = data[56][2];
            davdpch7.value = data[57][2];
            davdpch8.value = data[58][2];
            davdpch9.value = data[59][2];
            davdpch10.value = data[60][2];


            //Khởi động O22
            //Lượt 1

            var kdo22l1c1 = document.getElementById("kdo22l1c1");
            var kdo22l1c2 = document.getElementById("kdo22l1c2");
            var kdo22l1c3 = document.getElementById("kdo22l1c3");
            var kdo22l1c4 = document.getElementById("kdo22l1c4");
            var kdo22l1c5 = document.getElementById("kdo22l1c5");
            var kdo22l1c6 = document.getElementById("kdo22l1c6");
            var kdo22l1c7 = document.getElementById("kdo22l1c7");
            var kdo22l1c8 = document.getElementById("kdo22l1c8");
            var kdo22l1c9 = document.getElementById("kdo22l1c9");
            var kdo22l1c10 = document.getElementById("kdo22l1c10");
            var kdo22l1c11 = document.getElementById("kdo22l1c11");
            var kdo22l1c12 = document.getElementById("kdo22l1c12");
            var kdo22l1c13 = document.getElementById("kdo22l1c13");
            var kdo22l1c14 = document.getElementById("kdo22l1c14");
            var kdo22l1c15 = document.getElementById("kdo22l1c15");


            var dakdo22l1c1 = document.getElementById("dakdo22l1c1");
            var dakdo22l1c2 = document.getElementById("dakdo22l1c2");
            var dakdo22l1c3 = document.getElementById("dakdo22l1c3");
            var dakdo22l1c4 = document.getElementById("dakdo22l1c4");
            var dakdo22l1c5 = document.getElementById("dakdo22l1c5");
            var dakdo22l1c6 = document.getElementById("dakdo22l1c6");
            var dakdo22l1c7 = document.getElementById("dakdo22l1c7");
            var dakdo22l1c8 = document.getElementById("dakdo22l1c8");
            var dakdo22l1c9 = document.getElementById("dakdo22l1c9");
            var dakdo22l1c10 = document.getElementById("dakdo22l1c10");
            var dakdo22l1c11 = document.getElementById("dakdo22l1c11");
            var dakdo22l1c12 = document.getElementById("dakdo22l1c12");
            var dakdo22l1c13 = document.getElementById("dakdo22l1c13");
            var dakdo22l1c14 = document.getElementById("dakdo22l1c14");
            var dakdo22l1c15 = document.getElementById("dakdo22l1c15");


            kdo22l1c1.value = data[64][1];
            kdo22l1c2.value = data[65][1];
            kdo22l1c3.value = data[66][1];
            kdo22l1c4.value = data[67][1];
            kdo22l1c5.value = data[68][1];
            kdo22l1c6.value = data[69][1];
            kdo22l1c7.value = data[70][1];
            kdo22l1c8.value = data[71][1];
            kdo22l1c9.value = data[72][1];
            kdo22l1c10.value = data[73][1];
            kdo22l1c11.value = data[74][1];
            kdo22l1c12.value = data[75][1];
            kdo22l1c13.value = data[76][1];
            kdo22l1c14.value = data[77][1];
            kdo22l1c15.value = data[78][1];

            dakdo22l1c1.value = data[64][2];
            dakdo22l1c2.value = data[65][2];
            dakdo22l1c3.value = data[66][2];
            dakdo22l1c4.value = data[67][2];
            dakdo22l1c5.value = data[68][2];
            dakdo22l1c6.value = data[69][2];
            dakdo22l1c7.value = data[70][2];
            dakdo22l1c8.value = data[71][2];
            dakdo22l1c9.value = data[72][2];
            dakdo22l1c10.value = data[73][2];
            dakdo22l1c11.value = data[74][2];
            dakdo22l1c12.value = data[75][2];
            dakdo22l1c13.value = data[76][2];
            dakdo22l1c14.value = data[77][2];
            dakdo22l1c15.value = data[78][2];

            //Lượt 2


            var kdo22l2c1 = document.getElementById("kdo22l2c1");
            var kdo22l2c2 = document.getElementById("kdo22l2c2");
            var kdo22l2c3 = document.getElementById("kdo22l2c3");
            var kdo22l2c4 = document.getElementById("kdo22l2c4");
            var kdo22l2c5 = document.getElementById("kdo22l2c5");
            var kdo22l2c6 = document.getElementById("kdo22l2c6");
            var kdo22l2c7 = document.getElementById("kdo22l2c7");
            var kdo22l2c8 = document.getElementById("kdo22l2c8");
            var kdo22l2c9 = document.getElementById("kdo22l2c9");
            var kdo22l2c10 = document.getElementById("kdo22l2c10");
            var kdo22l2c11 = document.getElementById("kdo22l2c11");
            var kdo22l2c12 = document.getElementById("kdo22l2c12");
            var kdo22l2c13 = document.getElementById("kdo22l2c13");
            var kdo22l2c14 = document.getElementById("kdo22l2c14");
            var kdo22l2c15 = document.getElementById("kdo22l2c15");
            var kdo22l2c16 = document.getElementById("kdo22l2c16");
            var kdo22l2c17 = document.getElementById("kdo22l2c17");
            var kdo22l2c18 = document.getElementById("kdo22l2c18");
            var kdo22l2c19 = document.getElementById("kdo22l2c19");
            var kdo22l2c20 = document.getElementById("kdo22l2c20");
            var kdo22l2c21 = document.getElementById("kdo22l2c21");
            var kdo22l2c22 = document.getElementById("kdo22l2c22");
            var kdo22l2c23 = document.getElementById("kdo22l2c23");
            var kdo22l2c24 = document.getElementById("kdo22l2c24");
            var kdo22l2c25 = document.getElementById("kdo22l2c25");


            var dakdo22l2c1 = document.getElementById("dakdo22l2c1");
            var dakdo22l2c2 = document.getElementById("dakdo22l2c2");
            var dakdo22l2c3 = document.getElementById("dakdo22l2c3");
            var dakdo22l2c4 = document.getElementById("dakdo22l2c4");
            var dakdo22l2c5 = document.getElementById("dakdo22l2c5");
            var dakdo22l2c6 = document.getElementById("dakdo22l2c6");
            var dakdo22l2c7 = document.getElementById("dakdo22l2c7");
            var dakdo22l2c8 = document.getElementById("dakdo22l2c8");
            var dakdo22l2c9 = document.getElementById("dakdo22l2c9");
            var dakdo22l2c10 = document.getElementById("dakdo22l2c10");
            var dakdo22l2c11 = document.getElementById("dakdo22l2c11");
            var dakdo22l2c12 = document.getElementById("dakdo22l2c12");
            var dakdo22l2c13 = document.getElementById("dakdo22l2c13");
            var dakdo22l2c14 = document.getElementById("dakdo22l2c14");
            var dakdo22l2c15 = document.getElementById("dakdo22l2c15");
            var dakdo22l2c16 = document.getElementById("dakdo22l2c16");
            var dakdo22l2c17 = document.getElementById("dakdo22l2c17");
            var dakdo22l2c18 = document.getElementById("dakdo22l2c18");
            var dakdo22l2c19 = document.getElementById("dakdo22l2c19");
            var dakdo22l2c20 = document.getElementById("dakdo22l2c20");
            var dakdo22l2c21 = document.getElementById("dakdo22l2c21");
            var dakdo22l2c22 = document.getElementById("dakdo22l2c22");
            var dakdo22l2c23 = document.getElementById("dakdo22l2c23");
            var dakdo22l2c24 = document.getElementById("dakdo22l2c24");
            var dakdo22l2c25 = document.getElementById("dakdo22l2c25");



            kdo22l2c1.value = data[81][1];
            kdo22l2c2.value = data[82][1];
            kdo22l2c3.value = data[83][1];
            kdo22l2c4.value = data[84][1];
            kdo22l2c5.value = data[85][1];
            kdo22l2c6.value = data[86][1];
            kdo22l2c7.value = data[87][1];
            kdo22l2c8.value = data[88][1];
            kdo22l2c9.value = data[89][1];
            kdo22l2c10.value = data[90][1];
            kdo22l2c11.value = data[91][1];
            kdo22l2c12.value = data[92][1];
            kdo22l2c13.value = data[93][1];
            kdo22l2c14.value = data[94][1];
            kdo22l2c15.value = data[95][1];
            kdo22l2c16.value = data[96][1];
            kdo22l2c17.value = data[97][1];
            kdo22l2c18.value = data[98][1];
            kdo22l2c19.value = data[99][1];
            kdo22l2c20.value = data[100][1];
            kdo22l2c21.value = data[101][1];
            kdo22l2c22.value = data[102][1];
            kdo22l2c23.value = data[103][1];
            kdo22l2c24.value = data[104][1];
            kdo22l2c25.value = data[105][1];

            dakdo22l2c1.value = data[81][2];
            dakdo22l2c2.value = data[82][2];
            dakdo22l2c3.value = data[83][2];
            dakdo22l2c4.value = data[84][2];
            dakdo22l2c5.value = data[85][2];
            dakdo22l2c6.value = data[86][2];
            dakdo22l2c7.value = data[87][2];
            dakdo22l2c8.value = data[88][2];
            dakdo22l2c9.value = data[89][2];
            dakdo22l2c10.value = data[90][2];
            dakdo22l2c11.value = data[91][2];
            dakdo22l2c12.value = data[92][2];
            dakdo22l2c13.value = data[93][2];
            dakdo22l2c14.value = data[94][2];
            dakdo22l2c15.value = data[95][2];
            dakdo22l2c16.value = data[96][2];
            dakdo22l2c17.value = data[97][2];
            dakdo22l2c18.value = data[98][2];
            dakdo22l2c19.value = data[99][2];
            dakdo22l2c20.value = data[100][2];
            dakdo22l2c21.value = data[101][2];
            dakdo22l2c22.value = data[102][2];
            dakdo22l2c23.value = data[103][2];
            dakdo22l2c24.value = data[104][2];
            dakdo22l2c25.value = data[105][2];


            //Lượt 3

            var kdo22l3c1 = document.getElementById("kdo22l3c1");
            var kdo22l3c2 = document.getElementById("kdo22l3c2");
            var kdo22l3c3 = document.getElementById("kdo22l3c3");
            var kdo22l3c4 = document.getElementById("kdo22l3c4");
            var kdo22l3c5 = document.getElementById("kdo22l3c5");
            var kdo22l3c6 = document.getElementById("kdo22l3c6");
            var kdo22l3c7 = document.getElementById("kdo22l3c7");
            var kdo22l3c8 = document.getElementById("kdo22l3c8");
            var kdo22l3c9 = document.getElementById("kdo22l3c9");
            var kdo22l3c10 = document.getElementById("kdo22l3c10");
            var kdo22l3c11 = document.getElementById("kdo22l3c11");
            var kdo22l3c12 = document.getElementById("kdo22l3c12");
            var kdo22l3c13 = document.getElementById("kdo22l3c13");
            var kdo22l3c14 = document.getElementById("kdo22l3c14");
            var kdo22l3c15 = document.getElementById("kdo22l3c15");
            var kdo22l3c16 = document.getElementById("kdo22l3c16");
            var kdo22l3c17 = document.getElementById("kdo22l3c17");
            var kdo22l3c18 = document.getElementById("kdo22l3c18");
            var kdo22l3c19 = document.getElementById("kdo22l3c19");
            var kdo22l3c20 = document.getElementById("kdo22l3c20");
            var kdo22l3c21 = document.getElementById("kdo22l3c21");
            var kdo22l3c22 = document.getElementById("kdo22l3c22");
            var kdo22l3c23 = document.getElementById("kdo22l3c23");
            var kdo22l3c24 = document.getElementById("kdo22l3c24");
            var kdo22l3c25 = document.getElementById("kdo22l3c25");
            var kdo22l3c26 = document.getElementById("kdo22l3c26");
            var kdo22l3c27 = document.getElementById("kdo22l3c27");
            var kdo22l3c28 = document.getElementById("kdo22l3c28");
            var kdo22l3c29 = document.getElementById("kdo22l3c29");
            var kdo22l3c30 = document.getElementById("kdo22l3c30");
            var kdo22l3c31 = document.getElementById("kdo22l3c31");
            var kdo22l3c32 = document.getElementById("kdo22l3c32");
            var kdo22l3c33 = document.getElementById("kdo22l3c33");
            var kdo22l3c34 = document.getElementById("kdo22l3c34");
            var kdo22l3c35 = document.getElementById("kdo22l3c35");


            var dakdo22l3c1 = document.getElementById("dakdo22l3c1");
            var dakdo22l3c2 = document.getElementById("dakdo22l3c2");
            var dakdo22l3c3 = document.getElementById("dakdo22l3c3");
            var dakdo22l3c4 = document.getElementById("dakdo22l3c4");
            var dakdo22l3c5 = document.getElementById("dakdo22l3c5");
            var dakdo22l3c6 = document.getElementById("dakdo22l3c6");
            var dakdo22l3c7 = document.getElementById("dakdo22l3c7");
            var dakdo22l3c8 = document.getElementById("dakdo22l3c8");
            var dakdo22l3c9 = document.getElementById("dakdo22l3c9");
            var dakdo22l3c10 = document.getElementById("dakdo22l3c10");
            var dakdo22l3c11 = document.getElementById("dakdo22l3c11");
            var dakdo22l3c12 = document.getElementById("dakdo22l3c12");
            var dakdo22l3c13 = document.getElementById("dakdo22l3c13");
            var dakdo22l3c14 = document.getElementById("dakdo22l3c14");
            var dakdo22l3c15 = document.getElementById("dakdo22l3c15");
            var dakdo22l3c16 = document.getElementById("dakdo22l3c16");
            var dakdo22l3c17 = document.getElementById("dakdo22l3c17");
            var dakdo22l3c18 = document.getElementById("dakdo22l3c18");
            var dakdo22l3c19 = document.getElementById("dakdo22l3c19");
            var dakdo22l3c20 = document.getElementById("dakdo22l3c20");
            var dakdo22l3c21 = document.getElementById("dakdo22l3c21");
            var dakdo22l3c22 = document.getElementById("dakdo22l3c22");
            var dakdo22l3c23 = document.getElementById("dakdo22l3c23");
            var dakdo22l3c24 = document.getElementById("dakdo22l3c24");
            var dakdo22l3c25 = document.getElementById("dakdo22l3c25");
            var dakdo22l3c26 = document.getElementById("dakdo22l3c26");
            var dakdo22l3c27 = document.getElementById("dakdo22l3c27");
            var dakdo22l3c28 = document.getElementById("dakdo22l3c28");
            var dakdo22l3c29 = document.getElementById("dakdo22l3c29");
            var dakdo22l3c30 = document.getElementById("dakdo22l3c30");
            var dakdo22l3c31 = document.getElementById("dakdo22l3c31");
            var dakdo22l3c32 = document.getElementById("dakdo22l3c32");
            var dakdo22l3c33 = document.getElementById("dakdo22l3c33");
            var dakdo22l3c34 = document.getElementById("dakdo22l3c34");
            var dakdo22l3c35 = document.getElementById("dakdo22l3c35");



            kdo22l3c1.value = data[108][1];
            kdo22l3c2.value = data[109][1];
            kdo22l3c3.value = data[110][1];
            kdo22l3c4.value = data[111][1];
            kdo22l3c5.value = data[112][1];
            kdo22l3c6.value = data[113][1];
            kdo22l3c7.value = data[114][1];
            kdo22l3c8.value = data[115][1];
            kdo22l3c9.value = data[116][1];
            kdo22l3c10.value = data[117][1];
            kdo22l3c11.value = data[118][1];
            kdo22l3c12.value = data[119][1];
            kdo22l3c13.value = data[120][1];
            kdo22l3c14.value = data[121][1];
            kdo22l3c15.value = data[122][1];
            kdo22l3c16.value = data[123][1];
            kdo22l3c17.value = data[124][1];
            kdo22l3c18.value = data[125][1];
            kdo22l3c19.value = data[126][1];
            kdo22l3c20.value = data[127][1];
            kdo22l3c21.value = data[128][1];
            kdo22l3c22.value = data[129][1];
            kdo22l3c23.value = data[130][1];
            kdo22l3c24.value = data[131][1];
            kdo22l3c25.value = data[132][1];
            kdo22l3c26.value = data[133][1];
            kdo22l3c27.value = data[134][1];
            kdo22l3c28.value = data[135][1];
            kdo22l3c29.value = data[136][1];
            kdo22l3c30.value = data[137][1];
            kdo22l3c31.value = data[138][1];
            kdo22l3c32.value = data[139][1];
            kdo22l3c33.value = data[140][1];
            kdo22l3c34.value = data[141][1];
            kdo22l3c35.value = data[142][1];

            dakdo22l3c1.value = data[108][2];
            dakdo22l3c2.value = data[109][2];
            dakdo22l3c3.value = data[110][2];
            dakdo22l3c4.value = data[111][2];
            dakdo22l3c5.value = data[112][2];
            dakdo22l3c6.value = data[113][2];
            dakdo22l3c7.value = data[114][2];
            dakdo22l3c8.value = data[115][2];
            dakdo22l3c9.value = data[116][2];
            dakdo22l3c10.value = data[117][2];
            dakdo22l3c11.value = data[118][2];
            dakdo22l3c12.value = data[119][2];
            dakdo22l3c13.value = data[120][2];
            dakdo22l3c14.value = data[121][2];
            dakdo22l3c15.value = data[122][2];
            dakdo22l3c16.value = data[123][2];
            dakdo22l3c17.value = data[124][2];
            dakdo22l3c18.value = data[125][2];
            dakdo22l3c19.value = data[126][2];
            dakdo22l3c20.value = data[127][2];
            dakdo22l3c21.value = data[128][2];
            dakdo22l3c22.value = data[129][2];
            dakdo22l3c23.value = data[130][2];
            dakdo22l3c24.value = data[131][2];
            dakdo22l3c25.value = data[132][2];
            dakdo22l3c26.value = data[133][2];
            dakdo22l3c27.value = data[134][2];
            dakdo22l3c28.value = data[135][2];
            dakdo22l3c29.value = data[136][2];
            dakdo22l3c30.value = data[137][2];
            dakdo22l3c31.value = data[138][2];
            dakdo22l3c32.value = data[139][2];
            dakdo22l3c33.value = data[140][2];
            dakdo22l3c34.value = data[141][2];
            dakdo22l3c35.value = data[142][2];



            document.getElementById("notify-uploadexcel").style.display = 'block';
            document.getElementById("notify-uploadexcel").innerHTML = 'CÂU HỎI VÀ TRẢ LỜI ĐÃ ĐƯỢC TỰ ĐỘNG ĐIỀN. VUI LÒNG CHỌN <a style="color:white">LƯU TẤT CẢ CÂU HỎI & ĐÁP ÁN</a> SAU KHI ĐÃ KIỂM TRA NỘI DUNG ĐỀ Ở CÁC MỤC PHẦN THI';
            document.getElementById("notify-uploadexcel-error").style.display = 'none';
        } catch (err) {

            document.getElementById("notify-uploadexcel").style.display = 'none';
            document.getElementById("notify-uploadexcel-error").style.display = 'block';
            document.getElementById("notify-uploadexcel-error").innerHTML = 'FILE EXCEL KHÔNG HỢP LỆ'
            console.log(err);
        }
    })
}

function DeleteAllQuestion() {
    if (confirm("Bạn có chắc chắn muốn xoá toàn bộ câu hỏi và đáp án không? Thao tác này không thể hoàn tác!") == true) {
        var defaultcauhoi = {
            cauhoi: ""
        }
        var defaultdapan = {
            dapan: ""
        }
        var defaultkd = {
            cau1: "",
            cau2: "",
            cau3: "",
            cau4: "",
            cau5: "",
            cau6: "",
            cau7: "",
            cau8: "",
            cau9: "",
            cau10: "",
            cau11: "",
            cau12: "",
            cau13: "",
            cau14: "",
            cau15: "",
            cau16: "",
            cau17: "",
            cau18: "",
            cau19: "",
            cau20: "",


            dacau1: "",
            dacau2: "",
            dacau3: "",
            dacau4: "",
            dacau5: "",
            dacau6: "",
            dacau7: "",
            dacau8: "",
            dacau9: "",
            dacau10: "",
            dacau11: "",
            dacau12: "",
            dacau13: "",
            dacau14: "",
            dacau15: "",
            dacau16: "",
            dacau17: "",
            dacau18: "",
            dacau19: "",
            dacau20: "",
        }

        var defaultchp = {
            cau1: "",
            cau2: "",
            cau3: "",
            cau4: "",
            cau5: "",
            cau6: "",
            cau7: "",
            cau8: "",
            cau9: "",
            cau10: "",

            dacau1: "",
            dacau2: "",
            dacau3: "",
            dacau4: "",
            dacau5: "",
            dacau6: "",
            dacau7: "",
            dacau8: "",
            dacau9: "",
            dacau10: "",
        }
        var defaultcauhoidapan = {
            cauhoi: "",
            dapan: "",
        }



        firebase.database().ref(matchid + '/AccelerationQuestion/QS1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/AccelerationQuestion/QS2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/AccelerationQuestion/QS3').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/AccelerationQuestion/QS4').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP10/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP20/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q1DB/QP30/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP10/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP20/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q2DB/QP30/3').set(defaultcauhoidapan);




        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP10/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP20/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q3DB/QP30/3').set(defaultcauhoidapan);




        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP10/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP20/3').set(defaultcauhoidapan);

        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/FinishQuestion/Q4DB/QP30/3').set(defaultcauhoidapan);


        firebase.database().ref(matchid + '/StartQuestion/Q1DB').set(defaultkd);
        firebase.database().ref(matchid + '/StartQuestion/Q2DB').set(defaultkd);
        firebase.database().ref(matchid + '/StartQuestion/Q3DB').set(defaultkd);
        firebase.database().ref(matchid + '/StartQuestion/Q4DB').set(defaultkd);

        firebase.database().ref(matchid + '/VCNVQuestion/HN1').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/VCNVQuestion/HN2').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/VCNVQuestion/HN3').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/VCNVQuestion/HN4').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/VCNVQuestion/HNTT').set(defaultcauhoidapan);
        firebase.database().ref(matchid + '/CHPQuestion').set(defaultchp);

        Notification("Đặt lại câu hỏi và đáp án thành công")
        setTimeout(function () {
            location.reload();
        }, 3000);
    } else {

    }
}

function DeleteAllImageVideo() {
    if (confirm("Bạn có chắc chắn muốn xoá toàn bộ ảnh và video không? Thao tác này không thể hoàn tác!") == true) {
        firebase.storage().ref(matchid + '/video/intro.mp4').delete();
        firebase.storage().ref(matchid + '/video/kd/intro.mp4').delete();
        firebase.storage().ref(matchid + '/video/vcnv/intro.mp4').delete();
        firebase.storage().ref(matchid + '/video/tt/intro.mp4').delete();
        firebase.storage().ref(matchid + '/video/vd/intro.mp4').delete();
        firebase.storage().ref(matchid + '/img/cnv/cnv.jpg').delete();
        firebase.storage().ref(matchid + '/img/cnv/cnv.png').delete();
        firebase.storage().ref(matchid + '/tt/tt1/tt1.jpg').delete();
        firebase.storage().ref(matchid + '/tt/tt1/tt1.mp4').delete();
        firebase.storage().ref(matchid + '/tt/datt1/tt1.jpg').delete();
        firebase.storage().ref(matchid + '/tt/tt2/tt2.jpg').delete();
        firebase.storage().ref(matchid + '/tt/tt2/tt2.mp4').delete();
        firebase.storage().ref(matchid + '/tt/datt2/tt2.jpg').delete();
        firebase.storage().ref(matchid + '/tt/tt3/tt3.jpg').delete();
        firebase.storage().ref(matchid + '/tt/tt3/tt3.mp4').delete();
        firebase.storage().ref(matchid + '/tt/datt3/tt3.jpg').delete();
        firebase.storage().ref(matchid + '/tt/tt4/tt4.jpg').delete();
        firebase.storage().ref(matchid + '/tt/tt4/tt4.mp4').delete();
        firebase.storage().ref(matchid + '/tt/datt4/tt4.jpg').delete();
        firebase.storage().ref(matchid + '/vd/vd1/vd.mp4').delete();
        firebase.storage().ref(matchid + '/vd/vd1/vd.mp3').delete();
        firebase.storage().ref(matchid + '/vd/vd2/vd.mp4').delete();
        firebase.storage().ref(matchid + '/vd/vd2/vd.mp3').delete();
        firebase.storage().ref(matchid + '/vd/vd3/vd.mp4').delete();
        firebase.storage().ref(matchid + '/vd/vd3/vd.mp3').delete();
        firebase.storage().ref(matchid + '/vd/vd4/vd.mp4').delete();
        firebase.storage().ref(matchid + '/vd/vd4/vd.mp3').delete();
        document.getElementById("notify-general1").innerHTML = "XOÁ THÀNH CÔNG. ĐANG RELOAD LẠI TRANG..."
        setTimeout(function () {
            location.reload();
        }, 3000);
    } else {

    }
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function DeleteTournament() {
    if (confirm("Bạn có chắc chắn muốn xoá trận/giải đấu không? Thao tác này không thể hoàn tác! / Lưu ý: Vui lòng tắt tab Điều khiển phòng trò chơi trước khi thực hiện lệnh này") == true) {
        localStorage.setItem("oldmatchremove", matchid);
        DeleteAllImageVideo();
        firebase.database().ref('/' + matchid).remove();
        setCookie("matchid", "", 7);
        localStorage.setItem("match", "");
        document.getElementById("notify-general1").innerHTML = "XOÁ THÀNH CÔNG. ĐANG TRỞ VỀ TRANG CHỦ..."
        setTimeout(function () {
            firebase.database().ref('/' + localStorage.getItem("oldmatchremove")).remove();
            localStorage.removeItem("oldmatchremove");
            setTimeout(function () {
                location.replace("/Main.html");
            }, 3200);
        }, 3000);
    } else {

    }
}


function uploadIntroVideo() {
    if (file.size < 8000000) {
        Notification("Đang tải lên file Intro đầu");
        firebase.storage().ref(matchid + '/video/intro.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Đã tải file Intro đầu thành công");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng file vượt quá 8MB");
    }
}

function uploadIntroKD() {
    if (file.size < 8000000) {
        Notification("Đang tải lên file Intro Khởi động");
        firebase.storage().ref(matchid + '/video/kd/intro.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Đã tải file Intro Khởi động thành công");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng file vượt quá 8MB")
    }
}

function uploadIntroVCNV() {
    if (file.size < 8000000) {
        Notification("Đang tải lên file Intro Vượt chướng ngại vật");
        firebase.storage().ref(matchid + '/video/vcnv/intro.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Đã tải file Intro Vượt chướng ngại vật thành công");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng file vượt quá 8MB")
    }
}

function uploadIntroTT() {
    if (file.size < 8000000) {
        Notification("Đang tải lên file Intro Tăng tốc");
        firebase.storage().ref(matchid + '/video/tt/intro.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Đã tải file Intro Tăng tốc thành công");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng file vượt quá 8MB")
    }
}


function uploadIntroVD() {
    if (file.size < 8000000) {
        Notification("Đang tải lên file Intro Về đích");
        firebase.storage().ref(matchid + '/video/vd/intro.mp4').put(file).then(function () {
            setTimeout(function () {
                Notification("Đã tải file Intro Về đích thành công");
            }, 3000);
        }).catch(error => {
            console.log(error.message);
        })
    } else {
        Notification("Dung lượng file vượt quá 8MB")
    }
}


function SwitchQuestionManager(value) {
    localStorage.setItem("QuestionManagerSelection", value)
};



setInterval(function () {



    if (localStorage.getItem("QuestionManagerSelection") == null) {
        localStorage.setItem("QuestionManagerSelection", "GeneralInfo");

        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartO23Btn").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';
    }
    if (localStorage.getItem("QuestionManagerSelection") == "GeneralInfo") {
        document.getElementById("GeneralInfo").style.display = 'block';
        document.getElementById("Obstacle").style.display = 'none';
        document.getElementById("Acceleration").style.display = 'none';
        document.getElementById("Finish").style.display = 'none';
        document.getElementById("ExtraQuestion").style.display = 'none';
        document.getElementById("Start").style.display = 'none';
        document.getElementById("StartO23").style.display = 'none';

        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtnO23").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';
    }

    if (localStorage.getItem("QuestionManagerSelection") == "Start") {
        document.getElementById("GeneralInfo").style.display = 'none';
        document.getElementById("Obstacle").style.display = 'none';
        document.getElementById("Acceleration").style.display = 'none';
        document.getElementById("Finish").style.display = 'none';
        document.getElementById("ExtraQuestion").style.display = 'none';
        document.getElementById("Start").style.display = 'block';
        document.getElementById("StartO23").style.display = 'none';


        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
        document.getElementById("StartBtnO23").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';

    }
    if (localStorage.getItem("QuestionManagerSelection") == "StartO23") {
        document.getElementById("GeneralInfo").style.display = 'none';
        document.getElementById("Obstacle").style.display = 'none';
        document.getElementById("Acceleration").style.display = 'none';
        document.getElementById("Finish").style.display = 'none';
        document.getElementById("ExtraQuestion").style.display = 'none';
        document.getElementById("Start").style.display = 'none';
        document.getElementById("StartO23").style.display = 'block';


        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtnO23").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';

    }

    if (localStorage.getItem("QuestionManagerSelection") == "Obstacle") {
        document.getElementById("GeneralInfo").style.display = 'none';
        document.getElementById("Obstacle").style.display = 'block';
        document.getElementById("Acceleration").style.display = 'none';
        document.getElementById("Finish").style.display = 'none';
        document.getElementById("ExtraQuestion").style.display = 'none';
        document.getElementById("Start").style.display = 'none';
        document.getElementById("StartO23").style.display = 'none';


        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtnO23").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';

    }

    if (localStorage.getItem("QuestionManagerSelection") == "Acceleration") {
        document.getElementById("GeneralInfo").style.display = 'none';
        document.getElementById("Obstacle").style.display = 'none';
        document.getElementById("Acceleration").style.display = 'block';
        document.getElementById("Finish").style.display = 'none';
        document.getElementById("ExtraQuestion").style.display = 'none';
        document.getElementById("Start").style.display = 'none';
        document.getElementById("StartO23").style.display = 'none';


        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtnO23").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';

    }

    if (localStorage.getItem("QuestionManagerSelection") == "Finish") {
        document.getElementById("GeneralInfo").style.display = 'none';
        document.getElementById("Obstacle").style.display = 'none';
        document.getElementById("Acceleration").style.display = 'none';
        document.getElementById("Finish").style.display = 'block';
        document.getElementById("ExtraQuestion").style.display = 'none';
        document.getElementById("Start").style.display = 'none';
        document.getElementById("StartO23").style.display = 'none';



        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtnO23").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';

    }

    if (localStorage.getItem("QuestionManagerSelection") == "ExtraQuestion") {
        document.getElementById("GeneralInfo").style.display = 'none';
        document.getElementById("Obstacle").style.display = 'none';
        document.getElementById("Acceleration").style.display = 'none';
        document.getElementById("Finish").style.display = 'none';
        document.getElementById("ExtraQuestion").style.display = 'block';
        document.getElementById("Start").style.display = 'none';
        document.getElementById("StartO23").style.display = 'none';



        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtnO23").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';

    }

    if (localStorage.getItem("QuestionManagerSelection") == "MultipleChoice") {
        document.getElementById("GeneralInfo").style.display = 'none';
        document.getElementById("Obstacle").style.display = 'none';
        document.getElementById("Acceleration").style.display = 'none';
        document.getElementById("Finish").style.display = 'none';
        document.getElementById("ExtraQuestion").style.display = 'none';
        document.getElementById("Start").style.display = 'none';
        document.getElementById("StartO23").style.display = 'none';



        document.getElementById("GeneralInfoBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtn").style.backgroundImage = 'none';
        document.getElementById("StartBtnO23").style.backgroundImage = 'none';
        document.getElementById("ObstacleBtn").style.backgroundImage = 'none';
        document.getElementById("AccelerationBtn").style.backgroundImage = 'none';
        document.getElementById("FinishBtn").style.backgroundImage = 'none';
        document.getElementById("AdditionalBtn").style.backgroundImage = 'none';

    }



}, 100);


document.getElementById('videoForm').addEventListener('submit', addVideo);

function addVideo(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    let link = document.getElementById('link').value;

    // Check if the link is a YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    if (youtubeRegex.test(link)) {
        link += "&autoplay=1&amp;controls=0&amp;rel=0";
    }

    const newVideoRef = firebase.database().ref(matchid + '/CustomVideo').push();
    newVideoRef.set({
        title: title,
        embededLink: link
    });

    document.getElementById('videoForm').reset();
}

// Listen for changes in Firebase and update the UI
const videoTable = document.getElementById('videoTableBody');
const videoRef = firebase.database().ref(matchid + '/CustomVideo');

videoRef.on('child_added', (data) => {
    console.log('Child added: ', data.val());
    addVideoToTable(data.key, data.val().title, data.val().embededLink);
});

videoRef.on('child_removed', (data) => {
    console.log('Child removed: ', data.key);
    removeVideoFromTable(data.key);
});

videoRef.on('child_changed', (data) => {
    console.log('Child changed: ', data.val());
    updateVideoInTable(data.key, data.val().title, data.val().embededLink);
});

function addVideoToTable(key, title, link) {
    const tr = document.createElement('tr');
    tr.id = key;
    tr.innerHTML = `
        <td style="color:white;">${title}</td>
        <td style="color:white;">${link}</td>
        <td><button onclick="window.open('${link}');">Xem</button></td>
        <td><button onclick="editVideo('${key}', '${title}', '${link}')">Sửa</button></td>
        <td><button onclick="removeVideo('${key}')">Xoá</button></td>
    `;
    videoTable.appendChild(tr);
}

function removeVideoFromTable(key) {
    const tr = document.getElementById(key);
    if (tr) {
        tr.remove();
    }
}

function updateVideoInTable(key, title, link) {
    const tr = document.getElementById(key);
    if (tr) {
        tr.innerHTML = `
        <td style="color:white;">${title}</td>
        <td style="color:white;">${link}</td>
        <td><button onclick="window.open('${link}');">Xem</button></td>
        <td><button onclick="editVideo('${key}', '${title}', '${link}')">Sửa</button></td>
        <td><button onclick="removeVideo('${key}')">Xoá</button></td>
        `;
    }
}
function removeVideo(key) {
    const videoRef = firebase.database().ref(matchid + '/CustomVideo').child(key);
    videoRef.remove().then(() => {
        console.log('Video removed successfully');
    }).catch((error) => {
        console.error('Error removing video: ', error);
    });
}

function editVideo(key, title, link) {
    const newTitle = prompt("Enter new title:", title);
    const newLink = prompt("Enter new embedded link:", link);
    if (newTitle && newLink) {
        const videoRef = firebase.database().ref(matchid + '/CustomVideo').child(key);
        videoRef.set({
            title: newTitle,
            embededLink: newLink
        }).then(() => {
            console.log('Video updated successfully');
        }).catch((error) => {
            console.error('Error updating video: ', error);
        });
    }
}