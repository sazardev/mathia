export type XpProgress = {
  level: number;
  xp: number;
  nextLevelXp: number;
};

/** Anillo de meta diaria de Home (F2.2 BUSINESS-RULES.md): XP de hoy vs meta activa. */
export type DailyGoalProgress = {
  xpToday: number;
  xpGoal: number;
};

export type StreakData = {
  currentDays: number;
  bestDays: number;
  activeToday: boolean;
  lastSevenDays: boolean[];
};

export type LeagueEntry = {
  id: string;
  name: string;
  xp: number;
  isUser?: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
};
