export type ThemeSetting = "light" | "dark";
export type DailyGoal = "casual" | "regular" | "seria" | "intensa";

export type MathiaSettings = {
  theme: ThemeSetting;
  sounds: boolean;
  dailyGoal: DailyGoal;
};

/** Tiers y XP exactos de BR-M7-10: Casual 20 / Regular 50 / Seria 100 / Intensa 200 XP. */
export const DAILY_GOALS: readonly {
  id: DailyGoal;
  label: string;
  detail: string;
}[] = [
  { id: "casual", label: "Casual", detail: "5 min al día" },
  { id: "regular", label: "Regular", detail: "10 min al día" },
  { id: "seria", label: "Seria", detail: "15 min al día" },
  { id: "intensa", label: "Intensa", detail: "20 min al día" },
] as const;
