import { createDemoData } from "./demo-data";
import type { DemoState } from "./types";
const KEY = "fatesck:demo:v1";
// Apenas dados demonstrativos. Nunca armazenar senhas, tokens ou chaves aqui.
export const demoRepository = {
  load(): DemoState {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createDemoData();
    const data = JSON.parse(raw);
    if (
      !data ||
      !["classes", "activities", "submissions", "messages", "users"].every(
        (k) => Array.isArray(data[k]),
      )
    )
      throw new Error("Dados de demonstração inválidos.");
    return data as DemoState;
  },
  save(data: DemoState) {
    localStorage.setItem(KEY, JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
export function formatDate(value: string) {
  return new Date(
    value.length === 10 ? `${value}T12:00:00` : value,
  ).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
export function isLate(due: string) {
  return new Date(`${due}T23:59:59`).getTime() < Date.now();
}
