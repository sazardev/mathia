import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/Button";
import { Switch } from "@/components/ui/atoms/Switch";
import { Text } from "@/components/ui/atoms/Text";
import { FormField } from "@/components/ui/molecules/FormField";
import { Input } from "@/components/ui/atoms/Input";
import { Toast } from "@/components/ui/molecules/Toast";
import { SettingsTemplate } from "@/templates/SettingsTemplate";
import styles from "./shared.module.css";

export function SettingsPage() {
  const [name, setName] = useState("Estudiante");
  const [darkTheme, setDarkTheme] = useState(
    document.documentElement.dataset["theme"] === "dark",
  );
  const [sounds, setSounds] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [saved]);

  return (
    <>
      <SettingsTemplate
        title={<h1 className={styles["pageTitle"]}>Ajustes</h1>}
        sections={
          <>
            <section className={styles["card"]}>
              <Text as="h2" size="md" weight="bold">
                Perfil
              </Text>
              <FormField label="Nombre">
                <Input value={name} onChange={setName} />
              </FormField>
            </section>

            <section className={styles["card"]}>
              <Text as="h2" size="md" weight="bold">
                Apariencia
              </Text>
              <div className={`${styles["row"]} ${styles["spread"]}`}>
                <Text as="span" size="sm">
                  Tema oscuro
                </Text>
                <Switch
                  checked={darkTheme}
                  label="Tema oscuro"
                  onChange={setDarkTheme}
                />
              </div>
            </section>

            <section className={styles["card"]}>
              <Text as="h2" size="md" weight="bold">
                Aprendizaje
              </Text>
              <div className={`${styles["row"]} ${styles["spread"]}`}>
                <Text as="span" size="sm">
                  Sonidos de acierto
                </Text>
                <Switch
                  checked={sounds}
                  label="Sonidos de acierto"
                  onChange={setSounds}
                />
              </div>
            </section>

            <section className={styles["card"]}>
              <div className={styles["sectionHead"]}>
                <Text as="h2" size="md" weight="bold">
                  Acerca de
                </Text>
                <Text as="span" size="xs" tone="muted">
                  Mathia v0.1.0
                </Text>
              </div>
            </section>

            <Button
              block
              onPress={() => {
                if (darkTheme) {
                  document.documentElement.dataset["theme"] = "dark";
                } else {
                  delete document.documentElement.dataset["theme"];
                }
                setSaved(true);
              }}
            >
              Guardar cambios
            </Button>
          </>
        }
      />
      {saved && (
        <Toast
          message="Ajustes guardados"
          tone="success"
          onDismiss={() => setSaved(false)}
        />
      )}
    </>
  );
}

export default SettingsPage;
