import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { data, error } = await action;
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (mode === "register" && !data.session) {
      setMessage("Проверьте почту и подтвердите регистрацию.");
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fc] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -left-40 -top-40 size-[500px] rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute -bottom-52 right-0 size-[500px] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 font-mono text-sm font-bold">&lt;/&gt;</div>
          <div>
            <p className="text-lg font-extrabold">devly</p>
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-indigo-300">Interview Lab</p>
          </div>
        </div>
        <div className="relative my-auto max-w-xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-indigo-300">Подготовка, которая работает</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-[-.04em] xl:text-5xl">Репетиция собеседования с обратной связью от AI</h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400">Практикуйте ответы, получайте честную оценку и отслеживайте прогресс до реального интервью.</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[["5", "вопросов за сессию"], ["10 мин", "на первую практику"], ["24/7", "доступ к тренажёру"]].map(([value, label]) => (
              <div key={value} className="border-l border-white/10 pl-4">
                <p className="text-xl font-extrabold">{value}</p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-[10px] text-slate-600">Devly помогает тренироваться и не заменяет решения реального работодателя.</p>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(30,41,59,.08)] sm:p-9">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 font-mono text-xs font-bold text-white">&lt;/&gt;</div>
            <p className="font-extrabold">devly</p>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-indigo-600">{mode === "login" ? "С возвращением" : "Начните подготовку"}</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{mode === "login" ? "Войти в аккаунт" : "Создать аккаунт"}</h2>
          <p className="mt-2 text-xs leading-5 text-slate-400">{mode === "login" ? "Продолжите подготовку с того места, где остановились." : "Все интервью и отчёты будут доступны в вашем профиле."}</p>

          <form className="mt-7 space-y-4" onSubmit={submit}>
            <label className="block text-xs font-bold text-slate-600">Email
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
            </label>
            <label className="block text-xs font-bold text-slate-600">Пароль
              <input required minLength={6} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Не менее 6 символов" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
            </label>
            {message && <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">{message}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60">
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-400">
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }} className="font-extrabold text-indigo-600">
              {mode === "login" ? "Создать" : "Войти"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
