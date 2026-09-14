import { invoke } from "@tauri-apps/api/core";
import type {
  AchievementRow,
  DailyLogRow,
  MathiaStore,
  Profile,
  ProgressRow,
  SrsItemRow,
} from "@/lib/storage/types";

/**
 * Driver nativo: delega en los comandos Rust (rusqlite).
 * Windows / Linux / macOS / Android / iOS — un solo binario SQLite embebido.
 */
export function createTauriStore(): MathiaStore {
  return {
    kind: "tauri",

    async createProfile(name, avatar) {
      return invoke<Profile>("create_profile", { name, avatar });
    },

    async listProfiles() {
      return invoke<Profile[]>("list_profiles");
    },

    async renameProfile(id, name) {
      await invoke("rename_profile", { id, name });
    },

    async deleteProfile(id) {
      await invoke("delete_profile", { id });
    },

    async saveProgress(profileId, progress) {
      await invoke("save_progress", {
        profileId,
        lessonId: progress.lessonId,
        mastery: progress.mastery,
        state: progress.state,
      });
    },

    async getProgress(profileId) {
      return invoke<ProgressRow[]>("get_progress", { profileId });
    },

    async setSetting(profileId, key, value) {
      await invoke("set_setting", { profileId, key, value });
    },

    async getSetting(profileId, key) {
      const value = await invoke<string | null>("get_setting", {
        profileId,
        key,
      });
      return value ?? null;
    },

    async addDailyXp(profileId, day, xpDelta, goalActive) {
      return invoke<DailyLogRow>("add_daily_xp", {
        profileId,
        day,
        xpDelta,
        goalActive,
      });
    },

    async getDailyLog(profileId, sinceDay) {
      return invoke<DailyLogRow[]>("get_daily_log", {
        profileId,
        sinceDay,
      });
    },

    async unlockAchievement(profileId, achievementId) {
      return invoke<boolean>("unlock_achievement", {
        profileId,
        achievementId,
      });
    },

    async getAchievements(profileId) {
      return invoke<AchievementRow[]>("get_achievements", { profileId });
    },

    async enqueueSrsItem(profileId, exerciseId, intervalDays, dueAt) {
      await invoke("enqueue_srs_item", {
        profileId,
        exerciseId,
        intervalDays,
        dueAt,
      });
    },

    async getSrsQueue(profileId) {
      return invoke<SrsItemRow[]>("get_srs_queue", { profileId });
    },

    async flush() {
      /* Tauri persiste en cada comando; nada que volcar. */
    },
  };
}
