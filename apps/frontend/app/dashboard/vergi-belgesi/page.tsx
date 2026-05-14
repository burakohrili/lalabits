'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface PayoutPeriod {
  id: string;
  period_month: number;
  period_year: number;
  net_payout_try: number;
  status: string;
}

interface PayoutDocument {
  id: string;
  payout_id: string;
  document_type: string;
  file_key: string;
  uploaded_at: string;
  verified_at: string | null;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  e_fatura: 'e-Fatura',
  e_arsiv: 'e-Arşiv Fatura',
  e_smm: 'e-Serbest Meslek Makbuzu',
  other: 'Diğer Belge',
};

function periodLabel(month: number, year: number) {
  return new Date(year, month - 1, 1).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
}

function fmt(amount: number) {
  return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 });
}

export default function VergiBelgesiPage() {
  const { accessToken, status: authStatus } = useAuth();

  const [payouts, setPayouts] = useState<PayoutPeriod[]>([]);
  const [documents, setDocuments] = useState<Record<string, PayoutDocument[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);
  const [docType, setDocType] = useState<string>('e_smm');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchPayouts = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/creator/payouts?limit=12`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('FETCH_FAILED');
      const data = (await res.json()) as { items: PayoutPeriod[] };
      setPayouts(data.items);
    } catch {
      setError('Dönemler yüklenemedi. Sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchDocuments = useCallback(async (payoutId: string) => {
    if (!accessToken || documents[payoutId]) return;
    try {
      const res = await fetch(`${API}/creator/payouts/${payoutId}/documents`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items: PayoutDocument[] };
      setDocuments((prev) => ({ ...prev, [payoutId]: data.items }));
    } catch {
      // silently ignore
    }
  }, [accessToken, documents]);

  useEffect(() => {
    if (authStatus === 'authenticated') void fetchPayouts();
  }, [authStatus, fetchPayouts]);

  useEffect(() => {
    if (selectedPayout) void fetchDocuments(selectedPayout);
  }, [selectedPayout, fetchDocuments]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !selectedPayout || uploading || !accessToken) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', docType);
      const res = await fetch(`${API}/creator/payouts/${selectedPayout}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      if (!res.ok) throw new Error('UPLOAD_FAILED');
      const doc = (await res.json()) as PayoutDocument;
      setDocuments((prev) => ({
        ...prev,
        [selectedPayout]: [doc, ...(prev[selectedPayout] ?? [])],
      }));
      setFile(null);
      setUploadSuccess(true);
    } catch {
      setUploadError('Belge yüklenemedi. Dosya boyutunuzu ve formatınızı kontrol edin.');
    } finally {
      setUploading(false);
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-3xl">
      <h1 className="text-xl font-bold text-foreground mb-2">Vergi Belgesi Yükle</h1>
      <p className="text-sm text-muted mb-6">
        Her ödeme dönemi için e-Fatura, e-Arşiv veya e-SMM yükleyerek ödemenizin serbest bırakılmasını sağlayın.
      </p>

      {/* Info box */}
      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm font-medium text-amber-800 mb-1">Yasal Zorunluluk</p>
        <p className="text-xs text-amber-700">
          Türkiye vergi mevzuatı gereği Lalabits'ten alacağınız her ödeme için kendi adınıza belge düzenlemeniz zorunludur.
          Bireysel üreticiler e-SMM, şirketler e-Fatura veya e-Arşiv düzenlemelidir.
          Vergi numaranız ve kayıt bilgilerinizin <a href="/dashboard/profil-duzenle" className="underline">profil düzenle</a> sayfasında güncel olduğundan emin olun.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {payouts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted">Henüz ödeme döneminiz yok.</p>
          <p className="mt-1 text-xs text-muted">Onaylanan hak edişleriniz aylık dönemler halinde ödenecektir.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payouts.map((payout) => {
            const isSelected = selectedPayout === payout.id;
            const docs = documents[payout.id] ?? [];
            return (
              <div key={payout.id} className="rounded-2xl border border-border bg-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPayout(isSelected ? null : payout.id);
                    setUploadSuccess(false);
                    setUploadError(null);
                    setFile(null);
                  }}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-background/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{periodLabel(payout.period_month, payout.period_year)}</p>
                    <p className="text-xs text-muted mt-0.5">Net ödeme: {fmt(payout.net_payout_try)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={[
                      'rounded-full px-2 py-0.5 text-[11px] font-medium',
                      payout.status === 'paid' ? 'bg-green-50 text-green-700'
                        : payout.status === 'processing' ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700',
                    ].join(' ')}>
                      {payout.status === 'paid' ? 'Ödendi' : payout.status === 'processing' ? 'İşleniyor' : 'Bekliyor'}
                    </span>
                    <svg
                      className={['h-4 w-4 text-muted transition-transform', isSelected ? 'rotate-180' : ''].join(' ')}
                      viewBox="0 0 16 16" fill="none"
                    >
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {isSelected && (
                  <div className="border-t border-border px-5 py-5 space-y-5 bg-background/50">
                    {/* Existing documents */}
                    {docs.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted mb-2">Yüklenen Belgeler</p>
                        <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                          {docs.map((doc) => (
                            <div key={doc.id} className="px-4 py-3 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-medium text-foreground">{DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type}</p>
                                <p className="text-[11px] text-muted mt-0.5">
                                  {new Date(doc.uploaded_at).toLocaleDateString('tr-TR')}
                                  {doc.verified_at && ' · Doğrulandı'}
                                </p>
                              </div>
                              {doc.verified_at ? (
                                <span className="text-[11px] text-green-700 bg-green-50 rounded-full px-2 py-0.5 font-medium">Doğrulandı</span>
                              ) : (
                                <span className="text-[11px] text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 font-medium">İnceleniyor</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload form */}
                    <form onSubmit={(e) => void handleUpload(e)} className="space-y-4">
                      <p className="text-xs font-medium text-muted">Yeni Belge Yükle</p>

                      <div>
                        <label className="block text-xs font-medium text-muted mb-1.5">Belge Türü</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                        >
                          <option value="e_smm">e-Serbest Meslek Makbuzu (e-SMM)</option>
                          <option value="e_fatura">e-Fatura</option>
                          <option value="e_arsiv">e-Arşiv Fatura</option>
                          <option value="other">Diğer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-muted mb-1.5">Dosya (PDF, maks. 10 MB)</label>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => {
                            setFile(e.target.files?.[0] ?? null);
                            setUploadSuccess(false);
                            setUploadError(null);
                          }}
                          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:opacity-90"
                        />
                      </div>

                      {uploadError && (
                        <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-600">{uploadError}</p>
                      )}
                      {uploadSuccess && (
                        <p className="rounded-xl bg-green-50 px-3 py-2.5 text-xs text-green-700">Belge başarıyla yüklendi. İnceleme sonrası onaylanacaktır.</p>
                      )}

                      <button
                        type="submit"
                        disabled={!file || uploading}
                        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
                      >
                        {uploading ? 'Yükleniyor…' : 'Belgeyi Yükle'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
