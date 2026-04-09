export default function PayoutMissingBanner() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span className="font-medium">Ödeme yöntemi bağlı değil.</span>{' '}
      Kazançlarınızı alabilmek için IBAN bilgilerinizi eklemeniz gerekmektedir.
      Onboarding sırasında bu adımı tamamlayabilirsiniz.
    </div>
  );
}
