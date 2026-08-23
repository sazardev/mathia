import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/atoms/Button";
import { Icon, type IconName } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconName;
  action?: {
    label: string;
    onPress: () => void;
  };
};

export function EmptyState({
  title,
  description,
  icon = "book",
  action,
}: EmptyStateProps) {
  return (
    <div className={styles["empty"]}>
      <span
        className={cn(
          styles["icon"],
          icon === "flame" && styles["flame"],
          icon === "trophy" && styles["gold"],
        )}
      >
        <Icon name={icon} size={28} />
      </span>
      <Text as="h3" size="lg" weight="bold">
        {title}
      </Text>
      {description !== undefined && (
        <Text size="sm" tone="secondary" className={styles["description"]}>
          {description}
        </Text>
      )}
      {action !== undefined && (
        <Button variant="secondary" onPress={action.onPress}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
