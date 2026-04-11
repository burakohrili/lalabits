'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

type Plan = 'baslangic' | 'pro' | 'kurumsal';

const PLANLAR: Record<Plan, { ad: string; oran: number; onerilen?: boolean }> = {
  baslangic: { ad: 'Başlangıç', oran: 0.08 },
  pro: { ad: 'Pro', oran: 0.06, onerilen: true },
  kurumsal: { ad: 'Kurumsal', oran: 0.04 },
};

function formatTL(sayi: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(sayi);
}

export default function KomisyonHesaplaci() {
  const [destekci, setDestekci] = useState(100);
  const [fiyat, setFiyat] = useState(89);
  const [plan, setPlan] = useState<Plan>('pro');

  const handleDestekci = useCallback((val: number) => {
    setDestekci(Math.min(50000, Math.max(1, val)));
  }, []);

  const handleFiyat = useCallback((val: number) => {
    setFiyat(Math.min(9999, Math.max(9, val)));
  }, []);

  const brutGelir = destekci * fiyat;
  const komisyonOrani = PLANLAR[plan].oran;
  const komisyon = Math.round(brutGelir * komisyonOrani);
  const netAylik = brutGelir - komisyon;
  const netYillik = netAylik * 12;

  return (
    <div className="rounded-[24px] border border-border bg-white p-8">
      {/* Başlık */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-primary mb-2">Kazancını Hesapla</h3>
        <p className="text-sm text-text-secondary">
          Hedef destekçi sayın ve ortalama aylık bedeli gir, net kazancını görelim.
        </p>
      </div>

      {/* Plan seçimi */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Plan</p>
        <div className="flex flex-col sm:flex-row gap-2">
          {(Object.entries(PLANLAR) as [Plan, typeof PLANLAR[Plan]][]).map(([key, p]) => (
            <label
              key={key}
              className={`flex items-center gap-3 flex-1 cursor-pointer rounded-xl border px-4 py-3 transition-colors ${
                plan === key
                  ? 'border-teal bg-teal-light'
                  : 'border-border hover:border-teal/40'
              }`}
            >
              <input
                type="radio"
                name="plan"
                value={key}
                checked={plan === key}
                onChange={() => setPlan(key)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  plan === key ? 'border-teal' : 'border-border'
                }`}
              >
                {plan === key && <div className="w-2 h-2 rounded-full bg-teal" />}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${plan === key ? 'text-teal' : 'text-text-primary'}`}>
                  {p.ad}
                </span>
                <span className={`text-xs ${plan === key ? 'text-teal/70' : 'text-text-muted'}`}>
                  %{p.oran * 100}
                </span>
                {p.onerilen && (
                  <span className="rounded-full bg-orange text-white text-[10px] font-bold px-2 py-0.5 leading-none">
                    ÖNERİLEN
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Girdi — Destekçi */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-text-primary">Aylık destekçi sayısı</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={50000}
              value={destekci}
              onChange={(e) => handleDestekci(Number(e.target.value))}
              className="w-20 rounded-lg border border-border px-2 py-1 text-right text-sm font-semibold text-text-primary focus:outline-none focus:border-teal"
            />
            <span className="text-xs text-text-muted">destekçi</span>
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={50000}
          step={1}
          value={destekci}
          onChange={(e) => handleDestekci(Number(e.target.value))}
          className="w-full h-2 appearance-none rounded-full bg-teal-light accent-teal cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-muted">1</span>
          <span className="text-[10px] text-text-muted">50.000</span>
        </div>
      </div>

      {/* Girdi — Fiyat */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-text-primary">Ortalama aylık üyelik bedeli</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">₺</span>
            <input
              type="number"
              min={9}
              max={9999}
              value={fiyat}
              onChange={(e) => handleFiyat(Number(e.target.value))}
              className="w-20 rounded-lg border border-border px-2 py-1 text-right text-sm font-semibold text-text-primary focus:outline-none focus:border-teal"
            />
          </div>
        </div>
        <input
          type="range"
          min={9}
          max={9999}
          step={1}
          value={fiyat}
          onChange={(e) => handleFiyat(Number(e.target.value))}
          className="w-full h-2 appearance-none rounded-full bg-teal-light accent-teal cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-muted">₺9</span>
          <span className="text-[10px] text-text-muted">₺9.999</span>
        </div>
      </div>

      {/* Sonuç */}
      <div className="rounded-[16px] bg-background border border-border p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Brüt Gelir</span>
            <span className="text-sm font-semibold text-text-primary">{formatTL(brutGelir)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Platform komisyonu (%{komisyonOrani * 100})
            </span>
            <span className="text-sm font-semibold text-orange">− {formatTL(komisyon)}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-text-primary">Aylık net kazanç</span>
              <span className="text-[28px] font-black text-orange leading-none">{formatTL(netAylik)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Yıllık net kazanç</span>
              <span className="text-lg font-bold text-teal">{formatTL(netYillik)}</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-text-muted leading-[1.5]">
          Tahmini hesaplamadır. Ödeme altyapısı işlem ücreti ayrıca uygulanabilir.
          Gerçek rakamlar için{' '}
          <Link href="/fiyatlar" className="text-teal hover:underline">
            /fiyatlar
          </Link>{' '}
          sayfasına bakın.
        </p>
      </div>

      {/* Alt CTA */}
      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted mb-3">Başlamak tamamen ücretsiz.</p>
        <Link
          href="/kayit/uretici"
          className="inline-block w-full rounded-xl bg-orange px-6 py-3.5 text-sm font-semibold text-white hover:bg-orange-dark transition-colors text-center"
        >
          Üretici hesabı aç
        </Link>
      </div>
    </div>
  );
}
