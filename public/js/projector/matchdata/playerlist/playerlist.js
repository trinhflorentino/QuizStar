auth.onAuthStateChanged(user => {
  if (!user) {
    return;
  }
  
  const matchDocRef = firestoreDB.collection('match').doc(auth.currentUser.uid);
  
  matchDocRef.onSnapshot(doc => {
    if (!doc.exists) {
      return;
    }
    
    const matchCode = doc.data().match;
    const gamesRef = realtimeDB.ref(matchCode + '/games');
    const pointRef = realtimeDB.ref(matchCode + '/point');
    const isCompactUI = localStorage.getItem('isCompactUI') === 'true';
    
    let playerPointsCache = {};
    
    gamesRef.on('value', async (snapshot) => {
      const playersData = snapshot.val() || {};
      
      const playerListContainer = document.getElementById('playerListContainer');
      const startPlayerContainer = document.getElementById('startPlayerContainer');
      const startIIPlayerContainer = document.getElementById('startIIPlayerContainer');
      const finishPlayerLists = document.getElementById('FinishPlayerLists');
      
      // Clear all containers
      if (playerListContainer) playerListContainer.innerHTML = '';
      if (startPlayerContainer) startPlayerContainer.innerHTML = '';
      if (startIIPlayerContainer) startIIPlayerContainer.innerHTML = '';
      if (finishPlayerLists) finishPlayerLists.innerHTML = '';
      
      const playerLimit = getPlayerLimit();
      
      for (let i = 1; i <= playerLimit; i++) {
        const playerData = playersData['player' + i];
        
        if (playerData) {
          const playerId = playerData.uid;
          const playerName = playerData.displayName || 'Player ' + i;
          const photoURL = playerData.photoURL; // Get photoURL from player data if available
          
          if (!(playerId in playerPointsCache)) {
            playerPointsCache[playerId] = playerData.points || 0;
          }
          
          const currentPoints = playerPointsCache[playerId];
          
          // ================================================
          // BANNER SECTION - Player List Container
          // ================================================
          if (playerListContainer) {
            const playerCard = document.createElement('div');
            playerCard.className = 'flex flex-col items-center p-8 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg';
            
            const avatarContainer = document.createElement('div');
            avatarContainer.className = 'relative';
            
            const avatar = document.createElement('img');
            avatar.alt = 'Avatar ' + i;
            avatar.className = 'w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover aspect-square';
            avatarContainer.appendChild(avatar);
            playerCard.appendChild(avatarContainer);
            
            const nameLabel = document.createElement('span');
            nameLabel.className = 'mt-4 text-lg sm:text-3xl font-bold text-white text-center competitionPlayerText';
            nameLabel.textContent = playerName;
            playerCard.appendChild(nameLabel);
            
            const pointsContainer = document.createElement('div');
            pointsContainer.className = 'mt-3 px-6 py-2 bg-neutral-700 rounded-full shadow-inner';
            
            const pointsLabel = document.createElement('span');
            pointsLabel.className = 'text-white font-semibold text-2xl';
            pointsLabel.id = 'player' + i + '-points';
            pointsLabel.textContent = currentPoints;
            pointsContainer.appendChild(pointsLabel);
            
            playerCard.appendChild(pointsContainer);
            playerListContainer.appendChild(playerCard);
            
            // Load avatar from Cloudinary instead of Firebase Storage
            console.log('Projector Player ' + i + ' UID:', playerId, 'Name:', playerName, 'PhotoURL:', photoURL);
            
            // Use photoURL from player data if available, otherwise construct path
            if (photoURL) {
              console.log('Projector using photoURL from player data:', photoURL);
              avatar.src = photoURL;
            } else {
              try {
                if (typeof cloudinaryService !== 'undefined') {
                  const avatarPath = 'users/' + playerId + '/profile.jpg';
                  console.log('Projector avatar path:', avatarPath);
                  cloudinaryService.ref(avatarPath).getDownloadURL()
                    .then(url => {
                      console.log('Projector avatar loaded:', url);
                      avatar.src = url;
                    })
                    .catch((error) => {
                      console.log('Projector avatar failed, trying default:', error);
                      cloudinaryService.ref('users/profile.jpg').getDownloadURL()
                        .then(url => {
                          console.log('Projector default avatar loaded:', url);
                          avatar.src = url;
                        })
                        .catch(() => {
                          console.log('Projector using app logo fallback');
                          avatar.src = 'img/appLogo.png';
                        });
                    });
                } else {
                  console.log('Projector cloudinaryService not defined');
                  avatar.src = 'img/appLogo.png';
                }
              } catch (error) {
                console.error('Projector error loading avatar:', error);
                avatar.src = 'img/appLogo.png';
              }
            }
          }
          
          // Update obstacle player names
          const obstacleName = document.getElementById('ObstacleAnswerPlayerName' + i);
          if (obstacleName) {
            obstacleName.textContent = playerName;
          }
          
          // ================================================
          // START I SECTION - startPlayerContainer
          // ================================================
          if (startPlayerContainer) {
            const startIPlayerCard = document.createElement('div');
            startIPlayerCard.className = isCompactUI
              ? 'flex flex-row items-center justify-between border-2 border-gray-200 p-2 rounded-lg shadow-lg startPlayerContainer gap-2 shimmer-animation'
              : 'flex flex-row items-center justify-between border-2 border-gray-200 p-4 rounded-lg shadow-lg startPlayerContainer gap-6 shimmer-animation';
            
            const startIName = document.createElement('p');
            startIName.className = isCompactUI
              ? 'font-bold text-md text-white drop-shadow-lg'
              : 'font-bold text-xl text-white drop-shadow-lg';
            startIName.textContent = playerName;
            
            const startIPoints = document.createElement('p');
            startIPoints.className = isCompactUI
              ? 'font-bold text-lg text-white drop-shadow-lg'
              : 'font-bold text-2xl text-white drop-shadow-lg';
            startIPoints.id = 'startPlayer' + i + '-points';
            startIPoints.textContent = currentPoints;
            
            startIPlayerCard.appendChild(startIName);
            startIPlayerCard.appendChild(startIPoints);
            startPlayerContainer.appendChild(startIPlayerCard);
          }
          
          // ================================================
          // START II SECTION - startIIPlayerContainer
          // ================================================
          if (startIIPlayerContainer) {
            const startIIPlayerCard = document.createElement('div');
            startIIPlayerCard.className = isCompactUI
              ? 'flex flex-row items-center justify-between border-2 border-gray-200 p-2 rounded-lg shadow-lg startPlayerContainer gap-2 shimmer-animation'
              : 'flex flex-row items-center justify-between border-2 border-gray-200 p-4 rounded-lg shadow-lg startPlayerContainer gap-6 shimmer-animation';
            
            const startIIName = document.createElement('p');
            startIIName.className = isCompactUI
              ? 'font-bold text-md text-white drop-shadow-lg'
              : 'font-bold text-xl text-white drop-shadow-lg';
            startIIName.textContent = playerName;
            
            const startIIPoints = document.createElement('p');
            startIIPoints.className = isCompactUI
              ? 'font-bold text-lg text-white drop-shadow-lg'
              : 'font-bold text-2xl text-white drop-shadow-lg';
            startIIPoints.id = 'startIIPlayer' + i + '-points';
            startIIPoints.textContent = currentPoints;
            
            startIIPlayerCard.appendChild(startIIName);
            startIIPlayerCard.appendChild(startIIPoints);
            startIIPlayerContainer.appendChild(startIIPlayerCard);
          }
          
          // ================================================
          // FINISH SECTION - FinishPlayerLists
          // ================================================
          if (finishPlayerLists) {
            const finishPlayerCard = document.createElement('div');
            finishPlayerCard.className = isCompactUI
              ? 'flex-1 bg-white p-2 text-center border-r border-gray-300 last:border-r-0'
              : 'flex-1 bg-white p-4 text-center border-r border-gray-300 last:border-r-0';
            
            const finishName = document.createElement('p');
            finishName.className = isCompactUI
              ? 'font-bold text-gray-800 text-md drop-shadow-lg'
              : 'font-bold text-gray-800 text-lg drop-shadow-lg';
            finishName.id = 'finishPlayer' + i + '-points';
            finishName.textContent = playerName + ' (' + currentPoints + ')';
            
            finishPlayerCard.appendChild(finishName);
            finishPlayerLists.appendChild(finishPlayerCard);
          }
        }
      }
      
      applyStyle(
        getElement('.competitionPlayerText'),
        'color',
        projectorConfigData.competitionTitleText
      );
    });
    
    pointRef.on('value', (snapshot) => {
      const pointsData = snapshot.val() || {};
      const playerLimit = getPlayerLimit();
      
      for (let i = 1; i <= playerLimit; i++) {
        const playerPoints = pointsData['player' + i]?.point || 0;
        const playerId = pointsData['player' + i]?.uid;
        
        if (playerId) {
          playerPointsCache[playerId] = playerPoints;
        }
        
        const bannerPoints = document.querySelector('#player' + i + '-points');
        if (bannerPoints) {
          bannerPoints.textContent = playerPoints;
        }
        
        const startIPoints = document.querySelector('#startPlayer' + i + '-points');
        if (startIPoints) {
          startIPoints.textContent = playerPoints;
        }
        
        const startIIPoints = document.querySelector('#startIIPlayer' + i + '-points');
        if (startIIPoints) {
          startIIPoints.textContent = playerPoints;
        }
        
        const finishPoints = document.querySelector('#finishPlayer' + i + '-points');
        if (finishPoints) {
          const currentText = finishPoints.textContent.replace(/\(\-?\d+\)$/, '').trim();
          finishPoints.textContent = currentText + ' (' + playerPoints + ')';
        }
      }
    });
  });
});
