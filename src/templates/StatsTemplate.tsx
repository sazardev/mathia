import styles from "./StatsTemplate.module.css";

type StatsTemplateProps = {
  header: React.ReactNode;
  grid: React.ReactNode;
};

export function StatsTemplate({ header, grid }: StatsTemplateProps) {
  return (
    <div className={styles["layout"]}>
      <div className={styles["header"]}>{header}</div>
      <div className={styles["grid"]}>{grid}</div>
    </div>
  );
}
