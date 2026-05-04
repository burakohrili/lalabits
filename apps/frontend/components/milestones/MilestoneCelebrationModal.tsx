'use client';

import { useEffect } from 'react';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneTitle: string;
  certificateUrl?: string | null;
  shareText?: string;
}

export default function MilestoneCelebrationModal({
  isOpen,
  onClose,
  milestoneTitle,
  certificateUrl,
  shareText,
}: MilestoneCelebrationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator.share && shareText) {
      navigator.share({ text: shareText, url: 'https://lalabits.art' }).catch(() => {});
    } else if (shareText) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Rozet kutlaması"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 rounded-full bg-teal flex items-center justify-center text-4xl mx-auto mb-4">
          🏅
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Tebrikler!</h2>
        <p className="text-neutral-600 mb-1">Yeni bir rozet kazandın</p>
        <p className="font-semibold text-teal mb-6">{milestoneTitle}</p>

        <div className="flex flex-col gap-3">
          {certificateUrl && (
            <a
              href={certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2.5 rounded-xl bg-teal text-white font-medium text-sm"
            >
              Sertifikayı İndir
            </a>
          )}
          {shareText && (
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl border border-teal text-teal font-medium text-sm"
            >
              Paylaş
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-500 text-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
