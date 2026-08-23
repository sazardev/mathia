import { KaTeX } from "@/components/ui/atoms/KaTeX";
import { Text } from "@/components/ui/atoms/Text";
import styles from "./ExercisePrompt.module.css";

type ExercisePromptProps = {
  prompt: string;
  tex?: string | undefined;
};

export function ExercisePrompt({ prompt, tex }: ExercisePromptProps) {
  return (
    <div className={styles["promptBox"]}>
      <Text as="h2" size="xl" weight="bold">
        {prompt}
      </Text>
      {tex !== undefined && (
        <span className={styles["texLine"]}>
          <KaTeX tex={tex} displayMode />
        </span>
      )}
    </div>
  );
}
