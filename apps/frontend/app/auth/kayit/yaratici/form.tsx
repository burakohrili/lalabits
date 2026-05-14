'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

const API = process.env.NEXT_PUBLIC_API_URL!;

const ERROR_MAP: Record<string, string> = {
  EMAIL_EXISTS: 'Bu email adresi zaten kullanılıyor.',
};

type Step = 'info' | 'agreements' | 'billing';
type EntityType = 'individual' | 'sole_trader' | 'company';

export default function CreatorRegisterForm() {
  const { login, accessToken } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>('info');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [agreePlatform, setAgreePlatform] = useState(false);
  const [agreeContent, setAgreeContent] = useState(false);
  const [agreeResponsibility, setAgreeResponsibility] = useState(false);
  const [agreeKvkk, setAgreeKvkk] = useState(false);

  // billing fields
  const [entityType, setEntityType] = useState<EntityType>('individual');
  const [legalFullName, setLegalFullName] = useState('');
  const [tcIdentityNumber, setTcIdentityNumber] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [iban, setIban] = useState('');
  const [companyName, setCompanyName] = useState('');

  const allAgreed = agreePlatform && agreeContent && agreeResponsibility && agreeKvkk;

  function handleInfoNext(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!displayName || !email || password.length < 8) return;
    setStep('agreements');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!allAgreed) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register/creator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          display_name: displayName,
          password,
          agreement_version: '2025-v1',
          agreed_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { code?: string; message?: string };
        throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? '');
      }

      try {
        await login({ email, password });
        setStep('billing');
      } catch {
        router.replace('/auth/emaili-dogrula');
      }
    } catch (err) {
      setStep('info');
      if (err instanceof ApiError) {
        setError(ERROR_MAP[err.code] ?? 'Bir hata oluştu. Lütfen tekrar dene.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar dene.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleBillingSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = accessToken;
      if (token) {
        const body: Record<string, string> = { entity_type: entityType };
        if (legalFullName) body.legal_full_name = legalFullName;
        if (tcIdentityNumber) body.tc_identity_number = tcIdentityNumber;
        if (taxNumber) body.tax_number = taxNumber;
        if (phoneNumber) body.phone_number = phoneNumber;
        if (fullAddress) body.full_address = fullAddress;
        if (city) body.city = city;
        if (postalCode) body.postal_code = postalCode;
        if (iban) body.iban = iban.replace(/\s/g, '').toUpperCase();
        if (companyName) body.company_name = companyName;

        await fetch(`${API}/creator-profile/billing-info`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }
    } catch {
      // non-fatal — user can update billing info later from dashboard
    } finally {
      setLoading(false);
      router.replace('/auth/emaili-dogrula');
    }
  }

  if (step === 'billing') {
    return (
      <form onSubmit={handleBillingSubmit} className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-1">Fatura Bilgileri</h2>
          <p className="text-xs text-muted">
            Hak edişlerinizi alabilmek için bu bilgiler gereklidir. İstersen şimdi atlayıp
            hesabından doldurabilirsin.
          </p>
        </div>

        {/* Entity type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Hesap türü</label>
          <div className="flex gap-2">
            {([
              ['individual', 'Bireysel'],
              ['sole_trader', 'Serbest Meslek'],
              ['company', 'Şirket'],
            ] as [EntityType, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setEntityType(val)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  entityType === val
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted hover:border-primary/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Legal full name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="legal-full-name" className="text-sm font-medium text-foreground">
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            id="legal-full-name"
            type="text"
            maxLength={200}
            value={legalFullName}
            onChange={(e) => setLegalFullName(e.target.value)}
            placeholder="Resmi kimlik adı soyadı"
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* TC / Vergi No */}
        <div className="flex gap-3">
          {entityType !== 'company' && (
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="tc-no" className="text-sm font-medium text-foreground">
                TC Kimlik No {entityType === 'individual' && <span className="text-red-500">*</span>}
              </label>
              <input
                id="tc-no"
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={tcIdentityNumber}
                onChange={(e) => setTcIdentityNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="11 haneli"
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}
          {entityType !== 'individual' && (
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="tax-no" className="text-sm font-medium text-foreground">
                Vergi No {entityType === 'company' && <span className="text-red-500">*</span>}
              </label>
              <input
                id="tax-no"
                type="text"
                inputMode="numeric"
                maxLength={20}
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Vergi numarası"
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}
        </div>

        {/* Company name */}
        {entityType === 'company' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company-name" className="text-sm font-medium text-foreground">
              Şirket Unvanı <span className="text-red-500">*</span>
            </label>
            <input
              id="company-name"
              type="text"
              maxLength={300}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Tescilli şirket unvanı"
              className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        )}

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            maxLength={30}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+90 555 000 0000"
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-foreground">
            Adres
          </label>
          <textarea
            id="address"
            maxLength={500}
            rows={2}
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            placeholder="Açık adres"
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="city" className="text-sm font-medium text-foreground">İl</label>
            <input
              id="city"
              type="text"
              maxLength={100}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="İstanbul"
              className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="w-28 flex flex-col gap-1.5">
            <label htmlFor="postal" className="text-sm font-medium text-foreground">Posta Kodu</label>
            <input
              id="postal"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
              placeholder="34000"
              className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* IBAN */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="iban" className="text-sm font-medium text-foreground">IBAN</label>
          <input
            id="iban"
            type="text"
            maxLength={34}
            value={iban}
            onChange={(e) => setIban(e.target.value.toUpperCase())}
            placeholder="TR00 0000 0000 0000 0000 0000 00"
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <p className="text-xs text-muted">Hak edişleriniz bu IBAN&apos;a aktarılacaktır.</p>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.replace('/auth/emaili-dogrula')}
            className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-surface"
          >
            Şimdi Atla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor…' : 'Kaydet ve Devam Et'}
          </button>
        </div>
      </form>
    );
  }

  if (step === 'agreements') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-1">Sözleşme ve Onaylar</h2>
          <p className="text-xs text-muted">
            Hesap oluşturmak için aşağıdaki tüm onayları vermeniz zorunludur.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreePlatform}
              onChange={(e) => setAgreePlatform(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-xs text-foreground leading-relaxed">
              <Link href="/sozlesme/uretici-platformu" target="_blank" className="font-semibold text-primary hover:underline">
                Üretici Platform Kullanım Sözleşmesi
              </Link>
              &apos;ni okudum, anladım ve kabul ediyorum.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeContent}
              onChange={(e) => setAgreeContent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-xs text-foreground leading-relaxed">
              18 yaş altı bireyler dahil müstehcen, çıplaklık veya cinsel içerik yayınlamayacağımı;
              Atatürk aleyhine, terör propagandası, nefret söylemi ve Türk hukukunca yasak olan
              hiçbir içerik paylaşmayacağımı kabul ediyorum. İhlal durumunda hesabımın kapatılacağını
              ve hukuki işlem başlatılabileceğini anlıyorum.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeResponsibility}
              onChange={(e) => setAgreeResponsibility(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-xs text-foreground leading-relaxed">
              Yayınladığım tüm içeriklerden doğan hukuki, cezai ve idari sorumluluğun münhasıran
              bana ait olduğunu; lalabits.art&apos;ın 6563 sayılı Kanun kapsamında aracı hizmet
              sağlayıcı sıfatıyla hareket ettiğini anlıyorum.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeKvkk}
              onChange={(e) => setAgreeKvkk(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-xs text-foreground leading-relaxed">
              Kişisel verilerimin (ad soyad, TC kimlik numarası, IBAN, iletişim bilgileri)
              6698 sayılı KVKK kapsamında ödeme altyapısı ve platform hizmetleri için işleneceğini
              okudum ve onaylıyorum.{' '}
              <Link href="/gizlilik" target="_blank" className="text-primary hover:underline">
                Gizlilik Politikası
              </Link>
            </span>
          </label>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep('info')}
            className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-surface"
          >
            Geri
          </button>
          <button
            type="submit"
            disabled={loading || !allAgreed}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Kayıt yapılıyor…' : 'Hesabı Oluştur'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleInfoNext} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="display-name" className="text-sm font-medium text-foreground">
          Görünen ad
        </label>
        <input
          id="display-name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Adın veya marka adın"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@mail.com"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <p className="text-xs text-muted">En az 8 karakter</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90"
      >
        Devam Et →
      </button>

      <p className="text-center text-sm text-muted">
        Zaten hesabın var mı?{' '}
        <Link href="/auth/giris" className="text-primary hover:underline">
          Giriş yap
        </Link>
      </p>

      <div className="border-t border-border pt-4 text-center">
        <p className="text-xs text-muted mb-1">Üretici değil misin?</p>
        <Link href="/auth/kayit/fan" className="text-sm font-medium text-primary hover:underline">
          Destekçi olarak kayıt ol →
        </Link>
      </div>
    </form>
  );
}
