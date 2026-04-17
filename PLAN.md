# PLAN.md — lalabits.art Uygulama Anayasası
# Claude Code için tek referans belge. Dalga (wave) sırasını takip et.
# Her dalga öncesi bu dosyayı oku. Dışına çıkma.

---

## 0. Mevcut Durum
- Canlı: https://lalabits.vercel.app
- Stack: Next.js (App Router), Vercel deploy
- Mevcut sayfalar: sadece / (ana sayfa iskeleti), /kreatorler
- Mevcut tasarım: YOK — sıfırdan inşa ediyoruz

## 0.1 Dil Kuralı — KESİN

### İçerik üreticisi terminolojisi (3 kural, asla karıştırma)
| Bağlam | Kullanım | Neden |
|---|---|---|
| H1/H2 başlık, SEO metni | **İçerik Üreticisi / İçerik Üreticileri** | Türkçede yerleşmiş, arama hacmi yüksek |
| Nav, buton, kart, etiket (kısa) | **Üretici / Üreticiler** | UI'da yer tasarrufu, okunabilir |
| Ücretli abone | **Destekçi** | Aktif destek anlamı taşır |
| Ücretsiz takip eden | **Takipçi** | Pasif ilgi anlamı taşır |

### Yasak kelimeler
- "Kreatör" / "Kreatorler" → YASAK (yabancı, çirkin)
- "Yaratıcı" / "Yaratıcılar" → YASAK (dini çağrışım riski, Türkiye geneli)
- "Patron" → YASAK (Patreon algısı)
- "Creator" → YASAK (İngilizce UI'da kullanılamaz)

### Genel kural
- Tüm UI metni Türkçe
- İngilizce yalnızca: kod isimleri, route adları, bileşen dosya adları

## 0.2 Terminoloji Sözlüğü
| Eski (yanlış) | UI kısa form | Büyük başlık / SEO |
|---|---|---|
| Kreatör / Creator | Üretici | İçerik Üreticisi |
| Kreatorler | Üreticiler | İçerik Üreticileri |
| Patron / Fan (ücretli) | Destekçi | Destekçi |
| Patron / Fan (ücretsiz) | Takipçi | Takipçi |
| Membership | Üyelik | Üyelik |
| Tier | Kademe | Kademe |
| Feed | Akış | Akış |
| Post | Yazı / Gönderi | Yazı / Gönderi |
| Collection | Koleksiyon | Koleksiyon |
| Shop | Mağaza | Mağaza |
| Dashboard | Panel | Kontrol Paneli |
| Onboarding | Başlangıç Kurulumu | Başlangıç Kurulumu |
| Settings | Ayarlar | Ayarlar |
| Notifications | Bildirimler | Bildirimler |
| Support | Destek | Destek Merkezi |
| Community | Topluluk | Topluluk |
| Analytics | İstatistikler | Analitik |
| Payout | Kazanç Çekme | Kazanç Çekme |

---

## 1. Tasarım Sistemi — Değişmez Kurallar

### 1.1 Renk Paleti
```
--teal:        #008080   /* birincil, sistem rengi */
--teal-light:  #e0f2f1   /* arka plan vurgusu */
--teal-dark:   #005f5f   /* hover durumu */
--orange:      #FF5722   /* aksan, CTA, para/monetizasyon */
--orange-light: #fbe9e7  /* açık aksan arka planı */
--orange-dark:  #e64a19  /* hover CTA */
--bg:          #F8F9FA   /* sayfa arka planı */
--surface:     #FFFFFF   /* kart yüzeyi */
--border:      #E8E8E8   /* kenarlık */
--text-primary: #212121  /* ana metin */
--text-secondary: #616161 /* ikincil metin */
--text-muted:  #9E9E9E   /* ipucu, placeholder */
```

### 1.2 Tipografi
```
Font: Inter (Google Fonts) — tüm ağırlıklar
H1: 56px / 700 / line-height: 1.1 / letter-spacing: -0.02em
H2: 40px / 700 / line-height: 1.2
H3: 28px / 600 / line-height: 1.3
H4: 20px / 600
Body-lg: 18px / 400 / line-height: 1.7
Body: 16px / 400 / line-height: 1.6
Small: 14px / 400
XSmall: 12px / 500

Mobil H1: 36px
Mobil H2: 28px
```

### 1.3 Spacing Scale
```
4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px · 96px · 128px
Section padding: py-24 (96px) desktop / py-16 (64px) mobil
Container: max-w-7xl (1280px) + px-6
```

### 1.4 Border Radius
```
sm: 6px   (badge, tag, input)
md: 12px  (kart, buton)
lg: 20px  (büyük kart, modal)
xl: 32px  (hero element)
full: 9999px (avatar, pill)
```

### 1.5 Gölge (Shadow)
```
card:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
hover:   0 4px 12px rgba(0,0,0,0.12)
focus:   0 0 0 3px rgba(0,128,128,0.25)
```

### 1.6 Animasyon
```
transition-base: 150ms ease
transition-slow: 300ms ease
hover-scale: transform scale(1.02)
```

---

## 2. Bileşen Kütüphanesi — components/ui/

### Button
```
Variants: primary | secondary | ghost | danger
Sizes: sm | md | lg
Primary: bg-orange text-white hover:bg-orange-dark
Secondary: border-teal text-teal hover:bg-teal-light
Ghost: text-secondary hover:text-primary hover:bg-gray-50
Radius: md (12px)
Padding: sm(8px 16px) / md(12px 24px) / lg(16px 32px)
```

### Badge
```
Variants: teal | orange | gray | success | warning
Size: küçük pill — 6px 12px padding / font-size 12px
```

### Card
```
bg-white border border-border radius-lg shadow-card
hover → shadow-hover transform scale(1.01) transition-slow
padding: 24px
```

### Avatar
```
Boyutlar: sm(32px) md(48px) lg(80px) xl(120px)
Fallback: isim baş harfi, teal arka plan
```

---

## 3. Header — components/Header.tsx

### Yapı
```
Sticky top-0 z-50
bg-white/95 backdrop-blur-sm border-b border-border
height: 64px

Sol: Logo (lalabits.art wordmark SVG)
Orta: Nav linkleri
Sağ: Giriş yap (ghost) + Başla (primary orange)
```

### Logo Wordmark SVG Kuralı
```
"lala" → font-weight:400 fill:#212121
"bits" → font-weight:700 fill:#FF5722
".art" → font-weight:400 fill:#212121
font-size: 20px
```

### Nav Linkleri (sırayla)
```
Üreticilere    → /ureticilere
Özellikler     → /ozellikler
Fiyatlar       → /fiyatlar
Kaynaklar      → /kaynaklar (dropdown: Blog, Rehberler, Başarı Hikayeleri)
Şirket         → /hakkimizda (dropdown: Hakkımızda, Basın, Kariyer, İletişim)
```

### Nav Link Stili
```
font-size: 15px / color: text-secondary
hover → color: text-primary
aktif sayfa → color: teal + border-bottom 2px teal
```

### CTA Butonları (sağ)
```
"Giriş yap" → ghost button → /giris
"Başla"     → primary orange button → /kayit/yaratici
```

### Mobil (<768px)
```
Logo sol + hamburger ikon sağ
Açılır tam ekran menü: tüm linkler dikey + her iki CTA
```

---

## 4. Footer — components/Footer.tsx

### Yapı
```
bg: #1a1a1a (koyu, premium his)
text: white/70 ve white
padding: py-16 (desktop) py-12 (mobil)
Border-top: 1px solid rgba(255,255,255,0.08)
```

### 6 Sütun Grid
```
Sütun 1 — Marka
  - Logo wordmark (beyaz versiyon)
  - Kısa slogan (1 cümle)
  - Sosyal medya ikonları (Twitter/X, Instagram, LinkedIn)
  - "Türkiye'nin içerik platformu" badge

Sütun 2 — Üreticiler
  Nasıl çalışır?
  Üyelik sistemi
  Dijital ürünler
  Üretici hikayeleri
  Başlamak için rehber

Sütun 3 — Özellikler
  Akış ve yazılar
  Koleksiyonlar
  Mağaza
  Topluluk sohbeti
  Bildirimler

Sütun 4 — Fiyatlar
  Plan karşılaştırma
  Komisyon oranları
  Ödeme yöntemleri
  Kazanç hesaplama

Sütun 5 — Kaynaklar
  Blog
  Başlangıç rehberi
  Üretici akademi
  TR üretici raporu
  Destek merkezi

Sütun 6 — Şirket
  Hakkımızda
  Misyon
  Basın kiti
  Kariyer
  İletişim
```

### Alt Bar
```
Flex: sol (© 2025 lalabits.art) + sağ (yasal linkler)
Yasal linkler: Kullanım Şartları · Gizlilik · KVKK · Çerez
Dil/para: "Türkçe · ₺ TRY" badge
Ayraç: border-top rgba(255,255,255,0.08)
```

### Mobil Footer
```
Akordeon: her sütun başlığına tıklayınca açılır
Logo + sosyal medya her zaman görünür
```

---

## 5. Ana Sayfa — Wave 2 Detayı
### Dosya: app/page.tsx
### Bileşenler: app/_sections/

---

### Section 1: Hero
**Amaç:** İlk 3 saniyede kullanıcıyı büyüle.

**Yapı:**
```
min-height: 100vh
bg: #F8F9FA + animasyonlu mozaik SVG pattern (sağ/arka)
Layout: flex items-center justify-between gap-16

SOL (metin):
  - Küçük badge: "🇹🇷 Türkiye'nin İçerik Platformu"
  - H1: "İçerik Üreticisi Olarak\nGelire Dönüştür"
    → "Gelire Dönüştür" kısmı: gradient text (teal → orange)
  - Subheadline (18px): "Üyelik, dijital ürün ve içerik ile
    Türk destekçilerinden doğrudan kazanmaya başla."
  - CTA çifti (gap-4):
    - "Üretici olarak başla" → büyük orange primary
    - "Nasıl çalışır?" → ghost teal + ok ikonu
  - Sosyal kanıt (12px muted):
    "2.400+ üretici · ₺18.5M+ kazanıldı · Türkiye'de #1"

SAĞ (görsel):
  - Animasyonlu üretici kart mockup
  - Arka plan: mozaik SVG pattern (teal/orange, opacity 0.06)
  - CSS animasyon: subtle float (yukarı-aşağı 6px, 4s infinite)
```

**Mozaik SVG Pattern:**
```
<svg> repeating hexagonal/square tile pattern
fill: #008080 opacity 0.04
Ekranda büyük, sağ yarıda konumlandırılmış
CSS animation: subtle parallax on scroll
```

**Hero Üretici Kart Mockup:**
```
Kart (beyaz, shadow-hover):
  - Cover image placeholder (teal gradient)
  - Avatar + isim + kategori badge
  - "248 destekçi" + "₺ 4.200 / ay" istatistikleri
  - 3 kademe: Temel (₺49) / Standart (₺129) / Premium (₺299)
  - "Destekle" turuncu buton
Kartın üzerinde yüzen küçük bildirim kartı:
  "🎉 Yeni destekçi: @kullanici_ · az önce"
```

---

### Section 2: Nasıl Çalışır
**Amaç:** Platform mantığını 3 adımda anlat.

```
Başlık: "3 Adımda Başla"
Alt başlık: "Dakikalar içinde kurulum, ömür boyu kazanç"

3 Kart (grid 3 sütun, gap-8):
  1. [Simge: düzenle ikonu]
     "Sayfanı Oluştur"
     "Profilini oluştur, kademe ve fiyatlarını belirle.
      Türkçe arayüz, 5 dakikada hazır."

  2. [Simge: paylaş ikonu]
     "İçeriğini Paylaş"
     "Yazı, ses, video, dosya — her formatta
      üyelere özel içerik yayınla."

  3. [Simge: lira ikonu]
     "Türkiye'den Kazan"
     "IBAN, Papara, Türk kartı ile doğrudan
      tahsilat. Döviz kaybı yok."

Adım bağlantıları: ok veya çizgi + sayı (1 → 2 → 3)
Arkaplan: hafif teal-light (#e0f2f1)
```

---

### Section 3: Öne Çıkan Üreticiler
**Amaç:** Sosyal kanıt + platform doluluk hissi.

```
Başlık (H2): "Türkiye'nin İçerik Üreticileri"
Filtreleme: Tümü | Yazar | Çizer | Podcaster | Müzisyen | Tasarımcı | Eğitimci

Kart Grid: 3 sütun × 2 satır (6 kart)

Üretici Kart Yapısı:
  - Cover photo (200px yükseklik, object-cover)
  - Avatar (60px, -mt-8, border-4 beyaz)
  - İsim + kategori badge (teal)
  - Kısa biyografi (2 satır max, text-muted)
  - İstatistikler: "X destekçi · ₺Y/ay başlayan"
  - Hover: kart yükselir (shadow artışı) + "Keşfet" butonu belirir

Alt: "Tüm üreticileri keşfet →" link → /ureticilere
```

---

### Section 4: Özellik Özeti
**Amaç:** Platform kapasitesini hızlı göster.

```
Başlık: "Her Şey Bir Yerde"

Büyük özellik grid (2×2 veya özel layout):

Özellik 1 — Üyelik Sistemi (büyük kart, solda)
  İkon: [yıldız] Teal arka plan
  Başlık: "Kademeli Üyelik"
  Metin: "Ücretsizden Premium'a birden fazla kademe.
  Her kademede farklı içerik, farklı avantaj."
  Görsel: Mini kademe kartları (3 adet yığın efekti)

Özellik 2 — Dijital Ürünler (sağ üst)
  İkon: [paket] Orange arka plan
  Başlık: "Dijital Mağaza"
  Metin: "PDF, ses dosyası, video, şablon —
  tek seferlik satış veya üyelik dahil."

Özellik 3 — Topluluk Sohbeti (sağ alt)
  İkon: [mesaj] Purple/mor arka plan
  Başlık: "Topluluk Sohbeti"
  Metin: "Destekçilerinle sohbet et.
  Kademe bazlı özel sohbet kanalları."

Özellik 4 — Analitik (küçük, sol alt)
  İkon: [grafik]
  Başlık: "Gerçek Zamanlı Analitik"
  Metin: "Kazanç, abone, içerik performansı."
```

---

### Section 5: Rakamlar (Sosyal Kanıt)
**Amaç:** Sayılarla güven inşa et.

```
Arkaplan: koyu (#1a1a1a veya teal dark)
Text: beyaz

4 büyük sayaç (animasyonlu — Intersection Observer):
  2.400+     → "Aktif Üretici"
  ₺18.5M+   → "Toplam Kazanılan"
  47.000+    → "Destekçi"
  4.8 / 5    → "Ortalama Memnuniyet"

Her sayı: font-size 56px / font-weight 800 / color orange
Etiket: font-size 14px / color white/60
Animasyon: count up effect (0'dan hedefe 2sn içinde)
```

---

### Section 6: Kategoriler
**Amaç:** Platform çeşitliliğini göster, ilgiye göre yönlendir.

```
Başlık (H2): "Her İçerik Üreticisine Yer Var"

Grid (4×2, gap-4):
  Yazar       [kalem ikonu]   → /ureticilere?kategori=yazar
  Çizer       [fırça ikonu]   → /ureticilere?kategori=cizer
  Podcaster   [mikrofon]      → /ureticilere?kategori=podcast
  Müzisyen    [nota ikonu]    → /ureticilere?kategori=muzisyen
  Tasarımcı   [kutucuk]       → /ureticilere?kategori=tasarimci
  Eğitimci    [kitap]         → /ureticilere?kategori=egitimci
  Geliştirici [kod]           → /ureticilere?kategori=gelistirici
  Diğer       [artı]          → /ureticilere

Kategori Kart Stili:
  Border 0.5px solid border
  Hover: teal arka plan, beyaz ikon ve metin
  Boyut: eşit, padding 24px, radius-lg
  İkon: SVG Heroicon, 28px
  Etiket: 15px font-weight 500
```

---

### Section 7: Final CTA
**Amaç:** Son dönüşüm fırsatı — iki yol ayrı ayrı göster.

```
Arkaplan: subtle teal gradient (#e0f2f1 → beyaz)

Başlık: "Hangi Yoldasın?"

2 CTA Kartı (yan yana):

Kart A — Üretici
  Başlık (H3): "İçerik Üreticisi Olarak Başla"
  İçerik: "Sayfanı oluştur, kademelerini belirle,
  Türk destekçilerinden kazanmaya başla."
  Özellik listesi (3 madde, check işareti):
    ✓ Ücretsiz kurulum
    ✓ Türk ödeme yöntemleri
    ✓ Türkçe destek
  CTA: "Üretici hesabı aç" → /kayit/uretici [orange]
  Arkaplan: beyaz, border teal

Kart B — Destekçi / Takipçi
  Başlık (H3): "Favori Üreticini Destekle"
  İçerik: "Türkiye'nin en iyi içerik üreticilerini
  keşfet ve doğrudan destek ver."
  Özellik listesi:
    ✓ Özel içeriklere eriş
    ✓ Topluluğun parçası ol
    ✓ Türk lirası ile öde
  CTA: "Üreticileri keşfet" → /ureticilere [ghost teal]
  Arkaplan: teal-light
```

---

## 6. Kelime Yasaları — KESİN LISTE

### Üretici / Takipçi tarafı
```
YASAK                    UI KISA          BÜYÜK BAŞLIK / SEO
Kreatör                → Üretici        → İçerik Üreticisi
Kreatorler             → Üreticiler     → İçerik Üreticileri
Creator / Creators     → Üretici(ler)   → İçerik Üreticisi(leri)
Yaratıcı / Yaratıcılar → Üretici(ler)   → İçerik Üreticisi(leri)
Patron (ücretli)       → Destekçi       → Destekçi
Fan / Follower (ücretsiz) → Takipçi     → Takipçi
```

### Platform kavramları
```
YASAK          → DOĞRU
Membership     → Üyelik
Tier           → Kademe
Post           → Yazı / Gönderi
Feed           → Akış
Collection     → Koleksiyon
Shop           → Mağaza
Dashboard      → Panel
Settings       → Ayarlar
Notifications  → Bildirimler
Support        → Destek
Community      → Topluluk
Analytics      → İstatistikler
Payout         → Kazanç Çekme
Onboarding     → Başlangıç Kurulumu
```

### Route adları (URL)
```
/creators      → /ureticilere
/kreatorler    → /ureticilere
/yaraticilara  → /ureticilere
/kayit/yaratici → /kayit/uretici
```

---

## 7. Wave Sırası ve Dosya Listesi

### WAVE 1 — Temel (ÖNCELİKLİ)
```
tailwind.config.ts      → renk, font, spacing token'ları
app/globals.css         → CSS değişkenleri, temel stiller
app/layout.tsx          → root layout, font import, metadata
components/Header.tsx   → sticky nav, logo, linkler, CTA
components/Footer.tsx   → 6 sütun, koyu arkaplan, alt bar
components/ui/Button.tsx
components/ui/Badge.tsx
components/ui/Card.tsx
components/ui/Avatar.tsx
```

### WAVE 2 — Ana Sayfa
```
app/page.tsx
app/_sections/Hero.tsx
app/_sections/NasilCalisir.tsx
app/_sections/OncuUreticiler.tsx
app/_sections/OzellikOzeti.tsx
app/_sections/Rakamlar.tsx
app/_sections/Kategoriler.tsx
app/_sections/FinalCTA.tsx
```

### WAVE 3 — Üreticilere + Özellikler
```
app/ureticilere/page.tsx
app/ozellikler/page.tsx
components/KomisyonHesaplaci.tsx
```

### WAVE 4 — Fiyatlar + Tanıtım
```
app/fiyatlar/page.tsx
app/lalabits-nedir/page.tsx
app/turkiye-odemeleri/page.tsx
```

### WAVE 5 — Auth
```
app/giris/page.tsx
app/kayit/takipci/page.tsx
app/kayit/uretici/page.tsx
```

### WAVE 6 — Blog + Kaynaklar
```
app/blog/page.tsx
app/blog/[slug]/page.tsx
app/kaynaklar/rehberler/page.tsx
app/kaynaklar/basari-hikayeleri/page.tsx
app/destek/page.tsx
```

### WAVE 7 — Şirket + Yasal
```
app/hakkimizda/page.tsx
app/kvkk/page.tsx
app/gizlilik/page.tsx
app/kullanim-sartlari/page.tsx
app/cerez-politikasi/page.tsx
app/basin/page.tsx
```

---

## 8. Genel Teknik Kurallar

### Next.js App Router
```
Server Components varsayılan — gerektiğinde 'use client'
Metadata API: her sayfada generateMetadata()
Image: next/image, tüm görseller optimize
Link: next/link, tüm iç bağlantılar
Font: Inter, next/font/google
```

### Tailwind Kural
```
Custom renkler: tailwind.config'de tanımlanmış
  teal: '#008080', orange: '#FF5722', bg: '#F8F9FA' vb.
Kısaltma yerine semantik class kullan
```

### Responsive Kuralı
```
Mobile-first: sm → md → lg → xl
Tüm sayfalar 320px'te çalışmalı
Grid: 1 sütun (mobil) → 2 (tablet) → 3/4 (desktop)
Touch target: min 44×44px
```

### SEO Kuralı
```
Her sayfada: title, description, og:image
Türkçe URL: /yaraticilara (not /creators)
Canonical tag zorunlu
H1: her sayfada 1 tane
```

### Renk Erişilebilirlik
```
Teal (#008080) üzerine beyaz metin: WCAG AA geçer
Orange (#FF5722) üzerine beyaz metin: büyük metin için geçer
Koyu arka plan üzerine beyaz: her zaman kullan
```

---

## 9. PLAN.md Kullanım Talimatı

**Claude Code'a her wave başında söyle:**
```
PLAN.md'yi oku. [Wave N]'i implement et.
Dil kuralı: bölüm 0.1 ve 6'ya uy.
Tasarım: bölüm 1'e uy.
Önce [dosya listesi]'ni oluştur.
```

**Her bileşen için kontrol listesi:**
- [ ] Türkçe metin kullanıldı mı?
- [ ] "Kreatör" / "Yaratıcı" / "Creator" UI'da var mı? (OLMAMALI)
- [ ] Kısa metin: "Üretici/Üreticiler" mi?
- [ ] H1/H2/SEO: "İçerik Üreticisi/İçerik Üreticileri" mi?
- [ ] Ücretli abone: "Destekçi" mi?
- [ ] Ücretsiz takip: "Takipçi" mi?
- [ ] Renk tokenları kullanıldı mı?
- [ ] Responsive mi?
- [ ] Dark mode değil — light mode (bg: #F8F9FA)
- [ ] next/image, next/link kullanıldı mı?
- [ ] Hover/focus/active durumları var mı?

---
*Son güncelleme: 2025 · lalabits.art · Claude Code anayasası*
