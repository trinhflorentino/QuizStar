shortcut.add("F12", function () {
    Notification("Không được bật F12 trong phần thi này");
});
shortcut.add("Ctrl+Shift+I", function () {
    Notification("Không được bật kiểm tra phần tử trong phần thi này");
});
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

var matchid = getCookie("matchid");

var MC = document.getElementById("audio_extra_2");
var ContesttantIntroduction = document.getElementById("audio_extra_3");
var Advisor1 = document.getElementById("audio_extra_4");
var Advisor2 = document.getElementById("audio_extra_5");
var Advisor3 = document.getElementById("audio_extra_6");
var Advisor4 = document.getElementById("audio_extra_7");
var Advisor5 = document.getElementById("audio_extra_8");
var GivingPrize = document.getElementById("audio_extra_9");
var End = document.getElementById("audio_extra_10");

var refMusicStatusBanner = firebase.database().ref(matchid + "/Banner/Music");

refMusicStatusBanner.on('value', MusicStatusData);

function MusicStatusData(status) {
    if (status.val().MC == true) {
        MC.play();
    } else {
        MC.currentTime = 0;
        MC.pause();
    }

    if (status.val().ContesttantIntroduction == true) {
        ContesttantIntroduction.play();
    } else {
        ContesttantIntroduction.currentTime = 0;
        ContesttantIntroduction.pause();
    }

    if (status.val().Advisor1 == true) {
        Advisor1.play();
    } else {
        Advisor1.currentTime = 0;
        Advisor1.pause();
    }

    if (status.val().Advisor2 == true) {
        Advisor2.play();
    } else {
        Advisor2.currentTime = 0;
        Advisor2.pause();
    }

    if (status.val().Advisor3 == true) {
        Advisor3.play();
    } else {
        Advisor3.currentTime = 0;
        Advisor3.pause();
    }

    if (status.val().Advisor4 == true) {
        Advisor4.play();
    } else {
        Advisor4.currentTime = 0;
        Advisor4.pause();
    }

    if (status.val().Advisor5 == true) {
        Advisor5.play();
    } else {
        Advisor5.currentTime = 0;
        Advisor5.pause();
    }

    if (status.val().GivingPrize == true) {
        GivingPrize.play();
    } else {
        GivingPrize.currentTime = 0;
        GivingPrize.pause();
    }

    if (status.val().End == true) {
        End.play();
    } else {
        End.currentTime = 0;
        End.pause();
    }
}


var refElementStatusBanner = firebase.database().ref(matchid + "/Banner/Elements");
var TextContent = document.getElementById("large-text-content");
var ContesttantList = document.getElementById("contestant-list");
var MatchName = document.getElementById("match-name");

refElementStatusBanner.on('value', ElementStatusData);

function ElementStatusData(status) {
    if (status.val().MatchName == true) {
        refMatchName = firebase.database().ref(matchid + "/match");
        refMatchName.on('value', MatchNameData);
        function MatchNameData(data) {
            TextContent.innerHTML = data.val();
            TextContent.style.display = "block";
        }
    } else {
        TextContent.innerHTML = "";
        TextContent.style.display = "none";
    }

    if (status.val().ContesttantList == true) {
        ContesttantList.style.display = 'flex';
        MatchName.style.display = 'block';
    } else {
        ContesttantList.style.display = 'none';
        MatchName.style.display = 'none';
    }

    if (status.val().CustomText == true) {
        refCustomText = firebase.database().ref(matchid + "/Banner/Elements/CustomTextContent");
        refCustomText.on('value', CustomTextData);
        function CustomTextData(data) {
            TextContent.innerHTML = data.val();
            TextContent.style.display = "block";
        }
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
