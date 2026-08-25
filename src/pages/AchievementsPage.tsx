import { Text } from "@/components/ui/atoms/Text";
import {
  AchievementGrid,
  LeagueBoard,
  demoAchievements,
  demoLeague,
} from "@/features/gamification";
import styles from "./shared.module.css";

export function AchievementsPage() {
  return (
    <div className={styles["stack"]}>
      <h1 className={styles["pageTitle"]}>Logros</h1>
      <AchievementGrid achievements={demoAchievements} />
      <section className={styles["card"]}>
        <Text as="h2" size="md" weight="bold">
          Liga Diamante · semana actual
        </Text>
        <Text size="xs" tone="muted">
          Clasificación simulada localmente; los puestos se calculan con tu XP
          semanal.
        </Text>
        <LeagueBoard entries={demoLeague(890)} />
      </section>
    </div>
  );
}

export default AchievementsPage;
