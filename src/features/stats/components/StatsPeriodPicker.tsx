import { Tabs } from "@/components/ui/molecules/Tabs";
import type { StatsRange } from "../types";
import styles from "./StatsPeriodPicker.module.css";

type StatsPeriodPickerProps = {
  range: StatsRange;
  onChangeRange: (range: StatsRange) => void;
};

const PERIOD_ITEMS = [
  { id: "7d", label: "7 días" },
  { id: "30d", label: "30 días" },
  { id: "90d", label: "90 días" },
] as const;

export function StatsPeriodPicker({
  range,
  onChangeRange,
}: StatsPeriodPickerProps) {
  return (
    <div className={styles["picker"]}>
      <Tabs
        items={PERIOD_ITEMS.map((item) => ({ ...item }))}
        value={range}
        onChange={(id) => onChangeRange(id as StatsRange)}
      />
    </div>
  );
}
