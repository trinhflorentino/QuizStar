/**
 * OBS Integration Controller
 * Tích hợp OBS WebSocket với logic game hiện tại
 */

class OBSIntegrationController {
    constructor() {
        this.obsManager = new OBSWebSocketManager();
        this.isInitialized = false;
        this.autoSceneSwitching = true;
        this.sceneTransitionDelay = 0; // Không delay, chuyển ngay lập tức
        this.showControls = false; // Luôn ẩn controls
        this.autoConnect = true; // Tự động kết nối
        this.lastPhase = null; // Lưu phase cuối cùng để tránh switch trùng
    }

    /**
     * Khởi tạo tích hợp OBS
     */
    async initialize() {
        try {
            console.log('Initializing OBS Integration...');
            
            // Khởi tạo OBS Manager
            await this.obsManager.initialize();
            
            // Thiết lập event listeners
            this.setupEventListeners();
            
            // Tạo UI controls
            this.createOBSControls();
            
            this.isInitialized = true;
            console.log('OBS Integration initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize OBS Integration:', error);
            return false;
        }
    }

    /**
     * Thiết lập event listeners
     */
    setupEventListeners() {
        // OBS Connection events
        this.obsManager.addEventListener('connected', async (data) => {
            this.updateConnectionStatus(true);
            console.log('OBS WebSocket connected:', data);
            
            // Tự động phát hiện scene hiện tại sau khi kết nối
            setTimeout(() => this.detectCurrentScene(), 1000);
        });

        this.obsManager.addEventListener('disconnected', () => {
            this.updateConnectionStatus(false);
            console.log('OBS WebSocket disconnected');
            
            // Tự động kết nối lại sau 5 giây
            if (this.autoConnect) {
                setTimeout(() => this.autoConnectToOBS(), 5000);
            }
        });

        this.obsManager.addEventListener('connectionError', (data) => {
            this.updateConnectionStatus(false);
            console.warn('OBS connection error:', data.error);
            
            // Tự động kết nối lại sau 5 giây
            if (this.autoConnect) {
                setTimeout(() => this.autoConnectToOBS(), 5000);
            }
        });

        // Scene change events
        this.obsManager.addEventListener('sceneChanged', (data) => {
            this.updateCurrentSceneDisplay(data.sceneName);
            console.log(`OBS Scene changed to: ${data.sceneName}`);
            
            // Dispatch custom event cho overlay mode
            this.handleSceneChangeForOverlay(data.sceneName);
        });

        // Listen to game phase changes
        this.listenToGamePhaseChanges();
    }

    /**
     * Lắng nghe thay đổi phase của game (siêu tối ưu - zero debounce)
     */
    listenToGamePhaseChanges() {
        // Cache sections một lần
        const sections = document.querySelectorAll('section[id]');
        
        // Sử dụng requestAnimationFrame thay vì debounce cho smooth hơn
        let rafId = null;
        let lastVisibleSection = null;
        
        const checkVisibleSection = () => {
            rafId = null;
            
            if (!this.autoSceneSwitching) return;
            
            // Tìm section visible (optimized loop)
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                if (!section.classList.contains('hidden')) {
                    const phase = this.mapSectionToPhase(section.id.toLowerCase());
                    
                    // Chỉ switch nếu phase khác với lần trước
                    if (phase && phase !== lastVisibleSection) {
                        lastVisibleSection = phase;
                        this.switchToGamePhase(phase);
                    }
                    break; // Tìm được rồi thì dừng
                }
            }
        };
        
        // Observer với performance tối ưu
        const observer = new MutationObserver(() => {
            // Cancel RAF cũ nếu có
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            // Schedule check trong next frame
            rafId = requestAnimationFrame(checkVisibleSection);
        });

        // Observe tất cả sections
        sections.forEach(section => {
            observer.observe(section, { 
                attributes: true, 
                attributeFilter: ['class']
            });
        });
    }

    /**
     * Lấy section đang hiển thị (không còn dùng, giữ lại cho tương thích)
     */
    getVisibleSection() {
        const sections = document.querySelectorAll('section[id]');
        for (let i = 0; i < sections.length; i++) {
            if (!sections[i].classList.contains('hidden')) {
                return this.mapSectionToPhase(sections[i].id.toLowerCase());
            }
        }
        return null;
    }

    /**
     * Map section ID sang game phase (cached)
     */
    mapSectionToPhase(sectionId) {
        // Cache map trong constructor sẽ nhanh hơn
        if (!this._phaseMap) {
            this._phaseMap = {
                'title': 'title',
                'starti': 'startI',
                'startii': 'startII', 
                'obstacle': 'obstacle',
                'acceleration': 'acceleration',
                'finish': 'finish',
                'additional': 'additional',
                'pointsummary': 'pointSummary',
                'banner': 'playerList'
            };
        }
        return this._phaseMap[sectionId] || null;
    }

    /**
     * Chuyển đổi scene theo game phase (siêu tối ưu - fire and forget)
     */
    switchToGamePhase(phase) {
        // Early returns
        if (!this.obsManager.isConnectedToOBS() || this.lastPhase === phase) {
            return;
        }

        this.lastPhase = phase;

        // Fire and forget - không await để không block UI
        this.obsManager.switchToGamePhase(phase);
    }

    /**
     * Tạo UI controls cho OBS
     */
    createOBSControls() {
        // Nếu không muốn hiển thị controls, không tạo UI
        if (!this.showControls) {
            console.log('OBS Controls hidden by default');
            return;
        }
        
        // Tạo container cho OBS controls
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'obs-controls';
        controlsContainer.className = 'fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 hidden';
        
        controlsContainer.innerHTML = `
            <div class="flex flex-col gap-3">
                <h3 class="text-lg font-bold">OBS Controls</h3>
                
                <!-- Connection Status -->
                <div class="flex items-center gap-2">
                    <div id="obs-status-indicator" class="w-3 h-3 rounded-full bg-red-500"></div>
                    <span id="obs-status-text">Disconnected</span>
                </div>
                
                <!-- Connection Controls -->
                <div class="flex gap-2">
                    <input type="text" id="obs-address" placeholder="ws://localhost:4455" 
                           class="px-2 py-1 bg-gray-700 rounded text-sm" value="ws://localhost:4455">
                    <button id="obs-connect" class="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700">
                        Connect
                    </button>
                    <button id="obs-disconnect" class="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700">
                        Disconnect
                    </button>
                </div>
                
                <!-- Scene Controls -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm">Current Scene:</label>
                    <div id="obs-current-scene" class="text-sm bg-gray-700 px-2 py-1 rounded">
                        None
                    </div>
                </div>
                
                <!-- Manual Scene Control -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm">Manual Scene Switch:</label>
                    <select id="obs-scene-select" class="px-2 py-1 bg-gray-700 rounded text-sm">
                        <option value="">Select Scene...</option>
                    </select>
                    <button id="obs-switch-scene" class="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-700">
                        Switch Scene
                    </button>
                </div>
                
                <!-- Auto Scene Switching -->
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="obs-auto-switch" checked class="rounded">
                    <label for="obs-auto-switch" class="text-sm">Auto Scene Switching</label>
                </div>
                
                <!-- Transition Controls -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm">Transition:</label>
                    <select id="obs-transition-select" class="px-2 py-1 bg-gray-700 rounded text-sm">
                        <option value="Fade">Fade</option>
                        <option value="Cut">Cut</option>
                        <option value="Slide">Slide</option>
                    </select>
                </div>
                
                <!-- Toggle Controls -->
                <div class="flex gap-2">
                    <button id="obs-toggle-controls" class="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-700">
                        Hide Controls
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(controlsContainer);
        
        // Thiết lập event listeners cho controls
        this.setupControlEventListeners();
        
        // Hiển thị controls
        this.showOBSControls();
    }

    /**
     * Thiết lập event listeners cho controls
     */
    setupControlEventListeners() {
        // Connect button
        document.getElementById('obs-connect').addEventListener('click', async () => {
            const address = document.getElementById('obs-address').value;
            await this.obsManager.connect(address);
        });

        // Disconnect button
        document.getElementById('obs-disconnect').addEventListener('click', async () => {
            await this.obsManager.disconnect();
        });

        // Manual scene switch
        document.getElementById('obs-switch-scene').addEventListener('click', async () => {
            const sceneName = document.getElementById('obs-scene-select').value;
            const transitionName = document.getElementById('obs-transition-select').value;
            
            if (sceneName) {
                await this.obsManager.switchScene(sceneName, transitionName);
            }
        });

        // Auto scene switching toggle
        document.getElementById('obs-auto-switch').addEventListener('change', (e) => {
            this.autoSceneSwitching = e.target.checked;
            console.log('Auto scene switching:', this.autoSceneSwitching ? 'enabled' : 'disabled');
        });

        // Toggle controls visibility
        document.getElementById('obs-toggle-controls').addEventListener('click', () => {
            this.toggleOBSControls();
        });
    }

    /**
     * Cập nhật trạng thái kết nối
     */
    updateConnectionStatus(connected) {
        // Chỉ cập nhật nếu controls được hiển thị
        if (!this.showControls) {
            console.log('OBS Status:', connected ? 'Connected' : 'Disconnected');
            return;
        }
        
        const indicator = document.getElementById('obs-status-indicator');
        const statusText = document.getElementById('obs-status-text');
        
        if (indicator && statusText) {
            if (connected) {
                indicator.className = 'w-3 h-3 rounded-full bg-green-500';
                statusText.textContent = 'Connected';
            } else {
                indicator.className = 'w-3 h-3 rounded-full bg-red-500';
                statusText.textContent = 'Disconnected';
            }
        }
    }

    /**
     * Cập nhật hiển thị scene hiện tại
     */
    updateCurrentSceneDisplay(sceneName) {
        console.log('Current OBS Scene:', sceneName || 'None');
        
        // Chỉ cập nhật UI nếu controls được hiển thị
        if (!this.showControls) {
            return;
        }
        
        const currentSceneElement = document.getElementById('obs-current-scene');
        if (currentSceneElement) {
            currentSceneElement.textContent = sceneName || 'None';
        }
    }

    /**
     * Cập nhật danh sách scene trong dropdown
     */
    async updateSceneList() {
        // Chỉ cập nhật nếu controls được hiển thị
        if (!this.showControls) {
            return;
        }
        
        try {
            const sceneInfo = await this.obsManager.getCurrentSceneInfo();
            const sceneSelect = document.getElementById('obs-scene-select');
            
            if (sceneInfo && sceneSelect) {
                sceneSelect.innerHTML = '<option value="">Select Scene...</option>';
                sceneInfo.scenes.forEach(scene => {
                    const option = document.createElement('option');
                    option.value = scene.sceneName;
                    option.textContent = scene.sceneName;
                    sceneSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to update scene list:', error);
        }
    }

    /**
     * Hiển thị OBS controls
     */
    showOBSControls() {
        if (!this.showControls) {
            return; // Không hiển thị nếu đã tắt
        }
        const controls = document.getElementById('obs-controls');
        if (controls) {
            controls.classList.remove('hidden');
        }
    }

    /**
     * Ẩn OBS controls
     */
    hideOBSControls() {
        const controls = document.getElementById('obs-controls');
        if (controls) {
            controls.classList.add('hidden');
        }
    }

    /**
     * Toggle hiển thị OBS controls
     */
    toggleOBSControls() {
        const controls = document.getElementById('obs-controls');
        const toggleBtn = document.getElementById('obs-toggle-controls');
        
        if (controls && toggleBtn) {
            if (controls.classList.contains('hidden')) {
                controls.classList.remove('hidden');
                toggleBtn.textContent = 'Hide Controls';
            } else {
                controls.classList.add('hidden');
                toggleBtn.textContent = 'Show Controls';
            }
        }
    }

    /**
     * Hiển thị notification
     */
    showNotification(message, type = 'info') {
        // Sử dụng toast notification nếu có
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * Kết nối tự động khi trang load
     */
    async autoConnectToOBS() {
        if (!this.autoConnect) {
            return;
        }
        
        try {
            console.log('Auto-connecting to OBS WebSocket...');
            const defaultAddress = 'ws://localhost:4455';
            const connected = await this.obsManager.connect(defaultAddress, '');
            
            if (connected) {
                console.log('Auto-connected to OBS successfully');
                // Tự động phát hiện scene hiện tại
                await this.detectCurrentScene();
            } else {
                console.warn('Auto-connect failed, will retry in 5 seconds...');
                // Thử lại sau 5 giây
                setTimeout(() => this.autoConnectToOBS(), 5000);
            }
        } catch (error) {
            console.error('Auto-connect error:', error);
            // Thử lại sau 5 giây
            setTimeout(() => this.autoConnectToOBS(), 5000);
        }
    }

    /**
     * Tự động phát hiện scene hiện tại
     */
    async detectCurrentScene() {
        try {
            const sceneInfo = await this.obsManager.getCurrentSceneInfo();
            if (sceneInfo) {
                console.log('Current OBS Scene detected:', sceneInfo.currentScene);
                this.updateCurrentSceneDisplay(sceneInfo.currentScene);
                
                // Map scene OBS sang phase của game (nếu cần)
                this.syncGamePhaseWithOBSScene(sceneInfo.currentScene);
            }
        } catch (error) {
            console.error('Failed to detect current scene:', error);
        }
    }

    /**
     * Đồng bộ game phase với OBS scene hiện tại
     */
    syncGamePhaseWithOBSScene(sceneName) {
        // Map ngược từ OBS scene sang game phase
        const reverseSceneMap = {
            'Title Screen': 'title',
            'Start I Phase': 'startI',
            'Start II Phase': 'startII',
            'Obstacle Phase': 'obstacle',
            'Acceleration Phase': 'acceleration',
            'Finish Phase': 'finish',
            'Additional Phase': 'additional',
            'Point Summary': 'pointSummary',
            'Player List': 'playerList'
        };

        const phase = reverseSceneMap[sceneName];
        if (phase) {
            console.log(`OBS Scene "${sceneName}" maps to game phase: ${phase}`);
            // Có thể emit event hoặc cập nhật UI nếu cần
        }
    }

    /**
     * Handle scene change để điều chỉnh UI cho overlay mode
     */
    handleSceneChangeForOverlay(sceneName) {
        // Check nếu scene là Overlay
        const isOverlayMode = sceneName === 'Overlay';
        
        // Dispatch custom event để các module khác có thể lắng nghe
        const event = new CustomEvent('obsSceneChanged', {
            detail: {
                sceneName: sceneName,
                isOverlayMode: isOverlayMode
            }
        });
        window.dispatchEvent(event);
        
        console.log(`OBS Scene Mode: ${isOverlayMode ? 'Overlay' : 'Full Screen'}`);
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.obsManager) {
            this.obsManager.destroy();
        }
        
        const controls = document.getElementById('obs-controls');
        if (controls) {
            controls.remove();
        }
    }
}

// Export cho sử dụng global
window.OBSIntegrationController = OBSIntegrationController;
