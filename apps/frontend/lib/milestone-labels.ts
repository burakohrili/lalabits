export interface MilestoneMeta {
  titleTr: string;
  palette: {
    bg: string;
    accent: string;
    text: string;
  };
}

export const MILESTONE_LABEL_MAP: Record<string, MilestoneMeta> = {
  first_supporter: { titleTr: 'İlk Destekçi', palette: { bg: '#F0FDF4', accent: '#22C55E', text: '#15803D' } },
  ten_supporters: { titleTr: '10 Destekçi', palette: { bg: '#F0FDF4', accent: '#16A34A', text: '#15803D' } },
  fifty_supporters: { titleTr: '50 Destekçi', palette: { bg: '#ECFDF5', accent: '#10B981', text: '#065F46' } },
  hundred_supporters: { titleTr: '100 Destekçi', palette: { bg: '#ECFDF5', accent: '#059669', text: '#065F46' } },
  five_hundred_supporters: { titleTr: '500 Destekçi', palette: { bg: '#D1FAE5', accent: '#047857', text: '#064E3B' } },
  first_post: { titleTr: 'İlk Gönderi', palette: { bg: '#EFF6FF', accent: '#3B82F6', text: '#1D4ED8' } },
  first_product_sold: { titleTr: 'İlk Satış', palette: { bg: '#FFF7ED', accent: '#F97316', text: '#C2410C' } },
  first_1k_earned: { titleTr: '₺1.000 Kazanç', palette: { bg: '#FFFBEB', accent: '#F59E0B', text: '#B45309' } },
  first_10k_earned: { titleTr: '₺10.000 Kazanç', palette: { bg: '#FEF3C7', accent: '#D97706', text: '#92400E' } },
  first_100k_earned: { titleTr: '₺100.000 Kazanç', palette: { bg: '#FDE68A', accent: '#B45309', text: '#78350F' } },
  one_month: { titleTr: '1 Ay', palette: { bg: '#F5F3FF', accent: '#8B5CF6', text: '#6D28D9' } },
  six_months: { titleTr: '6 Ay', palette: { bg: '#EDE9FE', accent: '#7C3AED', text: '#5B21B6' } },
  first_year: { titleTr: '1 Yıl', palette: { bg: '#DDD6FE', accent: '#6D28D9', text: '#4C1D95' } },
  founder_badge: { titleTr: 'Kurucu Üretici', palette: { bg: '#FFF1F2', accent: '#E11D48', text: '#BE123C' } },
  fan_first_support: { titleTr: 'İlk Destek', palette: { bg: '#EFF6FF', accent: '#3B82F6', text: '#1D4ED8' } },
  fan_three_months: { titleTr: '3 Ay Sadakat', palette: { bg: '#F0FDF4', accent: '#22C55E', text: '#15803D' } },
  fan_six_months: { titleTr: '6 Ay Sadakat', palette: { bg: '#ECFDF5', accent: '#10B981', text: '#065F46' } },
  fan_one_year: { titleTr: '1 Yıl Sadakat', palette: { bg: '#D1FAE5', accent: '#059669', text: '#065F46' } },
  fan_anniversary: { titleTr: 'Yıldönümü', palette: { bg: '#FEF3C7', accent: '#F59E0B', text: '#92400E' } },
  fan_three_creators: { titleTr: '3 Üretici', palette: { bg: '#F5F3FF', accent: '#8B5CF6', text: '#6D28D9' } },
  fan_ten_creators: { titleTr: '10 Üretici', palette: { bg: '#EDE9FE', accent: '#7C3AED', text: '#5B21B6' } },
  fan_500_tl: { titleTr: '₺500 Destek', palette: { bg: '#FFFBEB', accent: '#F59E0B', text: '#B45309' } },
  fan_2000_tl: { titleTr: '₺2.000 Destek', palette: { bg: '#FEF3C7', accent: '#D97706', text: '#92400E' } },
  fan_10000_tl: { titleTr: '₺10.000 Destek', palette: { bg: '#FDE68A', accent: '#B45309', text: '#78350F' } },
  fan_founder_badge: { titleTr: 'Kurucu Destekçi', palette: { bg: '#FFF1F2', accent: '#E11D48', text: '#BE123C' } },
};
