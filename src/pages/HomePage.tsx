import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { Skeleton } from "@/components/ui/atoms/Skeleton";
import { Text } from "@/components/ui/atoms/Text";
import { navigate, ROUTES } from "@/app/router";
import {
  StreakWidget,
  XPHeader,
  demoStreak,
  demoXpProgress,
} from "@/features/gamification";
import {
  findCurrentLesson,
  loadPath,
  type PathLesson,
} from "@/features/progress";
import { HomeTemplate } from "@/templates/HomeTemplate";
import styles from "./shared.module.css";

export function HomePage() {
  const [current, setCurrent] = useState<PathLesson | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const units = await loadPath();
      if (!alive) return;
      setCurrent(findCurrentLesson(units));
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <HomeTemplate
      header={<XPHeader progress={demoXpProgress} />}
      content={
        loaded && current !== null ? (
          <>
            <div className={styles["card"]}>
              <div className={styles["sectionHead"]}>
                <Text as="h2" size="lg" weight="bold">
                  Continúa donde lo dejaste
                </Text>
                <span className={styles["row"]}>
                  <Icon name="book" size={20} />
                </span>
              </div>
              <Text size="sm" tone="secondary">
                Lección: {current.title} · {current.exerciseCount} ejercicios
                pendientes
              </Text>
              <Button
                size="lg"
                onPress={() => navigate(`/leccion/${current.id}`)}
              >
                Continuar lección
              </Button>
            </div>

            <div className={styles["card"]}>
              <StreakWidget streak={demoStreak} />
            </div>

            <Button
              variant="secondary"
              block
              onPress={() => navigate(ROUTES.path)}
            >
              Explorar la ruta de aprendizaje
            </Button>
          </>
        ) : (
          <>
            <Skeleton shape="rect" />
            <Skeleton shape="rect" />
          </>
        )
      }
    />
  );
}

export default HomePage;
