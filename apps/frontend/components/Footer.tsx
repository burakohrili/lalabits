'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const CREATOR_LINKS = [
  { label: 'Platform nedir?', href: '/lalabits-nedir' },
  { label: 'Özellikler', href: '/ozellikler' },
  { label: 'Fiyatlar ve komisyon', href: '/fiyatlar' },
  { label: 'Başlangıç rehberi', href: '/kaynaklar/rehberler' },
  { label: 'Üretici hikayeleri', href: '/kaynaklar/basari-hikayeleri' },
  { label: 'Üretici ol →', href: '/auth/kayit/yaratici' },
];

const DISCOVER_LINKS = [
  { label: 'Üreticileri keşfet', href: '/kesfet' },
  { label: 'Blog', href: '/blog' },
  { label: 'Rehberler', href: '/kaynaklar/rehberler' },
  { label: 'Destek merkezi', href: '/destek' },
  { label: 'Fan hesabı oluştur →', href: '/auth/kayit/fan' },
];

const COMPANY_LINKS = [
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Kariyer', href: '/kariyer' },
  { label: 'Basın kiti', href: '/basin' },
  { label: 'İletişim', href: '/iletisim' },
];

const CATEGORY_CHIPS = [
  'Yazar', 'Video', 'Podcast', 'Tasarım', '3D', 'Müzik', 'Eğitim', 'AI', 'Oyun',
];

function NavSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="w-full flex items-center justify-between py-3 lg:py-0 lg:cursor-default lg:pointer-events-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {title}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-white/30 transition-transform lg:hidden ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <ul
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-200 ${
          open ? 'max-h-96 pt-3' : 'max-h-0 lg:max-h-96'
        } lg:pt-4`}
      >
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className={`text-sm transition-colors ${
                link.label.endsWith('→')
                  ? 'text-[#FF5722]/80 hover:text-[#FF5722]'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111111' }} className="text-white">

      {/* ── CTA Bandı ──────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#1a1a1a' }} className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-white leading-snug">
              Üretiyorsan, burası senin için.
            </p>
            <p className="text-sm text-white/45 mt-0.5">
              Hayranlarınla bağlantı kur, içeriklerinden gelir elde et.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/auth/kayit/yaratici"
              className="rounded-xl bg-[#FF5722] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e64a19] transition-colors"
            >
              Üretici ol
            </Link>
            <Link
              href="/kesfet"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              Keşfet
            </Link>
          </div>
        </div>
      </div>

      {/* ── Ana Gövde ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Marka bloğu — 2 sütun genişliğinde */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <Image
                src="/brand/logo-white-h-trim.png"
                alt="lalabits.art"
                width={130}
                height={32}
                className="h-7 w-auto"
                style={{ maxHeight: '28px' }}
              />
              <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-[260px]">
                Türkiye&apos;nin içerik üreticileri için dijital gelir platformu.
                Yaz, üret, kazan.
              </p>
            </div>

            {/* Sosyal bağlantılar */}
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/lalabitsart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/35 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://instagram.com/lalabits.art"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/35 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com/company/lalabits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/35 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>

            {/* Kategori çipleri */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/35"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Navigasyon — 3 sütun */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
            <div className="border-t border-white/8 pt-4 lg:border-0 lg:pt-0">
              <NavSection title="İçerik üreticisi" links={CREATOR_LINKS} />
            </div>
            <div className="border-t border-white/8 pt-4 lg:border-0 lg:pt-0">
              <NavSection title="Keşfet & Öğren" links={DISCOVER_LINKS} />
            </div>
            <div className="border-t border-white/8 pt-4 lg:border-0 lg:pt-0">
              <NavSection title="Şirket" links={COMPANY_LINKS} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Alt Yardımcı Bar ───────────────────────────────────── */}
      <div style={{ backgroundColor: '#0d0d0d' }} className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 order-2 sm:order-1">
            © {new Date().getFullYear()} lalabits.art
          </p>
          <nav aria-label="Yasal bağlantılar" className="flex items-center gap-x-4 gap-y-1 flex-wrap justify-center order-1 sm:order-2">
            <Link href="/kullanim-sartlari" className="text-xs text-white/30 hover:text-white/60 transition-colors">Kullanım Şartları</Link>
            <Link href="/gizlilik" className="text-xs text-white/30 hover:text-white/60 transition-colors">Gizlilik</Link>
            <Link href="/kvkk" className="text-xs text-white/30 hover:text-white/60 transition-colors">KVKK</Link>
            <Link href="/cerez-politikasi" className="text-xs text-white/30 hover:text-white/60 transition-colors">Çerez</Link>
            <span className="text-xs text-white/20 border border-white/10 rounded-full px-2 py-0.5 ml-1">🇹🇷 Türkçe · ₺</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
