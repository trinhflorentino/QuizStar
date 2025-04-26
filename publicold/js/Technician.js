// auth.onAuthStateChanged(function (user) {

//     if (user) {
//         user.getIdTokenResult().then(idTokenResult => {
//             user.admin = idTokenResult.claims.admin;
//             if (user.admin == true) { } else {
//                 alert("Bạn không có quyền truy cập trang này!");
//                 location.replace("Main.html");
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






var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
var refthisinhkhoidong = firebase.database().ref(matchid + "/playerstatus/khoidong");
var refkhoidongbatdau = firebase.database().ref(matchid + "/phanthistatus/khoidong");
var khoidongdungsai = firebase.database().ref(matchid + '/khoidongdungsai');
var refintro = firebase.database().ref(matchid + "/intro");
var chat = firebase.database().ref(matchid + '/chat');
var qsreplace = firebase.database().ref(matchid + '/khoidong');
var refintroreplay = firebase.database().ref(matchid + "/replayintro");
var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
var hangngangvcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
var dungsaihangngang = firebase.database().ref(matchid + '/VCNV/hangngang');
var vcnvstatus = firebase.database().ref(matchid + '/phanthistatus/vcnv');
var tangtocstatus = firebase.database().ref(matchid + "/phanthistatus/tangtoc");
var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
var refpointcheckstatus = firebase.database().ref(matchid + "/FinishPoint/status");
var refvedichbatdau = firebase.database().ref(matchid + "/phanthistatus/vedich");
var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");
var refkhoidongo22 = firebase.database().ref(matchid + "/gamestatus/khoidongo22");
var refbanner = firebase.database().ref(matchid + "/gamestatus/banner");


var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');

var TTANS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Answer');
var TTANS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Answer');
var TTANS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Answer');
var TTANS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Answer');

var TTANSTIMESTAMPS1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/Timestamp');
var TTANSTIMESTAMPS2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/Timestamp');
var TTANSTIMESTAMPS3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/Timestamp');
var TTANSTIMESTAMPS4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/Timestamp');

var TTANSKT = firebase.database().ref(matchid + "/AccelerationAnswer/kiemtradapan");
var TTCORRECTORWRONG1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS1/CorrectOrWrong');
var TTCORRECTORWRONG2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS2/CorrectOrWrong');
var TTCORRECTORWRONG3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS3/CorrectOrWrong');
var TTCORRECTORWRONG4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS4/CorrectOrWrong');

var CNVANSKT = firebase.database().ref(matchid + '/VCNVAnswer/kiemtradapan');
var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');

var CNVROW1 = firebase.database().ref(matchid + '/VCNVRowStatus/HN1');
var CNVROW2 = firebase.database().ref(matchid + '/VCNVRowStatus/HN2');
var CNVROW3 = firebase.database().ref(matchid + '/VCNVRowStatus/HN3');
var CNVROW4 = firebase.database().ref(matchid + '/VCNVRowStatus/HN4');
var CNVROWTT = firebase.database().ref(matchid + '/VCNVRowStatus/HNTT');

var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');

var TS1ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS1');
var TS2ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS2');
var TS3ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS3');
var TS4ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS4');

var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');


var checkboxda1 = document.getElementById("da1");
var checkboxda2 = document.getElementById("da2");
var checkboxda3 = document.getElementById("da3");
var checkboxda4 = document.getElementById("da4");

var checkboxdatt1 = document.getElementById("datt1");
var checkboxdatt2 = document.getElementById("datt2");
var checkboxdatt3 = document.getElementById("datt3");
var checkboxdatt4 = document.getElementById("datt4");

var checkboxvd10diemcau1 = document.getElementById("vd10diemcau1");
var checkboxvd20diemcau1 = document.getElementById("vd20diemcau1");
var checkboxvd30diemcau1 = document.getElementById("vd30diemcau1");
var checkboxvd10diemcau2 = document.getElementById("vd10diemcau2");
var checkboxvd20diemcau2 = document.getElementById("vd20diemcau2");
var checkboxvd30diemcau2 = document.getElementById("vd30diemcau2");
var checkboxvd10diemcau3 = document.getElementById("vd10diemcau3");
var checkboxvd20diemcau3 = document.getElementById("vd20diemcau3");
var checkboxvd30diemcau3 = document.getElementById("vd30diemcau3");

var refvedichdungsai = firebase.database().ref(matchid + '/VDCorrectOrWrong/');
var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
var VDChuongPlayer = firebase.database().ref(matchid + "/VDChuong/Player");
var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");


var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');

var vcnvanswerrow = document.getElementById("audio_15");



function resetOpenall() {

    var VCNVCORRECT = firebase.database().ref(matchid + '/VCNVChuong/OpenAll');
    var dung = {
        correct: 0,
    }
    VCNVCORRECT.set(dung);

}



var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
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
                dapan1.innerHTML = dapans1;
                dapan2.innerHTML = dapans2;
                dapan3.innerHTML = dapans3;
                dapan4.innerHTML = dapans4;
            }
        }
    }
}


function start() {
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: 0
    }
    intronumber.set(intronumset);
    var StartEmergencyStop = firebase.database().ref(matchid + '/StartEmergencyStop');
    var stop = {
        stop: 0
    }
    StartEmergencyStop.set(stop);
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var khoidong = {
        start: 1
    }
    refkhoidong.set(khoidong);
    var qsreplace = firebase.database().ref(matchid + '/khoidong');
    var khoidong = {
        causo: 0,
    }
    var intro = {
        intro: 0
    }
    var vcnv = {
        vcnv: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tongketdiem = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        veidichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
    refkhoidongo22.set(khoidongo22);
    qsreplace.set(khoidong);
    refintro.set(intro);
    refvcnv.set(vcnv);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tongketdiem);
    refvedich.set(vedich);
    refvedichphu.set(vedichphu);
    document.getElementById("StartingStart").disabled = false;
};

function backtomain() {
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: 0
    }
    intronumber.set(intronumset);
    var khoidong = {
        start: 0
    }
    refkhoidong.set(khoidong);
    var vcnv = {
        vcnv: 0
    }
    refvcnv.set(vcnv);
    var khoidong = {
        batdau: 0
    }
    var refkhoidongbatdau = firebase.database().ref(matchid + "/phanthistatus/khoidong");
    refkhoidongbatdau.set(khoidong);
    var intro = {
        intro: 0
    }
    refintro.set(intro);
    var tangtoc = {
        tangtoc: 0
    }
    reftangtoc.set(tangtoc);
    var tongkd = {
        tongketdiem: 0
    }
    reftongketdiem.set(tongkd);
    var vedich = {
        vedich: 0
    }
    refvedich.set(vedich);
    var vedichphu = {
        vedichphu: 0
    }
    refvedichphu.set(vedichphu);
    var khoidongo22 = {
        khoidongo22: 0
    }
    refkhoidongo22.set(khoidongo22);
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
};

function tsreset() {

    var refthisinhkhoidong = firebase.database().ref(matchid + "/playerstatus/khoidong");
    var player1 = {
        player: 0
    }
    refthisinhkhoidong.set(player1);

}



function ts1khoidong() {

    var refthisinhkhoidong = firebase.database().ref(matchid + "/playerstatus/khoidong");
    var player1 = {
        player: 1
    }
    refthisinhkhoidong.set(player1);
}

function ts2khoidong() {

    var refthisinhkhoidong = firebase.database().ref(matchid + "/playerstatus/khoidong");
    var player2 = {
        player: 2
    }
    refthisinhkhoidong.set(player2);
}

function ts3khoidong() {

    var refthisinhkhoidong = firebase.database().ref(matchid + "/playerstatus/khoidong");
    var player3 = {
        player: 3
    }
    refthisinhkhoidong.set(player3);
}

function ts4khoidong() {

    var refthisinhkhoidong = firebase.database().ref(matchid + "/playerstatus/khoidong");
    var player4 = {
        player: 4
    }
    refthisinhkhoidong.set(player4);
}

function batdaukhoidong() {
    var refthisinhkhoidong = firebase.database().ref(matchid + "/playerstatus/khoidong");
    refthisinhkhoidong.once('value', playerkd);
    function playerkd(pl) {
        if (pl.val().player == 0) {
            Notification("Chọn thí sinh khởi động")
        } else {
            var refkhoidongbatdau = firebase.database().ref(matchid + "/phanthistatus/khoidong");
            var khoidong = {
                batdau: 1
            }
            refkhoidongbatdau.set(khoidong);
            setTimeout(function () {
                var refkhoidongbatdau = firebase.database().ref(matchid + "/phanthistatus/khoidong");
                var khoidong = {
                    batdau: 0
                }
                refkhoidongbatdau.set(khoidong);
            }, 2000);
            setTimeout(function () {
                var qsreplace = firebase.database().ref(matchid + '/khoidong');
                var set = {
                    causo: 1
                }
                qsreplace.set(set);
            }, 7000);
            var qsreplace = firebase.database().ref(matchid + '/khoidong');
            qsreplace.on('value', causo);
            function causo(causo) {
                if (causo.val().causo == 7) {
                    document.getElementById("StartCorrectAns").disabled = true;
                    document.getElementById("StartWrongAns").disabled = true;
                    setTimeout(function () {
                        var qsreplace = firebase.database().ref(matchid + '/khoidong');
                        var set = {
                            causo: 0
                        }
                        qsreplace.set(set);
                        setTimeout(function () {
                            document.getElementById("StartingStart").disabled = false;
                        }, 3000);
                    }, 1000);
                }
            }
            document.getElementById("StartingStart").disabled = true;
        }
    }

}

function CorrectAnswer() {

    var khoidongdungsai = firebase.database().ref(matchid + '/khoidongdungsai');
    var khoidong = {
        dung: 1,
        sai: 0
    }
    khoidongdungsai.set(khoidong);
    var qsreplace = firebase.database().ref(matchid + '/khoidong');
    qsreplace.once('value', Data3)

    function Data3(dt3) {
        var qnumber = dt3.val().causo;
        var set = {
            causo: qnumber + 1,
        }
        qsreplace.set(set);
    }

    var playerstatus = firebase.database().ref(matchid + '/playerstatus/khoidong');
    playerstatus.once('value', Data)

    function Data(dt) {
        player = dt.val().player;

        var pointp1 = firebase.database().ref(matchid + '/point/player' + player);
        pointp1.once('value', point);

        function point(point) {
            var point1 = point.val().point;
            var set = {
                point: point1 + 10,
            }
            pointp1.set(set);
        }
    }
    var khoidong2 = {
        dung: 0,
        sai: 0
    }
    khoidongdungsai.set(khoidong2);

};

function WrongAnswer() {

    var qsreplace = firebase.database().ref(matchid + '/khoidong');
    var khoidongdungsai = firebase.database().ref(matchid + '/khoidongdungsai');
    var khoidong = {
        dung: 0,
        sai: 1
    }
    qsreplace.once('value', Data)

    function Data(dt) {
        var qnumber = dt.val().causo;
        var set = {
            causo: qnumber + 1,
        }
        qsreplace.set(set);
    }
    khoidongdungsai.set(khoidong);
    var khoidong1 = {
        dung: 0,
        sai: 0
    }
    khoidongdungsai.set(khoidong1);

}




function ResetQuestion() {

    var qsreplace = firebase.database().ref(matchid + '/khoidong');
    var set = {
        causo: 0
    }
    qsreplace.set(set);

}



function resetPoint() {

    if (confirm("Bạn có muốn đặt lại điểm không? Thao tác này không thể hoàn tác!") == true) {
        var pointp1 = firebase.database().ref(matchid + '/point/player1');
        var set1 = {
            point: 0
        }
        pointp1.set(set1);

        var pointp2 = firebase.database().ref(matchid + '/point/player2');
        var set2 = {
            point: 0
        }
        pointp2.set(set2);

        var pointp3 = firebase.database().ref(matchid + '/point/player3');
        var set3 = {
            point: 0
        }
        pointp3.set(set3);

        var pointp4 = firebase.database().ref(matchid + '/point/player4');
        var set4 = {
            point: 0
        }
        pointp4.set(set4);
        Notification("Đặt lại điểm của thí sinh thành công");
    } else {

    }


};

function resetChat() {

    var chat = firebase.database().ref(matchid + '/chat');
    if (confirm("Bạn có muốn xoá lịch sử chat không? Thao tác này không thể hoàn tác!") == true) {
        var reset = {

        }
        chat.set(reset);
        Notification("Đã xóa lịch sử Chat thành công")
    } else {

    }


};

function StartIntro() {

    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refintroreplay = firebase.database().ref(matchid + "/replayintro");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: '1'
    }
    var intro = {
        intro: 1
    }
    var khoidong = {
        start: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tkd = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    var vcnv = {
        vcnv: 0
    }
    refvcnv.set(vcnv);
    refbanner.set(banner);
    intronumber.set(intronumset);
    refkhoidongo22.set(khoidongo22);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    refintroreplay.set(intro);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tkd);
    refvedich.set(vedich);
    refintroreplay.set(intro);
    refvedichphu.set(vedichphu);
}


function StartIntroKD() {

    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refintroreplay = firebase.database().ref(matchid + "/replayintro");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: '2'
    }
    var intro = {
        intro: 1
    }
    var khoidong = {
        start: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tkd = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    var vcnv = {
        vcnv: 0
    }
    refvcnv.set(vcnv);
    refbanner.set(banner);
    intronumber.set(intronumset);
    refkhoidongo22.set(khoidongo22);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    refintroreplay.set(intro);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tkd);
    refvedich.set(vedich);
    refintroreplay.set(intro);
    refvedichphu.set(vedichphu);

}

function StartIntroVCNV() {

    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refintroreplay = firebase.database().ref(matchid + "/replayintro");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: '3'
    }
    var intro = {
        intro: 1
    }
    var khoidong = {
        start: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tkd = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    var vcnv = {
        vcnv: 0
    }
    refvcnv.set(vcnv);
    refbanner.set(banner);
    intronumber.set(intronumset);
    refkhoidongo22.set(khoidongo22);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    refintroreplay.set(intro);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tkd);
    refvedich.set(vedich);
    refintroreplay.set(intro);
    refvedichphu.set(vedichphu);

}
function StartIntroTT() {

    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refintroreplay = firebase.database().ref(matchid + "/replayintro");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: '4'
    }
    var intro = {
        intro: 1
    }
    var khoidong = {
        start: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tkd = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    var vcnv = {
        vcnv: 0
    }
    refvcnv.set(vcnv);
    refbanner.set(banner);
    intronumber.set(intronumset);
    refkhoidongo22.set(khoidongo22);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    refintroreplay.set(intro);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tkd);
    refvedich.set(vedich);
    refintroreplay.set(intro);
    refvedichphu.set(vedichphu);

}
function StartIntroVD() {

    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refintroreplay = firebase.database().ref(matchid + "/replayintro");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: '5'
    }
    var intro = {
        intro: 1
    }
    var khoidong = {
        start: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tkd = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    var vcnv = {
        vcnv: 0
    }
    refvcnv.set(vcnv);
    refbanner.set(banner);
    intronumber.set(intronumset);
    refkhoidongo22.set(khoidongo22);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    refintroreplay.set(intro);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tkd);
    refvedich.set(vedich);
    refintroreplay.set(intro);
    refvedichphu.set(vedichphu);

}


function startvcnv() {
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
    var refintro = firebase.database().ref(matchid + "/intro");
    var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
    var hangngangvcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
    var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
    var vcnvstatus = firebase.database().ref(matchid + '/phanthistatus/vcnv');
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: 0
    }
    intronumber.set(intronumset);
    var vcnvct = {
        batdau: 0
    }
    var khoidong = {
        start: 0
    }
    var vcnv = {
        vcnv: 1
    }
    var intro = {
        intro: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tongketdiem = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var hangngangdefault = {
        hn: 0
    }
    var sohangngang = {
        hangngang: 0
    }
    var defaultdisabled = {
        ansbardisabled: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var openansweron = {
        OpenAnswer: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
    refkhoidongo22.set(khoidongo22);
    VCNVOpenAnswer.set(openansweron);
    var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
    CNVPlayed.set(sohangngang);
    hangngangvcnv.set(hangngangdefault);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    refvcnv.set(vcnv);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tongketdiem);
    refvedich.set(vedich);
    vcnvstatus.set(vcnvct)
    refvedichphu.set(vedichphu);
    firebase.database().ref(matchid + '/VCNVDisable/TS1/').set(defaultdisabled);
    firebase.database().ref(matchid + '/VCNVDisable/TS2/').set(defaultdisabled);
    firebase.database().ref(matchid + '/VCNVDisable/TS3/').set(defaultdisabled);
    firebase.database().ref(matchid + '/VCNVDisable/TS4/').set(defaultdisabled);
    var CNVANSKT = firebase.database().ref(matchid + '/VCNVAnswer/kiemtradapan');
    var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
    var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
    var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
    var dungsai = {
        dunghaysai: 0,
    }
    COFCNVTS1.set(dungsai);
    COFCNVTS2.set(dungsai);
    COFCNVTS3.set(dungsai);
    COFCNVTS4.set(dungsai);
    resetAlreadyOpenAnswer();
};

function resetDapan() {



    var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
    var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
    var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
    var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');

    var dapandefault = {
        answer: "",
    }
    CNVANS1.set(dapandefault);
    CNVANS2.set(dapandefault);
    CNVANS3.set(dapandefault);
    CNVANS4.set(dapandefault);
    var dungsai = {
        dunghaysai: 0
    }
    var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
    var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
    var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
    COFCNVTS1.set(dungsai);
    COFCNVTS2.set(dungsai);
    COFCNVTS3.set(dungsai);
    COFCNVTS4.set(dungsai);

};

function hnso1() {
    document.getElementById("VCNVStarting").disabled = false;
    var hangngangvcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
    var hn = {
        hn: 1,
    }
    hangngangvcnv.set(hn);

    var dungsai = {
        dunghaysai: 0
    }
    var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
    var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
    var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
    COFCNVTS1.set(dungsai);
    COFCNVTS2.set(dungsai);
    COFCNVTS3.set(dungsai);
    COFCNVTS4.set(dungsai);
    var buttonhn1 = document.getElementById("overlay-hn1");
    buttonhn1.style.cursor = "pointer";
    var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
    var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
    var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
    var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
    var dapandefault = {
        answer: "",
    }
    CNVANS1.set(dapandefault);
    CNVANS2.set(dapandefault);
    CNVANS3.set(dapandefault);
    CNVANS4.set(dapandefault);
    var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
    CNVPlayed.once('value', CNVNum);

    function CNVNum(cnv) {
        var cnvpl = cnv.val().hangngang;
        var newnum = {
            hangngang: cnvpl + 1
        }
        var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
        CNVPlayed.set(newnum);
    }
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var openansweroff = {
        OpenAnswer: 0
    }
    VCNVOpenAnswer.set(openansweroff);
};

function hnso2() {
    document.getElementById("VCNVStarting").disabled = false;
    var hangngangvcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
    var hn = {
        hn: 2,
    }
    hangngangvcnv.set(hn);

    var dungsai = {
        dunghaysai: 0
    }
    var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
    var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
    var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
    COFCNVTS1.set(dungsai);
    COFCNVTS2.set(dungsai);
    COFCNVTS3.set(dungsai);
    COFCNVTS4.set(dungsai);
    var buttonhn2 = document.getElementById("overlay-hn2");
    buttonhn2.style.cursor = "pointer";
    var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
    var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
    var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
    var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
    var dapandefault = {
        answer: "",
    }
    CNVANS1.set(dapandefault);
    CNVANS2.set(dapandefault);
    CNVANS3.set(dapandefault);
    CNVANS4.set(dapandefault);
    var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
    CNVPlayed.once('value', CNVNum);

    function CNVNum(cnv) {
        var cnvpl = cnv.val().hangngang;
        var newnum = {
            hangngang: cnvpl + 1
        }
        var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
        CNVPlayed.set(newnum);
    }
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var openansweroff = {
        OpenAnswer: 0
    }
    VCNVOpenAnswer.set(openansweroff);

}

function hnso3() {
    document.getElementById("VCNVStarting").disabled = false;
    var hangngangvcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
    var hn = {
        hn: 3,
    }
    hangngangvcnv.set(hn);

    var dungsai = {
        dunghaysai: 0
    }
    var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
    var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
    var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
    COFCNVTS1.set(dungsai);
    COFCNVTS2.set(dungsai);
    COFCNVTS3.set(dungsai);
    COFCNVTS4.set(dungsai);
    var buttonhn3 = document.getElementById("overlay-hn3");
    buttonhn3.style.cursor = "pointer";
    var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
    var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
    var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
    var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
    var dapandefault = {
        answer: "",
    }
    CNVANS1.set(dapandefault);
    CNVANS2.set(dapandefault);
    CNVANS3.set(dapandefault);
    CNVANS4.set(dapandefault);
    var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
    CNVPlayed.once('value', CNVNum);

    function CNVNum(cnv) {
        var cnvpl = cnv.val().hangngang;
        var newnum = {
            hangngang: cnvpl + 1
        }
        var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
        CNVPlayed.set(newnum);
    }
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var openansweroff = {
        OpenAnswer: 0
    }
    VCNVOpenAnswer.set(openansweroff);

}

function hnso4() {
    document.getElementById("VCNVStarting").disabled = false;
    var hangngangvcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
    var hn = {
        hn: 4,
    }
    hangngangvcnv.set(hn);

    var dungsai = {
        dunghaysai: 0
    }
    var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
    var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
    var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
    COFCNVTS1.set(dungsai);
    COFCNVTS2.set(dungsai);
    COFCNVTS3.set(dungsai);
    COFCNVTS4.set(dungsai);
    var buttonhn4 = document.getElementById("overlay-hn4");
    buttonhn4.style.cursor = "pointer";
    var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
    var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
    var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
    var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
    var dapandefault = {
        answer: "",
    }
    CNVANS1.set(dapandefault);
    CNVANS2.set(dapandefault);
    CNVANS3.set(dapandefault);
    CNVANS4.set(dapandefault);
    var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
    CNVPlayed.once('value', CNVNum);

    function CNVNum(cnv) {
        var cnvpl = cnv.val().hangngang;
        var newnum = {
            hangngang: cnvpl + 1
        }
        var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
        CNVPlayed.set(newnum);
    }
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var openansweroff = {
        OpenAnswer: 0
    }
    VCNVOpenAnswer.set(openansweroff);
}

function hntt() {
    document.getElementById("VCNVStarting").disabled = false;
    var hangngangvcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
    var hn = {
        hn: 5,
    }
    hangngangvcnv.set(hn);

    var dungsai = {
        dunghaysai: 0
    }
    var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
    var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
    var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
    var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
    COFCNVTS1.set(dungsai);
    COFCNVTS2.set(dungsai);
    COFCNVTS3.set(dungsai);
    COFCNVTS4.set(dungsai);

    var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
    var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
    var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
    var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
    var dapandefault = {
        answer: "",
    }
    CNVANS1.set(dapandefault);
    CNVANS2.set(dapandefault);
    CNVANS3.set(dapandefault);
    CNVANS4.set(dapandefault);
    var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
    CNVPlayed.once('value', CNVNum);

    function CNVNum(cnv) {
        var cnvpl = cnv.val().hangngang;
        var newnum = {
            hangngang: cnvpl + 1
        }
        var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
        CNVPlayed.set(newnum);
    }
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var openansweroff = {
        OpenAnswer: 0
    }
    VCNVOpenAnswer.set(openansweroff);
}

function vcnvdemgio() {

    var vcnvstatus = firebase.database().ref(matchid + '/phanthistatus/vcnv');
    var demgio = {
        batdau: 1,
    }
    vcnvstatus.set(demgio);
    setTimeout(function () {
        var demgio = {
            batdau: 0,
        }
        vcnvstatus.set(demgio);
    }, 2000);

    document.getElementById("VCNVStarting").disabled = true;

}

function resetCheckVCNV() {

    var vcnvstatus = firebase.database().ref(matchid + '/phanthistatus/vcnv');
    var vcnv = {
        batdau: 0
    }
    vcnvstatus.set(vcnv);

}

function dungCNV() {

    if (confirm("Xác nhận đúng CNV? Nhớ tick thí sinh trả lời đúng CNV trước khi chọn OK.") == true) {
        if (document.querySelector('#da1:checked')) {
            var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
            CNVPlayed.on('value', cnv);

            function cnv(sohn) {
                var pointp1 = firebase.database().ref(matchid + '/point/player1');
                pointp1.once('value', point1);

                function point1(p1) {
                    if (sohn.val().hangngang == 0) {
                        var point1 = p1.val().point;
                        var newpoint = {
                            point: point1 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player1');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 1) {
                        var point1 = p1.val().point;
                        var newpoint = {
                            point: point1 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player1');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 2) {
                        var point1 = p1.val().point;
                        var newpoint = {
                            point: point1 + 50
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player1');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 3) {
                        var point1 = p1.val().point;
                        var newpoint = {
                            point: point1 + 40
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player1');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 4) {
                        var point1 = p1.val().point;
                        var newpoint = {
                            point: point1 + 30
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player1');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 5) {
                        var point1 = p1.val().point;
                        var newpoint = {
                            point: point1 + 20
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player1');
                        pointpupdate.set(newpoint);
                    }
                }
            }
            Notification("Chấm thí sinh trả lời đúng CNV thành công");
        }



        if (document.querySelector('#da2:checked')) {
            var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
            CNVPlayed.on('value', cnv);

            function cnv(sohn) {
                var pointp2 = firebase.database().ref(matchid + '/point/player2');
                pointp2.once('value', point2);

                function point2(p2) {
                    if (sohn.val().hangngang == 0) {
                        var point2 = p2.val().point;
                        var newpoint = {
                            point: point2 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player2');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 1) {
                        var point2 = p2.val().point;
                        var newpoint = {
                            point: point2 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player2');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 2) {
                        var point2 = p2.val().point;
                        var newpoint = {
                            point: point2 + 50
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player2');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 3) {
                        var point2 = p2.val().point;
                        var newpoint = {
                            point: point2 + 40
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player2');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 4) {
                        var point2 = p2.val().point;
                        var newpoint = {
                            point: point2 + 30
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player2');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 5) {
                        var point2 = p2.val().point;
                        var newpoint = {
                            point: point2 + 20
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player2');
                        pointpupdate.set(newpoint);
                    }

                }
            }
            Notification("Chấm thí sinh trả lời đúng CNV thành công");
        }


        if (document.querySelector('#da3:checked')) {
            var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
            CNVPlayed.on('value', cnv);

            function cnv(sohn) {
                var pointp3 = firebase.database().ref(matchid + '/point/player3');
                pointp3.once('value', point3);

                function point3(p3) {
                    if (sohn.val().hangngang == 0) {
                        var point3 = p3.val().point;
                        var newpoint = {
                            point: point3 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player3');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 1) {
                        var point3 = p3.val().point;
                        var newpoint = {
                            point: point3 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player3');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 2) {
                        var point3 = p3.val().point;
                        var newpoint = {
                            point: point3 + 50
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player3');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 3) {
                        var point3 = p3.val().point;
                        var newpoint = {
                            point: point3 + 40
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player3');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 4) {
                        var point3 = p3.val().point;
                        var newpoint = {
                            point: point3 + 30
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player3');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 5) {
                        var point3 = p3.val().point;
                        var newpoint = {
                            point: point3 + 20
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player3');
                        pointpupdate.set(newpoint);
                    }

                }
            }
            Notification("Chấm thí sinh trả lời đúng CNV thành công");
        }



        if (document.querySelector('#da4:checked')) {
            var CNVPlayed = firebase.database().ref(matchid + "/VCNVPlayed/");
            CNVPlayed.on('value', cnv);

            function cnv(sohn) {
                var pointp4 = firebase.database().ref(matchid + '/point/player4');
                pointp4.once('value', point4);

                function point4(p4) {
                    if (sohn.val().hangngang == 0) {
                        var point4 = p4.val().point;
                        var newpoint = {
                            point: point4 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player4');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 1) {
                        var point4 = p4.val().point;
                        var newpoint = {
                            point: point4 + 60
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player4');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 2) {
                        var point4 = p4.val().point;
                        var newpoint = {
                            point: point4 + 50
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player4');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 3) {
                        var point4 = p4.val().point;
                        var newpoint = {
                            point: point4 + 40
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player4');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 4) {
                        var point4 = p4.val().point;
                        var newpoint = {
                            point: point4 + 30
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player4');
                        pointpupdate.set(newpoint);
                    }
                    if (sohn.val().hangngang == 5) {
                        var point4 = p4.val().point;
                        var newpoint = {
                            point: point4 + 20
                        }
                        var pointpupdate = firebase.database().ref(matchid + '/point/player4');
                        pointpupdate.set(newpoint);
                    }

                }
            }
            Notification("Chấm thí sinh trả lời đúng CNV thành công");
        }



        var VCNVCORRECT = firebase.database().ref(matchid + '/VCNVChuong/OpenAll');
        var dung = {
            correct: 1,
        }
        VCNVCORRECT.set(dung);
        document.getElementById("da1").checked = false;
        document.getElementById("da2").checked = false;
        document.getElementById("da3").checked = false;
        document.getElementById("da4").checked = false;
    }

}

function saiCNV() {
    if (confirm("Xác nhận sai CNV? Nhớ tick thí sinh trả lời sai CNV trước khi chọn OK.") == true) {
        if (document.querySelector('#da1:checked')) {
            var VCNVDisabledAnsTS1 = firebase.database().ref(matchid + '/VCNVDisable/TS1/');
            var disabled = {
                ansbardisabled: 1
            }
            VCNVDisabledAnsTS1.set(disabled);
        }
        if (document.querySelector('#da2:checked')) {
            var VCNVDisabledAnsTS2 = firebase.database().ref(matchid + '/VCNVDisable/TS2/');
            var disabled = {
                ansbardisabled: 1
            }
            VCNVDisabledAnsTS2.set(disabled);
        }

        if (document.querySelector('#da3:checked')) {
            var VCNVDisabledAnsTS3 = firebase.database().ref(matchid + '/VCNVDisable/TS3/');
            var disabled = {
                ansbardisabled: 1
            }
            VCNVDisabledAnsTS3.set(disabled);
        }

        if (document.querySelector('#da4:checked')) {
            var VCNVDisabledAnsTS4 = firebase.database().ref(matchid + '/VCNVDisable/TS4/');
            var disabled = {
                ansbardisabled: 1
            }
            VCNVDisabledAnsTS4.set(disabled);
        }

        var VCNVCORRECT = firebase.database().ref(matchid + '/VCNVChuong/OpenAll');
        var dung = {
            correct: 2,
        }
        VCNVCORRECT.set(dung);
        setTimeout(function () {
            var VCNVCORRECT = firebase.database().ref(matchid + '/VCNVChuong/OpenAll');
            var dung = {
                correct: 0,
            }
            VCNVCORRECT.set(dung);
        }, 5000)
        document.getElementById("da1").checked = false;
        document.getElementById("da2").checked = false;
        document.getElementById("da3").checked = false;
        document.getElementById("da4").checked = false;
        Notification("Chấm thí sinh trả lời sai CNV thành công");
    }
}

function ObstacleOpenAnswer() {
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var openansweron = {
        OpenAnswer: 1
    }
    VCNVOpenAnswer.set(openansweron);
    document.getElementById("vcnvcloseansbtn").disabled = true;
    setTimeout(function () {
        document.getElementById("vcnvcloseansbtn").disabled = false;
    }, 3000);
}
function ObstacleCloseAnswer() {
    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    var openansweron = {
        OpenAnswer: 0
    }
    VCNVOpenAnswer.set(openansweron);
}



function countdown15s() {
    var VCNVCountDown = firebase.database().ref(matchid + '/VCNV15sCountdown');
    var countdown = {
        countdown: 1
    }
    VCNVCountDown.update(countdown);
    setTimeout(function () {
        var VCNVCountDown = firebase.database().ref(matchid + '/VCNV15sCountdown');
        var countdown = {
            countdown: 0
        }
        VCNVCountDown.update(countdown);
    }, 2000);
    var timer = document.getElementById("timervcnv");
    var seconds = 15;
    timer.innerHTML = seconds;
    setInterval(function () {
        if (seconds > 0) {
            seconds = seconds - 1;
            timer.innerHTML = seconds;
        }
    }, 1000)
    Notification("Đã phát âm thanh 15s trả lời từ khóa");
}

function uploadCNVResult() {

    var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
    VCNVOpenAnswer.once('value', CheckOpenAnsStatusVCNV)
    function CheckOpenAnsStatusVCNV(coas) {
        // if (coas.val().OpenAnswer == 0) {
             // alert("Ơ, bạn phải hiển thị đáp án cho thí sinh nữa chứ. Ấn nút Hiển thị Đ/A TS đi :>>")
        // }
        if (coas.val().OpenAnswer == 1 || coas.val().OpenAnswer == 0) {
            var CNVANSKT = firebase.database().ref(matchid + '/VCNVAnswer/kiemtradapan');
            var COFCNVTS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/dunghaysai');
            var COFCNVTS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/dunghaysai');
            var COFCNVTS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/dunghaysai');
            var COFCNVTS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/dunghaysai');
            if (document.querySelector('#da1:checked')) {
                var dungsai = {
                    dunghaysai: 1
                }
                COFCNVTS1.set(dungsai);
                var pointp1 = firebase.database().ref(matchid + '/point/player1');
                pointp1.once('value', point1);

                function point1(point) {
                    var point1 = point.val().point;
                    var set = {
                        point: point1 + 10,
                    }
                    pointp1.set(set);
                }
            } else {
                var dungsai = {
                    dunghaysai: 2
                }
                COFCNVTS1.set(dungsai);
            }

            if (document.querySelector('#da2:checked')) {
                var dungsai = {
                    dunghaysai: 1
                }
                var pointp2 = firebase.database().ref(matchid + '/point/player2');
                pointp2.once('value', point2);

                function point2(point) {
                    var point2 = point.val().point;
                    var set = {
                        point: point2 + 10,
                    }
                    pointp2.set(set);
                }
                COFCNVTS2.set(dungsai);
            } else {
                var dungsai = {
                    dunghaysai: 2
                }
                COFCNVTS2.set(dungsai);
            }


            if (document.querySelector('#da3:checked')) {
                var dungsai = {
                    dunghaysai: 1
                }
                COFCNVTS3.set(dungsai);
                var pointp3 = firebase.database().ref(matchid + '/point/player3');
                pointp3.once('value', point3);

                function point3(point) {
                    var point3 = point.val().point;
                    var set = {
                        point: point3 + 10,
                    }
                    pointp3.set(set);
                }
            } else {
                var dungsai = {
                    dunghaysai: 2
                }
                COFCNVTS3.set(dungsai);
            }


            if (document.querySelector('#da4:checked')) {
                var dungsai = {
                    dunghaysai: 1
                }
                COFCNVTS4.set(dungsai);
                var pointp4 = firebase.database().ref(matchid + '/point/player4');
                pointp4.once('value', point4);

                function point4(point) {
                    var point4 = point.val().point;
                    var set = {
                        point: point4 + 10,
                    }
                    pointp4.set(set);
                }
            } else {
                var dungsai = {
                    dunghaysai: 2
                }
                COFCNVTS4.set(dungsai);
            }

            var kiemtradapan = {
                kiemtra: 1
            }
            CNVANSKT.set(kiemtradapan);
            var kiemtradapan = {
                kiemtra: 0
            }
            CNVANSKT.set(kiemtradapan);
            document.getElementById("da1").checked = false;
            document.getElementById("da2").checked = false;
            document.getElementById("da3").checked = false;
            document.getElementById("da4").checked = false;
            Notification("Chấm điểm trả lời hàng ngang thành công")
        }
    }
};



function resetOverlay() {

    var reset = {
        status: 0,
    }
    var CNVROW1 = firebase.database().ref(matchid + '/VCNVRowStatus/HN1');
    var CNVROW2 = firebase.database().ref(matchid + '/VCNVRowStatus/HN2');
    var CNVROW3 = firebase.database().ref(matchid + '/VCNVRowStatus/HN3');
    var CNVROW4 = firebase.database().ref(matchid + '/VCNVRowStatus/HN4');
    var CNVROWTT = firebase.database().ref(matchid + '/VCNVRowStatus/HNTT');

    var CNVROWIMG1 = firebase.database().ref(matchid + '/VCNVImageStatus/HA1');
    var CNVROWIMG2 = firebase.database().ref(matchid + '/VCNVImageStatus/HA2');
    var CNVROWIMG3 = firebase.database().ref(matchid + '/VCNVImageStatus/HA3');
    var CNVROWIMG4 = firebase.database().ref(matchid + '/VCNVImageStatus/HA4');
    var CNVROWIMGTT = firebase.database().ref(matchid + '/VCNVImageStatus/HATT');

    CNVROW1.set(reset);
    CNVROW2.set(reset);
    CNVROW3.set(reset);
    CNVROW4.set(reset);
    CNVROWTT.set(reset);

    CNVROWIMG1.set(reset);
    CNVROWIMG2.set(reset);
    CNVROWIMG3.set(reset);
    CNVROWIMG4.set(reset);
    CNVROWIMGTT.set(reset);
};

function resetChuong() {

    var chuongreset = {
        chuong: 0,
    }
    var tstamp = {
        timestamp: "",
    }
    var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
    var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
    var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
    var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');

    var TS1ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS1');
    var TS2ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS2');
    var TS3ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS3');
    var TS4ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS4');
    CNVCHUONGTS1.set(chuongreset);
    CNVCHUONGTS2.set(chuongreset);
    CNVCHUONGTS3.set(chuongreset);
    CNVCHUONGTS4.set(chuongreset);

    TS1ChuongTstamp.set(tstamp);
    TS2ChuongTstamp.set(tstamp);
    TS3ChuongTstamp.set(tstamp);
    TS4ChuongTstamp.set(tstamp);


};


var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');

var starttimer = new Date();

CNVCHUONGTS1.on("value", chuong1);
CNVCHUONGTS2.on("value", chuong2);
CNVCHUONGTS3.on("value", chuong3);
CNVCHUONGTS4.on("value", chuong4);

function chuong1(c1) {
    console.log(c1);
    updateTimeDisplay(c1, "ts1vcnv", "tstamp1", "VCNVChuongTimeStamp/TS1");
}

function chuong2(c2) {
    updateTimeDisplay(c2, "ts2vcnv", "tstamp2", "VCNVChuongTimeStamp/TS2");
}

function chuong3(c3) {
    updateTimeDisplay(c3, "ts3vcnv", "tstamp3", "VCNVChuongTimeStamp/TS3");
}

function chuong4(c4) {
    updateTimeDisplay(c4, "ts4vcnv", "tstamp4", "VCNVChuongTimeStamp/TS4");
}

function updateTimeDisplay(snapshot, tsId, stampId, timestampPath) {
    var chuongVal = snapshot.val().chuong;
    var tents = document.getElementById(tsId);
    var tstamp = document.getElementById(stampId);

    if (chuongVal == 0) {
        tents.style.backgroundColor = "#171E28";
        tstamp.innerHTML = "";
    } else if (chuongVal == 1) {
        var timechuong = new Date();
        var elapsedTime = timechuong.getTime() - starttimer.getTime();
        var formattedTime = formatTime(elapsedTime);
        tstamp.innerHTML = formattedTime;

        var gettimestamp = {
            timestamp: elapsedTime
        }

        var VCNVChuongTimeStamp = firebase.database().ref(matchid + "/" + timestampPath);
        VCNVChuongTimeStamp.set(gettimestamp);

        tents.style.backgroundColor = "lightblue";
        vcnvanswerrow.play();
    }
}

function formatTime(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    var minutes = Math.floor((milliseconds % 3600000) / 60000);
    var seconds = Math.floor((milliseconds % 60000) / 1000);
    var millisecondstime = milliseconds % 1000;

    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + ":" + pad(millisecondstime % 1000);
}

function pad(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}

function tt1() {
    document.getElementById("AccelerationStarting").disabled = false;
    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');
    var tangtocqs = {
        tangtoc: 1
    }
    TTQS.set(tangtocqs);
    resetDapanTangtoc();
    AccelerationCloseAnswer();
}

function tt2() {
    document.getElementById("AccelerationStarting").disabled = false;
    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');
    var tangtocqs = {
        tangtoc: 2
    }
    TTQS.set(tangtocqs);
    resetDapanTangtoc();
    AccelerationCloseAnswer();
}

function tt3() {
    document.getElementById("AccelerationStarting").disabled = false;
    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');
    var tangtocqs = {
        tangtoc: 3
    }
    TTQS.set(tangtocqs);
    resetDapanTangtoc();
    AccelerationCloseAnswer();
}

function tt4() {
    document.getElementById("AccelerationStarting").disabled = false;
    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');
    var tangtocqs = {
        tangtoc: 4
    }
    TTQS.set(tangtocqs);
    resetDapanTangtoc();
    AccelerationCloseAnswer();
}

function demgiotangtoc() {

    var batdau = {
        batdau: 1
    }
    var tangtocstatus = firebase.database().ref(matchid + "/phanthistatus/tangtoc");
    tangtocstatus.set(batdau);
    setTimeout(function () {
        var batdau = {
            batdau: 0
        }
        var tangtocstatus = firebase.database().ref(matchid + "/phanthistatus/tangtoc");
        tangtocstatus.set(batdau);
    }, 3000)
    document.getElementById("AccelerationStarting").disabled = true;
}

function tongketdiem() {

    var intro = {
        intro: 0
    }
    var khoidong = {
        start: 0
    }
    var vcnv = {
        vcnv: 0
    }
    var tt = {
        tangtoc: 0,
    }
    var tkd = {
        tongketdiem: 1
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
    refkhoidongo22.set(khoidongo22);
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
    var refintro = firebase.database().ref(matchid + "/intro");
    var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
    var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    reftangtoc.set(tt);
    refvcnv.set(vcnv);
    refvedichphu.set(vedichphu);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    reftongketdiem.set(tkd);
    refvedich.set(vedich);

}


function AccelerationOpenAnswer() {
    var TTOpenAns = firebase.database().ref(matchid + '/AccelerationOpenAnswer');
    var openanson = {
        OpenAnswer: 1
    }
    TTOpenAns.update(openanson);
    document.getElementById("accelerationcloseans").disabled = true;
    setTimeout(function () {
        document.getElementById("accelerationcloseans").disabled = false;
    }, 3000)
}
function AccelerationCloseAnswer() {
    var TTOpenAns = firebase.database().ref(matchid + '/AccelerationOpenAnswer');
    var openansoff = {
        OpenAnswer: 0
    }
    TTOpenAns.update(openansoff);
}

function pointUpdate() {
    window.open('/PointUpdate.html', '123', 'width=500,height=576,toolbar=1');
}


function passwordUpdate() {
    window.open('/PasswordUpdate.html', '123', 'width=500,height=576,toolbar=1');
}

function resetDapanTangtoc() {


    var defaultanswer = {
        answer: ""
    }
    var defaultcorrectorwrong = {
        correctorwrong: 0,
    }
    var defaulttimestamp = {
        timestamp: 0,
    }
    firebase.database().ref(matchid + "/AccelerationAnswer/TS1/Answer").set(defaultanswer);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS2/Answer").set(defaultanswer);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS3/Answer").set(defaultanswer);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS4/Answer").set(defaultanswer);


    firebase.database().ref(matchid + "/AccelerationAnswer/TS1/CorrectOrWrong").set(defaultcorrectorwrong);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS2/CorrectOrWrong").set(defaultcorrectorwrong);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS3/CorrectOrWrong").set(defaultcorrectorwrong);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS4/CorrectOrWrong").set(defaultcorrectorwrong);


    firebase.database().ref(matchid + "/AccelerationAnswer/TS1/Timestamp").set(defaulttimestamp);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS2/Timestamp").set(defaulttimestamp);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS3/Timestamp").set(defaulttimestamp);
    firebase.database().ref(matchid + "/AccelerationAnswer/TS4/Timestamp").set(defaulttimestamp);


}






function starttangtoc() {

    var tt = {
        tangtoc: 1,
    }
    var intro = {
        intro: 0
    }
    var khoidong = {
        start: 0
    }
    var vcnv = {
        vcnv: 0
    }
    var ttqs = {
        tangtoc: 0,
    }
    var tongketdiem = {
        tongketdiem: 0,
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var bd = {
        batdau: 0
    }
    var openansoff = {
        OpenAnswer: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: 0
    }
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
    intronumber.set(intronumset);
    var refkhoidongo22 = firebase.database().ref(matchid + '/gamestatus/khoidongo22');
    var TTOpenAns = firebase.database().ref(matchid + '/AccelerationOpenAnswer');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');
    var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
    var refintro = firebase.database().ref(matchid + "/intro");
    var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var tangtocbd = firebase.database().ref(matchid + "/phanthistatus/tangtoc");
    var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
    var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    refvedichphu.set(vedichphu);
    reftangtoc.set(tt);
    refvcnv.set(vcnv);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    TTQS.set(ttqs);
    reftongketdiem.set(tongketdiem);
    refvedich.set(vedich);
    tangtocbd.set(bd);
    TTOpenAns.update(openansoff);
    refkhoidongo22.set(khoidongo22);
    resetAlreadyOpenAnswer();
}



function uploadTTResult() {
    var TTOpenAns = firebase.database().ref(matchid + '/AccelerationOpenAnswer');
    TTOpenAns.once('value', CheckOpenAnsStatusTT)
    function CheckOpenAnsStatusTT(coas) {
        if (coas.val().OpenAnswer == 0) {
            alert("Ơ, bạn phải hiển thị đáp án cho thí sinh nữa chứ. Ấn nút Hiển thị Đ/A TS đi :>>")
        }
        if (coas.val().OpenAnswer == 1) {

            var point40 = false;
            var point30 = false;
            var point20 = false;
            var point10 = false;
            if (document.querySelector('#datt1:checked')) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT1") + "/");
                refpoint.once("value", point1);

                function point1(p1) {
                    var currentpoint = p1.val().point;
                    var newpoint = {
                        point: currentpoint + 40
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT1") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT1");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG1.set(cow);
                ACCCHECKED.set(cow);
                var point40 = true;
            } else {
                var cow = {
                    correctorwrong: 2
                }
                var TTCORRECTORWRONG1 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT1") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT1");
                TTCORRECTORWRONG1.set(cow);
                ACCCHECKED.set(cow);
                var point40 = false;
            }




            if (document.querySelector('#datt2:checked') && point40 == false) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT2") + "/");
                refpoint.once("value", point2);

                function point2(p2) {
                    var currentpoint = p2.val().point;
                    var newpoint = {
                        point: currentpoint + 40
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT2") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT2");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG2.set(cow);
                ACCCHECKED.set(cow);
                var point40 = true;
            } else if (document.querySelector('#datt2:checked') && point40 == true) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT2") + "/");
                refpoint.once("value", point2);

                function point2(p2) {
                    var currentpoint = p2.val().point;
                    var newpoint = {
                        point: currentpoint + 30
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT2") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT2");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG2.set(cow);
                ACCCHECKED.set(cow);
                var point30 = true;
            } else {
                var TTCORRECTORWRONG2 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT2") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT2");
                var cow = {
                    correctorwrong: 2
                }
                TTCORRECTORWRONG2.set(cow);
                ACCCHECKED.set(cow);
            }


            if (document.querySelector('#datt3:checked') && point40 == false) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT3") + "/");
                refpoint.once("value", point3);

                function point3(p3) {
                    var currentpoint = p3.val().point;
                    var newpoint = {
                        point: currentpoint + 40
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT3") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT3");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG3.set(cow);
                ACCCHECKED.set(cow);
                var point40 = true;
            } else if (document.querySelector('#datt3:checked') && point30 == false) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT3") + "/");
                refpoint.once("value", point3);

                function point3(p3) {
                    var currentpoint = p3.val().point;
                    var newpoint = {
                        point: currentpoint + 30
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT3") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT3");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG3.set(cow);
                ACCCHECKED.set(cow);
                var point30 = true;
            } else if (document.querySelector('#datt3:checked') && point30 == true) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT3") + "/");
                refpoint.once("value", point3);

                function point3(p3) {
                    var currentpoint = p3.val().point;
                    var newpoint = {
                        point: currentpoint + 20
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT3") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT3");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG3.set(cow);
                ACCCHECKED.set(cow);
                var point20 = true;
            } else {
                var TTCORRECTORWRONG3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT3") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT3");
                var cow = {
                    correctorwrong: 2
                }
                var TTCORRECTORWRONG3 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT3") + '/CorrectOrWrong');
                TTCORRECTORWRONG3.set(cow);
                ACCCHECKED.set(cow);
            }



            if (document.querySelector('#datt4:checked') && point40 == false) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT4") + "/");
                refpoint.once("value", point4);

                function point4(p4) {
                    var currentpoint = p4.val().point;
                    var newpoint = {
                        point: currentpoint + 40
                    }
                    refpoint.set(newpoint);
                };
                var cow = {
                    correctorwrong: 1
                }
                var TTCORRECTORWRONG4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT4") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT4");
                TTCORRECTORWRONG4.set(cow);
                ACCCHECKED.set(cow);
                var point40 = true;
            }
            else if (document.querySelector('#datt4:checked') && point30 == false) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT4") + "/");
                refpoint.once("value", point4);

                function point4(p4) {
                    var currentpoint = p4.val().point;
                    var newpoint = {
                        point: currentpoint + 30
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT4") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT4");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG4.set(cow);
                ACCCHECKED.set(cow);
                var point30 = true;
            } else if (document.querySelector('#datt4:checked') && point20 == false) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT4") + "/");
                refpoint.once("value", point4);

                function point4(p4) {
                    var currentpoint = p4.val().point;
                    var newpoint = {
                        point: currentpoint + 20
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT4") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT4");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG4.set(cow);
                ACCCHECKED.set(cow);
                var point20 = true;
            } else if (document.querySelector('#datt4:checked') && point20 == true) {
                var refpoint = firebase.database().ref(matchid + "/point/" + "player" + localStorage.getItem("PTT4") + "/");
                refpoint.once("value", point4);

                function point4(p4) {
                    var currentpoint = p4.val().point;
                    var newpoint = {
                        point: currentpoint + 10
                    }
                    refpoint.set(newpoint);
                };
                var TTCORRECTORWRONG4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT4") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT4");
                var cow = {
                    correctorwrong: 1
                }
                TTCORRECTORWRONG4.set(cow);
                ACCCHECKED.set(cow);
                var point10 = true;
            } else {
                var cow = {
                    correctorwrong: 2
                }
                var TTCORRECTORWRONG4 = firebase.database().ref(matchid + '/AccelerationAnswer/TS' + localStorage.getItem("PTT4") + '/CorrectOrWrong');
                var ACCCHECKED = firebase.database().ref(matchid + "/AccelerationChecked/TT4");
                TTCORRECTORWRONG4.set(cow);
                ACCCHECKED.set(cow);
            }
            var kiemtradapan = {
                kiemtra: 1
            }
            var TTANSKT = firebase.database().ref(matchid + "/AccelerationAnswer/kiemtradapan");
            TTANSKT.set(kiemtradapan);
            var kiemtradapan = {
                kiemtra: 0
            }
            var TTANSKT = firebase.database().ref(matchid + "/AccelerationAnswer/kiemtradapan");
            TTANSKT.set(kiemtradapan);
            var checkboxdatt1 = document.getElementById("datt1");
            var checkboxdatt2 = document.getElementById("datt2");
            var checkboxdatt3 = document.getElementById("datt3");
            var checkboxdatt4 = document.getElementById("datt4");

            checkboxdatt1.checked = false;
            checkboxdatt2.checked = false;
            checkboxdatt3.checked = false;
            checkboxdatt4.checked = false;

            Notification("Chấm đáp án Tăng tốc thành công")
        }
    }
}

function startvedich() {

    var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
    var refintro = firebase.database().ref(matchid + "/intro");
    var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
    var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
    var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
    var refvedichbatdau = firebase.database().ref(matchid + "/phanthistatus/vedich");
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var VDQN = firebase.database().ref(matchid + "/VDCauso");

    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');

    var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: 0
    }
    intronumber.set(intronumset);
    var intro = {
        intro: 0
    }
    var khoidong = {
        start: 0
    }
    var vcnv = {
        vcnv: 0
    }
    var tt = {
        tangtoc: 0,
    }
    var ttqs = {
        tangtoc: 0,
    }
    var tongketdiem = {
        tongketdiem: 0,
    }
    var vedich = {
        vedich: 1
    }
    var playerdefault = {
        player: 0
    }
    var batdau = {
        batdau: 0
    }
    var status = {
        status: 3,
    }
    var status1 = {
        status: 0
    }
    var set = {
        causo: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
    refkhoidongo22.set(khoidongo22);
    refvedichphu.set(vedichphu);
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    VDNSHV.set(status1);
    VDChuong.set(status);
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    reftangtoc.set(tt);
    refvcnv.set(vcnv);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    TTQS.set(ttqs);
    reftongketdiem.set(tongketdiem);
    refvedich.set(vedich);
    refthisinhvedich.set(playerdefault);
    refvedichbatdau.set(batdau);
    VDQN.set(set);

    var ds = {
        correctorwrong: 0,
    }
    var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
    VDChuongCoW.set(ds);

}

function ts1vedich() {
    var PlayerFinishing = firebase.database().ref(matchid + '/playerstatus/vedich');
    PlayerFinishing.once("value", FinishingPlayer);

    function FinishingPlayer(player) {
        if (player.val().player != 0) {
            Notification("Kết thúc lượt trước khi chọn lượt thí sinh mới");
        } else {

            var player = {
                player: 1
            }
            var status = {
                status: 0
            }
            var set = {
                causo: 0
            }
            var tsvd1 = document.getElementById("tsvd1");
            var VDQN = firebase.database().ref(matchid + "/VDCauso");
            var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
            var refpointcheckstatus = firebase.database().ref(matchid + "/FinishPoint/status");
            refthisinhvedich.set(player);
            refpointcheckstatus.set(status);
            VDQN.set(set);
        }
    }
}

function ts2vedich() {
    var PlayerFinishing = firebase.database().ref(matchid + '/playerstatus/vedich');
    PlayerFinishing.once("value", FinishingPlayer);

    function FinishingPlayer(player) {
        if (player.val().player != 0) {
            Notification("Kết thúc lượt trước khi chọn lượt thí sinh mới");
        } else {
            var player = {
                player: 2
            }
            var status = {
                status: 0
            }
            var set = {
                causo: 0
            }
            var VDQN = firebase.database().ref(matchid + "/VDCauso");
            var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
            var refpointcheckstatus = firebase.database().ref(matchid + "/FinishPoint/status");
            refthisinhvedich.set(player);
            refpointcheckstatus.set(status);
            VDQN.set(set);
        }
    }
}

function ts3vedich() {
    var PlayerFinishing = firebase.database().ref(matchid + '/playerstatus/vedich');
    PlayerFinishing.once("value", FinishingPlayer);

    function FinishingPlayer(player) {
        if (player.val().player != 0) {
            Notification("Kết thúc lượt trước khi chọn lượt thí sinh mới");
        } else {
            var player = {
                player: 3
            }
            var status = {
                status: 0
            }
            var set = {
                causo: 0
            }
            var VDQN = firebase.database().ref(matchid + "/VDCauso");
            var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
            var refpointcheckstatus = firebase.database().ref(matchid + "/FinishPoint/status");
            refthisinhvedich.set(player);
            refpointcheckstatus.set(status);
            VDQN.set(set);
        }
    }
}

function ts4vedich() {
    var PlayerFinishing = firebase.database().ref(matchid + '/playerstatus/vedich');
    PlayerFinishing.once("value", FinishingPlayer);

    function FinishingPlayer(player) {
        if (player.val().player != 0) {
            Notification("Kết thúc lượt trước khi chọn lượt thí sinh mới");
        } else {
            var player = {
                player: 4
            }
            var status = {
                status: 0
            }
            var set = {
                causo: 0
            }
            var VDQN = firebase.database().ref(matchid + "/VDCauso");
            var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
            var refpointcheckstatus = firebase.database().ref(matchid + "/FinishPoint/status");
            refthisinhvedich.set(player);
            refpointcheckstatus.set(status);
            VDQN.set(set);
        }
    }

}



var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
refthisinhvedich.on("value", tsvd);

function tsvd(vd) {
    var tsid = vd.val().player;
    localStorage.setItem("TSVD", tsid);
    if (tsid == 0) {
        document.getElementById("vdbtn1").style.backgroundImage = 'none';
        document.getElementById("vdbtn2").style.backgroundImage = 'none';
        document.getElementById("vdbtn3").style.backgroundImage = 'none';
        document.getElementById("vdbtn4").style.backgroundImage = 'none';
    }
    if (tsid == 1) {
        document.getElementById("vdbtn1").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
    }
    if (tsid == 2) {
        document.getElementById("vdbtn2").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
    }
    if (tsid == 3) {
        document.getElementById("vdbtn3").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
    }
    if (tsid == 4) {
        document.getElementById("vdbtn4").style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
    }
}



function uploadQPVD() {

    var checkboxvd10diemcau1 = document.getElementById("vd10diemcau1");
    var checkboxvd20diemcau1 = document.getElementById("vd20diemcau1");
    var checkboxvd30diemcau1 = document.getElementById("vd30diemcau1");
    var checkboxvd10diemcau2 = document.getElementById("vd10diemcau2");
    var checkboxvd20diemcau2 = document.getElementById("vd20diemcau2");
    var checkboxvd30diemcau2 = document.getElementById("vd30diemcau2");
    var checkboxvd10diemcau3 = document.getElementById("vd10diemcau3");
    var checkboxvd20diemcau3 = document.getElementById("vd20diemcau3");
    var checkboxvd30diemcau3 = document.getElementById("vd30diemcau3");
    if (localStorage.getItem("TSVD") == 0) {
        Notification("Chọn thí sinh khởi động");
    } else {
        if (document.querySelector('#vd10diemcau1:checked')) {
            var cau = {
                cau1: 10,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/1");
            QPC.set(cau);
        }
        if (document.querySelector('#vd20diemcau1:checked')) {
            var cau = {
                cau1: 20,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/1");
            QPC.set(cau);
        }
        if (document.querySelector('#vd30diemcau1:checked')) {
            var cau = {
                cau1: 30,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/1");
            QPC.set(cau);
        }
        if (document.querySelector('#vd10diemcau2:checked')) {
            var cau = {
                cau2: 10,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/2");
            QPC.set(cau);
        }
        if (document.querySelector('#vd20diemcau2:checked')) {
            var cau = {
                cau2: 20,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/2");
            QPC.set(cau);
        }
        if (document.querySelector('#vd30diemcau2:checked')) {
            var cau = {
                cau2: 30,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/2");
            QPC.set(cau);
        }
        if (document.querySelector('#vd10diemcau3:checked')) {
            var cau = {
                cau3: 10,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/3");
            QPC.set(cau);
        }
        if (document.querySelector('#vd20diemcau3:checked')) {
            var cau = {
                cau3: 20,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/3");
            QPC.set(cau);
        }
        if (document.querySelector('#vd30diemcau3:checked')) {
            var cau = {
                cau3: 30,
            }
            var QPC = firebase.database().ref(matchid + "/FinishQuestionChoose/TS" + localStorage.getItem("TSVD") + "/3");
            QPC.set(cau);
        }
    }
    var status = {
        status: 1
    }
    var refpointcheckstatus = firebase.database().ref(matchid + "/FinishPoint/status");
    refpointcheckstatus.set(status);


    checkboxvd10diemcau1.checked = false;
    checkboxvd20diemcau1.checked = false;
    checkboxvd30diemcau1.checked = false;
    checkboxvd10diemcau2.checked = false;
    checkboxvd20diemcau2.checked = false;
    checkboxvd30diemcau2.checked = false;
    checkboxvd10diemcau3.checked = false;
    checkboxvd20diemcau3.checked = false;
    checkboxvd30diemcau3.checked = false;

    setTimeout(function () {
        document.getElementById("question12").innerHTML = "";
        document.getElementById("questionnumber").innerHTML = "";
        document.getElementById("vedichanswer").innerHTML = "";
    }, 1000);

    Notification("Lựa chọn gói câu hỏi Về đích thành công")
}







function hienthicauhoivedich() {
    if (localStorage.getItem("TSVD") == 0) {
        Notification("Chọn thí sinh về dích");
    } else {
        document.getElementById("FinalStarting").disabled = false;
        var VDQN = firebase.database().ref(matchid + "/VDCauso");
        VDQN.once("value", qs);

        function qs(q) {
            if (q.val().causo <= 2) {
                currentq = q.val().causo;
                var set = {
                    causo: currentq + 1
                }
                VDQN.set(set);
            }
        }
        var status = {
            status: 4,
        }
        var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
        VDChuong.set(status);
        var cow = {
            correctorwrong: 0,
        }
        var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
        VDChuongCoW.set(cow);
    }
    document.getElementById("VDCorrect").disabled = false;
    document.getElementById("VDWrong").disabled = false;
    document.getElementById("5scorrect").style.backgroundColor = "gray";
    document.getElementById("5swrong").style.backgroundColor = "gray";
    document.getElementById("HTCHVD").disabled = true;
    // document.getElementById("5sec").disabled = true;
    document.getElementById("5scorrect").disabled = true;
    document.getElementById("5swrong").disabled = true;
    document.getElementById("5sreset").disabled = true;
    setTimeout(function () {
        document.getElementById("HTCHVD").disabled = false;
    }, 3000)
}


function hienthicauhoivedichtruoc() {
    if (localStorage.getItem("TSVD") == 0) {
        Notification("Chọn thí sinh khởi động");
    } else {
        document.getElementById("FinalStarting").disabled = false;
        var VDQN = firebase.database().ref(matchid + "/VDCauso");
        VDQN.once("value", qs);

        function qs(q) {
            if (q.val().causo >= 1) {
                currentq = q.val().causo;
                var set = {
                    causo: currentq - 1
                }
                VDQN.set(set);
            }
        }
        var status = {
            status: 3,
        }
        var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
        VDChuong.set(status);
        var cow = {
            correctorwrong: 0,
        }
        var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
        VDChuongCoW.set(cow);
    }
    document.getElementById("VDCorrect").disabled = false;
    document.getElementById("VDWrong").disabled = false;
    document.getElementById("5scorrect").style.backgroundColor = "gray";
    document.getElementById("5swrong").style.backgroundColor = "gray";
    document.getElementById("HTCHVDT").disabled = true;
    // document.getElementById("5sec").disabled = true;
    document.getElementById("5scorrect").disabled = true;
    document.getElementById("5swrong").disabled = true;
    document.getElementById("5sreset").disabled = true;
    setTimeout(function () {
        document.getElementById("HTCHVDT").disabled = false;
    }, 3000)
}

function batdauvedich() {
    document.getElementById("FinalStarting").disabled = true;
    var refvedichbatdau = firebase.database().ref(matchid + "/phanthistatus/vedich");
    var vedich = {
        batdau: 1
    }
    refvedichbatdau.set(vedich);

    setTimeout(function () {
        var refvedichbatdau = firebase.database().ref(matchid + "/phanthistatus/vedich");
        var vedich = {
            batdau: 0
        }
        refvedichbatdau.set(vedich);
    }, 3000);

};





function VDCorrentAns() {



    var refvedichdungsai = firebase.database().ref(matchid + '/VDCorrectOrWrong/');
    var cor = {
        dungsai: 1
    }
    refvedichdungsai.set(cor);
    var VDQN = firebase.database().ref(matchid + "/VDCauso");
    VDQN.once('value', questionumber);

    function questionumber(qs) {
        var causo = qs.val().causo;
        var QSP = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/" + causo + "/cau" + causo);

        QSP.once('value', qp);

        function qp(questionpack) {
            qpack = questionpack.val();
            var tsvdpoint = firebase.database().ref(matchid + "/point/player" + localStorage.getItem("TSVD"));
            tsvdpoint.once('value', p);

            function p(pointp) {
                var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
                VDNSHV.once('value', nshv);

                function nshv(hope) {
                    if (hope.val().status == 0) {
                        currentpoint = pointp.val().point;
                        var newpoint = {
                            point: currentpoint + qpack,
                        }
                        tsvdpoint.set(newpoint);
                    }

                    if (hope.val().status == 1) {
                        currentpoint = pointp.val().point;
                        var newpoint = {
                            point: currentpoint + qpack * 2,
                        }
                        tsvdpoint.set(newpoint);
                    }

                }
            }
        }
    }
    var cor1 = {
        dungsai: 0
    }
    refvedichdungsai.set(cor1);

    ;
}



function VDWrongAns() {
    var refvedichdungsai = firebase.database().ref(matchid + '/VDCorrectOrWrong/');
    var cor = {
        dungsai: 2
    }
    refvedichdungsai.set(cor);

    var VDQN = firebase.database().ref(matchid + "/VDCauso");
    VDQN.once('value', questionumber);

    function questionumber(qs) {
        var causo = qs.val().causo;
        var QSP = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/" + causo + "/cau" + causo);

        QSP.once('value', qp);

        function qp(questionpack) {
            qpack = questionpack.val();
            var tsvdpoint = firebase.database().ref(matchid + "/point/player" + localStorage.getItem("TSVD"));
            tsvdpoint.once('value', p);

            function p(pointp) {
                var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
                VDNSHV.once('value', nshv);

                function nshv(hope) {
                    if (hope.val().status == 0) {
                        // do nothing 
                    }

                    if (hope.val().status == 1) {
                        currentpoint = pointp.val().point;
                        if (currentpoint > 0) {
                            var newpoint = {
                                point: Math.max(0, currentpoint - qpack),
                            }
                            tsvdpoint.set(newpoint);
                        }
                    }
                }
            }
        }

        var cor1 = {
            dungsai: 0
        }
        refvedichdungsai.set(cor1);
    }

    document.getElementById("5scorrect").disabled = false;
    document.getElementById("5swrong").disabled = false;
    document.getElementById("5sreset").disabled = false;
}


function WD5Seconds() {

    var refvedichdungsai = firebase.database().ref(matchid + '/VDCorrectOrWrong/');
    var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
    var cor = {
        dungsai: 3
    }
    refvedichdungsai.set(cor);
    var cor1 = {
        dungsai: 0
    }
    refvedichdungsai.set(cor1);
    var status = {
        status: 0,
    }
    VDChuong.set(status);

    document.getElementById("VDCorrect").disabled = true;
    document.getElementById("VDWrong").disabled = true;

    document.getElementById("5scorrect").style.backgroundColor = "rgb(0, 86, 63)";
    document.getElementById("5swrong").style.backgroundColor = "rgb(191, 10, 48)";
}






function TS5STraloidung() {
    var VDQN = firebase.database().ref(matchid + "/VDCauso");
    VDQN.once('value', questionumber);

    function questionumber(qs) {
        var causo = qs.val().causo;
        var QSP = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/" + causo + "/cau" + causo);
        QSP.once('value', qp);

        function qp(questionpack) {
            qpack = questionpack.val();
            var tsvdpoint = firebase.database().ref(matchid + "/point/player" + localStorage.getItem("TSVD"));
            tsvdpoint.once('value', p);

            function p(pointp) {
                var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
                VDNSHV.once('value', nshv);

                function nshv(hope) {
                    firebase.database().ref(matchid + '/VDChuong/Player').limitToFirst(1).once('value', function (snapshot) {
                        snapshot.forEach(function (e) {
                            var tsbamchuongid = e.val().id;
                            var tsbamchuongpoint = firebase.database().ref(matchid + '/point/player' + tsbamchuongid);
                            tsbamchuongpoint.once('value', bamchuongpoint);

                            function bamchuongpoint(pbc) {
                                tsvdcurrentpoint = pointp.val().point;
                                tsbccurrentpoint = pbc.val().point;

                                if (hope.val().status == 0) {
                                    var newpointtsvd = {
                                        point: Math.max(0, tsvdcurrentpoint - qpack),
                                    }
                                    var newpointtsbc = {
                                        point: tsbccurrentpoint + qpack,
                                    }
                                    tsvdpoint.set(newpointtsvd);
                                    tsbamchuongpoint.set(newpointtsbc);
                                } else if (hope.val().status == 1) {
                                    var newpointtsbc = {
                                        point: tsbccurrentpoint + qpack,
                                    }
                                    tsbamchuongpoint.set(newpointtsbc);
                                }
                            }
                        })
                    })
                }
            }
        }
    }

    var cow = {
        correctorwrong: 1,
    }
    var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
    VDChuongCoW.set(cow);
}

function TS5STraloisai() {
    var VDQN = firebase.database().ref(matchid + "/VDCauso");
    VDQN.once('value', questionumber);

    function questionumber(qs) {
        var causo = qs.val().causo;
        var QSP = firebase.database().ref(matchid + '/FinishQuestionChoose/TS' + localStorage.getItem("TSVD") + "/" + causo + "/cau" + causo);
        QSP.once('value', qp);

        function qp(questionpack) {
            qpack = questionpack.val();
            var tsvdpoint = firebase.database().ref(matchid + "/point/player" + localStorage.getItem("TSVD"));
            tsvdpoint.once('value', p);

            function p(pointp) {
                var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
                VDNSHV.once('value', nshv);

                function nshv(hope) {
                    firebase.database().ref(matchid + '/VDChuong/Player').limitToFirst(1).once('value', function (snapshot) {
                        snapshot.forEach(function (e) {
                            var tsbamchuongid = e.val().id;
                            var tsbamchuongpoint = firebase.database().ref(matchid + '/point/player' + tsbamchuongid);
                            tsbamchuongpoint.once('value', bamchuongpoint);

                            function bamchuongpoint(pbc) {
                                tsbccurrentpoint = pbc.val().point;
                                if (tsbccurrentpoint > 0) {
                                    var newpointtsbc = {
                                        point: Math.max(0, tsbccurrentpoint - qpack / 2),
                                    }
                                    tsbamchuongpoint.set(newpointtsbc);
                                }
                            }
                        })
                    })
                }
            }
        }
    }

    var cow = {
        correctorwrong: 2,
    }
    var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
    VDChuongCoW.set(cow);
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

                document.getElementById("vdbtn1").innerHTML = names1.val().displayName;
                document.getElementById("vdbtn2").innerHTML = names2.val().displayName;
                document.getElementById("vdbtn3").innerHTML = names3.val().displayName;
                document.getElementById("vdbtn4").innerHTML = names4.val().displayName;



            }
        }
    }
};


// var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
// VDChuong.on("value", chuongstatus1);

// function chuongstatus1(cs1) {
//     if (cs1.val().status == 0) {
//         var tsvd1 = document.getElementById("tsvd1");
//         var tsvd2 = document.getElementById("tsvd2");
//         var tsvd3 = document.getElementById("tsvd3");
//         var tsvd4 = document.getElementById("tsvd4");
//         tsvd1.style.backgroundColor = "lightblue";
//         tsvd2.style.backgroundColor = "lightblue";
//         tsvd3.style.backgroundColor = "lightblue";
//         tsvd4.style.backgroundColor = "lightblue";
//     }
//     if (cs1.val().status == 3) {
//         var tsvd1 = document.getElementById("tsvd1");
//         var tsvd2 = document.getElementById("tsvd2");
//         var tsvd3 = document.getElementById("tsvd3");
//         var tsvd4 = document.getElementById("tsvd4");
//         tsvd1.style.backgroundColor = "lightblue";
//         tsvd2.style.backgroundColor = "lightblue";
//         tsvd3.style.backgroundColor = "lightblue";
//         tsvd4.style.backgroundColor = "lightblue";
//     }
// }



function VDNgoiSaoHiVong() {

    var status = {
        status: 1
    }
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    VDNSHV.set(status);

}

function VDOffNSHV() {

    var status = {
        status: 0
    }
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    VDNSHV.set(status);

}

function ketthucluot() {

    var VDPlayerEnd = firebase.database().ref(matchid + "/VDPlayerTurnEnd/End");
    var set = {
        end: 1
    }
    VDPlayerEnd.set(set);
    var set = {
        end: 0
    }
    VDPlayerEnd.set(set);
    Notification("Kết thúc lượt thành công")
}


function VideoVD1() {
    var vdset = {
        video1: 1,
        video2: 0,
        video3: 0,
        video4: 0,
    }
    var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");
    VDVideoState.set(vdset);
    Notification("Đang chiếu Video 1");

}

function VideoVD2() {
    var vdset = {
        video1: 0,
        video2: 1,
        video3: 0,
        video4: 0,
    }
    var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");
    VDVideoState.set(vdset);
    Notification("Đang chiếu Video 2");
}

function VideoVD3() {
    var vdset = {
        video1: 0,
        video2: 0,
        video3: 1,
        video4: 0,
    }
    var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");
    VDVideoState.set(vdset);
    Notification("Đang chiếu Video 3");
}

function VideoVD4() {
    var vdset = {
        video1: 0,
        video2: 0,
        video3: 0,
        video4: 1,
    }
    var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");
    VDVideoState.set(vdset);
    Notification("Đang chiếu Video 4");

}

function stopVideo() {

    var vdset = {
        video1: 0,
        video2: 0,
        video3: 0,
        video4: 0,
    }
    var VDVideoState = firebase.database().ref(matchid + "/FinishVideoState/VD");
    VDVideoState.set(vdset);
}

function resetChuongVD() {

    var set = {
        status: 3
    }
    var info = {
        id: "",
        timestamp: ""
    }
    var cow = {
        correctorwrong: 0,
    }
    var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
    var VDChuongPlayer = firebase.database().ref(matchid + "/VDChuong/Player");
    var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
    VDChuongCoW.set(cow);
    VDChuong.set(set);
    VDChuongPlayer.set(info);

}


function trovecauhoivdp() {
    document.getElementById("AdditionalStarting").disabled = false;
    var VDPCauso = firebase.database().ref(matchid + '/VDPCauso');
    VDPCauso.once('value', causo);

    function causo(cs) {
        if (cs.val().causo >= 1) {
            var qn = cs.val().causo;
            var nextqs = {
                causo: qn - 1
            }
            VDPCauso.set(nextqs);
        }
    }
}



function startvedichphu() {

    var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
    var refintro = firebase.database().ref(matchid + "/intro");
    var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
    var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");

    var VDQN = firebase.database().ref(matchid + "/VDCauso");

    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');

    var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: 0
    }
    intronumber.set(intronumset);
    var intro = {
        intro: 0
    }
    var khoidong = {
        start: 0
    }
    var vcnv = {
        vcnv: 0
    }
    var tt = {
        tangtoc: 0,
    }
    var ttqs = {
        tangtoc: 0,
    }
    var tongketdiem = {
        tongketdiem: 0,
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 1
    }
    var playerdefault = {
        player: 0
    }
    var batdau = {
        batdau: 0
    }
    var status = {
        status: 3,
    }
    var status1 = {
        status: 0
    }
    var set = {
        causo: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
    refkhoidongo22.set(khoidongo22);
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    reftangtoc.set(tt);
    refvcnv.set(vcnv);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    reftongketdiem.set(tongketdiem);
    refvedich.set(vedich);
    refvedichphu.set(vedichphu);
    var VDPCauso = firebase.database().ref(matchid + '/VDPCauso');
    VDPCauso.set(set);

}


function hienthicauhoivdp() {
    document.getElementById("AdditionalStarting").disabled = false;
    var VDPCauso = firebase.database().ref(matchid + '/VDPCauso');
    VDPCauso.once('value', causo);

    function causo(cs) {
        if (cs.val().causo <= 9) {
            var qn = cs.val().causo;
            var nextqs = {
                causo: qn + 1
            }
            VDPCauso.set(nextqs);
        }
    }

    // setTimeout(function () {
    // document.getElementById("HTCHVDP").disabled = false;
    // }, 3000)
}


function demgiovdp() {
    document.getElementById("AdditionalStarting").disabled = true;
    document.getElementById("HTCHVDP").disabled = true;
    document.getElementById("TVCHVDP").disabled = true;
    var VDPStatus = firebase.database().ref(matchid + '/phanthistatus/vedichphu')
    var set = {
        status: 0
    }
    var cow = {
        correctorwrong: 0,
    }
    var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
    var VDPChuongPlayer = firebase.database().ref(matchid + "/VDPChuong/Player");
    var VDPChuongCoW = firebase.database().ref(matchid + "/VDPChuong/CorrectOrWrong");
    VDPChuongCoW.set(cow);
    VDPChuong.set(set);

    var batdau = {
        batdau: 1
    }
    VDPStatus.set(batdau);

    setTimeout(function () {
        var VDPStatus = firebase.database().ref(matchid + '/phanthistatus/vedichphu')
        var batdau = {
            batdau: 0
        }
        VDPStatus.set(batdau);

    }, 1500);


    var seconds = 15;
    var intervaltime = setInterval(function () {
        if (localStorage.getItem("timerpause") == 0) {
            if (seconds > 0) {
                seconds = seconds - 1;
            }
        }
        if (seconds == 0) {
            var set = {
                status: 3
            }
            var info = {

            }
            var cow = {
                correctorwrong: 0,
            }
            var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
            var VDPChuongPlayer = firebase.database().ref(matchid + "/VDPChuong/Player");
            var VDPChuongCoW = firebase.database().ref(matchid + "/VDPChuong/CorrectOrWrong");
            VDPChuongCoW.set(cow);
            VDPChuong.set(set);
            VDPChuongPlayer.set(info);
            document.getElementById("HTCHVDP").disabled = false;
            document.getElementById("TVCHVDP").disabled = false;
            clearInterval(intervaltime);
        }
    }, 1000)





}

function resetChuongVDP() {

    var defaultchuongdisable = {
        chuongdisable: 0
    }
    var VDPChuongDisableTS1 = firebase.database().ref(matchid + '/VDPChuongDisable/TS1');
    var VDPChuongDisableTS2 = firebase.database().ref(matchid + '/VDPChuongDisable/TS2');
    var VDPChuongDisableTS3 = firebase.database().ref(matchid + '/VDPChuongDisable/TS3');
    var VDPChuongDisableTS4 = firebase.database().ref(matchid + '/VDPChuongDisable/TS4');
    VDPChuongDisableTS1.set(defaultchuongdisable);
    VDPChuongDisableTS2.set(defaultchuongdisable);
    VDPChuongDisableTS3.set(defaultchuongdisable);
    VDPChuongDisableTS4.set(defaultchuongdisable);
    var set = {
        status: 3
    }
    var info = {

    }
    var cow = {
        correctorwrong: 0,
    }
    var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
    var VDPChuongPlayer = firebase.database().ref(matchid + "/VDPChuong/Player");
    var VDPChuongCoW = firebase.database().ref(matchid + "/VDPChuong/CorrectOrWrong");
    VDPChuongCoW.set(cow);
    VDPChuong.set(set);
    VDPChuongPlayer.set(info);

}



function TLDungVDP() {

    var cow = {
        correctorwrong: 1,
    }
    var VDPChuongCoW = firebase.database().ref(matchid + "/VDPChuong/CorrectOrWrong");
    VDPChuongCoW.set(cow);

}

function TLSaiVDP() {

    var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
    VDPChuong.on('value', status);

    function status(sts) {
        if (sts.val().status == 1) {
            setTimeout(function () {
                firebase.database().ref(matchid + '/VDPChuong/Player').limitToFirst(1).on('value', function (snapshot) {
                    snapshot.forEach(function (e) {
                        var x = e.val().id;
                        if (x == 1) {
                            var VDPChuongDisableTS1 = firebase.database().ref(matchid + '/VDPChuongDisable/TS1');
                            var set = {
                                chuongdisable: 1
                            }
                            VDPChuongDisableTS1.set(set);
                        }
                        if (x == 2) {
                            var VDPChuongDisableTS2 = firebase.database().ref(matchid + '/VDPChuongDisable/TS2');
                            var set = {
                                chuongdisable: 1
                            }
                            VDPChuongDisableTS2.set(set);
                        }
                        if (x == 3) {
                            var VDPChuongDisableTS3 = firebase.database().ref(matchid + '/VDPChuongDisable/TS3');
                            var set = {
                                chuongdisable: 1
                            }
                            VDPChuongDisableTS3.set(set);
                        }
                        if (x == 4) {
                            var VDPChuongDisableTS4 = firebase.database().ref(matchid + '/VDPChuongDisable/TS4');
                            var set = {
                                chuongdisable: 1
                            }
                            VDPChuongDisableTS4.set(set);
                        }
                    })
                })
            }, 500)
        }
    }

    setTimeout(function () {
        var set = {
            status: 0
        }
        var info = {

        }
        var cow = {
            correctorwrong: 0,
        }
        var VDPChuong = firebase.database().ref(matchid + "/VDPChuong/ChuongStatus");
        var VDPChuongPlayer = firebase.database().ref(matchid + "/VDPChuong/Player");
        var VDPChuongCoW = firebase.database().ref(matchid + "/VDPChuong/CorrectOrWrong");
        VDPChuongCoW.set(cow);
        VDPChuong.set(set);
        VDPChuongPlayer.set(info);
    }, 800);

}

function ChangePassword() {

    var newpassword = document.getElementById("newpassword").nodeValue;
    var newpass = {
        password: newpassword
    }
    var MatchDB = firebase.database().ref(matchid + "/")
    MatchDB.set(newpass);
    document.getElementById("success-changepasswordmatch").style.display = "block";



}

function kickmc(mc) {
    var kickmc = {
        uid: "",
        displayName: "N/A",
        id: 0
    }

    firebase.database().ref(matchid + "/games/mc" + mc).update(kickmc);
    Notification("Bạn đã kick MC thành công");
}



function kickmc2() {
    var mc = firebase.database().ref(matchid + "/games/mc2");
    mc.once("value", mcname);

    function mcname(name) {
        var mcname = name.val().displayName;

        {

            var kickmc = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/mc2").update(kickmc);
            Notification("Bạn đã kick MC thành công");
        }
    }

}




function kickAll() {
    if (confirm("Bạn có muốn kick tất cả không ?") == true) {
        {
            Notification("Kick tất cả thí sinh thành công");
            var kicks1 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player1").update(kicks1);

            var kicks2 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player2").update(kicks2);

            var kicks3 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player3").update(kicks3);

            var kicks4 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player4").update(kicks4);

            var kickmc = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/mc").update(kickmc);
            firebase.database().ref(matchid + "/games/mc2").update(kickmc);
        }
    }
}


function kicks1() {
    var p1 = firebase.database().ref(matchid + "/games/player1");
    p1.once("value", p1n);
    function p1n(name) {
        var playername1 = name.val().displayName;

        {
            Notification("Kick thí sinh thành công");
            var kicks1 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player1").update(kicks1);

        }

    }
}



function kicks2() {
    var p2 = firebase.database().ref(matchid + "/games/player2");
    p2.once("value", p2n);
    function p2n(name) {
        var playername2 = name.val().displayName;

        {
            Notification("Kick thí sinh thành công")
            var kicks2 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player2").update(kicks2);

        }

    }
}


function kicks3() {
    var p3 = firebase.database().ref(matchid + "/games/player3");
    p3.once("value", p3n);
    function p3n(name) {
        var playername3 = name.val().displayName;

        {
            Notification("Kick thí sinh thành công");
            var kicks3 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player3").update(kicks3);

        }

    }
}

function kicks4() {
    var p4 = firebase.database().ref(matchid + "/games/player4");
    p4.once("value", p4n);
    function p4n(name) {
        var playername4 = name.val().displayName;

        {
            Notification("Kick thí sinh thành công");
            var kicks4 = {
                uid: "",
                displayName: "N/A",
                id: 0
            }

            firebase.database().ref(matchid + "/games/player4").update(kicks4);

        }

    }
}



function AudioHN() {

    var audio = {
        audio: 1,
    }
    firebase.database().ref(matchid + "/VCNVAudio").update(audio);
    Notification("Đã phát âm thanh hàng ngang");
}


function StopAudioHN() {

    var audio = {
        audio: 0,
    }
    firebase.database().ref(matchid + "/VCNVAudio").update(audio);
    Notification("Đã ngừng phát âm thanh hàng ngang");
}

$('form.checkbox-group.required :radio:checked').length > 0

function OpenChat() {

    var chat = {
        disable: 0,
    }
    firebase.database().ref(matchid + '/ChatDisable').update(chat);
    firebase.database().ref(matchid + '/chat').push({
        user: "HỆ THỐNG",
        txt: "Host đã mở chat",
        role: "host",
        uid: "none",
    });
}

function CloseChat() {

    var chat = {
        disable: 1,
    }
    firebase.database().ref(matchid + '/ChatDisable').update(chat);
    firebase.database().ref(matchid + '/chat').push({
        user: "HỆ THỐNG",
        txt: "Host đã khoá chat",
        role: "host",
        uid: "none",
    });
}




firebase.database().ref(matchid + '/ChatDisable').on('value', chatdisable);
function chatdisable(cdisable) {
    if (cdisable.val().disable == 0) {
        document.getElementById("openchat").style.display = "none";
        document.getElementById("closechat").style.display = "block";

    }
    if (cdisable.val().disable == 1) {
        document.getElementById("openchat").style.display = "block";
        document.getElementById("closechat").style.display = "none";
    }
}


var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');
VCNVOpenAnswer.on('value', CheckOpenAnsStatusVCNV)
function CheckOpenAnsStatusVCNV(coas) {
    if (coas.val().OpenAnswer == 0) {
        document.getElementById("vcnvcheckansbtn").style.backgroundColor = "#036768";
        document.getElementById("vcnvcloseansbtn").style.backgroundColor = "#036768";
    }
    if (coas.val().OpenAnswer == 1) {
        document.getElementById("vcnvcheckansbtn").style.backgroundColor = "#00563F";
        document.getElementById("vcnvcloseansbtn").style.backgroundColor = "#BF0A30";
    }
}

var TTOpenAns = firebase.database().ref(matchid + '/AccelerationOpenAnswer');
TTOpenAns.on('value', CheckOpenAnsStatusTT)
function CheckOpenAnsStatusTT(coas) {
    if (coas.val().OpenAnswer == 0) {
        document.getElementById("accelerationopenans").style.backgroundColor = "#036768";
        document.getElementById("accelerationcloseans").style.backgroundColor = "#036768";
    }
    if (coas.val().OpenAnswer == 1) {
        document.getElementById("accelerationopenans").style.backgroundColor = "#00563F";
        document.getElementById("accelerationcloseans").style.backgroundColor = "#BF0A30";
    }
}


function startkhoidongo22() {
    var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
    var refintro = firebase.database().ref(matchid + "/intro");
    var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
    var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
    var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
    var refvedichbatdau = firebase.database().ref(matchid + "/phanthistatus/vedich");
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refkhoidongo22 = firebase.database().ref(matchid + "/gamestatus/khoidongo22");
    var VDQN = firebase.database().ref(matchid + "/VDCauso");
    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');
    var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var KDO22AnserRights = firebase.database().ref(matchid + "/KDO22AnswerRights");
    var intronumset = {
        intronum: 0
    }
    intronumber.set(intronumset);
    var intro = {
        intro: 0
    }
    var khoidong = {
        start: 0
    }
    var vcnv = {
        vcnv: 0
    }
    var tt = {
        tangtoc: 0,
    }
    var ttqs = {
        tangtoc: 0,
    }
    var tongketdiem = {
        tongketdiem: 0,
    }
    var vedich = {
        vedich: 0
    }
    var khoidongo22 = {
        khoidongo22: 1
    }
    var playerdefault = {
        player: 0
    }
    var batdau = {
        batdau: 0
    }
    var status = {
        status: 3,
    }
    var status1 = {
        status: 0
    }
    var set = {
        causo: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var answerright = {
        value: false
    }
    var banner = {
        banner: 0
    }
    refbanner.set(banner);
    refvedichphu.set(vedichphu);
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    VDNSHV.set(status1);
    VDChuong.set(status);
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    reftangtoc.set(tt);
    refvcnv.set(vcnv);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    TTQS.set(ttqs);
    reftongketdiem.set(tongketdiem);
    refvedich.set(vedich);
    refthisinhvedich.set(playerdefault);
    refvedichbatdau.set(batdau);
    refkhoidongo22.set(khoidongo22);
    VDQN.set(set);
    KDO22AnserRights.set(answerright);

    var ds = {
        correctorwrong: 0,
    }
    var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
    VDChuongCoW.set(ds);

}

function KDO22Turn1() {
    var KDO22LuotThiSts = firebase.database().ref(matchid + "/KDO22LuotThiStatus");
    KDO22LuotThiSts.once('value', kdo22sts);
    function kdo22sts(st) {
        if (st.val().status == 0) {
            var RefKDO22Turn1 = firebase.database().ref(matchid + "/KDO22Turn");
            var turn = {
                turn: 1
            }
            RefKDO22Turn1.set(turn);
        } else {
            Notification("Dừng lượt hiện tại trước khi chuyển sang lượt mới");
        }
    };
}
function KDO22Turn2() {
    var KDO22LuotThiSts = firebase.database().ref(matchid + "/KDO22LuotThiStatus");
    KDO22LuotThiSts.once('value', kdo22sts);
    function kdo22sts(st) {
        if (st.val().status == 0) {
            var RefKDO22Turn1 = firebase.database().ref(matchid + "/KDO22Turn");
            var turn = {
                turn: 2
            }
            RefKDO22Turn1.set(turn);
        } else {
            Notification("Dừng lượt hiện tại trước khi chuyển sang lượt mới");
        }
    };
}
function KDO22Turn3() {
    var KDO22LuotThiSts = firebase.database().ref(matchid + "/KDO22LuotThiStatus");
    KDO22LuotThiSts.once('value', kdo22sts);
    function kdo22sts(st) {
        if (st.val().status == 0) {
            var RefKDO22Turn1 = firebase.database().ref(matchid + "/KDO22Turn");
            var turn = {
                turn: 3
            }
            RefKDO22Turn1.set(turn);
        } else {
            Notification("Dừng lượt hiện tại trước khi chuyển sang lượt mới");
        }
    };
}
function batdaukhoidongo22() {

    var refkhoidongo22batdau = firebase.database().ref(matchid + "/phanthistatus/khoidongo22");
    var khoidong = {
        batdau: 1
    }
    refkhoidongo22batdau.set(khoidong);

    setTimeout(function () {
        var refkhoidongo22batdau = firebase.database().ref(matchid + "/phanthistatus/khoidongo22");
        var khoidong = {
            batdau: 0
        }
        refkhoidongo22batdau.set(khoidong);
    }, 2000);

    setTimeout(function () {
        var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
        var chuongstatus = {
            status: 0
        }
        KDO22ChuongStatus.set(chuongstatus);
        var KDO22Causo = firebase.database().ref(matchid + '/KDO22Causo');
        var defaultcauso = {
            causo: 1
        }
        KDO22Causo.set(defaultcauso);
    }, 7000);
    var KDO22LuotThiStatus = firebase.database().ref(matchid + '/KDO22LuotThiStatus');
    var statuslt = {
        status: 1
    }
    KDO22LuotThiStatus.set(statuslt);
    //     function kdo21turn(turnkd) {
    //         if (kdo22bd.val().batdau == 0) {
    //             KDO22Turn = turnkd.val().turn;
    //             if (KDO22Turn == 1) {
    //                 clearTimeout(KO22L2T1);
    //                 clearTimeout(KO22L2T2);
    //                 clearTimeout(KO22L3T1);
    //                 clearTimeout(KO22L3T2);
    //             }
    //             if (KDO22Turn == 2) {
    //                 clearTimeout(KO22L1T1);
    //                 clearTimeout(KO22L1T2);
    //                 clearTimeout(KO22L3T1);
    //                 clearTimeout(KO22L3T2);
    //             }
    //             if (KDO22Turn == 3) {
    //                 clearTimeout(KO22L1T1);
    //                 clearTimeout(KO22L1T2);
    //                 clearTimeout(KO22L2T1);
    //                 clearTimeout(KO22L2T2);
    //             }

    //         }
    //         KDO22Turn = turnkd.val().turn;
    //         if (KDO22Turn == 1) {
    //             if (kdo22bd.val().batdau == 1) {
    //                 var KO22L1T1 = setTimeout(function () {
    // var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    // var defaultchuongstatus = {
    //     status: 3
    // }
    // KDO22ChuongStatus.set(defaultchuongstatus);
    // var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
    // var defaultchuongplayer = {
    //     id: 0
    // }
    // KDO22ChuongPlayer.set(defaultchuongplayer);
    // var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    // var correct = {
    //     correctorwrong: 0
    // }
    // KDO22ChuongCorrectOrWrong.set(correct);
    // var KDO22ChuongDisableTS1 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS1');
    // var KDO22ChuongDisableTS2 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS2');
    // var KDO22ChuongDisableTS3 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS3');
    // var KDO22ChuongDisableTS4 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS4');
    // var defaultchuongdisable = {
    //     disable: 0
    // }
    // KDO22ChuongDisableTS1.set(defaultchuongdisable);
    // KDO22ChuongDisableTS2.set(defaultchuongdisable);
    // KDO22ChuongDisableTS3.set(defaultchuongdisable);
    // KDO22ChuongDisableTS4.set(defaultchuongdisable);

    //                 }, 37000)
    //                 var KO22L1T2 = setTimeout(function () {
    // var KDO22Causo = firebase.database().ref(matchid + '/KDO22Causo');
    // var defaultcauso = {
    //     causo: 0
    // }
    // KDO22Causo.set(defaultcauso);
    //                 }, 39000)
    //             }
    //         }
    //         else if (KDO22Turn == 2) {
    //             if (kdo22bd.val().batdau == 1) {
    //                 var KO22L2T1 = setTimeout(function () {
    //                     var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    //                     var defaultchuongstatus = {
    //                         status: 3
    //                     }
    //                     KDO22ChuongStatus.set(defaultchuongstatus);
    //                     var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
    //                     var defaultchuongplayer = {
    //                         id: 0
    //                     }
    //                     KDO22ChuongPlayer.set(defaultchuongplayer);
    //                     var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    //                     var correct = {
    //                         correctorwrong: 0
    //                     }
    //                     KDO22ChuongCorrectOrWrong.set(correct);
    //                     var KDO22ChuongDisableTS1 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS1');
    //                     var KDO22ChuongDisableTS2 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS2');
    //                     var KDO22ChuongDisableTS3 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS3');
    //                     var KDO22ChuongDisableTS4 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS4');
    //                     var defaultchuongdisable = {
    //                         disable: 0
    //                     }
    //                     KDO22ChuongDisableTS1.set(defaultchuongdisable);
    //                     KDO22ChuongDisableTS2.set(defaultchuongdisable);
    //                     KDO22ChuongDisableTS3.set(defaultchuongdisable);
    //                     KDO22ChuongDisableTS4.set(defaultchuongdisable);
    //                 }, 67000)
    //                 var KO22L2T2 = setTimeout(function () {
    //                     var KDO22Causo = firebase.database().ref(matchid + '/KDO22Causo');
    //                     var defaultcauso = {
    //                         causo: 0
    //                     }
    //                     KDO22Causo.set(defaultcauso);
    //                 }, 70000)
    //             }
    //         }
    //         else if (KDO22Turn == 3) {
    //             if (kdo22bd.val().batdau == 1) {
    //                 var KO22L3T1 = setTimeout(function () {
    //                     var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    //                     var defaultchuongstatus = {
    //                         status: 3
    //                     }
    //                     KDO22ChuongStatus.set(defaultchuongstatus);
    //                     var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
    //                     var defaultchuongplayer = {
    //                         id: 0
    //                     }
    //                     KDO22ChuongPlayer.set(defaultchuongplayer);
    //                     var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    //                     var correct = {
    //                         correctorwrong: 0
    //                     }
    //                     KDO22ChuongCorrectOrWrong.set(correct);
    //                     var KDO22ChuongDisableTS1 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS1');
    //                     var KDO22ChuongDisableTS2 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS2');
    //                     var KDO22ChuongDisableTS3 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS3');
    //                     var KDO22ChuongDisableTS4 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS4');
    //                     var defaultchuongdisable = {
    //                         disable: 0
    //                     }
    //                     KDO22ChuongDisableTS1.set(defaultchuongdisable);
    //                     KDO22ChuongDisableTS2.set(defaultchuongdisable);
    //                     KDO22ChuongDisableTS3.set(defaultchuongdisable);
    //                     KDO22ChuongDisableTS4.set(defaultchuongdisable);
    //                 }, 97000)
    //                 var KO22L3T2 = setTimeout(function () {
    //                     var KDO22Causo = firebase.database().ref(matchid + '/KDO22Causo');
    //                     var defaultcauso = {
    //                         causo: 0
    //                     }
    //                     KDO22Causo.set(defaultcauso);
    //                 }, 100000)
    //             }

    //         }
    //     }
    // }
    document.getElementById("KSO22Start").disabled = true;
}



function resetcauKDO22() {
    var KDO22Causo = firebase.database().ref(matchid + '/KDO22Causo');
    var defaultcauso = {
        causo: 0
    }
    KDO22Causo.set(defaultcauso);
}

function resetChuongKDO22() {
    var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
    var KDO22ChuongDisableTS1 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS1');
    var KDO22ChuongDisableTS2 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS2');
    var KDO22ChuongDisableTS3 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS3');
    var KDO22ChuongDisableTS4 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS4');



    var defaultchuongstatus = {
        status: 3
    }
    var defaultchuongCorrectOrWrong = {
        correctorwrong: 0
    }
    var defaultchuongplayer = {
        id: 0
    }
    var defaultchuongdisable = {
        disable: 0
    }

    KDO22ChuongDisableTS1.set(defaultchuongdisable);
    KDO22ChuongDisableTS2.set(defaultchuongdisable);
    KDO22ChuongDisableTS3.set(defaultchuongdisable);
    KDO22ChuongDisableTS4.set(defaultchuongdisable);
    KDO22ChuongStatus.set(defaultchuongstatus);
    KDO22ChuongCorrectOrWrong.set(defaultchuongCorrectOrWrong);
    KDO22ChuongPlayer.set(defaultchuongplayer);

}


function stopChuongKD() {
    var defaultchuongstatus = {
        status: 3
    }
    KDO22ChuongStatus.set(defaultchuongstatus);
    Notification("Quyền trả lời của thí sinh đã bị ngừng");
}

function countinueChuongKD() {
    var defaultchuongstatus = {
        status: 0
    }
    KDO22ChuongStatus.set(defaultchuongstatus);
    Notification("Quyền trả lời của thí sinh đã có hiệu lực");
}

function resetcountdownKD022() {
    var cd = {
        countdown: 0
    }
    var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');
    KDO223sCountdown.set(cd);
}

function KDO22CorrectAns() {
    var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    var correct = {
        correctorwrong: 1
    }
    KDO22ChuongCorrectOrWrong.set(correct);
    var KDO22NewQS = firebase.database().ref(matchid + '/KDO22Causo');
    KDO22NewQS.once('value', questionnum);
    function questionnum(qn) {
        var newq = {
            causo: qn.val().causo + 1,
        }
        KDO22NewQS.set(newq)
    }

    var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player').limitToFirst(1);
    KDO22ChuongPlayer.once('value', playerid);
    function playerid(pi) {
        pi.forEach(function (e) {
            var refplayerpoint = firebase.database().ref(matchid + '/point/player' + e.val().id);
            refplayerpoint.once('value', plpoint);
            function plpoint(pp) {
                var newpoint = {
                    point: pp.val().point + 10,
                }
                refplayerpoint.set(newpoint);
            }
        })
    }



    var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    var defaultchuongstatus = {
        status: 0
    }
    KDO22ChuongStatus.set(defaultchuongstatus);
    var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
    var defaultchuongplayer = {
        id: 0
    }
    KDO22ChuongPlayer.set(defaultchuongplayer);
    var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    var correct = {
        correctorwrong: 0
    }
    KDO22ChuongCorrectOrWrong.set(correct);
    var KDO22AnswerRightsRef = firebase.database().ref(matchid + "/KDO22AnswerRights");
    var answerright = {
        value: false
    }
    KDO22AnswerRightsRef.set(answerright);
}



function KDO22WrongAns() {
    var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    var correct = {
        correctorwrong: 2
    }
    KDO22ChuongCorrectOrWrong.set(correct);
    var KDO22NewQS = firebase.database().ref(matchid + '/KDO22Causo');
    KDO22NewQS.once('value', questionnum);
    function questionnum(qn) {
        var newq = {
            causo: qn.val().causo + 1,
        }
        KDO22NewQS.set(newq)
    }
    var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player').limitToFirst(1);
    KDO22ChuongPlayer.once('value', playerid);
    function playerid(pi) {
        pi.forEach(function (e) {
            var refplayerpoint = firebase.database().ref(matchid + '/point/player' + e.val().id);
            refplayerpoint.once('value', plpoint);
            function plpoint(pp) {
                if (pp.val().point <= 0) { } else {
                    var newpoint = {
                        point: pp.val().point - 5,
                    }
                    refplayerpoint.set(newpoint);
                }
            }
        })
    }


    var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    var defaultchuongstatus = {
        status: 0
    }
    KDO22ChuongStatus.set(defaultchuongstatus);
    var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
    var defaultchuongplayer = {
        id: 0
    }
    KDO22ChuongPlayer.set(defaultchuongplayer);
    var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    var correct = {
        correctorwrong: 0
    }
    KDO22ChuongCorrectOrWrong.set(correct);
    var KDO22AnswerRightsRef = firebase.database().ref(matchid + "/KDO22AnswerRights");
    var answerright = {
        value: false
    }
    KDO22AnswerRightsRef.set(answerright);
}



function KDO223sCountDown() {
    var cd = {
        countdown: 1
    }
    var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');
    KDO223sCountdown.set(cd);
    var cd = {
        countdown: 0
    }
    var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');
    KDO223sCountdown.set(cd);
    KDO22CountdownHandle();
}


function KDO22CountdownHandle() {
    var seconds = 3;
    var countdownjs = setInterval(function () {
        if (localStorage.getItem("timer3spause") == 0) {
            if (seconds > 0) {
                seconds = seconds - 1;
            }
        }
        if (seconds == 0) {

            var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
            var defaultchuongplayer = {
                id: 0
            }
            KDO22ChuongPlayer.set(defaultchuongplayer);
            var KDO22NewQS = firebase.database().ref(matchid + '/KDO22Causo');
            KDO22NewQS.once('value', questionnum);
            function questionnum(qn) {
                var newq = {
                    causo: qn.val().causo + 1,
                }
                KDO22NewQS.set(newq)
            }
            var KDO22ChuongDisableTS1 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS1');
            var KDO22ChuongDisableTS2 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS2');
            var KDO22ChuongDisableTS3 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS3');
            var KDO22ChuongDisableTS4 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS4');

            KDO22ChuongDisableTS1.once('value', KDO22CD1);
            function KDO22CD1(TS1) {
                if (TS1.val().disable == 0) {

                }
                if (TS1.val().disable > 0) {
                    var newvalue = {
                        disable: TS1.val().disable - 1
                    }
                    KDO22ChuongDisableTS1.set(newvalue);
                }
            }


            KDO22ChuongDisableTS2.once('value', KDO22CD2);
            function KDO22CD2(TS2) {
                if (TS2.val().disable == 0) {

                }
                if (TS2.val().disable > 0) {
                    var newvalue = {
                        disable: TS2.val().disable - 1
                    }
                    KDO22ChuongDisableTS2.set(newvalue);
                }
            }

            KDO22ChuongDisableTS3.once('value', KDO22CD3);
            function KDO22CD3(TS3) {
                if (TS3.val().disable == 0) {

                }
                if (TS3.val().disable > 0) {
                    var newvalue = {
                        disable: TS3.val().disable - 1
                    }
                    KDO22ChuongDisableTS3.set(newvalue);
                }
            }

            KDO22ChuongDisableTS4.once('value', KDO22CD4);
            function KDO22CD4(TS4) {
                if (TS4.val().disable == 0) {

                }
                if (TS4.val().disable > 0) {
                    var newvalue = {
                        disable: TS4.val().disable - 1
                    }
                    KDO22ChuongDisableTS4.set(newvalue);
                }
            }


        }
    }, 1000)
    setTimeout(function () {
        clearInterval(countdownjs);
    }, 3000)
}


// var KDO223sCountdown = firebase.database().ref(matchid + '/KDO223sCountdown');

// KDO223sCountdown.on('value', kdo22countdown);
// function kdo22countdown(cd) {
//     if (cd.val().countdown == 1) {

//     }
// }


var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
KDO22ChuongStatus.once('value', kdo22chuongst);
function kdo22chuongst(cs) {
    if (cs.val().status == 0) {
        localStorage.setItem("timer3spause", 0);
    }
    if (cs.val().status == 2) {
        localStorage.setItem("timer3spause", 1);
    }
    if (cs.val().status == 1) {
        localStorage.setItem("timer3spause", 1);
    }
}


function EmergencyStopStop() {
    var StartEmergencyStop = firebase.database().ref(matchid + '/StartEmergencyStop');
    var stop = {
        stop: 0
    }
    StartEmergencyStop.set(stop);
}
function EmergencyStopStart() {
    var StartEmergencyStop = firebase.database().ref(matchid + '/StartEmergencyStop');
    var stop = {
        stop: 1
    }
    StartEmergencyStop.set(stop);
}

function AccelerationO22() {
    var AccelerationType = firebase.database().ref(matchid + '/AccelerationType');

    var acc = {
        type: 1
    }

    AccelerationType.set(acc);
}

function stopKDO22() {
    var KDO22ChuongStatus = firebase.database().ref(matchid + '/KDO22Chuong/ChuongStatus');
    var defaultchuongstatus = {
        status: 3
    }
    KDO22ChuongStatus.set(defaultchuongstatus);
    var KDO22ChuongPlayer = firebase.database().ref(matchid + '/KDO22Chuong/Player');
    var defaultchuongplayer = {
        id: 0
    }
    KDO22ChuongPlayer.set(defaultchuongplayer);
    var KDO22ChuongCorrectOrWrong = firebase.database().ref(matchid + '/KDO22Chuong/CorrectOrWrong');
    var correct = {
        correctorwrong: 0
    }
    KDO22ChuongCorrectOrWrong.set(correct);
    var KDO22ChuongDisableTS1 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS1');
    var KDO22ChuongDisableTS2 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS2');
    var KDO22ChuongDisableTS3 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS3');
    var KDO22ChuongDisableTS4 = firebase.database().ref(matchid + '/KDO22ChuongDisable/TS4');
    var defaultchuongdisable = {
        disable: 0
    }
    KDO22ChuongDisableTS1.set(defaultchuongdisable);
    KDO22ChuongDisableTS2.set(defaultchuongdisable);
    KDO22ChuongDisableTS3.set(defaultchuongdisable);
    KDO22ChuongDisableTS4.set(defaultchuongdisable);

    var KDO22LuotThiStatus = firebase.database().ref(matchid + '/KDO22LuotThiStatus');
    var statuslt = {
        status: 0
    }
    KDO22LuotThiStatus.set(statuslt);

    setTimeout(function () {
        var KDO22Causo = firebase.database().ref(matchid + '/KDO22Causo');
        var defaultcauso = {
            causo: 0
        }
        KDO22Causo.set(defaultcauso);
    }, 2000);

    var KDO22AnswerRightsRef = firebase.database().ref(matchid + "/KDO22AnswerRights");
    var answerright = {
        value: false
    }
    KDO22AnswerRightsRef.set(answerright);

    Notification("Lượt chơi hiện tại đã dừng")

}


function resetlt() {
    var statuslt = {
        status: 3
    }
    firebase.database().ref(matchid + '/KDO22LuotThiStatus').set(statuslt);
}

function KDO22AnserRights() {
    var KDO22AnswerRightsRef = firebase.database().ref(matchid + "/KDO22AnswerRights");
    var answerright = {
        value: true
    }
    KDO22AnswerRightsRef.set(answerright);
    document.getElementById("KDO22AnswerRights").disabled = true;
}


function HNTTCheck() {
    var CNVROWTT = firebase.database().ref(matchid + '/VCNVRowStatus/HNTT');
    CNVROWTT.once('value', cnvrowst);
    function cnvrowst(st) {
        if (st.val().status == 0) {
            hntt();
        } else {
            if (confirm("Bạn có chắc chắn muốn mở hình ảnh hàng ngang không?") == true) {
                var HARef = firebase.database().ref(matchid + "/VCNVImageStatus/HATT");
                var status = {
                    status: 1
                }
                HARef.set(status);
            }
        }
    }
}


function openHA(number) {
    if (confirm("Bạn có chắc chắn muốn mở hình ảnh " + number + " không?") == true) {
        var HARef = firebase.database().ref(matchid + "/VCNVImageStatus/HA" + number);
        var status = {
            status: 1
        }
        HARef.set(status);
    }
}

function startOpeningMaket() {
    var refkhoidong = firebase.database().ref(matchid + "/gamestatus/khoidong");
    var refintro = firebase.database().ref(matchid + "/intro");
    var refvcnv = firebase.database().ref(matchid + '/gamestatus/vcnv');
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    var reftongketdiem = firebase.database().ref(matchid + "/gamestatus/tongketdiem");
    var refvedich = firebase.database().ref(matchid + "/gamestatus/vedich");
    var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
    var refvedichbatdau = firebase.database().ref(matchid + "/phanthistatus/vedich");
    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refkhoidongo22 = firebase.database().ref(matchid + "/gamestatus/khoidongo22");
    var refbanner = firebase.database().ref(matchid + "/gamestatus/banner");
    var VDQN = firebase.database().ref(matchid + "/VDCauso");
    var TTQS = firebase.database().ref(matchid + '/Acceleration/QS');
    var VDChuong = firebase.database().ref(matchid + "/VDChuong/ChuongStatus");
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var KDO22AnserRights = firebase.database().ref(matchid + "/KDO22AnswerRights");
    var intronumset = {
        intronum: 0
    }
    intronumber.set(intronumset);
    var intro = {
        intro: 0
    }
    var khoidong = {
        start: 0
    }
    var vcnv = {
        vcnv: 0
    }
    var tt = {
        tangtoc: 0,
    }
    var ttqs = {
        tangtoc: 0,
    }
    var tongketdiem = {
        tongketdiem: 0,
    }
    var vedich = {
        vedich: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var playerdefault = {
        player: 0
    }
    var batdau = {
        batdau: 0
    }
    var status = {
        status: 3,
    }
    var status1 = {
        status: 0
    }
    var set = {
        causo: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var answerright = {
        value: false
    }
    var banner = {
        banner: 1
    }
    refvedichphu.set(vedichphu);
    var VDNSHV = firebase.database().ref(matchid + "/VDNSHV/status");
    VDNSHV.set(status1);
    VDChuong.set(status);
    var reftangtoc = firebase.database().ref(matchid + "/gamestatus/tangtoc");
    reftangtoc.set(tt);
    refvcnv.set(vcnv);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    TTQS.set(ttqs);
    reftongketdiem.set(tongketdiem);
    refvedich.set(vedich);
    refthisinhvedich.set(playerdefault);
    refvedichbatdau.set(batdau);
    refkhoidongo22.set(khoidongo22);
    VDQN.set(set);
    KDO22AnserRights.set(answerright);

    var ds = {
        correctorwrong: 0,
    }
    var VDChuongCoW = firebase.database().ref(matchid + "/VDChuong/CorrectOrWrong");
    VDChuongCoW.set(ds);
    refbanner.set(banner);
    MatchNameBanner();
    muteAllMusic();
}

function ContestantList() {
    var data = {
        MatchName: false,
        ContesttantList: true,
        CustomText: false,
    }
    var refStatus = firebase.database().ref(matchid + "/Banner/Elements");
    refStatus.update(data);
    Notification("Đã bật giao diện danh sách thí sinh");
}

function MatchNameBanner() {
    var data = {
        MatchName: true,
        ContesttantList: false,
        CustomText: false,
    }
    var refStatus = firebase.database().ref(matchid + "/Banner/Elements");
    refStatus.update(data);
    Notification("Đã bật giao diện tên phòng trò chơi");
}

function CustomText() {
    let customTextValue = prompt('Nhập nội dung tại đây');
    var data = {
        MatchName: false,
        ContesttantList: false,
        CustomText: true,
        CustomTextContent: customTextValue,
    }
    var refStatus = firebase.database().ref(matchid + "/Banner/Elements");
    refStatus.update(data);
    Notification("Đã bật giao diện nội dung tuỳ chỉnh");
}


function changeMusic(music) {
    switch (music) {
        case 'MC':
            var data = {
                "MC": true,
                "ContesttantIntroduction": false,
                "Advisor1": false,
                "Advisor2": false,
                "Advisor3": false,
                "Advisor4": false,
                "Advisor5": false,
                "GivingPrize": false,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc giới thiệu MC");
            break;
        case 'ContesttantIntroduction':
            var data = {
                "MC": false,
                "ContesttantIntroduction": true,
                "Advisor1": false,
                "Advisor2": false,
                "Advisor3": false,
                "Advisor4": false,
                "Advisor5": false,
                "GivingPrize": false,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc giới thiệu thí sinh");
            break;
        case 'Advisor1':
            var data = {
                "MC": false,
                "ContesttantIntroduction": false,
                "Advisor1": true,
                "Advisor2": false,
                "Advisor3": false,
                "Advisor4": false,
                "Advisor5": false,
                "GivingPrize": false,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc Cố vấn 1");
            break;
        case 'Advisor2':
            var data = {
                "MC": false,
                "ContesttantIntroduction": false,
                "Advisor1": false,
                "Advisor2": true,
                "Advisor3": false,
                "Advisor4": false,
                "Advisor5": false,
                "GivingPrize": false,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc Cố vấn 2");
            break;
        case 'Advisor3':
            var data = {
                "MC": false,
                "ContesttantIntroduction": false,
                "Advisor1": false,
                "Advisor2": false,
                "Advisor3": true,
                "Advisor4": false,
                "Advisor5": false,
                "GivingPrize": false,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc Cố vấn 3");
            break;
        case 'Advisor4':
            var data = {
                "MC": false,
                "ContesttantIntroduction": false,
                "Advisor1": false,
                "Advisor2": false,
                "Advisor3": false,
                "Advisor4": true,
                "Advisor5": false,
                "GivingPrize": false,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc Cố vấn 4");
            break;
        case 'Advisor5':
            var data = {
                "MC": false,
                "ContesttantIntroduction": false,
                "Advisor1": false,
                "Advisor2": false,
                "Advisor3": false,
                "Advisor4": false,
                "Advisor5": true,
                "GivingPrize": false,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc Cố vấn 5");
            break;
        case 'GivingPrize':
            var data = {
                "MC": false,
                "ContesttantIntroduction": false,
                "Advisor1": false,
                "Advisor2": false,
                "Advisor3": false,
                "Advisor4": false,
                "Advisor5": false,
                "GivingPrize": true,
                "End": false
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc trao giải");
            break;
        case 'End':
            var data = {
                "MC": false,
                "ContesttantIntroduction": false,
                "Advisor1": false,
                "Advisor2": false,
                "Advisor3": false,
                "Advisor4": false,
                "Advisor5": false,
                "GivingPrize": false,
                "End": true
            }
            var refStatus = firebase.database().ref(matchid + "/Banner/Music");
            refStatus.update(data);
            Notification("Đã bật nhạc kết thúc");
            break;

    }
}


function muteAllMusic() {
    var data = {
        "MC": false,
        "ContesttantIntroduction": false,
        "Advisor1": false,
        "Advisor2": false,
        "Advisor3": false,
        "Advisor4": false,
        "Advisor5": false,
        "GivingPrize": false,
        "End": false
    }
    var refStatus = firebase.database().ref(matchid + "/Banner/Music");
    refStatus.update(data);
    Notification("Đã tắt tất cả nhạc");
}


function turnOffAllElement() {
    var data = {
        MatchName: false,
        ContesttantList: false,
        CustomText: false,
        CustomTextContent: "",
    }
    var refStatus = firebase.database().ref(matchid + "/Banner/Elements");
    refStatus.update(data);
    Notification("Đã tắt tất cả thành phần");
}

function playSound(sound) {
    switch (sound) {
        case 'SpacingMusic':
            var data = {
                SpacingMusic: true,
            }
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.update(data);
            setTimeout(function () {
                var data = {
                    SpacingMusic: false,
                }
                var refStatus = firebase.database().ref(matchid + "/Sounds");
                refStatus.update(data);
            }, 1000)
            Notification("Đã phát âm thanh khoảng cách");
            break;
        case 'EnglishVoice':
            var data = {
                EnglishVoice: true,
            }
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.update(data);
            var data = {
                EnglishVoice: false,
            }
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.update(data);
            Notification("Đã phát âm thanh câu hỏi tiếng Anh");
            break;
        case 'TenseMoments':
            var data = {
                TenseMoments: true,
            }
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.update(data);
            // var data = {
            //     EnglishVoice: false,
            // }
            // var refStatus = firebase.database().ref(matchid + "/Sounds");
            // refStatus.update(data);
            break;
    }
}


function stopSound(sound) {
    switch (sound) {
        case 'TenseMoments':
            var data = {
                TenseMoments: false,
            }
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.update(data);
            break;
    }
}


var Participant = firebase.database().ref(matchid + "/Participant");

Participant.on('value', participant);

function participant(snapshot) {
    var joinRequestList = document.querySelector('.join-request-list');
    var viewerList = document.querySelector('.viewer-list');
    var blockedList = document.querySelector('.blocked-list');
    joinRequestList.innerHTML = '';  // Clear the list before appending
    viewerList.innerHTML = '';  // Clear the viewer list before appending
    blockedList.innerHTML = '';  // Clear the blocked list before appending

    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();

        if (childData.requestStatus === 0) {
            var joinRequestDiv = document.createElement('div');
            joinRequestDiv.className = 'join-request';

            var joinText = document.createElement('p');
            joinText.className = 'join-text';
            if (childData.role === "Viewer") {
                joinText.textContent = childData.displayName + " yêu cầu xem phòng trò chơi";
            } else if (childData.role === "Scoreboard") {
                joinText.textContent = childData.displayName + " yêu cầu truy cập bảng điểm";
            } else {
                joinText.textContent = childData.displayName + " yêu cầu xem phòng trò chơi";
            }
            joinRequestDiv.appendChild(joinText);

            var buttonContainer = document.createElement('div');
            buttonContainer.className = 'join-request-buttons';

            var acceptButton = document.createElement('button');
            acceptButton.className = 'accept';
            acceptButton.textContent = 'CHẤP NHẬN';
            acceptButton.addEventListener('click', function () {
                updateRequestStatus(childSnapshot.key, 1);
            });

            var deniedButton = document.createElement('button');
            deniedButton.className = 'denied';
            deniedButton.textContent = 'TỪ CHỐI';
            deniedButton.addEventListener('click', function () {
                updateRequestStatus(childSnapshot.key, 2);
            });

            var blockButton = document.createElement('button');
            blockButton.className = 'block';
            blockButton.textContent = 'CHẶN';
            blockButton.addEventListener('click', function () {
                updateRequestStatus(childSnapshot.key, 3);
            });

            buttonContainer.appendChild(acceptButton);
            buttonContainer.appendChild(deniedButton);
            buttonContainer.appendChild(blockButton);

            joinRequestDiv.appendChild(buttonContainer);

            joinRequestList.appendChild(joinRequestDiv);
        }

        if (childData.requestStatus === 1) {
            var viewerDiv = document.createElement('div');
            viewerDiv.className = 'viewer';

            var viewerText = document.createElement('p');
            viewerText.className = 'viewer-text';
            viewerText.textContent = childData.displayName;
            viewerDiv.appendChild(viewerText);

            var viewerButtonContainer = document.createElement('div');
            viewerButtonContainer.className = 'viewer-buttons';

            var unblockButton = document.createElement('button');
            unblockButton.className = 'denied';
            unblockButton.textContent = 'KICK';
            unblockButton.addEventListener('click', function () {
                removeParticipant(childSnapshot.key);
            });

            var blockButton = document.createElement('button');
            blockButton.className = 'block';
            blockButton.textContent = 'CHẶN';
            blockButton.addEventListener('click', function () {
                updateRequestStatus(childSnapshot.key, 3);
            });
            viewerButtonContainer.appendChild(unblockButton);
            viewerButtonContainer.appendChild(blockButton);
            viewerDiv.appendChild(viewerButtonContainer);

            viewerList.appendChild(viewerDiv);
        }

        if (childData.requestStatus === 3) {
            var blockedDiv = document.createElement('div');
            blockedDiv.className = 'blocked';

            var blockedText = document.createElement('p');
            blockedText.className = 'blocked-text';
            blockedText.textContent = childData.displayName + ' (' + childData.uid + ')';
            blockedDiv.appendChild(blockedText);

            var blockedButtonContainer = document.createElement('div');
            blockedButtonContainer.className = 'blocked-buttons';

            var unblockButton = document.createElement('button');
            unblockButton.className = 'unblock';
            unblockButton.textContent = 'BỎ CHẶN';
            unblockButton.addEventListener('click', function () {
                removeParticipant(childSnapshot.key);
            });

            blockedButtonContainer.appendChild(unblockButton);

            blockedDiv.appendChild(blockedButtonContainer);

            blockedList.appendChild(blockedDiv);
        }
    });
}



function updateRequestStatus(pushId, status) {
    Participant.child(pushId).update({ requestStatus: status });
    switch (status) {
        case 1:
            Notification("Đã chấp nhận yêu cầu xem phòng trò chơi");
            break;
        case 2:
            Notification("Đã từ chối yêu cầu xem phòng trò chơi");
            break;
        case 3:
            Notification("Đã chặn xem phòng trò chơi");
            break;
    }
}

function removeParticipant(pushId) {
    Participant.child(pushId).remove();
}

function block(position) {
    var participantRef = firebase.database().ref(matchid + "/Participant/");
    var getUserIdFromPositionRef = firebase.database().ref(matchid + "/games/player" + position);

    getUserIdFromPositionRef.once('value', function (snapshot) {
        if (snapshot.val().uid === "") { } else {
            var joinMayChieu = {
                uid: snapshot.val().uid,
                displayName: snapshot.val().displayName,
                role: "Banned",
                requestStatus: 3,
            };
            participantRef.push(joinMayChieu);
        }
    });
}

function blockMC(position) {

    var participantRef = firebase.database().ref(matchid + "/Participant/");
    var getUserIdFromPositionRef = firebase.database().ref(matchid + "/games/mc" + position);

    getUserIdFromPositionRef.once('value', function (snapshot) {
        if (snapshot.val().uid === "") { } else {
            var joinMayChieu = {
                uid: snapshot.val().uid,
                displayName: snapshot.val().displayName,
                role: "Banned",
                requestStatus: 3,
            };
            participantRef.push(joinMayChieu);
        }
    });
}


function AccelerationDisplayAnswer(status) {
    if (status == true) {
        if (confirm("Bạn có muốn hiển thị hình ảnh đáp án?") == true) {
            var AccelerationDisplayAnswerImage = firebase.database().ref(matchid + '/AccelerationDisplayAnswerImage/');
            var data = {
                status: status
            }
            AccelerationDisplayAnswerImage.set(data);
        }
    } else {
        var AccelerationDisplayAnswerImage = firebase.database().ref(matchid + '/AccelerationDisplayAnswerImage/');
        var data = {
            status: status
        }
        AccelerationDisplayAnswerImage.set(data);
    }
}

const introList = document.getElementById('intro-list');
const videoRef = firebase.database().ref(matchid + '/CustomVideo');
videoRef.on('child_added', (data) => {
    console.log('Child added: ', data.val());
    addVideoToList(data.key, data.val().title, data.val().embededLink);
});

videoRef.on('child_removed', (data) => {
    console.log('Child removed: ', data.key);
    removeVideoFromList(data.key);
});

videoRef.on('child_changed', (data) => {
    console.log('Child changed: ', data.val());
    updateVideoInList(data.key, data.val().title, data.val().embededLink);
});


function addVideoToList(key, title, link) {
    const a = document.createElement('a');
    a.id = key;
    a.className = 'dropdown-item';
    a.href = '#';
    a.innerHTML = `
        ${title}
    `;
    a.onclick = function () {
        StartCustomVideo(key);
        VDOffNSHV();
        resetChuong();
        resetChuongKDO22();
        resetOpenall();
    };
    document.getElementById('intro-list').appendChild(a);
}

function removeVideoFromList(key) {
    const a = document.getElementById(key);
    if (a) {
        a.remove();
    }
}

function updateVideoInList(key, title, link) {
    const a = document.getElementById(key);
    if (a) {
        a.id = key;
        a.className = 'dropdown-item';
        a.href = '#';
        a.innerHTML = `
            ${title}
        `;
        a.onclick = function () {
            StartCustomVideo(key);
            VDOffNSHV();
            resetChuong();
            resetChuongKDO22();
            resetOpenall();
        };
    }
}


function StartCustomVideo(id) {

    var refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");
    var refintroreplay = firebase.database().ref(matchid + "/replayintro");
    var intronumber = firebase.database().ref(matchid + "/IntroNum/");
    var intronumset = {
        intronum: id
    }
    var intro = {
        intro: 1
    }
    var khoidong = {
        start: 0
    }
    var tangtoc = {
        tangtoc: 0
    }
    var tkd = {
        tongketdiem: 0
    }
    var vedich = {
        vedich: 0
    }
    var vedichphu = {
        vedichphu: 0
    }
    var khoidongo22 = {
        khoidongo22: 0
    }
    var banner = {
        banner: 0
    }
    var vcnv = {
        vcnv: 0
    }
    refvcnv.set(vcnv);
    refbanner.set(banner);
    intronumber.set(intronumset);
    refkhoidongo22.set(khoidongo22);
    refkhoidong.set(khoidong);
    refintro.set(intro);
    refintroreplay.set(intro);
    reftangtoc.set(tangtoc);
    reftongketdiem.set(tkd);
    refvedich.set(vedich);
    refintroreplay.set(intro);
    refvedichphu.set(vedichphu);

}

function AlreadyOpenAnswer() {
    setTimeout(function () {
        var status = {
            status: true
        }
        firebase.database().ref(matchid + '/AlreadyOpenAnswer').set(status);
    }, 3000);
}

function resetAlreadyOpenAnswer() {
    var status = {
        status: false
    }
    firebase.database().ref(matchid + '/AlreadyOpenAnswer').set(status);
}