auth.onAuthStateChanged(user => {
    if (!user) {
      return;
    }
    const matchDoc = firestoreDB.collection('match').doc(auth.currentUser.uid);
    matchDoc.onSnapshot(snapshot => {
      if (!snapshot.exists) {
        return;
      }
      const matchId = snapshot.data().match;
      var vcnvQuestionRef = realtimeDB.ref(matchId + "/VCNVQuestion");
      var horizontalRowRef = realtimeDB.ref(matchId + '/VCNV/hangngang');
      var vcnvStatusRef = realtimeDB.ref(matchId + '/phanthistatus/vcnv');
      var openAnswerRef = realtimeDB.ref(matchId + "/VCNVOpenAnswer");
      var obstacleAnswersRef = realtimeDB.ref(matchId + "/ObstacleAnswers");
      var rowStatusRef = realtimeDB.ref(matchId + "/VCNVRowStatus");
      var answerCheckRef = realtimeDB.ref(matchId + "/CompetitonAnswerCheckStatus/Obstacle");
      var buzzerRef = realtimeDB.ref(matchId + '/ObstacleBuzzer');
      var imageStatusRef = realtimeDB.ref(matchId + "/VCNVImageStatus");
      var openAllRef = realtimeDB.ref(matchId + '/VCNVChuong/OpenAll');
      var disabledIdRef = realtimeDB.ref(matchId + "/ObstacleDisabledId");
      var audioRef = realtimeDB.ref(matchId + "/VCNVAudio");
      var countdownRef = realtimeDB.ref(matchId + "/VCNV15sCountdown");
      var alreadyOpenRef = realtimeDB.ref(matchId + "/AlreadyOpenAnswer");
      var imageRef = storage.ref(matchId + "/img/cnv/cnv.jpg");
      let questionData = null;

      vcnvQuestionRef.on("value", snapshot => {
        questionData = snapshot.val();
        const answer = snapshot.val().CNV.cnv;
        let answerNoSpaces = answer.replace(/\s/g, '');
        let characterType;
        if (/^[\p{L}]+$/u.test(answerNoSpaces)) {
          characterType = " CHỮ CÁI";
        } else {
          if (/^\d+$/.test(answerNoSpaces)) {
            characterType = " CHỮ SỐ";
          } else if (/^[\p{L}\d]+$/u.test(answerNoSpaces)) {
            characterType = " KÝ TỰ";
          } else {
            characterType = " KÝ TỰ";
          }
        }
        openAllRef.on("value", openAllSnapshot => {
          if (openAllSnapshot.val().correct === 0x1) {
            document.getElementById('ObstacleCharacterCount').textContent = "CHƯỚNG NGẠI VẬT:  " + answer;
            document.getElementById("audio_ObstacleRight").currentTime = 0x0;
            document.getElementById("audio_ObstacleRight").play();
          } else if (openAllSnapshot.val().correct === 0x2) {
            document.getElementById("audio_ObstacleRowWrongAnswer").currentTime = 0x0;
            document.getElementById("audio_ObstacleRowWrongAnswer").play();
          } else {
            document.getElementById("ObstacleCharacterCount").textContent = "CHƯỚNG NGẠI VẬT CÓ " + (answer.replace(/\s/g, '').length + characterType);
          }
        });
        const obstacleContainer = document.getElementById("obstacleContainer");
        const updateObstacleRows = rowData => {
          obstacleContainer.innerHTML = '';
          for (let i = 0x1; i <= 0x4; i++) {
            const rowId = 'HN' + i;
            const rowAnswer = questionData[rowId]?.['dapan']?.["replace"](/\s/g, '');
            const rowStatus = rowData[rowId]?.["status"];
            if (!rowAnswer) {
              console.warn("Answer for " + rowId + " is missing or invalid");
              continue;
            }
            const rowDiv = document.createElement("div");
            rowDiv.className = "flex space-x-4 mt-4 obstacle-row-" + i;
            for (let char of rowAnswer) {
              const charDiv = document.createElement('div');
              charDiv.className = rowStatus === 0x2 ? "w-12 h-12 bg-red-300  rounded-full flex items-center justify-center border-4 border-[#FEFEFE] bg-cover" : "w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border-4 border-[#FEFEFE] bg-cover";
              charDiv.style.backgroundImage = rowStatus === 0x2 ? "url(/img/Olympia_22_VCNV_keyword3.png" : "url(/img/Olympia_22_VCNV_keyword1.png)";
              const charSpan = document.createElement("span");
              charSpan.className = "text-3xl font-bold text-black";
              charSpan.textContent = rowStatus === 0x1 ? char : '';
              charDiv.appendChild(charSpan);
              rowDiv.appendChild(charDiv);
            }
            obstacleContainer.appendChild(rowDiv);
          }
        };
        rowStatusRef.on('value', rowStatusSnapshot => {
          const rowData = rowStatusSnapshot.val();
          updateObstacleRows(rowData);
        });
      });
      horizontalRowRef.on("value", horizontalRowSnapshot => {
        const currentRow = horizontalRowSnapshot.val().hn;
        const obstacleQuestion = document.getElementById("ObstacleQuestion");
        const currentRowDiv = document.querySelector(".obstacle-row-" + currentRow);
        if (currentRowDiv) {
          currentRowDiv.querySelectorAll('div').forEach(div => {
            div.classList.remove("bg-gray-300", "dark:bg-neutral-700");
            // div.classList.add("bg-blue-300", 'dark:bg-blue-700');
            div.style.backgroundImage = "url(/img/Olympia_22_VCNV_keyword2.png)";
            div.style.backgroundSize = "cover";
          });
        }
        resetObstacleAnswerUI();
        if (!obstacleQuestion) {
          console.warn("ObstacleQuestion container not found.");
          return;
        }
        const obstacleAnswers = document.getElementById("ObstacleAnswers");
        for (let i = 0x1; i <= 0x4; i++) {
          obstacleAnswers.children[i - 0x1].classList.remove('brightness-50');
        }
        let questionText = '';
        let answerText = '';
        switch (currentRow) {
          case 0x1:
          case 0x2:
          case 0x3:
          case 0x4:
            questionText = questionData['HN' + currentRow]?.["cauhoi"] || "Câu hỏi HN" + currentRow + " không có dữ liệu";
            answerText = formatAnswerText(questionData['HN' + currentRow]?.['dapan'], currentRow);
            // toggleQuestionContainer(true);
            resetSlider();
            break;
          case 0x5:
            questionText = questionData.HNTT?.["cauhoi"] || "Câu hỏi HNTT không có dữ liệu";
            answerText = formatAnswerText(questionData.HNTT?.["dapan"], "trung tâm");
            // toggleQuestionContainer(true);
            resetSlider();
            break;
          default:
            answerText = "Câu hỏi";
            // toggleQuestionContainer(false);
            resetSlider();
            break;
        }
        function formatAnswerText(answer, row) {
          if (!answer) {
            return "Câu hỏi hàng ngang " + row + " không có dữ liệu";
          }
          answer = answer.replace(/\s/g, '');
          if (/^[0-9]+$/.test(answer)) {
            return "Câu hỏi hàng ngang " + row + " (" + answer.length + " chữ số)";
          } else {
            return /^[a-zA-Z]+$/.test(answer) ? "Câu hỏi hàng ngang " + row + " (" + answer.length + " chữ cái)" : "Câu hỏi hàng ngang " + row + " (" + answer.length + " ký tự)";
          }
        }
        if (currentRow !== 0x0) {
          const audioElement = document.getElementById("audio_ObstacleRowChoose");
          if (audioElement) {
            audioElement.currentTime = 0x0;
            audioElement.play();
          } else {
            console.warn("Audio element with id 'audio_ObstacleRowChoose' not found.");
          }
        }
        obstacleQuestion.textContent = questionText;
      });
      function toggleQuestionContainer(show) {
        const questionContainer = document.getElementById("ObstacleQuestionContainer");
        if (show === true) {
          questionContainer.classList.add("hidden");
          setTimeout(() => {
            questionContainer.classList.remove("hidden");
          }, 0x3e8);
        } else {
          questionContainer.classList.add("hidden");
        }
      }
      let disabledIds = [];
      disabledIdRef.on("value", disabledIdSnapshot => {
        disabledIds = [];
        disabledIdSnapshot.forEach(childSnapshot => {
          disabledIds.push(parseInt(childSnapshot.val(), 0xa));
        });
      });
      function startSlider(duration) {
        resetSlider();
        const slider = document.getElementById("ObstacleSlider");
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / duration, 0x1);
          slider.value = progress * 0x64;
          if (progress >= 0x1) {
            clearInterval(interval);
          }
        }, 0x10);
      }
      function resetSlider() {
        const slider = document.getElementById("ObstacleSlider");
        slider.value = 0x0;
      }
      vcnvStatusRef.on("value", vcnvStatusSnapshot => {
        const start = vcnvStatusSnapshot.val().batdau;
        if (start === 0x1) {
          document.getElementById("audio_ObstacleRowThinking").currentTime = 0x0;
          document.getElementById("audio_ObstacleRowThinking").play();
          startSlider(0x3a98);
        }
      });
      openAnswerRef.on("value", openAnswerSnapshot => {
        const openAnswer = openAnswerSnapshot.val().OpenAnswer;
        if (openAnswer === 0x1) {
          alreadyOpenRef.once('value').then(alreadyOpenSnapshot => {
            if (alreadyOpenSnapshot.val().status === true) {
              resetObstacleAnswerUI();
              return;
            }
            ;
            restoreObstacleAnswerUI();
            document.getElementById('audio_ObstacleAnswers').currentTime = 0x0;
            document.getElementById("audio_ObstacleAnswers").play();
          });
          document.getElementById("ObstacleMainUI").classList.add("hidden");
          document.getElementById('ObstacleAnswerUI').classList.remove('hidden');
        } else {
          document.getElementById("ObstacleMainUI").classList.remove("hidden");
          document.getElementById("ObstacleAnswerUI").classList.add("hidden");
        }
      });
      alreadyOpenRef.on('value', alreadyOpenSnapshot => {
        if (alreadyOpenSnapshot.val().status === true) {
          // document.getElementById("ObstacleQuestionContainer").classList.remove("questionAppearAnimation");
        } else {
          // document.getElementById("ObstacleQuestionContainer").classList.add("questionAppearAnimation");
        }
      });
      obstacleAnswersRef.orderByChild("timestamp").on('value', obstacleAnswersSnapshot => {
        const answers = {};
        obstacleAnswersSnapshot.forEach(childSnapshot => {
          const answerData = childSnapshot.val();
          const playerId = answerData.id;
          if (!answers[playerId] || answers[playerId].timestamp < answerData.timestamp) {
            answers[playerId] = answerData;
          }
        });
        for (let i = 0x1; i <= 0x4; i++) {
          const answerPlayer = document.getElementById("ObstacleAnswerPlayer" + i);
          if (answerPlayer) {
            const playerAnswer = answers[i] ? answers[i].answer : '';
            answerPlayer.textContent = '' + playerAnswer.toUpperCase();
          }
        }
      });
      answerCheckRef.on("value", answerCheckSnapshot => {
        if (answerCheckSnapshot.val().status === true) {
          const correctAnswerIds = answerCheckSnapshot.val().correctAnswerIds;
          const obstacleAnswers = document.getElementById("ObstacleAnswers");
          if (!correctAnswerIds || correctAnswerIds.length === 0x0) {
            for (let i = 0x0; i < obstacleAnswers.children.length; i++) {
              obstacleAnswers.children[i].classList.add("brightness-50");
            }
            document.getElementById('audio_ObstacleRowWrongAnswer').currentTime = 0x0;
            document.getElementById("audio_ObstacleRowWrongAnswer").play();
          } else {
            for (let i = 0x1; i <= 0x4; i++) {
              obstacleAnswers.children[i - 0x1].classList.remove('brightness-50');
              if (!correctAnswerIds.includes(i)) {
                obstacleAnswers.children[i - 0x1].classList.add("brightness-50");
              }
            }
            document.getElementById("audio_ObstacleRightAnswer").currentTime = 0x0;
            document.getElementById("audio_ObstacleRightAnswer").play();
          }
        }
      });
      let originalClasses = new WeakMap();
      function resetObstacleAnswerUI() {
        // const obstacleAnswerUI = document.getElementById("ObstacleAnswerUI");
        // if (!obstacleAnswerUI) {
        //   return;
        // }
        // obstacleAnswerUI.querySelectorAll('*').forEach(element => {
        //   originalClasses.set(element, [...element.classList]);
        //   element.classList.remove('leftName', "rightName", "leftAnswer", "rightAnswer", "verticalLineAppear");
        // });
      }
      function restoreObstacleAnswerUI() {
        const obstacleAnswerUI = document.getElementById('ObstacleAnswerUI');
        if (!obstacleAnswerUI) {
          return;
        }
        obstacleAnswerUI.querySelectorAll('*').forEach(element => {
          if (originalClasses.has(element)) {
            element.classList.add(...originalClasses.get(element));
          }
        });
        originalClasses = new WeakMap();
      }
      buzzerRef.orderByChild("timestamp").on("value", buzzerSnapshot => {
        const buzzerList = document.getElementById("ObstacleBuzzerList");
        const buzzerList2 = document.getElementById("ObstacleBuzzerList2");
        buzzerList.innerHTML = '';
        buzzerList2.innerHTML = '';
        let index = 0x0;
        buzzerSnapshot.forEach(childSnapshot => {
          const buzzerData = childSnapshot.val();
          const playerId = buzzerData.id;
          let buzzerIndex = index;
          index++;
          const playerRef = realtimeDB.ref(matchId + "/games/player" + playerId);
          playerRef.once("value", playerSnapshot => {
            const playerName = playerSnapshot.val().displayName;
            const buzzerDiv = document.createElement("div");
            buzzerDiv.className = "min-w-[15w] bg-defaultColor px-4 py-2 rounded-lg flex";
            const playerNameP = document.createElement('p');
            playerNameP.className = "text-white font-bold text-xl";
            playerNameP.textContent = buzzerIndex + 0x1 + ". " + playerName;
            buzzerDiv.appendChild(playerNameP);
            buzzerList.appendChild(buzzerDiv);
            buzzerList2.appendChild(buzzerDiv.cloneNode(true));
            const buzzerAudio = document.getElementById("audio_ObstacleAnswerBuzzer");
            if (buzzerAudio) {
              buzzerAudio.currentTime = 0x0;
              buzzerAudio.play();
            } else {
              console.warn("Audio element with id 'audio_ObstacleAnswerBuzzer' not found.");
            }
          });
        });
      });
      imageRef.getDownloadURL().then(url => {
        document.getElementById("ObstacleImage").src = url;
      });
      imageStatusRef.on("value", imageStatusSnapshot => {
        const imageOverlay = document.querySelector(".ObstacleImageOverlay");
        for (let i = 0x1; i <= 0x5; i++) {
          const imageStatus = imageStatusSnapshot.val()['HA' + i].status;
          const imageOverlayChild = imageOverlay.children[i - 0x1];
          if (imageStatus === 0x0) {
            imageOverlayChild.classList.remove("hidden");
          } else if (imageStatus === 0x1) {
            imageOverlayChild.classList.add('hidden');
            document.getElementById('audio_ObstacleImageShow').play();
          }
        }
      });
      audioRef.on("value", audioSnapshot => {
        const audioStatus = audioSnapshot.val().audio;
        if (audioStatus === 0x1) {
          document.getElementById("ObstacleAudio").currentTime = 0x0;
          document.getElementById("ObstacleAudio").play();
        } else {
          document.getElementById("ObstacleAudio").currentTime = 0x0;
          document.getElementById("ObstacleAudio").pause();
        }
      });
      firebase.storage().ref(matchId + "/audio/cnv/hn.mp3").getDownloadURL().then(url => {
        document.getElementById("ObstacleAudio").src = url;
      });
      countdownRef.on("value", countdownSnapshot => {
        const countdown = countdownSnapshot.val().countdown;
        if (countdown === 0x1) {
          document.getElementById("audio_ObstacleRowThinking").currentTime = 0x0;
          document.getElementById("audio_ObstacleRowThinking").play();
        }
      });
    });
});