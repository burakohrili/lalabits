import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'İletişim — lalabits.art',
  description: 'lalabits.art ile iletişime geçin.',
};

export default function IletisimPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="bg-white border-b border-border py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h1 className="text-[36px] font-bold tracking-[-0.02em] text-text-primary mb-4">İletişim</h1>
          <p className="text-lg text-text-secondary leading-[1.7]">
            Sorularınız, önerileriniz veya iş birliği teklifleri için aşağıdaki kanallardan bize ulaşın.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">

          {/* Şirket / Satıcı Bilgileri */}
          <div className="mb-10 rounded-[20px] bg-white border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-gray-50">
              <p className="text-sm font-semibold text-text-primary">Satıcı / İşletme Bilgileri</p>
              <p className="text-xs text-text-secondary mt-0.5">6502 s. Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında</p>
            </div>
            <dl className="divide-y divide-border text-sm">
              {[
                ['Ticari Unvan', 'Noesis Social / Burak OHRİLİ'],
                ['Adres', 'Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir'],
                ['Vergi Dairesi / VKN', 'Ege Vergi Dairesi / 35509755908'],
                ['KEP Adresi', 'burak.ohrili@hs06.kep.tr'],
                ['Telefon', '0532 744 94 34'],
                ['E-posta', 'destek@lalabits.art'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4 px-6 py-3">
                  <dt className="w-44 shrink-0 font-medium text-text-primary">{label}</dt>
                  <dd className="text-text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* İletişim Kanalları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                baslik: 'Genel',
                aciklama: 'Her türlü soru ve öneri için',
                eposta: 'merhaba@lalabits.art',
              },
              {
                baslik: 'Destek',
                aciklama: 'Teknik yardım ve hesap sorunları',
                eposta: 'destek@lalabits.art',
              },
              {
                baslik: 'Basın',
                aciklama: 'Medya ve basın soruları',
                eposta: 'basin@lalabits.art',
              },
              {
                baslik: 'Kariyer',
                aciklama: 'Açık pozisyonlar ve başvurular',
                eposta: 'kariyer@lalabits.art',
              },
            ].map((item) => (
              <div
                key={item.baslik}
                className="rounded-[20px] bg-white border border-border p-6 flex flex-col gap-3"
              >
                <div>
                  <p className="font-semibold text-text-primary text-base">{item.baslik}</p>
                  <p className="text-sm text-text-secondary mt-1">{item.aciklama}</p>
                </div>
                <a
                  href={`mailto:${item.eposta}`}
                  className="text-sm font-semibold text-teal hover:underline"
                >
                  {item.eposta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
