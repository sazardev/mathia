import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import { navigate, ROUTES } from "@/app/router";
import {
  DAILY_GOALS,
  DEFAULT_SETTINGS,
  saveSettings,
  type DailyGoal,
} from "@/features/settings";
import { OnboardingTemplate } from "@/templates/OnboardingTemplate";
import styles from "./shared.module.css";

export function OnboardingPage() {
  const search = useSearch({ from: "/onboarding" });
  const navigateFn = useNavigate();
  const step: 1 | 2 = search.step === 2 ? 2 : 1;
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const goToStep = (next: 1 | 2) => {
    void navigateFn({ to: "/onboarding", search: { step: next } });
  };

  const finish = () => {
    if (goal === null) return;
    void (async () => {
      try {
        await saveSettings({ ...DEFAULT_SETTINGS, dailyGoal: goal });
        navigate(ROUTES.home);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    })();
  };

  return (
    <OnboardingTemplate
      step={
        step === 1 ? (
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
        ) : (
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
        )
      }
      footer={
        <>
          {step === 2 && (
            <Button variant="secondary" onPress={() => goToStep(1)}>
              Atrás
            </Button>
          )}
          {step === 1 ? (
            <Button size="lg" onPress={() => goToStep(2)}>
              Empezar
            </Button>
          ) : (
            <Button size="lg" disabled={goal === null} onPress={finish}>
              Listo
            </Button>
          )}
        </>
      }
    />
  );
}

export default OnboardingPage;
