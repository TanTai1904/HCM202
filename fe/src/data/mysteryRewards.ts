import type { MysteryReward } from '@/types/buzzer';

export const MYSTERY_REWARDS: MysteryReward[] = [
  {
    type: 'BONUS_POINTS_100',
    title: '⭐ +100 ĐIỂM THƯỞNG',
    description: 'Cộng trực tiếp +100 điểm vào điểm tích lũy của nhóm.',
    icon: '⭐',
    value: 100,
  },
  {
    type: 'BONUS_POINTS_200',
    title: '🌟 +200 ĐIỂM XUẤT SẮC',
    description: 'Cộng lớn +200 điểm cho phần trả lời chuẩn xác và thuyết phục.',
    icon: '🌟',
    value: 200,
  },
  {
    type: 'SHIELD',
    title: '🛡️ KHIÊN MIỄN TRỪ PHẠT',
    description: 'Bảo lưu điểm số, không bị trừ điểm nếu trả lời chưa đúng ở câu tiếp theo.',
    icon: '🛡️',
  },
  {
    type: 'DOUBLE_NEXT',
    title: '🚀 NHÂN ĐÔI ĐIỂM SỐ (X2)',
    description: 'Tự động nhân đôi số điểm ở câu hỏi kế tiếp nhóm giành quyền bấm chuông.',
    icon: '🚀',
  },
  {
    type: 'STEAL_POINTS',
    title: '⚡ CHUYỂN GIAO ĐIỂM (+50)',
    description: 'Chiến thuật: Chuyển 50 điểm từ đội đang dẫn đầu sang điểm nhóm bạn.',
    icon: '⚡',
    value: 50,
  },
  {
    type: 'PHYSICAL_GIFT',
    title: '🎁 QUÀ KHÍCH LỆ TỪ LỚP HỌC',
    description: 'Nhận 1 phần quà bánh nhỏ hoặc điểm cộng chuyên cần môn học HCM202!',
    icon: '🎁',
  },
];

export function getRandomMysteryReward(): MysteryReward {
  const index = Math.floor(Math.random() * MYSTERY_REWARDS.length);
  return MYSTERY_REWARDS[index];
}
