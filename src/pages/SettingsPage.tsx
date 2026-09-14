import { useEffect, useState } from "react";
import { Input } from "@/components/ui/atoms/Input";
import { Skeleton } from "@/components/ui/atoms/Skeleton";
import { Switch } from "@/components/ui/atoms/Switch";
import { Text } from "@/components/ui/atoms/Text";
import { FormField } from "@/components/ui/molecules/FormField";
import { Toast } from "@/components/ui/molecules/Toast";
import { SettingsTemplate } from "@/templates/SettingsTemplate";
import { getDefaultProfile, getStore } from "@/lib/storage";
import {
  applyTheme,
  loadSettings,
  saveSettings,
  type MathiaSettings,
} from "@/features/settings";
import styles from "./shared.module.css";

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

export function SettingsPage() {
  const [profileName, setProfileName] = useState<string | null>(null);
  const [settings, setSettings] = useState<MathiaSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const [loaded, profile] = await Promise.all([
          loadSettings(),
          getDefaultProfile(),
        ]);
        if (!alive) return;
        setSettings(loaded);
        setProfileName(profile.name);
        applyTheme(loaded.theme);
      } catch (cause) {
        if (alive) setError(errorMessage(cause));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const update = (patch: Partial<MathiaSettings>) => {
    if (settings === null) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    applyTheme(next.theme);
    void saveSettings(next).catch((cause: unknown) => {
      setError(errorMessage(cause));
    });
  };

  const saveName = () => {
    const trimmed = profileName?.trim() ?? "";
    if (trimmed === "") {
      setNameError("El nombre no puede estar vacío");
      return;
    }
    setNameError(undefined);
    void (async () => {
      try {
        const store = await getStore();
        const profile = await getDefaultProfile();
        await store.renameProfile(profile.id, trimmed);
      } catch (cause) {
        setError(errorMessage(cause));
      }
    })();
  };

  if (settings === null || profileName === null) {
    return (
      <SettingsTemplate
        title={<h1 className={styles["pageTitle"]}>Ajustes</h1>}
        sections={
          <div className={styles["stack"]}>
            <Skeleton shape="rect" />
            <Skeleton shape="rect" />
            <Skeleton shape="rect" />
          </div>
        }
      />
    );
  }

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
              <FormField
                label="Nombre"
                {...(nameError !== undefined ? { error: nameError } : {})}
              >
                <Input
                  value={profileName}
                  onChange={(value) => {
                    setProfileName(value);
                    if (nameError !== undefined) setNameError(undefined);
                  }}
                  ariaLabel="Nombre del perfil"
                  autoComplete="name"
                  onBlur={saveName}
                />
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
                  checked={settings.theme === "dark"}
                  label="Tema oscuro"
                  onChange={(checked) => {
                    update({ theme: checked ? "dark" : "light" });
                  }}
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
                  checked={settings.sounds}
                  label="Sonidos de acierto"
                  onChange={(checked) => update({ sounds: checked })}
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
          </>
        }
      />
      {error !== null && (
        <Toast message={error} tone="error" onDismiss={() => setError(null)} />
      )}
    </>
  );
}

export default SettingsPage;
