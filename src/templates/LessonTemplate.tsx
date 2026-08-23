import styles from "./LessonTemplate.module.css";

type LessonTemplateProps = {
  topbar?: React.ReactNode;
  exercise: React.ReactNode;
  footerAction?: React.ReactNode;
};

export function LessonTemplate({
  topbar,
  exercise,
  footerAction,
}: LessonTemplateProps) {
  return (
    <div className={styles["layout"]}>
      {topbar !== undefined && <div className={styles["topbar"]}>{topbar}</div>}
      <div className={styles["exercise"]}>{exercise}</div>
      {footerAction !== undefined && (
        <div className={styles["footerAction"]}>{footerAction}</div>
      )}
    </div>
  );
}
