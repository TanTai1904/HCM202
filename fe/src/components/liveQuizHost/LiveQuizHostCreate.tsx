import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { audio } from '@/utils/audio';
import type { LiveQuizConfig } from '@/types/liveQuiz';

interface LiveQuizHostCreateProps {
  onBack: () => void;
  onCreate: (config: Partial<LiveQuizConfig>) => void;
}

const CATEGORY_OPTIONS = [
  { id: 'ALL', name: 'Toàn bộ 146 câu hỏi (Tổng hợp toàn khóa)' },
  { id: 'HUMAN', name: 'Chương 1: Tư tưởng Hồ Chí Minh về Con người' },
  { id: 'CULTURE', name: 'Chương 2: Tư tưởng Hồ Chí Minh về Văn hóa' },
  { id: 'ETHICS', name: 'Chương 3: Tư tưởng về Đạo đức Cách mạng' },
  { id: 'EDUCATION', name: 'Chương 4: Tư tưởng về Giáo dục & Đào tạo' },
  { id: 'PRACTICE', name: 'Chương 5: Thực tiễn Cách mạng & Vận dụng' },
  { id: 'REAL_LIFE', name: 'Tình huống thực tế & Đời sống sinh viên' },
  { id: 'FINAL', name: 'Vòng Chung Kết: Tổng hợp kiến thức & Vận dụng' },
];

export const LiveQuizHostCreate: React.FC<LiveQuizHostCreateProps> = ({ onBack, onCreate }) => {
  const [teamCount, setTeamCount] = useState<2 | 3 | 4>(4);
  const [questionTime, setQuestionTime] = useState<10 | 15 | 20 | 30>(15);
  const [category, setCategory] = useState<string>('ALL');
  const [questionLimit, setQuestionLimit] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playClick();
    onCreate({
      teamCount,
      questionTimeSeconds: questionTime,
      category,
      totalQuestionsToPlay: questionLimit,
    });
  };

  return (
    <div className="min-h-screen bg-ivory-stage flex flex-col justify-between items-center p-6 sm:p-12 select-none font-display">
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6">
        <button
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-sm font-bold text-[#172033]/70 hover:text-[#9E1B32] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-[#172033]/40">
          CẤU HÌNH PHÒNG THI ĐẤU
        </span>
      </div>

      {/* Main Form Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl quiz-card p-6 sm:p-10 text-left my-auto shadow-xl"
      >
        <div className="border-b border-[#172033]/10 pb-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
            THIẾT LẬP TRẬN ĐẤU
          </h2>
          <p className="text-xs sm:text-sm text-[#172033]/60 font-medium font-body mt-1">
            Thiết lập thể thức thi đấu trực tiếp trên máy chiếu lớp học
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Number of Teams */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#172033] flex items-center gap-2 mb-2.5">
              <Users className="w-4 h-4 text-[#9E1B32]" />
              <span>Số lượng đội thi đấu</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {([2, 3, 4] as const).map((count) => {
                const isSelected = teamCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setTeamCount(count);
                    }}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-[#9E1B32] bg-[#9E1B32]/10 text-[#9E1B32] shadow-sm'
                        : 'border-[#172033]/10 bg-white text-[#172033]/70 hover:border-[#172033]/30'
                    }`}
                  >
                    <span className="text-base">{count} Đội</span>
                    <span className="text-[11px] font-normal text-[#172033]/50">
                      {count === 2 ? '🔴 Đỏ • 🔵 Xanh' : count === 3 ? '🔴 🔵 🟡' : '🔴 🔵 🟡 🟠'}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] text-[#172033]/50 font-medium block mt-1.5 font-body">
              ⚡ Hệ thống sẽ tự động chia đều sinh viên vào các đội khi quét mã QR.
            </span>
          </div>

          {/* 2. Question Time */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#172033] flex items-center gap-2 mb-2.5">
              <Clock className="w-4 h-4 text-[#D9A441]" />
              <span>Thời gian mỗi câu hỏi</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([10, 15, 20, 30] as const).map((sec) => {
                const isSelected = questionTime === sec;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setQuestionTime(sec);
                    }}
                    className={`py-3 px-2 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'border-[#D9A441] bg-[#D9A441]/15 text-[#172033] shadow-sm'
                        : 'border-[#172033]/10 bg-white text-[#172033]/70 hover:border-[#172033]/30'
                    }`}
                  >
                    {sec} giây
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Category & Length */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#172033] flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#3F7D5A]" />
              <span>Chuyên đề câu hỏi</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-3 px-3.5 rounded-xl border-2 border-[#172033]/10 bg-white text-[#172033] text-sm font-semibold focus:outline-none focus:border-[#9E1B32] transition-colors cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#172033] mb-1.5">
              <span>Số lượng câu hỏi mỗi trận:</span>
              <span className="text-[#9E1B32] font-black text-sm">{questionLimit} câu</span>
            </div>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionLimit(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    questionLimit === num
                      ? 'bg-[#172033] text-white border-[#172033]'
                      : 'bg-white text-[#172033]/70 border-[#172033]/10 hover:border-[#172033]/30'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#9E1B32] hover:bg-[#851629] text-white font-extrabold text-base tracking-wider uppercase shadow-lg shadow-[#9E1B32]/25 flex items-center justify-center gap-2 cursor-pointer transition-colors mt-8"
          >
            <Sparkles className="w-5 h-5" />
            <span>TẠO PHÒNG ĐẤU</span>
          </motion.button>
        </form>
      </motion.div>

      <div className="w-full max-w-xl text-center text-xs font-medium text-[#172033]/40">
        Phòng đấu sẽ tự tạo mã 4 chữ số và mã QR độ phân giải cao cho máy chiếu.
      </div>
    </div>
  );
};
