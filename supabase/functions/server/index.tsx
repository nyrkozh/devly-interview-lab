import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const route = "/make-server-ee213e9f";

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

type User = { id: string; email?: string };

async function getUser(c: any): Promise<User | null> {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email };
}

async function requireUser(c: any) {
  const user = await getUser(c);
  if (!user) return { error: c.json({ error: "Необходима авторизация" }, 401) };
  return { user };
}

async function askOpenAI(system: string, payload: unknown) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error("OpenAI request failed", response.status, message.slice(0, 300));
    throw new Error("Сервис AI временно недоступен");
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI вернул пустой ответ");
  return JSON.parse(content);
}

app.get(`${route}/health`, (c) => c.json({ status: "ok" }));

app.get(`${route}/profile`, async (c) => {
  const auth = await requireUser(c);
  if (auth.error) return auth.error;
  const profile = await kv.get(`profile:${auth.user!.id}`);
  return c.json({
    profile: profile ?? {
      name: auth.user!.email?.split("@")[0] ?? "Кандидат",
      role: "Frontend-разработчик",
      level: "Middle",
      stack: "React / TypeScript",
    },
  });
});

app.put(`${route}/profile`, async (c) => {
  const auth = await requireUser(c);
  if (auth.error) return auth.error;
  const body = await c.req.json();
  const profile = {
    name: String(body.name ?? "").slice(0, 80),
    role: String(body.role ?? "").slice(0, 80),
    level: String(body.level ?? "").slice(0, 40),
    stack: String(body.stack ?? "").slice(0, 120),
  };
  await kv.set(`profile:${auth.user!.id}`, profile);
  return c.json({ profile });
});

app.post(`${route}/interview/start`, async (c) => {
  const auth = await requireUser(c);
  if (auth.error) return auth.error;
  const body = await c.req.json();
  try {
    const result = await askOpenAI(
      `Ты опытный технический интервьюер. Составь ровно 5 вопросов для собеседования на русском языке.
Вопросы должны идти от практического опыта к архитектуре, производительности и командной работе.
Не спрашивай персональные данные. Верни только JSON вида {"questions":["..."]}.`,
      {
        role: body.role || "Frontend-разработчик",
        level: body.level || "Middle",
        stack: body.stack || "React / TypeScript",
      },
    );
    const questions = Array.isArray(result.questions)
      ? result.questions.map(String).filter(Boolean).slice(0, 5)
      : [];
    if (questions.length !== 5) throw new Error("Некорректный набор вопросов");
    return c.json({ questions });
  } catch (error) {
    console.error("Interview generation error", error);
    return c.json({ error: error instanceof Error ? error.message : "Не удалось создать интервью" }, 502);
  }
});

app.post(`${route}/interview/evaluate`, async (c) => {
  const auth = await requireUser(c);
  if (auth.error) return auth.error;
  const body = await c.req.json();
  const questions = Array.isArray(body.questions) ? body.questions.slice(0, 10) : [];
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, 10) : [];
  if (!questions.length || questions.length !== answers.length) {
    return c.json({ error: "Для оценки нужны вопросы и ответы" }, 400);
  }

  try {
    const report = await askOpenAI(
      `Ты оцениваешь техническое интервью программиста. Будь требовательным, но конструктивным.
Верни только JSON: {"score":число_0_100,"summary":"2-3 предложения","strengths":["...","..."],"improvements":["...","..."],"skills":{"technical":0-100,"architecture":0-100,"communication":0-100}}.
Не делай выводов о личности, оценивай только содержание ответов.`,
      {
        role: body.role || "Frontend-разработчик",
        level: body.level || "Middle",
        questions: questions.map((question: string, index: number) => ({
          question,
          answer: String(answers[index] ?? "").slice(0, 8000),
        })),
      },
    );

    const session = {
      id: crypto.randomUUID(),
      userId: auth.user!.id,
      role: String(body.role || "Frontend-разработчик"),
      company: "AI-интервьюер",
      level: String(body.level || "Middle"),
      createdAt: new Date().toISOString(),
      questions,
      answers,
      report: {
        score: Math.max(0, Math.min(100, Number(report.score) || 0)),
        summary: String(report.summary || ""),
        strengths: Array.isArray(report.strengths) ? report.strengths.map(String).slice(0, 5) : [],
        improvements: Array.isArray(report.improvements) ? report.improvements.map(String).slice(0, 5) : [],
        skills: report.skills || {},
      },
    };
    await kv.set(`session:${auth.user!.id}:${session.createdAt}:${session.id}`, session);
    return c.json({ session });
  } catch (error) {
    console.error("Interview evaluation error", error);
    return c.json({ error: error instanceof Error ? error.message : "Не удалось оценить интервью" }, 502);
  }
});

app.get(`${route}/sessions`, async (c) => {
  const auth = await requireUser(c);
  if (auth.error) return auth.error;
  const sessions = await kv.getByPrefix(`session:${auth.user!.id}:`);
  sessions.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return c.json({ sessions });
});

Deno.serve(app.fetch);
