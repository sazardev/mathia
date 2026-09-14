import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import {
  endSessionNow,
  getSessionState,
  LessonExerciseView,
  mapContentExercise,
  RescueScreen,
  ReviewSummary,
  startSession,
  useSessionState,
  type SessionResult,
} from "@/features/lesson";
import { localDayKey, recordSessionCompletion } from "@/features/gamification";
import {
  generatePracticeSet,
  practiceSeed,
  PRACTICE_TOPICS,
  type ExerciseTopic,
} from "@/lib/exercises/generator";
import { getDefaultProfile } from "@/lib/storage";
import styles from "./shared.module.css";
import practiceStyles from "./PracticePage.module.css";

const PRACTICE_SIZE = 8;
const PRACTICE_DIFFICULTY = 2;

function TopicPicker({
  onSelect,
}: {
  onSelect: (topic: ExerciseTopic) => void;
}) {
  return (
    <div className={styles["card"]}>
      <Text as="h1" size="lg" weight="bold">
        Práctica libre
      </Text>
      <Text size="sm" tone="secondary">
        Ejercicios nuevos y aleatorios cada día, generados al momento. No
        afectan tu progreso de las lecciones.
      </Text>
      <div className={practiceStyles["topicGrid"]}>
        {PRACTICE_TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={practiceStyles["topicChip"]}
            onClick={() => onSelect(topic.id)}
          >
            <Icon name="zap" size={20} />
            <span>{topic.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PracticePage() {
  const [topic, setTopic] = useState<ExerciseTopic | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const session = useSessionState();
  const xpRecorded = useRef(false);

  useEffect(() => {
    if (topic === null) return;
    let alive = true;
    xpRecorded.current = false;
    void (async () => {
      const profile = await getDefaultProfile();
      const day = localDayKey(new Date());
      const seed = practiceSeed(profile.id, topic, day) + retryTick;
      const exercises = generatePracticeSet(
        topic,
        seed,
        PRACTICE_SIZE,
        PRACTICE_DIFFICULTY,
      ).map(mapContentExercise);
      if (!alive) return;
      startSession(`practica-${topic}-${day}-${retryTick}`, exercises);
    })();
    return () => {
      alive = false;
    };
  }, [topic, retryTick]);

  useEffect(() => {
    if (session.status !== "finished" || xpRecorded.current) return;
    xpRecorded.current = true;
    void (async () => {
      const profile = await getDefaultProfile();
      const allCorrectNoHints =
        session.queue.length > 0 &&
        session.correctCount === session.queue.length &&
        session.skippedCount === 0 &&
        Object.values(session.revealedHints).every((count) => count === 0);
      await recordSessionCompletion(profile.id, {
        earnedXp: session.earnedXp,
        allCorrectNoHints,
      });
    })();
  }, [session]);

  if (topic === null) {
    return <TopicPicker onSelect={setTopic} />;
  }

  if (session.status === "active" && session.rescueActive) {
    return <RescueScreen onFinishNow={endSessionNow} />;
  }

  const active = getSessionState().queue[session.index];

  if (session.status === "finished" || active === undefined) {
    const total = session.queue.length;
    const result: SessionResult = {
      total,
      correct: session.correctCount,
      skipped: session.skippedCount,
      accuracy: total === 0 ? 1 : session.correctCount / total,
      xpAwarded: session.earnedXp,
    };
    return (
      <ReviewSummary
        sessionResult={result}
        onRetry={() => setRetryTick((tick) => tick + 1)}
        onFinish={() => setTopic(null)}
      />
    );
  }

  const progress =
    ((session.index + (session.lastFeedback !== null ? 1 : 0)) /
      session.queue.length) *
    100;

  return (
    <LessonExerciseView
      active={active}
      progress={progress}
      index={session.index}
      total={session.queue.length}
      revealedCount={session.revealedHints[active.id] ?? 0}
      onExit={() => setTopic(null)}
    />
  );
}

export default PracticePage;
