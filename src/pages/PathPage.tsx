import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { ProgressRing } from "@/components/ui/atoms/ProgressRing";
import { Text } from "@/components/ui/atoms/Text";
import { navigate } from "@/app/router";
import styles from "./shared.module.css";

type PathLesson = {
  id: string;
  title: string;
  status: "done" | "current" | "locked";
};

type Unit = {
  id: string;
  title: string;
  lessons: PathLesson[];
};

const UNITS: Unit[] = [
  {
    id: "u1",
    title: "Unidad 1 · Operaciones básicas",
    lessons: [
      { id: "l1", title: "Sumas y restas", status: "done" },
      { id: "l2", title: "Tablas de multiplicar", status: "done" },
      { id: "l3", title: "Divisiones exactas", status: "current" },
    ],
  },
  {
    id: "u2",
    title: "Unidad 2 · Fracciones",
    lessons: [
      { id: "l4", title: "Qué es una fracción", status: "locked" },
      { id: "l5", title: "Fracciones equivalentes", status: "locked" },
    ],
  },
];

const badgeByStatus = {
  done: styles["doneBadge"],
  current: styles["currentBadge"],
  locked: styles["lockedBadge"],
} as const;

const unitProgress = (lessons: PathLesson[]): number =>
  lessons.filter((lesson) => lesson.status === "done").length /
  Math.max(1, lessons.length);

export function PathPage() {
  return (
    <div className={styles["stack"]}>
      <h1 className={styles["pageTitle"]}>Tu ruta</h1>
      {UNITS.map((unit) => (
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
                    <Icon
                      name={
                        lesson.status === "locked"
                          ? "lock"
                          : lesson.status === "done"
                            ? "check"
                            : "play"
                      }
                      size={16}
                    />
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
    </div>
  );
}

export default PathPage;
