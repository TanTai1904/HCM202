const fs = require('fs');
const path = require('path');

const categories = [
  { file: 'human.json', title: 'CHƯƠNG 1: TƯ TƯỞNG HỒ CHÍ MINH VỀ CON NGƯỜI' },
  { file: 'culture.json', title: 'CHƯƠNG 2: TƯ TƯỞNG HỒ CHÍ MINH VỀ VĂN HÓA' },
  { file: 'ethics.json', title: 'CHƯƠNG 3: TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐẠO ĐỨC CÁCH MẠNG' },
  { file: 'education.json', title: 'CHƯƠNG 4: TƯ TƯỞNG HỒ CHÍ MINH VỀ GIÁO DỤC' },
  { file: 'practice.json', title: 'CHƯƠNG 5: THỰC TIỄN & VẬN DỤNG' },
  { file: 'real-life.json', title: 'CHƯƠNG 6: TÌNH HUỐNG THỰC TẾ & LIÊN HỆ BẢN THÂN' },
  { file: 'final.json', title: 'CHƯƠNG 7: CÂU HỎI VÒNG CHUNG KẾT (TỔNG HỢP TOÀN KHÓA)' }
];

let md = '# 📚 BỘ CÂU HỎI ÔN TẬP & CỦNG CỐ KIẾN THỨC HCM202 - TƯ TƯỞNG HỒ CHÍ MINH\n\n';
md += '> **Môn học**: Tư tưởng Hồ Chí Minh (HCM202)\n';
md += '> **Định dạng**: Ngân hàng câu hỏi Gameshow Đấu Chuông Bấm / Củng cố kiến thức nhanh\n';
md += '> **Đặc trưng**: Đánh dấu hệ số điểm (x1, x2, x3), cơ chế phần thưởng may mắn (Mystery Rewards) và đáp án kèm giải thích trích dẫn chuẩn Giáo trình Bộ GD&ĐT 2021.\n\n';
md += '---\n\n## 📑 MỤC LỤC CÁC CHƯƠNG\n\n';

categories.forEach((cat, idx) => {
  const filePath = path.join(__dirname, '../fe/src/data/questions', cat.file);
  const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  md += `${idx + 1}. [${cat.title} (${list.length} câu)](#chuong-${idx + 1})\n`;
});

md += '\n---\n\n';

let globalIndex = 1;
const bonusTypes = [
  '⭐ Câu tiêu chuẩn (+100đ)',
  '🔥 Câu hỏi x2 (+200đ - Nhân đôi điểm số)',
  '⚡ Câu hỏi x3 (+300đ - Thử thách bứt phá ngoạn mục)',
  '🎁 Hộp quà bí mật (+150đ hoặc Khiên bảo vệ)',
  '🍬 Thẻ may mắn (Cộng điểm thảo luận môn học / Kẹo quà tặng)'
];

categories.forEach((cat, catIdx) => {
  const filePath = path.join(__dirname, '../fe/src/data/questions', cat.file);
  const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  md += `\n<a id="chuong-${catIdx + 1}"></a>\n\n`;
  md += `## 🚩 ${cat.title}\n\n`;
  md += `*Số lượng: **${list.length} câu***\n\n`;
  
  list.forEach((q) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const bonus = bonusTypes[globalIndex % bonusTypes.length];
    
    md += `### Câu ${globalIndex}. [${q.id}] ${q.question}\n\n`;
    md += `- **Độ khó**: \`${q.difficulty}\` | **Hệ số/Thưởng**: **${bonus}**\n`;
    if (q.scenarioText) {
      md += `- **Bối cảnh tình huống**: *${q.scenarioText}*\n`;
    }
    if (q.clues && q.clues.length > 0) {
      md += `- **Gợi ý**: ${q.clues.join(' → ')}\n`;
    }
    md += `\n**Các phương án:**\n`;
    q.options.forEach((opt, oIdx) => {
      const isCorrect = oIdx === q.correctAnswer;
      md += `- **${letters[oIdx]}**. ${opt}${isCorrect ? '  *(Đáp án đúng)*' : ''}\n`;
    });
    
    const correctLetter = letters[q.correctAnswer] || 'A';
    md += `\n👉 **ĐÁP ÁN ĐÚNG**: **${correctLetter}. ${q.options[q.correctAnswer]}**\n\n`;
    md += `> 💡 **Giải thích chi tiết**: ${q.explanation || 'Theo nội dung chuẩn của Giáo trình Tư tưởng Hồ Chí Minh.'}\n`;
    if (q.sourceTag) {
      md += `>\n> 📖 **Nguồn trích dẫn**: *${q.sourceTag}*\n`;
    }
    md += `\n---\n\n`;
    globalIndex++;
  });
});

const outputPath = path.join(__dirname, '../DANH_SACH_CAU_HOI_HCM202.md');
fs.writeFileSync(outputPath, md, 'utf8');
console.log(`Successfully generated DANH_SACH_CAU_HOI_HCM202.md with ${globalIndex - 1} questions at: ${outputPath}`);
