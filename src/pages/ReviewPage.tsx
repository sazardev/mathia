import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/ui/molecules/EmptyState";
import { navigate, ROUTES } from "@/app/router";
import {
  endSessionNow,
  fetchReviewSession,
  getSessionState,
  LessonExerciseView,
  RescueScreen,
  resolveReviewAnswer,
  ReviewSummary,
  startSession,
  useSessionState,
  type SessionResult,
} from "@/features/lesson";
import { recordSessionCompletion } from "@/features/gamification";
import { getDefaultProfile } from "@/lib/storage";

export function ReviewPage() {
  const [loaded, setLoaded] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const session = useSessionState();
  const xpRecorded = useRef(false);

  useEffect(() => {
    let alive = true;
    xpRecorded.current = false;
    void (async () => {
      const content = await fetchReviewSession();
      if (!alive) return;
      if (content.exercises.length === 0) {
        setEmpty(true);
        setLoaded(true);
        return;
      }
      startSession(`repaso-${retryTick}`, content.exercises);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, [retryTick]);

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

  if (empty) {
    return (
      <EmptyState
        title="Sin repasos pendientes"
        description="No tienes ejercicios vencidos hoy. Vuelve cuando falles alguno o mañana."
        action={{
          label: "Volver al inicio",
          onPress: () => navigate(ROUTES.home),
        }}
      />
    );
  }

  if (!loaded) return null;

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
        onFinish={() => navigate(ROUTES.home)}
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
      onExit={() => navigate(ROUTES.home)}
      onAnswered={(exerciseId, isCorrect) =>
        void resolveReviewAnswer(exerciseId, isCorrect)
      }
    />
  );
}

export default ReviewPage;
