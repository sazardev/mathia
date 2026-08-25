import type { Achievement, LeagueEntry, StreakData, XpProgress } from "./types";

export const demoXpProgress: XpProgress = {
  level: 7,
  xp: 240,
  nextLevelXp: 400,
};

export const demoStreak: StreakData = {
  currentDays: 12,
  bestDays: 21,
  activeToday: true,
  lastSevenDays: [true, true, false, true, true, true, true],
};

const NAMES = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Elena",
  "Fabio",
  "Gina",
  "Hugo",
  "Iris",
  "Joel",
  "Kira",
  "Luis",
  "Mara",
  "Nico",
  "Olga",
  "Paco",
];

export function demoLeague(userXp: number): LeagueEntry[] {
  const entries: LeagueEntry[] = Array.from({ length: 60 }, (_, i) => ({
    id: `league-${i}`,
    name: `${NAMES[i % NAMES.length]} ${i + 1}`,
    xp: 1450 - i * 23,
  }));
  entries.push({ id: "user", name: "Tú", xp: userXp, isUser: true });
  return entries.sort((a, b) => b.xp - a.xp);
}

export const demoAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Primer paso",
    description: "Completa tu primera lección",
    unlocked: true,
  },
  {
    id: "ach-2",
    title: "Racha ígnea",
    description: "Mantén una racha de 7 días",
    unlocked: true,
  },
  {
    id: "ach-3",
    title: "Cazador de XP",
    description: "Acumula 1 000 XP",
    unlocked: true,
  },
  {
    id: "ach-4",
    title: "Sin fallos",
    description: "Sesión perfecta de 10 ejercicios",
    unlocked: false,
    progress: 0.6,
  },
  {
    id: "ach-5",
    title: "Maestro de fracciones",
    description: "Domina el tema de fracciones",
    unlocked: false,
    progress: 0.41,
  },
  {
    id: "ach-6",
    title: "Madrugador",
    description: "Estudia antes de las 8 AM cinco días",
    unlocked: false,
    progress: 0.2,
  },
];
