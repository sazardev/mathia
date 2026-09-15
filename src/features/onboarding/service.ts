import { CURRICULUM } from "@/features/content";
import { getStore, type Profile } from "@/lib/storage";
import type { OnboardingStep } from "./types";

const VALID_STEPS: readonly OnboardingStep[] = [
  "bienvenida",
  "perfil",
  "test_nivel",
  "meta",
  "minileccion",
  "completado",
];

function isOnboardingStep(value: string | null): value is OnboardingStep {
  return VALID_STEPS.includes(value as OnboardingStep);
}

/** Sin perfil aún (BR-M9-3 no tiene dónde persistir) ⇒ siempre "bienvenida". */
export async function firstIncompleteProfile(): Promise<{
  profile: Profile | null;
  step: OnboardingStep;
}> {
  const store = await getStore();
  const profiles = await store.listProfiles();
  const profile = profiles[0];
  if (profile === undefined) return { profile: null, step: "bienvenida" };

  const raw = await store.getSetting(profile.id, "onboarding_state");
  // Perfil legado (creado antes de que existiera este flujo) ⇒ ya completo.
  const step = isOnboardingStep(raw) ? raw : "completado";
  return { profile, step };
}

export async function setOnboardingStep(
  profileId: string,
  step: OnboardingStep,
): Promise<void> {
  const store = await getStore();
  await store.setSetting(profileId, "onboarding_state", step);
  await store.flush();
}

/** F1.3: crea el perfil real (BR-M1-4/5) y arranca en "test_nivel". */
export async function createOnboardingProfile(
  name: string,
  avatarIndex: number,
): Promise<Profile> {
  const store = await getStore();
  const trimmed = name.trim().slice(0, 24);
  const profile = await store.createProfile(trimmed, avatarIndex);
  await setOnboardingStep(profile.id, "test_nivel");
  return profile;
}

/**
 * F1.4: el test de nivel recomienda arrancar en `startUnit`; las unidades
 * anteriores se marcan completadas para que `loadPath` (desbloqueo lineal)
 * aterrice ahí sin tocar su lógica. "Empezar desde cero" nunca llama esto.
 */
export async function applyLevelTestUnit(
  profileId: string,
  startUnit: 1 | 2 | 3,
): Promise<void> {
  if (startUnit <= 1) return;
  const store = await getStore();
  const unitsToComplete = CURRICULUM.slice(0, startUnit - 1);
  await Promise.all(
    unitsToComplete.flatMap((unit) =>
      unit.lessons.map((lesson) =>
        store.saveProgress(profileId, {
          lessonId: lesson.id,
          mastery: 1,
          state: "completed",
        }),
      ),
    ),
  );
}
