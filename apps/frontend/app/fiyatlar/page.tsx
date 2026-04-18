import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Fiyatlar — lalabits.art",
  description:
    "lalabits.art komisyon oranları ve ödeme yöntemleri. Üreticiler için şeffaf fiyatlandırma.",
};

const faq = [
  {
    q: 'Platform ücreti ne zaman kesilir?',
    a: 'Komisyon, her başarılı ödeme işleminde otomatik olarak kesilir. Kalan tutar kazanç hesabınıza anında yansır.',
  },
  {
    q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    a: 'Türk kredi/banka kartları, Papara ve IBAN banka transferi ile ödeme alabilirsiniz. Tüm yöntemler Türk lirası üzerinden çalışır.',
  },
  {
    q: 'Kazancımı ne zaman çekebilirim?',
    a: 'Minimum 100 ₺ bakiye biriktiğinde kazanç çekme talebi oluşturabilirsiniz. İşlemler 3-5 iş günü içinde hesabınıza ulaşır.',
  },
  {
    q: 'Yıllık abonelikten nasıl daha fazla kazanabilirim?',
    a: 'Yıllık abonelikler peşin tahsil edilir. Destekçilerini yıllık plana yönlendirirsen nakit akışın artar, iptal oranın düşer.',
  },
  {
    q: 'Deneme süresi sunuyor musunuz?',
    a: 'Platformu sınırsız süre ücretsiz kullanabilir, kazandığınızda komisyon ödersiniz. Abonelik ücreti yoktur.',
  },
  {
    q: 'İşlem ücreti nedir?',
    a: 'İşlem ücreti ödeme altyapısının (ödeme sağlayıcısının) belirlediği bir oran olup platform komisyonundan bağımsızdır. Mevcut oran net gelir tablosunuzda ayrıca gösterilir.',
  },
  {
    q: 'Komisyon oranı ileride değişebilir mi?',
    a: 'Tüm üreticiler için geçerli oran şu an %8\'dir. Komisyon yapısında yapılacak herhangi bir değişiklik, yürürlük tarihinden en az 30 gün önce kayıtlı e-posta adresinize bildirilir. Kullanım Şartları\'nda farklı oranlardan söz ediliyorsa bu, henüz aktif olmayan gelecek planlama notlarıdır; tek geçerli oran %8\'dir.',
  },
  {
    q: 'Kazancım üzerinden vergi ödemem gerekiyor mu?',
    a: 'Platform, üretici adına herhangi bir vergi kesintisi yapmaz veya beyanname vermez. Türkiye\'deki gelir vergisi ve diğer yasal yükümlülükler tamamen üreticinin sorumluluğundadır. Kendi durumunuza uygun vergi yükümlülükleri için bir mali müşavire danışmanızı öneririz.',
  },
];

export default function FiyatlarPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-border py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-[36px] font-bold tracking-[-0.02em] text-text-primary sm:text-[48px]">
            Şeffaf Fiyatlandırma
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto leading-[1.7]">
            Aylık abonelik yok. Sadece kazandığınızda küçük bir komisyon.
          </p>
        </div>
      </section>

      {/* Komisyon kartı */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Ana komisyon */}
            <div className="md:col-span-2 rounded-[20px] bg-teal p-8 text-white">
              <p className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Platform Komisyonu</p>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-[64px] font-extrabold leading-none">%8</span>
                <span className="text-xl text-white/70 mb-2">her işlemden</span>
              </div>
              <p className="text-white/80 leading-[1.7]">
                Bir destekçi sana ödeme yaptığında, ödeme tutarının %8'i platform komisyonu olarak kesilir.
                Geri kalan %92'si senin.
              </p>
              <div className="mt-6 bg-white/10 rounded-xl p-4">
                <p className="text-sm text-white/70 mb-2">Örnek hesaplama</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Destekçi ödemesi</span>
                    <span className="font-semibold">₺129</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Platform komisyonu (%8)</span>
                    <span>-₺10.32</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-1 mt-1">
                    <span className="font-semibold">Senin kazancın</span>
                    <span className="font-bold text-orange">₺118.68</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yan bilgiler */}
            <div className="flex flex-col gap-4">
              <div id="komisyon" className="rounded-[20px] bg-orange-light border border-orange/10 p-6 flex-1">
                <p className="text-xs font-semibold text-orange uppercase tracking-wider mb-2">Aylık Ücret</p>
                <p className="text-3xl font-extrabold text-text-primary">₺0</p>
                <p className="mt-2 text-sm text-text-secondary">Platform kullanımı ücretsiz. Sadece kazandığında ödersin.</p>
              </div>
              <div className="rounded-[20px] bg-teal-light border border-teal/10 p-6 flex-1">
                <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">Min. Çekim</p>
                <p className="text-3xl font-extrabold text-text-primary">₺100</p>
                <p className="mt-2 text-sm text-text-secondary">100 ₺ birikince dilediğin zaman çek.</p>
              </div>
            </div>
          </div>

          {/* Ödeme yöntemleri */}
          <div id="odeme" className="mb-16">
            <h2 className="text-[24px] font-bold text-text-primary mb-6">Ödeme Yöntemleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: '💳',
                  title: 'Türk Kartları',
                  desc: 'Tüm Türk kredi ve banka kartları kabul edilir.',
                },
                {
                  icon: '📱',
                  title: 'Papara',
                  desc: 'Papara hesabı ile hızlı ve kolay ödeme.',
                },
                {
                  icon: '🏦',
                  title: 'Banka Transferi',
                  desc: 'IBAN ile EFT/havale yöntemiyle ödeme.',
                },
              ].map((m) => (
                <div key={m.title} className="rounded-[20px] bg-white border border-border p-6 text-center">
                  <div className="text-4xl mb-3">{m.icon}</div>
                  <p className="font-semibold text-text-primary text-base mb-2">{m.title}</p>
                  <p className="text-sm text-text-secondary leading-[1.6]">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fan ödeme bilgisi */}
          <div className="mb-16 rounded-[20px] bg-white border border-border p-8">
            <h2 className="text-[24px] font-bold text-text-primary mb-2">Destekçiler İçin Ödeme</h2>
            <p className="text-text-secondary mb-6 leading-[1.7]">
              Bir üreticiyi desteklemek veya dijital ürün satın almak istiyorsanız, tüm ödemeler
              güvenli altyapımız üzerinden gerçekleşir.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  baslik: 'Güvenli Ödeme',
                  aciklama: 'Tüm işlemler SSL ile şifrelenir. Kart bilgileriniz lalabits.art sunucularında saklanmaz.',
                  renk: 'bg-teal-light text-teal',
                  simge: '🔒',
                },
                {
                  baslik: 'Türk Lirası',
                  aciklama: 'Tüm ödemeler ₺ (TRY) üzerinden alınır. Yabancı para birimi dönüşümü gerekmez.',
                  renk: 'bg-orange-light text-orange-dark',
                  simge: '₺',
                },
                {
                  baslik: 'İade Garantisi',
                  aciklama: 'Teknik sorun yaşarsanız 7 gün içinde iade talep edebilirsiniz.',
                  renk: 'bg-teal-light text-teal',
                  simge: '↩',
                },
              ].map((m) => (
                <div key={m.baslik} className="rounded-[16px] border border-border p-5">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${m.renk} text-lg mb-3`}>
                    {m.simge}
                  </div>
                  <p className="font-semibold text-text-primary mb-1">{m.baslik}</p>
                  <p className="text-sm text-text-secondary leading-[1.6]">{m.aciklama}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-text-muted">
              Kabul edilen kartlar: Visa, Mastercard (Türk kredi / banka kartları). Ödeme sonrası satın alınanlar{' '}
              <Link href="/kutuphane" className="text-teal hover:underline">kütüphanenize</Link>{' '}
              anında eklenir.
              İade politikası için{' '}
              <Link href="/iade-politikasi" className="text-teal hover:underline">İade Politikası</Link>{' '}
              sayfasını inceleyin.
            </p>
          </div>

          {/* Hesap makinesi */}
          <div id="hesapla" className="mb-16 rounded-[20px] bg-white border border-border p-8">
            <h2 className="text-[24px] font-bold text-text-primary mb-2">Kazanç Hesaplama</h2>
            <p className="text-text-secondary mb-6">%8 komisyon oranına göre aylık tahmini kazancın:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border">
                    <th className="pb-3 font-semibold">Destekçi Sayısı</th>
                    <th className="pb-3 font-semibold">Kademe Ücreti</th>
                    <th className="pb-3 font-semibold">Brüt Gelir</th>
                    <th className="pb-3 font-semibold text-teal">Net Kazanç</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { sayi: 50, fiyat: 49, brut: 2450, net: 2254 },
                    { sayi: 100, fiyat: 99, brut: 9900, net: 9108 },
                    { sayi: 200, fiyat: 129, brut: 25800, net: 23736 },
                    { sayi: 500, fiyat: 199, brut: 99500, net: 91540 },
                  ].map((row) => (
                    <tr key={row.sayi} className="hover:bg-background transition-colors">
                      <td className="py-3 font-medium text-text-primary">{row.sayi} destekçi</td>
                      <td className="py-3 text-text-secondary">₺{row.fiyat}/ay</td>
                      <td className="py-3 text-text-secondary">₺{row.brut.toLocaleString('tr-TR')}</td>
                      <td className="py-3 font-bold text-teal">₺{row.net.toLocaleString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-text-muted">* İşlem ücretleri hariç tahmini değerlerdir. Gerçek tutarlar ödeme sağlayıcısına göre değişebilir.</p>
          </div>

          {/* SSS */}
          <div>
            <h2 className="text-[24px] font-bold text-text-primary mb-6">Sıkça Sorulan Sorular</h2>
            <div className="flex flex-col gap-4">
              {faq.map((item) => (
                <div key={item.q} className="rounded-[20px] bg-white border border-border p-6">
                  <p className="font-semibold text-text-primary mb-2">{item.q}</p>
                  <p className="text-sm text-text-secondary leading-[1.7]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-light">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[28px] font-bold text-text-primary sm:text-[36px]">
            Hemen Başla, Ücretsiz
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Aylık ücret yok — sadece kazandığında ödeme yaparsın.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kayit/uretici"
              className="rounded-xl bg-orange px-10 py-4 text-base font-semibold text-white hover:bg-orange-dark transition-colors"
            >
              Üretici hesabı aç
            </Link>
            <Link
              href="/ozellikler"
              className="rounded-xl border border-border px-10 py-4 text-base font-semibold text-text-primary hover:bg-white transition-colors"
            >
              Özellikleri incele
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
