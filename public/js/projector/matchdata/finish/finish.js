auth.onAuthStateChanged(user => {
    if (!user) {
      return;
    }
    const matchDocRef = firestoreDB.collection('match').doc(auth.currentUser.uid);
    matchDocRef.onSnapshot(matchDoc => {
      if (!matchDoc.exists) {
        return;
      }
      const matchId = matchDoc.data().match;
      var playerStatusRef = realtimeDB.ref(matchId + '/playerstatus/vedich');
      var finishPointRef = realtimeDB.ref(matchId + "/FinishPoint/status");
      var playerTurnEndRef = realtimeDB.ref(matchId + "/VDPlayerTurnEnd/End");
      var questionNumberRef = realtimeDB.ref(matchId + "/VDCauso");
      var gameStatusRef = realtimeDB.ref(matchId + "/phanthistatus/vedich");
      var starStatusRef = realtimeDB.ref(matchId + '/VDNSHV/status');
      var answerStatusRef = realtimeDB.ref(matchId + "/VDCorrectOrWrong/");
      var buzzerRef = realtimeDB.ref(matchId + "/FinishBuzzer/");
      var bellAnswerRef = realtimeDB.ref(matchId + "/VDChuong/CorrectOrWrong");
      var videoStateRef = realtimeDB.ref(matchId + "/FinishVideoState/VD");

      let currentPlayer = null;
      let currentPackage = null;
      let isTimerActive = false;
      let timerInterval;
      let question1 = null;
      let question2 = null;
      let question3 = null;

      playerStatusRef.on('value', playerStatusSnapshot => {
        const player = playerStatusSnapshot.val().player;
        currentPlayer = player;
        updatePlayerUI(player);
        if (player === 0) {
          document.getElementById("FinishMainUI").classList.add("hidden");
          resetQuestionPackSelection();
        } else {
          document.getElementById("audio_FinishUserStart").currentTime = 0;
          document.getElementById("audio_FinishUserStart").play();
          if (window.currentRefPlayerPoint) {
            window.currentRefPlayerPoint.off();
          }
          window.currentRefPlayerPoint = realtimeDB.ref(matchId + '/point/player' + currentPlayer);
          window.currentRefPlayerPoint.on('value', playerPointSnapshot => {
            const playerPoint = playerPointSnapshot.val().point;
            document.getElementById("FinishPlayerSelectingPoint").textContent = playerPoint;
          });
          checkQuestionPackAvailability(10, showQuestionPack);
          function showQuestionPack(isAvailable) {
            if (isAvailable) {
              document.getElementById('FinishQuestionPack10').classList.remove('hidden');
            }
          }
          setTimeout(() => {
            document.getElementById("audio_FinishQuestionPackShow").currentTime = 0;
            document.getElementById("audio_FinishQuestionPackShow").play();
            document.getElementById("FinishQuestionPackSelectionContainer").classList.remove("hidden");
          }, 4500);
        }
      });

      function updatePlayerUI(player) {
        const playerElements = document.querySelectorAll("#FinishPlayerLists > .flex-1");
        playerElements.forEach((element, index) => {
          element.classList.remove("bg-defaultColor", 'transform', "-translate-y-2", 'rounded-tl-lg', "rounded-tr-lg", 'bg-white');
          const playerText = element.querySelector('p');
          if (playerText) {
            playerText.classList.remove("text-white", "text-defaultColor");
          }
          if (index === 0) {
            element.classList.add('rounded-tl-lg');
          }
          if (index === playerElements.length - 1) {
            element.classList.add('rounded-tr-lg');
          }
          if (index === player - 1) {
            element.classList.add("bg-defaultColor", "transform", "-translate-y-2", "rounded-tl-lg", "rounded-tr-lg");
            if (playerText) {
              playerText.classList.add("text-white");
            }
          } else {
            element.classList.add("bg-white");
            if (playerText) {
              playerText.classList.add('text-defaultColor');
            }
          }
        });
      }

      finishPointRef.on("value", finishPointSnapshot => {
        const status = finishPointSnapshot.val().status;
        if (status === 1) {
          var questionChooseRef = realtimeDB.ref(matchId + '/FinishQuestionChoose/TS' + currentPlayer);
          questionChooseRef.once("value").then(questionChooseSnapshot => {
            const questionData = questionChooseSnapshot.val();
            resetQuestionPackSelection();
            Object.values(questionData).forEach(question => {
              if (question.cau1) {
                selectQuestionPack(question.cau1, 0);
                question1 = question.cau1;
              }
              if (question.cau2) {
                selectQuestionPack(question.cau2, 1);
                question2 = question.cau2;
              }
              if (question.cau3) {
                selectQuestionPack(question.cau3, 2);
                question3 = question.cau3;
              }
            });
          });
          document.getElementById("audio_FinishQuestionPackChoose").currentTime = 0;
          document.getElementById("audio_FinishQuestionPackChoose").play();
          setTimeout(() => {
            document.getElementById("FinishQuestionPackSelectionContainer").classList.remove("fly-in");
            document.getElementById("FinishQuestionPackSelectionContainer").classList.add('fly-out');
            setTimeout(() => {
              document.getElementById("FinishQuestionPackSelectionContainer").classList.add('hidden');
              document.getElementById("FinishQuestionPackSelectionContainer").classList.add('fly-in');
              document.getElementById('FinishQuestionPackSelectionContainer').classList.remove("fly-out");
              document.getElementById("FinishMainUI").classList.remove("hidden");
            }, 500);
          }, 3000);
        }
      });

      function selectQuestionPack(questionPack, index) {
        const questionPackInput = document.querySelector(".finish-question-pack-" + questionPack + " > input:nth-child(" + (index + 1) + ')');
        if (questionPackInput) {
          questionPackInput.checked = true;
        }
      }

      function resetQuestionPackSelection() {
        [10, 20, 30].forEach(pack => {
          const questionPackElement = document.querySelector(".finish-question-pack-" + pack);
          if (questionPackElement) {
            const checkboxes = questionPackElement.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(checkbox => {
              checkbox.checked = false;
            });
          }
        });
      }

      playerTurnEndRef.on("value", playerTurnEndSnapshot => {
        var end = playerTurnEndSnapshot.val().end;
        if (end === 1) {
          document.getElementById("audio_FinishFinish").currentTime = 0;
          document.getElementById("audio_FinishFinish").play();
          document.getElementById("FinishQuestionPackSelectionContainer").classList.add("hidden");
        }
      });

      questionNumberRef.on("value", questionNumberSnapshot => {
        const questionData = questionNumberSnapshot.val();
        const questionElement = document.getElementById('FinishQuestion');
        const questionPackElement = document.getElementById('FinishQuestionPackSelecting');
        const questionPackText = document.getElementById('FinishQuestionPackSelectingText');
        if (!questionData || !questionData.causo || currentPlayer === 0) {
            questionElement.textContent = '';
            questionPackElement.textContent = '';
            questionPackText.classList.add('invisible');
            return;
        }
        const questionNumber = questionData.causo;
        let selectedQuestion = null;
        if (questionNumber === 1) {
            selectedQuestion = question1;
            currentPackage = question1;
            questionPackElement.textContent = question1;
            questionPackText.classList.remove('invisible');
        } else if (questionNumber === 2) {
            selectedQuestion = question2;
            currentPackage = question2;
            questionPackElement.textContent = question2;
            questionPackText.classList.remove('invisible');
        } else if (questionNumber === 3) {
            selectedQuestion = question3;
            currentPackage = question3;
            questionPackElement.textContent = question3;
            questionPackText.classList.remove('invisible');
        }
        resetSlider();
        const questionRef = realtimeDB.ref(matchId + "/FinishQuestion/Q" + currentPlayer + "DB/QP" + selectedQuestion + '/' + questionNumber);
        questionRef.once("value").then(questionSnapshot => {
          console.log("Question data:", questionSnapshot.val());
          const question = questionSnapshot.val();
          questionElement.textContent = question && question.cauhoi ? question.cauhoi : '';
        });
      });

      gameStatusRef.on("value", gameStatusSnapshot => {
        const gameStatus = gameStatusSnapshot.val().batdau;
        if (gameStatus === 1) {
          let timeLimit = 0;
          if (currentPackage === 10) {
            timeLimit = 10;
            startTimer(10000);
            document.getElementById("audio_Finish10Seconds").currentTime = 0;
            document.getElementById("audio_Finish10Seconds").play();
          } else if (currentPackage === 20) {
            timeLimit = 15;
            startTimer(15000);
            document.getElementById("audio_Finish15Seconds").currentTime = 0;
            document.getElementById('audio_Finish15Seconds').play();
          } else if (currentPackage === 30) {
            timeLimit = 20;
            startTimer(20000);
            document.getElementById("audio_Finish20Seconds").currentTime = 0;
            document.getElementById("audio_Finish20Seconds").play();
          }
        }
      });

      function startTimer(duration) {
        resetSlider();
        const slider = document.getElementById("FinishSlider");
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          slider.value = progress * 100;
          if (progress >= 1) {
            clearInterval(interval);
          }
        }, 16);
      }

      function resetSlider() {
        const slider = document.getElementById('FinishSlider');
        slider.value = 0;
      }

      starStatusRef.on("value", starStatusSnapshot => {
        if (starStatusSnapshot.val().status === 1) {
          document.getElementById('audio_FinishStarChose').currentTime = 0;
          document.getElementById("audio_FinishStarChose").play();
          document.getElementById('FinishStar').classList.remove("hidden");
        } else {
          document.getElementById("FinishStar").classList.add("hidden");
        }
      });

      answerStatusRef.on("value", answerStatusSnapshot => {
        const answerStatus = answerStatusSnapshot.val().dungsai;
        if (answerStatus === 1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0;
          document.getElementById("audio_FinishRightAnswer").play();
        } else if (answerStatus === 2) {
          isTimerActive = true;
          document.getElementById("audio_Finish5Seconds").currentTime = 0;
          document.getElementById("audio_Finish5Seconds").play();
          stopAllTimers();
          setTimeout(() => {
            isTimerActive = false;
          }, 5000);
        }
      });

      buzzerRef.on("value", buzzerSnapshot => {
        if (!buzzerSnapshot.exists()) {
          console.log("No buzzer entries yet");
          const playerElements = document.querySelectorAll("#FinishPlayerLists > .flex-1");
          playerElements.forEach((element, index) => {
            if (index !== currentPlayer - 1) {
              element.classList.remove("bg-red-500");
              element.classList.add("bg-white");
              const playerText = element.querySelector('p');
              if (playerText) {
                playerText.classList.remove('text-white');
                playerText.classList.add("text-defaultColor");
              }
            }
          });
          return;
        }
        let fastestBuzzer = {
          'timestamp': Infinity,
          'id': null
        };
        let buzzerTimestamps = {};
        buzzerSnapshot.forEach(buzzerEntry => {
          const buzzerData = buzzerEntry.val();
          console.log("Buzzer press:", {
            'id': buzzerData.id,
            'timestamp': buzzerData.buzzerTimestamp
          });
          if (!buzzerTimestamps[buzzerData.id] || buzzerData.buzzerTimestamp < buzzerTimestamps[buzzerData.id]) {
            buzzerTimestamps[buzzerData.id] = buzzerData.buzzerTimestamp;
          }
          if (buzzerTimestamps[buzzerData.id] < fastestBuzzer.timestamp) {
            fastestBuzzer = {
              'timestamp': buzzerTimestamps[buzzerData.id],
              'id': buzzerData.id
            };
          }
        });
        console.log("Fastest buzzer:", fastestBuzzer.id);
        console.log("Timestamp:", new Date(fastestBuzzer.timestamp));
        const playerElements = document.querySelectorAll("#FinishPlayerLists > .flex-1");
        playerElements.forEach((element, index) => {
          if (index === currentPlayer - 1) {
            return;
          }
          element.classList.remove("bg-red-500");
          element.classList.add('bg-white');
          const playerText = element.querySelector('p');
          if (playerText) {
            playerText.classList.remove('text-white');
            playerText.classList.add("text-defaultColor");
          }
        });
        if (fastestBuzzer.id !== null) {
          playerElements.forEach((element, index) => {
            if (index === fastestBuzzer.id - 1 && index !== currentPlayer - 1) {
              element.classList.remove("bg-white");
              element.classList.add("bg-red-500");
              const playerText = element.querySelector('p');
              if (playerText) {
                playerText.classList.add('text-white');
                playerText.classList.remove("text-defaultColor");
              }
            }
          });
          document.getElementById('audio_FinishAnswerGranted').currentTime = 0;
          document.getElementById("audio_FinishAnswerGranted").play();
        }
      });

      function stopAllTimers() {
        clearInterval(timerInterval);
        document.getElementById("audio_Finish10Seconds").pause();
        document.getElementById("audio_Finish15Seconds").pause();
        document.getElementById("audio_Finish20Seconds").pause();
      }

      bellAnswerRef.on('value', bellAnswerSnapshot => {
        const bellAnswerStatus = bellAnswerSnapshot.val().correctorwrong;
        if (bellAnswerStatus === 1) {
          document.getElementById("audio_FinishRightAnswer").currentTime = 0;
          document.getElementById("audio_FinishRightAnswer").play();
        } else if (bellAnswerStatus === 2) {
          document.getElementById("audio_FinishWrongAnswer").currentTime = 0;
          document.getElementById("audio_FinishWrongAnswer").play();
        }
      });

      function checkQuestionPackAvailability(questionPack, callback) {
        var questionPackRef = realtimeDB.ref(matchId + '/FinishQuestion/');
        var isAvailable = false;
        function checkQuestion(questionSnapshot) {
          const questionData = questionSnapshot.val();
          if (questionData !== null && typeof questionData === "object") {
            if (questionData.cauhoi.trim().length > 0 && questionData.dapan.trim().length > 0) {
              isAvailable = true;
              return true;
            }
          }
          return false;
        }
        for (var i = 1; i <= 4; i++) {
          for (var j = 1; j <= 3; j++) {
            var questionPath = 'Q' + i + 'DB' + "/QP" + questionPack + '/' + j;
            var questionRef = questionPackRef.child(questionPath);
            questionRef.once("value", questionSnapshot => {
              if (checkQuestion(questionSnapshot)) {
                callback(isAvailable);
                return;
              }
            }).catch(error => {
              console.error("Error fetching data:", error);
              callback(false);
            });
            if (isAvailable) {
              return;
            }
          }
        }
        callback(false);
      }

      videoStateRef.on("value", videoStateSnapshot => {
        const videoState = videoStateSnapshot.val();
        const videoElement = document.getElementById("FinishVideo");
        const iframeElement = document.getElementById("FinishIframe");
        function loadVideo(videoNumber) {
          const videoPath = matchId + '/vd/vd' + videoNumber + "/vd.mp4";
          firebase.storage().ref(videoPath).getDownloadURL().then(videoURL => {
            videoElement.src = videoURL;
            videoElement.classList.remove("hidden");
            setTimeout(() => {
              videoElement.play();
            }, 3000);
          }).catch(error => {
            console.error("Error loading video:", error);
          });
        }
        if (videoState.video1 === 1) {
          loadVideo(1);
        } else if (videoState.video2 === 1) {
          loadVideo(2);
        } else if (videoState.video3 === 1) {
          loadVideo(3);
        } else if (videoState.video4 === 1) {
          loadVideo(4);
        } else if (videoState.video1 === 0 && videoState.video2 === 0 && videoState.video3 === 0 && videoState.video4 === 0) {
          videoElement.classList.add('hidden');
          videoElement.pause();
          videoElement.currentTime = 0;
        }
        if (videoState.CustomVideo) {
          iframeElement.src = videoState.CustomVideo;
          iframeElement.classList.remove("hidden");
        } else {
          iframeElement.src = '';
          iframeElement.classList.add('hidden');
        }
      });
    });
  });