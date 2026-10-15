import { serverUrl, supabase } from "./supabase";

export type Profile = {
  name: string;
  role: string;
  level: string;
  stack: string;
};

export type InterviewReport = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  skills: Record<string, number>;
};

export type InterviewSession = {
  id: string;
  role: string;
  company: string;
  level: string;
  createdAt: string;
  questions: string[];
  answers: string[];
  report: InterviewReport;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Сессия авторизации истекла");

  const response = await fetch(`${serverUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Ошибка сервера");
  return result;
}

export const api = {
  profile: () => request<{ profile: Profile }>("/profile"),
  saveProfile: (profile: Profile) =>
    request<{ profile: Profile }>("/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),
  startInterview: (profile: Profile) =>
    request<{ questions: string[] }>("/interview/start", {
      method: "POST",
      body: JSON.stringify(profile),
    }),
  evaluateInterview: (payload: {
    role: string;
    level: string;
    questions: string[];
    answers: string[];
  }) =>
    request<{ session: InterviewSession }>("/interview/evaluate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sessions: () => request<{ sessions: InterviewSession[] }>("/sessions"),
};
