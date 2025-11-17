/**
 * OBS WebSocket Performance Tweaks
 * Các tối ưu bổ sung cho performance tốt nhất
 */

// Tối ưu 1: Preload connection để kết nối nhanh hơn
if (typeof OBSWebSocket !== 'undefined') {
    // Warm up WebSocket connection pool
    const warmUpConnection = () => {
        const ws = new WebSocket('ws://localhost:4455');
        ws.onopen = () => {
            console.log('WebSocket warmed up');
            ws.close();
        };
        ws.onerror = () => {
            // Silent fail, không quan trọng
        };
    };
    
    // Warm up sau 100ms khi page load
    setTimeout(warmUpConnection, 100);
}

// Tối ưu 2: Disable console.log trong production để tăng tốc
const isProduction = false; // Set true khi deploy production

if (isProduction && window.OBSWebSocketManager) {
    const originalSwitchScene = window.OBSWebSocketManager.prototype.switchScene;
    window.OBSWebSocketManager.prototype.switchScene = function(sceneName, transitionName, transitionDuration) {
        // Silent mode - no console logs
        return originalSwitchScene.call(this, sceneName, transitionName, transitionDuration);
    };
}

// Tối ưu 3: Request Animation Frame helper cho smooth transitions
window.OBSRequestAnimationHelper = {
    scheduleSceneSwitch: function(callback) {
        requestAnimationFrame(() => {
            // Execute trong next frame để không block rendering
            callback();
        });
    }
};

// Tối ưu 4: WebSocket keep-alive để tránh reconnect chậm
if (window.obsIntegration?.obsManager?.obs) {
    setInterval(() => {
        const obs = window.obsIntegration.obsManager.obs;
        if (obs && window.obsIntegration.obsManager.isConnected) {
            // Ping OBS mỗi 30 giây để keep connection alive
            obs.call('GetVersion').catch(() => {
                // Silent fail, reconnect sẽ tự động xử lý
            });
        }
    }, 30000);
}

// Tối ưu 5: Prefetch scenes để cache sẵn danh sách
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.obsIntegration?.obsManager?.isConnected) {
            window.obsIntegration.obsManager.refreshScenes();
        }
    }, 2000);
});

// Tối ưu 6: Use Web Worker cho heavy operations (optional)
// Có thể implement sau nếu cần

console.log('OBS WebSocket Performance optimizations loaded');

