function getCookie(_0x503254) {
    var _0x1d9f1e = _0x503254 + '=';
    var _0x4d19f6 = document.cookie.split(';');
    for (var _0x21232a = 0x0; _0x21232a < _0x4d19f6.length; _0x21232a++) {
      var _0x635803 = _0x4d19f6[_0x21232a];
      while (_0x635803.charAt(0x0) == " ") {
        _0x635803 = _0x635803.substring(0x1);
      }
      if (_0x635803.indexOf(_0x1d9f1e) == 0x0) {
        return _0x635803.substring(_0x1d9f1e.length, _0x635803.length);
      }
    }
    return '';
  }
  var item = {
    'Background': '',
    'AnswerButton': '',
    'StartQuestion': '',
    'StartCompetitor': '',
    'StartCompetitorSelecting': '',
    'StartAnswerButton': '',
    'StartObjectBorder': '',
    'StartTextColor': '',
    'ObstacleOverlay': '',
    'ObstacleRow': '',
    'ObstacleBubbleColor': '',
    'ObstacleBubbleTextColor': '',
    'ObstacleBubbleBorder': '',
    'ObstacleQuestion': '',
    'ObstacleCompetitorAnswer': '',
    'ObstacleAnswerRights': '',
    'ObstacleObjectBorder': '',
    'ObstacleTextColor': '',
    'ObstacleSlide': '',
    'AccelerationQuestion': '',
    'AccelerationMedia': '',
    'AccelerationCompetitorAnswer': '',
    'AccelerationObjectBorder': '',
    'AccelerationTextColor': '',
    'AccelerationSlide': '',
    'FinishQuestionPack': '',
    'FinishQuestionPackChooseSquare': '',
    'FinishQuestion': '',
    'FinishCompetitor': '',
    'FinishFinishingCompetitor': '',
    'FinishCompetitorAnswering': '',
    'FinishObjectBorder': '',
    'FinishTextColor': '',
    'FinishSlide': '',
    'PointSummaryPointObject': '',
    'PointSummaryCompetitorObject': '',
    'PointSummaryObjectBorder': '',
    'PointSummaryTextColor': ''
  };
  var matchid = getCookie("matchid");
  var gethostid = firebase.database().ref(matchid + "/hostid");
  gethostid.on('value', gethuid);
  function gethuid(_0x513a3a) {
    firebase.firestore().collection('Theme').doc(_0x513a3a.val()).onSnapshot(_0x3f031a => {
      if (_0x3f031a.exists) {
        const _0x2269d8 = _0x3f031a.data();
        localStorage.setItem("themeData", JSON.stringify(_0x2269d8));
        console.log("Data saved to local storage:", _0x2269d8);
      } else {
        localStorage.setItem("themeData", JSON.stringify(item));
        console.log("No such document!");
      }
    }, _0x42db22 => {
      console.error("Error getting document:", _0x42db22);
    });
  }