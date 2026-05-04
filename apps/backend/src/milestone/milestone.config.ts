import { MilestoneType } from './entities/milestone-type.enum';

export interface MilestoneConfig {
  type: MilestoneType;
  titleTr: string;
  shareText: string;
  palette: {
    bg: string;
    accent: string;
    text: string;
  };
}

export const MILESTONE_CONFIGS: Record<MilestoneType, MilestoneConfig> = {
  // ─── Üretici — Topluluk ───────────────────────────────────────────────────
  [MilestoneType.FIRST_SUPPORTER]: {
    type: MilestoneType.FIRST_SUPPORTER,
    titleTr: 'İlk Destekçi',
    shareText: 'lalabits.art platformunda ilk destekçime kavuştum! Yolculuk başlıyor 🎉',
    palette: { bg: '#F0FDF4', accent: '#22C55E', text: '#15803D' },
  },
  [MilestoneType.TEN_SUPPORTERS]: {
    type: MilestoneType.TEN_SUPPORTERS,
    titleTr: '10 Destekçi',
    shareText: 'lalabits.art\'ta 10 destekçiye ulaştım! Topluluğum büyüyor 🌱',
    palette: { bg: '#F0FDF4', accent: '#16A34A', text: '#15803D' },
  },
  [MilestoneType.FIFTY_SUPPORTERS]: {
    type: MilestoneType.FIFTY_SUPPORTERS,
    titleTr: '50 Destekçi',
    shareText: 'lalabits.art\'ta 50 destekçi! Harika bir topluluğun parçası olmak için teşekkürler 🙌',
    palette: { bg: '#ECFDF5', accent: '#10B981', text: '#065F46' },
  },
  [MilestoneType.HUNDRED_SUPPORTERS]: {
    type: MilestoneType.HUNDRED_SUPPORTERS,
    titleTr: '100 Destekçi',
    shareText: '100 destekçi! lalabits.art\'ta büyük bir dönüm noktasına ulaştım 💯',
    palette: { bg: '#ECFDF5', accent: '#059669', text: '#065F46' },
  },
  [MilestoneType.FIVE_HUNDRED_SUPPORTERS]: {
    type: MilestoneType.FIVE_HUNDRED_SUPPORTERS,
    titleTr: '500 Destekçi',
    shareText: '500 destekçi! lalabits.art\'ta gerçek bir topluluk kurdum 🏆',
    palette: { bg: '#D1FAE5', accent: '#047857', text: '#064E3B' },
  },

  // ─── Üretici — İçerik ─────────────────────────────────────────────────────
  [MilestoneType.FIRST_POST]: {
    type: MilestoneType.FIRST_POST,
    titleTr: 'İlk Gönderi',
    shareText: 'lalabits.art\'ta ilk gönderim yayında! Yolculuk başlıyor ✍️',
    palette: { bg: '#EFF6FF', accent: '#3B82F6', text: '#1D4ED8' },
  },
  [MilestoneType.FIRST_PRODUCT_SOLD]: {
    type: MilestoneType.FIRST_PRODUCT_SOLD,
    titleTr: 'İlk Satış',
    shareText: 'lalabits.art\'ta ilk dijital ürünümü sattım! 🛒',
    palette: { bg: '#FFF7ED', accent: '#F97316', text: '#C2410C' },
  },

  // ─── Üretici — Gelir ──────────────────────────────────────────────────────
  [MilestoneType.FIRST_1K_EARNED]: {
    type: MilestoneType.FIRST_1K_EARNED,
    titleTr: '₺1.000 Kazanç',
    shareText: 'lalabits.art\'ta ilk ₺1.000\'imi kazandım! 💰',
    palette: { bg: '#FFFBEB', accent: '#F59E0B', text: '#B45309' },
  },
  [MilestoneType.FIRST_10K_EARNED]: {
    type: MilestoneType.FIRST_10K_EARNED,
    titleTr: '₺10.000 Kazanç',
    shareText: 'lalabits.art\'ta ₺10.000 kazanç eşiğini aştım! 🎯',
    palette: { bg: '#FEF3C7', accent: '#D97706', text: '#92400E' },
  },
  [MilestoneType.FIRST_100K_EARNED]: {
    type: MilestoneType.FIRST_100K_EARNED,
    titleTr: '₺100.000 Kazanç',
    shareText: 'lalabits.art\'ta ₺100.000 kazanç! İnanılmaz bir yolculuk 🚀',
    palette: { bg: '#FDE68A', accent: '#B45309', text: '#78350F' },
  },

  // ─── Üretici — Zaman ──────────────────────────────────────────────────────
  [MilestoneType.ONE_MONTH]: {
    type: MilestoneType.ONE_MONTH,
    titleTr: '1 Ay',
    shareText: 'lalabits.art\'ta 1 aydır üretiyorum! Her adım önemli 🗓️',
    palette: { bg: '#F5F3FF', accent: '#8B5CF6', text: '#6D28D9' },
  },
  [MilestoneType.SIX_MONTHS]: {
    type: MilestoneType.SIX_MONTHS,
    titleTr: '6 Ay',
    shareText: 'lalabits.art\'ta 6 ay! Azim ve tutku ile devam ediyorum 💪',
    palette: { bg: '#EDE9FE', accent: '#7C3AED', text: '#5B21B6' },
  },
  [MilestoneType.FIRST_YEAR]: {
    type: MilestoneType.FIRST_YEAR,
    titleTr: '1 Yıl',
    shareText: 'lalabits.art\'ta tam 1 yıl! Bu yolculukta yanımda olan herkese teşekkürler 🎂',
    palette: { bg: '#DDD6FE', accent: '#6D28D9', text: '#4C1D95' },
  },

  // ─── Üretici — Özel ───────────────────────────────────────────────────────
  [MilestoneType.FOUNDER_BADGE]: {
    type: MilestoneType.FOUNDER_BADGE,
    titleTr: 'Kurucu Üretici',
    shareText: 'lalabits.art\'ın kurucu üreticilerinden biriyim! 🌟',
    palette: { bg: '#FFF1F2', accent: '#E11D48', text: '#BE123C' },
  },

  // ─── Destekçi — İlk adım ──────────────────────────────────────────────────
  [MilestoneType.FAN_FIRST_SUPPORT]: {
    type: MilestoneType.FAN_FIRST_SUPPORT,
    titleTr: 'İlk Destek',
    shareText: 'lalabits.art\'ta ilk kez bir üreticiyi destekledim! 💙',
    palette: { bg: '#EFF6FF', accent: '#3B82F6', text: '#1D4ED8' },
  },

  // ─── Destekçi — Sadakat ───────────────────────────────────────────────────
  [MilestoneType.FAN_THREE_MONTHS]: {
    type: MilestoneType.FAN_THREE_MONTHS,
    titleTr: '3 Ay Sadakat',
    shareText: '3 aydır destekliyorum! Üreticilerin yanındayım 🤝',
    palette: { bg: '#F0FDF4', accent: '#22C55E', text: '#15803D' },
  },
  [MilestoneType.FAN_SIX_MONTHS]: {
    type: MilestoneType.FAN_SIX_MONTHS,
    titleTr: '6 Ay Sadakat',
    shareText: '6 aydır kesintisiz destek! Gerçek bir destekçi olmanın gururunu yaşıyorum 🏅',
    palette: { bg: '#ECFDF5', accent: '#10B981', text: '#065F46' },
  },
  [MilestoneType.FAN_ONE_YEAR]: {
    type: MilestoneType.FAN_ONE_YEAR,
    titleTr: '1 Yıl Sadakat',
    shareText: 'Tam 1 yıldır aynı üreticiyi destekliyorum! İnanılmaz bir yolculuk 🎂',
    palette: { bg: '#D1FAE5', accent: '#059669', text: '#065F46' },
  },
  [MilestoneType.FAN_ANNIVERSARY]: {
    type: MilestoneType.FAN_ANNIVERSARY,
    titleTr: 'Yıldönümü',
    shareText: 'Destekçilik yıldönümümü kutluyorum! Her yıl daha da güçlü 🎊',
    palette: { bg: '#FEF3C7', accent: '#F59E0B', text: '#92400E' },
  },

  // ─── Destekçi — Genişlik ──────────────────────────────────────────────────
  [MilestoneType.FAN_THREE_CREATORS]: {
    type: MilestoneType.FAN_THREE_CREATORS,
    titleTr: '3 Üretici',
    shareText: 'lalabits.art\'ta 3 üreticiyi destekliyorum! Sanatı yaşatıyoruz 🎨',
    palette: { bg: '#F5F3FF', accent: '#8B5CF6', text: '#6D28D9' },
  },
  [MilestoneType.FAN_TEN_CREATORS]: {
    type: MilestoneType.FAN_TEN_CREATORS,
    titleTr: '10 Üretici',
    shareText: 'lalabits.art\'ta 10 üreticiyi destekliyorum! Topluluk gücü 💫',
    palette: { bg: '#EDE9FE', accent: '#7C3AED', text: '#5B21B6' },
  },

  // ─── Destekçi — Toplam harcama ────────────────────────────────────────────
  [MilestoneType.FAN_500_TL]: {
    type: MilestoneType.FAN_500_TL,
    titleTr: '₺500 Destek',
    shareText: 'lalabits.art\'ta toplam ₺500 destek sağladım! Her kuruş değer 💎',
    palette: { bg: '#FFFBEB', accent: '#F59E0B', text: '#B45309' },
  },
  [MilestoneType.FAN_2000_TL]: {
    type: MilestoneType.FAN_2000_TL,
    titleTr: '₺2.000 Destek',
    shareText: 'lalabits.art\'ta ₺2.000 destek! Üreticilerin en büyük gücü destekçilerdir 🌟',
    palette: { bg: '#FEF3C7', accent: '#D97706', text: '#92400E' },
  },
  [MilestoneType.FAN_10000_TL]: {
    type: MilestoneType.FAN_10000_TL,
    titleTr: '₺10.000 Destek',
    shareText: 'lalabits.art\'ta ₺10.000 destek eşiğini aştım! Gurur verici bir yolculuk 🏆',
    palette: { bg: '#FDE68A', accent: '#B45309', text: '#78350F' },
  },

  // ─── Destekçi — Özel ──────────────────────────────────────────────────────
  [MilestoneType.FAN_FOUNDER_BADGE]: {
    type: MilestoneType.FAN_FOUNDER_BADGE,
    titleTr: 'Kurucu Destekçi',
    shareText: 'lalabits.art\'ın kurucu destekçilerinden biriyim! 🌟',
    palette: { bg: '#FFF1F2', accent: '#E11D48', text: '#BE123C' },
  },
};
