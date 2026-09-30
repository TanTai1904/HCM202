# HCM202: THE JOURNEY OF A GOOD CITIZEN
> **Tagline**: *Learn. Think. Practice. Grow.*  
> **Thể loại**: Team Quiz Battle + Strategy + Educational Adventure  
> **Môn học**: HCM202 – Tư tưởng Hồ Chí Minh  

---

## 🌟 1. GIỚI THIỆU TỔNG QUAN

**HCM202: THE JOURNEY OF A GOOD CITIZEN** là nền tảng Web Game giáo dục đại học hoàn chỉnh cho môn học **Tư tưởng Hồ Chí Minh (HCM202)**, gồm 2 chế độ chơi linh hoạt:

1. ⚡ **ĐẤU CHUÔNG QR CODE (AI NHANH TAY HƠN - SPEED BUZZER BATTLE)**:
   - **Tối ưu cho củng cố bài nhanh trên lớp (5 - 15 phút)**.
   - **Linh hoạt từ 2 đến 8 nhóm thi đấu**: Tùy chỉnh số lượng nhóm và tên nhóm theo ý muốn.
   - **Màn hình Host (Máy chiếu)**: Tự động tạo phòng và hiển thị **Mã QR Code** to, rõ ràng kèm PIN phòng.
   - **Người chơi (Điện thoại di động)**: Quét mã QR bằng Camera điện thoại để vào phòng ngay mà không cần cài app; màn hình điện thoại biến thành **NÚT BẤM CHUÔNG KHỔNG LỒ (Buzzer Button)** cực nhạy, rung phản hồi xúc giác (Haptic vibration) và hiển thị thời gian phản xạ mili-giây.
   - **Cơ chế câu hỏi đặc biệt**: Ngẫu nhiên nhân đôi điểm (🔥 x2), nhân ba điểm (⚡ x3 Jackpot), cùng **🎁 Hộp quà bí mật (Mystery Rewards)** (thưởng thêm điểm, khiên bảo hộ, nhân đôi câu kế, cướp điểm, hoặc thẻ quà bánh kẹo/điểm cộng từ giảng viên).
   - **Mở cướp chuông (Steal)**: Khi một nhóm trả lời sai, Host có thể mở lại chuông cho các nhóm còn lại tiếp tục giật quyền trả lời.
   - **Bục vinh quang & Pháo hoa (Podium)**: Tôn vinh top 3 nhóm xuất sắc nhất trận đấu.

2. 🗺️ **HÀNH TRÌNH 6 CHẶNG (STRATEGY & ADVENTURE)**:
   - Bản đồ hành trình 6 vòng học thuật: Quick Quiz, Truth Check, Decode Idea, Real Life Challenge, Practice, và Final Boss.
   - Hệ thống thẻ kỹ năng (Power Cards) và cá cược điểm số Final Betting.

---

## 📑 2. NGÂN HÀNG CÂU HỎI & TÀI LIỆU
Toàn bộ **146 câu hỏi củng cố chuẩn theo Giáo trình Bộ GD&ĐT (2021)** đã được biên tập và xuất ra file Markdown độc lập:
👉 Xem chi tiết tại: [DANH_SACH_CAU_HOI_HCM202.md](DANH_SACH_CAU_HOI_HCM202.md) (Gồm câu hỏi, các phương án A-B-C-D, đáp án đúng, giải thích chi tiết, nguồn trích dẫn giáo trình, hệ số x1/x2/x3 và phần thưởng).

---

## 🚀 3. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

```bash
# 1. Di chuyển vào thư mục frontend
cd fe

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Chạy môi trường phát triển (Dev Server)
npm run dev
```

Sau khi chạy lệnh, truy cập trình duyệt tại địa chỉ:
👉 **`http://localhost:5173/`**

### Lệnh đóng gói sản phẩm (Production Build):
```bash
npm run build
```

---

## 🗺️ 3. BẢN ĐỒ HÀNH TRÌNH (JOURNEY MAP)

```text
                 🏛️ HCM202 JOURNEY

                       START
                         │
                         ▼
                   🌱 CON NGƯỜI (Round 1: Quick Quiz)
                         │
                         ▼
                    📚 GIÁO DỤC (Round 2: Truth Check)
                         │
                         ▼
                    ❤️ ĐẠO ĐỨC (Round 3: Decode the Idea)
                         │
                         ▼
                    🏛️ VĂN HÓA (Round 4: Real Life Challenge)
                         │
                         ▼
                 🇻🇳 THỰC TIỄN (Round 5: Practice & Application)
                         │
                         ▼
                   👑 FINAL BOSS (Round 6: Final Challenge & Betting)
```

---

## 🃏 4. HỆ THỐNG THẺ BỔ TRỢ (POWER CARDS)

- 🛡️ **50/50**: Loại bỏ 2 phương án sai.
- ⚡ **DOUBLE POINT**: Nhân đôi điểm nếu trả lời đúng.
- 💣 **STEAL**: Cướp quyền trả lời khi đối thủ sai và nhận thêm **+100 điểm thưởng**.
- ⏳ **EXTRA TIME**: Cộng thêm **+10 giây** suy nghĩ.
- 🔮 **REVEAL CLUE**: Mở thêm manh mối trong vòng *Decode the Idea*.
- 🧱 **SHIELD**: Khiên bảo vệ đội khỏi bị cướp điểm khi trả lời sai.

---

## 🖥️ 5. CÔNG CỤ LỚP HỌC (TEACHER & PRESENTATION MODES)

- **🖥️ Presentation Mode**: Phóng to giao diện và tối ưu tương phản cho máy chiếu.
- **🛡️ Teacher / Host Mode**: Tạm dừng, bỏ qua câu hỏi, điều chỉnh giờ, xem trước đáp án, reset game.
- **📚 Question Bank Manager**: Quản lý đầy đủ 146 câu hỏi có sẵn và tạo thêm câu hỏi mới (CRUD).
- **🔊 Web Audio Synthesizer**: Toàn bộ âm thanh hiệu ứng và nhạc nền chạy offline không phụ thuộc internet.
