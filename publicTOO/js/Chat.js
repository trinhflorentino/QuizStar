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

setTimeout(function () {
    document.getElementById('msg').addEventListener('keypress', function (e) {
        var msg = document.getElementById('msg');
        if (e.key === 'Enter' && msg.value != "") {

            auth.onAuthStateChanged(function (user) {
                user.getIdTokenResult().then(idTokenResult => {
                    user.admin = idTokenResult.claims.admin;
                    rl = "player";
                    if (user.admin == true) {
                        rl = "host";
                    }
                    var msg = document.getElementById('msg');
                    var audioel = msg.value.replaceAll('<audio>', '');
                    var alertel = audioel.replaceAll('<alert>', '');
                    var imgel = alertel.replaceAll('<img>', '');
                    if (imgel == "") { } else {
                        var u = localStorage.getItem("name");
                        firebase.database().ref(matchid + '/chat').push({
                            user: u,
                            txt: imgel,
                            role: rl,
                            uid: user.uid,
                        });
                        var msg = document.getElementById('msg');
                        msg.value = '';
                        var scroll = document.getElementById("msgs");
                        scroll.scrollTop = scroll.scrollHeight;


                    }
                }
                )
            })
        }
    });
}, 2000)


firebase.database().ref(matchid + '/chat').on('value', function (snapshot) {
    msgs.innerHTML = '';
    msgs.innerHTML += '<div class="chat-msg-admin"><p>HỆ THỐNG: Theo dõi <a style="color:white">The Olympus Online</a> tại: <a style="cursor:pointer;color: inherit;" href="https://www.facebook.com/theolympusonline" target="_blank">https://www.facebook.com/theolympusonline</a></p></div>';
    snapshot.forEach(function (e) {
        var elem = document.getElementById('msgs');
        elem.scrollTop = elem.scrollHeight;
        var x = e.val();
        if (x.role == "host" & x.uid != "FjDLtAkzXTeJ3KnVfTSAKbddk7n1") {
            msgs.innerHTML += `
        <div class="chat-msg-host"> 
        <p> ${x.user}: ${x.txt} </p>
        </div>
        `
        }
        if (x.role == "player") {
            msgs.innerHTML += `
            <div class="chat-msg-player"> 
        <p>  ${x.user}: ${x.txt} </p>
        </div>
        `
        }
        if (x.uid == "FjDLtAkzXTeJ3KnVfTSAKbddk7n1") {
            msgs.innerHTML += `
            <div class="chat-msg-admin"> 
        <p> ${x.user}: ${x.txt} </p>
        </div>
        `
        }
    });
});

var getmatchid = firebase.database().ref(matchid + "/Match/Name");
var gethostname = firebase.database().ref(matchid + "/Match/Host");
getmatchid.on("value", getmn);

refvedichphu = firebase.database().ref(matchid + "/gamestatus/vedichphu");

function getmn(match) {
    gethostname.on("value", gethname);

    function gethname(host) {
        if (match.val().match == "") {

        }
        if (match.val().match) {
            document.title = match.val().match;
            document.getElementById("matchname").innerHTML = match.val().match;
        }
    }
}


setTimeout(function () {
    var scroll = document.getElementById("msgs");
    scroll.scrollTop = scroll.scrollHeight;
}, 2000);
