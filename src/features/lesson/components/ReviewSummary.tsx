import { useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { ProgressRing } from "@/components/ui/atoms/ProgressRing";
import { Toast } from "@/components/ui/molecules/Toast";
import { StatBadge } from "@/components/ui/molecules/StatBadge";
import type { Achievement } from "@/features/gamification";
import type { SessionResult } from "../types";
import styles from "./ReviewSummary.module.css";

type ReviewSummaryProps = {
  sessionResult: SessionResult;
  newlyUnlocked?: Achievement[];
  onRetry: () => void;
  onFinish: () => void;
};

export function ReviewSummary({
  sessionResult,
  newlyUnlocked = [],
  onRetry,
  onFinish,
}: ReviewSummaryProps) {
  // BR-M7-11: entre ejercicios, uno a la vez — nunca interrumpe la sesión en curso.
  const [shownIndex, setShownIndex] = useState(0);
  const current = newlyUnlocked[shownIndex];

  return (
    <div className={styles["summary"]}>
      {current !== undefined && (
        <Toast
          message={`Logro desbloqueado: ${current.title}`}
          tone="success"
          onDismiss={() => setShownIndex((i) => i + 1)}
        />
      )}
      <span className={styles["ringWrap"]}>
        <ProgressRing
          value={sessionResult.accuracy}
          size={120}
          tone="gold"
          label={`Precisión ${Math.round(sessionResult.accuracy * 100)}%`}
        />
        <span className={styles["ringLabel"]}>
          {Math.round(sessionResult.accuracy * 100)}%
        </span>
      </span>
      <h2 className={styles["title"]}>
        {sessionResult.correct === sessionResult.total &&
        sessionResult.total > 0
          ? "¡Sesión perfecta!"
          : "Sesión completada"}
      </h2>
      <div className={styles["stats"]}>
        <StatBadge
          label="Aciertos"
          value={sessionResult.correct}
          tone="success"
          icon="check"
        />
        <StatBadge
          label="Saltados"
          value={sessionResult.skipped}
          tone="neutral"
          icon="chevronRight"
        />
        <StatBadge
          label="XP total"
          value={sessionResult.xpAwarded}
          tone="xp"
          icon="zap"
        />
      </div>
      <div className={styles["actions"]}>
        <Button variant="secondary" onPress={onRetry}>
          Repetir sesión
        </Button>
        <Button onPress={onFinish}>Continuar</Button>
      </div>
    </div>
  );
}
