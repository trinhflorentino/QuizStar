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

var item = {
    Background: "",
    AnswerButton: "",
    StartQuestion: "",
    StartCompetitor: "",
    StartCompetitorSelecting: "",
    StartAnswerButton: "",
    StartObjectBorder: "",
    StartTextColor: "",
    ObstacleOverlay: "",
    ObstacleRow: "",
    ObstacleBubbleColor: "",
    ObstacleBubbleTextColor: "",
    ObstacleBubbleBorder: "",
    ObstacleQuestion: "",
    ObstacleCompetitorAnswer: "",
    ObstacleAnswerRights: "",
    ObstacleObjectBorder: "",
    ObstacleTextColor: "",
    ObstacleSlide: "",
    AccelerationQuestion: "",
    AccelerationMedia: "",
    AccelerationCompetitorAnswer: "",
    AccelerationObjectBorder: "",
    AccelerationTextColor: "",
    AccelerationSlide: "",
    FinishQuestionPack: "",
    FinishQuestionPackChooseSquare: "",
    FinishQuestion: "",
    FinishCompetitor: "",
    FinishFinishingCompetitor: "",
    FinishCompetitorAnswering: "",
    FinishObjectBorder: "",
    FinishTextColor: "",
    FinishSlide: "",
    PointSummaryPointObject: "",
    PointSummaryCompetitorObject: "",
    PointSummaryObjectBorder: "",
    PointSummaryTextColor: "",
}

var matchid = getCookie("matchid");
var gethostid = firebase.database().ref(matchid + "/hostid");

gethostid.on("value", gethuid);
function gethuid(hostid) {
    firebase.firestore().collection("Theme").doc(hostid.val()).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            // Save data to local storage
            localStorage.setItem("themeData", JSON.stringify(data));
            console.log("Data saved to local storage:", data);
            // Optionally, use the data immediately
        } else {
            localStorage.setItem("themeData", JSON.stringify(item));
            console.log("No such document!");
        }
    }, (error) => {
        console.error("Error getting document:", error);
    });
}