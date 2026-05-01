'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────── types ── */
interface GuideItem {
  q: string;
  a: string | React.ReactNode;
}
interface GuideSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: GuideItem[];
}

/* ─────────────────────────────────────────────── icon helpers ── */
function IconProfile() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconPlan() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M17 13v8M13 17h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconContent() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconShop() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 7v14a1 1 0 001 1h16a1 1 0 001-1V7l-3-5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 7h18M16 11a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconMoney() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 6v1.5M12 16.5V18M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5c0 1.4-1.3 2-3 2s-3 .6-3 2c0 1.4 1.3 2.5 3 2.5s3-1.1 3-2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconCommunity() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M17 20h5v-2a3 3 0 00-5.4-1.8M17 20H7M17 20v-2c0-.5-.1-1-.3-1.4M7 20H2v-2a3 3 0 015.4-1.8M7 20v-2c0-.5.1-1 .3-1.4M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 18l-6.2 3.1 1.2-6.9-5-4.9 6.9-1z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M2 9h20" stroke="currentColor" strokeWidth="1.75" />
      <path d="M6 14h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconSupport() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────── content ── */

const URETICI_SECTIONS: GuideSection[] = [
  {
    id: 'baslangic',
    icon: <IconProfile />,
    title: 'Başlangıç & Başvuru',
    subtitle: 'Platforma ilk adımını atmadan önce bilmen gerekenler',
    items: [
      {
        q: 'Üretici hesabı nasıl açarım?',
        a: (
          <>
            <Link href="/auth/kayit/yaratici" className="text-teal font-semibold underline">lalabits.art/auth/kayit/yaratici</Link> adresinden kayıt formunu doldur. E-posta adresin doğrulandıktan sonra onboarding adımlarına yönlendirilirsin: profil bilgileri → kategori seçimi → üyelik planları → IBAN girişi → başvuru gönder.
          </>
        ),
      },
      {
        q: 'Başvurum ne kadar sürede onaylanır?',
        a: 'Ekibimiz başvuruları genellikle 1-3 iş günü içinde inceler. Onay veya red kararı e-posta ile bildirilir. Red halinde gerekçe paylaşılır ve tekrar başvurabilirsin.',
      },
      {
        q: 'Başvuru reddedilirse ne olur?',
        a: 'Red gerekçesi inceleyip içeriğini veya profilini güncelleyebilirsin. Güncelleme sonrası "Yeniden Başvur" butonuyla aynı form üzerinden tekrar gönderebilirsin. Sınırsız başvuru hakkın var.',
      },
      {
        q: 'Kullanıcı adımı nasıl seçmeliyim?',
        a: 'Kullanıcı adın lalabits.art/@senfin_adin formatında profil adresin olacak. Küçük harf, rakam, alt çizgi ve tire kullanabilirsin. Marka adın, ismin veya içerik nişini yansıtan, akılda kalıcı bir ad seç. Sonradan değiştirebilirsin.',
      },
      {
        q: 'Onboarding sırasında hangi bilgileri girmem gerekiyor?',
        a: '① Görünen ad ve kullanıcı adı ② Profil fotoğrafı ve kapak görseli (opsiyonel) ③ Biyografi ④ İçerik kategorisi ve format etiketleri ⑤ En az bir üyelik planı ⑥ Kazançların aktarılacağı IBAN. Tüm adımlar tamamlandıktan sonra başvurun gönderilir.',
      },
    ],
  },
  {
    id: 'profil',
    icon: <IconContent />,
    title: 'Profil & Sayfa Düzeni',
    subtitle: 'Ziyaretçileri karşılayan sayfanı en iyi şekilde hazırla',
    items: [
      {
        q: 'Profil fotoğrafı ve kapak görseli nasıl yüklerim?',
        a: 'Onboarding "Profil Bilgileri" adımında veya daha sonra dashboard ayarlarından yükleyebilirsin. Profil fotoğrafı için kare format, kapak görseli için 1500×400 px önerilir. JPEG, PNG veya WebP formatları desteklenir. Görseller R2 bulut depolamaya yüklenir, hızlı yüklenme garantisi vardır.',
      },
      {
        q: 'Biyografimi nasıl yazmalıyım?',
        a: 'Biyografi 2.000 karaktere kadar olabilir. Kim olduğunu, ne tür içerikler ürettiğini ve neden desteklenmesi gerektiğini kısaca açıkla. Emojiler ve satır araları kullanabilirsin. İlk 100-150 karakteri çekici yaz — kart önizlemelerinde bu bölüm görünür.',
      },
      {
        q: 'Kategori seçimi önemli mi?',
        a: 'Evet. Kategori seçimin Keşfet sayfasındaki filtrelemelerde profilinin görünmesini sağlar. Yazar, Çizer, Eğitimci, Podcastçı, Müzisyen, Tasarımcı, Geliştirici veya Diğer kategorilerinden birini seçmelisin. Ek olarak içerik format etiketleri (video, yazı, ses, illüstrasyon vb.) ekleyebilirsin.',
      },
      {
        q: 'Sosyal medya bağlantılarımı ekleyebilir miyim?',
        a: 'Evet. Dashboard → Profil Ayarları bölümünden Instagram, X (Twitter), YouTube, Twitch ve kişisel web site bağlantılarını ekleyebilirsin. Bu linkler profil sayfanda ziyaretçilere görünür.',
      },
    ],
  },
  {
    id: 'planlar',
    icon: <IconPlan />,
    title: 'Üyelik Planları',
    subtitle: 'Destekçilerin için doğru katman yapısını oluştur',
    items: [
      {
        q: 'Kaç tane üyelik planı oluşturabilirim?',
        a: 'İstediğin kadar plan ekleyebilirsin. Çoğu üretici 2-4 kademe tercih eder. Çok sayıda plan seçim güçlüğü yaratabilir; sade bir yapı genellikle daha iyi performans gösterir.',
      },
      {
        q: 'Fiyatlandırmamı nasıl belirlemeliyim?',
        a: 'Türkiye ortalamasına bakıldığında: ₺49-79 giriş kademesi, ₺129-199 orta kademe, ₺299+ premium kademe yaygındır. Sunacağın faydaları listelep hangi kademede ne vereceğini net belirle. "Daha az ver, daha az fiyat" yerine "az ama değerli" yaklaşımı tercih edilir.',
      },
      {
        q: 'Ücretsiz katman ya da ücretsiz takip var mı?',
        a: 'Evet. Ziyaretçiler ücretsiz olarak seni takip edebilir — buna "Takipçi" diyoruz. Takipçiler herkese açık içeriklerine erişebilir fakat ücretli katmanlara kilitli içeriklere erişemez. Bu, destekçi tabanın oluşmadan önce izleyici kitlesi oluşturmak için idealdir.',
      },
      {
        q: 'Planlarımı sonradan değiştirebilir miyim?',
        a: 'Evet, fiyat, isim ve açıklama güncellenebilir. Mevcut aboneler bir sonraki yenileme dönemine kadar eski fiyattan devam eder; fiyat değişikliği yalnızca yeni aboneleri etkiler. Plan silmek istersen mevcut abonelerin taşınabileceği alternatifleri görebilirsin.',
      },
      {
        q: 'Her kademeye farklı içerik ve ayrıcalıklar atayabilir miyim?',
        a: 'Evet. Gönderi oluştururken "Erişim seviyesi" ile kademe seçiyorsun: Herkese açık, Takipçilere açık, veya belirli ücretli planlara kilitli. Mağaza ürünleri ve koleksiyonlar da kademe bazlı erişim destekler.',
      },
    ],
  },
  {
    id: 'icerik',
    icon: <IconContent />,
    title: 'İçerik Yayınlama',
    subtitle: 'Gönderi, koleksiyon ve eklerle içeriğini yönet',
    items: [
      {
        q: 'Hangi içerik türleri destekleniyor?',
        a: 'Metin gönderileri, checklist gönderileri, harici bağlantılar (YouTube, Spotify, Drive vb.), dosya ekleri (MP3, WAV, OGG, FLAC, ZIP, STL, OBJ), koleksiyonlar ve dijital ürünler (PDF, ZIP, ses, video).',
      },
      {
        q: 'Gönderi ekleri nasıl çalışıyor?',
        a: (
          <>
            Gönderi oluştururken iki tür ek ekleyebilirsin:
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li><strong>Harici bağlantı:</strong> URL + başlık gir (YouTube, Google Drive, Notion, Spotify — her URL geçerli).</li>
              <li><strong>Dosya yükle:</strong> Ses dosyaları (MP3, WAV, FLAC), ZIP arşivleri, 3D model dosyaları (STL, OBJ) yükleyebilirsin. Maksimum dosya boyutu 200 MB. Dosyalar güvenli bulut depolamaya (R2) yüklenir; destekçilerin indirme bağlantısı geçici ve kişiseldir.</li>
            </ul>
          </>
        ),
      },
      {
        q: 'Koleksiyon nedir, ne zaman kullanılır?',
        a: 'Koleksiyonlar tematik içerik paketleridir — bir e-kitap serisi, bir eğitim kursu veya illüstrasyon arşivi gibi. Birden fazla dosya veya yazıyı tek bir başlık altında sunmak istediğinde idealdir. Belirli kastemelere kilitleyebilir veya tek seferlik satın alma olarak sunabilirsin.',
      },
      {
        q: 'Yayınlanan bir gönderiyi düzenleyebilir miyim?',
        a: 'Evet. Dashboard → Gönderiler bölümünden yayınlanan gönderilerine ulaşıp düzenleyebilirsin. Başlık, metin, erişim seviyesi ve ekler güncellenebilir.',
      },
      {
        q: 'Taslak gönderim var, daha sonra yayınlayabilir miyim?',
        a: 'Evet. Gönderiyi oluştururken "Taslak Kaydet" seçeneği ile kaydedebilirsin. Dashboard\'dan istediğin zaman yayına alabilirsin. Zamanlanmış yayın özelliği yakında geliyor.',
      },
    ],
  },
  {
    id: 'magaza',
    icon: <IconShop />,
    title: 'Mağaza & Dijital Ürünler',
    subtitle: 'Tek seferlik satışlarla ek gelir kanalı oluştur',
    items: [
      {
        q: 'Dijital ürün satabilir miyim?',
        a: 'Evet. Dashboard → Mağaza bölümünden PDF, e-kitap, illüstrasyon paketi, ses dosyası, yazı şablonu — her tür dijital dosyayı ürün olarak listeleyebilirsin. Destekçiler satın alma sonrası dosyalara kütüphanelerinden erişir.',
      },
      {
        q: 'Ürün fiyatları nasıl belirlenir?',
        a: 'Ürün fiyatını Türk lirası olarak sen belirlersin. Üyelik katmanına sahip destekçilere indirim tanımlayabilir ya da belirli kademelere ücretsiz erişim verebilirsin.',
      },
      {
        q: 'Satın alma sonrası dosya teslimi nasıl olur?',
        a: 'Otomatik. Satın alma tamamlandığı anda destekçinin kütüphanesine eklenir. Güvenli, geçici indirme bağlantıları oluşturulur — dosyalar doğrudan paylaşılamaz, yalnızca yetkili kullanıcılar erişebilir.',
      },
      {
        q: 'Ürünlerime üyelik aboneliği olmadan da ulaşılabilir mi?',
        a: 'Evet. Mağaza ürünleri ayrı satın alma gerektiren bağımsız ürünlerdir. Ziyaretçi senin platformunda üye olmasa bile tek seferlik satın alabilir.',
      },
    ],
  },
  {
    id: 'kazanc',
    icon: <IconMoney />,
    title: 'Kazanç & Ödeme',
    subtitle: 'Gelirinin nasıl ve ne zaman hesabına geçtiğini anla',
    items: [
      {
        q: 'Ne zaman ödeme alırım?',
        a: 'Ödemeler her ayın belirli kesim tarihinde biriktirilir ve takip eden iş günlerinde IBAN\'ına havale edilir. Aktarım takvimi dashboard\'dan takip edilebilir.',
      },
      {
        q: 'Platform komisyonu ne kadar?',
        a: 'lalabits.art her işlemden platform ücreti keser. Güncel oran ve yapı Fiyatlandırma sayfasında yayınlanır. Ödeme altyapısı (banka, kart işleme) ek maliyet içerebilir; bu tutar ayrıca belirtilir.',
      },
      {
        q: "IBAN'ımı nasıl eklerim?",
        a: 'Onboarding\'in son adımında veya Dashboard → Ödeme Ayarları\'ndan TR ile başlayan 26 haneli IBAN\'ını girebilirsin. IBAN şifreli olarak saklanır; son 4 hanesi dışında gösterilmez.',
      },
      {
        q: 'Fatura ya da vergi sorumluluğu kime aittir?',
        a: 'Platform gelir transferini yapar; vergi ve fatura sorumluluğu üreticiye aittir. Türkiye mevzuatına göre gelirini beyan etmen gerekebilir. Muhasebecine danışmanı öneririz.',
      },
      {
        q: "Gelirimi dashboard'dan takip edebilir miyim?",
        a: 'Evet. Dashboard → Gelir bölümünde aylık kazanç özeti, destekçi sayısı ve işlem geçmişini görebilirsin. Daha ayrıntılı analitik araçlar gelecek güncellemelerde eklenecek.',
      },
    ],
  },
  {
    id: 'topluluk',
    icon: <IconCommunity />,
    title: 'Topluluk & Güvenlik',
    subtitle: 'Destekçi ilişkilerini yönet, ortamını koru',
    items: [
      {
        q: 'Topluluk sohbeti nasıl çalışır?',
        a: 'Her üretici sayfasının "Topluluk" bölümünde genel bir sohbet odası bulunur. Belirli kademe destekçilere özel sohbet kanalları da oluşturabilirsin. Doğrudan mesajlaşma da desteklenir.',
      },
      {
        q: 'Rahatsız edici bir destekçiyi nasıl engellerim?',
        a: 'Kullanıcı profilinden "Engelle" seçeneğini kullanabilirsin. Engellenen kullanıcı profiline erişemez, sana mesaj gönderemez. Şiddet içeren veya zararlı içerik için ayrıca "Bildir" işlemi yapabilirsin.',
      },
      {
        q: 'İçerik moderasyonu nasıl çalışıyor?',
        a: 'Üreticiler kendi içerik kurallarını belirler. Platform kuralları tüm içerikler için geçerlidir (şiddet, nefret söylemi, yasa dışı içerik yayımlanamaz). İhlal bildirimleri ekibimiz tarafından incelenir.',
      },
      {
        q: 'Destekçilerimi listeleyebilir, yönetebilir miyim?',
        a: 'Dashboard → Destekçiler bölümünden tüm aktif destekçilerini, kademelerini ve abone tarihlerini görebilirsin. Bir destekçiyle özel mesaj gönderebilir veya engelleme işlemi uygulayabilirsin.',
      },
    ],
  },
];

const HAYRAN_SECTIONS: GuideSection[] = [
  {
    id: 'hesap',
    icon: <IconProfile />,
    title: 'Hesap Oluşturma & Profil',
    subtitle: 'Platforma adım atmak için tek gerekenin bir e-posta',
    items: [
      {
        q: 'Nasıl kayıt olurum?',
        a: (
          <>
            <Link href="/auth/kayit" className="text-teal font-semibold underline">lalabits.art/auth/kayit</Link> adresinden e-posta ve şifre ile ya da Google hesabınla kayıt olabilirsin. Kayıt ücretsizdir; üyelik için kredi kartı gerekmez.
          </>
        ),
      },
      {
        q: 'Profil resmi veya biyografi ekleyebilir miyim?',
        a: 'Evet. Hesap → Ayarlar bölümünden profil fotoğrafını yükleyebilir, görünen adını ve biyografini düzenleyebilirsin. Bu bilgiler sohbetlerde ve yorumlarda görünür.',
      },
      {
        q: 'Şifremi unuttum, nasıl sıfırlarım?',
        a: 'Giriş sayfasındaki "Şifremi unuttum" bağlantısına tıkla. Kayıtlı e-posta adresine sıfırlama bağlantısı gönderilir. Bağlantı 30 dakika geçerlidir.',
      },
      {
        q: 'Hesabımı kapatabilir miyim?',
        a: 'Evet. Hesap → Ayarlar → Hesabı Kapat seçeneğiyle hesabını silebilirsin. Aktif aboneliklerin varsa önce iptal etmen gerekir. Hesap silindiğinde tüm kütüphane erişimi kalıcı olarak kaybolur.',
      },
    ],
  },
  {
    id: 'kesfet',
    icon: <IconSearch />,
    title: 'Üreticileri Keşfetme',
    subtitle: 'Sana en uygun üreticileri bul',
    items: [
      {
        q: 'Üreticileri nasıl bulurum?',
        a: (
          <>
            <Link href="/kesfet" className="text-teal font-semibold underline">Keşfet</Link> sayfasından isim veya kullanıcı adına göre arama yapabilir, kategori filtresiyle ilgilendiğin alana odaklanabilirsin: Yazar, Çizer, Eğitimci, Podcastçı, Müzisyen, Tasarımcı, Geliştirici.
          </>
        ),
      },
      {
        q: 'Ücretsiz takip ile ücretli üyelik arasındaki fark nedir?',
        a: (
          <ul className="space-y-1 list-disc pl-5">
            <li><strong>Ücretsiz takip:</strong> Üreticiyi takip eder, herkese açık içeriklerini görürsün. Bildirim alırsın ama ücretli içeriklere erişemezsin.</li>
            <li><strong>Ücretli üyelik:</strong> Seçtiğin kademeye göre özel içerikler, dosyalar, arşiv ve sohbet kanallarına erişim. Türk lirası ile aylık ödeme.</li>
          </ul>
        ),
      },
      {
        q: 'Bir üreticiyi takip etmek için ödeme yapmalı mıyım?',
        a: 'Hayır. Takip tamamen ücretsizdir. Ücretli içeriklere erişmek istediğinde üyelik planı seçebilirsin.',
      },
      {
        q: 'Kaç üreticiyi takip edebilirim?',
        a: 'Sınır yok. İstediğin kadar üreticiyi takip edebilir veya abonelik açabilirsin.',
      },
    ],
  },
  {
    id: 'uyelik',
    icon: <IconCard />,
    title: 'Üye Olma & Ödeme',
    subtitle: 'Abonelik sürecini ve ödeme sistemini anla',
    items: [
      {
        q: 'Nasıl abone olurum?',
        a: 'Üreticinin sayfasındaki "Destekle" butonuna tıkla, istediğin kademeyi seç ve ödeme bilgilerini gir. İşlem tamamlandığında anında o kademedeki içeriklere erişim sağlanır.',
      },
      {
        q: 'Hangi ödeme yöntemleri kabul ediliyor?',
        a: 'Kredi kartı ve banka kartı (Visa, Mastercard) ile Türk lirası cinsinden ödeme yapabilirsin. Yurt içi kart gereklidir; yabancı kart desteği yakında geliyor.',
      },
      {
        q: 'Otomatik yenileme nasıl çalışır?',
        a: 'Abonelik aylık döngüde otomatik yenilenir. Her dönem başında kayıtlı kartından ücret alınır. Yenileme tarihinden önce iptal edersen, mevcut dönem sonuna kadar erişimin devam eder, para iadesi yapılmaz.',
      },
      {
        q: 'Üyeliğimi istediğim zaman iptal edebilir miyim?',
        a: 'Evet. Hesap → Üyeliklerim bölümünden istediğin zaman iptal edebilirsin. İptal sonrasında mevcut dönem bitene kadar erişim devam eder; bir sonraki dönemde ücret alınmaz.',
      },
      {
        q: 'Farklı üreticilerde birden fazla üyeliğim olabilir mi?',
        a: 'Evet. Her üretici için ayrı ayrı üyelik açabilirsin. Tüm aboneliklerini Hesap → Üyeliklerim bölümünden yönetebilirsin.',
      },
      {
        q: 'Para iadesi alabilir miyim?',
        a: 'Platform genelinde standart para iadesi politikası yoktur; her üretici kendi iade tercihini belirleyebilir. Sorun yaşadığında destek ekibiyle iletişime geçebilirsin.',
      },
    ],
  },
  {
    id: 'erisim',
    icon: <IconLock />,
    title: 'İçeriklere & Kütüphaneye Erişim',
    subtitle: 'Satın aldıklarına ve özel içeriklere nasıl ulaşırsın',
    items: [
      {
        q: 'Özel içeriklere nereden erişirim?',
        a: 'Giriş yaptıktan sonra abone olduğun üreticinin sayfasında üyelik kademene ait tüm içerikler otomatik olarak açılır. Kilit simgesi görünmeyen tüm içerikler erişilebilirdir.',
      },
      {
        q: 'Satın aldığım dijital ürünlere nereden ulaşırım?',
        a: (
          <>
            Hesap → Kütüphane bölümünde tüm satın aldığın ürünler listelenir. Dosyaları buradan indirebilirsin. Güvenli bağlantılar kişisel ve geçicidir — başkalarıyla paylaşılamaz.
          </>
        ),
      },
      {
        q: 'Dosya eki indirme butonu nasıl çalışır?',
        a: 'Gönderi içindeki bir dosya ekine tıkladığında güvenli, kişiselleştirilmiş bir indirme bağlantısı oluşturulur. Bu bağlantı 60 saniye geçerlidir; yeni tıklamada yenilenir.',
      },
      {
        q: 'Aboneliğimi iptal edersem içeriklere erişimim ne zaman kapanır?',
        a: 'Ödeme döneminin sonuna kadar erişim devam eder. Dönem bittiğinde ücretli içerikler kilitlenir. Satın aldığın dijital ürünlere erişim kalıcıdır — abonelikten bağımsız olarak kütüphanende kalır.',
      },
    ],
  },
  {
    id: 'topluluk-hayran',
    icon: <IconCommunity />,
    title: 'Topluluk & Sohbet',
    subtitle: 'Üreticilerle ve diğer destekçilerle bağlantı kur',
    items: [
      {
        q: 'Üreticiyle nasıl iletişim kurarım?',
        a: 'Üretici sayfasındaki Topluluk sekmesinden genel sohbete katılabilir ya da Mesaj butonu ile doğrudan yazabilirsin (üreticinin mesajlaşmayı etkinleştirmiş olması gerekir).',
      },
      {
        q: 'Grup sohbetine nasıl katılırım?',
        a: 'Üreticinin oluşturduğu kanallar, abonelik kademene göre otomatik açılır. Üyeliğin olan kademedeki sohbet kanallarını Topluluk sekmesinde görebilirsin.',
      },
      {
        q: 'Bildirimler nereden yönetilir?',
        a: 'Hesap → Bildirim Ayarları\'ndan hangi üreticilerden bildirim alacağını, bildirim türlerini (yeni gönderi, yeni mesaj, yenileme hatırlatması) ve kanalı (site içi, e-posta) özelleştirebilirsin.',
      },
    ],
  },
  {
    id: 'guvenlik',
    icon: <IconSupport />,
    title: 'Güvenlik & Destek',
    subtitle: 'Sorunlarını hızlıca çöz, güvende kal',
    items: [
      {
        q: 'Rahatsız edici içeriği nasıl bildiririm?',
        a: 'Her gönderi, yorum ve profil sayfasında "Bildir" seçeneği bulunur. Şiddet, taciz, telif hakkı ihlali gibi kategorilerden birini seçip açıklama ekleyebilirsin. Ekibimiz bildirimleri 24 saat içinde inceler.',
      },
      {
        q: 'Bir kullanıcıyı nasıl engellerim?',
        a: 'Kullanıcının profil sayfasından veya mesaj penceresinden "Engelle" seçeneğini kullanabilirsin. Engellenen kullanıcı sana mesaj gönderemez, yorumlarını göremez.',
      },
      {
        q: 'Ödeme sorunum var, kime ulaşırım?',
        a: (
          <>
            Ödeme sorunları için <a href="mailto:destek@lalabits.art" className="text-teal font-semibold underline">destek@lalabits.art</a> adresine e-posta gönderebilir ya da platform içi destek formunu kullanabilirsin. İşlem tarihini ve tutarını belirtmeni rica ediyoruz.
          </>
        ),
      },
      {
        q: 'Verilerimi silebilir miyim?',
        a: 'Hesap silme işlemi tüm kişisel verilerini sistemden kaldırır. KVKK kapsamında veri silme talebini destek@lalabits.art adresine iletebilirsin.',
      },
    ],
  },
];

/* ─────────────────────────────────────────── accordion item ── */
function AccordionItem({ item, isOpen, onToggle }: {
  item: GuideItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`border border-border rounded-[16px] overflow-hidden transition-all duration-200 ${isOpen ? 'bg-white shadow-[0_4px_12px_rgba(0,128,128,0.08)]' : 'bg-white hover:border-teal/30'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? 'text-teal' : 'text-text-primary'}`}>
          {item.q}
        </span>
        <span className={`shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 ${isOpen ? 'bg-teal border-teal text-white rotate-45' : 'border-border text-text-muted'}`}>
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-sm text-text-secondary leading-[1.8] border-t border-border/50 pt-4">
          {item.a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────── section block ── */
function SectionBlock({ section, openItems, onToggle }: {
  section: GuideSection;
  openItems: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div id={section.id} className="scroll-mt-24">
      {/* Başlık */}
      <div className="flex items-start gap-4 mb-5">
        <div className="shrink-0 h-12 w-12 rounded-[14px] bg-teal-light flex items-center justify-center text-teal">
          {section.icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary leading-tight">{section.title}</h2>
          <p className="text-sm text-text-muted mt-0.5">{section.subtitle}</p>
        </div>
      </div>
      {/* Accordion items */}
      <div className="flex flex-col gap-2">
        {section.items.map((item, i) => {
          const key = `${section.id}-${i}`;
          return (
            <AccordionItem
              key={key}
              item={item}
              isOpen={openItems.has(key)}
              onToggle={() => onToggle(key)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── nav sidebar ── */
function SectionNav({ sections, activeSection }: {
  sections: GuideSection[];
  activeSection: string;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            activeSection === s.id
              ? 'bg-teal-light text-teal font-semibold'
              : 'text-text-secondary hover:text-text-primary hover:bg-background'
          }`}
        >
          <span className={activeSection === s.id ? 'text-teal' : 'text-text-muted'}>{s.icon}</span>
          {s.title}
        </a>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────── page ── */
export default function RehberlerPage() {
  const [tab, setTab] = useState<'uretici' | 'hayran'>('uretici');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeSection] = useState('baslangic');

  const sections = tab === 'uretici' ? URETICI_SECTIONS : HAYRAN_SECTIONS;

  function toggleItem(key: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function expandAll() {
    const all = new Set<string>();
    sections.forEach((s) => s.items.forEach((_, i) => all.add(`${s.id}-${i}`)));
    setOpenItems(all);
  }

  function collapseAll() {
    setOpenItems(new Set());
  }

  return (
    <main className="bg-background min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white border-b border-border">
        {/* Mosaic bg */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="guide-mosaic" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="19" height="19" rx="2" fill="var(--color-teal)" opacity="0.04" />
              <rect x="21" y="21" width="19" height="19" rx="2" fill="var(--color-orange)" opacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#guide-mosaic)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-medium text-text-secondary shadow-sm mb-5">
              <svg className="h-3.5 w-3.5 text-teal" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Kapsamlı Rehber — 2025
            </div>

            <h1 className="text-[36px] sm:text-[48px] font-bold tracking-[-0.02em] text-text-primary leading-[1.1]">
              Her şeyi öğren,{' '}
              <span style={{ background: 'linear-gradient(90deg, var(--color-teal) 0%, var(--color-orange) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                harekete geç
              </span>
            </h1>

            <p className="mt-4 text-lg text-text-secondary leading-[1.7] max-w-xl">
              İçerik üreticisi veya destekçi olarak aklındaki tüm sorulara net cevaplar. Platform nasıl çalışır, ne yapabilirsin, nerede başlarsın — hepsi burada.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { n: String(URETICI_SECTIONS.reduce((a, s) => a + s.items.length, 0)) + '+', label: 'Üretici sorusu' },
                { n: String(HAYRAN_SECTIONS.reduce((a, s) => a + s.items.length, 0)) + '+', label: 'Destekçi sorusu' },
                { n: (URETICI_SECTIONS.length + HAYRAN_SECTIONS.length) + '', label: 'Konu başlığı' },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-teal">{s.n}</span>
                  <span className="text-sm text-text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab toggle (sticky) ── */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
          <div className="inline-flex rounded-xl bg-white border border-border p-1 shadow-sm">
            <button
              type="button"
              onClick={() => { setTab('uretici'); setOpenItems(new Set()); }}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-150 ${
                tab === 'uretici' ? 'bg-teal text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              İçerik Üreticisi Rehberi
            </button>
            <button
              type="button"
              onClick={() => { setTab('hayran'); setOpenItems(new Set()); }}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-150 ${
                tab === 'hayran' ? 'bg-teal text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Destekçi Rehberi
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button type="button" onClick={expandAll} className="text-xs text-text-muted hover:text-teal transition-colors px-2 py-1">
              Tümünü aç
            </button>
            <span className="text-border">|</span>
            <button type="button" onClick={collapseAll} className="text-xs text-text-muted hover:text-teal transition-colors px-2 py-1">
              Tümünü kapat
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-8 lg:gap-12">

          {/* Sidebar nav — desktop only */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-3">
                {tab === 'uretici' ? 'Üretici Rehberi' : 'Destekçi Rehberi'}
              </p>
              <SectionNav sections={sections} activeSection={activeSection} />

              {/* CTA */}
              <div className="mt-8 rounded-[20px] bg-teal-light border border-teal/20 p-5">
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {tab === 'uretici' ? 'Başlamaya hazır mısın?' : 'Destekçi olmak ister misin?'}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {tab === 'uretici'
                    ? 'Üretici hesabı aç, içeriklerini yayınla, kazanmaya başla.'
                    : 'Favori üreticilerini keşfet ve destekle.'}
                </p>
                <Link
                  href={tab === 'uretici' ? '/auth/kayit/yaratici' : '/kesfet'}
                  className="block text-center rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90 transition-colors"
                >
                  {tab === 'uretici' ? 'Üretici Ol' : 'Keşfet'}
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile: konu özeti */}
            <div className="lg:hidden mb-6 flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-teal hover:text-teal transition-colors"
                >
                  <span className="text-teal">{s.icon}</span>
                  {s.title}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-10">
              {sections.map((section) => (
                <SectionBlock
                  key={section.id}
                  section={section}
                  openItems={openItems}
                  onToggle={toggleItem}
                />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-14 rounded-[24px] overflow-hidden relative">
              <div
                className="px-8 py-12 text-center relative z-10"
                style={{ background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-dark) 60%, var(--color-orange) 150%)' }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white mb-5">
                  <span>✦</span>
                  {tab === 'uretici' ? 'İçerik üreticileri için' : 'Destekçiler için'}
                </div>
                <h3 className="text-[28px] sm:text-[36px] font-bold text-white tracking-[-0.02em] leading-tight">
                  {tab === 'uretici'
                    ? 'Topluluğunu bugün inşa et'
                    : 'Üreticileri desteklemeye başla'}
                </h3>
                <p className="mt-3 text-base text-white/80 max-w-md mx-auto leading-[1.7]">
                  {tab === 'uretici'
                    ? 'Onboarding 5 dakika. İçeriğini yayınla, Türk lirası kazan, topluluğunu büyüt.'
                    : 'Yüzlerce üretici seni bekliyor. Ücretsiz takip et ya da özel içeriklere abone ol.'}
                </p>
                <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href={tab === 'uretici' ? '/auth/kayit/yaratici' : '/kesfet'}
                    className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-teal hover:bg-white/90 transition-colors shadow-lg"
                  >
                    {tab === 'uretici' ? 'Üretici Hesabı Aç' : 'Üreticileri Keşfet'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setTab(tab === 'uretici' ? 'hayran' : 'uretici')}
                    className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    {tab === 'uretici' ? 'Destekçi Rehberini Gör' : 'Üretici Rehberini Gör'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
