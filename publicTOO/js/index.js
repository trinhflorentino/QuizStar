document.addEventListener('contextmenu', event => event.preventDefault());

shortcut.add("F12", function () {
    alert("!!!!!");
});
shortcut.add("Ctrl+Shift+I", function () {
    alert("!!!");
});




var matchname = document.getElementById("matchname");
var hostname = document.getElementById("hostname");
var currmatch = document.getElementsByClassName(".match-css");
var notify = document.getElementById("match-notify");
var db = firebase.firestore();
auth.onAuthStateChanged(function (user) {
    if (user) {
        localStorage.setItem("iduser", auth.currentUser.uid);
        localStorage.setItem("name", auth.currentUser.displayName);
        if (window.location.pathname == "/Main.html") {
            document.getElementById("username-info").innerHTML = user.displayName;
        }
    }
});


function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}

if (window.location.pathname == "/Main.html") {


    var modal = document.getElementById("myModal");


    var btn = document.getElementById("myBtn");


    var span = document.getElementsByClassName("close")[0];


    btn.onclick = function () {
        modal.style.display = "block";
    }


    span.onclick = function () {
        modal.style.display = "none";
    }


    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }





    var modal1 = document.getElementById("myModal2");


    var btn1 = document.getElementById("myBtn2");

    // var span1 = document.getElementById("close1");

    btn1.onclick = function () {
        modal1.style.display = "block";
    }

    // span1.onclick = function () {
    //     modal1.style.display = "none";
    // }

    function HideModal() {
        modal1.style.display = "none";
    }


    window.onclick = function (event) {
        if (event.target == modal1) {
            modal1.style.display = "none";
        }
    }



    $(document).ready(function () {
        $('.modal').modal();
    });


    var matchs = document.getElementById("match-list");



    var input = document.getElementById("usermatchpassword");

    document.getElementById("usermatchpassword").onclick = function () {

    }
}

function joinmatch() {
    var userpassword = document.getElementById("usermatchpassword").value;
    var getpass = firebase.database().ref("/" + document.getElementById("usermatchid").value.toUpperCase() + "/password");
    getpass.on("value", pass1);

    function pass1(p1) {
        password = p1.val();
        if (userpassword == password) {
            localStorage.setItem("match", document.getElementById("usermatchid").value.toUpperCase());
            Notification("Chọn trận đấu thành công. Trang đang được tải lại");
            setTimeout(function () { location.reload(); }, 3000);
            firebase.firestore().collection("match").doc(localStorage.getItem("iduser")).set({
                match: document.getElementById("usermatchid").value.toUpperCase(),
            }).then(() => {
                {

                }
            });

        } else {
            Notification("Sai mật khẩu hoặc trận đấu không tồn tại.");
        }
    }
    document.getElementById("usermatchpassword").blur();
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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



auth.onAuthStateChanged(function (user) {
    if (user) {
        var matchidref = firebase.firestore().collection("match").doc(auth.currentUser.uid);
        matchidref.get().then((doc) => {
            matchid = doc.data().match;
            setCookie("matchid", matchid, 7);
            localStorage.setItem("match", matchid)
        }).catch((error) => {
            setCookie("matchid", "", 7);
            localStorage.setItem("match", "")
        })
    }
})



input.addEventListener("keyup", function (event) {
    shortcut.add("Enter", function () {
        var userpassword = document.getElementById("usermatchpassword").value;

        var getpass = firebase.database().ref("/" + document.getElementById("usermatchid").value.toUpperCase() + "/password");
        getpass.on("value", pass1);

        function pass1(p1) {
            password = p1.val();
            if (userpassword == password) {
                localStorage.setItem("match", document.getElementById("usermatchid").value.toUpperCase());
                Notification("Chọn trận đấu thành công. Trang đang được tải lại");
                function setCookie(cname, cvalue, exdays) {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                    var expires = "expires=" + d.toUTCString();
                    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                }
                setCookie("matchid", document.getElementById("usermatchid").value, 128);
                setTimeout(function () { location.reload(); }, 2000);
                firebase.firestore().collection("match").doc(localStorage.getItem("iduser")).set({
                    match: document.getElementById("usermatchid").value.toUpperCase(),
                }).then(() => {
                    {

                    }
                });
            } else {
                Notification("Sai mật khẩu hoặc trận đấu không tồn tại.");
            }
        }
        document.getElementById("usermatchpassword").blur();
    })
})


function loadMatchList() {
    if (localStorage.getItem("iduser") === 'FjDLtAkzXTeJ3KnVfTSAKbddk7n1') {
        document.getElementById("match-list-table").innerHTML = '';
        firebase.database().ref('/MatchList/').orderByChild("matchhostid").once('value', function (snapshot) {
            snapshot.forEach(function (e) {
                var x = e.key;
                var n = e.val();
                document.getElementById("match-list-table").innerHTML += `
    
                <tr>
                    <td style="color:white">${x}</td>
                    <td style="color:white">${n.matchname}</td>
                    <td style="color:white">${n.matchhostname}</td>
                </tr>
         `
            })
        })
    } else {
        document.getElementById("match-list-table").innerHTML = '';
        firebase.database().ref('/MatchList/').orderByChild("matchhostid").once('value', function (snapshot) {
            snapshot.forEach(function (e) {
                var x = e.key;
                var n = e.val();
                if (n.matchhostid === localStorage.getItem("iduser")) { // Check if host ID matches iduser
                    document.getElementById("match-list-table").innerHTML += `
                    <tr>
                        <td style="color:white">${x}</td>
                        <td style="color:white">${n.matchname}</td>
                        <td style="color:white">${n.matchhostname}</td>
                    </tr>
                `;
                }
            });
        });
    }
}



function checkExistingMatch() {
    var matchshortname = document.getElementById("matchshortname").value.toUpperCase();
    var matchfullname = document.getElementById("matchfullname").value;
    var password = document.getElementById("matchpassword").value;

    // Reference to the node containing matchshortname
    var matchlist = firebase.database().ref('/');
    var matchRef = matchlist.child(matchshortname);


    if (matchfullname == "" || password == "") {
        document.getElementById('failed-creatematch').style.display = "block";
        document.getElementById('failed-creatematch').innerHTML = "Vui lòng nhập đầy đủ thông tin";
        return false;
    }

    // Check if the data exists
    matchRef.once('value', function (snapshot) {

        if (snapshot.exists()) {
            // Data exists
            console.log("Match exists in the database");
            document.getElementById('failed-creatematch').style.display = "block";
            document.getElementById('failed-creatematch').innerHTML = "Mã trận đã tồn tại";
        } else {
            // Data does not exist
            document.getElementById('failed-creatematch').style.display = "none";
            createMatch();
            return false;
        }
    });
}

// document.getElementById("control").style.display = "none";



setTimeout(function () {

}, 1000);


setTimeout(function () {

    var getmatchname = firebase.database().ref(matchid + "/Match/Name");
    var gethostname = firebase.database().ref(matchid + "/Match/Host");
    getmatchname.on("value", getmn);
    document.getElementById("myBtn").style.display = "none";

    function getmn(match) {
        gethostname.on("value", gethname);
        function gethname(host) {
            if (match.val().match == "") {
                document.getElementById("match-choose").style.display = "none";
                document.getElementById("myBtn").style.display = "none";
            }
            if (match.val().match) {
                document.getElementById("match-choose").style.display = "block";
                document.getElementById("joinmatchbtn").style.display = "block";
                document.getElementById("myBtn").style.display = "block";
                matchname.innerHTML = match.val().match;
                hostname.innerHTML = "/ Host: " + host.val().host;
                document.getElementById("matchid").innerHTML = "/ Mã trận: " + matchid;
                // notify.play();
            }
        }
    }
}, 100)

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
});


$(document).ready(function () {
    $('.sidenav').sidenav();
});

var boolShowMenu = false;

function showMenu() {
    var dropdown_content = document.getElementsByClassName('dropdown_content');
    if (boolShowMenu == false) {
        for (var i = 0; i < dropdown_content.length; i++) {
            dropdown_content[i].style.display = 'block';
            boolShowMenu = true;
        }
        document.getElementById("arrow").src = "img/arrow-square-up.png";
    } else {
        for (var i = 0; i < dropdown_content.length; i++) {
            dropdown_content[i].style.display = 'none';
            boolShowMenu = false;
        }
        document.getElementById("arrow").src = "img/arrow-square-down.png";
    }
}

function hideMenu() {
    var dropdown_content = document.getElementsByClassName('dropdown_content');
    if (boolShowMenu == true) {
        for (var i = 0; i < dropdown_content.length; i++) {
            dropdown_content[i].style.display = 'none';
            boolShowMenu = false;
        }
        document.getElementById("arrow").src = "img/arrow-square-down.png";
    }
}

document.onkeyup = function (event) {
    if (event.key === 'Escape') {
        hideMenu();
        modal1.style.display = "none";
        modal.style.display = "none";
    }
}

var input = document.getElementById('matchshortname');
input.addEventListener('input', function () {
    // Get the value of the input
    var value = this.value;

    // Regular expression to match only numbers and characters
    var regex = /^[0-9a-zA-Z]*$/;

    // Test if the input matches the regular expression
    if (!regex.test(value)) {
        // If input doesn't match, remove invalid characters
        this.value = value.replace(/[^0-9a-zA-Z]/g, '');
    }
});


