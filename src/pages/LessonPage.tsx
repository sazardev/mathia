import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { navigate } from "@/app/router";
import { ROUTES } from "@/app/router";
import { LessonPlayer } from "@/features/lesson";
import { LessonTemplate } from "@/templates/LessonTemplate";

export function LessonPage() {
  const params = useParams({ strict: false });
  const lessonId = params["lessonId"] ?? "leccion-demo";
  const search = useSearch({ from: "/leccion/$lessonId" });
  const navigateFn = useNavigate();
  const step: 1 | 2 = search.step === 2 ? 2 : 1;

  const goToStep = (next: 1 | 2) => {
    void navigateFn({
      to: "/leccion/$lessonId",
      params: { lessonId },
      search: { step: next },
    });
  };

  return (
    <LessonTemplate
      exercise={
        <LessonPlayer
          sessionId={lessonId}
          step={step}
          onStepChange={goToStep}
          onExit={() => navigate(ROUTES.home)}
        />
      }
    />
  );
}

export default LessonPage;
