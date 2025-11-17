// ================================================
// PROJECTOR UI MODULE
// ================================================
// This module handles the projector display UI including:
// - Responsive UI updates (compact vs normal mode)
// - Game state management and screen transitions
// - Competition title display
// - Background audio management
// - Player limit handling
// ================================================

const isCompactUI = localStorage.getItem("isCompactUI") === "true";

// ================================================
// UI UPDATE FUNCTION
// ================================================
/**
 * Updates UI layout based on compact mode setting
 * Applies different styles for compact (smaller) vs normal (larger) display
 */
function updateUI() {
  // ================================================
  // DOM ELEMENT REFERENCES
  // ================================================
  
  // Start I elements
  const startIQuestionContainer = document.getElementById('StartIQuestionContainer');
  const startIQuestionNumber = document.getElementById('StartIQuestionNumber');
  const startIQuestion = document.getElementById('StartIQuestion');
  const startIQuestionContentLayout = document.getElementById("StartIQuestionContentLayout");
  const startIQuestionImage = document.getElementById("StartIQuestionImage");
  const startISection = document.getElementById("StartI");
  const startICountdown = document.getElementById('StartICountdown');
  
  // Start II elements
  const startIIQuestionContainer = document.getElementById("StartIIQuestionContainer");
  const startIIQuestionNumber = document.getElementById("StartIIQuestionNumber");
  const startIIQuestion = document.getElementById("StartIIQuestion");
  const startIIQuestionContentLayout = document.getElementById("StartIIQuestionContentLayout");
  const startIIQuestionImage = document.getElementById("StartIIQuestionImage");
  const startIISection = document.getElementById('StartII');
  const startIICountdown = document.getElementById("StartIICountdown");
  
  // Finish elements
  const finishQuestionPackSelectionContainer = document.getElementById("FinishQuestionPackSelectionContainer");
  const finishQuestionPack10 = document.getElementById("FinishQuestionPack10");
  const finishQuestionPack20 = document.getElementById("FinishQuestionPack20");
  const finishQuestionPack30 = document.getElementById("FinishQuestionPack30");
  const finishContainerLayout = document.getElementById("FinishContainerLayout");
  const finishQuestionContainer = document.getElementById("FinishQuestionContainer");
  const finishQuestionContentLayout = document.getElementById("FinishQuestionContentLayout");
  const finishQuestion = document.getElementById("FinishQuestion");
  const finishQuestionImage = document.getElementById("FinishQuestionImage");
  const finishStar = document.getElementById("FinishStar");
  const finishCountdown = document.getElementById("FinishCountdown");
  const finishPlayerSelectingPointContainer = document.getElementById("FinishPlayerSelectingPointContainer");
  
  // Additional question elements
  const additionalContainerLayout = document.getElementById('AdditionalContainerLayout');
  const additionalQuestionContainer = document.getElementById('AdditionalQuestionContainer');
  const additionalQuestion = document.getElementById("AdditionalQuestion");
  const additionalQuestionNumberContainer = document.getElementById("AdditionalQuestionNumberContainer");
  const additionalQuestionContentLayout = document.getElementById("AdditionalQuestionContentLayout");
  const additionalQuestionImage = document.getElementById("AdditionalQuestionImage");
  
  // Point summary elements
  const pointSummarySection = document.getElementById("PointSummary");
  const pointSummaryRankingContainer = document.getElementById("PointSummaryRankingContainer");
  const pointSummaryPlayerRank = document.getElementById("PointSummaryPlayerRank");
  const pointSummaryRankLabel = document.getElementById("PointSummaryRankLabel");
  const pointSummaryPlayerContainer = document.getElementById("PointSummaryPlayerContainer");
  const pointSummaryPlayerName = document.getElementById("PointSummaryPlayerName");
  const pointSummaryPlayerPointContainer = document.getElementById("PointSummaryPlayerPointContainer");
  const pointSummaryPlayerPoint = document.getElementById("PointSummaryPlayerPoint");
  
  // Player containers
  const startPlayerContainer = document.getElementById("startPlayerContainer");
  const startIIPlayerContainer = document.getElementById('startIIPlayerContainer');

  // ================================================
  // APPLY COMPACT UI STYLES
  // ================================================
  if (isCompactUI) {
    // Start I - Compact mode
    startISection?.classList.add("items-end");
    startIQuestionNumber?.classList.add("text-sm");
    startIQuestion?.classList.add("text-xl");
    startIQuestionImage?.classList.add('max-w-sm', 'max-h-32');
    startIQuestionContentLayout?.classList.add("flex-row");
    startICountdown?.classList.add('text-[8rem]');
    
    // Start II - Compact mode
    startIISection?.classList.add('items-end');
    startIIQuestionNumber?.classList.add('text-sm');
    startIIQuestion?.classList.add('text-xl');
    startIIQuestionImage?.classList.add('max-w-sm', "max-h-32");
    startIIQuestionContentLayout?.classList.add('flex-row');
    startIICountdown?.classList.add("text-[8rem]");
    
    // Player containers - Compact mode
    startPlayerContainer?.classList.add("gap-2");
    startIIPlayerContainer?.classList.add("gap-2");
    
    // Finish - Compact mode
    finishQuestionPackSelectionContainer?.classList.add("justify-end");
    finishContainerLayout?.classList.add("items-end");
    finishQuestionContainer?.classList.add('min-h-[14.5vw]');
    finishQuestionContentLayout?.classList.add("flex-row");
    finishQuestion?.classList.add("text-xl");
    finishQuestionImage?.classList.add("max-w-sm", "max-h-32");
    finishCountdown?.classList.add("text-[8rem]");
    finishPlayerSelectingPointContainer?.classList.add("w-[28vh]", "h-[9.2vw]");
    finishStar?.classList.add("absolute", "right-0");
    
    // Additional - Compact mode
    additionalContainerLayout?.classList.add("items-end");
    additionalQuestionContainer?.classList.add("min-h-[13.5vw]");
    additionalQuestion?.classList.add("text-xl");
    additionalQuestionContentLayout?.classList.add("flex-row");
    additionalQuestionImage?.classList.add('max-w-sm', "max-h-32");
    additionalQuestionNumberContainer.classList.add("w-[15vw]", 'h-[13.5vw]');
    
    // Point Summary - Compact mode
    pointSummarySection?.classList.add('items-end');
    pointSummaryRankingContainer?.classList.add("min-h-[6vw]", "w-[9vw]");
    pointSummaryPlayerContainer?.classList.add('min-h-[6vw]', "w-[25vw]");
    pointSummaryPlayerRank?.classList.add("text-2xl", "font-bold");
    pointSummaryRankLabel?.classList.add("text-sm", "font-medium");
    pointSummaryPlayerName?.classList.add("text-2xl", "font-semibold");
    pointSummaryPlayerPointContainer?.classList.add("min-h-[8vw]", "w-[35vw]");
    pointSummaryPlayerPoint?.classList.add("text-5xl", "font-bold");
    
    // Finish question packs - Compact mode
    [finishQuestionPack10, finishQuestionPack20, finishQuestionPack30].forEach(pack => {
      if (pack) {
        pack.classList.add('w-1/4', "min-h-14");
        
        const packText = pack.querySelector('p');
        if (packText) {
          packText.classList.add("text-3xl");
        }
        
        const checkboxes = pack.querySelectorAll("input[type=\"checkbox\"]");
        checkboxes.forEach(checkbox => {
          checkbox.classList.add("w-8", "h-8");
        });
      }
    });
  } 
  // ================================================
  // APPLY NORMAL UI STYLES
  // ================================================
  else {
    // Start I - Normal mode
    startISection?.classList.add("items-center");
    startIQuestionContainer?.classList.add("min-h-[76vh]");
    startIQuestionNumber?.classList.add('text-xl');
    startIQuestion?.classList.add("text-4xl");
    startIQuestionImage?.classList.add("max-w-full", "max-h-96");
    startIQuestionContentLayout?.classList.add('flex-col');
    startPlayerContainer?.classList.add('gap-6');
    startICountdown?.classList.add("text-[16rem]");
    
    // Start II - Normal mode
    startIISection?.classList.add("items-center");
    startIIQuestionContainer?.classList.add("min-h-[76vh]");
    startIIQuestionNumber?.classList.add("text-xl");
    startIIQuestion?.classList.add("text-4xl");
    startIIQuestionImage?.classList.add("max-w-full", "max-h-96");
    startIIQuestionContentLayout?.classList.add('flex-col');
    startIIPlayerContainer?.classList.add("gap-6");
    startIICountdown?.classList.add("text-[16rem]");
    
    // Finish - Normal mode
    finishQuestionPackSelectionContainer?.classList.add("justify-center");
    finishQuestionContainer?.classList.add("min-h-[85vh]");
    finishQuestionContentLayout?.classList.add("flex-col");
    finishQuestion?.classList.add("text-4xl");
    finishQuestionImage?.classList.add("max-w-full", "max-h-96");
    finishCountdown?.classList.add("text-[16rem]");
    finishPlayerSelectingPointContainer?.classList.add("w-[30vh]", "h-[24vh]");
    
    // Additional - Normal mode
    additionalQuestionContainer?.classList.add("min-h-[85vh]");
    additionalQuestion?.classList.add('text-4xl');
    additionalQuestionNumberContainer.classList.add('w-[30vh]', "h-[24vh]");
    additionalQuestionContentLayout?.classList.add("flex-col");
    additionalQuestionImage?.classList.add("max-w-full", "max-h-96");
    
    // Point Summary - Normal mode
    pointSummarySection?.classList.add("items-center");
    pointSummaryRankingContainer?.classList.add("min-h-[10vw]", "w-[12vw]");
    pointSummaryPlayerContainer?.classList.add("min-h-[10vw]", "w-[35vw]");
    pointSummaryPlayerRank?.classList.add('text-4xl');
    pointSummaryRankLabel?.classList.add('text-lg');
    pointSummaryPlayerName?.classList.add('text-4xl');
    pointSummaryPlayerPointContainer?.classList.add("min-h-[12vw]", "w-[48vw]");
    pointSummaryPlayerPoint?.classList.add("text-8xl");
    
    // Finish question packs - Normal mode
    [finishQuestionPack10, finishQuestionPack20, finishQuestionPack30].forEach(pack => {
      if (pack) {
        pack.classList.add("w-1/2", "min-h-36");
        
        const packText = pack.querySelector('p');
        if (packText) {
          packText.classList.add("text-5xl");
        }
        
        const checkboxes = pack.querySelectorAll("input[type=\"checkbox\"]");
        checkboxes.forEach(checkbox => {
          checkbox.classList.add("w-10", "h-10");
        });
      }
    });
  }
}

// Initialize UI after a short delay
setTimeout(() => {
  updateUI();
}, 100);

// ================================================
// MAIN AUTH STATE LISTENER
// ================================================
auth.onAuthStateChanged(async user => {
  if (!user) {
    return;
  }

  const userMatchDoc = firestoreDB.collection('match').doc(user.uid);
  
  userMatchDoc.onSnapshot(async snapshot => {
    if (!snapshot.exists) {
      return;
    }

    const matchId = snapshot.data().match;
    
    // Firebase references
    const gameStatusRef = realtimeDB.ref(`${matchId}/gamestatus`);
    const hostIdRef = realtimeDB.ref(`${matchId}/hostid`);
    
    // State variables
    let shouldDisplayCompetitionName = true;
    const isGreenScreen = localStorage.getItem("isGreenScreenUI") === "true";

    // ================================================
    // LOAD PROJECTOR CONFIG
    // ================================================
    /**
     * Loads projector configuration to determine if competition name should be displayed
     */
    async function loadProjectorConfig() {
      try {
        const hostIdSnapshot = await hostIdRef.once("value");
        const hostId = hostIdSnapshot.val();
        
        if (hostId) {
          const projectorConfigDoc = firestoreDB.collection("projectorConfig").doc(hostId);
          
          projectorConfigDoc.onSnapshot(configSnapshot => {
            if (configSnapshot.exists) {
              const configData = configSnapshot.data();
              
              if (configData.displayCompetitionName !== undefined) {
                shouldDisplayCompetitionName = configData.displayCompetitionName && !isGreenScreen;
              } else {
                shouldDisplayCompetitionName = !isGreenScreen;
              }
            } else {
              shouldDisplayCompetitionName = !isGreenScreen;
            }
            
            updateCompetitionTitle(currentGameState);
          });
        }
      } catch (error) {
        console.error("Error fetching projector config:", error);
      }
    }

    // ================================================
    // AUDIO MANAGEMENT
    // ================================================
    /**
     * Manages background audio for different competition stages
     * Only one audio plays at a time
     */
    function manageBackgroundAudio(audioIdToPlay) {
      const audioIds = [
        'audio_StartingStart',
        "audio_ObstacleStart",
        "audio_AccelerationStart",
        'audio_FinishStart',
        'audio_PointSummary'
      ];
      
      audioIds.forEach(audioId => {
        const audioElement = document.getElementById(audioId);
        if (audioElement) {
          if (audioId === audioIdToPlay) {
            audioElement.play().catch(error => 
              console.error(`Error playing ${audioId}:`, error)
            );
          } else {
            audioElement.pause();
            audioElement.currentTime = 0;
          }
        }
      });
    }

    // ================================================
    // COMPETITION TITLE UPDATE
    // ================================================
    /**
     * Updates the competition title based on current game state
     */
    function updateCompetitionTitle(gameState) {
      const titleElement = document.getElementById("CompetitionTitle");
      
      if (!shouldDisplayCompetitionName) {
        titleElement.innerHTML = '';
        titleElement.classList.add('hidden');
        return;
      }
      
      // Determine title based on active competition
      if (gameState.startI === 1 || gameState.startII === 1) {
        titleElement.innerHTML = "KHỞI ĐỘNG";
      } else if (gameState.obstacle === 1) {
        titleElement.innerHTML = "<span style='font-size: 1.0em'>VƯỢT</span> <br/> CHƯỚNG NGẠI VẬT";
      } else if (gameState.acceleration === 1) {
        titleElement.innerHTML = "TĂNG TỐC";
      } else if (gameState.finish === 1) {
        titleElement.innerHTML = "VỀ ĐÍCH";
      } else if (gameState.additional === 1) {
        titleElement.innerHTML = "CÂU HỎI PHỤ";
      } else {
        titleElement.innerHTML = '';
      }
      
      titleElement.classList.remove('hidden');
    }

    // ================================================
    // SCREEN VISIBILITY MANAGEMENT
    // ================================================
    /**
     * Controls which screens are visible based on game state
     */
    function updateScreenVisibility(gameState) {
      const olympiaMatchNameElement = document.getElementById("OlympiaMatchName");
      const titleScreen = document.getElementById("Title");
      const bannerScreen = document.getElementById("Banner");
      const pointSummaryScreen = document.getElementById("PointSummary");
      
      // Default: show title screen, hide others
      titleScreen.classList.remove("hidden");
      bannerScreen.classList.add("hidden");
      pointSummaryScreen.classList.add("hidden");
      
      adjustTitleFontSize('');
      
      let audioToPlay = null;
      
      // Show/hide Olympia match name
      if (gameState.all === true && shouldDisplayCompetitionName) {
        olympiaMatchNameElement.classList.remove("hidden");
      } else {
        olympiaMatchNameElement.classList.add("hidden");
      }
      
      // Show banner screen
      if (gameState.banner === 1) {
        bannerScreen.classList.remove("hidden");
        titleScreen.classList.add("hidden");
      }
      
      // Show point summary screen
      if (gameState.pointSummary === 1) {
        pointSummaryScreen.classList.remove("hidden");
        titleScreen.classList.add('hidden');
        audioToPlay = "audio_PointSummary";
      }
      
      // Determine which audio to play
      if (gameState.startI === 1) {
        audioToPlay = "audio_StartingStart";
      } else if (gameState.obstacle === 1) {
        audioToPlay = 'audio_ObstacleStart';
        adjustTitleFontSize("obstacle");
      } else if (gameState.acceleration === 1) {
        audioToPlay = 'audio_AccelerationStart';
      } else if (gameState.finish === 1) {
        audioToPlay = "audio_FinishStart";
      }
      
      // Play appropriate background audio
      if (audioToPlay) {
        manageBackgroundAudio(audioToPlay);
      }
      
      updateCompetitionTitle(gameState);
      
      // Apply green screen background if needed
      if (isGreenScreen && 
          (gameState.startI === 1 || gameState.startII === 1 || 
           gameState.finish === 1 || gameState.additional === 1 || 
           gameState.pointSummary === 1 || gameState.obstacle === 1)) {
        console.log("Applying green background for green screen UI");
        applyStyle(document.body, "background", "transparent");
      } else {
        console.log("Reverting to default background");
        document.body.style.background = '';
        
        if (projectorConfigData && projectorConfigData.background) {
          applyStyle(document.body, "background", projectorConfigData.background);
        } else {
          applyStyle(document.body, "background", defaultConfig.background);
        }
      }
    }

    // ================================================
    // GAME STATUS LISTENER
    // ================================================
    let currentGameState = {};
    let debounceTimer = null;
    
    gameStatusRef.on("value", async gameStatusSnapshot => {
      const gameStatusData = gameStatusSnapshot.val();
      
      if (!gameStatusData) {
        return;
      }
      
      // Build game state object
      currentGameState = {
        all: !(
          gameStatusData.banner?.banner ||
          gameStatusData.khoidong?.khoidong ||
          gameStatusData.khoidongo22?.khoidongo22 ||
          gameStatusData.vcnv?.vcnv ||
          gameStatusData.tangtoc?.tangtoc ||
          gameStatusData.vedich?.vedich ||
          gameStatusData.vedichphu?.vedichphu ||
          gameStatusData.tongketdiem?.tongketdiem
        ),
        banner: gameStatusData.banner?.banner || 0,
        startI: gameStatusData.khoidong?.khoidong || 0,
        startII: gameStatusData.khoidongo22?.khoidongo22 || 0,
        obstacle: gameStatusData.vcnv?.vcnv || 0,
        acceleration: gameStatusData.tangtoc?.tangtoc || 0,
        finish: gameStatusData.vedich?.vedich || 0,
        additional: gameStatusData.vedichphu?.vedichphu || 0,
        pointSummary: gameStatusData.tongketdiem?.tongketdiem || 0
      };
      
      console.log("Game state updated:", currentGameState);
      
      // Debounce screen updates to prevent rapid changes
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      debounceTimer = setTimeout(() => {
        updateScreenVisibility(currentGameState);
      }, 80);
    });

    // Load projector configuration
    loadProjectorConfig();

    // ================================================
    // TITLE FONT SIZE ADJUSTMENT
    // ================================================
    /**
     * Adjusts competition title font size for different competitions
     */
    function adjustTitleFontSize(competitionType) {
      const titleElement = document.getElementById("CompetitionTitle");
      
      if (competitionType === "obstacle") {
        titleElement.style.fontSize = "clamp(3rem, 10vw, 15rem)";
      } else {
        titleElement.style.fontSize = "clamp(5rem, 12vw, 20rem)";
      }
    }

    // ================================================
    // PLAYER LIMIT MANAGEMENT
    // ================================================
    /**
     * Shows or hides 5th player elements based on player limit
     */
    function updatePlayerLimitDisplay() {
      const playerLimit = getPlayerLimit();
      
      // Find 5th player elements in Obstacle section
      const obstaclePlayer5 = document.getElementById("ObstacleAnswerPlayer5");
      const obstaclePlayer5Container = obstaclePlayer5 ? 
        obstaclePlayer5.closest(".flex.justify-end.flex-col") : null;
      
      // Find 5th player elements in Acceleration section
      const accelerationPlayer5 = document.getElementById("AccelerationAnswerPlayer5");
      const accelerationPlayer5Container = accelerationPlayer5 ? 
        accelerationPlayer5.closest('.flex.flex-col') : null;
      
      // Hide or show based on player limit
      if (playerLimit === 4) {
        if (obstaclePlayer5Container) {
          obstaclePlayer5Container.style.display = "none";
        }
        if (accelerationPlayer5Container) {
          accelerationPlayer5Container.style.display = 'none';
        }
      } else {
        if (obstaclePlayer5Container) {
          obstaclePlayer5Container.style.display = "flex";
        }
        if (accelerationPlayer5Container) {
          accelerationPlayer5Container.style.display = "flex";
        }
      }
    }

    // Initialize player limit display
    setTimeout(() => {
      updatePlayerLimitDisplay();
    }, 100);

    // Listen for player limit changes
    window.addEventListener('playerLimitChanged', function(event) {
      updatePlayerLimitDisplay();
    });

    // Track player limit
    let currentPlayerLimit = getPlayerLimit();
    window.addEventListener('playerLimitChanged', function(event) {
      currentPlayerLimit = event.detail.playerLimit;
      updatePlayerLimitDisplay();
    });
  });
});
