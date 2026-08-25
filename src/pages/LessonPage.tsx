import { useParams } from "@tanstack/react-router";
import { navigate } from "@/app/router";
import { ROUTES } from "@/app/router";
import { LessonPlayer } from "@/features/lesson";
import { LessonTemplate } from "@/templates/LessonTemplate";

export function LessonPage() {
  const params = useParams({ strict: false });
  const lessonId = params["lessonId"] ?? "leccion-demo";

  return (
    <LessonTemplate
      exercise={
        <LessonPlayer
          sessionId={lessonId}
          onExit={() => navigate(ROUTES.home)}
        />
      }
    />
  );
}

export default LessonPage;
