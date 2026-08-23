import { StatBadge } from "@/components/ui/molecules/StatBadge";
import type { StatMetric } from "../types";
import styles from "./MetricSummary.module.css";

type MetricSummaryProps = {
  metrics: StatMetric[];
};

export function MetricSummary({ metrics }: MetricSummaryProps) {
  return (
    <div className={styles["grid"]}>
      {metrics.map((metric) => (
        <StatBadge
          key={metric.label}
          label={metric.label}
          value={metric.value}
          tone={metric.tone}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
