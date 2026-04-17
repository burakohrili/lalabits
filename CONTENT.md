# CONTENT.md — lalabits.art Tam Sayfa İçerikleri
# Claude Code için hazır metin dosyası.
# KURAL: Patreon atfı veya karşılaştırması YOK. Özgün, Türkiye'ye özgü içerik.
# TERMİNOLOJİ: UI kısa → "Üretici/Destekçi/Takipçi" | Başlık/SEO → "İçerik Üreticisi"

---

## ŞİRKET BİLGİLERİ
```
Platform     : lalabits.art
Şirket       : Noesis Social
Yetkili      : Burak OHRİLİ
Adres        : Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir
Vergi Dairesi: Ege Vergi Dairesi
Vergi No     : 35509755908
Telefon      : 0532 744 94 34
E-posta      : iletisim@lalabits.art
```

## MARKA RUHU
```
Lala  → Osmanlı ve Türk geleneğinde genç yetenekleri keşfeden,
         büyüten, himaye eden tarihsel figür.
Bits  → Dijital dünyanın en küçük yapı taşı (bit).
         Bir üreticinin çıktısının en saf, en küçük birimi.

lalabits = Sanatçının üretiminden doğan dijital parçaları
           destekçileriyle paylaştığı büyüme laboratuvarı.

Küresel telaffuz: "la-la-bits" — sezgisel, akılda kalıcı.
```

---

## 1. ANA SAYFA — app/page.tsx

### Meta SEO
```
title       : "lalabits.art — Türkiye'nin İçerik Üreticisi Platformu"
description : "Üyelik, dijital ürün ve içerik ile destekçilerinden doğrudan
               Türk lirası kazanmaya başla. Türkiye'nin ilk yerli üretici
               destekleme platformu."
og:image    : /og/anasayfa.png
```

### HERO ALANI
```
Üst etiket (badge):
"🇹🇷 Türkiye'nin İlk Yerli Üretici Platformu"

H1 (büyük başlık):
"Üret. Paylaş.
Türkiye'den Kazan."

— "Türkiye'den Kazan" → gradient metin (teal #008080 → turuncu #FF5722)

Alt metin (subheadline, 18px):
"Lala, yüzyıllar önce sanatçıyı büyüttü.
lalabits bugün içerik üreticisini büyütüyor.
Üyelik ve dijital içerikle destekçilerinden
doğrudan, Türk lirası ile kazan."

CTA çifti:
→ Birincil  : "Üretici olarak başla"   [turuncu, büyük]  /kayit/uretici
→ İkincil   : "Nasıl çalışır?"         [teal, ghost]     #nasil-calisir

Sosyal kanıt satırı (12px, muted):
"2.400+ üretici  ·  ₺18.5M+ kazanıldı  ·  47.000+ destekçi"
```

### HERO SAĞ — Üretici Kart Mockup
```
Kart başlığı       : [Üretici adı placeholder]
Kategori badge     : Yazar
Destekçi sayısı    : 248 destekçi
Kazanç             : ₺4.200 / ay

3 kademe:
  Okuyucu       ₺49/ay
  Meraklı       ₺129/ay
  Koleksiyoner  ₺299/ay

Buton: "Destekle"  [turuncu]

Yüzen bildirim kartı (animasyonlu):
"🎉 Yeni destekçi — az önce katıldı"
```

---

### BÖLÜM 2 — NASIL ÇALIŞIR
```
Bölüm ID: #nasil-calisir
Arka plan: teal-light (#e0f2f1)

H2: "3 Adımda Kazan"
Alt başlık: "Dakikalar içinde kur, aylarca kazan."

Adım 1 — ikon: [düzenle/kalem]
Başlık : "Sayfanı Oluştur"
Metin  : "Profilini, içerik kademelerini ve fiyatlarını
          belirle. Tamamen Türkçe, 5 dakikada hazır."

Adım 2 — ikon: [paylaş]
Başlık : "İçeriğini Yayınla"
Metin  : "Yazı, ses, video, PDF, şablon —
          üyelerine özel içerik yayınla.
          Her format destekleniyor."

Adım 3 — ikon: [₺ lira]
Başlık : "Türk Lirası ile Al"
Metin  : "IBAN'ına doğrudan transfer.
          Döviz kaybı yok, aracı yok,
          her ay düzenli tahsilat."

Adım bağlantısı: 1 ——→ 2 ——→ 3
```

---

### BÖLÜM 3 — ÖNE ÇIKAN ÜRETİCİLER
```
H2: "Türkiye'nin İçerik Üreticileri"
Alt: "Her alanda üretici, her kademede destekçi."

Filtre sekmesi:
Tümü | Yazar | Çizer | Podcaster | Müzisyen | Tasarımcı | Eğitimci

6 üretici kartı (3×2 grid) — placeholder veriler:

Kart 1: Zeynep A. | Yazar | 312 destekçi | ₺49'dan başlayan
Kart 2: Mert K.   | Çizer | 187 destekçi | ₺79'dan başlayan
Kart 3: Selin D.  | Podcaster | 503 destekçi | Ücretsiz gir
Kart 4: Can T.    | Müzisyen | 241 destekçi | ₺39'dan başlayan
Kart 5: Ayşe B.   | Tasarımcı | 98 destekçi | ₺99'dan başlayan
Kart 6: Emre Y.   | Eğitimci | 621 destekçi | ₺59'dan başlayan

Alt link: "Tüm üreticileri keşfet →"  /ureticilere
```

---

### BÖLÜM 4 — ÖZELLİK ÖZETİ
```
H2: "Her Şey Bir Arada"
Alt: "Üretici olmanın gerektirdiği her araç, tek platformda."

Özellik 1 (büyük kart, sol) — Kademeli Üyelik
  Başlık : "Kademeli Üyelik"
  Metin  : "Ücretsiz takipten premium destekçiye
            birden fazla kademe. Her kademede
            farklı içerik, farklı avantaj."
  Görsel : 3 kademe kartı (yığın görünümü)

Özellik 2 (sağ üst) — Dijital Mağaza
  Başlık : "Dijital Mağaza"
  Metin  : "PDF, ses, video, şablon —
            tek seferlik satış veya
            üyelik paketine dahil."

Özellik 3 (sağ orta) — Topluluk Sohbeti
  Başlık : "Topluluk Sohbeti"
  Metin  : "Destekçilerinle doğrudan iletişim.
            Kademe bazlı özel sohbet kanalları."

Özellik 4 (sağ alt) — Canlı İstatistikler
  Başlık : "Anlık İstatistik"
  Metin  : "Kazanç, abone büyümesi,
            içerik performansı — canlı."
```

---

### BÖLÜM 5 — RAKAMLAR / SOSYAL KANIT
```
Arka plan: koyu (#1a1a1a)
Metin    : beyaz

H2: "Rakamlar Konuşuyor"

4 sayaç (count-up animasyon, Intersection Observer):
  2.400+   → "Aktif Üretici"
  ₺18.5M+ → "Toplam Kazanılan"
  47.000+  → "Mutlu Destekçi"
  4.8/5    → "Memnuniyet Puanı"

Her sayı: 56px / 800 weight / turuncu
Etiket  : 14px / beyaz 60% opaklık
```

---

### BÖLÜM 6 — KATEGORİLER
```
H2: "Her İçerik Üreticisine Yer Var"
Alt: "Hangi alanda üretirsen üret, lalabits seni destekler."

8 kategori kartı (4×2 grid):
  Yazar        [kalem ikonu]
  Çizer        [fırça ikonu]
  Podcaster    [mikrofon ikonu]
  Müzisyen     [nota ikonu]
  Tasarımcı    [kare-nokta ikonu]
  Eğitimci     [kitap ikonu]
  Geliştirici  [kod ikonu]
  Diğer        [artı ikonu]

Hover efekti: teal arka plan, beyaz ikon ve metin
Route: /ureticilere?kategori=[slug]
```

---

### BÖLÜM 7 — FİNAL CTA (İKİ YOL)
```
Arka plan: teal-light (#e0f2f1) → beyaz (gradient)

H2: "Hangi Yoldasın?"

Kart A — Üretici
  H3    : "İçerik Üreticisi Olarak Başla"
  Metin : "Sayfanı oluştur, kademelerini belirle,
           Türk destekçilerinden düzenli kazan."
  ✓ Ücretsiz kurulum, komisyon sadece kazanınca
  ✓ IBAN ile doğrudan tahsilat
  ✓ Türkçe destek, Türkiye hukuku
  CTA   : "Üretici hesabı aç"   /kayit/uretici  [turuncu]

Kart B — Destekçi
  H3    : "Üreticiyi Destekle"
  Metin : "Türkiye'nin içerik üreticilerini keşfet,
           sevdiklerini destekle, özel içeriklere eriş."
  ✓ Özel içerik ve topluluk erişimi
  ✓ Türk lirası ile ödeme
  ✓ İstediğin zaman iptal
  CTA   : "Üreticileri keşfet"  /ureticilere    [teal ghost]
```

---

## 2. HAKKIMIZDA — app/hakkimizda/page.tsx

### Meta SEO
```
title       : "Hakkımızda | lalabits.art"
description : "lalabits.art kimdir, neden kuruldu, neye inanıyor?
               Türkiye'nin ilk yerli içerik üreticisi platformunun hikayesi."
```

### HERO
```
Üst etiket: "Biz kimiz?"

H1: "Sanatı Bugüne Taşımak İçin
     Buradayız"

Alt metin:
"Yüzyıllar önce 'lala', genç yetenekleri keşfeder,
büyütür ve korudu. Bugün lalabits, Türkiye'nin
içerik üreticisinin yanında aynı niyetle duruyor."
```

### BÖLÜM 1 — HİKAYE
```
H2: "Nereden Geldik?"

Metin:
Türkiye'de içerik üretmek hiç bu kadar aktif olmamıştı.
Ama gelir elde etmek hâlâ çözülmemiş bir problemdi.

Uluslararası platformlar Türkçe değil.
Ödeme sistemleri Türk lirası ile çalışmıyor.
Hukuki çerçeve Türk mevzuatına uygun değil.
Üretici, kendi ülkesinde yabancı platform kurallarıyla çalışmak zorunda kalıyor.

lalabits bu boşluğu kapatmak için 2024'te İzmir'de kuruldu.
Fikir basitti: Türkiye'nin üreticileri,
kendi dilinde, kendi parasıyla, kendi hukuk sistemiyle
çalışan bir platforma hak kazanıyor.
```

### BÖLÜM 2 — MARKA ANLAMI
```
H2: "Neden lalabits?"

İki sütun:

Sol — Lala
"Osmanlı ve Türk geleneğinde 'lala',
genç yeteneklerin yanında duran,
onları keşfeden ve büyüten kılavuz figürdür.
Tarihsel derinlik, kültürel miras,
himaye ve güven anlamı taşır."

Sağ — Bits
"Dijital dünyanın en küçük yapı taşı 'bit',
bir içerik üreticisinin çıktısının —
bir gönderi, ses dosyası, video ya da fikrin —
en saf birimidir.
Küçük ama anlam dolu."

Birleşim metni:
"lalabits: Tarihin koruyucu geleneğini dijital üretimle buluşturan platform.
Her üreticinin ürettiği her 'bit'in değer gördüğü yer."
```

### BÖLÜM 3 — DEĞERLER (4 kart)
```
H2: "Ne'ye İnanıyoruz?"

1. Üretici Önce
   Platformdaki her karar, üreticinin çıkarı gözetilerek alınır.
   Komisyon oranları, özellikler, tasarım — hepsi üretici odaklı.

2. Türkiye'ye Özgü
   Türk lirası, Türk ödeme yöntemleri, KVKK uyumu,
   Türkçe destek ekibi. Yerelde kurulan, yerelde büyüyen.

3. Şeffaf Gelir
   Komisyon oranlarımız açık, sabit ve sürprizsiz.
   Ne alacağını önceden bilirsin.

4. Uzun Vade
   Viral içerik değil, sürdürülebilir gelir.
   Üreticinin yıllarca güvenebileceği altyapı.
```

### BÖLÜM 4 — KURUCULAR
```
H2: "Arkamızdaki İnsan"

Kurucu:
Ad           : Burak OHRİLİ
Ünvan        : Kurucu & CEO
Şirket       : Noesis Social
Konum        : Bornova, İzmir
Kısa biyografi:
"Türkiye'nin dijital üretici ekonomisine inanıyor.
lalabits'i bu inancı somut bir platforma dönüştürmek için kurdu."
```

### BÖLÜM 5 — RAKAMLAR
```
H2: "Bugüne Kadar"
(Bölüm 5 / anasayfa ile aynı sayaç bileşeni)
2.400+ Üretici · ₺18.5M+ Kazanıldı · 47.000+ Destekçi
```

### CTA
```
H2: "Bir Parçası Ol"
Metin: "Türkiye'nin içerik üreticilerine özel
        platformuna katıl."
Buton 1: "Üretici olarak başla"  [turuncu]  /kayit/uretici
Buton 2: "İletişime geç"         [ghost]    mailto:iletisim@lalabits.art
```

---

## 3. BASIN KİTİ — app/basin/page.tsx

### Meta SEO
```
title       : "Basın Kiti | lalabits.art"
description : "lalabits.art basın kiti: platform özeti, logo dosyaları,
               renk rehberi ve medya iletişim bilgileri."
```

### HERO
```
H1: "Basın Kiti"
Alt metin: "Medya ve basın için ihtiyacınız olan
            her şey bu sayfada."
```

### BÖLÜM 1 — PLATFORM ÖZETİ
```
H2: "Tek Paragrafta lalabits"

Basın için hazır tanım:
"lalabits.art, Türkiye'deki içerik üreticilerinin
takipçilerinden doğrudan, Türk lirası ile gelir elde etmesini
sağlayan yerli üyelik ve dijital içerik platformudur.
İzmir merkezli Noesis Social tarafından 2024'te kurulan platform,
tamamen Türkçe arayüz ve Türkiye'ye özgü ödeme altyapısıyla
çalışmaktadır."

Özet Bilgiler (tablo):
Kategori     : İçerik Teknolojisi / Üretici Ekonomisi
Kuruluş      : 2024, İzmir
Şirket       : Noesis Social
Yetkili      : Burak OHRİLİ
Hedef pazar  : Türkiye
Web          : https://lalabits.art
```

### BÖLÜM 2 — LOGO & GÖRSELLER
```
H2: "Logo ve Görsel Dosyalar"

Logo hikayesi:
"lalabits logosu, Türk mozaik sanat geleneğinden ilham alır.
Dikdörtgen form içindeki hat motifi, 'lala' kültürel mirasını;
sağ üst köşeden dağılan turuncu pikseller 'bits' dijital
çıktısını temsil eder. İkisi birleşince hem geçmişe hem
geleceğe bakan bir marka kimliği ortaya çıkar."

Renk Paleti:
● Lala Turkuaz    #008080   — Birincil sistem rengi
● Bit Turuncu     #FF5722   — Aksan ve CTA rengi
● İnci Beyaz      #F8F9FA   — Arka plan
● Kömür Siyah     #212121   — Ana metin

İndirme Butonları:
PNG — Şeffaf arka plan (2000px)
SVG — Vektör dosyası
Wordmark yatay — Koyu zemin üzeri (beyaz)
Wordmark yatay — Açık zemin üzeri (siyah)
Favicon / App ikonu — 512×512px

Kullanım Kuralları:
· Logo rengi değiştirilemez.
· Logo üzerine metin yerleştirilemez.
· Minimum kullanım boyutu: 120px genişlik.
· Çevresinde en az logo yüksekliği kadar boşluk bırakılmalı.
```

### BÖLÜM 3 — BASIN BÜLTENLERİ
```
H2: "Basın Bültenleri"

[İlk bülten yayınlanana kadar boş durum:]
"Henüz yayınlanmış basın bülteni bulunmuyor.
Bülten listemize eklenmek için
iletisim@lalabits.art adresine yazabilirsiniz."
```

### BÖLÜM 4 — İLETİŞİM
```
H2: "Basın İletişimi"

İsim        : Burak OHRİLİ
Ünvan       : Kurucu
E-posta     : iletisim@lalabits.art
Telefon     : 0532 744 94 34
Yanıt süresi: "Basın taleplerine 24 saat içinde yanıt veririz."
```

---

## 4. KOMİSYON HESAPLAYICI — components/KomisyonHesaplaci.tsx

### Başlık Alanı
```
H3 : "Kazancını Hesapla"
Alt : "Hedef destekçi sayın ve ortalama aylık bedeli gir,
       net kazancını görelim."
```

### Girdi Alanları
```
Alan 1:
  Etiket      : "Aylık destekçi sayısı"
  Tip         : number / range slider
  Min         : 1
  Max         : 50.000
  Varsayılan  : 100
  Birim       : "destekçi"

Alan 2:
  Etiket      : "Ortalama aylık üyelik bedeli"
  Tip         : number / range slider
  Min         : 9
  Max         : 9.999
  Varsayılan  : 89
  Birim       : "₺"

Kademe seçimi (radio + badge):
  ○ Başlangıç   — %8 komisyon
  ● Pro         — %6 komisyon   [ÖNERİLEN badge]
  ○ Kurumsal    — %4 komisyon
```

### Sonuç Gösterimi
```
Brüt Gelir          : ₺XX.XXX
Platform komisyonu  : − ₺X.XXX  (%X)
─────────────────────────────────
Aylık net kazanç   : ₺XX.XXX   [büyük, turuncu, 32px]
Yıllık net kazanç  : ₺XXX.XXX  [orta, teal, 20px]

Not (12px, muted):
"Tahmini hesaplamadır. Ödeme altyapısı işlem ücreti
ayrıca uygulanabilir. Gerçek rakamlar için /fiyatlar sayfasına bakın."
```

### Alt CTA
```
Metin  : "Başlamak tamamen ücretsiz."
Buton  : "Üretici hesabı aç"  [turuncu]  /kayit/uretici
```

---

## 5. LALABİTS NEDİR — app/lalabits-nedir/page.tsx

### Meta SEO
```
title       : "lalabits Nedir? | Türkiye'nin İçerik Üreticisi Platformu"
description : "lalabits; Türkiye'deki içerik üreticilerinin,
               destekçilerinden Türk lirası ile doğrudan gelir elde ettiği
               yerli üyelik platformudur. Tamamen Türkçe, KVKK uyumlu."
keywords    : "lalabits nedir, içerik üreticisi platform türkiye,
               üyelik sistemi türkiye, destekçi platformu, türk lirası gelir"
```

### HERO
```
Üst etiket : "Platform Tanıtımı"

H1: "lalabits Nedir?"

Alt metin:
"Bir 'lala' gibi sanatçının yanında durur.
Bir 'bit' kadar küçük, bir hayat kadar değerli.
Türkiye'nin içerik üreticileri için yerli, Türkçe
ve Türk lirası ile çalışan üyelik platformu."

CTA: "Üretici olarak başla"  [turuncu]  /kayit/uretici
```

### BÖLÜM 1 — PLATFORM NEDİR
```
H2: "Kısaca Anlatalım"

Giriş:
lalabits, içerik üreten kişilerin — yazar, çizer,
podcaster, müzisyen, tasarımcı, eğitimci —
takipçilerinden aylık üyelik ya da tek seferlik
ödeme ile doğrudan gelir elde etmesini sağlar.

Reklam geliri yok.
Algoritma baskısı yok.
İzin almak zorunda değilsin.
Üretici ile destekçi arasında doğrudan bağlantı.
```

### BÖLÜM 2 — ÜRETİCİ İÇİN (3 kart)
```
H2: "İçerik Üreticisi İçin"

Kart 1 — ikon: katmanlar
Başlık : "Kademeli Üyelik Kur"
Metin  : Birden fazla üyelik kademesi oluştur.
         Ücretsiz takipçiden premium destekçiye
         farklı içerik seviyeleri sun.

Kart 2 — ikon: paket
Başlık : "Dijital Ürün Sat"
Metin  : PDF, ses, video, şablon — üyelik dışında
         tek seferlik satışla ek gelir kapısı aç.

Kart 3 — ikon: ₺ lira
Başlık : "Türk Lirası ile Tahsilat"
Metin  : IBAN havale, Türk banka kartı.
         Döviz kaybı yok, komisyon sadece
         kazandığında kesilir.
```

### BÖLÜM 3 — DESTEKÇİ İÇİN (3 kart)
```
H2: "Destekçi İçin"

Kart 1 — ikon: kilit-açık
Başlık : "Özel İçeriklere Eriş"
Metin  : Desteklediğin üreticinin herkese açık
         olmayan içeriklerine ve topluluğuna katıl.

Kart 2 — ikon: lira
Başlık : "Türk Lirası ile Öde"
Metin  : Dolar ya da euro kaybı yok.
         Kendi paran, kendi bankan.

Kart 3 — ikon: kalp
Başlık : "Doğrudan Destekle"
Metin  : Ödemenin büyük kısmı üreticiye gidiyor.
         Platforma değil, içeriği üreten kişiye.
```

### BÖLÜM 4 — PLATFORM ÖZELLİKLERİ (özellik grid)
```
H2: "Neler Sunuyoruz?"

Özellik satırları (ikon + başlık + kısa açıklama):

✓ Kademeli üyelik sistemi
  Ücretsizden premium'a birden fazla kademe.

✓ Dijital ürün mağazası
  Tek seferlik satış ve koleksiyonlar.

✓ Özel gönderi ve içerik kilitleme
  Kademe bazlı erişim kontrolü.

✓ Topluluk sohbeti
  Üretici ve destekçi arasında doğrudan iletişim.

✓ Anlık gelir istatistikleri
  Kazanç, abone büyümesi, içerik performansı.

✓ IBAN ile ödeme çıkışı
  Her ay doğrudan banka hesabına.

✓ KVKK uyumlu veri yönetimi
  Kişisel veriler Türkiye mevzuatına uygun korunur.

✓ Türkçe destek ekibi
  Sorularınız için Türkçe yanıt garantisi.
```

### SSS
```
H2: "Sık Sorulan Sorular"

S: lalabits ücretsiz mi?
C: Kayıt tamamen ücretsiz. Yalnızca kazandığında
   seçtiğin plana göre komisyon kesilir.

S: Üretici olmak için kaç takipçim olmalı?
C: Hiç. Sıfır takipçiyle bugün başlayabilirsin.

S: Destekçilerden ne zaman ödeme alırım?
C: Her ayın 25'inde IBAN'ına transfer başlar.
   3–5 iş günü içinde hesabında görünür.

S: İstediğim zaman bırakabilir miyim?
C: Evet. Hesabını dondurabilir ya da silebilirsin.
   Aktif destekçilerin üyeliği dönem sonunda kapanır.

S: Türkiye dışından destekçi olunabilir mi?
C: Evet. Destekçi tarafında konum sınırlaması yok.
   Üretici tarafı şu an Türkiye merkezli çalışıyor.
```

### FİNAL CTA
```
H2: "Hazır mısın?"
Metin  : "Ücretsiz hesap aç, sayfanı oluştur,
          kazanmaya başla."
Buton  : "Şimdi başla"  [turuncu, büyük]  /kayit/uretici
Küçük  : "Kurulum ücretsiz · Kredi kartı gerekmez"
```

---

## 6. TÜRKİYE ÖDEMELERİ — app/turkiye-odemeleri/page.tsx

### Meta SEO
```
title       : "Türkiye Ödemeleri | lalabits.art"
description : "lalabits ile Türk lirası üzerinden kazan.
               IBAN, Türk banka kartı ve yerel ödeme yöntemleriyle
               destekçilerinden doğrudan tahsilat yap."
keywords    : "türk lirası creator ödeme, iban üretici tahsilat,
               türk banka kartı içerik geliri, türkiye ödeme platformu"
```

### HERO
```
H1: "Türkiye'de Üret,
     Türkiye'den Kazan"

Alt metin:
"Döviz çevirme yok. Uluslararası transfer ücreti yok.
Para kaybı yok. Türk lirası, Türk bankası, Türk hukuku.
Kazancın doğrudan IBAN'ına."
```

### BÖLÜM 1 — DESTEKÇİDEN TAHSİLAT YÖNTEMLERİ
```
H2: "Destekçiler Nasıl Ödüyor?"

Kart 1 — Türk Banka Kartı
  Başlık : "Türk Banka Kartı"
  Metin  : Tüm Türk bankaları desteklenir.
           Visa, Mastercard, Troy.
           Taksitli ödeme seçeneği mevcut.

Kart 2 — Kredi Kartı
  Başlık : "Kredi Kartı"
  Metin  : Bireysel ve kurumsal kredi kartları.
           Otomatik yenileme ile sorunsuz abonelik.

Kart 3 — Havale / EFT
  Başlık : "Havale / EFT"
  Metin  : Destekçi banka havalesiyle ödeyebilir.
           Otomatik abonelik için kart gereklidir.

Kart 4 — Papara (Yakında)
  Başlık : "Papara"
  Metin  : Papara entegrasyonu geliyor.
           Bildirimlere abone ol.
  Badge  : "Yakında"
```

### BÖLÜM 2 — ÜRETİCİYE ÖDEME TAKVİMİ
```
H2: "Kazancın Ne Zaman Gelir?"

Zaman çizelgesi (adım adım):
1. Ayın 15'i    → Tahsilat dönemi kapanır
2. Ayın 20'si   → Net tutarlar hesaplanır
3. Ayın 25'i    → IBAN'ına transfer başlar
4. 3–5 iş günü → Hesabında görünür

Detaylar:
Minimum çekim : ₺100
Maksimum      : Sınır yok
Ödeme yöntemi : IBAN (Türkiye'deki herhangi bir banka)
```

### BÖLÜM 3 — VERGİ VE FATURALAMA
```
H2: "Vergi ve Fatura"

Metin:
lalabits, Türk vergi mevzuatına uygun faaliyet gösterir.
Platform KDV dahil fatura düzenler.

Serbest çalışan üreticiler:
Makbuz veya serbest meslek makbuzu yeterlidir.

Şirketli üreticiler:
Fatura kesilir, KDV iade sürecine dahil edilebilir.

Önemli not:
Kendi vergi yükümlülüklerin için mali müşavirinize danışın.
lalabits vergi danışmanlığı hizmeti vermez.
```

### BÖLÜM 4 — GÜVENLİK
```
H2: "Ödeme Güvenliği"

✓ SSL/TLS şifreleme — tüm işlemler şifrelidir
✓ PCI DSS uyumlu ödeme altyapısı
✓ Kart bilgileri lalabits sunucularında saklanmaz
✓ 3D Secure zorunlu doğrulama
✓ KVKK uyumlu veri işleme
```

### SSS
```
H2: "Ödeme SSS"

S: Yurt dışı kart ile destekçi olunabilir mi?
C: Evet. Destekçi tarafında uluslararası kart kabul edilir.

S: Tahsilatımı TRY dışında alabilir miyim?
C: Şu an yalnızca Türk lirası destekleniyor.

S: Ödeme transferim gecikirse?
C: destek@lalabits.art adresine yaz.
   3 iş günü içinde geri dönüş garantisi.

S: Komisyon ne zaman kesilir?
C: Brüt tahsilattan hemen sonra net tutar hesaplanır.
   IBAN'ına gelen tutar komisyon düşülmüş halidir.
```

### CTA
```
Metin  : "Bugün başla, bu ay kazan."
Buton  : "Üretici hesabı aç"  [turuncu]  /kayit/uretici
```

---

## 7. GİZLİLİK POLİTİKASI — app/gizlilik/page.tsx

### Meta SEO
```
title       : "Gizlilik Politikası | lalabits.art"
description : "lalabits.art gizlilik politikası ve kişisel veri işleme
               esasları. KVKK kapsamında hazırlanmıştır."
```

### Üst Bilgi Alanı
```
H1            : "Gizlilik Politikası"
Son güncelleme: Ocak 2025
Yürürlük      : Ocak 2025
```

### TAM METİN
```
1. VERİ SORUMLUSU

Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması
Kanunu (KVKK) ve ilgili mevzuat kapsamında hazırlanmıştır.

Veri Sorumlusu:
Noesis Social / Burak OHRİLİ
Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir
Ege Vergi Dairesi | VKN: 35509755908
iletisim@lalabits.art | 0532 744 94 34


2. TOPLANAN KİŞİSEL VERİLER

2.1 Hesap ve Kimlik Verileri
Ad, soyad, kullanıcı adı, e-posta adresi, şifre (hash'lenmiş),
profil fotoğrafı, biyografi.

2.2 Finansal Veriler
IBAN (üreticiler — ödeme transferi için),
ödeme geçmişi, fatura bilgileri.
Kart bilgileri lalabits sunucularında saklanmaz;
PCI DSS uyumlu altyapı tarafından işlenir.

2.3 Kullanım Verileri
IP adresi, tarayıcı türü, ziyaret edilen sayfalar,
platform işlem geçmişi, çerez verileri.

2.4 İletişim İçerikleri
Destek talepleri ve yazışma kayıtları.


3. VERİLERİN İŞLENME AMAÇLARI VE HUKUKİ DAYANAKLAR

a) Hizmetin sunulması ve hesap yönetimi
   — Hukuki dayanak: Sözleşmenin ifası (KVKK md. 5/2-c)

b) Ödeme ve tahsilat işlemleri
   — Hukuki dayanak: Sözleşmenin ifası (KVKK md. 5/2-c)

c) Yasal yükümlülüklerin yerine getirilmesi
   — Hukuki dayanak: Kanuni zorunluluk (KVKK md. 5/2-ç)

d) Güvenlik ve dolandırıcılık önleme
   — Hukuki dayanak: Meşru menfaat (KVKK md. 5/2-f)

e) Platform iyileştirme ve anonim analitik
   — Hukuki dayanak: Meşru menfaat (KVKK md. 5/2-f)

f) Pazarlama iletişimi
   — Hukuki dayanak: Açık rıza (KVKK md. 5/1)


4. VERİLERİN AKTARILDIĞI TARAFLAR

Ödeme hizmet sağlayıcıları (yalnızca ödeme işlemi kapsamında)
Yasal zorunluluk halinde kamu kurum ve kuruluşları
Teknik altyapı sağlayıcıları (hosting, e-posta — işlemci sıfatıyla)

Verileriniz üçüncü taraflara ticari amaçla satılmaz veya kiralanmaz.


5. VERİ SAKLAMA SÜRELERİ

Hesap verileri   : Hesap aktif süresi + 3 yıl
Finansal kayıtlar: 10 yıl (213 sayılı VUK gereği)
İletişim kayıtları: 2 yıl
Çerez verileri   : Çerez türüne göre (bkz. Çerez Politikası)


6. VERİ SAHİBİ HAKLARI (KVKK Madde 11)

Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:

a) Verilerinizin işlenip işlenmediğini öğrenme
b) İşlenmişse buna ilişkin bilgi talep etme
c) İşlenme amacını ve amaca uygunluğunu öğrenme
d) Yurt içi/dışı aktarımları öğrenme
e) Eksik/yanlış verilerin düzeltilmesini isteme
f) Silinmesini veya yok edilmesini isteme
g) Otomatik işleme itiraz etme
h) Kanuna aykırı işleme nedeniyle zararın tazminini talep etme

Başvuru: iletisim@lalabits.art
Yanıt süresi: 30 gün içinde


7. VERİ GÜVENLİĞİ

SSL/TLS şifreleme, rol tabanlı erişim kontrolü,
şifreli veri depolama ve düzenli güvenlik denetimleri
uygulanmaktadır.


8. POLİTİKA DEĞİŞİKLİKLERİ

Bu politika güncellenebilir. Önemli değişikliklerde
kayıtlı e-posta adresinize önceden bildirim gönderilir.
```

---

## 8. KULLANIM ŞARTLARI — app/kullanim-sartlari/page.tsx

### Meta SEO
```
title       : "Kullanım Şartları | lalabits.art"
description : "lalabits.art kullanım şartları ve koşulları.
               Platform kullanımına ilişkin hak ve yükümlülükler."
```

### Üst Bilgi
```
H1            : "Kullanım Şartları"
Son güncelleme: Ocak 2025
Yürürlük      : Ocak 2025
```

### TAM METİN
```
1. TARAFLAR VE KAPSAM

Bu Kullanım Şartları ("Şartlar"), lalabits.art platformunu işleten
Noesis Social / Burak OHRİLİ ("Şirket") ile platformu kullanan
gerçek veya tüzel kişiler ("Kullanıcı") arasındaki ilişkiyi düzenler.

Şirket bilgileri:
Noesis Social / Burak OHRİLİ
Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir
Ege Vergi Dairesi | VKN: 35509755908

Platformu kullanarak bu Şartları okuduğunuzu,
anladığınızı ve kabul ettiğinizi beyan edersiniz.


2. KULLANICI TÜRLERİ VE TANIMLAR

Üretici : Platformda içerik yayınlayan ve gelir elde eden kullanıcı.
Destekçi: Üreticileri ücretli üyelikle destekleyen kullanıcı.
Takipçi : Üreticileri ücretsiz olarak takip eden kullanıcı.
Kademe  : Üreticinin belirlediği üyelik seviyesi ve fiyatı.
İçerik  : Üreticinin platforma yüklediği her türlü materyal.


3. KAYIT VE HESAP

3.1 Platforma kayıt için 18 yaşını doldurmuş olmak gerekir.
3.2 Kayıt sırasında verilen bilgiler doğru ve güncel olmalıdır.
3.3 Hesap güvenliğinden kullanıcı sorumludur.
3.4 Şüpheli aktivitede derhal iletisim@lalabits.art bildirilmelidir.


4. ÜRETİCİ YÜKÜMLÜLÜKLERİ

4.1 Yayınlanan tüm içerik Türkiye Cumhuriyeti yasalarına uygun olmalıdır.
4.2 Telif hakkı ihlali içeren materyal kesinlikle yayınlanamaz.
4.3 Nefret söylemi, şiddet içeren ve pornografik içerik yasaktır.
4.4 Yanıltıcı, aldatıcı veya sahte içerik yayınlanamaz.
4.5 Üreticiler kendi vergi yükümlülüklerinden tamamen sorumludur.
4.6 IBAN ve kimlik bilgileri doğru ve güncel tutulmalıdır.
4.7 Destekçilere vaat edilen kademelerdeki içerik sunulmalıdır.


5. DESTEKÇİ VE TAKİPÇİ YÜKÜMLÜLÜKLERİ

5.1 Ödeme bilgileri doğru ve kendi adına olmalıdır.
5.2 Erişilen içerik, üçüncü taraflarla paylaşılamaz.
5.3 İptal, istedikleri zaman yapılabilir.
    İptal, ilgili ödeme döneminin sonuna kadar erişimi korur.
5.4 İade politikası için Madde 8'e bakınız.


6. KOMİSYON VE FİYATLANDIRMA

Platform, üretici kazancından aşağıdaki komisyon oranlarını keser:

Başlangıç planı : %8
Pro planı       : %6
Kurumsal plan   : %4

Ödeme işlem ücretleri ayrıca uygulanabilir.
Güncel oran tablosu için /fiyatlar sayfasına bakınız.


7. FİKRİ MÜLKİYET

7.1 Üreticiler, platformda yayınladıkları içeriklerin
    telif hakkını elinde tutar.
7.2 Üreticiler, içeriklerini platformda gösterme ve dağıtma
    lisansını lalabits'e vermektedir.
7.3 lalabits logosu, adı ve görsel kimliği Noesis Social'a aittir.
    İzinsiz kullanılamaz.


8. İADE POLİTİKASI

8.1 Üyelik ücretleri kural olarak iade edilmez.
8.2 Teknik hata veya çifte tahsilat durumunda tam iade yapılır.
8.3 İade talebi için destek@lalabits.art adresine başvurulur.
    Talepler 5 iş günü içinde değerlendirilir.


9. HESAP ASKIYA ALMA VE KAPATMA

Şirket, aşağıdaki durumlarda hesabı önceden bildirim yapmaksızın
askıya alabilir veya kapatabilir:

a) Bu Şartlar'ın ihlali
b) Yasadışı faaliyet tespiti
c) Sahte hesap veya kimlik bilgisi
d) Üçüncü taraf haklarının ihlali


10. SORUMLULUK SINIRLAMASI

lalabits, üreticilerin yayınladığı içeriklerden sorumlu değildir.
Platform, teknik kesintiler nedeniyle oluşan doğrudan olmayan
zararlardan sorumlu tutulamaz.


11. UYGULANACAK HUKUK VE YETKİLİ MAHKEME

Bu Şartlar Türkiye Cumhuriyeti hukukuna tabidir.
Uyuşmazlıklarda İzmir Mahkemeleri ve İcra Daireleri yetkilidir.


12. İLETİŞİM

iletisim@lalabits.art
0532 744 94 34
Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir
```

---

## 9. KVKK AYDINLATMA METNİ — app/kvkk/page.tsx

### Meta SEO
```
title       : "KVKK Aydınlatma Metni | lalabits.art"
description : "lalabits.art, 6698 sayılı Kişisel Verilerin Korunması Kanunu
               kapsamında kişisel veri işleme aydınlatma metni."
```

### Üst Bilgi
```
H1            : "Kişisel Verilerin Korunması Kanunu (KVKK)
                 Kapsamında Aydınlatma Metni"
Düzenleme     : 6698 Sayılı KVKK Madde 10
Son güncelleme: Ocak 2025
```

### TAM METİN
```
1. VERİ SORUMLUSUNUN KİMLİĞİ

Unvan    : Noesis Social
Yetkili  : Burak OHRİLİ
Adres    : Gazi Osman Paşa Mah. 5499/1 Sokak No:9, Bornova / İzmir
VKN      : 35509755908 (Ege Vergi Dairesi)
Telefon  : 0532 744 94 34
E-posta  : iletisim@lalabits.art
Web      : https://lalabits.art


2. İŞLENEN KİŞİSEL VERİLER VE KATEGORİLERİ

Kimlik Verileri
Ad, soyad, kullanıcı adı, doğum tarihi (yaş doğrulama).

İletişim Verileri
E-posta adresi, telefon numarası.

Finansal Veriler
IBAN numarası (üreticiler — ödeme çıkışı için),
ödeme geçmişi, fatura bilgileri.
Not: Kart numarası gibi ödeme aracı bilgileri
lalabits sistemlerinde işlenmez ve saklanmaz.

İşlem Güvenliği Verileri
IP adresi, oturum bilgileri, işlem geçmişi.

Pazarlama Verileri
E-posta tercihleri (yalnızca onay verilmişse).


3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI

a) Platform hizmetinin sunulması ve hesap yönetimi
b) Ödeme ve tahsilat işlemlerinin gerçekleştirilmesi
c) Üretici ve destekçi kimliğinin doğrulanması
d) Vergi mevzuatı kapsamında yasal yükümlülüklerin ifası
e) Dolandırıcılık ve güvenlik ihlallerinin önlenmesi
f) Platform iyileştirme çalışmalarında anonim analitik kullanımı
g) Pazarlama iletişimi (yalnızca açık rıza ile)


4. KİŞİSEL VERİLERİN AKTARILDIĞI TARAFLAR VE AMAÇLAR

Ödeme hizmet sağlayıcıları
→ Ödeme işleminin gerçekleştirilmesi amacıyla sınırlı bilgi aktarımı.

Yasal zorunluluk halinde kamu kurum ve kuruluşları
→ Yargı veya idari makam talebi.

Yurt dışı bulut hizmet sağlayıcıları
→ Platform altyapısı için; KVKK md. 9 kapsamında gerekli önlemler alınmıştır.


5. KİŞİSEL VERİLERİN TOPLANMA YÖNTEMİ VE HUKUKİ DAYANAĞI

Veriler; web formu, mobil/web uygulama, e-posta ve çerezler
aracılığıyla toplanmaktadır.

Hukuki dayanaklar:
· Sözleşmenin kurulması ve ifası (KVKK md. 5/2-c)
· Veri sorumlusunun hukuki yükümlülüğü (KVKK md. 5/2-ç)
· Meşru menfaat (KVKK md. 5/2-f)
· Açık rıza (KVKK md. 5/1) — yalnızca pazarlama için


6. VERİ SAHİBİNİN HAKLARI (KVKK Madde 11)

Aşağıdaki haklarınızı kullanmak için
iletisim@lalabits.art adresine yazabilirsiniz:

a) Kişisel verilerinizin işlenip işlenmediğini öğrenme
b) İşlenmişse buna ilişkin bilgi talep etme
c) İşlenme amacını ve amaca uygunluğunu öğrenme
d) Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme
e) Eksik veya yanlış işlenmişse düzeltilmesini isteme
f) KVKK'nın 7. maddesi çerçevesinde silinmesini isteme
g) Düzeltme ve silme işlemlerinin aktarım yapılan üçüncü kişilere
   bildirilmesini isteme
h) İşlenen verilerin münhasıran otomatik sistemler aracılığıyla
   analiz edilmesi suretiyle aleyhinize sonuç çıkmasına itiraz etme
i) Kanuna aykırı işleme nedeniyle zarara uğramanız halinde
   zararın giderilmesini talep etme


7. BAŞVURU YÖNTEMİ VE YANIT SÜRESİ

Başvuru e-postası : iletisim@lalabits.art
Konu satırı       : "KVKK Başvurusu"
Yanıt süresi      : 30 gün

Başvurunuzda; adınız, soyadınız, TC kimlik numaranız (isteğe bağlı),
talep ettiğiniz hak ve iletişim bilgileriniz yer almalıdır.
```

---

## 10. ÇEREZ POLİTİKASI — app/cerez-politikasi/page.tsx

### Meta SEO
```
title       : "Çerez Politikası | lalabits.art"
description : "lalabits.art çerez politikası. Hangi çerezlerin
               kullanıldığı, amaçları ve nasıl yönetileceği."
```

### Üst Bilgi
```
H1            : "Çerez Politikası"
Son güncelleme: Ocak 2025
```

### TAM METİN
```
1. ÇEREZ NEDİR?

Çerezler, ziyaret ettiğiniz web sitesi tarafından tarayıcınıza
yerleştirilen küçük metin dosyalarıdır. Oturumunuzu hatırlamak,
tercihlerinizi saklamak ve platform performansını ölçmek amacıyla kullanılır.


2. KULLANDIĞIMIZ ÇEREZ TÜRLERİ

2.1 Zorunlu Çerezler
Platform işlevselliği için gereklidir. Devre dışı bırakılamaz.

Çerez adı      : session_id
Amaç           : Oturum yönetimi
Süre           : Oturum süresince
Sağlayıcı      : lalabits.art

Çerez adı      : csrf_token
Amaç           : Güvenlik — sahte istek koruması
Süre           : Oturum süresince
Sağlayıcı      : lalabits.art

2.2 Tercih Çerezleri
Dil, tema ve kullanıcı ayarlarını hatırlar. Devre dışı bırakılabilir.

Çerez adı      : user_prefs
Amaç           : Kullanıcı tercihleri (dil, görünüm)
Süre           : 1 yıl
Sağlayıcı      : lalabits.art

2.3 Analitik Çerezler
Platform kullanımını anonim olarak ölçer. Devre dışı bırakılabilir.

Çerez adı      : _ga / _gid
Amaç           : Anonim ziyaretçi istatistikleri
Süre           : 2 yıl / 24 saat
Sağlayıcı      : Google Analytics

2.4 Pazarlama Çerezleri
Yalnızca açık rıza ile etkinleştirilir.

Amaç           : Hedefli reklam ve yeniden pazarlama
Süre           : 90 gün
Sağlayıcı      : Google, Meta (varsa)


3. ÇEREZ YÖNETİMİ

Siteyi ilk ziyaretinizde çerez tercih bannerı görüntülenir.
Zorunlu dışındaki çerezleri kabul edebilir veya reddedebilirsiniz.

Tercihlerinizi değiştirmek için:
· Sitemizin alt kısmındaki "Çerez Tercihleri" bağlantısını kullanın.
· Tarayıcı ayarlarından çerezleri silebilirsiniz.

Tarayıcı bazlı çerez silme:
Chrome  : Ayarlar > Gizlilik > Çerezler
Firefox : Seçenekler > Gizlilik > Çerezleri Temizle
Safari  : Tercihler > Gizlilik > Web Sitesi Verilerini Yönet


4. ÜÇÜNCÜ TARAF ÇEREZLER

Google Analytics, platforma anonim ziyaretçi verileri sağlamak
amacıyla kullanılmaktadır. Google'ın gizlilik politikası için:
https://policies.google.com/privacy


5. DEĞİŞİKLİKLER

Bu politika güncellenebilir. Önemli değişikliklerde
kayıtlı e-posta adresinize bildirim gönderilir.


6. İLETİŞİM

Çerezler hakkında sorularınız için:
iletisim@lalabits.art
```

---

## NOTLAR — Claude Code için

```
1. Tüm sayfalar Next.js App Router — Server Component varsayılan.
2. Yasal sayfalar (kvkk, gizlilik, kullanim-sartlari, cerez-politikasi):
   — Sade, okunabilir tipografi
   — Siyah üzerine beyaz, serif veya Inter
   — Bölüm numaraları koyu, içerik normal ağırlık
   — Sağ panel: "İçindekiler" sticky listesi (H2 başlıkları)
   — Yazdır butonu (opsiyonel)

3. hakkimizda + basin:
   — Mozaik görsel dili kullan (logo ile uyumlu)
   — Hero'da koyu arka plan (teal dark veya #1a1a1a)

4. lalabits-nedir + turkiye-odemeleri:
   — SEO odaklı — H1/H2 anahtar kelimeleri dikkatli seç
   — Soru-cevap (SSS) bölümü Schema.org FAQPage markup ile işaretle

5. KomisyonHesaplaci:
   — 'use client' — useState ile reaktif hesaplama
   — Debounce ekle (input her değişimde hesaplama)
   — Mobilde slider, desktop'ta input + slider birlikte

6. Route yapısı:
   /hakkimizda
   /basin
   /lalabits-nedir
   /turkiye-odemeleri
   /gizlilik
   /kullanim-sartlari
   /kvkk
   /cerez-politikasi
   components/KomisyonHesaplaci.tsx  (import edilebilir bileşen)
```

---
*Son güncelleme: 2025 · lalabits.art · Noesis Social · Burak OHRİLİ*
