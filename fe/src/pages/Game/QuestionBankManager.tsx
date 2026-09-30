import React, { useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ALL_QUESTIONS } from '@/data/questions';
import type { Question, Category, Difficulty, QuestionType } from '@/types/game';
import { audio } from '@/utils/audio';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  BookOpen, 
  Check, 
  X,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuestionBankManager: React.FC = () => {
  const { customQuestions, addCustomQuestion, deleteQuestion, setPhase } = useGameStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New question form state
  const [newCategory, setNewCategory] = useState<Category>('CULTURE');
  const [newType, setNewType] = useState<QuestionType>('MCQ');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('MEDIUM');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newScenarioText, setNewScenarioText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(0);
  const [newPoints, setNewPoints] = useState(200);
  const [newExplanation, setNewExplanation] = useState('');
  const [newSourceTag, setNewSourceTag] = useState('');

  // Combined dataset (official questions + custom teacher questions)
  const combinedQuestions = useMemo(() => {
    return [...customQuestions, ...ALL_QUESTIONS];
  }, [customQuestions]);

  const filteredQuestions = useMemo(() => {
    return combinedQuestions.filter(q => {
      const matchSearch = 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.scenarioText && q.scenarioText.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;

      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [combinedQuestions, searchQuery, selectedCategory, selectedDifficulty]);

  const handleBack = () => {
    audio.playClick();
    setPhase('HOME');
  };

  const handleSaveNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newOptions.some(o => !o.trim()) || !newExplanation.trim()) {
      alert('Vui lòng điền đầy đủ nội dung câu hỏi, 4 đáp án và lời giải thích.');
      return;
    }

    const questionObj: Question = {
      id: `CUSTOM_${Date.now()}`,
      category: newCategory,
      type: newType,
      difficulty: newDifficulty,
      question: newQuestionText.trim(),
      scenarioText: newScenarioText.trim() ? newScenarioText.trim() : undefined,
      options: newOptions.map(o => o.trim()),
      correctAnswer: newCorrectAnswer,
      points: Number(newPoints),
      explanation: newExplanation.trim(),
      sourceTag: newSourceTag.trim() || 'Giáo viên bổ sung'
    };

    addCustomQuestion(questionObj);
    audio.playCorrect();
    setIsAddModalOpen(false);

    // Reset form
    setNewQuestionText('');
    setNewScenarioText('');
    setNewOptions(['', '', '', '']);
    setNewExplanation('');
    setNewSourceTag('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
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
          onClick={() => {
            audio.playClick();
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM CÂU HỎI MỚI</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-300 text-xs font-bold text-amber-800 mb-2 shadow-sm font-cinzel">
          <Database className="w-3.5 h-3.5 text-amber-600" />
          <span>NGÂN HÀNG ĐỀ THI GIÁO DỤC HCM202</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-historic">
          QUẢN LÝ NGÂN HÀNG CÂU HỎI
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
          Tổng cộng <strong className="text-red-700">{combinedQuestions.length} câu hỏi</strong> (Gồm {ALL_QUESTIONS.length} câu chuẩn giáo trình + {customQuestions.length} câu tự tạo)
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-md mb-6 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nội dung câu hỏi, từ khóa, lời giải..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="ALL">Tất cả Chủ đề</option>
          <option value="HUMAN">CON NGƯỜI</option>
          <option value="EDUCATION">GIÁO DỤC</option>
          <option value="ETHICS">ĐẠO ĐỨC</option>
          <option value="CULTURE">VĂN HÓA</option>
          <option value="PRACTICE">THỰC TIỄN</option>
          <option value="REAL_LIFE">TÌNH HUỐNG</option>
          <option value="FINAL">VÒNG CHUNG KẾT</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="ALL">Tất cả Độ khó</option>
          <option value="EASY">Dễ (100đ)</option>
          <option value="MEDIUM">Trung bình (200đ)</option>
          <option value="HARD">Khó (300đ)</option>
          <option value="BOSS">Boss (500đ)</option>
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const isCustom = q.id.startsWith('CUSTOM_');

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 transition-colors flex flex-col md:flex-row items-start justify-between gap-4 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                    {q.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {q.type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    q.difficulty === 'EASY' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : q.difficulty === 'MEDIUM' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-rose-100 text-rose-800'
                  }`}>
                    {q.difficulty} • +{q.points}đ
                  </span>

                  {isCustom && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
                      GIÁO VIÊN TỰ TẠO
                    </span>
                  )}
                </div>

                {q.scenarioText && (
                  <p className="text-xs text-amber-950 italic mb-1.5 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                    Tình huống: {q.scenarioText}
                  </p>
                )}

                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mb-2">
                  {q.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2 text-xs">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        oIdx === q.correctAnswer
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-mono font-bold">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80 mt-2">
                  <strong className="text-red-700 font-semibold">Giải thích: </strong>
                  {q.explanation}
                </div>
              </div>

              {/* Delete button if custom */}
              {isCustom && (
                <div className="shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
                        audio.playClick();
                        deleteQuestion(q.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Question Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white border border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-historic">
                  <Plus className="w-5 h-5 text-red-600" />
                  <span>THÊM CÂU HỎI MỚI VÀO HỆ THỐNG</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNewQuestion} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Chủ đề:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Category)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500"
                    >
                      <option value="HUMAN">CON NGƯỜI</option>
                      <option value="EDUCATION">GIÁO DỤC</option>
                      <option value="ETHICS">ĐẠO ĐỨC</option>
                      <option value="CULTURE">VĂN HÓA</option>
                      <option value="PRACTICE">THỰC TIỄN</option>
                      <option value="REAL_LIFE">TÌNH HUỐNG</option>
                      <option value="FINAL">VÒNG CHUNG KẾT</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Loại câu hỏi:</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as QuestionType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500"
                    >
                      <option value="MCQ">Trắc nghiệm (MCQ)</option>
                      <option value="TRUE_FALSE">Đúng / Sai</option>
                      <option value="SCENARIO">Tình huống thực tế</option>
                      <option value="GUESS_THE_IDEA">Giải mã ý niệm</option>
                      <option value="BET_QUESTION">Boss Challenge</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Độ khó & Điểm:</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => {
                        const d = e.target.value as Difficulty;
                        setNewDifficulty(d);
                        setNewPoints(d === 'EASY' ? 100 : d === 'MEDIUM' ? 200 : d === 'HARD' ? 300 : 500);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500"
                    >
                      <option value="EASY">Dễ (100đ)</option>
                      <option value="MEDIUM">Trung bình (200đ)</option>
                      <option value="HARD">Khó (300đ)</option>
                      <option value="BOSS">Boss (500đ)</option>
                    </select>
                  </div>
                </div>

                {/* Scenario text if applicable */}
                {newType === 'SCENARIO' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mô tả Tình huống:</label>
                    <textarea
                      rows={2}
                      value={newScenarioText}
                      onChange={(e) => setNewScenarioText(e.target.value)}
                      placeholder="Mô tả bối cảnh tình huống sinh viên..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Question Text */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nội dung Câu hỏi:</label>
                  <input
                    type="text"
                    required
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Nhập câu hỏi theo tư tưởng Hồ Chí Minh..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* 4 Options */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">
                    Các phương án trả lời (Tick vào nút tròn để chọn đáp án ĐÚNG):
                  </label>
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={newCorrectAnswer === idx}
                        onChange={() => setNewCorrectAnswer(idx)}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                        title="Chọn đây là đáp án ĐÚNG"
                      />
                      <span className="font-mono font-bold text-amber-700 w-5">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const opts = [...newOptions];
                          opts[idx] = e.target.value;
                          setNewOptions(opts);
                        }}
                        placeholder={`Phương án ${String.fromCharCode(65 + idx)}...`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giải thích (WHY):</label>
                  <textarea
                    rows={3}
                    required
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    placeholder="Giải thích vì sao đáp án đúng căn cứ vào tư tưởng Bác..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Source Tag */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nguồn trích dẫn (Tùy chọn):</label>
                  <input
                    type="text"
                    value={newSourceTag}
                    onChange={(e) => setNewSourceTag(e.target.value)}
                    placeholder="Ví dụ: Giáo trình Tư tưởng Hồ Chí Minh 2021, Chương VI, tr. 120"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 text-white font-extrabold hover:from-red-500 hover:to-amber-500 shadow-md cursor-pointer border border-amber-300"
                  >
                    Lưu câu hỏi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
