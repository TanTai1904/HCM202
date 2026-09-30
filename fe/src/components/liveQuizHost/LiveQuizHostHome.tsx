import React, { useState } from 'react';
import { Play, HelpCircle, Info, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '@/utils/audio';

interface LiveQuizHostHomeProps {
  onStart: () => void;
}

export const LiveQuizHostHome: React.FC<LiveQuizHostHomeProps> = ({ onStart }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [soundOn, setSoundOn] = useState(audio.isSoundOn());

  const handleToggleSound = () => {
    const newState = audio.toggleSound();
    setSoundOn(newState);
    if (newState) audio.playClick();
  };

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 sm:p-12 select-none font-display relative overflow-hidden">
      {/* Ambient background light beam effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-[#9E1B32]/5 rounded-full blur-3xl pointer-events-none animate-radar" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D9A441]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Brand Tag & Sound Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex items-center justify-between text-xs sm:text-sm font-semibold text-[#172033]/60 uppercase tracking-widest relative z-10"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9E1B32] animate-pulse" />
          <span>ĐẤU TRƯỜNG TRẮC NGHIỆM TRỰC TIẾP TẠI LỚP</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/80 border border-[#172033]/10 hover:border-[#9E1B32] hover:text-[#9E1B32] transition-colors cursor-pointer text-xs font-bold"
            title="Bật/Tắt âm thanh hiệu ứng"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#3F7D5A]" /> : <VolumeX className="w-3.5 h-3.5 text-[#B84A4A]" />}
            <span>{soundOn ? 'ÂM THANH: BẬT' : 'ÂM THANH: TẮT'}</span>
          </button>
          <span className="hidden sm:inline">BỘ GD&ĐT 2021 • ĐẠI HỌC</span>
        </div>
      </motion.div>

      {/* Main Center Stage */}
      <div className="w-full max-w-2xl text-center my-auto py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#9E1B32]/10 border border-[#9E1B32]/20 text-[#9E1B32] text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 shadow-xs">
            HỌC PHẦN TƯ TƯỞNG HỒ CHÍ MINH
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#172033] tracking-tight leading-none mb-3">
            HCM202
          </h1>

          <div className="text-2xl sm:text-4xl font-black text-[#9E1B32] tracking-wider uppercase mb-4">
            ĐẤU TRÍ TRỰC TIẾP
          </div>

          <p className="text-base sm:text-xl text-[#172033]/70 font-medium max-w-lg mx-auto mb-10 leading-relaxed font-body">
            Học • Hiểu • Vận dụng • Cạnh tranh
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              audio.playClick();
              onStart();
            }}
            className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-[#9E1B32] hover:bg-[#851629] text-white font-extrabold text-lg sm:text-xl tracking-wide shadow-xl shadow-[#9E1B32]/25 flex items-center justify-center gap-3 mx-auto cursor-pointer border-2 border-white/20 transition-all"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>BẮT ĐẦU TRẬN ĐẤU</span>
          </motion.button>
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
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#172033]/10 shadow-2xl text-left"
            >
              <h3 className="text-xl font-black text-[#172033] mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#9E1B32]" />
                <span>Quy trình tham gia lớp học</span>
              </h3>
              <div className="space-y-3 text-sm text-[#172033]/80 font-body leading-relaxed">
                <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#172033]/5">
                  <strong className="text-[#9E1B32]">1. Quét QR:</strong> Sinh viên dùng camera điện thoại quét mã QR chiếu trên bảng để vào phòng.
                </div>
                <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#172033]/5">
                  <strong className="text-[#9E1B32]">2. Nhập tên & Vào đội:</strong> Nhập tên của bạn, chọn hoặc nhận màu đội (Đỏ, Xanh, Vàng...).
                </div>
                <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#172033]/5">
                  <strong className="text-[#9E1B32]">3. Trả lời trực tiếp:</strong> Câu hỏi hiển thị trên máy chiếu, điện thoại hiển thị 4 nút bấm A, B, C, D để chọn nhanh.
                </div>
                <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#172033]/5">
                  <strong className="text-[#9E1B32]">4. Ghi điểm đồng đội:</strong> Mỗi câu đúng cộng điểm vào bảng tổng sắp của nhóm!
                </div>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="mt-6 w-full py-3 rounded-xl bg-[#172033] text-white font-bold text-sm cursor-pointer hover:bg-[#25324d] transition-colors"
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
                <span>Về nền tảng HCM202 LIVE QUIZ</span>
              </h3>
              <p className="text-sm text-[#172033]/80 font-body leading-relaxed mb-4">
                Hệ thống gameshow trắc nghiệm tương tác thời gian thực phục vụ giảng dạy và ôn tập học phần <strong>Tư tưởng Hồ Chí Minh (HCM202)</strong>.
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
