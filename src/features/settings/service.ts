import { getDefaultProfile, getStore } from "@/lib/storage";
import type { DailyGoal, MathiaSettings } from "./types";

export const DEFAULT_SETTINGS: MathiaSettings = {
  theme: "light",
  sounds: true,
  dailyGoal: "regular",
};

const DAILY_GOAL_VALUES: readonly DailyGoal[] = [
  "casual",
  "regular",
  "intensa",
];

function isDailyGoal(value: string | null): value is DailyGoal {
  return DAILY_GOAL_VALUES.includes(value as DailyGoal);
}

export async function loadSettings(): Promise<MathiaSettings> {
  const store = await getStore();
  const profile = await getDefaultProfile();
  const [theme, sounds, dailyGoal] = await Promise.all([
    store.getSetting(profile.id, "theme"),
    store.getSetting(profile.id, "sounds"),
    store.getSetting(profile.id, "daily_goal"),
  ]);
  return {
    theme: theme === "dark" ? "dark" : "light",
    sounds: sounds !== "off",
    dailyGoal: isDailyGoal(dailyGoal) ? dailyGoal : DEFAULT_SETTINGS.dailyGoal,
  };
}

export async function saveSettings(settings: MathiaSettings): Promise<void> {
  const store = await getStore();
  const profile = await getDefaultProfile();
  await Promise.all([
    store.setSetting(profile.id, "theme", settings.theme),
    store.setSetting(profile.id, "sounds", settings.sounds ? "on" : "off"),
    store.setSetting(profile.id, "daily_goal", settings.dailyGoal),
  ]);
  await store.flush();
}

export function applyTheme(theme: MathiaSettings["theme"]): void {
  if (theme === "dark") {
    document.documentElement.dataset["theme"] = "dark";
  } else {
    delete document.documentElement.dataset["theme"];
  }
}
