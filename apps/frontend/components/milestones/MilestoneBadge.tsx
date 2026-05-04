'use client';

interface MilestoneBadgeProps {
  titleTr: string;
  earnedAt: string;
  certificateUrl?: string | null;
  shareText?: string;
  palette?: {
    bg?: string;
    accent?: string;
    text?: string;
  };
}

export default function MilestoneBadge({
  titleTr,
  earnedAt,
  certificateUrl,
  shareText,
  palette = { bg: '#F0FDF4', accent: '#22C55E', text: '#15803D' },
}: MilestoneBadgeProps) {
  const date = new Date(earnedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShare = () => {
    if (navigator.share && shareText) {
      navigator.share({ text: shareText, url: 'https://lalabits.art' }).catch(() => {});
    } else if (shareText) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl p-5 shadow-sm border"
      style={{
        backgroundColor: palette.bg,
        borderColor: `${palette.accent}33`,
      }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
        style={{ backgroundColor: palette.accent }}
      >
        🏅
      </div>
      <div className="text-center">
        <p
          className="font-semibold text-sm leading-tight"
          style={{ color: palette.text }}
        >
          {titleTr}
        </p>
        <p className="text-xs mt-1" style={{ color: palette.text, opacity: 0.6 }}>
          {date}
        </p>
      </div>
      <div className="flex gap-2 w-full">
        {certificateUrl && (
          <a
            href={certificateUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg border"
            style={{ borderColor: palette.accent, color: palette.accent }}
          >
            İndir
          </a>
        )}
        {shareText && (
          <button
            onClick={handleShare}
            className="flex-1 text-xs font-medium py-1.5 rounded-lg text-white"
            style={{ backgroundColor: palette.accent }}
          >
            Paylaş
          </button>
        )}
      </div>
    </div>
  );
}
