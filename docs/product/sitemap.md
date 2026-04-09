# Sitemap — lalabits.art

> This document is the complete page inventory for lalabits.art. Every route, its purpose,
> access level, and MVP status is defined here. This document is the authoritative reference for
> frontend routing, backend access control planning, and sprint scoping.
>
> Source of truth for scope: [CLAUDE.md](../../CLAUDE.md) and [vision.md](./vision.md).

---

## Navigation Structure Overview

```
lalabits.art
├── /                    public marketing
├── /auth/...            authentication flows
├── /onboarding/...      creator setup wizard
├── /kesfet              creator discovery
├── /@[username]/...     public creator profile pages
├── /checkout/...        transaction flows
├── /uyelik/...          membership management actions
├── /account/...         fan account pages
├── /dashboard/...       creator dashboard
├── /admin/...           admin / operations
└── /legal/...           legal and trust pages
```

### Design Decisions

**Creator URL pattern — `/@[username]`**
Without the `@` prefix, any creator username could collide with top-level system routes like
`/kesfet`, `/admin`, `/legal`, `/magaza`. The `@` acts as a permanent namespace reservation and
signals to users that this is a person/creator, not a platform page.

**Turkish-first routing**
All routes use Turkish words (`kesfet`, `gonderiler`, `uyelik`, etc.) consistent with the
Turkey-first product principle. URLs look natural to Turkish users.

**Membership management at `/uyelik/[id]/...`**
Kept separate from `/account/uyeliklerim/[id]` because upgrade/downgrade/cancel pages may be
linked to directly from billing notification emails. Shorter, standalone URLs are better for
transactional contexts.

---

## Header Navigation

### Unauthenticated Visitor

```
Logo (/) | Keşfet (/kesfet) | Özellikler (/ozellikler) | Fiyatlar (/fiyatlar) | Kaynaklar (/kaynaklar)
                                                          [Giriş Yap] [Başla →]
```

- **Giriş Yap** → `/auth/giris`
- **Başla →** (primary CTA button, accent orange) → `/baslangic`

### Authenticated Fan

```
Logo (/) | Keşfet (/kesfet) | [🔔 Bildirimler] | [💬 Mesajlar] | [Avatar ▾]
                                                                    ↳ Kütüphanem (/account/kutuphane)
                                                                    ↳ Üyeliklerim (/account/uyeliklerim)
                                                                    ↳ Hesabım (/account)
                                                                    ↳ Çıkış (/auth/cikis)
```

### Authenticated Creator

```
Logo (/dashboard) | Profilim (/@username) | [🔔 Bildirimler] | [💬 Mesajlar] | [Avatar ▾]
                                                                                 ↳ Dashboard (/dashboard)
                                                                                 ↳ Profilim (/@username)
                                                                                 ↳ Hesabım (/account/ayarlar)
                                                                                 ↳ Çıkış (/auth/cikis)
```

---

## Footer Navigation

```
Sütun 1 — Platform          Sütun 2 — Yaratıcılar        Sütun 3 — Destek             Sütun 4 — Yasal
Ana Sayfa (/)               Yaratıcı Ol (/baslangic)      İletişim (/iletisim)          Kullanım Koşulları
Keşfet (/kesfet)            Yaratıcılar (/yaraticilar)    Yardım Merkezi [Sonraki faz]  Gizlilik Politikası
Özellikler (/ozellikler)    Kaynaklar (/kaynaklar)        Platform Güncellemeleri       Çerez Politikası
Fiyatlar (/fiyatlar)        Güven (/legal/guven-ve-...)                                 Telif Hakkı / DMCA
                            Gelir Modeli (/fiyatlar)                                    Yaratıcı Sözleşmesi
                                                                                        Güven ve Güvenlik

Alt çubuk: © 2026 lalabits.art · Türkiye
```

---

## Navigation Relationship Map

```
/ (Ana Sayfa)
├── /kesfet ────────────────────────────── /@[username] (Yaratıcı Profili)
│                                               ├── /uyelik ──────── /checkout/uyelik/.../...
│                                               ├── /gonderi
│                                               │       └── /[post-id]  (erişim kapısı)
│                                               ├── /magaza ──────── /checkout/urun/[id]
│                                               │       └── /[product-id]
│                                               └── /koleksiyonlar ── /checkout/koleksiyon/[id]
│                                                       └── /[collection-id]
│
├── /baslangic
│       ├── /auth/kayit/fan ─────────────── /account (Fan hesabı)
│       └── /auth/kayit/yaratici ─────────── /onboarding → (admin onayı) → /dashboard
│
/account
├── /kutuphane
├── /satin-almalar
├── /uyeliklerim ─── /uyeliklerim/[id] ─── /uyelik/[id]/iptal
│                                       ─── /uyelik/[id]/yuksel
│                                       ─── /uyelik/[id]/dusur
├── /mesajlar ─── /mesajlar/[creator-username]
├── /grup-sohbet ─── /grup-sohbet/[room-id]
└── /fatura ─── /fatura/gecmis

/dashboard
├── /gonderiler ─── /yeni | /[id]/duzenle
├── /uyelik-planlari ─── /yeni | /[id]/duzenle
├── /koleksiyonlar ─── /yeni | /[id]/duzenle
├── /magaza ─── /yeni | /[id]/duzenle
├── /kitle ─── /[fan-id]
├── /mesajlar ─── /[fan-id]
├── /grup-sohbet ─── /yeni | /[room-id]
├── /analitik ─── /gelir | /uyeler | /icerik
├── /odeme
└── /ayarlar ─── /profil | /sayfa | /bildirimler | /hesap | /uyumluluk

/admin
├── /yaraticilar ─── /inceleme | /[creator-id]
├── /kullanicilar ─── /[user-id]
├── /moderasyon ─── /raporlar/[report-id] | /icerik
├── /telif-hakki ─── /[claim-id]
├── /fatura ─── /anlasmmazliklar | /odemeler
├── /denetim-gunlugu
└── /icerik-yonetimi ─── /kaynaklar | /guncellemeler
```

---

## Section 1 — Public Marketing Pages

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/` | Ana Sayfa | Platform hero: değer önerisi, creator ve fan dönüşümü, öne çıkan yaratıcılar | Başla → | Ziyaretçi | Public | MVP | Creator profilleri, yok |
| `/ozellikler` | Özellikler | Creator ve fan için tam özellik listesi; Türkiye pazarı sorunlarını ele alır | Yaratıcı Ol / Keşfet | Ziyaretçi | Public | Faz 1 | Yok |
| `/fiyatlar` | Fiyatlar | Platform komisyon oranları ve creator gelir modeli şeffaflığı | Yaratıcı Ol | Ziyaretçi | Public | Faz 1 | Yok |
| `/yaraticilar` | Yaratıcılar | Kategoriye göre öne çıkan yaratıcılar vitrini; sosyal kanıt ve ilham | Keşfet / Takip Et | Ziyaretçi | Public | Faz 1 | Creator profilleri, keşif |
| `/kesfet` | Keşfet | Tüm yaratıcıları kategori, format ve üyelik fiyatına göre filtrele ve gözat | Yaratıcı sayfasına git | Ziyaretçi / Fan | Public | MVP | Creator index, arama |
| `/kaynaklar` | Kaynaklar | Creator odaklı eğitim blogu, rehberler ve platform güncellemeleri | İçerik oku / Yaratıcı Ol | Ziyaretçi | Public | Faz 1 | CMS |
| `/kaynaklar/[slug]` | Kaynak Detayı | Tek kaynak/blog yazısı sayfası | İlgili kaynakları oku / Başla | Ziyaretçi | Public | Faz 1 | CMS |
| `/hakkimizda` | Hakkımızda | Marka hikayesi, misyon, Türkiye taahhüdü | Başla | Ziyaretçi | Public | Faz 1 | Yok |
| `/iletisim` | İletişim | Creator desteği, basın ve genel sorular için iletişim formu | Mesaj gönder | Ziyaretçi | Public | MVP | E-posta teslimi |
| `/baslangic` | Başlangıç | Yönlendirme sayfası: ziyaretçiyi fan kaydına veya creator başvurusuna yönlendirir | Fan kaydı / Yaratıcı başvurusu | Ziyaretçi | Public | MVP | Auth modülü |
| `/guncellemeler` | Platform Güncellemeleri | Changelog ve creator ile fanlar için ürün haberleri | — | Ziyaretçi | Public | Faz 1 | CMS |

---

## Section 2 — Auth Flows

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/auth/giris` | Giriş Yap | E-posta/şifre ile giriş, sosyal auth seçenekleri | Giriş Yap | Ziyaretçi | Public | MVP | Auth, oturum |
| `/auth/kayit/fan` | Fan Kaydı | Fan hesabı kaydı: e-posta, şifre, ekran adı | Hesap Oluştur | Ziyaretçi | Public | MVP | Auth, e-posta doğrulama |
| `/auth/kayit/yaratici` | Yaratıcı Başvurusu | Creator hesabı kaydı başlangıç noktası; onboarding öncesi niyeti belirler | Başvuruyu Başlat | Ziyaretçi | Public | MVP | Auth, creator onboarding |
| `/auth/sifre-sifirla` | Şifre Sıfırla | E-posta ile şifre sıfırlama isteği | E-posta Gönder | Ziyaretçi | Public | MVP | Auth, e-posta teslimi |
| `/auth/sifre-sifirla/[token]` | Yeni Şifre Belirle | E-postadaki sıfırlama token'ı ile yeni şifre belirleme | Şifremi Güncelle | Ziyaretçi | Public | MVP | Auth, token doğrulama |
| `/auth/e-posta-dogrula` | E-posta Doğrulama | Kayıt sonrası kullanıcıdan e-posta kontrolü isteyen bekleme sayfası | — | Ziyaretçi | Public | MVP | Auth, e-posta teslimi |
| `/auth/e-posta-dogrula/[token]` | E-posta Onayı | Token tabanlı e-posta doğrulama tamamlama | Ana sayfaya git | Ziyaretçi | Public | MVP | Auth, token doğrulama |
| `/auth/cikis` | Çıkış | Oturum sonlandırma ve ana sayfaya yönlendirme | — | Fan / Creator | Auth-gerekli | MVP | Oturum |

---

## Section 3 — Creator Onboarding Flow

Çok adımlı sihirbaz. Her adım artımlı olarak kaydedilir. İlerleme oturumlar arası korunur.
Creator, onboarding tamamlanana ve başvurusu admin tarafından onaylanana kadar dashboard'a erişemez.

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/onboarding` | Onboarding Girişi | Onboarding adımlarına genel bakış ve giriş noktası | Başla | Creator (onaysız) | Auth-gerekli | MVP | Auth |
| `/onboarding/profil` | Profil Kurulumu | Ekran adı, kullanıcı adı (`/@username` tanımlar), biyografi, avatar ve kapak görseli | Devam Et | Creator | Auth-gerekli | MVP | Depolama, kullanıcı adı benzersizlik kontrolü |
| `/onboarding/kategori` | Kategori ve Format | Creator kategorisi (yazar, sanatçı, eğitimci vb.) ve içerik formatları seçimi | Devam Et | Creator | Auth-gerekli | MVP | Kategori sınıflandırması |
| `/onboarding/uyelik-planlari` | Üyelik Planları | En az bir üyelik katmanı oluşturma: ad, fiyat (TRY), fatura aralığı, avantaj listesi | Devam Et | Creator | Auth-gerekli | MVP | Üyelik modülü |
| `/onboarding/odeme` | Ödeme Bilgileri | Ödeme yöntemi bağlama (Türkiye ödemeleri için banka hesabı / IBAN) | Devam Et | Creator | Auth-gerekli | MVP | Ödeme modülü, bankacılık entegrasyonu |
| `/onboarding/sozlesme` | Sözleşme Onayı | Creator sözleşmesini ve platform koşullarını inceleme ve kabul etme | Kabul Et ve Gönder | Creator | Auth-gerekli | MVP | Hukuki modül |
| `/onboarding/inceleme` | Başvuru Gönderildi | Başvurunun gönderildiğini ve admin incelemesinde olduğunu onaylayan sayfa | Dashboard'a git (onay sonrası aktif) | Creator | Auth-gerekli | MVP | Admin inceleme kuyruğu |

---

## Section 4 — Public Creator Profile Pages

`/@[username]/` altındaki tüm sayfalar. Ziyaretçiler ve fanlara görünür. Bunlar üyelik ve satın alma için ana dönüşüm sayfalarıdır.

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/@[username]` | Yaratıcı Ana Sayfası | Creator'ın birincil genel profili: biyografi, öne çıkan içerik, üyelik katmanları özeti, son gönderi önizlemesi | Üye Ol / Takip Et | Ziyaretçi / Fan | Public | MVP | Creator profili, üyelikler, gönderiler |
| `/@[username]/gonderi` | Gönderi Akışı | Erişim seviyesi rozetleriyle (genel / üye / katman-kilitli / premium) tam creator gönderi akışı | Üye Ol (kilitli gönderileri açmak için) | Ziyaretçi / Fan | Public | MVP | Feed, üyelik yetkilendirme |
| `/@[username]/gonderi/[post-id]` | Gönderi Detayı | Tek gönderi görünümü; kilitli gönderiler erişim yoksa önizleme + üst satış gösterir | Üye Ol / Satın Al | Ziyaretçi / Fan | Public (kapı ile) | MVP | Feed, yetki kontrolü, üyelik |
| `/@[username]/uyelik` | Üyelik Planları | Tam katman karşılaştırma sayfası: adlar, fiyatlar, fatura aralıkları, avantaj listeleri; birincil dönüşüm sayfası | Üye Ol | Ziyaretçi / Fan | Public | MVP | Üyelik modülü, ödeme |
| `/@[username]/magaza` | Mağaza | Creator'ın dijital ürün vitrini: fiyat, format ve açıklamayla tüm ürünler | Satın Al | Ziyaretçi / Fan | Public | MVP | Mağaza modülü, ödeme |
| `/@[username]/magaza/[product-id]` | Ürün Detayı | Tek ürün sayfası: tam açıklama, dosya formatı, önizleme (varsa), fiyatlandırma | Satın Al | Ziyaretçi / Fan | Public | MVP | Mağaza modülü, ödeme |
| `/@[username]/koleksiyonlar` | Koleksiyonlar | Tüm creator koleksiyonlarına gözat: başlık, açıklama, erişim kuralı (satın alma veya katman), içerik sayısı | Satın Al / Üye Ol | Ziyaretçi / Fan | Public | MVP | Koleksiyonlar modülü, ödeme |
| `/@[username]/koleksiyonlar/[collection-id]` | Koleksiyon Detayı | Tek koleksiyon görünümü: tam içerik listesi, erişim önizlemesi; kilitli öğeler önizleme olarak gösterilir | Satın Al / Üye Ol | Ziyaretçi / Fan | Public (kapı ile) | MVP | Koleksiyonlar, yetki, ödeme |

---

## Section 5 — Fan / Member Account Pages

`/account/` altındaki tüm sayfalar. Kimlik doğrulama gerektirir.

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/account` | Hesabım | Hesap merkezi: kütüphane, üyelikler, mesajlar, bildirimlere hızlı bağlantılar | — (gezinme merkezi) | Fan | Auth-gerekli | MVP | Tüm hesap modülleri |
| `/account/kutuphane` | Kütüphanem | Desteklenen tüm creatorlarda kilidi açılmış içeriklerin birleşik kütüphanesi (gönderiler, dosyalar, koleksiyonlar) | İçeriğe git | Fan | Auth-gerekli | MVP | Yetki, satın alma geçmişi, koleksiyonlar |
| `/account/satin-almalar` | Satın Almalarım | Tüm tek seferlik satın alma geçmişi: dijital ürünler, koleksiyonlar, indirme bağlantıları | İndir / Görüntüle | Fan | Auth-gerekli | MVP | Mağaza, koleksiyonlar, dosya teslimi |
| `/account/uyeliklerim` | Üyeliklerim | Tüm aktif ve geçmiş üyelikler: katman adı, creator, sonraki fatura tarihi, durum | Yönet / İptal Et | Fan | Auth-gerekli | MVP | Üyelik modülü, fatura |
| `/account/uyeliklerim/[membership-id]` | Üyelik Detayı | Tek üyelik yönetim görünümü: katman detayları, fatura geçmişi, yükseltme/düşürme/iptal seçenekleri | Üyeliği Yönet | Fan | Auth-gerekli | MVP | Üyelik, fatura, iptal |
| `/account/bildirimler` | Bildirimler | Bildirim merkezi: yeni gönderiler, üyelik güncellemeleri, ürün sürümleri, sohbet mesajları | Bildirimi oku / İçeriğe git | Fan | Auth-gerekli | MVP | Bildirim modülü |
| `/account/mesajlar` | Mesajlarım | Fan'ın mesajlaştığı tüm creatorlarla 1:1 doğrudan mesaj gelen kutusu | Mesaja git | Fan | Auth-gerekli | MVP | Sohbet modülü (1:1) |
| `/account/mesajlar/[creator-username]` | Yaratıcı ile Mesaj | Belirli bir creatorla tek 1:1 konuşma akışı | Mesaj gönder | Fan | Auth-gerekli | MVP | Sohbet modülü (1:1) |
| `/account/grup-sohbet` | Grup Sohbetleri | Fanın erişebildiği tüm grup sohbet odalarının listesi (aktif üyelik katmanlarına göre) | Sohbete katıl | Fan | Auth-gerekli | MVP | Sohbet modülü (grup), üyelik yetki |
| `/account/grup-sohbet/[room-id]` | Grup Sohbet Odası | Belirli bir creator topluluğu katmanı için tek grup sohbet odası görünümü | Mesaj gönder | Fan | Auth-gerekli | MVP | Sohbet modülü (grup), yetki |
| `/account/fatura` | Fatura ve Ödeme | Fatura genel bakış: kayıtlı ödeme yöntemi, fatura geçmişi, makbuzlar | Yöntemi Güncelle | Fan | Auth-gerekli | MVP | Fatura modülü, ödeme ağ geçidi |
| `/account/fatura/gecmis` | Fatura Geçmişi | İndirme bağlantılarıyla tüm fatura ve ücretlerin tam listesi | Faturayı İndir | Fan | Auth-gerekli | MVP | Fatura modülü |
| `/account/ayarlar` | Hesap Ayarları | Hesap ayarları: ekran adı, e-posta, şifre, bildirim tercihleri | Kaydet | Fan | Auth-gerekli | MVP | Auth, bildirim tercihleri |
| `/account/ayarlar/bildirimler` | Bildirim Tercihleri | Olay türüne göre ayrıntılı bildirim ayarları: e-posta, uygulama içi, tarayıcı push | Kaydet | Fan | Auth-gerekli | MVP | Bildirim modülü |
| `/account/ayarlar/gizlilik` | Gizlilik Ayarları | Gizlilik kontrolleri: profil görünürlüğü, veri tercihleri | Kaydet | Fan | Auth-gerekli | Faz 1 | Gizlilik modülü |

---

## Section 6 — Checkout and Transaction Flows

Durum bilgili akışlar. Kullanıcılar creator profil sayfaları, mağaza ürün sayfaları veya koleksiyon sayfalarından gelir. Onay sayfaları ödeme sonrası dönüş için URL üzerinden erişilebilir olmalıdır.

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/checkout/uyelik/[creator-username]/[tier-id]` | Üyelik Ödeme | Üyelik ödemesi: seçili katman özeti, fatura aralığı seçimi (aylık/yıllık), ödeme formu | Üyeliği Tamamla | Fan | Auth-gerekli | MVP | Üyelik modülü, ödeme ağ geçidi, fatura |
| `/checkout/urun/[product-id]` | Ürün Satın Al | Dijital ürün ödemesi: ürün özeti, fiyat, ödeme formu | Satın Almayı Tamamla | Fan | Auth-gerekli | MVP | Mağaza modülü, ödeme ağ geçidi |
| `/checkout/koleksiyon/[collection-id]` | Koleksiyon Satın Al | Koleksiyon ödemesi: koleksiyon özeti, fiyat, ödeme formu | Satın Almayı Tamamla | Fan | Auth-gerekli | MVP | Koleksiyonlar modülü, ödeme ağ geçidi |
| `/checkout/onay/[order-id]` | Ödeme Onayı | Ödeme başarı onayı: satın alma özeti, sonraki adımlar, kütüphane bağlantısı | Kütüphaneme Git | Fan | Auth-gerekli | MVP | Sipariş modülü, fatura |
| `/checkout/hata/[order-id]` | Ödeme Hatası | Ödeme başarısızlık sayfası: hata nedeni, yeniden deneme seçeneği, destek bağlantısı | Tekrar Dene | Fan | Auth-gerekli | MVP | Ödeme ağ geçidi, fatura |

---

## Section 7 — Membership Management

Fan'ın `/account/uyeliklerim/[membership-id]` sayfasından veya mevcut üyeler için creator profil katman kartlarından erişilebilir.

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/uyelik/[membership-id]/yuksel` | Tier Yükselt | Daha yüksek bir katmana yükseltme: mevcut vs hedef katman karşılaştırma, orantılı fatura açıklaması, onay | Tier'ı Yükselt | Fan | Auth-gerekli | MVP | Üyelik modülü, fatura, orantılama mantığı |
| `/uyelik/[membership-id]/dusur` | Tier Düşür | Daha düşük bir katmana düşürme: kaybedilecek erişimi göster, geçerlilik tarihi, onay | Tier'ı Düşür | Fan | Auth-gerekli | MVP | Üyelik modülü, fatura, erişim kontrolü |
| `/uyelik/[membership-id]/iptal` | Üyelik İptal | İptal akışı: neyin kaybedileceğini göster, geçerlilik tarihi (fatura dönemi sonu), elde tutma teklifi, son onay | Üyeliği İptal Et | Fan | Auth-gerekli | MVP | Üyelik modülü, fatura, iptal mantığı |
| `/uyelik/[membership-id]/yenile` | Üyelik Yenile | Hâlâ erişim dönemindeki iptal edilmiş üyeliği yeniden etkinleştir veya süresi dolmuş olanı yenile | Üyeliği Yenile | Fan | Auth-gerekli | MVP | Üyelik modülü, fatura |
| `/uyelik/[membership-id]/odeme-guncelle` | Ödeme Yöntemi Güncelle | Belirli bir üyeliğe bağlı ödeme yöntemini güncelle | Kaydet | Fan | Auth-gerekli | MVP | Fatura, ödeme ağ geçidi |

---

## Section 8 — Creator Dashboard

`/dashboard/` altındaki tüm sayfalar. Creator rolü ve onaylı durum gerektirir. Dashboard içinde sol kenar çubuğu navigasyonu. Fanlara görünmez.

### Genel Bakış

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard` | Genel Bakış | Gelir özeti, son aktivite, aktif üye sayısı, en iyi içerik, hızlı eylem kısayolları | Gönderi Oluştur | Creator | Creator-only | MVP | Analitik, üyelik, gönderiler, gelir |

### Gönderiler ve Feed

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/gonderiler` | Gönderilerim | Tüm gönderi listesi: yayınlı, taslak, planlanmış; tür ve erişim seviyesine göre filtrelenebilir | Yeni Gönderi | Creator | Creator-only | MVP | Feed modülü |
| `/dashboard/gonderiler/yeni` | Yeni Gönderi Oluştur | Zengin metin editörü: içerik türü, erişim seviyesi (genel/üye/katman/premium), zamanlama, yayınlama | Yayınla | Creator | Creator-only | MVP | Feed modülü, medya yükleme, zamanlama |
| `/dashboard/gonderiler/[post-id]/duzenle` | Gönderiyi Düzenle | Mevcut yayınlı veya taslak gönderiyi düzenle | Kaydet / Yayınla | Creator | Creator-only | MVP | Feed modülü, medya yükleme |

### Üyelik Planları

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/uyelik-planlari` | Üyelik Planları | Tüm üyelik katmanlarına genel bakış: adlar, fiyatlar, abone sayıları, katman başına gelir | Yeni Plan Ekle | Creator | Creator-only | MVP | Üyelik modülü |
| `/dashboard/uyelik-planlari/yeni` | Yeni Plan Oluştur | Yeni üyelik katmanı oluşturma: ad, fiyat (TRY), fatura aralıkları, avantaj listesi, katman görünürlüğü | Planı Kaydet | Creator | Creator-only | MVP | Üyelik modülü |
| `/dashboard/uyelik-planlari/[tier-id]/duzenle` | Planı Düzenle | Mevcut üyelik katmanını düzenle; aktif aboneler varsa etki uyarısı göster | Değişiklikleri Kaydet | Creator | Creator-only | MVP | Üyelik modülü, abone etki mantığı |

### Koleksiyonlar

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/koleksiyonlar` | Koleksiyonlarım | Tüm koleksiyon listesi: başlık, içerik sayısı, erişim türü, satılıyorsa gelir | Yeni Koleksiyon | Creator | Creator-only | MVP | Koleksiyonlar modülü |
| `/dashboard/koleksiyonlar/yeni` | Yeni Koleksiyon Oluştur | Koleksiyon oluşturma: başlık, açıklama, içerik öğelerini ata, erişim kuralı belirle (satın alma fiyatı veya katman kapısı), yayınla | Koleksiyonu Yayınla | Creator | Creator-only | MVP | Koleksiyonlar modülü, gönderiler, mağaza |
| `/dashboard/koleksiyonlar/[collection-id]/duzenle` | Koleksiyonu Düzenle | Koleksiyon meta verilerini ve içerik atamalarını düzenle | Kaydet | Creator | Creator-only | MVP | Koleksiyonlar modülü |

### Mağaza / Dijital Ürünler

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/magaza` | Mağazam | Tüm dijital ürünler: başlık, fiyat, satış sayısı, indirme sayısı, durum | Yeni Ürün Ekle | Creator | Creator-only | MVP | Mağaza modülü |
| `/dashboard/magaza/yeni` | Yeni Ürün Ekle | Dijital ürün yükleme: dosya(lar), başlık, açıklama, fiyat, önizleme görseli, yayınla | Ürünü Yayınla | Creator | Creator-only | MVP | Mağaza modülü, dosya depolama |
| `/dashboard/magaza/[product-id]/duzenle` | Ürünü Düzenle | Ürün meta verilerini düzenle, dosyaları değiştir, fiyatı güncelle | Kaydet | Creator | Creator-only | MVP | Mağaza modülü, dosya depolama |

### Kitle / Üyeler

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/kitle` | Kitlem | Tüm üyeler ve takipçiler: katman dağılımı, katılım tarihleri, durum (aktif/iptal/pasif) | Mesaj Gönder | Creator | Creator-only | MVP | Üyelik modülü, fan hesapları |
| `/dashboard/kitle/[fan-id]` | Üye Detayı | Bireysel üye görünümü: katman, fatura geçmişi, katılım tarihi, mesajlar, içerik erişim kaydı | Mesaj Gönder | Creator | Creator-only | MVP | Üyelik, fatura, sohbet |

### Sohbet ve Topluluk

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/mesajlar` | Gelen Kutusu | Creatorla mesajlaşan tüm fanlarla 1:1 doğrudan mesaj gelen kutusu | Mesaja git | Creator | Creator-only | MVP | Sohbet modülü (1:1) |
| `/dashboard/mesajlar/[fan-id]` | Fan ile Mesaj | Belirli bir fanla tek 1:1 konuşma akışı | Mesaj gönder | Creator | Creator-only | MVP | Sohbet modülü (1:1) |
| `/dashboard/grup-sohbet` | Grup Sohbet Odaları | Tüm creator grup sohbet odalarının listesi: ad, bağlı katman, üye sayısı | Oda Oluştur | Creator | Creator-only | Faz 1 | Sohbet modülü (grup), üyelik |
| `/dashboard/grup-sohbet/yeni` | Yeni Oda Oluştur | Grup sohbet odası oluşturma: ad, açıklama, üyelik katmanına bağla, moderasyon ayarları | Odayı Oluştur | Creator | Creator-only | Faz 1 | Sohbet modülü (grup), üyelik |
| `/dashboard/grup-sohbet/[room-id]` | Oda Yönetimi | Mevcut grup odasını yönet: mesajları görüntüle, sabitle, üyeleri kaldır, ayarları düzenle | Mesaj gönder | Creator | Creator-only | Faz 1 | Sohbet modülü (grup) |

### Analitik

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/analitik` | Analitik Genel Bakış | Birleşik analitik: gelir trendi, abone büyümesi, en iyi içerik, dönüşüm hunisi özeti | — (görüntüle) | Creator | Creator-only | MVP | Analitik modülü |
| `/dashboard/analitik/gelir` | Gelir Analitikleri | Gelir dağılımı: üyelikler vs ürünler vs koleksiyonlar, aylık trend, ödeme geçmişi | Ödemeye Git | Creator | Creator-only | MVP | Analitik, fatura, ödeme |
| `/dashboard/analitik/uyeler` | Üye Analitikleri | Üye büyümesi: yeni vs kayıp, zaman içinde katman dağılımı, elde tutma | — (görüntüle) | Creator | Creator-only | Faz 1 | Analitik, üyelik |
| `/dashboard/analitik/icerik` | İçerik Analitikleri | Gönderi ve ürün performansı: öğe başına görüntüleme, kilit açma, satın alma | — (görüntüle) | Creator | Creator-only | Faz 1 | Analitik, feed, mağaza |

### Ayarlar ve Ödeme

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/dashboard/odeme` | Ödeme ve Kazanç | Ödeme takvimi, kullanılabilir bakiye, ödeme geçmişi, bağlı banka hesabı | Para Çek | Creator | Creator-only | MVP | Ödeme modülü, bankacılık entegrasyonu |
| `/dashboard/ayarlar` | Yaratıcı Ayarları | Creator profil ayarları merkezi: profil bilgileri, sosyal bağlantılar, creator sayfa özelleştirmesi | Kaydet | Creator | Creator-only | MVP | Creator profili |
| `/dashboard/ayarlar/profil` | Profil Ayarları | Ekran adı, kullanıcı adı, biyografi, avatar, kapak görseli, sosyal bağlantıları düzenle | Kaydet | Creator | Creator-only | MVP | Creator profili, depolama |
| `/dashboard/ayarlar/sayfa` | Sayfa Ayarları | Creator sayfasını özelleştir: öne çıkan içerik, katman görüntüleme sırası, sayfa bölümleri açık/kapalı | Kaydet | Creator | Creator-only | Faz 1 | Creator profili |
| `/dashboard/ayarlar/bildirimler` | Bildirim Ayarları | Creator bildirim tercihleri: yeni üye, yeni mesaj, ödeme alındı, platform güncellemeleri | Kaydet | Creator | Creator-only | MVP | Bildirim modülü |
| `/dashboard/ayarlar/hesap` | Hesap Ayarları | E-posta, şifre, bağlı hesaplar, hesap silme isteği | Kaydet | Creator | Creator-only | MVP | Auth |
| `/dashboard/ayarlar/uyumluluk` | Uyumluluk ve Hukuk | Vergi bilgileri, kimlik doğrulama durumu, dosyadaki creator sözleşmesi versiyonu | Güncellemeleri Kabul Et | Creator | Creator-only | Faz 1 | Hukuki, KYC |

---

## Section 9 — Admin / Operations Dashboard

`/admin/` altındaki tüm sayfalar. Admin rolü gerektirir. Creator ve fan akışlarından ayrıdır.

### Genel Bakış

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin` | Admin Genel Bakış | Platform sağlığı: bekleyen incelemeler, açık raporlar, fatura uyarıları, bugünkü yeni kayıtlar | — (gezinme merkezi) | Admin | Admin-only | MVP | Tüm admin modülleri |

### Creator Yönetimi

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin/yaraticilar` | Yaratıcı Listesi | Tüm creatorlar: durum (bekliyor/onaylı/askıya alınmış/reddedilmiş), kayıt tarihi, gelir | Detayı Görüntüle | Admin | Admin-only | MVP | Creator modülü |
| `/admin/yaraticilar/inceleme` | İnceleme Kuyruğu | İnceleme bekleyen creator başvuruları kuyruğu | İncele | Admin | Admin-only | MVP | Creator onboarding, inceleme modülü |
| `/admin/yaraticilar/[creator-id]` | Yaratıcı Detayı | Tam creator profil görünümü: başvuru verileri, içerik, üyeler, gelir, moderasyon geçmişi | Onayla / Reddet / Askıya Al | Admin | Admin-only | MVP | Creator modülü, moderasyon |

### Kullanıcı Yönetimi

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin/kullanicilar` | Kullanıcı Listesi | Tüm fan hesapları: kayıt, aktif üyelikler, satın alma sayısı, hesap durumu | Detayı Görüntüle | Admin | Admin-only | Faz 1 | Kullanıcı modülü |
| `/admin/kullanicilar/[user-id]` | Kullanıcı Detayı | Bireysel kullanıcı hesabı görünümü: profil, üyelikler, satın almalar, moderasyon geçmişi | Hesabı Yönet | Admin | Admin-only | Faz 1 | Kullanıcı modülü, moderasyon, fatura |

### Moderasyon ve Raporlar

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin/moderasyon` | Moderasyon Merkezi | Genel bakış: türe göre açık rapor sayısı, tırmanmış öğeler, kuyruk sağlığı | — (gezinme merkezi) | Admin | Admin-only | MVP | Moderasyon modülü |
| `/admin/moderasyon/raporlar` | Rapor Kuyruğu | Kullanıcı tarafından gönderilen tüm içerik ve hesap raporları: neden, raporlayan, hedef, durum | İncele | Admin | Admin-only | MVP | Raporlama modülü |
| `/admin/moderasyon/raporlar/[report-id]` | Rapor Detayı | Bireysel rapor görünümü: kanıtlar, bağlam, geçmiş, eylem seçenekleri (uyar / kısıtla / kaldır) | İşlem Uygula | Admin | Admin-only | MVP | Moderasyon, kullanıcı/creator hesapları, içerik |
| `/admin/moderasyon/icerik` | İçerik Moderasyonu | İnceleme için işaretlenmiş içerik kuyruğu: gönderiler, ürünler ve koleksiyonlar | Gözden Geçir | Admin | Admin-only | MVP | Moderasyon, içerik modülleri |

### Telif Hakkı ve DMCA

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin/telif-hakki` | Telif Hakkı Talepleri | Gönderilen tüm telif hakkı talepleri: hak sahibi, hedef içerik, durum, son tarih | İncele | Admin | Admin-only | Faz 1 | Telif hakkı modülü, içerik modülleri |
| `/admin/telif-hakki/[claim-id]` | Telif Talebi Detayı | Bireysel DMCA talebi görünümü: kanıtlar, creator itiraz bildirimi, eylem seçenekleri | İşlem Uygula | Admin | Admin-only | Faz 1 | Telif hakkı modülü, moderasyon |

### Fatura Operasyonları

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin/fatura` | Fatura Operasyonları | Platform genelinde fatura sağlığı: başarısız ödemeler, anlaşmazlıklar, yaklaşan yenilemeler, ödeme kuyruğu | — (görüntüle) | Admin | Admin-only | MVP | Fatura modülü, ödeme ağ geçidi |
| `/admin/fatura/anlasmmazliklar` | Anlaşmazlıklar | İtiraz ve geri ödeme kuyruğu: durum, tutarlar, çözüm seçenekleri | İşlem Uygula | Admin | Admin-only | Faz 1 | Fatura, ödeme ağ geçidi |
| `/admin/fatura/odemeler` | Yaratıcı Ödemeleri | Creator ödeme kuyruğu: bekleyen ve işlenmiş ödemeler, tutarlar, creator detayları | Ödemeyi İşle | Admin | Admin-only | Faz 1 | Ödeme modülü |

### Denetim Günlüğü

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin/denetim-gunlugu` | Denetim Günlüğü | Tüm admin eylemlerinin değiştirilemez kaydı: aktör, eylem türü, hedef, zaman damgası, öncesi/sonrası durum | Filtrele / Dışa Aktar | Admin | Admin-only | MVP | Denetim modülü |

### CMS / Platform İçeriği

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/admin/icerik-yonetimi` | İçerik Yönetimi | Pazarlama sayfaları, blog yazıları ve platform güncellemelerini yönetmek için CMS merkezi | Yeni İçerik Oluştur | Admin | Admin-only | Faz 1 | CMS modülü |
| `/admin/icerik-yonetimi/kaynaklar` | Kaynaklar Yönetimi | `/kaynaklar` için blog yazıları ve creator rehberleri oluştur, düzenle ve yayınla | Yayınla | Admin | Admin-only | Faz 1 | CMS modülü |
| `/admin/icerik-yonetimi/guncellemeler` | Güncelleme Notları Yönetimi | `/guncellemeler` için platform changelog girdileri oluştur ve yayınla | Yayınla | Admin | Admin-only | Faz 1 | CMS modülü |

---

## Section 10 — Legal / Trust / Footer Pages

`/legal/` altındaki tüm sayfalar. Platform başlatılmadan önce mevcut olması zorunlu statik sayfalar.

| Route | Sayfa Adı | Amaç | Ana CTA | Kullanıcı | Erişim | Faz | Bağımlılıklar |
|---|---|---|---|---|---|---|---|
| `/legal/kullanim-kosullari` | Kullanım Koşulları | Tüm kullanıcılar için platform hizmet koşulları | — (oku) | Ziyaretçi | Public | MVP | Yok |
| `/legal/gizlilik-politikasi` | Gizlilik Politikası | Veri toplama ve kullanımını açıklayan KVKK uyumlu gizlilik politikası | — (oku) | Ziyaretçi | Public | MVP | Yok |
| `/legal/cerez-politikasi` | Çerez Politikası | Onay yönetimi bilgileriyle çerez kullanım politikası | Çerez Tercihlerini Yönet | Ziyaretçi | Public | MVP | Çerez onay modülü |
| `/legal/telif-hakki` | Telif Hakkı ve DMCA | Telif hakkı politikası ve DMCA kaldırma talebi süreci | Talep Gönder | Ziyaretçi | Public | MVP | Telif hakkı talep formu |
| `/legal/yaratici-sozlesmesi` | Yaratıcı Sözleşmesi | Creatorların platform üzerinde çalışmadan önce kabul etmesi gereken tam hukuki sözleşme | — (oku) | Ziyaretçi / Creator | Public | MVP | Yok |
| `/legal/guven-ve-guvenlik` | Güven ve Güvenlik | Platform güven ve güvenlik politikası: yasaklananlar, raporlama mekanizması, yaptırım yaklaşımı | İhlal Bildir | Ziyaretçi | Public | MVP | Raporlama modülü |

---

## Section 11 — MVP Launch Day Checklist

### Zorunlu Engelleyiciler — Bunlar olmadan platform açılamaz

**Auth ve Kayıt**
- `/auth/giris`
- `/auth/kayit/fan`
- `/auth/kayit/yaratici`
- `/auth/sifre-sifirla` ve `/auth/sifre-sifirla/[token]`
- `/auth/e-posta-dogrula` ve `/auth/e-posta-dogrula/[token]`

**Creator Onboarding (tam akış)**
- `/onboarding/profil`
- `/onboarding/kategori`
- `/onboarding/uyelik-planlari`
- `/onboarding/odeme`
- `/onboarding/sozlesme`
- `/onboarding/inceleme`

**Public Creator Profili**
- `/@[username]`
- `/@[username]/gonderi` ve `/@[username]/gonderi/[post-id]`
- `/@[username]/uyelik`
- `/@[username]/magaza` ve `/@[username]/magaza/[product-id]`
- `/@[username]/koleksiyonlar` ve `/@[username]/koleksiyonlar/[collection-id]`

**Ödeme ve İşlemler**
- `/checkout/uyelik/[creator-username]/[tier-id]`
- `/checkout/urun/[product-id]`
- `/checkout/koleksiyon/[collection-id]`
- `/checkout/onay/[order-id]`
- `/checkout/hata/[order-id]`

**Fan Hesabı (çekirdek)**
- `/account/kutuphane`
- `/account/satin-almalar`
- `/account/uyeliklerim` ve `/account/uyeliklerim/[membership-id]`
- `/account/mesajlar` ve `/account/mesajlar/[creator-username]`
- `/account/fatura`
- `/account/ayarlar`

**Üyelik Yönetimi**
- `/uyelik/[membership-id]/iptal`
- `/uyelik/[membership-id]/yuksel`
- `/uyelik/[membership-id]/dusur`

**Creator Dashboard (çekirdek)**
- `/dashboard`
- `/dashboard/gonderiler` + `/yeni` + `/[id]/duzenle`
- `/dashboard/uyelik-planlari` + `/yeni` + `/[id]/duzenle`
- `/dashboard/magaza` + `/yeni` + `/[id]/duzenle`
- `/dashboard/koleksiyonlar` + `/yeni` + `/[id]/duzenle`
- `/dashboard/kitle` + `/[fan-id]`
- `/dashboard/mesajlar` + `/[fan-id]`
- `/dashboard/analitik` + `/gelir`
- `/dashboard/odeme`
- `/dashboard/ayarlar/profil` + `/hesap` + `/bildirimler`

**Admin (minimum uygulanabilir)**
- `/admin`
- `/admin/yaraticilar` + `/inceleme` + `/[creator-id]`
- `/admin/moderasyon` + `/raporlar` + `/raporlar/[report-id]` + `/icerik`
- `/admin/fatura`
- `/admin/denetim-gunlugu`

**Pazarlama (minimum)**
- `/` (Ana Sayfa)
- `/kesfet`
- `/baslangic`
- `/iletisim`

**Hukuki (tümü zorunlu — bunlar olmadan açılış yapılamaz)**
- `/legal/kullanim-kosullari`
- `/legal/gizlilik-politikasi`
- `/legal/cerez-politikasi`
- `/legal/telif-hakki`
- `/legal/yaratici-sozlesmesi`
- `/legal/guven-ve-guvenlik`

---

### Faz 1 — Açılıştan kısa süre sonra yayınlanabilir

- `/ozellikler`, `/fiyatlar`, `/yaraticilar`, `/hakkimizda`
- `/kaynaklar` ve `/kaynaklar/[slug]`
- `/guncellemeler`
- `/account/bildirimler`
- `/account/grup-sohbet` ve `/account/grup-sohbet/[room-id]`
- `/account/fatura/gecmis`
- `/account/ayarlar/bildirimler` ve `/account/ayarlar/gizlilik`
- `/uyelik/[membership-id]/yenile` ve `/uyelik/[membership-id]/odeme-guncelle`
- `/dashboard/grup-sohbet` + `/yeni` + `/[room-id]`
- `/dashboard/analitik/uyeler` ve `/dashboard/analitik/icerik`
- `/dashboard/ayarlar/sayfa` ve `/dashboard/ayarlar/uyumluluk`
- `/admin/kullanicilar` ve `/admin/kullanicilar/[user-id]`
- `/admin/telif-hakki` ve `/admin/telif-hakki/[claim-id]`
- `/admin/fatura/anlasmmazliklar` ve `/admin/fatura/odemeler`
- `/admin/icerik-yonetimi` ve alt sayfalar

---

## Section 12 — Route Count Summary

| Bölüm | Route Sayısı |
|---|---|
| Public marketing | 11 |
| Auth flows | 8 |
| Creator onboarding | 7 |
| Public creator profile | 8 |
| Fan / member account | 15 |
| Checkout / transactions | 5 |
| Membership management | 5 |
| Creator dashboard | 30 |
| Admin / operations | 19 |
| Legal / trust | 6 |
| **Toplam** | **114** |

---

*Bu belge lalabits.art ürün belgelerinin bir parçasıdır. Kök proje bağlamı
[CLAUDE.md](../../CLAUDE.md) dosyasındadır. Modül spesifikasyonları `docs/product/` içindeki
kardeş belgelerde yer alır.*
