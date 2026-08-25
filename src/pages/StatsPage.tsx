import { useNavigate, useSearch } from "@tanstack/react-router";
import { Text } from "@/components/ui/atoms/Text";
import {
  AccuracyChart,
  MasteryMap,
  MetricSummary,
  StatsPeriodPicker,
  WeeklyHeatmap,
  XpTimeline,
} from "@/features/stats";
import type { StatsRange } from "@/features/stats/types";
import {
  demoAccuracy,
  demoMetrics,
  demoTopics,
  demoWeeks,
  demoXpTimeline,
} from "@/features/stats/demo";
import { StatsTemplate } from "@/templates/StatsTemplate";
import styles from "./shared.module.css";

const RANGES: StatsRange[] = ["7d", "30d", "90d"];

function parseRange(raw: unknown): StatsRange {
  return typeof raw === "string" && (RANGES as string[]).includes(raw)
    ? (raw as StatsRange)
    : "7d";
}

export function StatsPage() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const range = parseRange(search["range"]);

  return (
    <StatsTemplate
      header={
        <>
          <h1 className={styles["pageTitle"]}>Estadísticas</h1>
          <StatsPeriodPicker
            range={range}
            onChangeRange={(next) => {
              void navigate({
                to: "/stats",
                search: { range: next },
              });
            }}
          />
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
