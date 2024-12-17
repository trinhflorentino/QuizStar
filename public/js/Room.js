document.addEventListener('contextmenu', event => event.preventDefault());

shortcut.add("F12", function () {
    alert("!!!!!");
});
shortcut.add("Ctrl+Shift+I", function () {
    alert("!!!");
});

firebase.database().ref(matchid + '/ChatDisable').on('value', chatdisable);
function chatdisable(cdisable) {
    if (cdisable.val().disable == 0) {
        document.getElementById("msg").disabled = false;
        document.getElementById("msg").value = "";
    }
    if (cdisable.val().disable == 1) {
        document.getElementById("msg").disabled = true;
        document.getElementById("msg").value = "Host đang cấm chat!!!";
    }
}


// // Reference to the Participant node
// var participantRef = firebase.database().ref(matchid + "/Participant/");

// // Check if uid exists and get requestStatus
// participantRef.orderByChild("uid").equalTo(localStorage.getItem("iduser")).on("value", function (snapshot) {
//     if (snapshot.exists()) {
//         var childData = snapshot.val();
//         var requestStatus = Object.values(childData)[0].requestStatus;
//         if (requestStatus === 2) {
//             alert("Bạn đã bị từ chối");
//             location.replace('Main.html');  // Replace with the appropriate URL
//         } else if (requestStatus === 3) {
//             alert("Bạn đã bị chặn bởi chủ phòng");
//             location.replace('Main.html');  // Replace with the appropriate URL
//         }
//     } else {
//         if (localStorage.getItem("id") == 5) {
//             alert("Bạn đã bị kick khỏi trận đấu");
//             location.replace('Main.html');  // Replace with the appropriate URL
//         }
//     }
// });