/* oxlint-disable jsx-a11y/prefer-tag-over-role -- botones de avatar con role="radio", mismo patrón que AnswerChoice */
import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Avatar, AVATAR_COUNT } from "@/components/ui/atoms/Avatar";
import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { Input } from "@/components/ui/atoms/Input";
import { Skeleton } from "@/components/ui/atoms/Skeleton";
import { Text } from "@/components/ui/atoms/Text";
import { FormField } from "@/components/ui/molecules/FormField";
import { navigate } from "@/app/router";
import type { Difficulty } from "@/features/content/schema";
import {
  ExerciseCard,
  mapContentExercise,
  type Exercise,
} from "@/features/lesson";
import {
  applyLevelTestUnit,
  createOnboardingProfile,
  firstIncompleteProfile,
  setOnboardingStep,
  type OnboardingStep,
} from "@/features/onboarding";
import {
  DAILY_GOALS,
  DEFAULT_SETTINGS,
  saveSettings,
  type DailyGoal,
} from "@/features/settings";
import {
  LEVEL_TEST_QUESTION_COUNT,
  LEVEL_TEST_START_DIFFICULTY,
  levelTestTopic,
  mapDifficultyToStartUnit,
  nextLevelTestDifficulty,
} from "@/lib/exercises/level-test";
import { generatePracticeSet } from "@/lib/exercises/generator";
import { CURRICULUM } from "@/features/content";
import { OnboardingTemplate } from "@/templates/OnboardingTemplate";
import styles from "./shared.module.css";
import onboardingStyles from "./OnboardingPage.module.css";

const FIRST_LESSON_ID = CURRICULUM[0]?.lessons[0]?.id ?? "u1-l1";

function ProfileStep({ onDone }: { onDone: (profileId: string) => void }) {
  const [name, setName] = useState("");
  const [avatarIndex, setAvatarIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    if (avatarIndex === null || isSubmitting) return;
    setIsSubmitting(true);
    void (async () => {
      try {
        const profile = await createOnboardingProfile(name, avatarIndex);
        onDone(profile.id);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <>
      <h1 className={styles["pageTitle"]}>Crea tu perfil</h1>
      <Text size="lg" tone="secondary">
        Elige un avatar. El nombre es opcional.
      </Text>
      <FormField label="Nombre (opcional)">
        <Input
          value={name}
          onChange={setName}
          placeholder="Aprendiz"
          ariaLabel="Nombre del perfil"
          autoComplete="name"
        />
      </FormField>
      <div
        className={onboardingStyles["avatarGrid"]}
        role="radiogroup"
        aria-label="Elige tu avatar"
      >
        {Array.from({ length: AVATAR_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={avatarIndex === index}
            className={onboardingStyles["avatarButton"]}
            onClick={() => setAvatarIndex(index)}
          >
            <Avatar index={index} size={56} label={`Avatar ${index + 1}`} />
            {avatarIndex === index && (
              <span className={onboardingStyles["avatarCheck"]}>
                <Icon name="check" size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
      {error !== null && (
        <Text size="sm" tone="secondary">
          No se pudo crear el perfil: {error}. Inténtalo de nuevo.
        </Text>
      )}
      <Button
        size="lg"
        disabled={avatarIndex === null || isSubmitting}
        onPress={submit}
      >
        Continuar
      </Button>
    </>
  );
}

/** Pura salvo por el seed: una pregunta nueva para esa dificultad/ronda. */
function generateLevelTestExercise(
  baseSeed: number,
  round: number,
  difficulty: Difficulty,
): Exercise | null {
  const topic = levelTestTopic(difficulty);
  const [generated] = generatePracticeSet(
    topic,
    baseSeed + round,
    1,
    difficulty,
  ).map(mapContentExercise);
  return generated ?? null;
}

function LevelTestStep({
  onFinished,
}: {
  onFinished: (startUnit: 1 | 2 | 3) => void;
}) {
  const [baseSeed] = useState(() => Date.now());
  const [round, setRound] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    LEVEL_TEST_START_DIFFICULTY,
  );
  const [exercise, setExercise] = useState<Exercise | null>(() =>
    generateLevelTestExercise(baseSeed, 1, LEVEL_TEST_START_DIFFICULTY),
  );

  const handleAnswer = (isCorrect: boolean) => {
    setDifficulty((current) => nextLevelTestDifficulty(current, isCorrect));
  };

  const handleContinue = () => {
    if (round >= LEVEL_TEST_QUESTION_COUNT) {
      onFinished(mapDifficultyToStartUnit(difficulty));
      return;
    }
    const nextRound = round + 1;
    setRound(nextRound);
    setExercise(generateLevelTestExercise(baseSeed, nextRound, difficulty));
  };

  return (
    <>
      <Text size="sm" tone="muted">
        Pregunta {round} de {LEVEL_TEST_QUESTION_COUNT}
      </Text>
      <h1 className={styles["pageTitle"]}>Test de nivel</h1>
      <Text size="md" tone="secondary">
        Responde para que Mathia ubique tu punto de partida.
      </Text>
      {exercise === null ? (
        <Skeleton shape="rect" />
      ) : (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          xpOnCorrect={0}
          onAnswer={handleAnswer}
          onContinue={handleContinue}
        />
      )}
      <Button variant="ghost" onPress={() => onFinished(1)}>
        Empezar desde cero
      </Button>
    </>
  );
}

export function OnboardingPage() {
  const search = useSearch({ from: "/onboarding" });
  const navigateFn = useNavigate();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step: OnboardingStep = search.step ?? "bienvenida";

  const goToStep = (next: Exclude<OnboardingStep, "completado">) => {
    void navigateFn({ to: "/onboarding", search: { step: next } });
  };

  useEffect(() => {
    let alive = true;
    void (async () => {
      const { profile, step: persistedStep } = await firstIncompleteProfile();
      if (!alive) return;
      setProfileId(profile?.id ?? null);
      setLoaded(true);
      // Recarga directa de /onboarding sin ?step= (BR-M9-3): confiar en lo
      // persistido, no reiniciar siempre en "bienvenida".
      if (search.step === undefined && persistedStep !== "completado") {
        goToStep(persistedStep);
      }
    })();
    return () => {
      alive = false;
    };
    // Solo al montar: `search.step`/`goToStep` se leen a propósito una vez.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishMeta = () => {
    if (goal === null || isSubmitting || profileId === null) return;
    setIsSubmitting(true);
    void (async () => {
      try {
        await saveSettings({ ...DEFAULT_SETTINGS, dailyGoal: goal });
        await setOnboardingStep(profileId, "minileccion");
        goToStep("minileccion");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const startMiniLesson = () => {
    if (profileId === null || isSubmitting) return;
    setIsSubmitting(true);
    void (async () => {
      await setOnboardingStep(profileId, "completado");
      navigate(`/leccion/${FIRST_LESSON_ID}`);
    })();
  };

  if (!loaded) {
    return (
      <OnboardingTemplate
        step={<Skeleton shape="rect" />}
        footer={<Skeleton shape="rect" />}
      />
    );
  }

  return (
    <OnboardingTemplate
      step={
        step === "bienvenida" ? (
          <>
            <span className={styles["heroFlame"]}>
              <Icon name="flame" size={64} />
            </span>
            <h1 className={styles["pageTitle"]}>Bienvenido a Mathia</h1>
            <Text size="lg" tone="secondary">
              Aprende matemáticas a tu ritmo, sin conexión y con sesiones cortas
              que respetan tu tiempo.
            </Text>
          </>
        ) : step === "perfil" ? (
          <ProfileStep
            onDone={(id) => {
              setProfileId(id);
              goToStep("test_nivel");
            }}
          />
        ) : step === "test_nivel" ? (
          <LevelTestStep
            onFinished={(startUnit) => {
              void (async () => {
                if (profileId !== null) {
                  await applyLevelTestUnit(profileId, startUnit);
                  await setOnboardingStep(profileId, "meta");
                }
                goToStep("meta");
              })();
            }}
          />
        ) : step === "meta" ? (
          <>
            <h1 className={styles["pageTitle"]}>¿Cuál es tu meta?</h1>
            <Text size="lg" tone="secondary">
              Elige cuánto quieres practicar cada día. Puedes cambiarlo luego.
            </Text>
            <div className={`${styles["stack"]} ${styles["goalsGrid"]}`}>
              {DAILY_GOALS.map((option) => (
                <Button
                  key={option.id}
                  variant={goal === option.id ? "primary" : "secondary"}
                  onPress={() => setGoal(option.id)}
                >
                  {option.label} · {option.detail}
                </Button>
              ))}
            </div>
            {error !== null && (
              <Text size="sm" tone="secondary">
                No se pudo guardar tu meta: {error}. Inténtalo de nuevo.
              </Text>
            )}
          </>
        ) : (
          <>
            <span className={styles["heroFlame"]}>
              <Icon name="play" size={64} />
            </span>
            <h1 className={styles["pageTitle"]}>Tu primera lección</h1>
            <Text size="lg" tone="secondary">
              Vamos a resolverla juntos — cuenta como práctica real, con XP
              real.
            </Text>
          </>
        )
      }
      footer={
        <>
          {step === "bienvenida" && (
            <Button size="lg" onPress={() => goToStep("perfil")}>
              Empezar
            </Button>
          )}
          {step === "meta" && (
            <Button
              size="lg"
              disabled={goal === null || isSubmitting}
              onPress={finishMeta}
            >
              Listo
            </Button>
          )}
          {step === "minileccion" && (
            <Button size="lg" disabled={isSubmitting} onPress={startMiniLesson}>
              Empezar lección
            </Button>
          )}
        </>
      }
    />
  );
}

export default OnboardingPage;
