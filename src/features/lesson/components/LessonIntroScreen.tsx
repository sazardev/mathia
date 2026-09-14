import { Button } from "@/components/ui/atoms/Button";
import { Text } from "@/components/ui/atoms/Text";
import { MathText } from "@/components/ui/molecules/MathText";
import type { GuidedPractice, LessonIntro } from "@/features/content";
import { GuidedPracticeBlock } from "./GuidedPracticeBlock";
import styles from "./LessonIntroScreen.module.css";

type LessonIntroScreenProps = {
  title: string;
  intro: LessonIntro;
  guidedPractice: GuidedPractice;
  commonMistakes: string[];
  onStart: () => void;
};

const STAGGER_MS = 70;

type RevealProps = {
  index: number;
  children: React.ReactNode;
};

function Reveal({ index, children }: RevealProps) {
  return (
    <div
      className={styles["reveal"]}
      style={{ animationDelay: `${index * STAGGER_MS}ms` }}
    >
      {children}
    </div>
  );
}

export function LessonIntroScreen({
  title,
  intro,
  guidedPractice,
  commonMistakes,
  onStart,
}: LessonIntroScreenProps) {
  // El JSX de abajo se evalúa en orden top-to-bottom en una sola pasada,
  // así que este contador produce el orden visual correcto para el stagger.
  let step = 0;

  return (
    <div className={styles["screen"]}>
      <Text as="h2" className={styles["title"]}>
        {title}
      </Text>

      <Reveal index={step++}>
        <Text as="p" className={styles["hook"]}>
          <MathText text={intro.hook} />
        </Text>
      </Reveal>

      <div className={styles["section"]}>
        {intro.intuition.map((paragraph) => (
          <Reveal key={paragraph} index={step++}>
            <Text as="p">
              <MathText text={paragraph} />
            </Text>
          </Reveal>
        ))}
      </div>

      <div className={styles["section"]}>
        <Reveal index={step++}>
          <Text as="span" className={styles["heading"]}>
            Definición
          </Text>
          <Text as="p" weight="semibold">
            <MathText text={intro.definition} />
          </Text>
        </Reveal>
      </div>

      <div className={styles["section"]}>
        <Reveal index={step++}>
          <Text as="span" className={styles["heading"]}>
            Ejemplos resueltos
          </Text>
        </Reveal>
        {intro.workedExamples.map((example) => (
          <Reveal key={example} index={step++}>
            <p className={styles["example"]}>
              <MathText text={example} />
            </p>
          </Reveal>
        ))}
      </div>

      {commonMistakes.length > 0 && (
        <Reveal index={step++}>
          <div className={styles["mistakes"]}>
            <Text as="span" className={styles["heading"]}>
              Errores comunes
            </Text>
            {commonMistakes.map((mistake) => (
              <Text key={mistake} as="p" size="sm">
                <MathText text={mistake} />
              </Text>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal index={step++}>
        <GuidedPracticeBlock guidedPractice={guidedPractice} />
      </Reveal>

      <Button block size="lg" onPress={onStart}>
        Comenzar ejercicios
      </Button>
    </div>
  );
}
