export type ThemeSetting = "light" | "dark";
export type DailyGoal = "casual" | "regular" | "intensa";

export type MathiaSettings = {
  theme: ThemeSetting;
  sounds: boolean;
  dailyGoal: DailyGoal;
};

export const DAILY_GOALS: readonly {
  id: DailyGoal;
  label: string;
  detail: string;
}[] = [
  { id: "casual", label: "Casual", detail: "5 min al día" },
  { id: "regular", label: "Regular", detail: "10 min al día" },
  { id: "intensa", label: "Intensa", detail: "20 min al día" },
] as const;
