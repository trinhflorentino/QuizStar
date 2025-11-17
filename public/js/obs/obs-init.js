/**
 * OBS Initialization Script
 * Script khởi tạo và tích hợp OBS WebSocket vào ứng dụng
 */

// Global OBS Integration instance
let obsIntegration = null;

/**
 * Khởi tạo OBS Integration khi trang load
 */
async function initializeOBSIntegration() {
    try {
        console.log('Initializing OBS Integration...');
        
        // Tạo instance OBS Integration Controller
        obsIntegration = new OBSIntegrationController();
        
        // Khởi tạo
        const success = await obsIntegration.initialize();
        
        if (success) {
            console.log('OBS Integration initialized successfully');
            
            // Expose instance ra window để các module khác có thể access
            window.obsIntegrationController = obsIntegration;
            
            // Tự động kết nối đến OBS
            await obsIntegration.autoConnectToOBS();
            
        } else {
            console.error('Failed to initialize OBS Integration');
        }
        
        return success;
    } catch (error) {
        console.error('Error initializing OBS Integration:', error);
        return false;
    }
}

/**
 * Utility functions để sử dụng từ các file khác
 */
window.OBSIntegration = {
    /**
     * Chuyển đổi scene theo phase
     */
    switchToPhase: async function(phase) {
        if (obsIntegration) {
            return await obsIntegration.switchToGamePhase(phase);
        }
        return false;
    },

    /**
     * Chuyển đổi scene thủ công
     */
    switchToScene: async function(sceneName, transitionName = 'Fade') {
        if (obsIntegration && obsIntegration.obsManager) {
            return await obsIntegration.obsManager.switchScene(sceneName, transitionName);
        }
        return false;
    },

    /**
     * Kiểm tra trạng thái kết nối
     */
    isConnected: function() {
        return obsIntegration && obsIntegration.obsManager && obsIntegration.obsManager.isConnectedToOBS();
    },

    /**
     * Lấy scene hiện tại
     */
    getCurrentScene: function() {
        if (obsIntegration && obsIntegration.obsManager) {
            return obsIntegration.obsManager.getCurrentScene();
        }
        return null;
    },

    /**
     * Bật/tắt auto scene switching
     */
    setAutoSceneSwitching: function(enabled) {
        if (obsIntegration) {
            obsIntegration.autoSceneSwitching = enabled;
            const checkbox = document.getElementById('obs-auto-switch');
            if (checkbox) {
                checkbox.checked = enabled;
            }
        }
    },

    /**
     * Hiển thị/ẩn OBS controls
     */
    toggleControls: function() {
        if (obsIntegration) {
            obsIntegration.showControls = !obsIntegration.showControls;
            if (obsIntegration.showControls) {
                // Tạo controls nếu chưa có
                if (!document.getElementById('obs-controls')) {
                    obsIntegration.createOBSControls();
                }
                obsIntegration.showOBSControls();
                obsIntegration.updateSceneList();
            } else {
                obsIntegration.hideOBSControls();
            }
        }
    },

    /**
     * Kết nối thủ công
     */
    connect: async function(address = 'ws://localhost:4455', password = '') {
        if (obsIntegration && obsIntegration.obsManager) {
            const connected = await obsIntegration.obsManager.connect(address, password);
            if (connected) {
                await obsIntegration.detectCurrentScene();
            }
            return connected;
        }
        return false;
    },

    /**
     * Ngắt kết nối
     */
    disconnect: async function() {
        if (obsIntegration && obsIntegration.obsManager) {
            return await obsIntegration.obsManager.disconnect();
        }
        return false;
    }
};

/**
 * Keyboard shortcuts cho OBS controls
 */
function setupOBSKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + O để toggle OBS controls
        if (e.ctrlKey && e.shiftKey && e.key === 'O') {
            e.preventDefault();
            window.OBSIntegration.toggleControls();
        }
        
        // Ctrl + Shift + C để kết nối OBS
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            window.OBSIntegration.connect();
        }
        
        // Ctrl + Shift + D để ngắt kết nối OBS
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            window.OBSIntegration.disconnect();
        }
    });
}

/**
 * Tích hợp với game logic hiện tại
 */
function integrateWithGameLogic() {
    // Override các hàm hiện tại để tích hợp OBS
    
    // Nếu có hàm showSection, override nó
    if (typeof showSection === 'function') {
        const originalShowSection = showSection;
        showSection = function(sectionId) {
            // Gọi hàm gốc
            originalShowSection(sectionId);
            
            // Chuyển đổi OBS scene
            setTimeout(() => {
                const phase = obsIntegration.mapSectionToPhase(sectionId.toLowerCase());
                if (phase && obsIntegration.autoSceneSwitching) {
                    obsIntegration.switchToGamePhase(phase);
                }
            }, 500);
        };
    }
    
    // Nếu có hàm hideAllSections, override nó
    if (typeof hideAllSections === 'function') {
        const originalHideAllSections = hideAllSections;
        hideAllSections = function() {
            originalHideAllSections();
            
            // Có thể chuyển về scene mặc định
            setTimeout(() => {
                if (obsIntegration && obsIntegration.autoSceneSwitching) {
                    obsIntegration.switchToGamePhase('title');
                }
            }, 500);
        };
    }
}

/**
 * Debug functions
 */
window.OBSDebug = {
    /**
     * Log thông tin OBS hiện tại
     */
    logStatus: function() {
        if (obsIntegration && obsIntegration.obsManager) {
            console.log('=== OBS WebSocket Status ===');
            console.log('Connected:', obsIntegration.obsManager.isConnectedToOBS());
            console.log('Current Scene:', obsIntegration.obsManager.getCurrentScene());
            console.log('Auto Scene Switching:', obsIntegration.autoSceneSwitching);
            console.log('Show Controls:', obsIntegration.showControls);
            console.log('Config:', obsIntegration.obsManager.getConnectionConfig());
            console.log('===========================');
        } else {
            console.log('OBS Integration not initialized');
        }
    },

    /**
     * Test kết nối
     */
    testConnection: async function() {
        if (obsIntegration && obsIntegration.obsManager) {
            try {
                const sceneInfo = await obsIntegration.obsManager.getCurrentSceneInfo();
                console.log('OBS Scene Info:', sceneInfo);
                return sceneInfo;
            } catch (error) {
                console.error('OBS Connection Test Failed:', error);
                return null;
            }
        }
        return null;
    },

    /**
     * List tất cả scenes
     */
    listScenes: async function() {
        if (obsIntegration && obsIntegration.obsManager) {
            try {
                const scenes = await obsIntegration.obsManager.refreshScenes();
                console.log('Available Scenes:', scenes);
                return scenes;
            } catch (error) {
                console.error('Failed to list scenes:', error);
                return [];
            }
        }
        return [];
    }
};

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', async function() {
    // Đợi Firebase ready nếu có
    if (typeof window.firebaseReady !== 'undefined' && !window.firebaseReady) {
        window.addEventListener('firebaseReady', async function() {
            await initializeOBSIntegration();
            setupOBSKeyboardShortcuts();
            integrateWithGameLogic();
        });
    } else {
        // Khởi tạo ngay lập tức
        await initializeOBSIntegration();
        setupOBSKeyboardShortcuts();
        integrateWithGameLogic();
    }
});

// Cleanup khi trang unload
window.addEventListener('beforeunload', function() {
    if (obsIntegration) {
        obsIntegration.destroy();
    }
});

console.log('OBS Integration Script loaded');
