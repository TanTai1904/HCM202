import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { audio } from '@/utils/audio';
import { 
  Play, 
  BookOpen, 
  Database, 
  Sparkles, 
  Flame, 
  Users, 
  Bell, 
  QrCode, 
  Zap, 
  ArrowRight, 
  Smartphone, 
  Trophy,
  History,
  Landmark,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setPhase } = useGameStore();

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center px-4 py-8 sm:py-14 relative overflow-hidden select-none bg-historic-mesh">
      {/* Historic Ambient Glows: Bright Warm Sunlight & Gold */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-amber-400/20 via-red-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[550px] h-[450px] bg-amber-400/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[550px] h-[450px] bg-red-400/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl w-full text-center relative z-10 my-auto">
        {/* Historic Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 border border-amber-500/50 shadow-lg mb-7 backdrop-blur-md"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shadow-[0_0_8px_#dc2626]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-red-700 font-cinzel">
            TƯ TƯỞNG HỒ CHÍ MINH • HCM202
          </span>
          <span className="text-amber-500/60">•</span>
          <span className="text-xs font-extrabold text-slate-700">
            BỘ GIÁO DỤC & ĐÀO TẠO
          </span>
        </motion.div>

        {/* Hero Title with Historic & Monumental Atmosphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-amber-600/80" />
            <span className="text-xs sm:text-sm font-black text-amber-800 tracking-[0.3em] uppercase font-historic">
              ĐẤU TRƯỜNG TRI THỨC LỊCH SỬ
            </span>
            <span className="h-[2px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-amber-600/80" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 leading-none font-historic">
            HÀNH TRÌNH <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-amber-600 to-amber-700">LỊCH SỬ</span>
          </h1>

          <p className="text-xl sm:text-3xl font-black text-amber-900 tracking-wide mt-3 font-cinzel">
            THE JOURNEY OF A GOOD CITIZEN
          </p>

          <p className="text-base sm:text-lg text-amber-950 font-bold tracking-wide mt-3 max-w-2xl mx-auto italic font-historic">
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam"
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto mt-2 leading-relaxed">
            Hệ thống trò chơi củng cố lý luận và lịch sử tư tưởng Hồ Chí Minh dành riêng cho giảng đường. Kết nối điện thoại làm chuông bấm, đối kháng đồng đội và chinh phục các mốc son lịch sử dân tộc.
          </p>
        </motion.div>

        {/* Centerpiece Hero Card: ĐẤU CHUÔNG QR CODE (BRIGHT & CRISP) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-9 max-w-2xl mx-auto"
        >
          <div
            onClick={() => {
              audio.playClick();
              navigate('/buzzer');
            }}
            className="historic-card group cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="historic-card-inner p-7 sm:p-9 flex flex-col justify-between border border-amber-300/80 group-hover:border-amber-500 transition-colors relative overflow-hidden text-left bg-white">
              {/* Subtle Gold Ambient Shimmer */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/15 via-red-500/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-amber-400/25 transition-all" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-black uppercase tracking-wider border border-red-200 shadow-sm">
                    <Flame className="w-4 h-4 text-red-600 animate-pulse" />
                    CỦNG CỐ NHANH • ĐẤU CHUÔNG QR
                  </span>
                  <span className="text-xs text-amber-800 font-extrabold flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 font-mono shadow-sm">
                    <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                    2 - 8 NHÓM
                  </span>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-red-600/30 border-2 border-amber-300 group-hover:scale-105 transition-transform">
                    <Bell className="w-9 h-9 sm:w-11 sm:h-11 fill-current text-amber-200 animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-red-700 transition-colors tracking-tight font-historic">
                      AI NHANH TAY HƠN?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 leading-relaxed">
                      Quét mã QR bằng điện thoại để biến màn hình thành nút bấm chuông tranh tài. Đội nào bấm nhanh nhất sẽ giành quyền trả lời câu hỏi lịch sử!
                    </p>
                  </div>
                </div>

                {/* Badges of Key Historic Game Mechanics */}
                <div className="mt-6 grid grid-cols-3 gap-2.5 text-xs text-slate-700 font-bold">
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-2 shadow-sm">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">Hệ số x2, x3 điểm</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-red-50/80 border border-red-200 flex items-center gap-2 shadow-sm">
                    <Trophy className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="truncate">Hộp quà may mắn</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-2 shadow-sm">
                    <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Quét QR vào ngay</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-red-700 uppercase tracking-widest block font-cinzel">
                    MỞ PHÒNG THI ĐẤU NGAY ➔
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Hiển thị mã QR và câu hỏi lên màn hình máy chiếu
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white flex items-center justify-center font-black shadow-lg shadow-red-600/30 group-hover:scale-110 group-hover:from-red-500 group-hover:to-amber-500 transition-all">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Historic Statistics Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-300 shadow-sm text-center">
            <span className="text-lg sm:text-xl font-black text-amber-700 font-mono">146</span>
            <p className="text-[11px] text-slate-600 font-bold mt-0.5">Câu hỏi lịch sử 2021</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/90 border border-red-300 shadow-sm text-center">
            <span className="text-lg sm:text-xl font-black text-red-700 font-mono">2 - 8</span>
            <p className="text-[11px] text-slate-600 font-bold mt-0.5">Nhóm đấu thời gian thực</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-300 shadow-sm text-center">
            <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono">&lt; 30ms</span>
            <p className="text-[11px] text-slate-600 font-bold mt-0.5">Độ trễ chuông bấm P2P</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-300 shadow-sm text-center">
            <span className="text-lg sm:text-xl font-black text-amber-800 font-mono">100%</span>
            <p className="text-[11px] text-slate-600 font-bold mt-0.5">Chạy trên Vercel không cần BE</p>
          </div>
        </motion.div>

        {/* Footer Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs"
        >
          <button
            onClick={() => {
              audio.playClick();
              setPhase('QUESTION_BANK');
            }}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-800 border border-slate-200 shadow-sm flex items-center gap-1.5 font-bold transition-all cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Ngân hàng 146 câu hỏi & Đáp án</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setPhase('HOW_TO_PLAY');
            }}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm flex items-center gap-1.5 font-semibold transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Hướng dẫn luật chơi</span>
          </button>
        </motion.div>
      </div>

      <div className="text-[11px] text-amber-900/60 font-semibold font-mono mt-8 z-10 font-cinzel">
        ★ DI SẢN TƯ TƯỞNG HỒ CHÍ MINH • MÔN HỌC HCM202 • TRƯỜNG ĐẠI HỌC FPT ★
      </div>
    </div>
  );
};

export default Home;
