export default function SuspendedInfoView() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-foreground">Hesabınız Askıya Alındı</h1>
            <p className="text-sm text-muted">
              Üretici hesabınız askıya alınmıştır. Daha fazla bilgi için destek ekibiyle
              iletişime geçiniz.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
