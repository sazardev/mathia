import styles from "./SettingsTemplate.module.css";

type SettingsTemplateProps = {
  title: React.ReactNode;
  sections: React.ReactNode;
};

export function SettingsTemplate({ title, sections }: SettingsTemplateProps) {
  return (
    <div className={styles["layout"]}>
      {title}
      <div className={styles["sections"]}>{sections}</div>
    </div>
  );
}
