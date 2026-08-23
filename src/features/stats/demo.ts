import type {
  DayAccuracy,
  DayActivity,
  StatsRange,
  StatMetric,
  TopicMastery,
  XpPoint,
} from "./types";

function dayLabel(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function wave(index: number, amplitude: number): number {
  const sine = Math.sin((index / 3) * Math.PI);
  return Math.min(1, Math.max(0, 0.5 + sine * amplitude));
}

const DAYS_IN_RANGE: Record<StatsRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export function demoAccuracy(range: StatsRange): DayAccuracy[] {
  const days = DAYS_IN_RANGE[range];
  return Array.from({ length: days }, (_, i) => ({
    date: dayLabel(days - 1 - i),
    accuracy: 0.55 + wave(i, 0.35) * 0.35,
  }));
}

export function demoWeeks(weeksCount = 8): DayActivity[][] {
  return Array.from({ length: weeksCount }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const globalIndex = week * 7 + day;
      const active = (globalIndex * 13) % 10 > 2;
      return {
        date: dayLabel(weeksCount * 7 - 1 - globalIndex),
        count: active ? 1 + ((globalIndex * 7) % 12) : 0,
      };
    }),
  );
}

export const demoTopics: TopicMastery[] = [
  { id: "m1", name: "Sumas y restas", mastery: 0.92 },
  { id: "m2", name: "Multiplicación", mastery: 0.78 },
  { id: "m3", name: "Divisiones", mastery: 0.64 },
  { id: "m4", name: "Fracciones", mastery: 0.41 },
  { id: "m5", name: "Ecuaciones lineales", mastery: 0.23 },
];

export function demoXpTimeline(range: StatsRange): XpPoint[] {
  const days = DAYS_IN_RANGE[range];
  let cumulative = 0;
  return Array.from({ length: days }, (_, i) => {
    cumulative += 20 + Math.round(wave(i, 40) * 60);
    return { date: dayLabel(days - 1 - i), xp: cumulative };
  });
}

export function demoMetrics(range: StatsRange): StatMetric[] {
  const scale = range === "7d" ? 1 : range === "30d" ? 4 : 11;
  return [
    { label: "XP ganada", value: `${320 * scale}`, tone: "xp", icon: "zap" },
    {
      label: "Precisión",
      value: `${78 + (scale % 7)}%`,
      tone: "success",
      icon: "target",
    },
    {
      label: "Ejercicios",
      value: `${45 * scale}`,
      tone: "primary",
      icon: "check",
    },
    { label: "Racha", value: `${6 + (scale % 3)}`, tone: "gold", icon: "flame" },
  ];
}
