import type { ChapterInfo } from '@/types/game';

export const CHAPTERS: ChapterInfo[] = [
  {
    id: 1,
    title: 'CON NGƯỜI',
    subtitle: 'Mục tiêu & Động lực của cách mạng',
    category: 'HUMAN',
    roundType: 'ROUND_1_QUIZ',
    icon: '🌱',
    description: 'Quan điểm Hồ Chí Minh: con người là vốn quý nhất, vừa là mục tiêu giải phóng vừa là động lực quyết định mọi thắng lợi của sự nghiệp cách mạng.',
    keyPoints: [
      'Con người là thể thống nhất giữa sinh học và xã hội.',
      'Giải phóng con người là mục tiêu cao nhất của chủ nghĩa xã hội.',
      'Chiến lược "trồng người": Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.',
      'Xây dựng con người mới: Vừa "hồng" vừa "chuyên", có tri thức và đạo đức cách mạng.'
    ]
  },
  {
    id: 2,
    title: 'GIÁO DỤC',
    subtitle: 'Nâng cao dân trí & Đào tạo nhân tài',
    category: 'EDUCATION',
    roundType: 'ROUND_2_TRUTH',
    icon: '📚',
    description: 'Chiến lược giáo dục: học để làm việc, làm người, làm cán bộ; gắn lý luận với thực tiễn, phong trào diệt giặc dốt và học tập suốt đời.',
    keyPoints: [
      'Mục tiêu: Học để làm việc, làm người, làm cán bộ.',
      'Phương châm: Học đi đôi với hành, lý luận gắn liền với thực tiễn.',
      'Phong trào diệt giặc dốt, mở mang dân trí, học tập suốt đời.',
      'Phát triển toàn diện thế hệ trẻ: Đức, Trí, Thể, Mỹ.'
    ]
  },
  {
    id: 3,
    title: 'ĐẠO ĐỨC',
    subtitle: 'Cần, Kiệm, Liêm, Chính, Chí công vô tư',
    category: 'ETHICS',
    roundType: 'ROUND_3_DECODE',
    icon: '❤️',
    description: 'Đạo đức cách mạng là cái gốc của người cán bộ, đảng viên và công dân; tu dưỡng thường xuyên và bền bỉ như rửa mặt hằng ngày.',
    keyPoints: [
      'Đạo đức là cái gốc của người cách mạng, như gốc của cây, nguồn của sông.',
      'Bốn đức tính nền tảng: Cần, Kiệm, Liêm, Chính, Chí công vô tư.',
      'Mối quan hệ thiêng liêng: Trung với nước, hiếu với dân.',
      'Nguyên tắc rèn luyện: Nói đi đôi với làm, xây đi đôi với chống, tu dưỡng suốt đời.'
    ]
  },
  {
    id: 4,
    title: 'VĂN HÓA',
    subtitle: 'Soi đường cho quốc dân đi',
    category: 'CULTURE',
    roundType: 'ROUND_4_SCENARIO',
    icon: '🏛️',
    description: 'Văn hóa là một mặt trận, văn hóa soi đường dẫn lối cho sự phát triển của dân tộc, xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc.',
    keyPoints: [
      'Văn hóa vừa là mục tiêu, vừa là động lực của sự nghiệp xây dựng đất nước.',
      'Khẳng định vai trò: "Văn hóa soi đường cho quốc dân đi".',
      'Văn hóa là một mặt trận, người làm văn hóa là chiến sĩ trên mặt trận đó.',
      'Đặc trưng nền văn hóa mới: Dân tộc, khoa học và đại chúng.'
    ]
  },
  {
    id: 5,
    title: 'THỰC TIỄN',
    subtitle: 'Kiểm nghiệm chân lý & Gắn bó nhân dân',
    category: 'PRACTICE',
    roundType: 'ROUND_4_SCENARIO',
    icon: '🇻🇳',
    description: 'Thực tiễn là thước đo chân lý, lý luận phải gắn với hành động cụ thể, tác phong công tác dân chủ sâu sát và phụng sự nhân dân.',
    keyPoints: [
      'Thực tiễn là tiêu chuẩn khách quan cao nhất để kiểm nghiệm chân lý.',
      'Lý luận mà không liên hệ với thực tế là lý luận suông.',
      'Việc gì có lợi cho dân phải hết sức làm, việc gì hại đến dân phải hết sức tránh.',
      'Phong cách công tác: Sâu sát quần chúng, lắng nghe và học hỏi nhân dân.'
    ]
  },
  {
    id: 6,
    title: 'CHUNG KẾT',
    subtitle: 'Tổng hợp Kiến thức & Quyết định Thứ hạng',
    category: 'FINAL',
    roundType: 'FINAL_BATTLE',
    icon: '👑',
    description: 'Vòng đấu tổng hợp toàn diện giữa các nhóm! Vận dụng kiến thức toàn khóa HCM202, chiến thuật lựa chọn mức cược điểm số để xác định thứ hạng chung cuộc.',
    keyPoints: [
      'Tổng hợp kiến thức toàn diện môn học Tư tưởng Hồ Chí Minh.',
      'Chiến thuật điểm số: Tự chọn mức cược theo mức độ tự tin của nhóm.',
      'Vận dụng lý luận vào giải quyết tình huống thực tiễn đời sống sinh viên.'
    ]
  }
];

