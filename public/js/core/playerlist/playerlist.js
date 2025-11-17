// Player List Manager for Technician Interface
auth.onAuthStateChanged(user => {
  if (!user) {
    return;
  }
  
  const matchDocRef = firestoreDB.collection("match").doc(user.uid);
  const connectionStatusMap = new Map();
  
  matchDocRef.onSnapshot(docSnapshot => {
    if (!docSnapshot.exists) {
      return;
    }
    
    const matchCode = docSnapshot.data().match;
    const gamesRef = realtimeDB.ref(matchCode + "/games");
    
    gamesRef.on('value', async (snapshot) => {
      const playersData = snapshot.val() || {};
      
      // Get all player container elements
      const playerContainers = {
        'setup': document.getElementById("setupPlayerContainer"),
        'intro': document.getElementById('introductionPlayerContainer'),
        'startI': document.getElementById("startiPlayerContainer"),
        'startII': document.getElementById("startiiPlayerContainer"),
        'obstacle': document.getElementById('obstaclePlayerContainer'),
        'acceleration': document.getElementById("accelerationPlayerContainer"),
        'finish': document.getElementById("finishPlayerContainer"),
        'additional': document.getElementById("additionalPlayerContainer"),
        'pointSummary': document.getElementById("pointSummaryPlayerContainer"),
        'video': document.getElementById("videosPlayerContainer")
      };
      
      // Clear all containers
      Object.values(playerContainers).forEach(container => {
        if (container) {
          container.innerHTML = '';
        }
      });
      
      // Storage for player elements by type
      const playerPointElements = {};
      const playerConnectionElements = {};
      const playerLatencyElements = {};
      
      const playerLimit = getPlayerLimit();
      
      // Create player items for each player
      for (let i = 1; i <= playerLimit; i++) {
        const playerData = playersData["player" + i];
        
        if (playerData) {
          const uid = playerData.uid;
          const displayName = playerData.displayName;
          
          // Create player item for each container type
          Object.entries(playerContainers).forEach(([containerType, container]) => {
            if (container) {
              const playerItem = createPlayerItem(uid, displayName, i, playerPointElements, playerConnectionElements, playerLatencyElements, containerType);
              container.appendChild(playerItem);
            }
          });
          
          // Listen to player points
          const pointRef = realtimeDB.ref(matchCode + "/point/player" + i);
          pointRef.on('value', pointSnapshot => {
            const points = pointSnapshot.val()?.point || 0;
            const pointElementsArray = playerPointElements["player" + i] || [];
            pointElementsArray.forEach(element => {
              element.textContent = points;
            });
          });
          
          // Listen to player connection status
          const connectionRef = realtimeDB.ref(matchCode + '/playerConnection/player' + i + "/connections");
          connectionRef.on('value', connectionSnapshot => {
            const isConnected = connectionSnapshot.exists();
            const previousStatus = connectionStatusMap.get("player" + i);
            
            // Show disconnect notification
            if (previousStatus === true && !isConnected && displayName !== 'N/A') {
              document.getElementById("audio_Disconnected").play();
              failToast(
                "Có thí sinh bị mất kết nối đến hệ thống.", 
                15000, 
                "top", 
                "right", 
                true, 
                "radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)", 
                ''
              );
            }
            
            connectionStatusMap.set("player" + i, isConnected);
            
            // Update connection indicator
            const connectionElementsArray = playerConnectionElements['player' + i] || [];
            connectionElementsArray.forEach(indicator => {
              indicator.classList.remove("bg-red-500", "bg-green-500");
              indicator.classList.add(isConnected ? 'bg-green-500' : "bg-red-500");
            });
          });
          
          // Listen to player latency
          const latencyRef = realtimeDB.ref(matchCode + "/playerConnection/player" + i + "/latency");
          latencyRef.on('value', latencySnapshot => {
            const latencyData = latencySnapshot.val() || 0;
            const latencyElementsArray = playerLatencyElements["player" + i] || [];
            latencyElementsArray.forEach(element => {
              element.textContent = latencyData ? latencyData.value + 'ms' : '';
            });
          });
        }
      }
    });
  });
});

/**
 * Create a player item element
 * @param {string} uid - Player UID
 * @param {string} displayName - Player display name
 * @param {number} playerNumber - Player number (1-4 or 1-5)
 * @param {Object} pointElements - Storage for point elements
 * @param {Object} connectionElements - Storage for connection indicator elements
 * @param {Object} latencyElements - Storage for latency elements
 * @param {string} containerType - Type of container (setup, intro, startI, etc.)
 * @returns {HTMLElement} Player item element
 */
function createPlayerItem(uid, displayName, playerNumber, pointElements, connectionElements, latencyElements, containerType) {
  // Main container
  const playerItem = document.createElement('div');
  playerItem.className = "flex items-center justify-between";
  playerItem.id = containerType + 'Player' + playerNumber;
  
  // Left side - player info
  const leftSide = document.createElement("div");
  leftSide.className = "flex items-center space-x-2";
  playerItem.appendChild(leftSide);
  
  // Add checkbox for certain competition types
  if (containerType === "obstacle" || containerType === "acceleration" || containerType === "additional") {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "mr-2 w-4 h-4 rounded-md";
    checkbox.id = containerType + "Player" + playerNumber + "Checkbox";
    leftSide.appendChild(checkbox);
  }
  
  // Avatar
  const avatar = document.createElement("div");
  avatar.className = `
        chat-avatar w-12 h-12 rounded-full flex-shrink-0
        ${displayName === 'host' ? "bg-blue-700 dark:bg-blue-800" : "bg-gray-400 dark:bg-gray-500"}
    `;
  
  // Get last word initial for avatar
  const nameParts = displayName.trim();
  const lastWord = nameParts.split(" ").filter(Boolean).pop() || '';
  avatar.textContent = lastWord ? lastWord[0].toUpperCase() : '';
  avatar.style.color = "white";
  avatar.style.display = 'flex';
  avatar.style.justifyContent = 'center';
  avatar.style.alignItems = "center";
  avatar.style.fontWeight = "bold";
  leftSide.appendChild(avatar);
  
  // Name container
  const nameContainer = document.createElement("div");
  nameContainer.className = "flex flex-col";
  
  const nameSpan = document.createElement('span');
  nameSpan.className = "font-semibold dark:text-white";
  nameSpan.textContent = displayName;
  nameSpan.id = containerType + 'Player' + playerNumber + "Name";
  nameContainer.appendChild(nameSpan);
  leftSide.appendChild(nameContainer);
  
  // Right side - points and status
  const rightSide = document.createElement("div");
  rightSide.className = "flex items-center space-x-2";
  playerItem.appendChild(rightSide);
  
  // Points display
  const pointsSpan = document.createElement("span");
  pointsSpan.className = "font-semibold dark:text-white";
  pointsSpan.textContent = 0;
  rightSide.appendChild(pointsSpan);
  
  // Connection and latency container
  const statusContainer = document.createElement("div");
  statusContainer.className = "flex items-center ml-2";
  
  // Connection indicator (red/green dot)
  const connectionDot = document.createElement("div");
  connectionDot.className = "h-3 w-3 rounded-full bg-red-500";
  statusContainer.appendChild(connectionDot);
  
  // Latency display
  const latencySpan = document.createElement("span");
  latencySpan.className = "text-xs ml-1 text-gray-500 dark:text-gray-400";
  latencySpan.textContent = '';
  statusContainer.appendChild(latencySpan);
  
  rightSide.appendChild(statusContainer);
  
  // Store references to elements for updates
  if (!pointElements["player" + playerNumber]) {
    pointElements["player" + playerNumber] = [];
  }
  pointElements["player" + playerNumber].push(pointsSpan);
  
  if (!connectionElements["player" + playerNumber]) {
    connectionElements["player" + playerNumber] = [];
  }
  connectionElements["player" + playerNumber].push(connectionDot);
  
  if (!latencyElements["player" + playerNumber]) {
    latencyElements["player" + playerNumber] = [];
  }
  latencyElements['player' + playerNumber].push(latencySpan);
  
  return playerItem;
}
