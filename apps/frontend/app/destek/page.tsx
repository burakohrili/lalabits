'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── Konu kategorileri ────────────────────────────────────────── */
const KATEGORILER = [
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    baslik: 'Hesap & Profil',
    aciklama: 'Kayıt, giriş, şifre, profil düzenleme',
    renk: 'bg-teal-light text-teal',
    href: '#hesap',
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 15h3M15 15h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    baslik: 'Ödeme & Fatura',
    aciklama: 'Ödeme yöntemleri, fatura, iade',
    renk: 'bg-orange-light text-orange-dark',
    href: '#odeme',
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    baslik: 'Üyelik Planları',
    aciklama: 'Abonelik, iptal, plan değişikliği',
    renk: 'bg-teal-light text-teal',
    href: '#uyelik',
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    baslik: 'İçerik & Gönderiler',
    aciklama: 'Yazı, dosya, koleksiyon yönetimi',
    renk: 'bg-orange-light text-orange-dark',
    href: '#icerik',
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    baslik: 'Üretici Araçları',
    aciklama: 'Dashboard, kazanç, istatistikler',
    renk: 'bg-teal-light text-teal',
    href: '#uretici',
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    baslik: 'Teknik Sorunlar',
    aciklama: 'Hata bildirimi, erişim sorunları',
    renk: 'bg-orange-light text-orange-dark',
    href: '#teknik',
  },
];

/* ── SSS verisi ───────────────────────────────────────────────── */
const SSS_URETICI = [
  {
    soru: 'Üretici hesabı açmak ücretli mi?',
    cevap: 'Hayır. lalabits.art\'ta üretici hesabı açmak tamamen ücretsizdir. Platform yalnızca destekçilerden gelen başarılı ödemelerden komisyon alır.',
  },
  {
    soru: 'Kazançlarımı nasıl çekebilirim?',
    cevap: 'Dashboard\'unuzdaki "Kazanç" bölümünden IBAN bilgilerinizi ekleyerek çekim talebi oluşturabilirsiniz. Ödemeler her ay belirli günlerde havale yöntemiyle yapılır.',
  },
  {
    soru: 'Üyelik planlarımı nasıl oluştururum?',
    cevap: 'Dashboard → Üyelik Planları bölümüne gidin. "Yeni Plan" butonuyla plan adı, fiyat ve açıklama belirleyip yayınlayabilirsiniz. Birden fazla kademe oluşturabilirsiniz.',
  },
  {
    soru: 'Hangi içerik formatları destekleniyor?',
    cevap: 'Metin yazıları, zengin içerik (görsel, link), PDF dosyaları, ZIP arşivleri, ses dosyaları, tasarım/kaynak dosyaları ve dijital ürünler desteklenmektedir.',
  },
  {
    soru: 'İçeriklerimi belirli üyelik kademelerine kilitleyebilir miyim?',
    cevap: 'Evet. Gönderi oluştururken erişim seviyesini seçebilirsiniz: Herkese Açık, Ücretsiz Üye, veya belirli ücretli kademeler. Koleksiyonlar ve mağaza ürünleri için de aynı sistem geçerlidir.',
  },
  {
    soru: 'Profil sayfam ne zaman yayınlanır?',
    cevap: 'Başvurunuz incelendikten sonra genellikle 1-3 iş günü içinde onaylanır. Onay sonrası profiliniz keşfet sayfasında görünür hale gelir.',
  },
  {
    soru: 'Komisyon oranları nedir?',
    cevap: 'Güncel komisyon oranları ve plan karşılaştırması için /fiyatlar sayfasını inceleyebilirsiniz. Temel oran kazanç üzerinden yüzde olarak uygulanır, sabit aylık ücret yoktur.',
  },
];

const SSS_DESTEKCI = [
  {
    soru: 'Üyeliğimi nasıl iptal edebilirim?',
    cevap: 'Hesabım → Faturalarım → İlgili abonelik → "Üyeliği İptal Et" adımlarını izleyin. İptal sonrası mevcut dönem sonuna kadar erişiminiz devam eder.',
  },
  {
    soru: 'Ödeme güvenli mi?',
    cevap: 'Evet. Tüm ödemeler SSL şifreleme ile korunur. Kart bilgileriniz lalabits.art sunucularında saklanmaz; ödeme altyapı sağlayıcımız PCI-DSS uyumludur.',
  },
  {
    soru: 'Hangi ödeme yöntemleri kabul ediliyor?',
    cevap: 'Kredi kartı ve banka kartı (Visa, Mastercard) ile ödeme yapabilirsiniz. Türk Lirası (₺) üzerinden işlem gerçekleştirilir.',
  },
  {
    soru: 'Üye olduğum içeriklere nasıl erişebilirim?',
    cevap: 'Giriş yaptıktan sonra üyesi olduğunuz üreticinin profiline gidin. Kilitli içerikler otomatik olarak açılacaktır. Ayrıca Kütüphane bölümünden tüm satın alımlarınıza ulaşabilirsiniz.',
  },
  {
    soru: 'Satın aldığım dosyalara nereden ulaşabilirim?',
    cevap: 'Giriş yaptıktan sonra /kutuphane adresine gidin (veya üst menüden "Kütüphane"). "Ürünler" sekmesinde satın aldığınız tüm dijital dosyalar listelenir; "İndir" butonuyla dosyanızı bilgisayarınıza indirebilirsiniz. Aktif üyeliğinizle erişilen içerikler ise "Üyelikler" sekmesinde görünür.',
  },
  {
    soru: 'Üyeliğimi iptal edersem içeriklere erişimim ne olur?',
    cevap: 'Aboneliği iptal ettiğinizde mevcut ödeme dönemi sonuna kadar tüm kilitli içeriklere erişiminiz devam eder. Dönem bittikten sonra o üreticinin üyeliğe özel içerikleri kapanır. Satın aldığınız dijital ürünler (mağaza ürünleri, koleksiyonlar) abonelikten bağımsızdır ve Kütüphane\'nizde kalır.',
  },
  {
    soru: 'Üretici içerik yayınlamayı bırakırsa ne olur?',
    cevap: 'Üreticinin hesabı askıya alınır veya silinirse aboneliğiniz otomatik iptal edilir ve o döneme ait ücret iade edilir.',
  },
  {
    soru: 'İade talep edebilir miyim?',
    cevap: 'Teknik bir sorun nedeniyle erişim sağlayamadıysanız destek@lalabits.art adresinden 7 gün içinde talep oluşturabilirsiniz. İade değerlendirmeleri 3-5 iş günü içinde sonuçlanır.',
  },
  {
    soru: 'Üreticiyi nasıl raporlarım?',
    cevap: 'Üretici profilindeki "..." menüsünden "Raporla" seçeneğini kullanabilirsiniz. Raporlar moderasyon ekibimiz tarafından 24 saat içinde incelenir.',
  },
];

/* ── Accordion satırı ─────────────────────────────────────────── */
function AkordeonSatir({ soru, cevap }: { soru: string; cevap: string }) {
  const [acik, setAcik] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={acik}
      >
        <span className="text-sm font-semibold text-text-primary leading-snug">{soru}</span>
        <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors ${acik ? 'bg-teal border-teal text-white' : 'text-text-muted'}`}>
          <svg className={`h-3.5 w-3.5 transition-transform ${acik ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {acik && (
        <p className="pb-5 text-sm text-text-secondary leading-[1.8] pr-12">{cevap}</p>
      )}
    </div>
  );
}

/* ── Ana sayfa ────────────────────────────────────────────────── */
export default function DestekPage() {
  const [aktifTab, setAktifTab] = useState<'uretici' | 'destekci'>('uretici');

  return (
    <main className="bg-background">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] pt-20 pb-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <span className="inline-block rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 mb-6">
            Destek Merkezi
          </span>
          <h1 className="text-[36px] sm:text-[48px] font-bold tracking-[-0.02em] text-white leading-[1.15] mb-4">
            Nasıl yardımcı<br />olabiliriz?
          </h1>
          <p className="text-base text-white/50 leading-[1.7] mb-10 max-w-md mx-auto">
            Sık sorulan sorular, rehberler ve ekibimize ulaşma yolları.
          </p>
          <a
            href="mailto:destek@lalabits.art"
            className="inline-flex items-center gap-2.5 rounded-xl bg-orange px-7 py-3.5 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            destek@lalabits.art
          </a>
        </div>
      </section>

      {/* ── Konu kategorileri ─────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-border">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-8 text-center">Konular</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {KATEGORILER.map((kat) => (
              <a
                key={kat.baslik}
                href={kat.href}
                className="group flex flex-col gap-3 rounded-[20px] border border-border bg-background p-5 hover:border-teal/40 hover:bg-teal-light/30 transition-all duration-200"
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${kat.renk}`}>
                  {kat.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-teal transition-colors">{kat.baslik}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{kat.aciklama}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSS ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">Sık Sorulan Sorular</p>
            <h2 className="text-[26px] font-bold text-text-primary tracking-tight">Aklındaki soruyu bul</h2>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 rounded-xl bg-[#f4f4f4] p-1 mb-8 w-fit mx-auto">
            {(['uretici', 'destekci'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setAktifTab(tab)}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                  aktifTab === tab
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab === 'uretici' ? 'Üreticiler' : 'Destekçiler'}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="rounded-[20px] bg-white border border-border px-6">
            {(aktifTab === 'uretici' ? SSS_URETICI : SSS_DESTEKCI).map((item) => (
              <AkordeonSatir key={item.soru} soru={item.soru} cevap={item.cevap} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Hızlı Linkler ─────────────────────────────────────── */}
      <section className="py-16 bg-teal-light/40 border-t border-border">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-8 text-center">Hızlı Erişim</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/kaynaklar/rehberler"
              className="group flex items-center gap-4 rounded-[16px] bg-white border border-border p-5 hover:border-teal/40 transition-all"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary group-hover:text-teal transition-colors">Rehberler</p>
                <p className="text-xs text-text-muted">Adım adım başlangıç kılavuzları</p>
              </div>
            </Link>
            <Link
              href="/fiyatlar"
              className="group flex items-center gap-4 rounded-[16px] bg-white border border-border p-5 hover:border-teal/40 transition-all"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary group-hover:text-teal transition-colors">Fiyatlar</p>
                <p className="text-xs text-text-muted">Komisyon oranları ve planlar</p>
              </div>
            </Link>
            <Link
              href="/iletisim"
              className="group flex items-center gap-4 rounded-[16px] bg-white border border-border p-5 hover:border-teal/40 transition-all"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary group-hover:text-teal transition-colors">İletişim</p>
                <p className="text-xs text-text-muted">Bize doğrudan ulaşın</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── İletişim kartı ────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-[24px] bg-[#1a1a1a] px-8 py-12 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 mb-6">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-[22px] font-bold text-white mb-3">Hâlâ çözemedik mi?</h3>
            <p className="text-sm text-white/50 leading-[1.7] mb-8 max-w-md mx-auto">
              Destek ekibimiz hafta içi 09:00–18:00 arasında aktiftir.
              E-postanıza genellikle 24 saat içinde dönüş yapıyoruz.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:destek@lalabits.art"
                className="rounded-xl bg-orange px-8 py-3 text-sm font-semibold text-white hover:bg-orange-dark transition-colors"
              >
                destek@lalabits.art
              </a>
              <Link
                href="/iletisim"
                className="rounded-xl border border-white/20 px-8 py-3 text-sm font-semibold text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                İletişim formu
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/25">Ortalama yanıt süresi: &lt; 24 saat</p>
          </div>
        </div>
      </section>

    </main>
  );
}
