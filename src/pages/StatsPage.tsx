import { useState } from "react";
import { Text } from "@/components/ui/atoms/Text";
import {
  AccuracyChart,
  MasteryMap,
  MetricSummary,
  StatsPeriodPicker,
  WeeklyHeatmap,
  XpTimeline,
} from "@/features/stats";
import {
  demoAccuracy,
  demoMetrics,
  demoTopics,
  demoWeeks,
  demoXpTimeline,
} from "@/features/stats/demo";
import type { StatsRange } from "@/features/stats/types";
import { StatsTemplate } from "@/templates/StatsTemplate";
import styles from "./shared.module.css";

export function StatsPage() {
  const [range, setRange] = useState<StatsRange>("7d");

  return (
    <StatsTemplate
      header={
        <>
          <h1 className={styles["pageTitle"]}>Estadísticas</h1>
          <StatsPeriodPicker range={range} onChangeRange={setRange} />
          <MetricSummary metrics={demoMetrics(range)} />
        </>
      }
      grid={
        <>
          <section className={styles["card"]}>
            <Text as="h2" size="md" weight="bold">
              Precisión por día
            </Text>
            <AccuracyChart series={demoAccuracy(range)} />
          </section>
          <section className={styles["card"]}>
            <Text as="h2" size="md" weight="bold">
              Actividad semanal
            </Text>
            <WeeklyHeatmap weeks={demoWeeks(6)} />
          </section>
          <section className={styles["card"]}>
            <Text as="h2" size="md" weight="bold">
              Dominio por tema
            </Text>
            <MasteryMap topics={demoTopics} />
          </section>
          <section className={styles["card"]}>
            <Text as="h2" size="md" weight="bold">
              XP acumulada
            </Text>
            <XpTimeline points={demoXpTimeline(range)} />
          </section>
        </>
      }
    />
  );
}

export default StatsPage;
