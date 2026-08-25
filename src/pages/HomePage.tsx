import { Button } from "@/components/ui/atoms/Button";
import { Icon } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import { navigate, ROUTES } from "@/app/router";
import {
  StreakWidget,
  XPHeader,
  demoStreak,
  demoXpProgress,
} from "@/features/gamification";
import { HomeTemplate } from "@/templates/HomeTemplate";
import styles from "./shared.module.css";

export function HomePage() {
  return (
    <HomeTemplate
      header={<XPHeader progress={demoXpProgress} />}
      content={
        <>
          <div className={styles["card"]}>
            <div className={styles["sectionHead"]}>
              <Text as="h2" size="lg" weight="bold">
                Continúa donde lo dejaste
              </Text>
              <span className={styles["row"]}>
                <Icon name="book" size={20} />
              </span>
            </div>
            <Text size="sm" tone="secondary">
              Lección: Sumas y restas · 4 ejercicios pendientes
            </Text>
            <Button
              size="lg"
              onPress={() => navigate("/leccion/divisiones-exactas")}
            >
              Continuar lección
            </Button>
          </div>

          <div className={styles["card"]}>
            <StreakWidget streak={demoStreak} />
          </div>

          <Button
            variant="secondary"
            block
            onPress={() => navigate(ROUTES.path)}
          >
            Explorar la ruta de aprendizaje
          </Button>
        </>
      }
    />
  );
}

export default HomePage;
