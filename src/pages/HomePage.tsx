import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { ProgressRing } from "@/components/ui/atoms/ProgressRing";
import { Skeleton } from "@/components/ui/atoms/Skeleton";
import { Text } from "@/components/ui/atoms/Text";
import { navigate, ROUTES } from "@/app/router";
import {
  AchievementGrid,
  StreakWidget,
  XPHeader,
  loadAchievementsView,
  loadHomeSummary,
  type Achievement,
  type StreakData,
  type XpProgress,
} from "@/features/gamification";
import { countDueReviews } from "@/features/lesson";
import {
  findCurrentLesson,
  loadPath,
  type PathLesson,
  type PathUnit,
} from "@/features/progress";
import { getDefaultProfile } from "@/lib/storage";
import { HomeTemplate } from "@/templates/HomeTemplate";
import styles from "./shared.module.css";

const UNIT_ACCENTS = [
  "var(--color-primary-500)",
  "var(--color-accent-blue)",
  "var(--color-accent-pink)",
  "var(--color-accent-teal)",
];

const unitProgress = (unit: PathUnit): number =>
  unit.lessons.filter((lesson) => lesson.status === "done").length /
  Math.max(1, unit.lessons.length);

function UnitStrip({ units }: { units: PathUnit[] }) {
  return (
    <div className={styles["unitStrip"]}>
      {units.map((unit, index) => (
        <button
          key={unit.id}
          type="button"
          className={styles["unitChip"]}
          style={{
            ["--chip-accent" as string]:
              UNIT_ACCENTS[index % UNIT_ACCENTS.length],
          }}
          onClick={() => navigate(ROUTES.path)}
        >
          <ProgressRing
            value={unitProgress(unit)}
            size={36}
            label={`Progreso de ${unit.title}`}
          />
          <span className={styles["chipLabel"]}>
            {unit.title.replace(/^Unidad \d+ · /, "")}
          </span>
        </button>
      ))}
    </div>
  );
}

export function HomePage() {
  const [current, setCurrent] = useState<PathLesson | null>(null);
  const [units, setUnits] = useState<PathUnit[] | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [dueReviews, setDueReviews] = useState(0);
  const [summary, setSummary] = useState<{
    xpProgress: XpProgress;
    streak: StreakData;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const profile = await getDefaultProfile();
      const [pathUnits, gamificationSummary, achievementsView, due] =
        await Promise.all([
          loadPath(),
          loadHomeSummary(profile.id),
          loadAchievementsView(profile.id),
          countDueReviews(),
        ]);
      if (!alive) return;
      setCurrent(findCurrentLesson(pathUnits));
      setUnits(pathUnits);
      setSummary(gamificationSummary);
      setAchievements(achievementsView.achievements.slice(0, 3));
      setDueReviews(due);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <HomeTemplate
      header={
        summary !== null ? <XPHeader progress={summary.xpProgress} /> : null
      }
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

            {dueReviews > 0 && (
              <div className={styles["card"]}>
                <div className={styles["sectionHead"]}>
                  <Text as="h2" size="lg" weight="bold">
                    Tienes {dueReviews}{" "}
                    {dueReviews === 1
                      ? "repaso pendiente"
                      : "repasos pendientes"}
                  </Text>
                  <Icon name="refresh" size={20} />
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  onPress={() => navigate(ROUTES.review)}
                >
                  Repasar ahora
                </Button>
              </div>
            )}

            {units !== null && units.length > 0 && (
              <div className={styles["card"]}>
                <Text as="h2" size="lg" weight="bold">
                  Tus unidades
                </Text>
                <UnitStrip units={units} />
              </div>
            )}

            {summary !== null && (
              <div className={styles["card"]}>
                <StreakWidget streak={summary.streak} />
              </div>
            )}

            {achievements !== null && achievements.length > 0 && (
              <div className={styles["card"]}>
                <div className={styles["sectionHead"]}>
                  <Text as="h2" size="lg" weight="bold">
                    Logros
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => navigate(ROUTES.achievements)}
                  >
                    Ver todos
                  </Button>
                </div>
                <AchievementGrid achievements={achievements} />
              </div>
            )}

            <Button
              variant="secondary"
              block
              onPress={() => navigate(ROUTES.path)}
            >
              Explorar la ruta de aprendizaje
            </Button>

            <Button
              variant="ghost"
              block
              onPress={() => navigate(ROUTES.practice)}
            >
              Práctica libre · ejercicios aleatorios
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
