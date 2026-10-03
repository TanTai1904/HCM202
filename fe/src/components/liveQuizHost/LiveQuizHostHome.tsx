import React, { useState } from 'react';
import { HelpCircle, Info, BookOpen, Sparkles, Users, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveQuizHostHomeProps {
  onStart?: () => void;
}

export const LiveQuizHostHome: React.FC<LiveQuizHostHomeProps> = () => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 sm:p-12 select-none font-display relative overflow-hidden">
      {/* Ambient background light beam effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-[#9E1B32]/5 rounded-full blur-3xl pointer-events-none animate-radar" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D9A441]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main Center Stage */}
      <div className="w-full max-w-4xl text-center my-auto py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#9E1B32]/10 border border-[#9E1B32]/20 text-[#9E1B32] text-xs sm:text-sm font-bold tracking-wider uppercase mb-3 shadow-xs">
            HỌC PHẦN TƯ TƯỞNG HỒ CHÍ MINH • HCM202
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#172033] tracking-tight leading-none mb-3">
            ĐẤU TRÍ TRỰC TIẾP
          </h1>

          <p className="text-sm sm:text-base text-[#172033]/70 font-medium max-w-lg mx-auto mb-8 leading-relaxed font-body">
            Đấu chuông phản xạ & Kéo co tranh quyền trả lời câu hỏi môn học
          </p>

          {/* MAIN GAME MODE CARD: KÉO CO & ĐẤU CHUÔNG */}
          <div className="max-w-xl mx-auto text-left">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-8 rounded-[2rem] bg-white border-2 border-amber-500/25 hover:border-amber-500/60 shadow-[0_20px_50px_rgba(245,158,11,0.15)] flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Subtle ambient corner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/15 via-orange-500/8 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-amber-500/25 transition-all" />

              <div>
                {/* Header Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-3xl shadow-xs text-amber-600 group-hover:scale-105 transition-transform">
                    🪢
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/25 text-xs font-black uppercase tracking-wider shadow-xs animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    CÓ KÉO CO TRANH QUYỀN
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight flex items-center gap-2">
                  <span>ĐẤU CHUÔNG & KÉO CO</span>
                </h3>
                
                <p className="text-xs sm:text-sm text-[#172033]/70 font-body leading-relaxed mt-2.5">
                  Cơ chế <strong className="text-amber-600 font-bold">KÉO CO</strong>: các đội bấm liên tục trên điện thoại để kéo qua vạch đích, đội kéo nhanh nhất giành quyền trả lời! Có mở chuông cướp quyền (Steal) và cộng điểm thời gian thực.
                </p>

                {/* Feature Chips */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-[#172033]/5 border border-[#172033]/10 text-xs font-semibold text-[#172033]/80">
                    ⚡ Phản xạ 1 chạm
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#172033]/5 border border-[#172033]/10 text-xs font-semibold text-[#172033]/80">
                    🪢 Kéo co P2P
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700">
                    👥 2 - 8 Đội chơi
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-700">
                    🎁 Hộp quà & Hệ số x2/x3
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#172033]/10 flex flex-col gap-2">
                <a
                  href="/buzzer"
                  onClick={() => audio.playClick()}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-base tracking-wider shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/20 text-center uppercase active:scale-[0.98]"
                >
                  <span>BẮT ĐẦU ĐẤU CHUÔNG & KÉO CO</span>
                  <span className="text-lg font-bold">➔</span>
                </a>
                <span className="text-xs text-[#172033]/50 text-center font-mono">
                  URL Host: /buzzer • Điện thoại: /buzzer-play
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer Navigation */}
      <div className="w-full max-w-md flex items-center justify-center gap-8 text-sm font-semibold text-[#172033]/60">
        <button
          onClick={() => setShowHowToPlay(true)}
          className="flex items-center gap-1.5 hover:text-[#9E1B32] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Hướng dẫn chơi</span>
        </button>
        <span className="text-[#172033]/20">•</span>
        <button
          onClick={() => setShowAbout(true)}
          className="flex items-center gap-1.5 hover:text-[#9E1B32] transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
          <span>Giới thiệu môn học</span>
        </button>
      </div>

      {/* How to play modal */}
      <AnimatePresence>
        {showHowToPlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-[#172033]/10 shadow-2xl text-left max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#172033]/10">
                <h3 className="text-lg sm:text-xl font-black text-[#172033] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <span>Hướng dẫn: Đấu Chuông & Kéo Co</span>
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Chuông Bấm & Kéo Co
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-sm text-[#172033]/85 font-body leading-relaxed overflow-y-auto pr-1">
                {/* 1. Mục tiêu */}
                <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#172033]/5">
                  <div className="flex items-center gap-2 font-black text-sm text-[#9E1B32] mb-1.5 font-display uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" />
                    <span>1. Mục tiêu</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#172033]/80 font-medium">
                    <li>Ôn tập, củng cố kiến thức môn học <strong>Tư tưởng Hồ Chí Minh (HCM202)</strong> qua hình thức đối kháng trực quan, kịch tính.</li>
                    <li>Rèn luyện phản xạ nhanh nhạy và tinh thần đồng đội giữa các nhóm trong lớp.</li>
                    <li>Giành quyền trả lời nhiều câu hỏi nhất để đạt điểm cao nhất và vinh danh trên bục chiến thắng.</li>
                  </ul>
                </div>

                {/* 2. Cách chơi */}
                <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#172033]/5">
                  <div className="flex items-center gap-2 font-black text-sm text-[#1D4ED8] mb-1.5 font-display uppercase tracking-wide">
                    <Users className="w-4 h-4" />
                    <span>2. Cách chơi</span>
                  </div>
                  <div className="space-y-1.5 text-xs sm:text-sm text-[#172033]/80 font-medium">
                    <p><strong>• Bước 1 - Quét QR:</strong> Sinh viên dùng camera điện thoại quét mã QR chiếu trên máy chiếu để vào phòng đấu ngay.</p>
                    <p><strong>• Bước 2 - Tham gia đội:</strong> Chọn đội thi đấu (2 - 8 đội). Màn hình điện thoại biến thành nút bấm chuông & nút kéo co siêu nhạy.</p>
                    <p><strong>• Bước 3 - Kéo co / Bấm chuông:</strong> Khi câu hỏi hiển thị, cả đội bấm liên tục trên điện thoại để kéo dây co về vạch đích của mình hoặc bấm chuông giật quyền trả lời!</p>
                  </div>
                </div>

                {/* 3. Luật chơi */}
                <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#172033]/5">
                  <div className="flex items-center gap-2 font-black text-sm text-[#3F7D5A] mb-1.5 font-display uppercase tracking-wide">
                    <Award className="w-4 h-4" />
                    <span>3. Luật chơi</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#172033]/80 font-medium">
                    <li><strong>Quyền trả lời:</strong> Đội kéo dây qua vạch đích trước hoặc bấm chuông nhanh nhất (mili-giây) sẽ giành quyền trả lời trong 15s.</li>
                    <li><strong>Tính điểm:</strong> Trả lời <strong>ĐÚNG</strong> nhận trọn điểm câu hỏi (kèm hệ số x2, x3 hoặc hộp quà may mắn).</li>
                    <li><strong>Mở cướp chuông (Steal):</strong> Nếu đội giành quyền trả lời SAI, Host mở chuông cho các đội còn lại tiếp tục giật quyền cướp điểm!</li>
                    <li><strong>Bục vinh quang:</strong> Kết thúc trận đấu, Top 3 đội xuất sắc nhất sẽ được vinh danh trên bục Podium!</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowHowToPlay(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#172033] text-white font-bold text-sm cursor-pointer hover:bg-[#25324d] transition-colors shadow-md"
              >
                ĐÃ HIỂU
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#172033]/10 shadow-2xl text-left"
            >
              <h3 className="text-xl font-black text-[#172033] mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#9E1B32]" />
                <span>Về nền tảng Đấu Trí Trực Tiếp HCM202</span>
              </h3>
              <p className="text-sm text-[#172033]/80 font-body leading-relaxed mb-4">
                Hệ thống gameshow đối kháng bấm chuông & kéo co thời gian thực phục vụ giảng dạy và ôn tập học phần <strong>Tư tưởng Hồ Chí Minh (HCM202)</strong>.
              </p>
              <p className="text-xs text-[#172033]/60 font-body leading-relaxed mb-6">
                Toàn bộ ngân hàng 146 câu hỏi được biên soạn bám sát giáo trình chuẩn của Bộ Giáo dục & Đào tạo (2021).
              </p>
              <button
                onClick={() => setShowAbout(false)}
                className="w-full py-3 rounded-xl bg-[#172033] text-white font-bold text-sm cursor-pointer hover:bg-[#25324d] transition-colors"
              >
                ĐÓNG
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
