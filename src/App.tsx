import { useMemo, useState } from "react";

type IconName =
  | "dashboard"
  | "interview"
  | "history"
  | "chart"
  | "settings"
  | "help"
  | "bell"
  | "clock"
  | "briefcase"
  | "level"
  | "arrow"
  | "send"
  | "sparkles"
  | "check"
  | "menu"
  | "close";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    interview: (
      <>
        <path d="M4 5h16v11H8l-4 4V5Z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.6 9a2.5 2.5 0 1 1 3.2 2.4c-.8.3-.8 1-.8 1.6M12 17h.01" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    level: (
      <>
        <path d="M4 20v-5M10 20V9M16 20V4M22 20H2" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.1 3.1L16 7.5l-2.9 1.4L12 12l-1.1-3.1L8 7.5l2.9-1.4L12 3Z" />
        <path d="m19 13 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13ZM5 13l.6 1.4L7 15l-1.4.6L5 17l-.6-1.4L3 15l1.4-.6L5 13Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Обзор", icon: "dashboard" },
  { label: "Тренажёр", icon: "interview" },
  { label: "История", icon: "history" },
  { label: "Прогресс", icon: "chart" },
];

const questions = [
  "Расскажите, пожалуйста, о своём опыте работы с React. Какие сложные задачи вам приходилось решать?",
  "Как вы организуете управление состоянием в большом приложении? Приведите пример из практики.",
  "Представьте, что страница загружается слишком медленно. Как бы вы искали и устраняли причину?",
  "Как вы обеспечиваете качество кода и снижаете количество ошибок перед релизом?",
  "Расскажите о техническом решении, с которым команда была не согласна. Как вы действовали?",
];

function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: string;
  onSelect: (label: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <button
          aria-label="Закрыть меню"
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200/80 bg-white px-4 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-9 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_8px_24px_rgba(79,70,229,.25)]">
              <span className="font-mono text-[15px] font-bold tracking-tighter">&lt;/&gt;</span>
            </div>
            <div>
              <p className="text-[17px] font-extrabold tracking-[-0.03em] text-slate-900">devly</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-500">Interview Lab</p>
            </div>
          </div>
          <button className="rounded-lg p-2 text-slate-500 lg:hidden" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Рабочее пространство</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.label === active;
            return (
              <button
                key={item.label}
                onClick={() => {
                  onSelect(item.label);
                  onClose();
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon name={item.icon} className={`size-[19px] ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                {item.label}
                {isActive && <span className="ml-auto size-1.5 rounded-full bg-indigo-500" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-5 rounded-2xl bg-slate-950 p-4 text-white">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white/10 text-violet-300">
              <Icon name="sparkles" className="size-4" />
            </div>
            <p className="text-sm font-bold">Готовы к офферу?</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Пройдите 5 интервью, чтобы открыть персональный отчёт.</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[40%] rounded-full bg-violet-400" />
            </div>
            <p className="mt-2 text-[10px] font-medium text-slate-400">2 из 5 интервью</p>
          </div>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">
            <Icon name="settings" className="size-[19px] text-slate-400" />
            Настройки
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">
            <Icon name="help" className="size-[19px] text-slate-400" />
            Помощь
          </button>
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("Тренажёр");
  const [menuOpen, setMenuOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [answer, setAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const progress = useMemo(() => ((questionIndex + 1) / questions.length) * 100, [questionIndex]);

  function submitAnswer() {
    if (!answer.trim()) return;
    const updated = [...submittedAnswers, answer.trim()];
    setSubmittedAnswers(updated);
    setAnswer("");
    setShowHint(false);
    if (questionIndex === questions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex((current) => current + 1);
    }
  }

  function restart() {
    setQuestionIndex(0);
    setSubmittedAnswers([]);
    setAnswer("");
    setFinished(false);
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fc] text-slate-900">
      <Sidebar
        active={active}
        onSelect={setActive}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Открыть меню"
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <div>
              <p className="hidden text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400 sm:block">Практическая сессия</p>
              <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">Frontend-разработчик</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 sm:flex">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.1)]" />
              Сессия активна
            </div>
            <button aria-label="Уведомления" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
              <Icon name="bell" />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-200 text-xs font-extrabold text-indigo-700">АК</div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold">Алексей К.</p>
                <p className="text-[10px] text-slate-400">Frontend Middle</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-indigo-600">
                <span>Собеседование</span>
                <Icon name="arrow" className="size-3.5 text-slate-300" />
                <span className="text-slate-400">Технический этап</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-[-0.035em] sm:text-[30px]">Покажите, как вы мыслите</h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
                Отвечайте развёрнуто — тренажёр оценит не только знания, но и ход ваших рассуждений.
              </p>
            </div>
            <div className="flex items-center gap-5 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Icon name="clock" className="size-4 text-indigo-500" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Прошло</p>
                  <p className="text-sm font-bold tabular-nums">12:48</p>
                </div>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Прогресс</p>
                <p className="text-sm font-bold">{questionIndex + 1} / {questions.length}</p>
              </div>
            </div>
          </div>

          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
            <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_12px_50px_rgba(30,41,59,.06)]">
              {finished ? (
                <div className="flex min-h-[560px] flex-col items-center justify-center p-8 text-center">
                  <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon name="check" className="size-8" />
                  </div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">Сессия завершена</p>
                  <h3 className="text-2xl font-extrabold tracking-tight">Отличная работа, Алексей</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                    Ответы сохранены. Персональный разбор с сильными сторонами и зонами роста уже формируется.
                  </p>
                  <button
                    onClick={restart}
                    className="mt-7 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                  >
                    Пройти ещё раз
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="flex size-11 items-center justify-center rounded-[14px] bg-slate-900 text-sm font-bold text-white">М</div>
                          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Михаил Воронцов</p>
                          <p className="text-[11px] text-slate-400">Tech Lead · Ozon Tech</p>
                        </div>
                      </div>
                      <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600">AI-интервьюер</span>
                    </div>
                  </div>

                  <div className="min-h-[330px] bg-[radial-gradient(circle_at_80%_0%,rgba(99,102,241,.055),transparent_40%)] px-5 py-7 sm:px-8">
                    <div className="mb-6 flex gap-3">
                      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-slate-900 text-[10px] font-bold text-white">М</div>
                      <div className="max-w-[650px]">
                        <div className="rounded-2xl rounded-tl-md bg-slate-100 px-5 py-4 text-[14px] font-medium leading-7 text-slate-700">
                          {questions[questionIndex]}
                        </div>
                        <p className="mt-2 text-[10px] font-medium text-slate-400">Сейчас</p>
                      </div>
                    </div>

                    {submittedAnswers.length > 0 && (
                      <div className="flex justify-end">
                        <div className="max-w-[620px]">
                          <div className="rounded-2xl rounded-tr-md bg-indigo-600 px-5 py-4 text-[13px] leading-6 text-white">
                            {submittedAnswers.at(-1)}
                          </div>
                          <p className="mt-2 text-right text-[10px] font-medium text-slate-400">Ваш предыдущий ответ</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                    {showHint && (
                      <div className="mb-3 flex gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs leading-relaxed text-violet-800">
                        <Icon name="sparkles" className="mt-0.5 size-4 shrink-0" />
                        Используйте структуру: контекст задачи → ваши действия → измеримый результат → чему вы научились.
                      </div>
                    )}
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_4px_20px_rgba(30,41,59,.04)] transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50">
                      <textarea
                        aria-label="Ваш ответ"
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        onKeyDown={(event) => {
                          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submitAnswer();
                        }}
                        className="min-h-24 w-full resize-none bg-transparent px-2 py-1 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
                        placeholder="Введите ответ так, как отвечали бы на реальном собеседовании..."
                      />
                      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                        <button
                          onClick={() => setShowHint((current) => !current)}
                          className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-bold text-violet-600 hover:bg-violet-50"
                        >
                          <Icon name="sparkles" className="size-4" />
                          <span className="hidden sm:inline">Подсказка к ответу</span>
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="hidden text-[10px] font-medium text-slate-400 sm:block">⌘ + Enter</span>
                          <button
                            onClick={submitAnswer}
                            disabled={!answer.trim()}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                          >
                            Ответить
                            <Icon name="send" className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-center text-[10px] text-slate-400">Не делитесь персональными данными и конфиденциальной информацией</p>
                  </div>
                </>
              )}
            </section>

            <aside className="space-y-4">
              <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Параметры сессии</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <BriefcaseIcon />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400">Специализация</p>
                      <p className="text-xs font-bold">React / TypeScript</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Icon name="level" className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400">Уровень</p>
                      <p className="text-xs font-bold">Middle</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon name="clock" className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400">Длительность</p>
                      <p className="text-xs font-bold">≈ 25 минут</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-[0_12px_30px_rgba(79,70,229,.2)]">
                <div className="flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                    <Icon name="sparkles" className="size-4" />
                  </div>
                  <span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider">Совет</span>
                </div>
                <p className="mt-5 text-sm font-bold">Думайте вслух</p>
                <p className="mt-2 text-[11px] leading-relaxed text-indigo-100">
                  Работодателю важен ход мысли. Объясняйте, почему выбрали конкретный подход и какие альтернативы рассматривали.
                </p>
              </div>

              <button className="w-full rounded-xl py-2 text-xs font-semibold text-slate-400 transition hover:text-rose-500">
                Завершить интервью досрочно
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function BriefcaseIcon() {
  return <Icon name="briefcase" className="size-4" />;
}
