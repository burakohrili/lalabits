'use client';

import { useState } from 'react';
import type { useOnboarding, Plan } from '../_hooks/use-onboarding';
import { ApiError } from '@/lib/api-client';

type OnboardingHook = ReturnType<typeof useOnboarding>;

interface Props {
  onboarding: OnboardingHook;
  onNext: () => void;
  onBack: () => void;
}

interface PlanFormState {
  name: string;
  description: string;
  price_monthly_try: string;
}

const EMPTY_FORM: PlanFormState = { name: '', description: '', price_monthly_try: '' };

export default function StepPlans({ onboarding, onNext, onBack }: Props) {
  const plans = onboarding.status!.plans;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEditForm(plan: Plan) {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      description: plan.description ?? '',
      price_monthly_try: String(plan.price_monthly_try),
    });
    setError(null);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handleSavePlan() {
    const price = parseInt(form.price_monthly_try, 10);
    if (!form.name.trim()) {
      setError('Plan adı zorunludur.');
      return;
    }
    if (isNaN(price) || price < 1) {
      setError('Geçerli bir aylık ücret girin (en az 1 TL).');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (editingId) {
        await onboarding.updatePlan(editingId, {
          name: form.name.trim(),
          description: form.description.trim() || null,
          price_monthly_try: price,
        });
      } else {
        const nextTierRank = plans.length + 1;
        await onboarding.createPlan({
          name: form.name.trim(),
          description: form.description.trim() || null,
          price_monthly_try: price,
          tier_rank: nextTierRank,
        });
      }
      cancelForm();
    } catch (err) {
      setError(err instanceof ApiError ? `Hata: ${err.code}` : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Üyelik Planları</h2>
        <p className="text-sm text-muted">
          En az bir üyelik planı oluşturun. İleri gitmek için en az bir plan gereklidir.
        </p>
      </div>

      {/* Plan list */}
      {plans.length > 0 && (
        <ul className="flex flex-col gap-2">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-background"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-foreground truncate">{plan.name}</span>
                <span className="text-xs text-muted">{plan.price_monthly_try} TL / ay</span>
              </div>
              <button
                type="button"
                onClick={() => openEditForm(plan)}
                className="shrink-0 ml-3 text-xs text-primary hover:underline"
              >
                Düzenle
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Inline form */}
      {showForm ? (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            {editingId ? 'Planı Düzenle' : 'Yeni Plan'}
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Plan Adı <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="örn. Temel Üyelik"
              disabled={saving}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Açıklama</label>
            <textarea
              maxLength={500}
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Bu planın avantajlarını kısaca belirtin…"
              disabled={saving}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Aylık Ücret (TL) <span className="text-accent">*</span>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={form.price_monthly_try}
              onChange={(e) => setForm((f) => ({ ...f, price_monthly_try: e.target.value }))}
              placeholder="örn. 50"
              disabled={saving}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelForm}
              disabled={saving}
              className="rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-surface disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSavePlan}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor…' : editingId ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted hover:border-primary/40 hover:text-primary transition-colors text-center"
        >
          + Plan Ekle
        </button>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:bg-background disabled:opacity-50"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={saving || plans.length === 0}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          İleri
        </button>
      </div>
    </div>
  );
}
