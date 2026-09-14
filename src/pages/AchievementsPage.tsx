import { useEffect, useState } from "react";
import { Text } from "@/components/ui/atoms/Text";
import {
  AchievementGrid,
  LeagueBoard,
  loadAchievementsView,
  type Achievement,
  type LeagueEntry,
} from "@/features/gamification";
import { getDefaultProfile } from "@/lib/storage";
import styles from "./shared.module.css";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function AchievementsPage() {
  const [view, setView] = useState<{
    achievements: Achievement[];
    league: LeagueEntry[];
    leagueTier: string;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const profile = await getDefaultProfile();
      const result = await loadAchievementsView(profile.id);
      if (alive) setView(result);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (view === null) {
    return (
      <div className={styles["stack"]}>
        <h1 className={styles["pageTitle"]}>Logros</h1>
      </div>
    );
  }

  return (
    <div className={styles["stack"]}>
      <h1 className={styles["pageTitle"]}>Logros</h1>
      <AchievementGrid achievements={view.achievements} />
      <section className={styles["card"]}>
        <Text as="h2" size="md" weight="bold">
          Liga {capitalize(view.leagueTier)} · semana actual
        </Text>
        <Text size="xs" tone="muted">
          Clasificación simulada localmente; los puestos se calculan con tu XP
          semanal.
        </Text>
        <LeagueBoard entries={view.league} />
      </section>
    </div>
  );
}

export default AchievementsPage;
