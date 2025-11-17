/**
 * Sync Player PhotoURL
 * Automatically updates photoURL in /games/playerX when user updates their profile photo
 */

let currentMatchCode = null;
let currentPlayerSlot = null;

auth.onAuthStateChanged(user => {
  if (!user) {
    currentMatchCode = null;
    currentPlayerSlot = null;
    return;
  }
  
  const matchDocRef = firestoreDB.collection("match").doc(user.uid);
  
  matchDocRef.onSnapshot(docSnapshot => {
    if (!docSnapshot.exists) {
      // User không có match, reset variables
      currentMatchCode = null;
      currentPlayerSlot = null;
      console.log('[Sync] User chưa join trận nào');
      return;
    }
    
    const matchCode = docSnapshot.data().match;
    currentMatchCode = matchCode;
    const gamesRef = realtimeDB.ref(matchCode + "/games");
    
    // Listen for changes in games data to find user's slot
    gamesRef.on('value', (snapshot) => {
      const playersData = snapshot.val() || {};
      const playerLimit = getPlayerLimit();
      
      let foundSlot = false;
      
      // Find which slot this user is in
      for (let i = 1; i <= playerLimit; i++) {
        const playerKey = 'player' + i;
        const playerData = playersData[playerKey];
        
        if (playerData && playerData.uid === user.uid) {
          currentPlayerSlot = playerKey;
          foundSlot = true;
          
          // Update photoURL if different
          const currentPhotoURL = auth.currentUser?.photoURL;
          if (currentPhotoURL && playerData.photoURL !== currentPhotoURL) {
            console.log(`[Sync] Initial sync photoURL for ${playerKey}:`, currentPhotoURL);
            updatePhotoURLInMatch(currentPhotoURL);
          }
          break;
        }
      }
      
      // User không có slot trong games (chưa join match này)
      if (!foundSlot) {
        currentPlayerSlot = null;
        console.log('[Sync] User chưa join vào trận đấu này');
      }
    });
  });
});

/**
 * Update photoURL in current match
 * Call this function when user uploads new avatar
 */
function updatePhotoURLInMatch(photoURL) {
  if (!currentMatchCode || !currentPlayerSlot) {
    console.warn('[Sync] Cannot update photoURL: Not in a match');
    return;
  }
  
  if (!photoURL) {
    console.warn('[Sync] Cannot update: photoURL is empty');
    return;
  }
  
  console.log(`[Sync] Updating photoURL for ${currentPlayerSlot} in match ${currentMatchCode}`);
  console.log(`[Sync] New photoURL:`, photoURL);
  
  realtimeDB.ref(currentMatchCode + "/games/" + currentPlayerSlot).update({
    photoURL: photoURL
  }).then(() => {
    console.log(`[Sync] ✅ Successfully synced photoURL to ${currentPlayerSlot}`);
  }).catch((error) => {
    console.error(`[Sync] ❌ Error syncing photoURL:`, error);
  });
}

// Expose function to window for external calls
window.updatePhotoURLInMatch = updatePhotoURLInMatch;

