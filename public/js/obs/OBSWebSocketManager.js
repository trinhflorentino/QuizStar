/**
 * OBS WebSocket Manager
 * Quản lý kết nối và điều khiển OBS Studio thông qua WebSocket
 */

class OBSWebSocketManager {
    constructor() {
        this.obs = null;
        this.isConnected = false;
        this.connectionConfig = {
            address: 'ws://localhost:4455',
            password: ''
        };
        this.scenes = {
            TITLE: 'Overlay',
            START_I: 'Overlay',
            START_II: 'Overlay', 
            OBSTACLE: 'VCNV',
            ACCELERATION: 'Overlay',
            FINISH: 'Overlay',
            ADDITIONAL: 'Overlay',
            POINT_SUMMARY: 'Overlay',
            PLAYER_LIST: 'Overlay'
        };
        // Pre-computed phase map cho tốc độ lookup O(1)
        this.scenePhaseMap = {
            'title': this.scenes.TITLE,
            'startI': this.scenes.START_I,
            'startII': this.scenes.START_II,
            'obstacle': this.scenes.OBSTACLE,
            'acceleration': this.scenes.ACCELERATION,
            'finish': this.scenes.FINISH,
            'additional': this.scenes.ADDITIONAL,
            'pointSummary': this.scenes.POINT_SUMMARY,
            'playerList': this.scenes.PLAYER_LIST
        };
        this.currentScene = null;
        this.eventListeners = new Map();
    }

    /**
     * Khởi tạo kết nối OBS WebSocket
     */
    async initialize() {
        try {
            // Import obs-websocket-js library
            if (typeof OBSWebSocket === 'undefined') {
                await this.loadOBSLibrary();
            }

            this.obs = new OBSWebSocket();
            await this.setupEventListeners();
            
            console.log('OBS WebSocket Manager initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize OBS WebSocket Manager:', error);
            return false;
        }
    }

    /**
     * Load OBS WebSocket library dynamically
     */
    async loadOBSLibrary() {
        return new Promise((resolve, reject) => {
            if (typeof OBSWebSocket !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/obs-websocket-js';
            script.onload = () => {
                console.log('OBS WebSocket library loaded');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load OBS WebSocket library');
                reject(new Error('Failed to load OBS WebSocket library'));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Kết nối đến OBS Studio
     */
    async connect(address = null, password = null) {
        try {
            const config = {
                address: address || this.connectionConfig.address,
                password: password || this.connectionConfig.password
            };

            console.log('Connecting to OBS WebSocket at:', config.address);
            
            await this.obs.connect(config.address, config.password);
            
            this.isConnected = true;
            this.connectionConfig = config;
            
            console.log('Connected to OBS WebSocket successfully');
            
            // Lấy thông tin phiên bản OBS
            const version = await this.obs.call('GetVersion');
            console.log('OBS Version:', version.obsVersion);
            console.log('OBS WebSocket Version:', version.obsWebSocketVersion);

            // Lấy danh sách scene hiện tại
            await this.refreshScenes();
            
            this.dispatchEvent('connected', { version });
            return true;
            
        } catch (error) {
            console.error('Failed to connect to OBS WebSocket:', error);
            this.isConnected = false;
            this.dispatchEvent('connectionError', { error: error.message });
            return false;
        }
    }

    /**
     * Ngắt kết nối OBS
     */
    async disconnect() {
        try {
            if (this.obs && this.isConnected) {
                await this.obs.disconnect();
                this.isConnected = false;
                this.currentScene = null;
                console.log('Disconnected from OBS WebSocket');
                this.dispatchEvent('disconnected');
            }
        } catch (error) {
            console.error('Error disconnecting from OBS:', error);
        }
    }

    /**
     * Thiết lập event listeners
     */
    setupEventListeners() {
        if (!this.obs) return;

        // Kết nối thành công
        this.obs.on('ConnectionOpened', () => {
            console.log('OBS WebSocket connection opened');
            this.dispatchEvent('connectionOpened');
        });

        // Kết nối bị đóng
        this.obs.on('ConnectionClosed', (error) => {
            console.log('OBS WebSocket connection closed:', error);
            this.isConnected = false;
            this.dispatchEvent('connectionClosed', { error });
        });

        // Lỗi kết nối
        this.obs.on('ConnectionError', (error) => {
            console.error('OBS WebSocket connection error:', error);
            this.isConnected = false;
            this.dispatchEvent('connectionError', { error });
        });

        // Scene thay đổi
        this.obs.on('CurrentProgramSceneChanged', (data) => {
            console.log('Current scene changed to:', data.sceneName);
            this.currentScene = data.sceneName;
            this.dispatchEvent('sceneChanged', { sceneName: data.sceneName });
        });

        // Scene preview thay đổi
        this.obs.on('CurrentPreviewSceneChanged', (data) => {
            console.log('Preview scene changed to:', data.sceneName);
            this.dispatchEvent('previewSceneChanged', { sceneName: data.sceneName });
        });

        // Studio mode thay đổi
        this.obs.on('StudioModeStateChanged', (data) => {
            console.log('Studio mode state changed:', data.studioModeEnabled);
            this.dispatchEvent('studioModeChanged', { enabled: data.studioModeEnabled });
        });

        // Transition thay đổi
        this.obs.on('CurrentSceneTransitionChanged', (data) => {
            console.log('Current transition changed to:', data.transitionName);
            this.dispatchEvent('transitionChanged', { transitionName: data.transitionName });
        });
    }

    /**
     * Làm mới danh sách scene
     */
    async refreshScenes() {
        try {
            const sceneList = await this.obs.call('GetSceneList');
            console.log('Available scenes:', sceneList.scenes.map(s => s.sceneName));
            
            // Cập nhật scene hiện tại
            this.currentScene = sceneList.currentProgramSceneName;
            
            this.dispatchEvent('scenesRefreshed', { 
                scenes: sceneList.scenes,
                currentScene: this.currentScene 
            });
            
            return sceneList.scenes;
        } catch (error) {
            console.error('Failed to refresh scenes:', error);
            return [];
        }
    }

    /**
     * Chuyển đổi scene (siêu tối ưu - không await không cần thiết)
     */
    switchScene(sceneName, transitionName = null, transitionDuration = 0) {
        // Early returns cho performance tối đa
        if (!this.isConnected || this.currentScene === sceneName) {
            return Promise.resolve(this.currentScene === sceneName);
        }

        // Update state ngay lập tức (optimistic update)
        this.currentScene = sceneName;
        console.log(`→ ${sceneName}`);

        // Fire and forget - không await để không block
        return this.obs.call('SetCurrentProgramScene', { sceneName })
            .then(() => {
                this.dispatchEvent('sceneSwitched', { sceneName, transitionName });
                return true;
            })
            .catch((error) => {
                console.error('Switch failed:', error.message);
                this.dispatchEvent('sceneSwitchError', { error: error.message, sceneName });
                return false;
            });
    }

    /**
     * Thiết lập transition
     */
    async setTransition(transitionName, duration = 300) {
        try {
            await this.obs.call('SetCurrentSceneTransition', { transitionName });
            await this.obs.call('SetCurrentSceneTransitionDuration', { transitionDuration: duration });
            console.log(`Transition set to: ${transitionName} (${duration}ms)`);
        } catch (error) {
            console.error('Failed to set transition:', error);
        }
    }

    /**
     * Trigger transition trong Studio Mode
     */
    async triggerTransition() {
        try {
            await this.obs.call('TriggerStudioModeTransition');
            console.log('Studio mode transition triggered');
        } catch (error) {
            console.error('Failed to trigger transition:', error);
        }
    }

    /**
     * Thiết lập preview scene trong Studio Mode
     */
    async setPreviewScene(sceneName) {
        try {
            await this.obs.call('SetCurrentPreviewScene', { sceneName });
            console.log(`Preview scene set to: ${sceneName}`);
        } catch (error) {
            console.error('Failed to set preview scene:', error);
        }
    }

    /**
     * Bật/tắt Studio Mode
     */
    async toggleStudioMode() {
        try {
            const studioModeState = await this.obs.call('GetStudioModeEnabled');
            await this.obs.call('SetStudioModeEnabled', { studioModeEnabled: !studioModeState.studioModeEnabled });
            console.log('Studio mode toggled');
        } catch (error) {
            console.error('Failed to toggle studio mode:', error);
        }
    }

    /**
     * Chuyển đổi scene theo phase của game (siêu tối ưu)
     */
    switchToGamePhase(phase) {
        // Pre-computed scene map (moved to constructor for better performance)
        const sceneName = this.scenePhaseMap?.[phase] || this.scenes[phase.toUpperCase()];
        
        if (!sceneName) {
            return Promise.resolve(false);
        }

        // Direct call, no await needed
        return this.switchScene(sceneName);
    }

    /**
     * Lấy thông tin scene hiện tại
     */
    async getCurrentSceneInfo() {
        try {
            const sceneList = await this.obs.call('GetSceneList');
            return {
                currentScene: sceneList.currentProgramSceneName,
                previewScene: sceneList.currentPreviewSceneName,
                scenes: sceneList.scenes
            };
        } catch (error) {
            console.error('Failed to get current scene info:', error);
            return null;
        }
    }

    /**
     * Lấy danh sách transition có sẵn
     */
    async getAvailableTransitions() {
        try {
            const transitions = await this.obs.call('GetSceneTransitionList');
            return transitions.transitions;
        } catch (error) {
            console.error('Failed to get transitions:', error);
            return [];
        }
    }

    /**
     * Event system
     */
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    dispatchEvent(event, data = {}) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Utility methods
     */
    isConnectedToOBS() {
        return this.isConnected;
    }

    getCurrentScene() {
        return this.currentScene;
    }

    getConnectionConfig() {
        return this.connectionConfig;
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.obs) {
            this.disconnect();
            this.obs = null;
        }
        this.eventListeners.clear();
    }
}

// Export cho sử dụng global
window.OBSWebSocketManager = OBSWebSocketManager;
