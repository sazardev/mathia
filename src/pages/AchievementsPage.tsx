import { AchievementGrid, demoAchievements } from "@/features/gamification";
import styles from "./shared.module.css";

export function AchievementsPage() {
  return (
    <div className={styles["stack"]}>
      <h1 className={styles["pageTitle"]}>Logros</h1>
      <AchievementGrid achievements={demoAchievements} />
    </div>
  );
}

export default AchievementsPage;
