// function getCookie(cname) {
//     var name = cname + "=";
//     var ca = document.cookie.split(';');
//     for (var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }



// var matchid = getCookie("matchid");


// Reference to the Participant node
// var participantRef = firebase.database().ref(matchid + "/Participant/");

// Check if uid exists and get requestStatus
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
//         if (localStorage.getItem("id") == 5 || localStorage.getItem("id") == 7) {
//             alert("Bạn đã bị kick khỏi phòng trò chơi");
//             location.replace('Main.html');  // Replace with the appropriate URL
//         }
//     }
// });