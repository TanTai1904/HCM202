import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Shield, 
  Zap, 
  Bomb, 
  Hourglass, 
  Eye, 
  ShieldAlert, 
  Flame, 
  Trophy 
} from 'lucide-react';
import { motion } from 'motion/react';

export const HowToPlay: React.FC = () => {
  const { setPhase } = useGameStore();

  const handleBack = () => {
    audio.playClick();
    setPhase('HOME');
  };

  const handleStart = () => {
    audio.playClick();
    setPhase('TEAM_SELECT_COUNT');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </button>

        <button
          onClick={handleStart}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
        >
          <span>BẮT ĐẦU CHƠI NGAY</span>
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>

      <div className="text-center mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-amber-800 px-3 py-1 rounded-full bg-white border border-amber-300 shadow-sm font-cinzel">
          CẨM NANG CHIẾN THUẬT
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 font-historic">
          LUẬT CHƠI & BÍ KÍP VƯỢT THỬ THÁCH
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
          HCM202 không chỉ là trả lời trắc nghiệm, mà là cuộc đấu trí đồng đội kết hợp chiến lược sử dụng thẻ kỹ năng và chinh phục điểm số!
        </p>
      </div>

      {/* 7 Core Steps */}
      <div className="mb-12">
        <h3 className="text-xl font-black text-red-700 uppercase tracking-wider mb-4 flex items-center gap-2 font-historic">
          <span>7 BƯỚC HÀNH TRÌNH CHÍNH</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              step: '1',
              title: 'CHỌN SỐ ĐỘI & TẠO ĐỘI',
              desc: 'Hỗ trợ linh hoạt 2, 3 hoặc 4 đội. Đặt tên đội, chỉ định nhóm trưởng và các thành viên.',
            },
            {
              step: '2',
              title: 'BƯỚC VÀO BẢN ĐỒ HÀNH TRÌNH',
              desc: 'Chinh phục 6 chặng tri thức: Con người, Giáo dục, Đạo đức, Văn hóa, Thực tiễn và Vòng Chung Kết.',
            },
            {
              step: '3',
              title: 'TRẢ LỜI CÂU HỎI THEO VÒNG',
              desc: 'Các vòng chơi phong phú: Trắc nghiệm tốc độ, Đúng/Sai gài bẫy, Giải mã ý niệm, Thử thách tình huống.',
            },
            {
              step: '4',
              title: 'TÍCH LŨY ĐIỂM & CHUỖI STREAK',
              desc: 'Trả lời đúng liên tiếp để kích hoạt chuỗi lửa 🔥 x2, x3, x4 và nhận thêm +100 điểm thưởng.',
            },
            {
              step: '5',
              title: 'VẬN DỤNG POWER CARDS',
              desc: 'Kích hoạt 50/50, Thêm thời gian, Mở manh mối, hoặc giương Khiên bảo vệ trước đối thủ.',
            },
            {
              step: '6',
              title: 'CƯỚP ĐIỂM (STEAL BOMB)',
              desc: 'Khi đội khác trả lời sai, dùng thẻ STEAL để cướp quyền trả lời và nhận thêm +100 điểm!',
            },
            {
              step: '7',
              title: 'ĐẶT CƯỢC FINAL BATTLE',
              desc: 'Bước vào Vòng Chung Kết: Đặt cược điểm số chiến thuật (100, 300, 500, ALL IN) và giành ngôi vị Quán quân HCM202!',
            },
          ].map(s => (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors"
            >
              <div className="text-3xl font-black text-amber-500/15 absolute -top-1 -right-1 group-hover:text-amber-500/25 transition-colors font-cinzel">
                #{s.step}
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 border border-red-200 text-xs font-black flex items-center justify-center font-mono">
                  {s.step}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">{s.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Power Cards Handbook */}
      <div className="mb-12">
        <h3 className="text-xl font-black text-red-700 uppercase tracking-wider mb-4 flex items-center gap-2 font-historic">
          <span>HỆ THỐNG THẺ BỔ TRỢ (POWER CARDS)</span>
        </h3>
        <p className="text-xs text-slate-600 mb-4 font-medium">
          Mỗi đội được cấp số lượng thẻ giới hạn ngay từ đầu trận (mỗi loại 1 thẻ). Hãy sử dụng đúng thời điểm!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: '🛡️ 50/50',
              badge: 'LOẠI BỎ 2 SAI',
              desc: 'Hệ thống tự động ẩn đi 2 phương án sai, chỉ để lại 2 phương án khả dĩ nhất.',
              color: 'from-amber-50 to-yellow-50 border-amber-300 text-amber-950',
            },
            {
              title: '⚡ DOUBLE POINT',
              badge: 'NHÂN ĐÔI ĐIỂM SỐ',
              desc: 'Nếu đội trả lời chính xác câu hỏi hiện tại, toàn bộ điểm câu hỏi sẽ được nhân đôi (100 → 200, 200 → 400).',
              color: 'from-blue-50 to-cyan-50 border-blue-300 text-blue-950',
            },
            {
              title: '💣 STEAL BOMB',
              badge: 'CƯỚP QUYỀN TRẢ LỜI',
              desc: 'Nếu đội bạn trả lời sai, đội giữ thẻ STEAL có quyền nhấn nút cướp câu hỏi và nhận thêm +100 điểm thưởng!',
              color: 'from-purple-50 to-pink-50 border-purple-300 text-purple-950',
            },
            {
              title: '⏳ EXTRA TIME',
              badge: '+10 GIÂY THỜI GIAN',
              desc: 'Cộng thêm ngay 10 giây vào đồng hồ đếm ngược khi câu hỏi phức tạp cần hội ý.',
              color: 'from-emerald-50 to-teal-50 border-emerald-300 text-emerald-950',
            },
            {
              title: '🔮 REVEAL CLUE',
              badge: 'MỞ MANH MỐI',
              desc: 'Khai mở ngay manh mối tiếp theo trong vòng Giải mã ý niệm (Decode the Idea).',
              color: 'from-indigo-50 to-purple-50 border-indigo-300 text-indigo-950',
            },
            {
              title: '🧱 SHIELD',
              badge: 'KHIÊN BẢO VỆ',
              desc: 'Bảo vệ đội của bạn khỏi bị các đội khác dùng thẻ STEAL cướp điểm khi bạn trả lời sai.',
              color: 'from-rose-50 to-red-50 border-rose-300 text-rose-950',
            },
          ].map(c => (
            <div
              key={c.title}
              className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} border shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-base text-slate-900">{c.title}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 shadow-sm font-cinzel">
                  {c.badge}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring Guide */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-md mb-8">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 font-historic">
          <Trophy className="w-5 h-5 text-amber-600" />
          <span>CƠ CHẾ ĐIỂM SỐ & THƯỞNG</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">CÂU EASY</span>
            <span className="text-2xl font-black text-slate-900 font-mono">100đ</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="text-xs font-bold text-blue-600 uppercase block mb-1">CÂU MEDIUM</span>
            <span className="text-2xl font-black text-blue-800 font-mono">200đ</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200">
            <span className="text-xs font-bold text-purple-600 uppercase block mb-1">CÂU HARD</span>
            <span className="text-2xl font-black text-purple-800 font-mono">300đ</span>
          </div>

          <div className="p-3 rounded-xl bg-red-50/60 border border-red-200">
            <span className="text-xs font-bold text-red-600 uppercase block mb-1">CHUNG KẾT</span>
            <span className="text-2xl font-black text-red-700 font-mono">500đ</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-600">
          <span>🔥 Chuỗi đúng liên tiếp: +100đ</span>
          <span>⚡ Bấm chuông đầu tiên: Quyền trả lời</span>
          <span>💣 Cướp chuông thành công: +100đ</span>
          <span>⚡ Thưởng trả lời nhanh: +50đ</span>
        </div>
      </div>
    </div>
  );
};
