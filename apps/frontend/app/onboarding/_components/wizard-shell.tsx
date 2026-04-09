'use client';

import { useState } from 'react';
import type { useOnboarding } from '../_hooks/use-onboarding';
import StepProfile from './step-profile';
import StepCategory from './step-category';
import StepPlans from './step-plans';
import StepPayout from './step-payout';
import StepAgreement from './step-agreement';
import StepConfirm from './step-confirm';

type OnboardingHook = ReturnType<typeof useOnboarding>;

interface Props {
  onboarding: OnboardingHook;
  rejectionReason?: string | null;
}

const STEP_LABELS = [
  'Profil',
  'Kategori',
  'Planlar',
  'Ödeme',
  'Sözleşme',
  'Onay',
];

const TOTAL_STEPS = 6;

export default function WizardShell({ onboarding, rejectionReason }: Props) {
  const lastCompleted = onboarding.status!.onboarding_last_step;
  const initialStep = Math.min(lastCompleted + 1, TOTAL_STEPS);
  const [currentStep, setCurrentStep] = useState(Math.max(initialStep, 1));
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  function canGoTo(step: number): boolean {
    if (step < 1 || step > TOTAL_STEPS) return false;
    if (step <= lastCompleted + 1) return true;
    // Step 5 accessible if step 4 complete
    if (step === 5 && lastCompleted >= 4) return true;
    // Step 6 accessible if agreed to terms
    if (step === 6 && agreedToTerms && lastCompleted >= 4) return true;
    return false;
  }

  function goTo(step: number) {
    if (canGoTo(step)) setCurrentStep(step);
  }

  function onNext() {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  }

  function onBack() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10">
      <div className="w-full max-w-xl">
        {/* Rejection reason banner — visible during resubmission */}
        {rejectionReason && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-medium text-amber-800 mb-1">Önceki red gerekçesi</p>
            <p className="text-sm text-amber-900">{rejectionReason}</p>
          </div>
        )}

        {/* Step indicator */}
        <nav className="mb-8">
          <ol className="flex items-center gap-1 overflow-x-auto">
            {STEP_LABELS.map((label, i) => {
              const step = i + 1;
              const isDone = step <= lastCompleted || (step === 5 && agreedToTerms);
              const isCurrent = step === currentStep;
              const isClickable = canGoTo(step);
              return (
                <li key={step} className="flex items-center gap-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => goTo(step)}
                    disabled={!isClickable}
                    className={[
                      'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
                      isCurrent
                        ? 'bg-primary text-white'
                        : isDone
                        ? 'text-primary hover:bg-primary/10 cursor-pointer'
                        : 'text-muted cursor-default',
                    ].join(' ')}
                  >
                    <span className={[
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                      isCurrent ? 'bg-white/20' : isDone ? 'bg-primary/10' : 'bg-muted/10',
                    ].join(' ')}>
                      {step}
                    </span>
                    <span className="hidden sm:inline truncate">{label}</span>
                  </button>
                  {step < TOTAL_STEPS && (
                    <span className="shrink-0 text-border text-xs">›</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          {currentStep === 1 && (
            <StepProfile onboarding={onboarding} onNext={onNext} />
          )}
          {currentStep === 2 && (
            <StepCategory onboarding={onboarding} onNext={onNext} onBack={onBack} />
          )}
          {currentStep === 3 && (
            <StepPlans onboarding={onboarding} onNext={onNext} onBack={onBack} />
          )}
          {currentStep === 4 && (
            <StepPayout onboarding={onboarding} onNext={onNext} onBack={onBack} />
          )}
          {currentStep === 5 && (
            <StepAgreement
              agreed={agreedToTerms}
              onAgreeChange={setAgreedToTerms}
              onNext={onNext}
              onBack={onBack}
            />
          )}
          {currentStep === 6 && (
            <StepConfirm onboarding={onboarding} onBack={onBack} />
          )}
        </div>
      </div>
    </main>
  );
}
