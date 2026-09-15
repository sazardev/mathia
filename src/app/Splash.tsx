import styles from "./Splash.module.css";

/** F1.1: logo + lema, <500ms, nada bloqueante. Se muestra mientras el router resuelve el guard de onboarding (beforeLoad). */
export function Splash() {
  return (
    <div className={styles["splash"]}>
      <img src="/favicon.svg" alt="" width={56} height={56} />
      <span className={styles["splashName"]}>Mathia</span>
      <span className={styles["splashTagline"]}>
        Matemáticas a tu ritmo, sin conexión
      </span>
    </div>
  );
}
