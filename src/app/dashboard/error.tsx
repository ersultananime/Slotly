'use client'

export default function DashboardError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-xl p-8">
    <h1 className="text-2xl font-bold">Не удалось загрузить данные</h1>
    <p role="alert" className="mt-3 text-slate-600">Проверьте соединение и повторите попытку. Если ошибка сохраняется, обратитесь в поддержку: возможно, профиль компании ещё не создан.</p>
    <button onClick={reset} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-white">Повторить попытку</button>
  </main>
}
