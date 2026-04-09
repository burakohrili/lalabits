export default function RevenuePlaceholderWidget() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3 opacity-60">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">Gelir</p>
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold text-foreground">—</p>
        <p className="text-xs text-muted">Ödeme sistemi henüz aktif değil.</p>
      </div>
    </div>
  );
}
