import { useEffect, useState } from "react";
import {
  recordSessionCompletion,
  type Achievement,
} from "@/features/gamification";
import { getDefaultProfile, getStore } from "@/lib/storage";
import type { SessionStatus } from "../stores/sessionStore";

type SaveLessonProgressArgs = {
  sessionId: string;
  status: SessionStatus;
  queueLength: number;
  correctCount: number;
  earnedXp: number;
  allCorrectNoHints: boolean;
};

export function useSaveLessonProgress({
  sessionId,
  status,
  queueLength,
  correctCount,
  earnedXp,
  allCorrectNoHints,
}: SaveLessonProgressArgs): { newlyUnlocked: Achievement[] } {
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    if (status !== "finished") return;
    void (async () => {
      try {
        const store = await getStore();
        const profile = await getDefaultProfile();
        const accuracy = queueLength === 0 ? 1 : correctCount / queueLength;
        const mastery = Math.round(accuracy * 100);
        await store.saveProgress(profile.id, {
          lessonId: sessionId,
          mastery,
          state: "completed",
        });
        await store.flush();
        const result = await recordSessionCompletion(profile.id, {
          earnedXp,
          allCorrectNoHints,
        });
        setNewlyUnlocked(result.newlyUnlocked);
      } catch {
        // Persistencia best-effort
      }
    })();
  }, [
    status,
    queueLength,
    correctCount,
    sessionId,
    earnedXp,
    allCorrectNoHints,
  ]);

  return { newlyUnlocked };
}
