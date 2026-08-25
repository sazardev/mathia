import { useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import { navigate, ROUTES } from "@/app/router";
import { OnboardingTemplate } from "@/templates/OnboardingTemplate";
import styles from "./shared.module.css";

const GOALS = [
  { id: "casual", label: "Casual", detail: "5 min al día" },
  { id: "regular", label: "Regular", detail: "10 min al día" },
  { id: "intensa", label: "Intensa", detail: "20 min al día" },
] as const;

type GoalId = (typeof GOALS)[number]["id"];

export function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [goal, setGoal] = useState<GoalId | null>(null);

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
              {GOALS.map((option) => (
                <Button
                  key={option.id}
                  variant={goal === option.id ? "primary" : "secondary"}
                  onPress={() => setGoal(option.id)}
                >
                  {option.label} · {option.detail}
                </Button>
              ))}
            </div>
          </>
        )
      }
      footer={
        <>
          {step === 2 && (
            <Button variant="secondary" onPress={() => setStep(1)}>
              Atrás
            </Button>
          )}
          {step === 1 ? (
            <Button size="lg" onPress={() => setStep(2)}>
              Empezar
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={goal === null}
              onPress={() => navigate(ROUTES.home)}
            >
              Listo
            </Button>
          )}
        </>
      }
    />
  );
}

export default OnboardingPage;
