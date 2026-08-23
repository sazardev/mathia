import styles from "./OnboardingTemplate.module.css";

type OnboardingTemplateProps = {
  step: React.ReactNode;
  footer: React.ReactNode;
};

export function OnboardingTemplate({ step, footer }: OnboardingTemplateProps) {
  return (
    <div className={styles["layout"]}>
      <div className={styles["step"]}>{step}</div>
      <footer className={styles["footer"]}>{footer}</footer>
    </div>
  );
}
