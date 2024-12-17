//Handle UI
if (localStorage.getItem("isProjector") === 'true') {
    document.getElementsByClassName("ans-group")[0].style.display = "none";
    document.getElementsByClassName("questions")[0].style.height = "28vh";
    if (localStorage.getItem("isDisplayAvatar") === 'false') {
        var elements = document.getElementsByClassName("tsimg");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
        var elements = document.getElementsByClassName("chuongtsimg");
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].style.display = "none";
        }
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

shortcut.add("Ctrl+Tab", function () {
    var ansbar = document.getElementById("vcnvans");
    ansbar.value = "Bạn đã mất quyền trả lời";
    ansbar.disabled = true;
});


document.getElementById("audio_8").volume = 0.5;
document.getElementById("audio_9").volume = 0.5;
document.getElementById("audio_10").volume = 0.5;
document.getElementById("audio_11").volume = 0.5;
document.getElementById("audio_12").volume = 0.5;
document.getElementById("audio_13").volume = 0.5;
document.getElementById("audio_14").volume = 0.5;
document.getElementById("audio_15").volume = 0.5;
document.getElementById("audio_16").volume = 0.5;
document.getElementById("audio_extra_1").volume = 0.5;
document.getElementById("audio_extra_11").volume = 0.5;
document.getElementById("audio_extra_12").volume = 0.5;

document.getElementById("audio_8").play();

setTimeout(function () {
    var
        el = document.documentElement,
        rfs =
            el.requestFullScreen ||
            el.webkitRequestFullScreen ||
            el.mozRequestFullScreen;
    rfs.call(el);
}, 3000);

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


var vcnvrow = document.getElementById("vcnvrow");
var rowappear = document.getElementById("audio_9");
var rowchoose = document.getElementById("audio_10");
var rowthinking = document.getElementById("audio_11");
var answerappear = document.getElementById("audio_12");
var correctanswer = document.getElementById("audio_13");
var wronganswer = document.getElementById("audio_14");
var vcnvanswerrow = document.getElementById("audio_15");
var vcnvright = document.getElementById("audio_16");

var ansbar = document.getElementById("vcnvans");
var anspreview = document.getElementById("dapan");
rowappear.volume = 0.5;
correctanswer.volume = 0.5;
wronganswer.volume = 0.5;
ansbar.disabled = true;
anspreview.disabled = true;

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


var VCNVOpenAnswer = firebase.database().ref(matchid + '/VCNVOpenAnswer');



var vcnv = firebase.database().ref(matchid + '/VCNV/hangngang');


var image = document.getElementById("vcnvimage");
var overlay = document.getElementById("vcnvoverlay");



shortcut.add("F2", function () {
    anchuong();
});


function anchuong() {
    var VCNVCHUONG = firebase.database().ref(matchid + "/VCNVChuong/TS" + localStorage.getItem("id"));
    VCNVCHUONG.once('value', bell);
    function bell(chuong) {
        if (chuong.val().chuong == 0) {
            var chuong = {
                chuong: 1,
            }

            VCNVCHUONG.set(chuong);
        }
        else if (chuong.val().chuong == 1) {

        }
    }
    ansbar.disabled = true;
    anspreview.disabled = true;
    ansbar.value = "";
}

setTimeout(function () {
    document.getElementById("competition-name").style.display = 'none';
    document.getElementById("competition-ui").style.display = 'block';
    rowappear.play();
    var dapan = document.getElementById("dapan");
    dapan.value = "";
    setTimeout(function () {
        firebase.storage().ref(matchid + '/img/cnv/cnv.jpg').getDownloadURL().then(imgUrl => {
            vcnvimage.src = imgUrl;
        });
    }, 1000);
}, 11000);



var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV');

CNVDB.on('value', cnvfdb);

function cnvfdb(cnv) {
    var vcnvcnv = cnv.val().cnv;
    let remText = vcnvcnv.replace(/\s/g, "");
    length = remText.length;
    var cnvid = document.getElementById("sochucai");
    cnvid.innerHTML = length;
}


var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
CNVHN1.on('value', cnvhns1);

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



                for (let i = 0; i < lengthanshn1; i++) {
                    document.getElementById("HN1").innerHTML += '<div class="ansbubble1"></div>'
                }
                for (let i = 0; i < lengthanshn2; i++) {
                    document.getElementById("HN2").innerHTML += '<div class="ansbubble2"></div>'
                }
                for (let i = 0; i < lengthanshn3; i++) {
                    document.getElementById("HN3").innerHTML += '<div class="ansbubble3"></div>'
                }
                for (let i = 0; i < lengthanshn4; i++) {
                    document.getElementById("HN4").innerHTML += '<div class="ansbubble4"></div>'
                }
            }
        }
    }
}


var vcnv = firebase.database().ref(matchid + '/VCNV/hangngang');
vcnv.on('value', hnso);
var currentQuestion = "";

function resetSlider() {
    let questionsElement = document.querySelector('.questions');
    questionsElement.style.setProperty('--timer-width', '0%');
}


function hnso(ohn) {
    if (ohn.val().hn == 1) {
        rowchoose.play();
        resetSlider();
        var ansb1 = document.getElementsByClassName("ansbubble1");
        for (let i = 0; i < ansb1.length; i++) {
            ansb1[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
        }
        var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
        var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
        var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
        var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
        var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');
        CNVHN1.on('value', chhn1);
        function chhn1(chs1) {
            var cauhoihn1 = chs1.val().cauhoi;
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.on('value', EnglishAudio);
            function EnglishAudio(status) {
                if (status.val().EnglishVoice == true && localStorage.getItem("HN") == 1) {
                    EnglishVoice(cauhoihn1);
                    if (currentQuestion != cauhoihn1) {
                        currentQuestion = cauhoihn1;
                    }
                    return false;
                }
            }
            setTimeout(function () {
                var questionb = document.getElementById("question");
                questionb.innerHTML = cauhoihn1;
            }, 1500);
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
            // document.getElementById("wrong-mask1").style.display = "none";
            // document.getElementById("wrong-mask2").style.display = "none";
            // document.getElementById("wrong-mask3").style.display = "none";
            // document.getElementById("wrong-mask4").style.display = "none";
            var questionb = document.getElementById("question");

        }
        localStorage.setItem("HN", 1);
        var dapan = document.getElementById("dapan");
        dapan.value = "";
        greenScreenProcess();
    }
    if (ohn.val().hn == 2) {
        rowchoose.play();
        resetSlider();
        var ansb2 = document.getElementsByClassName("ansbubble2");
        for (let i = 0; i < ansb2.length; i++) {
            ansb2[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
        }
        var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
        var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
        var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
        var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
        var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');
        CNVHN2.on('value', chhn2);

        function chhn2(chs2) {
            var cauhoihn2 = chs2.val().cauhoi;
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.on('value', EnglishAudio);
            function EnglishAudio(status) {
                if (status.val().EnglishVoice == true && localStorage.getItem("HN") == 2) {
                    EnglishVoice(cauhoihn2);
                    if (currentQuestion != cauhoihn2) {
                        currentQuestion = cauhoihn2;
                    }
                }
                return false;
            }
            setTimeout(function () {
                var questionb = document.getElementById("question");
                questionb.innerHTML = cauhoihn2;
            }, 1500);
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
            // document.getElementById("wrong-mask1").style.display = "none";
            // document.getElementById("wrong-mask2").style.display = "none";
            // document.getElementById("wrong-mask3").style.display = "none";
            // document.getElementById("wrong-mask4").style.display = "none";
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", 2);
        var dapan = document.getElementById("dapan");
        dapan.value = "";
        greenScreenProcess();
    }
    if (ohn.val().hn == 3) {
        rowchoose.play();
        resetSlider();
        var ansb3 = document.getElementsByClassName("ansbubble3");
        for (let i = 0; i < ansb3.length; i++) {
            ansb3[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
        }
        var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
        var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
        var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
        var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
        var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');
        CNVHN3.on('value', chhn3);

        function chhn3(chs3) {
            var cauhoihn3 = chs3.val().cauhoi;
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.on('value', EnglishAudio);
            function EnglishAudio(status) {
                if (status.val().EnglishVoice == true && localStorage.getItem("HN") == 3) {
                    EnglishVoice(cauhoihn3);
                    if (currentQuestion != cauhoihn3) {
                        currentQuestion = cauhoihn3;
                    }
                }
                return false;
            }
            setTimeout(function () {
                var questionb = document.getElementById("question");
                questionb.innerHTML = cauhoihn3;
            }, 1500);
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
            // document.getElementById("wrong-mask1").style.display = "none";
            // document.getElementById("wrong-mask2").style.display = "none";
            // document.getElementById("wrong-mask3").style.display = "none";
            // document.getElementById("wrong-mask4").style.display = "none";
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", 3);
        var dapan = document.getElementById("dapan");
        dapan.value = "";
        greenScreenProcess();
    }
    if (ohn.val().hn == 4) {
        rowchoose.play();
        resetSlider();
        var ansb4 = document.getElementsByClassName("ansbubble4");
        for (let i = 0; i < ansb4.length; i++) {
            ansb4[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
        }
        var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
        var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
        var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
        var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
        var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');
        CNVHN4.on('value', chhn4);

        function chhn4(chs4) {
            var cauhoihn4 = chs4.val().cauhoi;
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.on('value', EnglishAudio);
            function EnglishAudio(status) {
                if (status.val().EnglishVoice == true && localStorage.getItem("HN") == 4) {
                    EnglishVoice(cauhoihn4);
                    if (currentQuestion != cauhoihn4) {
                        currentQuestion = cauhoihn4;
                    }
                }
                return false;
            }
            setTimeout(function () {
                var questionb = document.getElementById("question");
                questionb.innerHTML = cauhoihn4;
            }, 1500);
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
            // document.getElementById("wrong-mask1").style.display = "none";
            // document.getElementById("wrong-mask2").style.display = "none";
            // document.getElementById("wrong-mask3").style.display = "none";
            // document.getElementById("wrong-mask4").style.display = "none";
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", 4);
        var dapan = document.getElementById("dapan");
        dapan.value = "";
        greenScreenProcess();
    }
    if (ohn.val().hn == 5) {
        rowchoose.play();
        resetSlider();
        var hn1overlay = document.getElementById("overlay-hn1");
        var hn2overlay = document.getElementById("overlay-hn2");
        var hn3overlay = document.getElementById("overlay-hn3");
        var hn4overlay = document.getElementById("overlay-hn4");
        var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
        var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
        var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
        var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
        var CNVHNTT = firebase.database().ref(matchid + '/VCNVQuestion/HNTT/');
        CNVHNTT.on('value', chhntt);

        function chhntt(chstt) {
            var cauhoihntt = chstt.val().cauhoi;
            var refStatus = firebase.database().ref(matchid + "/Sounds");
            refStatus.on('value', EnglishAudio);
            function EnglishAudio(status) {
                if (status.val().EnglishVoice == true && localStorage.getItem("HN") == 'TT') {
                    EnglishVoice(cauhoihntt);
                    if (currentQuestion != cauhoihntt) {
                        currentQuestion = cauhoihntt;
                    }
                }
                return false;
            }
            setTimeout(function () {
                var questionb = document.getElementById("question");
                questionb.innerHTML = cauhoihntt;
            }, 1500);
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
            // document.getElementById("wrong-mask1").style.display = "none";
            // document.getElementById("wrong-mask2").style.display = "none";
            // document.getElementById("wrong-mask3").style.display = "none";
            // document.getElementById("wrong-mask4").style.display = "none";
            var questionb = document.getElementById("question");
        }
        localStorage.setItem("HN", "TT");
        var dapan = document.getElementById("dapan");
        dapan.value = "";
        greenScreenProcess();
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



function Time() {
    var time = 0;
    let maxTime = 15; // Timer duration in seconds
    let questionsElement = document.querySelector('.questions');
    let steps = maxTime * 100; // 100 steps per second

    function updateSlider() {
        if (time <= steps) {
            let percentage = (time / steps) * 100;
            questionsElement.style.setProperty('--timer-width', percentage + '%');
            time++;
        } else {
            clearInterval(timerInterval);
        }
    }

    let timerInterval = setInterval(updateSlider, 10); // Update every 10 milliseconds for smoothness
}

var vcnvstatus = firebase.database().ref(matchid + '/phanthistatus/vcnv');
vcnvstatus.on('value', demtg);



function demtg(vcnv) {
    if (vcnv.val().batdau == 1) {
        rowthinking.play();
        Time();
        MinusTime();
        ansbar.value = "";
    }
}

function MinusTime() {
    ansbar.disabled = false;
    anspreview.disabled = false;
    document.getElementById("vcnvans").focus();
    setTimeout(function () {
        ansbar.disabled = true;
        anspreview.disabled = true;
        ansbar.value = "";
    }, 15000)
}


document.getElementById('vcnvans').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        var ans = document.getElementById("vcnvans");
        var prenewans = ans.value.replace('<', '');
        var newans = prenewans.replace('>', '');
        var id = localStorage.getItem("id");
        var tstamp = document.getElementById("timestamp");
        var mms = localStorage.getItem("mms");
        var s = localStorage.getItem("s");
        if (id == 1) {
            var ans = document.getElementById("vcnvans");
            var sendans = {
                answer: newans,
            }
            var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
            CNVANS1.set(sendans);
        }
        if (id == 2) {
            var ans = document.getElementById("vcnvans");
            var sendans = {
                answer: newans,
            }
            var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
            CNVANS2.set(sendans);
        }
        if (id == 3) {
            var ans = document.getElementById("vcnvans");
            var sendans = {
                answer: newans,
            }
            var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
            CNVANS3.set(sendans);
        }
        if (id == 4) {
            var ans = document.getElementById("vcnvans");
            var sendans = {
                answer: newans,
            }
            var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
            CNVANS4.set(sendans);
        }
        ans.value = '';


    }
});



var getdapan = firebase.database().ref(matchid + "/VCNVAnswer/TS" + localStorage.getItem("id"));
getdapan.on("value", dapan);

function dapan(vl) {
    var showdapan = document.getElementById("dapan");
    var dapan = vl.val().answer;
    showdapan.value = dapan.toUpperCase();
}



var ans = document.getElementById("dapan");
ans.value = " ";


var CNVANS1 = firebase.database().ref(matchid + '/VCNVAnswer/TS1/');
CNVANS1.on("value", da1);

function da1(dapanu1) {
    var CNVANS2 = firebase.database().ref(matchid + '/VCNVAnswer/TS2/');
    CNVANS2.on("value", da2);

    function da2(dapanu2) {
        var CNVANS3 = firebase.database().ref(matchid + '/VCNVAnswer/TS3/');
        CNVANS3.on("value", da3);

        function da3(dapanu3) {
            var CNVANS4 = firebase.database().ref(matchid + '/VCNVAnswer/TS4/');
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





var congdiem = true;
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
                        if (ds1.val().dunghaysai == 0) {
                            var dapan1 = document.getElementById("odapan1");
                            // dapan1.style.backgroundImage = 'url("/img/backgroundobject.jpg")';
                            // document.getElementById("wrong-mask1").style.display = "none";
                            resetPlayerAnswer();
                        }
                        if (ds2.val().dunghaysai == 0) {
                            var dapan2 = document.getElementById("odapan2");
                            resetPlayerAnswer();
                        }
                        if (ds3.val().dunghaysai == 0) {
                            var dapan3 = document.getElementById("odapan3");
                            resetPlayerAnswer();
                        }
                        if (ds4.val().dunghaysai == 0) {
                            var dapan4 = document.getElementById("odapan4");
                            resetPlayerAnswer();
                        }
                        if (ds1.val().dunghaysai == 1) {
                            setBackgroundColorAnswer(1);
                            var CNVROW = firebase.database().ref(matchid + '/VCNVRowStatus/HN' + localStorage.getItem("HN"));
                            var status = {
                                status: 1,
                            }
                            CNVROW.set(status);
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds2.val().dunghaysai == 1) {
                            setBackgroundColorAnswer(2);
                            var CNVROW = firebase.database().ref(matchid + '/VCNVRowStatus/HN' + localStorage.getItem("HN"));
                            var status = {
                                status: 1,
                            }
                            CNVROW.set(status);
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds3.val().dunghaysai == 1) {
                            setBackgroundColorAnswer(3);
                            var CNVROW = firebase.database().ref(matchid + '/VCNVRowStatus/HN' + localStorage.getItem("HN"));
                            var status = {
                                status: 1,
                            }
                            CNVROW.set(status);
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds4.val().dunghaysai == 1) {
                            setBackgroundColorAnswer(4);
                            var CNVROW = firebase.database().ref(matchid + '/VCNVRowStatus/HN' + localStorage.getItem("HN"));
                            var status = {
                                status: 1,
                            }
                            CNVROW.set(status);
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds1.val().dunghaysai == 2) {
                            var dapan1 = document.getElementById("odapan1");
                            dapan1.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds2.val().dunghaysai == 2) {
                            var dapan2 = document.getElementById("odapan2");
                            dapan2.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds3.val().dunghaysai == 2) {
                            var dapan3 = document.getElementById("odapan3");
                            dapan3.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds4.val().dunghaysai == 2) {
                            var dapan4 = document.getElementById("odapan4");
                            dapan4.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
                            var questionb = document.getElementById("question");
                            questionb.innerHTML = "";
                        }
                        if (ds1.val().dunghaysai == 2 && ds2.val().dunghaysai == 2 && ds3.val().dunghaysai == 2 && ds4.val().dunghaysai == 2) {
                            wronganswer.play();
                            switch (localStorage.getItem("HN")) {
                                case '1':
                                    var ansb1 = document.getElementsByClassName("ansbubble1");
                                    for (let i = 0; i < ansb1.length; i++) {
                                        ansb1[i].style.backgroundImage = 'url("/img/ansbubble-wrong.png")';
                                    }
                                    break;
                                case '2':
                                    var ansb2 = document.getElementsByClassName("ansbubble2");
                                    for (let i = 0; i < ansb2.length; i++) {
                                        ansb2[i].style.backgroundImage = 'url("/img/ansbubble-wrong.png")';
                                    }
                                    break;
                                case '3':
                                    var ansb3 = document.getElementsByClassName("ansbubble3");
                                    for (let i = 0; i < ansb3.length; i++) {
                                        ansb3[i].style.backgroundImage = 'url("/img/ansbubble-wrong.png")';
                                    }
                                    break;
                                case '4':
                                    var ansb4 = document.getElementsByClassName("ansbubble4");
                                    for (let i = 0; i < ansb4.length; i++) {
                                        ansb4[i].style.backgroundImage = 'url("/img/ansbubble-wrong.png")';
                                    }
                                    break;
                            }
                        }
                        if (ds1.val().dunghaysai == 1) {
                            correctanswer.play();
                        }
                        if (ds2.val().dunghaysai == 1) {
                            correctanswer.play();
                        }
                        if (ds3.val().dunghaysai == 1) {
                            correctanswer.play();
                        }
                        if (ds4.val().dunghaysai == 1) {
                            correctanswer.play();
                        }
                    }
                }
            }
        }
    }
};


function resetPlayerAnswer() {
    const data = JSON.parse(localStorage.getItem("themeData"));
    var PlayerAnswerElements = document.getElementsByClassName("PlayerAnswer");
    for (let i = 0; i < PlayerAnswerElements.length; i++) {
        if (data.ObstacleCompetitorAnswer != "") {
            PlayerAnswerElements[i].style.background = CheckBackgroundValue(data.ObstacleCompetitorAnswer);
            PlayerAnswerElements[i].style.backgroundSize = "cover";
        } else {
            PlayerAnswerElements[i].style.background = "linear-gradient(120deg, rgba(0, 56, 127, 1) 0%, rgba(0, 56, 127, 1) 100%)";
        }
    }
}

function setBackgroundColorAnswer(player) {
    const data = JSON.parse(localStorage.getItem("themeData"));
    var PlayerAnswer = document.getElementById("odapan" + player);
    if (data.ObstacleCompetitorAnswer != "") {
        PlayerAnswer.style.background = CheckBackgroundValue(data.ObstacleCompetitorAnswer);
        PlayerAnswer.style.backgroundSize = "cover";
    } else {
        PlayerAnswer.style.background = "linear-gradient(120deg, rgba(0, 56, 127, 1) 0%, rgba(0, 56, 127, 1) 100%)";
    }
}

var CNVROW1 = firebase.database().ref(matchid + '/VCNVRowStatus/HN1');
CNVROW1.on("value", CNVROWTF1);

function CNVROWTF1(status1) {
    var CNVROW2 = firebase.database().ref(matchid + '/VCNVRowStatus/HN2');
    CNVROW2.on("value", CNVROWTF2);

    function CNVROWTF2(status2) {
        var CNVROW3 = firebase.database().ref(matchid + '/VCNVRowStatus/HN3');
        CNVROW3.on("value", CNVROWTF3);

        function CNVROWTF3(status3) {
            var CNVROW4 = firebase.database().ref(matchid + '/VCNVRowStatus/HN4');
            CNVROW4.on("value", CNVROWTF4);

            function CNVROWTF4(status4) {
                var CNVROWTT = firebase.database().ref(matchid + '/VCNVRowStatus/HNTT');
                CNVROWTT.on("value", CNVROWTT5);

                function CNVROWTT5(status5) {
                    if (status1.val().status == 1) {
                        var CNVHN1 = firebase.database().ref(matchid + '/VCNVQuestion/HN1/');
                        CNVHN1.on("value", dapanhn1);

                        function dapanhn1(dapanhnso1) {
                            var anshnso1 = dapanhnso1.val().dapan;
                            var dapan = anshnso1.replace(/\s/g, "");
                            var ansb1 = document.getElementsByClassName("ansbubble1");
                            for (let i = 0; i < ansb1.length; i++) {
                                ansb1[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
                                ansb1[i].innerHTML = '<a class="ans-text">' + dapan[i] + '</a>';
                            }

                        }
                    }
                    if (status2.val().status == 1) {
                        var CNVHN2 = firebase.database().ref(matchid + '/VCNVQuestion/HN2/');
                        CNVHN2.on("value", dapanhn2);

                        function dapanhn2(dapanhnso2) {
                            var anshnso2 = dapanhnso2.val().dapan;
                            var dapan = anshnso2.replace(/\s/g, "");
                            var ansb2 = document.getElementsByClassName("ansbubble2");
                            for (let i = 0; i < ansb2.length; i++) {
                                ansb2[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
                                ansb2[i].innerHTML = '<a class="ans-text">' + dapan[i] + '</a>';
                            }
                        }
                    }
                    if (status3.val().status == 1) {
                        var CNVHN3 = firebase.database().ref(matchid + '/VCNVQuestion/HN3/');
                        CNVHN3.on("value", dapanhn3);

                        function dapanhn3(dapanhnso3) {
                            var anshnso3 = dapanhnso3.val().dapan;
                            var dapan = anshnso3.replace(/\s/g, "");
                            var ansb3 = document.getElementsByClassName("ansbubble3");
                            for (let i = 0; i < ansb3.length; i++) {
                                ansb3[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
                                ansb3[i].innerHTML = '<a class="ans-text">' + dapan[i] + '</a>';
                            }
                        }
                    }
                    if (status4.val().status == 1) {
                        var CNVHN4 = firebase.database().ref(matchid + '/VCNVQuestion/HN4/');
                        CNVHN4.on("value", dapanhn4);

                        function dapanhn4(dapanhnso4) {
                            var anshnso4 = dapanhnso4.val().dapan;
                            var dapan = anshnso4.replace(/\s/g, "");
                            var ansb4 = document.getElementsByClassName("ansbubble4");
                            for (let i = 0; i < ansb4.length; i++) {
                                ansb4[i].style.backgroundImage = 'url("/img/ansbubble-open.png")';
                                ansb4[i].innerHTML = '<a class="ans-text">' + dapan[i] + '</a>';
                            }
                        }
                    }
                    if (status5.val().status == 1) {

                    }
                }
            }
        }
    }
};



var VCNVCORRECT = firebase.database().ref(matchid + '/VCNVChuong/OpenAll');
VCNVCORRECT.on("value", vcnvcorrect);

function vcnvcorrect(cr) {
    if (cr.val().correct == 1) {
        var correct = {
            status: 1,
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

        CNVROW1.set(correct);
        CNVROW2.set(correct);
        CNVROW3.set(correct);
        CNVROW4.set(correct);
        CNVROWTT.set(correct);


        CNVROWIMG1.set(correct);
        CNVROWIMG2.set(correct);
        CNVROWIMG3.set(correct);
        CNVROWIMG4.set(correct);
        CNVROWIMGTT.set(correct);
        vcnvright.play();
        var CNVDB = firebase.database().ref(matchid + '/VCNVQuestion/CNV');
        CNVDB.on("value", cnvappear);

        function cnvappear(cnva) {
            var cnvdapan = document.getElementById("cnvdapan");
            cnvdapan.innerHTML = "CHƯỚNG NGẠI VẬT: " + cnva.val().cnv.toUpperCase();
        }
    }
    if (cr.val().correct == 2) {
        wronganswer.play();
    }

}


setInterval(function () {
    var VCNVDisabledAnsTS1 = firebase.database().ref(matchid + '/VCNVDisable/TS1/');
    var VCNVDisabledAnsTS2 = firebase.database().ref(matchid + '/VCNVDisable/TS2/');
    var VCNVDisabledAnsTS3 = firebase.database().ref(matchid + '/VCNVDisable/TS3/');
    var VCNVDisabledAnsTS4 = firebase.database().ref(matchid + '/VCNVDisable/TS4/');
    VCNVDisabledAnsTS1.on('value', disable1);
    VCNVDisabledAnsTS2.on('value', disable2);
    VCNVDisabledAnsTS3.on('value', disable3);
    VCNVDisabledAnsTS4.on('value', disable4);

    function disable1(di1) {
        if (di1.val().ansbardisabled == 1 && localStorage.getItem("id") == 1) {
            var ansbar = document.getElementById("vcnvans");
            var anspreview = document.getElementById("dapan");
            anspreview.disabled = true;
            anspreview.value = "";
            ansbar.disabled = true;
            ansbar.value = "Bạn đã mất quyền trả lời!!!"
        }
    }

    function disable2(di2) {
        if (di2.val().ansbardisabled == 1 && localStorage.getItem("id") == 2) {
            var ansbar = document.getElementById("vcnvans");
            var anspreview = document.getElementById("dapan");
            anspreview.disabled = true;
            anspreview.value = "";
            ansbar.disabled = true;
            ansbar.value = "Bạn đã mất quyền trả lời!!!"
        }
    }

    function disable3(di3) {
        if (di3.val().ansbardisabled == 1 && localStorage.getItem("id") == 3) {
            var ansbar = document.getElementById("vcnvans");
            var anspreview = document.getElementById("dapan");
            anspreview.disabled = true;
            anspreview.value = "";
            ansbar.disabled = true;
            ansbar.value = "Bạn đã mất quyền trả lời!!!"
        }
    }

    function disable4(di4) {
        if (di4.val().ansbardisabled == 1 && localStorage.getItem("id") == 4) {
            var ansbar = document.getElementById("vcnvans");
            var anspreview = document.getElementById("dapan");
            anspreview.disabled = true;
            anspreview.value = "";
            ansbar.disabled = true;
            ansbar.value = "Bạn đã mất quyền trả lời!!!"
        }
    }
})


firebase.database().ref(matchid + '/VCNVAudio').on('value', audioHN);
function audioHN(au) {
    if (au.val().audio == 0) {
        document.getElementById("HNAudio").pause();
        document.getElementById("HNAudio").currentTime = 0;
    }
    if (au.val().audio == 1) {
        document.getElementById("HNAudio").play();
    }
}

setTimeout(function () {
    VCNVOpenAnswer.on('value', openans);
    function openans(oa) {
        var AlreadyOpenAnswerRef = firebase.database().ref(matchid + '/AlreadyOpenAnswer');
        AlreadyOpenAnswerRef.once('value', AlreadyOpenAnswerFunc);
        function AlreadyOpenAnswerFunc(status) {
            if (oa.val().OpenAnswer == 0) {
                document.getElementById("vcnvimages").style.display = "block";
                document.getElementById("vcnvrow").style.display = "block";
                // document.getElementById("timer").style.display = "block";
                document.getElementsByClassName("questions")[0].style.display = "table";
                document.getElementById("vcnvans").style.display = "block";
                document.getElementById("chuong").style.display = "block";
                document.getElementById("dapan").style.display = "block";
                // document.getElementById("dapanthisinh").style.display = "none";
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
                // resetPlayerAnswer();
                document.getElementById("chuongts-list").style.position = null;
                document.getElementById("chuongts-list").style.left = null;
                document.getElementById("chuongts-list").style.bottom = null;
                document.getElementById("chuongts-list").style.marginBottom = null;
                document.getElementById("chuong2").style.display = "none";
                if (localStorage.getItem("isProjector") == 'true') {
                    document.getElementById("chuong2").style.display = "none";
                    if (localStorage.getItem("isGreenBackground") === 'true') {
                        normalBackgroundProcess('open');
                    }
                } else {
                }
            }
            if (oa.val().OpenAnswer == 1) {
                document.getElementById("vcnvimages").style.display = "none";
                document.getElementById("vcnvrow").style.display = "none";
                document.getElementsByClassName("questions")[0].style.display = "none";
                document.getElementById("vcnvans").style.display = "none";
                document.getElementById("chuong").style.display = "none";
                document.getElementById("dapan").style.display = "none";
                if (status.val().status == true && oa.val().OpenAnswer == 1) {
                    var showdapan = document.getElementById("showdapan1");
                    var dapan1 = document.getElementById("odapan1");
                    var dapan2 = document.getElementById("odapan2");
                    var dapan3 = document.getElementById("odapan3");
                    var dapan4 = document.getElementById("odapan4");
                    showdapan.style.display = 'block';
                    dapan1.style.display = 'block';
                    dapan2.style.display = 'block';
                    dapan3.style.display = 'block';
                    dapan4.style.display = 'block';

                    dapan1.classList.add('notransition');
                    dapan2.classList.add('notransition');
                    dapan3.classList.add('notransition');
                    dapan4.classList.add('notransition');

                } else if (status.val().status == false && oa.val().OpenAnswer == 1) {
                    var showdapan = document.getElementById("showdapan1");
                    var dapan1 = document.getElementById("odapan1");
                    var dapan2 = document.getElementById("odapan2");
                    var dapan3 = document.getElementById("odapan3");
                    var dapan4 = document.getElementById("odapan4");
                    dapan1.classList.remove('notransition');
                    dapan2.classList.remove('notransition');
                    dapan3.classList.remove('notransition');
                    dapan4.classList.remove('notransition');
                    answerappear.play();
                    setTimeout(function () {
                        var showdapan = document.getElementById("showdapan1");
                        var dapan1 = document.getElementById("odapan1");
                        var dapan2 = document.getElementById("odapan2");
                        var dapan3 = document.getElementById("odapan3");
                        var dapan4 = document.getElementById("odapan4");
                        showdapan.style.display = 'block';
                        dapan1.style.display = 'block';
                        dapan2.style.display = 'block';
                        dapan3.style.display = 'block';
                        dapan4.style.display = 'block';
                    }, 500)
                }
                document.getElementById("chuongts-list").style.position = "absolute";
                document.getElementById("chuongts-list").style.left = "10px";
                document.getElementById("chuongts-list").style.bottom = "0";
                document.getElementById("chuongts-list").style.marginBottom = "24px";
                if (localStorage.getItem("isProjector") == 'true') {
                    document.getElementById("chuong2").style.display = "none";
                    if (localStorage.getItem("isGreenBackground") === 'true') {
                        normalBackgroundProcess('hide');
                    }
                } else {
                    document.getElementById("chuong2").style.display = "block";
                }
            }
        }
    }
}, 11000);


var VCNVCountDown = firebase.database().ref(matchid + '/VCNV15sCountdown');
VCNVCountDown.on('value', countdown);
function countdown(cd) {
    if (cd.val().countdown == 1) {
        rowthinking.play();
        Time();
    }
}




firebase.storage().ref('users/' + localStorage.getItem("ts1uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
    ts1vcnv.src = imgUrl;
}).catch((error) => {
    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts1vcnv.src = imgUrl;
    })
});
firebase.storage().ref('users/' + localStorage.getItem("ts2uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
    ts2vcnv.src = imgUrl;
}).catch((error) => {
    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts2vcnv.src = imgUrl;
    })
});
firebase.storage().ref('users/' + localStorage.getItem("ts3uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
    ts3vcnv.src = imgUrl;
}).catch((error) => {
    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts3vcnv.src = imgUrl;
    })
});
firebase.storage().ref('users/' + localStorage.getItem("ts4uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
    ts4vcnv.src = imgUrl;
}).catch((error) => {
    firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
        ts4vcnv.src = imgUrl;
    })
});


firebase.storage().ref(matchid + '/audio/cnv/hn.mp3').getDownloadURL().then(imgUrl => {
    HNAudio.src = imgUrl;
});


var CNVKT = firebase.database().ref(matchid + '/VCNVQuestion/CNVKeyType/');
CNVKT.on('value', cnvktype);
function cnvktype(ktype) {
    if (ktype.val().type == 1) {
        document.getElementById("ktype").innerHTML = "ký tự";
    }
    if (ktype.val().type == 2) {
        document.getElementById("ktype").innerHTML = "chữ cái";
    }
    if (ktype.val().type == 3) {
        document.getElementById("ktype").innerHTML = "chữ số";
    }
}

var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
CNVCHUONGTS1.on("value", chuong1);
function chuong1(c1) {
    if (c1.val().chuong == 0) {
        document.getElementById('ts1-chuong').remove();
    }
    if (c1.val().chuong == 1) {
        vcnvanswerrow.play();
        if (localStorage.getItem("isProjector") === 'true') {
            if (localStorage.getItem("isDisplayAvatar") === 'false') {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts1-chuong">
        <span class="tsanchuongname" id="ts1chuong-name" style="padding-left:18px; font-size: 18px;"></span>
    </div>` 
            } else {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts1-chuong">
                <img id="ts1chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
                <span class="tsanchuongname" id="ts1chuong-name"></span>
            </div>`
            }
        } else {
            document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts1-chuong">
            <img id="ts1chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
            <span class="tsanchuongname" id="ts1chuong-name"></span>
        </div>`
        }
        firebase.storage().ref('users/' + localStorage.getItem("ts1uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts1chuong.src = imgUrl;
        }).catch((error) => {
            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                ts1chuong.src = imgUrl;
            })
        });

        var ts1ref = firebase.database().ref(matchid + "/games/player1");
        ts1ref.on('value', ts1);
        function ts1(tsinfo) {
            var displayName = tsinfo.val().displayName;
            var lastTwoWords = displayName.split(" ").slice(-2).join(" ");
            document.getElementById("ts1chuong-name").innerHTML = lastTwoWords;
        }
        changeObjectColor();
    }

}
var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
CNVCHUONGTS2.on("value", chuong2);

function chuong2(c2) {

    if (c2.val().chuong == 0) {
        document.getElementById('ts2-chuong').remove();
    }
    if (c2.val().chuong == 1) {
        vcnvanswerrow.play();

        if (localStorage.getItem("isProjector") === 'true') {
            if (localStorage.getItem("isDisplayAvatar") === 'false') {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts2-chuong">
        <span class="tsanchuongname" id="ts2chuong-name" style="padding-left:18px; font-size: 18px;"></span>
    </div>`
            } else {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts2-chuong">
                <img id="ts2chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
                <span class="tsanchuongname" id="ts2chuong-name"></span>
            </div>`
            }
        } else {
            document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts2-chuong">
            <img id="ts2chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
            <span class="tsanchuongname" id="ts2chuong-name"></span>
        </div>`
        }

        firebase.storage().ref('users/' + localStorage.getItem("ts2uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts2chuong.src = imgUrl;
        }).catch((error) => {
            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                ts2chuong.src = imgUrl;
            })
        });
        var ts2ref = firebase.database().ref(matchid + "/games/player2");
        ts2ref.on('value', ts2);
        function ts2(tsinfo) {
            var displayName = tsinfo.val().displayName;
            var lastTwoWords = displayName.split(" ").slice(-2).join(" ");
            document.getElementById("ts2chuong-name").innerHTML = lastTwoWords;
        }
        changeObjectColor();

    }
}
var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
CNVCHUONGTS3.on("value", chuong3);

function chuong3(c3) {

    if (c3.val().chuong == 0) {
        document.getElementById('ts3-chuong').remove();
    }
    if (c3.val().chuong == 1) {
        vcnvanswerrow.play();

        if (localStorage.getItem("isProjector") === 'true') {
            if (localStorage.getItem("isDisplayAvatar") === 'false') {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts3-chuong">
                <span class="tsanchuongname" id="ts3chuong-name" style="padding-left:18px; font-size: 18px;"></span>
            </div>`
            } else {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts3-chuong">
                <img id="ts3chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
                <span class="tsanchuongname" id="ts3chuong-name"></span>
            </div>`
            }
        } else {
            document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts3-chuong">
            <img id="ts3chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
            <span class="tsanchuongname" id="ts3chuong-name"></span>
        </div>`
        }



        firebase.storage().ref('users/' + localStorage.getItem("ts3uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts3chuong.src = imgUrl;
        }).catch((error) => {
            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                ts3chuong.src = imgUrl;
            })
        });

        var ts3ref = firebase.database().ref(matchid + "/games/player3");
        ts3ref.on('value', ts3);
        function ts3(tsinfo) {
            var displayName = tsinfo.val().displayName;
            var lastTwoWords = displayName.split(" ").slice(-2).join(" ");
            document.getElementById("ts3chuong-name").innerHTML = lastTwoWords;
        }
        changeObjectColor();
    }
}

var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');
CNVCHUONGTS4.on("value", chuong4);

function chuong4(c4) {
    if (c4.val().chuong == 0) {
        document.getElementById('ts4-chuong').remove();
    }
    if (c4.val().chuong == 1) {
        vcnvanswerrow.play();

        if (localStorage.getItem("isProjector") === 'true') {
            if (localStorage.getItem("isDisplayAvatar") === 'false') {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts4-chuong">
                <span class="tsanchuongname" id="ts4chuong-name" style="padding-left:18px; font-size: 18px;"></span>
            </div>`
            } else {
                document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts4-chuong">
                <img id="ts4chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
                <span class="tsanchuongname" id="ts4chuong-name"></span>
            </div>`
            }
        } else {
            document.getElementById('chuongts-list').innerHTML += `                <div class="chuongts" id="ts4-chuong">
            <img id="ts4chuong" class="chuongtsimg" src="/img/none.jpg" draggable="false">
            <span class="tsanchuongname" id="ts4chuong-name"></span>
        </div>`
        }


        firebase.storage().ref('users/' + localStorage.getItem("ts4uid") + '/profile.jpg').getDownloadURL().then(imgUrl => {
            ts4chuong.src = imgUrl;
        }).catch((error) => {
            firebase.storage().ref('users' + '/profile.jpg').getDownloadURL().then(imgUrl => {
                ts4chuong.src = imgUrl;
            })
        });

        var ts4ref = firebase.database().ref(matchid + "/games/player4");
        ts4ref.on('value', ts4);
        function ts4(tsinfo) {
            var displayName = tsinfo.val().displayName;
            var lastTwoWords = displayName.split(" ").slice(-2).join(" ");
            document.getElementById("ts4chuong-name").innerHTML = lastTwoWords;
        }
        changeObjectColor();
    }
}


function changeObjectColor() {
    const data = JSON.parse(localStorage.getItem("themeData"));
    var objects = document.getElementsByClassName("chuongts");
    for (let i = 0; i < objects.length; i++) {
        objects[i].style.background = CheckBackgroundValue(data.ObstacleAnswerRights);
        objects[i].style.backgroundSize = "cover";
        objects[i].style.border = data.ObstacleObjectBorder;
        objects[i].style.color = data.ObstacleTextColor;
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
                        var gha1overlay = document.getElementById("vcnvoverlay1");
                        gha1overlay.style.display = "none";
                        document.getElementById("audio_extra_1").play();
                    }
                    if (hn2.val().status == 1) {
                        var gha2overlay = document.getElementById("vcnvoverlay2");
                        gha2overlay.style.display = "none";
                        document.getElementById("audio_extra_1").play();
                    }
                    if (hn3.val().status == 1) {
                        var gha4overlay = document.getElementById("vcnvoverlay4");
                        gha4overlay.style.display = "none";
                        document.getElementById("audio_extra_1").play();
                    }
                    if (hn4.val().status == 1) {
                        var gha3overlay = document.getElementById("vcnvoverlay3");
                        gha3overlay.style.display = "none";
                        document.getElementById("audio_extra_1").play();
                    }
                    if (hntt.val().status == 1) {
                        var ghacenteroverlay = document.getElementById("vcnvoverlaycenter");
                        ghacenteroverlay.style.display = "none";
                        document.getElementById("audio_extra_1").play();
                    }
                }
            }
        }
    }
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


function greenScreenProcess() {
    if (localStorage.getItem("isProjector") === 'true') {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            document.getElementById("vcnvimages").style.display = "none";
            document.getElementById("vcnvrow").style.display = "none";
            document.getElementById("chuongts-list").style.marginTop = "25vh";
            document.getElementsByClassName("questions")[0].style.justifyContent = "space-between";
            document.getElementsByClassName("questions")[0].style.position = "fixed";
            document.getElementsByClassName("questions")[0].style.bottom = "48px";
            document.getElementsByClassName("questions")[0].style.bottom = "48px";
            greenScreenBackground();
        }
    }
}

function normalBackgroundProcess(status) {
    if (localStorage.getItem("isProjector") === 'true') {
        if (localStorage.getItem("isGreenBackground") === 'true') {
            document.getElementsByClassName("questions")[0].style.justifyContent = "none";
            document.getElementsByClassName("questions")[0].style.position = "relative";
            document.getElementsByClassName("questions")[0].style.bottom = "0px";
            document.getElementById("chuongts-list").style.marginTop = "5px";
            if (status == 'hide') {
                document.getElementsByClassName("questions")[0].style.display = "none";
            } else {
                document.getElementsByClassName("questions")[0].style.display = "table";
            }
            normalBackground();
        }
    }
}

function normalBackground() {
    var body = document.getElementsByTagName('body')[0];
    const data = JSON.parse(localStorage.getItem("themeData"));
    if (data.Background.startsWith("url")) {
        document.body.style.backgroundImage = data.Background;
    } else if (data.Background !== "") {
        document.body.style.background = data.Background;
    } else {
        document.body.style.backgroundImage = 'url("/img/NewBackground.png")';
    }
    body.style.backgroundColor = '';
}

function greenScreenBackground() {
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'none';
    body.style.backgroundColor = '#00b140';
}


const data = JSON.parse(localStorage.getItem("themeData"));

if (data.Background.startsWith("url")) {
    document.body.style.backgroundImage = data.Background;
} else if (data.Background !== "") {
    document.body.style.background = data.Background;
} else {
    document.body.style.backgroundImage = 'url("/img/NewBackground.png")';
}

var OOPele = document.getElementsByClassName('overlay');
for (var i = 0; i < OOPele.length; i++) {
    OOPele[i].style.background = CheckBackgroundValue(data.ObstacleOverlay);
    OOPele[i].style.backgroundSize = "cover";
    OOPele[i].style.border = data.ObstacleObjectBorder;
    OOPele[i].style.color = data.ObstacleTextColor;
}

document.getElementsByClassName("vcnv-row")[0].style.background = CheckBackgroundValue(data.ObstacleRow);
document.getElementsByClassName("vcnv-row")[0].style.backgroundSize = "cover";
document.getElementsByClassName("vcnv-row")[0].style.color = data.ObstacleTextColor;


setTimeout(function () {
    var AnsBubbleele1 = document.getElementsByClassName('ansbubble1');
    for (var i = 0; i < AnsBubbleele1.length; i++) {
        AnsBubbleele1[i].style.background = CheckBackgroundValue(data.ObstacleBubbleColor);
        AnsBubbleele1[i].style.backgroundSize = "cover";
        AnsBubbleele1[i].style.color = data.ObstacleBubbleTextColor;
        AnsBubbleele1[i].style.border = data.ObstacleBubbleBorder;
    }

    var AnsBubbleele2 = document.getElementsByClassName('ansbubble2');
    for (var i = 0; i < AnsBubbleele2.length; i++) {
        AnsBubbleele2[i].style.background = CheckBackgroundValue(data.ObstacleBubbleColor);
        AnsBubbleele2[i].style.backgroundSize = "cover";
        AnsBubbleele2[i].style.color = data.ObstacleBubbleTextColor;
        AnsBubbleele2[i].style.border = data.ObstacleBubbleBorder;
    }

    var AnsBubbleele3 = document.getElementsByClassName('ansbubble3');
    for (var i = 0; i < AnsBubbleele3.length; i++) {
        AnsBubbleele3[i].style.background = CheckBackgroundValue(data.ObstacleBubbleColor);
        AnsBubbleele3[i].style.backgroundSize = "cover";
        AnsBubbleele3[i].style.color = data.ObstacleBubbleTextColor;
        AnsBubbleele3[i].style.border = data.ObstacleBubbleBorder;
    }

    var AnsBubbleele4 = document.getElementsByClassName('ansbubble4');
    for (var i = 0; i < AnsBubbleele4.length; i++) {
        AnsBubbleele4[i].style.background = CheckBackgroundValue(data.ObstacleBubbleColor);
        AnsBubbleele4[i].style.backgroundSize = "cover";
        AnsBubbleele4[i].style.color = data.ObstacleBubbleTextColor;
        AnsBubbleele4[i].style.border = data.ObstacleBubbleBorder;
    }
}, 7000);

document.getElementsByClassName("questions")[0].style.background = CheckBackgroundValue(data.ObstacleQuestion);
document.getElementsByClassName("questions")[0].style.backgroundSize = "cover";
document.getElementsByClassName("questions")[0].style.color = data.ObstacleTextColor;
document.getElementsByClassName("questions")[0].style.border = data.ObstacleObjectBorder;


const element = document.querySelector('.questions');
if (element) {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        .questions::after {
            background: ${data.ObstacleSlide};
        }
    `, styleSheet.cssRules.length);
}

document.getElementsByClassName("vcnv-row")[0].style.border = data.ObstacleObjectBorder;

var RowNumberObject = document.getElementsByClassName('obstacle-row-number-object');
var RowNumber = document.getElementsByClassName('obstacle-row-number');
for (var i = 0; i < RowNumberObject.length; i++) {
    RowNumberObject[i].style.border = data.ObstacleBubbleBorder;
    RowNumber[i].style.color = data.ObstacleBubbleTextColor;
}



var PlayerAnswerElements = document.getElementsByClassName("PlayerAnswer");
for (let i = 0; i < PlayerAnswerElements.length; i++) {
    PlayerAnswerElements[i].style.border = data.ObstacleObjectBorder;
    PlayerAnswerElements[i].style.color = data.ObstacleTextColor;
}

document.getElementById("vcnvimage").style.border = data.ObstacleObjectBorder;



document.getElementById("chuong").style.background = CheckBackgroundValue(data.AnswerButton);
document.getElementById("chuong").style.backgroundSize = "cover";
document.getElementById("chuong").style.border = data.ObstacleObjectBorder;
document.getElementById("chuong").style.color = data.ObstacleTextColor;



document.getElementById("chuong2").style.background = CheckBackgroundValue(data.AnswerButton);
document.getElementById("chuong2").style.backgroundSize = "cover";
document.getElementById("chuong2").style.border = data.ObstacleObjectBorder;
document.getElementById("chuong2").style.color = data.ObstacleTextColor;

function CheckBackgroundValue(BackgroundVal) {
    if (BackgroundVal.startsWith("url")) {
        return BackgroundVal + "no-repeat";
    } else {
        return BackgroundVal;
    }
}