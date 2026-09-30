import React, { useState } from 'react';
import { ALL_QUESTIONS } from '@/data/questions';
import { X, Search, BookOpen, CheckCircle, Tag, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredQuestions = ALL_QUESTIONS.filter((q) => {
    const matchSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.sourceTag && q.sourceTag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCat = selectedCat === 'ALL' || q.category === selectedCat;
    return matchSearch && matchCat;
  });

  const categories = [
    { id: 'ALL', name: 'Tất cả 146 câu' },
    { id: 'HUMAN', name: 'Chương 1: Con người' },
    { id: 'CULTURE', name: 'Chương 2: Văn hóa' },
    { id: 'ETHICS', name: 'Chương 3: Đạo đức' },
    { id: 'EDUCATION', name: 'Chương 4: Giáo dục' },
    { id: 'PRACTICE', name: 'Chương 5: Thực tiễn' },
    { id: 'REAL_LIFE', name: 'Chương 6: Tình huống' },
    { id: 'FINAL', name: 'Tổng hợp: Chung kết' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl font-sans">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#0F121C] border border-white/[0.12] p-5 sm:p-6 flex flex-col shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>NGÂN HÀNG 146 CÂU HỎI HCM202</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-amber-300 font-mono font-medium">
                    Bộ GD&ĐT 2021
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Tra cứu nhanh câu hỏi, đáp án đúng và nguồn trích dẫn giáo trình
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="py-3.5 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm nội dung câu hỏi, từ khóa, nguồn giáo trình..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCat === cat.id
                      ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 chat-scroll">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono text-slate-400">#{idx + 1} • {q.id}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[10px] font-semibold text-rose-300">
                      {q.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-100 leading-snug">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctAnswer;
                      const letters = ['A', 'B', 'C', 'D'];
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                            isCorrect
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold'
                              : 'bg-white/[0.02] border-white/[0.04] text-slate-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-white/[0.06] text-slate-400'
                          }`}>
                            {letters[oIdx]}
                          </span>
                          <span className="line-clamp-2">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-slate-400 space-y-1">
                    <p className="text-slate-300">
                      <span className="text-amber-400 font-semibold">💡 Giải thích: </span>
                      {q.explanation}
                    </p>
                    {q.sourceTag && (
                      <p className="text-[11px] text-slate-500 font-mono italic">
                        📖 {q.sourceTag}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                Không tìm thấy câu hỏi phù hợp với từ khóa "{searchTerm}".
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuestionBankModal;
