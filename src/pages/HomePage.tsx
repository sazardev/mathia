import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Icon, type IconName } from "@/components/ui/atoms/Icon";
import { ProgressRing } from "@/components/ui/atoms/ProgressRing";
import { Skeleton } from "@/components/ui/atoms/Skeleton";
import { Text } from "@/components/ui/atoms/Text";
import { cn } from "@/lib/cn";
import { navigate, ROUTES } from "@/app/router";
import {
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
import homeStyles from "./HomePage.module.css";

const UNIT_ACCENTS = [
  "var(--color-primary-500)",
  "var(--color-accent-blue)",
  "var(--color-accent-pink)",
  "var(--color-accent-teal)",
];

const QUICK_TONE_CLASS = {
  primary: homeStyles["tonePrimary"],
  flame: homeStyles["toneFlame"],
  gold: homeStyles["toneGold"],
} as const;

const unitProgress = (unit: PathUnit): number =>
  unit.lessons.filter((lesson) => lesson.status === "done").length /
  Math.max(1, unit.lessons.length);

function UnitStrip({ units }: { units: PathUnit[] }) {
  return (
    <div className={homeStyles["unitStrip"]}>
      {units.map((unit, index) => (
        <button
          key={unit.id}
          type="button"
          className={homeStyles["unitChip"]}
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
          >
            <Icon name={unit.icon} size={16} />
          </ProgressRing>
          <span className={homeStyles["chipLabel"]}>
            {unit.title.replace(/^Unidad \d+ · /, "")}
          </span>
        </button>
      ))}
    </div>
  );
}

type QuickActionProps = {
  icon: IconName;
  label: string;
  badge?: string;
  tone: keyof typeof QUICK_TONE_CLASS;
  onPress: () => void;
};

function QuickAction({ icon, label, badge, tone, onPress }: QuickActionProps) {
  return (
    <button
      type="button"
      className={cn(homeStyles["tile"], homeStyles["quickTile"])}
      onClick={onPress}
    >
      <span className={cn(homeStyles["quickIcon"], QUICK_TONE_CLASS[tone])}>
        <Icon name={icon} size={20} />
      </span>
      <Text as="span" size="sm" weight="bold">
        {label}
      </Text>
      {badge !== undefined && (
        <span className={homeStyles["quickBadge"]}>{badge}</span>
      )}
    </button>
  );
}

function BentoSkeleton() {
  return (
    <div className={homeStyles["bento"]}>
      <div className={cn(homeStyles["tile"], homeStyles["tileHero"])}>
        <Skeleton shape="rect" />
      </div>
      <div className={cn(homeStyles["tile"], homeStyles["tileStreak"])}>
        <Skeleton shape="rect" />
      </div>
      <div className={cn(homeStyles["tile"], homeStyles["tileWide"])}>
        <Skeleton shape="rect" />
      </div>
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
      setAchievements(achievementsView.achievements);
      setDueReviews(due);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const unlockedCount =
    achievements?.filter((achievement) => achievement.unlocked).length ?? 0;

  return (
    <HomeTemplate
      header={
        summary !== null ? <XPHeader progress={summary.xpProgress} /> : null
      }
      content={
        <>
          <h1 className={homeStyles["srOnly"]}>Inicio</h1>
          {loaded && current !== null ? (
            <div className={homeStyles["bento"]}>
              <div className={cn(homeStyles["tile"], homeStyles["tileHero"])}>
                <span className={homeStyles["heroIcon"]}>
                  <Icon name="book" size={22} />
                </span>
                <Text
                  as="span"
                  size="xs"
                  weight="bold"
                  tone="secondary"
                  className={homeStyles["eyebrow"]}
                >
                  Continúa
                </Text>
                <Text
                  as="h2"
                  size="lg"
                  weight="bold"
                  className={homeStyles["heroTitle"]}
                >
                  {current.title}
                </Text>
                <span className={homeStyles["heroMeta"]}>
                  {current.exerciseCount} ejercicios
                </span>
                <Button
                  size="lg"
                  block
                  onPress={() => navigate(`/leccion/${current.id}`)}
                >
                  Continuar
                </Button>
              </div>

              {summary !== null && (
                <div
                  className={cn(homeStyles["tile"], homeStyles["tileStreak"])}
                >
                  <StreakWidget streak={summary.streak} />
                </div>
              )}

              {units !== null && units.length > 0 && (
                <div className={cn(homeStyles["tile"], homeStyles["tileWide"])}>
                  <div className={homeStyles["wideHead"]}>
                    <Text as="h2" size="md" weight="bold">
                      Tu ruta
                    </Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => navigate(ROUTES.path)}
                    >
                      Ver todo
                    </Button>
                  </div>
                  <UnitStrip units={units} />
                </div>
              )}

              <div
                className={cn(homeStyles["tileWide"], homeStyles["quickRow"])}
              >
                {dueReviews > 0 && (
                  <QuickAction
                    icon="refresh"
                    label="Repaso"
                    badge={String(dueReviews)}
                    tone="flame"
                    onPress={() => navigate(ROUTES.review)}
                  />
                )}

                {achievements !== null && (
                  <QuickAction
                    icon="trophy"
                    label="Logros"
                    badge={`${unlockedCount}/${achievements.length}`}
                    tone="gold"
                    onPress={() => navigate(ROUTES.achievements)}
                  />
                )}

                <QuickAction
                  icon="zap"
                  label="Práctica libre"
                  tone="primary"
                  onPress={() => navigate(ROUTES.practice)}
                />
              </div>
            </div>
          ) : (
            <BentoSkeleton />
          )}
        </>
      }
    />
  );
}

export default HomePage;
