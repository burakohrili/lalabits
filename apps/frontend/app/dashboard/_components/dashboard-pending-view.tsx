export default function DashboardPendingView() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-foreground">Başvurunuz İncelemede</h1>
            <p className="text-sm text-muted">
              Başvurunuz başarıyla alındı. Ekibimiz en kısa sürede inceleyecek ve
              size e-posta yoluyla bildirim gönderecek.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
            İnceleme süreci genellikle 1–3 iş günü sürmektedir.
          </div>
        </div>
      </div>
    </main>
  );
}
