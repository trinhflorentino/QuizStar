var id = 0;

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


var refthisinhvedich = firebase.database().ref(matchid + "/playerstatus/vedich");
refthisinhvedich.on("value", tsvd);

function tsvd(vd) {
    var refname = firebase.database().ref(matchid + "/games/player" + vd.val().player);
    refname.on('value', nm);

    function nm(name) {

        document.getElementById("tsvdname1").innerHTML = "Thí sinh về đích: " + name.val().displayName;
    }


}

var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');
CNVCHUONGTS1.on("value", chuong1);
var starttimer = new Date();
function chuong1(c1) {
    if (c1.val().chuong == 0) {
        var tents1 = document.getElementById("ts1vcnv");
        tents1.style.backgroundColor = "#171E28";
        var tstamp1 = document.getElementById("tstamp1");
        tstamp1.innerHTML = "";
    }
    if (c1.val().chuong == 1) {
        var timechuongts1 = new Date();
        var tstamp1 = document.getElementById("tstamp1");
        var gettimestamp = {
            timestamp: timechuongts1.getTime() - starttimer.getTime()
        }
        var VCNVChuongTimeStamp = firebase.database().ref(matchid + "/VCNVChuongTimeStamp/TS1/");
        VCNVChuongTimeStamp.set(gettimestamp);
        tstamp1.innerHTML = timechuongts1.getTime() - starttimer.getTime();
        var tents1 = document.getElementById("ts1vcnv");
        tents1.style.backgroundColor = "lightblue";
        vcnvanswerrow.play();
    }
}
CNVCHUONGTS2.on("value", chuong2);

function chuong2(c2) {
    if (c2.val().chuong == 0) {
        var tents2 = document.getElementById("ts2vcnv");
        tents2.style.backgroundColor = "#171E28";
        var tstamp2 = document.getElementById("tstamp2");
        tstamp2.innerHTML = "";
    }
    if (c2.val().chuong == 1) {
        var timechuongts2 = new Date();
        var tstamp2 = document.getElementById("tstamp2");
        tstamp2.innerHTML = timechuongts2.getTime() - starttimer.getTime();
        var gettimestamp = {
            timestamp: timechuongts2.getTime() - starttimer.getTime()
        }
        var VCNVChuongTimeStamp = firebase.database().ref(matchid + "/VCNVChuongTimeStamp/TS2");
        VCNVChuongTimeStamp.set(gettimestamp);
        var tents2 = document.getElementById("ts2vcnv");
        tents2.style.backgroundColor = "lightblue";
        vcnvanswerrow.play();
    }
}

CNVCHUONGTS3.on("value", chuong3);

function chuong3(c3) {
    if (c3.val().chuong == 0) {
        var tents3 = document.getElementById("ts3vcnv");
        tents3.style.backgroundColor = "#171E28";
        var tstamp3 = document.getElementById("tstamp3");
        tstamp3.innerHTML = "";
    }
    if (c3.val().chuong == 1) {
        var timechuongts3 = new Date();
        var tstamp3 = document.getElementById("tstamp3");
        tstamp3.innerHTML = timechuongts3.getTime() - starttimer.getTime();
        var gettimestamp = {
            timestamp: timechuongts3.getTime() - starttimer.getTime()
        }
        var VCNVChuongTimeStamp = firebase.database().ref(matchid + "/VCNVChuongTimeStamp/TS3");
        VCNVChuongTimeStamp.set(gettimestamp);
        var tents3 = document.getElementById("ts3vcnv");
        tents3.style.backgroundColor = "lightblue";
        vcnvanswerrow.play();
    }
}
CNVCHUONGTS4.on("value", chuong4);

function chuong4(c4) {
    if (c4.val().chuong == 0) {
        var tents4 = document.getElementById("ts4vcnv");
        tents4.style.backgroundColor = "#171E28";
        var tstamp4 = document.getElementById("tstamp4");
        tstamp4.innerHTML = "";
    }

    if (c4.val().chuong == 1) {
        var timechuongts4 = new Date();
        var tstamp4 = document.getElementById("tstamp4");
        tstamp4.innerHTML = timechuongts4.getTime() - starttimer.getTime();
        var gettimestamp = {
            timestamp: timechuongts4.getTime() - starttimer.getTime()
        }
        var VCNVChuongTimeStamp = firebase.database().ref(matchid + "/VCNVChuongTimeStamp/TS4");
        VCNVChuongTimeStamp.set(gettimestamp);
        var tents4 = document.getElementById("ts4vcnv");
        tents4.style.backgroundColor = "lightblue";
        vcnvanswerrow.play();
    }
}

// var CNVCHUONGTS1 = firebase.database().ref(matchid + '/VCNVChuong/TS1');
// var CNVCHUONGTS2 = firebase.database().ref(matchid + '/VCNVChuong/TS2');
// var CNVCHUONGTS3 = firebase.database().ref(matchid + '/VCNVChuong/TS3');
// var CNVCHUONGTS4 = firebase.database().ref(matchid + '/VCNVChuong/TS4');
// CNVCHUONGTS1.on("value", chuong1);

// function chuong1(c1) {
//     CNVCHUONGTS2.on("value", chuong2);

//     function chuong2(c2) {
//         CNVCHUONGTS3.on("value", chuong3);

//         function chuong3(c3) {
//             CNVCHUONGTS4.on("value", chuong4);

//             function chuong4(c4) {
//                 if (c1.val().chuong == 0) {
//                     var tents1 = document.getElementById("ts1vcnv");
//                     tents1.style.backgroundColor = "white";
//                 }
//                 if (c2.val().chuong == 0) {
//                     var tents2 = document.getElementById("ts2vcnv");
//                     tents2.style.backgroundColor = "white";
//                 }
//                 if (c3.val().chuong == 0) {
//                     var tents3 = document.getElementById("ts3vcnv");
//                     tents3.style.backgroundColor = "white";
//                 }
//                 if (c4.val().chuong == 0) {
//                     var tents4 = document.getElementById("ts4vcnv");
//                     tents4.style.backgroundColor = "white";
//                 }
//                 if (c1.val().chuong == 1) {
//                     var tents1 = document.getElementById("ts1vcnv");
//                     tents1.style.backgroundColor = "lightblue";
//                     vcnvanswerrow.play();
//                 }
//                 if (c2.val().chuong == 1) {
//                     var tents2 = document.getElementById("ts2vcnv");
//                     tents2.style.backgroundColor = "lightblue";
//                     vcnvanswerrow.play();
//                 }
//                 if (c3.val().chuong == 1) {
//                     var tents3 = document.getElementById("ts3vcnv");
//                     tents3.style.backgroundColor = "lightblue";
//                     vcnvanswerrow.play();
//                 }
//                 if (c4.val().chuong == 1) {
//                     var tents4 = document.getElementById("ts4vcnv");
//                     tents4.style.backgroundColor = "lightblue";
//                     vcnvanswerrow.play();
//                 }
//             }
//         }
//     }
// };



// var TS1ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS1');
// var TS2ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS2');
// var TS3ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS3');
// var TS4ChuongTstamp = firebase.database().ref(matchid + '/VCNVChuongTimeStamp/TS4');
// TS1ChuongTstamp.on("value", ftstamp1);

// function ftstamp1(ts1) {
//     TS2ChuongTstamp.on("value", ftstamp2);

//     function ftstamp2(ts2) {
//         TS3ChuongTstamp.on("value", ftstamp3);

//         function ftstamp3(ts3) {
//             TS4ChuongTstamp.on("value", ftstamp4);

//             function ftstamp4(ts4) {
//                 tstampts1 = ts1.val().timestamp;
//                 tstampts2 = ts2.val().timestamp;
//                 tstampts3 = ts3.val().timestamp;
//                 tstampts4 = ts4.val().timestamp;

//                 var tstamp1 = document.getElementById("tstamp1");
//                 var tstamp2 = document.getElementById("tstamp2");
//                 var tstamp3 = document.getElementById("tstamp3");
//                 var tstamp4 = document.getElementById("tstamp4");

//                 tstamp1.innerHTML = tstampts1;
//                 tstamp2.innerHTML = tstampts2;
//                 tstamp3.innerHTML = tstampts3;
//                 tstamp4.innerHTML = tstampts4;
//             }
//         }
//     }
// }



function quit() {

    var exit = {
        uid: "",
        displayName: "N/A",
        id: 0,
    };
    firebase.database().ref(matchid + "/games/mc").set(exit);
    setTimeout(function () { location.replace("Main.html") }, 1000)
}

if (localStorage.getItem("id") == 1) {
    alert("Bạn hiện đang là người chơi, trang MC sẽ bị cấm.");
    location.replace("/Main.html");
} else if (localStorage.getItem("id") == 2) {
    alert("Bạn hiện đang là người chơi, trang MC sẽ bị cấm.");
    location.replace("/Main.html");
} else if (localStorage.getItem("id") == 3) {
    alert("Bạn hiện đang là người chơi, trang MC sẽ bị cấm.");
    location.replace("/Main.html");
} else if (localStorage.getItem("id") == 4) {
    alert("Bạn hiện đang là người chơi, trang MC sẽ bị cấm.");
    location.replace("/Main.html");
}

var mc = firebase.database().ref(matchid + "/games/mc");
var mc2 = firebase.database().ref(matchid + "/games/mc2");

mc.on("value", pkick);

function pkick(mcuid) {
    mc2.on("value", pkick2);
    function pkick2(mcuid2) {
        if (mcuid.val().uid != localStorage.getItem("iduser") && mcuid2.val().uid != localStorage.getItem("iduser") && localStorage.getItem("id") != 5 && window.location.pathname != "/Main.html" && window.location.pathname != "/Information.html") {
            alert("Bạn đã bị Host kick khỏi vị trí MC/rời vị trí");
            location.replace("/Main.html");
        }
    }
}


// Reference to the Participant node
var participantRef = firebase.database().ref(matchid + "/Participant/");

// Check if uid exists and get requestStatus
participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).on("value", function (snapshot) {
    if (snapshot.exists()) {
        var childData = snapshot.val();
        var requestStatus = Object.values(childData)[0].requestStatus;

        if (requestStatus === 2) {
            alert("Bạn đã bị từ chối");
            location.replace('Main.html');  // Replace with the appropriate URL
        } else if (requestStatus === 3) {
            alert("Bạn đã bị chặn bởi chủ phòng");
            location.replace('Main.html');  // Replace with the appropriate URL
        }
    }
});



// var mc = firebase.database().ref(matchid + "/games/mc");

// mc.once("value", mcuid);

// function mcuid(uid5) {
//     if (uid5.val().uid != "" && uid5.val().uid != localStorage.getItem("iduser") && localStorage.getItem("iduser") != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1") {
//         alert("Máy MC đã có người vào. Vui lòng liên hệ với Host để vào vị trí!");
//         location.replace("/Main.html");
//     }
// }

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;

firebase.firestore().collection(matchid).doc(localStorage.getItem("iduser")).set({
    time: dateTime,
    uid: localStorage.getItem("iduser"),
    name: localStorage.getItem("name"),
    matchid: matchid,
}).then(() => {
    {

    }
});
