import { Spinner } from "@/components/ui/atoms/Spinner";
import { EmptyState } from "@/components/ui/molecules/EmptyState";
import { navigate, ROUTES } from "@/app/router";
import { useLessonContentLoader } from "../hooks/useLessonContentLoader";
import { useSaveLessonProgress } from "../hooks/useSaveLessonProgress";
import { enqueueFailureForReview } from "../services/sessionService";
import {
  dismissRescue,
  endSessionNow,
  getSessionState,
  startSession,
  useSessionState,
} from "../stores/sessionStore";
import type { SessionResult } from "../types";
import { LessonExerciseView } from "./LessonExerciseView";
import { LessonIntroScreen } from "./LessonIntroScreen";
import { RescueScreen } from "./RescueScreen";
import { ReviewSummary } from "./ReviewSummary";
import styles from "./LessonPlayer.module.css";

type LessonPlayerProps = {
  sessionId: string;
  step: 1 | 2;
  onStepChange: (next: 1 | 2) => void;
  onExit: () => void;
};

export function LessonPlayer({
  sessionId,
  step,
  onStepChange,
  onExit,
}: LessonPlayerProps) {
  const session = useSessionState();
  const { content, loadError } = useLessonContentLoader(sessionId);

  const allCorrectNoHints =
    session.queue.length > 0 &&
    session.correctCount === session.queue.length &&
    session.skippedCount === 0 &&
    Object.values(session.revealedHints).every((count) => count === 0);

  const { newlyUnlocked } = useSaveLessonProgress({
    sessionId,
    status: session.status,
    queueLength: session.queue.length,
    correctCount: session.correctCount,
    earnedXp: session.earnedXp,
    allCorrectNoHints,
  });

  if (loadError !== null) {
    return (
      <div className={styles["loading"]}>
        <EmptyState
          title="Lección no encontrada"
          description={loadError}
          action={{
            label: "Volver al inicio",
            onPress: () => navigate(ROUTES.home),
          }}
        />
      </div>
    );
  }

  if (session.status === "idle") {
    return (
      <div className={styles["loading"]}>
        <Spinner size={40} />
      </div>
    );
  }

  if (
    content !== null &&
    content.intro !== null &&
    content.guidedPractice !== null &&
    step === 1
  ) {
    return (
      <LessonIntroScreen
        title={content.title}
        intro={content.intro}
        guidedPractice={content.guidedPractice}
        commonMistakes={content.commonMistakes}
        onStart={() => onStepChange(2)}
      />
    );
  }

  if (session.status === "active" && session.rescueActive) {
    return (
      <RescueScreen
        onReviewConcept={
          content?.intro !== null && content?.intro !== undefined
            ? () => {
                dismissRescue();
                onStepChange(1);
              }
            : undefined
        }
        onFinishNow={endSessionNow}
      />
    );
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
        newlyUnlocked={newlyUnlocked}
        onRetry={() => startSession(sessionId, session.queue)}
        onFinish={onExit}
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
      onExit={onExit}
      onAnswered={(exerciseId, isCorrect) => {
        if (!isCorrect) void enqueueFailureForReview(exerciseId);
      }}
    />
  );
}
