# OBS WebSocket Integration

Tích hợp OBS WebSocket vào ứng dụng quiz game để tự động điều khiển scene và transition.

## Cài đặt

### 1. Cài đặt OBS Studio
- Tải và cài đặt [OBS Studio](https://obsproject.com/)
- Cài đặt plugin [obs-websocket](https://github.com/obsproject/obs-websocket)

### 2. Cấu hình OBS WebSocket
1. Mở OBS Studio
2. Vào `Tools` → `WebSocket Server Settings`
3. Cấu hình:
   - **Server Port**: 4455 (mặc định)
   - **Server Password**: (tùy chọn, để trống nếu không cần)
   - **Enable Authentication**: Bật nếu muốn dùng mật khẩu
4. Click `Start Server`

### 3. Tạo Scenes trong OBS
Tạo các scenes tương ứng với các phase của game:
- **Title Screen**: Màn hình tiêu đề
- **Start I Phase**: Phase khởi động I
- **Start II Phase**: Phase khởi động II  
- **Obstacle Phase**: Phase chướng ngại vật
- **Acceleration Phase**: Phase tăng tốc
- **Finish Phase**: Phase về đích
- **Point Summary**: Tổng kết điểm
- **Player List**: Danh sách người chơi

## Sử dụng

### 1. Tích hợp vào Projector.html
Các script OBS đã được thêm vào `Projector.html`:

```html
<!-- OBS WebSocket Integration -->
<script src="js/obs/OBSWebSocketManager.js"></script>
<script src="js/obs/OBSIntegrationController.js"></script>
<script src="js/obs/obs-init.js"></script>
```

### 2. Kết nối OBS
1. Mở `Projector.html` trong trình duyệt
2. Click vào nút "Connect" trong OBS Controls (góc trên bên phải)
3. Nhập địa chỉ OBS WebSocket (mặc định: `ws://localhost:4455`)
4. Nhập mật khẩu nếu có

### 3. Điều khiển tự động
- **Auto Scene Switching**: Tự động chuyển scene theo phase của game
- Khi game chuyển phase, OBS sẽ tự động chuyển scene tương ứng
- Có thể tắt/bật tính năng này trong OBS Controls

### 4. Điều khiển thủ công
- **Manual Scene Switch**: Chuyển scene thủ công
- **Transition**: Chọn hiệu ứng chuyển cảnh (Fade, Cut, Slide)
- **Studio Mode**: Bật/tắt chế độ studio
- **Trigger Transition**: Kích hoạt transition trong studio mode

## API Reference

### OBSIntegration Object
```javascript
// Chuyển đổi scene theo phase
await OBSIntegration.switchToPhase('startI');

// Chuyển đổi scene thủ công
await OBSIntegration.switchToScene('Start I Phase', 'Fade');

// Kiểm tra trạng thái kết nối
if (OBSIntegration.isConnected()) {
    console.log('OBS đã kết nối');
}

// Lấy scene hiện tại
const currentScene = OBSIntegration.getCurrentScene();

// Bật/tắt auto scene switching
OBSIntegration.setAutoSceneSwitching(true);

// Hiển thị/ẩn OBS controls
OBSIntegration.toggleControls();

// Kết nối thủ công
await OBSIntegration.connect('ws://localhost:4455', 'password');

// Ngắt kết nối
await OBSIntegration.disconnect();
```

### Debug Functions
```javascript
// Log thông tin OBS hiện tại
OBSDebug.logStatus();

// Test kết nối
await OBSDebug.testConnection();

// List tất cả scenes
await OBSDebug.listScenes();
```

## Keyboard Shortcuts

- **Ctrl + Shift + O**: Toggle OBS controls
- **Ctrl + Shift + C**: Kết nối OBS
- **Ctrl + Shift + D**: Ngắt kết nối OBS

## Demo

Mở file `obs-demo.html` để xem demo đầy đủ các tính năng OBS WebSocket integration.

## Troubleshooting

### Lỗi kết nối
1. Kiểm tra OBS Studio đã mở chưa
2. Kiểm tra WebSocket Server đã bật chưa
3. Kiểm tra địa chỉ và port có đúng không
4. Kiểm tra firewall có chặn kết nối không

### Scene không chuyển
1. Kiểm tra tên scene trong OBS có đúng không
2. Kiểm tra auto scene switching có bật không
3. Kiểm tra console để xem lỗi

### Performance
- Nếu có lag, tăng `sceneTransitionDelay` trong `OBSIntegrationController.js`
- Giảm số lượng event listeners nếu không cần thiết

## Cấu trúc Files

```
js/obs/
├── OBSWebSocketManager.js      # Core OBS WebSocket functionality
├── OBSIntegrationController.js # Integration với game logic
└── obs-init.js                # Initialization script

obs-demo.html                   # Demo page
```

## Dependencies

- [obs-websocket-js](https://github.com/obs-websocket-community-projects/obs-websocket-js) v5.0.6+
- OBS Studio với obs-websocket plugin

## License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
