# lalabits.art — Commerce Clarity, Support Architecture & Missing Pages Plan

> Durum: Planlama belgesi — uygulama kodu içermez  
> Tarih: 2026-04-18  
> Hazırlayan: Ürün + Claude Code ortak denetim

---

## 1. Executive Summary

### lalabits.art nedir?

lalabits.art, Türkiye'ye özgü bir **dijital içerik üreticisi pazaryeri ve üyelik platformudur.**

İçerik üreticileri (yazarlar, eğitimciler, illüstratörler, müzisyenler, podcast yapımcıları, tasarımcılar, geliştiriciler, video ve AI üreticileri) platforma başvurur; onaylandıktan sonra Türk lirası üzerinden:

- **Üyelik planları** açar (aylık / yıllık abonelik)
- **Dijital ürünler ve dosyalar** satar (PDF, ZIP, ses, video, tasarım dosyaları)
- **Premium içerik ve gönderiler** yayınlar (herkese açık, üyeye açık, kademeye göre kilitli)
- **Koleksiyonlar** oluşturur (içerik ve ürün paketleri)

Fanlar (destekçiler ve takipçiler):

- İçerik üreticisine **üye olur** → tekrarlı gelir + içerik / dosya erişimi
- **Mağazadan tekil ürün satın alır** → tek seferlik ödeme + kalıcı dosya erişimi
- **Premium tekil içerik satın alır** → içeriğe ömür boyu erişim
- Satın alınanlar **kütüphanede (/kutuphane)** toplanır, dosyalar indirilebilir

### Üç ticari katman

| Katman | Mekanizma | Erişim |
|---|---|---|
| **Üyelik** | Aylık / yıllık abonelik | Üyelik planına göre kilitli içerik, dosya, topluluk |
| **Tekil satın alma** | Tek seferlik ödeme | Ürün / koleksiyon / premium gönderi — kalıcı kütüphane erişimi |
| **Ücretsiz takip** | Kayıt, ödeme yok | Yalnızca üreticinin herkese açık içerikleri |

Platform **%8 komisyon** alır (onaylı üreticiler için sabit oran). Üreticinin başka aylık ücreti yoktur.

---

## 2. Mevcut Kamu Sitesinin Belirsizlik Denetimi

### 2.1 Ana Sayfa (/)

**Mevcut:** Hero başlık güçlü ("Üretenin Kazandığı, Destekleyenin Yakınlaştığı Yer"). Üyelik + dijital ürün + topluluk kelimelerinden söz ediliyor. İki taraflı CTA mevcut.

**Sorunlar:**

| Sayfa | Mevcut Sorun | Neden Karışıklık Yaratır | Ne Netleştirilmeli |
|---|---|---|---|
| `/` hero | "Dijital ürün" ve "üyelik" birlikte anılıyor ama fark anlatılmıyor | Bir fan hangisini alması gerektiğini bilmiyor | "Üye olarak sürekli erişim / tek ürün alarak kalıcı dosya" ayrımı |
| `/` | Dosya indirme / kütüphane hiç geçmiyor | Fan satın aldıktan sonra ne olacağını bilmiyor | "/kutuphane" kavramı ve "satın alınan dosyalara nereden ulaşırım" sorusu |
| `/` | Ücretsiz takip seçeneği belirsiz | Ücretsiz kayıt olsam ne görürüm? | "Ücretsiz takipçi vs ücretli destekçi" farkı net gösterilmeli |
| `/` | Platform komisyonu sadece /fiyatlar'da | Üretici dönüşüm hunisinde güven sorusu | Hero altında küçük bir "Yalnızca %8 komisyon" satırı |

### 2.2 Özellikler Sayfası (/ozellikler)

**Mevcut:** Kademeli üyelik, dijital mağaza, gönderi akışı, topluluk sohbeti, koleksiyonlar, bildirimler listelenmiş.

**Sorunlar:**

| Sorun | Kafa Karışıklığı | Netleştirme |
|---|---|---|
| "Güvenli dosya teslimi" yazıyor ama teslim mekanizması açıklanmıyor | Fan dosyayı nasıl alıyor? E-postayla mı? Platformda mı? | "Satın aldıktan sonra dosyalar kütüphanenizde görünür ve indirilebilir" |
| Desteklenen dosya türleri sayılmıyor | Üretici hangi formatları yükleyebilir? | Desteklenen format ve boyut limitleri |
| "Topluluk sohbeti" kademeler arasındaki ayrım yok | Hangi kademe hangi kanala erişebilir? | "Temel üyeler genel kanala, üst kademe üyeler özel kanallara" |
| Ücretsiz kademe seçeneği gömülü, öne çıkarılmıyor | Ücretsiz takip nerede? | "Ücretsiz takipçi" katmanı açıkça gösterilmeli |

### 2.3 Fiyatlar Sayfası (/fiyatlar)

**Mevcut:** %8 komisyon açıkça yazıyor. Hesaplayıcı mevcut. SSS var.

**Sorunlar:**

| Sorun | Kafa Karışıklığı | Netleştirme |
|---|---|---|
| Kullanım Şartları §6'da %8/%6/%4 üç farklı plan var ama /fiyatlar sayfasında sadece %8 gösteriliyor | Üretici gerçek komisyon oranını nereden öğrenir? | Ya fiyatlar sayfası güncellenmeli ya da Şartlar'daki çok katmanlı yapı kaldırılmalı |
| Ödeme işlem ücretleri ("ayrıca uygulanabilir") miktarı belirsiz | Net kazanç hesaplanamıyor | İşlem ücreti tutarı veya aralığı belirtilmeli |
| Fan tarafında ödeme bilgisi yok | Fan ödemeyi nasıl yapıyor, güvenli mi? | /fiyatlar'a fan odaklı kısa bir bölüm eklenebilir ya da /turkiye-odemeleri'ne yönlendirme |
| Vergi rehberi yok | Üretici kazancından vergi kesiyor mu? Beyanname? | "Türkiye'deki vergi yükümlülüklerinizi muhasebeciniziyle görüşün" notu veya rehber |

### 2.4 Keşfet / Üretici Bulucu (/kesfet)

**Mevcut:** Kategori filtresi, üretici kartları.

**Sorunlar:**

| Sorun | Kafa Karışıklığı |
|---|---|
| Üretici kartında üyelik fiyatı veya ne sattığı görünmüyor | Fan neden tıklamalı? Ücretsiz mi ücretli mi? |
| "Destekle" CTA'sı nereye gidecek, ne ödeyecek belirsiz | İlk kez gelen kullanıcı tetiği çekmekten çekiniyor |

### 2.5 Destek Sayfası (/destek)

**Mevcut:** 20 SSS, 6 kategori, e-posta iletişim, mesai saatleri.

**Sorunlar:**

| Sorun | Kafa Karışıklığı |
|---|---|
| Sorular SSS formatında, adım adım rehber yok | "Dosyamı nasıl indiririm?" gibi pratik işlemleri yönlendirmiyor |
| Kütüphane ve dosya erişimi hiç anlatılmıyor | Fan satın aldıktan sonra ne yapacağını bilmiyor |
| Üyelik iptali sonrası erişim belirsiz | "İptal edersem içerikleri kaybeder miyim?" sorusu yanıtsız |
| Creator Agreement içeriği boş stub | Üretici sözleşmeyi okumadan imzalamak zorunda kalıyor |
| İade süreci "e-posta gönder" dışında tanımlanmamış | Fan ne bekleyeceğini bilmiyor |

### 2.6 /basin Sayfası

**Mevcut:** Logo varlıkları, şirket bilgisi, iletişim.

**Sorunlar:**

| Sorun | Kafa Karışıklığı |
|---|---|
| Basın bülteni yok | Platform ciddiye alınıyor mu? |
| Platform'un ticari modelini tek cümleyle tanımlayan "boilerplate" net ama kısa | Gazeteci veya ödeme sağlayıcısı daha fazla bağlam arıyor |

### 2.7 Yasal Sayfalar

**Mevcut:** Kullanım Şartları ✅, Gizlilik ✅, KVKK ✅, Çerez ✅

**Kritik Eksikler:**

| Eksik | Risk |
|---|---|
| Yaratıcı Sözleşmesi `/legal/yaratici-sozlesmesi` — içerik yok (stub) | YÜKSEK — üretici onboarding'de bu belgeyi kabul etmek zorunda, içerik boş |
| Mesafeli Satış Sözleşmesi — sayfa yok | YÜKSEK — Türkiye e-ticaret hukuku (6502 s. Kanun) gerektirir |
| Bağımsız İade Politikası sayfası — yok | ORTA — Şartlar'da kısaca var ama ayrı sayfa yok |
| Abonelik iptal ve yenileme koşulları — sadece Şartlar'da | ORTA — Ödeme sağlayıcısı bu bilgiyi ayrı sayfada ister |
| Dijital ürün teslim ve erişim koşulları — yok | ORTA — Satın alma sonrası erişim garantisi belirsiz |

### 2.8 Üretici Profil Sayfası (/u/[username])

**Mevcut:** Avatar, bio, üyelik planları, gönderiler, ürünler, koleksiyonlar.

**Sorunlar:**

| Sorun | Kafa Karışıklığı |
|---|---|
| Ücretsiz vs ücretli içerik ayrımı görsel olarak yeterince güçlü değil mi? | Fan hangi içeriğe ücretsiz ulaşabileceğini anlayamıyor |
| İptal / iade / erişim hakları üretici sayfasında hiç anlatılmıyor | Fan sözleşme yapmadan önce haklarını bilmiyor |
| Üreticinin kim olduğuna dair ticari/yasal bilgi yok | Ödeme öncesi güven eksikliği |

### 2.9 Kütüphane (/kutuphane)

**Mevcut:** Satın alınan ürünler, koleksiyonlar, üyelikler — sekme bazlı.

**Sorunlar:**

| Sorun | Kafa Karışıklığı |
|---|---|
| Kütüphane yalnızca giriş yapmış kullanıcı görüyor, dışarıdan anlatılmıyor | Fan satın almadan önce kütüphanenin varlığından haberdar değil |
| "Üyeliğim iptal olursa ne görürüm?" durumu kütüphanede belirsiz | İptal sonrası erişim durumu gösterilmiyor |

---

## 3. Eksik Sayfa Envanteri

### A. Ticari Netlik Sayfaları

| Rota | Sayfa Adı | Amaç | Birincil Kullanıcı | Neden Gerekli | Öncelik |
|---|---|---|---|---|---|
| `/lalabits-nedir` | Lalabits Nedir? | Platformu yeni ziyaretçiye 3 dakikada açıkla | Yeni ziyaretçi | "Nasıl çalışır" sorusunu yanıtlıyor | **Kritik** (sayfa var, içerik güçlendirilmeli) |
| `/nasil-calisir` | Nasıl Çalışır? | Üyelik + tekil satın alma + dosya erişim akışını görsel olarak anlat | Fan, üretici, gazeteci | Ticari modelin tek güvenilir açıklama sayfası | **Kritik** |
| `/uretici-ol` | Üretici Ol | Onboarding öncesi üretici yolculuğu: başlangıç, onay süreci, ilk kazanç | Potansiyel üretici | Mevcut /auth/kayit/yaratici öncesi güven kurma | **Kritik** |
| `/turkiye-odemeleri` | Türkiye Ödemeleri | Hangi kartlar, ne zaman ödeme, nasıl çekme | Üretici, fan | Ödeme sağlayıcısı ve Türk kullanıcı güveni | **Kritik** (sayfa var, güçlendirilmeli) |

### B. Destek / Yardım Sayfaları

| Rota | Sayfa Adı | Amaç | Birincil Kullanıcı | Öncelik |
|---|---|---|---|---|
| `/destek/uyelik-nasil-calisir` | Üyelik Nasıl Çalışır? | Adım adım abone olma, erişim, iptal | Fan | **Kritik** |
| `/destek/dosyalarima-nasil-ulasabilirim` | Dosyalarıma Nasıl Ulaşabilirim? | Kütüphane + indirme akışı | Fan | **Kritik** |
| `/destek/iptal-ve-iade` | İptal ve İade | Abonelik iptali adımları, iade başvurusu | Fan | **Kritik** |
| `/destek/uretici-baslangic` | Üretici Olarak Başlangıç | Başvuru → onay → ilk ürün → ilk kazanç | Üretici | **Kritik** |
| `/destek/dijital-urun-yukleme` | Dijital Ürün Yükleme | Ürün oluşturma, dosya yükleme, fiyatlama | Üretici | Yakın vadeli |
| `/destek/gelir-ve-odeme` | Gelir ve Ödeme | Komisyon, çekim, IBAN, zaman çizelgesi | Üretici | Yakın vadeli |
| `/destek/hesap-ve-guvenlik` | Hesap ve Güvenlik | Şifre sıfırlama, e-posta değiştirme, hesap silme | Her ikisi | Yakın vadeli |

### C. Yasal / Güven Sayfaları

| Rota | Sayfa Adı | Amaç | Öncelik | Not |
|---|---|---|---|---|
| `/legal/yaratici-sozlesmesi` | Yaratıcı Sözleşmesi | Üretici hakları, yükümlülükler, platform komisyonu, içerik kuralları | **Kritik** | Sayfa var ama içerik boş stub |
| `/mesafeli-satis-sozlesmesi` | Mesafeli Satış Sözleşmesi | Türk e-ticaret hukuku (6502) gereği mesafeli satış koşulları | **Kritik** | Yasal zorunluluk |
| `/iade-politikasi` | İade ve İptal Politikası | Tekil ürün iadesi, abonelik iptali, erişim hakları | **Kritik** | Şartlar'daki §8 yeterli değil |
| `/legal/platform-rolu` | Platform Rolü Açıklaması | Aracı platform olduğumuzu, üretici-fan ilişkisini, sorumluluklarımızı açıklar | Orta vadeli | Ödeme sağlayıcısı incelemeleri için |
| `/guven-ve-guvenlik` | Güven ve Güvenlik | PCI-DSS, SSL, KVKK, içerik moderasyonu | Orta vadeli | Kullanıcı güveni |

### D. Platform Açıklama Sayfaları

| Rota | Sayfa Adı | Öncelik |
|---|---|---|
| `/nasil-calisir` | Nasıl Çalışır? (tam akış sayfası) | **Kritik** |
| `/uretici-ol` | Üretici Ol (dönüşüm odaklı) | **Kritik** |
| `/kutuphane-nedir` veya destek makalesi | Kütüphane Nedir? | Yakın vadeli |

### E. Ödeme / Fatura Açıklama Sayfaları

| Rota | Sayfa Adı | Öncelik |
|---|---|---|
| `/turkiye-odemeleri` | Türkiye Ödemeleri (genişletilmiş) | **Kritik** (var, güçlendirilmeli) |
| `/fiyatlar` | Fiyatlar (komisyon tutarsızlığı giderilmeli) | **Kritik** |
| `/destek/fatura-ve-faturalandirma` | Fatura ve Faturalandırma | Yakın vadeli |

---

## 4. Zorunlu Destek Merkezi Bilgi Mimarisi

### /destek ana yapısı — önerilen bölümler

```
/destek
├── Fan olarak başlangıç
│   ├── Hesap nasıl açılır?
│   ├── Üreticiye nasıl üye olunur?
│   ├── Mağazadan ürün nasıl satın alınır?
│   └── İlk girişte ne yapmalıyım?
│
├── Üyelik nasıl çalışır
│   ├── Üyelikle nelerin kilidi açılır?
│   ├── Üyelik iptali nasıl yapılır?
│   ├── İptal sonrası erişim ne olur?
│   ├── Abonelik ne zaman yenilenir?
│   └── Üyelik kademe değişikliği
│
├── Mağaza ve tekil satın alma
│   ├── Mağazadan ürün nasıl satın alınır?
│   ├── Koleksiyon satın alma nasıl çalışır?
│   └── Satın alma sonrası erişim ne kadar sürer?
│
├── Dijital dosya erişimi ve indirme
│   ├── Satın aldığım dosyalara nereden ulaşırım?
│   ├── Dosya nasıl indirilir?
│   ├── Kütüphane nedir?
│   └── İndirme limiti var mı?
│
├── Ödeme ve faturalandırma
│   ├── Hangi ödeme yöntemleri kabul edilir?
│   ├── Fatura / makbuz nasıl alınır?
│   ├── Ödeme neden başarısız oldu?
│   └── Kayıtlı kart nasıl değiştirilir?
│
├── İade ve destek talepleri
│   ├── İade talebi nasıl oluşturulur?
│   ├── Hangi durumlarda iade alabilirim?
│   └── Şikayetimi nasıl iletebilirim?
│
├── İçerik üreticisi olarak başlangıç
│   ├── Nasıl başvururum?
│   ├── Onay süreci nasıl işler?
│   ├── Profilimi nasıl oluşturabilirim?
│   └── İlk üyelik planımı nasıl açarım?
│
├── Üretici araçları
│   ├── Dijital ürün nasıl yüklenir?
│   ├── Üyelik planı nasıl oluşturulur?
│   ├── İçerik nasıl kademe kilidi koyulur?
│   ├── Koleksiyon nasıl oluşturulur?
│   └── Dosya teslimi nasıl çalışır?
│
├── Üretici geliri ve ödemeleri
│   ├── Komisyon oranı nedir?
│   ├── IBAN nasıl bağlanır?
│   ├── Ne zaman ödeme alırım?
│   └── Gelir tablomu nasıl görebilirim?
│
└── Hesap, güvenlik ve erişim sorunları
    ├── Şifremi unuttum
    ├── E-postama erişemiyorum
    ├── Hesabımı nasıl silerim?
    └── Hesabım neden askıya alındı?
```

**Uygulama notu:** Mevcut `/destek` sayfası SSS formatında. Bu yapı, SSS'yi alt sayfalara dönüştürür. Başlangıç için `/destek` SSS'si korunabilir, ancak her kategori başlığı altında "Daha fazla bilgi →" ile ilgili makaleye yönlendirme eklenmeli.

---

## 5. Var Olması Gereken Destek Makaleleri

### 5.1 Platform ve Genel Anlayış

**Makale: Lalabits nedir, nasıl çalışır?**
- Hedef: Yeni ziyaretçi (fan veya üretici)
- Amaç: Platform amacını, ticari modeli ve iki taraflı yapıyı anlamak
- Bölümler:
  1. lalabits.art nedir?
  2. İçerik üreticileri ne yapabilir?
  3. Fanlar ne yapabilir?
  4. Üyelik nedir?
  5. Mağaza ve tekil satın alma nedir?
  6. Kütüphane nedir?
  7. Platform ne kadar komisyon alır?
- Kritik uyarılar: Platform aracı konumundadır, içeriklerden üreticiler sorumludur
- İlgili sayfalar: /fiyatlar, /ozellikler, /auth/kayit

---

**Makale: Fan olarak nasıl hesap açılır?**
- Hedef: Yeni fan
- Amaç: Kayıt adımlarını tamamlamak
- Bölümler:
  1. /auth/kayit/fan adresine git
  2. E-posta veya Google ile kayıt ol
  3. E-postanı doğrula
  4. Profil bilgilerini tamamla
  5. Üretici ara veya keşfet
- Kritik uyarılar: E-posta doğrulanmadan ödeme yapılamaz
- İlgili makaleler: Üreticiye nasıl üye olunur, Mağazadan ürün nasıl satın alınır

---

**Makale: İçerik üreticisine nasıl üye olunur?**
- Hedef: Fan
- Amaç: Abonelik akışını tamamlamak
- Bölümler:
  1. Üreticinin profiline git (/u/[username])
  2. Üyelik planlarını karşılaştır
  3. Planı seç ve "Üye Ol"a tıkla
  4. Ödeme bilgilerini gir
  5. Onay sonrası içeriklere erişim başlar
  6. Üyelik kütüphanende görünür
- Kritik uyarılar: Abonelik otomatik yenilenir; iptal için /hesabim/faturalarim
- İlgili makaleler: Üyelikle nelerin kilidi açılır, Abonelik iptali nasıl yapılır

---

**Makale: Üyelik ile nelerin kilidi açılır?**
- Hedef: Fan
- Amaç: Üyelik kapsamını anlamak
- Bölümler:
  1. Seçtiğin plana özel içerikler
  2. Kademe kilidi nedir?
  3. Üst kademe içerikler alt kademe üyeye açılmaz
  4. Üretici açıkça eklemişse: dosyalar, topluluk kanalları
  5. Ücretsiz içerikler üyelik gerektirmez
- Kritik uyarılar: Her üreticinin planı farklıdır; plan detaylarını üretici sayfasında oku
- İlgili makaleler: Dosya indirme, Kütüphane nedir

---

**Makale: Mağazadan ürün nasıl satın alınır?**
- Hedef: Fan
- Amaç: Tekil ürün satın alma akışını tamamlamak
- Bölümler:
  1. Üreticinin mağaza sekmesine git
  2. Ürünü seç
  3. Ödeme yap (tek seferlik)
  4. Ürün kütüphanende görünür
  5. Dosyayı indir
- Kritik uyarılar: Ürün satın alma üyelik vermez; sadece o ürüne erişim
- İlgili makaleler: Satın aldığım dosyalara nereden ulaşırım, İade talebi

---

**Makale: Satın aldığım dosyalara nereden ulaşırım?**
- Hedef: Fan
- Amaç: Kütüphane kullanımını öğrenmek — platforma güven inşa etmenin en kritik noktası
- Bölümler:
  1. Giriş yap
  2. /kutuphane adresine git (veya "Hesabım → Kütüphane")
  3. "Ürünler" sekmesinden satın aldığın dosyaları gör
  4. "İndir" butonuna tıkla
  5. Üyelik ile açılan içerikler "Üyelikler" sekmesinde
- Kritik uyarılar: İndirme internet bağlantısı gerektirir; indirilmiş dosyayı sakla
- İlgili makaleler: Dosya nasıl indirilir, Abonelik iptali sonrası erişim

---

**Makale: Dosya nasıl indirilir?**
- Hedef: Fan
- Amaç: Teknik indirme adımları
- Bölümler:
  1. Kütüphane'de ilgili ürünü bul
  2. "İndir" butonuna tıkla
  3. Dosya tarayıcı indirmelerine düşer
  4. Mobilde PWA / tarayıcı indirme dizini
- Kritik uyarılar: Büyük dosyalar Wi-Fi bağlantısıyla indir; indirme limiti varsa belirt

---

**Makale: Üyeliğimi nasıl iptal ederim?**
- Hedef: Fan
- Amaç: İptal adımlarını ve sonuçlarını anlamak
- Bölümler:
  1. /hesabim/faturalarim adresine git
  2. "Aktif Üyelikler" bölümünde ilgili planı bul
  3. "İptal Et" butonuna tıkla
  4. Onay ekranında iptal et
  5. Mevcut dönem sonuna kadar erişim devam eder
  6. Dönem bittikten sonra kilitli içeriklere erişim kapanır
  7. Satın alınan ürünler etkilenmez (kütüphanede kalır)
- Kritik uyarılar: İptal anında ücret iadesi yapılmaz (dönem sonu erişim devam eder)
- İlgili makaleler: İade talebi, Satın aldığım dosyalara nereden ulaşırım

---

**Makale: Satın alma sonrası erişim ne kadar sürer?**
- Hedef: Fan
- Amaç: Erişim süreleri ve garantilerini öğrenmek
- Bölümler:
  1. Tekil ürün (mağaza): Ömür boyu erişim — üretici içeriği kaldırana kadar
  2. Abonelik: Aktif olduğu sürece
  3. İptal sonrası: Dönem bitimine kadar kilitli içerikler açık
  4. Üretici hesabı kapanırsa: Platform otomatik iade başlatır
- Kritik uyarılar: Platform içerik garantisi veremez — üretici içeriği kaldırabilir

---

**Makale: İade talebi nasıl oluşturulur?**
- Hedef: Fan
- Amaç: İade sürecini başlatmak
- Bölümler:
  1. /hesabim/faturalarim → "Ödeme İtirazları"
  2. Talepte bulun: ürün / tarih / neden
  3. 5 iş günü içinde yanıt
  4. İade onaylanırsa 3-5 iş günü içinde karta yansır
- Kritik uyarılar: Teknik sorun olmadan dijital içerik iadesi yapılamaz; 7 günlük başvuru süresi
- İlgili makaleler: Kullanım Şartları §8

---

### 5.2 Üretici Makaleleri

**Makale: İçerik üreticisi olarak nasıl başvururum?**
- Hedef: Potansiyel üretici
- Amaç: Onboarding sürecini tamamlamak
- Bölümler:
  1. /auth/kayit/yaratici — kayıt ol
  2. /onboarding — 5 adımlı sihirbaz:
     a. Sözleşme onayı
     b. Profil (isim, bio, kategori)
     c. IBAN girişi
     d. En az bir üyelik planı oluştur
     e. Gönder
  3. Onay süreci: 1-3 iş günü
  4. Onay sonrası profil yayınlanır
- Kritik uyarılar: IBAN Türk TR formatında olmalı; onay öncesi içerik yayınlanamaz

---

**Makale: Dijital ürün nasıl yüklenir?**
- Hedef: Onaylı üretici
- Amaç: Mağazaya ürün eklemek
- Bölümler:
  1. /dashboard/magaza → "Yeni Ürün"
  2. Başlık, açıklama, fiyat gir
  3. Dosyayı yükle (desteklenen formatlar: PDF, ZIP, ses, video, tasarım)
  4. Erişim türünü seç: tekil satın alma / üyelik dahil
  5. Yayınla
- Kritik uyarılar: Telif hakkı ihlali içeren dosyalar kaldırılır; boyut limitleri belirtilmeli

---

**Makale: Üyelik planı nasıl oluşturulur?**
- Hedef: Onaylı üretici
- Amaç: İlk üyelik planını oluşturmak
- Bölümler:
  1. /dashboard/uyelik-planlari → "Yeni Plan"
  2. Plan adı, açıklama, aylık fiyat
  3. Avantajlar (perks) listesi ekle
  4. Yayınla
  5. Fanlar artık profilinde plana abone olabilir
- Kritik uyarılar: Aylık fiyat en az 1 ₺; para birimi TL sabit

---

**Makale: Creator gelirleri ve ödemeleri nasıl işler?**
- Hedef: Üretici
- Amaç: Komisyon ve ödeme mantığını anlamak
- Bölümler:
  1. Her işlemden %8 komisyon düşer
  2. Net kazanç /dashboard/istatistikler'de görünür
  3. Ödeme için IBAN bağlı olmalı
  4. Minimum çekim: 100 ₺
  5. Çekim süresi: 3-5 iş günü
- Kritik uyarılar: Vergi beyannamesi üreticinin sorumluluğundadır

---

## 6. Ticari Açıklık Gereksinimleri

Aşağıdaki ayrımlar site genelinde tutarlı biçimde açıklanmalıdır:

### 6.1 Üyelik vs. Tekil Satın Alma Farkı

| Boyut | Üyelik | Tekil Satın Alma |
|---|---|---|
| Ödeme | Aylık / yıllık tekrarlı | Bir kez |
| Erişim | Aktif abonelik süresince | Ömür boyu (üretici kaldırana kadar) |
| İptal sonrası | Dönem biter, içerik kapanır | Değişmez, kütüphanede kalır |
| Ne içerir? | Üreticinin o plana atadığı tüm içerikler | Yalnızca satın alınan ürün |

### 6.2 Dosya Erişimi vs. Topluluk Desteği Farkı

Üyelik iki farklı şeyi birlikte sunabilir:
- **İçerik/dosya erişimi:** Üreticinin yüklediği dosyalar, premium gönderiler
- **Topluluk desteği:** Üreticiye maddi destek olmak, topluluğa katılmak

Platform, bunları ayrı ayrı değil birlikte sunar. Bu ayrım kullanıcıya açıklanmalıdır.

### 6.3 Erişim Ne Zaman Açılır?

- Ödeme onayı anlık → erişim anında açılır
- Ödeme başarısız → erişim açılmaz
- Abonelik yenilemede başarısız → bildirim gönderilir, kısa süre içinde tekrar denenir

### 6.4 Kütüphane Mantığı

- Satın alınan her ürün ve koleksiyon `/kutuphane` sekmesine düşer
- Aktif abonelikle erişilen içerikler de kütüphanede görünür (abonelik aktifken)
- İptal sonrası üyelik içerikleri kütüphaneden kalkar, satın alınan ürünler kalır

### 6.5 İptal Sonrası Erişim

- Dönem sonuna kadar: Tüm üyelik içerikleri açık
- Dönem bittikten sonra: Kilitli içerikler kapanır
- Tekil satın alınanlar: Etkilenmez

### 6.6 Üretici İçerik Kaldırırsa

- Satın alınmış içerikler için platform iade politikasını uygular (Şartlar §8)
- Platform içerik garantisi veremez; üretici sorumludur
- Bu durum Mesafeli Satış Sözleşmesi ve İade Politikasında açıkça belirtilmeli

### 6.7 Premium İçerik vs. Mağaza Ürünü Farkı

| Tür | Nasıl Satın Alınır? | Erişim Nerede? |
|---|---|---|
| Premium gönderi | Tek ödeme veya üyelikle | Üretici sayfasında + kütüphanede |
| Mağaza ürünü | Tek ödeme | Kütüphanede (Ürünler sekmesi) |
| Koleksiyon | Tek ödeme | Kütüphanede (Koleksiyonlar sekmesi) |
| Üyelik içeriği | Aktif abonelikle | Üretici sayfasında (abonelik süresince) |

### 6.8 Platform Komisyon ve Payout Anlatımı

Kamuya açık sayfada şunlar belirtilmeli:
- lalabits.art aracı platform rolü üstlenir
- İçerik üreticisi ile fan arasındaki ödemeyi işler
- Ödemeden %8 komisyon keser (Başlangıç planı)
- Kalanı üreticinin IBAN'ına iletir
- Platform içerik üreticisinin çalışanı veya ortağı değildir

---

## 7. Yasal / Güven / Ödeme İnceleme Açığı

### 7.1 Mevcut Durum

| Belge | Durum | Notlar |
|---|---|---|
| Kullanım Şartları | ✅ Var ve yayında | Kapsamlı, §8 iade maddesi mevcut |
| Gizlilik Politikası | ✅ Var ve yayında | KVKK uyumlu |
| KVKK Aydınlatma | ✅ Var ve yayında | 6698 s. Kanun uyumu |
| Çerez Politikası | ✅ Var ve yayında | |
| **Yaratıcı Sözleşmesi** | ❌ STUB — İÇERİK BOŞ | Onboarding'de imzalatılıyor, içerik yok — YÜKSEK RİSK |
| **Mesafeli Satış Sözleşmesi** | ❌ MEVCUT DEĞİL | 6502 s. Kanun gereği — YÜKSEK RİSK |
| **Bağımsız İade Politikası** | ❌ MEVCUT DEĞİL | §8 yeterli değil — ORTA RİSK |
| Abonelik iptal/yenileme koşulları | ⚠️ Şartlar'da kısaca var | Ayrı, net sayfa yok |
| Dijital ürün teslim koşulları | ❌ MEVCUT DEĞİL | Erişim garantisi belirsiz |
| Platform rolü açıklaması | ⚠️ Şartlar'da var | Ayrı, kolay ulaşılır sayfa yok |
| Kullanıcı ve üretici sözleşme ayrımı | ✅ Şartlar'da var | Netleştirilebilir |
| Destek / iletişim akışı | ⚠️ E-posta odaklı | Sistematik ticket/SLA eksik |
| Ödeme / komisyon / tahsilat | ✅ /fiyatlar ve Şartlar'da var | Tutarsızlık var (§6: %8/%6/%4) |

### 7.2 En Kritik Yasal Açıklar

**1. Yaratıcı Sözleşmesi içeriği boş**
Üreticiler onboarding adımında bu belgeyi onaylamak zorunda. İçeriği bulunmayan bir belgeyi onaylatmak hukuki geçerlilik sorunu yaratır. **Hemen doldurulmalı.**

**2. Mesafeli Satış Sözleşmesi eksik**
Türkiye'de dijital ürün satışı yapan platformlar için 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği gereğidir. Ödeme sağlayıcıları (Stripe, İyzico, vb.) bu belgeyi isteyebilir.

**3. İade politikası ayrı sayfa olmalı**
"7 gün içinde teknik sorun varsa iade" kuralı yeterli ama ayrı, erişilebilir bir sayfada olmalı.

---

## 8. Önerilen Kamu Sitesi Mesajlaşma Güncellemeleri

### 8.1 Ana Sayfa (/)

**Şu anda cevaplamadığı sorular:**
- "Satın aldıktan sonra ne olur?" → kütüphane kavramı hiç yok
- "Ücretsiz takip edebilir miyim?" → seçenek belirsiz

**Eklenmesi gerekenler:**
- Hero altında veya "Nasıl çalışır" bölümünde: Üyelik | Tekil Satın Alma | Kütüphane üçlüsü görsel kart
- CTA'lardan biri: "Satın aldıklarına kütüphanenden ulaş"

**Çözülen kafa karışıklığı:** Fan ödeme yapmadan önce ne aldığını biliyor.

### 8.2 Özellikler Sayfası (/ozellikler)

**Şu anda cevaplamadığı sorular:**
- "Dosyalarım güvende mi?"
- "Hangi format yükleyebilirim?"
- "Fan nasıl indiriyor?"

**Eklenmesi gerekenler:**
- "Dosya Teslimi" özellik bloğu: Format listesi, boyut limiti, kütüphane entegrasyonu
- "Güvenli indirme" trust sinyali

### 8.3 Fiyatlar Sayfası (/fiyatlar)

**Şu anda cevaplamadığı sorular:**
- "%8/%6/%4 üç plan var mı?" (Şartlar'da var, /fiyatlar'da yok — tutarsız)
- Fan tarafı ödeme bilgisi yok

**Eklenmesi gerekenler:**
- Komisyon yapısı netleştirilmeli (ya sayfada göster ya Şartlar'dan kaldır)
- Fan bölümü: Hangi kartlar kabul edilir, güvenlik, /turkiye-odemeleri linki
- "Vergi konusunda muhasebeciniziyle görüşün" notu

### 8.4 /lalabits-nedir (Var, Güçlendirilmeli)

**Şu anda cevaplamadığı sorular:**
- Üyelik ile tekil satın almanın farkı nedir?
- Üretici ile fan arasındaki ilişki nasıl çalışır?

**Eklenmesi gerekenler:**
- "Platform nasıl çalışır?" görsel akış diyagramı (3 adım)
- Üyelik / tekil satın alma / kütüphane ayrımı
- Platform rolü: "lalabits.art aracı platformdur, içerikten üretici sorumludur"

### 8.5 Footer

**Şu anda cevaplamadığı sorular:**
- İade / mesafeli satış linkine nereden ulaşırım?

**Eklenmesi gerekenler:**
- Legal bölümüne: "Mesafeli Satış Sözleşmesi", "İade Politikası" linkleri
- "Nasıl Çalışır?" veya "lalabits Nedir?" linki fan bölümüne

### 8.6 /basin Sayfası

**Şu anda cevaplamadığı sorular:**
- Platform'un ticari modeli nedir (tek satır)?

**Eklenmesi gerekenler:**
- Platform "boilerplate" paragrafı güncellenmeli: üyelik + mağaza + dosya erişimi + komisyon model
- En az 1 basın bülteni (platform tanıtım veya önemli bir gelişme)

### 8.7 Destek Sayfası (/destek)

**Şu anda cevaplamadığı sorular:**
- Dosyama nasıl ulaşırım?
- İptal edersem ne olur?

**Eklenmesi gerekenler:**
- "Kütüphane" ve "Dosya İndirme" SSS maddeleri
- İptal sonrası erişim açıkça yazılmalı
- Her kategori kartına ilgili destek makalesine link

---

## 9. Uygulama Öncelik Sıralaması

### Faz 1 — Kritik (Hemen / Launch Blocker)

| Görev | Tür | Neden Kritik |
|---|---|---|
| `/legal/yaratici-sozlesmesi` içeriği doldur | Yasal | Onboarding bunu imzalatıyor |
| `/mesafeli-satis-sozlesmesi` oluştur | Yasal | Türk e-ticaret hukuku zorunluluğu |
| `/iade-politikasi` ayrı sayfa oluştur | Yasal | Ödeme sağlayıcısı ve kullanıcı güveni |
| `/destek` "dosya indirme / kütüphane" SSS ekle | Destek | En sık sorulan işlevsel soru |
| `/destek` "üyelik iptali sonrası erişim" SSS ekle | Destek | Güven ve iptal oranı azaltma |
| `/fiyatlar` komisyon tutarsızlığını gider | Kamu site | Ödeme sağlayıcısı incelemesi |
| `/lalabits-nedir` üyelik/tekil satın alma/kütüphane ayrımı | Kamu site | Ticari model netliği |

### Faz 2 — Yakın Vadeli (4–6 Hafta)

| Görev | Tür |
|---|---|
| `/nasil-calisir` tam akış sayfası | Kamu site |
| `/destek` adım adım makaleler (dosya indirme, iptal, iade) | Destek |
| `/destek/uretici-baslangic` makalesi | Destek |
| `/legal/platform-rolu` açıklama sayfası | Yasal |
| Footer'a Mesafeli Satış + İade linkleri ekle | Navigasyon |
| Keşfet kartlarına fiyat bilgisi ekle | Kamu site |

### Faz 3 — Orta Vadeli (2–3 Ay)

| Görev | Tür |
|---|---|
| Tam destek merkezi (bölümlü, makale bazlı) | Destek |
| `/guven-ve-guvenlik` sayfası | Güven |
| `/uretici-ol` dönüşüm sayfası | Kamu site |
| Destek ticket/SLA sistemi | Altyapı |
| Basın bülteni yayını | Kurumsal |

---

## 10. Final Karar Özeti

### Tutarlı Kullanılacak Platform Tanım Cümlesi

> "lalabits.art, Türkiye'deki içerik üreticilerinin hayranlarına üyelik, dijital ürün ve premium içerik sunarak Türk lirası ile gelir elde ettiği yerli dijital içerik platformudur."

Bu cümle ana sayfa, hakkımızda, basın kiti ve yasal belgeler dahil tüm kanallarda tutarlı olarak kullanılmalıdır.

### Minimum Eksik Sayfa Seti (Kritik)

1. **Yaratıcı Sözleşmesi içeriği** — `/legal/yaratici-sozlesmesi`
2. **Mesafeli Satış Sözleşmesi** — `/mesafeli-satis-sozlesmesi`
3. **İade Politikası** — `/iade-politikasi`
4. **"Nasıl Çalışır?" sayfası** — `/nasil-calisir`

### Minimum Destek Makalesi Seti (Kritik)

1. Satın aldığım dosyalara nereden ulaşırım?
2. Üyeliğimi nasıl iptal ederim?
3. İptal sonrası erişim ne olur?
4. İade talebi nasıl oluşturulur?
5. İçerik üreticisi olarak nasıl başvururum?

### En Tehlikeli Belirsizlik (Önce Düzeltilmeli)

**Yaratıcı Sözleşmesi boş stub.**
Onboarding'deki her üretici bu belgeyi kabul etmek zorunda. İçeriği olmayan bir belgeyi imzalatmak hem hukuki geçerlilik riski taşır hem de ödeme sağlayıcısı incelemesinde ciddi sorun yaratır. Bu sayfa Faz 1'in önüne geçer.

---

*Son güncelleme: 2026-04-18*
