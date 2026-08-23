import type { IconName } from "@/components/ui/atoms/Icon";
import type { StatBadgeProps } from "@/components/ui/molecules/StatBadge";

export type StatsRange = "7d" | "30d" | "90d";

export type DayAccuracy = {
  date: string;
  accuracy: number;
};

export type DayActivity = {
  date: string;
  count: number;
};

export type TopicMastery = {
  id: string;
  name: string;
  mastery: number;
};

export type XpPoint = {
  date: string;
  xp: number;
};

export type StatMetric = {
  label: string;
  value: string;
  tone?: StatBadgeProps["tone"];
  icon?: IconName;
};
