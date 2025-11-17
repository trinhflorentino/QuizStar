// ================================================
// OBSTACLE GAME MODULE (Vượt Chướng Ngại Vật)
// ================================================
// This module handles the obstacle course game logic, including:
// - Question display and management
// - Player answers and buzzer system
// - Row status and animations
// - Audio/visual feedback
// - Timer and countdown functionality
// ================================================

auth.onAuthStateChanged(user => {
  if (!user) {
    return;
  }

  const userMatchDoc = firestoreDB.collection('match').doc(auth.currentUser.uid);
  
  userMatchDoc.onSnapshot(snapshot => {
    if (!snapshot.exists) {
      return;
    }

    const matchId = snapshot.data().match;
    
    // ================================================
    // FIREBASE REFERENCES SETUP
    // ================================================
    const refs = {
      question: realtimeDB.ref(`${matchId}/VCNVQuestion`),
      currentRow: realtimeDB.ref(`${matchId}/VCNV/hangngang`),
      roundStatus: realtimeDB.ref(`${matchId}/phanthistatus/vcnv`),
      gameStatus: realtimeDB.ref(`${matchId}/gamestatus/vcnv`),
      openAnswer: realtimeDB.ref(`${matchId}/VCNVOpenAnswer`),
      playerAnswers: realtimeDB.ref(`${matchId}/ObstacleAnswers`),
      rowStatus: realtimeDB.ref(`${matchId}/VCNVRowStatus`),
      answerCheck: realtimeDB.ref(`${matchId}/CompetitonAnswerCheckStatus/Obstacle`),
      buzzer: realtimeDB.ref(`${matchId}/ObstacleBuzzer`),
      imageStatus: realtimeDB.ref(`${matchId}/VCNVImageStatus`),
      openAllRows: realtimeDB.ref(`${matchId}/VCNVChuong/OpenAll`),
      disabledIds: realtimeDB.ref(`${matchId}/ObstacleDisabledId`),
      audio: realtimeDB.ref(`${matchId}/VCNVAudio`),
      countdown15s: realtimeDB.ref(`${matchId}/VCNV15sCountdown`),
      alreadyOpenAnswer: realtimeDB.ref(`${matchId}/AlreadyOpenAnswer`),
      competitionActive: realtimeDB.ref(`${matchId}/ObstacleCompetitionActive`),
      sounds: realtimeDB.ref(`${matchId}/Sounds`),
      questionMedia: realtimeDB.ref(`${matchId}/QuestionMedia`),
      audioControl: realtimeDB.ref(`${matchId}/AudioControl/obstacle`)
    };

    // ================================================
    // STATE VARIABLES
    // ================================================
    let questionData = null;
    let timerInterval = null;
    let disabledPlayerIds = [];
    let savedClassLists = new WeakMap();
    let playerNamesCache = {}; // Cache player names to avoid repeated DB calls

    // ================================================
    // OBS LAYOUT MANAGEMENT FUNCTION
    // ================================================
    /**
     * Apply obstacle UI layout based on overlay mode
     */
    function applyObstacleLayout(isOverlayMode) {
      const obstacleQuestionContainer = document.getElementById('ObstacleQuestionContainer');
      const obstacleGreenBox = document.getElementById('ObstacleGreenBox');
      const obstacleImageContainer = document.getElementById('ObstacleImageContainer');
      const obstacleRowContainer = document.getElementById('ObstacleRowContainer');
      const obstacleSection = document.getElementById('Obstacle');
      const obstacleMainUI = document.getElementById('ObstacleMainUI');
      const obstacleAnswerUI = document.getElementById('ObstacleAnswerUI');
      
      // Check nếu đang hiển thị Answer UI (đáp án thí sinh)
      const isShowingAnswers = obstacleAnswerUI && !obstacleAnswerUI.classList.contains('hidden');
      
      if (isOverlayMode) {
        // Overlay mode: Nền trong suốt, question box full width, hide green box, image và row
        console.log('Obstacle: Applying Overlay mode layout');
        
        // Set background to none (transparent) CHỈ KHI đang ở Main UI (câu hỏi)
        // Khi hiển thị Answer UI (đáp án), giữ nguyên background
        if (obstacleSection && !obstacleSection.classList.contains('hidden') && !isShowingAnswers) {
          document.body.style.background = 'none';
        }
        
        // Question container full width (remove margin-right)
        if (obstacleQuestionContainer) {
          obstacleQuestionContainer.style.marginRight = '0';
        }
        
        // Hide green box
        if (obstacleGreenBox) {
          obstacleGreenBox.classList.add('hidden');
        }
        
        // Hide image container
        if (obstacleImageContainer) {
          obstacleImageContainer.classList.add('hidden');
        }
        
        // Hide row container
        if (obstacleRowContainer) {
          obstacleRowContainer.classList.add('hidden');
        }
      } else {
        // Full screen mode: Restore normal layout
        console.log('Obstacle: Applying Full Screen mode layout');
        
        // Restore background
        if (obstacleSection && !obstacleSection.classList.contains('hidden')) {
          restoreBackground();
        }
        
        // Question container with margin (green box space)
        if (obstacleQuestionContainer) {
          obstacleQuestionContainer.style.marginRight = 'calc(49.78vh + 1rem)';
        }
        
        // Show green box
        if (obstacleGreenBox) {
          obstacleGreenBox.classList.remove('hidden');
        }
        
        // Show image container
        if (obstacleImageContainer) {
          obstacleImageContainer.classList.remove('hidden');
        }
        
        // Show row container
        if (obstacleRowContainer) {
          obstacleRowContainer.classList.remove('hidden');
        }
      }
    }

    // ================================================
    // QUESTION DATA LISTENER
    // ================================================
    refs.question.on("value", questionSnapshot => {
      questionData = questionSnapshot.val();
      const correctAnswer = questionSnapshot.val().CNV.cnv;
      const answerWithoutSpaces = correctAnswer.replace(/\s/g, '');
      
      // Determine character type for display
      const characterType = getCharacterType(answerWithoutSpaces);
      
      // Listen for when all rows are opened correctly
      refs.openAllRows.on("value", openAllSnapshot => {
        const openAllData = openAllSnapshot.val();
        
        if (openAllData.correct === 1) {
          // All rows answered correctly - show the answer
          document.getElementById("ObstacleCharacterCount").textContent = 
            `CHƯỚNG NGẠI VẬT: ${correctAnswer.toUpperCase()}`;
          
          playAudio('audio_ObstacleRight');
          document.getElementById("ObstacleQuestionContainer").classList.add("hidden");
          
          // Handle green screen mode
          const isGreenScreen = localStorage.getItem('isGreenScreenUI') === "true";
          if (isGreenScreen) {
            restoreBackground();
            document.getElementById("ObstacleRowContainer").classList.remove('hidden');
            document.getElementById('ObstacleImageContainer').classList.remove("hidden");
          }
        } else if (openAllData.correct === 2) {
          // Wrong answer
          playAudio('audio_ObstacleRowWrongAnswer');
        } else {
          // Show character count hint
          const characterCount = answerWithoutSpaces.length;
          document.getElementById("ObstacleCharacterCount").textContent = 
            `CHƯỚNG NGẠI VẬT CÓ ${characterCount}${characterType}`;
        }
      });
      
      // Render the obstacle rows
      renderObstacleRows();
      
      // Listen for row status changes
      refs.rowStatus.on("value", rowStatusSnapshot => {
        const rowStatuses = rowStatusSnapshot.val();
        renderObstacleRows(rowStatuses);
      });
    });

    // ================================================
    // UTILITY FUNCTIONS
    // ================================================
    
    /**
     * Determine if answer contains letters, numbers, or mixed characters
     */
    function getCharacterType(text) {
      if (/^[\p{L}]+$/u.test(text)) {
        return " CHỮ CÁI"; // Letters only
      } else if (/^\d+$/.test(text)) {
        return " CHỮ SỐ"; // Numbers only
      } else {
        return " KÝ TỰ"; // Mixed characters
      }
    }

    /**
     * Play audio element by ID
     */
    function playAudio(audioId) {
      const audioElement = document.getElementById(audioId);
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
      }
    }

    /**
     * Restore default background
     */
    function restoreBackground() {
      document.body.style.background = '';
      if (projectorConfigData && projectorConfigData.background) {
        applyStyle(document.body, "background", projectorConfigData.background);
      } else {
        applyStyle(document.body, "background", defaultConfig.background);
      }
    }

    /**
     * Render the 4 obstacle rows with their status
     */
    function renderObstacleRows(rowStatuses = {}) {
      const container = document.getElementById('obstacleContainer');
      container.innerHTML = '';
      
      const rowsWrapper = document.createElement("div");
      rowsWrapper.className = "flex flex-col space-y-4 mt-4";
      
      // Create 4 rows (HN1, HN2, HN3, HN4)
      for (let rowNum = 1; rowNum <= 4; rowNum++) {
        const rowKey = `HN${rowNum}`;
        const answer = questionData[rowKey]?.dapan?.replace(/\s/g, '');
        const status = rowStatuses[rowKey]?.status;
        
        if (!answer) {
          console.warn(`Answer for ${rowKey} is missing or invalid`);
          continue;
        }
        
        const rowContainer = createRowElement(rowNum, answer, status);
        rowsWrapper.appendChild(rowContainer);
      }
      
      container.appendChild(rowsWrapper);
    }

    /**
     * Create a single row element with circles for each character
     */
    function createRowElement(rowNum, answer, status) {
      const rowContainer = document.createElement("div");
      rowContainer.className = "flex justify-between items-start";
      
      // Character circles container
      const circlesContainer = document.createElement("div");
      circlesContainer.className = `flex flex-wrap gap-1 obstacle-row-${rowNum}`;
      circlesContainer.style.maxWidth = "calc(13 * 3.5rem)";
      
      // Create a circle for each character
      for (let char of answer) {
        const circle = createCharacterCircle(char, status);
        circlesContainer.appendChild(circle);
      }
      
      // Row number indicator
      const rowNumberContainer = createRowNumber(rowNum);
      
      rowContainer.appendChild(circlesContainer);
      rowContainer.appendChild(rowNumberContainer);
      
      return rowContainer;
    }

    /**
     * Create a circle element for a character
     */
    function createCharacterCircle(character, status) {
      const circle = document.createElement("div");
      
      // Set color based on status
      let circleClass;
      if (status === 1) {
        circleClass = "w-14 h-14 bg-green-700 border-4 border-white rounded-full flex items-center justify-center shadow-lg";
      } else if (status === 2) {
        circleClass = "w-14 h-14 bg-red-700 border-4 border-white rounded-full flex items-center justify-center shadow-lg";
      } else {
        circleClass = "w-14 h-14 bg-gray-300 border-4 border-white rounded-full flex items-center justify-center shadow-lg";
      }
      circle.className = circleClass;
      
      // Show character only if status is correct (1)
      const text = document.createElement("span");
      text.className = "text-2xl font-bold text-white";
      text.textContent = status === 1 ? character : '';
      circle.appendChild(text);
      
      return circle;
    }

    /**
     * Create row number indicator
     */
    function createRowNumber(rowNum) {
      const wrapper = document.createElement('div');
      wrapper.className = "w-14 flex justify-center ml-2";
      
      const numberCircle = document.createElement("div");
      numberCircle.className = "w-14 h-14 bg-white border-2 border-white rounded-full flex items-center justify-center shadow-lg";
      
      const numberText = document.createElement("span");
      numberText.className = "text-2xl font-bold text-black";
      numberText.textContent = rowNum;
      
      numberCircle.appendChild(numberText);
      wrapper.appendChild(numberCircle);
      
      return wrapper;
    }

    // ================================================
    // CURRENT ROW LISTENER
    // ================================================
    refs.currentRow.on("value", async currentRowSnapshot => {
      const currentRowNum = currentRowSnapshot.val().hn;
      const questionElement = document.getElementById("ObstacleQuestion");
      const rowElement = document.querySelector(`.obstacle-row-${currentRowNum}`);
      
      // Check và apply layout khi có câu hỏi mới (safety check)
      if (currentRowNum >= 1 && currentRowNum <= 5 && 
          window.obsIntegrationController && 
          window.obsIntegrationController.obsManager) {
        const currentScene = window.obsIntegrationController.obsManager.getCurrentScene();
        if (currentScene) {
          const isOverlayMode = currentScene === 'Overlay';
          applyObstacleLayout(isOverlayMode);
        }
      }
      
      window.stopCurrentQuestionAudio();
      
      // Reset all rows to default state when no row is selected
      if (currentRowNum === 0) {
        document.querySelectorAll(".obstacle-row-1, .obstacle-row-2, .obstacle-row-3, .obstacle-row-4")
          .forEach(row => {
            row.querySelectorAll('div').forEach(circle => {
              circle.classList.remove("bg-blue-300");
              circle.classList.add("bg-gray-300");
            });
          });
        window.stopCurrentQuestionAudio();
      }
      
      // Load question media (image)
      try {
        console.log(`Loading question media for HN${currentRowNum}`);
        const media = await getQuestionMedia("VCNVQuestion", `HN${currentRowNum}`, 1);
        await displayQuestionImage(
          media.image,
          document.getElementById('ObstacleQuestionImage'),
          document.getElementById("ObstacleMediaContainer")
        );
      } catch (error) {
        console.error("Error loading question media:", error);
      }
      
      // Highlight selected row
      if (rowElement) {
        rowElement.querySelectorAll('div').forEach(circle => {
          circle.classList.remove("bg-gray-300");
          circle.classList.add('bg-blue-700');
        });
      }
      
      // Restore animations
      restoreAnimations();
      
      if (!questionElement) {
        console.warn("ObstacleQuestion container not found.");
        return;
      }
      
      // Reset player answer brightness
      const answersContainer = document.getElementById("ObstacleAnswers");
      const playerLimit = getPlayerLimit();
      for (let playerId = 1; playerId <= playerLimit; playerId++) {
        answersContainer.children[playerId - 1].classList.remove('brightness-50');
      }
      
      // Get question and answer text
      const { questionText, answerHint } = getQuestionInfo(currentRowNum);
      
      // Show/hide question container with animation
      if (currentRowNum >= 1 && currentRowNum <= 5) {
        toggleQuestionContainer(true);
        resetSlider();
      } else {
        toggleQuestionContainer(false);
        resetSlider();
      }
      
      // Text-to-speech if enabled
      refs.sounds.on('value', soundsSnapshot => {
        const soundsData = soundsSnapshot.val();
        if (soundsData?.EnglishVoice && questionText) {
          refs.gameStatus.once("value", gameStatusSnapshot => {
            if (gameStatusSnapshot.val().vcnv === 1) {
              speakText(questionText);
            }
          });
        }
      });
      
      // Play row selection sound
      if (currentRowNum !== 0) {
        playAudio("audio_ObstacleRowChoose");
      }
      
      // Display question text
      questionElement.textContent = questionText;
    });

    /**
     * Get question text and answer hint based on row number
     */
    function getQuestionInfo(rowNum) {
      let questionText = '';
      let answerHint = '';
      
      switch (rowNum) {
        case 1:
        case 2:
        case 3:
        case 4:
          questionText = questionData[`HN${rowNum}`]?.cauhoi || 
            `Câu hỏi HN${rowNum} không có dữ liệu`;
          answerHint = formatAnswerHint(questionData[`HN${rowNum}`]?.dapan, rowNum);
          break;
        case 5:
          questionText = questionData.HNTT?.cauhoi || 
            "Câu hỏi HNTT không có dữ liệu";
          answerHint = formatAnswerHint(questionData.HNTT?.dapan, "trung tâm");
          break;
        default:
          answerHint = "Câu hỏi";
          break;
      }
      
      return { questionText, answerHint };
    }

    /**
     * Format answer hint text with character count
     */
    function formatAnswerHint(answer, rowIdentifier) {
      if (!answer) {
        return `Câu hỏi hàng ngang ${rowIdentifier} không có dữ liệu`;
      }
      
      const answerNoSpaces = answer.replace(/\s/g, '');
      const length = answerNoSpaces.length;
      
      if (/^[0-9]+$/.test(answerNoSpaces)) {
        return `Câu hỏi hàng ngang ${rowIdentifier} (${length} chữ số)`;
      } else if (/^[a-zA-Z]+$/.test(answerNoSpaces)) {
        return `Câu hỏi hàng ngang ${rowIdentifier} (${length} chữ cái)`;
      } else {
        return `Câu hỏi hàng ngang ${rowIdentifier} (${length} ký tự)`;
      }
    }

    /**
     * Show or hide question container with animation
     */
    function toggleQuestionContainer(shouldShow) {
      const container = document.getElementById("ObstacleQuestionContainer");
      
      if (shouldShow === true) {
        container.classList.add("hidden");
        setTimeout(() => {
          container.classList.remove("hidden");
        }, 1000);
      } else {
        container.classList.add('hidden');
      }
    }

    // ================================================
    // DISABLED PLAYERS LISTENER
    // ================================================
    refs.disabledIds.on('value', disabledSnapshot => {
      disabledPlayerIds = [];
      disabledSnapshot.forEach(child => {
        disabledPlayerIds.push(parseInt(child.val(), 10));
      });
    });

    // ================================================
    // TIMER FUNCTIONS
    // ================================================
    
    /**
     * Start countdown timer animation
     */
    function startTimer(durationMs) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      resetSlider();
      
      const sliderElement = document.getElementById('ObstacleSlider');
      const startTime = Date.now();
      
      timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        sliderElement.value = progress * 100;
        
        if (progress >= 1) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }, 16); // ~60fps
    }

    /**
     * Reset slider to 0
     */
    function resetSlider() {
      const sliderElement = document.getElementById('ObstacleSlider');
      sliderElement.value = 0;
    }

    // ================================================
    // ROUND STATUS LISTENER (Start thinking time)
    // ================================================
    refs.roundStatus.on("value", roundStatusSnapshot => {
      const shouldStart = roundStatusSnapshot.val().batdau;
      const isGreenScreen = localStorage.getItem("isGreenScreenUI") === "true";
      
      if (shouldStart === 1) {
        playAudio('audio_ObstacleRowThinking');
        startTimer(15000); // 15 seconds
        
        // if (isGreenScreen) {
        //   document.body.style.background = "none";
        //   document.getElementById("ObstacleRowContainer").classList.add("hidden");
        //   document.getElementById('ObstacleImageContainer').classList.add("hidden");
        // }
      }
    });

    // ================================================
    // OPEN ANSWER LISTENER
    // ================================================
    refs.openAnswer.on("value", openAnswerSnapshot => {
      const shouldOpenAnswer = openAnswerSnapshot.val().OpenAnswer;
      const isGreenScreen = localStorage.getItem('isGreenScreenUI') === "true";
      
      if (shouldOpenAnswer === 1) {
        // Check if answer was already opened
        refs.alreadyOpenAnswer.once('value').then(alreadyOpenSnapshot => {
          const wasAlreadyOpened = alreadyOpenSnapshot.val().status === true;
          
          if (wasAlreadyOpened) {
            // Đã mở đáp án trước đó → KHÔNG có hiệu ứng, KHÔNG play audio
            console.log('Answers already opened before - skipping animation and audio');
            // Đợi DOM render xong rồi mới remove animation
            setTimeout(() => {
              removeAnimations();
            }, 100);
          } else {
            // Lần đầu mở đáp án → CÓ hiệu ứng, CÓ audio
            console.log('First time opening answers - playing animation and audio');
            playAudio("audio_ObstacleAnswers");
          }
        });
        
        // Hiển thị Answer UI
        document.getElementById('ObstacleMainUI').classList.add("hidden");
        document.getElementById('ObstacleAnswerUI').classList.remove("hidden");
        
        // Restore background khi hiển thị đáp án (vì đáp án cần có background)
        restoreBackground();
        
        if (isGreenScreen) {
          document.getElementById("ObstacleRowContainer").classList.remove("hidden");
          document.getElementById('ObstacleImageContainer').classList.remove("hidden");
        }
        
        // Sau đó mới chuyển sang scene Overlay (để applyObstacleLayout có thể detect Answer UI)
        setTimeout(() => {
          if (window.obsIntegrationController && 
              window.obsIntegrationController.obsManager && 
              window.obsIntegrationController.obsManager.isConnectedToOBS()) {
            console.log('Opening answers: Switching to Overlay scene');
            window.obsIntegrationController.obsManager.switchScene('Overlay');
          }
        }, 100);
      } else {
        // Đóng đáp án → chuyển sang scene VCNV và hiển thị green box
        if (window.obsIntegrationController && 
            window.obsIntegrationController.obsManager && 
            window.obsIntegrationController.obsManager.isConnectedToOBS()) {
          console.log('Closing answers: Switching to VCNV scene');
          window.obsIntegrationController.obsManager.switchScene('VCNV');
        }
        
        document.getElementById('ObstacleMainUI').classList.remove("hidden");
        document.getElementById("ObstacleAnswerUI").classList.add('hidden');
        
        // Restore animation classes khi đóng đáp án (để lần mở tiếp theo vẫn có hiệu ứng)
        restoreAnimations();
      }
    });

    // ================================================
    // ALREADY OPENED ANSWER LISTENER
    // ================================================
    refs.alreadyOpenAnswer.on("value", alreadyOpenSnapshot => {
      const questionContainer = document.getElementById("ObstacleQuestionContainer");
      const questionText = document.getElementById("ObstacleQuestion");
      
      if (alreadyOpenSnapshot.val().status === true) {
        // Đã mở đáp án → remove animation cho container và text
        questionContainer.classList.remove("questionAppearAnimation");
        questionText.classList.remove("opacityAnimation");
      } else {
        // Chưa mở đáp án → có animation
        questionContainer.classList.add("questionAppearAnimation");
        questionText.classList.add("opacityAnimation");
      }
    });

    // ================================================
    // PLAYER ANSWERS LISTENER
    // ================================================
    refs.playerAnswers.orderByChild('timestamp').on('value', answersSnapshot => {
      // Get latest answer for each player
      const latestAnswers = {};
      
      answersSnapshot.forEach(child => {
        const answerData = child.val();
        const playerId = answerData.id;
        
        if (!latestAnswers[playerId] || 
            latestAnswers[playerId].timestamp < answerData.timestamp) {
          latestAnswers[playerId] = answerData;
        }
      });
      
      // Display answers and player names
      const playerLimit = getPlayerLimit();
      for (let playerId = 1; playerId <= playerLimit; playerId++) {
        const answerElement = document.getElementById(`ObstacleAnswerPlayer${playerId}`);
        const nameElement = document.getElementById(`ObstacleAnswerPlayerName${playerId}`);
        
        if (answerElement) {
          const answer = latestAnswers[playerId] ? latestAnswers[playerId].answer : '';
          answerElement.textContent = answer.toUpperCase();
        }
        
        // Get and display player name (with caching)
        if (nameElement) {
          if (playerNamesCache[playerId]) {
            // Use cached name
            nameElement.textContent = playerNamesCache[playerId];
          } else {
            // Fetch name from database and cache it
            const playerRef = realtimeDB.ref(`${matchId}/games/player${playerId}`);
            playerRef.once("value", playerSnapshot => {
              if (playerSnapshot.exists()) {
                const playerName = playerSnapshot.val().displayName || `Player ${playerId}`;
                playerNamesCache[playerId] = playerName; // Cache for future use
                nameElement.textContent = playerName;
              } else {
                nameElement.textContent = '';
              }
            });
          }
        }
      }
    });

    // ================================================
    // ANSWER CHECK LISTENER
    // ================================================
    refs.answerCheck.on("value", answerCheckSnapshot => {
      if (!answerCheckSnapshot.exists()) {
        return;
      }
      
      if (answerCheckSnapshot.val().status === true) {
        const correctAnswerIds = answerCheckSnapshot.val().correctAnswerIds;
        const answersContainer = document.getElementById("ObstacleAnswers");
        
        if (!correctAnswerIds || correctAnswerIds.length === 0) {
          // No correct answers - dim all
          for (let i = 0; i < answersContainer.children.length; i++) {
            answersContainer.children[i].classList.add('brightness-50');
          }
          playAudio("audio_ObstacleRowWrongAnswer");
        } else {
          // Dim incorrect answers
          const playerLimit = getPlayerLimit();
          for (let playerId = 1; playerId <= playerLimit; playerId++) {
            answersContainer.children[playerId - 1].classList.remove("brightness-50");
            
            if (!correctAnswerIds.includes(playerId)) {
              answersContainer.children[playerId - 1].classList.add("brightness-50");
            }
          }
          playAudio("audio_ObstacleRightAnswer");
        }
        
        document.getElementById("ObstacleQuestionContainer").classList.add("hidden");
      }
    });

    // ================================================
    // ANIMATION MANAGEMENT
    // ================================================
    
    /**
     * Remove animations from answer UI
     */
    function removeAnimations() {
      const answerUI = document.getElementById("ObstacleAnswerUI");
      if (!answerUI) return;
      
      answerUI.querySelectorAll('*').forEach(element => {
        savedClassLists.set(element, [...element.classList]);
        element.classList.remove(
          "leftName", "rightName", "leftAnswer", 
          "rightAnswer", 'verticalLineAppear'
        );
      });
    }

    /**
     * Restore animations to answer UI
     */
    function restoreAnimations() {
      const answerUI = document.getElementById('ObstacleAnswerUI');
      if (!answerUI) return;
      
      answerUI.querySelectorAll('*').forEach(element => {
        if (savedClassLists.has(element)) {
          element.classList.add(...savedClassLists.get(element));
        }
      });
      
      savedClassLists = new WeakMap();
    }

    // ================================================
    // BUZZER LISTENER
    // ================================================
    refs.buzzer.on('value', buzzerSnapshot => {
      const buzzerList1 = document.getElementById("ObstacleBuzzerList");
      const buzzerList2 = document.getElementById("ObstacleBuzzerList2");
      
      buzzerList1.innerHTML = '';
      buzzerList2.innerHTML = '';
      
      // Collect and sort buzzer entries by timestamp
      const buzzerEntries = [];
      buzzerSnapshot.forEach(child => {
        const data = child.val();
        buzzerEntries.push({
          key: child.key,
          id: data.id,
          timestamp: data.timestamp
        });
      });
      
      buzzerEntries.sort((a, b) => a.timestamp - b.timestamp);
      
      // Display buzzer list
      buzzerEntries.forEach((entry, index) => {
        const playerRef = realtimeDB.ref(`${matchId}/games/player${entry.id}`);
        
        playerRef.once("value", playerSnapshot => {
          const playerName = playerSnapshot.val().displayName;
          
          const buzzerItem = document.createElement("div");
          buzzerItem.className = "min-w-[15w] px-4 py-2 rounded-lg flex obstaclePlayerSolve";
          
          const text = document.createElement('p');
          text.className = "text-white font-bold text-xl";
          text.textContent = `${index + 1}. ${playerName}`;
          
          buzzerItem.appendChild(text);
          buzzerList1.appendChild(buzzerItem);
          buzzerList2.appendChild(buzzerItem.cloneNode(true));
          
          // Apply styling
          if (projectorConfigData.obstaclePlayerSolveContainer === '' || 
              projectorConfigData.obstaclePlayerSolveContainer === undefined) {
            applyStyle(
              getElement(".obstaclePlayerSolve"), 
              "background", 
              defaultConfig.obstaclePlayerSolveContainer
            );
          } else {
            applyStyle(
              getElement(".obstaclePlayerSolve"), 
              "background", 
              projectorConfigData.obstaclePlayerSolveContainer
            );
          }
          
          playAudio("audio_ObstacleAnswerBuzzer");
        });
      });
    });

    // ================================================
    // QUESTION MEDIA LISTENER
    // ================================================
    refs.questionMedia.on("value", async questionMediaSnapshot => {
      try {
        const media = await getQuestionMedia("VCNVQuestion", "CNV", 'background');
        await displayQuestionImage(
          media.image,
          document.getElementById("ObstacleImage")
        );
      } catch (error) {
        console.error("Error displaying question image:", error);
      }
    });

    // ================================================
    // IMAGE STATUS LISTENER (5 image overlays)
    // ================================================
    refs.imageStatus.on("value", imageStatusSnapshot => {
      const overlayContainer = document.querySelector(".ObstacleImageOverlay");
      
      for (let imageNum = 1; imageNum <= 5; imageNum++) {
        const imageKey = `HA${imageNum}`;
        const imageStatus = imageStatusSnapshot.val()[imageKey].status;
        const overlayElement = overlayContainer.children[imageNum - 1];
        
        if (imageStatus === 0) {
          // Hide overlay (keep image covered)
          overlayElement.classList.remove("hidden");
        } else if (imageStatus === 1) {
          // Show overlay (reveal image)
          overlayElement.classList.add("hidden");
          
          refs.openAllRows.once("value").then(openAllSnapshot => {
            if (openAllSnapshot.val().correct != 1) {
              playAudio("audio_ObstacleImageShow");
            }
          });
        }
      }
    });

    // ================================================
    // AUDIO CONTROL LISTENER
    // ================================================
    refs.audio.on("value", audioSnapshot => {
      const shouldPlayAudio = audioSnapshot.val().audio;
      const audioElement = document.getElementById('ObstacleAudio');
      
      if (shouldPlayAudio === 1) {
        audioElement.currentTime = 0;
        audioElement.play();
      } else {
        audioElement.currentTime = 0;
        audioElement.pause();
      }
    });

    // ================================================
    // 15-SECOND COUNTDOWN LISTENER
    // ================================================
    refs.countdown15s.on("value", countdownSnapshot => {
      const shouldCountdown = countdownSnapshot.val().countdown;
      
      if (shouldCountdown === 1) {
        playAudio("audio_ObstacleRowThinking");
      }
    });

    // ================================================
    // COMPETITION ACTIVE LISTENER
    // ================================================
    refs.competitionActive.on('value', async competitionSnapshot => {
      if (!competitionSnapshot.exists()) {
        return;
      }
      
      const isActive = competitionSnapshot.val().status;
      
      if (isActive === true) {
        setTimeout(() => {
          document.getElementById('Title').classList.add("hidden");
          document.getElementById("Obstacle").classList.remove("hidden");
        }, 200);
        
        playAudio('audio_ObstacleRowShow');
        document.body.style.background = '';
        
        if (projectorConfigData && projectorConfigData.background) {
          applyStyle(document.body, "background", projectorConfigData.background);
        } else {
          applyStyle(document.body, "background", defaultConfig.background);
        }

        try {
          const media = await getQuestionMedia("VCNVQuestion", "CNV", "background");
          await displayQuestionImage(
            media.image,
            document.getElementById("ObstacleImage")
          );
        } catch (error) {
          console.error("Error displaying question image:", error);
        }
      } else {
        document.getElementById("Obstacle").classList.add("hidden");
      }
    });

    // ================================================
    // QUESTION AUDIO CONTROL
    // ================================================
    refs.audioControl.on("value", audioControlSnapshot => {
      const audioData = audioControlSnapshot.val();
      
      if (!audioData || !audioData.audioData) {
        return;
      }
      
      if (audioData.isPlaying) {
        window.stopCurrentQuestionAudio();
        setTimeout(() => {
          playQuestionAudio(audioData.audioData);
        }, 100);
      } else {
        window.stopCurrentQuestionAudio();
      }
    });

    // ================================================
    // OBS SCENE CHANGE LISTENER (Overlay Mode)
    // ================================================
    // Listen to scene changes
    window.addEventListener('obsSceneChanged', (event) => {
      const { isOverlayMode, sceneName } = event.detail;
      console.log(`Obstacle received scene change event: ${sceneName}, isOverlay: ${isOverlayMode}`);
      applyObstacleLayout(isOverlayMode);
    });
    
    // Check current scene when Obstacle section becomes active
    refs.competitionActive.on('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val().status === true) {
        // Obstacle section is now active, check current OBS scene
        setTimeout(() => {
          if (window.obsIntegrationController && 
              window.obsIntegrationController.obsManager) {
            const currentScene = window.obsIntegrationController.obsManager.getCurrentScene();
            if (currentScene) {
              const isOverlayMode = currentScene === 'Overlay';
              console.log(`Obstacle activated: Checking current scene: ${currentScene}, isOverlay: ${isOverlayMode}`);
              applyObstacleLayout(isOverlayMode);
            } else {
              console.log('Obstacle activated: No current scene detected, using default layout');
            }
          } else {
            console.log('Obstacle activated: OBS Integration not available');
          }
        }, 500);
      }
    });
  });
});
