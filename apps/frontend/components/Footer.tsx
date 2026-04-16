'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── Logo beyaz versiyon ─────────────────────────────────────── */
function FooterLogo() {
  return (
    <svg
      width="142"
      height="24"
      viewBox="0 0 142 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="lalabits.art"
    >
      <text
        x="0"
        y="19"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="400"
        fill="#FFFFFF"
      >
        lala
      </text>
      <text
        x="47"
        y="19"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="#FF5722"
      >
        bits
      </text>
      <text
        x="92"
        y="19"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="400"
        fill="#FFFFFF"
      >
        .art
      </text>
    </svg>
  );
}

/* ── Sosyal medya ikonları ───────────────────────────────────── */
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Akordeon sütun (mobil) ──────────────────────────────────── */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 lg:border-0">
      <button
        className="w-full flex items-center justify-between py-4 lg:py-0 lg:cursor-default"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-semibold text-white uppercase tracking-wider">
          {title}
        </span>
        <svg
          className={`h-4 w-4 text-white/50 transition-transform lg:hidden ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <ul
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-200 ${
          open ? 'max-h-96 pb-4' : 'max-h-0 lg:max-h-96'
        } lg:mt-4 lg:pb-0`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a' }} className="text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Sütun 1 — Marka */}
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterLogo />
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-[220px]">
              Türkiye'nin içerik üreticileri için dijital gelir platformu.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://x.com/lalabitsart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://instagram.com/lalabits.art"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com/company/lalabits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/60">
                🇹🇷 Türkiye&apos;nin içerik platformu
              </span>
            </div>
          </div>

          {/* Sütun 2 — Üreticiler */}
          <FooterColumn
            title="Üreticiler"
            links={[
              { label: 'Nasıl çalışır?', href: '/kesfet' },
              { label: 'Üyelik sistemi', href: '/ozellikler#uyelik' },
              { label: 'Dijital ürünler', href: '/ozellikler#magaza' },
              { label: 'Üretici hikayeleri', href: '/kaynaklar/basari-hikayeleri' },
              { label: 'Başlangıç rehberi', href: '/kaynaklar/rehberler' },
            ]}
          />

          {/* Sütun 3 — Özellikler */}
          <FooterColumn
            title="Özellikler"
            links={[
              { label: 'Akış ve yazılar', href: '/ozellikler#akis' },
              { label: 'Koleksiyonlar', href: '/ozellikler#koleksiyonlar' },
              { label: 'Mağaza', href: '/ozellikler#magaza' },
              { label: 'Topluluk sohbeti', href: '/ozellikler#topluluk' },
              { label: 'Bildirimler', href: '/ozellikler#bildirimler' },
            ]}
          />

          {/* Sütun 4 — Fiyatlar */}
          <FooterColumn
            title="Fiyatlar"
            links={[
              { label: 'Plan karşılaştırma', href: '/fiyatlar' },
              { label: 'Komisyon oranları', href: '/fiyatlar#komisyon' },
              { label: 'Ödeme yöntemleri', href: '/fiyatlar#odeme' },
              { label: 'Kazanç hesaplama', href: '/fiyatlar#hesapla' },
            ]}
          />

          {/* Sütun 5 — Kaynaklar */}
          <FooterColumn
            title="Kaynaklar"
            links={[
              { label: 'Blog', href: '/blog' },
              { label: 'Başlangıç rehberi', href: '/kaynaklar/rehberler' },
              { label: 'Üretici akademi', href: '/kaynaklar/rehberler' },
              { label: 'TR üretici raporu', href: '/blog' },
              { label: 'Destek merkezi', href: '/destek' },
            ]}
          />

          {/* Sütun 6 — Şirket */}
          <FooterColumn
            title="Şirket"
            links={[
              { label: 'Hakkımızda', href: '/hakkimizda' },
              { label: 'Misyon', href: '/hakkimizda#misyon' },
              { label: 'Basın kiti', href: '/basin' },
              { label: 'Kariyer', href: '/kariyer' },
              { label: 'İletişim', href: '/iletisim' },
            ]}
          />
        </div>

        {/* Alt bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} lalabits.art — Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/kullanim-sartlari" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="/gizlilik" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Gizlilik
            </Link>
            <Link href="/kvkk" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              KVKK
            </Link>
            <Link href="/cerez-politikasi" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Çerez
            </Link>
            <span className="text-xs text-white/30 border border-white/20 rounded-full px-2 py-0.5">
              Türkçe · ₺ TRY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
