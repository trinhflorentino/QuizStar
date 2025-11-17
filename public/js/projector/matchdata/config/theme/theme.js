// ================================================
// PROJECTOR THEME CONFIGURATION MODULE
// ================================================
// This module handles theme customization for the projector display including:
// - Default theme configuration with Tailwind classes
// - Custom theme loading from Firebase
// - Dynamic style application (Tailwind classes, gradients, images, hex colors)
// - Element-to-config mapping
// ================================================

// ================================================
// DEFAULT THEME CONFIGURATION
// ================================================
/**
 * Default color scheme and styling for all projector elements
 * Uses Tailwind CSS classes for consistent styling
 */
window.defaultConfig = {
  // Background
  'background': "bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800",
  
  // Player List
  'playerListText': 'text-white',
  'playerListNameText': "text-white",
  'playerListPointsText': 'text-white',
  
  // Start Round (Khởi Động)
  'startQuestionContainer': "bg-gradient-to-tl from-blue-800 via-blue-900 to-slate-800",
  'startQuestionText': "text-white",
  'startQuestionNumberContainer': "bg-white",
  'startQuestionNumberText': 'text-slate-800',
  'startPlayerContainer': "bg-gradient-to-r from-blue-800 via-blue-900 to-slate-900",
  'startPlayerText': 'text-white',
  'startPlayerHighlightContainer': "bg-gradient-to-r from-pink-800 via-pink-900 to-slate-900",
  'startPlayerHighlightText': "text-white",
  
  // Obstacle Round (Vượt Chướng Ngại Vật)
  'obstacleTextContainer': "bg-gradient-to-tr from-cyan-600 to-cyan-900",
  'obstacleText': "text-white",
  'obstacleQuestionContainer': "bg-gradient-to-tr from-slate-900 via-blue-800 to-blue-900",
  'obstacleQuestionText': "text-white",
  'obstacleOverlay': 'bg-blue-950',
  'obstacleCenterOverlay': "bg-gradient-to-tr from-blue-600 to-cyan-500",
  'obstacleSlide': "accent-red-700",
  'obstacleAnswerCenterLine': 'bg-white',
  'obstacleAnswerPlayerNameContainer': "bg-gradient-to-tr from-blue-600 to-cyan-500",
  'obstacleAnswerPlayerNameText': "text-white",
  'obstacleAnswerPlayerAnswerContainer': "bg-gradient-to-tr from-blue-950 to-blue-900",
  'obstacleAnswerPlayerAnswerText': "text-white",
  'obstaclePlayerSolveContainer': "bg-gradient-to-tr from-blue-700 to-cyan-700",
  'obstaclePlayerSolveText': 'text-white',
  
  // Acceleration Round (Tăng Tốc)
  'accelerationQuestionContainer': "bg-gradient-to-tr from-slate-900 via-blue-800 to-blue-900",
  'accelerationQuestionText': "text-white",
  'accelerationMediaContainer': "bg-gradient-to-br from-slate-900 via-blue-800 to-blue-900",
  'accelerationSlider': "accent-red-700",
  'accelerationAnswerCenterLine': "bg-white",
  'accelerationAnswerPlayerNameContainer': "bg-gradient-to-tr from-blue-600 to-cyan-500",
  'accelerationAnswerPlayerNameText': "text-white",
  'accelerationAnswerPlayerAnswerContainer': "bg-gradient-to-l from-slate-900 via-blue-900 to-blue-800",
  'accelerationAnswerPlayerAnswerText': "text-white",
  
  // Finish Round (Về Đích)
  'finishQuestionPackContainer': "bg-gradient-to-r from-blue-800 via-blue-900 to-slate-800",
  'finishQuestionPackText': "text-white",
  'finishCheckboxContainer': "accent-black",
  'finishQuestionContainer': "bg-gradient-to-tl from-blue-800 via-blue-900 to-slate-800",
  'finishQuestionText': "text-white",
  'finishSlide': "accent-red-700",
  'finishPlayerContainer': "bg-white",
  'finishPlayerText': "text-blue-900",
  'finishPlayerHighlightContainer': "bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950",
  'finishPlayerHighlightText': "text-white",
  'finishPlayerBuzzerContainer': "bg-gradient-to-r from-pink-800 to-pink-900",
  'finishPlayerBuzzerText': "text-white",
  'finishSideInfoContainer': "bg-gradient-to-r from-blue-800 via-blue-900 to-slate-800",
  'finishSideInfoText': 'text-white',
  
  // Additional Round (Câu Hỏi Phụ)
  'additionalPlayerContainer': "bg-white",
  'additionalPlayerText': 'text-black',
  'additionalPlayerBuzzerContainer': "bg-gradient-to-r from-pink-800 to-pink-900",
  'additionalPlayerBuzzerText': "text-white",
  'additionalSlide': "accent-red-700",
  'additionalQuestionContainer': "bg-gradient-to-tl from-blue-800 via-blue-900 to-slate-800",
  'additionalQuestionText': "text-white",
  'additionalSideInfoContainer': "bg-gradient-to-r from-blue-800 via-blue-900 to-slate-800",
  'additionalSideInfoText': "text-white",
  
  // Point Summary (Tổng Kết Điểm)
  'pointSummaryPlayerContainer': "bg-gradient-to-r from-blue-800 via-blue-900 to-slate-800",
  'pointSummaryPlayerText': "text-white",
  'pointSummaryPointContainer': "bg-white",
  'pointSummaryPointText': 'text-blue-900',
  'pointSummaryRankingContainer': "bg-white",
  'pointSummaryRankingText': "text-blue-900",
  
  // Competition Title
  'competitionTitleText': "text-white"
};

// Global variable to store custom projector configuration
window.projectorConfigData = {};

// ================================================
// STYLE APPLICATION FUNCTION
// ================================================
/**
 * Applies styles to DOM elements
 * Supports:
 * - Tailwind CSS classes (bg-, text-, from-, via-, to-, accent-)
 * - Gradient values (linear-gradient, radial-gradient)
 * - Image URLs
 * - Hex color codes
 * 
 * @param {HTMLElement|HTMLCollection|NodeList|Array} element - Element(s) to apply styles to
 * @param {string} styleProperty - CSS property name ('background', 'color', etc.)
 * @param {string} styleValue - Value to apply (Tailwind class, CSS value, etc.)
 */
function applyStyle(element, styleProperty, styleValue) {
  if (!styleValue) {
    return;
  }

  /**
   * Check if value is a Tailwind CSS class
   */
  function isTailwindClass(value) {
    const classes = value.trim().split(/\s+/);
    return classes.every(className => 
      className.startsWith("bg-") || 
      className.startsWith("text-") || 
      className.startsWith("from-") || 
      className.startsWith("via-") || 
      className.startsWith("to-") || 
      className.startsWith('accent-')
    );
  }

  // Handle collections/arrays of elements
  if (element instanceof HTMLCollection || 
      element instanceof NodeList || 
      Array.isArray(element)) {
    Array.from(element).forEach(el => applyStyle(el, styleProperty, styleValue));
    return;
  }

  // Apply Tailwind classes
  if (isTailwindClass(styleValue)) {
    styleValue.split(/\s+/).forEach(className => element.classList.add(className));
    // No additional inline style needed for background
  } 
  // Apply image URL as background
  else if ((styleValue.includes('url(') || /^https?:\/\//.test(styleValue)) && 
            styleProperty === "background") {
    if (!styleValue.includes("url(")) {
      element.style[styleProperty] = `url('${styleValue}') center center / cover no-repeat fixed`;
    } else {
      element.style[styleProperty] = styleValue;
    }
  } 
  // Apply gradient styles
  else if (styleValue.startsWith("linear-gradient(") || 
           styleValue.startsWith("radial-gradient(") || 
           styleValue.includes('gradient')) {
    if (styleProperty === "color") {
      // Apply gradient as text color (gradient text effect)
      element.style.background = styleValue;
      element.style.backgroundClip = 'text';
      element.style.webkitBackgroundClip = "text";
      element.style.color = "transparent";
      element.style.webkitTextFillColor = "transparent";
    } else {
      element.style[styleProperty] = styleValue;
    }
  } 
  // Apply hex color code
  else if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(styleValue)) {
    // Clear gradient-related styles
    element.style.background = '';
    element.style.backgroundClip = '';
    element.style.webkitBackgroundClip = '';
    element.style.color = '';
    element.style.webkitTextFillColor = '';
    element.style[styleProperty] = styleValue;
  } 
  // Apply other CSS values
  else {
    // Clear gradient-related styles
    element.style.background = '';
    element.style.backgroundClip = '';
    element.style.webkitBackgroundClip = '';
    element.style.color = '';
    element.style.webkitTextFillColor = '';
    element.style[styleProperty] = styleValue;
  }
}

// ================================================
// ELEMENT SELECTOR HELPER
// ================================================
/**
 * Gets DOM element(s) based on selector
 * @param {string} selector - CSS selector (#id, .class, or element)
 * @returns {HTMLElement|HTMLCollection|NodeList}
 */
function getElement(selector) {
  if (selector.startsWith('#')) {
    return document.getElementById(selector.slice(1));
  } else if (selector.startsWith('.')) {
    return document.getElementsByClassName(selector.slice(1));
  } else {
    return document.querySelectorAll(selector);
  }
}

// ================================================
// ELEMENT-TO-CONFIG MAPPING
// ================================================
/**
 * Maps configuration keys to their corresponding DOM elements
 * This allows themes to target specific UI components
 */
const elementMapping = {
  'background': document.body,
  
  // Start Round elements
  'startQuestionContainer': getElement(".startQuestionContainer"),
  'startPlayerContainer': getElement(".startPlayerContainer"),
  
  // Obstacle Round elements
  'obstacleTextContainer': document.getElementById("ObstacleTextContainer"),
  'obstacleQuestionContainer': document.getElementById("ObstacleQuestionContainer"),
  'obstacleAnswerCenterLine': getElement('.obstacleAnswerCenterLine'),
  'obstacleAnswerPlayerNameContainer': getElement(".obstacleAnswerName"),
  'obstacleAnswerPlayerAnswerContainer': getElement('.obstacleAnswer'),
  'obstacleOverlay': getElement('.obstacleOverlay'),
  'obstacleCenterOverlay': getElement(".obstacleCenterOverlay"),
  
  // Acceleration Round elements
  'accelerationQuestionContainer': getElement(".accelerationQuestion"),
  'accelerationMediaContainer': getElement(".accelerationMedia"),
  'accelerationAnswerCenterLine': getElement('.accelerationAnswerCenterLine'),
  'accelerationAnswerPlayerNameContainer': getElement('.accelerationPlayerName'),
  'accelerationAnswerPlayerAnswerContainer': getElement(".accelerationAnswer"),
  
  // Finish Round elements
  'finishQuestionPackContainer': getElement(".finishQuestionPackContainer"),
  'finishQuestionContainer': document.getElementById("FinishQuestionContainer"),
  'finishSideInfoContainer': getElement(".finishSideInfo"),
  'finishPlayerHighlightContainer': getElement(".finishPlayerHighlightContainer"),
  
  // Additional Round elements
  'additionalQuestionContainer': getElement(".additionalQuestionContainer"),
  'additionalSideInfoContainer': getElement(".additionalSideInfoContainer"),
  
  // Point Summary elements
  'pointSummaryPlayerContainer': getElement(".pointSummaryPlayerContainer"),
  
  // Competition Title elements
  'competitionTitleText': [
    document.getElementById("Olympia1"),
    document.getElementById('Olympia2'),
    document.getElementById("CompetitionTitle"),
    document.getElementById('PlayerScoreTitle'),
    getElement(".competitionPlayerText")
  ].filter(element => element !== null)
};

// ================================================
// APPLY DEFAULT THEME
// ================================================
/**
 * Apply default theme configuration to all elements
 */
for (const [configKey, styleValue] of Object.entries(window.defaultConfig)) {
  if (elementMapping[configKey]) {
    if (configKey.endsWith("Text")) {
      // Apply as text color
      applyStyle(elementMapping[configKey], "color", styleValue);
    } else {
      // Apply as background
      applyStyle(elementMapping[configKey], "background", styleValue);
    }
  }
}

// ================================================
// LOAD CUSTOM THEME FROM FIREBASE
// ================================================
/**
 * Listen for authentication and load custom theme configuration
 * Custom themes override default configuration
 */
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
    const hostIdRef = realtimeDB.ref(`${matchId}/hostid`);
    
    hostIdRef.on("value", hostIdSnapshot => {
      const hostId = hostIdSnapshot.val();
      const projectorConfigDoc = firestoreDB.collection("projectorConfig").doc(hostId);
      
      projectorConfigDoc.onSnapshot(configSnapshot => {
        // If config doesn't exist, set all values to empty
        if (!configSnapshot.exists) {
          Object.keys(window.defaultConfig).forEach(key => {
            projectorConfigData[key] = '';
          });
          return;
        }

        // If configData is undefined, set all values to empty
        if (configSnapshot.data().configData === undefined) {
          Object.keys(window.defaultConfig).forEach(key => {
            projectorConfigData[key] = '';
          });
          return;
        }

        // Load custom configuration
        const customConfig = configSnapshot.data().configData;
        projectorConfigData = customConfig;
        
        // Apply custom theme to all elements
        for (const [configKey, styleValue] of Object.entries(customConfig)) {
          if (elementMapping[configKey]) {
            if (configKey.endsWith("Text")) {
              // Apply as text color
              applyStyle(elementMapping[configKey], 'color', styleValue);
            } else {
              // Apply as background
              applyStyle(elementMapping[configKey], "background", styleValue);
            }
          }
        }
      });
    });
  });
});
