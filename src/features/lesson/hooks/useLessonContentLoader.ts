import { useEffect, useState } from "react";
import { recordOfflineSessionStart } from "@/features/gamification";
import { getDefaultProfile } from "@/lib/storage";
import { fetchLessonContent } from "../services/sessionService";
import { startSession } from "../stores/sessionStore";
import type { LessonContent } from "../types";

export function useLessonContentLoader(sessionId: string): {
  content: LessonContent | null;
  loadError: string | null;
} {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      setLoadError(null);
      try {
        const lessonContent = await fetchLessonContent(sessionId);
        if (alive) {
          setContent(lessonContent);
          startSession(sessionId, lessonContent.exercises);
          void getDefaultProfile().then((profile) =>
            recordOfflineSessionStart(profile.id),
          );
        }
      } catch (cause) {
        if (alive)
          setLoadError(cause instanceof Error ? cause.message : String(cause));
      }
    })();
    return () => {
      alive = false;
    };
  }, [sessionId]);

  return { content, loadError };
}
