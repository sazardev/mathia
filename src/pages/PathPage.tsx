import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { ProgressRing } from "@/components/ui/atoms/ProgressRing";
import { Skeleton } from "@/components/ui/atoms/Skeleton";
import { Text } from "@/components/ui/atoms/Text";
import { navigate } from "@/app/router";
import { loadPath, type PathLesson, type PathUnit } from "@/features/progress";
import styles from "./shared.module.css";

const badgeByStatus = {
  done: styles["doneBadge"],
  current: styles["currentBadge"],
  locked: styles["lockedBadge"],
} as const;

const iconByStatus = {
  done: "check",
  current: "play",
  locked: "lock",
} as const;

const unitProgress = (lessons: PathLesson[]): number =>
  lessons.filter((lesson) => lesson.status === "done").length /
  Math.max(1, lessons.length);

function PathUnits({ units }: { units: PathUnit[] }) {
  return (
    <>
      {units.map((unit) => (
        <section key={unit.id} className={styles["card"]}>
          <div className={styles["sectionHead"]}>
            <Text as="h2" size="lg" weight="bold">
              {unit.title}
            </Text>
            <ProgressRing
              value={unitProgress(unit.lessons)}
              size={44}
              label={`Progreso de ${unit.title}`}
            />
          </div>
          <div className={styles["stack"]}>
            {unit.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`${styles["row"]} ${styles["spread"]}`}
              >
                <span className={styles["row"]}>
                  <span className={badgeByStatus[lesson.status]}>
                    <Icon name={iconByStatus[lesson.status]} size={16} />
                  </span>
                  <Text as="span" size="sm" weight="semibold">
                    {lesson.title}
                  </Text>
                </span>
                {lesson.status === "locked" ? (
                  <Button variant="ghost" size="sm" disabled>
                    Bloqueada
                  </Button>
                ) : (
                  <Button
                    variant={
                      lesson.status === "current" ? "primary" : "secondary"
                    }
                    size="sm"
                    onPress={() => navigate(`/leccion/${lesson.id}`)}
                  >
                    {lesson.status === "done" ? "Repasar" : "Empezar"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export function PathPage() {
  const [units, setUnits] = useState<PathUnit[] | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const loaded = await loadPath();
      if (alive) setUnits(loaded);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={styles["stack"]}>
      <h1 className={styles["pageTitle"]}>Tu ruta</h1>
      {units === null ? (
        <>
          <Skeleton shape="rect" />
          <Skeleton shape="rect" />
        </>
      ) : (
        <PathUnits units={units} />
      )}
    </div>
  );
}

export default PathPage;
