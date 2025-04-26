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


// Get the user ID from localStorage
var userId = localStorage.getItem("iduser");

// Reference to the Firestore document
var docRef = firebase.firestore().collection("Theme").doc(userId);

// Get the document
docRef.get().then((doc) => {
    if (doc.exists) {

    } else {
        // Document does not exist, create it with the item data
        docRef.set(item);
    }
}).catch((error) => {
    console.error("Error checking document: ", error);
});

function Notification(noti) {
    var notification = document.getElementsByClassName('notification');
    document.getElementById("notification-text").innerHTML = noti;
    notification[0].style.display = "block";
    setTimeout(function () {
        notification[0].style.display = "none";
    }, 3000);
}

var db = firebase.firestore();

function isHexColor(value) {
    return /^#?([0-9A-F]{3}){1,2}$/i.test(value);
}

function isRGB(value) {
    return /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.test(value);
}

function formatValue(value) {
    if (isHexColor(value)) {
        return value.startsWith('#') ? value : '#' + value;
    } else if (isRGB(value)) {
        return value;
    } else if (value.startsWith("http://") || value.startsWith("https://")) {
        return `url("${value}")`;
    }
    return value;
}

function updateBackground() {
    var Background = formatValue(document.getElementById("Background").value);
    var AnswerButton = formatValue(document.getElementById("AnswerButton").value);
    db.collection("Theme").doc(localStorage.getItem("iduser")).update({
        Background: Background,
        AnswerButton: AnswerButton
    });
    Notification("Đã cập nhật hình nền");
}

function uploadStart() {
    var StartQuestion = formatValue(document.getElementById("StartQuestion").value);
    var StartCompetitor = formatValue(document.getElementById("StartCompetitor").value);
    var StartCompetitorSelecting = formatValue(document.getElementById("StartCompetitorSelecting").value);
    var StartObjectBorder = formatValue(document.getElementById("StartObjectBorder").value);
    var StartTextColor = formatValue(document.getElementById("StartTextColor").value);

    db.collection("Theme").doc(localStorage.getItem("iduser")).update({
        StartQuestion: StartQuestion,
        StartCompetitor: StartCompetitor,
        StartCompetitorSelecting: StartCompetitorSelecting,
        StartObjectBorder: StartObjectBorder,
        StartTextColor: StartTextColor
    });
    Notification("Đã cập nhật giao diện Khởi động I/II");
}

function uploadObstacle() {
    var ObstacleOverlay = formatValue(document.getElementById("ObstacleOverlay").value);
    var ObstacleRow = formatValue(document.getElementById("ObstacleRow").value);
    var ObstacleBubbleColor = formatValue(document.getElementById("ObstacleBubbleColor").value);
    var ObstacleBubbleTextColor = formatValue(document.getElementById("ObstacleBubbleTextColor").value);
    var ObstacleBubbleBorder = formatValue(document.getElementById("ObstacleBubbleBorder").value);
    var ObstacleQuestion = formatValue(document.getElementById("ObstacleQuestion").value);
    var ObstacleCompetitorAnswer = formatValue(document.getElementById("ObstacleCompetitorAnswer").value);
    var ObstacleAnswerRights = formatValue(document.getElementById("ObstacleAnswerRights").value);
    var ObstacleObjectBorder = formatValue(document.getElementById("ObstacleObjectBorder").value);
    var ObstacleTextColor = formatValue(document.getElementById("ObstacleTextColor").value);
    var ObstacleSlide = formatValue(document.getElementById("ObstacleSlide").value);

    db.collection("Theme").doc(localStorage.getItem("iduser")).update({
        ObstacleOverlay: ObstacleOverlay,
        ObstacleRow: ObstacleRow,
        ObstacleBubbleColor: ObstacleBubbleColor,
        ObstacleBubbleTextColor: ObstacleBubbleTextColor,
        ObstacleBubbleBorder: ObstacleBubbleBorder,
        ObstacleQuestion: ObstacleQuestion,
        ObstacleCompetitorAnswer: ObstacleCompetitorAnswer,
        ObstacleAnswerRights: ObstacleAnswerRights,
        ObstacleObjectBorder: ObstacleObjectBorder,
        ObstacleTextColor: ObstacleTextColor,
        ObstacleSlide: ObstacleSlide
    });
    Notification("Đã cập nhật giao diện Vượt chướng ngại vật");
}

function uploadAcceleration() {
    var AccelerationQuestion = formatValue(document.getElementById("AccelerationQuestion").value);
    var AccelerationMedia = formatValue(document.getElementById("AccelerationMedia").value);
    var AccelerationCompetitorAnswer = formatValue(document.getElementById("AccelerationCompetitorAnswer").value);
    var AccelerationObjectBorder = formatValue(document.getElementById("AccelerationObjectBorder").value);
    var AccelerationTextColor = formatValue(document.getElementById("AccelerationTextColor").value);
    var AccelerationSlide = formatValue(document.getElementById("AccelerationSlide").value);

    db.collection("Theme").doc(localStorage.getItem("iduser")).update({
        AccelerationQuestion: AccelerationQuestion,
        AccelerationMedia: AccelerationMedia,
        AccelerationCompetitorAnswer: AccelerationCompetitorAnswer,
        AccelerationObjectBorder: AccelerationObjectBorder,
        AccelerationTextColor: AccelerationTextColor,
        AccelerationSlide: AccelerationSlide
    });
    Notification("Đã cập nhật giao diện Tăng tốc");
}

function uploadFinish() {
    var FinishQuestionPack = formatValue(document.getElementById("FinishQuestionPack").value);
    var FinishQuestionPackChooseSquare = formatValue(document.getElementById("FinishQuestionPackChooseSquare").value);
    var FinishQuestion = formatValue(document.getElementById("FinishQuestion").value);
    var FinishCompetitor = formatValue(document.getElementById("FinishCompetitor").value);
    var FinishFinishingCompetitor = formatValue(document.getElementById("FinishFinishingCompetitor").value);
    var FinishCompetitorAnswering = formatValue(document.getElementById("FinishCompetitorAnswering").value);
    var FinishObjectBorder = formatValue(document.getElementById("FinishObjectBorder").value);
    var FinishTextColor = formatValue(document.getElementById("FinishTextColor").value);
    var FinishSlide = formatValue(document.getElementById("FinishSlide").value);

    db.collection("Theme").doc(localStorage.getItem("iduser")).update({
        FinishQuestionPack: FinishQuestionPack,
        FinishQuestionPackChooseSquare: FinishQuestionPackChooseSquare,
        FinishQuestion: FinishQuestion,
        FinishCompetitor: FinishCompetitor,
        FinishFinishingCompetitor: FinishFinishingCompetitor,
        FinishCompetitorAnswering: FinishCompetitorAnswering,
        FinishObjectBorder: FinishObjectBorder,
        FinishTextColor: FinishTextColor,
        FinishSlide: FinishSlide
    });
    Notification("Đã cập nhật giao diện Về đích, Câu hỏi phụ");
}

function uploadPointSummary() {
    var PointSummaryPointObject = formatValue(document.getElementById("PointSummaryPointObject").value);
    var PointSummaryCompetitorObject = formatValue(document.getElementById("PointSummaryCompetitorObject").value);
    var PointSummaryObjectBorder = formatValue(document.getElementById("PointSummaryObjectBorder").value);
    var PointSummaryTextColor = formatValue(document.getElementById("PointSummaryTextColor").value);

    db.collection("Theme").doc(localStorage.getItem("iduser")).update({
        PointSummaryPointObject: PointSummaryPointObject,
        PointSummaryCompetitorObject: PointSummaryCompetitorObject,
        PointSummaryObjectBorder: PointSummaryObjectBorder,
        PointSummaryTextColor: PointSummaryTextColor
    });

    Notification("Đã cập nhật giao diện Tổng kết điểm");
}

var dataRef = db.collection("Theme").doc(localStorage.getItem("iduser"));

dataRef.onSnapshot(function (doc) {
    //Background
    document.getElementById("BackgroundPreview").style.background = CheckBackgroundValue(doc.data().Background);
    document.getElementById("BackgroundPreview").style.backgroundSize = "cover";
    document.getElementById("chuong").style.background = CheckBackgroundValue(doc.data().AnswerButton);
    document.getElementById("chuong").style.backgroundSize = "cover";

    //Start
    document.getElementsByClassName("StartQuestionPreview")[0].style.background = CheckBackgroundValue(doc.data().StartQuestion);
    document.getElementsByClassName("StartQuestionPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("StartQuestionPreview")[0].style.border = doc.data().StartObjectBorder;
    document.getElementsByClassName("StartQuestionPreview")[0].style.color = doc.data().StartTextColor;
    var ele = document.getElementsByClassName('StartCompetitorPreview');
    for (var i = 0; i < ele.length; i++) {
        ele[i].style.background = doc.data().StartCompetitor;
        ele[i].style.border = doc.data().StartObjectBorder;
        ele[i].style.color = doc.data().StartTextColor;
    }
    if (doc.data().StartCompetitorSelecting != '') {
        document.getElementsByClassName('StartCompetitorPreview')[0].style.background = CheckBackgroundValue(doc.data().StartCompetitorSelecting);
        document.getElementsByClassName('StartCompetitorPreview')[0].style.backgroundSize = "cover";
    } else {
        document.getElementsByClassName('StartCompetitorPreview')[0].style.background = 'linear-gradient(90deg, rgba(88,30,45,1) 0%, rgba(138,60,73,1) 80%)';
    }

    //Obstacle
    var OOPele = document.getElementsByClassName('ObstacleOverlayPreview');
    for (var i = 0; i < OOPele.length; i++) {
        OOPele[i].style.background = CheckBackgroundValue(doc.data().ObstacleOverlay);
        OOPele[i].style.backgroundSize = "cover";
        OOPele[i].style.border = doc.data().ObstacleObjectBorder;
        OOPele[i].style.color = doc.data().ObstacleTextColor;
    }
    document.getElementsByClassName("ObstacleRowPreview")[0].style.background = CheckBackgroundValue(doc.data().ObstacleRow);
    document.getElementsByClassName("ObstacleRowPreview")[0].style.backgroundSize = "cover";

    var AnsBubbleele = document.getElementsByClassName('ansbubble');
    for (var i = 0; i < AnsBubbleele.length; i++) {
        AnsBubbleele[i].style.background = CheckBackgroundValue(doc.data().ObstacleBubbleColor);
        AnsBubbleele[i].style.backgroundSize = "cover";
        AnsBubbleele[i].style.color = doc.data().ObstacleBubbleTextColor;
        AnsBubbleele[i].style.border = doc.data().ObstacleBubbleBorder;
    }

    var RowNumberObject = document.getElementsByClassName('obstacle-row-number-object');
    var RowNumber = document.getElementsByClassName('obstacle-row-number');
    for (var i = 0; i < RowNumberObject.length; i++) {
        RowNumberObject[i].style.border = doc.data().ObstacleBubbleBorder;
        RowNumber[i].style.color = doc.data().ObstacleBubbleTextColor;
    }

    document.getElementsByClassName("ObstacleQuestionPreview")[0].style.background = CheckBackgroundValue(doc.data().ObstacleQuestion);
    document.getElementsByClassName("ObstacleQuestionPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("ObstacleCompetitorAnswerPreview")[0].style.background = CheckBackgroundValue(doc.data().ObstacleCompetitorAnswer);
    document.getElementsByClassName("ObstacleCompetitorAnswerPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("ObstacleAnswerRightsPreview")[0].style.background = CheckBackgroundValue(doc.data().ObstacleAnswerRights);
    document.getElementsByClassName("ObstacleAnswerRightsPreview")[0].style.backgroundSize = "cover";


    document.getElementsByClassName("ObstacleQuestionPreview")[0].style.border = doc.data().ObstacleObjectBorder;
    document.getElementsByClassName("ObstacleAnswerRightsPreview")[0].style.border = doc.data().ObstacleObjectBorder;
    document.getElementsByClassName("ObstacleCompetitorAnswerPreview")[0].style.border = doc.data().ObstacleObjectBorder;
    document.getElementsByClassName("ObstacleRowPreview")[0].style.border = doc.data().ObstacleObjectBorder;

    document.getElementsByClassName("ObstacleQuestionPreview")[0].style.color = doc.data().ObstacleTextColor;
    document.getElementsByClassName("ObstacleAnswerRightsPreview")[0].style.color = doc.data().ObstacleTextColor;
    document.getElementsByClassName("ObstacleCompetitorAnswerPreview")[0].style.color = doc.data().ObstacleTextColor;
    document.getElementsByClassName("ObstacleRowPreview")[0].style.color = doc.data().ObstacleTextColor;



    const element = document.querySelector('.ObstacleQuestionPreview');
    if (element) {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            .ObstacleQuestionPreview::after {
                background: ${doc.data().ObstacleSlide};
            }
        `, styleSheet.cssRules.length);
    }

    //Acceleration

    document.getElementsByClassName("AccelerationQuestionPreview")[0].style.background = CheckBackgroundValue(doc.data().AccelerationQuestion);
    document.getElementsByClassName("AccelerationQuestionPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("AccelerationQuestionMediaPreview")[0].style.background = CheckBackgroundValue(doc.data().AccelerationMedia);
    document.getElementsByClassName("AccelerationQuestionMediaPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("AccelerationCompetitorAnswerPreview")[0].style.background = CheckBackgroundValue(doc.data().AccelerationCompetitorAnswer);
    document.getElementsByClassName("AccelerationCompetitorAnswerPreview")[0].style.backgroundSize = "cover";

    document.getElementsByClassName("AccelerationQuestionPreview")[0].style.border = doc.data().AccelerationObjectBorder;
    document.getElementsByClassName("AccelerationQuestionMediaPreview")[0].style.border = doc.data().AccelerationObjectBorder;
    document.getElementsByClassName("AccelerationCompetitorAnswerPreview")[0].style.border = doc.data().AccelerationObjectBorder;

    document.getElementsByClassName("AccelerationQuestionPreview")[0].style.color = doc.data().AccelerationTextColor;
    document.getElementsByClassName("AccelerationQuestionMediaPreview")[0].style.color = doc.data().AccelerationTextColor;
    document.getElementsByClassName("AccelerationCompetitorAnswerPreview")[0].style.color = doc.data().AccelerationTextColor;

    const element1 = document.querySelector('.AccelerationQuestionMediaPreview');
    if (element1) {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            .AccelerationQuestionMediaPreview::after {
                background: ${doc.data().AccelerationSlide};
            }
        `, styleSheet.cssRules.length);
    }

    //Finish

    document.getElementsByClassName("FinishQuestionPackPreview")[0].style.background = CheckBackgroundValue(doc.data().FinishQuestionPack);
    document.getElementsByClassName("FinishQuestionPackPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("FinishQuestionPackPreview")[0].style.border = doc.data().FinishObjectBorder;
    var FinishQuestionPackChooseSquarePreview = document.getElementsByClassName('FinishQuestionPackChooseSquarePreview');
    for (var i = 0; i < FinishQuestionPackChooseSquarePreview.length; i++) {
        FinishQuestionPackChooseSquarePreview[i].style.background = CheckBackgroundValue(doc.data().FinishQuestionPackChooseSquare);
        FinishQuestionPackChooseSquarePreview[i].style.backgroundSize = "cover";
        FinishQuestionPackChooseSquarePreview[i].style.border = doc.data().FinishObjectBorder;
        FinishQuestionPackChooseSquarePreview[i].style.color = doc.data().FinishTextColor;
    }
    document.getElementsByClassName("FinishQuestionPreview")[0].style.background = CheckBackgroundValue(doc.data().FinishQuestion);
    document.getElementsByClassName("FinishQuestionPreview")[0].style.backgroundSize = "cover";
    var FinishCompetitorPreview = document.getElementsByClassName('FinishCompetitorPreview');
    for (var i = 0; i < FinishCompetitorPreview.length; i++) {
        FinishCompetitorPreview[i].style.background = CheckBackgroundValue(doc.data().FinishCompetitor);
        FinishCompetitorPreview[i].style.backgroundSize = "cover";
        FinishCompetitorPreview[i].style.border = doc.data().FinishObjectBorder;
        FinishCompetitorPreview[i].style.color = doc.data().FinishTextColor;
    }
    document.getElementsByClassName("FinishFinishingCompetitorPreview")[0].style.background = CheckBackgroundValue(doc.data().FinishFinishingCompetitor);
    document.getElementsByClassName("FinishFinishingCompetitorPreview")[0].style.backgroundSize = "cover";

    if (doc.data().FinishCompetitorAnswering != "") {
        document.getElementsByClassName("FinishCompetitorPreview")[0].style.background = CheckBackgroundValue(doc.data().FinishCompetitorAnswering);
        document.getElementsByClassName("FinishCompetitorPreview")[0].style.backgroundSize = "cover";
    } else {
        document.getElementsByClassName("FinishCompetitorPreview")[0].style.background = 'linear-gradient(90deg, rgba(88,30,45,1) 0%, rgba(138,60,73,1) 80%)';
    }

    document.getElementsByClassName("FinishQuestionPreview")[0].style.border = doc.data().FinishObjectBorder;
    document.getElementsByClassName("FinishFinishingCompetitorPreview")[0].style.border = doc.data().FinishObjectBorder;

    document.getElementsByClassName("FinishQuestionPreview")[0].style.color = doc.data().FinishTextColor;
    document.getElementsByClassName("FinishFinishingCompetitorPreview")[0].style.color = doc.data().FinishTextColor;

    const element2 = document.querySelector('.FinishQuestionPreview');
    if (element2) {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            .FinishQuestionPreview::after {
                background: ${doc.data().FinishSlide};
            }
        `, styleSheet.cssRules.length);
    }


    //PointSummary

    document.getElementsByClassName("PointSummaryPointObjectPreview")[0].style.background = CheckBackgroundValue(doc.data().PointSummaryPointObject);
    document.getElementsByClassName("PointSummaryPointObjectPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("PointSummaryCompetitorObjectPreview")[0].style.background = CheckBackgroundValue(doc.data().PointSummaryCompetitorObject);
    document.getElementsByClassName("PointSummaryCompetitorObjectPreview")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("PointSummaryPointObjectPreview")[0].style.border = doc.data().PointSummaryObjectBorder;
    document.getElementsByClassName("PointSummaryCompetitorObjectPreview")[0].style.border = doc.data().PointSummaryObjectBorder;
    document.getElementsByClassName("object-container")[0].style.color = doc.data().PointSummaryTextColor;

    //Paste Data
    document.getElementById("Background").value = doc.data().Background;
    document.getElementById("AnswerButton").value = doc.data().AnswerButton;

    document.getElementById("StartQuestion").value = doc.data().StartQuestion;
    document.getElementById("StartCompetitor").value = doc.data().StartCompetitor;
    document.getElementById("StartCompetitorSelecting").value = doc.data().StartCompetitorSelecting;
    document.getElementById("StartObjectBorder").value = doc.data().StartObjectBorder;
    document.getElementById("StartTextColor").value = doc.data().StartTextColor;

    document.getElementById("ObstacleOverlay").value = doc.data().ObstacleOverlay;
    document.getElementById("ObstacleRow").value = doc.data().ObstacleRow;
    document.getElementById("ObstacleBubbleColor").value = doc.data().ObstacleBubbleColor;
    document.getElementById("ObstacleBubbleTextColor").value = doc.data().ObstacleBubbleTextColor;
    document.getElementById("ObstacleBubbleBorder").value = doc.data().ObstacleBubbleBorder;
    document.getElementById("ObstacleQuestion").value = doc.data().ObstacleQuestion;
    document.getElementById("ObstacleAnswerRights").value = doc.data().ObstacleAnswerRights;
    document.getElementById("ObstacleCompetitorAnswer").value = doc.data().ObstacleCompetitorAnswer;
    document.getElementById("ObstacleObjectBorder").value = doc.data().ObstacleObjectBorder;
    document.getElementById("ObstacleTextColor").value = doc.data().ObstacleTextColor;
    document.getElementById("ObstacleSlide").value = doc.data().ObstacleSlide;

    document.getElementById("AccelerationQuestion").value = doc.data().AccelerationQuestion;
    document.getElementById("AccelerationMedia").value = doc.data().AccelerationMedia;
    document.getElementById("AccelerationCompetitorAnswer").value = doc.data().AccelerationCompetitorAnswer;
    document.getElementById("AccelerationObjectBorder").value = doc.data().AccelerationObjectBorder;
    document.getElementById("AccelerationTextColor").value = doc.data().AccelerationTextColor;
    document.getElementById("AccelerationSlide").value = doc.data().AccelerationSlide;

    document.getElementById("FinishQuestionPack").value = doc.data().FinishQuestionPack;
    document.getElementById("FinishQuestionPackChooseSquare").value = doc.data().FinishQuestionPackChooseSquare;
    document.getElementById("FinishQuestion").value = doc.data().FinishQuestion;
    document.getElementById("FinishCompetitor").value = doc.data().FinishCompetitor;
    document.getElementById("FinishFinishingCompetitor").value = doc.data().FinishFinishingCompetitor;
    document.getElementById("FinishCompetitorAnswering").value = doc.data().FinishCompetitorAnswering;
    document.getElementById("FinishObjectBorder").value = doc.data().FinishObjectBorder;
    document.getElementById("FinishTextColor").value = doc.data().FinishTextColor;
    document.getElementById("FinishSlide").value = doc.data().FinishSlide;

    document.getElementById("PointSummaryPointObject").value = doc.data().PointSummaryPointObject;
    document.getElementById("PointSummaryCompetitorObject").value = doc.data().PointSummaryCompetitorObject;
    document.getElementById("PointSummaryObjectBorder").value = doc.data().PointSummaryObjectBorder;
    document.getElementById("PointSummaryTextColor").value = doc.data().PointSummaryTextColor;
});


function exportToJson() {
    const inputs = [
        "Background", "AnswerButton", "StartQuestion", "StartCompetitor", "StartCompetitorSelecting", "StartObjectBorder", "StartTextColor",
        "ObstacleOverlay", "ObstacleRow", "ObstacleBubbleColor", "ObstacleBubbleTextColor", "ObstacleBubbleBorder", "ObstacleQuestion", "ObstacleCompetitorAnswer", "ObstacleAnswerRights", "ObstacleObjectBorder", "ObstacleTextColor", "ObstacleSlide",
        "AccelerationQuestion", "AccelerationMedia", "AccelerationCompetitorAnswer", "AccelerationObjectBorder", "AccelerationTextColor", "AccelerationSlide",
        "FinishQuestionPack", "FinishQuestionPackChooseSquare", "FinishQuestion", "FinishCompetitor", "FinishFinishingCompetitor", "FinishCompetitorAnswering", "FinishObjectBorder", "FinishTextColor", "FinishSlide",
        "PointSummaryPointObject", "PointSummaryCompetitorObject", "PointSummaryObjectBorder", "PointSummaryTextColor"
    ];

    let data = {};
    inputs.forEach(id => {
        data[id] = document.getElementById(id).value;
    });

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function importFromJson() {
    const fileInput = document.getElementById("uploadJson");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const jsonData = JSON.parse(event.target.result);
            for (const id in jsonData) {
                if (jsonData.hasOwnProperty(id)) {
                    const input = document.getElementById(id);
                    if (input) {
                        input.value = jsonData[id];
                    }
                }
            }
        };
        reader.readAsText(file);
        setTimeout(function () {
            saveAll();
        }, 500);
    } else {
        Notification("Bạn chưa chọn file khôi phục cài đặt");
    }
}

function saveAll() {
    updateBackground();
    uploadStart();
    uploadObstacle();
    uploadAcceleration();
    uploadFinish();
    uploadPointSummary();
    Notification("Đã lưu tất cả cài đặt");
}

function eraseAll() {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả cài đặt?")) {
        db.collection("Theme").doc(localStorage.getItem("iduser")).set(item);
        Notification("Đã xóa tất cả cài đặt");
        // document.location.reload();
    }
}

function CheckBackgroundValue(BackgroundVal) {
    if (BackgroundVal.startsWith("url")) {
        return BackgroundVal + "no-repeat";
    } else {
        return BackgroundVal;
    }
}