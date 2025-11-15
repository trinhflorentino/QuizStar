# QuizStar - Nền Tảng Tạo Và Tổ Chức Kỳ Thi Với Ứng Dụng AI

![QuizStar](https://img.shields.io/badge/QuizStar-AI%20Powered-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-11.0.1-FFCA28?logo=firebase)
![License](https://img.shields.io/badge/License-Private-red)

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Sử Dụng](#sử-dụng)
- [Triển Khai](#triển-khai)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Đóng Góp](#đóng-góp)
- [Tác Giả](#tác-giả)
- [Giấy Phép](#giấy-phép)

## 🎯 Giới Thiệu

**QuizStar** là nền tảng học tập trực tuyến hỗ trợ giáo viên và học sinh trong việc tạo đề thi, tổ chức kiểm tra và đánh giá năng lực học tập. Nền tảng được phát triển với sự tích hợp trí tuệ nhân tạo (AI) để tự động hóa quy trình xây dựng đề thi, trích xuất câu hỏi từ tài liệu đa dạng và tạo đề thi thông minh phù hợp với Chương trình Giáo dục Phổ thông 2018.

### Đặc Điểm Nổi Bật

- 🤖 **Tích hợp AI**: Sử dụng Google Gemini API để trích xuất và tạo câu hỏi tự động
- 📄 **Đa dạng nguồn dữ liệu**: Hỗ trợ trích xuất từ Word, Excel, hình ảnh
- 🎮 **Trò chơi hóa**: Tích hợp các yếu tố game để tăng hứng thú học tập
- 📊 **Phân tích kết quả**: Báo cáo chi tiết và thống kê kết quả học tập
- 🎨 **Giao diện hiện đại**: Thiết kế responsive với Tailwind CSS
- 🔒 **Bảo mật cao**: Xác thực người dùng qua Firebase Authentication

## ✨ Tính Năng Chính

### Cho Giáo Viên

#### 1. Tạo và Quản Lý Đề Thi
- ✅ Tạo đề thi với nhiều loại câu hỏi: Trắc nghiệm, Đúng/Sai, Tự luận
- ✅ Chèn hình ảnh, công thức toán học (MathJax), phương trình hóa học
- ✅ Tải lên file Word/Excel và trích xuất câu hỏi tự động bằng AI
- ✅ Tạo đề thi từ ma trận đề hoặc danh mục nội dung kiến thức
- ✅ Phân loại câu hỏi theo cấp độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao
- ✅ Tùy chỉnh phân bổ điểm cho từng loại câu hỏi
- ✅ Chỉnh sửa và quản lý đề thi đã tạo

#### 2. AI Hỗ Trợ
- 🤖 Trích xuất câu hỏi từ tài liệu Word, Excel, hình ảnh
- 🤖 Tạo câu hỏi mới từ nội dung kiến thức
- 🤖 Gợi ý câu hỏi phù hợp dựa trên đề thi hiện có
- 🤖 Tự động phân chia câu hỏi theo đề mục và cấp độ khó

#### 3. Quản Lý Kỳ Thi
- 📝 Tạo mã PIN để học sinh tham gia thi
- 👥 Theo dõi danh sách học sinh đã tham gia
- 📊 Xem kết quả chi tiết của từng học sinh
- 📈 Phân tích thống kê kết quả thi
- 💾 Xuất đề thi và kết quả ra file

#### 4. Thư Viện Đề Thi
- 📚 Lưu trữ và quản lý ngân hàng câu hỏi
- 🔍 Tìm kiếm và lọc câu hỏi
- 📥 Import/Export đề thi

### Cho Học Sinh

#### 1. Tham Gia Thi
- 🎯 Nhập mã PIN để truy cập đề thi
- ⏱️ Đếm ngược thời gian làm bài
- 💾 Tự động lưu đáp án
- ✅ Xem kết quả ngay sau khi nộp bài

#### 2. Xem Kết Quả
- 📊 Xem điểm số và đáp án đúng/sai
- 📝 Xem lại bài làm của mình
- 📈 Theo dõi lịch sử các kỳ thi đã tham gia

#### 3. Luyện Tập
- 🎮 Tham gia các trò chơi học tập
- 📚 Ôn tập theo chủ đề

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18.3.1**: Framework JavaScript cho giao diện người dùng
- **React Router DOM 6.28.0**: Điều hướng và quản lý routes
- **Tailwind CSS 3.4.16**: Framework CSS utility-first
- **MathJax**: Hiển thị công thức toán học
- **React Icons**: Thư viện icon

### Backend & Services
- **Firebase 11.0.1**: 
  - Firestore: Cơ sở dữ liệu NoSQL
  - Authentication: Xác thực người dùng
  - Hosting: Triển khai ứng dụng
  - Cloud Storage: Lưu trữ file
- **Google Gemini API**: AI cho trích xuất và tạo câu hỏi
- **Firebase Functions**: Serverless functions

### Công Cụ Hỗ Trợ
- **Mammoth**: Chuyển đổi Word sang HTML
- **Docx**: Tạo file Word
- **File Saver**: Lưu file trên trình duyệt
- **QRCode.react**: Tạo mã QR
- **React Countdown**: Đếm ngược thời gian

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js >= 16.x
- npm >= 8.x hoặc yarn
- Tài khoản Firebase
- Google Cloud API Key (cho Gemini AI)

### Các Bước Cài Đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd QuizStar
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình Firebase**
   - Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
   - Bật các dịch vụ: Authentication, Firestore, Storage, Hosting
   - Copy thông tin cấu hình vào file `src/services/firebaseConfig.js`

4. **Cấu hình Gemini API**
   - Tạo API key tại [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Tạo file `.env` trong thư mục gốc:
     ```env
     REACT_APP_GEMINI_API_KEY=your_api_key_here
     ```

5. **Chạy ứng dụng**
   ```bash
   npm start
   ```
   Ứng dụng sẽ chạy tại `http://localhost:3000`

## ⚙️ Cấu Hình

### Cấu Hình Firebase

Tạo file `src/services/firebaseConfig.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

### Cấu Hình Environment Variables

Tạo file `.env`:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

**Lưu ý**: File `.env` đã được thêm vào `.gitignore` để bảo mật.

## 🚀 Sử Dụng

### Tạo Đề Thi Mới

1. Đăng nhập với tài khoản giáo viên
2. Vào **Dashboard** > **Tạo Đề Thi**
3. Chọn một trong các phương thức:
   - Nhập thủ công
   - Tải file Word/Excel và trích xuất bằng AI
   - Tạo từ ma trận đề
   - Sử dụng AI để tạo câu hỏi mới
4. Cấu hình thời gian, phân bổ điểm
5. Lưu và tạo mã PIN

### Tham Gia Thi

1. Truy cập trang chủ
2. Nhập mã PIN từ giáo viên
3. Làm bài và nộp bài
4. Xem kết quả ngay sau khi nộp

### Quản Lý Kết Quả

1. Vào **Đề Thi Đã Tạo**
2. Chọn đề thi cần xem kết quả
3. Xem danh sách học sinh và điểm số
4. Xem chi tiết bài làm của từng học sinh
5. Xuất báo cáo nếu cần

## 🌐 Triển Khai

### Triển Khai Lên Firebase Hosting

1. **Build ứng dụng**
   ```bash
   npm run build
   ```

2. **Đăng nhập Firebase**
   ```bash
   firebase login
   ```

3. **Khởi tạo Firebase (nếu chưa có)**
   ```bash
   firebase init
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Cấu Hình Bảo Mật API Key

Xem hướng dẫn chi tiết trong file [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quan trọng**: 
- Luôn giới hạn API key trong Google Cloud Console
- Chỉ cho phép domain của bạn sử dụng API key
- Sử dụng API key khác nhau cho development và production

## 📁 Cấu Trúc Dự Án

```
QuizStar/
├── public/                 # Static files
│   ├── index.html
│   ├── assets/            # Images, CSS
│   └── audio/             # Audio files
├── src/
│   ├── components/        # React components
│   │   ├── Form/          # Form components
│   │   ├── AI/            # AI service components
│   │   ├── Notification/  # Notification system
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.js
│   │   └── NotificationContext.js
│   ├── pages/             # Page components
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   ├── TestManagement.js
│   │   └── ...
│   ├── services/          # Firebase services
│   │   └── firebaseConfig.js
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── build/                 # Build output (generated)
├── firebase.json          # Firebase configuration
├── package.json           # Dependencies
├── tailwind.config.js    # Tailwind configuration
└── README.md             # This file
```

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 👥 Tác Giả

**Tác giả phần mềm:** Nguyễn Tiến Trình

**Trường THPT Quảng Trị**


## 📄 Giấy Phép

Dự án này là sản phẩm nghiên cứu khoa học, không được sử dụng cho mục đích thương mại mà không có sự cho phép của tác giả.

## 🔮 Hướng Phát Triển

- [ ] Tích hợp tính năng chấm điểm tự luận bằng AI
- [ ] Phân tích thống kê nâng cao (biểu đồ, xu hướng)
- [ ] Ứng dụng desktop cho tính năng trò chơi (LAN)
- [ ] Hỗ trợ offline mode
- [ ] Tích hợp thanh toán (nếu có tính năng trả phí)
- [ ] Mobile app (React Native)
- [ ] Tích hợp với hệ thống quản lý học tập (LMS)

## 📞 Liên Hệ

Nếu có câu hỏi hoặc góp ý, vui lòng liên hệ qua:
- Email: tientrinhpanda@gmail.com
- Website: [https://quizstar-txqt.web.app](https://quizstar-txqt.web.app)

## 🙏 Lời Cảm Ơn

- Các giáo viên & hoc sinh Trường THPT Quảng Trị
- Cô Thúy Hằng
- Cộng đồng React và Firebase
- Google AI (Gemini API)

---

**QuizStar** - Nền tảng học tập thông minh cho tương lai giáo dục Việt Nam 🚀
