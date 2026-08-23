export type XpProgress = {
  level: number;
  xp: number;
  nextLevelXp: number;
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
