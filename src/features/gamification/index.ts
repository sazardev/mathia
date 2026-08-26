export { AchievementGrid } from "./components/AchievementGrid";
export { LeagueBoard } from "./components/LeagueBoard";
export { StreakWidget } from "./components/StreakWidget";
export { XPHeader } from "./components/XPHeader";
export type { AchievementId } from "./achievements";
export {
  computeStreak,
  evaluateAchievements,
  generateLeague,
  isoWeekKey,
  levelFromXp,
  localDayKey,
  xpForAnswer,
} from "./engine";
export {
  loadAchievementsView,
  loadHomeSummary,
  recordOfflineSessionStart,
  recordSessionCompletion,
} from "./service";
export type { Achievement, LeagueEntry, StreakData, XpProgress } from "./types";
