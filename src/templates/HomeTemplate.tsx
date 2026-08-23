import styles from "./HomeTemplate.module.css";

type HomeTemplateProps = {
  header: React.ReactNode;
  content: React.ReactNode;
  nav?: React.ReactNode;
};

export function HomeTemplate({ header, content, nav }: HomeTemplateProps) {
  return (
    <div className={styles["layout"]}>
      <div className={styles["header"]}>{header}</div>
      <div className={styles["content"]}>{content}</div>
      {nav !== undefined && <nav>{nav}</nav>}
    </div>
  );
}
